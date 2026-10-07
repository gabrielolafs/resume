import { Box3, Vector3 } from 'three';
import type { Object3D } from 'three';
import { navigate } from 'astro:transitions/client';
import { applySlideState, readSlideState } from './slideshow';
import {
    BLACK_FULL_AT, PAGE_FADE_FROM, PAGE_FADE_TO,
    WARM_FRAMES, ZOOM_DURATION, ZOOM_OUT_HOLD_MS
} from './config';
import { layoutPageTrack, updateArrows } from './layout';
import { cellWorldX, pageStride } from './metrics';
import { loadchannel } from './models';
import type { Skips, Stage, ZoomDir } from './types';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

// zoom in: the request starts when the zoom starts, the DOM swap waits for the last frame
let zoomDone: Promise<void> | null = null;
let releaseZoom: () => void = () => {};

document.addEventListener('astro:before-preparation', (e) => {
    const gate = zoomDone;
    if (!gate) return;
    const load = e.loader;
    e.loader = async () => {
        await load();  // fetch + parse, runs while the zoom plays
        await gate;    // then hold until the final zoom frame
    };
});

async function layoutSettled() {
    await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 400))]);
    await new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())));
}

// everything that fades during the zoom
function backgroundLayers(s: Stage): HTMLElement[] {
    return [
        s.canvas,
        document.getElementById('page-track'),
        document.getElementById('arrow-prev'),
        document.getElementById('arrow-next'),
        document.getElementById('bottom-container'),
        document.getElementById('arrow-prev'),
        document.getElementById('arrow-next')
    ].filter(Boolean) as HTMLElement[];
}

// every id that should be effected by the zooming
function magnifiedLayers(s: Stage): HTMLElement[] {
    return [
        s.canvas,
        document.getElementById('page-track'),
        document.getElementById('bottom-container'),
        document.getElementById('arrow-prev'),
        document.getElementById('arrow-next')
    ].filter(Boolean) as HTMLElement[];
}

function viewportOrigin(el: HTMLElement): string {
    const r = el.getBoundingClientRect();
    const t = getComputedStyle(el).transform;
    const m = t && t !== 'none' ? new DOMMatrix(t) : new DOMMatrix();
    return `${-(r.left - m.m41)}px ${-(r.top - m.m42)}px`;
}

function setBackgroundOpacity(s: Stage, value: number) {
    backgroundLayers(s).forEach(el => { el.style.opacity = `${value}`; });
}

function setBackgroundZoom(s: Stage, p: number) {
    const z = s.zoom.state;
    const r = z.cellRect;
    const kx = z.viewW / r.width;
    const ky = z.viewH / r.height;

    const sx = lerp(1, kx, p);
    const sy = lerp(1, ky, p);
    const tx = -r.left * kx * p;
    const ty = -r.top * ky * p;

    magnifiedLayers(s).forEach(el => {
        el.style.translate = `${tx}px ${ty}px`;
        el.style.scale = `${sx} ${sy}`;
    });
}

function clearBackgroundZoom(s: Stage) {
    magnifiedLayers(s).forEach(el => {
        el.style.translate = '';
        el.style.scale = '';
        el.style.transformOrigin = '';
    });
}

// in case we navigated back here mid-fade from a previous zoom
export function resetZoomStage(s: Stage) {
    setBackgroundOpacity(s, 1);
    clearBackgroundZoom(s);
    s.zoom.canvas.style.display = 'none';
}

function makeZoomFrame(slug?: string): HTMLElement {
    const frame = document.createElement('div');
    Object.assign(frame.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: `${window.innerWidth}px`,   // real pixel size, laid out once
        height: `${window.innerHeight}px`,
        transformOrigin: '0 0',            // top left, so translate = where the corner lands
        transform: 'translate(0px, 0px) scale(1, 1)', // first paint is at scale 1, so it gets rastered at full resolution
        opacity: '0.01',                   // not 0: a fully transparent layer may never get painted at all
        willChange: 'transform, opacity',  // own layer. the zoom is then the compositor scaling a finished bitmap, no repaint per frame
        pointerEvents: 'none',
        overflow: 'hidden'
    });

    const tpl = slug ? document.querySelector<HTMLTemplateElement>(`template[data-slug="${slug}"]`) : null;
    if (tpl) frame.appendChild(tpl.content.cloneNode(true));

    // the frame carries the fade now, so the page inside is simply on
    const page = frame.querySelector('.embedded-channel') as HTMLElement | null;
    if (page) page.style.opacity = '1';

    return frame;
}

function makeChromeLayer(anchorEl: HTMLElement, rect: DOMRect): HTMLElement {
    const vw = window.innerWidth, vh = window.innerHeight;

    const layer = document.createElement('div');
    Object.assign(layer.style, {
        position: 'fixed', top: '0', left: '0',
        width: `${vw}px`, height: `${vh}px`,
        transformOrigin: '0 0',
        transform: 'translate(0px, 0px) scale(1, 1)', // rastered at full res, like the frame
        opacity: '0.01',                              // painted but invisible until renderZoom runs
        willChange: 'transform, opacity',
        pointerEvents: 'none', overflow: 'hidden'
    });

    // the whole cell: yellow svg, .grid-wrap (drifting pattern, names), top mask + outline
    const clone = anchorEl.cloneNode(true) as HTMLElement;
    clone.removeAttribute('href');

    // cloneNode restarts every css animation, which is why the slideshow always showed image 0.
    // read where the live cell's slideshow is and stamp it onto the clone before it's inserted
    const slide = readSlideState(anchorEl);
    if (slide) applySlideState(clone, slide);

    Object.assign(clone.style, {
        position: 'absolute', top: '0', left: '0', margin: '0',
        width: `${rect.width}px`, height: `${rect.height}px`,
        transformOrigin: '0 0',
        transform: `scale(${vw / rect.width}, ${vh / rect.height})`,
        visibility: 'visible'
    });

    // the frame carries the sub page, so hide (don't remove) the cell's copy
    const embedded = clone.querySelector<HTMLElement>('.embedded-channel');
    if (embedded) embedded.style.display = 'none';

    layer.append(clone);
    return layer;
}

function placeBehindModels(s: Stage, chrome: HTMLElement) {
    const main = s.main.renderer.domElement;
    const z = parseInt(getComputedStyle(main).zIndex, 10);
    chrome.style.zIndex = Number.isNaN(z) ? '0' : String(z - 1);
    main.parentElement!.insertBefore(chrome, main);
}

function beginZoom(s: Stage, dir: ZoomDir, pageIndex: number, cellIndex: number, anchorEl: HTMLElement, href = '') {
    if (s.flip.active || s.zoom.state.active) return;

    s.zoom.canvas.style.display = 'block'; // moved up: show it before anything is measured

    const rect = anchorEl.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const slug = s.pages[pageIndex]?.[cellIndex]?.url?.split('/').pop();

    // the frame is the only thing that zooms. there is deliberately no copy of the cell left behind
    const frame = makeZoomFrame(slug);
    const chrome = makeChromeLayer(anchorEl, rect);
    s.zoom.cloneLayer.innerHTML = '';
    s.zoom.cloneLayer.append(frame);
    placeBehindModels(s, chrome);

    const blackEl = document.getElementById('zoom-background') as HTMLElement | null;

    // the canvas has to be displayed before we can measure it
    // s.zoom.canvas.style.display = 'block';

    // model endpoints. rest = in the cell, full = centered on the viewport.
    // world units are css px, so positions come from where the canvases actually sit on screen
    // rather than assuming world (0, 0) is the same screen point on both of them
    const group = s.cellGroups[pageIndex]?.[cellIndex] ?? null;
    const offset = s.layout.page * pageStride(s);
    const cr = s.zoom.canvas.getBoundingClientRect();
    const mr = s.main.renderer.domElement.getBoundingClientRect();

    // where the group sits in the MAIN scene. this is what gets handed back at the end
    const mainPos = new Vector3(
        cellWorldX(s, pageIndex, cellIndex, offset),
        group?.position.y ?? 0,
        group?.position.z ?? 0
    );

    // the same screen point, expressed in the ZOOM scene. if the two canvases don't share a center
    // (different height, an offset, a scrollbar) then world (x, y) lands on a different pixel in each,
    // and copying main's position straight over leaves the model a few px off after the handoff
    const restPos = new Vector3(
        mainPos.x + (mr.left + mr.width / 2) - (cr.left + cr.width / 2),
        mainPos.y + (cr.top + cr.height / 2) - (mr.top + mr.height / 2),
        mainPos.z
    );
    const fullPos = new Vector3(
        vw / 2 - (cr.left + cr.width / 2),
        (cr.top + cr.height / 2) - vh / 2,
        restPos.z
    );
    const restScale = group?.scale.x ?? 1;
    const fullScale = restScale * (vh / rect.height);

    s.zoom.state = {
        active: true,
        dir,
        start: -1,
        warm: WARM_FRAMES,
        hold: dir === 'out' ? ZOOM_OUT_HOLD_MS : 0,
        committed: false,
        pageIndex,
        cellIndex,
        cellRect: rect,
        viewW: vw,
        viewH: vh,
        href,
        anchorEl,
        frameEl: frame,
        blackEl,
        chromeEl: chrome,
        group,
        mainPos,
        restPos,
        fullPos,
        restScale,
        fullScale
    };

    if (dir === 'out') {
        commitZoom(s);
        renderZoom(s, 1);
    }
}

// the real cell goes away and the model moves to the zoom stage
function commitZoom(s: Stage) {
    const z = s.zoom.state;
    z.committed = true;

    if (z.anchorEl) z.anchorEl.style.visibility = 'hidden';
    if (z.group) s.zoom.scene.add(z.group); // moves it out of the main scene
    s.zoom.stagedGroup = z.group;

    // own layers while we fade them, so each frame doesn't repaint the whole grid
    backgroundLayers(s).forEach(el => { el.style.willChange = 'opacity'; });

    // the magnified ones also move. measure every pivot first, nothing has been transformed yet,
    // then write, so the reads don't see each other's changes
    const layers = magnifiedLayers(s);
    const origins = layers.map(viewportOrigin);
    layers.forEach((el, i) => {
        el.style.transformOrigin = origins[i];
        el.style.willChange = 'opacity, transform';
    });
}

function startZoomIn(s: Stage, pageIndex: number, cellIndex: number, anchorEl: HTMLAnchorElement, href: string) {
    // beginZoom bails in this case, and the gate would then never be released
    if (s.flip.active || s.zoom.state.active) return;

    zoomDone = new Promise<void>(res => { releaseZoom = res; });
    navigate(href);
    beginZoom(s, 'in', pageIndex, cellIndex, anchorEl, href);
}

// page + cell are already resolved from fromIndex (see resolveArrival). returns false if there's nothing to zoom to
function startZoomOut(s: Stage, page: number, cell: number): boolean {
    const slug = s.pages[page]?.[cell]?.url?.split('/').pop();
    if (!slug) return false;

    // park the track on the destination page BEFORE measuring the cell. snap, don't flip
    s.layout.page = page;
    layoutPageTrack(s, page * pageStride(s));
    updateArrows(s);

    const anchor = document
        .querySelector(`.channel-page[data-page="${page}"]`)
        ?.querySelectorAll<HTMLAnchorElement>('.channel-cell')[cell];
    if (!anchor) return false;

    // synchronous when the model is cached. otherwise it pops in when it arrives, into the zoomed group
    if (s.cellGroups[page]?.[cell]) loadchannel(s, page, cell);

    beginZoom(s, 'out', page, cell, anchor);
    return true;
}

const slugAt = (s: Stage, index: number) =>
    s.pages[Math.floor(index / s.layout.cpp)]?.[index % s.layout.cpp]?.url?.split('/').pop();

// zoom out arrival: stands in for the loading screen while layout settles. it is the same picture the
// zoom starts from (sub page filling the viewport, on black), so beginZoom can swap it for the real
// frame within one task, with no paint in between
function coverForArrival(s: Stage, slug: string) {
    const frame = makeZoomFrame(slug);
    frame.style.opacity = '1';
    s.zoom.cloneLayer.innerHTML = '';
    s.zoom.cloneLayer.append(frame);
    setBackgroundOpacity(s, 0);
    const blackEl = document.getElementById('zoom-background') as HTMLElement | null;
    if (blackEl) blackEl.style.opacity = '1';
}

// only for when there turns out to be nothing to zoom to
function removeArrivalCover(s: Stage) {
    s.zoom.cloneLayer.innerHTML = '';
    setBackgroundOpacity(s, 1);
    const blackEl = document.getElementById('zoom-background') as HTMLElement | null;
    if (blackEl) blackEl.style.opacity = '0';
}

// shows the zoom out if we arrived from a sub page (?fromIndex), otherwise leaves the loading screen alone.
// returns the cell that startZoomOut already loaded, so loadchannels can skip it
export async function resolveArrival(s: Stage): Promise<Skips> {
    const params = new URLSearchParams(location.search);
    let skips: Skips = { page: null, index: null };
    history.replaceState(history.state, '', location.pathname + location.hash);

    if (params.has('fromIndex')) {
        const index = Number(params.get('fromIndex'));
        if (Number.isInteger(index)) {
            const slug = index >= 0 ? slugAt(s, index) : undefined; // message board is index -1

            // cover first, then drop the overlay, both before the first await. the loading screen is never shown on a redirect
            if (slug) coverForArrival(s, slug);
            document.getElementById('loading-overlay')?.remove();

            if (slug) {
                await layoutSettled(); // the cover is what's on screen while we wait
                const page = Math.floor(index / s.layout.cpp);
                const cell = index % s.layout.cpp;
                if (startZoomOut(s, page, cell)) skips = { page, index: cell };
                else removeArrivalCover(s);
            }
        }
    }
    return skips;
}

// click handler for #page-track
export function handleCellClick(s: Stage, e: MouseEvent) {
    const anchor = (e.target as HTMLElement).closest('.channel-cell') as HTMLAnchorElement | null;
    if (!anchor || anchor.classList.contains('is-default-color')) return;

    const pageEl = anchor.closest('.channel-page') as HTMLElement | null;
    if (!pageEl) return;

    const pageIndex = Number(pageEl.dataset.page);
    const cellIndex = Array.from(pageEl.querySelectorAll('.channel-cell')).indexOf(anchor);
    const ch = s.pages[pageIndex]?.[cellIndex];
    if (!ch?.url) return;

    e.preventDefault();
    startZoomIn(s, pageIndex, cellIndex, anchor, anchor.href);
}

function renderZoom(s: Stage, p: number) {
    const z = s.zoom.state;
    const r = z.cellRect;

    // timeline (constants in config.ts): grid -> black, then black -> sub page
    const dark = clamp01(p / BLACK_FULL_AT);
    const page = clamp01((p - PAGE_FADE_FROM) / (PAGE_FADE_TO - PAGE_FADE_FROM));
    const transformation = `translate(${lerp(r.left, 0, p)}px, ${lerp(r.top, 0, p)}px) ` +
        `scale(${lerp(r.width / z.viewW, 1, p)}, ${lerp(r.height / z.viewH, 1, p)})`;

    setBackgroundOpacity(s, 1 - dark); // cells, images, other models, arrows
    setBackgroundZoom(s, p);           // cells, other models: magnified around the clicked cell, same clock
    if (z.blackEl) z.blackEl.style.opacity = `${dark}`;

    if (z.dir === 'out' && z.anchorEl) z.anchorEl.style.visibility = p <= BLACK_FULL_AT ? '' : 'hidden';

    if (z.frameEl) {
        // floor of 0.01 keeps the layer alive and painted while it's "invisible"
        z.frameEl.style.opacity = `${Math.max(page, 0.01)}`;

        // frame: cell rect -> viewport, on the same clock as the model
        z.frameEl.style.transform = transformation;
    }

    if (z.chromeEl) {
        z.chromeEl.style.transform = transformation;
        z.chromeEl.style.opacity = `${1 - page}`;
    }

    const staged = s.zoom.stagedGroup;
    if (staged) {
        staged.position.x = lerp(z.restPos.x, z.fullPos.x, p);
        staged.position.y = lerp(z.restPos.y, z.fullPos.y, p);
        staged.scale.setScalar(lerp(z.restScale, z.fullScale, p));
    }

    s.zoom.renderer.render(s.zoom.scene, s.zoom.camera);
}

export function stepZoom(s: Stage, now: number) {
    const z = s.zoom.state;

    if (z.warm > 0) {
        z.warm--;
        if (z.warm === 0 && !z.committed) { // zoom in: only now does the real cell vanish
            commitZoom(s);
            renderZoom(s, 0);
        }
        return;
    }

    if (z.start < 0) z.start = now + z.hold; // clock starts after the stalls, plus the hold on zoom out

    const t = clamp01((now - z.start) / ZOOM_DURATION);
    renderZoom(s, z.dir === 'in' ? t : 1 - t);

    if (t >= 1) finishZoom(s);
}

// TEMP DEBUG
function screenCenter(rig: Pick<Stage['main'], 'renderer' | 'camera'>, model: Object3D): [number, number] {
    model.updateWorldMatrix(true, true);
    const v = new Box3().setFromObject(model).getCenter(new Vector3()).project(rig.camera);
    const r = rig.renderer.domElement.getBoundingClientRect();
    return [r.left + (v.x + 1) / 2 * r.width, r.top + (1 - v.y) / 2 * r.height];
}

function finishZoom(s: Stage) {
    const z = s.zoom.state;
    z.active = false;

    if (z.dir === 'in') {
        // leave the grid magnified and faded: resetZoomStage cleans up if we come back
        s.zoom.stagedGroup = null;
        releaseZoom();   // lets the already-fetched page swap in
        zoomDone = null;
        return;
    }

    const staged = s.zoom.stagedGroup;
    if (staged) {
        staged.position.copy(z.mainPos); // main scene coordinates, not the zoom scene's restPos
        staged.scale.setScalar(z.restScale);
        s.main.scene.add(staged);
    }
    s.zoom.stagedGroup = null;

    if (z.anchorEl) z.anchorEl.style.visibility = '';
    setBackgroundOpacity(s, 1);
    clearBackgroundZoom(s);
    backgroundLayers(s).forEach(el => { el.style.willChange = ''; });
    if (z.blackEl) z.blackEl.style.opacity = '0';
    if (z.chromeEl) {
        z.chromeEl.style.opacity = '0';
        z.chromeEl.style.zIndex = '-1';
    }
    s.zoom.cloneLayer.innerHTML = '';
    s.zoom.canvas.style.display = 'none';

    // TEMP: remove once the snap is understood
    const live = z.anchorEl?.getBoundingClientRect();
    if (live) console.log('zoom-out drift', {
        top: live.top - z.cellRect.top,
        left: live.left - z.cellRect.left,
        w: live.width - z.cellRect.width,
        h: live.height - z.cellRect.height,
        innerH: window.innerHeight - z.viewH
    });
}
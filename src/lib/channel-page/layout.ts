import { applySlideState, readSlideState } from './slideshow';
import { cellMarkup } from './cell-markup';
import { BLANK_COLOR } from './config';
import { cellMetrics, cellWorldX, pageStride } from './metrics';
import { loadchannels, scaleGroup, teardownModels } from './models';
import type { Channel, Stage, SlideState } from './types';

export function buildPages(cpp: number, chs: Channel[]): Channel[][] {
    const padded = [
        ...chs,
        ...Array.from({ length: Math.max(0, 2 * cpp - chs.length) }, () => ({ // fill rest of page + whole next page with blank
            title: 'static',
            model: {
                color: BLANK_COLOR,
                salt: Math.random(),
                saltBounce: Math.random()
            }
        }))
    ];
    return Array.from({ length: Math.ceil(padded.length / cpp) }, (_, i) =>
        padded.slice(i * cpp, (i + 1) * cpp)
    );
}

export function setup(s: Stage) {
    const { w, h, cellH } = cellMetrics(s);
    const { renderer, camera } = s.main;
    renderer.setSize(w, h);

    camera.left   = -w / 2;
    camera.right  =  w / 2;
    camera.top    =  h / 2;
    camera.bottom = -h / 2;
    camera.updateProjectionMatrix();

    const offset = s.layout.page * pageStride(s);

    s.cellGroups.forEach((page, p) => {
        page.forEach((group, i) => {
            if (i >= s.layout.cpp) {
                group.position.set(-99999, -99999, 0);
                return;
            }
            const row = Math.floor(i / s.layout.cols);
            group.position.set(cellWorldX(s, p, i, offset), h / 2 - (row + 0.5) * cellH, 0);
            scaleGroup(s, p, i);
        });
    });
    renderPageTrack(s);
    layoutPageTrack(s);
}

// only have to account for the cols changing. not the rows
export function switchLayout(s: Stage, initial: boolean = false) {
    const ratio = s.container.clientHeight / s.container.clientWidth;
    const newCols = ratio > 1 ? 2 : 4;
    const newCpp = newCols * s.layout.rows;

    if (newCols === s.layout.cols) return;

    const firstChannelIndex = s.layout.page * s.layout.cpp;

    s.layout.cols = newCols;
    s.layout.cpp = newCpp;

    s.pages = buildPages(s.layout.cpp, s.allChannels);
    s.layout.page = Math.floor(firstChannelIndex / s.layout.cpp);

    if (!initial) {
        teardownModels(s);
        loadchannels(s);
    }
}

export function renderPageTrack(s: Stage) {
    const track = document.getElementById('page-track')!;

    // setup() runs on every resize and rebuilds every cell, which restarts every slideshow at image 0.
    // snapshot each live slideshow (keyed by channel url, so it survives the 2 / 4 column switch) and put it back after
    const saved = new Map<string, SlideState>();
    track.querySelectorAll<HTMLAnchorElement>('.channel-cell').forEach(a => {
        const state = readSlideState(a);
        if (state) saved.set(a.getAttribute('href') ?? '', state);
    });

    track.innerHTML = s.pages.map((pageChannels, p) => `
         <div class="channel-grid channel-page" data-page="${p}"
             style="grid-template-columns:repeat(${s.layout.cols}, 1fr); grid-template-rows:repeat(${s.layout.rows}, 1fr);">
             ${pageChannels.map((ch: Channel) => cellMarkup(ch)).join('')}
         </div>
     `).join('');

    // same task as the rebuild, so it lands before the first paint
    track.querySelectorAll<HTMLAnchorElement>('.channel-cell').forEach(a => {
        const state = saved.get(a.getAttribute('href') ?? '');
        if (state) applySlideState(a, state);
    });
}

export function layoutPageTrack(s: Stage, offset?: number) {
    const stride = pageStride(s);
    const resolvedOffset = offset ?? s.layout.page * stride;
    document.querySelectorAll<HTMLElement>('#page-track .channel-page').forEach((el) => {
        const p = Number(el.dataset.page);
        el.style.transform = `translateX(${p * stride - resolvedOffset}px)`;
    });
}

export function updateArrows(s: Stage) {
    const prev = document.getElementById('arrow-prev') as HTMLButtonElement;
    const next = document.getElementById('arrow-next') as HTMLButtonElement;
    prev.style.visibility = s.layout.page === 0 ? 'hidden' : 'visible';
    next.style.visibility = s.layout.page >= s.pages.length - 1 ? 'hidden' : 'visible';
}

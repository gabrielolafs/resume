import {
    AmbientLight, DirectionalLight, Group, OrthographicCamera, Scene, Vector3, WebGLRenderer
} from 'three';
import { FLIP_DURATION, MAX_PIXEL_RATIO } from './config';
import { buildPages } from './layout';
import type { ChannelLayout, Rig, Stage } from './types';

// one full-screen canvas: renderer + orthographic camera + the two lights
function makeRig(canvas: HTMLCanvasElement, w: number, h: number): Rig {
    const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, MAX_PIXEL_RATIO));

    const scene = new Scene();
    const camera = new OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0.1, 1000);
    camera.position.set(0, 0, 200);
    camera.lookAt(0, 0, 0);
    renderer.setSize(w, h);
    scene.add(camera);

    scene.add(new AmbientLight(0xffffff, 3));
    const directionalLight = new DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    return { renderer, scene, camera };
}

export function createStage(canvas: HTMLCanvasElement): Stage {
    const container = canvas.parentElement!;
    const w0 = container.clientWidth;
    const h0 = container.clientHeight;

    const layout: ChannelLayout = { page: 0, cols: 4, rows: 3, cpp: 12 };
    const allChannels = JSON.parse(canvas.dataset.channels ?? '[]');

    const main = makeRig(canvas, w0, h0);

    // zoom stage: transparent on top and spanning below
    const zoomCanvas = document.getElementById('zoom-canvas') as HTMLCanvasElement;
    const zoomRig = makeRig(zoomCanvas, w0, h0);

    const cellGroups: Group[][] = [];
    for (let p = 0; p < 2; p++) { // min of 2 pages, fill with blanks
        const page: Group[] = [];
        for (let i = 0; i < layout.cols * layout.rows; i++) {
            const g = new Group();
            main.scene.add(g);
            page.push(g);
        }
        cellGroups.push(page);
    }

    return {
        canvas,
        container,
        overlay: document.getElementById('loading-overlay'),
        allChannels,
        layout,
        pages: buildPages(layout.cpp, allChannels),
        pendingPage: 0,
        flip: { active: false, from: 0, to: 1, start: 0, duration: FLIP_DURATION },
        cellGroups,
        main,
        zoom: {
            ...zoomRig,
            canvas: zoomCanvas,
            cloneLayer: document.getElementById('zoom-clone-layer') as HTMLElement,
            stagedGroup: null,
            state: {
                active: false,
                dir: 'in',
                start: -1,
                pageIndex: 0,
                cellIndex: 0,
                cellRect: new DOMRect(),
                viewW: 0,
                viewH: 0,
                href: '',
                anchorEl: null,
                frameEl: null,
                chromeEl: null,
                blackEl: null,
                group: null,
                warm: 0,
                hold: 0,
                committed: false,
                restPos: new Vector3(),
                fullPos: new Vector3(),
                restScale: 1,
                fullScale: 1
            }
        }
    };
}

// the main rig is resized by setup() in layout.ts, the zoom rig needs this on window resize
export function resizeZoomRig(s: Stage) {
    const w = s.container.clientWidth;
    const h = s.container.clientHeight;
    const { renderer, camera } = s.zoom;
    renderer.setSize(w, h);
    camera.left = -w / 2;
    camera.right = w / 2;
    camera.top = h / 2;
    camera.bottom = -h / 2;
    camera.updateProjectionMatrix();
}

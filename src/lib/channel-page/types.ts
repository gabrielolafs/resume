// type-only: every import of this file is `import type`, so it adds nothing to the bundle
import type { Group, OrthographicCamera, Scene, Vector3, WebGLRenderer } from 'three';

// the shape comes from the frontmatter mapping in the .astro file
export type Channel = any;

export interface FlipState {
    active: boolean;
    from: number;
    to: number;
    start: number;
    duration: number;
}

export interface ChannelLayout {
    page: number;
    cols: number;
    rows: number;
    cpp: number; // channels per page
}

export type ZoomDir = 'in' | 'out';

export interface ZoomState {
    active: boolean;
    dir: ZoomDir;
    start: number;              // -1 until the first frame renders, so a janky load doesn't eat the animation
    pageIndex: number;
    cellIndex: number;
    cellRect: DOMRect;          // the cell's rect in viewport px (p = 0)
    viewW: number;              // the frame is laid out at this real pixel size (p = 1)
    viewH: number;
    href: string;
    anchorEl: HTMLElement | null;
    frameEl: HTMLElement | null;
    chromeEl: HTMLElement | null;
    blackEl: HTMLElement | null;  // #zoom-background
    group: Group | null;          // the cell's model group
    warm: number;                 // frames to wait, with nothing visibly moving, before the clock may start
    hold: number;                 // ms to sit on the first pose once the clock starts (zoom out)
    committed: boolean;           // the real cell is hidden and the model has moved to the zoom stage
    restPos: Vector3;             // model endpoints: sitting in the cell (p = 0)
    fullPos: Vector3;             // ...and full screen (p = 1)
    restScale: number;
    fullScale: number;
}

export interface Skips {
    page: number | null;
    index: number | null;
}

// a renderer + scene + camera that share one canvas
export interface Rig {
    renderer: WebGLRenderer;
    scene: Scene;
    camera: OrthographicCamera;
}

// everything the modules used to share through the closure inside astro:page-load
export interface Stage {
    canvas: HTMLCanvasElement;
    container: HTMLElement;
    overlay: HTMLElement | null;
    allChannels: Channel[];
    layout: ChannelLayout;
    pages: Channel[][];
    pendingPage: number;
    flip: FlipState;
    cellGroups: Group[][];
    main: Rig;
    zoom: Rig & {
        canvas: HTMLCanvasElement;
        cloneLayer: HTMLElement;
        state: ZoomState;
        stagedGroup: Group | null; // the model group while it lives on the zoom stage (was `zoomedGroup`)
    };
}

export interface SlideState {
    index: number;    // image that is current
    offset: number;   // seconds into that image's slot (use 0 if all you know is the index)
    perImage: number; // seconds per image, so a copy can't disagree about the timing
    at: number;       // performance.now() when read, so the receiver can account for any delay
}
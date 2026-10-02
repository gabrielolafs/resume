export const MIN_MS_OF_LOADING_SCREEN = 500000;
export const FLIP_DURATION = 600;  // ms, page turn
export const ZOOM_DURATION = 600;  // ms

// zoom timeline (0..1): grid -> black, then black -> sub page
export const BLACK_FULL_AT = 0.4;
export const PAGE_FADE_FROM = 0.3;
export const PAGE_FADE_TO = 1;

// mobile smoothness.
// the zoom waits WARM_FRAMES rendered frames before anything moves, so shader compiles, texture uploads and the
// first paint of the frame land while nothing is animating. zoom out then holds on its first pose (it looks like
// the page you just left) for ZOOM_OUT_HOLD_MS before it starts shrinking
export const WARM_FRAMES = 1;
export const ZOOM_OUT_HOLD_MS = 50;
// both webgl canvases are full screen + antialiased, and phones are 3x. cap it (set to 3 to undo)
export const MAX_PIXEL_RATIO = 1;

// grid
export const PAGE_STRIDE = 0.9;  // how far apart pages sit, as a share of the container width
export const GRID_PAD_X = 0.05;  // side padding, as a share of the container width

// placeholder "static" cells use this color, and cellMarkup / buildPages both key off it
export const BLANK_COLOR = [9, 9, 9];

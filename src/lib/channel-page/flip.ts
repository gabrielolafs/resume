import { FLIP_DURATION } from './config';
import { updateArrows } from './layout';
import { pageStride } from './metrics';
import type { Stage } from './types';

const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

export function startFlip(s: Stage, targetPage: number) {
    if (s.flip.active || s.zoom.state.active || targetPage < 0 || targetPage >= s.pages.length) return;
    const stride = pageStride(s);
    s.flip = {
        active: true,
        from: s.layout.page * stride,
        to: targetPage * stride,
        start: performance.now(),
        duration: FLIP_DURATION
    };
    s.pendingPage = targetPage;
}

// advances the flip by one frame and returns the track offset to draw with
export function stepFlip(s: Stage, t: number): number {
    let offset = s.layout.page * pageStride(s);
    if (!s.flip.active) return offset;

    const raw = Math.min((t - s.flip.start) / s.flip.duration, 1);
    offset = s.flip.from + (s.flip.to - s.flip.from) * easeInOutQuad(raw);
    if (raw >= 1) {
        s.flip.active = false;
        s.layout.page = s.pendingPage;
        updateArrows(s);
    }
    return offset;
}

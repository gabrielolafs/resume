// src/lib/drift.ts
//
// The drifting svg pattern behind a cell's 3d model. One linear, infinite css animation per cell,
// so its whole state is "how many seconds into the cycle are we".

export interface DriftState {
    time: number;     // seconds into the cycle
    duration: number; // seconds per cycle
    at: number;       // performance.now() when read, so the receiver can account for any delay
}

const SELECTOR = '.grid-mover';

const mod = (x: number, m: number) => ((x % m) + m) % m;

/** Markup for the drifting background. `duration` is seconds per cycle. */
export function driftMarkup(
    slug: string,
    animationSvg: string,
    svgDimentions: number[] | undefined,
    duration: number
): string {
    const dims = svgDimentions ?? [1, 1];
    const aspectRatio = dims[0] / dims[1];
    const offSetYTimes = Math.trunc(aspectRatio);

    return `<style>
                @keyframes drift_${slug} {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(${aspectRatio * 2.5}dvh, ${2.5 * offSetYTimes}dvh); }
                }
            </style>
            <div class="grid-mover" 
                style="background-image: url('${animationSvg}'); animation: drift_${slug} ${duration}s linear infinite;"
            >
            </div>`;
}

/**
 * Read how far through its cycle the drift is, from a live cell.
 * Returns null if the cell has no drift, or isn't rendered (display: none has no running animations).
 */
export function readDriftState(root: ParentNode): DriftState | null {
    const el = root.querySelector<HTMLElement>(SELECTOR);
    if (!el) return null;

    const anim = el
        .getAnimations()
        .find((a): a is CSSAnimation => a instanceof CSSAnimation && a.animationName.startsWith('drift_'));
    const timing = anim?.effect?.getComputedTiming();
    if (!anim || !timing || typeof timing.duration !== 'number' || typeof anim.currentTime !== 'number') return null;

    const duration = timing.duration / 1000;
    // active time = current time minus the delay (negative once applyDriftState has run)
    const time = mod((anim.currentTime - Number(timing.delay ?? 0)) / 1000, duration);
    return { time, duration, at: performance.now() };
}

/**
 * Re-stamp a copy (e.g. a cloneNode of the cell) so its drift continues from `state`.
 * Call it before the copy is inserted, or in the same task as the insert.
 */
export function applyDriftState(root: ParentNode, state: DriftState): void {
    const el = root.querySelector<HTMLElement>(SELECTOR);
    if (!el) return;

    const lag = (performance.now() - state.at) / 1000;
    el.style.animationDelay = `-${mod(state.time + lag, state.duration).toFixed(3)}s`;
}

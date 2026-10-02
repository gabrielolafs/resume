import type { SlideState } from "./types";

const FADE = 0.15; // share of a slot spent crossfading

// only the cell's own slideshow, not the hidden sub-page copy inside .embedded-channel
const LAYERS = ".fade-stack:not(.embedded-channel .fade-stack) > .fade-layer";

const BASE_CSS = `
    .fade-stack { position: relative; width: 100%; height: 100%; }
    .fade-layer { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; }
`;

const mod = (x: number, m: number) => ((x % m) + m) % m;

// where the shared clock should be right now, given a state that was read a moment ago
function clockNow(n: number, start?: SlideState): number {
    if (!start) return 0;
    const lag = (performance.now() - start.at) / 1000;
    return mod(start.index * start.perImage + start.offset + lag, start.perImage * n);
}

/** Markup for the slideshow. Pass `start` to begin mid-cycle instead of at image 0. */
export function slideshowMarkup(
    slug: string,
    imgPaths: string[],
    basePerImage: number,
    start?: SlideState
): string {
    const n = imgPaths.length;

    // one image: nothing to fade between (the keyframes below would be out of order)
    if (n === 1) {
        return `<style>${BASE_CSS}</style>
                <div class="fade-stack"><img src="${imgPaths[0]}" class="fade-layer" style="opacity: 1;" /></div>`;
    }

    const perImage = start?.perImage ?? basePerImage; // the state's timing wins over the local salt
    const total = perImage * n;
    const slot = 100 / n;
    const fadeEdge = slot * FADE;
    const T = clockNow(n, start);

    const layers = imgPaths.map((path, i) => {
        const phase = mod(T - i * perImage, total);
        return `<img
                    src="${path}"
                    class="fade-layer"
                    style="animation: fade_${slug} ${total}s ease-in-out infinite; animation-delay: -${phase.toFixed(3)}s;"
                />`;
    }).join("");

    return `<style>
                @keyframes fade_${slug} {
                    0% { opacity: 1; }
                    ${slot - fadeEdge}% { opacity: 1; }
                    ${slot}% { opacity: 0; }
                    ${100 - fadeEdge}% { opacity: 0; }
                    100% { opacity: 1; }
                }
                ${BASE_CSS}
            </style>
            <div class="fade-stack">${layers}</div>`;
}

/**
 * Read which image is showing, and how far through its slot, from a live cell.
 * Returns null if there's nothing to read (no slideshow, or the cell isn't rendered,
 * e.g. display: none, so it has no running animations).
 */
export function readSlideState(root: ParentNode): SlideState | null {
    const layers = root.querySelectorAll<HTMLElement>(LAYERS);
    if (layers.length < 2) return null;

    const anim = layers[0]
        .getAnimations()
        .find((a): a is CSSAnimation => a instanceof CSSAnimation && a.animationName.startsWith("fade_"));
    const timing = anim?.effect?.getComputedTiming();
    if (!anim || !timing || typeof timing.duration !== "number" || typeof anim.currentTime !== "number") return null;

    const total = timing.duration / 1000;
    const perImage = total / layers.length;
    // active time = current time minus the (negative) delay. done by hand instead of reading
    // timing.progress so easing can never skew which image we think is showing
    const T = mod((anim.currentTime - Number(timing.delay ?? 0)) / 1000, total); // layer 0's clock == the shared clock

    const index = Math.min(layers.length - 1, Math.floor(T / perImage));
    return { index, offset: T - index * perImage, perImage, at: performance.now() };
}

/**
 * Re-stamp an existing copy (e.g. a cloneNode of the cell) so it continues from `start`.
 * Call it before the copy is inserted, or in the same task as the insert.
 */
export function applySlideState(root: ParentNode, start: SlideState): void {
    const layers = root.querySelectorAll<HTMLElement>(LAYERS);
    const n = layers.length;
    if (n < 2) return;

    const total = start.perImage * n;
    const T = clockNow(n, start);
    layers.forEach((el, i) => {
        el.style.animationDelay = `-${mod(T - i * start.perImage, total).toFixed(3)}s`;
    });
}

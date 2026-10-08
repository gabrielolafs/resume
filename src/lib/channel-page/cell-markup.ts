import { driftMarkup } from './drift';
import { slideshowMarkup } from './slideshow';
import { BLANK_COLOR } from './config';
import type { Channel } from './types';

// the rounded card outline, used by the fill, the mask cut-out and the outline stroke
const CELL_PATH = `M 1 3
    Q 0 25 1 47
    Q 1.0417 48.9583 3 49
    Q 25 50 47 49
    Q 48.9583 48.9583 49 47
    Q 50 25 49 3
    Q 48.9583 1.0417 47 1
    Q 25 0 3 1
    Q 1.0417 1.0417 1 3
    Z`;

function mulberry32(seed: number) {
    let state = Math.floor(seed * 0xFFFFFFFF) >>> 0;

    return function () {
        state = (state + 0x6D2B79F5) | 0;
        let t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function buildNoiseAnimation(salt: number) {
    const rand = mulberry32(salt);

    const animation = `noise_shift_${salt.toString(36).replace(/\./g, "_")}`;

    const frames = 120;
    const range = 100;       // ±px movement

    const keyframes = [];

    for (let i = 0; i <= frames; i++) {
        const pct = (i / frames) * 100;

        const x = Math.round((rand() * 2 - 1) * range / 2);
        const y = Math.round((rand() * 2 - 1) * range);

        keyframes.push(`${pct}%{transform:translate(${x}px,${y}px);}`);
        keyframes.push(`${pct - (1 / frames) * 100 + .00001}%{transform:translate(${x}px,${y}px);}`);
    }

    return `
        <style>
        @keyframes ${animation}{
        ${keyframes.join("")}
        }
        </style>

        <div class="little-logo">
            GGO
        </div>

        <div
            class="static-noise"
            style="animation: ${animation} linear 15s infinite;">
        </div>
        `;
}

// experimenting with different timing from the salt, not 100% sold atm. maybe if i can get some ts that reads the size of the images and uses that to have
function buildChannelSection(salt: number, title: string, animationSvg: string, svgDimentions: number[] | undefined, imgPaths: string[]) {
    const slug = title.replaceAll(/[^a-zA-Z0-9\-._~]/g, "_"); // all url un safe chars
    const highlightedTitle = `
                <div class="channel-name" style="-webkit-text-stroke-width: 8px; -webkit-text-stroke-color: black;">
                    ${title}
                </div>
                <div class="channel-name">
                    ${title}
                </div>`;

    // no images, fall back to the drifting background svg (lib/drift.ts)
    if (imgPaths.length === 0) {
        return driftMarkup(slug, animationSvg, svgDimentions, 4 + salt) + highlightedTitle;
    }

    // images present: crossfade slideshow (timing, ordering and phase live in lib/slideshow.ts)
    return slideshowMarkup(slug, imgPaths, 4 + salt) + highlightedTitle;
}

// note: the embedded channel no longer lives in every cell. the zoom builds one full-size frame
// from the <template> on demand (see makeZoomFrame in zoom.ts)
export function cellMarkup(ch: Channel): string {
    const isDefaultColor = ch.model.color.every((v: number, i: number) => v === BLANK_COLOR[i]);

    return `
        <a class="channel-cell${isDefaultColor ? ' is-default-color' : ''}" href="${ch.url || '#'}" ${isDefaultColor ? `style="pointer-events: none;"` : ''}>
            <svg viewBox="0 0 50 50" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="${CELL_PATH}"
                    fill="rgb(${ch.model.color[0]}, ${ch.model.color[1]}, ${ch.model.color[2]})"
                    stroke="none"
                />
            </svg>
            <div class="grid-wrap">

            ${isDefaultColor
                ? buildNoiseAnimation(ch.model.salt)
                : buildChannelSection(ch.model.salt, ch.title, ch.animationSvg, ch.animationSvgDimentions, ch.imgPaths)
            }

            </div>

            <svg viewBox="0 0 50 50" preserveAspectRatio="none" width="100%" height="100%">
                <defs>
                    <mask id="mask01">
                        <rect width="100" height="100" fill="white"/>
                        <path d="${CELL_PATH}" fill="black"/>
                    </mask>
                </defs>
                <g mask="url(#mask01)">
                    <path fill="var(--wii-background)" fill-opacity="1"
                    d="M -100 -100
                    L200 -100
                    L200 100
                    L-100 100
                    Z" /> 
                </g>
                <path
                    class="cell-outline"
                    d="${CELL_PATH}"
                    fill="none"
                    stroke="#afafaf"
                    stroke-width=".8"
                />
            </svg>
        </a>
    `;
}

import { GRID_PAD_X, PAGE_STRIDE } from './config';
import type { Stage } from './types';

export function cellMetrics(s: Stage) {
    const w = s.container.clientWidth;
    const h = s.container.clientHeight;
    const padX = w * GRID_PAD_X;
    const cellW = (w - padX * 2) / s.layout.cols;
    const cellH = h / s.layout.rows;
    return { w, h, padX, cellW, cellH };
}

// distance between the left edges of two neighbouring pages, in px
export const pageStride = (s: Stage) => s.container.clientWidth * PAGE_STRIDE;

// a cell group's x. shared by the render loop and the zoom endpoints so they can't drift apart
export function cellWorldX(s: Stage, pageIndex: number, cellIndex: number, offset: number) {
    const { w, padX, cellW } = cellMetrics(s);
    const col = cellIndex % s.layout.cols;
    return pageIndex * w * PAGE_STRIDE + padX + (col + 0.5) * cellW - w / 2 - offset;
}

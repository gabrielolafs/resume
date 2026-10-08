import { startFlip, stepFlip } from './flip';
import { layoutPageTrack, setup, switchLayout, updateArrows } from './layout';
import { idleAnimate, loadchannels, positionCells } from './models';
import { createStage, resizeZoomRig } from './stage';
import { handleCellClick, resetZoomStage, resolveArrival, stepZoom } from './zoom';

export async function initChannelPage() {
    document.addEventListener('astro:page-load', async () => {
        const canvas = document.getElementById('three-canvas') as HTMLCanvasElement | null;
        if (!canvas) return;

        const s = createStage(canvas);

        let disposed = false;
        let frameId = 0;

        const onResize = () => {
            switchLayout(s);
            setup(s);
            resizeZoomRig(s);
        };
        window.addEventListener('resize', onResize);

        // registered before the await: this page's canvas is about to be swapped out, so stop its loop
        // and listener. without this every visit to the grid leaves another render loop running against
        // a canvas that's gone
        document.addEventListener('astro:before-swap', () => {
            disposed = true;
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', onResize);
        }, { once: true });

        resetZoomStage(s);
        switchLayout(s, true);
        setup(s);

        const skips = await resolveArrival(s); // zoom out if we came from a sub page, returns the cell it already loaded
        if (disposed) return;                  // navigated away while we were waiting for layout to settle

        loadchannels(s, skips);
        updateArrows(s);

        frameId = requestAnimationFrame(animate);

        document.getElementById('arrow-prev')?.addEventListener('click', () => startFlip(s, s.layout.page - 1));
        document.getElementById('arrow-next')?.addEventListener('click', () => startFlip(s, s.layout.page + 1));
        document.getElementById('page-track')?.addEventListener('click', (e) => handleCellClick(s, e));

        function animate(t: number) {
            frameId = requestAnimationFrame(animate);

            const offset = stepFlip(s, t);
            positionCells(s, offset);
            layoutPageTrack(s, offset);
            idleAnimate(s, t);

            if (s.zoom.state.active) stepZoom(s, t);

            s.main.renderer.render(s.main.scene, s.main.camera);
        }
    });
}
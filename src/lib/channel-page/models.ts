import { Box3, Mesh, Vector3 } from 'three';
import type { Group, Material, Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MIN_MS_OF_LOADING_SCREEN } from './config';
import { cellMetrics, cellWorldX } from './metrics';
import type { Skips, Stage } from './types';

// load the compressed 3d objects
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

declare global {
    interface Window {
        __modelCache: Map<string, Group>;
    }
}

window.__modelCache = window.__modelCache ?? new Map();

export function scaleGroup(s: Stage, pageIndex: number, cellIndex: number) {
    const group = s.cellGroups[pageIndex][cellIndex];
    const ch = s.pages[pageIndex][cellIndex];
    const { cellW, cellH } = cellMetrics(s);
    const cellSize = Math.min(cellW, cellH);

    group.children.forEach(child => {
        if (child.userData.isBackground) return;
        if (!ch) return;

        child.scale.set(1, 1, 1);

        const box = new Box3().setFromObject(child);
        const size = new Vector3();
        box.getSize(size);
        const longest = Math.max(size.x, size.y, size.z);
        if (longest > 0 && isFinite(longest)) {
            child.scale.setScalar((cellSize * 0.55 * ch.model.scale) / longest);
        }
    });

    const outlinePx = 3;
    const cardGap = 25;

    group.children.forEach(child => {
        if (!child.userData.isBackground) return;
        const shrink = child.userData.isOutline ? cardGap : cardGap + outlinePx * 3;
        child.scale.set(
            (cellW - shrink) / 50,
            (cellH - shrink) / 50,
            1
        );
    });
}

export function teardownModels(s: Stage) {
    s.cellGroups.forEach(page => {
        page.forEach(group => {
            while (group.children.length > 0) {
                const child = group.children[0];
                group.remove(child);
                if (child instanceof Mesh) {
                    child.geometry.dispose();
                    if (Array.isArray(child.material)) {
                        child.material.forEach((m: Material) => m.dispose());
                    } else {
                        (child.material as Material).dispose();
                    }
                }
            }
        });
    });
}

// this function changes the baked lighting of an obj. it is only used for the mii, and this will be removed come animations
function applyFillLight(root: Object3D, boost = 2.0) {
    root.traverse((child) => {
        const mesh = child as Mesh;
        if (!mesh.isMesh) return;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((mat: any) => {
            // only flat-Kd materials (hair/pants/shirt/skin/beard) need this correction.
            if (mat.map) return;
            if (mat.color) mat.color.multiplyScalar(boost); // scales diffuse reflectance, not a flat overlay
            if (mat.emissive) {
                const peak = Math.max(mat.color.r, mat.color.g, mat.color.b, 1e-4);
                mat.emissive.copy(mat.color).multiplyScalar(0.01 / peak);
            }
        });
    });
}

export function loadchannel(s: Stage, pageIndex: number, cellIndex: number) {
    const ch = s.pages[pageIndex]?.[cellIndex];
    if (!ch) return;

    const cacheKey = ch.scanDir;

    if (window.__modelCache.has(cacheKey)) { // cached
        const cached = window.__modelCache.get(cacheKey)!.clone();
        cached.position.set(...(ch.model.position as [number, number, number]));
        s.cellGroups[pageIndex][cellIndex].add(cached);
        scaleGroup(s, pageIndex, cellIndex);
        return;
    }

    if (!ch?.scanDir) { // no model? no need to load a model.
        return;
    }

    const dir = ch.scanDir.replace(/\/$/, '');
    const glbPath = `${dir}.glb`;

    gltfLoader.load(
        glbPath,
        (gltf) => {
            const root = gltf.scene;
            root.position.set(...(ch.model.position as [number, number, number]));

            if (ch.title === 'About Me' || ch.title === 'About Mii') { // temp, remove come animations
                applyFillLight(root);
            }

            s.cellGroups[pageIndex][cellIndex].add(root);
            scaleGroup(s, pageIndex, cellIndex);
            window.__modelCache.set(cacheKey, root.clone());
        },
        undefined,
        (err) => console.warn(`GLB load failed [${ch.title}]:`, err)
    );
}

export function loadchannels(s: Stage, skips: Skips = { page: null, index: null }) {
    for (let p = 0; p < s.cellGroups.length; p++) {
        for (let i = 0; i < s.layout.cpp; i++) {
            // only load if not already loaded by zooming. skip that ONE cell, not its whole page and column
            if (!(skips.page === p && skips.index === i)) loadchannel(s, p, i);
        }
    }

    // render all channels + unload loading screen
    s.main.renderer.compile(s.main.scene, s.main.camera);
}

// slides every cell's model group along with the page track. the zooming cell is skipped, renderZoom owns its position
export function positionCells(s: Stage, offset: number) {
    const z = s.zoom.state;
    s.cellGroups.forEach((page, p) => {
        page.forEach((group, i) => {
            if (i >= s.layout.cpp) return;
            if (z.active && p === z.pageIndex && i === z.cellIndex) return;
            group.position.x = cellWorldX(s, p, i, offset);
        });
    });
}

// idle animation (rotation and such of models)
export function idleAnimate(s: Stage, t: number) {
    const sp = t * 0.0005;
    s.cellGroups.forEach((page, p) => page.forEach((group, i) => {
        const ch = s.pages[p][i];
        group.children.forEach(child => {
            if (child.userData.isBackground) return;
            child.rotation.y = ch?.model.baseRotation?.[1] + 4 + (sp + .00001 * t * ch?.model?.salt) * ch?.model?.direction;
            child.rotation.x = ch?.model.baseRotation?.[0] + Math.cos(ch?.model?.salt * sp * ch?.model?.animatedRotation?.[0]) / 5 + .2;
            child.position.y = ch?.model?.baseRotation?.[2] + Math.cos(t * ch?.model?.saltBounce * .002) * 6;
        });
    }));
}

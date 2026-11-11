import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import { ShotCam } from '../src/presentation/shot-cam';
import { makeWorld } from './helpers';
import type { AppConfig } from '../src/core';

/**
 * v9s.77 验收：测试截图机位（`shot-cam.ts`）。
 *
 * 这个工具的失败模式是**安静地拍空** —— 相机参数看着对、截图里却是腰以上或者背景。
 * 所以每条用例都落在「可量的几何关系」上，而不是「跑起来没报错」：
 *
 *   - 局部偏移是否真的挂在角色坐标系上（转身 90° 后眼睛必须跟着转）；
 *   - `world: true` 是否真的只跟位置、不跟朝向；
 *   - 跟住某根骨头时，骨头动 → 相机跟着动、目标在画面里的位置不变；
 *   - `fit()` 算的距离是否真让目标填满画幅（用投影反算占比）；
 *   - `release()` 是否把 fov 和补光都还原（否则「截完图游戏视角变了」）。
 */

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

const DEG = Math.PI / 180;

function bench() {
  const w = makeWorld();
  const rig = createVoxelRig(
    raw.view.voxel, raw.view.colors, w.config.moveSpeed,
    raw.view.orientation, raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
    raw.view.animation, raw.view.ik,
  );
  // 复刻 three-scene 的挂载层级：playerRoot（位置 + 朝向）→ rollPivot（+0.9）
  // → hero.group（−0.9）。层级错了这套坐标语义就不成立，所以要照抄。
  const playerRoot = new THREE.Group();
  const rollPivot = new THREE.Group();
  rollPivot.position.y = 0.9;
  rig.group.position.y = -0.9;
  rollPivot.add(rig.group);
  playerRoot.add(rollPivot);
  playerRoot.position.set(3, 0, 5);
  const scene = new THREE.Scene();
  scene.add(playerRoot);
  playerRoot.updateWorldMatrix(true, true);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
  const shot = new ShotCam(
    camera,
    { heroRoot: playerRoot, get hero() { return rig.group; } },
    scene,
  );
  return { w, rig, playerRoot, scene, camera, shot };
}

/** 世界坐标四舍五入到毫米，避免浮点噪声让断言变得脆弱。 */
const mm = (v: THREE.Vector3) => [+v.x.toFixed(3), +v.y.toFixed(3), +v.z.toFixed(3)];

describe('v9s.77 截图机位：坐标语义', () => {
  it('hero 锚点：eye 是相对角色的偏移，转身后跟着转', () => {
    const b = bench();
    // 角色前方是 +Z；站在脚底 +3m、抬高 1.2m 看角色
    // look 取一个不在轴上的点，转身后才看得出「它也跟着转」
    b.shot.take({ anchor: 'hero', eye: [0, 1.2, 3], look: [0.2, 0.9, 0], fov: 35 });
    expect(mm(b.camera.position)).toEqual([3, 1.2, 8]);
    const look0 = b.shot.read()!.look;
    expect([+look0.x.toFixed(3), +look0.y.toFixed(3), +look0.z.toFixed(3)]).toEqual([3.2, 0.9, 5]);

    // 转身 90°（绕 +Y）：局部 +Z → 世界 +X，眼睛跟着挪到 +X 侧
    b.playerRoot.rotation.y = Math.PI / 2;
    b.playerRoot.updateWorldMatrix(true, true);
    b.shot.apply();
    expect(mm(b.camera.position)).toEqual([6, 1.2, 5]);
    // 注视点同角度转过去（局部 +X → 世界 −Z），视线始终对着角色正面
    const look1 = b.shot.read()!.look;
    expect([+look1.x.toFixed(3), +look1.y.toFixed(3), +look1.z.toFixed(3)]).toEqual([3, 0.9, 4.8]);
  });

  it('world: true 只跟位置不跟朝向（转身后眼睛不动）', () => {
    const b = bench();
    b.shot.take({ anchor: 'hero', eye: [0, 1.2, 3], world: true, fov: 35 });
    const before = mm(b.camera.position);

    b.playerRoot.rotation.y = Math.PI / 2;
    b.playerRoot.updateWorldMatrix(true, true);
    b.shot.apply();
    expect(mm(b.camera.position)).toEqual(before);
  });

  it('node 锚点：跟住某根骨头，节点移动时相机同量平移', () => {
    const b = bench();
    const ball = b.rig.group.getObjectByName('ballL')!;
    b.shot.take({ anchor: 'node', node: 'ballL', eye: [0.5, 0.1, 0], fov: 30 });
    const p0 = b.camera.position.clone();

    // 把前掌枢轴往外推 0.2m（模拟步态 / 骨骼动画改了它的位置）
    ball.position.x += 0.2;
    b.rig.group.updateWorldMatrix(true, true);
    b.shot.apply();
    const p1 = b.camera.position;
    expect(+(p1.x - p0.x).toFixed(3)).toBeCloseTo(0.2, 3);
    expect(p1.y).toBeCloseTo(p0.y, 6);
    expect(p1.z).toBeCloseTo(p0.z, 6);
  });

  it('节点不存在时 found=false，并退到 at 兜底点（不静默跟错对象）', () => {
    const b = bench();
    const info = b.shot.take({
      anchor: 'node', node: 'no-such-bone', at: [10, 0, 10], eye: [0, 1, 2],
    });
    expect(info.found).toBe(false);
    expect(info.node).toBe('no-such-bone');
    expect(mm(b.camera.position)).toEqual([10, 1, 12]);
  });
});

describe('v9s.77 截图机位：自动取景', () => {
  /** 目标在画面里的占比（与 tools/shot.py 同一套投影算法）。 */
  function coverage(b: ReturnType<typeof bench>, obj: THREE.Object3D): { w: number; h: number } {
    // `project()` 读的是 matrixWorldInverse —— `lookAt` 只改 quaternion，
    // 不刷新矩阵，不更新就会拿上一帧的相机算投影（结果是「占比 10 倍」这种荒唐值）。
    b.camera.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(obj);
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const v = new THREE.Vector3();
    for (let i = 0; i < 8; i++) {
      v.set(
        i & 1 ? box.max.x : box.min.x,
        i & 2 ? box.max.y : box.min.y,
        i & 4 ? box.max.z : box.min.z,
      ).project(b.camera);
      x0 = Math.min(x0, v.x); x1 = Math.max(x1, v.x);
      y0 = Math.min(y0, v.y); y1 = Math.max(y1, v.y);
    }
    return { w: (x1 - x0) / 2, h: (y1 - y0) / 2 };   // NDC 宽 2
  }

  it('fit 让目标填满画幅（留白系数直接决定占比）', () => {
    const b = bench();
    for (const pad of [1.0, 1.5]) {
      const info = b.shot.fit(null, [1, 0.4, 0], pad, 32)!;
      expect(info).toBeTruthy();
      const c = coverage(b, b.rig.group);
      // 留白系数 pad → 目标占画幅约 1/pad。±10% 容差吸收 AABB 与投影的差异，
      // 但足以挡住「距离算错一个量级」（那样会是 0.05 或 5）。
      expect(c.h).toBeGreaterThan(0.85 / pad);
      expect(c.h).toBeLessThan(1.2 / pad);
    }
  });

  it('fit 到空锚点（footTipL 没有几何）时退到有几何的祖先，并报出实测对象', () => {
    const b = bench();
    const info = b.shot.fit('footTipL', [1, 0.2, 0], 1.2, 26)!;
    expect(info).toBeTruthy();
    // ankleL 是第一个有 mesh 的祖先（前掌 / 后掌都挂在它下面）
    expect(info.measured).toBe('ankleL');
    expect(info.fov).toBe(26);
  });
});

describe('v9s.77 截图机位：接管与交还', () => {
  it('release 还原 fov、关掉补光、读数清空', () => {
    const b = bench();
    b.camera.fov = 45;
    b.shot.take({ anchor: 'hero', eye: [0, 1, 3], fov: 22, light: 1.5 });
    expect(b.camera.fov).toBe(22);

    b.shot.release();
    expect(b.shot.active()).toBe(false);
    expect(b.shot.read()).toBeNull();
    // fov 不还原的话「截完图游戏视角还是长焦」，这是接管类工具的经典副作用
    expect(b.camera.fov).toBe(45);
  });

  it('补光只在接管期间亮，且跟随相机与注视点', () => {
    const b = bench();
    const lights = b.scene.children.filter((o) => (o as THREE.Light).isLight) as THREE.Light[];
    expect(lights.length).toBeGreaterThan(0);
    expect(lights.every((l) => l.intensity === 0)).toBe(true);

    b.shot.take({ anchor: 'hero', eye: [0, 1.2, 3], look: [0, 0.9, 0], light: 1.2 });
    const dir = lights.find((l) => (l as THREE.DirectionalLight).isDirectionalLight) as
      THREE.DirectionalLight;
    expect(dir.intensity).toBe(1.2);
    expect(mm(dir.target.position)).toEqual([3, 0.9, 5]);
    // 灯**不**在相机位置：平光下近黑材质是一团没有结构的黑（实测鞋底折角完全看不见），
    // 所以光被抬到斜上方（+y）并按固定距离摆在注视点外围。
    expect(dir.position.y).toBeGreaterThan(b.camera.position.y);
    expect(dir.position.distanceTo(new THREE.Vector3(3, 0.9, 5))).toBeCloseTo(3, 3);

    b.shot.release();
    expect(lights.every((l) => l.intensity === 0)).toBe(true);
  });

  it('apply 在未接管时是空操作（游戏相机不会被意外改掉）', () => {
    const b = bench();
    b.camera.position.set(1, 2, 3);
    expect(b.shot.apply()).toBeNull();
    expect(mm(b.camera.position)).toEqual([1, 2, 3]);
  });
});

describe('v9s.77 骨架节点命名', () => {
  it('左右腿的膝 / 末端可区分（截图要能指定「左膝」而不是「先遇到的那个膝」）', () => {
    const b = bench();
    for (const n of ['kneeL', 'kneeR', 'footTipL', 'footTipR', 'ankleL', 'ankleR', 'ballL', 'ballR']) {
      expect(b.rig.group.getObjectByName(n), `缺少 ${n}`).toBeTruthy();
    }
    // 左右必须是不同对象 —— 同名会让 getObjectByName 永远返回左边那个
    expect(b.rig.group.getObjectByName('kneeL')).not.toBe(b.rig.group.getObjectByName('kneeR'));
  });
});

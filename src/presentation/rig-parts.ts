import * as THREE from 'three';
import type { ColorConfig } from '../core';

/**
 * 体素零件几何（rig 的"模型"部分，不含任何状态与动画）。
 *
 * 从 `voxel-rig.ts` 抽出：这些函数只依赖 THREE 与配色表，没有闭包状态，
 * 是「造模型」与「驱动模型」之间最干净的一条分界线。
 * 坐标约定（刃面朝向、弓臂平面、箭的 +Z 指向）写在各自函数注释里，改之前先读。
 */

export function makeBox(w: number, h: number, d: number, color: string): THREE.Mesh {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshLambertMaterial({ color }),
  );
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function group(): THREE.Group {
  return new THREE.Group();
}

/**
 * 体素剑：柄 + 护手 + 刃 + 刃口亮边 + 尖，沿局部 +Y 伸出。
 *
 * 刃面竖直：挂点会把局部 +Y 前倒 swordPitchDeg（约 68°）指向 +Z 前方，
 * 此时局部 +Z 被转到世界「近似竖直」，局部 +X 仍水平。
 * 因此刀身必须「薄在 X、宽在 Z」，宽面才落在竖直面内（法线水平朝侧面）；
 * 若宽面在 X（旧版）则法线朝上，俯视下就是一片「水平躺着的刀刃」。
 * 刃口亮边贴在 +Z 侧（前倒后朝前下方），明确刀锋方向，不朝肩膀。
 */
export function makeSword(len: number, width: number, colors: ColorConfig): THREE.Group {
  const g = group();
  const grip = makeBox(width * 0.7, 0.12, width * 0.7, colors.wood);
  grip.position.y = 0.06;
  g.add(grip);
  // 护手沿世界水平 X 张开，与竖直刃面垂直
  const guard = makeBox(width * 2.4, 0.045, width * 0.8, colors.metal);
  guard.position.y = 0.13;
  g.add(guard);
  // 薄在 X、宽在 Z → 刃面竖直
  const blade = makeBox(width * 0.38, len, width, colors.blade);
  blade.position.y = 0.13 + len / 2;
  g.add(blade);
  const edge = makeBox(width * 0.42, len * 0.96, width * 0.2, colors.bladeEdge);
  edge.position.set(0, 0.13 + len / 2, width * 0.5);
  g.add(edge);
  const tip = makeBox(width * 0.3, 0.09, width * 0.45, colors.blade);
  tip.position.y = 0.13 + len + 0.045;
  g.add(tip);
  return g;
}

/**
 * 大剑：与体素剑同构，但更长更宽，并额外加一段向下的「下段握柄」，
 * 让左手也能双手持握（右手握上段护手、左手握下段柄）。
 */
export function makeGreatsword(colors: ColorConfig): THREE.Group {
  const g = makeSword(0.72, 0.15, colors);
  const lower = makeBox(0.12, 0.46, 0.12, colors.wood);
  lower.position.y = -0.3;
  g.add(lower);
  return g;
}

/**
 * 剑盾的盾：以默认体型躯干（bodyWidth 0.46 / bodyHeight 0.40）为参照，
 * 盾宽与躯干齐、盾高约覆盖躯干到大腿上沿 —— 读起来才像一面盾，而不是手背小牌。
 * 法线朝 +Z（盾面朝前）：plate / boss 的 z 都相对挂点，放大宽高时不要动 z，
 * 否则会改变盾与前臂的距离；boss 按「盾面正面 + 半厚 - 少量嵌入」定位，避免陷进盾板。
 * 按反馈把盾面整体放大约 1.45 倍（旧 plate 0.32×0.38×0.06、boss 0.11）。
 */
export function makeShield(colors: ColorConfig): THREE.Group {
  const g = group();
  const plateW = 0.46, plateH = 0.54, plateD = 0.075;
  const plate = makeBox(plateW, plateH, plateD, colors.metal);
  plate.position.set(0, 0.02, 0.1);
  g.add(plate);
  const bossW = 0.15, bossD = 0.055;
  const boss = makeBox(bossW, bossW, bossD, colors.blade);
  boss.position.set(0, 0.02, 0.1 + plateD / 2 + bossD / 2 - 0.008);
  g.add(boss);
  return g;
}

export function makeStaff(colors: ColorConfig): { g: THREE.Group; orb: THREE.Mesh } {
  const g = group();
  const rod = makeBox(0.055, 0.88, 0.055, colors.wood);
  rod.position.y = 0.42;
  g.add(rod);
  const orb = makeBox(0.15, 0.15, 0.15, colors.glow);
  orb.position.y = 0.92;
  const mat = orb.material as THREE.MeshLambertMaterial;
  mat.emissive = new THREE.Color(colors.glow);
  mat.emissiveIntensity = 0.85;
  g.add(orb);
  return { g, orb };
}

/**
 * 体素弓：弓臂在 XY 平面弯曲（正面可见），等价于把旧版 YZ 平面的弓「向前旋转 90°」。
 * 旧版从 2.5D 俯视相机看只是一条竖边；现在能看到完整弓形。
 * 弓弦保持在 -Z（弓后），拉弦动画沿 -Z 后拉，语义不变。
 */
export function makeBow(colors: ColorConfig): { g: THREE.Group; drawString: THREE.Mesh } {
  const g = group();
  for (let i = 0; i < 5; i++) {
    const y = (i - 2) * 0.15;
    const seg = makeBox(0.055, 0.16, 0.05, colors.wood);
    // 弓臂中段前凸、两端回收，弯曲幅度足够大才能在俯视下看出完整弓形
    seg.position.set(0.16 - Math.abs(y) * 0.46, y, 0);
    g.add(seg);
  }
  const drawString = makeBox(0.014, 0.66, 0.014, colors.blade);
  drawString.position.z = -0.06;
  g.add(drawString);
  return { g, drawString };
}

/** 箭沿局部 +Z 指向正前方；挂点会抵消手臂俯仰，避免蓄力时被抬到朝天 / 朝地。 */
export function makeArrow(colors: ColorConfig): THREE.Group {
  const g = group();
  const shaft = makeBox(0.025, 0.025, 0.46, colors.wood);
  shaft.position.z = 0.23;
  g.add(shaft);
  const head = makeBox(0.055, 0.055, 0.09, colors.blade);
  head.position.z = 0.5;
  g.add(head);
  return g;
}

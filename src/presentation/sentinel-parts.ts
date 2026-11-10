import * as THREE from 'three';
import type { ColorConfig } from '../core';
import { makeBox } from './rig-parts';

/**
 * v9s.64 · 哨兵机（Sentinel）造型零件。
 *
 * 和 `murloc-parts.ts` 同一条原则：**只做模型**，不含状态、不含动画。
 * 骨架、IK、挥击、断肢、倒地全部由 `voxel-rig` 负责 —— 这里只换几块几何，
 * 于是这台机器天生会跑、会砍、会掉头。
 *
 * ## 抓形（我自己挑的角色，三条自我约束）
 *
 * | 约束 | 做法 | 为什么 |
 * |---|---|---|
 * | 大块抓型 | 头 = 一块方颅 + 一块护檐；躯干 = 一块胸甲板 + 一个背包 | 2.5D 俯视只有 200px 高，细节过 6 块就变噪点 |
 * | 小块点缀 | 单眼灯、天线、三根警示条、两片肩甲、腰侧液压杆 | 这些都长在**轮廓线**上，缩到最小也还剩一个剪影 |
 * | 一眼不同 | 只有**一只**灯眼（不画第二只） | 人类 / 鱼人都是两只眼；一只眼立刻读作「机器」 |
 *
 * ## 为什么灯眼要自发光
 *
 * 场景是夜里的训练场，纯 Lambert 的深色眼窝在阴影里就是两个洞。
 * 灯眼给 `emissive`（并把 `userData.glow` 打上），受击闪光会跳过它 ——
 * 机器被打的时候灯不该变红，它应该一直亮着。
 */

/** 哨兵机专属色（机身主色走 `ColorConfig`，配置里可覆盖）。 */
const SEN = {
  lamp: '#ffd166',
  socket: '#1b2126',
  rust: '#a8663f',
  warn: '#d9a53a',
  belt: '#39424a',
  wire: '#2a3138',
} as const;

/** 头部零件。坐标是 `headPivot` 局部：y=0 是脖子接口，+Z 是脸朝的方向。 */
export function buildSentinelHead(
  parent: THREE.Object3D, HS: number, colors: ColorConfig,
): void {
  const shell = colors.head;
  const dark = colors.limb;
  const add = (
    w: number, h: number, d: number,
    x: number, y: number, z: number,
    color: string, glow = 0,
  ): THREE.Mesh => {
    const m = makeBox(w * HS, h * HS, d * HS, color);
    m.position.set(x * HS, y * HS, z * HS);
    if (glow > 0) {
      const mat = m.material as THREE.MeshLambertMaterial;
      mat.emissive = new THREE.Color(color);
      mat.emissiveIntensity = glow;
      mat.userData.glow = true;   // 受击闪光跳过：灯不该被打红
    }
    parent.add(m);
    return m;
  };

  // ---- 头：一块方颅 ----
  add(0.96, 0.78, 0.86, 0, 0.46, -0.02, shell);
  // ---- 单眼：一条贯穿整个正脸的面罩暗带，里面是一条发光的横灯 ----
  // 第一版把眼睛做成「方框 + 方窝 + 小灯」，在 200px 下三层盒子互相吃掉，
  // 读出来只是一块深色铁皮。改成「一条黑带 + 一条亮灯」之后，缩到最小仍是两道线。
  add(0.94, 0.30, 0.05, 0, 0.58, 0.415, SEN.socket);
  add(0.66, 0.115, 0.05, 0, 0.58, 0.435, SEN.lamp, 2.2);
  // 眉檐：薄薄一条压在面罩上方，不向外伸（伸出去会给灯条投影，眼睛又黑了）
  add(0.98, 0.07, 0.10, 0, 0.775, 0.40, dark);
  // ---- 下颌：比脸窄一圈，读作「进料口」而不是嘴 ----
  add(0.62, 0.16, 0.18, 0, 0.16, 0.37, dark);
  add(0.52, 0.04, 0.06, 0, 0.075, 0.41, SEN.belt);
  // ---- 侧面散热栅：三根竖条，左右各一组（轮廓上的细节，俯视也看得见）----
  for (const sx of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      add(0.035, 0.26, 0.035, sx * 0.485, 0.42 - i * 0.11, 0.16, SEN.belt);
    }
  }
  // ---- 天线：一根，长在头顶偏后（俯视相机唯一的立体线索）----
  // v9s.65：加粗到 0.055（原 0.032）。0.032 在 900px 截图里还有 2~3px，
  // 缩到游戏实际尺寸就只剩 1px 噪点，等于没有天线。
  add(0.055, 0.46, 0.055, 0.18, 0.94, -0.10, SEN.belt);
  add(0.115, 0.115, 0.115, 0.18, 1.19, -0.10, SEN.warn);
  // ---- 后脑接线盒 + 两根外露导线（斜着垂下，像被拆过又接回去）----
  add(0.40, 0.18, 0.10, 0, 0.40, -0.47, SEN.belt);
  for (const sx of [-1, 1]) {
    const wire = add(0.040, 0.22, 0.040, sx * 0.11, 0.24, -0.49, SEN.wire);
    wire.rotation.x = 0.45;
    wire.rotation.z = sx * 0.18;
  }
}

/**
 * 躯干附件。`baseY` 是胸段枢轴相对肩线的高度（与背鳍同一套算法），
 * 保证开 / 不开脊柱分段时配件都长在胸上而不是腰上。
 */
export function buildSentinelTorso(
  parent: THREE.Object3D, bodyW: number, bodyH: number, torsoD: number, baseY: number,
): void {
  const add = (
    w: number, h: number, d: number,
    x: number, y: number, z: number,
    color: string,
  ): THREE.Mesh => {
    const m = makeBox(w, h, d, color);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  };
  const front = torsoD / 2;
  const back = -(torsoD / 2);
  const midY = baseY * 0.55;

  // ---- 胸甲板：比躯干窄 6%，只在前脸凸出 1cm，读作「焊上去的一块板」 ----
  add(bodyW * 0.84, baseY * 0.50, 0.035, 0, midY * 0.88, front + 0.012, '#6f787f');
  // ---- 三根警示条：黄黑相间，全身唯一的高饱和色（缩到 200px 也能看见）----
  const stripes = [SEN.warn, SEN.socket, SEN.warn];
  for (let i = 0; i < 3; i++) {
    add(bodyW * 0.20, baseY * 0.10, 0.02,
      (i - 1) * bodyW * 0.24, midY - baseY * 0.10, front + 0.040, stripes[i]);
  }
  // ---- 背包 + 两根排气管：从背面看才有体积，正面完全不挡动作 ----
  add(bodyW * 0.58, baseY * 0.42, 0.14, 0, baseY * 0.76, back - 0.08, SEN.belt);
  // 排气管：横着从背包两侧伸出（第一版竖在头顶，正面看就是一对鹿角）
  for (const sx of [-1, 1]) {
    const pipe = add(0.24, 0.055, 0.055, sx * (bodyW * 0.34), baseY * 0.52, back - 0.06, SEN.rust);
    pipe.rotation.y = sx * 0.5;
    pipe.rotation.z = 0.12;
  }
  // ---- 腰侧液压杆：两片薄板，弯腰 / 挥砍时跟着胸段走，一眼看出「这台机器在发力」----
  for (const sx of [-1, 1]) {
    add(0.028, baseY * 0.44, torsoD * 0.52, sx * (bodyW / 2 + 0.012), baseY * 0.18, 0, SEN.rust);
  }
}

/**
 * 夹钳手：两片斜板 + 一个腕块。`side` 只决定开口朝哪边。
 *
 * 夹爪沿 **X** 张开（左右夹），不是沿 Z（前后夹）。
 * 第一版是前后夹 —— 从侧面看像一只螯，而且握住竖直的武器杆时两片爪一上一下，
 * 读作「把剑夹在腋下」。左右夹才像「钳子」，也和前臂的走向垂直。
 */
export function buildSentinelHand(
  parent: THREE.Object3D, HS: number, colors: ColorConfig, side: -1 | 1,
): void {
  const metal = colors.limb;
  const add = (
    w: number, h: number, d: number, x: number, y: number, z: number, color: string,
  ): THREE.Mesh => {
    const m = makeBox(w * HS, h * HS, d * HS, color);
    m.position.set(x * HS, y * HS, z * HS);
    parent.add(m);
    return m;
  };
  add(0.34, 0.16, 0.30, 0, 0, 0, metal);          // 腕块
  for (const sx of [-1, 1]) {
    // 板沿 X 拉长，从腕块两侧伸出并向内勾 → 张开的虎口。
    // 开口 0.22 rad（≈13°）不是 0.34：再大就读作两片弹簧，看不出「能夹住东西」。
    const jaw = add(0.28, 0.10, 0.17, sx * 0.085, -0.095, 0, SEN.rust);
    jaw.rotation.z = -sx * 0.22;
  }
}

/**
 * 机械脚：一块扁平方底板 + 两片前爪。
 *
 * ⚠ `ankleY` 是**米**，不是 `headSize` 的倍数 —— 它必须原样写进 `position.y`。
 * 第一版忘了这点，让它跟着 `add()` 一起乘了 `HS`（0.40）：踝高从 -0.31m 缩到 -0.124m，
 * 脚掌正好落在小腿中段，小腿从脚板中间穿出来 —— 读作「腿穿进脚里」。
 */
export function buildSentinelFoot(
  parent: THREE.Object3D, HS: number, colors: ColorConfig, ankleY: number,
): void {
  const add = (
    w: number, h: number, d: number, x: number, y: number, z: number, color: string,
  ): THREE.Mesh => {
    const m = makeBox(w * HS, h * HS, d * HS, color);
    m.position.set(x * HS, y * HS, z * HS);
    parent.add(m);
    return m;
  };
  // 三个件先按「踝点 = 0」摆，再整体沿 y 搬到踝高（不乘 HS）
  const sole = add(0.42, 0.09, 0.62, 0, 0, 0.06, colors.shoe);       // 底板（前后拉长）
  sole.position.y = ankleY + 0.005;
  for (const sx of [-1, 1]) {
    const paw = add(0.14, 0.06, 0.10, sx * 0.10, 0, 0.36, SEN.rust); // 前爪
    paw.position.y = ankleY - 0.005;
  }
}

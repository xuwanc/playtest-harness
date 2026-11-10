import * as THREE from 'three';
import type { CharacterPosture, ColorConfig } from '../core';
import { makeBox } from './rig-parts';

/**
 * v9s.63 · 鱼人（Murloc）造型零件。
 *
 * 只做「模型」，不含任何状态与动画 —— 与 `rig-parts.ts` 同一条原则：
 * 造模型的函数不该知道谁是第几帧。骨架、IK、挥击全部仍由 `voxel-rig` 负责，
 * 这里只是在它的挂点上换掉几块几何，所以鱼人**天生拥有**全套动作 / 受击 / 断肢 / 倒地。
 *
 * ## 抓形（魔兽鱼人的四个辨识点）
 *
 * | 特征 | 做法 | 为什么 |
 * |---|---|---|
 * | 大头长吻 | 颅顶 + 面部 + 前突吻部三层堆叠，深度 0.86×HS | 鱼人一眼认出来靠的是「头比身子还横」 |
 * | 侧置凸眼 | 眼球推到 `0.38HS`（头侧 `0.43HS`），亮黄瞳不参与光照 | 眼在两侧 = 鱼，在正面 = 人 |
 * | 冠鳍贯穿 | 头冠 5 片 + 背鳍 4 片 + 肩鳍一对，连成一条从额头到尾椎的鳍 | 2.5D 俯视相机主要看头顶与背面，鳍必须在这两处 |
 * | 蹼手蹼脚 | 三指 + 指间薄蹼、脚掌前后拉到 0.26m | 手上没有蹼就只是个绿皮肤的人 |
 *
 * ## 鳍为什么是「亮色顶边 + 暗色根部」
 *
 * 俯视相机看到的几乎是鳍的**顶面**（只有 `x` 那么宽）。全用暗色时它和身体渐变糊成
 * 一整片，实测读作「背上长了一排骨刺」。所以每片鳍都是两件：暗色主体负责侧面体积，
 * 亮色顶边负责在俯视下勾出轮廓 —— 这是鳍能被认出来的唯一原因。
 */

/** 鱼人专属色。皮肤走 `ColorConfig`（`bodyTypes.murloc.colors` 可覆盖）。 */
const MUR = {
  fin: '#4fa985',
  finTop: '#9ce0bc',
  pupil: '#ffcf3d',
  socket: '#16302a',
  mouth: '#17241f',
  tooth: '#f4f2e2',
  throat: '#a9dcc0',
  gill: '#1f4c40',
} as const;

/**
 * 鱼人的基础体态：屁股留在原位（腿伸直 = 最高点）、躯干压到接近水平、再折一道腰，
 * 头前伸出去把视线拉回水平 —— 「弓着背探头」的那条弧线就是这么来的。
 *
 * 为什么放在代码里而不是 `game.json`：它和头 / 背鳍 / 腿长的比例是**配套**的，
 * 换个数值鱼人就不再像鱼人；而且杂兵（`dummy-rig`）没有独立的造型配置，
 * 写死在这里才能保证「主角爬着走、码头的三只也爬着」。
 */
export const MURLOC_POSTURE: CharacterPosture = {
  pitch: 0.72,
  waist: 0.24,
  headLift: 0.98,
  headReach: 0.16,
  neckDrop: 0.02,
  // 屈膝：躯干压到 55° 后重心整个跑到脚尖前面，腿必须弯一点才站得住 ——
  // 这正是「老头」和「趴着的攀岩者」的区别。脚由足 IK 钉回地面（`rig-ik`）。
  pelvisDrop: 0.06,
  // 后坐：把骨盆往屁股方向挪，抵消前倾带来的前倒力矩。与屈膝是配套的 ——
  // 只弯腿不后坐，人还是往前栽。
  pelvisBack: 0.07,
  // 手臂回正：躯干压平后上臂会跟着倒向地面，手垂到脚边、武器插进土里。
  // 0.55 把一半以上的前倾吃掉，剩下的留在手臂上（完全抵消会让胳膊穿进胸里）。
  armDrop: 0.55,
};

/**
 * 头部旋转中心（相对 `headPivot` 原点，单位 = `headSize` 的倍数）。
 *
 * 鱼人的头比身体还横，绕脖子（y=0）转时整颗头像锤子一样甩出去 ——
 * 待机盯人时读作「疯狂点头」。把旋转中心抬到颅骨中心偏后，转头就只剩朝向变化。
 */
export const MURLOC_HEAD_SPIN = 0.46;

/** 头部零件。坐标是 `headPivot` 局部：y=0 是**旋转中心**（颅骨中心），+Z 是脸朝的方向。 */
export function buildMurlocHead(
  parent: THREE.Object3D, HS: number, colors: ColorConfig,
): void {
  const skin = colors.head;
  const dark = colors.limb;

  // 所有 y 减去旋转中心：调用方把 `parent` 抬到 `MURLOC_HEAD_SPIN * HS` 的高度，
  // 几何自身下移同样的量 —— 于是**位置不变、旋转中心变了**。
  const SPIN = MURLOC_HEAD_SPIN;

  const add = (
    w: number, h: number, d: number,
    x: number, y: number, z: number,
    color: string, glow = 0,
  ): THREE.Mesh => {
    const m = makeBox(w * HS, h * HS, d * HS, color);
    m.position.set(x * HS, (y - SPIN) * HS, z * HS);
    if (glow > 0) {
      const mat = m.material as THREE.MeshLambertMaterial;
      // 瞳孔不参与光照：鱼人在暗处眼睛也是亮的，这是它「水栖」的唯一信号
      mat.emissive = new THREE.Color(color);
      mat.emissiveIntensity = glow;
      // 标记：受击闪光（dummy-rig 的 mats 遍历）要跳过它，否则黄瞳会被染成红色
      mat.userData.glow = true;
    }
    parent.add(m);
    return m;
  };

  // ---- 头骨：一整块方颅 + 前凸的下颌 ----
  // 前两版都失败在这块：① 吻部做成伸出去的长条 → 侧视是鳄鱼；
  // ② 眼睛埋进颅骨内部 → 正脸只剩两条黄缝。鱼人的解法是**整个头就是脸**：
  // 一块方颅，嘴横裂在正面下缘，眼睛凸在正面上方的两个前角上。
  add(0.80, 0.70, 0.78, 0, 0.42, -0.02, skin);       // 颅（占满整个头）
  add(0.68, 0.16, 0.24, 0, 0.15, 0.42, dark);        // 下颌（前凸、略暗）
  add(0.64, 0.045, 0.08, 0, 0.245, 0.405, MUR.mouth); // 嘴缝：一张横裂的嘴
  // 上唇四颗尖牙：只露一半在嘴缝外，多了就成鲨鱼
  for (const sx of [-0.17, -0.06, 0.06, 0.17]) {
    add(0.060, 0.075, 0.05, sx, 0.205, 0.425, MUR.tooth);
  }
  // 喉部浅色：下颌下方一小块，鱼肚子从这儿开始
  add(0.42, 0.10, 0.14, 0, 0.10, 0.34, MUR.throat);

  // ---- 凸眼：头正面两个前角上的球 ----
  // 中心 `(±0.24, 0.66, 0.30)`：前缘凸出脸 4cm、外缘与头侧齐平。
  // 直径 0.32HS 是下限 —— 再小就从「鱼眼」退化成「方块人的眼」。
  for (const sx of [-1, 1]) {
    add(0.32, 0.32, 0.32, sx * 0.24, 0.66, 0.30, skin);              // 眼窝
    add(0.22, 0.22, 0.05, sx * 0.24, 0.66, 0.445, MUR.socket);       // 深色眶：给黄瞳一圈边
    add(0.14, 0.14, 0.05, sx * 0.24, 0.66, 0.472, MUR.pupil, 0.95);  // 亮瞳
  }

  // ---- 头冠：一整片长板，从额头拉到后脑 ----
  // 试过 5 片小鳍、3 片高矮不一的鳍：俯视都会读成「头顶一串珠子」——
  // 因为看到的是每片的顶面，而它们的**高度不同**，阶梯本身就是珠子感。
  // 一整块长板 + 一条亮顶边，才是「一片冠」。
  const crestH = 0.20;
  const crestD = 0.88;
  const crest = add(0.085, crestH, crestD, 0, 0.77 + crestH / 2, -0.02, MUR.fin);
  const crestTop = makeBox(0.092 * HS, crestH * 0.26 * HS, crestD * 0.94 * HS, MUR.finTop);
  crestTop.position.set(0, crestH * 0.37 * HS, 0);
  crest.add(crestTop);
  // 后缘两个矮尖：只做「鳍是软的」这一个暗示，不加就不像鳍、加了多了就成鬣狗
  for (const [cz, ch] of [[-0.30, 0.085], [-0.16, 0.055]] as const) {
    const spike = add(0.075, ch, 0.20, 0, 0.77 + crestH + ch / 2 - 0.02, cz, MUR.fin);
    const st2 = makeBox(0.080 * HS, ch * 0.55 * HS, 0.18 * HS, MUR.finTop);
    st2.position.set(0, ch * 0.26 * HS, 0);
    spike.add(st2);
  }

  // ---- 鳃：三条竖细缝，只在侧面可见 ----
  for (const sx of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      add(0.03, 0.22, 0.05, sx * 0.40, 0.38, -0.04 - i * 0.11, MUR.gill);
    }
  }
}

/**
 * 背鳍：躯干背面 4 片递降竖鳍。
 *
 * 必须挂 `torsoRoot`（开了脊柱分段就是 `chest`）—— 挂 `upper` 时背鳍不跟着胸段弯折，
 * 大幅挥击时会在背上「浮起来」。`baseY` 传「躯干顶相对挂点的 y」，与肩同基准。
 */
export function buildMurlocDorsalFin(
  parent: THREE.Object3D, bodyH: number, torsoD: number, baseY: number,
): void {
  // 与头冠同一条原则：一整块长板 + 亮顶边，不用多片堆叠。
  // 板比躯干还深 8%（前后各露一点），侧视才有一整条鳍的轮廓。
  const h = bodyH * 0.46;
  const d = bodyH * 0.92;
  const fin = makeBox(0.055, h, d, MUR.fin);
  fin.position.set(0, baseY - bodyH * 0.36, -torsoD / 2 - 0.030);
  const top = makeBox(0.060, h * 0.26, d * 0.95, MUR.finTop);
  top.position.set(0, h * 0.37, 0);
  fin.add(top);
  parent.add(fin);

  // 后缘一个矮尖，接住尾巴方向
  const spike = makeBox(0.050, bodyH * 0.16, bodyH * 0.22, MUR.fin);
  spike.position.set(0, baseY - bodyH * 0.60, -torsoD / 2 - 0.035);
  parent.add(spike);
}

/**
 * 肩鳍：从肩后向外张开的一对小鳍。
 *
 * 这是鱼人「水栖」的第二处读法 —— 背鳍只在侧视才完整，肩鳍在俯视里就是两块
 * 斜伸出去的薄片，把「圆肩 + 细臂」的轮廓撑开。转 ±38° 而不是贴平：
 * 贴平会和手臂的侧面共面，挥剑时闪 z-fighting。
 */
export function buildMurlocShoulderFin(
  parent: THREE.Object3D, bodyW: number, bodyH: number, baseY: number,
): void {
  for (const sx of [-1, 1]) {
    const fin = makeBox(0.045, bodyH * 0.30, bodyH * 0.42, MUR.fin);
    fin.position.set(sx * (bodyW / 2 + 0.026), baseY - bodyH * 0.30, -0.055);
    fin.rotation.y = sx * 0.66;
    fin.rotation.z = sx * -0.22;
    const top = makeBox(0.050, bodyH * 0.09, bodyH * 0.39, MUR.finTop);
    top.position.set(0, bodyH * 0.11, 0);
    fin.add(top);
    parent.add(fin);
  }
}

/** 腹甲：躯干正面一条浅色竖带（鱼肚白），从胸到腰。 */
export function buildMurlocBelly(
  parent: THREE.Object3D, bodyW: number, torsoD: number, bodyH: number, baseY: number,
): void {
  const strip = makeBox(bodyW * 0.62, bodyH * 0.66, 0.012, MUR.throat);
  strip.position.set(0, baseY - bodyH * 0.44, torsoD / 2 + 0.006);
  parent.add(strip);
}

/**
 * 短尾：基部 + 尾鳍两段，挂在 `pelvis`（世界 y=0 是髋）。
 *
 * 挂 pelvis 而不是 `lower`：尾巴跟着屁股走才自然，挂 lower 会被腿的转体甩到一侧。
 * 压得偏低偏短 —— 长了会从躯干下面穿出去。
 *
 * 两段必须**重叠 3cm 以上**：第一版按「首尾相接」摆，`base` 后缘与 `fin` 前缘差 1.6cm 没接上，
 * 尾鳍斜过来之后缝隙被放大到约 4cm，正面看过去就是「尾巴中间少了一节」。
 */
export function buildMurlocTail(parent: THREE.Object3D, HS: number, torsoD: number): void {
  const base = makeBox(0.30 * HS, 0.24 * HS, 0.34 * HS, MUR.gill);
  base.position.set(0, -0.10, -torsoD / 2 - 0.085);
  parent.add(base);

  const fin = makeBox(0.34 * HS, 0.26 * HS, 0.14 * HS, MUR.fin);
  // z 只比基座后缘再退 0.075（半深 0.032 + 重叠 0.04），旋转 0.36 后仍压在基座上
  fin.position.set(0, -0.135, -torsoD / 2 - 0.16);
  // 尾鳍斜一点：竖直的尾鳍读作「鱼的尾巴」，完全垂直读作「一块板」
  fin.rotation.x = 0.36;
  parent.add(fin);
}

/** 蹼掌：宽掌 + 三指 + 指间薄蹼。`parent` 是 `hand` 节点（+y 指向肩）。 */
export function buildMurlocHand(parent: THREE.Object3D, t: number, colors: ColorConfig): void {
  const palm = makeBox(t * 1.35, 0.075, t * 1.5, colors.head);
  palm.position.set(0, 0.036, 0.012);
  parent.add(palm);

  // 三指向前张开 —— 指间那层薄蹼才是「鱼人」，不是三根棍子
  const fingers: [number, number][] = [[-0.042, 0.098], [0, 0.112], [0.042, 0.098]];
  for (const [fx, fz] of fingers) {
    const f = makeBox(0.030, 0.030, 0.115, colors.head);
    f.position.set(fx, 0.018, fz);
    parent.add(f);
  }
  const web = makeBox(0.125, 0.014, 0.085, MUR.fin);
  web.position.set(0, 0.014, 0.075);
  parent.add(web);
}

/**
 * 蹼足：前后拉长的大脚掌 + 三趾。
 *
 * `parent` 是**踝关节**（v9s.66 起，挂在 `knee` 末端），脚掌压在这个节点原点上，
 * 与 IK 的 `footTip` 严格对齐（否则脚会悬空或插地 —— 换鞋最容易出的 bug）。
 * `ankleY` 是踝点相对 parent 的偏移，正常传 0（几何直接以踝为原点摆）。
 */
export function buildMurlocFoot(
  parent: THREE.Object3D, t: number, ankleY: number, colors: ColorConfig,
): void {
  const ankle = ankleY;
  const sole = makeBox(t * 1.30, 0.052, 0.26, colors.shoe);
  sole.position.set(0, ankle + 0.026, 0.095);
  parent.add(sole);

  const toes: [number, number][] = [[-0.045, 0.222], [0, 0.240], [0.045, 0.222]];
  for (const [tx, tz] of toes) {
    const toe = makeBox(0.036, 0.045, 0.10, colors.shoe);
    toe.position.set(tx, ankle + 0.024, tz);
    parent.add(toe);
  }
  const web = makeBox(0.125, 0.016, 0.07, MUR.fin);
  web.position.set(0, ankle + 0.020, 0.198);
  parent.add(web);
}

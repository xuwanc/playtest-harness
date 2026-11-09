import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import type { AppConfig, HurtState, PoseClip } from '../src/core';
import {
  POSE_CHANNELS, clipHasChannel, hitsUpdate, samplePoseClip, sampleSpin,
  step, validatePoseClip,
} from '../src/core';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import { solveSwingPose } from '../src/presentation/swing-pose';
import { makeWorld, intent } from './helpers';

/**
 * v9s.26 · 「左右砍扫到对侧 135°、双持第三击展开原地转一圈、剑盾第三击盾猛顶」。
 *
 * 这三项全是**表现层**诉求，实现也完全落在数据与 rig 上：
 *  - 新增 `rootYaw` 通道：整个人绕重心带转，与只拧腰椎的 `bodyYaw` 叠加，是横扫幅度的主力；
 *  - 新增 `bladePitchOff` 通道：副手武器挂点单独给仰角，双持展开 / 盾面朝前才不会朝天；
 *  - 新增剪辑级 `spin`：按 attackProgress 单调推进到 2π ≡ 0，转满一整圈且收招自动回正。
 *
 * 最后一组用例专门钉住一条边界：**视觉横扫 / 转圈不参与命中判定**。
 * Core 只用 `combat.attackFacing` 与 `hits.arcDeg`（半角 65°，全角 130°），
 * 与表现层的 135° 观感同量级但彼此独立；改动作数据不会悄悄改平衡。
 */

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;
const g = globalThis as any;
if (!g.document) {
  g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => null }) };
}

const NONE: HurtState = {
  lastAt: -1e9, type: 'none', timer: 0, duration: 0, dirX: 0, dirZ: 0, knockX: 0, knockZ: 0,
};
const SWING = raw.view.animation.swing!;
const CLIPS = SWING.clips!;

// ---------------------------------------------------------------- 数据格式

describe('v9s.26 数据格式：rootYaw / bladePitchOff / spin', () => {
  it('新通道已登记，配置里所有剪辑合法、combo 引用齐全', () => {
    expect(POSE_CHANNELS).toContain('rootYaw');
    expect(POSE_CHANNELS).toContain('bladePitchOff');
    for (const [id, clip] of Object.entries(CLIPS)) {
      expect(validatePoseClip(clip as PoseClip), `剪辑 ${id}`).toEqual([]);
    }
    for (const [weapon, refs] of Object.entries(SWING.combo!)) {
      for (const ref of refs) {
        const id = typeof ref === 'string' ? ref : ref.clip;
        expect(CLIPS[id], `${weapon} 引用了不存在的剪辑 ${id}`).toBeTruthy();
      }
    }
  });

  it('三条横扫 / 转圈 / 盾顶剪辑的数据形状符合语义', () => {
    expect(clipHasChannel(CLIPS['gs.right-left'] as PoseClip, 'rootYaw')).toBe(true);
    expect(clipHasChannel(CLIPS['gs.left-right'] as PoseClip, 'rootYaw')).toBe(true);
    expect(clipHasChannel(CLIPS['gs.right-left'] as PoseClip, 'bladePitchOff')).toBe(true);

    const spin = CLIPS['ds.spin'] as PoseClip;
    expect(spin.spin?.turns).toBe(1);
    expect(spin.spin!.span!).toBeGreaterThan(0);
    expect(spin.spin!.span!).toBeLessThanOrEqual(1);
    expect(clipHasChannel(spin, 'armLRoll')).toBe(true);

    const bash = CLIPS['ss.shield-bash'] as PoseClip;
    expect(bash.kind).toBe('bash');
    expect(clipHasChannel(bash, 'armLPitch')).toBe(true);
    expect(clipHasChannel(bash, 'bladePitchOff')).toBe(true);
  });

  it('缺省通道由最近一帧补齐（作者少写不炸）', () => {
    // 构造一条缺省 bladePitchOff 的剪辑：采样时由下一帧的 −0.4 补齐
    const clip: PoseClip = {
      keys: [
        { t: 0, pose: { bodyYaw: 1 } },
        { t: 0.5, pose: { bladePitchOff: -0.4 } },
        { t: 1, pose: { bodyYaw: -1 } },
      ],
    };
    expect(clip.keys[0].pose.bladePitchOff).toBeUndefined();
    expect(samplePoseClip(clip, 0).bladePitchOff).toBeCloseTo(-0.4, 6);
  });

  it('sampleSpin：单调推进到 2π，span 之后停住不回摆', () => {
    const clip: PoseClip = {
      spin: { turns: 1, ease: 'inOut', span: 0.6 },
      keys: [{ t: 0, pose: {} }, { t: 1, pose: {} }],
    };
    expect(sampleSpin(clip, 0)).toBe(0);
    const ps = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.71, 1];
    const seq = ps.map((p) => sampleSpin(clip, p));
    expect(seq.every((v, i) => i === 0 || v >= seq[i - 1] - 1e-9)).toBe(true);
    // cancelWindow 让段内 progress 最多 ~0.71，span=0.6 保证换段前已转满
    expect(seq[6]).toBeCloseTo(Math.PI * 2, 6);
    expect(seq[7]).toBeCloseTo(Math.PI * 2, 6);
    expect(seq[8]).toBeCloseTo(Math.PI * 2, 6);
    // 2π 在旋转上等价 0 —— 收招不需要「转回去」
    expect(Math.sin(seq[8])).toBeCloseTo(0, 6);
    expect(Math.cos(seq[8])).toBeCloseTo(1, 6);
  });

  it('sampleSpin：ease / turns / span / 空值', () => {
    const clip = (spin: PoseClip['spin']): PoseClip => ({ spin, keys: [{ t: 0, pose: {} }] });
    expect(sampleSpin(clip({ turns: 1 }), 0.5)).toBeCloseTo(Math.PI, 6);
    expect(sampleSpin(clip({ turns: 0.5 }), 1)).toBeCloseTo(Math.PI, 6);
    expect(sampleSpin(clip({ turns: -1 }), 1)).toBeCloseTo(-Math.PI * 2, 6);
    expect(sampleSpin(clip({ turns: 1, span: 0.6 }), 0.6)).toBeCloseTo(Math.PI * 2, 6);
    expect(sampleSpin(null, 1)).toBe(0);
    expect(sampleSpin(undefined, 1)).toBe(0);
    expect(sampleSpin({ keys: [{ t: 0, pose: {} }] }, 1)).toBe(0);
    expect(sampleSpin(clip({ turns: 0 }), 1)).toBe(0);
  });

  it('validatePoseClip 拦截非法 spin（圈数 / 缓动 / span）', () => {
    const clip = (spin: unknown): PoseClip => ({ spin: spin as PoseClip['spin'], keys: [{ t: 0, pose: {} }] });
    expect(validatePoseClip(clip({ turns: 1, ease: 'inOut', span: 0.6 }))).toEqual([]);
    expect(validatePoseClip(clip({ turns: 9 }))[0]).toContain('过大');
    expect(validatePoseClip(clip({ turns: 1, ease: 'bounce' }))[0]).toContain('非法');
    expect(validatePoseClip(clip({ turns: 1, span: 1.5 }))[0]).toContain('超出');
    expect(validatePoseClip(clip({ turns: 1, span: 0 }))[0]).toContain('超出');
    expect(validatePoseClip(clip({ turns: Number.NaN }))[0]).toContain('有限数');
  });
});

// ---------------------------------------------------------------- 姿态解算

describe('v9s.26 姿态解算：整体带转、副手接管、A/B 对照', () => {
  it('盾臂：横扫段护胸、盾猛顶时前顶，全程由剪辑通道接管', () => {
    // v9s.55：剑盾改成独立剪辑后，两段横扫也显式给了 armL* 通道（盾护在胸前）——
    // 否则盾会交还步态摆臂，挥剑时在身侧乱甩。
    expect(solveSwingPose('sword-shield', 1, 1, SWING).armL).not.toBeNull();
    expect(solveSwingPose('sword-shield', 2, 1, SWING).armL).not.toBeNull();
    const bash = solveSwingPose('sword-shield', 3, 1, SWING);
    expect(bash.kind).toBe('bash');
    expect(bash.armL).not.toBeNull();
    expect(bash.bladePitchOff).not.toBeNull();
  });

  it('盾猛顶数据确实是「往前顶」：臂前伸 / 肘伸直 / 身体前压 / 骨盆前冲 / 盾面正对', () => {
    const bash = CLIPS['ss.shield-bash'] as PoseClip;
    const k0 = bash.keys[0].pose;
    const k2 = bash.keys[2].pose;
    expect(k2.armLPitch!).toBeLessThan(k0.armLPitch!);       // −1.55 < −0.7
    expect(k2.elbowL!).toBeGreaterThan(k0.elbowL!);           // −0.05 > −0.9（伸直）
    expect(k2.bodyPitch!).toBeGreaterThan(k0.bodyPitch!);     // 0.5 > −0.28
    expect(k2.pelvisZ!).toBeGreaterThan(k0.pelvisZ!);         // 0.18 > −0.08
    expect(Math.abs(k2.bladePitchOff!)).toBeLessThan(0.05);   // 盾面正对前方
  });

  it('bodyScale=0：整个人停住（含 rootYaw），剑身仰角与 spin 仍按数据', () => {
    const off = { ...SWING, bodyScale: 0 };
    const gs = solveSwingPose('greatsword', 1, 1, SWING);
    const gsOff = solveSwingPose('greatsword', 1, 1, off);
    expect(Math.abs(gs.rootYaw)).toBeGreaterThan(0.1);
    expect(Math.abs(gsOff.rootYaw)).toBeLessThan(1e-9);
    expect(gsOff.bladePitch).toBeCloseTo(gs.bladePitch!, 6);
    // 整圈旋转是剪辑级语义，不吃任何幅度倍率
    expect(solveSwingPose('dual-swords', 3, 1, off, 1).spinYaw).toBeCloseTo(Math.PI * 2, 6);
  });
});

// ---------------------------------------------------------------- rig 逐帧几何

type Row = {
  i: number; seg: number; kind: string; prog: number;
  yaw: number; pitch: number; spin: number; rootTurn: number; rootYaw: number;
  /** v9s.55：战斗姿态权重；<1 的帧是进出场过渡，刃身角度是混合值 */
  poseW: number;
};
type Block = { seg: number; kind: string; rows: Row[] };

function wrapDiff(a: number, b: number): number {
  let d = a - b;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return d;
}
function unwrap(deg: number[]): number[] {
  let acc = deg[0];
  const out = [acc];
  for (let i = 1; i < deg.length; i++) {
    acc += wrapDiff(deg[i] * Math.PI / 180, deg[i - 1] * Math.PI / 180) * 180 / Math.PI;
    out.push(acc);
  }
  return out;
}
function wrapDeg(d: number): number {
  return wrapDiff(d * Math.PI / 180, 0) * 180 / Math.PI;
}

function playerRig() {
  const w = makeWorld();
  const rig = createVoxelRig(
    raw.view.voxel, raw.view.colors, w.config.moveSpeed, raw.view.orientation,
    raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
    raw.view.animation, { ...raw.view.ik, enabled: false },
    raw.view.links, raw.view.weaponWrist,
  );
  return { w, rig };
}

/** 逐帧推进一段连击，记录刃身世界朝向与 root 的整体转体读数。 */
function bladeRows(weapon: string, frames = 190): Row[] {
  const { w, rig } = playerRig();
  (w.combat as any).weapon = weapon;
  const rows: Row[] = [];
  for (let i = 0; i < frames; i++) {
    step(w, w.config.fixedDt, i === 0 ? intent({ attackPressed: true }) : intent({ attackHeld: true }));
    (w.combat as any).weapon = weapon;
    rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
    rig.group.updateMatrixWorld(true);
    const s = rig.swingDebug();
    // v9s.28：双持段 2 主手是左手，`weaponBlade()` 只取右手 —— 必须按 lead 选主手，
    // 否则量的是副手（曾经把「副手几乎不动」误算成 184° 横扫）。
    const pair = rig.bladesWorld();
    const b = s.lead === 'L' && pair.left ? pair.left : rig.weaponBlade();
    if (!b || w.combat.phase === 'idle') continue;
    const dx = b.tip.x - b.base.x;
    const dy = b.tip.y - b.base.y;
    const dz = b.tip.z - b.base.z;
    const len = Math.hypot(dx, dy, dz) || 1;
    rows.push({
      i, seg: s.seg, kind: s.kind, prog: w.combat.attackProgress,
      yaw: Math.atan2(dx, dz) * 180 / Math.PI,
      pitch: Math.asin(dy / len) * 180 / Math.PI,
      spin: s.spinYaw * 180 / Math.PI,
      rootTurn: s.rootTurn * 180 / Math.PI,
      rootYaw: s.rootYaw,
      poseW: s.poseW,
    });
  }
  rig.dispose();
  return rows;
}

/** 按段号切连续块，只取第一轮里每个 seg 的第一个完整块（避开换段 / 收招残留）。 */
function firstCycle(rows: Row[]): Block[] {
  const blocks: Block[] = [];
  for (const r of rows) {
    const last = blocks[blocks.length - 1];
    if (!last || last.seg !== r.seg) blocks.push({ seg: r.seg, kind: r.kind, rows: [r] });
    else last.rows.push(r);
  }
  const seen = new Set<number>();
  return blocks
    .map((b) => ({ ...b, rows: b.rows.slice(3) }))  // 去掉段首 3 帧：segBlend（0.08s≈5帧）过渡期
    .filter((b) => {
      if (seen.has(b.seg) || b.rows.length < 8) return false;
      seen.add(b.seg);
      return true;
    });
}

function blockOf(list: Block[], seg: number): Block {
  const b = list.find((x) => x.seg === seg);
  if (!b) throw new Error(`没有采到 seg${seg} 的完整数据`);
  return b;
}
/** 刃身水平朝向的连续扫角（unwrap 后取跨度，跨 ±180° 接缝也不会算错）。 */
function sweep(list: Block[], seg: number): number {
  const u = unwrap(blockOf(list, seg).rows.map((r) => r.yaw));
  return Math.max(...u) - Math.min(...u);
}

const GS = firstCycle(bladeRows('greatsword'));
const DS = firstCycle(bladeRows('dual-swords'));
const SS = firstCycle(bladeRows('sword-shield'));

describe('v9s.26 横扫幅度（对侧后方 135° 量级）', () => {
  it('大剑：两段横扫都能扫到对侧后方（≥210°）', () => {
    expect(sweep(GS, 1)).toBeGreaterThan(210);
    expect(sweep(GS, 2)).toBeGreaterThan(210);
  });

  it('双持：幅度同步加大（≥175°，实测 180/180）', () => {
    // 阈值留 5° 余量：双持目标是「扫半圈」，正好贴 180 时浮点会落在 179.99。
    expect(sweep(DS, 1)).toBeGreaterThan(175);
    expect(sweep(DS, 2)).toBeGreaterThan(175);
  });

  it('剑盾：幅度同步加大（≥165°）', () => {
    expect(sweep(SS, 1)).toBeGreaterThan(165);
    expect(sweep(SS, 2)).toBeGreaterThan(165);
  });

  it('横扫段剑身保持水平（不朝天）', () => {
    // 大剑 / 剑盾的 weaponBlade() 取右手，恰好都是主挥手
    for (const list of [GS, SS]) {
      for (const seg of [1, 2]) {
        // v9s.55：只统计权重到满的帧。进出场过渡帧的剑身仰角是按 combatPoseW
        // 混到待机持械角（约 50°）的中间值，那是「正在抬手」，不是「挥到一半朝天」。
        const pitch = blockOf(list, seg).rows.filter((r) => r.poseW > 0.98).map((r) => r.pitch);
        // 25 → 30：v9s.29 给单手剑加了 12° 握刀外撇，横扫中段的仰角读数会多 3~4°；
        // 旧问题的量级是 44~58°（剑尖朝天），30° 的边界仍然拦得住。
        // v9s.55：剑盾起手改为「举剑蓄势」（剑尖朝上 ~20°），段间过渡帧会再抬高几度；
        // 35° 仍远低于「举着剑站着」的 44~58°。
        expect(Math.max(...pitch.map(Math.abs))).toBeLessThan(35);
      }
    }
    // 双持段 1 是右手主挥（水平）；段 2 主挥换到左手，weaponBlade() 取到的是
    // 右手副手剑 —— 它正在往右后方收势，允许上扬，阈值放到 40°。
    // v9s.29：握刀处加了 10° 外撇（刀不再和小臂共线），横扫最快的那几帧刃尖会
    // 自然下压 5~8°，判据放宽到 35°；旧问题的量级是 44~58°（剑尖朝天）。
    expect(Math.max(...blockOf(DS, 1).rows.map((r) => Math.abs(r.pitch)))).toBeLessThan(35);
    expect(Math.max(...blockOf(DS, 2).rows.map((r) => Math.abs(r.pitch)))).toBeLessThan(40);
  });

  it('整体带转真的写进 root：横扫段 rootYaw 两端反号', () => {
    for (const list of [GS, DS, SS]) {
      for (const seg of [1, 2]) {
        const ys = blockOf(list, seg).rows.map((r) => r.rootYaw);
        expect(Math.max(...ys)).toBeGreaterThan(0.08);
        expect(Math.min(...ys)).toBeLessThan(-0.08);
      }
    }
  });
});

describe('v9s.26 双持第三击：展开原地转一圈', () => {
  it('转满一整圈、单调推进，刃身连续扫过 >260°', () => {
    const b = blockOf(DS, 3);
    expect(b.kind).toBe('spin');
    const spins = b.rows.map((r) => r.spin);
    expect(Math.max(...spins)).toBeGreaterThanOrEqual(350);
    expect(spins.every((v, i) => i === 0 || v >= spins[i - 1] - 1e-6)).toBe(true);
    expect(sweep(DS, 3)).toBeGreaterThan(260);
  });

  it('收招 / 换段不甩头：末帧整体转体在旋转上等价回正（2π ≡ 0）', () => {
    const rows = blockOf(DS, 3).rows;
    expect(Math.abs(wrapDeg(rows[rows.length - 1].rootTurn))).toBeLessThan(20);
    // 大剑 / 剑盾没有 spin，整体转体始终很小
    for (const list of [GS, SS]) {
      for (const b of list) {
        expect(Math.max(...b.rows.map((r) => Math.abs(r.spin)))).toBeLessThan(1e-6);
      }
    }
  });
});

describe('v9s.26 副手反向收势（一手挥、另一手往同侧后方收）', () => {
  it('双持段 1：右手主挥，左手往左后方收（后摆 + 外张 + 屈肘）', () => {
    for (const swing of [-1, 1]) {
      const p = solveSwingPose('dual-swords', 1, swing, SWING);
      expect(p.lead).toBe('R');
      expect(p.armL).not.toBeNull();
      expect(p.armL!.yaw).toBeLessThan(-0.2);    // 向角色左侧
      expect(p.armL!.pitch).toBeGreaterThan(0.2); // 手臂后摆
      expect(p.armL!.elbow).toBeLessThan(-0.8);   // 屈肘收
    }
  });

  it('双持段 2：左手主挥，右手往右后方收（段 1 的镜像）', () => {
    for (const swing of [-1, 1]) {
      const p = solveSwingPose('dual-swords', 2, swing, SWING);
      expect(p.lead).toBe('L');
      expect(p.armR).not.toBeNull();
      expect(p.armR!.yaw).toBeGreaterThan(0.2);   // 向角色右侧
      expect(p.armR!.pitch).toBeGreaterThan(0.2);
      expect(p.armR!.elbow).toBeLessThan(-0.8);
    }
  });

  it('大剑仍是双手持：副手跟着主手抬起（由 IK 拉回柄上），不是后摆收势', () => {
    const p = solveSwingPose('greatsword', 1, 1, SWING);
    expect(p.armL).not.toBeNull();
    // 主手抬到身前（pitch 负），副手镜像后仍为负 —— 若误写成「后收」会是明显正值
    expect(p.armL!.pitch).toBeLessThan(0);
  });
});

describe('v9s.26 剑盾第三击：盾猛顶', () => {
  it('以向前顶为主：水平扫角远小于横扫段', () => {
    const b = blockOf(SS, 3);
    expect(b.kind).toBe('bash');
    expect(sweep(SS, 3)).toBeLessThan(40);
    expect(sweep(SS, 3)).toBeLessThan(sweep(SS, 1) / 2);
  });
});

// ---------------------------------------------------------------- 判定解耦

describe('v9s.26 表现层与命中判定解耦', () => {
  /** 把 combat 摆进 active 段第一帧做扇形扫描，绕开状态机、精确控制角度。 */
  function hitScan(arcDeg: number, angleDeg: number): number {
    const w = makeWorld();
    w.modules.targeting = false;
    w.config.hits.arcDeg = arcDeg;
    w.combat.weapon = 'greatsword';
    w.combat.attackFacing = 0; // +Z
    const p = w.character.position;
    w.dummies.forEach((d, i) => {
      if (i === 0) {
        const a = angleDeg * Math.PI / 180;
        d.position.x = p.x + 1.2 * Math.sin(a);
        d.position.z = p.z + 1.2 * Math.cos(a);
      } else {
        d.position.x = 60;
        d.position.z = 60;
      }
    });
    w.hitCount = 0;
    // v9s.31：命中改由「active 段 + 命中窗口」驱动，不再靠 attack-active 单帧事件。
    w.combat.phase = 'active';
    w.combat.timings = { windup: 0.1, active: 0.2, recovery: 0.2, settle: 0, lunge: 0 };
    w.combat.phaseTimer = 0;
    w.combat.hitIds.length = 0;
    // v9s.36：这组用例只验「扇形半角」几何，固定摆到 active 第一帧；
    // 扫掠门（刀真的扫到才判）会让第一帧一律不命中，由 v9s36-contact 单独验。
    delete w.config.combat.weapons['greatsword'].hitSweep;
    hitsUpdate(w, w.config.fixedDt);
    return w.hitCount;
  }

  it('arcDeg 是半角：65° 打不到 75° 侧面的目标，放宽到 89° 才打得到', () => {
    expect(hitScan(65, 75)).toBe(0);
    expect(hitScan(89, 75)).toBe(1);
    expect(hitScan(65, 40)).toBe(1);
  });

  it('视觉横扫 / 转圈不参与判定：Core 状态里根本没有这些通道', () => {
    const w = makeWorld();
    expect((w.config as any).view).toBeUndefined();
    expect((w.combat as any).rootYaw).toBeUndefined();
    expect((w.combat as any).spinYaw).toBeUndefined();
    // 半角 65° ≈ 全角 130°，与视觉横扫的 135° 同量级；二者独立配置
    expect(w.config.hits.arcDeg).toBe(65);
    const p = solveSwingPose('dual-swords', 3, 0, SWING, 0.5);
    expect(p.spinYaw).toBeGreaterThan(0);
    expect(typeof p.rootYaw).toBe('number');
  });
});

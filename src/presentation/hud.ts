import type { InputFrame } from '../adapters/input';
import { WEAPON_ORDER } from '../core';
import type { DummyMode, World } from '../core';
import type { DebugState } from './debug-panel';
import type { HurtPose } from './hurt-pose';

/** v8c 表现层程序动画读数（由 SceneView.diagnostics() 提供，不进 Core）。 */
export type AnimDiagnostics = {
  attackBlend: number;
  /** v8d：两个下半身权重与等效步速（可选，兼容旧调用点） */
  attackWeights?: {
    gaitScale: number; attackLegWeight: number; driveSpeed: number; stridePhase: number;
  };
  landing: {
    pulse: number; remaining: number; kind: 'none' | 'land' | 'jump'; impactVy: number;
  };
  /** v8e：平滑后的用户缩放倍率（可选，兼容旧调用点） */
  zoom?: number;
  /** v8f：分层受击姿态读数（可选，兼容旧调用点） */
  hurt?: HurtPose;
  /** v8g：足部 IK 锚定读数（可选，兼容旧调用点） */
  ik?: { active: boolean; weight: number; clamped: number; maxError: number };
};

export type Hud = {
  update(
    world: World, fps: number, steps: number, input: InputFrame, debug: DebugState,
    anim?: AnimDiagnostics,
    /** v9c：收起态只输出一行摘要，避免长时间占屏挡操作；展开态输出完整读数 */
    compact?: boolean,
  ): void;
};

const WEAPON_LABELS = ['剑盾', '双剑', '大剑', '法杖', '弓'];
const MODE_LABELS: Record<DummyMode, string> = {
  idle: '待机',
  wander: '游走',
  follow: '跟随',
  'keep-distance': '保持',
  attack: '攻击',
  // v9s.38：持械陪练的默认行为 —— 保持「刀能砍到」的距离踱步 + 低频进攻
  spar: '陪练',
};

/** 一个语义分区。标题沿用调试面板「A / B」的命名语汇，不带版本号。 */
export type HudSection = {
  /** 空串 = 不画标题（收起态的一行摘要） */
  title: string;
  lines: string[];
};

/**
 * v9s.x · 状态读数按语义分区（纯函数，无 DOM / 无 window / 无时间源，可直接单测）。
 *
 * 之前展开态是横屏 15 行 / 竖屏 7 行的一大坨纯文本，找「冲刺冷却」要在十几行里
 * 逐行扫。这里按「你要看的是哪个系统」切成 5~6 个区，**字段与措辞一字不改、
 * 行顺序不变**，只是给每段加一个标题，避免整理顺带破坏既有验收口径。
 *
 * portrait / compact 由调用方传入（createHud 读 window），保证本函数可在 node 里测。
 */
export function buildHudSections(
  world: World, fps: number, steps: number, input: InputFrame,
  debug: DebugState, anim: AnimDiagnostics | undefined,
  opts: { compact: boolean; portrait: boolean },
): HudSection[] {
  const c = world.character;
  const p = c.position;
  const v = c.velocity;
  const cb = world.combat;
  const last = world.events.length > 0 ? world.events[world.events.length - 1] : null;
  const f = (n: number) => n.toFixed(2);
  const deg = (n: number) => ((n * 180) / Math.PI).toFixed(0);
  const label = WEAPON_LABELS[WEAPON_ORDER.indexOf(cb.weapon)] ?? cb.weapon;
  const filled = Math.round(cb.charge * 10);
  const bar = '|'.repeat(filled) + '.'.repeat(10 - filled);
  const d = world.dash;
  const dashProgress = d.phase === 'active' && d.duration > 0
    ? (1 - d.timer / d.duration) * 100
    : 0;
  const dashLabel = d.phase === 'active'
    ? `${d.kind}@${dashProgress.toFixed(0)}%`
    : `${d.kind} cd${f(d.cooldown)}`;
  // 辅助瞄准方向（拖拽攻击 / 技2 按钮时生效），验收 #11 时可直接看到 Core 读到的方向
  const aimLabel = input.intents.aimActive
    ? `(${f(input.intents.aimX)},${f(input.intents.aimZ)})`
    : '-';
  // 程序化步态诊断（v8）：把速度投到身体局部，得出「侧移 / 后退」权重，
  // 与 gait.ts 同一公式；移动时瞄准会拉大 face 与 move 的夹角，这里直接看得见。
  const velF = v.x * Math.sin(c.bodyYaw) + v.z * Math.cos(c.bodyYaw);
  const velR = v.x * Math.cos(c.bodyYaw) - v.z * Math.sin(c.bodyYaw);
  const velSum = Math.abs(velF) + Math.abs(velR) + 1e-6;
  const strafePct = Math.round((Math.abs(velR) / velSum) * 100);
  const gaitLabel = `strafe ${strafePct}%${velF < -0.05 ? ' back' : ''}`;
  const cam = world.camera;
  const camLabel = `threat ${(cam.threat * 100).toFixed(0)}%  dist×${f(cam.distanceScale)}  off (${f(cam.offsetX)},${f(cam.offsetZ)})  pitch +${f(cam.pitchDelta)}°  n=${cam.threatCount}`;
  // v8c/v8d：攻击混合系数、两个下盘权重与等效步速 + 跳跃 / 落地缓冲脉冲
  const atkBlendLabel = anim ? f(anim.attackBlend) : '-';
  const aw = anim?.attackWeights;
  const wLabel = aw
    ? `gw ${f(aw.gaitScale)}  lw ${f(aw.attackLegWeight)}  spd ${f(aw.driveSpeed)}`
    : '-';
  const wShort = aw ? `${f(aw.gaitScale)}/${f(aw.attackLegWeight)}` : '-';
  const landLabel = anim
    ? `${anim.landing.kind} ${f(anim.landing.pulse)} t${f(anim.landing.remaining)} vy${f(anim.landing.impactVy)}`
    : '-';
  const landShort = anim ? `${anim.landing.kind}/${f(anim.landing.pulse)}` : '-';
  // v8e：用户缩放倍率（>1 拉远、<1 拉近），横竖屏都带一行短读数
  const zoomLabel = anim?.zoom !== undefined ? `zoom ×${f(anim.zoom)}` : '-';
  // v8f：分层受击读数 —— 部位 h(0腹/1肩) / 脉冲 p / 身体反应 up / 重心 com / 后坐 back / 屈膝 knee
  const hp = anim?.hurt;
  const hurtLabel = hp
    ? `hurt ${world.playerHurt.type}  部位h${f(hp.hitHeight)}  脉冲p${f(hp.pulse)}  上身${f(hp.upperShift)}  重心${f(hp.comShift)}  后坐${f(hp.pelvisBack)}  屈膝${f(hp.knee)}`
    : '-';
  const hurtShort = hp ? `${f(hp.hitHeight)}/${f(hp.pulse)}/${f(hp.knee)}` : '-';
  // v8g：足部 IK 是否生效 / 权重 / 钉地残差（m），横竖屏都带读数
  const ikd = anim?.ik;
  const ikShort = ikd ? `${ikd.active ? 'on' : 'off'} w${f(ikd.weight)} e${f(ikd.maxError)}` : '-';
  // v9a：派生招窗口 / 阶段 / 冷却 / 命中数（直接读 Core 状态，便于验收触发时机）
  const lk = world.playerLink;
  const linkLabel = `link ${lk.kind || '-'}  ${lk.phase}  prog ${f(lk.progress)}  win ${f(lk.linkWindow)}s  cd ${f(lk.cooldown)}s  hits ${lk.hitIds.length}  travel ${f(lk.travelled)}/${f(lk.travel)}m  id ${lk.id}`;
  const linkShort = `${lk.phase}/${lk.kind || '-'}/w${f(lk.linkWindow)}`;
  // v9d：最近一次按钮手势（点击 / 双击 / 长按 / 拖拽方向），验证手势接口是否按预期产出
  const g = input.lastGesture;
  const gestureLabel = g
    ? `${g.button} ${g.kind} ${g.heldMs.toFixed(0)}ms d${g.distance.toFixed(0)}px ${g.angleDeg.toFixed(0)}° taps${g.taps}`
    : '-';
  const dummies = world.dummies
    .map((s) => `${s.id}:${MODE_LABELS[s.mode]}`)
    .join('  ');

  // v9s.56：陪练血量摘要。只统计「有血可流」的单位（普通假人是 0 血木桩），
  // 这样一行就能看出「还剩几个能打的」以及死了几只、刷了几次。
  const hpUnits = world.dummies.filter((s) => s.health.maxHp > 0);
  const hpSum = Math.round(hpUnits.reduce((a, s) => a + Math.max(0, s.health.hp), 0));
  const hpMax = hpUnits.reduce((a, s) => a + s.health.maxHp, 0);
  const hpDead = hpUnits.filter((s) => s.health.dead).length;
  const hpKills = hpUnits.reduce((a, s) => a + s.health.kills, 0);
  const hpLabel = hpMax > 0 ? `  hp ${hpSum}/${hpMax} 死${hpDead} 杀${hpKills}` : '';

  // v9c：收起态只输出一行摘要。长时间跑动 / 连击时完整读数会一直压在左上角，
  // 手机竖屏最明显；默认收起，点「状态」才展开完整读数。
  if (opts.compact) {
    return [{ title: '', lines: [
      `t${world.tick} ${fps.toFixed(0)}fps · ${label} ${cb.phase} · lk ${lk.phase}${lk.kind ? `/${lk.kind}` : ''} w${f(lk.linkWindow)} · hit ${world.hitCount}`,
    ] }];
  }

  // 竖屏空间有限：用短版（7 行、窄宽），避免压住顶部武器条与调试面板标题栏
  if (opts.portrait) {
    return [
      { title: '运行 / 角色', lines: [
        `tick ${world.tick}  fps ${fps.toFixed(0)}  steps ${steps}`,
        `pos (${f(p.x)},${f(p.y)},${f(p.z)})  vel (${f(v.x)},${f(v.y)},${f(v.z)})`,
      ] },
      { title: '朝向 / 动作', lines: [
        `face ${deg(c.facing)}  body ${deg(c.bodyYaw)}  head ${deg(c.headYaw)}  move ${deg(c.moveYaw)}  st${strafePct}%  stick(${f(input.stickX)},${f(input.stickY)}) ${input.source}  str${f(c.stride)}`,
      ] },
      { title: '战斗 / 连招', lines: [
        `weapon ${label}  ${cb.phase}  combo ${cb.comboIndex}/3  atk ${f(cb.attackProgress)}  dash ${dashLabel}  ab ${atkBlendLabel}  gw/lw ${wShort}  land ${landShort}  ik ${ikShort}`,
        `aim ${aimLabel}  target ${world.targeting.hasTarget ? `#${world.targeting.targetId} @${f(world.targeting.targetDist)}m` : '无'}  hit ${world.hitCount}  hurt ${world.playerHurt.type}  lay ${hurtShort}`,
      ] },
      { title: '环境 / 假人', lines: [
        `dummies ${dummies}${hpLabel}  atkCount ${world.dummyAttackCount}  cam ${(cam.threat * 100).toFixed(0)}% ×${f(cam.distanceScale)}  ${zoomLabel}  lk ${linkShort}`,
      ] },
      { title: '调试 / 事件', lines: [
        `event ${last ? `${last.type} ${f(last.value)}` : '-'}  scale ${f(debug.timeScale)}${debug.paused ? ' [P]' : ''}  g ${gestureLabel}`,
      ] },
    ];
  }

  return [
    { title: '运行 / 角色', lines: [
      `tick ${world.tick}   t ${f(world.time)}s   fps ${fps.toFixed(0)}   steps ${steps}`,
      `pos  (${f(p.x)}, ${f(p.y)}, ${f(p.z)})`,
      `vel  (${f(v.x)}, ${f(v.y)}, ${f(v.z)})`,
    ] },
    { title: '朝向 / 动作', lines: [
      `grounded ${c.grounded ? 'Y' : 'N'}   sprint ${c.sprinting ? 'Y' : 'N'}   facing ${deg(c.facing)}deg   atkBlend ${atkBlendLabel}   ${wLabel}   land ${landLabel}`,
      hurtLabel,
      `ik ${ikShort}  clamped ${ikd ? ikd.clamped : '-'}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,
      `orient face ${deg(c.facing)}  body ${deg(c.bodyYaw)}  head ${deg(c.headYaw)}  move ${deg(c.moveYaw)}  (head-body ${deg(c.headYaw - c.bodyYaw)})  ${gaitLabel}`,
      `move (${f(input.intents.moveX)}, ${f(input.intents.moveZ)})  stick (${f(input.stickX)}, ${f(input.stickY)})  ${input.source}  aim ${aimLabel}`,
    ] },
    { title: '战斗 / 连招', lines: [
      `weapon ${label}  phase ${cb.phase}  combo ${cb.comboIndex}/3  atk ${f(cb.attackProgress)}${cb.phase === 'settle' ? ' [停顿]' : ''}  chan ${world.abilities.channeling ? 'Y' : 'N'}  bolts ${world.abilities.projectiles.length}  rings ${world.abilities.rings.length}`,
      `dash  kind ${d.kind}  phase ${d.phase}  prog ${dashProgress.toFixed(0)}%  cd ${f(d.cooldown)}s  id ${d.id}  from (${f(d.fromX)},${f(d.fromZ)}) → to (${f(d.toX)},${f(d.toZ)})`,
      linkLabel,
    ] },
    { title: '镜头 / 目标', lines: [
      `camera ${camLabel}  ${zoomLabel}`,
      `target ${world.targeting.hasTarget ? `#${world.targeting.targetId} @${f(world.targeting.targetDist)}m  face ${deg(world.targeting.targetYaw)}deg` : '无 (前方扇区内无敌人)'}   charge [${bar}] ${(cb.charge * 100).toFixed(0)}%  charging ${cb.charging ? 'Y' : 'N'}`,
    ] },
    { title: '环境 / 假人', lines: [
      `dummies ${dummies}${hpLabel}   atkCount ${world.dummyAttackCount}  hit ${world.hitCount}  hurt ${world.playerHurt.type}  impulse (${f(world.impulse.x)}, ${f(world.impulse.z)})`,
    ] },
    { title: '调试 / 事件', lines: [
      `event ${last ? `${last.type} ${f(last.value)}` : '-'}   scale ${f(debug.timeScale)}${debug.paused ? ' [PAUSED]' : ''}   gesture ${gestureLabel}`,
    ] },
  ];
}

/** 累计 DOM 写入次数（纯诊断；__harness.hudDebug() 读，不参与任何逻辑）。 */
let hudWrites = 0;

/**
 * 纯文本状态面板的 DOM 层。
 *
 * v9s.x：分区后改用**固定 div 池 + 逐行 diff**，而不是每帧 `el.textContent = 全文`：
 *   - 分区标题、以及 idle 时恒定的那些行静止帧零 DOM 写入；
 *   - 行数变化（横竖屏 / 收起展开）只切 display，不重建节点；
 *   - 静止态连续多帧用 MutationObserver 应观测不到字符写入。
 * 这样「状态划分」不会反过来把上一轮刚做的常驻帧率条拖红。
 */
export function createHud(el: HTMLElement): Hud {
  const pool: HTMLDivElement[] = [];
  const prev: { cls: string; text: string }[] = [];
  let shown = -1;

  function ensure(n: number): void {
    while (pool.length < n) {
      const row = document.createElement('div');
      el.appendChild(row);
      pool.push(row);
    }
  }

  return {
    update(world, fps, steps, input, debug, anim, compact = false): void {
      const portrait = window.innerHeight > window.innerWidth;
      const sections = buildHudSections(
        world, fps, steps, input, debug, anim, { compact, portrait },
      );
      const cells: { cls: string; text: string }[] = [];
      for (const sec of sections) {
        if (sec.title) cells.push({ cls: 'hud-head', text: sec.title });
        for (const line of sec.lines) cells.push({ cls: 'hud-line', text: line });
      }
      ensure(cells.length);
      if (shown !== cells.length) {
        for (let i = 0; i < pool.length; i++) {
          pool[i].style.display = i < cells.length ? '' : 'none';
        }
        shown = cells.length;
      }
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const old = prev[i];
        if (old && old.cls === cell.cls && old.text === cell.text) continue;
        const row = pool[i];
        if (!old || old.cls !== cell.cls) row.className = cell.cls;
        row.textContent = cell.text;
        prev[i] = cell;
        hudWrites++;
      }
    },
  };
}

/** 累计 DOM 写入次数。验收静止帧「不写 DOM」时读它（见 smoke）。 */
export function hudDebug(): { writes: number } {
  return { writes: hudWrites };
}

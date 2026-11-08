import { describe, expect, it } from 'vitest';
import { dummiesUpdate, EMPTY_INTENTS, runSteps, snapshot, step } from '../src/core';
import { intent, makeWorld, run } from './helpers';

function distToPlayer(w: ReturnType<typeof makeWorld>, i: number): number {
  const s = w.dummies[i];
  const p = w.character.position;
  return Math.hypot(p.x - s.position.x, p.z - s.position.z);
}

describe('测试假人：初始状态与点击交互', () => {
  it('4 个假人，初始位置与四种初始行为一一对应', () => {
    const w = makeWorld();
    expect(w.dummies).toHaveLength(4);
    expect(w.dummies.map((s) => s.mode)).toEqual(['wander', 'follow', 'keep-distance', 'attack']);
    expect(w.dummies.map((s) => [s.position.x, s.position.z])).toEqual([
      [-6, 5], [-2, 5], [2, 5], [6, 5],
    ]);
    expect(w.modules.dummies).toBe(true);
    expect(w.dummyAttackCount).toBe(0);
  });

  it('点击假人按 游走→跟随→保持→攻击→待机→游走 循环，并发出带 id 的事件', () => {
    const w = makeWorld();
    const seq: string[] = [];
    for (let i = 0; i < 5; i++) {
      const events = run(w, 1, intent({ dummyClickId: 1 }));
      seq.push(w.dummies[0].mode);
      expect(events.some((e) => e.type === 'dummy-mode' && e.value === 1)).toBe(true);
    }
    expect(seq).toEqual(['follow', 'keep-distance', 'attack', 'idle', 'wander']);
    // 点 1 号不应影响其它假人
    expect(w.dummies.slice(1).map((s) => s.mode)).toEqual(['follow', 'keep-distance', 'attack']);
  });

  it('键盘 6-9 与点击走同一个 dummyClickId 通道（0 或越界 id 无效）', () => {
    const w = makeWorld();
    run(w, 1, intent({ dummyClickId: 99 }));
    expect(w.dummies[0].mode).toBe('wander');
    run(w, 1, intent({ dummyClickId: 4 }));
    expect(w.dummies[3].mode).toBe('idle');
    expect(w.dummies[0].mode).toBe('wander');
  });

  it('关闭 dummies 模块后假人完全静止，点击也无效', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    const before = JSON.stringify(w.dummies);
    run(w, 60, intent({ dummyClickId: 1 }));
    expect(JSON.stringify(w.dummies)).toBe(before);
  });
});

describe('测试假人：四种 AI 行为', () => {
  it('1 游走：持续移动，但始终围绕初始点小范围活动', () => {
    const w = makeWorld();
    const s = w.dummies[0];
    let maxRadius = 0;
    for (let i = 0; i < 900; i++) {
      step(w, w.config.fixedDt, intent());
      maxRadius = Math.max(
        maxRadius,
        Math.hypot(s.position.x - s.homeX, s.position.z - s.homeZ),
      );
    }
    expect(s.distance).toBeGreaterThan(2);
    expect(maxRadius).toBeLessThan(w.config.dummies.wanderRadius + 1.2);
  });

  it('2 跟随：向玩家靠近，进入停距后不贴脸', () => {
    const w = makeWorld();
    const d0 = distToPlayer(w, 1);
    run(w, 180, intent());
    const d1 = distToPlayer(w, 1);
    expect(d1).toBeLessThan(d0 * 0.6);
    expect(d1).toBeGreaterThan(w.config.dummies.followStopDistance * 0.5);
  });

  it('3 保持距离：太远会靠近、太近会后退，最终稳定在目标距离附近', () => {
    const far = makeWorld();
    far.dummies[2].position.x = -10;
    far.dummies[2].position.z = 8;
    run(far, 600, intent());
    expect(Math.abs(distToPlayer(far, 2) - far.config.dummies.keepDistance)).toBeLessThan(1.3);

    const near = makeWorld();
    near.dummies[2].position.x = -1;
    near.dummies[2].position.z = 8;
    run(near, 60, intent());
    // 先验证「太近会后退」这个方向性，长时间绕行后角度会继续变化
    expect(near.dummies[2].position.x).toBeLessThan(-1.5);
    run(near, 540, intent());
    expect(Math.abs(distToPlayer(near, 2) - near.config.dummies.keepDistance)).toBeLessThan(1.3);
  });

  it('4 攻击：追到范围内挥砍、发出事件并累计计数，但完全不改变玩家状态（无伤害）', () => {
    const w = makeWorld();
    // v9s：本用例验证「假人行为不写玩家状态」。原地转身是玩家自身的朝向机制，
    // 静止时若假人绕到背后会自动触发（合法新行为），会改变 facing/bodyYaw。
    // 隔离该模块以守住无伤害 / 无位移的旧契约；新行为由 v9s-feel.test.ts 单独覆盖。
    w.modules.turnInPlace = false;
    w.modules.gaze = false;   // v9s.5：被攻击时玩家会进入威胁注视（改写朝向），隔离以守住「假人不写玩家状态」契约
    // v9s.38：玩家受击击退已默认打开；本用例守的是「AI 自身不写玩家状态」这条旧契约，
    // 与「被打会不会后退」无关，因此显式打开测试限制（命中只写受击动画）。
    w.config.hits.noDamageToPlayer = true;
    const playerBefore = JSON.stringify(w.character);
    let attacks = 0;
    for (let i = 0; i < 600; i++) {
      step(w, w.config.fixedDt, intent());
      attacks += w.events.filter((e) => e.type === 'dummy-attack').length;
    }
    expect(attacks).toBeGreaterThan(0);
    expect(w.dummyAttackCount).toBe(attacks);
    // v9s.18：接敌注视会带来俯仰姿态（headPitch / bodyPitch，纯观感），
    // 「无伤害」的语义是**物理与朝向**逐字节不变。
    const phys = (c: typeof w.character) => {
      const { headPitch, bodyPitch, ...rest } = c;
      return JSON.stringify(rest);
    };
    expect(phys(w.character)).toBe(phys(JSON.parse(playerBefore)));
    expect(w.dummies[3].attackId).toBeGreaterThan(0);
  });

  it('假人与玩家共用 AABB 碰撞：窄门洞挡住跟随假人', () => {
    const w = makeWorld();
    const s = w.dummies[1];
    s.position.x = 4;
    s.position.z = -1;
    w.character.position.x = 4;
    w.character.position.z = -6;
    run(w, 240, intent());
    // 没有穿过门洞（若碰撞失效会一路走到玩家身边 z≈-4.8）
    expect(s.position.z).toBeGreaterThan(-2.8);
    expect(distToPlayer(w, 1)).toBeGreaterThan(2);
  });

  it('长时间运行：所有假人坐标有限、不越世界边界', () => {
    const w = makeWorld();
    run(w, 900, intent());
    const b = w.config.worldBounds;
    for (const s of w.dummies) {
      expect(Number.isFinite(s.position.x)).toBe(true);
      expect(Number.isFinite(s.position.y)).toBe(true);
      expect(Number.isFinite(s.position.z)).toBe(true);
      expect(s.position.x).toBeGreaterThanOrEqual(b.minX - 1e-6);
      expect(s.position.x).toBeLessThanOrEqual(b.maxX + 1e-6);
      expect(s.position.z).toBeGreaterThanOrEqual(b.minZ - 1e-6);
      expect(s.position.z).toBeLessThanOrEqual(b.maxZ + 1e-6);
    }
  });
});

describe('测试假人：复位与确定性', () => {
  it('复位：假人回初始位置与初始模式，攻击计数清零', () => {
    const w = makeWorld();
    run(w, 200, intent());
    run(w, 1, intent({ dummyClickId: 1 }));
    run(w, 1, intent({ dummyClickId: 3 }));
    const events = run(w, 1, intent({ resetPressed: true }));
    expect(events.some((e) => e.type === 'reset')).toBe(true);
    expect(w.dummies.map((s) => s.mode)).toEqual(['wander', 'follow', 'keep-distance', 'attack']);
    expect(w.dummies.map((s) => [s.position.x, s.position.z])).toEqual([
      [-6, 5], [-2, 5], [2, 5], [6, 5],
    ]);
    expect(w.dummyAttackCount).toBe(0);
    expect(w.character.position.x).toBe(0);
    expect(w.character.position.z).toBe(8);
  });

  it('含点击与四种行为的长输入序列结果逐字节一致', () => {
    const script = (t: number) => intent({
      moveX: Math.sin(t / 25) * 0.6,
      moveZ: -0.4,
      jumpPressed: t % 137 === 0,
      dummyClickId: t % 97 === 0 ? ((t / 97) % 4) + 1 : 0,
    });
    const a = makeWorld();
    const b = makeWorld();
    runSteps(a, 600, script);
    runSteps(b, 600, script);
    expect(snapshot(a)).toBe(snapshot(b));
  });
});

describe('测试假人：平滑转身（v7b#9）', () => {
  it('身体朝向指数平滑过渡到目标，单帧不会瞬转到位', () => {
    const w = makeWorld();
    const s = w.dummies[0];
    s.facing = 0;
    s.bodyYaw = 0;
    s.headYaw = 0;
    // 受击僵直：desiredDirection 直接保留 facing，避免被 AI 朝向覆盖
    s.hurt.timer = 1;
    s.hurt.duration = 1;
    // 目标瞬间转到 180°，但身体应平滑追随
    s.facing = Math.PI;
    dummiesUpdate(w, w.config.fixedDt, EMPTY_INTENTS);
    // 单帧只前进一小段（远未到 π），且确实动了
    const turned = Math.abs(s.bodyYaw);
    expect(turned).toBeGreaterThan(0.05);
    expect(turned).toBeLessThan(0.6);
    // headYaw 追得比 bodyYaw 快
    expect(Math.abs(s.headYaw)).toBeGreaterThan(turned - 1e-6);
  });
});

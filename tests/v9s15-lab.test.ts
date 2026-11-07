import { describe, expect, it } from 'vitest';
import { createWorld, snapshot, warpTo } from '../src/core';
import type { AppConfig, World } from '../src/core';
import {
  CONFIG, intent, makeLabWorld, makeWorld, place, run,
} from './helpers';
import { cycleStation, stationAt, stationById } from '../src/presentation/lab-stations';

/** 把假人裁到只剩第一个，隔离牵引半径用例 */
function soloDummy(w: World, mode: World['dummies'][number]['mode'], homeX: number, homeZ: number): void {
  w.dummies.length = 1;
  const d = w.dummies[0];
  d.mode = mode;
  d.initialMode = mode;
  d.homeX = homeX;
  d.homeZ = homeZ;
  d.position.x = homeX;
  d.position.y = 0;
  d.position.z = homeZ;
  d.velocity.x = 0;
  d.velocity.y = 0;
  d.velocity.z = 0;
}

describe('v9s.15 · 测试场工位布局', () => {
  const stations = CONFIG.scene.stations ?? [];

  it('7 个工位，序号 1..7 唯一，颜色 / 名称 / 说明齐全', () => {
    expect(stations).toHaveLength(7);
    expect(stations.map((s) => s.index).sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(new Set(stations.map((s) => s.id)).size).toBe(7);
    for (const s of stations) {
      expect(s.name.length).toBeGreaterThan(0);
      expect(s.hint.length).toBeGreaterThan(0);
      expect(s.radius).toBeGreaterThan(0);
      expect(s.color).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('每个传送落点都在世界边界内、且在工位作用域内', () => {
    const b = CONFIG.core.worldBounds;
    for (const s of stations) {
      expect(s.spawnX).toBeGreaterThan(b.minX);
      expect(s.spawnX).toBeLessThan(b.maxX);
      expect(s.spawnZ).toBeGreaterThan(b.minZ);
      expect(s.spawnZ).toBeLessThan(b.maxZ);
      // 落在自己的圈里：传送后面板立刻显示「到达 X 号工位」
      expect(Math.hypot(s.spawnX - s.x, s.spawnZ - s.z)).toBeLessThanOrEqual(s.radius);
    }
  });

  it('落点不嵌在碰撞盒里（否则传送即被卡住）', () => {
    const w: World = createWorld(
      JSON.parse(JSON.stringify(CONFIG.core)) as AppConfig['core'],
      JSON.parse(JSON.stringify(CONFIG.scene)) as AppConfig['scene'],
    );
    const r = CONFIG.core.characterRadius;
    const body = CONFIG.core.characterHeight;
    for (const s of stations) {
      const inside = w.boxes.filter((b) => b.kind !== 'ground'
        && s.spawnX + r > b.minX && s.spawnX - r < b.maxX
        && s.spawnZ + r > b.minZ && s.spawnZ - r < b.maxZ
        && b.minY < body && b.maxY > 0.05);
      expect(inside.map((b) => b.id), `${s.id} 落点被 ${inside.map((b) => b.id).join(',')} 占住`).toEqual([]);
    }
  });

  it('宽门 2.4m 走得过去，窄门 0.5m 被挡住', () => {
    const wide = makeLabWorld();
    place(wide, 6.6, -2.8);
    run(wide, 80, intent({ moveZ: -1 }));
    expect(wide.character.position.z).toBeLessThan(-5);

    const narrow = makeLabWorld();
    place(narrow, 11.4, -2.8);
    run(narrow, 80, intent({ moveZ: -1 }));
    // 墙在 z=-4.05，角色半径 0.3 → 停在 -3.75 附近，不可能穿到 -4.5
    expect(narrow.character.position.z).toBeGreaterThan(-4.05);
    expect(Math.abs(narrow.character.position.x - 11.4)).toBeLessThan(0.8);
  });

  it('地形工位：0.2m 台阶自动上，1.2m 高台要跳', () => {
    const w = makeLabWorld();
    place(w, 6.6, -2.8);
    run(w, 90, intent({ moveZ: -1 }));
    expect(w.character.position.y).toBeGreaterThan(0.75); // 走到 0.8 平台

    const block = makeLabWorld();
    place(block, 11.4, -5.0); // 正对 0.6m 高的独立台
    run(block, 40, intent({ moveZ: -1 }));
    expect(block.character.position.y).toBeLessThan(0.1); // 走不上去

    const jump = makeLabWorld();
    place(jump, 11.4, -5.0);
    run(jump, 4, intent({ moveZ: -1 }));
    run(jump, 30, intent({ moveZ: -1, jumpPressed: true }));
    expect(jump.character.position.y).toBeGreaterThan(0.35);
  });
});

describe('v9s.15 · warpTo 传送', () => {
  it('落点精确、速度归零、攻击 / 冲刺 / 受击 / 锁定全部清掉', () => {
    const w = makeWorld();
    w.combat.phase = 'windup';
    w.combat.weapon = 'greatsword';
    w.dash.phase = 'active';
    w.playerLink.phase = 'windup';
    w.playerHurt.type = 'heavy';
    w.playerHurt.timer = 0.3;
    w.playerHurt.lastAt = w.time;
    w.targeting.hasTarget = true;
    w.targeting.targetId = 2;
    w.character.velocity.x = 3;

    warpTo(w, -9.5, 2.6);

    const c = w.character;
    expect([c.position.x, c.position.y, c.position.z]).toEqual([-9.5, 0, 2.6]);
    expect([c.velocity.x, c.velocity.y, c.velocity.z]).toEqual([0, 0, 0]);
    expect(c.grounded).toBe(true);
    expect(w.combat.phase).toBe('idle');
    expect(w.dash.phase).toBe('idle');
    expect(w.playerLink.phase).toBe('idle');
    expect(w.playerHurt.type).toBe('none');
    expect(w.playerHurt.timer).toBe(0);
    expect(w.targeting.hasTarget).toBe(false);
    expect(w.targeting.targetId).toBe(0);
  });

  it('纯状态转移：同一状态传送两次，快照逐字节一致', () => {
    const a = makeWorld();
    run(a, 30, intent({ moveX: 0.4, moveZ: -0.6 }));
    warpTo(a, 3.2, -7.5);
    const once = snapshot(a);
    warpTo(a, 3.2, -7.5);
    expect(snapshot(a)).toBe(once);
    expect(a.tick).toBe(30); // 传送不推进世界时间
  });

  it('传送到高台会落到台面高度（不嵌进台子里）', () => {
    const w = makeLabWorld();
    warpTo(w, 6.6, -9.6); // 0.8m 平台
    expect(w.character.position.y).toBeCloseTo(0.8, 5);
  });
});

describe('v9s.15 · 假人牵引半径', () => {
  it('leash=2.4：跟随假人追到半径边缘就停，不会跑遍全场', () => {
    const w = makeWorld();
    soloDummy(w, 'follow', 0, 0);
    w.config.dummies.leashRadius = 2.4;
    place(w, 12, 0);
    run(w, 240, intent());
    const d = w.dummies[0];
    const dist = Math.hypot(d.position.x - d.homeX, d.position.z - d.homeZ);
    expect(dist).toBeGreaterThan(1.8);
    expect(dist).toBeLessThan(3.0);
    // 玩家在 12m 外：没有被追逐
    expect(Math.hypot(d.position.x - w.character.position.x, d.position.z - w.character.position.z))
      .toBeGreaterThan(8);
  });

  it('leash=0：旧行为，会一直跟到玩家身边', () => {
    const w = makeWorld();
    soloDummy(w, 'follow', 0, 0);
    w.config.dummies.leashRadius = 0;
    place(w, 12, 0);
    run(w, 400, intent());
    const d = w.dummies[0];
    expect(Math.hypot(d.position.x - 12, d.position.z)).toBeLessThan(2.2);
  });

  it('牵引不改变待机 / 游走：idle 假人原地不动', () => {
    const w = makeWorld();
    soloDummy(w, 'idle', 0, 0);
    w.config.dummies.leashRadius = 2.4;
    place(w, 8, 0);
    run(w, 120, intent());
    expect(w.dummies[0].position.x).toBe(0);
    expect(w.dummies[0].position.z).toBe(0);
  });
});

describe('v9s.15 · 工位查找（纯函数）', () => {
  const stations = CONFIG.scene.stations ?? [];

  it('stationAt 取最近且在半径内的工位；空处返回 null', () => {
    expect(stationAt(stations, 0, 0)?.id).toBe('hub');
    expect(stationAt(stations, -9.5, 2.6)?.id).toBe('gait');
    expect(stationAt(stations, 2, 6)).toBeNull();
  });

  it('stationById / cycleStation 按序号循环，两端都能绕回', () => {
    expect(stationById(stations, 'dash')?.index).toBe(6);
    expect(cycleStation(stations, 'gait', 1)?.id).toBe('hub');
    expect(cycleStation(stations, 'hub', -1)?.id).toBe('gait');
    expect(cycleStation(stations, null, 1)?.id).toBe('hub');
    expect(cycleStation(stations, null, -1)?.id).toBe('gait');
  });
});

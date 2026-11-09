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

  it('9 块地各占一格区、index 唯一；hub 钉在原点，新地块按 id 序顺延', () => {
    // v9s.49：地块改为「5m 模数 + 整数格 first-fit」，坐标随布局走，不再逐字节冻结。
    // 这里只锁契约：每块地有唯一 index、有独立地板、hub 在原点、history 7 块都在。
    expect(stations.length).toBeGreaterThanOrEqual(7);
    expect(new Set(stations.map((s) => s.index)).size).toBe(stations.length);
    for (const s of stations) {
      expect(s.name.length).toBeGreaterThan(0);
      expect(s.hint.length).toBeGreaterThan(0);
      expect(s.radius).toBeGreaterThan(0);
      expect(s.color).toMatch(/^#[0-9a-f]{6}$/i);
    }
    // 历史 7 块仍在，index 1..7
    for (const id of ['hub', 'rings', 'windup', 'terrain', 'meter', 'dash', 'gait']) {
      const s = stationById(stations, id);
      expect(s, id).toBeDefined();
      expect(s!.index, id).toBeLessThanOrEqual(7);
    }
    // hub 是唯一的 pin：板中心 = 世界原点 = 出生点
    const hub = stationById(stations, 'hub')!;
    expect([hub.x, hub.z]).toEqual([0, 0]);
    const hubPlot = CONFIG.scene.slabs!.find((b) => b.plotId === 'hub')!;
    expect([hubPlot.minX, hubPlot.maxX, hubPlot.minZ, hubPlot.maxZ]).toEqual([-5, 5, -5, 5]);
    expect(CONFIG.core.spawn).toMatchObject({ x: 0, z: 0 });
    // 动态拼合出来的示范地块：index 顺延到 8 之后，落点 = 板中心
    const auto = stations.find((s) => s.index > 7);
    expect(auto).toBeDefined();
    expect([auto!.spawnX, auto!.spawnZ])
      .toEqual([auto!.x, auto!.z]);
  });

  it('每块地都有一块尺寸 = 占格 × 5m 的地板，且齐边同高', () => {
    const slabs = CONFIG.scene.slabs ?? [];
    const plots = CONFIG.scene.stations ?? [];
    expect(slabs.length).toBeGreaterThanOrEqual(plots.length);
    const cell = 5;
    for (const p of plots) {
      const s = slabs.find((b) => b.plotId === p.id);
      expect(s, p.id).toBeDefined();
      expect(s!.top).toBe(0);
      expect(s!.thickness).toBeGreaterThan(0);
      // 中心与工位中心一致
      expect((s!.minX + s!.maxX) / 2).toBeCloseTo(p.x, 6);
      expect((s!.minZ + s!.maxZ) / 2).toBeCloseTo(p.z, 6);
      // 尺寸是 5m 的整数倍
      expect((s!.maxX - s!.minX) / cell).toBeCloseTo(Math.round((s!.maxX - s!.minX) / cell), 6);
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
    // v9s.49：terrain 板中心移到 (10,20)，门在 z=23.1，台阶往南 −z 方向
    const wide = makeLabWorld();
    place(wide, 7.7, 24.8);
    run(wide, 80, intent({ moveZ: -1 }));
    expect(wide.character.position.z).toBeLessThan(22.4);

    const narrow = makeLabWorld();
    place(narrow, 12.5, 24.8);
    run(narrow, 80, intent({ moveZ: -1 }));
    // 墙在 z=23.1（厚 0.5），角色半径 0.3 → 停在 23.65 附近，不可能穿到 23.1
    expect(narrow.character.position.z).toBeGreaterThan(23.1);
    expect(Math.abs(narrow.character.position.x - 12.5)).toBeLessThan(0.8);
  });

  it('地形工位：0.2m 台阶自动上，1.2m 高台要跳', () => {
    const w = makeLabWorld();
    place(w, 7.7, 24.8);
    run(w, 90, intent({ moveZ: -1 }));
    expect(w.character.position.y).toBeGreaterThan(0.75); // 走到 0.8 平台

    const block = makeLabWorld();
    place(block, 12.5, 22.4); // 正对 0.6m 高的独立台（block-060 @ z=21.4）
    run(block, 40, intent({ moveZ: -1 }));
    expect(block.character.position.y).toBeLessThan(0.1); // 走不上去

    const jump = makeLabWorld();
    place(jump, 12.5, 22.4);
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
    warpTo(w, 7.7, 17.8); // 0.8m 平台（plateau @ z=17.8）
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
    expect(stationAt(stations, 20, 2.6)?.id).toBe('gait');
    // v9s.49：地块是连续的，空地只剩填充板 —— 取一块填充板中央应当没有工位。
    const fill = CONFIG.scene.slabs!.find((b) => b.plotId === '');
    expect(fill).toBeDefined();
    expect(stationAt(stations, (fill!.minX + fill!.maxX) / 2, (fill!.minZ + fill!.maxZ) / 2)).toBeNull();
    expect(stationAt(stations, 15.4, 15.4)).toBeNull();
  });

  it('stationById / cycleStation 按序号循环，两端都能绕回', () => {
    expect(stationById(stations, 'dash')?.index).toBe(6);
    // 循环语义对「给定列表」成立；新增地块会改变全场首尾，故用历史 7 个验证绕回。
    const pinned = stations.filter((s) => s.index >= 1 && s.index <= 7);
    expect(cycleStation(pinned, 'gait', 1)?.id).toBe('hub');
    expect(cycleStation(pinned, 'hub', -1)?.id).toBe('gait');
    expect(cycleStation(pinned, null, 1)?.id).toBe('hub');
    expect(cycleStation(pinned, null, -1)?.id).toBe('gait');
    // 全场景循环：从 hub 往回绕到的是动态拼合新增的地块
    expect(cycleStation(stations, 'hub', -1)?.index).toBeGreaterThan(7);
  });
});

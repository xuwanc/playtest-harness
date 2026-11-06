import { describe, expect, it } from 'vitest';
import { rotateAxisY, slashAxisLocal, slashTiltX } from '../src/presentation/fx-axis';

/**
 * v7c #10：把「特效弧中心轴」画成可断言的数值，方便检查轴到底朝哪。
 * 回归保护：轴必须是角色正前方（局部 +Z、水平），不能被相机俯仰拧成斜前上方。
 */
describe('特效弧中心轴（v7c #10）', () => {
  it('任意相机俯仰下，轴恒为角色正前方 +Z、水平，倾斜量恒为 0', () => {
    for (const pitch of [0, 25, 50, 75, -30, 90]) {
      const axis = slashAxisLocal(pitch);
      expect(axis.x).toBeCloseTo(0, 6);
      expect(axis.y).toBeCloseTo(0, 6); // 无竖直分量 → 不是斜前上方
      expect(axis.z).toBeCloseTo(1, 6); // 正前方
      expect(Math.hypot(axis.x, axis.y, axis.z)).toBeCloseTo(1, 6);
      expect(slashTiltX(pitch)).toBeCloseTo(0, 6); // 表现层不得再绕 X 倾斜
    }
  });

  it('按身体朝向旋转后轴仍水平，且方向与 yaw 一致（yaw=π/2 → 指向 +X）', () => {
    const cases: Array<{ yaw: number; x: number; z: number }> = [
      { yaw: 0, x: 0, z: 1 },
      { yaw: Math.PI / 2, x: 1, z: 0 },
      { yaw: Math.PI, x: 0, z: -1 },
      { yaw: -Math.PI / 2, x: -1, z: 0 },
    ];
    for (const { yaw, x, z } of cases) {
      const world = rotateAxisY(slashAxisLocal(50), yaw);
      expect(world.y).toBeCloseTo(0, 6); // 旋转不改变「水平」这一性质
      expect(world.x).toBeCloseTo(x, 6);
      expect(world.z).toBeCloseTo(z, 6);
    }
  });
});

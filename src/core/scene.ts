import type { Box, SceneConfig } from './types';

/**
 * 由场景描述生成碰撞白盒。
 * 这是「场景生成」的唯一入口 —— 日后改为程序化生成时，只需替换本函数，
 * Core 与表现层都不用改（表现层只消费 World.boxes）。
 *
 * v9s.47：底板从「一块 32×32」改为「每个地块一块」。有 `scene.slabs` 就逐块生成，
 * 没有则回落老的 `ground.size` 单块（测试夹具 / 外部调用仍走这条）。
 */
export function buildBoxes(scene: SceneConfig): Box[] {
  const boxes: Box[] = [];

  if (scene.slabs && scene.slabs.length > 0) {
    for (const s of scene.slabs) {
      boxes.push({
        id: `ground-${s.plotId}`,
        kind: 'ground',
        minX: s.minX,
        maxX: s.maxX,
        minY: s.top - s.thickness,
        maxY: s.top,
        minZ: s.minZ,
        maxZ: s.maxZ,
      });
    }
  } else {
    const s = scene.ground.size;
    boxes.push(
      makeBox('ground', 'ground', 0, 0, s, s, -scene.ground.thickness, 0),
    );
  }

  for (const st of scene.steps) {
    boxes.push(makeBox(st.id, 'step', st.x, st.z, st.width, st.depth, 0, st.height));
  }

  for (const d of scene.doorways) {
    const half = d.openingWidth / 2;
    const t = d.wallThickness;
    // 左墙 / 右墙 / 上方过梁：三段白盒共同构成门洞。
    // 过梁底面 = openingHeight，高于角色身高时角色可穿过；低于身高则被挡。
    boxes.push(
      makeBox(`${d.id}-left`, 'wall', d.x - half - d.wallSpan / 2, d.z, d.wallSpan, t, 0, d.wallHeight),
    );
    boxes.push(
      makeBox(`${d.id}-right`, 'wall', d.x + half + d.wallSpan / 2, d.z, d.wallSpan, t, 0, d.wallHeight),
    );
    boxes.push(
      makeBox(`${d.id}-lintel`, 'lintel', d.x, d.z, d.openingWidth, t, d.openingHeight, d.wallHeight),
    );
  }

  for (const o of scene.obstacles) {
    boxes.push(makeBox(o.id, 'obstacle', o.x, o.z, o.width, o.depth, 0, o.height));
  }

  return boxes;
}

function makeBox(
  id: string,
  kind: Box['kind'],
  cx: number,
  cz: number,
  width: number,
  depth: number,
  minY: number,
  maxY: number,
): Box {
  return {
    id,
    kind,
    minX: cx - width / 2,
    maxX: cx + width / 2,
    minY,
    maxY,
    minZ: cz - depth / 2,
    maxZ: cz + depth / 2,
  };
}

import * as THREE from 'three';
import type { SlabSpec, StationSpec, ViewConfig } from '../core';

/**
 * v9s.15 · 测试场标识层（纯表现，只读 stations 配置）。
 *
 * 场地本身仍由 `core/scene.ts` 的碰撞白盒生成；这里只画「怎么看」：
 *   - 每块工位一个地面盘（圆形 / 方形）+ 主色描边，走近一眼知道在哪个工位；
 *   - 盘中一块**贴地铭牌**（序号 · 名字）；一句话说明交给面板与入场提示条 ——
 *     第一版用悬浮 Sprite 标牌，俯视角下互相遮挡还挡住相邻工位，已废弃；
 *   - 三块工位有专用量具：中央罗盘（8 向）、冲刺标尺（1m 刻度）、
 *     侧后方引导圈（90 / 135 / 180 三条引线）。
 *
 * 全部平铺在 y≈0.012（低于脚下指示环 0.028），`depthWrite=false` + polygonOffset，
 * 不与地面 / 网格 z-fighting；所有装饰不占碰撞、不参与射线拾取。
 */

export type LabLayer = {
  group: THREE.Group;
  /** 整层开关（调试面板「工位标识」） */
  setVisible(v: boolean): void;
  /** 只关标牌、保留地面盘：看角色 / 环时不被文字挡 */
  setLabelsVisible(v: boolean): void;
  dispose(): void;
};

const Y_PAD = 0.012;
const Y_TEXT = 0.016;

export function createLabLayer(
  stations: StationSpec[] | undefined,
  view: ViewConfig,
  slabs: SlabSpec[] = [],
): LabLayer {
  const cfg = view.lab;
  const group = new THREE.Group();
  group.name = 'test-lab';
  const labels: THREE.Object3D[] = [];
  const textures: THREE.Texture[] = [];
  const materials: THREE.Material[] = [];
  const geometries: THREE.BufferGeometry[] = [];

  function trackMat<T extends THREE.Material>(m: T): T {
    materials.push(m);
    return m;
  }
  function trackGeo<T extends THREE.BufferGeometry>(g: T): T {
    geometries.push(g);
    return g;
  }

  /** 平铺面片：局部 XY → 世界 XZ（+Y 朝上） */
  function flat(geo: THREE.BufferGeometry, color: string, opacity: number, y = Y_PAD): THREE.Mesh {
    const mat = trackMat(new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      depthWrite: false,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    }));
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = y;
    mesh.renderOrder = 2;
    return mesh;
  }

  function ringGeo(inner: number, outer: number): THREE.BufferGeometry {
    return trackGeo(new THREE.RingGeometry(Math.max(inner, 0.001), outer, 72));
  }

  /** 地面文字：平躺画布面片，+Y 朝屏幕上方（相机 yaw 0） */
  function flatText(text: string, height: number, color: string, y = Y_TEXT): THREE.Mesh {
    const px = 96;
    const canvas = document.createElement('canvas');
    const probe = canvas.getContext('2d');
    if (!probe) return new THREE.Mesh();
    const font = `700 ${px}px "Noto Sans SC", ui-monospace, Menlo, monospace`;
    probe.font = font;
    canvas.width = THREE.MathUtils.ceilPowerOfTwo(Math.ceil(probe.measureText(text).width) + 32);
    canvas.height = THREE.MathUtils.ceilPowerOfTwo(px * 1.4);
    const c = canvas.getContext('2d');
    if (!c) return new THREE.Mesh();
    c.font = font;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillStyle = color;
    c.fillText(text, canvas.width / 2, canvas.height / 2);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    textures.push(tex);
    const aspect = canvas.width / canvas.height;
    const geo = trackGeo(new THREE.PlaneGeometry(height * aspect, height));
    const mat = trackMat(new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -3,
      polygonOffsetUnits: -3,
    }));
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = y;
    mesh.renderOrder = 3;
    return mesh;
  }

  /** 一条从中心向外的辐条（含反向），方向角按世界 +Z 起算 */
  function spoke(
    yaw: number, inner: number, outer: number, width: number, color: string, opacity: number,
  ): THREE.Object3D {
    const len = outer - inner;
    const geo = trackGeo(new THREE.PlaneGeometry(len, width));
    const mesh = flat(geo, color, opacity, Y_PAD);
    mesh.position.set(len / 2 + inner, Y_PAD, 0);
    const g = new THREE.Group();
    g.add(mesh);
    g.rotation.y = yaw - Math.PI / 2;
    return g;
  }

  /** 平躺箭头：局部 +Y（贴地后 = 屏幕向上）指向 dirYaw */
  function flatArrow(dirYaw: number, len: number, width: number, color: string, opacity: number): THREE.Object3D {
    const s = new THREE.Shape();
    s.moveTo(0, len * 0.5);
    s.lineTo(-width * 0.5, len * 0.5 - width * 0.9);
    s.lineTo(-width * 0.18, len * 0.5 - width * 0.9);
    s.lineTo(-width * 0.18, -len * 0.5);
    s.lineTo(width * 0.18, -len * 0.5);
    s.lineTo(width * 0.18, len * 0.5 - width * 0.9);
    s.lineTo(width * 0.5, len * 0.5 - width * 0.9);
    s.closePath();
    const geo = trackGeo(new THREE.ShapeGeometry(s));
    const mesh = flat(geo, color, opacity, Y_PAD + 0.002);
    const g = new THREE.Group();
    g.add(mesh);
    g.rotation.y = dirYaw + Math.PI;
    return g;
  }

  /** 工位地面铭牌：贴地写「序号 · 名字」，说明文字交给面板与入场提示条 */
  function stationSign(st: StationSpec): THREE.Group {
    const g = new THREE.Group();
    const text = flatText(`${st.index} · ${st.name}`, view.lab.labelTextHeight, '#eaf4ff');
    const geo = text.geometry as THREE.PlaneGeometry;
    const w = geo.parameters?.width ?? 3;
    g.add(text);
    // 下沿一条主色横线：远看也能把「这块地」与颜色对上
    const rule = flat(trackGeo(new THREE.PlaneGeometry(w * 0.98, 0.08)), st.color, 0.7, Y_TEXT);
    rule.position.set(0, Y_TEXT, view.lab.labelTextHeight * 0.66);
    g.add(rule);
    g.position.set(st.labelX, 0, st.labelZ);
    return g;
  }

  /**
   * v9s.47 · 地板外框：每块测试地一圈主色细线 + 四角小方块。
   *
   * 底板已经按地块拆开了，但相邻板齐边同高、走上去没有台阶 —— 所以「这是几块板」
   * 只能靠描边表示。放在 y=0.006（低于地面盘 0.012），不挡脚下的指示环。
   * 填充板（plotId 为空）不画：它们是补齐包围盒用的，不属于任何测试地。
   */
  function slabFrame(s: SlabSpec, color: string): THREE.Group {
    const g = new THREE.Group();
    const w = s.maxX - s.minX;
    const d = s.maxZ - s.minZ;
    const cx = (s.minX + s.maxX) / 2;
    const cz = (s.minZ + s.maxZ) / 2;
    const t = 0.09;
    const y = 0.006;
    const edges: Array<[number, number, number, number]> = [
      [cx, s.minZ + t / 2, w, t],
      [cx, s.maxZ - t / 2, w, t],
      [s.minX + t / 2, cz, t, d],
      [s.maxX - t / 2, cz, t, d],
    ];
    for (const [x, z, ww, dd] of edges) {
      const m = flat(trackGeo(new THREE.PlaneGeometry(ww, dd)), color, 0.38, y);
      m.position.set(x, y, z);
      g.add(m);
    }
    const corner = 0.42;
    for (const [x, z] of [
      [s.minX + corner / 2, s.minZ + corner / 2],
      [s.maxX - corner / 2, s.minZ + corner / 2],
      [s.minX + corner / 2, s.maxZ - corner / 2],
      [s.maxX - corner / 2, s.maxZ - corner / 2],
    ]) {
      const m = flat(trackGeo(new THREE.PlaneGeometry(corner, corner)), color, 0.55, y);
      m.position.set(x, y, z);
      g.add(m);
    }
    return g;
  }

  const root = new THREE.Group();

  // 板框先铺（在盘的下面一层），颜色取该地块工位的主色
  const colorOf = new Map<string, string>();
  for (const st of stations ?? []) colorOf.set(st.id, st.color);
  for (const s of slabs) {
    if (!s.plotId) continue;
    root.add(slabFrame(s, colorOf.get(s.plotId) ?? '#7f8fa0'));
  }


  for (const st of stations ?? []) {
    const pad = new THREE.Group();
    pad.position.set(st.x, 0, st.z);

    if (st.shape === 'square') {
      const s2 = st.radius;
      // 半透明填充 + 四条描边
      const fill = flat(trackGeo(new THREE.PlaneGeometry(s2 * 2, s2 * 2)), st.color, cfg.padOpacity * 0.09);
      pad.add(fill);
      const t = 0.07;
      const edges: Array<[number, number, number, number]> = [
        [0, s2, s2 * 2 + t, t],
        [0, -s2, s2 * 2 + t, t],
        [-s2, 0, t, s2 * 2 + t],
        [s2, 0, t, s2 * 2 + t],
      ];
      for (const [ex, ez, ew, ed] of edges) {
        const m = flat(trackGeo(new THREE.PlaneGeometry(ew, ed)), st.color, cfg.padOpacity);
        m.position.x = ex;
        m.position.z = ez;
        pad.add(m);
      }
    } else {
      pad.add(flat(trackGeo(new THREE.CircleGeometry(st.radius, 72)), st.color, cfg.padOpacity * 0.075));
      pad.add(flat(ringGeo(st.radius - 0.075, st.radius), st.color, cfg.padOpacity));
    }

    // ---- 专用量具 ----
    if (st.id === 'hub') {
      // 8 向罗盘：4 根贯穿辐条 = 8 个方向；长短交替区分正 / 斜向
      for (let i = 0; i < 4; i++) {
        const yaw = (i * Math.PI) / 4;
        const major = i % 2 === 0;
        for (const dir of [0, Math.PI]) {
          pad.add(spoke(yaw + dir, st.radius * 0.12, st.radius * 0.94,
            major ? 0.09 : 0.055, st.color, major ? 0.5 : 0.32));
        }
      }
      pad.add(flat(ringGeo(0.5, 0.56), st.color, 0.4));
    } else if (st.id === 'dash') {
      const startZ = st.spawnZ - st.z;
      const endZ = -st.radius + 0.5;
      const len = startZ - endZ;
      // 中线
      const line = flat(trackGeo(new THREE.PlaneGeometry(0.06, len)), st.color, 0.36);
      line.position.set(0, Y_PAD, (startZ + endZ) / 2);
      pad.add(line);
      // 每 1m 一条刻度 + 数字（0 在起点）
      let i = 0;
      for (let z = startZ; z >= endZ - 0.01; z -= 1, i++) {
        const major = i % 5 === 0;
        const tick = flat(trackGeo(new THREE.PlaneGeometry(major ? 2.4 : 1.3, major ? 0.1 : 0.07)),
          st.color, major ? 0.72 : 0.42);
        tick.position.set(0, Y_PAD, z);
        pad.add(tick);
        const label = flatText(String(i), 0.52, major ? '#eaf4ff' : 'rgba(200,225,245,0.8)');
        label.position.set(1.6, Y_TEXT, z);
        pad.add(label);
      }
      // 两条常见落点参考：翻滚 3.2 / 闪现 5.0
      const marks: Array<[number, string]> = [[3.2, '翻滚 3.2'], [5, '闪现 5.0']];
      for (const [d, text] of marks) {
        const z = startZ - d;
        const tick = flat(trackGeo(new THREE.PlaneGeometry(1.9, 0.09)), '#ffffff', 0.5);
        tick.position.set(-1.5, Y_PAD, z);
        pad.add(tick);
        const label = flatText(text, 0.42, 'rgba(220, 236, 250, 0.86)');
        label.position.set(-3.0, Y_TEXT, z);
        pad.add(label);
      }
    } else if (st.id === 'gait') {
      // 引导圈：假人贴到 1.2m 停下，人站在 1.5m 圈上绕它走
      pad.add(flat(ringGeo(1.44, 1.5), st.color, 0.5));
      pad.add(flat(ringGeo(1.14, 1.2), st.color, 0.22));
      // 三条引线都从「圈的南点」出发：180 向外 / 135 斜后 / 90 切向
      const baseZ = 1.55;
      const guides: Array<[number, string, string]> = [
        [0, '180° 正后退', '#ff9a8a'],
        [Math.PI / 4, '135° 斜后', '#ffd166'],
        [Math.PI / 2, '90° 正侧移', '#8fe7ff'],
      ];
      for (const [yaw, text, color] of guides) {
        const len = 1.7;
        const dirX = Math.sin(yaw);
        const dirZ = Math.cos(yaw);
        const arrow = flatArrow(yaw, len, 0.34, color, 0.75);
        arrow.position.set(dirX * len * 0.5, 0, baseZ + dirZ * len * 0.5);
        pad.add(arrow);
        const label = flatText(text, 0.44, color);
        label.position.set(dirX * (len + 0.7), Y_TEXT, baseZ + dirZ * (len + 0.7));
        pad.add(label);
      }
    }

    root.add(pad);

    if (cfg.showLabels) {
      const sign = stationSign(st);
      labels.push(sign);
      root.add(sign);
    }
  }

  // 所有地面装饰统一挂到 group，便于一次性显隐
  group.add(root);

  // 方向牌：中央罗盘外圈四个方位字，帮助把「屏幕方向 / 世界方向」对上
  const hub = stations?.find((s) => s.id === 'hub');
  if (hub && cfg.showLabels) {
    const marks: Array<[number, number, string]> = [
      [0, -1, '屏上'],
      [0, 1, '屏下'],
      [-1, 0, '屏左'],
      [1, 0, '屏右'],
    ];
    for (const [dx, dz, text] of marks) {
      const label = flatText(text, 0.4, 'rgba(190, 224, 248, 0.8)');
      label.position.set(hub.x + dx * (hub.radius + 0.7), Y_TEXT, hub.z + dz * (hub.radius + 0.7));
      group.add(label);
      labels.push(label);
    }
  }

  group.visible = cfg.enabled;

  return {
    group,
    setVisible(v: boolean): void {
      group.visible = v;
    },
    setLabelsVisible(v: boolean): void {
      for (const l of labels) l.visible = v;
    },
    dispose(): void {
      for (const g of geometries) g.dispose();
      for (const m of materials) m.dispose();
      for (const t of textures) t.dispose();
      group.clear();
    },
  };
}

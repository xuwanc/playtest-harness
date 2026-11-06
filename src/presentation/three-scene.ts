import * as THREE from 'three';
import type { GroundBasis } from '../adapters/input';
import type { Box, ViewConfig, World } from '../core';
import { createCameraRig } from './camera-rig';
import { createDummyRig } from './dummy-rig';
import { slashAxisLocal, slashTiltX, rotateAxisY } from './fx-axis';
import { createVoxelRig } from './voxel-rig';
import type { HurtPose } from './hurt-pose';

export type SceneView = {
  render(world: World, frameDt: number): void;
  resize(): void;
  getGroundBasis(): GroundBasis;
  setCollidersVisible(v: boolean): void;
  setGridVisible(v: boolean): void;
  /** v8e：设置用户缩放目标倍率（1 = 基础距离），由组装层每帧喂入 */
  setZoom(next: number): void;
  /** 屏幕坐标 → 被点中的假人 id（0 = 没点中）。表现层做射线拾取，Core 只收 id。 */
  pickDummy(clientX: number, clientY: number): number;
  /** 世界坐标 → 屏幕像素坐标，供自动化验收精确定位假人。 */
  projectToScreen(x: number, y: number, z: number): { x: number; y: number };
  /** v9n：停步收相 / 侧移偏转 / 双腿姿态的实时读数（纯观测）；v9o 追加胸偏转与速度，
   *  v9p 追加停步惯性的前脚前伸量与身体前移量。 */
  gaitDebug(): {
    stopT: number; hipYaw: number; chestYaw: number; speed: number;
    stopStep: number; stopShift: number;
    legLPitch: number; legLRoll: number; legRPitch: number; legRRoll: number;
  };
  /** 表现层诊断读数：惯性倾斜、斩击弧世界法线、弓/箭世界前向、冲刺视觉、下盘偏航、智能相机，纯观测用。 */
  diagnostics(): {
    lean: { forward: number; side: number };
    slashNormal: { x: number; y: number; z: number };
    arrowForward: { x: number; y: number; z: number };
    /** v8b：下盘连续偏航 hipYaw 与 gait 投影基准 gaitYaw（= bodyYaw + hipYaw，自洽） */
    gait: { hipYaw: number; gaitYaw: number };
    /** v8c：攻击姿态混合系数（0 = 下盘完全由步态 / 静止基准接管） */
    attackBlend: number;
    /** v8d：两个下半身权重与本帧步态等效驱动，供验收「权重是否真的生效」 */
    attackWeights: {
      gaitScale: number; attackLegWeight: number; driveSpeed: number; stridePhase: number;
    };
    /** v8c：跳跃 / 落地蓄力缓冲脉冲读数（纯表现，不进 Core） */
    landing: {
      pulse: number; remaining: number; kind: 'none' | 'land' | 'jump'; impactVy: number;
    };
    /** v8f：分层受击姿态读数（部位 / 力度 / 重心 / 后坐 / 屈膝…），不进 Core */
    hurt: HurtPose;
    /** v8g：足部 IK 锚定诊断（是否生效 / 权重 / 钳制数 / 钉地残差） */
    ik: { active: boolean; weight: number; clamped: number; maxError: number };
    /** v9a：派生招状态读数（纯观测，Core 状态直接可读） */
    link: {
      phase: string; kind: string; window: number; cooldown: number;
      progress: number; hits: number; id: number;
    };
    dash: { rollAngle: number; activeRings: number; lastKind: string };
    camera: {
      threat: number;
      threatCount: number;
      distanceScale: number;
      offsetX: number;
      offsetZ: number;
      pitchDelta: number;
      /** v8e：平滑后的用户缩放倍率（>1 拉远、<1 拉近） */
      zoom: number;
    };
  };
  dispose(): void;
};

function colorFor(kind: Box['kind'], view: ViewConfig): string {
  switch (kind) {
    case 'ground': return view.colors.ground;
    case 'step': return view.colors.step;
    case 'wall': return view.colors.wall;
    case 'lintel': return view.colors.lintel;
    case 'obstacle': return view.colors.obstacle;
    default: return '#ffffff';
  }
}

/**
 * Three.js 薄实现。渲染层只消费 World 数据，不反向写入 Core。
 * 换 Babylon / Unity 时，整体替换本文件即可，Core 与输入层零改动。
 */
export function createSceneView(container: HTMLElement, world: World, view: ViewConfig): SceneView {
  const w0 = Math.max(1, container.clientWidth);
  const h0 = Math.max(1, container.clientHeight);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(w0, h0, false);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#12161d');

  scene.add(new THREE.HemisphereLight(0xa8c8ee, 0x2a2f38, 1.15));
  const sun = new THREE.DirectionalLight(0xfff2dc, 1.5);
  sun.position.set(9, 18, 11);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  const sc = sun.shadow.camera;
  sc.left = -20; sc.right = 20; sc.top = 20; sc.bottom = -20;
  sc.near = 1; sc.far = 60;
  scene.add(sun);

  // ---- 碰撞白盒 ----
  const materials: THREE.MeshLambertMaterial[] = [];
  const boxGroup = new THREE.Group();
  for (const b of world.boxes) {
    const width = b.maxX - b.minX;
    const height = b.maxY - b.minY;
    const depth = b.maxZ - b.minZ;
    let color = colorFor(b.kind, view);
    if (b.kind === 'step') {
      color = new THREE.Color(color).offsetHSL(0, 0, b.maxY * 0.09).getStyle();
    }
    const mat = new THREE.MeshLambertMaterial({ color, transparent: true, opacity: 1 });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat);
    mesh.position.set((b.minX + b.maxX) / 2, (b.minY + b.maxY) / 2, (b.minZ + b.maxZ) / 2);
    mesh.castShadow = b.kind !== 'ground';
    mesh.receiveShadow = true;
    mesh.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(mesh.geometry),
      new THREE.LineBasicMaterial({ color: 0x9fb6cc, transparent: true, opacity: 0.32 }),
    ));
    boxGroup.add(mesh);
    materials.push(mat);
  }
  scene.add(boxGroup);

  // ---- 地面网格 ----
  const gridSize = world.gridMeta.maxX - world.gridMeta.minX;
  const grid = new THREE.GridHelper(gridSize, gridSize, 0x4a5c70, 0x33404d);
  grid.position.y = 0.002;
  grid.visible = view.showGrid;
  scene.add(grid);

  // ---- 体素角色 ----
  // playerRoot 承担「位置 + 身体平滑朝向」；rig 自身只承担翻滚旋转。
  // 这样绕 rig 局部 X 轴前滚时，滚动方向会随身体朝向一起转（不会锁死在世界 X 轴）。
  const voxel = createVoxelRig(
    view.voxel, view.colors, world.config.moveSpeed, view.orientation, view.gait,
    view.weaponMount, view.lean, view.hurt, view.animation, view.ik, view.links,
  );
  const playerRoot = new THREE.Group();
  // 翻滚枢轴放在身体中心高度：若直接绕脚底原点旋转，前滚到 90° 以后头部会插进地面。
  // rollPivot 上抬 ROLL_PIVOT_Y，rig 内部反向偏移同样高度，净位置不变，
  // 旋转中心则落在躯干中部，翻滚全程身体都留在地面之上。
  const ROLL_PIVOT_Y = 0.9;
  const rollPivot = new THREE.Group();
  rollPivot.position.y = ROLL_PIVOT_Y;
  voxel.group.position.y = -ROLL_PIVOT_Y;
  rollPivot.add(voxel.group);
  playerRoot.add(rollPivot);
  scene.add(playerRoot);

  // ---- 测试假人 ----
  const dummyRigs = world.dummies.map((s, i) => {
    const palette = view.dummies.colors;
    const tint = palette[i % palette.length] ?? '#cccccc';
    const rig = createDummyRig(
      view.voxel, view.colors, tint, s.id, view.dummies, world.config.dummies.moveSpeed,
      view.gait, view.hurt, view.lean, view.ik,
    );
    // 所有子节点都带上 id，射线命中身体、标签或攻击弧都能识别
    rig.group.traverse((obj) => { obj.userData.dummyId = s.id; });
    scene.add(rig.group);
    return rig;
  });
  const dummyGroups = dummyRigs.map((r) => r.group);
  const raycaster = new THREE.Raycaster();

  // ---- 当前锁定目标的脚下指示环（世界坐标，不随玩家旋转） ----
  const ringR = view.targeting.ringRadius;
  const targetRingMat = new THREE.MeshBasicMaterial({
    color: view.targeting.ringColor, transparent: true, opacity: 0.9,
    side: THREE.DoubleSide, depthWrite: false,
  });
  const targetRing = new THREE.Mesh(new THREE.RingGeometry(ringR - 0.07, ringR, 28), targetRingMat);
  targetRing.rotation.x = -Math.PI / 2;
  targetRing.position.y = 0.03;
  targetRing.visible = false;
  scene.add(targetRing);

  // ---- 战斗特效（全部挂在角色朝向锚点上，局部 +Z = 前方） ----
  const fxAnchor = new THREE.Group();
  scene.add(fxAnchor);

  const slashMat = new THREE.MeshBasicMaterial({
    color: 0xbfe8ff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false,
  });
  // 斩击弧：Torus 盘面法线（特效中心轴）恒为角色局部 +Z（水平、正前方）。
  // v7c #10：撤销 v6a 为「配合 2.5D 俯视」加的 -pitchDeg 绕 X 倾斜 —— 那个补偿把轴
  // 拧成了斜前上方，导致特效不再朝向角色正前方。倾斜量改由纯函数 slashTiltX 决定
  // （轴为纯 +Z 时恒为 0），tests/fx-axis.test.ts 直接断言轴方向，防止再次回归。
  // pivot 只管位置（放在角色身前偏上），tilt 只管朝向，避免位置被一起旋走。
  const slashPivot = new THREE.Group();
  slashPivot.position.set(0, 0.95, 0.72);
  fxAnchor.add(slashPivot);
  const slashTilt = new THREE.Group();
  slashTilt.rotation.x = slashTiltX(view.camera.pitchDeg);
  slashPivot.add(slashTilt);
  const slash = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.045, 6, 24, Math.PI * 1.15), slashMat);
  slashTilt.add(slash);

  // ---- 法杖技能实体（v7c #12）：奥术飞弹沿世界方向自由飞行、电环贴地脉冲 ----
  // 直接读 world.abilities 的实体状态（自带半径 / 剩余寿命），池化 mesh 按数量显隐，
  // 不引入表现层计时状态 → 暂停 / 时间缩放下与 Core 完全同步。世界坐标，不随 fxAnchor 旋转。
  const boltGeo = new THREE.IcosahedronGeometry(1, 0);
  const boltMat = new THREE.MeshBasicMaterial({
    color: 0x7fe3ff, transparent: true, opacity: 0.95, depthWrite: false,
  });
  const bolts = Array.from({ length: 16 }, () => {
    const mesh = new THREE.Mesh(boltGeo, boltMat);
    mesh.visible = false;
    scene.add(mesh);
    return mesh;
  });
  // RingGeometry 内外半径按 1 归一化，实例用 scale 套用状态里的真实半径
  const shockGeo = new THREE.RingGeometry(0.86, 1, 40);
  const shockRings = Array.from({ length: 6 }, () => {
    const mat = new THREE.MeshBasicMaterial({
      color: 0x9ad0ff, transparent: true, opacity: 0,
      side: THREE.DoubleSide, depthWrite: false,
    });
    const mesh = new THREE.Mesh(shockGeo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.visible = false;
    scene.add(mesh);
    return { mesh, mat };
  });

  const arrowMat = new THREE.MeshBasicMaterial({
    color: 0xffe0a0, transparent: true, opacity: 0, depthWrite: false,
  });
  const arrowFx = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.035, 0.5), arrowMat);
  fxAnchor.add(arrowFx);

  // ---- 冲刺 / 闪避一次性光环（世界坐标、池化复用，不随角色旋转） ----
  // 用 dash.id 变化触发（而非 events）：step 每帧开头会清空事件队列，低帧率一帧多步时
  // 只有最后一步的事件会留下；id 是持久状态，保证一次触发必定被表现层看到一次。
  const dashFx = view.dash;
  const dashRingGeo = new THREE.RingGeometry(dashFx.ringRadius - 0.06, dashFx.ringRadius, 28);
  const dashRings = Array.from({ length: 6 }, () => {
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0,
      side: THREE.DoubleSide, depthWrite: false,
    });
    const mesh = new THREE.Mesh(dashRingGeo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.visible = false;
    scene.add(mesh);
    return { mesh, mat, life: 0, base: 1 };
  });
  function spawnDashRing(x: number, z: number, y: number, color: string, scale: number): void {
    const r = dashRings.find((e) => e.life <= 0) ?? dashRings[0];
    r.mat.color.set(color);
    r.mesh.position.set(x, y + 0.04, z);
    r.base = scale;
    r.mesh.scale.setScalar(scale * 0.6);
    r.mesh.visible = true;
    r.mat.opacity = 0.9;
    r.life = dashFx.fxDuration;
  }
  // ---- v9a 派生招一次性光环（起手 / 命中各一圈，按持久 id 变化触发） ----
  // 与 dash 特效同理：step 每帧开头清空事件队列，低帧率一帧多步时只有最后一步的事件
  // 会留下，故用 world.playerLink.id / hitIds.length 这类持久状态，保证不漏触发。
  const linkFx = view.links;
  const linkRingGeo = new THREE.RingGeometry(linkFx.ringRadius - 0.07, linkFx.ringRadius, 28);
  const linkRings = Array.from({ length: 5 }, () => {
    const mat = new THREE.MeshBasicMaterial({
      color: linkFx.chargeColor, transparent: true, opacity: 0,
      side: THREE.DoubleSide, depthWrite: false,
    });
    const mesh = new THREE.Mesh(linkRingGeo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.visible = false;
    scene.add(mesh);
    return { mesh, mat, life: 0, base: 1 };
  });
  function spawnLinkRing(x: number, z: number, y: number, scale: number): void {
    const r = linkRings.find((e) => e.life <= 0) ?? linkRings[0];
    r.mesh.position.set(x, y + 0.05, z);
    r.base = scale;
    r.mesh.scale.setScalar(scale * 0.55);
    r.mesh.visible = true;
    r.mat.opacity = 0.85;
    r.life = linkFx.fxDuration;
  }
  let lastLinkId = world.playerLink.id;
  let lastLinkHits = world.playerLink.hitIds.length;

  let lastDashId = world.dash.id;
  let lastDashKind = 'none';

  let lastAttackId = 0;
  let arrowTime = -1;
  let arrowPower = 1;

  // ---- 2.5D 相机（叠加 Core 的智能构图意图） ----
  const cam = createCameraRig(view.camera, view.smartCamera, view.zoom, w0 / h0);
  const p0 = world.character.position;
  cam.update(p0.x, p0.y, p0.z, 1, world.camera);

  function pickDummy(clientX: number, clientY: number): number {
    if (dummyGroups.length === 0) return 0;
    const rect = renderer.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(ndc, cam.camera);
    const hits = raycaster.intersectObjects(dummyGroups, true);
    for (const hit of hits) {
      const id = hit.object.userData.dummyId as number | undefined;
      if (id && id > 0) return id;
    }
    return 0;
  }

  function projectToScreen(x: number, y: number, z: number): { x: number; y: number } {
    const rect = renderer.domElement.getBoundingClientRect();
    const p = new THREE.Vector3(x, y, z).project(cam.camera);
    return {
      x: rect.left + (p.x * 0.5 + 0.5) * rect.width,
      y: rect.top + (-p.y * 0.5 + 0.5) * rect.height,
    };
  }

  return {
    gaitDebug() {
      return voxel.gaitDebug();
    },
    render(w, frameDt): void {
      const c = w.character;
      const cb = w.combat;

      playerRoot.position.set(c.position.x, c.position.y, c.position.z);
      // 身体用平滑朝向（bodyYaw），头 / 腿由 rig 内部按各自角度分离驱动
      playerRoot.rotation.y = c.bodyYaw;
      // 翻滚：绕身体局部 X 轴前滚一整圈，同时按正弦压低重心贴地。
      // 进度直接取 Core 的 dash.timer / duration，不引入表现层自己的计时状态。
      const rolling = w.dash.phase === 'active' && w.dash.kind === 'roll';
      const rollT = rolling && w.dash.duration > 0
        ? Math.min(1, 1 - w.dash.timer / w.dash.duration)
        : 0;
      rollPivot.rotation.x = rolling ? rollT * Math.PI * 2 : 0;
      rollPivot.position.y = ROLL_PIVOT_Y - (rolling ? 0.2 * Math.sin(Math.PI * rollT) : 0);
      // coreTime 传 Core 的 world.time：落地缓冲脉冲因此与暂停 / 时间缩放 / 单步同步
      voxel.update(c, cb, w.playerHurt, frameDt, w.abilities.channeling, w.time, w.playerLink);

      for (let i = 0; i < dummyRigs.length; i++) {
        if (w.dummies[i]) dummyRigs[i].update(w.dummies[i], frameDt);
      }

      // 目标指示环跟随锁定假人，轻微呼吸，让「智能选目标」看得见
      const target = w.targeting.hasTarget ? w.dummies[w.targeting.targetId - 1] : undefined;
      targetRing.visible = !!target;
      if (target) {
        targetRing.position.set(target.position.x, target.position.y + 0.03, target.position.z);
        targetRing.scale.setScalar(1 + 0.07 * Math.sin(w.time * 6));
      }

      fxAnchor.position.set(c.position.x, c.position.y, c.position.z);
      fxAnchor.rotation.y = cb.phase !== 'idle' ? cb.attackFacing : c.bodyYaw;

      // 冲刺 / 闪避：翻滚在起点放一圈尘环；闪现在起点 + 落点各放一圈（落点更大更亮）
      if (w.dash.id !== lastDashId) {
        lastDashId = w.dash.id;
        const d = w.dash;
        lastDashKind = d.kind;
        if (d.kind === 'blink') {
          spawnDashRing(d.fromX, d.fromZ, c.position.y, dashFx.blinkColor, 0.9);
          spawnDashRing(d.toX, d.toZ, c.position.y, dashFx.blinkColor, 1.35);
        } else {
          spawnDashRing(d.fromX, d.fromZ, c.position.y, dashFx.rollColor, 1.1);
        }
      }
      for (const r of dashRings) {
        if (r.life <= 0) continue;
        r.life -= frameDt;
        const t = Math.max(0, r.life / dashFx.fxDuration);
        r.mat.opacity = 0.9 * t;
        r.mesh.scale.setScalar(r.base * (0.6 + (1 - t) * 1.2));
        if (r.life <= 0) r.mesh.visible = false;
      }

      // v9a：盾击起手 / 命中各放一圈光环（纯观感，读 Core 持久状态）
      const lk = w.playerLink;
      if (lk.id !== lastLinkId) {
        lastLinkId = lk.id;
        lastLinkHits = lk.hitIds.length;
        spawnLinkRing(c.position.x, c.position.z, c.position.y, 1.0);
      }
      if (lk.hitIds.length > lastLinkHits) {
        lastLinkHits = lk.hitIds.length;
        spawnLinkRing(c.position.x, c.position.z, c.position.y, 1.35);
      } else if (lk.hitIds.length < lastLinkHits) {
        lastLinkHits = lk.hitIds.length;
      }
      for (const r of linkRings) {
        if (r.life <= 0) continue;
        r.life -= frameDt;
        const t = Math.max(0, r.life / Math.max(linkFx.fxDuration, 1e-6));
        r.mat.opacity = 0.85 * t;
        r.mesh.scale.setScalar(r.base * (0.55 + (1 - t) * 1.1));
        if (r.life <= 0) r.mesh.visible = false;
      }

      if (cb.attackId !== lastAttackId) {
        lastAttackId = cb.attackId;
        if (cb.weapon === 'bow' && cb.phase !== 'idle') {
          arrowTime = 0;
          arrowPower = 0.6 + cb.lastCharge * 0.9;
        }
      }

      const showSlash = cb.phase === 'active' && cb.comboIndex > 0;
      slashMat.opacity = showSlash ? 0.78 : 0;
      if (showSlash) {
        slash.rotation.z = -1.2 + cb.attackProgress * 3.2;
        slash.scale.setScalar(0.9 + cb.comboIndex * 0.13);
      }

      // 奥术飞弹：按实体同步位置 / 半径，多余的隐藏（自转纯装饰）
      for (let i = 0; i < bolts.length; i++) {
        const pr = w.abilities.projectiles[i];
        const mesh = bolts[i];
        mesh.visible = !!pr;
        if (pr) {
          mesh.position.set(pr.x, pr.y, pr.z);
          mesh.scale.setScalar(pr.radius);
          mesh.rotation.y += frameDt * 6;
        }
      }
      // 电环：贴地、按剩余寿命淡出；脉冲命中时 Core 会写长受击时长，视觉上体现为持续亮环
      for (let i = 0; i < shockRings.length; i++) {
        const ring = w.abilities.rings[i];
        const e = shockRings[i];
        e.mesh.visible = !!ring;
        if (ring) {
          const t = Math.max(0, Math.min(1, ring.life / Math.max(ring.duration, 1e-6)));
          e.mesh.position.set(ring.x, 0.05, ring.z);
          e.mesh.scale.setScalar(ring.radius);
          e.mat.opacity = 0.25 + 0.55 * t;
        }
      }

      if (arrowTime >= 0) {
        arrowTime += frameDt;
        const dist = arrowTime * 14 * arrowPower;
        arrowFx.position.set(0, 0.85, 0.6 + dist);
        arrowMat.opacity = dist < 9 ? 0.95 : 0;
        if (dist >= 9) arrowTime = -1;
      } else {
        arrowMat.opacity = 0;
      }

      cam.update(c.position.x, c.position.y, c.position.z, frameDt, w.camera);
      renderer.render(scene, cam.camera);
    },
    resize(): void {
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      renderer.setSize(w, h, false);
      cam.resize(w / h);
    },
    getGroundBasis(): GroundBasis {
      return cam.getGroundBasis();
    },
    setCollidersVisible(v): void {
      for (const m of materials) {
        m.opacity = v ? 0.3 : 1;
        m.wireframe = v;
        m.needsUpdate = true;
      }
    },
    setGridVisible(v): void {
      grid.visible = v;
    },
    setZoom(next): void {
      cam.setZoom(next);
    },
    pickDummy,
    projectToScreen,
    diagnostics(): {
      lean: { forward: number; side: number };
      slashNormal: { x: number; y: number; z: number };
      arrowForward: { x: number; y: number; z: number };
      gait: { hipYaw: number; gaitYaw: number };
      attackBlend: number;
      attackWeights: {
        gaitScale: number; attackLegWeight: number; driveSpeed: number; stridePhase: number;
      };
      landing: {
        pulse: number; remaining: number; kind: 'none' | 'land' | 'jump'; impactVy: number;
      };
      hurt: HurtPose;
      /** v8g：足部 IK 锚定诊断（active / weight / clamped / maxError） */
      ik: { active: boolean; weight: number; clamped: number; maxError: number };
      link: {
        phase: string; kind: string; window: number; cooldown: number;
        progress: number; hits: number; id: number;
      };
      dash: { rollAngle: number; activeRings: number; lastKind: string };
      camera: {
        threat: number;
        threatCount: number;
        distanceScale: number;
        offsetX: number;
        offsetZ: number;
        pitchDelta: number;
        /** v8e：平滑后的用户缩放倍率（>1 拉远、<1 拉近） */
        zoom: number;
      };
    } {
      // v7c #10：斩击弧中心轴（盘面法线）恒为角色正前方（局部 +Z），再绕身体朝向
      // 旋转到世界空间。用纯函数 fx-axis 计算，与 tests/fx-axis.test.ts 共用同一份定义，
      // 便于把「特效轴朝哪」直接读出 / 断言；撤销了 v6a 的 -pitchDeg 倾斜，故 y 恒为 0
      // （水平朝前），不再是斜前上方。
      const axisLocal = slashAxisLocal(view.camera.pitchDeg);
      const axisWorld = rotateAxisY(axisLocal, fxAnchor.rotation.y);
      return {
        lean: voxel.lean(),
        slashNormal: axisWorld,
        arrowForward: voxel.arrowDirection(),
        gait: { hipYaw: voxel.hipYaw(), gaitYaw: voxel.gaitYaw() },
        attackBlend: voxel.attackBlend(),
        attackWeights: voxel.attackWeights(),
        landing: voxel.landing(),
        hurt: voxel.hurt(),
        ik: voxel.ik(),
        link: {
          phase: world.playerLink.phase,
          kind: world.playerLink.kind,
          window: world.playerLink.linkWindow,
          cooldown: world.playerLink.cooldown,
          progress: world.playerLink.progress,
          hits: world.playerLink.hitIds.length,
          id: world.playerLink.id,
        },
        dash: {
          rollAngle: rollPivot.rotation.x,
          activeRings: dashRings.filter((r) => r.life > 0).length,
          lastKind: lastDashKind,
        },
        camera: {
          threat: world.camera.threat,
          threatCount: world.camera.threatCount,
          ...cam.smart(),
        },
      };
    },
    dispose(): void {
      voxel.dispose();
      for (const rig of dummyRigs) rig.dispose();
      targetRing.geometry.dispose();
      targetRingMat.dispose();
      slash.geometry.dispose();
      slashMat.dispose();
      boltGeo.dispose();
      boltMat.dispose();
      shockGeo.dispose();
      for (const e of shockRings) e.mat.dispose();
      arrowFx.geometry.dispose();
      arrowMat.dispose();
      for (const r of dashRings) r.mat.dispose();
      dashRingGeo.dispose();
      for (const r of linkRings) r.mat.dispose();
      linkRingGeo.dispose();
      boxGroup.traverse((obj) => {
        if (obj instanceof THREE.Mesh) obj.geometry.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

import * as THREE from 'three';

/**
 * v9s.77 · **测试截图机位**（ShotCam）
 *
 * 存在的理由：游戏相机（`camera-rig.ts`）是给玩家看的，不是给截图用的 ——
 *
 *  - 注视点写死成「脚下 + 0.6m（腰高）」，`snapCamera(x, y, z)` 传的是**脚下**坐标，
 *    想拍脚就只能把相机的注视点抬到腰以上，脚自然被挤出画面；
 *  - 一旦 `yaw ≠ 0`，智能构图的 `offsetX` 会把角色横向推出画幅（追威胁质心）；
 *  - 每帧 `cam.update()` 会把位置 / 朝向全部重算，还叠震动与微推，截图必然带抖。
 *
 * 于是 v9s.76 拍脚掌折角时，四张特写全拍成腰以上 —— 相机在跟一个不可控的注视点。
 *
 * 这个工具的思路很直接：**每帧在 `cam.update()` 之后把相机整个接管**，
 * 位置 / 朝向 / fov 全由调用方给，跟游戏相机彻底脱钩。
 *
 * 用法（浏览器侧，`__harness.view`）：
 * ```js
 * // 相对角色（脚底原点，朝向 = 角色朝向）：从右侧 0.8m、抬高 0.12m 看脚踝
 * view.shotTake({ anchor: 'hero', eye: [0.8, 0.12, 0], look: [0, 0.08, 0], fov: 28 });
 *
 * // 跟随某根骨头：以左脚前掌为原点，站在它正侧方 0.45m
 * view.shotTake({ anchor: 'node', node: 'ballL', eye: [0.45, 0.04, 0], fov: 24 });
 *
 * // 世界坐标（只跟位置，不跟朝向）
 * view.shotTake({ anchor: 'hero', eye: [0, 1.6, 3.2], world: true, fov: 35 });
 *
 * view.shotRelease();   // 交还游戏相机
 * ```
 *
 * 关键设计取舍：
 *
 *  1) **`eye` / `look` 是「相对锚点的偏移」，不是绝对坐标**。截图诉求几乎都是
 *     「站在这只脚的正侧方」「从角色背后 3m」——用相对量写，角色一动、转身、换体型，
 *     机位跟着走，不用每次重算。需要绝对坐标时 `world: true`。
 *  2) **朝向用 `look`（两个点定视线），不用欧拉角**。给欧拉角要同时想清楚轴序、
 *     是不是局部轴、yaw 正负往哪边转 —— 三个坑叠在一起，调一次错一次。
 *     「从哪看」+「看哪」两个点是没有歧义的。
 *  3) **`fov` 可调**，而且不还原就是默认值。特写用小 fov（长焦）透视压缩更像镜头，
 *     广角会把 0.15m 的脚拍成一只拖鞋。
 */

/** 跟什么：角色根 / 骨架里的命名节点 / 固定世界点。 */
export type ShotAnchor = 'hero' | 'node' | 'world';

export type ShotSpec = {
  /** 默认 `hero`（角色根：脚底原点 + 角色朝向）。 */
  anchor?: ShotAnchor;
  /** `anchor: 'node'` 时要找的节点名（骨架里的 `name`，如 `footTipL` / `ballL` / `chest`）。 */
  node?: string;
  /** `anchor: 'world'` 时的锚点世界坐标；`node` 找不到时也用它兜底。 */
  at?: [number, number, number];
  /** **相机位置相对锚点的偏移**（米）。`world: true` 时按世界方向解释。 */
  eye: [number, number, number];
  /** **注视点相对锚点的偏移**（米），缺省 `[0, 0, 0]` = 锚点本身。 */
  look?: [number, number, number];
  /** 视线绕自身轴的滚转（度）。俯拍地平线歪了用它摆正。 */
  roll?: number;
  /** 垂直视角（度）。不传则沿用当前值；`shotRelease()` 会还原成接管前的值。 */
  fov?: number;
  /** `true` = `eye` / `look` 按世界方向解释（只跟随锚点**位置**，不跟随朝向）。 */
  world?: boolean;
  /**
   * 补光强度（0 = 关）。特写专用：场景是暗色调夜景，0.18m 的脚贴在暗地面上，
   * 不补光拍出来就是一团黑 —— 折角 / 穿地在图上完全读不出来（v9s.76 的教训）。
   * 1.2 大约是「看清结构但不把画面洗白」的量。只影响截图，`release()` 归零。
   */
  light?: number;
};

export type ShotInfo = {
  anchor: ShotAnchor;
  /** `anchor: 'node'` 时实际找到的节点名；找不到为 `null`。 */
  node: string | null;
  /** 节点没找到、退化成角色根时是 `false` —— 静默兜底会让截图「看着对但其实跟错了对象」。 */
  found: boolean;
  /**
   * `fit()` 实际拿来做包围盒的节点名。
   * 纯锚点（`footTipL`）自己没有几何，会向上退到第一个有几何的祖先（`ankleL`）——
   * 明说出来，否则「我让它拍脚末端、它拍了一整只脚」是无声的。
   */
  measured: string | null;
  eye: { x: number; y: number; z: number };
  look: { x: number; y: number; z: number };
  /** 眼睛到注视点的距离（米）。 */
  dist: number;
  fov: number;
  /** 画幅宽高比（= 渲染尺寸）。 */
  aspect: number;
};

const DEG = Math.PI / 180;
const _pos = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _eye = new THREE.Vector3();
const _look = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _box = new THREE.Box3();
const _sphere = new THREE.Sphere();
const _corner = new THREE.Vector3();
const _vUp = new THREE.Vector3();
const _vSide = new THREE.Vector3();
const _lightDir = new THREE.Vector3();
const IDENTITY = new THREE.Quaternion();
/** 世界 Y 轴（`resolve` 每帧取角色 yaw 用，避免每帧 new）。 */
const UP_Y = new THREE.Vector3(0, 1, 0);

export class ShotCam {
  private spec: ShotSpec | null = null;
  private info: ShotInfo | null = null;
  /** 接管前的 fov：`release()` 还原它，避免「截完图游戏视角变焦了」 */
  private baseFov = 0;

  /** 法线着色模式下被替换的 mesh 及原材质（release / 关闭时还原）。 */
  private xraySaved: { mesh: THREE.Mesh; mat: THREE.Material | THREE.Material[] }[] = [];

  /** 截图补光：一盏跟着相机的平行光 + 一盏半球光提暗部。接管时才亮。 */
  private readonly light = new THREE.DirectionalLight(0xffffff, 0);
  private readonly lightTarget = new THREE.Object3D();
  private readonly hemi = new THREE.HemisphereLight(0xffffff, 0x555566, 0);

  constructor(
    private readonly camera: THREE.PerspectiveCamera,
    /** 角色根（承载位置与 bodyYaw）与骨架（承载骨骼动画）。 */
    private readonly roots: { heroRoot: THREE.Object3D; hero: THREE.Object3D },
    scene?: THREE.Scene,
  ) {
    if (scene) {
      // 平行光要同时把 target 挂进场景才生效（THREE 的约定：只读 target 的世界矩阵）。
      scene.add(this.lightTarget);
      this.light.target = this.lightTarget;
      scene.add(this.light);
      scene.add(this.hemi);
    }
  }

  /** 当前是否在接管相机。 */
  active(): boolean {
    return this.spec !== null;
  }

  /** 开始 / 更新机位。反复调用即「跟随机位」，不需要先 release。 */
  take(spec: ShotSpec): ShotInfo {
    if (!this.spec) this.baseFov = this.camera.fov;
    this.spec = spec;
    return this.apply()!;
  }

  /** 交还游戏相机（下一帧 `cam.update()` 重新接管位置 / 朝向）。 */
  release(): void {
    if (!this.spec) return;
    this.spec = null;
    this.info = null;
    this.xrayOff();
    this.light.intensity = 0;
    this.hemi.intensity = 0;
    if (this.baseFov > 0) {
      this.camera.fov = this.baseFov;
      this.camera.updateProjectionMatrix();
    }
  }

  /** 上一帧实际生效的机位读数。 */
  read(): ShotInfo | null {
    return this.info;
  }

  /**
   * 法线着色（验收用）：把 `node` 子树的材质临时换成 `MeshNormalMaterial`。
   *
   * 存在的理由很具体：鞋 / 布料这类近黑材质（反照率接近 0）在**任何补光下都是黑块**，
   * 折角、自穿插、脚尖入地在截图里完全读不出来。法线着色按面朝向上色 ——
   * 折角两侧朝向不同 = 颜色不同，穿地 = 边缘被地面切掉，一眼就能看出来。
   *
   * 这是**技术验收视图**，不是给玩家看的画面。返回替换的 mesh 数量。
   */
  xray(node: string | null, on = true): number {
    this.xrayOff();
    if (!on) return 0;
    let root: THREE.Object3D | null =
      (node ? this.roots.hero.getObjectByName(node) : this.roots.hero) ?? null;
    if (!root) return 0;
    // 空锚点（`footTipL`）没有 mesh —— 与 `fit()` 同一套规则：向上退到第一个有
    // 几何的祖先。不退的话 `--xray footTipL` 会一个 mesh 都换不到（实测如此）。
    const hasMesh = (o: THREE.Object3D): boolean => {
      let hit = false;
      o.traverse((x) => { if ((x as THREE.Mesh).isMesh) hit = true; });
      return hit;
    };
    let guard = 0;
    while (!hasMesh(root) && root.parent && guard++ < 8) root = root.parent ?? null;
    if (!hasMesh(root)) return 0;

    const mat = new THREE.MeshNormalMaterial({ flatShading: true });
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh || !mesh.geometry) return;
      this.xraySaved.push({ mesh, mat: mesh.material });
      mesh.material = mat;
    });
    return this.xraySaved.length;
  }

  /** 还原法线着色。`release()` 也会调，避免「截完图角色永远是彩色的」。 */
  xrayOff(): void {
    for (const s of this.xraySaved) s.mesh.material = s.mat;
    this.xraySaved.length = 0;
  }

  /**
   * 每帧在 `cam.update()` **之后**调用：位置 / 朝向 / fov 全部覆盖。
   *
   * 放在 update 之后而不是「跳过 update」，是因为相机还被别的东西用着
   * （拍照之外，`projectPoint` 之类的读数依赖同一台相机）——
   * 覆盖比让 update 走分支简单，也不会漏掉 update 里的其它状态（near/far/aspect）。
   */
  apply(): ShotInfo | null {
    const s = this.spec;
    if (!s) return null;

    const resolved = this.resolve(s);
    const basis = s.world ? IDENTITY : resolved.quaternion;

    _eye.fromArray(s.eye).applyQuaternion(basis).add(resolved.position);
    _look.fromArray(s.look ?? [0, 0, 0]).applyQuaternion(basis).add(resolved.position);

    this.camera.position.copy(_eye);
    // 先摆正 up 再 lookAt：`lookAt` 用 camera.up 决定画面的「上」，
    // 上一张要是被 roll 拧过，这里不重置就会累积歪掉。
    this.camera.up.set(0, 1, 0);
    this.camera.lookAt(_look);
    if (s.roll) this.camera.rotateZ(s.roll * DEG);
    if (s.fov && s.fov !== this.camera.fov) {
      this.camera.fov = s.fov;
      this.camera.updateProjectionMatrix();
    }

    const li = s.light ?? 0;
    this.light.intensity = li;
    this.hemi.intensity = li * 0.5;
    if (li > 0) {
      // 光**不能**和视线同向 —— 那是平光，所有朝向的面一样亮，纯黑的鞋拍出来
      // 是一团没有结构的黑块（v9s.77 第一版就是这样，脚掌折角完全看不出来）。
      // 抬到斜上方 38°、再往侧面偏 25°：顶面亮、侧面暗，折角两侧的倾角差
      // 才能变成明暗差；侧偏让立方体的竖向棱也有一条亮边。
      _lightDir.subVectors(_eye, _look).normalize();
      _lightDir.applyAxisAngle(_vSide, -38 * DEG);
      _lightDir.applyAxisAngle(_vUp, 25 * DEG);
      this.light.position.copy(_look).addScaledVector(_lightDir, 3);
      this.lightTarget.position.copy(_look);
    }

    this.info = {
      anchor: s.anchor ?? 'hero',
      node: resolved.node,
      found: resolved.found,
      measured: null,
      eye: { x: _eye.x, y: _eye.y, z: _eye.z },
      look: { x: _look.x, y: _look.y, z: _look.z },
      dist: _eye.distanceTo(_look),
      fov: this.camera.fov,
      aspect: this.camera.aspect,
    };
    return this.info;
  }

  /**
   * 自动取景：把 `node`（不传 = 整副骨架）的包围盒塞满画面，从 `dir` 方向看。
   *
   * 「拍满这只脚」这类诉求用 `eye` 硬凑距离要试好几轮 —— 脚只有 0.18m，
   * 差 5cm 就从「占满画幅」变成「一个点」。这里按 fov 反算距离。
   *
   * 半径取的是**视线垂直面上的投影半径**，不是 AABB 半对角线：
   * 后者对细长 / 扁平目标会大出 √3 倍（实测一只脚只占画幅 54%），
   * 而从任何方向看都刚好贴边的判据是「所有角点去掉视线方向分量后的最大长度」。
   *
   * `pad` 是留白系数（1.25 = 四周各留 12.5%），`dir` 会被归一化。
   */
  fit(
    node: string | null,
    dir: [number, number, number],
    pad = 1.25,
    fov?: number,
  ): ShotInfo | null {
    const target = node ? this.roots.hero.getObjectByName(node) : this.roots.hero;
    if (!target) return null;

    target.updateWorldMatrix(true, true);
    _box.setFromObject(target);
    // 纯锚点（`footTipL` / `footTipR` 这类空 Object3D）没有几何，包围盒是空的 ——
    // 自动取景对它们没意义，但「以它为原点拍它所在的部位」是很自然的需求。
    // 往上走到第一个有几何的祖先（末端 → 整只脚 → 小腿），读作「拍这块」。
    let measured: THREE.Object3D | null = target;
    while (measured && !Number.isFinite(_box.min.x)) {
      measured = measured.parent;
      if (!measured || measured === this.roots.heroRoot) break;
      measured.updateWorldMatrix(true, true);
      _box.setFromObject(measured);
    }
    if (!Number.isFinite(_box.min.x)) return null;
    _box.getBoundingSphere(_sphere);
    const center = _sphere.center;

    _dir.fromArray(dir);
    if (_dir.lengthSq() < 1e-9) _dir.set(0, 0, 1);
    _dir.normalize();

    // 屏幕基：竖直 / 水平两个方向分别量展开量。
    // 只取一个「垂直面上的最大半径」是不对的 —— 那个半径斜着，投影到屏幕上
    // 只占一部分；实测按它算距离，目标只填到画幅 72%。
    _vUp.set(0, 1, 0);
    if (Math.abs(_vUp.dot(_dir)) > 0.999) _vUp.set(0, 0, 1);   // 正俯视时的退化方向
    _vUp.addScaledVector(_dir, -_vUp.dot(_dir)).normalize();    // 去掉视线分量 = 屏幕竖直
    _vSide.crossVectors(_dir, _vUp).normalize();                // = 屏幕水平

    let ry = 0;
    let rx = 0;
    for (let i = 0; i < 8; i++) {
      _corner.set(
        i & 1 ? _box.max.x : _box.min.x,
        i & 2 ? _box.max.y : _box.min.y,
        i & 4 ? _box.max.z : _box.min.z,
      ).sub(center);
      ry = Math.max(ry, Math.abs(_corner.dot(_vUp)));
      rx = Math.max(rx, Math.abs(_corner.dot(_vSide)));
    }
    ry = Math.max(ry, 1e-3);
    rx = Math.max(rx, 1e-3);

    const vfov = (fov ?? this.spec?.fov ?? this.camera.fov) * DEG;
    // 屏幕半高 = dist·tan(halfV)，要求目标半高 ≤ (1/pad)·半高 → dist ≥ 半高·pad/tan。
    // 用 tan 而不是 sin：sin 是「外接球内切」的解，对扁平的矩形会系统性偏远。
    // 两个方向都要满足，取更大的距离（宽画幅下水平才是瓶颈）。
    const tanV = Math.tan(vfov / 2);
    const tanH = tanV * this.camera.aspect;
    const dist = Math.max(ry / tanV, rx / tanH) * pad;

    const info = this.take({
      anchor: 'world',
      at: [center.x, center.y, center.z],
      eye: [_dir.x * dist, _dir.y * dist, _dir.z * dist],
      world: true,
      fov: fov ?? this.spec?.fov,
    });
    // 把「实际量了谁」写回读数：节点是空锚点时会退到祖先，不说就是静默降级。
    info.measured = measured ? (measured.name || null) : null;
    if (this.info) this.info.measured = info.measured;
    return info;
  }

  private resolve(s: ShotSpec): {
    position: THREE.Vector3;
    quaternion: THREE.Quaternion;
    node: string | null;
    found: boolean;
  } {
    const anchor = s.anchor ?? 'hero';

    if (anchor === 'node') {
      const obj = s.node ? this.roots.hero.getObjectByName(s.node) : null;
      if (obj) {
        obj.getWorldPosition(_pos);
        // 节点自身朝向：让「以这块骨头为原点」有直观语义（前掌 → 相机沿脚掌方向摆）。
        obj.getWorldQuaternion(_quat);
        return { position: _pos.clone(), quaternion: _quat.clone(), node: s.node!, found: true };
      }
      // 找不到就退到 `at`，但 `found` 报 false —— 静默退化成角色根会让截图
      // 「看着还行、其实跟错了对象」，而截图工具最怕的就是这种无声的错。
      _pos.fromArray(s.at ?? [0, 0, 0]);
      return { position: _pos.clone(), quaternion: IDENTITY.clone(), node: s.node ?? null, found: false };
    }

    if (anchor === 'world') {
      _pos.fromArray(s.at ?? [0, 0, 0]);
      return { position: _pos.clone(), quaternion: IDENTITY.clone(), node: null, found: true };
    }

    // hero：位置用角色根，朝向只取世界 Y 轴（剥掉翻滚枢轴那层 X 旋转）——
    // 翻滚到一半时跟随机位不该跟着天旋地转。
    this.roots.heroRoot.getWorldPosition(_pos);
    this.roots.heroRoot.getWorldQuaternion(_quat);
    // 模型**前方是 +Z**：脚尖、前冲（`impulse = (sin(facing), cos(facing))`）、
    // 剑的指向全按 +Z 建模。这里若写成 -Z（three 相机习惯），角色一转身
    // 机位就跑到背后去了，而且眼睛和注视点的相对方位整个镜像。
    _dir.set(0, 0, 1).applyQuaternion(_quat);
    _quat.setFromAxisAngle(UP_Y, Math.atan2(_dir.x, _dir.z));
    return { position: _pos.clone(), quaternion: _quat.clone(), node: null, found: true };
  }
}

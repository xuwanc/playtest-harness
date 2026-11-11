/**
 * v8f 骨架层级的测试取值入口。
 *
 * 新结构：root → pelvis(髋部) → [lower(腿), upper(上半身)]，
 * lower → [hipL, hipR] → knee → 小腿 / 鞋；upper → 躯干 / 头 / 手臂 / 武器。
 *
 * 旧测试用 `rig.group.children[0]/[1]` 硬编码下标，骨架一演进就整片失效。
 * 现在统一按 name 查找（节点在 voxel-rig / dummy-rig 里都显式命名），
 * 以后再改层级只需改这一处，也顺带让断言表达「我在测哪根骨头」而不是「第几个子节点」。
 */
export type RigNodes = {
  pelvis: any;
  lower: any;
  upper: any;
  /** v9s.33：脊柱分段后的胸段（未开启脊柱分段时为 null） */
  chest: any | null;
  hipL: any;
  hipR: any;
  kneeL: any;
  kneeR: any;
};

/** 玩家 VoxelRig 与假人 DummyRig 都有 group，结构同构，故用最小结构类型约束。 */
export function rigNodes(rig: { group: any }): RigNodes {
  const byName = (n: string): any => {
    const o = rig.group.getObjectByName(n);
    if (!o) throw new Error(`骨架缺少命名节点 ${n}（检查 voxel-rig 层级）`);
    return o;
  };
  const hipL = byName('hipL');
  const hipR = byName('hipR');
  const childByName = (parent: any, n: string): any => {
    const o = parent.getObjectByName(n);
    if (!o) throw new Error(`骨架节点下缺少 ${n}`);
    return o;
  };
  return {
    pelvis: byName('pelvis'),
    lower: byName('lower'),
    upper: byName('upper'),
    chest: rig.group.getObjectByName('chest') ?? null,
    hipL,
    hipR,
    kneeL: childByName(hipL, 'kneeL'),
    kneeR: childByName(hipR, 'kneeR'),
  };
}

/**
 * v9s.72：脊柱链上的关节（自下而上，`upper` → `spine1` → `spine2` → `chest`）。
 *
 * 段数可配（2 ~ 4），所以不能再写死「upper + chest 两段」。这里顺着子节点名字
 * 走一遍链，段数改了测试不用跟着改。
 */
export function spineChain(rig: { group: any }): any[] {
  const out: any[] = [];
  let node = rig.group.getObjectByName('upper');
  if (!node) return out;
  out.push(node);
  for (let i = 0; i < 8; i++) {
    const next = (node.children ?? []).find(
      (c: any) => c.name === 'chest' || /^spine\d+$/.test(c.name ?? ''),
    );
    if (!next) break;
    out.push(next);
    node = next;
  }
  return out;
}

/**
 * v9s.33 / v9s.72：躯干**总**偏航 = 整条脊柱链的局部角之和。
 * 脊柱分段后 `upper` 只是腰段，读「躯干朝到哪」必须把下游各级加回来。
 */
export function torsoYawOf(rig: { group: any }): number {
  return spineChain(rig).reduce((sum, n) => sum + (n.rotation?.y ?? 0), 0);
}

/** 躯干总俯仰（同上）。 */
export function torsoPitchOf(rig: { group: any }): number {
  return spineChain(rig).reduce((sum, n) => sum + (n.rotation?.x ?? 0), 0);
}

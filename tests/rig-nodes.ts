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
    hipL,
    hipR,
    kneeL: childByName(hipL, 'knee'),
    kneeR: childByName(hipR, 'knee'),
  };
}

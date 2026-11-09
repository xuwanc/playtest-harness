(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=e(a);fetch(a.href,s)}})();const fa=["sword-shield","dual-swords","greatsword","staff","bow"],og=["wander","follow","keep-distance","attack","idle"],gp=["spar","wander","follow","keep-distance","attack","idle"],xp={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},Br=1e-6;function To(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Br?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>Br?Math.atan2(t.moveX,t.moveZ):n.character.facing}function rg(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Br){const a=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/a,z:t.aimZ/a}}const e=Math.hypot(t.moveX,t.moveZ);if(e>Br)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const Ve=1e-6,ca=Math.PI/180,Oh=-1e9;function vp(){return{type:"none",lastAt:Oh,timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function xo(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function $d(n,t,e,i,a){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=a,n.knockX=0,n.knockZ=0}function Bh(n,t,e){var l,d;const i=e.duration>0?e.duration:ac(n,e.type);if(t.kind==="player"){const u=n.playerHurt;if($d(u,e.type,i,e.dirX,e.dirZ),u.lastAt=n.time,!n.config.hits.noDamageToPlayer&&e.knockback>Ve){const h=e.knockback*n.config.hits.knockbackDecay;u.knockX=e.dirX*h,u.knockZ=e.dirZ*h}xo(n,"player-hurt",e.sourceId??0,n.character.position);return}const a=n.dummies[t.index];if(!a)return;if($d(a.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>Ve){const u=e.knockback*n.config.hits.knockbackDecay;a.hurt.knockX=e.dirX*u,a.hurt.knockZ=e.dirZ*u}n.hitCount+=1,xo(n,"hit",a.id,a.position);const s=n.config.hits.hitstop;let o=((l=n.config.hits.hitstopByWeapon)==null?void 0:l[n.combat.weapon])??1;const r=n.config.hits.hitstopComboFalloff;if(r&&r.length>0){const u=Math.max(0,Math.min(r.length-1,n.combat.comboIndex-1));o*=Math.max(0,r[u])}o*=Math.max(0,e.holdMul??1);const c=s&&e.type!=="none"?(s[e.type]??0)*Math.max(0,o):0;c>0&&n.combat.hitstop<c&&(n.combat.hitstop=c,n.combat.warpPhase=1,n.combat.warp=(d=n.config.hits.hitstopWarp)!=null&&d.enabled?Math.max(0,Math.min(1,n.config.hits.hitstopWarp.holdRate)):0,xo(n,"hitstop",c,a.position))}function Uo(n,t,e){Bh(n,{kind:"dummy",index:t},e)}function cg(n,t){const e=[n.playerHurt];for(const a of n.dummies)e.push(a.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const a of e)a.timer>0&&(a.timer=Math.max(0,a.timer-t),a.timer===0&&(a.type="none",a.knockX=0,a.knockZ=0)),(a.knockX!==0||a.knockZ!==0)&&(a.knockX*=i,a.knockZ*=i,Math.abs(a.knockX)<1e-4&&(a.knockX=0),Math.abs(a.knockZ)<1e-4&&(a.knockZ=0))}function ac(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function Hr(n,t){if(n.length===0)return 0;if(t<=n[0][0])return n[0][1];for(let e=1;e<n.length;e++){const[i,a]=n[e];if(t<=i){const[s,o]=n[e-1],r=i>s?(t-s)/(i-s):1;return o+(a-o)*r}}return n[n.length-1][1]}function yp(n){let t=n;for(;t>180;)t-=360;for(;t<-180;)t+=360;return t}function Mp(n){var v,g;const t=n.combat,e=n.character.position,i={active:!1,x:e.x,z:e.z,facing:t.attackFacing,fx:Math.sin(t.attackFacing),fz:Math.cos(t.attackFacing),reach:0,cosArc:1,sweepActive:!1,sweepLo:0,sweepHi:0,slamRadius:0,slamX:e.x,slamZ:e.z};if(t.phase!=="active"||t.weapon==="bow")return i;const a=n.config.hits,s=n.config.combat.weapons[t.weapon],o=s==null?void 0:s.hitWindow,r=o?Math.min(1,Math.max(0,o.start)):0,c=o?Math.min(1,Math.max(r,o.end)):1,l=t.timings.active,d=l>Ve?Math.min(1,Math.max(0,t.phaseTimer/l)):1;if(d<r-Ve||d>c+Ve)return i;i.active=!0,i.reach=a.reach[t.weapon]??0,i.cosArc=Math.cos(Math.min(90,Math.max(0,a.arcDeg))*ca);const u=s==null?void 0:s.hitSweep,h=((v=u==null?void 0:u.byCombo)==null?void 0:v[String(t.comboIndex)])??((g=u==null?void 0:u.byCombo)==null?void 0:g["1"]),f=(u==null?void 0:u.tolDeg)??10;if(h){if(typeof h.stabU=="number"){if(d<h.stabU)return i.active=!1,i}else if(h.pts&&h.pts.length>=2){const p=Hr(h.pts,0),_=Hr(h.pts,d);i.sweepActive=!0,i.sweepLo=Math.min(p,_)-f,i.sweepHi=Math.max(p,_)+f}}const m=s==null?void 0:s.groundSlam;return m&&d>=m.slamU-Ve&&t.slamAttackId===t.attackId&&(i.slamRadius=Math.max(0,m.radius),i.slamX=e.x+i.fx*Math.min(i.slamRadius*.25,.5),i.slamZ=e.z+i.fz*Math.min(i.slamRadius*.25,.5)),i}function lg(n,t,e,i){if(!n.active)return!1;const a=t-n.x,s=e-n.z,o=Math.sqrt(a*a+s*s);if(o>n.reach+i||o>Ve&&(a*n.fx+s*n.fz)/o<n.cosArc)return!1;if(n.sweepActive){const r=yp(Math.atan2(a,s)/ca-n.facing/ca);if(r<n.sweepLo||r>n.sweepHi)return!1}return!0}function hg(n,t,e,i){if(n.slamRadius<=0)return!1;const a=t-n.slamX,s=e-n.slamZ;return a*a+s*s<=(n.slamRadius+i)*(n.slamRadius+i)}function dg(n){var w,E;const t=n.combat,e=n.config.hits,i=n.character.position;if(t.weapon==="bow")return;const a=n.config.combat.weapons[t.weapon],s=a==null?void 0:a.hitWindow,o=s?Math.min(1,Math.max(0,s.start)):0,r=s?Math.min(1,Math.max(o,s.end)):1,c=t.timings.active,l=c>Ve?Math.min(1,Math.max(0,t.phaseTimer/c)):1;if(l<o-Ve||l>r+Ve)return;const d=e.reach[t.weapon]??0,u=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*ca),h=Math.sin(t.attackFacing),f=Math.cos(t.attackFacing),m=n.config.dummies.radius,v=n.config.targeting.idealRange,g=a==null?void 0:a.hitSweep,p=((w=g==null?void 0:g.byCombo)==null?void 0:w[String(t.comboIndex)])??((E=g==null?void 0:g.byCombo)==null?void 0:E["1"]),_=(g==null?void 0:g.tolDeg)??10;let x=0,M=0,S=!1;if(p){if(typeof p.stabU=="number"){if(l<p.stabU)return}else if(p.pts&&p.pts.length>=2){const T=Hr(p.pts,0),b=Hr(p.pts,l);x=Math.min(T,b)-_,M=Math.max(T,b)+_,S=!0}}for(const T of n.dummies){if(t.hitIds.indexOf(T.id)>=0)continue;const b=T.position.x-i.x,y=T.position.z-i.z,C=Math.hypot(b,y);if(C>d+m)continue;const I=C>Ve?b/C:h,R=C>Ve?y/C:f;if(C>Ve&&(b*h+y*f)/C<u)continue;if(S){const G=yp(Math.atan2(b,y)/ca-t.attackFacing/ca);if(G<x||G>M)continue}let U="light";t.weapon==="greatsword"?U="knock":t.comboIndex>=3&&(U="heavy");const L=e.knockback[t.weapon]??0;let k=C;L>0&&(k=Math.max(C+L,v));const B=Math.max(0,k-C);Uo(n,n.dummies.indexOf(T),{type:U,duration:ac(n,U),dirX:I,dirZ:R,knockback:B}),t.hitIds.push(T.id)}}function ug(n){const t=n.combat,e=n.config.combat.weapons[t.weapon],i=e==null?void 0:e.groundSlam;if(!i||t.slamAttackId===t.attackId)return;const a=t.timings.active;if((a>Ve?Math.min(1,Math.max(0,t.phaseTimer/a)):1)<i.slamU-Ve)return;t.slamAttackId=t.attackId;const o=n.config.hits,r=n.character.position,c=Math.sin(t.attackFacing),l=Math.cos(t.attackFacing),d=n.config.dummies.radius,u=Math.max(0,i.radius),h=i.onlyUnhit!==!1,f=i.type??(t.weapon==="greatsword"?"knock":"heavy"),m=i.knockback??o.knockback[t.weapon]??0,v=n.config.targeting.idealRange,g=i.holdMul??1.6;for(let p=0;p<n.dummies.length;p++){const _=n.dummies[p];if(h&&t.hitIds.indexOf(_.id)>=0)continue;const x=_.position.x-r.x,M=_.position.z-r.z,S=Math.hypot(x,M);if(S>u+d)continue;const w=S>Ve?x/S:c,E=S>Ve?M/S:l,T=m>0?Math.max(S+m,v):S,b=Math.max(0,T-S);Uo(n,p,{type:f,duration:ac(n,f),dirX:w,dirZ:E,knockback:b,holdMul:g}),t.hitIds.push(_.id)}xo(n,"ground-slam",u,{x:r.x+c*Math.min(u*.25,.5),y:r.y,z:r.z+l*Math.min(u*.25,.5)})}function fg(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const a=i.weapon===""?void 0:e.moves[i.weapon];if(!a||!a.enabled||!n.modules.hits||!n.modules.dummies)return;const s=a.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(s.pulseInterval,0);const o=n.character.position,r=i.fromX,c=i.fromZ,l=o.x,d=o.z,u=l-r,h=d-c,f=u*u+h*h,m=Math.sin(i.facing),v=Math.cos(i.facing),g=Math.cos(Zd(s.arcDeg,0,180)*ca),p=n.config.dummies.radius;for(let _=0;_<n.dummies.length;_++){const x=n.dummies[_];if(i.hitIds.indexOf(x.id)>=0)continue;const M=f>Ve?Zd(((x.position.x-r)*u+(x.position.z-c)*h)/f,0,1):0,S=r+u*M,w=c+h*M,E=Math.hypot(x.position.x-S,x.position.z-w);let T=!1;if(s.shape==="circle")T=E<=s.radius+p;else if(s.shape==="capsule")T=E<=Math.max(s.radius,s.width)+p;else{const U=x.position.x-l,L=x.position.z-d,k=Math.hypot(U,L),B=k>Ve?(U*m+L*v)/k>=g:!0;T=k<=s.radius+p&&B||E<=s.width+p}if(!T)continue;const b=x.position.x-r,y=x.position.z-c,C=Math.hypot(b,y);if(C>Ve&&(b*m+y*v)/C<Math.cos(Math.max(s.arcDeg,90)*ca))continue;const I=C>Ve?b/C:m,R=C>Ve?y/C:v;Bh(n,{kind:"dummy",index:_},{type:s.type,duration:s.duration,dirX:I,dirZ:R,knockback:s.knockback}),i.hitIds.push(x.id),xo(n,"link-hit",x.id,x.position)}}function pg(n){const t=n.config.hits,e=n.config.dummies.fighters,i=n.character.position;for(const a of n.events){if(a.type!=="dummy-hit")continue;const s=n.dummies[a.value-1];if(!s)continue;const o=s.weapon?t.reach[s.weapon]??t.dummyReach:t.dummyReach,r=i.x-s.position.x,c=i.z-s.position.z,l=Math.hypot(r,c);if(l>o)continue;const d=l>Ve?r/l:0,u=l>Ve?c/l:1,f=(s.weapon?Math.max(t.knockback[s.weapon]??0,t.dummyKnockback):t.dummyKnockback)*(s.weapon?(e==null?void 0:e.knockbackScale)??1:1),v=s.weapon==="greatsword"&&s.attackComboLeft<=0?"knock":"light";Bh(n,{kind:"player"},{type:v,duration:ac(n,v),dirX:d,dirZ:u,knockback:f,sourceId:s.id})}}function mg(n,t){n.modules.hits&&(n.combat.phase==="active"&&(dg(n),ug(n)),fg(n,t),pg(n))}function Zd(n,t,e){return n<t?t:n>e?e:n}const _p=Math.PI/180,Hh=1e-6;function gg(){return{phase:"idle",fromYaw:0,targetYaw:0,dir:1,progress:0,armTime:0}}function Gr(n){const t=n.turnInPlace;t.phase="idle",t.fromYaw=0,t.targetYaw=0,t.dir=1,t.progress=0,t.armTime=0}function bp(n,t,e){return n.modules.gaze&&n.gaze.active?n.gaze.centroidYaw:t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Hh?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:null}function Sp(n,t,e){const i=n.character,a=Math.hypot(i.velocity.x,i.velocity.z),s=Math.hypot(t.moveX,t.moveZ),o=n.combat.phase!=="idle"||n.combat.charging||n.abilities.channeling||n.dash.phase!=="idle"||n.playerLink.phase!=="idle"||n.playerHurt.type!=="none"||t.attackPressed||t.attackHeld||t.skill2Pressed||t.sprintPressed||t.jumpPressed;return i.grounded&&a<=Math.max(0,e.idleSpeedRatio)*Math.max(n.config.moveSpeed,Hh)&&s<=Math.max(0,e.inputDeadZone)&&!o}function xg(n){const t=n<0?0:n>1?1:n;return t*t*(3-2*t)}function vg(n,t){const e=n.config.turnInPlace;if(!e.enabled||!n.modules.turnInPlace||!Sp(n,t,e))return!1;const i=bp(n,t,e.lookRange);if(i===null)return!1;const a=Ne(i-n.character.bodyYaw);return Math.abs(a)>wp(n,e)}function wp(n,t){const i=n.modules.gaze&&n.gaze.active?Math.max(t.triggerDeg,t.gazeTriggerDeg):t.triggerDeg;return Math.max(0,i)*_p}function yg(n,t,e){const i=n.turnInPlace,a=n.config.turnInPlace;if(!a.enabled||!n.modules.turnInPlace||!Sp(n,e,a)){Gr(n);return}const s=bp(n,e,a.lookRange);if(s===null){Gr(n);return}const o=n.character,r=Ne(s-o.bodyYaw),c=Math.abs(r),l=wp(n,a),d=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Hh;if(i.phase==="idle"&&(i.armTime=c>=l?i.armTime+t:0,c>l&&i.armTime>=Math.max(0,a.armSec))){i.phase="active",i.fromYaw=o.bodyYaw,i.dir=r>=0?1:-1;const u=Math.min(c,Math.max(0,a.settleDeg)*_p);i.targetYaw=Ne(o.bodyYaw+i.dir*(c-u)),i.progress=0}if(i.phase==="active"){const u=Math.max(a.durationSec,n.config.fixedDt);i.progress=Math.min(1,i.progress+t/u);const h=Ne(i.targetYaw-i.fromYaw);o.bodyYaw=Ne(i.fromYaw+h*xg(i.progress)),d||(o.facing=o.bodyYaw),i.progress>=1&&(i.phase="idle",i.progress=0,i.armTime=0)}}const la=1e-6;function Ne(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Wo(n,t,e,i){const a=Ne(t-n);return n+a*(1-Math.exp(-Math.max(e,la)*i))}function Yo(n,t,e,i,a){const o=Ne(t-n)*(1-Math.exp(-Math.max(e,la)*a)),r=Math.max(i,0)*a;return r<=la?n:n+ys(o,-r,r)}function jd(n,t,e,i,a){const s=(t-n)*(1-Math.exp(-Math.max(e,la)*a)),o=Math.max(i,0)*a;return o<=la?n+s:n+ys(s,-o,o)}function ys(n,t,e){return n<t?t:n>e?e:n}function qd(n,t,e,i){const a=Ne(t-n),s=Math.abs(a);return s<=i||s<=e?t:Ne(n+Math.sign(a)*Math.max(e,0))}function Mg(n,t,e){const i=n.character,a=n.config.orientation,s=n.combat,o=n.modules.gaze&&n.gaze.active,r=n.abilities.channeling,c=s.phase!=="idle"||s.charging||r||n.dash.phase!=="idle",l=o&&!c,d=Math.hypot(e.moveX,e.moveZ),u=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>la,h=s.charging&&s.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(s.phase!=="idle")i.facing=s.attackFacing;else if(r)i.facing=To(n,e);else if(l)i.facing=Yo(i.facing,n.gaze.centroidYaw,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t);else if(u)i.facing=To(n,e);else if(h)i.facing=n.targeting.targetYaw;else if(d>Math.max(a.facingDeadZone,la)){const y=Math.atan2(e.moveX,e.moveZ),C=a.facingTurnRate*Math.PI/180*t,I=a.facingSnapDeg*Math.PI/180;if(d>=.35)i.facing=qd(i.facing,y,C,I);else if(d>=a.facingMinMagnitude&&Math.abs(Ne(y-i.facing))>a.facingDeadbandDeg*Math.PI/180){const U=Wo(i.facing,y,a.facingSmoothRate,t);i.facing=qd(i.facing,U,C,0)}}const f=i.velocity;Math.hypot(f.x,f.z)>.15&&(i.moveYaw=Math.atan2(f.x,f.z));const m=l?n.gaze.centroidYaw:i.facing;n.turnInPlace.phase==="active"||vg(n,e)||(l?i.bodyYaw=Yo(i.bodyYaw,m,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t):i.bodyYaw=Wo(i.bodyYaw,m,a.bodyTurnRate,t));const g=n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;let p=i.facing;if(o?p=l?n.gaze.mainYaw:i.facing:u?p=Math.atan2(e.aimX,e.aimZ):g&&(p=n.targeting.targetYaw),!o){const y=n.config.gaze.headLookLimitDeg*Math.PI/180;Math.abs(Ne(p-i.bodyYaw))>y&&(p=i.moveYaw)}const _=o||u||g,x=a.maxHeadTurnDeg*Math.PI/180;let M;if(_){const y=l?n.config.gaze.headTurnRate:a.headTurnRate;M=l?Yo(i.headYaw,p,y,n.config.gaze.maxHeadSpeedDeg*Math.PI/180,t):Wo(i.headYaw,p,y,t)}else{const y=Ne(i.headYaw-i.bodyYaw),C=Ne(p-i.bodyYaw),I=Math.abs(C)<Math.abs(y)-1e-9,R=I?n.config.gaze.headReturnRate:a.headTurnRate,U=I?n.config.gaze.headReturnSpeedDeg*Math.PI/180:Number.POSITIVE_INFINITY,L=Number.isFinite(U)?Yo(y,C,R,U,t):Wo(y,C,R,t);M=i.bodyYaw+L}const S=Ne(M-i.bodyYaw);S>x?M=i.bodyYaw+x:S<-x&&(M=i.bodyYaw-x),i.headYaw=M;const w=n.config.gaze;let E=0;if(l)E=n.gaze.mainPitch;else if(n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget){const y=n.dummies[n.targeting.targetId-1];if(y){const C=i.position.y+n.config.characterHeight*ys(w.eyeHeightRatio,0,1),I=y.position.y+n.config.dummies.height*ys(w.aimHeightRatio,0,1),R=Math.hypot(y.position.x-i.position.x,y.position.z-i.position.z);E=Math.atan2(I-C,Math.max(la,R))}}const T=Math.max(0,w.maxHeadPitchDeg)*Math.PI/180;E=ys(E,-T,T);const b=_?w.headPitchRate:Math.min(w.headPitchRate,w.headReturnRate);i.headPitch=jd(i.headPitch,E,b,Math.max(0,w.maxHeadPitchDeg)*4*Math.PI/180,t),i.bodyPitch=jd(i.bodyPitch,i.headPitch*ys(w.bodyPitchScale,0,1),w.bodyPitchRate,Math.max(0,w.maxHeadPitchDeg)*Math.PI/180,t)}const Ep=1e-6,sc=Math.PI/180;function oc(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function _g(n,t,e){const i=n.character.position,a=Math.max(0,e.homingConeDeg)*sc,s=Math.max(0,e.homingRange),o=[];for(let r=0;r<n.dummies.length;r++){const c=n.dummies[r],l=c.position.x-i.x,d=c.position.z-i.z,u=Math.hypot(l,d);u<.001||u>s||Math.abs(Ne(Math.atan2(l,d)-t))>a||o.push({i:r,d:u})}return o.sort((r,c)=>r.d-c.d||r.i-c.i),o.map(r=>r.i)}function bg(n,t){const e=Math.sin((n+1)*12.9898+(t+1)*78.233)*43758.5453;return e-Math.floor(e)}function Sg(n,t){const e=n.abilities,i=n.character.position,a=Math.max(1,Math.floor(t.perWave)),s=t.spreadDeg*sc,o=Math.max(0,t.spawnSideStep),r=Math.max(0,Math.min(1,t.speedJitter)),c=_g(n,e.channelYaw,t);for(let l=0;l<a;l++){const d=(l-(a-1)*.5)*s,u=e.channelYaw+d,h=(l-(a-1)*.5)*o,f=Math.sin(u),m=Math.cos(u);e.pending.push({delay:l*Math.max(0,t.spawnDelay),x:i.x+f*.5+Math.cos(u)*h,y:i.y+1,z:i.z+m*.5-Math.sin(u)*h,yaw:u,speed:t.speed*(1+(bg(e.waveIndex,l)*2-1)*r),targetIndex:c.length>0?c[l%c.length]:-1,wave:e.waveIndex})}oc(n,"arcane-wave",e.waveIndex,{x:i.x,y:i.y+1,z:i.z})}function wg(n,t,e){const i=n.abilities;if(i.pending.length===0)return;const a=[];for(const s of i.pending){if(s.delay-=t,s.delay>0){a.push(s);continue}const o={id:++i.nextId,x:s.x,y:s.y,z:s.z,dirX:Math.sin(s.yaw),dirZ:Math.cos(s.yaw),speed:s.speed,life:e.life,radius:e.radius,targetIndex:s.targetIndex,turnRate:Math.max(0,e.turnRateDeg)*sc,homing:Math.max(0,e.homingTime),spread:Math.max(0,e.spreadTime),retarget:0,wave:s.wave};i.projectiles.push(o),i.volleyId+=1,oc(n,"projectile-fire",i.volleyId,o)}i.pending=a}function Kd(n,t){const e=n.abilities;e.channeling&&(e.channeling=!1,e.fireTimer=0,e.cooldown=Math.max(0,t.cooldown),e.channelMoveScale=1,e.needsRelease=!0,oc(n,"channel-end",0,n.character.position))}function Eg(n,t,e,i,a,s){const o=n.abilities,r=n.dash.phase==="active",c=n.playerLink,l=s==="skill2"?e.skill2Pressed:e.attackHeld,d=a&&l&&!r&&c.phase==="idle"&&!c.consumedAttack;if(o.cooldown>0&&(o.cooldown=Math.max(0,o.cooldown-t)),o.needsRelease&&!d&&(o.needsRelease=!1),o.channeling){if(!d){Kd(n,i);return}}else{if(!(d&&!o.needsRelease&&o.cooldown<=0))return;o.channeling=!0,o.channelId+=1,o.waveIndex=0,o.fireTimer=0,o.channelMoveScale=Math.max(0,Math.min(1,i.moveScale)),oc(n,"channel-start",o.channelId,n.character.position)}o.channelYaw=To(n,e),o.fireTimer-=t;let u=0;for(;o.fireTimer<=0&&u++<8;)if(o.fireTimer+=Math.max(i.waveInterval,Ep),Sg(n,i),o.waveIndex+=1,o.waveIndex>=Math.max(1,Math.floor(i.waves))){Kd(n,i);break}}function Tg(n,t,e){const i=Math.max(0,e.homingConeDeg)*sc,a=Math.max(0,e.homingRange),s=Math.atan2(t.dirX,t.dirZ);let o=-1,r=a+Ep;for(let c=0;c<n.dummies.length;c++){const l=n.dummies[c],d=l.position.x-t.x,u=l.position.z-t.z,h=Math.hypot(d,u);h<.001||h>r||Math.abs(Ne(Math.atan2(d,u)-s))>i||(o=c,r=h)}return o}function Ag(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.projectiles){if(r.spread>0)r.spread=Math.max(0,r.spread-t);else if(r.homing>0&&(r.homing=Math.max(0,r.homing-t)),r.retarget-=t,r.retarget<=0&&(r.retarget=Math.max(.05,e.retargetInterval),r.targetIndex=Tg(n,r,e)),r.targetIndex>=0&&r.turnRate>0&&r.homing>0){const l=n.dummies[r.targetIndex];if(!l)r.targetIndex=-1;else{const d=Math.atan2(l.position.x-r.x,l.position.z-r.z),u=Math.atan2(r.dirX,r.dirZ),h=Ne(d-u),f=r.turnRate*t,m=Math.max(-f,Math.min(f,h)),v=u+m;r.dirX=Math.sin(v),r.dirZ=Math.cos(v)}}if(r.x+=r.dirX*r.speed*t,r.z+=r.dirZ*r.speed*t,r.life-=t,r.life<=0)continue;let c=!1;if(s)for(let l=0;l<n.dummies.length;l++){const d=n.dummies[l],u=d.position.x-r.x,h=d.position.z-r.z,f=r.radius+a;if(!(u*u+h*h>f*f)){Uo(n,l,{type:e.hurtType,duration:e.hurtDuration,dirX:r.dirX,dirZ:r.dirZ,knockback:e.knockback}),c=!0;break}}c||o.push(r)}i.projectiles=o}const Rg={kind:"channelVolley",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params;Eg(n,t,e,s,a,i.cfg.slot),wg(n,t,s),Ag(n,t,s)}},Dc=1e-6;function Tp(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Pg(n,t){const e=n.character.position,i={id:++n.abilities.nextId,x:e.x,z:e.z,radius:t.radius,life:t.duration,duration:t.duration,pulseTimer:0};n.abilities.rings.push(i),Tp(n,"ring-place",i.id,e)}function Cg(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.rings){r.life-=t,r.pulseTimer-=t;let c=0;for(;r.pulseTimer<=0&&c++<8;){if(r.pulseTimer+=Math.max(e.pulseInterval,Dc),s)for(let l=0;l<n.dummies.length;l++){const d=n.dummies[l],u=d.position.x-r.x,h=d.position.z-r.z,f=r.radius+a;if(u*u+h*h>f*f)continue;const m=Math.hypot(u,h),v=m>Dc?u/m:0,g=m>Dc?h/m:1;Uo(n,l,{type:"heavy",duration:e.stun,dirX:v,dirZ:g,knockback:e.knockback})}Tp(n,"ring-pulse",r.id,{x:r.x,y:0,z:r.z})}r.life>0&&o.push(r)}i.rings=o}const Lg={kind:"groundRing",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params,o=i.cfg.slot==="attack"?e.attackPressed:e.skill2Pressed;a&&o&&n.dash.phase!=="active"&&n.playerLink.phase==="idle"&&Pg(n,s),Cg(n,t,s)}},Dg={channelVolley:Rg,groundRing:Lg};function kg(n){const t=Array.isArray(n.skills)?n.skills:[],e=n.abilities;return t.map(i=>{if(i.params)return{cfg:i,params:i.params};const a=i.paramsRef,s=a?e[a]:void 0;if(!s||typeof s!="object")throw new Error(`[skills] ${i.id}: paramsRef "${a??""}" 在 core.abilities 中不存在`);return{cfg:i,params:s}})}function Ig(n,t,e){for(const i of n.skills){if(i.cfg.enabled===!1)continue;const a=Dg[i.cfg.kind];if(!a)continue;const s=!i.cfg.weapon||n.combat.weapon===i.cfg.weapon;a.update({world:n,dt:t,intents:e,skill:i,onWeapon:s})}}function zg(){return{channeling:!1,channelYaw:0,fireTimer:0,waveIndex:0,cooldown:0,needsRelease:!1,channelId:0,channelMoveScale:1,volleyId:0,pending:[],projectiles:[],rings:[],nextId:0}}function Ap(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.waveIndex=0,t.cooldown=0,t.needsRelease=!1,t.channelMoveScale=1,t.pending.length=0,t.projectiles.length=0,t.rings.length=0}function Fg(n,t,e){Ig(n,t,e)}function kc(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const Jd=1e-6;function Qd(n,t,e){return n<t?t:n>e?e:n}function Rp(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function Pp(n){const t=n.camera,e=Rp();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function Ug(n){const t=n.camera,e=n.config.camera,i=n.character.position;let a=0,s=0,o=0,r=0;for(const l of n.dummies){const d=l.position.x-i.x,u=l.position.z-i.z,h=Math.hypot(d,u);if(h>e.radius)continue;const f=Qd((e.radius-h)/Math.max(Jd,e.radius-e.nearDistance),0,1);let m=f*(e.modeWeight[l.mode]??.5);l.attackPhase==="active"&&(m+=e.attackBoost*f),a+=m,s+=l.position.x*m,o+=l.position.z*m,r+=1}const c=a<=0?0:Qd(a/(a+Math.max(Jd,e.saturation)),0,1);if(t.threat=c,t.threatCount=r,a<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const l=s/a,d=o/a;t.centroidX=l,t.centroidZ=d;let u=(l-i.x)*e.framingBias*c,h=(d-i.z)*e.framingBias*c;const f=Math.hypot(u,h);f>e.maxOffset&&(u=u/f*e.maxOffset,h=h/f*e.maxOffset),t.offsetX=u,t.offsetZ=h}t.distanceScale=1-e.pushIn*(1-c)+e.maxPullback*c,t.pitchDelta=e.maxPitchDelta*c}function Ng(n){const t=[];if(n.slabs&&n.slabs.length>0)for(const e of n.slabs)t.push({id:`ground-${e.plotId}`,kind:"ground",minX:e.minX,maxX:e.maxX,minY:e.top-e.thickness,maxY:e.top,minZ:e.minZ,maxZ:e.maxZ});else{const e=n.ground.size;t.push(Ja("ground","ground",0,0,e,e,-n.ground.thickness,0))}for(const e of n.steps)t.push(Ja(e.id,"step",e.x,e.z,e.width,e.depth,0,e.height));for(const e of n.doorways){const i=e.openingWidth/2,a=e.wallThickness;t.push(Ja(`${e.id}-left`,"wall",e.x-i-e.wallSpan/2,e.z,e.wallSpan,a,0,e.wallHeight)),t.push(Ja(`${e.id}-right`,"wall",e.x+i+e.wallSpan/2,e.z,e.wallSpan,a,0,e.wallHeight)),t.push(Ja(`${e.id}-lintel`,"lintel",e.x,e.z,e.openingWidth,a,e.openingHeight,e.wallHeight))}for(const e of n.obstacles)t.push(Ja(e.id,"obstacle",e.x,e.z,e.width,e.depth,0,e.height));return t}function Ja(n,t,e,i,a,s,o,r){return{id:n,kind:t,minX:e-a/2,maxX:e+a/2,minY:o,maxY:r,minZ:i-s/2,maxZ:i+s/2}}const Gh={cellSize:.5,cellMeters:5,columns:6,maxRows:32,spawnDz:0,labelInset:.9,defaultRadius:2,defaultShape:"circle",defaultColor:"#7fd8c0",defaultSpan:[2,2],slabThickness:.4,boundInset:.5};function ke(n){return Math.round(n*1e6)/1e6}function tu(n,t){const e=n??t.defaultSpan;return[Math.max(1,Math.round(e[0])),Math.max(1,Math.round(e[1]))]}function Og(n,t=Gh){var mt,ft,Dt,j;const e={duplicates:[],unplaced:[]},i=t.cellMeters,a=new Set,s=[];for(const F of n)if(!(!F||typeof F.id!="string"||F.id.length===0)){if(a.has(F.id)){e.duplicates.push(F.id);continue}a.add(F.id),s.push(F)}const o=[...s].sort((F,Y)=>F.id<Y.id?-1:F.id>Y.id?1:0),r=new Map,c=(F,Y,J)=>{if(F<0||Y<0||F+J[0]>t.columns||Y+J[1]>t.maxRows)return!1;for(let K=0;K<J[0];K++)for(let st=0;st<J[1];st++)if(r.has(`${F+K},${Y+st}`))return!1;return!0},l=(F,Y,J,K)=>{for(let st=0;st<K[0];st++)for(let Tt=0;Tt<K[1];Tt++)r.set(`${Y+st},${J+Tt}`,F)},d=[];for(const F of o){if(F.pin!=="origin")continue;const Y=tu(F.span,t);c(0,0,Y)&&(l(F.id,0,0,Y),d.push({def:F,c:0,r:0,span:Y,pin:!0,slot:0}))}const u=t.columns*t.maxRows;for(const F of o){if(d.some(Tt=>Tt.def.id===F.id))continue;const Y=tu(F.span,t);let J=-1;for(let Tt=0;Tt<u;Tt++){const Wt=Tt%t.columns,dt=Math.floor(Tt/t.columns);if(c(Wt,dt,Y)){J=Tt;break}}if(J<0){e.unplaced.push(F.id);continue}const K=J%t.columns,st=Math.floor(J/t.columns);l(F.id,K,st,Y),d.push({def:F,c:K,r:st,span:Y,pin:!1,slot:J})}const h=d.map(F=>({...F,minX0:F.c*i,maxX0:(F.c+F.span[0])*i,minZ0:F.r*i,maxZ0:(F.r+F.span[1])*i}));if(h.length===0)return{plots:[],stations:[],grassPlots:[],destructibles:[],slabs:[],bounds:{minX:0,maxX:0,minZ:0,maxZ:0},steps:[],doorways:[],obstacles:[],dummySpawns:[],diagnostics:e};const f=Math.min(...h.map(F=>F.minX0)),m=Math.max(...h.map(F=>F.maxX0)),v=Math.min(...h.map(F=>F.minZ0)),g=Math.max(...h.map(F=>F.maxZ0)),p=h.find(F=>F.pin),_=p?(p.minX0+p.maxX0)/2:(f+m)/2,x=p?(p.minZ0+p.maxZ0)/2:(v+g)/2,M=-_,S=-x;let E=o.reduce((F,Y)=>typeof Y.index=="number"?Math.max(F,Y.index):F,0);const T=new Map;for(const F of h)T.set(F.def.id,typeof F.def.index=="number"?F.def.index:++E);const b=new Set,y=(F,Y)=>{if(!b.has(Y))return b.add(Y),Y;let J=`${F}/${Y}`,K=2;for(;b.has(J);)J=`${F}/${Y}#${K++}`;return b.add(J),J},C=[],I=[],R=[],U=[],L=[],k=[];for(const F of h){const Y=F.def,J=Y.id,K=T.get(J)??0,st=ke((F.minX0+F.maxX0)/2+M),Tt=ke((F.minZ0+F.maxZ0)/2+S),Wt={plotId:J,cell:{c:F.c,r:F.r},span:F.span,minX:ke(F.minX0+M),maxX:ke(F.maxX0+M),minZ:ke(F.minZ0+S),maxZ:ke(F.maxZ0+S),top:0,thickness:t.slabThickness};I.push(Wt);const dt=Y.radius??t.defaultRadius,X=Y.shape??t.defaultShape,H=Y.color??t.defaultColor,kt={dx:((mt=Y.spawn)==null?void 0:mt.dx)??0,dz:((ft=Y.spawn)==null?void 0:ft.dz)??t.spawnDz},Rt=-(F.span[1]*i)/2+t.labelInset,_t={dx:((Dt=Y.label)==null?void 0:Dt.dx)??0,dz:((j=Y.label)==null?void 0:j.dz)??Rt},vt={id:J,index:K,name:Y.name,hint:Y.hint,shape:X,x:st,z:Tt,radius:dt,spawnX:ke(st+kt.dx),spawnZ:ke(Tt+kt.dz),labelX:ke(st+_t.dx),labelZ:ke(Tt+_t.dz),color:H},gt=[];if(Y.grass){const D=Y.grass,A=D.absolute?0:Math.round(st/t.cellSize),q=D.absolute?0:Math.round(Tt/t.cellSize),ut={minCellX:D.minCellX+A,maxCellX:D.maxCellX+A,minCellZ:D.minCellZ+q,maxCellZ:D.maxCellZ+q};D.density!==void 0&&(ut.density=D.density),D.clearMarginCells!==void 0&&(ut.clearMarginCells=D.clearMarginCells),gt.push(ut)}const Pt=[];if(Y.destructibles)for(const D of Y.destructibles)Pt.push({id:y(J,D.id),kind:D.kind,x:ke(st+D.dx),y:D.y??0,z:ke(Tt+D.dz),height:D.height,radius:D.radius,tiltDeg:D.tiltDeg,pitchGain:D.pitchGain,maxTiltDeg:D.maxTiltDeg,fallSec:D.fallSec,bands:D.bands?[...D.bands]:void 0,color:D.color,cutColor:D.cutColor});for(const D of Y.steps??[])R.push({id:y(J,D.id),x:ke(st+D.dx),z:ke(Tt+D.dz),width:D.width,depth:D.depth,height:D.height});for(const D of Y.doorways??[])U.push({id:y(J,D.id),x:ke(st+D.dx),z:ke(Tt+D.dz),openingWidth:D.openingWidth,openingHeight:D.openingHeight,wallThickness:D.wallThickness,wallSpan:D.wallSpan,wallHeight:D.wallHeight});for(const D of Y.obstacles??[])L.push({id:y(J,D.id),x:ke(st+D.dx),z:ke(Tt+D.dz),width:D.width,depth:D.depth,height:D.height});for(const D of Y.dummies??[]){const A={plotId:J,x:ke(st+D.dx),z:ke(Tt+D.dz)};D.mode!==void 0&&(A.mode=D.mode),D.fighter&&(A.fighter=!0),D.weapon!==void 0&&(A.weapon=D.weapon),k.push(A)}C.push({id:J,index:K,name:Y.name,hint:Y.hint,owner:Y.owner??"",centerX:st,centerZ:Tt,placement:F.pin?"pinned":"auto",slot:F.pin?-1:F.slot,cell:{c:F.c,r:F.r},span:F.span,slab:Wt,shape:X,radius:dt,color:H,station:vt,grassPlots:gt,destructibles:Pt,testSpawn:Y.testSpawn})}const B=Math.max(...h.map(F=>F.c+F.span[0])),G=Math.max(...h.map(F=>F.r+F.span[1]));for(let F=0;F<G;F++){let Y=0;for(;Y<B;){if(r.has(`${Y},${F}`)){Y++;continue}const J=Y;for(;Y<B&&!r.has(`${Y},${F}`);)Y++;I.push({plotId:"",cell:{c:J,r:F},span:[Y-J,1],minX:ke(J*i+M),maxX:ke(Y*i+M),minZ:ke(F*i+S),maxZ:ke((F+1)*i+S),top:0,thickness:t.slabThickness})}}C.sort((F,Y)=>F.index-Y.index),I.sort((F,Y)=>{const J=T.get(F.plotId)??Number.MAX_SAFE_INTEGER,K=T.get(Y.plotId)??Number.MAX_SAFE_INTEGER;return J-K||F.cell.r-Y.cell.r||F.cell.c-Y.cell.c});const $=[...C].sort((F,Y)=>F.id<Y.id?-1:F.id>Y.id?1:0),at={minX:ke(Math.min(...I.map(F=>F.minX))+t.boundInset),maxX:ke(Math.max(...I.map(F=>F.maxX))-t.boundInset),minZ:ke(Math.min(...I.map(F=>F.minZ))+t.boundInset),maxZ:ke(Math.max(...I.map(F=>F.maxZ))-t.boundInset)};return{plots:C,stations:C.map(F=>F.station),grassPlots:C.flatMap(F=>F.grassPlots),destructibles:$.flatMap(F=>F.destructibles),slabs:I,bounds:at,steps:R,doorways:U,obstacles:L,dummySpawns:k,diagnostics:e}}function Bg(n,t,e,i=Gh){t.stations=e.stations,t.slabs=e.slabs,t.steps=e.steps,t.doorways=e.doorways,t.obstacles=e.obstacles,t.destructibles=e.destructibles,t.grass&&(t.grass.plots=e.grassPlots),t.ground={size:Math.max(e.bounds.maxX-e.bounds.minX,e.bounds.maxZ-e.bounds.minZ),thickness:i.slabThickness},n.worldBounds={...e.bounds};const a=t.grid.cellSize;t.grid={cellSize:a,minX:Math.floor(e.bounds.minX/a)*a,maxX:Math.ceil(e.bounds.maxX/a)*a,minZ:Math.floor(e.bounds.minZ/a)*a,maxZ:Math.ceil(e.bounds.maxZ/a)*a};const s=e.dummySpawns.filter(c=>!c.fighter),o=e.dummySpawns.filter(c=>c.fighter),r=n.dummies.initialModes;if(n.dummies.count=s.length,n.dummies.spawn=s.map(c=>({x:c.x,z:c.z})),n.dummies.initialModes=s.map((c,l)=>c.mode??r[l]??"idle"),n.dummies.fighters){const c=n.dummies.fighters,l=c.weapons;if(c.spawn=o.map(d=>({x:d.x,z:d.z})),c.weapons=o.map((d,u)=>d.weapon??l[u%l.length]),c.initialModes){const d=c.initialModes;c.initialModes=o.map((u,h)=>d[h%d.length])}}}const Vi=1e-6;function Xr(n,t,e){return n<t?t:n>e?e:n}function Ao(n,t,e,i,a,s,o){const r=a*.85;let c=Number.NEGATIVE_INFINITY;for(const l of n)l.maxY>i+s+Vi||l.maxY<i-o-Vi||t+r<l.minX||t-r>l.maxX||e+r<l.minZ||e-r>l.maxZ||l.maxY>c&&(c=l.maxY);return c}function Cp(n,t,e,i,a=0,s=.05){let o=Number.NEGATIVE_INFINITY;for(const r of n)r.maxY>i+s||t<r.minX||t>r.maxX||e<r.minZ||e>r.maxZ||r.maxY>o&&(o=r.maxY);return o===Number.NEGATIVE_INFINITY?a:o}function Xh(n,t,e,i,a){let s=!1;const o=t.y+i;for(let r=0;r<2;r++)for(const c of n){if(c.maxY<=t.y+a+Vi||c.minY>=o-Vi)continue;const l=Xr(t.x,c.minX,c.maxX),d=Xr(t.z,c.minZ,c.maxZ),u=t.x-l,h=t.z-d,f=u*u+h*h;if(!(f>=e*e))if(s=!0,f>Vi*Vi){const m=Math.sqrt(f),v=(e-m)/m;t.x+=u*v,t.z+=h*v}else{const m=t.x-c.minX,v=c.maxX-t.x,g=t.z-c.minZ,p=c.maxZ-t.z,_=Math.min(m,v,g,p);_===m?t.x=c.minX-e:_===v?t.x=c.maxX+e:_===g?t.z=c.minZ-e:t.z=c.maxZ+e}}return s}function Vh(n,t,e,i,a){const s=t.y+i;for(const o of n){if(o.maxY<=t.y+a+Vi||o.minY>=s-Vi)continue;const r=Xr(t.x,o.minX,o.maxX),c=Xr(t.z,o.minZ,o.maxZ),l=t.x-r,d=t.z-c;if(l*l+d*d<e*e-Vi)return!0}return!1}const oa=1e-6,Cs=Math.PI/180;function Wh(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Pl(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Lp(n){n.arrows.length=0}function Hg(n,t,e,i,a,s,o,r,c,l,d){const u=i-n,h=s-e,f=u*u+h*h;let m=0;f>oa&&(m=((o-n)*u+(r-e)*h)/f,m=Math.max(0,Math.min(1,m)));const v=n+u*m,g=e+h*m,p=v-o,_=g-r;if(p*p+_*_>d*d)return-1;const x=t+(a-t)*m;return x<c-.1||x>c+l?-1:m}function Gg(n,t){const e=n.config.combat.bow.trajectory,i=Math.max(0,e.homingRange);if(i<=oa)return-1;const a=n.character.position,s=Math.max(0,e.homingConeDeg)*Cs,o=n.config.targeting.targetAssist&&n.modules.targeting?n.targeting:null,r=o&&o.hasTarget?o.targetId:0;let c=-1,l=i+oa;for(const d of n.dummies){if(!n.modules.dummies)break;const u=d.position.x-a.x,h=d.position.z-a.z,f=Math.hypot(u,h);if(!(f<.001||f>i)){if(d.id===r)return d.id;Math.abs(Wh(Math.atan2(u,h)-t))>s||f<l&&(c=d.id,l=f)}}return c}function Xg(n,t,e){if(e<=0)return t;const i=n.dummies.find(r=>r.id===e);if(!i)return t;const a=n.character.position,s=Math.atan2(i.position.x-a.x,i.position.z-a.z),o=Math.max(0,n.config.combat.bow.trajectory.homingConeDeg)*Cs;return t+Ss(Wh(s-t),-o,o)}function Vg(n,t,e,i,a,s){const o=n.config.combat.bow.trajectory,r={vy:s*Math.sin(Math.max(0,o.launchPitchDeg)*Cs),horizontal:0};if(r.horizontal=s*Math.cos(Math.max(0,o.launchPitchDeg)*Cs),a<=0)return r;const c=n.dummies.find(v=>v.id===a);if(!c)return r;const l=Math.hypot(c.position.x-t,c.position.z-i);if(l<.4)return r;const d=l/Math.max(oa,s),u=c.position.y+n.config.dummies.height*Ss(o.aimHeightRatio,0,1),h=Math.max(0,o.gravity),f=(u-e+.5*h*d*d)/d,m=Ss(f,-s*.45,s*.92);return{vy:m,horizontal:Math.sqrt(Math.max(0,s*s-m*m))}}function Wg(n,t,e){const i=n.config.combat.bow.trajectory,a=Math.max(0,Math.min(1,t)),s=i.speedMin+(i.speedMax-i.speedMin)*a,o=n.character.position,r=Gg(n,e),c=Xg(n,e,r),l=Math.sin(c),d=Math.cos(c),u=o.x+Math.sin(e)*.55,h=o.z+Math.cos(e)*.55,f=o.y+.95,m=Vg(n,u,f,h,r,s),v={id:++n.arrowSeq,x:u,y:f,z:h,vx:l*m.horizontal,vy:m.vy,vz:d*m.horizontal,life:Math.max(.1,i.maxLife),stuck:!1,stuckDummy:-1,offX:0,offY:0,offZ:0,yaw:e,localYaw:0,pitch:0,rest:0,hit:!1,targetId:r,homing:Math.max(0,i.homingTime),turnRate:Math.max(0,i.turnRateDeg)*Cs};return n.arrows.push(v),Pl(n,"arrow-shot",a,v),v}function Ss(n,t,e){return n<t?t:n>e?e:n}function Yg(n,t){const e=n.arrows;if(e.length===0)return;const i=n.config.combat.bow.trajectory,a=n.config.dummies.radius,s=n.config.dummies.height,o=n.modules.hits&&n.modules.dummies,r=Math.max(0,i.gravity),c=[];for(const l of e){if(l.stuck){if(l.rest-=t,l.rest<=0)continue;if(l.stuckDummy>=0){const M=n.dummies[l.stuckDummy];if(M){const S=Math.cos(M.bodyYaw),w=Math.sin(M.bodyYaw);l.x=M.position.x+l.offX*S+l.offZ*w,l.y=M.position.y+l.offY,l.z=M.position.z-l.offX*w+l.offZ*S,l.yaw=M.bodyYaw+l.localYaw}}c.push(l);continue}if(l.life-=t,l.life<=0)continue;const d=l.x,u=l.y,h=l.z;if(l.homing>0&&(l.homing=Math.max(0,l.homing-t),l.targetId>0&&l.turnRate>0)){const M=n.dummies.find(S=>S.id===l.targetId);if(!M)l.targetId=0;else{const S=Math.hypot(l.vx,l.vz);if(S>oa){const w=Math.atan2(M.position.x-l.x,M.position.z-l.z),E=Math.atan2(l.vx,l.vz),T=l.turnRate*t,b=E+Ss(Wh(w-E),-T,T);l.vx=Math.sin(b)*S,l.vz=Math.cos(b)*S;const y=Math.hypot(M.position.x-l.x,M.position.z-l.z);if(y>.3){const C=y/S,R=(M.position.y+s*Ss(i.aimHeightRatio,0,1)-l.y+.5*r*C*C)/C,U=Math.max(0,i.verticalTurnRate)*t;l.vy+=Ss(R-l.vy,-U,U)}}}}l.yaw=Math.atan2(l.vx,l.vz),l.pitch=-Math.atan2(l.vy,Math.hypot(l.vx,l.vz)),l.vy-=r*t;const f=d+l.vx*t,m=u+l.vy*t,v=h+l.vz*t;let g=-1,p=2;if(o)for(let M=0;M<n.dummies.length;M++){const S=n.dummies[M],w=Hg(d,u,h,f,m,v,S.position.x,S.position.z,S.position.y,s,a+i.radius);w>=0&&w<p&&(p=w,g=M)}if(g>=0){const M=n.dummies[g];l.x=d+(f-d)*p,l.y=u+(m-u)*p,l.z=h+(v-h)*p,l.stuck=!0,l.stuckDummy=g;const S=Math.cos(M.bodyYaw),w=Math.sin(M.bodyYaw),E=l.x-M.position.x,T=l.z-M.position.z;l.offX=E*S-T*w,l.offZ=E*w+T*S,l.offY=l.y-M.position.y;const b=Math.atan2(l.vx,l.vz);l.localYaw=b-M.bodyYaw,l.yaw=b,l.pitch=Math.atan2(-l.vy,Math.hypot(l.vx,l.vz)),l.rest=Math.max(.2,i.stickSec),l.hit=!0;const y=Math.hypot(l.vx,l.vz);Uo(n,g,{type:"light",duration:.22,dirX:y>oa?l.vx/y:0,dirZ:y>oa?l.vz/y:1,knockback:.14}),Pl(n,"arrow-land",M.id,l),c.push(l);continue}const _=Ao(n.boxes,f,v,m+.4,.04,0,6),x=Number.isFinite(_)?_:0;if(m<=x+.02&&l.vy<0){l.x=f,l.y=x+Math.max(0,i.groundStickLift),l.z=v,l.stuck=!0,l.stuckDummy=-1,l.yaw=Math.atan2(l.vx,l.vz);const M=Math.atan2(-l.vy,Math.max(oa,Math.hypot(l.vx,l.vz)));l.pitch=Math.max(M,Math.max(0,i.stickMinPitchDeg)*Cs),l.rest=Math.max(.2,i.stickSec),Pl(n,"arrow-land",-1,l),c.push(l);continue}l.x=f,l.y=m,l.z=v,c.push(l)}n.arrows=c}const Cl=1e-6,$g=Math.PI/180;function Ll(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Yh(n,t,e){return n<t?t:n>e?e:n}function rc(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function Dl(n){const t=n.id,e=n.windowId;Object.assign(n,rc()),n.id=t,n.windowId=e}function Zg(n){Dl(n)}function Dp(n){Dl(n.playerLink);for(const t of n.dummies)Dl(t.link)}function jg(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function kl(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const a=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;a<=0||(i.linkWindow=Math.max(i.linkWindow,a),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function Vr(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,rc()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function qg(n,t){const e=n.config.links.search,i=n.character.position,a=Yh(e.maxAngleDeg,0,180)*$g;let s=0,o=t,r=Number.POSITIVE_INFINITY;for(const c of n.dummies){const l=c.position.x-i.x,d=c.position.z-i.z,u=Math.hypot(l,d);if(u<Cl||u>e.range)continue;const h=Math.atan2(l,d);Math.abs(Ne(h-t))>a||u<r&&(r=u,s=c.id,o=h)}return{id:s,yaw:o,dist:s>0?r:0}}function Kg(n,t,e,i){const a=n.config.links,s=n.playerLink,o=n.character.position,r=To(n,t),c=qg(n,r),l=c.id>0?c.yaw:r,d=c.id>0?Yh(c.dist-a.search.stopDistance,0,e.distance):a.noTargetFallback?e.distance:0;s.phase="windup",s.linkWindow=0,s.source="none",s.usedWindowId=s.windowId,s.cooldown=a.sharedCooldown,s.kind=e.kind,s.weapon=i,s.id+=1,s.timer=0,s.progress=0,s.facing=l,s.targetId=c.id,s.targetDist=c.dist,s.travel=d,s.travelled=0,s.fromX=o.x,s.fromZ=o.z,s.pulseTimer=0,s.hitIds=[],s.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,a.sharedCooldown),Ll(n,"link-start",s.id)}function Jg(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){Vr(n);return}if(e.weapon!==n.combat.weapon){Vr(n);return}e.timer+=t;const a=c=>c==="windup"?i.windup:c==="active"?i.active:i.recovery;let s=0;for(;e.phase!=="idle"&&s++<8;){const c=a(e.phase);if(e.timer<c)break;e.timer-=c,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,Ll(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,Ll(n,"link-end",e.id))}const o=i.windup+i.active+i.recovery;let r=0;if(e.phase==="windup"?r=e.timer:e.phase==="active"?r=i.windup+e.timer:e.phase==="recovery"?r=i.windup+i.active+e.timer:r=o,e.progress=o>0?Yh(r/o,0,1):1,e.phase==="active"&&i.active>Cl){const c=Math.max(0,e.travel-e.travelled),l=Math.max(Cl,i.active-e.timer),d=c/l;n.impulse.x=Math.sin(e.facing)*d,n.impulse.z=Math.cos(e.facing)*d}}function Qg(n,t,e){const i=n.config.links,a=n.playerLink,s=n.character.position;if(a.consumedAttack=!1,n.combat.hitstop>0)return;if(a.phase==="active"&&(a.travelled+=Math.hypot(s.x-a.fromX,s.z-a.fromZ)),a.fromX=s.x,a.fromZ=s.z,!i.enabled||!n.modules.links){a.phase!=="idle"&&Vr(n);return}const o=n.combat,r=n.character.sprinting;r&&i.triggerWhileSprinting&&a.phase==="idle"&&a.usedWindowId!==a.windowId&&i.windows.sprint>0&&(a.linkWindow=Math.max(a.linkWindow,i.windows.sprint),a.source="sprint"),a.phase==="idle"&&a.prevSprinting&&!r&&kl(n,"sprint"),a.prevSprinting=r,Jg(n,t);const c=i.moves[o.weapon];e.attackPressed&&a.phase==="idle"&&a.linkWindow>0&&a.usedWindowId!==a.windowId&&a.cooldown<=0&&o.phase==="idle"&&!o.charging&&n.dash.phase==="idle"&&!!c&&c.enabled&&Kg(n,e,c,o.weapon)}const Pr={windup:0,active:1,recovery:2},eu=1e-9;function kp(n){return Number.isFinite(n)?n<0?0:n>1?1:n:0}function tx(n){return n==="windup"||n==="active"||n==="recovery"}function ex(n,t){return Pr[n]+kp(t)}function nx(n,t,e){if(!n||n.length===0)return[];if(!Number.isFinite(e)||e<0)return[];const i=Number.isFinite(t)?t:-1,a=[];for(const s of n){if(!s||!tx(s.at))continue;const o=kp(s.u??0),r=Pr[s.at]+o;r>i+eu&&r<=e+eu&&a.push({name:s.name,value:Number.isFinite(s.value)?s.value:0,at:s.at,u:o})}return a.sort((s,o)=>Pr[s.at]+s.u-(Pr[o.at]+o.u)),a}const Ro=1e-6;function ra(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function ix(n,t,e){const i=n.character.position;n.events.push({type:"notify",tick:n.tick,x:i.x,y:i.y,z:i.z,value:e,name:t})}function Ip(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function cc(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.hitstop=0,t.notifyCursor=-1,t.hitIds.length=0,t.warp=1,t.warpDebt=0,t.warpPhase=0,t.warpTimer=0,t.slamAttackId=0,t.timings=Ip()}function zp(n){return{weapon:fa[Math.max(0,n-1)]??fa[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,hitstop:0,notifyCursor:-1,hitIds:[],warp:1,warpDebt:0,warpPhase:0,warpTimer:0,slamAttackId:0,timings:Ip()}}function ax(n,t){return To(n,t)}function sx(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,a=Math.max(0,t*e.maxLungeScale),s=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+s,a)}function Fp(n,t,e,i){const a=n.combat;a.phase="windup",a.phaseTimer=0,a.comboIndex=i,a.queued=!1,a.charging=!1,a.charge=0,a.attackFacing=ax(n,t),a.attackProgress=0,a.timings=e,a.attackId+=1,a.warpDebt=0,a.warpPhase=0,a.warpTimer=0,a.warp=1,a.notifyCursor=-1,a.hitIds.length=0,ra(n,"attack-start",i)}function Up(n){return Math.max(0,n.config.combat.settle)}function Il(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];Fp(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Up(n),lunge:sx(n,i.lunge[e-1]??0)},e)}function nu(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,Fp(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Up(n),lunge:i.lunge},0),Wg(n,e,n.combat.attackFacing),ra(n,"charge-release",e)}function ox(n,t){const e=n.combat,i=n.config.hits.hitstopWarp;if(!i||!i.enabled)return e.warp=e.hitstop>0?0:1,e.warp;const a=Math.max(0,Math.min(1,i.holdRate));if(e.hitstop>0)return e.warpPhase=1,e.warpTimer=e.hitstop,e.warp=a,e.warpDebt+=t*(1-a),e.warp;if(e.warpPhase===1&&(e.warpPhase=2,e.warpTimer=0),e.warpPhase===2){const s=Math.max(.001,i.release);e.warpTimer+=t;const o=Math.min(1,e.warpTimer/s),r=1-(1-o)*(1-o),c=a+(1-a)*r;if(e.warp=c,e.warpDebt+=t*(1-c),o>=1){e.warpPhase=3,e.warpTimer=0;const l=Math.max(0,e.timings.recovery)*Math.max(0,i.payback-1)*Math.max(0,Math.min(1,i.paybackBudget));e.warpDebt=Math.min(e.warpDebt,l)}return e.warp}if(e.warpPhase===3&&e.warpDebt>1e-6){const s=Math.min(Math.max(0,i.payback-1),e.warpDebt/Math.max(t,1e-5));return e.warp=1+s,e.warpDebt=Math.max(0,e.warpDebt-t*s),e.warpDebt<=1e-6&&(e.warpPhase=0,e.warp=1),e.warp}return e.warpPhase=0,e.warp=1,1}function rx(n,t,e){const i=n.combat;if(i.phase==="idle"){i.warp=1,i.warpPhase=0,i.warpTimer=0,i.warpDebt=0;return}const a=i.timings,s=ox(n,t),o=t*s;i.phaseTimer+=o;let r=0;for(;i.phase!=="idle"&&r++<8;){const d=i.phase==="windup"?a.windup:i.phase==="active"?a.active:i.phase==="recovery"?a.recovery:a.settle;if(i.phaseTimer<d)break;if(i.phaseTimer-=d,i.phase==="windup")i.phase="active",ra(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",i.warpPhase=0,i.warpDebt=0,i.warpTimer=0,i.warp=1,ra(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.weapons[i.weapon].comboWindow??n.config.combat.comboWindow,i.queued){i.queued=!1;const u=n.config.combat.weapons[i.weapon];u.comboCount>0&&Il(n,e,i.comboIndex<u.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const d=i.timings.recovery;if(d>Ro&&i.phaseTimer>=d*n.config.combat.cancelWindow){i.queued=!1;const u=n.config.combat.weapons[i.weapon];u.comboCount>0&&Il(n,e,i.comboIndex<u.comboCount?i.comboIndex+1:1)}}const c=a.windup+a.active+a.recovery;let l=0;i.phase==="windup"?l=i.phaseTimer:i.phase==="active"?l=a.windup+i.phaseTimer:i.phase==="recovery"?l=a.windup+a.active+i.phaseTimer:i.phase==="settle"&&(l=c),i.phase!=="idle"&&(i.attackProgress=c>0?Math.min(1,l/c):1),cx(n)}function cx(n){const t=n.combat;if(t.phase==="idle")return;const e=t.timings,i=t.phase==="windup"?e.windup:t.phase==="active"?e.active:t.phase==="recovery"?e.recovery:0,a=i>Ro?Math.min(1,Math.max(0,t.phaseTimer/i)):1,s=t.phase==="settle"?3:ex(t.phase,a);if(s<=t.notifyCursor+Ro)return;const o=n.config.combat.weapons[t.weapon].notifies;for(const r of nx(o,t.notifyCursor,s))ix(n,r.name,r.value);t.notifyCursor=s}function lx(n,t,e){const i=n.combat,a=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=fa.length){const c=fa[e.weaponSlot-1];c!==i.weapon&&(i.weapon=c,cc(n),Vr(n),ra(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,ra(n,"combo-reset",0))),i.hitstop>0&&(n.impulse.x=0,n.impulse.z=0,n.character.velocity.x=0,n.character.velocity.z=0),rx(n,t,e);const s=a.weapons[i.weapon],o=n.dash.phase==="active";if(s.comboCount>0){const c=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!o&&!c&&(e.attackPressed||a.autoCombo&&e.attackHeld))if(i.phase==="idle"){const d=i.comboWindow>0&&i.comboIndex<s.comboCount?i.comboIndex+1:1;Il(n,e,d)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&!o&&!n.playerLink.consumedAttack){if(e.attackHeld){if(i.charging||(i.charging=!0,i.charge=0,ra(n,"charge-start",0)),i.charge=Math.min(1,i.charge+t/Math.max(a.bow.maxChargeTime,Ro)),a.bow.autoFire&&i.charge>=1){i.charging=!1;const c=i.charge;i.charge=0,nu(n,e,c)}}else if(i.charging){i.charging=!1;const c=i.charge;i.charge=0,c>=a.bow.minChargeToFire?nu(n,e,c):ra(n,"charge-release",0)}}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.hitstop<=0&&i.timings.active>Ro)){const c=i.timings.active,l=Math.max(0,i.timings.lunge),d=Math.max(.2,a.lungeCurve),u=g=>l*(1-Math.pow(1-Math.min(1,Math.max(0,g/c)),d+1)),h=t*i.warp,f=Math.min(c,Math.max(0,i.phaseTimer)),m=Math.min(c,Math.max(0,i.phaseTimer-h));let v=Math.max(0,u(f)-u(m))/Math.max(h,1e-4);v=Math.min(v,Math.max(0,a.lungeMaxSpeed)),n.impulse.x=Math.sin(i.attackFacing)*v,n.impulse.z=Math.cos(i.attackFacing)*v}i.hitstop>0&&(i.hitstop=Math.max(0,i.hitstop-t))}const cn=1e-6,zl=Math.PI*2,hx=7,dx=18,Np=1.3,Op=.4,ux=.9,iu=.9;function au(n,t,e,i){const a=Math.max(e,.1),s=((n+t*2.37)%a+a)%a,o=Math.min(Math.max(i,0),1)*a;if(o<=cn||s>=o)return 0;const r=Math.min(Math.max(a*.12,.15),o*.5),c=Math.min(1,Math.min(s/r,(o-s)/r));return c*c*(3-2*c)}function fx(n,t){const e=Math.hypot(n,t);return e<=1?{x:n,z:t}:{x:n/e,z:t/e}}function px(n){return Math.atan2(Math.sin(n),Math.cos(n))}function su(n,t,e,i){return n+px(t-n)*(1-Math.exp(-Math.max(e,cn)*i))}function Wr(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function mx(n){var i;const t=[];for(let a=0;a<n.count;a++){const s=n.spawn[a]??{x:0,z:0},o=n.initialModes[a]??"idle";t.push(Fl(a+1,o,s.x,s.z,null))}const e=n.fighters;if(e)for(let a=0;a<e.weapons.length;a++){const s=e.spawn[a]??{x:0,z:0},o=((i=e.initialModes)==null?void 0:i[a])??"spar",r=e.attackInterval*(.25+.22*a);t.push(Fl(t.length+1,o,s.x,s.z,e.weapons[a],r))}return t}function Fl(n,t,e,i,a,s=0){return{id:n,mode:t,initialMode:t,homeX:e,homeZ:i,position:{x:e,y:0,z:i},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:e,targetZ:i,wanderTimer:0,attackCooldown:s,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,attackComboIndex:0,attackComboLeft:0,comboGap:0,hurt:vp(),link:rc(),weapon:a,combat:a?{...zp(fa.indexOf(a)+1),weapon:a}:null}}function gx(n,t=!1){const e=t?gp:og,i=e.indexOf(n);return e[(i+1)%e.length]}function Bp(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],a=t.spawn[e]??{x:i.homeX,z:i.homeZ},s=t.initialModes[e]??i.initialMode;i.mode=s,i.initialMode=s,i.homeX=a.x,i.homeZ=a.z,i.position.x=a.x,i.position.y=0,i.position.z=a.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=a.x,i.targetZ=a.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0,i.attackComboIndex=0,i.attackComboLeft=0,i.comboGap=0;const o=i.hurt;if(o.type="none",o.timer=0,o.duration=0,o.dirX=0,o.dirZ=0,o.knockX=0,o.knockZ=0,Zg(i.link),i.combat){const r=i.combat;r.phase="idle",r.comboIndex=0,r.phaseTimer=0,r.attackProgress=0,r.attackFacing=0,r.charging=!1,r.charge=0,r.hitstop=0,r.warp=1,r.warpPhase=0,r.warpDebt=0,r.warpTimer=0,r.hitIds.length=0,r.timings={windup:0,active:0,recovery:0,settle:0,lunge:0}}}n.dummyAttackCount=0}function xx(n,t,e){const i=kc(n)*zl,a=Math.sqrt(kc(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*a,t.targetZ=t.homeZ+Math.sin(i)*a,t.wanderTimer=e.wanderInterval*(.6+kc(n)*.8)}function $h(n,t,e){if(t.weapon){const i=n.config.combat.weapons[t.weapon];if(i)return{windup:i.windup,active:i.active,recovery:i.recovery}}return{windup:e.attackWindup,active:e.attackActive,recovery:e.attackRecovery}}function Ul(n,t,e){var s;if(!t.weapon)return e.attackRange;const i=n.config.hits.reach[t.weapon]??e.attackRange,a=((s=e.fighters)==null?void 0:s.attackRangeScale)??.9;return Math.max(.4,i*a)}function Nl(n,t){return n.weapon&&t.fighters?t.fighters.attackInterval:t.attackInterval}function vx(n,t){return n.weapon&&t.fighters?Math.max(t.leashRadius,t.fighters.leashRadius):t.leashRadius}function yx(n,t,e){const i=$h(e,n,t);return n.attackPhase==="windup"?i.windup:n.attackPhase==="active"?i.active:n.attackPhase==="recovery"?i.recovery:0}function Mx(n,t,e){var s;if(!t.weapon)return 1;const i=((s=e.fighters)==null?void 0:s.comboCount)??0;if(i>0)return Math.max(1,Math.round(i));const a=n.config.combat.weapons[t.weapon];return Math.max(1,Math.round((a==null?void 0:a.comboCount)??1))}function _x(n,t){var i;const e=((i=t.fighters)==null?void 0:i.comboGap)??0;return e>0?e:Math.max(0,n.config.combat.settle)}function bx(n){return n.attackPhase!=="idle"||n.attackComboLeft>0}function Sx(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0,ou(n,t,i);return}t.attackPhaseTimer+=e;let a=0;for(;t.attackPhase!=="idle"&&a++<4;){const c=Math.max(yx(t,i,n),cn);if(t.attackPhaseTimer<c)break;t.attackPhaseTimer-=c,t.attackPhase==="windup"?(t.attackPhase="active",Wr(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0,t.attackComboLeft>0?t.comboGap=_x(n,i):(t.attackComboIndex=0,t.weapon&&t.attackCooldown<=0&&(t.attackCooldown=Nl(t,i)*Op)))}const s=$h(n,t,i),o=s.windup+s.active+s.recovery;let r=0;t.attackPhase==="windup"?r=t.attackPhaseTimer:t.attackPhase==="active"?r=s.windup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(r=s.windup+s.active+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||o<=0?0:Math.min(1,r/o),ou(n,t,i)}function ou(n,t,e){const i=t.combat;if(!i)return;const a=$h(n,t,e),s=t.attackPhase==="idle"&&t.attackComboLeft>0&&t.comboGap>0;i.weapon=t.weapon??i.weapon,i.phase=s?"settle":t.attackPhase,i.comboIndex=t.attackComboIndex,i.phaseTimer=t.attackPhaseTimer,i.attackProgress=s?1:t.attackProgress,i.attackFacing=t.facing,i.timings={windup:a.windup,active:a.active,recovery:a.recovery,settle:0,lunge:0},i.hitstop=0,i.warp=1,i.warpPhase=0,i.charging=!1,i.charge=0}function wx(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,a=i.x-t.position.x,s=i.z-t.position.z,o=Math.hypot(a,s),r=o>cn?a/o:0,c=o>cn?s/o:0;let l=0,d=0;if(t.mode==="wander"){const h=t.targetX-t.position.x,f=t.targetZ-t.position.z,m=Math.hypot(h,f);(t.wanderTimer<=0||m<.3)&&xx(n,t,e);const v=t.targetX-t.position.x,g=t.targetZ-t.position.z,p=Math.hypot(v,g);p>cn&&(l=v/p,d=g/p)}else if(t.mode==="follow")o>e.followStopDistance&&(l=r,d=c);else if(t.mode==="keep-distance"){const h=o-e.keepDistance,f=Math.max(e.keepDeadZone,.2),m=Math.max(-1,Math.min(1,h/f))*iu,v=au(n.time,t.id,e.strafePeriod,e.strafeDuty)*e.keepStrafe;l=r*m-c*v,d=c*m+r*v}else if(t.mode==="attack")o>Ul(n,t,e)&&t.attackPhase==="idle"&&(l=r,d=c);else if(t.mode==="spar"){const h=Ul(n,t,e),f=h*1.7;if(bx(t))o>h*Np?(l=r,d=c):o<h*.55&&(l=-r*.6,d=-c*.6);else if(t.attackPhase==="idle"&&t.attackCooldown<=0&&o>h)l=r,d=c;else{const v=Math.max(-1,Math.min(1,(o-f)/.5))*iu,g=au(n.time,t.id,e.strafePeriod,e.strafeDuty)*ux;l=r*v-c*g,d=c*v+r*g}}({x:l,z:d}=fx(l,d));let u=t.facing;if(t.mode==="wander"?Math.hypot(l,d)>cn&&(u=Math.atan2(l,d)):o>cn&&(u=Math.atan2(r,c)),e.leashRadius>cn&&t.mode!=="wander"&&t.mode!=="idle"){const h=vx(t,e),f=t.position.x-t.homeX,m=t.position.z-t.homeZ,v=Math.hypot(f,m);if(v>h){const g=Math.min(1,(v-h)/Math.max(h*.5,.5)),p=-f/v,_=-m/v;l=l*(1-g)+p*g,d=d*(1-g)+_*g;const x=Math.hypot(l,d);x>cn&&(l/=x,d/=x)}}return{x:l,z:d,facing:u}}function Ex(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.comboGap=Math.max(0,e.comboGap-t),e.hurt.timer>0&&(e.attackComboLeft=0,e.comboGap=0),(e.mode==="attack"||e.mode==="spar")&&e.attackPhase==="idle"&&e.hurt.timer<=0){const _=n.character.position,x=Math.hypot(_.x-e.position.x,_.z-e.position.z),M=Ul(n,e,i);if(e.attackComboLeft>0)e.comboGap<=0&&(x<=M*Np+cn?(e.attackComboIndex+=1,e.attackComboLeft-=1,e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,n.dummyAttackCount+=1,Wr(n,"dummy-attack",e)):(e.attackComboLeft=0,e.attackComboIndex=0,e.attackCooldown=Math.max(e.attackCooldown,Nl(e,i)*Op)));else if(e.attackCooldown<=0&&x<=M+cn){const S=Mx(n,e,i);e.attackComboIndex=1,e.attackComboLeft=Math.max(0,S-1),e.comboGap=0,e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=Nl(e,i),n.dummyAttackCount+=1,Wr(n,"dummy-attack",e)}}Sx(n,e,t,i);const a=wx(n,e,i),s=n.config.worldBounds;(a.x>0&&e.position.x>=s.maxX-cn||a.x<0&&e.position.x<=s.minX+cn)&&(a.x=0),(a.z>0&&e.position.z>=s.maxZ-cn||a.z<0&&e.position.z<=s.minZ+cn)&&(a.z=0);const o=1-Math.exp(-Math.max(i.acceleration,cn)*t),r=e.weapon&&i.fighters?i.fighters.moveSpeed:i.moveSpeed;e.velocity.x+=(a.x*r-e.velocity.x)*o,e.velocity.z+=(a.z*r-e.velocity.z)*o,e.facing=a.facing,e.bodyYaw=su(e.bodyYaw,e.facing,hx,t),e.headYaw=su(e.headYaw,e.facing,dx,t);const c=e.position.x,l=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const d=n.config.stepHeight;if(Xh(n.boxes,e.position,i.radius,i.height,d))if(Vh(n.boxes,e.position,i.radius,i.height,d))e.position.x=c,e.position.z=l,e.velocity.x=0,e.velocity.z=0;else{const _=e.position.x-c,x=e.position.z-l;Math.abs(_)<Math.abs(e.velocity.x*t)*.5&&(e.velocity.x=0),Math.abs(x)<Math.abs(e.velocity.z*t)*.5&&(e.velocity.z=0)}const h=n.config.worldBounds;e.position.x<h.minX?(e.position.x=h.minX,e.velocity.x<0&&(e.velocity.x=0),e.hurt.knockX<0&&(e.hurt.knockX=0)):e.position.x>h.maxX&&(e.position.x=h.maxX,e.velocity.x>0&&(e.velocity.x=0),e.hurt.knockX>0&&(e.hurt.knockX=0)),e.position.z<h.minZ?(e.position.z=h.minZ,e.velocity.z<0&&(e.velocity.z=0),e.hurt.knockZ<0&&(e.hurt.knockZ=0)):e.position.z>h.maxZ&&(e.position.z=h.maxZ,e.velocity.z>0&&(e.velocity.z=0),e.hurt.knockZ>0&&(e.hurt.knockZ=0));const f=Ao(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,d,Number.POSITIVE_INFINITY);f>Number.NEGATIVE_INFINITY&&f<=e.position.y+d+cn&&(e.position.y=f);const m=Math.hypot(e.position.x-c,e.position.z-l);e.distance+=m;const v=Math.hypot(e.velocity.x,e.velocity.z),g=Math.min(n.config.strideSpeedCap,v/Math.max(n.config.moveSpeed,cn)),p=Math.max(n.config.strideLength*(1+g*n.config.strideSpeedGain),cn);e.stride=p,e.gaitPhase=(e.gaitPhase+m/p*zl)%zl}function Tx(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const a=n.dummies[e.dummyClickId-1];a.mode=gx(a.mode,!!a.weapon),a.targetX=a.position.x,a.targetZ=a.position.z,a.wanderTimer=0,a.attackCooldown=0,a.attackPhase="idle",a.attackPhaseTimer=0,a.attackProgress=0,a.attackComboIndex=0,a.attackComboLeft=0,a.comboGap=0,a.combat&&(a.combat.phase="idle",a.combat.attackProgress=0,a.combat.comboIndex=0),Wr(n,"dummy-mode",a)}for(const a of n.dummies)Ex(n,t,a,i)}const Ax=["idle","attack","keep-distance"],Rx=["sword-shield","dual-swords","greatsword"];function Ol(n,t){const e=n.dummies.length,i=n.dummies.filter(a=>a.spawnedByPlot?t!==void 0&&a.spawnedByPlot!==t:!0);n.dummies=i;for(let a=0;a<n.dummies.length;a++)n.dummies[a].id=a+1;return e-n.dummies.length}function Px(n,t){var h,f;const e=t.testSpawn??{},i=Math.max(0,Math.floor(e.dummies??0)),a=Math.max(0,Math.floor(e.fighters??0));Ol(n,t.id);const s=i+a;if(s===0)return 0;const o=Math.max(.4,e.ringRadius??1.6),r=e.startDeg??-90,c=e.modes??Ax,l=e.weapons??((h=n.config.dummies.fighters)==null?void 0:h.weapons)??Rx,d=((f=n.config.dummies.fighters)==null?void 0:f.attackInterval)??3.4,u=[];for(let m=0;m<s;m++){const v=(r+360*m/s)*Math.PI/180,g=t.centerX+Math.cos(v)*o,p=t.centerZ+Math.sin(v)*o,_=m>=i,x=m-i,M=_?"spar":c[m%c.length],S=_?l[x%l.length]:null,w=_?d*(.25+.22*x):0,E=Fl(n.dummies.length+u.length+1,M,g,p,S,w);E.spawnedByPlot=t.id,u.push(E)}return n.dummies.push(...u),u.length}function Cx(n){let t=0;for(const e of n.dummies)e.spawnedByPlot&&t++;return t}const Bl=1e-6;function Ic(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Lx(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function Hp(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function ru(n,t,e){return n<t?t:n>e?e:n}function Dx(n,t,e){const i=n.config.dash,s=n.character.position,o=n.config.worldBounds,r=Math.max(.05,i.blinkStep),c=Math.max(0,i.blinkDistance);let l=0,d=s.x,u=s.z;for(;l<c-Bl;){const h=Math.min(c,l+r),f=s.x+t*h,m=s.z+e*h,v=ru(f,o.minX,o.maxX),g=ru(m,o.minZ,o.maxZ),p={x:v,y:s.y,z:g};if(Vh(n.boxes,p,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(d=v,u=g,l=h,v!==f||g!==m))break}return{x:d,z:u}}function kx(n,t,e){const i=n.dash,a=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,kl(n,"roll")),i.cooldown>0){const c=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),c>0&&i.cooldown===0&&Ic(n,"dash-ready",0)}const s=n.combat,o=s.weapon==="bow"&&(s.charging||s.phase!=="idle");if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&(s.phase==="idle"||o)&&n.playerLink.phase==="idle"){o&&(s.charging=!1,s.charge=0,s.phase!=="idle"&&cc(n));const c=rg(n,e),l=c.x,d=c.z,u=n.combat.weapon==="staff";if(i.kind=u?"blink":"roll",i.dirX=l,i.dirZ=d,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=u?a.blinkCooldown:a.rollCooldown,u){const h=Dx(n,l,d);n.character.position.x=h.x,n.character.position.z=h.z,i.toX=h.x,i.toZ=h.z,i.duration=0,i.timer=0,i.phase="idle",a.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),kl(n,"blink"),Ic(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(Bl,a.rollDuration),i.timer=i.duration,i.toX=i.fromX+l*a.rollDistance,i.toZ=i.fromZ+d*a.rollDistance,Ic(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const c=Math.max(Bl,i.timer),l=n.character.position.x,d=n.character.position.z;n.impulse.x=(i.toX-l)/c,n.impulse.z=(i.toZ-d)/c}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const hi=1e-6,cu=Math.PI*2;function lu(n,t){return Math.sqrt(n*n+t*t)}function $o(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Ix(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.headPitch=0,t.bodyPitch=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,cc(n)}function zx(n,t,e){const i=n.character,a=n.config,s=Ao(n.boxes,t,e,a.characterHeight,a.characterRadius,a.stepHeight,Number.POSITIVE_INFINITY);i.position.x=t,i.position.y=s>Number.NEGATIVE_INFINITY?s:0,i.position.z=e,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.moveYaw=0,i.bodyYaw=0,i.headYaw=0,i.headPitch=0,i.bodyPitch=0,i.grounded=!0,i.sprinting=!1,i.gaitPhase=0,i.stride=a.strideLength,i.distance=0,i.coyoteTime=a.coyoteTime,i.jumpBuffer=0,cc(n),Dp(n),Hp(n),Ap(n),Lp(n),Gr(n);const o=n.targeting;o.targetId=0,o.targetYaw=0,o.targetDist=0,o.hasTarget=!1;const r=n.playerHurt;r.type="none",r.lastAt=Oh,r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,n.events.length=0}function Fx(n,t,e){const i=n.config,a=n.character,s=a.position,o=a.velocity;let r=Number.isFinite(e.moveX)?e.moveX:0,c=Number.isFinite(e.moveZ)?e.moveZ:0;const l=lu(r,c);l>1&&(r/=l,c/=l);const d=i.worldBounds;(r>0&&s.x>=d.maxX-hi||r<0&&s.x<=d.minX+hi)&&(r=0),(c>0&&s.z>=d.maxZ-hi||c<0&&s.z<=d.minZ+hi)&&(c=0);const u=n.combat.phase!=="idle",h=n.playerLink.phase!=="idle",f=n.dash.phase==="active",m=u||f||h;a.sprinting=!m&&e.sprintHeld&&l>hi;const v=i.combat.weapons[n.combat.weapon];let g=v?v.moveMultiplier:1;f||h?g=0:u?g*=n.combat.phase==="active"?i.combat.lungeMoveScale:n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?g*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(g*=Math.max(0,Math.min(1,n.abilities.channelMoveScale)));const p=i.moveSpeed*(a.sprinting?i.sprintMultiplier:1)*g;{const R=m?i.skillDecel:l>hi?i.acceleration:i.friction,U=1-Math.exp(-R*t);o.x+=(r*p-o.x)*U,o.z+=(c*p-o.z)*U}e.jumpPressed?a.jumpBuffer=i.jumpBufferTime:a.jumpBuffer=Math.max(0,a.jumpBuffer-t),a.coyoteTime=a.grounded?i.coyoteTime:Math.max(0,a.coyoteTime-t),a.jumpBuffer>0&&a.coyoteTime>0&&(o.y=i.jumpSpeed,a.grounded=!1,a.coyoteTime=0,a.jumpBuffer=0,$o(n,"jumped",i.jumpSpeed)),n.events.some(R=>R.type==="blink"&&R.tick===n.tick)&&(o.x=0,o.z=0,n.impulse.x=0,n.impulse.z=0);const x=s.x,M=s.z;if(s.x+=(o.x+n.impulse.x+n.playerHurt.knockX)*t,s.z+=(o.z+n.impulse.z+n.playerHurt.knockZ)*t,Xh(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight)){if(Vh(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight))s.x=x,s.z=M,o.x=0,o.z=0;else{const R=s.x-x,U=s.z-M;Math.abs(R)<Math.abs(o.x*t)*.5&&(o.x=0),Math.abs(U)<Math.abs(o.z*t)*.5&&(o.z=0)}$o(n,"blocked",1)}s.x<d.minX?(s.x=d.minX,o.x<0&&(o.x=0),n.playerHurt.knockX<0&&(n.playerHurt.knockX=0)):s.x>d.maxX&&(s.x=d.maxX,o.x>0&&(o.x=0),n.playerHurt.knockX>0&&(n.playerHurt.knockX=0)),s.z<d.minZ?(s.z=d.minZ,o.z<0&&(o.z=0),n.playerHurt.knockZ<0&&(n.playerHurt.knockZ=0)):s.z>d.maxZ&&(s.z=d.maxZ,o.z>0&&(o.z=0),n.playerHurt.knockZ>0&&(n.playerHurt.knockZ=0));const w=Ao(n.boxes,s.x,s.z,s.y,i.characterRadius,i.stepHeight,i.fallTolerance);a.grounded&&w>s.y+hi&&w-s.y<=i.stepHeight+hi&&(s.y=w,o.y=0,$o(n,"stepUp",w));const E=s.y;o.y-=i.gravity*t,s.y+=o.y*t;const T=Ao(n.boxes,s.x,s.z,E,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);T>Number.NEGATIVE_INFINITY&&s.y<=T&&o.y<=0?(s.y=T,o.y=0,a.grounded||$o(n,"landed",T),a.grounded=!0):a.grounded=!1;const b=lu(s.x-x,s.z-M);a.distance+=b;const y=b/Math.max(t,hi),C=Math.min(i.strideSpeedCap,y/Math.max(i.moveSpeed,hi)),I=Math.max(i.strideLength*(1+C*i.strideSpeedGain),hi);a.stride=I,a.gaitPhase=(a.gaitPhase+b/I*cu)%cu}const Hl=1e-6,hu=2.399963229728653;function Ia(n,t,e){return n<t?t:n>e?e:n}function du(n,t,e,i,a,s,o,r,c){const l=t.x-n.x,d=t.z-n.z,u=Math.hypot(l,d),h=e+i;if(u>=h)return;let f,m,v;u<Hl?(f=r,m=c,v=h):(f=l/u,m=d/u,v=h-u);const g=v+o;n.x-=f*g*a,n.z-=m*g*a,t.x+=f*g*s,t.z+=m*g*s}function Ux(n){const t=n.config.separation,e=n.dummies,i=n.character.position,a=n.config.characterRadius,s=n.config.dummies.radius,o=Math.max(1,Math.floor(t.iterations)),r=Math.max(0,t.slop);for(let d=0;d<o;d++){for(let u=0;u<e.length;u++)for(let h=u+1;h<e.length;h++){const f=(u*3+h)*hu;du(e[u].position,e[h].position,s,s,.5,.5,r,Math.cos(f),Math.sin(f))}for(let u=0;u<e.length;u++){const h=(u+1)*hu;du(i,e[u].position,a,s,0,1,r,Math.cos(h),Math.sin(h))}}const c=n.config.stepHeight,l=n.config.worldBounds;for(const d of e)Xh(n.boxes,d.position,s,n.config.dummies.height,c),d.position.x=Ia(d.position.x,l.minX,l.maxX),d.position.z=Ia(d.position.z,l.minZ,l.maxZ)}function Nx(n,t,e,i,a,s,o,r){const c=Math.hypot(e,i),l=Math.max(0,r.contactBand),d=Ia(r.minScale,0,1);if(c<Hl||l<=0||d>=1)return 1;const u=a+o,h=Ia(r.approachDot,0,.99);let f=0;for(const m of s){const v=m.position.x-n,g=m.position.z-t,p=Math.hypot(v,g);if(p>=u+l)continue;if(p<Hl){f=1;continue}const _=(e*v+i*g)/(c*p);if(_<=h)continue;const x=Ia(1-(p-u)/l,0,1),M=Ia((_-h)/(1-h),0,1);f=Math.max(f,x*M)}return 1-(1-d)*Ia(f,0,1)}function Ox(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=Nx(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const zc=1e-6,Bx=Math.PI/180;function Hx(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function Gx(n,t,e){return n<t?t:n>e?e:n}function Xx(n,t,e){const i=n.config.targeting,a=n.targeting,s=n.character.position;let o=n.character.facing;const r=Math.hypot(e.aimX,e.aimZ);e.aimActive&&r>zc?o=Math.atan2(e.aimX,e.aimZ):Math.hypot(e.moveX,e.moveZ)>zc&&(o=Math.atan2(e.moveX,e.moveZ));const c=Gx(i.maxAngleDeg,0,180)*Bx;let l=Number.POSITIVE_INFINITY,d=0,u=0,h=0;for(const f of n.dummies){const m=f.position.x-s.x,v=f.position.z-s.z,g=Math.hypot(m,v);if(g<zc||g>i.range)continue;const p=Math.atan2(m,v),_=Math.abs(Ne(p-o));if(_>c)continue;const x=g-i.frontBias*Math.cos(_);x<l&&(l=x,d=f.id,u=p,h=g)}a.targetId=d,a.targetYaw=u,a.targetDist=h,a.hasTarget=d>0}const Si=1e-6;function Ms(n,t,e){return n<t?t:n>e?e:n}function uu(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Vx(n,t,e){const i=n.config.gaze,a=n.gaze;if(!i.enabled||!n.modules.gaze){a.active=!1,a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}const s=n.character.position,o=(R,U)=>{const L=R.position.x-s.x,k=R.position.z-s.z,B=Math.hypot(L,k);if(B<Si||B>U)return 0;const G=Ms((U-B)/Math.max(Si,U-i.nearDistance),0,1);let $=G*(i.modeWeight[R.mode]??.5);return R.attackPhase==="active"&&($+=i.attackBoost*G),$},r=[];let c=0,l=!1,d=!1,u=!1;for(const R of n.dummies){const U=o(R,i.threatRange),L=R.position.x-s.x,k=R.position.z-s.z,B=Math.hypot(L,k);U>0&&(r.push({id:R.id,x:R.position.x,z:R.position.z,dx:L,dz:k,yaw:Math.atan2(L,k),w:U}),c+=U,B<=i.approachDist&&(i.modeWeight[R.mode]??.5)>=i.hostileModeWeight&&(u=!0)),B>Si&&B<=i.recoveryDist&&(l=!0),(R.attackPhase==="windup"||R.attackPhase==="active")&&B<=i.threatRange&&(d=!0)}const h=c<=0?0:Ms(c/(c+Math.max(Si,i.saturation)),0,1),f=r.length>0,m=a.active,v=f&&(e.aimActive&&h>=i.enterThreshold||i.reactToAttack&&d&&h>=i.enterThreshold||i.reactToApproach&&u),g=i.hurtHoldSec>Si&&n.time-n.playerHurt.lastAt<i.hurtHoldSec,p=m&&(l||g);if(a.active=v||p,!a.active){a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}if(r.length===0)return;r.sort((R,U)=>U.w-R.w);const _=r.slice(0,Math.max(1,i.maxThreats)),x=r[0],M=Math.atan2(x.dx,x.dz),S=i.behindAngleDeg*Math.PI/180,w=n.character.bodyYaw;let E=0,T=0,b=0;for(const R of _){const U=Math.abs(uu(R.yaw-M))/Math.PI;let L=R.w/(1+Math.max(i.spreadFalloff,0)*U*U);R!==x&&i.behindFalloff<1&&Math.abs(uu(R.yaw-w))>S&&(L*=Math.max(i.behindFalloff,0)),E+=R.x*L,T+=R.z*L,b+=L}a.mainId=x.id,a.mainYaw=M;const y=n.dummies.find(R=>R.id===x.id),C=(y?y.position.y:0)+n.config.dummies.height*Ms(i.aimHeightRatio,0,1),I=s.y+n.config.characterHeight*Ms(i.eyeHeightRatio,0,1);a.mainPitch=Math.atan2(C-I,Math.max(Si,Math.hypot(x.dx,x.dz))),a.centroidYaw=b>Si?Math.atan2(E/b-s.x,T/b-s.z):M,a.threatCount=r.length,a.threat=h}function Wx(n,t){const e=n.config.gaze;return(e.modeWeight[t.mode]??.5)>=e.hostileModeWeight}function Yx(n,t){const e=n.config.gaze;if(!e.enabled||!n.modules.gaze)return 0;const i=n.character.position,a=Math.hypot(t.position.x-i.x,t.position.z-i.z);if(a<Si||a>e.threatRange)return 0;const s=Math.max(Si,e.threatRange-e.nearDistance),o=Ms((e.threatRange-a)/s,0,1);let r=o*(e.modeWeight[t.mode]??.5);t.attackPhase==="active"&&(r+=e.attackBoost*o);const c=Math.max(Si,e.modeWeight.attack??1.5);return Ms(r/c,0,1)}const Ba=1e-6,Ls=Math.PI*2,Po={enabled:!1,dirDeg:0,speed:0,amplitude:0,wavelength:4,secondWave:{wavelength:2,amplitude:0,speedScale:1},gust:{periodSec:8,depth:0},jitter:0,shadeAmount:0};function Gp(n){var t;return((t=n==null?void 0:n.grass)==null?void 0:t.wind)??Po}function lc(n){return{time:0,gust:1-Math.min(1,Math.max(0,n.gust.depth))}}function $x(n,t,e){if(!t.enabled)return;n.time+=Math.max(0,e);const i=Math.max(.1,t.gust.periodSec),a=Math.min(1,Math.max(0,t.gust.depth));n.gust=1-a+a*(.5+.5*Math.sin(Ls*n.time/i-Math.PI/2))}function Zx(n,t,e,i){const a=n.dirDeg*Math.PI/180,s=t*Math.cos(a)+e*Math.sin(a),o=Ls/Math.max(.1,n.wavelength),r=Ls/Math.max(.1,n.secondWave.wavelength);return[o*s+i,r*s+i*1.7]}function Xp(n){const t=n.dirDeg*Math.PI/180,e=Ls/Math.max(.1,n.wavelength),i=Ls/Math.max(.1,n.secondWave.wavelength);return{dirX:Math.cos(t),dirZ:Math.sin(t),omega1:e*n.speed,omega2:i*n.speed*n.secondWave.speedScale,amp1:n.amplitude,amp2:n.secondWave.amplitude,shadeAmount:n.shadeAmount}}const jx=.18,fu=.4,qx=.6;function Kx(n,t,e){if(n<0)return 0;if(n===0)return 1;if(t<=0)return 0;const i=Math.min(1,Math.max(0,1-n/t)),a=Math.min(1,Math.max(0,e))*jx,s=Math.min(1,Math.max(0,(i-a)/(1-a)));return s*s*(3-2*s)}function Jx(n){let t=n>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function Vp(n,t){return n+","+t}function Qx(n,t,e){return{spec:e??{minCellX:0,maxCellX:0,minCellZ:0,maxCellZ:0,density:0,bladesPerPatch:[0,0],avoidMargin:0,seed:0},cellSize:t.cellSize>0?t.cellSize:.5,bucketCells:(n==null?void 0:n.bucketCells)??4,blades:[],patches:[],buckets:{},cutCount:0,lastCutAt:0,wind:lc((n==null?void 0:n.wind)??Po)}}function tv(n,t,e,i){const a=t.grass,s=n.grass;if(!a||!s||!s.enabled)return Qx(s,i,a);const o=i.cellSize>0?i.cellSize:.5,r=Jx(a.seed),c=Math.max(1,Math.floor(s.footprintCells)),l=Math.max(1,s.bucketCells)*o,d=Math.max(o,s.minHeightCells*o),u=Math.max(d,s.maxHeightCells*o),[h,f]=a.bladesPerPatch,m=Math.max(0,Math.floor(h)),v=Math.max(m,Math.floor(f)),g=e.filter(T=>T.kind!=="ground").map(T=>({minX:T.minX-a.avoidMargin,maxX:T.maxX+a.avoidMargin,minZ:T.minZ-a.avoidMargin,maxZ:T.maxZ+a.avoidMargin})),p=[],_=[],x={},M=a.plots??[],S=(T,b)=>{const y=T+c/2,C=b+c/2;for(let I=0;I<M.length;I++){const R=M[I],U=Math.max(0,R.clearMarginCells??0);if(y>=R.minCellX-U&&y<=R.maxCellX+U&&C>=R.minCellZ-U&&C<=R.maxCellZ+U)return!0}return!1},w=(T,b,y)=>{const C=p.length;for(let I=0;I<y;I++){const R=(T+r()*c)*o,U=(b+r()*c)*o;let L=!1;for(let Dt=0;Dt<g.length;Dt++){const j=g[Dt];if(R>=j.minX&&R<=j.maxX&&U>=j.minZ&&U<=j.maxZ){L=!0;break}}if(L)continue;const k=Cp(e,R,U,3,0,.05),B=d+(u-d)*r(),G=(B-d)/Math.max(Ba,u-d),$=Math.min(1,Math.max(0,r()*.68+G*.32)),at=p.length;p.push({id:at,x:R,y:k,z:U,yaw:r()*Ls,height:B,width:o*.26,tone:$,lean:(r()-.5)*.24,bend:0,bendX:0,bendZ:0,targetBend:0,recover:0,cut:0,cutAt:0});const mt=Vp(Math.floor(R/l),Math.floor(U/l)),ft=x[mt];ft?ft.push(at):x[mt]=[at]}p.length>C&&_.push({id:_.length,cellX:T,cellZ:b,bladeFrom:C,bladeTo:p.length})},E=()=>m+Math.floor(r()*(v-m+1));for(let T=a.minCellZ;T+c<=a.maxCellZ;T+=c)for(let b=a.minCellX;b+c<=a.maxCellX;b+=c){const y=r();S(b,T)||y>a.density||w(b,T,E())}for(let T=0;T<M.length;T++){const b=M[T],y=Math.min(1,Math.max(0,b.density??1));for(let C=b.minCellZ;C+c<=b.maxCellZ;C+=c)for(let I=b.minCellX;I+c<=b.maxCellX;I+=c)r()>y||w(I,C,E())}return{spec:a,cellSize:o,bucketCells:s.bucketCells,blades:p,patches:_,buckets:x,cutCount:0,lastCutAt:0,wind:lc(s.wind??Po)}}function Wp(n,t,e,i){const a=Math.max(1,n.bucketCells)*n.cellSize,s=Math.floor((t-i)/a),o=Math.floor((t+i)/a),r=Math.floor((e-i)/a),c=Math.floor((e+i)/a),l=[];for(let d=s;d<=o;d++)for(let u=r;u<=c;u++){const h=n.buckets[Vp(d,u)];if(h)for(let f=0;f<h.length;f++)l.push(h[f])}return l}function ev(n){const t=n.grass,e=n.config.grass;if(!t||!e||!e.enabled||!n.modules.grass)return 0;const i=Mp(n);if(!i.active&&i.slamRadius<=0)return 0;const a=.02,s=Math.max(i.reach,i.slamRadius)+1;let o=0;const r=Wp(t,i.x,i.z,s);for(let c=0;c<r.length;c++){const l=t.blades[r[c]];if(l.cut!==0||!lg(i,l.x,l.z,a)&&!hg(i,l.x,l.z,a))continue;l.cut=e.regrow?Math.max(Ba,e.regrowSec):-1,l.cutAt=n.time;const d=l.x-i.x,u=l.z-i.z,h=Math.sqrt(d*d+u*u);l.bendX=h>Ba?d/h:i.fx,l.bendZ=h>Ba?u/h:i.fz,l.bend=Math.min(e.maxBendRad,.55),l.targetBend=0,o+=1}return o>0&&(t.cutCount+=o,t.lastCutAt=n.time,n.events.push({type:"grass-cut",tick:n.tick,x:i.x,y:n.character.position.y,z:i.z,value:o})),o}function nv(n,t){const e=n.grass,i=n.config.grass;if(!e||e.blades.length===0||!i||!i.enabled||!n.modules.grass)return;const a=Gp(n.config);e.wind||(e.wind=lc(a)),$x(e.wind,a,t);const s=e.blades,o=s.length,r=new Array(o).fill(0),c=Math.max(0,i.bendRadius)+n.config.characterRadius;for(let m=0;m<o;m++)s[m].targetBend=0;const l=n.character.position.x,d=n.character.position.z,u=(m,v)=>{const g=Wp(e,m,v,c);for(let p=0;p<g.length;p++){const _=g[p],x=s[_];if(x.cut!==0)continue;const M=x.x-m,S=x.z-v,w=Math.sqrt(M*M+S*S);if(w>c)continue;const E=1-w/c,T=i.maxBendRad*E*E;if(T>x.targetBend){x.targetBend=T;const b=w>Ba?1/w:0;x.bendX=w>Ba?M*b:0,x.bendZ=w>Ba?S*b:1,x.recover=0}r[_]=1}};if(u(l,d),n.modules.dummies)for(let m=0;m<n.dummies.length;m++)u(n.dummies[m].position.x,n.dummies[m].position.z);const h=1-Math.exp(-Math.max(0,i.bendRate)*t),f=1-Math.exp(-Math.max(0,i.recoverRate)*t);for(let m=0;m<o;m++){const v=s[m];v.bend+=(v.targetBend-v.bend)*(v.targetBend>v.bend?h:f),v.bend<1e-4&&(v.bend=0),!r[m]&&v.bend===0&&(v.recover+=t),v.cut>0&&(v.cut-=t,v.cut<=0&&(v.cut=0))}ev(n)}function iv(n){const t=n.grass;if(!t)return;for(let i=0;i<t.blades.length;i++){const a=t.blades[i];a.bend=0,a.targetBend=0,a.bendX=0,a.bendZ=0,a.recover=0,a.cut=0,a.cutAt=0}t.cutCount=0,t.lastCutAt=0;const e=lc(Gp(n.config));t.wind.time=e.time,t.wind.gust=e.gust}const aa=1e-6,pu=Math.PI/180,av=1.47;function La(n,t,e){return n<t?t:n>e?e:n}function sv(n,t,e,i,a,s,o,r){const c=Math.max(aa,e),l=La(r.minU??.08,0,1),d=La(r.maxU??.92,0,1);let u=La((n-t)/c,l,d);const h=r.bands;if(h&&h.length>0){let R=h[0],U=Math.abs(R-u);for(let L=1;L<h.length;L++){const k=Math.abs(h[L]-u);k<U&&(R=h[L],U=k)}u=La(R,l,d)}const f=Math.sqrt(a*a+s*s+o*o),m=f>aa?a/f:0,v=f>aa?s/f:0,g=f>aa?o/f:1,p=Math.sqrt(m*m+g*g),_=p>aa?m/p:0,x=p>aa?g/p:1,M=r.pitchGain??.85,S=La(r.maxTiltDeg??62,0,89)*pu,w=Math.max(0,-v);let E=Math.min(S,La(r.tiltDeg,0,89)*pu+w*M);const T=u*c,b=Math.min(T,c-T),y=Math.atan(Math.max(0,b*.9)/Math.max(aa,i));E=Math.min(E,y);const C=Math.tan(E),I=1/Math.sqrt(1+C*C);return{u,theta:E,nx:_*C*I,ny:I,nz:x*C*I,ax:x,ay:0,az:-_}}function ov(n,t,e,i,a,s,o){const r=e*i,c=1/Math.max(aa,s),l=Math.max(1,Math.floor(t)),d=[];for(let u=0;u<l;u++){const h=u/l*Math.PI*2,f=Math.cos(h)*n,m=Math.sin(h)*n;d.push(La(r-(a*f+o*m)*c,0,i))}return d}function rv(n){return!n||n.length===0?[]:n.map(t=>({id:t.id,kind:t.kind,x:t.x,y:t.y,z:t.z,height:t.height,radius:t.radius,tiltDeg:t.tiltDeg??18,pitchGain:t.pitchGain??.85,maxTiltDeg:t.maxTiltDeg??62,fallSec:t.fallSec??.9,bands:t.bands?[...t.bands]:[],color:t.color??"#8a6b4a",cutColor:t.cutColor??"#e8c9a0",broken:0,cutU:1,theta:0,nx:0,ny:1,nz:0,ax:0,ay:0,az:-1,fall:0,brokenAt:0}))}function Yp(n,t,e,i,a,s,o){const r=sv(i,t.y,t.height,t.radius,a,s,o,{tiltDeg:t.tiltDeg,bands:t.bands,pitchGain:t.pitchGain,maxTiltDeg:t.maxTiltDeg});t.broken=1,t.cutU=r.u,t.theta=r.theta,t.nx=r.nx,t.ny=r.ny,t.nz=r.nz,t.ax=r.ax,t.ay=r.ay,t.az=r.az,t.fall=0,t.brokenAt=n.time,n.events.push({type:"break",tick:n.tick,x:t.x,y:t.y+r.u*t.height,z:t.z,value:e})}function cv(n,t,e,i,a,s){const o=n.destructibles;if(!o)return!1;for(let r=0;r<o.length;r++){const c=o[r];if(!(c.id!==t||c.broken!==0))return Yp(n,c,r,e,i,a,s),!0}return!1}function lv(n,t,e){const i=n.destructibles;if(!i||i.length===0||!n.modules.destructibles)return;const a=e.breakHits??[],s=a.length>0?Mp(n):null;if(!!s&&(s.active||s.slamRadius>0)&&s)for(let r=0;r<a.length;r++){const c=a[r];let l=-1;for(let u=0;u<i.length;u++)if(i[u].id===c.id){l=u;break}if(l<0)continue;const d=i[l];d.broken===0&&Yp(n,d,l,c.y,c.dx,c.dy,c.dz)}for(let r=0;r<i.length;r++){const c=i[r];if(c.broken===0)continue;const l=1-Math.exp(-t*3/Math.max(.1,c.fallSec));c.fall+=(av-c.fall)*l}}function $p(n){const t=n.destructibles;if(t)for(let e=0;e<t.length;e++){const i=t[e];i.broken=0,i.cutU=1,i.theta=0,i.nx=0,i.ny=1,i.nz=0,i.ax=0,i.ay=0,i.az=-1,i.fall=0,i.brokenAt=0}}function hv(){return{active:!1,mainId:0,mainYaw:0,mainPitch:0,centroidYaw:0,threatCount:0,threat:0}}function dv(n,t){const e=Ng(t);return{tick:0,time:0,rngState:2654435769,config:n,boxes:e,gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:zp(1),playerLink:rc(),arrows:[],arrowSeq:0,abilities:zg(),skills:kg(n),impulse:{x:0,z:0},targeting:Hx(),turnInPlace:gg(),playerHurt:vp(),hitCount:0,dash:{...Lx(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{...Rp(),centroidX:n.spawn.x,centroidZ:n.spawn.z},gaze:hv(),dummies:mx(n.dummies),dummyAttackCount:0,grass:tv(n,t,e,t.grid),destructibles:rv(t.destructibles),events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,turnInPlace:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,gaze:!0,dummies:!0,grass:!0,destructibles:!0}}}function uv(n){Ix(n),Bp(n),Dp(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.lastAt=Oh,e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,Ap(n),Lp(n),Hp(n),Pp(n),Gr(n);const i=n.gaze;i.active=!1,i.mainId=0,i.mainYaw=0,i.mainPitch=0,i.centroidYaw=0,i.threatCount=0,i.threat=0,iv(n),$p(n),n.events.length=0}function mu(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){uv(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?Xx(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),Qg(n,t,e),n.modules.combat&&lx(n,t,e),n.modules.dash&&kx(n,t,e),n.modules.movement&&Fx(n,t,e),n.modules.gaze&&Vx(n,t,e),n.modules.orientation&&Mg(n,t,e),yg(n,t,e),n.modules.dummies&&Tx(n,t,e),cg(n,t),jg(n,t),n.modules.abilities&&Fg(n,t,e),n.modules.combat&&Yg(n,t),n.modules.dummies&&(mg(n,t),n.modules.separation&&(Ux(n),Ox(n))),nv(n,t),lv(n,t,e),n.modules.camera?Ug(n):Pp(n),n}const Zp=["bodyYaw","bodyPitch","bodyRoll","pelvisX","pelvisZ","armPitch","armYaw","armRoll","elbow","bladePitch","armLPitch","armLYaw","armLRoll","elbowL","rootYaw","bladePitchOff","bladeTwist","bladeTwistOff","bladeYaw","bladeYawOff"],gu=1e-9;function fv(n,t,e){return n<t?t:n>e?e:n}function jp(n){return fv(Number.isFinite(n)?n:0,0,1)}function qp(n,t){const e=jp(t);return n==="in"?e*e:n==="out"?1-(1-e)*(1-e):n==="inOut"?e*e*(3-2*e):e}function pv(){const n={};for(const t of Zp)n[t]=0;return n}function mv(n,t){const e=pv(),i=(n==null?void 0:n.keys)??[];if(i.length===0)return e;const a=jp(t);let s=0;for(;s<i.length-1&&a>i[s+1].t+gu;)s+=1;const o=i[s],r=i[Math.min(s+1,i.length-1)],c=r.t-o.t,l=c>gu?(a-o.t)/c:0,d=qp(o.ease??"linear",l);for(const u of Zp){const h=o.pose[u]??r.pose[u]??0,f=r.pose[u]??o.pose[u]??0;e[u]=h+(f-h)*d}return e}function gv(n,t){const e=n==null?void 0:n.spin;if(!e||!Number.isFinite(e.turns)||e.turns===0)return 0;const i=e.ease??"linear",a=Number.isFinite(e.span)&&e.span>0?Math.min(1,e.span):1,s=qp(i,t/a);return e.turns*Math.PI*2*s}function Ma(n,t){return((n==null?void 0:n.keys)??[]).some(e=>typeof e.pose[t]=="number")}function xv(n){let t=0;return{frame(e,i,a,s,o){if(s||a<=0)return t=0,0;t+=Math.min(e,.1)*a;const r=n.config.fixedDt,c=n.config.maxStepsPerFrame;let l=0;for(;t>=r&&l<c;){const d=l===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};mu(n,r,d),o&&o(),t-=r,l++}return l>=c&&(t=0),l},singleStep(e){mu(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t},get alpha(){const e=n.config.fixedDt;return e>0?Math.max(0,Math.min(1,t/e)):1}}}function Ii(n,t,e){let i=t-n;for(;i>Math.PI;)i-=Math.PI*2;for(;i<-Math.PI;)i+=Math.PI*2;return n+i*e}function Ie(n,t,e){return n+(t-n)*e}function vv(n){const t=n.combat,e=n.dummies;let i=`${t.weapon}|${t.phase}|${t.comboIndex}|${t.attackId}|${n.character.grounded?1:0}|${n.character.sprinting?1:0}|${n.playerHurt.type}|${t.hitstop>0?1:0}|d:${n.dash.phase}:${n.dash.kind}|t:${n.turnInPlace.phase}|l:${n.playerLink.phase}:${n.playerLink.kind}`;for(let a=0;a<e.length;a++){const s=e[a];i+=`|${s.id}:${s.mode}:${s.attackPhase}:${s.attackId}:${s.hurt.type}`}return i}function xu(n){const t=n.character,e=n.combat,i=n.playerHurt;return{time:n.time,key:vv(n),ch:{x:t.position.x,y:t.position.y,z:t.position.z,facing:t.facing,moveYaw:t.moveYaw,bodyYaw:t.bodyYaw,headYaw:t.headYaw,headPitch:t.headPitch,bodyPitch:t.bodyPitch,gaitPhase:t.gaitPhase,stride:t.stride,vx:t.velocity.x,vy:t.velocity.y,vz:t.velocity.z},cb:{attackProgress:e.attackProgress,phaseTimer:e.phaseTimer,charge:e.charge,hitstop:e.hitstop},dash:{timer:n.dash.timer},turn:{progress:n.turnInPlace.progress},link:{progress:n.playerLink.progress},hurt:{timer:i.timer,duration:i.duration,knockX:i.knockX,knockZ:i.knockZ},dm:n.dummies.map(a=>({x:a.position.x,y:a.position.y,z:a.position.z,facing:a.facing,bodyYaw:a.bodyYaw,headYaw:a.headYaw,gaitPhase:a.gaitPhase,stride:a.stride,attackProgress:a.attackProgress,vx:a.velocity.x,vy:a.velocity.y,vz:a.velocity.z}))}}function yv(n,t){return n.key===t.key&&n.dm.length===t.dm.length}function Mv(n,t,e){const i=Math.max(0,Math.min(1,e)),a={position:{x:Ie(n.ch.x,t.ch.x,i),y:Ie(n.ch.y,t.ch.y,i),z:Ie(n.ch.z,t.ch.z,i)},facing:Ii(n.ch.facing,t.ch.facing,i),moveYaw:Ii(n.ch.moveYaw,t.ch.moveYaw,i),bodyYaw:Ii(n.ch.bodyYaw,t.ch.bodyYaw,i),headYaw:Ii(n.ch.headYaw,t.ch.headYaw,i),headPitch:Ie(n.ch.headPitch,t.ch.headPitch,i),bodyPitch:Ie(n.ch.bodyPitch,t.ch.bodyPitch,i),gaitPhase:Ii(n.ch.gaitPhase,t.ch.gaitPhase,i),stride:Ie(n.ch.stride,t.ch.stride,i),velocity:{x:Ie(n.ch.vx,t.ch.vx,i),y:Ie(n.ch.vy,t.ch.vy,i),z:Ie(n.ch.vz,t.ch.vz,i)}},s={attackProgress:Ie(n.cb.attackProgress,t.cb.attackProgress,i),phaseTimer:Ie(n.cb.phaseTimer,t.cb.phaseTimer,i),charge:Ie(n.cb.charge,t.cb.charge,i),hitstop:i<1?Math.max(0,Ie(n.cb.hitstop,t.cb.hitstop,i)):t.cb.hitstop},o={timer:Ie(n.hurt.timer,t.hurt.timer,i),knockX:Ie(n.hurt.knockX,t.hurt.knockX,i),knockZ:Ie(n.hurt.knockZ,t.hurt.knockZ,i)},r=t.dm.map((c,l)=>{const d=n.dm[l];return d?{position:{x:Ie(d.x,c.x,i),y:Ie(d.y,c.y,i),z:Ie(d.z,c.z,i)},facing:Ii(d.facing,c.facing,i),bodyYaw:Ii(d.bodyYaw,c.bodyYaw,i),headYaw:Ii(d.headYaw,c.headYaw,i),gaitPhase:Ii(d.gaitPhase,c.gaitPhase,i),stride:Ie(d.stride,c.stride,i),attackProgress:Ie(d.attackProgress,c.attackProgress,i),velocity:{x:Ie(d.vx,c.vx,i),y:Ie(d.vy,c.vy,i),z:Ie(d.vz,c.vz,i)}}:null});return{time:Ie(n.time,t.time,i),character:a,combat:s,playerHurt:o,dash:{timer:Ie(n.dash.timer,t.dash.timer,i)},turn:{progress:Ie(n.turn.progress,t.turn.progress,i)},link:{progress:Ie(n.link.progress,t.link.progress,i)},dummies:r}}function _v(n,t){const e=n.dummies.map((i,a)=>{const s=t.dummies[a];return s?{...i,...s}:i});return{...n,time:t.time,character:{...n.character,...t.character},combat:{...n.combat,...t.combat},playerHurt:{...n.playerHurt,...t.playerHurt},dash:{...n.dash,timer:t.dash.timer},turnInPlace:{...n.turnInPlace,progress:t.turn.progress},playerLink:{...n.playerLink,progress:t.link.progress},dummies:e}}const Kp={slopPx:12,longPressMs:450,doubleTapMs:280};function bv(n,t,e=Kp.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,a=n.dy/n.distance,s=t.rightX*i+t.forwardX*-a,o=t.rightZ*i+t.forwardZ*-a,r=Math.hypot(s,o);return r<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:s/r,worldZ:o/r}}function _a(n,t,e,i,a,s){const o=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:o,angleDeg:o>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:a,taps:s,worldX:0,worldZ:0}}function Sv(n=Kp){const t=new Map,e=new Map,i=a=>t.get(a);return{begin(a,s,o,r,c){if(t.has(s))return null;for(const l of t.values())if(l.button===a)return null;return t.set(s,{button:a,pointerId:s,startX:o,startY:r,x:o,y:r,startedAt:c,dragging:!1,longFired:!1}),_a(a,"press",0,0,0,1)},move(a,s,o,r){const c=i(a);if(!c)return null;c.x=s,c.y=o;const l=s-c.startX,d=o-c.startY;return!c.dragging&&Math.hypot(l,d)>=n.slopPx?(c.dragging=!0,_a(c.button,"drag",l,d,r-c.startedAt,1)):null},end(a,s,o,r){const c=i(a);if(!c)return null;t.delete(a),c.x=s,c.y=o;const l=s-c.startX,d=o-c.startY,u=r-c.startedAt,h=Math.hypot(l,d);if(c.dragging||c.longFired||h>=n.slopPx)return _a(c.button,"release",l,d,u,1);const f=e.get(c.button);return f!==void 0&&r-f.at<=n.doubleTapMs&&Math.hypot(s-f.x,o-f.y)<=n.slopPx*2?(e.delete(c.button),_a(c.button,"doubleTap",l,d,u,2)):(e.set(c.button,{at:r,x:s,y:o}),_a(c.button,"tap",l,d,u,1))},cancel(a,s){const o=i(a);return o?(t.delete(a),_a(o.button,"cancel",o.x-o.startX,o.y-o.startY,s-o.startedAt,1)):null},poll(a){for(const s of t.values())if(!(s.longFired||s.dragging)&&a-s.startedAt>=n.longPressMs)return s.longFired=!0,_a(s.button,"longPress",s.x-s.startX,s.y-s.startY,a-s.startedAt,1);return null},isHeld(a){for(const s of t.values())if(s.button===a)return!0;return!1},reset(){t.clear(),e.clear()}}}const Fc=.001,wv=18;function Gl(n,t,e){return n<t?t:n>e?e:n}function Xl(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function Ev(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function Tv(n,t,e,i,a=wv){const s=Ev(t);if(!s)return{state:Xl(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const o=Math.hypot(s[1].x-s[0].x,s[1].y-s[0].y),r=a,c=Math.max(1.0001,Number.isFinite(i)?i:1.25),l=1/c,d=c;if(!Number.isFinite(o)||o<Fc)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const m=r<=0;return{state:{active:!0,lastDist:o,armDist:o,armed:m},scale:1,started:!0,ended:!1,armedNow:!1,pinching:m}}if(!n.armed)return n.armDist<Fc?{state:{active:!0,lastDist:o,armDist:o,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(o-n.armDist)<r?{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<Fc)return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const u=o/n.lastDist,h=Math.max(0,Number.isFinite(e)?e:1),f=Number.isFinite(u)&&u>0?Math.pow(u,h):1;return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:Gl(Number.isFinite(f)?f:1,l,d),started:!1,ended:!1,armedNow:!1,pinching:!0}}function vu(n,t,e,i){const a=Math.min(e,i),s=Math.max(e,i),o=Number.isFinite(t)&&t>0?t:1,r=n*o;return Number.isFinite(r)?Gl(r,a,s):Gl(n,a,s)}function Av(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function Rv(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const Uc=["jump","sprint","reset","attack","skill2"],Pv=8,Cv=16,Nc=10,yu=14,Mu=140,Lv=18,Dv=16,kv=400,Iv=1.0001;function Cr(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function zv(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&Cr(e)}function Fv(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:a}=n,s=()=>Math.max(8,t());let o=null,r=0,c=0,l=0,d=0,u=0,h=0,f=-1,m=0,v=null,g=-1,p=0,_=0,x=0,M=0,S=!1,w=0,E=1,T=0,b=null,y=0,C=0,I=!1,R=null,U=null,L=0,k=0,B=0,G=0,$=!1,at=!0,mt=-1;const ft=Sv({slopPx:yu,longPressMs:450,doubleTapMs:350});let Dt=[],j=null;const F=new Set;function Y(Z){Z&&Dt.push(Z)}const J=new Map;let K=Xl(),st=!1,Tt=1;function Wt(){const Z=Array.from(J.values()),V=a(),pt=Tv(K,Z,V.pinchGain,V.maxStepRatio,Lv);if(K=pt.state,st=pt.pinching,pt.scale!==1&&(Tt*=pt.scale),pt.started||pt.armedNow)b=null,I=!0,R=null;else if(pt.ended&&o===null&&Z.length===1){const Ht=Z[0];o=Ht.id,r=Ht.x,c=Ht.y,l=0,d=0,u=Ht.x,h=Ht.y,S=!1,w=0,E=1,T=0,performance.now(),b=null,I=!0,R=null}}const dt={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},X={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let H=0,kt=0;const Rt={},_t=new Set,vt=[];function gt(){for(const Z of Uc)Rt[Z]!==void 0&&(Rt[Z]=void 0),q(Z);ft.reset(),F.clear(),J.clear(),K=Xl(),st=!1,o=null,l=0,d=0,u=0,h=0,S=!1,w=0,E=1,T=0,p=0,_=0,x=0,M=0,v=null,g=-1,b=null,I=!1,R=null,U=null,mt=-1,B=0,G=0,$=!1,at=!0}const Pt=()=>{document.hidden&&gt()},D=Z=>{if(Z.clientX===0&&Z.clientY===0){m++;return}if(Cr(Z.target)||zv(Z.clientX,Z.clientY)){F.add(Z.pointerId);return}if(F.delete(Z.pointerId),J.set(Z.pointerId,{id:Z.pointerId,x:Z.clientX,y:Z.clientY}),o===null&&!st){v=null,g=-1,o=Z.pointerId,r=Z.clientX,c=Z.clientY,l=0,d=0,u=Z.clientX,h=Z.clientY,performance.now();const V=Number.isFinite(Z.screenX)&&Number.isFinite(Z.screenY)&&(Z.screenX!==0||Z.screenY!==0);S=V,w=0,E=1,T=0,p=V?Z.screenX:0,_=V?Z.screenY:0,x=p,M=_,b=Z.pointerId,y=Z.clientX,C=Z.clientY,I=!1}Wt()},A=Z=>{if(Z.pointerId===U&&(Z.pointerType==="mouse"&&Z.buttons===0||Z.clientX===0&&Z.clientY===0&&(L!==0||k!==0)||(at?(B=Z.clientX-L,G=Z.clientY-k):(L=Z.clientX,k=Z.clientY,at=!0,B=0,G=0))),Y(ft.move(Z.pointerId,Z.clientX,Z.clientY,performance.now())),!F.has(Z.pointerId)&&J.has(Z.pointerId)&&(J.set(Z.pointerId,{id:Z.pointerId,x:Z.clientX,y:Z.clientY}),Wt()),F.has(Z.pointerId)||Z.pointerId!==o)return;const V=performance.now();if(v===Z.pointerId&&V-g<150){m++;return}const pt=Z.clientX,Ht=Z.clientY;if(pt===0&&Ht===0&&(r!==0||c!==0)){m++;return}const Lt=pt-u,N=Ht-h,bt=Number.isFinite(Z.screenX)&&Number.isFinite(Z.screenY),et=bt?Z.screenX:0,ht=bt?Z.screenY:0,It=bt&&(et!==0||ht!==0),At=et-x,jt=ht-M;if(S&&It){const Pe=Math.hypot(At,jt),Ee=Math.hypot(Lt,N);if(Pe>3){if(w=0,T<30&&Ee>6&&At*Lt+jt*N>.7*Pe*Ee){const mn=Pe/Ee;mn>.2&&mn<5&&(E+=(mn-E)*.3,T++)}}else Ee>12&&(w++,w>=2&&(S=!1))}const se=Math.hypot(Lt,N);if(!S){const Pe=f<0?Number.POSITIVE_INFINITY:V-f,Ee=It?Math.hypot(At,jt):1/0;se>28&&(Pe<200||Ee<se*.4)&&(r+=Lt,c+=N,m++)}u=pt,h=Ht,x=et,M=ht,Z.pointerId===b&&Math.hypot(Z.clientX-y,Z.clientY-C)>Pv&&(I=!0);let oe,ee;S&&It?(oe=(et-p)/E,ee=(ht-_)/E):(oe=pt-r,ee=Ht-c);const ye=Math.hypot(oe,ee),we=s();ye>we&&(oe*=we/ye,ee*=we/ye);const Qe=Math.hypot(l,d),ln=Math.hypot(oe,ee);if(Qe>10&&ln>10){const Pe=Math.abs(Math.atan2(l*ee-d*oe,l*oe+d*ee)),Ee=Math.max(Qe,ln)*Pe,mn=Math.max(Math.hypot(Lt,N),Math.hypot(At,jt)/Math.max(.2,E));if(Pe>.6&&mn<Math.max(6,Ee*.5)){m++;return}}l=oe,d=ee};function q(Z){if(!dt[Z])return;dt[Z]=!1,Z==="attack"&&(X.attackReleased=!0);const V=document.getElementById(`btn-${Z}`);V==null||V.classList.remove("is-down")}function ut(){o!==null&&(v=o,g=performance.now(),o=null,l=0,d=0,u=0,h=0,S=!1,w=0,E=1,T=0,p=0,_=0,x=0,M=0)}const it=Z=>{const V=J.delete(Z.pointerId),pt=F.delete(Z.pointerId);V&&Wt(),Z.pointerId===U&&(U=null,$?mt=performance.now():(B=0,G=0,mt=-1)),Y(ft.end(Z.pointerId,Z.clientX,Z.clientY,performance.now()));for(const Ot of Uc)Rt[Ot]===Z.pointerId&&(Rt[Ot]=void 0,q(Ot));const Ht=!V&&!pt&&J.size<=1&&o!==null;(Z.pointerId===o||J.size===0||Ht)&&ut(),!pt&&Z.pointerId===b&&(!I&&!Cr(Z.target)&&(R={x:Z.clientX,y:Z.clientY}),b=null)};for(const Z of Uc){const V=document.getElementById(`btn-${Z}`);if(!V)continue;const pt=Z==="attack"||Z==="skill2",Ht=N=>{if(N.preventDefault(),Rt[Z]===void 0){Rt[Z]=N.pointerId,dt[Z]=!0,Z==="jump"&&(X.jump=!0),Z==="reset"&&(X.reset=!0),Z==="sprint"&&(X.sprintPressed=!0),Z==="attack"&&(X.attackPressed=!0),Z==="skill2"&&(X.skill2=!0),V.classList.add("is-down"),Y(ft.begin(Z,N.pointerId,N.clientX,N.clientY,performance.now()));try{V.setPointerCapture(N.pointerId)}catch{}pt&&(U=N.pointerId,L=N.clientX,k=N.clientY,at=!(N.clientX===0&&N.clientY===0),B=0,G=0,$=!1,mt=-1)}},Ot=N=>{Rt[Z]===N.pointerId&&(Rt[Z]=void 0,q(Z),Y(ft.end(N.pointerId,N.clientX,N.clientY,performance.now())))},Lt=N=>{Rt[Z]===N.pointerId&&(Rt[Z]=void 0,q(Z),Y(ft.cancel(N.pointerId,performance.now())))};V.addEventListener("pointerdown",Ht),V.addEventListener("pointerup",Ot),V.addEventListener("pointercancel",Lt),vt.push(()=>{V.removeEventListener("pointerdown",Ht),V.removeEventListener("pointerup",Ot),V.removeEventListener("pointercancel",Lt)})}const lt=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const Z of lt){const V=pt=>{pt.preventDefault(),H=Number(Z.dataset.weapon)||0};Z.addEventListener("pointerdown",V),vt.push(()=>Z.removeEventListener("pointerdown",V))}const Nt=Z=>{const V=Z.key.toLowerCase();if((V===" "||V.startsWith("arrow"))&&Z.preventDefault(),_t.has(V))return;_t.add(V),V===" "&&(X.jump=!0),V==="r"&&(X.reset=!0),V==="shift"&&(X.sprintPressed=!0),V==="j"&&(X.attackPressed=!0),V==="k"&&(X.skill2=!0),V>="1"&&V<="5"&&(H=Number(V)),V>="6"&&V<="9"&&(kt=Number(V)-5);const pt=Math.max(Iv,a().keyStep||1.12);(V==="="||V==="+")&&(Tt*=pt),(V==="-"||V==="_")&&(Tt/=pt)},Ct=Z=>{const V=Z.key.toLowerCase();_t.has(V)&&(_t.delete(V),V==="j"&&(X.attackReleased=!0))},wt=Z=>{if(Cr(Z.target))return;Z.preventDefault();const V=Z.deltaMode===1?Z.deltaY*Dv:Z.deltaMode===2?Z.deltaY*kv:Z.deltaY;Tt*=Av(V,a().wheelStep)},$t=Z=>{Z.preventDefault()},yt=()=>{f=performance.now()};window.addEventListener("resize",yt),window.addEventListener("orientationchange",yt);const zt=typeof window<"u"?window.visualViewport:null;return zt&&(zt.addEventListener("resize",yt),zt.addEventListener("scroll",yt)),window.addEventListener("pointerdown",D),window.addEventListener("pointermove",A),window.addEventListener("pointerup",it),window.addEventListener("pointercancel",it),window.addEventListener("blur",gt),document.addEventListener("visibilitychange",Pt),window.addEventListener("keydown",Nt),window.addEventListener("keyup",Ct),window.addEventListener("wheel",wt,{passive:!1}),window.addEventListener("gesturestart",$t),{peekStick(){return{id:o,held:o!==null,originX:r,originY:c,x:u,y:h,dx:u-r,dy:h-c,radius:s(),badMoves:m,screenOk:S,originSX:p,originSY:_,screenX:x,screenY:M,scale:E}},peekAim(){const Z=performance.now(),V=Math.hypot(B,G),pt=U!==null||mt>=0&&Z-mt<Mu;if(!(pt&&$&&V>=Nc))return{active:!1,holding:pt,x:0,z:0,dx:B,dy:G};const Ot=i(),Lt=B/V,N=G/V,bt=Ot.rightX*Lt+Ot.forwardX*-N,et=Ot.rightZ*Lt+Ot.forwardZ*-N,ht=Math.hypot(bt,et)||1;return{active:!0,holding:pt,x:bt/ht,z:et/ht,dx:B,dy:G}},sample(){var In;const Z=s();let V=o!==null?Math.max(-1,Math.min(1,l/Z)):0,pt=o!==null?Math.max(-1,Math.min(1,d/Z)):0,Ht=0,Ot=0;(_t.has("a")||_t.has("arrowleft"))&&(Ht-=1),(_t.has("d")||_t.has("arrowright"))&&(Ht+=1),(_t.has("w")||_t.has("arrowup"))&&(Ot-=1),(_t.has("s")||_t.has("arrowdown"))&&(Ot+=1),V+=Ht,pt+=Ot;let Lt=Math.hypot(V,pt);Lt>1&&(V/=Lt,pt/=Lt,Lt=1);const N=V,bt=pt;Lt<e&&(V=0,pt=0);const et=i();let ht=et.rightX*V+et.forwardX*-pt,It=et.rightZ*V+et.forwardZ*-pt;const At=Math.hypot(ht,It);At>1&&(ht/=At,It/=At);const jt=performance.now();Y(ft.poll(jt));const se=Math.hypot(B,G);U!==null&&(se>=Cv?$=!0:se<Nc&&($=!1));const oe=U!==null||mt>=0&&jt-mt<Mu,ee=oe&&$&&se>=Nc;let ye=0,we=0;if(ee){const tn=B/se,zn=G/se,gn=et.rightX*tn+et.forwardX*-zn,hn=et.rightZ*tn+et.forwardZ*-zn,Ce=Math.hypot(gn,hn)||1;ye=gn/Ce,we=hn/Ce}!oe&&U===null&&(B=0,G=0,mt=-1,$=!1);const Qe=R;R=null;const ln=Tt;Tt=1;const Pe={moveX:ht,moveZ:It,jumpPressed:X.jump,sprintHeld:dt.sprint||_t.has("shift"),sprintPressed:X.sprintPressed,resetPressed:X.reset,attackPressed:X.attackPressed,attackHeld:dt.attack||_t.has("j"),attackReleased:X.attackReleased,skill2Pressed:X.skill2,weaponSlot:H,dummyClickId:kt,aimX:ye,aimZ:we,aimActive:ee};X.jump=!1,X.reset=!1,X.sprintPressed=!1,X.attackPressed=!1,X.attackReleased=!1,X.skill2=!1,H=0,kt=0;const Ee=Dt.map(tn=>bv(tn,et,yu));Dt=[],Ee.length>0&&(j=Ee[Ee.length-1]);const mn=o!==null?"pointer":_t.size>0?"keyboard":"idle";return{intents:Pe,stickX:V,stickY:pt,stickRawX:N,stickRawY:bt,stickHeld:o!==null,stickId:o,stickOriginX:r,stickOriginY:c,stickPxX:u,stickPxY:h,stickBad:m,stickScreenOk:S,stickOriginSX:p,stickOriginSY:_,stickScreenX:x,stickScreenY:M,stickScale:E,stickVpTop:((In=Rv())==null?void 0:In.top)??0,stickVpAge:f<0?-1:Math.round(performance.now()-f),aimDX:B,aimDY:G,source:mn,tap:Qe,zoomScale:ln,gestures:Ee,lastGesture:j}},dispose(){window.removeEventListener("pointerdown",D),window.removeEventListener("pointermove",A),window.removeEventListener("pointerup",it),window.removeEventListener("pointercancel",it),window.removeEventListener("blur",gt),document.removeEventListener("visibilitychange",Pt),window.removeEventListener("keydown",Nt),window.removeEventListener("keyup",Ct),window.removeEventListener("wheel",wt),window.removeEventListener("resize",yt),window.removeEventListener("orientationchange",yt),zt&&(zt.removeEventListener("resize",yt),zt.removeEventListener("scroll",yt)),window.removeEventListener("gesturestart",$t),ft.reset();for(const Z of vt)Z()}}}const Yr=1,$r=2,Zr=4,Jp=8,jr=16,vo=32,Qp=64,tm=128,Uv=[[Yr,"atk"],[$r,"dash"],[Zr,"link"],[Jp,"air"],[jr,"hurt"],[vo,"aim"],[Qp,"spr"],[tm,"chan"]];function Qa(n){if(n===0)return"-";const t=Uv.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const Nv=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],Ov=0,Bv=15,Oc=19,Hv=21,Gv=22,Xv=23,Vv=24,_i={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},Xn=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,di=n=>Math.round(n*180/Math.PI*10)/10,Bc=Math.PI*2;function Qs(n){let t=n%Bc;return t>Math.PI&&(t-=Bc),t<-Math.PI&&(t+=Bc),t}function Wv(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=Yr),n.dash.phase!=="idle"&&(e|=$r),n.playerLink.phase!=="idle"&&(e|=Zr),n.character.grounded||(e|=Jp),n.playerHurt.type!=="none"&&(e|=jr),t.intents.aimActive&&(e|=vo),n.character.sprinting&&(e|=Qp),n.abilities.channeling&&(e|=tm),e}function Yv(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function $v(n){const t={sampleHz:n.sampleHz??_i.sampleHz,sampleCapacity:n.sampleCapacity??_i.sampleCapacity,eventCapacity:n.eventCapacity??_i.eventCapacity,anomalyCapacity:n.anomalyCapacity??_i.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??_i.dirJumpDeg,aimDropDeg:n.aimDropDeg??_i.aimDropDeg,freezeMs:n.freezeMs??_i.freezeMs,freezeSpeed:n.freezeSpeed??_i.freezeSpeed,stickLostMs:n.stickLostMs??_i.stickLostMs,spikeMs:n.spikeMs??_i.spikeMs},e=n.meta,i=[],a=[],s=[],o={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let r=!0,c=-1,l=-1e9,d=null,u=0,h=0,f="",m=-1,v=-1,g=-1,p=0,_=-1e9,x=-1,M={},S=null,w=0,E=0,T=0,b=0;function y(L,k){const B=1/t.sampleHz,G=L[Ov];G-l<B-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(L),l=G)}function C(L,k,B,G,$,at){const mt=M[L]??-1e9;if(k-mt<1.2)return;if(M[L]=k,L==="frameSpike"){let Dt=0;for(const j of s)j.kind==="frameSpike"&&Dt++;if(Dt>=6)return}s.length>=t.anomalyCapacity&&s.shift();let ft=i.slice(-7);at&&(ft.length===0||ft[ft.length-1]!==at)&&(ft=[...ft.slice(-6),at]),s.push({kind:L,t:Xn(k),tick:B,ms:Math.round(G),detail:$,ctx:ft}),L==="dirJump"?o.dirJumps++:L==="aimDrop"?o.aimDrops++:L==="moveFreeze"?o.freezes++:L==="stickLost"?o.stickLosts++:L==="stickJump"?o.stickJumps++:L==="stickBad"?o.stickBads++:L==="stickDrift"&&o.stickDrifts++}function I(L,k,B,G){a.length>=t.eventCapacity&&a.shift(),a.push({t:Xn(B),tick:G,k:L,d:k})}function R(L){switch(L.type){case"attack-start":o.attacks++;break;case"hit":o.hits++;break;case"player-hurt":o.hurts++;break;case"link-start":o.links++;break;case"link-hit":o.linkHits++;break;case"roll":o.rolls++;break;case"blink":o.blinks++;break;case"channel-start":o.channels++;break;case"projectile-fire":o.bolts++;break;case"ring-place":o.rings++;break;case"charge-start":o.bowCharges++;break;case"jumped":o.jumps++;break;case"reset":o.resets++;break;case"blocked":_=L.tick;break}}function U(){const L=o,k=L.wallMs/1e3,B=L.gestures,G=ft=>Object.entries(B).filter(([Dt])=>Dt.endsWith(`.${ft}`)).reduce((Dt,[,j])=>Dt+j,0),$=[];if($.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),$.push(`运行 ${k.toFixed(1)}s / ${L.frames} 帧 · ${L.fps.toFixed(1)}fps · 最大 ${L.dtMax.toFixed(0)}ms · 尖峰 ${L.spikes} · 步 ${L.steps}`),$.push(`摇杆活跃 ${k>0?Math.round(L.stickActiveMs/1e3/k*100):0}% · 手势 按下 ${G("press")}（单击 ${G("tap")} / 双击 ${G("doubleTap")} / 拖拽 ${G("drag")} / 长按 ${G("longPress")} / 打断 ${G("cancel")} / 拖放 ${G("release")}）`),$.push(`攻击 ${L.attacks}(中${L.hits}) · 受击 ${L.hurts} · 派生 ${L.links}(中${L.linkHits}) · 翻滚 ${L.rolls} 闪现 ${L.blinks} · 跳 ${L.jumps} · 复位 ${L.resets}`),$.push(`法杖 引导${L.channels} 飞弹${L.bolts} 电环${L.rings} · 弓蓄力${L.bowCharges} · 当前武器 ${f||"-"}`),$.push(`异常 ${L.dirJumps+L.aimDrops+L.freezes+L.stickLosts+L.stickJumps+L.stickBads+L.stickDrifts}（dir ${L.dirJumps} / aim ${L.aimDrops} / freeze ${L.freezes} / stick ${L.stickLosts} / stickJump ${L.stickJumps} / 坏指针 ${L.stickBads} / 坐标漂移 ${L.stickDrifts}） · 掉帧尖峰 ${L.spikes}`+(L.inTurns>0?` · 输入转向 ${L.inTurns} 次（最大 ${L.inTurnMax.toFixed(0)}°）`:"")),s.length>0)for(const ft of s.slice(-6)){$.push(`· ${ft.kind} @t${ft.t.toFixed(2)} tick${ft.tick} ${ft.ms>0?`${ft.ms}ms `:""}${ft.detail}`);const Dt=ft.ctx.map(F=>String(F[Bv])).join(" "),j=ft.ctx.map(F=>F[Oc]===""||F[Oc]==null?".":String(F[Oc])).join(" ");if($.push(`  yaw ${Dt}`),$.push(`  in  ${j}`),ft.kind==="stickJump"||ft.kind==="stickBad"||ft.kind==="stickLost"){const F=ft.ctx.map(J=>`${J[Hv]},${J[Gv]}`).join(" "),Y=ft.ctx.map(J=>`${J[Xv]},${J[Vv]}`).join(" ");$.push(`  o   ${F}`),$.push(`  p   ${Y}`)}}if(a.length>0){$.push("最近事件：");for(const ft of a.slice(-12))$.push(`  ${ft.t.toFixed(2)} ${ft.k} ${ft.d}`.trimEnd())}const at=o.screenFrames>0?`屏幕 screenX/Y（${o.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",mt=o.screenFrames>0&&o.clientFrames>0?` / client 回退 ${o.clientFrames} 帧`:"";return $.push(`摇杆坐标源 ${at}${mt}`),$.push(`UA ${e.ua}`),$.join(`
`)}return{sample(L,k,B,G=0){o.frames++,k.stickHeld&&(k.stickScreenOk?o.screenFrames++:o.clientFrames++),o.steps+=G,o.wallMs+=B,B>o.dtMax&&(o.dtMax=B),o.fps=o.wallMs>0?o.frames*1e3/o.wallMs:0,o.simS=L.time;const $=L.time;if(c<0&&(c=$),T=$,b=L.tick,!r)return;const at=L.character,mt=Math.hypot(k.stickX,k.stickY),ft=Math.hypot(at.velocity.x,at.velocity.z);f=L.combat.weapon;const Dt=Wv(L,k),j=at.facing,Y=Math.hypot(k.intents.moveX,k.intents.moveZ)>.05?Math.atan2(k.intents.moveX,k.intents.moveZ):null;mt>.2&&(o.stickActiveMs+=B);const J=[Xn($),L.tick,Math.round(B*10)/10,Xn(k.stickX),Xn(k.stickY),Xn(k.stickRawX),Xn(k.stickRawY),k.stickHeld?1:0,k.source.slice(0,8),Xn(k.intents.moveX),Xn(k.intents.moveZ),Xn(at.position.x),Xn(at.position.z),Xn(at.velocity.x),Xn(at.velocity.z),di(j),di(at.bodyYaw),Dt,Xn(at.stride),Y===null?"":di(Y),k.stickId===null?"":k.stickId,Math.round(k.stickOriginX),Math.round(k.stickOriginY),Math.round(k.stickPxX),Math.round(k.stickPxY),k.stickBad,Math.round(k.stickVpTop),Math.round(k.stickOriginSX),Math.round(k.stickOriginSY),Math.round(k.stickScreenX),Math.round(k.stickScreenY),k.stickScreenOk?1:0,Math.round(k.stickScale*100)/100];y(J);const K=$*1e3<x;if(B>t.spikeMs&&!K&&$-c>.6&&(o.spikes++,C("frameSpike",$,L.tick,B,`dt ${B.toFixed(0)}ms fl=${Qa(Dt)}`,J)),d!==null&&!K){const gt=Math.abs(di(Qs(j-d))),Pt=Math.abs(di(Qs(at.moveYaw-u))),D=(h|Dt)&(Yr|$r|Zr|jr)|Dt&vo,A=Y===null?null:Math.abs(di(Qs(j-Y))),q=Y===null||d===null?null:Math.abs(di(Qs(d-Y))),ut=A!==null&&q!==null&&A<q-.5,it=(h&vo)!==0&&(Dt&vo)===0&&Y===null,lt=A!==null&&(A<=12||ut);gt>t.aimDropDeg&&it?C("aimDrop",$,L.tick,0,`${gt.toFixed(0)}° @aim→none stick(${k.stickX.toFixed(2)},${k.stickY.toFixed(2)}) aim(${k.aimDX.toFixed(0)},${k.aimDY.toFixed(0)}) fl=${Qa(Dt)}`,J):gt>t.dirJumpDeg&&D===0&&!it&&(lt?(o.inTurns++,gt>o.inTurnMax&&(o.inTurnMax=gt)):C("dirJump",$,L.tick,0,`${gt.toFixed(0)}° res${A===null?" 无输入":`${A.toFixed(0)}°`} yaw ${di(d)}→${di(j)} in ${Y===null?".":di(Y)}° mvΔ${Pt.toFixed(0)}° aim(${k.aimDX.toFixed(0)},${k.aimDY.toFixed(0)}) fl=${Qa(h)}→${Qa(Dt)}`,J))}const st=(Dt&(Yr|$r|Zr|jr))!==0,Tt=L.tick-_<30;mt>.35&&ft<t.freezeSpeed&&!st&&!Tt?(m<0&&(m=$),$-m>=t.freezeMs/1e3&&$>=v&&(C("moveFreeze",$,L.tick,($-m)*1e3,`stick(${k.stickX.toFixed(2)},${k.stickY.toFixed(2)}) v${ft.toFixed(2)} ${k.source} fl=${Qa(Dt)}`,J),v=$+1.5,m=-1)):m=-1,k.stickHeld?(mt>p&&(p=mt),p>.35&&mt<.06?(g<0&&(g=$),$-g>=t.stickLostMs/1e3&&(C("stickLost",$,L.tick,($-g)*1e3,`raw(${k.stickRawX.toFixed(2)},${k.stickRawY.toFixed(2)}) peak ${p.toFixed(2)} fl=${Qa(Dt)}`,J),g=-1,p=0)):g=-1):(p=0,g=-1);const Wt=k.stickScale>.2&&k.stickScale<5?k.stickScale:1,dt=k.stickScreenOk,X=dt?k.stickScreenX/Wt:k.stickPxX,H=dt?k.stickScreenY/Wt:k.stickPxY,kt=dt?k.stickOriginSX/Wt:k.stickOriginX,Rt=dt?k.stickOriginSY/Wt:k.stickOriginY,_t=X-kt,vt=H-Rt;if(k.stickHeld&&k.stickId!==null){const gt=S;if(gt&&gt.held&&gt.id===k.stickId){const Pt=Math.hypot(gt.dx,gt.dy),D=Math.hypot(_t,vt),A=Math.max(Pt,D),q=Math.hypot(X-gt.cx,H-gt.cy),ut=Math.abs(di(Qs(Math.atan2(vt,_t)-Math.atan2(gt.dy,gt.dx)))),it=A*ut*Math.PI/180,lt=Math.hypot(kt-gt.ox,Rt-gt.oy);if(A>18&&ut>35&&q<Math.max(5,it*.35)&&C("stickJump",$,L.tick,0,`Δ${ut.toFixed(0)}° 手指只动${q.toFixed(0)}px(弧长应${it.toFixed(0)}px) o(${Math.round(gt.ox)},${Math.round(gt.oy)})→(${Math.round(kt)},${Math.round(Rt)}) 原点位移${lt.toFixed(0)}px p(${Math.round(X)},${Math.round(H)}) raw(${Math.round(_t)},${Math.round(vt)}) id${k.stickId} ${dt?"src=屏幕":"src=client"}`,J),dt&&gt.screenOk){const Nt=Math.hypot(k.stickPxX-gt.x,k.stickPxY-gt.y),Ct=Math.hypot((k.stickScreenX-gt.sx)/Wt,(k.stickScreenY-gt.sy)/Wt);w+=Nt-Ct,Math.abs(w)>20&&(C("stickDrift",$,L.tick,0,`client 相对屏幕漂移 ${w>0?"+":""}${w.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(k.stickPxX)},${Math.round(k.stickPxY)}) screen(${Math.round(k.stickScreenX)},${Math.round(k.stickScreenY)})`,J),w=0)}}S={id:k.stickId,ox:kt,oy:Rt,cx:X,cy:H,x:k.stickPxX,y:k.stickPxY,sx:k.stickScreenX,sy:k.stickScreenY,dx:_t,dy:vt,held:!0,screenOk:dt}}else S=null,w=0;if(k.stickBad>E){const gt=k.stickBad-E;C("stickBad",$,L.tick,0,`拦截 ${gt} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${k.stickBad}）o(${Math.round(k.stickOriginX)},${Math.round(k.stickOriginY)}) p(${Math.round(k.stickPxX)},${Math.round(k.stickPxY)}) id${k.stickId??"-"}`,J)}E=k.stickBad,d=j,u=at.moveYaw,h=Dt},event(L,k){const B=Yv(L);R(L),r&&(L.type==="dash-ready"||L.type==="combo-reset"||L.type==="stepUp"||I(L.type,B,k,L.tick))},gesture(L){const k=`${L.button}.${L.kind}`;o.gestures[k]=(o.gestures[k]??0)+1,r&&(L.kind==="longPress"||L.kind==="doubleTap"||L.kind==="drag"||L.kind==="cancel")&&I(`g:${L.kind}`,`${L.button} ${L.heldMs.toFixed(0)}ms d${L.distance.toFixed(0)}px ${L.angleDeg.toFixed(0)}°`,T,b)},suspend(L){x=T*1e3+L,m=-1,g=-1},setEnabled(L){r=L,L||(d=null,S=null,m=-1,g=-1)},clear(){i.length=0,a.length=0,s.length=0,M={},l=-1e9,d=null,h=0,m=-1,g=-1,p=0,o.frames=0,o.wallMs=0,o.dtMax=0,o.spikes=0,o.stickActiveMs=0,o.attacks=0,o.hits=0,o.hurts=0,o.links=0,o.linkHits=0,o.rolls=0,o.blinks=0,o.channels=0,o.bolts=0,o.rings=0,o.bowCharges=0,o.jumps=0,o.resets=0,o.dirJumps=0,o.aimDrops=0,o.inTurns=0,o.inTurnMax=0,o.freezes=0,o.stickLosts=0,o.stickJumps=0,o.stickBads=0,o.stickDrifts=0,o.screenFrames=0,o.clientFrames=0,w=0,S=null,E=0;for(const L of Object.keys(o.gestures))delete o.gestures[L]},status(){const L=o.simS,k=s.some(B=>L-B.t<8&&(B.kind==="dirJump"||B.kind==="aimDrop"||B.kind==="moveFreeze"||B.kind==="stickLost"||B.kind==="stickJump"||B.kind==="stickBad"||B.kind==="stickDrift"));return{durationS:o.wallMs/1e3,frames:o.frames,events:a.length,anomalies:s.length,alert:k,enabled:r}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...o,gestures:{...o.gestures}},columns:Nv,samples:i.slice(),events:a.slice(),anomalies:s.slice()}},summary:U}}const Zv="dash",jv=6,qv="冲刺标尺",Kv="沿刻度跑：翻滚 3.2m / 闪现 5m，看落点差多少",Jv=[2,4],Qv="square",ty=4.8,ey="#bfe8ff",ny="v9s.15 历史固定工位",iy={dx:0,dz:4.6},ay={dx:-2.8,dz:9.2},sy={id:Zv,index:jv,name:qv,hint:Kv,span:Jv,shape:Qv,radius:ty,color:ey,owner:ny,spawn:iy,label:ay},oy="gait",ry=7,cy="侧后方步态",ly="面向假人贴到 1.2m，沿引线按 90 / 135 / 180 走",hy=[2,2],dy="circle",uy=3.2,fy="#6fc9a0",py="v9s.15 历史固定工位",my={dx:0,dz:2.6},gy={dx:0,dz:-2.5},xy=[{dx:0,dz:0,mode:"follow"}],vy={id:oy,index:ry,name:cy,hint:ly,span:hy,shape:dy,radius:uy,color:fy,owner:py,spawn:my,label:gy,dummies:xy},yy="hub",My=1,_y="中央 8 向",by="推杆走 8 个方向 · 松手看停步收相 / 转身踏步",Sy="origin",wy=[2,2],Ey="circle",Ty=3.6,Ay="#8fe7ff",Ry="v9s.15 历史固定工位",Py={dx:0,dz:0},Cy={dx:0,dz:-3.1},Ly={minCellX:-4,maxCellX:4,minCellZ:0,maxCellZ:6,density:1,clearMarginCells:2},Dy=[{id:"crate-hub",dx:2.5,dz:-2.5,width:1.1,depth:1.1,height:.8}],ky=[{dx:-3.4,dz:3.2,fighter:!0,weapon:"sword-shield"},{dx:3.4,dz:3.2,fighter:!0,weapon:"dual-swords"},{dx:0,dz:4.2,fighter:!0,weapon:"greatsword"}],Iy={id:yy,index:My,name:_y,hint:by,pin:Sy,span:wy,shape:Ey,radius:Ty,color:Ay,owner:Ry,spawn:Py,label:Cy,grass:Ly,obstacles:Dy,dummies:ky},zy="meter",Fy=5,Uy="进度弧",Ny="弓长按 = 黄弧 · 法杖技2 = 紫弧 · 冲刺后 = 青弧冷却",Oy=[2,2],By="circle",Hy=3.2,Gy="#b48cff",Xy="v9s.15 历史固定工位",Vy={dx:0,dz:2.8},Wy={dx:0,dz:1.3},Yy=[{id:"pillar-sw",dx:-4,dz:3.6,width:1.2,depth:1.2,height:2.2}],$y=[{dx:0,dz:-1.4,mode:"idle"}],Zy={id:zy,index:Fy,name:Uy,hint:Ny,span:Oy,shape:By,radius:Hy,color:Gy,owner:Xy,spawn:Vy,label:Wy,obstacles:Yy,dummies:$y},jy="rings",qy=2,Ky="环状态色阶",Jy="同距三假人：中立蓝 / 戒备黄 / 敌对红 · 点选看 3/4 环",Qy=[2,2],tM="circle",eM=3.4,nM="#ffc85a",iM="v9s.15 历史固定工位",aM={dx:0,dz:3},sM={dx:0,dz:-2.7},oM=[{dx:-1.6,dz:-.15,mode:"idle"},{dx:0,dz:-.15,mode:"keep-distance"},{dx:1.6,dz:-.15,mode:"attack"}],rM={id:jy,index:qy,name:Ky,hint:Jy,span:Qy,shape:tM,radius:eM,color:nM,owner:iM,spawn:aM,label:sM,dummies:oM},cM="sparring-demo",lM="陪练试验场",hM="动态拼合示范地块 · 点「生成 4 人」就地摆出假人 + 持械陪练，用完点「清除」回基线",dM=[2,2],uM=2,fM="#7fd8c0",pM="v9s.43 动态拼合示范（auto 地块，不写世界坐标，由 assemblePlots 自动分配槽位）",mM={minCellX:-9,maxCellX:9,minCellZ:-9,maxCellZ:9,density:.72},gM={label:"生成 4 人",dummies:2,modes:["idle","keep-distance"],fighters:2,ringRadius:1.5,startDeg:-90},xM={id:cM,name:lM,hint:hM,span:dM,radius:uM,color:fM,owner:pM,grass:mM,testSpawn:gM},vM="terrain",yM=4,MM="地形 / 门洞",_M="宽门 2.4m / 窄门 0.5m · 0.2m 台阶可走，0.6/0.9/1.2m 要跳",bM=[2,2],SM="square",wM=4.8,EM="#7fb8d8",TM="v9s.15 历史固定工位",AM={dx:0,dz:4.6},RM={dx:0,dz:-4.2},PM=[{id:"stair-1",dx:-2.3,dz:1.8,width:2.4,depth:.9,height:.2},{id:"stair-2",dx:-2.3,dz:.9,width:2.4,depth:.9,height:.4},{id:"stair-3",dx:-2.3,dz:0,width:2.4,depth:.9,height:.6},{id:"stair-4",dx:-2.3,dz:-.9,width:2.4,depth:.9,height:.8},{id:"plateau",dx:-2.3,dz:-2.2,width:2.4,depth:1.6,height:.8},{id:"block-060",dx:2.5,dz:1.4,width:1.4,depth:1.4,height:.6},{id:"block-090",dx:2.5,dz:-.5,width:1.4,depth:1.4,height:.9},{id:"block-120",dx:2.5,dz:-2.4,width:1.4,depth:1.4,height:1.2}],CM=[{id:"gate-wide",dx:-2.3,dz:3.1,openingWidth:2.4,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2},{id:"gate-narrow",dx:2.5,dz:3.1,openingWidth:.5,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2}],LM={id:vM,index:yM,name:MM,hint:_M,span:bM,shape:SM,radius:wM,color:EM,owner:TM,spawn:AM,label:RM,steps:PM,doorways:CM},DM="windup",kM=3,IM="起手预警",zM="走进 1.6m：脚下红弧填满 = 命中帧",FM=[2,2],UM="circle",NM=3.2,OM="#ff5a4a",BM="v9s.15 历史固定工位",HM={dx:0,dz:3},GM={dx:0,dz:-2.6},XM=[{dx:0,dz:-.2,mode:"attack"}],VM={id:DM,index:kM,name:IM,hint:zM,span:FM,shape:UM,radius:NM,color:OM,owner:BM,spawn:HM,label:GM,dummies:XM},WM="x-destructibles",YM="可破坏物件 · 斜切断口",$M="站高台打=高处断，平地打=低处断；切口朝挥刀方向斜切 · 瓶罐只断预设带",ZM=[2,2],jM=2,qM="#e8a05c",KM="可破坏物件（auto 地块，只写相对偏移；id 不带版本代号，由合并闸门统一领号；排在 sparring-demo 之后不抢槽位）",JM=[{id:"pole-a",kind:"pole",dx:-1.25,dz:-1,height:2.4,radius:.11,tiltDeg:20,color:"#8a6b4a",cutColor:"#f0d2a0"},{id:"pole-b",kind:"pole",dx:0,dz:-1,height:2.8,radius:.11,tiltDeg:20,color:"#8a6b4a",cutColor:"#f0d2a0"},{id:"pole-c",kind:"pole",dx:1.25,dz:-1,height:2,radius:.11,tiltDeg:20,color:"#8a6b4a",cutColor:"#f0d2a0"},{id:"jar-a",kind:"jar",dx:-.7,dz:-1.8,height:.9,radius:.28,tiltDeg:14,bands:[.35,.62],color:"#6f8fb8",cutColor:"#d8e4f0"},{id:"jar-b",kind:"jar",dx:.7,dz:-1.8,height:.8,radius:.26,tiltDeg:14,bands:[.4,.68],color:"#b87f6f",cutColor:"#f0d8c8"}],QM={id:WM,name:YM,hint:$M,span:ZM,radius:jM,color:qM,owner:KM,destructibles:JM},t_={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,skillDecel:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:0},worldBounds:{minX:-15.5,maxX:15.5,minZ:-15.5,maxZ:15.5},orientation:{bodyTurnRate:7,headTurnRate:12,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},turnInPlace:{enabled:!0,triggerDeg:50,settleDeg:8,durationSec:.45,idleSpeedRatio:.05,inputDeadZone:.12,lookRange:0,armSec:.03,gazeTriggerDeg:120},combat:{comboWindow:.65,settle:.16,attackMoveScale:.3,lungeMoveScale:.08,lungeCurve:1.2,lungeMaxSpeed:17,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3,hitWindow:{start:0,end:.85},comboWindow:.62,notifies:[{at:"windup",u:.7,name:"blade-air",value:.5},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.35,name:"foot-step",value:.6}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,148],[.2,125],[.4,68],[.6,-16],[.8,-78]]},2:{pts:[[0,-77],[.2,-68],[.4,-4],[.6,67],[.8,120]]},3:{stabU:.42}}}},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3,hitWindow:{start:0,end:.9},comboWindow:.5,notifies:[{at:"windup",u:.5,name:"blade-air",value:.45},{at:"active",u:0,name:"blade-air",value:1},{at:"active",u:.6,name:"blade-air",value:.7},{at:"recovery",u:.3,name:"foot-step",value:.5}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,151],[.2,137],[.4,62],[.6,-46],[.8,-128]]},2:{pts:[[0,-3],[.2,7],[.4,57],[.6,105],[.8,135]]},3:{pts:[[0,-150],[.2,-100],[.4,-40],[.6,1],[.8,36]]}}}},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3,hitWindow:{start:0,end:.8},comboWindow:.78,notifies:[{at:"windup",u:.85,name:"blade-air",value:.8},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.45,name:"foot-step",value:1}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,152],[.2,114],[.4,15],[.6,-65],[.8,-120]]},2:{pts:[[0,-124],[.2,-81],[.4,22],[.6,92],[.8,141]]},3:{pts:[[0,90],[.2,39],[.4,8],[.6,4],[.8,7]]}}},groundSlam:{slamU:.6,radius:2.4,knockback:.9,type:"knock",onlyUnhit:!0,holdMul:1.7}},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:.85,minChargeToFire:.15,chargeMoveMultiplier:.55,autoFire:!0,release:{windup:.04,active:.12,recovery:.26,lunge:0},trajectory:{speedMin:9,speedMax:16,launchPitchDeg:3.5,gravity:9,maxLife:2.4,radius:.2,stickMinPitchDeg:50,groundStickLift:.32,stickSec:4,homingRange:14,homingConeDeg:30,turnRateDeg:90,homingTime:.9,aimHeightRatio:.7,verticalTurnRate:18}}},abilities:{arcane:{perWave:3,waves:5,waveInterval:.2,spreadDeg:8,spreadTime:.22,spawnDelay:.035,spawnSideStep:.2,speedJitter:.12,homingRange:8,homingConeDeg:40,turnRateDeg:300,homingTime:1.1,retargetInterval:.25,cooldown:1,speed:10,life:1.4,radius:.3,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.6},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},skills:[{id:"arcane",kind:"channelVolley",slot:"attack",weapon:"staff",paramsRef:"arcane",enabled:!0},{id:"ring",kind:"groundRing",slot:"skill2",weapon:"staff",paramsRef:"ring",enabled:!0}],targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!1,dummyKnockback:.18,hitstop:{light:.045,heavy:.07,knock:.1},hitstopByWeapon:{"sword-shield":1,"dual-swords":.85,greatsword:1.3,staff:1.1,bow:.9},hitstopWarp:{enabled:!0,holdRate:.05,release:.055,payback:1.5,paybackBudget:.6},hitstopComboFalloff:[1,.85,.72]},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5,spar:1.2},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},gaze:{enabled:!0,headLookLimitDeg:55,headGazeRange:7,threatRange:8,recoveryDist:3.5,maxThreats:3,bodyTurnRate:3.2,headTurnRate:8,maxHeadSpeedDeg:300,maxBodySpeedDeg:130,headReturnRate:3.5,headReturnSpeedDeg:120,aimHeightRatio:.75,eyeHeightRatio:.78,headPitchRate:7,maxHeadPitchDeg:28,bodyPitchScale:.3,bodyPitchRate:4,enterThreshold:.05,reactToAttack:!0,reactToApproach:!0,approachDist:2.5,hurtHoldSec:2,hostileModeWeight:.6,spreadFalloff:1.5,behindFalloff:.35,behindAngleDeg:100,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5,spar:1.2},attackBoost:.6,nearDistance:1.5,saturation:2.6},dummies:{count:0,spawn:[],initialModes:["idle","keep-distance","attack","attack","follow","idle"],leashRadius:2.4,radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,strafePeriod:5.2,strafeDuty:.34,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4,fighters:{weapons:["sword-shield","dual-swords","greatsword"],spawn:[],initialModes:["spar","spar","spar"],moveSpeed:2.1,attackInterval:3.4,attackRangeScale:.9,knockbackScale:.6,leashRadius:7,comboCount:0,comboGap:0}},grass:{enabled:!0,footprintCells:2,minHeightCells:1,maxHeightCells:2,bendRadius:.85,maxBendRad:.95,bendRate:18,recoverRate:3.2,stumpRatio:.34,regrow:!0,regrowSec:6,bucketCells:4,wind:{enabled:!0,dirDeg:28,speed:1.35,amplitude:.19,wavelength:4.2,secondWave:{wavelength:1.7,amplitude:.055,speedScale:1.55},gust:{periodSec:7.5,depth:.35},jitter:.16,shadeAmount:.26}}},e_={ground:{size:32,thickness:.4},steps:[],doorways:[],obstacles:[],grid:{cellSize:.5,minX:-16,maxX:16,minZ:-16,maxZ:16},grass:{minCellX:0,maxCellX:0,minCellZ:0,maxCellZ:0,density:.72,bladesPerPatch:[3,6],avoidMargin:.45,seed:20261108}},n_={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:28,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.42},bodyTypes:{standard:{name:"标准",height:1.2,radius:.3},tall:{name:"瘦高",height:1.32,radius:.26,voxel:{headSize:.36,bodyWidth:.34,bodyHeight:.28,limbThickness:.1,legLength:.68,armLength:.5},colors:{body:"#58b39a",head:"#ffe0b2",limb:"#3f8f7c",shoe:"#24443c"}}},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.6,chestYawMaxDeg:40,stopYawBlendMode:"inStop",stopYawAfterSec:.3,turnStepEnabled:!0,turnStepPitch:.5,turnStepKnee:.35,turnStepDip:.02,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1,backStrafeStartDeg:100,backStrafeFullDeg:132,dirFlipSec:.16,hipYawTrackRateDeg:240,hipYawBackRateDeg:150},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14,moveTakeover:{speed:.35,full:1.2,windup:.55,recovery:1,settle:1}},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13},stretch:{enabled:!0,swingArm:1.45,chargeArm:.88,runLeg:1,torsoGain:.5,impactSquash:.2,impactDecay:11,volumeExp:.5,smoothing:30},swing:{enabled:!0,bodyScale:1,shoulderLift:.055,shoulderPush:.045,shoulderIn:.032,segBlend:.1,segBlendMin:.03,segBlendRef:6,segBlendMax:.14,weaponScale:{greatsword:1,"sword-shield":.78,"dual-swords":.9},combo:{greatsword:["gs.right-left","gs.left-right","gs.overhead"],"sword-shield":["gs.right-left","gs.left-right","ss.shield-bash"],"dual-swords":["ds.right-left","ds.left-right","ds.spin"]},clips:{"gs.right-left":{kind:"right-left",note:"段 1：从右后方扫到左后方。rootYaw 整体带转 ±0.55 rad（≈31°）叠在腰椎 ±60° 上，大剑刃尖水平扫角约 210°",keys:[{t:0,ease:"in",pose:{bodyYaw:1.05,bodyPitch:-.14,bodyRoll:-.18,pelvisX:.06,pelvisZ:-.07,armPitch:-1.15,armYaw:.4,armRoll:.2,elbow:-.5,rootYaw:.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.08,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:0,armRoll:.04,elbow:-.3,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.15,bodyPitch:.16,bodyRoll:.2,pelvisX:-.07,pelvisZ:.11,armPitch:-1.5,armYaw:-.4,armRoll:-.14,elbow:-.12,rootYaw:-.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:-1.55}}]},"gs.left-right":{kind:"left-right",note:"段 2：承接段 1 左后方收势，整体带转 −0.55→+0.55 rad 反向拧回右后方，剑身仍水平",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-.4,armRoll:-.16,elbow:-.5,rootYaw:-.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:0,armRoll:.02,elbow:-.32,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:.4,armRoll:.16,elbow:-.12,rootYaw:.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:1.55}}]},"gs.overhead":{kind:"overhead",note:"段 3：举过头顶（剑身 75° 朝上）向前下劈到 −31°，躯干后仰 → 前压",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.32,bodyRoll:-.05,pelvisX:0,pelvisZ:-.07,armPitch:-1.9,armYaw:-.3,armRoll:.16,elbow:-.55,bladePitch:1.62,bladeTwist:0}},{t:.55,pose:{bodyYaw:.06,bodyPitch:.1,bodyRoll:0,pelvisX:0,pelvisZ:.03,armPitch:-1.1,armYaw:-.26,armRoll:.08,elbow:-.3,bladePitch:.55,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.55,bodyRoll:.02,pelvisX:0,pelvisZ:.13,armPitch:-.15,armYaw:-.2,armRoll:0,elbow:-.1,bladePitch:-.75,bladeTwist:0}}]},"ds.right-left":{kind:"right-left",note:"双持段 1：右手横扫到左后方，左手同时向左后方收（后摆 + 屈肘），两把剑都保持水平",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:1,bodyPitch:-.12,bodyRoll:-.16,pelvisX:.05,pelvisZ:-.06,armPitch:-1.15,armYaw:.9,armRoll:.18,elbow:-.45,armLPitch:.5,armLYaw:-1,armLRoll:.12,elbowL:-1.15,rootYaw:.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.06,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:-.1,armRoll:.04,elbow:-.3,armLPitch:.6,armLYaw:-1,armLRoll:.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.1,bodyPitch:.14,bodyRoll:.18,pelvisX:-.06,pelvisZ:.1,armPitch:-1.5,armYaw:-1.4,armRoll:-.12,elbow:-.12,armLPitch:.65,armLYaw:-.9,armLRoll:.18,elbowL:-1.3,rootYaw:-.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.55}}]},"ds.left-right":{kind:"left-right",note:"双持段 2：左手横扫回右后方，右手同时向右后方收（段 1 的镜像，主挥换到左手）",lead:"L",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-1.4,armRoll:-.16,elbow:-.5,armLPitch:.5,armLYaw:1,armLRoll:-.12,elbowL:-1.15,rootYaw:-.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:-.1,armRoll:.02,elbow:-.32,armLPitch:.6,armLYaw:.9,armLRoll:-.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:1.4,armRoll:.16,elbow:-.12,armLPitch:.65,armLYaw:.8,armLRoll:-.18,elbowL:-1.3,rootYaw:.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:1.55}}]},"ds.spin":{kind:"spin",note:"双持段 3：双剑水平展开（主副手 roll 外张到 ±1.15），整个人原地转一整圈。spin 按 attackProgress 单调推进到 2π≡0，收招自动回正",lead:"R",spin:{turns:1,ease:"inOut",span:.6},keys:[{t:0,ease:"in",pose:{bodyYaw:.1,bodyPitch:-.14,bodyRoll:0,pelvisX:0,pelvisZ:-.05,armPitch:-1.1,armYaw:1.7,armRoll:.3,elbow:-.5,armLPitch:-1.1,armLYaw:0,armLRoll:-.3,elbowL:-.5,bladePitch:.05,bladePitchOff:.05,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:.5,pose:{bodyYaw:0,bodyPitch:.04,bodyRoll:0,pelvisX:0,pelvisZ:.04,armPitch:-1.55,armYaw:2.1,armRoll:.45,elbow:-.05,armLPitch:-1.55,armLYaw:.3,armLRoll:-.45,elbowL:-.05,bladePitch:0,bladePitchOff:0,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:1,pose:{bodyYaw:-.1,bodyPitch:.12,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:-1.3,armYaw:1.9,armRoll:.4,elbow:-.25,armLPitch:-1.3,armLYaw:-.05,armLRoll:-.4,elbowL:-.25,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.35,bladeTwistOff:1.35}}]},"ss.shield-bash":{kind:"bash",note:"剑盾段 3：收盾蓄力 → 左臂持盾猛前顶（臂前伸 + 肘伸直 + 身体前压 + 骨盆前冲）。bladePitchOff 反解让盾面始终正对前方",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.28,bodyRoll:-.04,pelvisX:.01,pelvisZ:-.08,armPitch:.1,armYaw:-.2,armRoll:.1,elbow:-.7,armLPitch:-.7,armLYaw:.1,armLRoll:.15,elbowL:-.9,bladePitch:.2,bladePitchOff:.1,bladeTwist:0}},{t:.55,pose:{bodyYaw:.04,bodyPitch:.15,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:.2,armYaw:-.15,armRoll:.05,elbow:-.6,armLPitch:-1.1,armLYaw:.05,armLRoll:.1,elbowL:-.45,bladePitch:.1,bladePitchOff:.02,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.5,bodyRoll:.02,pelvisX:0,pelvisZ:.18,armPitch:.25,armYaw:-.1,armRoll:0,elbow:-.5,armLPitch:-1.55,armLYaw:0,armLRoll:.05,elbowL:-.05,bladePitch:.05,bladePitchOff:0,bladeTwist:0}}]}},poseIn:.1,poseOut:.16},stance:{"sword-shield":{armSwing:.85,armR:{pitch:-.12,roll:.1,elbow:-.15},armL:{pitch:-.45,roll:.1,elbow:-.75},torsoYaw:.12,bladePitchDeg:-8,blend:.22},"dual-swords":{armSwing:1,armR:{pitch:-.15,roll:.16,elbow:-.45},armL:{pitch:-.15,roll:-.16,elbow:-.45},torsoYaw:0,bladePitchDeg:-12,bladePitchOffDeg:-8,blend:.22},greatsword:{armSwing:.45,armR:{pitch:-.3,roll:.05,elbow:-.55},armL:{pitch:-.2,roll:-.1,elbow:-.65},torsoPitch:.04,bladePitchDeg:-30,blend:.26},staff:{armSwing:.6,armR:{pitch:-.1,roll:.06,elbow:-.35},armL:{pitch:.02,roll:-.08,elbow:-.15},torsoYaw:.06,blend:.22},bow:{armSwing:.55,armL:{pitch:-.15,roll:-.1,elbow:-.2},armR:{pitch:.02,elbow:-.25},torsoYaw:-.08,blend:.22}},spine:{enabled:!0,waist:.58,chest:.42,neck:.16,chestPivot:.42}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6,twoHandInsetX:.15,twoHandGripY:-.1,twoHandMaxStretch:1.3,twoHandMinGrip:.62,twoHandGripStart:1.02,twoHandSlideRate:9,swordCantDeg:10,greatswordCantDeg:0},weaponWrist:{enabled:!0,lag:.042,maxAngle:.72,rate:24,twistLag:.03,maxTwist:.5,runDrag:.11},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},groundRing:{playerRadiusFactor:2.3,dummyRadiusFactor:2.05,thicknessFactor:.16,arcDeg:180,selectedArcDeg:270,opacity:.22,playerOpacity:.44,selectedOpacity:.62,selectedScale:1.06,selectedThicknessScale:1.6,edgeFade:.2,playerColor:"#8fe7ff",neutralColor:"#7fb8d8",lowThreatColor:"#ffc85a",highThreatColor:"#ff3b30",haloRadiusFactor:1.16,haloThicknessFactor:2.6,haloOpacity:.14,haloFadeInSec:.05,haloFadeOutSec:.36,meterRadiusFactor:1.34,meterThicknessFactor:.52,meterOpacity:.9,meterColorCharge:"#ffd166",meterColorChannel:"#b48cff",meterColorCooldown:"#7fb8d8",warnRadiusFactor:1.14,warnThicknessFactor:1.5,warnOpacity:.9,warnColor:"#ff5a4a",areaOpacity:.5,landingOpacity:.55,areaExpandSec:.22},projectiles:{arrowColor:"#ffe3a6",arrowHeadColor:"#fff6d8",arrowTrailColor:"#ffcf86",arrowLength:.72,arrowWidth:.062,arrowHeadSize:.16,arrowGlowSize:.5,trailLength:1.05,trailOpacity:.42,boltColor:"#a9ecff",boltGlowColor:"#7fe3ff",boltShapeX:.42,boltShapeY:.42,boltShapeZ:.85,boltGlowScale:1.6,boltTrailScale:2.2,slashEnabled:!1,slashThickness:.075,slashGlowOpacity:.34},weaponTrail:{enabled:!0,maxSamples:30,minStep:.015,life:.11,minSpeed:5.5,color:"#8fd0ff",intensity:.42,tipBoost:.35,pulseDecay:14},hitstop:{enabled:!0,duration:.07},lab:{enabled:!0,showLabels:!0,padOpacity:.55,labelTextHeight:.82},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],attackArcColor:"#ff6b5e",fighterColors:[{body:"#c85a4a",limb:"#8d3a30",head:"#f0c9a0"},{body:"#c9a03c",limb:"#8a6b22",head:"#f0d6a0"},{body:"#7d6ec4",limb:"#4f4488",head:"#e6d2b0"}]},balance:{enabled:!0,reactionTime:.18,gravity:9.81,autoCounter:!0,maxShift:.045,counterRate:8,predLead:.12,counterBoost:1.6},renderInterp:{enabled:!0,yawSmoothMs:35},groundSlam:{enabled:!0,color:"#e8d8b0",duration:.42,delay:.09,outerScale:1.25,shake:.95},grass:{enabled:!0,bladeWidth:.13,segmentHeight:.5,palette:["#3f7d4f","#569a5c","#6fb56a","#8ccb78","#a9dc86"],stumpColor:"#6b7a48",maxInstances:6e3,debris:{max:220,life:.85,color:"#a9dc86"}}},i_={core:t_,scene:e_,view:n_};function Zh(n){return JSON.parse(JSON.stringify(n))}const jh=i_,a_=Object.assign({"../config/plots/dash.json":sy,"../config/plots/gait.json":vy,"../config/plots/hub.json":Iy,"../config/plots/meter.json":Zy,"../config/plots/rings.json":rM,"../config/plots/sparring-demo.json":xM,"../config/plots/terrain.json":LM,"../config/plots/windup.json":VM,"../config/plots/x-destructibles.json":QM}),s_=Object.values(a_).filter(n=>n&&typeof n.id=="string"&&n.id.length>0),em=Gh,Gi=Og(s_,em),_u=Gi.plots,nm=Zh(jh.core),Lr=Zh(jh.scene),vn=Zh(jh.view);Bg(nm,Lr,Gi,em);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class Ai{constructor(t,e,i,a,s="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(s),this.domElement.classList.add("controller"),this.domElement.classList.add(a),this.$name=document.createElement("div"),this.$name.classList.add("name"),Ai.nextNameID=Ai.nextNameID||0,this.$name.id=`lil-gui-name-${++Ai.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class o_ extends Ai{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function Vl(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const r_={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:Vl,toHexString:Vl},Co={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},c_={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=Co.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return Co.toHexString(a)}},l_={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=Co.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return Co.toHexString(a)}},h_=[r_,Co,c_,l_];function d_(n){return h_.find(t=>t.match(n))}class u_ extends Ai{constructor(t,e,i,a){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=d_(this.initialValue),this._rgbScale=a,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const s=Vl(this.$text.value);s&&this._setValueFromHexString(s)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class Hc extends Ai{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",a=>{a.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class f_ extends Ai{constructor(t,e,i,a,s,o){super(t,e,i,"number"),this._initInput(),this.min(a),this.max(s);const r=o!==void 0;this.step(r?o:this._getImplicitStep(),r),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let _=parseFloat(this.$input.value);isNaN(_)||(this._stepExplicit&&(_=this._snap(_)),this.setValue(this._clamp(_)))},i=_=>{const x=parseFloat(this.$input.value);isNaN(x)||(this._snapClampSetValue(x+_),this.$input.value=this.getValue())},a=_=>{_.key==="Enter"&&this.$input.blur(),_.code==="ArrowUp"&&(_.preventDefault(),i(this._step*this._arrowKeyMultiplier(_))),_.code==="ArrowDown"&&(_.preventDefault(),i(this._step*this._arrowKeyMultiplier(_)*-1))},s=_=>{this._inputFocused&&(_.preventDefault(),i(this._step*this._normalizeMouseWheel(_)))};let o=!1,r,c,l,d,u;const h=5,f=_=>{r=_.clientX,c=l=_.clientY,o=!0,d=this.getValue(),u=0,window.addEventListener("mousemove",m),window.addEventListener("mouseup",v)},m=_=>{if(o){const x=_.clientX-r,M=_.clientY-c;Math.abs(M)>h?(_.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(x)>h&&v()}if(!o){const x=_.clientY-l;u-=x*this._step*this._arrowKeyMultiplier(_),d+u>this._max?u=this._max-d:d+u<this._min&&(u=this._min-d),this._snapClampSetValue(d+u)}l=_.clientY},v=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",m),window.removeEventListener("mouseup",v)},g=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",a),this.$input.addEventListener("wheel",s,{passive:!1}),this.$input.addEventListener("mousedown",f),this.$input.addEventListener("focus",g),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,_,x,M,S)=>(p-_)/(x-_)*(S-M)+M,e=p=>{const _=this.$slider.getBoundingClientRect();let x=t(p,_.left,_.right,this._min,this._max);this._snapClampSetValue(x)},i=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",a),window.addEventListener("mouseup",s)},a=p=>{e(p.clientX)},s=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",a),window.removeEventListener("mouseup",s)};let o=!1,r,c;const l=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),o=!1},d=p=>{p.touches.length>1||(this._hasScrollBar?(r=p.touches[0].clientX,c=p.touches[0].clientY,o=!0):l(p),window.addEventListener("touchmove",u,{passive:!1}),window.addEventListener("touchend",h))},u=p=>{if(o){const _=p.touches[0].clientX-r,x=p.touches[0].clientY-c;Math.abs(_)>Math.abs(x)?l(p):(window.removeEventListener("touchmove",u),window.removeEventListener("touchend",h))}else p.preventDefault(),e(p.touches[0].clientX)},h=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",u),window.removeEventListener("touchend",h)},f=this._callOnFinishChange.bind(this),m=400;let v;const g=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const x=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+x),this.$input.value=this.getValue(),clearTimeout(v),v=setTimeout(f,m)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",d,{passive:!1}),this.$slider.addEventListener("wheel",g,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class p_ extends Ai{constructor(t,e,i,a){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(a)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class m_ extends Ai{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",a=>{a.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const g_=`.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
  background: var(--background-color);
}
.lil-gui.root > .title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.root > .children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.root > .children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.root > .children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.allow-touch-styles, .lil-gui.allow-touch-styles .lil-gui {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.force-touch-styles, .lil-gui.force-touch-styles .lil-gui {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-gui .controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-gui .controller.disabled {
  opacity: 0.5;
}
.lil-gui .controller.disabled, .lil-gui .controller.disabled * {
  pointer-events: none !important;
}
.lil-gui .controller > .name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-gui .controller .widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-gui .controller.string input {
  color: var(--string-color);
}
.lil-gui .controller.boolean {
  cursor: pointer;
}
.lil-gui .controller.color .display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-gui .controller.color .display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-gui .controller.color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-gui .controller.color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-gui .controller.option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-gui .controller.option .display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-gui .controller.option .display.focus {
    background: var(--focus-color);
  }
}
.lil-gui .controller.option .display.active {
  background: var(--focus-color);
}
.lil-gui .controller.option .display:after {
  font-family: "lil-gui";
  content: "↕";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-gui .controller.option .widget,
.lil-gui .controller.option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-gui .controller.option .widget:hover .display {
    background: var(--hover-color);
  }
}
.lil-gui .controller.number input {
  color: var(--number-color);
}
.lil-gui .controller.number.hasSlider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-gui .controller.number .slider {
  width: 100%;
  height: var(--widget-height);
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-gui .controller.number .slider:hover {
    background: var(--hover-color);
  }
}
.lil-gui .controller.number .slider.active {
  background: var(--focus-color);
}
.lil-gui .controller.number .slider.active .fill {
  opacity: 0.95;
}
.lil-gui .controller.number .fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-gui-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-gui-dragging * {
  cursor: ew-resize !important;
}

.lil-gui-dragging.lil-gui-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .title {
  height: var(--title-height);
  line-height: calc(var(--title-height) - 4px);
  font-weight: 600;
  padding: 0 var(--padding);
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  outline: none;
  text-decoration-skip: objects;
}
.lil-gui .title:before {
  font-family: "lil-gui";
  content: "▾";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-gui-dragging) .lil-gui .title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.root > .title:focus {
  text-decoration: none !important;
}
.lil-gui.closed > .title:before {
  content: "▸";
}
.lil-gui.closed > .children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.closed:not(.transition) > .children {
  display: none;
}
.lil-gui.transition > .children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.root > .children > .lil-gui > .title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.root > .children > .lil-gui.closed > .title {
  border-bottom-color: transparent;
}
.lil-gui + .controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .controller {
  border: none;
}

.lil-gui label, .lil-gui input, .lil-gui button {
  -webkit-tap-highlight-color: transparent;
}
.lil-gui input {
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
  -moz-appearance: textfield;
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input[type=checkbox] {
  appearance: none;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "✓";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  border: none;
}
@media (hover: hover) {
  .lil-gui button:hover {
    background: var(--hover-color);
  }
  .lil-gui button:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAUsAAsAAAAACJwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAAH4AAADAImwmYE9TLzIAAAGIAAAAPwAAAGBKqH5SY21hcAAAAcgAAAD0AAACrukyyJBnbHlmAAACvAAAAF8AAACEIZpWH2hlYWQAAAMcAAAAJwAAADZfcj2zaGhlYQAAA0QAAAAYAAAAJAC5AHhobXR4AAADXAAAABAAAABMAZAAAGxvY2EAAANsAAAAFAAAACgCEgIybWF4cAAAA4AAAAAeAAAAIAEfABJuYW1lAAADoAAAASIAAAIK9SUU/XBvc3QAAATEAAAAZgAAAJCTcMc2eJxVjbEOgjAURU+hFRBK1dGRL+ALnAiToyMLEzFpnPz/eAshwSa97517c/MwwJmeB9kwPl+0cf5+uGPZXsqPu4nvZabcSZldZ6kfyWnomFY/eScKqZNWupKJO6kXN3K9uCVoL7iInPr1X5baXs3tjuMqCtzEuagm/AAlzQgPAAB4nGNgYRBlnMDAysDAYM/gBiT5oLQBAwuDJAMDEwMrMwNWEJDmmsJwgCFeXZghBcjlZMgFCzOiKOIFAB71Bb8AeJy1kjFuwkAQRZ+DwRAwBtNQRUGKQ8OdKCAWUhAgKLhIuAsVSpWz5Bbkj3dEgYiUIszqWdpZe+Z7/wB1oCYmIoboiwiLT2WjKl/jscrHfGg/pKdMkyklC5Zs2LEfHYpjcRoPzme9MWWmk3dWbK9ObkWkikOetJ554fWyoEsmdSlt+uR0pCJR34b6t/TVg1SY3sYvdf8vuiKrpyaDXDISiegp17p7579Gp3p++y7HPAiY9pmTibljrr85qSidtlg4+l25GLCaS8e6rRxNBmsnERunKbaOObRz7N72ju5vdAjYpBXHgJylOAVsMseDAPEP8LYoUHicY2BiAAEfhiAGJgZWBgZ7RnFRdnVJELCQlBSRlATJMoLV2DK4glSYs6ubq5vbKrJLSbGrgEmovDuDJVhe3VzcXFwNLCOILB/C4IuQ1xTn5FPilBTj5FPmBAB4WwoqAHicY2BkYGAA4sk1sR/j+W2+MnAzpDBgAyEMQUCSg4EJxAEAwUgFHgB4nGNgZGBgSGFggJMhDIwMqEAYAByHATJ4nGNgAIIUNEwmAABl3AGReJxjYAACIQYlBiMGJ3wQAEcQBEV4nGNgZGBgEGZgY2BiAAEQyQWEDAz/wXwGAAsPATIAAHicXdBNSsNAHAXwl35iA0UQXYnMShfS9GPZA7T7LgIu03SSpkwzYTIt1BN4Ak/gKTyAeCxfw39jZkjymzcvAwmAW/wgwHUEGDb36+jQQ3GXGot79L24jxCP4gHzF/EIr4jEIe7wxhOC3g2TMYy4Q7+Lu/SHuEd/ivt4wJd4wPxbPEKMX3GI5+DJFGaSn4qNzk8mcbKSR6xdXdhSzaOZJGtdapd4vVPbi6rP+cL7TGXOHtXKll4bY1Xl7EGnPtp7Xy2n00zyKLVHfkHBa4IcJ2oD3cgggWvt/V/FbDrUlEUJhTn/0azVWbNTNr0Ens8de1tceK9xZmfB1CPjOmPH4kitmvOubcNpmVTN3oFJyjzCvnmrwhJTzqzVj9jiSX911FjeAAB4nG3HMRKCMBBA0f0giiKi4DU8k0V2GWbIZDOh4PoWWvq6J5V8If9NVNQcaDhyouXMhY4rPTcG7jwYmXhKq8Wz+p762aNaeYXom2n3m2dLTVgsrCgFJ7OTmIkYbwIbC6vIB7WmFfAAAA==") format("woff");
}`;function x_(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let bu=!1;class qr{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:a,title:s="Controls",closeFolders:o=!1,injectStyles:r=!0,touchStyles:c=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",l=>{(l.code==="Enter"||l.code==="Space")&&(l.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(s),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),c&&this.domElement.classList.add("allow-touch-styles"),!bu&&r&&(x_(g_),bu=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),a&&this.domElement.style.setProperty("--width",a+"px"),this._closeFolders=o}add(t,e,i,a,s){if(Object(i)===i)return new p_(this,t,e,i);const o=t[e];switch(typeof o){case"number":return new f_(this,t,e,i,a,s);case"boolean":return new o_(this,t,e);case"string":return new m_(this,t,e);case"function":return new Hc(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,i=1){return new u_(this,t,e,i)}addFolder(t){const e=new qr({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof Hc||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof Hc)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=s=>{s.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const a=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=a+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function v_(n,t,e,i){const a=document.getElementById("debug-panel"),s=a?new qr({title:"实验台 · 调试面板",autoPlace:!1,container:a}):new qr({title:"实验台 · 调试面板"}),o=n.config,r=[],c=[],l=wt=>{const $t=s.addFolder(wt);return c.push($t),$t},d=(wt,$t)=>{const yt=wt.addFolder($t);return r.push(yt),yt},u=l("模拟 / 显示");u.add(e,"timeScale",0,3,.05).name("时间缩放"),u.add(e,"paused").name("暂停"),u.add({step:i.singleStep},"step").name("单步 (1 tick)"),u.add({reset:i.reset},"reset").name("复位全部"),u.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),u.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid),u.add(e,"showLab").name("工位地面盘").onChange(i.onToggleLab),u.add(e,"showLabLabels").name("工位标牌").onChange(i.onToggleLabLabels);const h=d(u,"模块开关");h.add(n.modules,"movement").name("movement"),h.add(n.modules,"combat").name("combat"),h.add(n.modules,"links").name("links"),h.add(n.modules,"orientation").name("orientation"),h.add(n.modules,"turnInPlace").name("turnInPlace"),h.add(n.modules,"targeting").name("targeting"),h.add(n.modules,"hits").name("hits"),h.add(n.modules,"separation").name("separation"),h.add(n.modules,"dash").name("dash"),h.add(n.modules,"camera").name("camera"),h.add(n.modules,"dummies").name("dummies"),h.add(n.modules,"abilities").name("abilities");const f=l("移动 / 输入"),m=d(f,"基础移动参数");m.add(o,"moveSpeed",1,10,.1).name("移动速度"),m.add(o,"sprintMultiplier",1,3,.05).name("冲刺倍率"),m.add(o,"acceleration",1,40,.5).name("加速度"),m.add(o,"friction",1,40,.5).name("摩擦"),m.add(o,"skillDecel",2,40,.5).name("进入技能时的减速速率"),m.add(o,"gravity",5,60,.5).name("重力"),m.add(o,"jumpSpeed",2,16,.2).name("起跳速度"),m.add(o,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),m.add(o,"characterRadius",.1,.8,.01).name("角色半径"),m.add(o,"characterHeight",.6,2.2,.05).name("角色身高"),m.add(o,"strideLength",.3,3,.05).name("基础步幅"),m.add(o,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),m.add(o,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const v=d(f,"摇杆 / 输入");v.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),v.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const g=o.dash,p=d(f,"冲刺 / 闪避");p.add(g,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),p.add(g,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),p.add(g,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),p.add(g,"blinkDistance",1,12,.25).name("闪现距离 (m)"),p.add(g,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),p.add(g,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),p.add(g,"blinkClearVelocity").name("闪现清空速度"),p.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),p.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const _=o.separation,x=d(f,"角色间分离 / 挤压阻力");x.add(_,"iterations",1,8,1).name("迭代次数"),x.add(_,"slop",0,.05,.002).name("额外分离量 (m)"),x.add(_.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),x.add(_.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),x.add(_.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const M=l("动作 / 步态"),S=d(M,"程序化步态");S.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),S.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),S.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),S.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),S.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),S.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),S.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),S.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),S.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),S.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),S.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),S.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),S.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),S.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)"),S.add(t.gait,"backStrafeStartDeg",20,170,1).name("侧后方起步角 (°)"),S.add(t.gait,"backStrafeFullDeg",40,180,1).name("完全后退角 (°)"),S.add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)"),S.add(t.gait,"dirFlipSec",0,.4,.01).name("换向融合时长 (s)"),S.add(t.gait,"hipYawTrackRateDeg",0,600,10).name("下盘目标转速上限 (°/s)"),S.add(t.gait,"hipYawBackRateDeg",0,600,10).name("└ 后退相位上限 (°/s)");const w=d(M,"停步 / 收相 / 惯性");w.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),w.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),w.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),w.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),w.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),w.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),w.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),w.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),w.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),w.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),w.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),w.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const E=d(M,"足部 IK"),T=t.ik;E.add(T,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),E.add(T,"weight",0,1,.01).name("钉地权重"),E.add(T,"attackScale",0,1,.01).name("攻击时权重倍率"),E.add(T,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const b=d(M,"惯性倾斜 / 盆骨"),y=t.lean;b.add(y,"accelGain",0,.1,.002).name("前后加速度增益"),b.add(y,"turnGain",0,.2,.005).name("绕圈侧倾增益"),b.add(y,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),b.add(y,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),b.add(y,"smoothing",1,30,1).name("倾斜平滑速率"),b.add(y,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),b.add(y,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),b.add(y,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),b.add(y,"crouchSmoothing",1,30,1).name("下沉平滑速率");const C=o.orientation,I=d(M,"朝向 / 接敌注视 / 原地转身");I.add(C,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),I.add(C,"headTurnRate",.5,40,.5).name("头部转向速率"),I.add(C,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),I.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),I.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),I.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const R=o.gaze;I.add(R,"headReturnRate",.5,12,.1).name("无目标回正速率 (1/s)"),I.add(R,"headReturnSpeedDeg",20,400,10).name("回正角速度上限 (°/s)"),I.add(R,"bodyTurnRate",.2,12,.1).name("接敌身体转向速率"),I.add(R,"headTurnRate",.5,30,.5).name("接敌头部转向速率"),I.add(R,"maxHeadSpeedDeg",30,900,10).name("头部最大角速度 (°/s)"),I.add(R,"maxBodySpeedDeg",20,600,10).name("身体最大角速度 (°/s)"),I.add(R,"aimHeightRatio",.2,1,.05).name("注视点高度（身高比例）"),I.add(R,"headPitchRate",.5,20,.5).name("头部俯仰速率"),I.add(R,"maxHeadPitchDeg",0,60,1).name("头部俯仰限幅 (°)"),I.add(R,"bodyPitchScale",0,1,.05).name("身体俯仰比例"),I.add(R,"bodyPitchRate",.5,20,.5).name("身体俯仰速率");const U=o.turnInPlace;I.add(U,"enabled").name("启用原地转身 (关=纯插值)"),I.add(U,"triggerDeg",20,180,5).name("触发夹角 (°)"),I.add(U,"gazeTriggerDeg",20,180,5).name("接敌时触发夹角 (°)"),I.add(U,"settleDeg",0,60,1).name("转身保留余角 (°)"),I.add(U,"durationSec",.1,1.5,.02).name("转身时长 (s)"),I.add(U,"idleSpeedRatio",0,.3,.01).name("静止速度比上限"),I.add(U,"inputDeadZone",0,.5,.01).name("起步输入死区"),I.add(U,"armSec",0,.5,.01).name("触发防抖 (s)"),I.add(t.gait,"stopYawBlendMode",["inStop","afterStop"]).name("停步偏差消化窗口"),I.add(t.gait,"stopYawAfterSec",.05,1,.02).name("收相后消化时长 (s)"),I.add(t.gait,"turnStepEnabled").name("转身踏步 (关=滑过去)"),I.add(t.gait,"turnStepPitch",0,1.2,.02).name("踏步前迈 (rad)"),I.add(t.gait,"turnStepKnee",0,1,.02).name("踏步抬膝 (rad)"),I.add(t.gait,"turnStepDip",0,.1,.002).name("踏步重心下沉 (m)");const L=l("战斗 / 命中"),k=o.combat,B=d(L,"连击 / 武器时序"),G=B.add(n.combat,"weapon",fa).name("当前武器");B.add(k,"comboWindow",.1,2,.05).name("连击窗口 (s)"),B.add(k,"settle",0,.8,.01).name("段间停顿 (s)"),B.add(k,"attackMoveScale",0,1,.01).name("攻击时移动比例"),B.add(k,"lungeMoveScale",0,.4,.01).name("跨步时移动比例"),B.add(k,"lungeCurve",.2,4,.1).name("跨步曲线指数 (大=更冲)"),B.add(k,"lungeMaxSpeed",4,30,.5).name("跨步速度上限 (m/s)"),B.add(k,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),B.add(k,"cancelWindow",0,1,.01).name("取消窗口 (s)"),B.add(k,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),B.add(k,"autoCombo").name("按住自动连击"),B.add(k.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),B.add(k.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),B.add(k.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),B.add(k.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率"),B.add(k.bow,"maxChargeTime",.2,2,.05).name("满蓄力时间 (s)"),B.add(k.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),B.add(k.bow,"autoFire").name("蓄满自动放箭 (按住连射)"),B.add(k.bow.trajectory,"gravity",0,24,.5).name("箭矢重力 (m/s²)"),B.add(k.bow.trajectory,"speedMax",8,32,.5).name("满蓄初速 (m/s)"),B.add(k.bow.trajectory,"homingRange",0,30,1).name("自动瞄准距离 (m)"),B.add(k.bow.trajectory,"turnRateDeg",0,240,5).name("箭追踪转向 (°/s)"),B.add(k.bow.trajectory,"homingTime",0,2,.05).name("追踪时长 (s)"),B.add(k.bow.trajectory,"aimHeightRatio",0,1,.05).name("瞄准点高度");const $=o.abilities;B.add($.arcane,"perWave",1,8,1).name("每波飞弹数"),B.add($.arcane,"waves",1,12,1).name("每次引导波数"),B.add($.arcane,"waveInterval",.05,.8,.01).name("波间隔 (s)"),B.add($.arcane,"spreadDeg",0,20,.5).name("波内散布 (度)"),B.add($.arcane,"spreadTime",0,.6,.01).name("出膛散开时长 (s)"),B.add($.arcane,"spawnDelay",0,.2,.005).name("波内出膛错落 (s)"),B.add($.arcane,"speedJitter",0,.5,.02).name("速度浮动比例"),B.add($.arcane,"turnRateDeg",0,420,10).name("制导转向 (度/秒)"),B.add($.arcane,"retargetInterval",.05,1,.05).name("重新索敌间隔 (s)"),B.add($.arcane,"cooldown",0,3,.05).name("引导结束冷却 (s)"),B.add($.arcane,"speed",3,24,.5).name("飞弹速度"),B.add($.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),B.add($.ring,"radius",.5,5,.1).name("电环半径"),B.add($.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),B.add($.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const at=o.hits.hitstopWarp;if(at){const wt=d(L,"卡肉节奏（接触瓦片）");wt.add(at,"enabled").name("瓦片开（关=硬冻结）"),wt.add(at,"holdRate",0,.4,.01).name("保持期速率"),wt.add(at,"release",.005,.2,.005).name("释放时长 (s)"),wt.add(at,"payback",1,2.5,.05).name("偿还倍率"),wt.add(o.hits.hitstop,"light",0,.2,.005).name("轻击保持 (s)"),wt.add(o.hits.hitstop,"heavy",0,.25,.005).name("重击保持 (s)"),wt.add(o.hits.hitstop,"knock",0,.3,.005).name("击飞保持 (s)")}const mt=o.hits,ft=d(L,"命中 / 受击 / 击退");ft.add(mt,"arcDeg",10,120,5).name("命中扇区半角 (°)"),ft.add(mt,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),ft.add(mt,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),ft.add(mt,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),ft.add(mt.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),ft.add(mt.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),ft.add(mt,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),ft.add(mt,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const Dt={get enabled(){return!mt.noDamageToPlayer},set enabled(wt){mt.noDamageToPlayer=!wt}};ft.add(Dt,"enabled").name("玩家受击击退");const j=d(L,"受击分层"),F=t.hurt;j.add(F,"enabled").name("启用分层受击 (关=旧版对照)"),j.add(F,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),j.add(F,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),j.add(F,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),j.add(F,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),j.add(F,"upperShiftScale",0,1,.01).name("上身位移缩放"),j.add(F,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),j.add(F.hitHeight,"light",0,1,.01).name("轻击命中部位"),j.add(F.hitHeight,"heavy",0,1,.01).name("重击命中部位"),j.add(F.hitHeight,"knock",0,1,.01).name("击退命中部位"),j.add(F,"leanLight",0,1.5,.01).name("轻击力度"),j.add(F,"leanHeavy",0,1.5,.01).name("重击力度"),j.add(F,"leanKnock",0,1.5,.01).name("击退力度"),j.add(F,"flashStrength",0,2,.05).name("受击闪光强度");for(const{name:wt,p:$t}of[{name:"打腹 (abdomen)",p:F.abdomen},{name:"打肩 (shoulder)",p:F.shoulder}]){const yt=d(j,wt);yt.add($t,"upperPitch",0,2,.01).name("上身前后倾斜"),yt.add($t,"upperRoll",0,2,.01).name("上身侧倾"),yt.add($t,"upperYaw",0,1.5,.01).name("肩部扭转"),yt.add($t,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),yt.add($t,"shift",0,.8,.01).name("身体反应位移"),yt.add($t,"drop",0,.4,.01).name("整体下沉"),yt.add($t,"back",0,.4,.01).name("屁股向后"),yt.add($t,"knee",0,1.6,.01).name("屈膝"),yt.add($t,"hip",0,1,.01).name("髋前倾"),yt.add($t,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)")}const Y=d(L,"派生招"),J=o.links;Y.add(J,"enabled").name("总开关 (false=旧连击)"),Y.add(J.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),Y.add(J.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),Y.add(J.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),Y.add(J,"sharedCooldown",0,3,.05).name("共享 CD (s)"),Y.add(J,"triggerWhileSprinting").name("长跑中可直接触发"),Y.add(J.search,"range",1,14,.1).name("索敌距离 (m)"),Y.add(J.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),Y.add(J.search,"stopDistance",0,3,.05).name("停住距离 (m)");const K=J.moves["sword-shield"];K&&(Y.add(K,"enabled").name("剑盾盾击"),Y.add(K,"distance",0,8,.1).name("冲锋极限 (m)"),Y.add(K,"windup",0,.5,.01).name("前摇 (s)"),Y.add(K,"active",0,.8,.01).name("冲锋 / 命中 (s)"),Y.add(K,"recovery",0,.8,.01).name("收势 (s)"),Y.add(K.hit,"radius",0,4,.05).name("命中半径 (m)"),Y.add(K.hit,"width",0,2,.05).name("扫掠半径 (m)"),Y.add(K.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),Y.add(K.hit,"duration",0,1.5,.01).name("僵直 (s)"));const st=o.targeting,Tt=d(L,"目标辅助");Tt.add(st,"targetAssist").name("启用目标辅助"),Tt.add(st,"range",1,14,.5).name("锁定范围 (m)"),Tt.add(st,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),Tt.add(st,"frontBias",0,4,.1).name("朝向加权"),Tt.add(st,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),Tt.add(st,"maxLungeScale",1,3,.1).name("前冲最大放大");const Wt=l("表现 / 特效"),dt=d(Wt,"挥击幅度 / 刀光"),X=t.animation.swing;dt.add(X,"enabled").name("挥击身体幅度 开"),dt.add(X,"bodyScale",0,1.6,.05).name("躯干 / 骨盆幅度倍率"),dt.add(X,"shoulderLift",0,.12,.005).name("肩部抬升上限 (m)"),dt.add(X,"shoulderPush",0,.1,.005).name("肩部前送上限 (m)"),dt.add(X,"shoulderIn",0,.1,.005).name("双手武器肩内收 (m)"),dt.add(X,"segBlend",0,.35,.01).name("段间过渡兜底 (s)"),dt.add(X,"segBlendMin",.008,.12,.004).name("段间过渡下限 (s)"),dt.add(X,"segBlendRef",2,16,.5).name("段间过渡参考距离 (rad)"),dt.add(X.weaponScale,"greatsword",0,1.6,.05).name("大剑幅度倍率");const H=t.weaponTrail;dt.add(H,"enabled").name("挥击刀光 开"),dt.add(H,"life",.04,.4,.01).name("刀光残留 (s)"),dt.add(H,"intensity",0,1.5,.05).name("刀光亮度"),dt.add(H,"minStep",.005,.1,.005).name("采样最小位移 (m)"),dt.add(t.hitstop,"enabled").name("命中卡肉 / 震屏");const kt=d(Wt,"夸张化 / 四肢伸缩"),Rt=t.animation.stretch;kt.add(Rt,"enabled").name("四肢伸缩 开"),kt.add(Rt,"swingArm",1,1.8,.01).name("挥出时手臂拉伸"),kt.add(Rt,"chargeArm",.7,1,.01).name("蓄力时手臂压缩"),kt.add(Rt,"impactSquash",0,.5,.01).name("命中挤压量"),kt.add(Rt,"impactDecay",2,30,.5).name("挤压回弹速率 (1/s)"),kt.add(Rt,"torsoGain",0,1,.05).name("躯干跟随比例"),kt.add(Rt,"volumeExp",0,1.5,.05).name("体积补偿指数");const _t=d(Wt,"武器握持 / 腕部"),vt=t.weaponWrist;_t.add(vt,"enabled").name("腕部滞后 开（关掉=武器焊在手上）"),_t.add(vt,"lag",0,.08,.002).name("臂速 → 腕滞后"),_t.add(vt,"maxAngle",0,1.2,.02).name("腕滞后上限 (rad)"),_t.add(vt,"rate",4,50,1).name("腕部跟随速率 (1/s)"),_t.add(vt,"twistLag",0,.06,.002).name("躯干扭转 → 剑横甩"),_t.add(vt,"maxTwist",0,.9,.02).name("横甩上限 (rad)");const gt=t.weaponMount;_t.add(gt,"twoHandInsetX",0,.3,.01).name("双手武器内收 (m)"),_t.add(gt,"twoHandGripY",-.5,0,.01).name("副握点在柄上的位置"),_t.add(gt,"twoHandMaxStretch",1,1.8,.01).name("副手臂长拉伸上限"),_t.add(gt,"twoHandMinGrip",0,1,.02).name("最低握持权重（1=永不松手）"),_t.add(gt,"twoHandGripStart",1,1.4,.01).name("开始松手的臂展比"),_t.add(gt,"twoHandSlideRate",0,30,1).name("握点滑柄跟随速率 (1/s)"),_t.add(gt,"swordPitchDeg",0,90,1).name("剑前倾角"),_t.add(gt,"swordYawDeg",0,45,1).name("剑外张角"),_t.add(gt,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),_t.add(gt,"staffPitchDeg",0,60,1).name("法杖前倾角");const Pt=l("假人 / 混战"),D=o.dummies,A=d(Pt,"普通假人 AI");A.add(D,"moveSpeed",.5,8,.1).name("移动速度"),A.add(D,"wanderRadius",.5,8,.1).name("游走半径"),A.add(D,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),A.add(D,"followStopDistance",.3,5,.1).name("跟随停距"),A.add(D,"keepDistance",1,10,.1).name("保持距离"),A.add(D,"keepDeadZone",.1,2,.05).name("保持死区"),A.add(D,"attackRange",.5,5,.1).name("攻击距离"),A.add(D,"attackInterval",.3,5,.1).name("攻击间隔 (s)"),A.add(D,"leashRadius",0,8,.1).name("牵引半径 (0=不限)");const q=D.fighters;if(q){const wt=d(Pt,"持械陪练（剑盾 / 双刀 / 大剑）");wt.add(q,"moveSpeed",.5,6,.1).name("移动速度"),wt.add(q,"attackInterval",.5,8,.1).name("攻击间隔 (s)"),wt.add(q,"attackRangeScale",.5,1.2,.02).name("起手距离 / 武器 reach"),wt.add(q,"knockbackScale",0,2,.05).name("击退比例"),wt.add(q,"leashRadius",0,14,.5).name("牵引半径 (m)"),wt.add(q,"comboCount",0,3,1).name("连击段数 (0=随武器)"),wt.add(q,"comboGap",0,.6,.01).name("段间缝隙 (s, 0=用全局)");const $t=()=>n.dummies.find(zt=>zt.weapon!==null),yt={get mode(){var zt;return((zt=$t())==null?void 0:zt.mode)??"spar"},set mode(zt){i.setFighterMode(zt)}};wt.add(yt,"mode",gp).name("陪练行为（全部）")}const ut=l("相机"),it=d(ut,"基础");it.add(t.camera,"pitchDeg",20,80,1).name("俯角"),it.add(t.camera,"yawDeg",-180,180,1).name("方位角"),it.add(t.camera,"distance",6,35,.5).name("距离"),it.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),it.add(t.camera,"fov",25,90,1).name("FOV");const lt=o.camera,Nt=d(ut,"智能构图");Nt.add(lt,"radius",2,18,.5).name("威胁评估半径 (m)"),Nt.add(lt,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),Nt.add(lt,"saturation",.5,8,.1).name("威胁归一化饱和"),Nt.add(lt,"pushIn",0,.5,.01).name("无威胁推进比例"),Nt.add(lt,"maxPullback",0,1,.02).name("最大拉远比例"),Nt.add(lt,"maxOffset",0,6,.1).name("最大构图平移 (m)"),Nt.add(lt,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),Nt.add(lt,"framingBias",0,1,.05).name("威胁质心平移系数"),Nt.add(lt,"attackBoost",0,2,.05).name("挥砍中额外加权"),Nt.add(lt.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),Nt.add(lt.modeWeight,"spar",0,3,.05).name("陪练模式威胁倍率"),Nt.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const Ct=d(ut,"缩放");return Ct.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),Ct.add(t.zoom,"max",1,4,.05).name("最大拉远上限"),Ct.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),Ct.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),Ct.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),Ct.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),Ct.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),Ct.add({reset:i.resetZoom},"reset").name("缩放归 1"),r.forEach(wt=>wt.close()),c.forEach(wt=>wt.close()),s.close(),{gui:s,refreshWeapon:()=>G.updateDisplay()}}function y_(n,t,e){let i=null,a=Number.POSITIVE_INFINITY;for(const s of n){const o=Math.hypot(t-s.x,e-s.z);o<=s.radius&&o<a&&(i=s,a=o)}return i}function M_(n,t){return n.find(e=>e.id===t)??null}function Su(n,t,e){if(n.length===0)return null;const i=[...n].sort((r,c)=>r.index-c.index),a=i.findIndex(r=>r.id===t),s=e<0?-1:1,o=a<0?s>0?0:i.length-1:(a+s+i.length)%i.length;return i[o]??null}function __({stations:n,plots:t=[],world:e,view:i,container:a,onResetZoom:s,onPlotTest:o,onClearTestUnits:r}){var T;const c=a??document.getElementById("lab-panel");let l=null,d=null;const u=new Map,h=document.createElement("div");h.id="lab-toast",h.setAttribute("aria-live","polite"),document.body.appendChild(h);let f=0;function m(b){h.textContent=`${b.index} · ${b.name} — ${b.hint}`,h.style.borderColor=b.color,h.classList.add("is-on"),window.clearTimeout(f),f=window.setTimeout(()=>h.classList.remove("is-on"),5e3)}function v(){return y_(n,e.character.position.x,e.character.position.z)}function g(){const b=v(),y=(b==null?void 0:b.id)??null;if(y===l)return;const C=l!==null;l=y;for(const[I,R]of u)R.classList.toggle("is-active",I===y);d&&(d.textContent=b?`${b.index} · ${b.hint}`:"不在任何工位内：点上面的名字传送，或直接走过去",d.style.color=b?"rgba(206, 226, 244, 0.9)":"rgba(150, 172, 192, 0.62)"),b?m(b):C&&h.classList.remove("is-on")}function p(b){const y=typeof b=="number"?n.find(C=>C.index===b)??null:M_(n,b);return y?(zx(e,y.spawnX,y.spawnZ),e.camera.centroidX=y.spawnX,e.camera.centroidZ=y.spawnZ,i.snapCamera(y.spawnX,e.character.position.y,y.spawnZ),g(),!0):!1}function _(){Bp(e)}function x(b){return p(b.id),o?o(b):0}function M(){return r?r():0}function S(b){const y=typeof b=="number"?t.find(C=>C.index===b):t.find(C=>C.id===b);return y&&y.testSpawn?x(y):0}const w=t.filter(b=>b.testSpawn),E=b=>{var y,C;return(((y=b.testSpawn)==null?void 0:y.dummies)??0)+(((C=b.testSpawn)==null?void 0:C.fighters)??0)};if(c){c.textContent="";const b=document.createElement("div");b.className="lab-head",b.textContent="测试工位";const y=document.createElement("span");y.className="lab-tip",y.textContent="[ / ] 切换",b.appendChild(y),c.appendChild(b);for(const R of[...n].sort((U,L)=>U.index-L.index)){const U=document.createElement("button");U.type="button",U.className="lab-row",U.dataset.station=R.id,U.dataset.uiButton="",U.style.setProperty("--lab-color",R.color),U.setAttribute("aria-label",`传送到工位 ${R.index}：${R.name}`);const L=document.createElement("span");L.className="lab-idx",L.textContent=String(R.index);const k=document.createElement("span");k.className="lab-name",k.textContent=R.name,U.append(L,k),U.addEventListener("pointerdown",B=>{B.preventDefault(),B.stopPropagation(),p(R.id)}),c.appendChild(U),u.set(R.id,U)}if(d=document.createElement("div"),d.className="lab-hint",c.appendChild(d),w.length>0){const R=document.createElement("div");R.className="lab-head lab-subhead",R.textContent="地块测试";const U=document.createElement("span");U.className="lab-tip",U.textContent="就地生成",R.appendChild(U),c.appendChild(R);for(const L of w){const k=document.createElement("div");k.className="lab-row lab-test-row",k.dataset.plot=L.id;const B=document.createElement("span");B.className="lab-name",B.textContent=L.name;const G=document.createElement("button");G.type="button",G.className="lab-btn lab-test",G.dataset.uiButton="",G.dataset.plotTest=L.id,G.textContent=((T=L.testSpawn)==null?void 0:T.label)??`生成 ${E(L)} 人`,G.setAttribute("aria-label",`在${L.name}就地生成 ${E(L)} 个测试单位`),G.addEventListener("pointerdown",$=>{$.preventDefault(),$.stopPropagation(),x(L)}),k.append(B,G),c.appendChild(k)}}const C=document.createElement("div");C.className="lab-foot";const I=document.createElement("button");if(I.type="button",I.className="lab-btn",I.dataset.uiButton="",I.textContent="召回假人",I.setAttribute("aria-label","召回全部假人回到各自工位"),I.addEventListener("pointerdown",R=>{R.preventDefault(),R.stopPropagation(),_()}),C.appendChild(I),w.length>0){const R=document.createElement("button");R.type="button",R.className="lab-btn",R.dataset.uiButton="",R.dataset.clearTestUnits="",R.textContent="清除测试单位",R.setAttribute("aria-label","清除所有由地块测试按钮生成的假人与陪练"),R.addEventListener("pointerdown",U=>{U.preventDefault(),U.stopPropagation(),M()}),C.appendChild(R)}if(s){const R=document.createElement("button");R.type="button",R.className="lab-btn",R.dataset.uiButton="",R.textContent="镜头归位",R.setAttribute("aria-label","把镜头缩放恢复到默认"),R.addEventListener("pointerdown",U=>{U.preventDefault(),U.stopPropagation(),s()}),C.appendChild(R)}c.appendChild(C)}return window.addEventListener("keydown",b=>{var y,C;if(!(b.metaKey||b.ctrlKey||b.altKey))if(b.key==="["){const I=Su(n,((y=v())==null?void 0:y.id)??l,-1);I&&p(I.id)}else if(b.key==="]"){const I=Su(n,((C=v())==null?void 0:C.id)??l,1);I&&p(I.id)}else b.key==="\\"&&_()}),g(),{goto:p,current:v,tick:g,recall:_,spawnAt:S,clearSpawned:M,element:c}}const Gc=Math.PI*2,bi={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},b_=45,S_=50;function w_(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function to(n,t,e){const i=w_(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function E_(n,t){return Math.atan2(n,-t)*180/Math.PI}function wu(n,t){return Math.abs(((n-t)%360+540)%360-180)}function Zo(n){return(n%360+360)%360}const T_={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function A_(n,t,e,i=8){const a=n.character,s=t.intents,o=Math.hypot(s.moveX,s.moveZ),r=Math.hypot(t.stickRawX,t.stickRawY),c=a.velocity,l=Math.hypot(c.x,c.z),d=o>.001?to(s.moveX,s.moveZ,e):null,u=l>.15?to(c.x,c.z,e):null,h=to(Math.sin(a.facing),Math.cos(a.facing),e),f=s.aimActive&&Math.hypot(s.aimX,s.aimZ)>1e-6?to(s.aimX,s.aimZ,e):null,m=n.targeting,v=m.hasTarget?to(Math.sin(m.targetYaw),Math.cos(m.targetYaw),e):null,g=d!==null&&u!==null?wu(d,u):null,p=d!==null?wu(d,h):null,_=g!==null&&g>b_&&o>=.35&&l>=.4;return{inDeg:d,inLen:Math.min(1,o),rawDeg:r>.02?E_(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,r),stickHeld:t.stickHeld,moveDeg:u,speed:l,faceDeg:h,lockDeg:v,lockId:m.targetId,lockDist:m.targetDist,aimDeg:f,gapMove:g,gapFace:p,warnMove:_}}function Eu(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>S_&&(n.inLen>=.35||n.speed>=.4)}const Tu="harness.dirDebug";function R_(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const a=e.querySelector("#dirdbg-canvas"),s=e.querySelector("#dirdbg-toggle"),o={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},r=a.getContext("2d");let c=!0;if(!t)try{c=window.localStorage.getItem(Tu)!=="0"}catch{}function l(){e.classList.toggle("is-off",!c),s&&(s.textContent=c?"方向 ⌄":"方向 ▸",s.setAttribute("aria-expanded",String(c)))}l();function d(x){if(c=x,!t)try{window.localStorage.setItem(Tu,x?"1":"0")}catch{}l()}s==null||s.addEventListener("pointerdown",x=>{x.preventDefault(),x.stopPropagation(),d(!c)}),t||window.addEventListener("keydown",x=>{x.key.toLowerCase()==="v"&&!x.metaKey&&!x.ctrlKey&&d(!c)});const u=Math.min(3,Math.max(1,window.devicePixelRatio||1)),h=118;a.width=Math.round(h*u),a.height=Math.round(h*u);let f=T_,m=0,v="",g=8;function p(x){if(!r)return;const M=h,S=h,w=M/2,E=S/2,T=Math.min(M,S)/2-13;r.setTransform(u,0,0,u,0,0),r.clearRect(0,0,M,S),r.beginPath(),r.arc(w,E,T,0,Gc),r.fillStyle="rgba(8, 12, 17, 0.5)",r.fill(),r.lineWidth=1,r.strokeStyle=x.warnMove?"rgba(251, 191, 36, 0.85)":bi.ring,r.stroke(),r.strokeStyle=bi.grid,r.beginPath(),r.moveTo(w-T,E),r.lineTo(w+T,E),r.moveTo(w,E-T),r.lineTo(w,E+T),r.stroke();for(let I=0;I<8;I++){const R=I*Math.PI/4,U=w+Math.sin(R)*(T-3),L=E-Math.cos(R)*(T-3),k=w+Math.sin(R)*T,B=E-Math.cos(R)*T;r.beginPath(),r.moveTo(U,L),r.lineTo(k,B),r.stroke()}const b=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;b>0&&(r.save(),r.setLineDash([2,3]),r.strokeStyle=bi.dead,r.beginPath(),r.arc(w,E,T*b,0,Gc),r.stroke(),r.restore());const y=(I,R,U,L,k=!1,B=1)=>{const G=I*Math.PI/180,$=Math.sin(G),at=-Math.cos(G),mt=T*Math.max(.14,Math.min(1,R)),ft=w+$*T*.14,Dt=E+at*T*.14,j=w+$*mt,F=E+at*mt;if(r.save(),r.globalAlpha=B,r.strokeStyle=U,r.fillStyle=U,r.lineWidth=L,r.lineCap="round",k&&r.setLineDash([3,3]),r.beginPath(),r.moveTo(ft,Dt),r.lineTo(j,F),r.stroke(),!k&&mt>T*.3){const Y=-at,J=$,K=5.2;r.beginPath(),r.moveTo(j+$*1.5,F+at*1.5),r.lineTo(j-$*K+Y*K*.72,F-at*K+J*K*.72),r.lineTo(j-$*K-Y*K*.72,F-at*K-J*K*.72),r.closePath(),r.fill()}r.restore()},C=(I,R)=>{const U=I*Math.PI/180,L=Math.sin(U),k=-Math.cos(U),B=-k,G=L,$=T+1.5,at=$+6.5;r.save(),r.fillStyle=R,r.strokeStyle=R,r.lineWidth=1,r.beginPath(),r.moveTo(w+L*at,E+k*at),r.lineTo(w+L*$+B*4,E+k*$+G*4),r.lineTo(w+L*$-B*4,E+k*$-G*4),r.closePath(),r.fill(),r.restore()};x.lockDeg!==null&&y(x.lockDeg,1,bi.lock,1,!0,.7),x.rawDeg!==null&&x.stickHeld&&y(x.rawDeg,x.rawLen,bi.raw,1,!0,.9),x.aimDeg!==null&&y(x.aimDeg,1,bi.aim,1.6,!0,.95),y(x.faceDeg,1,bi.face,1.1,!0,.55),x.moveDeg!==null&&y(x.moveDeg,x.speed/Math.max(1,g),bi.move,5.5,!1,.8),x.inDeg!==null&&y(x.inDeg,x.inLen,bi.input,2.2),C(x.faceDeg,bi.face),r.beginPath(),r.arc(w,E,2.2,0,Gc),r.fillStyle="rgba(220, 235, 248, 0.85)",r.fill()}function _(x,M){const S=T=>T===null?"-":String(Math.round(Zo(T)));o.in.textContent=`入 ${S(x.inDeg)}`,o.mv.textContent=`移 ${S(x.moveDeg)}`,o.fc.textContent=`面 ${S(x.faceDeg)}`;const w=T=>T===null?"-":`${Math.round(T)}°`,E=[`Δ入→移 ${w(x.gapMove)}`,`Δ入→面 ${w(x.gapFace)}`];x.speed>.05&&E.push(`v${x.speed.toFixed(1)}`),x.lockDeg!==null&&E.push(`锁#${x.lockId} ${x.lockDist.toFixed(1)}m`),x.aimDeg!==null&&E.push("拖拽瞄准"),o.gap.textContent=E.join("  "),e.classList.toggle("is-warn",x.warnMove||Eu(x,M))}return{update(x,M,S){if(!c)return;g=Math.max(1,x.config.moveSpeed*Math.max(1,x.config.sprintMultiplier));const w=A_(x,M,S,g);f=w;const E=x.combat.phase!=="idle";p(w);const T=performance.now(),b=`${w.inDeg}|${w.moveDeg}|${w.faceDeg}|${w.lockId}|${w.aimDeg}|${w.warnMove}|${w.speed.toFixed(1)}`;(T-m>90||b!==v)&&(m=T,v=b,_(w,E),e.dataset.in=w.inDeg===null?"":Zo(w.inDeg).toFixed(1),e.dataset.mv=w.moveDeg===null?"":Zo(w.moveDeg).toFixed(1),e.dataset.fc=Zo(w.faceDeg).toFixed(1),e.dataset.warn=w.warnMove||Eu(w,E)?"1":"0")},setEnabled:d,toggle(){return d(!c),c},enabled:()=>c,last:()=>f}}const P_=6,C_=480,Au=240,Ru=128,L_=18,D_=.05,Pu=.16,k_=.02;function Cu(n,t,e){if(!e)return"air";if(t<D_)return"both";const i=Math.sin(n);return i>Pu?"L":i<-Pu?"R":"both"}function Lu(n){const t=Math.PI*2;return(n%t+t)%t}function Du(n,t){const e=Math.PI*2;let i=t-n;return i-=Math.round(i/e)*e,n+i}const ku={L:"#fbbf24",R:"#a78bfa",both:"rgba(148, 163, 184, 0.85)",air:"#38bdf8"},I_={L:"rgba(251, 191, 36, 0.13)",R:"rgba(167, 139, 250, 0.13)",both:"rgba(148, 163, 184, 0.09)",air:"rgba(56, 189, 248, 0.07)"},z_={L:"左踩",R:"右踩",both:"双踩",air:"腾空"};function F_(n,t,e,i){const a=t-n;return{t:i,speed:t,drive:t,raw:t,dv:a,accel:e>1e-4?a/e:0,busy:!1,phase:0,stance:"both",grounded:!0,moving:!1}}function U_(n,t,e,i){const s=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:s,speed:Math.min(s,Math.max(1,i))}}function N_(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function O_(n={}){const t=Math.max(1,n.windowS??P_),e=Math.max(60,n.capacity??C_),i=Math.max(1,n.speedCap??L_),a=!!(n.container&&n.toggle),s=n.container??document.createElement("div");s.id="motiondbg",n.container||(s.setAttribute("data-ui-region",""),document.body.appendChild(s));const o=['<div id="motiondbg-head"><span>速度(位移) / Δv / 相位</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="128"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");s.innerHTML=a?`<div id="motiondbg-body">${o}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${o}</div>`].join("");const r=n.toggle??s.querySelector("#motiondbg-toggle"),c=s.querySelector("#motiondbg-graph"),l=s.querySelector("#motiondbg-read"),d=s.querySelector("#motiondbg-window"),u=s.querySelector("#motiondbg-dir");d.textContent=`${t.toFixed(1)}s`;const h=c.getContext("2d"),f=Math.min(3,Math.max(1,window.devicePixelRatio||1));c.width=Math.round(Au*f),c.height=Math.round(Ru*f);const m=R_({deadZone:n.deadZone,container:u,embedded:!0});let v=!1;function g(y){v=y,s.classList.toggle("is-off",!y),!a&&r&&(r.textContent=y?"手感 ⌄":"手感 ▸",r.setAttribute("aria-expanded",String(y)),r.setAttribute("aria-label",y?"收起手感调试面板":"展开手感调试面板"))}g(!1),a||(r==null||r.addEventListener("pointerdown",y=>{y.preventDefault(),y.stopPropagation(),g(!v)}),window.addEventListener("keydown",y=>{y.key.toLowerCase()==="v"&&!y.metaKey&&!y.ctrlKey&&g(!v)}));const p=[];let _=0,x=null,M=0,S=!1,w=-1,E={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1,phase:0,stance:"both"};function T(y){const C=y-t;let I=0;for(;I<p.length&&p[I].t<C;)I++;return p.slice(I)}function b(y,C){if(!h)return;const I=Au,R=Ru;h.setTransform(f,0,0,f,0,0),h.clearRect(0,0,I,R),h.fillStyle="rgba(8, 12, 17, 0.55)",h.fillRect(0,0,I,R);const U=4,L=4,k=I-U-L,B=9,G=44,$=58,at=20,mt=84,ft=38,Dt=C-t,j=dt=>U+Math.max(0,Math.min(1,(dt-Dt)/t))*k;for(let dt=0;dt<y.length;dt++){if(!y[dt].busy)continue;const X=j(y[dt].t),H=dt+1<y.length?j(y[dt+1].t):X+2;h.fillStyle="rgba(251, 146, 60, 0.13)",h.fillRect(X,B,Math.max(2,H-X),G)}h.strokeStyle="rgba(150, 190, 220, 0.14)",h.lineWidth=1,h.beginPath();for(const dt of[B,B+G/2,B+G])h.moveTo(U,dt),h.lineTo(I-L,dt);h.moveTo(U,$+at/2),h.lineTo(I-L,$+at/2);for(const dt of[mt,mt+ft/2,mt+ft])h.moveTo(U,dt),h.lineTo(I-L,dt);h.stroke();const Y=Math.max(1,...y.map(dt=>dt.speed),...y.map(dt=>dt.drive))*1.15,J=dt=>B+G-dt/Y*G;if(y.length>1){h.beginPath(),h.moveTo(j(y[0].t),J(y[0].speed));for(let dt=1;dt<y.length;dt++)h.lineTo(j(y[dt].t),J(y[dt].speed));h.strokeStyle="#38bdf8",h.lineWidth=1.8,h.lineJoin="round",h.stroke(),h.lineTo(j(y[y.length-1].t),B+G),h.lineTo(j(y[0].t),B+G),h.closePath(),h.fillStyle="rgba(56, 189, 248, 0.14)",h.fill(),h.beginPath(),h.moveTo(j(y[0].t),J(y[0].drive));for(let dt=1;dt<y.length;dt++)h.lineTo(j(y[dt].t),J(y[dt].drive));h.setLineDash([3,3]),h.strokeStyle="rgba(190, 205, 220, 0.6)",h.lineWidth=1.2,h.stroke(),h.setLineDash([])}let K=.02;for(const dt of y)K=Math.max(K,Math.abs(dt.dv));K*=1.1;const st=$+at/2,Tt=at/2;for(const dt of y){const X=Math.min(Tt,Math.abs(dt.dv)/K*Tt);h.fillStyle=dt.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",h.fillRect(j(dt.t)-.7,dt.dv>=0?st-X:st,1.4,Math.max(.5,X))}const Wt=dt=>mt+ft/2-dt*(ft/2-1);for(let dt=0;dt<y.length;dt++){const X=y[dt].stance;if(X==="air")continue;const H=j(y[dt].t),kt=dt+1<y.length?j(y[dt+1].t):H+2;h.fillStyle=I_[X],h.fillRect(H,mt,Math.max(1,kt-H),ft)}if(y.length>1){let dt=j(y[0].t),X=Wt(Math.sin(y[0].phase));for(let kt=1;kt<y.length;kt++){const Rt=y[kt-1],_t=y[kt],vt=j(Rt.t),gt=j(_t.t),Pt=Du(Rt.phase,_t.phase),D=Math.max(1,Math.min(16,Math.round((gt-vt)/2)));for(let A=1;A<=D;A++){const q=A/D,ut=Rt.phase+(Pt-Rt.phase)*q,it=vt+(gt-vt)*q,lt=Wt(Math.sin(ut)),Nt=A===D?_t.stance:Cu(ut,Rt.moving?1:0,Rt.grounded);h.beginPath(),h.moveTo(dt,X),h.lineTo(it,lt),h.strokeStyle=ku[Nt],h.lineWidth=1.7,h.lineJoin="round",h.stroke(),dt=it,X=lt}}const H=y[y.length-1];h.beginPath(),h.arc(j(H.t)-1.5,Wt(Math.sin(H.phase)),2.1,0,Math.PI*2),h.fillStyle=ku[H.stance],h.fill()}h.font="9px ui-monospace, monospace",h.fillStyle="rgba(190, 214, 234, 0.55)",h.textAlign="left",h.fillText(Y.toFixed(1),U+2,B+8),h.fillText("v",U+2,B+G-2),h.fillText("Δv",U+2,$+9),h.fillStyle="rgba(251, 191, 36, 0.75)",h.fillText("L",U+2,mt+8),h.fillStyle="rgba(167, 139, 250, 0.75)",h.fillText("R",U+2,mt+ft-2),h.textAlign="right",h.fillStyle="rgba(190, 214, 234, 0.55)",h.fillText("0",I-L-2,B+G-2),h.textAlign="left"}return{dirDebug:m,update(y,C,I){var j;const R=performance.now()/1e3,U=w<0?1/60:Math.max(1e-4,Math.min(.25,R-w));w=R;const L=y.character,k={x:L.position.x,z:L.position.z},B=Math.hypot(L.velocity.x,L.velocity.z),{speed:G,raw:$}=x?U_(x,k,U,i):{speed:0,raw:0},at=F_(_,G,U,R);at.drive=B,at.raw=$,at.busy=N_(y);const mt=((j=n.phaseSource)==null?void 0:j.call(n))??L.gaitPhase;at.phase=mt,at.grounded=L.grounded,at.moving=S&&Math.abs(Du(M,mt)-M)>k_,M=mt,S=!0,at.stance=Cu(mt,at.moving?1:0,L.grounded),x=k,_=G,p.push(at),p.length>e&&p.shift();const ft=T(R);let Dt=0;for(const F of ft)Dt=Math.max(Dt,F.speed);if(E={speed:G,drive:B,raw:$,dv:at.dv,accel:at.accel,peak:Dt,samples:ft.length,windowS:t,busy:at.busy,phase:Lu(mt),stance:at.stance},m.update(y,C,I),v){b(ft,R);const F=at.dv>=0?"+":"";l.textContent=`v ${G.toFixed(2)} · 驱 ${B.toFixed(2)} · 峰 ${Dt.toFixed(2)} · Δv ${F}${at.dv.toFixed(3)} · ${ft.length} 帧
φ ${Lu(mt).toFixed(2)} · ${z_[at.stance]}`}},setEnabled:g,toggle(){return g(!v),v},enabled:()=>v,last:()=>({...E}),samples:()=>T(performance.now()/1e3).map(y=>({...y}))}}const B_=["剑盾","双剑","大剑","法杖","弓"],H_={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击",spar:"陪练"};function G_(n){return{update(t,e,i,a,s,o,r=!1){const c=t.character,l=c.position,d=c.velocity,u=t.combat,h=t.events.length>0?t.events[t.events.length-1]:null,f=dt=>dt.toFixed(2),m=dt=>(dt*180/Math.PI).toFixed(0),v=B_[fa.indexOf(u.weapon)]??u.weapon,g=Math.round(u.charge*10),p="|".repeat(g)+".".repeat(10-g),_=t.dash,x=_.phase==="active"&&_.duration>0?(1-_.timer/_.duration)*100:0,M=_.phase==="active"?`${_.kind}@${x.toFixed(0)}%`:`${_.kind} cd${f(_.cooldown)}`,S=a.intents.aimActive?`(${f(a.intents.aimX)},${f(a.intents.aimZ)})`:"-",w=d.x*Math.sin(c.bodyYaw)+d.z*Math.cos(c.bodyYaw),E=d.x*Math.cos(c.bodyYaw)-d.z*Math.sin(c.bodyYaw),T=Math.abs(w)+Math.abs(E)+1e-6,b=Math.round(Math.abs(E)/T*100),y=`strafe ${b}%${w<-.05?" back":""}`,C=t.camera,I=`threat ${(C.threat*100).toFixed(0)}%  dist×${f(C.distanceScale)}  off (${f(C.offsetX)},${f(C.offsetZ)})  pitch +${f(C.pitchDelta)}°  n=${C.threatCount}`,R=o?f(o.attackBlend):"-",U=o==null?void 0:o.attackWeights,L=U?`gw ${f(U.gaitScale)}  lw ${f(U.attackLegWeight)}  spd ${f(U.driveSpeed)}`:"-",k=U?`${f(U.gaitScale)}/${f(U.attackLegWeight)}`:"-",B=o?`${o.landing.kind} ${f(o.landing.pulse)} t${f(o.landing.remaining)} vy${f(o.landing.impactVy)}`:"-",G=o?`${o.landing.kind}/${f(o.landing.pulse)}`:"-",$=(o==null?void 0:o.zoom)!==void 0?`zoom ×${f(o.zoom)}`:"-",at=o==null?void 0:o.hurt,mt=at?`hurt ${t.playerHurt.type}  部位h${f(at.hitHeight)}  脉冲p${f(at.pulse)}  上身${f(at.upperShift)}  重心${f(at.comShift)}  后坐${f(at.pelvisBack)}  屈膝${f(at.knee)}`:"-",ft=at?`${f(at.hitHeight)}/${f(at.pulse)}/${f(at.knee)}`:"-",Dt=o==null?void 0:o.ik,j=Dt?`${Dt.active?"on":"off"} w${f(Dt.weight)} e${f(Dt.maxError)}`:"-",F=t.playerLink,Y=`link ${F.kind||"-"}  ${F.phase}  prog ${f(F.progress)}  win ${f(F.linkWindow)}s  cd ${f(F.cooldown)}s  hits ${F.hitIds.length}  travel ${f(F.travelled)}/${f(F.travel)}m  id ${F.id}`,J=`${F.phase}/${F.kind||"-"}/w${f(F.linkWindow)}`,K=a.lastGesture,st=K?`${K.button} ${K.kind} ${K.heldMs.toFixed(0)}ms d${K.distance.toFixed(0)}px ${K.angleDeg.toFixed(0)}° taps${K.taps}`:"-",Tt=t.dummies.map(dt=>`${dt.id}:${H_[dt.mode]}`).join("  ");if(r){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${v} ${u.phase} · lk ${F.phase}${F.kind?`/${F.kind}`:""} w${f(F.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${f(l.x)},${f(l.y)},${f(l.z)})  vel (${f(d.x)},${f(d.y)},${f(d.z)})`,`face ${m(c.facing)}  body ${m(c.bodyYaw)}  head ${m(c.headYaw)}  move ${m(c.moveYaw)}  st${b}%  stick(${f(a.stickX)},${f(a.stickY)}) ${a.source}  str${f(c.stride)}`,`weapon ${v}  ${u.phase}  combo ${u.comboIndex}/3  atk ${f(u.attackProgress)}  dash ${M}  ab ${R}  gw/lw ${k}  land ${G}  ik ${j}`,`aim ${S}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${f(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${ft}`,`dummies ${Tt}  atkCount ${t.dummyAttackCount}  cam ${(C.threat*100).toFixed(0)}% ×${f(C.distanceScale)}  ${$}  lk ${J}`,`event ${h?`${h.type} ${f(h.value)}`:"-"}  scale ${f(s.timeScale)}${s.paused?" [P]":""}  g ${st}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${f(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${f(l.x)}, ${f(l.y)}, ${f(l.z)})`,`vel  (${f(d.x)}, ${f(d.y)}, ${f(d.z)})`,`grounded ${c.grounded?"Y":"N"}   sprint ${c.sprinting?"Y":"N"}   facing ${m(c.facing)}deg   atkBlend ${R}   ${L}   land ${B}`,mt,`ik ${j}  clamped ${Dt?Dt.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${m(c.facing)}  body ${m(c.bodyYaw)}  head ${m(c.headYaw)}  move ${m(c.moveYaw)}  (head-body ${m(c.headYaw-c.bodyYaw)})  ${y}`,`move (${f(a.intents.moveX)}, ${f(a.intents.moveZ)})  stick (${f(a.stickX)}, ${f(a.stickY)})  ${a.source}  aim ${S}`,`weapon ${v}  phase ${u.phase}  combo ${u.comboIndex}/3  atk ${f(u.attackProgress)}${u.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${_.kind}  phase ${_.phase}  prog ${x.toFixed(0)}%  cd ${f(_.cooldown)}s  id ${_.id}  from (${f(_.fromX)},${f(_.fromZ)}) → to (${f(_.toX)},${f(_.toZ)})`,Y,`camera ${I}  ${$}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${f(t.targeting.targetDist)}m  face ${m(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${p}] ${(u.charge*100).toFixed(0)}%  charging ${u.charging?"Y":"N"}`,`dummies ${Tt}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${f(t.impulse.x)}, ${f(t.impulse.z)})`,`event ${h?`${h.type} ${f(h.value)}`:"-"}   scale ${f(s.timeScale)}${s.paused?" [PAUSED]":""}   gesture ${st}`].join(`
`)}}}const jo=["lab","hud","motion","debug"],Iu={lab:{short:"工位",full:"测试工位"},hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}},zu={lab:{toggle:"lab-toggle",panel:"lab-panel"},hud:{toggle:"hud-toggle",panel:"hud"},motion:{toggle:"motiondbg-toggle",panel:"motiondbg"},debug:{toggle:"debug-toggle",panel:"debug-panel"}};function X_(n){var c;const t=Object.fromEntries(jo.map(l=>[l,document.getElementById(zu[l].toggle)])),e=Object.fromEntries(jo.map(l=>[l,document.getElementById(zu[l].panel)]));let i={},a=null;function s(){var l,d,u;for(const h of jo){const f=a===h,m=t[h],v=e[h];m&&(m.setAttribute("aria-expanded",String(f)),m.textContent=`${Iu[h].short} ${f?"▾":"▸"}`,m.setAttribute("aria-label",`${f?"收起":"展开"}${Iu[h].full}`)),v&&v.classList.toggle("is-open",f)}n.classList.toggle("is-compact",a!=="hud"),(l=i.motion)==null||l.setEnabled(a==="motion"),a==="debug"?(d=i.debug)==null||d.open():(u=i.debug)==null||u.close()}function o(l){a=a===l?null:l,s()}function r(){a!==null&&(a=null,s())}for(const l of jo)(c=t[l])==null||c.addEventListener("pointerdown",d=>{d.preventDefault(),d.stopPropagation(),o(l)});return window.addEventListener("keydown",l=>{l.key.toLowerCase()==="v"&&!l.metaKey&&!l.ctrlKey&&o("motion")}),s(),{hudCompact:()=>a!=="hud",register(l){i=l,s()},toggle:o,closeAll:r,isOpen:l=>a===l}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const qh="170",V_=0,Fu=1,W_=2,im=1,am=2,Hi=3,pa=0,Wn=1,We=2,ha=0,ws=1,Xi=2,Uu=3,Nu=4,Y_=5,za=100,$_=101,Z_=102,j_=103,q_=104,K_=200,J_=201,Q_=202,tb=203,Wl=204,Yl=205,eb=206,nb=207,ib=208,ab=209,sb=210,ob=211,rb=212,cb=213,lb=214,$l=0,Zl=1,jl=2,Ds=3,ql=4,Kl=5,Jl=6,Ql=7,Kh=0,hb=1,db=2,da=0,ub=1,fb=2,pb=3,mb=4,gb=5,xb=6,vb=7,sm=300,ks=301,Is=302,th=303,eh=304,hc=306,nh=1e3,Ua=1001,ih=1002,ei=1003,yb=1004,qo=1005,Ei=1006,Xc=1007,Na=1008,$i=1009,om=1010,rm=1011,Lo=1012,Jh=1013,Ha=1014,Ti=1015,No=1016,Qh=1017,td=1018,zs=1020,cm=35902,lm=1021,hm=1022,gi=1023,dm=1024,um=1025,Es=1026,Fs=1027,ed=1028,nd=1029,fm=1030,id=1031,ad=1033,Dr=33776,kr=33777,Ir=33778,zr=33779,ah=35840,sh=35841,oh=35842,rh=35843,ch=36196,lh=37492,hh=37496,dh=37808,uh=37809,fh=37810,ph=37811,mh=37812,gh=37813,xh=37814,vh=37815,yh=37816,Mh=37817,_h=37818,bh=37819,Sh=37820,wh=37821,Fr=36492,Eh=36494,Th=36495,pm=36283,Ah=36284,Rh=36285,Ph=36286,Mb=3200,_b=3201,mm=0,bb=1,sa="",Bn="srgb",Ns="srgb-linear",dc="linear",ze="srgb",ts=7680,Ou=519,Sb=512,wb=513,Eb=514,gm=515,Tb=516,Ab=517,Rb=518,Pb=519,Ch=35044,yo=35048,Bu="300 es",Wi=2e3,Kr=2001;class Os{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const a=this._listeners[t];if(a!==void 0){const s=a.indexOf(e);s!==-1&&a.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const a=i.slice(0);for(let s=0,o=a.length;s<o;s++)a[s].call(this,t);t.target=null}}}const Cn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Hu=1234567;const Ts=Math.PI/180,Do=180/Math.PI;function Ri(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Cn[n&255]+Cn[n>>8&255]+Cn[n>>16&255]+Cn[n>>24&255]+"-"+Cn[t&255]+Cn[t>>8&255]+"-"+Cn[t>>16&15|64]+Cn[t>>24&255]+"-"+Cn[e&63|128]+Cn[e>>8&255]+"-"+Cn[e>>16&255]+Cn[e>>24&255]+Cn[i&255]+Cn[i>>8&255]+Cn[i>>16&255]+Cn[i>>24&255]).toLowerCase()}function En(n,t,e){return Math.max(t,Math.min(e,n))}function sd(n,t){return(n%t+t)%t}function Cb(n,t,e,i,a){return i+(n-t)*(a-i)/(e-t)}function Lb(n,t,e){return n!==t?(e-n)/(t-n):0}function Mo(n,t,e){return(1-e)*n+e*t}function Db(n,t,e,i){return Mo(n,t,1-Math.exp(-e*i))}function kb(n,t=1){return t-Math.abs(sd(n,t*2)-t)}function Ib(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function zb(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function Fb(n,t){return n+Math.floor(Math.random()*(t-n+1))}function Ub(n,t){return n+Math.random()*(t-n)}function Nb(n){return n*(.5-Math.random())}function Ob(n){n!==void 0&&(Hu=n);let t=Hu+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Bb(n){return n*Ts}function Hb(n){return n*Do}function Gb(n){return(n&n-1)===0&&n!==0}function Xb(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Vb(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Wb(n,t,e,i,a){const s=Math.cos,o=Math.sin,r=s(e/2),c=o(e/2),l=s((t+i)/2),d=o((t+i)/2),u=s((t-i)/2),h=o((t-i)/2),f=s((i-t)/2),m=o((i-t)/2);switch(a){case"XYX":n.set(r*d,c*u,c*h,r*l);break;case"YZY":n.set(c*h,r*d,c*u,r*l);break;case"ZXZ":n.set(c*u,c*h,r*d,r*l);break;case"XZX":n.set(r*d,c*m,c*f,r*l);break;case"YXY":n.set(c*f,r*d,c*m,r*l);break;case"ZYZ":n.set(c*m,c*f,r*d,r*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+a)}}function mi(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function De(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Gu={DEG2RAD:Ts,RAD2DEG:Do,generateUUID:Ri,clamp:En,euclideanModulo:sd,mapLinear:Cb,inverseLerp:Lb,lerp:Mo,damp:Db,pingpong:kb,smoothstep:Ib,smootherstep:zb,randInt:Fb,randFloat:Ub,randFloatSpread:Nb,seededRandom:Ob,degToRad:Bb,radToDeg:Hb,isPowerOfTwo:Gb,ceilPowerOfTwo:Xb,floorPowerOfTwo:Vb,setQuaternionFromProperEuler:Wb,normalize:De,denormalize:mi};class Vt{constructor(t=0,e=0){Vt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6],this.y=a[1]*e+a[4]*i+a[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(En(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),a=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*i-o*a+t.x,this.y=s*a+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class pe{constructor(t,e,i,a,s,o,r,c,l){pe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,c,l)}set(t,e,i,a,s,o,r,c,l){const d=this.elements;return d[0]=t,d[1]=a,d[2]=r,d[3]=e,d[4]=s,d[5]=c,d[6]=i,d[7]=o,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[3],c=i[6],l=i[1],d=i[4],u=i[7],h=i[2],f=i[5],m=i[8],v=a[0],g=a[3],p=a[6],_=a[1],x=a[4],M=a[7],S=a[2],w=a[5],E=a[8];return s[0]=o*v+r*_+c*S,s[3]=o*g+r*x+c*w,s[6]=o*p+r*M+c*E,s[1]=l*v+d*_+u*S,s[4]=l*g+d*x+u*w,s[7]=l*p+d*M+u*E,s[2]=h*v+f*_+m*S,s[5]=h*g+f*x+m*w,s[8]=h*p+f*M+m*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],c=t[6],l=t[7],d=t[8];return e*o*d-e*r*l-i*s*d+i*r*c+a*s*l-a*o*c}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],c=t[6],l=t[7],d=t[8],u=d*o-r*l,h=r*c-d*s,f=l*s-o*c,m=e*u+i*h+a*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/m;return t[0]=u*v,t[1]=(a*l-d*i)*v,t[2]=(r*i-a*o)*v,t[3]=h*v,t[4]=(d*e-a*c)*v,t[5]=(a*s-r*e)*v,t[6]=f*v,t[7]=(i*c-l*e)*v,t[8]=(o*e-i*s)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,a,s,o,r){const c=Math.cos(s),l=Math.sin(s);return this.set(i*c,i*l,-i*(c*o+l*r)+o+t,-a*l,a*c,-a*(-l*o+c*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(Vc.makeScale(t,e)),this}rotate(t){return this.premultiply(Vc.makeRotation(-t)),this}translate(t,e){return this.premultiply(Vc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<9;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Vc=new pe;function xm(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Jr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Yb(){const n=Jr("canvas");return n.style.display="block",n}const Xu={};function fo(n){n in Xu||(Xu[n]=!0,console.warn(n))}function $b(n,t,e){return new Promise(function(i,a){function s(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:a();break;case n.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}function Zb(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function jb(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Se={enabled:!0,workingColorSpace:Ns,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===ze&&(n.r=Yi(n.r),n.g=Yi(n.g),n.b=Yi(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===ze&&(n.r=As(n.r),n.g=As(n.g),n.b=As(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===sa?dc:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function Yi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function As(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const Vu=[.64,.33,.3,.6,.15,.06],Wu=[.2126,.7152,.0722],Yu=[.3127,.329],$u=new pe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Zu=new pe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Se.define({[Ns]:{primaries:Vu,whitePoint:Yu,transfer:dc,toXYZ:$u,fromXYZ:Zu,luminanceCoefficients:Wu,workingColorSpaceConfig:{unpackColorSpace:Bn},outputColorSpaceConfig:{drawingBufferColorSpace:Bn}},[Bn]:{primaries:Vu,whitePoint:Yu,transfer:ze,toXYZ:$u,fromXYZ:Zu,luminanceCoefficients:Wu,outputColorSpaceConfig:{drawingBufferColorSpace:Bn}}});let es;class qb{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{es===void 0&&(es=Jr("canvas")),es.width=t.width,es.height=t.height;const i=es.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=es}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Jr("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const a=i.getImageData(0,0,t.width,t.height),s=a.data;for(let o=0;o<s.length;o++)s[o]=Yi(s[o]/255)*255;return i.putImageData(a,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Yi(e[i]/255)*255):e[i]=Yi(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Kb=0;class vm{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Kb++}),this.uuid=Ri(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},a=this.data;if(a!==null){let s;if(Array.isArray(a)){s=[];for(let o=0,r=a.length;o<r;o++)a[o].isDataTexture?s.push(Wc(a[o].image)):s.push(Wc(a[o]))}else s=Wc(a);i.url=s}return e||(t.images[this.uuid]=i),i}}function Wc(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?qb.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Jb=0;class kn extends Os{constructor(t=kn.DEFAULT_IMAGE,e=kn.DEFAULT_MAPPING,i=Ua,a=Ua,s=Ei,o=Na,r=gi,c=$i,l=kn.DEFAULT_ANISOTROPY,d=sa){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Jb++}),this.uuid=Ri(),this.name="",this.source=new vm(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=s,this.minFilter=o,this.anisotropy=l,this.format=r,this.internalFormat=null,this.type=c,this.offset=new Vt(0,0),this.repeat=new Vt(1,1),this.center=new Vt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new pe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==sm)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case nh:t.x=t.x-Math.floor(t.x);break;case Ua:t.x=t.x<0?0:1;break;case ih:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case nh:t.y=t.y-Math.floor(t.y);break;case Ua:t.y=t.y<0?0:1;break;case ih:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}kn.DEFAULT_IMAGE=null;kn.DEFAULT_MAPPING=sm;kn.DEFAULT_ANISOTROPY=1;class nn{constructor(t=0,e=0,i=0,a=1){nn.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=a}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,a){return this.x=t,this.y=e,this.z=i,this.w=a,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*a+o[12]*s,this.y=o[1]*e+o[5]*i+o[9]*a+o[13]*s,this.z=o[2]*e+o[6]*i+o[10]*a+o[14]*s,this.w=o[3]*e+o[7]*i+o[11]*a+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,a,s;const c=t.elements,l=c[0],d=c[4],u=c[8],h=c[1],f=c[5],m=c[9],v=c[2],g=c[6],p=c[10];if(Math.abs(d-h)<.01&&Math.abs(u-v)<.01&&Math.abs(m-g)<.01){if(Math.abs(d+h)<.1&&Math.abs(u+v)<.1&&Math.abs(m+g)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(l+1)/2,M=(f+1)/2,S=(p+1)/2,w=(d+h)/4,E=(u+v)/4,T=(m+g)/4;return x>M&&x>S?x<.01?(i=0,a=.707106781,s=.707106781):(i=Math.sqrt(x),a=w/i,s=E/i):M>S?M<.01?(i=.707106781,a=0,s=.707106781):(a=Math.sqrt(M),i=w/a,s=T/a):S<.01?(i=.707106781,a=.707106781,s=0):(s=Math.sqrt(S),i=E/s,a=T/s),this.set(i,a,s,e),this}let _=Math.sqrt((g-m)*(g-m)+(u-v)*(u-v)+(h-d)*(h-d));return Math.abs(_)<.001&&(_=1),this.x=(g-m)/_,this.y=(u-v)/_,this.z=(h-d)/_,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Qb extends Os{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new nn(0,0,t,e),this.scissorTest=!1,this.viewport=new nn(0,0,t,e);const a={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ei,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new kn(a,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let r=0;r<o;r++)this.textures[r]=s.clone(),this.textures[r].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let a=0,s=this.textures.length;a<s;a++)this.textures[a].image.width=t,this.textures[a].image.height=e,this.textures[a].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,a=t.textures.length;i<a;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new vm(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ga extends Qb{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class ym extends kn{constructor(t=null,e=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=ei,this.minFilter=ei,this.wrapR=Ua,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class t1 extends kn{constructor(t=null,e=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=ei,this.minFilter=ei,this.wrapR=Ua,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ua{constructor(t=0,e=0,i=0,a=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=a}static slerpFlat(t,e,i,a,s,o,r){let c=i[a+0],l=i[a+1],d=i[a+2],u=i[a+3];const h=s[o+0],f=s[o+1],m=s[o+2],v=s[o+3];if(r===0){t[e+0]=c,t[e+1]=l,t[e+2]=d,t[e+3]=u;return}if(r===1){t[e+0]=h,t[e+1]=f,t[e+2]=m,t[e+3]=v;return}if(u!==v||c!==h||l!==f||d!==m){let g=1-r;const p=c*h+l*f+d*m+u*v,_=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const S=Math.sqrt(x),w=Math.atan2(S,p*_);g=Math.sin(g*w)/S,r=Math.sin(r*w)/S}const M=r*_;if(c=c*g+h*M,l=l*g+f*M,d=d*g+m*M,u=u*g+v*M,g===1-r){const S=1/Math.sqrt(c*c+l*l+d*d+u*u);c*=S,l*=S,d*=S,u*=S}}t[e]=c,t[e+1]=l,t[e+2]=d,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,a,s,o){const r=i[a],c=i[a+1],l=i[a+2],d=i[a+3],u=s[o],h=s[o+1],f=s[o+2],m=s[o+3];return t[e]=r*m+d*u+c*f-l*h,t[e+1]=c*m+d*h+l*u-r*f,t[e+2]=l*m+d*f+r*h-c*u,t[e+3]=d*m-r*u-c*h-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,a){return this._x=t,this._y=e,this._z=i,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,a=t._y,s=t._z,o=t._order,r=Math.cos,c=Math.sin,l=r(i/2),d=r(a/2),u=r(s/2),h=c(i/2),f=c(a/2),m=c(s/2);switch(o){case"XYZ":this._x=h*d*u+l*f*m,this._y=l*f*u-h*d*m,this._z=l*d*m+h*f*u,this._w=l*d*u-h*f*m;break;case"YXZ":this._x=h*d*u+l*f*m,this._y=l*f*u-h*d*m,this._z=l*d*m-h*f*u,this._w=l*d*u+h*f*m;break;case"ZXY":this._x=h*d*u-l*f*m,this._y=l*f*u+h*d*m,this._z=l*d*m+h*f*u,this._w=l*d*u-h*f*m;break;case"ZYX":this._x=h*d*u-l*f*m,this._y=l*f*u+h*d*m,this._z=l*d*m-h*f*u,this._w=l*d*u+h*f*m;break;case"YZX":this._x=h*d*u+l*f*m,this._y=l*f*u+h*d*m,this._z=l*d*m-h*f*u,this._w=l*d*u-h*f*m;break;case"XZY":this._x=h*d*u-l*f*m,this._y=l*f*u-h*d*m,this._z=l*d*m+h*f*u,this._w=l*d*u+h*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,a=Math.sin(i);return this._x=t.x*a,this._y=t.y*a,this._z=t.z*a,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],a=e[4],s=e[8],o=e[1],r=e[5],c=e[9],l=e[2],d=e[6],u=e[10],h=i+r+u;if(h>0){const f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(d-c)*f,this._y=(s-l)*f,this._z=(o-a)*f}else if(i>r&&i>u){const f=2*Math.sqrt(1+i-r-u);this._w=(d-c)/f,this._x=.25*f,this._y=(a+o)/f,this._z=(s+l)/f}else if(r>u){const f=2*Math.sqrt(1+r-i-u);this._w=(s-l)/f,this._x=(a+o)/f,this._y=.25*f,this._z=(c+d)/f}else{const f=2*Math.sqrt(1+u-i-r);this._w=(o-a)/f,this._x=(s+l)/f,this._y=(c+d)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(En(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const a=Math.min(1,e/i);return this.slerp(t,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,a=t._y,s=t._z,o=t._w,r=e._x,c=e._y,l=e._z,d=e._w;return this._x=i*d+o*r+a*l-s*c,this._y=a*d+o*c+s*r-i*l,this._z=s*d+o*l+i*c-a*r,this._w=o*d-i*r-a*c-s*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,a=this._y,s=this._z,o=this._w;let r=o*t._w+i*t._x+a*t._y+s*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=o,this._x=i,this._y=a,this._z=s,this;const c=1-r*r;if(c<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*i+e*this._x,this._y=f*a+e*this._y,this._z=f*s+e*this._z,this.normalize(),this}const l=Math.sqrt(c),d=Math.atan2(l,r),u=Math.sin((1-e)*d)/l,h=Math.sin(e*d)/l;return this._w=o*u+this._w*h,this._x=i*u+this._x*h,this._y=a*u+this._y*h,this._z=s*u+this._z*h,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),a=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(a*Math.sin(t),a*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class W{constructor(t=0,e=0,i=0){W.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(ju.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(ju.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*a,this.y=s[1]*e+s[4]*i+s[7]*a,this.z=s[2]*e+s[5]*i+s[8]*a,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=t.elements,o=1/(s[3]*e+s[7]*i+s[11]*a+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*a+s[12])*o,this.y=(s[1]*e+s[5]*i+s[9]*a+s[13])*o,this.z=(s[2]*e+s[6]*i+s[10]*a+s[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,a=this.z,s=t.x,o=t.y,r=t.z,c=t.w,l=2*(o*a-r*i),d=2*(r*e-s*a),u=2*(s*i-o*e);return this.x=e+c*l+o*u-r*d,this.y=i+c*d+r*l-s*u,this.z=a+c*u+s*d-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*a,this.y=s[1]*e+s[5]*i+s[9]*a,this.z=s[2]*e+s[6]*i+s[10]*a,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,a=t.y,s=t.z,o=e.x,r=e.y,c=e.z;return this.x=a*c-s*r,this.y=s*o-i*c,this.z=i*r-a*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Yc.copy(this).projectOnVector(t),this.sub(Yc)}reflect(t){return this.sub(Yc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(En(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,a=this.z-t.z;return e*e+i*i+a*a}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const a=Math.sin(e)*t;return this.x=a*Math.sin(i),this.y=Math.cos(e)*t,this.z=a*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),a=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=a,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Yc=new W,ju=new ua;class Va{constructor(t=new W(1/0,1/0,1/0),e=new W(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(ui.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(ui.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=ui.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,r=s.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,ui):ui.fromBufferAttribute(s,o),ui.applyMatrix4(t.matrixWorld),this.expandByPoint(ui);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ko.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ko.copy(i.boundingBox)),Ko.applyMatrix4(t.matrixWorld),this.union(Ko)}const a=t.children;for(let s=0,o=a.length;s<o;s++)this.expandByObject(a[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,ui),ui.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(eo),Jo.subVectors(this.max,eo),ns.subVectors(t.a,eo),is.subVectors(t.b,eo),as.subVectors(t.c,eo),Ji.subVectors(is,ns),Qi.subVectors(as,is),ba.subVectors(ns,as);let e=[0,-Ji.z,Ji.y,0,-Qi.z,Qi.y,0,-ba.z,ba.y,Ji.z,0,-Ji.x,Qi.z,0,-Qi.x,ba.z,0,-ba.x,-Ji.y,Ji.x,0,-Qi.y,Qi.x,0,-ba.y,ba.x,0];return!$c(e,ns,is,as,Jo)||(e=[1,0,0,0,1,0,0,0,1],!$c(e,ns,is,as,Jo))?!1:(Qo.crossVectors(Ji,Qi),e=[Qo.x,Qo.y,Qo.z],$c(e,ns,is,as,Jo))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ui).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ui).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(zi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),zi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),zi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),zi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),zi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),zi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),zi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),zi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(zi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const zi=[new W,new W,new W,new W,new W,new W,new W,new W],ui=new W,Ko=new Va,ns=new W,is=new W,as=new W,Ji=new W,Qi=new W,ba=new W,eo=new W,Jo=new W,Qo=new W,Sa=new W;function $c(n,t,e,i,a){for(let s=0,o=n.length-3;s<=o;s+=3){Sa.fromArray(n,s);const r=a.x*Math.abs(Sa.x)+a.y*Math.abs(Sa.y)+a.z*Math.abs(Sa.z),c=t.dot(Sa),l=e.dot(Sa),d=i.dot(Sa);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>r)return!1}return!0}const e1=new Va,no=new W,Zc=new W;class Bs{constructor(t=new W,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):e1.setFromPoints(t).getCenter(i);let a=0;for(let s=0,o=t.length;s<o;s++)a=Math.max(a,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(a),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;no.subVectors(t,this.center);const e=no.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),a=(i-this.radius)*.5;this.center.addScaledVector(no,a/i),this.radius+=a}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Zc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(no.copy(t.center).add(Zc)),this.expandByPoint(no.copy(t.center).sub(Zc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Fi=new W,jc=new W,tr=new W,ta=new W,qc=new W,er=new W,Kc=new W;class od{constructor(t=new W,e=new W(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Fi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Fi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Fi.copy(this.origin).addScaledVector(this.direction,e),Fi.distanceToSquared(t))}distanceSqToSegment(t,e,i,a){jc.copy(t).add(e).multiplyScalar(.5),tr.copy(e).sub(t).normalize(),ta.copy(this.origin).sub(jc);const s=t.distanceTo(e)*.5,o=-this.direction.dot(tr),r=ta.dot(this.direction),c=-ta.dot(tr),l=ta.lengthSq(),d=Math.abs(1-o*o);let u,h,f,m;if(d>0)if(u=o*c-r,h=o*r-c,m=s*d,u>=0)if(h>=-m)if(h<=m){const v=1/d;u*=v,h*=v,f=u*(u+o*h+2*r)+h*(o*u+h+2*c)+l}else h=s,u=Math.max(0,-(o*h+r)),f=-u*u+h*(h+2*c)+l;else h=-s,u=Math.max(0,-(o*h+r)),f=-u*u+h*(h+2*c)+l;else h<=-m?(u=Math.max(0,-(-o*s+r)),h=u>0?-s:Math.min(Math.max(-s,-c),s),f=-u*u+h*(h+2*c)+l):h<=m?(u=0,h=Math.min(Math.max(-s,-c),s),f=h*(h+2*c)+l):(u=Math.max(0,-(o*s+r)),h=u>0?s:Math.min(Math.max(-s,-c),s),f=-u*u+h*(h+2*c)+l);else h=o>0?-s:s,u=Math.max(0,-(o*h+r)),f=-u*u+h*(h+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,u),a&&a.copy(jc).addScaledVector(tr,h),f}intersectSphere(t,e){Fi.subVectors(t.center,this.origin);const i=Fi.dot(this.direction),a=Fi.dot(Fi)-i*i,s=t.radius*t.radius;if(a>s)return null;const o=Math.sqrt(s-a),r=i-o,c=i+o;return c<0?null:r<0?this.at(c,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,a,s,o,r,c;const l=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,h=this.origin;return l>=0?(i=(t.min.x-h.x)*l,a=(t.max.x-h.x)*l):(i=(t.max.x-h.x)*l,a=(t.min.x-h.x)*l),d>=0?(s=(t.min.y-h.y)*d,o=(t.max.y-h.y)*d):(s=(t.max.y-h.y)*d,o=(t.min.y-h.y)*d),i>o||s>a||((s>i||isNaN(i))&&(i=s),(o<a||isNaN(a))&&(a=o),u>=0?(r=(t.min.z-h.z)*u,c=(t.max.z-h.z)*u):(r=(t.max.z-h.z)*u,c=(t.min.z-h.z)*u),i>c||r>a)||((r>i||i!==i)&&(i=r),(c<a||a!==a)&&(a=c),a<0)?null:this.at(i>=0?i:a,e)}intersectsBox(t){return this.intersectBox(t,Fi)!==null}intersectTriangle(t,e,i,a,s){qc.subVectors(e,t),er.subVectors(i,t),Kc.crossVectors(qc,er);let o=this.direction.dot(Kc),r;if(o>0){if(a)return null;r=1}else if(o<0)r=-1,o=-o;else return null;ta.subVectors(this.origin,t);const c=r*this.direction.dot(er.crossVectors(ta,er));if(c<0)return null;const l=r*this.direction.dot(qc.cross(ta));if(l<0||c+l>o)return null;const d=-r*ta.dot(Kc);return d<0?null:this.at(d/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ae{constructor(t,e,i,a,s,o,r,c,l,d,u,h,f,m,v,g){Ae.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,c,l,d,u,h,f,m,v,g)}set(t,e,i,a,s,o,r,c,l,d,u,h,f,m,v,g){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=a,p[1]=s,p[5]=o,p[9]=r,p[13]=c,p[2]=l,p[6]=d,p[10]=u,p[14]=h,p[3]=f,p[7]=m,p[11]=v,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ae().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,a=1/ss.setFromMatrixColumn(t,0).length(),s=1/ss.setFromMatrixColumn(t,1).length(),o=1/ss.setFromMatrixColumn(t,2).length();return e[0]=i[0]*a,e[1]=i[1]*a,e[2]=i[2]*a,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,a=t.y,s=t.z,o=Math.cos(i),r=Math.sin(i),c=Math.cos(a),l=Math.sin(a),d=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){const h=o*d,f=o*u,m=r*d,v=r*u;e[0]=c*d,e[4]=-c*u,e[8]=l,e[1]=f+m*l,e[5]=h-v*l,e[9]=-r*c,e[2]=v-h*l,e[6]=m+f*l,e[10]=o*c}else if(t.order==="YXZ"){const h=c*d,f=c*u,m=l*d,v=l*u;e[0]=h+v*r,e[4]=m*r-f,e[8]=o*l,e[1]=o*u,e[5]=o*d,e[9]=-r,e[2]=f*r-m,e[6]=v+h*r,e[10]=o*c}else if(t.order==="ZXY"){const h=c*d,f=c*u,m=l*d,v=l*u;e[0]=h-v*r,e[4]=-o*u,e[8]=m+f*r,e[1]=f+m*r,e[5]=o*d,e[9]=v-h*r,e[2]=-o*l,e[6]=r,e[10]=o*c}else if(t.order==="ZYX"){const h=o*d,f=o*u,m=r*d,v=r*u;e[0]=c*d,e[4]=m*l-f,e[8]=h*l+v,e[1]=c*u,e[5]=v*l+h,e[9]=f*l-m,e[2]=-l,e[6]=r*c,e[10]=o*c}else if(t.order==="YZX"){const h=o*c,f=o*l,m=r*c,v=r*l;e[0]=c*d,e[4]=v-h*u,e[8]=m*u+f,e[1]=u,e[5]=o*d,e[9]=-r*d,e[2]=-l*d,e[6]=f*u+m,e[10]=h-v*u}else if(t.order==="XZY"){const h=o*c,f=o*l,m=r*c,v=r*l;e[0]=c*d,e[4]=-u,e[8]=l*d,e[1]=h*u+v,e[5]=o*d,e[9]=f*u-m,e[2]=m*u-f,e[6]=r*d,e[10]=v*u+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(n1,t,i1)}lookAt(t,e,i){const a=this.elements;return Kn.subVectors(t,e),Kn.lengthSq()===0&&(Kn.z=1),Kn.normalize(),ea.crossVectors(i,Kn),ea.lengthSq()===0&&(Math.abs(i.z)===1?Kn.x+=1e-4:Kn.z+=1e-4,Kn.normalize(),ea.crossVectors(i,Kn)),ea.normalize(),nr.crossVectors(Kn,ea),a[0]=ea.x,a[4]=nr.x,a[8]=Kn.x,a[1]=ea.y,a[5]=nr.y,a[9]=Kn.y,a[2]=ea.z,a[6]=nr.z,a[10]=Kn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[4],c=i[8],l=i[12],d=i[1],u=i[5],h=i[9],f=i[13],m=i[2],v=i[6],g=i[10],p=i[14],_=i[3],x=i[7],M=i[11],S=i[15],w=a[0],E=a[4],T=a[8],b=a[12],y=a[1],C=a[5],I=a[9],R=a[13],U=a[2],L=a[6],k=a[10],B=a[14],G=a[3],$=a[7],at=a[11],mt=a[15];return s[0]=o*w+r*y+c*U+l*G,s[4]=o*E+r*C+c*L+l*$,s[8]=o*T+r*I+c*k+l*at,s[12]=o*b+r*R+c*B+l*mt,s[1]=d*w+u*y+h*U+f*G,s[5]=d*E+u*C+h*L+f*$,s[9]=d*T+u*I+h*k+f*at,s[13]=d*b+u*R+h*B+f*mt,s[2]=m*w+v*y+g*U+p*G,s[6]=m*E+v*C+g*L+p*$,s[10]=m*T+v*I+g*k+p*at,s[14]=m*b+v*R+g*B+p*mt,s[3]=_*w+x*y+M*U+S*G,s[7]=_*E+x*C+M*L+S*$,s[11]=_*T+x*I+M*k+S*at,s[15]=_*b+x*R+M*B+S*mt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],a=t[8],s=t[12],o=t[1],r=t[5],c=t[9],l=t[13],d=t[2],u=t[6],h=t[10],f=t[14],m=t[3],v=t[7],g=t[11],p=t[15];return m*(+s*c*u-a*l*u-s*r*h+i*l*h+a*r*f-i*c*f)+v*(+e*c*f-e*l*h+s*o*h-a*o*f+a*l*d-s*c*d)+g*(+e*l*u-e*r*f-s*o*u+i*o*f+s*r*d-i*l*d)+p*(-a*r*d-e*c*u+e*r*h+a*o*u-i*o*h+i*c*d)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const a=this.elements;return t.isVector3?(a[12]=t.x,a[13]=t.y,a[14]=t.z):(a[12]=t,a[13]=e,a[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],c=t[6],l=t[7],d=t[8],u=t[9],h=t[10],f=t[11],m=t[12],v=t[13],g=t[14],p=t[15],_=u*g*l-v*h*l+v*c*f-r*g*f-u*c*p+r*h*p,x=m*h*l-d*g*l-m*c*f+o*g*f+d*c*p-o*h*p,M=d*v*l-m*u*l+m*r*f-o*v*f-d*r*p+o*u*p,S=m*u*c-d*v*c-m*r*h+o*v*h+d*r*g-o*u*g,w=e*_+i*x+a*M+s*S;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/w;return t[0]=_*E,t[1]=(v*h*s-u*g*s-v*a*f+i*g*f+u*a*p-i*h*p)*E,t[2]=(r*g*s-v*c*s+v*a*l-i*g*l-r*a*p+i*c*p)*E,t[3]=(u*c*s-r*h*s-u*a*l+i*h*l+r*a*f-i*c*f)*E,t[4]=x*E,t[5]=(d*g*s-m*h*s+m*a*f-e*g*f-d*a*p+e*h*p)*E,t[6]=(m*c*s-o*g*s-m*a*l+e*g*l+o*a*p-e*c*p)*E,t[7]=(o*h*s-d*c*s+d*a*l-e*h*l-o*a*f+e*c*f)*E,t[8]=M*E,t[9]=(m*u*s-d*v*s-m*i*f+e*v*f+d*i*p-e*u*p)*E,t[10]=(o*v*s-m*r*s+m*i*l-e*v*l-o*i*p+e*r*p)*E,t[11]=(d*r*s-o*u*s-d*i*l+e*u*l+o*i*f-e*r*f)*E,t[12]=S*E,t[13]=(d*v*a-m*u*a+m*i*h-e*v*h-d*i*g+e*u*g)*E,t[14]=(m*r*a-o*v*a-m*i*c+e*v*c+o*i*g-e*r*g)*E,t[15]=(o*u*a-d*r*a+d*i*c-e*u*c-o*i*h+e*r*h)*E,this}scale(t){const e=this.elements,i=t.x,a=t.y,s=t.z;return e[0]*=i,e[4]*=a,e[8]*=s,e[1]*=i,e[5]*=a,e[9]*=s,e[2]*=i,e[6]*=a,e[10]*=s,e[3]*=i,e[7]*=a,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],a=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,a))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),a=Math.sin(e),s=1-i,o=t.x,r=t.y,c=t.z,l=s*o,d=s*r;return this.set(l*o+i,l*r-a*c,l*c+a*r,0,l*r+a*c,d*r+i,d*c-a*o,0,l*c-a*r,d*c+a*o,s*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,a,s,o){return this.set(1,i,s,0,t,1,o,0,e,a,1,0,0,0,0,1),this}compose(t,e,i){const a=this.elements,s=e._x,o=e._y,r=e._z,c=e._w,l=s+s,d=o+o,u=r+r,h=s*l,f=s*d,m=s*u,v=o*d,g=o*u,p=r*u,_=c*l,x=c*d,M=c*u,S=i.x,w=i.y,E=i.z;return a[0]=(1-(v+p))*S,a[1]=(f+M)*S,a[2]=(m-x)*S,a[3]=0,a[4]=(f-M)*w,a[5]=(1-(h+p))*w,a[6]=(g+_)*w,a[7]=0,a[8]=(m+x)*E,a[9]=(g-_)*E,a[10]=(1-(h+v))*E,a[11]=0,a[12]=t.x,a[13]=t.y,a[14]=t.z,a[15]=1,this}decompose(t,e,i){const a=this.elements;let s=ss.set(a[0],a[1],a[2]).length();const o=ss.set(a[4],a[5],a[6]).length(),r=ss.set(a[8],a[9],a[10]).length();this.determinant()<0&&(s=-s),t.x=a[12],t.y=a[13],t.z=a[14],fi.copy(this);const l=1/s,d=1/o,u=1/r;return fi.elements[0]*=l,fi.elements[1]*=l,fi.elements[2]*=l,fi.elements[4]*=d,fi.elements[5]*=d,fi.elements[6]*=d,fi.elements[8]*=u,fi.elements[9]*=u,fi.elements[10]*=u,e.setFromRotationMatrix(fi),i.x=s,i.y=o,i.z=r,this}makePerspective(t,e,i,a,s,o,r=Wi){const c=this.elements,l=2*s/(e-t),d=2*s/(i-a),u=(e+t)/(e-t),h=(i+a)/(i-a);let f,m;if(r===Wi)f=-(o+s)/(o-s),m=-2*o*s/(o-s);else if(r===Kr)f=-o/(o-s),m=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=h,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,a,s,o,r=Wi){const c=this.elements,l=1/(e-t),d=1/(i-a),u=1/(o-s),h=(e+t)*l,f=(i+a)*d;let m,v;if(r===Wi)m=(o+s)*u,v=-2*u;else if(r===Kr)m=s*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-h,c[1]=0,c[5]=2*d,c[9]=0,c[13]=-f,c[2]=0,c[6]=0,c[10]=v,c[14]=-m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<16;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const ss=new W,fi=new Ae,n1=new W(0,0,0),i1=new W(1,1,1),ea=new W,nr=new W,Kn=new W,qu=new Ae,Ku=new ua;class Pi{constructor(t=0,e=0,i=0,a=Pi.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=a}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,a=this._order){return this._x=t,this._y=e,this._z=i,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const a=t.elements,s=a[0],o=a[4],r=a[8],c=a[1],l=a[5],d=a[9],u=a[2],h=a[6],f=a[10];switch(e){case"XYZ":this._y=Math.asin(En(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-d,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-En(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(r,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(En(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-En(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(En(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(r,f));break;case"XZY":this._z=Math.asin(-En(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(r,s)):(this._x=Math.atan2(-d,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return qu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(qu,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Ku.setFromEuler(this),this.setFromQuaternion(Ku,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Pi.DEFAULT_ORDER="XYZ";class rd{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let a1=0;const Ju=new W,os=new ua,Ui=new Ae,ir=new W,io=new W,s1=new W,o1=new ua,Qu=new W(1,0,0),tf=new W(0,1,0),ef=new W(0,0,1),nf={type:"added"},r1={type:"removed"},rs={type:"childadded",child:null},Jc={type:"childremoved",child:null};class qe extends Os{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:a1++}),this.uuid=Ri(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=qe.DEFAULT_UP.clone();const t=new W,e=new Pi,i=new ua,a=new W(1,1,1);function s(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new Ae},normalMatrix:{value:new pe}}),this.matrix=new Ae,this.matrixWorld=new Ae,this.matrixAutoUpdate=qe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=qe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new rd,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return os.setFromAxisAngle(t,e),this.quaternion.multiply(os),this}rotateOnWorldAxis(t,e){return os.setFromAxisAngle(t,e),this.quaternion.premultiply(os),this}rotateX(t){return this.rotateOnAxis(Qu,t)}rotateY(t){return this.rotateOnAxis(tf,t)}rotateZ(t){return this.rotateOnAxis(ef,t)}translateOnAxis(t,e){return Ju.copy(t).applyQuaternion(this.quaternion),this.position.add(Ju.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Qu,t)}translateY(t){return this.translateOnAxis(tf,t)}translateZ(t){return this.translateOnAxis(ef,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Ui.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?ir.copy(t):ir.set(t,e,i);const a=this.parent;this.updateWorldMatrix(!0,!1),io.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ui.lookAt(io,ir,this.up):Ui.lookAt(ir,io,this.up),this.quaternion.setFromRotationMatrix(Ui),a&&(Ui.extractRotation(a.matrixWorld),os.setFromRotationMatrix(Ui),this.quaternion.premultiply(os.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(nf),rs.child=t,this.dispatchEvent(rs),rs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(r1),Jc.child=t,this.dispatchEvent(Jc),Jc.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Ui.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Ui.multiply(t.parent.matrixWorld)),t.applyMatrix4(Ui),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(nf),rs.child=t,this.dispatchEvent(rs),rs.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,a=this.children.length;i<a;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(io,t,s1),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(io,o1,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function s(r,c){return r[c.uuid]===void 0&&(r[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=s(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const c=r.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){const u=c[l];s(t.shapes,u)}else s(t.shapes,c)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let c=0,l=this.material.length;c<l;c++)r.push(s(t.materials,this.material[c]));a.material=r}else a.material=s(t.materials,this.material);if(this.children.length>0){a.children=[];for(let r=0;r<this.children.length;r++)a.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){a.animations=[];for(let r=0;r<this.animations.length;r++){const c=this.animations[r];a.animations.push(s(t.animations,c))}}if(e){const r=o(t.geometries),c=o(t.materials),l=o(t.textures),d=o(t.images),u=o(t.shapes),h=o(t.skeletons),f=o(t.animations),m=o(t.nodes);r.length>0&&(i.geometries=r),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),d.length>0&&(i.images=d),u.length>0&&(i.shapes=u),h.length>0&&(i.skeletons=h),f.length>0&&(i.animations=f),m.length>0&&(i.nodes=m)}return i.object=a,i;function o(r){const c=[];for(const l in r){const d=r[l];delete d.metadata,c.push(d)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const a=t.children[i];this.add(a.clone())}return this}}qe.DEFAULT_UP=new W(0,1,0);qe.DEFAULT_MATRIX_AUTO_UPDATE=!0;qe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const pi=new W,Ni=new W,Qc=new W,Oi=new W,cs=new W,ls=new W,af=new W,tl=new W,el=new W,nl=new W,il=new nn,al=new nn,sl=new nn;class ti{constructor(t=new W,e=new W,i=new W){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,a){a.subVectors(i,e),pi.subVectors(t,e),a.cross(pi);const s=a.lengthSq();return s>0?a.multiplyScalar(1/Math.sqrt(s)):a.set(0,0,0)}static getBarycoord(t,e,i,a,s){pi.subVectors(a,e),Ni.subVectors(i,e),Qc.subVectors(t,e);const o=pi.dot(pi),r=pi.dot(Ni),c=pi.dot(Qc),l=Ni.dot(Ni),d=Ni.dot(Qc),u=o*l-r*r;if(u===0)return s.set(0,0,0),null;const h=1/u,f=(l*c-r*d)*h,m=(o*d-r*c)*h;return s.set(1-f-m,m,f)}static containsPoint(t,e,i,a){return this.getBarycoord(t,e,i,a,Oi)===null?!1:Oi.x>=0&&Oi.y>=0&&Oi.x+Oi.y<=1}static getInterpolation(t,e,i,a,s,o,r,c){return this.getBarycoord(t,e,i,a,Oi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,Oi.x),c.addScaledVector(o,Oi.y),c.addScaledVector(r,Oi.z),c)}static getInterpolatedAttribute(t,e,i,a,s,o){return il.setScalar(0),al.setScalar(0),sl.setScalar(0),il.fromBufferAttribute(t,e),al.fromBufferAttribute(t,i),sl.fromBufferAttribute(t,a),o.setScalar(0),o.addScaledVector(il,s.x),o.addScaledVector(al,s.y),o.addScaledVector(sl,s.z),o}static isFrontFacing(t,e,i,a){return pi.subVectors(i,e),Ni.subVectors(t,e),pi.cross(Ni).dot(a)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,a){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[a]),this}setFromAttributeAndIndices(t,e,i,a){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,a),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return pi.subVectors(this.c,this.b),Ni.subVectors(this.a,this.b),pi.cross(Ni).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return ti.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return ti.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,a,s){return ti.getInterpolation(t,this.a,this.b,this.c,e,i,a,s)}containsPoint(t){return ti.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return ti.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,a=this.b,s=this.c;let o,r;cs.subVectors(a,i),ls.subVectors(s,i),tl.subVectors(t,i);const c=cs.dot(tl),l=ls.dot(tl);if(c<=0&&l<=0)return e.copy(i);el.subVectors(t,a);const d=cs.dot(el),u=ls.dot(el);if(d>=0&&u<=d)return e.copy(a);const h=c*u-d*l;if(h<=0&&c>=0&&d<=0)return o=c/(c-d),e.copy(i).addScaledVector(cs,o);nl.subVectors(t,s);const f=cs.dot(nl),m=ls.dot(nl);if(m>=0&&f<=m)return e.copy(s);const v=f*l-c*m;if(v<=0&&l>=0&&m<=0)return r=l/(l-m),e.copy(i).addScaledVector(ls,r);const g=d*m-f*u;if(g<=0&&u-d>=0&&f-m>=0)return af.subVectors(s,a),r=(u-d)/(u-d+(f-m)),e.copy(a).addScaledVector(af,r);const p=1/(g+v+h);return o=v*p,r=h*p,e.copy(i).addScaledVector(cs,o).addScaledVector(ls,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Mm={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},na={h:0,s:0,l:0},ar={h:0,s:0,l:0};function ol(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class te{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const a=t;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Bn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Se.toWorkingColorSpace(this,e),this}setRGB(t,e,i,a=Se.workingColorSpace){return this.r=t,this.g=e,this.b=i,Se.toWorkingColorSpace(this,a),this}setHSL(t,e,i,a=Se.workingColorSpace){if(t=sd(t,1),e=En(e,0,1),i=En(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,o=2*i-s;this.r=ol(o,s,t+1/3),this.g=ol(o,s,t),this.b=ol(o,s,t-1/3)}return Se.toWorkingColorSpace(this,a),this}setStyle(t,e=Bn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=a[1],r=a[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=a[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Bn){const i=Mm[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Yi(t.r),this.g=Yi(t.g),this.b=Yi(t.b),this}copyLinearToSRGB(t){return this.r=As(t.r),this.g=As(t.g),this.b=As(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Bn){return Se.fromWorkingColorSpace(Ln.copy(this),t),Math.round(En(Ln.r*255,0,255))*65536+Math.round(En(Ln.g*255,0,255))*256+Math.round(En(Ln.b*255,0,255))}getHexString(t=Bn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Se.workingColorSpace){Se.fromWorkingColorSpace(Ln.copy(this),e);const i=Ln.r,a=Ln.g,s=Ln.b,o=Math.max(i,a,s),r=Math.min(i,a,s);let c,l;const d=(r+o)/2;if(r===o)c=0,l=0;else{const u=o-r;switch(l=d<=.5?u/(o+r):u/(2-o-r),o){case i:c=(a-s)/u+(a<s?6:0);break;case a:c=(s-i)/u+2;break;case s:c=(i-a)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=d,t}getRGB(t,e=Se.workingColorSpace){return Se.fromWorkingColorSpace(Ln.copy(this),e),t.r=Ln.r,t.g=Ln.g,t.b=Ln.b,t}getStyle(t=Bn){Se.fromWorkingColorSpace(Ln.copy(this),t);const e=Ln.r,i=Ln.g,a=Ln.b;return t!==Bn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(a*255)})`}offsetHSL(t,e,i){return this.getHSL(na),this.setHSL(na.h+t,na.s+e,na.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(na),t.getHSL(ar);const i=Mo(na.h,ar.h,e),a=Mo(na.s,ar.s,e),s=Mo(na.l,ar.l,e);return this.setHSL(i,a,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,a=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*a,this.g=s[1]*e+s[4]*i+s[7]*a,this.b=s[2]*e+s[5]*i+s[8]*a,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ln=new te;te.NAMES=Mm;let c1=0;class Wa extends Os{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:c1++}),this.uuid=Ri(),this.name="",this.blending=ws,this.side=pa,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Wl,this.blendDst=Yl,this.blendEquation=za,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new te(0,0,0),this.blendAlpha=0,this.depthFunc=Ds,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ou,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ts,this.stencilZFail=ts,this.stencilZPass=ts,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const a=this[e];if(a===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(i):a&&a.isVector3&&i&&i.isVector3?a.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ws&&(i.blending=this.blending),this.side!==pa&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Wl&&(i.blendSrc=this.blendSrc),this.blendDst!==Yl&&(i.blendDst=this.blendDst),this.blendEquation!==za&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ds&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ou&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ts&&(i.stencilFail=this.stencilFail),this.stencilZFail!==ts&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==ts&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function a(s){const o=[];for(const r in s){const c=s[r];delete c.metadata,o.push(c)}return o}if(e){const s=a(t.textures),o=a(t.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const a=e.length;i=new Array(a);for(let s=0;s!==a;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Mn extends Wa{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new te(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Pi,this.combine=Kh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const rn=new W,sr=new Vt;class _n{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Ch,this.updateRanges=[],this.gpuType=Ti,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let a=0,s=this.itemSize;a<s;a++)this.array[t+a]=e.array[i+a];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)sr.fromBufferAttribute(this,e),sr.applyMatrix3(t),this.setXY(e,sr.x,sr.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)rn.fromBufferAttribute(this,e),rn.applyMatrix3(t),this.setXYZ(e,rn.x,rn.y,rn.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)rn.fromBufferAttribute(this,e),rn.applyMatrix4(t),this.setXYZ(e,rn.x,rn.y,rn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)rn.fromBufferAttribute(this,e),rn.applyNormalMatrix(t),this.setXYZ(e,rn.x,rn.y,rn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)rn.fromBufferAttribute(this,e),rn.transformDirection(t),this.setXYZ(e,rn.x,rn.y,rn.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=mi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=De(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=mi(e,this.array)),e}setX(t,e){return this.normalized&&(e=De(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=mi(e,this.array)),e}setY(t,e){return this.normalized&&(e=De(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=mi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=De(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=mi(e,this.array)),e}setW(t,e){return this.normalized&&(e=De(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=De(e,this.array),i=De(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,a){return t*=this.itemSize,this.normalized&&(e=De(e,this.array),i=De(i,this.array),a=De(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t*=this.itemSize,this.normalized&&(e=De(e,this.array),i=De(i,this.array),a=De(a,this.array),s=De(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Ch&&(t.usage=this.usage),t}}class _m extends _n{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class bm extends _n{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class Re extends _n{constructor(t,e,i){super(new Float32Array(t),e,i)}}let l1=0;const oi=new Ae,rl=new qe,hs=new W,Jn=new Va,ao=new Va,yn=new W;class Je extends Os{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:l1++}),this.uuid=Ri(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(xm(t)?bm:_m)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new pe().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(t),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return oi.makeRotationFromQuaternion(t),this.applyMatrix4(oi),this}rotateX(t){return oi.makeRotationX(t),this.applyMatrix4(oi),this}rotateY(t){return oi.makeRotationY(t),this.applyMatrix4(oi),this}rotateZ(t){return oi.makeRotationZ(t),this.applyMatrix4(oi),this}translate(t,e,i){return oi.makeTranslation(t,e,i),this.applyMatrix4(oi),this}scale(t,e,i){return oi.makeScale(t,e,i),this.applyMatrix4(oi),this}lookAt(t){return rl.lookAt(t),rl.updateMatrix(),this.applyMatrix4(rl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(hs).negate(),this.translate(hs.x,hs.y,hs.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let a=0,s=t.length;a<s;a++){const o=t[a];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Re(i,3))}else{for(let i=0,a=e.count;i<a;i++){const s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Va);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new W(-1/0,-1/0,-1/0),new W(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,a=e.length;i<a;i++){const s=e[i];Jn.setFromBufferAttribute(s),this.morphTargetsRelative?(yn.addVectors(this.boundingBox.min,Jn.min),this.boundingBox.expandByPoint(yn),yn.addVectors(this.boundingBox.max,Jn.max),this.boundingBox.expandByPoint(yn)):(this.boundingBox.expandByPoint(Jn.min),this.boundingBox.expandByPoint(Jn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Bs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new W,1/0);return}if(t){const i=this.boundingSphere.center;if(Jn.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const r=e[s];ao.setFromBufferAttribute(r),this.morphTargetsRelative?(yn.addVectors(Jn.min,ao.min),Jn.expandByPoint(yn),yn.addVectors(Jn.max,ao.max),Jn.expandByPoint(yn)):(Jn.expandByPoint(ao.min),Jn.expandByPoint(ao.max))}Jn.getCenter(i);let a=0;for(let s=0,o=t.count;s<o;s++)yn.fromBufferAttribute(t,s),a=Math.max(a,i.distanceToSquared(yn));if(e)for(let s=0,o=e.length;s<o;s++){const r=e[s],c=this.morphTargetsRelative;for(let l=0,d=r.count;l<d;l++)yn.fromBufferAttribute(r,l),c&&(hs.fromBufferAttribute(t,l),yn.add(hs)),a=Math.max(a,i.distanceToSquared(yn))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,a=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new _n(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),r=[],c=[];for(let T=0;T<i.count;T++)r[T]=new W,c[T]=new W;const l=new W,d=new W,u=new W,h=new Vt,f=new Vt,m=new Vt,v=new W,g=new W;function p(T,b,y){l.fromBufferAttribute(i,T),d.fromBufferAttribute(i,b),u.fromBufferAttribute(i,y),h.fromBufferAttribute(s,T),f.fromBufferAttribute(s,b),m.fromBufferAttribute(s,y),d.sub(l),u.sub(l),f.sub(h),m.sub(h);const C=1/(f.x*m.y-m.x*f.y);isFinite(C)&&(v.copy(d).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(C),g.copy(u).multiplyScalar(f.x).addScaledVector(d,-m.x).multiplyScalar(C),r[T].add(v),r[b].add(v),r[y].add(v),c[T].add(g),c[b].add(g),c[y].add(g))}let _=this.groups;_.length===0&&(_=[{start:0,count:t.count}]);for(let T=0,b=_.length;T<b;++T){const y=_[T],C=y.start,I=y.count;for(let R=C,U=C+I;R<U;R+=3)p(t.getX(R+0),t.getX(R+1),t.getX(R+2))}const x=new W,M=new W,S=new W,w=new W;function E(T){S.fromBufferAttribute(a,T),w.copy(S);const b=r[T];x.copy(b),x.sub(S.multiplyScalar(S.dot(b))).normalize(),M.crossVectors(w,b);const C=M.dot(c[T])<0?-1:1;o.setXYZW(T,x.x,x.y,x.z,C)}for(let T=0,b=_.length;T<b;++T){const y=_[T],C=y.start,I=y.count;for(let R=C,U=C+I;R<U;R+=3)E(t.getX(R+0)),E(t.getX(R+1)),E(t.getX(R+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new _n(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let h=0,f=i.count;h<f;h++)i.setXYZ(h,0,0,0);const a=new W,s=new W,o=new W,r=new W,c=new W,l=new W,d=new W,u=new W;if(t)for(let h=0,f=t.count;h<f;h+=3){const m=t.getX(h+0),v=t.getX(h+1),g=t.getX(h+2);a.fromBufferAttribute(e,m),s.fromBufferAttribute(e,v),o.fromBufferAttribute(e,g),d.subVectors(o,s),u.subVectors(a,s),d.cross(u),r.fromBufferAttribute(i,m),c.fromBufferAttribute(i,v),l.fromBufferAttribute(i,g),r.add(d),c.add(d),l.add(d),i.setXYZ(m,r.x,r.y,r.z),i.setXYZ(v,c.x,c.y,c.z),i.setXYZ(g,l.x,l.y,l.z)}else for(let h=0,f=e.count;h<f;h+=3)a.fromBufferAttribute(e,h+0),s.fromBufferAttribute(e,h+1),o.fromBufferAttribute(e,h+2),d.subVectors(o,s),u.subVectors(a,s),d.cross(u),i.setXYZ(h+0,d.x,d.y,d.z),i.setXYZ(h+1,d.x,d.y,d.z),i.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)yn.fromBufferAttribute(t,e),yn.normalize(),t.setXYZ(e,yn.x,yn.y,yn.z)}toNonIndexed(){function t(r,c){const l=r.array,d=r.itemSize,u=r.normalized,h=new l.constructor(c.length*d);let f=0,m=0;for(let v=0,g=c.length;v<g;v++){r.isInterleavedBufferAttribute?f=c[v]*r.data.stride+r.offset:f=c[v]*d;for(let p=0;p<d;p++)h[m++]=l[f++]}return new _n(h,d,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Je,i=this.index.array,a=this.attributes;for(const r in a){const c=a[r],l=t(c,i);e.setAttribute(r,l)}const s=this.morphAttributes;for(const r in s){const c=[],l=s[r];for(let d=0,u=l.length;d<u;d++){const h=l[d],f=t(h,i);c.push(f)}e.morphAttributes[r]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,c=o.length;r<c;r++){const l=o[r];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const a={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],d=[];for(let u=0,h=l.length;u<h;u++){const f=l[u];d.push(f.toJSON(t.data))}d.length>0&&(a[c]=d,s=!0)}s&&(t.data.morphAttributes=a,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const a=t.attributes;for(const l in a){const d=a[l];this.setAttribute(l,d.clone(e))}const s=t.morphAttributes;for(const l in s){const d=[],u=s[l];for(let h=0,f=u.length;h<f;h++)d.push(u[h].clone(e));this.morphAttributes[l]=d}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,d=o.length;l<d;l++){const u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const sf=new Ae,wa=new od,or=new Bs,of=new W,rr=new W,cr=new W,lr=new W,cl=new W,hr=new W,rf=new W,dr=new W;class me extends qe{constructor(t=new Je,e=new Mn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}getVertexPosition(t,e){const i=this.geometry,a=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(a,t);const r=this.morphTargetInfluences;if(s&&r){hr.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const d=r[c],u=s[c];d!==0&&(cl.fromBufferAttribute(u,t),o?hr.addScaledVector(cl,d):hr.addScaledVector(cl.sub(e),d))}e.add(hr)}return e}raycast(t,e){const i=this.geometry,a=this.material,s=this.matrixWorld;a!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),or.copy(i.boundingSphere),or.applyMatrix4(s),wa.copy(t.ray).recast(t.near),!(or.containsPoint(wa.origin)===!1&&(wa.intersectSphere(or,of)===null||wa.origin.distanceToSquared(of)>(t.far-t.near)**2))&&(sf.copy(s).invert(),wa.copy(t.ray).applyMatrix4(sf),!(i.boundingBox!==null&&wa.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,wa)))}_computeIntersections(t,e,i){let a;const s=this.geometry,o=this.material,r=s.index,c=s.attributes.position,l=s.attributes.uv,d=s.attributes.uv1,u=s.attributes.normal,h=s.groups,f=s.drawRange;if(r!==null)if(Array.isArray(o))for(let m=0,v=h.length;m<v;m++){const g=h[m],p=o[g.materialIndex],_=Math.max(g.start,f.start),x=Math.min(r.count,Math.min(g.start+g.count,f.start+f.count));for(let M=_,S=x;M<S;M+=3){const w=r.getX(M),E=r.getX(M+1),T=r.getX(M+2);a=ur(this,p,t,i,l,d,u,w,E,T),a&&(a.faceIndex=Math.floor(M/3),a.face.materialIndex=g.materialIndex,e.push(a))}}else{const m=Math.max(0,f.start),v=Math.min(r.count,f.start+f.count);for(let g=m,p=v;g<p;g+=3){const _=r.getX(g),x=r.getX(g+1),M=r.getX(g+2);a=ur(this,o,t,i,l,d,u,_,x,M),a&&(a.faceIndex=Math.floor(g/3),e.push(a))}}else if(c!==void 0)if(Array.isArray(o))for(let m=0,v=h.length;m<v;m++){const g=h[m],p=o[g.materialIndex],_=Math.max(g.start,f.start),x=Math.min(c.count,Math.min(g.start+g.count,f.start+f.count));for(let M=_,S=x;M<S;M+=3){const w=M,E=M+1,T=M+2;a=ur(this,p,t,i,l,d,u,w,E,T),a&&(a.faceIndex=Math.floor(M/3),a.face.materialIndex=g.materialIndex,e.push(a))}}else{const m=Math.max(0,f.start),v=Math.min(c.count,f.start+f.count);for(let g=m,p=v;g<p;g+=3){const _=g,x=g+1,M=g+2;a=ur(this,o,t,i,l,d,u,_,x,M),a&&(a.faceIndex=Math.floor(g/3),e.push(a))}}}}function h1(n,t,e,i,a,s,o,r){let c;if(t.side===Wn?c=i.intersectTriangle(o,s,a,!0,r):c=i.intersectTriangle(a,s,o,t.side===pa,r),c===null)return null;dr.copy(r),dr.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(dr);return l<e.near||l>e.far?null:{distance:l,point:dr.clone(),object:n}}function ur(n,t,e,i,a,s,o,r,c,l){n.getVertexPosition(r,rr),n.getVertexPosition(c,cr),n.getVertexPosition(l,lr);const d=h1(n,t,e,i,rr,cr,lr,rf);if(d){const u=new W;ti.getBarycoord(rf,rr,cr,lr,u),a&&(d.uv=ti.getInterpolatedAttribute(a,r,c,l,u,new Vt)),s&&(d.uv1=ti.getInterpolatedAttribute(s,r,c,l,u,new Vt)),o&&(d.normal=ti.getInterpolatedAttribute(o,r,c,l,u,new W),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const h={a:r,b:c,c:l,normal:new W,materialIndex:0};ti.getNormal(rr,cr,lr,h.normal),d.face=h,d.barycoord=u}return d}class ni extends Je{constructor(t=1,e=1,i=1,a=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:a,heightSegments:s,depthSegments:o};const r=this;a=Math.floor(a),s=Math.floor(s),o=Math.floor(o);const c=[],l=[],d=[],u=[];let h=0,f=0;m("z","y","x",-1,-1,i,e,t,o,s,0),m("z","y","x",1,-1,i,e,-t,o,s,1),m("x","z","y",1,1,t,i,e,a,o,2),m("x","z","y",1,-1,t,i,-e,a,o,3),m("x","y","z",1,-1,t,e,i,a,s,4),m("x","y","z",-1,-1,t,e,-i,a,s,5),this.setIndex(c),this.setAttribute("position",new Re(l,3)),this.setAttribute("normal",new Re(d,3)),this.setAttribute("uv",new Re(u,2));function m(v,g,p,_,x,M,S,w,E,T,b){const y=M/E,C=S/T,I=M/2,R=S/2,U=w/2,L=E+1,k=T+1;let B=0,G=0;const $=new W;for(let at=0;at<k;at++){const mt=at*C-R;for(let ft=0;ft<L;ft++){const Dt=ft*y-I;$[v]=Dt*_,$[g]=mt*x,$[p]=U,l.push($.x,$.y,$.z),$[v]=0,$[g]=0,$[p]=w>0?1:-1,d.push($.x,$.y,$.z),u.push(ft/E),u.push(1-at/T),B+=1}}for(let at=0;at<T;at++)for(let mt=0;mt<E;mt++){const ft=h+mt+L*at,Dt=h+mt+L*(at+1),j=h+(mt+1)+L*(at+1),F=h+(mt+1)+L*at;c.push(ft,Dt,F),c.push(Dt,j,F),G+=6}r.addGroup(f,G,b),f+=G,h+=B}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ni(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Us(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const a=n[e][i];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=a.clone():Array.isArray(a)?t[e][i]=a.slice():t[e][i]=a}}return t}function On(n){const t={};for(let e=0;e<n.length;e++){const i=Us(n[e]);for(const a in i)t[a]=i[a]}return t}function d1(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Sm(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Se.workingColorSpace}const u1={clone:Us,merge:On};var f1=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,p1=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ma extends Wa{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=f1,this.fragmentShader=p1,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Us(t.uniforms),this.uniformsGroups=d1(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const a in this.uniforms){const o=this.uniforms[a].value;o&&o.isTexture?e.uniforms[a]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[a]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[a]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[a]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[a]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[a]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[a]={type:"m4",value:o.toArray()}:e.uniforms[a]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const a in this.extensions)this.extensions[a]===!0&&(i[a]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class wm extends qe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ae,this.projectionMatrix=new Ae,this.projectionMatrixInverse=new Ae,this.coordinateSystem=Wi}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ia=new W,cf=new Vt,lf=new Vt;class ri extends wm{constructor(t=50,e=1,i=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=a,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Do*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ts*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Do*2*Math.atan(Math.tan(Ts*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){ia.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ia.x,ia.y).multiplyScalar(-t/ia.z),ia.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ia.x,ia.y).multiplyScalar(-t/ia.z)}getViewSize(t,e){return this.getViewBounds(t,cf,lf),e.subVectors(lf,cf)}setViewOffset(t,e,i,a,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ts*.5*this.fov)/this.zoom,i=2*e,a=this.aspect*i,s=-.5*a;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;s+=o.offsetX*a/c,e-=o.offsetY*i/l,a*=o.width/c,i*=o.height/l}const r=this.filmOffset;r!==0&&(s+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+a,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const ds=-90,us=1;class m1 extends qe{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new ri(ds,us,t,e);a.layers=this.layers,this.add(a);const s=new ri(ds,us,t,e);s.layers=this.layers,this.add(s);const o=new ri(ds,us,t,e);o.layers=this.layers,this.add(o);const r=new ri(ds,us,t,e);r.layers=this.layers,this.add(r);const c=new ri(ds,us,t,e);c.layers=this.layers,this.add(c);const l=new ri(ds,us,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,a,s,o,r,c]=e;for(const l of e)this.remove(l);if(t===Wi)i.up.set(0,1,0),i.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Kr)i.up.set(0,-1,0),i.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:a}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,r,c,l,d]=this.children,u=t.getRenderTarget(),h=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,a),t.render(e,s),t.setRenderTarget(i,1,a),t.render(e,o),t.setRenderTarget(i,2,a),t.render(e,r),t.setRenderTarget(i,3,a),t.render(e,c),t.setRenderTarget(i,4,a),t.render(e,l),i.texture.generateMipmaps=v,t.setRenderTarget(i,5,a),t.render(e,d),t.setRenderTarget(u,h,f),t.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class Em extends kn{constructor(t,e,i,a,s,o,r,c,l,d){t=t!==void 0?t:[],e=e!==void 0?e:ks,super(t,e,i,a,s,o,r,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class g1 extends Ga{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},a=[i,i,i,i,i,i];this.texture=new Em(a,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Ei}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},a=new ni(5,5,5),s=new ma({name:"CubemapFromEquirect",uniforms:Us(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Wn,blending:ha});s.uniforms.tEquirect.value=e;const o=new me(a,s),r=e.minFilter;return e.minFilter===Na&&(e.minFilter=Ei),new m1(1,10,this).update(t,o),e.minFilter=r,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,a){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,a);t.setRenderTarget(s)}}const ll=new W,x1=new W,v1=new pe;class Da{constructor(t=new W(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,a){return this.normal.set(t,e,i),this.constant=a,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const a=ll.subVectors(i,e).cross(x1.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(a,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(ll),a=this.normal.dot(i);if(a===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/a;return s<0||s>1?null:e.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||v1.getNormalMatrix(t),a=this.coplanarPoint(ll).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-a.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ea=new Bs,fr=new W;class cd{constructor(t=new Da,e=new Da,i=new Da,a=new Da,s=new Da,o=new Da){this.planes=[t,e,i,a,s,o]}set(t,e,i,a,s,o){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(a),r[4].copy(s),r[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Wi){const i=this.planes,a=t.elements,s=a[0],o=a[1],r=a[2],c=a[3],l=a[4],d=a[5],u=a[6],h=a[7],f=a[8],m=a[9],v=a[10],g=a[11],p=a[12],_=a[13],x=a[14],M=a[15];if(i[0].setComponents(c-s,h-l,g-f,M-p).normalize(),i[1].setComponents(c+s,h+l,g+f,M+p).normalize(),i[2].setComponents(c+o,h+d,g+m,M+_).normalize(),i[3].setComponents(c-o,h-d,g-m,M-_).normalize(),i[4].setComponents(c-r,h-u,g-v,M-x).normalize(),e===Wi)i[5].setComponents(c+r,h+u,g+v,M+x).normalize();else if(e===Kr)i[5].setComponents(r,u,v,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ea.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ea.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ea)}intersectsSprite(t){return Ea.center.set(0,0,0),Ea.radius=.7071067811865476,Ea.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ea)}intersectsSphere(t){const e=this.planes,i=t.center,a=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<a)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const a=e[i];if(fr.x=a.normal.x>0?t.max.x:t.min.x,fr.y=a.normal.y>0?t.max.y:t.min.y,fr.z=a.normal.z>0?t.max.z:t.min.z,a.distanceToPoint(fr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Tm(){let n=null,t=!1,e=null,i=null;function a(s,o){e(s,o),i=n.requestAnimationFrame(a)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(a),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){n=s}}}function y1(n){const t=new WeakMap;function e(r,c){const l=r.array,d=r.usage,u=l.byteLength,h=n.createBuffer();n.bindBuffer(c,h),n.bufferData(c,l,d),r.onUploadCallback();let f;if(l instanceof Float32Array)f=n.FLOAT;else if(l instanceof Uint16Array)r.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=n.SHORT;else if(l instanceof Uint32Array)f=n.UNSIGNED_INT;else if(l instanceof Int32Array)f=n.INT;else if(l instanceof Int8Array)f=n.BYTE;else if(l instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:h,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:r.version,size:u}}function i(r,c,l){const d=c.array,u=c.updateRanges;if(n.bindBuffer(l,r),u.length===0)n.bufferSubData(l,0,d);else{u.sort((f,m)=>f.start-m.start);let h=0;for(let f=1;f<u.length;f++){const m=u[h],v=u[f];v.start<=m.start+m.count+1?m.count=Math.max(m.count,v.start+v.count-m.start):(++h,u[h]=v)}u.length=h+1;for(let f=0,m=u.length;f<m;f++){const v=u[f];n.bufferSubData(l,v.start*d.BYTES_PER_ELEMENT,d,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function a(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function s(r){r.isInterleavedBufferAttribute&&(r=r.data);const c=t.get(r);c&&(n.deleteBuffer(c.buffer),t.delete(r))}function o(r,c){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const d=t.get(r);(!d||d.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const l=t.get(r);if(l===void 0)t.set(r,e(r,c));else if(l.version<r.version){if(l.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,r,c),l.version=r.version}}return{get:a,remove:s,update:o}}class Vn extends Je{constructor(t=1,e=1,i=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:a};const s=t/2,o=e/2,r=Math.floor(i),c=Math.floor(a),l=r+1,d=c+1,u=t/r,h=e/c,f=[],m=[],v=[],g=[];for(let p=0;p<d;p++){const _=p*h-o;for(let x=0;x<l;x++){const M=x*u-s;m.push(M,-_,0),v.push(0,0,1),g.push(x/r),g.push(1-p/c)}}for(let p=0;p<c;p++)for(let _=0;_<r;_++){const x=_+l*p,M=_+l*(p+1),S=_+1+l*(p+1),w=_+1+l*p;f.push(x,M,w),f.push(M,S,w)}this.setIndex(f),this.setAttribute("position",new Re(m,3)),this.setAttribute("normal",new Re(v,3)),this.setAttribute("uv",new Re(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Vn(t.width,t.height,t.widthSegments,t.heightSegments)}}var M1=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,_1=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,b1=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,S1=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,w1=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,E1=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,T1=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,A1=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,R1=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,P1=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,C1=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,L1=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,D1=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,k1=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,I1=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,z1=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,F1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,U1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,N1=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,O1=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,B1=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,H1=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,G1=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,X1=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,V1=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,W1=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Y1=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,$1=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Z1=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,j1=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,q1="gl_FragColor = linearToOutputTexel( gl_FragColor );",K1=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,J1=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Q1=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,tS=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,eS=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,nS=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,iS=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,aS=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,sS=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,oS=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,rS=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,cS=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lS=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,hS=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,dS=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,uS=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,fS=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,pS=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,mS=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,gS=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,xS=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,vS=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,yS=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,MS=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,_S=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,bS=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,SS=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wS=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ES=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,TS=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,AS=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,RS=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,PS=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,CS=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,LS=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,DS=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,kS=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,IS=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,zS=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,FS=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,US=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,NS=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,OS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,BS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,HS=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,GS=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,XS=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,VS=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,WS=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,YS=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,$S=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ZS=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,jS=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,qS=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,KS=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,JS=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,QS=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,tw=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ew=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,nw=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,iw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,aw=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,sw=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ow=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,rw=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,cw=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,lw=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,hw=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,dw=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,uw=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,fw=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,pw=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,mw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,gw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,xw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,vw=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const yw=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Mw=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_w=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,bw=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Sw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ww=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ew=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Tw=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Aw=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Rw=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Pw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Cw=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Lw=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Dw=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,kw=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Iw=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zw=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Fw=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Uw=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Nw=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ow=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Bw=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Hw=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Gw=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Xw=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Vw=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ww=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Yw=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$w=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Zw=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,jw=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,qw=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Kw=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Jw=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ge={alphahash_fragment:M1,alphahash_pars_fragment:_1,alphamap_fragment:b1,alphamap_pars_fragment:S1,alphatest_fragment:w1,alphatest_pars_fragment:E1,aomap_fragment:T1,aomap_pars_fragment:A1,batching_pars_vertex:R1,batching_vertex:P1,begin_vertex:C1,beginnormal_vertex:L1,bsdfs:D1,iridescence_fragment:k1,bumpmap_pars_fragment:I1,clipping_planes_fragment:z1,clipping_planes_pars_fragment:F1,clipping_planes_pars_vertex:U1,clipping_planes_vertex:N1,color_fragment:O1,color_pars_fragment:B1,color_pars_vertex:H1,color_vertex:G1,common:X1,cube_uv_reflection_fragment:V1,defaultnormal_vertex:W1,displacementmap_pars_vertex:Y1,displacementmap_vertex:$1,emissivemap_fragment:Z1,emissivemap_pars_fragment:j1,colorspace_fragment:q1,colorspace_pars_fragment:K1,envmap_fragment:J1,envmap_common_pars_fragment:Q1,envmap_pars_fragment:tS,envmap_pars_vertex:eS,envmap_physical_pars_fragment:uS,envmap_vertex:nS,fog_vertex:iS,fog_pars_vertex:aS,fog_fragment:sS,fog_pars_fragment:oS,gradientmap_pars_fragment:rS,lightmap_pars_fragment:cS,lights_lambert_fragment:lS,lights_lambert_pars_fragment:hS,lights_pars_begin:dS,lights_toon_fragment:fS,lights_toon_pars_fragment:pS,lights_phong_fragment:mS,lights_phong_pars_fragment:gS,lights_physical_fragment:xS,lights_physical_pars_fragment:vS,lights_fragment_begin:yS,lights_fragment_maps:MS,lights_fragment_end:_S,logdepthbuf_fragment:bS,logdepthbuf_pars_fragment:SS,logdepthbuf_pars_vertex:wS,logdepthbuf_vertex:ES,map_fragment:TS,map_pars_fragment:AS,map_particle_fragment:RS,map_particle_pars_fragment:PS,metalnessmap_fragment:CS,metalnessmap_pars_fragment:LS,morphinstance_vertex:DS,morphcolor_vertex:kS,morphnormal_vertex:IS,morphtarget_pars_vertex:zS,morphtarget_vertex:FS,normal_fragment_begin:US,normal_fragment_maps:NS,normal_pars_fragment:OS,normal_pars_vertex:BS,normal_vertex:HS,normalmap_pars_fragment:GS,clearcoat_normal_fragment_begin:XS,clearcoat_normal_fragment_maps:VS,clearcoat_pars_fragment:WS,iridescence_pars_fragment:YS,opaque_fragment:$S,packing:ZS,premultiplied_alpha_fragment:jS,project_vertex:qS,dithering_fragment:KS,dithering_pars_fragment:JS,roughnessmap_fragment:QS,roughnessmap_pars_fragment:tw,shadowmap_pars_fragment:ew,shadowmap_pars_vertex:nw,shadowmap_vertex:iw,shadowmask_pars_fragment:aw,skinbase_vertex:sw,skinning_pars_vertex:ow,skinning_vertex:rw,skinnormal_vertex:cw,specularmap_fragment:lw,specularmap_pars_fragment:hw,tonemapping_fragment:dw,tonemapping_pars_fragment:uw,transmission_fragment:fw,transmission_pars_fragment:pw,uv_pars_fragment:mw,uv_pars_vertex:gw,uv_vertex:xw,worldpos_vertex:vw,background_vert:yw,background_frag:Mw,backgroundCube_vert:_w,backgroundCube_frag:bw,cube_vert:Sw,cube_frag:ww,depth_vert:Ew,depth_frag:Tw,distanceRGBA_vert:Aw,distanceRGBA_frag:Rw,equirect_vert:Pw,equirect_frag:Cw,linedashed_vert:Lw,linedashed_frag:Dw,meshbasic_vert:kw,meshbasic_frag:Iw,meshlambert_vert:zw,meshlambert_frag:Fw,meshmatcap_vert:Uw,meshmatcap_frag:Nw,meshnormal_vert:Ow,meshnormal_frag:Bw,meshphong_vert:Hw,meshphong_frag:Gw,meshphysical_vert:Xw,meshphysical_frag:Vw,meshtoon_vert:Ww,meshtoon_frag:Yw,points_vert:$w,points_frag:Zw,shadow_vert:jw,shadow_frag:qw,sprite_vert:Kw,sprite_frag:Jw},Xt={common:{diffuse:{value:new te(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new pe},alphaMap:{value:null},alphaMapTransform:{value:new pe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new pe}},envmap:{envMap:{value:null},envMapRotation:{value:new pe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new pe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new pe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new pe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new pe},normalScale:{value:new Vt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new pe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new pe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new pe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new pe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new te(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new te(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new pe},alphaTest:{value:0},uvTransform:{value:new pe}},sprite:{diffuse:{value:new te(16777215)},opacity:{value:1},center:{value:new Vt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new pe},alphaMap:{value:null},alphaMapTransform:{value:new pe},alphaTest:{value:0}}},wi={basic:{uniforms:On([Xt.common,Xt.specularmap,Xt.envmap,Xt.aomap,Xt.lightmap,Xt.fog]),vertexShader:ge.meshbasic_vert,fragmentShader:ge.meshbasic_frag},lambert:{uniforms:On([Xt.common,Xt.specularmap,Xt.envmap,Xt.aomap,Xt.lightmap,Xt.emissivemap,Xt.bumpmap,Xt.normalmap,Xt.displacementmap,Xt.fog,Xt.lights,{emissive:{value:new te(0)}}]),vertexShader:ge.meshlambert_vert,fragmentShader:ge.meshlambert_frag},phong:{uniforms:On([Xt.common,Xt.specularmap,Xt.envmap,Xt.aomap,Xt.lightmap,Xt.emissivemap,Xt.bumpmap,Xt.normalmap,Xt.displacementmap,Xt.fog,Xt.lights,{emissive:{value:new te(0)},specular:{value:new te(1118481)},shininess:{value:30}}]),vertexShader:ge.meshphong_vert,fragmentShader:ge.meshphong_frag},standard:{uniforms:On([Xt.common,Xt.envmap,Xt.aomap,Xt.lightmap,Xt.emissivemap,Xt.bumpmap,Xt.normalmap,Xt.displacementmap,Xt.roughnessmap,Xt.metalnessmap,Xt.fog,Xt.lights,{emissive:{value:new te(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ge.meshphysical_vert,fragmentShader:ge.meshphysical_frag},toon:{uniforms:On([Xt.common,Xt.aomap,Xt.lightmap,Xt.emissivemap,Xt.bumpmap,Xt.normalmap,Xt.displacementmap,Xt.gradientmap,Xt.fog,Xt.lights,{emissive:{value:new te(0)}}]),vertexShader:ge.meshtoon_vert,fragmentShader:ge.meshtoon_frag},matcap:{uniforms:On([Xt.common,Xt.bumpmap,Xt.normalmap,Xt.displacementmap,Xt.fog,{matcap:{value:null}}]),vertexShader:ge.meshmatcap_vert,fragmentShader:ge.meshmatcap_frag},points:{uniforms:On([Xt.points,Xt.fog]),vertexShader:ge.points_vert,fragmentShader:ge.points_frag},dashed:{uniforms:On([Xt.common,Xt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ge.linedashed_vert,fragmentShader:ge.linedashed_frag},depth:{uniforms:On([Xt.common,Xt.displacementmap]),vertexShader:ge.depth_vert,fragmentShader:ge.depth_frag},normal:{uniforms:On([Xt.common,Xt.bumpmap,Xt.normalmap,Xt.displacementmap,{opacity:{value:1}}]),vertexShader:ge.meshnormal_vert,fragmentShader:ge.meshnormal_frag},sprite:{uniforms:On([Xt.sprite,Xt.fog]),vertexShader:ge.sprite_vert,fragmentShader:ge.sprite_frag},background:{uniforms:{uvTransform:{value:new pe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ge.background_vert,fragmentShader:ge.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new pe}},vertexShader:ge.backgroundCube_vert,fragmentShader:ge.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ge.cube_vert,fragmentShader:ge.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ge.equirect_vert,fragmentShader:ge.equirect_frag},distanceRGBA:{uniforms:On([Xt.common,Xt.displacementmap,{referencePosition:{value:new W},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ge.distanceRGBA_vert,fragmentShader:ge.distanceRGBA_frag},shadow:{uniforms:On([Xt.lights,Xt.fog,{color:{value:new te(0)},opacity:{value:1}}]),vertexShader:ge.shadow_vert,fragmentShader:ge.shadow_frag}};wi.physical={uniforms:On([wi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new pe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new pe},clearcoatNormalScale:{value:new Vt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new pe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new pe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new pe},sheen:{value:0},sheenColor:{value:new te(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new pe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new pe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new pe},transmissionSamplerSize:{value:new Vt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new pe},attenuationDistance:{value:0},attenuationColor:{value:new te(0)},specularColor:{value:new te(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new pe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new pe},anisotropyVector:{value:new Vt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new pe}}]),vertexShader:ge.meshphysical_vert,fragmentShader:ge.meshphysical_frag};const pr={r:0,b:0,g:0},Ta=new Pi,Qw=new Ae;function tE(n,t,e,i,a,s,o){const r=new te(0);let c=s===!0?0:1,l,d,u=null,h=0,f=null;function m(_){let x=_.isScene===!0?_.background:null;return x&&x.isTexture&&(x=(_.backgroundBlurriness>0?e:t).get(x)),x}function v(_){let x=!1;const M=m(_);M===null?p(r,c):M&&M.isColor&&(p(M,1),x=!0);const S=n.xr.getEnvironmentBlendMode();S==="additive"?i.buffers.color.setClear(0,0,0,1,o):S==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(_,x){const M=m(x);M&&(M.isCubeTexture||M.mapping===hc)?(d===void 0&&(d=new me(new ni(1,1,1),new ma({name:"BackgroundCubeMaterial",uniforms:Us(wi.backgroundCube.uniforms),vertexShader:wi.backgroundCube.vertexShader,fragmentShader:wi.backgroundCube.fragmentShader,side:Wn,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(S,w,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(d)),Ta.copy(x.backgroundRotation),Ta.x*=-1,Ta.y*=-1,Ta.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Ta.y*=-1,Ta.z*=-1),d.material.uniforms.envMap.value=M,d.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(Qw.makeRotationFromEuler(Ta)),d.material.toneMapped=Se.getTransfer(M.colorSpace)!==ze,(u!==M||h!==M.version||f!==n.toneMapping)&&(d.material.needsUpdate=!0,u=M,h=M.version,f=n.toneMapping),d.layers.enableAll(),_.unshift(d,d.geometry,d.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new me(new Vn(2,2),new ma({name:"BackgroundMaterial",uniforms:Us(wi.background.uniforms),vertexShader:wi.background.vertexShader,fragmentShader:wi.background.fragmentShader,side:pa,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=Se.getTransfer(M.colorSpace)!==ze,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||h!==M.version||f!==n.toneMapping)&&(l.material.needsUpdate=!0,u=M,h=M.version,f=n.toneMapping),l.layers.enableAll(),_.unshift(l,l.geometry,l.material,0,0,null))}function p(_,x){_.getRGB(pr,Sm(n)),i.buffers.color.setClear(pr.r,pr.g,pr.b,x,o)}return{getClearColor:function(){return r},setClearColor:function(_,x=1){r.set(_),c=x,p(r,c)},getClearAlpha:function(){return c},setClearAlpha:function(_){c=_,p(r,c)},render:v,addToRenderList:g}}function eE(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},a=h(null);let s=a,o=!1;function r(y,C,I,R,U){let L=!1;const k=u(R,I,C);s!==k&&(s=k,l(s.object)),L=f(y,R,I,U),L&&m(y,R,I,U),U!==null&&t.update(U,n.ELEMENT_ARRAY_BUFFER),(L||o)&&(o=!1,M(y,C,I,R),U!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(U).buffer))}function c(){return n.createVertexArray()}function l(y){return n.bindVertexArray(y)}function d(y){return n.deleteVertexArray(y)}function u(y,C,I){const R=I.wireframe===!0;let U=i[y.id];U===void 0&&(U={},i[y.id]=U);let L=U[C.id];L===void 0&&(L={},U[C.id]=L);let k=L[R];return k===void 0&&(k=h(c()),L[R]=k),k}function h(y){const C=[],I=[],R=[];for(let U=0;U<e;U++)C[U]=0,I[U]=0,R[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:I,attributeDivisors:R,object:y,attributes:{},index:null}}function f(y,C,I,R){const U=s.attributes,L=C.attributes;let k=0;const B=I.getAttributes();for(const G in B)if(B[G].location>=0){const at=U[G];let mt=L[G];if(mt===void 0&&(G==="instanceMatrix"&&y.instanceMatrix&&(mt=y.instanceMatrix),G==="instanceColor"&&y.instanceColor&&(mt=y.instanceColor)),at===void 0||at.attribute!==mt||mt&&at.data!==mt.data)return!0;k++}return s.attributesNum!==k||s.index!==R}function m(y,C,I,R){const U={},L=C.attributes;let k=0;const B=I.getAttributes();for(const G in B)if(B[G].location>=0){let at=L[G];at===void 0&&(G==="instanceMatrix"&&y.instanceMatrix&&(at=y.instanceMatrix),G==="instanceColor"&&y.instanceColor&&(at=y.instanceColor));const mt={};mt.attribute=at,at&&at.data&&(mt.data=at.data),U[G]=mt,k++}s.attributes=U,s.attributesNum=k,s.index=R}function v(){const y=s.newAttributes;for(let C=0,I=y.length;C<I;C++)y[C]=0}function g(y){p(y,0)}function p(y,C){const I=s.newAttributes,R=s.enabledAttributes,U=s.attributeDivisors;I[y]=1,R[y]===0&&(n.enableVertexAttribArray(y),R[y]=1),U[y]!==C&&(n.vertexAttribDivisor(y,C),U[y]=C)}function _(){const y=s.newAttributes,C=s.enabledAttributes;for(let I=0,R=C.length;I<R;I++)C[I]!==y[I]&&(n.disableVertexAttribArray(I),C[I]=0)}function x(y,C,I,R,U,L,k){k===!0?n.vertexAttribIPointer(y,C,I,U,L):n.vertexAttribPointer(y,C,I,R,U,L)}function M(y,C,I,R){v();const U=R.attributes,L=I.getAttributes(),k=C.defaultAttributeValues;for(const B in L){const G=L[B];if(G.location>=0){let $=U[B];if($===void 0&&(B==="instanceMatrix"&&y.instanceMatrix&&($=y.instanceMatrix),B==="instanceColor"&&y.instanceColor&&($=y.instanceColor)),$!==void 0){const at=$.normalized,mt=$.itemSize,ft=t.get($);if(ft===void 0)continue;const Dt=ft.buffer,j=ft.type,F=ft.bytesPerElement,Y=j===n.INT||j===n.UNSIGNED_INT||$.gpuType===Jh;if($.isInterleavedBufferAttribute){const J=$.data,K=J.stride,st=$.offset;if(J.isInstancedInterleavedBuffer){for(let Tt=0;Tt<G.locationSize;Tt++)p(G.location+Tt,J.meshPerAttribute);y.isInstancedMesh!==!0&&R._maxInstanceCount===void 0&&(R._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let Tt=0;Tt<G.locationSize;Tt++)g(G.location+Tt);n.bindBuffer(n.ARRAY_BUFFER,Dt);for(let Tt=0;Tt<G.locationSize;Tt++)x(G.location+Tt,mt/G.locationSize,j,at,K*F,(st+mt/G.locationSize*Tt)*F,Y)}else{if($.isInstancedBufferAttribute){for(let J=0;J<G.locationSize;J++)p(G.location+J,$.meshPerAttribute);y.isInstancedMesh!==!0&&R._maxInstanceCount===void 0&&(R._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let J=0;J<G.locationSize;J++)g(G.location+J);n.bindBuffer(n.ARRAY_BUFFER,Dt);for(let J=0;J<G.locationSize;J++)x(G.location+J,mt/G.locationSize,j,at,mt*F,mt/G.locationSize*J*F,Y)}}else if(k!==void 0){const at=k[B];if(at!==void 0)switch(at.length){case 2:n.vertexAttrib2fv(G.location,at);break;case 3:n.vertexAttrib3fv(G.location,at);break;case 4:n.vertexAttrib4fv(G.location,at);break;default:n.vertexAttrib1fv(G.location,at)}}}}_()}function S(){T();for(const y in i){const C=i[y];for(const I in C){const R=C[I];for(const U in R)d(R[U].object),delete R[U];delete C[I]}delete i[y]}}function w(y){if(i[y.id]===void 0)return;const C=i[y.id];for(const I in C){const R=C[I];for(const U in R)d(R[U].object),delete R[U];delete C[I]}delete i[y.id]}function E(y){for(const C in i){const I=i[C];if(I[y.id]===void 0)continue;const R=I[y.id];for(const U in R)d(R[U].object),delete R[U];delete I[y.id]}}function T(){b(),o=!0,s!==a&&(s=a,l(s.object))}function b(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:r,reset:T,resetDefaultState:b,dispose:S,releaseStatesOfGeometry:w,releaseStatesOfProgram:E,initAttributes:v,enableAttribute:g,disableUnusedAttributes:_}}function nE(n,t,e){let i;function a(l){i=l}function s(l,d){n.drawArrays(i,l,d),e.update(d,i,1)}function o(l,d,u){u!==0&&(n.drawArraysInstanced(i,l,d,u),e.update(d,i,u))}function r(l,d,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,d,0,u);let f=0;for(let m=0;m<u;m++)f+=d[m];e.update(f,i,1)}function c(l,d,u,h){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<l.length;m++)o(l[m],d[m],h[m]);else{f.multiDrawArraysInstancedWEBGL(i,l,0,d,0,h,0,u);let m=0;for(let v=0;v<u;v++)m+=d[v]*h[v];e.update(m,i,1)}}this.setMode=a,this.render=s,this.renderInstances=o,this.renderMultiDraw=r,this.renderMultiDrawInstances=c}function iE(n,t,e,i){let a;function s(){if(a!==void 0)return a;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");a=n.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function o(E){return!(E!==gi&&i.convert(E)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(E){const T=E===No&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(E!==$i&&i.convert(E)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==Ti&&!T)}function c(E){if(E==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const d=c(l);d!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);const u=e.logarithmicDepthBuffer===!0,h=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),_=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),x=n.getParameter(n.MAX_VARYING_VECTORS),M=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),S=m>0,w=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:r,precision:l,logarithmicDepthBuffer:u,reverseDepthBuffer:h,maxTextures:f,maxVertexTextures:m,maxTextureSize:v,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:_,maxVaryings:x,maxFragmentUniforms:M,vertexTextures:S,maxSamples:w}}function aE(n){const t=this;let e=null,i=0,a=!1,s=!1;const o=new Da,r=new pe,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,h){const f=u.length!==0||h||i!==0||a;return a=h,i=u.length,f},this.beginShadows=function(){s=!0,d(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,h){e=d(u,h,0)},this.setState=function(u,h,f){const m=u.clippingPlanes,v=u.clipIntersection,g=u.clipShadows,p=n.get(u);if(!a||m===null||m.length===0||s&&!g)s?d(null):l();else{const _=s?0:i,x=_*4;let M=p.clippingState||null;c.value=M,M=d(m,h,x,f);for(let S=0;S!==x;++S)M[S]=e[S];p.clippingState=M,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=_}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function d(u,h,f,m){const v=u!==null?u.length:0;let g=null;if(v!==0){if(g=c.value,m!==!0||g===null){const p=f+v*4,_=h.matrixWorldInverse;r.getNormalMatrix(_),(g===null||g.length<p)&&(g=new Float32Array(p));for(let x=0,M=f;x!==v;++x,M+=4)o.copy(u[x]).applyMatrix4(_,r),o.normal.toArray(g,M),g[M+3]=o.constant}c.value=g,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,g}}function sE(n){let t=new WeakMap;function e(o,r){return r===th?o.mapping=ks:r===eh&&(o.mapping=Is),o}function i(o){if(o&&o.isTexture){const r=o.mapping;if(r===th||r===eh)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new g1(c.height);return l.fromEquirectangularTexture(n,o),t.set(o,l),o.addEventListener("dispose",a),e(l.texture,o.mapping)}else return null}}return o}function a(o){const r=o.target;r.removeEventListener("dispose",a);const c=t.get(r);c!==void 0&&(t.delete(r),c.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}class Am extends wm{constructor(t=-1,e=1,i=1,a=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=a,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,a,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let s=i-t,o=i+t,r=a+e,c=a-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,o=s+l*this.view.width,r-=d*this.view.offsetY,c=r-d*this.view.height}this.projectionMatrix.makeOrthographic(s,o,r,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const _s=4,hf=[.125,.215,.35,.446,.526,.582],Fa=20,hl=new Am,df=new te;let dl=null,ul=0,fl=0,pl=!1;const ka=(1+Math.sqrt(5))/2,fs=1/ka,uf=[new W(-ka,fs,0),new W(ka,fs,0),new W(-fs,0,ka),new W(fs,0,ka),new W(0,ka,-fs),new W(0,ka,fs),new W(-1,1,-1),new W(1,1,-1),new W(-1,1,1),new W(1,1,1)];class ff{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,a=100){dl=this._renderer.getRenderTarget(),ul=this._renderer.getActiveCubeFace(),fl=this._renderer.getActiveMipmapLevel(),pl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,i,a,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=gf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=mf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(dl,ul,fl),this._renderer.xr.enabled=pl,t.scissorTest=!1,mr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ks||t.mapping===Is?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),dl=this._renderer.getRenderTarget(),ul=this._renderer.getActiveCubeFace(),fl=this._renderer.getActiveMipmapLevel(),pl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Ei,minFilter:Ei,generateMipmaps:!1,type:No,format:gi,colorSpace:Ns,depthBuffer:!1},a=pf(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=pf(t,e,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=oE(s)),this._blurMaterial=rE(s,t,e)}return a}_compileMaterial(t){const e=new me(this._lodPlanes[0],t);this._renderer.compile(e,hl)}_sceneToCubeUV(t,e,i,a){const r=new ri(90,1,e,i),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,h=d.toneMapping;d.getClearColor(df),d.toneMapping=da,d.autoClear=!1;const f=new Mn({name:"PMREM.Background",side:Wn,depthWrite:!1,depthTest:!1}),m=new me(new ni,f);let v=!1;const g=t.background;g?g.isColor&&(f.color.copy(g),t.background=null,v=!0):(f.color.copy(df),v=!0);for(let p=0;p<6;p++){const _=p%3;_===0?(r.up.set(0,c[p],0),r.lookAt(l[p],0,0)):_===1?(r.up.set(0,0,c[p]),r.lookAt(0,l[p],0)):(r.up.set(0,c[p],0),r.lookAt(0,0,l[p]));const x=this._cubeSize;mr(a,_*x,p>2?x:0,x,x),d.setRenderTarget(a),v&&d.render(m,r),d.render(t,r)}m.geometry.dispose(),m.material.dispose(),d.toneMapping=h,d.autoClear=u,t.background=g}_textureToCubeUV(t,e){const i=this._renderer,a=t.mapping===ks||t.mapping===Is;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=gf()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=mf());const s=a?this._cubemapMaterial:this._equirectMaterial,o=new me(this._lodPlanes[0],s),r=s.uniforms;r.envMap.value=t;const c=this._cubeSize;mr(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(o,hl)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const a=this._lodPlanes.length;for(let s=1;s<a;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),r=uf[(a-s-1)%uf.length];this._blur(t,s-1,s,o,r)}e.autoClear=i}_blur(t,e,i,a,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,a,"latitudinal",s),this._halfBlur(o,t,i,i,a,"longitudinal",s)}_halfBlur(t,e,i,a,s,o,r){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,u=new me(this._lodPlanes[a],l),h=l.uniforms,f=this._sizeLods[i]-1,m=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*Fa-1),v=s/m,g=isFinite(s)?1+Math.floor(d*v):Fa;g>Fa&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Fa}`);const p=[];let _=0;for(let E=0;E<Fa;++E){const T=E/v,b=Math.exp(-T*T/2);p.push(b),E===0?_+=b:E<g&&(_+=2*b)}for(let E=0;E<p.length;E++)p[E]=p[E]/_;h.envMap.value=t.texture,h.samples.value=g,h.weights.value=p,h.latitudinal.value=o==="latitudinal",r&&(h.poleAxis.value=r);const{_lodMax:x}=this;h.dTheta.value=m,h.mipInt.value=x-i;const M=this._sizeLods[a],S=3*M*(a>x-_s?a-x+_s:0),w=4*(this._cubeSize-M);mr(e,S,w,3*M,2*M),c.setRenderTarget(e),c.render(u,hl)}}function oE(n){const t=[],e=[],i=[];let a=n;const s=n-_s+1+hf.length;for(let o=0;o<s;o++){const r=Math.pow(2,a);e.push(r);let c=1/r;o>n-_s?c=hf[o-n+_s-1]:o===0&&(c=0),i.push(c);const l=1/(r-2),d=-l,u=1+l,h=[d,d,u,d,u,u,d,d,u,u,d,u],f=6,m=6,v=3,g=2,p=1,_=new Float32Array(v*m*f),x=new Float32Array(g*m*f),M=new Float32Array(p*m*f);for(let w=0;w<f;w++){const E=w%3*2/3-1,T=w>2?0:-1,b=[E,T,0,E+2/3,T,0,E+2/3,T+1,0,E,T,0,E+2/3,T+1,0,E,T+1,0];_.set(b,v*m*w),x.set(h,g*m*w);const y=[w,w,w,w,w,w];M.set(y,p*m*w)}const S=new Je;S.setAttribute("position",new _n(_,v)),S.setAttribute("uv",new _n(x,g)),S.setAttribute("faceIndex",new _n(M,p)),t.push(S),a>_s&&a--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function pf(n,t,e){const i=new Ga(n,t,e);return i.texture.mapping=hc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function mr(n,t,e,i,a){n.viewport.set(t,e,i,a),n.scissor.set(t,e,i,a)}function rE(n,t,e){const i=new Float32Array(Fa),a=new W(0,1,0);return new ma({name:"SphericalGaussianBlur",defines:{n:Fa,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:ld(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ha,depthTest:!1,depthWrite:!1})}function mf(){return new ma({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ld(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ha,depthTest:!1,depthWrite:!1})}function gf(){return new ma({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ld(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ha,depthTest:!1,depthWrite:!1})}function ld(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function cE(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const c=r.mapping,l=c===th||c===eh,d=c===ks||c===Is;if(l||d){let u=t.get(r);const h=u!==void 0?u.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==h)return e===null&&(e=new ff(n)),u=l?e.fromEquirectangular(r,u):e.fromCubemap(r,u),u.texture.pmremVersion=r.pmremVersion,t.set(r,u),u.texture;if(u!==void 0)return u.texture;{const f=r.image;return l&&f&&f.height>0||d&&f&&a(f)?(e===null&&(e=new ff(n)),u=l?e.fromEquirectangular(r):e.fromCubemap(r),u.texture.pmremVersion=r.pmremVersion,t.set(r,u),r.addEventListener("dispose",s),u.texture):null}}}return r}function a(r){let c=0;const l=6;for(let d=0;d<l;d++)r[d]!==void 0&&c++;return c===l}function s(r){const c=r.target;c.removeEventListener("dispose",s);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function lE(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let a;switch(i){case"WEBGL_depth_texture":a=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=n.getExtension(i)}return t[i]=a,a}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const a=e(i);return a===null&&fo("THREE.WebGLRenderer: "+i+" extension not supported."),a}}}function hE(n,t,e,i){const a={},s=new WeakMap;function o(u){const h=u.target;h.index!==null&&t.remove(h.index);for(const m in h.attributes)t.remove(h.attributes[m]);for(const m in h.morphAttributes){const v=h.morphAttributes[m];for(let g=0,p=v.length;g<p;g++)t.remove(v[g])}h.removeEventListener("dispose",o),delete a[h.id];const f=s.get(h);f&&(t.remove(f),s.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,e.memory.geometries--}function r(u,h){return a[h.id]===!0||(h.addEventListener("dispose",o),a[h.id]=!0,e.memory.geometries++),h}function c(u){const h=u.attributes;for(const m in h)t.update(h[m],n.ARRAY_BUFFER);const f=u.morphAttributes;for(const m in f){const v=f[m];for(let g=0,p=v.length;g<p;g++)t.update(v[g],n.ARRAY_BUFFER)}}function l(u){const h=[],f=u.index,m=u.attributes.position;let v=0;if(f!==null){const _=f.array;v=f.version;for(let x=0,M=_.length;x<M;x+=3){const S=_[x+0],w=_[x+1],E=_[x+2];h.push(S,w,w,E,E,S)}}else if(m!==void 0){const _=m.array;v=m.version;for(let x=0,M=_.length/3-1;x<M;x+=3){const S=x+0,w=x+1,E=x+2;h.push(S,w,w,E,E,S)}}else return;const g=new(xm(h)?bm:_m)(h,1);g.version=v;const p=s.get(u);p&&t.remove(p),s.set(u,g)}function d(u){const h=s.get(u);if(h){const f=u.index;f!==null&&h.version<f.version&&l(u)}else l(u);return s.get(u)}return{get:r,update:c,getWireframeAttribute:d}}function dE(n,t,e){let i;function a(h){i=h}let s,o;function r(h){s=h.type,o=h.bytesPerElement}function c(h,f){n.drawElements(i,f,s,h*o),e.update(f,i,1)}function l(h,f,m){m!==0&&(n.drawElementsInstanced(i,f,s,h*o,m),e.update(f,i,m))}function d(h,f,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,s,h,0,m);let g=0;for(let p=0;p<m;p++)g+=f[p];e.update(g,i,1)}function u(h,f,m,v){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<h.length;p++)l(h[p]/o,f[p],v[p]);else{g.multiDrawElementsInstancedWEBGL(i,f,0,s,h,0,v,0,m);let p=0;for(let _=0;_<m;_++)p+=f[_]*v[_];e.update(p,i,1)}}this.setMode=a,this.setIndex=r,this.render=c,this.renderInstances=l,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function uE(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,r){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=r*(s/3);break;case n.LINES:e.lines+=r*(s/2);break;case n.LINE_STRIP:e.lines+=r*(s-1);break;case n.LINE_LOOP:e.lines+=r*s;break;case n.POINTS:e.points+=r*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function a(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:a,update:i}}function fE(n,t,e){const i=new WeakMap,a=new nn;function s(o,r,c){const l=o.morphTargetInfluences,d=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,u=d!==void 0?d.length:0;let h=i.get(r);if(h===void 0||h.count!==u){let y=function(){T.dispose(),i.delete(r),r.removeEventListener("dispose",y)};var f=y;h!==void 0&&h.texture.dispose();const m=r.morphAttributes.position!==void 0,v=r.morphAttributes.normal!==void 0,g=r.morphAttributes.color!==void 0,p=r.morphAttributes.position||[],_=r.morphAttributes.normal||[],x=r.morphAttributes.color||[];let M=0;m===!0&&(M=1),v===!0&&(M=2),g===!0&&(M=3);let S=r.attributes.position.count*M,w=1;S>t.maxTextureSize&&(w=Math.ceil(S/t.maxTextureSize),S=t.maxTextureSize);const E=new Float32Array(S*w*4*u),T=new ym(E,S,w,u);T.type=Ti,T.needsUpdate=!0;const b=M*4;for(let C=0;C<u;C++){const I=p[C],R=_[C],U=x[C],L=S*w*4*C;for(let k=0;k<I.count;k++){const B=k*b;m===!0&&(a.fromBufferAttribute(I,k),E[L+B+0]=a.x,E[L+B+1]=a.y,E[L+B+2]=a.z,E[L+B+3]=0),v===!0&&(a.fromBufferAttribute(R,k),E[L+B+4]=a.x,E[L+B+5]=a.y,E[L+B+6]=a.z,E[L+B+7]=0),g===!0&&(a.fromBufferAttribute(U,k),E[L+B+8]=a.x,E[L+B+9]=a.y,E[L+B+10]=a.z,E[L+B+11]=U.itemSize===4?a.w:1)}}h={count:u,texture:T,size:new Vt(S,w)},i.set(r,h),r.addEventListener("dispose",y)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let m=0;for(let g=0;g<l.length;g++)m+=l[g];const v=r.morphTargetsRelative?1:1-m;c.getUniforms().setValue(n,"morphTargetBaseInfluence",v),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",h.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:s}}function pE(n,t,e,i){let a=new WeakMap;function s(c){const l=i.render.frame,d=c.geometry,u=t.get(c,d);if(a.get(u)!==l&&(t.update(u),a.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",r)===!1&&c.addEventListener("dispose",r),a.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),a.set(c,l))),c.isSkinnedMesh){const h=c.skeleton;a.get(h)!==l&&(h.update(),a.set(h,l))}return u}function o(){a=new WeakMap}function r(c){const l=c.target;l.removeEventListener("dispose",r),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:s,dispose:o}}class Rm extends kn{constructor(t,e,i,a,s,o,r,c,l,d=Es){if(d!==Es&&d!==Fs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&d===Es&&(i=Ha),i===void 0&&d===Fs&&(i=zs),super(null,a,s,o,r,c,d,i,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:ei,this.minFilter=c!==void 0?c:ei,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Pm=new kn,xf=new Rm(1,1),Cm=new ym,Lm=new t1,Dm=new Em,vf=[],yf=[],Mf=new Float32Array(16),_f=new Float32Array(9),bf=new Float32Array(4);function Hs(n,t,e){const i=n[0];if(i<=0||i>0)return n;const a=t*e;let s=vf[a];if(s===void 0&&(s=new Float32Array(a),vf[a]=s),t!==0){i.toArray(s,0);for(let o=1,r=0;o!==t;++o)r+=e,n[o].toArray(s,r)}return s}function fn(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function pn(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function uc(n,t){let e=yf[t];e===void 0&&(e=new Int32Array(t),yf[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function mE(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function gE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(fn(e,t))return;n.uniform2fv(this.addr,t),pn(e,t)}}function xE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(fn(e,t))return;n.uniform3fv(this.addr,t),pn(e,t)}}function vE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(fn(e,t))return;n.uniform4fv(this.addr,t),pn(e,t)}}function yE(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(fn(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),pn(e,t)}else{if(fn(e,i))return;bf.set(i),n.uniformMatrix2fv(this.addr,!1,bf),pn(e,i)}}function ME(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(fn(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),pn(e,t)}else{if(fn(e,i))return;_f.set(i),n.uniformMatrix3fv(this.addr,!1,_f),pn(e,i)}}function _E(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(fn(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),pn(e,t)}else{if(fn(e,i))return;Mf.set(i),n.uniformMatrix4fv(this.addr,!1,Mf),pn(e,i)}}function bE(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function SE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(fn(e,t))return;n.uniform2iv(this.addr,t),pn(e,t)}}function wE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(fn(e,t))return;n.uniform3iv(this.addr,t),pn(e,t)}}function EE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(fn(e,t))return;n.uniform4iv(this.addr,t),pn(e,t)}}function TE(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function AE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(fn(e,t))return;n.uniform2uiv(this.addr,t),pn(e,t)}}function RE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(fn(e,t))return;n.uniform3uiv(this.addr,t),pn(e,t)}}function PE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(fn(e,t))return;n.uniform4uiv(this.addr,t),pn(e,t)}}function CE(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a);let s;this.type===n.SAMPLER_2D_SHADOW?(xf.compareFunction=gm,s=xf):s=Pm,e.setTexture2D(t||s,a)}function LE(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture3D(t||Lm,a)}function DE(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTextureCube(t||Dm,a)}function kE(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture2DArray(t||Cm,a)}function IE(n){switch(n){case 5126:return mE;case 35664:return gE;case 35665:return xE;case 35666:return vE;case 35674:return yE;case 35675:return ME;case 35676:return _E;case 5124:case 35670:return bE;case 35667:case 35671:return SE;case 35668:case 35672:return wE;case 35669:case 35673:return EE;case 5125:return TE;case 36294:return AE;case 36295:return RE;case 36296:return PE;case 35678:case 36198:case 36298:case 36306:case 35682:return CE;case 35679:case 36299:case 36307:return LE;case 35680:case 36300:case 36308:case 36293:return DE;case 36289:case 36303:case 36311:case 36292:return kE}}function zE(n,t){n.uniform1fv(this.addr,t)}function FE(n,t){const e=Hs(t,this.size,2);n.uniform2fv(this.addr,e)}function UE(n,t){const e=Hs(t,this.size,3);n.uniform3fv(this.addr,e)}function NE(n,t){const e=Hs(t,this.size,4);n.uniform4fv(this.addr,e)}function OE(n,t){const e=Hs(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function BE(n,t){const e=Hs(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function HE(n,t){const e=Hs(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function GE(n,t){n.uniform1iv(this.addr,t)}function XE(n,t){n.uniform2iv(this.addr,t)}function VE(n,t){n.uniform3iv(this.addr,t)}function WE(n,t){n.uniform4iv(this.addr,t)}function YE(n,t){n.uniform1uiv(this.addr,t)}function $E(n,t){n.uniform2uiv(this.addr,t)}function ZE(n,t){n.uniform3uiv(this.addr,t)}function jE(n,t){n.uniform4uiv(this.addr,t)}function qE(n,t,e){const i=this.cache,a=t.length,s=uc(e,a);fn(i,s)||(n.uniform1iv(this.addr,s),pn(i,s));for(let o=0;o!==a;++o)e.setTexture2D(t[o]||Pm,s[o])}function KE(n,t,e){const i=this.cache,a=t.length,s=uc(e,a);fn(i,s)||(n.uniform1iv(this.addr,s),pn(i,s));for(let o=0;o!==a;++o)e.setTexture3D(t[o]||Lm,s[o])}function JE(n,t,e){const i=this.cache,a=t.length,s=uc(e,a);fn(i,s)||(n.uniform1iv(this.addr,s),pn(i,s));for(let o=0;o!==a;++o)e.setTextureCube(t[o]||Dm,s[o])}function QE(n,t,e){const i=this.cache,a=t.length,s=uc(e,a);fn(i,s)||(n.uniform1iv(this.addr,s),pn(i,s));for(let o=0;o!==a;++o)e.setTexture2DArray(t[o]||Cm,s[o])}function tT(n){switch(n){case 5126:return zE;case 35664:return FE;case 35665:return UE;case 35666:return NE;case 35674:return OE;case 35675:return BE;case 35676:return HE;case 5124:case 35670:return GE;case 35667:case 35671:return XE;case 35668:case 35672:return VE;case 35669:case 35673:return WE;case 5125:return YE;case 36294:return $E;case 36295:return ZE;case 36296:return jE;case 35678:case 36198:case 36298:case 36306:case 35682:return qE;case 35679:case 36299:case 36307:return KE;case 35680:case 36300:case 36308:case 36293:return JE;case 36289:case 36303:case 36311:case 36292:return QE}}class eT{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=IE(e.type)}}class nT{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=tT(e.type)}}class iT{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const a=this.seq;for(let s=0,o=a.length;s!==o;++s){const r=a[s];r.setValue(t,e[r.id],i)}}}const ml=/(\w+)(\])?(\[|\.)?/g;function Sf(n,t){n.seq.push(t),n.map[t.id]=t}function aT(n,t,e){const i=n.name,a=i.length;for(ml.lastIndex=0;;){const s=ml.exec(i),o=ml.lastIndex;let r=s[1];const c=s[2]==="]",l=s[3];if(c&&(r=r|0),l===void 0||l==="["&&o+2===a){Sf(e,l===void 0?new eT(r,n,t):new nT(r,n,t));break}else{let u=e.map[r];u===void 0&&(u=new iT(r),Sf(e,u)),e=u}}}class Ur{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const s=t.getActiveUniform(e,a),o=t.getUniformLocation(e,s.name);aT(s,o,this)}}setValue(t,e,i,a){const s=this.map[e];s!==void 0&&s.setValue(t,i,a)}setOptional(t,e,i){const a=e[i];a!==void 0&&this.setValue(t,i,a)}static upload(t,e,i,a){for(let s=0,o=e.length;s!==o;++s){const r=e[s],c=i[r.id];c.needsUpdate!==!1&&r.setValue(t,c.value,a)}}static seqWithValue(t,e){const i=[];for(let a=0,s=t.length;a!==s;++a){const o=t[a];o.id in e&&i.push(o)}return i}}function wf(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const sT=37297;let oT=0;function rT(n,t){const e=n.split(`
`),i=[],a=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=a;o<s;o++){const r=o+1;i.push(`${r===t?">":" "} ${r}: ${e[o]}`)}return i.join(`
`)}const Ef=new pe;function cT(n){Se._getMatrix(Ef,Se.workingColorSpace,n);const t=`mat3( ${Ef.elements.map(e=>e.toFixed(4))} )`;switch(Se.getTransfer(n)){case dc:return[t,"LinearTransferOETF"];case ze:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Tf(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),a=n.getShaderInfoLog(t).trim();if(i&&a==="")return"";const s=/ERROR: 0:(\d+)/.exec(a);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+a+`

`+rT(n.getShaderSource(t),o)}else return a}function lT(n,t){const e=cT(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function hT(n,t){let e;switch(t){case ub:e="Linear";break;case fb:e="Reinhard";break;case pb:e="Cineon";break;case mb:e="ACESFilmic";break;case xb:e="AgX";break;case vb:e="Neutral";break;case gb:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const gr=new W;function dT(){Se.getLuminanceCoefficients(gr);const n=gr.x.toFixed(4),t=gr.y.toFixed(4),e=gr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function uT(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(po).join(`
`)}function fT(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function pT(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let a=0;a<i;a++){const s=n.getActiveAttrib(t,a),o=s.name;let r=1;s.type===n.FLOAT_MAT2&&(r=2),s.type===n.FLOAT_MAT3&&(r=3),s.type===n.FLOAT_MAT4&&(r=4),e[o]={type:s.type,location:n.getAttribLocation(t,o),locationSize:r}}return e}function po(n){return n!==""}function Af(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Rf(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const mT=/^[ \t]*#include +<([\w\d./]+)>/gm;function Lh(n){return n.replace(mT,xT)}const gT=new Map;function xT(n,t){let e=ge[t];if(e===void 0){const i=gT.get(t);if(i!==void 0)e=ge[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Lh(e)}const vT=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Pf(n){return n.replace(vT,yT)}function yT(n,t,e,i){let a="";for(let s=parseInt(t);s<parseInt(e);s++)a+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return a}function Cf(n){let t=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function MT(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===im?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===am?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Hi&&(t="SHADOWMAP_TYPE_VSM"),t}function _T(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case ks:case Is:t="ENVMAP_TYPE_CUBE";break;case hc:t="ENVMAP_TYPE_CUBE_UV";break}return t}function bT(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Is:t="ENVMAP_MODE_REFRACTION";break}return t}function ST(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Kh:t="ENVMAP_BLENDING_MULTIPLY";break;case hb:t="ENVMAP_BLENDING_MIX";break;case db:t="ENVMAP_BLENDING_ADD";break}return t}function wT(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function ET(n,t,e,i){const a=n.getContext(),s=e.defines;let o=e.vertexShader,r=e.fragmentShader;const c=MT(e),l=_T(e),d=bT(e),u=ST(e),h=wT(e),f=uT(e),m=fT(s),v=a.createProgram();let g,p,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(po).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(po).join(`
`),p.length>0&&(p+=`
`)):(g=[Cf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+d:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(po).join(`
`),p=[Cf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+d:"",e.envMap?"#define "+u:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==da?"#define TONE_MAPPING":"",e.toneMapping!==da?ge.tonemapping_pars_fragment:"",e.toneMapping!==da?hT("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ge.colorspace_pars_fragment,lT("linearToOutputTexel",e.outputColorSpace),dT(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(po).join(`
`)),o=Lh(o),o=Af(o,e),o=Rf(o,e),r=Lh(r),r=Af(r,e),r=Rf(r,e),o=Pf(o),r=Pf(r),e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===Bu?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Bu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=_+g+o,M=_+p+r,S=wf(a,a.VERTEX_SHADER,x),w=wf(a,a.FRAGMENT_SHADER,M);a.attachShader(v,S),a.attachShader(v,w),e.index0AttributeName!==void 0?a.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&a.bindAttribLocation(v,0,"position"),a.linkProgram(v);function E(C){if(n.debug.checkShaderErrors){const I=a.getProgramInfoLog(v).trim(),R=a.getShaderInfoLog(S).trim(),U=a.getShaderInfoLog(w).trim();let L=!0,k=!0;if(a.getProgramParameter(v,a.LINK_STATUS)===!1)if(L=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(a,v,S,w);else{const B=Tf(a,S,"vertex"),G=Tf(a,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(v,a.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+I+`
`+B+`
`+G)}else I!==""?console.warn("THREE.WebGLProgram: Program Info Log:",I):(R===""||U==="")&&(k=!1);k&&(C.diagnostics={runnable:L,programLog:I,vertexShader:{log:R,prefix:g},fragmentShader:{log:U,prefix:p}})}a.deleteShader(S),a.deleteShader(w),T=new Ur(a,v),b=pT(a,v)}let T;this.getUniforms=function(){return T===void 0&&E(this),T};let b;this.getAttributes=function(){return b===void 0&&E(this),b};let y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=a.getProgramParameter(v,sT)),y},this.destroy=function(){i.releaseStatesOfProgram(this),a.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=oT++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=S,this.fragmentShader=w,this}let TT=0;class AT{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,a=this._getShaderStage(e),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(a)===!1&&(o.add(a),a.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new RT(t),e.set(t,i)),i}}class RT{constructor(t){this.id=TT++,this.code=t,this.usedTimes=0}}function PT(n,t,e,i,a,s,o){const r=new rd,c=new AT,l=new Set,d=[],u=a.logarithmicDepthBuffer,h=a.vertexTextures;let f=a.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(b){return l.add(b),b===0?"uv":`uv${b}`}function g(b,y,C,I,R){const U=I.fog,L=R.geometry,k=b.isMeshStandardMaterial?I.environment:null,B=(b.isMeshStandardMaterial?e:t).get(b.envMap||k),G=B&&B.mapping===hc?B.image.height:null,$=m[b.type];b.precision!==null&&(f=a.getMaxPrecision(b.precision),f!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",f,"instead."));const at=L.morphAttributes.position||L.morphAttributes.normal||L.morphAttributes.color,mt=at!==void 0?at.length:0;let ft=0;L.morphAttributes.position!==void 0&&(ft=1),L.morphAttributes.normal!==void 0&&(ft=2),L.morphAttributes.color!==void 0&&(ft=3);let Dt,j,F,Y;if($){const ee=wi[$];Dt=ee.vertexShader,j=ee.fragmentShader}else Dt=b.vertexShader,j=b.fragmentShader,c.update(b),F=c.getVertexShaderID(b),Y=c.getFragmentShaderID(b);const J=n.getRenderTarget(),K=n.state.buffers.depth.getReversed(),st=R.isInstancedMesh===!0,Tt=R.isBatchedMesh===!0,Wt=!!b.map,dt=!!b.matcap,X=!!B,H=!!b.aoMap,kt=!!b.lightMap,Rt=!!b.bumpMap,_t=!!b.normalMap,vt=!!b.displacementMap,gt=!!b.emissiveMap,Pt=!!b.metalnessMap,D=!!b.roughnessMap,A=b.anisotropy>0,q=b.clearcoat>0,ut=b.dispersion>0,it=b.iridescence>0,lt=b.sheen>0,Nt=b.transmission>0,Ct=A&&!!b.anisotropyMap,wt=q&&!!b.clearcoatMap,$t=q&&!!b.clearcoatNormalMap,yt=q&&!!b.clearcoatRoughnessMap,zt=it&&!!b.iridescenceMap,Z=it&&!!b.iridescenceThicknessMap,V=lt&&!!b.sheenColorMap,pt=lt&&!!b.sheenRoughnessMap,Ht=!!b.specularMap,Ot=!!b.specularColorMap,Lt=!!b.specularIntensityMap,N=Nt&&!!b.transmissionMap,bt=Nt&&!!b.thicknessMap,et=!!b.gradientMap,ht=!!b.alphaMap,It=b.alphaTest>0,At=!!b.alphaHash,jt=!!b.extensions;let se=da;b.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(se=n.toneMapping);const oe={shaderID:$,shaderType:b.type,shaderName:b.name,vertexShader:Dt,fragmentShader:j,defines:b.defines,customVertexShaderID:F,customFragmentShaderID:Y,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:f,batching:Tt,batchingColor:Tt&&R._colorsTexture!==null,instancing:st,instancingColor:st&&R.instanceColor!==null,instancingMorph:st&&R.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:J===null?n.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:Ns,alphaToCoverage:!!b.alphaToCoverage,map:Wt,matcap:dt,envMap:X,envMapMode:X&&B.mapping,envMapCubeUVHeight:G,aoMap:H,lightMap:kt,bumpMap:Rt,normalMap:_t,displacementMap:h&&vt,emissiveMap:gt,normalMapObjectSpace:_t&&b.normalMapType===bb,normalMapTangentSpace:_t&&b.normalMapType===mm,metalnessMap:Pt,roughnessMap:D,anisotropy:A,anisotropyMap:Ct,clearcoat:q,clearcoatMap:wt,clearcoatNormalMap:$t,clearcoatRoughnessMap:yt,dispersion:ut,iridescence:it,iridescenceMap:zt,iridescenceThicknessMap:Z,sheen:lt,sheenColorMap:V,sheenRoughnessMap:pt,specularMap:Ht,specularColorMap:Ot,specularIntensityMap:Lt,transmission:Nt,transmissionMap:N,thicknessMap:bt,gradientMap:et,opaque:b.transparent===!1&&b.blending===ws&&b.alphaToCoverage===!1,alphaMap:ht,alphaTest:It,alphaHash:At,combine:b.combine,mapUv:Wt&&v(b.map.channel),aoMapUv:H&&v(b.aoMap.channel),lightMapUv:kt&&v(b.lightMap.channel),bumpMapUv:Rt&&v(b.bumpMap.channel),normalMapUv:_t&&v(b.normalMap.channel),displacementMapUv:vt&&v(b.displacementMap.channel),emissiveMapUv:gt&&v(b.emissiveMap.channel),metalnessMapUv:Pt&&v(b.metalnessMap.channel),roughnessMapUv:D&&v(b.roughnessMap.channel),anisotropyMapUv:Ct&&v(b.anisotropyMap.channel),clearcoatMapUv:wt&&v(b.clearcoatMap.channel),clearcoatNormalMapUv:$t&&v(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:yt&&v(b.clearcoatRoughnessMap.channel),iridescenceMapUv:zt&&v(b.iridescenceMap.channel),iridescenceThicknessMapUv:Z&&v(b.iridescenceThicknessMap.channel),sheenColorMapUv:V&&v(b.sheenColorMap.channel),sheenRoughnessMapUv:pt&&v(b.sheenRoughnessMap.channel),specularMapUv:Ht&&v(b.specularMap.channel),specularColorMapUv:Ot&&v(b.specularColorMap.channel),specularIntensityMapUv:Lt&&v(b.specularIntensityMap.channel),transmissionMapUv:N&&v(b.transmissionMap.channel),thicknessMapUv:bt&&v(b.thicknessMap.channel),alphaMapUv:ht&&v(b.alphaMap.channel),vertexTangents:!!L.attributes.tangent&&(_t||A),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!L.attributes.color&&L.attributes.color.itemSize===4,pointsUvs:R.isPoints===!0&&!!L.attributes.uv&&(Wt||ht),fog:!!U,useFog:b.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:K,skinning:R.isSkinnedMesh===!0,morphTargets:L.morphAttributes.position!==void 0,morphNormals:L.morphAttributes.normal!==void 0,morphColors:L.morphAttributes.color!==void 0,morphTargetsCount:mt,morphTextureStride:ft,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&C.length>0,shadowMapType:n.shadowMap.type,toneMapping:se,decodeVideoTexture:Wt&&b.map.isVideoTexture===!0&&Se.getTransfer(b.map.colorSpace)===ze,decodeVideoTextureEmissive:gt&&b.emissiveMap.isVideoTexture===!0&&Se.getTransfer(b.emissiveMap.colorSpace)===ze,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===We,flipSided:b.side===Wn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:jt&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(jt&&b.extensions.multiDraw===!0||Tt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return oe.vertexUv1s=l.has(1),oe.vertexUv2s=l.has(2),oe.vertexUv3s=l.has(3),l.clear(),oe}function p(b){const y=[];if(b.shaderID?y.push(b.shaderID):(y.push(b.customVertexShaderID),y.push(b.customFragmentShaderID)),b.defines!==void 0)for(const C in b.defines)y.push(C),y.push(b.defines[C]);return b.isRawShaderMaterial===!1&&(_(y,b),x(y,b),y.push(n.outputColorSpace)),y.push(b.customProgramCacheKey),y.join()}function _(b,y){b.push(y.precision),b.push(y.outputColorSpace),b.push(y.envMapMode),b.push(y.envMapCubeUVHeight),b.push(y.mapUv),b.push(y.alphaMapUv),b.push(y.lightMapUv),b.push(y.aoMapUv),b.push(y.bumpMapUv),b.push(y.normalMapUv),b.push(y.displacementMapUv),b.push(y.emissiveMapUv),b.push(y.metalnessMapUv),b.push(y.roughnessMapUv),b.push(y.anisotropyMapUv),b.push(y.clearcoatMapUv),b.push(y.clearcoatNormalMapUv),b.push(y.clearcoatRoughnessMapUv),b.push(y.iridescenceMapUv),b.push(y.iridescenceThicknessMapUv),b.push(y.sheenColorMapUv),b.push(y.sheenRoughnessMapUv),b.push(y.specularMapUv),b.push(y.specularColorMapUv),b.push(y.specularIntensityMapUv),b.push(y.transmissionMapUv),b.push(y.thicknessMapUv),b.push(y.combine),b.push(y.fogExp2),b.push(y.sizeAttenuation),b.push(y.morphTargetsCount),b.push(y.morphAttributeCount),b.push(y.numDirLights),b.push(y.numPointLights),b.push(y.numSpotLights),b.push(y.numSpotLightMaps),b.push(y.numHemiLights),b.push(y.numRectAreaLights),b.push(y.numDirLightShadows),b.push(y.numPointLightShadows),b.push(y.numSpotLightShadows),b.push(y.numSpotLightShadowsWithMaps),b.push(y.numLightProbes),b.push(y.shadowMapType),b.push(y.toneMapping),b.push(y.numClippingPlanes),b.push(y.numClipIntersection),b.push(y.depthPacking)}function x(b,y){r.disableAll(),y.supportsVertexTextures&&r.enable(0),y.instancing&&r.enable(1),y.instancingColor&&r.enable(2),y.instancingMorph&&r.enable(3),y.matcap&&r.enable(4),y.envMap&&r.enable(5),y.normalMapObjectSpace&&r.enable(6),y.normalMapTangentSpace&&r.enable(7),y.clearcoat&&r.enable(8),y.iridescence&&r.enable(9),y.alphaTest&&r.enable(10),y.vertexColors&&r.enable(11),y.vertexAlphas&&r.enable(12),y.vertexUv1s&&r.enable(13),y.vertexUv2s&&r.enable(14),y.vertexUv3s&&r.enable(15),y.vertexTangents&&r.enable(16),y.anisotropy&&r.enable(17),y.alphaHash&&r.enable(18),y.batching&&r.enable(19),y.dispersion&&r.enable(20),y.batchingColor&&r.enable(21),b.push(r.mask),r.disableAll(),y.fog&&r.enable(0),y.useFog&&r.enable(1),y.flatShading&&r.enable(2),y.logarithmicDepthBuffer&&r.enable(3),y.reverseDepthBuffer&&r.enable(4),y.skinning&&r.enable(5),y.morphTargets&&r.enable(6),y.morphNormals&&r.enable(7),y.morphColors&&r.enable(8),y.premultipliedAlpha&&r.enable(9),y.shadowMapEnabled&&r.enable(10),y.doubleSided&&r.enable(11),y.flipSided&&r.enable(12),y.useDepthPacking&&r.enable(13),y.dithering&&r.enable(14),y.transmission&&r.enable(15),y.sheen&&r.enable(16),y.opaque&&r.enable(17),y.pointsUvs&&r.enable(18),y.decodeVideoTexture&&r.enable(19),y.decodeVideoTextureEmissive&&r.enable(20),y.alphaToCoverage&&r.enable(21),b.push(r.mask)}function M(b){const y=m[b.type];let C;if(y){const I=wi[y];C=u1.clone(I.uniforms)}else C=b.uniforms;return C}function S(b,y){let C;for(let I=0,R=d.length;I<R;I++){const U=d[I];if(U.cacheKey===y){C=U,++C.usedTimes;break}}return C===void 0&&(C=new ET(n,y,b,s),d.push(C)),C}function w(b){if(--b.usedTimes===0){const y=d.indexOf(b);d[y]=d[d.length-1],d.pop(),b.destroy()}}function E(b){c.remove(b)}function T(){c.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:M,acquireProgram:S,releaseProgram:w,releaseShaderCache:E,programs:d,dispose:T}}function CT(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let r=n.get(o);return r===void 0&&(r={},n.set(o,r)),r}function i(o){n.delete(o)}function a(o,r,c){n.get(o)[r]=c}function s(){n=new WeakMap}return{has:t,get:e,remove:i,update:a,dispose:s}}function LT(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Lf(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Df(){const n=[];let t=0;const e=[],i=[],a=[];function s(){t=0,e.length=0,i.length=0,a.length=0}function o(u,h,f,m,v,g){let p=n[t];return p===void 0?(p={id:u.id,object:u,geometry:h,material:f,groupOrder:m,renderOrder:u.renderOrder,z:v,group:g},n[t]=p):(p.id=u.id,p.object=u,p.geometry=h,p.material=f,p.groupOrder=m,p.renderOrder=u.renderOrder,p.z=v,p.group=g),t++,p}function r(u,h,f,m,v,g){const p=o(u,h,f,m,v,g);f.transmission>0?i.push(p):f.transparent===!0?a.push(p):e.push(p)}function c(u,h,f,m,v,g){const p=o(u,h,f,m,v,g);f.transmission>0?i.unshift(p):f.transparent===!0?a.unshift(p):e.unshift(p)}function l(u,h){e.length>1&&e.sort(u||LT),i.length>1&&i.sort(h||Lf),a.length>1&&a.sort(h||Lf)}function d(){for(let u=t,h=n.length;u<h;u++){const f=n[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:i,transparent:a,init:s,push:r,unshift:c,finish:d,sort:l}}function DT(){let n=new WeakMap;function t(i,a){const s=n.get(i);let o;return s===void 0?(o=new Df,n.set(i,[o])):a>=s.length?(o=new Df,s.push(o)):o=s[a],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function kT(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new W,color:new te};break;case"SpotLight":e={position:new W,direction:new W,color:new te,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new W,color:new te,distance:0,decay:0};break;case"HemisphereLight":e={direction:new W,skyColor:new te,groundColor:new te};break;case"RectAreaLight":e={color:new te,position:new W,halfWidth:new W,halfHeight:new W};break}return n[t.id]=e,e}}}function IT(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Vt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Vt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Vt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let zT=0;function FT(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function UT(n){const t=new kT,e=IT(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new W);const a=new W,s=new Ae,o=new Ae;function r(l){let d=0,u=0,h=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let f=0,m=0,v=0,g=0,p=0,_=0,x=0,M=0,S=0,w=0,E=0;l.sort(FT);for(let b=0,y=l.length;b<y;b++){const C=l[b],I=C.color,R=C.intensity,U=C.distance,L=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)d+=I.r*R,u+=I.g*R,h+=I.b*R;else if(C.isLightProbe){for(let k=0;k<9;k++)i.probe[k].addScaledVector(C.sh.coefficients[k],R);E++}else if(C.isDirectionalLight){const k=t.get(C);if(k.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const B=C.shadow,G=e.get(C);G.shadowIntensity=B.intensity,G.shadowBias=B.bias,G.shadowNormalBias=B.normalBias,G.shadowRadius=B.radius,G.shadowMapSize=B.mapSize,i.directionalShadow[f]=G,i.directionalShadowMap[f]=L,i.directionalShadowMatrix[f]=C.shadow.matrix,_++}i.directional[f]=k,f++}else if(C.isSpotLight){const k=t.get(C);k.position.setFromMatrixPosition(C.matrixWorld),k.color.copy(I).multiplyScalar(R),k.distance=U,k.coneCos=Math.cos(C.angle),k.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),k.decay=C.decay,i.spot[v]=k;const B=C.shadow;if(C.map&&(i.spotLightMap[S]=C.map,S++,B.updateMatrices(C),C.castShadow&&w++),i.spotLightMatrix[v]=B.matrix,C.castShadow){const G=e.get(C);G.shadowIntensity=B.intensity,G.shadowBias=B.bias,G.shadowNormalBias=B.normalBias,G.shadowRadius=B.radius,G.shadowMapSize=B.mapSize,i.spotShadow[v]=G,i.spotShadowMap[v]=L,M++}v++}else if(C.isRectAreaLight){const k=t.get(C);k.color.copy(I).multiplyScalar(R),k.halfWidth.set(C.width*.5,0,0),k.halfHeight.set(0,C.height*.5,0),i.rectArea[g]=k,g++}else if(C.isPointLight){const k=t.get(C);if(k.color.copy(C.color).multiplyScalar(C.intensity),k.distance=C.distance,k.decay=C.decay,C.castShadow){const B=C.shadow,G=e.get(C);G.shadowIntensity=B.intensity,G.shadowBias=B.bias,G.shadowNormalBias=B.normalBias,G.shadowRadius=B.radius,G.shadowMapSize=B.mapSize,G.shadowCameraNear=B.camera.near,G.shadowCameraFar=B.camera.far,i.pointShadow[m]=G,i.pointShadowMap[m]=L,i.pointShadowMatrix[m]=C.shadow.matrix,x++}i.point[m]=k,m++}else if(C.isHemisphereLight){const k=t.get(C);k.skyColor.copy(C.color).multiplyScalar(R),k.groundColor.copy(C.groundColor).multiplyScalar(R),i.hemi[p]=k,p++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Xt.LTC_FLOAT_1,i.rectAreaLTC2=Xt.LTC_FLOAT_2):(i.rectAreaLTC1=Xt.LTC_HALF_1,i.rectAreaLTC2=Xt.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=u,i.ambient[2]=h;const T=i.hash;(T.directionalLength!==f||T.pointLength!==m||T.spotLength!==v||T.rectAreaLength!==g||T.hemiLength!==p||T.numDirectionalShadows!==_||T.numPointShadows!==x||T.numSpotShadows!==M||T.numSpotMaps!==S||T.numLightProbes!==E)&&(i.directional.length=f,i.spot.length=v,i.rectArea.length=g,i.point.length=m,i.hemi.length=p,i.directionalShadow.length=_,i.directionalShadowMap.length=_,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=M,i.spotShadowMap.length=M,i.directionalShadowMatrix.length=_,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=M+S-w,i.spotLightMap.length=S,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=E,T.directionalLength=f,T.pointLength=m,T.spotLength=v,T.rectAreaLength=g,T.hemiLength=p,T.numDirectionalShadows=_,T.numPointShadows=x,T.numSpotShadows=M,T.numSpotMaps=S,T.numLightProbes=E,i.version=zT++)}function c(l,d){let u=0,h=0,f=0,m=0,v=0;const g=d.matrixWorldInverse;for(let p=0,_=l.length;p<_;p++){const x=l[p];if(x.isDirectionalLight){const M=i.directional[u];M.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),M.direction.sub(a),M.direction.transformDirection(g),u++}else if(x.isSpotLight){const M=i.spot[f];M.position.setFromMatrixPosition(x.matrixWorld),M.position.applyMatrix4(g),M.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),M.direction.sub(a),M.direction.transformDirection(g),f++}else if(x.isRectAreaLight){const M=i.rectArea[m];M.position.setFromMatrixPosition(x.matrixWorld),M.position.applyMatrix4(g),o.identity(),s.copy(x.matrixWorld),s.premultiply(g),o.extractRotation(s),M.halfWidth.set(x.width*.5,0,0),M.halfHeight.set(0,x.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),m++}else if(x.isPointLight){const M=i.point[h];M.position.setFromMatrixPosition(x.matrixWorld),M.position.applyMatrix4(g),h++}else if(x.isHemisphereLight){const M=i.hemi[v];M.direction.setFromMatrixPosition(x.matrixWorld),M.direction.transformDirection(g),v++}}}return{setup:r,setupView:c,state:i}}function kf(n){const t=new UT(n),e=[],i=[];function a(d){l.camera=d,e.length=0,i.length=0}function s(d){e.push(d)}function o(d){i.push(d)}function r(){t.setup(e)}function c(d){t.setupView(e,d)}const l={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:a,state:l,setupLights:r,setupLightsView:c,pushLight:s,pushShadow:o}}function NT(n){let t=new WeakMap;function e(a,s=0){const o=t.get(a);let r;return o===void 0?(r=new kf(n),t.set(a,[r])):s>=o.length?(r=new kf(n),o.push(r)):r=o[s],r}function i(){t=new WeakMap}return{get:e,dispose:i}}class OT extends Wa{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Mb,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class BT extends Wa{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const HT=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,GT=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function XT(n,t,e){let i=new cd;const a=new Vt,s=new Vt,o=new nn,r=new OT({depthPacking:_b}),c=new BT,l={},d=e.maxTextureSize,u={[pa]:Wn,[Wn]:pa,[We]:We},h=new ma({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Vt},radius:{value:4}},vertexShader:HT,fragmentShader:GT}),f=h.clone();f.defines.HORIZONTAL_PASS=1;const m=new Je;m.setAttribute("position",new _n(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new me(m,h),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=im;let p=this.type;this.render=function(w,E,T){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||w.length===0)return;const b=n.getRenderTarget(),y=n.getActiveCubeFace(),C=n.getActiveMipmapLevel(),I=n.state;I.setBlending(ha),I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const R=p!==Hi&&this.type===Hi,U=p===Hi&&this.type!==Hi;for(let L=0,k=w.length;L<k;L++){const B=w[L],G=B.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",B,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;a.copy(G.mapSize);const $=G.getFrameExtents();if(a.multiply($),s.copy(G.mapSize),(a.x>d||a.y>d)&&(a.x>d&&(s.x=Math.floor(d/$.x),a.x=s.x*$.x,G.mapSize.x=s.x),a.y>d&&(s.y=Math.floor(d/$.y),a.y=s.y*$.y,G.mapSize.y=s.y)),G.map===null||R===!0||U===!0){const mt=this.type!==Hi?{minFilter:ei,magFilter:ei}:{};G.map!==null&&G.map.dispose(),G.map=new Ga(a.x,a.y,mt),G.map.texture.name=B.name+".shadowMap",G.camera.updateProjectionMatrix()}n.setRenderTarget(G.map),n.clear();const at=G.getViewportCount();for(let mt=0;mt<at;mt++){const ft=G.getViewport(mt);o.set(s.x*ft.x,s.y*ft.y,s.x*ft.z,s.y*ft.w),I.viewport(o),G.updateMatrices(B,mt),i=G.getFrustum(),M(E,T,G.camera,B,this.type)}G.isPointLightShadow!==!0&&this.type===Hi&&_(G,T),G.needsUpdate=!1}p=this.type,g.needsUpdate=!1,n.setRenderTarget(b,y,C)};function _(w,E){const T=t.update(v);h.defines.VSM_SAMPLES!==w.blurSamples&&(h.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new Ga(a.x,a.y)),h.uniforms.shadow_pass.value=w.map.texture,h.uniforms.resolution.value=w.mapSize,h.uniforms.radius.value=w.radius,n.setRenderTarget(w.mapPass),n.clear(),n.renderBufferDirect(E,null,T,h,v,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,n.setRenderTarget(w.map),n.clear(),n.renderBufferDirect(E,null,T,f,v,null)}function x(w,E,T,b){let y=null;const C=T.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(C!==void 0)y=C;else if(y=T.isPointLight===!0?c:r,n.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const I=y.uuid,R=E.uuid;let U=l[I];U===void 0&&(U={},l[I]=U);let L=U[R];L===void 0&&(L=y.clone(),U[R]=L,E.addEventListener("dispose",S)),y=L}if(y.visible=E.visible,y.wireframe=E.wireframe,b===Hi?y.side=E.shadowSide!==null?E.shadowSide:E.side:y.side=E.shadowSide!==null?E.shadowSide:u[E.side],y.alphaMap=E.alphaMap,y.alphaTest=E.alphaTest,y.map=E.map,y.clipShadows=E.clipShadows,y.clippingPlanes=E.clippingPlanes,y.clipIntersection=E.clipIntersection,y.displacementMap=E.displacementMap,y.displacementScale=E.displacementScale,y.displacementBias=E.displacementBias,y.wireframeLinewidth=E.wireframeLinewidth,y.linewidth=E.linewidth,T.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const I=n.properties.get(y);I.light=T}return y}function M(w,E,T,b,y){if(w.visible===!1)return;if(w.layers.test(E.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&y===Hi)&&(!w.frustumCulled||i.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,w.matrixWorld);const R=t.update(w),U=w.material;if(Array.isArray(U)){const L=R.groups;for(let k=0,B=L.length;k<B;k++){const G=L[k],$=U[G.materialIndex];if($&&$.visible){const at=x(w,$,b,y);w.onBeforeShadow(n,w,E,T,R,at,G),n.renderBufferDirect(T,null,R,at,w,G),w.onAfterShadow(n,w,E,T,R,at,G)}}}else if(U.visible){const L=x(w,U,b,y);w.onBeforeShadow(n,w,E,T,R,L,null),n.renderBufferDirect(T,null,R,L,w,null),w.onAfterShadow(n,w,E,T,R,L,null)}}const I=w.children;for(let R=0,U=I.length;R<U;R++)M(I[R],E,T,b,y)}function S(w){w.target.removeEventListener("dispose",S);for(const T in l){const b=l[T],y=w.target.uuid;y in b&&(b[y].dispose(),delete b[y])}}}const VT={[$l]:Zl,[jl]:Jl,[ql]:Ql,[Ds]:Kl,[Zl]:$l,[Jl]:jl,[Ql]:ql,[Kl]:Ds};function WT(n,t){function e(){let N=!1;const bt=new nn;let et=null;const ht=new nn(0,0,0,0);return{setMask:function(It){et!==It&&!N&&(n.colorMask(It,It,It,It),et=It)},setLocked:function(It){N=It},setClear:function(It,At,jt,se,oe){oe===!0&&(It*=se,At*=se,jt*=se),bt.set(It,At,jt,se),ht.equals(bt)===!1&&(n.clearColor(It,At,jt,se),ht.copy(bt))},reset:function(){N=!1,et=null,ht.set(-1,0,0,0)}}}function i(){let N=!1,bt=!1,et=null,ht=null,It=null;return{setReversed:function(At){if(bt!==At){const jt=t.get("EXT_clip_control");bt?jt.clipControlEXT(jt.LOWER_LEFT_EXT,jt.ZERO_TO_ONE_EXT):jt.clipControlEXT(jt.LOWER_LEFT_EXT,jt.NEGATIVE_ONE_TO_ONE_EXT);const se=It;It=null,this.setClear(se)}bt=At},getReversed:function(){return bt},setTest:function(At){At?J(n.DEPTH_TEST):K(n.DEPTH_TEST)},setMask:function(At){et!==At&&!N&&(n.depthMask(At),et=At)},setFunc:function(At){if(bt&&(At=VT[At]),ht!==At){switch(At){case $l:n.depthFunc(n.NEVER);break;case Zl:n.depthFunc(n.ALWAYS);break;case jl:n.depthFunc(n.LESS);break;case Ds:n.depthFunc(n.LEQUAL);break;case ql:n.depthFunc(n.EQUAL);break;case Kl:n.depthFunc(n.GEQUAL);break;case Jl:n.depthFunc(n.GREATER);break;case Ql:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ht=At}},setLocked:function(At){N=At},setClear:function(At){It!==At&&(bt&&(At=1-At),n.clearDepth(At),It=At)},reset:function(){N=!1,et=null,ht=null,It=null,bt=!1}}}function a(){let N=!1,bt=null,et=null,ht=null,It=null,At=null,jt=null,se=null,oe=null;return{setTest:function(ee){N||(ee?J(n.STENCIL_TEST):K(n.STENCIL_TEST))},setMask:function(ee){bt!==ee&&!N&&(n.stencilMask(ee),bt=ee)},setFunc:function(ee,ye,we){(et!==ee||ht!==ye||It!==we)&&(n.stencilFunc(ee,ye,we),et=ee,ht=ye,It=we)},setOp:function(ee,ye,we){(At!==ee||jt!==ye||se!==we)&&(n.stencilOp(ee,ye,we),At=ee,jt=ye,se=we)},setLocked:function(ee){N=ee},setClear:function(ee){oe!==ee&&(n.clearStencil(ee),oe=ee)},reset:function(){N=!1,bt=null,et=null,ht=null,It=null,At=null,jt=null,se=null,oe=null}}}const s=new e,o=new i,r=new a,c=new WeakMap,l=new WeakMap;let d={},u={},h=new WeakMap,f=[],m=null,v=!1,g=null,p=null,_=null,x=null,M=null,S=null,w=null,E=new te(0,0,0),T=0,b=!1,y=null,C=null,I=null,R=null,U=null;const L=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,B=0;const G=n.getParameter(n.VERSION);G.indexOf("WebGL")!==-1?(B=parseFloat(/^WebGL (\d)/.exec(G)[1]),k=B>=1):G.indexOf("OpenGL ES")!==-1&&(B=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),k=B>=2);let $=null,at={};const mt=n.getParameter(n.SCISSOR_BOX),ft=n.getParameter(n.VIEWPORT),Dt=new nn().fromArray(mt),j=new nn().fromArray(ft);function F(N,bt,et,ht){const It=new Uint8Array(4),At=n.createTexture();n.bindTexture(N,At),n.texParameteri(N,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(N,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let jt=0;jt<et;jt++)N===n.TEXTURE_3D||N===n.TEXTURE_2D_ARRAY?n.texImage3D(bt,0,n.RGBA,1,1,ht,0,n.RGBA,n.UNSIGNED_BYTE,It):n.texImage2D(bt+jt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,It);return At}const Y={};Y[n.TEXTURE_2D]=F(n.TEXTURE_2D,n.TEXTURE_2D,1),Y[n.TEXTURE_CUBE_MAP]=F(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[n.TEXTURE_2D_ARRAY]=F(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Y[n.TEXTURE_3D]=F(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),r.setClear(0),J(n.DEPTH_TEST),o.setFunc(Ds),Rt(!1),_t(Fu),J(n.CULL_FACE),H(ha);function J(N){d[N]!==!0&&(n.enable(N),d[N]=!0)}function K(N){d[N]!==!1&&(n.disable(N),d[N]=!1)}function st(N,bt){return u[N]!==bt?(n.bindFramebuffer(N,bt),u[N]=bt,N===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=bt),N===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=bt),!0):!1}function Tt(N,bt){let et=f,ht=!1;if(N){et=h.get(bt),et===void 0&&(et=[],h.set(bt,et));const It=N.textures;if(et.length!==It.length||et[0]!==n.COLOR_ATTACHMENT0){for(let At=0,jt=It.length;At<jt;At++)et[At]=n.COLOR_ATTACHMENT0+At;et.length=It.length,ht=!0}}else et[0]!==n.BACK&&(et[0]=n.BACK,ht=!0);ht&&n.drawBuffers(et)}function Wt(N){return m!==N?(n.useProgram(N),m=N,!0):!1}const dt={[za]:n.FUNC_ADD,[$_]:n.FUNC_SUBTRACT,[Z_]:n.FUNC_REVERSE_SUBTRACT};dt[j_]=n.MIN,dt[q_]=n.MAX;const X={[K_]:n.ZERO,[J_]:n.ONE,[Q_]:n.SRC_COLOR,[Wl]:n.SRC_ALPHA,[sb]:n.SRC_ALPHA_SATURATE,[ib]:n.DST_COLOR,[eb]:n.DST_ALPHA,[tb]:n.ONE_MINUS_SRC_COLOR,[Yl]:n.ONE_MINUS_SRC_ALPHA,[ab]:n.ONE_MINUS_DST_COLOR,[nb]:n.ONE_MINUS_DST_ALPHA,[ob]:n.CONSTANT_COLOR,[rb]:n.ONE_MINUS_CONSTANT_COLOR,[cb]:n.CONSTANT_ALPHA,[lb]:n.ONE_MINUS_CONSTANT_ALPHA};function H(N,bt,et,ht,It,At,jt,se,oe,ee){if(N===ha){v===!0&&(K(n.BLEND),v=!1);return}if(v===!1&&(J(n.BLEND),v=!0),N!==Y_){if(N!==g||ee!==b){if((p!==za||M!==za)&&(n.blendEquation(n.FUNC_ADD),p=za,M=za),ee)switch(N){case ws:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Xi:n.blendFunc(n.ONE,n.ONE);break;case Uu:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Nu:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case ws:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Xi:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Uu:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Nu:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}_=null,x=null,S=null,w=null,E.set(0,0,0),T=0,g=N,b=ee}return}It=It||bt,At=At||et,jt=jt||ht,(bt!==p||It!==M)&&(n.blendEquationSeparate(dt[bt],dt[It]),p=bt,M=It),(et!==_||ht!==x||At!==S||jt!==w)&&(n.blendFuncSeparate(X[et],X[ht],X[At],X[jt]),_=et,x=ht,S=At,w=jt),(se.equals(E)===!1||oe!==T)&&(n.blendColor(se.r,se.g,se.b,oe),E.copy(se),T=oe),g=N,b=!1}function kt(N,bt){N.side===We?K(n.CULL_FACE):J(n.CULL_FACE);let et=N.side===Wn;bt&&(et=!et),Rt(et),N.blending===ws&&N.transparent===!1?H(ha):H(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),s.setMask(N.colorWrite);const ht=N.stencilWrite;r.setTest(ht),ht&&(r.setMask(N.stencilWriteMask),r.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),r.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),gt(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?J(n.SAMPLE_ALPHA_TO_COVERAGE):K(n.SAMPLE_ALPHA_TO_COVERAGE)}function Rt(N){y!==N&&(N?n.frontFace(n.CW):n.frontFace(n.CCW),y=N)}function _t(N){N!==V_?(J(n.CULL_FACE),N!==C&&(N===Fu?n.cullFace(n.BACK):N===W_?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):K(n.CULL_FACE),C=N}function vt(N){N!==I&&(k&&n.lineWidth(N),I=N)}function gt(N,bt,et){N?(J(n.POLYGON_OFFSET_FILL),(R!==bt||U!==et)&&(n.polygonOffset(bt,et),R=bt,U=et)):K(n.POLYGON_OFFSET_FILL)}function Pt(N){N?J(n.SCISSOR_TEST):K(n.SCISSOR_TEST)}function D(N){N===void 0&&(N=n.TEXTURE0+L-1),$!==N&&(n.activeTexture(N),$=N)}function A(N,bt,et){et===void 0&&($===null?et=n.TEXTURE0+L-1:et=$);let ht=at[et];ht===void 0&&(ht={type:void 0,texture:void 0},at[et]=ht),(ht.type!==N||ht.texture!==bt)&&($!==et&&(n.activeTexture(et),$=et),n.bindTexture(N,bt||Y[N]),ht.type=N,ht.texture=bt)}function q(){const N=at[$];N!==void 0&&N.type!==void 0&&(n.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function ut(){try{n.compressedTexImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function it(){try{n.compressedTexImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function lt(){try{n.texSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Nt(){try{n.texSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ct(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function wt(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function $t(){try{n.texStorage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function yt(){try{n.texStorage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function zt(){try{n.texImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Z(){try{n.texImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function V(N){Dt.equals(N)===!1&&(n.scissor(N.x,N.y,N.z,N.w),Dt.copy(N))}function pt(N){j.equals(N)===!1&&(n.viewport(N.x,N.y,N.z,N.w),j.copy(N))}function Ht(N,bt){let et=l.get(bt);et===void 0&&(et=new WeakMap,l.set(bt,et));let ht=et.get(N);ht===void 0&&(ht=n.getUniformBlockIndex(bt,N.name),et.set(N,ht))}function Ot(N,bt){const ht=l.get(bt).get(N);c.get(bt)!==ht&&(n.uniformBlockBinding(bt,ht,N.__bindingPointIndex),c.set(bt,ht))}function Lt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},$=null,at={},u={},h=new WeakMap,f=[],m=null,v=!1,g=null,p=null,_=null,x=null,M=null,S=null,w=null,E=new te(0,0,0),T=0,b=!1,y=null,C=null,I=null,R=null,U=null,Dt.set(0,0,n.canvas.width,n.canvas.height),j.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),r.reset()}return{buffers:{color:s,depth:o,stencil:r},enable:J,disable:K,bindFramebuffer:st,drawBuffers:Tt,useProgram:Wt,setBlending:H,setMaterial:kt,setFlipSided:Rt,setCullFace:_t,setLineWidth:vt,setPolygonOffset:gt,setScissorTest:Pt,activeTexture:D,bindTexture:A,unbindTexture:q,compressedTexImage2D:ut,compressedTexImage3D:it,texImage2D:zt,texImage3D:Z,updateUBOMapping:Ht,uniformBlockBinding:Ot,texStorage2D:$t,texStorage3D:yt,texSubImage2D:lt,texSubImage3D:Nt,compressedTexSubImage2D:Ct,compressedTexSubImage3D:wt,scissor:V,viewport:pt,reset:Lt}}function If(n,t,e,i){const a=YT(i);switch(e){case lm:return n*t;case dm:return n*t;case um:return n*t*2;case ed:return n*t/a.components*a.byteLength;case nd:return n*t/a.components*a.byteLength;case fm:return n*t*2/a.components*a.byteLength;case id:return n*t*2/a.components*a.byteLength;case hm:return n*t*3/a.components*a.byteLength;case gi:return n*t*4/a.components*a.byteLength;case ad:return n*t*4/a.components*a.byteLength;case Dr:case kr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Ir:case zr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case sh:case rh:return Math.max(n,16)*Math.max(t,8)/4;case ah:case oh:return Math.max(n,8)*Math.max(t,8)/2;case ch:case lh:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case hh:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case dh:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case uh:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case fh:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case ph:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case mh:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case gh:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case xh:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case vh:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case yh:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Mh:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case _h:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case bh:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case Sh:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case wh:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case Fr:case Eh:case Th:return Math.ceil(n/4)*Math.ceil(t/4)*16;case pm:case Ah:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Rh:case Ph:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function YT(n){switch(n){case $i:case om:return{byteLength:1,components:1};case Lo:case rm:case No:return{byteLength:2,components:1};case Qh:case td:return{byteLength:2,components:4};case Ha:case Jh:case Ti:return{byteLength:4,components:1};case cm:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function $T(n,t,e,i,a,s,o){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Vt,d=new WeakMap;let u;const h=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(D,A){return f?new OffscreenCanvas(D,A):Jr("canvas")}function v(D,A,q){let ut=1;const it=Pt(D);if((it.width>q||it.height>q)&&(ut=q/Math.max(it.width,it.height)),ut<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const lt=Math.floor(ut*it.width),Nt=Math.floor(ut*it.height);u===void 0&&(u=m(lt,Nt));const Ct=A?m(lt,Nt):u;return Ct.width=lt,Ct.height=Nt,Ct.getContext("2d").drawImage(D,0,0,lt,Nt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+it.width+"x"+it.height+") to ("+lt+"x"+Nt+")."),Ct}else return"data"in D&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+it.width+"x"+it.height+")."),D;return D}function g(D){return D.generateMipmaps}function p(D){n.generateMipmap(D)}function _(D){return D.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?n.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(D,A,q,ut,it=!1){if(D!==null){if(n[D]!==void 0)return n[D];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let lt=A;if(A===n.RED&&(q===n.FLOAT&&(lt=n.R32F),q===n.HALF_FLOAT&&(lt=n.R16F),q===n.UNSIGNED_BYTE&&(lt=n.R8)),A===n.RED_INTEGER&&(q===n.UNSIGNED_BYTE&&(lt=n.R8UI),q===n.UNSIGNED_SHORT&&(lt=n.R16UI),q===n.UNSIGNED_INT&&(lt=n.R32UI),q===n.BYTE&&(lt=n.R8I),q===n.SHORT&&(lt=n.R16I),q===n.INT&&(lt=n.R32I)),A===n.RG&&(q===n.FLOAT&&(lt=n.RG32F),q===n.HALF_FLOAT&&(lt=n.RG16F),q===n.UNSIGNED_BYTE&&(lt=n.RG8)),A===n.RG_INTEGER&&(q===n.UNSIGNED_BYTE&&(lt=n.RG8UI),q===n.UNSIGNED_SHORT&&(lt=n.RG16UI),q===n.UNSIGNED_INT&&(lt=n.RG32UI),q===n.BYTE&&(lt=n.RG8I),q===n.SHORT&&(lt=n.RG16I),q===n.INT&&(lt=n.RG32I)),A===n.RGB_INTEGER&&(q===n.UNSIGNED_BYTE&&(lt=n.RGB8UI),q===n.UNSIGNED_SHORT&&(lt=n.RGB16UI),q===n.UNSIGNED_INT&&(lt=n.RGB32UI),q===n.BYTE&&(lt=n.RGB8I),q===n.SHORT&&(lt=n.RGB16I),q===n.INT&&(lt=n.RGB32I)),A===n.RGBA_INTEGER&&(q===n.UNSIGNED_BYTE&&(lt=n.RGBA8UI),q===n.UNSIGNED_SHORT&&(lt=n.RGBA16UI),q===n.UNSIGNED_INT&&(lt=n.RGBA32UI),q===n.BYTE&&(lt=n.RGBA8I),q===n.SHORT&&(lt=n.RGBA16I),q===n.INT&&(lt=n.RGBA32I)),A===n.RGB&&q===n.UNSIGNED_INT_5_9_9_9_REV&&(lt=n.RGB9_E5),A===n.RGBA){const Nt=it?dc:Se.getTransfer(ut);q===n.FLOAT&&(lt=n.RGBA32F),q===n.HALF_FLOAT&&(lt=n.RGBA16F),q===n.UNSIGNED_BYTE&&(lt=Nt===ze?n.SRGB8_ALPHA8:n.RGBA8),q===n.UNSIGNED_SHORT_4_4_4_4&&(lt=n.RGBA4),q===n.UNSIGNED_SHORT_5_5_5_1&&(lt=n.RGB5_A1)}return(lt===n.R16F||lt===n.R32F||lt===n.RG16F||lt===n.RG32F||lt===n.RGBA16F||lt===n.RGBA32F)&&t.get("EXT_color_buffer_float"),lt}function M(D,A){let q;return D?A===null||A===Ha||A===zs?q=n.DEPTH24_STENCIL8:A===Ti?q=n.DEPTH32F_STENCIL8:A===Lo&&(q=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===Ha||A===zs?q=n.DEPTH_COMPONENT24:A===Ti?q=n.DEPTH_COMPONENT32F:A===Lo&&(q=n.DEPTH_COMPONENT16),q}function S(D,A){return g(D)===!0||D.isFramebufferTexture&&D.minFilter!==ei&&D.minFilter!==Ei?Math.log2(Math.max(A.width,A.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?A.mipmaps.length:1}function w(D){const A=D.target;A.removeEventListener("dispose",w),T(A),A.isVideoTexture&&d.delete(A)}function E(D){const A=D.target;A.removeEventListener("dispose",E),y(A)}function T(D){const A=i.get(D);if(A.__webglInit===void 0)return;const q=D.source,ut=h.get(q);if(ut){const it=ut[A.__cacheKey];it.usedTimes--,it.usedTimes===0&&b(D),Object.keys(ut).length===0&&h.delete(q)}i.remove(D)}function b(D){const A=i.get(D);n.deleteTexture(A.__webglTexture);const q=D.source,ut=h.get(q);delete ut[A.__cacheKey],o.memory.textures--}function y(D){const A=i.get(D);if(D.depthTexture&&(D.depthTexture.dispose(),i.remove(D.depthTexture)),D.isWebGLCubeRenderTarget)for(let ut=0;ut<6;ut++){if(Array.isArray(A.__webglFramebuffer[ut]))for(let it=0;it<A.__webglFramebuffer[ut].length;it++)n.deleteFramebuffer(A.__webglFramebuffer[ut][it]);else n.deleteFramebuffer(A.__webglFramebuffer[ut]);A.__webglDepthbuffer&&n.deleteRenderbuffer(A.__webglDepthbuffer[ut])}else{if(Array.isArray(A.__webglFramebuffer))for(let ut=0;ut<A.__webglFramebuffer.length;ut++)n.deleteFramebuffer(A.__webglFramebuffer[ut]);else n.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&n.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&n.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let ut=0;ut<A.__webglColorRenderbuffer.length;ut++)A.__webglColorRenderbuffer[ut]&&n.deleteRenderbuffer(A.__webglColorRenderbuffer[ut]);A.__webglDepthRenderbuffer&&n.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const q=D.textures;for(let ut=0,it=q.length;ut<it;ut++){const lt=i.get(q[ut]);lt.__webglTexture&&(n.deleteTexture(lt.__webglTexture),o.memory.textures--),i.remove(q[ut])}i.remove(D)}let C=0;function I(){C=0}function R(){const D=C;return D>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+D+" texture units while this GPU supports only "+a.maxTextures),C+=1,D}function U(D){const A=[];return A.push(D.wrapS),A.push(D.wrapT),A.push(D.wrapR||0),A.push(D.magFilter),A.push(D.minFilter),A.push(D.anisotropy),A.push(D.internalFormat),A.push(D.format),A.push(D.type),A.push(D.generateMipmaps),A.push(D.premultiplyAlpha),A.push(D.flipY),A.push(D.unpackAlignment),A.push(D.colorSpace),A.join()}function L(D,A){const q=i.get(D);if(D.isVideoTexture&&vt(D),D.isRenderTargetTexture===!1&&D.version>0&&q.__version!==D.version){const ut=D.image;if(ut===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ut.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{j(q,D,A);return}}e.bindTexture(n.TEXTURE_2D,q.__webglTexture,n.TEXTURE0+A)}function k(D,A){const q=i.get(D);if(D.version>0&&q.__version!==D.version){j(q,D,A);return}e.bindTexture(n.TEXTURE_2D_ARRAY,q.__webglTexture,n.TEXTURE0+A)}function B(D,A){const q=i.get(D);if(D.version>0&&q.__version!==D.version){j(q,D,A);return}e.bindTexture(n.TEXTURE_3D,q.__webglTexture,n.TEXTURE0+A)}function G(D,A){const q=i.get(D);if(D.version>0&&q.__version!==D.version){F(q,D,A);return}e.bindTexture(n.TEXTURE_CUBE_MAP,q.__webglTexture,n.TEXTURE0+A)}const $={[nh]:n.REPEAT,[Ua]:n.CLAMP_TO_EDGE,[ih]:n.MIRRORED_REPEAT},at={[ei]:n.NEAREST,[yb]:n.NEAREST_MIPMAP_NEAREST,[qo]:n.NEAREST_MIPMAP_LINEAR,[Ei]:n.LINEAR,[Xc]:n.LINEAR_MIPMAP_NEAREST,[Na]:n.LINEAR_MIPMAP_LINEAR},mt={[Sb]:n.NEVER,[Pb]:n.ALWAYS,[wb]:n.LESS,[gm]:n.LEQUAL,[Eb]:n.EQUAL,[Rb]:n.GEQUAL,[Tb]:n.GREATER,[Ab]:n.NOTEQUAL};function ft(D,A){if(A.type===Ti&&t.has("OES_texture_float_linear")===!1&&(A.magFilter===Ei||A.magFilter===Xc||A.magFilter===qo||A.magFilter===Na||A.minFilter===Ei||A.minFilter===Xc||A.minFilter===qo||A.minFilter===Na)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(D,n.TEXTURE_WRAP_S,$[A.wrapS]),n.texParameteri(D,n.TEXTURE_WRAP_T,$[A.wrapT]),(D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY)&&n.texParameteri(D,n.TEXTURE_WRAP_R,$[A.wrapR]),n.texParameteri(D,n.TEXTURE_MAG_FILTER,at[A.magFilter]),n.texParameteri(D,n.TEXTURE_MIN_FILTER,at[A.minFilter]),A.compareFunction&&(n.texParameteri(D,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(D,n.TEXTURE_COMPARE_FUNC,mt[A.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===ei||A.minFilter!==qo&&A.minFilter!==Na||A.type===Ti&&t.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||i.get(A).__currentAnisotropy){const q=t.get("EXT_texture_filter_anisotropic");n.texParameterf(D,q.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,a.getMaxAnisotropy())),i.get(A).__currentAnisotropy=A.anisotropy}}}function Dt(D,A){let q=!1;D.__webglInit===void 0&&(D.__webglInit=!0,A.addEventListener("dispose",w));const ut=A.source;let it=h.get(ut);it===void 0&&(it={},h.set(ut,it));const lt=U(A);if(lt!==D.__cacheKey){it[lt]===void 0&&(it[lt]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,q=!0),it[lt].usedTimes++;const Nt=it[D.__cacheKey];Nt!==void 0&&(it[D.__cacheKey].usedTimes--,Nt.usedTimes===0&&b(A)),D.__cacheKey=lt,D.__webglTexture=it[lt].texture}return q}function j(D,A,q){let ut=n.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(ut=n.TEXTURE_2D_ARRAY),A.isData3DTexture&&(ut=n.TEXTURE_3D);const it=Dt(D,A),lt=A.source;e.bindTexture(ut,D.__webglTexture,n.TEXTURE0+q);const Nt=i.get(lt);if(lt.version!==Nt.__version||it===!0){e.activeTexture(n.TEXTURE0+q);const Ct=Se.getPrimaries(Se.workingColorSpace),wt=A.colorSpace===sa?null:Se.getPrimaries(A.colorSpace),$t=A.colorSpace===sa||Ct===wt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,$t);let yt=v(A.image,!1,a.maxTextureSize);yt=gt(A,yt);const zt=s.convert(A.format,A.colorSpace),Z=s.convert(A.type);let V=x(A.internalFormat,zt,Z,A.colorSpace,A.isVideoTexture);ft(ut,A);let pt;const Ht=A.mipmaps,Ot=A.isVideoTexture!==!0,Lt=Nt.__version===void 0||it===!0,N=lt.dataReady,bt=S(A,yt);if(A.isDepthTexture)V=M(A.format===Fs,A.type),Lt&&(Ot?e.texStorage2D(n.TEXTURE_2D,1,V,yt.width,yt.height):e.texImage2D(n.TEXTURE_2D,0,V,yt.width,yt.height,0,zt,Z,null));else if(A.isDataTexture)if(Ht.length>0){Ot&&Lt&&e.texStorage2D(n.TEXTURE_2D,bt,V,Ht[0].width,Ht[0].height);for(let et=0,ht=Ht.length;et<ht;et++)pt=Ht[et],Ot?N&&e.texSubImage2D(n.TEXTURE_2D,et,0,0,pt.width,pt.height,zt,Z,pt.data):e.texImage2D(n.TEXTURE_2D,et,V,pt.width,pt.height,0,zt,Z,pt.data);A.generateMipmaps=!1}else Ot?(Lt&&e.texStorage2D(n.TEXTURE_2D,bt,V,yt.width,yt.height),N&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,yt.width,yt.height,zt,Z,yt.data)):e.texImage2D(n.TEXTURE_2D,0,V,yt.width,yt.height,0,zt,Z,yt.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){Ot&&Lt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,bt,V,Ht[0].width,Ht[0].height,yt.depth);for(let et=0,ht=Ht.length;et<ht;et++)if(pt=Ht[et],A.format!==gi)if(zt!==null)if(Ot){if(N)if(A.layerUpdates.size>0){const It=If(pt.width,pt.height,A.format,A.type);for(const At of A.layerUpdates){const jt=pt.data.subarray(At*It/pt.data.BYTES_PER_ELEMENT,(At+1)*It/pt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,et,0,0,At,pt.width,pt.height,1,zt,jt)}A.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,et,0,0,0,pt.width,pt.height,yt.depth,zt,pt.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,et,V,pt.width,pt.height,yt.depth,0,pt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ot?N&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,et,0,0,0,pt.width,pt.height,yt.depth,zt,Z,pt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,et,V,pt.width,pt.height,yt.depth,0,zt,Z,pt.data)}else{Ot&&Lt&&e.texStorage2D(n.TEXTURE_2D,bt,V,Ht[0].width,Ht[0].height);for(let et=0,ht=Ht.length;et<ht;et++)pt=Ht[et],A.format!==gi?zt!==null?Ot?N&&e.compressedTexSubImage2D(n.TEXTURE_2D,et,0,0,pt.width,pt.height,zt,pt.data):e.compressedTexImage2D(n.TEXTURE_2D,et,V,pt.width,pt.height,0,pt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ot?N&&e.texSubImage2D(n.TEXTURE_2D,et,0,0,pt.width,pt.height,zt,Z,pt.data):e.texImage2D(n.TEXTURE_2D,et,V,pt.width,pt.height,0,zt,Z,pt.data)}else if(A.isDataArrayTexture)if(Ot){if(Lt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,bt,V,yt.width,yt.height,yt.depth),N)if(A.layerUpdates.size>0){const et=If(yt.width,yt.height,A.format,A.type);for(const ht of A.layerUpdates){const It=yt.data.subarray(ht*et/yt.data.BYTES_PER_ELEMENT,(ht+1)*et/yt.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ht,yt.width,yt.height,1,zt,Z,It)}A.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,yt.width,yt.height,yt.depth,zt,Z,yt.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,V,yt.width,yt.height,yt.depth,0,zt,Z,yt.data);else if(A.isData3DTexture)Ot?(Lt&&e.texStorage3D(n.TEXTURE_3D,bt,V,yt.width,yt.height,yt.depth),N&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,yt.width,yt.height,yt.depth,zt,Z,yt.data)):e.texImage3D(n.TEXTURE_3D,0,V,yt.width,yt.height,yt.depth,0,zt,Z,yt.data);else if(A.isFramebufferTexture){if(Lt)if(Ot)e.texStorage2D(n.TEXTURE_2D,bt,V,yt.width,yt.height);else{let et=yt.width,ht=yt.height;for(let It=0;It<bt;It++)e.texImage2D(n.TEXTURE_2D,It,V,et,ht,0,zt,Z,null),et>>=1,ht>>=1}}else if(Ht.length>0){if(Ot&&Lt){const et=Pt(Ht[0]);e.texStorage2D(n.TEXTURE_2D,bt,V,et.width,et.height)}for(let et=0,ht=Ht.length;et<ht;et++)pt=Ht[et],Ot?N&&e.texSubImage2D(n.TEXTURE_2D,et,0,0,zt,Z,pt):e.texImage2D(n.TEXTURE_2D,et,V,zt,Z,pt);A.generateMipmaps=!1}else if(Ot){if(Lt){const et=Pt(yt);e.texStorage2D(n.TEXTURE_2D,bt,V,et.width,et.height)}N&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,zt,Z,yt)}else e.texImage2D(n.TEXTURE_2D,0,V,zt,Z,yt);g(A)&&p(ut),Nt.__version=lt.version,A.onUpdate&&A.onUpdate(A)}D.__version=A.version}function F(D,A,q){if(A.image.length!==6)return;const ut=Dt(D,A),it=A.source;e.bindTexture(n.TEXTURE_CUBE_MAP,D.__webglTexture,n.TEXTURE0+q);const lt=i.get(it);if(it.version!==lt.__version||ut===!0){e.activeTexture(n.TEXTURE0+q);const Nt=Se.getPrimaries(Se.workingColorSpace),Ct=A.colorSpace===sa?null:Se.getPrimaries(A.colorSpace),wt=A.colorSpace===sa||Nt===Ct?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,wt);const $t=A.isCompressedTexture||A.image[0].isCompressedTexture,yt=A.image[0]&&A.image[0].isDataTexture,zt=[];for(let ht=0;ht<6;ht++)!$t&&!yt?zt[ht]=v(A.image[ht],!0,a.maxCubemapSize):zt[ht]=yt?A.image[ht].image:A.image[ht],zt[ht]=gt(A,zt[ht]);const Z=zt[0],V=s.convert(A.format,A.colorSpace),pt=s.convert(A.type),Ht=x(A.internalFormat,V,pt,A.colorSpace),Ot=A.isVideoTexture!==!0,Lt=lt.__version===void 0||ut===!0,N=it.dataReady;let bt=S(A,Z);ft(n.TEXTURE_CUBE_MAP,A);let et;if($t){Ot&&Lt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,bt,Ht,Z.width,Z.height);for(let ht=0;ht<6;ht++){et=zt[ht].mipmaps;for(let It=0;It<et.length;It++){const At=et[It];A.format!==gi?V!==null?Ot?N&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,It,0,0,At.width,At.height,V,At.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,It,Ht,At.width,At.height,0,At.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ot?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,It,0,0,At.width,At.height,V,pt,At.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,It,Ht,At.width,At.height,0,V,pt,At.data)}}}else{if(et=A.mipmaps,Ot&&Lt){et.length>0&&bt++;const ht=Pt(zt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,bt,Ht,ht.width,ht.height)}for(let ht=0;ht<6;ht++)if(yt){Ot?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,0,0,zt[ht].width,zt[ht].height,V,pt,zt[ht].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,Ht,zt[ht].width,zt[ht].height,0,V,pt,zt[ht].data);for(let It=0;It<et.length;It++){const jt=et[It].image[ht].image;Ot?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,It+1,0,0,jt.width,jt.height,V,pt,jt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,It+1,Ht,jt.width,jt.height,0,V,pt,jt.data)}}else{Ot?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,0,0,V,pt,zt[ht]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,Ht,V,pt,zt[ht]);for(let It=0;It<et.length;It++){const At=et[It];Ot?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,It+1,0,0,V,pt,At.image[ht]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,It+1,Ht,V,pt,At.image[ht])}}}g(A)&&p(n.TEXTURE_CUBE_MAP),lt.__version=it.version,A.onUpdate&&A.onUpdate(A)}D.__version=A.version}function Y(D,A,q,ut,it,lt){const Nt=s.convert(q.format,q.colorSpace),Ct=s.convert(q.type),wt=x(q.internalFormat,Nt,Ct,q.colorSpace),$t=i.get(A),yt=i.get(q);if(yt.__renderTarget=A,!$t.__hasExternalTextures){const zt=Math.max(1,A.width>>lt),Z=Math.max(1,A.height>>lt);it===n.TEXTURE_3D||it===n.TEXTURE_2D_ARRAY?e.texImage3D(it,lt,wt,zt,Z,A.depth,0,Nt,Ct,null):e.texImage2D(it,lt,wt,zt,Z,0,Nt,Ct,null)}e.bindFramebuffer(n.FRAMEBUFFER,D),_t(A)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ut,it,yt.__webglTexture,0,Rt(A)):(it===n.TEXTURE_2D||it>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&it<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ut,it,yt.__webglTexture,lt),e.bindFramebuffer(n.FRAMEBUFFER,null)}function J(D,A,q){if(n.bindRenderbuffer(n.RENDERBUFFER,D),A.depthBuffer){const ut=A.depthTexture,it=ut&&ut.isDepthTexture?ut.type:null,lt=M(A.stencilBuffer,it),Nt=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ct=Rt(A);_t(A)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ct,lt,A.width,A.height):q?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ct,lt,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,lt,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Nt,n.RENDERBUFFER,D)}else{const ut=A.textures;for(let it=0;it<ut.length;it++){const lt=ut[it],Nt=s.convert(lt.format,lt.colorSpace),Ct=s.convert(lt.type),wt=x(lt.internalFormat,Nt,Ct,lt.colorSpace),$t=Rt(A);q&&_t(A)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,$t,wt,A.width,A.height):_t(A)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,$t,wt,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,wt,A.width,A.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function K(D,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,D),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ut=i.get(A.depthTexture);ut.__renderTarget=A,(!ut.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),L(A.depthTexture,0);const it=ut.__webglTexture,lt=Rt(A);if(A.depthTexture.format===Es)_t(A)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,it,0,lt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,it,0);else if(A.depthTexture.format===Fs)_t(A)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,it,0,lt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,it,0);else throw new Error("Unknown depthTexture format")}function st(D){const A=i.get(D),q=D.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==D.depthTexture){const ut=D.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),ut){const it=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,ut.removeEventListener("dispose",it)};ut.addEventListener("dispose",it),A.__depthDisposeCallback=it}A.__boundDepthTexture=ut}if(D.depthTexture&&!A.__autoAllocateDepthBuffer){if(q)throw new Error("target.depthTexture not supported in Cube render targets");K(A.__webglFramebuffer,D)}else if(q){A.__webglDepthbuffer=[];for(let ut=0;ut<6;ut++)if(e.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer[ut]),A.__webglDepthbuffer[ut]===void 0)A.__webglDepthbuffer[ut]=n.createRenderbuffer(),J(A.__webglDepthbuffer[ut],D,!1);else{const it=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,lt=A.__webglDepthbuffer[ut];n.bindRenderbuffer(n.RENDERBUFFER,lt),n.framebufferRenderbuffer(n.FRAMEBUFFER,it,n.RENDERBUFFER,lt)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=n.createRenderbuffer(),J(A.__webglDepthbuffer,D,!1);else{const ut=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,it=A.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,it),n.framebufferRenderbuffer(n.FRAMEBUFFER,ut,n.RENDERBUFFER,it)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Tt(D,A,q){const ut=i.get(D);A!==void 0&&Y(ut.__webglFramebuffer,D,D.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),q!==void 0&&st(D)}function Wt(D){const A=D.texture,q=i.get(D),ut=i.get(A);D.addEventListener("dispose",E);const it=D.textures,lt=D.isWebGLCubeRenderTarget===!0,Nt=it.length>1;if(Nt||(ut.__webglTexture===void 0&&(ut.__webglTexture=n.createTexture()),ut.__version=A.version,o.memory.textures++),lt){q.__webglFramebuffer=[];for(let Ct=0;Ct<6;Ct++)if(A.mipmaps&&A.mipmaps.length>0){q.__webglFramebuffer[Ct]=[];for(let wt=0;wt<A.mipmaps.length;wt++)q.__webglFramebuffer[Ct][wt]=n.createFramebuffer()}else q.__webglFramebuffer[Ct]=n.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){q.__webglFramebuffer=[];for(let Ct=0;Ct<A.mipmaps.length;Ct++)q.__webglFramebuffer[Ct]=n.createFramebuffer()}else q.__webglFramebuffer=n.createFramebuffer();if(Nt)for(let Ct=0,wt=it.length;Ct<wt;Ct++){const $t=i.get(it[Ct]);$t.__webglTexture===void 0&&($t.__webglTexture=n.createTexture(),o.memory.textures++)}if(D.samples>0&&_t(D)===!1){q.__webglMultisampledFramebuffer=n.createFramebuffer(),q.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,q.__webglMultisampledFramebuffer);for(let Ct=0;Ct<it.length;Ct++){const wt=it[Ct];q.__webglColorRenderbuffer[Ct]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,q.__webglColorRenderbuffer[Ct]);const $t=s.convert(wt.format,wt.colorSpace),yt=s.convert(wt.type),zt=x(wt.internalFormat,$t,yt,wt.colorSpace,D.isXRRenderTarget===!0),Z=Rt(D);n.renderbufferStorageMultisample(n.RENDERBUFFER,Z,zt,D.width,D.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ct,n.RENDERBUFFER,q.__webglColorRenderbuffer[Ct])}n.bindRenderbuffer(n.RENDERBUFFER,null),D.depthBuffer&&(q.__webglDepthRenderbuffer=n.createRenderbuffer(),J(q.__webglDepthRenderbuffer,D,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(lt){e.bindTexture(n.TEXTURE_CUBE_MAP,ut.__webglTexture),ft(n.TEXTURE_CUBE_MAP,A);for(let Ct=0;Ct<6;Ct++)if(A.mipmaps&&A.mipmaps.length>0)for(let wt=0;wt<A.mipmaps.length;wt++)Y(q.__webglFramebuffer[Ct][wt],D,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Ct,wt);else Y(q.__webglFramebuffer[Ct],D,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Ct,0);g(A)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Nt){for(let Ct=0,wt=it.length;Ct<wt;Ct++){const $t=it[Ct],yt=i.get($t);e.bindTexture(n.TEXTURE_2D,yt.__webglTexture),ft(n.TEXTURE_2D,$t),Y(q.__webglFramebuffer,D,$t,n.COLOR_ATTACHMENT0+Ct,n.TEXTURE_2D,0),g($t)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let Ct=n.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(Ct=D.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(Ct,ut.__webglTexture),ft(Ct,A),A.mipmaps&&A.mipmaps.length>0)for(let wt=0;wt<A.mipmaps.length;wt++)Y(q.__webglFramebuffer[wt],D,A,n.COLOR_ATTACHMENT0,Ct,wt);else Y(q.__webglFramebuffer,D,A,n.COLOR_ATTACHMENT0,Ct,0);g(A)&&p(Ct),e.unbindTexture()}D.depthBuffer&&st(D)}function dt(D){const A=D.textures;for(let q=0,ut=A.length;q<ut;q++){const it=A[q];if(g(it)){const lt=_(D),Nt=i.get(it).__webglTexture;e.bindTexture(lt,Nt),p(lt),e.unbindTexture()}}}const X=[],H=[];function kt(D){if(D.samples>0){if(_t(D)===!1){const A=D.textures,q=D.width,ut=D.height;let it=n.COLOR_BUFFER_BIT;const lt=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Nt=i.get(D),Ct=A.length>1;if(Ct)for(let wt=0;wt<A.length;wt++)e.bindFramebuffer(n.FRAMEBUFFER,Nt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+wt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,Nt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+wt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,Nt.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Nt.__webglFramebuffer);for(let wt=0;wt<A.length;wt++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(it|=n.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(it|=n.STENCIL_BUFFER_BIT)),Ct){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Nt.__webglColorRenderbuffer[wt]);const $t=i.get(A[wt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,$t,0)}n.blitFramebuffer(0,0,q,ut,0,0,q,ut,it,n.NEAREST),c===!0&&(X.length=0,H.length=0,X.push(n.COLOR_ATTACHMENT0+wt),D.depthBuffer&&D.resolveDepthBuffer===!1&&(X.push(lt),H.push(lt),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,H)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,X))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Ct)for(let wt=0;wt<A.length;wt++){e.bindFramebuffer(n.FRAMEBUFFER,Nt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+wt,n.RENDERBUFFER,Nt.__webglColorRenderbuffer[wt]);const $t=i.get(A[wt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,Nt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+wt,n.TEXTURE_2D,$t,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Nt.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.resolveDepthBuffer===!1&&c){const A=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[A])}}}function Rt(D){return Math.min(a.maxSamples,D.samples)}function _t(D){const A=i.get(D);return D.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function vt(D){const A=o.render.frame;d.get(D)!==A&&(d.set(D,A),D.update())}function gt(D,A){const q=D.colorSpace,ut=D.format,it=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||q!==Ns&&q!==sa&&(Se.getTransfer(q)===ze?(ut!==gi||it!==$i)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",q)),A}function Pt(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(l.width=D.naturalWidth||D.width,l.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(l.width=D.displayWidth,l.height=D.displayHeight):(l.width=D.width,l.height=D.height),l}this.allocateTextureUnit=R,this.resetTextureUnits=I,this.setTexture2D=L,this.setTexture2DArray=k,this.setTexture3D=B,this.setTextureCube=G,this.rebindTextures=Tt,this.setupRenderTarget=Wt,this.updateRenderTargetMipmap=dt,this.updateMultisampleRenderTarget=kt,this.setupDepthRenderbuffer=st,this.setupFrameBufferTexture=Y,this.useMultisampledRTT=_t}function ZT(n,t){function e(i,a=sa){let s;const o=Se.getTransfer(a);if(i===$i)return n.UNSIGNED_BYTE;if(i===Qh)return n.UNSIGNED_SHORT_4_4_4_4;if(i===td)return n.UNSIGNED_SHORT_5_5_5_1;if(i===cm)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===om)return n.BYTE;if(i===rm)return n.SHORT;if(i===Lo)return n.UNSIGNED_SHORT;if(i===Jh)return n.INT;if(i===Ha)return n.UNSIGNED_INT;if(i===Ti)return n.FLOAT;if(i===No)return n.HALF_FLOAT;if(i===lm)return n.ALPHA;if(i===hm)return n.RGB;if(i===gi)return n.RGBA;if(i===dm)return n.LUMINANCE;if(i===um)return n.LUMINANCE_ALPHA;if(i===Es)return n.DEPTH_COMPONENT;if(i===Fs)return n.DEPTH_STENCIL;if(i===ed)return n.RED;if(i===nd)return n.RED_INTEGER;if(i===fm)return n.RG;if(i===id)return n.RG_INTEGER;if(i===ad)return n.RGBA_INTEGER;if(i===Dr||i===kr||i===Ir||i===zr)if(o===ze)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Dr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===kr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Ir)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===zr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Dr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===kr)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Ir)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===zr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===ah||i===sh||i===oh||i===rh)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===ah)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===sh)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===oh)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===rh)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===ch||i===lh||i===hh)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===ch||i===lh)return o===ze?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===hh)return o===ze?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===dh||i===uh||i===fh||i===ph||i===mh||i===gh||i===xh||i===vh||i===yh||i===Mh||i===_h||i===bh||i===Sh||i===wh)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===dh)return o===ze?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===uh)return o===ze?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===fh)return o===ze?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===ph)return o===ze?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===mh)return o===ze?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===gh)return o===ze?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===xh)return o===ze?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===vh)return o===ze?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===yh)return o===ze?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Mh)return o===ze?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===_h)return o===ze?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===bh)return o===ze?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Sh)return o===ze?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===wh)return o===ze?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Fr||i===Eh||i===Th)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===Fr)return o===ze?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Eh)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Th)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===pm||i===Ah||i===Rh||i===Ph)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===Fr)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Ah)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Rh)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ph)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===zs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class jT extends ri{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class _e extends qe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const qT={type:"move"};class gl{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new _e,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new _e,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new W,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new W),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new _e,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new W,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new W),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let a=null,s=null,o=null;const r=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const v of t.hand.values()){const g=e.getJointPose(v,i),p=this._getHandJoint(l,v);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const d=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],h=d.position.distanceTo(u.position),f=.02,m=.005;l.inputState.pinching&&h>f+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&h<=f-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));r!==null&&(a=e.getPose(t.targetRaySpace,i),a===null&&s!==null&&(a=s),a!==null&&(r.matrix.fromArray(a.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,a.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(a.linearVelocity)):r.hasLinearVelocity=!1,a.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(a.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(qT)))}return r!==null&&(r.visible=a!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new _e;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const KT=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,JT=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class QT{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const a=new kn,s=t.properties.get(a);s.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=a}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new ma({vertexShader:KT,fragmentShader:JT,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new me(new Vn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class tA extends Os{constructor(t,e){super();const i=this;let a=null,s=1,o=null,r="local-floor",c=1,l=null,d=null,u=null,h=null,f=null,m=null;const v=new QT,g=e.getContextAttributes();let p=null,_=null;const x=[],M=[],S=new Vt;let w=null;const E=new ri;E.viewport=new nn;const T=new ri;T.viewport=new nn;const b=[E,T],y=new jT;let C=null,I=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let F=x[j];return F===void 0&&(F=new gl,x[j]=F),F.getTargetRaySpace()},this.getControllerGrip=function(j){let F=x[j];return F===void 0&&(F=new gl,x[j]=F),F.getGripSpace()},this.getHand=function(j){let F=x[j];return F===void 0&&(F=new gl,x[j]=F),F.getHandSpace()};function R(j){const F=M.indexOf(j.inputSource);if(F===-1)return;const Y=x[F];Y!==void 0&&(Y.update(j.inputSource,j.frame,l||o),Y.dispatchEvent({type:j.type,data:j.inputSource}))}function U(){a.removeEventListener("select",R),a.removeEventListener("selectstart",R),a.removeEventListener("selectend",R),a.removeEventListener("squeeze",R),a.removeEventListener("squeezestart",R),a.removeEventListener("squeezeend",R),a.removeEventListener("end",U),a.removeEventListener("inputsourceschange",L);for(let j=0;j<x.length;j++){const F=M[j];F!==null&&(M[j]=null,x[j].disconnect(F))}C=null,I=null,v.reset(),t.setRenderTarget(p),f=null,h=null,u=null,a=null,_=null,Dt.stop(),i.isPresenting=!1,t.setPixelRatio(w),t.setSize(S.width,S.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){s=j,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){r=j,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(j){l=j},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return u},this.getFrame=function(){return m},this.getSession=function(){return a},this.setSession=async function(j){if(a=j,a!==null){if(p=t.getRenderTarget(),a.addEventListener("select",R),a.addEventListener("selectstart",R),a.addEventListener("selectend",R),a.addEventListener("squeeze",R),a.addEventListener("squeezestart",R),a.addEventListener("squeezeend",R),a.addEventListener("end",U),a.addEventListener("inputsourceschange",L),g.xrCompatible!==!0&&await e.makeXRCompatible(),w=t.getPixelRatio(),t.getSize(S),a.renderState.layers===void 0){const F={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(a,e,F),a.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),_=new Ga(f.framebufferWidth,f.framebufferHeight,{format:gi,type:$i,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let F=null,Y=null,J=null;g.depth&&(J=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,F=g.stencil?Fs:Es,Y=g.stencil?zs:Ha);const K={colorFormat:e.RGBA8,depthFormat:J,scaleFactor:s};u=new XRWebGLBinding(a,e),h=u.createProjectionLayer(K),a.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),_=new Ga(h.textureWidth,h.textureHeight,{format:gi,type:$i,depthTexture:new Rm(h.textureWidth,h.textureHeight,Y,void 0,void 0,void 0,void 0,void 0,void 0,F),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await a.requestReferenceSpace(r),Dt.setContext(a),Dt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function L(j){for(let F=0;F<j.removed.length;F++){const Y=j.removed[F],J=M.indexOf(Y);J>=0&&(M[J]=null,x[J].disconnect(Y))}for(let F=0;F<j.added.length;F++){const Y=j.added[F];let J=M.indexOf(Y);if(J===-1){for(let st=0;st<x.length;st++)if(st>=M.length){M.push(Y),J=st;break}else if(M[st]===null){M[st]=Y,J=st;break}if(J===-1)break}const K=x[J];K&&K.connect(Y)}}const k=new W,B=new W;function G(j,F,Y){k.setFromMatrixPosition(F.matrixWorld),B.setFromMatrixPosition(Y.matrixWorld);const J=k.distanceTo(B),K=F.projectionMatrix.elements,st=Y.projectionMatrix.elements,Tt=K[14]/(K[10]-1),Wt=K[14]/(K[10]+1),dt=(K[9]+1)/K[5],X=(K[9]-1)/K[5],H=(K[8]-1)/K[0],kt=(st[8]+1)/st[0],Rt=Tt*H,_t=Tt*kt,vt=J/(-H+kt),gt=vt*-H;if(F.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(gt),j.translateZ(vt),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),K[10]===-1)j.projectionMatrix.copy(F.projectionMatrix),j.projectionMatrixInverse.copy(F.projectionMatrixInverse);else{const Pt=Tt+vt,D=Wt+vt,A=Rt-gt,q=_t+(J-gt),ut=dt*Wt/D*Pt,it=X*Wt/D*Pt;j.projectionMatrix.makePerspective(A,q,ut,it,Pt,D),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function $(j,F){F===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(F.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(a===null)return;let F=j.near,Y=j.far;v.texture!==null&&(v.depthNear>0&&(F=v.depthNear),v.depthFar>0&&(Y=v.depthFar)),y.near=T.near=E.near=F,y.far=T.far=E.far=Y,(C!==y.near||I!==y.far)&&(a.updateRenderState({depthNear:y.near,depthFar:y.far}),C=y.near,I=y.far),E.layers.mask=j.layers.mask|2,T.layers.mask=j.layers.mask|4,y.layers.mask=E.layers.mask|T.layers.mask;const J=j.parent,K=y.cameras;$(y,J);for(let st=0;st<K.length;st++)$(K[st],J);K.length===2?G(y,E,T):y.projectionMatrix.copy(E.projectionMatrix),at(j,y,J)};function at(j,F,Y){Y===null?j.matrix.copy(F.matrixWorld):(j.matrix.copy(Y.matrixWorld),j.matrix.invert(),j.matrix.multiply(F.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(F.projectionMatrix),j.projectionMatrixInverse.copy(F.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=Do*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(h===null&&f===null))return c},this.setFoveation=function(j){c=j,h!==null&&(h.fixedFoveation=j),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=j)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(y)};let mt=null;function ft(j,F){if(d=F.getViewerPose(l||o),m=F,d!==null){const Y=d.views;f!==null&&(t.setRenderTargetFramebuffer(_,f.framebuffer),t.setRenderTarget(_));let J=!1;Y.length!==y.cameras.length&&(y.cameras.length=0,J=!0);for(let st=0;st<Y.length;st++){const Tt=Y[st];let Wt=null;if(f!==null)Wt=f.getViewport(Tt);else{const X=u.getViewSubImage(h,Tt);Wt=X.viewport,st===0&&(t.setRenderTargetTextures(_,X.colorTexture,h.ignoreDepthValues?void 0:X.depthStencilTexture),t.setRenderTarget(_))}let dt=b[st];dt===void 0&&(dt=new ri,dt.layers.enable(st),dt.viewport=new nn,b[st]=dt),dt.matrix.fromArray(Tt.transform.matrix),dt.matrix.decompose(dt.position,dt.quaternion,dt.scale),dt.projectionMatrix.fromArray(Tt.projectionMatrix),dt.projectionMatrixInverse.copy(dt.projectionMatrix).invert(),dt.viewport.set(Wt.x,Wt.y,Wt.width,Wt.height),st===0&&(y.matrix.copy(dt.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),J===!0&&y.cameras.push(dt)}const K=a.enabledFeatures;if(K&&K.includes("depth-sensing")){const st=u.getDepthInformation(Y[0]);st&&st.isValid&&st.texture&&v.init(t,st,a.renderState)}}for(let Y=0;Y<x.length;Y++){const J=M[Y],K=x[Y];J!==null&&K!==void 0&&K.update(J,F,l||o)}mt&&mt(j,F),F.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:F}),m=null}const Dt=new Tm;Dt.setAnimationLoop(ft),this.setAnimationLoop=function(j){mt=j},this.dispose=function(){}}}const Aa=new Pi,eA=new Ae;function nA(n,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,Sm(n)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function a(g,p,_,x,M){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(g,p):p.isMeshToonMaterial?(s(g,p),u(g,p)):p.isMeshPhongMaterial?(s(g,p),d(g,p)):p.isMeshStandardMaterial?(s(g,p),h(g,p),p.isMeshPhysicalMaterial&&f(g,p,M)):p.isMeshMatcapMaterial?(s(g,p),m(g,p)):p.isMeshDepthMaterial?s(g,p):p.isMeshDistanceMaterial?(s(g,p),v(g,p)):p.isMeshNormalMaterial?s(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&r(g,p)):p.isPointsMaterial?c(g,p,_,x):p.isSpriteMaterial?l(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Wn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Wn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const _=t.get(p),x=_.envMap,M=_.envMapRotation;x&&(g.envMap.value=x,Aa.copy(M),Aa.x*=-1,Aa.y*=-1,Aa.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Aa.y*=-1,Aa.z*=-1),g.envMapRotation.value.setFromMatrix4(eA.makeRotationFromEuler(Aa)),g.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function r(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function c(g,p,_,x){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*_,g.scale.value=x*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function l(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function d(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function h(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,_){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Wn&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=_.texture,g.transmissionSamplerSize.value.set(_.width,_.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function v(g,p){const _=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(_.matrixWorld),g.nearDistance.value=_.shadow.camera.near,g.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:a}}function iA(n,t,e,i){let a={},s={},o=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(_,x){const M=x.program;i.uniformBlockBinding(_,M)}function l(_,x){let M=a[_.id];M===void 0&&(m(_),M=d(_),a[_.id]=M,_.addEventListener("dispose",g));const S=x.program;i.updateUBOMapping(_,S);const w=t.render.frame;s[_.id]!==w&&(h(_),s[_.id]=w)}function d(_){const x=u();_.__bindingPointIndex=x;const M=n.createBuffer(),S=_.__size,w=_.usage;return n.bindBuffer(n.UNIFORM_BUFFER,M),n.bufferData(n.UNIFORM_BUFFER,S,w),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,M),M}function u(){for(let _=0;_<r;_++)if(o.indexOf(_)===-1)return o.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(_){const x=a[_.id],M=_.uniforms,S=_.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let w=0,E=M.length;w<E;w++){const T=Array.isArray(M[w])?M[w]:[M[w]];for(let b=0,y=T.length;b<y;b++){const C=T[b];if(f(C,w,b,S)===!0){const I=C.__offset,R=Array.isArray(C.value)?C.value:[C.value];let U=0;for(let L=0;L<R.length;L++){const k=R[L],B=v(k);typeof k=="number"||typeof k=="boolean"?(C.__data[0]=k,n.bufferSubData(n.UNIFORM_BUFFER,I+U,C.__data)):k.isMatrix3?(C.__data[0]=k.elements[0],C.__data[1]=k.elements[1],C.__data[2]=k.elements[2],C.__data[3]=0,C.__data[4]=k.elements[3],C.__data[5]=k.elements[4],C.__data[6]=k.elements[5],C.__data[7]=0,C.__data[8]=k.elements[6],C.__data[9]=k.elements[7],C.__data[10]=k.elements[8],C.__data[11]=0):(k.toArray(C.__data,U),U+=B.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,I,C.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(_,x,M,S){const w=_.value,E=x+"_"+M;if(S[E]===void 0)return typeof w=="number"||typeof w=="boolean"?S[E]=w:S[E]=w.clone(),!0;{const T=S[E];if(typeof w=="number"||typeof w=="boolean"){if(T!==w)return S[E]=w,!0}else if(T.equals(w)===!1)return T.copy(w),!0}return!1}function m(_){const x=_.uniforms;let M=0;const S=16;for(let E=0,T=x.length;E<T;E++){const b=Array.isArray(x[E])?x[E]:[x[E]];for(let y=0,C=b.length;y<C;y++){const I=b[y],R=Array.isArray(I.value)?I.value:[I.value];for(let U=0,L=R.length;U<L;U++){const k=R[U],B=v(k),G=M%S,$=G%B.boundary,at=G+$;M+=$,at!==0&&S-at<B.storage&&(M+=S-at),I.__data=new Float32Array(B.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=M,M+=B.storage}}}const w=M%S;return w>0&&(M+=S-w),_.__size=M,_.__cache={},this}function v(_){const x={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(x.boundary=4,x.storage=4):_.isVector2?(x.boundary=8,x.storage=8):_.isVector3||_.isColor?(x.boundary=16,x.storage=12):_.isVector4?(x.boundary=16,x.storage=16):_.isMatrix3?(x.boundary=48,x.storage=48):_.isMatrix4?(x.boundary=64,x.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),x}function g(_){const x=_.target;x.removeEventListener("dispose",g);const M=o.indexOf(x.__bindingPointIndex);o.splice(M,1),n.deleteBuffer(a[x.id]),delete a[x.id],delete s[x.id]}function p(){for(const _ in a)n.deleteBuffer(a[_]);o=[],a={},s={}}return{bind:c,update:l,dispose:p}}class aA{constructor(t={}){const{canvas:e=Yb(),context:i=null,depth:a=!0,stencil:s=!1,alpha:o=!1,antialias:r=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:h=!1}=t;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=o;const m=new Uint32Array(4),v=new Int32Array(4);let g=null,p=null;const _=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Bn,this.toneMapping=da,this.toneMappingExposure=1;const M=this;let S=!1,w=0,E=0,T=null,b=-1,y=null;const C=new nn,I=new nn;let R=null;const U=new te(0);let L=0,k=e.width,B=e.height,G=1,$=null,at=null;const mt=new nn(0,0,k,B),ft=new nn(0,0,k,B);let Dt=!1;const j=new cd;let F=!1,Y=!1;const J=new Ae,K=new Ae,st=new W,Tt=new nn,Wt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let dt=!1;function X(){return T===null?G:1}let H=i;function kt(z,Q){return e.getContext(z,Q)}try{const z={alpha:!0,depth:a,stencil:s,antialias:r,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${qh}`),e.addEventListener("webglcontextlost",ht,!1),e.addEventListener("webglcontextrestored",It,!1),e.addEventListener("webglcontextcreationerror",At,!1),H===null){const Q="webgl2";if(H=kt(Q,z),H===null)throw kt(Q)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(z){throw console.error("THREE.WebGLRenderer: "+z.message),z}let Rt,_t,vt,gt,Pt,D,A,q,ut,it,lt,Nt,Ct,wt,$t,yt,zt,Z,V,pt,Ht,Ot,Lt,N;function bt(){Rt=new lE(H),Rt.init(),Ot=new ZT(H,Rt),_t=new iE(H,Rt,t,Ot),vt=new WT(H,Rt),_t.reverseDepthBuffer&&h&&vt.buffers.depth.setReversed(!0),gt=new uE(H),Pt=new CT,D=new $T(H,Rt,vt,Pt,_t,Ot,gt),A=new sE(M),q=new cE(M),ut=new y1(H),Lt=new eE(H,ut),it=new hE(H,ut,gt,Lt),lt=new pE(H,it,ut,gt),V=new fE(H,_t,D),yt=new aE(Pt),Nt=new PT(M,A,q,Rt,_t,Lt,yt),Ct=new nA(M,Pt),wt=new DT,$t=new NT(Rt),Z=new tE(M,A,q,vt,lt,f,c),zt=new XT(M,lt,_t),N=new iA(H,gt,_t,vt),pt=new nE(H,Rt,gt),Ht=new dE(H,Rt,gt),gt.programs=Nt.programs,M.capabilities=_t,M.extensions=Rt,M.properties=Pt,M.renderLists=wt,M.shadowMap=zt,M.state=vt,M.info=gt}bt();const et=new tA(M,H);this.xr=et,this.getContext=function(){return H},this.getContextAttributes=function(){return H.getContextAttributes()},this.forceContextLoss=function(){const z=Rt.get("WEBGL_lose_context");z&&z.loseContext()},this.forceContextRestore=function(){const z=Rt.get("WEBGL_lose_context");z&&z.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(z){z!==void 0&&(G=z,this.setSize(k,B,!1))},this.getSize=function(z){return z.set(k,B)},this.setSize=function(z,Q,ot=!0){if(et.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}k=z,B=Q,e.width=Math.floor(z*G),e.height=Math.floor(Q*G),ot===!0&&(e.style.width=z+"px",e.style.height=Q+"px"),this.setViewport(0,0,z,Q)},this.getDrawingBufferSize=function(z){return z.set(k*G,B*G).floor()},this.setDrawingBufferSize=function(z,Q,ot){k=z,B=Q,G=ot,e.width=Math.floor(z*ot),e.height=Math.floor(Q*ot),this.setViewport(0,0,z,Q)},this.getCurrentViewport=function(z){return z.copy(C)},this.getViewport=function(z){return z.copy(mt)},this.setViewport=function(z,Q,ot,ct){z.isVector4?mt.set(z.x,z.y,z.z,z.w):mt.set(z,Q,ot,ct),vt.viewport(C.copy(mt).multiplyScalar(G).round())},this.getScissor=function(z){return z.copy(ft)},this.setScissor=function(z,Q,ot,ct){z.isVector4?ft.set(z.x,z.y,z.z,z.w):ft.set(z,Q,ot,ct),vt.scissor(I.copy(ft).multiplyScalar(G).round())},this.getScissorTest=function(){return Dt},this.setScissorTest=function(z){vt.setScissorTest(Dt=z)},this.setOpaqueSort=function(z){$=z},this.setTransparentSort=function(z){at=z},this.getClearColor=function(z){return z.copy(Z.getClearColor())},this.setClearColor=function(){Z.setClearColor.apply(Z,arguments)},this.getClearAlpha=function(){return Z.getClearAlpha()},this.setClearAlpha=function(){Z.setClearAlpha.apply(Z,arguments)},this.clear=function(z=!0,Q=!0,ot=!0){let ct=0;if(z){let P=!1;if(T!==null){const nt=T.texture.format;P=nt===ad||nt===id||nt===nd}if(P){const nt=T.texture.type,rt=nt===$i||nt===Ha||nt===Lo||nt===zs||nt===Qh||nt===td,Mt=Z.getClearColor(),Et=Z.getClearAlpha(),Ft=Mt.r,Bt=Mt.g,Gt=Mt.b;rt?(m[0]=Ft,m[1]=Bt,m[2]=Gt,m[3]=Et,H.clearBufferuiv(H.COLOR,0,m)):(v[0]=Ft,v[1]=Bt,v[2]=Gt,v[3]=Et,H.clearBufferiv(H.COLOR,0,v))}else ct|=H.COLOR_BUFFER_BIT}Q&&(ct|=H.DEPTH_BUFFER_BIT),ot&&(ct|=H.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H.clear(ct)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ht,!1),e.removeEventListener("webglcontextrestored",It,!1),e.removeEventListener("webglcontextcreationerror",At,!1),wt.dispose(),$t.dispose(),Pt.dispose(),A.dispose(),q.dispose(),lt.dispose(),Lt.dispose(),N.dispose(),Nt.dispose(),et.dispose(),et.removeEventListener("sessionstart",Qe),et.removeEventListener("sessionend",ln),Pe.stop()};function ht(z){z.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),S=!0}function It(){console.log("THREE.WebGLRenderer: Context Restored."),S=!1;const z=gt.autoReset,Q=zt.enabled,ot=zt.autoUpdate,ct=zt.needsUpdate,P=zt.type;bt(),gt.autoReset=z,zt.enabled=Q,zt.autoUpdate=ot,zt.needsUpdate=ct,zt.type=P}function At(z){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",z.statusMessage)}function jt(z){const Q=z.target;Q.removeEventListener("dispose",jt),se(Q)}function se(z){oe(z),Pt.remove(z)}function oe(z){const Q=Pt.get(z).programs;Q!==void 0&&(Q.forEach(function(ot){Nt.releaseProgram(ot)}),z.isShaderMaterial&&Nt.releaseShaderCache(z))}this.renderBufferDirect=function(z,Q,ot,ct,P,nt){Q===null&&(Q=Wt);const rt=P.isMesh&&P.matrixWorld.determinant()<0,Mt=ci(z,Q,ot,ct,P);vt.setMaterial(ct,rt);let Et=ot.index,Ft=1;if(ct.wireframe===!0){if(Et=it.getWireframeAttribute(ot),Et===void 0)return;Ft=2}const Bt=ot.drawRange,Gt=ot.attributes.position;let ie=Bt.start*Ft,qt=(Bt.start+Bt.count)*Ft;nt!==null&&(ie=Math.max(ie,nt.start*Ft),qt=Math.min(qt,(nt.start+nt.count)*Ft)),Et!==null?(ie=Math.max(ie,0),qt=Math.min(qt,Et.count)):Gt!=null&&(ie=Math.max(ie,0),qt=Math.min(qt,Gt.count));const re=qt-ie;if(re<0||re===1/0)return;Lt.setup(P,ct,Mt,ot,Et);let Oe,de=pt;if(Et!==null&&(Oe=ut.get(Et),de=Ht,de.setIndex(Oe)),P.isMesh)ct.wireframe===!0?(vt.setLineWidth(ct.wireframeLinewidth*X()),de.setMode(H.LINES)):de.setMode(H.TRIANGLES);else if(P.isLine){let Yt=ct.linewidth;Yt===void 0&&(Yt=1),vt.setLineWidth(Yt*X()),P.isLineSegments?de.setMode(H.LINES):P.isLineLoop?de.setMode(H.LINE_LOOP):de.setMode(H.LINE_STRIP)}else P.isPoints?de.setMode(H.POINTS):P.isSprite&&de.setMode(H.TRIANGLES);if(P.isBatchedMesh)if(P._multiDrawInstances!==null)de.renderMultiDrawInstances(P._multiDrawStarts,P._multiDrawCounts,P._multiDrawCount,P._multiDrawInstances);else if(Rt.get("WEBGL_multi_draw"))de.renderMultiDraw(P._multiDrawStarts,P._multiDrawCounts,P._multiDrawCount);else{const Yt=P._multiDrawStarts,xn=P._multiDrawCounts,ue=P._multiDrawCount,Ye=Et?ut.get(Et).bytesPerElement:1,dn=Pt.get(ct).currentProgram.getUniforms();for(let Te=0;Te<ue;Te++)dn.setValue(H,"_gl_DrawID",Te),de.render(Yt[Te]/Ye,xn[Te])}else if(P.isInstancedMesh)de.renderInstances(ie,re,P.count);else if(ot.isInstancedBufferGeometry){const Yt=ot._maxInstanceCount!==void 0?ot._maxInstanceCount:1/0,xn=Math.min(ot.instanceCount,Yt);de.renderInstances(ie,re,xn)}else de.render(ie,re)};function ee(z,Q,ot){z.transparent===!0&&z.side===We&&z.forceSinglePass===!1?(z.side=Wn,z.needsUpdate=!0,gn(z,Q,ot),z.side=pa,z.needsUpdate=!0,gn(z,Q,ot),z.side=We):gn(z,Q,ot)}this.compile=function(z,Q,ot=null){ot===null&&(ot=z),p=$t.get(ot),p.init(Q),x.push(p),ot.traverseVisible(function(P){P.isLight&&P.layers.test(Q.layers)&&(p.pushLight(P),P.castShadow&&p.pushShadow(P))}),z!==ot&&z.traverseVisible(function(P){P.isLight&&P.layers.test(Q.layers)&&(p.pushLight(P),P.castShadow&&p.pushShadow(P))}),p.setupLights();const ct=new Set;return z.traverse(function(P){if(!(P.isMesh||P.isPoints||P.isLine||P.isSprite))return;const nt=P.material;if(nt)if(Array.isArray(nt))for(let rt=0;rt<nt.length;rt++){const Mt=nt[rt];ee(Mt,ot,P),ct.add(Mt)}else ee(nt,ot,P),ct.add(nt)}),x.pop(),p=null,ct},this.compileAsync=function(z,Q,ot=null){const ct=this.compile(z,Q,ot);return new Promise(P=>{function nt(){if(ct.forEach(function(rt){Pt.get(rt).currentProgram.isReady()&&ct.delete(rt)}),ct.size===0){P(z);return}setTimeout(nt,10)}Rt.get("KHR_parallel_shader_compile")!==null?nt():setTimeout(nt,10)})};let ye=null;function we(z){ye&&ye(z)}function Qe(){Pe.stop()}function ln(){Pe.start()}const Pe=new Tm;Pe.setAnimationLoop(we),typeof self<"u"&&Pe.setContext(self),this.setAnimationLoop=function(z){ye=z,et.setAnimationLoop(z),z===null?Pe.stop():Pe.start()},et.addEventListener("sessionstart",Qe),et.addEventListener("sessionend",ln),this.render=function(z,Q){if(Q!==void 0&&Q.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(S===!0)return;if(z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),Q.parent===null&&Q.matrixWorldAutoUpdate===!0&&Q.updateMatrixWorld(),et.enabled===!0&&et.isPresenting===!0&&(et.cameraAutoUpdate===!0&&et.updateCamera(Q),Q=et.getCamera()),z.isScene===!0&&z.onBeforeRender(M,z,Q,T),p=$t.get(z,x.length),p.init(Q),x.push(p),K.multiplyMatrices(Q.projectionMatrix,Q.matrixWorldInverse),j.setFromProjectionMatrix(K),Y=this.localClippingEnabled,F=yt.init(this.clippingPlanes,Y),g=wt.get(z,_.length),g.init(),_.push(g),et.enabled===!0&&et.isPresenting===!0){const nt=M.xr.getDepthSensingMesh();nt!==null&&Ee(nt,Q,-1/0,M.sortObjects)}Ee(z,Q,0,M.sortObjects),g.finish(),M.sortObjects===!0&&g.sort($,at),dt=et.enabled===!1||et.isPresenting===!1||et.hasDepthSensing()===!1,dt&&Z.addToRenderList(g,z),this.info.render.frame++,F===!0&&yt.beginShadows();const ot=p.state.shadowsArray;zt.render(ot,z,Q),F===!0&&yt.endShadows(),this.info.autoReset===!0&&this.info.reset();const ct=g.opaque,P=g.transmissive;if(p.setupLights(),Q.isArrayCamera){const nt=Q.cameras;if(P.length>0)for(let rt=0,Mt=nt.length;rt<Mt;rt++){const Et=nt[rt];In(ct,P,z,Et)}dt&&Z.render(z);for(let rt=0,Mt=nt.length;rt<Mt;rt++){const Et=nt[rt];mn(g,z,Et,Et.viewport)}}else P.length>0&&In(ct,P,z,Q),dt&&Z.render(z),mn(g,z,Q);T!==null&&(D.updateMultisampleRenderTarget(T),D.updateRenderTargetMipmap(T)),z.isScene===!0&&z.onAfterRender(M,z,Q),Lt.resetDefaultState(),b=-1,y=null,x.pop(),x.length>0?(p=x[x.length-1],F===!0&&yt.setGlobalState(M.clippingPlanes,p.state.camera)):p=null,_.pop(),_.length>0?g=_[_.length-1]:g=null};function Ee(z,Q,ot,ct){if(z.visible===!1)return;if(z.layers.test(Q.layers)){if(z.isGroup)ot=z.renderOrder;else if(z.isLOD)z.autoUpdate===!0&&z.update(Q);else if(z.isLight)p.pushLight(z),z.castShadow&&p.pushShadow(z);else if(z.isSprite){if(!z.frustumCulled||j.intersectsSprite(z)){ct&&Tt.setFromMatrixPosition(z.matrixWorld).applyMatrix4(K);const rt=lt.update(z),Mt=z.material;Mt.visible&&g.push(z,rt,Mt,ot,Tt.z,null)}}else if((z.isMesh||z.isLine||z.isPoints)&&(!z.frustumCulled||j.intersectsObject(z))){const rt=lt.update(z),Mt=z.material;if(ct&&(z.boundingSphere!==void 0?(z.boundingSphere===null&&z.computeBoundingSphere(),Tt.copy(z.boundingSphere.center)):(rt.boundingSphere===null&&rt.computeBoundingSphere(),Tt.copy(rt.boundingSphere.center)),Tt.applyMatrix4(z.matrixWorld).applyMatrix4(K)),Array.isArray(Mt)){const Et=rt.groups;for(let Ft=0,Bt=Et.length;Ft<Bt;Ft++){const Gt=Et[Ft],ie=Mt[Gt.materialIndex];ie&&ie.visible&&g.push(z,rt,ie,ot,Tt.z,Gt)}}else Mt.visible&&g.push(z,rt,Mt,ot,Tt.z,null)}}const nt=z.children;for(let rt=0,Mt=nt.length;rt<Mt;rt++)Ee(nt[rt],Q,ot,ct)}function mn(z,Q,ot,ct){const P=z.opaque,nt=z.transmissive,rt=z.transparent;p.setupLightsView(ot),F===!0&&yt.setGlobalState(M.clippingPlanes,ot),ct&&vt.viewport(C.copy(ct)),P.length>0&&tn(P,Q,ot),nt.length>0&&tn(nt,Q,ot),rt.length>0&&tn(rt,Q,ot),vt.buffers.depth.setTest(!0),vt.buffers.depth.setMask(!0),vt.buffers.color.setMask(!0),vt.setPolygonOffset(!1)}function In(z,Q,ot,ct){if((ot.isScene===!0?ot.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[ct.id]===void 0&&(p.state.transmissionRenderTarget[ct.id]=new Ga(1,1,{generateMipmaps:!0,type:Rt.has("EXT_color_buffer_half_float")||Rt.has("EXT_color_buffer_float")?No:$i,minFilter:Na,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Se.workingColorSpace}));const nt=p.state.transmissionRenderTarget[ct.id],rt=ct.viewport||C;nt.setSize(rt.z,rt.w);const Mt=M.getRenderTarget();M.setRenderTarget(nt),M.getClearColor(U),L=M.getClearAlpha(),L<1&&M.setClearColor(16777215,.5),M.clear(),dt&&Z.render(ot);const Et=M.toneMapping;M.toneMapping=da;const Ft=ct.viewport;if(ct.viewport!==void 0&&(ct.viewport=void 0),p.setupLightsView(ct),F===!0&&yt.setGlobalState(M.clippingPlanes,ct),tn(z,ot,ct),D.updateMultisampleRenderTarget(nt),D.updateRenderTargetMipmap(nt),Rt.has("WEBGL_multisampled_render_to_texture")===!1){let Bt=!1;for(let Gt=0,ie=Q.length;Gt<ie;Gt++){const qt=Q[Gt],re=qt.object,Oe=qt.geometry,de=qt.material,Yt=qt.group;if(de.side===We&&re.layers.test(ct.layers)){const xn=de.side;de.side=Wn,de.needsUpdate=!0,zn(re,ot,ct,Oe,de,Yt),de.side=xn,de.needsUpdate=!0,Bt=!0}}Bt===!0&&(D.updateMultisampleRenderTarget(nt),D.updateRenderTargetMipmap(nt))}M.setRenderTarget(Mt),M.setClearColor(U,L),Ft!==void 0&&(ct.viewport=Ft),M.toneMapping=Et}function tn(z,Q,ot){const ct=Q.isScene===!0?Q.overrideMaterial:null;for(let P=0,nt=z.length;P<nt;P++){const rt=z[P],Mt=rt.object,Et=rt.geometry,Ft=ct===null?rt.material:ct,Bt=rt.group;Mt.layers.test(ot.layers)&&zn(Mt,Q,ot,Et,Ft,Bt)}}function zn(z,Q,ot,ct,P,nt){z.onBeforeRender(M,Q,ot,ct,P,nt),z.modelViewMatrix.multiplyMatrices(ot.matrixWorldInverse,z.matrixWorld),z.normalMatrix.getNormalMatrix(z.modelViewMatrix),P.onBeforeRender(M,Q,ot,ct,z,nt),P.transparent===!0&&P.side===We&&P.forceSinglePass===!1?(P.side=Wn,P.needsUpdate=!0,M.renderBufferDirect(ot,Q,ct,P,z,nt),P.side=pa,P.needsUpdate=!0,M.renderBufferDirect(ot,Q,ct,P,z,nt),P.side=We):M.renderBufferDirect(ot,Q,ct,P,z,nt),z.onAfterRender(M,Q,ot,ct,P,nt)}function gn(z,Q,ot){Q.isScene!==!0&&(Q=Wt);const ct=Pt.get(z),P=p.state.lights,nt=p.state.shadowsArray,rt=P.state.version,Mt=Nt.getParameters(z,P.state,nt,Q,ot),Et=Nt.getProgramCacheKey(Mt);let Ft=ct.programs;ct.environment=z.isMeshStandardMaterial?Q.environment:null,ct.fog=Q.fog,ct.envMap=(z.isMeshStandardMaterial?q:A).get(z.envMap||ct.environment),ct.envMapRotation=ct.environment!==null&&z.envMap===null?Q.environmentRotation:z.envMapRotation,Ft===void 0&&(z.addEventListener("dispose",jt),Ft=new Map,ct.programs=Ft);let Bt=Ft.get(Et);if(Bt!==void 0){if(ct.currentProgram===Bt&&ct.lightsStateVersion===rt)return Ce(z,Mt),Bt}else Mt.uniforms=Nt.getUniforms(z),z.onBeforeCompile(Mt,M),Bt=Nt.acquireProgram(Mt,Et),Ft.set(Et,Bt),ct.uniforms=Mt.uniforms;const Gt=ct.uniforms;return(!z.isShaderMaterial&&!z.isRawShaderMaterial||z.clipping===!0)&&(Gt.clippingPlanes=yt.uniform),Ce(z,Mt),ct.needsLights=Tn(z),ct.lightsStateVersion=rt,ct.needsLights&&(Gt.ambientLightColor.value=P.state.ambient,Gt.lightProbe.value=P.state.probe,Gt.directionalLights.value=P.state.directional,Gt.directionalLightShadows.value=P.state.directionalShadow,Gt.spotLights.value=P.state.spot,Gt.spotLightShadows.value=P.state.spotShadow,Gt.rectAreaLights.value=P.state.rectArea,Gt.ltc_1.value=P.state.rectAreaLTC1,Gt.ltc_2.value=P.state.rectAreaLTC2,Gt.pointLights.value=P.state.point,Gt.pointLightShadows.value=P.state.pointShadow,Gt.hemisphereLights.value=P.state.hemi,Gt.directionalShadowMap.value=P.state.directionalShadowMap,Gt.directionalShadowMatrix.value=P.state.directionalShadowMatrix,Gt.spotShadowMap.value=P.state.spotShadowMap,Gt.spotLightMatrix.value=P.state.spotLightMatrix,Gt.spotLightMap.value=P.state.spotLightMap,Gt.pointShadowMap.value=P.state.pointShadowMap,Gt.pointShadowMatrix.value=P.state.pointShadowMatrix),ct.currentProgram=Bt,ct.uniformsList=null,Bt}function hn(z){if(z.uniformsList===null){const Q=z.currentProgram.getUniforms();z.uniformsList=Ur.seqWithValue(Q.seq,z.uniforms)}return z.uniformsList}function Ce(z,Q){const ot=Pt.get(z);ot.outputColorSpace=Q.outputColorSpace,ot.batching=Q.batching,ot.batchingColor=Q.batchingColor,ot.instancing=Q.instancing,ot.instancingColor=Q.instancingColor,ot.instancingMorph=Q.instancingMorph,ot.skinning=Q.skinning,ot.morphTargets=Q.morphTargets,ot.morphNormals=Q.morphNormals,ot.morphColors=Q.morphColors,ot.morphTargetsCount=Q.morphTargetsCount,ot.numClippingPlanes=Q.numClippingPlanes,ot.numIntersection=Q.numClipIntersection,ot.vertexAlphas=Q.vertexAlphas,ot.vertexTangents=Q.vertexTangents,ot.toneMapping=Q.toneMapping}function ci(z,Q,ot,ct,P){Q.isScene!==!0&&(Q=Wt),D.resetTextureUnits();const nt=Q.fog,rt=ct.isMeshStandardMaterial?Q.environment:null,Mt=T===null?M.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:Ns,Et=(ct.isMeshStandardMaterial?q:A).get(ct.envMap||rt),Ft=ct.vertexColors===!0&&!!ot.attributes.color&&ot.attributes.color.itemSize===4,Bt=!!ot.attributes.tangent&&(!!ct.normalMap||ct.anisotropy>0),Gt=!!ot.morphAttributes.position,ie=!!ot.morphAttributes.normal,qt=!!ot.morphAttributes.color;let re=da;ct.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(re=M.toneMapping);const Oe=ot.morphAttributes.position||ot.morphAttributes.normal||ot.morphAttributes.color,de=Oe!==void 0?Oe.length:0,Yt=Pt.get(ct),xn=p.state.lights;if(F===!0&&(Y===!0||z!==y)){const Zt=z===y&&ct.id===b;yt.setState(ct,z,Zt)}let ue=!1;ct.version===Yt.__version?(Yt.needsLights&&Yt.lightsStateVersion!==xn.state.version||Yt.outputColorSpace!==Mt||P.isBatchedMesh&&Yt.batching===!1||!P.isBatchedMesh&&Yt.batching===!0||P.isBatchedMesh&&Yt.batchingColor===!0&&P.colorTexture===null||P.isBatchedMesh&&Yt.batchingColor===!1&&P.colorTexture!==null||P.isInstancedMesh&&Yt.instancing===!1||!P.isInstancedMesh&&Yt.instancing===!0||P.isSkinnedMesh&&Yt.skinning===!1||!P.isSkinnedMesh&&Yt.skinning===!0||P.isInstancedMesh&&Yt.instancingColor===!0&&P.instanceColor===null||P.isInstancedMesh&&Yt.instancingColor===!1&&P.instanceColor!==null||P.isInstancedMesh&&Yt.instancingMorph===!0&&P.morphTexture===null||P.isInstancedMesh&&Yt.instancingMorph===!1&&P.morphTexture!==null||Yt.envMap!==Et||ct.fog===!0&&Yt.fog!==nt||Yt.numClippingPlanes!==void 0&&(Yt.numClippingPlanes!==yt.numPlanes||Yt.numIntersection!==yt.numIntersection)||Yt.vertexAlphas!==Ft||Yt.vertexTangents!==Bt||Yt.morphTargets!==Gt||Yt.morphNormals!==ie||Yt.morphColors!==qt||Yt.toneMapping!==re||Yt.morphTargetsCount!==de)&&(ue=!0):(ue=!0,Yt.__version=ct.version);let Ye=Yt.currentProgram;ue===!0&&(Ye=gn(ct,Q,P));let dn=!1,Te=!1,An=!1;const xe=Ye.getUniforms(),ce=Yt.uniforms;if(vt.useProgram(Ye.program)&&(dn=!0,Te=!0,An=!0),ct.id!==b&&(b=ct.id,Te=!0),dn||y!==z){vt.buffers.depth.getReversed()?(J.copy(z.projectionMatrix),Zb(J),jb(J),xe.setValue(H,"projectionMatrix",J)):xe.setValue(H,"projectionMatrix",z.projectionMatrix),xe.setValue(H,"viewMatrix",z.matrixWorldInverse);const Ut=xe.map.cameraPosition;Ut!==void 0&&Ut.setValue(H,st.setFromMatrixPosition(z.matrixWorld)),_t.logarithmicDepthBuffer&&xe.setValue(H,"logDepthBufFC",2/(Math.log(z.far+1)/Math.LN2)),(ct.isMeshPhongMaterial||ct.isMeshToonMaterial||ct.isMeshLambertMaterial||ct.isMeshBasicMaterial||ct.isMeshStandardMaterial||ct.isShaderMaterial)&&xe.setValue(H,"isOrthographic",z.isOrthographicCamera===!0),y!==z&&(y=z,Te=!0,An=!0)}if(P.isSkinnedMesh){xe.setOptional(H,P,"bindMatrix"),xe.setOptional(H,P,"bindMatrixInverse");const Zt=P.skeleton;Zt&&(Zt.boneTexture===null&&Zt.computeBoneTexture(),xe.setValue(H,"boneTexture",Zt.boneTexture,D))}P.isBatchedMesh&&(xe.setOptional(H,P,"batchingTexture"),xe.setValue(H,"batchingTexture",P._matricesTexture,D),xe.setOptional(H,P,"batchingIdTexture"),xe.setValue(H,"batchingIdTexture",P._indirectTexture,D),xe.setOptional(H,P,"batchingColorTexture"),P._colorsTexture!==null&&xe.setValue(H,"batchingColorTexture",P._colorsTexture,D));const be=ot.morphAttributes;if((be.position!==void 0||be.normal!==void 0||be.color!==void 0)&&V.update(P,ot,Ye),(Te||Yt.receiveShadow!==P.receiveShadow)&&(Yt.receiveShadow=P.receiveShadow,xe.setValue(H,"receiveShadow",P.receiveShadow)),ct.isMeshGouraudMaterial&&ct.envMap!==null&&(ce.envMap.value=Et,ce.flipEnvMap.value=Et.isCubeTexture&&Et.isRenderTargetTexture===!1?-1:1),ct.isMeshStandardMaterial&&ct.envMap===null&&Q.environment!==null&&(ce.envMapIntensity.value=Q.environmentIntensity),Te&&(xe.setValue(H,"toneMappingExposure",M.toneMappingExposure),Yt.needsLights&&Li(ce,An),nt&&ct.fog===!0&&Ct.refreshFogUniforms(ce,nt),Ct.refreshMaterialUniforms(ce,ct,G,B,p.state.transmissionRenderTarget[z.id]),Ur.upload(H,hn(Yt),ce,D)),ct.isShaderMaterial&&ct.uniformsNeedUpdate===!0&&(Ur.upload(H,hn(Yt),ce,D),ct.uniformsNeedUpdate=!1),ct.isSpriteMaterial&&xe.setValue(H,"center",P.center),xe.setValue(H,"modelViewMatrix",P.modelViewMatrix),xe.setValue(H,"normalMatrix",P.normalMatrix),xe.setValue(H,"modelMatrix",P.matrixWorld),ct.isShaderMaterial||ct.isRawShaderMaterial){const Zt=ct.uniformsGroups;for(let Ut=0,Qt=Zt.length;Ut<Qt;Ut++){const Ue=Zt[Ut];N.update(Ue,Ye),N.bind(Ue,Ye)}}return Ye}function Li(z,Q){z.ambientLightColor.needsUpdate=Q,z.lightProbe.needsUpdate=Q,z.directionalLights.needsUpdate=Q,z.directionalLightShadows.needsUpdate=Q,z.pointLights.needsUpdate=Q,z.pointLightShadows.needsUpdate=Q,z.spotLights.needsUpdate=Q,z.spotLightShadows.needsUpdate=Q,z.rectAreaLights.needsUpdate=Q,z.hemisphereLights.needsUpdate=Q}function Tn(z){return z.isMeshLambertMaterial||z.isMeshToonMaterial||z.isMeshPhongMaterial||z.isMeshStandardMaterial||z.isShadowMaterial||z.isShaderMaterial&&z.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(z,Q,ot){Pt.get(z.texture).__webglTexture=Q,Pt.get(z.depthTexture).__webglTexture=ot;const ct=Pt.get(z);ct.__hasExternalTextures=!0,ct.__autoAllocateDepthBuffer=ot===void 0,ct.__autoAllocateDepthBuffer||Rt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),ct.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(z,Q){const ot=Pt.get(z);ot.__webglFramebuffer=Q,ot.__useDefaultFramebuffer=Q===void 0},this.setRenderTarget=function(z,Q=0,ot=0){T=z,w=Q,E=ot;let ct=!0,P=null,nt=!1,rt=!1;if(z){const Et=Pt.get(z);if(Et.__useDefaultFramebuffer!==void 0)vt.bindFramebuffer(H.FRAMEBUFFER,null),ct=!1;else if(Et.__webglFramebuffer===void 0)D.setupRenderTarget(z);else if(Et.__hasExternalTextures)D.rebindTextures(z,Pt.get(z.texture).__webglTexture,Pt.get(z.depthTexture).__webglTexture);else if(z.depthBuffer){const Gt=z.depthTexture;if(Et.__boundDepthTexture!==Gt){if(Gt!==null&&Pt.has(Gt)&&(z.width!==Gt.image.width||z.height!==Gt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");D.setupDepthRenderbuffer(z)}}const Ft=z.texture;(Ft.isData3DTexture||Ft.isDataArrayTexture||Ft.isCompressedArrayTexture)&&(rt=!0);const Bt=Pt.get(z).__webglFramebuffer;z.isWebGLCubeRenderTarget?(Array.isArray(Bt[Q])?P=Bt[Q][ot]:P=Bt[Q],nt=!0):z.samples>0&&D.useMultisampledRTT(z)===!1?P=Pt.get(z).__webglMultisampledFramebuffer:Array.isArray(Bt)?P=Bt[ot]:P=Bt,C.copy(z.viewport),I.copy(z.scissor),R=z.scissorTest}else C.copy(mt).multiplyScalar(G).floor(),I.copy(ft).multiplyScalar(G).floor(),R=Dt;if(vt.bindFramebuffer(H.FRAMEBUFFER,P)&&ct&&vt.drawBuffers(z,P),vt.viewport(C),vt.scissor(I),vt.setScissorTest(R),nt){const Et=Pt.get(z.texture);H.framebufferTexture2D(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Et.__webglTexture,ot)}else if(rt){const Et=Pt.get(z.texture),Ft=Q||0;H.framebufferTextureLayer(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,Et.__webglTexture,ot||0,Ft)}b=-1},this.readRenderTargetPixels=function(z,Q,ot,ct,P,nt,rt){if(!(z&&z.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Mt=Pt.get(z).__webglFramebuffer;if(z.isWebGLCubeRenderTarget&&rt!==void 0&&(Mt=Mt[rt]),Mt){vt.bindFramebuffer(H.FRAMEBUFFER,Mt);try{const Et=z.texture,Ft=Et.format,Bt=Et.type;if(!_t.textureFormatReadable(Ft)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!_t.textureTypeReadable(Bt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Q>=0&&Q<=z.width-ct&&ot>=0&&ot<=z.height-P&&H.readPixels(Q,ot,ct,P,Ot.convert(Ft),Ot.convert(Bt),nt)}finally{const Et=T!==null?Pt.get(T).__webglFramebuffer:null;vt.bindFramebuffer(H.FRAMEBUFFER,Et)}}},this.readRenderTargetPixelsAsync=async function(z,Q,ot,ct,P,nt,rt){if(!(z&&z.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Mt=Pt.get(z).__webglFramebuffer;if(z.isWebGLCubeRenderTarget&&rt!==void 0&&(Mt=Mt[rt]),Mt){const Et=z.texture,Ft=Et.format,Bt=Et.type;if(!_t.textureFormatReadable(Ft))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!_t.textureTypeReadable(Bt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(Q>=0&&Q<=z.width-ct&&ot>=0&&ot<=z.height-P){vt.bindFramebuffer(H.FRAMEBUFFER,Mt);const Gt=H.createBuffer();H.bindBuffer(H.PIXEL_PACK_BUFFER,Gt),H.bufferData(H.PIXEL_PACK_BUFFER,nt.byteLength,H.STREAM_READ),H.readPixels(Q,ot,ct,P,Ot.convert(Ft),Ot.convert(Bt),0);const ie=T!==null?Pt.get(T).__webglFramebuffer:null;vt.bindFramebuffer(H.FRAMEBUFFER,ie);const qt=H.fenceSync(H.SYNC_GPU_COMMANDS_COMPLETE,0);return H.flush(),await $b(H,qt,4),H.bindBuffer(H.PIXEL_PACK_BUFFER,Gt),H.getBufferSubData(H.PIXEL_PACK_BUFFER,0,nt),H.deleteBuffer(Gt),H.deleteSync(qt),nt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(z,Q=null,ot=0){z.isTexture!==!0&&(fo("WebGLRenderer: copyFramebufferToTexture function signature has changed."),Q=arguments[0]||null,z=arguments[1]);const ct=Math.pow(2,-ot),P=Math.floor(z.image.width*ct),nt=Math.floor(z.image.height*ct),rt=Q!==null?Q.x:0,Mt=Q!==null?Q.y:0;D.setTexture2D(z,0),H.copyTexSubImage2D(H.TEXTURE_2D,ot,0,0,rt,Mt,P,nt),vt.unbindTexture()},this.copyTextureToTexture=function(z,Q,ot=null,ct=null,P=0){z.isTexture!==!0&&(fo("WebGLRenderer: copyTextureToTexture function signature has changed."),ct=arguments[0]||null,z=arguments[1],Q=arguments[2],P=arguments[3]||0,ot=null);let nt,rt,Mt,Et,Ft,Bt,Gt,ie,qt;const re=z.isCompressedTexture?z.mipmaps[P]:z.image;ot!==null?(nt=ot.max.x-ot.min.x,rt=ot.max.y-ot.min.y,Mt=ot.isBox3?ot.max.z-ot.min.z:1,Et=ot.min.x,Ft=ot.min.y,Bt=ot.isBox3?ot.min.z:0):(nt=re.width,rt=re.height,Mt=re.depth||1,Et=0,Ft=0,Bt=0),ct!==null?(Gt=ct.x,ie=ct.y,qt=ct.z):(Gt=0,ie=0,qt=0);const Oe=Ot.convert(Q.format),de=Ot.convert(Q.type);let Yt;Q.isData3DTexture?(D.setTexture3D(Q,0),Yt=H.TEXTURE_3D):Q.isDataArrayTexture||Q.isCompressedArrayTexture?(D.setTexture2DArray(Q,0),Yt=H.TEXTURE_2D_ARRAY):(D.setTexture2D(Q,0),Yt=H.TEXTURE_2D),H.pixelStorei(H.UNPACK_FLIP_Y_WEBGL,Q.flipY),H.pixelStorei(H.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Q.premultiplyAlpha),H.pixelStorei(H.UNPACK_ALIGNMENT,Q.unpackAlignment);const xn=H.getParameter(H.UNPACK_ROW_LENGTH),ue=H.getParameter(H.UNPACK_IMAGE_HEIGHT),Ye=H.getParameter(H.UNPACK_SKIP_PIXELS),dn=H.getParameter(H.UNPACK_SKIP_ROWS),Te=H.getParameter(H.UNPACK_SKIP_IMAGES);H.pixelStorei(H.UNPACK_ROW_LENGTH,re.width),H.pixelStorei(H.UNPACK_IMAGE_HEIGHT,re.height),H.pixelStorei(H.UNPACK_SKIP_PIXELS,Et),H.pixelStorei(H.UNPACK_SKIP_ROWS,Ft),H.pixelStorei(H.UNPACK_SKIP_IMAGES,Bt);const An=z.isDataArrayTexture||z.isData3DTexture,xe=Q.isDataArrayTexture||Q.isData3DTexture;if(z.isRenderTargetTexture||z.isDepthTexture){const ce=Pt.get(z),be=Pt.get(Q),Zt=Pt.get(ce.__renderTarget),Ut=Pt.get(be.__renderTarget);vt.bindFramebuffer(H.READ_FRAMEBUFFER,Zt.__webglFramebuffer),vt.bindFramebuffer(H.DRAW_FRAMEBUFFER,Ut.__webglFramebuffer);for(let Qt=0;Qt<Mt;Qt++)An&&H.framebufferTextureLayer(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,Pt.get(z).__webglTexture,P,Bt+Qt),z.isDepthTexture?(xe&&H.framebufferTextureLayer(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,Pt.get(Q).__webglTexture,P,qt+Qt),H.blitFramebuffer(Et,Ft,nt,rt,Gt,ie,nt,rt,H.DEPTH_BUFFER_BIT,H.NEAREST)):xe?H.copyTexSubImage3D(Yt,P,Gt,ie,qt+Qt,Et,Ft,nt,rt):H.copyTexSubImage2D(Yt,P,Gt,ie,qt+Qt,Et,Ft,nt,rt);vt.bindFramebuffer(H.READ_FRAMEBUFFER,null),vt.bindFramebuffer(H.DRAW_FRAMEBUFFER,null)}else xe?z.isDataTexture||z.isData3DTexture?H.texSubImage3D(Yt,P,Gt,ie,qt,nt,rt,Mt,Oe,de,re.data):Q.isCompressedArrayTexture?H.compressedTexSubImage3D(Yt,P,Gt,ie,qt,nt,rt,Mt,Oe,re.data):H.texSubImage3D(Yt,P,Gt,ie,qt,nt,rt,Mt,Oe,de,re):z.isDataTexture?H.texSubImage2D(H.TEXTURE_2D,P,Gt,ie,nt,rt,Oe,de,re.data):z.isCompressedTexture?H.compressedTexSubImage2D(H.TEXTURE_2D,P,Gt,ie,re.width,re.height,Oe,re.data):H.texSubImage2D(H.TEXTURE_2D,P,Gt,ie,nt,rt,Oe,de,re);H.pixelStorei(H.UNPACK_ROW_LENGTH,xn),H.pixelStorei(H.UNPACK_IMAGE_HEIGHT,ue),H.pixelStorei(H.UNPACK_SKIP_PIXELS,Ye),H.pixelStorei(H.UNPACK_SKIP_ROWS,dn),H.pixelStorei(H.UNPACK_SKIP_IMAGES,Te),P===0&&Q.generateMipmaps&&H.generateMipmap(Yt),vt.unbindTexture()},this.copyTextureToTexture3D=function(z,Q,ot=null,ct=null,P=0){return z.isTexture!==!0&&(fo("WebGLRenderer: copyTextureToTexture3D function signature has changed."),ot=arguments[0]||null,ct=arguments[1]||null,z=arguments[2],Q=arguments[3],P=arguments[4]||0),fo('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(z,Q,ot,ct,P)},this.initRenderTarget=function(z){Pt.get(z).__webglFramebuffer===void 0&&D.setupRenderTarget(z)},this.initTexture=function(z){z.isCubeTexture?D.setTextureCube(z,0):z.isData3DTexture?D.setTexture3D(z,0):z.isDataArrayTexture||z.isCompressedArrayTexture?D.setTexture2DArray(z,0):D.setTexture2D(z,0),vt.unbindTexture()},this.resetState=function(){w=0,E=0,T=null,vt.reset(),Lt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Wi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Se._getDrawingBufferColorSpace(t),e.unpackColorSpace=Se._getUnpackColorSpace()}}class sA extends qe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Pi,this.environmentIntensity=1,this.environmentRotation=new Pi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class oA{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Ch,this.updateRanges=[],this.version=0,this.uuid=Ri()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let a=0,s=this.stride;a<s;a++)this.array[t+a]=e.array[i+a];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ri()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ri()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Un=new W;class Qr{constructor(t,e,i,a=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=a}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)Un.fromBufferAttribute(this,e),Un.applyMatrix4(t),this.setXYZ(e,Un.x,Un.y,Un.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Un.fromBufferAttribute(this,e),Un.applyNormalMatrix(t),this.setXYZ(e,Un.x,Un.y,Un.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Un.fromBufferAttribute(this,e),Un.transformDirection(t),this.setXYZ(e,Un.x,Un.y,Un.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=mi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=De(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=De(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=De(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=De(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=De(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=mi(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=mi(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=mi(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=mi(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=De(e,this.array),i=De(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=De(e,this.array),i=De(i,this.array),a=De(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=De(e,this.array),i=De(i,this.array),a=De(a,this.array),s=De(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this.data.array[t+3]=s,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return new _n(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Qr(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Dh extends Wa{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new te(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let ps;const so=new W,ms=new W,gs=new W,xs=new Vt,oo=new Vt,km=new Ae,xr=new W,ro=new W,vr=new W,zf=new Vt,xl=new Vt,Ff=new Vt;class Uf extends qe{constructor(t=new Dh){if(super(),this.isSprite=!0,this.type="Sprite",ps===void 0){ps=new Je;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new oA(e,5);ps.setIndex([0,1,2,0,2,3]),ps.setAttribute("position",new Qr(i,3,0,!1)),ps.setAttribute("uv",new Qr(i,2,3,!1))}this.geometry=ps,this.material=t,this.center=new Vt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ms.setFromMatrixScale(this.matrixWorld),km.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),gs.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ms.multiplyScalar(-gs.z);const i=this.material.rotation;let a,s;i!==0&&(s=Math.cos(i),a=Math.sin(i));const o=this.center;yr(xr.set(-.5,-.5,0),gs,o,ms,a,s),yr(ro.set(.5,-.5,0),gs,o,ms,a,s),yr(vr.set(.5,.5,0),gs,o,ms,a,s),zf.set(0,0),xl.set(1,0),Ff.set(1,1);let r=t.ray.intersectTriangle(xr,ro,vr,!1,so);if(r===null&&(yr(ro.set(-.5,.5,0),gs,o,ms,a,s),xl.set(0,1),r=t.ray.intersectTriangle(xr,vr,ro,!1,so),r===null))return;const c=t.ray.origin.distanceTo(so);c<t.near||c>t.far||e.push({distance:c,point:so.clone(),uv:ti.getInterpolation(so,xr,ro,vr,zf,xl,Ff,new Vt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function yr(n,t,e,i,a,s){xs.subVectors(n,e).addScalar(.5).multiply(i),a!==void 0?(oo.x=s*xs.x-a*xs.y,oo.y=a*xs.x+s*xs.y):oo.copy(xs),n.copy(t),n.x+=oo.x,n.y+=oo.y,n.applyMatrix4(km)}class rA extends kn{constructor(t=null,e=1,i=1,a,s,o,r,c,l=ei,d=ei,u,h){super(null,o,r,c,l,d,a,s,u,h),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class _o extends _n{constructor(t,e,i,a=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=a}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const vs=new Ae,Nf=new Ae,Mr=[],Of=new Va,cA=new Ae,co=new me,lo=new Bs;class Bf extends me{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new _o(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let a=0;a<i;a++)this.setMatrixAt(a,cA)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Va),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,vs),Of.copy(t.boundingBox).applyMatrix4(vs),this.boundingBox.union(Of)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Bs),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,vs),lo.copy(t.boundingSphere).applyMatrix4(vs),this.boundingSphere.union(lo)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const i=e.morphTargetInfluences,a=this.morphTexture.source.data.data,s=i.length+1,o=t*s+1;for(let r=0;r<i.length;r++)i[r]=a[o+r]}raycast(t,e){const i=this.matrixWorld,a=this.count;if(co.geometry=this.geometry,co.material=this.material,co.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),lo.copy(this.boundingSphere),lo.applyMatrix4(i),t.ray.intersectsSphere(lo)!==!1))for(let s=0;s<a;s++){this.getMatrixAt(s,vs),Nf.multiplyMatrices(i,vs),co.matrixWorld=Nf,co.raycast(t,Mr);for(let o=0,r=Mr.length;o<r;o++){const c=Mr[o];c.instanceId=s,c.object=this,e.push(c)}Mr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new _o(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const i=e.morphTargetInfluences,a=i.length+1;this.morphTexture===null&&(this.morphTexture=new rA(new Float32Array(a*this.count),a,this.count,ed,Ti));const s=this.morphTexture.source.data.data;let o=0;for(let l=0;l<i.length;l++)o+=i[l];const r=this.geometry.morphTargetsRelative?1:1-o,c=a*t;s[c]=r,s.set(i,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class kh extends Wa{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new te(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const tc=new W,ec=new W,Hf=new Ae,ho=new od,_r=new Bs,vl=new W,Gf=new W;class lA extends qe{constructor(t=new Je,e=new kh){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let a=1,s=e.count;a<s;a++)tc.fromBufferAttribute(e,a-1),ec.fromBufferAttribute(e,a),i[a]=i[a-1],i[a]+=tc.distanceTo(ec);t.setAttribute("lineDistance",new Re(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,a=this.matrixWorld,s=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),_r.copy(i.boundingSphere),_r.applyMatrix4(a),_r.radius+=s,t.ray.intersectsSphere(_r)===!1)return;Hf.copy(a).invert(),ho.copy(t.ray).applyMatrix4(Hf);const r=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=r*r,l=this.isLineSegments?2:1,d=i.index,h=i.attributes.position;if(d!==null){const f=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let v=f,g=m-1;v<g;v+=l){const p=d.getX(v),_=d.getX(v+1),x=br(this,t,ho,c,p,_);x&&e.push(x)}if(this.isLineLoop){const v=d.getX(m-1),g=d.getX(f),p=br(this,t,ho,c,v,g);p&&e.push(p)}}else{const f=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let v=f,g=m-1;v<g;v+=l){const p=br(this,t,ho,c,v,v+1);p&&e.push(p)}if(this.isLineLoop){const v=br(this,t,ho,c,m-1,f);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}}function br(n,t,e,i,a,s){const o=n.geometry.attributes.position;if(tc.fromBufferAttribute(o,a),ec.fromBufferAttribute(o,s),e.distanceSqToSegment(tc,ec,vl,Gf)>i)return;vl.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(vl);if(!(c<t.near||c>t.far))return{distance:c,point:Gf.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const Xf=new W,Vf=new W;class Wf extends lA{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let a=0,s=e.count;a<s;a+=2)Xf.fromBufferAttribute(e,a),Vf.fromBufferAttribute(e,a+1),i[a]=a===0?0:i[a-1],i[a+1]=i[a]+Xf.distanceTo(Vf);t.setAttribute("lineDistance",new Re(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Ih extends kn{constructor(t,e,i,a,s,o,r,c,l){super(t,e,i,a,s,o,r,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ci{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,a=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),s+=i.distanceTo(a),e.push(s),a=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let a=0;const s=i.length;let o;e?o=e:o=t*i[s-1];let r=0,c=s-1,l;for(;r<=c;)if(a=Math.floor(r+(c-r)/2),l=i[a]-o,l<0)r=a+1;else if(l>0)c=a-1;else{c=a;break}if(a=c,i[a]===o)return a/(s-1);const d=i[a],h=i[a+1]-d,f=(o-d)/h;return(a+f)/(s-1)}getTangent(t,e){let a=t-1e-4,s=t+1e-4;a<0&&(a=0),s>1&&(s=1);const o=this.getPoint(a),r=this.getPoint(s),c=e||(o.isVector2?new Vt:new W);return c.copy(r).sub(o).normalize(),c}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new W,a=[],s=[],o=[],r=new W,c=new Ae;for(let f=0;f<=t;f++){const m=f/t;a[f]=this.getTangentAt(m,new W)}s[0]=new W,o[0]=new W;let l=Number.MAX_VALUE;const d=Math.abs(a[0].x),u=Math.abs(a[0].y),h=Math.abs(a[0].z);d<=l&&(l=d,i.set(1,0,0)),u<=l&&(l=u,i.set(0,1,0)),h<=l&&i.set(0,0,1),r.crossVectors(a[0],i).normalize(),s[0].crossVectors(a[0],r),o[0].crossVectors(a[0],s[0]);for(let f=1;f<=t;f++){if(s[f]=s[f-1].clone(),o[f]=o[f-1].clone(),r.crossVectors(a[f-1],a[f]),r.length()>Number.EPSILON){r.normalize();const m=Math.acos(En(a[f-1].dot(a[f]),-1,1));s[f].applyMatrix4(c.makeRotationAxis(r,m))}o[f].crossVectors(a[f],s[f])}if(e===!0){let f=Math.acos(En(s[0].dot(s[t]),-1,1));f/=t,a[0].dot(r.crossVectors(s[0],s[t]))>0&&(f=-f);for(let m=1;m<=t;m++)s[m].applyMatrix4(c.makeRotationAxis(a[m],f*m)),o[m].crossVectors(a[m],s[m])}return{tangents:a,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class hd extends Ci{constructor(t=0,e=0,i=1,a=1,s=0,o=Math.PI*2,r=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=a,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=r,this.aRotation=c}getPoint(t,e=new Vt){const i=e,a=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=a;for(;s>a;)s-=a;s<Number.EPSILON&&(o?s=0:s=a),this.aClockwise===!0&&!o&&(s===a?s=-a:s=s-a);const r=this.aStartAngle+t*s;let c=this.aX+this.xRadius*Math.cos(r),l=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),h=c-this.aX,f=l-this.aY;c=h*d-f*u+this.aX,l=h*u+f*d+this.aY}return i.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class hA extends hd{constructor(t,e,i,a,s,o){super(t,e,i,i,a,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function dd(){let n=0,t=0,e=0,i=0;function a(s,o,r,c){n=s,t=r,e=-3*s+3*o-2*r-c,i=2*s-2*o+r+c}return{initCatmullRom:function(s,o,r,c,l){a(o,r,l*(r-s),l*(c-o))},initNonuniformCatmullRom:function(s,o,r,c,l,d,u){let h=(o-s)/l-(r-s)/(l+d)+(r-o)/d,f=(r-o)/d-(c-o)/(d+u)+(c-r)/u;h*=d,f*=d,a(o,r,h,f)},calc:function(s){const o=s*s,r=o*s;return n+t*s+e*o+i*r}}}const Sr=new W,yl=new dd,Ml=new dd,_l=new dd;class dA extends Ci{constructor(t=[],e=!1,i="centripetal",a=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=a}getPoint(t,e=new W){const i=e,a=this.points,s=a.length,o=(s-(this.closed?0:1))*t;let r=Math.floor(o),c=o-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/s)+1)*s:c===0&&r===s-1&&(r=s-2,c=1);let l,d;this.closed||r>0?l=a[(r-1)%s]:(Sr.subVectors(a[0],a[1]).add(a[0]),l=Sr);const u=a[r%s],h=a[(r+1)%s];if(this.closed||r+2<s?d=a[(r+2)%s]:(Sr.subVectors(a[s-1],a[s-2]).add(a[s-1]),d=Sr),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let m=Math.pow(l.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(h),f),g=Math.pow(h.distanceToSquared(d),f);v<1e-4&&(v=1),m<1e-4&&(m=v),g<1e-4&&(g=v),yl.initNonuniformCatmullRom(l.x,u.x,h.x,d.x,m,v,g),Ml.initNonuniformCatmullRom(l.y,u.y,h.y,d.y,m,v,g),_l.initNonuniformCatmullRom(l.z,u.z,h.z,d.z,m,v,g)}else this.curveType==="catmullrom"&&(yl.initCatmullRom(l.x,u.x,h.x,d.x,this.tension),Ml.initCatmullRom(l.y,u.y,h.y,d.y,this.tension),_l.initCatmullRom(l.z,u.z,h.z,d.z,this.tension));return i.set(yl.calc(c),Ml.calc(c),_l.calc(c)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new W().fromArray(a))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Yf(n,t,e,i,a){const s=(i-t)*.5,o=(a-e)*.5,r=n*n,c=n*r;return(2*e-2*i+s+o)*c+(-3*e+3*i-2*s-o)*r+s*n+e}function uA(n,t){const e=1-n;return e*e*t}function fA(n,t){return 2*(1-n)*n*t}function pA(n,t){return n*n*t}function bo(n,t,e,i){return uA(n,t)+fA(n,e)+pA(n,i)}function mA(n,t){const e=1-n;return e*e*e*t}function gA(n,t){const e=1-n;return 3*e*e*n*t}function xA(n,t){return 3*(1-n)*n*n*t}function vA(n,t){return n*n*n*t}function So(n,t,e,i,a){return mA(n,t)+gA(n,e)+xA(n,i)+vA(n,a)}class Im extends Ci{constructor(t=new Vt,e=new Vt,i=new Vt,a=new Vt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new Vt){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(So(t,a.x,s.x,o.x,r.x),So(t,a.y,s.y,o.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class yA extends Ci{constructor(t=new W,e=new W,i=new W,a=new W){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new W){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(So(t,a.x,s.x,o.x,r.x),So(t,a.y,s.y,o.y,r.y),So(t,a.z,s.z,o.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class zm extends Ci{constructor(t=new Vt,e=new Vt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Vt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Vt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class MA extends Ci{constructor(t=new W,e=new W){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new W){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new W){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Fm extends Ci{constructor(t=new Vt,e=new Vt,i=new Vt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Vt){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(bo(t,a.x,s.x,o.x),bo(t,a.y,s.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class _A extends Ci{constructor(t=new W,e=new W,i=new W){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new W){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(bo(t,a.x,s.x,o.x),bo(t,a.y,s.y,o.y),bo(t,a.z,s.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Um extends Ci{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Vt){const i=e,a=this.points,s=(a.length-1)*t,o=Math.floor(s),r=s-o,c=a[o===0?o:o-1],l=a[o],d=a[o>a.length-2?a.length-1:o+1],u=a[o>a.length-3?a.length-1:o+2];return i.set(Yf(r,c.x,l.x,d.x,u.x),Yf(r,c.y,l.y,d.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new Vt().fromArray(a))}return this}}var $f=Object.freeze({__proto__:null,ArcCurve:hA,CatmullRomCurve3:dA,CubicBezierCurve:Im,CubicBezierCurve3:yA,EllipseCurve:hd,LineCurve:zm,LineCurve3:MA,QuadraticBezierCurve:Fm,QuadraticBezierCurve3:_A,SplineCurve:Um});class bA extends Ci{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new $f[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),a=this.getCurveLengths();let s=0;for(;s<a.length;){if(a[s]>=i){const o=a[s]-i,r=this.curves[s],c=r.getLength(),l=c===0?0:1-o/c;return r.getPointAt(l,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,a=this.curves.length;i<a;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let a=0,s=this.curves;a<s.length;a++){const o=s[a],r=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(r);for(let l=0;l<c.length;l++){const d=c[l];i&&i.equals(d)||(e.push(d),i=d)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(a.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const a=this.curves[e];t.curves.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(new $f[a.type]().fromJSON(a))}return this}}class Zf extends bA{constructor(t){super(),this.type="Path",this.currentPoint=new Vt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new zm(this.currentPoint.clone(),new Vt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,a){const s=new Fm(this.currentPoint.clone(),new Vt(t,e),new Vt(i,a));return this.curves.push(s),this.currentPoint.set(i,a),this}bezierCurveTo(t,e,i,a,s,o){const r=new Im(this.currentPoint.clone(),new Vt(t,e),new Vt(i,a),new Vt(s,o));return this.curves.push(r),this.currentPoint.set(s,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new Um(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,a,s,o){const r=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+r,e+c,i,a,s,o),this}absarc(t,e,i,a,s,o){return this.absellipse(t,e,i,i,a,s,o),this}ellipse(t,e,i,a,s,o,r,c){const l=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(t+l,e+d,i,a,s,o,r,c),this}absellipse(t,e,i,a,s,o,r,c){const l=new hd(t,e,i,a,s,o,r,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const d=l.getPoint(1);return this.currentPoint.copy(d),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class ud extends Je{constructor(t=1,e=32,i=0,a=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:a},e=Math.max(3,e);const s=[],o=[],r=[],c=[],l=new W,d=new Vt;o.push(0,0,0),r.push(0,0,1),c.push(.5,.5);for(let u=0,h=3;u<=e;u++,h+=3){const f=i+u/e*a;l.x=t*Math.cos(f),l.y=t*Math.sin(f),o.push(l.x,l.y,l.z),r.push(0,0,1),d.x=(o[h]/t+1)/2,d.y=(o[h+1]/t+1)/2,c.push(d.x,d.y)}for(let u=1;u<=e;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new Re(o,3)),this.setAttribute("normal",new Re(r,3)),this.setAttribute("uv",new Re(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ud(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class ko extends Je{constructor(t=1,e=1,i=1,a=32,s=1,o=!1,r=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:a,heightSegments:s,openEnded:o,thetaStart:r,thetaLength:c};const l=this;a=Math.floor(a),s=Math.floor(s);const d=[],u=[],h=[],f=[];let m=0;const v=[],g=i/2;let p=0;_(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(d),this.setAttribute("position",new Re(u,3)),this.setAttribute("normal",new Re(h,3)),this.setAttribute("uv",new Re(f,2));function _(){const M=new W,S=new W;let w=0;const E=(e-t)/i;for(let T=0;T<=s;T++){const b=[],y=T/s,C=y*(e-t)+t;for(let I=0;I<=a;I++){const R=I/a,U=R*c+r,L=Math.sin(U),k=Math.cos(U);S.x=C*L,S.y=-y*i+g,S.z=C*k,u.push(S.x,S.y,S.z),M.set(L,E,k).normalize(),h.push(M.x,M.y,M.z),f.push(R,1-y),b.push(m++)}v.push(b)}for(let T=0;T<a;T++)for(let b=0;b<s;b++){const y=v[b][T],C=v[b+1][T],I=v[b+1][T+1],R=v[b][T+1];(t>0||b!==0)&&(d.push(y,C,R),w+=3),(e>0||b!==s-1)&&(d.push(C,I,R),w+=3)}l.addGroup(p,w,0),p+=w}function x(M){const S=m,w=new Vt,E=new W;let T=0;const b=M===!0?t:e,y=M===!0?1:-1;for(let I=1;I<=a;I++)u.push(0,g*y,0),h.push(0,y,0),f.push(.5,.5),m++;const C=m;for(let I=0;I<=a;I++){const U=I/a*c+r,L=Math.cos(U),k=Math.sin(U);E.x=b*k,E.y=g*y,E.z=b*L,u.push(E.x,E.y,E.z),h.push(0,y,0),w.x=L*.5+.5,w.y=k*.5*y+.5,f.push(w.x,w.y),m++}for(let I=0;I<a;I++){const R=S+I,U=C+I;M===!0?d.push(U,U+1,R):d.push(U+1,U,R),T+=3}l.addGroup(p,T,M===!0?1:2),p+=T}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ko(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class fd extends ko{constructor(t=1,e=1,i=32,a=1,s=!1,o=0,r=Math.PI*2){super(0,t,e,i,a,s,o,r),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:a,openEnded:s,thetaStart:o,thetaLength:r}}static fromJSON(t){return new fd(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class pd extends Je{constructor(t=[],e=[],i=1,a=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:a};const s=[],o=[];r(a),l(i),d(),this.setAttribute("position",new Re(s,3)),this.setAttribute("normal",new Re(s.slice(),3)),this.setAttribute("uv",new Re(o,2)),a===0?this.computeVertexNormals():this.normalizeNormals();function r(_){const x=new W,M=new W,S=new W;for(let w=0;w<e.length;w+=3)f(e[w+0],x),f(e[w+1],M),f(e[w+2],S),c(x,M,S,_)}function c(_,x,M,S){const w=S+1,E=[];for(let T=0;T<=w;T++){E[T]=[];const b=_.clone().lerp(M,T/w),y=x.clone().lerp(M,T/w),C=w-T;for(let I=0;I<=C;I++)I===0&&T===w?E[T][I]=b:E[T][I]=b.clone().lerp(y,I/C)}for(let T=0;T<w;T++)for(let b=0;b<2*(w-T)-1;b++){const y=Math.floor(b/2);b%2===0?(h(E[T][y+1]),h(E[T+1][y]),h(E[T][y])):(h(E[T][y+1]),h(E[T+1][y+1]),h(E[T+1][y]))}}function l(_){const x=new W;for(let M=0;M<s.length;M+=3)x.x=s[M+0],x.y=s[M+1],x.z=s[M+2],x.normalize().multiplyScalar(_),s[M+0]=x.x,s[M+1]=x.y,s[M+2]=x.z}function d(){const _=new W;for(let x=0;x<s.length;x+=3){_.x=s[x+0],_.y=s[x+1],_.z=s[x+2];const M=g(_)/2/Math.PI+.5,S=p(_)/Math.PI+.5;o.push(M,1-S)}m(),u()}function u(){for(let _=0;_<o.length;_+=6){const x=o[_+0],M=o[_+2],S=o[_+4],w=Math.max(x,M,S),E=Math.min(x,M,S);w>.9&&E<.1&&(x<.2&&(o[_+0]+=1),M<.2&&(o[_+2]+=1),S<.2&&(o[_+4]+=1))}}function h(_){s.push(_.x,_.y,_.z)}function f(_,x){const M=_*3;x.x=t[M+0],x.y=t[M+1],x.z=t[M+2]}function m(){const _=new W,x=new W,M=new W,S=new W,w=new Vt,E=new Vt,T=new Vt;for(let b=0,y=0;b<s.length;b+=9,y+=6){_.set(s[b+0],s[b+1],s[b+2]),x.set(s[b+3],s[b+4],s[b+5]),M.set(s[b+6],s[b+7],s[b+8]),w.set(o[y+0],o[y+1]),E.set(o[y+2],o[y+3]),T.set(o[y+4],o[y+5]),S.copy(_).add(x).add(M).divideScalar(3);const C=g(S);v(w,y+0,_,C),v(E,y+2,x,C),v(T,y+4,M,C)}}function v(_,x,M,S){S<0&&_.x===1&&(o[x]=_.x-1),M.x===0&&M.z===0&&(o[x]=S/2/Math.PI+.5)}function g(_){return Math.atan2(_.z,-_.x)}function p(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new pd(t.vertices,t.indices,t.radius,t.details)}}const wr=new W,Er=new W,bl=new W,Tr=new ti;class SA extends Je{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const a=Math.pow(10,4),s=Math.cos(Ts*e),o=t.getIndex(),r=t.getAttribute("position"),c=o?o.count:r.count,l=[0,0,0],d=["a","b","c"],u=new Array(3),h={},f=[];for(let m=0;m<c;m+=3){o?(l[0]=o.getX(m),l[1]=o.getX(m+1),l[2]=o.getX(m+2)):(l[0]=m,l[1]=m+1,l[2]=m+2);const{a:v,b:g,c:p}=Tr;if(v.fromBufferAttribute(r,l[0]),g.fromBufferAttribute(r,l[1]),p.fromBufferAttribute(r,l[2]),Tr.getNormal(bl),u[0]=`${Math.round(v.x*a)},${Math.round(v.y*a)},${Math.round(v.z*a)}`,u[1]=`${Math.round(g.x*a)},${Math.round(g.y*a)},${Math.round(g.z*a)}`,u[2]=`${Math.round(p.x*a)},${Math.round(p.y*a)},${Math.round(p.z*a)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let _=0;_<3;_++){const x=(_+1)%3,M=u[_],S=u[x],w=Tr[d[_]],E=Tr[d[x]],T=`${M}_${S}`,b=`${S}_${M}`;b in h&&h[b]?(bl.dot(h[b].normal)<=s&&(f.push(w.x,w.y,w.z),f.push(E.x,E.y,E.z)),h[b]=null):T in h||(h[T]={index0:l[_],index1:l[x],normal:bl.clone()})}}for(const m in h)if(h[m]){const{index0:v,index1:g}=h[m];wr.fromBufferAttribute(r,v),Er.fromBufferAttribute(r,g),f.push(wr.x,wr.y,wr.z),f.push(Er.x,Er.y,Er.z)}this.setAttribute("position",new Re(f,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class Nm extends Zf{constructor(t){super(t),this.uuid=Ri(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,a=this.holes.length;i<a;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const a=this.holes[e];t.holes.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(new Zf().fromJSON(a))}return this}}const wA={triangulate:function(n,t,e=2){const i=t&&t.length,a=i?t[0]*e:n.length;let s=Om(n,0,a,e,!0);const o=[];if(!s||s.next===s.prev)return o;let r,c,l,d,u,h,f;if(i&&(s=PA(n,t,s,e)),n.length>80*e){r=l=n[0],c=d=n[1];for(let m=e;m<a;m+=e)u=n[m],h=n[m+1],u<r&&(r=u),h<c&&(c=h),u>l&&(l=u),h>d&&(d=h);f=Math.max(l-r,d-c),f=f!==0?32767/f:0}return Io(s,o,e,r,c,f,0),o}};function Om(n,t,e,i,a){let s,o;if(a===BA(n,t,e,i)>0)for(s=t;s<e;s+=i)o=jf(s,n[s],n[s+1],o);else for(s=e-i;s>=t;s-=i)o=jf(s,n[s],n[s+1],o);return o&&fc(o,o.next)&&(Fo(o),o=o.next),o}function Xa(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(fc(e,e.next)||je(e.prev,e,e.next)===0)){if(Fo(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function Io(n,t,e,i,a,s,o){if(!n)return;!o&&s&&IA(n,i,a,s);let r=n,c,l;for(;n.prev!==n.next;){if(c=n.prev,l=n.next,s?TA(n,i,a,s):EA(n)){t.push(c.i/e|0),t.push(n.i/e|0),t.push(l.i/e|0),Fo(n),n=l.next,r=l.next;continue}if(n=l,n===r){o?o===1?(n=AA(Xa(n),t,e),Io(n,t,e,i,a,s,2)):o===2&&RA(n,t,e,i,a,s):Io(Xa(n),t,e,i,a,s,1);break}}}function EA(n){const t=n.prev,e=n,i=n.next;if(je(t,e,i)>=0)return!1;const a=t.x,s=e.x,o=i.x,r=t.y,c=e.y,l=i.y,d=a<s?a<o?a:o:s<o?s:o,u=r<c?r<l?r:l:c<l?c:l,h=a>s?a>o?a:o:s>o?s:o,f=r>c?r>l?r:l:c>l?c:l;let m=i.next;for(;m!==t;){if(m.x>=d&&m.x<=h&&m.y>=u&&m.y<=f&&bs(a,r,s,c,o,l,m.x,m.y)&&je(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function TA(n,t,e,i){const a=n.prev,s=n,o=n.next;if(je(a,s,o)>=0)return!1;const r=a.x,c=s.x,l=o.x,d=a.y,u=s.y,h=o.y,f=r<c?r<l?r:l:c<l?c:l,m=d<u?d<h?d:h:u<h?u:h,v=r>c?r>l?r:l:c>l?c:l,g=d>u?d>h?d:h:u>h?u:h,p=zh(f,m,t,e,i),_=zh(v,g,t,e,i);let x=n.prevZ,M=n.nextZ;for(;x&&x.z>=p&&M&&M.z<=_;){if(x.x>=f&&x.x<=v&&x.y>=m&&x.y<=g&&x!==a&&x!==o&&bs(r,d,c,u,l,h,x.x,x.y)&&je(x.prev,x,x.next)>=0||(x=x.prevZ,M.x>=f&&M.x<=v&&M.y>=m&&M.y<=g&&M!==a&&M!==o&&bs(r,d,c,u,l,h,M.x,M.y)&&je(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;x&&x.z>=p;){if(x.x>=f&&x.x<=v&&x.y>=m&&x.y<=g&&x!==a&&x!==o&&bs(r,d,c,u,l,h,x.x,x.y)&&je(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;M&&M.z<=_;){if(M.x>=f&&M.x<=v&&M.y>=m&&M.y<=g&&M!==a&&M!==o&&bs(r,d,c,u,l,h,M.x,M.y)&&je(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function AA(n,t,e){let i=n;do{const a=i.prev,s=i.next.next;!fc(a,s)&&Bm(a,i,i.next,s)&&zo(a,s)&&zo(s,a)&&(t.push(a.i/e|0),t.push(i.i/e|0),t.push(s.i/e|0),Fo(i),Fo(i.next),i=n=s),i=i.next}while(i!==n);return Xa(i)}function RA(n,t,e,i,a,s){let o=n;do{let r=o.next.next;for(;r!==o.prev;){if(o.i!==r.i&&UA(o,r)){let c=Hm(o,r);o=Xa(o,o.next),c=Xa(c,c.next),Io(o,t,e,i,a,s,0),Io(c,t,e,i,a,s,0);return}r=r.next}o=o.next}while(o!==n)}function PA(n,t,e,i){const a=[];let s,o,r,c,l;for(s=0,o=t.length;s<o;s++)r=t[s]*i,c=s<o-1?t[s+1]*i:n.length,l=Om(n,r,c,i,!1),l===l.next&&(l.steiner=!0),a.push(FA(l));for(a.sort(CA),s=0;s<a.length;s++)e=LA(a[s],e);return e}function CA(n,t){return n.x-t.x}function LA(n,t){const e=DA(n,t);if(!e)return t;const i=Hm(e,n);return Xa(i,i.next),Xa(e,e.next)}function DA(n,t){let e=t,i=-1/0,a;const s=n.x,o=n.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const h=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(h<=s&&h>i&&(i=h,a=e.x<e.next.x?e:e.next,h===s))return a}e=e.next}while(e!==t);if(!a)return null;const r=a,c=a.x,l=a.y;let d=1/0,u;e=a;do s>=e.x&&e.x>=c&&s!==e.x&&bs(o<l?s:i,o,c,l,o<l?i:s,o,e.x,e.y)&&(u=Math.abs(o-e.y)/(s-e.x),zo(e,n)&&(u<d||u===d&&(e.x>a.x||e.x===a.x&&kA(a,e)))&&(a=e,d=u)),e=e.next;while(e!==r);return a}function kA(n,t){return je(n.prev,n,t.prev)<0&&je(t.next,n,n.next)<0}function IA(n,t,e,i){let a=n;do a.z===0&&(a.z=zh(a.x,a.y,t,e,i)),a.prevZ=a.prev,a.nextZ=a.next,a=a.next;while(a!==n);a.prevZ.nextZ=null,a.prevZ=null,zA(a)}function zA(n){let t,e,i,a,s,o,r,c,l=1;do{for(e=n,n=null,s=null,o=0;e;){for(o++,i=e,r=0,t=0;t<l&&(r++,i=i.nextZ,!!i);t++);for(c=l;r>0||c>0&&i;)r!==0&&(c===0||!i||e.z<=i.z)?(a=e,e=e.nextZ,r--):(a=i,i=i.nextZ,c--),s?s.nextZ=a:n=a,a.prevZ=s,s=a;e=i}s.nextZ=null,l*=2}while(o>1);return n}function zh(n,t,e,i,a){return n=(n-e)*a|0,t=(t-i)*a|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function FA(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function bs(n,t,e,i,a,s,o,r){return(a-o)*(t-r)>=(n-o)*(s-r)&&(n-o)*(i-r)>=(e-o)*(t-r)&&(e-o)*(s-r)>=(a-o)*(i-r)}function UA(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!NA(n,t)&&(zo(n,t)&&zo(t,n)&&OA(n,t)&&(je(n.prev,n,t.prev)||je(n,t.prev,t))||fc(n,t)&&je(n.prev,n,n.next)>0&&je(t.prev,t,t.next)>0)}function je(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function fc(n,t){return n.x===t.x&&n.y===t.y}function Bm(n,t,e,i){const a=Rr(je(n,t,e)),s=Rr(je(n,t,i)),o=Rr(je(e,i,n)),r=Rr(je(e,i,t));return!!(a!==s&&o!==r||a===0&&Ar(n,e,t)||s===0&&Ar(n,i,t)||o===0&&Ar(e,n,i)||r===0&&Ar(e,t,i))}function Ar(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function Rr(n){return n>0?1:n<0?-1:0}function NA(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&Bm(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function zo(n,t){return je(n.prev,n,n.next)<0?je(n,t,n.next)>=0&&je(n,n.prev,t)>=0:je(n,t,n.prev)<0||je(n,n.next,t)<0}function OA(n,t){let e=n,i=!1;const a=(n.x+t.x)/2,s=(n.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&a<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function Hm(n,t){const e=new Fh(n.i,n.x,n.y),i=new Fh(t.i,t.x,t.y),a=n.next,s=t.prev;return n.next=t,t.prev=n,e.next=a,a.prev=e,i.next=e,e.prev=i,s.next=i,i.prev=s,i}function jf(n,t,e,i){const a=new Fh(n,t,e);return i?(a.next=i.next,a.prev=i,i.next.prev=a,i.next=a):(a.prev=a,a.next=a),a}function Fo(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Fh(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function BA(n,t,e,i){let a=0;for(let s=t,o=e-i;s<e;s+=i)a+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return a}class wo{static area(t){const e=t.length;let i=0;for(let a=e-1,s=0;s<e;a=s++)i+=t[a].x*t[s].y-t[s].x*t[a].y;return i*.5}static isClockWise(t){return wo.area(t)<0}static triangulateShape(t,e){const i=[],a=[],s=[];qf(t),Kf(i,t);let o=t.length;e.forEach(qf);for(let c=0;c<e.length;c++)a.push(o),o+=e[c].length,Kf(i,e[c]);const r=wA.triangulate(i,a);for(let c=0;c<r.length;c+=3)s.push(r.slice(c,c+3));return s}}function qf(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function Kf(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class md extends pd{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],a=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,a,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new md(t.radius,t.detail)}}class Rs extends Je{constructor(t=.5,e=1,i=32,a=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:a,thetaStart:s,thetaLength:o},i=Math.max(3,i),a=Math.max(1,a);const r=[],c=[],l=[],d=[];let u=t;const h=(e-t)/a,f=new W,m=new Vt;for(let v=0;v<=a;v++){for(let g=0;g<=i;g++){const p=s+g/i*o;f.x=u*Math.cos(p),f.y=u*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),m.x=(f.x/e+1)/2,m.y=(f.y/e+1)/2,d.push(m.x,m.y)}u+=h}for(let v=0;v<a;v++){const g=v*(i+1);for(let p=0;p<i;p++){const _=p+g,x=_,M=_+i+1,S=_+i+2,w=_+1;r.push(x,M,w),r.push(M,S,w)}}this.setIndex(r),this.setAttribute("position",new Re(c,3)),this.setAttribute("normal",new Re(l,3)),this.setAttribute("uv",new Re(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Rs(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class gd extends Je{constructor(t=new Nm([new Vt(0,.5),new Vt(-.5,-.5),new Vt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],a=[],s=[],o=[];let r=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let d=0;d<t.length;d++)l(t[d]),this.addGroup(r,c,d),r+=c,c=0;this.setIndex(i),this.setAttribute("position",new Re(a,3)),this.setAttribute("normal",new Re(s,3)),this.setAttribute("uv",new Re(o,2));function l(d){const u=a.length/3,h=d.extractPoints(e);let f=h.shape;const m=h.holes;wo.isClockWise(f)===!1&&(f=f.reverse());for(let g=0,p=m.length;g<p;g++){const _=m[g];wo.isClockWise(_)===!0&&(m[g]=_.reverse())}const v=wo.triangulateShape(f,m);for(let g=0,p=m.length;g<p;g++){const _=m[g];f=f.concat(_)}for(let g=0,p=f.length;g<p;g++){const _=f[g];a.push(_.x,_.y,0),s.push(0,0,1),o.push(_.x,_.y)}for(let g=0,p=v.length;g<p;g++){const _=v[g],x=_[0]+u,M=_[1]+u,S=_[2]+u;i.push(x,M,S),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return HA(e,t)}static fromJSON(t,e){const i=[];for(let a=0,s=t.shapes.length;a<s;a++){const o=e[t.shapes[a]];i.push(o)}return new gd(i,t.curveSegments)}}function HA(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const a=n[e];t.shapes.push(a.uuid)}else t.shapes.push(n.uuid);return t}class pc extends Je{constructor(t=1,e=.4,i=12,a=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:a,arc:s},i=Math.floor(i),a=Math.floor(a);const o=[],r=[],c=[],l=[],d=new W,u=new W,h=new W;for(let f=0;f<=i;f++)for(let m=0;m<=a;m++){const v=m/a*s,g=f/i*Math.PI*2;u.x=(t+e*Math.cos(g))*Math.cos(v),u.y=(t+e*Math.cos(g))*Math.sin(v),u.z=e*Math.sin(g),r.push(u.x,u.y,u.z),d.x=t*Math.cos(v),d.y=t*Math.sin(v),h.subVectors(u,d).normalize(),c.push(h.x,h.y,h.z),l.push(m/a),l.push(f/i)}for(let f=1;f<=i;f++)for(let m=1;m<=a;m++){const v=(a+1)*f+m-1,g=(a+1)*(f-1)+m-1,p=(a+1)*(f-1)+m,_=(a+1)*f+m;o.push(v,g,_),o.push(g,p,_)}this.setIndex(o),this.setAttribute("position",new Re(r,3)),this.setAttribute("normal",new Re(c,3)),this.setAttribute("uv",new Re(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new pc(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Zi extends Wa{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new te(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new te(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=mm,this.normalScale=new Vt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Pi,this.combine=Kh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Gm extends qe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new te(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class GA extends Gm{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(qe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new te(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Sl=new Ae,Jf=new W,Qf=new W;class XA{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Vt(512,512),this.map=null,this.mapPass=null,this.matrix=new Ae,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new cd,this._frameExtents=new Vt(1,1),this._viewportCount=1,this._viewports=[new nn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;Jf.setFromMatrixPosition(t.matrixWorld),e.position.copy(Jf),Qf.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Qf),e.updateMatrixWorld(),Sl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Sl),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Sl)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class VA extends XA{constructor(){super(new Am(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class WA extends Gm{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(qe.DEFAULT_UP),this.updateMatrix(),this.target=new qe,this.shadow=new VA}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const tp=new Ae;class YA{constructor(t,e,i=0,a=1/0){this.ray=new od(t,e),this.near=i,this.far=a,this.camera=null,this.layers=new rd,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return tp.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(tp),this}intersectObject(t,e=!0,i=[]){return Uh(t,this,i,e),i.sort(ep),i}intersectObjects(t,e=!0,i=[]){for(let a=0,s=t.length;a<s;a++)Uh(t[a],this,i,e);return i.sort(ep),i}}function ep(n,t){return n.distance-t.distance}function Uh(n,t,e,i){let a=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(a=!1),a===!0&&i===!0){const s=n.children;for(let o=0,r=s.length;o<r;o++)Uh(s[o],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:qh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=qh);const $A={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function ZA(n,t,e,i){const a=new ri(n.fov,i,.1,200),s=new W,o=new W,r=new W;let c=!1,l=n.fov;const d={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let u=1,h=0,f=0,m=0,v=0,g=0,p=0;function _(){const x=(n.pitchDeg+d.pitchDelta)*Math.PI/180,M=n.yawDeg*Math.PI/180;r.set(Math.sin(M)*Math.cos(x),Math.sin(x),Math.cos(M)*Math.cos(x)).multiplyScalar(n.distance*d.distanceScale*d.zoom)}return _(),{camera:a,update(x,M,S,w,E=$A){const T=M+.6;if(!c)s.set(x,T,S),c=!0;else{const C=1-Math.exp(-Math.max(n.smoothing,.001)*w);s.x+=(x-s.x)*C,s.y+=(T-s.y)*C,s.z+=(S-s.z)*C}const b=1-Math.exp(-Math.max(t.smoothing,.001)*w);d.distanceScale+=(E.distanceScale-d.distanceScale)*b,d.offsetX+=(E.offsetX-d.offsetX)*b,d.offsetZ+=(E.offsetZ-d.offsetZ)*b,d.pitchDelta+=(E.pitchDelta-d.pitchDelta)*b;const y=1-Math.exp(-Math.max(e.smoothing,.001)*w);if(d.zoom+=(u-d.zoom)*y,_(),(a.fov!==l||a.fov!==n.fov)&&(a.fov=n.fov,l=n.fov,a.updateProjectionMatrix()),o.set(s.x+d.offsetX,s.y,s.z+d.offsetZ),a.position.copy(o).add(r),a.lookAt(o),h>.001){f+=w*52;const C=h*.055;a.position.x+=Math.sin(f*1.7)*C,a.position.y+=Math.sin(f*2.3+1.1)*C*.75,a.position.z+=Math.sin(f*1.3+2.4)*C*.5,h*=Math.exp(-9*w)}else h=0;g>.001?(a.position.x+=m*g,a.position.z+=v*g,g*=Math.exp(-13*w)):g=0,a.updateMatrixWorld()},snap(x,M,S){s.set(x,M+.6,S),c=!0,o.set(s.x+d.offsetX,s.y,s.z+d.offsetZ),_(),a.position.copy(o).add(r),a.lookAt(o),a.updateMatrixWorld()},resize(x){a.aspect=x,a.updateProjectionMatrix()},getGroundBasis(){const x=new W().setFromMatrixColumn(a.matrixWorld,0),M=new W().setFromMatrixColumn(a.matrixWorld,2).negate(),S=Math.hypot(x.x,x.z)||1,w=Math.hypot(M.x,M.z)||1;return{rightX:x.x/S,rightZ:x.z/S,forwardX:M.x/w,forwardZ:M.z/w}},addShake(x){!Number.isFinite(x)||x<=0||(h=Math.min(1,h+x))},shakeLevel(){return h},addKick(x,M,S){if(!Number.isFinite(x)||!Number.isFinite(M)||!(S>0))return;const w=Math.hypot(x,M);w<1e-4||(m=x/w*S,v=M/w*S,g=1,p++)},kickLevel(){return g},kickCount(){return p},setZoom(x){u=Number.isFinite(x)&&x>0?x:1},smart(){return{...d}}}}const Oa=Math.PI*2,Hn=1e-6;function Ke(n,t,e){return n<t?t:n>e?e:n}function Xm(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function jA(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function Vm(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const a=jA(n);return i===1?a:e+(a-e)*i}function np(n){return(1-Math.sin(n))/2}function xd(n,t,e){const i=Math.PI/180,a=Ke(Number.isFinite(t)?t:100,0,180),s=Ke(Number.isFinite(e)?e:132,0,180);if(s<=a)return n>=Math.cos(a*i)?1:0;const o=Math.cos(a*i),r=Math.cos(s*i);if(n>=o)return 1;const c=Ke((o-n)/(o-r),0,1);return 1-c*c*(3-2*c)}function nc(n,t,e,i){const a=t>=0?1:-1,o=2/Math.max(Hn,i)*Math.max(0,e),r=Ke(n,-1,1),c=a-r;return Math.abs(c)<=o?a:r+Math.sign(c)*o}function ip(n){const t=Ke(Number.isFinite(n)?n:1,-1,1),e=Math.abs(t);return Math.sign(t)*e*e*(3-2*e)}function qA(n,t,e,i){if(!(e>0))return t;const a=e*Math.max(0,i),s=t-n;return Math.abs(s)<=a?t:n+Math.sign(s)*a}const ap=30*Math.PI/180,KA=100*Math.PI/180,JA=.06,QA=.22;function Wm(n){return Ke((Math.abs(n)-ap)/(KA-ap),0,1)}function Ym(n,t,e,i=JA,a=QA){const s=Ke(n,0,1),o=Ke(t,0,1),r=o>s?Math.max(Hn,i):Math.max(Hn,a),c=e/r*1,l=o-s;return Math.abs(l)<=c?o:s+Math.sign(l)*c}function $m(n,t,e,i,a){if(!(e>0))return t;const s=1-Ke(a,0,1);return s<=1e-9?n:qA(n,t,s*e,i)}function ic(n,t){if(!n.grounded||n.speed<Hn)return Xm();const e=n.speed/Math.max(n.moveSpeed,Hn),i=Math.max(n.legLength,Hn),a=n.stride>Hn?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,s=Math.min(t.maxAmp,a/i),o=i*Math.sin(Math.min(t.maxAmp,1.25)),r=Math.abs(n.localForward),c=Math.abs(n.localRight),l=r+c+Hn,d=xd(n.localForward/Math.max(n.speed,Hn),t.backStrafeStartDeg,t.backStrafeFullDeg),u=c/l*d,h=r/l+c/l*(1-d),f=ip(n.dirF??(n.localForward>=0?1:-1)),m=ip(n.dirR??(n.localRight>=0?1:-1)),v=a,g=U=>Math.asin(Ke(U,-o,o)/i);function p(U,L){const k=Vm(U,t.plantLock),B=np(U),G=f*h*v*k,$=-g(G),at=L*m>0?1:-1,mt=1+at*t.crossStep*.45,ft=m*at*t.crossStep*v*.4*B,Dt=m*u*v*t.sideWeight*mt*k+ft*u,j=g(Dt),F=t.kneeLift*B*s*(.55+.25*h+.1*u*(1+L*m));return{pitchX:$,rollZ:j,kneeX:F}}const _=(n.phase%Oa+Oa)%Oa,x=p(_,-1),M=p((_+Math.PI)%Oa,1),S=Math.cos(_),w=np(_),E=-t.comSway*s*S*(.6*h+.8*u)-m*t.comSway*s*u*.45,T=t.comBob*w*s,b=m*t.hipLean*s*u*S*.6,y=m*t.hipLean*s*u*(.45+.25*S),C=t.armSwing*s*S*(h*f+.3*u),I=C,R=-C;return{legL:x,legR:M,pelvisX:E,pelvisY:T,pelvisRoll:b,sideLean:y,armL:I,armR:R,strafe:u,backward:f<0?h:0}}function Zm(n){const t=(n%Oa+Oa)%Oa,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function jm(n,t,e){const i=Ke(e.progress,0,1);if(i>=1||n.speed<Hn)return Xm();const a=i*i*(3-2*i),s=1-a;return ic({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*a,speed:n.speed*s,stride:n.stride*s},t)}function qm(n,t,e,i){const a=Ke(n,-1,1),s=Math.abs(a),o=Math.min(1,t*(1+Math.max(0,i)*s*s));return Ke(o*a,-1,1)*(e*Math.PI/180)}function Km(n,t=0){const e=Ke(n,0,1);return e*e+(1-e*e)*Ke(t,0,1)}function Jm(n,t,e){if(!(n>0)||!(t>0))return 0;const i=Ke(e,0,1);return t+(n-t)*i}function Qm(n,t,e,i){if(!(Math.hypot(n,t)>1e-6))return e;const s=Math.atan2(t,n)*180/Math.PI;if(Math.abs(s)<=90)return e;const r=(s-Math.sign(s)*180)*Math.PI/180,c=Ke(i,0,1);return e*c+r*(1-c)}function t0(n,t,e,i,a){const s=Math.max(e,Hn),o=Math.max(0,i)*s,r=Math.max(0,a)*s,c=t>Hn?(t-n)/t:0,l=c>.02,d=c<-.015,u=n<=o*.15,h=!d&&n<r&&(l||u);return{enter:n>Hn&&n<=o&&l,resume:!h}}function e0(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return Ke(n*Ke(t,0,2),-i,i)}function n0(n,t,e){const i=Math.sin(n),a=Math.cos(n),s=Math.cos(n),o=-Math.sin(n);return{forward:t*i+e*a,right:t*s+e*o}}function i0(n,t,e){const i=Ke(n,0,1),a=i*i*(3-2*i);return e?t==="inStop"?1-a:1:t==="afterStop"?1-a:0}function t2(n,t,e){const i=()=>({legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisY:0,env:0});if(!e.turnStepEnabled)return i();const a=Ke(n,0,1),s=Math.sin(Math.PI*a),o=s*s;if(o<=1e-9)return i();const r=t>=0,c=r?1:.35,l=r?.35:1,d=Math.max(0,e.turnStepPitch)*o,u=Math.max(0,e.turnStepKnee)*o,h=Math.max(0,e.turnStepPitch)*.35*o,f=r?1:-1;return{legL:{pitchX:-d*c,rollZ:f*h*c,kneeX:u*c},legR:{pitchX:-d*l,rollZ:-f*h*l,kneeX:u*l},pelvisY:-Math.max(0,e.turnStepDip)*o,env:o}}function a0(n,t,e,i,a){const s=Ke(n,0,1),o=Ke(a.stopPeakRatio,.05,.95),r=s<=o?s/o:(s-o)/(1-o),c=r*r*(3-2*r),l=s<=o?c:1-c,d=Math.hypot(e,i),u=d>Hn?e/d:1,h=d>Hn?i/d:0,f=Vm(t,1)>0;return{leadPitch:Math.max(0,a.stopStepPitch)*l,trailPitch:Math.max(0,a.stopTrailPitch)*l,leadKnee:Math.max(0,a.stopStepKnee)*l,bodyShift:Math.max(0,a.stopBodyShift)*l,bodyDip:Math.max(0,a.stopBodyDip)*l,chestPitch:Math.max(0,a.stopChestPitch)*l,leadLeft:f,fwdN:u,rightN:h,env:l}}function Dn(n){return n<0?0:n>1?1:n}const Nr=Math.PI*2;function e2(n){return((n+Math.PI)%Nr+Nr)%Nr-Math.PI}function n2(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function i2(n,t,e,i,a,s=n.phase){const o=Dn(i);if(o<=0)return n;const r=Dn(t),c=Math.max(1,Math.round(a.cycles)),l=Math.max(0,a.strideSpeed),d=e%2===0?1:-1,u=Dn(a.forwardBias),h=Math.max(0,n.stride??0),f=Math.max(0,a.strideScale??0)*h,m=r*r*(3-2*r),v={speed:l,phase:s+Nr*c/2*m,localForward:l*u,localRight:l*(1-u)*d},g=e2(v.phase-n.phase),p=o*o*(3-2*o),_=n.speed>.05?h:0;return{speed:n.speed+(v.speed-n.speed)*o,phase:n.phase+g*p,localForward:n.localForward+(v.localForward-n.localForward)*o,localRight:n.localRight+(v.localRight-n.localRight)*o,stride:_+(f-_)*o*o}}function a2(n,t,e){const i=n2(),a=Dn(n),s=Math.sin(Math.PI*a)**2;if(s<=1e-12)return i;const o=t%2===0?1:-1,r=o<0,c=o>0,l=e.stepPitch*s,d=e.stepKnee*s,u=e.stepSide*s;return i.legL.pitchX=r?-l:l*.55,i.legR.pitchX=c?-l:l*.55,i.legL.kneeX=r?d:d*.4,i.legR.kneeX=c?d:d*.4,i.legL.rollZ=-u*o,i.legR.rollZ=u*o,i.pelvisX=e.stepSway*s*o,i.pelvisY=-e.stepDip*s,i.pelvisRoll=u*.25*o,i}function s0(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function sp(n,t,e,i,a){if(e<=0||i<=0)return 0;const s=(n-t)/e;return s<0||s>=1?0:i*s0(s,a)}function s2(n,t,e,i){const a=t?1:0,s=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),o=n+(a-n)*s;return t&&o>.999?1:!t&&o<.001?0:o}function o2(n,t,e){const i=Dn(n);return{gaitScale:1-i*(1-Dn(t)),attackLegWeight:Dn(e)*i}}function r2(n,t,e){const i=Dn(e);if(i<=0)return n;if(i>=1)return{...n,...t,armL:n.armL,armR:n.armR,strafe:n.strafe,backward:n.backward};const a=(s,o)=>s+(o-s)*i;return{legL:{pitchX:a(n.legL.pitchX,t.legL.pitchX),rollZ:a(n.legL.rollZ,t.legL.rollZ),kneeX:a(n.legL.kneeX,t.legL.kneeX)},legR:{pitchX:a(n.legR.pitchX,t.legR.pitchX),rollZ:a(n.legR.rollZ,t.legR.rollZ),kneeX:a(n.legR.kneeX,t.legR.kneeX)},pelvisX:a(n.pelvisX,t.pelvisX),pelvisY:a(n.pelvisY,t.pelvisY),pelvisRoll:a(n.pelvisRoll,t.pelvisRoll),sideLean:n.sideLean,armL:n.armL,armR:n.armR,strafe:n.strafe,backward:n.backward}}function c2(n,t){const e=Dn(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function l2(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return Dn(t.minScale+(1-t.minScale)*e)}function h2(){return o0()}function o0(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function d2(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function u2(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?Dn(t.forceHitHeight):n.type==="light"?Dn(t.hitHeight.light):n.type==="heavy"?Dn(t.hitHeight.heavy):n.type==="knock"?Dn(t.hitHeight.knock):0}function f2(n,t,e){const i=Dn(e),a=(s,o)=>s+(o-s)*i;return{upperPitch:a(n.upperPitch,t.upperPitch),upperRoll:a(n.upperRoll,t.upperRoll),upperYaw:a(n.upperYaw,t.upperYaw),fold:a(n.fold,t.fold),shift:a(n.shift,t.shift),drop:a(n.drop,t.drop),back:a(n.back,t.back),knee:a(n.knee,t.knee),hip:a(n.hip,t.hip),arm:a(n.arm,t.arm)}}function r0(n,t,e){const i=o0(),a=d2(n,e);if(i.intensity=a,a<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const s=Dn(1-n.timer/n.duration),o=s0(s,e.pulseRatio);i.pulse=o,i.active=o>0,i.hitHeight=u2(n,e);const r=Math.sin(t),c=Math.cos(t),l=Math.cos(t),d=-Math.sin(t),u=n.dirX*r+n.dirZ*c,h=n.dirX*l+n.dirZ*d;if(i.localFwd=u,i.localRight=h,!e.enabled){i.legacy=!0;const v=Math.sin(Math.PI*s);return i.upperPitch=a*v*u,i.upperRoll=-a*v*h*.7,i.drop=(a>.5?.09:.04)*v,i.flash=e.flashStrength*v,i.active=v>0,i}const f=a*o,m=f2(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=f*(m.upperPitch*u+m.fold),i.upperRoll=-f*m.upperRoll*h,i.upperYaw=f*m.upperYaw*h,i.upperShift=f*m.shift,i.upperShiftX=i.upperShift*h,i.upperShiftZ=i.upperShift*u,i.comShift=f*e.comShift,i.comX=i.comShift*h,i.comZ=i.comShift*u,i.pelvisBack=f*m.back,i.drop=f*m.drop,i.knee=f*m.knee,i.hip=f*m.hip,i.arm=f*m.arm,i.flash=e.flashStrength*o,i}function c0(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),a=Number.isFinite(n.leanForward)?n.leanForward:0,s=Number.isFinite(n.leanSide)?n.leanSide:0,o=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:a*e,pelvisRoll:s*e,pelvisX:-s*i,pelvisZ:a*i,crouch:Math.max(0,t.moveCrouch)*o}}const Ra=1e-6;function Eo(n,t,e){return n<t?t:n>e?e:n}function l0(n,t,e,i=1){const a=t,s=e;if(!Number.isFinite(a)||!Number.isFinite(s)||a<=Ra||s<=Ra||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const r=a+s,c=Math.abs(a-s)+Ra,l=Math.hypot(n.x,n.y,n.z);if(l<=Ra)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const d=Math.atan2(n.x,-n.y),u=Math.hypot(n.x,n.y),h=n.z,f=Math.hypot(h,u),m=Eo(f,c,r),v=f>r+Ra||f<c-Ra,g=Math.atan2(-h,Math.max(u,Ra)),p=Eo((a*a+m*m-s*s)/(2*a*m),-1,1),_=Eo((s*s+m*m-a*a)/(2*s*m),-1,1),x=Math.acos(p),M=Math.acos(_),S=i>=0?1:-1;return{rootPitch:g-S*x,rootRoll:d,jointPitch:S*(x+M),clamped:v,reach:l/r}}function h0(n,t,e,i){const a=Eo(e,0,1),s=Math.max(0,i),o=(r,c)=>{const l=Eo((c-r)*a,-s,s);return r+l};return{rootPitch:o(n.rootPitch,t.rootPitch),rootRoll:o(n.rootRoll,t.rootRoll),jointPitch:o(n.jointPitch,t.jointPitch)}}function d0(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const vd={active:!1,weight:0,clamped:0,maxError:0};function u0(n){const{root:t,pelvis:e,lower:i,limbs:a,base:s,cfg:o}=n;if(!o.enabled||o.weight<=0||!n.grounded||a.length===0)return{...vd};const r={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(s.pelvisPos),e.rotation.x=s.pelvisRotX,e.rotation.z=s.pelvisRotZ,i.position.copy(s.lowerPos),i.rotation.z=s.lowerRotZ,t.updateWorldMatrix(!0,!0);const c=a.map(f=>f.tip.getWorldPosition(new W));e.position.copy(r.pelvisPos),e.rotation.x=r.pelvisRotX,e.rotation.z=r.pelvisRotZ,i.position.copy(r.lowerPos),i.rotation.z=r.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const l=Math.max(0,Math.min(1,o.weight))*(n.attacking?Math.max(0,Math.min(1,o.attackScale)):1),d=Math.max(0,o.maxCorrectionDeg)*Math.PI/180;let u=0;for(let f=0;f<a.length;f++){const m=a[f],v=i.worldToLocal(c[f].clone()),g={x:v.x-m.root.position.x,y:v.y-m.root.position.y,z:v.z-m.root.position.z},p=l0(g,m.upperLen,m.lowerLen,m.bend);p.clamped&&(u+=1);const _=h0({rootPitch:m.root.rotation.x,rootRoll:m.root.rotation.z,jointPitch:m.joint.rotation.x},p,l,d);m.root.rotation.x=_.rootPitch,m.root.rotation.z=_.rootRoll,m.joint.rotation.x=_.jointPitch}t.updateWorldMatrix(!0,!0);let h=0;for(let f=0;f<a.length;f++){const m=a[f].tip.getWorldPosition(new W);h=Math.max(h,m.distanceTo(c[f]))}return{active:!0,weight:l,clamped:u,maxError:h}}function Nn(n,t,e){return n<t?t:n>e?e:n}function p2(n,t,e,i,a,s,o,r,c,l){const d=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},u=new _e,h=new _e;h.name="pelvis",h.position.y=n.legLength,u.add(h);const f=new _e;f.name="lower";const m=new _e;m.name="upper",h.add(f),h.add(m);const v=[],g=(V,pt,Ht,Ot)=>{const Lt=new Zi({color:Ot}),N=new me(new ni(V,pt,Ht),Lt);return N.castShadow=!0,N.receiveShadow=!0,v.push(Lt),N},p=n.headSize,_=n.legLength,x=n.armLength,M=n.limbThickness,S=n.bodyHeight,w=n.bodyWidth,E=g(w,S,.28,e);E.position.y=S/2,m.add(E);const T=new _e;T.name="headPivot",T.rotation.order="YXZ",T.position.y=S,m.add(T);const b=g(p,p,p,e);b.position.y=p/2,T.add(b);for(const V of[-1,1]){const pt=g(.06,.07,.02,t.shoe);pt.position.set(V*.09,p/2+.03,p/2+.011),T.add(pt)}const y=(V,pt)=>{const Ht=pt?x:_,Ot=new _e;Ot.name=pt?V<0?"shoulderL":"shoulderR":V<0?"hipL":"hipR",pt||(Ot.rotation.order="ZYX"),Ot.position.set(V*(pt?w/2+M/2:w/2-M/2),pt?S-.04:0,0),(pt?m:f).add(Ot);const Lt=g(M,Ht/2,M,t.limb);Lt.position.y=-Ht/4,Ot.add(Lt);const N=new _e;N.name=pt?"elbow":"knee",N.position.y=-Ht/2,Ot.add(N);const bt=g(M,Ht/2,M,t.limb);if(bt.position.y=-Ht/4,N.add(bt),!pt){const et=g(M*1.15,.07,M*1.7,t.shoe);et.position.set(0,-Ht/2+.035,.045),N.add(et);const ht=new qe;return ht.name="footTip",ht.position.y=-Ht/2,N.add(ht),{root:Ot,joint:N,tip:ht}}return{root:Ot,joint:N}},C=y(-1,!1),I=y(1,!1),R=y(-1,!0),U=y(1,!0),L=[C,I].map(V=>({root:V.root,joint:V.joint,tip:V.tip,upperLen:_/2,lowerLen:_/2,bend:1})),k=new Mn({color:a.attackArcColor,transparent:!0,opacity:0,side:We,depthWrite:!1}),B=new me(new pc(.62,.042,6,20,Math.PI*1.1),k);B.position.set(0,.78-_,.56),m.add(B);const G=new te(e),$=new te(r.flashColor),at=new te;let mt=null,ft=0,Dt=0,j=0,F=0,Y=0,J=0,K=0,st={...vd},Tt=-1,Wt=0,dt=0,X=0,H=0,kt=0,Rt=0,_t=0,vt=1,gt=0,Pt=0,D=0,A=0,q=-1,ut=0,it="none",lt=0,Nt=!1,Ct=-1,wt=!1,$t=0,yt=0,zt=1,Z=1;return{group:u,boneAtWorld(V,pt,Ht){const Ot=[{node:m,ax:0,ay:.05,az:0,bx:0,by:S,bz:0},{node:T,ax:0,ay:0,az:0,bx:0,by:p,bz:0},{node:R.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:R.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:U.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:U.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:C.root,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:C.joint,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:I.root,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:I.joint,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0}],Lt=new W,N=new W,bt=new W(V,pt,Ht),et=new W;let ht=null,It=Number.POSITIVE_INFINITY;for(const At of Ot){At.node.updateWorldMatrix(!0,!1),Lt.set(At.ax,At.ay,At.az),N.set(At.bx,At.by,At.bz),At.node.localToWorld(Lt),At.node.localToWorld(N);const jt=N.x-Lt.x,se=N.y-Lt.y,oe=N.z-Lt.z,ee=jt*jt+se*se+oe*oe;let ye=ee>1e-8?((bt.x-Lt.x)*jt+(bt.y-Lt.y)*se+(bt.z-Lt.z)*oe)/ee:0;ye=Math.max(0,Math.min(1,ye));const we=Lt.x+jt*ye,Qe=Lt.y+se*ye,ln=Lt.z+oe*ye,Pe=(bt.x-we)**2+(bt.y-Qe)**2+(bt.z-ln)**2;Pe<It&&(It=Pe,ht=At.node,et.set(we,Qe,ln))}return ht?{node:ht,point:et.clone()}:null},update(V,pt,Ht){const Ot=Ht===void 0||q<0?pt:Nn(Ht-q,0,.1);Ht!==void 0&&(q=Ht),u.position.set(V.position.x,V.position.y,V.position.z),u.rotation.y=V.bodyYaw,T.rotation.y=(V.headYaw-V.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,V.mode!==mt&&(mt=V.mode,ft=1),ft=Math.max(0,ft-pt*2.2);const Lt=V.hurt,N=r0(Lt,V.bodyYaw,r),bt=N.flash;at.copy($).multiplyScalar(bt);for(const ce of v)ce.emissive.copy(G).multiplyScalar(ft*.5),bt>0&&ce.emissive.add(at);h.position.set(0,_,0),h.rotation.set(0,0,0),m.position.set(0,0,0),m.rotation.set(0,0,0),f.position.set(0,0,0),f.rotation.z=0;const et=Math.hypot(V.velocity.x,V.velocity.z),ht=Nn(o.knockGaitScale??0,0,1),It=V.hurt.knockX*ht,At=V.hurt.knockZ*ht,jt=ht>0&&Math.hypot(V.hurt.knockX,V.hurt.knockZ)>.001,se=V.velocity.x+It,oe=V.velocity.z+At,ee=Math.hypot(se,oe),ye=Math.cos(V.bodyYaw),we=-Math.sin(V.bodyYaw),Qe=et>1e-6?Nn((V.velocity.x*ye+V.velocity.z*we)/et,-1,1):0,ln=et>1e-6?Nn((V.velocity.x*Math.sin(V.bodyYaw)+V.velocity.z*Math.cos(V.bodyYaw))/et,-1,1):1,Pe=xd(ln,o.backStrafeStartDeg,o.backStrafeFullDeg);it==="settled"&&wt&&$t>yt*1.02+1e-4&&(it="none");let Ee=1;it==="blend"?(Ee=i0(Nt?Ct:lt,o.stopYawBlendMode,Nt),Nt||(lt=Math.min(1,lt+pt/Math.max(.01,o.stopYawAfterSec)),(lt>=1||o.stopYawBlendMode==="inStop"||wt)&&(it="settled",Ee=0))):it==="settled"&&(Ee=Nn(et/Math.max(1e-6,o.stopEnterRatio*s),0,1));const mn=qm(Qe,o.strafeHipScale,o.strafeHipMaxDeg,o.strafeHipBoost),In=Ot>1e-6?Ne(V.bodyYaw-D)/Ot:0;D=V.bodyYaw;const tn=(o.hipYawTrackRateDeg??0)*Math.PI/180,zn=(o.hipYawBackRateDeg??0)*Math.PI/180,gn=Ot>1e-6?Ot:pt;A=tn>0?Ym(A,Wm(In),gn):0;const hn=Km(Pe,A),Ce=Nn(et/.5,0,1),ci=Qm(ln,Qe,mn,hn)*Ee*Ce,Li=$m(Pt,ci,Jm(tn,zn,hn),gn,A);Pt=Li,gt+=(Li-gt)*(1-Math.exp(-12*Math.max(0,gn))),f.rotation.y=gt;const Tn=V.bodyYaw+gt,z=Math.sin(Tn),Q=Math.cos(Tn),ot=Math.cos(Tn),ct=-Math.sin(Tn),P=se*z+oe*Q,nt=se*ot+oe*ct,rt=Math.max(0,o.stopBlendSec||0),Mt=rt>0&&!jt,Et=t0(et,ut,s,o.stopEnterRatio,o.stopExitRatio);if(!Mt||Et.resume)Tt=-1;else if(Tt<0&&Et.enter){Tt=0,Wt=V.gaitPhase,dt=Zm(V.gaitPhase),X=et,H=Math.max(V.stride,1e-6),kt=P,Rt=nt;const ce=1/Math.max(1e-6,et);_t=V.velocity.x*ce,vt=V.velocity.z*ce}const Ft=ut;ut=et;const Bt=Mt&&Tt>=0;Bt&&(Tt=Math.min(1,Tt+pt/rt)),Bt&&it!=="blend"&&(it="blend",lt=0),Nt=Bt&&Tt<1,Ct=Tt,wt=Et.resume,$t=et,yt=Ft;const Gt=Math.max(0,o.dirFlipSec??0);Gt>0?(zt=nc(zt,P>=0?1:-1,pt,Gt),Z=nc(Z,nt>=0?1:-1,pt,Gt)):(zt=P>=0?1:-1,Z=nt>=0?1:-1);const ie=Bt?{phase:Wt,speed:X,moveSpeed:s,localForward:kt,localRight:Rt,dirF:zt,dirR:Z,legLength:n.legLength,stride:H,grounded:!0}:{phase:V.gaitPhase,speed:ee,moveSpeed:s,localForward:P,localRight:nt,dirF:zt,dirR:Z,legLength:n.legLength,stride:V.stride,grounded:!0},qt=Bt?jm(ie,o,{progress:Tt,phase0:Wt,phaseEnd:dt}):ic(ie,o);let re=0,Oe=0,de=0,Yt=0;if(Bt){const ce=n0(V.bodyYaw,_t,vt),be=a0(Tt,Wt,ce.forward,ce.right,o);be.leadLeft?(qt.legL.pitchX-=be.leadPitch,qt.legL.kneeX+=be.leadKnee,qt.legR.pitchX+=be.trailPitch):(qt.legR.pitchX-=be.leadPitch,qt.legR.kneeX+=be.leadKnee,qt.legL.pitchX+=be.trailPitch),Oe=be.bodyShift*be.fwdN,re=be.bodyShift*be.rightN,de=be.bodyDip,Yt=be.chestPitch}C.root.rotation.x=qt.legL.pitchX,I.root.rotation.x=qt.legR.pitchX,C.root.rotation.z=qt.legL.rollZ,I.root.rotation.z=qt.legR.rollZ,C.joint.rotation.x=qt.legL.kneeX,I.joint.rotation.x=qt.legR.kneeX,R.root.rotation.x=qt.armL,U.root.rotation.x=qt.armR,R.joint.rotation.x=-.18,U.joint.rotation.x=-.18,h.position.x=qt.pelvisX,h.position.y=_+qt.pelvisY,h.position.z=0,h.rotation.z=qt.pelvisRoll,m.rotation.z=qt.sideLean*(N.intensity>0?.4:1);const xn=d0(h,f),ue=Bt&&d.enabled?{...d,weight:1}:d,Ye=ue.enabled&&ue.weight>0?Nn(ue.weight,0,1):0;if(h.position.x+=re,h.position.z+=Oe,h.position.y-=de,f.position.y+=de,Ye<=0&&(f.position.x-=re,f.position.z-=Oe),c){const ce=Math.max(.004166666666666667,Math.min(pt,.1)),be=Math.sin(V.bodyYaw),Zt=Math.cos(V.bodyYaw),Ut=Nn((V.velocity.x-Dt)/ce,-60,60),Qt=Nn((V.velocity.z-j)/ce,-60,60),Ue=Ut*be+Qt*Zt,an=Ne(V.bodyYaw-F)/ce,xi=c.maxForwardDeg*Math.PI/180,bn=c.maxSideDeg*Math.PI/180,Rn=1-Math.exp(-Math.max(0,c.smoothing)*ce);Y+=(Nn(Ue*c.accelGain,-xi,xi)-Y)*Rn,J+=(Nn(-an*et*c.turnGain,-bn,bn)-J)*Rn;const Sn=Number.isFinite(c.crouchSmoothing)?c.crouchSmoothing:8;K+=(Nn(et/Math.max(s,1e-6),0,1)-K)*(1-Math.exp(-Math.max(0,Sn)*ce));const wn=c0({leanForward:Y,leanSide:J,speedRatio:K},c);m.rotation.x+=Y+Yt,m.rotation.z+=J,h.rotation.x+=wn.pelvisPitch,h.rotation.z+=wn.pelvisRoll,h.position.x+=wn.pelvisX,h.position.z+=wn.pelvisZ,h.position.y-=wn.crouch,f.position.y+=wn.crouch*(1-Ye)}Dt=V.velocity.x,j=V.velocity.z,F=V.bodyYaw,m.rotation.x+=N.upperPitch,m.rotation.z+=N.upperRoll,m.rotation.y+=N.upperYaw;const dn=Nn(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),Te=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;m.position.x+=Nn(N.upperShiftX*dn,-Te,Te),m.position.z+=Nn(N.upperShiftZ*dn,-Te,Te),h.position.x+=N.comX,h.position.z+=N.comZ-N.pelvisBack,h.position.y-=N.drop;const An=N.legacy?0:Math.max(0,Math.min(1,r.lowerScale));if(f.position.z+=N.pelvisBack*(1-An),f.position.y+=N.drop*(1-An),C.joint.rotation.x+=N.knee,I.joint.rotation.x+=N.knee,C.root.rotation.x-=N.hip,I.root.rotation.x-=N.hip,R.root.rotation.x+=N.arm,U.root.rotation.x+=N.arm*.8,V.attackPhase!=="idle"&&N.intensity===0){const ce=V.attackProgress,be=ce<.34?-1:ce<.68?-1+(ce-.34)/.34*2:Math.max(0,1-(ce-.68)/.32),Zt=Math.max(0,-be),Ut=Math.max(0,be);U.root.rotation.x=-1.7*Zt+1.25*Ut,U.joint.rotation.x=-(.25+Zt*.45),m.rotation.y=-.28*be,k.opacity=V.attackPhase==="active"?.85:0,V.attackPhase==="active"&&(B.rotation.z=-1.1+ce*3)}else k.opacity=0;const xe=e0(gt,o.chestYawScale,o.chestYawMaxDeg);m.rotation.y+=xe,T.rotation.y=(V.headYaw-V.bodyYaw-xe+Math.PI*3)%(Math.PI*2)-Math.PI,st=u0({root:u,pelvis:h,lower:f,limbs:L,base:xn,cfg:ue,grounded:!0,attacking:V.attackPhase!=="idle"})},ik(){return st},dispose(){u.traverse(V=>{if(V instanceof me){V.geometry.dispose();const pt=V.material;Array.isArray(pt)?pt.forEach(Ht=>Ht.dispose()):pt.dispose()}})}}}const m2=9.81;function mo(n,t,e){return n<t?t:n>e?e:n}function g2(n,t,e,i,a){const s=a!=null&&a.gravity&&a.gravity>0?a.gravity:m2,o={comX:0,comY:0,comZ:0,xcomX:0,xcomZ:0,centerX:0,centerZ:0,halfX:0,halfZ:0,marginX:1,marginZ:1,score:1,leanDeg:0,side:0,overX:0,overZ:0,grounded:!1};let r=0,c=0,l=0,d=0;for(const b of n){const y=Number.isFinite(b.mass)&&b.mass>0?b.mass:0;!Number.isFinite(b.x)||!Number.isFinite(b.y)||!Number.isFinite(b.z)||(r+=y,c+=b.x*y,l+=b.y*y,d+=b.z*y)}if(r<=1e-6)return o;c/=r,l/=r,d/=r;const u=Math.max(.02,(t.maxX-t.minX)/2),h=Math.max(.02,(t.maxZ-t.minZ)/2),f=(t.minX+t.maxX)/2,m=(t.minZ+t.maxZ)/2;if(!(t.maxX-t.minX>.03&&t.maxZ-t.minZ>.03))return{...o,comX:c,comY:l,comZ:d,centerX:f,centerZ:m,halfX:u,halfZ:h};const g=mo((a==null?void 0:a.reactionTime)??.18,.02,1),p=Math.sqrt(Math.max(.05,l)/s)*g*4,_=c+(Number.isFinite(e)?e:0)*p,x=d+(Number.isFinite(i)?i:0)*p,M=Math.abs(_-f)/u,S=Math.abs(x-m)/h,w=mo(1-Math.max(M,S),0,1),E=Math.max(0,Math.abs(_-f)-u),T=Math.max(0,Math.abs(x-m)-h);return{comX:c,comY:l,comZ:d,xcomX:_,xcomZ:x,centerX:f,centerZ:m,halfX:u,halfZ:h,marginX:mo(1-M,-1,1),marginZ:mo(1-S,-1,1),score:w,leanDeg:Math.atan2(_-f,x-m)*180/Math.PI,side:M>.98?_>f?1:-1:0,overX:E,overZ:T,grounded:!0}}function x2(n,t,e){if(!Number.isFinite(n))return 0;if(!Number.isFinite(t)||!(e>0))return n;const i=n+t*e;return n!==0&&Math.sign(i)!==Math.sign(n)?0:Math.abs(i)>Math.abs(n)?i:n}function v2(n,t,e){const i=Math.max(0,n);if(!(e>0))return i;const a=mo(Number.isFinite(t)?t:0,0,2);return i*(1+e*a)}const Nh={arm:1,leg:1,torso:1,girthArm:1,girthLeg:1,girthTorso:1},y2=1e-6;function Qn(n,t,e){return n<t?t:n>e?e:n}function wl(n,t){const e=Math.max(.2,n);return Qn(Math.pow(e,-t),.5,2)}function M2(n,t){if(!t.enabled)return{...Nh};const e=Qn(n.swing,-1,1),i=Qn(n.charge,0,1),a=Qn(n.impact,0,1),s=Qn(n.speedRatio,0,1),o=Math.max(0,e),r=1-(1-o)*(1-o),c=1+(Math.max(1,t.swingArm)-1)*r,l=Math.max(0,-e),d=Qn(t.chargeArm,.6,1),u=1-(1-d)*l,h=1-(1-d)*i;let f=1;o>0?f=c:l>0?f=u:i>0&&(f=h);const m=1-Qn(t.impactSquash,0,.6)*a;f*=m;const v=Math.max(1,t.runLeg),p=(n.grounded?1+(v-1)*s:1)*(1-Qn(t.impactSquash,0,.6)*a*.6),_=Qn(t.torsoGain,0,1),x=1+(f-1)*_;return f=Qn(f,.6,1.6),{arm:f,leg:Qn(p,.6,1.4),torso:Qn(x,.7,1.4),girthArm:wl(f,t.volumeExp),girthLeg:wl(p,t.volumeExp),girthTorso:wl(x,t.volumeExp)}}function _2(n,t,e,i){const a=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),s=(o,r)=>o+(r-o)*a;return{arm:s(n.arm,t.arm),leg:s(n.leg,t.leg),torso:s(n.torso,t.torso),girthArm:s(n.girthArm,t.girthArm),girthLeg:s(n.girthLeg,t.girthLeg),girthTorso:s(n.girthTorso,t.girthTorso)}}function b2(n,t,e){const i=n*Math.exp(-Math.max(y2,e)*Math.max(0,t));return i<.001?0:Qn(i,0,1)}const op=[{yaw:.85,pitch:-.12,roll:-.14,pz:-.06,px:.045,ap:-1.2,ay:-.42,ar:.16,el:-.48,blade:.3},{yaw:-.95,pitch:.14,roll:.17,pz:.1,px:-.05,ap:-1.46,ay:-.6,ar:-.1,el:-.14,blade:-.05},{yaw:-.75,pitch:-.08,roll:.14,pz:-.04,px:-.04,ap:-1.28,ay:-.58,ar:-.12,el:-.5,blade:.3},{yaw:.92,pitch:.15,roll:-.18,pz:.1,px:.05,ap:-1.48,ay:-.4,ar:.12,el:-.13,blade:-.05},{yaw:.12,pitch:-.32,roll:-.05,pz:-.07,px:0,ap:-1.9,ay:-.3,ar:.16,el:-.55,blade:1.3},{yaw:0,pitch:.55,roll:.02,pz:.13,px:0,ap:.05,ay:-.2,ar:0,el:-.1,blade:-.55}];function Ps(n,t,e){return n<t?t:n>e?e:n}function Fe(n,t,e){return n+(t-n)*e}function S2(n){return n?typeof n=="string"?{clip:n}:n:null}function w2(){return{bodyYaw:0,bodyPitch:0,bodyRoll:0,pelvisX:0,pelvisZ:0,armPitch:0,armYaw:0,armRoll:0,elbow:0,bladePitch:0,armLPitch:0,armLYaw:0,armLRoll:0,elbowL:0,rootYaw:0,bladePitchOff:0,bladeTwist:0,bladeTwistOff:0,bladeYaw:0,bladeYawOff:0}}function E2(n,t){const e=n%3*2,i=op[e],a=op[e+1];return{...w2(),bodyYaw:Fe(i.yaw,a.yaw,t),bodyPitch:Fe(i.pitch,a.pitch,t),bodyRoll:Fe(i.roll,a.roll,t),pelvisX:Fe(i.px,a.px,t),pelvisZ:Fe(i.pz,a.pz,t),armPitch:Fe(i.ap,a.ap,t),armYaw:Fe(i.ay,a.ay,t),armRoll:Fe(i.ar,a.ar,t),elbow:Fe(i.el,a.el,t),bladePitch:Fe(i.blade,a.blade,t)}}function T2(n,t,e,i,a=0){var b,y,C;const s=((b=i.combo)==null?void 0:b[n])??[],o=Math.max(1,s.length),r=(((Math.round(t)||1)-1)%o+o)%o,c=S2(s[r]),l=c?((y=i.clips)==null?void 0:y[c.clip])??null:null,d=Ps(((C=i.weaponScale)==null?void 0:C[n])??1,0,2),u=Number.isFinite(i.bodyScale)?Math.max(0,i.bodyScale):1,h=c&&Number.isFinite(c.scale)?c.scale:d,f=h*u,m=Ps((e+1)/2,0,1),v=l&&l.keys.length>0?mv(l,m):E2(r,m),g=((c==null?void 0:c.lead)??(l==null?void 0:l.lead)??"R")==="L"?"L":"R",p=(l==null?void 0:l.kind)??["right-left","left-right","overhead"][r]??"custom",_=n==="dual-swords",x=l&&Ma(l,"bladeTwistOff")?v.bladeTwistOff:_?v.bladeTwist:0,M=l&&Ma(l,"bladeYawOff")?v.bladeYawOff:-v.bladeYaw,S={yaw:v.bodyYaw*f,rootYaw:v.rootYaw*f,spinYaw:gv(l,Ps(a,0,1)),pitch:v.bodyPitch*f,roll:v.bodyRoll*f,pelvisZ:v.pelvisZ*f,pelvisX:v.pelvisX*f,armR:null,armL:null,bladePitch:v.bladePitch,bladePitchOff:l&&Ma(l,"bladePitchOff")?v.bladePitchOff:null,bladeTwist:v.bladeTwist,bladeTwistOff:x,bladeYaw:v.bladeYaw,bladeYawOff:M,lead:g,kind:p,strike:m,blend:c&&Number.isFinite(c.blend)?c.blend:null},w={pitch:v.armPitch*h,yaw:v.armYaw*h,roll:v.armRoll*h,elbow:v.elbow*h},E=l?Ma(l,"armLPitch")||Ma(l,"armLYaw")||Ma(l,"armLRoll")||Ma(l,"elbowL"):!1,T=E?{pitch:v.armLPitch*h,yaw:v.armLYaw*h,roll:v.armLRoll*h,elbow:v.elbowL*h}:{pitch:w.pitch+(n==="greatsword"?.08:.1),yaw:w.yaw*.8,roll:n==="greatsword"?.4:-w.roll*.6,elbow:w.elbow};return g==="L"?(S.armL=w,S.armR=n==="greatsword"?null:T):(S.armR=w,(n==="greatsword"||n==="dual-swords"||E)&&(S.armL=T)),S}function A2(n,t,e){const i=Ps(e,0,1),a=(s,o)=>s?o?{pitch:Fe(s.pitch,o.pitch,i),yaw:Fe(s.yaw,o.yaw,i),roll:Fe(s.roll,o.roll,i),elbow:Fe(s.elbow,o.elbow,i)}:null:o;return{yaw:Fe(n.yaw,t.yaw,i),rootYaw:Fe(n.rootYaw,t.rootYaw,i),spinYaw:t.spinYaw,pitch:Fe(n.pitch,t.pitch,i),roll:Fe(n.roll,t.roll,i),pelvisZ:Fe(n.pelvisZ,t.pelvisZ,i),pelvisX:Fe(n.pelvisX,t.pelvisX,i),armR:a(n.armR,t.armR),armL:a(n.armL,t.armL),bladePitch:n.bladePitch===null||t.bladePitch===null?i<.5?n.bladePitch:t.bladePitch:Fe(n.bladePitch,t.bladePitch,i),bladePitchOff:n.bladePitchOff===null||t.bladePitchOff===null?i<.5?n.bladePitchOff:t.bladePitchOff:Fe(n.bladePitchOff,t.bladePitchOff,i),bladeTwist:Fe(n.bladeTwist,t.bladeTwist,i),bladeTwistOff:Fe(n.bladeTwistOff,t.bladeTwistOff,i),bladeYaw:Fe(n.bladeYaw,t.bladeYaw,i),bladeYawOff:Fe(n.bladeYawOff,t.bladeYawOff,i),lead:t.lead,kind:t.kind,strike:Fe(n.strike,t.strike,i),blend:t.blend??null}}function R2(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function rp(n,t){return!n||!t?n||t?.6:0:Math.abs(n.pitch-t.pitch)*1+Math.abs(n.yaw-t.yaw)*.8+Math.abs(n.roll-t.roll)*.6+Math.abs(n.elbow-t.elbow)*.8}function P2(n,t){const e=(a,s)=>Math.abs(R2(a-s));let i=0;return i+=e(n.yaw,t.yaw)*1,i+=e(n.rootYaw,t.rootYaw)*.7,i+=e(n.pitch,t.pitch)*.9,i+=e(n.roll,t.roll)*.9,i+=Math.abs(n.pelvisX-t.pelvisX)*2,i+=Math.abs(n.pelvisZ-t.pelvisZ)*2,i+=rp(n.armR,t.armR),i+=rp(n.armL,t.armL)*.8,i+=e(n.bladePitch??0,t.bladePitch??0)*1.1,i+=e(n.bladePitchOff??0,t.bladePitchOff??0)*.7,i+=e(n.bladeTwist,t.bladeTwist)*.5,i+=e(n.bladeYaw,t.bladeYaw)*.5,i}function C2(n,t,e,i,a){if(i!=null&&Number.isFinite(i)&&i>=0)return Math.max(.008,i);const s=Math.max(.008,e.segBlend??.1);if(!n)return s;const o=Math.max(.008,e.segBlendMin??.03),r=Math.max(o,Number.isFinite(a)?a:e.segBlendMax??.14),c=Math.max(.1,e.segBlendRef??6),l=Ps(P2(n,t)/c,0,1);return o+(r-o)*l}function cp(n){const t=Ps(n,0,1);return t*t*(3-2*t)}function Be(n,t,e,i){const a=new me(new ni(n,t,e),new Zi({color:i}));return a.castShadow=!0,a.receiveShadow=!0,a}function Ze(){return new _e}function Or(n,t,e){const i=Ze(),a=Be(t*.7,.12,t*.7,e.wood);a.position.y=.06,i.add(a);const s=Be(t*2.4,.045,t*.8,e.metal);s.position.y=.13,i.add(s);const o=Be(t*.38,n,t,e.blade);o.position.y=.13+n/2,i.add(o);const r=Be(t*.42,n*.96,t*.2,e.bladeEdge);r.position.set(0,.13+n/2,t*.5),i.add(r);const c=Be(t*.3,.09,t*.45,e.blade);return c.position.y=.13+n+.045,i.add(c),i}function L2(n){const t=Or(.72,.15,n),e=Be(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function D2(n){const t=Ze(),e=Be(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=Be(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function k2(n){const t=Ze(),e=Be(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=Be(.15,.15,.15,n.glow);i.position.y=.92;const a=i.material;return a.emissive=new te(n.glow),a.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function I2(n){const t=Ze();for(let i=0;i<5;i++){const a=(i-2)*.15,s=Be(.055,.16,.05,n.wood);s.position.set(.16-Math.abs(a)*.46,a,0),t.add(s)}const e=Be(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function z2(n){const t=Ze(),e=Be(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=Be(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function he(n,t,e){return n<t?t:n>e?e:n}const Bi=1e-6;function f0(n,t,e,i,a,s,o,r,c,l,d,u,h){const f=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},m=u??{enabled:!1,lag:.022,maxAngle:.62,rate:26,twistLag:.018,maxTwist:.45,runDrag:0},v=d??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},g=c.stretch??{enabled:!1,swingArm:1,chargeArm:1,runLeg:1,torsoGain:0,impactSquash:0,impactDecay:12,volumeExp:.5,smoothing:26},p=c.swing??{enabled:!1,bodyScale:1,shoulderLift:.045,shoulderPush:.035,shoulderIn:.03,segBlend:.1,weaponScale:{greatsword:1,"sword-shield":.62,"dual-swords":.55}},_=Ze(),x=Ze();x.name="pelvis",x.position.y=n.legLength,_.add(x);const M=Ze();M.name="lower";const S=Ze();S.name="upper",x.add(M),x.add(S);const w=n.headSize,E=n.legLength,T=n.armLength,b=n.limbThickness,y=n.bodyHeight,C=n.bodyWidth,I=c.spine,R=!!(I!=null&&I.enabled),U=R?he(I.chestPivot??.42,.15,.85)*y:0,L=Ze();L.name="chest",L.position.y=U,S.add(L);const k=R?L:S;let B,G=null,$=y,at=0;R?($=Math.max(.05,U),at=Math.max(.05,y-U),B=Be(C,$,.28,t.body),B.name="torsoLower",B.position.y=$/2,S.add(B),G=Be(C+.008,at,.288,t.body),G.name="torsoUpper",G.position.y=at/2,L.add(G)):(B=Be(C,y,.28,t.body),B.name="torso",B.position.y=y/2,S.add(B));const mt=Ze();mt.name="headPivot",mt.rotation.order="YXZ",mt.position.y=Math.min(i.headPivotHeight,y)-U,k.add(mt);const ft=Be(w,w,w,t.head);ft.position.y=w/2,mt.add(ft);const Dt=new Zi({color:"#1b2733"});for(const O of[-1,1]){const tt=new me(new ni(.06,.07,.02),Dt);tt.position.set(O*.09,w/2+.03,w/2+.011),mt.add(tt)}const j=O=>{const tt=Ze();tt.name=O<0?"hipL":"hipR",tt.rotation.order="ZYX",tt.position.set(O*(C/2-b/2),0,0),M.add(tt);const xt=Be(b,E/2,b,t.limb);xt.position.y=-E/4,tt.add(xt);const St=Ze();St.name="knee",St.position.y=-E/2,tt.add(St);const Kt=Be(b,E/2,b,t.limb);Kt.position.y=-E/4,St.add(Kt);const Jt=Be(b*1.15,.07,b*1.7,t.shoe);Jt.position.set(0,-E/2+.035,.045),St.add(Jt);const ae=new qe;ae.name="footTip",ae.position.y=-E/2,St.add(ae);const ve=Ze();return{root:tt,joint:St,hand:ve,wrist:ve,tip:ae,upperMesh:xt,lowerMesh:Kt,segLen:E/2}},F=O=>{const tt=Ze();tt.name=O<0?"shoulderL":"shoulderR",tt.rotation.order="YXZ",tt.position.set(O*(C/2+b/2),y-.04-U,0),k.add(tt);const xt=Be(b,T/2,b,t.limb);xt.position.y=-T/4,tt.add(xt);const St=Ze();St.name="elbow",St.position.y=-T/2,tt.add(St);const Kt=Be(b,T/2,b,t.limb);Kt.position.y=-T/4,St.add(Kt);const Jt=Ze();Jt.name=O<0?"handL":"handR",Jt.position.y=-T/2,St.add(Jt);const ae=Be(b*1.1,.09,b*1.1,t.head);ae.position.y=.045,Jt.add(ae);const ve=Ze();return ve.name=O<0?"wristL":"wristR",Jt.add(ve),{root:tt,joint:St,hand:Jt,wrist:ve,upperMesh:xt,lowerMesh:Kt,segLen:T/2}},Y=j(-1),J=j(1),K=F(-1),st=F(1),Tt=[Y,J].map(O=>({root:O.root,joint:O.joint,tip:O.tip,upperLen:E/2,lowerLen:E/2,bend:1})),Wt=Ze(),dt=Ze();Wt.name="mountR",dt.name="mountL";const X=Ze(),H=Ze();X.name="gripR",H.name="gripL",st.wrist.add(Wt),K.wrist.add(dt),Wt.add(X),dt.add(H);const kt=k2(t),Rt=I2(t),_t=z2(t),vt={"sword-shield":{right:Or(.42,.075,t),left:D2(t)},"dual-swords":{right:Or(.42,.075,t),left:Or(.42,.075,t)},greatsword:{right:L2(t),left:Be(.12,.2,.12,t.wood)},staff:{right:kt.g,left:Ze(),orb:kt.orb},bow:{right:_t,left:Rt.g,arrow:_t,drawString:Rt.drawString}};for(const O of Object.keys(vt))X.add(vt[O].right),H.add(vt[O].left),vt[O].right.visible=!1,vt[O].left.visible=!1;function gt(O,tt,xt){const St=new qe;St.name="bladeBase",St.position.y=tt,O.add(St);const Kt=new qe;Kt.name="bladeTip",Kt.position.y=xt,O.add(Kt)}gt(vt["sword-shield"].right,.44,.55),gt(vt["dual-swords"].right,.44,.55),gt(vt["dual-swords"].left,.44,.55),gt(vt.greatsword.right,.74,.88),gt(vt.staff.right,.78,.92);let Pt=null,D=null,A=1,q=0,ut=0,it=null,lt=0,Nt=0,Ct=0,wt=0,$t=0,yt=0,zt=h2(),Z={...vd},V=0,pt=0,Ht=0,Ot=0,Lt=0,N=-1,bt=-1,et=0,ht=0,It=0,At=0,jt=0,se=0,oe=0,ee=1,ye=0,we=0,Qe=0,ln=0,Pe=!1,Ee=0,mn=-1,In=0,tn=0,zn=0,gn=!1,hn=0,Ce=0,ci=0,Li=0,Tn="none",z=0,Q=1,ot=!1,ct=-1,P=!1,nt=0,rt=0,Mt=0,Et={...Nh},Ft=0,Bt=0,Gt={active:!1,dist:0,gy:0,pitch:0,joint:0,grip:1},ie=NaN,qt=0,re=0,Oe=0,de=NaN,Yt=NaN,xn=-1,ue=null,Ye=null,dn=0,Te=1,An=.1,xe=null,ce={lx:0,ly:0,lz:0,rx:0,ry:0,rz:0},be=null,Zt=null,Ut=null,Qt=null,Ue=null,an=null,xi="R",bn=0,Rn=0,Sn=0,wn=0,Gs=1,Yn=0,ga=null,Di=0,_d=0,mc=NaN,bd=NaN,Oo={speed:0,phase:0},xa=1,va=1,Xs={lp:0,lr:0,rp:0,rr:0},x0=0,gc=0,xc=!0,vc=0,Vs="none",Ya=0,$a=0,Za=0,Bo=.3,Sd=0;function v0(O){const tt=Math.PI/180,xt=s;let St=0,Kt=0,Jt=0,ae=0;O==="sword-shield"?(St=xt.swordPitchDeg*tt,Jt=xt.shieldPitchDeg*tt):O==="dual-swords"?(St=xt.swordPitchDeg*tt,Jt=xt.swordPitchDeg*tt):O==="greatsword"?(St=xt.greatswordPitchDeg*tt,Jt=xt.greatswordPitchDeg*tt):O==="staff"?St=xt.staffPitchDeg*tt:Jt=xt.bowPitchDeg*tt,Wt.rotation.set(St,0,Kt),dt.rotation.set(Jt,0,ae),Wt.position.x=O==="greatsword"?-Math.max(0,s.twoHandInsetX??0):0}function wd(O){if(O!==Pt){Pt=O;for(const tt of Object.keys(vt))vt[tt].right.visible=tt===O,vt[tt].left.visible=tt===O;v0(O),Rt.drawString.position.z=-.06,_t.position.z=0,kt.orb.scale.setScalar(1),S.rotation.y=0}}wd("sword-shield");const Ed=[];_.traverse(O=>{O instanceof me&&O.material instanceof Zi&&Ed.push(O.material)});const y0=new te(r.flashColor);function M0(O,tt){const xt=r0(O,tt,r);zt=xt,S.rotation.x+=xt.upperPitch,S.rotation.z+=xt.upperRoll,S.rotation.y+=xt.upperYaw;const St=he(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),Kt=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;S.position.x+=he(xt.upperShiftX*St,-Kt,Kt),S.position.z+=he(xt.upperShiftZ*St,-Kt,Kt),x.position.x+=xt.comX,x.position.z+=xt.comZ-xt.pelvisBack,x.position.y-=xt.drop;const Jt=xt.legacy?0:he(r.lowerScale,0,1);M.position.z+=xt.pelvisBack*(1-Jt),M.position.y+=xt.drop*(1-Jt),Y.joint.rotation.x+=xt.knee,J.joint.rotation.x+=xt.knee,Y.root.rotation.x-=xt.hip,J.root.rotation.x-=xt.hip,K.root.rotation.x+=xt.arm,st.root.rotation.x+=xt.arm*.8;for(const ae of Ed)ae.emissive.copy(y0).multiplyScalar(xt.flash)}function Ho(O){return O<.22?-1:O<.42?-1+(O-.22)/.2*2:O<.5?1:Math.max(0,1-(O-.5)/.5)}function _0(O){for(const tt of[K,st])tt.upperMesh.scale.set(O.girthArm,O.arm,O.girthArm),tt.upperMesh.position.y=-tt.segLen/2*O.arm,tt.joint.position.y=-tt.segLen*O.arm,tt.lowerMesh.scale.set(O.girthArm,O.arm,O.girthArm),tt.lowerMesh.position.y=-tt.segLen/2*O.arm,tt.hand.position.y=-tt.segLen*O.arm;for(const tt of[Y,J])tt.upperMesh.scale.set(O.girthLeg,O.leg,O.girthLeg),tt.upperMesh.position.y=-tt.segLen/2*O.leg,tt.joint.position.y=-tt.segLen*O.leg,tt.lowerMesh.scale.set(O.girthLeg,O.leg,O.girthLeg),tt.lowerMesh.position.y=-tt.segLen/2*O.leg,tt.tip.position.y=-tt.segLen*O.leg;B.scale.set(O.girthTorso,O.torso,O.girthTorso),B.position.y=$/2*O.torso,G&&(G.scale.set(O.girthTorso,O.torso,O.girthTorso),G.position.y=at/2*O.torso,L.position.y=$*O.torso)}function b0(O,tt){const xt=s.twoHandGripY??-.16,St=Math.max(1,s.twoHandMaxStretch??1.25),Kt=T*St*.99,Jt=K.root.position.x,ae=K.root.position.y,ve=K.root.position.z,He=K.root.rotation.y,fe=Math.cos(He),sn=Math.sin(He),$e=ki=>{const $s=Wt.localToWorld(new W(0,ki,0)),Zs=(R?L:S).worldToLocal($s),js=Zs.x-Jt,Gn=Zs.y-ae,ja=Zs.z-ve,qa={x:js*fe-ja*sn,y:Gn,z:js*sn+ja*fe};return{t:qa,dist:Math.hypot(qa.x,qa.y,qa.z)}};let Ge=xt,Me=$e(Ge);if(!Number.isFinite(Me.dist)||Me.dist<=Bi)return;for(let ki=0;ki<18&&Me.dist>Kt;ki++)if(Ge*=.78,Me=$e(Ge),!Number.isFinite(Me.dist)||Me.dist<=Bi)return;Number.isFinite(ie)||(ie=Ge);const en=Math.max(0,s.twoHandSlideRate??9);ie+=(Ge-ie)*(1-Math.exp(-en*tt));const on=$e(ie),un=on.t,$n=on.dist,Zn=$n/Math.max(Bi,T),ii=he(Zn,1,St),vi=Math.max(1,s.twoHandGripStart??1.02),ji=Math.max(vi+.001,St),qi=he(s.twoHandMinGrip??1,0,1),jn=he((Zn-vi)/(ji-vi),0,1),yi=1-jn*jn*(3-2*jn)*(1-qi),qn=T/2*ii,Ys=l0(un,qn,qn,-1),Ki=h0({rootPitch:K.root.rotation.x,rootRoll:K.root.rotation.z,jointPitch:K.joint.rotation.x},Ys,he(O*yi,0,1),Math.PI);K.root.rotation.x=Ki.rootPitch,K.root.rotation.z=Ki.rootRoll,K.joint.rotation.x=Math.min(Ki.jointPitch,-.06);const ai=1/Math.sqrt(ii);K.upperMesh.scale.set(ai,ii,ai),K.upperMesh.position.y=-qn/2,K.joint.position.y=-qn,K.lowerMesh.scale.set(ai,ii,ai),K.lowerMesh.position.y=-qn/2,K.hand.position.y=-qn,Gt={active:!0,dist:$n,gy:ie,pitch:Ki.rootPitch,joint:K.joint.rotation.x,grip:yi}}function S0(O,tt){if(!m.enabled){qt=0,re=0,st.wrist.rotation.set(0,0,0),de=st.root.rotation.x,Yt=Cd();return}const xt=st.root.rotation.x,St=Cd();if(tt!==xn){xn=tt,de=xt,Yt=St,st.wrist.rotation.set(qt,0,re);return}if(!Number.isFinite(de)||O<=1e-5){de=xt,Yt=St,st.wrist.rotation.set(qt,0,re);return}const Kt=(xt-de)/O,Jt=Ne(St-Yt)/O;de=xt,Yt=St;const ae=Math.max(0,m.maxAngle),ve=Math.max(0,m.maxTwist),He=.15+.85*he(Rn,0,1),sn=-he(Oe,0,1.4)*Math.max(0,m.runDrag),$e=he(-Kt*m.lag*He+sn,-ae,ae),Ge=he(Jt*m.twistLag*He,-ve,ve),Me=1-Math.exp(-Math.max(0,m.rate)*O);qt+=($e-qt)*Me,re+=(Ge-re)*Me,st.wrist.rotation.set(qt,0,re)}function w0(O){const tt=Math.PI/180;return O==="greatsword"?s.greatswordPitchDeg*tt:O==="staff"?s.staffPitchDeg*tt:O==="bow"?s.bowPitchDeg*tt:s.swordPitchDeg*tt}function yc(O){const tt=Math.PI/180;return O==="sword-shield"?s.shieldPitchDeg*tt:O==="greatsword"?s.greatswordPitchDeg*tt:O==="bow"?s.bowPitchDeg*tt:s.swordPitchDeg*tt}function E0(O){const tt=Math.PI/180;return O==="sword-shield"||O==="dual-swords"?(s.swordCantDeg??0)*tt:O==="greatsword"?(s.greatswordCantDeg??0)*tt:0}function T0(O,tt){const xt=O.weapon;if(xt==="staff"||xt==="bow")return;const St=xi==="R",Kt=St?st:K,Jt=St?Wt:dt,ae=St?K:st,ve=St?dt:Wt,He=xt==="greatsword"&&St?yt:0,fe=xt==="greatsword"?s.greatswordYawDeg:s.swordYawDeg,sn=Math.PI/180,$e=-fe*sn,Ge=fe*sn,Me=(jn,yi)=>{const qn=Math.max(0,Math.PI/2-Math.abs(yi));return Math.sign(jn)*Math.min(Math.abs(jn),qn)},en=(be??w0(xt)+q)+He,on=tt+Kt.root.rotation.x+Kt.joint.rotation.x;Jt.rotation.set(Math.PI/2-en-on,0,Me(St?$e:Ge,en));const un=Zt??(xt==="sword-shield"?null:yc(xt)+ut),$n=tt+ae.root.rotation.x+ae.joint.rotation.x;xt==="sword-shield"?ve.rotation.x=un===null?yc(xt):yc(xt)-un-$n:ve.rotation.set(Math.PI/2-(un??0)-$n,0,Me(St?Ge:$e,un??0));const Zn=E0(xt),ii=Ue??0,vi=an??0,ji=Ut??0,qi=Qt??0;St?(X.rotation.z=-Zn+ii,X.rotation.y=ji,H.rotation.z=Zn+vi,H.rotation.y=qi):(H.rotation.z=Zn+ii,H.rotation.y=ji,X.rotation.z=-Zn+vi,X.rotation.y=qi)}function Td(O){be=O.bladePitch,Zt=O.bladePitchOff,Ut=O.bladeTwist,Qt=O.bladeTwistOff,Ue=O.bladeYaw,an=O.bladeYawOff,xi=O.lead,bn=O.rootYaw+O.spinYaw,_.rotation.y=bn,S.rotation.y+=O.yaw,S.rotation.x+=O.pitch,S.rotation.z+=O.roll,x.position.z+=O.pelvisZ,x.position.x+=O.pelvisX,O.armR&&(st.root.rotation.x=O.armR.pitch,st.root.rotation.y=O.armR.yaw,st.root.rotation.z=O.armR.roll,st.joint.rotation.x=O.armR.elbow),O.armL&&(K.root.rotation.x=O.armL.pitch,K.root.rotation.y=O.armL.yaw,K.root.rotation.z=O.armL.roll,K.joint.rotation.x=O.armL.elbow)}function Ad(O,tt){const xt=xe??Ho(O.attackProgress),St=T2(O.weapon,O.comboIndex,xt,p,O.attackProgress);if(O.comboIndex!==dn){Ye=ue,Te=0,dn=O.comboIndex;const ae=O.timings.windup+O.timings.active+O.timings.recovery,ve=Math.max(p.segBlendMin??.03,ae*.22);An=C2(Ye,St,p,St.blend??null,ve)}const Kt=Math.max(.008,An);Te=Math.min(1,Te+tt/Kt);const Jt=Ye&&Te<1?A2(Ye,St,cp(Te)):St;return ue=Jt,Jt}function A0(O,tt){const xt=C/2+b/2,St=y-.04-U;if(!p.enabled){K.root.position.set(-xt,St,0),st.root.position.set(xt,St,0),ce={lx:-xt,ly:St,lz:0,rx:xt,ry:St,rz:0};return}const Kt=Math.max(0,p.shoulderLift),Jt=Math.max(0,p.shoulderPush),ae=O&&tt==="greatsword"?Math.max(0,p.shoulderIn):0,ve=on=>Kt*he((-on-.5)/1.45,0,1),He=on=>Jt*he((-on-.2)/1.9,0,1),fe=-xt+ae,sn=St+ve(K.root.rotation.x),$e=He(K.root.rotation.x),Ge=xt-ae,Me=St+ve(st.root.rotation.x),en=He(st.root.rotation.x);K.root.position.set(fe,sn,$e),st.root.position.set(Ge,Me,en),ce={lx:fe,ly:sn,lz:$e,rx:Ge,ry:Me,rz:en}}function R0(O,tt,xt){if(O.phase==="idle"||O.charging){In=0,tn=0,zn=0;return}const St=O.attackProgress,Kt=Ho(St),Jt=Math.max(0,Kt),ae=c.stride,ve=Number.isFinite(ae.stepReach)?ae.stepReach:.17,He=Number.isFinite(ae.stepSideReach)?ae.stepSideReach:.14,fe=Number.isFinite(ae.stepDipReach)?ae.stepDipReach:.05,sn=O.weapon==="greatsword"?he(Number.isFinite(ae.heavyScale)?ae.heavyScale:1,0,1):1,$e=1-Math.exp(-12*Math.max(0,xt));In+=(ve*Jt*sn-In)*$e,tn+=(tt*He*Jt*sn-tn)*$e,zn+=(fe*Math.sin(Math.PI*St)*sn-zn)*$e,x.position.z+=In,x.position.x+=tn,x.position.y-=zn}let Rd=null;function P0(){Rd={upperX:S.rotation.x,upperY:S.rotation.y,upperZ:S.rotation.z,upperPX:S.position.x,upperPZ:S.position.z,pelvisX:x.position.x,pelvisY:x.position.y,pelvisZ:x.position.z,pelvisRX:x.rotation.x,pelvisRZ:x.rotation.z,lrx:K.root.rotation.x,lry:K.root.rotation.y,lrz:K.root.rotation.z,lj:K.joint.rotation.x,rrx:st.root.rotation.x,rry:st.root.rotation.y,rrz:st.root.rotation.z,rj:st.joint.rotation.x,rootY:_.rotation.y}}function C0(O){const tt=Rd;if(!tt)return;const xt=cp(he(O,0,1));if(xt>=1)return;const St=(Kt,Jt)=>Kt+(Jt-Kt)*xt;S.rotation.x=St(tt.upperX,S.rotation.x),S.rotation.y=St(tt.upperY,S.rotation.y),S.rotation.z=St(tt.upperZ,S.rotation.z),S.position.x=St(tt.upperPX,S.position.x),S.position.z=St(tt.upperPZ,S.position.z),x.position.x=St(tt.pelvisX,x.position.x),x.position.y=St(tt.pelvisY,x.position.y),x.position.z=St(tt.pelvisZ,x.position.z),x.rotation.x=St(tt.pelvisRX,x.rotation.x),x.rotation.z=St(tt.pelvisRZ,x.rotation.z),K.root.rotation.x=St(tt.lrx,K.root.rotation.x),K.root.rotation.y=St(tt.lry,K.root.rotation.y),K.root.rotation.z=St(tt.lrz,K.root.rotation.z),K.joint.rotation.x=St(tt.lj,K.joint.rotation.x),st.root.rotation.x=St(tt.rrx,st.root.rotation.x),st.root.rotation.y=St(tt.rry,st.root.rotation.y),st.root.rotation.z=St(tt.rrz,st.root.rotation.z),st.joint.rotation.x=St(tt.rj,st.joint.rotation.x),_.rotation.y=tt.rootY+Ne(_.rotation.y-tt.rootY)*xt,bn=_.rotation.y}let Ws=null,Mc=0,Pd=0;function L0(){if(!R)return;const O=I,tt=Math.max(0,O.waist??1),xt=Math.max(0,O.chest??0),St=tt+xt,Kt=St>1e-6?tt/St:1,Jt=St>1e-6?xt/St:0,ae=S.rotation.x,ve=S.rotation.y,He=S.rotation.z;S.rotation.set(ae*Kt,ve*Kt,He*Kt),L.rotation.set(ae*Jt,ve*Jt,He*Jt);const fe=he(O.neck??0,0,1);fe>0&&(mt.rotation.x-=ae*fe),Ws={x:ae,y:ve,z:He}}function Go(){return{yaw:S.rotation.y+(R?L.rotation.y:0),pitch:S.rotation.x+(R?L.rotation.x:0),lean:S.rotation.z+(R?L.rotation.z:0)}}function Cd(){return Go().yaw}function D0(O,tt){if(!(h!=null&&h.enabled)){ga=null,Di=0;return}_.updateWorldMatrix(!0,!0);const xt=new W,St=[],Kt=(ai,ki,$s=0)=>{ai.getWorldPosition(xt),St.push({x:xt.x,y:xt.y+$s,z:xt.z,mass:ki})},Jt=n.headSize;Kt(mt,.08,Jt/2),Kt(B,.14),Kt(G??L,.24),Kt(x,.12),Kt(K.hand,.05),Kt(st.hand,.05),Kt(Y.joint,.15),Kt(J.joint,.15);const ae=Pt?Xo(vt[Pt].right):null;ae&&St.push({x:(ae.base.x+ae.tip.x)/2,y:(ae.base.y+ae.tip.y)/2,z:(ae.base.z+ae.tip.z)/2,mass:Pt==="greatsword"?.09:.04});const ve=Math.max(.05,n.limbThickness*1.15/2+.015),He=Math.max(.06,n.limbThickness*1.7/2+.02);let fe=1/0,sn=-1/0,$e=1/0,Ge=-1/0,Me=0;for(const ai of[Y,J])ai.tip.getWorldPosition(xt),xt.y<=.13&&(Me+=1),fe=Math.min(fe,xt.x-ve),sn=Math.max(sn,xt.x+ve),$e=Math.min($e,xt.z-He),Ge=Math.max(Ge,xt.z+He);(!Number.isFinite(fe)||Me===0)&&(fe=sn=$e=Ge=0);let en=0,on=0;Number.isFinite(mc)&&tt>1e-5&&(en=he((O.position.x-mc)/tt,-20,20),on=he((O.position.z-bd)/tt,-20,20)),mc=O.position.x,bd=O.position.z;const un=g2(St,{minX:fe,maxX:sn,minZ:$e,maxZ:Ge},en,on,h);if(ga=un,!h.autoCounter){Di=0;return}const $n=Math.cos(O.bodyYaw),Zn=-Math.sin(O.bodyYaw),ii=un.xcomX-un.centerX,vi=un.xcomZ-un.centerZ,ji=ii*$n+vi*Zn,qi=en*$n+on*Zn,jn=un.grounded?x2(ji,qi,h.predLead??0):0;Pd=jn;const yi=Math.abs(jn)-.45*un.halfX;_d=yi;let qn=0;yi>.002&&un.grounded&&(qn=-Math.sign(jn)*Math.min(Math.max(.005,h.maxShift??.045),(yi+.002)*1.1666666666666667));const Ys=Math.abs(jn)/Math.max(1e-4,un.halfX),Ki=Math.max(.1,v2(h.counterRate,Ys,h.counterBoost??0));Di+=(qn-Di)*(1-Math.exp(-Ki*tt))}function k0(O,tt){if(Rt.drawString.position.z=-.06,_t.position.z=0,kt.orb.scale.setScalar(1),S.rotation.y=0,O.charging&&O.weapon==="bow"){const Jt=O.charge;K.root.rotation.x=-1.25,K.joint.rotation.x=-.15,st.root.rotation.x=.35+Jt*.3,st.joint.rotation.x=-1.15,Rt.drawString.position.z=-.06-Jt*.22,_t.position.z=-Jt*.3,S.rotation.y=-.22;return}if(O.phase==="idle"&&Sn<=.001){Ye=null,ue=null,dn=0,Te=1,An=Math.max(.008,p.segBlend),be=null,Zt=null,Ut=null,Qt=null,Ue=null,an=null,ie=NaN,O.weapon==="greatsword"&&(Wt.position.x=-Math.max(0,s.twoHandInsetX??0));return}const xt=Ho(O.attackProgress),St=Math.max(0,-xt),Kt=Math.max(0,xt);if(O.weapon==="bow")K.root.rotation.x=-1.2,K.joint.rotation.x=-.15,st.root.rotation.x=.9-Kt*.8,st.joint.rotation.x=-.3;else if(O.weapon==="greatsword")if(p.enabled)Td(Ad(O,tt));else{const Jt=-1.6*St+1.25*Kt,ae=he(Number.isFinite(c.stride.heavyScale)?c.stride.heavyScale:1,0,1);st.root.rotation.x=Jt,st.joint.rotation.x=-(.25+St*.4),K.root.rotation.x=Jt+.06,K.joint.rotation.x=-(.32+St*.4),K.root.rotation.z=.42,st.root.rotation.z=0;const ve=-Math.sin(st.root.rotation.x);st.root.rotation.y=-.72*Math.tanh(ve*4),S.rotation.y=-.2*xt*ae}else if(p.enabled)Td(Ad(O,tt));else{const Jt=O.comboIndex;if(Jt===1)st.root.rotation.x=-1.7*St+1.1*Kt,st.joint.rotation.x=-(.2+St*.5),K.root.rotation.x=.1,S.rotation.y=-.18*xt;else if(Jt===2)K.root.rotation.x=-1.5*St+1*Kt,K.joint.rotation.x=-(.2+St*.5),st.root.rotation.x=.2,S.rotation.y=.45*-xt;else{const ae=-1.9*St+1.2*Kt;K.root.rotation.x=ae,st.root.rotation.x=ae,K.joint.rotation.x=-(.15+St*.4),st.joint.rotation.x=-(.15+St*.4),S.rotation.y=-.3*xt}}if(O.weapon==="greatsword"){const Jt=he((-st.root.rotation.x-1.3)/1.2,0,1);Wt.position.x=-Math.max(0,s.twoHandInsetX??0)*(1-Jt)}R0(O,Ee%2===0?1:-1,tt)}function I0(O,tt){O&&(st.root.rotation.x=-1.05,st.joint.rotation.x=-.35,K.root.rotation.x=-.45,K.joint.rotation.x=-.2,S.rotation.y=-.12,kt.orb.scale.setScalar(1.25+.12*Math.sin(tt*2)))}function z0(O){if(!O||O.phase==="idle")return;const tt=O.progress,xt=tt<.3?-.35+tt/.3*1.35:tt<.7?1:Math.max(0,1-(tt-.7)/.3),St=Math.PI/180;S.rotation.x+=v.leanDeg*St*xt,K.root.rotation.x-=v.shieldPitchDeg*St*xt,K.joint.rotation.x-=.22*xt,st.root.rotation.x-=.3*xt,x.position.z+=v.pelvisReach*Math.max(0,xt)}function Xo(O){if(!O)return null;const tt=O.getObjectByName("bladeBase"),xt=O.getObjectByName("bladeTip");if(!tt||!xt)return null;O.updateWorldMatrix(!0,!1);const St=tt.getWorldPosition(new W),Kt=xt.getWorldPosition(new W),Jt=new W().setFromMatrixColumn(O.matrixWorld,0).normalize();return{base:{x:St.x,y:St.y,z:St.z},tip:{x:Kt.x,y:Kt.y,z:Kt.z},normal:{x:Jt.x,y:Jt.y,z:Jt.z}}}return{group:_,update(O,tt,xt,St,Kt=!1,Jt,ae,ve){var Wd;wd(tt.weapon);const He=Jt===void 0||N<0?St:he(Jt-N,0,.1);Jt!==void 0&&(N=Jt),_.rotation.y=0,bn=0,S.rotation.x=0,S.rotation.z=0,x.position.x=0,x.position.y=E,x.position.z=0,x.rotation.z=0,x.rotation.x=0,S.position.x=0,S.position.y=0,S.position.z=0,L.rotation.set(0,0,0),M.position.x=0,M.position.y=0,M.position.z=0,M.rotation.z=0;const fe=Math.max(1/240,Math.min(St,.1));it=((Wd=c.stance)==null?void 0:Wd[tt.weapon])??null,D!==tt.weapon&&(D=tt.weapon,A=it?0:1);const sn=Math.max(.01,(it==null?void 0:it.blend)??.22);A=Math.min(1,A+fe/sn);const $e=it?A:0;q=((it==null?void 0:it.bladePitchDeg)??0)*Math.PI/180*$e,ut=((it==null?void 0:it.bladePitchOffDeg)??0)*Math.PI/180*$e;const Ge=Jt===void 0?x0+=St:Jt;gc=Ge;const Me=c.landing;Me.enabled?xc&&!O.grounded?(Vs="jump",Ya=Ge,$a=Me.anticipationDuration,Za=Math.max(0,Me.jumpAnticipation),Bo=.32):!xc&&O.grounded&&(Vs="land",Ya=Ge,$a=Me.duration,Za=l2(vc,Me),Bo=Me.compressRatio,Sd=vc):(Vs="none",Za=0),Ge<Ya&&(Vs="none",Za=0),xc=O.grounded,vc=O.velocity.y;const en=sp(Ge,Ya,$a,Za,Bo),on=tt.phase!=="idle",un=(ve==null?void 0:ve.phase)==="active";Rn=s2(Rn,on,fe,c.attack.blendRate);const $n=o2(Rn,c.attack.gaitWeight,c.attack.lowerBodyWeight);wn=$n.attackLegWeight,Gs=$n.gaitScale;const Zn=Math.sin(O.bodyYaw),ii=Math.cos(O.bodyYaw),vi=(O.velocity.x-lt)/fe,ji=(O.velocity.z-Nt)/fe,qi=he(vi,-60,60),jn=he(ji,-60,60),yi=qi*Zn+jn*ii,qn=Ne(O.bodyYaw-Ct)/fe,Ys=He>1e-6?Ne(O.bodyYaw-Ct)/He:0,Ki=Math.hypot(O.velocity.x,O.velocity.z),ai=o.maxForwardDeg*Math.PI/180,ki=o.maxSideDeg*Math.PI/180,$s=he(yi*o.accelGain,-ai,ai),Zs=he(-qn*Ki*o.turnGain,-ki,ki),js=1-Math.exp(-o.smoothing*fe);wt+=($s-wt)*js,$t+=(Zs-$t)*js,lt=O.velocity.x,Nt=O.velocity.z,Ct=O.bodyYaw;const Gn=Math.hypot(O.velocity.x,O.velocity.z),ja=he(a.knockGaitScale??0,0,1),qa=xt.knockX*ja,F0=xt.knockZ*ja,U0=ja>0&&Math.hypot(xt.knockX,xt.knockZ)>.001,_c=O.velocity.x+qa,bc=O.velocity.z+F0,Ld=Math.hypot(_c,bc);Li=Ld;const N0=Math.cos(O.bodyYaw),O0=-Math.sin(O.bodyYaw),B0=O.velocity.x*N0+O.velocity.z*O0,Dd=Gn>Bi?he(B0/Gn,-1,1):0,kd=Gn>Bi?he((O.velocity.x*Zn+O.velocity.z*ii)/Gn,-1,1):1,H0=xd(kd,a.backStrafeStartDeg,a.backStrafeFullDeg);Tn==="settled"&&P&&nt>rt*1.02+1e-4&&(Tn="none");let qs=1;Tn==="blend"?(qs=i0(ot?ct:z,a.stopYawBlendMode,ot),ot||(z=Math.min(1,z+fe/Math.max(.01,a.stopYawAfterSec)),(z>=1||a.stopYawBlendMode==="inStop"||P)&&(Tn="settled",qs=0))):Tn==="settled"&&(qs=he(Gn/Math.max(Bi,a.stopEnterRatio*e),0,1)),Q=qs;const G0=qm(Dd,i.legYawScale,i.hipYawMaxDeg,a.strafeHipBoost),Id=(a.hipYawTrackRateDeg??0)*Math.PI/180,X0=(a.hipYawBackRateDeg??0)*Math.PI/180,Sc=He>1e-6?He:St;Lt=Id>0?Ym(Lt,Wm(Ys),Sc):0;const zd=Km(H0,Lt),V0=he(Gn/.5,0,1),W0=Qm(kd,Dd,G0,zd)*qs*V0,Fd=$m(Ot,W0,Jm(Id,X0,zd),Sc,Lt);Ot=Fd,pt+=(Fd-pt)*(1-Math.exp(-i.hipYawSmoothing*Sc));const Ks=O.bodyYaw+pt;Ht=Ks;const Y0=Math.sin(Ks),$0=Math.cos(Ks),Z0=Math.cos(Ks),j0=-Math.sin(Ks),si={speed:Ld,phase:O.gaitPhase,localForward:_c*Y0+bc*$0,localRight:_c*Z0+bc*j0,stride:O.stride};if(on&&tt.attackId!==mn){const ne=!gn;mn=tt.attackId,Ee+=1,Qe=ne&&(!Pe||si.speed>.05)?si.phase:ln,Pe=!0}gn=on;const li=Rn>0?i2(si,tt.attackProgress,Ee,Rn,c.stride,Qe):si;Oo=li,on&&(ln=li.phase);const wc=Math.max(0,a.dirFlipSec??0);wc>0?(xa=nc(xa,li.localForward>=0?1:-1,fe,wc),va=nc(va,li.localRight>=0?1:-1,fe,wc)):(xa=li.localForward>=0?1:-1,va=li.localRight>=0?1:-1);const Ud=Math.max(0,a.stopBlendSec||0),Nd=Ud>0&&!on&&!U0&&O.grounded,Ec=t0(Gn,ye,e,a.stopEnterRatio,a.stopExitRatio);if(!Nd||Ec.resume)bt=-1;else if(bt<0&&Ec.enter){bt=0,et=O.gaitPhase,ht=Zm(O.gaitPhase),It=Gn,At=Math.max(O.stride,Bi),jt=si.localForward,se=si.localRight;const ne=1/Math.max(Bi,Gn);oe=O.velocity.x*ne,ee=O.velocity.z*ne}const q0=ye;ye=Gn;const Mi=Nd&&bt>=0;Mi&&(bt=Math.min(1,bt+fe/Ud)),Mi&&Tn!=="blend"&&(Tn="blend",z=0),ot=Mi&&bt<1,ct=bt,P=Ec.resume,nt=Gn,rt=q0;const Od=Mi?{phase:et,speed:It,moveSpeed:e,localForward:jt,localRight:se,dirF:xa,dirR:va,legLength:n.legLength,stride:At,grounded:!0}:{phase:li.phase,speed:li.speed,moveSpeed:e,localForward:li.localForward,localRight:li.localRight,dirF:xa,dirR:va,legLength:n.legLength,stride:li.stride??0,grounded:O.grounded};let Tc=Mi?jm(Od,a,{progress:bt,phase0:et,phaseEnd:ht}):ic(Od,a);const ya=c.attack.moveTakeover;if(ya&&!Mi){const ne=tt.phase==="windup"?ya.windup:tt.phase==="recovery"?ya.recovery:tt.phase==="settle"?ya.settle:0,le=Math.max(.05,ya.full-ya.speed),Pn=he((si.speed-ya.speed)/le,0,1),Fn=he(ne,0,1)*Pn,Vo=Fn>Yn?10:6;Yn=he(Yn+(Fn-Yn)*(1-Math.exp(-Vo*fe)),0,1)}else Mi?Yn=0:Yn=he(Yn*Math.exp(-8*fe),0,1);if(Yn>.001&&!Mi){const ne=ic({phase:si.phase,speed:si.speed,moveSpeed:e,localForward:si.localForward,localRight:si.localRight,dirF:xa,dirR:va,legLength:n.legLength,stride:si.stride??0,grounded:O.grounded},a);Tc=r2(Tc,ne,Yn)}const Le=c2(Tc,$n.gaitScale);if(Mt=0,un&&ve){const ne=t2(ve.progress,ve.dir,a),le=$n.gaitScale;Le.legL.pitchX+=ne.legL.pitchX*le,Le.legL.rollZ+=ne.legL.rollZ*le,Le.legL.kneeX+=ne.legL.kneeX*le,Le.legR.pitchX+=ne.legR.pitchX*le,Le.legR.rollZ+=ne.legR.rollZ*le,Le.legR.kneeX+=ne.legR.kneeX*le,Le.pelvisY+=ne.pelvisY*le,Mt=ne.env}let Ac=0,Rc=0,Pc=0,Bd=0;if(Mi){const ne=n0(O.bodyYaw,oe,ee),le=a0(bt,et,ne.forward,ne.right,a);le.leadLeft?(Le.legL.pitchX-=le.leadPitch,Le.legL.kneeX+=le.leadKnee,Le.legR.pitchX+=le.trailPitch):(Le.legR.pitchX-=le.leadPitch,Le.legR.kneeX+=le.leadKnee,Le.legL.pitchX+=le.trailPitch),Rc=le.bodyShift*le.fwdN,Ac=le.bodyShift*le.rightN,Pc=le.bodyDip,Bd=le.chestPitch,hn=le.leadPitch,Ce=le.bodyShift,ci=le.bodyDip}else hn=0,Ce=0,ci=0;if(Xs={lp:Le.legL.pitchX,lr:Le.legL.rollZ,rp:Le.legR.pitchX,rr:Le.legR.rollZ},!O.grounded)Y.root.rotation.x=-.55,J.root.rotation.x=-.25,Y.joint.rotation.x=.75,J.joint.rotation.x=.55,K.root.rotation.x=-.9,st.root.rotation.x=-.7,K.joint.rotation.x=-.6,st.joint.rotation.x=-.6,Y.root.rotation.z=0,J.root.rotation.z=0;else{Y.root.rotation.x=Le.legL.pitchX,J.root.rotation.x=Le.legR.pitchX,Y.root.rotation.z=Le.legL.rollZ,J.root.rotation.z=Le.legR.rollZ,Y.joint.rotation.x=Le.legL.kneeX,J.joint.rotation.x=Le.legR.kneeX;const ne=it?A:0,le=1+(((it==null?void 0:it.armSwing)??1)-1)*ne,Pn=it==null?void 0:it.armR,Fn=it==null?void 0:it.armL,Vo=Le.armL*le+((Fn==null?void 0:Fn.pitch)??0)*ne,Yd=Le.armR*le+((Pn==null?void 0:Pn.pitch)??0)*ne;K.root.rotation.x=Vo,st.root.rotation.x=Yd,K.joint.rotation.x=-(.18+Vo*.2)+((Fn==null?void 0:Fn.elbow)??0)*ne,st.joint.rotation.x=-(.18+Yd*.2)+((Pn==null?void 0:Pn.elbow)??0)*ne,K.root.rotation.z=((Fn==null?void 0:Fn.roll)??0)*ne,st.root.rotation.z=((Pn==null?void 0:Pn.roll)??0)*ne,K.root.rotation.y=((Fn==null?void 0:Fn.yaw)??0)*ne,st.root.rotation.y=((Pn==null?void 0:Pn.yaw)??0)*ne,x.position.x=Le.pelvisX,x.position.y=E+Le.pelvisY,x.position.z=0,x.rotation.z=Le.pelvisRoll}const K0=d0(x,M),Js=un?{...f,weight:0}:Mi&&f.enabled?{...f,weight:1}:f,Hd=Js.enabled&&O.grounded&&Js.weight>0?he(Js.weight,0,1)*(on?he(Js.attackScale,0,1):1):0;x.position.x+=Ac,x.position.z+=Rc,x.position.y-=Pc,M.position.y+=Pc,Hd<=0&&(M.position.x-=Ac,M.position.z-=Rc);const Cc=Gn/Math.max(e,Bi);Oe=Cc;const J0=Number.isFinite(o.crouchSmoothing)?o.crouchSmoothing:8,Q0=1-Math.exp(-Math.max(0,J0)*fe);V+=(he(Cc,0,1)-V)*Q0;const Ka=c0({leanForward:wt,leanSide:$t,speedRatio:V},o);x.rotation.x+=Ka.pelvisPitch,x.rotation.z+=Ka.pelvisRoll,x.position.x+=Ka.pelvisX,x.position.z+=Ka.pelvisZ,x.position.y-=Ka.crouch,M.position.y+=Ka.crouch*(1-he(Hd,0,1));const Gd=tt.phase!=="idle"||tt.charging&&tt.weapon==="bow",Lc=Gd?1:0,tg=Math.max(.001,Lc>Sn?p.poseIn??.1:p.poseOut??.16);if(Sn!==Lc){const ne=fe/tg;Sn=he(Sn+(Lc>Sn?ne:-ne),0,1)}if((Sn>0||Gd)&&P0(),k0(tt,fe),Sn>0&&Sn<1&&C0(Sn),it){const ne=(1-Sn)*A;S.rotation.y+=(it.torsoYaw??0)*ne,S.rotation.x+=(it.torsoPitch??0)*ne}I0(Kt,O.gaitPhase),z0(ae);const eg=tt.weapon==="greatsword",Xd=Math.hypot(O.velocity.x,O.velocity.z),ng=eg&&tt.phase==="idle"&&Xd>.5?Math.min(1.15,Xd/Math.max(e,.001)*.9):0;yt+=(ng-yt)*(1-Math.exp(-6*fe));const ig=S.rotation.x;tt.weapon==="bow"&&(Rt.g.rotation.x=-(K.root.rotation.x+K.joint.rotation.x),_t.rotation.x=-(st.root.rotation.x+st.joint.rotation.x));const ag=S.rotation.y;M0(xt,O.bodyYaw);const Vd=xt.type==="none"?1:.4;if(S.rotation.x+=wt*Vd+Bd,S.rotation.z+=($t+Le.sideLean)*Vd,en>0&&(Y.root.rotation.x-=Me.hipPitch*en,J.root.rotation.x-=Me.hipPitch*en,Y.joint.rotation.x+=Me.kneeBend*en,J.joint.rotation.x+=Me.kneeBend*en,x.position.y-=Me.crouchDepth*en,M.position.y+=Me.crouchDepth*(1-Me.lowerScale)*en,S.rotation.x+=Me.upperPitch*en,K.root.rotation.x-=Me.armTuck*en,st.root.rotation.x-=Me.armTuck*en),wn>0&&O.grounded){const ne=a2(tt.attackProgress,Ee,c.stride),le=wn;Y.root.rotation.x+=ne.legL.pitchX*le,J.root.rotation.x+=ne.legR.pitchX*le,Y.root.rotation.z+=ne.legL.rollZ*le,J.root.rotation.z+=ne.legR.rollZ*le,Y.joint.rotation.x+=ne.legL.kneeX*le,J.joint.rotation.x+=ne.legR.kneeX*le,x.position.x+=ne.pelvisX*le,x.position.y+=ne.pelvisY*le,x.rotation.z+=ne.pelvisRoll*le}if(A0(on,tt.weapon),h!=null&&h.enabled&&h.autoCounter&&Math.abs(Di)>1e-4&&(x.position.x+=Di),g.enabled){const ne=tt.phase!=="idle"&&!tt.charging,le=ne?Ho(tt.attackProgress):0;ne&&Bt>.55&&le<Bt-1e-4&&(Ft=1),Bt=le,Ft=b2(Ft,fe,g.impactDecay);const Pn=M2({swing:le,charge:tt.charging?tt.charge:0,impact:Ft,speedRatio:Cc,grounded:O.grounded},g);Et=_2(Et,Pn,fe,g.smoothing)}else Et={...Nh};_0(Et),M.rotation.y=pt,we=e0(pt,a.chestYawScale,a.chestYawMaxDeg),S.rotation.y+=we;const sg=ag;if(mt.rotation.y=Ne(O.headYaw-O.bodyYaw-sg-we),mt.rotation.x=-he(O.headPitch??0,-.7,.7),S.rotation.x+=-he(O.bodyPitch??0,-.4,.4),L0(),S0(St,tt.comboIndex),T0(tt,ig),tt.weapon==="greatsword"&&!tt.charging&&(tt.phase!=="idle"||Sn>0)){_.updateWorldMatrix(!0,!0);const ne=tt.phase==="idle"?Math.max(Sn,Rn):1;b0(he(ne,0,1),fe)}if(Z=u0({root:_,pelvis:x,lower:M,limbs:Tt,base:K0,cfg:Js,grounded:O.grounded,attacking:on}),D0(O,fe),R&&Ws){const ne=Go();Mc=Math.max(Math.abs(ne.pitch-Ws.x),Math.abs(ne.yaw-Ws.y),Math.abs(ne.lean-Ws.z))}else Mc=0},lean(){return{forward:wt,side:$t}},landing(){const O=sp(gc,Ya,$a,Za,Bo),tt=$a>0?Math.max(0,$a-Math.max(0,gc-Ya)):0;return{pulse:O,remaining:tt,kind:O>0?Vs:"none",impactVy:Sd}},hurt(){return zt},ik(){return Z},stretch(){return{...Et,impact:Ft}},gripDebug(){return{...Gt}},weaponDebug(){return{wristPitch:qt,wristTwist:re}},setClipT(O){xe=O===null||!Number.isFinite(O)?null:Math.max(0,Math.min(1,O))},stanceDebug(){const O=it==null?void 0:it.armR,tt=it==null?void 0:it.armL,xt=it?A:0;return{weapon:Pt??"sword-shield",weight:xt,armL:{pitch:((tt==null?void 0:tt.pitch)??0)*xt,yaw:((tt==null?void 0:tt.yaw)??0)*xt,roll:((tt==null?void 0:tt.roll)??0)*xt,elbow:((tt==null?void 0:tt.elbow)??0)*xt},armR:{pitch:((O==null?void 0:O.pitch)??0)*xt,yaw:((O==null?void 0:O.yaw)??0)*xt,roll:((O==null?void 0:O.roll)??0)*xt,elbow:((O==null?void 0:O.elbow)??0)*xt},torsoYaw:((it==null?void 0:it.torsoYaw)??0)*xt,torsoPitch:((it==null?void 0:it.torsoPitch)??0)*xt,bladePitchDeg:q*180/Math.PI,bladePitchOffDeg:ut*180/Math.PI,armSwing:(it==null?void 0:it.armSwing)??1}},swingDebug(){const O=ue;return{seg:dn,kind:(O==null?void 0:O.kind)??"right-left",lead:(O==null?void 0:O.lead)??"R",yaw:(O==null?void 0:O.yaw)??0,rootYaw:(O==null?void 0:O.rootYaw)??0,spinYaw:(O==null?void 0:O.spinYaw)??0,rootTurn:bn,pitch:(O==null?void 0:O.pitch)??0,roll:(O==null?void 0:O.roll)??0,strike:(O==null?void 0:O.strike)??0,bladeTwist:(O==null?void 0:O.bladeTwist)??0,bladeTwistOff:(O==null?void 0:O.bladeTwistOff)??0,bladeYaw:(O==null?void 0:O.bladeYaw)??0,bladeYawOff:(O==null?void 0:O.bladeYawOff)??0,shoulderL:{x:ce.lx,y:ce.ly,z:ce.lz},shoulderR:{x:ce.rx,y:ce.ry,z:ce.rz}}},attackBlend(){return Rn},attackWeights(){return{gaitScale:Gs,attackLegWeight:wn,driveSpeed:Oo.speed,stridePhase:Oo.phase,strideBase:Qe,stepIndex:Ee}},hipYaw(){return pt},torsoTotal(){return Go()},spineDebug(){if(!R)return null;const O=Go();return{enabled:!0,waistYaw:S.rotation.y,chestYaw:L.rotation.y,totalYaw:O.yaw,totalPitch:O.pitch,totalLean:O.lean,neckPitch:mt.rotation.x,leak:Mc}},balanceDebug(){return ga?{...ga,shift:Di,latDeficit:_d,lateralFf:Pd}:null},gaitDebug(){return{stopT:bt,hipYaw:pt,chestYaw:we,speed:ye,gaitSpeed:Li,stopStep:hn,stopShift:Ce,stopDip:ci,stopYawFade:Q,turnStep:Mt,legTakeover:Yn,legLPitch:Xs.lp,legLRoll:Xs.lr,legRPitch:Xs.rp,legRRoll:Xs.rr,phase:Oo.phase,dirF:xa,dirR:va,hipYawTarget:Ot,spin:Lt}},gaitYaw(){return Ht},arrowDirection(){_t.updateWorldMatrix(!0,!1);const O=_t.matrixWorld.elements,tt=O[8],xt=O[9],St=O[10],Kt=Math.hypot(tt,xt,St)||1;return{x:tt/Kt,y:xt/Kt,z:St/Kt}},weaponBlade(){return Pt?Xo(vt[Pt].right):null},bladesWorld(){return Pt?{right:Xo(vt[Pt].right),left:Xo(vt[Pt].left)}:{right:null,left:null}},dispose(){_.traverse(O=>{if(O instanceof me){O.geometry.dispose();const tt=O.material;Array.isArray(tt)?tt.forEach(xt=>xt.dispose()):tt.dispose()}})}}}function F2(n){const t=f0(n.voxel,n.colors,n.moveSpeed,n.orientation,n.gait,n.mount,n.lean,n.hurt,n.animation,n.ik,n.links,n.wrist,n.balance),e=new _e;e.add(t.group);const i={position:{x:0,y:0,z:0},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:1,distance:0,coyoteTime:0,jumpBuffer:0},a=[];for(const s of["headPivot","chest","torsoUpper","torso","pelvis"]){const o=t.group.getObjectByName(s);o&&a.push(o)}return{group:e,update(s,o,r){i.position.x=s.position.x,i.position.y=s.position.y,i.position.z=s.position.z,i.velocity.x=s.velocity.x,i.velocity.y=s.velocity.y,i.velocity.z=s.velocity.z,i.facing=s.facing,i.moveYaw=Math.atan2(i.velocity.x,i.velocity.z),i.bodyYaw=s.bodyYaw,i.headYaw=s.headYaw,i.gaitPhase=s.gaitPhase,i.stride=s.stride,i.distance=s.distance,i.grounded=!0,i.sprinting=!1,e.position.set(s.position.x,s.position.y,s.position.z),e.rotation.y=s.bodyYaw,s.combat&&t.update(i,s.combat,s.hurt,o,!1,r,s.link)},debug(){return t.gaitDebug()},boneAtWorld(s,o,r){if(a.length===0)return null;const c=new W(s,o,r),l=new W;let d=null,u=Number.POSITIVE_INFINITY;for(const h of a){h.updateWorldMatrix(!0,!1),h.getWorldPosition(l);const f=l.distanceToSquared(c);f<u&&(u=f,d=h)}return d?{node:d,point:c}:null},dispose(){t.dispose()}}}const Pa=.012,Ca=.016;function U2(n,t,e=[]){const i=t.lab,a=new _e;a.name="test-lab";const s=[],o=[],r=[],c=[];function l(S){return r.push(S),S}function d(S){return c.push(S),S}function u(S,w,E,T=Pa){const b=l(new Mn({color:w,transparent:!0,opacity:E,depthWrite:!1,side:We,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),y=new me(S,b);return y.rotation.x=-Math.PI/2,y.position.y=T,y.renderOrder=2,y}function h(S,w){return d(new Rs(Math.max(S,.001),w,72))}function f(S,w,E,T=Ca){const y=document.createElement("canvas"),C=y.getContext("2d");if(!C)return new me;const I='700 96px "Noto Sans SC", ui-monospace, Menlo, monospace';C.font=I,y.width=Gu.ceilPowerOfTwo(Math.ceil(C.measureText(S).width)+32),y.height=Gu.ceilPowerOfTwo(96*1.4);const R=y.getContext("2d");if(!R)return new me;R.font=I,R.textAlign="center",R.textBaseline="middle",R.fillStyle=E,R.fillText(S,y.width/2,y.height/2);const U=new Ih(y);U.colorSpace=Bn,o.push(U);const L=y.width/y.height,k=d(new Vn(w*L,w)),B=l(new Mn({map:U,transparent:!0,depthWrite:!1,side:We,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3})),G=new me(k,B);return G.rotation.x=-Math.PI/2,G.position.y=T,G.renderOrder=3,G}function m(S,w,E,T,b,y){const C=E-w,I=d(new Vn(C,T)),R=u(I,b,y,Pa);R.position.set(C/2+w,Pa,0);const U=new _e;return U.add(R),U.rotation.y=S-Math.PI/2,U}function v(S,w,E,T,b){const y=new Nm;y.moveTo(0,w*.5),y.lineTo(-E*.5,w*.5-E*.9),y.lineTo(-E*.18,w*.5-E*.9),y.lineTo(-E*.18,-w*.5),y.lineTo(E*.18,-w*.5),y.lineTo(E*.18,w*.5-E*.9),y.lineTo(E*.5,w*.5-E*.9),y.closePath();const C=d(new gd(y)),I=u(C,T,b,Pa+.002),R=new _e;return R.add(I),R.rotation.y=S+Math.PI,R}function g(S){var C;const w=new _e,E=f(`${S.index} · ${S.name}`,t.lab.labelTextHeight,"#eaf4ff"),b=((C=E.geometry.parameters)==null?void 0:C.width)??3;w.add(E);const y=u(d(new Vn(b*.98,.08)),S.color,.7,Ca);return y.position.set(0,Ca,t.lab.labelTextHeight*.66),w.add(y),w.position.set(S.labelX,0,S.labelZ),w}function p(S,w){const E=new _e,T=S.maxX-S.minX,b=S.maxZ-S.minZ,y=(S.minX+S.maxX)/2,C=(S.minZ+S.maxZ)/2,I=.09,R=.006,U=[[y,S.minZ+I/2,T,I],[y,S.maxZ-I/2,T,I],[S.minX+I/2,C,I,b],[S.maxX-I/2,C,I,b]];for(const[k,B,G,$]of U){const at=u(d(new Vn(G,$)),w,.38,R);at.position.set(k,R,B),E.add(at)}const L=.42;for(const[k,B]of[[S.minX+L/2,S.minZ+L/2],[S.maxX-L/2,S.minZ+L/2],[S.minX+L/2,S.maxZ-L/2],[S.maxX-L/2,S.maxZ-L/2]]){const G=u(d(new Vn(L,L)),w,.55,R);G.position.set(k,R,B),E.add(G)}return E}const _=new _e,x=new Map;for(const S of n??[])x.set(S.id,S.color);for(const S of e)S.plotId&&_.add(p(S,x.get(S.plotId)??"#7f8fa0"));for(const S of n??[]){const w=new _e;if(w.position.set(S.x,0,S.z),S.shape==="square"){const E=S.radius,T=u(d(new Vn(E*2,E*2)),S.color,i.padOpacity*.09);w.add(T);const b=.07,y=[[0,E,E*2+b,b],[0,-E,E*2+b,b],[-E,0,b,E*2+b],[E,0,b,E*2+b]];for(const[C,I,R,U]of y){const L=u(d(new Vn(R,U)),S.color,i.padOpacity);L.position.x=C,L.position.z=I,w.add(L)}}else w.add(u(d(new ud(S.radius,72)),S.color,i.padOpacity*.075)),w.add(u(h(S.radius-.075,S.radius),S.color,i.padOpacity));if(S.id==="hub"){for(let E=0;E<4;E++){const T=E*Math.PI/4,b=E%2===0;for(const y of[0,Math.PI])w.add(m(T+y,S.radius*.12,S.radius*.94,b?.09:.055,S.color,b?.5:.32))}w.add(u(h(.5,.56),S.color,.4))}else if(S.id==="dash"){const E=S.spawnZ-S.z,T=-S.radius+.5,b=E-T,y=u(d(new Vn(.06,b)),S.color,.36);y.position.set(0,Pa,(E+T)/2),w.add(y);let C=0;for(let R=E;R>=T-.01;R-=1,C++){const U=C%5===0,L=u(d(new Vn(U?2.4:1.3,U?.1:.07)),S.color,U?.72:.42);L.position.set(0,Pa,R),w.add(L);const k=f(String(C),.52,U?"#eaf4ff":"rgba(200,225,245,0.8)");k.position.set(1.6,Ca,R),w.add(k)}const I=[[3.2,"翻滚 3.2"],[5,"闪现 5.0"]];for(const[R,U]of I){const L=E-R,k=u(d(new Vn(1.9,.09)),"#ffffff",.5);k.position.set(-1.5,Pa,L),w.add(k);const B=f(U,.42,"rgba(220, 236, 250, 0.86)");B.position.set(-3,Ca,L),w.add(B)}}else if(S.id==="gait"){w.add(u(h(1.44,1.5),S.color,.5)),w.add(u(h(1.14,1.2),S.color,.22));const E=1.55,T=[[0,"180° 正后退","#ff9a8a"],[Math.PI/4,"135° 斜后","#ffd166"],[Math.PI/2,"90° 正侧移","#8fe7ff"]];for(const[b,y,C]of T){const R=Math.sin(b),U=Math.cos(b),L=v(b,1.7,.34,C,.75);L.position.set(R*1.7*.5,0,E+U*1.7*.5),w.add(L);const k=f(y,.44,C);k.position.set(R*(1.7+.7),Ca,E+U*(1.7+.7)),w.add(k)}}if(_.add(w),i.showLabels){const E=g(S);s.push(E),_.add(E)}}a.add(_);const M=n==null?void 0:n.find(S=>S.id==="hub");if(M&&i.showLabels){const S=[[0,-1,"屏上"],[0,1,"屏下"],[-1,0,"屏左"],[1,0,"屏右"]];for(const[w,E,T]of S){const b=f(T,.4,"rgba(190, 224, 248, 0.8)");b.position.set(M.x+w*(M.radius+.7),Ca,M.z+E*(M.radius+.7)),a.add(b),s.push(b)}}return a.visible=i.enabled,{group:a,setVisible(S){a.visible=S},setLabelsVisible(S){for(const w of s)w.visible=S},dispose(){for(const S of c)S.dispose();for(const S of r)S.dispose();for(const S of o)S.dispose();a.clear()}}}const Xe={grass:8,groundArea:12,ringHalo:20,ring:22,ringMeter:24,ringWarn:26,groundFx:30,trail:40,slash:44,projectileTrail:46,projectile:48,projectileGlow:50};function El(n,t){n.renderOrder=t,n.traverse(e=>{e.renderOrder=t})}function Tl(n,t,e){const i=Array.from({length:t.count},()=>{const a=new Mn({color:t.color,transparent:!0,opacity:0,side:We,depthWrite:!1,...t.blending?{blending:t.blending}:{}}),s=new me(t.geometry,a);return s.rotation.x=-Math.PI/2,s.renderOrder=t.renderOrder,s.visible=!1,n.add(s),{mesh:s,mat:a,life:0,base:1,delay:0}});return{entries:i,spawn(a,s,o,r,c){const l=i.find(d=>d.life<=0)??i[0];c!=null&&c.color&&l.mat.color.set(c.color),l.mesh.position.set(a,e(a,s,o)+t.yOffset,s),l.base=r,l.mesh.scale.setScalar(r*t.scaleFrom),l.mesh.visible=!0,l.mat.opacity=t.spawnOpacity,l.life=t.duration,l.delay=(c==null?void 0:c.delay)??0},update(a){for(const s of i){if(s.life<=0)continue;if(s.delay>0){s.delay-=a;continue}s.life-=a;const o=Math.max(0,s.life/Math.max(t.duration,1e-6));s.mesh.scale.setScalar(s.base*(t.scaleFrom+t.scaleSpan*(1-Math.pow(o,t.growPow)))),s.mat.opacity=t.peak*Math.pow(o,t.fadePow),s.life<=0&&(s.mesh.visible=!1)}},live(){return i.filter(a=>a.life>0)},dispose(){for(const a of i)a.mat.dispose()}}}function N2(n,t,e,i){const a=t.dash,s={count:6,geometry:new Rs(a.ringRadius-.06,a.ringRadius,28),color:"#ffffff",renderOrder:Xe.groundFx,duration:a.fxDuration,peak:.9,fadePow:1,scaleFrom:.6,scaleSpan:1.2,growPow:1,yOffset:.04,spawnOpacity:.9},o=Tl(n,s,i),r=t.links,c={count:5,geometry:new Rs(r.ringRadius-.07,r.ringRadius,28),color:r.chargeColor,renderOrder:Xe.groundFx,duration:r.fxDuration,peak:.85,fadePow:1,scaleFrom:.55,scaleSpan:1.1,growPow:1,yOffset:.05,spawnOpacity:.85},l=Tl(n,c,i),d=t.groundSlam,u={count:4,geometry:new Rs(.78,1,56),color:d.color,blending:Xi,renderOrder:Xe.groundFx+1,duration:d.duration,peak:.85,fadePow:1.3,scaleFrom:.35,scaleSpan:.65,growPow:1.8,yOffset:.035,spawnOpacity:0},h=Tl(n,u,i);let f=e.dash.id,m="none",v=e.playerLink.id,g=e.playerLink.hitIds.length,p=e.combat.slamAttackId,_=0;return{update(x,M,S){var T;const w=x.character;if(x.dash.id!==f){f=x.dash.id;const b=x.dash;m=b.kind,b.kind==="blink"?(o.spawn(b.fromX,b.fromZ,w.position.y,.9,{color:a.blinkColor}),o.spawn(b.toX,b.toZ,w.position.y,1.35,{color:a.blinkColor})):o.spawn(b.fromX,b.fromZ,w.position.y,1.1,{color:a.rollColor})}if(o.update(M),x.combat.slamAttackId!==p&&(p=x.combat.slamAttackId,_+=1,d.enabled)){const b=(T=x.config.combat.weapons[x.combat.weapon])==null?void 0:T.groundSlam,y=Math.max(.6,(b==null?void 0:b.radius)??2.2);h.spawn(w.position.x,w.position.z,w.position.y,y,{delay:0}),h.spawn(w.position.x,w.position.z,w.position.y,y*d.outerScale,{delay:d.delay}),S(d.shake)}h.update(M);const E=x.playerLink;E.id!==v&&(v=E.id,g=E.hitIds.length,l.spawn(w.position.x,w.position.z,w.position.y,1)),E.hitIds.length>g?(g=E.hitIds.length,l.spawn(w.position.x,w.position.z,w.position.y,1.35)):E.hitIds.length<g&&(g=E.hitIds.length),l.update(M)},slamDebug(){return{spawns:_,lastId:p,live:h.live().map(x=>({life:x.life,scale:x.mesh.scale.x,opacity:x.mat.opacity,visible:x.mesh.visible}))}},groundOrder(){var x;return((x=h.entries[0])==null?void 0:x.mesh.renderOrder)??Xe.groundFx+1},activeDash(){return o.live().length},dashKind(){return m},dispose(){o.dispose(),l.dispose(),h.dispose();for(const x of[s.geometry,c.geometry,u.geometry])x.dispose()}}}const yd=64,p0=[0,.24,.76,1],O2=[0,1,1,0],m0=[0,.12,.28,.5,.72,.88,1],B2=[0,.16,.5,1,.5,.16,0];function lp(n,t){if(t<=1e-6)return 1;const e=Math.min(1,Math.max(0,n/t));return e*e*(3-2*e)}function Md(n,t,e,i,a=yd,s="band"){const o=Math.max(.001,n-t*.5),r=Math.max(o+.001,n+t*.5),c=s==="glow"?m0:p0,l=s==="glow"?B2:O2,d=c.length,u=a+1,h=new Float32Array(u*d*3),f=new Float32Array(u*d*4),m=[];for(let g=0;g<u;g++){const p=g/a,_=(p-.5)*e,x=lp(p,i)*lp(1-p,i),M=Math.sin(_),S=Math.cos(_);for(let w=0;w<d;w++){const E=o+(r-o)*c[w],T=g*d+w;h[T*3]=M*E,h[T*3+1]=0,h[T*3+2]=S*E;const b=x*l[w];f[T*4]=1,f[T*4+1]=1,f[T*4+2]=1,f[T*4+3]=b}}for(let g=0;g<a;g++)for(let p=0;p<d-1;p++){const _=g*d+p,x=_+d;m.push(_,x,_+1,_+1,x,x+1)}const v=new Je;return v.setAttribute("position",new _n(h,3)),v.setAttribute("color",new _n(f,4)),v.setIndex(m),v.computeBoundingSphere(),v}function Al(n){const t=new Mn({color:n.color,transparent:!0,opacity:n.opacity,depthWrite:!1,side:We,vertexColors:!0,toneMapped:!1}),e=new Map;let i=null;const a=(c,l)=>{const d=Math.round(c*32)/32,u=Math.max(.05,Math.round(l*20)/20),h=`${Math.round(d*32)}|${Math.round(u*20)}`,f=e.get(h);if(f)return f;const m=Md(n.radius,n.thickness*u,d,n.edgeFade,yd,n.profile??"band");if(e.set(h,m),e.size>64){for(const[v,g]of e)if(v!==h&&g!==i){g.dispose(),e.delete(v);break}}return m};i=a(n.arcRad,1);const s=new me(i,t);s.position.y=n.y,s.renderOrder=n.renderOrder??4;let o=n.arcRad,r=1;return{mesh:s,update(c,l,d,u,h,f=1){const m=Math.max(.05,f);(Math.abs(c-o)>.01||Math.abs(m-r)>.01)&&(i=a(c,m),s.geometry=i,o=c,r=m),t.opacity=l,t.color.copy(u),s.scale.set(d,1,d),s.rotation.y=h,s.visible=l>.002},arcRad(){return o},dispose(){for(const c of e.values())c.dispose();e.clear(),t.dispose()}}}function hp(n,t){return Math.max(.05,n*.5*Math.max(.1,t))}function H2(n,t,e,i,a){const s=a.arcDeg*Math.PI/180,o=a.playerOpacity;if(!n)return{arcRad:s,opacity:o,scale:1,level:0};const r=Math.min(1,Math.max(0,t)),c=Math.min(1,Math.max(0,e)),l=a.selectedArcDeg*Math.PI/180,d=s+(l-s)*(.35+.65*r),u=4+4*r+6*c,h=.5+.5*Math.sin(i*u),f=Math.min(.95,o+(.2+.1*c)*r+.04*h),m=1+.02*r+.012*h*r;return{arcRad:d,opacity:f,scale:m,level:r}}function G2(n,t,e,i,a){const s=Math.min(1,Math.max(0,a));return s<=.001?n.copy(t):s<.5?n.copy(t).lerp(e,s*2):n.copy(e).lerp(i,(s-.5)*2)}function X2(n=64,t=.06,e=5){const i=n+1,a=e+1,s=new Float32Array(i*a*3),o=new Float32Array(i*a*4),r=[];for(let l=0;l<i;l++){const d=l/n*Math.PI*2,u=Math.sin(d),h=Math.cos(d);for(let f=0;f<a;f++){const m=f/e,v=t+(1-t)*m,g=l*a+f;s[g*3]=u*v,s[g*3+1]=0,s[g*3+2]=h*v;const p=Math.pow(1-m,1.8)*.9+(f===0?.1:0);o[g*4]=1,o[g*4+1]=1,o[g*4+2]=1,o[g*4+3]=Math.min(1,p)}}for(let l=0;l<n;l++)for(let d=0;d<e;d++){const u=l*a+d,h=u+a;r.push(u,h,u+1,u+1,h,h+1)}const c=new Je;return c.setAttribute("position",new _n(s,3)),c.setAttribute("color",new _n(o,4)),c.setIndex(r),c.computeBoundingSphere(),c}function dp(n){const t=n.segments??yd,e=n.profile??"band",a=((e==="glow"?m0.length:p0.length)-1)*6,s=Md(n.radius,n.thickness,n.arcRad,n.edgeFade,t,e),o=new Mn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:We,vertexColors:!0,toneMapped:!1}),r=new me(s,o);r.position.y=n.y,r.renderOrder=n.renderOrder??7,r.visible=!1,s.setDrawRange(0,0);let c=0;return{mesh:r,set(l,d,u,h,f=1){const m=Math.min(1,Math.max(0,l)),v=Math.round(m*t),g=m>.001?Math.max(1,v)*a:0;g!==s.drawRange.count&&s.setDrawRange(0,g),c=v,o.opacity=d,o.color.copy(u),r.scale.set(f,1,f),r.rotation.y=h,r.visible=d>.002&&m>.001},ratio(){return t>0?c/t:0},filledSegments(){return c},dispose(){s.dispose(),o.dispose()}}}function up(n){const t=new _e,e=X2(48),i=new Mn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:We,vertexColors:!0,toneMapped:!1}),a=new me(e,i);a.renderOrder=n.renderOrder??2,t.add(a);const s=Math.max(.01,n.edgeWidthRatio??.045),o=Md(1-s*.5,s,Math.PI*2,0,64,"band"),r=new Mn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:We,vertexColors:!0,toneMapped:!1}),c=new me(o,r);return c.renderOrder=(n.renderOrder??2)+1,t.add(c),t.position.y=n.y,{group:t,set(l,d,u,h,f,m){const v=Math.min(1,Math.max(0,f));t.position.set(l,u,d),a.scale.set(h,1,h),c.scale.set(h,1,h),i.opacity=v*.26,r.opacity=v*(.72+.18*Math.sin(m*7)),t.visible=v>.004},dispose(){e.dispose(),i.dispose(),o.dispose(),r.dispose()}}}function fp(n,t,e,i){if(i<=1e-4||e<=0)return t;const a=1-Math.exp(-e/i);return n+(t-n)*a}function V2(n,t,e){if(n!=="windup")return{active:!1,ratio:0,urgency:0};const i=Math.max(1e-4,e),a=Math.min(1,Math.max(0,t/i));return{active:!0,ratio:a,urgency:.35+.65*a}}function W2(n){if(n.charging)return{source:"charge",ratio:Math.min(1,Math.max(0,n.charge))};if(n.channeling){if(n.channelProgress!==void 0)return{source:"channel",ratio:Math.min(1,Math.max(0,n.channelProgress))};const i=Math.max(1e-4,n.fireInterval);return{source:"channel",ratio:1-Math.min(1,Math.max(0,n.fireTimer/i))}}const t=n.arcaneCooldown??0,e=n.arcaneCooldownMax??0;return t>0&&e>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,t/e))}:n.dashCooldown>0&&n.dashCooldownMax>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,n.dashCooldown/n.dashCooldownMax))}:{source:"none",ratio:0}}function Y2(n,t,e,i,a,s){return n!=="windup"||a<=.05?{active:!1,x:t,z:e,radius:0}:{active:!0,x:t+Math.sin(i)*a,z:e+Math.cos(i)*a,radius:Math.max(.3,s)}}function $2(n,t){const e=Math.max(.02,t),i=Math.min(1,Math.max(0,n/e));return{scale:.06+.94*(1-Math.pow(1-i,3)),alpha:i}}function Z2(n,t,e){return n?t:e}function g0(n){return{x:0,y:0,z:1}}function j2(n){return Math.asin(g0().y)}function q2(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}const K2=Math.PI/3;function pp(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function J2(){let n=0,t=!1;return{update(e,i,a,s=K2){if(!Number.isFinite(e))return n;if(!t)return t=!0,n=e,n;if(!(a>0)||!(i>0))return n=e,n;const o=pp(e-n);if(Math.abs(o)>=s)return n=e,n;const r=1-Math.exp(-i/(a/1e3));return n=pp(n+o*r),n},reset(e){t=!0,n=e},get value(){return n},get ready(){return t}}}function Q2(n){const t=Math.max(2,Math.floor(n.maxSamples)),e=new Je,i=new Float32Array(t*2*3),a=new Float32Array(t*2*3),s=new _n(i,3),o=new _n(a,3);s.setUsage(yo),o.setUsage(yo),e.setAttribute("position",s),e.setAttribute("color",o);const r=[];for(let x=0;x<t-1;x++){const M=x*2,S=M+1,w=M+2,E=M+3;r.push(M,S,w,S,E,w)}e.setIndex(r),e.setDrawRange(0,0);const c=new Mn({vertexColors:!0,transparent:!0,opacity:1,blending:Xi,depthWrite:!1,side:We}),l=new me(e,c);l.frustumCulled=!1,l.renderOrder=6,l.visible=!1;const d=new te(n.color);let u=[],h=null,f=0,m=0,v=!1,g=!1,p=0;function _(){const x=u.length;if(x<2||!n.enabled){l.visible=!1,e.setDrawRange(0,0);return}const M=Math.max(.001,n.life);for(let S=0;S<x;S++){const w=u[S],E=Math.max(0,1-w.age/M),T=E*E,b=Math.min(1,w.speed/Math.max(.001,n.minSpeed*2)),y=n.intensity*T*(.55+.45*b)*(1+p),C=.18+.82*E,I=S*6;i[I]=w.tx+(w.bx-w.tx)*C,i[I+1]=w.ty+(w.by-w.ty)*C,i[I+2]=w.tz+(w.bz-w.tz)*C,i[I+3]=w.tx,i[I+4]=w.ty,i[I+5]=w.tz;const R=d.r*y,U=d.g*y,L=d.b*y,k=R*.22,B=U*.22,G=L*.22;a[I]=k,a[I+1]=B,a[I+2]=G;const $=1+n.tipBoost;a[I+3]=Math.min(1,R*$),a[I+4]=Math.min(1,U*$),a[I+5]=Math.min(1,L*$)}s.needsUpdate=!0,o.needsUpdate=!0,e.setDrawRange(0,(x-1)*6),l.visible=!0}return{object:l,update(x,M,S){if(!n.enabled){l.visible=!1;return}const w=Math.max(0,x);p*=Math.exp(-Math.max(1,n.pulseDecay??14)*w),p<.001&&(p=0);for(const E of u)E.age+=w;for(;u.length>0&&u[0].age>n.life;)u.shift();if(M){const E=h?Math.hypot(M.tip.x-h.x,M.tip.y-h.y,M.tip.z-h.z)/Math.max(1e-4,w):0,T=u[u.length-1],b=T?Math.hypot(M.tip.x-T.tx,M.tip.y-T.ty,M.tip.z-T.tz):1/0;if(S&&b>=n.minStep)for(u.push({bx:M.base.x,by:M.base.y,bz:M.base.z,tx:M.tip.x,ty:M.tip.y,tz:M.tip.z,age:0,speed:E});u.length>t;)u.shift();h={x:M.tip.x,y:M.tip.y,z:M.tip.z},f=E,m=b,v=!0}else h=null,v=!1,f=0,m=0;g=S,_()},debug(){return{count:u.length,visible:l.visible,speed:f,moved:m,hasBlade:v,active:g,pulse:p}},pulse(x){!Number.isFinite(x)||x<=0||(p=Math.min(1.5,p+x))},reset(){u=[],h=null,p=0,l.visible=!1,e.setDrawRange(0,0)},dispose(){e.dispose(),c.dispose()}}}const tR=`#include <common>
attribute vec2 aWindPhase;
attribute vec3 aWindRoot;
attribute vec4 aWindGeom;
uniform float uWindTime;
uniform vec2 uWindDir;
uniform vec2 uWindOmega;
uniform vec2 uWindAmp;
uniform float uWindGust;
uniform float uWindShade;
uniform float uWindOn;
varying float vWindShade;
vec3 rotAxis(vec3 v, vec3 axis, float c, float s) {
  return v * c + cross(axis, v) * s + axis * dot(axis, v) * (1.0 - c);
}`,eR=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_INSTANCING
  mvPosition = instanceMatrix * mvPosition;
#endif
{
  // 两波叠加：主浪 + 更短更快的次浪（与 Core.windSample 同式）
  float s1 = sin(aWindPhase.x - uWindOmega.x * uWindTime);
  float s2 = sin(aWindPhase.y - uWindOmega.y * uWindTime);
  float sway = uWindGust * (uWindAmp.x * s1 + uWindAmp.y * s2) * uWindOn * aWindGeom.z;

  // 割断 / 缓慢生长抑制：instanceMatrix 的 Y 列长度 = 当前实际段高，除以设计段高即存活比例。
  // 断茬变矮 → 摆幅按比减弱；上段被隐藏(scale=0) → 完全不摆。无需额外上传。
  vec3 ay = instanceMatrix[1].xyz;
  float designSegH = mix(aWindGeom.x, aWindGeom.y, aWindGeom.w);
  float alive = clamp(length(ay) / max(designSegH, 1e-4), 0.0, 1.0);
  sway *= alive;

  // 草顶摆幅(米) → 倾角：有效力臂 LOW·hBase + hTip（折线弯折的等效力臂），
  // 与 Core.windPivotAngles / windPivotEffLength 同源，顶端实际位移 ≈ sway。
  float effL = ${fu.toFixed(2)} * aWindGeom.x + aWindGeom.y;
  float theta = atan(sway, max(effL, 1e-3));
  float tLow = theta * ${fu.toFixed(2)};
  float tUp  = theta * ${qx.toFixed(2)};

  // 世界风向 → 水平旋转轴 (dirZ, 0, -dirX)：草朝风向倾倒；物体空间即世界空间
  vec3 axis = normalize(vec3(uWindDir.y, 0.0, -uWindDir.x));
  vec3 P0 = aWindRoot;                                   // 草根枢轴
  vec3 v = mvPosition.xyz;
  float cL = cos(tLow), sL = sin(tLow);
  vec3 vLow = P0 + rotAxis(v - P0, axis, cL, sL);      // 下段：绕草根刚体转 low

  if (aWindGeom.w > 0.5) {
    // 上段：先继承下段旋转，再绕「下段转后顶端」额外折 up → 与下段顶端无缝
    vec3 P1 = (instanceMatrix * vec4(0.0, -0.5, 0.0, 1.0)).xyz;   // 上段底 = 下段顶
    vec3 P1p = P0 + rotAxis(P1 - P0, axis, cL, sL);
    float cU = cos(tUp), sU = sin(tUp);
    vLow = P1p + rotAxis(vLow - P1p, axis, cU, sU);
  }
  mvPosition.xyz = vLow;

  // 明暗带：波峰亮、波谷暗，形成一条条推进的浪
  vWindShade = 1.0 - uWindShade * uWindOn * (0.5 + 0.5 * s1) * alive;
}
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,nR=`#include <common>
varying float vWindShade;`,iR=`#include <color_fragment>
diffuseColor.rgb *= vWindShade;`;function aR(n,t,e,i,a){const s=Math.min(e.blades.length,Math.floor(Math.max(0,i.maxInstances)/2)),o=s*2,r=new Float32Array(o*2),c=new Float32Array(o*3),l=new Float32Array(o*4),d=Math.max(.01,i.segmentHeight);for(let f=0;f<s;f++){const m=e.blades[f],v=Math.min(d,m.height),g=Math.max(0,m.height-v),[p,_]=Zx(a,m.x,m.z,m.yaw*a.jitter),x=Math.min(1.4,Math.max(.6,m.height/(d*1.5)));for(let M=0;M<2;M++){const S=f*2+M;r[S*2]=p,r[S*2+1]=_,c[S*3]=m.x,c[S*3+1]=m.y,c[S*3+2]=m.z,l[S*4]=v,l[S*4+1]=g,l[S*4+2]=x,l[S*4+3]=M}}t.setAttribute("aWindPhase",new _o(r,2)),t.setAttribute("aWindRoot",new _o(c,3)),t.setAttribute("aWindGeom",new _o(l,4));const u=Xp(a),h={uWindTime:{value:0},uWindDir:{value:new Vt(u.dirX,u.dirZ)},uWindOmega:{value:new Vt(u.omega1,u.omega2)},uWindAmp:{value:new Vt(u.amp1,u.amp2)},uWindGust:{value:1},uWindShade:{value:u.shadeAmount},uWindOn:{value:a.enabled?1:0}};return n.onBeforeCompile=f=>{Object.assign(f.uniforms,h),f.vertexShader=f.vertexShader.replace("#include <common>",tR).replace("#include <project_vertex>",eR),f.fragmentShader=f.fragmentShader.replace("#include <common>",nR).replace("#include <color_fragment>",iR)},n.customProgramCacheKey=()=>"grass-wind-pivot-v2",h}function sR(n){let t=n>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function oR(n,t,e=Po){const i=new _e;i.name="grass-layer";const s=n.blades.length,o=Math.max(0,Math.floor(t.maxInstances)),r=Math.min(s,Math.floor(o/2)),c=r*2,l=t.enabled&&c>0,u=(t.palette.length>0?t.palette:["#4a8f57"]).map(H=>new te(H)),h=new te(t.stumpColor),f=new te(t.debris.color),m=new ni(1,1,1),v=new ni(1,1,1),g=new Zi({color:16777215,transparent:!1}),p=aR(g,v,n,t,e),_=new Zi({color:f,transparent:!1});let x=null,M=null,S=null;const w=[],E=sR(2654435769^r),T=new Float32Array(r),b=new Uint8Array(r),y=new Float32Array(r),C=new Uint8Array(r).fill(1),I=new Ae,R=new ua,U=new ua,L=new ua,k=new W,B=new W,G=new W,$=new W,at=new te,mt=new te,ft=new Ae().makeScale(0,0,0);let Dt=0,j=0,F=0,Y=0,J=1,K=1;const st=8;let Tt={enabled:e.enabled,time:0,gust:1,mode:"pivot"};function Wt(H,kt){if(u.length===1)return kt.copy(u[0]);const Rt=Math.max(0,Math.min(u.length-1,H*(u.length-1))),_t=Math.min(u.length-2,Math.max(0,Math.floor(Rt)));return kt.copy(u[_t]).lerp(u[_t+1],Math.min(1,Math.max(0,Rt-_t)))}if(l){x=new Bf(v,g,c),x.instanceMatrix.setUsage(yo),x.castShadow=!1,x.receiveShadow=!0,x.frustumCulled=!1,x.name="grass-blades",x.setColorAt(0,u[0]),M=x.instanceColor,M&&M.setUsage(yo);for(let kt=0;kt<c;kt++)x.setMatrixAt(kt,ft);i.add(x);const H=Math.max(1,Math.floor(t.debris.max));S=new Bf(m,_,H),S.instanceMatrix.setUsage(yo),S.castShadow=!1,S.receiveShadow=!1,S.frustumCulled=!1,S.name="grass-debris";for(let kt=0;kt<H;kt++)S.setMatrixAt(kt,ft);i.add(S)}i.visible=l;function dt(H,kt,Rt,_t,vt,gt){if(!S)return;const Pt=S.count;if(w.length>=Pt)return;const D=t.debris.life,A=1.1+E()*1.5;w.push({x:H,y:kt,z:Rt,vx:_t*A+(E()-.5)*1.2,vy:1.9+E()*1.8,vz:vt*A+(E()-.5)*1.2,life:D,total:D,size:gt*(.55+E()*.45),spin:(E()-.5)*9})}function X(H){if(!S)return;const kt=S.count,Rt=12;for(let vt=w.length-1;vt>=0;vt--){const gt=w[vt];if(gt.life-=H,gt.life<=0){w.splice(vt,1);continue}gt.vy-=Rt*H,gt.x+=gt.vx*H,gt.y+=gt.vy*H,gt.z+=gt.vz*H,gt.y<.02&&(gt.y=.02,gt.vy=-gt.vy*.25,gt.vx*=.6,gt.vz*=.6)}const _t=1e-4;for(let vt=0;vt<kt;vt++){const gt=w[vt];if(!gt){S.setMatrixAt(vt,ft);continue}const Pt=Math.max(_t,gt.life/gt.total);B.set(gt.x,gt.y,gt.z),k.set(.4+vt*.13,1,.2).normalize(),R.setFromAxisAngle(k,gt.spin*(gt.total-gt.life)),G.set(gt.size*Pt,gt.size*.7*Pt,gt.size*Pt),I.compose(B,R,G),S.setMatrixAt(vt,I)}S.instanceMatrix.needsUpdate=!0}return{object:i,update(H,kt){var pt,Ht,Ot;if(!l||!x)return;const Rt=H.grass,_t=((pt=H.config.grass)==null?void 0:pt.wind)??Po,vt=Xp(_t),gt=((Ht=Rt.wind)==null?void 0:Ht.time)??0,Pt=((Ot=Rt.wind)==null?void 0:Ot.gust)??1;p.uWindTime.value=gt,p.uWindGust.value=Pt,p.uWindDir.value.set(vt.dirX,vt.dirZ),p.uWindOmega.value.set(vt.omega1,vt.omega2),p.uWindAmp.value.set(vt.amp1,vt.amp2),p.uWindShade.value=vt.shadeAmount,p.uWindOn.value=_t.enabled?1:0,Tt={enabled:_t.enabled,time:gt,gust:Pt,mode:"pivot"};const D=Math.min(r,Rt.blades.length),A=Math.min(.05,Math.max(0,kt)),q=H.config.grass,ut=(q==null?void 0:q.regrowSec)??0,it=Math.min(1,Math.max(.05,(q==null?void 0:q.stumpRatio)??.34)),lt=t.segmentHeight,Nt=Math.PI*2;x.instanceMatrix.clearUpdateRanges(),M&&M.clearUpdateRanges();let Ct=0,wt=0,$t=0,yt=0,zt=0,Z=0,V=0;for(let Lt=0;Lt<D;Lt++){const N=Rt.blades[Lt],bt=N.cut!==0?1:0,et=N.yaw/Nt,ht=Kx(N.cut,ut,et),It=Math.min(lt,N.height),At=It*it,jt=At+(N.height-At)*ht;if(Lt<st&&(Z+=jt/Math.max(1e-6,N.height),V+=1),ht>.001&&ht<1-.001&&(yt+=1,zt+=ht),!(C[Lt]===1||Math.abs(N.bend-T[Lt])>1e-4||bt!==b[Lt]||Math.abs(ht-y[Lt])>.001)){N.bend>.02&&(wt+=1),bt&&($t+=1);continue}bt&&!b[Lt]&&C[Lt]!==1&&(dt(N.x,N.y+It*.75,N.z,N.bendX||1,N.bendZ||0,N.width*1.5),dt(N.x,N.y+It+(N.height-It)*.5,N.z,N.bendX||1,N.bendZ||0,N.width*1.2)),k.set(Math.cos(N.yaw),0,-Math.sin(N.yaw)),L.setFromAxisAngle(k,N.lean),k.set(N.bendZ,0,-N.bendX),U.setFromAxisAngle(k,N.bend),R.copy(U).multiply(L),$.set(N.x,N.y,N.z);const oe=Math.min(lt,jt),ee=Math.max(0,jt-lt);B.set(0,oe*.5,0).applyQuaternion(R).add($),G.set(N.width,oe,N.width),I.compose(B,R,G),x.setMatrixAt(Lt*2,I),ee<1e-4?x.setMatrixAt(Lt*2+1,ft):(B.set(0,oe+ee*.5,0).applyQuaternion(R).add($),G.set(N.width*.84,ee,N.width*.84),I.compose(B,R,G),x.setMatrixAt(Lt*2+1,I)),Wt(N.tone,mt),ht>=1?at.copy(mt):at.copy(h).lerp(mt,ht),x.setColorAt(Lt*2,at),x.setColorAt(Lt*2+1,at),x.instanceMatrix.addUpdateRange(Lt*32,32),M&&M.addUpdateRange(Lt*6,6),T[Lt]=N.bend,b[Lt]=bt,y[Lt]=ht,C[Lt]=0,Ct+=1,N.bend>.02&&(wt+=1),bt&&($t+=1)}Ct>0&&(x.instanceMatrix.needsUpdate=!0,M&&(M.needsUpdate=!0)),X(A),Dt=Ct,j=wt,F=$t,Y=yt,J=yt>0?zt/yt:1,K=V>0?Z/V:1},debug(){return{enabled:l,blades:s,patches:n.patches.length,instances:c,drawCalls:l?2:0,dirty:Dt,bent:j,cut:F,debris:w.length,growing:Y,avgGrowth:J,sampleHeight:K,wind:{...Tt}}},dispose(){m.dispose(),v.dispose(),g.dispose(),_.dispose(),i.clear()}}}const Rl=10,rR=.14,go=1e-6;function uo(n,t,e){return n<t?t:n>e?e:n}function mp(n,t,e,i){const a=t.length,s=[],o=(d,u,h)=>{s.push(d[0],d[1],d[2],u[0],u[1],u[2],h[0],h[1],h[2])},r=(d,u)=>{const h=u/a*Math.PI*2;return[Math.cos(h)*n,d,Math.sin(h)*n]};for(let d=0;d<a;d++){const u=(d+1)%a,h=r(t[d],d),f=r(t[u],u),m=r(e[d],d),v=r(e[u],u);o(h,f,v),o(h,v,m)}const c=a*6;if(i!=="none"){const d=i==="b"?e:t;let u=0;for(let h=0;h<a;h++)u+=d[h];u/=a;for(let h=0;h<a;h++){const f=(h+1)%a;o([0,u,0],r(d[h],h),r(d[f],f))}}const l=new Je;return l.setAttribute("position",new Re(s,3)),l.addGroup(0,c,0),i!=="none"&&l.addGroup(c,a*3,1),l.computeVertexNormals(),l}function cR(n,t,e,i){const a={x:t.x-n.x,y:t.y-n.y,z:t.z-n.z},s={x:i.x-e.x,y:i.y-e.y,z:i.z-e.z},o={x:n.x-e.x,y:n.y-e.y,z:n.z-e.z},r=(v,g)=>v.x*g.x+v.y*g.y+v.z*g.z,c=r(a,a),l=r(s,s),d=r(s,o);let u=0,h=0;if(c<=go&&l<=go)u=0,h=0;else if(c<=go)u=0,h=uo(d/l,0,1);else{const v=r(a,o);if(l<=go)h=0,u=uo(-v/c,0,1);else{const g=r(a,s),p=c*l-g*g;u=p!==0?uo((g*d-v*l)/p,0,1):0,h=(g*u+d)/l,h<0?(h=0,u=uo(-v/c,0,1)):h>1&&(h=1,u=uo((g-v)/c,0,1))}}const f={x:n.x+a.x*u,y:n.y+a.y*u,z:n.z+a.z*u},m={x:e.x+s.x*h,y:e.y+s.y*h,z:e.z+s.z*h};return{dist:Math.hypot(f.x-m.x,f.y-m.y,f.z-m.z),cq:m}}function lR(n){const t=new _e;t.name="destructibles";const e=[];let i=null,a=null;for(const f of n){const m=new Zi({color:new te(f.color),side:We}),v=new Zi({color:new te(f.cutColor),side:We}),g=new me(new Je,[m,v]),p=new me(new Je,[m,v]);g.name=`lower-${f.id}`,p.name=`upper-${f.id}`;const _=new _e;_.add(p);const x=new _e;x.name=`piece-${f.id}`,x.position.set(f.x,f.y,f.z),x.add(g,_),t.add(x),e.push({id:f.id,root:x,lower:g,upperGroup:_,upper:p,bodyMat:m,capMat:v,key:""})}const s=(f,m)=>{const v=m.cutU*m.height,g=ov(m.radius,Rl,m.cutU,m.height,m.nx,m.ny,m.nz),p=new Array(Rl).fill(0),_=new Array(Rl).fill(m.height),x=mp(m.radius,p,g,"b"),M=mp(m.radius,g.map(S=>S-v),_.map(S=>S-v),"a");f.lower.geometry.dispose(),f.upper.geometry.dispose(),f.lower.geometry=x,f.upper.geometry=M},o=new W;function r(f){for(let m=0;m<e.length;m++){const v=e[m];let g;for(let _=0;_<f.length;_++)if(f[_].id===v.id){g=f[_];break}if(!g){v.upperGroup.visible=!1;continue}const p=`${g.broken}|${g.cutU}|${g.theta}|${g.nx}|${g.ny}|${g.nz}`;p!==v.key&&(s(v,g),v.key=p),v.bodyMat.color.set(g.color),v.capMat.color.set(g.cutColor),v.root.position.set(g.x,g.y,g.z),v.upperGroup.visible=g.broken!==0,v.upperGroup.position.set(0,g.cutU*g.height,0),o.set(g.ax,g.ay,g.az),v.upperGroup.quaternion.setFromAxisAngle(o,g.fall)}}function c(f,m){const v=[],g=(p,_)=>{if(!p){_==="right"?i=null:a=null;return}const x={x:(p.base.x+p.tip.x)/2,y:(p.base.y+p.tip.y)/2,z:(p.base.z+p.tip.z)/2},M=_==="right"?i:a;if(_==="right"?i=x:a=x,!M)return;let S=p.tip.x-p.base.x,w=p.tip.y-p.base.y,E=p.tip.z-p.base.z;const T=x.x-M.x,b=x.y-M.y,y=x.z-M.z;Math.hypot(T,b,y)>.002&&(S=T,w=b,E=y);const I=Math.hypot(S,w,E);I>go?(S/=I,w/=I,E/=I):(S=0,w=0,E=1);const R={x:0,y:0,z:0},U={x:0,y:0,z:0};for(let L=0;L<f.length;L++){const k=f[L];if(k.broken!==0)continue;R.x=k.x,R.y=k.y,R.z=k.z,U.x=k.x,U.y=k.y+k.height,U.z=k.z;const B=cR(p.base,p.tip,R,U);if(!(B.dist>k.radius+rR)){v.push({id:k.id,x:B.cq.x,y:B.cq.y,z:B.cq.z,dx:S,dy:w,dz:E});break}}};return g(m.right,"right"),g(m.left,"left"),v}function l(){let f=0;const m=[],v=[];let g=0;for(const p of e)p.lower.visible&&(f+=1),p.upperGroup.visible&&(f+=1),v.push({id:p.id,x:p.root.position.x,y:p.root.position.y,z:p.root.position.z});for(const p of d)p.broken!==0&&(g+=1,m.push({id:p.id,cutU:p.cutU,theta:p.theta,nx:p.nx,ny:p.ny,nz:p.nz,fall:p.fall}));return{count:e.length,broken:g,drawCalls:f,positions:v,cuts:m}}let d=n;const u=f=>{d=f,r(f)};function h(){for(const f of e)f.lower.geometry.dispose(),f.upper.geometry.dispose(),f.bodyMat.dispose(),f.capMat.dispose();t.clear()}return u(n),{object:t,update:u,computeHits:c,debug:l,dispose:h}}function hR(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function dR(n,t,e,i,a){var ot,ct;const s=Math.max(1,n.clientWidth),o=Math.max(1,n.clientHeight),r=new aA({antialias:!0});r.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),r.shadowMap.enabled=!0,r.shadowMap.type=am,r.setSize(s,o,!1),n.appendChild(r.domElement);const c=new sA;c.background=new te("#12161d"),c.add(new GA(11061486,2764600,1.15));const l=(t.gridMeta.minX+t.gridMeta.maxX)/2,d=(t.gridMeta.minZ+t.gridMeta.maxZ)/2,u=Math.max(t.gridMeta.maxX-t.gridMeta.minX,t.gridMeta.maxZ-t.gridMeta.minZ)/2+4,h=new WA(16773852,1.5);h.position.set(l+9,18,d+11),h.target.position.set(l,0,d),h.castShadow=!0,h.shadow.mapSize.set(2048,2048);const f=h.shadow.camera;f.left=-u,f.right=u,f.top=u,f.bottom=-u,f.near=1,f.far=90,c.add(h),c.add(h.target);const m=[],v=new _e;for(const P of t.boxes){const nt=P.maxX-P.minX,rt=P.maxY-P.minY,Mt=P.maxZ-P.minZ;let Et=hR(P.kind,e);P.kind==="step"&&(Et=new te(Et).offsetHSL(0,0,P.maxY*.09).getStyle());const Ft=new Zi({color:Et,transparent:!1,opacity:1}),Bt=new me(new ni(nt,rt,Mt),Ft);Bt.position.set((P.minX+P.maxX)/2,(P.minY+P.maxY)/2,(P.minZ+P.maxZ)/2),Bt.castShadow=P.kind!=="ground",Bt.receiveShadow=!0,Bt.add(new Wf(new SA(Bt.geometry),new kh({color:10467020,transparent:!0,opacity:.32}))),v.add(Bt),m.push(Ft)}c.add(v);const g=t.gridMeta,p=[],_=[],x=.002,M=1;for(let P=g.minX;P<=g.maxX+1e-6;P+=M)(Math.round(P/M)%5===0?_:p).push(P,x,g.minZ,P,x,g.maxZ);for(let P=g.minZ;P<=g.maxZ+1e-6;P+=M)(Math.round(P/M)%5===0?_:p).push(g.minX,x,P,g.maxX,x,P);const S=new _e,w=[[p,3358797,.5],[_,4873328,.85]];for(const[P,nt,rt]of w){const Mt=new Je;Mt.setAttribute("position",new Re(P,3)),S.add(new Wf(Mt,new kh({color:nt,transparent:!0,opacity:rt})))}S.visible=e.showGrid,c.add(S);const E=U2(i,e,a);c.add(E.group);const T=oR(t.grass,e.grass,t.config.grass.wind);El(T.object,Xe.grass),c.add(T.object);const b=lR(t.destructibles);c.add(b.object);let y=[];const C=P=>f0((P==null?void 0:P.voxel)??e.voxel,P!=null&&P.colors?{...e.colors,...P.colors}:e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links,e.weaponWrist,e.balance);let I="standard",R=C((ot=e.bodyTypes)==null?void 0:ot[I]);const U=Q2(e.weaponTrail);El(U.object,Xe.trail),c.add(U.object);const L=new _e,k=.9,B=new _e;B.position.y=k,R.group.position.y=-k,B.add(R.group),L.add(B),c.add(L);const G=J2();let $=0;const at=((ct=t.config.dummies.fighters)==null?void 0:ct.moveSpeed)??t.config.dummies.moveSpeed;function mt(P,nt){const rt=e.dummies.colors,Mt=rt[nt%rt.length]??"#cccccc";let Et;if(P.weapon){const Ft=e.dummies.fighterColors,Bt=Ft&&Ft.length>0?Ft[(nt-t.config.dummies.count)%Ft.length]:void 0;Et=F2({voxel:e.voxel,colors:Bt?{...e.colors,...Bt}:e.colors,moveSpeed:at,orientation:e.orientation,gait:e.gait,mount:e.weaponMount,lean:e.lean,hurt:e.hurt,animation:e.animation,ik:e.ik,links:e.links,wrist:e.weaponWrist,balance:e.balance})}else{const Ft=p2(e.voxel,e.colors,Mt,P.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);Et={group:Ft.group,update:(Bt,Gt)=>Ft.update(Bt,Gt),boneAtWorld:(Bt,Gt,ie)=>Ft.boneAtWorld(Bt,Gt,ie),dispose:()=>Ft.dispose()}}return Et.group.traverse(Ft=>{Ft.userData.dummyId=P.id}),c.add(Et.group),Et}const ft=t.dummies.map(mt),Dt=ft.map(P=>P.group),j=new YA,F=e.groundRing,Y=e.voxel.bodyWidth,J=hp(Y,F.playerRadiusFactor),K=hp(Y,F.dummyRadiusFactor),st=Y*F.thicknessFactor,Tt=F.arcDeg*Math.PI/180;let Wt=0;const dt=(P,nt,rt)=>Cp(t.boxes,P,nt,rt+.55,0),X=Al({radius:J,thickness:st,arcRad:Tt,edgeFade:F.edgeFade,color:F.playerColor,opacity:F.playerOpacity,y:.028,renderOrder:Xe.ring});X.mesh.name="player-ground-ring",c.add(X.mesh);function H(P){const nt=Al({radius:K,thickness:st,arcRad:Tt,edgeFade:F.edgeFade,color:F.neutralColor,opacity:F.opacity,y:.022,renderOrder:Xe.ring});return nt.mesh.name=`dummy-ground-ring-${P.id}`,c.add(nt.mesh),nt}function kt(P){const nt=Al({radius:K*F.haloRadiusFactor,thickness:st*F.haloThicknessFactor,arcRad:Tt,edgeFade:F.edgeFade,color:F.neutralColor,opacity:0,profile:"glow",y:.019,renderOrder:Xe.ringHalo});return nt.mesh.name=`dummy-ground-halo-${P.id}`,c.add(nt.mesh),nt}function Rt(P){const nt=dp({radius:K*F.warnRadiusFactor,thickness:st*F.warnThicknessFactor,arcRad:Tt,edgeFade:.02,color:F.warnColor,y:.031,renderOrder:Xe.ringWarn});return nt.mesh.name=`dummy-ground-warn-${P.id}`,c.add(nt.mesh),nt}const _t=t.dummies.map(H),vt=t.dummies.map(kt),gt=t.dummies.map(()=>0),Pt=t.dummies.map(()=>0),D=dp({radius:J*F.meterRadiusFactor,thickness:st*F.meterThicknessFactor,arcRad:Tt,edgeFade:.06,color:F.meterColorCharge,y:.03,renderOrder:Xe.ringMeter});D.mesh.name="player-ground-meter",c.add(D.mesh);const A=t.dummies.map(Rt),q=up({color:F.playerColor,y:.042,renderOrder:Xe.groundArea});q.group.name="player-landing-preview",c.add(q.group);const ut=new te,it=new te(F.playerColor),lt=new te(F.neutralColor),Nt=new te(F.lowThreatColor),Ct=new te(F.highThreatColor),wt=new te(F.meterColorCharge),$t=new te(F.meterColorChannel),yt=new te(F.meterColorCooldown),zt=new te(F.warnColor),Z=new _e;c.add(Z);const V=e.projectiles;function pt(){const nt=document.createElement("canvas");nt.width=64,nt.height=64;const rt=nt.getContext("2d");if(rt){const Et=rt.createRadialGradient(32,32,0,32,32,32);Et.addColorStop(0,"rgba(255,255,255,1)"),Et.addColorStop(.28,"rgba(255,255,255,0.72)"),Et.addColorStop(.62,"rgba(255,255,255,0.22)"),Et.addColorStop(1,"rgba(255,255,255,0)"),rt.fillStyle=Et,rt.fillRect(0,0,64,64)}const Mt=new Ih(nt);return Mt.colorSpace=Bn,Mt}function Ht(){const rt=document.createElement("canvas");rt.width=2,rt.height=64;const Mt=rt.getContext("2d");if(Mt){const Ft=Mt.createLinearGradient(0,0,0,64);Ft.addColorStop(0,"rgba(255,255,255,0)"),Ft.addColorStop(.55,"rgba(255,255,255,0.35)"),Ft.addColorStop(1,"rgba(255,255,255,0.95)"),Mt.fillStyle=Ft,Mt.fillRect(0,0,2,64)}const Et=new Ih(rt);return Et.colorSpace=Bn,Et}const Ot=pt(),Lt=Ht(),N=new Mn({color:12577023,transparent:!0,opacity:0,side:We,depthWrite:!1}),bt=new Mn({color:14217983,transparent:!0,opacity:0,side:We,depthWrite:!1,blending:Xi}),et=new _e;et.position.set(0,.95,.72),Z.add(et);const ht=new _e;ht.rotation.x=j2(e.camera.pitchDeg),et.add(ht);const It=new pc(.78,V.slashThickness,6,28,Math.PI*1.15),At=new _e,jt=new me(It,N),se=new me(It,bt);se.scale.setScalar(1.09),El(At,Xe.slash),se.renderOrder=Xe.slash+1,At.add(jt,se),ht.add(At);const oe=new ni(V.arrowWidth,V.arrowWidth,V.arrowLength),ee=new fd(V.arrowHeadSize*.42,V.arrowHeadSize,4);ee.rotateX(Math.PI/2);const ye=new ni(V.arrowWidth*2.6,V.arrowWidth*.4,.1),we=new ko(V.arrowWidth*.45,V.arrowWidth*1.3,V.trailLength,6,1,!0);we.rotateX(-Math.PI/2),we.translate(0,0,-V.trailLength/2);const Qe=Array.from({length:10},()=>{const P=new _e,nt=new Mn({color:V.arrowColor,transparent:!0}),rt=new Mn({color:V.arrowHeadColor,transparent:!0}),Mt=new Dh({map:Ot,color:V.arrowColor,transparent:!0,opacity:.85,blending:Xi,depthWrite:!1}),Et=new Mn({color:V.arrowTrailColor,map:Lt,transparent:!0,opacity:0,blending:Xi,depthWrite:!1,side:We}),Ft=new me(oe,nt),Bt=new me(ee,rt);Bt.position.z=V.arrowLength/2+V.arrowHeadSize*.42;const Gt=new me(ye,rt),ie=new me(ye,rt);Gt.position.z=-V.arrowLength/2+.08,ie.position.z=Gt.position.z,ie.rotation.z=Math.PI/2;const qt=new Uf(Mt);qt.scale.setScalar(V.arrowGlowSize),qt.renderOrder=Xe.projectileGlow;const re=new me(we,Et);return re.renderOrder=Xe.projectileTrail,Ft.renderOrder=Xe.projectile,Bt.renderOrder=Xe.projectile,Gt.renderOrder=Xe.projectile,ie.renderOrder=Xe.projectile,P.add(Ft,Bt,Gt,ie,qt,re),P.visible=!1,c.add(P),{group:P,shaftMat:nt,tipMat:rt,glowMat:Mt,trailMat:Et,glow:qt,trail:re,arrowId:0,bone:null}}),ln=new md(1,0),Pe=new W(V.boltShapeX,V.boltShapeY,V.boltShapeZ),Ee=new Mn({color:V.boltColor,transparent:!0,opacity:.98,depthWrite:!1}),mn=new Dh({map:Ot,color:V.boltGlowColor,transparent:!0,opacity:.45,blending:Xi,depthWrite:!1}),In=new Mn({color:V.boltGlowColor,map:Lt,transparent:!0,opacity:V.trailOpacity,blending:Xi,depthWrite:!1,side:We}),tn=new ko(.5,.03,V.boltTrailScale,6,1,!0);tn.rotateX(-Math.PI/2),tn.translate(0,0,-V.boltTrailScale/2);const zn=Array.from({length:24},()=>{const P=new _e,nt=new me(ln,Ee);nt.scale.copy(Pe);const rt=new Uf(mn);rt.scale.setScalar(V.boltGlowScale),rt.renderOrder=Xe.projectileGlow;const Mt=new me(tn,In);return Mt.renderOrder=Xe.projectileTrail,nt.renderOrder=Xe.projectile,P.add(nt,rt,Mt),P.visible=!1,c.add(P),{group:P,core:nt}}),gn=Array.from({length:6},()=>{const P=up({color:"#9ad0ff",edgeWidthRatio:.038,y:.045,renderOrder:Xe.groundArea});return P.group.visible=!1,c.add(P.group),P}),hn=N2(c,e,t,dt),Ce=ZA(e.camera,e.smartCamera,e.zoom,s/o),ci=t.character.position;Ce.update(ci.x,ci.y,ci.z,1,t.camera);function Li(P){const nt=P.dummies.length;for(;ft.length<nt;){const Mt=ft.length,Et=P.dummies[Mt],Ft=mt(Et,Mt);ft.push(Ft),Dt.push(Ft.group),_t.push(H(Et)),vt.push(kt(Et)),A.push(Rt(Et)),gt.push(0),Pt.push(0)}let rt=!1;for(;ft.length>nt;){rt=!0;const Mt=ft.pop();c.remove(Mt.group),Mt.dispose(),Dt.pop();const Et=_t.pop();c.remove(Et.mesh),Et.dispose();const Ft=vt.pop();c.remove(Ft.mesh),Ft.dispose();const Bt=A.pop();c.remove(Bt.mesh),Bt.dispose(),gt.pop(),Pt.pop()}if(rt)for(let Mt=0;Mt<nt;Mt++){const Et=P.dummies[Mt].id;ft[Mt].group.userData.dummyId!==Et&&ft[Mt].group.traverse(Ft=>{Ft.userData.dummyId=Et})}}function Tn(P,nt){if(Dt.length===0)return 0;const rt=r.domElement.getBoundingClientRect(),Mt=new Vt((P-rt.left)/rt.width*2-1,-((nt-rt.top)/rt.height)*2+1);j.setFromCamera(Mt,Ce.camera);const Et=j.intersectObjects(Dt,!0);for(const Ft of Et){const Bt=Ft.object.userData.dummyId;if(Bt&&Bt>0)return Bt}return 0}function z(P,nt,rt){const Mt=r.domElement.getBoundingClientRect(),Et=new W(P,nt,rt).project(Ce.camera);return{x:Mt.left+(Et.x*.5+.5)*Mt.width,y:Mt.top+(-Et.y*.5+.5)*Mt.height}}let Q=!1;return{balanceDebug(){return R.balanceDebug()},spineDebug(){return R.spineDebug()},gaitDebug(){return R.gaitDebug()},trailDebug(){return U.debug()},stretchDebug(){const P=R.stretch();return{arm:P.arm,leg:P.leg,torso:P.torso,impact:P.impact}},swingDebug(){return R.swingDebug()},stanceDebug(){return R.stanceDebug()},bladeWorld(){return R.weaponBlade()},bladesWorld(){return R.bladesWorld()},slamDebug(){return hn.slamDebug()},yawDebug(){var P;return{target:$,shown:G.value,tauMs:((P=e.renderInterp)==null?void 0:P.yawSmoothMs)??0}},grassDebug(){return T.debug()},breakHits(){return y},destructibleDebug(){return b.debug()},fxDebug(){var P,nt;return{boxOpaque:m.every(rt=>!rt.transparent),boxCount:m.length,orders:{ring:X.mesh.renderOrder,groundFx:hn.groundOrder(),trail:U.object.renderOrder,slash:At.renderOrder,projectile:((nt=(P=Qe[0])==null?void 0:P.group.children[0])==null?void 0:nt.renderOrder)??-1}}},renderPose(){return{x:L.position.x,y:L.position.y,z:L.position.z,bodyYaw:L.rotation.y}},projectPoint(P,nt,rt){return z(P,nt,rt)},setClipT(P){R.setClipT(P)},weaponDebug(){return R.weaponDebug()},gripDebug(){return R.gripDebug()},render(P,nt){var be;Li(P);const rt=P.character,Mt=P.combat,Et=e.hitstop.enabled&&P.combat.hitstop>0,Ft=nt*Math.max(0,Math.min(4,Mt.warp??1));if(Et&&!Q){const Zt=Math.max(0,P.combat.hitstop),Ut=Math.max(0,Math.min(1,Zt/.1));Ce.addShake(.34+Ut*.48);let Qt=null;for(let Ue=0;Ue<P.events.length;Ue++){const an=P.events[Ue];if(an.type==="hit"){Qt=an;break}}Qt&&Ce.addKick(Qt.x-rt.position.x,Qt.z-rt.position.z,.03+Ut*.05)}Q=Et;for(let Zt=0;Zt<P.events.length;Zt++){const Ut=P.events[Zt];if(Ut.type!=="notify")continue;const Qt=Number.isFinite(Ut.value)?Ut.value:0;if(Ut.name==="blade-air"){const Ue=Math.max(0,Math.min(1,Qt));U.pulse((Mt.weapon==="greatsword"?.9:.55)*(.4+.6*Ue))}}L.position.set(rt.position.x,rt.position.y,rt.position.z),$=rt.bodyYaw,L.rotation.y=G.update($,nt,((be=e.renderInterp)==null?void 0:be.yawSmoothMs)??0);const Bt=P.dash.phase==="active"&&P.dash.kind==="roll",Gt=Bt&&P.dash.duration>0?Math.min(1,1-P.dash.timer/P.dash.duration):0;if(B.rotation.x=Bt?Gt*Math.PI*2:0,B.position.y=k-(Bt?.2*Math.sin(Math.PI*Gt):0),Ft>0&&R.update(rt,Mt,P.playerHurt,Ft,P.abilities.channeling,P.time,P.playerLink,P.turnInPlace),U.update(Ft,Ft>0?R.weaponBlade():null,Ft>0&&(Mt.phase==="active"||P.playerLink.phase==="active"||Bt&&P.dash.duration>0)),Ft>0)for(let Zt=0;Zt<ft.length;Zt++)P.dummies[Zt]&&ft[Zt].update(P.dummies[Zt],Ft,P.time);const ie=Ce.camera.position,qt=Math.atan2(ie.x-rt.position.x,ie.z-rt.position.z),re=P.config.gaze.hurtHoldSec,Oe=P.time-P.playerHurt.lastAt,de=re>0&&Oe>=0&&Oe<re?1-Oe/re:0,Yt=H2(P.gaze.active,P.gaze.threat,de,P.time,F);G2(ut,it,Nt,Ct,Yt.level),Wt=Z2(rt.grounded,rt.position.y,Wt),X.mesh.position.set(rt.position.x,Wt+.028,rt.position.z),X.update(Yt.arcRad,Yt.opacity,Yt.scale,ut,qt);const xn=P.config.abilities.arcane,ue=Math.max(1,Math.floor(xn.waves)),Ye=Math.max(1e-4,xn.waveInterval),dn=W2({charging:Mt.charging,charge:Mt.charge,channeling:P.abilities.channeling,fireTimer:P.abilities.fireTimer,fireInterval:Ye,channelProgress:P.abilities.channeling?(P.abilities.waveIndex+(1-Math.min(1,Math.max(0,P.abilities.fireTimer/Ye))))/ue:0,arcaneCooldown:P.abilities.cooldown,arcaneCooldownMax:xn.cooldown,dashCooldown:P.dash.cooldown,dashCooldownMax:P.dash.kind==="blink"?P.config.dash.blinkCooldown:P.config.dash.rollCooldown});D.mesh.position.set(rt.position.x,rt.position.y+.03,rt.position.z),D.set(dn.ratio,dn.source==="none"?0:F.meterOpacity,dn.source==="charge"?wt:dn.source==="channel"?$t:yt,qt);const Te=P.playerLink,An=Te.weapon?P.config.links.moves[Te.weapon]:void 0,xe=Y2(Te.phase,rt.position.x,rt.position.z,Te.facing,Te.travel,(An==null?void 0:An.hit.radius)??.9);q.set(xe.x,xe.z,dt(xe.x,xe.z,rt.position.y)+.042,xe.radius,xe.active?F.landingOpacity:0,P.time);for(let Zt=0;Zt<_t.length;Zt++){const Ut=P.dummies[Zt],Qt=_t[Zt],Ue=vt[Zt],an=A[Zt];if(!Ut){Qt.mesh.visible=!1,Ue.mesh.visible=!1,an.mesh.visible=!1;continue}const xi=P.targeting.hasTarget&&P.targeting.targetId===Ut.id;if(Wx(P,Ut)){const Di=Yx(P,Ut);ut.copy(Nt).lerp(Ct,Di)}else ut.copy(lt);const bn=V2(Ut.attackPhase,Ut.attackPhaseTimer,P.config.dummies.attackWindup);bn.active?(ut.lerp(zt,.5*bn.urgency),an.mesh.position.set(Ut.position.x,Ut.position.y+.031,Ut.position.z),an.set(bn.ratio,F.warnOpacity*(.65+.35*bn.urgency),zt,qt)):an.set(0,0,zt,qt);const Rn=xi?1:0,Sn=Rn>gt[Zt]?F.haloFadeInSec:F.haloFadeOutSec;gt[Zt]=fp(gt[Zt],Rn,nt,Sn);const wn=gt[Zt],Gs=1+.02*wn*Math.sin(P.time*2.2+Ut.id),Yn=F.arcDeg+(F.selectedArcDeg-F.arcDeg)*wn;Qt.mesh.position.set(Ut.position.x,Ut.position.y+.022,Ut.position.z),Qt.update(Yn*Math.PI/180,F.opacity+(F.selectedOpacity-F.opacity)*wn,1+(F.selectedScale-1)*wn*Gs,ut,qt,1+(F.selectedThicknessScale-1)*wn),Pt[Zt]=fp(Pt[Zt],Rn,nt,Rn>Pt[Zt]?F.haloFadeInSec:F.haloFadeOutSec);const ga=Pt[Zt];Ue.mesh.position.set(Ut.position.x,Ut.position.y+.019,Ut.position.z),Ue.update(Yn*Math.PI/180,F.haloOpacity*ga*(.88+.12*Math.sin(P.time*2.2+Ut.id)),F.selectedScale*(.94+.06*ga)*Gs,ut,qt)}Z.position.set(rt.position.x,rt.position.y,rt.position.z),Z.rotation.y=Mt.phase!=="idle"?Mt.attackFacing:rt.bodyYaw,hn.update(P,nt,Zt=>Ce.addShake(Zt));const ce=V.slashEnabled&&Mt.phase==="active"&&Mt.comboIndex>=3;N.opacity=ce?.7:0,bt.opacity=ce?V.slashGlowOpacity:0,ce&&(At.rotation.z=-1.2+Mt.attackProgress*3.2,At.scale.setScalar(.9+Mt.comboIndex*.13));for(let Zt=0;Zt<zn.length;Zt++){const Ut=P.abilities.projectiles[Zt],Qt=zn[Zt];Qt.group.visible=!!Ut,Ut&&(Qt.group.position.set(Ut.x,Ut.y,Ut.z),Qt.group.scale.setScalar(Ut.radius),Qt.group.rotation.set(0,Math.atan2(Ut.dirX,Ut.dirZ),0))}for(let Zt=0;Zt<gn.length;Zt++){const Ut=P.abilities.rings[Zt],Qt=gn[Zt];if(!Ut){Qt.group.visible=!1;continue}const Ue=Math.max(0,Math.min(1,Ut.life/Math.max(Ut.duration,1e-6))),an=$2(Math.max(0,Ut.duration-Ut.life),F.areaExpandSec);Qt.set(Ut.x,Ut.z,dt(Ut.x,Ut.z,rt.position.y)+.045,Ut.radius*an.scale,F.areaOpacity*(.35+.65*Ue)*an.alpha,P.time)}for(let Zt=0;Zt<Qe.length;Zt++){const Ut=P.arrows[Zt],Qt=Qe[Zt];if(!Ut){Qt.group.visible=!1,Qt.bone&&(c.attach(Qt.group),Qt.bone=null),Qt.arrowId=0;continue}const Ue=Ut.stuck&&Ut.stuckDummy>=0;if(Qt.arrowId!==Ut.id){if(Qt.bone&&(c.attach(Qt.group),Qt.bone=null),Qt.arrowId=Ut.id,Qt.group.position.set(Ut.x,Ut.y,Ut.z),Qt.group.rotation.set(Ut.pitch,Ut.yaw,0,"YXZ"),Ue){const xi=ft[Ut.stuckDummy],bn=xi?xi.boneAtWorld(Ut.x,Ut.y,Ut.z):null;bn&&(bn.node.attach(Qt.group),Qt.bone=bn.node)}}else Qt.bone||(Qt.group.position.set(Ut.x,Ut.y,Ut.z),Qt.group.rotation.set(Ut.pitch,Ut.yaw,0,"YXZ"));Qt.group.visible=!0;const an=Ut.stuck?Math.min(1,Ut.rest/.6):1;Qt.shaftMat.opacity=an,Qt.tipMat.opacity=an,Qt.glowMat.opacity=(Ut.stuck?.28:.85)*an,Qt.trailMat.opacity=Ut.stuck?0:V.trailOpacity*an,Qt.trail.visible=!Ut.stuck}if(T.update(P,nt),b.update(P.destructibles),Mt.phase==="active"||P.playerLink.phase==="active"){const Zt=b.computeHits(P.destructibles,R.bladesWorld());for(let Ut=0;Ut<Zt.length;Ut++){let Qt=!1;for(let Ue=0;Ue<y.length;Ue++)if(y[Ue].id===Zt[Ut].id){Qt=!0;break}Qt||y.push(Zt[Ut])}}else y=[];Ce.update(rt.position.x,rt.position.y,rt.position.z,nt,P.camera),r.render(c,Ce.camera)},resize(){const P=Math.max(1,n.clientWidth),nt=Math.max(1,n.clientHeight);r.setSize(P,nt,!1),Ce.resize(P/nt)},getGroundBasis(){return Ce.getGroundBasis()},setCollidersVisible(P){for(const nt of m)nt.opacity=P?.3:1,nt.wireframe=P,nt.transparent=P,nt.depthWrite=!P,nt.needsUpdate=!0},setGridVisible(P){S.visible=P},setLabVisible(P){E.setVisible(P)},setLabLabelsVisible(P){E.setLabelsVisible(P)},snapCamera(P,nt,rt){Ce.snap(P,nt,rt)},setZoom(P){Ce.setZoom(P)},setBodyType(P){var rt;const nt=(rt=e.bodyTypes)==null?void 0:rt[P];return!nt||P===I||(B.remove(R.group),R.dispose(),R=C(nt),R.group.position.y=-k,B.add(R.group),U.reset(),I=P,t.config.characterHeight=nt.height,nt.radius!==void 0&&(t.config.characterRadius=nt.radius)),I},bodyTypes(){return{id:I,ids:Object.keys(e.bodyTypes??{})}},pickDummy:Tn,dummyRenderCount:()=>ft.length,projectToScreen:z,dummyRigDebug(P){const nt=ft[P-1];return nt!=null&&nt.debug?nt.debug():null},diagnostics(){const P=g0(e.camera.pitchDeg),nt=q2(P,Z.rotation.y);return{lean:R.lean(),slashNormal:nt,arrowForward:R.arrowDirection(),gait:{hipYaw:R.hipYaw(),gaitYaw:R.gaitYaw()},attackBlend:R.attackBlend(),attackWeights:R.attackWeights(),landing:R.landing(),hurt:R.hurt(),ik:R.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:B.rotation.x,activeRings:hn.activeDash(),lastKind:hn.dashKind()},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...Ce.smart(),shake:Ce.shakeLevel(),kick:Ce.kickLevel(),kickCount:Ce.kickCount()}}},dispose(){R.dispose(),E.dispose(),T.dispose(),b.dispose();for(const P of ft)P.dispose();X.dispose();for(const P of _t)P.dispose();for(const P of vt)P.dispose();D.dispose(),U.dispose();for(const P of A)P.dispose();q.dispose(),It.dispose(),N.dispose(),bt.dispose(),ln.dispose(),Ee.dispose(),mn.dispose(),In.dispose(),tn.dispose();for(const P of gn)P.dispose();oe.dispose(),ee.dispose(),ye.dispose(),we.dispose();for(const P of Qe)P.shaftMat.dispose(),P.tipMat.dispose(),P.glowMat.dispose(),P.trailMat.dispose();Ot.dispose(),Lt.dispose(),hn.dispose(),v.traverse(P=>{P instanceof me&&P.geometry.dispose()}),r.dispose(),r.domElement.remove()}}}async function uR(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function fR(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),a=document.createElement("a");a.href=i,a.download=n,a.rel="noopener",document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function pR(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=_=>e.querySelector(`#${_}`),a=i("diag-status"),s=i("diag-text"),o=i("diag-copy"),r=i("diag-json"),c=i("diag-clear"),l=i("diag-toggle"),d=i("diag-close"),u=i("diag-mask");let h=!1,f=!0,m=0;function v(){const _=n.status();a.textContent=_.enabled?`已记录 ${_.durationS.toFixed(1)}s · ${_.frames} 帧 · 事件 ${_.events} · 异常 ${_.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",l.textContent=_.enabled?"暂停记录":"继续记录"}function g(_){h=_,e.hidden=!_,_?v():s.hidden=!0}function p(_){o.textContent=_,window.clearTimeout(m),m=window.setTimeout(()=>{o.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",_=>{_.preventDefault(),_.stopPropagation(),g(!h)}),d.addEventListener("click",()=>g(!1)),u.addEventListener("click",()=>g(!1)),o.addEventListener("click",()=>{const _=n.summary();uR(_).then(x=>{x?(p("已复制 ✓"),s.hidden=!0):(s.value=_,s.hidden=!1,s.focus(),s.select(),p("请长按全选复制"))})}),r.addEventListener("click",()=>{const _=n.dump(),x=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);fR(`harness-${_.meta.version}-${x}.json`,JSON.stringify(_)),p("已导出")}),c.addEventListener("click",()=>{n.clear(),s.hidden=!0,v(),p("已清空")}),l.addEventListener("click",()=>{f=!f,n.setEnabled(f),v()}),{tick(){const _=n.status();t==null||t.classList.toggle("is-alert",_.alert),h&&v()},isOpen:()=>h,close:()=>g(!1)}}const mR={intents:{...xp},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function gR(){var dt;const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=dv(nm,Lr),i=dR(n,e,vn,Lr.stations,Lr.slabs),a=xv(e),s=G_(t),o=X_(t),r=document.getElementById("version-badge");r&&(r.textContent="v0.9.69 · 11-09 19:23 · 诊断");const c=X=>String(X).padStart(2,"0"),l=new Date,d=$v({meta:{version:"v0.9.69",buildTime:"11-09 19:23",startedAt:`${c(l.getMonth()+1)}-${c(l.getDate())} ${c(l.getHours())}:${c(l.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),u=pR(d,r),h=O_({deadZone:()=>vn.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0,phaseSource:()=>i.gaitDebug().phase});document.addEventListener("visibilitychange",()=>{document.hidden&&d.suspend(800)});const f={timeScale:1,paused:!1,showColliders:vn.showColliders,showGrid:vn.showGrid,showLab:vn.lab.enabled,showLabLabels:vn.lab.showLabels};let m=1,v=!1;const g=Fv({maxRadiusPx:()=>vn.joystick.maxRadiusPx,deadZone:vn.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>vn.zoom}),p=Array.from(document.querySelectorAll(".wp[data-weapon]"));let _=e.combat.weapon;function x(X){if(X===_)return;_=X;const H=fa.indexOf(X)+1;for(const kt of p)kt.classList.toggle("is-active",Number(kt.dataset.weapon)===H);E.refreshWeapon()}let M=mR,S=0;const w=()=>{m=1,i.setZoom(1)},E=v_(e,vn,f,{singleStep:()=>a.singleStep(M.intents),reset:()=>{m=1,a.singleStep({...xp,resetPressed:!0})},resetZoom:w,onToggleColliders:X=>i.setCollidersVisible(X),onToggleGrid:X=>i.setGridVisible(X),onToggleLab:X=>i.setLabVisible(X),onToggleLabLabels:X=>i.setLabLabelsVisible(X),setFighterMode:X=>{for(const H of e.dummies)H.weapon&&(H.mode=X,H.attackPhase="idle",H.attackPhaseTimer=0,H.attackProgress=0,H.attackCooldown=0,H.combat&&(H.combat.phase="idle",H.combat.attackProgress=0,H.combat.comboIndex=0))}}),T=__({stations:Gi.stations,plots:_u,world:e,view:i,onResetZoom:w,onPlotTest:X=>{Ol(e);const H=Px(e,X);return L(`已在「${X.name}」生成 ${H} 人 · 点「清除测试单位」回基线`),H},onClearTestUnits:()=>{const X=Ol(e);return L(X>0?`已清除 ${X} 个测试单位`:"当前没有测试单位"),X}});o.register({motion:h,debug:E.gui}),window.addEventListener("resize",()=>i.resize());const b=i.bodyTypes().ids,y=document.getElementById("body-toggle"),C=X=>{var H,kt;return((kt=(H=vn.bodyTypes)==null?void 0:H[X])==null?void 0:kt.name)??X},I=()=>{if(!y)return;const X=i.bodyTypes().id;y.textContent=`体型 ${C(X)}`,y.setAttribute("aria-label",`切换体型（当前：${C(X)}，快捷键 B）`)},R=document.createElement("div");R.style.cssText=["position:fixed","left:50%","top:14px","transform:translateX(-50%)","padding:6px 14px","border-radius:999px","font:600 13px/1.4 system-ui,sans-serif","color:#0b1620","background:#8fd0ff","box-shadow:0 4px 16px rgba(0,0,0,.35)","opacity:0","transition:opacity .18s","pointer-events:none","z-index:99"].join(";"),document.body.appendChild(R);let U=0;const L=X=>{R.textContent=X,R.style.opacity="1",window.clearTimeout(U),U=window.setTimeout(()=>{R.style.opacity="0"},1600)},k=()=>{if(b.length<2){L("只有一个体型预设");return}const X=i.bodyTypes().id,H=Math.max(0,b.indexOf(X)),kt=i.setBodyType(b[(H+1)%b.length]);I(),L(`体型：${C(kt)}（B / 顶部胶囊切换）`)};I(),y==null||y.addEventListener("click",k);const B=document.getElementById("wind-toggle"),G=()=>{var X;return(X=e.config.grass)==null?void 0:X.wind},$=()=>{var H;if(!B)return;const X=!!((H=G())!=null&&H.enabled);B.textContent=`风：${X?"开":"关"}`,B.classList.toggle("is-off",!X),B.setAttribute("aria-label",`${X?"关闭":"开启"}风吹麦浪（当前${X?"开启":"关闭"}，快捷键 G）`)},at=()=>{const X=G();if(!X){L("本场景未启用草块");return}X.enabled=!X.enabled,$(),L(`风吹麦浪：${X.enabled?"开":"关"}（G 切换）`)};$(),B==null||B.addEventListener("click",at),window.addEventListener("keydown",X=>{X.repeat||(X.code==="KeyB"?k():X.code==="KeyG"&&at())}),window.__harness={world:e,view:i,clock:a,input:g,viewConfig:vn,debug:f,getUserZoom:()=>m,getGestures:()=>M.gestures,getLastGesture:()=>M.lastGesture,telemetry:d,telemetrySummary:()=>d.summary(),dirDebug:h.dirDebug,dirAngles:()=>h.dirDebug.last(),motionDebug:h,speedDebug:()=>h.last(),speedSamples:()=>h.samples(),gaitDebug:()=>i.gaitDebug(),dummyRigDebug:X=>i.dummyRigDebug(X),swingDebug:()=>i.swingDebug(),stanceDebug:()=>i.stanceDebug(),balanceDebug:()=>i.balanceDebug(),spineDebug:()=>i.spineDebug(),interpDebug:()=>({alpha:J,applied:K,enabled:j,skip:st}),renderPose:()=>i.renderPose(),yawDebug:()=>i.yawDebug(),slamDebug:()=>i.slamDebug(),fxDebug:()=>i.fxDebug(),grassDebug:()=>i.grassDebug(),breakDebug:()=>({version:"v0.9.69",count:e.destructibles.length,broken:e.destructibles.filter(X=>X.broken!==0).length,cuts:e.destructibles.map(X=>({id:X.id,kind:X.kind,broken:X.broken,cutU:X.cutU,theta:X.theta,nx:X.nx,ny:X.ny,nz:X.nz,fall:X.fall,height:X.height})),rendered:i.destructibleDebug()}),breakTest:(X,H,kt=1,Rt=0,_t=0)=>cv(e,X,H,kt,Rt,_t),resetBreaks:()=>($p(e),e.destructibles.length),breakHits:()=>i.breakHits(),windDebug:()=>{var H;const X=i.grassDebug().wind;return{configured:!!((H=G())!=null&&H.enabled),rendered:X.enabled,time:X.time,gust:X.gust}},setWind:X=>{const H=G();return H?(H.enabled=!!X,$(),H.enabled):!1},setRenderInterp:X=>(j=!!X,j),renderHold:()=>v,trailDebug:()=>i.trailDebug(),bladeWorld:()=>i.bladeWorld(),projectPoint:(X,H,kt)=>i.projectPoint(X,H,kt),setBodyType:X=>{const H=i.setBodyType(X);return I(),H},bodyTypes:()=>i.bodyTypes(),bladesWorld:()=>i.bladesWorld(),clipLab:{clips:()=>{var X;return Object.keys(((X=vn.animation.swing)==null?void 0:X.clips)??{})},preview:X=>{const H=e.combat,kt={...H};H.weapon=X.weapon,H.phase="active",H.comboIndex=Math.max(1,Math.min(3,Math.floor(X.comboIndex))),H.attackProgress=Math.max(0,Math.min(1,X.progress)),H.attackFacing=e.character.bodyYaw,i.setClipT(typeof X.t=="number"?X.t:null);const Rt=Math.max(1,Math.min(30,Math.floor(X.warm??12)));v=!0;for(let _t=0;_t<Rt;_t++)i.render(e,1/60);return i.setClipT(null),Object.assign(H,kt),{...i.swingDebug(),blade:i.bladeWorld(),blades:i.bladesWorld()}},face:X=>{e.character.bodyYaw=X},zoom:X=>{m=vu(X,1,vn.zoom.min,vn.zoom.max),i.setZoom(m)},release:()=>{v=!1}},weaponDebug:()=>i.weaponDebug(),gripDebug:()=>i.gripDebug(),plotDebug:()=>({version:"v0.9.69",count:Gi.plots.length,diagnostics:Gi.diagnostics,testUnits:Cx(e),dummies:e.dummies.length,rendered:i.dummyRenderCount(),bounds:Gi.bounds,worldBounds:e.config.worldBounds,slabs:Gi.slabs.map(X=>({plotId:X.plotId,cell:X.cell,span:X.span,rect:[X.minX,X.maxX,X.minZ,X.maxZ],top:X.top})),plots:Gi.plots.map(X=>({id:X.id,index:X.index,placement:X.placement,slot:X.slot,cell:X.cell,span:X.span,centerX:X.centerX,centerZ:X.centerZ,spawnX:X.station.spawnX,spawnZ:X.station.spawnZ,slab:[X.slab.minX,X.slab.maxX,X.slab.minZ,X.slab.maxZ],hasTest:!!X.testSpawn}))}),spawnAt:X=>T.spawnAt(X),clearSpawned:()=>T.clearSpawned(),lab:{stations:Gi.stations,plots:_u,goto:X=>T.goto(X),current:()=>T.current(),recall:()=>T.recall(),spawnAt:X=>T.spawnAt(X),clearSpawned:()=>T.clearSpawned()}};let mt=performance.now(),ft=60,Dt=0,j=((dt=vn.renderInterp)==null?void 0:dt.enabled)??!0,F=xu(e),Y=null,J=1,K=!1,st="";function Tt(X){const H=j&&!f.paused&&f.timeScale>0;if(K=!1,st="",!H)return st="off",J=1,e;if(!Y)return st="noprev",J=1,e;if(!yv(Y,F))return st="key",J=1,e;const kt=a.alpha;return J=kt,kt>=.999?(st="alpha",e):(K=!0,_v(e,Mv(Y,F,kt)))}function Wt(X){const H=Math.min((X-mt)/1e3,.1);mt=X,H>0&&(ft=ft*.9+1/H*.1);const kt=g.sample();kt.intents.resetPressed&&(m=1),m=vu(m,kt.zoomScale,vn.zoom.min,vn.zoom.max),i.setZoom(m);let Rt=kt.intents.dummyClickId;if(kt.tap){const gt=i.pickDummy(kt.tap.x,kt.tap.y);gt>0&&(Rt=gt)}Rt>0&&(S=Rt),M={...kt,intents:{...kt.intents,dummyClickId:S,breakHits:i.breakHits()}};const _t=a.frame(H,M.intents,f.timeScale,f.paused,()=>{const gt=e.events;for(let Pt=0;Pt<gt.length;Pt++)d.event(gt[Pt],e.time);Y=F,F=xu(e)});_t>0&&(S=0),d.sample(e,M,H*1e3,_t);for(const gt of M.gestures)d.gesture(gt);X-Dt>250&&(Dt=X,u.tick()),x(e.combat.weapon),v||i.render(Tt(),H),T.tick(),h.update(e,M,i.getGroundBasis());const vt=i.diagnostics();s.update(e,ft,_t,M,f,{attackBlend:vt.attackBlend,attackWeights:vt.attackWeights,landing:vt.landing,hurt:vt.hurt,ik:vt.ik,zoom:vt.camera.zoom},o.hudCompact()),requestAnimationFrame(Wt)}requestAnimationFrame(Wt)}gR();

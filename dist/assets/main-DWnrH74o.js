(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=e(a);fetch(a.href,s)}})();const _a=["sword-shield","dual-swords","greatsword","staff","bow"],dg=["wander","follow","keep-distance","attack","idle"],_p=["spar","wander","follow","keep-distance","attack","idle"],bp={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},jr=1e-6;function zo(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>jr?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>jr?Math.atan2(t.moveX,t.moveZ):n.character.facing}function ug(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>jr){const a=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/a,z:t.aimZ/a}}const e=Math.hypot(t.moveX,t.moveZ);if(e>jr)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const Ze=1e-6,ga=Math.PI/180,Vh=-1e9;function Sp(){return{type:"none",lastAt:Vh,timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function To(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function qd(n,t,e,i,a){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=a,n.knockX=0,n.knockZ=0}function Wh(n,t,e){var l,h;const i=e.duration>0?e.duration:fc(n,e.type);if(t.kind==="player"){const u=n.playerHurt;if(qd(u,e.type,i,e.dirX,e.dirZ),u.lastAt=n.time,!n.config.hits.noDamageToPlayer&&e.knockback>Ze){const d=e.knockback*n.config.hits.knockbackDecay;u.knockX=e.dirX*d,u.knockZ=e.dirZ*d}To(n,"player-hurt",e.sourceId??0,n.character.position);return}const a=n.dummies[t.index];if(!a)return;if(qd(a.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>Ze){const u=e.knockback*n.config.hits.knockbackDecay;a.hurt.knockX=e.dirX*u,a.hurt.knockZ=e.dirZ*u}n.hitCount+=1,To(n,"hit",a.id,a.position);const s=n.config.hits.hitstop;let o=((l=n.config.hits.hitstopByWeapon)==null?void 0:l[n.combat.weapon])??1;const r=n.config.hits.hitstopComboFalloff;if(r&&r.length>0){const u=Math.max(0,Math.min(r.length-1,n.combat.comboIndex-1));o*=Math.max(0,r[u])}o*=Math.max(0,e.holdMul??1);const c=s&&e.type!=="none"?(s[e.type]??0)*Math.max(0,o):0;c>0&&n.combat.hitstop<c&&(n.combat.hitstop=c,n.combat.warpPhase=1,n.combat.warp=(h=n.config.hits.hitstopWarp)!=null&&h.enabled?Math.max(0,Math.min(1,n.config.hits.hitstopWarp.holdRate)):0,To(n,"hitstop",c,a.position))}function Yo(n,t,e){Wh(n,{kind:"dummy",index:t},e)}function fg(n,t){const e=[n.playerHurt];for(const a of n.dummies)e.push(a.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const a of e)a.timer>0&&(a.timer=Math.max(0,a.timer-t),a.timer===0&&(a.type="none",a.knockX=0,a.knockZ=0)),(a.knockX!==0||a.knockZ!==0)&&(a.knockX*=i,a.knockZ*=i,Math.abs(a.knockX)<1e-4&&(a.knockX=0),Math.abs(a.knockZ)<1e-4&&(a.knockZ=0))}function fc(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function qr(n,t){if(n.length===0)return 0;if(t<=n[0][0])return n[0][1];for(let e=1;e<n.length;e++){const[i,a]=n[e];if(t<=i){const[s,o]=n[e-1],r=i>s?(t-s)/(i-s):1;return o+(a-o)*r}}return n[n.length-1][1]}function wp(n){let t=n;for(;t>180;)t-=360;for(;t<-180;)t+=360;return t}function Ep(n){var v,g;const t=n.combat,e=n.character.position,i={active:!1,x:e.x,z:e.z,facing:t.attackFacing,fx:Math.sin(t.attackFacing),fz:Math.cos(t.attackFacing),reach:0,cosArc:1,sweepActive:!1,sweepLo:0,sweepHi:0,slamRadius:0,slamX:e.x,slamZ:e.z};if(t.phase!=="active"||t.weapon==="bow")return i;const a=n.config.hits,s=n.config.combat.weapons[t.weapon],o=s==null?void 0:s.hitWindow,r=o?Math.min(1,Math.max(0,o.start)):0,c=o?Math.min(1,Math.max(r,o.end)):1,l=t.timings.active,h=l>Ze?Math.min(1,Math.max(0,t.phaseTimer/l)):1;if(h<r-Ze||h>c+Ze)return i;i.active=!0,i.reach=a.reach[t.weapon]??0,i.cosArc=Math.cos(Math.min(90,Math.max(0,a.arcDeg))*ga);const u=s==null?void 0:s.hitSweep,d=((v=u==null?void 0:u.byCombo)==null?void 0:v[String(t.comboIndex)])??((g=u==null?void 0:u.byCombo)==null?void 0:g["1"]),f=(u==null?void 0:u.tolDeg)??10;if(d){if(typeof d.stabU=="number"){if(h<d.stabU)return i.active=!1,i}else if(d.pts&&d.pts.length>=2){const p=qr(d.pts,0),_=qr(d.pts,h);i.sweepActive=!0,i.sweepLo=Math.min(p,_)-f,i.sweepHi=Math.max(p,_)+f}}const m=s==null?void 0:s.groundSlam;return m&&h>=m.slamU-Ze&&t.slamAttackId===t.attackId&&(i.slamRadius=Math.max(0,m.radius),i.slamX=e.x+i.fx*Math.min(i.slamRadius*.25,.5),i.slamZ=e.z+i.fz*Math.min(i.slamRadius*.25,.5)),i}function pg(n,t,e,i){if(!n.active)return!1;const a=t-n.x,s=e-n.z,o=Math.sqrt(a*a+s*s);if(o>n.reach+i||o>Ze&&(a*n.fx+s*n.fz)/o<n.cosArc)return!1;if(n.sweepActive){const r=wp(Math.atan2(a,s)/ga-n.facing/ga);if(r<n.sweepLo||r>n.sweepHi)return!1}return!0}function mg(n,t,e,i){if(n.slamRadius<=0)return!1;const a=t-n.slamX,s=e-n.slamZ;return a*a+s*s<=(n.slamRadius+i)*(n.slamRadius+i)}function gg(n){var w,E;const t=n.combat,e=n.config.hits,i=n.character.position;if(t.weapon==="bow")return;const a=n.config.combat.weapons[t.weapon],s=a==null?void 0:a.hitWindow,o=s?Math.min(1,Math.max(0,s.start)):0,r=s?Math.min(1,Math.max(o,s.end)):1,c=t.timings.active,l=c>Ze?Math.min(1,Math.max(0,t.phaseTimer/c)):1;if(l<o-Ze||l>r+Ze)return;const h=e.reach[t.weapon]??0,u=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*ga),d=Math.sin(t.attackFacing),f=Math.cos(t.attackFacing),m=n.config.dummies.radius,v=n.config.targeting.idealRange,g=a==null?void 0:a.hitSweep,p=((w=g==null?void 0:g.byCombo)==null?void 0:w[String(t.comboIndex)])??((E=g==null?void 0:g.byCombo)==null?void 0:E["1"]),_=(g==null?void 0:g.tolDeg)??10;let x=0,y=0,S=!1;if(p){if(typeof p.stabU=="number"){if(l<p.stabU)return}else if(p.pts&&p.pts.length>=2){const A=qr(p.pts,0),b=qr(p.pts,l);x=Math.min(A,b)-_,y=Math.max(A,b)+_,S=!0}}for(const A of n.dummies){if(t.hitIds.indexOf(A.id)>=0)continue;const b=A.position.x-i.x,M=A.position.z-i.z,P=Math.hypot(b,M);if(P>h+m)continue;const k=P>Ze?b/P:d,D=P>Ze?M/P:f;if(P>Ze&&(b*d+M*f)/P<u)continue;if(S){const G=wp(Math.atan2(b,M)/ga-t.attackFacing/ga);if(G<x||G>y)continue}let z="light";t.weapon==="greatsword"?z="knock":t.comboIndex>=3&&(z="heavy");const C=e.knockback[t.weapon]??0;let T=P;C>0&&(T=Math.max(P+C,v));const U=Math.max(0,T-P);Yo(n,n.dummies.indexOf(A),{type:z,duration:fc(n,z),dirX:k,dirZ:D,knockback:U}),t.hitIds.push(A.id)}}function xg(n){const t=n.combat,e=n.config.combat.weapons[t.weapon],i=e==null?void 0:e.groundSlam;if(!i||t.slamAttackId===t.attackId)return;const a=t.timings.active;if((a>Ze?Math.min(1,Math.max(0,t.phaseTimer/a)):1)<i.slamU-Ze)return;t.slamAttackId=t.attackId;const o=n.config.hits,r=n.character.position,c=Math.sin(t.attackFacing),l=Math.cos(t.attackFacing),h=n.config.dummies.radius,u=Math.max(0,i.radius),d=i.onlyUnhit!==!1,f=i.type??(t.weapon==="greatsword"?"knock":"heavy"),m=i.knockback??o.knockback[t.weapon]??0,v=n.config.targeting.idealRange,g=i.holdMul??1.6;for(let p=0;p<n.dummies.length;p++){const _=n.dummies[p];if(d&&t.hitIds.indexOf(_.id)>=0)continue;const x=_.position.x-r.x,y=_.position.z-r.z,S=Math.hypot(x,y);if(S>u+h)continue;const w=S>Ze?x/S:c,E=S>Ze?y/S:l,A=m>0?Math.max(S+m,v):S,b=Math.max(0,A-S);Yo(n,p,{type:f,duration:fc(n,f),dirX:w,dirZ:E,knockback:b,holdMul:g}),t.hitIds.push(_.id)}To(n,"ground-slam",u,{x:r.x+c*Math.min(u*.25,.5),y:r.y,z:r.z+l*Math.min(u*.25,.5)})}function vg(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const a=i.weapon===""?void 0:e.moves[i.weapon];if(!a||!a.enabled||!n.modules.hits||!n.modules.dummies)return;const s=a.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(s.pulseInterval,0);const o=n.character.position,r=i.fromX,c=i.fromZ,l=o.x,h=o.z,u=l-r,d=h-c,f=u*u+d*d,m=Math.sin(i.facing),v=Math.cos(i.facing),g=Math.cos(Kd(s.arcDeg,0,180)*ga),p=n.config.dummies.radius;for(let _=0;_<n.dummies.length;_++){const x=n.dummies[_];if(i.hitIds.indexOf(x.id)>=0)continue;const y=f>Ze?Kd(((x.position.x-r)*u+(x.position.z-c)*d)/f,0,1):0,S=r+u*y,w=c+d*y,E=Math.hypot(x.position.x-S,x.position.z-w);let A=!1;if(s.shape==="circle")A=E<=s.radius+p;else if(s.shape==="capsule")A=E<=Math.max(s.radius,s.width)+p;else{const z=x.position.x-l,C=x.position.z-h,T=Math.hypot(z,C),U=T>Ze?(z*m+C*v)/T>=g:!0;A=T<=s.radius+p&&U||E<=s.width+p}if(!A)continue;const b=x.position.x-r,M=x.position.z-c,P=Math.hypot(b,M);if(P>Ze&&(b*m+M*v)/P<Math.cos(Math.max(s.arcDeg,90)*ga))continue;const k=P>Ze?b/P:m,D=P>Ze?M/P:v;Wh(n,{kind:"dummy",index:_},{type:s.type,duration:s.duration,dirX:k,dirZ:D,knockback:s.knockback}),i.hitIds.push(x.id),To(n,"link-hit",x.id,x.position)}}function yg(n){const t=n.config.hits,e=n.config.dummies.fighters,i=n.character.position;for(const a of n.events){if(a.type!=="dummy-hit")continue;const s=n.dummies[a.value-1];if(!s)continue;const o=s.weapon?t.reach[s.weapon]??t.dummyReach:t.dummyReach,r=i.x-s.position.x,c=i.z-s.position.z,l=Math.hypot(r,c);if(l>o)continue;const h=l>Ze?r/l:0,u=l>Ze?c/l:1,f=(s.weapon?Math.max(t.knockback[s.weapon]??0,t.dummyKnockback):t.dummyKnockback)*(s.weapon?(e==null?void 0:e.knockbackScale)??1:1),v=s.weapon==="greatsword"&&s.attackComboLeft<=0?"knock":"light";Wh(n,{kind:"player"},{type:v,duration:fc(n,v),dirX:h,dirZ:u,knockback:f,sourceId:s.id})}}function Mg(n,t){n.modules.hits&&(n.combat.phase==="active"&&(gg(n),xg(n)),vg(n,t),yg(n))}function Kd(n,t,e){return n<t?t:n>e?e:n}const Tp=Math.PI/180,Yh=1e-6;function _g(){return{phase:"idle",fromYaw:0,targetYaw:0,dir:1,progress:0,armTime:0}}function Kr(n){const t=n.turnInPlace;t.phase="idle",t.fromYaw=0,t.targetYaw=0,t.dir=1,t.progress=0,t.armTime=0}function Ap(n,t,e){return n.modules.gaze&&n.gaze.active?n.gaze.centroidYaw:t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Yh?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:null}function Rp(n,t,e){const i=n.character,a=Math.hypot(i.velocity.x,i.velocity.z),s=Math.hypot(t.moveX,t.moveZ),o=n.combat.phase!=="idle"||n.combat.charging||n.abilities.channeling||n.dash.phase!=="idle"||n.playerLink.phase!=="idle"||n.playerHurt.type!=="none"||t.attackPressed||t.attackHeld||t.skill2Pressed||t.sprintPressed||t.jumpPressed;return i.grounded&&a<=Math.max(0,e.idleSpeedRatio)*Math.max(n.config.moveSpeed,Yh)&&s<=Math.max(0,e.inputDeadZone)&&!o}function bg(n){const t=n<0?0:n>1?1:n;return t*t*(3-2*t)}function Sg(n,t){const e=n.config.turnInPlace;if(!e.enabled||!n.modules.turnInPlace||!Rp(n,t,e))return!1;const i=Ap(n,t,e.lookRange);if(i===null)return!1;const a=Ge(i-n.character.bodyYaw);return Math.abs(a)>Pp(n,e)}function Pp(n,t){const i=n.modules.gaze&&n.gaze.active?Math.max(t.triggerDeg,t.gazeTriggerDeg):t.triggerDeg;return Math.max(0,i)*Tp}function wg(n,t,e){const i=n.turnInPlace,a=n.config.turnInPlace;if(!a.enabled||!n.modules.turnInPlace||!Rp(n,e,a)){Kr(n);return}const s=Ap(n,e,a.lookRange);if(s===null){Kr(n);return}const o=n.character,r=Ge(s-o.bodyYaw),c=Math.abs(r),l=Pp(n,a),h=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Yh;if(i.phase==="idle"&&(i.armTime=c>=l?i.armTime+t:0,c>l&&i.armTime>=Math.max(0,a.armSec))){i.phase="active",i.fromYaw=o.bodyYaw,i.dir=r>=0?1:-1;const u=Math.min(c,Math.max(0,a.settleDeg)*Tp);i.targetYaw=Ge(o.bodyYaw+i.dir*(c-u)),i.progress=0}if(i.phase==="active"){const u=Math.max(a.durationSec,n.config.fixedDt);i.progress=Math.min(1,i.progress+t/u);const d=Ge(i.targetYaw-i.fromYaw);o.bodyYaw=Ge(i.fromYaw+d*bg(i.progress)),h||(o.facing=o.bodyYaw),i.progress>=1&&(i.phase="idle",i.progress=0,i.armTime=0)}}const xa=1e-6;function Ge(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Qo(n,t,e,i){const a=Ge(t-n);return n+a*(1-Math.exp(-Math.max(e,xa)*i))}function tr(n,t,e,i,a){const o=Ge(t-n)*(1-Math.exp(-Math.max(e,xa)*a)),r=Math.max(i,0)*a;return r<=xa?n:n+Cs(o,-r,r)}function Jd(n,t,e,i,a){const s=(t-n)*(1-Math.exp(-Math.max(e,xa)*a)),o=Math.max(i,0)*a;return o<=xa?n+s:n+Cs(s,-o,o)}function Cs(n,t,e){return n<t?t:n>e?e:n}function Qd(n,t,e,i){const a=Ge(t-n),s=Math.abs(a);return s<=i||s<=e?t:Ge(n+Math.sign(a)*Math.max(e,0))}function Eg(n,t,e){const i=n.character,a=n.config.orientation,s=n.combat,o=n.modules.gaze&&n.gaze.active,r=n.abilities.channeling,c=s.phase!=="idle"||s.charging||r||n.dash.phase!=="idle",l=o&&!c,h=Math.hypot(e.moveX,e.moveZ),u=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>xa,d=s.charging&&s.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(s.phase!=="idle")i.facing=s.attackFacing;else if(r)i.facing=zo(n,e);else if(l)i.facing=tr(i.facing,n.gaze.centroidYaw,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t);else if(u)i.facing=zo(n,e);else if(d)i.facing=n.targeting.targetYaw;else if(h>Math.max(a.facingDeadZone,xa)){const M=Math.atan2(e.moveX,e.moveZ),P=a.facingTurnRate*Math.PI/180*t,k=a.facingSnapDeg*Math.PI/180;if(h>=.35)i.facing=Qd(i.facing,M,P,k);else if(h>=a.facingMinMagnitude&&Math.abs(Ge(M-i.facing))>a.facingDeadbandDeg*Math.PI/180){const z=Qo(i.facing,M,a.facingSmoothRate,t);i.facing=Qd(i.facing,z,P,0)}}const f=i.velocity;Math.hypot(f.x,f.z)>.15&&(i.moveYaw=Math.atan2(f.x,f.z));const m=l?n.gaze.centroidYaw:i.facing;n.turnInPlace.phase==="active"||Sg(n,e)||(l?i.bodyYaw=tr(i.bodyYaw,m,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t):i.bodyYaw=Qo(i.bodyYaw,m,a.bodyTurnRate,t));const g=n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;let p=i.facing;if(o?p=l?n.gaze.mainYaw:i.facing:u?p=Math.atan2(e.aimX,e.aimZ):g&&(p=n.targeting.targetYaw),!o){const M=n.config.gaze.headLookLimitDeg*Math.PI/180;Math.abs(Ge(p-i.bodyYaw))>M&&(p=i.moveYaw)}const _=o||u||g,x=a.maxHeadTurnDeg*Math.PI/180;let y;if(_){const M=l?n.config.gaze.headTurnRate:a.headTurnRate;y=l?tr(i.headYaw,p,M,n.config.gaze.maxHeadSpeedDeg*Math.PI/180,t):Qo(i.headYaw,p,M,t)}else{const M=Ge(i.headYaw-i.bodyYaw),P=Ge(p-i.bodyYaw),k=Math.abs(P)<Math.abs(M)-1e-9,D=k?n.config.gaze.headReturnRate:a.headTurnRate,z=k?n.config.gaze.headReturnSpeedDeg*Math.PI/180:Number.POSITIVE_INFINITY,C=Number.isFinite(z)?tr(M,P,D,z,t):Qo(M,P,D,t);y=i.bodyYaw+C}const S=Ge(y-i.bodyYaw);S>x?y=i.bodyYaw+x:S<-x&&(y=i.bodyYaw-x),i.headYaw=y;const w=n.config.gaze;let E=0;if(l)E=n.gaze.mainPitch;else if(n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget){const M=n.dummies[n.targeting.targetId-1];if(M){const P=i.position.y+n.config.characterHeight*Cs(w.eyeHeightRatio,0,1),k=M.position.y+n.config.dummies.height*Cs(w.aimHeightRatio,0,1),D=Math.hypot(M.position.x-i.position.x,M.position.z-i.position.z);E=Math.atan2(k-P,Math.max(xa,D))}}const A=Math.max(0,w.maxHeadPitchDeg)*Math.PI/180;E=Cs(E,-A,A);const b=_?w.headPitchRate:Math.min(w.headPitchRate,w.headReturnRate);i.headPitch=Jd(i.headPitch,E,b,Math.max(0,w.maxHeadPitchDeg)*4*Math.PI/180,t),i.bodyPitch=Jd(i.bodyPitch,i.headPitch*Cs(w.bodyPitchScale,0,1),w.bodyPitchRate,Math.max(0,w.maxHeadPitchDeg)*Math.PI/180,t)}const Cp=1e-6,pc=Math.PI/180;function mc(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Tg(n,t,e){const i=n.character.position,a=Math.max(0,e.homingConeDeg)*pc,s=Math.max(0,e.homingRange),o=[];for(let r=0;r<n.dummies.length;r++){const c=n.dummies[r],l=c.position.x-i.x,h=c.position.z-i.z,u=Math.hypot(l,h);u<.001||u>s||Math.abs(Ge(Math.atan2(l,h)-t))>a||o.push({i:r,d:u})}return o.sort((r,c)=>r.d-c.d||r.i-c.i),o.map(r=>r.i)}function Ag(n,t){const e=Math.sin((n+1)*12.9898+(t+1)*78.233)*43758.5453;return e-Math.floor(e)}function Rg(n,t){const e=n.abilities,i=n.character.position,a=Math.max(1,Math.floor(t.perWave)),s=t.spreadDeg*pc,o=Math.max(0,t.spawnSideStep),r=Math.max(0,Math.min(1,t.speedJitter)),c=Tg(n,e.channelYaw,t);for(let l=0;l<a;l++){const h=(l-(a-1)*.5)*s,u=e.channelYaw+h,d=(l-(a-1)*.5)*o,f=Math.sin(u),m=Math.cos(u);e.pending.push({delay:l*Math.max(0,t.spawnDelay),x:i.x+f*.5+Math.cos(u)*d,y:i.y+1,z:i.z+m*.5-Math.sin(u)*d,yaw:u,speed:t.speed*(1+(Ag(e.waveIndex,l)*2-1)*r),targetIndex:c.length>0?c[l%c.length]:-1,wave:e.waveIndex})}mc(n,"arcane-wave",e.waveIndex,{x:i.x,y:i.y+1,z:i.z})}function Pg(n,t,e){const i=n.abilities;if(i.pending.length===0)return;const a=[];for(const s of i.pending){if(s.delay-=t,s.delay>0){a.push(s);continue}const o={id:++i.nextId,x:s.x,y:s.y,z:s.z,dirX:Math.sin(s.yaw),dirZ:Math.cos(s.yaw),speed:s.speed,life:e.life,radius:e.radius,targetIndex:s.targetIndex,turnRate:Math.max(0,e.turnRateDeg)*pc,homing:Math.max(0,e.homingTime),spread:Math.max(0,e.spreadTime),retarget:0,wave:s.wave};i.projectiles.push(o),i.volleyId+=1,mc(n,"projectile-fire",i.volleyId,o)}i.pending=a}function tu(n,t){const e=n.abilities;e.channeling&&(e.channeling=!1,e.fireTimer=0,e.cooldown=Math.max(0,t.cooldown),e.channelMoveScale=1,e.needsRelease=!0,mc(n,"channel-end",0,n.character.position))}function Cg(n,t,e,i,a,s){const o=n.abilities,r=n.dash.phase==="active",c=n.playerLink,l=s==="skill2"?e.skill2Pressed:e.attackHeld,h=a&&l&&!r&&c.phase==="idle"&&!c.consumedAttack;if(o.cooldown>0&&(o.cooldown=Math.max(0,o.cooldown-t)),o.needsRelease&&!h&&(o.needsRelease=!1),o.channeling){if(!h){tu(n,i);return}}else{if(!(h&&!o.needsRelease&&o.cooldown<=0))return;o.channeling=!0,o.channelId+=1,o.waveIndex=0,o.fireTimer=0,o.channelMoveScale=Math.max(0,Math.min(1,i.moveScale)),mc(n,"channel-start",o.channelId,n.character.position)}o.channelYaw=zo(n,e),o.fireTimer-=t;let u=0;for(;o.fireTimer<=0&&u++<8;)if(o.fireTimer+=Math.max(i.waveInterval,Cp),Rg(n,i),o.waveIndex+=1,o.waveIndex>=Math.max(1,Math.floor(i.waves))){tu(n,i);break}}function Dg(n,t,e){const i=Math.max(0,e.homingConeDeg)*pc,a=Math.max(0,e.homingRange),s=Math.atan2(t.dirX,t.dirZ);let o=-1,r=a+Cp;for(let c=0;c<n.dummies.length;c++){const l=n.dummies[c],h=l.position.x-t.x,u=l.position.z-t.z,d=Math.hypot(h,u);d<.001||d>r||Math.abs(Ge(Math.atan2(h,u)-s))>i||(o=c,r=d)}return o}function Lg(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.projectiles){if(r.spread>0)r.spread=Math.max(0,r.spread-t);else if(r.homing>0&&(r.homing=Math.max(0,r.homing-t)),r.retarget-=t,r.retarget<=0&&(r.retarget=Math.max(.05,e.retargetInterval),r.targetIndex=Dg(n,r,e)),r.targetIndex>=0&&r.turnRate>0&&r.homing>0){const l=n.dummies[r.targetIndex];if(!l)r.targetIndex=-1;else{const h=Math.atan2(l.position.x-r.x,l.position.z-r.z),u=Math.atan2(r.dirX,r.dirZ),d=Ge(h-u),f=r.turnRate*t,m=Math.max(-f,Math.min(f,d)),v=u+m;r.dirX=Math.sin(v),r.dirZ=Math.cos(v)}}if(r.x+=r.dirX*r.speed*t,r.z+=r.dirZ*r.speed*t,r.life-=t,r.life<=0)continue;let c=!1;if(s)for(let l=0;l<n.dummies.length;l++){const h=n.dummies[l],u=h.position.x-r.x,d=h.position.z-r.z,f=r.radius+a;if(!(u*u+d*d>f*f)){Yo(n,l,{type:e.hurtType,duration:e.hurtDuration,dirX:r.dirX,dirZ:r.dirZ,knockback:e.knockback}),c=!0;break}}c||o.push(r)}i.projectiles=o}const kg={kind:"channelVolley",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params;Cg(n,t,e,s,a,i.cfg.slot),Pg(n,t,s),Lg(n,t,s)}},Uc=1e-6;function Dp(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Ig(n,t){const e=n.character.position,i={id:++n.abilities.nextId,x:e.x,z:e.z,radius:t.radius,life:t.duration,duration:t.duration,pulseTimer:0};n.abilities.rings.push(i),Dp(n,"ring-place",i.id,e)}function zg(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.rings){r.life-=t,r.pulseTimer-=t;let c=0;for(;r.pulseTimer<=0&&c++<8;){if(r.pulseTimer+=Math.max(e.pulseInterval,Uc),s)for(let l=0;l<n.dummies.length;l++){const h=n.dummies[l],u=h.position.x-r.x,d=h.position.z-r.z,f=r.radius+a;if(u*u+d*d>f*f)continue;const m=Math.hypot(u,d),v=m>Uc?u/m:0,g=m>Uc?d/m:1;Yo(n,l,{type:"heavy",duration:e.stun,dirX:v,dirZ:g,knockback:e.knockback})}Dp(n,"ring-pulse",r.id,{x:r.x,y:0,z:r.z})}r.life>0&&o.push(r)}i.rings=o}const Fg={kind:"groundRing",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params,o=i.cfg.slot==="attack"?e.attackPressed:e.skill2Pressed;a&&o&&n.dash.phase!=="active"&&n.playerLink.phase==="idle"&&Ig(n,s),zg(n,t,s)}},Ug={channelVolley:kg,groundRing:Fg};function Ng(n){const t=Array.isArray(n.skills)?n.skills:[],e=n.abilities;return t.map(i=>{if(i.params)return{cfg:i,params:i.params};const a=i.paramsRef,s=a?e[a]:void 0;if(!s||typeof s!="object")throw new Error(`[skills] ${i.id}: paramsRef "${a??""}" 在 core.abilities 中不存在`);return{cfg:i,params:s}})}function Og(n,t,e){for(const i of n.skills){if(i.cfg.enabled===!1)continue;const a=Ug[i.cfg.kind];if(!a)continue;const s=!i.cfg.weapon||n.combat.weapon===i.cfg.weapon;a.update({world:n,dt:t,intents:e,skill:i,onWeapon:s})}}function Bg(){return{channeling:!1,channelYaw:0,fireTimer:0,waveIndex:0,cooldown:0,needsRelease:!1,channelId:0,channelMoveScale:1,volleyId:0,pending:[],projectiles:[],rings:[],nextId:0}}function Lp(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.waveIndex=0,t.cooldown=0,t.needsRelease=!1,t.channelMoveScale=1,t.pending.length=0,t.projectiles.length=0,t.rings.length=0}function Hg(n,t,e){Og(n,t,e)}function Nc(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const eu=1e-6;function nu(n,t,e){return n<t?t:n>e?e:n}function kp(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function Ip(n){const t=n.camera,e=kp();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function Gg(n){const t=n.camera,e=n.config.camera,i=n.character.position;let a=0,s=0,o=0,r=0;for(const l of n.dummies){const h=l.position.x-i.x,u=l.position.z-i.z,d=Math.hypot(h,u);if(d>e.radius)continue;const f=nu((e.radius-d)/Math.max(eu,e.radius-e.nearDistance),0,1);let m=f*(e.modeWeight[l.mode]??.5);l.attackPhase==="active"&&(m+=e.attackBoost*f),a+=m,s+=l.position.x*m,o+=l.position.z*m,r+=1}const c=a<=0?0:nu(a/(a+Math.max(eu,e.saturation)),0,1);if(t.threat=c,t.threatCount=r,a<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const l=s/a,h=o/a;t.centroidX=l,t.centroidZ=h;let u=(l-i.x)*e.framingBias*c,d=(h-i.z)*e.framingBias*c;const f=Math.hypot(u,d);f>e.maxOffset&&(u=u/f*e.maxOffset,d=d/f*e.maxOffset),t.offsetX=u,t.offsetZ=d}t.distanceScale=1-e.pushIn*(1-c)+e.maxPullback*c,t.pitchDelta=e.maxPitchDelta*c}function Xg(n){const t=[];if(n.slabs&&n.slabs.length>0)for(const e of n.slabs)t.push({id:`ground-${e.plotId}`,kind:"ground",minX:e.minX,maxX:e.maxX,minY:e.top-e.thickness,maxY:e.top,minZ:e.minZ,maxZ:e.maxZ});else{const e=n.ground.size;t.push(ls("ground","ground",0,0,e,e,-n.ground.thickness,0))}for(const e of n.steps)t.push(ls(e.id,"step",e.x,e.z,e.width,e.depth,0,e.height));for(const e of n.doorways){const i=e.openingWidth/2,a=e.wallThickness;t.push(ls(`${e.id}-left`,"wall",e.x-i-e.wallSpan/2,e.z,e.wallSpan,a,0,e.wallHeight)),t.push(ls(`${e.id}-right`,"wall",e.x+i+e.wallSpan/2,e.z,e.wallSpan,a,0,e.wallHeight)),t.push(ls(`${e.id}-lintel`,"lintel",e.x,e.z,e.openingWidth,a,e.openingHeight,e.wallHeight))}for(const e of n.obstacles)t.push(ls(e.id,"obstacle",e.x,e.z,e.width,e.depth,0,e.height));return t}function ls(n,t,e,i,a,s,o,r){return{id:n,kind:t,minX:e-a/2,maxX:e+a/2,minY:o,maxY:r,minZ:i-s/2,maxZ:i+s/2}}const $h={cellSize:.5,cellMeters:5,columns:6,maxRows:32,spawnDz:0,labelInset:.9,defaultRadius:2,defaultShape:"circle",defaultColor:"#7fd8c0",defaultSpan:[2,2],slabThickness:.4,boundInset:.5};function Fe(n){return Math.round(n*1e6)/1e6}function iu(n,t){const e=n??t.defaultSpan;return[Math.max(1,Math.round(e[0])),Math.max(1,Math.round(e[1]))]}function Vg(n,t=$h){var pt,vt,dt,Y;const e={duplicates:[],unplaced:[]},i=t.cellMeters,a=new Set,s=[];for(const N of n)if(!(!N||typeof N.id!="string"||N.id.length===0)){if(a.has(N.id)){e.duplicates.push(N.id);continue}a.add(N.id),s.push(N)}const o=[...s].sort((N,X)=>N.id<X.id?-1:N.id>X.id?1:0),r=new Map,c=(N,X,$)=>{if(N<0||X<0||N+$[0]>t.columns||X+$[1]>t.maxRows)return!1;for(let q=0;q<$[0];q++)for(let ot=0;ot<$[1];ot++)if(r.has(`${N+q},${X+ot}`))return!1;return!0},l=(N,X,$,q)=>{for(let ot=0;ot<q[0];ot++)for(let Et=0;Et<q[1];Et++)r.set(`${X+ot},${$+Et}`,N)},h=[];for(const N of o){if(N.pin!=="origin")continue;const X=iu(N.span,t);c(0,0,X)&&(l(N.id,0,0,X),h.push({def:N,c:0,r:0,span:X,pin:!0,slot:0}))}const u=t.columns*t.maxRows;for(const N of o){if(h.some(Et=>Et.def.id===N.id))continue;const X=iu(N.span,t);let $=-1;for(let Et=0;Et<u;Et++){const Ht=Et%t.columns,tt=Math.floor(Et/t.columns);if(c(Ht,tt,X)){$=Et;break}}if($<0){e.unplaced.push(N.id);continue}const q=$%t.columns,ot=Math.floor($/t.columns);l(N.id,q,ot,X),h.push({def:N,c:q,r:ot,span:X,pin:!1,slot:$})}const d=h.map(N=>({...N,minX0:N.c*i,maxX0:(N.c+N.span[0])*i,minZ0:N.r*i,maxZ0:(N.r+N.span[1])*i}));if(d.length===0)return{plots:[],stations:[],grassPlots:[],destructibles:[],slabs:[],bounds:{minX:0,maxX:0,minZ:0,maxZ:0},steps:[],doorways:[],obstacles:[],dummySpawns:[],diagnostics:e};const f=Math.min(...d.map(N=>N.minX0)),m=Math.max(...d.map(N=>N.maxX0)),v=Math.min(...d.map(N=>N.minZ0)),g=Math.max(...d.map(N=>N.maxZ0)),p=d.find(N=>N.pin),_=p?(p.minX0+p.maxX0)/2:(f+m)/2,x=p?(p.minZ0+p.maxZ0)/2:(v+g)/2,y=-_,S=-x;let E=o.reduce((N,X)=>typeof X.index=="number"?Math.max(N,X.index):N,0);const A=new Map;for(const N of d)A.set(N.def.id,typeof N.def.index=="number"?N.def.index:++E);const b=new Set,M=(N,X)=>{if(!b.has(X))return b.add(X),X;let $=`${N}/${X}`,q=2;for(;b.has($);)$=`${N}/${X}#${q++}`;return b.add($),$},P=[],k=[],D=[],z=[],C=[],T=[];for(const N of d){const X=N.def,$=X.id,q=A.get($)??0,ot=Fe((N.minX0+N.maxX0)/2+y),Et=Fe((N.minZ0+N.maxZ0)/2+S),Ht={plotId:$,cell:{c:N.c,r:N.r},span:N.span,minX:Fe(N.minX0+y),maxX:Fe(N.maxX0+y),minZ:Fe(N.minZ0+S),maxZ:Fe(N.maxZ0+S),top:0,thickness:t.slabThickness};k.push(Ht);const tt=X.radius??t.defaultRadius,V=X.shape??t.defaultShape,B=X.color??t.defaultColor,kt={dx:((pt=X.spawn)==null?void 0:pt.dx)??0,dz:((vt=X.spawn)==null?void 0:vt.dz)??t.spawnDz},Rt=-(N.span[1]*i)/2+t.labelInset,Mt={dx:((dt=X.label)==null?void 0:dt.dx)??0,dz:((Y=X.label)==null?void 0:Y.dz)??Rt},mt={id:$,index:q,name:X.name,hint:X.hint,shape:V,x:ot,z:Et,radius:tt,spawnX:Fe(ot+kt.dx),spawnZ:Fe(Et+kt.dz),labelX:Fe(ot+Mt.dx),labelZ:Fe(Et+Mt.dz),color:B},gt=[];if(X.grass){const L=X.grass,R=L.absolute?0:Math.round(ot/t.cellSize),Q=L.absolute?0:Math.round(Et/t.cellSize),ft={minCellX:L.minCellX+R,maxCellX:L.maxCellX+R,minCellZ:L.minCellZ+Q,maxCellZ:L.maxCellZ+Q};L.density!==void 0&&(ft.density=L.density),L.clearMarginCells!==void 0&&(ft.clearMarginCells=L.clearMarginCells),gt.push(ft)}const Pt=[];if(X.destructibles)for(const L of X.destructibles)Pt.push({id:M($,L.id),kind:L.kind,x:Fe(ot+L.dx),y:L.y??0,z:Fe(Et+L.dz),height:L.height,radius:L.radius,tiltDeg:L.tiltDeg,pitchGain:L.pitchGain,maxTiltDeg:L.maxTiltDeg,fallSec:L.fallSec,bands:L.bands?[...L.bands]:void 0,color:L.color,cutColor:L.cutColor});for(const L of X.steps??[])D.push({id:M($,L.id),x:Fe(ot+L.dx),z:Fe(Et+L.dz),width:L.width,depth:L.depth,height:L.height});for(const L of X.doorways??[])z.push({id:M($,L.id),x:Fe(ot+L.dx),z:Fe(Et+L.dz),openingWidth:L.openingWidth,openingHeight:L.openingHeight,wallThickness:L.wallThickness,wallSpan:L.wallSpan,wallHeight:L.wallHeight});for(const L of X.obstacles??[])C.push({id:M($,L.id),x:Fe(ot+L.dx),z:Fe(Et+L.dz),width:L.width,depth:L.depth,height:L.height});for(const L of X.dummies??[]){const R={plotId:$,x:Fe(ot+L.dx),z:Fe(Et+L.dz)};L.mode!==void 0&&(R.mode=L.mode),L.fighter&&(R.fighter=!0),L.weapon!==void 0&&(R.weapon=L.weapon),T.push(R)}P.push({id:$,index:q,name:X.name,hint:X.hint,owner:X.owner??"",centerX:ot,centerZ:Et,placement:N.pin?"pinned":"auto",slot:N.pin?-1:N.slot,cell:{c:N.c,r:N.r},span:N.span,slab:Ht,shape:V,radius:tt,color:B,station:mt,grassPlots:gt,destructibles:Pt,testSpawn:X.testSpawn})}const U=Math.max(...d.map(N=>N.c+N.span[0])),G=Math.max(...d.map(N=>N.r+N.span[1]));for(let N=0;N<G;N++){let X=0;for(;X<U;){if(r.has(`${X},${N}`)){X++;continue}const $=X;for(;X<U&&!r.has(`${X},${N}`);)X++;k.push({plotId:"",cell:{c:$,r:N},span:[X-$,1],minX:Fe($*i+y),maxX:Fe(X*i+y),minZ:Fe(N*i+S),maxZ:Fe((N+1)*i+S),top:0,thickness:t.slabThickness})}}P.sort((N,X)=>N.index-X.index),k.sort((N,X)=>{const $=A.get(N.plotId)??Number.MAX_SAFE_INTEGER,q=A.get(X.plotId)??Number.MAX_SAFE_INTEGER;return $-q||N.cell.r-X.cell.r||N.cell.c-X.cell.c});const Z=[...P].sort((N,X)=>N.id<X.id?-1:N.id>X.id?1:0),rt={minX:Fe(Math.min(...k.map(N=>N.minX))+t.boundInset),maxX:Fe(Math.max(...k.map(N=>N.maxX))-t.boundInset),minZ:Fe(Math.min(...k.map(N=>N.minZ))+t.boundInset),maxZ:Fe(Math.max(...k.map(N=>N.maxZ))-t.boundInset)};return{plots:P,stations:P.map(N=>N.station),grassPlots:P.flatMap(N=>N.grassPlots),destructibles:Z.flatMap(N=>N.destructibles),slabs:k,bounds:rt,steps:D,doorways:z,obstacles:C,dummySpawns:T,diagnostics:e}}function Wg(n,t,e,i=$h){t.stations=e.stations,t.slabs=e.slabs,t.steps=e.steps,t.doorways=e.doorways,t.obstacles=e.obstacles,t.destructibles=e.destructibles,t.grass&&(t.grass.plots=e.grassPlots),t.ground={size:Math.max(e.bounds.maxX-e.bounds.minX,e.bounds.maxZ-e.bounds.minZ),thickness:i.slabThickness},n.worldBounds={...e.bounds};const a=t.grid.cellSize;t.grid={cellSize:a,minX:Math.floor(e.bounds.minX/a)*a,maxX:Math.ceil(e.bounds.maxX/a)*a,minZ:Math.floor(e.bounds.minZ/a)*a,maxZ:Math.ceil(e.bounds.maxZ/a)*a};const s=e.dummySpawns.filter(c=>!c.fighter),o=e.dummySpawns.filter(c=>c.fighter),r=n.dummies.initialModes;if(n.dummies.count=s.length,n.dummies.spawn=s.map(c=>({x:c.x,z:c.z})),n.dummies.initialModes=s.map((c,l)=>c.mode??r[l]??"idle"),n.dummies.fighters){const c=n.dummies.fighters,l=c.weapons;if(c.spawn=o.map(h=>({x:h.x,z:h.z})),c.weapons=o.map((h,u)=>h.weapon??l[u%l.length]),c.initialModes){const h=c.initialModes;c.initialModes=o.map((u,d)=>h[d%h.length])}}}const Qi=1e-6;function Jr(n,t,e){return n<t?t:n>e?e:n}function Fo(n,t,e,i,a,s,o){const r=a*.85;let c=Number.NEGATIVE_INFINITY;for(const l of n)l.maxY>i+s+Qi||l.maxY<i-o-Qi||t+r<l.minX||t-r>l.maxX||e+r<l.minZ||e-r>l.maxZ||l.maxY>c&&(c=l.maxY);return c}function zp(n,t,e,i,a=0,s=.05){let o=Number.NEGATIVE_INFINITY;for(const r of n)r.maxY>i+s||t<r.minX||t>r.maxX||e<r.minZ||e>r.maxZ||r.maxY>o&&(o=r.maxY);return o===Number.NEGATIVE_INFINITY?a:o}function Zh(n,t,e,i,a){let s=!1;const o=t.y+i;for(let r=0;r<2;r++)for(const c of n){if(c.maxY<=t.y+a+Qi||c.minY>=o-Qi)continue;const l=Jr(t.x,c.minX,c.maxX),h=Jr(t.z,c.minZ,c.maxZ),u=t.x-l,d=t.z-h,f=u*u+d*d;if(!(f>=e*e))if(s=!0,f>Qi*Qi){const m=Math.sqrt(f),v=(e-m)/m;t.x+=u*v,t.z+=d*v}else{const m=t.x-c.minX,v=c.maxX-t.x,g=t.z-c.minZ,p=c.maxZ-t.z,_=Math.min(m,v,g,p);_===m?t.x=c.minX-e:_===v?t.x=c.maxX+e:_===g?t.z=c.minZ-e:t.z=c.maxZ+e}}return s}function jh(n,t,e,i,a){const s=t.y+i;for(const o of n){if(o.maxY<=t.y+a+Qi||o.minY>=s-Qi)continue;const r=Jr(t.x,o.minX,o.maxX),c=Jr(t.z,o.minZ,o.maxZ),l=t.x-r,h=t.z-c;if(l*l+h*h<e*e-Qi)return!0}return!1}const pa=1e-6,Hs=Math.PI/180;function qh(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Il(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Fp(n){n.arrows.length=0}function Yg(n,t,e,i,a,s,o,r,c,l,h){const u=i-n,d=s-e,f=u*u+d*d;let m=0;f>pa&&(m=((o-n)*u+(r-e)*d)/f,m=Math.max(0,Math.min(1,m)));const v=n+u*m,g=e+d*m,p=v-o,_=g-r;if(p*p+_*_>h*h)return-1;const x=t+(a-t)*m;return x<c-.1||x>c+l?-1:m}function $g(n,t){const e=n.config.combat.bow.trajectory,i=Math.max(0,e.homingRange);if(i<=pa)return-1;const a=n.character.position,s=Math.max(0,e.homingConeDeg)*Hs,o=n.config.targeting.targetAssist&&n.modules.targeting?n.targeting:null,r=o&&o.hasTarget?o.targetId:0;let c=-1,l=i+pa;for(const h of n.dummies){if(!n.modules.dummies)break;const u=h.position.x-a.x,d=h.position.z-a.z,f=Math.hypot(u,d);if(!(f<.001||f>i)){if(h.id===r)return h.id;Math.abs(qh(Math.atan2(u,d)-t))>s||f<l&&(c=h.id,l=f)}}return c}function Zg(n,t,e){if(e<=0)return t;const i=n.dummies.find(r=>r.id===e);if(!i)return t;const a=n.character.position,s=Math.atan2(i.position.x-a.x,i.position.z-a.z),o=Math.max(0,n.config.combat.bow.trajectory.homingConeDeg)*Hs;return t+Is(qh(s-t),-o,o)}function jg(n,t,e,i,a,s){const o=n.config.combat.bow.trajectory,r={vy:s*Math.sin(Math.max(0,o.launchPitchDeg)*Hs),horizontal:0};if(r.horizontal=s*Math.cos(Math.max(0,o.launchPitchDeg)*Hs),a<=0)return r;const c=n.dummies.find(v=>v.id===a);if(!c)return r;const l=Math.hypot(c.position.x-t,c.position.z-i);if(l<.4)return r;const h=l/Math.max(pa,s),u=c.position.y+n.config.dummies.height*Is(o.aimHeightRatio,0,1),d=Math.max(0,o.gravity),f=(u-e+.5*d*h*h)/h,m=Is(f,-s*.45,s*.92);return{vy:m,horizontal:Math.sqrt(Math.max(0,s*s-m*m))}}function qg(n,t,e){const i=n.config.combat.bow.trajectory,a=Math.max(0,Math.min(1,t)),s=i.speedMin+(i.speedMax-i.speedMin)*a,o=n.character.position,r=$g(n,e),c=Zg(n,e,r),l=Math.sin(c),h=Math.cos(c),u=o.x+Math.sin(e)*.55,d=o.z+Math.cos(e)*.55,f=o.y+.95,m=jg(n,u,f,d,r,s),v={id:++n.arrowSeq,x:u,y:f,z:d,vx:l*m.horizontal,vy:m.vy,vz:h*m.horizontal,life:Math.max(.1,i.maxLife),stuck:!1,stuckDummy:-1,offX:0,offY:0,offZ:0,yaw:e,localYaw:0,pitch:0,rest:0,hit:!1,targetId:r,homing:Math.max(0,i.homingTime),turnRate:Math.max(0,i.turnRateDeg)*Hs};return n.arrows.push(v),Il(n,"arrow-shot",a,v),v}function Is(n,t,e){return n<t?t:n>e?e:n}function Kg(n,t){const e=n.arrows;if(e.length===0)return;const i=n.config.combat.bow.trajectory,a=n.config.dummies.radius,s=n.config.dummies.height,o=n.modules.hits&&n.modules.dummies,r=Math.max(0,i.gravity),c=[];for(const l of e){if(l.stuck){if(l.rest-=t,l.rest<=0)continue;if(l.stuckDummy>=0){const y=n.dummies[l.stuckDummy];if(y){const S=Math.cos(y.bodyYaw),w=Math.sin(y.bodyYaw);l.x=y.position.x+l.offX*S+l.offZ*w,l.y=y.position.y+l.offY,l.z=y.position.z-l.offX*w+l.offZ*S,l.yaw=y.bodyYaw+l.localYaw}}c.push(l);continue}if(l.life-=t,l.life<=0)continue;const h=l.x,u=l.y,d=l.z;if(l.homing>0&&(l.homing=Math.max(0,l.homing-t),l.targetId>0&&l.turnRate>0)){const y=n.dummies.find(S=>S.id===l.targetId);if(!y)l.targetId=0;else{const S=Math.hypot(l.vx,l.vz);if(S>pa){const w=Math.atan2(y.position.x-l.x,y.position.z-l.z),E=Math.atan2(l.vx,l.vz),A=l.turnRate*t,b=E+Is(qh(w-E),-A,A);l.vx=Math.sin(b)*S,l.vz=Math.cos(b)*S;const M=Math.hypot(y.position.x-l.x,y.position.z-l.z);if(M>.3){const P=M/S,D=(y.position.y+s*Is(i.aimHeightRatio,0,1)-l.y+.5*r*P*P)/P,z=Math.max(0,i.verticalTurnRate)*t;l.vy+=Is(D-l.vy,-z,z)}}}}l.yaw=Math.atan2(l.vx,l.vz),l.pitch=-Math.atan2(l.vy,Math.hypot(l.vx,l.vz)),l.vy-=r*t;const f=h+l.vx*t,m=u+l.vy*t,v=d+l.vz*t;let g=-1,p=2;if(o)for(let y=0;y<n.dummies.length;y++){const S=n.dummies[y],w=Yg(h,u,d,f,m,v,S.position.x,S.position.z,S.position.y,s,a+i.radius);w>=0&&w<p&&(p=w,g=y)}if(g>=0){const y=n.dummies[g];l.x=h+(f-h)*p,l.y=u+(m-u)*p,l.z=d+(v-d)*p,l.stuck=!0,l.stuckDummy=g;const S=Math.cos(y.bodyYaw),w=Math.sin(y.bodyYaw),E=l.x-y.position.x,A=l.z-y.position.z;l.offX=E*S-A*w,l.offZ=E*w+A*S,l.offY=l.y-y.position.y;const b=Math.atan2(l.vx,l.vz);l.localYaw=b-y.bodyYaw,l.yaw=b,l.pitch=Math.atan2(-l.vy,Math.hypot(l.vx,l.vz)),l.rest=Math.max(.2,i.stickSec),l.hit=!0;const M=Math.hypot(l.vx,l.vz);Yo(n,g,{type:"light",duration:.22,dirX:M>pa?l.vx/M:0,dirZ:M>pa?l.vz/M:1,knockback:.14}),Il(n,"arrow-land",y.id,l),c.push(l);continue}const _=Fo(n.boxes,f,v,m+.4,.04,0,6),x=Number.isFinite(_)?_:0;if(m<=x+.02&&l.vy<0){l.x=f,l.y=x+Math.max(0,i.groundStickLift),l.z=v,l.stuck=!0,l.stuckDummy=-1,l.yaw=Math.atan2(l.vx,l.vz);const y=Math.atan2(-l.vy,Math.max(pa,Math.hypot(l.vx,l.vz)));l.pitch=Math.max(y,Math.max(0,i.stickMinPitchDeg)*Hs),l.rest=Math.max(.2,i.stickSec),Il(n,"arrow-land",-1,l),c.push(l);continue}l.x=f,l.y=m,l.z=v,c.push(l)}n.arrows=c}const zl=1e-6,Jg=Math.PI/180;function Fl(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Kh(n,t,e){return n<t?t:n>e?e:n}function gc(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function Ul(n){const t=n.id,e=n.windowId;Object.assign(n,gc()),n.id=t,n.windowId=e}function Qg(n){Ul(n)}function Up(n){Ul(n.playerLink);for(const t of n.dummies)Ul(t.link)}function tx(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function Nl(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const a=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;a<=0||(i.linkWindow=Math.max(i.linkWindow,a),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function Qr(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,gc()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function ex(n,t){const e=n.config.links.search,i=n.character.position,a=Kh(e.maxAngleDeg,0,180)*Jg;let s=0,o=t,r=Number.POSITIVE_INFINITY;for(const c of n.dummies){const l=c.position.x-i.x,h=c.position.z-i.z,u=Math.hypot(l,h);if(u<zl||u>e.range)continue;const d=Math.atan2(l,h);Math.abs(Ge(d-t))>a||u<r&&(r=u,s=c.id,o=d)}return{id:s,yaw:o,dist:s>0?r:0}}function nx(n,t,e,i){const a=n.config.links,s=n.playerLink,o=n.character.position,r=zo(n,t),c=ex(n,r),l=c.id>0?c.yaw:r,h=c.id>0?Kh(c.dist-a.search.stopDistance,0,e.distance):a.noTargetFallback?e.distance:0;s.phase="windup",s.linkWindow=0,s.source="none",s.usedWindowId=s.windowId,s.cooldown=a.sharedCooldown,s.kind=e.kind,s.weapon=i,s.id+=1,s.timer=0,s.progress=0,s.facing=l,s.targetId=c.id,s.targetDist=c.dist,s.travel=h,s.travelled=0,s.fromX=o.x,s.fromZ=o.z,s.pulseTimer=0,s.hitIds=[],s.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,a.sharedCooldown),Fl(n,"link-start",s.id)}function ix(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){Qr(n);return}if(e.weapon!==n.combat.weapon){Qr(n);return}e.timer+=t;const a=c=>c==="windup"?i.windup:c==="active"?i.active:i.recovery;let s=0;for(;e.phase!=="idle"&&s++<8;){const c=a(e.phase);if(e.timer<c)break;e.timer-=c,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,Fl(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,Fl(n,"link-end",e.id))}const o=i.windup+i.active+i.recovery;let r=0;if(e.phase==="windup"?r=e.timer:e.phase==="active"?r=i.windup+e.timer:e.phase==="recovery"?r=i.windup+i.active+e.timer:r=o,e.progress=o>0?Kh(r/o,0,1):1,e.phase==="active"&&i.active>zl){const c=Math.max(0,e.travel-e.travelled),l=Math.max(zl,i.active-e.timer),h=c/l;n.impulse.x=Math.sin(e.facing)*h,n.impulse.z=Math.cos(e.facing)*h}}function ax(n,t,e){const i=n.config.links,a=n.playerLink,s=n.character.position;if(a.consumedAttack=!1,n.combat.hitstop>0)return;if(a.phase==="active"&&(a.travelled+=Math.hypot(s.x-a.fromX,s.z-a.fromZ)),a.fromX=s.x,a.fromZ=s.z,!i.enabled||!n.modules.links){a.phase!=="idle"&&Qr(n);return}const o=n.combat,r=n.character.sprinting;r&&i.triggerWhileSprinting&&a.phase==="idle"&&a.usedWindowId!==a.windowId&&i.windows.sprint>0&&(a.linkWindow=Math.max(a.linkWindow,i.windows.sprint),a.source="sprint"),a.phase==="idle"&&a.prevSprinting&&!r&&Nl(n,"sprint"),a.prevSprinting=r,ix(n,t);const c=i.moves[o.weapon];e.attackPressed&&a.phase==="idle"&&a.linkWindow>0&&a.usedWindowId!==a.windowId&&a.cooldown<=0&&o.phase==="idle"&&!o.charging&&n.dash.phase==="idle"&&!!c&&c.enabled&&nx(n,e,c,o.weapon)}const Nr={windup:0,active:1,recovery:2},au=1e-9;function Np(n){return Number.isFinite(n)?n<0?0:n>1?1:n:0}function sx(n){return n==="windup"||n==="active"||n==="recovery"}function ox(n,t){return Nr[n]+Np(t)}function rx(n,t,e){if(!n||n.length===0)return[];if(!Number.isFinite(e)||e<0)return[];const i=Number.isFinite(t)?t:-1,a=[];for(const s of n){if(!s||!sx(s.at))continue;const o=Np(s.u??0),r=Nr[s.at]+o;r>i+au&&r<=e+au&&a.push({name:s.name,value:Number.isFinite(s.value)?s.value:0,at:s.at,u:o})}return a.sort((s,o)=>Nr[s.at]+s.u-(Nr[o.at]+o.u)),a}const Uo=1e-6;function ma(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function cx(n,t,e){const i=n.character.position;n.events.push({type:"notify",tick:n.tick,x:i.x,y:i.y,z:i.z,value:e,name:t})}function Op(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function xc(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.hitstop=0,t.notifyCursor=-1,t.hitIds.length=0,t.warp=1,t.warpDebt=0,t.warpPhase=0,t.warpTimer=0,t.slamAttackId=0,t.timings=Op()}function Bp(n){return{weapon:_a[Math.max(0,n-1)]??_a[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,hitstop:0,notifyCursor:-1,hitIds:[],warp:1,warpDebt:0,warpPhase:0,warpTimer:0,slamAttackId:0,timings:Op()}}function lx(n,t){return zo(n,t)}function hx(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,a=Math.max(0,t*e.maxLungeScale),s=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+s,a)}function Hp(n,t,e,i){const a=n.combat;a.phase="windup",a.phaseTimer=0,a.comboIndex=i,a.queued=!1,a.charging=!1,a.charge=0,a.attackFacing=lx(n,t),a.attackProgress=0,a.timings=e,a.attackId+=1,a.warpDebt=0,a.warpPhase=0,a.warpTimer=0,a.warp=1,a.notifyCursor=-1,a.hitIds.length=0,ma(n,"attack-start",i)}function Gp(n){return Math.max(0,n.config.combat.settle)}function Ol(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];Hp(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Gp(n),lunge:hx(n,i.lunge[e-1]??0)},e)}function su(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,Hp(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Gp(n),lunge:i.lunge},0),qg(n,e,n.combat.attackFacing),ma(n,"charge-release",e)}function dx(n,t){const e=n.combat,i=n.config.hits.hitstopWarp;if(!i||!i.enabled)return e.warp=e.hitstop>0?0:1,e.warp;const a=Math.max(0,Math.min(1,i.holdRate));if(e.hitstop>0)return e.warpPhase=1,e.warpTimer=e.hitstop,e.warp=a,e.warpDebt+=t*(1-a),e.warp;if(e.warpPhase===1&&(e.warpPhase=2,e.warpTimer=0),e.warpPhase===2){const s=Math.max(.001,i.release);e.warpTimer+=t;const o=Math.min(1,e.warpTimer/s),r=1-(1-o)*(1-o),c=a+(1-a)*r;if(e.warp=c,e.warpDebt+=t*(1-c),o>=1){e.warpPhase=3,e.warpTimer=0;const l=Math.max(0,e.timings.recovery)*Math.max(0,i.payback-1)*Math.max(0,Math.min(1,i.paybackBudget));e.warpDebt=Math.min(e.warpDebt,l)}return e.warp}if(e.warpPhase===3&&e.warpDebt>1e-6){const s=Math.min(Math.max(0,i.payback-1),e.warpDebt/Math.max(t,1e-5));return e.warp=1+s,e.warpDebt=Math.max(0,e.warpDebt-t*s),e.warpDebt<=1e-6&&(e.warpPhase=0,e.warp=1),e.warp}return e.warpPhase=0,e.warp=1,1}function ux(n,t,e){const i=n.combat;if(i.phase==="idle"){i.warp=1,i.warpPhase=0,i.warpTimer=0,i.warpDebt=0;return}const a=i.timings,s=dx(n,t),o=t*s;i.phaseTimer+=o;let r=0;for(;i.phase!=="idle"&&r++<8;){const h=i.phase==="windup"?a.windup:i.phase==="active"?a.active:i.phase==="recovery"?a.recovery:a.settle;if(i.phaseTimer<h)break;if(i.phaseTimer-=h,i.phase==="windup")i.phase="active",ma(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",i.warpPhase=0,i.warpDebt=0,i.warpTimer=0,i.warp=1,ma(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.weapons[i.weapon].comboWindow??n.config.combat.comboWindow,i.queued){i.queued=!1;const u=n.config.combat.weapons[i.weapon];u.comboCount>0&&Ol(n,e,i.comboIndex<u.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const h=i.timings.recovery;if(h>Uo&&i.phaseTimer>=h*n.config.combat.cancelWindow){i.queued=!1;const u=n.config.combat.weapons[i.weapon];u.comboCount>0&&Ol(n,e,i.comboIndex<u.comboCount?i.comboIndex+1:1)}}const c=a.windup+a.active+a.recovery;let l=0;i.phase==="windup"?l=i.phaseTimer:i.phase==="active"?l=a.windup+i.phaseTimer:i.phase==="recovery"?l=a.windup+a.active+i.phaseTimer:i.phase==="settle"&&(l=c),i.phase!=="idle"&&(i.attackProgress=c>0?Math.min(1,l/c):1),fx(n)}function fx(n){const t=n.combat;if(t.phase==="idle")return;const e=t.timings,i=t.phase==="windup"?e.windup:t.phase==="active"?e.active:t.phase==="recovery"?e.recovery:0,a=i>Uo?Math.min(1,Math.max(0,t.phaseTimer/i)):1,s=t.phase==="settle"?3:ox(t.phase,a);if(s<=t.notifyCursor+Uo)return;const o=n.config.combat.weapons[t.weapon].notifies;for(const r of rx(o,t.notifyCursor,s))cx(n,r.name,r.value);t.notifyCursor=s}function px(n,t,e){const i=n.combat,a=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=_a.length){const c=_a[e.weaponSlot-1];c!==i.weapon&&(i.weapon=c,xc(n),Qr(n),ma(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,ma(n,"combo-reset",0))),i.hitstop>0&&(n.impulse.x=0,n.impulse.z=0,n.character.velocity.x=0,n.character.velocity.z=0),ux(n,t,e);const s=a.weapons[i.weapon],o=n.dash.phase==="active";if(s.comboCount>0){const c=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!o&&!c&&(e.attackPressed||a.autoCombo&&e.attackHeld))if(i.phase==="idle"){const h=i.comboWindow>0&&i.comboIndex<s.comboCount?i.comboIndex+1:1;Ol(n,e,h)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&!o&&!n.playerLink.consumedAttack){if(e.attackHeld){if(i.charging||(i.charging=!0,i.charge=0,ma(n,"charge-start",0)),i.charge=Math.min(1,i.charge+t/Math.max(a.bow.maxChargeTime,Uo)),a.bow.autoFire&&i.charge>=1){i.charging=!1;const c=i.charge;i.charge=0,su(n,e,c)}}else if(i.charging){i.charging=!1;const c=i.charge;i.charge=0,c>=a.bow.minChargeToFire?su(n,e,c):ma(n,"charge-release",0)}}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.hitstop<=0&&i.timings.active>Uo)){const c=i.timings.active,l=Math.max(0,i.timings.lunge),h=Math.max(.2,a.lungeCurve),u=g=>l*(1-Math.pow(1-Math.min(1,Math.max(0,g/c)),h+1)),d=t*i.warp,f=Math.min(c,Math.max(0,i.phaseTimer)),m=Math.min(c,Math.max(0,i.phaseTimer-d));let v=Math.max(0,u(f)-u(m))/Math.max(d,1e-4);v=Math.min(v,Math.max(0,a.lungeMaxSpeed)),n.impulse.x=Math.sin(i.attackFacing)*v,n.impulse.z=Math.cos(i.attackFacing)*v}i.hitstop>0&&(i.hitstop=Math.max(0,i.hitstop-t))}const un=1e-6,Bl=Math.PI*2,mx=7,gx=18,Xp=1.3,Vp=.4,xx=.9,ou=.9;function ru(n,t,e,i){const a=Math.max(e,.1),s=((n+t*2.37)%a+a)%a,o=Math.min(Math.max(i,0),1)*a;if(o<=un||s>=o)return 0;const r=Math.min(Math.max(a*.12,.15),o*.5),c=Math.min(1,Math.min(s/r,(o-s)/r));return c*c*(3-2*c)}function vx(n,t){const e=Math.hypot(n,t);return e<=1?{x:n,z:t}:{x:n/e,z:t/e}}function yx(n){return Math.atan2(Math.sin(n),Math.cos(n))}function cu(n,t,e,i){return n+yx(t-n)*(1-Math.exp(-Math.max(e,un)*i))}function tc(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function Mx(n){var i;const t=[];for(let a=0;a<n.count;a++){const s=n.spawn[a]??{x:0,z:0},o=n.initialModes[a]??"idle";t.push(Hl(a+1,o,s.x,s.z,null))}const e=n.fighters;if(e)for(let a=0;a<e.weapons.length;a++){const s=e.spawn[a]??{x:0,z:0},o=((i=e.initialModes)==null?void 0:i[a])??"spar",r=e.attackInterval*(.25+.22*a);t.push(Hl(t.length+1,o,s.x,s.z,e.weapons[a],r))}return t}function Hl(n,t,e,i,a,s=0){return{id:n,mode:t,initialMode:t,homeX:e,homeZ:i,position:{x:e,y:0,z:i},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:e,targetZ:i,wanderTimer:0,attackCooldown:s,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,attackComboIndex:0,attackComboLeft:0,comboGap:0,hurt:Sp(),link:gc(),weapon:a,combat:a?{...Bp(_a.indexOf(a)+1),weapon:a}:null}}function _x(n,t=!1){const e=t?_p:dg,i=e.indexOf(n);return e[(i+1)%e.length]}function Wp(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],a=t.spawn[e]??{x:i.homeX,z:i.homeZ},s=t.initialModes[e]??i.initialMode;i.mode=s,i.initialMode=s,i.homeX=a.x,i.homeZ=a.z,i.position.x=a.x,i.position.y=0,i.position.z=a.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=a.x,i.targetZ=a.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0,i.attackComboIndex=0,i.attackComboLeft=0,i.comboGap=0;const o=i.hurt;if(o.type="none",o.timer=0,o.duration=0,o.dirX=0,o.dirZ=0,o.knockX=0,o.knockZ=0,Qg(i.link),i.combat){const r=i.combat;r.phase="idle",r.comboIndex=0,r.phaseTimer=0,r.attackProgress=0,r.attackFacing=0,r.charging=!1,r.charge=0,r.hitstop=0,r.warp=1,r.warpPhase=0,r.warpDebt=0,r.warpTimer=0,r.hitIds.length=0,r.timings={windup:0,active:0,recovery:0,settle:0,lunge:0}}}n.dummyAttackCount=0}function bx(n,t,e){const i=Nc(n)*Bl,a=Math.sqrt(Nc(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*a,t.targetZ=t.homeZ+Math.sin(i)*a,t.wanderTimer=e.wanderInterval*(.6+Nc(n)*.8)}function Jh(n,t,e){if(t.weapon){const i=n.config.combat.weapons[t.weapon];if(i)return{windup:i.windup,active:i.active,recovery:i.recovery}}return{windup:e.attackWindup,active:e.attackActive,recovery:e.attackRecovery}}function Gl(n,t,e){var s;if(!t.weapon)return e.attackRange;const i=n.config.hits.reach[t.weapon]??e.attackRange,a=((s=e.fighters)==null?void 0:s.attackRangeScale)??.9;return Math.max(.4,i*a)}function Xl(n,t){return n.weapon&&t.fighters?t.fighters.attackInterval:t.attackInterval}function Sx(n,t){return n.weapon&&t.fighters?Math.max(t.leashRadius,t.fighters.leashRadius):t.leashRadius}function wx(n,t,e){const i=Jh(e,n,t);return n.attackPhase==="windup"?i.windup:n.attackPhase==="active"?i.active:n.attackPhase==="recovery"?i.recovery:0}function Ex(n,t,e){var s;if(!t.weapon)return 1;const i=((s=e.fighters)==null?void 0:s.comboCount)??0;if(i>0)return Math.max(1,Math.round(i));const a=n.config.combat.weapons[t.weapon];return Math.max(1,Math.round((a==null?void 0:a.comboCount)??1))}function Tx(n,t){var i;const e=((i=t.fighters)==null?void 0:i.comboGap)??0;return e>0?e:Math.max(0,n.config.combat.settle)}function Ax(n){return n.attackPhase!=="idle"||n.attackComboLeft>0}function Rx(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0,lu(n,t,i);return}t.attackPhaseTimer+=e;let a=0;for(;t.attackPhase!=="idle"&&a++<4;){const c=Math.max(wx(t,i,n),un);if(t.attackPhaseTimer<c)break;t.attackPhaseTimer-=c,t.attackPhase==="windup"?(t.attackPhase="active",tc(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0,t.attackComboLeft>0?t.comboGap=Tx(n,i):(t.attackComboIndex=0,t.weapon&&t.attackCooldown<=0&&(t.attackCooldown=Xl(t,i)*Vp)))}const s=Jh(n,t,i),o=s.windup+s.active+s.recovery;let r=0;t.attackPhase==="windup"?r=t.attackPhaseTimer:t.attackPhase==="active"?r=s.windup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(r=s.windup+s.active+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||o<=0?0:Math.min(1,r/o),lu(n,t,i)}function lu(n,t,e){const i=t.combat;if(!i)return;const a=Jh(n,t,e),s=t.attackPhase==="idle"&&t.attackComboLeft>0&&t.comboGap>0;i.weapon=t.weapon??i.weapon,i.phase=s?"settle":t.attackPhase,i.comboIndex=t.attackComboIndex,i.phaseTimer=t.attackPhaseTimer,i.attackProgress=s?1:t.attackProgress,i.attackFacing=t.facing,i.timings={windup:a.windup,active:a.active,recovery:a.recovery,settle:0,lunge:0},i.hitstop=0,i.warp=1,i.warpPhase=0,i.charging=!1,i.charge=0}function Px(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,a=i.x-t.position.x,s=i.z-t.position.z,o=Math.hypot(a,s),r=o>un?a/o:0,c=o>un?s/o:0;let l=0,h=0;if(t.mode==="wander"){const d=t.targetX-t.position.x,f=t.targetZ-t.position.z,m=Math.hypot(d,f);(t.wanderTimer<=0||m<.3)&&bx(n,t,e);const v=t.targetX-t.position.x,g=t.targetZ-t.position.z,p=Math.hypot(v,g);p>un&&(l=v/p,h=g/p)}else if(t.mode==="follow")o>e.followStopDistance&&(l=r,h=c);else if(t.mode==="keep-distance"){const d=o-e.keepDistance,f=Math.max(e.keepDeadZone,.2),m=Math.max(-1,Math.min(1,d/f))*ou,v=ru(n.time,t.id,e.strafePeriod,e.strafeDuty)*e.keepStrafe;l=r*m-c*v,h=c*m+r*v}else if(t.mode==="attack")o>Gl(n,t,e)&&t.attackPhase==="idle"&&(l=r,h=c);else if(t.mode==="spar"){const d=Gl(n,t,e),f=d*1.7;if(Ax(t))o>d*Xp?(l=r,h=c):o<d*.55&&(l=-r*.6,h=-c*.6);else if(t.attackPhase==="idle"&&t.attackCooldown<=0&&o>d)l=r,h=c;else{const v=Math.max(-1,Math.min(1,(o-f)/.5))*ou,g=ru(n.time,t.id,e.strafePeriod,e.strafeDuty)*xx;l=r*v-c*g,h=c*v+r*g}}({x:l,z:h}=vx(l,h));let u=t.facing;if(t.mode==="wander"?Math.hypot(l,h)>un&&(u=Math.atan2(l,h)):o>un&&(u=Math.atan2(r,c)),e.leashRadius>un&&t.mode!=="wander"&&t.mode!=="idle"){const d=Sx(t,e),f=t.position.x-t.homeX,m=t.position.z-t.homeZ,v=Math.hypot(f,m);if(v>d){const g=Math.min(1,(v-d)/Math.max(d*.5,.5)),p=-f/v,_=-m/v;l=l*(1-g)+p*g,h=h*(1-g)+_*g;const x=Math.hypot(l,h);x>un&&(l/=x,h/=x)}}return{x:l,z:h,facing:u}}function Cx(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.comboGap=Math.max(0,e.comboGap-t),e.hurt.timer>0&&(e.attackComboLeft=0,e.comboGap=0),(e.mode==="attack"||e.mode==="spar")&&e.attackPhase==="idle"&&e.hurt.timer<=0){const _=n.character.position,x=Math.hypot(_.x-e.position.x,_.z-e.position.z),y=Gl(n,e,i);if(e.attackComboLeft>0)e.comboGap<=0&&(x<=y*Xp+un?(e.attackComboIndex+=1,e.attackComboLeft-=1,e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,n.dummyAttackCount+=1,tc(n,"dummy-attack",e)):(e.attackComboLeft=0,e.attackComboIndex=0,e.attackCooldown=Math.max(e.attackCooldown,Xl(e,i)*Vp)));else if(e.attackCooldown<=0&&x<=y+un){const S=Ex(n,e,i);e.attackComboIndex=1,e.attackComboLeft=Math.max(0,S-1),e.comboGap=0,e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=Xl(e,i),n.dummyAttackCount+=1,tc(n,"dummy-attack",e)}}Rx(n,e,t,i);const a=Px(n,e,i),s=n.config.worldBounds;(a.x>0&&e.position.x>=s.maxX-un||a.x<0&&e.position.x<=s.minX+un)&&(a.x=0),(a.z>0&&e.position.z>=s.maxZ-un||a.z<0&&e.position.z<=s.minZ+un)&&(a.z=0);const o=1-Math.exp(-Math.max(i.acceleration,un)*t),r=e.weapon&&i.fighters?i.fighters.moveSpeed:i.moveSpeed;e.velocity.x+=(a.x*r-e.velocity.x)*o,e.velocity.z+=(a.z*r-e.velocity.z)*o,e.facing=a.facing,e.bodyYaw=cu(e.bodyYaw,e.facing,mx,t),e.headYaw=cu(e.headYaw,e.facing,gx,t);const c=e.position.x,l=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const h=n.config.stepHeight;if(Zh(n.boxes,e.position,i.radius,i.height,h))if(jh(n.boxes,e.position,i.radius,i.height,h))e.position.x=c,e.position.z=l,e.velocity.x=0,e.velocity.z=0;else{const _=e.position.x-c,x=e.position.z-l;Math.abs(_)<Math.abs(e.velocity.x*t)*.5&&(e.velocity.x=0),Math.abs(x)<Math.abs(e.velocity.z*t)*.5&&(e.velocity.z=0)}const d=n.config.worldBounds;e.position.x<d.minX?(e.position.x=d.minX,e.velocity.x<0&&(e.velocity.x=0),e.hurt.knockX<0&&(e.hurt.knockX=0)):e.position.x>d.maxX&&(e.position.x=d.maxX,e.velocity.x>0&&(e.velocity.x=0),e.hurt.knockX>0&&(e.hurt.knockX=0)),e.position.z<d.minZ?(e.position.z=d.minZ,e.velocity.z<0&&(e.velocity.z=0),e.hurt.knockZ<0&&(e.hurt.knockZ=0)):e.position.z>d.maxZ&&(e.position.z=d.maxZ,e.velocity.z>0&&(e.velocity.z=0),e.hurt.knockZ>0&&(e.hurt.knockZ=0));const f=Fo(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,h,Number.POSITIVE_INFINITY);f>Number.NEGATIVE_INFINITY&&f<=e.position.y+h+un&&(e.position.y=f);const m=Math.hypot(e.position.x-c,e.position.z-l);e.distance+=m;const v=Math.hypot(e.velocity.x,e.velocity.z),g=Math.min(n.config.strideSpeedCap,v/Math.max(n.config.moveSpeed,un)),p=Math.max(n.config.strideLength*(1+g*n.config.strideSpeedGain),un);e.stride=p,e.gaitPhase=(e.gaitPhase+m/p*Bl)%Bl}function Dx(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const a=n.dummies[e.dummyClickId-1];a.mode=_x(a.mode,!!a.weapon),a.targetX=a.position.x,a.targetZ=a.position.z,a.wanderTimer=0,a.attackCooldown=0,a.attackPhase="idle",a.attackPhaseTimer=0,a.attackProgress=0,a.attackComboIndex=0,a.attackComboLeft=0,a.comboGap=0,a.combat&&(a.combat.phase="idle",a.combat.attackProgress=0,a.combat.comboIndex=0),tc(n,"dummy-mode",a)}for(const a of n.dummies)Cx(n,t,a,i)}const Lx=["idle","attack","keep-distance"],kx=["sword-shield","dual-swords","greatsword"];function Vl(n,t){const e=n.dummies.length,i=n.dummies.filter(a=>a.spawnedByPlot?t!==void 0&&a.spawnedByPlot!==t:!0);n.dummies=i;for(let a=0;a<n.dummies.length;a++)n.dummies[a].id=a+1;return e-n.dummies.length}function Ix(n,t){var d,f;const e=t.testSpawn??{},i=Math.max(0,Math.floor(e.dummies??0)),a=Math.max(0,Math.floor(e.fighters??0));Vl(n,t.id);const s=i+a;if(s===0)return 0;const o=Math.max(.4,e.ringRadius??1.6),r=e.startDeg??-90,c=e.modes??Lx,l=e.weapons??((d=n.config.dummies.fighters)==null?void 0:d.weapons)??kx,h=((f=n.config.dummies.fighters)==null?void 0:f.attackInterval)??3.4,u=[];for(let m=0;m<s;m++){const v=(r+360*m/s)*Math.PI/180,g=t.centerX+Math.cos(v)*o,p=t.centerZ+Math.sin(v)*o,_=m>=i,x=m-i,y=_?"spar":c[m%c.length],S=_?l[x%l.length]:null,w=_?h*(.25+.22*x):0,E=Hl(n.dummies.length+u.length+1,y,g,p,S,w);E.spawnedByPlot=t.id,u.push(E)}return n.dummies.push(...u),u.length}function zx(n){let t=0;for(const e of n.dummies)e.spawnedByPlot&&t++;return t}const Wl=1e-6;function Oc(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Fx(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function Yp(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function hu(n,t,e){return n<t?t:n>e?e:n}function Ux(n,t,e){const i=n.config.dash,s=n.character.position,o=n.config.worldBounds,r=Math.max(.05,i.blinkStep),c=Math.max(0,i.blinkDistance);let l=0,h=s.x,u=s.z;for(;l<c-Wl;){const d=Math.min(c,l+r),f=s.x+t*d,m=s.z+e*d,v=hu(f,o.minX,o.maxX),g=hu(m,o.minZ,o.maxZ),p={x:v,y:s.y,z:g};if(jh(n.boxes,p,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(h=v,u=g,l=d,v!==f||g!==m))break}return{x:h,z:u}}function Nx(n,t,e){const i=n.dash,a=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,Nl(n,"roll")),i.cooldown>0){const c=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),c>0&&i.cooldown===0&&Oc(n,"dash-ready",0)}const s=n.combat,o=s.weapon==="bow"&&(s.charging||s.phase!=="idle");if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&(s.phase==="idle"||o)&&n.playerLink.phase==="idle"){o&&(s.charging=!1,s.charge=0,s.phase!=="idle"&&xc(n));const c=ug(n,e),l=c.x,h=c.z,u=n.combat.weapon==="staff";if(i.kind=u?"blink":"roll",i.dirX=l,i.dirZ=h,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=u?a.blinkCooldown:a.rollCooldown,u){const d=Ux(n,l,h);n.character.position.x=d.x,n.character.position.z=d.z,i.toX=d.x,i.toZ=d.z,i.duration=0,i.timer=0,i.phase="idle",a.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),Nl(n,"blink"),Oc(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(Wl,a.rollDuration),i.timer=i.duration,i.toX=i.fromX+l*a.rollDistance,i.toZ=i.fromZ+h*a.rollDistance,Oc(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const c=Math.max(Wl,i.timer),l=n.character.position.x,h=n.character.position.z;n.impulse.x=(i.toX-l)/c,n.impulse.z=(i.toZ-h)/c}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const xi=1e-6,du=Math.PI*2;function uu(n,t){return Math.sqrt(n*n+t*t)}function er(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Ox(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.headPitch=0,t.bodyPitch=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,xc(n)}function Bx(n,t,e){const i=n.character,a=n.config,s=Fo(n.boxes,t,e,a.characterHeight,a.characterRadius,a.stepHeight,Number.POSITIVE_INFINITY);i.position.x=t,i.position.y=s>Number.NEGATIVE_INFINITY?s:0,i.position.z=e,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.moveYaw=0,i.bodyYaw=0,i.headYaw=0,i.headPitch=0,i.bodyPitch=0,i.grounded=!0,i.sprinting=!1,i.gaitPhase=0,i.stride=a.strideLength,i.distance=0,i.coyoteTime=a.coyoteTime,i.jumpBuffer=0,xc(n),Up(n),Yp(n),Lp(n),Fp(n),Kr(n);const o=n.targeting;o.targetId=0,o.targetYaw=0,o.targetDist=0,o.hasTarget=!1;const r=n.playerHurt;r.type="none",r.lastAt=Vh,r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,n.events.length=0}function Hx(n,t,e){const i=n.config,a=n.character,s=a.position,o=a.velocity;let r=Number.isFinite(e.moveX)?e.moveX:0,c=Number.isFinite(e.moveZ)?e.moveZ:0;const l=uu(r,c);l>1&&(r/=l,c/=l);const h=i.worldBounds;(r>0&&s.x>=h.maxX-xi||r<0&&s.x<=h.minX+xi)&&(r=0),(c>0&&s.z>=h.maxZ-xi||c<0&&s.z<=h.minZ+xi)&&(c=0);const u=n.combat.phase!=="idle",d=n.playerLink.phase!=="idle",f=n.dash.phase==="active",m=u||f||d;a.sprinting=!m&&e.sprintHeld&&l>xi;const v=i.combat.weapons[n.combat.weapon];let g=v?v.moveMultiplier:1;f||d?g=0:u?g*=n.combat.phase==="active"?i.combat.lungeMoveScale:n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?g*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(g*=Math.max(0,Math.min(1,n.abilities.channelMoveScale)));const p=i.moveSpeed*(a.sprinting?i.sprintMultiplier:1)*g;{const D=m?i.skillDecel:l>xi?i.acceleration:i.friction,z=1-Math.exp(-D*t);o.x+=(r*p-o.x)*z,o.z+=(c*p-o.z)*z}e.jumpPressed?a.jumpBuffer=i.jumpBufferTime:a.jumpBuffer=Math.max(0,a.jumpBuffer-t),a.coyoteTime=a.grounded?i.coyoteTime:Math.max(0,a.coyoteTime-t),a.jumpBuffer>0&&a.coyoteTime>0&&(o.y=i.jumpSpeed,a.grounded=!1,a.coyoteTime=0,a.jumpBuffer=0,er(n,"jumped",i.jumpSpeed)),n.events.some(D=>D.type==="blink"&&D.tick===n.tick)&&(o.x=0,o.z=0,n.impulse.x=0,n.impulse.z=0);const x=s.x,y=s.z;if(s.x+=(o.x+n.impulse.x+n.playerHurt.knockX)*t,s.z+=(o.z+n.impulse.z+n.playerHurt.knockZ)*t,Zh(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight)){if(jh(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight))s.x=x,s.z=y,o.x=0,o.z=0;else{const D=s.x-x,z=s.z-y;Math.abs(D)<Math.abs(o.x*t)*.5&&(o.x=0),Math.abs(z)<Math.abs(o.z*t)*.5&&(o.z=0)}er(n,"blocked",1)}s.x<h.minX?(s.x=h.minX,o.x<0&&(o.x=0),n.playerHurt.knockX<0&&(n.playerHurt.knockX=0)):s.x>h.maxX&&(s.x=h.maxX,o.x>0&&(o.x=0),n.playerHurt.knockX>0&&(n.playerHurt.knockX=0)),s.z<h.minZ?(s.z=h.minZ,o.z<0&&(o.z=0),n.playerHurt.knockZ<0&&(n.playerHurt.knockZ=0)):s.z>h.maxZ&&(s.z=h.maxZ,o.z>0&&(o.z=0),n.playerHurt.knockZ>0&&(n.playerHurt.knockZ=0));const w=Fo(n.boxes,s.x,s.z,s.y,i.characterRadius,i.stepHeight,i.fallTolerance);a.grounded&&w>s.y+xi&&w-s.y<=i.stepHeight+xi&&(s.y=w,o.y=0,er(n,"stepUp",w));const E=s.y;o.y-=i.gravity*t,s.y+=o.y*t;const A=Fo(n.boxes,s.x,s.z,E,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);A>Number.NEGATIVE_INFINITY&&s.y<=A&&o.y<=0?(s.y=A,o.y=0,a.grounded||er(n,"landed",A),a.grounded=!0):a.grounded=!1;const b=uu(s.x-x,s.z-y);a.distance+=b;const M=b/Math.max(t,xi),P=Math.min(i.strideSpeedCap,M/Math.max(i.moveSpeed,xi)),k=Math.max(i.strideLength*(1+P*i.strideSpeedGain),xi);a.stride=k,a.gaitPhase=(a.gaitPhase+b/k*du)%du}const Yl=1e-6,fu=2.399963229728653;function Ga(n,t,e){return n<t?t:n>e?e:n}function pu(n,t,e,i,a,s,o,r,c){const l=t.x-n.x,h=t.z-n.z,u=Math.hypot(l,h),d=e+i;if(u>=d)return;let f,m,v;u<Yl?(f=r,m=c,v=d):(f=l/u,m=h/u,v=d-u);const g=v+o;n.x-=f*g*a,n.z-=m*g*a,t.x+=f*g*s,t.z+=m*g*s}function Gx(n){const t=n.config.separation,e=n.dummies,i=n.character.position,a=n.config.characterRadius,s=n.config.dummies.radius,o=Math.max(1,Math.floor(t.iterations)),r=Math.max(0,t.slop);for(let h=0;h<o;h++){for(let u=0;u<e.length;u++)for(let d=u+1;d<e.length;d++){const f=(u*3+d)*fu;pu(e[u].position,e[d].position,s,s,.5,.5,r,Math.cos(f),Math.sin(f))}for(let u=0;u<e.length;u++){const d=(u+1)*fu;pu(i,e[u].position,a,s,0,1,r,Math.cos(d),Math.sin(d))}}const c=n.config.stepHeight,l=n.config.worldBounds;for(const h of e)Zh(n.boxes,h.position,s,n.config.dummies.height,c),h.position.x=Ga(h.position.x,l.minX,l.maxX),h.position.z=Ga(h.position.z,l.minZ,l.maxZ)}function Xx(n,t,e,i,a,s,o,r){const c=Math.hypot(e,i),l=Math.max(0,r.contactBand),h=Ga(r.minScale,0,1);if(c<Yl||l<=0||h>=1)return 1;const u=a+o,d=Ga(r.approachDot,0,.99);let f=0;for(const m of s){const v=m.position.x-n,g=m.position.z-t,p=Math.hypot(v,g);if(p>=u+l)continue;if(p<Yl){f=1;continue}const _=(e*v+i*g)/(c*p);if(_<=d)continue;const x=Ga(1-(p-u)/l,0,1),y=Ga((_-d)/(1-d),0,1);f=Math.max(f,x*y)}return 1-(1-h)*Ga(f,0,1)}function Vx(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=Xx(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const Bc=1e-6,Wx=Math.PI/180;function Yx(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function $x(n,t,e){return n<t?t:n>e?e:n}function Zx(n,t,e){const i=n.config.targeting,a=n.targeting,s=n.character.position;let o=n.character.facing;const r=Math.hypot(e.aimX,e.aimZ);e.aimActive&&r>Bc?o=Math.atan2(e.aimX,e.aimZ):Math.hypot(e.moveX,e.moveZ)>Bc&&(o=Math.atan2(e.moveX,e.moveZ));const c=$x(i.maxAngleDeg,0,180)*Wx;let l=Number.POSITIVE_INFINITY,h=0,u=0,d=0;for(const f of n.dummies){const m=f.position.x-s.x,v=f.position.z-s.z,g=Math.hypot(m,v);if(g<Bc||g>i.range)continue;const p=Math.atan2(m,v),_=Math.abs(Ge(p-o));if(_>c)continue;const x=g-i.frontBias*Math.cos(_);x<l&&(l=x,h=f.id,u=p,d=g)}a.targetId=h,a.targetYaw=u,a.targetDist=d,a.hasTarget=h>0}const Li=1e-6;function Ds(n,t,e){return n<t?t:n>e?e:n}function mu(n){return Math.atan2(Math.sin(n),Math.cos(n))}function jx(n,t,e){const i=n.config.gaze,a=n.gaze;if(!i.enabled||!n.modules.gaze){a.active=!1,a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}const s=n.character.position,o=(D,z)=>{const C=D.position.x-s.x,T=D.position.z-s.z,U=Math.hypot(C,T);if(U<Li||U>z)return 0;const G=Ds((z-U)/Math.max(Li,z-i.nearDistance),0,1);let Z=G*(i.modeWeight[D.mode]??.5);return D.attackPhase==="active"&&(Z+=i.attackBoost*G),Z},r=[];let c=0,l=!1,h=!1,u=!1;for(const D of n.dummies){const z=o(D,i.threatRange),C=D.position.x-s.x,T=D.position.z-s.z,U=Math.hypot(C,T);z>0&&(r.push({id:D.id,x:D.position.x,z:D.position.z,dx:C,dz:T,yaw:Math.atan2(C,T),w:z}),c+=z,U<=i.approachDist&&(i.modeWeight[D.mode]??.5)>=i.hostileModeWeight&&(u=!0)),U>Li&&U<=i.recoveryDist&&(l=!0),(D.attackPhase==="windup"||D.attackPhase==="active")&&U<=i.threatRange&&(h=!0)}const d=c<=0?0:Ds(c/(c+Math.max(Li,i.saturation)),0,1),f=r.length>0,m=a.active,v=f&&(e.aimActive&&d>=i.enterThreshold||i.reactToAttack&&h&&d>=i.enterThreshold||i.reactToApproach&&u),g=i.hurtHoldSec>Li&&n.time-n.playerHurt.lastAt<i.hurtHoldSec,p=m&&(l||g);if(a.active=v||p,!a.active){a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}if(r.length===0)return;r.sort((D,z)=>z.w-D.w);const _=r.slice(0,Math.max(1,i.maxThreats)),x=r[0],y=Math.atan2(x.dx,x.dz),S=i.behindAngleDeg*Math.PI/180,w=n.character.bodyYaw;let E=0,A=0,b=0;for(const D of _){const z=Math.abs(mu(D.yaw-y))/Math.PI;let C=D.w/(1+Math.max(i.spreadFalloff,0)*z*z);D!==x&&i.behindFalloff<1&&Math.abs(mu(D.yaw-w))>S&&(C*=Math.max(i.behindFalloff,0)),E+=D.x*C,A+=D.z*C,b+=C}a.mainId=x.id,a.mainYaw=y;const M=n.dummies.find(D=>D.id===x.id),P=(M?M.position.y:0)+n.config.dummies.height*Ds(i.aimHeightRatio,0,1),k=s.y+n.config.characterHeight*Ds(i.eyeHeightRatio,0,1);a.mainPitch=Math.atan2(P-k,Math.max(Li,Math.hypot(x.dx,x.dz))),a.centroidYaw=b>Li?Math.atan2(E/b-s.x,A/b-s.z):y,a.threatCount=r.length,a.threat=d}function qx(n,t){const e=n.config.gaze;return(e.modeWeight[t.mode]??.5)>=e.hostileModeWeight}function Kx(n,t){const e=n.config.gaze;if(!e.enabled||!n.modules.gaze)return 0;const i=n.character.position,a=Math.hypot(t.position.x-i.x,t.position.z-i.z);if(a<Li||a>e.threatRange)return 0;const s=Math.max(Li,e.threatRange-e.nearDistance),o=Ds((e.threatRange-a)/s,0,1);let r=o*(e.modeWeight[t.mode]??.5);t.attackPhase==="active"&&(r+=e.attackBoost*o);const c=Math.max(Li,e.modeWeight.attack??1.5);return Ds(r/c,0,1)}const Za=1e-6,Gs=Math.PI*2,No={enabled:!1,dirDeg:0,speed:0,amplitude:0,wavelength:4,secondWave:{wavelength:2,amplitude:0,speedScale:1},gust:{periodSec:8,depth:0},jitter:0,shadeAmount:0};function $p(n){var t;return((t=n==null?void 0:n.grass)==null?void 0:t.wind)??No}function vc(n){return{time:0,gust:1-Math.min(1,Math.max(0,n.gust.depth))}}function Jx(n,t,e){if(!t.enabled)return;n.time+=Math.max(0,e);const i=Math.max(.1,t.gust.periodSec),a=Math.min(1,Math.max(0,t.gust.depth));n.gust=1-a+a*(.5+.5*Math.sin(Gs*n.time/i-Math.PI/2))}function Qx(n,t,e,i){const a=n.dirDeg*Math.PI/180,s=t*Math.cos(a)+e*Math.sin(a),o=Gs/Math.max(.1,n.wavelength),r=Gs/Math.max(.1,n.secondWave.wavelength);return[o*s+i,r*s+i*1.7]}function Zp(n){const t=n.dirDeg*Math.PI/180,e=Gs/Math.max(.1,n.wavelength),i=Gs/Math.max(.1,n.secondWave.wavelength);return{dirX:Math.cos(t),dirZ:Math.sin(t),omega1:e*n.speed,omega2:i*n.speed*n.secondWave.speedScale,amp1:n.amplitude,amp2:n.secondWave.amplitude,shadeAmount:n.shadeAmount}}const tv=.18,gu=.4,ev=.6;function nv(n,t,e){if(n<0)return 0;if(n===0)return 1;if(t<=0)return 0;const i=Math.min(1,Math.max(0,1-n/t)),a=Math.min(1,Math.max(0,e))*tv,s=Math.min(1,Math.max(0,(i-a)/(1-a)));return s*s*(3-2*s)}function iv(n){let t=n>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function jp(n,t){return n+","+t}function av(n,t,e){return{spec:e??{minCellX:0,maxCellX:0,minCellZ:0,maxCellZ:0,density:0,bladesPerPatch:[0,0],avoidMargin:0,seed:0},cellSize:t.cellSize>0?t.cellSize:.5,bucketCells:(n==null?void 0:n.bucketCells)??4,blades:[],patches:[],buckets:{},cutCount:0,lastCutAt:0,wind:vc((n==null?void 0:n.wind)??No)}}function sv(n,t,e,i){const a=t.grass,s=n.grass;if(!a||!s||!s.enabled)return av(s,i,a);const o=i.cellSize>0?i.cellSize:.5,r=iv(a.seed),c=Math.max(1,Math.floor(s.footprintCells)),l=Math.max(1,s.bucketCells)*o,h=Math.max(o,s.minHeightCells*o),u=Math.max(h,s.maxHeightCells*o),[d,f]=a.bladesPerPatch,m=Math.max(0,Math.floor(d)),v=Math.max(m,Math.floor(f)),g=e.filter(A=>A.kind!=="ground").map(A=>({minX:A.minX-a.avoidMargin,maxX:A.maxX+a.avoidMargin,minZ:A.minZ-a.avoidMargin,maxZ:A.maxZ+a.avoidMargin})),p=[],_=[],x={},y=a.plots??[],S=(A,b)=>{const M=A+c/2,P=b+c/2;for(let k=0;k<y.length;k++){const D=y[k],z=Math.max(0,D.clearMarginCells??0);if(M>=D.minCellX-z&&M<=D.maxCellX+z&&P>=D.minCellZ-z&&P<=D.maxCellZ+z)return!0}return!1},w=(A,b,M)=>{const P=p.length;for(let k=0;k<M;k++){const D=(A+r()*c)*o,z=(b+r()*c)*o;let C=!1;for(let dt=0;dt<g.length;dt++){const Y=g[dt];if(D>=Y.minX&&D<=Y.maxX&&z>=Y.minZ&&z<=Y.maxZ){C=!0;break}}if(C)continue;const T=zp(e,D,z,3,0,.05),U=h+(u-h)*r(),G=(U-h)/Math.max(Za,u-h),Z=Math.min(1,Math.max(0,r()*.68+G*.32)),rt=p.length;p.push({id:rt,x:D,y:T,z,yaw:r()*Gs,height:U,width:o*.26,tone:Z,lean:(r()-.5)*.24,bend:0,bendX:0,bendZ:0,targetBend:0,recover:0,cut:0,cutAt:0});const pt=jp(Math.floor(D/l),Math.floor(z/l)),vt=x[pt];vt?vt.push(rt):x[pt]=[rt]}p.length>P&&_.push({id:_.length,cellX:A,cellZ:b,bladeFrom:P,bladeTo:p.length})},E=()=>m+Math.floor(r()*(v-m+1));for(let A=a.minCellZ;A+c<=a.maxCellZ;A+=c)for(let b=a.minCellX;b+c<=a.maxCellX;b+=c){const M=r();S(b,A)||M>a.density||w(b,A,E())}for(let A=0;A<y.length;A++){const b=y[A],M=Math.min(1,Math.max(0,b.density??1));for(let P=b.minCellZ;P+c<=b.maxCellZ;P+=c)for(let k=b.minCellX;k+c<=b.maxCellX;k+=c)r()>M||w(k,P,E())}return{spec:a,cellSize:o,bucketCells:s.bucketCells,blades:p,patches:_,buckets:x,cutCount:0,lastCutAt:0,wind:vc(s.wind??No)}}function qp(n,t,e,i){const a=Math.max(1,n.bucketCells)*n.cellSize,s=Math.floor((t-i)/a),o=Math.floor((t+i)/a),r=Math.floor((e-i)/a),c=Math.floor((e+i)/a),l=[];for(let h=s;h<=o;h++)for(let u=r;u<=c;u++){const d=n.buckets[jp(h,u)];if(d)for(let f=0;f<d.length;f++)l.push(d[f])}return l}function ov(n){const t=n.grass,e=n.config.grass;if(!t||!e||!e.enabled||!n.modules.grass)return 0;const i=Ep(n);if(!i.active&&i.slamRadius<=0)return 0;const a=.02,s=Math.max(i.reach,i.slamRadius)+1;let o=0;const r=qp(t,i.x,i.z,s);for(let c=0;c<r.length;c++){const l=t.blades[r[c]];if(l.cut!==0||!pg(i,l.x,l.z,a)&&!mg(i,l.x,l.z,a))continue;l.cut=e.regrow?Math.max(Za,e.regrowSec):-1,l.cutAt=n.time;const h=l.x-i.x,u=l.z-i.z,d=Math.sqrt(h*h+u*u);l.bendX=d>Za?h/d:i.fx,l.bendZ=d>Za?u/d:i.fz,l.bend=Math.min(e.maxBendRad,.55),l.targetBend=0,o+=1}return o>0&&(t.cutCount+=o,t.lastCutAt=n.time,n.events.push({type:"grass-cut",tick:n.tick,x:i.x,y:n.character.position.y,z:i.z,value:o})),o}function rv(n,t){const e=n.grass,i=n.config.grass;if(!e||e.blades.length===0||!i||!i.enabled||!n.modules.grass)return;const a=$p(n.config);e.wind||(e.wind=vc(a)),Jx(e.wind,a,t);const s=e.blades,o=s.length,r=new Array(o).fill(0),c=Math.max(0,i.bendRadius)+n.config.characterRadius;for(let m=0;m<o;m++)s[m].targetBend=0;const l=n.character.position.x,h=n.character.position.z,u=(m,v)=>{const g=qp(e,m,v,c);for(let p=0;p<g.length;p++){const _=g[p],x=s[_];if(x.cut!==0)continue;const y=x.x-m,S=x.z-v,w=Math.sqrt(y*y+S*S);if(w>c)continue;const E=1-w/c,A=i.maxBendRad*E*E;if(A>x.targetBend){x.targetBend=A;const b=w>Za?1/w:0;x.bendX=w>Za?y*b:0,x.bendZ=w>Za?S*b:1,x.recover=0}r[_]=1}};if(u(l,h),n.modules.dummies)for(let m=0;m<n.dummies.length;m++)u(n.dummies[m].position.x,n.dummies[m].position.z);const d=1-Math.exp(-Math.max(0,i.bendRate)*t),f=1-Math.exp(-Math.max(0,i.recoverRate)*t);for(let m=0;m<o;m++){const v=s[m];v.bend+=(v.targetBend-v.bend)*(v.targetBend>v.bend?d:f),v.bend<1e-4&&(v.bend=0),!r[m]&&v.bend===0&&(v.recover+=t),v.cut>0&&(v.cut-=t,v.cut<=0&&(v.cut=0))}ov(n)}function cv(n){const t=n.grass;if(!t)return;for(let i=0;i<t.blades.length;i++){const a=t.blades[i];a.bend=0,a.targetBend=0,a.bendX=0,a.bendZ=0,a.recover=0,a.cut=0,a.cutAt=0}t.cutCount=0,t.lastCutAt=0;const e=vc($p(n.config));t.wind.time=e.time,t.wind.gust=e.gust}const ua=1e-6,xu=Math.PI/180,lv=1.47;function Oa(n,t,e){return n<t?t:n>e?e:n}function hv(n,t,e,i,a,s,o,r){const c=Math.max(ua,e),l=Oa(r.minU??.08,0,1),h=Oa(r.maxU??.92,0,1);let u=Oa((n-t)/c,l,h);const d=r.bands;if(d&&d.length>0){let D=d[0],z=Math.abs(D-u);for(let C=1;C<d.length;C++){const T=Math.abs(d[C]-u);T<z&&(D=d[C],z=T)}u=Oa(D,l,h)}const f=Math.sqrt(a*a+s*s+o*o),m=f>ua?a/f:0,v=f>ua?s/f:0,g=f>ua?o/f:1,p=Math.sqrt(m*m+g*g),_=p>ua?m/p:0,x=p>ua?g/p:1,y=r.pitchGain??.85,S=Oa(r.maxTiltDeg??62,0,89)*xu,w=Math.max(0,-v);let E=Math.min(S,Oa(r.tiltDeg,0,89)*xu+w*y);const A=u*c,b=Math.min(A,c-A),M=Math.atan(Math.max(0,b*.9)/Math.max(ua,i));E=Math.min(E,M);const P=Math.tan(E),k=1/Math.sqrt(1+P*P);return{u,theta:E,nx:_*P*k,ny:k,nz:x*P*k,ax:x,ay:0,az:-_}}function dv(n,t,e,i,a,s,o){const r=e*i,c=1/Math.max(ua,s),l=Math.max(1,Math.floor(t)),h=[];for(let u=0;u<l;u++){const d=u/l*Math.PI*2,f=Math.cos(d)*n,m=Math.sin(d)*n;h.push(Oa(r-(a*f+o*m)*c,0,i))}return h}function uv(n){return!n||n.length===0?[]:n.map(t=>({id:t.id,kind:t.kind,x:t.x,y:t.y,z:t.z,height:t.height,radius:t.radius,tiltDeg:t.tiltDeg??18,pitchGain:t.pitchGain??.85,maxTiltDeg:t.maxTiltDeg??62,fallSec:t.fallSec??.9,bands:t.bands?[...t.bands]:[],color:t.color??"#8a6b4a",cutColor:t.cutColor??"#e8c9a0",broken:0,cutU:1,theta:0,nx:0,ny:1,nz:0,ax:0,ay:0,az:-1,fall:0,brokenAt:0}))}function Kp(n,t,e,i,a,s,o){const r=hv(i,t.y,t.height,t.radius,a,s,o,{tiltDeg:t.tiltDeg,bands:t.bands,pitchGain:t.pitchGain,maxTiltDeg:t.maxTiltDeg});t.broken=1,t.cutU=r.u,t.theta=r.theta,t.nx=r.nx,t.ny=r.ny,t.nz=r.nz,t.ax=r.ax,t.ay=r.ay,t.az=r.az,t.fall=0,t.brokenAt=n.time,n.events.push({type:"break",tick:n.tick,x:t.x,y:t.y+r.u*t.height,z:t.z,value:e})}function fv(n,t,e,i,a,s){const o=n.destructibles;if(!o)return!1;for(let r=0;r<o.length;r++){const c=o[r];if(!(c.id!==t||c.broken!==0))return Kp(n,c,r,e,i,a,s),!0}return!1}function pv(n,t,e){const i=n.destructibles;if(!i||i.length===0||!n.modules.destructibles)return;const a=e.breakHits??[],s=a.length>0?Ep(n):null;if(!!s&&(s.active||s.slamRadius>0)&&s)for(let r=0;r<a.length;r++){const c=a[r];let l=-1;for(let u=0;u<i.length;u++)if(i[u].id===c.id){l=u;break}if(l<0)continue;const h=i[l];h.broken===0&&Kp(n,h,l,c.y,c.dx,c.dy,c.dz)}for(let r=0;r<i.length;r++){const c=i[r];if(c.broken===0)continue;const l=1-Math.exp(-t*3/Math.max(.1,c.fallSec));c.fall+=(lv-c.fall)*l}}function Jp(n){const t=n.destructibles;if(t)for(let e=0;e<t.length;e++){const i=t[e];i.broken=0,i.cutU=1,i.theta=0,i.nx=0,i.ny=1,i.nz=0,i.ax=0,i.ay=0,i.az=-1,i.fall=0,i.brokenAt=0}}function mv(){return{active:!1,mainId:0,mainYaw:0,mainPitch:0,centroidYaw:0,threatCount:0,threat:0}}function gv(n,t){const e=Xg(t);return{tick:0,time:0,rngState:2654435769,config:n,boxes:e,gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:Bp(1),playerLink:gc(),arrows:[],arrowSeq:0,abilities:Bg(),skills:Ng(n),impulse:{x:0,z:0},targeting:Yx(),turnInPlace:_g(),playerHurt:Sp(),hitCount:0,dash:{...Fx(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{...kp(),centroidX:n.spawn.x,centroidZ:n.spawn.z},gaze:mv(),dummies:Mx(n.dummies),dummyAttackCount:0,grass:sv(n,t,e,t.grid),destructibles:uv(t.destructibles),events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,turnInPlace:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,gaze:!0,dummies:!0,grass:!0,destructibles:!0}}}function xv(n){Ox(n),Wp(n),Up(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.lastAt=Vh,e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,Lp(n),Fp(n),Yp(n),Ip(n),Kr(n);const i=n.gaze;i.active=!1,i.mainId=0,i.mainYaw=0,i.mainPitch=0,i.centroidYaw=0,i.threatCount=0,i.threat=0,cv(n),Jp(n),n.events.length=0}function vu(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){xv(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?Zx(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),ax(n,t,e),n.modules.combat&&px(n,t,e),n.modules.dash&&Nx(n,t,e),n.modules.movement&&Hx(n,t,e),n.modules.gaze&&jx(n,t,e),n.modules.orientation&&Eg(n,t,e),wg(n,t,e),n.modules.dummies&&Dx(n,t,e),fg(n,t),tx(n,t),n.modules.abilities&&Hg(n,t,e),n.modules.combat&&Kg(n,t),n.modules.dummies&&(Mg(n,t),n.modules.separation&&(Gx(n),Vx(n))),rv(n,t),pv(n,t,e),n.modules.camera?Gg(n):Ip(n),n}const Qp=["bodyYaw","bodyPitch","bodyRoll","pelvisX","pelvisZ","armPitch","armYaw","armRoll","elbow","bladePitch","armLPitch","armLYaw","armLRoll","elbowL","rootYaw","bladePitchOff","bladeTwist","bladeTwistOff","bladeYaw","bladeYawOff"],yu=1e-9;function vv(n,t,e){return n<t?t:n>e?e:n}function tm(n){return vv(Number.isFinite(n)?n:0,0,1)}function em(n,t){const e=tm(t);return n==="in"?e*e:n==="out"?1-(1-e)*(1-e):n==="inOut"?e*e*(3-2*e):e}function yv(){const n={};for(const t of Qp)n[t]=0;return n}function Mv(n,t){const e=yv(),i=(n==null?void 0:n.keys)??[];if(i.length===0)return e;const a=tm(t);let s=0;for(;s<i.length-1&&a>i[s+1].t+yu;)s+=1;const o=i[s],r=i[Math.min(s+1,i.length-1)],c=r.t-o.t,l=c>yu?(a-o.t)/c:0,h=em(o.ease??"linear",l);for(const u of Qp){const d=o.pose[u]??r.pose[u]??0,f=r.pose[u]??o.pose[u]??0;e[u]=d+(f-d)*h}return e}function _v(n,t){const e=n==null?void 0:n.spin;if(!e||!Number.isFinite(e.turns)||e.turns===0)return 0;const i=e.ease??"linear",a=Number.isFinite(e.span)&&e.span>0?Math.min(1,e.span):1,s=em(i,t/a);return e.turns*Math.PI*2*s}function Ra(n,t){return((n==null?void 0:n.keys)??[]).some(e=>typeof e.pose[t]=="number")}function bv(n){let t=0;return{frame(e,i,a,s,o){if(s||a<=0)return t=0,0;t+=Math.min(e,.1)*a;const r=n.config.fixedDt,c=n.config.maxStepsPerFrame;let l=0;for(;t>=r&&l<c;){const h=l===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};vu(n,r,h),o&&o(),t-=r,l++}return l>=c&&(t=0),l},singleStep(e){vu(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t},get alpha(){const e=n.config.fixedDt;return e>0?Math.max(0,Math.min(1,t/e)):1}}}function Xi(n,t,e){let i=t-n;for(;i>Math.PI;)i-=Math.PI*2;for(;i<-Math.PI;)i+=Math.PI*2;return n+i*e}function Ue(n,t,e){return n+(t-n)*e}function Sv(n){const t=n.combat,e=n.dummies;let i=`${t.weapon}|${t.phase}|${t.comboIndex}|${t.attackId}|${n.character.grounded?1:0}|${n.character.sprinting?1:0}|${n.playerHurt.type}|${t.hitstop>0?1:0}|d:${n.dash.phase}:${n.dash.kind}|t:${n.turnInPlace.phase}|l:${n.playerLink.phase}:${n.playerLink.kind}`;for(let a=0;a<e.length;a++){const s=e[a];i+=`|${s.id}:${s.mode}:${s.attackPhase}:${s.attackId}:${s.hurt.type}`}return i}function Mu(n){const t=n.character,e=n.combat,i=n.playerHurt;return{time:n.time,key:Sv(n),ch:{x:t.position.x,y:t.position.y,z:t.position.z,facing:t.facing,moveYaw:t.moveYaw,bodyYaw:t.bodyYaw,headYaw:t.headYaw,headPitch:t.headPitch,bodyPitch:t.bodyPitch,gaitPhase:t.gaitPhase,stride:t.stride,vx:t.velocity.x,vy:t.velocity.y,vz:t.velocity.z},cb:{attackProgress:e.attackProgress,phaseTimer:e.phaseTimer,charge:e.charge,hitstop:e.hitstop},dash:{timer:n.dash.timer},turn:{progress:n.turnInPlace.progress},link:{progress:n.playerLink.progress},hurt:{timer:i.timer,duration:i.duration,knockX:i.knockX,knockZ:i.knockZ},dm:n.dummies.map(a=>({x:a.position.x,y:a.position.y,z:a.position.z,facing:a.facing,bodyYaw:a.bodyYaw,headYaw:a.headYaw,gaitPhase:a.gaitPhase,stride:a.stride,attackProgress:a.attackProgress,vx:a.velocity.x,vy:a.velocity.y,vz:a.velocity.z}))}}function wv(n,t){return n.key===t.key&&n.dm.length===t.dm.length}function Ev(n,t,e){const i=Math.max(0,Math.min(1,e)),a={position:{x:Ue(n.ch.x,t.ch.x,i),y:Ue(n.ch.y,t.ch.y,i),z:Ue(n.ch.z,t.ch.z,i)},facing:Xi(n.ch.facing,t.ch.facing,i),moveYaw:Xi(n.ch.moveYaw,t.ch.moveYaw,i),bodyYaw:Xi(n.ch.bodyYaw,t.ch.bodyYaw,i),headYaw:Xi(n.ch.headYaw,t.ch.headYaw,i),headPitch:Ue(n.ch.headPitch,t.ch.headPitch,i),bodyPitch:Ue(n.ch.bodyPitch,t.ch.bodyPitch,i),gaitPhase:Xi(n.ch.gaitPhase,t.ch.gaitPhase,i),stride:Ue(n.ch.stride,t.ch.stride,i),velocity:{x:Ue(n.ch.vx,t.ch.vx,i),y:Ue(n.ch.vy,t.ch.vy,i),z:Ue(n.ch.vz,t.ch.vz,i)}},s={attackProgress:Ue(n.cb.attackProgress,t.cb.attackProgress,i),phaseTimer:Ue(n.cb.phaseTimer,t.cb.phaseTimer,i),charge:Ue(n.cb.charge,t.cb.charge,i),hitstop:i<1?Math.max(0,Ue(n.cb.hitstop,t.cb.hitstop,i)):t.cb.hitstop},o={timer:Ue(n.hurt.timer,t.hurt.timer,i),knockX:Ue(n.hurt.knockX,t.hurt.knockX,i),knockZ:Ue(n.hurt.knockZ,t.hurt.knockZ,i)},r=t.dm.map((c,l)=>{const h=n.dm[l];return h?{position:{x:Ue(h.x,c.x,i),y:Ue(h.y,c.y,i),z:Ue(h.z,c.z,i)},facing:Xi(h.facing,c.facing,i),bodyYaw:Xi(h.bodyYaw,c.bodyYaw,i),headYaw:Xi(h.headYaw,c.headYaw,i),gaitPhase:Xi(h.gaitPhase,c.gaitPhase,i),stride:Ue(h.stride,c.stride,i),attackProgress:Ue(h.attackProgress,c.attackProgress,i),velocity:{x:Ue(h.vx,c.vx,i),y:Ue(h.vy,c.vy,i),z:Ue(h.vz,c.vz,i)}}:null});return{time:Ue(n.time,t.time,i),character:a,combat:s,playerHurt:o,dash:{timer:Ue(n.dash.timer,t.dash.timer,i)},turn:{progress:Ue(n.turn.progress,t.turn.progress,i)},link:{progress:Ue(n.link.progress,t.link.progress,i)},dummies:r}}function Tv(n,t){const e=n.dummies.map((i,a)=>{const s=t.dummies[a];return s?{...i,...s}:i});return{...n,time:t.time,character:{...n.character,...t.character},combat:{...n.combat,...t.combat},playerHurt:{...n.playerHurt,...t.playerHurt},dash:{...n.dash,timer:t.dash.timer},turnInPlace:{...n.turnInPlace,progress:t.turn.progress},playerLink:{...n.playerLink,progress:t.link.progress},dummies:e}}const nm={slopPx:12,longPressMs:450,doubleTapMs:280};function Av(n,t,e=nm.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,a=n.dy/n.distance,s=t.rightX*i+t.forwardX*-a,o=t.rightZ*i+t.forwardZ*-a,r=Math.hypot(s,o);return r<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:s/r,worldZ:o/r}}function Pa(n,t,e,i,a,s){const o=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:o,angleDeg:o>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:a,taps:s,worldX:0,worldZ:0}}function Rv(n=nm){const t=new Map,e=new Map,i=a=>t.get(a);return{begin(a,s,o,r,c){if(t.has(s))return null;for(const l of t.values())if(l.button===a)return null;return t.set(s,{button:a,pointerId:s,startX:o,startY:r,x:o,y:r,startedAt:c,dragging:!1,longFired:!1}),Pa(a,"press",0,0,0,1)},move(a,s,o,r){const c=i(a);if(!c)return null;c.x=s,c.y=o;const l=s-c.startX,h=o-c.startY;return!c.dragging&&Math.hypot(l,h)>=n.slopPx?(c.dragging=!0,Pa(c.button,"drag",l,h,r-c.startedAt,1)):null},end(a,s,o,r){const c=i(a);if(!c)return null;t.delete(a),c.x=s,c.y=o;const l=s-c.startX,h=o-c.startY,u=r-c.startedAt,d=Math.hypot(l,h);if(c.dragging||c.longFired||d>=n.slopPx)return Pa(c.button,"release",l,h,u,1);const f=e.get(c.button);return f!==void 0&&r-f.at<=n.doubleTapMs&&Math.hypot(s-f.x,o-f.y)<=n.slopPx*2?(e.delete(c.button),Pa(c.button,"doubleTap",l,h,u,2)):(e.set(c.button,{at:r,x:s,y:o}),Pa(c.button,"tap",l,h,u,1))},cancel(a,s){const o=i(a);return o?(t.delete(a),Pa(o.button,"cancel",o.x-o.startX,o.y-o.startY,s-o.startedAt,1)):null},poll(a){for(const s of t.values())if(!(s.longFired||s.dragging)&&a-s.startedAt>=n.longPressMs)return s.longFired=!0,Pa(s.button,"longPress",s.x-s.startX,s.y-s.startY,a-s.startedAt,1);return null},isHeld(a){for(const s of t.values())if(s.button===a)return!0;return!1},reset(){t.clear(),e.clear()}}}const Hc=.001,Pv=18;function $l(n,t,e){return n<t?t:n>e?e:n}function Zl(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function Cv(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function Dv(n,t,e,i,a=Pv){const s=Cv(t);if(!s)return{state:Zl(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const o=Math.hypot(s[1].x-s[0].x,s[1].y-s[0].y),r=a,c=Math.max(1.0001,Number.isFinite(i)?i:1.25),l=1/c,h=c;if(!Number.isFinite(o)||o<Hc)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const m=r<=0;return{state:{active:!0,lastDist:o,armDist:o,armed:m},scale:1,started:!0,ended:!1,armedNow:!1,pinching:m}}if(!n.armed)return n.armDist<Hc?{state:{active:!0,lastDist:o,armDist:o,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(o-n.armDist)<r?{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<Hc)return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const u=o/n.lastDist,d=Math.max(0,Number.isFinite(e)?e:1),f=Number.isFinite(u)&&u>0?Math.pow(u,d):1;return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:$l(Number.isFinite(f)?f:1,l,h),started:!1,ended:!1,armedNow:!1,pinching:!0}}function _u(n,t,e,i){const a=Math.min(e,i),s=Math.max(e,i),o=Number.isFinite(t)&&t>0?t:1,r=n*o;return Number.isFinite(r)?$l(r,a,s):$l(n,a,s)}function Lv(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function kv(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const Gc=["jump","sprint","reset","attack","skill2"],Iv=8,zv=16,Xc=10,bu=14,Su=140,Fv=18,Uv=16,Nv=400,Ov=1.0001;function Or(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function Bv(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&Or(e)}function Hv(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:a}=n,s=()=>Math.max(8,t());let o=null,r=0,c=0,l=0,h=0,u=0,d=0,f=-1,m=0,v=null,g=-1,p=0,_=0,x=0,y=0,S=!1,w=0,E=1,A=0,b=null,M=0,P=0,k=!1,D=null,z=null,C=0,T=0,U=0,G=0,Z=!1,rt=!0,pt=-1;const vt=Rv({slopPx:bu,longPressMs:450,doubleTapMs:350});let dt=[],Y=null;const N=new Set;function X(J){J&&dt.push(J)}const $=new Map;let q=Zl(),ot=!1,Et=1;function Ht(){const J=Array.from($.values()),K=a(),st=Dv(q,J,K.pinchGain,K.maxStepRatio,Fv);if(q=st.state,ot=st.pinching,st.scale!==1&&(Et*=st.scale),st.started||st.armedNow)b=null,k=!0,D=null;else if(st.ended&&o===null&&J.length===1){const Ot=J[0];o=Ot.id,r=Ot.x,c=Ot.y,l=0,h=0,u=Ot.x,d=Ot.y,S=!1,w=0,E=1,A=0,performance.now(),b=null,k=!0,D=null}}const tt={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},V={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let B=0,kt=0;const Rt={},Mt=new Set,mt=[];function gt(){for(const J of Gc)Rt[J]!==void 0&&(Rt[J]=void 0),Q(J);vt.reset(),N.clear(),$.clear(),q=Zl(),ot=!1,o=null,l=0,h=0,u=0,d=0,S=!1,w=0,E=1,A=0,p=0,_=0,x=0,y=0,v=null,g=-1,b=null,k=!1,D=null,z=null,pt=-1,U=0,G=0,Z=!1,rt=!0}const Pt=()=>{document.hidden&&gt()},L=J=>{if(J.clientX===0&&J.clientY===0){m++;return}if(Or(J.target)||Bv(J.clientX,J.clientY)){N.add(J.pointerId);return}if(N.delete(J.pointerId),$.set(J.pointerId,{id:J.pointerId,x:J.clientX,y:J.clientY}),o===null&&!ot){v=null,g=-1,o=J.pointerId,r=J.clientX,c=J.clientY,l=0,h=0,u=J.clientX,d=J.clientY,performance.now();const K=Number.isFinite(J.screenX)&&Number.isFinite(J.screenY)&&(J.screenX!==0||J.screenY!==0);S=K,w=0,E=1,A=0,p=K?J.screenX:0,_=K?J.screenY:0,x=p,y=_,b=J.pointerId,M=J.clientX,P=J.clientY,k=!1}Ht()},R=J=>{if(J.pointerId===z&&(J.pointerType==="mouse"&&J.buttons===0||J.clientX===0&&J.clientY===0&&(C!==0||T!==0)||(rt?(U=J.clientX-C,G=J.clientY-T):(C=J.clientX,T=J.clientY,rt=!0,U=0,G=0))),X(vt.move(J.pointerId,J.clientX,J.clientY,performance.now())),!N.has(J.pointerId)&&$.has(J.pointerId)&&($.set(J.pointerId,{id:J.pointerId,x:J.clientX,y:J.clientY}),Ht()),N.has(J.pointerId)||J.pointerId!==o)return;const K=performance.now();if(v===J.pointerId&&K-g<150){m++;return}const st=J.clientX,Ot=J.clientY;if(st===0&&Ot===0&&(r!==0||c!==0)){m++;return}const Lt=st-u,F=Ot-d,St=Number.isFinite(J.screenX)&&Number.isFinite(J.screenY),j=St?J.screenX:0,ut=St?J.screenY:0,Nt=St&&(j!==0||ut!==0),Dt=j-x,qt=ut-y;if(S&&Nt){const Re=Math.hypot(Dt,qt),Pe=Math.hypot(Lt,F);if(Re>3){if(w=0,A<30&&Pe>6&&Dt*Lt+qt*F>.7*Re*Pe){const fn=Re/Pe;fn>.2&&fn<5&&(E+=(fn-E)*.3,A++)}}else Pe>12&&(w++,w>=2&&(S=!1))}const le=Math.hypot(Lt,F);if(!S){const Re=f<0?Number.POSITIVE_INFINITY:K-f,Pe=Nt?Math.hypot(Dt,qt):1/0;le>28&&(Re<200||Pe<le*.4)&&(r+=Lt,c+=F,m++)}u=st,d=Ot,x=j,y=ut,J.pointerId===b&&Math.hypot(J.clientX-M,J.clientY-P)>Iv&&(k=!0);let he,ee;S&&Nt?(he=(j-p)/E,ee=(ut-_)/E):(he=st-r,ee=Ot-c);const we=Math.hypot(he,ee),De=s();we>De&&(he*=De/we,ee*=De/we);const Ve=Math.hypot(l,h),Mn=Math.hypot(he,ee);if(Ve>10&&Mn>10){const Re=Math.abs(Math.atan2(l*ee-h*he,l*he+h*ee)),Pe=Math.max(Ve,Mn)*Re,fn=Math.max(Math.hypot(Lt,F),Math.hypot(Dt,qt)/Math.max(.2,E));if(Re>.6&&fn<Math.max(6,Pe*.5)){m++;return}}l=he,h=ee};function Q(J){if(!tt[J])return;tt[J]=!1,J==="attack"&&(V.attackReleased=!0);const K=document.getElementById(`btn-${J}`);K==null||K.classList.remove("is-down")}function ft(){o!==null&&(v=o,g=performance.now(),o=null,l=0,h=0,u=0,d=0,S=!1,w=0,E=1,A=0,p=0,_=0,x=0,y=0)}const at=J=>{const K=$.delete(J.pointerId),st=N.delete(J.pointerId);K&&Ht(),J.pointerId===z&&(z=null,Z?pt=performance.now():(U=0,G=0,pt=-1)),X(vt.end(J.pointerId,J.clientX,J.clientY,performance.now()));for(const Ft of Gc)Rt[Ft]===J.pointerId&&(Rt[Ft]=void 0,Q(Ft));const Ot=!K&&!st&&$.size<=1&&o!==null;(J.pointerId===o||$.size===0||Ot)&&ft(),!st&&J.pointerId===b&&(!k&&!Or(J.target)&&(D={x:J.clientX,y:J.clientY}),b=null)};for(const J of Gc){const K=document.getElementById(`btn-${J}`);if(!K)continue;const st=J==="attack"||J==="skill2",Ot=F=>{if(F.preventDefault(),Rt[J]===void 0){Rt[J]=F.pointerId,tt[J]=!0,J==="jump"&&(V.jump=!0),J==="reset"&&(V.reset=!0),J==="sprint"&&(V.sprintPressed=!0),J==="attack"&&(V.attackPressed=!0),J==="skill2"&&(V.skill2=!0),K.classList.add("is-down"),X(vt.begin(J,F.pointerId,F.clientX,F.clientY,performance.now()));try{K.setPointerCapture(F.pointerId)}catch{}st&&(z=F.pointerId,C=F.clientX,T=F.clientY,rt=!(F.clientX===0&&F.clientY===0),U=0,G=0,Z=!1,pt=-1)}},Ft=F=>{Rt[J]===F.pointerId&&(Rt[J]=void 0,Q(J),X(vt.end(F.pointerId,F.clientX,F.clientY,performance.now())))},Lt=F=>{Rt[J]===F.pointerId&&(Rt[J]=void 0,Q(J),X(vt.cancel(F.pointerId,performance.now())))};K.addEventListener("pointerdown",Ot),K.addEventListener("pointerup",Ft),K.addEventListener("pointercancel",Lt),mt.push(()=>{K.removeEventListener("pointerdown",Ot),K.removeEventListener("pointerup",Ft),K.removeEventListener("pointercancel",Lt)})}const ht=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const J of ht){const K=st=>{st.preventDefault(),B=Number(J.dataset.weapon)||0};J.addEventListener("pointerdown",K),mt.push(()=>J.removeEventListener("pointerdown",K))}const zt=J=>{const K=J.key.toLowerCase();if((K===" "||K.startsWith("arrow"))&&J.preventDefault(),Mt.has(K))return;Mt.add(K),K===" "&&(V.jump=!0),K==="r"&&(V.reset=!0),K==="shift"&&(V.sprintPressed=!0),K==="j"&&(V.attackPressed=!0),K==="k"&&(V.skill2=!0),K>="1"&&K<="5"&&(B=Number(K)),K>="6"&&K<="9"&&(kt=Number(K)-5);const st=Math.max(Ov,a().keyStep||1.12);(K==="="||K==="+")&&(Et*=st),(K==="-"||K==="_")&&(Et/=st)},Ct=J=>{const K=J.key.toLowerCase();Mt.has(K)&&(Mt.delete(K),K==="j"&&(V.attackReleased=!0))},wt=J=>{if(Or(J.target))return;J.preventDefault();const K=J.deltaMode===1?J.deltaY*Uv:J.deltaMode===2?J.deltaY*Nv:J.deltaY;Et*=Lv(K,a().wheelStep)},Xt=J=>{J.preventDefault()},xt=()=>{f=performance.now()};window.addEventListener("resize",xt),window.addEventListener("orientationchange",xt);const It=typeof window<"u"?window.visualViewport:null;return It&&(It.addEventListener("resize",xt),It.addEventListener("scroll",xt)),window.addEventListener("pointerdown",L),window.addEventListener("pointermove",R),window.addEventListener("pointerup",at),window.addEventListener("pointercancel",at),window.addEventListener("blur",gt),document.addEventListener("visibilitychange",Pt),window.addEventListener("keydown",zt),window.addEventListener("keyup",Ct),window.addEventListener("wheel",wt,{passive:!1}),window.addEventListener("gesturestart",Xt),{peekStick(){return{id:o,held:o!==null,originX:r,originY:c,x:u,y:d,dx:u-r,dy:d-c,radius:s(),badMoves:m,screenOk:S,originSX:p,originSY:_,screenX:x,screenY:y,scale:E}},peekAim(){const J=performance.now(),K=Math.hypot(U,G),st=z!==null||pt>=0&&J-pt<Su;if(!(st&&Z&&K>=Xc))return{active:!1,holding:st,x:0,z:0,dx:U,dy:G};const Ft=i(),Lt=U/K,F=G/K,St=Ft.rightX*Lt+Ft.forwardX*-F,j=Ft.rightZ*Lt+Ft.forwardZ*-F,ut=Math.hypot(St,j)||1;return{active:!0,holding:st,x:St/ut,z:j/ut,dx:U,dy:G}},sample(){var Rn;const J=s();let K=o!==null?Math.max(-1,Math.min(1,l/J)):0,st=o!==null?Math.max(-1,Math.min(1,h/J)):0,Ot=0,Ft=0;(Mt.has("a")||Mt.has("arrowleft"))&&(Ot-=1),(Mt.has("d")||Mt.has("arrowright"))&&(Ot+=1),(Mt.has("w")||Mt.has("arrowup"))&&(Ft-=1),(Mt.has("s")||Mt.has("arrowdown"))&&(Ft+=1),K+=Ot,st+=Ft;let Lt=Math.hypot(K,st);Lt>1&&(K/=Lt,st/=Lt,Lt=1);const F=K,St=st;Lt<e&&(K=0,st=0);const j=i();let ut=j.rightX*K+j.forwardX*-st,Nt=j.rightZ*K+j.forwardZ*-st;const Dt=Math.hypot(ut,Nt);Dt>1&&(ut/=Dt,Nt/=Dt);const qt=performance.now();X(vt.poll(qt));const le=Math.hypot(U,G);z!==null&&(le>=zv?Z=!0:le<Xc&&(Z=!1));const he=z!==null||pt>=0&&qt-pt<Su,ee=he&&Z&&le>=Xc;let we=0,De=0;if(ee){const nn=U/le,En=G/le,Tn=j.rightX*nn+j.forwardX*-En,Xn=j.rightZ*nn+j.forwardZ*-En,Vn=Math.hypot(Tn,Xn)||1;we=Tn/Vn,De=Xn/Vn}!he&&z===null&&(U=0,G=0,pt=-1,Z=!1);const Ve=D;D=null;const Mn=Et;Et=1;const Re={moveX:ut,moveZ:Nt,jumpPressed:V.jump,sprintHeld:tt.sprint||Mt.has("shift"),sprintPressed:V.sprintPressed,resetPressed:V.reset,attackPressed:V.attackPressed,attackHeld:tt.attack||Mt.has("j"),attackReleased:V.attackReleased,skill2Pressed:V.skill2,weaponSlot:B,dummyClickId:kt,aimX:we,aimZ:De,aimActive:ee};V.jump=!1,V.reset=!1,V.sprintPressed=!1,V.attackPressed=!1,V.attackReleased=!1,V.skill2=!1,B=0,kt=0;const Pe=dt.map(nn=>Av(nn,j,bu));dt=[],Pe.length>0&&(Y=Pe[Pe.length-1]);const fn=o!==null?"pointer":Mt.size>0?"keyboard":"idle";return{intents:Re,stickX:K,stickY:st,stickRawX:F,stickRawY:St,stickHeld:o!==null,stickId:o,stickOriginX:r,stickOriginY:c,stickPxX:u,stickPxY:d,stickBad:m,stickScreenOk:S,stickOriginSX:p,stickOriginSY:_,stickScreenX:x,stickScreenY:y,stickScale:E,stickVpTop:((Rn=kv())==null?void 0:Rn.top)??0,stickVpAge:f<0?-1:Math.round(performance.now()-f),aimDX:U,aimDY:G,source:fn,tap:Ve,zoomScale:Mn,gestures:Pe,lastGesture:Y}},dispose(){window.removeEventListener("pointerdown",L),window.removeEventListener("pointermove",R),window.removeEventListener("pointerup",at),window.removeEventListener("pointercancel",at),window.removeEventListener("blur",gt),document.removeEventListener("visibilitychange",Pt),window.removeEventListener("keydown",zt),window.removeEventListener("keyup",Ct),window.removeEventListener("wheel",wt),window.removeEventListener("resize",xt),window.removeEventListener("orientationchange",xt),It&&(It.removeEventListener("resize",xt),It.removeEventListener("scroll",xt)),window.removeEventListener("gesturestart",Xt),vt.reset();for(const J of mt)J()}}}const ec=1,nc=2,ic=4,im=8,ac=16,Ao=32,am=64,sm=128,Gv=[[ec,"atk"],[nc,"dash"],[ic,"link"],[im,"air"],[ac,"hurt"],[Ao,"aim"],[am,"spr"],[sm,"chan"]];function hs(n){if(n===0)return"-";const t=Gv.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const Xv=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],Vv=0,Wv=15,Vc=19,Yv=21,$v=22,Zv=23,jv=24,Ci={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},$n=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,vi=n=>Math.round(n*180/Math.PI*10)/10,Wc=Math.PI*2;function co(n){let t=n%Wc;return t>Math.PI&&(t-=Wc),t<-Math.PI&&(t+=Wc),t}function qv(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=ec),n.dash.phase!=="idle"&&(e|=nc),n.playerLink.phase!=="idle"&&(e|=ic),n.character.grounded||(e|=im),n.playerHurt.type!=="none"&&(e|=ac),t.intents.aimActive&&(e|=Ao),n.character.sprinting&&(e|=am),n.abilities.channeling&&(e|=sm),e}function Kv(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function Jv(n){const t={sampleHz:n.sampleHz??Ci.sampleHz,sampleCapacity:n.sampleCapacity??Ci.sampleCapacity,eventCapacity:n.eventCapacity??Ci.eventCapacity,anomalyCapacity:n.anomalyCapacity??Ci.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??Ci.dirJumpDeg,aimDropDeg:n.aimDropDeg??Ci.aimDropDeg,freezeMs:n.freezeMs??Ci.freezeMs,freezeSpeed:n.freezeSpeed??Ci.freezeSpeed,stickLostMs:n.stickLostMs??Ci.stickLostMs,spikeMs:n.spikeMs??Ci.spikeMs},e=n.meta,i=[],a=[],s=[],o={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let r=!0,c=-1,l=-1e9,h=null,u=0,d=0,f="",m=-1,v=-1,g=-1,p=0,_=-1e9,x=-1,y={},S=null,w=0,E=0,A=0,b=0;function M(C,T){const U=1/t.sampleHz,G=C[Vv];G-l<U-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(C),l=G)}function P(C,T,U,G,Z,rt){const pt=y[C]??-1e9;if(T-pt<1.2)return;if(y[C]=T,C==="frameSpike"){let dt=0;for(const Y of s)Y.kind==="frameSpike"&&dt++;if(dt>=6)return}s.length>=t.anomalyCapacity&&s.shift();let vt=i.slice(-7);rt&&(vt.length===0||vt[vt.length-1]!==rt)&&(vt=[...vt.slice(-6),rt]),s.push({kind:C,t:$n(T),tick:U,ms:Math.round(G),detail:Z,ctx:vt}),C==="dirJump"?o.dirJumps++:C==="aimDrop"?o.aimDrops++:C==="moveFreeze"?o.freezes++:C==="stickLost"?o.stickLosts++:C==="stickJump"?o.stickJumps++:C==="stickBad"?o.stickBads++:C==="stickDrift"&&o.stickDrifts++}function k(C,T,U,G){a.length>=t.eventCapacity&&a.shift(),a.push({t:$n(U),tick:G,k:C,d:T})}function D(C){switch(C.type){case"attack-start":o.attacks++;break;case"hit":o.hits++;break;case"player-hurt":o.hurts++;break;case"link-start":o.links++;break;case"link-hit":o.linkHits++;break;case"roll":o.rolls++;break;case"blink":o.blinks++;break;case"channel-start":o.channels++;break;case"projectile-fire":o.bolts++;break;case"ring-place":o.rings++;break;case"charge-start":o.bowCharges++;break;case"jumped":o.jumps++;break;case"reset":o.resets++;break;case"blocked":_=C.tick;break}}function z(){const C=o,T=C.wallMs/1e3,U=C.gestures,G=vt=>Object.entries(U).filter(([dt])=>dt.endsWith(`.${vt}`)).reduce((dt,[,Y])=>dt+Y,0),Z=[];if(Z.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),Z.push(`运行 ${T.toFixed(1)}s / ${C.frames} 帧 · ${C.fps.toFixed(1)}fps · 最大 ${C.dtMax.toFixed(0)}ms · 尖峰 ${C.spikes} · 步 ${C.steps}`),Z.push(`摇杆活跃 ${T>0?Math.round(C.stickActiveMs/1e3/T*100):0}% · 手势 按下 ${G("press")}（单击 ${G("tap")} / 双击 ${G("doubleTap")} / 拖拽 ${G("drag")} / 长按 ${G("longPress")} / 打断 ${G("cancel")} / 拖放 ${G("release")}）`),Z.push(`攻击 ${C.attacks}(中${C.hits}) · 受击 ${C.hurts} · 派生 ${C.links}(中${C.linkHits}) · 翻滚 ${C.rolls} 闪现 ${C.blinks} · 跳 ${C.jumps} · 复位 ${C.resets}`),Z.push(`法杖 引导${C.channels} 飞弹${C.bolts} 电环${C.rings} · 弓蓄力${C.bowCharges} · 当前武器 ${f||"-"}`),Z.push(`异常 ${C.dirJumps+C.aimDrops+C.freezes+C.stickLosts+C.stickJumps+C.stickBads+C.stickDrifts}（dir ${C.dirJumps} / aim ${C.aimDrops} / freeze ${C.freezes} / stick ${C.stickLosts} / stickJump ${C.stickJumps} / 坏指针 ${C.stickBads} / 坐标漂移 ${C.stickDrifts}） · 掉帧尖峰 ${C.spikes}`+(C.inTurns>0?` · 输入转向 ${C.inTurns} 次（最大 ${C.inTurnMax.toFixed(0)}°）`:"")),s.length>0)for(const vt of s.slice(-6)){Z.push(`· ${vt.kind} @t${vt.t.toFixed(2)} tick${vt.tick} ${vt.ms>0?`${vt.ms}ms `:""}${vt.detail}`);const dt=vt.ctx.map(N=>String(N[Wv])).join(" "),Y=vt.ctx.map(N=>N[Vc]===""||N[Vc]==null?".":String(N[Vc])).join(" ");if(Z.push(`  yaw ${dt}`),Z.push(`  in  ${Y}`),vt.kind==="stickJump"||vt.kind==="stickBad"||vt.kind==="stickLost"){const N=vt.ctx.map($=>`${$[Yv]},${$[$v]}`).join(" "),X=vt.ctx.map($=>`${$[Zv]},${$[jv]}`).join(" ");Z.push(`  o   ${N}`),Z.push(`  p   ${X}`)}}if(a.length>0){Z.push("最近事件：");for(const vt of a.slice(-12))Z.push(`  ${vt.t.toFixed(2)} ${vt.k} ${vt.d}`.trimEnd())}const rt=o.screenFrames>0?`屏幕 screenX/Y（${o.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",pt=o.screenFrames>0&&o.clientFrames>0?` / client 回退 ${o.clientFrames} 帧`:"";return Z.push(`摇杆坐标源 ${rt}${pt}`),Z.push(`UA ${e.ua}`),Z.join(`
`)}return{sample(C,T,U,G=0){o.frames++,T.stickHeld&&(T.stickScreenOk?o.screenFrames++:o.clientFrames++),o.steps+=G,o.wallMs+=U,U>o.dtMax&&(o.dtMax=U),o.fps=o.wallMs>0?o.frames*1e3/o.wallMs:0,o.simS=C.time;const Z=C.time;if(c<0&&(c=Z),A=Z,b=C.tick,!r)return;const rt=C.character,pt=Math.hypot(T.stickX,T.stickY),vt=Math.hypot(rt.velocity.x,rt.velocity.z);f=C.combat.weapon;const dt=qv(C,T),Y=rt.facing,X=Math.hypot(T.intents.moveX,T.intents.moveZ)>.05?Math.atan2(T.intents.moveX,T.intents.moveZ):null;pt>.2&&(o.stickActiveMs+=U);const $=[$n(Z),C.tick,Math.round(U*10)/10,$n(T.stickX),$n(T.stickY),$n(T.stickRawX),$n(T.stickRawY),T.stickHeld?1:0,T.source.slice(0,8),$n(T.intents.moveX),$n(T.intents.moveZ),$n(rt.position.x),$n(rt.position.z),$n(rt.velocity.x),$n(rt.velocity.z),vi(Y),vi(rt.bodyYaw),dt,$n(rt.stride),X===null?"":vi(X),T.stickId===null?"":T.stickId,Math.round(T.stickOriginX),Math.round(T.stickOriginY),Math.round(T.stickPxX),Math.round(T.stickPxY),T.stickBad,Math.round(T.stickVpTop),Math.round(T.stickOriginSX),Math.round(T.stickOriginSY),Math.round(T.stickScreenX),Math.round(T.stickScreenY),T.stickScreenOk?1:0,Math.round(T.stickScale*100)/100];M($);const q=Z*1e3<x;if(U>t.spikeMs&&!q&&Z-c>.6&&(o.spikes++,P("frameSpike",Z,C.tick,U,`dt ${U.toFixed(0)}ms fl=${hs(dt)}`,$)),h!==null&&!q){const gt=Math.abs(vi(co(Y-h))),Pt=Math.abs(vi(co(rt.moveYaw-u))),L=(d|dt)&(ec|nc|ic|ac)|dt&Ao,R=X===null?null:Math.abs(vi(co(Y-X))),Q=X===null||h===null?null:Math.abs(vi(co(h-X))),ft=R!==null&&Q!==null&&R<Q-.5,at=(d&Ao)!==0&&(dt&Ao)===0&&X===null,ht=R!==null&&(R<=12||ft);gt>t.aimDropDeg&&at?P("aimDrop",Z,C.tick,0,`${gt.toFixed(0)}° @aim→none stick(${T.stickX.toFixed(2)},${T.stickY.toFixed(2)}) aim(${T.aimDX.toFixed(0)},${T.aimDY.toFixed(0)}) fl=${hs(dt)}`,$):gt>t.dirJumpDeg&&L===0&&!at&&(ht?(o.inTurns++,gt>o.inTurnMax&&(o.inTurnMax=gt)):P("dirJump",Z,C.tick,0,`${gt.toFixed(0)}° res${R===null?" 无输入":`${R.toFixed(0)}°`} yaw ${vi(h)}→${vi(Y)} in ${X===null?".":vi(X)}° mvΔ${Pt.toFixed(0)}° aim(${T.aimDX.toFixed(0)},${T.aimDY.toFixed(0)}) fl=${hs(d)}→${hs(dt)}`,$))}const ot=(dt&(ec|nc|ic|ac))!==0,Et=C.tick-_<30;pt>.35&&vt<t.freezeSpeed&&!ot&&!Et?(m<0&&(m=Z),Z-m>=t.freezeMs/1e3&&Z>=v&&(P("moveFreeze",Z,C.tick,(Z-m)*1e3,`stick(${T.stickX.toFixed(2)},${T.stickY.toFixed(2)}) v${vt.toFixed(2)} ${T.source} fl=${hs(dt)}`,$),v=Z+1.5,m=-1)):m=-1,T.stickHeld?(pt>p&&(p=pt),p>.35&&pt<.06?(g<0&&(g=Z),Z-g>=t.stickLostMs/1e3&&(P("stickLost",Z,C.tick,(Z-g)*1e3,`raw(${T.stickRawX.toFixed(2)},${T.stickRawY.toFixed(2)}) peak ${p.toFixed(2)} fl=${hs(dt)}`,$),g=-1,p=0)):g=-1):(p=0,g=-1);const Ht=T.stickScale>.2&&T.stickScale<5?T.stickScale:1,tt=T.stickScreenOk,V=tt?T.stickScreenX/Ht:T.stickPxX,B=tt?T.stickScreenY/Ht:T.stickPxY,kt=tt?T.stickOriginSX/Ht:T.stickOriginX,Rt=tt?T.stickOriginSY/Ht:T.stickOriginY,Mt=V-kt,mt=B-Rt;if(T.stickHeld&&T.stickId!==null){const gt=S;if(gt&&gt.held&&gt.id===T.stickId){const Pt=Math.hypot(gt.dx,gt.dy),L=Math.hypot(Mt,mt),R=Math.max(Pt,L),Q=Math.hypot(V-gt.cx,B-gt.cy),ft=Math.abs(vi(co(Math.atan2(mt,Mt)-Math.atan2(gt.dy,gt.dx)))),at=R*ft*Math.PI/180,ht=Math.hypot(kt-gt.ox,Rt-gt.oy);if(R>18&&ft>35&&Q<Math.max(5,at*.35)&&P("stickJump",Z,C.tick,0,`Δ${ft.toFixed(0)}° 手指只动${Q.toFixed(0)}px(弧长应${at.toFixed(0)}px) o(${Math.round(gt.ox)},${Math.round(gt.oy)})→(${Math.round(kt)},${Math.round(Rt)}) 原点位移${ht.toFixed(0)}px p(${Math.round(V)},${Math.round(B)}) raw(${Math.round(Mt)},${Math.round(mt)}) id${T.stickId} ${tt?"src=屏幕":"src=client"}`,$),tt&&gt.screenOk){const zt=Math.hypot(T.stickPxX-gt.x,T.stickPxY-gt.y),Ct=Math.hypot((T.stickScreenX-gt.sx)/Ht,(T.stickScreenY-gt.sy)/Ht);w+=zt-Ct,Math.abs(w)>20&&(P("stickDrift",Z,C.tick,0,`client 相对屏幕漂移 ${w>0?"+":""}${w.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(T.stickPxX)},${Math.round(T.stickPxY)}) screen(${Math.round(T.stickScreenX)},${Math.round(T.stickScreenY)})`,$),w=0)}}S={id:T.stickId,ox:kt,oy:Rt,cx:V,cy:B,x:T.stickPxX,y:T.stickPxY,sx:T.stickScreenX,sy:T.stickScreenY,dx:Mt,dy:mt,held:!0,screenOk:tt}}else S=null,w=0;if(T.stickBad>E){const gt=T.stickBad-E;P("stickBad",Z,C.tick,0,`拦截 ${gt} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${T.stickBad}）o(${Math.round(T.stickOriginX)},${Math.round(T.stickOriginY)}) p(${Math.round(T.stickPxX)},${Math.round(T.stickPxY)}) id${T.stickId??"-"}`,$)}E=T.stickBad,h=Y,u=rt.moveYaw,d=dt},event(C,T){const U=Kv(C);D(C),r&&(C.type==="dash-ready"||C.type==="combo-reset"||C.type==="stepUp"||k(C.type,U,T,C.tick))},gesture(C){const T=`${C.button}.${C.kind}`;o.gestures[T]=(o.gestures[T]??0)+1,r&&(C.kind==="longPress"||C.kind==="doubleTap"||C.kind==="drag"||C.kind==="cancel")&&k(`g:${C.kind}`,`${C.button} ${C.heldMs.toFixed(0)}ms d${C.distance.toFixed(0)}px ${C.angleDeg.toFixed(0)}°`,A,b)},suspend(C){x=A*1e3+C,m=-1,g=-1},setEnabled(C){r=C,C||(h=null,S=null,m=-1,g=-1)},clear(){i.length=0,a.length=0,s.length=0,y={},l=-1e9,h=null,d=0,m=-1,g=-1,p=0,o.frames=0,o.wallMs=0,o.dtMax=0,o.spikes=0,o.stickActiveMs=0,o.attacks=0,o.hits=0,o.hurts=0,o.links=0,o.linkHits=0,o.rolls=0,o.blinks=0,o.channels=0,o.bolts=0,o.rings=0,o.bowCharges=0,o.jumps=0,o.resets=0,o.dirJumps=0,o.aimDrops=0,o.inTurns=0,o.inTurnMax=0,o.freezes=0,o.stickLosts=0,o.stickJumps=0,o.stickBads=0,o.stickDrifts=0,o.screenFrames=0,o.clientFrames=0,w=0,S=null,E=0;for(const C of Object.keys(o.gestures))delete o.gestures[C]},status(){const C=o.simS,T=s.some(U=>C-U.t<8&&(U.kind==="dirJump"||U.kind==="aimDrop"||U.kind==="moveFreeze"||U.kind==="stickLost"||U.kind==="stickJump"||U.kind==="stickBad"||U.kind==="stickDrift"));return{durationS:o.wallMs/1e3,frames:o.frames,events:a.length,anomalies:s.length,alert:T,enabled:r}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...o,gestures:{...o.gestures}},columns:Xv,samples:i.slice(),events:a.slice(),anomalies:s.slice()}},summary:z}}const Qv="dash",ty=6,ey="冲刺标尺",ny="沿刻度跑：翻滚 3.2m / 闪现 5m，看落点差多少",iy=[2,4],ay="square",sy=4.8,oy="#bfe8ff",ry="v9s.15 历史固定工位",cy={dx:0,dz:4.6},ly={dx:-2.8,dz:9.2},hy={id:Qv,index:ty,name:ey,hint:ny,span:iy,shape:ay,radius:sy,color:oy,owner:ry,spawn:cy,label:ly},dy="gait",uy=7,fy="侧后方步态",py="面向假人贴到 1.2m，沿引线按 90 / 135 / 180 走",my=[2,2],gy="circle",xy=3.2,vy="#6fc9a0",yy="v9s.15 历史固定工位",My={dx:0,dz:2.6},_y={dx:0,dz:-2.5},by=[{dx:0,dz:0,mode:"follow"}],Sy={id:dy,index:uy,name:fy,hint:py,span:my,shape:gy,radius:xy,color:vy,owner:yy,spawn:My,label:_y,dummies:by},wy="hub",Ey=1,Ty="中央 8 向",Ay="推杆走 8 个方向 · 松手看停步收相 / 转身踏步",Ry="origin",Py=[2,2],Cy="circle",Dy=3.6,Ly="#8fe7ff",ky="v9s.15 历史固定工位",Iy={dx:0,dz:0},zy={dx:0,dz:-3.1},Fy={minCellX:-4,maxCellX:4,minCellZ:0,maxCellZ:6,density:1,clearMarginCells:2},Uy=[{id:"crate-hub",dx:2.5,dz:-2.5,width:1.1,depth:1.1,height:.8}],Ny=[{dx:-3.4,dz:3.2,fighter:!0,weapon:"sword-shield"},{dx:3.4,dz:3.2,fighter:!0,weapon:"dual-swords"},{dx:0,dz:4.2,fighter:!0,weapon:"greatsword"}],Oy={id:wy,index:Ey,name:Ty,hint:Ay,pin:Ry,span:Py,shape:Cy,radius:Dy,color:Ly,owner:ky,spawn:Iy,label:zy,grass:Fy,obstacles:Uy,dummies:Ny},By="meter",Hy=5,Gy="进度弧",Xy="弓长按 = 黄弧 · 法杖技2 = 紫弧 · 冲刺后 = 青弧冷却",Vy=[2,2],Wy="circle",Yy=3.2,$y="#b48cff",Zy="v9s.15 历史固定工位",jy={dx:0,dz:2.8},qy={dx:0,dz:1.3},Ky=[{id:"pillar-sw",dx:-4,dz:3.6,width:1.2,depth:1.2,height:2.2}],Jy=[{dx:0,dz:-1.4,mode:"idle"}],Qy={id:By,index:Hy,name:Gy,hint:Xy,span:Vy,shape:Wy,radius:Yy,color:$y,owner:Zy,spawn:jy,label:qy,obstacles:Ky,dummies:Jy},tM="rings",eM=2,nM="环状态色阶",iM="同距三假人：中立蓝 / 戒备黄 / 敌对红 · 点选看 3/4 环",aM=[2,2],sM="circle",oM=3.4,rM="#ffc85a",cM="v9s.15 历史固定工位",lM={dx:0,dz:3},hM={dx:0,dz:-2.7},dM=[{dx:-1.6,dz:-.15,mode:"idle"},{dx:0,dz:-.15,mode:"keep-distance"},{dx:1.6,dz:-.15,mode:"attack"}],uM={id:tM,index:eM,name:nM,hint:iM,span:aM,shape:sM,radius:oM,color:rM,owner:cM,spawn:lM,label:hM,dummies:dM},fM="sparring-demo",pM="陪练试验场",mM="动态拼合示范地块 · 点「生成 4 人」就地摆出假人 + 持械陪练，用完点「清除」回基线",gM=[2,2],xM=2,vM="#7fd8c0",yM="v9s.43 动态拼合示范（auto 地块，不写世界坐标，由 assemblePlots 自动分配槽位）",MM={minCellX:-9,maxCellX:9,minCellZ:-9,maxCellZ:9,density:.72},_M={label:"生成 4 人",dummies:2,modes:["idle","keep-distance"],fighters:2,ringRadius:1.5,startDeg:-90},bM={id:fM,name:pM,hint:mM,span:gM,radius:xM,color:vM,owner:yM,grass:MM,testSpawn:_M},SM="terrain",wM=4,EM="地形 / 门洞",TM="宽门 2.4m / 窄门 0.5m · 0.2m 台阶可走，0.6/0.9/1.2m 要跳",AM=[2,2],RM="square",PM=4.8,CM="#7fb8d8",DM="v9s.15 历史固定工位",LM={dx:0,dz:4.6},kM={dx:0,dz:-4.2},IM=[{id:"stair-1",dx:-2.3,dz:1.8,width:2.4,depth:.9,height:.2},{id:"stair-2",dx:-2.3,dz:.9,width:2.4,depth:.9,height:.4},{id:"stair-3",dx:-2.3,dz:0,width:2.4,depth:.9,height:.6},{id:"stair-4",dx:-2.3,dz:-.9,width:2.4,depth:.9,height:.8},{id:"plateau",dx:-2.3,dz:-2.2,width:2.4,depth:1.6,height:.8},{id:"block-060",dx:2.5,dz:1.4,width:1.4,depth:1.4,height:.6},{id:"block-090",dx:2.5,dz:-.5,width:1.4,depth:1.4,height:.9},{id:"block-120",dx:2.5,dz:-2.4,width:1.4,depth:1.4,height:1.2}],zM=[{id:"gate-wide",dx:-2.3,dz:3.1,openingWidth:2.4,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2},{id:"gate-narrow",dx:2.5,dz:3.1,openingWidth:.5,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2}],FM={id:SM,index:wM,name:EM,hint:TM,span:AM,shape:RM,radius:PM,color:CM,owner:DM,spawn:LM,label:kM,steps:IM,doorways:zM},UM="windup",NM=3,OM="起手预警",BM="走进 1.6m：脚下红弧填满 = 命中帧",HM=[2,2],GM="circle",XM=3.2,VM="#ff5a4a",WM="v9s.15 历史固定工位",YM={dx:0,dz:3},$M={dx:0,dz:-2.6},ZM=[{dx:0,dz:-.2,mode:"attack"}],jM={id:UM,index:NM,name:OM,hint:BM,span:HM,shape:GM,radius:XM,color:VM,owner:WM,spawn:YM,label:$M,dummies:ZM},qM="x-destructibles",KM="可破坏物件 · 斜切断口",JM="站高台打=高处断，平地打=低处断；切口朝挥刀方向斜切 · 瓶罐只断预设带",QM=[2,2],t_=2,e_="#e8a05c",n_="可破坏物件（auto 地块，只写相对偏移；id 不带版本代号，由合并闸门统一领号；排在 sparring-demo 之后不抢槽位）",i_=[{id:"pole-a",kind:"pole",dx:-1.25,dz:-1,height:2.4,radius:.11,tiltDeg:20,color:"#8a6b4a",cutColor:"#f0d2a0"},{id:"pole-b",kind:"pole",dx:0,dz:-1,height:2.8,radius:.11,tiltDeg:20,color:"#8a6b4a",cutColor:"#f0d2a0"},{id:"pole-c",kind:"pole",dx:1.25,dz:-1,height:2,radius:.11,tiltDeg:20,color:"#8a6b4a",cutColor:"#f0d2a0"},{id:"jar-a",kind:"jar",dx:-.7,dz:-1.8,height:.9,radius:.28,tiltDeg:14,bands:[.35,.62],color:"#6f8fb8",cutColor:"#d8e4f0"},{id:"jar-b",kind:"jar",dx:.7,dz:-1.8,height:.8,radius:.26,tiltDeg:14,bands:[.4,.68],color:"#b87f6f",cutColor:"#f0d8c8"}],a_={id:qM,name:KM,hint:JM,span:QM,radius:t_,color:e_,owner:n_,destructibles:i_},s_={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,skillDecel:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:0},worldBounds:{minX:-15.5,maxX:15.5,minZ:-15.5,maxZ:15.5},orientation:{bodyTurnRate:7,headTurnRate:12,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},turnInPlace:{enabled:!0,triggerDeg:50,settleDeg:8,durationSec:.45,idleSpeedRatio:.05,inputDeadZone:.12,lookRange:0,armSec:.03,gazeTriggerDeg:120},combat:{comboWindow:.65,settle:.16,attackMoveScale:.3,lungeMoveScale:.08,lungeCurve:1.2,lungeMaxSpeed:17,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3,hitWindow:{start:0,end:.85},comboWindow:.62,notifies:[{at:"windup",u:.7,name:"blade-air",value:.5},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.35,name:"foot-step",value:.6}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,148],[.2,125],[.4,68],[.6,-16],[.8,-78]]},2:{pts:[[0,-77],[.2,-68],[.4,-4],[.6,67],[.8,120]]},3:{stabU:.42}}}},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3,hitWindow:{start:0,end:.9},comboWindow:.5,notifies:[{at:"windup",u:.5,name:"blade-air",value:.45},{at:"active",u:0,name:"blade-air",value:1},{at:"active",u:.6,name:"blade-air",value:.7},{at:"recovery",u:.3,name:"foot-step",value:.5}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,151],[.2,137],[.4,62],[.6,-46],[.8,-128]]},2:{pts:[[0,-3],[.2,7],[.4,57],[.6,105],[.8,135]]},3:{pts:[[0,-150],[.2,-100],[.4,-40],[.6,1],[.8,36]]}}}},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3,hitWindow:{start:0,end:.8},comboWindow:.78,notifies:[{at:"windup",u:.85,name:"blade-air",value:.8},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.45,name:"foot-step",value:1}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,152],[.2,114],[.4,15],[.6,-65],[.8,-120]]},2:{pts:[[0,-124],[.2,-81],[.4,22],[.6,92],[.8,141]]},3:{pts:[[0,90],[.2,39],[.4,8],[.6,4],[.8,7]]}}},groundSlam:{slamU:.6,radius:2.4,knockback:.9,type:"knock",onlyUnhit:!0,holdMul:1.7}},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:.85,minChargeToFire:.15,chargeMoveMultiplier:.55,autoFire:!0,release:{windup:.04,active:.12,recovery:.26,lunge:0},trajectory:{speedMin:9,speedMax:16,launchPitchDeg:3.5,gravity:9,maxLife:2.4,radius:.2,stickMinPitchDeg:50,groundStickLift:.32,stickSec:4,homingRange:14,homingConeDeg:30,turnRateDeg:90,homingTime:.9,aimHeightRatio:.7,verticalTurnRate:18}}},abilities:{arcane:{perWave:3,waves:5,waveInterval:.2,spreadDeg:8,spreadTime:.22,spawnDelay:.035,spawnSideStep:.2,speedJitter:.12,homingRange:8,homingConeDeg:40,turnRateDeg:300,homingTime:1.1,retargetInterval:.25,cooldown:1,speed:10,life:1.4,radius:.3,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.6},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},skills:[{id:"arcane",kind:"channelVolley",slot:"attack",weapon:"staff",paramsRef:"arcane",enabled:!0},{id:"ring",kind:"groundRing",slot:"skill2",weapon:"staff",paramsRef:"ring",enabled:!0}],targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!1,dummyKnockback:.18,hitstop:{light:.045,heavy:.07,knock:.1},hitstopByWeapon:{"sword-shield":1,"dual-swords":.85,greatsword:1.3,staff:1.1,bow:.9},hitstopWarp:{enabled:!0,holdRate:.05,release:.055,payback:1.5,paybackBudget:.6},hitstopComboFalloff:[1,.85,.72]},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5,spar:1.2},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},gaze:{enabled:!0,headLookLimitDeg:55,headGazeRange:7,threatRange:8,recoveryDist:3.5,maxThreats:3,bodyTurnRate:3.2,headTurnRate:8,maxHeadSpeedDeg:300,maxBodySpeedDeg:130,headReturnRate:3.5,headReturnSpeedDeg:120,aimHeightRatio:.75,eyeHeightRatio:.78,headPitchRate:7,maxHeadPitchDeg:28,bodyPitchScale:.3,bodyPitchRate:4,enterThreshold:.05,reactToAttack:!0,reactToApproach:!0,approachDist:2.5,hurtHoldSec:2,hostileModeWeight:.6,spreadFalloff:1.5,behindFalloff:.35,behindAngleDeg:100,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5,spar:1.2},attackBoost:.6,nearDistance:1.5,saturation:2.6},dummies:{count:0,spawn:[],initialModes:["idle","keep-distance","attack","attack","follow","idle"],leashRadius:2.4,radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,strafePeriod:5.2,strafeDuty:.34,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4,fighters:{weapons:["sword-shield","dual-swords","greatsword"],spawn:[],initialModes:["spar","spar","spar"],moveSpeed:2.1,attackInterval:3.4,attackRangeScale:.9,knockbackScale:.6,leashRadius:7,comboCount:0,comboGap:0}},grass:{enabled:!0,footprintCells:2,minHeightCells:1,maxHeightCells:2,bendRadius:.85,maxBendRad:.95,bendRate:18,recoverRate:3.2,stumpRatio:.34,regrow:!0,regrowSec:6,bucketCells:4,wind:{enabled:!0,dirDeg:28,speed:1.35,amplitude:.19,wavelength:4.2,secondWave:{wavelength:1.7,amplitude:.055,speedScale:1.55},gust:{periodSec:7.5,depth:.35},jitter:.16,shadeAmount:.26}}},o_={ground:{size:32,thickness:.4},steps:[],doorways:[],obstacles:[],grid:{cellSize:.5,minX:-16,maxX:16,minZ:-16,maxZ:16},grass:{minCellX:0,maxCellX:0,minCellZ:0,maxCellZ:0,density:.72,bladesPerPatch:[3,6],avoidMargin:.45,seed:20261108}},r_={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:28,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.42},bodyTypes:{standard:{name:"标准",height:1.2,radius:.3},tall:{name:"瘦高",height:1.32,radius:.26,voxel:{headSize:.36,bodyWidth:.34,bodyHeight:.28,limbThickness:.1,legLength:.68,armLength:.5},colors:{body:"#58b39a",head:"#ffe0b2",limb:"#3f8f7c",shoe:"#24443c"}},spider:{name:"蜘蛛",rig:"spider",height:.7,radius:.42,moveSpeed:2.6}},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.6,chestYawMaxDeg:40,stopYawBlendMode:"inStop",stopYawAfterSec:.3,turnStepEnabled:!0,turnStepPitch:.5,turnStepKnee:.35,turnStepDip:.02,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1,backStrafeStartDeg:100,backStrafeFullDeg:132,dirFlipSec:.16,hipYawTrackRateDeg:240,hipYawBackRateDeg:150},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14,moveTakeover:{speed:.35,full:1.2,windup:.55,recovery:1,settle:1}},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13},stretch:{enabled:!0,swingArm:1.45,chargeArm:.88,runLeg:1,torsoGain:.5,impactSquash:.2,impactDecay:11,volumeExp:.5,smoothing:30},swing:{enabled:!0,bodyScale:1,shoulderLift:.055,shoulderPush:.045,shoulderIn:.032,segBlend:.1,segBlendMin:.03,segBlendRef:6,segBlendMax:.14,weaponScale:{greatsword:1,"sword-shield":.78,"dual-swords":.9},combo:{greatsword:["gs.right-left","gs.left-right","gs.overhead"],"sword-shield":["gs.right-left","gs.left-right","ss.shield-bash"],"dual-swords":["ds.right-left","ds.left-right","ds.spin"]},clips:{"gs.right-left":{kind:"right-left",note:"段 1：从右后方扫到左后方。rootYaw 整体带转 ±0.55 rad（≈31°）叠在腰椎 ±60° 上，大剑刃尖水平扫角约 210°",keys:[{t:0,ease:"in",pose:{bodyYaw:1.05,bodyPitch:-.14,bodyRoll:-.18,pelvisX:.06,pelvisZ:-.07,armPitch:-1.15,armYaw:.4,armRoll:.2,elbow:-.5,rootYaw:.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.08,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:0,armRoll:.04,elbow:-.3,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.15,bodyPitch:.16,bodyRoll:.2,pelvisX:-.07,pelvisZ:.11,armPitch:-1.5,armYaw:-.4,armRoll:-.14,elbow:-.12,rootYaw:-.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:-1.55}}]},"gs.left-right":{kind:"left-right",note:"段 2：承接段 1 左后方收势，整体带转 −0.55→+0.55 rad 反向拧回右后方，剑身仍水平",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-.4,armRoll:-.16,elbow:-.5,rootYaw:-.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:0,armRoll:.02,elbow:-.32,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:.4,armRoll:.16,elbow:-.12,rootYaw:.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:1.55}}]},"gs.overhead":{kind:"overhead",note:"段 3：举过头顶（剑身 75° 朝上）向前下劈到 −31°，躯干后仰 → 前压",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.32,bodyRoll:-.05,pelvisX:0,pelvisZ:-.07,armPitch:-1.9,armYaw:-.3,armRoll:.16,elbow:-.55,bladePitch:1.62,bladeTwist:0}},{t:.55,pose:{bodyYaw:.06,bodyPitch:.1,bodyRoll:0,pelvisX:0,pelvisZ:.03,armPitch:-1.1,armYaw:-.26,armRoll:.08,elbow:-.3,bladePitch:.55,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.55,bodyRoll:.02,pelvisX:0,pelvisZ:.13,armPitch:-.15,armYaw:-.2,armRoll:0,elbow:-.1,bladePitch:-.75,bladeTwist:0}}]},"ds.right-left":{kind:"right-left",note:"双持段 1：右手横扫到左后方，左手同时向左后方收（后摆 + 屈肘），两把剑都保持水平",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:1,bodyPitch:-.12,bodyRoll:-.16,pelvisX:.05,pelvisZ:-.06,armPitch:-1.15,armYaw:.9,armRoll:.18,elbow:-.45,armLPitch:.5,armLYaw:-1,armLRoll:.12,elbowL:-1.15,rootYaw:.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.06,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:-.1,armRoll:.04,elbow:-.3,armLPitch:.6,armLYaw:-1,armLRoll:.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.1,bodyPitch:.14,bodyRoll:.18,pelvisX:-.06,pelvisZ:.1,armPitch:-1.5,armYaw:-1.4,armRoll:-.12,elbow:-.12,armLPitch:.65,armLYaw:-.9,armLRoll:.18,elbowL:-1.3,rootYaw:-.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.55}}]},"ds.left-right":{kind:"left-right",note:"双持段 2：左手横扫回右后方，右手同时向右后方收（段 1 的镜像，主挥换到左手）",lead:"L",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-1.4,armRoll:-.16,elbow:-.5,armLPitch:.5,armLYaw:1,armLRoll:-.12,elbowL:-1.15,rootYaw:-.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:-.1,armRoll:.02,elbow:-.32,armLPitch:.6,armLYaw:.9,armLRoll:-.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:1.4,armRoll:.16,elbow:-.12,armLPitch:.65,armLYaw:.8,armLRoll:-.18,elbowL:-1.3,rootYaw:.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:1.55}}]},"ds.spin":{kind:"spin",note:"双持段 3：双剑水平展开（主副手 roll 外张到 ±1.15），整个人原地转一整圈。spin 按 attackProgress 单调推进到 2π≡0，收招自动回正",lead:"R",spin:{turns:1,ease:"inOut",span:.6},keys:[{t:0,ease:"in",pose:{bodyYaw:.1,bodyPitch:-.14,bodyRoll:0,pelvisX:0,pelvisZ:-.05,armPitch:-1.1,armYaw:1.7,armRoll:.3,elbow:-.5,armLPitch:-1.1,armLYaw:0,armLRoll:-.3,elbowL:-.5,bladePitch:.05,bladePitchOff:.05,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:.5,pose:{bodyYaw:0,bodyPitch:.04,bodyRoll:0,pelvisX:0,pelvisZ:.04,armPitch:-1.55,armYaw:2.1,armRoll:.45,elbow:-.05,armLPitch:-1.55,armLYaw:.3,armLRoll:-.45,elbowL:-.05,bladePitch:0,bladePitchOff:0,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:1,pose:{bodyYaw:-.1,bodyPitch:.12,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:-1.3,armYaw:1.9,armRoll:.4,elbow:-.25,armLPitch:-1.3,armLYaw:-.05,armLRoll:-.4,elbowL:-.25,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.35,bladeTwistOff:1.35}}]},"ss.shield-bash":{kind:"bash",note:"剑盾段 3：收盾蓄力 → 左臂持盾猛前顶（臂前伸 + 肘伸直 + 身体前压 + 骨盆前冲）。bladePitchOff 反解让盾面始终正对前方",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.28,bodyRoll:-.04,pelvisX:.01,pelvisZ:-.08,armPitch:.1,armYaw:-.2,armRoll:.1,elbow:-.7,armLPitch:-.7,armLYaw:.1,armLRoll:.15,elbowL:-.9,bladePitch:.2,bladePitchOff:.1,bladeTwist:0}},{t:.55,pose:{bodyYaw:.04,bodyPitch:.15,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:.2,armYaw:-.15,armRoll:.05,elbow:-.6,armLPitch:-1.1,armLYaw:.05,armLRoll:.1,elbowL:-.45,bladePitch:.1,bladePitchOff:.02,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.5,bodyRoll:.02,pelvisX:0,pelvisZ:.18,armPitch:.25,armYaw:-.1,armRoll:0,elbow:-.5,armLPitch:-1.55,armLYaw:0,armLRoll:.05,elbowL:-.05,bladePitch:.05,bladePitchOff:0,bladeTwist:0}}]}},poseIn:.1,poseOut:.16},stance:{"sword-shield":{armSwing:.85,armR:{pitch:-.12,roll:.1,elbow:-.15},armL:{pitch:-.45,roll:.1,elbow:-.75},torsoYaw:.12,bladePitchDeg:-8,blend:.22},"dual-swords":{armSwing:1,armR:{pitch:-.15,roll:.16,elbow:-.45},armL:{pitch:-.15,roll:-.16,elbow:-.45},torsoYaw:0,bladePitchDeg:-12,bladePitchOffDeg:-8,blend:.22},greatsword:{armSwing:.45,armR:{pitch:-.3,roll:.05,elbow:-.55},armL:{pitch:-.2,roll:-.1,elbow:-.65},torsoPitch:.04,bladePitchDeg:-30,blend:.26},staff:{armSwing:.6,armR:{pitch:-.1,roll:.06,elbow:-.35},armL:{pitch:.02,roll:-.08,elbow:-.15},torsoYaw:.06,blend:.22},bow:{armSwing:.55,armL:{pitch:-.15,roll:-.1,elbow:-.2},armR:{pitch:.02,elbow:-.25},torsoYaw:-.08,blend:.22}},spine:{enabled:!0,waist:.58,chest:.42,neck:.16,chestPivot:.42}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6,twoHandInsetX:.15,twoHandGripY:-.1,twoHandMaxStretch:1.3,twoHandMinGrip:.62,twoHandGripStart:1.02,twoHandSlideRate:9,swordCantDeg:10,greatswordCantDeg:0},weaponWrist:{enabled:!0,lag:.042,maxAngle:.72,rate:24,twistLag:.03,maxTwist:.5,runDrag:.11},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},groundRing:{playerRadiusFactor:2.3,dummyRadiusFactor:2.05,thicknessFactor:.16,arcDeg:180,selectedArcDeg:270,opacity:.22,playerOpacity:.44,selectedOpacity:.62,selectedScale:1.06,selectedThicknessScale:1.6,edgeFade:.2,playerColor:"#8fe7ff",neutralColor:"#7fb8d8",lowThreatColor:"#ffc85a",highThreatColor:"#ff3b30",haloRadiusFactor:1.16,haloThicknessFactor:2.6,haloOpacity:.14,haloFadeInSec:.05,haloFadeOutSec:.36,meterRadiusFactor:1.34,meterThicknessFactor:.52,meterOpacity:.9,meterColorCharge:"#ffd166",meterColorChannel:"#b48cff",meterColorCooldown:"#7fb8d8",warnRadiusFactor:1.14,warnThicknessFactor:1.5,warnOpacity:.9,warnColor:"#ff5a4a",areaOpacity:.5,landingOpacity:.55,areaExpandSec:.22},projectiles:{arrowColor:"#ffe3a6",arrowHeadColor:"#fff6d8",arrowTrailColor:"#ffcf86",arrowLength:.72,arrowWidth:.062,arrowHeadSize:.16,arrowGlowSize:.5,trailLength:1.05,trailOpacity:.42,boltColor:"#a9ecff",boltGlowColor:"#7fe3ff",boltShapeX:.42,boltShapeY:.42,boltShapeZ:.85,boltGlowScale:1.6,boltTrailScale:2.2,slashEnabled:!1,slashThickness:.075,slashGlowOpacity:.34},weaponTrail:{enabled:!0,maxSamples:30,minStep:.015,life:.11,minSpeed:5.5,color:"#8fd0ff",intensity:.42,tipBoost:.35,pulseDecay:14},hitstop:{enabled:!0,duration:.07},lab:{enabled:!0,showLabels:!0,padOpacity:.55,labelTextHeight:.82},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],attackArcColor:"#ff6b5e",fighterColors:[{body:"#c85a4a",limb:"#8d3a30",head:"#f0c9a0"},{body:"#c9a03c",limb:"#8a6b22",head:"#f0d6a0"},{body:"#7d6ec4",limb:"#4f4488",head:"#e6d2b0"}]},balance:{enabled:!0,reactionTime:.18,gravity:9.81,autoCounter:!0,maxShift:.045,counterRate:8,predLead:.12,counterBoost:1.6},renderInterp:{enabled:!0,yawSmoothMs:35},groundSlam:{enabled:!0,color:"#e8d8b0",duration:.42,delay:.09,outerScale:1.25,shake:.95},grass:{enabled:!0,bladeWidth:.13,segmentHeight:.5,palette:["#3f7d4f","#569a5c","#6fb56a","#8ccb78","#a9dc86"],stumpColor:"#6b7a48",maxInstances:6e3,debris:{max:220,life:.85,color:"#a9dc86"}}},c_={core:s_,scene:o_,view:r_};function Qh(n){return JSON.parse(JSON.stringify(n))}const td=c_,l_=Object.assign({"../config/plots/dash.json":hy,"../config/plots/gait.json":Sy,"../config/plots/hub.json":Oy,"../config/plots/meter.json":Qy,"../config/plots/rings.json":uM,"../config/plots/sparring-demo.json":bM,"../config/plots/terrain.json":FM,"../config/plots/windup.json":jM,"../config/plots/x-destructibles.json":a_}),h_=Object.values(l_).filter(n=>n&&typeof n.id=="string"&&n.id.length>0),om=$h,Ki=Vg(h_,om),wu=Ki.plots,rm=Qh(td.core),Br=Qh(td.scene),Sn=Qh(td.view);Wg(rm,Br,Ki,om);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class Fi{constructor(t,e,i,a,s="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(s),this.domElement.classList.add("controller"),this.domElement.classList.add(a),this.$name=document.createElement("div"),this.$name.classList.add("name"),Fi.nextNameID=Fi.nextNameID||0,this.$name.id=`lil-gui-name-${++Fi.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class d_ extends Fi{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function jl(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const u_={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:jl,toHexString:jl},Oo={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},f_={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=Oo.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return Oo.toHexString(a)}},p_={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=Oo.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return Oo.toHexString(a)}},m_=[u_,Oo,f_,p_];function g_(n){return m_.find(t=>t.match(n))}class x_ extends Fi{constructor(t,e,i,a){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=g_(this.initialValue),this._rgbScale=a,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const s=jl(this.$text.value);s&&this._setValueFromHexString(s)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class Yc extends Fi{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",a=>{a.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class v_ extends Fi{constructor(t,e,i,a,s,o){super(t,e,i,"number"),this._initInput(),this.min(a),this.max(s);const r=o!==void 0;this.step(r?o:this._getImplicitStep(),r),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let _=parseFloat(this.$input.value);isNaN(_)||(this._stepExplicit&&(_=this._snap(_)),this.setValue(this._clamp(_)))},i=_=>{const x=parseFloat(this.$input.value);isNaN(x)||(this._snapClampSetValue(x+_),this.$input.value=this.getValue())},a=_=>{_.key==="Enter"&&this.$input.blur(),_.code==="ArrowUp"&&(_.preventDefault(),i(this._step*this._arrowKeyMultiplier(_))),_.code==="ArrowDown"&&(_.preventDefault(),i(this._step*this._arrowKeyMultiplier(_)*-1))},s=_=>{this._inputFocused&&(_.preventDefault(),i(this._step*this._normalizeMouseWheel(_)))};let o=!1,r,c,l,h,u;const d=5,f=_=>{r=_.clientX,c=l=_.clientY,o=!0,h=this.getValue(),u=0,window.addEventListener("mousemove",m),window.addEventListener("mouseup",v)},m=_=>{if(o){const x=_.clientX-r,y=_.clientY-c;Math.abs(y)>d?(_.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(x)>d&&v()}if(!o){const x=_.clientY-l;u-=x*this._step*this._arrowKeyMultiplier(_),h+u>this._max?u=this._max-h:h+u<this._min&&(u=this._min-h),this._snapClampSetValue(h+u)}l=_.clientY},v=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",m),window.removeEventListener("mouseup",v)},g=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",a),this.$input.addEventListener("wheel",s,{passive:!1}),this.$input.addEventListener("mousedown",f),this.$input.addEventListener("focus",g),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,_,x,y,S)=>(p-_)/(x-_)*(S-y)+y,e=p=>{const _=this.$slider.getBoundingClientRect();let x=t(p,_.left,_.right,this._min,this._max);this._snapClampSetValue(x)},i=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",a),window.addEventListener("mouseup",s)},a=p=>{e(p.clientX)},s=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",a),window.removeEventListener("mouseup",s)};let o=!1,r,c;const l=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),o=!1},h=p=>{p.touches.length>1||(this._hasScrollBar?(r=p.touches[0].clientX,c=p.touches[0].clientY,o=!0):l(p),window.addEventListener("touchmove",u,{passive:!1}),window.addEventListener("touchend",d))},u=p=>{if(o){const _=p.touches[0].clientX-r,x=p.touches[0].clientY-c;Math.abs(_)>Math.abs(x)?l(p):(window.removeEventListener("touchmove",u),window.removeEventListener("touchend",d))}else p.preventDefault(),e(p.touches[0].clientX)},d=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",u),window.removeEventListener("touchend",d)},f=this._callOnFinishChange.bind(this),m=400;let v;const g=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const x=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+x),this.$input.value=this.getValue(),clearTimeout(v),v=setTimeout(f,m)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",g,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class y_ extends Fi{constructor(t,e,i,a){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(a)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class M_ extends Fi{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",a=>{a.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const __=`.lil-gui {
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
}`;function b_(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let Eu=!1;class sc{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:a,title:s="Controls",closeFolders:o=!1,injectStyles:r=!0,touchStyles:c=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",l=>{(l.code==="Enter"||l.code==="Space")&&(l.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(s),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),c&&this.domElement.classList.add("allow-touch-styles"),!Eu&&r&&(b_(__),Eu=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),a&&this.domElement.style.setProperty("--width",a+"px"),this._closeFolders=o}add(t,e,i,a,s){if(Object(i)===i)return new y_(this,t,e,i);const o=t[e];switch(typeof o){case"number":return new v_(this,t,e,i,a,s);case"boolean":return new d_(this,t,e);case"string":return new M_(this,t,e);case"function":return new Yc(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,i=1){return new x_(this,t,e,i)}addFolder(t){const e=new sc({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof Yc||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof Yc)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=s=>{s.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const a=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=a+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function S_(n,t,e,i){const a=document.getElementById("debug-panel"),s=a?new sc({title:"实验台 · 调试面板",autoPlace:!1,container:a}):new sc({title:"实验台 · 调试面板"}),o=n.config,r=[],c=[],l=wt=>{const Xt=s.addFolder(wt);return c.push(Xt),Xt},h=(wt,Xt)=>{const xt=wt.addFolder(Xt);return r.push(xt),xt},u=l("模拟 / 显示");u.add(e,"timeScale",0,3,.05).name("时间缩放"),u.add(e,"paused").name("暂停"),u.add({step:i.singleStep},"step").name("单步 (1 tick)"),u.add({reset:i.reset},"reset").name("复位全部"),u.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),u.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid),u.add(e,"showLab").name("工位地面盘").onChange(i.onToggleLab),u.add(e,"showLabLabels").name("工位标牌").onChange(i.onToggleLabLabels);const d=h(u,"模块开关");d.add(n.modules,"movement").name("movement"),d.add(n.modules,"combat").name("combat"),d.add(n.modules,"links").name("links"),d.add(n.modules,"orientation").name("orientation"),d.add(n.modules,"turnInPlace").name("turnInPlace"),d.add(n.modules,"targeting").name("targeting"),d.add(n.modules,"hits").name("hits"),d.add(n.modules,"separation").name("separation"),d.add(n.modules,"dash").name("dash"),d.add(n.modules,"camera").name("camera"),d.add(n.modules,"dummies").name("dummies"),d.add(n.modules,"abilities").name("abilities");const f=l("移动 / 输入"),m=h(f,"基础移动参数");m.add(o,"moveSpeed",1,10,.1).name("移动速度"),m.add(o,"sprintMultiplier",1,3,.05).name("冲刺倍率"),m.add(o,"acceleration",1,40,.5).name("加速度"),m.add(o,"friction",1,40,.5).name("摩擦"),m.add(o,"skillDecel",2,40,.5).name("进入技能时的减速速率"),m.add(o,"gravity",5,60,.5).name("重力"),m.add(o,"jumpSpeed",2,16,.2).name("起跳速度"),m.add(o,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),m.add(o,"characterRadius",.1,.8,.01).name("角色半径"),m.add(o,"characterHeight",.6,2.2,.05).name("角色身高"),m.add(o,"strideLength",.3,3,.05).name("基础步幅"),m.add(o,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),m.add(o,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const v=h(f,"摇杆 / 输入");v.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),v.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const g=o.dash,p=h(f,"冲刺 / 闪避");p.add(g,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),p.add(g,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),p.add(g,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),p.add(g,"blinkDistance",1,12,.25).name("闪现距离 (m)"),p.add(g,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),p.add(g,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),p.add(g,"blinkClearVelocity").name("闪现清空速度"),p.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),p.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const _=o.separation,x=h(f,"角色间分离 / 挤压阻力");x.add(_,"iterations",1,8,1).name("迭代次数"),x.add(_,"slop",0,.05,.002).name("额外分离量 (m)"),x.add(_.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),x.add(_.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),x.add(_.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const y=l("动作 / 步态"),S=h(y,"程序化步态");S.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),S.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),S.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),S.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),S.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),S.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),S.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),S.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),S.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),S.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),S.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),S.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),S.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),S.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)"),S.add(t.gait,"backStrafeStartDeg",20,170,1).name("侧后方起步角 (°)"),S.add(t.gait,"backStrafeFullDeg",40,180,1).name("完全后退角 (°)"),S.add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)"),S.add(t.gait,"dirFlipSec",0,.4,.01).name("换向融合时长 (s)"),S.add(t.gait,"hipYawTrackRateDeg",0,600,10).name("下盘目标转速上限 (°/s)"),S.add(t.gait,"hipYawBackRateDeg",0,600,10).name("└ 后退相位上限 (°/s)");const w=h(y,"停步 / 收相 / 惯性");w.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),w.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),w.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),w.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),w.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),w.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),w.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),w.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),w.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),w.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),w.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),w.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const E=h(y,"足部 IK"),A=t.ik;E.add(A,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),E.add(A,"weight",0,1,.01).name("钉地权重"),E.add(A,"attackScale",0,1,.01).name("攻击时权重倍率"),E.add(A,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const b=h(y,"惯性倾斜 / 盆骨"),M=t.lean;b.add(M,"accelGain",0,.1,.002).name("前后加速度增益"),b.add(M,"turnGain",0,.2,.005).name("绕圈侧倾增益"),b.add(M,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),b.add(M,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),b.add(M,"smoothing",1,30,1).name("倾斜平滑速率"),b.add(M,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),b.add(M,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),b.add(M,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),b.add(M,"crouchSmoothing",1,30,1).name("下沉平滑速率");const P=o.orientation,k=h(y,"朝向 / 接敌注视 / 原地转身");k.add(P,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),k.add(P,"headTurnRate",.5,40,.5).name("头部转向速率"),k.add(P,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),k.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),k.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),k.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const D=o.gaze;k.add(D,"headReturnRate",.5,12,.1).name("无目标回正速率 (1/s)"),k.add(D,"headReturnSpeedDeg",20,400,10).name("回正角速度上限 (°/s)"),k.add(D,"bodyTurnRate",.2,12,.1).name("接敌身体转向速率"),k.add(D,"headTurnRate",.5,30,.5).name("接敌头部转向速率"),k.add(D,"maxHeadSpeedDeg",30,900,10).name("头部最大角速度 (°/s)"),k.add(D,"maxBodySpeedDeg",20,600,10).name("身体最大角速度 (°/s)"),k.add(D,"aimHeightRatio",.2,1,.05).name("注视点高度（身高比例）"),k.add(D,"headPitchRate",.5,20,.5).name("头部俯仰速率"),k.add(D,"maxHeadPitchDeg",0,60,1).name("头部俯仰限幅 (°)"),k.add(D,"bodyPitchScale",0,1,.05).name("身体俯仰比例"),k.add(D,"bodyPitchRate",.5,20,.5).name("身体俯仰速率");const z=o.turnInPlace;k.add(z,"enabled").name("启用原地转身 (关=纯插值)"),k.add(z,"triggerDeg",20,180,5).name("触发夹角 (°)"),k.add(z,"gazeTriggerDeg",20,180,5).name("接敌时触发夹角 (°)"),k.add(z,"settleDeg",0,60,1).name("转身保留余角 (°)"),k.add(z,"durationSec",.1,1.5,.02).name("转身时长 (s)"),k.add(z,"idleSpeedRatio",0,.3,.01).name("静止速度比上限"),k.add(z,"inputDeadZone",0,.5,.01).name("起步输入死区"),k.add(z,"armSec",0,.5,.01).name("触发防抖 (s)"),k.add(t.gait,"stopYawBlendMode",["inStop","afterStop"]).name("停步偏差消化窗口"),k.add(t.gait,"stopYawAfterSec",.05,1,.02).name("收相后消化时长 (s)"),k.add(t.gait,"turnStepEnabled").name("转身踏步 (关=滑过去)"),k.add(t.gait,"turnStepPitch",0,1.2,.02).name("踏步前迈 (rad)"),k.add(t.gait,"turnStepKnee",0,1,.02).name("踏步抬膝 (rad)"),k.add(t.gait,"turnStepDip",0,.1,.002).name("踏步重心下沉 (m)");const C=l("战斗 / 命中"),T=o.combat,U=h(C,"连击 / 武器时序"),G=U.add(n.combat,"weapon",_a).name("当前武器");U.add(T,"comboWindow",.1,2,.05).name("连击窗口 (s)"),U.add(T,"settle",0,.8,.01).name("段间停顿 (s)"),U.add(T,"attackMoveScale",0,1,.01).name("攻击时移动比例"),U.add(T,"lungeMoveScale",0,.4,.01).name("跨步时移动比例"),U.add(T,"lungeCurve",.2,4,.1).name("跨步曲线指数 (大=更冲)"),U.add(T,"lungeMaxSpeed",4,30,.5).name("跨步速度上限 (m/s)"),U.add(T,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),U.add(T,"cancelWindow",0,1,.01).name("取消窗口 (s)"),U.add(T,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),U.add(T,"autoCombo").name("按住自动连击"),U.add(T.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),U.add(T.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),U.add(T.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),U.add(T.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率"),U.add(T.bow,"maxChargeTime",.2,2,.05).name("满蓄力时间 (s)"),U.add(T.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),U.add(T.bow,"autoFire").name("蓄满自动放箭 (按住连射)"),U.add(T.bow.trajectory,"gravity",0,24,.5).name("箭矢重力 (m/s²)"),U.add(T.bow.trajectory,"speedMax",8,32,.5).name("满蓄初速 (m/s)"),U.add(T.bow.trajectory,"homingRange",0,30,1).name("自动瞄准距离 (m)"),U.add(T.bow.trajectory,"turnRateDeg",0,240,5).name("箭追踪转向 (°/s)"),U.add(T.bow.trajectory,"homingTime",0,2,.05).name("追踪时长 (s)"),U.add(T.bow.trajectory,"aimHeightRatio",0,1,.05).name("瞄准点高度");const Z=o.abilities;U.add(Z.arcane,"perWave",1,8,1).name("每波飞弹数"),U.add(Z.arcane,"waves",1,12,1).name("每次引导波数"),U.add(Z.arcane,"waveInterval",.05,.8,.01).name("波间隔 (s)"),U.add(Z.arcane,"spreadDeg",0,20,.5).name("波内散布 (度)"),U.add(Z.arcane,"spreadTime",0,.6,.01).name("出膛散开时长 (s)"),U.add(Z.arcane,"spawnDelay",0,.2,.005).name("波内出膛错落 (s)"),U.add(Z.arcane,"speedJitter",0,.5,.02).name("速度浮动比例"),U.add(Z.arcane,"turnRateDeg",0,420,10).name("制导转向 (度/秒)"),U.add(Z.arcane,"retargetInterval",.05,1,.05).name("重新索敌间隔 (s)"),U.add(Z.arcane,"cooldown",0,3,.05).name("引导结束冷却 (s)"),U.add(Z.arcane,"speed",3,24,.5).name("飞弹速度"),U.add(Z.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),U.add(Z.ring,"radius",.5,5,.1).name("电环半径"),U.add(Z.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),U.add(Z.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const rt=o.hits.hitstopWarp;if(rt){const wt=h(C,"卡肉节奏（接触瓦片）");wt.add(rt,"enabled").name("瓦片开（关=硬冻结）"),wt.add(rt,"holdRate",0,.4,.01).name("保持期速率"),wt.add(rt,"release",.005,.2,.005).name("释放时长 (s)"),wt.add(rt,"payback",1,2.5,.05).name("偿还倍率"),wt.add(o.hits.hitstop,"light",0,.2,.005).name("轻击保持 (s)"),wt.add(o.hits.hitstop,"heavy",0,.25,.005).name("重击保持 (s)"),wt.add(o.hits.hitstop,"knock",0,.3,.005).name("击飞保持 (s)")}const pt=o.hits,vt=h(C,"命中 / 受击 / 击退");vt.add(pt,"arcDeg",10,120,5).name("命中扇区半角 (°)"),vt.add(pt,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),vt.add(pt,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),vt.add(pt,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),vt.add(pt.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),vt.add(pt.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),vt.add(pt,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),vt.add(pt,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const dt={get enabled(){return!pt.noDamageToPlayer},set enabled(wt){pt.noDamageToPlayer=!wt}};vt.add(dt,"enabled").name("玩家受击击退");const Y=h(C,"受击分层"),N=t.hurt;Y.add(N,"enabled").name("启用分层受击 (关=旧版对照)"),Y.add(N,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),Y.add(N,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),Y.add(N,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),Y.add(N,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),Y.add(N,"upperShiftScale",0,1,.01).name("上身位移缩放"),Y.add(N,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),Y.add(N.hitHeight,"light",0,1,.01).name("轻击命中部位"),Y.add(N.hitHeight,"heavy",0,1,.01).name("重击命中部位"),Y.add(N.hitHeight,"knock",0,1,.01).name("击退命中部位"),Y.add(N,"leanLight",0,1.5,.01).name("轻击力度"),Y.add(N,"leanHeavy",0,1.5,.01).name("重击力度"),Y.add(N,"leanKnock",0,1.5,.01).name("击退力度"),Y.add(N,"flashStrength",0,2,.05).name("受击闪光强度");for(const{name:wt,p:Xt}of[{name:"打腹 (abdomen)",p:N.abdomen},{name:"打肩 (shoulder)",p:N.shoulder}]){const xt=h(Y,wt);xt.add(Xt,"upperPitch",0,2,.01).name("上身前后倾斜"),xt.add(Xt,"upperRoll",0,2,.01).name("上身侧倾"),xt.add(Xt,"upperYaw",0,1.5,.01).name("肩部扭转"),xt.add(Xt,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),xt.add(Xt,"shift",0,.8,.01).name("身体反应位移"),xt.add(Xt,"drop",0,.4,.01).name("整体下沉"),xt.add(Xt,"back",0,.4,.01).name("屁股向后"),xt.add(Xt,"knee",0,1.6,.01).name("屈膝"),xt.add(Xt,"hip",0,1,.01).name("髋前倾"),xt.add(Xt,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)")}const X=h(C,"派生招"),$=o.links;X.add($,"enabled").name("总开关 (false=旧连击)"),X.add($.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),X.add($.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),X.add($.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),X.add($,"sharedCooldown",0,3,.05).name("共享 CD (s)"),X.add($,"triggerWhileSprinting").name("长跑中可直接触发"),X.add($.search,"range",1,14,.1).name("索敌距离 (m)"),X.add($.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),X.add($.search,"stopDistance",0,3,.05).name("停住距离 (m)");const q=$.moves["sword-shield"];q&&(X.add(q,"enabled").name("剑盾盾击"),X.add(q,"distance",0,8,.1).name("冲锋极限 (m)"),X.add(q,"windup",0,.5,.01).name("前摇 (s)"),X.add(q,"active",0,.8,.01).name("冲锋 / 命中 (s)"),X.add(q,"recovery",0,.8,.01).name("收势 (s)"),X.add(q.hit,"radius",0,4,.05).name("命中半径 (m)"),X.add(q.hit,"width",0,2,.05).name("扫掠半径 (m)"),X.add(q.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),X.add(q.hit,"duration",0,1.5,.01).name("僵直 (s)"));const ot=o.targeting,Et=h(C,"目标辅助");Et.add(ot,"targetAssist").name("启用目标辅助"),Et.add(ot,"range",1,14,.5).name("锁定范围 (m)"),Et.add(ot,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),Et.add(ot,"frontBias",0,4,.1).name("朝向加权"),Et.add(ot,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),Et.add(ot,"maxLungeScale",1,3,.1).name("前冲最大放大");const Ht=l("表现 / 特效"),tt=h(Ht,"挥击幅度 / 刀光"),V=t.animation.swing;tt.add(V,"enabled").name("挥击身体幅度 开"),tt.add(V,"bodyScale",0,1.6,.05).name("躯干 / 骨盆幅度倍率"),tt.add(V,"shoulderLift",0,.12,.005).name("肩部抬升上限 (m)"),tt.add(V,"shoulderPush",0,.1,.005).name("肩部前送上限 (m)"),tt.add(V,"shoulderIn",0,.1,.005).name("双手武器肩内收 (m)"),tt.add(V,"segBlend",0,.35,.01).name("段间过渡兜底 (s)"),tt.add(V,"segBlendMin",.008,.12,.004).name("段间过渡下限 (s)"),tt.add(V,"segBlendRef",2,16,.5).name("段间过渡参考距离 (rad)"),tt.add(V.weaponScale,"greatsword",0,1.6,.05).name("大剑幅度倍率");const B=t.weaponTrail;tt.add(B,"enabled").name("挥击刀光 开"),tt.add(B,"life",.04,.4,.01).name("刀光残留 (s)"),tt.add(B,"intensity",0,1.5,.05).name("刀光亮度"),tt.add(B,"minStep",.005,.1,.005).name("采样最小位移 (m)"),tt.add(t.hitstop,"enabled").name("命中卡肉 / 震屏");const kt=h(Ht,"夸张化 / 四肢伸缩"),Rt=t.animation.stretch;kt.add(Rt,"enabled").name("四肢伸缩 开"),kt.add(Rt,"swingArm",1,1.8,.01).name("挥出时手臂拉伸"),kt.add(Rt,"chargeArm",.7,1,.01).name("蓄力时手臂压缩"),kt.add(Rt,"impactSquash",0,.5,.01).name("命中挤压量"),kt.add(Rt,"impactDecay",2,30,.5).name("挤压回弹速率 (1/s)"),kt.add(Rt,"torsoGain",0,1,.05).name("躯干跟随比例"),kt.add(Rt,"volumeExp",0,1.5,.05).name("体积补偿指数");const Mt=h(Ht,"武器握持 / 腕部"),mt=t.weaponWrist;Mt.add(mt,"enabled").name("腕部滞后 开（关掉=武器焊在手上）"),Mt.add(mt,"lag",0,.08,.002).name("臂速 → 腕滞后"),Mt.add(mt,"maxAngle",0,1.2,.02).name("腕滞后上限 (rad)"),Mt.add(mt,"rate",4,50,1).name("腕部跟随速率 (1/s)"),Mt.add(mt,"twistLag",0,.06,.002).name("躯干扭转 → 剑横甩"),Mt.add(mt,"maxTwist",0,.9,.02).name("横甩上限 (rad)");const gt=t.weaponMount;Mt.add(gt,"twoHandInsetX",0,.3,.01).name("双手武器内收 (m)"),Mt.add(gt,"twoHandGripY",-.5,0,.01).name("副握点在柄上的位置"),Mt.add(gt,"twoHandMaxStretch",1,1.8,.01).name("副手臂长拉伸上限"),Mt.add(gt,"twoHandMinGrip",0,1,.02).name("最低握持权重（1=永不松手）"),Mt.add(gt,"twoHandGripStart",1,1.4,.01).name("开始松手的臂展比"),Mt.add(gt,"twoHandSlideRate",0,30,1).name("握点滑柄跟随速率 (1/s)"),Mt.add(gt,"swordPitchDeg",0,90,1).name("剑前倾角"),Mt.add(gt,"swordYawDeg",0,45,1).name("剑外张角"),Mt.add(gt,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),Mt.add(gt,"staffPitchDeg",0,60,1).name("法杖前倾角");const Pt=l("假人 / 混战"),L=o.dummies,R=h(Pt,"普通假人 AI");R.add(L,"moveSpeed",.5,8,.1).name("移动速度"),R.add(L,"wanderRadius",.5,8,.1).name("游走半径"),R.add(L,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),R.add(L,"followStopDistance",.3,5,.1).name("跟随停距"),R.add(L,"keepDistance",1,10,.1).name("保持距离"),R.add(L,"keepDeadZone",.1,2,.05).name("保持死区"),R.add(L,"attackRange",.5,5,.1).name("攻击距离"),R.add(L,"attackInterval",.3,5,.1).name("攻击间隔 (s)"),R.add(L,"leashRadius",0,8,.1).name("牵引半径 (0=不限)");const Q=L.fighters;if(Q){const wt=h(Pt,"持械陪练（剑盾 / 双刀 / 大剑）");wt.add(Q,"moveSpeed",.5,6,.1).name("移动速度"),wt.add(Q,"attackInterval",.5,8,.1).name("攻击间隔 (s)"),wt.add(Q,"attackRangeScale",.5,1.2,.02).name("起手距离 / 武器 reach"),wt.add(Q,"knockbackScale",0,2,.05).name("击退比例"),wt.add(Q,"leashRadius",0,14,.5).name("牵引半径 (m)"),wt.add(Q,"comboCount",0,3,1).name("连击段数 (0=随武器)"),wt.add(Q,"comboGap",0,.6,.01).name("段间缝隙 (s, 0=用全局)");const Xt=()=>n.dummies.find(It=>It.weapon!==null),xt={get mode(){var It;return((It=Xt())==null?void 0:It.mode)??"spar"},set mode(It){i.setFighterMode(It)}};wt.add(xt,"mode",_p).name("陪练行为（全部）")}const ft=l("相机"),at=h(ft,"基础");at.add(t.camera,"pitchDeg",20,80,1).name("俯角"),at.add(t.camera,"yawDeg",-180,180,1).name("方位角"),at.add(t.camera,"distance",6,35,.5).name("距离"),at.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),at.add(t.camera,"fov",25,90,1).name("FOV");const ht=o.camera,zt=h(ft,"智能构图");zt.add(ht,"radius",2,18,.5).name("威胁评估半径 (m)"),zt.add(ht,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),zt.add(ht,"saturation",.5,8,.1).name("威胁归一化饱和"),zt.add(ht,"pushIn",0,.5,.01).name("无威胁推进比例"),zt.add(ht,"maxPullback",0,1,.02).name("最大拉远比例"),zt.add(ht,"maxOffset",0,6,.1).name("最大构图平移 (m)"),zt.add(ht,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),zt.add(ht,"framingBias",0,1,.05).name("威胁质心平移系数"),zt.add(ht,"attackBoost",0,2,.05).name("挥砍中额外加权"),zt.add(ht.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),zt.add(ht.modeWeight,"spar",0,3,.05).name("陪练模式威胁倍率"),zt.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const Ct=h(ft,"缩放");return Ct.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),Ct.add(t.zoom,"max",1,4,.05).name("最大拉远上限"),Ct.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),Ct.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),Ct.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),Ct.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),Ct.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),Ct.add({reset:i.resetZoom},"reset").name("缩放归 1"),r.forEach(wt=>wt.close()),c.forEach(wt=>wt.close()),s.close(),{gui:s,refreshWeapon:()=>G.updateDisplay()}}function w_(n,t,e){let i=null,a=Number.POSITIVE_INFINITY;for(const s of n){const o=Math.hypot(t-s.x,e-s.z);o<=s.radius&&o<a&&(i=s,a=o)}return i}function E_(n,t){return n.find(e=>e.id===t)??null}function Tu(n,t,e){if(n.length===0)return null;const i=[...n].sort((r,c)=>r.index-c.index),a=i.findIndex(r=>r.id===t),s=e<0?-1:1,o=a<0?s>0?0:i.length-1:(a+s+i.length)%i.length;return i[o]??null}function T_({stations:n,plots:t=[],world:e,view:i,container:a,onResetZoom:s,onPlotTest:o,onClearTestUnits:r}){var A;const c=a??document.getElementById("lab-panel");let l=null,h=null;const u=new Map,d=document.createElement("div");d.id="lab-toast",d.setAttribute("aria-live","polite"),document.body.appendChild(d);let f=0;function m(b){d.textContent=`${b.index} · ${b.name} — ${b.hint}`,d.style.borderColor=b.color,d.classList.add("is-on"),window.clearTimeout(f),f=window.setTimeout(()=>d.classList.remove("is-on"),5e3)}function v(){return w_(n,e.character.position.x,e.character.position.z)}function g(){const b=v(),M=(b==null?void 0:b.id)??null;if(M===l)return;const P=l!==null;l=M;for(const[k,D]of u)D.classList.toggle("is-active",k===M);h&&(h.textContent=b?`${b.index} · ${b.hint}`:"不在任何工位内：点上面的名字传送，或直接走过去",h.style.color=b?"rgba(206, 226, 244, 0.9)":"rgba(150, 172, 192, 0.62)"),b?m(b):P&&d.classList.remove("is-on")}function p(b){const M=typeof b=="number"?n.find(P=>P.index===b)??null:E_(n,b);return M?(Bx(e,M.spawnX,M.spawnZ),e.camera.centroidX=M.spawnX,e.camera.centroidZ=M.spawnZ,i.snapCamera(M.spawnX,e.character.position.y,M.spawnZ),g(),!0):!1}function _(){Wp(e)}function x(b){return p(b.id),o?o(b):0}function y(){return r?r():0}function S(b){const M=typeof b=="number"?t.find(P=>P.index===b):t.find(P=>P.id===b);return M&&M.testSpawn?x(M):0}const w=t.filter(b=>b.testSpawn),E=b=>{var M,P;return(((M=b.testSpawn)==null?void 0:M.dummies)??0)+(((P=b.testSpawn)==null?void 0:P.fighters)??0)};if(c){c.textContent="";const b=document.createElement("div");b.className="lab-head",b.textContent="测试工位";const M=document.createElement("span");M.className="lab-tip",M.textContent="[ / ] 切换",b.appendChild(M),c.appendChild(b);for(const D of[...n].sort((z,C)=>z.index-C.index)){const z=document.createElement("button");z.type="button",z.className="lab-row",z.dataset.station=D.id,z.dataset.uiButton="",z.style.setProperty("--lab-color",D.color),z.setAttribute("aria-label",`传送到工位 ${D.index}：${D.name}`);const C=document.createElement("span");C.className="lab-idx",C.textContent=String(D.index);const T=document.createElement("span");T.className="lab-name",T.textContent=D.name,z.append(C,T),z.addEventListener("pointerdown",U=>{U.preventDefault(),U.stopPropagation(),p(D.id)}),c.appendChild(z),u.set(D.id,z)}if(h=document.createElement("div"),h.className="lab-hint",c.appendChild(h),w.length>0){const D=document.createElement("div");D.className="lab-head lab-subhead",D.textContent="地块测试";const z=document.createElement("span");z.className="lab-tip",z.textContent="就地生成",D.appendChild(z),c.appendChild(D);for(const C of w){const T=document.createElement("div");T.className="lab-row lab-test-row",T.dataset.plot=C.id;const U=document.createElement("span");U.className="lab-name",U.textContent=C.name;const G=document.createElement("button");G.type="button",G.className="lab-btn lab-test",G.dataset.uiButton="",G.dataset.plotTest=C.id,G.textContent=((A=C.testSpawn)==null?void 0:A.label)??`生成 ${E(C)} 人`,G.setAttribute("aria-label",`在${C.name}就地生成 ${E(C)} 个测试单位`),G.addEventListener("pointerdown",Z=>{Z.preventDefault(),Z.stopPropagation(),x(C)}),T.append(U,G),c.appendChild(T)}}const P=document.createElement("div");P.className="lab-foot";const k=document.createElement("button");if(k.type="button",k.className="lab-btn",k.dataset.uiButton="",k.textContent="召回假人",k.setAttribute("aria-label","召回全部假人回到各自工位"),k.addEventListener("pointerdown",D=>{D.preventDefault(),D.stopPropagation(),_()}),P.appendChild(k),w.length>0){const D=document.createElement("button");D.type="button",D.className="lab-btn",D.dataset.uiButton="",D.dataset.clearTestUnits="",D.textContent="清除测试单位",D.setAttribute("aria-label","清除所有由地块测试按钮生成的假人与陪练"),D.addEventListener("pointerdown",z=>{z.preventDefault(),z.stopPropagation(),y()}),P.appendChild(D)}if(s){const D=document.createElement("button");D.type="button",D.className="lab-btn",D.dataset.uiButton="",D.textContent="镜头归位",D.setAttribute("aria-label","把镜头缩放恢复到默认"),D.addEventListener("pointerdown",z=>{z.preventDefault(),z.stopPropagation(),s()}),P.appendChild(D)}c.appendChild(P)}return window.addEventListener("keydown",b=>{var M,P;if(!(b.metaKey||b.ctrlKey||b.altKey))if(b.key==="["){const k=Tu(n,((M=v())==null?void 0:M.id)??l,-1);k&&p(k.id)}else if(b.key==="]"){const k=Tu(n,((P=v())==null?void 0:P.id)??l,1);k&&p(k.id)}else b.key==="\\"&&_()}),g(),{goto:p,current:v,tick:g,recall:_,spawnAt:S,clearSpawned:y,element:c}}const $c=Math.PI*2,Di={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},A_=45,R_=50;function P_(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function lo(n,t,e){const i=P_(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function C_(n,t){return Math.atan2(n,-t)*180/Math.PI}function Au(n,t){return Math.abs(((n-t)%360+540)%360-180)}function nr(n){return(n%360+360)%360}const D_={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function L_(n,t,e,i=8){const a=n.character,s=t.intents,o=Math.hypot(s.moveX,s.moveZ),r=Math.hypot(t.stickRawX,t.stickRawY),c=a.velocity,l=Math.hypot(c.x,c.z),h=o>.001?lo(s.moveX,s.moveZ,e):null,u=l>.15?lo(c.x,c.z,e):null,d=lo(Math.sin(a.facing),Math.cos(a.facing),e),f=s.aimActive&&Math.hypot(s.aimX,s.aimZ)>1e-6?lo(s.aimX,s.aimZ,e):null,m=n.targeting,v=m.hasTarget?lo(Math.sin(m.targetYaw),Math.cos(m.targetYaw),e):null,g=h!==null&&u!==null?Au(h,u):null,p=h!==null?Au(h,d):null,_=g!==null&&g>A_&&o>=.35&&l>=.4;return{inDeg:h,inLen:Math.min(1,o),rawDeg:r>.02?C_(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,r),stickHeld:t.stickHeld,moveDeg:u,speed:l,faceDeg:d,lockDeg:v,lockId:m.targetId,lockDist:m.targetDist,aimDeg:f,gapMove:g,gapFace:p,warnMove:_}}function Ru(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>R_&&(n.inLen>=.35||n.speed>=.4)}const Pu="harness.dirDebug";function k_(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const a=e.querySelector("#dirdbg-canvas"),s=e.querySelector("#dirdbg-toggle"),o={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},r=a.getContext("2d");let c=!0;if(!t)try{c=window.localStorage.getItem(Pu)!=="0"}catch{}function l(){e.classList.toggle("is-off",!c),s&&(s.textContent=c?"方向 ⌄":"方向 ▸",s.setAttribute("aria-expanded",String(c)))}l();function h(x){if(c=x,!t)try{window.localStorage.setItem(Pu,x?"1":"0")}catch{}l()}s==null||s.addEventListener("pointerdown",x=>{x.preventDefault(),x.stopPropagation(),h(!c)}),t||window.addEventListener("keydown",x=>{x.key.toLowerCase()==="v"&&!x.metaKey&&!x.ctrlKey&&h(!c)});const u=Math.min(3,Math.max(1,window.devicePixelRatio||1)),d=118;a.width=Math.round(d*u),a.height=Math.round(d*u);let f=D_,m=0,v="",g=8;function p(x){if(!r)return;const y=d,S=d,w=y/2,E=S/2,A=Math.min(y,S)/2-13;r.setTransform(u,0,0,u,0,0),r.clearRect(0,0,y,S),r.beginPath(),r.arc(w,E,A,0,$c),r.fillStyle="rgba(8, 12, 17, 0.5)",r.fill(),r.lineWidth=1,r.strokeStyle=x.warnMove?"rgba(251, 191, 36, 0.85)":Di.ring,r.stroke(),r.strokeStyle=Di.grid,r.beginPath(),r.moveTo(w-A,E),r.lineTo(w+A,E),r.moveTo(w,E-A),r.lineTo(w,E+A),r.stroke();for(let k=0;k<8;k++){const D=k*Math.PI/4,z=w+Math.sin(D)*(A-3),C=E-Math.cos(D)*(A-3),T=w+Math.sin(D)*A,U=E-Math.cos(D)*A;r.beginPath(),r.moveTo(z,C),r.lineTo(T,U),r.stroke()}const b=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;b>0&&(r.save(),r.setLineDash([2,3]),r.strokeStyle=Di.dead,r.beginPath(),r.arc(w,E,A*b,0,$c),r.stroke(),r.restore());const M=(k,D,z,C,T=!1,U=1)=>{const G=k*Math.PI/180,Z=Math.sin(G),rt=-Math.cos(G),pt=A*Math.max(.14,Math.min(1,D)),vt=w+Z*A*.14,dt=E+rt*A*.14,Y=w+Z*pt,N=E+rt*pt;if(r.save(),r.globalAlpha=U,r.strokeStyle=z,r.fillStyle=z,r.lineWidth=C,r.lineCap="round",T&&r.setLineDash([3,3]),r.beginPath(),r.moveTo(vt,dt),r.lineTo(Y,N),r.stroke(),!T&&pt>A*.3){const X=-rt,$=Z,q=5.2;r.beginPath(),r.moveTo(Y+Z*1.5,N+rt*1.5),r.lineTo(Y-Z*q+X*q*.72,N-rt*q+$*q*.72),r.lineTo(Y-Z*q-X*q*.72,N-rt*q-$*q*.72),r.closePath(),r.fill()}r.restore()},P=(k,D)=>{const z=k*Math.PI/180,C=Math.sin(z),T=-Math.cos(z),U=-T,G=C,Z=A+1.5,rt=Z+6.5;r.save(),r.fillStyle=D,r.strokeStyle=D,r.lineWidth=1,r.beginPath(),r.moveTo(w+C*rt,E+T*rt),r.lineTo(w+C*Z+U*4,E+T*Z+G*4),r.lineTo(w+C*Z-U*4,E+T*Z-G*4),r.closePath(),r.fill(),r.restore()};x.lockDeg!==null&&M(x.lockDeg,1,Di.lock,1,!0,.7),x.rawDeg!==null&&x.stickHeld&&M(x.rawDeg,x.rawLen,Di.raw,1,!0,.9),x.aimDeg!==null&&M(x.aimDeg,1,Di.aim,1.6,!0,.95),M(x.faceDeg,1,Di.face,1.1,!0,.55),x.moveDeg!==null&&M(x.moveDeg,x.speed/Math.max(1,g),Di.move,5.5,!1,.8),x.inDeg!==null&&M(x.inDeg,x.inLen,Di.input,2.2),P(x.faceDeg,Di.face),r.beginPath(),r.arc(w,E,2.2,0,$c),r.fillStyle="rgba(220, 235, 248, 0.85)",r.fill()}function _(x,y){const S=A=>A===null?"-":String(Math.round(nr(A)));o.in.textContent=`入 ${S(x.inDeg)}`,o.mv.textContent=`移 ${S(x.moveDeg)}`,o.fc.textContent=`面 ${S(x.faceDeg)}`;const w=A=>A===null?"-":`${Math.round(A)}°`,E=[`Δ入→移 ${w(x.gapMove)}`,`Δ入→面 ${w(x.gapFace)}`];x.speed>.05&&E.push(`v${x.speed.toFixed(1)}`),x.lockDeg!==null&&E.push(`锁#${x.lockId} ${x.lockDist.toFixed(1)}m`),x.aimDeg!==null&&E.push("拖拽瞄准"),o.gap.textContent=E.join("  "),e.classList.toggle("is-warn",x.warnMove||Ru(x,y))}return{update(x,y,S){if(!c)return;g=Math.max(1,x.config.moveSpeed*Math.max(1,x.config.sprintMultiplier));const w=L_(x,y,S,g);f=w;const E=x.combat.phase!=="idle";p(w);const A=performance.now(),b=`${w.inDeg}|${w.moveDeg}|${w.faceDeg}|${w.lockId}|${w.aimDeg}|${w.warnMove}|${w.speed.toFixed(1)}`;(A-m>90||b!==v)&&(m=A,v=b,_(w,E),e.dataset.in=w.inDeg===null?"":nr(w.inDeg).toFixed(1),e.dataset.mv=w.moveDeg===null?"":nr(w.moveDeg).toFixed(1),e.dataset.fc=nr(w.faceDeg).toFixed(1),e.dataset.warn=w.warnMove||Ru(w,E)?"1":"0")},setEnabled:h,toggle(){return h(!c),c},enabled:()=>c,last:()=>f}}const I_=6,z_=480,Cu=240,Du=128,F_=18,U_=.05,Lu=.16,N_=.02;function ku(n,t,e){if(!e)return"air";if(t<U_)return"both";const i=Math.sin(n);return i>Lu?"L":i<-Lu?"R":"both"}function Iu(n){const t=Math.PI*2;return(n%t+t)%t}function zu(n,t){const e=Math.PI*2;let i=t-n;return i-=Math.round(i/e)*e,n+i}const Fu={L:"#fbbf24",R:"#a78bfa",both:"rgba(148, 163, 184, 0.85)",air:"#38bdf8"},O_={L:"rgba(251, 191, 36, 0.13)",R:"rgba(167, 139, 250, 0.13)",both:"rgba(148, 163, 184, 0.09)",air:"rgba(56, 189, 248, 0.07)"},B_={L:"左踩",R:"右踩",both:"双踩",air:"腾空"};function H_(n,t,e,i){const a=t-n;return{t:i,speed:t,drive:t,raw:t,dv:a,accel:e>1e-4?a/e:0,busy:!1,phase:0,stance:"both",grounded:!0,moving:!1}}function G_(n,t,e,i){const s=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:s,speed:Math.min(s,Math.max(1,i))}}function X_(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function V_(n={}){const t=Math.max(1,n.windowS??I_),e=Math.max(60,n.capacity??z_),i=Math.max(1,n.speedCap??F_),a=!!(n.container&&n.toggle),s=n.container??document.createElement("div");s.id="motiondbg",n.container||(s.setAttribute("data-ui-region",""),document.body.appendChild(s));const o=['<div id="motiondbg-head"><span>速度(位移) / Δv / 相位</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="128"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");s.innerHTML=a?`<div id="motiondbg-body">${o}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${o}</div>`].join("");const r=n.toggle??s.querySelector("#motiondbg-toggle"),c=s.querySelector("#motiondbg-graph"),l=s.querySelector("#motiondbg-read"),h=s.querySelector("#motiondbg-window"),u=s.querySelector("#motiondbg-dir");h.textContent=`${t.toFixed(1)}s`;const d=c.getContext("2d"),f=Math.min(3,Math.max(1,window.devicePixelRatio||1));c.width=Math.round(Cu*f),c.height=Math.round(Du*f);const m=k_({deadZone:n.deadZone,container:u,embedded:!0});let v=!1;function g(M){v=M,s.classList.toggle("is-off",!M),!a&&r&&(r.textContent=M?"手感 ⌄":"手感 ▸",r.setAttribute("aria-expanded",String(M)),r.setAttribute("aria-label",M?"收起手感调试面板":"展开手感调试面板"))}g(!1),a||(r==null||r.addEventListener("pointerdown",M=>{M.preventDefault(),M.stopPropagation(),g(!v)}),window.addEventListener("keydown",M=>{M.key.toLowerCase()==="v"&&!M.metaKey&&!M.ctrlKey&&g(!v)}));const p=[];let _=0,x=null,y=0,S=!1,w=-1,E={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1,phase:0,stance:"both"};function A(M){const P=M-t;let k=0;for(;k<p.length&&p[k].t<P;)k++;return p.slice(k)}function b(M,P){if(!d)return;const k=Cu,D=Du;d.setTransform(f,0,0,f,0,0),d.clearRect(0,0,k,D),d.fillStyle="rgba(8, 12, 17, 0.55)",d.fillRect(0,0,k,D);const z=4,C=4,T=k-z-C,U=9,G=44,Z=58,rt=20,pt=84,vt=38,dt=P-t,Y=tt=>z+Math.max(0,Math.min(1,(tt-dt)/t))*T;for(let tt=0;tt<M.length;tt++){if(!M[tt].busy)continue;const V=Y(M[tt].t),B=tt+1<M.length?Y(M[tt+1].t):V+2;d.fillStyle="rgba(251, 146, 60, 0.13)",d.fillRect(V,U,Math.max(2,B-V),G)}d.strokeStyle="rgba(150, 190, 220, 0.14)",d.lineWidth=1,d.beginPath();for(const tt of[U,U+G/2,U+G])d.moveTo(z,tt),d.lineTo(k-C,tt);d.moveTo(z,Z+rt/2),d.lineTo(k-C,Z+rt/2);for(const tt of[pt,pt+vt/2,pt+vt])d.moveTo(z,tt),d.lineTo(k-C,tt);d.stroke();const X=Math.max(1,...M.map(tt=>tt.speed),...M.map(tt=>tt.drive))*1.15,$=tt=>U+G-tt/X*G;if(M.length>1){d.beginPath(),d.moveTo(Y(M[0].t),$(M[0].speed));for(let tt=1;tt<M.length;tt++)d.lineTo(Y(M[tt].t),$(M[tt].speed));d.strokeStyle="#38bdf8",d.lineWidth=1.8,d.lineJoin="round",d.stroke(),d.lineTo(Y(M[M.length-1].t),U+G),d.lineTo(Y(M[0].t),U+G),d.closePath(),d.fillStyle="rgba(56, 189, 248, 0.14)",d.fill(),d.beginPath(),d.moveTo(Y(M[0].t),$(M[0].drive));for(let tt=1;tt<M.length;tt++)d.lineTo(Y(M[tt].t),$(M[tt].drive));d.setLineDash([3,3]),d.strokeStyle="rgba(190, 205, 220, 0.6)",d.lineWidth=1.2,d.stroke(),d.setLineDash([])}let q=.02;for(const tt of M)q=Math.max(q,Math.abs(tt.dv));q*=1.1;const ot=Z+rt/2,Et=rt/2;for(const tt of M){const V=Math.min(Et,Math.abs(tt.dv)/q*Et);d.fillStyle=tt.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",d.fillRect(Y(tt.t)-.7,tt.dv>=0?ot-V:ot,1.4,Math.max(.5,V))}const Ht=tt=>pt+vt/2-tt*(vt/2-1);for(let tt=0;tt<M.length;tt++){const V=M[tt].stance;if(V==="air")continue;const B=Y(M[tt].t),kt=tt+1<M.length?Y(M[tt+1].t):B+2;d.fillStyle=O_[V],d.fillRect(B,pt,Math.max(1,kt-B),vt)}if(M.length>1){let tt=Y(M[0].t),V=Ht(Math.sin(M[0].phase));for(let kt=1;kt<M.length;kt++){const Rt=M[kt-1],Mt=M[kt],mt=Y(Rt.t),gt=Y(Mt.t),Pt=zu(Rt.phase,Mt.phase),L=Math.max(1,Math.min(16,Math.round((gt-mt)/2)));for(let R=1;R<=L;R++){const Q=R/L,ft=Rt.phase+(Pt-Rt.phase)*Q,at=mt+(gt-mt)*Q,ht=Ht(Math.sin(ft)),zt=R===L?Mt.stance:ku(ft,Rt.moving?1:0,Rt.grounded);d.beginPath(),d.moveTo(tt,V),d.lineTo(at,ht),d.strokeStyle=Fu[zt],d.lineWidth=1.7,d.lineJoin="round",d.stroke(),tt=at,V=ht}}const B=M[M.length-1];d.beginPath(),d.arc(Y(B.t)-1.5,Ht(Math.sin(B.phase)),2.1,0,Math.PI*2),d.fillStyle=Fu[B.stance],d.fill()}d.font="9px ui-monospace, monospace",d.fillStyle="rgba(190, 214, 234, 0.55)",d.textAlign="left",d.fillText(X.toFixed(1),z+2,U+8),d.fillText("v",z+2,U+G-2),d.fillText("Δv",z+2,Z+9),d.fillStyle="rgba(251, 191, 36, 0.75)",d.fillText("L",z+2,pt+8),d.fillStyle="rgba(167, 139, 250, 0.75)",d.fillText("R",z+2,pt+vt-2),d.textAlign="right",d.fillStyle="rgba(190, 214, 234, 0.55)",d.fillText("0",k-C-2,U+G-2),d.textAlign="left"}return{dirDebug:m,update(M,P,k){var Y;const D=performance.now()/1e3,z=w<0?1/60:Math.max(1e-4,Math.min(.25,D-w));w=D;const C=M.character,T={x:C.position.x,z:C.position.z},U=Math.hypot(C.velocity.x,C.velocity.z),{speed:G,raw:Z}=x?G_(x,T,z,i):{speed:0,raw:0},rt=H_(_,G,z,D);rt.drive=U,rt.raw=Z,rt.busy=X_(M);const pt=((Y=n.phaseSource)==null?void 0:Y.call(n))??C.gaitPhase;rt.phase=pt,rt.grounded=C.grounded,rt.moving=S&&Math.abs(zu(y,pt)-y)>N_,y=pt,S=!0,rt.stance=ku(pt,rt.moving?1:0,C.grounded),x=T,_=G,p.push(rt),p.length>e&&p.shift();const vt=A(D);let dt=0;for(const N of vt)dt=Math.max(dt,N.speed);if(E={speed:G,drive:U,raw:Z,dv:rt.dv,accel:rt.accel,peak:dt,samples:vt.length,windowS:t,busy:rt.busy,phase:Iu(pt),stance:rt.stance},m.update(M,P,k),v){b(vt,D);const N=rt.dv>=0?"+":"";l.textContent=`v ${G.toFixed(2)} · 驱 ${U.toFixed(2)} · 峰 ${dt.toFixed(2)} · Δv ${N}${rt.dv.toFixed(3)} · ${vt.length} 帧
φ ${Iu(pt).toFixed(2)} · ${B_[rt.stance]}`}},setEnabled:g,toggle(){return g(!v),v},enabled:()=>v,last:()=>({...E}),samples:()=>A(performance.now()/1e3).map(M=>({...M}))}}const W_=["剑盾","双剑","大剑","法杖","弓"],Y_={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击",spar:"陪练"};function $_(n){return{update(t,e,i,a,s,o,r=!1){const c=t.character,l=c.position,h=c.velocity,u=t.combat,d=t.events.length>0?t.events[t.events.length-1]:null,f=tt=>tt.toFixed(2),m=tt=>(tt*180/Math.PI).toFixed(0),v=W_[_a.indexOf(u.weapon)]??u.weapon,g=Math.round(u.charge*10),p="|".repeat(g)+".".repeat(10-g),_=t.dash,x=_.phase==="active"&&_.duration>0?(1-_.timer/_.duration)*100:0,y=_.phase==="active"?`${_.kind}@${x.toFixed(0)}%`:`${_.kind} cd${f(_.cooldown)}`,S=a.intents.aimActive?`(${f(a.intents.aimX)},${f(a.intents.aimZ)})`:"-",w=h.x*Math.sin(c.bodyYaw)+h.z*Math.cos(c.bodyYaw),E=h.x*Math.cos(c.bodyYaw)-h.z*Math.sin(c.bodyYaw),A=Math.abs(w)+Math.abs(E)+1e-6,b=Math.round(Math.abs(E)/A*100),M=`strafe ${b}%${w<-.05?" back":""}`,P=t.camera,k=`threat ${(P.threat*100).toFixed(0)}%  dist×${f(P.distanceScale)}  off (${f(P.offsetX)},${f(P.offsetZ)})  pitch +${f(P.pitchDelta)}°  n=${P.threatCount}`,D=o?f(o.attackBlend):"-",z=o==null?void 0:o.attackWeights,C=z?`gw ${f(z.gaitScale)}  lw ${f(z.attackLegWeight)}  spd ${f(z.driveSpeed)}`:"-",T=z?`${f(z.gaitScale)}/${f(z.attackLegWeight)}`:"-",U=o?`${o.landing.kind} ${f(o.landing.pulse)} t${f(o.landing.remaining)} vy${f(o.landing.impactVy)}`:"-",G=o?`${o.landing.kind}/${f(o.landing.pulse)}`:"-",Z=(o==null?void 0:o.zoom)!==void 0?`zoom ×${f(o.zoom)}`:"-",rt=o==null?void 0:o.hurt,pt=rt?`hurt ${t.playerHurt.type}  部位h${f(rt.hitHeight)}  脉冲p${f(rt.pulse)}  上身${f(rt.upperShift)}  重心${f(rt.comShift)}  后坐${f(rt.pelvisBack)}  屈膝${f(rt.knee)}`:"-",vt=rt?`${f(rt.hitHeight)}/${f(rt.pulse)}/${f(rt.knee)}`:"-",dt=o==null?void 0:o.ik,Y=dt?`${dt.active?"on":"off"} w${f(dt.weight)} e${f(dt.maxError)}`:"-",N=t.playerLink,X=`link ${N.kind||"-"}  ${N.phase}  prog ${f(N.progress)}  win ${f(N.linkWindow)}s  cd ${f(N.cooldown)}s  hits ${N.hitIds.length}  travel ${f(N.travelled)}/${f(N.travel)}m  id ${N.id}`,$=`${N.phase}/${N.kind||"-"}/w${f(N.linkWindow)}`,q=a.lastGesture,ot=q?`${q.button} ${q.kind} ${q.heldMs.toFixed(0)}ms d${q.distance.toFixed(0)}px ${q.angleDeg.toFixed(0)}° taps${q.taps}`:"-",Et=t.dummies.map(tt=>`${tt.id}:${Y_[tt.mode]}`).join("  ");if(r){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${v} ${u.phase} · lk ${N.phase}${N.kind?`/${N.kind}`:""} w${f(N.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${f(l.x)},${f(l.y)},${f(l.z)})  vel (${f(h.x)},${f(h.y)},${f(h.z)})`,`face ${m(c.facing)}  body ${m(c.bodyYaw)}  head ${m(c.headYaw)}  move ${m(c.moveYaw)}  st${b}%  stick(${f(a.stickX)},${f(a.stickY)}) ${a.source}  str${f(c.stride)}`,`weapon ${v}  ${u.phase}  combo ${u.comboIndex}/3  atk ${f(u.attackProgress)}  dash ${y}  ab ${D}  gw/lw ${T}  land ${G}  ik ${Y}`,`aim ${S}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${f(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${vt}`,`dummies ${Et}  atkCount ${t.dummyAttackCount}  cam ${(P.threat*100).toFixed(0)}% ×${f(P.distanceScale)}  ${Z}  lk ${$}`,`event ${d?`${d.type} ${f(d.value)}`:"-"}  scale ${f(s.timeScale)}${s.paused?" [P]":""}  g ${ot}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${f(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${f(l.x)}, ${f(l.y)}, ${f(l.z)})`,`vel  (${f(h.x)}, ${f(h.y)}, ${f(h.z)})`,`grounded ${c.grounded?"Y":"N"}   sprint ${c.sprinting?"Y":"N"}   facing ${m(c.facing)}deg   atkBlend ${D}   ${C}   land ${U}`,pt,`ik ${Y}  clamped ${dt?dt.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${m(c.facing)}  body ${m(c.bodyYaw)}  head ${m(c.headYaw)}  move ${m(c.moveYaw)}  (head-body ${m(c.headYaw-c.bodyYaw)})  ${M}`,`move (${f(a.intents.moveX)}, ${f(a.intents.moveZ)})  stick (${f(a.stickX)}, ${f(a.stickY)})  ${a.source}  aim ${S}`,`weapon ${v}  phase ${u.phase}  combo ${u.comboIndex}/3  atk ${f(u.attackProgress)}${u.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${_.kind}  phase ${_.phase}  prog ${x.toFixed(0)}%  cd ${f(_.cooldown)}s  id ${_.id}  from (${f(_.fromX)},${f(_.fromZ)}) → to (${f(_.toX)},${f(_.toZ)})`,X,`camera ${k}  ${Z}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${f(t.targeting.targetDist)}m  face ${m(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${p}] ${(u.charge*100).toFixed(0)}%  charging ${u.charging?"Y":"N"}`,`dummies ${Et}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${f(t.impulse.x)}, ${f(t.impulse.z)})`,`event ${d?`${d.type} ${f(d.value)}`:"-"}   scale ${f(s.timeScale)}${s.paused?" [PAUSED]":""}   gesture ${ot}`].join(`
`)}}}const ir=["lab","hud","motion","debug"],Uu={lab:{short:"工位",full:"测试工位"},hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}},Nu={lab:{toggle:"lab-toggle",panel:"lab-panel"},hud:{toggle:"hud-toggle",panel:"hud"},motion:{toggle:"motiondbg-toggle",panel:"motiondbg"},debug:{toggle:"debug-toggle",panel:"debug-panel"}};function Z_(n){var c;const t=Object.fromEntries(ir.map(l=>[l,document.getElementById(Nu[l].toggle)])),e=Object.fromEntries(ir.map(l=>[l,document.getElementById(Nu[l].panel)]));let i={},a=null;function s(){var l,h,u;for(const d of ir){const f=a===d,m=t[d],v=e[d];m&&(m.setAttribute("aria-expanded",String(f)),m.textContent=`${Uu[d].short} ${f?"▾":"▸"}`,m.setAttribute("aria-label",`${f?"收起":"展开"}${Uu[d].full}`)),v&&v.classList.toggle("is-open",f)}n.classList.toggle("is-compact",a!=="hud"),(l=i.motion)==null||l.setEnabled(a==="motion"),a==="debug"?(h=i.debug)==null||h.open():(u=i.debug)==null||u.close()}function o(l){a=a===l?null:l,s()}function r(){a!==null&&(a=null,s())}for(const l of ir)(c=t[l])==null||c.addEventListener("pointerdown",h=>{h.preventDefault(),h.stopPropagation(),o(l)});return window.addEventListener("keydown",l=>{l.key.toLowerCase()==="v"&&!l.metaKey&&!l.ctrlKey&&o("motion")}),s(),{hudCompact:()=>a!=="hud",register(l){i=l,s()},toggle:o,closeAll:r,isOpen:l=>a===l}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ed="170",j_=0,Ou=1,q_=2,cm=1,lm=2,qi=3,ba=0,jn=1,je=2,va=0,zs=1,Ji=2,Bu=3,Hu=4,K_=5,Xa=100,J_=101,Q_=102,tb=103,eb=104,nb=200,ib=201,ab=202,sb=203,ql=204,Kl=205,ob=206,rb=207,cb=208,lb=209,hb=210,db=211,ub=212,fb=213,pb=214,Jl=0,Ql=1,th=2,Xs=3,eh=4,nh=5,ih=6,ah=7,nd=0,mb=1,gb=2,ya=0,xb=1,vb=2,yb=3,Mb=4,_b=5,bb=6,Sb=7,hm=300,Vs=301,Ws=302,sh=303,oh=304,yc=306,rh=1e3,Wa=1001,ch=1002,oi=1003,wb=1004,ar=1005,Ii=1006,Zc=1007,Ya=1008,na=1009,dm=1010,um=1011,Bo=1012,id=1013,ja=1014,zi=1015,$o=1016,ad=1017,sd=1018,Ys=1020,fm=35902,pm=1021,mm=1022,Si=1023,gm=1024,xm=1025,Fs=1026,$s=1027,od=1028,rd=1029,vm=1030,cd=1031,ld=1033,Hr=33776,Gr=33777,Xr=33778,Vr=33779,lh=35840,hh=35841,dh=35842,uh=35843,fh=36196,ph=37492,mh=37496,gh=37808,xh=37809,vh=37810,yh=37811,Mh=37812,_h=37813,bh=37814,Sh=37815,wh=37816,Eh=37817,Th=37818,Ah=37819,Rh=37820,Ph=37821,Wr=36492,Ch=36494,Dh=36495,ym=36283,Lh=36284,kh=36285,Ih=36286,Eb=3200,Tb=3201,Mm=0,Ab=1,fa="",Hn="srgb",js="srgb-linear",Mc="linear",Ne="srgb",ds=7680,Gu=519,Rb=512,Pb=513,Cb=514,_m=515,Db=516,Lb=517,kb=518,Ib=519,zh=35044,Ro=35048,Xu="300 es",ta=2e3,oc=2001;class qs{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const a=this._listeners[t];if(a!==void 0){const s=a.indexOf(e);s!==-1&&a.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const a=i.slice(0);for(let s=0,o=a.length;s<o;s++)a[s].call(this,t);t.target=null}}}const Ln=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Vu=1234567;const Us=Math.PI/180,Ho=180/Math.PI;function Ui(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ln[n&255]+Ln[n>>8&255]+Ln[n>>16&255]+Ln[n>>24&255]+"-"+Ln[t&255]+Ln[t>>8&255]+"-"+Ln[t>>16&15|64]+Ln[t>>24&255]+"-"+Ln[e&63|128]+Ln[e>>8&255]+"-"+Ln[e>>16&255]+Ln[e>>24&255]+Ln[i&255]+Ln[i>>8&255]+Ln[i>>16&255]+Ln[i>>24&255]).toLowerCase()}function An(n,t,e){return Math.max(t,Math.min(e,n))}function hd(n,t){return(n%t+t)%t}function zb(n,t,e,i,a){return i+(n-t)*(a-i)/(e-t)}function Fb(n,t,e){return n!==t?(e-n)/(t-n):0}function Po(n,t,e){return(1-e)*n+e*t}function Ub(n,t,e,i){return Po(n,t,1-Math.exp(-e*i))}function Nb(n,t=1){return t-Math.abs(hd(n,t*2)-t)}function Ob(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function Bb(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function Hb(n,t){return n+Math.floor(Math.random()*(t-n+1))}function Gb(n,t){return n+Math.random()*(t-n)}function Xb(n){return n*(.5-Math.random())}function Vb(n){n!==void 0&&(Vu=n);let t=Vu+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Wb(n){return n*Us}function Yb(n){return n*Ho}function $b(n){return(n&n-1)===0&&n!==0}function Zb(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function jb(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function qb(n,t,e,i,a){const s=Math.cos,o=Math.sin,r=s(e/2),c=o(e/2),l=s((t+i)/2),h=o((t+i)/2),u=s((t-i)/2),d=o((t-i)/2),f=s((i-t)/2),m=o((i-t)/2);switch(a){case"XYX":n.set(r*h,c*u,c*d,r*l);break;case"YZY":n.set(c*d,r*h,c*u,r*l);break;case"ZXZ":n.set(c*u,c*d,r*h,r*l);break;case"XZX":n.set(r*h,c*m,c*f,r*l);break;case"YXY":n.set(c*f,r*h,c*m,r*l);break;case"ZYZ":n.set(c*m,c*f,r*h,r*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+a)}}function bi(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function ze(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Wu={DEG2RAD:Us,RAD2DEG:Ho,generateUUID:Ui,clamp:An,euclideanModulo:hd,mapLinear:zb,inverseLerp:Fb,lerp:Po,damp:Ub,pingpong:Nb,smoothstep:Ob,smootherstep:Bb,randInt:Hb,randFloat:Gb,randFloatSpread:Xb,seededRandom:Vb,degToRad:Wb,radToDeg:Yb,isPowerOfTwo:$b,ceilPowerOfTwo:Zb,floorPowerOfTwo:jb,setQuaternionFromProperEuler:qb,normalize:ze,denormalize:bi};class Yt{constructor(t=0,e=0){Yt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6],this.y=a[1]*e+a[4]*i+a[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(An(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),a=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*i-o*a+t.x,this.y=s*a+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Me{constructor(t,e,i,a,s,o,r,c,l){Me.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,c,l)}set(t,e,i,a,s,o,r,c,l){const h=this.elements;return h[0]=t,h[1]=a,h[2]=r,h[3]=e,h[4]=s,h[5]=c,h[6]=i,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[3],c=i[6],l=i[1],h=i[4],u=i[7],d=i[2],f=i[5],m=i[8],v=a[0],g=a[3],p=a[6],_=a[1],x=a[4],y=a[7],S=a[2],w=a[5],E=a[8];return s[0]=o*v+r*_+c*S,s[3]=o*g+r*x+c*w,s[6]=o*p+r*y+c*E,s[1]=l*v+h*_+u*S,s[4]=l*g+h*x+u*w,s[7]=l*p+h*y+u*E,s[2]=d*v+f*_+m*S,s[5]=d*g+f*x+m*w,s[8]=d*p+f*y+m*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*r*l-i*s*h+i*r*c+a*s*l-a*o*c}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],c=t[6],l=t[7],h=t[8],u=h*o-r*l,d=r*c-h*s,f=l*s-o*c,m=e*u+i*d+a*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/m;return t[0]=u*v,t[1]=(a*l-h*i)*v,t[2]=(r*i-a*o)*v,t[3]=d*v,t[4]=(h*e-a*c)*v,t[5]=(a*s-r*e)*v,t[6]=f*v,t[7]=(i*c-l*e)*v,t[8]=(o*e-i*s)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,a,s,o,r){const c=Math.cos(s),l=Math.sin(s);return this.set(i*c,i*l,-i*(c*o+l*r)+o+t,-a*l,a*c,-a*(-l*o+c*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(jc.makeScale(t,e)),this}rotate(t){return this.premultiply(jc.makeRotation(-t)),this}translate(t,e){return this.premultiply(jc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<9;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const jc=new Me;function bm(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function rc(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Kb(){const n=rc("canvas");return n.style.display="block",n}const Yu={};function bo(n){n in Yu||(Yu[n]=!0,console.warn(n))}function Jb(n,t,e){return new Promise(function(i,a){function s(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:a();break;case n.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}function Qb(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function t1(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Te={enabled:!0,workingColorSpace:js,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===Ne&&(n.r=ea(n.r),n.g=ea(n.g),n.b=ea(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===Ne&&(n.r=Ns(n.r),n.g=Ns(n.g),n.b=Ns(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===fa?Mc:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function ea(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Ns(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const $u=[.64,.33,.3,.6,.15,.06],Zu=[.2126,.7152,.0722],ju=[.3127,.329],qu=new Me().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ku=new Me().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Te.define({[js]:{primaries:$u,whitePoint:ju,transfer:Mc,toXYZ:qu,fromXYZ:Ku,luminanceCoefficients:Zu,workingColorSpaceConfig:{unpackColorSpace:Hn},outputColorSpaceConfig:{drawingBufferColorSpace:Hn}},[Hn]:{primaries:$u,whitePoint:ju,transfer:Ne,toXYZ:qu,fromXYZ:Ku,luminanceCoefficients:Zu,outputColorSpaceConfig:{drawingBufferColorSpace:Hn}}});let us;class e1{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{us===void 0&&(us=rc("canvas")),us.width=t.width,us.height=t.height;const i=us.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=us}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=rc("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const a=i.getImageData(0,0,t.width,t.height),s=a.data;for(let o=0;o<s.length;o++)s[o]=ea(s[o]/255)*255;return i.putImageData(a,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(ea(e[i]/255)*255):e[i]=ea(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let n1=0;class Sm{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:n1++}),this.uuid=Ui(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},a=this.data;if(a!==null){let s;if(Array.isArray(a)){s=[];for(let o=0,r=a.length;o<r;o++)a[o].isDataTexture?s.push(qc(a[o].image)):s.push(qc(a[o]))}else s=qc(a);i.url=s}return e||(t.images[this.uuid]=i),i}}function qc(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?e1.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let i1=0;class zn extends qs{constructor(t=zn.DEFAULT_IMAGE,e=zn.DEFAULT_MAPPING,i=Wa,a=Wa,s=Ii,o=Ya,r=Si,c=na,l=zn.DEFAULT_ANISOTROPY,h=fa){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:i1++}),this.uuid=Ui(),this.name="",this.source=new Sm(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=s,this.minFilter=o,this.anisotropy=l,this.format=r,this.internalFormat=null,this.type=c,this.offset=new Yt(0,0),this.repeat=new Yt(1,1),this.center=new Yt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Me,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==hm)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case rh:t.x=t.x-Math.floor(t.x);break;case Wa:t.x=t.x<0?0:1;break;case ch:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case rh:t.y=t.y-Math.floor(t.y);break;case Wa:t.y=t.y<0?0:1;break;case ch:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}zn.DEFAULT_IMAGE=null;zn.DEFAULT_MAPPING=hm;zn.DEFAULT_ANISOTROPY=1;class sn{constructor(t=0,e=0,i=0,a=1){sn.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=a}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,a){return this.x=t,this.y=e,this.z=i,this.w=a,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*a+o[12]*s,this.y=o[1]*e+o[5]*i+o[9]*a+o[13]*s,this.z=o[2]*e+o[6]*i+o[10]*a+o[14]*s,this.w=o[3]*e+o[7]*i+o[11]*a+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,a,s;const c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],m=c[9],v=c[2],g=c[6],p=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(m+g)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(l+1)/2,y=(f+1)/2,S=(p+1)/2,w=(h+d)/4,E=(u+v)/4,A=(m+g)/4;return x>y&&x>S?x<.01?(i=0,a=.707106781,s=.707106781):(i=Math.sqrt(x),a=w/i,s=E/i):y>S?y<.01?(i=.707106781,a=0,s=.707106781):(a=Math.sqrt(y),i=w/a,s=A/a):S<.01?(i=.707106781,a=.707106781,s=0):(s=Math.sqrt(S),i=E/s,a=A/s),this.set(i,a,s,e),this}let _=Math.sqrt((g-m)*(g-m)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(_)<.001&&(_=1),this.x=(g-m)/_,this.y=(u-v)/_,this.z=(d-h)/_,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class a1 extends qs{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new sn(0,0,t,e),this.scissorTest=!1,this.viewport=new sn(0,0,t,e);const a={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ii,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new zn(a,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let r=0;r<o;r++)this.textures[r]=s.clone(),this.textures[r].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let a=0,s=this.textures.length;a<s;a++)this.textures[a].image.width=t,this.textures[a].image.height=e,this.textures[a].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,a=t.textures.length;i<a;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Sm(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class qa extends a1{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class wm extends zn{constructor(t=null,e=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=oi,this.minFilter=oi,this.wrapR=Wa,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class s1 extends zn{constructor(t=null,e=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=oi,this.minFilter=oi,this.wrapR=Wa,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ma{constructor(t=0,e=0,i=0,a=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=a}static slerpFlat(t,e,i,a,s,o,r){let c=i[a+0],l=i[a+1],h=i[a+2],u=i[a+3];const d=s[o+0],f=s[o+1],m=s[o+2],v=s[o+3];if(r===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(r===1){t[e+0]=d,t[e+1]=f,t[e+2]=m,t[e+3]=v;return}if(u!==v||c!==d||l!==f||h!==m){let g=1-r;const p=c*d+l*f+h*m+u*v,_=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const S=Math.sqrt(x),w=Math.atan2(S,p*_);g=Math.sin(g*w)/S,r=Math.sin(r*w)/S}const y=r*_;if(c=c*g+d*y,l=l*g+f*y,h=h*g+m*y,u=u*g+v*y,g===1-r){const S=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=S,l*=S,h*=S,u*=S}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,a,s,o){const r=i[a],c=i[a+1],l=i[a+2],h=i[a+3],u=s[o],d=s[o+1],f=s[o+2],m=s[o+3];return t[e]=r*m+h*u+c*f-l*d,t[e+1]=c*m+h*d+l*u-r*f,t[e+2]=l*m+h*f+r*d-c*u,t[e+3]=h*m-r*u-c*d-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,a){return this._x=t,this._y=e,this._z=i,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,a=t._y,s=t._z,o=t._order,r=Math.cos,c=Math.sin,l=r(i/2),h=r(a/2),u=r(s/2),d=c(i/2),f=c(a/2),m=c(s/2);switch(o){case"XYZ":this._x=d*h*u+l*f*m,this._y=l*f*u-d*h*m,this._z=l*h*m+d*f*u,this._w=l*h*u-d*f*m;break;case"YXZ":this._x=d*h*u+l*f*m,this._y=l*f*u-d*h*m,this._z=l*h*m-d*f*u,this._w=l*h*u+d*f*m;break;case"ZXY":this._x=d*h*u-l*f*m,this._y=l*f*u+d*h*m,this._z=l*h*m+d*f*u,this._w=l*h*u-d*f*m;break;case"ZYX":this._x=d*h*u-l*f*m,this._y=l*f*u+d*h*m,this._z=l*h*m-d*f*u,this._w=l*h*u+d*f*m;break;case"YZX":this._x=d*h*u+l*f*m,this._y=l*f*u+d*h*m,this._z=l*h*m-d*f*u,this._w=l*h*u-d*f*m;break;case"XZY":this._x=d*h*u-l*f*m,this._y=l*f*u-d*h*m,this._z=l*h*m+d*f*u,this._w=l*h*u+d*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,a=Math.sin(i);return this._x=t.x*a,this._y=t.y*a,this._z=t.z*a,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],a=e[4],s=e[8],o=e[1],r=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=i+r+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(s-l)*f,this._z=(o-a)*f}else if(i>r&&i>u){const f=2*Math.sqrt(1+i-r-u);this._w=(h-c)/f,this._x=.25*f,this._y=(a+o)/f,this._z=(s+l)/f}else if(r>u){const f=2*Math.sqrt(1+r-i-u);this._w=(s-l)/f,this._x=(a+o)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+u-i-r);this._w=(o-a)/f,this._x=(s+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(An(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const a=Math.min(1,e/i);return this.slerp(t,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,a=t._y,s=t._z,o=t._w,r=e._x,c=e._y,l=e._z,h=e._w;return this._x=i*h+o*r+a*l-s*c,this._y=a*h+o*c+s*r-i*l,this._z=s*h+o*l+i*c-a*r,this._w=o*h-i*r-a*c-s*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,a=this._y,s=this._z,o=this._w;let r=o*t._w+i*t._x+a*t._y+s*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=o,this._x=i,this._y=a,this._z=s,this;const c=1-r*r;if(c<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*i+e*this._x,this._y=f*a+e*this._y,this._z=f*s+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,r),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=o*u+this._w*d,this._x=i*u+this._x*d,this._y=a*u+this._y*d,this._z=s*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),a=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(a*Math.sin(t),a*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class W{constructor(t=0,e=0,i=0){W.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Ju.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Ju.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*a,this.y=s[1]*e+s[4]*i+s[7]*a,this.z=s[2]*e+s[5]*i+s[8]*a,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=t.elements,o=1/(s[3]*e+s[7]*i+s[11]*a+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*a+s[12])*o,this.y=(s[1]*e+s[5]*i+s[9]*a+s[13])*o,this.z=(s[2]*e+s[6]*i+s[10]*a+s[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,a=this.z,s=t.x,o=t.y,r=t.z,c=t.w,l=2*(o*a-r*i),h=2*(r*e-s*a),u=2*(s*i-o*e);return this.x=e+c*l+o*u-r*h,this.y=i+c*h+r*l-s*u,this.z=a+c*u+s*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*a,this.y=s[1]*e+s[5]*i+s[9]*a,this.z=s[2]*e+s[6]*i+s[10]*a,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,a=t.y,s=t.z,o=e.x,r=e.y,c=e.z;return this.x=a*c-s*r,this.y=s*o-i*c,this.z=i*r-a*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Kc.copy(this).projectOnVector(t),this.sub(Kc)}reflect(t){return this.sub(Kc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(An(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,a=this.z-t.z;return e*e+i*i+a*a}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const a=Math.sin(e)*t;return this.x=a*Math.sin(i),this.y=Math.cos(e)*t,this.z=a*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),a=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=a,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Kc=new W,Ju=new Ma;class Ja{constructor(t=new W(1/0,1/0,1/0),e=new W(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(yi.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(yi.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=yi.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,r=s.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,yi):yi.fromBufferAttribute(s,o),yi.applyMatrix4(t.matrixWorld),this.expandByPoint(yi);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),sr.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),sr.copy(i.boundingBox)),sr.applyMatrix4(t.matrixWorld),this.union(sr)}const a=t.children;for(let s=0,o=a.length;s<o;s++)this.expandByObject(a[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,yi),yi.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ho),or.subVectors(this.max,ho),fs.subVectors(t.a,ho),ps.subVectors(t.b,ho),ms.subVectors(t.c,ho),oa.subVectors(ps,fs),ra.subVectors(ms,ps),Ca.subVectors(fs,ms);let e=[0,-oa.z,oa.y,0,-ra.z,ra.y,0,-Ca.z,Ca.y,oa.z,0,-oa.x,ra.z,0,-ra.x,Ca.z,0,-Ca.x,-oa.y,oa.x,0,-ra.y,ra.x,0,-Ca.y,Ca.x,0];return!Jc(e,fs,ps,ms,or)||(e=[1,0,0,0,1,0,0,0,1],!Jc(e,fs,ps,ms,or))?!1:(rr.crossVectors(oa,ra),e=[rr.x,rr.y,rr.z],Jc(e,fs,ps,ms,or))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,yi).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(yi).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Vi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Vi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Vi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Vi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Vi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Vi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Vi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Vi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Vi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Vi=[new W,new W,new W,new W,new W,new W,new W,new W],yi=new W,sr=new Ja,fs=new W,ps=new W,ms=new W,oa=new W,ra=new W,Ca=new W,ho=new W,or=new W,rr=new W,Da=new W;function Jc(n,t,e,i,a){for(let s=0,o=n.length-3;s<=o;s+=3){Da.fromArray(n,s);const r=a.x*Math.abs(Da.x)+a.y*Math.abs(Da.y)+a.z*Math.abs(Da.z),c=t.dot(Da),l=e.dot(Da),h=i.dot(Da);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>r)return!1}return!0}const o1=new Ja,uo=new W,Qc=new W;class Ks{constructor(t=new W,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):o1.setFromPoints(t).getCenter(i);let a=0;for(let s=0,o=t.length;s<o;s++)a=Math.max(a,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(a),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;uo.subVectors(t,this.center);const e=uo.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),a=(i-this.radius)*.5;this.center.addScaledVector(uo,a/i),this.radius+=a}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Qc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(uo.copy(t.center).add(Qc)),this.expandByPoint(uo.copy(t.center).sub(Qc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Wi=new W,tl=new W,cr=new W,ca=new W,el=new W,lr=new W,nl=new W;class dd{constructor(t=new W,e=new W(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Wi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Wi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Wi.copy(this.origin).addScaledVector(this.direction,e),Wi.distanceToSquared(t))}distanceSqToSegment(t,e,i,a){tl.copy(t).add(e).multiplyScalar(.5),cr.copy(e).sub(t).normalize(),ca.copy(this.origin).sub(tl);const s=t.distanceTo(e)*.5,o=-this.direction.dot(cr),r=ca.dot(this.direction),c=-ca.dot(cr),l=ca.lengthSq(),h=Math.abs(1-o*o);let u,d,f,m;if(h>0)if(u=o*c-r,d=o*r-c,m=s*h,u>=0)if(d>=-m)if(d<=m){const v=1/h;u*=v,d*=v,f=u*(u+o*d+2*r)+d*(o*u+d+2*c)+l}else d=s,u=Math.max(0,-(o*d+r)),f=-u*u+d*(d+2*c)+l;else d=-s,u=Math.max(0,-(o*d+r)),f=-u*u+d*(d+2*c)+l;else d<=-m?(u=Math.max(0,-(-o*s+r)),d=u>0?-s:Math.min(Math.max(-s,-c),s),f=-u*u+d*(d+2*c)+l):d<=m?(u=0,d=Math.min(Math.max(-s,-c),s),f=d*(d+2*c)+l):(u=Math.max(0,-(o*s+r)),d=u>0?s:Math.min(Math.max(-s,-c),s),f=-u*u+d*(d+2*c)+l);else d=o>0?-s:s,u=Math.max(0,-(o*d+r)),f=-u*u+d*(d+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,u),a&&a.copy(tl).addScaledVector(cr,d),f}intersectSphere(t,e){Wi.subVectors(t.center,this.origin);const i=Wi.dot(this.direction),a=Wi.dot(Wi)-i*i,s=t.radius*t.radius;if(a>s)return null;const o=Math.sqrt(s-a),r=i-o,c=i+o;return c<0?null:r<0?this.at(c,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,a,s,o,r,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(i=(t.min.x-d.x)*l,a=(t.max.x-d.x)*l):(i=(t.max.x-d.x)*l,a=(t.min.x-d.x)*l),h>=0?(s=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(s=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),i>o||s>a||((s>i||isNaN(i))&&(i=s),(o<a||isNaN(a))&&(a=o),u>=0?(r=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(r=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),i>c||r>a)||((r>i||i!==i)&&(i=r),(c<a||a!==a)&&(a=c),a<0)?null:this.at(i>=0?i:a,e)}intersectsBox(t){return this.intersectBox(t,Wi)!==null}intersectTriangle(t,e,i,a,s){el.subVectors(e,t),lr.subVectors(i,t),nl.crossVectors(el,lr);let o=this.direction.dot(nl),r;if(o>0){if(a)return null;r=1}else if(o<0)r=-1,o=-o;else return null;ca.subVectors(this.origin,t);const c=r*this.direction.dot(lr.crossVectors(ca,lr));if(c<0)return null;const l=r*this.direction.dot(el.cross(ca));if(l<0||c+l>o)return null;const h=-r*ca.dot(nl);return h<0?null:this.at(h/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ce{constructor(t,e,i,a,s,o,r,c,l,h,u,d,f,m,v,g){Ce.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,c,l,h,u,d,f,m,v,g)}set(t,e,i,a,s,o,r,c,l,h,u,d,f,m,v,g){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=a,p[1]=s,p[5]=o,p[9]=r,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=m,p[11]=v,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ce().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,a=1/gs.setFromMatrixColumn(t,0).length(),s=1/gs.setFromMatrixColumn(t,1).length(),o=1/gs.setFromMatrixColumn(t,2).length();return e[0]=i[0]*a,e[1]=i[1]*a,e[2]=i[2]*a,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,a=t.y,s=t.z,o=Math.cos(i),r=Math.sin(i),c=Math.cos(a),l=Math.sin(a),h=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){const d=o*h,f=o*u,m=r*h,v=r*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=f+m*l,e[5]=d-v*l,e[9]=-r*c,e[2]=v-d*l,e[6]=m+f*l,e[10]=o*c}else if(t.order==="YXZ"){const d=c*h,f=c*u,m=l*h,v=l*u;e[0]=d+v*r,e[4]=m*r-f,e[8]=o*l,e[1]=o*u,e[5]=o*h,e[9]=-r,e[2]=f*r-m,e[6]=v+d*r,e[10]=o*c}else if(t.order==="ZXY"){const d=c*h,f=c*u,m=l*h,v=l*u;e[0]=d-v*r,e[4]=-o*u,e[8]=m+f*r,e[1]=f+m*r,e[5]=o*h,e[9]=v-d*r,e[2]=-o*l,e[6]=r,e[10]=o*c}else if(t.order==="ZYX"){const d=o*h,f=o*u,m=r*h,v=r*u;e[0]=c*h,e[4]=m*l-f,e[8]=d*l+v,e[1]=c*u,e[5]=v*l+d,e[9]=f*l-m,e[2]=-l,e[6]=r*c,e[10]=o*c}else if(t.order==="YZX"){const d=o*c,f=o*l,m=r*c,v=r*l;e[0]=c*h,e[4]=v-d*u,e[8]=m*u+f,e[1]=u,e[5]=o*h,e[9]=-r*h,e[2]=-l*h,e[6]=f*u+m,e[10]=d-v*u}else if(t.order==="XZY"){const d=o*c,f=o*l,m=r*c,v=r*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+v,e[5]=o*h,e[9]=f*u-m,e[2]=m*u-f,e[6]=r*h,e[10]=v*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(r1,t,c1)}lookAt(t,e,i){const a=this.elements;return ni.subVectors(t,e),ni.lengthSq()===0&&(ni.z=1),ni.normalize(),la.crossVectors(i,ni),la.lengthSq()===0&&(Math.abs(i.z)===1?ni.x+=1e-4:ni.z+=1e-4,ni.normalize(),la.crossVectors(i,ni)),la.normalize(),hr.crossVectors(ni,la),a[0]=la.x,a[4]=hr.x,a[8]=ni.x,a[1]=la.y,a[5]=hr.y,a[9]=ni.y,a[2]=la.z,a[6]=hr.z,a[10]=ni.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[4],c=i[8],l=i[12],h=i[1],u=i[5],d=i[9],f=i[13],m=i[2],v=i[6],g=i[10],p=i[14],_=i[3],x=i[7],y=i[11],S=i[15],w=a[0],E=a[4],A=a[8],b=a[12],M=a[1],P=a[5],k=a[9],D=a[13],z=a[2],C=a[6],T=a[10],U=a[14],G=a[3],Z=a[7],rt=a[11],pt=a[15];return s[0]=o*w+r*M+c*z+l*G,s[4]=o*E+r*P+c*C+l*Z,s[8]=o*A+r*k+c*T+l*rt,s[12]=o*b+r*D+c*U+l*pt,s[1]=h*w+u*M+d*z+f*G,s[5]=h*E+u*P+d*C+f*Z,s[9]=h*A+u*k+d*T+f*rt,s[13]=h*b+u*D+d*U+f*pt,s[2]=m*w+v*M+g*z+p*G,s[6]=m*E+v*P+g*C+p*Z,s[10]=m*A+v*k+g*T+p*rt,s[14]=m*b+v*D+g*U+p*pt,s[3]=_*w+x*M+y*z+S*G,s[7]=_*E+x*P+y*C+S*Z,s[11]=_*A+x*k+y*T+S*rt,s[15]=_*b+x*D+y*U+S*pt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],a=t[8],s=t[12],o=t[1],r=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],f=t[14],m=t[3],v=t[7],g=t[11],p=t[15];return m*(+s*c*u-a*l*u-s*r*d+i*l*d+a*r*f-i*c*f)+v*(+e*c*f-e*l*d+s*o*d-a*o*f+a*l*h-s*c*h)+g*(+e*l*u-e*r*f-s*o*u+i*o*f+s*r*h-i*l*h)+p*(-a*r*h-e*c*u+e*r*d+a*o*u-i*o*d+i*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const a=this.elements;return t.isVector3?(a[12]=t.x,a[13]=t.y,a[14]=t.z):(a[12]=t,a[13]=e,a[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],f=t[11],m=t[12],v=t[13],g=t[14],p=t[15],_=u*g*l-v*d*l+v*c*f-r*g*f-u*c*p+r*d*p,x=m*d*l-h*g*l-m*c*f+o*g*f+h*c*p-o*d*p,y=h*v*l-m*u*l+m*r*f-o*v*f-h*r*p+o*u*p,S=m*u*c-h*v*c-m*r*d+o*v*d+h*r*g-o*u*g,w=e*_+i*x+a*y+s*S;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/w;return t[0]=_*E,t[1]=(v*d*s-u*g*s-v*a*f+i*g*f+u*a*p-i*d*p)*E,t[2]=(r*g*s-v*c*s+v*a*l-i*g*l-r*a*p+i*c*p)*E,t[3]=(u*c*s-r*d*s-u*a*l+i*d*l+r*a*f-i*c*f)*E,t[4]=x*E,t[5]=(h*g*s-m*d*s+m*a*f-e*g*f-h*a*p+e*d*p)*E,t[6]=(m*c*s-o*g*s-m*a*l+e*g*l+o*a*p-e*c*p)*E,t[7]=(o*d*s-h*c*s+h*a*l-e*d*l-o*a*f+e*c*f)*E,t[8]=y*E,t[9]=(m*u*s-h*v*s-m*i*f+e*v*f+h*i*p-e*u*p)*E,t[10]=(o*v*s-m*r*s+m*i*l-e*v*l-o*i*p+e*r*p)*E,t[11]=(h*r*s-o*u*s-h*i*l+e*u*l+o*i*f-e*r*f)*E,t[12]=S*E,t[13]=(h*v*a-m*u*a+m*i*d-e*v*d-h*i*g+e*u*g)*E,t[14]=(m*r*a-o*v*a-m*i*c+e*v*c+o*i*g-e*r*g)*E,t[15]=(o*u*a-h*r*a+h*i*c-e*u*c-o*i*d+e*r*d)*E,this}scale(t){const e=this.elements,i=t.x,a=t.y,s=t.z;return e[0]*=i,e[4]*=a,e[8]*=s,e[1]*=i,e[5]*=a,e[9]*=s,e[2]*=i,e[6]*=a,e[10]*=s,e[3]*=i,e[7]*=a,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],a=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,a))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),a=Math.sin(e),s=1-i,o=t.x,r=t.y,c=t.z,l=s*o,h=s*r;return this.set(l*o+i,l*r-a*c,l*c+a*r,0,l*r+a*c,h*r+i,h*c-a*o,0,l*c-a*r,h*c+a*o,s*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,a,s,o){return this.set(1,i,s,0,t,1,o,0,e,a,1,0,0,0,0,1),this}compose(t,e,i){const a=this.elements,s=e._x,o=e._y,r=e._z,c=e._w,l=s+s,h=o+o,u=r+r,d=s*l,f=s*h,m=s*u,v=o*h,g=o*u,p=r*u,_=c*l,x=c*h,y=c*u,S=i.x,w=i.y,E=i.z;return a[0]=(1-(v+p))*S,a[1]=(f+y)*S,a[2]=(m-x)*S,a[3]=0,a[4]=(f-y)*w,a[5]=(1-(d+p))*w,a[6]=(g+_)*w,a[7]=0,a[8]=(m+x)*E,a[9]=(g-_)*E,a[10]=(1-(d+v))*E,a[11]=0,a[12]=t.x,a[13]=t.y,a[14]=t.z,a[15]=1,this}decompose(t,e,i){const a=this.elements;let s=gs.set(a[0],a[1],a[2]).length();const o=gs.set(a[4],a[5],a[6]).length(),r=gs.set(a[8],a[9],a[10]).length();this.determinant()<0&&(s=-s),t.x=a[12],t.y=a[13],t.z=a[14],Mi.copy(this);const l=1/s,h=1/o,u=1/r;return Mi.elements[0]*=l,Mi.elements[1]*=l,Mi.elements[2]*=l,Mi.elements[4]*=h,Mi.elements[5]*=h,Mi.elements[6]*=h,Mi.elements[8]*=u,Mi.elements[9]*=u,Mi.elements[10]*=u,e.setFromRotationMatrix(Mi),i.x=s,i.y=o,i.z=r,this}makePerspective(t,e,i,a,s,o,r=ta){const c=this.elements,l=2*s/(e-t),h=2*s/(i-a),u=(e+t)/(e-t),d=(i+a)/(i-a);let f,m;if(r===ta)f=-(o+s)/(o-s),m=-2*o*s/(o-s);else if(r===oc)f=-o/(o-s),m=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,a,s,o,r=ta){const c=this.elements,l=1/(e-t),h=1/(i-a),u=1/(o-s),d=(e+t)*l,f=(i+a)*h;let m,v;if(r===ta)m=(o+s)*u,v=-2*u;else if(r===oc)m=s*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-f,c[2]=0,c[6]=0,c[10]=v,c[14]=-m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<16;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const gs=new W,Mi=new Ce,r1=new W(0,0,0),c1=new W(1,1,1),la=new W,hr=new W,ni=new W,Qu=new Ce,tf=new Ma;class Ni{constructor(t=0,e=0,i=0,a=Ni.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=a}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,a=this._order){return this._x=t,this._y=e,this._z=i,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const a=t.elements,s=a[0],o=a[4],r=a[8],c=a[1],l=a[5],h=a[9],u=a[2],d=a[6],f=a[10];switch(e){case"XYZ":this._y=Math.asin(An(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-An(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(An(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-An(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(An(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(r,f));break;case"XZY":this._z=Math.asin(-An(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(r,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Qu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Qu,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return tf.setFromEuler(this),this.setFromQuaternion(tf,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ni.DEFAULT_ORDER="XYZ";class ud{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let l1=0;const ef=new W,xs=new Ma,Yi=new Ce,dr=new W,fo=new W,h1=new W,d1=new Ma,nf=new W(1,0,0),af=new W(0,1,0),sf=new W(0,0,1),of={type:"added"},u1={type:"removed"},vs={type:"childadded",child:null},il={type:"childremoved",child:null};class tn extends qs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:l1++}),this.uuid=Ui(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=tn.DEFAULT_UP.clone();const t=new W,e=new Ni,i=new Ma,a=new W(1,1,1);function s(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new Ce},normalMatrix:{value:new Me}}),this.matrix=new Ce,this.matrixWorld=new Ce,this.matrixAutoUpdate=tn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=tn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ud,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return xs.setFromAxisAngle(t,e),this.quaternion.multiply(xs),this}rotateOnWorldAxis(t,e){return xs.setFromAxisAngle(t,e),this.quaternion.premultiply(xs),this}rotateX(t){return this.rotateOnAxis(nf,t)}rotateY(t){return this.rotateOnAxis(af,t)}rotateZ(t){return this.rotateOnAxis(sf,t)}translateOnAxis(t,e){return ef.copy(t).applyQuaternion(this.quaternion),this.position.add(ef.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(nf,t)}translateY(t){return this.translateOnAxis(af,t)}translateZ(t){return this.translateOnAxis(sf,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Yi.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?dr.copy(t):dr.set(t,e,i);const a=this.parent;this.updateWorldMatrix(!0,!1),fo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Yi.lookAt(fo,dr,this.up):Yi.lookAt(dr,fo,this.up),this.quaternion.setFromRotationMatrix(Yi),a&&(Yi.extractRotation(a.matrixWorld),xs.setFromRotationMatrix(Yi),this.quaternion.premultiply(xs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(of),vs.child=t,this.dispatchEvent(vs),vs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(u1),il.child=t,this.dispatchEvent(il),il.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Yi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Yi.multiply(t.parent.matrixWorld)),t.applyMatrix4(Yi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(of),vs.child=t,this.dispatchEvent(vs),vs.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,a=this.children.length;i<a;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fo,t,h1),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fo,d1,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function s(r,c){return r[c.uuid]===void 0&&(r[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=s(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const c=r.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];s(t.shapes,u)}else s(t.shapes,c)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let c=0,l=this.material.length;c<l;c++)r.push(s(t.materials,this.material[c]));a.material=r}else a.material=s(t.materials,this.material);if(this.children.length>0){a.children=[];for(let r=0;r<this.children.length;r++)a.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){a.animations=[];for(let r=0;r<this.animations.length;r++){const c=this.animations[r];a.animations.push(s(t.animations,c))}}if(e){const r=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),m=o(t.nodes);r.length>0&&(i.geometries=r),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),m.length>0&&(i.nodes=m)}return i.object=a,i;function o(r){const c=[];for(const l in r){const h=r[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const a=t.children[i];this.add(a.clone())}return this}}tn.DEFAULT_UP=new W(0,1,0);tn.DEFAULT_MATRIX_AUTO_UPDATE=!0;tn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const _i=new W,$i=new W,al=new W,Zi=new W,ys=new W,Ms=new W,rf=new W,sl=new W,ol=new W,rl=new W,cl=new sn,ll=new sn,hl=new sn;class si{constructor(t=new W,e=new W,i=new W){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,a){a.subVectors(i,e),_i.subVectors(t,e),a.cross(_i);const s=a.lengthSq();return s>0?a.multiplyScalar(1/Math.sqrt(s)):a.set(0,0,0)}static getBarycoord(t,e,i,a,s){_i.subVectors(a,e),$i.subVectors(i,e),al.subVectors(t,e);const o=_i.dot(_i),r=_i.dot($i),c=_i.dot(al),l=$i.dot($i),h=$i.dot(al),u=o*l-r*r;if(u===0)return s.set(0,0,0),null;const d=1/u,f=(l*c-r*h)*d,m=(o*h-r*c)*d;return s.set(1-f-m,m,f)}static containsPoint(t,e,i,a){return this.getBarycoord(t,e,i,a,Zi)===null?!1:Zi.x>=0&&Zi.y>=0&&Zi.x+Zi.y<=1}static getInterpolation(t,e,i,a,s,o,r,c){return this.getBarycoord(t,e,i,a,Zi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,Zi.x),c.addScaledVector(o,Zi.y),c.addScaledVector(r,Zi.z),c)}static getInterpolatedAttribute(t,e,i,a,s,o){return cl.setScalar(0),ll.setScalar(0),hl.setScalar(0),cl.fromBufferAttribute(t,e),ll.fromBufferAttribute(t,i),hl.fromBufferAttribute(t,a),o.setScalar(0),o.addScaledVector(cl,s.x),o.addScaledVector(ll,s.y),o.addScaledVector(hl,s.z),o}static isFrontFacing(t,e,i,a){return _i.subVectors(i,e),$i.subVectors(t,e),_i.cross($i).dot(a)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,a){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[a]),this}setFromAttributeAndIndices(t,e,i,a){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,a),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return _i.subVectors(this.c,this.b),$i.subVectors(this.a,this.b),_i.cross($i).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return si.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return si.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,a,s){return si.getInterpolation(t,this.a,this.b,this.c,e,i,a,s)}containsPoint(t){return si.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return si.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,a=this.b,s=this.c;let o,r;ys.subVectors(a,i),Ms.subVectors(s,i),sl.subVectors(t,i);const c=ys.dot(sl),l=Ms.dot(sl);if(c<=0&&l<=0)return e.copy(i);ol.subVectors(t,a);const h=ys.dot(ol),u=Ms.dot(ol);if(h>=0&&u<=h)return e.copy(a);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(i).addScaledVector(ys,o);rl.subVectors(t,s);const f=ys.dot(rl),m=Ms.dot(rl);if(m>=0&&f<=m)return e.copy(s);const v=f*l-c*m;if(v<=0&&l>=0&&m<=0)return r=l/(l-m),e.copy(i).addScaledVector(Ms,r);const g=h*m-f*u;if(g<=0&&u-h>=0&&f-m>=0)return rf.subVectors(s,a),r=(u-h)/(u-h+(f-m)),e.copy(a).addScaledVector(rf,r);const p=1/(g+v+d);return o=v*p,r=d*p,e.copy(i).addScaledVector(ys,o).addScaledVector(Ms,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Em={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ha={h:0,s:0,l:0},ur={h:0,s:0,l:0};function dl(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class Qt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const a=t;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Hn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Te.toWorkingColorSpace(this,e),this}setRGB(t,e,i,a=Te.workingColorSpace){return this.r=t,this.g=e,this.b=i,Te.toWorkingColorSpace(this,a),this}setHSL(t,e,i,a=Te.workingColorSpace){if(t=hd(t,1),e=An(e,0,1),i=An(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,o=2*i-s;this.r=dl(o,s,t+1/3),this.g=dl(o,s,t),this.b=dl(o,s,t-1/3)}return Te.toWorkingColorSpace(this,a),this}setStyle(t,e=Hn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=a[1],r=a[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=a[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Hn){const i=Em[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ea(t.r),this.g=ea(t.g),this.b=ea(t.b),this}copyLinearToSRGB(t){return this.r=Ns(t.r),this.g=Ns(t.g),this.b=Ns(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Hn){return Te.fromWorkingColorSpace(kn.copy(this),t),Math.round(An(kn.r*255,0,255))*65536+Math.round(An(kn.g*255,0,255))*256+Math.round(An(kn.b*255,0,255))}getHexString(t=Hn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Te.workingColorSpace){Te.fromWorkingColorSpace(kn.copy(this),e);const i=kn.r,a=kn.g,s=kn.b,o=Math.max(i,a,s),r=Math.min(i,a,s);let c,l;const h=(r+o)/2;if(r===o)c=0,l=0;else{const u=o-r;switch(l=h<=.5?u/(o+r):u/(2-o-r),o){case i:c=(a-s)/u+(a<s?6:0);break;case a:c=(s-i)/u+2;break;case s:c=(i-a)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=Te.workingColorSpace){return Te.fromWorkingColorSpace(kn.copy(this),e),t.r=kn.r,t.g=kn.g,t.b=kn.b,t}getStyle(t=Hn){Te.fromWorkingColorSpace(kn.copy(this),t);const e=kn.r,i=kn.g,a=kn.b;return t!==Hn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(a*255)})`}offsetHSL(t,e,i){return this.getHSL(ha),this.setHSL(ha.h+t,ha.s+e,ha.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(ha),t.getHSL(ur);const i=Po(ha.h,ur.h,e),a=Po(ha.s,ur.s,e),s=Po(ha.l,ur.l,e);return this.setHSL(i,a,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,a=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*a,this.g=s[1]*e+s[4]*i+s[7]*a,this.b=s[2]*e+s[5]*i+s[8]*a,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const kn=new Qt;Qt.NAMES=Em;let f1=0;class Qa extends qs{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:f1++}),this.uuid=Ui(),this.name="",this.blending=zs,this.side=ba,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ql,this.blendDst=Kl,this.blendEquation=Xa,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Qt(0,0,0),this.blendAlpha=0,this.depthFunc=Xs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Gu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ds,this.stencilZFail=ds,this.stencilZPass=ds,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const a=this[e];if(a===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(i):a&&a.isVector3&&i&&i.isVector3?a.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==zs&&(i.blending=this.blending),this.side!==ba&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==ql&&(i.blendSrc=this.blendSrc),this.blendDst!==Kl&&(i.blendDst=this.blendDst),this.blendEquation!==Xa&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Xs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Gu&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ds&&(i.stencilFail=this.stencilFail),this.stencilZFail!==ds&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==ds&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function a(s){const o=[];for(const r in s){const c=s[r];delete c.metadata,o.push(c)}return o}if(e){const s=a(t.textures),o=a(t.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const a=e.length;i=new Array(a);for(let s=0;s!==a;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class xn extends Qa{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ni,this.combine=nd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const dn=new W,fr=new Yt;class on{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=zh,this.updateRanges=[],this.gpuType=zi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let a=0,s=this.itemSize;a<s;a++)this.array[t+a]=e.array[i+a];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)fr.fromBufferAttribute(this,e),fr.applyMatrix3(t),this.setXY(e,fr.x,fr.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)dn.fromBufferAttribute(this,e),dn.applyMatrix3(t),this.setXYZ(e,dn.x,dn.y,dn.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)dn.fromBufferAttribute(this,e),dn.applyMatrix4(t),this.setXYZ(e,dn.x,dn.y,dn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)dn.fromBufferAttribute(this,e),dn.applyNormalMatrix(t),this.setXYZ(e,dn.x,dn.y,dn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)dn.fromBufferAttribute(this,e),dn.transformDirection(t),this.setXYZ(e,dn.x,dn.y,dn.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=bi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=ze(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=bi(e,this.array)),e}setX(t,e){return this.normalized&&(e=ze(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=bi(e,this.array)),e}setY(t,e){return this.normalized&&(e=ze(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=bi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ze(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=bi(e,this.array)),e}setW(t,e){return this.normalized&&(e=ze(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=ze(e,this.array),i=ze(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,a){return t*=this.itemSize,this.normalized&&(e=ze(e,this.array),i=ze(i,this.array),a=ze(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t*=this.itemSize,this.normalized&&(e=ze(e,this.array),i=ze(i,this.array),a=ze(a,this.array),s=ze(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==zh&&(t.usage=this.usage),t}}class Tm extends on{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Am extends on{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class Le extends on{constructor(t,e,i){super(new Float32Array(t),e,i)}}let p1=0;const ui=new Ce,ul=new tn,_s=new W,ii=new Ja,po=new Ja,wn=new W;class qe extends qs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:p1++}),this.uuid=Ui(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(bm(t)?Am:Tm)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Me().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(t),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return ui.makeRotationFromQuaternion(t),this.applyMatrix4(ui),this}rotateX(t){return ui.makeRotationX(t),this.applyMatrix4(ui),this}rotateY(t){return ui.makeRotationY(t),this.applyMatrix4(ui),this}rotateZ(t){return ui.makeRotationZ(t),this.applyMatrix4(ui),this}translate(t,e,i){return ui.makeTranslation(t,e,i),this.applyMatrix4(ui),this}scale(t,e,i){return ui.makeScale(t,e,i),this.applyMatrix4(ui),this}lookAt(t){return ul.lookAt(t),ul.updateMatrix(),this.applyMatrix4(ul.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(_s).negate(),this.translate(_s.x,_s.y,_s.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let a=0,s=t.length;a<s;a++){const o=t[a];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Le(i,3))}else{for(let i=0,a=e.count;i<a;i++){const s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ja);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new W(-1/0,-1/0,-1/0),new W(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,a=e.length;i<a;i++){const s=e[i];ii.setFromBufferAttribute(s),this.morphTargetsRelative?(wn.addVectors(this.boundingBox.min,ii.min),this.boundingBox.expandByPoint(wn),wn.addVectors(this.boundingBox.max,ii.max),this.boundingBox.expandByPoint(wn)):(this.boundingBox.expandByPoint(ii.min),this.boundingBox.expandByPoint(ii.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ks);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new W,1/0);return}if(t){const i=this.boundingSphere.center;if(ii.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const r=e[s];po.setFromBufferAttribute(r),this.morphTargetsRelative?(wn.addVectors(ii.min,po.min),ii.expandByPoint(wn),wn.addVectors(ii.max,po.max),ii.expandByPoint(wn)):(ii.expandByPoint(po.min),ii.expandByPoint(po.max))}ii.getCenter(i);let a=0;for(let s=0,o=t.count;s<o;s++)wn.fromBufferAttribute(t,s),a=Math.max(a,i.distanceToSquared(wn));if(e)for(let s=0,o=e.length;s<o;s++){const r=e[s],c=this.morphTargetsRelative;for(let l=0,h=r.count;l<h;l++)wn.fromBufferAttribute(r,l),c&&(_s.fromBufferAttribute(t,l),wn.add(_s)),a=Math.max(a,i.distanceToSquared(wn))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,a=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new on(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),r=[],c=[];for(let A=0;A<i.count;A++)r[A]=new W,c[A]=new W;const l=new W,h=new W,u=new W,d=new Yt,f=new Yt,m=new Yt,v=new W,g=new W;function p(A,b,M){l.fromBufferAttribute(i,A),h.fromBufferAttribute(i,b),u.fromBufferAttribute(i,M),d.fromBufferAttribute(s,A),f.fromBufferAttribute(s,b),m.fromBufferAttribute(s,M),h.sub(l),u.sub(l),f.sub(d),m.sub(d);const P=1/(f.x*m.y-m.x*f.y);isFinite(P)&&(v.copy(h).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(P),g.copy(u).multiplyScalar(f.x).addScaledVector(h,-m.x).multiplyScalar(P),r[A].add(v),r[b].add(v),r[M].add(v),c[A].add(g),c[b].add(g),c[M].add(g))}let _=this.groups;_.length===0&&(_=[{start:0,count:t.count}]);for(let A=0,b=_.length;A<b;++A){const M=_[A],P=M.start,k=M.count;for(let D=P,z=P+k;D<z;D+=3)p(t.getX(D+0),t.getX(D+1),t.getX(D+2))}const x=new W,y=new W,S=new W,w=new W;function E(A){S.fromBufferAttribute(a,A),w.copy(S);const b=r[A];x.copy(b),x.sub(S.multiplyScalar(S.dot(b))).normalize(),y.crossVectors(w,b);const P=y.dot(c[A])<0?-1:1;o.setXYZW(A,x.x,x.y,x.z,P)}for(let A=0,b=_.length;A<b;++A){const M=_[A],P=M.start,k=M.count;for(let D=P,z=P+k;D<z;D+=3)E(t.getX(D+0)),E(t.getX(D+1)),E(t.getX(D+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new on(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const a=new W,s=new W,o=new W,r=new W,c=new W,l=new W,h=new W,u=new W;if(t)for(let d=0,f=t.count;d<f;d+=3){const m=t.getX(d+0),v=t.getX(d+1),g=t.getX(d+2);a.fromBufferAttribute(e,m),s.fromBufferAttribute(e,v),o.fromBufferAttribute(e,g),h.subVectors(o,s),u.subVectors(a,s),h.cross(u),r.fromBufferAttribute(i,m),c.fromBufferAttribute(i,v),l.fromBufferAttribute(i,g),r.add(h),c.add(h),l.add(h),i.setXYZ(m,r.x,r.y,r.z),i.setXYZ(v,c.x,c.y,c.z),i.setXYZ(g,l.x,l.y,l.z)}else for(let d=0,f=e.count;d<f;d+=3)a.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,s),u.subVectors(a,s),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)wn.fromBufferAttribute(t,e),wn.normalize(),t.setXYZ(e,wn.x,wn.y,wn.z)}toNonIndexed(){function t(r,c){const l=r.array,h=r.itemSize,u=r.normalized,d=new l.constructor(c.length*h);let f=0,m=0;for(let v=0,g=c.length;v<g;v++){r.isInterleavedBufferAttribute?f=c[v]*r.data.stride+r.offset:f=c[v]*h;for(let p=0;p<h;p++)d[m++]=l[f++]}return new on(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new qe,i=this.index.array,a=this.attributes;for(const r in a){const c=a[r],l=t(c,i);e.setAttribute(r,l)}const s=this.morphAttributes;for(const r in s){const c=[],l=s[r];for(let h=0,u=l.length;h<u;h++){const d=l[h],f=t(d,i);c.push(f)}e.morphAttributes[r]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,c=o.length;r<c;r++){const l=o[r];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const a={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const f=l[u];h.push(f.toJSON(t.data))}h.length>0&&(a[c]=h,s=!0)}s&&(t.data.morphAttributes=a,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const a=t.attributes;for(const l in a){const h=a[l];this.setAttribute(l,h.clone(e))}const s=t.morphAttributes;for(const l in s){const h=[],u=s[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,h=o.length;l<h;l++){const u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const cf=new Ce,La=new dd,pr=new Ks,lf=new W,mr=new W,gr=new W,xr=new W,fl=new W,vr=new W,hf=new W,yr=new W;class ve extends tn{constructor(t=new qe,e=new xn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}getVertexPosition(t,e){const i=this.geometry,a=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(a,t);const r=this.morphTargetInfluences;if(s&&r){vr.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const h=r[c],u=s[c];h!==0&&(fl.fromBufferAttribute(u,t),o?vr.addScaledVector(fl,h):vr.addScaledVector(fl.sub(e),h))}e.add(vr)}return e}raycast(t,e){const i=this.geometry,a=this.material,s=this.matrixWorld;a!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),pr.copy(i.boundingSphere),pr.applyMatrix4(s),La.copy(t.ray).recast(t.near),!(pr.containsPoint(La.origin)===!1&&(La.intersectSphere(pr,lf)===null||La.origin.distanceToSquared(lf)>(t.far-t.near)**2))&&(cf.copy(s).invert(),La.copy(t.ray).applyMatrix4(cf),!(i.boundingBox!==null&&La.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,La)))}_computeIntersections(t,e,i){let a;const s=this.geometry,o=this.material,r=s.index,c=s.attributes.position,l=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,f=s.drawRange;if(r!==null)if(Array.isArray(o))for(let m=0,v=d.length;m<v;m++){const g=d[m],p=o[g.materialIndex],_=Math.max(g.start,f.start),x=Math.min(r.count,Math.min(g.start+g.count,f.start+f.count));for(let y=_,S=x;y<S;y+=3){const w=r.getX(y),E=r.getX(y+1),A=r.getX(y+2);a=Mr(this,p,t,i,l,h,u,w,E,A),a&&(a.faceIndex=Math.floor(y/3),a.face.materialIndex=g.materialIndex,e.push(a))}}else{const m=Math.max(0,f.start),v=Math.min(r.count,f.start+f.count);for(let g=m,p=v;g<p;g+=3){const _=r.getX(g),x=r.getX(g+1),y=r.getX(g+2);a=Mr(this,o,t,i,l,h,u,_,x,y),a&&(a.faceIndex=Math.floor(g/3),e.push(a))}}else if(c!==void 0)if(Array.isArray(o))for(let m=0,v=d.length;m<v;m++){const g=d[m],p=o[g.materialIndex],_=Math.max(g.start,f.start),x=Math.min(c.count,Math.min(g.start+g.count,f.start+f.count));for(let y=_,S=x;y<S;y+=3){const w=y,E=y+1,A=y+2;a=Mr(this,p,t,i,l,h,u,w,E,A),a&&(a.faceIndex=Math.floor(y/3),a.face.materialIndex=g.materialIndex,e.push(a))}}else{const m=Math.max(0,f.start),v=Math.min(c.count,f.start+f.count);for(let g=m,p=v;g<p;g+=3){const _=g,x=g+1,y=g+2;a=Mr(this,o,t,i,l,h,u,_,x,y),a&&(a.faceIndex=Math.floor(g/3),e.push(a))}}}}function m1(n,t,e,i,a,s,o,r){let c;if(t.side===jn?c=i.intersectTriangle(o,s,a,!0,r):c=i.intersectTriangle(a,s,o,t.side===ba,r),c===null)return null;yr.copy(r),yr.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(yr);return l<e.near||l>e.far?null:{distance:l,point:yr.clone(),object:n}}function Mr(n,t,e,i,a,s,o,r,c,l){n.getVertexPosition(r,mr),n.getVertexPosition(c,gr),n.getVertexPosition(l,xr);const h=m1(n,t,e,i,mr,gr,xr,hf);if(h){const u=new W;si.getBarycoord(hf,mr,gr,xr,u),a&&(h.uv=si.getInterpolatedAttribute(a,r,c,l,u,new Yt)),s&&(h.uv1=si.getInterpolatedAttribute(s,r,c,l,u,new Yt)),o&&(h.normal=si.getInterpolatedAttribute(o,r,c,l,u,new W),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:r,b:c,c:l,normal:new W,materialIndex:0};si.getNormal(mr,gr,xr,d.normal),h.face=d,h.barycoord=u}return h}class qn extends qe{constructor(t=1,e=1,i=1,a=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:a,heightSegments:s,depthSegments:o};const r=this;a=Math.floor(a),s=Math.floor(s),o=Math.floor(o);const c=[],l=[],h=[],u=[];let d=0,f=0;m("z","y","x",-1,-1,i,e,t,o,s,0),m("z","y","x",1,-1,i,e,-t,o,s,1),m("x","z","y",1,1,t,i,e,a,o,2),m("x","z","y",1,-1,t,i,-e,a,o,3),m("x","y","z",1,-1,t,e,i,a,s,4),m("x","y","z",-1,-1,t,e,-i,a,s,5),this.setIndex(c),this.setAttribute("position",new Le(l,3)),this.setAttribute("normal",new Le(h,3)),this.setAttribute("uv",new Le(u,2));function m(v,g,p,_,x,y,S,w,E,A,b){const M=y/E,P=S/A,k=y/2,D=S/2,z=w/2,C=E+1,T=A+1;let U=0,G=0;const Z=new W;for(let rt=0;rt<T;rt++){const pt=rt*P-D;for(let vt=0;vt<C;vt++){const dt=vt*M-k;Z[v]=dt*_,Z[g]=pt*x,Z[p]=z,l.push(Z.x,Z.y,Z.z),Z[v]=0,Z[g]=0,Z[p]=w>0?1:-1,h.push(Z.x,Z.y,Z.z),u.push(vt/E),u.push(1-rt/A),U+=1}}for(let rt=0;rt<A;rt++)for(let pt=0;pt<E;pt++){const vt=d+pt+C*rt,dt=d+pt+C*(rt+1),Y=d+(pt+1)+C*(rt+1),N=d+(pt+1)+C*rt;c.push(vt,dt,N),c.push(dt,Y,N),G+=6}r.addGroup(f,G,b),f+=G,d+=U}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new qn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Zs(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const a=n[e][i];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=a.clone():Array.isArray(a)?t[e][i]=a.slice():t[e][i]=a}}return t}function Bn(n){const t={};for(let e=0;e<n.length;e++){const i=Zs(n[e]);for(const a in i)t[a]=i[a]}return t}function g1(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Rm(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Te.workingColorSpace}const x1={clone:Zs,merge:Bn};var v1=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,y1=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Sa extends Qa{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=v1,this.fragmentShader=y1,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Zs(t.uniforms),this.uniformsGroups=g1(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const a in this.uniforms){const o=this.uniforms[a].value;o&&o.isTexture?e.uniforms[a]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[a]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[a]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[a]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[a]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[a]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[a]={type:"m4",value:o.toArray()}:e.uniforms[a]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const a in this.extensions)this.extensions[a]===!0&&(i[a]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class Pm extends tn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ce,this.projectionMatrix=new Ce,this.projectionMatrixInverse=new Ce,this.coordinateSystem=ta}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const da=new W,df=new Yt,uf=new Yt;class fi extends Pm{constructor(t=50,e=1,i=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=a,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ho*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Us*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ho*2*Math.atan(Math.tan(Us*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){da.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(da.x,da.y).multiplyScalar(-t/da.z),da.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(da.x,da.y).multiplyScalar(-t/da.z)}getViewSize(t,e){return this.getViewBounds(t,df,uf),e.subVectors(uf,df)}setViewOffset(t,e,i,a,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Us*.5*this.fov)/this.zoom,i=2*e,a=this.aspect*i,s=-.5*a;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;s+=o.offsetX*a/c,e-=o.offsetY*i/l,a*=o.width/c,i*=o.height/l}const r=this.filmOffset;r!==0&&(s+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+a,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const bs=-90,Ss=1;class M1 extends tn{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new fi(bs,Ss,t,e);a.layers=this.layers,this.add(a);const s=new fi(bs,Ss,t,e);s.layers=this.layers,this.add(s);const o=new fi(bs,Ss,t,e);o.layers=this.layers,this.add(o);const r=new fi(bs,Ss,t,e);r.layers=this.layers,this.add(r);const c=new fi(bs,Ss,t,e);c.layers=this.layers,this.add(c);const l=new fi(bs,Ss,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,a,s,o,r,c]=e;for(const l of e)this.remove(l);if(t===ta)i.up.set(0,1,0),i.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===oc)i.up.set(0,-1,0),i.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:a}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,r,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,a),t.render(e,s),t.setRenderTarget(i,1,a),t.render(e,o),t.setRenderTarget(i,2,a),t.render(e,r),t.setRenderTarget(i,3,a),t.render(e,c),t.setRenderTarget(i,4,a),t.render(e,l),i.texture.generateMipmaps=v,t.setRenderTarget(i,5,a),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class Cm extends zn{constructor(t,e,i,a,s,o,r,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:Vs,super(t,e,i,a,s,o,r,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class _1 extends qa{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},a=[i,i,i,i,i,i];this.texture=new Cm(a,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Ii}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},a=new qn(5,5,5),s=new Sa({name:"CubemapFromEquirect",uniforms:Zs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:jn,blending:va});s.uniforms.tEquirect.value=e;const o=new ve(a,s),r=e.minFilter;return e.minFilter===Ya&&(e.minFilter=Ii),new M1(1,10,this).update(t,o),e.minFilter=r,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,a){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,a);t.setRenderTarget(s)}}const pl=new W,b1=new W,S1=new Me;class Ba{constructor(t=new W(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,a){return this.normal.set(t,e,i),this.constant=a,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const a=pl.subVectors(i,e).cross(b1.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(a,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(pl),a=this.normal.dot(i);if(a===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/a;return s<0||s>1?null:e.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||S1.getNormalMatrix(t),a=this.coplanarPoint(pl).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-a.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ka=new Ks,_r=new W;class fd{constructor(t=new Ba,e=new Ba,i=new Ba,a=new Ba,s=new Ba,o=new Ba){this.planes=[t,e,i,a,s,o]}set(t,e,i,a,s,o){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(a),r[4].copy(s),r[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=ta){const i=this.planes,a=t.elements,s=a[0],o=a[1],r=a[2],c=a[3],l=a[4],h=a[5],u=a[6],d=a[7],f=a[8],m=a[9],v=a[10],g=a[11],p=a[12],_=a[13],x=a[14],y=a[15];if(i[0].setComponents(c-s,d-l,g-f,y-p).normalize(),i[1].setComponents(c+s,d+l,g+f,y+p).normalize(),i[2].setComponents(c+o,d+h,g+m,y+_).normalize(),i[3].setComponents(c-o,d-h,g-m,y-_).normalize(),i[4].setComponents(c-r,d-u,g-v,y-x).normalize(),e===ta)i[5].setComponents(c+r,d+u,g+v,y+x).normalize();else if(e===oc)i[5].setComponents(r,u,v,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ka.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ka.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ka)}intersectsSprite(t){return ka.center.set(0,0,0),ka.radius=.7071067811865476,ka.applyMatrix4(t.matrixWorld),this.intersectsSphere(ka)}intersectsSphere(t){const e=this.planes,i=t.center,a=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<a)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const a=e[i];if(_r.x=a.normal.x>0?t.max.x:t.min.x,_r.y=a.normal.y>0?t.max.y:t.min.y,_r.z=a.normal.z>0?t.max.z:t.min.z,a.distanceToPoint(_r)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Dm(){let n=null,t=!1,e=null,i=null;function a(s,o){e(s,o),i=n.requestAnimationFrame(a)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(a),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){n=s}}}function w1(n){const t=new WeakMap;function e(r,c){const l=r.array,h=r.usage,u=l.byteLength,d=n.createBuffer();n.bindBuffer(c,d),n.bufferData(c,l,h),r.onUploadCallback();let f;if(l instanceof Float32Array)f=n.FLOAT;else if(l instanceof Uint16Array)r.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=n.SHORT;else if(l instanceof Uint32Array)f=n.UNSIGNED_INT;else if(l instanceof Int32Array)f=n.INT;else if(l instanceof Int8Array)f=n.BYTE;else if(l instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:r.version,size:u}}function i(r,c,l){const h=c.array,u=c.updateRanges;if(n.bindBuffer(l,r),u.length===0)n.bufferSubData(l,0,h);else{u.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<u.length;f++){const m=u[d],v=u[f];v.start<=m.start+m.count+1?m.count=Math.max(m.count,v.start+v.count-m.start):(++d,u[d]=v)}u.length=d+1;for(let f=0,m=u.length;f<m;f++){const v=u[f];n.bufferSubData(l,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function a(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function s(r){r.isInterleavedBufferAttribute&&(r=r.data);const c=t.get(r);c&&(n.deleteBuffer(c.buffer),t.delete(r))}function o(r,c){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const h=t.get(r);(!h||h.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const l=t.get(r);if(l===void 0)t.set(r,e(r,c));else if(l.version<r.version){if(l.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,r,c),l.version=r.version}}return{get:a,remove:s,update:o}}class Zn extends qe{constructor(t=1,e=1,i=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:a};const s=t/2,o=e/2,r=Math.floor(i),c=Math.floor(a),l=r+1,h=c+1,u=t/r,d=e/c,f=[],m=[],v=[],g=[];for(let p=0;p<h;p++){const _=p*d-o;for(let x=0;x<l;x++){const y=x*u-s;m.push(y,-_,0),v.push(0,0,1),g.push(x/r),g.push(1-p/c)}}for(let p=0;p<c;p++)for(let _=0;_<r;_++){const x=_+l*p,y=_+l*(p+1),S=_+1+l*(p+1),w=_+1+l*p;f.push(x,y,w),f.push(y,S,w)}this.setIndex(f),this.setAttribute("position",new Le(m,3)),this.setAttribute("normal",new Le(v,3)),this.setAttribute("uv",new Le(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Zn(t.width,t.height,t.widthSegments,t.heightSegments)}}var E1=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,T1=`#ifdef USE_ALPHAHASH
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
#endif`,A1=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,R1=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,P1=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,C1=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,D1=`#ifdef USE_AOMAP
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
#endif`,L1=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,k1=`#ifdef USE_BATCHING
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
#endif`,I1=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,z1=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,F1=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,U1=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,N1=`#ifdef USE_IRIDESCENCE
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
#endif`,O1=`#ifdef USE_BUMPMAP
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
#endif`,B1=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,H1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,G1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,X1=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,V1=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,W1=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Y1=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,$1=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Z1=`#define PI 3.141592653589793
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
} // validated`,j1=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,q1=`vec3 transformedNormal = objectNormal;
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
#endif`,K1=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,J1=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Q1=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,tS=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,eS="gl_FragColor = linearToOutputTexel( gl_FragColor );",nS=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,iS=`#ifdef USE_ENVMAP
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
#endif`,aS=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,sS=`#ifdef USE_ENVMAP
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
#endif`,oS=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,rS=`#ifdef USE_ENVMAP
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
#endif`,cS=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,lS=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,hS=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,dS=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,uS=`#ifdef USE_GRADIENTMAP
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
}`,fS=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,pS=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,mS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,gS=`uniform bool receiveShadow;
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
#endif`,xS=`#ifdef USE_ENVMAP
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
#endif`,vS=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,yS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,MS=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,_S=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,bS=`PhysicalMaterial material;
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
#endif`,SS=`struct PhysicalMaterial {
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
}`,wS=`
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
#endif`,ES=`#if defined( RE_IndirectDiffuse )
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
#endif`,TS=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,AS=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,RS=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,PS=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,CS=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,DS=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,LS=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,kS=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,IS=`#if defined( USE_POINTS_UV )
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
#endif`,zS=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,FS=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,US=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,NS=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,OS=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,BS=`#ifdef USE_MORPHTARGETS
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
#endif`,HS=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,GS=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,XS=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,VS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,WS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,YS=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,$S=`#ifdef USE_NORMALMAP
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
#endif`,ZS=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,jS=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,qS=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,KS=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,JS=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,QS=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,tw=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ew=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,nw=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,iw=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,aw=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,sw=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ow=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,rw=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,cw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,lw=`float getShadowMask() {
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
}`,hw=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,dw=`#ifdef USE_SKINNING
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
#endif`,uw=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,fw=`#ifdef USE_SKINNING
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
#endif`,pw=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,mw=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,gw=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,xw=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,vw=`#ifdef USE_TRANSMISSION
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
#endif`,yw=`#ifdef USE_TRANSMISSION
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
#endif`,Mw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,_w=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,bw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Sw=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const ww=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ew=`uniform sampler2D t2D;
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
}`,Tw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Aw=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Rw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Pw=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cw=`#include <common>
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
}`,Dw=`#if DEPTH_PACKING == 3200
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
}`,Lw=`#define DISTANCE
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
}`,kw=`#define DISTANCE
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
}`,Iw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,zw=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Fw=`uniform float scale;
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
}`,Uw=`uniform vec3 diffuse;
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
}`,Nw=`#include <common>
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
}`,Ow=`uniform vec3 diffuse;
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
}`,Bw=`#define LAMBERT
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
}`,Hw=`#define LAMBERT
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
}`,Gw=`#define MATCAP
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
}`,Xw=`#define MATCAP
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
}`,Vw=`#define NORMAL
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
}`,Ww=`#define NORMAL
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
}`,Yw=`#define PHONG
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
}`,$w=`#define PHONG
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
}`,Zw=`#define STANDARD
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
}`,jw=`#define STANDARD
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
}`,qw=`#define TOON
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
}`,Kw=`#define TOON
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
}`,Jw=`uniform float size;
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
}`,Qw=`uniform vec3 diffuse;
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
}`,tE=`#include <common>
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
}`,eE=`uniform vec3 color;
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
}`,nE=`uniform float rotation;
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
}`,iE=`uniform vec3 diffuse;
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
}`,_e={alphahash_fragment:E1,alphahash_pars_fragment:T1,alphamap_fragment:A1,alphamap_pars_fragment:R1,alphatest_fragment:P1,alphatest_pars_fragment:C1,aomap_fragment:D1,aomap_pars_fragment:L1,batching_pars_vertex:k1,batching_vertex:I1,begin_vertex:z1,beginnormal_vertex:F1,bsdfs:U1,iridescence_fragment:N1,bumpmap_pars_fragment:O1,clipping_planes_fragment:B1,clipping_planes_pars_fragment:H1,clipping_planes_pars_vertex:G1,clipping_planes_vertex:X1,color_fragment:V1,color_pars_fragment:W1,color_pars_vertex:Y1,color_vertex:$1,common:Z1,cube_uv_reflection_fragment:j1,defaultnormal_vertex:q1,displacementmap_pars_vertex:K1,displacementmap_vertex:J1,emissivemap_fragment:Q1,emissivemap_pars_fragment:tS,colorspace_fragment:eS,colorspace_pars_fragment:nS,envmap_fragment:iS,envmap_common_pars_fragment:aS,envmap_pars_fragment:sS,envmap_pars_vertex:oS,envmap_physical_pars_fragment:xS,envmap_vertex:rS,fog_vertex:cS,fog_pars_vertex:lS,fog_fragment:hS,fog_pars_fragment:dS,gradientmap_pars_fragment:uS,lightmap_pars_fragment:fS,lights_lambert_fragment:pS,lights_lambert_pars_fragment:mS,lights_pars_begin:gS,lights_toon_fragment:vS,lights_toon_pars_fragment:yS,lights_phong_fragment:MS,lights_phong_pars_fragment:_S,lights_physical_fragment:bS,lights_physical_pars_fragment:SS,lights_fragment_begin:wS,lights_fragment_maps:ES,lights_fragment_end:TS,logdepthbuf_fragment:AS,logdepthbuf_pars_fragment:RS,logdepthbuf_pars_vertex:PS,logdepthbuf_vertex:CS,map_fragment:DS,map_pars_fragment:LS,map_particle_fragment:kS,map_particle_pars_fragment:IS,metalnessmap_fragment:zS,metalnessmap_pars_fragment:FS,morphinstance_vertex:US,morphcolor_vertex:NS,morphnormal_vertex:OS,morphtarget_pars_vertex:BS,morphtarget_vertex:HS,normal_fragment_begin:GS,normal_fragment_maps:XS,normal_pars_fragment:VS,normal_pars_vertex:WS,normal_vertex:YS,normalmap_pars_fragment:$S,clearcoat_normal_fragment_begin:ZS,clearcoat_normal_fragment_maps:jS,clearcoat_pars_fragment:qS,iridescence_pars_fragment:KS,opaque_fragment:JS,packing:QS,premultiplied_alpha_fragment:tw,project_vertex:ew,dithering_fragment:nw,dithering_pars_fragment:iw,roughnessmap_fragment:aw,roughnessmap_pars_fragment:sw,shadowmap_pars_fragment:ow,shadowmap_pars_vertex:rw,shadowmap_vertex:cw,shadowmask_pars_fragment:lw,skinbase_vertex:hw,skinning_pars_vertex:dw,skinning_vertex:uw,skinnormal_vertex:fw,specularmap_fragment:pw,specularmap_pars_fragment:mw,tonemapping_fragment:gw,tonemapping_pars_fragment:xw,transmission_fragment:vw,transmission_pars_fragment:yw,uv_pars_fragment:Mw,uv_pars_vertex:_w,uv_vertex:bw,worldpos_vertex:Sw,background_vert:ww,background_frag:Ew,backgroundCube_vert:Tw,backgroundCube_frag:Aw,cube_vert:Rw,cube_frag:Pw,depth_vert:Cw,depth_frag:Dw,distanceRGBA_vert:Lw,distanceRGBA_frag:kw,equirect_vert:Iw,equirect_frag:zw,linedashed_vert:Fw,linedashed_frag:Uw,meshbasic_vert:Nw,meshbasic_frag:Ow,meshlambert_vert:Bw,meshlambert_frag:Hw,meshmatcap_vert:Gw,meshmatcap_frag:Xw,meshnormal_vert:Vw,meshnormal_frag:Ww,meshphong_vert:Yw,meshphong_frag:$w,meshphysical_vert:Zw,meshphysical_frag:jw,meshtoon_vert:qw,meshtoon_frag:Kw,points_vert:Jw,points_frag:Qw,shadow_vert:tE,shadow_frag:eE,sprite_vert:nE,sprite_frag:iE},Wt={common:{diffuse:{value:new Qt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Me},alphaMap:{value:null},alphaMapTransform:{value:new Me},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Me}},envmap:{envMap:{value:null},envMapRotation:{value:new Me},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Me}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Me}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Me},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Me},normalScale:{value:new Yt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Me},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Me}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Me}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Me}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Qt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Qt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Me},alphaTest:{value:0},uvTransform:{value:new Me}},sprite:{diffuse:{value:new Qt(16777215)},opacity:{value:1},center:{value:new Yt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Me},alphaMap:{value:null},alphaMapTransform:{value:new Me},alphaTest:{value:0}}},ki={basic:{uniforms:Bn([Wt.common,Wt.specularmap,Wt.envmap,Wt.aomap,Wt.lightmap,Wt.fog]),vertexShader:_e.meshbasic_vert,fragmentShader:_e.meshbasic_frag},lambert:{uniforms:Bn([Wt.common,Wt.specularmap,Wt.envmap,Wt.aomap,Wt.lightmap,Wt.emissivemap,Wt.bumpmap,Wt.normalmap,Wt.displacementmap,Wt.fog,Wt.lights,{emissive:{value:new Qt(0)}}]),vertexShader:_e.meshlambert_vert,fragmentShader:_e.meshlambert_frag},phong:{uniforms:Bn([Wt.common,Wt.specularmap,Wt.envmap,Wt.aomap,Wt.lightmap,Wt.emissivemap,Wt.bumpmap,Wt.normalmap,Wt.displacementmap,Wt.fog,Wt.lights,{emissive:{value:new Qt(0)},specular:{value:new Qt(1118481)},shininess:{value:30}}]),vertexShader:_e.meshphong_vert,fragmentShader:_e.meshphong_frag},standard:{uniforms:Bn([Wt.common,Wt.envmap,Wt.aomap,Wt.lightmap,Wt.emissivemap,Wt.bumpmap,Wt.normalmap,Wt.displacementmap,Wt.roughnessmap,Wt.metalnessmap,Wt.fog,Wt.lights,{emissive:{value:new Qt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:_e.meshphysical_vert,fragmentShader:_e.meshphysical_frag},toon:{uniforms:Bn([Wt.common,Wt.aomap,Wt.lightmap,Wt.emissivemap,Wt.bumpmap,Wt.normalmap,Wt.displacementmap,Wt.gradientmap,Wt.fog,Wt.lights,{emissive:{value:new Qt(0)}}]),vertexShader:_e.meshtoon_vert,fragmentShader:_e.meshtoon_frag},matcap:{uniforms:Bn([Wt.common,Wt.bumpmap,Wt.normalmap,Wt.displacementmap,Wt.fog,{matcap:{value:null}}]),vertexShader:_e.meshmatcap_vert,fragmentShader:_e.meshmatcap_frag},points:{uniforms:Bn([Wt.points,Wt.fog]),vertexShader:_e.points_vert,fragmentShader:_e.points_frag},dashed:{uniforms:Bn([Wt.common,Wt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:_e.linedashed_vert,fragmentShader:_e.linedashed_frag},depth:{uniforms:Bn([Wt.common,Wt.displacementmap]),vertexShader:_e.depth_vert,fragmentShader:_e.depth_frag},normal:{uniforms:Bn([Wt.common,Wt.bumpmap,Wt.normalmap,Wt.displacementmap,{opacity:{value:1}}]),vertexShader:_e.meshnormal_vert,fragmentShader:_e.meshnormal_frag},sprite:{uniforms:Bn([Wt.sprite,Wt.fog]),vertexShader:_e.sprite_vert,fragmentShader:_e.sprite_frag},background:{uniforms:{uvTransform:{value:new Me},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:_e.background_vert,fragmentShader:_e.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Me}},vertexShader:_e.backgroundCube_vert,fragmentShader:_e.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:_e.cube_vert,fragmentShader:_e.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:_e.equirect_vert,fragmentShader:_e.equirect_frag},distanceRGBA:{uniforms:Bn([Wt.common,Wt.displacementmap,{referencePosition:{value:new W},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:_e.distanceRGBA_vert,fragmentShader:_e.distanceRGBA_frag},shadow:{uniforms:Bn([Wt.lights,Wt.fog,{color:{value:new Qt(0)},opacity:{value:1}}]),vertexShader:_e.shadow_vert,fragmentShader:_e.shadow_frag}};ki.physical={uniforms:Bn([ki.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Me},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Me},clearcoatNormalScale:{value:new Yt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Me},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Me},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Me},sheen:{value:0},sheenColor:{value:new Qt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Me},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Me},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Me},transmissionSamplerSize:{value:new Yt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Me},attenuationDistance:{value:0},attenuationColor:{value:new Qt(0)},specularColor:{value:new Qt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Me},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Me},anisotropyVector:{value:new Yt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Me}}]),vertexShader:_e.meshphysical_vert,fragmentShader:_e.meshphysical_frag};const br={r:0,b:0,g:0},Ia=new Ni,aE=new Ce;function sE(n,t,e,i,a,s,o){const r=new Qt(0);let c=s===!0?0:1,l,h,u=null,d=0,f=null;function m(_){let x=_.isScene===!0?_.background:null;return x&&x.isTexture&&(x=(_.backgroundBlurriness>0?e:t).get(x)),x}function v(_){let x=!1;const y=m(_);y===null?p(r,c):y&&y.isColor&&(p(y,1),x=!0);const S=n.xr.getEnvironmentBlendMode();S==="additive"?i.buffers.color.setClear(0,0,0,1,o):S==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(_,x){const y=m(x);y&&(y.isCubeTexture||y.mapping===yc)?(h===void 0&&(h=new ve(new qn(1,1,1),new Sa({name:"BackgroundCubeMaterial",uniforms:Zs(ki.backgroundCube.uniforms),vertexShader:ki.backgroundCube.vertexShader,fragmentShader:ki.backgroundCube.fragmentShader,side:jn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(S,w,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(h)),Ia.copy(x.backgroundRotation),Ia.x*=-1,Ia.y*=-1,Ia.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Ia.y*=-1,Ia.z*=-1),h.material.uniforms.envMap.value=y,h.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(aE.makeRotationFromEuler(Ia)),h.material.toneMapped=Te.getTransfer(y.colorSpace)!==Ne,(u!==y||d!==y.version||f!==n.toneMapping)&&(h.material.needsUpdate=!0,u=y,d=y.version,f=n.toneMapping),h.layers.enableAll(),_.unshift(h,h.geometry,h.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new ve(new Zn(2,2),new Sa({name:"BackgroundMaterial",uniforms:Zs(ki.background.uniforms),vertexShader:ki.background.vertexShader,fragmentShader:ki.background.fragmentShader,side:ba,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=Te.getTransfer(y.colorSpace)!==Ne,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||d!==y.version||f!==n.toneMapping)&&(l.material.needsUpdate=!0,u=y,d=y.version,f=n.toneMapping),l.layers.enableAll(),_.unshift(l,l.geometry,l.material,0,0,null))}function p(_,x){_.getRGB(br,Rm(n)),i.buffers.color.setClear(br.r,br.g,br.b,x,o)}return{getClearColor:function(){return r},setClearColor:function(_,x=1){r.set(_),c=x,p(r,c)},getClearAlpha:function(){return c},setClearAlpha:function(_){c=_,p(r,c)},render:v,addToRenderList:g}}function oE(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},a=d(null);let s=a,o=!1;function r(M,P,k,D,z){let C=!1;const T=u(D,k,P);s!==T&&(s=T,l(s.object)),C=f(M,D,k,z),C&&m(M,D,k,z),z!==null&&t.update(z,n.ELEMENT_ARRAY_BUFFER),(C||o)&&(o=!1,y(M,P,k,D),z!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(z).buffer))}function c(){return n.createVertexArray()}function l(M){return n.bindVertexArray(M)}function h(M){return n.deleteVertexArray(M)}function u(M,P,k){const D=k.wireframe===!0;let z=i[M.id];z===void 0&&(z={},i[M.id]=z);let C=z[P.id];C===void 0&&(C={},z[P.id]=C);let T=C[D];return T===void 0&&(T=d(c()),C[D]=T),T}function d(M){const P=[],k=[],D=[];for(let z=0;z<e;z++)P[z]=0,k[z]=0,D[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:k,attributeDivisors:D,object:M,attributes:{},index:null}}function f(M,P,k,D){const z=s.attributes,C=P.attributes;let T=0;const U=k.getAttributes();for(const G in U)if(U[G].location>=0){const rt=z[G];let pt=C[G];if(pt===void 0&&(G==="instanceMatrix"&&M.instanceMatrix&&(pt=M.instanceMatrix),G==="instanceColor"&&M.instanceColor&&(pt=M.instanceColor)),rt===void 0||rt.attribute!==pt||pt&&rt.data!==pt.data)return!0;T++}return s.attributesNum!==T||s.index!==D}function m(M,P,k,D){const z={},C=P.attributes;let T=0;const U=k.getAttributes();for(const G in U)if(U[G].location>=0){let rt=C[G];rt===void 0&&(G==="instanceMatrix"&&M.instanceMatrix&&(rt=M.instanceMatrix),G==="instanceColor"&&M.instanceColor&&(rt=M.instanceColor));const pt={};pt.attribute=rt,rt&&rt.data&&(pt.data=rt.data),z[G]=pt,T++}s.attributes=z,s.attributesNum=T,s.index=D}function v(){const M=s.newAttributes;for(let P=0,k=M.length;P<k;P++)M[P]=0}function g(M){p(M,0)}function p(M,P){const k=s.newAttributes,D=s.enabledAttributes,z=s.attributeDivisors;k[M]=1,D[M]===0&&(n.enableVertexAttribArray(M),D[M]=1),z[M]!==P&&(n.vertexAttribDivisor(M,P),z[M]=P)}function _(){const M=s.newAttributes,P=s.enabledAttributes;for(let k=0,D=P.length;k<D;k++)P[k]!==M[k]&&(n.disableVertexAttribArray(k),P[k]=0)}function x(M,P,k,D,z,C,T){T===!0?n.vertexAttribIPointer(M,P,k,z,C):n.vertexAttribPointer(M,P,k,D,z,C)}function y(M,P,k,D){v();const z=D.attributes,C=k.getAttributes(),T=P.defaultAttributeValues;for(const U in C){const G=C[U];if(G.location>=0){let Z=z[U];if(Z===void 0&&(U==="instanceMatrix"&&M.instanceMatrix&&(Z=M.instanceMatrix),U==="instanceColor"&&M.instanceColor&&(Z=M.instanceColor)),Z!==void 0){const rt=Z.normalized,pt=Z.itemSize,vt=t.get(Z);if(vt===void 0)continue;const dt=vt.buffer,Y=vt.type,N=vt.bytesPerElement,X=Y===n.INT||Y===n.UNSIGNED_INT||Z.gpuType===id;if(Z.isInterleavedBufferAttribute){const $=Z.data,q=$.stride,ot=Z.offset;if($.isInstancedInterleavedBuffer){for(let Et=0;Et<G.locationSize;Et++)p(G.location+Et,$.meshPerAttribute);M.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let Et=0;Et<G.locationSize;Et++)g(G.location+Et);n.bindBuffer(n.ARRAY_BUFFER,dt);for(let Et=0;Et<G.locationSize;Et++)x(G.location+Et,pt/G.locationSize,Y,rt,q*N,(ot+pt/G.locationSize*Et)*N,X)}else{if(Z.isInstancedBufferAttribute){for(let $=0;$<G.locationSize;$++)p(G.location+$,Z.meshPerAttribute);M.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let $=0;$<G.locationSize;$++)g(G.location+$);n.bindBuffer(n.ARRAY_BUFFER,dt);for(let $=0;$<G.locationSize;$++)x(G.location+$,pt/G.locationSize,Y,rt,pt*N,pt/G.locationSize*$*N,X)}}else if(T!==void 0){const rt=T[U];if(rt!==void 0)switch(rt.length){case 2:n.vertexAttrib2fv(G.location,rt);break;case 3:n.vertexAttrib3fv(G.location,rt);break;case 4:n.vertexAttrib4fv(G.location,rt);break;default:n.vertexAttrib1fv(G.location,rt)}}}}_()}function S(){A();for(const M in i){const P=i[M];for(const k in P){const D=P[k];for(const z in D)h(D[z].object),delete D[z];delete P[k]}delete i[M]}}function w(M){if(i[M.id]===void 0)return;const P=i[M.id];for(const k in P){const D=P[k];for(const z in D)h(D[z].object),delete D[z];delete P[k]}delete i[M.id]}function E(M){for(const P in i){const k=i[P];if(k[M.id]===void 0)continue;const D=k[M.id];for(const z in D)h(D[z].object),delete D[z];delete k[M.id]}}function A(){b(),o=!0,s!==a&&(s=a,l(s.object))}function b(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:r,reset:A,resetDefaultState:b,dispose:S,releaseStatesOfGeometry:w,releaseStatesOfProgram:E,initAttributes:v,enableAttribute:g,disableUnusedAttributes:_}}function rE(n,t,e){let i;function a(l){i=l}function s(l,h){n.drawArrays(i,l,h),e.update(h,i,1)}function o(l,h,u){u!==0&&(n.drawArraysInstanced(i,l,h,u),e.update(h,i,u))}function r(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,h,0,u);let f=0;for(let m=0;m<u;m++)f+=h[m];e.update(f,i,1)}function c(l,h,u,d){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<l.length;m++)o(l[m],h[m],d[m]);else{f.multiDrawArraysInstancedWEBGL(i,l,0,h,0,d,0,u);let m=0;for(let v=0;v<u;v++)m+=h[v]*d[v];e.update(m,i,1)}}this.setMode=a,this.render=s,this.renderInstances=o,this.renderMultiDraw=r,this.renderMultiDrawInstances=c}function cE(n,t,e,i){let a;function s(){if(a!==void 0)return a;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");a=n.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function o(E){return!(E!==Si&&i.convert(E)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(E){const A=E===$o&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(E!==na&&i.convert(E)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==zi&&!A)}function c(E){if(E==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),_=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),x=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),S=m>0,w=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:r,precision:l,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:m,maxTextureSize:v,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:_,maxVaryings:x,maxFragmentUniforms:y,vertexTextures:S,maxSamples:w}}function lE(n){const t=this;let e=null,i=0,a=!1,s=!1;const o=new Ba,r=new Me,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||i!==0||a;return a=d,i=u.length,f},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const m=u.clippingPlanes,v=u.clipIntersection,g=u.clipShadows,p=n.get(u);if(!a||m===null||m.length===0||s&&!g)s?h(null):l();else{const _=s?0:i,x=_*4;let y=p.clippingState||null;c.value=y,y=h(m,d,x,f);for(let S=0;S!==x;++S)y[S]=e[S];p.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=_}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,d,f,m){const v=u!==null?u.length:0;let g=null;if(v!==0){if(g=c.value,m!==!0||g===null){const p=f+v*4,_=d.matrixWorldInverse;r.getNormalMatrix(_),(g===null||g.length<p)&&(g=new Float32Array(p));for(let x=0,y=f;x!==v;++x,y+=4)o.copy(u[x]).applyMatrix4(_,r),o.normal.toArray(g,y),g[y+3]=o.constant}c.value=g,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,g}}function hE(n){let t=new WeakMap;function e(o,r){return r===sh?o.mapping=Vs:r===oh&&(o.mapping=Ws),o}function i(o){if(o&&o.isTexture){const r=o.mapping;if(r===sh||r===oh)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new _1(c.height);return l.fromEquirectangularTexture(n,o),t.set(o,l),o.addEventListener("dispose",a),e(l.texture,o.mapping)}else return null}}return o}function a(o){const r=o.target;r.removeEventListener("dispose",a);const c=t.get(r);c!==void 0&&(t.delete(r),c.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}class Lm extends Pm{constructor(t=-1,e=1,i=1,a=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=a,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,a,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let s=i-t,o=i+t,r=a+e,c=a-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,o=s+l*this.view.width,r-=h*this.view.offsetY,c=r-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,r,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Ls=4,ff=[.125,.215,.35,.446,.526,.582],Va=20,ml=new Lm,pf=new Qt;let gl=null,xl=0,vl=0,yl=!1;const Ha=(1+Math.sqrt(5))/2,ws=1/Ha,mf=[new W(-Ha,ws,0),new W(Ha,ws,0),new W(-ws,0,Ha),new W(ws,0,Ha),new W(0,Ha,-ws),new W(0,Ha,ws),new W(-1,1,-1),new W(1,1,-1),new W(-1,1,1),new W(1,1,1)];class gf{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,a=100){gl=this._renderer.getRenderTarget(),xl=this._renderer.getActiveCubeFace(),vl=this._renderer.getActiveMipmapLevel(),yl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,i,a,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=yf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=vf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(gl,xl,vl),this._renderer.xr.enabled=yl,t.scissorTest=!1,Sr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Vs||t.mapping===Ws?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),gl=this._renderer.getRenderTarget(),xl=this._renderer.getActiveCubeFace(),vl=this._renderer.getActiveMipmapLevel(),yl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Ii,minFilter:Ii,generateMipmaps:!1,type:$o,format:Si,colorSpace:js,depthBuffer:!1},a=xf(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=xf(t,e,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=dE(s)),this._blurMaterial=uE(s,t,e)}return a}_compileMaterial(t){const e=new ve(this._lodPlanes[0],t);this._renderer.compile(e,ml)}_sceneToCubeUV(t,e,i,a){const r=new fi(90,1,e,i),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(pf),h.toneMapping=ya,h.autoClear=!1;const f=new xn({name:"PMREM.Background",side:jn,depthWrite:!1,depthTest:!1}),m=new ve(new qn,f);let v=!1;const g=t.background;g?g.isColor&&(f.color.copy(g),t.background=null,v=!0):(f.color.copy(pf),v=!0);for(let p=0;p<6;p++){const _=p%3;_===0?(r.up.set(0,c[p],0),r.lookAt(l[p],0,0)):_===1?(r.up.set(0,0,c[p]),r.lookAt(0,l[p],0)):(r.up.set(0,c[p],0),r.lookAt(0,0,l[p]));const x=this._cubeSize;Sr(a,_*x,p>2?x:0,x,x),h.setRenderTarget(a),v&&h.render(m,r),h.render(t,r)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=g}_textureToCubeUV(t,e){const i=this._renderer,a=t.mapping===Vs||t.mapping===Ws;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=yf()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=vf());const s=a?this._cubemapMaterial:this._equirectMaterial,o=new ve(this._lodPlanes[0],s),r=s.uniforms;r.envMap.value=t;const c=this._cubeSize;Sr(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(o,ml)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const a=this._lodPlanes.length;for(let s=1;s<a;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),r=mf[(a-s-1)%mf.length];this._blur(t,s-1,s,o,r)}e.autoClear=i}_blur(t,e,i,a,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,a,"latitudinal",s),this._halfBlur(o,t,i,i,a,"longitudinal",s)}_halfBlur(t,e,i,a,s,o,r){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new ve(this._lodPlanes[a],l),d=l.uniforms,f=this._sizeLods[i]-1,m=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*Va-1),v=s/m,g=isFinite(s)?1+Math.floor(h*v):Va;g>Va&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Va}`);const p=[];let _=0;for(let E=0;E<Va;++E){const A=E/v,b=Math.exp(-A*A/2);p.push(b),E===0?_+=b:E<g&&(_+=2*b)}for(let E=0;E<p.length;E++)p[E]=p[E]/_;d.envMap.value=t.texture,d.samples.value=g,d.weights.value=p,d.latitudinal.value=o==="latitudinal",r&&(d.poleAxis.value=r);const{_lodMax:x}=this;d.dTheta.value=m,d.mipInt.value=x-i;const y=this._sizeLods[a],S=3*y*(a>x-Ls?a-x+Ls:0),w=4*(this._cubeSize-y);Sr(e,S,w,3*y,2*y),c.setRenderTarget(e),c.render(u,ml)}}function dE(n){const t=[],e=[],i=[];let a=n;const s=n-Ls+1+ff.length;for(let o=0;o<s;o++){const r=Math.pow(2,a);e.push(r);let c=1/r;o>n-Ls?c=ff[o-n+Ls-1]:o===0&&(c=0),i.push(c);const l=1/(r-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,m=6,v=3,g=2,p=1,_=new Float32Array(v*m*f),x=new Float32Array(g*m*f),y=new Float32Array(p*m*f);for(let w=0;w<f;w++){const E=w%3*2/3-1,A=w>2?0:-1,b=[E,A,0,E+2/3,A,0,E+2/3,A+1,0,E,A,0,E+2/3,A+1,0,E,A+1,0];_.set(b,v*m*w),x.set(d,g*m*w);const M=[w,w,w,w,w,w];y.set(M,p*m*w)}const S=new qe;S.setAttribute("position",new on(_,v)),S.setAttribute("uv",new on(x,g)),S.setAttribute("faceIndex",new on(y,p)),t.push(S),a>Ls&&a--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function xf(n,t,e){const i=new qa(n,t,e);return i.texture.mapping=yc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Sr(n,t,e,i,a){n.viewport.set(t,e,i,a),n.scissor.set(t,e,i,a)}function uE(n,t,e){const i=new Float32Array(Va),a=new W(0,1,0);return new Sa({name:"SphericalGaussianBlur",defines:{n:Va,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:pd(),fragmentShader:`

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
		`,blending:va,depthTest:!1,depthWrite:!1})}function vf(){return new Sa({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:pd(),fragmentShader:`

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
		`,blending:va,depthTest:!1,depthWrite:!1})}function yf(){return new Sa({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:pd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:va,depthTest:!1,depthWrite:!1})}function pd(){return`

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
	`}function fE(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const c=r.mapping,l=c===sh||c===oh,h=c===Vs||c===Ws;if(l||h){let u=t.get(r);const d=u!==void 0?u.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==d)return e===null&&(e=new gf(n)),u=l?e.fromEquirectangular(r,u):e.fromCubemap(r,u),u.texture.pmremVersion=r.pmremVersion,t.set(r,u),u.texture;if(u!==void 0)return u.texture;{const f=r.image;return l&&f&&f.height>0||h&&f&&a(f)?(e===null&&(e=new gf(n)),u=l?e.fromEquirectangular(r):e.fromCubemap(r),u.texture.pmremVersion=r.pmremVersion,t.set(r,u),r.addEventListener("dispose",s),u.texture):null}}}return r}function a(r){let c=0;const l=6;for(let h=0;h<l;h++)r[h]!==void 0&&c++;return c===l}function s(r){const c=r.target;c.removeEventListener("dispose",s);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function pE(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let a;switch(i){case"WEBGL_depth_texture":a=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=n.getExtension(i)}return t[i]=a,a}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const a=e(i);return a===null&&bo("THREE.WebGLRenderer: "+i+" extension not supported."),a}}}function mE(n,t,e,i){const a={},s=new WeakMap;function o(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const m in d.attributes)t.remove(d.attributes[m]);for(const m in d.morphAttributes){const v=d.morphAttributes[m];for(let g=0,p=v.length;g<p;g++)t.remove(v[g])}d.removeEventListener("dispose",o),delete a[d.id];const f=s.get(d);f&&(t.remove(f),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function r(u,d){return a[d.id]===!0||(d.addEventListener("dispose",o),a[d.id]=!0,e.memory.geometries++),d}function c(u){const d=u.attributes;for(const m in d)t.update(d[m],n.ARRAY_BUFFER);const f=u.morphAttributes;for(const m in f){const v=f[m];for(let g=0,p=v.length;g<p;g++)t.update(v[g],n.ARRAY_BUFFER)}}function l(u){const d=[],f=u.index,m=u.attributes.position;let v=0;if(f!==null){const _=f.array;v=f.version;for(let x=0,y=_.length;x<y;x+=3){const S=_[x+0],w=_[x+1],E=_[x+2];d.push(S,w,w,E,E,S)}}else if(m!==void 0){const _=m.array;v=m.version;for(let x=0,y=_.length/3-1;x<y;x+=3){const S=x+0,w=x+1,E=x+2;d.push(S,w,w,E,E,S)}}else return;const g=new(bm(d)?Am:Tm)(d,1);g.version=v;const p=s.get(u);p&&t.remove(p),s.set(u,g)}function h(u){const d=s.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return s.get(u)}return{get:r,update:c,getWireframeAttribute:h}}function gE(n,t,e){let i;function a(d){i=d}let s,o;function r(d){s=d.type,o=d.bytesPerElement}function c(d,f){n.drawElements(i,f,s,d*o),e.update(f,i,1)}function l(d,f,m){m!==0&&(n.drawElementsInstanced(i,f,s,d*o,m),e.update(f,i,m))}function h(d,f,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,s,d,0,m);let g=0;for(let p=0;p<m;p++)g+=f[p];e.update(g,i,1)}function u(d,f,m,v){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<d.length;p++)l(d[p]/o,f[p],v[p]);else{g.multiDrawElementsInstancedWEBGL(i,f,0,s,d,0,v,0,m);let p=0;for(let _=0;_<m;_++)p+=f[_]*v[_];e.update(p,i,1)}}this.setMode=a,this.setIndex=r,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function xE(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,r){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=r*(s/3);break;case n.LINES:e.lines+=r*(s/2);break;case n.LINE_STRIP:e.lines+=r*(s-1);break;case n.LINE_LOOP:e.lines+=r*s;break;case n.POINTS:e.points+=r*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function a(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:a,update:i}}function vE(n,t,e){const i=new WeakMap,a=new sn;function s(o,r,c){const l=o.morphTargetInfluences,h=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,u=h!==void 0?h.length:0;let d=i.get(r);if(d===void 0||d.count!==u){let M=function(){A.dispose(),i.delete(r),r.removeEventListener("dispose",M)};var f=M;d!==void 0&&d.texture.dispose();const m=r.morphAttributes.position!==void 0,v=r.morphAttributes.normal!==void 0,g=r.morphAttributes.color!==void 0,p=r.morphAttributes.position||[],_=r.morphAttributes.normal||[],x=r.morphAttributes.color||[];let y=0;m===!0&&(y=1),v===!0&&(y=2),g===!0&&(y=3);let S=r.attributes.position.count*y,w=1;S>t.maxTextureSize&&(w=Math.ceil(S/t.maxTextureSize),S=t.maxTextureSize);const E=new Float32Array(S*w*4*u),A=new wm(E,S,w,u);A.type=zi,A.needsUpdate=!0;const b=y*4;for(let P=0;P<u;P++){const k=p[P],D=_[P],z=x[P],C=S*w*4*P;for(let T=0;T<k.count;T++){const U=T*b;m===!0&&(a.fromBufferAttribute(k,T),E[C+U+0]=a.x,E[C+U+1]=a.y,E[C+U+2]=a.z,E[C+U+3]=0),v===!0&&(a.fromBufferAttribute(D,T),E[C+U+4]=a.x,E[C+U+5]=a.y,E[C+U+6]=a.z,E[C+U+7]=0),g===!0&&(a.fromBufferAttribute(z,T),E[C+U+8]=a.x,E[C+U+9]=a.y,E[C+U+10]=a.z,E[C+U+11]=z.itemSize===4?a.w:1)}}d={count:u,texture:A,size:new Yt(S,w)},i.set(r,d),r.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let m=0;for(let g=0;g<l.length;g++)m+=l[g];const v=r.morphTargetsRelative?1:1-m;c.getUniforms().setValue(n,"morphTargetBaseInfluence",v),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:s}}function yE(n,t,e,i){let a=new WeakMap;function s(c){const l=i.render.frame,h=c.geometry,u=t.get(c,h);if(a.get(u)!==l&&(t.update(u),a.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",r)===!1&&c.addEventListener("dispose",r),a.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),a.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;a.get(d)!==l&&(d.update(),a.set(d,l))}return u}function o(){a=new WeakMap}function r(c){const l=c.target;l.removeEventListener("dispose",r),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:s,dispose:o}}class km extends zn{constructor(t,e,i,a,s,o,r,c,l,h=Fs){if(h!==Fs&&h!==$s)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===Fs&&(i=ja),i===void 0&&h===$s&&(i=Ys),super(null,a,s,o,r,c,h,i,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:oi,this.minFilter=c!==void 0?c:oi,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Im=new zn,Mf=new km(1,1),zm=new wm,Fm=new s1,Um=new Cm,_f=[],bf=[],Sf=new Float32Array(16),wf=new Float32Array(9),Ef=new Float32Array(4);function Js(n,t,e){const i=n[0];if(i<=0||i>0)return n;const a=t*e;let s=_f[a];if(s===void 0&&(s=new Float32Array(a),_f[a]=s),t!==0){i.toArray(s,0);for(let o=1,r=0;o!==t;++o)r+=e,n[o].toArray(s,r)}return s}function vn(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function yn(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function _c(n,t){let e=bf[t];e===void 0&&(e=new Int32Array(t),bf[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function ME(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function _E(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(vn(e,t))return;n.uniform2fv(this.addr,t),yn(e,t)}}function bE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(vn(e,t))return;n.uniform3fv(this.addr,t),yn(e,t)}}function SE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(vn(e,t))return;n.uniform4fv(this.addr,t),yn(e,t)}}function wE(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(vn(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),yn(e,t)}else{if(vn(e,i))return;Ef.set(i),n.uniformMatrix2fv(this.addr,!1,Ef),yn(e,i)}}function EE(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(vn(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),yn(e,t)}else{if(vn(e,i))return;wf.set(i),n.uniformMatrix3fv(this.addr,!1,wf),yn(e,i)}}function TE(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(vn(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),yn(e,t)}else{if(vn(e,i))return;Sf.set(i),n.uniformMatrix4fv(this.addr,!1,Sf),yn(e,i)}}function AE(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function RE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(vn(e,t))return;n.uniform2iv(this.addr,t),yn(e,t)}}function PE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(vn(e,t))return;n.uniform3iv(this.addr,t),yn(e,t)}}function CE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(vn(e,t))return;n.uniform4iv(this.addr,t),yn(e,t)}}function DE(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function LE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(vn(e,t))return;n.uniform2uiv(this.addr,t),yn(e,t)}}function kE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(vn(e,t))return;n.uniform3uiv(this.addr,t),yn(e,t)}}function IE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(vn(e,t))return;n.uniform4uiv(this.addr,t),yn(e,t)}}function zE(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a);let s;this.type===n.SAMPLER_2D_SHADOW?(Mf.compareFunction=_m,s=Mf):s=Im,e.setTexture2D(t||s,a)}function FE(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture3D(t||Fm,a)}function UE(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTextureCube(t||Um,a)}function NE(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture2DArray(t||zm,a)}function OE(n){switch(n){case 5126:return ME;case 35664:return _E;case 35665:return bE;case 35666:return SE;case 35674:return wE;case 35675:return EE;case 35676:return TE;case 5124:case 35670:return AE;case 35667:case 35671:return RE;case 35668:case 35672:return PE;case 35669:case 35673:return CE;case 5125:return DE;case 36294:return LE;case 36295:return kE;case 36296:return IE;case 35678:case 36198:case 36298:case 36306:case 35682:return zE;case 35679:case 36299:case 36307:return FE;case 35680:case 36300:case 36308:case 36293:return UE;case 36289:case 36303:case 36311:case 36292:return NE}}function BE(n,t){n.uniform1fv(this.addr,t)}function HE(n,t){const e=Js(t,this.size,2);n.uniform2fv(this.addr,e)}function GE(n,t){const e=Js(t,this.size,3);n.uniform3fv(this.addr,e)}function XE(n,t){const e=Js(t,this.size,4);n.uniform4fv(this.addr,e)}function VE(n,t){const e=Js(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function WE(n,t){const e=Js(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function YE(n,t){const e=Js(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function $E(n,t){n.uniform1iv(this.addr,t)}function ZE(n,t){n.uniform2iv(this.addr,t)}function jE(n,t){n.uniform3iv(this.addr,t)}function qE(n,t){n.uniform4iv(this.addr,t)}function KE(n,t){n.uniform1uiv(this.addr,t)}function JE(n,t){n.uniform2uiv(this.addr,t)}function QE(n,t){n.uniform3uiv(this.addr,t)}function tT(n,t){n.uniform4uiv(this.addr,t)}function eT(n,t,e){const i=this.cache,a=t.length,s=_c(e,a);vn(i,s)||(n.uniform1iv(this.addr,s),yn(i,s));for(let o=0;o!==a;++o)e.setTexture2D(t[o]||Im,s[o])}function nT(n,t,e){const i=this.cache,a=t.length,s=_c(e,a);vn(i,s)||(n.uniform1iv(this.addr,s),yn(i,s));for(let o=0;o!==a;++o)e.setTexture3D(t[o]||Fm,s[o])}function iT(n,t,e){const i=this.cache,a=t.length,s=_c(e,a);vn(i,s)||(n.uniform1iv(this.addr,s),yn(i,s));for(let o=0;o!==a;++o)e.setTextureCube(t[o]||Um,s[o])}function aT(n,t,e){const i=this.cache,a=t.length,s=_c(e,a);vn(i,s)||(n.uniform1iv(this.addr,s),yn(i,s));for(let o=0;o!==a;++o)e.setTexture2DArray(t[o]||zm,s[o])}function sT(n){switch(n){case 5126:return BE;case 35664:return HE;case 35665:return GE;case 35666:return XE;case 35674:return VE;case 35675:return WE;case 35676:return YE;case 5124:case 35670:return $E;case 35667:case 35671:return ZE;case 35668:case 35672:return jE;case 35669:case 35673:return qE;case 5125:return KE;case 36294:return JE;case 36295:return QE;case 36296:return tT;case 35678:case 36198:case 36298:case 36306:case 35682:return eT;case 35679:case 36299:case 36307:return nT;case 35680:case 36300:case 36308:case 36293:return iT;case 36289:case 36303:case 36311:case 36292:return aT}}class oT{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=OE(e.type)}}class rT{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=sT(e.type)}}class cT{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const a=this.seq;for(let s=0,o=a.length;s!==o;++s){const r=a[s];r.setValue(t,e[r.id],i)}}}const Ml=/(\w+)(\])?(\[|\.)?/g;function Tf(n,t){n.seq.push(t),n.map[t.id]=t}function lT(n,t,e){const i=n.name,a=i.length;for(Ml.lastIndex=0;;){const s=Ml.exec(i),o=Ml.lastIndex;let r=s[1];const c=s[2]==="]",l=s[3];if(c&&(r=r|0),l===void 0||l==="["&&o+2===a){Tf(e,l===void 0?new oT(r,n,t):new rT(r,n,t));break}else{let u=e.map[r];u===void 0&&(u=new cT(r),Tf(e,u)),e=u}}}class Yr{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const s=t.getActiveUniform(e,a),o=t.getUniformLocation(e,s.name);lT(s,o,this)}}setValue(t,e,i,a){const s=this.map[e];s!==void 0&&s.setValue(t,i,a)}setOptional(t,e,i){const a=e[i];a!==void 0&&this.setValue(t,i,a)}static upload(t,e,i,a){for(let s=0,o=e.length;s!==o;++s){const r=e[s],c=i[r.id];c.needsUpdate!==!1&&r.setValue(t,c.value,a)}}static seqWithValue(t,e){const i=[];for(let a=0,s=t.length;a!==s;++a){const o=t[a];o.id in e&&i.push(o)}return i}}function Af(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const hT=37297;let dT=0;function uT(n,t){const e=n.split(`
`),i=[],a=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=a;o<s;o++){const r=o+1;i.push(`${r===t?">":" "} ${r}: ${e[o]}`)}return i.join(`
`)}const Rf=new Me;function fT(n){Te._getMatrix(Rf,Te.workingColorSpace,n);const t=`mat3( ${Rf.elements.map(e=>e.toFixed(4))} )`;switch(Te.getTransfer(n)){case Mc:return[t,"LinearTransferOETF"];case Ne:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Pf(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),a=n.getShaderInfoLog(t).trim();if(i&&a==="")return"";const s=/ERROR: 0:(\d+)/.exec(a);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+a+`

`+uT(n.getShaderSource(t),o)}else return a}function pT(n,t){const e=fT(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function mT(n,t){let e;switch(t){case xb:e="Linear";break;case vb:e="Reinhard";break;case yb:e="Cineon";break;case Mb:e="ACESFilmic";break;case bb:e="AgX";break;case Sb:e="Neutral";break;case _b:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const wr=new W;function gT(){Te.getLuminanceCoefficients(wr);const n=wr.x.toFixed(4),t=wr.y.toFixed(4),e=wr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function xT(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(So).join(`
`)}function vT(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function yT(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let a=0;a<i;a++){const s=n.getActiveAttrib(t,a),o=s.name;let r=1;s.type===n.FLOAT_MAT2&&(r=2),s.type===n.FLOAT_MAT3&&(r=3),s.type===n.FLOAT_MAT4&&(r=4),e[o]={type:s.type,location:n.getAttribLocation(t,o),locationSize:r}}return e}function So(n){return n!==""}function Cf(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Df(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const MT=/^[ \t]*#include +<([\w\d./]+)>/gm;function Fh(n){return n.replace(MT,bT)}const _T=new Map;function bT(n,t){let e=_e[t];if(e===void 0){const i=_T.get(t);if(i!==void 0)e=_e[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Fh(e)}const ST=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Lf(n){return n.replace(ST,wT)}function wT(n,t,e,i){let a="";for(let s=parseInt(t);s<parseInt(e);s++)a+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return a}function kf(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function ET(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===cm?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===lm?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===qi&&(t="SHADOWMAP_TYPE_VSM"),t}function TT(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Vs:case Ws:t="ENVMAP_TYPE_CUBE";break;case yc:t="ENVMAP_TYPE_CUBE_UV";break}return t}function AT(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Ws:t="ENVMAP_MODE_REFRACTION";break}return t}function RT(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case nd:t="ENVMAP_BLENDING_MULTIPLY";break;case mb:t="ENVMAP_BLENDING_MIX";break;case gb:t="ENVMAP_BLENDING_ADD";break}return t}function PT(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function CT(n,t,e,i){const a=n.getContext(),s=e.defines;let o=e.vertexShader,r=e.fragmentShader;const c=ET(e),l=TT(e),h=AT(e),u=RT(e),d=PT(e),f=xT(e),m=vT(s),v=a.createProgram();let g,p,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(So).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(So).join(`
`),p.length>0&&(p+=`
`)):(g=[kf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(So).join(`
`),p=[kf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ya?"#define TONE_MAPPING":"",e.toneMapping!==ya?_e.tonemapping_pars_fragment:"",e.toneMapping!==ya?mT("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",_e.colorspace_pars_fragment,pT("linearToOutputTexel",e.outputColorSpace),gT(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(So).join(`
`)),o=Fh(o),o=Cf(o,e),o=Df(o,e),r=Fh(r),r=Cf(r,e),r=Df(r,e),o=Lf(o),r=Lf(r),e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===Xu?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Xu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=_+g+o,y=_+p+r,S=Af(a,a.VERTEX_SHADER,x),w=Af(a,a.FRAGMENT_SHADER,y);a.attachShader(v,S),a.attachShader(v,w),e.index0AttributeName!==void 0?a.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&a.bindAttribLocation(v,0,"position"),a.linkProgram(v);function E(P){if(n.debug.checkShaderErrors){const k=a.getProgramInfoLog(v).trim(),D=a.getShaderInfoLog(S).trim(),z=a.getShaderInfoLog(w).trim();let C=!0,T=!0;if(a.getProgramParameter(v,a.LINK_STATUS)===!1)if(C=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(a,v,S,w);else{const U=Pf(a,S,"vertex"),G=Pf(a,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(v,a.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+k+`
`+U+`
`+G)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(D===""||z==="")&&(T=!1);T&&(P.diagnostics={runnable:C,programLog:k,vertexShader:{log:D,prefix:g},fragmentShader:{log:z,prefix:p}})}a.deleteShader(S),a.deleteShader(w),A=new Yr(a,v),b=yT(a,v)}let A;this.getUniforms=function(){return A===void 0&&E(this),A};let b;this.getAttributes=function(){return b===void 0&&E(this),b};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=a.getProgramParameter(v,hT)),M},this.destroy=function(){i.releaseStatesOfProgram(this),a.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=dT++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=S,this.fragmentShader=w,this}let DT=0;class LT{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,a=this._getShaderStage(e),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(a)===!1&&(o.add(a),a.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new kT(t),e.set(t,i)),i}}class kT{constructor(t){this.id=DT++,this.code=t,this.usedTimes=0}}function IT(n,t,e,i,a,s,o){const r=new ud,c=new LT,l=new Set,h=[],u=a.logarithmicDepthBuffer,d=a.vertexTextures;let f=a.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(b){return l.add(b),b===0?"uv":`uv${b}`}function g(b,M,P,k,D){const z=k.fog,C=D.geometry,T=b.isMeshStandardMaterial?k.environment:null,U=(b.isMeshStandardMaterial?e:t).get(b.envMap||T),G=U&&U.mapping===yc?U.image.height:null,Z=m[b.type];b.precision!==null&&(f=a.getMaxPrecision(b.precision),f!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",f,"instead."));const rt=C.morphAttributes.position||C.morphAttributes.normal||C.morphAttributes.color,pt=rt!==void 0?rt.length:0;let vt=0;C.morphAttributes.position!==void 0&&(vt=1),C.morphAttributes.normal!==void 0&&(vt=2),C.morphAttributes.color!==void 0&&(vt=3);let dt,Y,N,X;if(Z){const ee=ki[Z];dt=ee.vertexShader,Y=ee.fragmentShader}else dt=b.vertexShader,Y=b.fragmentShader,c.update(b),N=c.getVertexShaderID(b),X=c.getFragmentShaderID(b);const $=n.getRenderTarget(),q=n.state.buffers.depth.getReversed(),ot=D.isInstancedMesh===!0,Et=D.isBatchedMesh===!0,Ht=!!b.map,tt=!!b.matcap,V=!!U,B=!!b.aoMap,kt=!!b.lightMap,Rt=!!b.bumpMap,Mt=!!b.normalMap,mt=!!b.displacementMap,gt=!!b.emissiveMap,Pt=!!b.metalnessMap,L=!!b.roughnessMap,R=b.anisotropy>0,Q=b.clearcoat>0,ft=b.dispersion>0,at=b.iridescence>0,ht=b.sheen>0,zt=b.transmission>0,Ct=R&&!!b.anisotropyMap,wt=Q&&!!b.clearcoatMap,Xt=Q&&!!b.clearcoatNormalMap,xt=Q&&!!b.clearcoatRoughnessMap,It=at&&!!b.iridescenceMap,J=at&&!!b.iridescenceThicknessMap,K=ht&&!!b.sheenColorMap,st=ht&&!!b.sheenRoughnessMap,Ot=!!b.specularMap,Ft=!!b.specularColorMap,Lt=!!b.specularIntensityMap,F=zt&&!!b.transmissionMap,St=zt&&!!b.thicknessMap,j=!!b.gradientMap,ut=!!b.alphaMap,Nt=b.alphaTest>0,Dt=!!b.alphaHash,qt=!!b.extensions;let le=ya;b.toneMapped&&($===null||$.isXRRenderTarget===!0)&&(le=n.toneMapping);const he={shaderID:Z,shaderType:b.type,shaderName:b.name,vertexShader:dt,fragmentShader:Y,defines:b.defines,customVertexShaderID:N,customFragmentShaderID:X,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:f,batching:Et,batchingColor:Et&&D._colorsTexture!==null,instancing:ot,instancingColor:ot&&D.instanceColor!==null,instancingMorph:ot&&D.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:$===null?n.outputColorSpace:$.isXRRenderTarget===!0?$.texture.colorSpace:js,alphaToCoverage:!!b.alphaToCoverage,map:Ht,matcap:tt,envMap:V,envMapMode:V&&U.mapping,envMapCubeUVHeight:G,aoMap:B,lightMap:kt,bumpMap:Rt,normalMap:Mt,displacementMap:d&&mt,emissiveMap:gt,normalMapObjectSpace:Mt&&b.normalMapType===Ab,normalMapTangentSpace:Mt&&b.normalMapType===Mm,metalnessMap:Pt,roughnessMap:L,anisotropy:R,anisotropyMap:Ct,clearcoat:Q,clearcoatMap:wt,clearcoatNormalMap:Xt,clearcoatRoughnessMap:xt,dispersion:ft,iridescence:at,iridescenceMap:It,iridescenceThicknessMap:J,sheen:ht,sheenColorMap:K,sheenRoughnessMap:st,specularMap:Ot,specularColorMap:Ft,specularIntensityMap:Lt,transmission:zt,transmissionMap:F,thicknessMap:St,gradientMap:j,opaque:b.transparent===!1&&b.blending===zs&&b.alphaToCoverage===!1,alphaMap:ut,alphaTest:Nt,alphaHash:Dt,combine:b.combine,mapUv:Ht&&v(b.map.channel),aoMapUv:B&&v(b.aoMap.channel),lightMapUv:kt&&v(b.lightMap.channel),bumpMapUv:Rt&&v(b.bumpMap.channel),normalMapUv:Mt&&v(b.normalMap.channel),displacementMapUv:mt&&v(b.displacementMap.channel),emissiveMapUv:gt&&v(b.emissiveMap.channel),metalnessMapUv:Pt&&v(b.metalnessMap.channel),roughnessMapUv:L&&v(b.roughnessMap.channel),anisotropyMapUv:Ct&&v(b.anisotropyMap.channel),clearcoatMapUv:wt&&v(b.clearcoatMap.channel),clearcoatNormalMapUv:Xt&&v(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:xt&&v(b.clearcoatRoughnessMap.channel),iridescenceMapUv:It&&v(b.iridescenceMap.channel),iridescenceThicknessMapUv:J&&v(b.iridescenceThicknessMap.channel),sheenColorMapUv:K&&v(b.sheenColorMap.channel),sheenRoughnessMapUv:st&&v(b.sheenRoughnessMap.channel),specularMapUv:Ot&&v(b.specularMap.channel),specularColorMapUv:Ft&&v(b.specularColorMap.channel),specularIntensityMapUv:Lt&&v(b.specularIntensityMap.channel),transmissionMapUv:F&&v(b.transmissionMap.channel),thicknessMapUv:St&&v(b.thicknessMap.channel),alphaMapUv:ut&&v(b.alphaMap.channel),vertexTangents:!!C.attributes.tangent&&(Mt||R),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!C.attributes.color&&C.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!C.attributes.uv&&(Ht||ut),fog:!!z,useFog:b.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:q,skinning:D.isSkinnedMesh===!0,morphTargets:C.morphAttributes.position!==void 0,morphNormals:C.morphAttributes.normal!==void 0,morphColors:C.morphAttributes.color!==void 0,morphTargetsCount:pt,morphTextureStride:vt,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:le,decodeVideoTexture:Ht&&b.map.isVideoTexture===!0&&Te.getTransfer(b.map.colorSpace)===Ne,decodeVideoTextureEmissive:gt&&b.emissiveMap.isVideoTexture===!0&&Te.getTransfer(b.emissiveMap.colorSpace)===Ne,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===je,flipSided:b.side===jn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:qt&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(qt&&b.extensions.multiDraw===!0||Et)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return he.vertexUv1s=l.has(1),he.vertexUv2s=l.has(2),he.vertexUv3s=l.has(3),l.clear(),he}function p(b){const M=[];if(b.shaderID?M.push(b.shaderID):(M.push(b.customVertexShaderID),M.push(b.customFragmentShaderID)),b.defines!==void 0)for(const P in b.defines)M.push(P),M.push(b.defines[P]);return b.isRawShaderMaterial===!1&&(_(M,b),x(M,b),M.push(n.outputColorSpace)),M.push(b.customProgramCacheKey),M.join()}function _(b,M){b.push(M.precision),b.push(M.outputColorSpace),b.push(M.envMapMode),b.push(M.envMapCubeUVHeight),b.push(M.mapUv),b.push(M.alphaMapUv),b.push(M.lightMapUv),b.push(M.aoMapUv),b.push(M.bumpMapUv),b.push(M.normalMapUv),b.push(M.displacementMapUv),b.push(M.emissiveMapUv),b.push(M.metalnessMapUv),b.push(M.roughnessMapUv),b.push(M.anisotropyMapUv),b.push(M.clearcoatMapUv),b.push(M.clearcoatNormalMapUv),b.push(M.clearcoatRoughnessMapUv),b.push(M.iridescenceMapUv),b.push(M.iridescenceThicknessMapUv),b.push(M.sheenColorMapUv),b.push(M.sheenRoughnessMapUv),b.push(M.specularMapUv),b.push(M.specularColorMapUv),b.push(M.specularIntensityMapUv),b.push(M.transmissionMapUv),b.push(M.thicknessMapUv),b.push(M.combine),b.push(M.fogExp2),b.push(M.sizeAttenuation),b.push(M.morphTargetsCount),b.push(M.morphAttributeCount),b.push(M.numDirLights),b.push(M.numPointLights),b.push(M.numSpotLights),b.push(M.numSpotLightMaps),b.push(M.numHemiLights),b.push(M.numRectAreaLights),b.push(M.numDirLightShadows),b.push(M.numPointLightShadows),b.push(M.numSpotLightShadows),b.push(M.numSpotLightShadowsWithMaps),b.push(M.numLightProbes),b.push(M.shadowMapType),b.push(M.toneMapping),b.push(M.numClippingPlanes),b.push(M.numClipIntersection),b.push(M.depthPacking)}function x(b,M){r.disableAll(),M.supportsVertexTextures&&r.enable(0),M.instancing&&r.enable(1),M.instancingColor&&r.enable(2),M.instancingMorph&&r.enable(3),M.matcap&&r.enable(4),M.envMap&&r.enable(5),M.normalMapObjectSpace&&r.enable(6),M.normalMapTangentSpace&&r.enable(7),M.clearcoat&&r.enable(8),M.iridescence&&r.enable(9),M.alphaTest&&r.enable(10),M.vertexColors&&r.enable(11),M.vertexAlphas&&r.enable(12),M.vertexUv1s&&r.enable(13),M.vertexUv2s&&r.enable(14),M.vertexUv3s&&r.enable(15),M.vertexTangents&&r.enable(16),M.anisotropy&&r.enable(17),M.alphaHash&&r.enable(18),M.batching&&r.enable(19),M.dispersion&&r.enable(20),M.batchingColor&&r.enable(21),b.push(r.mask),r.disableAll(),M.fog&&r.enable(0),M.useFog&&r.enable(1),M.flatShading&&r.enable(2),M.logarithmicDepthBuffer&&r.enable(3),M.reverseDepthBuffer&&r.enable(4),M.skinning&&r.enable(5),M.morphTargets&&r.enable(6),M.morphNormals&&r.enable(7),M.morphColors&&r.enable(8),M.premultipliedAlpha&&r.enable(9),M.shadowMapEnabled&&r.enable(10),M.doubleSided&&r.enable(11),M.flipSided&&r.enable(12),M.useDepthPacking&&r.enable(13),M.dithering&&r.enable(14),M.transmission&&r.enable(15),M.sheen&&r.enable(16),M.opaque&&r.enable(17),M.pointsUvs&&r.enable(18),M.decodeVideoTexture&&r.enable(19),M.decodeVideoTextureEmissive&&r.enable(20),M.alphaToCoverage&&r.enable(21),b.push(r.mask)}function y(b){const M=m[b.type];let P;if(M){const k=ki[M];P=x1.clone(k.uniforms)}else P=b.uniforms;return P}function S(b,M){let P;for(let k=0,D=h.length;k<D;k++){const z=h[k];if(z.cacheKey===M){P=z,++P.usedTimes;break}}return P===void 0&&(P=new CT(n,M,b,s),h.push(P)),P}function w(b){if(--b.usedTimes===0){const M=h.indexOf(b);h[M]=h[h.length-1],h.pop(),b.destroy()}}function E(b){c.remove(b)}function A(){c.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:y,acquireProgram:S,releaseProgram:w,releaseShaderCache:E,programs:h,dispose:A}}function zT(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let r=n.get(o);return r===void 0&&(r={},n.set(o,r)),r}function i(o){n.delete(o)}function a(o,r,c){n.get(o)[r]=c}function s(){n=new WeakMap}return{has:t,get:e,remove:i,update:a,dispose:s}}function FT(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function If(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function zf(){const n=[];let t=0;const e=[],i=[],a=[];function s(){t=0,e.length=0,i.length=0,a.length=0}function o(u,d,f,m,v,g){let p=n[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:m,renderOrder:u.renderOrder,z:v,group:g},n[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=m,p.renderOrder=u.renderOrder,p.z=v,p.group=g),t++,p}function r(u,d,f,m,v,g){const p=o(u,d,f,m,v,g);f.transmission>0?i.push(p):f.transparent===!0?a.push(p):e.push(p)}function c(u,d,f,m,v,g){const p=o(u,d,f,m,v,g);f.transmission>0?i.unshift(p):f.transparent===!0?a.unshift(p):e.unshift(p)}function l(u,d){e.length>1&&e.sort(u||FT),i.length>1&&i.sort(d||If),a.length>1&&a.sort(d||If)}function h(){for(let u=t,d=n.length;u<d;u++){const f=n[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:i,transparent:a,init:s,push:r,unshift:c,finish:h,sort:l}}function UT(){let n=new WeakMap;function t(i,a){const s=n.get(i);let o;return s===void 0?(o=new zf,n.set(i,[o])):a>=s.length?(o=new zf,s.push(o)):o=s[a],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function NT(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new W,color:new Qt};break;case"SpotLight":e={position:new W,direction:new W,color:new Qt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new W,color:new Qt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new W,skyColor:new Qt,groundColor:new Qt};break;case"RectAreaLight":e={color:new Qt,position:new W,halfWidth:new W,halfHeight:new W};break}return n[t.id]=e,e}}}function OT(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Yt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Yt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Yt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let BT=0;function HT(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function GT(n){const t=new NT,e=OT(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new W);const a=new W,s=new Ce,o=new Ce;function r(l){let h=0,u=0,d=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let f=0,m=0,v=0,g=0,p=0,_=0,x=0,y=0,S=0,w=0,E=0;l.sort(HT);for(let b=0,M=l.length;b<M;b++){const P=l[b],k=P.color,D=P.intensity,z=P.distance,C=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=k.r*D,u+=k.g*D,d+=k.b*D;else if(P.isLightProbe){for(let T=0;T<9;T++)i.probe[T].addScaledVector(P.sh.coefficients[T],D);E++}else if(P.isDirectionalLight){const T=t.get(P);if(T.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const U=P.shadow,G=e.get(P);G.shadowIntensity=U.intensity,G.shadowBias=U.bias,G.shadowNormalBias=U.normalBias,G.shadowRadius=U.radius,G.shadowMapSize=U.mapSize,i.directionalShadow[f]=G,i.directionalShadowMap[f]=C,i.directionalShadowMatrix[f]=P.shadow.matrix,_++}i.directional[f]=T,f++}else if(P.isSpotLight){const T=t.get(P);T.position.setFromMatrixPosition(P.matrixWorld),T.color.copy(k).multiplyScalar(D),T.distance=z,T.coneCos=Math.cos(P.angle),T.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),T.decay=P.decay,i.spot[v]=T;const U=P.shadow;if(P.map&&(i.spotLightMap[S]=P.map,S++,U.updateMatrices(P),P.castShadow&&w++),i.spotLightMatrix[v]=U.matrix,P.castShadow){const G=e.get(P);G.shadowIntensity=U.intensity,G.shadowBias=U.bias,G.shadowNormalBias=U.normalBias,G.shadowRadius=U.radius,G.shadowMapSize=U.mapSize,i.spotShadow[v]=G,i.spotShadowMap[v]=C,y++}v++}else if(P.isRectAreaLight){const T=t.get(P);T.color.copy(k).multiplyScalar(D),T.halfWidth.set(P.width*.5,0,0),T.halfHeight.set(0,P.height*.5,0),i.rectArea[g]=T,g++}else if(P.isPointLight){const T=t.get(P);if(T.color.copy(P.color).multiplyScalar(P.intensity),T.distance=P.distance,T.decay=P.decay,P.castShadow){const U=P.shadow,G=e.get(P);G.shadowIntensity=U.intensity,G.shadowBias=U.bias,G.shadowNormalBias=U.normalBias,G.shadowRadius=U.radius,G.shadowMapSize=U.mapSize,G.shadowCameraNear=U.camera.near,G.shadowCameraFar=U.camera.far,i.pointShadow[m]=G,i.pointShadowMap[m]=C,i.pointShadowMatrix[m]=P.shadow.matrix,x++}i.point[m]=T,m++}else if(P.isHemisphereLight){const T=t.get(P);T.skyColor.copy(P.color).multiplyScalar(D),T.groundColor.copy(P.groundColor).multiplyScalar(D),i.hemi[p]=T,p++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Wt.LTC_FLOAT_1,i.rectAreaLTC2=Wt.LTC_FLOAT_2):(i.rectAreaLTC1=Wt.LTC_HALF_1,i.rectAreaLTC2=Wt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=d;const A=i.hash;(A.directionalLength!==f||A.pointLength!==m||A.spotLength!==v||A.rectAreaLength!==g||A.hemiLength!==p||A.numDirectionalShadows!==_||A.numPointShadows!==x||A.numSpotShadows!==y||A.numSpotMaps!==S||A.numLightProbes!==E)&&(i.directional.length=f,i.spot.length=v,i.rectArea.length=g,i.point.length=m,i.hemi.length=p,i.directionalShadow.length=_,i.directionalShadowMap.length=_,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=_,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=y+S-w,i.spotLightMap.length=S,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=E,A.directionalLength=f,A.pointLength=m,A.spotLength=v,A.rectAreaLength=g,A.hemiLength=p,A.numDirectionalShadows=_,A.numPointShadows=x,A.numSpotShadows=y,A.numSpotMaps=S,A.numLightProbes=E,i.version=BT++)}function c(l,h){let u=0,d=0,f=0,m=0,v=0;const g=h.matrixWorldInverse;for(let p=0,_=l.length;p<_;p++){const x=l[p];if(x.isDirectionalLight){const y=i.directional[u];y.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(a),y.direction.transformDirection(g),u++}else if(x.isSpotLight){const y=i.spot[f];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(g),y.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(a),y.direction.transformDirection(g),f++}else if(x.isRectAreaLight){const y=i.rectArea[m];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(g),o.identity(),s.copy(x.matrixWorld),s.premultiply(g),o.extractRotation(s),y.halfWidth.set(x.width*.5,0,0),y.halfHeight.set(0,x.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),m++}else if(x.isPointLight){const y=i.point[d];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(g),d++}else if(x.isHemisphereLight){const y=i.hemi[v];y.direction.setFromMatrixPosition(x.matrixWorld),y.direction.transformDirection(g),v++}}}return{setup:r,setupView:c,state:i}}function Ff(n){const t=new GT(n),e=[],i=[];function a(h){l.camera=h,e.length=0,i.length=0}function s(h){e.push(h)}function o(h){i.push(h)}function r(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:a,state:l,setupLights:r,setupLightsView:c,pushLight:s,pushShadow:o}}function XT(n){let t=new WeakMap;function e(a,s=0){const o=t.get(a);let r;return o===void 0?(r=new Ff(n),t.set(a,[r])):s>=o.length?(r=new Ff(n),o.push(r)):r=o[s],r}function i(){t=new WeakMap}return{get:e,dispose:i}}class VT extends Qa{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Eb,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class WT extends Qa{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const YT=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,$T=`uniform sampler2D shadow_pass;
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
}`;function ZT(n,t,e){let i=new fd;const a=new Yt,s=new Yt,o=new sn,r=new VT({depthPacking:Tb}),c=new WT,l={},h=e.maxTextureSize,u={[ba]:jn,[jn]:ba,[je]:je},d=new Sa({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Yt},radius:{value:4}},vertexShader:YT,fragmentShader:$T}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const m=new qe;m.setAttribute("position",new on(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new ve(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=cm;let p=this.type;this.render=function(w,E,A){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||w.length===0)return;const b=n.getRenderTarget(),M=n.getActiveCubeFace(),P=n.getActiveMipmapLevel(),k=n.state;k.setBlending(va),k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);const D=p!==qi&&this.type===qi,z=p===qi&&this.type!==qi;for(let C=0,T=w.length;C<T;C++){const U=w[C],G=U.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",U,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;a.copy(G.mapSize);const Z=G.getFrameExtents();if(a.multiply(Z),s.copy(G.mapSize),(a.x>h||a.y>h)&&(a.x>h&&(s.x=Math.floor(h/Z.x),a.x=s.x*Z.x,G.mapSize.x=s.x),a.y>h&&(s.y=Math.floor(h/Z.y),a.y=s.y*Z.y,G.mapSize.y=s.y)),G.map===null||D===!0||z===!0){const pt=this.type!==qi?{minFilter:oi,magFilter:oi}:{};G.map!==null&&G.map.dispose(),G.map=new qa(a.x,a.y,pt),G.map.texture.name=U.name+".shadowMap",G.camera.updateProjectionMatrix()}n.setRenderTarget(G.map),n.clear();const rt=G.getViewportCount();for(let pt=0;pt<rt;pt++){const vt=G.getViewport(pt);o.set(s.x*vt.x,s.y*vt.y,s.x*vt.z,s.y*vt.w),k.viewport(o),G.updateMatrices(U,pt),i=G.getFrustum(),y(E,A,G.camera,U,this.type)}G.isPointLightShadow!==!0&&this.type===qi&&_(G,A),G.needsUpdate=!1}p=this.type,g.needsUpdate=!1,n.setRenderTarget(b,M,P)};function _(w,E){const A=t.update(v);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new qa(a.x,a.y)),d.uniforms.shadow_pass.value=w.map.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,n.setRenderTarget(w.mapPass),n.clear(),n.renderBufferDirect(E,null,A,d,v,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,n.setRenderTarget(w.map),n.clear(),n.renderBufferDirect(E,null,A,f,v,null)}function x(w,E,A,b){let M=null;const P=A.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(P!==void 0)M=P;else if(M=A.isPointLight===!0?c:r,n.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const k=M.uuid,D=E.uuid;let z=l[k];z===void 0&&(z={},l[k]=z);let C=z[D];C===void 0&&(C=M.clone(),z[D]=C,E.addEventListener("dispose",S)),M=C}if(M.visible=E.visible,M.wireframe=E.wireframe,b===qi?M.side=E.shadowSide!==null?E.shadowSide:E.side:M.side=E.shadowSide!==null?E.shadowSide:u[E.side],M.alphaMap=E.alphaMap,M.alphaTest=E.alphaTest,M.map=E.map,M.clipShadows=E.clipShadows,M.clippingPlanes=E.clippingPlanes,M.clipIntersection=E.clipIntersection,M.displacementMap=E.displacementMap,M.displacementScale=E.displacementScale,M.displacementBias=E.displacementBias,M.wireframeLinewidth=E.wireframeLinewidth,M.linewidth=E.linewidth,A.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const k=n.properties.get(M);k.light=A}return M}function y(w,E,A,b,M){if(w.visible===!1)return;if(w.layers.test(E.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&M===qi)&&(!w.frustumCulled||i.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,w.matrixWorld);const D=t.update(w),z=w.material;if(Array.isArray(z)){const C=D.groups;for(let T=0,U=C.length;T<U;T++){const G=C[T],Z=z[G.materialIndex];if(Z&&Z.visible){const rt=x(w,Z,b,M);w.onBeforeShadow(n,w,E,A,D,rt,G),n.renderBufferDirect(A,null,D,rt,w,G),w.onAfterShadow(n,w,E,A,D,rt,G)}}}else if(z.visible){const C=x(w,z,b,M);w.onBeforeShadow(n,w,E,A,D,C,null),n.renderBufferDirect(A,null,D,C,w,null),w.onAfterShadow(n,w,E,A,D,C,null)}}const k=w.children;for(let D=0,z=k.length;D<z;D++)y(k[D],E,A,b,M)}function S(w){w.target.removeEventListener("dispose",S);for(const A in l){const b=l[A],M=w.target.uuid;M in b&&(b[M].dispose(),delete b[M])}}}const jT={[Jl]:Ql,[th]:ih,[eh]:ah,[Xs]:nh,[Ql]:Jl,[ih]:th,[ah]:eh,[nh]:Xs};function qT(n,t){function e(){let F=!1;const St=new sn;let j=null;const ut=new sn(0,0,0,0);return{setMask:function(Nt){j!==Nt&&!F&&(n.colorMask(Nt,Nt,Nt,Nt),j=Nt)},setLocked:function(Nt){F=Nt},setClear:function(Nt,Dt,qt,le,he){he===!0&&(Nt*=le,Dt*=le,qt*=le),St.set(Nt,Dt,qt,le),ut.equals(St)===!1&&(n.clearColor(Nt,Dt,qt,le),ut.copy(St))},reset:function(){F=!1,j=null,ut.set(-1,0,0,0)}}}function i(){let F=!1,St=!1,j=null,ut=null,Nt=null;return{setReversed:function(Dt){if(St!==Dt){const qt=t.get("EXT_clip_control");St?qt.clipControlEXT(qt.LOWER_LEFT_EXT,qt.ZERO_TO_ONE_EXT):qt.clipControlEXT(qt.LOWER_LEFT_EXT,qt.NEGATIVE_ONE_TO_ONE_EXT);const le=Nt;Nt=null,this.setClear(le)}St=Dt},getReversed:function(){return St},setTest:function(Dt){Dt?$(n.DEPTH_TEST):q(n.DEPTH_TEST)},setMask:function(Dt){j!==Dt&&!F&&(n.depthMask(Dt),j=Dt)},setFunc:function(Dt){if(St&&(Dt=jT[Dt]),ut!==Dt){switch(Dt){case Jl:n.depthFunc(n.NEVER);break;case Ql:n.depthFunc(n.ALWAYS);break;case th:n.depthFunc(n.LESS);break;case Xs:n.depthFunc(n.LEQUAL);break;case eh:n.depthFunc(n.EQUAL);break;case nh:n.depthFunc(n.GEQUAL);break;case ih:n.depthFunc(n.GREATER);break;case ah:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ut=Dt}},setLocked:function(Dt){F=Dt},setClear:function(Dt){Nt!==Dt&&(St&&(Dt=1-Dt),n.clearDepth(Dt),Nt=Dt)},reset:function(){F=!1,j=null,ut=null,Nt=null,St=!1}}}function a(){let F=!1,St=null,j=null,ut=null,Nt=null,Dt=null,qt=null,le=null,he=null;return{setTest:function(ee){F||(ee?$(n.STENCIL_TEST):q(n.STENCIL_TEST))},setMask:function(ee){St!==ee&&!F&&(n.stencilMask(ee),St=ee)},setFunc:function(ee,we,De){(j!==ee||ut!==we||Nt!==De)&&(n.stencilFunc(ee,we,De),j=ee,ut=we,Nt=De)},setOp:function(ee,we,De){(Dt!==ee||qt!==we||le!==De)&&(n.stencilOp(ee,we,De),Dt=ee,qt=we,le=De)},setLocked:function(ee){F=ee},setClear:function(ee){he!==ee&&(n.clearStencil(ee),he=ee)},reset:function(){F=!1,St=null,j=null,ut=null,Nt=null,Dt=null,qt=null,le=null,he=null}}}const s=new e,o=new i,r=new a,c=new WeakMap,l=new WeakMap;let h={},u={},d=new WeakMap,f=[],m=null,v=!1,g=null,p=null,_=null,x=null,y=null,S=null,w=null,E=new Qt(0,0,0),A=0,b=!1,M=null,P=null,k=null,D=null,z=null;const C=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let T=!1,U=0;const G=n.getParameter(n.VERSION);G.indexOf("WebGL")!==-1?(U=parseFloat(/^WebGL (\d)/.exec(G)[1]),T=U>=1):G.indexOf("OpenGL ES")!==-1&&(U=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),T=U>=2);let Z=null,rt={};const pt=n.getParameter(n.SCISSOR_BOX),vt=n.getParameter(n.VIEWPORT),dt=new sn().fromArray(pt),Y=new sn().fromArray(vt);function N(F,St,j,ut){const Nt=new Uint8Array(4),Dt=n.createTexture();n.bindTexture(F,Dt),n.texParameteri(F,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(F,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let qt=0;qt<j;qt++)F===n.TEXTURE_3D||F===n.TEXTURE_2D_ARRAY?n.texImage3D(St,0,n.RGBA,1,1,ut,0,n.RGBA,n.UNSIGNED_BYTE,Nt):n.texImage2D(St+qt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Nt);return Dt}const X={};X[n.TEXTURE_2D]=N(n.TEXTURE_2D,n.TEXTURE_2D,1),X[n.TEXTURE_CUBE_MAP]=N(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),X[n.TEXTURE_2D_ARRAY]=N(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),X[n.TEXTURE_3D]=N(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),r.setClear(0),$(n.DEPTH_TEST),o.setFunc(Xs),Rt(!1),Mt(Ou),$(n.CULL_FACE),B(va);function $(F){h[F]!==!0&&(n.enable(F),h[F]=!0)}function q(F){h[F]!==!1&&(n.disable(F),h[F]=!1)}function ot(F,St){return u[F]!==St?(n.bindFramebuffer(F,St),u[F]=St,F===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=St),F===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=St),!0):!1}function Et(F,St){let j=f,ut=!1;if(F){j=d.get(St),j===void 0&&(j=[],d.set(St,j));const Nt=F.textures;if(j.length!==Nt.length||j[0]!==n.COLOR_ATTACHMENT0){for(let Dt=0,qt=Nt.length;Dt<qt;Dt++)j[Dt]=n.COLOR_ATTACHMENT0+Dt;j.length=Nt.length,ut=!0}}else j[0]!==n.BACK&&(j[0]=n.BACK,ut=!0);ut&&n.drawBuffers(j)}function Ht(F){return m!==F?(n.useProgram(F),m=F,!0):!1}const tt={[Xa]:n.FUNC_ADD,[J_]:n.FUNC_SUBTRACT,[Q_]:n.FUNC_REVERSE_SUBTRACT};tt[tb]=n.MIN,tt[eb]=n.MAX;const V={[nb]:n.ZERO,[ib]:n.ONE,[ab]:n.SRC_COLOR,[ql]:n.SRC_ALPHA,[hb]:n.SRC_ALPHA_SATURATE,[cb]:n.DST_COLOR,[ob]:n.DST_ALPHA,[sb]:n.ONE_MINUS_SRC_COLOR,[Kl]:n.ONE_MINUS_SRC_ALPHA,[lb]:n.ONE_MINUS_DST_COLOR,[rb]:n.ONE_MINUS_DST_ALPHA,[db]:n.CONSTANT_COLOR,[ub]:n.ONE_MINUS_CONSTANT_COLOR,[fb]:n.CONSTANT_ALPHA,[pb]:n.ONE_MINUS_CONSTANT_ALPHA};function B(F,St,j,ut,Nt,Dt,qt,le,he,ee){if(F===va){v===!0&&(q(n.BLEND),v=!1);return}if(v===!1&&($(n.BLEND),v=!0),F!==K_){if(F!==g||ee!==b){if((p!==Xa||y!==Xa)&&(n.blendEquation(n.FUNC_ADD),p=Xa,y=Xa),ee)switch(F){case zs:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ji:n.blendFunc(n.ONE,n.ONE);break;case Bu:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Hu:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case zs:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ji:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Bu:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Hu:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}_=null,x=null,S=null,w=null,E.set(0,0,0),A=0,g=F,b=ee}return}Nt=Nt||St,Dt=Dt||j,qt=qt||ut,(St!==p||Nt!==y)&&(n.blendEquationSeparate(tt[St],tt[Nt]),p=St,y=Nt),(j!==_||ut!==x||Dt!==S||qt!==w)&&(n.blendFuncSeparate(V[j],V[ut],V[Dt],V[qt]),_=j,x=ut,S=Dt,w=qt),(le.equals(E)===!1||he!==A)&&(n.blendColor(le.r,le.g,le.b,he),E.copy(le),A=he),g=F,b=!1}function kt(F,St){F.side===je?q(n.CULL_FACE):$(n.CULL_FACE);let j=F.side===jn;St&&(j=!j),Rt(j),F.blending===zs&&F.transparent===!1?B(va):B(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),o.setFunc(F.depthFunc),o.setTest(F.depthTest),o.setMask(F.depthWrite),s.setMask(F.colorWrite);const ut=F.stencilWrite;r.setTest(ut),ut&&(r.setMask(F.stencilWriteMask),r.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),r.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),gt(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?$(n.SAMPLE_ALPHA_TO_COVERAGE):q(n.SAMPLE_ALPHA_TO_COVERAGE)}function Rt(F){M!==F&&(F?n.frontFace(n.CW):n.frontFace(n.CCW),M=F)}function Mt(F){F!==j_?($(n.CULL_FACE),F!==P&&(F===Ou?n.cullFace(n.BACK):F===q_?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):q(n.CULL_FACE),P=F}function mt(F){F!==k&&(T&&n.lineWidth(F),k=F)}function gt(F,St,j){F?($(n.POLYGON_OFFSET_FILL),(D!==St||z!==j)&&(n.polygonOffset(St,j),D=St,z=j)):q(n.POLYGON_OFFSET_FILL)}function Pt(F){F?$(n.SCISSOR_TEST):q(n.SCISSOR_TEST)}function L(F){F===void 0&&(F=n.TEXTURE0+C-1),Z!==F&&(n.activeTexture(F),Z=F)}function R(F,St,j){j===void 0&&(Z===null?j=n.TEXTURE0+C-1:j=Z);let ut=rt[j];ut===void 0&&(ut={type:void 0,texture:void 0},rt[j]=ut),(ut.type!==F||ut.texture!==St)&&(Z!==j&&(n.activeTexture(j),Z=j),n.bindTexture(F,St||X[F]),ut.type=F,ut.texture=St)}function Q(){const F=rt[Z];F!==void 0&&F.type!==void 0&&(n.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function ft(){try{n.compressedTexImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function at(){try{n.compressedTexImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ht(){try{n.texSubImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function zt(){try{n.texSubImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ct(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function wt(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Xt(){try{n.texStorage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function xt(){try{n.texStorage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function It(){try{n.texImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function J(){try{n.texImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function K(F){dt.equals(F)===!1&&(n.scissor(F.x,F.y,F.z,F.w),dt.copy(F))}function st(F){Y.equals(F)===!1&&(n.viewport(F.x,F.y,F.z,F.w),Y.copy(F))}function Ot(F,St){let j=l.get(St);j===void 0&&(j=new WeakMap,l.set(St,j));let ut=j.get(F);ut===void 0&&(ut=n.getUniformBlockIndex(St,F.name),j.set(F,ut))}function Ft(F,St){const ut=l.get(St).get(F);c.get(St)!==ut&&(n.uniformBlockBinding(St,ut,F.__bindingPointIndex),c.set(St,ut))}function Lt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},Z=null,rt={},u={},d=new WeakMap,f=[],m=null,v=!1,g=null,p=null,_=null,x=null,y=null,S=null,w=null,E=new Qt(0,0,0),A=0,b=!1,M=null,P=null,k=null,D=null,z=null,dt.set(0,0,n.canvas.width,n.canvas.height),Y.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),r.reset()}return{buffers:{color:s,depth:o,stencil:r},enable:$,disable:q,bindFramebuffer:ot,drawBuffers:Et,useProgram:Ht,setBlending:B,setMaterial:kt,setFlipSided:Rt,setCullFace:Mt,setLineWidth:mt,setPolygonOffset:gt,setScissorTest:Pt,activeTexture:L,bindTexture:R,unbindTexture:Q,compressedTexImage2D:ft,compressedTexImage3D:at,texImage2D:It,texImage3D:J,updateUBOMapping:Ot,uniformBlockBinding:Ft,texStorage2D:Xt,texStorage3D:xt,texSubImage2D:ht,texSubImage3D:zt,compressedTexSubImage2D:Ct,compressedTexSubImage3D:wt,scissor:K,viewport:st,reset:Lt}}function Uf(n,t,e,i){const a=KT(i);switch(e){case pm:return n*t;case gm:return n*t;case xm:return n*t*2;case od:return n*t/a.components*a.byteLength;case rd:return n*t/a.components*a.byteLength;case vm:return n*t*2/a.components*a.byteLength;case cd:return n*t*2/a.components*a.byteLength;case mm:return n*t*3/a.components*a.byteLength;case Si:return n*t*4/a.components*a.byteLength;case ld:return n*t*4/a.components*a.byteLength;case Hr:case Gr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Xr:case Vr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case hh:case uh:return Math.max(n,16)*Math.max(t,8)/4;case lh:case dh:return Math.max(n,8)*Math.max(t,8)/2;case fh:case ph:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case mh:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case gh:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case xh:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case vh:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case yh:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case Mh:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case _h:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case bh:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Sh:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case wh:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Eh:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Th:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Ah:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case Rh:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Ph:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case Wr:case Ch:case Dh:return Math.ceil(n/4)*Math.ceil(t/4)*16;case ym:case Lh:return Math.ceil(n/4)*Math.ceil(t/4)*8;case kh:case Ih:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function KT(n){switch(n){case na:case dm:return{byteLength:1,components:1};case Bo:case um:case $o:return{byteLength:2,components:1};case ad:case sd:return{byteLength:2,components:4};case ja:case id:case zi:return{byteLength:4,components:1};case fm:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function JT(n,t,e,i,a,s,o){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Yt,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(L,R){return f?new OffscreenCanvas(L,R):rc("canvas")}function v(L,R,Q){let ft=1;const at=Pt(L);if((at.width>Q||at.height>Q)&&(ft=Q/Math.max(at.width,at.height)),ft<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){const ht=Math.floor(ft*at.width),zt=Math.floor(ft*at.height);u===void 0&&(u=m(ht,zt));const Ct=R?m(ht,zt):u;return Ct.width=ht,Ct.height=zt,Ct.getContext("2d").drawImage(L,0,0,ht,zt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+at.width+"x"+at.height+") to ("+ht+"x"+zt+")."),Ct}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+at.width+"x"+at.height+")."),L;return L}function g(L){return L.generateMipmaps}function p(L){n.generateMipmap(L)}function _(L){return L.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?n.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(L,R,Q,ft,at=!1){if(L!==null){if(n[L]!==void 0)return n[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let ht=R;if(R===n.RED&&(Q===n.FLOAT&&(ht=n.R32F),Q===n.HALF_FLOAT&&(ht=n.R16F),Q===n.UNSIGNED_BYTE&&(ht=n.R8)),R===n.RED_INTEGER&&(Q===n.UNSIGNED_BYTE&&(ht=n.R8UI),Q===n.UNSIGNED_SHORT&&(ht=n.R16UI),Q===n.UNSIGNED_INT&&(ht=n.R32UI),Q===n.BYTE&&(ht=n.R8I),Q===n.SHORT&&(ht=n.R16I),Q===n.INT&&(ht=n.R32I)),R===n.RG&&(Q===n.FLOAT&&(ht=n.RG32F),Q===n.HALF_FLOAT&&(ht=n.RG16F),Q===n.UNSIGNED_BYTE&&(ht=n.RG8)),R===n.RG_INTEGER&&(Q===n.UNSIGNED_BYTE&&(ht=n.RG8UI),Q===n.UNSIGNED_SHORT&&(ht=n.RG16UI),Q===n.UNSIGNED_INT&&(ht=n.RG32UI),Q===n.BYTE&&(ht=n.RG8I),Q===n.SHORT&&(ht=n.RG16I),Q===n.INT&&(ht=n.RG32I)),R===n.RGB_INTEGER&&(Q===n.UNSIGNED_BYTE&&(ht=n.RGB8UI),Q===n.UNSIGNED_SHORT&&(ht=n.RGB16UI),Q===n.UNSIGNED_INT&&(ht=n.RGB32UI),Q===n.BYTE&&(ht=n.RGB8I),Q===n.SHORT&&(ht=n.RGB16I),Q===n.INT&&(ht=n.RGB32I)),R===n.RGBA_INTEGER&&(Q===n.UNSIGNED_BYTE&&(ht=n.RGBA8UI),Q===n.UNSIGNED_SHORT&&(ht=n.RGBA16UI),Q===n.UNSIGNED_INT&&(ht=n.RGBA32UI),Q===n.BYTE&&(ht=n.RGBA8I),Q===n.SHORT&&(ht=n.RGBA16I),Q===n.INT&&(ht=n.RGBA32I)),R===n.RGB&&Q===n.UNSIGNED_INT_5_9_9_9_REV&&(ht=n.RGB9_E5),R===n.RGBA){const zt=at?Mc:Te.getTransfer(ft);Q===n.FLOAT&&(ht=n.RGBA32F),Q===n.HALF_FLOAT&&(ht=n.RGBA16F),Q===n.UNSIGNED_BYTE&&(ht=zt===Ne?n.SRGB8_ALPHA8:n.RGBA8),Q===n.UNSIGNED_SHORT_4_4_4_4&&(ht=n.RGBA4),Q===n.UNSIGNED_SHORT_5_5_5_1&&(ht=n.RGB5_A1)}return(ht===n.R16F||ht===n.R32F||ht===n.RG16F||ht===n.RG32F||ht===n.RGBA16F||ht===n.RGBA32F)&&t.get("EXT_color_buffer_float"),ht}function y(L,R){let Q;return L?R===null||R===ja||R===Ys?Q=n.DEPTH24_STENCIL8:R===zi?Q=n.DEPTH32F_STENCIL8:R===Bo&&(Q=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):R===null||R===ja||R===Ys?Q=n.DEPTH_COMPONENT24:R===zi?Q=n.DEPTH_COMPONENT32F:R===Bo&&(Q=n.DEPTH_COMPONENT16),Q}function S(L,R){return g(L)===!0||L.isFramebufferTexture&&L.minFilter!==oi&&L.minFilter!==Ii?Math.log2(Math.max(R.width,R.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?R.mipmaps.length:1}function w(L){const R=L.target;R.removeEventListener("dispose",w),A(R),R.isVideoTexture&&h.delete(R)}function E(L){const R=L.target;R.removeEventListener("dispose",E),M(R)}function A(L){const R=i.get(L);if(R.__webglInit===void 0)return;const Q=L.source,ft=d.get(Q);if(ft){const at=ft[R.__cacheKey];at.usedTimes--,at.usedTimes===0&&b(L),Object.keys(ft).length===0&&d.delete(Q)}i.remove(L)}function b(L){const R=i.get(L);n.deleteTexture(R.__webglTexture);const Q=L.source,ft=d.get(Q);delete ft[R.__cacheKey],o.memory.textures--}function M(L){const R=i.get(L);if(L.depthTexture&&(L.depthTexture.dispose(),i.remove(L.depthTexture)),L.isWebGLCubeRenderTarget)for(let ft=0;ft<6;ft++){if(Array.isArray(R.__webglFramebuffer[ft]))for(let at=0;at<R.__webglFramebuffer[ft].length;at++)n.deleteFramebuffer(R.__webglFramebuffer[ft][at]);else n.deleteFramebuffer(R.__webglFramebuffer[ft]);R.__webglDepthbuffer&&n.deleteRenderbuffer(R.__webglDepthbuffer[ft])}else{if(Array.isArray(R.__webglFramebuffer))for(let ft=0;ft<R.__webglFramebuffer.length;ft++)n.deleteFramebuffer(R.__webglFramebuffer[ft]);else n.deleteFramebuffer(R.__webglFramebuffer);if(R.__webglDepthbuffer&&n.deleteRenderbuffer(R.__webglDepthbuffer),R.__webglMultisampledFramebuffer&&n.deleteFramebuffer(R.__webglMultisampledFramebuffer),R.__webglColorRenderbuffer)for(let ft=0;ft<R.__webglColorRenderbuffer.length;ft++)R.__webglColorRenderbuffer[ft]&&n.deleteRenderbuffer(R.__webglColorRenderbuffer[ft]);R.__webglDepthRenderbuffer&&n.deleteRenderbuffer(R.__webglDepthRenderbuffer)}const Q=L.textures;for(let ft=0,at=Q.length;ft<at;ft++){const ht=i.get(Q[ft]);ht.__webglTexture&&(n.deleteTexture(ht.__webglTexture),o.memory.textures--),i.remove(Q[ft])}i.remove(L)}let P=0;function k(){P=0}function D(){const L=P;return L>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+a.maxTextures),P+=1,L}function z(L){const R=[];return R.push(L.wrapS),R.push(L.wrapT),R.push(L.wrapR||0),R.push(L.magFilter),R.push(L.minFilter),R.push(L.anisotropy),R.push(L.internalFormat),R.push(L.format),R.push(L.type),R.push(L.generateMipmaps),R.push(L.premultiplyAlpha),R.push(L.flipY),R.push(L.unpackAlignment),R.push(L.colorSpace),R.join()}function C(L,R){const Q=i.get(L);if(L.isVideoTexture&&mt(L),L.isRenderTargetTexture===!1&&L.version>0&&Q.__version!==L.version){const ft=L.image;if(ft===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ft.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(Q,L,R);return}}e.bindTexture(n.TEXTURE_2D,Q.__webglTexture,n.TEXTURE0+R)}function T(L,R){const Q=i.get(L);if(L.version>0&&Q.__version!==L.version){Y(Q,L,R);return}e.bindTexture(n.TEXTURE_2D_ARRAY,Q.__webglTexture,n.TEXTURE0+R)}function U(L,R){const Q=i.get(L);if(L.version>0&&Q.__version!==L.version){Y(Q,L,R);return}e.bindTexture(n.TEXTURE_3D,Q.__webglTexture,n.TEXTURE0+R)}function G(L,R){const Q=i.get(L);if(L.version>0&&Q.__version!==L.version){N(Q,L,R);return}e.bindTexture(n.TEXTURE_CUBE_MAP,Q.__webglTexture,n.TEXTURE0+R)}const Z={[rh]:n.REPEAT,[Wa]:n.CLAMP_TO_EDGE,[ch]:n.MIRRORED_REPEAT},rt={[oi]:n.NEAREST,[wb]:n.NEAREST_MIPMAP_NEAREST,[ar]:n.NEAREST_MIPMAP_LINEAR,[Ii]:n.LINEAR,[Zc]:n.LINEAR_MIPMAP_NEAREST,[Ya]:n.LINEAR_MIPMAP_LINEAR},pt={[Rb]:n.NEVER,[Ib]:n.ALWAYS,[Pb]:n.LESS,[_m]:n.LEQUAL,[Cb]:n.EQUAL,[kb]:n.GEQUAL,[Db]:n.GREATER,[Lb]:n.NOTEQUAL};function vt(L,R){if(R.type===zi&&t.has("OES_texture_float_linear")===!1&&(R.magFilter===Ii||R.magFilter===Zc||R.magFilter===ar||R.magFilter===Ya||R.minFilter===Ii||R.minFilter===Zc||R.minFilter===ar||R.minFilter===Ya)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(L,n.TEXTURE_WRAP_S,Z[R.wrapS]),n.texParameteri(L,n.TEXTURE_WRAP_T,Z[R.wrapT]),(L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY)&&n.texParameteri(L,n.TEXTURE_WRAP_R,Z[R.wrapR]),n.texParameteri(L,n.TEXTURE_MAG_FILTER,rt[R.magFilter]),n.texParameteri(L,n.TEXTURE_MIN_FILTER,rt[R.minFilter]),R.compareFunction&&(n.texParameteri(L,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(L,n.TEXTURE_COMPARE_FUNC,pt[R.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(R.magFilter===oi||R.minFilter!==ar&&R.minFilter!==Ya||R.type===zi&&t.has("OES_texture_float_linear")===!1)return;if(R.anisotropy>1||i.get(R).__currentAnisotropy){const Q=t.get("EXT_texture_filter_anisotropic");n.texParameterf(L,Q.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(R.anisotropy,a.getMaxAnisotropy())),i.get(R).__currentAnisotropy=R.anisotropy}}}function dt(L,R){let Q=!1;L.__webglInit===void 0&&(L.__webglInit=!0,R.addEventListener("dispose",w));const ft=R.source;let at=d.get(ft);at===void 0&&(at={},d.set(ft,at));const ht=z(R);if(ht!==L.__cacheKey){at[ht]===void 0&&(at[ht]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,Q=!0),at[ht].usedTimes++;const zt=at[L.__cacheKey];zt!==void 0&&(at[L.__cacheKey].usedTimes--,zt.usedTimes===0&&b(R)),L.__cacheKey=ht,L.__webglTexture=at[ht].texture}return Q}function Y(L,R,Q){let ft=n.TEXTURE_2D;(R.isDataArrayTexture||R.isCompressedArrayTexture)&&(ft=n.TEXTURE_2D_ARRAY),R.isData3DTexture&&(ft=n.TEXTURE_3D);const at=dt(L,R),ht=R.source;e.bindTexture(ft,L.__webglTexture,n.TEXTURE0+Q);const zt=i.get(ht);if(ht.version!==zt.__version||at===!0){e.activeTexture(n.TEXTURE0+Q);const Ct=Te.getPrimaries(Te.workingColorSpace),wt=R.colorSpace===fa?null:Te.getPrimaries(R.colorSpace),Xt=R.colorSpace===fa||Ct===wt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,R.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,R.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Xt);let xt=v(R.image,!1,a.maxTextureSize);xt=gt(R,xt);const It=s.convert(R.format,R.colorSpace),J=s.convert(R.type);let K=x(R.internalFormat,It,J,R.colorSpace,R.isVideoTexture);vt(ft,R);let st;const Ot=R.mipmaps,Ft=R.isVideoTexture!==!0,Lt=zt.__version===void 0||at===!0,F=ht.dataReady,St=S(R,xt);if(R.isDepthTexture)K=y(R.format===$s,R.type),Lt&&(Ft?e.texStorage2D(n.TEXTURE_2D,1,K,xt.width,xt.height):e.texImage2D(n.TEXTURE_2D,0,K,xt.width,xt.height,0,It,J,null));else if(R.isDataTexture)if(Ot.length>0){Ft&&Lt&&e.texStorage2D(n.TEXTURE_2D,St,K,Ot[0].width,Ot[0].height);for(let j=0,ut=Ot.length;j<ut;j++)st=Ot[j],Ft?F&&e.texSubImage2D(n.TEXTURE_2D,j,0,0,st.width,st.height,It,J,st.data):e.texImage2D(n.TEXTURE_2D,j,K,st.width,st.height,0,It,J,st.data);R.generateMipmaps=!1}else Ft?(Lt&&e.texStorage2D(n.TEXTURE_2D,St,K,xt.width,xt.height),F&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,xt.width,xt.height,It,J,xt.data)):e.texImage2D(n.TEXTURE_2D,0,K,xt.width,xt.height,0,It,J,xt.data);else if(R.isCompressedTexture)if(R.isCompressedArrayTexture){Ft&&Lt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,St,K,Ot[0].width,Ot[0].height,xt.depth);for(let j=0,ut=Ot.length;j<ut;j++)if(st=Ot[j],R.format!==Si)if(It!==null)if(Ft){if(F)if(R.layerUpdates.size>0){const Nt=Uf(st.width,st.height,R.format,R.type);for(const Dt of R.layerUpdates){const qt=st.data.subarray(Dt*Nt/st.data.BYTES_PER_ELEMENT,(Dt+1)*Nt/st.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,j,0,0,Dt,st.width,st.height,1,It,qt)}R.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,j,0,0,0,st.width,st.height,xt.depth,It,st.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,j,K,st.width,st.height,xt.depth,0,st.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ft?F&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,j,0,0,0,st.width,st.height,xt.depth,It,J,st.data):e.texImage3D(n.TEXTURE_2D_ARRAY,j,K,st.width,st.height,xt.depth,0,It,J,st.data)}else{Ft&&Lt&&e.texStorage2D(n.TEXTURE_2D,St,K,Ot[0].width,Ot[0].height);for(let j=0,ut=Ot.length;j<ut;j++)st=Ot[j],R.format!==Si?It!==null?Ft?F&&e.compressedTexSubImage2D(n.TEXTURE_2D,j,0,0,st.width,st.height,It,st.data):e.compressedTexImage2D(n.TEXTURE_2D,j,K,st.width,st.height,0,st.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ft?F&&e.texSubImage2D(n.TEXTURE_2D,j,0,0,st.width,st.height,It,J,st.data):e.texImage2D(n.TEXTURE_2D,j,K,st.width,st.height,0,It,J,st.data)}else if(R.isDataArrayTexture)if(Ft){if(Lt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,St,K,xt.width,xt.height,xt.depth),F)if(R.layerUpdates.size>0){const j=Uf(xt.width,xt.height,R.format,R.type);for(const ut of R.layerUpdates){const Nt=xt.data.subarray(ut*j/xt.data.BYTES_PER_ELEMENT,(ut+1)*j/xt.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ut,xt.width,xt.height,1,It,J,Nt)}R.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,xt.width,xt.height,xt.depth,It,J,xt.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,K,xt.width,xt.height,xt.depth,0,It,J,xt.data);else if(R.isData3DTexture)Ft?(Lt&&e.texStorage3D(n.TEXTURE_3D,St,K,xt.width,xt.height,xt.depth),F&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,xt.width,xt.height,xt.depth,It,J,xt.data)):e.texImage3D(n.TEXTURE_3D,0,K,xt.width,xt.height,xt.depth,0,It,J,xt.data);else if(R.isFramebufferTexture){if(Lt)if(Ft)e.texStorage2D(n.TEXTURE_2D,St,K,xt.width,xt.height);else{let j=xt.width,ut=xt.height;for(let Nt=0;Nt<St;Nt++)e.texImage2D(n.TEXTURE_2D,Nt,K,j,ut,0,It,J,null),j>>=1,ut>>=1}}else if(Ot.length>0){if(Ft&&Lt){const j=Pt(Ot[0]);e.texStorage2D(n.TEXTURE_2D,St,K,j.width,j.height)}for(let j=0,ut=Ot.length;j<ut;j++)st=Ot[j],Ft?F&&e.texSubImage2D(n.TEXTURE_2D,j,0,0,It,J,st):e.texImage2D(n.TEXTURE_2D,j,K,It,J,st);R.generateMipmaps=!1}else if(Ft){if(Lt){const j=Pt(xt);e.texStorage2D(n.TEXTURE_2D,St,K,j.width,j.height)}F&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,It,J,xt)}else e.texImage2D(n.TEXTURE_2D,0,K,It,J,xt);g(R)&&p(ft),zt.__version=ht.version,R.onUpdate&&R.onUpdate(R)}L.__version=R.version}function N(L,R,Q){if(R.image.length!==6)return;const ft=dt(L,R),at=R.source;e.bindTexture(n.TEXTURE_CUBE_MAP,L.__webglTexture,n.TEXTURE0+Q);const ht=i.get(at);if(at.version!==ht.__version||ft===!0){e.activeTexture(n.TEXTURE0+Q);const zt=Te.getPrimaries(Te.workingColorSpace),Ct=R.colorSpace===fa?null:Te.getPrimaries(R.colorSpace),wt=R.colorSpace===fa||zt===Ct?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,R.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,R.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,wt);const Xt=R.isCompressedTexture||R.image[0].isCompressedTexture,xt=R.image[0]&&R.image[0].isDataTexture,It=[];for(let ut=0;ut<6;ut++)!Xt&&!xt?It[ut]=v(R.image[ut],!0,a.maxCubemapSize):It[ut]=xt?R.image[ut].image:R.image[ut],It[ut]=gt(R,It[ut]);const J=It[0],K=s.convert(R.format,R.colorSpace),st=s.convert(R.type),Ot=x(R.internalFormat,K,st,R.colorSpace),Ft=R.isVideoTexture!==!0,Lt=ht.__version===void 0||ft===!0,F=at.dataReady;let St=S(R,J);vt(n.TEXTURE_CUBE_MAP,R);let j;if(Xt){Ft&&Lt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,St,Ot,J.width,J.height);for(let ut=0;ut<6;ut++){j=It[ut].mipmaps;for(let Nt=0;Nt<j.length;Nt++){const Dt=j[Nt];R.format!==Si?K!==null?Ft?F&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Nt,0,0,Dt.width,Dt.height,K,Dt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Nt,Ot,Dt.width,Dt.height,0,Dt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ft?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Nt,0,0,Dt.width,Dt.height,K,st,Dt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Nt,Ot,Dt.width,Dt.height,0,K,st,Dt.data)}}}else{if(j=R.mipmaps,Ft&&Lt){j.length>0&&St++;const ut=Pt(It[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,St,Ot,ut.width,ut.height)}for(let ut=0;ut<6;ut++)if(xt){Ft?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,0,0,It[ut].width,It[ut].height,K,st,It[ut].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,Ot,It[ut].width,It[ut].height,0,K,st,It[ut].data);for(let Nt=0;Nt<j.length;Nt++){const qt=j[Nt].image[ut].image;Ft?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Nt+1,0,0,qt.width,qt.height,K,st,qt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Nt+1,Ot,qt.width,qt.height,0,K,st,qt.data)}}else{Ft?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,0,0,K,st,It[ut]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,Ot,K,st,It[ut]);for(let Nt=0;Nt<j.length;Nt++){const Dt=j[Nt];Ft?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Nt+1,0,0,K,st,Dt.image[ut]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Nt+1,Ot,K,st,Dt.image[ut])}}}g(R)&&p(n.TEXTURE_CUBE_MAP),ht.__version=at.version,R.onUpdate&&R.onUpdate(R)}L.__version=R.version}function X(L,R,Q,ft,at,ht){const zt=s.convert(Q.format,Q.colorSpace),Ct=s.convert(Q.type),wt=x(Q.internalFormat,zt,Ct,Q.colorSpace),Xt=i.get(R),xt=i.get(Q);if(xt.__renderTarget=R,!Xt.__hasExternalTextures){const It=Math.max(1,R.width>>ht),J=Math.max(1,R.height>>ht);at===n.TEXTURE_3D||at===n.TEXTURE_2D_ARRAY?e.texImage3D(at,ht,wt,It,J,R.depth,0,zt,Ct,null):e.texImage2D(at,ht,wt,It,J,0,zt,Ct,null)}e.bindFramebuffer(n.FRAMEBUFFER,L),Mt(R)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ft,at,xt.__webglTexture,0,Rt(R)):(at===n.TEXTURE_2D||at>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&at<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ft,at,xt.__webglTexture,ht),e.bindFramebuffer(n.FRAMEBUFFER,null)}function $(L,R,Q){if(n.bindRenderbuffer(n.RENDERBUFFER,L),R.depthBuffer){const ft=R.depthTexture,at=ft&&ft.isDepthTexture?ft.type:null,ht=y(R.stencilBuffer,at),zt=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ct=Rt(R);Mt(R)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ct,ht,R.width,R.height):Q?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ct,ht,R.width,R.height):n.renderbufferStorage(n.RENDERBUFFER,ht,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,zt,n.RENDERBUFFER,L)}else{const ft=R.textures;for(let at=0;at<ft.length;at++){const ht=ft[at],zt=s.convert(ht.format,ht.colorSpace),Ct=s.convert(ht.type),wt=x(ht.internalFormat,zt,Ct,ht.colorSpace),Xt=Rt(R);Q&&Mt(R)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Xt,wt,R.width,R.height):Mt(R)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Xt,wt,R.width,R.height):n.renderbufferStorage(n.RENDERBUFFER,wt,R.width,R.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function q(L,R){if(R&&R.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,L),!(R.depthTexture&&R.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ft=i.get(R.depthTexture);ft.__renderTarget=R,(!ft.__webglTexture||R.depthTexture.image.width!==R.width||R.depthTexture.image.height!==R.height)&&(R.depthTexture.image.width=R.width,R.depthTexture.image.height=R.height,R.depthTexture.needsUpdate=!0),C(R.depthTexture,0);const at=ft.__webglTexture,ht=Rt(R);if(R.depthTexture.format===Fs)Mt(R)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,at,0,ht):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,at,0);else if(R.depthTexture.format===$s)Mt(R)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,at,0,ht):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,at,0);else throw new Error("Unknown depthTexture format")}function ot(L){const R=i.get(L),Q=L.isWebGLCubeRenderTarget===!0;if(R.__boundDepthTexture!==L.depthTexture){const ft=L.depthTexture;if(R.__depthDisposeCallback&&R.__depthDisposeCallback(),ft){const at=()=>{delete R.__boundDepthTexture,delete R.__depthDisposeCallback,ft.removeEventListener("dispose",at)};ft.addEventListener("dispose",at),R.__depthDisposeCallback=at}R.__boundDepthTexture=ft}if(L.depthTexture&&!R.__autoAllocateDepthBuffer){if(Q)throw new Error("target.depthTexture not supported in Cube render targets");q(R.__webglFramebuffer,L)}else if(Q){R.__webglDepthbuffer=[];for(let ft=0;ft<6;ft++)if(e.bindFramebuffer(n.FRAMEBUFFER,R.__webglFramebuffer[ft]),R.__webglDepthbuffer[ft]===void 0)R.__webglDepthbuffer[ft]=n.createRenderbuffer(),$(R.__webglDepthbuffer[ft],L,!1);else{const at=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ht=R.__webglDepthbuffer[ft];n.bindRenderbuffer(n.RENDERBUFFER,ht),n.framebufferRenderbuffer(n.FRAMEBUFFER,at,n.RENDERBUFFER,ht)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,R.__webglFramebuffer),R.__webglDepthbuffer===void 0)R.__webglDepthbuffer=n.createRenderbuffer(),$(R.__webglDepthbuffer,L,!1);else{const ft=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,at=R.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,at),n.framebufferRenderbuffer(n.FRAMEBUFFER,ft,n.RENDERBUFFER,at)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Et(L,R,Q){const ft=i.get(L);R!==void 0&&X(ft.__webglFramebuffer,L,L.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),Q!==void 0&&ot(L)}function Ht(L){const R=L.texture,Q=i.get(L),ft=i.get(R);L.addEventListener("dispose",E);const at=L.textures,ht=L.isWebGLCubeRenderTarget===!0,zt=at.length>1;if(zt||(ft.__webglTexture===void 0&&(ft.__webglTexture=n.createTexture()),ft.__version=R.version,o.memory.textures++),ht){Q.__webglFramebuffer=[];for(let Ct=0;Ct<6;Ct++)if(R.mipmaps&&R.mipmaps.length>0){Q.__webglFramebuffer[Ct]=[];for(let wt=0;wt<R.mipmaps.length;wt++)Q.__webglFramebuffer[Ct][wt]=n.createFramebuffer()}else Q.__webglFramebuffer[Ct]=n.createFramebuffer()}else{if(R.mipmaps&&R.mipmaps.length>0){Q.__webglFramebuffer=[];for(let Ct=0;Ct<R.mipmaps.length;Ct++)Q.__webglFramebuffer[Ct]=n.createFramebuffer()}else Q.__webglFramebuffer=n.createFramebuffer();if(zt)for(let Ct=0,wt=at.length;Ct<wt;Ct++){const Xt=i.get(at[Ct]);Xt.__webglTexture===void 0&&(Xt.__webglTexture=n.createTexture(),o.memory.textures++)}if(L.samples>0&&Mt(L)===!1){Q.__webglMultisampledFramebuffer=n.createFramebuffer(),Q.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,Q.__webglMultisampledFramebuffer);for(let Ct=0;Ct<at.length;Ct++){const wt=at[Ct];Q.__webglColorRenderbuffer[Ct]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,Q.__webglColorRenderbuffer[Ct]);const Xt=s.convert(wt.format,wt.colorSpace),xt=s.convert(wt.type),It=x(wt.internalFormat,Xt,xt,wt.colorSpace,L.isXRRenderTarget===!0),J=Rt(L);n.renderbufferStorageMultisample(n.RENDERBUFFER,J,It,L.width,L.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ct,n.RENDERBUFFER,Q.__webglColorRenderbuffer[Ct])}n.bindRenderbuffer(n.RENDERBUFFER,null),L.depthBuffer&&(Q.__webglDepthRenderbuffer=n.createRenderbuffer(),$(Q.__webglDepthRenderbuffer,L,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ht){e.bindTexture(n.TEXTURE_CUBE_MAP,ft.__webglTexture),vt(n.TEXTURE_CUBE_MAP,R);for(let Ct=0;Ct<6;Ct++)if(R.mipmaps&&R.mipmaps.length>0)for(let wt=0;wt<R.mipmaps.length;wt++)X(Q.__webglFramebuffer[Ct][wt],L,R,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Ct,wt);else X(Q.__webglFramebuffer[Ct],L,R,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Ct,0);g(R)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(zt){for(let Ct=0,wt=at.length;Ct<wt;Ct++){const Xt=at[Ct],xt=i.get(Xt);e.bindTexture(n.TEXTURE_2D,xt.__webglTexture),vt(n.TEXTURE_2D,Xt),X(Q.__webglFramebuffer,L,Xt,n.COLOR_ATTACHMENT0+Ct,n.TEXTURE_2D,0),g(Xt)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let Ct=n.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(Ct=L.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(Ct,ft.__webglTexture),vt(Ct,R),R.mipmaps&&R.mipmaps.length>0)for(let wt=0;wt<R.mipmaps.length;wt++)X(Q.__webglFramebuffer[wt],L,R,n.COLOR_ATTACHMENT0,Ct,wt);else X(Q.__webglFramebuffer,L,R,n.COLOR_ATTACHMENT0,Ct,0);g(R)&&p(Ct),e.unbindTexture()}L.depthBuffer&&ot(L)}function tt(L){const R=L.textures;for(let Q=0,ft=R.length;Q<ft;Q++){const at=R[Q];if(g(at)){const ht=_(L),zt=i.get(at).__webglTexture;e.bindTexture(ht,zt),p(ht),e.unbindTexture()}}}const V=[],B=[];function kt(L){if(L.samples>0){if(Mt(L)===!1){const R=L.textures,Q=L.width,ft=L.height;let at=n.COLOR_BUFFER_BIT;const ht=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,zt=i.get(L),Ct=R.length>1;if(Ct)for(let wt=0;wt<R.length;wt++)e.bindFramebuffer(n.FRAMEBUFFER,zt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+wt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,zt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+wt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,zt.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,zt.__webglFramebuffer);for(let wt=0;wt<R.length;wt++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(at|=n.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(at|=n.STENCIL_BUFFER_BIT)),Ct){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,zt.__webglColorRenderbuffer[wt]);const Xt=i.get(R[wt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Xt,0)}n.blitFramebuffer(0,0,Q,ft,0,0,Q,ft,at,n.NEAREST),c===!0&&(V.length=0,B.length=0,V.push(n.COLOR_ATTACHMENT0+wt),L.depthBuffer&&L.resolveDepthBuffer===!1&&(V.push(ht),B.push(ht),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,B)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,V))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Ct)for(let wt=0;wt<R.length;wt++){e.bindFramebuffer(n.FRAMEBUFFER,zt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+wt,n.RENDERBUFFER,zt.__webglColorRenderbuffer[wt]);const Xt=i.get(R[wt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,zt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+wt,n.TEXTURE_2D,Xt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,zt.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.resolveDepthBuffer===!1&&c){const R=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[R])}}}function Rt(L){return Math.min(a.maxSamples,L.samples)}function Mt(L){const R=i.get(L);return L.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&R.__useRenderToTexture!==!1}function mt(L){const R=o.render.frame;h.get(L)!==R&&(h.set(L,R),L.update())}function gt(L,R){const Q=L.colorSpace,ft=L.format,at=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||Q!==js&&Q!==fa&&(Te.getTransfer(Q)===Ne?(ft!==Si||at!==na)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Q)),R}function Pt(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(l.width=L.naturalWidth||L.width,l.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(l.width=L.displayWidth,l.height=L.displayHeight):(l.width=L.width,l.height=L.height),l}this.allocateTextureUnit=D,this.resetTextureUnits=k,this.setTexture2D=C,this.setTexture2DArray=T,this.setTexture3D=U,this.setTextureCube=G,this.rebindTextures=Et,this.setupRenderTarget=Ht,this.updateRenderTargetMipmap=tt,this.updateMultisampleRenderTarget=kt,this.setupDepthRenderbuffer=ot,this.setupFrameBufferTexture=X,this.useMultisampledRTT=Mt}function QT(n,t){function e(i,a=fa){let s;const o=Te.getTransfer(a);if(i===na)return n.UNSIGNED_BYTE;if(i===ad)return n.UNSIGNED_SHORT_4_4_4_4;if(i===sd)return n.UNSIGNED_SHORT_5_5_5_1;if(i===fm)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===dm)return n.BYTE;if(i===um)return n.SHORT;if(i===Bo)return n.UNSIGNED_SHORT;if(i===id)return n.INT;if(i===ja)return n.UNSIGNED_INT;if(i===zi)return n.FLOAT;if(i===$o)return n.HALF_FLOAT;if(i===pm)return n.ALPHA;if(i===mm)return n.RGB;if(i===Si)return n.RGBA;if(i===gm)return n.LUMINANCE;if(i===xm)return n.LUMINANCE_ALPHA;if(i===Fs)return n.DEPTH_COMPONENT;if(i===$s)return n.DEPTH_STENCIL;if(i===od)return n.RED;if(i===rd)return n.RED_INTEGER;if(i===vm)return n.RG;if(i===cd)return n.RG_INTEGER;if(i===ld)return n.RGBA_INTEGER;if(i===Hr||i===Gr||i===Xr||i===Vr)if(o===Ne)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Hr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Gr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Xr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Vr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Hr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Gr)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Xr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Vr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===lh||i===hh||i===dh||i===uh)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===lh)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===hh)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===dh)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===uh)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===fh||i===ph||i===mh)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===fh||i===ph)return o===Ne?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===mh)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===gh||i===xh||i===vh||i===yh||i===Mh||i===_h||i===bh||i===Sh||i===wh||i===Eh||i===Th||i===Ah||i===Rh||i===Ph)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===gh)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===xh)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===vh)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===yh)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Mh)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===_h)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===bh)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Sh)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===wh)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Eh)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Th)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ah)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Rh)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Ph)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Wr||i===Ch||i===Dh)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===Wr)return o===Ne?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ch)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Dh)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===ym||i===Lh||i===kh||i===Ih)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===Wr)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Lh)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===kh)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ih)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ys?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class tA extends fi{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class ge extends tn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const eA={type:"move"};class _l{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ge,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ge,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new W,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new W),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ge,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new W,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new W),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let a=null,s=null,o=null;const r=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const v of t.hand.values()){const g=e.getJointPose(v,i),p=this._getHandJoint(l,v);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,m=.005;l.inputState.pinching&&d>f+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=f-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));r!==null&&(a=e.getPose(t.targetRaySpace,i),a===null&&s!==null&&(a=s),a!==null&&(r.matrix.fromArray(a.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,a.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(a.linearVelocity)):r.hasLinearVelocity=!1,a.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(a.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(eA)))}return r!==null&&(r.visible=a!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new ge;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const nA=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,iA=`
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

}`;class aA{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const a=new zn,s=t.properties.get(a);s.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=a}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new Sa({vertexShader:nA,fragmentShader:iA,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ve(new Zn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class sA extends qs{constructor(t,e){super();const i=this;let a=null,s=1,o=null,r="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,m=null;const v=new aA,g=e.getContextAttributes();let p=null,_=null;const x=[],y=[],S=new Yt;let w=null;const E=new fi;E.viewport=new sn;const A=new fi;A.viewport=new sn;const b=[E,A],M=new tA;let P=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let N=x[Y];return N===void 0&&(N=new _l,x[Y]=N),N.getTargetRaySpace()},this.getControllerGrip=function(Y){let N=x[Y];return N===void 0&&(N=new _l,x[Y]=N),N.getGripSpace()},this.getHand=function(Y){let N=x[Y];return N===void 0&&(N=new _l,x[Y]=N),N.getHandSpace()};function D(Y){const N=y.indexOf(Y.inputSource);if(N===-1)return;const X=x[N];X!==void 0&&(X.update(Y.inputSource,Y.frame,l||o),X.dispatchEvent({type:Y.type,data:Y.inputSource}))}function z(){a.removeEventListener("select",D),a.removeEventListener("selectstart",D),a.removeEventListener("selectend",D),a.removeEventListener("squeeze",D),a.removeEventListener("squeezestart",D),a.removeEventListener("squeezeend",D),a.removeEventListener("end",z),a.removeEventListener("inputsourceschange",C);for(let Y=0;Y<x.length;Y++){const N=y[Y];N!==null&&(y[Y]=null,x[Y].disconnect(N))}P=null,k=null,v.reset(),t.setRenderTarget(p),f=null,d=null,u=null,a=null,_=null,dt.stop(),i.isPresenting=!1,t.setPixelRatio(w),t.setSize(S.width,S.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){s=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){r=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(Y){l=Y},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return m},this.getSession=function(){return a},this.setSession=async function(Y){if(a=Y,a!==null){if(p=t.getRenderTarget(),a.addEventListener("select",D),a.addEventListener("selectstart",D),a.addEventListener("selectend",D),a.addEventListener("squeeze",D),a.addEventListener("squeezestart",D),a.addEventListener("squeezeend",D),a.addEventListener("end",z),a.addEventListener("inputsourceschange",C),g.xrCompatible!==!0&&await e.makeXRCompatible(),w=t.getPixelRatio(),t.getSize(S),a.renderState.layers===void 0){const N={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(a,e,N),a.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),_=new qa(f.framebufferWidth,f.framebufferHeight,{format:Si,type:na,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let N=null,X=null,$=null;g.depth&&($=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,N=g.stencil?$s:Fs,X=g.stencil?Ys:ja);const q={colorFormat:e.RGBA8,depthFormat:$,scaleFactor:s};u=new XRWebGLBinding(a,e),d=u.createProjectionLayer(q),a.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),_=new qa(d.textureWidth,d.textureHeight,{format:Si,type:na,depthTexture:new km(d.textureWidth,d.textureHeight,X,void 0,void 0,void 0,void 0,void 0,void 0,N),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await a.requestReferenceSpace(r),dt.setContext(a),dt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function C(Y){for(let N=0;N<Y.removed.length;N++){const X=Y.removed[N],$=y.indexOf(X);$>=0&&(y[$]=null,x[$].disconnect(X))}for(let N=0;N<Y.added.length;N++){const X=Y.added[N];let $=y.indexOf(X);if($===-1){for(let ot=0;ot<x.length;ot++)if(ot>=y.length){y.push(X),$=ot;break}else if(y[ot]===null){y[ot]=X,$=ot;break}if($===-1)break}const q=x[$];q&&q.connect(X)}}const T=new W,U=new W;function G(Y,N,X){T.setFromMatrixPosition(N.matrixWorld),U.setFromMatrixPosition(X.matrixWorld);const $=T.distanceTo(U),q=N.projectionMatrix.elements,ot=X.projectionMatrix.elements,Et=q[14]/(q[10]-1),Ht=q[14]/(q[10]+1),tt=(q[9]+1)/q[5],V=(q[9]-1)/q[5],B=(q[8]-1)/q[0],kt=(ot[8]+1)/ot[0],Rt=Et*B,Mt=Et*kt,mt=$/(-B+kt),gt=mt*-B;if(N.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(gt),Y.translateZ(mt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),q[10]===-1)Y.projectionMatrix.copy(N.projectionMatrix),Y.projectionMatrixInverse.copy(N.projectionMatrixInverse);else{const Pt=Et+mt,L=Ht+mt,R=Rt-gt,Q=Mt+($-gt),ft=tt*Ht/L*Pt,at=V*Ht/L*Pt;Y.projectionMatrix.makePerspective(R,Q,ft,at,Pt,L),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function Z(Y,N){N===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(N.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(a===null)return;let N=Y.near,X=Y.far;v.texture!==null&&(v.depthNear>0&&(N=v.depthNear),v.depthFar>0&&(X=v.depthFar)),M.near=A.near=E.near=N,M.far=A.far=E.far=X,(P!==M.near||k!==M.far)&&(a.updateRenderState({depthNear:M.near,depthFar:M.far}),P=M.near,k=M.far),E.layers.mask=Y.layers.mask|2,A.layers.mask=Y.layers.mask|4,M.layers.mask=E.layers.mask|A.layers.mask;const $=Y.parent,q=M.cameras;Z(M,$);for(let ot=0;ot<q.length;ot++)Z(q[ot],$);q.length===2?G(M,E,A):M.projectionMatrix.copy(E.projectionMatrix),rt(Y,M,$)};function rt(Y,N,X){X===null?Y.matrix.copy(N.matrixWorld):(Y.matrix.copy(X.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(N.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(N.projectionMatrix),Y.projectionMatrixInverse.copy(N.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Ho*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(Y){c=Y,d!==null&&(d.fixedFoveation=Y),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Y)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(M)};let pt=null;function vt(Y,N){if(h=N.getViewerPose(l||o),m=N,h!==null){const X=h.views;f!==null&&(t.setRenderTargetFramebuffer(_,f.framebuffer),t.setRenderTarget(_));let $=!1;X.length!==M.cameras.length&&(M.cameras.length=0,$=!0);for(let ot=0;ot<X.length;ot++){const Et=X[ot];let Ht=null;if(f!==null)Ht=f.getViewport(Et);else{const V=u.getViewSubImage(d,Et);Ht=V.viewport,ot===0&&(t.setRenderTargetTextures(_,V.colorTexture,d.ignoreDepthValues?void 0:V.depthStencilTexture),t.setRenderTarget(_))}let tt=b[ot];tt===void 0&&(tt=new fi,tt.layers.enable(ot),tt.viewport=new sn,b[ot]=tt),tt.matrix.fromArray(Et.transform.matrix),tt.matrix.decompose(tt.position,tt.quaternion,tt.scale),tt.projectionMatrix.fromArray(Et.projectionMatrix),tt.projectionMatrixInverse.copy(tt.projectionMatrix).invert(),tt.viewport.set(Ht.x,Ht.y,Ht.width,Ht.height),ot===0&&(M.matrix.copy(tt.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),$===!0&&M.cameras.push(tt)}const q=a.enabledFeatures;if(q&&q.includes("depth-sensing")){const ot=u.getDepthInformation(X[0]);ot&&ot.isValid&&ot.texture&&v.init(t,ot,a.renderState)}}for(let X=0;X<x.length;X++){const $=y[X],q=x[X];$!==null&&q!==void 0&&q.update($,N,l||o)}pt&&pt(Y,N),N.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:N}),m=null}const dt=new Dm;dt.setAnimationLoop(vt),this.setAnimationLoop=function(Y){pt=Y},this.dispose=function(){}}}const za=new Ni,oA=new Ce;function rA(n,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,Rm(n)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function a(g,p,_,x,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(g,p):p.isMeshToonMaterial?(s(g,p),u(g,p)):p.isMeshPhongMaterial?(s(g,p),h(g,p)):p.isMeshStandardMaterial?(s(g,p),d(g,p),p.isMeshPhysicalMaterial&&f(g,p,y)):p.isMeshMatcapMaterial?(s(g,p),m(g,p)):p.isMeshDepthMaterial?s(g,p):p.isMeshDistanceMaterial?(s(g,p),v(g,p)):p.isMeshNormalMaterial?s(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&r(g,p)):p.isPointsMaterial?c(g,p,_,x):p.isSpriteMaterial?l(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===jn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===jn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const _=t.get(p),x=_.envMap,y=_.envMapRotation;x&&(g.envMap.value=x,za.copy(y),za.x*=-1,za.y*=-1,za.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(za.y*=-1,za.z*=-1),g.envMapRotation.value.setFromMatrix4(oA.makeRotationFromEuler(za)),g.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function r(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function c(g,p,_,x){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*_,g.scale.value=x*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function l(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,_){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===jn&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=_.texture,g.transmissionSamplerSize.value.set(_.width,_.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function v(g,p){const _=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(_.matrixWorld),g.nearDistance.value=_.shadow.camera.near,g.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:a}}function cA(n,t,e,i){let a={},s={},o=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(_,x){const y=x.program;i.uniformBlockBinding(_,y)}function l(_,x){let y=a[_.id];y===void 0&&(m(_),y=h(_),a[_.id]=y,_.addEventListener("dispose",g));const S=x.program;i.updateUBOMapping(_,S);const w=t.render.frame;s[_.id]!==w&&(d(_),s[_.id]=w)}function h(_){const x=u();_.__bindingPointIndex=x;const y=n.createBuffer(),S=_.__size,w=_.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,S,w),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,y),y}function u(){for(let _=0;_<r;_++)if(o.indexOf(_)===-1)return o.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(_){const x=a[_.id],y=_.uniforms,S=_.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let w=0,E=y.length;w<E;w++){const A=Array.isArray(y[w])?y[w]:[y[w]];for(let b=0,M=A.length;b<M;b++){const P=A[b];if(f(P,w,b,S)===!0){const k=P.__offset,D=Array.isArray(P.value)?P.value:[P.value];let z=0;for(let C=0;C<D.length;C++){const T=D[C],U=v(T);typeof T=="number"||typeof T=="boolean"?(P.__data[0]=T,n.bufferSubData(n.UNIFORM_BUFFER,k+z,P.__data)):T.isMatrix3?(P.__data[0]=T.elements[0],P.__data[1]=T.elements[1],P.__data[2]=T.elements[2],P.__data[3]=0,P.__data[4]=T.elements[3],P.__data[5]=T.elements[4],P.__data[6]=T.elements[5],P.__data[7]=0,P.__data[8]=T.elements[6],P.__data[9]=T.elements[7],P.__data[10]=T.elements[8],P.__data[11]=0):(T.toArray(P.__data,z),z+=U.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,k,P.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(_,x,y,S){const w=_.value,E=x+"_"+y;if(S[E]===void 0)return typeof w=="number"||typeof w=="boolean"?S[E]=w:S[E]=w.clone(),!0;{const A=S[E];if(typeof w=="number"||typeof w=="boolean"){if(A!==w)return S[E]=w,!0}else if(A.equals(w)===!1)return A.copy(w),!0}return!1}function m(_){const x=_.uniforms;let y=0;const S=16;for(let E=0,A=x.length;E<A;E++){const b=Array.isArray(x[E])?x[E]:[x[E]];for(let M=0,P=b.length;M<P;M++){const k=b[M],D=Array.isArray(k.value)?k.value:[k.value];for(let z=0,C=D.length;z<C;z++){const T=D[z],U=v(T),G=y%S,Z=G%U.boundary,rt=G+Z;y+=Z,rt!==0&&S-rt<U.storage&&(y+=S-rt),k.__data=new Float32Array(U.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=y,y+=U.storage}}}const w=y%S;return w>0&&(y+=S-w),_.__size=y,_.__cache={},this}function v(_){const x={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(x.boundary=4,x.storage=4):_.isVector2?(x.boundary=8,x.storage=8):_.isVector3||_.isColor?(x.boundary=16,x.storage=12):_.isVector4?(x.boundary=16,x.storage=16):_.isMatrix3?(x.boundary=48,x.storage=48):_.isMatrix4?(x.boundary=64,x.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),x}function g(_){const x=_.target;x.removeEventListener("dispose",g);const y=o.indexOf(x.__bindingPointIndex);o.splice(y,1),n.deleteBuffer(a[x.id]),delete a[x.id],delete s[x.id]}function p(){for(const _ in a)n.deleteBuffer(a[_]);o=[],a={},s={}}return{bind:c,update:l,dispose:p}}class lA{constructor(t={}){const{canvas:e=Kb(),context:i=null,depth:a=!0,stencil:s=!1,alpha:o=!1,antialias:r=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=o;const m=new Uint32Array(4),v=new Int32Array(4);let g=null,p=null;const _=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Hn,this.toneMapping=ya,this.toneMappingExposure=1;const y=this;let S=!1,w=0,E=0,A=null,b=-1,M=null;const P=new sn,k=new sn;let D=null;const z=new Qt(0);let C=0,T=e.width,U=e.height,G=1,Z=null,rt=null;const pt=new sn(0,0,T,U),vt=new sn(0,0,T,U);let dt=!1;const Y=new fd;let N=!1,X=!1;const $=new Ce,q=new Ce,ot=new W,Et=new sn,Ht={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let tt=!1;function V(){return A===null?G:1}let B=i;function kt(I,nt){return e.getContext(I,nt)}try{const I={alpha:!0,depth:a,stencil:s,antialias:r,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${ed}`),e.addEventListener("webglcontextlost",ut,!1),e.addEventListener("webglcontextrestored",Nt,!1),e.addEventListener("webglcontextcreationerror",Dt,!1),B===null){const nt="webgl2";if(B=kt(nt,I),B===null)throw kt(nt)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(I){throw console.error("THREE.WebGLRenderer: "+I.message),I}let Rt,Mt,mt,gt,Pt,L,R,Q,ft,at,ht,zt,Ct,wt,Xt,xt,It,J,K,st,Ot,Ft,Lt,F;function St(){Rt=new pE(B),Rt.init(),Ft=new QT(B,Rt),Mt=new cE(B,Rt,t,Ft),mt=new qT(B,Rt),Mt.reverseDepthBuffer&&d&&mt.buffers.depth.setReversed(!0),gt=new xE(B),Pt=new zT,L=new JT(B,Rt,mt,Pt,Mt,Ft,gt),R=new hE(y),Q=new fE(y),ft=new w1(B),Lt=new oE(B,ft),at=new mE(B,ft,gt,Lt),ht=new yE(B,at,ft,gt),K=new vE(B,Mt,L),xt=new lE(Pt),zt=new IT(y,R,Q,Rt,Mt,Lt,xt),Ct=new rA(y,Pt),wt=new UT,Xt=new XT(Rt),J=new sE(y,R,Q,mt,ht,f,c),It=new ZT(y,ht,Mt),F=new cA(B,gt,Mt,mt),st=new rE(B,Rt,gt),Ot=new gE(B,Rt,gt),gt.programs=zt.programs,y.capabilities=Mt,y.extensions=Rt,y.properties=Pt,y.renderLists=wt,y.shadowMap=It,y.state=mt,y.info=gt}St();const j=new sA(y,B);this.xr=j,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){const I=Rt.get("WEBGL_lose_context");I&&I.loseContext()},this.forceContextRestore=function(){const I=Rt.get("WEBGL_lose_context");I&&I.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(I){I!==void 0&&(G=I,this.setSize(T,U,!1))},this.getSize=function(I){return I.set(T,U)},this.setSize=function(I,nt,lt=!0){if(j.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}T=I,U=nt,e.width=Math.floor(I*G),e.height=Math.floor(nt*G),lt===!0&&(e.style.width=I+"px",e.style.height=nt+"px"),this.setViewport(0,0,I,nt)},this.getDrawingBufferSize=function(I){return I.set(T*G,U*G).floor()},this.setDrawingBufferSize=function(I,nt,lt){T=I,U=nt,G=lt,e.width=Math.floor(I*lt),e.height=Math.floor(nt*lt),this.setViewport(0,0,I,nt)},this.getCurrentViewport=function(I){return I.copy(P)},this.getViewport=function(I){return I.copy(pt)},this.setViewport=function(I,nt,lt,ct){I.isVector4?pt.set(I.x,I.y,I.z,I.w):pt.set(I,nt,lt,ct),mt.viewport(P.copy(pt).multiplyScalar(G).round())},this.getScissor=function(I){return I.copy(vt)},this.setScissor=function(I,nt,lt,ct){I.isVector4?vt.set(I.x,I.y,I.z,I.w):vt.set(I,nt,lt,ct),mt.scissor(k.copy(vt).multiplyScalar(G).round())},this.getScissorTest=function(){return dt},this.setScissorTest=function(I){mt.setScissorTest(dt=I)},this.setOpaqueSort=function(I){Z=I},this.setTransparentSort=function(I){rt=I},this.getClearColor=function(I){return I.copy(J.getClearColor())},this.setClearColor=function(){J.setClearColor.apply(J,arguments)},this.getClearAlpha=function(){return J.getClearAlpha()},this.setClearAlpha=function(){J.setClearAlpha.apply(J,arguments)},this.clear=function(I=!0,nt=!0,lt=!0){let ct=0;if(I){let et=!1;if(A!==null){const Ut=A.texture.format;et=Ut===ld||Ut===cd||Ut===rd}if(et){const Ut=A.texture.type,Vt=Ut===na||Ut===ja||Ut===Bo||Ut===Ys||Ut===ad||Ut===sd,Zt=J.getClearColor(),$t=J.getClearAlpha(),se=Zt.r,ne=Zt.g,jt=Zt.b;Vt?(m[0]=se,m[1]=ne,m[2]=jt,m[3]=$t,B.clearBufferuiv(B.COLOR,0,m)):(v[0]=se,v[1]=ne,v[2]=jt,v[3]=$t,B.clearBufferiv(B.COLOR,0,v))}else ct|=B.COLOR_BUFFER_BIT}nt&&(ct|=B.DEPTH_BUFFER_BIT),lt&&(ct|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B.clear(ct)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ut,!1),e.removeEventListener("webglcontextrestored",Nt,!1),e.removeEventListener("webglcontextcreationerror",Dt,!1),wt.dispose(),Xt.dispose(),Pt.dispose(),R.dispose(),Q.dispose(),ht.dispose(),Lt.dispose(),F.dispose(),zt.dispose(),j.dispose(),j.removeEventListener("sessionstart",Ve),j.removeEventListener("sessionend",Mn),Re.stop()};function ut(I){I.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),S=!0}function Nt(){console.log("THREE.WebGLRenderer: Context Restored."),S=!1;const I=gt.autoReset,nt=It.enabled,lt=It.autoUpdate,ct=It.needsUpdate,et=It.type;St(),gt.autoReset=I,It.enabled=nt,It.autoUpdate=lt,It.needsUpdate=ct,It.type=et}function Dt(I){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",I.statusMessage)}function qt(I){const nt=I.target;nt.removeEventListener("dispose",qt),le(nt)}function le(I){he(I),Pt.remove(I)}function he(I){const nt=Pt.get(I).programs;nt!==void 0&&(nt.forEach(function(lt){zt.releaseProgram(lt)}),I.isShaderMaterial&&zt.releaseShaderCache(I))}this.renderBufferDirect=function(I,nt,lt,ct,et,Ut){nt===null&&(nt=Ht);const Vt=et.isMesh&&et.matrixWorld.determinant()<0,Zt=wi(I,nt,lt,ct,et);mt.setMaterial(ct,Vt);let $t=lt.index,se=1;if(ct.wireframe===!0){if($t=at.getWireframeAttribute(lt),$t===void 0)return;se=2}const ne=lt.drawRange,jt=lt.attributes.position;let ue=ne.start*se,ie=(ne.start+ne.count)*se;Ut!==null&&(ue=Math.max(ue,Ut.start*se),ie=Math.min(ie,(Ut.start+Ut.count)*se)),$t!==null?(ue=Math.max(ue,0),ie=Math.min(ie,$t.count)):jt!=null&&(ue=Math.max(ue,0),ie=Math.min(ie,jt.count));const H=ie-ue;if(H<0||H===1/0)return;Lt.setup(et,ct,Zt,lt,$t);let At,bt=st;if($t!==null&&(At=ft.get($t),bt=Ot,bt.setIndex(At)),et.isMesh)ct.wireframe===!0?(mt.setLineWidth(ct.wireframeLinewidth*V()),bt.setMode(B.LINES)):bt.setMode(B.TRIANGLES);else if(et.isLine){let _t=ct.linewidth;_t===void 0&&(_t=1),mt.setLineWidth(_t*V()),et.isLineSegments?bt.setMode(B.LINES):et.isLineLoop?bt.setMode(B.LINE_LOOP):bt.setMode(B.LINE_STRIP)}else et.isPoints?bt.setMode(B.POINTS):et.isSprite&&bt.setMode(B.TRIANGLES);if(et.isBatchedMesh)if(et._multiDrawInstances!==null)bt.renderMultiDrawInstances(et._multiDrawStarts,et._multiDrawCounts,et._multiDrawCount,et._multiDrawInstances);else if(Rt.get("WEBGL_multi_draw"))bt.renderMultiDraw(et._multiDrawStarts,et._multiDrawCounts,et._multiDrawCount);else{const _t=et._multiDrawStarts,te=et._multiDrawCounts,Bt=et._multiDrawCount,oe=$t?ft.get($t).bytesPerElement:1,ke=Pt.get(ct).currentProgram.getUniforms();for(let be=0;be<Bt;be++)ke.setValue(B,"_gl_DrawID",be),bt.render(_t[be]/oe,te[be])}else if(et.isInstancedMesh)bt.renderInstances(ue,H,et.count);else if(lt.isInstancedBufferGeometry){const _t=lt._maxInstanceCount!==void 0?lt._maxInstanceCount:1/0,te=Math.min(lt.instanceCount,_t);bt.renderInstances(ue,H,te)}else bt.render(ue,H)};function ee(I,nt,lt){I.transparent===!0&&I.side===je&&I.forceSinglePass===!1?(I.side=jn,I.needsUpdate=!0,Tn(I,nt,lt),I.side=ba,I.needsUpdate=!0,Tn(I,nt,lt),I.side=je):Tn(I,nt,lt)}this.compile=function(I,nt,lt=null){lt===null&&(lt=I),p=Xt.get(lt),p.init(nt),x.push(p),lt.traverseVisible(function(et){et.isLight&&et.layers.test(nt.layers)&&(p.pushLight(et),et.castShadow&&p.pushShadow(et))}),I!==lt&&I.traverseVisible(function(et){et.isLight&&et.layers.test(nt.layers)&&(p.pushLight(et),et.castShadow&&p.pushShadow(et))}),p.setupLights();const ct=new Set;return I.traverse(function(et){if(!(et.isMesh||et.isPoints||et.isLine||et.isSprite))return;const Ut=et.material;if(Ut)if(Array.isArray(Ut))for(let Vt=0;Vt<Ut.length;Vt++){const Zt=Ut[Vt];ee(Zt,lt,et),ct.add(Zt)}else ee(Ut,lt,et),ct.add(Ut)}),x.pop(),p=null,ct},this.compileAsync=function(I,nt,lt=null){const ct=this.compile(I,nt,lt);return new Promise(et=>{function Ut(){if(ct.forEach(function(Vt){Pt.get(Vt).currentProgram.isReady()&&ct.delete(Vt)}),ct.size===0){et(I);return}setTimeout(Ut,10)}Rt.get("KHR_parallel_shader_compile")!==null?Ut():setTimeout(Ut,10)})};let we=null;function De(I){we&&we(I)}function Ve(){Re.stop()}function Mn(){Re.start()}const Re=new Dm;Re.setAnimationLoop(De),typeof self<"u"&&Re.setContext(self),this.setAnimationLoop=function(I){we=I,j.setAnimationLoop(I),I===null?Re.stop():Re.start()},j.addEventListener("sessionstart",Ve),j.addEventListener("sessionend",Mn),this.render=function(I,nt){if(nt!==void 0&&nt.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(S===!0)return;if(I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),nt.parent===null&&nt.matrixWorldAutoUpdate===!0&&nt.updateMatrixWorld(),j.enabled===!0&&j.isPresenting===!0&&(j.cameraAutoUpdate===!0&&j.updateCamera(nt),nt=j.getCamera()),I.isScene===!0&&I.onBeforeRender(y,I,nt,A),p=Xt.get(I,x.length),p.init(nt),x.push(p),q.multiplyMatrices(nt.projectionMatrix,nt.matrixWorldInverse),Y.setFromProjectionMatrix(q),X=this.localClippingEnabled,N=xt.init(this.clippingPlanes,X),g=wt.get(I,_.length),g.init(),_.push(g),j.enabled===!0&&j.isPresenting===!0){const Ut=y.xr.getDepthSensingMesh();Ut!==null&&Pe(Ut,nt,-1/0,y.sortObjects)}Pe(I,nt,0,y.sortObjects),g.finish(),y.sortObjects===!0&&g.sort(Z,rt),tt=j.enabled===!1||j.isPresenting===!1||j.hasDepthSensing()===!1,tt&&J.addToRenderList(g,I),this.info.render.frame++,N===!0&&xt.beginShadows();const lt=p.state.shadowsArray;It.render(lt,I,nt),N===!0&&xt.endShadows(),this.info.autoReset===!0&&this.info.reset();const ct=g.opaque,et=g.transmissive;if(p.setupLights(),nt.isArrayCamera){const Ut=nt.cameras;if(et.length>0)for(let Vt=0,Zt=Ut.length;Vt<Zt;Vt++){const $t=Ut[Vt];Rn(ct,et,I,$t)}tt&&J.render(I);for(let Vt=0,Zt=Ut.length;Vt<Zt;Vt++){const $t=Ut[Vt];fn(g,I,$t,$t.viewport)}}else et.length>0&&Rn(ct,et,I,nt),tt&&J.render(I),fn(g,I,nt);A!==null&&(L.updateMultisampleRenderTarget(A),L.updateRenderTargetMipmap(A)),I.isScene===!0&&I.onAfterRender(y,I,nt),Lt.resetDefaultState(),b=-1,M=null,x.pop(),x.length>0?(p=x[x.length-1],N===!0&&xt.setGlobalState(y.clippingPlanes,p.state.camera)):p=null,_.pop(),_.length>0?g=_[_.length-1]:g=null};function Pe(I,nt,lt,ct){if(I.visible===!1)return;if(I.layers.test(nt.layers)){if(I.isGroup)lt=I.renderOrder;else if(I.isLOD)I.autoUpdate===!0&&I.update(nt);else if(I.isLight)p.pushLight(I),I.castShadow&&p.pushShadow(I);else if(I.isSprite){if(!I.frustumCulled||Y.intersectsSprite(I)){ct&&Et.setFromMatrixPosition(I.matrixWorld).applyMatrix4(q);const Vt=ht.update(I),Zt=I.material;Zt.visible&&g.push(I,Vt,Zt,lt,Et.z,null)}}else if((I.isMesh||I.isLine||I.isPoints)&&(!I.frustumCulled||Y.intersectsObject(I))){const Vt=ht.update(I),Zt=I.material;if(ct&&(I.boundingSphere!==void 0?(I.boundingSphere===null&&I.computeBoundingSphere(),Et.copy(I.boundingSphere.center)):(Vt.boundingSphere===null&&Vt.computeBoundingSphere(),Et.copy(Vt.boundingSphere.center)),Et.applyMatrix4(I.matrixWorld).applyMatrix4(q)),Array.isArray(Zt)){const $t=Vt.groups;for(let se=0,ne=$t.length;se<ne;se++){const jt=$t[se],ue=Zt[jt.materialIndex];ue&&ue.visible&&g.push(I,Vt,ue,lt,Et.z,jt)}}else Zt.visible&&g.push(I,Vt,Zt,lt,Et.z,null)}}const Ut=I.children;for(let Vt=0,Zt=Ut.length;Vt<Zt;Vt++)Pe(Ut[Vt],nt,lt,ct)}function fn(I,nt,lt,ct){const et=I.opaque,Ut=I.transmissive,Vt=I.transparent;p.setupLightsView(lt),N===!0&&xt.setGlobalState(y.clippingPlanes,lt),ct&&mt.viewport(P.copy(ct)),et.length>0&&nn(et,nt,lt),Ut.length>0&&nn(Ut,nt,lt),Vt.length>0&&nn(Vt,nt,lt),mt.buffers.depth.setTest(!0),mt.buffers.depth.setMask(!0),mt.buffers.color.setMask(!0),mt.setPolygonOffset(!1)}function Rn(I,nt,lt,ct){if((lt.isScene===!0?lt.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[ct.id]===void 0&&(p.state.transmissionRenderTarget[ct.id]=new qa(1,1,{generateMipmaps:!0,type:Rt.has("EXT_color_buffer_half_float")||Rt.has("EXT_color_buffer_float")?$o:na,minFilter:Ya,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Te.workingColorSpace}));const Ut=p.state.transmissionRenderTarget[ct.id],Vt=ct.viewport||P;Ut.setSize(Vt.z,Vt.w);const Zt=y.getRenderTarget();y.setRenderTarget(Ut),y.getClearColor(z),C=y.getClearAlpha(),C<1&&y.setClearColor(16777215,.5),y.clear(),tt&&J.render(lt);const $t=y.toneMapping;y.toneMapping=ya;const se=ct.viewport;if(ct.viewport!==void 0&&(ct.viewport=void 0),p.setupLightsView(ct),N===!0&&xt.setGlobalState(y.clippingPlanes,ct),nn(I,lt,ct),L.updateMultisampleRenderTarget(Ut),L.updateRenderTargetMipmap(Ut),Rt.has("WEBGL_multisampled_render_to_texture")===!1){let ne=!1;for(let jt=0,ue=nt.length;jt<ue;jt++){const ie=nt[jt],H=ie.object,At=ie.geometry,bt=ie.material,_t=ie.group;if(bt.side===je&&H.layers.test(ct.layers)){const te=bt.side;bt.side=jn,bt.needsUpdate=!0,En(H,lt,ct,At,bt,_t),bt.side=te,bt.needsUpdate=!0,ne=!0}}ne===!0&&(L.updateMultisampleRenderTarget(Ut),L.updateRenderTargetMipmap(Ut))}y.setRenderTarget(Zt),y.setClearColor(z,C),se!==void 0&&(ct.viewport=se),y.toneMapping=$t}function nn(I,nt,lt){const ct=nt.isScene===!0?nt.overrideMaterial:null;for(let et=0,Ut=I.length;et<Ut;et++){const Vt=I[et],Zt=Vt.object,$t=Vt.geometry,se=ct===null?Vt.material:ct,ne=Vt.group;Zt.layers.test(lt.layers)&&En(Zt,nt,lt,$t,se,ne)}}function En(I,nt,lt,ct,et,Ut){I.onBeforeRender(y,nt,lt,ct,et,Ut),I.modelViewMatrix.multiplyMatrices(lt.matrixWorldInverse,I.matrixWorld),I.normalMatrix.getNormalMatrix(I.modelViewMatrix),et.onBeforeRender(y,nt,lt,ct,I,Ut),et.transparent===!0&&et.side===je&&et.forceSinglePass===!1?(et.side=jn,et.needsUpdate=!0,y.renderBufferDirect(lt,nt,ct,et,I,Ut),et.side=ba,et.needsUpdate=!0,y.renderBufferDirect(lt,nt,ct,et,I,Ut),et.side=je):y.renderBufferDirect(lt,nt,ct,et,I,Ut),I.onAfterRender(y,nt,lt,ct,et,Ut)}function Tn(I,nt,lt){nt.isScene!==!0&&(nt=Ht);const ct=Pt.get(I),et=p.state.lights,Ut=p.state.shadowsArray,Vt=et.state.version,Zt=zt.getParameters(I,et.state,Ut,nt,lt),$t=zt.getProgramCacheKey(Zt);let se=ct.programs;ct.environment=I.isMeshStandardMaterial?nt.environment:null,ct.fog=nt.fog,ct.envMap=(I.isMeshStandardMaterial?Q:R).get(I.envMap||ct.environment),ct.envMapRotation=ct.environment!==null&&I.envMap===null?nt.environmentRotation:I.envMapRotation,se===void 0&&(I.addEventListener("dispose",qt),se=new Map,ct.programs=se);let ne=se.get($t);if(ne!==void 0){if(ct.currentProgram===ne&&ct.lightsStateVersion===Vt)return Vn(I,Zt),ne}else Zt.uniforms=zt.getUniforms(I),I.onBeforeCompile(Zt,y),ne=zt.acquireProgram(Zt,$t),se.set($t,ne),ct.uniforms=Zt.uniforms;const jt=ct.uniforms;return(!I.isShaderMaterial&&!I.isRawShaderMaterial||I.clipping===!0)&&(jt.clippingPlanes=xt.uniform),Vn(I,Zt),ct.needsLights=pn(I),ct.lightsStateVersion=Vt,ct.needsLights&&(jt.ambientLightColor.value=et.state.ambient,jt.lightProbe.value=et.state.probe,jt.directionalLights.value=et.state.directional,jt.directionalLightShadows.value=et.state.directionalShadow,jt.spotLights.value=et.state.spot,jt.spotLightShadows.value=et.state.spotShadow,jt.rectAreaLights.value=et.state.rectArea,jt.ltc_1.value=et.state.rectAreaLTC1,jt.ltc_2.value=et.state.rectAreaLTC2,jt.pointLights.value=et.state.point,jt.pointLightShadows.value=et.state.pointShadow,jt.hemisphereLights.value=et.state.hemi,jt.directionalShadowMap.value=et.state.directionalShadowMap,jt.directionalShadowMatrix.value=et.state.directionalShadowMatrix,jt.spotShadowMap.value=et.state.spotShadowMap,jt.spotLightMatrix.value=et.state.spotLightMatrix,jt.spotLightMap.value=et.state.spotLightMap,jt.pointShadowMap.value=et.state.pointShadowMap,jt.pointShadowMatrix.value=et.state.pointShadowMatrix),ct.currentProgram=ne,ct.uniformsList=null,ne}function Xn(I){if(I.uniformsList===null){const nt=I.currentProgram.getUniforms();I.uniformsList=Yr.seqWithValue(nt.seq,I.uniforms)}return I.uniformsList}function Vn(I,nt){const lt=Pt.get(I);lt.outputColorSpace=nt.outputColorSpace,lt.batching=nt.batching,lt.batchingColor=nt.batchingColor,lt.instancing=nt.instancing,lt.instancingColor=nt.instancingColor,lt.instancingMorph=nt.instancingMorph,lt.skinning=nt.skinning,lt.morphTargets=nt.morphTargets,lt.morphNormals=nt.morphNormals,lt.morphColors=nt.morphColors,lt.morphTargetsCount=nt.morphTargetsCount,lt.numClippingPlanes=nt.numClippingPlanes,lt.numIntersection=nt.numClipIntersection,lt.vertexAlphas=nt.vertexAlphas,lt.vertexTangents=nt.vertexTangents,lt.toneMapping=nt.toneMapping}function wi(I,nt,lt,ct,et){nt.isScene!==!0&&(nt=Ht),L.resetTextureUnits();const Ut=nt.fog,Vt=ct.isMeshStandardMaterial?nt.environment:null,Zt=A===null?y.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:js,$t=(ct.isMeshStandardMaterial?Q:R).get(ct.envMap||Vt),se=ct.vertexColors===!0&&!!lt.attributes.color&&lt.attributes.color.itemSize===4,ne=!!lt.attributes.tangent&&(!!ct.normalMap||ct.anisotropy>0),jt=!!lt.morphAttributes.position,ue=!!lt.morphAttributes.normal,ie=!!lt.morphAttributes.color;let H=ya;ct.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(H=y.toneMapping);const At=lt.morphAttributes.position||lt.morphAttributes.normal||lt.morphAttributes.color,bt=At!==void 0?At.length:0,_t=Pt.get(ct),te=p.state.lights;if(N===!0&&(X===!0||I!==M)){const He=I===M&&ct.id===b;xt.setState(ct,I,He)}let Bt=!1;ct.version===_t.__version?(_t.needsLights&&_t.lightsStateVersion!==te.state.version||_t.outputColorSpace!==Zt||et.isBatchedMesh&&_t.batching===!1||!et.isBatchedMesh&&_t.batching===!0||et.isBatchedMesh&&_t.batchingColor===!0&&et.colorTexture===null||et.isBatchedMesh&&_t.batchingColor===!1&&et.colorTexture!==null||et.isInstancedMesh&&_t.instancing===!1||!et.isInstancedMesh&&_t.instancing===!0||et.isSkinnedMesh&&_t.skinning===!1||!et.isSkinnedMesh&&_t.skinning===!0||et.isInstancedMesh&&_t.instancingColor===!0&&et.instanceColor===null||et.isInstancedMesh&&_t.instancingColor===!1&&et.instanceColor!==null||et.isInstancedMesh&&_t.instancingMorph===!0&&et.morphTexture===null||et.isInstancedMesh&&_t.instancingMorph===!1&&et.morphTexture!==null||_t.envMap!==$t||ct.fog===!0&&_t.fog!==Ut||_t.numClippingPlanes!==void 0&&(_t.numClippingPlanes!==xt.numPlanes||_t.numIntersection!==xt.numIntersection)||_t.vertexAlphas!==se||_t.vertexTangents!==ne||_t.morphTargets!==jt||_t.morphNormals!==ue||_t.morphColors!==ie||_t.toneMapping!==H||_t.morphTargetsCount!==bt)&&(Bt=!0):(Bt=!0,_t.__version=ct.version);let oe=_t.currentProgram;Bt===!0&&(oe=Tn(ct,nt,et));let ke=!1,be=!1,Oe=!1;const xe=oe.getUniforms(),fe=_t.uniforms;if(mt.useProgram(oe.program)&&(ke=!0,be=!0,Oe=!0),ct.id!==b&&(b=ct.id,be=!0),ke||M!==I){mt.buffers.depth.getReversed()?($.copy(I.projectionMatrix),Qb($),t1($),xe.setValue(B,"projectionMatrix",$)):xe.setValue(B,"projectionMatrix",I.projectionMatrix),xe.setValue(B,"viewMatrix",I.matrixWorldInverse);const hn=xe.map.cameraPosition;hn!==void 0&&hn.setValue(B,ot.setFromMatrixPosition(I.matrixWorld)),Mt.logarithmicDepthBuffer&&xe.setValue(B,"logDepthBufFC",2/(Math.log(I.far+1)/Math.LN2)),(ct.isMeshPhongMaterial||ct.isMeshToonMaterial||ct.isMeshLambertMaterial||ct.isMeshBasicMaterial||ct.isMeshStandardMaterial||ct.isShaderMaterial)&&xe.setValue(B,"isOrthographic",I.isOrthographicCamera===!0),M!==I&&(M=I,be=!0,Oe=!0)}if(et.isSkinnedMesh){xe.setOptional(B,et,"bindMatrix"),xe.setOptional(B,et,"bindMatrixInverse");const He=et.skeleton;He&&(He.boneTexture===null&&He.computeBoneTexture(),xe.setValue(B,"boneTexture",He.boneTexture,L))}et.isBatchedMesh&&(xe.setOptional(B,et,"batchingTexture"),xe.setValue(B,"batchingTexture",et._matricesTexture,L),xe.setOptional(B,et,"batchingIdTexture"),xe.setValue(B,"batchingIdTexture",et._indirectTexture,L),xe.setOptional(B,et,"batchingColorTexture"),et._colorsTexture!==null&&xe.setValue(B,"batchingColorTexture",et._colorsTexture,L));const Ae=lt.morphAttributes;if((Ae.position!==void 0||Ae.normal!==void 0||Ae.color!==void 0)&&K.update(et,lt,oe),(be||_t.receiveShadow!==et.receiveShadow)&&(_t.receiveShadow=et.receiveShadow,xe.setValue(B,"receiveShadow",et.receiveShadow)),ct.isMeshGouraudMaterial&&ct.envMap!==null&&(fe.envMap.value=$t,fe.flipEnvMap.value=$t.isCubeTexture&&$t.isRenderTargetTexture===!1?-1:1),ct.isMeshStandardMaterial&&ct.envMap===null&&nt.environment!==null&&(fe.envMapIntensity.value=nt.environmentIntensity),be&&(xe.setValue(B,"toneMappingExposure",y.toneMappingExposure),_t.needsLights&&Ei(fe,Oe),Ut&&ct.fog===!0&&Ct.refreshFogUniforms(fe,Ut),Ct.refreshMaterialUniforms(fe,ct,G,U,p.state.transmissionRenderTarget[I.id]),Yr.upload(B,Xn(_t),fe,L)),ct.isShaderMaterial&&ct.uniformsNeedUpdate===!0&&(Yr.upload(B,Xn(_t),fe,L),ct.uniformsNeedUpdate=!1),ct.isSpriteMaterial&&xe.setValue(B,"center",et.center),xe.setValue(B,"modelViewMatrix",et.modelViewMatrix),xe.setValue(B,"normalMatrix",et.normalMatrix),xe.setValue(B,"modelMatrix",et.matrixWorld),ct.isShaderMaterial||ct.isRawShaderMaterial){const He=ct.uniformsGroups;for(let hn=0,Pn=He.length;hn<Pn;hn++){const pi=He[hn];F.update(pi,oe),F.bind(pi,oe)}}return oe}function Ei(I,nt){I.ambientLightColor.needsUpdate=nt,I.lightProbe.needsUpdate=nt,I.directionalLights.needsUpdate=nt,I.directionalLightShadows.needsUpdate=nt,I.pointLights.needsUpdate=nt,I.pointLightShadows.needsUpdate=nt,I.spotLights.needsUpdate=nt,I.spotLightShadows.needsUpdate=nt,I.rectAreaLights.needsUpdate=nt,I.hemisphereLights.needsUpdate=nt}function pn(I){return I.isMeshLambertMaterial||I.isMeshToonMaterial||I.isMeshPhongMaterial||I.isMeshStandardMaterial||I.isShadowMaterial||I.isShaderMaterial&&I.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(I,nt,lt){Pt.get(I.texture).__webglTexture=nt,Pt.get(I.depthTexture).__webglTexture=lt;const ct=Pt.get(I);ct.__hasExternalTextures=!0,ct.__autoAllocateDepthBuffer=lt===void 0,ct.__autoAllocateDepthBuffer||Rt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),ct.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(I,nt){const lt=Pt.get(I);lt.__webglFramebuffer=nt,lt.__useDefaultFramebuffer=nt===void 0},this.setRenderTarget=function(I,nt=0,lt=0){A=I,w=nt,E=lt;let ct=!0,et=null,Ut=!1,Vt=!1;if(I){const $t=Pt.get(I);if($t.__useDefaultFramebuffer!==void 0)mt.bindFramebuffer(B.FRAMEBUFFER,null),ct=!1;else if($t.__webglFramebuffer===void 0)L.setupRenderTarget(I);else if($t.__hasExternalTextures)L.rebindTextures(I,Pt.get(I.texture).__webglTexture,Pt.get(I.depthTexture).__webglTexture);else if(I.depthBuffer){const jt=I.depthTexture;if($t.__boundDepthTexture!==jt){if(jt!==null&&Pt.has(jt)&&(I.width!==jt.image.width||I.height!==jt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");L.setupDepthRenderbuffer(I)}}const se=I.texture;(se.isData3DTexture||se.isDataArrayTexture||se.isCompressedArrayTexture)&&(Vt=!0);const ne=Pt.get(I).__webglFramebuffer;I.isWebGLCubeRenderTarget?(Array.isArray(ne[nt])?et=ne[nt][lt]:et=ne[nt],Ut=!0):I.samples>0&&L.useMultisampledRTT(I)===!1?et=Pt.get(I).__webglMultisampledFramebuffer:Array.isArray(ne)?et=ne[lt]:et=ne,P.copy(I.viewport),k.copy(I.scissor),D=I.scissorTest}else P.copy(pt).multiplyScalar(G).floor(),k.copy(vt).multiplyScalar(G).floor(),D=dt;if(mt.bindFramebuffer(B.FRAMEBUFFER,et)&&ct&&mt.drawBuffers(I,et),mt.viewport(P),mt.scissor(k),mt.setScissorTest(D),Ut){const $t=Pt.get(I.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+nt,$t.__webglTexture,lt)}else if(Vt){const $t=Pt.get(I.texture),se=nt||0;B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,$t.__webglTexture,lt||0,se)}b=-1},this.readRenderTargetPixels=function(I,nt,lt,ct,et,Ut,Vt){if(!(I&&I.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Zt=Pt.get(I).__webglFramebuffer;if(I.isWebGLCubeRenderTarget&&Vt!==void 0&&(Zt=Zt[Vt]),Zt){mt.bindFramebuffer(B.FRAMEBUFFER,Zt);try{const $t=I.texture,se=$t.format,ne=$t.type;if(!Mt.textureFormatReadable(se)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Mt.textureTypeReadable(ne)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}nt>=0&&nt<=I.width-ct&&lt>=0&&lt<=I.height-et&&B.readPixels(nt,lt,ct,et,Ft.convert(se),Ft.convert(ne),Ut)}finally{const $t=A!==null?Pt.get(A).__webglFramebuffer:null;mt.bindFramebuffer(B.FRAMEBUFFER,$t)}}},this.readRenderTargetPixelsAsync=async function(I,nt,lt,ct,et,Ut,Vt){if(!(I&&I.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Zt=Pt.get(I).__webglFramebuffer;if(I.isWebGLCubeRenderTarget&&Vt!==void 0&&(Zt=Zt[Vt]),Zt){const $t=I.texture,se=$t.format,ne=$t.type;if(!Mt.textureFormatReadable(se))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Mt.textureTypeReadable(ne))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(nt>=0&&nt<=I.width-ct&&lt>=0&&lt<=I.height-et){mt.bindFramebuffer(B.FRAMEBUFFER,Zt);const jt=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,jt),B.bufferData(B.PIXEL_PACK_BUFFER,Ut.byteLength,B.STREAM_READ),B.readPixels(nt,lt,ct,et,Ft.convert(se),Ft.convert(ne),0);const ue=A!==null?Pt.get(A).__webglFramebuffer:null;mt.bindFramebuffer(B.FRAMEBUFFER,ue);const ie=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await Jb(B,ie,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,jt),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,Ut),B.deleteBuffer(jt),B.deleteSync(ie),Ut}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(I,nt=null,lt=0){I.isTexture!==!0&&(bo("WebGLRenderer: copyFramebufferToTexture function signature has changed."),nt=arguments[0]||null,I=arguments[1]);const ct=Math.pow(2,-lt),et=Math.floor(I.image.width*ct),Ut=Math.floor(I.image.height*ct),Vt=nt!==null?nt.x:0,Zt=nt!==null?nt.y:0;L.setTexture2D(I,0),B.copyTexSubImage2D(B.TEXTURE_2D,lt,0,0,Vt,Zt,et,Ut),mt.unbindTexture()},this.copyTextureToTexture=function(I,nt,lt=null,ct=null,et=0){I.isTexture!==!0&&(bo("WebGLRenderer: copyTextureToTexture function signature has changed."),ct=arguments[0]||null,I=arguments[1],nt=arguments[2],et=arguments[3]||0,lt=null);let Ut,Vt,Zt,$t,se,ne,jt,ue,ie;const H=I.isCompressedTexture?I.mipmaps[et]:I.image;lt!==null?(Ut=lt.max.x-lt.min.x,Vt=lt.max.y-lt.min.y,Zt=lt.isBox3?lt.max.z-lt.min.z:1,$t=lt.min.x,se=lt.min.y,ne=lt.isBox3?lt.min.z:0):(Ut=H.width,Vt=H.height,Zt=H.depth||1,$t=0,se=0,ne=0),ct!==null?(jt=ct.x,ue=ct.y,ie=ct.z):(jt=0,ue=0,ie=0);const At=Ft.convert(nt.format),bt=Ft.convert(nt.type);let _t;nt.isData3DTexture?(L.setTexture3D(nt,0),_t=B.TEXTURE_3D):nt.isDataArrayTexture||nt.isCompressedArrayTexture?(L.setTexture2DArray(nt,0),_t=B.TEXTURE_2D_ARRAY):(L.setTexture2D(nt,0),_t=B.TEXTURE_2D),B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,nt.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,nt.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,nt.unpackAlignment);const te=B.getParameter(B.UNPACK_ROW_LENGTH),Bt=B.getParameter(B.UNPACK_IMAGE_HEIGHT),oe=B.getParameter(B.UNPACK_SKIP_PIXELS),ke=B.getParameter(B.UNPACK_SKIP_ROWS),be=B.getParameter(B.UNPACK_SKIP_IMAGES);B.pixelStorei(B.UNPACK_ROW_LENGTH,H.width),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,H.height),B.pixelStorei(B.UNPACK_SKIP_PIXELS,$t),B.pixelStorei(B.UNPACK_SKIP_ROWS,se),B.pixelStorei(B.UNPACK_SKIP_IMAGES,ne);const Oe=I.isDataArrayTexture||I.isData3DTexture,xe=nt.isDataArrayTexture||nt.isData3DTexture;if(I.isRenderTargetTexture||I.isDepthTexture){const fe=Pt.get(I),Ae=Pt.get(nt),He=Pt.get(fe.__renderTarget),hn=Pt.get(Ae.__renderTarget);mt.bindFramebuffer(B.READ_FRAMEBUFFER,He.__webglFramebuffer),mt.bindFramebuffer(B.DRAW_FRAMEBUFFER,hn.__webglFramebuffer);for(let Pn=0;Pn<Zt;Pn++)Oe&&B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Pt.get(I).__webglTexture,et,ne+Pn),I.isDepthTexture?(xe&&B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Pt.get(nt).__webglTexture,et,ie+Pn),B.blitFramebuffer($t,se,Ut,Vt,jt,ue,Ut,Vt,B.DEPTH_BUFFER_BIT,B.NEAREST)):xe?B.copyTexSubImage3D(_t,et,jt,ue,ie+Pn,$t,se,Ut,Vt):B.copyTexSubImage2D(_t,et,jt,ue,ie+Pn,$t,se,Ut,Vt);mt.bindFramebuffer(B.READ_FRAMEBUFFER,null),mt.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else xe?I.isDataTexture||I.isData3DTexture?B.texSubImage3D(_t,et,jt,ue,ie,Ut,Vt,Zt,At,bt,H.data):nt.isCompressedArrayTexture?B.compressedTexSubImage3D(_t,et,jt,ue,ie,Ut,Vt,Zt,At,H.data):B.texSubImage3D(_t,et,jt,ue,ie,Ut,Vt,Zt,At,bt,H):I.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,et,jt,ue,Ut,Vt,At,bt,H.data):I.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,et,jt,ue,H.width,H.height,At,H.data):B.texSubImage2D(B.TEXTURE_2D,et,jt,ue,Ut,Vt,At,bt,H);B.pixelStorei(B.UNPACK_ROW_LENGTH,te),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,Bt),B.pixelStorei(B.UNPACK_SKIP_PIXELS,oe),B.pixelStorei(B.UNPACK_SKIP_ROWS,ke),B.pixelStorei(B.UNPACK_SKIP_IMAGES,be),et===0&&nt.generateMipmaps&&B.generateMipmap(_t),mt.unbindTexture()},this.copyTextureToTexture3D=function(I,nt,lt=null,ct=null,et=0){return I.isTexture!==!0&&(bo("WebGLRenderer: copyTextureToTexture3D function signature has changed."),lt=arguments[0]||null,ct=arguments[1]||null,I=arguments[2],nt=arguments[3],et=arguments[4]||0),bo('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(I,nt,lt,ct,et)},this.initRenderTarget=function(I){Pt.get(I).__webglFramebuffer===void 0&&L.setupRenderTarget(I)},this.initTexture=function(I){I.isCubeTexture?L.setTextureCube(I,0):I.isData3DTexture?L.setTexture3D(I,0):I.isDataArrayTexture||I.isCompressedArrayTexture?L.setTexture2DArray(I,0):L.setTexture2D(I,0),mt.unbindTexture()},this.resetState=function(){w=0,E=0,A=null,mt.reset(),Lt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ta}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Te._getDrawingBufferColorSpace(t),e.unpackColorSpace=Te._getUnpackColorSpace()}}class hA extends tn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ni,this.environmentIntensity=1,this.environmentRotation=new Ni,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class dA{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=zh,this.updateRanges=[],this.version=0,this.uuid=Ui()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let a=0,s=this.stride;a<s;a++)this.array[t+a]=e.array[i+a];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ui()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ui()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Un=new W;class cc{constructor(t,e,i,a=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=a}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)Un.fromBufferAttribute(this,e),Un.applyMatrix4(t),this.setXYZ(e,Un.x,Un.y,Un.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Un.fromBufferAttribute(this,e),Un.applyNormalMatrix(t),this.setXYZ(e,Un.x,Un.y,Un.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Un.fromBufferAttribute(this,e),Un.transformDirection(t),this.setXYZ(e,Un.x,Un.y,Un.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=bi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=ze(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=ze(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ze(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ze(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ze(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=bi(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=bi(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=bi(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=bi(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=ze(e,this.array),i=ze(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=ze(e,this.array),i=ze(i,this.array),a=ze(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ze(e,this.array),i=ze(i,this.array),a=ze(a,this.array),s=ze(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this.data.array[t+3]=s,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return new on(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new cc(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Uh extends Qa{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new Qt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Es;const mo=new W,Ts=new W,As=new W,Rs=new Yt,go=new Yt,Nm=new Ce,Er=new W,xo=new W,Tr=new W,Nf=new Yt,bl=new Yt,Of=new Yt;class Bf extends tn{constructor(t=new Uh){if(super(),this.isSprite=!0,this.type="Sprite",Es===void 0){Es=new qe;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new dA(e,5);Es.setIndex([0,1,2,0,2,3]),Es.setAttribute("position",new cc(i,3,0,!1)),Es.setAttribute("uv",new cc(i,2,3,!1))}this.geometry=Es,this.material=t,this.center=new Yt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ts.setFromMatrixScale(this.matrixWorld),Nm.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),As.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ts.multiplyScalar(-As.z);const i=this.material.rotation;let a,s;i!==0&&(s=Math.cos(i),a=Math.sin(i));const o=this.center;Ar(Er.set(-.5,-.5,0),As,o,Ts,a,s),Ar(xo.set(.5,-.5,0),As,o,Ts,a,s),Ar(Tr.set(.5,.5,0),As,o,Ts,a,s),Nf.set(0,0),bl.set(1,0),Of.set(1,1);let r=t.ray.intersectTriangle(Er,xo,Tr,!1,mo);if(r===null&&(Ar(xo.set(-.5,.5,0),As,o,Ts,a,s),bl.set(0,1),r=t.ray.intersectTriangle(Er,Tr,xo,!1,mo),r===null))return;const c=t.ray.origin.distanceTo(mo);c<t.near||c>t.far||e.push({distance:c,point:mo.clone(),uv:si.getInterpolation(mo,Er,xo,Tr,Nf,bl,Of,new Yt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Ar(n,t,e,i,a,s){Rs.subVectors(n,e).addScalar(.5).multiply(i),a!==void 0?(go.x=s*Rs.x-a*Rs.y,go.y=a*Rs.x+s*Rs.y):go.copy(Rs),n.copy(t),n.x+=go.x,n.y+=go.y,n.applyMatrix4(Nm)}class uA extends zn{constructor(t=null,e=1,i=1,a,s,o,r,c,l=oi,h=oi,u,d){super(null,o,r,c,l,h,a,s,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Co extends on{constructor(t,e,i,a=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=a}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Ps=new Ce,Hf=new Ce,Rr=[],Gf=new Ja,fA=new Ce,vo=new ve,yo=new Ks;class Xf extends ve{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Co(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let a=0;a<i;a++)this.setMatrixAt(a,fA)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Ja),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,Ps),Gf.copy(t.boundingBox).applyMatrix4(Ps),this.boundingBox.union(Gf)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ks),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,Ps),yo.copy(t.boundingSphere).applyMatrix4(Ps),this.boundingSphere.union(yo)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const i=e.morphTargetInfluences,a=this.morphTexture.source.data.data,s=i.length+1,o=t*s+1;for(let r=0;r<i.length;r++)i[r]=a[o+r]}raycast(t,e){const i=this.matrixWorld,a=this.count;if(vo.geometry=this.geometry,vo.material=this.material,vo.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),yo.copy(this.boundingSphere),yo.applyMatrix4(i),t.ray.intersectsSphere(yo)!==!1))for(let s=0;s<a;s++){this.getMatrixAt(s,Ps),Hf.multiplyMatrices(i,Ps),vo.matrixWorld=Hf,vo.raycast(t,Rr);for(let o=0,r=Rr.length;o<r;o++){const c=Rr[o];c.instanceId=s,c.object=this,e.push(c)}Rr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Co(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const i=e.morphTargetInfluences,a=i.length+1;this.morphTexture===null&&(this.morphTexture=new uA(new Float32Array(a*this.count),a,this.count,od,zi));const s=this.morphTexture.source.data.data;let o=0;for(let l=0;l<i.length;l++)o+=i[l];const r=this.geometry.morphTargetsRelative?1:1-o,c=a*t;s[c]=r,s.set(i,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Nh extends Qa{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Qt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const lc=new W,hc=new W,Vf=new Ce,Mo=new dd,Pr=new Ks,Sl=new W,Wf=new W;class pA extends tn{constructor(t=new qe,e=new Nh){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let a=1,s=e.count;a<s;a++)lc.fromBufferAttribute(e,a-1),hc.fromBufferAttribute(e,a),i[a]=i[a-1],i[a]+=lc.distanceTo(hc);t.setAttribute("lineDistance",new Le(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,a=this.matrixWorld,s=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Pr.copy(i.boundingSphere),Pr.applyMatrix4(a),Pr.radius+=s,t.ray.intersectsSphere(Pr)===!1)return;Vf.copy(a).invert(),Mo.copy(t.ray).applyMatrix4(Vf);const r=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=r*r,l=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const f=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let v=f,g=m-1;v<g;v+=l){const p=h.getX(v),_=h.getX(v+1),x=Cr(this,t,Mo,c,p,_);x&&e.push(x)}if(this.isLineLoop){const v=h.getX(m-1),g=h.getX(f),p=Cr(this,t,Mo,c,v,g);p&&e.push(p)}}else{const f=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let v=f,g=m-1;v<g;v+=l){const p=Cr(this,t,Mo,c,v,v+1);p&&e.push(p)}if(this.isLineLoop){const v=Cr(this,t,Mo,c,m-1,f);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}}function Cr(n,t,e,i,a,s){const o=n.geometry.attributes.position;if(lc.fromBufferAttribute(o,a),hc.fromBufferAttribute(o,s),e.distanceSqToSegment(lc,hc,Sl,Wf)>i)return;Sl.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Sl);if(!(c<t.near||c>t.far))return{distance:c,point:Wf.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const Yf=new W,$f=new W;class Zf extends pA{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let a=0,s=e.count;a<s;a+=2)Yf.fromBufferAttribute(e,a),$f.fromBufferAttribute(e,a+1),i[a]=a===0?0:i[a-1],i[a+1]=i[a]+Yf.distanceTo($f);t.setAttribute("lineDistance",new Le(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Oh extends zn{constructor(t,e,i,a,s,o,r,c,l){super(t,e,i,a,s,o,r,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Bi{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,a=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),s+=i.distanceTo(a),e.push(s),a=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let a=0;const s=i.length;let o;e?o=e:o=t*i[s-1];let r=0,c=s-1,l;for(;r<=c;)if(a=Math.floor(r+(c-r)/2),l=i[a]-o,l<0)r=a+1;else if(l>0)c=a-1;else{c=a;break}if(a=c,i[a]===o)return a/(s-1);const h=i[a],d=i[a+1]-h,f=(o-h)/d;return(a+f)/(s-1)}getTangent(t,e){let a=t-1e-4,s=t+1e-4;a<0&&(a=0),s>1&&(s=1);const o=this.getPoint(a),r=this.getPoint(s),c=e||(o.isVector2?new Yt:new W);return c.copy(r).sub(o).normalize(),c}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new W,a=[],s=[],o=[],r=new W,c=new Ce;for(let f=0;f<=t;f++){const m=f/t;a[f]=this.getTangentAt(m,new W)}s[0]=new W,o[0]=new W;let l=Number.MAX_VALUE;const h=Math.abs(a[0].x),u=Math.abs(a[0].y),d=Math.abs(a[0].z);h<=l&&(l=h,i.set(1,0,0)),u<=l&&(l=u,i.set(0,1,0)),d<=l&&i.set(0,0,1),r.crossVectors(a[0],i).normalize(),s[0].crossVectors(a[0],r),o[0].crossVectors(a[0],s[0]);for(let f=1;f<=t;f++){if(s[f]=s[f-1].clone(),o[f]=o[f-1].clone(),r.crossVectors(a[f-1],a[f]),r.length()>Number.EPSILON){r.normalize();const m=Math.acos(An(a[f-1].dot(a[f]),-1,1));s[f].applyMatrix4(c.makeRotationAxis(r,m))}o[f].crossVectors(a[f],s[f])}if(e===!0){let f=Math.acos(An(s[0].dot(s[t]),-1,1));f/=t,a[0].dot(r.crossVectors(s[0],s[t]))>0&&(f=-f);for(let m=1;m<=t;m++)s[m].applyMatrix4(c.makeRotationAxis(a[m],f*m)),o[m].crossVectors(a[m],s[m])}return{tangents:a,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class md extends Bi{constructor(t=0,e=0,i=1,a=1,s=0,o=Math.PI*2,r=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=a,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=r,this.aRotation=c}getPoint(t,e=new Yt){const i=e,a=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=a;for(;s>a;)s-=a;s<Number.EPSILON&&(o?s=0:s=a),this.aClockwise===!0&&!o&&(s===a?s=-a:s=s-a);const r=this.aStartAngle+t*s;let c=this.aX+this.xRadius*Math.cos(r),l=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return i.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class mA extends md{constructor(t,e,i,a,s,o){super(t,e,i,i,a,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function gd(){let n=0,t=0,e=0,i=0;function a(s,o,r,c){n=s,t=r,e=-3*s+3*o-2*r-c,i=2*s-2*o+r+c}return{initCatmullRom:function(s,o,r,c,l){a(o,r,l*(r-s),l*(c-o))},initNonuniformCatmullRom:function(s,o,r,c,l,h,u){let d=(o-s)/l-(r-s)/(l+h)+(r-o)/h,f=(r-o)/h-(c-o)/(h+u)+(c-r)/u;d*=h,f*=h,a(o,r,d,f)},calc:function(s){const o=s*s,r=o*s;return n+t*s+e*o+i*r}}}const Dr=new W,wl=new gd,El=new gd,Tl=new gd;class gA extends Bi{constructor(t=[],e=!1,i="centripetal",a=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=a}getPoint(t,e=new W){const i=e,a=this.points,s=a.length,o=(s-(this.closed?0:1))*t;let r=Math.floor(o),c=o-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/s)+1)*s:c===0&&r===s-1&&(r=s-2,c=1);let l,h;this.closed||r>0?l=a[(r-1)%s]:(Dr.subVectors(a[0],a[1]).add(a[0]),l=Dr);const u=a[r%s],d=a[(r+1)%s];if(this.closed||r+2<s?h=a[(r+2)%s]:(Dr.subVectors(a[s-1],a[s-2]).add(a[s-1]),h=Dr),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let m=Math.pow(l.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(h),f);v<1e-4&&(v=1),m<1e-4&&(m=v),g<1e-4&&(g=v),wl.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,m,v,g),El.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,m,v,g),Tl.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,m,v,g)}else this.curveType==="catmullrom"&&(wl.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),El.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),Tl.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return i.set(wl.calc(c),El.calc(c),Tl.calc(c)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new W().fromArray(a))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function jf(n,t,e,i,a){const s=(i-t)*.5,o=(a-e)*.5,r=n*n,c=n*r;return(2*e-2*i+s+o)*c+(-3*e+3*i-2*s-o)*r+s*n+e}function xA(n,t){const e=1-n;return e*e*t}function vA(n,t){return 2*(1-n)*n*t}function yA(n,t){return n*n*t}function Do(n,t,e,i){return xA(n,t)+vA(n,e)+yA(n,i)}function MA(n,t){const e=1-n;return e*e*e*t}function _A(n,t){const e=1-n;return 3*e*e*n*t}function bA(n,t){return 3*(1-n)*n*n*t}function SA(n,t){return n*n*n*t}function Lo(n,t,e,i,a){return MA(n,t)+_A(n,e)+bA(n,i)+SA(n,a)}class Om extends Bi{constructor(t=new Yt,e=new Yt,i=new Yt,a=new Yt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new Yt){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(Lo(t,a.x,s.x,o.x,r.x),Lo(t,a.y,s.y,o.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class wA extends Bi{constructor(t=new W,e=new W,i=new W,a=new W){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new W){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(Lo(t,a.x,s.x,o.x,r.x),Lo(t,a.y,s.y,o.y,r.y),Lo(t,a.z,s.z,o.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Bm extends Bi{constructor(t=new Yt,e=new Yt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Yt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Yt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class EA extends Bi{constructor(t=new W,e=new W){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new W){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new W){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Hm extends Bi{constructor(t=new Yt,e=new Yt,i=new Yt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Yt){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(Do(t,a.x,s.x,o.x),Do(t,a.y,s.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class TA extends Bi{constructor(t=new W,e=new W,i=new W){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new W){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(Do(t,a.x,s.x,o.x),Do(t,a.y,s.y,o.y),Do(t,a.z,s.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Gm extends Bi{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Yt){const i=e,a=this.points,s=(a.length-1)*t,o=Math.floor(s),r=s-o,c=a[o===0?o:o-1],l=a[o],h=a[o>a.length-2?a.length-1:o+1],u=a[o>a.length-3?a.length-1:o+2];return i.set(jf(r,c.x,l.x,h.x,u.x),jf(r,c.y,l.y,h.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new Yt().fromArray(a))}return this}}var qf=Object.freeze({__proto__:null,ArcCurve:mA,CatmullRomCurve3:gA,CubicBezierCurve:Om,CubicBezierCurve3:wA,EllipseCurve:md,LineCurve:Bm,LineCurve3:EA,QuadraticBezierCurve:Hm,QuadraticBezierCurve3:TA,SplineCurve:Gm});class AA extends Bi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new qf[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),a=this.getCurveLengths();let s=0;for(;s<a.length;){if(a[s]>=i){const o=a[s]-i,r=this.curves[s],c=r.getLength(),l=c===0?0:1-o/c;return r.getPointAt(l,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,a=this.curves.length;i<a;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let a=0,s=this.curves;a<s.length;a++){const o=s[a],r=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(r);for(let l=0;l<c.length;l++){const h=c[l];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(a.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const a=this.curves[e];t.curves.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(new qf[a.type]().fromJSON(a))}return this}}class Kf extends AA{constructor(t){super(),this.type="Path",this.currentPoint=new Yt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new Bm(this.currentPoint.clone(),new Yt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,a){const s=new Hm(this.currentPoint.clone(),new Yt(t,e),new Yt(i,a));return this.curves.push(s),this.currentPoint.set(i,a),this}bezierCurveTo(t,e,i,a,s,o){const r=new Om(this.currentPoint.clone(),new Yt(t,e),new Yt(i,a),new Yt(s,o));return this.curves.push(r),this.currentPoint.set(s,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new Gm(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,a,s,o){const r=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+r,e+c,i,a,s,o),this}absarc(t,e,i,a,s,o){return this.absellipse(t,e,i,i,a,s,o),this}ellipse(t,e,i,a,s,o,r,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,i,a,s,o,r,c),this}absellipse(t,e,i,a,s,o,r,c){const l=new md(t,e,i,a,s,o,r,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class xd extends qe{constructor(t=1,e=32,i=0,a=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:a},e=Math.max(3,e);const s=[],o=[],r=[],c=[],l=new W,h=new Yt;o.push(0,0,0),r.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=i+u/e*a;l.x=t*Math.cos(f),l.y=t*Math.sin(f),o.push(l.x,l.y,l.z),r.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new Le(o,3)),this.setAttribute("normal",new Le(r,3)),this.setAttribute("uv",new Le(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new xd(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Go extends qe{constructor(t=1,e=1,i=1,a=32,s=1,o=!1,r=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:a,heightSegments:s,openEnded:o,thetaStart:r,thetaLength:c};const l=this;a=Math.floor(a),s=Math.floor(s);const h=[],u=[],d=[],f=[];let m=0;const v=[],g=i/2;let p=0;_(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new Le(u,3)),this.setAttribute("normal",new Le(d,3)),this.setAttribute("uv",new Le(f,2));function _(){const y=new W,S=new W;let w=0;const E=(e-t)/i;for(let A=0;A<=s;A++){const b=[],M=A/s,P=M*(e-t)+t;for(let k=0;k<=a;k++){const D=k/a,z=D*c+r,C=Math.sin(z),T=Math.cos(z);S.x=P*C,S.y=-M*i+g,S.z=P*T,u.push(S.x,S.y,S.z),y.set(C,E,T).normalize(),d.push(y.x,y.y,y.z),f.push(D,1-M),b.push(m++)}v.push(b)}for(let A=0;A<a;A++)for(let b=0;b<s;b++){const M=v[b][A],P=v[b+1][A],k=v[b+1][A+1],D=v[b][A+1];(t>0||b!==0)&&(h.push(M,P,D),w+=3),(e>0||b!==s-1)&&(h.push(P,k,D),w+=3)}l.addGroup(p,w,0),p+=w}function x(y){const S=m,w=new Yt,E=new W;let A=0;const b=y===!0?t:e,M=y===!0?1:-1;for(let k=1;k<=a;k++)u.push(0,g*M,0),d.push(0,M,0),f.push(.5,.5),m++;const P=m;for(let k=0;k<=a;k++){const z=k/a*c+r,C=Math.cos(z),T=Math.sin(z);E.x=b*T,E.y=g*M,E.z=b*C,u.push(E.x,E.y,E.z),d.push(0,M,0),w.x=C*.5+.5,w.y=T*.5*M+.5,f.push(w.x,w.y),m++}for(let k=0;k<a;k++){const D=S+k,z=P+k;y===!0?h.push(z,z+1,D):h.push(z+1,z,D),A+=3}l.addGroup(p,A,y===!0?1:2),p+=A}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Go(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class vd extends Go{constructor(t=1,e=1,i=32,a=1,s=!1,o=0,r=Math.PI*2){super(0,t,e,i,a,s,o,r),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:a,openEnded:s,thetaStart:o,thetaLength:r}}static fromJSON(t){return new vd(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class yd extends qe{constructor(t=[],e=[],i=1,a=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:a};const s=[],o=[];r(a),l(i),h(),this.setAttribute("position",new Le(s,3)),this.setAttribute("normal",new Le(s.slice(),3)),this.setAttribute("uv",new Le(o,2)),a===0?this.computeVertexNormals():this.normalizeNormals();function r(_){const x=new W,y=new W,S=new W;for(let w=0;w<e.length;w+=3)f(e[w+0],x),f(e[w+1],y),f(e[w+2],S),c(x,y,S,_)}function c(_,x,y,S){const w=S+1,E=[];for(let A=0;A<=w;A++){E[A]=[];const b=_.clone().lerp(y,A/w),M=x.clone().lerp(y,A/w),P=w-A;for(let k=0;k<=P;k++)k===0&&A===w?E[A][k]=b:E[A][k]=b.clone().lerp(M,k/P)}for(let A=0;A<w;A++)for(let b=0;b<2*(w-A)-1;b++){const M=Math.floor(b/2);b%2===0?(d(E[A][M+1]),d(E[A+1][M]),d(E[A][M])):(d(E[A][M+1]),d(E[A+1][M+1]),d(E[A+1][M]))}}function l(_){const x=new W;for(let y=0;y<s.length;y+=3)x.x=s[y+0],x.y=s[y+1],x.z=s[y+2],x.normalize().multiplyScalar(_),s[y+0]=x.x,s[y+1]=x.y,s[y+2]=x.z}function h(){const _=new W;for(let x=0;x<s.length;x+=3){_.x=s[x+0],_.y=s[x+1],_.z=s[x+2];const y=g(_)/2/Math.PI+.5,S=p(_)/Math.PI+.5;o.push(y,1-S)}m(),u()}function u(){for(let _=0;_<o.length;_+=6){const x=o[_+0],y=o[_+2],S=o[_+4],w=Math.max(x,y,S),E=Math.min(x,y,S);w>.9&&E<.1&&(x<.2&&(o[_+0]+=1),y<.2&&(o[_+2]+=1),S<.2&&(o[_+4]+=1))}}function d(_){s.push(_.x,_.y,_.z)}function f(_,x){const y=_*3;x.x=t[y+0],x.y=t[y+1],x.z=t[y+2]}function m(){const _=new W,x=new W,y=new W,S=new W,w=new Yt,E=new Yt,A=new Yt;for(let b=0,M=0;b<s.length;b+=9,M+=6){_.set(s[b+0],s[b+1],s[b+2]),x.set(s[b+3],s[b+4],s[b+5]),y.set(s[b+6],s[b+7],s[b+8]),w.set(o[M+0],o[M+1]),E.set(o[M+2],o[M+3]),A.set(o[M+4],o[M+5]),S.copy(_).add(x).add(y).divideScalar(3);const P=g(S);v(w,M+0,_,P),v(E,M+2,x,P),v(A,M+4,y,P)}}function v(_,x,y,S){S<0&&_.x===1&&(o[x]=_.x-1),y.x===0&&y.z===0&&(o[x]=S/2/Math.PI+.5)}function g(_){return Math.atan2(_.z,-_.x)}function p(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new yd(t.vertices,t.indices,t.radius,t.details)}}const Lr=new W,kr=new W,Al=new W,Ir=new si;class RA extends qe{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const a=Math.pow(10,4),s=Math.cos(Us*e),o=t.getIndex(),r=t.getAttribute("position"),c=o?o.count:r.count,l=[0,0,0],h=["a","b","c"],u=new Array(3),d={},f=[];for(let m=0;m<c;m+=3){o?(l[0]=o.getX(m),l[1]=o.getX(m+1),l[2]=o.getX(m+2)):(l[0]=m,l[1]=m+1,l[2]=m+2);const{a:v,b:g,c:p}=Ir;if(v.fromBufferAttribute(r,l[0]),g.fromBufferAttribute(r,l[1]),p.fromBufferAttribute(r,l[2]),Ir.getNormal(Al),u[0]=`${Math.round(v.x*a)},${Math.round(v.y*a)},${Math.round(v.z*a)}`,u[1]=`${Math.round(g.x*a)},${Math.round(g.y*a)},${Math.round(g.z*a)}`,u[2]=`${Math.round(p.x*a)},${Math.round(p.y*a)},${Math.round(p.z*a)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let _=0;_<3;_++){const x=(_+1)%3,y=u[_],S=u[x],w=Ir[h[_]],E=Ir[h[x]],A=`${y}_${S}`,b=`${S}_${y}`;b in d&&d[b]?(Al.dot(d[b].normal)<=s&&(f.push(w.x,w.y,w.z),f.push(E.x,E.y,E.z)),d[b]=null):A in d||(d[A]={index0:l[_],index1:l[x],normal:Al.clone()})}}for(const m in d)if(d[m]){const{index0:v,index1:g}=d[m];Lr.fromBufferAttribute(r,v),kr.fromBufferAttribute(r,g),f.push(Lr.x,Lr.y,Lr.z),f.push(kr.x,kr.y,kr.z)}this.setAttribute("position",new Le(f,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class Xm extends Kf{constructor(t){super(t),this.uuid=Ui(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,a=this.holes.length;i<a;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const a=this.holes[e];t.holes.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(new Kf().fromJSON(a))}return this}}const PA={triangulate:function(n,t,e=2){const i=t&&t.length,a=i?t[0]*e:n.length;let s=Vm(n,0,a,e,!0);const o=[];if(!s||s.next===s.prev)return o;let r,c,l,h,u,d,f;if(i&&(s=IA(n,t,s,e)),n.length>80*e){r=l=n[0],c=h=n[1];for(let m=e;m<a;m+=e)u=n[m],d=n[m+1],u<r&&(r=u),d<c&&(c=d),u>l&&(l=u),d>h&&(h=d);f=Math.max(l-r,h-c),f=f!==0?32767/f:0}return Xo(s,o,e,r,c,f,0),o}};function Vm(n,t,e,i,a){let s,o;if(a===WA(n,t,e,i)>0)for(s=t;s<e;s+=i)o=Jf(s,n[s],n[s+1],o);else for(s=e-i;s>=t;s-=i)o=Jf(s,n[s],n[s+1],o);return o&&bc(o,o.next)&&(Wo(o),o=o.next),o}function Ka(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(bc(e,e.next)||Qe(e.prev,e,e.next)===0)){if(Wo(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function Xo(n,t,e,i,a,s,o){if(!n)return;!o&&s&&OA(n,i,a,s);let r=n,c,l;for(;n.prev!==n.next;){if(c=n.prev,l=n.next,s?DA(n,i,a,s):CA(n)){t.push(c.i/e|0),t.push(n.i/e|0),t.push(l.i/e|0),Wo(n),n=l.next,r=l.next;continue}if(n=l,n===r){o?o===1?(n=LA(Ka(n),t,e),Xo(n,t,e,i,a,s,2)):o===2&&kA(n,t,e,i,a,s):Xo(Ka(n),t,e,i,a,s,1);break}}}function CA(n){const t=n.prev,e=n,i=n.next;if(Qe(t,e,i)>=0)return!1;const a=t.x,s=e.x,o=i.x,r=t.y,c=e.y,l=i.y,h=a<s?a<o?a:o:s<o?s:o,u=r<c?r<l?r:l:c<l?c:l,d=a>s?a>o?a:o:s>o?s:o,f=r>c?r>l?r:l:c>l?c:l;let m=i.next;for(;m!==t;){if(m.x>=h&&m.x<=d&&m.y>=u&&m.y<=f&&ks(a,r,s,c,o,l,m.x,m.y)&&Qe(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function DA(n,t,e,i){const a=n.prev,s=n,o=n.next;if(Qe(a,s,o)>=0)return!1;const r=a.x,c=s.x,l=o.x,h=a.y,u=s.y,d=o.y,f=r<c?r<l?r:l:c<l?c:l,m=h<u?h<d?h:d:u<d?u:d,v=r>c?r>l?r:l:c>l?c:l,g=h>u?h>d?h:d:u>d?u:d,p=Bh(f,m,t,e,i),_=Bh(v,g,t,e,i);let x=n.prevZ,y=n.nextZ;for(;x&&x.z>=p&&y&&y.z<=_;){if(x.x>=f&&x.x<=v&&x.y>=m&&x.y<=g&&x!==a&&x!==o&&ks(r,h,c,u,l,d,x.x,x.y)&&Qe(x.prev,x,x.next)>=0||(x=x.prevZ,y.x>=f&&y.x<=v&&y.y>=m&&y.y<=g&&y!==a&&y!==o&&ks(r,h,c,u,l,d,y.x,y.y)&&Qe(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;x&&x.z>=p;){if(x.x>=f&&x.x<=v&&x.y>=m&&x.y<=g&&x!==a&&x!==o&&ks(r,h,c,u,l,d,x.x,x.y)&&Qe(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;y&&y.z<=_;){if(y.x>=f&&y.x<=v&&y.y>=m&&y.y<=g&&y!==a&&y!==o&&ks(r,h,c,u,l,d,y.x,y.y)&&Qe(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function LA(n,t,e){let i=n;do{const a=i.prev,s=i.next.next;!bc(a,s)&&Wm(a,i,i.next,s)&&Vo(a,s)&&Vo(s,a)&&(t.push(a.i/e|0),t.push(i.i/e|0),t.push(s.i/e|0),Wo(i),Wo(i.next),i=n=s),i=i.next}while(i!==n);return Ka(i)}function kA(n,t,e,i,a,s){let o=n;do{let r=o.next.next;for(;r!==o.prev;){if(o.i!==r.i&&GA(o,r)){let c=Ym(o,r);o=Ka(o,o.next),c=Ka(c,c.next),Xo(o,t,e,i,a,s,0),Xo(c,t,e,i,a,s,0);return}r=r.next}o=o.next}while(o!==n)}function IA(n,t,e,i){const a=[];let s,o,r,c,l;for(s=0,o=t.length;s<o;s++)r=t[s]*i,c=s<o-1?t[s+1]*i:n.length,l=Vm(n,r,c,i,!1),l===l.next&&(l.steiner=!0),a.push(HA(l));for(a.sort(zA),s=0;s<a.length;s++)e=FA(a[s],e);return e}function zA(n,t){return n.x-t.x}function FA(n,t){const e=UA(n,t);if(!e)return t;const i=Ym(e,n);return Ka(i,i.next),Ka(e,e.next)}function UA(n,t){let e=t,i=-1/0,a;const s=n.x,o=n.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=s&&d>i&&(i=d,a=e.x<e.next.x?e:e.next,d===s))return a}e=e.next}while(e!==t);if(!a)return null;const r=a,c=a.x,l=a.y;let h=1/0,u;e=a;do s>=e.x&&e.x>=c&&s!==e.x&&ks(o<l?s:i,o,c,l,o<l?i:s,o,e.x,e.y)&&(u=Math.abs(o-e.y)/(s-e.x),Vo(e,n)&&(u<h||u===h&&(e.x>a.x||e.x===a.x&&NA(a,e)))&&(a=e,h=u)),e=e.next;while(e!==r);return a}function NA(n,t){return Qe(n.prev,n,t.prev)<0&&Qe(t.next,n,n.next)<0}function OA(n,t,e,i){let a=n;do a.z===0&&(a.z=Bh(a.x,a.y,t,e,i)),a.prevZ=a.prev,a.nextZ=a.next,a=a.next;while(a!==n);a.prevZ.nextZ=null,a.prevZ=null,BA(a)}function BA(n){let t,e,i,a,s,o,r,c,l=1;do{for(e=n,n=null,s=null,o=0;e;){for(o++,i=e,r=0,t=0;t<l&&(r++,i=i.nextZ,!!i);t++);for(c=l;r>0||c>0&&i;)r!==0&&(c===0||!i||e.z<=i.z)?(a=e,e=e.nextZ,r--):(a=i,i=i.nextZ,c--),s?s.nextZ=a:n=a,a.prevZ=s,s=a;e=i}s.nextZ=null,l*=2}while(o>1);return n}function Bh(n,t,e,i,a){return n=(n-e)*a|0,t=(t-i)*a|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function HA(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function ks(n,t,e,i,a,s,o,r){return(a-o)*(t-r)>=(n-o)*(s-r)&&(n-o)*(i-r)>=(e-o)*(t-r)&&(e-o)*(s-r)>=(a-o)*(i-r)}function GA(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!XA(n,t)&&(Vo(n,t)&&Vo(t,n)&&VA(n,t)&&(Qe(n.prev,n,t.prev)||Qe(n,t.prev,t))||bc(n,t)&&Qe(n.prev,n,n.next)>0&&Qe(t.prev,t,t.next)>0)}function Qe(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function bc(n,t){return n.x===t.x&&n.y===t.y}function Wm(n,t,e,i){const a=Fr(Qe(n,t,e)),s=Fr(Qe(n,t,i)),o=Fr(Qe(e,i,n)),r=Fr(Qe(e,i,t));return!!(a!==s&&o!==r||a===0&&zr(n,e,t)||s===0&&zr(n,i,t)||o===0&&zr(e,n,i)||r===0&&zr(e,t,i))}function zr(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function Fr(n){return n>0?1:n<0?-1:0}function XA(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&Wm(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function Vo(n,t){return Qe(n.prev,n,n.next)<0?Qe(n,t,n.next)>=0&&Qe(n,n.prev,t)>=0:Qe(n,t,n.prev)<0||Qe(n,n.next,t)<0}function VA(n,t){let e=n,i=!1;const a=(n.x+t.x)/2,s=(n.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&a<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function Ym(n,t){const e=new Hh(n.i,n.x,n.y),i=new Hh(t.i,t.x,t.y),a=n.next,s=t.prev;return n.next=t,t.prev=n,e.next=a,a.prev=e,i.next=e,e.prev=i,s.next=i,i.prev=s,i}function Jf(n,t,e,i){const a=new Hh(n,t,e);return i?(a.next=i.next,a.prev=i,i.next.prev=a,i.next=a):(a.prev=a,a.next=a),a}function Wo(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Hh(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function WA(n,t,e,i){let a=0;for(let s=t,o=e-i;s<e;s+=i)a+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return a}class ko{static area(t){const e=t.length;let i=0;for(let a=e-1,s=0;s<e;a=s++)i+=t[a].x*t[s].y-t[s].x*t[a].y;return i*.5}static isClockWise(t){return ko.area(t)<0}static triangulateShape(t,e){const i=[],a=[],s=[];Qf(t),tp(i,t);let o=t.length;e.forEach(Qf);for(let c=0;c<e.length;c++)a.push(o),o+=e[c].length,tp(i,e[c]);const r=PA.triangulate(i,a);for(let c=0;c<r.length;c+=3)s.push(r.slice(c,c+3));return s}}function Qf(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function tp(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class Md extends yd{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],a=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,a,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Md(t.radius,t.detail)}}class Os extends qe{constructor(t=.5,e=1,i=32,a=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:a,thetaStart:s,thetaLength:o},i=Math.max(3,i),a=Math.max(1,a);const r=[],c=[],l=[],h=[];let u=t;const d=(e-t)/a,f=new W,m=new Yt;for(let v=0;v<=a;v++){for(let g=0;g<=i;g++){const p=s+g/i*o;f.x=u*Math.cos(p),f.y=u*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),m.x=(f.x/e+1)/2,m.y=(f.y/e+1)/2,h.push(m.x,m.y)}u+=d}for(let v=0;v<a;v++){const g=v*(i+1);for(let p=0;p<i;p++){const _=p+g,x=_,y=_+i+1,S=_+i+2,w=_+1;r.push(x,y,w),r.push(y,S,w)}}this.setIndex(r),this.setAttribute("position",new Le(c,3)),this.setAttribute("normal",new Le(l,3)),this.setAttribute("uv",new Le(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Os(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class _d extends qe{constructor(t=new Xm([new Yt(0,.5),new Yt(-.5,-.5),new Yt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],a=[],s=[],o=[];let r=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let h=0;h<t.length;h++)l(t[h]),this.addGroup(r,c,h),r+=c,c=0;this.setIndex(i),this.setAttribute("position",new Le(a,3)),this.setAttribute("normal",new Le(s,3)),this.setAttribute("uv",new Le(o,2));function l(h){const u=a.length/3,d=h.extractPoints(e);let f=d.shape;const m=d.holes;ko.isClockWise(f)===!1&&(f=f.reverse());for(let g=0,p=m.length;g<p;g++){const _=m[g];ko.isClockWise(_)===!0&&(m[g]=_.reverse())}const v=ko.triangulateShape(f,m);for(let g=0,p=m.length;g<p;g++){const _=m[g];f=f.concat(_)}for(let g=0,p=f.length;g<p;g++){const _=f[g];a.push(_.x,_.y,0),s.push(0,0,1),o.push(_.x,_.y)}for(let g=0,p=v.length;g<p;g++){const _=v[g],x=_[0]+u,y=_[1]+u,S=_[2]+u;i.push(x,y,S),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return YA(e,t)}static fromJSON(t,e){const i=[];for(let a=0,s=t.shapes.length;a<s;a++){const o=e[t.shapes[a]];i.push(o)}return new _d(i,t.curveSegments)}}function YA(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const a=n[e];t.shapes.push(a.uuid)}else t.shapes.push(n.uuid);return t}class Sc extends qe{constructor(t=1,e=.4,i=12,a=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:a,arc:s},i=Math.floor(i),a=Math.floor(a);const o=[],r=[],c=[],l=[],h=new W,u=new W,d=new W;for(let f=0;f<=i;f++)for(let m=0;m<=a;m++){const v=m/a*s,g=f/i*Math.PI*2;u.x=(t+e*Math.cos(g))*Math.cos(v),u.y=(t+e*Math.cos(g))*Math.sin(v),u.z=e*Math.sin(g),r.push(u.x,u.y,u.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(m/a),l.push(f/i)}for(let f=1;f<=i;f++)for(let m=1;m<=a;m++){const v=(a+1)*f+m-1,g=(a+1)*(f-1)+m-1,p=(a+1)*(f-1)+m,_=(a+1)*f+m;o.push(v,g,_),o.push(g,p,_)}this.setIndex(o),this.setAttribute("position",new Le(r,3)),this.setAttribute("normal",new Le(c,3)),this.setAttribute("uv",new Le(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Sc(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Oi extends Qa{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new Qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Qt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Mm,this.normalScale=new Yt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ni,this.combine=nd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class $m extends tn{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Qt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class $A extends $m{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(tn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Qt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Rl=new Ce,ep=new W,np=new W;class ZA{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Yt(512,512),this.map=null,this.mapPass=null,this.matrix=new Ce,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new fd,this._frameExtents=new Yt(1,1),this._viewportCount=1,this._viewports=[new sn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;ep.setFromMatrixPosition(t.matrixWorld),e.position.copy(ep),np.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(np),e.updateMatrixWorld(),Rl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Rl),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Rl)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class jA extends ZA{constructor(){super(new Lm(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class qA extends $m{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(tn.DEFAULT_UP),this.updateMatrix(),this.target=new tn,this.shadow=new jA}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const ip=new Ce;class KA{constructor(t,e,i=0,a=1/0){this.ray=new dd(t,e),this.near=i,this.far=a,this.camera=null,this.layers=new ud,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return ip.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(ip),this}intersectObject(t,e=!0,i=[]){return Gh(t,this,i,e),i.sort(ap),i}intersectObjects(t,e=!0,i=[]){for(let a=0,s=t.length;a<s;a++)Gh(t[a],this,i,e);return i.sort(ap),i}}function ap(n,t){return n.distance-t.distance}function Gh(n,t,e,i){let a=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(a=!1),a===!0&&i===!0){const s=n.children;for(let o=0,r=s.length;o<r;o++)Gh(s[o],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ed}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ed);const JA={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function QA(n,t,e,i){const a=new fi(n.fov,i,.1,200),s=new W,o=new W,r=new W;let c=!1,l=n.fov;const h={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let u=1,d=0,f=0,m=0,v=0,g=0,p=0;function _(){const x=(n.pitchDeg+h.pitchDelta)*Math.PI/180,y=n.yawDeg*Math.PI/180;r.set(Math.sin(y)*Math.cos(x),Math.sin(x),Math.cos(y)*Math.cos(x)).multiplyScalar(n.distance*h.distanceScale*h.zoom)}return _(),{camera:a,update(x,y,S,w,E=JA){const A=y+.6;if(!c)s.set(x,A,S),c=!0;else{const P=1-Math.exp(-Math.max(n.smoothing,.001)*w);s.x+=(x-s.x)*P,s.y+=(A-s.y)*P,s.z+=(S-s.z)*P}const b=1-Math.exp(-Math.max(t.smoothing,.001)*w);h.distanceScale+=(E.distanceScale-h.distanceScale)*b,h.offsetX+=(E.offsetX-h.offsetX)*b,h.offsetZ+=(E.offsetZ-h.offsetZ)*b,h.pitchDelta+=(E.pitchDelta-h.pitchDelta)*b;const M=1-Math.exp(-Math.max(e.smoothing,.001)*w);if(h.zoom+=(u-h.zoom)*M,_(),(a.fov!==l||a.fov!==n.fov)&&(a.fov=n.fov,l=n.fov,a.updateProjectionMatrix()),o.set(s.x+h.offsetX,s.y,s.z+h.offsetZ),a.position.copy(o).add(r),a.lookAt(o),d>.001){f+=w*52;const P=d*.055;a.position.x+=Math.sin(f*1.7)*P,a.position.y+=Math.sin(f*2.3+1.1)*P*.75,a.position.z+=Math.sin(f*1.3+2.4)*P*.5,d*=Math.exp(-9*w)}else d=0;g>.001?(a.position.x+=m*g,a.position.z+=v*g,g*=Math.exp(-13*w)):g=0,a.updateMatrixWorld()},snap(x,y,S){s.set(x,y+.6,S),c=!0,o.set(s.x+h.offsetX,s.y,s.z+h.offsetZ),_(),a.position.copy(o).add(r),a.lookAt(o),a.updateMatrixWorld()},resize(x){a.aspect=x,a.updateProjectionMatrix()},getGroundBasis(){const x=new W().setFromMatrixColumn(a.matrixWorld,0),y=new W().setFromMatrixColumn(a.matrixWorld,2).negate(),S=Math.hypot(x.x,x.z)||1,w=Math.hypot(y.x,y.z)||1;return{rightX:x.x/S,rightZ:x.z/S,forwardX:y.x/w,forwardZ:y.z/w}},addShake(x){!Number.isFinite(x)||x<=0||(d=Math.min(1,d+x))},shakeLevel(){return d},addKick(x,y,S){if(!Number.isFinite(x)||!Number.isFinite(y)||!(S>0))return;const w=Math.hypot(x,y);w<1e-4||(m=x/w*S,v=y/w*S,g=1,p++)},kickLevel(){return g},kickCount(){return p},setZoom(x){u=Number.isFinite(x)&&x>0?x:1},smart(){return{...h}}}}const $a=Math.PI*2,Gn=1e-6;function en(n,t,e){return n<t?t:n>e?e:n}function Zm(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function t2(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function jm(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const a=t2(n);return i===1?a:e+(a-e)*i}function sp(n){return(1-Math.sin(n))/2}function bd(n,t,e){const i=Math.PI/180,a=en(Number.isFinite(t)?t:100,0,180),s=en(Number.isFinite(e)?e:132,0,180);if(s<=a)return n>=Math.cos(a*i)?1:0;const o=Math.cos(a*i),r=Math.cos(s*i);if(n>=o)return 1;const c=en((o-n)/(o-r),0,1);return 1-c*c*(3-2*c)}function dc(n,t,e,i){const a=t>=0?1:-1,o=2/Math.max(Gn,i)*Math.max(0,e),r=en(n,-1,1),c=a-r;return Math.abs(c)<=o?a:r+Math.sign(c)*o}function op(n){const t=en(Number.isFinite(n)?n:1,-1,1),e=Math.abs(t);return Math.sign(t)*e*e*(3-2*e)}function e2(n,t,e,i){if(!(e>0))return t;const a=e*Math.max(0,i),s=t-n;return Math.abs(s)<=a?t:n+Math.sign(s)*a}const rp=30*Math.PI/180,n2=100*Math.PI/180,i2=.06,a2=.22;function qm(n){return en((Math.abs(n)-rp)/(n2-rp),0,1)}function Km(n,t,e,i=i2,a=a2){const s=en(n,0,1),o=en(t,0,1),r=o>s?Math.max(Gn,i):Math.max(Gn,a),c=e/r*1,l=o-s;return Math.abs(l)<=c?o:s+Math.sign(l)*c}function Jm(n,t,e,i,a){if(!(e>0))return t;const s=1-en(a,0,1);return s<=1e-9?n:e2(n,t,s*e,i)}function uc(n,t){if(!n.grounded||n.speed<Gn)return Zm();const e=n.speed/Math.max(n.moveSpeed,Gn),i=Math.max(n.legLength,Gn),a=n.stride>Gn?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,s=Math.min(t.maxAmp,a/i),o=i*Math.sin(Math.min(t.maxAmp,1.25)),r=Math.abs(n.localForward),c=Math.abs(n.localRight),l=r+c+Gn,h=bd(n.localForward/Math.max(n.speed,Gn),t.backStrafeStartDeg,t.backStrafeFullDeg),u=c/l*h,d=r/l+c/l*(1-h),f=op(n.dirF??(n.localForward>=0?1:-1)),m=op(n.dirR??(n.localRight>=0?1:-1)),v=a,g=z=>Math.asin(en(z,-o,o)/i);function p(z,C){const T=jm(z,t.plantLock),U=sp(z),G=f*d*v*T,Z=-g(G),rt=C*m>0?1:-1,pt=1+rt*t.crossStep*.45,vt=m*rt*t.crossStep*v*.4*U,dt=m*u*v*t.sideWeight*pt*T+vt*u,Y=g(dt),N=t.kneeLift*U*s*(.55+.25*d+.1*u*(1+C*m));return{pitchX:Z,rollZ:Y,kneeX:N}}const _=(n.phase%$a+$a)%$a,x=p(_,-1),y=p((_+Math.PI)%$a,1),S=Math.cos(_),w=sp(_),E=-t.comSway*s*S*(.6*d+.8*u)-m*t.comSway*s*u*.45,A=t.comBob*w*s,b=m*t.hipLean*s*u*S*.6,M=m*t.hipLean*s*u*(.45+.25*S),P=t.armSwing*s*S*(d*f+.3*u),k=P,D=-P;return{legL:x,legR:y,pelvisX:E,pelvisY:A,pelvisRoll:b,sideLean:M,armL:k,armR:D,strafe:u,backward:f<0?d:0}}function Qm(n){const t=(n%$a+$a)%$a,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function t0(n,t,e){const i=en(e.progress,0,1);if(i>=1||n.speed<Gn)return Zm();const a=i*i*(3-2*i),s=1-a;return uc({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*a,speed:n.speed*s,stride:n.stride*s},t)}function e0(n,t,e,i){const a=en(n,-1,1),s=Math.abs(a),o=Math.min(1,t*(1+Math.max(0,i)*s*s));return en(o*a,-1,1)*(e*Math.PI/180)}function n0(n,t=0){const e=en(n,0,1);return e*e+(1-e*e)*en(t,0,1)}function i0(n,t,e){if(!(n>0)||!(t>0))return 0;const i=en(e,0,1);return t+(n-t)*i}function a0(n,t,e,i){if(!(Math.hypot(n,t)>1e-6))return e;const s=Math.atan2(t,n)*180/Math.PI;if(Math.abs(s)<=90)return e;const r=(s-Math.sign(s)*180)*Math.PI/180,c=en(i,0,1);return e*c+r*(1-c)}function s0(n,t,e,i,a){const s=Math.max(e,Gn),o=Math.max(0,i)*s,r=Math.max(0,a)*s,c=t>Gn?(t-n)/t:0,l=c>.02,h=c<-.015,u=n<=o*.15,d=!h&&n<r&&(l||u);return{enter:n>Gn&&n<=o&&l,resume:!d}}function o0(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return en(n*en(t,0,2),-i,i)}function r0(n,t,e){const i=Math.sin(n),a=Math.cos(n),s=Math.cos(n),o=-Math.sin(n);return{forward:t*i+e*a,right:t*s+e*o}}function c0(n,t,e){const i=en(n,0,1),a=i*i*(3-2*i);return e?t==="inStop"?1-a:1:t==="afterStop"?1-a:0}function s2(n,t,e){const i=()=>({legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisY:0,env:0});if(!e.turnStepEnabled)return i();const a=en(n,0,1),s=Math.sin(Math.PI*a),o=s*s;if(o<=1e-9)return i();const r=t>=0,c=r?1:.35,l=r?.35:1,h=Math.max(0,e.turnStepPitch)*o,u=Math.max(0,e.turnStepKnee)*o,d=Math.max(0,e.turnStepPitch)*.35*o,f=r?1:-1;return{legL:{pitchX:-h*c,rollZ:f*d*c,kneeX:u*c},legR:{pitchX:-h*l,rollZ:-f*d*l,kneeX:u*l},pelvisY:-Math.max(0,e.turnStepDip)*o,env:o}}function l0(n,t,e,i,a){const s=en(n,0,1),o=en(a.stopPeakRatio,.05,.95),r=s<=o?s/o:(s-o)/(1-o),c=r*r*(3-2*r),l=s<=o?c:1-c,h=Math.hypot(e,i),u=h>Gn?e/h:1,d=h>Gn?i/h:0,f=jm(t,1)>0;return{leadPitch:Math.max(0,a.stopStepPitch)*l,trailPitch:Math.max(0,a.stopTrailPitch)*l,leadKnee:Math.max(0,a.stopStepKnee)*l,bodyShift:Math.max(0,a.stopBodyShift)*l,bodyDip:Math.max(0,a.stopBodyDip)*l,chestPitch:Math.max(0,a.stopChestPitch)*l,leadLeft:f,fwdN:u,rightN:d,env:l}}function In(n){return n<0?0:n>1?1:n}const $r=Math.PI*2;function o2(n){return((n+Math.PI)%$r+$r)%$r-Math.PI}function r2(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function c2(n,t,e,i,a,s=n.phase){const o=In(i);if(o<=0)return n;const r=In(t),c=Math.max(1,Math.round(a.cycles)),l=Math.max(0,a.strideSpeed),h=e%2===0?1:-1,u=In(a.forwardBias),d=Math.max(0,n.stride??0),f=Math.max(0,a.strideScale??0)*d,m=r*r*(3-2*r),v={speed:l,phase:s+$r*c/2*m,localForward:l*u,localRight:l*(1-u)*h},g=o2(v.phase-n.phase),p=o*o*(3-2*o),_=n.speed>.05?d:0;return{speed:n.speed+(v.speed-n.speed)*o,phase:n.phase+g*p,localForward:n.localForward+(v.localForward-n.localForward)*o,localRight:n.localRight+(v.localRight-n.localRight)*o,stride:_+(f-_)*o*o}}function l2(n,t,e){const i=r2(),a=In(n),s=Math.sin(Math.PI*a)**2;if(s<=1e-12)return i;const o=t%2===0?1:-1,r=o<0,c=o>0,l=e.stepPitch*s,h=e.stepKnee*s,u=e.stepSide*s;return i.legL.pitchX=r?-l:l*.55,i.legR.pitchX=c?-l:l*.55,i.legL.kneeX=r?h:h*.4,i.legR.kneeX=c?h:h*.4,i.legL.rollZ=-u*o,i.legR.rollZ=u*o,i.pelvisX=e.stepSway*s*o,i.pelvisY=-e.stepDip*s,i.pelvisRoll=u*.25*o,i}function h0(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function cp(n,t,e,i,a){if(e<=0||i<=0)return 0;const s=(n-t)/e;return s<0||s>=1?0:i*h0(s,a)}function h2(n,t,e,i){const a=t?1:0,s=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),o=n+(a-n)*s;return t&&o>.999?1:!t&&o<.001?0:o}function d2(n,t,e){const i=In(n);return{gaitScale:1-i*(1-In(t)),attackLegWeight:In(e)*i}}function u2(n,t,e){const i=In(e);if(i<=0)return n;if(i>=1)return{...n,...t,armL:n.armL,armR:n.armR,strafe:n.strafe,backward:n.backward};const a=(s,o)=>s+(o-s)*i;return{legL:{pitchX:a(n.legL.pitchX,t.legL.pitchX),rollZ:a(n.legL.rollZ,t.legL.rollZ),kneeX:a(n.legL.kneeX,t.legL.kneeX)},legR:{pitchX:a(n.legR.pitchX,t.legR.pitchX),rollZ:a(n.legR.rollZ,t.legR.rollZ),kneeX:a(n.legR.kneeX,t.legR.kneeX)},pelvisX:a(n.pelvisX,t.pelvisX),pelvisY:a(n.pelvisY,t.pelvisY),pelvisRoll:a(n.pelvisRoll,t.pelvisRoll),sideLean:n.sideLean,armL:n.armL,armR:n.armR,strafe:n.strafe,backward:n.backward}}function f2(n,t){const e=In(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function p2(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return In(t.minScale+(1-t.minScale)*e)}function d0(){return u0()}function u0(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function m2(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function g2(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?In(t.forceHitHeight):n.type==="light"?In(t.hitHeight.light):n.type==="heavy"?In(t.hitHeight.heavy):n.type==="knock"?In(t.hitHeight.knock):0}function x2(n,t,e){const i=In(e),a=(s,o)=>s+(o-s)*i;return{upperPitch:a(n.upperPitch,t.upperPitch),upperRoll:a(n.upperRoll,t.upperRoll),upperYaw:a(n.upperYaw,t.upperYaw),fold:a(n.fold,t.fold),shift:a(n.shift,t.shift),drop:a(n.drop,t.drop),back:a(n.back,t.back),knee:a(n.knee,t.knee),hip:a(n.hip,t.hip),arm:a(n.arm,t.arm)}}function f0(n,t,e){const i=u0(),a=m2(n,e);if(i.intensity=a,a<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const s=In(1-n.timer/n.duration),o=h0(s,e.pulseRatio);i.pulse=o,i.active=o>0,i.hitHeight=g2(n,e);const r=Math.sin(t),c=Math.cos(t),l=Math.cos(t),h=-Math.sin(t),u=n.dirX*r+n.dirZ*c,d=n.dirX*l+n.dirZ*h;if(i.localFwd=u,i.localRight=d,!e.enabled){i.legacy=!0;const v=Math.sin(Math.PI*s);return i.upperPitch=a*v*u,i.upperRoll=-a*v*d*.7,i.drop=(a>.5?.09:.04)*v,i.flash=e.flashStrength*v,i.active=v>0,i}const f=a*o,m=x2(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=f*(m.upperPitch*u+m.fold),i.upperRoll=-f*m.upperRoll*d,i.upperYaw=f*m.upperYaw*d,i.upperShift=f*m.shift,i.upperShiftX=i.upperShift*d,i.upperShiftZ=i.upperShift*u,i.comShift=f*e.comShift,i.comX=i.comShift*d,i.comZ=i.comShift*u,i.pelvisBack=f*m.back,i.drop=f*m.drop,i.knee=f*m.knee,i.hip=f*m.hip,i.arm=f*m.arm,i.flash=e.flashStrength*o,i}function p0(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),a=Number.isFinite(n.leanForward)?n.leanForward:0,s=Number.isFinite(n.leanSide)?n.leanSide:0,o=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:a*e,pelvisRoll:s*e,pelvisX:-s*i,pelvisZ:a*i,crouch:Math.max(0,t.moveCrouch)*o}}const Fa=1e-6;function Io(n,t,e){return n<t?t:n>e?e:n}function m0(n,t,e,i=1){const a=t,s=e;if(!Number.isFinite(a)||!Number.isFinite(s)||a<=Fa||s<=Fa||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const r=a+s,c=Math.abs(a-s)+Fa,l=Math.hypot(n.x,n.y,n.z);if(l<=Fa)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const h=Math.atan2(n.x,-n.y),u=Math.hypot(n.x,n.y),d=n.z,f=Math.hypot(d,u),m=Io(f,c,r),v=f>r+Fa||f<c-Fa,g=Math.atan2(-d,Math.max(u,Fa)),p=Io((a*a+m*m-s*s)/(2*a*m),-1,1),_=Io((s*s+m*m-a*a)/(2*s*m),-1,1),x=Math.acos(p),y=Math.acos(_),S=i>=0?1:-1;return{rootPitch:g-S*x,rootRoll:h,jointPitch:S*(x+y),clamped:v,reach:l/r}}function g0(n,t,e,i){const a=Io(e,0,1),s=Math.max(0,i),o=(r,c)=>{const l=Io((c-r)*a,-s,s);return r+l};return{rootPitch:o(n.rootPitch,t.rootPitch),rootRoll:o(n.rootRoll,t.rootRoll),jointPitch:o(n.jointPitch,t.jointPitch)}}function x0(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const Sd={active:!1,weight:0,clamped:0,maxError:0};function v0(n){const{root:t,pelvis:e,lower:i,limbs:a,base:s,cfg:o}=n;if(!o.enabled||o.weight<=0||!n.grounded||a.length===0)return{...Sd};const r={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(s.pelvisPos),e.rotation.x=s.pelvisRotX,e.rotation.z=s.pelvisRotZ,i.position.copy(s.lowerPos),i.rotation.z=s.lowerRotZ,t.updateWorldMatrix(!0,!0);const c=a.map(f=>f.tip.getWorldPosition(new W));e.position.copy(r.pelvisPos),e.rotation.x=r.pelvisRotX,e.rotation.z=r.pelvisRotZ,i.position.copy(r.lowerPos),i.rotation.z=r.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const l=Math.max(0,Math.min(1,o.weight))*(n.attacking?Math.max(0,Math.min(1,o.attackScale)):1),h=Math.max(0,o.maxCorrectionDeg)*Math.PI/180;let u=0;for(let f=0;f<a.length;f++){const m=a[f],v=i.worldToLocal(c[f].clone()),g={x:v.x-m.root.position.x,y:v.y-m.root.position.y,z:v.z-m.root.position.z},p=m0(g,m.upperLen,m.lowerLen,m.bend);p.clamped&&(u+=1);const _=g0({rootPitch:m.root.rotation.x,rootRoll:m.root.rotation.z,jointPitch:m.joint.rotation.x},p,l,h);m.root.rotation.x=_.rootPitch,m.root.rotation.z=_.rootRoll,m.joint.rotation.x=_.jointPitch}t.updateWorldMatrix(!0,!0);let d=0;for(let f=0;f<a.length;f++){const m=a[f].tip.getWorldPosition(new W);d=Math.max(d,m.distanceTo(c[f]))}return{active:!0,weight:l,clamped:u,maxError:d}}function Nn(n,t,e){return n<t?t:n>e?e:n}function v2(n,t,e,i,a,s,o,r,c,l){const h=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},u=new ge,d=new ge;d.name="pelvis",d.position.y=n.legLength,u.add(d);const f=new ge;f.name="lower";const m=new ge;m.name="upper",d.add(f),d.add(m);const v=[],g=(K,st,Ot,Ft)=>{const Lt=new Oi({color:Ft}),F=new ve(new qn(K,st,Ot),Lt);return F.castShadow=!0,F.receiveShadow=!0,v.push(Lt),F},p=n.headSize,_=n.legLength,x=n.armLength,y=n.limbThickness,S=n.bodyHeight,w=n.bodyWidth,E=g(w,S,.28,e);E.position.y=S/2,m.add(E);const A=new ge;A.name="headPivot",A.rotation.order="YXZ",A.position.y=S,m.add(A);const b=g(p,p,p,e);b.position.y=p/2,A.add(b);for(const K of[-1,1]){const st=g(.06,.07,.02,t.shoe);st.position.set(K*.09,p/2+.03,p/2+.011),A.add(st)}const M=(K,st)=>{const Ot=st?x:_,Ft=new ge;Ft.name=st?K<0?"shoulderL":"shoulderR":K<0?"hipL":"hipR",st||(Ft.rotation.order="ZYX"),Ft.position.set(K*(st?w/2+y/2:w/2-y/2),st?S-.04:0,0),(st?m:f).add(Ft);const Lt=g(y,Ot/2,y,t.limb);Lt.position.y=-Ot/4,Ft.add(Lt);const F=new ge;F.name=st?"elbow":"knee",F.position.y=-Ot/2,Ft.add(F);const St=g(y,Ot/2,y,t.limb);if(St.position.y=-Ot/4,F.add(St),!st){const j=g(y*1.15,.07,y*1.7,t.shoe);j.position.set(0,-Ot/2+.035,.045),F.add(j);const ut=new tn;return ut.name="footTip",ut.position.y=-Ot/2,F.add(ut),{root:Ft,joint:F,tip:ut}}return{root:Ft,joint:F}},P=M(-1,!1),k=M(1,!1),D=M(-1,!0),z=M(1,!0),C=[P,k].map(K=>({root:K.root,joint:K.joint,tip:K.tip,upperLen:_/2,lowerLen:_/2,bend:1})),T=new xn({color:a.attackArcColor,transparent:!0,opacity:0,side:je,depthWrite:!1}),U=new ve(new Sc(.62,.042,6,20,Math.PI*1.1),T);U.position.set(0,.78-_,.56),m.add(U);const G=new Qt(e),Z=new Qt(r.flashColor),rt=new Qt;let pt=null,vt=0,dt=0,Y=0,N=0,X=0,$=0,q=0,ot={...Sd},Et=-1,Ht=0,tt=0,V=0,B=0,kt=0,Rt=0,Mt=0,mt=1,gt=0,Pt=0,L=0,R=0,Q=-1,ft=0,at="none",ht=0,zt=!1,Ct=-1,wt=!1,Xt=0,xt=0,It=1,J=1;return{group:u,boneAtWorld(K,st,Ot){const Ft=[{node:m,ax:0,ay:.05,az:0,bx:0,by:S,bz:0},{node:A,ax:0,ay:0,az:0,bx:0,by:p,bz:0},{node:D.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:D.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:z.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:z.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:P.root,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:P.joint,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:k.root,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:k.joint,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0}],Lt=new W,F=new W,St=new W(K,st,Ot),j=new W;let ut=null,Nt=Number.POSITIVE_INFINITY;for(const Dt of Ft){Dt.node.updateWorldMatrix(!0,!1),Lt.set(Dt.ax,Dt.ay,Dt.az),F.set(Dt.bx,Dt.by,Dt.bz),Dt.node.localToWorld(Lt),Dt.node.localToWorld(F);const qt=F.x-Lt.x,le=F.y-Lt.y,he=F.z-Lt.z,ee=qt*qt+le*le+he*he;let we=ee>1e-8?((St.x-Lt.x)*qt+(St.y-Lt.y)*le+(St.z-Lt.z)*he)/ee:0;we=Math.max(0,Math.min(1,we));const De=Lt.x+qt*we,Ve=Lt.y+le*we,Mn=Lt.z+he*we,Re=(St.x-De)**2+(St.y-Ve)**2+(St.z-Mn)**2;Re<Nt&&(Nt=Re,ut=Dt.node,j.set(De,Ve,Mn))}return ut?{node:ut,point:j.clone()}:null},update(K,st,Ot){const Ft=Ot===void 0||Q<0?st:Nn(Ot-Q,0,.1);Ot!==void 0&&(Q=Ot),u.position.set(K.position.x,K.position.y,K.position.z),u.rotation.y=K.bodyYaw,A.rotation.y=(K.headYaw-K.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,K.mode!==pt&&(pt=K.mode,vt=1),vt=Math.max(0,vt-st*2.2);const Lt=K.hurt,F=f0(Lt,K.bodyYaw,r),St=F.flash;rt.copy(Z).multiplyScalar(St);for(const fe of v)fe.emissive.copy(G).multiplyScalar(vt*.5),St>0&&fe.emissive.add(rt);d.position.set(0,_,0),d.rotation.set(0,0,0),m.position.set(0,0,0),m.rotation.set(0,0,0),f.position.set(0,0,0),f.rotation.z=0;const j=Math.hypot(K.velocity.x,K.velocity.z),ut=Nn(o.knockGaitScale??0,0,1),Nt=K.hurt.knockX*ut,Dt=K.hurt.knockZ*ut,qt=ut>0&&Math.hypot(K.hurt.knockX,K.hurt.knockZ)>.001,le=K.velocity.x+Nt,he=K.velocity.z+Dt,ee=Math.hypot(le,he),we=Math.cos(K.bodyYaw),De=-Math.sin(K.bodyYaw),Ve=j>1e-6?Nn((K.velocity.x*we+K.velocity.z*De)/j,-1,1):0,Mn=j>1e-6?Nn((K.velocity.x*Math.sin(K.bodyYaw)+K.velocity.z*Math.cos(K.bodyYaw))/j,-1,1):1,Re=bd(Mn,o.backStrafeStartDeg,o.backStrafeFullDeg);at==="settled"&&wt&&Xt>xt*1.02+1e-4&&(at="none");let Pe=1;at==="blend"?(Pe=c0(zt?Ct:ht,o.stopYawBlendMode,zt),zt||(ht=Math.min(1,ht+st/Math.max(.01,o.stopYawAfterSec)),(ht>=1||o.stopYawBlendMode==="inStop"||wt)&&(at="settled",Pe=0))):at==="settled"&&(Pe=Nn(j/Math.max(1e-6,o.stopEnterRatio*s),0,1));const fn=e0(Ve,o.strafeHipScale,o.strafeHipMaxDeg,o.strafeHipBoost),Rn=Ft>1e-6?Ge(K.bodyYaw-L)/Ft:0;L=K.bodyYaw;const nn=(o.hipYawTrackRateDeg??0)*Math.PI/180,En=(o.hipYawBackRateDeg??0)*Math.PI/180,Tn=Ft>1e-6?Ft:st;R=nn>0?Km(R,qm(Rn),Tn):0;const Xn=n0(Re,R),Vn=Nn(j/.5,0,1),wi=a0(Mn,Ve,fn,Xn)*Pe*Vn,Ei=Jm(Pt,wi,i0(nn,En,Xn),Tn,R);Pt=Ei,gt+=(Ei-gt)*(1-Math.exp(-12*Math.max(0,Tn))),f.rotation.y=gt;const pn=K.bodyYaw+gt,I=Math.sin(pn),nt=Math.cos(pn),lt=Math.cos(pn),ct=-Math.sin(pn),et=le*I+he*nt,Ut=le*lt+he*ct,Vt=Math.max(0,o.stopBlendSec||0),Zt=Vt>0&&!qt,$t=s0(j,ft,s,o.stopEnterRatio,o.stopExitRatio);if(!Zt||$t.resume)Et=-1;else if(Et<0&&$t.enter){Et=0,Ht=K.gaitPhase,tt=Qm(K.gaitPhase),V=j,B=Math.max(K.stride,1e-6),kt=et,Rt=Ut;const fe=1/Math.max(1e-6,j);Mt=K.velocity.x*fe,mt=K.velocity.z*fe}const se=ft;ft=j;const ne=Zt&&Et>=0;ne&&(Et=Math.min(1,Et+st/Vt)),ne&&at!=="blend"&&(at="blend",ht=0),zt=ne&&Et<1,Ct=Et,wt=$t.resume,Xt=j,xt=se;const jt=Math.max(0,o.dirFlipSec??0);jt>0?(It=dc(It,et>=0?1:-1,st,jt),J=dc(J,Ut>=0?1:-1,st,jt)):(It=et>=0?1:-1,J=Ut>=0?1:-1);const ue=ne?{phase:Ht,speed:V,moveSpeed:s,localForward:kt,localRight:Rt,dirF:It,dirR:J,legLength:n.legLength,stride:B,grounded:!0}:{phase:K.gaitPhase,speed:ee,moveSpeed:s,localForward:et,localRight:Ut,dirF:It,dirR:J,legLength:n.legLength,stride:K.stride,grounded:!0},ie=ne?t0(ue,o,{progress:Et,phase0:Ht,phaseEnd:tt}):uc(ue,o);let H=0,At=0,bt=0,_t=0;if(ne){const fe=r0(K.bodyYaw,Mt,mt),Ae=l0(Et,Ht,fe.forward,fe.right,o);Ae.leadLeft?(ie.legL.pitchX-=Ae.leadPitch,ie.legL.kneeX+=Ae.leadKnee,ie.legR.pitchX+=Ae.trailPitch):(ie.legR.pitchX-=Ae.leadPitch,ie.legR.kneeX+=Ae.leadKnee,ie.legL.pitchX+=Ae.trailPitch),At=Ae.bodyShift*Ae.fwdN,H=Ae.bodyShift*Ae.rightN,bt=Ae.bodyDip,_t=Ae.chestPitch}P.root.rotation.x=ie.legL.pitchX,k.root.rotation.x=ie.legR.pitchX,P.root.rotation.z=ie.legL.rollZ,k.root.rotation.z=ie.legR.rollZ,P.joint.rotation.x=ie.legL.kneeX,k.joint.rotation.x=ie.legR.kneeX,D.root.rotation.x=ie.armL,z.root.rotation.x=ie.armR,D.joint.rotation.x=-.18,z.joint.rotation.x=-.18,d.position.x=ie.pelvisX,d.position.y=_+ie.pelvisY,d.position.z=0,d.rotation.z=ie.pelvisRoll,m.rotation.z=ie.sideLean*(F.intensity>0?.4:1);const te=x0(d,f),Bt=ne&&h.enabled?{...h,weight:1}:h,oe=Bt.enabled&&Bt.weight>0?Nn(Bt.weight,0,1):0;if(d.position.x+=H,d.position.z+=At,d.position.y-=bt,f.position.y+=bt,oe<=0&&(f.position.x-=H,f.position.z-=At),c){const fe=Math.max(.004166666666666667,Math.min(st,.1)),Ae=Math.sin(K.bodyYaw),He=Math.cos(K.bodyYaw),hn=Nn((K.velocity.x-dt)/fe,-60,60),Pn=Nn((K.velocity.z-Y)/fe,-60,60),pi=hn*Ae+Pn*He,Ti=Ge(K.bodyYaw-N)/fe,mi=c.maxForwardDeg*Math.PI/180,ri=c.maxSideDeg*Math.PI/180,_n=1-Math.exp(-Math.max(0,c.smoothing)*fe);X+=(Nn(pi*c.accelGain,-mi,mi)-X)*_n,$+=(Nn(-Ti*j*c.turnGain,-ri,ri)-$)*_n;const mn=Number.isFinite(c.crouchSmoothing)?c.crouchSmoothing:8;q+=(Nn(j/Math.max(s,1e-6),0,1)-q)*(1-Math.exp(-Math.max(0,mn)*fe));const Wn=p0({leanForward:X,leanSide:$,speedRatio:q},c);m.rotation.x+=X+_t,m.rotation.z+=$,d.rotation.x+=Wn.pelvisPitch,d.rotation.z+=Wn.pelvisRoll,d.position.x+=Wn.pelvisX,d.position.z+=Wn.pelvisZ,d.position.y-=Wn.crouch,f.position.y+=Wn.crouch*(1-oe)}dt=K.velocity.x,Y=K.velocity.z,N=K.bodyYaw,m.rotation.x+=F.upperPitch,m.rotation.z+=F.upperRoll,m.rotation.y+=F.upperYaw;const ke=Nn(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),be=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;m.position.x+=Nn(F.upperShiftX*ke,-be,be),m.position.z+=Nn(F.upperShiftZ*ke,-be,be),d.position.x+=F.comX,d.position.z+=F.comZ-F.pelvisBack,d.position.y-=F.drop;const Oe=F.legacy?0:Math.max(0,Math.min(1,r.lowerScale));if(f.position.z+=F.pelvisBack*(1-Oe),f.position.y+=F.drop*(1-Oe),P.joint.rotation.x+=F.knee,k.joint.rotation.x+=F.knee,P.root.rotation.x-=F.hip,k.root.rotation.x-=F.hip,D.root.rotation.x+=F.arm,z.root.rotation.x+=F.arm*.8,K.attackPhase!=="idle"&&F.intensity===0){const fe=K.attackProgress,Ae=fe<.34?-1:fe<.68?-1+(fe-.34)/.34*2:Math.max(0,1-(fe-.68)/.32),He=Math.max(0,-Ae),hn=Math.max(0,Ae);z.root.rotation.x=-1.7*He+1.25*hn,z.joint.rotation.x=-(.25+He*.45),m.rotation.y=-.28*Ae,T.opacity=K.attackPhase==="active"?.85:0,K.attackPhase==="active"&&(U.rotation.z=-1.1+fe*3)}else T.opacity=0;const xe=o0(gt,o.chestYawScale,o.chestYawMaxDeg);m.rotation.y+=xe,A.rotation.y=(K.headYaw-K.bodyYaw-xe+Math.PI*3)%(Math.PI*2)-Math.PI,ot=v0({root:u,pelvis:d,lower:f,limbs:C,base:te,cfg:Bt,grounded:!0,attacking:K.attackPhase!=="idle"})},ik(){return ot},dispose(){u.traverse(K=>{if(K instanceof ve){K.geometry.dispose();const st=K.material;Array.isArray(st)?st.forEach(Ot=>Ot.dispose()):st.dispose()}})}}}const y2=9.81;function wo(n,t,e){return n<t?t:n>e?e:n}function M2(n,t,e,i,a){const s=a!=null&&a.gravity&&a.gravity>0?a.gravity:y2,o={comX:0,comY:0,comZ:0,xcomX:0,xcomZ:0,centerX:0,centerZ:0,halfX:0,halfZ:0,marginX:1,marginZ:1,score:1,leanDeg:0,side:0,overX:0,overZ:0,grounded:!1};let r=0,c=0,l=0,h=0;for(const b of n){const M=Number.isFinite(b.mass)&&b.mass>0?b.mass:0;!Number.isFinite(b.x)||!Number.isFinite(b.y)||!Number.isFinite(b.z)||(r+=M,c+=b.x*M,l+=b.y*M,h+=b.z*M)}if(r<=1e-6)return o;c/=r,l/=r,h/=r;const u=Math.max(.02,(t.maxX-t.minX)/2),d=Math.max(.02,(t.maxZ-t.minZ)/2),f=(t.minX+t.maxX)/2,m=(t.minZ+t.maxZ)/2;if(!(t.maxX-t.minX>.03&&t.maxZ-t.minZ>.03))return{...o,comX:c,comY:l,comZ:h,centerX:f,centerZ:m,halfX:u,halfZ:d};const g=wo((a==null?void 0:a.reactionTime)??.18,.02,1),p=Math.sqrt(Math.max(.05,l)/s)*g*4,_=c+(Number.isFinite(e)?e:0)*p,x=h+(Number.isFinite(i)?i:0)*p,y=Math.abs(_-f)/u,S=Math.abs(x-m)/d,w=wo(1-Math.max(y,S),0,1),E=Math.max(0,Math.abs(_-f)-u),A=Math.max(0,Math.abs(x-m)-d);return{comX:c,comY:l,comZ:h,xcomX:_,xcomZ:x,centerX:f,centerZ:m,halfX:u,halfZ:d,marginX:wo(1-y,-1,1),marginZ:wo(1-S,-1,1),score:w,leanDeg:Math.atan2(_-f,x-m)*180/Math.PI,side:y>.98?_>f?1:-1:0,overX:E,overZ:A,grounded:!0}}function _2(n,t,e){if(!Number.isFinite(n))return 0;if(!Number.isFinite(t)||!(e>0))return n;const i=n+t*e;return n!==0&&Math.sign(i)!==Math.sign(n)?0:Math.abs(i)>Math.abs(n)?i:n}function b2(n,t,e){const i=Math.max(0,n);if(!(e>0))return i;const a=wo(Number.isFinite(t)?t:0,0,2);return i*(1+e*a)}const Xh={arm:1,leg:1,torso:1,girthArm:1,girthLeg:1,girthTorso:1},S2=1e-6;function ai(n,t,e){return n<t?t:n>e?e:n}function Pl(n,t){const e=Math.max(.2,n);return ai(Math.pow(e,-t),.5,2)}function w2(n,t){if(!t.enabled)return{...Xh};const e=ai(n.swing,-1,1),i=ai(n.charge,0,1),a=ai(n.impact,0,1),s=ai(n.speedRatio,0,1),o=Math.max(0,e),r=1-(1-o)*(1-o),c=1+(Math.max(1,t.swingArm)-1)*r,l=Math.max(0,-e),h=ai(t.chargeArm,.6,1),u=1-(1-h)*l,d=1-(1-h)*i;let f=1;o>0?f=c:l>0?f=u:i>0&&(f=d);const m=1-ai(t.impactSquash,0,.6)*a;f*=m;const v=Math.max(1,t.runLeg),p=(n.grounded?1+(v-1)*s:1)*(1-ai(t.impactSquash,0,.6)*a*.6),_=ai(t.torsoGain,0,1),x=1+(f-1)*_;return f=ai(f,.6,1.6),{arm:f,leg:ai(p,.6,1.4),torso:ai(x,.7,1.4),girthArm:Pl(f,t.volumeExp),girthLeg:Pl(p,t.volumeExp),girthTorso:Pl(x,t.volumeExp)}}function E2(n,t,e,i){const a=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),s=(o,r)=>o+(r-o)*a;return{arm:s(n.arm,t.arm),leg:s(n.leg,t.leg),torso:s(n.torso,t.torso),girthArm:s(n.girthArm,t.girthArm),girthLeg:s(n.girthLeg,t.girthLeg),girthTorso:s(n.girthTorso,t.girthTorso)}}function T2(n,t,e){const i=n*Math.exp(-Math.max(S2,e)*Math.max(0,t));return i<.001?0:ai(i,0,1)}const lp=[{yaw:.85,pitch:-.12,roll:-.14,pz:-.06,px:.045,ap:-1.2,ay:-.42,ar:.16,el:-.48,blade:.3},{yaw:-.95,pitch:.14,roll:.17,pz:.1,px:-.05,ap:-1.46,ay:-.6,ar:-.1,el:-.14,blade:-.05},{yaw:-.75,pitch:-.08,roll:.14,pz:-.04,px:-.04,ap:-1.28,ay:-.58,ar:-.12,el:-.5,blade:.3},{yaw:.92,pitch:.15,roll:-.18,pz:.1,px:.05,ap:-1.48,ay:-.4,ar:.12,el:-.13,blade:-.05},{yaw:.12,pitch:-.32,roll:-.05,pz:-.07,px:0,ap:-1.9,ay:-.3,ar:.16,el:-.55,blade:1.3},{yaw:0,pitch:.55,roll:.02,pz:.13,px:0,ap:.05,ay:-.2,ar:0,el:-.1,blade:-.55}];function Bs(n,t,e){return n<t?t:n>e?e:n}function Be(n,t,e){return n+(t-n)*e}function A2(n){return n?typeof n=="string"?{clip:n}:n:null}function R2(){return{bodyYaw:0,bodyPitch:0,bodyRoll:0,pelvisX:0,pelvisZ:0,armPitch:0,armYaw:0,armRoll:0,elbow:0,bladePitch:0,armLPitch:0,armLYaw:0,armLRoll:0,elbowL:0,rootYaw:0,bladePitchOff:0,bladeTwist:0,bladeTwistOff:0,bladeYaw:0,bladeYawOff:0}}function P2(n,t){const e=n%3*2,i=lp[e],a=lp[e+1];return{...R2(),bodyYaw:Be(i.yaw,a.yaw,t),bodyPitch:Be(i.pitch,a.pitch,t),bodyRoll:Be(i.roll,a.roll,t),pelvisX:Be(i.px,a.px,t),pelvisZ:Be(i.pz,a.pz,t),armPitch:Be(i.ap,a.ap,t),armYaw:Be(i.ay,a.ay,t),armRoll:Be(i.ar,a.ar,t),elbow:Be(i.el,a.el,t),bladePitch:Be(i.blade,a.blade,t)}}function C2(n,t,e,i,a=0){var b,M,P;const s=((b=i.combo)==null?void 0:b[n])??[],o=Math.max(1,s.length),r=(((Math.round(t)||1)-1)%o+o)%o,c=A2(s[r]),l=c?((M=i.clips)==null?void 0:M[c.clip])??null:null,h=Bs(((P=i.weaponScale)==null?void 0:P[n])??1,0,2),u=Number.isFinite(i.bodyScale)?Math.max(0,i.bodyScale):1,d=c&&Number.isFinite(c.scale)?c.scale:h,f=d*u,m=Bs((e+1)/2,0,1),v=l&&l.keys.length>0?Mv(l,m):P2(r,m),g=((c==null?void 0:c.lead)??(l==null?void 0:l.lead)??"R")==="L"?"L":"R",p=(l==null?void 0:l.kind)??["right-left","left-right","overhead"][r]??"custom",_=n==="dual-swords",x=l&&Ra(l,"bladeTwistOff")?v.bladeTwistOff:_?v.bladeTwist:0,y=l&&Ra(l,"bladeYawOff")?v.bladeYawOff:-v.bladeYaw,S={yaw:v.bodyYaw*f,rootYaw:v.rootYaw*f,spinYaw:_v(l,Bs(a,0,1)),pitch:v.bodyPitch*f,roll:v.bodyRoll*f,pelvisZ:v.pelvisZ*f,pelvisX:v.pelvisX*f,armR:null,armL:null,bladePitch:v.bladePitch,bladePitchOff:l&&Ra(l,"bladePitchOff")?v.bladePitchOff:null,bladeTwist:v.bladeTwist,bladeTwistOff:x,bladeYaw:v.bladeYaw,bladeYawOff:y,lead:g,kind:p,strike:m,blend:c&&Number.isFinite(c.blend)?c.blend:null},w={pitch:v.armPitch*d,yaw:v.armYaw*d,roll:v.armRoll*d,elbow:v.elbow*d},E=l?Ra(l,"armLPitch")||Ra(l,"armLYaw")||Ra(l,"armLRoll")||Ra(l,"elbowL"):!1,A=E?{pitch:v.armLPitch*d,yaw:v.armLYaw*d,roll:v.armLRoll*d,elbow:v.elbowL*d}:{pitch:w.pitch+(n==="greatsword"?.08:.1),yaw:w.yaw*.8,roll:n==="greatsword"?.4:-w.roll*.6,elbow:w.elbow};return g==="L"?(S.armL=w,S.armR=n==="greatsword"?null:A):(S.armR=w,(n==="greatsword"||n==="dual-swords"||E)&&(S.armL=A)),S}function D2(n,t,e){const i=Bs(e,0,1),a=(s,o)=>s?o?{pitch:Be(s.pitch,o.pitch,i),yaw:Be(s.yaw,o.yaw,i),roll:Be(s.roll,o.roll,i),elbow:Be(s.elbow,o.elbow,i)}:null:o;return{yaw:Be(n.yaw,t.yaw,i),rootYaw:Be(n.rootYaw,t.rootYaw,i),spinYaw:t.spinYaw,pitch:Be(n.pitch,t.pitch,i),roll:Be(n.roll,t.roll,i),pelvisZ:Be(n.pelvisZ,t.pelvisZ,i),pelvisX:Be(n.pelvisX,t.pelvisX,i),armR:a(n.armR,t.armR),armL:a(n.armL,t.armL),bladePitch:n.bladePitch===null||t.bladePitch===null?i<.5?n.bladePitch:t.bladePitch:Be(n.bladePitch,t.bladePitch,i),bladePitchOff:n.bladePitchOff===null||t.bladePitchOff===null?i<.5?n.bladePitchOff:t.bladePitchOff:Be(n.bladePitchOff,t.bladePitchOff,i),bladeTwist:Be(n.bladeTwist,t.bladeTwist,i),bladeTwistOff:Be(n.bladeTwistOff,t.bladeTwistOff,i),bladeYaw:Be(n.bladeYaw,t.bladeYaw,i),bladeYawOff:Be(n.bladeYawOff,t.bladeYawOff,i),lead:t.lead,kind:t.kind,strike:Be(n.strike,t.strike,i),blend:t.blend??null}}function L2(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function hp(n,t){return!n||!t?n||t?.6:0:Math.abs(n.pitch-t.pitch)*1+Math.abs(n.yaw-t.yaw)*.8+Math.abs(n.roll-t.roll)*.6+Math.abs(n.elbow-t.elbow)*.8}function k2(n,t){const e=(a,s)=>Math.abs(L2(a-s));let i=0;return i+=e(n.yaw,t.yaw)*1,i+=e(n.rootYaw,t.rootYaw)*.7,i+=e(n.pitch,t.pitch)*.9,i+=e(n.roll,t.roll)*.9,i+=Math.abs(n.pelvisX-t.pelvisX)*2,i+=Math.abs(n.pelvisZ-t.pelvisZ)*2,i+=hp(n.armR,t.armR),i+=hp(n.armL,t.armL)*.8,i+=e(n.bladePitch??0,t.bladePitch??0)*1.1,i+=e(n.bladePitchOff??0,t.bladePitchOff??0)*.7,i+=e(n.bladeTwist,t.bladeTwist)*.5,i+=e(n.bladeYaw,t.bladeYaw)*.5,i}function I2(n,t,e,i,a){if(i!=null&&Number.isFinite(i)&&i>=0)return Math.max(.008,i);const s=Math.max(.008,e.segBlend??.1);if(!n)return s;const o=Math.max(.008,e.segBlendMin??.03),r=Math.max(o,Number.isFinite(a)?a:e.segBlendMax??.14),c=Math.max(.1,e.segBlendRef??6),l=Bs(k2(n,t)/c,0,1);return o+(r-o)*l}function dp(n){const t=Bs(n,0,1);return t*t*(3-2*t)}function Xe(n,t,e,i){const a=new ve(new qn(n,t,e),new Oi({color:i}));return a.castShadow=!0,a.receiveShadow=!0,a}function Je(){return new ge}function Zr(n,t,e){const i=Je(),a=Xe(t*.7,.12,t*.7,e.wood);a.position.y=.06,i.add(a);const s=Xe(t*2.4,.045,t*.8,e.metal);s.position.y=.13,i.add(s);const o=Xe(t*.38,n,t,e.blade);o.position.y=.13+n/2,i.add(o);const r=Xe(t*.42,n*.96,t*.2,e.bladeEdge);r.position.set(0,.13+n/2,t*.5),i.add(r);const c=Xe(t*.3,.09,t*.45,e.blade);return c.position.y=.13+n+.045,i.add(c),i}function z2(n){const t=Zr(.72,.15,n),e=Xe(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function F2(n){const t=Je(),e=Xe(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=Xe(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function U2(n){const t=Je(),e=Xe(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=Xe(.15,.15,.15,n.glow);i.position.y=.92;const a=i.material;return a.emissive=new Qt(n.glow),a.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function N2(n){const t=Je();for(let i=0;i<5;i++){const a=(i-2)*.15,s=Xe(.055,.16,.05,n.wood);s.position.set(.16-Math.abs(a)*.46,a,0),t.add(s)}const e=Xe(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function O2(n){const t=Je(),e=Xe(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=Xe(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function me(n,t,e){return n<t?t:n>e?e:n}const ji=1e-6;function y0(n,t,e,i,a,s,o,r,c,l,h,u,d){const f=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},m=u??{enabled:!1,lag:.022,maxAngle:.62,rate:26,twistLag:.018,maxTwist:.45,runDrag:0},v=h??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},g=c.stretch??{enabled:!1,swingArm:1,chargeArm:1,runLeg:1,torsoGain:0,impactSquash:0,impactDecay:12,volumeExp:.5,smoothing:26},p=c.swing??{enabled:!1,bodyScale:1,shoulderLift:.045,shoulderPush:.035,shoulderIn:.03,segBlend:.1,weaponScale:{greatsword:1,"sword-shield":.62,"dual-swords":.55}},_=Je(),x=Je();x.name="pelvis",x.position.y=n.legLength,_.add(x);const y=Je();y.name="lower";const S=Je();S.name="upper",x.add(y),x.add(S);const w=n.headSize,E=n.legLength,A=n.armLength,b=n.limbThickness,M=n.bodyHeight,P=n.bodyWidth,k=c.spine,D=!!(k!=null&&k.enabled),z=D?me(k.chestPivot??.42,.15,.85)*M:0,C=Je();C.name="chest",C.position.y=z,S.add(C);const T=D?C:S;let U,G=null,Z=M,rt=0;D?(Z=Math.max(.05,z),rt=Math.max(.05,M-z),U=Xe(P,Z,.28,t.body),U.name="torsoLower",U.position.y=Z/2,S.add(U),G=Xe(P+.008,rt,.288,t.body),G.name="torsoUpper",G.position.y=rt/2,C.add(G)):(U=Xe(P,M,.28,t.body),U.name="torso",U.position.y=M/2,S.add(U));const pt=Je();pt.name="headPivot",pt.rotation.order="YXZ",pt.position.y=Math.min(i.headPivotHeight,M)-z,T.add(pt);const vt=Xe(w,w,w,t.head);vt.position.y=w/2,pt.add(vt);const dt=new Oi({color:"#1b2733"});for(const O of[-1,1]){const it=new ve(new qn(.06,.07,.02),dt);it.position.set(O*.09,w/2+.03,w/2+.011),pt.add(it)}const Y=O=>{const it=Je();it.name=O<0?"hipL":"hipR",it.rotation.order="ZYX",it.position.set(O*(P/2-b/2),0,0),y.add(it);const yt=Xe(b,E/2,b,t.limb);yt.position.y=-E/4,it.add(yt);const Tt=Je();Tt.name="knee",Tt.position.y=-E/2,it.add(Tt);const Kt=Xe(b,E/2,b,t.limb);Kt.position.y=-E/4,Tt.add(Kt);const Jt=Xe(b*1.15,.07,b*1.7,t.shoe);Jt.position.set(0,-E/2+.035,.045),Tt.add(Jt);const re=new tn;re.name="footTip",re.position.y=-E/2,Tt.add(re);const Se=Je();return{root:it,joint:Tt,hand:Se,wrist:Se,tip:re,upperMesh:yt,lowerMesh:Kt,segLen:E/2}},N=O=>{const it=Je();it.name=O<0?"shoulderL":"shoulderR",it.rotation.order="YXZ",it.position.set(O*(P/2+b/2),M-.04-z,0),T.add(it);const yt=Xe(b,A/2,b,t.limb);yt.position.y=-A/4,it.add(yt);const Tt=Je();Tt.name="elbow",Tt.position.y=-A/2,it.add(Tt);const Kt=Xe(b,A/2,b,t.limb);Kt.position.y=-A/4,Tt.add(Kt);const Jt=Je();Jt.name=O<0?"handL":"handR",Jt.position.y=-A/2,Tt.add(Jt);const re=Xe(b*1.1,.09,b*1.1,t.head);re.position.y=.045,Jt.add(re);const Se=Je();return Se.name=O<0?"wristL":"wristR",Jt.add(Se),{root:it,joint:Tt,hand:Jt,wrist:Se,upperMesh:yt,lowerMesh:Kt,segLen:A/2}},X=Y(-1),$=Y(1),q=N(-1),ot=N(1),Et=[X,$].map(O=>({root:O.root,joint:O.joint,tip:O.tip,upperLen:E/2,lowerLen:E/2,bend:1})),Ht=Je(),tt=Je();Ht.name="mountR",tt.name="mountL";const V=Je(),B=Je();V.name="gripR",B.name="gripL",ot.wrist.add(Ht),q.wrist.add(tt),Ht.add(V),tt.add(B);const kt=U2(t),Rt=N2(t),Mt=O2(t),mt={"sword-shield":{right:Zr(.42,.075,t),left:F2(t)},"dual-swords":{right:Zr(.42,.075,t),left:Zr(.42,.075,t)},greatsword:{right:z2(t),left:Xe(.12,.2,.12,t.wood)},staff:{right:kt.g,left:Je(),orb:kt.orb},bow:{right:Mt,left:Rt.g,arrow:Mt,drawString:Rt.drawString}};for(const O of Object.keys(mt))V.add(mt[O].right),B.add(mt[O].left),mt[O].right.visible=!1,mt[O].left.visible=!1;function gt(O,it,yt){const Tt=new tn;Tt.name="bladeBase",Tt.position.y=it,O.add(Tt);const Kt=new tn;Kt.name="bladeTip",Kt.position.y=yt,O.add(Kt)}gt(mt["sword-shield"].right,.44,.55),gt(mt["dual-swords"].right,.44,.55),gt(mt["dual-swords"].left,.44,.55),gt(mt.greatsword.right,.74,.88),gt(mt.staff.right,.78,.92);let Pt=null,L=null,R=1,Q=0,ft=0,at=null,ht=0,zt=0,Ct=0,wt=0,Xt=0,xt=0,It=d0(),J={...Sd},K=0,st=0,Ot=0,Ft=0,Lt=0,F=-1,St=-1,j=0,ut=0,Nt=0,Dt=0,qt=0,le=0,he=0,ee=1,we=0,De=0,Ve=0,Mn=0,Re=!1,Pe=0,fn=-1,Rn=0,nn=0,En=0,Tn=!1,Xn=0,Vn=0,wi=0,Ei=0,pn="none",I=0,nt=1,lt=!1,ct=-1,et=!1,Ut=0,Vt=0,Zt=0,$t={...Xh},se=0,ne=0,jt={active:!1,dist:0,gy:0,pitch:0,joint:0,grip:1},ue=NaN,ie=0,H=0,At=0,bt=NaN,_t=NaN,te=-1,Bt=null,oe=null,ke=0,be=1,Oe=.1,xe=null,fe={lx:0,ly:0,lz:0,rx:0,ry:0,rz:0},Ae=null,He=null,hn=null,Pn=null,pi=null,Ti=null,mi="R",ri=0,_n=0,mn=0,Wn=0,Qs=1,Kn=0,ce=null,Gt=0,de=0,rn=NaN,bn=NaN,Hi={speed:0,phase:0},Cn=1,ci=1,wa={lp:0,lr:0,rp:0,rr:0},Ea=0,ts=0,es=!0,ns=0,Ta="none",is=0,as=0,ss=0,Zo=.3,Td=0;function S0(O){const it=Math.PI/180,yt=s;let Tt=0,Kt=0,Jt=0,re=0;O==="sword-shield"?(Tt=yt.swordPitchDeg*it,Jt=yt.shieldPitchDeg*it):O==="dual-swords"?(Tt=yt.swordPitchDeg*it,Jt=yt.swordPitchDeg*it):O==="greatsword"?(Tt=yt.greatswordPitchDeg*it,Jt=yt.greatswordPitchDeg*it):O==="staff"?Tt=yt.staffPitchDeg*it:Jt=yt.bowPitchDeg*it,Ht.rotation.set(Tt,0,Kt),tt.rotation.set(Jt,0,re),Ht.position.x=O==="greatsword"?-Math.max(0,s.twoHandInsetX??0):0}function Ad(O){if(O!==Pt){Pt=O;for(const it of Object.keys(mt))mt[it].right.visible=it===O,mt[it].left.visible=it===O;S0(O),Rt.drawString.position.z=-.06,Mt.position.z=0,kt.orb.scale.setScalar(1),S.rotation.y=0}}Ad("sword-shield");const Rd=[];_.traverse(O=>{O instanceof ve&&O.material instanceof Oi&&Rd.push(O.material)});const w0=new Qt(r.flashColor);function E0(O,it){const yt=f0(O,it,r);It=yt,S.rotation.x+=yt.upperPitch,S.rotation.z+=yt.upperRoll,S.rotation.y+=yt.upperYaw;const Tt=me(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),Kt=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;S.position.x+=me(yt.upperShiftX*Tt,-Kt,Kt),S.position.z+=me(yt.upperShiftZ*Tt,-Kt,Kt),x.position.x+=yt.comX,x.position.z+=yt.comZ-yt.pelvisBack,x.position.y-=yt.drop;const Jt=yt.legacy?0:me(r.lowerScale,0,1);y.position.z+=yt.pelvisBack*(1-Jt),y.position.y+=yt.drop*(1-Jt),X.joint.rotation.x+=yt.knee,$.joint.rotation.x+=yt.knee,X.root.rotation.x-=yt.hip,$.root.rotation.x-=yt.hip,q.root.rotation.x+=yt.arm,ot.root.rotation.x+=yt.arm*.8;for(const re of Rd)re.emissive.copy(w0).multiplyScalar(yt.flash)}function jo(O){return O<.22?-1:O<.42?-1+(O-.22)/.2*2:O<.5?1:Math.max(0,1-(O-.5)/.5)}function T0(O){for(const it of[q,ot])it.upperMesh.scale.set(O.girthArm,O.arm,O.girthArm),it.upperMesh.position.y=-it.segLen/2*O.arm,it.joint.position.y=-it.segLen*O.arm,it.lowerMesh.scale.set(O.girthArm,O.arm,O.girthArm),it.lowerMesh.position.y=-it.segLen/2*O.arm,it.hand.position.y=-it.segLen*O.arm;for(const it of[X,$])it.upperMesh.scale.set(O.girthLeg,O.leg,O.girthLeg),it.upperMesh.position.y=-it.segLen/2*O.leg,it.joint.position.y=-it.segLen*O.leg,it.lowerMesh.scale.set(O.girthLeg,O.leg,O.girthLeg),it.lowerMesh.position.y=-it.segLen/2*O.leg,it.tip.position.y=-it.segLen*O.leg;U.scale.set(O.girthTorso,O.torso,O.girthTorso),U.position.y=Z/2*O.torso,G&&(G.scale.set(O.girthTorso,O.torso,O.girthTorso),G.position.y=rt/2*O.torso,C.position.y=Z*O.torso)}function A0(O,it){const yt=s.twoHandGripY??-.16,Tt=Math.max(1,s.twoHandMaxStretch??1.25),Kt=A*Tt*.99,Jt=q.root.position.x,re=q.root.position.y,Se=q.root.position.z,We=q.root.rotation.y,ye=Math.cos(We),cn=Math.sin(We),Ke=Gi=>{const no=Ht.localToWorld(new W(0,Gi,0)),io=(D?C:S).worldToLocal(no),ao=io.x-Jt,Yn=io.y-re,os=io.z-Se,rs={x:ao*ye-os*cn,y:Yn,z:ao*cn+os*ye};return{t:rs,dist:Math.hypot(rs.x,rs.y,rs.z)}};let Ye=yt,Ee=Ke(Ye);if(!Number.isFinite(Ee.dist)||Ee.dist<=ji)return;for(let Gi=0;Gi<18&&Ee.dist>Kt;Gi++)if(Ye*=.78,Ee=Ke(Ye),!Number.isFinite(Ee.dist)||Ee.dist<=ji)return;Number.isFinite(ue)||(ue=Ye);const an=Math.max(0,s.twoHandSlideRate??9);ue+=(Ye-ue)*(1-Math.exp(-an*it));const ln=Ke(ue),gn=ln.t,Jn=ln.dist,Qn=Jn/Math.max(ji,A),li=me(Qn,1,Tt),Ai=Math.max(1,s.twoHandGripStart??1.02),ia=Math.max(Ai+.001,Tt),aa=me(s.twoHandMinGrip??1,0,1),ti=me((Qn-Ai)/(ia-Ai),0,1),Ri=1-ti*ti*(3-2*ti)*(1-aa),ei=A/2*li,eo=m0(gn,ei,ei,-1),sa=g0({rootPitch:q.root.rotation.x,rootRoll:q.root.rotation.z,jointPitch:q.joint.rotation.x},eo,me(O*Ri,0,1),Math.PI);q.root.rotation.x=sa.rootPitch,q.root.rotation.z=sa.rootRoll,q.joint.rotation.x=Math.min(sa.jointPitch,-.06);const hi=1/Math.sqrt(li);q.upperMesh.scale.set(hi,li,hi),q.upperMesh.position.y=-ei/2,q.joint.position.y=-ei,q.lowerMesh.scale.set(hi,li,hi),q.lowerMesh.position.y=-ei/2,q.hand.position.y=-ei,jt={active:!0,dist:Jn,gy:ue,pitch:sa.rootPitch,joint:q.joint.rotation.x,grip:Ri}}function R0(O,it){if(!m.enabled){ie=0,H=0,ot.wrist.rotation.set(0,0,0),bt=ot.root.rotation.x,_t=kd();return}const yt=ot.root.rotation.x,Tt=kd();if(it!==te){te=it,bt=yt,_t=Tt,ot.wrist.rotation.set(ie,0,H);return}if(!Number.isFinite(bt)||O<=1e-5){bt=yt,_t=Tt,ot.wrist.rotation.set(ie,0,H);return}const Kt=(yt-bt)/O,Jt=Ge(Tt-_t)/O;bt=yt,_t=Tt;const re=Math.max(0,m.maxAngle),Se=Math.max(0,m.maxTwist),We=.15+.85*me(_n,0,1),cn=-me(At,0,1.4)*Math.max(0,m.runDrag),Ke=me(-Kt*m.lag*We+cn,-re,re),Ye=me(Jt*m.twistLag*We,-Se,Se),Ee=1-Math.exp(-Math.max(0,m.rate)*O);ie+=(Ke-ie)*Ee,H+=(Ye-H)*Ee,ot.wrist.rotation.set(ie,0,H)}function P0(O){const it=Math.PI/180;return O==="greatsword"?s.greatswordPitchDeg*it:O==="staff"?s.staffPitchDeg*it:O==="bow"?s.bowPitchDeg*it:s.swordPitchDeg*it}function wc(O){const it=Math.PI/180;return O==="sword-shield"?s.shieldPitchDeg*it:O==="greatsword"?s.greatswordPitchDeg*it:O==="bow"?s.bowPitchDeg*it:s.swordPitchDeg*it}function C0(O){const it=Math.PI/180;return O==="sword-shield"||O==="dual-swords"?(s.swordCantDeg??0)*it:O==="greatsword"?(s.greatswordCantDeg??0)*it:0}function D0(O,it){const yt=O.weapon;if(yt==="staff"||yt==="bow")return;const Tt=mi==="R",Kt=Tt?ot:q,Jt=Tt?Ht:tt,re=Tt?q:ot,Se=Tt?tt:Ht,We=yt==="greatsword"&&Tt?xt:0,ye=yt==="greatsword"?s.greatswordYawDeg:s.swordYawDeg,cn=Math.PI/180,Ke=-ye*cn,Ye=ye*cn,Ee=(ti,Ri)=>{const ei=Math.max(0,Math.PI/2-Math.abs(Ri));return Math.sign(ti)*Math.min(Math.abs(ti),ei)},an=(Ae??P0(yt)+Q)+We,ln=it+Kt.root.rotation.x+Kt.joint.rotation.x;Jt.rotation.set(Math.PI/2-an-ln,0,Ee(Tt?Ke:Ye,an));const gn=He??(yt==="sword-shield"?null:wc(yt)+ft),Jn=it+re.root.rotation.x+re.joint.rotation.x;yt==="sword-shield"?Se.rotation.x=gn===null?wc(yt):wc(yt)-gn-Jn:Se.rotation.set(Math.PI/2-(gn??0)-Jn,0,Ee(Tt?Ye:Ke,gn??0));const Qn=C0(yt),li=pi??0,Ai=Ti??0,ia=hn??0,aa=Pn??0;Tt?(V.rotation.z=-Qn+li,V.rotation.y=ia,B.rotation.z=Qn+Ai,B.rotation.y=aa):(B.rotation.z=Qn+li,B.rotation.y=ia,V.rotation.z=-Qn+Ai,V.rotation.y=aa)}function Pd(O){Ae=O.bladePitch,He=O.bladePitchOff,hn=O.bladeTwist,Pn=O.bladeTwistOff,pi=O.bladeYaw,Ti=O.bladeYawOff,mi=O.lead,ri=O.rootYaw+O.spinYaw,_.rotation.y=ri,S.rotation.y+=O.yaw,S.rotation.x+=O.pitch,S.rotation.z+=O.roll,x.position.z+=O.pelvisZ,x.position.x+=O.pelvisX,O.armR&&(ot.root.rotation.x=O.armR.pitch,ot.root.rotation.y=O.armR.yaw,ot.root.rotation.z=O.armR.roll,ot.joint.rotation.x=O.armR.elbow),O.armL&&(q.root.rotation.x=O.armL.pitch,q.root.rotation.y=O.armL.yaw,q.root.rotation.z=O.armL.roll,q.joint.rotation.x=O.armL.elbow)}function Cd(O,it){const yt=xe??jo(O.attackProgress),Tt=C2(O.weapon,O.comboIndex,yt,p,O.attackProgress);if(O.comboIndex!==ke){oe=Bt,be=0,ke=O.comboIndex;const re=O.timings.windup+O.timings.active+O.timings.recovery,Se=Math.max(p.segBlendMin??.03,re*.22);Oe=I2(oe,Tt,p,Tt.blend??null,Se)}const Kt=Math.max(.008,Oe);be=Math.min(1,be+it/Kt);const Jt=oe&&be<1?D2(oe,Tt,dp(be)):Tt;return Bt=Jt,Jt}function L0(O,it){const yt=P/2+b/2,Tt=M-.04-z;if(!p.enabled){q.root.position.set(-yt,Tt,0),ot.root.position.set(yt,Tt,0),fe={lx:-yt,ly:Tt,lz:0,rx:yt,ry:Tt,rz:0};return}const Kt=Math.max(0,p.shoulderLift),Jt=Math.max(0,p.shoulderPush),re=O&&it==="greatsword"?Math.max(0,p.shoulderIn):0,Se=ln=>Kt*me((-ln-.5)/1.45,0,1),We=ln=>Jt*me((-ln-.2)/1.9,0,1),ye=-yt+re,cn=Tt+Se(q.root.rotation.x),Ke=We(q.root.rotation.x),Ye=yt-re,Ee=Tt+Se(ot.root.rotation.x),an=We(ot.root.rotation.x);q.root.position.set(ye,cn,Ke),ot.root.position.set(Ye,Ee,an),fe={lx:ye,ly:cn,lz:Ke,rx:Ye,ry:Ee,rz:an}}function k0(O,it,yt){if(O.phase==="idle"||O.charging){Rn=0,nn=0,En=0;return}const Tt=O.attackProgress,Kt=jo(Tt),Jt=Math.max(0,Kt),re=c.stride,Se=Number.isFinite(re.stepReach)?re.stepReach:.17,We=Number.isFinite(re.stepSideReach)?re.stepSideReach:.14,ye=Number.isFinite(re.stepDipReach)?re.stepDipReach:.05,cn=O.weapon==="greatsword"?me(Number.isFinite(re.heavyScale)?re.heavyScale:1,0,1):1,Ke=1-Math.exp(-12*Math.max(0,yt));Rn+=(Se*Jt*cn-Rn)*Ke,nn+=(it*We*Jt*cn-nn)*Ke,En+=(ye*Math.sin(Math.PI*Tt)*cn-En)*Ke,x.position.z+=Rn,x.position.x+=nn,x.position.y-=En}let Dd=null;function I0(){Dd={upperX:S.rotation.x,upperY:S.rotation.y,upperZ:S.rotation.z,upperPX:S.position.x,upperPZ:S.position.z,pelvisX:x.position.x,pelvisY:x.position.y,pelvisZ:x.position.z,pelvisRX:x.rotation.x,pelvisRZ:x.rotation.z,lrx:q.root.rotation.x,lry:q.root.rotation.y,lrz:q.root.rotation.z,lj:q.joint.rotation.x,rrx:ot.root.rotation.x,rry:ot.root.rotation.y,rrz:ot.root.rotation.z,rj:ot.joint.rotation.x,rootY:_.rotation.y}}function z0(O){const it=Dd;if(!it)return;const yt=dp(me(O,0,1));if(yt>=1)return;const Tt=(Kt,Jt)=>Kt+(Jt-Kt)*yt;S.rotation.x=Tt(it.upperX,S.rotation.x),S.rotation.y=Tt(it.upperY,S.rotation.y),S.rotation.z=Tt(it.upperZ,S.rotation.z),S.position.x=Tt(it.upperPX,S.position.x),S.position.z=Tt(it.upperPZ,S.position.z),x.position.x=Tt(it.pelvisX,x.position.x),x.position.y=Tt(it.pelvisY,x.position.y),x.position.z=Tt(it.pelvisZ,x.position.z),x.rotation.x=Tt(it.pelvisRX,x.rotation.x),x.rotation.z=Tt(it.pelvisRZ,x.rotation.z),q.root.rotation.x=Tt(it.lrx,q.root.rotation.x),q.root.rotation.y=Tt(it.lry,q.root.rotation.y),q.root.rotation.z=Tt(it.lrz,q.root.rotation.z),q.joint.rotation.x=Tt(it.lj,q.joint.rotation.x),ot.root.rotation.x=Tt(it.rrx,ot.root.rotation.x),ot.root.rotation.y=Tt(it.rry,ot.root.rotation.y),ot.root.rotation.z=Tt(it.rrz,ot.root.rotation.z),ot.joint.rotation.x=Tt(it.rj,ot.joint.rotation.x),_.rotation.y=it.rootY+Ge(_.rotation.y-it.rootY)*yt,ri=_.rotation.y}let to=null,Ec=0,Ld=0;function F0(){if(!D)return;const O=k,it=Math.max(0,O.waist??1),yt=Math.max(0,O.chest??0),Tt=it+yt,Kt=Tt>1e-6?it/Tt:1,Jt=Tt>1e-6?yt/Tt:0,re=S.rotation.x,Se=S.rotation.y,We=S.rotation.z;S.rotation.set(re*Kt,Se*Kt,We*Kt),C.rotation.set(re*Jt,Se*Jt,We*Jt);const ye=me(O.neck??0,0,1);ye>0&&(pt.rotation.x-=re*ye),to={x:re,y:Se,z:We}}function qo(){return{yaw:S.rotation.y+(D?C.rotation.y:0),pitch:S.rotation.x+(D?C.rotation.x:0),lean:S.rotation.z+(D?C.rotation.z:0)}}function kd(){return qo().yaw}function U0(O,it){if(!(d!=null&&d.enabled)){ce=null,Gt=0;return}_.updateWorldMatrix(!0,!0);const yt=new W,Tt=[],Kt=(hi,Gi,no=0)=>{hi.getWorldPosition(yt),Tt.push({x:yt.x,y:yt.y+no,z:yt.z,mass:Gi})},Jt=n.headSize;Kt(pt,.08,Jt/2),Kt(U,.14),Kt(G??C,.24),Kt(x,.12),Kt(q.hand,.05),Kt(ot.hand,.05),Kt(X.joint,.15),Kt($.joint,.15);const re=Pt?Ko(mt[Pt].right):null;re&&Tt.push({x:(re.base.x+re.tip.x)/2,y:(re.base.y+re.tip.y)/2,z:(re.base.z+re.tip.z)/2,mass:Pt==="greatsword"?.09:.04});const Se=Math.max(.05,n.limbThickness*1.15/2+.015),We=Math.max(.06,n.limbThickness*1.7/2+.02);let ye=1/0,cn=-1/0,Ke=1/0,Ye=-1/0,Ee=0;for(const hi of[X,$])hi.tip.getWorldPosition(yt),yt.y<=.13&&(Ee+=1),ye=Math.min(ye,yt.x-Se),cn=Math.max(cn,yt.x+Se),Ke=Math.min(Ke,yt.z-We),Ye=Math.max(Ye,yt.z+We);(!Number.isFinite(ye)||Ee===0)&&(ye=cn=Ke=Ye=0);let an=0,ln=0;Number.isFinite(rn)&&it>1e-5&&(an=me((O.position.x-rn)/it,-20,20),ln=me((O.position.z-bn)/it,-20,20)),rn=O.position.x,bn=O.position.z;const gn=M2(Tt,{minX:ye,maxX:cn,minZ:Ke,maxZ:Ye},an,ln,d);if(ce=gn,!d.autoCounter){Gt=0;return}const Jn=Math.cos(O.bodyYaw),Qn=-Math.sin(O.bodyYaw),li=gn.xcomX-gn.centerX,Ai=gn.xcomZ-gn.centerZ,ia=li*Jn+Ai*Qn,aa=an*Jn+ln*Qn,ti=gn.grounded?_2(ia,aa,d.predLead??0):0;Ld=ti;const Ri=Math.abs(ti)-.45*gn.halfX;de=Ri;let ei=0;Ri>.002&&gn.grounded&&(ei=-Math.sign(ti)*Math.min(Math.max(.005,d.maxShift??.045),(Ri+.002)*1.1666666666666667));const eo=Math.abs(ti)/Math.max(1e-4,gn.halfX),sa=Math.max(.1,b2(d.counterRate,eo,d.counterBoost??0));Gt+=(ei-Gt)*(1-Math.exp(-sa*it))}function N0(O,it){if(Rt.drawString.position.z=-.06,Mt.position.z=0,kt.orb.scale.setScalar(1),S.rotation.y=0,O.charging&&O.weapon==="bow"){const Jt=O.charge;q.root.rotation.x=-1.25,q.joint.rotation.x=-.15,ot.root.rotation.x=.35+Jt*.3,ot.joint.rotation.x=-1.15,Rt.drawString.position.z=-.06-Jt*.22,Mt.position.z=-Jt*.3,S.rotation.y=-.22;return}if(O.phase==="idle"&&mn<=.001){oe=null,Bt=null,ke=0,be=1,Oe=Math.max(.008,p.segBlend),Ae=null,He=null,hn=null,Pn=null,pi=null,Ti=null,ue=NaN,O.weapon==="greatsword"&&(Ht.position.x=-Math.max(0,s.twoHandInsetX??0));return}const yt=jo(O.attackProgress),Tt=Math.max(0,-yt),Kt=Math.max(0,yt);if(O.weapon==="bow")q.root.rotation.x=-1.2,q.joint.rotation.x=-.15,ot.root.rotation.x=.9-Kt*.8,ot.joint.rotation.x=-.3;else if(O.weapon==="greatsword")if(p.enabled)Pd(Cd(O,it));else{const Jt=-1.6*Tt+1.25*Kt,re=me(Number.isFinite(c.stride.heavyScale)?c.stride.heavyScale:1,0,1);ot.root.rotation.x=Jt,ot.joint.rotation.x=-(.25+Tt*.4),q.root.rotation.x=Jt+.06,q.joint.rotation.x=-(.32+Tt*.4),q.root.rotation.z=.42,ot.root.rotation.z=0;const Se=-Math.sin(ot.root.rotation.x);ot.root.rotation.y=-.72*Math.tanh(Se*4),S.rotation.y=-.2*yt*re}else if(p.enabled)Pd(Cd(O,it));else{const Jt=O.comboIndex;if(Jt===1)ot.root.rotation.x=-1.7*Tt+1.1*Kt,ot.joint.rotation.x=-(.2+Tt*.5),q.root.rotation.x=.1,S.rotation.y=-.18*yt;else if(Jt===2)q.root.rotation.x=-1.5*Tt+1*Kt,q.joint.rotation.x=-(.2+Tt*.5),ot.root.rotation.x=.2,S.rotation.y=.45*-yt;else{const re=-1.9*Tt+1.2*Kt;q.root.rotation.x=re,ot.root.rotation.x=re,q.joint.rotation.x=-(.15+Tt*.4),ot.joint.rotation.x=-(.15+Tt*.4),S.rotation.y=-.3*yt}}if(O.weapon==="greatsword"){const Jt=me((-ot.root.rotation.x-1.3)/1.2,0,1);Ht.position.x=-Math.max(0,s.twoHandInsetX??0)*(1-Jt)}k0(O,Pe%2===0?1:-1,it)}function O0(O,it){O&&(ot.root.rotation.x=-1.05,ot.joint.rotation.x=-.35,q.root.rotation.x=-.45,q.joint.rotation.x=-.2,S.rotation.y=-.12,kt.orb.scale.setScalar(1.25+.12*Math.sin(it*2)))}function B0(O){if(!O||O.phase==="idle")return;const it=O.progress,yt=it<.3?-.35+it/.3*1.35:it<.7?1:Math.max(0,1-(it-.7)/.3),Tt=Math.PI/180;S.rotation.x+=v.leanDeg*Tt*yt,q.root.rotation.x-=v.shieldPitchDeg*Tt*yt,q.joint.rotation.x-=.22*yt,ot.root.rotation.x-=.3*yt,x.position.z+=v.pelvisReach*Math.max(0,yt)}function Ko(O){if(!O)return null;const it=O.getObjectByName("bladeBase"),yt=O.getObjectByName("bladeTip");if(!it||!yt)return null;O.updateWorldMatrix(!0,!1);const Tt=it.getWorldPosition(new W),Kt=yt.getWorldPosition(new W),Jt=new W().setFromMatrixColumn(O.matrixWorld,0).normalize();return{base:{x:Tt.x,y:Tt.y,z:Tt.z},tip:{x:Kt.x,y:Kt.y,z:Kt.z},normal:{x:Jt.x,y:Jt.y,z:Jt.z}}}return{group:_,update(O,it,yt,Tt,Kt=!1,Jt,re,Se){var Zd;Ad(it.weapon);const We=Jt===void 0||F<0?Tt:me(Jt-F,0,.1);Jt!==void 0&&(F=Jt),_.rotation.y=0,ri=0,S.rotation.x=0,S.rotation.z=0,x.position.x=0,x.position.y=E,x.position.z=0,x.rotation.z=0,x.rotation.x=0,S.position.x=0,S.position.y=0,S.position.z=0,C.rotation.set(0,0,0),y.position.x=0,y.position.y=0,y.position.z=0,y.rotation.z=0;const ye=Math.max(1/240,Math.min(Tt,.1));at=((Zd=c.stance)==null?void 0:Zd[it.weapon])??null,L!==it.weapon&&(L=it.weapon,R=at?0:1);const cn=Math.max(.01,(at==null?void 0:at.blend)??.22);R=Math.min(1,R+ye/cn);const Ke=at?R:0;Q=((at==null?void 0:at.bladePitchDeg)??0)*Math.PI/180*Ke,ft=((at==null?void 0:at.bladePitchOffDeg)??0)*Math.PI/180*Ke;const Ye=Jt===void 0?Ea+=Tt:Jt;ts=Ye;const Ee=c.landing;Ee.enabled?es&&!O.grounded?(Ta="jump",is=Ye,as=Ee.anticipationDuration,ss=Math.max(0,Ee.jumpAnticipation),Zo=.32):!es&&O.grounded&&(Ta="land",is=Ye,as=Ee.duration,ss=p2(ns,Ee),Zo=Ee.compressRatio,Td=ns):(Ta="none",ss=0),Ye<is&&(Ta="none",ss=0),es=O.grounded,ns=O.velocity.y;const an=cp(Ye,is,as,ss,Zo),ln=it.phase!=="idle",gn=(Se==null?void 0:Se.phase)==="active";_n=h2(_n,ln,ye,c.attack.blendRate);const Jn=d2(_n,c.attack.gaitWeight,c.attack.lowerBodyWeight);Wn=Jn.attackLegWeight,Qs=Jn.gaitScale;const Qn=Math.sin(O.bodyYaw),li=Math.cos(O.bodyYaw),Ai=(O.velocity.x-ht)/ye,ia=(O.velocity.z-zt)/ye,aa=me(Ai,-60,60),ti=me(ia,-60,60),Ri=aa*Qn+ti*li,ei=Ge(O.bodyYaw-Ct)/ye,eo=We>1e-6?Ge(O.bodyYaw-Ct)/We:0,sa=Math.hypot(O.velocity.x,O.velocity.z),hi=o.maxForwardDeg*Math.PI/180,Gi=o.maxSideDeg*Math.PI/180,no=me(Ri*o.accelGain,-hi,hi),io=me(-ei*sa*o.turnGain,-Gi,Gi),ao=1-Math.exp(-o.smoothing*ye);wt+=(no-wt)*ao,Xt+=(io-Xt)*ao,ht=O.velocity.x,zt=O.velocity.z,Ct=O.bodyYaw;const Yn=Math.hypot(O.velocity.x,O.velocity.z),os=me(a.knockGaitScale??0,0,1),rs=yt.knockX*os,H0=yt.knockZ*os,G0=os>0&&Math.hypot(yt.knockX,yt.knockZ)>.001,Tc=O.velocity.x+rs,Ac=O.velocity.z+H0,Id=Math.hypot(Tc,Ac);Ei=Id;const X0=Math.cos(O.bodyYaw),V0=-Math.sin(O.bodyYaw),W0=O.velocity.x*X0+O.velocity.z*V0,zd=Yn>ji?me(W0/Yn,-1,1):0,Fd=Yn>ji?me((O.velocity.x*Qn+O.velocity.z*li)/Yn,-1,1):1,Y0=bd(Fd,a.backStrafeStartDeg,a.backStrafeFullDeg);pn==="settled"&&et&&Ut>Vt*1.02+1e-4&&(pn="none");let so=1;pn==="blend"?(so=c0(lt?ct:I,a.stopYawBlendMode,lt),lt||(I=Math.min(1,I+ye/Math.max(.01,a.stopYawAfterSec)),(I>=1||a.stopYawBlendMode==="inStop"||et)&&(pn="settled",so=0))):pn==="settled"&&(so=me(Yn/Math.max(ji,a.stopEnterRatio*e),0,1)),nt=so;const $0=e0(zd,i.legYawScale,i.hipYawMaxDeg,a.strafeHipBoost),Ud=(a.hipYawTrackRateDeg??0)*Math.PI/180,Z0=(a.hipYawBackRateDeg??0)*Math.PI/180,Rc=We>1e-6?We:Tt;Lt=Ud>0?Km(Lt,qm(eo),Rc):0;const Nd=n0(Y0,Lt),j0=me(Yn/.5,0,1),q0=a0(Fd,zd,$0,Nd)*so*j0,Od=Jm(Ft,q0,i0(Ud,Z0,Nd),Rc,Lt);Ft=Od,st+=(Od-st)*(1-Math.exp(-i.hipYawSmoothing*Rc));const oo=O.bodyYaw+st;Ot=oo;const K0=Math.sin(oo),J0=Math.cos(oo),Q0=Math.cos(oo),tg=-Math.sin(oo),di={speed:Id,phase:O.gaitPhase,localForward:Tc*K0+Ac*J0,localRight:Tc*Q0+Ac*tg,stride:O.stride};if(ln&&it.attackId!==fn){const ae=!Tn;fn=it.attackId,Pe+=1,Ve=ae&&(!Re||di.speed>.05)?di.phase:Mn,Re=!0}Tn=ln;const gi=_n>0?c2(di,it.attackProgress,Pe,_n,c.stride,Ve):di;Hi=gi,ln&&(Mn=gi.phase);const Pc=Math.max(0,a.dirFlipSec??0);Pc>0?(Cn=dc(Cn,gi.localForward>=0?1:-1,ye,Pc),ci=dc(ci,gi.localRight>=0?1:-1,ye,Pc)):(Cn=gi.localForward>=0?1:-1,ci=gi.localRight>=0?1:-1);const Bd=Math.max(0,a.stopBlendSec||0),Hd=Bd>0&&!ln&&!G0&&O.grounded,Cc=s0(Yn,we,e,a.stopEnterRatio,a.stopExitRatio);if(!Hd||Cc.resume)St=-1;else if(St<0&&Cc.enter){St=0,j=O.gaitPhase,ut=Qm(O.gaitPhase),Nt=Yn,Dt=Math.max(O.stride,ji),qt=di.localForward,le=di.localRight;const ae=1/Math.max(ji,Yn);he=O.velocity.x*ae,ee=O.velocity.z*ae}const eg=we;we=Yn;const Pi=Hd&&St>=0;Pi&&(St=Math.min(1,St+ye/Bd)),Pi&&pn!=="blend"&&(pn="blend",I=0),lt=Pi&&St<1,ct=St,et=Cc.resume,Ut=Yn,Vt=eg;const Gd=Pi?{phase:j,speed:Nt,moveSpeed:e,localForward:qt,localRight:le,dirF:Cn,dirR:ci,legLength:n.legLength,stride:Dt,grounded:!0}:{phase:gi.phase,speed:gi.speed,moveSpeed:e,localForward:gi.localForward,localRight:gi.localRight,dirF:Cn,dirR:ci,legLength:n.legLength,stride:gi.stride??0,grounded:O.grounded};let Dc=Pi?t0(Gd,a,{progress:St,phase0:j,phaseEnd:ut}):uc(Gd,a);const Aa=c.attack.moveTakeover;if(Aa&&!Pi){const ae=it.phase==="windup"?Aa.windup:it.phase==="recovery"?Aa.recovery:it.phase==="settle"?Aa.settle:0,pe=Math.max(.05,Aa.full-Aa.speed),Dn=me((di.speed-Aa.speed)/pe,0,1),Fn=me(ae,0,1)*Dn,Jo=Fn>Kn?10:6;Kn=me(Kn+(Fn-Kn)*(1-Math.exp(-Jo*ye)),0,1)}else Pi?Kn=0:Kn=me(Kn*Math.exp(-8*ye),0,1);if(Kn>.001&&!Pi){const ae=uc({phase:di.phase,speed:di.speed,moveSpeed:e,localForward:di.localForward,localRight:di.localRight,dirF:Cn,dirR:ci,legLength:n.legLength,stride:di.stride??0,grounded:O.grounded},a);Dc=u2(Dc,ae,Kn)}const Ie=f2(Dc,Jn.gaitScale);if(Zt=0,gn&&Se){const ae=s2(Se.progress,Se.dir,a),pe=Jn.gaitScale;Ie.legL.pitchX+=ae.legL.pitchX*pe,Ie.legL.rollZ+=ae.legL.rollZ*pe,Ie.legL.kneeX+=ae.legL.kneeX*pe,Ie.legR.pitchX+=ae.legR.pitchX*pe,Ie.legR.rollZ+=ae.legR.rollZ*pe,Ie.legR.kneeX+=ae.legR.kneeX*pe,Ie.pelvisY+=ae.pelvisY*pe,Zt=ae.env}let Lc=0,kc=0,Ic=0,Xd=0;if(Pi){const ae=r0(O.bodyYaw,he,ee),pe=l0(St,j,ae.forward,ae.right,a);pe.leadLeft?(Ie.legL.pitchX-=pe.leadPitch,Ie.legL.kneeX+=pe.leadKnee,Ie.legR.pitchX+=pe.trailPitch):(Ie.legR.pitchX-=pe.leadPitch,Ie.legR.kneeX+=pe.leadKnee,Ie.legL.pitchX+=pe.trailPitch),kc=pe.bodyShift*pe.fwdN,Lc=pe.bodyShift*pe.rightN,Ic=pe.bodyDip,Xd=pe.chestPitch,Xn=pe.leadPitch,Vn=pe.bodyShift,wi=pe.bodyDip}else Xn=0,Vn=0,wi=0;if(wa={lp:Ie.legL.pitchX,lr:Ie.legL.rollZ,rp:Ie.legR.pitchX,rr:Ie.legR.rollZ},!O.grounded)X.root.rotation.x=-.55,$.root.rotation.x=-.25,X.joint.rotation.x=.75,$.joint.rotation.x=.55,q.root.rotation.x=-.9,ot.root.rotation.x=-.7,q.joint.rotation.x=-.6,ot.joint.rotation.x=-.6,X.root.rotation.z=0,$.root.rotation.z=0;else{X.root.rotation.x=Ie.legL.pitchX,$.root.rotation.x=Ie.legR.pitchX,X.root.rotation.z=Ie.legL.rollZ,$.root.rotation.z=Ie.legR.rollZ,X.joint.rotation.x=Ie.legL.kneeX,$.joint.rotation.x=Ie.legR.kneeX;const ae=at?R:0,pe=1+(((at==null?void 0:at.armSwing)??1)-1)*ae,Dn=at==null?void 0:at.armR,Fn=at==null?void 0:at.armL,Jo=Ie.armL*pe+((Fn==null?void 0:Fn.pitch)??0)*ae,jd=Ie.armR*pe+((Dn==null?void 0:Dn.pitch)??0)*ae;q.root.rotation.x=Jo,ot.root.rotation.x=jd,q.joint.rotation.x=-(.18+Jo*.2)+((Fn==null?void 0:Fn.elbow)??0)*ae,ot.joint.rotation.x=-(.18+jd*.2)+((Dn==null?void 0:Dn.elbow)??0)*ae,q.root.rotation.z=((Fn==null?void 0:Fn.roll)??0)*ae,ot.root.rotation.z=((Dn==null?void 0:Dn.roll)??0)*ae,q.root.rotation.y=((Fn==null?void 0:Fn.yaw)??0)*ae,ot.root.rotation.y=((Dn==null?void 0:Dn.yaw)??0)*ae,x.position.x=Ie.pelvisX,x.position.y=E+Ie.pelvisY,x.position.z=0,x.rotation.z=Ie.pelvisRoll}const ng=x0(x,y),ro=gn?{...f,weight:0}:Pi&&f.enabled?{...f,weight:1}:f,Vd=ro.enabled&&O.grounded&&ro.weight>0?me(ro.weight,0,1)*(ln?me(ro.attackScale,0,1):1):0;x.position.x+=Lc,x.position.z+=kc,x.position.y-=Ic,y.position.y+=Ic,Vd<=0&&(y.position.x-=Lc,y.position.z-=kc);const zc=Yn/Math.max(e,ji);At=zc;const ig=Number.isFinite(o.crouchSmoothing)?o.crouchSmoothing:8,ag=1-Math.exp(-Math.max(0,ig)*ye);K+=(me(zc,0,1)-K)*ag;const cs=p0({leanForward:wt,leanSide:Xt,speedRatio:K},o);x.rotation.x+=cs.pelvisPitch,x.rotation.z+=cs.pelvisRoll,x.position.x+=cs.pelvisX,x.position.z+=cs.pelvisZ,x.position.y-=cs.crouch,y.position.y+=cs.crouch*(1-me(Vd,0,1));const Wd=it.phase!=="idle"||it.charging&&it.weapon==="bow",Fc=Wd?1:0,sg=Math.max(.001,Fc>mn?p.poseIn??.1:p.poseOut??.16);if(mn!==Fc){const ae=ye/sg;mn=me(mn+(Fc>mn?ae:-ae),0,1)}if((mn>0||Wd)&&I0(),N0(it,ye),mn>0&&mn<1&&z0(mn),at){const ae=(1-mn)*R;S.rotation.y+=(at.torsoYaw??0)*ae,S.rotation.x+=(at.torsoPitch??0)*ae}O0(Kt,O.gaitPhase),B0(re);const og=it.weapon==="greatsword",Yd=Math.hypot(O.velocity.x,O.velocity.z),rg=og&&it.phase==="idle"&&Yd>.5?Math.min(1.15,Yd/Math.max(e,.001)*.9):0;xt+=(rg-xt)*(1-Math.exp(-6*ye));const cg=S.rotation.x;it.weapon==="bow"&&(Rt.g.rotation.x=-(q.root.rotation.x+q.joint.rotation.x),Mt.rotation.x=-(ot.root.rotation.x+ot.joint.rotation.x));const lg=S.rotation.y;E0(yt,O.bodyYaw);const $d=yt.type==="none"?1:.4;if(S.rotation.x+=wt*$d+Xd,S.rotation.z+=(Xt+Ie.sideLean)*$d,an>0&&(X.root.rotation.x-=Ee.hipPitch*an,$.root.rotation.x-=Ee.hipPitch*an,X.joint.rotation.x+=Ee.kneeBend*an,$.joint.rotation.x+=Ee.kneeBend*an,x.position.y-=Ee.crouchDepth*an,y.position.y+=Ee.crouchDepth*(1-Ee.lowerScale)*an,S.rotation.x+=Ee.upperPitch*an,q.root.rotation.x-=Ee.armTuck*an,ot.root.rotation.x-=Ee.armTuck*an),Wn>0&&O.grounded){const ae=l2(it.attackProgress,Pe,c.stride),pe=Wn;X.root.rotation.x+=ae.legL.pitchX*pe,$.root.rotation.x+=ae.legR.pitchX*pe,X.root.rotation.z+=ae.legL.rollZ*pe,$.root.rotation.z+=ae.legR.rollZ*pe,X.joint.rotation.x+=ae.legL.kneeX*pe,$.joint.rotation.x+=ae.legR.kneeX*pe,x.position.x+=ae.pelvisX*pe,x.position.y+=ae.pelvisY*pe,x.rotation.z+=ae.pelvisRoll*pe}if(L0(ln,it.weapon),d!=null&&d.enabled&&d.autoCounter&&Math.abs(Gt)>1e-4&&(x.position.x+=Gt),g.enabled){const ae=it.phase!=="idle"&&!it.charging,pe=ae?jo(it.attackProgress):0;ae&&ne>.55&&pe<ne-1e-4&&(se=1),ne=pe,se=T2(se,ye,g.impactDecay);const Dn=w2({swing:pe,charge:it.charging?it.charge:0,impact:se,speedRatio:zc,grounded:O.grounded},g);$t=E2($t,Dn,ye,g.smoothing)}else $t={...Xh};T0($t),y.rotation.y=st,De=o0(st,a.chestYawScale,a.chestYawMaxDeg),S.rotation.y+=De;const hg=lg;if(pt.rotation.y=Ge(O.headYaw-O.bodyYaw-hg-De),pt.rotation.x=-me(O.headPitch??0,-.7,.7),S.rotation.x+=-me(O.bodyPitch??0,-.4,.4),F0(),R0(Tt,it.comboIndex),D0(it,cg),it.weapon==="greatsword"&&!it.charging&&(it.phase!=="idle"||mn>0)){_.updateWorldMatrix(!0,!0);const ae=it.phase==="idle"?Math.max(mn,_n):1;A0(me(ae,0,1),ye)}if(J=v0({root:_,pelvis:x,lower:y,limbs:Et,base:ng,cfg:ro,grounded:O.grounded,attacking:ln}),U0(O,ye),D&&to){const ae=qo();Ec=Math.max(Math.abs(ae.pitch-to.x),Math.abs(ae.yaw-to.y),Math.abs(ae.lean-to.z))}else Ec=0},lean(){return{forward:wt,side:Xt}},landing(){const O=cp(ts,is,as,ss,Zo),it=as>0?Math.max(0,as-Math.max(0,ts-is)):0;return{pulse:O,remaining:it,kind:O>0?Ta:"none",impactVy:Td}},hurt(){return It},ik(){return J},stretch(){return{...$t,impact:se}},gripDebug(){return{...jt}},weaponDebug(){return{wristPitch:ie,wristTwist:H}},setClipT(O){xe=O===null||!Number.isFinite(O)?null:Math.max(0,Math.min(1,O))},stanceDebug(){const O=at==null?void 0:at.armR,it=at==null?void 0:at.armL,yt=at?R:0;return{weapon:Pt??"sword-shield",weight:yt,armL:{pitch:((it==null?void 0:it.pitch)??0)*yt,yaw:((it==null?void 0:it.yaw)??0)*yt,roll:((it==null?void 0:it.roll)??0)*yt,elbow:((it==null?void 0:it.elbow)??0)*yt},armR:{pitch:((O==null?void 0:O.pitch)??0)*yt,yaw:((O==null?void 0:O.yaw)??0)*yt,roll:((O==null?void 0:O.roll)??0)*yt,elbow:((O==null?void 0:O.elbow)??0)*yt},torsoYaw:((at==null?void 0:at.torsoYaw)??0)*yt,torsoPitch:((at==null?void 0:at.torsoPitch)??0)*yt,bladePitchDeg:Q*180/Math.PI,bladePitchOffDeg:ft*180/Math.PI,armSwing:(at==null?void 0:at.armSwing)??1}},swingDebug(){const O=Bt;return{seg:ke,kind:(O==null?void 0:O.kind)??"right-left",lead:(O==null?void 0:O.lead)??"R",yaw:(O==null?void 0:O.yaw)??0,rootYaw:(O==null?void 0:O.rootYaw)??0,spinYaw:(O==null?void 0:O.spinYaw)??0,rootTurn:ri,pitch:(O==null?void 0:O.pitch)??0,roll:(O==null?void 0:O.roll)??0,strike:(O==null?void 0:O.strike)??0,bladeTwist:(O==null?void 0:O.bladeTwist)??0,bladeTwistOff:(O==null?void 0:O.bladeTwistOff)??0,bladeYaw:(O==null?void 0:O.bladeYaw)??0,bladeYawOff:(O==null?void 0:O.bladeYawOff)??0,shoulderL:{x:fe.lx,y:fe.ly,z:fe.lz},shoulderR:{x:fe.rx,y:fe.ry,z:fe.rz}}},attackBlend(){return _n},attackWeights(){return{gaitScale:Qs,attackLegWeight:Wn,driveSpeed:Hi.speed,stridePhase:Hi.phase,strideBase:Ve,stepIndex:Pe}},hipYaw(){return st},torsoTotal(){return qo()},spineDebug(){if(!D)return null;const O=qo();return{enabled:!0,waistYaw:S.rotation.y,chestYaw:C.rotation.y,totalYaw:O.yaw,totalPitch:O.pitch,totalLean:O.lean,neckPitch:pt.rotation.x,leak:Ec}},balanceDebug(){return ce?{...ce,shift:Gt,latDeficit:de,lateralFf:Ld}:null},gaitDebug(){return{stopT:St,hipYaw:st,chestYaw:De,speed:we,gaitSpeed:Ei,stopStep:Xn,stopShift:Vn,stopDip:wi,stopYawFade:nt,turnStep:Zt,legTakeover:Kn,legLPitch:wa.lp,legLRoll:wa.lr,legRPitch:wa.rp,legRRoll:wa.rr,phase:Hi.phase,dirF:Cn,dirR:ci,hipYawTarget:Ft,spin:Lt}},gaitYaw(){return Ot},arrowDirection(){Mt.updateWorldMatrix(!0,!1);const O=Mt.matrixWorld.elements,it=O[8],yt=O[9],Tt=O[10],Kt=Math.hypot(it,yt,Tt)||1;return{x:it/Kt,y:yt/Kt,z:Tt/Kt}},weaponBlade(){return Pt?Ko(mt[Pt].right):null},bladesWorld(){return Pt?{right:Ko(mt[Pt].right),left:Ko(mt[Pt].left)}:{right:null,left:null}},dispose(){_.traverse(O=>{if(O instanceof ve){O.geometry.dispose();const it=O.material;Array.isArray(it)?it.forEach(yt=>yt.dispose()):it.dispose()}})}}}function B2(n){const t=y0(n.voxel,n.colors,n.moveSpeed,n.orientation,n.gait,n.mount,n.lean,n.hurt,n.animation,n.ik,n.links,n.wrist,n.balance),e=new ge;e.add(t.group);const i={position:{x:0,y:0,z:0},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:1,distance:0,coyoteTime:0,jumpBuffer:0},a=[];for(const s of["headPivot","chest","torsoUpper","torso","pelvis"]){const o=t.group.getObjectByName(s);o&&a.push(o)}return{group:e,update(s,o,r){i.position.x=s.position.x,i.position.y=s.position.y,i.position.z=s.position.z,i.velocity.x=s.velocity.x,i.velocity.y=s.velocity.y,i.velocity.z=s.velocity.z,i.facing=s.facing,i.moveYaw=Math.atan2(i.velocity.x,i.velocity.z),i.bodyYaw=s.bodyYaw,i.headYaw=s.headYaw,i.gaitPhase=s.gaitPhase,i.stride=s.stride,i.distance=s.distance,i.grounded=!0,i.sprinting=!1,e.position.set(s.position.x,s.position.y,s.position.z),e.rotation.y=s.bodyYaw,s.combat&&t.update(i,s.combat,s.hurt,o,!1,r,s.link)},debug(){return t.gaitDebug()},boneAtWorld(s,o,r){if(a.length===0)return null;const c=new W(s,o,r),l=new W;let h=null,u=Number.POSITIVE_INFINITY;for(const d of a){d.updateWorldMatrix(!0,!1),d.getWorldPosition(l);const f=l.distanceToSquared(c);f<u&&(u=f,h=d)}return h?{node:h,point:c}:null},dispose(){t.dispose()}}}const Ua=.012,Na=.016;function H2(n,t,e=[]){const i=t.lab,a=new ge;a.name="test-lab";const s=[],o=[],r=[],c=[];function l(S){return r.push(S),S}function h(S){return c.push(S),S}function u(S,w,E,A=Ua){const b=l(new xn({color:w,transparent:!0,opacity:E,depthWrite:!1,side:je,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),M=new ve(S,b);return M.rotation.x=-Math.PI/2,M.position.y=A,M.renderOrder=2,M}function d(S,w){return h(new Os(Math.max(S,.001),w,72))}function f(S,w,E,A=Na){const M=document.createElement("canvas"),P=M.getContext("2d");if(!P)return new ve;const k='700 96px "Noto Sans SC", ui-monospace, Menlo, monospace';P.font=k,M.width=Wu.ceilPowerOfTwo(Math.ceil(P.measureText(S).width)+32),M.height=Wu.ceilPowerOfTwo(96*1.4);const D=M.getContext("2d");if(!D)return new ve;D.font=k,D.textAlign="center",D.textBaseline="middle",D.fillStyle=E,D.fillText(S,M.width/2,M.height/2);const z=new Oh(M);z.colorSpace=Hn,o.push(z);const C=M.width/M.height,T=h(new Zn(w*C,w)),U=l(new xn({map:z,transparent:!0,depthWrite:!1,side:je,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3})),G=new ve(T,U);return G.rotation.x=-Math.PI/2,G.position.y=A,G.renderOrder=3,G}function m(S,w,E,A,b,M){const P=E-w,k=h(new Zn(P,A)),D=u(k,b,M,Ua);D.position.set(P/2+w,Ua,0);const z=new ge;return z.add(D),z.rotation.y=S-Math.PI/2,z}function v(S,w,E,A,b){const M=new Xm;M.moveTo(0,w*.5),M.lineTo(-E*.5,w*.5-E*.9),M.lineTo(-E*.18,w*.5-E*.9),M.lineTo(-E*.18,-w*.5),M.lineTo(E*.18,-w*.5),M.lineTo(E*.18,w*.5-E*.9),M.lineTo(E*.5,w*.5-E*.9),M.closePath();const P=h(new _d(M)),k=u(P,A,b,Ua+.002),D=new ge;return D.add(k),D.rotation.y=S+Math.PI,D}function g(S){var P;const w=new ge,E=f(`${S.index} · ${S.name}`,t.lab.labelTextHeight,"#eaf4ff"),b=((P=E.geometry.parameters)==null?void 0:P.width)??3;w.add(E);const M=u(h(new Zn(b*.98,.08)),S.color,.7,Na);return M.position.set(0,Na,t.lab.labelTextHeight*.66),w.add(M),w.position.set(S.labelX,0,S.labelZ),w}function p(S,w){const E=new ge,A=S.maxX-S.minX,b=S.maxZ-S.minZ,M=(S.minX+S.maxX)/2,P=(S.minZ+S.maxZ)/2,k=.09,D=.006,z=[[M,S.minZ+k/2,A,k],[M,S.maxZ-k/2,A,k],[S.minX+k/2,P,k,b],[S.maxX-k/2,P,k,b]];for(const[T,U,G,Z]of z){const rt=u(h(new Zn(G,Z)),w,.38,D);rt.position.set(T,D,U),E.add(rt)}const C=.42;for(const[T,U]of[[S.minX+C/2,S.minZ+C/2],[S.maxX-C/2,S.minZ+C/2],[S.minX+C/2,S.maxZ-C/2],[S.maxX-C/2,S.maxZ-C/2]]){const G=u(h(new Zn(C,C)),w,.55,D);G.position.set(T,D,U),E.add(G)}return E}const _=new ge,x=new Map;for(const S of n??[])x.set(S.id,S.color);for(const S of e)S.plotId&&_.add(p(S,x.get(S.plotId)??"#7f8fa0"));for(const S of n??[]){const w=new ge;if(w.position.set(S.x,0,S.z),S.shape==="square"){const E=S.radius,A=u(h(new Zn(E*2,E*2)),S.color,i.padOpacity*.09);w.add(A);const b=.07,M=[[0,E,E*2+b,b],[0,-E,E*2+b,b],[-E,0,b,E*2+b],[E,0,b,E*2+b]];for(const[P,k,D,z]of M){const C=u(h(new Zn(D,z)),S.color,i.padOpacity);C.position.x=P,C.position.z=k,w.add(C)}}else w.add(u(h(new xd(S.radius,72)),S.color,i.padOpacity*.075)),w.add(u(d(S.radius-.075,S.radius),S.color,i.padOpacity));if(S.id==="hub"){for(let E=0;E<4;E++){const A=E*Math.PI/4,b=E%2===0;for(const M of[0,Math.PI])w.add(m(A+M,S.radius*.12,S.radius*.94,b?.09:.055,S.color,b?.5:.32))}w.add(u(d(.5,.56),S.color,.4))}else if(S.id==="dash"){const E=S.spawnZ-S.z,A=-S.radius+.5,b=E-A,M=u(h(new Zn(.06,b)),S.color,.36);M.position.set(0,Ua,(E+A)/2),w.add(M);let P=0;for(let D=E;D>=A-.01;D-=1,P++){const z=P%5===0,C=u(h(new Zn(z?2.4:1.3,z?.1:.07)),S.color,z?.72:.42);C.position.set(0,Ua,D),w.add(C);const T=f(String(P),.52,z?"#eaf4ff":"rgba(200,225,245,0.8)");T.position.set(1.6,Na,D),w.add(T)}const k=[[3.2,"翻滚 3.2"],[5,"闪现 5.0"]];for(const[D,z]of k){const C=E-D,T=u(h(new Zn(1.9,.09)),"#ffffff",.5);T.position.set(-1.5,Ua,C),w.add(T);const U=f(z,.42,"rgba(220, 236, 250, 0.86)");U.position.set(-3,Na,C),w.add(U)}}else if(S.id==="gait"){w.add(u(d(1.44,1.5),S.color,.5)),w.add(u(d(1.14,1.2),S.color,.22));const E=1.55,A=[[0,"180° 正后退","#ff9a8a"],[Math.PI/4,"135° 斜后","#ffd166"],[Math.PI/2,"90° 正侧移","#8fe7ff"]];for(const[b,M,P]of A){const D=Math.sin(b),z=Math.cos(b),C=v(b,1.7,.34,P,.75);C.position.set(D*1.7*.5,0,E+z*1.7*.5),w.add(C);const T=f(M,.44,P);T.position.set(D*(1.7+.7),Na,E+z*(1.7+.7)),w.add(T)}}if(_.add(w),i.showLabels){const E=g(S);s.push(E),_.add(E)}}a.add(_);const y=n==null?void 0:n.find(S=>S.id==="hub");if(y&&i.showLabels){const S=[[0,-1,"屏上"],[0,1,"屏下"],[-1,0,"屏左"],[1,0,"屏右"]];for(const[w,E,A]of S){const b=f(A,.4,"rgba(190, 224, 248, 0.8)");b.position.set(y.x+w*(y.radius+.7),Na,y.z+E*(y.radius+.7)),a.add(b),s.push(b)}}return a.visible=i.enabled,{group:a,setVisible(S){a.visible=S},setLabelsVisible(S){for(const w of s)w.visible=S},dispose(){for(const S of c)S.dispose();for(const S of r)S.dispose();for(const S of o)S.dispose();a.clear()}}}const $e={grass:8,groundArea:12,ringHalo:20,ring:22,ringMeter:24,ringWarn:26,groundFx:30,trail:40,slash:44,projectileTrail:46,projectile:48,projectileGlow:50};function Cl(n,t){n.renderOrder=t,n.traverse(e=>{e.renderOrder=t})}function Dl(n,t,e){const i=Array.from({length:t.count},()=>{const a=new xn({color:t.color,transparent:!0,opacity:0,side:je,depthWrite:!1,...t.blending?{blending:t.blending}:{}}),s=new ve(t.geometry,a);return s.rotation.x=-Math.PI/2,s.renderOrder=t.renderOrder,s.visible=!1,n.add(s),{mesh:s,mat:a,life:0,base:1,delay:0}});return{entries:i,spawn(a,s,o,r,c){const l=i.find(h=>h.life<=0)??i[0];c!=null&&c.color&&l.mat.color.set(c.color),l.mesh.position.set(a,e(a,s,o)+t.yOffset,s),l.base=r,l.mesh.scale.setScalar(r*t.scaleFrom),l.mesh.visible=!0,l.mat.opacity=t.spawnOpacity,l.life=t.duration,l.delay=(c==null?void 0:c.delay)??0},update(a){for(const s of i){if(s.life<=0)continue;if(s.delay>0){s.delay-=a;continue}s.life-=a;const o=Math.max(0,s.life/Math.max(t.duration,1e-6));s.mesh.scale.setScalar(s.base*(t.scaleFrom+t.scaleSpan*(1-Math.pow(o,t.growPow)))),s.mat.opacity=t.peak*Math.pow(o,t.fadePow),s.life<=0&&(s.mesh.visible=!1)}},live(){return i.filter(a=>a.life>0)},dispose(){for(const a of i)a.mat.dispose()}}}function G2(n,t,e,i){const a=t.dash,s={count:6,geometry:new Os(a.ringRadius-.06,a.ringRadius,28),color:"#ffffff",renderOrder:$e.groundFx,duration:a.fxDuration,peak:.9,fadePow:1,scaleFrom:.6,scaleSpan:1.2,growPow:1,yOffset:.04,spawnOpacity:.9},o=Dl(n,s,i),r=t.links,c={count:5,geometry:new Os(r.ringRadius-.07,r.ringRadius,28),color:r.chargeColor,renderOrder:$e.groundFx,duration:r.fxDuration,peak:.85,fadePow:1,scaleFrom:.55,scaleSpan:1.1,growPow:1,yOffset:.05,spawnOpacity:.85},l=Dl(n,c,i),h=t.groundSlam,u={count:4,geometry:new Os(.78,1,56),color:h.color,blending:Ji,renderOrder:$e.groundFx+1,duration:h.duration,peak:.85,fadePow:1.3,scaleFrom:.35,scaleSpan:.65,growPow:1.8,yOffset:.035,spawnOpacity:0},d=Dl(n,u,i);let f=e.dash.id,m="none",v=e.playerLink.id,g=e.playerLink.hitIds.length,p=e.combat.slamAttackId,_=0;return{update(x,y,S){var A;const w=x.character;if(x.dash.id!==f){f=x.dash.id;const b=x.dash;m=b.kind,b.kind==="blink"?(o.spawn(b.fromX,b.fromZ,w.position.y,.9,{color:a.blinkColor}),o.spawn(b.toX,b.toZ,w.position.y,1.35,{color:a.blinkColor})):o.spawn(b.fromX,b.fromZ,w.position.y,1.1,{color:a.rollColor})}if(o.update(y),x.combat.slamAttackId!==p&&(p=x.combat.slamAttackId,_+=1,h.enabled)){const b=(A=x.config.combat.weapons[x.combat.weapon])==null?void 0:A.groundSlam,M=Math.max(.6,(b==null?void 0:b.radius)??2.2);d.spawn(w.position.x,w.position.z,w.position.y,M,{delay:0}),d.spawn(w.position.x,w.position.z,w.position.y,M*h.outerScale,{delay:h.delay}),S(h.shake)}d.update(y);const E=x.playerLink;E.id!==v&&(v=E.id,g=E.hitIds.length,l.spawn(w.position.x,w.position.z,w.position.y,1)),E.hitIds.length>g?(g=E.hitIds.length,l.spawn(w.position.x,w.position.z,w.position.y,1.35)):E.hitIds.length<g&&(g=E.hitIds.length),l.update(y)},slamDebug(){return{spawns:_,lastId:p,live:d.live().map(x=>({life:x.life,scale:x.mesh.scale.x,opacity:x.mat.opacity,visible:x.mesh.visible}))}},groundOrder(){var x;return((x=d.entries[0])==null?void 0:x.mesh.renderOrder)??$e.groundFx+1},activeDash(){return o.live().length},dashKind(){return m},dispose(){o.dispose(),l.dispose(),d.dispose();for(const x of[s.geometry,c.geometry,u.geometry])x.dispose()}}}const wd=64,M0=[0,.24,.76,1],X2=[0,1,1,0],_0=[0,.12,.28,.5,.72,.88,1],V2=[0,.16,.5,1,.5,.16,0];function up(n,t){if(t<=1e-6)return 1;const e=Math.min(1,Math.max(0,n/t));return e*e*(3-2*e)}function Ed(n,t,e,i,a=wd,s="band"){const o=Math.max(.001,n-t*.5),r=Math.max(o+.001,n+t*.5),c=s==="glow"?_0:M0,l=s==="glow"?V2:X2,h=c.length,u=a+1,d=new Float32Array(u*h*3),f=new Float32Array(u*h*4),m=[];for(let g=0;g<u;g++){const p=g/a,_=(p-.5)*e,x=up(p,i)*up(1-p,i),y=Math.sin(_),S=Math.cos(_);for(let w=0;w<h;w++){const E=o+(r-o)*c[w],A=g*h+w;d[A*3]=y*E,d[A*3+1]=0,d[A*3+2]=S*E;const b=x*l[w];f[A*4]=1,f[A*4+1]=1,f[A*4+2]=1,f[A*4+3]=b}}for(let g=0;g<a;g++)for(let p=0;p<h-1;p++){const _=g*h+p,x=_+h;m.push(_,x,_+1,_+1,x,x+1)}const v=new qe;return v.setAttribute("position",new on(d,3)),v.setAttribute("color",new on(f,4)),v.setIndex(m),v.computeBoundingSphere(),v}function Ll(n){const t=new xn({color:n.color,transparent:!0,opacity:n.opacity,depthWrite:!1,side:je,vertexColors:!0,toneMapped:!1}),e=new Map;let i=null;const a=(c,l)=>{const h=Math.round(c*32)/32,u=Math.max(.05,Math.round(l*20)/20),d=`${Math.round(h*32)}|${Math.round(u*20)}`,f=e.get(d);if(f)return f;const m=Ed(n.radius,n.thickness*u,h,n.edgeFade,wd,n.profile??"band");if(e.set(d,m),e.size>64){for(const[v,g]of e)if(v!==d&&g!==i){g.dispose(),e.delete(v);break}}return m};i=a(n.arcRad,1);const s=new ve(i,t);s.position.y=n.y,s.renderOrder=n.renderOrder??4;let o=n.arcRad,r=1;return{mesh:s,update(c,l,h,u,d,f=1){const m=Math.max(.05,f);(Math.abs(c-o)>.01||Math.abs(m-r)>.01)&&(i=a(c,m),s.geometry=i,o=c,r=m),t.opacity=l,t.color.copy(u),s.scale.set(h,1,h),s.rotation.y=d,s.visible=l>.002},arcRad(){return o},dispose(){for(const c of e.values())c.dispose();e.clear(),t.dispose()}}}function fp(n,t){return Math.max(.05,n*.5*Math.max(.1,t))}function W2(n,t,e,i,a){const s=a.arcDeg*Math.PI/180,o=a.playerOpacity;if(!n)return{arcRad:s,opacity:o,scale:1,level:0};const r=Math.min(1,Math.max(0,t)),c=Math.min(1,Math.max(0,e)),l=a.selectedArcDeg*Math.PI/180,h=s+(l-s)*(.35+.65*r),u=4+4*r+6*c,d=.5+.5*Math.sin(i*u),f=Math.min(.95,o+(.2+.1*c)*r+.04*d),m=1+.02*r+.012*d*r;return{arcRad:h,opacity:f,scale:m,level:r}}function Y2(n,t,e,i,a){const s=Math.min(1,Math.max(0,a));return s<=.001?n.copy(t):s<.5?n.copy(t).lerp(e,s*2):n.copy(e).lerp(i,(s-.5)*2)}function $2(n=64,t=.06,e=5){const i=n+1,a=e+1,s=new Float32Array(i*a*3),o=new Float32Array(i*a*4),r=[];for(let l=0;l<i;l++){const h=l/n*Math.PI*2,u=Math.sin(h),d=Math.cos(h);for(let f=0;f<a;f++){const m=f/e,v=t+(1-t)*m,g=l*a+f;s[g*3]=u*v,s[g*3+1]=0,s[g*3+2]=d*v;const p=Math.pow(1-m,1.8)*.9+(f===0?.1:0);o[g*4]=1,o[g*4+1]=1,o[g*4+2]=1,o[g*4+3]=Math.min(1,p)}}for(let l=0;l<n;l++)for(let h=0;h<e;h++){const u=l*a+h,d=u+a;r.push(u,d,u+1,u+1,d,d+1)}const c=new qe;return c.setAttribute("position",new on(s,3)),c.setAttribute("color",new on(o,4)),c.setIndex(r),c.computeBoundingSphere(),c}function pp(n){const t=n.segments??wd,e=n.profile??"band",a=((e==="glow"?_0.length:M0.length)-1)*6,s=Ed(n.radius,n.thickness,n.arcRad,n.edgeFade,t,e),o=new xn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:je,vertexColors:!0,toneMapped:!1}),r=new ve(s,o);r.position.y=n.y,r.renderOrder=n.renderOrder??7,r.visible=!1,s.setDrawRange(0,0);let c=0;return{mesh:r,set(l,h,u,d,f=1){const m=Math.min(1,Math.max(0,l)),v=Math.round(m*t),g=m>.001?Math.max(1,v)*a:0;g!==s.drawRange.count&&s.setDrawRange(0,g),c=v,o.opacity=h,o.color.copy(u),r.scale.set(f,1,f),r.rotation.y=d,r.visible=h>.002&&m>.001},ratio(){return t>0?c/t:0},filledSegments(){return c},dispose(){s.dispose(),o.dispose()}}}function mp(n){const t=new ge,e=$2(48),i=new xn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:je,vertexColors:!0,toneMapped:!1}),a=new ve(e,i);a.renderOrder=n.renderOrder??2,t.add(a);const s=Math.max(.01,n.edgeWidthRatio??.045),o=Ed(1-s*.5,s,Math.PI*2,0,64,"band"),r=new xn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:je,vertexColors:!0,toneMapped:!1}),c=new ve(o,r);return c.renderOrder=(n.renderOrder??2)+1,t.add(c),t.position.y=n.y,{group:t,set(l,h,u,d,f,m){const v=Math.min(1,Math.max(0,f));t.position.set(l,u,h),a.scale.set(d,1,d),c.scale.set(d,1,d),i.opacity=v*.26,r.opacity=v*(.72+.18*Math.sin(m*7)),t.visible=v>.004},dispose(){e.dispose(),i.dispose(),o.dispose(),r.dispose()}}}function gp(n,t,e,i){if(i<=1e-4||e<=0)return t;const a=1-Math.exp(-e/i);return n+(t-n)*a}function Z2(n,t,e){if(n!=="windup")return{active:!1,ratio:0,urgency:0};const i=Math.max(1e-4,e),a=Math.min(1,Math.max(0,t/i));return{active:!0,ratio:a,urgency:.35+.65*a}}function j2(n){if(n.charging)return{source:"charge",ratio:Math.min(1,Math.max(0,n.charge))};if(n.channeling){if(n.channelProgress!==void 0)return{source:"channel",ratio:Math.min(1,Math.max(0,n.channelProgress))};const i=Math.max(1e-4,n.fireInterval);return{source:"channel",ratio:1-Math.min(1,Math.max(0,n.fireTimer/i))}}const t=n.arcaneCooldown??0,e=n.arcaneCooldownMax??0;return t>0&&e>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,t/e))}:n.dashCooldown>0&&n.dashCooldownMax>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,n.dashCooldown/n.dashCooldownMax))}:{source:"none",ratio:0}}function q2(n,t,e,i,a,s){return n!=="windup"||a<=.05?{active:!1,x:t,z:e,radius:0}:{active:!0,x:t+Math.sin(i)*a,z:e+Math.cos(i)*a,radius:Math.max(.3,s)}}function K2(n,t){const e=Math.max(.02,t),i=Math.min(1,Math.max(0,n/e));return{scale:.06+.94*(1-Math.pow(1-i,3)),alpha:i}}function J2(n,t,e){return n?t:e}function b0(n){return{x:0,y:0,z:1}}function Q2(n){return Math.asin(b0().y)}function tR(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}const eR=.15,nR=-.032,iR=[.255,.175,.095,.025],xp=[[.471,.376],[.53,.101],[.486,-.185],[.35,-.438]],aR=[{L1:.41,L2:.346},{L1:.432,L2:.367},{L1:.454,L2:.389},{L1:.497,L2:.432}],Ur=.09,sR=.42,vp=.045,On={carapace:"#332c47",carapaceTop:"#453c60",carapaceEdge:"#4d4369",leg:"#5d4f82",tarsus:"#463a63",dark:"#1a1626",eyeMain:"#e0395a",eyeSub:"#d4823c"};function oR(n,t){const e=n.map(([f,m,v,g,p,_,x=0,y=0,S=0])=>{const w=new qn(f,m,v);return x!==0&&w.rotateX(x),y!==0&&w.rotateY(y),S!==0&&w.rotateZ(S),w.translate(g,p,_),w});let i=0,a=0;for(const f of e)i+=f.attributes.position.count,a+=f.index.count;const s=new Float32Array(i*3),o=new Float32Array(i*3),r=new Float32Array(i*3),c=i>65535?new Uint32Array(a):new Uint16Array(a),l=new Qt;let h=0,u=0;e.forEach((f,m)=>{const v=f.attributes.position.count;s.set(f.attributes.position.array,h*3),o.set(f.attributes.normal.array,h*3),l.setStyle(t[m]);for(let p=0;p<v;p++)r[(h+p)*3]=l.r,r[(h+p)*3+1]=l.g,r[(h+p)*3+2]=l.b;const g=f.index.array;for(let p=0;p<g.length;p++)c[u+p]=g[p]+h;h+=v,u+=g.length,f.dispose()});const d=new qe;return d.setAttribute("position",new on(s,3)),d.setAttribute("normal",new on(o,3)),d.setAttribute("color",new on(r,3)),d.setIndex(new on(c,1)),d.computeBoundingSphere(),d}function rR(n,t,e,i,a){const s=Math.hypot(n,e),o=-t,r=Math.atan2(n,e),c=(i+a)*.999,l=Math.abs(i-a)+.002,h=Math.hypot(s,o),u=h>c||h<l,d=Math.min(Math.max(h,l),c),f=(i*i+d*d-a*a)/(2*i*d),m=Math.acos(Math.min(1,Math.max(-1,f))),g=Math.atan2(s,o)+m,p=i*Math.sin(g),_=i*Math.cos(g),x=Math.atan2(s-p,o-_);return{yaw:r,femurPitch:-g,tibiaPitch:-(x-g),clamped:u,reach:h/(i+a)}}function cR(n,t={}){const e={height:t.height??.32,lift:t.lift??.13,duty:t.duty??.55,strideRatio:t.strideRatio??.62,bob:t.bob??.006,scale:t.scale??1,inertia:t.inertia??1},i=[],a=new Oi({vertexColors:!0}),s=new xn({vertexColors:!0});i.push(a,s);const o=(dt,Y,N=!1)=>{const X=typeof Y=="string"?dt.map(()=>Y):Y,$=oR(dt,X);i.push($);const q=new ve($,N?s:a);return q.castShadow=!N,q.receiveShadow=!N,q},r=new ge;r.name="spider-root",r.scale.setScalar(e.scale);const c=new ge;c.name="spider-body",c.position.y=e.height,r.add(c);const l=new ge;l.name="carapace",l.position.set(0,0,.15),c.add(l);const h=[[.3,.036,.3,0,-.03,0],[.292,.042,.292,0,.008,0],[.268,.038,.268,0,.046,0],[.228,.03,.228,0,.078,0],[.1,.078,.1,0,.022,-.17]],u=[On.carapace,On.carapaceTop,On.carapaceEdge,On.carapaceTop,"#231e33"];for(const dt of[-1,1])h.push([.058,.084,.056,dt*.044,-.046,.126,.28]),u.push(On.dark),h.push([.022,.042,.022,dt*.044,-.098,.108,.95]),u.push("#0f0c18"),h.push([.038,.086,.038,dt*.086,-.012,.108,.72,0,dt*.14]),u.push(On.leg),h.push([.03,.07,.03,dt*.108,-.074,.158,.06]),u.push(On.leg);l.add(o(h,u));const d=[],f=[],m=[[.034,.084,.11,.03,On.eyeMain],[.074,.076,.102,.021,On.eyeSub],[.04,.066,.108,.018,On.eyeSub],[.068,.058,.098,.016,On.eyeSub]];for(const[dt,Y,N,X,$]of m)for(const q of[-1,1])d.push([X,X,X*.5,q*dt,Y,N]),f.push($);l.add(o(d,f,!0));const v=new ge;v.name="abdomen",v.position.set(0,.055,-.268),v.rotation.x=vp,c.add(v);const g=[[.292,.044,.352,0,-.072,0],[.34,.05,.416,0,-.028,0],[.37,.054,.456,0,.023,0],[.372,.054,.454,0,.075,0],[.344,.048,.416,0,.124,0],[.284,.038,.338,0,.166,0],[.07,.038,.042,0,-.07,-.238]],p=["#3f3556","#453a5e","#4a3d63","#4d4067","#50426b","#53456f","#231e33"];v.add(o(g,p));const _=[];for(let dt=0;dt<8;dt++){const Y=dt<4?-1:1,N=dt%4,{L1:X,L2:$}=aR[N],q=new ge;q.name=`hip-${dt}`,q.rotation.order="YXZ",q.position.set(Y*eR,nR,iR[N]),c.add(q),q.add(o([[.088,.078,.1,0,.006,0]],On.leg));const ot=new ge;ot.rotation.order="YXZ",q.add(ot),ot.add(o([[.064,X*.46,.064,0,-X*.23,0],[.052,X*.42,.052,0,-X*.68,0],[.042,X*.14,.042,0,-X*.95,0]],On.leg));const Et=new ge;Et.rotation.order="YXZ",Et.position.y=-X,ot.add(Et),Et.add(o([[.072,.05,.072,0,.004,0],[.054,$*.44,.054,0,-$*.26,0],[.043,$*.4,.043,0,-$*.68,0],[.034,$*.16,.034,0,-$*.95,0]],On.leg));const Ht=new ge;Ht.position.y=-$,Et.add(Ht),Ht.add(o([[.044,.042,.044,0,0,0],[.03,Ur*.86,.03,0,-Ur*.5,0],[.044,.018,.044,0,-Ur,0]],On.tarsus));const tt=(dt<4?0:1)^dt%2;_.push({index:dt,side:Y,k:N,hip:q,femur:ot,tibia:Et,tarsus:Ht,L1:X,L2:$,home:new W(Y*xp[N][0],0,xp[N][1]),phaseOffset:tt*.5,foot:new W,from:new W,to:new W,swinging:!1,clamped:!1,reach:0})}let x=0,y=0;r.traverse(dt=>{const Y=dt;if(!Y.isMesh)return;x++;const N=Y.geometry;y+=(N.index?N.index.count:N.attributes.position.count)/3});const S=new W,w=new W,E=new W;let A=0,b=0,M=0,P=0,k=!1,D=0,z=0,C=0,T=0;const U={pitch:{x:0,v:0},roll:{x:0,v:0},lean:{x:0,v:0},abdom:{x:0,v:0}},G=(dt,Y,N,X)=>{const $=N*N*(Y-dt.x)-2*N*dt.v;return dt.v+=$*X,dt.x+=dt.v*X,dt.x},Z=(dt,Y)=>dt<-Y?-Y:dt>Y?Y:dt;let rt={maxReach:0,clamped:0,phase:0,strideUsed:0,gaitSpeed:0,effSpeed:0,slide:0,dt:0,pitch:0,roll:0,leanZ:0,abdomen:0,meshes:x,triangles:y};const pt=(dt,Y,N,X)=>(Y.set(dt.home.x*X,0,dt.home.z*X),r.localToWorld(Y),Y.y=N,Y);return{group:r,update:(dt,Y,N,X)=>{const $=Math.min(Math.max(X,0),.05);if($<=0)return;r.updateWorldMatrix(!0,!1),c.getWorldDirection(E),E.y=0,E.lengthSq()<1e-8&&E.set(0,0,1),E.normalize();const q=E.z,ot=-E.x,Et=Math.atan2(E.x,E.z);let Ht=Et-b;for(;Ht>Math.PI;)Ht-=Math.PI*2;for(;Ht<-Math.PI;)Ht+=Math.PI*2;b=Et;const tt=Ht/$,V=Math.hypot(dt.velocity.x,dt.velocity.z),B=Math.abs(tt)*sR,kt=.66,Rt=Math.max(.62,1/(1+B*1.1)),Mt=Math.min(dt.stride*e.strideRatio,kt)*Rt,mt=V+B,Pt=Math.min(mt,6.4*Mt);mt>.02&&(A=(A+Pt/Math.max(Mt,.15)*$)%1);const L=Math.max(0,mt-Pt)*$,R=(dt.velocity.x-D)/$,Q=(dt.velocity.z-z)/$;D=dt.velocity.x,z=dt.velocity.z;const ft=1-Math.exp(-$*18);C+=(R*E.x+Q*E.z-C)*ft,T+=(R*q+Q*ot-T)*ft;const at=e.inertia,ht=Z(-C*.016,.1)*at,zt=Z(T*.014-V*tt*.02,.12)*at,Ct=Z(-C*.01,.05)*at,wt=Z(-C*.03,.16)*at;G(U.pitch,ht,9,$),G(U.roll,zt,8,$),G(U.lean,Ct,7,$),G(U.abdom,wt,5,$);const Xt=dt.position.y,xt=dt.grounded?0:1;M+=(xt-M)*Math.min(1,$*9);const It=1-.22*M;P+=$*6.6*Math.min(1,mt/1.4),c.position.y=e.height+Math.sin(P)*e.bob*Math.min(mt,1.4)-M*.02,c.position.z=U.lean.x,c.rotation.x=U.pitch.x,c.rotation.z=U.roll.x,v.rotation.x=vp+U.abdom.x,c.updateMatrixWorld(!0);let J=0,K=0;if(!k){k=!0;for(const st of _)pt(st,st.foot,Xt,It),st.from.copy(st.foot),st.to.copy(st.foot),st.swinging=!1}for(const st of _){const Ot=(A+st.phaseOffset)%1;if(Ot<e.duty)st.swinging=!1,L>0&&st.foot.addScaledVector(E,L),mt<.02?(pt(st,S,Xt,It),st.foot.lerp(S,Math.min(1,$*5))):M>.01&&(pt(st,S,Xt,It),st.foot.lerp(S,Math.min(1,$*6)));else{const Lt=(Ot-e.duty)/(1-e.duty);st.swinging||(st.swinging=!0,st.from.copy(st.foot),pt(st,st.to,Xt,It),st.to.addScaledVector(E,Mt*e.duty));const F=Lt*Lt*(3-2*Lt);st.foot.lerpVectors(st.from,st.to,F),st.foot.y=Xt+Math.sin(Math.PI*Lt)*e.lift}w.copy(st.foot),w.y+=Ur*.98,c.worldToLocal(w),w.sub(st.hip.position);const Ft=rR(w.x,w.y,w.z,st.L1,st.L2);st.hip.rotation.y=Ft.yaw,st.femur.rotation.x=Ft.femurPitch,st.tibia.rotation.x=Ft.tibiaPitch,st.tarsus.rotation.x=-(Ft.femurPitch+Ft.tibiaPitch)-.1,st.clamped=Ft.clamped,st.reach=Ft.reach,Ft.reach>J&&(J=Ft.reach),Ft.clamped&&K++}rt={maxReach:J,clamped:K,phase:A,strideUsed:Mt,gaitSpeed:Pt,effSpeed:mt,slide:L/Math.max($,1e-6),dt:$,pitch:U.pitch.x,roll:U.roll.x,leanZ:U.lean.x,abdomen:U.abdom.x,meshes:x,triangles:y}},legs:()=>_.map(dt=>({x:dt.foot.x,y:dt.foot.y,z:dt.foot.z,swinging:dt.swinging,reach:dt.reach})),debug:()=>rt,dispose(){i.forEach(dt=>dt.dispose()),i.length=0,r.clear()}}}const lR=Math.PI/3;function yp(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function hR(){let n=0,t=!1;return{update(e,i,a,s=lR){if(!Number.isFinite(e))return n;if(!t)return t=!0,n=e,n;if(!(a>0)||!(i>0))return n=e,n;const o=yp(e-n);if(Math.abs(o)>=s)return n=e,n;const r=1-Math.exp(-i/(a/1e3));return n=yp(n+o*r),n},reset(e){t=!0,n=e},get value(){return n},get ready(){return t}}}function dR(n){const t=Math.max(2,Math.floor(n.maxSamples)),e=new qe,i=new Float32Array(t*2*3),a=new Float32Array(t*2*3),s=new on(i,3),o=new on(a,3);s.setUsage(Ro),o.setUsage(Ro),e.setAttribute("position",s),e.setAttribute("color",o);const r=[];for(let x=0;x<t-1;x++){const y=x*2,S=y+1,w=y+2,E=y+3;r.push(y,S,w,S,E,w)}e.setIndex(r),e.setDrawRange(0,0);const c=new xn({vertexColors:!0,transparent:!0,opacity:1,blending:Ji,depthWrite:!1,side:je}),l=new ve(e,c);l.frustumCulled=!1,l.renderOrder=6,l.visible=!1;const h=new Qt(n.color);let u=[],d=null,f=0,m=0,v=!1,g=!1,p=0;function _(){const x=u.length;if(x<2||!n.enabled){l.visible=!1,e.setDrawRange(0,0);return}const y=Math.max(.001,n.life);for(let S=0;S<x;S++){const w=u[S],E=Math.max(0,1-w.age/y),A=E*E,b=Math.min(1,w.speed/Math.max(.001,n.minSpeed*2)),M=n.intensity*A*(.55+.45*b)*(1+p),P=.18+.82*E,k=S*6;i[k]=w.tx+(w.bx-w.tx)*P,i[k+1]=w.ty+(w.by-w.ty)*P,i[k+2]=w.tz+(w.bz-w.tz)*P,i[k+3]=w.tx,i[k+4]=w.ty,i[k+5]=w.tz;const D=h.r*M,z=h.g*M,C=h.b*M,T=D*.22,U=z*.22,G=C*.22;a[k]=T,a[k+1]=U,a[k+2]=G;const Z=1+n.tipBoost;a[k+3]=Math.min(1,D*Z),a[k+4]=Math.min(1,z*Z),a[k+5]=Math.min(1,C*Z)}s.needsUpdate=!0,o.needsUpdate=!0,e.setDrawRange(0,(x-1)*6),l.visible=!0}return{object:l,update(x,y,S){if(!n.enabled){l.visible=!1;return}const w=Math.max(0,x);p*=Math.exp(-Math.max(1,n.pulseDecay??14)*w),p<.001&&(p=0);for(const E of u)E.age+=w;for(;u.length>0&&u[0].age>n.life;)u.shift();if(y){const E=d?Math.hypot(y.tip.x-d.x,y.tip.y-d.y,y.tip.z-d.z)/Math.max(1e-4,w):0,A=u[u.length-1],b=A?Math.hypot(y.tip.x-A.tx,y.tip.y-A.ty,y.tip.z-A.tz):1/0;if(S&&b>=n.minStep)for(u.push({bx:y.base.x,by:y.base.y,bz:y.base.z,tx:y.tip.x,ty:y.tip.y,tz:y.tip.z,age:0,speed:E});u.length>t;)u.shift();d={x:y.tip.x,y:y.tip.y,z:y.tip.z},f=E,m=b,v=!0}else d=null,v=!1,f=0,m=0;g=S,_()},debug(){return{count:u.length,visible:l.visible,speed:f,moved:m,hasBlade:v,active:g,pulse:p}},pulse(x){!Number.isFinite(x)||x<=0||(p=Math.min(1.5,p+x))},reset(){u=[],d=null,p=0,l.visible=!1,e.setDrawRange(0,0)},dispose(){e.dispose(),c.dispose()}}}const uR=`#include <common>
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
}`,fR=`vec4 mvPosition = vec4( transformed, 1.0 );
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
  float effL = ${gu.toFixed(2)} * aWindGeom.x + aWindGeom.y;
  float theta = atan(sway, max(effL, 1e-3));
  float tLow = theta * ${gu.toFixed(2)};
  float tUp  = theta * ${ev.toFixed(2)};

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
gl_Position = projectionMatrix * mvPosition;`,pR=`#include <common>
varying float vWindShade;`,mR=`#include <color_fragment>
diffuseColor.rgb *= vWindShade;`;function gR(n,t,e,i,a){const s=Math.min(e.blades.length,Math.floor(Math.max(0,i.maxInstances)/2)),o=s*2,r=new Float32Array(o*2),c=new Float32Array(o*3),l=new Float32Array(o*4),h=Math.max(.01,i.segmentHeight);for(let f=0;f<s;f++){const m=e.blades[f],v=Math.min(h,m.height),g=Math.max(0,m.height-v),[p,_]=Qx(a,m.x,m.z,m.yaw*a.jitter),x=Math.min(1.4,Math.max(.6,m.height/(h*1.5)));for(let y=0;y<2;y++){const S=f*2+y;r[S*2]=p,r[S*2+1]=_,c[S*3]=m.x,c[S*3+1]=m.y,c[S*3+2]=m.z,l[S*4]=v,l[S*4+1]=g,l[S*4+2]=x,l[S*4+3]=y}}t.setAttribute("aWindPhase",new Co(r,2)),t.setAttribute("aWindRoot",new Co(c,3)),t.setAttribute("aWindGeom",new Co(l,4));const u=Zp(a),d={uWindTime:{value:0},uWindDir:{value:new Yt(u.dirX,u.dirZ)},uWindOmega:{value:new Yt(u.omega1,u.omega2)},uWindAmp:{value:new Yt(u.amp1,u.amp2)},uWindGust:{value:1},uWindShade:{value:u.shadeAmount},uWindOn:{value:a.enabled?1:0}};return n.onBeforeCompile=f=>{Object.assign(f.uniforms,d),f.vertexShader=f.vertexShader.replace("#include <common>",uR).replace("#include <project_vertex>",fR),f.fragmentShader=f.fragmentShader.replace("#include <common>",pR).replace("#include <color_fragment>",mR)},n.customProgramCacheKey=()=>"grass-wind-pivot-v2",d}function xR(n){let t=n>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function vR(n,t,e=No){const i=new ge;i.name="grass-layer";const s=n.blades.length,o=Math.max(0,Math.floor(t.maxInstances)),r=Math.min(s,Math.floor(o/2)),c=r*2,l=t.enabled&&c>0,u=(t.palette.length>0?t.palette:["#4a8f57"]).map(B=>new Qt(B)),d=new Qt(t.stumpColor),f=new Qt(t.debris.color),m=new qn(1,1,1),v=new qn(1,1,1),g=new Oi({color:16777215,transparent:!1}),p=gR(g,v,n,t,e),_=new Oi({color:f,transparent:!1});let x=null,y=null,S=null;const w=[],E=xR(2654435769^r),A=new Float32Array(r),b=new Uint8Array(r),M=new Float32Array(r),P=new Uint8Array(r).fill(1),k=new Ce,D=new Ma,z=new Ma,C=new Ma,T=new W,U=new W,G=new W,Z=new W,rt=new Qt,pt=new Qt,vt=new Ce().makeScale(0,0,0);let dt=0,Y=0,N=0,X=0,$=1,q=1;const ot=8;let Et={enabled:e.enabled,time:0,gust:1,mode:"pivot"};function Ht(B,kt){if(u.length===1)return kt.copy(u[0]);const Rt=Math.max(0,Math.min(u.length-1,B*(u.length-1))),Mt=Math.min(u.length-2,Math.max(0,Math.floor(Rt)));return kt.copy(u[Mt]).lerp(u[Mt+1],Math.min(1,Math.max(0,Rt-Mt)))}if(l){x=new Xf(v,g,c),x.instanceMatrix.setUsage(Ro),x.castShadow=!1,x.receiveShadow=!0,x.frustumCulled=!1,x.name="grass-blades",x.setColorAt(0,u[0]),y=x.instanceColor,y&&y.setUsage(Ro);for(let kt=0;kt<c;kt++)x.setMatrixAt(kt,vt);i.add(x);const B=Math.max(1,Math.floor(t.debris.max));S=new Xf(m,_,B),S.instanceMatrix.setUsage(Ro),S.castShadow=!1,S.receiveShadow=!1,S.frustumCulled=!1,S.name="grass-debris";for(let kt=0;kt<B;kt++)S.setMatrixAt(kt,vt);i.add(S)}i.visible=l;function tt(B,kt,Rt,Mt,mt,gt){if(!S)return;const Pt=S.count;if(w.length>=Pt)return;const L=t.debris.life,R=1.1+E()*1.5;w.push({x:B,y:kt,z:Rt,vx:Mt*R+(E()-.5)*1.2,vy:1.9+E()*1.8,vz:mt*R+(E()-.5)*1.2,life:L,total:L,size:gt*(.55+E()*.45),spin:(E()-.5)*9})}function V(B){if(!S)return;const kt=S.count,Rt=12;for(let mt=w.length-1;mt>=0;mt--){const gt=w[mt];if(gt.life-=B,gt.life<=0){w.splice(mt,1);continue}gt.vy-=Rt*B,gt.x+=gt.vx*B,gt.y+=gt.vy*B,gt.z+=gt.vz*B,gt.y<.02&&(gt.y=.02,gt.vy=-gt.vy*.25,gt.vx*=.6,gt.vz*=.6)}const Mt=1e-4;for(let mt=0;mt<kt;mt++){const gt=w[mt];if(!gt){S.setMatrixAt(mt,vt);continue}const Pt=Math.max(Mt,gt.life/gt.total);U.set(gt.x,gt.y,gt.z),T.set(.4+mt*.13,1,.2).normalize(),D.setFromAxisAngle(T,gt.spin*(gt.total-gt.life)),G.set(gt.size*Pt,gt.size*.7*Pt,gt.size*Pt),k.compose(U,D,G),S.setMatrixAt(mt,k)}S.instanceMatrix.needsUpdate=!0}return{object:i,update(B,kt){var st,Ot,Ft;if(!l||!x)return;const Rt=B.grass,Mt=((st=B.config.grass)==null?void 0:st.wind)??No,mt=Zp(Mt),gt=((Ot=Rt.wind)==null?void 0:Ot.time)??0,Pt=((Ft=Rt.wind)==null?void 0:Ft.gust)??1;p.uWindTime.value=gt,p.uWindGust.value=Pt,p.uWindDir.value.set(mt.dirX,mt.dirZ),p.uWindOmega.value.set(mt.omega1,mt.omega2),p.uWindAmp.value.set(mt.amp1,mt.amp2),p.uWindShade.value=mt.shadeAmount,p.uWindOn.value=Mt.enabled?1:0,Et={enabled:Mt.enabled,time:gt,gust:Pt,mode:"pivot"};const L=Math.min(r,Rt.blades.length),R=Math.min(.05,Math.max(0,kt)),Q=B.config.grass,ft=(Q==null?void 0:Q.regrowSec)??0,at=Math.min(1,Math.max(.05,(Q==null?void 0:Q.stumpRatio)??.34)),ht=t.segmentHeight,zt=Math.PI*2;x.instanceMatrix.clearUpdateRanges(),y&&y.clearUpdateRanges();let Ct=0,wt=0,Xt=0,xt=0,It=0,J=0,K=0;for(let Lt=0;Lt<L;Lt++){const F=Rt.blades[Lt],St=F.cut!==0?1:0,j=F.yaw/zt,ut=nv(F.cut,ft,j),Nt=Math.min(ht,F.height),Dt=Nt*at,qt=Dt+(F.height-Dt)*ut;if(Lt<ot&&(J+=qt/Math.max(1e-6,F.height),K+=1),ut>.001&&ut<1-.001&&(xt+=1,It+=ut),!(P[Lt]===1||Math.abs(F.bend-A[Lt])>1e-4||St!==b[Lt]||Math.abs(ut-M[Lt])>.001)){F.bend>.02&&(wt+=1),St&&(Xt+=1);continue}St&&!b[Lt]&&P[Lt]!==1&&(tt(F.x,F.y+Nt*.75,F.z,F.bendX||1,F.bendZ||0,F.width*1.5),tt(F.x,F.y+Nt+(F.height-Nt)*.5,F.z,F.bendX||1,F.bendZ||0,F.width*1.2)),T.set(Math.cos(F.yaw),0,-Math.sin(F.yaw)),C.setFromAxisAngle(T,F.lean),T.set(F.bendZ,0,-F.bendX),z.setFromAxisAngle(T,F.bend),D.copy(z).multiply(C),Z.set(F.x,F.y,F.z);const he=Math.min(ht,qt),ee=Math.max(0,qt-ht);U.set(0,he*.5,0).applyQuaternion(D).add(Z),G.set(F.width,he,F.width),k.compose(U,D,G),x.setMatrixAt(Lt*2,k),ee<1e-4?x.setMatrixAt(Lt*2+1,vt):(U.set(0,he+ee*.5,0).applyQuaternion(D).add(Z),G.set(F.width*.84,ee,F.width*.84),k.compose(U,D,G),x.setMatrixAt(Lt*2+1,k)),Ht(F.tone,pt),ut>=1?rt.copy(pt):rt.copy(d).lerp(pt,ut),x.setColorAt(Lt*2,rt),x.setColorAt(Lt*2+1,rt),x.instanceMatrix.addUpdateRange(Lt*32,32),y&&y.addUpdateRange(Lt*6,6),A[Lt]=F.bend,b[Lt]=St,M[Lt]=ut,P[Lt]=0,Ct+=1,F.bend>.02&&(wt+=1),St&&(Xt+=1)}Ct>0&&(x.instanceMatrix.needsUpdate=!0,y&&(y.needsUpdate=!0)),V(R),dt=Ct,Y=wt,N=Xt,X=xt,$=xt>0?It/xt:1,q=K>0?J/K:1},debug(){return{enabled:l,blades:s,patches:n.patches.length,instances:c,drawCalls:l?2:0,dirty:dt,bent:Y,cut:N,debris:w.length,growing:X,avgGrowth:$,sampleHeight:q,wind:{...Et}}},dispose(){m.dispose(),v.dispose(),g.dispose(),_.dispose(),i.clear()}}}const kl=10,yR=.14,Eo=1e-6;function _o(n,t,e){return n<t?t:n>e?e:n}function Mp(n,t,e,i){const a=t.length,s=[],o=(h,u,d)=>{s.push(h[0],h[1],h[2],u[0],u[1],u[2],d[0],d[1],d[2])},r=(h,u)=>{const d=u/a*Math.PI*2;return[Math.cos(d)*n,h,Math.sin(d)*n]};for(let h=0;h<a;h++){const u=(h+1)%a,d=r(t[h],h),f=r(t[u],u),m=r(e[h],h),v=r(e[u],u);o(d,f,v),o(d,v,m)}const c=a*6;if(i!=="none"){const h=i==="b"?e:t;let u=0;for(let d=0;d<a;d++)u+=h[d];u/=a;for(let d=0;d<a;d++){const f=(d+1)%a;o([0,u,0],r(h[d],d),r(h[f],f))}}const l=new qe;return l.setAttribute("position",new Le(s,3)),l.addGroup(0,c,0),i!=="none"&&l.addGroup(c,a*3,1),l.computeVertexNormals(),l}function MR(n,t,e,i){const a={x:t.x-n.x,y:t.y-n.y,z:t.z-n.z},s={x:i.x-e.x,y:i.y-e.y,z:i.z-e.z},o={x:n.x-e.x,y:n.y-e.y,z:n.z-e.z},r=(v,g)=>v.x*g.x+v.y*g.y+v.z*g.z,c=r(a,a),l=r(s,s),h=r(s,o);let u=0,d=0;if(c<=Eo&&l<=Eo)u=0,d=0;else if(c<=Eo)u=0,d=_o(h/l,0,1);else{const v=r(a,o);if(l<=Eo)d=0,u=_o(-v/c,0,1);else{const g=r(a,s),p=c*l-g*g;u=p!==0?_o((g*h-v*l)/p,0,1):0,d=(g*u+h)/l,d<0?(d=0,u=_o(-v/c,0,1)):d>1&&(d=1,u=_o((g-v)/c,0,1))}}const f={x:n.x+a.x*u,y:n.y+a.y*u,z:n.z+a.z*u},m={x:e.x+s.x*d,y:e.y+s.y*d,z:e.z+s.z*d};return{dist:Math.hypot(f.x-m.x,f.y-m.y,f.z-m.z),cq:m}}function _R(n){const t=new ge;t.name="destructibles";const e=[];let i=null,a=null;for(const f of n){const m=new Oi({color:new Qt(f.color),side:je}),v=new Oi({color:new Qt(f.cutColor),side:je}),g=new ve(new qe,[m,v]),p=new ve(new qe,[m,v]);g.name=`lower-${f.id}`,p.name=`upper-${f.id}`;const _=new ge;_.add(p);const x=new ge;x.name=`piece-${f.id}`,x.position.set(f.x,f.y,f.z),x.add(g,_),t.add(x),e.push({id:f.id,root:x,lower:g,upperGroup:_,upper:p,bodyMat:m,capMat:v,key:""})}const s=(f,m)=>{const v=m.cutU*m.height,g=dv(m.radius,kl,m.cutU,m.height,m.nx,m.ny,m.nz),p=new Array(kl).fill(0),_=new Array(kl).fill(m.height),x=Mp(m.radius,p,g,"b"),y=Mp(m.radius,g.map(S=>S-v),_.map(S=>S-v),"a");f.lower.geometry.dispose(),f.upper.geometry.dispose(),f.lower.geometry=x,f.upper.geometry=y},o=new W;function r(f){for(let m=0;m<e.length;m++){const v=e[m];let g;for(let _=0;_<f.length;_++)if(f[_].id===v.id){g=f[_];break}if(!g){v.upperGroup.visible=!1;continue}const p=`${g.broken}|${g.cutU}|${g.theta}|${g.nx}|${g.ny}|${g.nz}`;p!==v.key&&(s(v,g),v.key=p),v.bodyMat.color.set(g.color),v.capMat.color.set(g.cutColor),v.root.position.set(g.x,g.y,g.z),v.upperGroup.visible=g.broken!==0,v.upperGroup.position.set(0,g.cutU*g.height,0),o.set(g.ax,g.ay,g.az),v.upperGroup.quaternion.setFromAxisAngle(o,g.fall)}}function c(f,m){const v=[],g=(p,_)=>{if(!p){_==="right"?i=null:a=null;return}const x={x:(p.base.x+p.tip.x)/2,y:(p.base.y+p.tip.y)/2,z:(p.base.z+p.tip.z)/2},y=_==="right"?i:a;if(_==="right"?i=x:a=x,!y)return;let S=p.tip.x-p.base.x,w=p.tip.y-p.base.y,E=p.tip.z-p.base.z;const A=x.x-y.x,b=x.y-y.y,M=x.z-y.z;Math.hypot(A,b,M)>.002&&(S=A,w=b,E=M);const k=Math.hypot(S,w,E);k>Eo?(S/=k,w/=k,E/=k):(S=0,w=0,E=1);const D={x:0,y:0,z:0},z={x:0,y:0,z:0};for(let C=0;C<f.length;C++){const T=f[C];if(T.broken!==0)continue;D.x=T.x,D.y=T.y,D.z=T.z,z.x=T.x,z.y=T.y+T.height,z.z=T.z;const U=MR(p.base,p.tip,D,z);if(!(U.dist>T.radius+yR)){v.push({id:T.id,x:U.cq.x,y:U.cq.y,z:U.cq.z,dx:S,dy:w,dz:E});break}}};return g(m.right,"right"),g(m.left,"left"),v}function l(){let f=0;const m=[],v=[];let g=0;for(const p of e)p.lower.visible&&(f+=1),p.upperGroup.visible&&(f+=1),v.push({id:p.id,x:p.root.position.x,y:p.root.position.y,z:p.root.position.z});for(const p of h)p.broken!==0&&(g+=1,m.push({id:p.id,cutU:p.cutU,theta:p.theta,nx:p.nx,ny:p.ny,nz:p.nz,fall:p.fall}));return{count:e.length,broken:g,drawCalls:f,positions:v,cuts:m}}let h=n;const u=f=>{h=f,r(f)};function d(){for(const f of e)f.lower.geometry.dispose(),f.upper.geometry.dispose(),f.bodyMat.dispose(),f.capMat.dispose();t.clear()}return u(n),{object:t,update:u,computeHits:c,debug:l,dispose:d}}function bR(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function SR(n,t,e,i,a){var se,ne,jt,ue,ie;const s=Math.max(1,n.clientWidth),o=Math.max(1,n.clientHeight),r=new lA({antialias:!0});r.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),r.shadowMap.enabled=!0,r.shadowMap.type=lm,r.setSize(s,o,!1),n.appendChild(r.domElement);const c=new hA;c.background=new Qt("#12161d"),c.add(new $A(11061486,2764600,1.15));const l=(t.gridMeta.minX+t.gridMeta.maxX)/2,h=(t.gridMeta.minZ+t.gridMeta.maxZ)/2,u=Math.max(t.gridMeta.maxX-t.gridMeta.minX,t.gridMeta.maxZ-t.gridMeta.minZ)/2+4,d=new qA(16773852,1.5);d.position.set(l+9,18,h+11),d.target.position.set(l,0,h),d.castShadow=!0,d.shadow.mapSize.set(2048,2048);const f=d.shadow.camera;f.left=-u,f.right=u,f.top=u,f.bottom=-u,f.near=1,f.far=90,c.add(d),c.add(d.target);const m=[],v=new ge;for(const H of t.boxes){const At=H.maxX-H.minX,bt=H.maxY-H.minY,_t=H.maxZ-H.minZ;let te=bR(H.kind,e);H.kind==="step"&&(te=new Qt(te).offsetHSL(0,0,H.maxY*.09).getStyle());const Bt=new Oi({color:te,transparent:!1,opacity:1}),oe=new ve(new qn(At,bt,_t),Bt);oe.position.set((H.minX+H.maxX)/2,(H.minY+H.maxY)/2,(H.minZ+H.maxZ)/2),oe.castShadow=H.kind!=="ground",oe.receiveShadow=!0,oe.add(new Zf(new RA(oe.geometry),new Nh({color:10467020,transparent:!0,opacity:.32}))),v.add(oe),m.push(Bt)}c.add(v);const g=t.gridMeta,p=[],_=[],x=.002,y=1;for(let H=g.minX;H<=g.maxX+1e-6;H+=y)(Math.round(H/y)%5===0?_:p).push(H,x,g.minZ,H,x,g.maxZ);for(let H=g.minZ;H<=g.maxZ+1e-6;H+=y)(Math.round(H/y)%5===0?_:p).push(g.minX,x,H,g.maxX,x,H);const S=new ge,w=[[p,3358797,.5],[_,4873328,.85]];for(const[H,At,bt]of w){const _t=new qe;_t.setAttribute("position",new Le(H,3)),S.add(new Zf(_t,new Nh({color:At,transparent:!0,opacity:bt})))}S.visible=e.showGrid,c.add(S);const E=H2(i,e,a);c.add(E.group);const A=vR(t.grass,e.grass,t.config.grass.wind);Cl(A.object,$e.grass),c.add(A.object);const b=_R(t.destructibles);c.add(b.object);let M=[];const P=H=>(H==null?void 0:H.rig)==="spider"?(C=.17,e.camera.pitchDeg=27,cR(e.colors,{height:.35,scale:1.3})):(C=1,e.camera.pitchDeg=k,y0((H==null?void 0:H.voxel)??e.voxel,H!=null&&H.colors?{...e.colors,...H.colors}:e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links,e.weaponWrist,e.balance)),k=e.camera.pitchDeg,D=typeof location<"u"?new URLSearchParams(location.search).get("hero"):null;let z=D&&((se=e.bodyTypes)!=null&&se[D])?D:"standard",C=1,T=P((ne=e.bodyTypes)==null?void 0:ne[z]);const U=dR(e.weaponTrail);Cl(U.object,$e.trail),c.add(U.object);const G=new ge,Z=new ge;let rt=.9;const pt=H=>(H==null?void 0:H.rig)==="spider"?.26:.9,vt=(H,At)=>{rt=At,Z.position.y=At,H.group.position.y=-At,Z.add(H.group)};vt(T,pt((jt=e.bodyTypes)==null?void 0:jt[z])),G.add(Z),c.add(G);const dt=t.config.moveSpeed,Y=H=>{H&&(t.config.characterHeight=H.height,H.radius!==void 0&&(t.config.characterRadius=H.radius),t.config.moveSpeed=H.moveSpeed??dt)};Y((ue=e.bodyTypes)==null?void 0:ue[z]);const N=hR();let X=0;const $=((ie=t.config.dummies.fighters)==null?void 0:ie.moveSpeed)??t.config.dummies.moveSpeed;function q(H,At){const bt=e.dummies.colors,_t=bt[At%bt.length]??"#cccccc";let te;if(H.weapon){const Bt=e.dummies.fighterColors,oe=Bt&&Bt.length>0?Bt[(At-t.config.dummies.count)%Bt.length]:void 0;te=B2({voxel:e.voxel,colors:oe?{...e.colors,...oe}:e.colors,moveSpeed:$,orientation:e.orientation,gait:e.gait,mount:e.weaponMount,lean:e.lean,hurt:e.hurt,animation:e.animation,ik:e.ik,links:e.links,wrist:e.weaponWrist,balance:e.balance})}else{const Bt=v2(e.voxel,e.colors,_t,H.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);te={group:Bt.group,update:(oe,ke)=>Bt.update(oe,ke),boneAtWorld:(oe,ke,be)=>Bt.boneAtWorld(oe,ke,be),dispose:()=>Bt.dispose()}}return te.group.traverse(Bt=>{Bt.userData.dummyId=H.id}),c.add(te.group),te}const ot=t.dummies.map(q),Et=ot.map(H=>H.group),Ht=new KA,tt=e.groundRing,V=e.voxel.bodyWidth,B=fp(V,tt.playerRadiusFactor),kt=fp(V,tt.dummyRadiusFactor),Rt=V*tt.thicknessFactor,Mt=tt.arcDeg*Math.PI/180;let mt=0;const gt=(H,At,bt)=>zp(t.boxes,H,At,bt+.55,0),Pt=Ll({radius:B,thickness:Rt,arcRad:Mt,edgeFade:tt.edgeFade,color:tt.playerColor,opacity:tt.playerOpacity,y:.028,renderOrder:$e.ring});Pt.mesh.name="player-ground-ring",c.add(Pt.mesh);function L(H){const At=Ll({radius:kt,thickness:Rt,arcRad:Mt,edgeFade:tt.edgeFade,color:tt.neutralColor,opacity:tt.opacity,y:.022,renderOrder:$e.ring});return At.mesh.name=`dummy-ground-ring-${H.id}`,c.add(At.mesh),At}function R(H){const At=Ll({radius:kt*tt.haloRadiusFactor,thickness:Rt*tt.haloThicknessFactor,arcRad:Mt,edgeFade:tt.edgeFade,color:tt.neutralColor,opacity:0,profile:"glow",y:.019,renderOrder:$e.ringHalo});return At.mesh.name=`dummy-ground-halo-${H.id}`,c.add(At.mesh),At}function Q(H){const At=pp({radius:kt*tt.warnRadiusFactor,thickness:Rt*tt.warnThicknessFactor,arcRad:Mt,edgeFade:.02,color:tt.warnColor,y:.031,renderOrder:$e.ringWarn});return At.mesh.name=`dummy-ground-warn-${H.id}`,c.add(At.mesh),At}const ft=t.dummies.map(L),at=t.dummies.map(R),ht=t.dummies.map(()=>0),zt=t.dummies.map(()=>0),Ct=pp({radius:B*tt.meterRadiusFactor,thickness:Rt*tt.meterThicknessFactor,arcRad:Mt,edgeFade:.06,color:tt.meterColorCharge,y:.03,renderOrder:$e.ringMeter});Ct.mesh.name="player-ground-meter",c.add(Ct.mesh);const wt=t.dummies.map(Q),Xt=mp({color:tt.playerColor,y:.042,renderOrder:$e.groundArea});Xt.group.name="player-landing-preview",c.add(Xt.group);const xt=new Qt,It=new Qt(tt.playerColor),J=new Qt(tt.neutralColor),K=new Qt(tt.lowThreatColor),st=new Qt(tt.highThreatColor),Ot=new Qt(tt.meterColorCharge),Ft=new Qt(tt.meterColorChannel),Lt=new Qt(tt.meterColorCooldown),F=new Qt(tt.warnColor),St=new ge;c.add(St);const j=e.projectiles;function ut(){const At=document.createElement("canvas");At.width=64,At.height=64;const bt=At.getContext("2d");if(bt){const te=bt.createRadialGradient(32,32,0,32,32,32);te.addColorStop(0,"rgba(255,255,255,1)"),te.addColorStop(.28,"rgba(255,255,255,0.72)"),te.addColorStop(.62,"rgba(255,255,255,0.22)"),te.addColorStop(1,"rgba(255,255,255,0)"),bt.fillStyle=te,bt.fillRect(0,0,64,64)}const _t=new Oh(At);return _t.colorSpace=Hn,_t}function Nt(){const bt=document.createElement("canvas");bt.width=2,bt.height=64;const _t=bt.getContext("2d");if(_t){const Bt=_t.createLinearGradient(0,0,0,64);Bt.addColorStop(0,"rgba(255,255,255,0)"),Bt.addColorStop(.55,"rgba(255,255,255,0.35)"),Bt.addColorStop(1,"rgba(255,255,255,0.95)"),_t.fillStyle=Bt,_t.fillRect(0,0,2,64)}const te=new Oh(bt);return te.colorSpace=Hn,te}const Dt=ut(),qt=Nt(),le=new xn({color:12577023,transparent:!0,opacity:0,side:je,depthWrite:!1}),he=new xn({color:14217983,transparent:!0,opacity:0,side:je,depthWrite:!1,blending:Ji}),ee=new ge;ee.position.set(0,.95,.72),St.add(ee);const we=new ge;we.rotation.x=Q2(e.camera.pitchDeg),ee.add(we);const De=new Sc(.78,j.slashThickness,6,28,Math.PI*1.15),Ve=new ge,Mn=new ve(De,le),Re=new ve(De,he);Re.scale.setScalar(1.09),Cl(Ve,$e.slash),Re.renderOrder=$e.slash+1,Ve.add(Mn,Re),we.add(Ve);const Pe=new qn(j.arrowWidth,j.arrowWidth,j.arrowLength),fn=new vd(j.arrowHeadSize*.42,j.arrowHeadSize,4);fn.rotateX(Math.PI/2);const Rn=new qn(j.arrowWidth*2.6,j.arrowWidth*.4,.1),nn=new Go(j.arrowWidth*.45,j.arrowWidth*1.3,j.trailLength,6,1,!0);nn.rotateX(-Math.PI/2),nn.translate(0,0,-j.trailLength/2);const En=Array.from({length:10},()=>{const H=new ge,At=new xn({color:j.arrowColor,transparent:!0}),bt=new xn({color:j.arrowHeadColor,transparent:!0}),_t=new Uh({map:Dt,color:j.arrowColor,transparent:!0,opacity:.85,blending:Ji,depthWrite:!1}),te=new xn({color:j.arrowTrailColor,map:qt,transparent:!0,opacity:0,blending:Ji,depthWrite:!1,side:je}),Bt=new ve(Pe,At),oe=new ve(fn,bt);oe.position.z=j.arrowLength/2+j.arrowHeadSize*.42;const ke=new ve(Rn,bt),be=new ve(Rn,bt);ke.position.z=-j.arrowLength/2+.08,be.position.z=ke.position.z,be.rotation.z=Math.PI/2;const Oe=new Bf(_t);Oe.scale.setScalar(j.arrowGlowSize),Oe.renderOrder=$e.projectileGlow;const xe=new ve(nn,te);return xe.renderOrder=$e.projectileTrail,Bt.renderOrder=$e.projectile,oe.renderOrder=$e.projectile,ke.renderOrder=$e.projectile,be.renderOrder=$e.projectile,H.add(Bt,oe,ke,be,Oe,xe),H.visible=!1,c.add(H),{group:H,shaftMat:At,tipMat:bt,glowMat:_t,trailMat:te,glow:Oe,trail:xe,arrowId:0,bone:null}}),Tn=new Md(1,0),Xn=new W(j.boltShapeX,j.boltShapeY,j.boltShapeZ),Vn=new xn({color:j.boltColor,transparent:!0,opacity:.98,depthWrite:!1}),wi=new Uh({map:Dt,color:j.boltGlowColor,transparent:!0,opacity:.45,blending:Ji,depthWrite:!1}),Ei=new xn({color:j.boltGlowColor,map:qt,transparent:!0,opacity:j.trailOpacity,blending:Ji,depthWrite:!1,side:je}),pn=new Go(.5,.03,j.boltTrailScale,6,1,!0);pn.rotateX(-Math.PI/2),pn.translate(0,0,-j.boltTrailScale/2);const I=Array.from({length:24},()=>{const H=new ge,At=new ve(Tn,Vn);At.scale.copy(Xn);const bt=new Bf(wi);bt.scale.setScalar(j.boltGlowScale),bt.renderOrder=$e.projectileGlow;const _t=new ve(pn,Ei);return _t.renderOrder=$e.projectileTrail,At.renderOrder=$e.projectile,H.add(At,bt,_t),H.visible=!1,c.add(H),{group:H,core:At}}),nt=Array.from({length:6},()=>{const H=mp({color:"#9ad0ff",edgeWidthRatio:.038,y:.045,renderOrder:$e.groundArea});return H.group.visible=!1,c.add(H.group),H}),lt=G2(c,e,t,gt),ct=QA(e.camera,e.smartCamera,e.zoom,s/o),et=t.character.position;ct.update(et.x,et.y,et.z,1,t.camera);function Ut(H){const At=H.dummies.length;for(;ot.length<At;){const _t=ot.length,te=H.dummies[_t],Bt=q(te,_t);ot.push(Bt),Et.push(Bt.group),ft.push(L(te)),at.push(R(te)),wt.push(Q(te)),ht.push(0),zt.push(0)}let bt=!1;for(;ot.length>At;){bt=!0;const _t=ot.pop();c.remove(_t.group),_t.dispose(),Et.pop();const te=ft.pop();c.remove(te.mesh),te.dispose();const Bt=at.pop();c.remove(Bt.mesh),Bt.dispose();const oe=wt.pop();c.remove(oe.mesh),oe.dispose(),ht.pop(),zt.pop()}if(bt)for(let _t=0;_t<At;_t++){const te=H.dummies[_t].id;ot[_t].group.userData.dummyId!==te&&ot[_t].group.traverse(Bt=>{Bt.userData.dummyId=te})}}function Vt(H,At){if(Et.length===0)return 0;const bt=r.domElement.getBoundingClientRect(),_t=new Yt((H-bt.left)/bt.width*2-1,-((At-bt.top)/bt.height)*2+1);Ht.setFromCamera(_t,ct.camera);const te=Ht.intersectObjects(Et,!0);for(const Bt of te){const oe=Bt.object.userData.dummyId;if(oe&&oe>0)return oe}return 0}function Zt(H,At,bt){const _t=r.domElement.getBoundingClientRect(),te=new W(H,At,bt).project(ct.camera);return{x:_t.left+(te.x*.5+.5)*_t.width,y:_t.top+(-te.y*.5+.5)*_t.height}}let $t=!1;return{balanceDebug(){var H;return((H=T.balanceDebug)==null?void 0:H.call(T))??null},spineDebug(){var H;return((H=T.spineDebug)==null?void 0:H.call(T))??null},spiderDebug(){var H;return((H=T.debug)==null?void 0:H.call(T))??null},gaitDebug(){var H;return((H=T.gaitDebug)==null?void 0:H.call(T))??{stopT:0,hipYaw:0,chestYaw:0,speed:0,gaitSpeed:0,stopStep:0,stopShift:0,stopDip:0,stopYawFade:0,turnStep:0,legLPitch:0,legLRoll:0,legRPitch:0,legRRoll:0,legTakeover:0,phase:0,dirF:0,dirR:0,hipYawTarget:0,spin:0}},trailDebug(){return U.debug()},stretchDebug(){var At;const H=((At=T.stretch)==null?void 0:At.call(T))??{arm:1,leg:1,torso:1,impact:0};return{arm:H.arm,leg:H.leg,torso:H.torso,impact:H.impact}},swingDebug(){var H;return((H=T.swingDebug)==null?void 0:H.call(T))??{seg:0,kind:"none",lead:"R",yaw:0,pitch:0,roll:0,strike:0,rootYaw:0,spinYaw:0,rootTurn:0,bladeTwist:0,bladeTwistOff:0,bladeYaw:0,bladeYawOff:0,shoulderL:{x:0,y:0,z:0},shoulderR:{x:0,y:0,z:0}}},stanceDebug(){var H;return((H=T.stanceDebug)==null?void 0:H.call(T))??{weapon:t.combat.weapon,weight:0,armL:{pitch:0,yaw:0,roll:0,elbow:0},armR:{pitch:0,yaw:0,roll:0,elbow:0},torsoYaw:0,torsoPitch:0,bladePitchDeg:0,bladePitchOffDeg:0,armSwing:0}},bladeWorld(){var H;return((H=T.weaponBlade)==null?void 0:H.call(T))??null},bladesWorld(){var H;return((H=T.bladesWorld)==null?void 0:H.call(T))??{right:null,left:null}},slamDebug(){return lt.slamDebug()},yawDebug(){var H;return{target:X,shown:N.value,tauMs:((H=e.renderInterp)==null?void 0:H.yawSmoothMs)??0}},grassDebug(){return A.debug()},breakHits(){return M},destructibleDebug(){return b.debug()},fxDebug(){var H,At;return{boxOpaque:m.every(bt=>!bt.transparent),boxCount:m.length,orders:{ring:Pt.mesh.renderOrder,groundFx:lt.groundOrder(),trail:U.object.renderOrder,slash:Ve.renderOrder,projectile:((At=(H=En[0])==null?void 0:H.group.children[0])==null?void 0:At.renderOrder)??-1}}},renderPose(){return{x:G.position.x,y:G.position.y,z:G.position.z,bodyYaw:G.rotation.y}},projectPoint(H,At,bt){return Zt(H,At,bt)},setClipT(H){var At;(At=T.setClipT)==null||At.call(T,H)},weaponDebug(){var H;return((H=T.weaponDebug)==null?void 0:H.call(T))??{wristPitch:0,wristTwist:0}},gripDebug(){var H;return((H=T.gripDebug)==null?void 0:H.call(T))??{active:!1,dist:0,gy:0,pitch:0,joint:0,grip:0}},render(H,At){var Wn,Qs,Kn;Ut(H);const bt=H.character,_t=H.combat,te=e.hitstop.enabled&&H.combat.hitstop>0,Bt=At*Math.max(0,Math.min(4,_t.warp??1));if(te&&!$t){const ce=Math.max(0,H.combat.hitstop),Gt=Math.max(0,Math.min(1,ce/.1));ct.addShake(.34+Gt*.48);let de=null;for(let rn=0;rn<H.events.length;rn++){const bn=H.events[rn];if(bn.type==="hit"){de=bn;break}}de&&ct.addKick(de.x-bt.position.x,de.z-bt.position.z,.03+Gt*.05)}$t=te;for(let ce=0;ce<H.events.length;ce++){const Gt=H.events[ce];if(Gt.type!=="notify")continue;const de=Number.isFinite(Gt.value)?Gt.value:0;if(Gt.name==="blade-air"){const rn=Math.max(0,Math.min(1,de));U.pulse((_t.weapon==="greatsword"?.9:.55)*(.4+.6*rn))}}G.position.set(bt.position.x,bt.position.y,bt.position.z),X=bt.bodyYaw,G.rotation.y=N.update(X,At,((Wn=e.renderInterp)==null?void 0:Wn.yawSmoothMs)??0);const oe=H.dash.phase==="active"&&H.dash.kind==="roll",ke=oe&&H.dash.duration>0?Math.min(1,1-H.dash.timer/H.dash.duration):0;if(Z.rotation.x=oe?ke*Math.PI*2:0,Z.position.y=rt-(oe?.2*Math.sin(Math.PI*ke):0),Bt>0&&T.update(bt,_t,H.playerHurt,Bt,H.abilities.channeling,H.time,H.playerLink,H.turnInPlace),U.update(Bt,Bt>0?((Qs=T.weaponBlade)==null?void 0:Qs.call(T))??null:null,Bt>0&&(_t.phase==="active"||H.playerLink.phase==="active"||oe&&H.dash.duration>0)),Bt>0)for(let ce=0;ce<ot.length;ce++)H.dummies[ce]&&ot[ce].update(H.dummies[ce],Bt,H.time);const be=ct.camera.position,Oe=Math.atan2(be.x-bt.position.x,be.z-bt.position.z),xe=H.config.gaze.hurtHoldSec,fe=H.time-H.playerHurt.lastAt,Ae=xe>0&&fe>=0&&fe<xe?1-fe/xe:0,He=W2(H.gaze.active,H.gaze.threat,Ae,H.time,tt);Y2(xt,It,K,st,He.level),mt=J2(bt.grounded,bt.position.y,mt),Pt.mesh.position.set(bt.position.x,mt+.028,bt.position.z),Pt.update(He.arcRad,He.opacity,He.scale,xt,Oe);const hn=H.config.abilities.arcane,Pn=Math.max(1,Math.floor(hn.waves)),pi=Math.max(1e-4,hn.waveInterval),Ti=j2({charging:_t.charging,charge:_t.charge,channeling:H.abilities.channeling,fireTimer:H.abilities.fireTimer,fireInterval:pi,channelProgress:H.abilities.channeling?(H.abilities.waveIndex+(1-Math.min(1,Math.max(0,H.abilities.fireTimer/pi))))/Pn:0,arcaneCooldown:H.abilities.cooldown,arcaneCooldownMax:hn.cooldown,dashCooldown:H.dash.cooldown,dashCooldownMax:H.dash.kind==="blink"?H.config.dash.blinkCooldown:H.config.dash.rollCooldown});Ct.mesh.position.set(bt.position.x,bt.position.y+.03,bt.position.z),Ct.set(Ti.ratio,Ti.source==="none"?0:tt.meterOpacity,Ti.source==="charge"?Ot:Ti.source==="channel"?Ft:Lt,Oe);const mi=H.playerLink,ri=mi.weapon?H.config.links.moves[mi.weapon]:void 0,_n=q2(mi.phase,bt.position.x,bt.position.z,mi.facing,mi.travel,(ri==null?void 0:ri.hit.radius)??.9);Xt.set(_n.x,_n.z,gt(_n.x,_n.z,bt.position.y)+.042,_n.radius,_n.active?tt.landingOpacity:0,H.time);for(let ce=0;ce<ft.length;ce++){const Gt=H.dummies[ce],de=ft[ce],rn=at[ce],bn=wt[ce];if(!Gt){de.mesh.visible=!1,rn.mesh.visible=!1,bn.mesh.visible=!1;continue}const Hi=H.targeting.hasTarget&&H.targeting.targetId===Gt.id;if(qx(H,Gt)){const Ta=Kx(H,Gt);xt.copy(K).lerp(st,Ta)}else xt.copy(J);const Cn=Z2(Gt.attackPhase,Gt.attackPhaseTimer,H.config.dummies.attackWindup);Cn.active?(xt.lerp(F,.5*Cn.urgency),bn.mesh.position.set(Gt.position.x,Gt.position.y+.031,Gt.position.z),bn.set(Cn.ratio,tt.warnOpacity*(.65+.35*Cn.urgency),F,Oe)):bn.set(0,0,F,Oe);const ci=Hi?1:0,wa=ci>ht[ce]?tt.haloFadeInSec:tt.haloFadeOutSec;ht[ce]=gp(ht[ce],ci,At,wa);const Ea=ht[ce],ts=1+.02*Ea*Math.sin(H.time*2.2+Gt.id),es=tt.arcDeg+(tt.selectedArcDeg-tt.arcDeg)*Ea;de.mesh.position.set(Gt.position.x,Gt.position.y+.022,Gt.position.z),de.update(es*Math.PI/180,tt.opacity+(tt.selectedOpacity-tt.opacity)*Ea,1+(tt.selectedScale-1)*Ea*ts,xt,Oe,1+(tt.selectedThicknessScale-1)*Ea),zt[ce]=gp(zt[ce],ci,At,ci>zt[ce]?tt.haloFadeInSec:tt.haloFadeOutSec);const ns=zt[ce];rn.mesh.position.set(Gt.position.x,Gt.position.y+.019,Gt.position.z),rn.update(es*Math.PI/180,tt.haloOpacity*ns*(.88+.12*Math.sin(H.time*2.2+Gt.id)),tt.selectedScale*(.94+.06*ns)*ts,xt,Oe)}St.position.set(bt.position.x,bt.position.y,bt.position.z),St.rotation.y=_t.phase!=="idle"?_t.attackFacing:bt.bodyYaw,lt.update(H,At,ce=>ct.addShake(ce));const mn=j.slashEnabled&&_t.phase==="active"&&_t.comboIndex>=3;le.opacity=mn?.7:0,he.opacity=mn?j.slashGlowOpacity:0,mn&&(Ve.rotation.z=-1.2+_t.attackProgress*3.2,Ve.scale.setScalar(.9+_t.comboIndex*.13));for(let ce=0;ce<I.length;ce++){const Gt=H.abilities.projectiles[ce],de=I[ce];de.group.visible=!!Gt,Gt&&(de.group.position.set(Gt.x,Gt.y,Gt.z),de.group.scale.setScalar(Gt.radius),de.group.rotation.set(0,Math.atan2(Gt.dirX,Gt.dirZ),0))}for(let ce=0;ce<nt.length;ce++){const Gt=H.abilities.rings[ce],de=nt[ce];if(!Gt){de.group.visible=!1;continue}const rn=Math.max(0,Math.min(1,Gt.life/Math.max(Gt.duration,1e-6))),bn=K2(Math.max(0,Gt.duration-Gt.life),tt.areaExpandSec);de.set(Gt.x,Gt.z,gt(Gt.x,Gt.z,bt.position.y)+.045,Gt.radius*bn.scale,tt.areaOpacity*(.35+.65*rn)*bn.alpha,H.time)}for(let ce=0;ce<En.length;ce++){const Gt=H.arrows[ce],de=En[ce];if(!Gt){de.group.visible=!1,de.bone&&(c.attach(de.group),de.bone=null),de.arrowId=0;continue}const rn=Gt.stuck&&Gt.stuckDummy>=0;if(de.arrowId!==Gt.id){if(de.bone&&(c.attach(de.group),de.bone=null),de.arrowId=Gt.id,de.group.position.set(Gt.x,Gt.y,Gt.z),de.group.rotation.set(Gt.pitch,Gt.yaw,0,"YXZ"),rn){const Hi=ot[Gt.stuckDummy],Cn=Hi?Hi.boneAtWorld(Gt.x,Gt.y,Gt.z):null;Cn&&(Cn.node.attach(de.group),de.bone=Cn.node)}}else de.bone||(de.group.position.set(Gt.x,Gt.y,Gt.z),de.group.rotation.set(Gt.pitch,Gt.yaw,0,"YXZ"));de.group.visible=!0;const bn=Gt.stuck?Math.min(1,Gt.rest/.6):1;de.shaftMat.opacity=bn,de.tipMat.opacity=bn,de.glowMat.opacity=(Gt.stuck?.28:.85)*bn,de.trailMat.opacity=Gt.stuck?0:j.trailOpacity*bn,de.trail.visible=!Gt.stuck}if(A.update(H,At),b.update(H.destructibles),_t.phase==="active"||H.playerLink.phase==="active"){const ce=b.computeHits(H.destructibles,((Kn=T.bladesWorld)==null?void 0:Kn.call(T))??{right:null,left:null});for(let Gt=0;Gt<ce.length;Gt++){let de=!1;for(let rn=0;rn<M.length;rn++)if(M[rn].id===ce[Gt].id){de=!0;break}de||M.push(ce[Gt])}}else M=[];ct.update(bt.position.x,bt.position.y,bt.position.z,At,H.camera),r.render(c,ct.camera)},resize(){const H=Math.max(1,n.clientWidth),At=Math.max(1,n.clientHeight);r.setSize(H,At,!1),ct.resize(H/At)},getGroundBasis(){return ct.getGroundBasis()},setCollidersVisible(H){for(const At of m)At.opacity=H?.3:1,At.wireframe=H,At.transparent=H,At.depthWrite=!H,At.needsUpdate=!0},setGridVisible(H){S.visible=H},setLabVisible(H){E.setVisible(H)},setLabLabelsVisible(H){E.setLabelsVisible(H)},snapCamera(H,At,bt){ct.snap(H,At,bt)},setZoom(H){ct.setZoom(H*C)},setBodyType(H){var bt;const At=(bt=e.bodyTypes)==null?void 0:bt[H];return!At||H===z||(Z.remove(T.group),T.dispose(),T=P(At),vt(T,pt(At)),U.reset(),z=H,Y(At)),z},bodyTypes(){return{id:z,ids:Object.keys(e.bodyTypes??{})}},pickDummy:Vt,dummyRenderCount:()=>ot.length,projectToScreen:Zt,dummyRigDebug(H){const At=ot[H-1];return At!=null&&At.debug?At.debug():null},diagnostics(){var bt,_t,te,Bt,oe,ke,be,Oe,xe;const H=b0(e.camera.pitchDeg),At=tR(H,St.rotation.y);return{lean:((bt=T.lean)==null?void 0:bt.call(T))??{forward:0,side:0},slashNormal:At,arrowForward:((_t=T.arrowDirection)==null?void 0:_t.call(T))??{x:0,y:0,z:1},gait:{hipYaw:((te=T.hipYaw)==null?void 0:te.call(T))??0,gaitYaw:((Bt=T.gaitYaw)==null?void 0:Bt.call(T))??0},attackBlend:((oe=T.attackBlend)==null?void 0:oe.call(T))??0,attackWeights:((ke=T.attackWeights)==null?void 0:ke.call(T))??{gaitScale:1,attackLegWeight:0,driveSpeed:0,stridePhase:0,strideBase:0,stepIndex:0},landing:((be=T.landing)==null?void 0:be.call(T))??{pulse:0,remaining:0,kind:"none",impactVy:0},hurt:((Oe=T.hurt)==null?void 0:Oe.call(T))??d0(),ik:((xe=T.ik)==null?void 0:xe.call(T))??{active:!1,weight:0,clamped:0,maxError:0},link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:Z.rotation.x,activeRings:lt.activeDash(),lastKind:lt.dashKind()},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...ct.smart(),shake:ct.shakeLevel(),kick:ct.kickLevel(),kickCount:ct.kickCount()}}},dispose(){T.dispose(),E.dispose(),A.dispose(),b.dispose();for(const H of ot)H.dispose();Pt.dispose();for(const H of ft)H.dispose();for(const H of at)H.dispose();Ct.dispose(),U.dispose();for(const H of wt)H.dispose();Xt.dispose(),De.dispose(),le.dispose(),he.dispose(),Tn.dispose(),Vn.dispose(),wi.dispose(),Ei.dispose(),pn.dispose();for(const H of nt)H.dispose();Pe.dispose(),fn.dispose(),Rn.dispose(),nn.dispose();for(const H of En)H.shaftMat.dispose(),H.tipMat.dispose(),H.glowMat.dispose(),H.trailMat.dispose();Dt.dispose(),qt.dispose(),lt.dispose(),v.traverse(H=>{H instanceof ve&&H.geometry.dispose()}),r.dispose(),r.domElement.remove()}}}async function wR(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function ER(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),a=document.createElement("a");a.href=i,a.download=n,a.rel="noopener",document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function TR(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=_=>e.querySelector(`#${_}`),a=i("diag-status"),s=i("diag-text"),o=i("diag-copy"),r=i("diag-json"),c=i("diag-clear"),l=i("diag-toggle"),h=i("diag-close"),u=i("diag-mask");let d=!1,f=!0,m=0;function v(){const _=n.status();a.textContent=_.enabled?`已记录 ${_.durationS.toFixed(1)}s · ${_.frames} 帧 · 事件 ${_.events} · 异常 ${_.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",l.textContent=_.enabled?"暂停记录":"继续记录"}function g(_){d=_,e.hidden=!_,_?v():s.hidden=!0}function p(_){o.textContent=_,window.clearTimeout(m),m=window.setTimeout(()=>{o.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",_=>{_.preventDefault(),_.stopPropagation(),g(!d)}),h.addEventListener("click",()=>g(!1)),u.addEventListener("click",()=>g(!1)),o.addEventListener("click",()=>{const _=n.summary();wR(_).then(x=>{x?(p("已复制 ✓"),s.hidden=!0):(s.value=_,s.hidden=!1,s.focus(),s.select(),p("请长按全选复制"))})}),r.addEventListener("click",()=>{const _=n.dump(),x=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);ER(`harness-${_.meta.version}-${x}.json`,JSON.stringify(_)),p("已导出")}),c.addEventListener("click",()=>{n.clear(),s.hidden=!0,v(),p("已清空")}),l.addEventListener("click",()=>{f=!f,n.setEnabled(f),v()}),{tick(){const _=n.status();t==null||t.classList.toggle("is-alert",_.alert),d&&v()},isOpen:()=>d,close:()=>g(!1)}}const AR={intents:{...bp},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function RR(){var tt;const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=gv(rm,Br),i=SR(n,e,Sn,Br.stations,Br.slabs),a=bv(e),s=$_(t),o=Z_(t),r=document.getElementById("version-badge");r&&(r.textContent="v0.9.72 · 11-09 22:05 · 诊断");const c=V=>String(V).padStart(2,"0"),l=new Date,h=Jv({meta:{version:"v0.9.72",buildTime:"11-09 22:05",startedAt:`${c(l.getMonth()+1)}-${c(l.getDate())} ${c(l.getHours())}:${c(l.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),u=TR(h,r),d=V_({deadZone:()=>Sn.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0,phaseSource:()=>i.gaitDebug().phase});document.addEventListener("visibilitychange",()=>{document.hidden&&h.suspend(800)});const f={timeScale:1,paused:!1,showColliders:Sn.showColliders,showGrid:Sn.showGrid,showLab:Sn.lab.enabled,showLabLabels:Sn.lab.showLabels};let m=1,v=!1;const g=Hv({maxRadiusPx:()=>Sn.joystick.maxRadiusPx,deadZone:Sn.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>Sn.zoom}),p=Array.from(document.querySelectorAll(".wp[data-weapon]"));let _=e.combat.weapon;function x(V){if(V===_)return;_=V;const B=_a.indexOf(V)+1;for(const kt of p)kt.classList.toggle("is-active",Number(kt.dataset.weapon)===B);E.refreshWeapon()}let y=AR,S=0;const w=()=>{m=1,i.setZoom(1)},E=S_(e,Sn,f,{singleStep:()=>a.singleStep(y.intents),reset:()=>{m=1,a.singleStep({...bp,resetPressed:!0})},resetZoom:w,onToggleColliders:V=>i.setCollidersVisible(V),onToggleGrid:V=>i.setGridVisible(V),onToggleLab:V=>i.setLabVisible(V),onToggleLabLabels:V=>i.setLabLabelsVisible(V),setFighterMode:V=>{for(const B of e.dummies)B.weapon&&(B.mode=V,B.attackPhase="idle",B.attackPhaseTimer=0,B.attackProgress=0,B.attackCooldown=0,B.combat&&(B.combat.phase="idle",B.combat.attackProgress=0,B.combat.comboIndex=0))}}),A=T_({stations:Ki.stations,plots:wu,world:e,view:i,onResetZoom:w,onPlotTest:V=>{Vl(e);const B=Ix(e,V);return C(`已在「${V.name}」生成 ${B} 人 · 点「清除测试单位」回基线`),B},onClearTestUnits:()=>{const V=Vl(e);return C(V>0?`已清除 ${V} 个测试单位`:"当前没有测试单位"),V}});o.register({motion:d,debug:E.gui}),window.addEventListener("resize",()=>i.resize());const b=i.bodyTypes().ids,M=document.getElementById("body-toggle"),P=V=>{var B,kt;return((kt=(B=Sn.bodyTypes)==null?void 0:B[V])==null?void 0:kt.name)??V},k=()=>{if(!M)return;const V=i.bodyTypes().id;M.textContent=`体型 ${P(V)}`,M.setAttribute("aria-label",`切换体型（当前：${P(V)}，快捷键 B）`)},D=document.createElement("div");D.style.cssText=["position:fixed","left:50%","top:14px","transform:translateX(-50%)","padding:6px 14px","border-radius:999px","font:600 13px/1.4 system-ui,sans-serif","color:#0b1620","background:#8fd0ff","box-shadow:0 4px 16px rgba(0,0,0,.35)","opacity:0","transition:opacity .18s","pointer-events:none","z-index:99"].join(";"),document.body.appendChild(D);let z=0;const C=V=>{D.textContent=V,D.style.opacity="1",window.clearTimeout(z),z=window.setTimeout(()=>{D.style.opacity="0"},1600)},T=()=>{if(b.length<2){C("只有一个体型预设");return}const V=i.bodyTypes().id,B=Math.max(0,b.indexOf(V)),kt=i.setBodyType(b[(B+1)%b.length]);k(),C(`体型：${P(kt)}（B / 顶部胶囊切换）`)};k(),M==null||M.addEventListener("click",T);const U=document.getElementById("wind-toggle"),G=()=>{var V;return(V=e.config.grass)==null?void 0:V.wind},Z=()=>{var B;if(!U)return;const V=!!((B=G())!=null&&B.enabled);U.textContent=`风：${V?"开":"关"}`,U.classList.toggle("is-off",!V),U.setAttribute("aria-label",`${V?"关闭":"开启"}风吹麦浪（当前${V?"开启":"关闭"}，快捷键 G）`)},rt=()=>{const V=G();if(!V){C("本场景未启用草块");return}V.enabled=!V.enabled,Z(),C(`风吹麦浪：${V.enabled?"开":"关"}（G 切换）`)};Z(),U==null||U.addEventListener("click",rt),window.addEventListener("keydown",V=>{V.repeat||(V.code==="KeyB"?T():V.code==="KeyG"&&rt())}),window.__harness={world:e,view:i,clock:a,input:g,viewConfig:Sn,debug:f,getUserZoom:()=>m,getGestures:()=>y.gestures,getLastGesture:()=>y.lastGesture,telemetry:h,telemetrySummary:()=>h.summary(),dirDebug:d.dirDebug,dirAngles:()=>d.dirDebug.last(),motionDebug:d,speedDebug:()=>d.last(),speedSamples:()=>d.samples(),gaitDebug:()=>i.gaitDebug(),spiderDebug:()=>i.spiderDebug(),dummyRigDebug:V=>i.dummyRigDebug(V),swingDebug:()=>i.swingDebug(),stanceDebug:()=>i.stanceDebug(),balanceDebug:()=>i.balanceDebug(),spineDebug:()=>i.spineDebug(),interpDebug:()=>({alpha:$,applied:q,enabled:Y,skip:ot}),renderPose:()=>i.renderPose(),yawDebug:()=>i.yawDebug(),slamDebug:()=>i.slamDebug(),fxDebug:()=>i.fxDebug(),grassDebug:()=>i.grassDebug(),breakDebug:()=>({version:"v0.9.72",count:e.destructibles.length,broken:e.destructibles.filter(V=>V.broken!==0).length,cuts:e.destructibles.map(V=>({id:V.id,kind:V.kind,broken:V.broken,cutU:V.cutU,theta:V.theta,nx:V.nx,ny:V.ny,nz:V.nz,fall:V.fall,height:V.height})),rendered:i.destructibleDebug()}),breakTest:(V,B,kt=1,Rt=0,Mt=0)=>fv(e,V,B,kt,Rt,Mt),resetBreaks:()=>(Jp(e),e.destructibles.length),breakHits:()=>i.breakHits(),windDebug:()=>{var B;const V=i.grassDebug().wind;return{configured:!!((B=G())!=null&&B.enabled),rendered:V.enabled,time:V.time,gust:V.gust}},setWind:V=>{const B=G();return B?(B.enabled=!!V,Z(),B.enabled):!1},setRenderInterp:V=>(Y=!!V,Y),renderHold:()=>v,trailDebug:()=>i.trailDebug(),bladeWorld:()=>i.bladeWorld(),projectPoint:(V,B,kt)=>i.projectPoint(V,B,kt),setBodyType:V=>{const B=i.setBodyType(V);return k(),B},bodyTypes:()=>i.bodyTypes(),bladesWorld:()=>i.bladesWorld(),clipLab:{clips:()=>{var V;return Object.keys(((V=Sn.animation.swing)==null?void 0:V.clips)??{})},preview:V=>{const B=e.combat,kt={...B};B.weapon=V.weapon,B.phase="active",B.comboIndex=Math.max(1,Math.min(3,Math.floor(V.comboIndex))),B.attackProgress=Math.max(0,Math.min(1,V.progress)),B.attackFacing=e.character.bodyYaw,i.setClipT(typeof V.t=="number"?V.t:null);const Rt=Math.max(1,Math.min(30,Math.floor(V.warm??12)));v=!0;for(let Mt=0;Mt<Rt;Mt++)i.render(e,1/60);return i.setClipT(null),Object.assign(B,kt),{...i.swingDebug(),blade:i.bladeWorld(),blades:i.bladesWorld()}},face:V=>{e.character.bodyYaw=V},zoom:V=>{m=_u(V,1,Sn.zoom.min,Sn.zoom.max),i.setZoom(m)},release:()=>{v=!1}},weaponDebug:()=>i.weaponDebug(),gripDebug:()=>i.gripDebug(),plotDebug:()=>({version:"v0.9.72",count:Ki.plots.length,diagnostics:Ki.diagnostics,testUnits:zx(e),dummies:e.dummies.length,rendered:i.dummyRenderCount(),bounds:Ki.bounds,worldBounds:e.config.worldBounds,slabs:Ki.slabs.map(V=>({plotId:V.plotId,cell:V.cell,span:V.span,rect:[V.minX,V.maxX,V.minZ,V.maxZ],top:V.top})),plots:Ki.plots.map(V=>({id:V.id,index:V.index,placement:V.placement,slot:V.slot,cell:V.cell,span:V.span,centerX:V.centerX,centerZ:V.centerZ,spawnX:V.station.spawnX,spawnZ:V.station.spawnZ,slab:[V.slab.minX,V.slab.maxX,V.slab.minZ,V.slab.maxZ],hasTest:!!V.testSpawn}))}),spawnAt:V=>A.spawnAt(V),clearSpawned:()=>A.clearSpawned(),lab:{stations:Ki.stations,plots:wu,goto:V=>A.goto(V),current:()=>A.current(),recall:()=>A.recall(),spawnAt:V=>A.spawnAt(V),clearSpawned:()=>A.clearSpawned()}};let pt=performance.now(),vt=60,dt=0,Y=((tt=Sn.renderInterp)==null?void 0:tt.enabled)??!0,N=Mu(e),X=null,$=1,q=!1,ot="";function Et(V){const B=Y&&!f.paused&&f.timeScale>0;if(q=!1,ot="",!B)return ot="off",$=1,e;if(!X)return ot="noprev",$=1,e;if(!wv(X,N))return ot="key",$=1,e;const kt=a.alpha;return $=kt,kt>=.999?(ot="alpha",e):(q=!0,Tv(e,Ev(X,N,kt)))}function Ht(V){const B=Math.min((V-pt)/1e3,.1);pt=V,B>0&&(vt=vt*.9+1/B*.1);const kt=g.sample();kt.intents.resetPressed&&(m=1),m=_u(m,kt.zoomScale,Sn.zoom.min,Sn.zoom.max),i.setZoom(m);let Rt=kt.intents.dummyClickId;if(kt.tap){const gt=i.pickDummy(kt.tap.x,kt.tap.y);gt>0&&(Rt=gt)}Rt>0&&(S=Rt),y={...kt,intents:{...kt.intents,dummyClickId:S,breakHits:i.breakHits()}};const Mt=a.frame(B,y.intents,f.timeScale,f.paused,()=>{const gt=e.events;for(let Pt=0;Pt<gt.length;Pt++)h.event(gt[Pt],e.time);X=N,N=Mu(e)});Mt>0&&(S=0),h.sample(e,y,B*1e3,Mt);for(const gt of y.gestures)h.gesture(gt);V-dt>250&&(dt=V,u.tick()),x(e.combat.weapon),v||i.render(Et(),B),A.tick(),d.update(e,y,i.getGroundBasis());const mt=i.diagnostics();s.update(e,vt,Mt,y,f,{attackBlend:mt.attackBlend,attackWeights:mt.attackWeights,landing:mt.landing,hurt:mt.hurt,ik:mt.ik,zoom:mt.camera.zoom},o.hudCompact()),requestAnimationFrame(Ht)}requestAnimationFrame(Ht)}RR();

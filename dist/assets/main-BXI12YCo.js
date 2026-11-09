(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=e(a);fetch(a.href,s)}})();const _a=["sword-shield","dual-swords","greatsword","staff","bow"],dg=["wander","follow","keep-distance","attack","idle"],Mp=["spar","wander","follow","keep-distance","attack","idle"],_p={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},jr=1e-6;function zo(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>jr?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>jr?Math.atan2(t.moveX,t.moveZ):n.character.facing}function hg(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>jr){const a=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/a,z:t.aimZ/a}}const e=Math.hypot(t.moveX,t.moveZ);if(e>jr)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const Ze=1e-6,ga=Math.PI/180,Vd=-1e9;function bp(){return{type:"none",lastAt:Vd,timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function To(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function qh(n,t,e,i,a){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=a,n.knockX=0,n.knockZ=0}function Wd(n,t,e){var l,d;const i=e.duration>0?e.duration:fc(n,e.type);if(t.kind==="player"){const u=n.playerHurt;if(qh(u,e.type,i,e.dirX,e.dirZ),u.lastAt=n.time,!n.config.hits.noDamageToPlayer&&e.knockback>Ze){const h=e.knockback*n.config.hits.knockbackDecay;u.knockX=e.dirX*h,u.knockZ=e.dirZ*h}To(n,"player-hurt",e.sourceId??0,n.character.position);return}const a=n.dummies[t.index];if(!a)return;if(qh(a.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>Ze){const u=e.knockback*n.config.hits.knockbackDecay;a.hurt.knockX=e.dirX*u,a.hurt.knockZ=e.dirZ*u}n.hitCount+=1,To(n,"hit",a.id,a.position);const s=n.config.hits.hitstop;let o=((l=n.config.hits.hitstopByWeapon)==null?void 0:l[n.combat.weapon])??1;const r=n.config.hits.hitstopComboFalloff;if(r&&r.length>0){const u=Math.max(0,Math.min(r.length-1,n.combat.comboIndex-1));o*=Math.max(0,r[u])}o*=Math.max(0,e.holdMul??1);const c=s&&e.type!=="none"?(s[e.type]??0)*Math.max(0,o):0;c>0&&n.combat.hitstop<c&&(n.combat.hitstop=c,n.combat.warpPhase=1,n.combat.warp=(d=n.config.hits.hitstopWarp)!=null&&d.enabled?Math.max(0,Math.min(1,n.config.hits.hitstopWarp.holdRate)):0,To(n,"hitstop",c,a.position))}function Yo(n,t,e){Wd(n,{kind:"dummy",index:t},e)}function ug(n,t){const e=[n.playerHurt];for(const a of n.dummies)e.push(a.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const a of e)a.timer>0&&(a.timer=Math.max(0,a.timer-t),a.timer===0&&(a.type="none",a.knockX=0,a.knockZ=0)),(a.knockX!==0||a.knockZ!==0)&&(a.knockX*=i,a.knockZ*=i,Math.abs(a.knockX)<1e-4&&(a.knockX=0),Math.abs(a.knockZ)<1e-4&&(a.knockZ=0))}function fc(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function qr(n,t){if(n.length===0)return 0;if(t<=n[0][0])return n[0][1];for(let e=1;e<n.length;e++){const[i,a]=n[e];if(t<=i){const[s,o]=n[e-1],r=i>s?(t-s)/(i-s):1;return o+(a-o)*r}}return n[n.length-1][1]}function Sp(n){let t=n;for(;t>180;)t-=360;for(;t<-180;)t+=360;return t}function wp(n){var v,g;const t=n.combat,e=n.character.position,i={active:!1,x:e.x,z:e.z,facing:t.attackFacing,fx:Math.sin(t.attackFacing),fz:Math.cos(t.attackFacing),reach:0,cosArc:1,sweepActive:!1,sweepLo:0,sweepHi:0,slamRadius:0,slamX:e.x,slamZ:e.z};if(t.phase!=="active"||t.weapon==="bow")return i;const a=n.config.hits,s=n.config.combat.weapons[t.weapon],o=s==null?void 0:s.hitWindow,r=o?Math.min(1,Math.max(0,o.start)):0,c=o?Math.min(1,Math.max(r,o.end)):1,l=t.timings.active,d=l>Ze?Math.min(1,Math.max(0,t.phaseTimer/l)):1;if(d<r-Ze||d>c+Ze)return i;i.active=!0,i.reach=a.reach[t.weapon]??0,i.cosArc=Math.cos(Math.min(90,Math.max(0,a.arcDeg))*ga);const u=s==null?void 0:s.hitSweep,h=((v=u==null?void 0:u.byCombo)==null?void 0:v[String(t.comboIndex)])??((g=u==null?void 0:u.byCombo)==null?void 0:g["1"]),f=(u==null?void 0:u.tolDeg)??10;if(h){if(typeof h.stabU=="number"){if(d<h.stabU)return i.active=!1,i}else if(h.pts&&h.pts.length>=2){const p=qr(h.pts,0),_=qr(h.pts,d);i.sweepActive=!0,i.sweepLo=Math.min(p,_)-f,i.sweepHi=Math.max(p,_)+f}}const m=s==null?void 0:s.groundSlam;return m&&d>=m.slamU-Ze&&t.slamAttackId===t.attackId&&(i.slamRadius=Math.max(0,m.radius),i.slamX=e.x+i.fx*Math.min(i.slamRadius*.25,.5),i.slamZ=e.z+i.fz*Math.min(i.slamRadius*.25,.5)),i}function fg(n,t,e,i){if(!n.active)return!1;const a=t-n.x,s=e-n.z,o=Math.sqrt(a*a+s*s);if(o>n.reach+i||o>Ze&&(a*n.fx+s*n.fz)/o<n.cosArc)return!1;if(n.sweepActive){const r=Sp(Math.atan2(a,s)/ga-n.facing/ga);if(r<n.sweepLo||r>n.sweepHi)return!1}return!0}function pg(n,t,e,i){if(n.slamRadius<=0)return!1;const a=t-n.slamX,s=e-n.slamZ;return a*a+s*s<=(n.slamRadius+i)*(n.slamRadius+i)}function mg(n){var w,T;const t=n.combat,e=n.config.hits,i=n.character.position;if(t.weapon==="bow")return;const a=n.config.combat.weapons[t.weapon],s=a==null?void 0:a.hitWindow,o=s?Math.min(1,Math.max(0,s.start)):0,r=s?Math.min(1,Math.max(o,s.end)):1,c=t.timings.active,l=c>Ze?Math.min(1,Math.max(0,t.phaseTimer/c)):1;if(l<o-Ze||l>r+Ze)return;const d=e.reach[t.weapon]??0,u=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*ga),h=Math.sin(t.attackFacing),f=Math.cos(t.attackFacing),m=n.config.dummies.radius,v=n.config.targeting.idealRange,g=a==null?void 0:a.hitSweep,p=((w=g==null?void 0:g.byCombo)==null?void 0:w[String(t.comboIndex)])??((T=g==null?void 0:g.byCombo)==null?void 0:T["1"]),_=(g==null?void 0:g.tolDeg)??10;let x=0,y=0,S=!1;if(p){if(typeof p.stabU=="number"){if(l<p.stabU)return}else if(p.pts&&p.pts.length>=2){const R=qr(p.pts,0),b=qr(p.pts,l);x=Math.min(R,b)-_,y=Math.max(R,b)+_,S=!0}}for(const R of n.dummies){if(t.hitIds.indexOf(R.id)>=0)continue;const b=R.position.x-i.x,M=R.position.z-i.z,C=Math.hypot(b,M);if(C>d+m)continue;const k=C>Ze?b/C:h,D=C>Ze?M/C:f;if(C>Ze&&(b*h+M*f)/C<u)continue;if(S){const G=Sp(Math.atan2(b,M)/ga-t.attackFacing/ga);if(G<x||G>y)continue}let F="light";t.weapon==="greatsword"?F="knock":t.comboIndex>=3&&(F="heavy");const A=e.knockback[t.weapon]??0;let E=C;A>0&&(E=Math.max(C+A,v));const z=Math.max(0,E-C);Yo(n,n.dummies.indexOf(R),{type:F,duration:fc(n,F),dirX:k,dirZ:D,knockback:z}),t.hitIds.push(R.id)}}function gg(n){const t=n.combat,e=n.config.combat.weapons[t.weapon],i=e==null?void 0:e.groundSlam;if(!i||t.slamAttackId===t.attackId)return;const a=t.timings.active;if((a>Ze?Math.min(1,Math.max(0,t.phaseTimer/a)):1)<i.slamU-Ze)return;t.slamAttackId=t.attackId;const o=n.config.hits,r=n.character.position,c=Math.sin(t.attackFacing),l=Math.cos(t.attackFacing),d=n.config.dummies.radius,u=Math.max(0,i.radius),h=i.onlyUnhit!==!1,f=i.type??(t.weapon==="greatsword"?"knock":"heavy"),m=i.knockback??o.knockback[t.weapon]??0,v=n.config.targeting.idealRange,g=i.holdMul??1.6;for(let p=0;p<n.dummies.length;p++){const _=n.dummies[p];if(h&&t.hitIds.indexOf(_.id)>=0)continue;const x=_.position.x-r.x,y=_.position.z-r.z,S=Math.hypot(x,y);if(S>u+d)continue;const w=S>Ze?x/S:c,T=S>Ze?y/S:l,R=m>0?Math.max(S+m,v):S,b=Math.max(0,R-S);Yo(n,p,{type:f,duration:fc(n,f),dirX:w,dirZ:T,knockback:b,holdMul:g}),t.hitIds.push(_.id)}To(n,"ground-slam",u,{x:r.x+c*Math.min(u*.25,.5),y:r.y,z:r.z+l*Math.min(u*.25,.5)})}function xg(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const a=i.weapon===""?void 0:e.moves[i.weapon];if(!a||!a.enabled||!n.modules.hits||!n.modules.dummies)return;const s=a.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(s.pulseInterval,0);const o=n.character.position,r=i.fromX,c=i.fromZ,l=o.x,d=o.z,u=l-r,h=d-c,f=u*u+h*h,m=Math.sin(i.facing),v=Math.cos(i.facing),g=Math.cos(Kh(s.arcDeg,0,180)*ga),p=n.config.dummies.radius;for(let _=0;_<n.dummies.length;_++){const x=n.dummies[_];if(i.hitIds.indexOf(x.id)>=0)continue;const y=f>Ze?Kh(((x.position.x-r)*u+(x.position.z-c)*h)/f,0,1):0,S=r+u*y,w=c+h*y,T=Math.hypot(x.position.x-S,x.position.z-w);let R=!1;if(s.shape==="circle")R=T<=s.radius+p;else if(s.shape==="capsule")R=T<=Math.max(s.radius,s.width)+p;else{const F=x.position.x-l,A=x.position.z-d,E=Math.hypot(F,A),z=E>Ze?(F*m+A*v)/E>=g:!0;R=E<=s.radius+p&&z||T<=s.width+p}if(!R)continue;const b=x.position.x-r,M=x.position.z-c,C=Math.hypot(b,M);if(C>Ze&&(b*m+M*v)/C<Math.cos(Math.max(s.arcDeg,90)*ga))continue;const k=C>Ze?b/C:m,D=C>Ze?M/C:v;Wd(n,{kind:"dummy",index:_},{type:s.type,duration:s.duration,dirX:k,dirZ:D,knockback:s.knockback}),i.hitIds.push(x.id),To(n,"link-hit",x.id,x.position)}}function vg(n){const t=n.config.hits,e=n.config.dummies.fighters,i=n.character.position;for(const a of n.events){if(a.type!=="dummy-hit")continue;const s=n.dummies[a.value-1];if(!s)continue;const o=s.weapon?t.reach[s.weapon]??t.dummyReach:t.dummyReach,r=i.x-s.position.x,c=i.z-s.position.z,l=Math.hypot(r,c);if(l>o)continue;const d=l>Ze?r/l:0,u=l>Ze?c/l:1,f=(s.weapon?Math.max(t.knockback[s.weapon]??0,t.dummyKnockback):t.dummyKnockback)*(s.weapon?(e==null?void 0:e.knockbackScale)??1:1),v=s.weapon==="greatsword"&&s.attackComboLeft<=0?"knock":"light";Wd(n,{kind:"player"},{type:v,duration:fc(n,v),dirX:d,dirZ:u,knockback:f,sourceId:s.id})}}function yg(n,t){n.modules.hits&&(n.combat.phase==="active"&&(mg(n),gg(n)),xg(n,t),vg(n))}function Kh(n,t,e){return n<t?t:n>e?e:n}const Ep=Math.PI/180,Yd=1e-6;function Mg(){return{phase:"idle",fromYaw:0,targetYaw:0,dir:1,progress:0,armTime:0}}function Kr(n){const t=n.turnInPlace;t.phase="idle",t.fromYaw=0,t.targetYaw=0,t.dir=1,t.progress=0,t.armTime=0}function Tp(n,t,e){return n.modules.gaze&&n.gaze.active?n.gaze.centroidYaw:t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Yd?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:null}function Ap(n,t,e){const i=n.character,a=Math.hypot(i.velocity.x,i.velocity.z),s=Math.hypot(t.moveX,t.moveZ),o=n.combat.phase!=="idle"||n.combat.charging||n.abilities.channeling||n.dash.phase!=="idle"||n.playerLink.phase!=="idle"||n.playerHurt.type!=="none"||t.attackPressed||t.attackHeld||t.skill2Pressed||t.sprintPressed||t.jumpPressed;return i.grounded&&a<=Math.max(0,e.idleSpeedRatio)*Math.max(n.config.moveSpeed,Yd)&&s<=Math.max(0,e.inputDeadZone)&&!o}function _g(n){const t=n<0?0:n>1?1:n;return t*t*(3-2*t)}function bg(n,t){const e=n.config.turnInPlace;if(!e.enabled||!n.modules.turnInPlace||!Ap(n,t,e))return!1;const i=Tp(n,t,e.lookRange);if(i===null)return!1;const a=Ge(i-n.character.bodyYaw);return Math.abs(a)>Rp(n,e)}function Rp(n,t){const i=n.modules.gaze&&n.gaze.active?Math.max(t.triggerDeg,t.gazeTriggerDeg):t.triggerDeg;return Math.max(0,i)*Ep}function Sg(n,t,e){const i=n.turnInPlace,a=n.config.turnInPlace;if(!a.enabled||!n.modules.turnInPlace||!Ap(n,e,a)){Kr(n);return}const s=Tp(n,e,a.lookRange);if(s===null){Kr(n);return}const o=n.character,r=Ge(s-o.bodyYaw),c=Math.abs(r),l=Rp(n,a),d=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Yd;if(i.phase==="idle"&&(i.armTime=c>=l?i.armTime+t:0,c>l&&i.armTime>=Math.max(0,a.armSec))){i.phase="active",i.fromYaw=o.bodyYaw,i.dir=r>=0?1:-1;const u=Math.min(c,Math.max(0,a.settleDeg)*Ep);i.targetYaw=Ge(o.bodyYaw+i.dir*(c-u)),i.progress=0}if(i.phase==="active"){const u=Math.max(a.durationSec,n.config.fixedDt);i.progress=Math.min(1,i.progress+t/u);const h=Ge(i.targetYaw-i.fromYaw);o.bodyYaw=Ge(i.fromYaw+h*_g(i.progress)),d||(o.facing=o.bodyYaw),i.progress>=1&&(i.phase="idle",i.progress=0,i.armTime=0)}}const xa=1e-6;function Ge(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Qo(n,t,e,i){const a=Ge(t-n);return n+a*(1-Math.exp(-Math.max(e,xa)*i))}function tr(n,t,e,i,a){const o=Ge(t-n)*(1-Math.exp(-Math.max(e,xa)*a)),r=Math.max(i,0)*a;return r<=xa?n:n+Cs(o,-r,r)}function Jh(n,t,e,i,a){const s=(t-n)*(1-Math.exp(-Math.max(e,xa)*a)),o=Math.max(i,0)*a;return o<=xa?n+s:n+Cs(s,-o,o)}function Cs(n,t,e){return n<t?t:n>e?e:n}function Qh(n,t,e,i){const a=Ge(t-n),s=Math.abs(a);return s<=i||s<=e?t:Ge(n+Math.sign(a)*Math.max(e,0))}function wg(n,t,e){const i=n.character,a=n.config.orientation,s=n.combat,o=n.modules.gaze&&n.gaze.active,r=n.abilities.channeling,c=s.phase!=="idle"||s.charging||r||n.dash.phase!=="idle",l=o&&!c,d=Math.hypot(e.moveX,e.moveZ),u=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>xa,h=s.charging&&s.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(s.phase!=="idle")i.facing=s.attackFacing;else if(r)i.facing=zo(n,e);else if(l)i.facing=tr(i.facing,n.gaze.centroidYaw,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t);else if(u)i.facing=zo(n,e);else if(h)i.facing=n.targeting.targetYaw;else if(d>Math.max(a.facingDeadZone,xa)){const M=Math.atan2(e.moveX,e.moveZ),C=a.facingTurnRate*Math.PI/180*t,k=a.facingSnapDeg*Math.PI/180;if(d>=.35)i.facing=Qh(i.facing,M,C,k);else if(d>=a.facingMinMagnitude&&Math.abs(Ge(M-i.facing))>a.facingDeadbandDeg*Math.PI/180){const F=Qo(i.facing,M,a.facingSmoothRate,t);i.facing=Qh(i.facing,F,C,0)}}const f=i.velocity;Math.hypot(f.x,f.z)>.15&&(i.moveYaw=Math.atan2(f.x,f.z));const m=l?n.gaze.centroidYaw:i.facing;n.turnInPlace.phase==="active"||bg(n,e)||(l?i.bodyYaw=tr(i.bodyYaw,m,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t):i.bodyYaw=Qo(i.bodyYaw,m,a.bodyTurnRate,t));const g=n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;let p=i.facing;if(o?p=l?n.gaze.mainYaw:i.facing:u?p=Math.atan2(e.aimX,e.aimZ):g&&(p=n.targeting.targetYaw),!o){const M=n.config.gaze.headLookLimitDeg*Math.PI/180;Math.abs(Ge(p-i.bodyYaw))>M&&(p=i.moveYaw)}const _=o||u||g,x=a.maxHeadTurnDeg*Math.PI/180;let y;if(_){const M=l?n.config.gaze.headTurnRate:a.headTurnRate;y=l?tr(i.headYaw,p,M,n.config.gaze.maxHeadSpeedDeg*Math.PI/180,t):Qo(i.headYaw,p,M,t)}else{const M=Ge(i.headYaw-i.bodyYaw),C=Ge(p-i.bodyYaw),k=Math.abs(C)<Math.abs(M)-1e-9,D=k?n.config.gaze.headReturnRate:a.headTurnRate,F=k?n.config.gaze.headReturnSpeedDeg*Math.PI/180:Number.POSITIVE_INFINITY,A=Number.isFinite(F)?tr(M,C,D,F,t):Qo(M,C,D,t);y=i.bodyYaw+A}const S=Ge(y-i.bodyYaw);S>x?y=i.bodyYaw+x:S<-x&&(y=i.bodyYaw-x),i.headYaw=y;const w=n.config.gaze;let T=0;if(l)T=n.gaze.mainPitch;else if(n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget){const M=n.dummies[n.targeting.targetId-1];if(M){const C=i.position.y+n.config.characterHeight*Cs(w.eyeHeightRatio,0,1),k=M.position.y+n.config.dummies.height*Cs(w.aimHeightRatio,0,1),D=Math.hypot(M.position.x-i.position.x,M.position.z-i.position.z);T=Math.atan2(k-C,Math.max(xa,D))}}const R=Math.max(0,w.maxHeadPitchDeg)*Math.PI/180;T=Cs(T,-R,R);const b=_?w.headPitchRate:Math.min(w.headPitchRate,w.headReturnRate);i.headPitch=Jh(i.headPitch,T,b,Math.max(0,w.maxHeadPitchDeg)*4*Math.PI/180,t),i.bodyPitch=Jh(i.bodyPitch,i.headPitch*Cs(w.bodyPitchScale,0,1),w.bodyPitchRate,Math.max(0,w.maxHeadPitchDeg)*Math.PI/180,t)}const Pp=1e-6,pc=Math.PI/180;function mc(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Eg(n,t,e){const i=n.character.position,a=Math.max(0,e.homingConeDeg)*pc,s=Math.max(0,e.homingRange),o=[];for(let r=0;r<n.dummies.length;r++){const c=n.dummies[r],l=c.position.x-i.x,d=c.position.z-i.z,u=Math.hypot(l,d);u<.001||u>s||Math.abs(Ge(Math.atan2(l,d)-t))>a||o.push({i:r,d:u})}return o.sort((r,c)=>r.d-c.d||r.i-c.i),o.map(r=>r.i)}function Tg(n,t){const e=Math.sin((n+1)*12.9898+(t+1)*78.233)*43758.5453;return e-Math.floor(e)}function Ag(n,t){const e=n.abilities,i=n.character.position,a=Math.max(1,Math.floor(t.perWave)),s=t.spreadDeg*pc,o=Math.max(0,t.spawnSideStep),r=Math.max(0,Math.min(1,t.speedJitter)),c=Eg(n,e.channelYaw,t);for(let l=0;l<a;l++){const d=(l-(a-1)*.5)*s,u=e.channelYaw+d,h=(l-(a-1)*.5)*o,f=Math.sin(u),m=Math.cos(u);e.pending.push({delay:l*Math.max(0,t.spawnDelay),x:i.x+f*.5+Math.cos(u)*h,y:i.y+1,z:i.z+m*.5-Math.sin(u)*h,yaw:u,speed:t.speed*(1+(Tg(e.waveIndex,l)*2-1)*r),targetIndex:c.length>0?c[l%c.length]:-1,wave:e.waveIndex})}mc(n,"arcane-wave",e.waveIndex,{x:i.x,y:i.y+1,z:i.z})}function Rg(n,t,e){const i=n.abilities;if(i.pending.length===0)return;const a=[];for(const s of i.pending){if(s.delay-=t,s.delay>0){a.push(s);continue}const o={id:++i.nextId,x:s.x,y:s.y,z:s.z,dirX:Math.sin(s.yaw),dirZ:Math.cos(s.yaw),speed:s.speed,life:e.life,radius:e.radius,targetIndex:s.targetIndex,turnRate:Math.max(0,e.turnRateDeg)*pc,homing:Math.max(0,e.homingTime),spread:Math.max(0,e.spreadTime),retarget:0,wave:s.wave};i.projectiles.push(o),i.volleyId+=1,mc(n,"projectile-fire",i.volleyId,o)}i.pending=a}function tu(n,t){const e=n.abilities;e.channeling&&(e.channeling=!1,e.fireTimer=0,e.cooldown=Math.max(0,t.cooldown),e.channelMoveScale=1,e.needsRelease=!0,mc(n,"channel-end",0,n.character.position))}function Pg(n,t,e,i,a,s){const o=n.abilities,r=n.dash.phase==="active",c=n.playerLink,l=s==="skill2"?e.skill2Pressed:e.attackHeld,d=a&&l&&!r&&c.phase==="idle"&&!c.consumedAttack;if(o.cooldown>0&&(o.cooldown=Math.max(0,o.cooldown-t)),o.needsRelease&&!d&&(o.needsRelease=!1),o.channeling){if(!d){tu(n,i);return}}else{if(!(d&&!o.needsRelease&&o.cooldown<=0))return;o.channeling=!0,o.channelId+=1,o.waveIndex=0,o.fireTimer=0,o.channelMoveScale=Math.max(0,Math.min(1,i.moveScale)),mc(n,"channel-start",o.channelId,n.character.position)}o.channelYaw=zo(n,e),o.fireTimer-=t;let u=0;for(;o.fireTimer<=0&&u++<8;)if(o.fireTimer+=Math.max(i.waveInterval,Pp),Ag(n,i),o.waveIndex+=1,o.waveIndex>=Math.max(1,Math.floor(i.waves))){tu(n,i);break}}function Cg(n,t,e){const i=Math.max(0,e.homingConeDeg)*pc,a=Math.max(0,e.homingRange),s=Math.atan2(t.dirX,t.dirZ);let o=-1,r=a+Pp;for(let c=0;c<n.dummies.length;c++){const l=n.dummies[c],d=l.position.x-t.x,u=l.position.z-t.z,h=Math.hypot(d,u);h<.001||h>r||Math.abs(Ge(Math.atan2(d,u)-s))>i||(o=c,r=h)}return o}function Dg(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.projectiles){if(r.spread>0)r.spread=Math.max(0,r.spread-t);else if(r.homing>0&&(r.homing=Math.max(0,r.homing-t)),r.retarget-=t,r.retarget<=0&&(r.retarget=Math.max(.05,e.retargetInterval),r.targetIndex=Cg(n,r,e)),r.targetIndex>=0&&r.turnRate>0&&r.homing>0){const l=n.dummies[r.targetIndex];if(!l)r.targetIndex=-1;else{const d=Math.atan2(l.position.x-r.x,l.position.z-r.z),u=Math.atan2(r.dirX,r.dirZ),h=Ge(d-u),f=r.turnRate*t,m=Math.max(-f,Math.min(f,h)),v=u+m;r.dirX=Math.sin(v),r.dirZ=Math.cos(v)}}if(r.x+=r.dirX*r.speed*t,r.z+=r.dirZ*r.speed*t,r.life-=t,r.life<=0)continue;let c=!1;if(s)for(let l=0;l<n.dummies.length;l++){const d=n.dummies[l],u=d.position.x-r.x,h=d.position.z-r.z,f=r.radius+a;if(!(u*u+h*h>f*f)){Yo(n,l,{type:e.hurtType,duration:e.hurtDuration,dirX:r.dirX,dirZ:r.dirZ,knockback:e.knockback}),c=!0;break}}c||o.push(r)}i.projectiles=o}const Lg={kind:"channelVolley",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params;Pg(n,t,e,s,a,i.cfg.slot),Rg(n,t,s),Dg(n,t,s)}},Uc=1e-6;function Cp(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function kg(n,t){const e=n.character.position,i={id:++n.abilities.nextId,x:e.x,z:e.z,radius:t.radius,life:t.duration,duration:t.duration,pulseTimer:0};n.abilities.rings.push(i),Cp(n,"ring-place",i.id,e)}function Ig(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.rings){r.life-=t,r.pulseTimer-=t;let c=0;for(;r.pulseTimer<=0&&c++<8;){if(r.pulseTimer+=Math.max(e.pulseInterval,Uc),s)for(let l=0;l<n.dummies.length;l++){const d=n.dummies[l],u=d.position.x-r.x,h=d.position.z-r.z,f=r.radius+a;if(u*u+h*h>f*f)continue;const m=Math.hypot(u,h),v=m>Uc?u/m:0,g=m>Uc?h/m:1;Yo(n,l,{type:"heavy",duration:e.stun,dirX:v,dirZ:g,knockback:e.knockback})}Cp(n,"ring-pulse",r.id,{x:r.x,y:0,z:r.z})}r.life>0&&o.push(r)}i.rings=o}const zg={kind:"groundRing",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params,o=i.cfg.slot==="attack"?e.attackPressed:e.skill2Pressed;a&&o&&n.dash.phase!=="active"&&n.playerLink.phase==="idle"&&kg(n,s),Ig(n,t,s)}},Fg={channelVolley:Lg,groundRing:zg};function Ug(n){const t=Array.isArray(n.skills)?n.skills:[],e=n.abilities;return t.map(i=>{if(i.params)return{cfg:i,params:i.params};const a=i.paramsRef,s=a?e[a]:void 0;if(!s||typeof s!="object")throw new Error(`[skills] ${i.id}: paramsRef "${a??""}" 在 core.abilities 中不存在`);return{cfg:i,params:s}})}function Ng(n,t,e){for(const i of n.skills){if(i.cfg.enabled===!1)continue;const a=Fg[i.cfg.kind];if(!a)continue;const s=!i.cfg.weapon||n.combat.weapon===i.cfg.weapon;a.update({world:n,dt:t,intents:e,skill:i,onWeapon:s})}}function Og(){return{channeling:!1,channelYaw:0,fireTimer:0,waveIndex:0,cooldown:0,needsRelease:!1,channelId:0,channelMoveScale:1,volleyId:0,pending:[],projectiles:[],rings:[],nextId:0}}function Dp(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.waveIndex=0,t.cooldown=0,t.needsRelease=!1,t.channelMoveScale=1,t.pending.length=0,t.projectiles.length=0,t.rings.length=0}function Bg(n,t,e){Ng(n,t,e)}function Nc(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const eu=1e-6;function nu(n,t,e){return n<t?t:n>e?e:n}function Lp(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function kp(n){const t=n.camera,e=Lp();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function Hg(n){const t=n.camera,e=n.config.camera,i=n.character.position;let a=0,s=0,o=0,r=0;for(const l of n.dummies){const d=l.position.x-i.x,u=l.position.z-i.z,h=Math.hypot(d,u);if(h>e.radius)continue;const f=nu((e.radius-h)/Math.max(eu,e.radius-e.nearDistance),0,1);let m=f*(e.modeWeight[l.mode]??.5);l.attackPhase==="active"&&(m+=e.attackBoost*f),a+=m,s+=l.position.x*m,o+=l.position.z*m,r+=1}const c=a<=0?0:nu(a/(a+Math.max(eu,e.saturation)),0,1);if(t.threat=c,t.threatCount=r,a<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const l=s/a,d=o/a;t.centroidX=l,t.centroidZ=d;let u=(l-i.x)*e.framingBias*c,h=(d-i.z)*e.framingBias*c;const f=Math.hypot(u,h);f>e.maxOffset&&(u=u/f*e.maxOffset,h=h/f*e.maxOffset),t.offsetX=u,t.offsetZ=h}t.distanceScale=1-e.pushIn*(1-c)+e.maxPullback*c,t.pitchDelta=e.maxPitchDelta*c}function Gg(n){const t=[];if(n.slabs&&n.slabs.length>0)for(const e of n.slabs)t.push({id:`ground-${e.plotId}`,kind:"ground",minX:e.minX,maxX:e.maxX,minY:e.top-e.thickness,maxY:e.top,minZ:e.minZ,maxZ:e.maxZ});else{const e=n.ground.size;t.push(ls("ground","ground",0,0,e,e,-n.ground.thickness,0))}for(const e of n.steps)t.push(ls(e.id,"step",e.x,e.z,e.width,e.depth,0,e.height));for(const e of n.doorways){const i=e.openingWidth/2,a=e.wallThickness;t.push(ls(`${e.id}-left`,"wall",e.x-i-e.wallSpan/2,e.z,e.wallSpan,a,0,e.wallHeight)),t.push(ls(`${e.id}-right`,"wall",e.x+i+e.wallSpan/2,e.z,e.wallSpan,a,0,e.wallHeight)),t.push(ls(`${e.id}-lintel`,"lintel",e.x,e.z,e.openingWidth,a,e.openingHeight,e.wallHeight))}for(const e of n.obstacles)t.push(ls(e.id,"obstacle",e.x,e.z,e.width,e.depth,0,e.height));return t}function ls(n,t,e,i,a,s,o,r){return{id:n,kind:t,minX:e-a/2,maxX:e+a/2,minY:o,maxY:r,minZ:i-s/2,maxZ:i+s/2}}const $d={cellSize:.5,cellMeters:5,columns:6,maxRows:32,spawnDz:0,labelInset:.9,defaultRadius:2,defaultShape:"circle",defaultColor:"#7fd8c0",defaultSpan:[2,2],slabThickness:.4,boundInset:.5};function Fe(n){return Math.round(n*1e6)/1e6}function iu(n,t){const e=n??t.defaultSpan;return[Math.max(1,Math.round(e[0])),Math.max(1,Math.round(e[1]))]}function Xg(n,t=$d){var ht,gt,Lt,Z;const e={duplicates:[],unplaced:[]},i=t.cellMeters,a=new Set,s=[];for(const B of n)if(!(!B||typeof B.id!="string"||B.id.length===0)){if(a.has(B.id)){e.duplicates.push(B.id);continue}a.add(B.id),s.push(B)}const o=[...s].sort((B,Y)=>B.id<Y.id?-1:B.id>Y.id?1:0),r=new Map,c=(B,Y,q)=>{if(B<0||Y<0||B+q[0]>t.columns||Y+q[1]>t.maxRows)return!1;for(let K=0;K<q[0];K++)for(let st=0;st<q[1];st++)if(r.has(`${B+K},${Y+st}`))return!1;return!0},l=(B,Y,q,K)=>{for(let st=0;st<K[0];st++)for(let Tt=0;Tt<K[1];Tt++)r.set(`${Y+st},${q+Tt}`,B)},d=[];for(const B of o){if(B.pin!=="origin")continue;const Y=iu(B.span,t);c(0,0,Y)&&(l(B.id,0,0,Y),d.push({def:B,c:0,r:0,span:Y,pin:!0,slot:0}))}const u=t.columns*t.maxRows;for(const B of o){if(d.some(Tt=>Tt.def.id===B.id))continue;const Y=iu(B.span,t);let q=-1;for(let Tt=0;Tt<u;Tt++){const Gt=Tt%t.columns,J=Math.floor(Tt/t.columns);if(c(Gt,J,Y)){q=Tt;break}}if(q<0){e.unplaced.push(B.id);continue}const K=q%t.columns,st=Math.floor(q/t.columns);l(B.id,K,st,Y),d.push({def:B,c:K,r:st,span:Y,pin:!1,slot:q})}const h=d.map(B=>({...B,minX0:B.c*i,maxX0:(B.c+B.span[0])*i,minZ0:B.r*i,maxZ0:(B.r+B.span[1])*i}));if(h.length===0)return{plots:[],stations:[],grassPlots:[],destructibles:[],slabs:[],bounds:{minX:0,maxX:0,minZ:0,maxZ:0},steps:[],doorways:[],obstacles:[],dummySpawns:[],diagnostics:e};const f=Math.min(...h.map(B=>B.minX0)),m=Math.max(...h.map(B=>B.maxX0)),v=Math.min(...h.map(B=>B.minZ0)),g=Math.max(...h.map(B=>B.maxZ0)),p=h.find(B=>B.pin),_=p?(p.minX0+p.maxX0)/2:(f+m)/2,x=p?(p.minZ0+p.maxZ0)/2:(v+g)/2,y=-_,S=-x;let T=o.reduce((B,Y)=>typeof Y.index=="number"?Math.max(B,Y.index):B,0);const R=new Map;for(const B of h)R.set(B.def.id,typeof B.def.index=="number"?B.def.index:++T);const b=new Set,M=(B,Y)=>{if(!b.has(Y))return b.add(Y),Y;let q=`${B}/${Y}`,K=2;for(;b.has(q);)q=`${B}/${Y}#${K++}`;return b.add(q),q},C=[],k=[],D=[],F=[],A=[],E=[];for(const B of h){const Y=B.def,q=Y.id,K=R.get(q)??0,st=Fe((B.minX0+B.maxX0)/2+y),Tt=Fe((B.minZ0+B.maxZ0)/2+S),Gt={plotId:q,cell:{c:B.c,r:B.r},span:B.span,minX:Fe(B.minX0+y),maxX:Fe(B.maxX0+y),minZ:Fe(B.minZ0+S),maxZ:Fe(B.maxZ0+S),top:0,thickness:t.slabThickness};k.push(Gt);const J=Y.radius??t.defaultRadius,V=Y.shape??t.defaultShape,O=Y.color??t.defaultColor,Pt={dx:((ht=Y.spawn)==null?void 0:ht.dx)??0,dz:((gt=Y.spawn)==null?void 0:gt.dz)??t.spawnDz},Et=-(B.span[1]*i)/2+t.labelInset,lt={dx:((Lt=Y.label)==null?void 0:Lt.dx)??0,dz:((Z=Y.label)==null?void 0:Z.dz)??Et},vt={id:q,index:K,name:Y.name,hint:Y.hint,shape:V,x:st,z:Tt,radius:J,spawnX:Fe(st+Pt.dx),spawnZ:Fe(Tt+Pt.dz),labelX:Fe(st+lt.dx),labelZ:Fe(Tt+lt.dz),color:O},ft=[];if(Y.grass){const L=Y.grass,P=L.absolute?0:Math.round(st/t.cellSize),Q=L.absolute?0:Math.round(Tt/t.cellSize),mt={minCellX:L.minCellX+P,maxCellX:L.maxCellX+P,minCellZ:L.minCellZ+Q,maxCellZ:L.maxCellZ+Q};L.density!==void 0&&(mt.density=L.density),L.clearMarginCells!==void 0&&(mt.clearMarginCells=L.clearMarginCells),ft.push(mt)}const Rt=[];if(Y.destructibles)for(const L of Y.destructibles)Rt.push({id:M(q,L.id),kind:L.kind,x:Fe(st+L.dx),y:L.y??0,z:Fe(Tt+L.dz),height:L.height,radius:L.radius,tiltDeg:L.tiltDeg,pitchGain:L.pitchGain,maxTiltDeg:L.maxTiltDeg,fallSec:L.fallSec,bands:L.bands?[...L.bands]:void 0,color:L.color,cutColor:L.cutColor});for(const L of Y.steps??[])D.push({id:M(q,L.id),x:Fe(st+L.dx),z:Fe(Tt+L.dz),width:L.width,depth:L.depth,height:L.height});for(const L of Y.doorways??[])F.push({id:M(q,L.id),x:Fe(st+L.dx),z:Fe(Tt+L.dz),openingWidth:L.openingWidth,openingHeight:L.openingHeight,wallThickness:L.wallThickness,wallSpan:L.wallSpan,wallHeight:L.wallHeight});for(const L of Y.obstacles??[])A.push({id:M(q,L.id),x:Fe(st+L.dx),z:Fe(Tt+L.dz),width:L.width,depth:L.depth,height:L.height});for(const L of Y.dummies??[]){const P={plotId:q,x:Fe(st+L.dx),z:Fe(Tt+L.dz)};L.mode!==void 0&&(P.mode=L.mode),L.fighter&&(P.fighter=!0),L.weapon!==void 0&&(P.weapon=L.weapon),E.push(P)}C.push({id:q,index:K,name:Y.name,hint:Y.hint,owner:Y.owner??"",centerX:st,centerZ:Tt,placement:B.pin?"pinned":"auto",slot:B.pin?-1:B.slot,cell:{c:B.c,r:B.r},span:B.span,slab:Gt,shape:V,radius:J,color:O,station:vt,grassPlots:ft,destructibles:Rt,testSpawn:Y.testSpawn})}const z=Math.max(...h.map(B=>B.c+B.span[0])),G=Math.max(...h.map(B=>B.r+B.span[1]));for(let B=0;B<G;B++){let Y=0;for(;Y<z;){if(r.has(`${Y},${B}`)){Y++;continue}const q=Y;for(;Y<z&&!r.has(`${Y},${B}`);)Y++;k.push({plotId:"",cell:{c:q,r:B},span:[Y-q,1],minX:Fe(q*i+y),maxX:Fe(Y*i+y),minZ:Fe(B*i+S),maxZ:Fe((B+1)*i+S),top:0,thickness:t.slabThickness})}}C.sort((B,Y)=>B.index-Y.index),k.sort((B,Y)=>{const q=R.get(B.plotId)??Number.MAX_SAFE_INTEGER,K=R.get(Y.plotId)??Number.MAX_SAFE_INTEGER;return q-K||B.cell.r-Y.cell.r||B.cell.c-Y.cell.c});const X=[...C].sort((B,Y)=>B.id<Y.id?-1:B.id>Y.id?1:0),et={minX:Fe(Math.min(...k.map(B=>B.minX))+t.boundInset),maxX:Fe(Math.max(...k.map(B=>B.maxX))-t.boundInset),minZ:Fe(Math.min(...k.map(B=>B.minZ))+t.boundInset),maxZ:Fe(Math.max(...k.map(B=>B.maxZ))-t.boundInset)};return{plots:C,stations:C.map(B=>B.station),grassPlots:C.flatMap(B=>B.grassPlots),destructibles:X.flatMap(B=>B.destructibles),slabs:k,bounds:et,steps:D,doorways:F,obstacles:A,dummySpawns:E,diagnostics:e}}function Vg(n,t,e,i=$d){t.stations=e.stations,t.slabs=e.slabs,t.steps=e.steps,t.doorways=e.doorways,t.obstacles=e.obstacles,t.destructibles=e.destructibles,t.grass&&(t.grass.plots=e.grassPlots),t.ground={size:Math.max(e.bounds.maxX-e.bounds.minX,e.bounds.maxZ-e.bounds.minZ),thickness:i.slabThickness},n.worldBounds={...e.bounds};const a=t.grid.cellSize;t.grid={cellSize:a,minX:Math.floor(e.bounds.minX/a)*a,maxX:Math.ceil(e.bounds.maxX/a)*a,minZ:Math.floor(e.bounds.minZ/a)*a,maxZ:Math.ceil(e.bounds.maxZ/a)*a};const s=e.dummySpawns.filter(c=>!c.fighter),o=e.dummySpawns.filter(c=>c.fighter),r=n.dummies.initialModes;if(n.dummies.count=s.length,n.dummies.spawn=s.map(c=>({x:c.x,z:c.z})),n.dummies.initialModes=s.map((c,l)=>c.mode??r[l]??"idle"),n.dummies.fighters){const c=n.dummies.fighters,l=c.weapons;if(c.spawn=o.map(d=>({x:d.x,z:d.z})),c.weapons=o.map((d,u)=>d.weapon??l[u%l.length]),c.initialModes){const d=c.initialModes;c.initialModes=o.map((u,h)=>d[h%d.length])}}}const Qi=1e-6;function Jr(n,t,e){return n<t?t:n>e?e:n}function Fo(n,t,e,i,a,s,o){const r=a*.85;let c=Number.NEGATIVE_INFINITY;for(const l of n)l.maxY>i+s+Qi||l.maxY<i-o-Qi||t+r<l.minX||t-r>l.maxX||e+r<l.minZ||e-r>l.maxZ||l.maxY>c&&(c=l.maxY);return c}function Ip(n,t,e,i,a=0,s=.05){let o=Number.NEGATIVE_INFINITY;for(const r of n)r.maxY>i+s||t<r.minX||t>r.maxX||e<r.minZ||e>r.maxZ||r.maxY>o&&(o=r.maxY);return o===Number.NEGATIVE_INFINITY?a:o}function Zd(n,t,e,i,a){let s=!1;const o=t.y+i;for(let r=0;r<2;r++)for(const c of n){if(c.maxY<=t.y+a+Qi||c.minY>=o-Qi)continue;const l=Jr(t.x,c.minX,c.maxX),d=Jr(t.z,c.minZ,c.maxZ),u=t.x-l,h=t.z-d,f=u*u+h*h;if(!(f>=e*e))if(s=!0,f>Qi*Qi){const m=Math.sqrt(f),v=(e-m)/m;t.x+=u*v,t.z+=h*v}else{const m=t.x-c.minX,v=c.maxX-t.x,g=t.z-c.minZ,p=c.maxZ-t.z,_=Math.min(m,v,g,p);_===m?t.x=c.minX-e:_===v?t.x=c.maxX+e:_===g?t.z=c.minZ-e:t.z=c.maxZ+e}}return s}function jd(n,t,e,i,a){const s=t.y+i;for(const o of n){if(o.maxY<=t.y+a+Qi||o.minY>=s-Qi)continue;const r=Jr(t.x,o.minX,o.maxX),c=Jr(t.z,o.minZ,o.maxZ),l=t.x-r,d=t.z-c;if(l*l+d*d<e*e-Qi)return!0}return!1}const pa=1e-6,Hs=Math.PI/180;function qd(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Il(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function zp(n){n.arrows.length=0}function Wg(n,t,e,i,a,s,o,r,c,l,d){const u=i-n,h=s-e,f=u*u+h*h;let m=0;f>pa&&(m=((o-n)*u+(r-e)*h)/f,m=Math.max(0,Math.min(1,m)));const v=n+u*m,g=e+h*m,p=v-o,_=g-r;if(p*p+_*_>d*d)return-1;const x=t+(a-t)*m;return x<c-.1||x>c+l?-1:m}function Yg(n,t){const e=n.config.combat.bow.trajectory,i=Math.max(0,e.homingRange);if(i<=pa)return-1;const a=n.character.position,s=Math.max(0,e.homingConeDeg)*Hs,o=n.config.targeting.targetAssist&&n.modules.targeting?n.targeting:null,r=o&&o.hasTarget?o.targetId:0;let c=-1,l=i+pa;for(const d of n.dummies){if(!n.modules.dummies)break;const u=d.position.x-a.x,h=d.position.z-a.z,f=Math.hypot(u,h);if(!(f<.001||f>i)){if(d.id===r)return d.id;Math.abs(qd(Math.atan2(u,h)-t))>s||f<l&&(c=d.id,l=f)}}return c}function $g(n,t,e){if(e<=0)return t;const i=n.dummies.find(r=>r.id===e);if(!i)return t;const a=n.character.position,s=Math.atan2(i.position.x-a.x,i.position.z-a.z),o=Math.max(0,n.config.combat.bow.trajectory.homingConeDeg)*Hs;return t+Is(qd(s-t),-o,o)}function Zg(n,t,e,i,a,s){const o=n.config.combat.bow.trajectory,r={vy:s*Math.sin(Math.max(0,o.launchPitchDeg)*Hs),horizontal:0};if(r.horizontal=s*Math.cos(Math.max(0,o.launchPitchDeg)*Hs),a<=0)return r;const c=n.dummies.find(v=>v.id===a);if(!c)return r;const l=Math.hypot(c.position.x-t,c.position.z-i);if(l<.4)return r;const d=l/Math.max(pa,s),u=c.position.y+n.config.dummies.height*Is(o.aimHeightRatio,0,1),h=Math.max(0,o.gravity),f=(u-e+.5*h*d*d)/d,m=Is(f,-s*.45,s*.92);return{vy:m,horizontal:Math.sqrt(Math.max(0,s*s-m*m))}}function jg(n,t,e){const i=n.config.combat.bow.trajectory,a=Math.max(0,Math.min(1,t)),s=i.speedMin+(i.speedMax-i.speedMin)*a,o=n.character.position,r=Yg(n,e),c=$g(n,e,r),l=Math.sin(c),d=Math.cos(c),u=o.x+Math.sin(e)*.55,h=o.z+Math.cos(e)*.55,f=o.y+.95,m=Zg(n,u,f,h,r,s),v={id:++n.arrowSeq,x:u,y:f,z:h,vx:l*m.horizontal,vy:m.vy,vz:d*m.horizontal,life:Math.max(.1,i.maxLife),stuck:!1,stuckDummy:-1,offX:0,offY:0,offZ:0,yaw:e,localYaw:0,pitch:0,rest:0,hit:!1,targetId:r,homing:Math.max(0,i.homingTime),turnRate:Math.max(0,i.turnRateDeg)*Hs};return n.arrows.push(v),Il(n,"arrow-shot",a,v),v}function Is(n,t,e){return n<t?t:n>e?e:n}function qg(n,t){const e=n.arrows;if(e.length===0)return;const i=n.config.combat.bow.trajectory,a=n.config.dummies.radius,s=n.config.dummies.height,o=n.modules.hits&&n.modules.dummies,r=Math.max(0,i.gravity),c=[];for(const l of e){if(l.stuck){if(l.rest-=t,l.rest<=0)continue;if(l.stuckDummy>=0){const y=n.dummies[l.stuckDummy];if(y){const S=Math.cos(y.bodyYaw),w=Math.sin(y.bodyYaw);l.x=y.position.x+l.offX*S+l.offZ*w,l.y=y.position.y+l.offY,l.z=y.position.z-l.offX*w+l.offZ*S,l.yaw=y.bodyYaw+l.localYaw}}c.push(l);continue}if(l.life-=t,l.life<=0)continue;const d=l.x,u=l.y,h=l.z;if(l.homing>0&&(l.homing=Math.max(0,l.homing-t),l.targetId>0&&l.turnRate>0)){const y=n.dummies.find(S=>S.id===l.targetId);if(!y)l.targetId=0;else{const S=Math.hypot(l.vx,l.vz);if(S>pa){const w=Math.atan2(y.position.x-l.x,y.position.z-l.z),T=Math.atan2(l.vx,l.vz),R=l.turnRate*t,b=T+Is(qd(w-T),-R,R);l.vx=Math.sin(b)*S,l.vz=Math.cos(b)*S;const M=Math.hypot(y.position.x-l.x,y.position.z-l.z);if(M>.3){const C=M/S,D=(y.position.y+s*Is(i.aimHeightRatio,0,1)-l.y+.5*r*C*C)/C,F=Math.max(0,i.verticalTurnRate)*t;l.vy+=Is(D-l.vy,-F,F)}}}}l.yaw=Math.atan2(l.vx,l.vz),l.pitch=-Math.atan2(l.vy,Math.hypot(l.vx,l.vz)),l.vy-=r*t;const f=d+l.vx*t,m=u+l.vy*t,v=h+l.vz*t;let g=-1,p=2;if(o)for(let y=0;y<n.dummies.length;y++){const S=n.dummies[y],w=Wg(d,u,h,f,m,v,S.position.x,S.position.z,S.position.y,s,a+i.radius);w>=0&&w<p&&(p=w,g=y)}if(g>=0){const y=n.dummies[g];l.x=d+(f-d)*p,l.y=u+(m-u)*p,l.z=h+(v-h)*p,l.stuck=!0,l.stuckDummy=g;const S=Math.cos(y.bodyYaw),w=Math.sin(y.bodyYaw),T=l.x-y.position.x,R=l.z-y.position.z;l.offX=T*S-R*w,l.offZ=T*w+R*S,l.offY=l.y-y.position.y;const b=Math.atan2(l.vx,l.vz);l.localYaw=b-y.bodyYaw,l.yaw=b,l.pitch=Math.atan2(-l.vy,Math.hypot(l.vx,l.vz)),l.rest=Math.max(.2,i.stickSec),l.hit=!0;const M=Math.hypot(l.vx,l.vz);Yo(n,g,{type:"light",duration:.22,dirX:M>pa?l.vx/M:0,dirZ:M>pa?l.vz/M:1,knockback:.14}),Il(n,"arrow-land",y.id,l),c.push(l);continue}const _=Fo(n.boxes,f,v,m+.4,.04,0,6),x=Number.isFinite(_)?_:0;if(m<=x+.02&&l.vy<0){l.x=f,l.y=x+Math.max(0,i.groundStickLift),l.z=v,l.stuck=!0,l.stuckDummy=-1,l.yaw=Math.atan2(l.vx,l.vz);const y=Math.atan2(-l.vy,Math.max(pa,Math.hypot(l.vx,l.vz)));l.pitch=Math.max(y,Math.max(0,i.stickMinPitchDeg)*Hs),l.rest=Math.max(.2,i.stickSec),Il(n,"arrow-land",-1,l),c.push(l);continue}l.x=f,l.y=m,l.z=v,c.push(l)}n.arrows=c}const zl=1e-6,Kg=Math.PI/180;function Fl(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Kd(n,t,e){return n<t?t:n>e?e:n}function gc(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function Ul(n){const t=n.id,e=n.windowId;Object.assign(n,gc()),n.id=t,n.windowId=e}function Jg(n){Ul(n)}function Fp(n){Ul(n.playerLink);for(const t of n.dummies)Ul(t.link)}function Qg(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function Nl(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const a=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;a<=0||(i.linkWindow=Math.max(i.linkWindow,a),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function Qr(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,gc()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function tx(n,t){const e=n.config.links.search,i=n.character.position,a=Kd(e.maxAngleDeg,0,180)*Kg;let s=0,o=t,r=Number.POSITIVE_INFINITY;for(const c of n.dummies){const l=c.position.x-i.x,d=c.position.z-i.z,u=Math.hypot(l,d);if(u<zl||u>e.range)continue;const h=Math.atan2(l,d);Math.abs(Ge(h-t))>a||u<r&&(r=u,s=c.id,o=h)}return{id:s,yaw:o,dist:s>0?r:0}}function ex(n,t,e,i){const a=n.config.links,s=n.playerLink,o=n.character.position,r=zo(n,t),c=tx(n,r),l=c.id>0?c.yaw:r,d=c.id>0?Kd(c.dist-a.search.stopDistance,0,e.distance):a.noTargetFallback?e.distance:0;s.phase="windup",s.linkWindow=0,s.source="none",s.usedWindowId=s.windowId,s.cooldown=a.sharedCooldown,s.kind=e.kind,s.weapon=i,s.id+=1,s.timer=0,s.progress=0,s.facing=l,s.targetId=c.id,s.targetDist=c.dist,s.travel=d,s.travelled=0,s.fromX=o.x,s.fromZ=o.z,s.pulseTimer=0,s.hitIds=[],s.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,a.sharedCooldown),Fl(n,"link-start",s.id)}function nx(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){Qr(n);return}if(e.weapon!==n.combat.weapon){Qr(n);return}e.timer+=t;const a=c=>c==="windup"?i.windup:c==="active"?i.active:i.recovery;let s=0;for(;e.phase!=="idle"&&s++<8;){const c=a(e.phase);if(e.timer<c)break;e.timer-=c,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,Fl(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,Fl(n,"link-end",e.id))}const o=i.windup+i.active+i.recovery;let r=0;if(e.phase==="windup"?r=e.timer:e.phase==="active"?r=i.windup+e.timer:e.phase==="recovery"?r=i.windup+i.active+e.timer:r=o,e.progress=o>0?Kd(r/o,0,1):1,e.phase==="active"&&i.active>zl){const c=Math.max(0,e.travel-e.travelled),l=Math.max(zl,i.active-e.timer),d=c/l;n.impulse.x=Math.sin(e.facing)*d,n.impulse.z=Math.cos(e.facing)*d}}function ix(n,t,e){const i=n.config.links,a=n.playerLink,s=n.character.position;if(a.consumedAttack=!1,n.combat.hitstop>0)return;if(a.phase==="active"&&(a.travelled+=Math.hypot(s.x-a.fromX,s.z-a.fromZ)),a.fromX=s.x,a.fromZ=s.z,!i.enabled||!n.modules.links){a.phase!=="idle"&&Qr(n);return}const o=n.combat,r=n.character.sprinting;r&&i.triggerWhileSprinting&&a.phase==="idle"&&a.usedWindowId!==a.windowId&&i.windows.sprint>0&&(a.linkWindow=Math.max(a.linkWindow,i.windows.sprint),a.source="sprint"),a.phase==="idle"&&a.prevSprinting&&!r&&Nl(n,"sprint"),a.prevSprinting=r,nx(n,t);const c=i.moves[o.weapon];e.attackPressed&&a.phase==="idle"&&a.linkWindow>0&&a.usedWindowId!==a.windowId&&a.cooldown<=0&&o.phase==="idle"&&!o.charging&&n.dash.phase==="idle"&&!!c&&c.enabled&&ex(n,e,c,o.weapon)}const Nr={windup:0,active:1,recovery:2},au=1e-9;function Up(n){return Number.isFinite(n)?n<0?0:n>1?1:n:0}function ax(n){return n==="windup"||n==="active"||n==="recovery"}function sx(n,t){return Nr[n]+Up(t)}function ox(n,t,e){if(!n||n.length===0)return[];if(!Number.isFinite(e)||e<0)return[];const i=Number.isFinite(t)?t:-1,a=[];for(const s of n){if(!s||!ax(s.at))continue;const o=Up(s.u??0),r=Nr[s.at]+o;r>i+au&&r<=e+au&&a.push({name:s.name,value:Number.isFinite(s.value)?s.value:0,at:s.at,u:o})}return a.sort((s,o)=>Nr[s.at]+s.u-(Nr[o.at]+o.u)),a}const Uo=1e-6;function ma(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function rx(n,t,e){const i=n.character.position;n.events.push({type:"notify",tick:n.tick,x:i.x,y:i.y,z:i.z,value:e,name:t})}function Np(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function xc(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.hitstop=0,t.notifyCursor=-1,t.hitIds.length=0,t.warp=1,t.warpDebt=0,t.warpPhase=0,t.warpTimer=0,t.slamAttackId=0,t.timings=Np()}function Op(n){return{weapon:_a[Math.max(0,n-1)]??_a[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,hitstop:0,notifyCursor:-1,hitIds:[],warp:1,warpDebt:0,warpPhase:0,warpTimer:0,slamAttackId:0,timings:Np()}}function cx(n,t){return zo(n,t)}function lx(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,a=Math.max(0,t*e.maxLungeScale),s=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+s,a)}function Bp(n,t,e,i){const a=n.combat;a.phase="windup",a.phaseTimer=0,a.comboIndex=i,a.queued=!1,a.charging=!1,a.charge=0,a.attackFacing=cx(n,t),a.attackProgress=0,a.timings=e,a.attackId+=1,a.warpDebt=0,a.warpPhase=0,a.warpTimer=0,a.warp=1,a.notifyCursor=-1,a.hitIds.length=0,ma(n,"attack-start",i)}function Hp(n){return Math.max(0,n.config.combat.settle)}function Ol(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];Bp(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Hp(n),lunge:lx(n,i.lunge[e-1]??0)},e)}function su(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,Bp(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Hp(n),lunge:i.lunge},0),jg(n,e,n.combat.attackFacing),ma(n,"charge-release",e)}function dx(n,t){const e=n.combat,i=n.config.hits.hitstopWarp;if(!i||!i.enabled)return e.warp=e.hitstop>0?0:1,e.warp;const a=Math.max(0,Math.min(1,i.holdRate));if(e.hitstop>0)return e.warpPhase=1,e.warpTimer=e.hitstop,e.warp=a,e.warpDebt+=t*(1-a),e.warp;if(e.warpPhase===1&&(e.warpPhase=2,e.warpTimer=0),e.warpPhase===2){const s=Math.max(.001,i.release);e.warpTimer+=t;const o=Math.min(1,e.warpTimer/s),r=1-(1-o)*(1-o),c=a+(1-a)*r;if(e.warp=c,e.warpDebt+=t*(1-c),o>=1){e.warpPhase=3,e.warpTimer=0;const l=Math.max(0,e.timings.recovery)*Math.max(0,i.payback-1)*Math.max(0,Math.min(1,i.paybackBudget));e.warpDebt=Math.min(e.warpDebt,l)}return e.warp}if(e.warpPhase===3&&e.warpDebt>1e-6){const s=Math.min(Math.max(0,i.payback-1),e.warpDebt/Math.max(t,1e-5));return e.warp=1+s,e.warpDebt=Math.max(0,e.warpDebt-t*s),e.warpDebt<=1e-6&&(e.warpPhase=0,e.warp=1),e.warp}return e.warpPhase=0,e.warp=1,1}function hx(n,t,e){const i=n.combat;if(i.phase==="idle"){i.warp=1,i.warpPhase=0,i.warpTimer=0,i.warpDebt=0;return}const a=i.timings,s=dx(n,t),o=t*s;i.phaseTimer+=o;let r=0;for(;i.phase!=="idle"&&r++<8;){const d=i.phase==="windup"?a.windup:i.phase==="active"?a.active:i.phase==="recovery"?a.recovery:a.settle;if(i.phaseTimer<d)break;if(i.phaseTimer-=d,i.phase==="windup")i.phase="active",ma(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",i.warpPhase=0,i.warpDebt=0,i.warpTimer=0,i.warp=1,ma(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.weapons[i.weapon].comboWindow??n.config.combat.comboWindow,i.queued){i.queued=!1;const u=n.config.combat.weapons[i.weapon];u.comboCount>0&&Ol(n,e,i.comboIndex<u.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const d=i.timings.recovery;if(d>Uo&&i.phaseTimer>=d*n.config.combat.cancelWindow){i.queued=!1;const u=n.config.combat.weapons[i.weapon];u.comboCount>0&&Ol(n,e,i.comboIndex<u.comboCount?i.comboIndex+1:1)}}const c=a.windup+a.active+a.recovery;let l=0;i.phase==="windup"?l=i.phaseTimer:i.phase==="active"?l=a.windup+i.phaseTimer:i.phase==="recovery"?l=a.windup+a.active+i.phaseTimer:i.phase==="settle"&&(l=c),i.phase!=="idle"&&(i.attackProgress=c>0?Math.min(1,l/c):1),ux(n)}function ux(n){const t=n.combat;if(t.phase==="idle")return;const e=t.timings,i=t.phase==="windup"?e.windup:t.phase==="active"?e.active:t.phase==="recovery"?e.recovery:0,a=i>Uo?Math.min(1,Math.max(0,t.phaseTimer/i)):1,s=t.phase==="settle"?3:sx(t.phase,a);if(s<=t.notifyCursor+Uo)return;const o=n.config.combat.weapons[t.weapon].notifies;for(const r of ox(o,t.notifyCursor,s))rx(n,r.name,r.value);t.notifyCursor=s}function fx(n,t,e){const i=n.combat,a=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=_a.length){const c=_a[e.weaponSlot-1];c!==i.weapon&&(i.weapon=c,xc(n),Qr(n),ma(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,ma(n,"combo-reset",0))),i.hitstop>0&&(n.impulse.x=0,n.impulse.z=0,n.character.velocity.x=0,n.character.velocity.z=0),hx(n,t,e);const s=a.weapons[i.weapon],o=n.dash.phase==="active";if(s.comboCount>0){const c=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!o&&!c&&(e.attackPressed||a.autoCombo&&e.attackHeld))if(i.phase==="idle"){const d=i.comboWindow>0&&i.comboIndex<s.comboCount?i.comboIndex+1:1;Ol(n,e,d)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&!o&&!n.playerLink.consumedAttack){if(e.attackHeld){if(i.charging||(i.charging=!0,i.charge=0,ma(n,"charge-start",0)),i.charge=Math.min(1,i.charge+t/Math.max(a.bow.maxChargeTime,Uo)),a.bow.autoFire&&i.charge>=1){i.charging=!1;const c=i.charge;i.charge=0,su(n,e,c)}}else if(i.charging){i.charging=!1;const c=i.charge;i.charge=0,c>=a.bow.minChargeToFire?su(n,e,c):ma(n,"charge-release",0)}}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.hitstop<=0&&i.timings.active>Uo)){const c=i.timings.active,l=Math.max(0,i.timings.lunge),d=Math.max(.2,a.lungeCurve),u=g=>l*(1-Math.pow(1-Math.min(1,Math.max(0,g/c)),d+1)),h=t*i.warp,f=Math.min(c,Math.max(0,i.phaseTimer)),m=Math.min(c,Math.max(0,i.phaseTimer-h));let v=Math.max(0,u(f)-u(m))/Math.max(h,1e-4);v=Math.min(v,Math.max(0,a.lungeMaxSpeed)),n.impulse.x=Math.sin(i.attackFacing)*v,n.impulse.z=Math.cos(i.attackFacing)*v}i.hitstop>0&&(i.hitstop=Math.max(0,i.hitstop-t))}const hn=1e-6,Bl=Math.PI*2,px=7,mx=18,Gp=1.3,Xp=.4,gx=.9,ou=.9;function ru(n,t,e,i){const a=Math.max(e,.1),s=((n+t*2.37)%a+a)%a,o=Math.min(Math.max(i,0),1)*a;if(o<=hn||s>=o)return 0;const r=Math.min(Math.max(a*.12,.15),o*.5),c=Math.min(1,Math.min(s/r,(o-s)/r));return c*c*(3-2*c)}function xx(n,t){const e=Math.hypot(n,t);return e<=1?{x:n,z:t}:{x:n/e,z:t/e}}function vx(n){return Math.atan2(Math.sin(n),Math.cos(n))}function cu(n,t,e,i){return n+vx(t-n)*(1-Math.exp(-Math.max(e,hn)*i))}function tc(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function yx(n){var i;const t=[];for(let a=0;a<n.count;a++){const s=n.spawn[a]??{x:0,z:0},o=n.initialModes[a]??"idle";t.push(Hl(a+1,o,s.x,s.z,null))}const e=n.fighters;if(e)for(let a=0;a<e.weapons.length;a++){const s=e.spawn[a]??{x:0,z:0},o=((i=e.initialModes)==null?void 0:i[a])??"spar",r=e.attackInterval*(.25+.22*a);t.push(Hl(t.length+1,o,s.x,s.z,e.weapons[a],r))}return t}function Hl(n,t,e,i,a,s=0){return{id:n,mode:t,initialMode:t,homeX:e,homeZ:i,position:{x:e,y:0,z:i},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:e,targetZ:i,wanderTimer:0,attackCooldown:s,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,attackComboIndex:0,attackComboLeft:0,comboGap:0,hurt:bp(),link:gc(),weapon:a,combat:a?{...Op(_a.indexOf(a)+1),weapon:a}:null}}function Mx(n,t=!1){const e=t?Mp:dg,i=e.indexOf(n);return e[(i+1)%e.length]}function Vp(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],a=t.spawn[e]??{x:i.homeX,z:i.homeZ},s=t.initialModes[e]??i.initialMode;i.mode=s,i.initialMode=s,i.homeX=a.x,i.homeZ=a.z,i.position.x=a.x,i.position.y=0,i.position.z=a.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=a.x,i.targetZ=a.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0,i.attackComboIndex=0,i.attackComboLeft=0,i.comboGap=0;const o=i.hurt;if(o.type="none",o.timer=0,o.duration=0,o.dirX=0,o.dirZ=0,o.knockX=0,o.knockZ=0,Jg(i.link),i.combat){const r=i.combat;r.phase="idle",r.comboIndex=0,r.phaseTimer=0,r.attackProgress=0,r.attackFacing=0,r.charging=!1,r.charge=0,r.hitstop=0,r.warp=1,r.warpPhase=0,r.warpDebt=0,r.warpTimer=0,r.hitIds.length=0,r.timings={windup:0,active:0,recovery:0,settle:0,lunge:0}}}n.dummyAttackCount=0}function _x(n,t,e){const i=Nc(n)*Bl,a=Math.sqrt(Nc(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*a,t.targetZ=t.homeZ+Math.sin(i)*a,t.wanderTimer=e.wanderInterval*(.6+Nc(n)*.8)}function Jd(n,t,e){if(t.weapon){const i=n.config.combat.weapons[t.weapon];if(i)return{windup:i.windup,active:i.active,recovery:i.recovery}}return{windup:e.attackWindup,active:e.attackActive,recovery:e.attackRecovery}}function Gl(n,t,e){var s;if(!t.weapon)return e.attackRange;const i=n.config.hits.reach[t.weapon]??e.attackRange,a=((s=e.fighters)==null?void 0:s.attackRangeScale)??.9;return Math.max(.4,i*a)}function Xl(n,t){return n.weapon&&t.fighters?t.fighters.attackInterval:t.attackInterval}function bx(n,t){return n.weapon&&t.fighters?Math.max(t.leashRadius,t.fighters.leashRadius):t.leashRadius}function Sx(n,t,e){const i=Jd(e,n,t);return n.attackPhase==="windup"?i.windup:n.attackPhase==="active"?i.active:n.attackPhase==="recovery"?i.recovery:0}function wx(n,t,e){var s;if(!t.weapon)return 1;const i=((s=e.fighters)==null?void 0:s.comboCount)??0;if(i>0)return Math.max(1,Math.round(i));const a=n.config.combat.weapons[t.weapon];return Math.max(1,Math.round((a==null?void 0:a.comboCount)??1))}function Ex(n,t){var i;const e=((i=t.fighters)==null?void 0:i.comboGap)??0;return e>0?e:Math.max(0,n.config.combat.settle)}function Tx(n){return n.attackPhase!=="idle"||n.attackComboLeft>0}function Ax(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0,lu(n,t,i);return}t.attackPhaseTimer+=e;let a=0;for(;t.attackPhase!=="idle"&&a++<4;){const c=Math.max(Sx(t,i,n),hn);if(t.attackPhaseTimer<c)break;t.attackPhaseTimer-=c,t.attackPhase==="windup"?(t.attackPhase="active",tc(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0,t.attackComboLeft>0?t.comboGap=Ex(n,i):(t.attackComboIndex=0,t.weapon&&t.attackCooldown<=0&&(t.attackCooldown=Xl(t,i)*Xp)))}const s=Jd(n,t,i),o=s.windup+s.active+s.recovery;let r=0;t.attackPhase==="windup"?r=t.attackPhaseTimer:t.attackPhase==="active"?r=s.windup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(r=s.windup+s.active+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||o<=0?0:Math.min(1,r/o),lu(n,t,i)}function lu(n,t,e){const i=t.combat;if(!i)return;const a=Jd(n,t,e),s=t.attackPhase==="idle"&&t.attackComboLeft>0&&t.comboGap>0;i.weapon=t.weapon??i.weapon,i.phase=s?"settle":t.attackPhase,i.comboIndex=t.attackComboIndex,i.phaseTimer=t.attackPhaseTimer,i.attackProgress=s?1:t.attackProgress,i.attackFacing=t.facing,i.timings={windup:a.windup,active:a.active,recovery:a.recovery,settle:0,lunge:0},i.hitstop=0,i.warp=1,i.warpPhase=0,i.charging=!1,i.charge=0}function Rx(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,a=i.x-t.position.x,s=i.z-t.position.z,o=Math.hypot(a,s),r=o>hn?a/o:0,c=o>hn?s/o:0;let l=0,d=0;if(t.mode==="wander"){const h=t.targetX-t.position.x,f=t.targetZ-t.position.z,m=Math.hypot(h,f);(t.wanderTimer<=0||m<.3)&&_x(n,t,e);const v=t.targetX-t.position.x,g=t.targetZ-t.position.z,p=Math.hypot(v,g);p>hn&&(l=v/p,d=g/p)}else if(t.mode==="follow")o>e.followStopDistance&&(l=r,d=c);else if(t.mode==="keep-distance"){const h=o-e.keepDistance,f=Math.max(e.keepDeadZone,.2),m=Math.max(-1,Math.min(1,h/f))*ou,v=ru(n.time,t.id,e.strafePeriod,e.strafeDuty)*e.keepStrafe;l=r*m-c*v,d=c*m+r*v}else if(t.mode==="attack")o>Gl(n,t,e)&&t.attackPhase==="idle"&&(l=r,d=c);else if(t.mode==="spar"){const h=Gl(n,t,e),f=h*1.7;if(Tx(t))o>h*Gp?(l=r,d=c):o<h*.55&&(l=-r*.6,d=-c*.6);else if(t.attackPhase==="idle"&&t.attackCooldown<=0&&o>h)l=r,d=c;else{const v=Math.max(-1,Math.min(1,(o-f)/.5))*ou,g=ru(n.time,t.id,e.strafePeriod,e.strafeDuty)*gx;l=r*v-c*g,d=c*v+r*g}}({x:l,z:d}=xx(l,d));let u=t.facing;if(t.mode==="wander"?Math.hypot(l,d)>hn&&(u=Math.atan2(l,d)):o>hn&&(u=Math.atan2(r,c)),e.leashRadius>hn&&t.mode!=="wander"&&t.mode!=="idle"){const h=bx(t,e),f=t.position.x-t.homeX,m=t.position.z-t.homeZ,v=Math.hypot(f,m);if(v>h){const g=Math.min(1,(v-h)/Math.max(h*.5,.5)),p=-f/v,_=-m/v;l=l*(1-g)+p*g,d=d*(1-g)+_*g;const x=Math.hypot(l,d);x>hn&&(l/=x,d/=x)}}return{x:l,z:d,facing:u}}function Px(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.comboGap=Math.max(0,e.comboGap-t),e.hurt.timer>0&&(e.attackComboLeft=0,e.comboGap=0),(e.mode==="attack"||e.mode==="spar")&&e.attackPhase==="idle"&&e.hurt.timer<=0){const _=n.character.position,x=Math.hypot(_.x-e.position.x,_.z-e.position.z),y=Gl(n,e,i);if(e.attackComboLeft>0)e.comboGap<=0&&(x<=y*Gp+hn?(e.attackComboIndex+=1,e.attackComboLeft-=1,e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,n.dummyAttackCount+=1,tc(n,"dummy-attack",e)):(e.attackComboLeft=0,e.attackComboIndex=0,e.attackCooldown=Math.max(e.attackCooldown,Xl(e,i)*Xp)));else if(e.attackCooldown<=0&&x<=y+hn){const S=wx(n,e,i);e.attackComboIndex=1,e.attackComboLeft=Math.max(0,S-1),e.comboGap=0,e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=Xl(e,i),n.dummyAttackCount+=1,tc(n,"dummy-attack",e)}}Ax(n,e,t,i);const a=Rx(n,e,i),s=n.config.worldBounds;(a.x>0&&e.position.x>=s.maxX-hn||a.x<0&&e.position.x<=s.minX+hn)&&(a.x=0),(a.z>0&&e.position.z>=s.maxZ-hn||a.z<0&&e.position.z<=s.minZ+hn)&&(a.z=0);const o=1-Math.exp(-Math.max(i.acceleration,hn)*t),r=e.weapon&&i.fighters?i.fighters.moveSpeed:i.moveSpeed;e.velocity.x+=(a.x*r-e.velocity.x)*o,e.velocity.z+=(a.z*r-e.velocity.z)*o,e.facing=a.facing,e.bodyYaw=cu(e.bodyYaw,e.facing,px,t),e.headYaw=cu(e.headYaw,e.facing,mx,t);const c=e.position.x,l=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const d=n.config.stepHeight;if(Zd(n.boxes,e.position,i.radius,i.height,d))if(jd(n.boxes,e.position,i.radius,i.height,d))e.position.x=c,e.position.z=l,e.velocity.x=0,e.velocity.z=0;else{const _=e.position.x-c,x=e.position.z-l;Math.abs(_)<Math.abs(e.velocity.x*t)*.5&&(e.velocity.x=0),Math.abs(x)<Math.abs(e.velocity.z*t)*.5&&(e.velocity.z=0)}const h=n.config.worldBounds;e.position.x<h.minX?(e.position.x=h.minX,e.velocity.x<0&&(e.velocity.x=0),e.hurt.knockX<0&&(e.hurt.knockX=0)):e.position.x>h.maxX&&(e.position.x=h.maxX,e.velocity.x>0&&(e.velocity.x=0),e.hurt.knockX>0&&(e.hurt.knockX=0)),e.position.z<h.minZ?(e.position.z=h.minZ,e.velocity.z<0&&(e.velocity.z=0),e.hurt.knockZ<0&&(e.hurt.knockZ=0)):e.position.z>h.maxZ&&(e.position.z=h.maxZ,e.velocity.z>0&&(e.velocity.z=0),e.hurt.knockZ>0&&(e.hurt.knockZ=0));const f=Fo(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,d,Number.POSITIVE_INFINITY);f>Number.NEGATIVE_INFINITY&&f<=e.position.y+d+hn&&(e.position.y=f);const m=Math.hypot(e.position.x-c,e.position.z-l);e.distance+=m;const v=Math.hypot(e.velocity.x,e.velocity.z),g=Math.min(n.config.strideSpeedCap,v/Math.max(n.config.moveSpeed,hn)),p=Math.max(n.config.strideLength*(1+g*n.config.strideSpeedGain),hn);e.stride=p,e.gaitPhase=(e.gaitPhase+m/p*Bl)%Bl}function Cx(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const a=n.dummies[e.dummyClickId-1];a.mode=Mx(a.mode,!!a.weapon),a.targetX=a.position.x,a.targetZ=a.position.z,a.wanderTimer=0,a.attackCooldown=0,a.attackPhase="idle",a.attackPhaseTimer=0,a.attackProgress=0,a.attackComboIndex=0,a.attackComboLeft=0,a.comboGap=0,a.combat&&(a.combat.phase="idle",a.combat.attackProgress=0,a.combat.comboIndex=0),tc(n,"dummy-mode",a)}for(const a of n.dummies)Px(n,t,a,i)}const Dx=["idle","attack","keep-distance"],Lx=["sword-shield","dual-swords","greatsword"];function Vl(n,t){const e=n.dummies.length,i=n.dummies.filter(a=>a.spawnedByPlot?t!==void 0&&a.spawnedByPlot!==t:!0);n.dummies=i;for(let a=0;a<n.dummies.length;a++)n.dummies[a].id=a+1;return e-n.dummies.length}function kx(n,t){var h,f;const e=t.testSpawn??{},i=Math.max(0,Math.floor(e.dummies??0)),a=Math.max(0,Math.floor(e.fighters??0));Vl(n,t.id);const s=i+a;if(s===0)return 0;const o=Math.max(.4,e.ringRadius??1.6),r=e.startDeg??-90,c=e.modes??Dx,l=e.weapons??((h=n.config.dummies.fighters)==null?void 0:h.weapons)??Lx,d=((f=n.config.dummies.fighters)==null?void 0:f.attackInterval)??3.4,u=[];for(let m=0;m<s;m++){const v=(r+360*m/s)*Math.PI/180,g=t.centerX+Math.cos(v)*o,p=t.centerZ+Math.sin(v)*o,_=m>=i,x=m-i,y=_?"spar":c[m%c.length],S=_?l[x%l.length]:null,w=_?d*(.25+.22*x):0,T=Hl(n.dummies.length+u.length+1,y,g,p,S,w);T.spawnedByPlot=t.id,u.push(T)}return n.dummies.push(...u),u.length}function Ix(n){let t=0;for(const e of n.dummies)e.spawnedByPlot&&t++;return t}const Wl=1e-6;function Oc(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function zx(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function Wp(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function du(n,t,e){return n<t?t:n>e?e:n}function Fx(n,t,e){const i=n.config.dash,s=n.character.position,o=n.config.worldBounds,r=Math.max(.05,i.blinkStep),c=Math.max(0,i.blinkDistance);let l=0,d=s.x,u=s.z;for(;l<c-Wl;){const h=Math.min(c,l+r),f=s.x+t*h,m=s.z+e*h,v=du(f,o.minX,o.maxX),g=du(m,o.minZ,o.maxZ),p={x:v,y:s.y,z:g};if(jd(n.boxes,p,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(d=v,u=g,l=h,v!==f||g!==m))break}return{x:d,z:u}}function Ux(n,t,e){const i=n.dash,a=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,Nl(n,"roll")),i.cooldown>0){const c=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),c>0&&i.cooldown===0&&Oc(n,"dash-ready",0)}const s=n.combat,o=s.weapon==="bow"&&(s.charging||s.phase!=="idle");if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&(s.phase==="idle"||o)&&n.playerLink.phase==="idle"){o&&(s.charging=!1,s.charge=0,s.phase!=="idle"&&xc(n));const c=hg(n,e),l=c.x,d=c.z,u=n.combat.weapon==="staff";if(i.kind=u?"blink":"roll",i.dirX=l,i.dirZ=d,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=u?a.blinkCooldown:a.rollCooldown,u){const h=Fx(n,l,d);n.character.position.x=h.x,n.character.position.z=h.z,i.toX=h.x,i.toZ=h.z,i.duration=0,i.timer=0,i.phase="idle",a.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),Nl(n,"blink"),Oc(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(Wl,a.rollDuration),i.timer=i.duration,i.toX=i.fromX+l*a.rollDistance,i.toZ=i.fromZ+d*a.rollDistance,Oc(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const c=Math.max(Wl,i.timer),l=n.character.position.x,d=n.character.position.z;n.impulse.x=(i.toX-l)/c,n.impulse.z=(i.toZ-d)/c}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const xi=1e-6,hu=Math.PI*2;function uu(n,t){return Math.sqrt(n*n+t*t)}function er(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Nx(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.headPitch=0,t.bodyPitch=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,xc(n)}function Ox(n,t,e){const i=n.character,a=n.config,s=Fo(n.boxes,t,e,a.characterHeight,a.characterRadius,a.stepHeight,Number.POSITIVE_INFINITY);i.position.x=t,i.position.y=s>Number.NEGATIVE_INFINITY?s:0,i.position.z=e,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.moveYaw=0,i.bodyYaw=0,i.headYaw=0,i.headPitch=0,i.bodyPitch=0,i.grounded=!0,i.sprinting=!1,i.gaitPhase=0,i.stride=a.strideLength,i.distance=0,i.coyoteTime=a.coyoteTime,i.jumpBuffer=0,xc(n),Fp(n),Wp(n),Dp(n),zp(n),Kr(n);const o=n.targeting;o.targetId=0,o.targetYaw=0,o.targetDist=0,o.hasTarget=!1;const r=n.playerHurt;r.type="none",r.lastAt=Vd,r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,n.events.length=0}function Bx(n,t,e){const i=n.config,a=n.character,s=a.position,o=a.velocity;let r=Number.isFinite(e.moveX)?e.moveX:0,c=Number.isFinite(e.moveZ)?e.moveZ:0;const l=uu(r,c);l>1&&(r/=l,c/=l);const d=i.worldBounds;(r>0&&s.x>=d.maxX-xi||r<0&&s.x<=d.minX+xi)&&(r=0),(c>0&&s.z>=d.maxZ-xi||c<0&&s.z<=d.minZ+xi)&&(c=0);const u=n.combat.phase!=="idle",h=n.playerLink.phase!=="idle",f=n.dash.phase==="active",m=u||f||h;a.sprinting=!m&&e.sprintHeld&&l>xi;const v=i.combat.weapons[n.combat.weapon];let g=v?v.moveMultiplier:1;f||h?g=0:u?g*=n.combat.phase==="active"?i.combat.lungeMoveScale:n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?g*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(g*=Math.max(0,Math.min(1,n.abilities.channelMoveScale)));const p=i.moveSpeed*(a.sprinting?i.sprintMultiplier:1)*g;{const D=m?i.skillDecel:l>xi?i.acceleration:i.friction,F=1-Math.exp(-D*t);o.x+=(r*p-o.x)*F,o.z+=(c*p-o.z)*F}e.jumpPressed?a.jumpBuffer=i.jumpBufferTime:a.jumpBuffer=Math.max(0,a.jumpBuffer-t),a.coyoteTime=a.grounded?i.coyoteTime:Math.max(0,a.coyoteTime-t),a.jumpBuffer>0&&a.coyoteTime>0&&(o.y=i.jumpSpeed,a.grounded=!1,a.coyoteTime=0,a.jumpBuffer=0,er(n,"jumped",i.jumpSpeed)),n.events.some(D=>D.type==="blink"&&D.tick===n.tick)&&(o.x=0,o.z=0,n.impulse.x=0,n.impulse.z=0);const x=s.x,y=s.z;if(s.x+=(o.x+n.impulse.x+n.playerHurt.knockX)*t,s.z+=(o.z+n.impulse.z+n.playerHurt.knockZ)*t,Zd(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight)){if(jd(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight))s.x=x,s.z=y,o.x=0,o.z=0;else{const D=s.x-x,F=s.z-y;Math.abs(D)<Math.abs(o.x*t)*.5&&(o.x=0),Math.abs(F)<Math.abs(o.z*t)*.5&&(o.z=0)}er(n,"blocked",1)}s.x<d.minX?(s.x=d.minX,o.x<0&&(o.x=0),n.playerHurt.knockX<0&&(n.playerHurt.knockX=0)):s.x>d.maxX&&(s.x=d.maxX,o.x>0&&(o.x=0),n.playerHurt.knockX>0&&(n.playerHurt.knockX=0)),s.z<d.minZ?(s.z=d.minZ,o.z<0&&(o.z=0),n.playerHurt.knockZ<0&&(n.playerHurt.knockZ=0)):s.z>d.maxZ&&(s.z=d.maxZ,o.z>0&&(o.z=0),n.playerHurt.knockZ>0&&(n.playerHurt.knockZ=0));const w=Fo(n.boxes,s.x,s.z,s.y,i.characterRadius,i.stepHeight,i.fallTolerance);a.grounded&&w>s.y+xi&&w-s.y<=i.stepHeight+xi&&(s.y=w,o.y=0,er(n,"stepUp",w));const T=s.y;o.y-=i.gravity*t,s.y+=o.y*t;const R=Fo(n.boxes,s.x,s.z,T,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);R>Number.NEGATIVE_INFINITY&&s.y<=R&&o.y<=0?(s.y=R,o.y=0,a.grounded||er(n,"landed",R),a.grounded=!0):a.grounded=!1;const b=uu(s.x-x,s.z-y);a.distance+=b;const M=b/Math.max(t,xi),C=Math.min(i.strideSpeedCap,M/Math.max(i.moveSpeed,xi)),k=Math.max(i.strideLength*(1+C*i.strideSpeedGain),xi);a.stride=k,a.gaitPhase=(a.gaitPhase+b/k*hu)%hu}const Yl=1e-6,fu=2.399963229728653;function Ga(n,t,e){return n<t?t:n>e?e:n}function pu(n,t,e,i,a,s,o,r,c){const l=t.x-n.x,d=t.z-n.z,u=Math.hypot(l,d),h=e+i;if(u>=h)return;let f,m,v;u<Yl?(f=r,m=c,v=h):(f=l/u,m=d/u,v=h-u);const g=v+o;n.x-=f*g*a,n.z-=m*g*a,t.x+=f*g*s,t.z+=m*g*s}function Hx(n){const t=n.config.separation,e=n.dummies,i=n.character.position,a=n.config.characterRadius,s=n.config.dummies.radius,o=Math.max(1,Math.floor(t.iterations)),r=Math.max(0,t.slop);for(let d=0;d<o;d++){for(let u=0;u<e.length;u++)for(let h=u+1;h<e.length;h++){const f=(u*3+h)*fu;pu(e[u].position,e[h].position,s,s,.5,.5,r,Math.cos(f),Math.sin(f))}for(let u=0;u<e.length;u++){const h=(u+1)*fu;pu(i,e[u].position,a,s,0,1,r,Math.cos(h),Math.sin(h))}}const c=n.config.stepHeight,l=n.config.worldBounds;for(const d of e)Zd(n.boxes,d.position,s,n.config.dummies.height,c),d.position.x=Ga(d.position.x,l.minX,l.maxX),d.position.z=Ga(d.position.z,l.minZ,l.maxZ)}function Gx(n,t,e,i,a,s,o,r){const c=Math.hypot(e,i),l=Math.max(0,r.contactBand),d=Ga(r.minScale,0,1);if(c<Yl||l<=0||d>=1)return 1;const u=a+o,h=Ga(r.approachDot,0,.99);let f=0;for(const m of s){const v=m.position.x-n,g=m.position.z-t,p=Math.hypot(v,g);if(p>=u+l)continue;if(p<Yl){f=1;continue}const _=(e*v+i*g)/(c*p);if(_<=h)continue;const x=Ga(1-(p-u)/l,0,1),y=Ga((_-h)/(1-h),0,1);f=Math.max(f,x*y)}return 1-(1-d)*Ga(f,0,1)}function Xx(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=Gx(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const Bc=1e-6,Vx=Math.PI/180;function Wx(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function Yx(n,t,e){return n<t?t:n>e?e:n}function $x(n,t,e){const i=n.config.targeting,a=n.targeting,s=n.character.position;let o=n.character.facing;const r=Math.hypot(e.aimX,e.aimZ);e.aimActive&&r>Bc?o=Math.atan2(e.aimX,e.aimZ):Math.hypot(e.moveX,e.moveZ)>Bc&&(o=Math.atan2(e.moveX,e.moveZ));const c=Yx(i.maxAngleDeg,0,180)*Vx;let l=Number.POSITIVE_INFINITY,d=0,u=0,h=0;for(const f of n.dummies){const m=f.position.x-s.x,v=f.position.z-s.z,g=Math.hypot(m,v);if(g<Bc||g>i.range)continue;const p=Math.atan2(m,v),_=Math.abs(Ge(p-o));if(_>c)continue;const x=g-i.frontBias*Math.cos(_);x<l&&(l=x,d=f.id,u=p,h=g)}a.targetId=d,a.targetYaw=u,a.targetDist=h,a.hasTarget=d>0}const Li=1e-6;function Ds(n,t,e){return n<t?t:n>e?e:n}function mu(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Zx(n,t,e){const i=n.config.gaze,a=n.gaze;if(!i.enabled||!n.modules.gaze){a.active=!1,a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}const s=n.character.position,o=(D,F)=>{const A=D.position.x-s.x,E=D.position.z-s.z,z=Math.hypot(A,E);if(z<Li||z>F)return 0;const G=Ds((F-z)/Math.max(Li,F-i.nearDistance),0,1);let X=G*(i.modeWeight[D.mode]??.5);return D.attackPhase==="active"&&(X+=i.attackBoost*G),X},r=[];let c=0,l=!1,d=!1,u=!1;for(const D of n.dummies){const F=o(D,i.threatRange),A=D.position.x-s.x,E=D.position.z-s.z,z=Math.hypot(A,E);F>0&&(r.push({id:D.id,x:D.position.x,z:D.position.z,dx:A,dz:E,yaw:Math.atan2(A,E),w:F}),c+=F,z<=i.approachDist&&(i.modeWeight[D.mode]??.5)>=i.hostileModeWeight&&(u=!0)),z>Li&&z<=i.recoveryDist&&(l=!0),(D.attackPhase==="windup"||D.attackPhase==="active")&&z<=i.threatRange&&(d=!0)}const h=c<=0?0:Ds(c/(c+Math.max(Li,i.saturation)),0,1),f=r.length>0,m=a.active,v=f&&(e.aimActive&&h>=i.enterThreshold||i.reactToAttack&&d&&h>=i.enterThreshold||i.reactToApproach&&u),g=i.hurtHoldSec>Li&&n.time-n.playerHurt.lastAt<i.hurtHoldSec,p=m&&(l||g);if(a.active=v||p,!a.active){a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}if(r.length===0)return;r.sort((D,F)=>F.w-D.w);const _=r.slice(0,Math.max(1,i.maxThreats)),x=r[0],y=Math.atan2(x.dx,x.dz),S=i.behindAngleDeg*Math.PI/180,w=n.character.bodyYaw;let T=0,R=0,b=0;for(const D of _){const F=Math.abs(mu(D.yaw-y))/Math.PI;let A=D.w/(1+Math.max(i.spreadFalloff,0)*F*F);D!==x&&i.behindFalloff<1&&Math.abs(mu(D.yaw-w))>S&&(A*=Math.max(i.behindFalloff,0)),T+=D.x*A,R+=D.z*A,b+=A}a.mainId=x.id,a.mainYaw=y;const M=n.dummies.find(D=>D.id===x.id),C=(M?M.position.y:0)+n.config.dummies.height*Ds(i.aimHeightRatio,0,1),k=s.y+n.config.characterHeight*Ds(i.eyeHeightRatio,0,1);a.mainPitch=Math.atan2(C-k,Math.max(Li,Math.hypot(x.dx,x.dz))),a.centroidYaw=b>Li?Math.atan2(T/b-s.x,R/b-s.z):y,a.threatCount=r.length,a.threat=h}function jx(n,t){const e=n.config.gaze;return(e.modeWeight[t.mode]??.5)>=e.hostileModeWeight}function qx(n,t){const e=n.config.gaze;if(!e.enabled||!n.modules.gaze)return 0;const i=n.character.position,a=Math.hypot(t.position.x-i.x,t.position.z-i.z);if(a<Li||a>e.threatRange)return 0;const s=Math.max(Li,e.threatRange-e.nearDistance),o=Ds((e.threatRange-a)/s,0,1);let r=o*(e.modeWeight[t.mode]??.5);t.attackPhase==="active"&&(r+=e.attackBoost*o);const c=Math.max(Li,e.modeWeight.attack??1.5);return Ds(r/c,0,1)}const Za=1e-6,Gs=Math.PI*2,No={enabled:!1,dirDeg:0,speed:0,amplitude:0,wavelength:4,secondWave:{wavelength:2,amplitude:0,speedScale:1},gust:{periodSec:8,depth:0},jitter:0,shadeAmount:0};function Yp(n){var t;return((t=n==null?void 0:n.grass)==null?void 0:t.wind)??No}function vc(n){return{time:0,gust:1-Math.min(1,Math.max(0,n.gust.depth))}}function Kx(n,t,e){if(!t.enabled)return;n.time+=Math.max(0,e);const i=Math.max(.1,t.gust.periodSec),a=Math.min(1,Math.max(0,t.gust.depth));n.gust=1-a+a*(.5+.5*Math.sin(Gs*n.time/i-Math.PI/2))}function Jx(n,t,e,i){const a=n.dirDeg*Math.PI/180,s=t*Math.cos(a)+e*Math.sin(a),o=Gs/Math.max(.1,n.wavelength),r=Gs/Math.max(.1,n.secondWave.wavelength);return[o*s+i,r*s+i*1.7]}function $p(n){const t=n.dirDeg*Math.PI/180,e=Gs/Math.max(.1,n.wavelength),i=Gs/Math.max(.1,n.secondWave.wavelength);return{dirX:Math.cos(t),dirZ:Math.sin(t),omega1:e*n.speed,omega2:i*n.speed*n.secondWave.speedScale,amp1:n.amplitude,amp2:n.secondWave.amplitude,shadeAmount:n.shadeAmount}}const Qx=.18,gu=.4,tv=.6;function ev(n,t,e){if(n<0)return 0;if(n===0)return 1;if(t<=0)return 0;const i=Math.min(1,Math.max(0,1-n/t)),a=Math.min(1,Math.max(0,e))*Qx,s=Math.min(1,Math.max(0,(i-a)/(1-a)));return s*s*(3-2*s)}function nv(n){let t=n>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function Zp(n,t){return n+","+t}function iv(n,t,e){return{spec:e??{minCellX:0,maxCellX:0,minCellZ:0,maxCellZ:0,density:0,bladesPerPatch:[0,0],avoidMargin:0,seed:0},cellSize:t.cellSize>0?t.cellSize:.5,bucketCells:(n==null?void 0:n.bucketCells)??4,blades:[],patches:[],buckets:{},cutCount:0,lastCutAt:0,wind:vc((n==null?void 0:n.wind)??No)}}function av(n,t,e,i){const a=t.grass,s=n.grass;if(!a||!s||!s.enabled)return iv(s,i,a);const o=i.cellSize>0?i.cellSize:.5,r=nv(a.seed),c=Math.max(1,Math.floor(s.footprintCells)),l=Math.max(1,s.bucketCells)*o,d=Math.max(o,s.minHeightCells*o),u=Math.max(d,s.maxHeightCells*o),[h,f]=a.bladesPerPatch,m=Math.max(0,Math.floor(h)),v=Math.max(m,Math.floor(f)),g=e.filter(R=>R.kind!=="ground").map(R=>({minX:R.minX-a.avoidMargin,maxX:R.maxX+a.avoidMargin,minZ:R.minZ-a.avoidMargin,maxZ:R.maxZ+a.avoidMargin})),p=[],_=[],x={},y=a.plots??[],S=(R,b)=>{const M=R+c/2,C=b+c/2;for(let k=0;k<y.length;k++){const D=y[k],F=Math.max(0,D.clearMarginCells??0);if(M>=D.minCellX-F&&M<=D.maxCellX+F&&C>=D.minCellZ-F&&C<=D.maxCellZ+F)return!0}return!1},w=(R,b,M)=>{const C=p.length;for(let k=0;k<M;k++){const D=(R+r()*c)*o,F=(b+r()*c)*o;let A=!1;for(let Lt=0;Lt<g.length;Lt++){const Z=g[Lt];if(D>=Z.minX&&D<=Z.maxX&&F>=Z.minZ&&F<=Z.maxZ){A=!0;break}}if(A)continue;const E=Ip(e,D,F,3,0,.05),z=d+(u-d)*r(),G=(z-d)/Math.max(Za,u-d),X=Math.min(1,Math.max(0,r()*.68+G*.32)),et=p.length;p.push({id:et,x:D,y:E,z:F,yaw:r()*Gs,height:z,width:o*.26,tone:X,lean:(r()-.5)*.24,bend:0,bendX:0,bendZ:0,targetBend:0,recover:0,cut:0,cutAt:0});const ht=Zp(Math.floor(D/l),Math.floor(F/l)),gt=x[ht];gt?gt.push(et):x[ht]=[et]}p.length>C&&_.push({id:_.length,cellX:R,cellZ:b,bladeFrom:C,bladeTo:p.length})},T=()=>m+Math.floor(r()*(v-m+1));for(let R=a.minCellZ;R+c<=a.maxCellZ;R+=c)for(let b=a.minCellX;b+c<=a.maxCellX;b+=c){const M=r();S(b,R)||M>a.density||w(b,R,T())}for(let R=0;R<y.length;R++){const b=y[R],M=Math.min(1,Math.max(0,b.density??1));for(let C=b.minCellZ;C+c<=b.maxCellZ;C+=c)for(let k=b.minCellX;k+c<=b.maxCellX;k+=c)r()>M||w(k,C,T())}return{spec:a,cellSize:o,bucketCells:s.bucketCells,blades:p,patches:_,buckets:x,cutCount:0,lastCutAt:0,wind:vc(s.wind??No)}}function jp(n,t,e,i){const a=Math.max(1,n.bucketCells)*n.cellSize,s=Math.floor((t-i)/a),o=Math.floor((t+i)/a),r=Math.floor((e-i)/a),c=Math.floor((e+i)/a),l=[];for(let d=s;d<=o;d++)for(let u=r;u<=c;u++){const h=n.buckets[Zp(d,u)];if(h)for(let f=0;f<h.length;f++)l.push(h[f])}return l}function sv(n){const t=n.grass,e=n.config.grass;if(!t||!e||!e.enabled||!n.modules.grass)return 0;const i=wp(n);if(!i.active&&i.slamRadius<=0)return 0;const a=.02,s=Math.max(i.reach,i.slamRadius)+1;let o=0;const r=jp(t,i.x,i.z,s);for(let c=0;c<r.length;c++){const l=t.blades[r[c]];if(l.cut!==0||!fg(i,l.x,l.z,a)&&!pg(i,l.x,l.z,a))continue;l.cut=e.regrow?Math.max(Za,e.regrowSec):-1,l.cutAt=n.time;const d=l.x-i.x,u=l.z-i.z,h=Math.sqrt(d*d+u*u);l.bendX=h>Za?d/h:i.fx,l.bendZ=h>Za?u/h:i.fz,l.bend=Math.min(e.maxBendRad,.55),l.targetBend=0,o+=1}return o>0&&(t.cutCount+=o,t.lastCutAt=n.time,n.events.push({type:"grass-cut",tick:n.tick,x:i.x,y:n.character.position.y,z:i.z,value:o})),o}function ov(n,t){const e=n.grass,i=n.config.grass;if(!e||e.blades.length===0||!i||!i.enabled||!n.modules.grass)return;const a=Yp(n.config);e.wind||(e.wind=vc(a)),Kx(e.wind,a,t);const s=e.blades,o=s.length,r=new Array(o).fill(0),c=Math.max(0,i.bendRadius)+n.config.characterRadius;for(let m=0;m<o;m++)s[m].targetBend=0;const l=n.character.position.x,d=n.character.position.z,u=(m,v)=>{const g=jp(e,m,v,c);for(let p=0;p<g.length;p++){const _=g[p],x=s[_];if(x.cut!==0)continue;const y=x.x-m,S=x.z-v,w=Math.sqrt(y*y+S*S);if(w>c)continue;const T=1-w/c,R=i.maxBendRad*T*T;if(R>x.targetBend){x.targetBend=R;const b=w>Za?1/w:0;x.bendX=w>Za?y*b:0,x.bendZ=w>Za?S*b:1,x.recover=0}r[_]=1}};if(u(l,d),n.modules.dummies)for(let m=0;m<n.dummies.length;m++)u(n.dummies[m].position.x,n.dummies[m].position.z);const h=1-Math.exp(-Math.max(0,i.bendRate)*t),f=1-Math.exp(-Math.max(0,i.recoverRate)*t);for(let m=0;m<o;m++){const v=s[m];v.bend+=(v.targetBend-v.bend)*(v.targetBend>v.bend?h:f),v.bend<1e-4&&(v.bend=0),!r[m]&&v.bend===0&&(v.recover+=t),v.cut>0&&(v.cut-=t,v.cut<=0&&(v.cut=0))}sv(n)}function rv(n){const t=n.grass;if(!t)return;for(let i=0;i<t.blades.length;i++){const a=t.blades[i];a.bend=0,a.targetBend=0,a.bendX=0,a.bendZ=0,a.recover=0,a.cut=0,a.cutAt=0}t.cutCount=0,t.lastCutAt=0;const e=vc(Yp(n.config));t.wind.time=e.time,t.wind.gust=e.gust}const ua=1e-6,xu=Math.PI/180,cv=1.47;function Oa(n,t,e){return n<t?t:n>e?e:n}function lv(n,t,e,i,a,s,o,r){const c=Math.max(ua,e),l=Oa(r.minU??.08,0,1),d=Oa(r.maxU??.92,0,1);let u=Oa((n-t)/c,l,d);const h=r.bands;if(h&&h.length>0){let D=h[0],F=Math.abs(D-u);for(let A=1;A<h.length;A++){const E=Math.abs(h[A]-u);E<F&&(D=h[A],F=E)}u=Oa(D,l,d)}const f=Math.sqrt(a*a+s*s+o*o),m=f>ua?a/f:0,v=f>ua?s/f:0,g=f>ua?o/f:1,p=Math.sqrt(m*m+g*g),_=p>ua?m/p:0,x=p>ua?g/p:1,y=r.pitchGain??.85,S=Oa(r.maxTiltDeg??62,0,89)*xu,w=Math.max(0,-v);let T=Math.min(S,Oa(r.tiltDeg,0,89)*xu+w*y);const R=u*c,b=Math.min(R,c-R),M=Math.atan(Math.max(0,b*.9)/Math.max(ua,i));T=Math.min(T,M);const C=Math.tan(T),k=1/Math.sqrt(1+C*C);return{u,theta:T,nx:_*C*k,ny:k,nz:x*C*k,ax:x,ay:0,az:-_}}function dv(n,t,e,i,a,s,o){const r=e*i,c=1/Math.max(ua,s),l=Math.max(1,Math.floor(t)),d=[];for(let u=0;u<l;u++){const h=u/l*Math.PI*2,f=Math.cos(h)*n,m=Math.sin(h)*n;d.push(Oa(r-(a*f+o*m)*c,0,i))}return d}function hv(n){return!n||n.length===0?[]:n.map(t=>({id:t.id,kind:t.kind,x:t.x,y:t.y,z:t.z,height:t.height,radius:t.radius,tiltDeg:t.tiltDeg??18,pitchGain:t.pitchGain??.85,maxTiltDeg:t.maxTiltDeg??62,fallSec:t.fallSec??.9,bands:t.bands?[...t.bands]:[],color:t.color??"#8a6b4a",cutColor:t.cutColor??"#e8c9a0",broken:0,cutU:1,theta:0,nx:0,ny:1,nz:0,ax:0,ay:0,az:-1,fall:0,brokenAt:0}))}function qp(n,t,e,i,a,s,o){const r=lv(i,t.y,t.height,t.radius,a,s,o,{tiltDeg:t.tiltDeg,bands:t.bands,pitchGain:t.pitchGain,maxTiltDeg:t.maxTiltDeg});t.broken=1,t.cutU=r.u,t.theta=r.theta,t.nx=r.nx,t.ny=r.ny,t.nz=r.nz,t.ax=r.ax,t.ay=r.ay,t.az=r.az,t.fall=0,t.brokenAt=n.time,n.events.push({type:"break",tick:n.tick,x:t.x,y:t.y+r.u*t.height,z:t.z,value:e})}function uv(n,t,e,i,a,s){const o=n.destructibles;if(!o)return!1;for(let r=0;r<o.length;r++){const c=o[r];if(!(c.id!==t||c.broken!==0))return qp(n,c,r,e,i,a,s),!0}return!1}function fv(n,t,e){const i=n.destructibles;if(!i||i.length===0||!n.modules.destructibles)return;const a=e.breakHits??[],s=a.length>0?wp(n):null;if(!!s&&(s.active||s.slamRadius>0)&&s)for(let r=0;r<a.length;r++){const c=a[r];let l=-1;for(let u=0;u<i.length;u++)if(i[u].id===c.id){l=u;break}if(l<0)continue;const d=i[l];d.broken===0&&qp(n,d,l,c.y,c.dx,c.dy,c.dz)}for(let r=0;r<i.length;r++){const c=i[r];if(c.broken===0)continue;const l=1-Math.exp(-t*3/Math.max(.1,c.fallSec));c.fall+=(cv-c.fall)*l}}function Kp(n){const t=n.destructibles;if(t)for(let e=0;e<t.length;e++){const i=t[e];i.broken=0,i.cutU=1,i.theta=0,i.nx=0,i.ny=1,i.nz=0,i.ax=0,i.ay=0,i.az=-1,i.fall=0,i.brokenAt=0}}function pv(){return{active:!1,mainId:0,mainYaw:0,mainPitch:0,centroidYaw:0,threatCount:0,threat:0}}function mv(n,t){const e=Gg(t);return{tick:0,time:0,rngState:2654435769,config:n,boxes:e,gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:Op(1),playerLink:gc(),arrows:[],arrowSeq:0,abilities:Og(),skills:Ug(n),impulse:{x:0,z:0},targeting:Wx(),turnInPlace:Mg(),playerHurt:bp(),hitCount:0,dash:{...zx(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{...Lp(),centroidX:n.spawn.x,centroidZ:n.spawn.z},gaze:pv(),dummies:yx(n.dummies),dummyAttackCount:0,grass:av(n,t,e,t.grid),destructibles:hv(t.destructibles),events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,turnInPlace:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,gaze:!0,dummies:!0,grass:!0,destructibles:!0}}}function gv(n){Nx(n),Vp(n),Fp(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.lastAt=Vd,e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,Dp(n),zp(n),Wp(n),kp(n),Kr(n);const i=n.gaze;i.active=!1,i.mainId=0,i.mainYaw=0,i.mainPitch=0,i.centroidYaw=0,i.threatCount=0,i.threat=0,rv(n),Kp(n),n.events.length=0}function vu(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){gv(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?$x(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),ix(n,t,e),n.modules.combat&&fx(n,t,e),n.modules.dash&&Ux(n,t,e),n.modules.movement&&Bx(n,t,e),n.modules.gaze&&Zx(n,t,e),n.modules.orientation&&wg(n,t,e),Sg(n,t,e),n.modules.dummies&&Cx(n,t,e),ug(n,t),Qg(n,t),n.modules.abilities&&Bg(n,t,e),n.modules.combat&&qg(n,t),n.modules.dummies&&(yg(n,t),n.modules.separation&&(Hx(n),Xx(n))),ov(n,t),fv(n,t,e),n.modules.camera?Hg(n):kp(n),n}const Jp=["bodyYaw","bodyPitch","bodyRoll","pelvisX","pelvisZ","armPitch","armYaw","armRoll","elbow","bladePitch","armLPitch","armLYaw","armLRoll","elbowL","rootYaw","bladePitchOff","bladeTwist","bladeTwistOff","bladeYaw","bladeYawOff"],yu=1e-9;function xv(n,t,e){return n<t?t:n>e?e:n}function Qp(n){return xv(Number.isFinite(n)?n:0,0,1)}function tm(n,t){const e=Qp(t);return n==="in"?e*e:n==="out"?1-(1-e)*(1-e):n==="inOut"?e*e*(3-2*e):e}function vv(){const n={};for(const t of Jp)n[t]=0;return n}function yv(n,t){const e=vv(),i=(n==null?void 0:n.keys)??[];if(i.length===0)return e;const a=Qp(t);let s=0;for(;s<i.length-1&&a>i[s+1].t+yu;)s+=1;const o=i[s],r=i[Math.min(s+1,i.length-1)],c=r.t-o.t,l=c>yu?(a-o.t)/c:0,d=tm(o.ease??"linear",l);for(const u of Jp){const h=o.pose[u]??r.pose[u]??0,f=r.pose[u]??o.pose[u]??0;e[u]=h+(f-h)*d}return e}function Mv(n,t){const e=n==null?void 0:n.spin;if(!e||!Number.isFinite(e.turns)||e.turns===0)return 0;const i=e.ease??"linear",a=Number.isFinite(e.span)&&e.span>0?Math.min(1,e.span):1,s=tm(i,t/a);return e.turns*Math.PI*2*s}function Ra(n,t){return((n==null?void 0:n.keys)??[]).some(e=>typeof e.pose[t]=="number")}function _v(n){let t=0;return{frame(e,i,a,s,o){if(s||a<=0)return t=0,0;t+=Math.min(e,.1)*a;const r=n.config.fixedDt,c=n.config.maxStepsPerFrame;let l=0;for(;t>=r&&l<c;){const d=l===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};vu(n,r,d),o&&o(),t-=r,l++}return l>=c&&(t=0),l},singleStep(e){vu(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t},get alpha(){const e=n.config.fixedDt;return e>0?Math.max(0,Math.min(1,t/e)):1}}}function Xi(n,t,e){let i=t-n;for(;i>Math.PI;)i-=Math.PI*2;for(;i<-Math.PI;)i+=Math.PI*2;return n+i*e}function Ue(n,t,e){return n+(t-n)*e}function bv(n){const t=n.combat,e=n.dummies;let i=`${t.weapon}|${t.phase}|${t.comboIndex}|${t.attackId}|${n.character.grounded?1:0}|${n.character.sprinting?1:0}|${n.playerHurt.type}|${t.hitstop>0?1:0}|d:${n.dash.phase}:${n.dash.kind}|t:${n.turnInPlace.phase}|l:${n.playerLink.phase}:${n.playerLink.kind}`;for(let a=0;a<e.length;a++){const s=e[a];i+=`|${s.id}:${s.mode}:${s.attackPhase}:${s.attackId}:${s.hurt.type}`}return i}function Mu(n){const t=n.character,e=n.combat,i=n.playerHurt;return{time:n.time,key:bv(n),ch:{x:t.position.x,y:t.position.y,z:t.position.z,facing:t.facing,moveYaw:t.moveYaw,bodyYaw:t.bodyYaw,headYaw:t.headYaw,headPitch:t.headPitch,bodyPitch:t.bodyPitch,gaitPhase:t.gaitPhase,stride:t.stride,vx:t.velocity.x,vy:t.velocity.y,vz:t.velocity.z},cb:{attackProgress:e.attackProgress,phaseTimer:e.phaseTimer,charge:e.charge,hitstop:e.hitstop},dash:{timer:n.dash.timer},turn:{progress:n.turnInPlace.progress},link:{progress:n.playerLink.progress},hurt:{timer:i.timer,duration:i.duration,knockX:i.knockX,knockZ:i.knockZ},dm:n.dummies.map(a=>({x:a.position.x,y:a.position.y,z:a.position.z,facing:a.facing,bodyYaw:a.bodyYaw,headYaw:a.headYaw,gaitPhase:a.gaitPhase,stride:a.stride,attackProgress:a.attackProgress,vx:a.velocity.x,vy:a.velocity.y,vz:a.velocity.z}))}}function Sv(n,t){return n.key===t.key&&n.dm.length===t.dm.length}function wv(n,t,e){const i=Math.max(0,Math.min(1,e)),a={position:{x:Ue(n.ch.x,t.ch.x,i),y:Ue(n.ch.y,t.ch.y,i),z:Ue(n.ch.z,t.ch.z,i)},facing:Xi(n.ch.facing,t.ch.facing,i),moveYaw:Xi(n.ch.moveYaw,t.ch.moveYaw,i),bodyYaw:Xi(n.ch.bodyYaw,t.ch.bodyYaw,i),headYaw:Xi(n.ch.headYaw,t.ch.headYaw,i),headPitch:Ue(n.ch.headPitch,t.ch.headPitch,i),bodyPitch:Ue(n.ch.bodyPitch,t.ch.bodyPitch,i),gaitPhase:Xi(n.ch.gaitPhase,t.ch.gaitPhase,i),stride:Ue(n.ch.stride,t.ch.stride,i),velocity:{x:Ue(n.ch.vx,t.ch.vx,i),y:Ue(n.ch.vy,t.ch.vy,i),z:Ue(n.ch.vz,t.ch.vz,i)}},s={attackProgress:Ue(n.cb.attackProgress,t.cb.attackProgress,i),phaseTimer:Ue(n.cb.phaseTimer,t.cb.phaseTimer,i),charge:Ue(n.cb.charge,t.cb.charge,i),hitstop:i<1?Math.max(0,Ue(n.cb.hitstop,t.cb.hitstop,i)):t.cb.hitstop},o={timer:Ue(n.hurt.timer,t.hurt.timer,i),knockX:Ue(n.hurt.knockX,t.hurt.knockX,i),knockZ:Ue(n.hurt.knockZ,t.hurt.knockZ,i)},r=t.dm.map((c,l)=>{const d=n.dm[l];return d?{position:{x:Ue(d.x,c.x,i),y:Ue(d.y,c.y,i),z:Ue(d.z,c.z,i)},facing:Xi(d.facing,c.facing,i),bodyYaw:Xi(d.bodyYaw,c.bodyYaw,i),headYaw:Xi(d.headYaw,c.headYaw,i),gaitPhase:Xi(d.gaitPhase,c.gaitPhase,i),stride:Ue(d.stride,c.stride,i),attackProgress:Ue(d.attackProgress,c.attackProgress,i),velocity:{x:Ue(d.vx,c.vx,i),y:Ue(d.vy,c.vy,i),z:Ue(d.vz,c.vz,i)}}:null});return{time:Ue(n.time,t.time,i),character:a,combat:s,playerHurt:o,dash:{timer:Ue(n.dash.timer,t.dash.timer,i)},turn:{progress:Ue(n.turn.progress,t.turn.progress,i)},link:{progress:Ue(n.link.progress,t.link.progress,i)},dummies:r}}function Ev(n,t){const e=n.dummies.map((i,a)=>{const s=t.dummies[a];return s?{...i,...s}:i});return{...n,time:t.time,character:{...n.character,...t.character},combat:{...n.combat,...t.combat},playerHurt:{...n.playerHurt,...t.playerHurt},dash:{...n.dash,timer:t.dash.timer},turnInPlace:{...n.turnInPlace,progress:t.turn.progress},playerLink:{...n.playerLink,progress:t.link.progress},dummies:e}}const em={slopPx:12,longPressMs:450,doubleTapMs:280};function Tv(n,t,e=em.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,a=n.dy/n.distance,s=t.rightX*i+t.forwardX*-a,o=t.rightZ*i+t.forwardZ*-a,r=Math.hypot(s,o);return r<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:s/r,worldZ:o/r}}function Pa(n,t,e,i,a,s){const o=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:o,angleDeg:o>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:a,taps:s,worldX:0,worldZ:0}}function Av(n=em){const t=new Map,e=new Map,i=a=>t.get(a);return{begin(a,s,o,r,c){if(t.has(s))return null;for(const l of t.values())if(l.button===a)return null;return t.set(s,{button:a,pointerId:s,startX:o,startY:r,x:o,y:r,startedAt:c,dragging:!1,longFired:!1}),Pa(a,"press",0,0,0,1)},move(a,s,o,r){const c=i(a);if(!c)return null;c.x=s,c.y=o;const l=s-c.startX,d=o-c.startY;return!c.dragging&&Math.hypot(l,d)>=n.slopPx?(c.dragging=!0,Pa(c.button,"drag",l,d,r-c.startedAt,1)):null},end(a,s,o,r){const c=i(a);if(!c)return null;t.delete(a),c.x=s,c.y=o;const l=s-c.startX,d=o-c.startY,u=r-c.startedAt,h=Math.hypot(l,d);if(c.dragging||c.longFired||h>=n.slopPx)return Pa(c.button,"release",l,d,u,1);const f=e.get(c.button);return f!==void 0&&r-f.at<=n.doubleTapMs&&Math.hypot(s-f.x,o-f.y)<=n.slopPx*2?(e.delete(c.button),Pa(c.button,"doubleTap",l,d,u,2)):(e.set(c.button,{at:r,x:s,y:o}),Pa(c.button,"tap",l,d,u,1))},cancel(a,s){const o=i(a);return o?(t.delete(a),Pa(o.button,"cancel",o.x-o.startX,o.y-o.startY,s-o.startedAt,1)):null},poll(a){for(const s of t.values())if(!(s.longFired||s.dragging)&&a-s.startedAt>=n.longPressMs)return s.longFired=!0,Pa(s.button,"longPress",s.x-s.startX,s.y-s.startY,a-s.startedAt,1);return null},isHeld(a){for(const s of t.values())if(s.button===a)return!0;return!1},reset(){t.clear(),e.clear()}}}const Hc=.001,Rv=18;function $l(n,t,e){return n<t?t:n>e?e:n}function Zl(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function Pv(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function Cv(n,t,e,i,a=Rv){const s=Pv(t);if(!s)return{state:Zl(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const o=Math.hypot(s[1].x-s[0].x,s[1].y-s[0].y),r=a,c=Math.max(1.0001,Number.isFinite(i)?i:1.25),l=1/c,d=c;if(!Number.isFinite(o)||o<Hc)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const m=r<=0;return{state:{active:!0,lastDist:o,armDist:o,armed:m},scale:1,started:!0,ended:!1,armedNow:!1,pinching:m}}if(!n.armed)return n.armDist<Hc?{state:{active:!0,lastDist:o,armDist:o,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(o-n.armDist)<r?{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<Hc)return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const u=o/n.lastDist,h=Math.max(0,Number.isFinite(e)?e:1),f=Number.isFinite(u)&&u>0?Math.pow(u,h):1;return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:$l(Number.isFinite(f)?f:1,l,d),started:!1,ended:!1,armedNow:!1,pinching:!0}}function _u(n,t,e,i){const a=Math.min(e,i),s=Math.max(e,i),o=Number.isFinite(t)&&t>0?t:1,r=n*o;return Number.isFinite(r)?$l(r,a,s):$l(n,a,s)}function Dv(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function Lv(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const Gc=["jump","sprint","reset","attack","skill2"],kv=8,Iv=16,Xc=10,bu=14,Su=140,zv=18,Fv=16,Uv=400,Nv=1.0001;function Or(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function Ov(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&Or(e)}function Bv(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:a}=n,s=()=>Math.max(8,t());let o=null,r=0,c=0,l=0,d=0,u=0,h=0,f=-1,m=0,v=null,g=-1,p=0,_=0,x=0,y=0,S=!1,w=0,T=1,R=0,b=null,M=0,C=0,k=!1,D=null,F=null,A=0,E=0,z=0,G=0,X=!1,et=!0,ht=-1;const gt=Av({slopPx:bu,longPressMs:450,doubleTapMs:350});let Lt=[],Z=null;const B=new Set;function Y(tt){tt&&Lt.push(tt)}const q=new Map;let K=Zl(),st=!1,Tt=1;function Gt(){const tt=Array.from(q.values()),j=a(),pt=Cv(K,tt,j.pinchGain,j.maxStepRatio,zv);if(K=pt.state,st=pt.pinching,pt.scale!==1&&(Tt*=pt.scale),pt.started||pt.armedNow)b=null,k=!0,D=null;else if(pt.ended&&o===null&&tt.length===1){const Ht=tt[0];o=Ht.id,r=Ht.x,c=Ht.y,l=0,d=0,u=Ht.x,h=Ht.y,S=!1,w=0,T=1,R=0,performance.now(),b=null,k=!0,D=null}}const J={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},V={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let O=0,Pt=0;const Et={},lt=new Set,vt=[];function ft(){for(const tt of Gc)Et[tt]!==void 0&&(Et[tt]=void 0),Q(tt);gt.reset(),B.clear(),q.clear(),K=Zl(),st=!1,o=null,l=0,d=0,u=0,h=0,S=!1,w=0,T=1,R=0,p=0,_=0,x=0,y=0,v=null,g=-1,b=null,k=!1,D=null,F=null,ht=-1,z=0,G=0,X=!1,et=!0}const Rt=()=>{document.hidden&&ft()},L=tt=>{if(tt.clientX===0&&tt.clientY===0){m++;return}if(Or(tt.target)||Ov(tt.clientX,tt.clientY)){B.add(tt.pointerId);return}if(B.delete(tt.pointerId),q.set(tt.pointerId,{id:tt.pointerId,x:tt.clientX,y:tt.clientY}),o===null&&!st){v=null,g=-1,o=tt.pointerId,r=tt.clientX,c=tt.clientY,l=0,d=0,u=tt.clientX,h=tt.clientY,performance.now();const j=Number.isFinite(tt.screenX)&&Number.isFinite(tt.screenY)&&(tt.screenX!==0||tt.screenY!==0);S=j,w=0,T=1,R=0,p=j?tt.screenX:0,_=j?tt.screenY:0,x=p,y=_,b=tt.pointerId,M=tt.clientX,C=tt.clientY,k=!1}Gt()},P=tt=>{if(tt.pointerId===F&&(tt.pointerType==="mouse"&&tt.buttons===0||tt.clientX===0&&tt.clientY===0&&(A!==0||E!==0)||(et?(z=tt.clientX-A,G=tt.clientY-E):(A=tt.clientX,E=tt.clientY,et=!0,z=0,G=0))),Y(gt.move(tt.pointerId,tt.clientX,tt.clientY,performance.now())),!B.has(tt.pointerId)&&q.has(tt.pointerId)&&(q.set(tt.pointerId,{id:tt.pointerId,x:tt.clientX,y:tt.clientY}),Gt()),B.has(tt.pointerId)||tt.pointerId!==o)return;const j=performance.now();if(v===tt.pointerId&&j-g<150){m++;return}const pt=tt.clientX,Ht=tt.clientY;if(pt===0&&Ht===0&&(r!==0||c!==0)){m++;return}const It=pt-u,U=Ht-h,bt=Number.isFinite(tt.screenX)&&Number.isFinite(tt.screenY),$=bt?tt.screenX:0,ut=bt?tt.screenY:0,Ft=bt&&($!==0||ut!==0),Dt=$-x,qt=ut-y;if(S&&Ft){const Re=Math.hypot(Dt,qt),Pe=Math.hypot(It,U);if(Re>3){if(w=0,R<30&&Pe>6&&Dt*It+qt*U>.7*Re*Pe){const un=Re/Pe;un>.2&&un<5&&(T+=(un-T)*.3,R++)}}else Pe>12&&(w++,w>=2&&(S=!1))}const le=Math.hypot(It,U);if(!S){const Re=f<0?Number.POSITIVE_INFINITY:j-f,Pe=Ft?Math.hypot(Dt,qt):1/0;le>28&&(Re<200||Pe<le*.4)&&(r+=It,c+=U,m++)}u=pt,h=Ht,x=$,y=ut,tt.pointerId===b&&Math.hypot(tt.clientX-M,tt.clientY-C)>kv&&(k=!0);let de,ee;S&&Ft?(de=($-p)/T,ee=(ut-_)/T):(de=pt-r,ee=Ht-c);const we=Math.hypot(de,ee),De=s();we>De&&(de*=De/we,ee*=De/we);const Ve=Math.hypot(l,d),vn=Math.hypot(de,ee);if(Ve>10&&vn>10){const Re=Math.abs(Math.atan2(l*ee-d*de,l*de+d*ee)),Pe=Math.max(Ve,vn)*Re,un=Math.max(Math.hypot(It,U),Math.hypot(Dt,qt)/Math.max(.2,T));if(Re>.6&&un<Math.max(6,Pe*.5)){m++;return}}l=de,d=ee};function Q(tt){if(!J[tt])return;J[tt]=!1,tt==="attack"&&(V.attackReleased=!0);const j=document.getElementById(`btn-${tt}`);j==null||j.classList.remove("is-down")}function mt(){o!==null&&(v=o,g=performance.now(),o=null,l=0,d=0,u=0,h=0,S=!1,w=0,T=1,R=0,p=0,_=0,x=0,y=0)}const ot=tt=>{const j=q.delete(tt.pointerId),pt=B.delete(tt.pointerId);j&&Gt(),tt.pointerId===F&&(F=null,X?ht=performance.now():(z=0,G=0,ht=-1)),Y(gt.end(tt.pointerId,tt.clientX,tt.clientY,performance.now()));for(const Nt of Gc)Et[Nt]===tt.pointerId&&(Et[Nt]=void 0,Q(Nt));const Ht=!j&&!pt&&q.size<=1&&o!==null;(tt.pointerId===o||q.size===0||Ht)&&mt(),!pt&&tt.pointerId===b&&(!k&&!Or(tt.target)&&(D={x:tt.clientX,y:tt.clientY}),b=null)};for(const tt of Gc){const j=document.getElementById(`btn-${tt}`);if(!j)continue;const pt=tt==="attack"||tt==="skill2",Ht=U=>{if(U.preventDefault(),Et[tt]===void 0){Et[tt]=U.pointerId,J[tt]=!0,tt==="jump"&&(V.jump=!0),tt==="reset"&&(V.reset=!0),tt==="sprint"&&(V.sprintPressed=!0),tt==="attack"&&(V.attackPressed=!0),tt==="skill2"&&(V.skill2=!0),j.classList.add("is-down"),Y(gt.begin(tt,U.pointerId,U.clientX,U.clientY,performance.now()));try{j.setPointerCapture(U.pointerId)}catch{}pt&&(F=U.pointerId,A=U.clientX,E=U.clientY,et=!(U.clientX===0&&U.clientY===0),z=0,G=0,X=!1,ht=-1)}},Nt=U=>{Et[tt]===U.pointerId&&(Et[tt]=void 0,Q(tt),Y(gt.end(U.pointerId,U.clientX,U.clientY,performance.now())))},It=U=>{Et[tt]===U.pointerId&&(Et[tt]=void 0,Q(tt),Y(gt.cancel(U.pointerId,performance.now())))};j.addEventListener("pointerdown",Ht),j.addEventListener("pointerup",Nt),j.addEventListener("pointercancel",It),vt.push(()=>{j.removeEventListener("pointerdown",Ht),j.removeEventListener("pointerup",Nt),j.removeEventListener("pointercancel",It)})}const dt=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const tt of dt){const j=pt=>{pt.preventDefault(),O=Number(tt.dataset.weapon)||0};tt.addEventListener("pointerdown",j),vt.push(()=>tt.removeEventListener("pointerdown",j))}const zt=tt=>{const j=tt.key.toLowerCase();if((j===" "||j.startsWith("arrow"))&&tt.preventDefault(),lt.has(j))return;lt.add(j),j===" "&&(V.jump=!0),j==="r"&&(V.reset=!0),j==="shift"&&(V.sprintPressed=!0),j==="j"&&(V.attackPressed=!0),j==="k"&&(V.skill2=!0),j>="1"&&j<="5"&&(O=Number(j)),j>="6"&&j<="9"&&(Pt=Number(j)-5);const pt=Math.max(Nv,a().keyStep||1.12);(j==="="||j==="+")&&(Tt*=pt),(j==="-"||j==="_")&&(Tt/=pt)},Ct=tt=>{const j=tt.key.toLowerCase();lt.has(j)&&(lt.delete(j),j==="j"&&(V.attackReleased=!0))},St=tt=>{if(Or(tt.target))return;tt.preventDefault();const j=tt.deltaMode===1?tt.deltaY*Fv:tt.deltaMode===2?tt.deltaY*Uv:tt.deltaY;Tt*=Dv(j,a().wheelStep)},Yt=tt=>{tt.preventDefault()},xt=()=>{f=performance.now()};window.addEventListener("resize",xt),window.addEventListener("orientationchange",xt);const Ut=typeof window<"u"?window.visualViewport:null;return Ut&&(Ut.addEventListener("resize",xt),Ut.addEventListener("scroll",xt)),window.addEventListener("pointerdown",L),window.addEventListener("pointermove",P),window.addEventListener("pointerup",ot),window.addEventListener("pointercancel",ot),window.addEventListener("blur",ft),document.addEventListener("visibilitychange",Rt),window.addEventListener("keydown",zt),window.addEventListener("keyup",Ct),window.addEventListener("wheel",St,{passive:!1}),window.addEventListener("gesturestart",Yt),{peekStick(){return{id:o,held:o!==null,originX:r,originY:c,x:u,y:h,dx:u-r,dy:h-c,radius:s(),badMoves:m,screenOk:S,originSX:p,originSY:_,screenX:x,screenY:y,scale:T}},peekAim(){const tt=performance.now(),j=Math.hypot(z,G),pt=F!==null||ht>=0&&tt-ht<Su;if(!(pt&&X&&j>=Xc))return{active:!1,holding:pt,x:0,z:0,dx:z,dy:G};const Nt=i(),It=z/j,U=G/j,bt=Nt.rightX*It+Nt.forwardX*-U,$=Nt.rightZ*It+Nt.forwardZ*-U,ut=Math.hypot(bt,$)||1;return{active:!0,holding:pt,x:bt/ut,z:$/ut,dx:z,dy:G}},sample(){var Rn;const tt=s();let j=o!==null?Math.max(-1,Math.min(1,l/tt)):0,pt=o!==null?Math.max(-1,Math.min(1,d/tt)):0,Ht=0,Nt=0;(lt.has("a")||lt.has("arrowleft"))&&(Ht-=1),(lt.has("d")||lt.has("arrowright"))&&(Ht+=1),(lt.has("w")||lt.has("arrowup"))&&(Nt-=1),(lt.has("s")||lt.has("arrowdown"))&&(Nt+=1),j+=Ht,pt+=Nt;let It=Math.hypot(j,pt);It>1&&(j/=It,pt/=It,It=1);const U=j,bt=pt;It<e&&(j=0,pt=0);const $=i();let ut=$.rightX*j+$.forwardX*-pt,Ft=$.rightZ*j+$.forwardZ*-pt;const Dt=Math.hypot(ut,Ft);Dt>1&&(ut/=Dt,Ft/=Dt);const qt=performance.now();Y(gt.poll(qt));const le=Math.hypot(z,G);F!==null&&(le>=Iv?X=!0:le<Xc&&(X=!1));const de=F!==null||ht>=0&&qt-ht<Su,ee=de&&X&&le>=Xc;let we=0,De=0;if(ee){const nn=z/le,En=G/le,Tn=$.rightX*nn+$.forwardX*-En,Xn=$.rightZ*nn+$.forwardZ*-En,Vn=Math.hypot(Tn,Xn)||1;we=Tn/Vn,De=Xn/Vn}!de&&F===null&&(z=0,G=0,ht=-1,X=!1);const Ve=D;D=null;const vn=Tt;Tt=1;const Re={moveX:ut,moveZ:Ft,jumpPressed:V.jump,sprintHeld:J.sprint||lt.has("shift"),sprintPressed:V.sprintPressed,resetPressed:V.reset,attackPressed:V.attackPressed,attackHeld:J.attack||lt.has("j"),attackReleased:V.attackReleased,skill2Pressed:V.skill2,weaponSlot:O,dummyClickId:Pt,aimX:we,aimZ:De,aimActive:ee};V.jump=!1,V.reset=!1,V.sprintPressed=!1,V.attackPressed=!1,V.attackReleased=!1,V.skill2=!1,O=0,Pt=0;const Pe=Lt.map(nn=>Tv(nn,$,bu));Lt=[],Pe.length>0&&(Z=Pe[Pe.length-1]);const un=o!==null?"pointer":lt.size>0?"keyboard":"idle";return{intents:Re,stickX:j,stickY:pt,stickRawX:U,stickRawY:bt,stickHeld:o!==null,stickId:o,stickOriginX:r,stickOriginY:c,stickPxX:u,stickPxY:h,stickBad:m,stickScreenOk:S,stickOriginSX:p,stickOriginSY:_,stickScreenX:x,stickScreenY:y,stickScale:T,stickVpTop:((Rn=Lv())==null?void 0:Rn.top)??0,stickVpAge:f<0?-1:Math.round(performance.now()-f),aimDX:z,aimDY:G,source:un,tap:Ve,zoomScale:vn,gestures:Pe,lastGesture:Z}},dispose(){window.removeEventListener("pointerdown",L),window.removeEventListener("pointermove",P),window.removeEventListener("pointerup",ot),window.removeEventListener("pointercancel",ot),window.removeEventListener("blur",ft),document.removeEventListener("visibilitychange",Rt),window.removeEventListener("keydown",zt),window.removeEventListener("keyup",Ct),window.removeEventListener("wheel",St),window.removeEventListener("resize",xt),window.removeEventListener("orientationchange",xt),Ut&&(Ut.removeEventListener("resize",xt),Ut.removeEventListener("scroll",xt)),window.removeEventListener("gesturestart",Yt),gt.reset();for(const tt of vt)tt()}}}const ec=1,nc=2,ic=4,nm=8,ac=16,Ao=32,im=64,am=128,Hv=[[ec,"atk"],[nc,"dash"],[ic,"link"],[nm,"air"],[ac,"hurt"],[Ao,"aim"],[im,"spr"],[am,"chan"]];function ds(n){if(n===0)return"-";const t=Hv.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const Gv=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],Xv=0,Vv=15,Vc=19,Wv=21,Yv=22,$v=23,Zv=24,Ci={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},$n=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,vi=n=>Math.round(n*180/Math.PI*10)/10,Wc=Math.PI*2;function co(n){let t=n%Wc;return t>Math.PI&&(t-=Wc),t<-Math.PI&&(t+=Wc),t}function jv(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=ec),n.dash.phase!=="idle"&&(e|=nc),n.playerLink.phase!=="idle"&&(e|=ic),n.character.grounded||(e|=nm),n.playerHurt.type!=="none"&&(e|=ac),t.intents.aimActive&&(e|=Ao),n.character.sprinting&&(e|=im),n.abilities.channeling&&(e|=am),e}function qv(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function Kv(n){const t={sampleHz:n.sampleHz??Ci.sampleHz,sampleCapacity:n.sampleCapacity??Ci.sampleCapacity,eventCapacity:n.eventCapacity??Ci.eventCapacity,anomalyCapacity:n.anomalyCapacity??Ci.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??Ci.dirJumpDeg,aimDropDeg:n.aimDropDeg??Ci.aimDropDeg,freezeMs:n.freezeMs??Ci.freezeMs,freezeSpeed:n.freezeSpeed??Ci.freezeSpeed,stickLostMs:n.stickLostMs??Ci.stickLostMs,spikeMs:n.spikeMs??Ci.spikeMs},e=n.meta,i=[],a=[],s=[],o={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let r=!0,c=-1,l=-1e9,d=null,u=0,h=0,f="",m=-1,v=-1,g=-1,p=0,_=-1e9,x=-1,y={},S=null,w=0,T=0,R=0,b=0;function M(A,E){const z=1/t.sampleHz,G=A[Xv];G-l<z-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(A),l=G)}function C(A,E,z,G,X,et){const ht=y[A]??-1e9;if(E-ht<1.2)return;if(y[A]=E,A==="frameSpike"){let Lt=0;for(const Z of s)Z.kind==="frameSpike"&&Lt++;if(Lt>=6)return}s.length>=t.anomalyCapacity&&s.shift();let gt=i.slice(-7);et&&(gt.length===0||gt[gt.length-1]!==et)&&(gt=[...gt.slice(-6),et]),s.push({kind:A,t:$n(E),tick:z,ms:Math.round(G),detail:X,ctx:gt}),A==="dirJump"?o.dirJumps++:A==="aimDrop"?o.aimDrops++:A==="moveFreeze"?o.freezes++:A==="stickLost"?o.stickLosts++:A==="stickJump"?o.stickJumps++:A==="stickBad"?o.stickBads++:A==="stickDrift"&&o.stickDrifts++}function k(A,E,z,G){a.length>=t.eventCapacity&&a.shift(),a.push({t:$n(z),tick:G,k:A,d:E})}function D(A){switch(A.type){case"attack-start":o.attacks++;break;case"hit":o.hits++;break;case"player-hurt":o.hurts++;break;case"link-start":o.links++;break;case"link-hit":o.linkHits++;break;case"roll":o.rolls++;break;case"blink":o.blinks++;break;case"channel-start":o.channels++;break;case"projectile-fire":o.bolts++;break;case"ring-place":o.rings++;break;case"charge-start":o.bowCharges++;break;case"jumped":o.jumps++;break;case"reset":o.resets++;break;case"blocked":_=A.tick;break}}function F(){const A=o,E=A.wallMs/1e3,z=A.gestures,G=gt=>Object.entries(z).filter(([Lt])=>Lt.endsWith(`.${gt}`)).reduce((Lt,[,Z])=>Lt+Z,0),X=[];if(X.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),X.push(`运行 ${E.toFixed(1)}s / ${A.frames} 帧 · ${A.fps.toFixed(1)}fps · 最大 ${A.dtMax.toFixed(0)}ms · 尖峰 ${A.spikes} · 步 ${A.steps}`),X.push(`摇杆活跃 ${E>0?Math.round(A.stickActiveMs/1e3/E*100):0}% · 手势 按下 ${G("press")}（单击 ${G("tap")} / 双击 ${G("doubleTap")} / 拖拽 ${G("drag")} / 长按 ${G("longPress")} / 打断 ${G("cancel")} / 拖放 ${G("release")}）`),X.push(`攻击 ${A.attacks}(中${A.hits}) · 受击 ${A.hurts} · 派生 ${A.links}(中${A.linkHits}) · 翻滚 ${A.rolls} 闪现 ${A.blinks} · 跳 ${A.jumps} · 复位 ${A.resets}`),X.push(`法杖 引导${A.channels} 飞弹${A.bolts} 电环${A.rings} · 弓蓄力${A.bowCharges} · 当前武器 ${f||"-"}`),X.push(`异常 ${A.dirJumps+A.aimDrops+A.freezes+A.stickLosts+A.stickJumps+A.stickBads+A.stickDrifts}（dir ${A.dirJumps} / aim ${A.aimDrops} / freeze ${A.freezes} / stick ${A.stickLosts} / stickJump ${A.stickJumps} / 坏指针 ${A.stickBads} / 坐标漂移 ${A.stickDrifts}） · 掉帧尖峰 ${A.spikes}`+(A.inTurns>0?` · 输入转向 ${A.inTurns} 次（最大 ${A.inTurnMax.toFixed(0)}°）`:"")),s.length>0)for(const gt of s.slice(-6)){X.push(`· ${gt.kind} @t${gt.t.toFixed(2)} tick${gt.tick} ${gt.ms>0?`${gt.ms}ms `:""}${gt.detail}`);const Lt=gt.ctx.map(B=>String(B[Vv])).join(" "),Z=gt.ctx.map(B=>B[Vc]===""||B[Vc]==null?".":String(B[Vc])).join(" ");if(X.push(`  yaw ${Lt}`),X.push(`  in  ${Z}`),gt.kind==="stickJump"||gt.kind==="stickBad"||gt.kind==="stickLost"){const B=gt.ctx.map(q=>`${q[Wv]},${q[Yv]}`).join(" "),Y=gt.ctx.map(q=>`${q[$v]},${q[Zv]}`).join(" ");X.push(`  o   ${B}`),X.push(`  p   ${Y}`)}}if(a.length>0){X.push("最近事件：");for(const gt of a.slice(-12))X.push(`  ${gt.t.toFixed(2)} ${gt.k} ${gt.d}`.trimEnd())}const et=o.screenFrames>0?`屏幕 screenX/Y（${o.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",ht=o.screenFrames>0&&o.clientFrames>0?` / client 回退 ${o.clientFrames} 帧`:"";return X.push(`摇杆坐标源 ${et}${ht}`),X.push(`UA ${e.ua}`),X.join(`
`)}return{sample(A,E,z,G=0){o.frames++,E.stickHeld&&(E.stickScreenOk?o.screenFrames++:o.clientFrames++),o.steps+=G,o.wallMs+=z,z>o.dtMax&&(o.dtMax=z),o.fps=o.wallMs>0?o.frames*1e3/o.wallMs:0,o.simS=A.time;const X=A.time;if(c<0&&(c=X),R=X,b=A.tick,!r)return;const et=A.character,ht=Math.hypot(E.stickX,E.stickY),gt=Math.hypot(et.velocity.x,et.velocity.z);f=A.combat.weapon;const Lt=jv(A,E),Z=et.facing,Y=Math.hypot(E.intents.moveX,E.intents.moveZ)>.05?Math.atan2(E.intents.moveX,E.intents.moveZ):null;ht>.2&&(o.stickActiveMs+=z);const q=[$n(X),A.tick,Math.round(z*10)/10,$n(E.stickX),$n(E.stickY),$n(E.stickRawX),$n(E.stickRawY),E.stickHeld?1:0,E.source.slice(0,8),$n(E.intents.moveX),$n(E.intents.moveZ),$n(et.position.x),$n(et.position.z),$n(et.velocity.x),$n(et.velocity.z),vi(Z),vi(et.bodyYaw),Lt,$n(et.stride),Y===null?"":vi(Y),E.stickId===null?"":E.stickId,Math.round(E.stickOriginX),Math.round(E.stickOriginY),Math.round(E.stickPxX),Math.round(E.stickPxY),E.stickBad,Math.round(E.stickVpTop),Math.round(E.stickOriginSX),Math.round(E.stickOriginSY),Math.round(E.stickScreenX),Math.round(E.stickScreenY),E.stickScreenOk?1:0,Math.round(E.stickScale*100)/100];M(q);const K=X*1e3<x;if(z>t.spikeMs&&!K&&X-c>.6&&(o.spikes++,C("frameSpike",X,A.tick,z,`dt ${z.toFixed(0)}ms fl=${ds(Lt)}`,q)),d!==null&&!K){const ft=Math.abs(vi(co(Z-d))),Rt=Math.abs(vi(co(et.moveYaw-u))),L=(h|Lt)&(ec|nc|ic|ac)|Lt&Ao,P=Y===null?null:Math.abs(vi(co(Z-Y))),Q=Y===null||d===null?null:Math.abs(vi(co(d-Y))),mt=P!==null&&Q!==null&&P<Q-.5,ot=(h&Ao)!==0&&(Lt&Ao)===0&&Y===null,dt=P!==null&&(P<=12||mt);ft>t.aimDropDeg&&ot?C("aimDrop",X,A.tick,0,`${ft.toFixed(0)}° @aim→none stick(${E.stickX.toFixed(2)},${E.stickY.toFixed(2)}) aim(${E.aimDX.toFixed(0)},${E.aimDY.toFixed(0)}) fl=${ds(Lt)}`,q):ft>t.dirJumpDeg&&L===0&&!ot&&(dt?(o.inTurns++,ft>o.inTurnMax&&(o.inTurnMax=ft)):C("dirJump",X,A.tick,0,`${ft.toFixed(0)}° res${P===null?" 无输入":`${P.toFixed(0)}°`} yaw ${vi(d)}→${vi(Z)} in ${Y===null?".":vi(Y)}° mvΔ${Rt.toFixed(0)}° aim(${E.aimDX.toFixed(0)},${E.aimDY.toFixed(0)}) fl=${ds(h)}→${ds(Lt)}`,q))}const st=(Lt&(ec|nc|ic|ac))!==0,Tt=A.tick-_<30;ht>.35&&gt<t.freezeSpeed&&!st&&!Tt?(m<0&&(m=X),X-m>=t.freezeMs/1e3&&X>=v&&(C("moveFreeze",X,A.tick,(X-m)*1e3,`stick(${E.stickX.toFixed(2)},${E.stickY.toFixed(2)}) v${gt.toFixed(2)} ${E.source} fl=${ds(Lt)}`,q),v=X+1.5,m=-1)):m=-1,E.stickHeld?(ht>p&&(p=ht),p>.35&&ht<.06?(g<0&&(g=X),X-g>=t.stickLostMs/1e3&&(C("stickLost",X,A.tick,(X-g)*1e3,`raw(${E.stickRawX.toFixed(2)},${E.stickRawY.toFixed(2)}) peak ${p.toFixed(2)} fl=${ds(Lt)}`,q),g=-1,p=0)):g=-1):(p=0,g=-1);const Gt=E.stickScale>.2&&E.stickScale<5?E.stickScale:1,J=E.stickScreenOk,V=J?E.stickScreenX/Gt:E.stickPxX,O=J?E.stickScreenY/Gt:E.stickPxY,Pt=J?E.stickOriginSX/Gt:E.stickOriginX,Et=J?E.stickOriginSY/Gt:E.stickOriginY,lt=V-Pt,vt=O-Et;if(E.stickHeld&&E.stickId!==null){const ft=S;if(ft&&ft.held&&ft.id===E.stickId){const Rt=Math.hypot(ft.dx,ft.dy),L=Math.hypot(lt,vt),P=Math.max(Rt,L),Q=Math.hypot(V-ft.cx,O-ft.cy),mt=Math.abs(vi(co(Math.atan2(vt,lt)-Math.atan2(ft.dy,ft.dx)))),ot=P*mt*Math.PI/180,dt=Math.hypot(Pt-ft.ox,Et-ft.oy);if(P>18&&mt>35&&Q<Math.max(5,ot*.35)&&C("stickJump",X,A.tick,0,`Δ${mt.toFixed(0)}° 手指只动${Q.toFixed(0)}px(弧长应${ot.toFixed(0)}px) o(${Math.round(ft.ox)},${Math.round(ft.oy)})→(${Math.round(Pt)},${Math.round(Et)}) 原点位移${dt.toFixed(0)}px p(${Math.round(V)},${Math.round(O)}) raw(${Math.round(lt)},${Math.round(vt)}) id${E.stickId} ${J?"src=屏幕":"src=client"}`,q),J&&ft.screenOk){const zt=Math.hypot(E.stickPxX-ft.x,E.stickPxY-ft.y),Ct=Math.hypot((E.stickScreenX-ft.sx)/Gt,(E.stickScreenY-ft.sy)/Gt);w+=zt-Ct,Math.abs(w)>20&&(C("stickDrift",X,A.tick,0,`client 相对屏幕漂移 ${w>0?"+":""}${w.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(E.stickPxX)},${Math.round(E.stickPxY)}) screen(${Math.round(E.stickScreenX)},${Math.round(E.stickScreenY)})`,q),w=0)}}S={id:E.stickId,ox:Pt,oy:Et,cx:V,cy:O,x:E.stickPxX,y:E.stickPxY,sx:E.stickScreenX,sy:E.stickScreenY,dx:lt,dy:vt,held:!0,screenOk:J}}else S=null,w=0;if(E.stickBad>T){const ft=E.stickBad-T;C("stickBad",X,A.tick,0,`拦截 ${ft} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${E.stickBad}）o(${Math.round(E.stickOriginX)},${Math.round(E.stickOriginY)}) p(${Math.round(E.stickPxX)},${Math.round(E.stickPxY)}) id${E.stickId??"-"}`,q)}T=E.stickBad,d=Z,u=et.moveYaw,h=Lt},event(A,E){const z=qv(A);D(A),r&&(A.type==="dash-ready"||A.type==="combo-reset"||A.type==="stepUp"||k(A.type,z,E,A.tick))},gesture(A){const E=`${A.button}.${A.kind}`;o.gestures[E]=(o.gestures[E]??0)+1,r&&(A.kind==="longPress"||A.kind==="doubleTap"||A.kind==="drag"||A.kind==="cancel")&&k(`g:${A.kind}`,`${A.button} ${A.heldMs.toFixed(0)}ms d${A.distance.toFixed(0)}px ${A.angleDeg.toFixed(0)}°`,R,b)},suspend(A){x=R*1e3+A,m=-1,g=-1},setEnabled(A){r=A,A||(d=null,S=null,m=-1,g=-1)},clear(){i.length=0,a.length=0,s.length=0,y={},l=-1e9,d=null,h=0,m=-1,g=-1,p=0,o.frames=0,o.wallMs=0,o.dtMax=0,o.spikes=0,o.stickActiveMs=0,o.attacks=0,o.hits=0,o.hurts=0,o.links=0,o.linkHits=0,o.rolls=0,o.blinks=0,o.channels=0,o.bolts=0,o.rings=0,o.bowCharges=0,o.jumps=0,o.resets=0,o.dirJumps=0,o.aimDrops=0,o.inTurns=0,o.inTurnMax=0,o.freezes=0,o.stickLosts=0,o.stickJumps=0,o.stickBads=0,o.stickDrifts=0,o.screenFrames=0,o.clientFrames=0,w=0,S=null,T=0;for(const A of Object.keys(o.gestures))delete o.gestures[A]},status(){const A=o.simS,E=s.some(z=>A-z.t<8&&(z.kind==="dirJump"||z.kind==="aimDrop"||z.kind==="moveFreeze"||z.kind==="stickLost"||z.kind==="stickJump"||z.kind==="stickBad"||z.kind==="stickDrift"));return{durationS:o.wallMs/1e3,frames:o.frames,events:a.length,anomalies:s.length,alert:E,enabled:r}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...o,gestures:{...o.gestures}},columns:Gv,samples:i.slice(),events:a.slice(),anomalies:s.slice()}},summary:F}}const Jv="dash",Qv=6,ty="冲刺标尺",ey="沿刻度跑：翻滚 3.2m / 闪现 5m，看落点差多少",ny=[2,4],iy="square",ay=4.8,sy="#bfe8ff",oy="v9s.15 历史固定工位",ry={dx:0,dz:4.6},cy={dx:-2.8,dz:9.2},ly={id:Jv,index:Qv,name:ty,hint:ey,span:ny,shape:iy,radius:ay,color:sy,owner:oy,spawn:ry,label:cy},dy="gait",hy=7,uy="侧后方步态",fy="面向假人贴到 1.2m，沿引线按 90 / 135 / 180 走",py=[2,2],my="circle",gy=3.2,xy="#6fc9a0",vy="v9s.15 历史固定工位",yy={dx:0,dz:2.6},My={dx:0,dz:-2.5},_y=[{dx:0,dz:0,mode:"follow"}],by={id:dy,index:hy,name:uy,hint:fy,span:py,shape:my,radius:gy,color:xy,owner:vy,spawn:yy,label:My,dummies:_y},Sy="hub",wy=1,Ey="中央 8 向",Ty="推杆走 8 个方向 · 松手看停步收相 / 转身踏步",Ay="origin",Ry=[2,2],Py="circle",Cy=3.6,Dy="#8fe7ff",Ly="v9s.15 历史固定工位",ky={dx:0,dz:0},Iy={dx:0,dz:-3.1},zy={minCellX:-4,maxCellX:4,minCellZ:0,maxCellZ:6,density:1,clearMarginCells:2},Fy=[{id:"crate-hub",dx:2.5,dz:-2.5,width:1.1,depth:1.1,height:.8}],Uy=[{dx:-3.4,dz:3.2,fighter:!0,weapon:"sword-shield"},{dx:3.4,dz:3.2,fighter:!0,weapon:"dual-swords"},{dx:0,dz:4.2,fighter:!0,weapon:"greatsword"}],Ny={id:Sy,index:wy,name:Ey,hint:Ty,pin:Ay,span:Ry,shape:Py,radius:Cy,color:Dy,owner:Ly,spawn:ky,label:Iy,grass:zy,obstacles:Fy,dummies:Uy},Oy="meter",By=5,Hy="进度弧",Gy="弓长按 = 黄弧 · 法杖技2 = 紫弧 · 冲刺后 = 青弧冷却",Xy=[2,2],Vy="circle",Wy=3.2,Yy="#b48cff",$y="v9s.15 历史固定工位",Zy={dx:0,dz:2.8},jy={dx:0,dz:1.3},qy=[{id:"pillar-sw",dx:-4,dz:3.6,width:1.2,depth:1.2,height:2.2}],Ky=[{dx:0,dz:-1.4,mode:"idle"}],Jy={id:Oy,index:By,name:Hy,hint:Gy,span:Xy,shape:Vy,radius:Wy,color:Yy,owner:$y,spawn:Zy,label:jy,obstacles:qy,dummies:Ky},Qy="rings",tM=2,eM="环状态色阶",nM="同距三假人：中立蓝 / 戒备黄 / 敌对红 · 点选看 3/4 环",iM=[2,2],aM="circle",sM=3.4,oM="#ffc85a",rM="v9s.15 历史固定工位",cM={dx:0,dz:3},lM={dx:0,dz:-2.7},dM=[{dx:-1.6,dz:-.15,mode:"idle"},{dx:0,dz:-.15,mode:"keep-distance"},{dx:1.6,dz:-.15,mode:"attack"}],hM={id:Qy,index:tM,name:eM,hint:nM,span:iM,shape:aM,radius:sM,color:oM,owner:rM,spawn:cM,label:lM,dummies:dM},uM="sparring-demo",fM="陪练试验场",pM="动态拼合示范地块 · 点「生成 4 人」就地摆出假人 + 持械陪练，用完点「清除」回基线",mM=[2,2],gM=2,xM="#7fd8c0",vM="v9s.43 动态拼合示范（auto 地块，不写世界坐标，由 assemblePlots 自动分配槽位）",yM={minCellX:-9,maxCellX:9,minCellZ:-9,maxCellZ:9,density:.72},MM={label:"生成 4 人",dummies:2,modes:["idle","keep-distance"],fighters:2,ringRadius:1.5,startDeg:-90},_M={id:uM,name:fM,hint:pM,span:mM,radius:gM,color:xM,owner:vM,grass:yM,testSpawn:MM},bM="terrain",SM=4,wM="地形 / 门洞",EM="宽门 2.4m / 窄门 0.5m · 0.2m 台阶可走，0.6/0.9/1.2m 要跳",TM=[2,2],AM="square",RM=4.8,PM="#7fb8d8",CM="v9s.15 历史固定工位",DM={dx:0,dz:4.6},LM={dx:0,dz:-4.2},kM=[{id:"stair-1",dx:-2.3,dz:1.8,width:2.4,depth:.9,height:.2},{id:"stair-2",dx:-2.3,dz:.9,width:2.4,depth:.9,height:.4},{id:"stair-3",dx:-2.3,dz:0,width:2.4,depth:.9,height:.6},{id:"stair-4",dx:-2.3,dz:-.9,width:2.4,depth:.9,height:.8},{id:"plateau",dx:-2.3,dz:-2.2,width:2.4,depth:1.6,height:.8},{id:"block-060",dx:2.5,dz:1.4,width:1.4,depth:1.4,height:.6},{id:"block-090",dx:2.5,dz:-.5,width:1.4,depth:1.4,height:.9},{id:"block-120",dx:2.5,dz:-2.4,width:1.4,depth:1.4,height:1.2}],IM=[{id:"gate-wide",dx:-2.3,dz:3.1,openingWidth:2.4,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2},{id:"gate-narrow",dx:2.5,dz:3.1,openingWidth:.5,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2}],zM={id:bM,index:SM,name:wM,hint:EM,span:TM,shape:AM,radius:RM,color:PM,owner:CM,spawn:DM,label:LM,steps:kM,doorways:IM},FM="windup",UM=3,NM="起手预警",OM="走进 1.6m：脚下红弧填满 = 命中帧",BM=[2,2],HM="circle",GM=3.2,XM="#ff5a4a",VM="v9s.15 历史固定工位",WM={dx:0,dz:3},YM={dx:0,dz:-2.6},$M=[{dx:0,dz:-.2,mode:"attack"}],ZM={id:FM,index:UM,name:NM,hint:OM,span:BM,shape:HM,radius:GM,color:XM,owner:VM,spawn:WM,label:YM,dummies:$M},jM="x-destructibles",qM="可破坏物件 · 斜切断口",KM="站高台打=高处断，平地打=低处断；切口朝挥刀方向斜切 · 瓶罐只断预设带",JM=[2,2],QM=2,t_="#e8a05c",e_="可破坏物件（auto 地块，只写相对偏移；id 不带版本代号，由合并闸门统一领号；排在 sparring-demo 之后不抢槽位）",n_=[{id:"pole-a",kind:"pole",dx:-1.25,dz:-1,height:2.4,radius:.11,tiltDeg:20,color:"#8a6b4a",cutColor:"#f0d2a0"},{id:"pole-b",kind:"pole",dx:0,dz:-1,height:2.8,radius:.11,tiltDeg:20,color:"#8a6b4a",cutColor:"#f0d2a0"},{id:"pole-c",kind:"pole",dx:1.25,dz:-1,height:2,radius:.11,tiltDeg:20,color:"#8a6b4a",cutColor:"#f0d2a0"},{id:"jar-a",kind:"jar",dx:-.7,dz:-1.8,height:.9,radius:.28,tiltDeg:14,bands:[.35,.62],color:"#6f8fb8",cutColor:"#d8e4f0"},{id:"jar-b",kind:"jar",dx:.7,dz:-1.8,height:.8,radius:.26,tiltDeg:14,bands:[.4,.68],color:"#b87f6f",cutColor:"#f0d8c8"}],i_={id:jM,name:qM,hint:KM,span:JM,radius:QM,color:t_,owner:e_,destructibles:n_},a_={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,skillDecel:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:0},worldBounds:{minX:-15.5,maxX:15.5,minZ:-15.5,maxZ:15.5},orientation:{bodyTurnRate:7,headTurnRate:12,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},turnInPlace:{enabled:!0,triggerDeg:50,settleDeg:8,durationSec:.45,idleSpeedRatio:.05,inputDeadZone:.12,lookRange:0,armSec:.03,gazeTriggerDeg:120},combat:{comboWindow:.65,settle:.16,attackMoveScale:.3,lungeMoveScale:.08,lungeCurve:1.2,lungeMaxSpeed:17,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3,hitWindow:{start:0,end:.85},comboWindow:.62,notifies:[{at:"windup",u:.7,name:"blade-air",value:.5},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.35,name:"foot-step",value:.6}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,148],[.2,125],[.4,68],[.6,-16],[.8,-78]]},2:{pts:[[0,-77],[.2,-68],[.4,-4],[.6,67],[.8,120]]},3:{stabU:.42}}}},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3,hitWindow:{start:0,end:.9},comboWindow:.5,notifies:[{at:"windup",u:.5,name:"blade-air",value:.45},{at:"active",u:0,name:"blade-air",value:1},{at:"active",u:.6,name:"blade-air",value:.7},{at:"recovery",u:.3,name:"foot-step",value:.5}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,151],[.2,137],[.4,62],[.6,-46],[.8,-128]]},2:{pts:[[0,-3],[.2,7],[.4,57],[.6,105],[.8,135]]},3:{pts:[[0,-150],[.2,-100],[.4,-40],[.6,1],[.8,36]]}}}},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3,hitWindow:{start:0,end:.8},comboWindow:.78,notifies:[{at:"windup",u:.85,name:"blade-air",value:.8},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.45,name:"foot-step",value:1}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,152],[.2,114],[.4,15],[.6,-65],[.8,-120]]},2:{pts:[[0,-124],[.2,-81],[.4,22],[.6,92],[.8,141]]},3:{pts:[[0,90],[.2,39],[.4,8],[.6,4],[.8,7]]}}},groundSlam:{slamU:.6,radius:2.4,knockback:.9,type:"knock",onlyUnhit:!0,holdMul:1.7}},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:.85,minChargeToFire:.15,chargeMoveMultiplier:.55,autoFire:!0,release:{windup:.04,active:.12,recovery:.26,lunge:0},trajectory:{speedMin:9,speedMax:16,launchPitchDeg:3.5,gravity:9,maxLife:2.4,radius:.2,stickMinPitchDeg:50,groundStickLift:.32,stickSec:4,homingRange:14,homingConeDeg:30,turnRateDeg:90,homingTime:.9,aimHeightRatio:.7,verticalTurnRate:18}}},abilities:{arcane:{perWave:3,waves:5,waveInterval:.2,spreadDeg:8,spreadTime:.22,spawnDelay:.035,spawnSideStep:.2,speedJitter:.12,homingRange:8,homingConeDeg:40,turnRateDeg:300,homingTime:1.1,retargetInterval:.25,cooldown:1,speed:10,life:1.4,radius:.3,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.6},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},skills:[{id:"arcane",kind:"channelVolley",slot:"attack",weapon:"staff",paramsRef:"arcane",enabled:!0},{id:"ring",kind:"groundRing",slot:"skill2",weapon:"staff",paramsRef:"ring",enabled:!0}],targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!1,dummyKnockback:.18,hitstop:{light:.045,heavy:.07,knock:.1},hitstopByWeapon:{"sword-shield":1,"dual-swords":.85,greatsword:1.3,staff:1.1,bow:.9},hitstopWarp:{enabled:!0,holdRate:.05,release:.055,payback:1.5,paybackBudget:.6},hitstopComboFalloff:[1,.85,.72]},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5,spar:1.2},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},gaze:{enabled:!0,headLookLimitDeg:55,headGazeRange:7,threatRange:8,recoveryDist:3.5,maxThreats:3,bodyTurnRate:3.2,headTurnRate:8,maxHeadSpeedDeg:300,maxBodySpeedDeg:130,headReturnRate:3.5,headReturnSpeedDeg:120,aimHeightRatio:.75,eyeHeightRatio:.78,headPitchRate:7,maxHeadPitchDeg:28,bodyPitchScale:.3,bodyPitchRate:4,enterThreshold:.05,reactToAttack:!0,reactToApproach:!0,approachDist:2.5,hurtHoldSec:2,hostileModeWeight:.6,spreadFalloff:1.5,behindFalloff:.35,behindAngleDeg:100,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5,spar:1.2},attackBoost:.6,nearDistance:1.5,saturation:2.6},dummies:{count:0,spawn:[],initialModes:["idle","keep-distance","attack","attack","follow","idle"],leashRadius:2.4,radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,strafePeriod:5.2,strafeDuty:.34,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4,fighters:{weapons:["sword-shield","dual-swords","greatsword"],spawn:[],initialModes:["spar","spar","spar"],moveSpeed:2.1,attackInterval:3.4,attackRangeScale:.9,knockbackScale:.6,leashRadius:7,comboCount:0,comboGap:0}},grass:{enabled:!0,footprintCells:2,minHeightCells:1,maxHeightCells:2,bendRadius:.85,maxBendRad:.95,bendRate:18,recoverRate:3.2,stumpRatio:.34,regrow:!0,regrowSec:6,bucketCells:4,wind:{enabled:!0,dirDeg:28,speed:1.35,amplitude:.19,wavelength:4.2,secondWave:{wavelength:1.7,amplitude:.055,speedScale:1.55},gust:{periodSec:7.5,depth:.35},jitter:.16,shadeAmount:.26}}},s_={ground:{size:32,thickness:.4},steps:[],doorways:[],obstacles:[],grid:{cellSize:.5,minX:-16,maxX:16,minZ:-16,maxZ:16},grass:{minCellX:0,maxCellX:0,minCellZ:0,maxCellZ:0,density:.72,bladesPerPatch:[3,6],avoidMargin:.45,seed:20261108}},o_={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:28,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.42},bodyTypes:{standard:{name:"标准",height:1.2,radius:.3},tall:{name:"瘦高",height:1.32,radius:.26,voxel:{headSize:.36,bodyWidth:.34,bodyHeight:.28,limbThickness:.1,legLength:.68,armLength:.5},colors:{body:"#58b39a",head:"#ffe0b2",limb:"#3f8f7c",shoe:"#24443c"}},spider:{name:"蜘蛛",rig:"spider",height:.7,radius:.42,moveSpeed:2.6}},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.6,chestYawMaxDeg:40,stopYawBlendMode:"inStop",stopYawAfterSec:.3,turnStepEnabled:!0,turnStepPitch:.5,turnStepKnee:.35,turnStepDip:.02,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1,backStrafeStartDeg:100,backStrafeFullDeg:132,dirFlipSec:.16,hipYawTrackRateDeg:240,hipYawBackRateDeg:150},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14,moveTakeover:{speed:.35,full:1.2,windup:.55,recovery:1,settle:1}},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13},stretch:{enabled:!0,swingArm:1.45,chargeArm:.88,runLeg:1,torsoGain:.5,impactSquash:.2,impactDecay:11,volumeExp:.5,smoothing:30},swing:{enabled:!0,bodyScale:1,shoulderLift:.055,shoulderPush:.045,shoulderIn:.032,segBlend:.1,segBlendMin:.03,segBlendRef:6,segBlendMax:.14,weaponScale:{greatsword:1,"sword-shield":.78,"dual-swords":.9},combo:{greatsword:["gs.right-left","gs.left-right","gs.overhead"],"sword-shield":["gs.right-left","gs.left-right","ss.shield-bash"],"dual-swords":["ds.right-left","ds.left-right","ds.spin"]},clips:{"gs.right-left":{kind:"right-left",note:"段 1：从右后方扫到左后方。rootYaw 整体带转 ±0.55 rad（≈31°）叠在腰椎 ±60° 上，大剑刃尖水平扫角约 210°",keys:[{t:0,ease:"in",pose:{bodyYaw:1.05,bodyPitch:-.14,bodyRoll:-.18,pelvisX:.06,pelvisZ:-.07,armPitch:-1.15,armYaw:.4,armRoll:.2,elbow:-.5,rootYaw:.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.08,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:0,armRoll:.04,elbow:-.3,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.15,bodyPitch:.16,bodyRoll:.2,pelvisX:-.07,pelvisZ:.11,armPitch:-1.5,armYaw:-.4,armRoll:-.14,elbow:-.12,rootYaw:-.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:-1.55}}]},"gs.left-right":{kind:"left-right",note:"段 2：承接段 1 左后方收势，整体带转 −0.55→+0.55 rad 反向拧回右后方，剑身仍水平",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-.4,armRoll:-.16,elbow:-.5,rootYaw:-.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:0,armRoll:.02,elbow:-.32,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:.4,armRoll:.16,elbow:-.12,rootYaw:.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:1.55}}]},"gs.overhead":{kind:"overhead",note:"段 3：举过头顶（剑身 75° 朝上）向前下劈到 −31°，躯干后仰 → 前压",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.32,bodyRoll:-.05,pelvisX:0,pelvisZ:-.07,armPitch:-1.9,armYaw:-.3,armRoll:.16,elbow:-.55,bladePitch:1.62,bladeTwist:0}},{t:.55,pose:{bodyYaw:.06,bodyPitch:.1,bodyRoll:0,pelvisX:0,pelvisZ:.03,armPitch:-1.1,armYaw:-.26,armRoll:.08,elbow:-.3,bladePitch:.55,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.55,bodyRoll:.02,pelvisX:0,pelvisZ:.13,armPitch:-.15,armYaw:-.2,armRoll:0,elbow:-.1,bladePitch:-.75,bladeTwist:0}}]},"ds.right-left":{kind:"right-left",note:"双持段 1：右手横扫到左后方，左手同时向左后方收（后摆 + 屈肘），两把剑都保持水平",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:1,bodyPitch:-.12,bodyRoll:-.16,pelvisX:.05,pelvisZ:-.06,armPitch:-1.15,armYaw:.9,armRoll:.18,elbow:-.45,armLPitch:.5,armLYaw:-1,armLRoll:.12,elbowL:-1.15,rootYaw:.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.06,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:-.1,armRoll:.04,elbow:-.3,armLPitch:.6,armLYaw:-1,armLRoll:.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.1,bodyPitch:.14,bodyRoll:.18,pelvisX:-.06,pelvisZ:.1,armPitch:-1.5,armYaw:-1.4,armRoll:-.12,elbow:-.12,armLPitch:.65,armLYaw:-.9,armLRoll:.18,elbowL:-1.3,rootYaw:-.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.55}}]},"ds.left-right":{kind:"left-right",note:"双持段 2：左手横扫回右后方，右手同时向右后方收（段 1 的镜像，主挥换到左手）",lead:"L",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-1.4,armRoll:-.16,elbow:-.5,armLPitch:.5,armLYaw:1,armLRoll:-.12,elbowL:-1.15,rootYaw:-.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:-.1,armRoll:.02,elbow:-.32,armLPitch:.6,armLYaw:.9,armLRoll:-.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:1.4,armRoll:.16,elbow:-.12,armLPitch:.65,armLYaw:.8,armLRoll:-.18,elbowL:-1.3,rootYaw:.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:1.55}}]},"ds.spin":{kind:"spin",note:"双持段 3：双剑水平展开（主副手 roll 外张到 ±1.15），整个人原地转一整圈。spin 按 attackProgress 单调推进到 2π≡0，收招自动回正",lead:"R",spin:{turns:1,ease:"inOut",span:.6},keys:[{t:0,ease:"in",pose:{bodyYaw:.1,bodyPitch:-.14,bodyRoll:0,pelvisX:0,pelvisZ:-.05,armPitch:-1.1,armYaw:1.7,armRoll:.3,elbow:-.5,armLPitch:-1.1,armLYaw:0,armLRoll:-.3,elbowL:-.5,bladePitch:.05,bladePitchOff:.05,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:.5,pose:{bodyYaw:0,bodyPitch:.04,bodyRoll:0,pelvisX:0,pelvisZ:.04,armPitch:-1.55,armYaw:2.1,armRoll:.45,elbow:-.05,armLPitch:-1.55,armLYaw:.3,armLRoll:-.45,elbowL:-.05,bladePitch:0,bladePitchOff:0,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:1,pose:{bodyYaw:-.1,bodyPitch:.12,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:-1.3,armYaw:1.9,armRoll:.4,elbow:-.25,armLPitch:-1.3,armLYaw:-.05,armLRoll:-.4,elbowL:-.25,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.35,bladeTwistOff:1.35}}]},"ss.shield-bash":{kind:"bash",note:"剑盾段 3：收盾蓄力 → 左臂持盾猛前顶（臂前伸 + 肘伸直 + 身体前压 + 骨盆前冲）。bladePitchOff 反解让盾面始终正对前方",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.28,bodyRoll:-.04,pelvisX:.01,pelvisZ:-.08,armPitch:.1,armYaw:-.2,armRoll:.1,elbow:-.7,armLPitch:-.7,armLYaw:.1,armLRoll:.15,elbowL:-.9,bladePitch:.2,bladePitchOff:.1,bladeTwist:0}},{t:.55,pose:{bodyYaw:.04,bodyPitch:.15,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:.2,armYaw:-.15,armRoll:.05,elbow:-.6,armLPitch:-1.1,armLYaw:.05,armLRoll:.1,elbowL:-.45,bladePitch:.1,bladePitchOff:.02,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.5,bodyRoll:.02,pelvisX:0,pelvisZ:.18,armPitch:.25,armYaw:-.1,armRoll:0,elbow:-.5,armLPitch:-1.55,armLYaw:0,armLRoll:.05,elbowL:-.05,bladePitch:.05,bladePitchOff:0,bladeTwist:0}}]}},poseIn:.1,poseOut:.16},stance:{"sword-shield":{armSwing:.85,armR:{pitch:-.12,roll:.1,elbow:-.15},armL:{pitch:-.45,roll:.1,elbow:-.75},torsoYaw:.12,bladePitchDeg:-8,blend:.22},"dual-swords":{armSwing:1,armR:{pitch:-.15,roll:.16,elbow:-.45},armL:{pitch:-.15,roll:-.16,elbow:-.45},torsoYaw:0,bladePitchDeg:-12,bladePitchOffDeg:-8,blend:.22},greatsword:{armSwing:.45,armR:{pitch:-.3,roll:.05,elbow:-.55},armL:{pitch:-.2,roll:-.1,elbow:-.65},torsoPitch:.04,bladePitchDeg:-30,blend:.26},staff:{armSwing:.6,armR:{pitch:-.1,roll:.06,elbow:-.35},armL:{pitch:.02,roll:-.08,elbow:-.15},torsoYaw:.06,blend:.22},bow:{armSwing:.55,armL:{pitch:-.15,roll:-.1,elbow:-.2},armR:{pitch:.02,elbow:-.25},torsoYaw:-.08,blend:.22}},spine:{enabled:!0,waist:.58,chest:.42,neck:.16,chestPivot:.42}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6,twoHandInsetX:.15,twoHandGripY:-.1,twoHandMaxStretch:1.3,twoHandMinGrip:.62,twoHandGripStart:1.02,twoHandSlideRate:9,swordCantDeg:10,greatswordCantDeg:0},weaponWrist:{enabled:!0,lag:.042,maxAngle:.72,rate:24,twistLag:.03,maxTwist:.5,runDrag:.11},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},groundRing:{playerRadiusFactor:2.3,dummyRadiusFactor:2.05,thicknessFactor:.16,arcDeg:180,selectedArcDeg:270,opacity:.22,playerOpacity:.44,selectedOpacity:.62,selectedScale:1.06,selectedThicknessScale:1.6,edgeFade:.2,playerColor:"#8fe7ff",neutralColor:"#7fb8d8",lowThreatColor:"#ffc85a",highThreatColor:"#ff3b30",haloRadiusFactor:1.16,haloThicknessFactor:2.6,haloOpacity:.14,haloFadeInSec:.05,haloFadeOutSec:.36,meterRadiusFactor:1.34,meterThicknessFactor:.52,meterOpacity:.9,meterColorCharge:"#ffd166",meterColorChannel:"#b48cff",meterColorCooldown:"#7fb8d8",warnRadiusFactor:1.14,warnThicknessFactor:1.5,warnOpacity:.9,warnColor:"#ff5a4a",areaOpacity:.5,landingOpacity:.55,areaExpandSec:.22},projectiles:{arrowColor:"#ffe3a6",arrowHeadColor:"#fff6d8",arrowTrailColor:"#ffcf86",arrowLength:.72,arrowWidth:.062,arrowHeadSize:.16,arrowGlowSize:.5,trailLength:1.05,trailOpacity:.42,boltColor:"#a9ecff",boltGlowColor:"#7fe3ff",boltShapeX:.42,boltShapeY:.42,boltShapeZ:.85,boltGlowScale:1.6,boltTrailScale:2.2,slashEnabled:!1,slashThickness:.075,slashGlowOpacity:.34},weaponTrail:{enabled:!0,maxSamples:30,minStep:.015,life:.11,minSpeed:5.5,color:"#8fd0ff",intensity:.42,tipBoost:.35,pulseDecay:14},hitstop:{enabled:!0,duration:.07},lab:{enabled:!0,showLabels:!0,padOpacity:.55,labelTextHeight:.82},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],attackArcColor:"#ff6b5e",fighterColors:[{body:"#c85a4a",limb:"#8d3a30",head:"#f0c9a0"},{body:"#c9a03c",limb:"#8a6b22",head:"#f0d6a0"},{body:"#7d6ec4",limb:"#4f4488",head:"#e6d2b0"}]},balance:{enabled:!0,reactionTime:.18,gravity:9.81,autoCounter:!0,maxShift:.045,counterRate:8,predLead:.12,counterBoost:1.6},renderInterp:{enabled:!0,yawSmoothMs:35},groundSlam:{enabled:!0,color:"#e8d8b0",duration:.42,delay:.09,outerScale:1.25,shake:.95},grass:{enabled:!0,bladeWidth:.13,segmentHeight:.5,palette:["#3f7d4f","#569a5c","#6fb56a","#8ccb78","#a9dc86"],stumpColor:"#6b7a48",maxInstances:6e3,debris:{max:220,life:.85,color:"#a9dc86"}}},r_={core:a_,scene:s_,view:o_};function Qd(n){return JSON.parse(JSON.stringify(n))}const th=r_,c_=Object.assign({"../config/plots/dash.json":ly,"../config/plots/gait.json":by,"../config/plots/hub.json":Ny,"../config/plots/meter.json":Jy,"../config/plots/rings.json":hM,"../config/plots/sparring-demo.json":_M,"../config/plots/terrain.json":zM,"../config/plots/windup.json":ZM,"../config/plots/x-destructibles.json":i_}),l_=Object.values(c_).filter(n=>n&&typeof n.id=="string"&&n.id.length>0),sm=$d,Ki=Xg(l_,sm),wu=Ki.plots,om=Qd(th.core),Br=Qd(th.scene),_n=Qd(th.view);Vg(om,Br,Ki,sm);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class Fi{constructor(t,e,i,a,s="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(s),this.domElement.classList.add("controller"),this.domElement.classList.add(a),this.$name=document.createElement("div"),this.$name.classList.add("name"),Fi.nextNameID=Fi.nextNameID||0,this.$name.id=`lil-gui-name-${++Fi.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class d_ extends Fi{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function jl(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const h_={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:jl,toHexString:jl},Oo={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},u_={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=Oo.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return Oo.toHexString(a)}},f_={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=Oo.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return Oo.toHexString(a)}},p_=[h_,Oo,u_,f_];function m_(n){return p_.find(t=>t.match(n))}class g_ extends Fi{constructor(t,e,i,a){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=m_(this.initialValue),this._rgbScale=a,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const s=jl(this.$text.value);s&&this._setValueFromHexString(s)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class Yc extends Fi{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",a=>{a.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class x_ extends Fi{constructor(t,e,i,a,s,o){super(t,e,i,"number"),this._initInput(),this.min(a),this.max(s);const r=o!==void 0;this.step(r?o:this._getImplicitStep(),r),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let _=parseFloat(this.$input.value);isNaN(_)||(this._stepExplicit&&(_=this._snap(_)),this.setValue(this._clamp(_)))},i=_=>{const x=parseFloat(this.$input.value);isNaN(x)||(this._snapClampSetValue(x+_),this.$input.value=this.getValue())},a=_=>{_.key==="Enter"&&this.$input.blur(),_.code==="ArrowUp"&&(_.preventDefault(),i(this._step*this._arrowKeyMultiplier(_))),_.code==="ArrowDown"&&(_.preventDefault(),i(this._step*this._arrowKeyMultiplier(_)*-1))},s=_=>{this._inputFocused&&(_.preventDefault(),i(this._step*this._normalizeMouseWheel(_)))};let o=!1,r,c,l,d,u;const h=5,f=_=>{r=_.clientX,c=l=_.clientY,o=!0,d=this.getValue(),u=0,window.addEventListener("mousemove",m),window.addEventListener("mouseup",v)},m=_=>{if(o){const x=_.clientX-r,y=_.clientY-c;Math.abs(y)>h?(_.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(x)>h&&v()}if(!o){const x=_.clientY-l;u-=x*this._step*this._arrowKeyMultiplier(_),d+u>this._max?u=this._max-d:d+u<this._min&&(u=this._min-d),this._snapClampSetValue(d+u)}l=_.clientY},v=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",m),window.removeEventListener("mouseup",v)},g=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",a),this.$input.addEventListener("wheel",s,{passive:!1}),this.$input.addEventListener("mousedown",f),this.$input.addEventListener("focus",g),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,_,x,y,S)=>(p-_)/(x-_)*(S-y)+y,e=p=>{const _=this.$slider.getBoundingClientRect();let x=t(p,_.left,_.right,this._min,this._max);this._snapClampSetValue(x)},i=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",a),window.addEventListener("mouseup",s)},a=p=>{e(p.clientX)},s=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",a),window.removeEventListener("mouseup",s)};let o=!1,r,c;const l=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),o=!1},d=p=>{p.touches.length>1||(this._hasScrollBar?(r=p.touches[0].clientX,c=p.touches[0].clientY,o=!0):l(p),window.addEventListener("touchmove",u,{passive:!1}),window.addEventListener("touchend",h))},u=p=>{if(o){const _=p.touches[0].clientX-r,x=p.touches[0].clientY-c;Math.abs(_)>Math.abs(x)?l(p):(window.removeEventListener("touchmove",u),window.removeEventListener("touchend",h))}else p.preventDefault(),e(p.touches[0].clientX)},h=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",u),window.removeEventListener("touchend",h)},f=this._callOnFinishChange.bind(this),m=400;let v;const g=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const x=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+x),this.$input.value=this.getValue(),clearTimeout(v),v=setTimeout(f,m)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",d,{passive:!1}),this.$slider.addEventListener("wheel",g,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class v_ extends Fi{constructor(t,e,i,a){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(a)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class y_ extends Fi{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",a=>{a.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const M_=`.lil-gui {
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
}`;function __(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let Eu=!1;class sc{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:a,title:s="Controls",closeFolders:o=!1,injectStyles:r=!0,touchStyles:c=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",l=>{(l.code==="Enter"||l.code==="Space")&&(l.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(s),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),c&&this.domElement.classList.add("allow-touch-styles"),!Eu&&r&&(__(M_),Eu=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),a&&this.domElement.style.setProperty("--width",a+"px"),this._closeFolders=o}add(t,e,i,a,s){if(Object(i)===i)return new v_(this,t,e,i);const o=t[e];switch(typeof o){case"number":return new x_(this,t,e,i,a,s);case"boolean":return new d_(this,t,e);case"string":return new y_(this,t,e);case"function":return new Yc(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,i=1){return new g_(this,t,e,i)}addFolder(t){const e=new sc({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof Yc||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof Yc)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=s=>{s.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const a=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=a+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function b_(n,t,e,i){const a=document.getElementById("debug-panel"),s=a?new sc({title:"实验台 · 调试面板",autoPlace:!1,container:a}):new sc({title:"实验台 · 调试面板"}),o=n.config,r=[],c=[],l=St=>{const Yt=s.addFolder(St);return c.push(Yt),Yt},d=(St,Yt)=>{const xt=St.addFolder(Yt);return r.push(xt),xt},u=l("模拟 / 显示");u.add(e,"timeScale",0,3,.05).name("时间缩放"),u.add(e,"paused").name("暂停"),u.add({step:i.singleStep},"step").name("单步 (1 tick)"),u.add({reset:i.reset},"reset").name("复位全部"),u.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),u.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid),u.add(e,"showLab").name("工位地面盘").onChange(i.onToggleLab),u.add(e,"showLabLabels").name("工位标牌").onChange(i.onToggleLabLabels);const h=d(u,"模块开关");h.add(n.modules,"movement").name("movement"),h.add(n.modules,"combat").name("combat"),h.add(n.modules,"links").name("links"),h.add(n.modules,"orientation").name("orientation"),h.add(n.modules,"turnInPlace").name("turnInPlace"),h.add(n.modules,"targeting").name("targeting"),h.add(n.modules,"hits").name("hits"),h.add(n.modules,"separation").name("separation"),h.add(n.modules,"dash").name("dash"),h.add(n.modules,"camera").name("camera"),h.add(n.modules,"dummies").name("dummies"),h.add(n.modules,"abilities").name("abilities");const f=l("移动 / 输入"),m=d(f,"基础移动参数");m.add(o,"moveSpeed",1,10,.1).name("移动速度"),m.add(o,"sprintMultiplier",1,3,.05).name("冲刺倍率"),m.add(o,"acceleration",1,40,.5).name("加速度"),m.add(o,"friction",1,40,.5).name("摩擦"),m.add(o,"skillDecel",2,40,.5).name("进入技能时的减速速率"),m.add(o,"gravity",5,60,.5).name("重力"),m.add(o,"jumpSpeed",2,16,.2).name("起跳速度"),m.add(o,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),m.add(o,"characterRadius",.1,.8,.01).name("角色半径"),m.add(o,"characterHeight",.6,2.2,.05).name("角色身高"),m.add(o,"strideLength",.3,3,.05).name("基础步幅"),m.add(o,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),m.add(o,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const v=d(f,"摇杆 / 输入");v.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),v.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const g=o.dash,p=d(f,"冲刺 / 闪避");p.add(g,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),p.add(g,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),p.add(g,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),p.add(g,"blinkDistance",1,12,.25).name("闪现距离 (m)"),p.add(g,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),p.add(g,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),p.add(g,"blinkClearVelocity").name("闪现清空速度"),p.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),p.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const _=o.separation,x=d(f,"角色间分离 / 挤压阻力");x.add(_,"iterations",1,8,1).name("迭代次数"),x.add(_,"slop",0,.05,.002).name("额外分离量 (m)"),x.add(_.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),x.add(_.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),x.add(_.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const y=l("动作 / 步态"),S=d(y,"程序化步态");S.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),S.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),S.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),S.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),S.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),S.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),S.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),S.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),S.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),S.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),S.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),S.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),S.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),S.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)"),S.add(t.gait,"backStrafeStartDeg",20,170,1).name("侧后方起步角 (°)"),S.add(t.gait,"backStrafeFullDeg",40,180,1).name("完全后退角 (°)"),S.add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)"),S.add(t.gait,"dirFlipSec",0,.4,.01).name("换向融合时长 (s)"),S.add(t.gait,"hipYawTrackRateDeg",0,600,10).name("下盘目标转速上限 (°/s)"),S.add(t.gait,"hipYawBackRateDeg",0,600,10).name("└ 后退相位上限 (°/s)");const w=d(y,"停步 / 收相 / 惯性");w.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),w.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),w.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),w.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),w.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),w.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),w.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),w.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),w.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),w.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),w.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),w.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const T=d(y,"足部 IK"),R=t.ik;T.add(R,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),T.add(R,"weight",0,1,.01).name("钉地权重"),T.add(R,"attackScale",0,1,.01).name("攻击时权重倍率"),T.add(R,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const b=d(y,"惯性倾斜 / 盆骨"),M=t.lean;b.add(M,"accelGain",0,.1,.002).name("前后加速度增益"),b.add(M,"turnGain",0,.2,.005).name("绕圈侧倾增益"),b.add(M,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),b.add(M,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),b.add(M,"smoothing",1,30,1).name("倾斜平滑速率"),b.add(M,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),b.add(M,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),b.add(M,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),b.add(M,"crouchSmoothing",1,30,1).name("下沉平滑速率");const C=o.orientation,k=d(y,"朝向 / 接敌注视 / 原地转身");k.add(C,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),k.add(C,"headTurnRate",.5,40,.5).name("头部转向速率"),k.add(C,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),k.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),k.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),k.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const D=o.gaze;k.add(D,"headReturnRate",.5,12,.1).name("无目标回正速率 (1/s)"),k.add(D,"headReturnSpeedDeg",20,400,10).name("回正角速度上限 (°/s)"),k.add(D,"bodyTurnRate",.2,12,.1).name("接敌身体转向速率"),k.add(D,"headTurnRate",.5,30,.5).name("接敌头部转向速率"),k.add(D,"maxHeadSpeedDeg",30,900,10).name("头部最大角速度 (°/s)"),k.add(D,"maxBodySpeedDeg",20,600,10).name("身体最大角速度 (°/s)"),k.add(D,"aimHeightRatio",.2,1,.05).name("注视点高度（身高比例）"),k.add(D,"headPitchRate",.5,20,.5).name("头部俯仰速率"),k.add(D,"maxHeadPitchDeg",0,60,1).name("头部俯仰限幅 (°)"),k.add(D,"bodyPitchScale",0,1,.05).name("身体俯仰比例"),k.add(D,"bodyPitchRate",.5,20,.5).name("身体俯仰速率");const F=o.turnInPlace;k.add(F,"enabled").name("启用原地转身 (关=纯插值)"),k.add(F,"triggerDeg",20,180,5).name("触发夹角 (°)"),k.add(F,"gazeTriggerDeg",20,180,5).name("接敌时触发夹角 (°)"),k.add(F,"settleDeg",0,60,1).name("转身保留余角 (°)"),k.add(F,"durationSec",.1,1.5,.02).name("转身时长 (s)"),k.add(F,"idleSpeedRatio",0,.3,.01).name("静止速度比上限"),k.add(F,"inputDeadZone",0,.5,.01).name("起步输入死区"),k.add(F,"armSec",0,.5,.01).name("触发防抖 (s)"),k.add(t.gait,"stopYawBlendMode",["inStop","afterStop"]).name("停步偏差消化窗口"),k.add(t.gait,"stopYawAfterSec",.05,1,.02).name("收相后消化时长 (s)"),k.add(t.gait,"turnStepEnabled").name("转身踏步 (关=滑过去)"),k.add(t.gait,"turnStepPitch",0,1.2,.02).name("踏步前迈 (rad)"),k.add(t.gait,"turnStepKnee",0,1,.02).name("踏步抬膝 (rad)"),k.add(t.gait,"turnStepDip",0,.1,.002).name("踏步重心下沉 (m)");const A=l("战斗 / 命中"),E=o.combat,z=d(A,"连击 / 武器时序"),G=z.add(n.combat,"weapon",_a).name("当前武器");z.add(E,"comboWindow",.1,2,.05).name("连击窗口 (s)"),z.add(E,"settle",0,.8,.01).name("段间停顿 (s)"),z.add(E,"attackMoveScale",0,1,.01).name("攻击时移动比例"),z.add(E,"lungeMoveScale",0,.4,.01).name("跨步时移动比例"),z.add(E,"lungeCurve",.2,4,.1).name("跨步曲线指数 (大=更冲)"),z.add(E,"lungeMaxSpeed",4,30,.5).name("跨步速度上限 (m/s)"),z.add(E,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),z.add(E,"cancelWindow",0,1,.01).name("取消窗口 (s)"),z.add(E,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),z.add(E,"autoCombo").name("按住自动连击"),z.add(E.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),z.add(E.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),z.add(E.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),z.add(E.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率"),z.add(E.bow,"maxChargeTime",.2,2,.05).name("满蓄力时间 (s)"),z.add(E.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),z.add(E.bow,"autoFire").name("蓄满自动放箭 (按住连射)"),z.add(E.bow.trajectory,"gravity",0,24,.5).name("箭矢重力 (m/s²)"),z.add(E.bow.trajectory,"speedMax",8,32,.5).name("满蓄初速 (m/s)"),z.add(E.bow.trajectory,"homingRange",0,30,1).name("自动瞄准距离 (m)"),z.add(E.bow.trajectory,"turnRateDeg",0,240,5).name("箭追踪转向 (°/s)"),z.add(E.bow.trajectory,"homingTime",0,2,.05).name("追踪时长 (s)"),z.add(E.bow.trajectory,"aimHeightRatio",0,1,.05).name("瞄准点高度");const X=o.abilities;z.add(X.arcane,"perWave",1,8,1).name("每波飞弹数"),z.add(X.arcane,"waves",1,12,1).name("每次引导波数"),z.add(X.arcane,"waveInterval",.05,.8,.01).name("波间隔 (s)"),z.add(X.arcane,"spreadDeg",0,20,.5).name("波内散布 (度)"),z.add(X.arcane,"spreadTime",0,.6,.01).name("出膛散开时长 (s)"),z.add(X.arcane,"spawnDelay",0,.2,.005).name("波内出膛错落 (s)"),z.add(X.arcane,"speedJitter",0,.5,.02).name("速度浮动比例"),z.add(X.arcane,"turnRateDeg",0,420,10).name("制导转向 (度/秒)"),z.add(X.arcane,"retargetInterval",.05,1,.05).name("重新索敌间隔 (s)"),z.add(X.arcane,"cooldown",0,3,.05).name("引导结束冷却 (s)"),z.add(X.arcane,"speed",3,24,.5).name("飞弹速度"),z.add(X.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),z.add(X.ring,"radius",.5,5,.1).name("电环半径"),z.add(X.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),z.add(X.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const et=o.hits.hitstopWarp;if(et){const St=d(A,"卡肉节奏（接触瓦片）");St.add(et,"enabled").name("瓦片开（关=硬冻结）"),St.add(et,"holdRate",0,.4,.01).name("保持期速率"),St.add(et,"release",.005,.2,.005).name("释放时长 (s)"),St.add(et,"payback",1,2.5,.05).name("偿还倍率"),St.add(o.hits.hitstop,"light",0,.2,.005).name("轻击保持 (s)"),St.add(o.hits.hitstop,"heavy",0,.25,.005).name("重击保持 (s)"),St.add(o.hits.hitstop,"knock",0,.3,.005).name("击飞保持 (s)")}const ht=o.hits,gt=d(A,"命中 / 受击 / 击退");gt.add(ht,"arcDeg",10,120,5).name("命中扇区半角 (°)"),gt.add(ht,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),gt.add(ht,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),gt.add(ht,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),gt.add(ht.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),gt.add(ht.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),gt.add(ht,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),gt.add(ht,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const Lt={get enabled(){return!ht.noDamageToPlayer},set enabled(St){ht.noDamageToPlayer=!St}};gt.add(Lt,"enabled").name("玩家受击击退");const Z=d(A,"受击分层"),B=t.hurt;Z.add(B,"enabled").name("启用分层受击 (关=旧版对照)"),Z.add(B,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),Z.add(B,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),Z.add(B,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),Z.add(B,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),Z.add(B,"upperShiftScale",0,1,.01).name("上身位移缩放"),Z.add(B,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),Z.add(B.hitHeight,"light",0,1,.01).name("轻击命中部位"),Z.add(B.hitHeight,"heavy",0,1,.01).name("重击命中部位"),Z.add(B.hitHeight,"knock",0,1,.01).name("击退命中部位"),Z.add(B,"leanLight",0,1.5,.01).name("轻击力度"),Z.add(B,"leanHeavy",0,1.5,.01).name("重击力度"),Z.add(B,"leanKnock",0,1.5,.01).name("击退力度"),Z.add(B,"flashStrength",0,2,.05).name("受击闪光强度");for(const{name:St,p:Yt}of[{name:"打腹 (abdomen)",p:B.abdomen},{name:"打肩 (shoulder)",p:B.shoulder}]){const xt=d(Z,St);xt.add(Yt,"upperPitch",0,2,.01).name("上身前后倾斜"),xt.add(Yt,"upperRoll",0,2,.01).name("上身侧倾"),xt.add(Yt,"upperYaw",0,1.5,.01).name("肩部扭转"),xt.add(Yt,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),xt.add(Yt,"shift",0,.8,.01).name("身体反应位移"),xt.add(Yt,"drop",0,.4,.01).name("整体下沉"),xt.add(Yt,"back",0,.4,.01).name("屁股向后"),xt.add(Yt,"knee",0,1.6,.01).name("屈膝"),xt.add(Yt,"hip",0,1,.01).name("髋前倾"),xt.add(Yt,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)")}const Y=d(A,"派生招"),q=o.links;Y.add(q,"enabled").name("总开关 (false=旧连击)"),Y.add(q.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),Y.add(q.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),Y.add(q.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),Y.add(q,"sharedCooldown",0,3,.05).name("共享 CD (s)"),Y.add(q,"triggerWhileSprinting").name("长跑中可直接触发"),Y.add(q.search,"range",1,14,.1).name("索敌距离 (m)"),Y.add(q.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),Y.add(q.search,"stopDistance",0,3,.05).name("停住距离 (m)");const K=q.moves["sword-shield"];K&&(Y.add(K,"enabled").name("剑盾盾击"),Y.add(K,"distance",0,8,.1).name("冲锋极限 (m)"),Y.add(K,"windup",0,.5,.01).name("前摇 (s)"),Y.add(K,"active",0,.8,.01).name("冲锋 / 命中 (s)"),Y.add(K,"recovery",0,.8,.01).name("收势 (s)"),Y.add(K.hit,"radius",0,4,.05).name("命中半径 (m)"),Y.add(K.hit,"width",0,2,.05).name("扫掠半径 (m)"),Y.add(K.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),Y.add(K.hit,"duration",0,1.5,.01).name("僵直 (s)"));const st=o.targeting,Tt=d(A,"目标辅助");Tt.add(st,"targetAssist").name("启用目标辅助"),Tt.add(st,"range",1,14,.5).name("锁定范围 (m)"),Tt.add(st,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),Tt.add(st,"frontBias",0,4,.1).name("朝向加权"),Tt.add(st,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),Tt.add(st,"maxLungeScale",1,3,.1).name("前冲最大放大");const Gt=l("表现 / 特效"),J=d(Gt,"挥击幅度 / 刀光"),V=t.animation.swing;J.add(V,"enabled").name("挥击身体幅度 开"),J.add(V,"bodyScale",0,1.6,.05).name("躯干 / 骨盆幅度倍率"),J.add(V,"shoulderLift",0,.12,.005).name("肩部抬升上限 (m)"),J.add(V,"shoulderPush",0,.1,.005).name("肩部前送上限 (m)"),J.add(V,"shoulderIn",0,.1,.005).name("双手武器肩内收 (m)"),J.add(V,"segBlend",0,.35,.01).name("段间过渡兜底 (s)"),J.add(V,"segBlendMin",.008,.12,.004).name("段间过渡下限 (s)"),J.add(V,"segBlendRef",2,16,.5).name("段间过渡参考距离 (rad)"),J.add(V.weaponScale,"greatsword",0,1.6,.05).name("大剑幅度倍率");const O=t.weaponTrail;J.add(O,"enabled").name("挥击刀光 开"),J.add(O,"life",.04,.4,.01).name("刀光残留 (s)"),J.add(O,"intensity",0,1.5,.05).name("刀光亮度"),J.add(O,"minStep",.005,.1,.005).name("采样最小位移 (m)"),J.add(t.hitstop,"enabled").name("命中卡肉 / 震屏");const Pt=d(Gt,"夸张化 / 四肢伸缩"),Et=t.animation.stretch;Pt.add(Et,"enabled").name("四肢伸缩 开"),Pt.add(Et,"swingArm",1,1.8,.01).name("挥出时手臂拉伸"),Pt.add(Et,"chargeArm",.7,1,.01).name("蓄力时手臂压缩"),Pt.add(Et,"impactSquash",0,.5,.01).name("命中挤压量"),Pt.add(Et,"impactDecay",2,30,.5).name("挤压回弹速率 (1/s)"),Pt.add(Et,"torsoGain",0,1,.05).name("躯干跟随比例"),Pt.add(Et,"volumeExp",0,1.5,.05).name("体积补偿指数");const lt=d(Gt,"武器握持 / 腕部"),vt=t.weaponWrist;lt.add(vt,"enabled").name("腕部滞后 开（关掉=武器焊在手上）"),lt.add(vt,"lag",0,.08,.002).name("臂速 → 腕滞后"),lt.add(vt,"maxAngle",0,1.2,.02).name("腕滞后上限 (rad)"),lt.add(vt,"rate",4,50,1).name("腕部跟随速率 (1/s)"),lt.add(vt,"twistLag",0,.06,.002).name("躯干扭转 → 剑横甩"),lt.add(vt,"maxTwist",0,.9,.02).name("横甩上限 (rad)");const ft=t.weaponMount;lt.add(ft,"twoHandInsetX",0,.3,.01).name("双手武器内收 (m)"),lt.add(ft,"twoHandGripY",-.5,0,.01).name("副握点在柄上的位置"),lt.add(ft,"twoHandMaxStretch",1,1.8,.01).name("副手臂长拉伸上限"),lt.add(ft,"twoHandMinGrip",0,1,.02).name("最低握持权重（1=永不松手）"),lt.add(ft,"twoHandGripStart",1,1.4,.01).name("开始松手的臂展比"),lt.add(ft,"twoHandSlideRate",0,30,1).name("握点滑柄跟随速率 (1/s)"),lt.add(ft,"swordPitchDeg",0,90,1).name("剑前倾角"),lt.add(ft,"swordYawDeg",0,45,1).name("剑外张角"),lt.add(ft,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),lt.add(ft,"staffPitchDeg",0,60,1).name("法杖前倾角");const Rt=l("假人 / 混战"),L=o.dummies,P=d(Rt,"普通假人 AI");P.add(L,"moveSpeed",.5,8,.1).name("移动速度"),P.add(L,"wanderRadius",.5,8,.1).name("游走半径"),P.add(L,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),P.add(L,"followStopDistance",.3,5,.1).name("跟随停距"),P.add(L,"keepDistance",1,10,.1).name("保持距离"),P.add(L,"keepDeadZone",.1,2,.05).name("保持死区"),P.add(L,"attackRange",.5,5,.1).name("攻击距离"),P.add(L,"attackInterval",.3,5,.1).name("攻击间隔 (s)"),P.add(L,"leashRadius",0,8,.1).name("牵引半径 (0=不限)");const Q=L.fighters;if(Q){const St=d(Rt,"持械陪练（剑盾 / 双刀 / 大剑）");St.add(Q,"moveSpeed",.5,6,.1).name("移动速度"),St.add(Q,"attackInterval",.5,8,.1).name("攻击间隔 (s)"),St.add(Q,"attackRangeScale",.5,1.2,.02).name("起手距离 / 武器 reach"),St.add(Q,"knockbackScale",0,2,.05).name("击退比例"),St.add(Q,"leashRadius",0,14,.5).name("牵引半径 (m)"),St.add(Q,"comboCount",0,3,1).name("连击段数 (0=随武器)"),St.add(Q,"comboGap",0,.6,.01).name("段间缝隙 (s, 0=用全局)");const Yt=()=>n.dummies.find(Ut=>Ut.weapon!==null),xt={get mode(){var Ut;return((Ut=Yt())==null?void 0:Ut.mode)??"spar"},set mode(Ut){i.setFighterMode(Ut)}};St.add(xt,"mode",Mp).name("陪练行为（全部）")}const mt=l("相机"),ot=d(mt,"基础");ot.add(t.camera,"pitchDeg",20,80,1).name("俯角"),ot.add(t.camera,"yawDeg",-180,180,1).name("方位角"),ot.add(t.camera,"distance",6,35,.5).name("距离"),ot.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),ot.add(t.camera,"fov",25,90,1).name("FOV");const dt=o.camera,zt=d(mt,"智能构图");zt.add(dt,"radius",2,18,.5).name("威胁评估半径 (m)"),zt.add(dt,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),zt.add(dt,"saturation",.5,8,.1).name("威胁归一化饱和"),zt.add(dt,"pushIn",0,.5,.01).name("无威胁推进比例"),zt.add(dt,"maxPullback",0,1,.02).name("最大拉远比例"),zt.add(dt,"maxOffset",0,6,.1).name("最大构图平移 (m)"),zt.add(dt,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),zt.add(dt,"framingBias",0,1,.05).name("威胁质心平移系数"),zt.add(dt,"attackBoost",0,2,.05).name("挥砍中额外加权"),zt.add(dt.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),zt.add(dt.modeWeight,"spar",0,3,.05).name("陪练模式威胁倍率"),zt.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const Ct=d(mt,"缩放");return Ct.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),Ct.add(t.zoom,"max",1,4,.05).name("最大拉远上限"),Ct.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),Ct.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),Ct.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),Ct.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),Ct.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),Ct.add({reset:i.resetZoom},"reset").name("缩放归 1"),r.forEach(St=>St.close()),c.forEach(St=>St.close()),s.close(),{gui:s,refreshWeapon:()=>G.updateDisplay()}}function S_(n,t,e){let i=null,a=Number.POSITIVE_INFINITY;for(const s of n){const o=Math.hypot(t-s.x,e-s.z);o<=s.radius&&o<a&&(i=s,a=o)}return i}function w_(n,t){return n.find(e=>e.id===t)??null}function Tu(n,t,e){if(n.length===0)return null;const i=[...n].sort((r,c)=>r.index-c.index),a=i.findIndex(r=>r.id===t),s=e<0?-1:1,o=a<0?s>0?0:i.length-1:(a+s+i.length)%i.length;return i[o]??null}function E_({stations:n,plots:t=[],world:e,view:i,container:a,onResetZoom:s,onPlotTest:o,onClearTestUnits:r}){var R;const c=a??document.getElementById("lab-panel");let l=null,d=null;const u=new Map,h=document.createElement("div");h.id="lab-toast",h.setAttribute("aria-live","polite"),document.body.appendChild(h);let f=0;function m(b){h.textContent=`${b.index} · ${b.name} — ${b.hint}`,h.style.borderColor=b.color,h.classList.add("is-on"),window.clearTimeout(f),f=window.setTimeout(()=>h.classList.remove("is-on"),5e3)}function v(){return S_(n,e.character.position.x,e.character.position.z)}function g(){const b=v(),M=(b==null?void 0:b.id)??null;if(M===l)return;const C=l!==null;l=M;for(const[k,D]of u)D.classList.toggle("is-active",k===M);d&&(d.textContent=b?`${b.index} · ${b.hint}`:"不在任何工位内：点上面的名字传送，或直接走过去",d.style.color=b?"rgba(206, 226, 244, 0.9)":"rgba(150, 172, 192, 0.62)"),b?m(b):C&&h.classList.remove("is-on")}function p(b){const M=typeof b=="number"?n.find(C=>C.index===b)??null:w_(n,b);return M?(Ox(e,M.spawnX,M.spawnZ),e.camera.centroidX=M.spawnX,e.camera.centroidZ=M.spawnZ,i.snapCamera(M.spawnX,e.character.position.y,M.spawnZ),g(),!0):!1}function _(){Vp(e)}function x(b){return p(b.id),o?o(b):0}function y(){return r?r():0}function S(b){const M=typeof b=="number"?t.find(C=>C.index===b):t.find(C=>C.id===b);return M&&M.testSpawn?x(M):0}const w=t.filter(b=>b.testSpawn),T=b=>{var M,C;return(((M=b.testSpawn)==null?void 0:M.dummies)??0)+(((C=b.testSpawn)==null?void 0:C.fighters)??0)};if(c){c.textContent="";const b=document.createElement("div");b.className="lab-head",b.textContent="测试工位";const M=document.createElement("span");M.className="lab-tip",M.textContent="[ / ] 切换",b.appendChild(M),c.appendChild(b);for(const D of[...n].sort((F,A)=>F.index-A.index)){const F=document.createElement("button");F.type="button",F.className="lab-row",F.dataset.station=D.id,F.dataset.uiButton="",F.style.setProperty("--lab-color",D.color),F.setAttribute("aria-label",`传送到工位 ${D.index}：${D.name}`);const A=document.createElement("span");A.className="lab-idx",A.textContent=String(D.index);const E=document.createElement("span");E.className="lab-name",E.textContent=D.name,F.append(A,E),F.addEventListener("pointerdown",z=>{z.preventDefault(),z.stopPropagation(),p(D.id)}),c.appendChild(F),u.set(D.id,F)}if(d=document.createElement("div"),d.className="lab-hint",c.appendChild(d),w.length>0){const D=document.createElement("div");D.className="lab-head lab-subhead",D.textContent="地块测试";const F=document.createElement("span");F.className="lab-tip",F.textContent="就地生成",D.appendChild(F),c.appendChild(D);for(const A of w){const E=document.createElement("div");E.className="lab-row lab-test-row",E.dataset.plot=A.id;const z=document.createElement("span");z.className="lab-name",z.textContent=A.name;const G=document.createElement("button");G.type="button",G.className="lab-btn lab-test",G.dataset.uiButton="",G.dataset.plotTest=A.id,G.textContent=((R=A.testSpawn)==null?void 0:R.label)??`生成 ${T(A)} 人`,G.setAttribute("aria-label",`在${A.name}就地生成 ${T(A)} 个测试单位`),G.addEventListener("pointerdown",X=>{X.preventDefault(),X.stopPropagation(),x(A)}),E.append(z,G),c.appendChild(E)}}const C=document.createElement("div");C.className="lab-foot";const k=document.createElement("button");if(k.type="button",k.className="lab-btn",k.dataset.uiButton="",k.textContent="召回假人",k.setAttribute("aria-label","召回全部假人回到各自工位"),k.addEventListener("pointerdown",D=>{D.preventDefault(),D.stopPropagation(),_()}),C.appendChild(k),w.length>0){const D=document.createElement("button");D.type="button",D.className="lab-btn",D.dataset.uiButton="",D.dataset.clearTestUnits="",D.textContent="清除测试单位",D.setAttribute("aria-label","清除所有由地块测试按钮生成的假人与陪练"),D.addEventListener("pointerdown",F=>{F.preventDefault(),F.stopPropagation(),y()}),C.appendChild(D)}if(s){const D=document.createElement("button");D.type="button",D.className="lab-btn",D.dataset.uiButton="",D.textContent="镜头归位",D.setAttribute("aria-label","把镜头缩放恢复到默认"),D.addEventListener("pointerdown",F=>{F.preventDefault(),F.stopPropagation(),s()}),C.appendChild(D)}c.appendChild(C)}return window.addEventListener("keydown",b=>{var M,C;if(!(b.metaKey||b.ctrlKey||b.altKey))if(b.key==="["){const k=Tu(n,((M=v())==null?void 0:M.id)??l,-1);k&&p(k.id)}else if(b.key==="]"){const k=Tu(n,((C=v())==null?void 0:C.id)??l,1);k&&p(k.id)}else b.key==="\\"&&_()}),g(),{goto:p,current:v,tick:g,recall:_,spawnAt:S,clearSpawned:y,element:c}}const $c=Math.PI*2,Di={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},T_=45,A_=50;function R_(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function lo(n,t,e){const i=R_(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function P_(n,t){return Math.atan2(n,-t)*180/Math.PI}function Au(n,t){return Math.abs(((n-t)%360+540)%360-180)}function nr(n){return(n%360+360)%360}const C_={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function D_(n,t,e,i=8){const a=n.character,s=t.intents,o=Math.hypot(s.moveX,s.moveZ),r=Math.hypot(t.stickRawX,t.stickRawY),c=a.velocity,l=Math.hypot(c.x,c.z),d=o>.001?lo(s.moveX,s.moveZ,e):null,u=l>.15?lo(c.x,c.z,e):null,h=lo(Math.sin(a.facing),Math.cos(a.facing),e),f=s.aimActive&&Math.hypot(s.aimX,s.aimZ)>1e-6?lo(s.aimX,s.aimZ,e):null,m=n.targeting,v=m.hasTarget?lo(Math.sin(m.targetYaw),Math.cos(m.targetYaw),e):null,g=d!==null&&u!==null?Au(d,u):null,p=d!==null?Au(d,h):null,_=g!==null&&g>T_&&o>=.35&&l>=.4;return{inDeg:d,inLen:Math.min(1,o),rawDeg:r>.02?P_(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,r),stickHeld:t.stickHeld,moveDeg:u,speed:l,faceDeg:h,lockDeg:v,lockId:m.targetId,lockDist:m.targetDist,aimDeg:f,gapMove:g,gapFace:p,warnMove:_}}function Ru(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>A_&&(n.inLen>=.35||n.speed>=.4)}const Pu="harness.dirDebug";function L_(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const a=e.querySelector("#dirdbg-canvas"),s=e.querySelector("#dirdbg-toggle"),o={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},r=a.getContext("2d");let c=!0;if(!t)try{c=window.localStorage.getItem(Pu)!=="0"}catch{}function l(){e.classList.toggle("is-off",!c),s&&(s.textContent=c?"方向 ⌄":"方向 ▸",s.setAttribute("aria-expanded",String(c)))}l();function d(x){if(c=x,!t)try{window.localStorage.setItem(Pu,x?"1":"0")}catch{}l()}s==null||s.addEventListener("pointerdown",x=>{x.preventDefault(),x.stopPropagation(),d(!c)}),t||window.addEventListener("keydown",x=>{x.key.toLowerCase()==="v"&&!x.metaKey&&!x.ctrlKey&&d(!c)});const u=Math.min(3,Math.max(1,window.devicePixelRatio||1)),h=118;a.width=Math.round(h*u),a.height=Math.round(h*u);let f=C_,m=0,v="",g=8;function p(x){if(!r)return;const y=h,S=h,w=y/2,T=S/2,R=Math.min(y,S)/2-13;r.setTransform(u,0,0,u,0,0),r.clearRect(0,0,y,S),r.beginPath(),r.arc(w,T,R,0,$c),r.fillStyle="rgba(8, 12, 17, 0.5)",r.fill(),r.lineWidth=1,r.strokeStyle=x.warnMove?"rgba(251, 191, 36, 0.85)":Di.ring,r.stroke(),r.strokeStyle=Di.grid,r.beginPath(),r.moveTo(w-R,T),r.lineTo(w+R,T),r.moveTo(w,T-R),r.lineTo(w,T+R),r.stroke();for(let k=0;k<8;k++){const D=k*Math.PI/4,F=w+Math.sin(D)*(R-3),A=T-Math.cos(D)*(R-3),E=w+Math.sin(D)*R,z=T-Math.cos(D)*R;r.beginPath(),r.moveTo(F,A),r.lineTo(E,z),r.stroke()}const b=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;b>0&&(r.save(),r.setLineDash([2,3]),r.strokeStyle=Di.dead,r.beginPath(),r.arc(w,T,R*b,0,$c),r.stroke(),r.restore());const M=(k,D,F,A,E=!1,z=1)=>{const G=k*Math.PI/180,X=Math.sin(G),et=-Math.cos(G),ht=R*Math.max(.14,Math.min(1,D)),gt=w+X*R*.14,Lt=T+et*R*.14,Z=w+X*ht,B=T+et*ht;if(r.save(),r.globalAlpha=z,r.strokeStyle=F,r.fillStyle=F,r.lineWidth=A,r.lineCap="round",E&&r.setLineDash([3,3]),r.beginPath(),r.moveTo(gt,Lt),r.lineTo(Z,B),r.stroke(),!E&&ht>R*.3){const Y=-et,q=X,K=5.2;r.beginPath(),r.moveTo(Z+X*1.5,B+et*1.5),r.lineTo(Z-X*K+Y*K*.72,B-et*K+q*K*.72),r.lineTo(Z-X*K-Y*K*.72,B-et*K-q*K*.72),r.closePath(),r.fill()}r.restore()},C=(k,D)=>{const F=k*Math.PI/180,A=Math.sin(F),E=-Math.cos(F),z=-E,G=A,X=R+1.5,et=X+6.5;r.save(),r.fillStyle=D,r.strokeStyle=D,r.lineWidth=1,r.beginPath(),r.moveTo(w+A*et,T+E*et),r.lineTo(w+A*X+z*4,T+E*X+G*4),r.lineTo(w+A*X-z*4,T+E*X-G*4),r.closePath(),r.fill(),r.restore()};x.lockDeg!==null&&M(x.lockDeg,1,Di.lock,1,!0,.7),x.rawDeg!==null&&x.stickHeld&&M(x.rawDeg,x.rawLen,Di.raw,1,!0,.9),x.aimDeg!==null&&M(x.aimDeg,1,Di.aim,1.6,!0,.95),M(x.faceDeg,1,Di.face,1.1,!0,.55),x.moveDeg!==null&&M(x.moveDeg,x.speed/Math.max(1,g),Di.move,5.5,!1,.8),x.inDeg!==null&&M(x.inDeg,x.inLen,Di.input,2.2),C(x.faceDeg,Di.face),r.beginPath(),r.arc(w,T,2.2,0,$c),r.fillStyle="rgba(220, 235, 248, 0.85)",r.fill()}function _(x,y){const S=R=>R===null?"-":String(Math.round(nr(R)));o.in.textContent=`入 ${S(x.inDeg)}`,o.mv.textContent=`移 ${S(x.moveDeg)}`,o.fc.textContent=`面 ${S(x.faceDeg)}`;const w=R=>R===null?"-":`${Math.round(R)}°`,T=[`Δ入→移 ${w(x.gapMove)}`,`Δ入→面 ${w(x.gapFace)}`];x.speed>.05&&T.push(`v${x.speed.toFixed(1)}`),x.lockDeg!==null&&T.push(`锁#${x.lockId} ${x.lockDist.toFixed(1)}m`),x.aimDeg!==null&&T.push("拖拽瞄准"),o.gap.textContent=T.join("  "),e.classList.toggle("is-warn",x.warnMove||Ru(x,y))}return{update(x,y,S){if(!c)return;g=Math.max(1,x.config.moveSpeed*Math.max(1,x.config.sprintMultiplier));const w=D_(x,y,S,g);f=w;const T=x.combat.phase!=="idle";p(w);const R=performance.now(),b=`${w.inDeg}|${w.moveDeg}|${w.faceDeg}|${w.lockId}|${w.aimDeg}|${w.warnMove}|${w.speed.toFixed(1)}`;(R-m>90||b!==v)&&(m=R,v=b,_(w,T),e.dataset.in=w.inDeg===null?"":nr(w.inDeg).toFixed(1),e.dataset.mv=w.moveDeg===null?"":nr(w.moveDeg).toFixed(1),e.dataset.fc=nr(w.faceDeg).toFixed(1),e.dataset.warn=w.warnMove||Ru(w,T)?"1":"0")},setEnabled:d,toggle(){return d(!c),c},enabled:()=>c,last:()=>f}}const k_=6,I_=480,Cu=240,Du=128,z_=18,F_=.05,Lu=.16,U_=.02;function ku(n,t,e){if(!e)return"air";if(t<F_)return"both";const i=Math.sin(n);return i>Lu?"L":i<-Lu?"R":"both"}function Iu(n){const t=Math.PI*2;return(n%t+t)%t}function zu(n,t){const e=Math.PI*2;let i=t-n;return i-=Math.round(i/e)*e,n+i}const Fu={L:"#fbbf24",R:"#a78bfa",both:"rgba(148, 163, 184, 0.85)",air:"#38bdf8"},N_={L:"rgba(251, 191, 36, 0.13)",R:"rgba(167, 139, 250, 0.13)",both:"rgba(148, 163, 184, 0.09)",air:"rgba(56, 189, 248, 0.07)"},O_={L:"左踩",R:"右踩",both:"双踩",air:"腾空"};function B_(n,t,e,i){const a=t-n;return{t:i,speed:t,drive:t,raw:t,dv:a,accel:e>1e-4?a/e:0,busy:!1,phase:0,stance:"both",grounded:!0,moving:!1}}function H_(n,t,e,i){const s=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:s,speed:Math.min(s,Math.max(1,i))}}function G_(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function X_(n={}){const t=Math.max(1,n.windowS??k_),e=Math.max(60,n.capacity??I_),i=Math.max(1,n.speedCap??z_),a=!!(n.container&&n.toggle),s=n.container??document.createElement("div");s.id="motiondbg",n.container||(s.setAttribute("data-ui-region",""),document.body.appendChild(s));const o=['<div id="motiondbg-head"><span>速度(位移) / Δv / 相位</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="128"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");s.innerHTML=a?`<div id="motiondbg-body">${o}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${o}</div>`].join("");const r=n.toggle??s.querySelector("#motiondbg-toggle"),c=s.querySelector("#motiondbg-graph"),l=s.querySelector("#motiondbg-read"),d=s.querySelector("#motiondbg-window"),u=s.querySelector("#motiondbg-dir");d.textContent=`${t.toFixed(1)}s`;const h=c.getContext("2d"),f=Math.min(3,Math.max(1,window.devicePixelRatio||1));c.width=Math.round(Cu*f),c.height=Math.round(Du*f);const m=L_({deadZone:n.deadZone,container:u,embedded:!0});let v=!1;function g(M){v=M,s.classList.toggle("is-off",!M),!a&&r&&(r.textContent=M?"手感 ⌄":"手感 ▸",r.setAttribute("aria-expanded",String(M)),r.setAttribute("aria-label",M?"收起手感调试面板":"展开手感调试面板"))}g(!1),a||(r==null||r.addEventListener("pointerdown",M=>{M.preventDefault(),M.stopPropagation(),g(!v)}),window.addEventListener("keydown",M=>{M.key.toLowerCase()==="v"&&!M.metaKey&&!M.ctrlKey&&g(!v)}));const p=[];let _=0,x=null,y=0,S=!1,w=-1,T={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1,phase:0,stance:"both"};function R(M){const C=M-t;let k=0;for(;k<p.length&&p[k].t<C;)k++;return p.slice(k)}function b(M,C){if(!h)return;const k=Cu,D=Du;h.setTransform(f,0,0,f,0,0),h.clearRect(0,0,k,D),h.fillStyle="rgba(8, 12, 17, 0.55)",h.fillRect(0,0,k,D);const F=4,A=4,E=k-F-A,z=9,G=44,X=58,et=20,ht=84,gt=38,Lt=C-t,Z=J=>F+Math.max(0,Math.min(1,(J-Lt)/t))*E;for(let J=0;J<M.length;J++){if(!M[J].busy)continue;const V=Z(M[J].t),O=J+1<M.length?Z(M[J+1].t):V+2;h.fillStyle="rgba(251, 146, 60, 0.13)",h.fillRect(V,z,Math.max(2,O-V),G)}h.strokeStyle="rgba(150, 190, 220, 0.14)",h.lineWidth=1,h.beginPath();for(const J of[z,z+G/2,z+G])h.moveTo(F,J),h.lineTo(k-A,J);h.moveTo(F,X+et/2),h.lineTo(k-A,X+et/2);for(const J of[ht,ht+gt/2,ht+gt])h.moveTo(F,J),h.lineTo(k-A,J);h.stroke();const Y=Math.max(1,...M.map(J=>J.speed),...M.map(J=>J.drive))*1.15,q=J=>z+G-J/Y*G;if(M.length>1){h.beginPath(),h.moveTo(Z(M[0].t),q(M[0].speed));for(let J=1;J<M.length;J++)h.lineTo(Z(M[J].t),q(M[J].speed));h.strokeStyle="#38bdf8",h.lineWidth=1.8,h.lineJoin="round",h.stroke(),h.lineTo(Z(M[M.length-1].t),z+G),h.lineTo(Z(M[0].t),z+G),h.closePath(),h.fillStyle="rgba(56, 189, 248, 0.14)",h.fill(),h.beginPath(),h.moveTo(Z(M[0].t),q(M[0].drive));for(let J=1;J<M.length;J++)h.lineTo(Z(M[J].t),q(M[J].drive));h.setLineDash([3,3]),h.strokeStyle="rgba(190, 205, 220, 0.6)",h.lineWidth=1.2,h.stroke(),h.setLineDash([])}let K=.02;for(const J of M)K=Math.max(K,Math.abs(J.dv));K*=1.1;const st=X+et/2,Tt=et/2;for(const J of M){const V=Math.min(Tt,Math.abs(J.dv)/K*Tt);h.fillStyle=J.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",h.fillRect(Z(J.t)-.7,J.dv>=0?st-V:st,1.4,Math.max(.5,V))}const Gt=J=>ht+gt/2-J*(gt/2-1);for(let J=0;J<M.length;J++){const V=M[J].stance;if(V==="air")continue;const O=Z(M[J].t),Pt=J+1<M.length?Z(M[J+1].t):O+2;h.fillStyle=N_[V],h.fillRect(O,ht,Math.max(1,Pt-O),gt)}if(M.length>1){let J=Z(M[0].t),V=Gt(Math.sin(M[0].phase));for(let Pt=1;Pt<M.length;Pt++){const Et=M[Pt-1],lt=M[Pt],vt=Z(Et.t),ft=Z(lt.t),Rt=zu(Et.phase,lt.phase),L=Math.max(1,Math.min(16,Math.round((ft-vt)/2)));for(let P=1;P<=L;P++){const Q=P/L,mt=Et.phase+(Rt-Et.phase)*Q,ot=vt+(ft-vt)*Q,dt=Gt(Math.sin(mt)),zt=P===L?lt.stance:ku(mt,Et.moving?1:0,Et.grounded);h.beginPath(),h.moveTo(J,V),h.lineTo(ot,dt),h.strokeStyle=Fu[zt],h.lineWidth=1.7,h.lineJoin="round",h.stroke(),J=ot,V=dt}}const O=M[M.length-1];h.beginPath(),h.arc(Z(O.t)-1.5,Gt(Math.sin(O.phase)),2.1,0,Math.PI*2),h.fillStyle=Fu[O.stance],h.fill()}h.font="9px ui-monospace, monospace",h.fillStyle="rgba(190, 214, 234, 0.55)",h.textAlign="left",h.fillText(Y.toFixed(1),F+2,z+8),h.fillText("v",F+2,z+G-2),h.fillText("Δv",F+2,X+9),h.fillStyle="rgba(251, 191, 36, 0.75)",h.fillText("L",F+2,ht+8),h.fillStyle="rgba(167, 139, 250, 0.75)",h.fillText("R",F+2,ht+gt-2),h.textAlign="right",h.fillStyle="rgba(190, 214, 234, 0.55)",h.fillText("0",k-A-2,z+G-2),h.textAlign="left"}return{dirDebug:m,update(M,C,k){var Z;const D=performance.now()/1e3,F=w<0?1/60:Math.max(1e-4,Math.min(.25,D-w));w=D;const A=M.character,E={x:A.position.x,z:A.position.z},z=Math.hypot(A.velocity.x,A.velocity.z),{speed:G,raw:X}=x?H_(x,E,F,i):{speed:0,raw:0},et=B_(_,G,F,D);et.drive=z,et.raw=X,et.busy=G_(M);const ht=((Z=n.phaseSource)==null?void 0:Z.call(n))??A.gaitPhase;et.phase=ht,et.grounded=A.grounded,et.moving=S&&Math.abs(zu(y,ht)-y)>U_,y=ht,S=!0,et.stance=ku(ht,et.moving?1:0,A.grounded),x=E,_=G,p.push(et),p.length>e&&p.shift();const gt=R(D);let Lt=0;for(const B of gt)Lt=Math.max(Lt,B.speed);if(T={speed:G,drive:z,raw:X,dv:et.dv,accel:et.accel,peak:Lt,samples:gt.length,windowS:t,busy:et.busy,phase:Iu(ht),stance:et.stance},m.update(M,C,k),v){b(gt,D);const B=et.dv>=0?"+":"";l.textContent=`v ${G.toFixed(2)} · 驱 ${z.toFixed(2)} · 峰 ${Lt.toFixed(2)} · Δv ${B}${et.dv.toFixed(3)} · ${gt.length} 帧
φ ${Iu(ht).toFixed(2)} · ${O_[et.stance]}`}},setEnabled:g,toggle(){return g(!v),v},enabled:()=>v,last:()=>({...T}),samples:()=>R(performance.now()/1e3).map(M=>({...M}))}}const V_=["剑盾","双剑","大剑","法杖","弓"],W_={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击",spar:"陪练"};function Y_(n){return{update(t,e,i,a,s,o,r=!1){const c=t.character,l=c.position,d=c.velocity,u=t.combat,h=t.events.length>0?t.events[t.events.length-1]:null,f=J=>J.toFixed(2),m=J=>(J*180/Math.PI).toFixed(0),v=V_[_a.indexOf(u.weapon)]??u.weapon,g=Math.round(u.charge*10),p="|".repeat(g)+".".repeat(10-g),_=t.dash,x=_.phase==="active"&&_.duration>0?(1-_.timer/_.duration)*100:0,y=_.phase==="active"?`${_.kind}@${x.toFixed(0)}%`:`${_.kind} cd${f(_.cooldown)}`,S=a.intents.aimActive?`(${f(a.intents.aimX)},${f(a.intents.aimZ)})`:"-",w=d.x*Math.sin(c.bodyYaw)+d.z*Math.cos(c.bodyYaw),T=d.x*Math.cos(c.bodyYaw)-d.z*Math.sin(c.bodyYaw),R=Math.abs(w)+Math.abs(T)+1e-6,b=Math.round(Math.abs(T)/R*100),M=`strafe ${b}%${w<-.05?" back":""}`,C=t.camera,k=`threat ${(C.threat*100).toFixed(0)}%  dist×${f(C.distanceScale)}  off (${f(C.offsetX)},${f(C.offsetZ)})  pitch +${f(C.pitchDelta)}°  n=${C.threatCount}`,D=o?f(o.attackBlend):"-",F=o==null?void 0:o.attackWeights,A=F?`gw ${f(F.gaitScale)}  lw ${f(F.attackLegWeight)}  spd ${f(F.driveSpeed)}`:"-",E=F?`${f(F.gaitScale)}/${f(F.attackLegWeight)}`:"-",z=o?`${o.landing.kind} ${f(o.landing.pulse)} t${f(o.landing.remaining)} vy${f(o.landing.impactVy)}`:"-",G=o?`${o.landing.kind}/${f(o.landing.pulse)}`:"-",X=(o==null?void 0:o.zoom)!==void 0?`zoom ×${f(o.zoom)}`:"-",et=o==null?void 0:o.hurt,ht=et?`hurt ${t.playerHurt.type}  部位h${f(et.hitHeight)}  脉冲p${f(et.pulse)}  上身${f(et.upperShift)}  重心${f(et.comShift)}  后坐${f(et.pelvisBack)}  屈膝${f(et.knee)}`:"-",gt=et?`${f(et.hitHeight)}/${f(et.pulse)}/${f(et.knee)}`:"-",Lt=o==null?void 0:o.ik,Z=Lt?`${Lt.active?"on":"off"} w${f(Lt.weight)} e${f(Lt.maxError)}`:"-",B=t.playerLink,Y=`link ${B.kind||"-"}  ${B.phase}  prog ${f(B.progress)}  win ${f(B.linkWindow)}s  cd ${f(B.cooldown)}s  hits ${B.hitIds.length}  travel ${f(B.travelled)}/${f(B.travel)}m  id ${B.id}`,q=`${B.phase}/${B.kind||"-"}/w${f(B.linkWindow)}`,K=a.lastGesture,st=K?`${K.button} ${K.kind} ${K.heldMs.toFixed(0)}ms d${K.distance.toFixed(0)}px ${K.angleDeg.toFixed(0)}° taps${K.taps}`:"-",Tt=t.dummies.map(J=>`${J.id}:${W_[J.mode]}`).join("  ");if(r){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${v} ${u.phase} · lk ${B.phase}${B.kind?`/${B.kind}`:""} w${f(B.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${f(l.x)},${f(l.y)},${f(l.z)})  vel (${f(d.x)},${f(d.y)},${f(d.z)})`,`face ${m(c.facing)}  body ${m(c.bodyYaw)}  head ${m(c.headYaw)}  move ${m(c.moveYaw)}  st${b}%  stick(${f(a.stickX)},${f(a.stickY)}) ${a.source}  str${f(c.stride)}`,`weapon ${v}  ${u.phase}  combo ${u.comboIndex}/3  atk ${f(u.attackProgress)}  dash ${y}  ab ${D}  gw/lw ${E}  land ${G}  ik ${Z}`,`aim ${S}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${f(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${gt}`,`dummies ${Tt}  atkCount ${t.dummyAttackCount}  cam ${(C.threat*100).toFixed(0)}% ×${f(C.distanceScale)}  ${X}  lk ${q}`,`event ${h?`${h.type} ${f(h.value)}`:"-"}  scale ${f(s.timeScale)}${s.paused?" [P]":""}  g ${st}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${f(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${f(l.x)}, ${f(l.y)}, ${f(l.z)})`,`vel  (${f(d.x)}, ${f(d.y)}, ${f(d.z)})`,`grounded ${c.grounded?"Y":"N"}   sprint ${c.sprinting?"Y":"N"}   facing ${m(c.facing)}deg   atkBlend ${D}   ${A}   land ${z}`,ht,`ik ${Z}  clamped ${Lt?Lt.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${m(c.facing)}  body ${m(c.bodyYaw)}  head ${m(c.headYaw)}  move ${m(c.moveYaw)}  (head-body ${m(c.headYaw-c.bodyYaw)})  ${M}`,`move (${f(a.intents.moveX)}, ${f(a.intents.moveZ)})  stick (${f(a.stickX)}, ${f(a.stickY)})  ${a.source}  aim ${S}`,`weapon ${v}  phase ${u.phase}  combo ${u.comboIndex}/3  atk ${f(u.attackProgress)}${u.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${_.kind}  phase ${_.phase}  prog ${x.toFixed(0)}%  cd ${f(_.cooldown)}s  id ${_.id}  from (${f(_.fromX)},${f(_.fromZ)}) → to (${f(_.toX)},${f(_.toZ)})`,Y,`camera ${k}  ${X}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${f(t.targeting.targetDist)}m  face ${m(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${p}] ${(u.charge*100).toFixed(0)}%  charging ${u.charging?"Y":"N"}`,`dummies ${Tt}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${f(t.impulse.x)}, ${f(t.impulse.z)})`,`event ${h?`${h.type} ${f(h.value)}`:"-"}   scale ${f(s.timeScale)}${s.paused?" [PAUSED]":""}   gesture ${st}`].join(`
`)}}}const ir=["lab","hud","motion","debug"],Uu={lab:{short:"工位",full:"测试工位"},hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}},Nu={lab:{toggle:"lab-toggle",panel:"lab-panel"},hud:{toggle:"hud-toggle",panel:"hud"},motion:{toggle:"motiondbg-toggle",panel:"motiondbg"},debug:{toggle:"debug-toggle",panel:"debug-panel"}};function $_(n){var c;const t=Object.fromEntries(ir.map(l=>[l,document.getElementById(Nu[l].toggle)])),e=Object.fromEntries(ir.map(l=>[l,document.getElementById(Nu[l].panel)]));let i={},a=null;function s(){var l,d,u;for(const h of ir){const f=a===h,m=t[h],v=e[h];m&&(m.setAttribute("aria-expanded",String(f)),m.textContent=`${Uu[h].short} ${f?"▾":"▸"}`,m.setAttribute("aria-label",`${f?"收起":"展开"}${Uu[h].full}`)),v&&v.classList.toggle("is-open",f)}n.classList.toggle("is-compact",a!=="hud"),(l=i.motion)==null||l.setEnabled(a==="motion"),a==="debug"?(d=i.debug)==null||d.open():(u=i.debug)==null||u.close()}function o(l){a=a===l?null:l,s()}function r(){a!==null&&(a=null,s())}for(const l of ir)(c=t[l])==null||c.addEventListener("pointerdown",d=>{d.preventDefault(),d.stopPropagation(),o(l)});return window.addEventListener("keydown",l=>{l.key.toLowerCase()==="v"&&!l.metaKey&&!l.ctrlKey&&o("motion")}),s(),{hudCompact:()=>a!=="hud",register(l){i=l,s()},toggle:o,closeAll:r,isOpen:l=>a===l}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const eh="170",Z_=0,Ou=1,j_=2,rm=1,cm=2,qi=3,ba=0,jn=1,je=2,va=0,zs=1,Ji=2,Bu=3,Hu=4,q_=5,Xa=100,K_=101,J_=102,Q_=103,tb=104,eb=200,nb=201,ib=202,ab=203,ql=204,Kl=205,sb=206,ob=207,rb=208,cb=209,lb=210,db=211,hb=212,ub=213,fb=214,Jl=0,Ql=1,td=2,Xs=3,ed=4,nd=5,id=6,ad=7,nh=0,pb=1,mb=2,ya=0,gb=1,xb=2,vb=3,yb=4,Mb=5,_b=6,bb=7,lm=300,Vs=301,Ws=302,sd=303,od=304,yc=306,rd=1e3,Wa=1001,cd=1002,oi=1003,Sb=1004,ar=1005,Ii=1006,Zc=1007,Ya=1008,na=1009,dm=1010,hm=1011,Bo=1012,ih=1013,ja=1014,zi=1015,$o=1016,ah=1017,sh=1018,Ys=1020,um=35902,fm=1021,pm=1022,Si=1023,mm=1024,gm=1025,Fs=1026,$s=1027,oh=1028,rh=1029,xm=1030,ch=1031,lh=1033,Hr=33776,Gr=33777,Xr=33778,Vr=33779,ld=35840,dd=35841,hd=35842,ud=35843,fd=36196,pd=37492,md=37496,gd=37808,xd=37809,vd=37810,yd=37811,Md=37812,_d=37813,bd=37814,Sd=37815,wd=37816,Ed=37817,Td=37818,Ad=37819,Rd=37820,Pd=37821,Wr=36492,Cd=36494,Dd=36495,vm=36283,Ld=36284,kd=36285,Id=36286,wb=3200,Eb=3201,ym=0,Tb=1,fa="",Hn="srgb",js="srgb-linear",Mc="linear",Ne="srgb",hs=7680,Gu=519,Ab=512,Rb=513,Pb=514,Mm=515,Cb=516,Db=517,Lb=518,kb=519,zd=35044,Ro=35048,Xu="300 es",ta=2e3,oc=2001;class qs{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const a=this._listeners[t];if(a!==void 0){const s=a.indexOf(e);s!==-1&&a.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const a=i.slice(0);for(let s=0,o=a.length;s<o;s++)a[s].call(this,t);t.target=null}}}const Ln=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Vu=1234567;const Us=Math.PI/180,Ho=180/Math.PI;function Ui(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ln[n&255]+Ln[n>>8&255]+Ln[n>>16&255]+Ln[n>>24&255]+"-"+Ln[t&255]+Ln[t>>8&255]+"-"+Ln[t>>16&15|64]+Ln[t>>24&255]+"-"+Ln[e&63|128]+Ln[e>>8&255]+"-"+Ln[e>>16&255]+Ln[e>>24&255]+Ln[i&255]+Ln[i>>8&255]+Ln[i>>16&255]+Ln[i>>24&255]).toLowerCase()}function An(n,t,e){return Math.max(t,Math.min(e,n))}function dh(n,t){return(n%t+t)%t}function Ib(n,t,e,i,a){return i+(n-t)*(a-i)/(e-t)}function zb(n,t,e){return n!==t?(e-n)/(t-n):0}function Po(n,t,e){return(1-e)*n+e*t}function Fb(n,t,e,i){return Po(n,t,1-Math.exp(-e*i))}function Ub(n,t=1){return t-Math.abs(dh(n,t*2)-t)}function Nb(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function Ob(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function Bb(n,t){return n+Math.floor(Math.random()*(t-n+1))}function Hb(n,t){return n+Math.random()*(t-n)}function Gb(n){return n*(.5-Math.random())}function Xb(n){n!==void 0&&(Vu=n);let t=Vu+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Vb(n){return n*Us}function Wb(n){return n*Ho}function Yb(n){return(n&n-1)===0&&n!==0}function $b(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Zb(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function jb(n,t,e,i,a){const s=Math.cos,o=Math.sin,r=s(e/2),c=o(e/2),l=s((t+i)/2),d=o((t+i)/2),u=s((t-i)/2),h=o((t-i)/2),f=s((i-t)/2),m=o((i-t)/2);switch(a){case"XYX":n.set(r*d,c*u,c*h,r*l);break;case"YZY":n.set(c*h,r*d,c*u,r*l);break;case"ZXZ":n.set(c*u,c*h,r*d,r*l);break;case"XZX":n.set(r*d,c*m,c*f,r*l);break;case"YXY":n.set(c*f,r*d,c*m,r*l);break;case"ZYZ":n.set(c*m,c*f,r*d,r*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+a)}}function bi(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function ze(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Wu={DEG2RAD:Us,RAD2DEG:Ho,generateUUID:Ui,clamp:An,euclideanModulo:dh,mapLinear:Ib,inverseLerp:zb,lerp:Po,damp:Fb,pingpong:Ub,smoothstep:Nb,smootherstep:Ob,randInt:Bb,randFloat:Hb,randFloatSpread:Gb,seededRandom:Xb,degToRad:Vb,radToDeg:Wb,isPowerOfTwo:Yb,ceilPowerOfTwo:$b,floorPowerOfTwo:Zb,setQuaternionFromProperEuler:jb,normalize:ze,denormalize:bi};class Wt{constructor(t=0,e=0){Wt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6],this.y=a[1]*e+a[4]*i+a[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(An(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),a=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*i-o*a+t.x,this.y=s*a+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Me{constructor(t,e,i,a,s,o,r,c,l){Me.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,c,l)}set(t,e,i,a,s,o,r,c,l){const d=this.elements;return d[0]=t,d[1]=a,d[2]=r,d[3]=e,d[4]=s,d[5]=c,d[6]=i,d[7]=o,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[3],c=i[6],l=i[1],d=i[4],u=i[7],h=i[2],f=i[5],m=i[8],v=a[0],g=a[3],p=a[6],_=a[1],x=a[4],y=a[7],S=a[2],w=a[5],T=a[8];return s[0]=o*v+r*_+c*S,s[3]=o*g+r*x+c*w,s[6]=o*p+r*y+c*T,s[1]=l*v+d*_+u*S,s[4]=l*g+d*x+u*w,s[7]=l*p+d*y+u*T,s[2]=h*v+f*_+m*S,s[5]=h*g+f*x+m*w,s[8]=h*p+f*y+m*T,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],c=t[6],l=t[7],d=t[8];return e*o*d-e*r*l-i*s*d+i*r*c+a*s*l-a*o*c}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],c=t[6],l=t[7],d=t[8],u=d*o-r*l,h=r*c-d*s,f=l*s-o*c,m=e*u+i*h+a*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/m;return t[0]=u*v,t[1]=(a*l-d*i)*v,t[2]=(r*i-a*o)*v,t[3]=h*v,t[4]=(d*e-a*c)*v,t[5]=(a*s-r*e)*v,t[6]=f*v,t[7]=(i*c-l*e)*v,t[8]=(o*e-i*s)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,a,s,o,r){const c=Math.cos(s),l=Math.sin(s);return this.set(i*c,i*l,-i*(c*o+l*r)+o+t,-a*l,a*c,-a*(-l*o+c*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(jc.makeScale(t,e)),this}rotate(t){return this.premultiply(jc.makeRotation(-t)),this}translate(t,e){return this.premultiply(jc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<9;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const jc=new Me;function _m(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function rc(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function qb(){const n=rc("canvas");return n.style.display="block",n}const Yu={};function bo(n){n in Yu||(Yu[n]=!0,console.warn(n))}function Kb(n,t,e){return new Promise(function(i,a){function s(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:a();break;case n.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}function Jb(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Qb(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Te={enabled:!0,workingColorSpace:js,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===Ne&&(n.r=ea(n.r),n.g=ea(n.g),n.b=ea(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===Ne&&(n.r=Ns(n.r),n.g=Ns(n.g),n.b=Ns(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===fa?Mc:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function ea(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Ns(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const $u=[.64,.33,.3,.6,.15,.06],Zu=[.2126,.7152,.0722],ju=[.3127,.329],qu=new Me().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ku=new Me().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Te.define({[js]:{primaries:$u,whitePoint:ju,transfer:Mc,toXYZ:qu,fromXYZ:Ku,luminanceCoefficients:Zu,workingColorSpaceConfig:{unpackColorSpace:Hn},outputColorSpaceConfig:{drawingBufferColorSpace:Hn}},[Hn]:{primaries:$u,whitePoint:ju,transfer:Ne,toXYZ:qu,fromXYZ:Ku,luminanceCoefficients:Zu,outputColorSpaceConfig:{drawingBufferColorSpace:Hn}}});let us;class t1{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{us===void 0&&(us=rc("canvas")),us.width=t.width,us.height=t.height;const i=us.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=us}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=rc("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const a=i.getImageData(0,0,t.width,t.height),s=a.data;for(let o=0;o<s.length;o++)s[o]=ea(s[o]/255)*255;return i.putImageData(a,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(ea(e[i]/255)*255):e[i]=ea(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let e1=0;class bm{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:e1++}),this.uuid=Ui(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},a=this.data;if(a!==null){let s;if(Array.isArray(a)){s=[];for(let o=0,r=a.length;o<r;o++)a[o].isDataTexture?s.push(qc(a[o].image)):s.push(qc(a[o]))}else s=qc(a);i.url=s}return e||(t.images[this.uuid]=i),i}}function qc(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?t1.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let n1=0;class Fn extends qs{constructor(t=Fn.DEFAULT_IMAGE,e=Fn.DEFAULT_MAPPING,i=Wa,a=Wa,s=Ii,o=Ya,r=Si,c=na,l=Fn.DEFAULT_ANISOTROPY,d=fa){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:n1++}),this.uuid=Ui(),this.name="",this.source=new bm(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=s,this.minFilter=o,this.anisotropy=l,this.format=r,this.internalFormat=null,this.type=c,this.offset=new Wt(0,0),this.repeat=new Wt(1,1),this.center=new Wt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Me,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==lm)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case rd:t.x=t.x-Math.floor(t.x);break;case Wa:t.x=t.x<0?0:1;break;case cd:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case rd:t.y=t.y-Math.floor(t.y);break;case Wa:t.y=t.y<0?0:1;break;case cd:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Fn.DEFAULT_IMAGE=null;Fn.DEFAULT_MAPPING=lm;Fn.DEFAULT_ANISOTROPY=1;class sn{constructor(t=0,e=0,i=0,a=1){sn.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=a}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,a){return this.x=t,this.y=e,this.z=i,this.w=a,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*a+o[12]*s,this.y=o[1]*e+o[5]*i+o[9]*a+o[13]*s,this.z=o[2]*e+o[6]*i+o[10]*a+o[14]*s,this.w=o[3]*e+o[7]*i+o[11]*a+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,a,s;const c=t.elements,l=c[0],d=c[4],u=c[8],h=c[1],f=c[5],m=c[9],v=c[2],g=c[6],p=c[10];if(Math.abs(d-h)<.01&&Math.abs(u-v)<.01&&Math.abs(m-g)<.01){if(Math.abs(d+h)<.1&&Math.abs(u+v)<.1&&Math.abs(m+g)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(l+1)/2,y=(f+1)/2,S=(p+1)/2,w=(d+h)/4,T=(u+v)/4,R=(m+g)/4;return x>y&&x>S?x<.01?(i=0,a=.707106781,s=.707106781):(i=Math.sqrt(x),a=w/i,s=T/i):y>S?y<.01?(i=.707106781,a=0,s=.707106781):(a=Math.sqrt(y),i=w/a,s=R/a):S<.01?(i=.707106781,a=.707106781,s=0):(s=Math.sqrt(S),i=T/s,a=R/s),this.set(i,a,s,e),this}let _=Math.sqrt((g-m)*(g-m)+(u-v)*(u-v)+(h-d)*(h-d));return Math.abs(_)<.001&&(_=1),this.x=(g-m)/_,this.y=(u-v)/_,this.z=(h-d)/_,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class i1 extends qs{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new sn(0,0,t,e),this.scissorTest=!1,this.viewport=new sn(0,0,t,e);const a={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ii,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new Fn(a,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let r=0;r<o;r++)this.textures[r]=s.clone(),this.textures[r].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let a=0,s=this.textures.length;a<s;a++)this.textures[a].image.width=t,this.textures[a].image.height=e,this.textures[a].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,a=t.textures.length;i<a;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new bm(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class qa extends i1{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class Sm extends Fn{constructor(t=null,e=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=oi,this.minFilter=oi,this.wrapR=Wa,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class a1 extends Fn{constructor(t=null,e=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=oi,this.minFilter=oi,this.wrapR=Wa,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ma{constructor(t=0,e=0,i=0,a=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=a}static slerpFlat(t,e,i,a,s,o,r){let c=i[a+0],l=i[a+1],d=i[a+2],u=i[a+3];const h=s[o+0],f=s[o+1],m=s[o+2],v=s[o+3];if(r===0){t[e+0]=c,t[e+1]=l,t[e+2]=d,t[e+3]=u;return}if(r===1){t[e+0]=h,t[e+1]=f,t[e+2]=m,t[e+3]=v;return}if(u!==v||c!==h||l!==f||d!==m){let g=1-r;const p=c*h+l*f+d*m+u*v,_=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const S=Math.sqrt(x),w=Math.atan2(S,p*_);g=Math.sin(g*w)/S,r=Math.sin(r*w)/S}const y=r*_;if(c=c*g+h*y,l=l*g+f*y,d=d*g+m*y,u=u*g+v*y,g===1-r){const S=1/Math.sqrt(c*c+l*l+d*d+u*u);c*=S,l*=S,d*=S,u*=S}}t[e]=c,t[e+1]=l,t[e+2]=d,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,a,s,o){const r=i[a],c=i[a+1],l=i[a+2],d=i[a+3],u=s[o],h=s[o+1],f=s[o+2],m=s[o+3];return t[e]=r*m+d*u+c*f-l*h,t[e+1]=c*m+d*h+l*u-r*f,t[e+2]=l*m+d*f+r*h-c*u,t[e+3]=d*m-r*u-c*h-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,a){return this._x=t,this._y=e,this._z=i,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,a=t._y,s=t._z,o=t._order,r=Math.cos,c=Math.sin,l=r(i/2),d=r(a/2),u=r(s/2),h=c(i/2),f=c(a/2),m=c(s/2);switch(o){case"XYZ":this._x=h*d*u+l*f*m,this._y=l*f*u-h*d*m,this._z=l*d*m+h*f*u,this._w=l*d*u-h*f*m;break;case"YXZ":this._x=h*d*u+l*f*m,this._y=l*f*u-h*d*m,this._z=l*d*m-h*f*u,this._w=l*d*u+h*f*m;break;case"ZXY":this._x=h*d*u-l*f*m,this._y=l*f*u+h*d*m,this._z=l*d*m+h*f*u,this._w=l*d*u-h*f*m;break;case"ZYX":this._x=h*d*u-l*f*m,this._y=l*f*u+h*d*m,this._z=l*d*m-h*f*u,this._w=l*d*u+h*f*m;break;case"YZX":this._x=h*d*u+l*f*m,this._y=l*f*u+h*d*m,this._z=l*d*m-h*f*u,this._w=l*d*u-h*f*m;break;case"XZY":this._x=h*d*u-l*f*m,this._y=l*f*u-h*d*m,this._z=l*d*m+h*f*u,this._w=l*d*u+h*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,a=Math.sin(i);return this._x=t.x*a,this._y=t.y*a,this._z=t.z*a,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],a=e[4],s=e[8],o=e[1],r=e[5],c=e[9],l=e[2],d=e[6],u=e[10],h=i+r+u;if(h>0){const f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(d-c)*f,this._y=(s-l)*f,this._z=(o-a)*f}else if(i>r&&i>u){const f=2*Math.sqrt(1+i-r-u);this._w=(d-c)/f,this._x=.25*f,this._y=(a+o)/f,this._z=(s+l)/f}else if(r>u){const f=2*Math.sqrt(1+r-i-u);this._w=(s-l)/f,this._x=(a+o)/f,this._y=.25*f,this._z=(c+d)/f}else{const f=2*Math.sqrt(1+u-i-r);this._w=(o-a)/f,this._x=(s+l)/f,this._y=(c+d)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(An(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const a=Math.min(1,e/i);return this.slerp(t,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,a=t._y,s=t._z,o=t._w,r=e._x,c=e._y,l=e._z,d=e._w;return this._x=i*d+o*r+a*l-s*c,this._y=a*d+o*c+s*r-i*l,this._z=s*d+o*l+i*c-a*r,this._w=o*d-i*r-a*c-s*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,a=this._y,s=this._z,o=this._w;let r=o*t._w+i*t._x+a*t._y+s*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=o,this._x=i,this._y=a,this._z=s,this;const c=1-r*r;if(c<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*i+e*this._x,this._y=f*a+e*this._y,this._z=f*s+e*this._z,this.normalize(),this}const l=Math.sqrt(c),d=Math.atan2(l,r),u=Math.sin((1-e)*d)/l,h=Math.sin(e*d)/l;return this._w=o*u+this._w*h,this._x=i*u+this._x*h,this._y=a*u+this._y*h,this._z=s*u+this._z*h,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),a=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(a*Math.sin(t),a*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class W{constructor(t=0,e=0,i=0){W.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Ju.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Ju.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*a,this.y=s[1]*e+s[4]*i+s[7]*a,this.z=s[2]*e+s[5]*i+s[8]*a,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=t.elements,o=1/(s[3]*e+s[7]*i+s[11]*a+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*a+s[12])*o,this.y=(s[1]*e+s[5]*i+s[9]*a+s[13])*o,this.z=(s[2]*e+s[6]*i+s[10]*a+s[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,a=this.z,s=t.x,o=t.y,r=t.z,c=t.w,l=2*(o*a-r*i),d=2*(r*e-s*a),u=2*(s*i-o*e);return this.x=e+c*l+o*u-r*d,this.y=i+c*d+r*l-s*u,this.z=a+c*u+s*d-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*a,this.y=s[1]*e+s[5]*i+s[9]*a,this.z=s[2]*e+s[6]*i+s[10]*a,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,a=t.y,s=t.z,o=e.x,r=e.y,c=e.z;return this.x=a*c-s*r,this.y=s*o-i*c,this.z=i*r-a*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Kc.copy(this).projectOnVector(t),this.sub(Kc)}reflect(t){return this.sub(Kc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(An(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,a=this.z-t.z;return e*e+i*i+a*a}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const a=Math.sin(e)*t;return this.x=a*Math.sin(i),this.y=Math.cos(e)*t,this.z=a*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),a=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=a,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Kc=new W,Ju=new Ma;class Ja{constructor(t=new W(1/0,1/0,1/0),e=new W(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(yi.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(yi.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=yi.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,r=s.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,yi):yi.fromBufferAttribute(s,o),yi.applyMatrix4(t.matrixWorld),this.expandByPoint(yi);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),sr.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),sr.copy(i.boundingBox)),sr.applyMatrix4(t.matrixWorld),this.union(sr)}const a=t.children;for(let s=0,o=a.length;s<o;s++)this.expandByObject(a[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,yi),yi.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ho),or.subVectors(this.max,ho),fs.subVectors(t.a,ho),ps.subVectors(t.b,ho),ms.subVectors(t.c,ho),oa.subVectors(ps,fs),ra.subVectors(ms,ps),Ca.subVectors(fs,ms);let e=[0,-oa.z,oa.y,0,-ra.z,ra.y,0,-Ca.z,Ca.y,oa.z,0,-oa.x,ra.z,0,-ra.x,Ca.z,0,-Ca.x,-oa.y,oa.x,0,-ra.y,ra.x,0,-Ca.y,Ca.x,0];return!Jc(e,fs,ps,ms,or)||(e=[1,0,0,0,1,0,0,0,1],!Jc(e,fs,ps,ms,or))?!1:(rr.crossVectors(oa,ra),e=[rr.x,rr.y,rr.z],Jc(e,fs,ps,ms,or))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,yi).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(yi).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Vi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Vi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Vi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Vi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Vi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Vi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Vi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Vi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Vi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Vi=[new W,new W,new W,new W,new W,new W,new W,new W],yi=new W,sr=new Ja,fs=new W,ps=new W,ms=new W,oa=new W,ra=new W,Ca=new W,ho=new W,or=new W,rr=new W,Da=new W;function Jc(n,t,e,i,a){for(let s=0,o=n.length-3;s<=o;s+=3){Da.fromArray(n,s);const r=a.x*Math.abs(Da.x)+a.y*Math.abs(Da.y)+a.z*Math.abs(Da.z),c=t.dot(Da),l=e.dot(Da),d=i.dot(Da);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>r)return!1}return!0}const s1=new Ja,uo=new W,Qc=new W;class Ks{constructor(t=new W,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):s1.setFromPoints(t).getCenter(i);let a=0;for(let s=0,o=t.length;s<o;s++)a=Math.max(a,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(a),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;uo.subVectors(t,this.center);const e=uo.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),a=(i-this.radius)*.5;this.center.addScaledVector(uo,a/i),this.radius+=a}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Qc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(uo.copy(t.center).add(Qc)),this.expandByPoint(uo.copy(t.center).sub(Qc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Wi=new W,tl=new W,cr=new W,ca=new W,el=new W,lr=new W,nl=new W;class hh{constructor(t=new W,e=new W(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Wi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Wi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Wi.copy(this.origin).addScaledVector(this.direction,e),Wi.distanceToSquared(t))}distanceSqToSegment(t,e,i,a){tl.copy(t).add(e).multiplyScalar(.5),cr.copy(e).sub(t).normalize(),ca.copy(this.origin).sub(tl);const s=t.distanceTo(e)*.5,o=-this.direction.dot(cr),r=ca.dot(this.direction),c=-ca.dot(cr),l=ca.lengthSq(),d=Math.abs(1-o*o);let u,h,f,m;if(d>0)if(u=o*c-r,h=o*r-c,m=s*d,u>=0)if(h>=-m)if(h<=m){const v=1/d;u*=v,h*=v,f=u*(u+o*h+2*r)+h*(o*u+h+2*c)+l}else h=s,u=Math.max(0,-(o*h+r)),f=-u*u+h*(h+2*c)+l;else h=-s,u=Math.max(0,-(o*h+r)),f=-u*u+h*(h+2*c)+l;else h<=-m?(u=Math.max(0,-(-o*s+r)),h=u>0?-s:Math.min(Math.max(-s,-c),s),f=-u*u+h*(h+2*c)+l):h<=m?(u=0,h=Math.min(Math.max(-s,-c),s),f=h*(h+2*c)+l):(u=Math.max(0,-(o*s+r)),h=u>0?s:Math.min(Math.max(-s,-c),s),f=-u*u+h*(h+2*c)+l);else h=o>0?-s:s,u=Math.max(0,-(o*h+r)),f=-u*u+h*(h+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,u),a&&a.copy(tl).addScaledVector(cr,h),f}intersectSphere(t,e){Wi.subVectors(t.center,this.origin);const i=Wi.dot(this.direction),a=Wi.dot(Wi)-i*i,s=t.radius*t.radius;if(a>s)return null;const o=Math.sqrt(s-a),r=i-o,c=i+o;return c<0?null:r<0?this.at(c,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,a,s,o,r,c;const l=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,h=this.origin;return l>=0?(i=(t.min.x-h.x)*l,a=(t.max.x-h.x)*l):(i=(t.max.x-h.x)*l,a=(t.min.x-h.x)*l),d>=0?(s=(t.min.y-h.y)*d,o=(t.max.y-h.y)*d):(s=(t.max.y-h.y)*d,o=(t.min.y-h.y)*d),i>o||s>a||((s>i||isNaN(i))&&(i=s),(o<a||isNaN(a))&&(a=o),u>=0?(r=(t.min.z-h.z)*u,c=(t.max.z-h.z)*u):(r=(t.max.z-h.z)*u,c=(t.min.z-h.z)*u),i>c||r>a)||((r>i||i!==i)&&(i=r),(c<a||a!==a)&&(a=c),a<0)?null:this.at(i>=0?i:a,e)}intersectsBox(t){return this.intersectBox(t,Wi)!==null}intersectTriangle(t,e,i,a,s){el.subVectors(e,t),lr.subVectors(i,t),nl.crossVectors(el,lr);let o=this.direction.dot(nl),r;if(o>0){if(a)return null;r=1}else if(o<0)r=-1,o=-o;else return null;ca.subVectors(this.origin,t);const c=r*this.direction.dot(lr.crossVectors(ca,lr));if(c<0)return null;const l=r*this.direction.dot(el.cross(ca));if(l<0||c+l>o)return null;const d=-r*ca.dot(nl);return d<0?null:this.at(d/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ce{constructor(t,e,i,a,s,o,r,c,l,d,u,h,f,m,v,g){Ce.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,c,l,d,u,h,f,m,v,g)}set(t,e,i,a,s,o,r,c,l,d,u,h,f,m,v,g){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=a,p[1]=s,p[5]=o,p[9]=r,p[13]=c,p[2]=l,p[6]=d,p[10]=u,p[14]=h,p[3]=f,p[7]=m,p[11]=v,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ce().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,a=1/gs.setFromMatrixColumn(t,0).length(),s=1/gs.setFromMatrixColumn(t,1).length(),o=1/gs.setFromMatrixColumn(t,2).length();return e[0]=i[0]*a,e[1]=i[1]*a,e[2]=i[2]*a,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,a=t.y,s=t.z,o=Math.cos(i),r=Math.sin(i),c=Math.cos(a),l=Math.sin(a),d=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){const h=o*d,f=o*u,m=r*d,v=r*u;e[0]=c*d,e[4]=-c*u,e[8]=l,e[1]=f+m*l,e[5]=h-v*l,e[9]=-r*c,e[2]=v-h*l,e[6]=m+f*l,e[10]=o*c}else if(t.order==="YXZ"){const h=c*d,f=c*u,m=l*d,v=l*u;e[0]=h+v*r,e[4]=m*r-f,e[8]=o*l,e[1]=o*u,e[5]=o*d,e[9]=-r,e[2]=f*r-m,e[6]=v+h*r,e[10]=o*c}else if(t.order==="ZXY"){const h=c*d,f=c*u,m=l*d,v=l*u;e[0]=h-v*r,e[4]=-o*u,e[8]=m+f*r,e[1]=f+m*r,e[5]=o*d,e[9]=v-h*r,e[2]=-o*l,e[6]=r,e[10]=o*c}else if(t.order==="ZYX"){const h=o*d,f=o*u,m=r*d,v=r*u;e[0]=c*d,e[4]=m*l-f,e[8]=h*l+v,e[1]=c*u,e[5]=v*l+h,e[9]=f*l-m,e[2]=-l,e[6]=r*c,e[10]=o*c}else if(t.order==="YZX"){const h=o*c,f=o*l,m=r*c,v=r*l;e[0]=c*d,e[4]=v-h*u,e[8]=m*u+f,e[1]=u,e[5]=o*d,e[9]=-r*d,e[2]=-l*d,e[6]=f*u+m,e[10]=h-v*u}else if(t.order==="XZY"){const h=o*c,f=o*l,m=r*c,v=r*l;e[0]=c*d,e[4]=-u,e[8]=l*d,e[1]=h*u+v,e[5]=o*d,e[9]=f*u-m,e[2]=m*u-f,e[6]=r*d,e[10]=v*u+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(o1,t,r1)}lookAt(t,e,i){const a=this.elements;return ni.subVectors(t,e),ni.lengthSq()===0&&(ni.z=1),ni.normalize(),la.crossVectors(i,ni),la.lengthSq()===0&&(Math.abs(i.z)===1?ni.x+=1e-4:ni.z+=1e-4,ni.normalize(),la.crossVectors(i,ni)),la.normalize(),dr.crossVectors(ni,la),a[0]=la.x,a[4]=dr.x,a[8]=ni.x,a[1]=la.y,a[5]=dr.y,a[9]=ni.y,a[2]=la.z,a[6]=dr.z,a[10]=ni.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[4],c=i[8],l=i[12],d=i[1],u=i[5],h=i[9],f=i[13],m=i[2],v=i[6],g=i[10],p=i[14],_=i[3],x=i[7],y=i[11],S=i[15],w=a[0],T=a[4],R=a[8],b=a[12],M=a[1],C=a[5],k=a[9],D=a[13],F=a[2],A=a[6],E=a[10],z=a[14],G=a[3],X=a[7],et=a[11],ht=a[15];return s[0]=o*w+r*M+c*F+l*G,s[4]=o*T+r*C+c*A+l*X,s[8]=o*R+r*k+c*E+l*et,s[12]=o*b+r*D+c*z+l*ht,s[1]=d*w+u*M+h*F+f*G,s[5]=d*T+u*C+h*A+f*X,s[9]=d*R+u*k+h*E+f*et,s[13]=d*b+u*D+h*z+f*ht,s[2]=m*w+v*M+g*F+p*G,s[6]=m*T+v*C+g*A+p*X,s[10]=m*R+v*k+g*E+p*et,s[14]=m*b+v*D+g*z+p*ht,s[3]=_*w+x*M+y*F+S*G,s[7]=_*T+x*C+y*A+S*X,s[11]=_*R+x*k+y*E+S*et,s[15]=_*b+x*D+y*z+S*ht,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],a=t[8],s=t[12],o=t[1],r=t[5],c=t[9],l=t[13],d=t[2],u=t[6],h=t[10],f=t[14],m=t[3],v=t[7],g=t[11],p=t[15];return m*(+s*c*u-a*l*u-s*r*h+i*l*h+a*r*f-i*c*f)+v*(+e*c*f-e*l*h+s*o*h-a*o*f+a*l*d-s*c*d)+g*(+e*l*u-e*r*f-s*o*u+i*o*f+s*r*d-i*l*d)+p*(-a*r*d-e*c*u+e*r*h+a*o*u-i*o*h+i*c*d)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const a=this.elements;return t.isVector3?(a[12]=t.x,a[13]=t.y,a[14]=t.z):(a[12]=t,a[13]=e,a[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],c=t[6],l=t[7],d=t[8],u=t[9],h=t[10],f=t[11],m=t[12],v=t[13],g=t[14],p=t[15],_=u*g*l-v*h*l+v*c*f-r*g*f-u*c*p+r*h*p,x=m*h*l-d*g*l-m*c*f+o*g*f+d*c*p-o*h*p,y=d*v*l-m*u*l+m*r*f-o*v*f-d*r*p+o*u*p,S=m*u*c-d*v*c-m*r*h+o*v*h+d*r*g-o*u*g,w=e*_+i*x+a*y+s*S;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/w;return t[0]=_*T,t[1]=(v*h*s-u*g*s-v*a*f+i*g*f+u*a*p-i*h*p)*T,t[2]=(r*g*s-v*c*s+v*a*l-i*g*l-r*a*p+i*c*p)*T,t[3]=(u*c*s-r*h*s-u*a*l+i*h*l+r*a*f-i*c*f)*T,t[4]=x*T,t[5]=(d*g*s-m*h*s+m*a*f-e*g*f-d*a*p+e*h*p)*T,t[6]=(m*c*s-o*g*s-m*a*l+e*g*l+o*a*p-e*c*p)*T,t[7]=(o*h*s-d*c*s+d*a*l-e*h*l-o*a*f+e*c*f)*T,t[8]=y*T,t[9]=(m*u*s-d*v*s-m*i*f+e*v*f+d*i*p-e*u*p)*T,t[10]=(o*v*s-m*r*s+m*i*l-e*v*l-o*i*p+e*r*p)*T,t[11]=(d*r*s-o*u*s-d*i*l+e*u*l+o*i*f-e*r*f)*T,t[12]=S*T,t[13]=(d*v*a-m*u*a+m*i*h-e*v*h-d*i*g+e*u*g)*T,t[14]=(m*r*a-o*v*a-m*i*c+e*v*c+o*i*g-e*r*g)*T,t[15]=(o*u*a-d*r*a+d*i*c-e*u*c-o*i*h+e*r*h)*T,this}scale(t){const e=this.elements,i=t.x,a=t.y,s=t.z;return e[0]*=i,e[4]*=a,e[8]*=s,e[1]*=i,e[5]*=a,e[9]*=s,e[2]*=i,e[6]*=a,e[10]*=s,e[3]*=i,e[7]*=a,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],a=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,a))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),a=Math.sin(e),s=1-i,o=t.x,r=t.y,c=t.z,l=s*o,d=s*r;return this.set(l*o+i,l*r-a*c,l*c+a*r,0,l*r+a*c,d*r+i,d*c-a*o,0,l*c-a*r,d*c+a*o,s*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,a,s,o){return this.set(1,i,s,0,t,1,o,0,e,a,1,0,0,0,0,1),this}compose(t,e,i){const a=this.elements,s=e._x,o=e._y,r=e._z,c=e._w,l=s+s,d=o+o,u=r+r,h=s*l,f=s*d,m=s*u,v=o*d,g=o*u,p=r*u,_=c*l,x=c*d,y=c*u,S=i.x,w=i.y,T=i.z;return a[0]=(1-(v+p))*S,a[1]=(f+y)*S,a[2]=(m-x)*S,a[3]=0,a[4]=(f-y)*w,a[5]=(1-(h+p))*w,a[6]=(g+_)*w,a[7]=0,a[8]=(m+x)*T,a[9]=(g-_)*T,a[10]=(1-(h+v))*T,a[11]=0,a[12]=t.x,a[13]=t.y,a[14]=t.z,a[15]=1,this}decompose(t,e,i){const a=this.elements;let s=gs.set(a[0],a[1],a[2]).length();const o=gs.set(a[4],a[5],a[6]).length(),r=gs.set(a[8],a[9],a[10]).length();this.determinant()<0&&(s=-s),t.x=a[12],t.y=a[13],t.z=a[14],Mi.copy(this);const l=1/s,d=1/o,u=1/r;return Mi.elements[0]*=l,Mi.elements[1]*=l,Mi.elements[2]*=l,Mi.elements[4]*=d,Mi.elements[5]*=d,Mi.elements[6]*=d,Mi.elements[8]*=u,Mi.elements[9]*=u,Mi.elements[10]*=u,e.setFromRotationMatrix(Mi),i.x=s,i.y=o,i.z=r,this}makePerspective(t,e,i,a,s,o,r=ta){const c=this.elements,l=2*s/(e-t),d=2*s/(i-a),u=(e+t)/(e-t),h=(i+a)/(i-a);let f,m;if(r===ta)f=-(o+s)/(o-s),m=-2*o*s/(o-s);else if(r===oc)f=-o/(o-s),m=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=h,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,a,s,o,r=ta){const c=this.elements,l=1/(e-t),d=1/(i-a),u=1/(o-s),h=(e+t)*l,f=(i+a)*d;let m,v;if(r===ta)m=(o+s)*u,v=-2*u;else if(r===oc)m=s*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-h,c[1]=0,c[5]=2*d,c[9]=0,c[13]=-f,c[2]=0,c[6]=0,c[10]=v,c[14]=-m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<16;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const gs=new W,Mi=new Ce,o1=new W(0,0,0),r1=new W(1,1,1),la=new W,dr=new W,ni=new W,Qu=new Ce,tf=new Ma;class Ni{constructor(t=0,e=0,i=0,a=Ni.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=a}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,a=this._order){return this._x=t,this._y=e,this._z=i,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const a=t.elements,s=a[0],o=a[4],r=a[8],c=a[1],l=a[5],d=a[9],u=a[2],h=a[6],f=a[10];switch(e){case"XYZ":this._y=Math.asin(An(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-d,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-An(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(r,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(An(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-An(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(An(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(r,f));break;case"XZY":this._z=Math.asin(-An(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(r,s)):(this._x=Math.atan2(-d,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Qu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Qu,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return tf.setFromEuler(this),this.setFromQuaternion(tf,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ni.DEFAULT_ORDER="XYZ";class uh{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let c1=0;const ef=new W,xs=new Ma,Yi=new Ce,hr=new W,fo=new W,l1=new W,d1=new Ma,nf=new W(1,0,0),af=new W(0,1,0),sf=new W(0,0,1),of={type:"added"},h1={type:"removed"},vs={type:"childadded",child:null},il={type:"childremoved",child:null};class Qe extends qs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:c1++}),this.uuid=Ui(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Qe.DEFAULT_UP.clone();const t=new W,e=new Ni,i=new Ma,a=new W(1,1,1);function s(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new Ce},normalMatrix:{value:new Me}}),this.matrix=new Ce,this.matrixWorld=new Ce,this.matrixAutoUpdate=Qe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Qe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new uh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return xs.setFromAxisAngle(t,e),this.quaternion.multiply(xs),this}rotateOnWorldAxis(t,e){return xs.setFromAxisAngle(t,e),this.quaternion.premultiply(xs),this}rotateX(t){return this.rotateOnAxis(nf,t)}rotateY(t){return this.rotateOnAxis(af,t)}rotateZ(t){return this.rotateOnAxis(sf,t)}translateOnAxis(t,e){return ef.copy(t).applyQuaternion(this.quaternion),this.position.add(ef.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(nf,t)}translateY(t){return this.translateOnAxis(af,t)}translateZ(t){return this.translateOnAxis(sf,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Yi.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?hr.copy(t):hr.set(t,e,i);const a=this.parent;this.updateWorldMatrix(!0,!1),fo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Yi.lookAt(fo,hr,this.up):Yi.lookAt(hr,fo,this.up),this.quaternion.setFromRotationMatrix(Yi),a&&(Yi.extractRotation(a.matrixWorld),xs.setFromRotationMatrix(Yi),this.quaternion.premultiply(xs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(of),vs.child=t,this.dispatchEvent(vs),vs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(h1),il.child=t,this.dispatchEvent(il),il.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Yi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Yi.multiply(t.parent.matrixWorld)),t.applyMatrix4(Yi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(of),vs.child=t,this.dispatchEvent(vs),vs.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,a=this.children.length;i<a;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fo,t,l1),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fo,d1,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function s(r,c){return r[c.uuid]===void 0&&(r[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=s(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const c=r.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){const u=c[l];s(t.shapes,u)}else s(t.shapes,c)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let c=0,l=this.material.length;c<l;c++)r.push(s(t.materials,this.material[c]));a.material=r}else a.material=s(t.materials,this.material);if(this.children.length>0){a.children=[];for(let r=0;r<this.children.length;r++)a.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){a.animations=[];for(let r=0;r<this.animations.length;r++){const c=this.animations[r];a.animations.push(s(t.animations,c))}}if(e){const r=o(t.geometries),c=o(t.materials),l=o(t.textures),d=o(t.images),u=o(t.shapes),h=o(t.skeletons),f=o(t.animations),m=o(t.nodes);r.length>0&&(i.geometries=r),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),d.length>0&&(i.images=d),u.length>0&&(i.shapes=u),h.length>0&&(i.skeletons=h),f.length>0&&(i.animations=f),m.length>0&&(i.nodes=m)}return i.object=a,i;function o(r){const c=[];for(const l in r){const d=r[l];delete d.metadata,c.push(d)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const a=t.children[i];this.add(a.clone())}return this}}Qe.DEFAULT_UP=new W(0,1,0);Qe.DEFAULT_MATRIX_AUTO_UPDATE=!0;Qe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const _i=new W,$i=new W,al=new W,Zi=new W,ys=new W,Ms=new W,rf=new W,sl=new W,ol=new W,rl=new W,cl=new sn,ll=new sn,dl=new sn;class si{constructor(t=new W,e=new W,i=new W){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,a){a.subVectors(i,e),_i.subVectors(t,e),a.cross(_i);const s=a.lengthSq();return s>0?a.multiplyScalar(1/Math.sqrt(s)):a.set(0,0,0)}static getBarycoord(t,e,i,a,s){_i.subVectors(a,e),$i.subVectors(i,e),al.subVectors(t,e);const o=_i.dot(_i),r=_i.dot($i),c=_i.dot(al),l=$i.dot($i),d=$i.dot(al),u=o*l-r*r;if(u===0)return s.set(0,0,0),null;const h=1/u,f=(l*c-r*d)*h,m=(o*d-r*c)*h;return s.set(1-f-m,m,f)}static containsPoint(t,e,i,a){return this.getBarycoord(t,e,i,a,Zi)===null?!1:Zi.x>=0&&Zi.y>=0&&Zi.x+Zi.y<=1}static getInterpolation(t,e,i,a,s,o,r,c){return this.getBarycoord(t,e,i,a,Zi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,Zi.x),c.addScaledVector(o,Zi.y),c.addScaledVector(r,Zi.z),c)}static getInterpolatedAttribute(t,e,i,a,s,o){return cl.setScalar(0),ll.setScalar(0),dl.setScalar(0),cl.fromBufferAttribute(t,e),ll.fromBufferAttribute(t,i),dl.fromBufferAttribute(t,a),o.setScalar(0),o.addScaledVector(cl,s.x),o.addScaledVector(ll,s.y),o.addScaledVector(dl,s.z),o}static isFrontFacing(t,e,i,a){return _i.subVectors(i,e),$i.subVectors(t,e),_i.cross($i).dot(a)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,a){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[a]),this}setFromAttributeAndIndices(t,e,i,a){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,a),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return _i.subVectors(this.c,this.b),$i.subVectors(this.a,this.b),_i.cross($i).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return si.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return si.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,a,s){return si.getInterpolation(t,this.a,this.b,this.c,e,i,a,s)}containsPoint(t){return si.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return si.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,a=this.b,s=this.c;let o,r;ys.subVectors(a,i),Ms.subVectors(s,i),sl.subVectors(t,i);const c=ys.dot(sl),l=Ms.dot(sl);if(c<=0&&l<=0)return e.copy(i);ol.subVectors(t,a);const d=ys.dot(ol),u=Ms.dot(ol);if(d>=0&&u<=d)return e.copy(a);const h=c*u-d*l;if(h<=0&&c>=0&&d<=0)return o=c/(c-d),e.copy(i).addScaledVector(ys,o);rl.subVectors(t,s);const f=ys.dot(rl),m=Ms.dot(rl);if(m>=0&&f<=m)return e.copy(s);const v=f*l-c*m;if(v<=0&&l>=0&&m<=0)return r=l/(l-m),e.copy(i).addScaledVector(Ms,r);const g=d*m-f*u;if(g<=0&&u-d>=0&&f-m>=0)return rf.subVectors(s,a),r=(u-d)/(u-d+(f-m)),e.copy(a).addScaledVector(rf,r);const p=1/(g+v+h);return o=v*p,r=h*p,e.copy(i).addScaledVector(ys,o).addScaledVector(Ms,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const wm={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},da={h:0,s:0,l:0},ur={h:0,s:0,l:0};function hl(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class Qt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const a=t;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Hn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Te.toWorkingColorSpace(this,e),this}setRGB(t,e,i,a=Te.workingColorSpace){return this.r=t,this.g=e,this.b=i,Te.toWorkingColorSpace(this,a),this}setHSL(t,e,i,a=Te.workingColorSpace){if(t=dh(t,1),e=An(e,0,1),i=An(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,o=2*i-s;this.r=hl(o,s,t+1/3),this.g=hl(o,s,t),this.b=hl(o,s,t-1/3)}return Te.toWorkingColorSpace(this,a),this}setStyle(t,e=Hn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=a[1],r=a[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=a[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Hn){const i=wm[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ea(t.r),this.g=ea(t.g),this.b=ea(t.b),this}copyLinearToSRGB(t){return this.r=Ns(t.r),this.g=Ns(t.g),this.b=Ns(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Hn){return Te.fromWorkingColorSpace(kn.copy(this),t),Math.round(An(kn.r*255,0,255))*65536+Math.round(An(kn.g*255,0,255))*256+Math.round(An(kn.b*255,0,255))}getHexString(t=Hn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Te.workingColorSpace){Te.fromWorkingColorSpace(kn.copy(this),e);const i=kn.r,a=kn.g,s=kn.b,o=Math.max(i,a,s),r=Math.min(i,a,s);let c,l;const d=(r+o)/2;if(r===o)c=0,l=0;else{const u=o-r;switch(l=d<=.5?u/(o+r):u/(2-o-r),o){case i:c=(a-s)/u+(a<s?6:0);break;case a:c=(s-i)/u+2;break;case s:c=(i-a)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=d,t}getRGB(t,e=Te.workingColorSpace){return Te.fromWorkingColorSpace(kn.copy(this),e),t.r=kn.r,t.g=kn.g,t.b=kn.b,t}getStyle(t=Hn){Te.fromWorkingColorSpace(kn.copy(this),t);const e=kn.r,i=kn.g,a=kn.b;return t!==Hn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(a*255)})`}offsetHSL(t,e,i){return this.getHSL(da),this.setHSL(da.h+t,da.s+e,da.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(da),t.getHSL(ur);const i=Po(da.h,ur.h,e),a=Po(da.s,ur.s,e),s=Po(da.l,ur.l,e);return this.setHSL(i,a,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,a=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*a,this.g=s[1]*e+s[4]*i+s[7]*a,this.b=s[2]*e+s[5]*i+s[8]*a,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const kn=new Qt;Qt.NAMES=wm;let u1=0;class Qa extends qs{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:u1++}),this.uuid=Ui(),this.name="",this.blending=zs,this.side=ba,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ql,this.blendDst=Kl,this.blendEquation=Xa,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Qt(0,0,0),this.blendAlpha=0,this.depthFunc=Xs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Gu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=hs,this.stencilZFail=hs,this.stencilZPass=hs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const a=this[e];if(a===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(i):a&&a.isVector3&&i&&i.isVector3?a.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==zs&&(i.blending=this.blending),this.side!==ba&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==ql&&(i.blendSrc=this.blendSrc),this.blendDst!==Kl&&(i.blendDst=this.blendDst),this.blendEquation!==Xa&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Xs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Gu&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==hs&&(i.stencilFail=this.stencilFail),this.stencilZFail!==hs&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==hs&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function a(s){const o=[];for(const r in s){const c=s[r];delete c.metadata,o.push(c)}return o}if(e){const s=a(t.textures),o=a(t.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const a=e.length;i=new Array(a);for(let s=0;s!==a;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Sn extends Qa{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ni,this.combine=nh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const dn=new W,fr=new Wt;class wn{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=zd,this.updateRanges=[],this.gpuType=zi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let a=0,s=this.itemSize;a<s;a++)this.array[t+a]=e.array[i+a];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)fr.fromBufferAttribute(this,e),fr.applyMatrix3(t),this.setXY(e,fr.x,fr.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)dn.fromBufferAttribute(this,e),dn.applyMatrix3(t),this.setXYZ(e,dn.x,dn.y,dn.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)dn.fromBufferAttribute(this,e),dn.applyMatrix4(t),this.setXYZ(e,dn.x,dn.y,dn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)dn.fromBufferAttribute(this,e),dn.applyNormalMatrix(t),this.setXYZ(e,dn.x,dn.y,dn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)dn.fromBufferAttribute(this,e),dn.transformDirection(t),this.setXYZ(e,dn.x,dn.y,dn.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=bi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=ze(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=bi(e,this.array)),e}setX(t,e){return this.normalized&&(e=ze(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=bi(e,this.array)),e}setY(t,e){return this.normalized&&(e=ze(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=bi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ze(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=bi(e,this.array)),e}setW(t,e){return this.normalized&&(e=ze(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=ze(e,this.array),i=ze(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,a){return t*=this.itemSize,this.normalized&&(e=ze(e,this.array),i=ze(i,this.array),a=ze(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t*=this.itemSize,this.normalized&&(e=ze(e,this.array),i=ze(i,this.array),a=ze(a,this.array),s=ze(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==zd&&(t.usage=this.usage),t}}class Em extends wn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Tm extends wn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class Le extends wn{constructor(t,e,i){super(new Float32Array(t),e,i)}}let f1=0;const ui=new Ce,ul=new Qe,_s=new W,ii=new Ja,po=new Ja,bn=new W;class en extends qs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:f1++}),this.uuid=Ui(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(_m(t)?Tm:Em)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Me().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(t),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return ui.makeRotationFromQuaternion(t),this.applyMatrix4(ui),this}rotateX(t){return ui.makeRotationX(t),this.applyMatrix4(ui),this}rotateY(t){return ui.makeRotationY(t),this.applyMatrix4(ui),this}rotateZ(t){return ui.makeRotationZ(t),this.applyMatrix4(ui),this}translate(t,e,i){return ui.makeTranslation(t,e,i),this.applyMatrix4(ui),this}scale(t,e,i){return ui.makeScale(t,e,i),this.applyMatrix4(ui),this}lookAt(t){return ul.lookAt(t),ul.updateMatrix(),this.applyMatrix4(ul.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(_s).negate(),this.translate(_s.x,_s.y,_s.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let a=0,s=t.length;a<s;a++){const o=t[a];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Le(i,3))}else{for(let i=0,a=e.count;i<a;i++){const s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ja);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new W(-1/0,-1/0,-1/0),new W(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,a=e.length;i<a;i++){const s=e[i];ii.setFromBufferAttribute(s),this.morphTargetsRelative?(bn.addVectors(this.boundingBox.min,ii.min),this.boundingBox.expandByPoint(bn),bn.addVectors(this.boundingBox.max,ii.max),this.boundingBox.expandByPoint(bn)):(this.boundingBox.expandByPoint(ii.min),this.boundingBox.expandByPoint(ii.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ks);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new W,1/0);return}if(t){const i=this.boundingSphere.center;if(ii.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const r=e[s];po.setFromBufferAttribute(r),this.morphTargetsRelative?(bn.addVectors(ii.min,po.min),ii.expandByPoint(bn),bn.addVectors(ii.max,po.max),ii.expandByPoint(bn)):(ii.expandByPoint(po.min),ii.expandByPoint(po.max))}ii.getCenter(i);let a=0;for(let s=0,o=t.count;s<o;s++)bn.fromBufferAttribute(t,s),a=Math.max(a,i.distanceToSquared(bn));if(e)for(let s=0,o=e.length;s<o;s++){const r=e[s],c=this.morphTargetsRelative;for(let l=0,d=r.count;l<d;l++)bn.fromBufferAttribute(r,l),c&&(_s.fromBufferAttribute(t,l),bn.add(_s)),a=Math.max(a,i.distanceToSquared(bn))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,a=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new wn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),r=[],c=[];for(let R=0;R<i.count;R++)r[R]=new W,c[R]=new W;const l=new W,d=new W,u=new W,h=new Wt,f=new Wt,m=new Wt,v=new W,g=new W;function p(R,b,M){l.fromBufferAttribute(i,R),d.fromBufferAttribute(i,b),u.fromBufferAttribute(i,M),h.fromBufferAttribute(s,R),f.fromBufferAttribute(s,b),m.fromBufferAttribute(s,M),d.sub(l),u.sub(l),f.sub(h),m.sub(h);const C=1/(f.x*m.y-m.x*f.y);isFinite(C)&&(v.copy(d).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(C),g.copy(u).multiplyScalar(f.x).addScaledVector(d,-m.x).multiplyScalar(C),r[R].add(v),r[b].add(v),r[M].add(v),c[R].add(g),c[b].add(g),c[M].add(g))}let _=this.groups;_.length===0&&(_=[{start:0,count:t.count}]);for(let R=0,b=_.length;R<b;++R){const M=_[R],C=M.start,k=M.count;for(let D=C,F=C+k;D<F;D+=3)p(t.getX(D+0),t.getX(D+1),t.getX(D+2))}const x=new W,y=new W,S=new W,w=new W;function T(R){S.fromBufferAttribute(a,R),w.copy(S);const b=r[R];x.copy(b),x.sub(S.multiplyScalar(S.dot(b))).normalize(),y.crossVectors(w,b);const C=y.dot(c[R])<0?-1:1;o.setXYZW(R,x.x,x.y,x.z,C)}for(let R=0,b=_.length;R<b;++R){const M=_[R],C=M.start,k=M.count;for(let D=C,F=C+k;D<F;D+=3)T(t.getX(D+0)),T(t.getX(D+1)),T(t.getX(D+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new wn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let h=0,f=i.count;h<f;h++)i.setXYZ(h,0,0,0);const a=new W,s=new W,o=new W,r=new W,c=new W,l=new W,d=new W,u=new W;if(t)for(let h=0,f=t.count;h<f;h+=3){const m=t.getX(h+0),v=t.getX(h+1),g=t.getX(h+2);a.fromBufferAttribute(e,m),s.fromBufferAttribute(e,v),o.fromBufferAttribute(e,g),d.subVectors(o,s),u.subVectors(a,s),d.cross(u),r.fromBufferAttribute(i,m),c.fromBufferAttribute(i,v),l.fromBufferAttribute(i,g),r.add(d),c.add(d),l.add(d),i.setXYZ(m,r.x,r.y,r.z),i.setXYZ(v,c.x,c.y,c.z),i.setXYZ(g,l.x,l.y,l.z)}else for(let h=0,f=e.count;h<f;h+=3)a.fromBufferAttribute(e,h+0),s.fromBufferAttribute(e,h+1),o.fromBufferAttribute(e,h+2),d.subVectors(o,s),u.subVectors(a,s),d.cross(u),i.setXYZ(h+0,d.x,d.y,d.z),i.setXYZ(h+1,d.x,d.y,d.z),i.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)bn.fromBufferAttribute(t,e),bn.normalize(),t.setXYZ(e,bn.x,bn.y,bn.z)}toNonIndexed(){function t(r,c){const l=r.array,d=r.itemSize,u=r.normalized,h=new l.constructor(c.length*d);let f=0,m=0;for(let v=0,g=c.length;v<g;v++){r.isInterleavedBufferAttribute?f=c[v]*r.data.stride+r.offset:f=c[v]*d;for(let p=0;p<d;p++)h[m++]=l[f++]}return new wn(h,d,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new en,i=this.index.array,a=this.attributes;for(const r in a){const c=a[r],l=t(c,i);e.setAttribute(r,l)}const s=this.morphAttributes;for(const r in s){const c=[],l=s[r];for(let d=0,u=l.length;d<u;d++){const h=l[d],f=t(h,i);c.push(f)}e.morphAttributes[r]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,c=o.length;r<c;r++){const l=o[r];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const a={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],d=[];for(let u=0,h=l.length;u<h;u++){const f=l[u];d.push(f.toJSON(t.data))}d.length>0&&(a[c]=d,s=!0)}s&&(t.data.morphAttributes=a,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const a=t.attributes;for(const l in a){const d=a[l];this.setAttribute(l,d.clone(e))}const s=t.morphAttributes;for(const l in s){const d=[],u=s[l];for(let h=0,f=u.length;h<f;h++)d.push(u[h].clone(e));this.morphAttributes[l]=d}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,d=o.length;l<d;l++){const u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const cf=new Ce,La=new hh,pr=new Ks,lf=new W,mr=new W,gr=new W,xr=new W,fl=new W,vr=new W,df=new W,yr=new W;class ve extends Qe{constructor(t=new en,e=new Sn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}getVertexPosition(t,e){const i=this.geometry,a=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(a,t);const r=this.morphTargetInfluences;if(s&&r){vr.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const d=r[c],u=s[c];d!==0&&(fl.fromBufferAttribute(u,t),o?vr.addScaledVector(fl,d):vr.addScaledVector(fl.sub(e),d))}e.add(vr)}return e}raycast(t,e){const i=this.geometry,a=this.material,s=this.matrixWorld;a!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),pr.copy(i.boundingSphere),pr.applyMatrix4(s),La.copy(t.ray).recast(t.near),!(pr.containsPoint(La.origin)===!1&&(La.intersectSphere(pr,lf)===null||La.origin.distanceToSquared(lf)>(t.far-t.near)**2))&&(cf.copy(s).invert(),La.copy(t.ray).applyMatrix4(cf),!(i.boundingBox!==null&&La.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,La)))}_computeIntersections(t,e,i){let a;const s=this.geometry,o=this.material,r=s.index,c=s.attributes.position,l=s.attributes.uv,d=s.attributes.uv1,u=s.attributes.normal,h=s.groups,f=s.drawRange;if(r!==null)if(Array.isArray(o))for(let m=0,v=h.length;m<v;m++){const g=h[m],p=o[g.materialIndex],_=Math.max(g.start,f.start),x=Math.min(r.count,Math.min(g.start+g.count,f.start+f.count));for(let y=_,S=x;y<S;y+=3){const w=r.getX(y),T=r.getX(y+1),R=r.getX(y+2);a=Mr(this,p,t,i,l,d,u,w,T,R),a&&(a.faceIndex=Math.floor(y/3),a.face.materialIndex=g.materialIndex,e.push(a))}}else{const m=Math.max(0,f.start),v=Math.min(r.count,f.start+f.count);for(let g=m,p=v;g<p;g+=3){const _=r.getX(g),x=r.getX(g+1),y=r.getX(g+2);a=Mr(this,o,t,i,l,d,u,_,x,y),a&&(a.faceIndex=Math.floor(g/3),e.push(a))}}else if(c!==void 0)if(Array.isArray(o))for(let m=0,v=h.length;m<v;m++){const g=h[m],p=o[g.materialIndex],_=Math.max(g.start,f.start),x=Math.min(c.count,Math.min(g.start+g.count,f.start+f.count));for(let y=_,S=x;y<S;y+=3){const w=y,T=y+1,R=y+2;a=Mr(this,p,t,i,l,d,u,w,T,R),a&&(a.faceIndex=Math.floor(y/3),a.face.materialIndex=g.materialIndex,e.push(a))}}else{const m=Math.max(0,f.start),v=Math.min(c.count,f.start+f.count);for(let g=m,p=v;g<p;g+=3){const _=g,x=g+1,y=g+2;a=Mr(this,o,t,i,l,d,u,_,x,y),a&&(a.faceIndex=Math.floor(g/3),e.push(a))}}}}function p1(n,t,e,i,a,s,o,r){let c;if(t.side===jn?c=i.intersectTriangle(o,s,a,!0,r):c=i.intersectTriangle(a,s,o,t.side===ba,r),c===null)return null;yr.copy(r),yr.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(yr);return l<e.near||l>e.far?null:{distance:l,point:yr.clone(),object:n}}function Mr(n,t,e,i,a,s,o,r,c,l){n.getVertexPosition(r,mr),n.getVertexPosition(c,gr),n.getVertexPosition(l,xr);const d=p1(n,t,e,i,mr,gr,xr,df);if(d){const u=new W;si.getBarycoord(df,mr,gr,xr,u),a&&(d.uv=si.getInterpolatedAttribute(a,r,c,l,u,new Wt)),s&&(d.uv1=si.getInterpolatedAttribute(s,r,c,l,u,new Wt)),o&&(d.normal=si.getInterpolatedAttribute(o,r,c,l,u,new W),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const h={a:r,b:c,c:l,normal:new W,materialIndex:0};si.getNormal(mr,gr,xr,h.normal),d.face=h,d.barycoord=u}return d}class qn extends en{constructor(t=1,e=1,i=1,a=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:a,heightSegments:s,depthSegments:o};const r=this;a=Math.floor(a),s=Math.floor(s),o=Math.floor(o);const c=[],l=[],d=[],u=[];let h=0,f=0;m("z","y","x",-1,-1,i,e,t,o,s,0),m("z","y","x",1,-1,i,e,-t,o,s,1),m("x","z","y",1,1,t,i,e,a,o,2),m("x","z","y",1,-1,t,i,-e,a,o,3),m("x","y","z",1,-1,t,e,i,a,s,4),m("x","y","z",-1,-1,t,e,-i,a,s,5),this.setIndex(c),this.setAttribute("position",new Le(l,3)),this.setAttribute("normal",new Le(d,3)),this.setAttribute("uv",new Le(u,2));function m(v,g,p,_,x,y,S,w,T,R,b){const M=y/T,C=S/R,k=y/2,D=S/2,F=w/2,A=T+1,E=R+1;let z=0,G=0;const X=new W;for(let et=0;et<E;et++){const ht=et*C-D;for(let gt=0;gt<A;gt++){const Lt=gt*M-k;X[v]=Lt*_,X[g]=ht*x,X[p]=F,l.push(X.x,X.y,X.z),X[v]=0,X[g]=0,X[p]=w>0?1:-1,d.push(X.x,X.y,X.z),u.push(gt/T),u.push(1-et/R),z+=1}}for(let et=0;et<R;et++)for(let ht=0;ht<T;ht++){const gt=h+ht+A*et,Lt=h+ht+A*(et+1),Z=h+(ht+1)+A*(et+1),B=h+(ht+1)+A*et;c.push(gt,Lt,B),c.push(Lt,Z,B),G+=6}r.addGroup(f,G,b),f+=G,h+=z}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new qn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Zs(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const a=n[e][i];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=a.clone():Array.isArray(a)?t[e][i]=a.slice():t[e][i]=a}}return t}function Bn(n){const t={};for(let e=0;e<n.length;e++){const i=Zs(n[e]);for(const a in i)t[a]=i[a]}return t}function m1(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Am(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Te.workingColorSpace}const g1={clone:Zs,merge:Bn};var x1=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,v1=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Sa extends Qa{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=x1,this.fragmentShader=v1,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Zs(t.uniforms),this.uniformsGroups=m1(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const a in this.uniforms){const o=this.uniforms[a].value;o&&o.isTexture?e.uniforms[a]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[a]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[a]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[a]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[a]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[a]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[a]={type:"m4",value:o.toArray()}:e.uniforms[a]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const a in this.extensions)this.extensions[a]===!0&&(i[a]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class Rm extends Qe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ce,this.projectionMatrix=new Ce,this.projectionMatrixInverse=new Ce,this.coordinateSystem=ta}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ha=new W,hf=new Wt,uf=new Wt;class fi extends Rm{constructor(t=50,e=1,i=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=a,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ho*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Us*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ho*2*Math.atan(Math.tan(Us*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){ha.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ha.x,ha.y).multiplyScalar(-t/ha.z),ha.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ha.x,ha.y).multiplyScalar(-t/ha.z)}getViewSize(t,e){return this.getViewBounds(t,hf,uf),e.subVectors(uf,hf)}setViewOffset(t,e,i,a,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Us*.5*this.fov)/this.zoom,i=2*e,a=this.aspect*i,s=-.5*a;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;s+=o.offsetX*a/c,e-=o.offsetY*i/l,a*=o.width/c,i*=o.height/l}const r=this.filmOffset;r!==0&&(s+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+a,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const bs=-90,Ss=1;class y1 extends Qe{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new fi(bs,Ss,t,e);a.layers=this.layers,this.add(a);const s=new fi(bs,Ss,t,e);s.layers=this.layers,this.add(s);const o=new fi(bs,Ss,t,e);o.layers=this.layers,this.add(o);const r=new fi(bs,Ss,t,e);r.layers=this.layers,this.add(r);const c=new fi(bs,Ss,t,e);c.layers=this.layers,this.add(c);const l=new fi(bs,Ss,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,a,s,o,r,c]=e;for(const l of e)this.remove(l);if(t===ta)i.up.set(0,1,0),i.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===oc)i.up.set(0,-1,0),i.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:a}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,r,c,l,d]=this.children,u=t.getRenderTarget(),h=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,a),t.render(e,s),t.setRenderTarget(i,1,a),t.render(e,o),t.setRenderTarget(i,2,a),t.render(e,r),t.setRenderTarget(i,3,a),t.render(e,c),t.setRenderTarget(i,4,a),t.render(e,l),i.texture.generateMipmaps=v,t.setRenderTarget(i,5,a),t.render(e,d),t.setRenderTarget(u,h,f),t.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class Pm extends Fn{constructor(t,e,i,a,s,o,r,c,l,d){t=t!==void 0?t:[],e=e!==void 0?e:Vs,super(t,e,i,a,s,o,r,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class M1 extends qa{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},a=[i,i,i,i,i,i];this.texture=new Pm(a,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Ii}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},a=new qn(5,5,5),s=new Sa({name:"CubemapFromEquirect",uniforms:Zs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:jn,blending:va});s.uniforms.tEquirect.value=e;const o=new ve(a,s),r=e.minFilter;return e.minFilter===Ya&&(e.minFilter=Ii),new y1(1,10,this).update(t,o),e.minFilter=r,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,a){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,a);t.setRenderTarget(s)}}const pl=new W,_1=new W,b1=new Me;class Ba{constructor(t=new W(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,a){return this.normal.set(t,e,i),this.constant=a,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const a=pl.subVectors(i,e).cross(_1.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(a,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(pl),a=this.normal.dot(i);if(a===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/a;return s<0||s>1?null:e.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||b1.getNormalMatrix(t),a=this.coplanarPoint(pl).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-a.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ka=new Ks,_r=new W;class fh{constructor(t=new Ba,e=new Ba,i=new Ba,a=new Ba,s=new Ba,o=new Ba){this.planes=[t,e,i,a,s,o]}set(t,e,i,a,s,o){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(a),r[4].copy(s),r[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=ta){const i=this.planes,a=t.elements,s=a[0],o=a[1],r=a[2],c=a[3],l=a[4],d=a[5],u=a[6],h=a[7],f=a[8],m=a[9],v=a[10],g=a[11],p=a[12],_=a[13],x=a[14],y=a[15];if(i[0].setComponents(c-s,h-l,g-f,y-p).normalize(),i[1].setComponents(c+s,h+l,g+f,y+p).normalize(),i[2].setComponents(c+o,h+d,g+m,y+_).normalize(),i[3].setComponents(c-o,h-d,g-m,y-_).normalize(),i[4].setComponents(c-r,h-u,g-v,y-x).normalize(),e===ta)i[5].setComponents(c+r,h+u,g+v,y+x).normalize();else if(e===oc)i[5].setComponents(r,u,v,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ka.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ka.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ka)}intersectsSprite(t){return ka.center.set(0,0,0),ka.radius=.7071067811865476,ka.applyMatrix4(t.matrixWorld),this.intersectsSphere(ka)}intersectsSphere(t){const e=this.planes,i=t.center,a=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<a)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const a=e[i];if(_r.x=a.normal.x>0?t.max.x:t.min.x,_r.y=a.normal.y>0?t.max.y:t.min.y,_r.z=a.normal.z>0?t.max.z:t.min.z,a.distanceToPoint(_r)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Cm(){let n=null,t=!1,e=null,i=null;function a(s,o){e(s,o),i=n.requestAnimationFrame(a)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(a),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){n=s}}}function S1(n){const t=new WeakMap;function e(r,c){const l=r.array,d=r.usage,u=l.byteLength,h=n.createBuffer();n.bindBuffer(c,h),n.bufferData(c,l,d),r.onUploadCallback();let f;if(l instanceof Float32Array)f=n.FLOAT;else if(l instanceof Uint16Array)r.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=n.SHORT;else if(l instanceof Uint32Array)f=n.UNSIGNED_INT;else if(l instanceof Int32Array)f=n.INT;else if(l instanceof Int8Array)f=n.BYTE;else if(l instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:h,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:r.version,size:u}}function i(r,c,l){const d=c.array,u=c.updateRanges;if(n.bindBuffer(l,r),u.length===0)n.bufferSubData(l,0,d);else{u.sort((f,m)=>f.start-m.start);let h=0;for(let f=1;f<u.length;f++){const m=u[h],v=u[f];v.start<=m.start+m.count+1?m.count=Math.max(m.count,v.start+v.count-m.start):(++h,u[h]=v)}u.length=h+1;for(let f=0,m=u.length;f<m;f++){const v=u[f];n.bufferSubData(l,v.start*d.BYTES_PER_ELEMENT,d,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function a(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function s(r){r.isInterleavedBufferAttribute&&(r=r.data);const c=t.get(r);c&&(n.deleteBuffer(c.buffer),t.delete(r))}function o(r,c){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const d=t.get(r);(!d||d.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const l=t.get(r);if(l===void 0)t.set(r,e(r,c));else if(l.version<r.version){if(l.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,r,c),l.version=r.version}}return{get:a,remove:s,update:o}}class Zn extends en{constructor(t=1,e=1,i=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:a};const s=t/2,o=e/2,r=Math.floor(i),c=Math.floor(a),l=r+1,d=c+1,u=t/r,h=e/c,f=[],m=[],v=[],g=[];for(let p=0;p<d;p++){const _=p*h-o;for(let x=0;x<l;x++){const y=x*u-s;m.push(y,-_,0),v.push(0,0,1),g.push(x/r),g.push(1-p/c)}}for(let p=0;p<c;p++)for(let _=0;_<r;_++){const x=_+l*p,y=_+l*(p+1),S=_+1+l*(p+1),w=_+1+l*p;f.push(x,y,w),f.push(y,S,w)}this.setIndex(f),this.setAttribute("position",new Le(m,3)),this.setAttribute("normal",new Le(v,3)),this.setAttribute("uv",new Le(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Zn(t.width,t.height,t.widthSegments,t.heightSegments)}}var w1=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,E1=`#ifdef USE_ALPHAHASH
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
#endif`,T1=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,A1=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,R1=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,P1=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,C1=`#ifdef USE_AOMAP
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
#endif`,D1=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,L1=`#ifdef USE_BATCHING
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
#endif`,k1=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,I1=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,z1=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,F1=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,U1=`#ifdef USE_IRIDESCENCE
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
#endif`,N1=`#ifdef USE_BUMPMAP
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
#endif`,O1=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,B1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,H1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,G1=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,X1=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,V1=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,W1=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Y1=`#if defined( USE_COLOR_ALPHA )
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
#endif`,$1=`#define PI 3.141592653589793
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
} // validated`,Z1=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,j1=`vec3 transformedNormal = objectNormal;
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
#endif`,q1=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,K1=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,J1=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Q1=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,tS="gl_FragColor = linearToOutputTexel( gl_FragColor );",eS=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,nS=`#ifdef USE_ENVMAP
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
#endif`,iS=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,aS=`#ifdef USE_ENVMAP
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
#endif`,sS=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,oS=`#ifdef USE_ENVMAP
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
#endif`,rS=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,cS=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,lS=`#ifdef USE_FOG
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
#endif`,hS=`#ifdef USE_GRADIENTMAP
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
}`,uS=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,fS=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,pS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,mS=`uniform bool receiveShadow;
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
#endif`,gS=`#ifdef USE_ENVMAP
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
#endif`,xS=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,vS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,yS=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,MS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,_S=`PhysicalMaterial material;
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
#endif`,bS=`struct PhysicalMaterial {
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
}`,SS=`
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
#endif`,wS=`#if defined( RE_IndirectDiffuse )
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
#endif`,ES=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,TS=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,AS=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,RS=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,PS=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,CS=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,DS=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,LS=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,kS=`#if defined( USE_POINTS_UV )
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
#endif`,IS=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,zS=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,FS=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,US=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,NS=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,OS=`#ifdef USE_MORPHTARGETS
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
#endif`,BS=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,HS=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,GS=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,XS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,VS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,WS=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,YS=`#ifdef USE_NORMALMAP
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
#endif`,$S=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,ZS=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,jS=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,qS=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,KS=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,JS=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,QS=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,tw=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ew=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,nw=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,iw=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,aw=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,sw=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ow=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,rw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,cw=`float getShadowMask() {
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
}`,lw=`#ifdef USE_SKINNING
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
#endif`,hw=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,uw=`#ifdef USE_SKINNING
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
#endif`,fw=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,pw=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,mw=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,gw=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,xw=`#ifdef USE_TRANSMISSION
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
#endif`,vw=`#ifdef USE_TRANSMISSION
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
#endif`,yw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Mw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,_w=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,bw=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Sw=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ww=`uniform sampler2D t2D;
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
}`,Ew=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Tw=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Aw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Rw=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Pw=`#include <common>
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
}`,Cw=`#if DEPTH_PACKING == 3200
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
}`,Dw=`#define DISTANCE
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
}`,Lw=`#define DISTANCE
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
}`,kw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Iw=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zw=`uniform float scale;
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
}`,Fw=`uniform vec3 diffuse;
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
}`,Uw=`#include <common>
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
}`,Nw=`uniform vec3 diffuse;
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
}`,Ow=`#define LAMBERT
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
}`,Bw=`#define LAMBERT
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
}`,Hw=`#define MATCAP
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
}`,Gw=`#define MATCAP
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
}`,Xw=`#define NORMAL
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
}`,Vw=`#define NORMAL
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
}`,Ww=`#define PHONG
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
}`,Yw=`#define PHONG
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
}`,$w=`#define STANDARD
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
}`,Zw=`#define STANDARD
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
}`,jw=`#define TOON
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
}`,qw=`#define TOON
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
}`,Kw=`uniform float size;
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
}`,Jw=`uniform vec3 diffuse;
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
}`,Qw=`#include <common>
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
}`,tE=`uniform vec3 color;
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
}`,eE=`uniform float rotation;
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
}`,nE=`uniform vec3 diffuse;
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
}`,_e={alphahash_fragment:w1,alphahash_pars_fragment:E1,alphamap_fragment:T1,alphamap_pars_fragment:A1,alphatest_fragment:R1,alphatest_pars_fragment:P1,aomap_fragment:C1,aomap_pars_fragment:D1,batching_pars_vertex:L1,batching_vertex:k1,begin_vertex:I1,beginnormal_vertex:z1,bsdfs:F1,iridescence_fragment:U1,bumpmap_pars_fragment:N1,clipping_planes_fragment:O1,clipping_planes_pars_fragment:B1,clipping_planes_pars_vertex:H1,clipping_planes_vertex:G1,color_fragment:X1,color_pars_fragment:V1,color_pars_vertex:W1,color_vertex:Y1,common:$1,cube_uv_reflection_fragment:Z1,defaultnormal_vertex:j1,displacementmap_pars_vertex:q1,displacementmap_vertex:K1,emissivemap_fragment:J1,emissivemap_pars_fragment:Q1,colorspace_fragment:tS,colorspace_pars_fragment:eS,envmap_fragment:nS,envmap_common_pars_fragment:iS,envmap_pars_fragment:aS,envmap_pars_vertex:sS,envmap_physical_pars_fragment:gS,envmap_vertex:oS,fog_vertex:rS,fog_pars_vertex:cS,fog_fragment:lS,fog_pars_fragment:dS,gradientmap_pars_fragment:hS,lightmap_pars_fragment:uS,lights_lambert_fragment:fS,lights_lambert_pars_fragment:pS,lights_pars_begin:mS,lights_toon_fragment:xS,lights_toon_pars_fragment:vS,lights_phong_fragment:yS,lights_phong_pars_fragment:MS,lights_physical_fragment:_S,lights_physical_pars_fragment:bS,lights_fragment_begin:SS,lights_fragment_maps:wS,lights_fragment_end:ES,logdepthbuf_fragment:TS,logdepthbuf_pars_fragment:AS,logdepthbuf_pars_vertex:RS,logdepthbuf_vertex:PS,map_fragment:CS,map_pars_fragment:DS,map_particle_fragment:LS,map_particle_pars_fragment:kS,metalnessmap_fragment:IS,metalnessmap_pars_fragment:zS,morphinstance_vertex:FS,morphcolor_vertex:US,morphnormal_vertex:NS,morphtarget_pars_vertex:OS,morphtarget_vertex:BS,normal_fragment_begin:HS,normal_fragment_maps:GS,normal_pars_fragment:XS,normal_pars_vertex:VS,normal_vertex:WS,normalmap_pars_fragment:YS,clearcoat_normal_fragment_begin:$S,clearcoat_normal_fragment_maps:ZS,clearcoat_pars_fragment:jS,iridescence_pars_fragment:qS,opaque_fragment:KS,packing:JS,premultiplied_alpha_fragment:QS,project_vertex:tw,dithering_fragment:ew,dithering_pars_fragment:nw,roughnessmap_fragment:iw,roughnessmap_pars_fragment:aw,shadowmap_pars_fragment:sw,shadowmap_pars_vertex:ow,shadowmap_vertex:rw,shadowmask_pars_fragment:cw,skinbase_vertex:lw,skinning_pars_vertex:dw,skinning_vertex:hw,skinnormal_vertex:uw,specularmap_fragment:fw,specularmap_pars_fragment:pw,tonemapping_fragment:mw,tonemapping_pars_fragment:gw,transmission_fragment:xw,transmission_pars_fragment:vw,uv_pars_fragment:yw,uv_pars_vertex:Mw,uv_vertex:_w,worldpos_vertex:bw,background_vert:Sw,background_frag:ww,backgroundCube_vert:Ew,backgroundCube_frag:Tw,cube_vert:Aw,cube_frag:Rw,depth_vert:Pw,depth_frag:Cw,distanceRGBA_vert:Dw,distanceRGBA_frag:Lw,equirect_vert:kw,equirect_frag:Iw,linedashed_vert:zw,linedashed_frag:Fw,meshbasic_vert:Uw,meshbasic_frag:Nw,meshlambert_vert:Ow,meshlambert_frag:Bw,meshmatcap_vert:Hw,meshmatcap_frag:Gw,meshnormal_vert:Xw,meshnormal_frag:Vw,meshphong_vert:Ww,meshphong_frag:Yw,meshphysical_vert:$w,meshphysical_frag:Zw,meshtoon_vert:jw,meshtoon_frag:qw,points_vert:Kw,points_frag:Jw,shadow_vert:Qw,shadow_frag:tE,sprite_vert:eE,sprite_frag:nE},Vt={common:{diffuse:{value:new Qt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Me},alphaMap:{value:null},alphaMapTransform:{value:new Me},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Me}},envmap:{envMap:{value:null},envMapRotation:{value:new Me},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Me}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Me}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Me},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Me},normalScale:{value:new Wt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Me},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Me}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Me}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Me}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Qt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Qt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Me},alphaTest:{value:0},uvTransform:{value:new Me}},sprite:{diffuse:{value:new Qt(16777215)},opacity:{value:1},center:{value:new Wt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Me},alphaMap:{value:null},alphaMapTransform:{value:new Me},alphaTest:{value:0}}},ki={basic:{uniforms:Bn([Vt.common,Vt.specularmap,Vt.envmap,Vt.aomap,Vt.lightmap,Vt.fog]),vertexShader:_e.meshbasic_vert,fragmentShader:_e.meshbasic_frag},lambert:{uniforms:Bn([Vt.common,Vt.specularmap,Vt.envmap,Vt.aomap,Vt.lightmap,Vt.emissivemap,Vt.bumpmap,Vt.normalmap,Vt.displacementmap,Vt.fog,Vt.lights,{emissive:{value:new Qt(0)}}]),vertexShader:_e.meshlambert_vert,fragmentShader:_e.meshlambert_frag},phong:{uniforms:Bn([Vt.common,Vt.specularmap,Vt.envmap,Vt.aomap,Vt.lightmap,Vt.emissivemap,Vt.bumpmap,Vt.normalmap,Vt.displacementmap,Vt.fog,Vt.lights,{emissive:{value:new Qt(0)},specular:{value:new Qt(1118481)},shininess:{value:30}}]),vertexShader:_e.meshphong_vert,fragmentShader:_e.meshphong_frag},standard:{uniforms:Bn([Vt.common,Vt.envmap,Vt.aomap,Vt.lightmap,Vt.emissivemap,Vt.bumpmap,Vt.normalmap,Vt.displacementmap,Vt.roughnessmap,Vt.metalnessmap,Vt.fog,Vt.lights,{emissive:{value:new Qt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:_e.meshphysical_vert,fragmentShader:_e.meshphysical_frag},toon:{uniforms:Bn([Vt.common,Vt.aomap,Vt.lightmap,Vt.emissivemap,Vt.bumpmap,Vt.normalmap,Vt.displacementmap,Vt.gradientmap,Vt.fog,Vt.lights,{emissive:{value:new Qt(0)}}]),vertexShader:_e.meshtoon_vert,fragmentShader:_e.meshtoon_frag},matcap:{uniforms:Bn([Vt.common,Vt.bumpmap,Vt.normalmap,Vt.displacementmap,Vt.fog,{matcap:{value:null}}]),vertexShader:_e.meshmatcap_vert,fragmentShader:_e.meshmatcap_frag},points:{uniforms:Bn([Vt.points,Vt.fog]),vertexShader:_e.points_vert,fragmentShader:_e.points_frag},dashed:{uniforms:Bn([Vt.common,Vt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:_e.linedashed_vert,fragmentShader:_e.linedashed_frag},depth:{uniforms:Bn([Vt.common,Vt.displacementmap]),vertexShader:_e.depth_vert,fragmentShader:_e.depth_frag},normal:{uniforms:Bn([Vt.common,Vt.bumpmap,Vt.normalmap,Vt.displacementmap,{opacity:{value:1}}]),vertexShader:_e.meshnormal_vert,fragmentShader:_e.meshnormal_frag},sprite:{uniforms:Bn([Vt.sprite,Vt.fog]),vertexShader:_e.sprite_vert,fragmentShader:_e.sprite_frag},background:{uniforms:{uvTransform:{value:new Me},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:_e.background_vert,fragmentShader:_e.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Me}},vertexShader:_e.backgroundCube_vert,fragmentShader:_e.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:_e.cube_vert,fragmentShader:_e.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:_e.equirect_vert,fragmentShader:_e.equirect_frag},distanceRGBA:{uniforms:Bn([Vt.common,Vt.displacementmap,{referencePosition:{value:new W},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:_e.distanceRGBA_vert,fragmentShader:_e.distanceRGBA_frag},shadow:{uniforms:Bn([Vt.lights,Vt.fog,{color:{value:new Qt(0)},opacity:{value:1}}]),vertexShader:_e.shadow_vert,fragmentShader:_e.shadow_frag}};ki.physical={uniforms:Bn([ki.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Me},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Me},clearcoatNormalScale:{value:new Wt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Me},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Me},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Me},sheen:{value:0},sheenColor:{value:new Qt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Me},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Me},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Me},transmissionSamplerSize:{value:new Wt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Me},attenuationDistance:{value:0},attenuationColor:{value:new Qt(0)},specularColor:{value:new Qt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Me},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Me},anisotropyVector:{value:new Wt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Me}}]),vertexShader:_e.meshphysical_vert,fragmentShader:_e.meshphysical_frag};const br={r:0,b:0,g:0},Ia=new Ni,iE=new Ce;function aE(n,t,e,i,a,s,o){const r=new Qt(0);let c=s===!0?0:1,l,d,u=null,h=0,f=null;function m(_){let x=_.isScene===!0?_.background:null;return x&&x.isTexture&&(x=(_.backgroundBlurriness>0?e:t).get(x)),x}function v(_){let x=!1;const y=m(_);y===null?p(r,c):y&&y.isColor&&(p(y,1),x=!0);const S=n.xr.getEnvironmentBlendMode();S==="additive"?i.buffers.color.setClear(0,0,0,1,o):S==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(_,x){const y=m(x);y&&(y.isCubeTexture||y.mapping===yc)?(d===void 0&&(d=new ve(new qn(1,1,1),new Sa({name:"BackgroundCubeMaterial",uniforms:Zs(ki.backgroundCube.uniforms),vertexShader:ki.backgroundCube.vertexShader,fragmentShader:ki.backgroundCube.fragmentShader,side:jn,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(S,w,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(d)),Ia.copy(x.backgroundRotation),Ia.x*=-1,Ia.y*=-1,Ia.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Ia.y*=-1,Ia.z*=-1),d.material.uniforms.envMap.value=y,d.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(iE.makeRotationFromEuler(Ia)),d.material.toneMapped=Te.getTransfer(y.colorSpace)!==Ne,(u!==y||h!==y.version||f!==n.toneMapping)&&(d.material.needsUpdate=!0,u=y,h=y.version,f=n.toneMapping),d.layers.enableAll(),_.unshift(d,d.geometry,d.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new ve(new Zn(2,2),new Sa({name:"BackgroundMaterial",uniforms:Zs(ki.background.uniforms),vertexShader:ki.background.vertexShader,fragmentShader:ki.background.fragmentShader,side:ba,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=Te.getTransfer(y.colorSpace)!==Ne,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||h!==y.version||f!==n.toneMapping)&&(l.material.needsUpdate=!0,u=y,h=y.version,f=n.toneMapping),l.layers.enableAll(),_.unshift(l,l.geometry,l.material,0,0,null))}function p(_,x){_.getRGB(br,Am(n)),i.buffers.color.setClear(br.r,br.g,br.b,x,o)}return{getClearColor:function(){return r},setClearColor:function(_,x=1){r.set(_),c=x,p(r,c)},getClearAlpha:function(){return c},setClearAlpha:function(_){c=_,p(r,c)},render:v,addToRenderList:g}}function sE(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},a=h(null);let s=a,o=!1;function r(M,C,k,D,F){let A=!1;const E=u(D,k,C);s!==E&&(s=E,l(s.object)),A=f(M,D,k,F),A&&m(M,D,k,F),F!==null&&t.update(F,n.ELEMENT_ARRAY_BUFFER),(A||o)&&(o=!1,y(M,C,k,D),F!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(F).buffer))}function c(){return n.createVertexArray()}function l(M){return n.bindVertexArray(M)}function d(M){return n.deleteVertexArray(M)}function u(M,C,k){const D=k.wireframe===!0;let F=i[M.id];F===void 0&&(F={},i[M.id]=F);let A=F[C.id];A===void 0&&(A={},F[C.id]=A);let E=A[D];return E===void 0&&(E=h(c()),A[D]=E),E}function h(M){const C=[],k=[],D=[];for(let F=0;F<e;F++)C[F]=0,k[F]=0,D[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:k,attributeDivisors:D,object:M,attributes:{},index:null}}function f(M,C,k,D){const F=s.attributes,A=C.attributes;let E=0;const z=k.getAttributes();for(const G in z)if(z[G].location>=0){const et=F[G];let ht=A[G];if(ht===void 0&&(G==="instanceMatrix"&&M.instanceMatrix&&(ht=M.instanceMatrix),G==="instanceColor"&&M.instanceColor&&(ht=M.instanceColor)),et===void 0||et.attribute!==ht||ht&&et.data!==ht.data)return!0;E++}return s.attributesNum!==E||s.index!==D}function m(M,C,k,D){const F={},A=C.attributes;let E=0;const z=k.getAttributes();for(const G in z)if(z[G].location>=0){let et=A[G];et===void 0&&(G==="instanceMatrix"&&M.instanceMatrix&&(et=M.instanceMatrix),G==="instanceColor"&&M.instanceColor&&(et=M.instanceColor));const ht={};ht.attribute=et,et&&et.data&&(ht.data=et.data),F[G]=ht,E++}s.attributes=F,s.attributesNum=E,s.index=D}function v(){const M=s.newAttributes;for(let C=0,k=M.length;C<k;C++)M[C]=0}function g(M){p(M,0)}function p(M,C){const k=s.newAttributes,D=s.enabledAttributes,F=s.attributeDivisors;k[M]=1,D[M]===0&&(n.enableVertexAttribArray(M),D[M]=1),F[M]!==C&&(n.vertexAttribDivisor(M,C),F[M]=C)}function _(){const M=s.newAttributes,C=s.enabledAttributes;for(let k=0,D=C.length;k<D;k++)C[k]!==M[k]&&(n.disableVertexAttribArray(k),C[k]=0)}function x(M,C,k,D,F,A,E){E===!0?n.vertexAttribIPointer(M,C,k,F,A):n.vertexAttribPointer(M,C,k,D,F,A)}function y(M,C,k,D){v();const F=D.attributes,A=k.getAttributes(),E=C.defaultAttributeValues;for(const z in A){const G=A[z];if(G.location>=0){let X=F[z];if(X===void 0&&(z==="instanceMatrix"&&M.instanceMatrix&&(X=M.instanceMatrix),z==="instanceColor"&&M.instanceColor&&(X=M.instanceColor)),X!==void 0){const et=X.normalized,ht=X.itemSize,gt=t.get(X);if(gt===void 0)continue;const Lt=gt.buffer,Z=gt.type,B=gt.bytesPerElement,Y=Z===n.INT||Z===n.UNSIGNED_INT||X.gpuType===ih;if(X.isInterleavedBufferAttribute){const q=X.data,K=q.stride,st=X.offset;if(q.isInstancedInterleavedBuffer){for(let Tt=0;Tt<G.locationSize;Tt++)p(G.location+Tt,q.meshPerAttribute);M.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=q.meshPerAttribute*q.count)}else for(let Tt=0;Tt<G.locationSize;Tt++)g(G.location+Tt);n.bindBuffer(n.ARRAY_BUFFER,Lt);for(let Tt=0;Tt<G.locationSize;Tt++)x(G.location+Tt,ht/G.locationSize,Z,et,K*B,(st+ht/G.locationSize*Tt)*B,Y)}else{if(X.isInstancedBufferAttribute){for(let q=0;q<G.locationSize;q++)p(G.location+q,X.meshPerAttribute);M.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=X.meshPerAttribute*X.count)}else for(let q=0;q<G.locationSize;q++)g(G.location+q);n.bindBuffer(n.ARRAY_BUFFER,Lt);for(let q=0;q<G.locationSize;q++)x(G.location+q,ht/G.locationSize,Z,et,ht*B,ht/G.locationSize*q*B,Y)}}else if(E!==void 0){const et=E[z];if(et!==void 0)switch(et.length){case 2:n.vertexAttrib2fv(G.location,et);break;case 3:n.vertexAttrib3fv(G.location,et);break;case 4:n.vertexAttrib4fv(G.location,et);break;default:n.vertexAttrib1fv(G.location,et)}}}}_()}function S(){R();for(const M in i){const C=i[M];for(const k in C){const D=C[k];for(const F in D)d(D[F].object),delete D[F];delete C[k]}delete i[M]}}function w(M){if(i[M.id]===void 0)return;const C=i[M.id];for(const k in C){const D=C[k];for(const F in D)d(D[F].object),delete D[F];delete C[k]}delete i[M.id]}function T(M){for(const C in i){const k=i[C];if(k[M.id]===void 0)continue;const D=k[M.id];for(const F in D)d(D[F].object),delete D[F];delete k[M.id]}}function R(){b(),o=!0,s!==a&&(s=a,l(s.object))}function b(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:r,reset:R,resetDefaultState:b,dispose:S,releaseStatesOfGeometry:w,releaseStatesOfProgram:T,initAttributes:v,enableAttribute:g,disableUnusedAttributes:_}}function oE(n,t,e){let i;function a(l){i=l}function s(l,d){n.drawArrays(i,l,d),e.update(d,i,1)}function o(l,d,u){u!==0&&(n.drawArraysInstanced(i,l,d,u),e.update(d,i,u))}function r(l,d,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,d,0,u);let f=0;for(let m=0;m<u;m++)f+=d[m];e.update(f,i,1)}function c(l,d,u,h){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<l.length;m++)o(l[m],d[m],h[m]);else{f.multiDrawArraysInstancedWEBGL(i,l,0,d,0,h,0,u);let m=0;for(let v=0;v<u;v++)m+=d[v]*h[v];e.update(m,i,1)}}this.setMode=a,this.render=s,this.renderInstances=o,this.renderMultiDraw=r,this.renderMultiDrawInstances=c}function rE(n,t,e,i){let a;function s(){if(a!==void 0)return a;if(t.has("EXT_texture_filter_anisotropic")===!0){const T=t.get("EXT_texture_filter_anisotropic");a=n.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function o(T){return!(T!==Si&&i.convert(T)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(T){const R=T===$o&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(T!==na&&i.convert(T)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==zi&&!R)}function c(T){if(T==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const d=c(l);d!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);const u=e.logarithmicDepthBuffer===!0,h=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),_=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),x=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),S=m>0,w=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:r,precision:l,logarithmicDepthBuffer:u,reverseDepthBuffer:h,maxTextures:f,maxVertexTextures:m,maxTextureSize:v,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:_,maxVaryings:x,maxFragmentUniforms:y,vertexTextures:S,maxSamples:w}}function cE(n){const t=this;let e=null,i=0,a=!1,s=!1;const o=new Ba,r=new Me,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,h){const f=u.length!==0||h||i!==0||a;return a=h,i=u.length,f},this.beginShadows=function(){s=!0,d(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,h){e=d(u,h,0)},this.setState=function(u,h,f){const m=u.clippingPlanes,v=u.clipIntersection,g=u.clipShadows,p=n.get(u);if(!a||m===null||m.length===0||s&&!g)s?d(null):l();else{const _=s?0:i,x=_*4;let y=p.clippingState||null;c.value=y,y=d(m,h,x,f);for(let S=0;S!==x;++S)y[S]=e[S];p.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=_}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function d(u,h,f,m){const v=u!==null?u.length:0;let g=null;if(v!==0){if(g=c.value,m!==!0||g===null){const p=f+v*4,_=h.matrixWorldInverse;r.getNormalMatrix(_),(g===null||g.length<p)&&(g=new Float32Array(p));for(let x=0,y=f;x!==v;++x,y+=4)o.copy(u[x]).applyMatrix4(_,r),o.normal.toArray(g,y),g[y+3]=o.constant}c.value=g,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,g}}function lE(n){let t=new WeakMap;function e(o,r){return r===sd?o.mapping=Vs:r===od&&(o.mapping=Ws),o}function i(o){if(o&&o.isTexture){const r=o.mapping;if(r===sd||r===od)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new M1(c.height);return l.fromEquirectangularTexture(n,o),t.set(o,l),o.addEventListener("dispose",a),e(l.texture,o.mapping)}else return null}}return o}function a(o){const r=o.target;r.removeEventListener("dispose",a);const c=t.get(r);c!==void 0&&(t.delete(r),c.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}class Dm extends Rm{constructor(t=-1,e=1,i=1,a=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=a,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,a,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let s=i-t,o=i+t,r=a+e,c=a-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,o=s+l*this.view.width,r-=d*this.view.offsetY,c=r-d*this.view.height}this.projectionMatrix.makeOrthographic(s,o,r,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Ls=4,ff=[.125,.215,.35,.446,.526,.582],Va=20,ml=new Dm,pf=new Qt;let gl=null,xl=0,vl=0,yl=!1;const Ha=(1+Math.sqrt(5))/2,ws=1/Ha,mf=[new W(-Ha,ws,0),new W(Ha,ws,0),new W(-ws,0,Ha),new W(ws,0,Ha),new W(0,Ha,-ws),new W(0,Ha,ws),new W(-1,1,-1),new W(1,1,-1),new W(-1,1,1),new W(1,1,1)];class gf{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,a=100){gl=this._renderer.getRenderTarget(),xl=this._renderer.getActiveCubeFace(),vl=this._renderer.getActiveMipmapLevel(),yl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,i,a,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=yf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=vf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(gl,xl,vl),this._renderer.xr.enabled=yl,t.scissorTest=!1,Sr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Vs||t.mapping===Ws?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),gl=this._renderer.getRenderTarget(),xl=this._renderer.getActiveCubeFace(),vl=this._renderer.getActiveMipmapLevel(),yl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Ii,minFilter:Ii,generateMipmaps:!1,type:$o,format:Si,colorSpace:js,depthBuffer:!1},a=xf(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=xf(t,e,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=dE(s)),this._blurMaterial=hE(s,t,e)}return a}_compileMaterial(t){const e=new ve(this._lodPlanes[0],t);this._renderer.compile(e,ml)}_sceneToCubeUV(t,e,i,a){const r=new fi(90,1,e,i),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,h=d.toneMapping;d.getClearColor(pf),d.toneMapping=ya,d.autoClear=!1;const f=new Sn({name:"PMREM.Background",side:jn,depthWrite:!1,depthTest:!1}),m=new ve(new qn,f);let v=!1;const g=t.background;g?g.isColor&&(f.color.copy(g),t.background=null,v=!0):(f.color.copy(pf),v=!0);for(let p=0;p<6;p++){const _=p%3;_===0?(r.up.set(0,c[p],0),r.lookAt(l[p],0,0)):_===1?(r.up.set(0,0,c[p]),r.lookAt(0,l[p],0)):(r.up.set(0,c[p],0),r.lookAt(0,0,l[p]));const x=this._cubeSize;Sr(a,_*x,p>2?x:0,x,x),d.setRenderTarget(a),v&&d.render(m,r),d.render(t,r)}m.geometry.dispose(),m.material.dispose(),d.toneMapping=h,d.autoClear=u,t.background=g}_textureToCubeUV(t,e){const i=this._renderer,a=t.mapping===Vs||t.mapping===Ws;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=yf()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=vf());const s=a?this._cubemapMaterial:this._equirectMaterial,o=new ve(this._lodPlanes[0],s),r=s.uniforms;r.envMap.value=t;const c=this._cubeSize;Sr(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(o,ml)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const a=this._lodPlanes.length;for(let s=1;s<a;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),r=mf[(a-s-1)%mf.length];this._blur(t,s-1,s,o,r)}e.autoClear=i}_blur(t,e,i,a,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,a,"latitudinal",s),this._halfBlur(o,t,i,i,a,"longitudinal",s)}_halfBlur(t,e,i,a,s,o,r){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,u=new ve(this._lodPlanes[a],l),h=l.uniforms,f=this._sizeLods[i]-1,m=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*Va-1),v=s/m,g=isFinite(s)?1+Math.floor(d*v):Va;g>Va&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Va}`);const p=[];let _=0;for(let T=0;T<Va;++T){const R=T/v,b=Math.exp(-R*R/2);p.push(b),T===0?_+=b:T<g&&(_+=2*b)}for(let T=0;T<p.length;T++)p[T]=p[T]/_;h.envMap.value=t.texture,h.samples.value=g,h.weights.value=p,h.latitudinal.value=o==="latitudinal",r&&(h.poleAxis.value=r);const{_lodMax:x}=this;h.dTheta.value=m,h.mipInt.value=x-i;const y=this._sizeLods[a],S=3*y*(a>x-Ls?a-x+Ls:0),w=4*(this._cubeSize-y);Sr(e,S,w,3*y,2*y),c.setRenderTarget(e),c.render(u,ml)}}function dE(n){const t=[],e=[],i=[];let a=n;const s=n-Ls+1+ff.length;for(let o=0;o<s;o++){const r=Math.pow(2,a);e.push(r);let c=1/r;o>n-Ls?c=ff[o-n+Ls-1]:o===0&&(c=0),i.push(c);const l=1/(r-2),d=-l,u=1+l,h=[d,d,u,d,u,u,d,d,u,u,d,u],f=6,m=6,v=3,g=2,p=1,_=new Float32Array(v*m*f),x=new Float32Array(g*m*f),y=new Float32Array(p*m*f);for(let w=0;w<f;w++){const T=w%3*2/3-1,R=w>2?0:-1,b=[T,R,0,T+2/3,R,0,T+2/3,R+1,0,T,R,0,T+2/3,R+1,0,T,R+1,0];_.set(b,v*m*w),x.set(h,g*m*w);const M=[w,w,w,w,w,w];y.set(M,p*m*w)}const S=new en;S.setAttribute("position",new wn(_,v)),S.setAttribute("uv",new wn(x,g)),S.setAttribute("faceIndex",new wn(y,p)),t.push(S),a>Ls&&a--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function xf(n,t,e){const i=new qa(n,t,e);return i.texture.mapping=yc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Sr(n,t,e,i,a){n.viewport.set(t,e,i,a),n.scissor.set(t,e,i,a)}function hE(n,t,e){const i=new Float32Array(Va),a=new W(0,1,0);return new Sa({name:"SphericalGaussianBlur",defines:{n:Va,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:ph(),fragmentShader:`

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
		`,blending:va,depthTest:!1,depthWrite:!1})}function vf(){return new Sa({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ph(),fragmentShader:`

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
		`,blending:va,depthTest:!1,depthWrite:!1})}function yf(){return new Sa({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ph(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:va,depthTest:!1,depthWrite:!1})}function ph(){return`

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
	`}function uE(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const c=r.mapping,l=c===sd||c===od,d=c===Vs||c===Ws;if(l||d){let u=t.get(r);const h=u!==void 0?u.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==h)return e===null&&(e=new gf(n)),u=l?e.fromEquirectangular(r,u):e.fromCubemap(r,u),u.texture.pmremVersion=r.pmremVersion,t.set(r,u),u.texture;if(u!==void 0)return u.texture;{const f=r.image;return l&&f&&f.height>0||d&&f&&a(f)?(e===null&&(e=new gf(n)),u=l?e.fromEquirectangular(r):e.fromCubemap(r),u.texture.pmremVersion=r.pmremVersion,t.set(r,u),r.addEventListener("dispose",s),u.texture):null}}}return r}function a(r){let c=0;const l=6;for(let d=0;d<l;d++)r[d]!==void 0&&c++;return c===l}function s(r){const c=r.target;c.removeEventListener("dispose",s);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function fE(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let a;switch(i){case"WEBGL_depth_texture":a=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=n.getExtension(i)}return t[i]=a,a}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const a=e(i);return a===null&&bo("THREE.WebGLRenderer: "+i+" extension not supported."),a}}}function pE(n,t,e,i){const a={},s=new WeakMap;function o(u){const h=u.target;h.index!==null&&t.remove(h.index);for(const m in h.attributes)t.remove(h.attributes[m]);for(const m in h.morphAttributes){const v=h.morphAttributes[m];for(let g=0,p=v.length;g<p;g++)t.remove(v[g])}h.removeEventListener("dispose",o),delete a[h.id];const f=s.get(h);f&&(t.remove(f),s.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,e.memory.geometries--}function r(u,h){return a[h.id]===!0||(h.addEventListener("dispose",o),a[h.id]=!0,e.memory.geometries++),h}function c(u){const h=u.attributes;for(const m in h)t.update(h[m],n.ARRAY_BUFFER);const f=u.morphAttributes;for(const m in f){const v=f[m];for(let g=0,p=v.length;g<p;g++)t.update(v[g],n.ARRAY_BUFFER)}}function l(u){const h=[],f=u.index,m=u.attributes.position;let v=0;if(f!==null){const _=f.array;v=f.version;for(let x=0,y=_.length;x<y;x+=3){const S=_[x+0],w=_[x+1],T=_[x+2];h.push(S,w,w,T,T,S)}}else if(m!==void 0){const _=m.array;v=m.version;for(let x=0,y=_.length/3-1;x<y;x+=3){const S=x+0,w=x+1,T=x+2;h.push(S,w,w,T,T,S)}}else return;const g=new(_m(h)?Tm:Em)(h,1);g.version=v;const p=s.get(u);p&&t.remove(p),s.set(u,g)}function d(u){const h=s.get(u);if(h){const f=u.index;f!==null&&h.version<f.version&&l(u)}else l(u);return s.get(u)}return{get:r,update:c,getWireframeAttribute:d}}function mE(n,t,e){let i;function a(h){i=h}let s,o;function r(h){s=h.type,o=h.bytesPerElement}function c(h,f){n.drawElements(i,f,s,h*o),e.update(f,i,1)}function l(h,f,m){m!==0&&(n.drawElementsInstanced(i,f,s,h*o,m),e.update(f,i,m))}function d(h,f,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,s,h,0,m);let g=0;for(let p=0;p<m;p++)g+=f[p];e.update(g,i,1)}function u(h,f,m,v){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<h.length;p++)l(h[p]/o,f[p],v[p]);else{g.multiDrawElementsInstancedWEBGL(i,f,0,s,h,0,v,0,m);let p=0;for(let _=0;_<m;_++)p+=f[_]*v[_];e.update(p,i,1)}}this.setMode=a,this.setIndex=r,this.render=c,this.renderInstances=l,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function gE(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,r){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=r*(s/3);break;case n.LINES:e.lines+=r*(s/2);break;case n.LINE_STRIP:e.lines+=r*(s-1);break;case n.LINE_LOOP:e.lines+=r*s;break;case n.POINTS:e.points+=r*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function a(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:a,update:i}}function xE(n,t,e){const i=new WeakMap,a=new sn;function s(o,r,c){const l=o.morphTargetInfluences,d=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,u=d!==void 0?d.length:0;let h=i.get(r);if(h===void 0||h.count!==u){let M=function(){R.dispose(),i.delete(r),r.removeEventListener("dispose",M)};var f=M;h!==void 0&&h.texture.dispose();const m=r.morphAttributes.position!==void 0,v=r.morphAttributes.normal!==void 0,g=r.morphAttributes.color!==void 0,p=r.morphAttributes.position||[],_=r.morphAttributes.normal||[],x=r.morphAttributes.color||[];let y=0;m===!0&&(y=1),v===!0&&(y=2),g===!0&&(y=3);let S=r.attributes.position.count*y,w=1;S>t.maxTextureSize&&(w=Math.ceil(S/t.maxTextureSize),S=t.maxTextureSize);const T=new Float32Array(S*w*4*u),R=new Sm(T,S,w,u);R.type=zi,R.needsUpdate=!0;const b=y*4;for(let C=0;C<u;C++){const k=p[C],D=_[C],F=x[C],A=S*w*4*C;for(let E=0;E<k.count;E++){const z=E*b;m===!0&&(a.fromBufferAttribute(k,E),T[A+z+0]=a.x,T[A+z+1]=a.y,T[A+z+2]=a.z,T[A+z+3]=0),v===!0&&(a.fromBufferAttribute(D,E),T[A+z+4]=a.x,T[A+z+5]=a.y,T[A+z+6]=a.z,T[A+z+7]=0),g===!0&&(a.fromBufferAttribute(F,E),T[A+z+8]=a.x,T[A+z+9]=a.y,T[A+z+10]=a.z,T[A+z+11]=F.itemSize===4?a.w:1)}}h={count:u,texture:R,size:new Wt(S,w)},i.set(r,h),r.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let m=0;for(let g=0;g<l.length;g++)m+=l[g];const v=r.morphTargetsRelative?1:1-m;c.getUniforms().setValue(n,"morphTargetBaseInfluence",v),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",h.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:s}}function vE(n,t,e,i){let a=new WeakMap;function s(c){const l=i.render.frame,d=c.geometry,u=t.get(c,d);if(a.get(u)!==l&&(t.update(u),a.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",r)===!1&&c.addEventListener("dispose",r),a.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),a.set(c,l))),c.isSkinnedMesh){const h=c.skeleton;a.get(h)!==l&&(h.update(),a.set(h,l))}return u}function o(){a=new WeakMap}function r(c){const l=c.target;l.removeEventListener("dispose",r),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:s,dispose:o}}class Lm extends Fn{constructor(t,e,i,a,s,o,r,c,l,d=Fs){if(d!==Fs&&d!==$s)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&d===Fs&&(i=ja),i===void 0&&d===$s&&(i=Ys),super(null,a,s,o,r,c,d,i,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:oi,this.minFilter=c!==void 0?c:oi,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const km=new Fn,Mf=new Lm(1,1),Im=new Sm,zm=new a1,Fm=new Pm,_f=[],bf=[],Sf=new Float32Array(16),wf=new Float32Array(9),Ef=new Float32Array(4);function Js(n,t,e){const i=n[0];if(i<=0||i>0)return n;const a=t*e;let s=_f[a];if(s===void 0&&(s=new Float32Array(a),_f[a]=s),t!==0){i.toArray(s,0);for(let o=1,r=0;o!==t;++o)r+=e,n[o].toArray(s,r)}return s}function gn(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function xn(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function _c(n,t){let e=bf[t];e===void 0&&(e=new Int32Array(t),bf[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function yE(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function ME(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(gn(e,t))return;n.uniform2fv(this.addr,t),xn(e,t)}}function _E(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(gn(e,t))return;n.uniform3fv(this.addr,t),xn(e,t)}}function bE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(gn(e,t))return;n.uniform4fv(this.addr,t),xn(e,t)}}function SE(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(gn(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),xn(e,t)}else{if(gn(e,i))return;Ef.set(i),n.uniformMatrix2fv(this.addr,!1,Ef),xn(e,i)}}function wE(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(gn(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),xn(e,t)}else{if(gn(e,i))return;wf.set(i),n.uniformMatrix3fv(this.addr,!1,wf),xn(e,i)}}function EE(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(gn(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),xn(e,t)}else{if(gn(e,i))return;Sf.set(i),n.uniformMatrix4fv(this.addr,!1,Sf),xn(e,i)}}function TE(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function AE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(gn(e,t))return;n.uniform2iv(this.addr,t),xn(e,t)}}function RE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(gn(e,t))return;n.uniform3iv(this.addr,t),xn(e,t)}}function PE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(gn(e,t))return;n.uniform4iv(this.addr,t),xn(e,t)}}function CE(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function DE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(gn(e,t))return;n.uniform2uiv(this.addr,t),xn(e,t)}}function LE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(gn(e,t))return;n.uniform3uiv(this.addr,t),xn(e,t)}}function kE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(gn(e,t))return;n.uniform4uiv(this.addr,t),xn(e,t)}}function IE(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a);let s;this.type===n.SAMPLER_2D_SHADOW?(Mf.compareFunction=Mm,s=Mf):s=km,e.setTexture2D(t||s,a)}function zE(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture3D(t||zm,a)}function FE(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTextureCube(t||Fm,a)}function UE(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture2DArray(t||Im,a)}function NE(n){switch(n){case 5126:return yE;case 35664:return ME;case 35665:return _E;case 35666:return bE;case 35674:return SE;case 35675:return wE;case 35676:return EE;case 5124:case 35670:return TE;case 35667:case 35671:return AE;case 35668:case 35672:return RE;case 35669:case 35673:return PE;case 5125:return CE;case 36294:return DE;case 36295:return LE;case 36296:return kE;case 35678:case 36198:case 36298:case 36306:case 35682:return IE;case 35679:case 36299:case 36307:return zE;case 35680:case 36300:case 36308:case 36293:return FE;case 36289:case 36303:case 36311:case 36292:return UE}}function OE(n,t){n.uniform1fv(this.addr,t)}function BE(n,t){const e=Js(t,this.size,2);n.uniform2fv(this.addr,e)}function HE(n,t){const e=Js(t,this.size,3);n.uniform3fv(this.addr,e)}function GE(n,t){const e=Js(t,this.size,4);n.uniform4fv(this.addr,e)}function XE(n,t){const e=Js(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function VE(n,t){const e=Js(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function WE(n,t){const e=Js(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function YE(n,t){n.uniform1iv(this.addr,t)}function $E(n,t){n.uniform2iv(this.addr,t)}function ZE(n,t){n.uniform3iv(this.addr,t)}function jE(n,t){n.uniform4iv(this.addr,t)}function qE(n,t){n.uniform1uiv(this.addr,t)}function KE(n,t){n.uniform2uiv(this.addr,t)}function JE(n,t){n.uniform3uiv(this.addr,t)}function QE(n,t){n.uniform4uiv(this.addr,t)}function tT(n,t,e){const i=this.cache,a=t.length,s=_c(e,a);gn(i,s)||(n.uniform1iv(this.addr,s),xn(i,s));for(let o=0;o!==a;++o)e.setTexture2D(t[o]||km,s[o])}function eT(n,t,e){const i=this.cache,a=t.length,s=_c(e,a);gn(i,s)||(n.uniform1iv(this.addr,s),xn(i,s));for(let o=0;o!==a;++o)e.setTexture3D(t[o]||zm,s[o])}function nT(n,t,e){const i=this.cache,a=t.length,s=_c(e,a);gn(i,s)||(n.uniform1iv(this.addr,s),xn(i,s));for(let o=0;o!==a;++o)e.setTextureCube(t[o]||Fm,s[o])}function iT(n,t,e){const i=this.cache,a=t.length,s=_c(e,a);gn(i,s)||(n.uniform1iv(this.addr,s),xn(i,s));for(let o=0;o!==a;++o)e.setTexture2DArray(t[o]||Im,s[o])}function aT(n){switch(n){case 5126:return OE;case 35664:return BE;case 35665:return HE;case 35666:return GE;case 35674:return XE;case 35675:return VE;case 35676:return WE;case 5124:case 35670:return YE;case 35667:case 35671:return $E;case 35668:case 35672:return ZE;case 35669:case 35673:return jE;case 5125:return qE;case 36294:return KE;case 36295:return JE;case 36296:return QE;case 35678:case 36198:case 36298:case 36306:case 35682:return tT;case 35679:case 36299:case 36307:return eT;case 35680:case 36300:case 36308:case 36293:return nT;case 36289:case 36303:case 36311:case 36292:return iT}}class sT{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=NE(e.type)}}class oT{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=aT(e.type)}}class rT{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const a=this.seq;for(let s=0,o=a.length;s!==o;++s){const r=a[s];r.setValue(t,e[r.id],i)}}}const Ml=/(\w+)(\])?(\[|\.)?/g;function Tf(n,t){n.seq.push(t),n.map[t.id]=t}function cT(n,t,e){const i=n.name,a=i.length;for(Ml.lastIndex=0;;){const s=Ml.exec(i),o=Ml.lastIndex;let r=s[1];const c=s[2]==="]",l=s[3];if(c&&(r=r|0),l===void 0||l==="["&&o+2===a){Tf(e,l===void 0?new sT(r,n,t):new oT(r,n,t));break}else{let u=e.map[r];u===void 0&&(u=new rT(r),Tf(e,u)),e=u}}}class Yr{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const s=t.getActiveUniform(e,a),o=t.getUniformLocation(e,s.name);cT(s,o,this)}}setValue(t,e,i,a){const s=this.map[e];s!==void 0&&s.setValue(t,i,a)}setOptional(t,e,i){const a=e[i];a!==void 0&&this.setValue(t,i,a)}static upload(t,e,i,a){for(let s=0,o=e.length;s!==o;++s){const r=e[s],c=i[r.id];c.needsUpdate!==!1&&r.setValue(t,c.value,a)}}static seqWithValue(t,e){const i=[];for(let a=0,s=t.length;a!==s;++a){const o=t[a];o.id in e&&i.push(o)}return i}}function Af(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const lT=37297;let dT=0;function hT(n,t){const e=n.split(`
`),i=[],a=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=a;o<s;o++){const r=o+1;i.push(`${r===t?">":" "} ${r}: ${e[o]}`)}return i.join(`
`)}const Rf=new Me;function uT(n){Te._getMatrix(Rf,Te.workingColorSpace,n);const t=`mat3( ${Rf.elements.map(e=>e.toFixed(4))} )`;switch(Te.getTransfer(n)){case Mc:return[t,"LinearTransferOETF"];case Ne:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Pf(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),a=n.getShaderInfoLog(t).trim();if(i&&a==="")return"";const s=/ERROR: 0:(\d+)/.exec(a);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+a+`

`+hT(n.getShaderSource(t),o)}else return a}function fT(n,t){const e=uT(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function pT(n,t){let e;switch(t){case gb:e="Linear";break;case xb:e="Reinhard";break;case vb:e="Cineon";break;case yb:e="ACESFilmic";break;case _b:e="AgX";break;case bb:e="Neutral";break;case Mb:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const wr=new W;function mT(){Te.getLuminanceCoefficients(wr);const n=wr.x.toFixed(4),t=wr.y.toFixed(4),e=wr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function gT(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(So).join(`
`)}function xT(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function vT(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let a=0;a<i;a++){const s=n.getActiveAttrib(t,a),o=s.name;let r=1;s.type===n.FLOAT_MAT2&&(r=2),s.type===n.FLOAT_MAT3&&(r=3),s.type===n.FLOAT_MAT4&&(r=4),e[o]={type:s.type,location:n.getAttribLocation(t,o),locationSize:r}}return e}function So(n){return n!==""}function Cf(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Df(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const yT=/^[ \t]*#include +<([\w\d./]+)>/gm;function Fd(n){return n.replace(yT,_T)}const MT=new Map;function _T(n,t){let e=_e[t];if(e===void 0){const i=MT.get(t);if(i!==void 0)e=_e[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Fd(e)}const bT=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Lf(n){return n.replace(bT,ST)}function ST(n,t,e,i){let a="";for(let s=parseInt(t);s<parseInt(e);s++)a+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return a}function kf(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function wT(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===rm?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===cm?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===qi&&(t="SHADOWMAP_TYPE_VSM"),t}function ET(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Vs:case Ws:t="ENVMAP_TYPE_CUBE";break;case yc:t="ENVMAP_TYPE_CUBE_UV";break}return t}function TT(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Ws:t="ENVMAP_MODE_REFRACTION";break}return t}function AT(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case nh:t="ENVMAP_BLENDING_MULTIPLY";break;case pb:t="ENVMAP_BLENDING_MIX";break;case mb:t="ENVMAP_BLENDING_ADD";break}return t}function RT(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function PT(n,t,e,i){const a=n.getContext(),s=e.defines;let o=e.vertexShader,r=e.fragmentShader;const c=wT(e),l=ET(e),d=TT(e),u=AT(e),h=RT(e),f=gT(e),m=xT(s),v=a.createProgram();let g,p,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(So).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(So).join(`
`),p.length>0&&(p+=`
`)):(g=[kf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+d:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(So).join(`
`),p=[kf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+d:"",e.envMap?"#define "+u:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ya?"#define TONE_MAPPING":"",e.toneMapping!==ya?_e.tonemapping_pars_fragment:"",e.toneMapping!==ya?pT("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",_e.colorspace_pars_fragment,fT("linearToOutputTexel",e.outputColorSpace),mT(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(So).join(`
`)),o=Fd(o),o=Cf(o,e),o=Df(o,e),r=Fd(r),r=Cf(r,e),r=Df(r,e),o=Lf(o),r=Lf(r),e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===Xu?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Xu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=_+g+o,y=_+p+r,S=Af(a,a.VERTEX_SHADER,x),w=Af(a,a.FRAGMENT_SHADER,y);a.attachShader(v,S),a.attachShader(v,w),e.index0AttributeName!==void 0?a.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&a.bindAttribLocation(v,0,"position"),a.linkProgram(v);function T(C){if(n.debug.checkShaderErrors){const k=a.getProgramInfoLog(v).trim(),D=a.getShaderInfoLog(S).trim(),F=a.getShaderInfoLog(w).trim();let A=!0,E=!0;if(a.getProgramParameter(v,a.LINK_STATUS)===!1)if(A=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(a,v,S,w);else{const z=Pf(a,S,"vertex"),G=Pf(a,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(v,a.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+k+`
`+z+`
`+G)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(D===""||F==="")&&(E=!1);E&&(C.diagnostics={runnable:A,programLog:k,vertexShader:{log:D,prefix:g},fragmentShader:{log:F,prefix:p}})}a.deleteShader(S),a.deleteShader(w),R=new Yr(a,v),b=vT(a,v)}let R;this.getUniforms=function(){return R===void 0&&T(this),R};let b;this.getAttributes=function(){return b===void 0&&T(this),b};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=a.getProgramParameter(v,lT)),M},this.destroy=function(){i.releaseStatesOfProgram(this),a.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=dT++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=S,this.fragmentShader=w,this}let CT=0;class DT{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,a=this._getShaderStage(e),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(a)===!1&&(o.add(a),a.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new LT(t),e.set(t,i)),i}}class LT{constructor(t){this.id=CT++,this.code=t,this.usedTimes=0}}function kT(n,t,e,i,a,s,o){const r=new uh,c=new DT,l=new Set,d=[],u=a.logarithmicDepthBuffer,h=a.vertexTextures;let f=a.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(b){return l.add(b),b===0?"uv":`uv${b}`}function g(b,M,C,k,D){const F=k.fog,A=D.geometry,E=b.isMeshStandardMaterial?k.environment:null,z=(b.isMeshStandardMaterial?e:t).get(b.envMap||E),G=z&&z.mapping===yc?z.image.height:null,X=m[b.type];b.precision!==null&&(f=a.getMaxPrecision(b.precision),f!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",f,"instead."));const et=A.morphAttributes.position||A.morphAttributes.normal||A.morphAttributes.color,ht=et!==void 0?et.length:0;let gt=0;A.morphAttributes.position!==void 0&&(gt=1),A.morphAttributes.normal!==void 0&&(gt=2),A.morphAttributes.color!==void 0&&(gt=3);let Lt,Z,B,Y;if(X){const ee=ki[X];Lt=ee.vertexShader,Z=ee.fragmentShader}else Lt=b.vertexShader,Z=b.fragmentShader,c.update(b),B=c.getVertexShaderID(b),Y=c.getFragmentShaderID(b);const q=n.getRenderTarget(),K=n.state.buffers.depth.getReversed(),st=D.isInstancedMesh===!0,Tt=D.isBatchedMesh===!0,Gt=!!b.map,J=!!b.matcap,V=!!z,O=!!b.aoMap,Pt=!!b.lightMap,Et=!!b.bumpMap,lt=!!b.normalMap,vt=!!b.displacementMap,ft=!!b.emissiveMap,Rt=!!b.metalnessMap,L=!!b.roughnessMap,P=b.anisotropy>0,Q=b.clearcoat>0,mt=b.dispersion>0,ot=b.iridescence>0,dt=b.sheen>0,zt=b.transmission>0,Ct=P&&!!b.anisotropyMap,St=Q&&!!b.clearcoatMap,Yt=Q&&!!b.clearcoatNormalMap,xt=Q&&!!b.clearcoatRoughnessMap,Ut=ot&&!!b.iridescenceMap,tt=ot&&!!b.iridescenceThicknessMap,j=dt&&!!b.sheenColorMap,pt=dt&&!!b.sheenRoughnessMap,Ht=!!b.specularMap,Nt=!!b.specularColorMap,It=!!b.specularIntensityMap,U=zt&&!!b.transmissionMap,bt=zt&&!!b.thicknessMap,$=!!b.gradientMap,ut=!!b.alphaMap,Ft=b.alphaTest>0,Dt=!!b.alphaHash,qt=!!b.extensions;let le=ya;b.toneMapped&&(q===null||q.isXRRenderTarget===!0)&&(le=n.toneMapping);const de={shaderID:X,shaderType:b.type,shaderName:b.name,vertexShader:Lt,fragmentShader:Z,defines:b.defines,customVertexShaderID:B,customFragmentShaderID:Y,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:f,batching:Tt,batchingColor:Tt&&D._colorsTexture!==null,instancing:st,instancingColor:st&&D.instanceColor!==null,instancingMorph:st&&D.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:q===null?n.outputColorSpace:q.isXRRenderTarget===!0?q.texture.colorSpace:js,alphaToCoverage:!!b.alphaToCoverage,map:Gt,matcap:J,envMap:V,envMapMode:V&&z.mapping,envMapCubeUVHeight:G,aoMap:O,lightMap:Pt,bumpMap:Et,normalMap:lt,displacementMap:h&&vt,emissiveMap:ft,normalMapObjectSpace:lt&&b.normalMapType===Tb,normalMapTangentSpace:lt&&b.normalMapType===ym,metalnessMap:Rt,roughnessMap:L,anisotropy:P,anisotropyMap:Ct,clearcoat:Q,clearcoatMap:St,clearcoatNormalMap:Yt,clearcoatRoughnessMap:xt,dispersion:mt,iridescence:ot,iridescenceMap:Ut,iridescenceThicknessMap:tt,sheen:dt,sheenColorMap:j,sheenRoughnessMap:pt,specularMap:Ht,specularColorMap:Nt,specularIntensityMap:It,transmission:zt,transmissionMap:U,thicknessMap:bt,gradientMap:$,opaque:b.transparent===!1&&b.blending===zs&&b.alphaToCoverage===!1,alphaMap:ut,alphaTest:Ft,alphaHash:Dt,combine:b.combine,mapUv:Gt&&v(b.map.channel),aoMapUv:O&&v(b.aoMap.channel),lightMapUv:Pt&&v(b.lightMap.channel),bumpMapUv:Et&&v(b.bumpMap.channel),normalMapUv:lt&&v(b.normalMap.channel),displacementMapUv:vt&&v(b.displacementMap.channel),emissiveMapUv:ft&&v(b.emissiveMap.channel),metalnessMapUv:Rt&&v(b.metalnessMap.channel),roughnessMapUv:L&&v(b.roughnessMap.channel),anisotropyMapUv:Ct&&v(b.anisotropyMap.channel),clearcoatMapUv:St&&v(b.clearcoatMap.channel),clearcoatNormalMapUv:Yt&&v(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:xt&&v(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Ut&&v(b.iridescenceMap.channel),iridescenceThicknessMapUv:tt&&v(b.iridescenceThicknessMap.channel),sheenColorMapUv:j&&v(b.sheenColorMap.channel),sheenRoughnessMapUv:pt&&v(b.sheenRoughnessMap.channel),specularMapUv:Ht&&v(b.specularMap.channel),specularColorMapUv:Nt&&v(b.specularColorMap.channel),specularIntensityMapUv:It&&v(b.specularIntensityMap.channel),transmissionMapUv:U&&v(b.transmissionMap.channel),thicknessMapUv:bt&&v(b.thicknessMap.channel),alphaMapUv:ut&&v(b.alphaMap.channel),vertexTangents:!!A.attributes.tangent&&(lt||P),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!A.attributes.color&&A.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!A.attributes.uv&&(Gt||ut),fog:!!F,useFog:b.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:K,skinning:D.isSkinnedMesh===!0,morphTargets:A.morphAttributes.position!==void 0,morphNormals:A.morphAttributes.normal!==void 0,morphColors:A.morphAttributes.color!==void 0,morphTargetsCount:ht,morphTextureStride:gt,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&C.length>0,shadowMapType:n.shadowMap.type,toneMapping:le,decodeVideoTexture:Gt&&b.map.isVideoTexture===!0&&Te.getTransfer(b.map.colorSpace)===Ne,decodeVideoTextureEmissive:ft&&b.emissiveMap.isVideoTexture===!0&&Te.getTransfer(b.emissiveMap.colorSpace)===Ne,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===je,flipSided:b.side===jn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:qt&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(qt&&b.extensions.multiDraw===!0||Tt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return de.vertexUv1s=l.has(1),de.vertexUv2s=l.has(2),de.vertexUv3s=l.has(3),l.clear(),de}function p(b){const M=[];if(b.shaderID?M.push(b.shaderID):(M.push(b.customVertexShaderID),M.push(b.customFragmentShaderID)),b.defines!==void 0)for(const C in b.defines)M.push(C),M.push(b.defines[C]);return b.isRawShaderMaterial===!1&&(_(M,b),x(M,b),M.push(n.outputColorSpace)),M.push(b.customProgramCacheKey),M.join()}function _(b,M){b.push(M.precision),b.push(M.outputColorSpace),b.push(M.envMapMode),b.push(M.envMapCubeUVHeight),b.push(M.mapUv),b.push(M.alphaMapUv),b.push(M.lightMapUv),b.push(M.aoMapUv),b.push(M.bumpMapUv),b.push(M.normalMapUv),b.push(M.displacementMapUv),b.push(M.emissiveMapUv),b.push(M.metalnessMapUv),b.push(M.roughnessMapUv),b.push(M.anisotropyMapUv),b.push(M.clearcoatMapUv),b.push(M.clearcoatNormalMapUv),b.push(M.clearcoatRoughnessMapUv),b.push(M.iridescenceMapUv),b.push(M.iridescenceThicknessMapUv),b.push(M.sheenColorMapUv),b.push(M.sheenRoughnessMapUv),b.push(M.specularMapUv),b.push(M.specularColorMapUv),b.push(M.specularIntensityMapUv),b.push(M.transmissionMapUv),b.push(M.thicknessMapUv),b.push(M.combine),b.push(M.fogExp2),b.push(M.sizeAttenuation),b.push(M.morphTargetsCount),b.push(M.morphAttributeCount),b.push(M.numDirLights),b.push(M.numPointLights),b.push(M.numSpotLights),b.push(M.numSpotLightMaps),b.push(M.numHemiLights),b.push(M.numRectAreaLights),b.push(M.numDirLightShadows),b.push(M.numPointLightShadows),b.push(M.numSpotLightShadows),b.push(M.numSpotLightShadowsWithMaps),b.push(M.numLightProbes),b.push(M.shadowMapType),b.push(M.toneMapping),b.push(M.numClippingPlanes),b.push(M.numClipIntersection),b.push(M.depthPacking)}function x(b,M){r.disableAll(),M.supportsVertexTextures&&r.enable(0),M.instancing&&r.enable(1),M.instancingColor&&r.enable(2),M.instancingMorph&&r.enable(3),M.matcap&&r.enable(4),M.envMap&&r.enable(5),M.normalMapObjectSpace&&r.enable(6),M.normalMapTangentSpace&&r.enable(7),M.clearcoat&&r.enable(8),M.iridescence&&r.enable(9),M.alphaTest&&r.enable(10),M.vertexColors&&r.enable(11),M.vertexAlphas&&r.enable(12),M.vertexUv1s&&r.enable(13),M.vertexUv2s&&r.enable(14),M.vertexUv3s&&r.enable(15),M.vertexTangents&&r.enable(16),M.anisotropy&&r.enable(17),M.alphaHash&&r.enable(18),M.batching&&r.enable(19),M.dispersion&&r.enable(20),M.batchingColor&&r.enable(21),b.push(r.mask),r.disableAll(),M.fog&&r.enable(0),M.useFog&&r.enable(1),M.flatShading&&r.enable(2),M.logarithmicDepthBuffer&&r.enable(3),M.reverseDepthBuffer&&r.enable(4),M.skinning&&r.enable(5),M.morphTargets&&r.enable(6),M.morphNormals&&r.enable(7),M.morphColors&&r.enable(8),M.premultipliedAlpha&&r.enable(9),M.shadowMapEnabled&&r.enable(10),M.doubleSided&&r.enable(11),M.flipSided&&r.enable(12),M.useDepthPacking&&r.enable(13),M.dithering&&r.enable(14),M.transmission&&r.enable(15),M.sheen&&r.enable(16),M.opaque&&r.enable(17),M.pointsUvs&&r.enable(18),M.decodeVideoTexture&&r.enable(19),M.decodeVideoTextureEmissive&&r.enable(20),M.alphaToCoverage&&r.enable(21),b.push(r.mask)}function y(b){const M=m[b.type];let C;if(M){const k=ki[M];C=g1.clone(k.uniforms)}else C=b.uniforms;return C}function S(b,M){let C;for(let k=0,D=d.length;k<D;k++){const F=d[k];if(F.cacheKey===M){C=F,++C.usedTimes;break}}return C===void 0&&(C=new PT(n,M,b,s),d.push(C)),C}function w(b){if(--b.usedTimes===0){const M=d.indexOf(b);d[M]=d[d.length-1],d.pop(),b.destroy()}}function T(b){c.remove(b)}function R(){c.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:y,acquireProgram:S,releaseProgram:w,releaseShaderCache:T,programs:d,dispose:R}}function IT(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let r=n.get(o);return r===void 0&&(r={},n.set(o,r)),r}function i(o){n.delete(o)}function a(o,r,c){n.get(o)[r]=c}function s(){n=new WeakMap}return{has:t,get:e,remove:i,update:a,dispose:s}}function zT(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function If(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function zf(){const n=[];let t=0;const e=[],i=[],a=[];function s(){t=0,e.length=0,i.length=0,a.length=0}function o(u,h,f,m,v,g){let p=n[t];return p===void 0?(p={id:u.id,object:u,geometry:h,material:f,groupOrder:m,renderOrder:u.renderOrder,z:v,group:g},n[t]=p):(p.id=u.id,p.object=u,p.geometry=h,p.material=f,p.groupOrder=m,p.renderOrder=u.renderOrder,p.z=v,p.group=g),t++,p}function r(u,h,f,m,v,g){const p=o(u,h,f,m,v,g);f.transmission>0?i.push(p):f.transparent===!0?a.push(p):e.push(p)}function c(u,h,f,m,v,g){const p=o(u,h,f,m,v,g);f.transmission>0?i.unshift(p):f.transparent===!0?a.unshift(p):e.unshift(p)}function l(u,h){e.length>1&&e.sort(u||zT),i.length>1&&i.sort(h||If),a.length>1&&a.sort(h||If)}function d(){for(let u=t,h=n.length;u<h;u++){const f=n[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:i,transparent:a,init:s,push:r,unshift:c,finish:d,sort:l}}function FT(){let n=new WeakMap;function t(i,a){const s=n.get(i);let o;return s===void 0?(o=new zf,n.set(i,[o])):a>=s.length?(o=new zf,s.push(o)):o=s[a],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function UT(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new W,color:new Qt};break;case"SpotLight":e={position:new W,direction:new W,color:new Qt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new W,color:new Qt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new W,skyColor:new Qt,groundColor:new Qt};break;case"RectAreaLight":e={color:new Qt,position:new W,halfWidth:new W,halfHeight:new W};break}return n[t.id]=e,e}}}function NT(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let OT=0;function BT(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function HT(n){const t=new UT,e=NT(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new W);const a=new W,s=new Ce,o=new Ce;function r(l){let d=0,u=0,h=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let f=0,m=0,v=0,g=0,p=0,_=0,x=0,y=0,S=0,w=0,T=0;l.sort(BT);for(let b=0,M=l.length;b<M;b++){const C=l[b],k=C.color,D=C.intensity,F=C.distance,A=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)d+=k.r*D,u+=k.g*D,h+=k.b*D;else if(C.isLightProbe){for(let E=0;E<9;E++)i.probe[E].addScaledVector(C.sh.coefficients[E],D);T++}else if(C.isDirectionalLight){const E=t.get(C);if(E.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const z=C.shadow,G=e.get(C);G.shadowIntensity=z.intensity,G.shadowBias=z.bias,G.shadowNormalBias=z.normalBias,G.shadowRadius=z.radius,G.shadowMapSize=z.mapSize,i.directionalShadow[f]=G,i.directionalShadowMap[f]=A,i.directionalShadowMatrix[f]=C.shadow.matrix,_++}i.directional[f]=E,f++}else if(C.isSpotLight){const E=t.get(C);E.position.setFromMatrixPosition(C.matrixWorld),E.color.copy(k).multiplyScalar(D),E.distance=F,E.coneCos=Math.cos(C.angle),E.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),E.decay=C.decay,i.spot[v]=E;const z=C.shadow;if(C.map&&(i.spotLightMap[S]=C.map,S++,z.updateMatrices(C),C.castShadow&&w++),i.spotLightMatrix[v]=z.matrix,C.castShadow){const G=e.get(C);G.shadowIntensity=z.intensity,G.shadowBias=z.bias,G.shadowNormalBias=z.normalBias,G.shadowRadius=z.radius,G.shadowMapSize=z.mapSize,i.spotShadow[v]=G,i.spotShadowMap[v]=A,y++}v++}else if(C.isRectAreaLight){const E=t.get(C);E.color.copy(k).multiplyScalar(D),E.halfWidth.set(C.width*.5,0,0),E.halfHeight.set(0,C.height*.5,0),i.rectArea[g]=E,g++}else if(C.isPointLight){const E=t.get(C);if(E.color.copy(C.color).multiplyScalar(C.intensity),E.distance=C.distance,E.decay=C.decay,C.castShadow){const z=C.shadow,G=e.get(C);G.shadowIntensity=z.intensity,G.shadowBias=z.bias,G.shadowNormalBias=z.normalBias,G.shadowRadius=z.radius,G.shadowMapSize=z.mapSize,G.shadowCameraNear=z.camera.near,G.shadowCameraFar=z.camera.far,i.pointShadow[m]=G,i.pointShadowMap[m]=A,i.pointShadowMatrix[m]=C.shadow.matrix,x++}i.point[m]=E,m++}else if(C.isHemisphereLight){const E=t.get(C);E.skyColor.copy(C.color).multiplyScalar(D),E.groundColor.copy(C.groundColor).multiplyScalar(D),i.hemi[p]=E,p++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Vt.LTC_FLOAT_1,i.rectAreaLTC2=Vt.LTC_FLOAT_2):(i.rectAreaLTC1=Vt.LTC_HALF_1,i.rectAreaLTC2=Vt.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=u,i.ambient[2]=h;const R=i.hash;(R.directionalLength!==f||R.pointLength!==m||R.spotLength!==v||R.rectAreaLength!==g||R.hemiLength!==p||R.numDirectionalShadows!==_||R.numPointShadows!==x||R.numSpotShadows!==y||R.numSpotMaps!==S||R.numLightProbes!==T)&&(i.directional.length=f,i.spot.length=v,i.rectArea.length=g,i.point.length=m,i.hemi.length=p,i.directionalShadow.length=_,i.directionalShadowMap.length=_,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=_,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=y+S-w,i.spotLightMap.length=S,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=T,R.directionalLength=f,R.pointLength=m,R.spotLength=v,R.rectAreaLength=g,R.hemiLength=p,R.numDirectionalShadows=_,R.numPointShadows=x,R.numSpotShadows=y,R.numSpotMaps=S,R.numLightProbes=T,i.version=OT++)}function c(l,d){let u=0,h=0,f=0,m=0,v=0;const g=d.matrixWorldInverse;for(let p=0,_=l.length;p<_;p++){const x=l[p];if(x.isDirectionalLight){const y=i.directional[u];y.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(a),y.direction.transformDirection(g),u++}else if(x.isSpotLight){const y=i.spot[f];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(g),y.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(a),y.direction.transformDirection(g),f++}else if(x.isRectAreaLight){const y=i.rectArea[m];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(g),o.identity(),s.copy(x.matrixWorld),s.premultiply(g),o.extractRotation(s),y.halfWidth.set(x.width*.5,0,0),y.halfHeight.set(0,x.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),m++}else if(x.isPointLight){const y=i.point[h];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(g),h++}else if(x.isHemisphereLight){const y=i.hemi[v];y.direction.setFromMatrixPosition(x.matrixWorld),y.direction.transformDirection(g),v++}}}return{setup:r,setupView:c,state:i}}function Ff(n){const t=new HT(n),e=[],i=[];function a(d){l.camera=d,e.length=0,i.length=0}function s(d){e.push(d)}function o(d){i.push(d)}function r(){t.setup(e)}function c(d){t.setupView(e,d)}const l={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:a,state:l,setupLights:r,setupLightsView:c,pushLight:s,pushShadow:o}}function GT(n){let t=new WeakMap;function e(a,s=0){const o=t.get(a);let r;return o===void 0?(r=new Ff(n),t.set(a,[r])):s>=o.length?(r=new Ff(n),o.push(r)):r=o[s],r}function i(){t=new WeakMap}return{get:e,dispose:i}}class XT extends Qa{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=wb,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class VT extends Qa{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const WT=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,YT=`uniform sampler2D shadow_pass;
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
}`;function $T(n,t,e){let i=new fh;const a=new Wt,s=new Wt,o=new sn,r=new XT({depthPacking:Eb}),c=new VT,l={},d=e.maxTextureSize,u={[ba]:jn,[jn]:ba,[je]:je},h=new Sa({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Wt},radius:{value:4}},vertexShader:WT,fragmentShader:YT}),f=h.clone();f.defines.HORIZONTAL_PASS=1;const m=new en;m.setAttribute("position",new wn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new ve(m,h),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=rm;let p=this.type;this.render=function(w,T,R){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||w.length===0)return;const b=n.getRenderTarget(),M=n.getActiveCubeFace(),C=n.getActiveMipmapLevel(),k=n.state;k.setBlending(va),k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);const D=p!==qi&&this.type===qi,F=p===qi&&this.type!==qi;for(let A=0,E=w.length;A<E;A++){const z=w[A],G=z.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",z,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;a.copy(G.mapSize);const X=G.getFrameExtents();if(a.multiply(X),s.copy(G.mapSize),(a.x>d||a.y>d)&&(a.x>d&&(s.x=Math.floor(d/X.x),a.x=s.x*X.x,G.mapSize.x=s.x),a.y>d&&(s.y=Math.floor(d/X.y),a.y=s.y*X.y,G.mapSize.y=s.y)),G.map===null||D===!0||F===!0){const ht=this.type!==qi?{minFilter:oi,magFilter:oi}:{};G.map!==null&&G.map.dispose(),G.map=new qa(a.x,a.y,ht),G.map.texture.name=z.name+".shadowMap",G.camera.updateProjectionMatrix()}n.setRenderTarget(G.map),n.clear();const et=G.getViewportCount();for(let ht=0;ht<et;ht++){const gt=G.getViewport(ht);o.set(s.x*gt.x,s.y*gt.y,s.x*gt.z,s.y*gt.w),k.viewport(o),G.updateMatrices(z,ht),i=G.getFrustum(),y(T,R,G.camera,z,this.type)}G.isPointLightShadow!==!0&&this.type===qi&&_(G,R),G.needsUpdate=!1}p=this.type,g.needsUpdate=!1,n.setRenderTarget(b,M,C)};function _(w,T){const R=t.update(v);h.defines.VSM_SAMPLES!==w.blurSamples&&(h.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new qa(a.x,a.y)),h.uniforms.shadow_pass.value=w.map.texture,h.uniforms.resolution.value=w.mapSize,h.uniforms.radius.value=w.radius,n.setRenderTarget(w.mapPass),n.clear(),n.renderBufferDirect(T,null,R,h,v,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,n.setRenderTarget(w.map),n.clear(),n.renderBufferDirect(T,null,R,f,v,null)}function x(w,T,R,b){let M=null;const C=R.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(C!==void 0)M=C;else if(M=R.isPointLight===!0?c:r,n.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const k=M.uuid,D=T.uuid;let F=l[k];F===void 0&&(F={},l[k]=F);let A=F[D];A===void 0&&(A=M.clone(),F[D]=A,T.addEventListener("dispose",S)),M=A}if(M.visible=T.visible,M.wireframe=T.wireframe,b===qi?M.side=T.shadowSide!==null?T.shadowSide:T.side:M.side=T.shadowSide!==null?T.shadowSide:u[T.side],M.alphaMap=T.alphaMap,M.alphaTest=T.alphaTest,M.map=T.map,M.clipShadows=T.clipShadows,M.clippingPlanes=T.clippingPlanes,M.clipIntersection=T.clipIntersection,M.displacementMap=T.displacementMap,M.displacementScale=T.displacementScale,M.displacementBias=T.displacementBias,M.wireframeLinewidth=T.wireframeLinewidth,M.linewidth=T.linewidth,R.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const k=n.properties.get(M);k.light=R}return M}function y(w,T,R,b,M){if(w.visible===!1)return;if(w.layers.test(T.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&M===qi)&&(!w.frustumCulled||i.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,w.matrixWorld);const D=t.update(w),F=w.material;if(Array.isArray(F)){const A=D.groups;for(let E=0,z=A.length;E<z;E++){const G=A[E],X=F[G.materialIndex];if(X&&X.visible){const et=x(w,X,b,M);w.onBeforeShadow(n,w,T,R,D,et,G),n.renderBufferDirect(R,null,D,et,w,G),w.onAfterShadow(n,w,T,R,D,et,G)}}}else if(F.visible){const A=x(w,F,b,M);w.onBeforeShadow(n,w,T,R,D,A,null),n.renderBufferDirect(R,null,D,A,w,null),w.onAfterShadow(n,w,T,R,D,A,null)}}const k=w.children;for(let D=0,F=k.length;D<F;D++)y(k[D],T,R,b,M)}function S(w){w.target.removeEventListener("dispose",S);for(const R in l){const b=l[R],M=w.target.uuid;M in b&&(b[M].dispose(),delete b[M])}}}const ZT={[Jl]:Ql,[td]:id,[ed]:ad,[Xs]:nd,[Ql]:Jl,[id]:td,[ad]:ed,[nd]:Xs};function jT(n,t){function e(){let U=!1;const bt=new sn;let $=null;const ut=new sn(0,0,0,0);return{setMask:function(Ft){$!==Ft&&!U&&(n.colorMask(Ft,Ft,Ft,Ft),$=Ft)},setLocked:function(Ft){U=Ft},setClear:function(Ft,Dt,qt,le,de){de===!0&&(Ft*=le,Dt*=le,qt*=le),bt.set(Ft,Dt,qt,le),ut.equals(bt)===!1&&(n.clearColor(Ft,Dt,qt,le),ut.copy(bt))},reset:function(){U=!1,$=null,ut.set(-1,0,0,0)}}}function i(){let U=!1,bt=!1,$=null,ut=null,Ft=null;return{setReversed:function(Dt){if(bt!==Dt){const qt=t.get("EXT_clip_control");bt?qt.clipControlEXT(qt.LOWER_LEFT_EXT,qt.ZERO_TO_ONE_EXT):qt.clipControlEXT(qt.LOWER_LEFT_EXT,qt.NEGATIVE_ONE_TO_ONE_EXT);const le=Ft;Ft=null,this.setClear(le)}bt=Dt},getReversed:function(){return bt},setTest:function(Dt){Dt?q(n.DEPTH_TEST):K(n.DEPTH_TEST)},setMask:function(Dt){$!==Dt&&!U&&(n.depthMask(Dt),$=Dt)},setFunc:function(Dt){if(bt&&(Dt=ZT[Dt]),ut!==Dt){switch(Dt){case Jl:n.depthFunc(n.NEVER);break;case Ql:n.depthFunc(n.ALWAYS);break;case td:n.depthFunc(n.LESS);break;case Xs:n.depthFunc(n.LEQUAL);break;case ed:n.depthFunc(n.EQUAL);break;case nd:n.depthFunc(n.GEQUAL);break;case id:n.depthFunc(n.GREATER);break;case ad:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ut=Dt}},setLocked:function(Dt){U=Dt},setClear:function(Dt){Ft!==Dt&&(bt&&(Dt=1-Dt),n.clearDepth(Dt),Ft=Dt)},reset:function(){U=!1,$=null,ut=null,Ft=null,bt=!1}}}function a(){let U=!1,bt=null,$=null,ut=null,Ft=null,Dt=null,qt=null,le=null,de=null;return{setTest:function(ee){U||(ee?q(n.STENCIL_TEST):K(n.STENCIL_TEST))},setMask:function(ee){bt!==ee&&!U&&(n.stencilMask(ee),bt=ee)},setFunc:function(ee,we,De){($!==ee||ut!==we||Ft!==De)&&(n.stencilFunc(ee,we,De),$=ee,ut=we,Ft=De)},setOp:function(ee,we,De){(Dt!==ee||qt!==we||le!==De)&&(n.stencilOp(ee,we,De),Dt=ee,qt=we,le=De)},setLocked:function(ee){U=ee},setClear:function(ee){de!==ee&&(n.clearStencil(ee),de=ee)},reset:function(){U=!1,bt=null,$=null,ut=null,Ft=null,Dt=null,qt=null,le=null,de=null}}}const s=new e,o=new i,r=new a,c=new WeakMap,l=new WeakMap;let d={},u={},h=new WeakMap,f=[],m=null,v=!1,g=null,p=null,_=null,x=null,y=null,S=null,w=null,T=new Qt(0,0,0),R=0,b=!1,M=null,C=null,k=null,D=null,F=null;const A=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let E=!1,z=0;const G=n.getParameter(n.VERSION);G.indexOf("WebGL")!==-1?(z=parseFloat(/^WebGL (\d)/.exec(G)[1]),E=z>=1):G.indexOf("OpenGL ES")!==-1&&(z=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),E=z>=2);let X=null,et={};const ht=n.getParameter(n.SCISSOR_BOX),gt=n.getParameter(n.VIEWPORT),Lt=new sn().fromArray(ht),Z=new sn().fromArray(gt);function B(U,bt,$,ut){const Ft=new Uint8Array(4),Dt=n.createTexture();n.bindTexture(U,Dt),n.texParameteri(U,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(U,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let qt=0;qt<$;qt++)U===n.TEXTURE_3D||U===n.TEXTURE_2D_ARRAY?n.texImage3D(bt,0,n.RGBA,1,1,ut,0,n.RGBA,n.UNSIGNED_BYTE,Ft):n.texImage2D(bt+qt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Ft);return Dt}const Y={};Y[n.TEXTURE_2D]=B(n.TEXTURE_2D,n.TEXTURE_2D,1),Y[n.TEXTURE_CUBE_MAP]=B(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[n.TEXTURE_2D_ARRAY]=B(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Y[n.TEXTURE_3D]=B(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),r.setClear(0),q(n.DEPTH_TEST),o.setFunc(Xs),Et(!1),lt(Ou),q(n.CULL_FACE),O(va);function q(U){d[U]!==!0&&(n.enable(U),d[U]=!0)}function K(U){d[U]!==!1&&(n.disable(U),d[U]=!1)}function st(U,bt){return u[U]!==bt?(n.bindFramebuffer(U,bt),u[U]=bt,U===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=bt),U===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=bt),!0):!1}function Tt(U,bt){let $=f,ut=!1;if(U){$=h.get(bt),$===void 0&&($=[],h.set(bt,$));const Ft=U.textures;if($.length!==Ft.length||$[0]!==n.COLOR_ATTACHMENT0){for(let Dt=0,qt=Ft.length;Dt<qt;Dt++)$[Dt]=n.COLOR_ATTACHMENT0+Dt;$.length=Ft.length,ut=!0}}else $[0]!==n.BACK&&($[0]=n.BACK,ut=!0);ut&&n.drawBuffers($)}function Gt(U){return m!==U?(n.useProgram(U),m=U,!0):!1}const J={[Xa]:n.FUNC_ADD,[K_]:n.FUNC_SUBTRACT,[J_]:n.FUNC_REVERSE_SUBTRACT};J[Q_]=n.MIN,J[tb]=n.MAX;const V={[eb]:n.ZERO,[nb]:n.ONE,[ib]:n.SRC_COLOR,[ql]:n.SRC_ALPHA,[lb]:n.SRC_ALPHA_SATURATE,[rb]:n.DST_COLOR,[sb]:n.DST_ALPHA,[ab]:n.ONE_MINUS_SRC_COLOR,[Kl]:n.ONE_MINUS_SRC_ALPHA,[cb]:n.ONE_MINUS_DST_COLOR,[ob]:n.ONE_MINUS_DST_ALPHA,[db]:n.CONSTANT_COLOR,[hb]:n.ONE_MINUS_CONSTANT_COLOR,[ub]:n.CONSTANT_ALPHA,[fb]:n.ONE_MINUS_CONSTANT_ALPHA};function O(U,bt,$,ut,Ft,Dt,qt,le,de,ee){if(U===va){v===!0&&(K(n.BLEND),v=!1);return}if(v===!1&&(q(n.BLEND),v=!0),U!==q_){if(U!==g||ee!==b){if((p!==Xa||y!==Xa)&&(n.blendEquation(n.FUNC_ADD),p=Xa,y=Xa),ee)switch(U){case zs:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ji:n.blendFunc(n.ONE,n.ONE);break;case Bu:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Hu:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case zs:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ji:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Bu:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Hu:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}_=null,x=null,S=null,w=null,T.set(0,0,0),R=0,g=U,b=ee}return}Ft=Ft||bt,Dt=Dt||$,qt=qt||ut,(bt!==p||Ft!==y)&&(n.blendEquationSeparate(J[bt],J[Ft]),p=bt,y=Ft),($!==_||ut!==x||Dt!==S||qt!==w)&&(n.blendFuncSeparate(V[$],V[ut],V[Dt],V[qt]),_=$,x=ut,S=Dt,w=qt),(le.equals(T)===!1||de!==R)&&(n.blendColor(le.r,le.g,le.b,de),T.copy(le),R=de),g=U,b=!1}function Pt(U,bt){U.side===je?K(n.CULL_FACE):q(n.CULL_FACE);let $=U.side===jn;bt&&($=!$),Et($),U.blending===zs&&U.transparent===!1?O(va):O(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),o.setFunc(U.depthFunc),o.setTest(U.depthTest),o.setMask(U.depthWrite),s.setMask(U.colorWrite);const ut=U.stencilWrite;r.setTest(ut),ut&&(r.setMask(U.stencilWriteMask),r.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),r.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),ft(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?q(n.SAMPLE_ALPHA_TO_COVERAGE):K(n.SAMPLE_ALPHA_TO_COVERAGE)}function Et(U){M!==U&&(U?n.frontFace(n.CW):n.frontFace(n.CCW),M=U)}function lt(U){U!==Z_?(q(n.CULL_FACE),U!==C&&(U===Ou?n.cullFace(n.BACK):U===j_?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):K(n.CULL_FACE),C=U}function vt(U){U!==k&&(E&&n.lineWidth(U),k=U)}function ft(U,bt,$){U?(q(n.POLYGON_OFFSET_FILL),(D!==bt||F!==$)&&(n.polygonOffset(bt,$),D=bt,F=$)):K(n.POLYGON_OFFSET_FILL)}function Rt(U){U?q(n.SCISSOR_TEST):K(n.SCISSOR_TEST)}function L(U){U===void 0&&(U=n.TEXTURE0+A-1),X!==U&&(n.activeTexture(U),X=U)}function P(U,bt,$){$===void 0&&(X===null?$=n.TEXTURE0+A-1:$=X);let ut=et[$];ut===void 0&&(ut={type:void 0,texture:void 0},et[$]=ut),(ut.type!==U||ut.texture!==bt)&&(X!==$&&(n.activeTexture($),X=$),n.bindTexture(U,bt||Y[U]),ut.type=U,ut.texture=bt)}function Q(){const U=et[X];U!==void 0&&U.type!==void 0&&(n.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function mt(){try{n.compressedTexImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ot(){try{n.compressedTexImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function dt(){try{n.texSubImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function zt(){try{n.texSubImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ct(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function St(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Yt(){try{n.texStorage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function xt(){try{n.texStorage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ut(){try{n.texImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function tt(){try{n.texImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function j(U){Lt.equals(U)===!1&&(n.scissor(U.x,U.y,U.z,U.w),Lt.copy(U))}function pt(U){Z.equals(U)===!1&&(n.viewport(U.x,U.y,U.z,U.w),Z.copy(U))}function Ht(U,bt){let $=l.get(bt);$===void 0&&($=new WeakMap,l.set(bt,$));let ut=$.get(U);ut===void 0&&(ut=n.getUniformBlockIndex(bt,U.name),$.set(U,ut))}function Nt(U,bt){const ut=l.get(bt).get(U);c.get(bt)!==ut&&(n.uniformBlockBinding(bt,ut,U.__bindingPointIndex),c.set(bt,ut))}function It(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},X=null,et={},u={},h=new WeakMap,f=[],m=null,v=!1,g=null,p=null,_=null,x=null,y=null,S=null,w=null,T=new Qt(0,0,0),R=0,b=!1,M=null,C=null,k=null,D=null,F=null,Lt.set(0,0,n.canvas.width,n.canvas.height),Z.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),r.reset()}return{buffers:{color:s,depth:o,stencil:r},enable:q,disable:K,bindFramebuffer:st,drawBuffers:Tt,useProgram:Gt,setBlending:O,setMaterial:Pt,setFlipSided:Et,setCullFace:lt,setLineWidth:vt,setPolygonOffset:ft,setScissorTest:Rt,activeTexture:L,bindTexture:P,unbindTexture:Q,compressedTexImage2D:mt,compressedTexImage3D:ot,texImage2D:Ut,texImage3D:tt,updateUBOMapping:Ht,uniformBlockBinding:Nt,texStorage2D:Yt,texStorage3D:xt,texSubImage2D:dt,texSubImage3D:zt,compressedTexSubImage2D:Ct,compressedTexSubImage3D:St,scissor:j,viewport:pt,reset:It}}function Uf(n,t,e,i){const a=qT(i);switch(e){case fm:return n*t;case mm:return n*t;case gm:return n*t*2;case oh:return n*t/a.components*a.byteLength;case rh:return n*t/a.components*a.byteLength;case xm:return n*t*2/a.components*a.byteLength;case ch:return n*t*2/a.components*a.byteLength;case pm:return n*t*3/a.components*a.byteLength;case Si:return n*t*4/a.components*a.byteLength;case lh:return n*t*4/a.components*a.byteLength;case Hr:case Gr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Xr:case Vr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case dd:case ud:return Math.max(n,16)*Math.max(t,8)/4;case ld:case hd:return Math.max(n,8)*Math.max(t,8)/2;case fd:case pd:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case md:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case gd:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case xd:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case vd:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case yd:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case Md:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case _d:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case bd:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Sd:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case wd:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Ed:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Td:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Ad:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case Rd:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Pd:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case Wr:case Cd:case Dd:return Math.ceil(n/4)*Math.ceil(t/4)*16;case vm:case Ld:return Math.ceil(n/4)*Math.ceil(t/4)*8;case kd:case Id:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function qT(n){switch(n){case na:case dm:return{byteLength:1,components:1};case Bo:case hm:case $o:return{byteLength:2,components:1};case ah:case sh:return{byteLength:2,components:4};case ja:case ih:case zi:return{byteLength:4,components:1};case um:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function KT(n,t,e,i,a,s,o){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Wt,d=new WeakMap;let u;const h=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(L,P){return f?new OffscreenCanvas(L,P):rc("canvas")}function v(L,P,Q){let mt=1;const ot=Rt(L);if((ot.width>Q||ot.height>Q)&&(mt=Q/Math.max(ot.width,ot.height)),mt<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){const dt=Math.floor(mt*ot.width),zt=Math.floor(mt*ot.height);u===void 0&&(u=m(dt,zt));const Ct=P?m(dt,zt):u;return Ct.width=dt,Ct.height=zt,Ct.getContext("2d").drawImage(L,0,0,dt,zt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ot.width+"x"+ot.height+") to ("+dt+"x"+zt+")."),Ct}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ot.width+"x"+ot.height+")."),L;return L}function g(L){return L.generateMipmaps}function p(L){n.generateMipmap(L)}function _(L){return L.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?n.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(L,P,Q,mt,ot=!1){if(L!==null){if(n[L]!==void 0)return n[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let dt=P;if(P===n.RED&&(Q===n.FLOAT&&(dt=n.R32F),Q===n.HALF_FLOAT&&(dt=n.R16F),Q===n.UNSIGNED_BYTE&&(dt=n.R8)),P===n.RED_INTEGER&&(Q===n.UNSIGNED_BYTE&&(dt=n.R8UI),Q===n.UNSIGNED_SHORT&&(dt=n.R16UI),Q===n.UNSIGNED_INT&&(dt=n.R32UI),Q===n.BYTE&&(dt=n.R8I),Q===n.SHORT&&(dt=n.R16I),Q===n.INT&&(dt=n.R32I)),P===n.RG&&(Q===n.FLOAT&&(dt=n.RG32F),Q===n.HALF_FLOAT&&(dt=n.RG16F),Q===n.UNSIGNED_BYTE&&(dt=n.RG8)),P===n.RG_INTEGER&&(Q===n.UNSIGNED_BYTE&&(dt=n.RG8UI),Q===n.UNSIGNED_SHORT&&(dt=n.RG16UI),Q===n.UNSIGNED_INT&&(dt=n.RG32UI),Q===n.BYTE&&(dt=n.RG8I),Q===n.SHORT&&(dt=n.RG16I),Q===n.INT&&(dt=n.RG32I)),P===n.RGB_INTEGER&&(Q===n.UNSIGNED_BYTE&&(dt=n.RGB8UI),Q===n.UNSIGNED_SHORT&&(dt=n.RGB16UI),Q===n.UNSIGNED_INT&&(dt=n.RGB32UI),Q===n.BYTE&&(dt=n.RGB8I),Q===n.SHORT&&(dt=n.RGB16I),Q===n.INT&&(dt=n.RGB32I)),P===n.RGBA_INTEGER&&(Q===n.UNSIGNED_BYTE&&(dt=n.RGBA8UI),Q===n.UNSIGNED_SHORT&&(dt=n.RGBA16UI),Q===n.UNSIGNED_INT&&(dt=n.RGBA32UI),Q===n.BYTE&&(dt=n.RGBA8I),Q===n.SHORT&&(dt=n.RGBA16I),Q===n.INT&&(dt=n.RGBA32I)),P===n.RGB&&Q===n.UNSIGNED_INT_5_9_9_9_REV&&(dt=n.RGB9_E5),P===n.RGBA){const zt=ot?Mc:Te.getTransfer(mt);Q===n.FLOAT&&(dt=n.RGBA32F),Q===n.HALF_FLOAT&&(dt=n.RGBA16F),Q===n.UNSIGNED_BYTE&&(dt=zt===Ne?n.SRGB8_ALPHA8:n.RGBA8),Q===n.UNSIGNED_SHORT_4_4_4_4&&(dt=n.RGBA4),Q===n.UNSIGNED_SHORT_5_5_5_1&&(dt=n.RGB5_A1)}return(dt===n.R16F||dt===n.R32F||dt===n.RG16F||dt===n.RG32F||dt===n.RGBA16F||dt===n.RGBA32F)&&t.get("EXT_color_buffer_float"),dt}function y(L,P){let Q;return L?P===null||P===ja||P===Ys?Q=n.DEPTH24_STENCIL8:P===zi?Q=n.DEPTH32F_STENCIL8:P===Bo&&(Q=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):P===null||P===ja||P===Ys?Q=n.DEPTH_COMPONENT24:P===zi?Q=n.DEPTH_COMPONENT32F:P===Bo&&(Q=n.DEPTH_COMPONENT16),Q}function S(L,P){return g(L)===!0||L.isFramebufferTexture&&L.minFilter!==oi&&L.minFilter!==Ii?Math.log2(Math.max(P.width,P.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?P.mipmaps.length:1}function w(L){const P=L.target;P.removeEventListener("dispose",w),R(P),P.isVideoTexture&&d.delete(P)}function T(L){const P=L.target;P.removeEventListener("dispose",T),M(P)}function R(L){const P=i.get(L);if(P.__webglInit===void 0)return;const Q=L.source,mt=h.get(Q);if(mt){const ot=mt[P.__cacheKey];ot.usedTimes--,ot.usedTimes===0&&b(L),Object.keys(mt).length===0&&h.delete(Q)}i.remove(L)}function b(L){const P=i.get(L);n.deleteTexture(P.__webglTexture);const Q=L.source,mt=h.get(Q);delete mt[P.__cacheKey],o.memory.textures--}function M(L){const P=i.get(L);if(L.depthTexture&&(L.depthTexture.dispose(),i.remove(L.depthTexture)),L.isWebGLCubeRenderTarget)for(let mt=0;mt<6;mt++){if(Array.isArray(P.__webglFramebuffer[mt]))for(let ot=0;ot<P.__webglFramebuffer[mt].length;ot++)n.deleteFramebuffer(P.__webglFramebuffer[mt][ot]);else n.deleteFramebuffer(P.__webglFramebuffer[mt]);P.__webglDepthbuffer&&n.deleteRenderbuffer(P.__webglDepthbuffer[mt])}else{if(Array.isArray(P.__webglFramebuffer))for(let mt=0;mt<P.__webglFramebuffer.length;mt++)n.deleteFramebuffer(P.__webglFramebuffer[mt]);else n.deleteFramebuffer(P.__webglFramebuffer);if(P.__webglDepthbuffer&&n.deleteRenderbuffer(P.__webglDepthbuffer),P.__webglMultisampledFramebuffer&&n.deleteFramebuffer(P.__webglMultisampledFramebuffer),P.__webglColorRenderbuffer)for(let mt=0;mt<P.__webglColorRenderbuffer.length;mt++)P.__webglColorRenderbuffer[mt]&&n.deleteRenderbuffer(P.__webglColorRenderbuffer[mt]);P.__webglDepthRenderbuffer&&n.deleteRenderbuffer(P.__webglDepthRenderbuffer)}const Q=L.textures;for(let mt=0,ot=Q.length;mt<ot;mt++){const dt=i.get(Q[mt]);dt.__webglTexture&&(n.deleteTexture(dt.__webglTexture),o.memory.textures--),i.remove(Q[mt])}i.remove(L)}let C=0;function k(){C=0}function D(){const L=C;return L>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+a.maxTextures),C+=1,L}function F(L){const P=[];return P.push(L.wrapS),P.push(L.wrapT),P.push(L.wrapR||0),P.push(L.magFilter),P.push(L.minFilter),P.push(L.anisotropy),P.push(L.internalFormat),P.push(L.format),P.push(L.type),P.push(L.generateMipmaps),P.push(L.premultiplyAlpha),P.push(L.flipY),P.push(L.unpackAlignment),P.push(L.colorSpace),P.join()}function A(L,P){const Q=i.get(L);if(L.isVideoTexture&&vt(L),L.isRenderTargetTexture===!1&&L.version>0&&Q.__version!==L.version){const mt=L.image;if(mt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(mt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Z(Q,L,P);return}}e.bindTexture(n.TEXTURE_2D,Q.__webglTexture,n.TEXTURE0+P)}function E(L,P){const Q=i.get(L);if(L.version>0&&Q.__version!==L.version){Z(Q,L,P);return}e.bindTexture(n.TEXTURE_2D_ARRAY,Q.__webglTexture,n.TEXTURE0+P)}function z(L,P){const Q=i.get(L);if(L.version>0&&Q.__version!==L.version){Z(Q,L,P);return}e.bindTexture(n.TEXTURE_3D,Q.__webglTexture,n.TEXTURE0+P)}function G(L,P){const Q=i.get(L);if(L.version>0&&Q.__version!==L.version){B(Q,L,P);return}e.bindTexture(n.TEXTURE_CUBE_MAP,Q.__webglTexture,n.TEXTURE0+P)}const X={[rd]:n.REPEAT,[Wa]:n.CLAMP_TO_EDGE,[cd]:n.MIRRORED_REPEAT},et={[oi]:n.NEAREST,[Sb]:n.NEAREST_MIPMAP_NEAREST,[ar]:n.NEAREST_MIPMAP_LINEAR,[Ii]:n.LINEAR,[Zc]:n.LINEAR_MIPMAP_NEAREST,[Ya]:n.LINEAR_MIPMAP_LINEAR},ht={[Ab]:n.NEVER,[kb]:n.ALWAYS,[Rb]:n.LESS,[Mm]:n.LEQUAL,[Pb]:n.EQUAL,[Lb]:n.GEQUAL,[Cb]:n.GREATER,[Db]:n.NOTEQUAL};function gt(L,P){if(P.type===zi&&t.has("OES_texture_float_linear")===!1&&(P.magFilter===Ii||P.magFilter===Zc||P.magFilter===ar||P.magFilter===Ya||P.minFilter===Ii||P.minFilter===Zc||P.minFilter===ar||P.minFilter===Ya)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(L,n.TEXTURE_WRAP_S,X[P.wrapS]),n.texParameteri(L,n.TEXTURE_WRAP_T,X[P.wrapT]),(L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY)&&n.texParameteri(L,n.TEXTURE_WRAP_R,X[P.wrapR]),n.texParameteri(L,n.TEXTURE_MAG_FILTER,et[P.magFilter]),n.texParameteri(L,n.TEXTURE_MIN_FILTER,et[P.minFilter]),P.compareFunction&&(n.texParameteri(L,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(L,n.TEXTURE_COMPARE_FUNC,ht[P.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(P.magFilter===oi||P.minFilter!==ar&&P.minFilter!==Ya||P.type===zi&&t.has("OES_texture_float_linear")===!1)return;if(P.anisotropy>1||i.get(P).__currentAnisotropy){const Q=t.get("EXT_texture_filter_anisotropic");n.texParameterf(L,Q.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(P.anisotropy,a.getMaxAnisotropy())),i.get(P).__currentAnisotropy=P.anisotropy}}}function Lt(L,P){let Q=!1;L.__webglInit===void 0&&(L.__webglInit=!0,P.addEventListener("dispose",w));const mt=P.source;let ot=h.get(mt);ot===void 0&&(ot={},h.set(mt,ot));const dt=F(P);if(dt!==L.__cacheKey){ot[dt]===void 0&&(ot[dt]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,Q=!0),ot[dt].usedTimes++;const zt=ot[L.__cacheKey];zt!==void 0&&(ot[L.__cacheKey].usedTimes--,zt.usedTimes===0&&b(P)),L.__cacheKey=dt,L.__webglTexture=ot[dt].texture}return Q}function Z(L,P,Q){let mt=n.TEXTURE_2D;(P.isDataArrayTexture||P.isCompressedArrayTexture)&&(mt=n.TEXTURE_2D_ARRAY),P.isData3DTexture&&(mt=n.TEXTURE_3D);const ot=Lt(L,P),dt=P.source;e.bindTexture(mt,L.__webglTexture,n.TEXTURE0+Q);const zt=i.get(dt);if(dt.version!==zt.__version||ot===!0){e.activeTexture(n.TEXTURE0+Q);const Ct=Te.getPrimaries(Te.workingColorSpace),St=P.colorSpace===fa?null:Te.getPrimaries(P.colorSpace),Yt=P.colorSpace===fa||Ct===St?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,P.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,P.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,P.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Yt);let xt=v(P.image,!1,a.maxTextureSize);xt=ft(P,xt);const Ut=s.convert(P.format,P.colorSpace),tt=s.convert(P.type);let j=x(P.internalFormat,Ut,tt,P.colorSpace,P.isVideoTexture);gt(mt,P);let pt;const Ht=P.mipmaps,Nt=P.isVideoTexture!==!0,It=zt.__version===void 0||ot===!0,U=dt.dataReady,bt=S(P,xt);if(P.isDepthTexture)j=y(P.format===$s,P.type),It&&(Nt?e.texStorage2D(n.TEXTURE_2D,1,j,xt.width,xt.height):e.texImage2D(n.TEXTURE_2D,0,j,xt.width,xt.height,0,Ut,tt,null));else if(P.isDataTexture)if(Ht.length>0){Nt&&It&&e.texStorage2D(n.TEXTURE_2D,bt,j,Ht[0].width,Ht[0].height);for(let $=0,ut=Ht.length;$<ut;$++)pt=Ht[$],Nt?U&&e.texSubImage2D(n.TEXTURE_2D,$,0,0,pt.width,pt.height,Ut,tt,pt.data):e.texImage2D(n.TEXTURE_2D,$,j,pt.width,pt.height,0,Ut,tt,pt.data);P.generateMipmaps=!1}else Nt?(It&&e.texStorage2D(n.TEXTURE_2D,bt,j,xt.width,xt.height),U&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,xt.width,xt.height,Ut,tt,xt.data)):e.texImage2D(n.TEXTURE_2D,0,j,xt.width,xt.height,0,Ut,tt,xt.data);else if(P.isCompressedTexture)if(P.isCompressedArrayTexture){Nt&&It&&e.texStorage3D(n.TEXTURE_2D_ARRAY,bt,j,Ht[0].width,Ht[0].height,xt.depth);for(let $=0,ut=Ht.length;$<ut;$++)if(pt=Ht[$],P.format!==Si)if(Ut!==null)if(Nt){if(U)if(P.layerUpdates.size>0){const Ft=Uf(pt.width,pt.height,P.format,P.type);for(const Dt of P.layerUpdates){const qt=pt.data.subarray(Dt*Ft/pt.data.BYTES_PER_ELEMENT,(Dt+1)*Ft/pt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,Dt,pt.width,pt.height,1,Ut,qt)}P.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,0,pt.width,pt.height,xt.depth,Ut,pt.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,$,j,pt.width,pt.height,xt.depth,0,pt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Nt?U&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,0,pt.width,pt.height,xt.depth,Ut,tt,pt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,$,j,pt.width,pt.height,xt.depth,0,Ut,tt,pt.data)}else{Nt&&It&&e.texStorage2D(n.TEXTURE_2D,bt,j,Ht[0].width,Ht[0].height);for(let $=0,ut=Ht.length;$<ut;$++)pt=Ht[$],P.format!==Si?Ut!==null?Nt?U&&e.compressedTexSubImage2D(n.TEXTURE_2D,$,0,0,pt.width,pt.height,Ut,pt.data):e.compressedTexImage2D(n.TEXTURE_2D,$,j,pt.width,pt.height,0,pt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Nt?U&&e.texSubImage2D(n.TEXTURE_2D,$,0,0,pt.width,pt.height,Ut,tt,pt.data):e.texImage2D(n.TEXTURE_2D,$,j,pt.width,pt.height,0,Ut,tt,pt.data)}else if(P.isDataArrayTexture)if(Nt){if(It&&e.texStorage3D(n.TEXTURE_2D_ARRAY,bt,j,xt.width,xt.height,xt.depth),U)if(P.layerUpdates.size>0){const $=Uf(xt.width,xt.height,P.format,P.type);for(const ut of P.layerUpdates){const Ft=xt.data.subarray(ut*$/xt.data.BYTES_PER_ELEMENT,(ut+1)*$/xt.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ut,xt.width,xt.height,1,Ut,tt,Ft)}P.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,xt.width,xt.height,xt.depth,Ut,tt,xt.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,j,xt.width,xt.height,xt.depth,0,Ut,tt,xt.data);else if(P.isData3DTexture)Nt?(It&&e.texStorage3D(n.TEXTURE_3D,bt,j,xt.width,xt.height,xt.depth),U&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,xt.width,xt.height,xt.depth,Ut,tt,xt.data)):e.texImage3D(n.TEXTURE_3D,0,j,xt.width,xt.height,xt.depth,0,Ut,tt,xt.data);else if(P.isFramebufferTexture){if(It)if(Nt)e.texStorage2D(n.TEXTURE_2D,bt,j,xt.width,xt.height);else{let $=xt.width,ut=xt.height;for(let Ft=0;Ft<bt;Ft++)e.texImage2D(n.TEXTURE_2D,Ft,j,$,ut,0,Ut,tt,null),$>>=1,ut>>=1}}else if(Ht.length>0){if(Nt&&It){const $=Rt(Ht[0]);e.texStorage2D(n.TEXTURE_2D,bt,j,$.width,$.height)}for(let $=0,ut=Ht.length;$<ut;$++)pt=Ht[$],Nt?U&&e.texSubImage2D(n.TEXTURE_2D,$,0,0,Ut,tt,pt):e.texImage2D(n.TEXTURE_2D,$,j,Ut,tt,pt);P.generateMipmaps=!1}else if(Nt){if(It){const $=Rt(xt);e.texStorage2D(n.TEXTURE_2D,bt,j,$.width,$.height)}U&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,Ut,tt,xt)}else e.texImage2D(n.TEXTURE_2D,0,j,Ut,tt,xt);g(P)&&p(mt),zt.__version=dt.version,P.onUpdate&&P.onUpdate(P)}L.__version=P.version}function B(L,P,Q){if(P.image.length!==6)return;const mt=Lt(L,P),ot=P.source;e.bindTexture(n.TEXTURE_CUBE_MAP,L.__webglTexture,n.TEXTURE0+Q);const dt=i.get(ot);if(ot.version!==dt.__version||mt===!0){e.activeTexture(n.TEXTURE0+Q);const zt=Te.getPrimaries(Te.workingColorSpace),Ct=P.colorSpace===fa?null:Te.getPrimaries(P.colorSpace),St=P.colorSpace===fa||zt===Ct?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,P.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,P.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,P.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,St);const Yt=P.isCompressedTexture||P.image[0].isCompressedTexture,xt=P.image[0]&&P.image[0].isDataTexture,Ut=[];for(let ut=0;ut<6;ut++)!Yt&&!xt?Ut[ut]=v(P.image[ut],!0,a.maxCubemapSize):Ut[ut]=xt?P.image[ut].image:P.image[ut],Ut[ut]=ft(P,Ut[ut]);const tt=Ut[0],j=s.convert(P.format,P.colorSpace),pt=s.convert(P.type),Ht=x(P.internalFormat,j,pt,P.colorSpace),Nt=P.isVideoTexture!==!0,It=dt.__version===void 0||mt===!0,U=ot.dataReady;let bt=S(P,tt);gt(n.TEXTURE_CUBE_MAP,P);let $;if(Yt){Nt&&It&&e.texStorage2D(n.TEXTURE_CUBE_MAP,bt,Ht,tt.width,tt.height);for(let ut=0;ut<6;ut++){$=Ut[ut].mipmaps;for(let Ft=0;Ft<$.length;Ft++){const Dt=$[Ft];P.format!==Si?j!==null?Nt?U&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ft,0,0,Dt.width,Dt.height,j,Dt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ft,Ht,Dt.width,Dt.height,0,Dt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Nt?U&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ft,0,0,Dt.width,Dt.height,j,pt,Dt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ft,Ht,Dt.width,Dt.height,0,j,pt,Dt.data)}}}else{if($=P.mipmaps,Nt&&It){$.length>0&&bt++;const ut=Rt(Ut[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,bt,Ht,ut.width,ut.height)}for(let ut=0;ut<6;ut++)if(xt){Nt?U&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,0,0,Ut[ut].width,Ut[ut].height,j,pt,Ut[ut].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,Ht,Ut[ut].width,Ut[ut].height,0,j,pt,Ut[ut].data);for(let Ft=0;Ft<$.length;Ft++){const qt=$[Ft].image[ut].image;Nt?U&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ft+1,0,0,qt.width,qt.height,j,pt,qt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ft+1,Ht,qt.width,qt.height,0,j,pt,qt.data)}}else{Nt?U&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,0,0,j,pt,Ut[ut]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,Ht,j,pt,Ut[ut]);for(let Ft=0;Ft<$.length;Ft++){const Dt=$[Ft];Nt?U&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ft+1,0,0,j,pt,Dt.image[ut]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Ft+1,Ht,j,pt,Dt.image[ut])}}}g(P)&&p(n.TEXTURE_CUBE_MAP),dt.__version=ot.version,P.onUpdate&&P.onUpdate(P)}L.__version=P.version}function Y(L,P,Q,mt,ot,dt){const zt=s.convert(Q.format,Q.colorSpace),Ct=s.convert(Q.type),St=x(Q.internalFormat,zt,Ct,Q.colorSpace),Yt=i.get(P),xt=i.get(Q);if(xt.__renderTarget=P,!Yt.__hasExternalTextures){const Ut=Math.max(1,P.width>>dt),tt=Math.max(1,P.height>>dt);ot===n.TEXTURE_3D||ot===n.TEXTURE_2D_ARRAY?e.texImage3D(ot,dt,St,Ut,tt,P.depth,0,zt,Ct,null):e.texImage2D(ot,dt,St,Ut,tt,0,zt,Ct,null)}e.bindFramebuffer(n.FRAMEBUFFER,L),lt(P)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,mt,ot,xt.__webglTexture,0,Et(P)):(ot===n.TEXTURE_2D||ot>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ot<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,mt,ot,xt.__webglTexture,dt),e.bindFramebuffer(n.FRAMEBUFFER,null)}function q(L,P,Q){if(n.bindRenderbuffer(n.RENDERBUFFER,L),P.depthBuffer){const mt=P.depthTexture,ot=mt&&mt.isDepthTexture?mt.type:null,dt=y(P.stencilBuffer,ot),zt=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ct=Et(P);lt(P)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ct,dt,P.width,P.height):Q?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ct,dt,P.width,P.height):n.renderbufferStorage(n.RENDERBUFFER,dt,P.width,P.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,zt,n.RENDERBUFFER,L)}else{const mt=P.textures;for(let ot=0;ot<mt.length;ot++){const dt=mt[ot],zt=s.convert(dt.format,dt.colorSpace),Ct=s.convert(dt.type),St=x(dt.internalFormat,zt,Ct,dt.colorSpace),Yt=Et(P);Q&&lt(P)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Yt,St,P.width,P.height):lt(P)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Yt,St,P.width,P.height):n.renderbufferStorage(n.RENDERBUFFER,St,P.width,P.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function K(L,P){if(P&&P.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,L),!(P.depthTexture&&P.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const mt=i.get(P.depthTexture);mt.__renderTarget=P,(!mt.__webglTexture||P.depthTexture.image.width!==P.width||P.depthTexture.image.height!==P.height)&&(P.depthTexture.image.width=P.width,P.depthTexture.image.height=P.height,P.depthTexture.needsUpdate=!0),A(P.depthTexture,0);const ot=mt.__webglTexture,dt=Et(P);if(P.depthTexture.format===Fs)lt(P)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ot,0,dt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ot,0);else if(P.depthTexture.format===$s)lt(P)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ot,0,dt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ot,0);else throw new Error("Unknown depthTexture format")}function st(L){const P=i.get(L),Q=L.isWebGLCubeRenderTarget===!0;if(P.__boundDepthTexture!==L.depthTexture){const mt=L.depthTexture;if(P.__depthDisposeCallback&&P.__depthDisposeCallback(),mt){const ot=()=>{delete P.__boundDepthTexture,delete P.__depthDisposeCallback,mt.removeEventListener("dispose",ot)};mt.addEventListener("dispose",ot),P.__depthDisposeCallback=ot}P.__boundDepthTexture=mt}if(L.depthTexture&&!P.__autoAllocateDepthBuffer){if(Q)throw new Error("target.depthTexture not supported in Cube render targets");K(P.__webglFramebuffer,L)}else if(Q){P.__webglDepthbuffer=[];for(let mt=0;mt<6;mt++)if(e.bindFramebuffer(n.FRAMEBUFFER,P.__webglFramebuffer[mt]),P.__webglDepthbuffer[mt]===void 0)P.__webglDepthbuffer[mt]=n.createRenderbuffer(),q(P.__webglDepthbuffer[mt],L,!1);else{const ot=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,dt=P.__webglDepthbuffer[mt];n.bindRenderbuffer(n.RENDERBUFFER,dt),n.framebufferRenderbuffer(n.FRAMEBUFFER,ot,n.RENDERBUFFER,dt)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,P.__webglFramebuffer),P.__webglDepthbuffer===void 0)P.__webglDepthbuffer=n.createRenderbuffer(),q(P.__webglDepthbuffer,L,!1);else{const mt=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ot=P.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ot),n.framebufferRenderbuffer(n.FRAMEBUFFER,mt,n.RENDERBUFFER,ot)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Tt(L,P,Q){const mt=i.get(L);P!==void 0&&Y(mt.__webglFramebuffer,L,L.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),Q!==void 0&&st(L)}function Gt(L){const P=L.texture,Q=i.get(L),mt=i.get(P);L.addEventListener("dispose",T);const ot=L.textures,dt=L.isWebGLCubeRenderTarget===!0,zt=ot.length>1;if(zt||(mt.__webglTexture===void 0&&(mt.__webglTexture=n.createTexture()),mt.__version=P.version,o.memory.textures++),dt){Q.__webglFramebuffer=[];for(let Ct=0;Ct<6;Ct++)if(P.mipmaps&&P.mipmaps.length>0){Q.__webglFramebuffer[Ct]=[];for(let St=0;St<P.mipmaps.length;St++)Q.__webglFramebuffer[Ct][St]=n.createFramebuffer()}else Q.__webglFramebuffer[Ct]=n.createFramebuffer()}else{if(P.mipmaps&&P.mipmaps.length>0){Q.__webglFramebuffer=[];for(let Ct=0;Ct<P.mipmaps.length;Ct++)Q.__webglFramebuffer[Ct]=n.createFramebuffer()}else Q.__webglFramebuffer=n.createFramebuffer();if(zt)for(let Ct=0,St=ot.length;Ct<St;Ct++){const Yt=i.get(ot[Ct]);Yt.__webglTexture===void 0&&(Yt.__webglTexture=n.createTexture(),o.memory.textures++)}if(L.samples>0&&lt(L)===!1){Q.__webglMultisampledFramebuffer=n.createFramebuffer(),Q.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,Q.__webglMultisampledFramebuffer);for(let Ct=0;Ct<ot.length;Ct++){const St=ot[Ct];Q.__webglColorRenderbuffer[Ct]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,Q.__webglColorRenderbuffer[Ct]);const Yt=s.convert(St.format,St.colorSpace),xt=s.convert(St.type),Ut=x(St.internalFormat,Yt,xt,St.colorSpace,L.isXRRenderTarget===!0),tt=Et(L);n.renderbufferStorageMultisample(n.RENDERBUFFER,tt,Ut,L.width,L.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ct,n.RENDERBUFFER,Q.__webglColorRenderbuffer[Ct])}n.bindRenderbuffer(n.RENDERBUFFER,null),L.depthBuffer&&(Q.__webglDepthRenderbuffer=n.createRenderbuffer(),q(Q.__webglDepthRenderbuffer,L,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(dt){e.bindTexture(n.TEXTURE_CUBE_MAP,mt.__webglTexture),gt(n.TEXTURE_CUBE_MAP,P);for(let Ct=0;Ct<6;Ct++)if(P.mipmaps&&P.mipmaps.length>0)for(let St=0;St<P.mipmaps.length;St++)Y(Q.__webglFramebuffer[Ct][St],L,P,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Ct,St);else Y(Q.__webglFramebuffer[Ct],L,P,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Ct,0);g(P)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(zt){for(let Ct=0,St=ot.length;Ct<St;Ct++){const Yt=ot[Ct],xt=i.get(Yt);e.bindTexture(n.TEXTURE_2D,xt.__webglTexture),gt(n.TEXTURE_2D,Yt),Y(Q.__webglFramebuffer,L,Yt,n.COLOR_ATTACHMENT0+Ct,n.TEXTURE_2D,0),g(Yt)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let Ct=n.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(Ct=L.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(Ct,mt.__webglTexture),gt(Ct,P),P.mipmaps&&P.mipmaps.length>0)for(let St=0;St<P.mipmaps.length;St++)Y(Q.__webglFramebuffer[St],L,P,n.COLOR_ATTACHMENT0,Ct,St);else Y(Q.__webglFramebuffer,L,P,n.COLOR_ATTACHMENT0,Ct,0);g(P)&&p(Ct),e.unbindTexture()}L.depthBuffer&&st(L)}function J(L){const P=L.textures;for(let Q=0,mt=P.length;Q<mt;Q++){const ot=P[Q];if(g(ot)){const dt=_(L),zt=i.get(ot).__webglTexture;e.bindTexture(dt,zt),p(dt),e.unbindTexture()}}}const V=[],O=[];function Pt(L){if(L.samples>0){if(lt(L)===!1){const P=L.textures,Q=L.width,mt=L.height;let ot=n.COLOR_BUFFER_BIT;const dt=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,zt=i.get(L),Ct=P.length>1;if(Ct)for(let St=0;St<P.length;St++)e.bindFramebuffer(n.FRAMEBUFFER,zt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+St,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,zt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+St,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,zt.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,zt.__webglFramebuffer);for(let St=0;St<P.length;St++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(ot|=n.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(ot|=n.STENCIL_BUFFER_BIT)),Ct){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,zt.__webglColorRenderbuffer[St]);const Yt=i.get(P[St]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Yt,0)}n.blitFramebuffer(0,0,Q,mt,0,0,Q,mt,ot,n.NEAREST),c===!0&&(V.length=0,O.length=0,V.push(n.COLOR_ATTACHMENT0+St),L.depthBuffer&&L.resolveDepthBuffer===!1&&(V.push(dt),O.push(dt),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,O)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,V))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Ct)for(let St=0;St<P.length;St++){e.bindFramebuffer(n.FRAMEBUFFER,zt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+St,n.RENDERBUFFER,zt.__webglColorRenderbuffer[St]);const Yt=i.get(P[St]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,zt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+St,n.TEXTURE_2D,Yt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,zt.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.resolveDepthBuffer===!1&&c){const P=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[P])}}}function Et(L){return Math.min(a.maxSamples,L.samples)}function lt(L){const P=i.get(L);return L.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&P.__useRenderToTexture!==!1}function vt(L){const P=o.render.frame;d.get(L)!==P&&(d.set(L,P),L.update())}function ft(L,P){const Q=L.colorSpace,mt=L.format,ot=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||Q!==js&&Q!==fa&&(Te.getTransfer(Q)===Ne?(mt!==Si||ot!==na)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Q)),P}function Rt(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(l.width=L.naturalWidth||L.width,l.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(l.width=L.displayWidth,l.height=L.displayHeight):(l.width=L.width,l.height=L.height),l}this.allocateTextureUnit=D,this.resetTextureUnits=k,this.setTexture2D=A,this.setTexture2DArray=E,this.setTexture3D=z,this.setTextureCube=G,this.rebindTextures=Tt,this.setupRenderTarget=Gt,this.updateRenderTargetMipmap=J,this.updateMultisampleRenderTarget=Pt,this.setupDepthRenderbuffer=st,this.setupFrameBufferTexture=Y,this.useMultisampledRTT=lt}function JT(n,t){function e(i,a=fa){let s;const o=Te.getTransfer(a);if(i===na)return n.UNSIGNED_BYTE;if(i===ah)return n.UNSIGNED_SHORT_4_4_4_4;if(i===sh)return n.UNSIGNED_SHORT_5_5_5_1;if(i===um)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===dm)return n.BYTE;if(i===hm)return n.SHORT;if(i===Bo)return n.UNSIGNED_SHORT;if(i===ih)return n.INT;if(i===ja)return n.UNSIGNED_INT;if(i===zi)return n.FLOAT;if(i===$o)return n.HALF_FLOAT;if(i===fm)return n.ALPHA;if(i===pm)return n.RGB;if(i===Si)return n.RGBA;if(i===mm)return n.LUMINANCE;if(i===gm)return n.LUMINANCE_ALPHA;if(i===Fs)return n.DEPTH_COMPONENT;if(i===$s)return n.DEPTH_STENCIL;if(i===oh)return n.RED;if(i===rh)return n.RED_INTEGER;if(i===xm)return n.RG;if(i===ch)return n.RG_INTEGER;if(i===lh)return n.RGBA_INTEGER;if(i===Hr||i===Gr||i===Xr||i===Vr)if(o===Ne)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Hr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Gr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Xr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Vr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Hr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Gr)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Xr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Vr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===ld||i===dd||i===hd||i===ud)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===ld)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===dd)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===hd)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===ud)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===fd||i===pd||i===md)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===fd||i===pd)return o===Ne?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===md)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===gd||i===xd||i===vd||i===yd||i===Md||i===_d||i===bd||i===Sd||i===wd||i===Ed||i===Td||i===Ad||i===Rd||i===Pd)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===gd)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===xd)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===vd)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===yd)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Md)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===_d)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===bd)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Sd)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===wd)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Ed)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Td)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ad)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Rd)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Pd)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Wr||i===Cd||i===Dd)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===Wr)return o===Ne?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Cd)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Dd)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===vm||i===Ld||i===kd||i===Id)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===Wr)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Ld)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===kd)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Id)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ys?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class QT extends fi{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class ge extends Qe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const tA={type:"move"};class _l{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ge,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ge,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new W,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new W),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ge,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new W,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new W),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let a=null,s=null,o=null;const r=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const v of t.hand.values()){const g=e.getJointPose(v,i),p=this._getHandJoint(l,v);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const d=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],h=d.position.distanceTo(u.position),f=.02,m=.005;l.inputState.pinching&&h>f+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&h<=f-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));r!==null&&(a=e.getPose(t.targetRaySpace,i),a===null&&s!==null&&(a=s),a!==null&&(r.matrix.fromArray(a.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,a.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(a.linearVelocity)):r.hasLinearVelocity=!1,a.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(a.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(tA)))}return r!==null&&(r.visible=a!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new ge;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const eA=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,nA=`
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

}`;class iA{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const a=new Fn,s=t.properties.get(a);s.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=a}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new Sa({vertexShader:eA,fragmentShader:nA,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ve(new Zn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class aA extends qs{constructor(t,e){super();const i=this;let a=null,s=1,o=null,r="local-floor",c=1,l=null,d=null,u=null,h=null,f=null,m=null;const v=new iA,g=e.getContextAttributes();let p=null,_=null;const x=[],y=[],S=new Wt;let w=null;const T=new fi;T.viewport=new sn;const R=new fi;R.viewport=new sn;const b=[T,R],M=new QT;let C=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let B=x[Z];return B===void 0&&(B=new _l,x[Z]=B),B.getTargetRaySpace()},this.getControllerGrip=function(Z){let B=x[Z];return B===void 0&&(B=new _l,x[Z]=B),B.getGripSpace()},this.getHand=function(Z){let B=x[Z];return B===void 0&&(B=new _l,x[Z]=B),B.getHandSpace()};function D(Z){const B=y.indexOf(Z.inputSource);if(B===-1)return;const Y=x[B];Y!==void 0&&(Y.update(Z.inputSource,Z.frame,l||o),Y.dispatchEvent({type:Z.type,data:Z.inputSource}))}function F(){a.removeEventListener("select",D),a.removeEventListener("selectstart",D),a.removeEventListener("selectend",D),a.removeEventListener("squeeze",D),a.removeEventListener("squeezestart",D),a.removeEventListener("squeezeend",D),a.removeEventListener("end",F),a.removeEventListener("inputsourceschange",A);for(let Z=0;Z<x.length;Z++){const B=y[Z];B!==null&&(y[Z]=null,x[Z].disconnect(B))}C=null,k=null,v.reset(),t.setRenderTarget(p),f=null,h=null,u=null,a=null,_=null,Lt.stop(),i.isPresenting=!1,t.setPixelRatio(w),t.setSize(S.width,S.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){s=Z,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){r=Z,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(Z){l=Z},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return u},this.getFrame=function(){return m},this.getSession=function(){return a},this.setSession=async function(Z){if(a=Z,a!==null){if(p=t.getRenderTarget(),a.addEventListener("select",D),a.addEventListener("selectstart",D),a.addEventListener("selectend",D),a.addEventListener("squeeze",D),a.addEventListener("squeezestart",D),a.addEventListener("squeezeend",D),a.addEventListener("end",F),a.addEventListener("inputsourceschange",A),g.xrCompatible!==!0&&await e.makeXRCompatible(),w=t.getPixelRatio(),t.getSize(S),a.renderState.layers===void 0){const B={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(a,e,B),a.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),_=new qa(f.framebufferWidth,f.framebufferHeight,{format:Si,type:na,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let B=null,Y=null,q=null;g.depth&&(q=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,B=g.stencil?$s:Fs,Y=g.stencil?Ys:ja);const K={colorFormat:e.RGBA8,depthFormat:q,scaleFactor:s};u=new XRWebGLBinding(a,e),h=u.createProjectionLayer(K),a.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),_=new qa(h.textureWidth,h.textureHeight,{format:Si,type:na,depthTexture:new Lm(h.textureWidth,h.textureHeight,Y,void 0,void 0,void 0,void 0,void 0,void 0,B),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await a.requestReferenceSpace(r),Lt.setContext(a),Lt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function A(Z){for(let B=0;B<Z.removed.length;B++){const Y=Z.removed[B],q=y.indexOf(Y);q>=0&&(y[q]=null,x[q].disconnect(Y))}for(let B=0;B<Z.added.length;B++){const Y=Z.added[B];let q=y.indexOf(Y);if(q===-1){for(let st=0;st<x.length;st++)if(st>=y.length){y.push(Y),q=st;break}else if(y[st]===null){y[st]=Y,q=st;break}if(q===-1)break}const K=x[q];K&&K.connect(Y)}}const E=new W,z=new W;function G(Z,B,Y){E.setFromMatrixPosition(B.matrixWorld),z.setFromMatrixPosition(Y.matrixWorld);const q=E.distanceTo(z),K=B.projectionMatrix.elements,st=Y.projectionMatrix.elements,Tt=K[14]/(K[10]-1),Gt=K[14]/(K[10]+1),J=(K[9]+1)/K[5],V=(K[9]-1)/K[5],O=(K[8]-1)/K[0],Pt=(st[8]+1)/st[0],Et=Tt*O,lt=Tt*Pt,vt=q/(-O+Pt),ft=vt*-O;if(B.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(ft),Z.translateZ(vt),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),K[10]===-1)Z.projectionMatrix.copy(B.projectionMatrix),Z.projectionMatrixInverse.copy(B.projectionMatrixInverse);else{const Rt=Tt+vt,L=Gt+vt,P=Et-ft,Q=lt+(q-ft),mt=J*Gt/L*Rt,ot=V*Gt/L*Rt;Z.projectionMatrix.makePerspective(P,Q,mt,ot,Rt,L),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function X(Z,B){B===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(B.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(a===null)return;let B=Z.near,Y=Z.far;v.texture!==null&&(v.depthNear>0&&(B=v.depthNear),v.depthFar>0&&(Y=v.depthFar)),M.near=R.near=T.near=B,M.far=R.far=T.far=Y,(C!==M.near||k!==M.far)&&(a.updateRenderState({depthNear:M.near,depthFar:M.far}),C=M.near,k=M.far),T.layers.mask=Z.layers.mask|2,R.layers.mask=Z.layers.mask|4,M.layers.mask=T.layers.mask|R.layers.mask;const q=Z.parent,K=M.cameras;X(M,q);for(let st=0;st<K.length;st++)X(K[st],q);K.length===2?G(M,T,R):M.projectionMatrix.copy(T.projectionMatrix),et(Z,M,q)};function et(Z,B,Y){Y===null?Z.matrix.copy(B.matrixWorld):(Z.matrix.copy(Y.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(B.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(B.projectionMatrix),Z.projectionMatrixInverse.copy(B.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Ho*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(h===null&&f===null))return c},this.setFoveation=function(Z){c=Z,h!==null&&(h.fixedFoveation=Z),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Z)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(M)};let ht=null;function gt(Z,B){if(d=B.getViewerPose(l||o),m=B,d!==null){const Y=d.views;f!==null&&(t.setRenderTargetFramebuffer(_,f.framebuffer),t.setRenderTarget(_));let q=!1;Y.length!==M.cameras.length&&(M.cameras.length=0,q=!0);for(let st=0;st<Y.length;st++){const Tt=Y[st];let Gt=null;if(f!==null)Gt=f.getViewport(Tt);else{const V=u.getViewSubImage(h,Tt);Gt=V.viewport,st===0&&(t.setRenderTargetTextures(_,V.colorTexture,h.ignoreDepthValues?void 0:V.depthStencilTexture),t.setRenderTarget(_))}let J=b[st];J===void 0&&(J=new fi,J.layers.enable(st),J.viewport=new sn,b[st]=J),J.matrix.fromArray(Tt.transform.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale),J.projectionMatrix.fromArray(Tt.projectionMatrix),J.projectionMatrixInverse.copy(J.projectionMatrix).invert(),J.viewport.set(Gt.x,Gt.y,Gt.width,Gt.height),st===0&&(M.matrix.copy(J.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),q===!0&&M.cameras.push(J)}const K=a.enabledFeatures;if(K&&K.includes("depth-sensing")){const st=u.getDepthInformation(Y[0]);st&&st.isValid&&st.texture&&v.init(t,st,a.renderState)}}for(let Y=0;Y<x.length;Y++){const q=y[Y],K=x[Y];q!==null&&K!==void 0&&K.update(q,B,l||o)}ht&&ht(Z,B),B.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:B}),m=null}const Lt=new Cm;Lt.setAnimationLoop(gt),this.setAnimationLoop=function(Z){ht=Z},this.dispose=function(){}}}const za=new Ni,sA=new Ce;function oA(n,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,Am(n)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function a(g,p,_,x,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(g,p):p.isMeshToonMaterial?(s(g,p),u(g,p)):p.isMeshPhongMaterial?(s(g,p),d(g,p)):p.isMeshStandardMaterial?(s(g,p),h(g,p),p.isMeshPhysicalMaterial&&f(g,p,y)):p.isMeshMatcapMaterial?(s(g,p),m(g,p)):p.isMeshDepthMaterial?s(g,p):p.isMeshDistanceMaterial?(s(g,p),v(g,p)):p.isMeshNormalMaterial?s(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&r(g,p)):p.isPointsMaterial?c(g,p,_,x):p.isSpriteMaterial?l(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===jn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===jn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const _=t.get(p),x=_.envMap,y=_.envMapRotation;x&&(g.envMap.value=x,za.copy(y),za.x*=-1,za.y*=-1,za.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(za.y*=-1,za.z*=-1),g.envMapRotation.value.setFromMatrix4(sA.makeRotationFromEuler(za)),g.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function r(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function c(g,p,_,x){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*_,g.scale.value=x*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function l(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function d(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function h(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,_){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===jn&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=_.texture,g.transmissionSamplerSize.value.set(_.width,_.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function v(g,p){const _=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(_.matrixWorld),g.nearDistance.value=_.shadow.camera.near,g.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:a}}function rA(n,t,e,i){let a={},s={},o=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(_,x){const y=x.program;i.uniformBlockBinding(_,y)}function l(_,x){let y=a[_.id];y===void 0&&(m(_),y=d(_),a[_.id]=y,_.addEventListener("dispose",g));const S=x.program;i.updateUBOMapping(_,S);const w=t.render.frame;s[_.id]!==w&&(h(_),s[_.id]=w)}function d(_){const x=u();_.__bindingPointIndex=x;const y=n.createBuffer(),S=_.__size,w=_.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,S,w),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,y),y}function u(){for(let _=0;_<r;_++)if(o.indexOf(_)===-1)return o.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(_){const x=a[_.id],y=_.uniforms,S=_.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let w=0,T=y.length;w<T;w++){const R=Array.isArray(y[w])?y[w]:[y[w]];for(let b=0,M=R.length;b<M;b++){const C=R[b];if(f(C,w,b,S)===!0){const k=C.__offset,D=Array.isArray(C.value)?C.value:[C.value];let F=0;for(let A=0;A<D.length;A++){const E=D[A],z=v(E);typeof E=="number"||typeof E=="boolean"?(C.__data[0]=E,n.bufferSubData(n.UNIFORM_BUFFER,k+F,C.__data)):E.isMatrix3?(C.__data[0]=E.elements[0],C.__data[1]=E.elements[1],C.__data[2]=E.elements[2],C.__data[3]=0,C.__data[4]=E.elements[3],C.__data[5]=E.elements[4],C.__data[6]=E.elements[5],C.__data[7]=0,C.__data[8]=E.elements[6],C.__data[9]=E.elements[7],C.__data[10]=E.elements[8],C.__data[11]=0):(E.toArray(C.__data,F),F+=z.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,k,C.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(_,x,y,S){const w=_.value,T=x+"_"+y;if(S[T]===void 0)return typeof w=="number"||typeof w=="boolean"?S[T]=w:S[T]=w.clone(),!0;{const R=S[T];if(typeof w=="number"||typeof w=="boolean"){if(R!==w)return S[T]=w,!0}else if(R.equals(w)===!1)return R.copy(w),!0}return!1}function m(_){const x=_.uniforms;let y=0;const S=16;for(let T=0,R=x.length;T<R;T++){const b=Array.isArray(x[T])?x[T]:[x[T]];for(let M=0,C=b.length;M<C;M++){const k=b[M],D=Array.isArray(k.value)?k.value:[k.value];for(let F=0,A=D.length;F<A;F++){const E=D[F],z=v(E),G=y%S,X=G%z.boundary,et=G+X;y+=X,et!==0&&S-et<z.storage&&(y+=S-et),k.__data=new Float32Array(z.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=y,y+=z.storage}}}const w=y%S;return w>0&&(y+=S-w),_.__size=y,_.__cache={},this}function v(_){const x={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(x.boundary=4,x.storage=4):_.isVector2?(x.boundary=8,x.storage=8):_.isVector3||_.isColor?(x.boundary=16,x.storage=12):_.isVector4?(x.boundary=16,x.storage=16):_.isMatrix3?(x.boundary=48,x.storage=48):_.isMatrix4?(x.boundary=64,x.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),x}function g(_){const x=_.target;x.removeEventListener("dispose",g);const y=o.indexOf(x.__bindingPointIndex);o.splice(y,1),n.deleteBuffer(a[x.id]),delete a[x.id],delete s[x.id]}function p(){for(const _ in a)n.deleteBuffer(a[_]);o=[],a={},s={}}return{bind:c,update:l,dispose:p}}class cA{constructor(t={}){const{canvas:e=qb(),context:i=null,depth:a=!0,stencil:s=!1,alpha:o=!1,antialias:r=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:h=!1}=t;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=o;const m=new Uint32Array(4),v=new Int32Array(4);let g=null,p=null;const _=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Hn,this.toneMapping=ya,this.toneMappingExposure=1;const y=this;let S=!1,w=0,T=0,R=null,b=-1,M=null;const C=new sn,k=new sn;let D=null;const F=new Qt(0);let A=0,E=e.width,z=e.height,G=1,X=null,et=null;const ht=new sn(0,0,E,z),gt=new sn(0,0,E,z);let Lt=!1;const Z=new fh;let B=!1,Y=!1;const q=new Ce,K=new Ce,st=new W,Tt=new sn,Gt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let J=!1;function V(){return R===null?G:1}let O=i;function Pt(I,it){return e.getContext(I,it)}try{const I={alpha:!0,depth:a,stencil:s,antialias:r,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${eh}`),e.addEventListener("webglcontextlost",ut,!1),e.addEventListener("webglcontextrestored",Ft,!1),e.addEventListener("webglcontextcreationerror",Dt,!1),O===null){const it="webgl2";if(O=Pt(it,I),O===null)throw Pt(it)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(I){throw console.error("THREE.WebGLRenderer: "+I.message),I}let Et,lt,vt,ft,Rt,L,P,Q,mt,ot,dt,zt,Ct,St,Yt,xt,Ut,tt,j,pt,Ht,Nt,It,U;function bt(){Et=new fE(O),Et.init(),Nt=new JT(O,Et),lt=new rE(O,Et,t,Nt),vt=new jT(O,Et),lt.reverseDepthBuffer&&h&&vt.buffers.depth.setReversed(!0),ft=new gE(O),Rt=new IT,L=new KT(O,Et,vt,Rt,lt,Nt,ft),P=new lE(y),Q=new uE(y),mt=new S1(O),It=new sE(O,mt),ot=new pE(O,mt,ft,It),dt=new vE(O,ot,mt,ft),j=new xE(O,lt,L),xt=new cE(Rt),zt=new kT(y,P,Q,Et,lt,It,xt),Ct=new oA(y,Rt),St=new FT,Yt=new GT(Et),tt=new aE(y,P,Q,vt,dt,f,c),Ut=new $T(y,dt,lt),U=new rA(O,ft,lt,vt),pt=new oE(O,Et,ft),Ht=new mE(O,Et,ft),ft.programs=zt.programs,y.capabilities=lt,y.extensions=Et,y.properties=Rt,y.renderLists=St,y.shadowMap=Ut,y.state=vt,y.info=ft}bt();const $=new aA(y,O);this.xr=$,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const I=Et.get("WEBGL_lose_context");I&&I.loseContext()},this.forceContextRestore=function(){const I=Et.get("WEBGL_lose_context");I&&I.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(I){I!==void 0&&(G=I,this.setSize(E,z,!1))},this.getSize=function(I){return I.set(E,z)},this.setSize=function(I,it,ct=!0){if($.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}E=I,z=it,e.width=Math.floor(I*G),e.height=Math.floor(it*G),ct===!0&&(e.style.width=I+"px",e.style.height=it+"px"),this.setViewport(0,0,I,it)},this.getDrawingBufferSize=function(I){return I.set(E*G,z*G).floor()},this.setDrawingBufferSize=function(I,it,ct){E=I,z=it,G=ct,e.width=Math.floor(I*ct),e.height=Math.floor(it*ct),this.setViewport(0,0,I,it)},this.getCurrentViewport=function(I){return I.copy(C)},this.getViewport=function(I){return I.copy(ht)},this.setViewport=function(I,it,ct,rt){I.isVector4?ht.set(I.x,I.y,I.z,I.w):ht.set(I,it,ct,rt),vt.viewport(C.copy(ht).multiplyScalar(G).round())},this.getScissor=function(I){return I.copy(gt)},this.setScissor=function(I,it,ct,rt){I.isVector4?gt.set(I.x,I.y,I.z,I.w):gt.set(I,it,ct,rt),vt.scissor(k.copy(gt).multiplyScalar(G).round())},this.getScissorTest=function(){return Lt},this.setScissorTest=function(I){vt.setScissorTest(Lt=I)},this.setOpaqueSort=function(I){X=I},this.setTransparentSort=function(I){et=I},this.getClearColor=function(I){return I.copy(tt.getClearColor())},this.setClearColor=function(){tt.setClearColor.apply(tt,arguments)},this.getClearAlpha=function(){return tt.getClearAlpha()},this.setClearAlpha=function(){tt.setClearAlpha.apply(tt,arguments)},this.clear=function(I=!0,it=!0,ct=!0){let rt=0;if(I){let nt=!1;if(R!==null){const kt=R.texture.format;nt=kt===lh||kt===ch||kt===rh}if(nt){const kt=R.texture.type,Xt=kt===na||kt===ja||kt===Bo||kt===Ys||kt===ah||kt===sh,Zt=tt.getClearColor(),$t=tt.getClearAlpha(),se=Zt.r,ne=Zt.g,jt=Zt.b;Xt?(m[0]=se,m[1]=ne,m[2]=jt,m[3]=$t,O.clearBufferuiv(O.COLOR,0,m)):(v[0]=se,v[1]=ne,v[2]=jt,v[3]=$t,O.clearBufferiv(O.COLOR,0,v))}else rt|=O.COLOR_BUFFER_BIT}it&&(rt|=O.DEPTH_BUFFER_BIT),ct&&(rt|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(rt)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ut,!1),e.removeEventListener("webglcontextrestored",Ft,!1),e.removeEventListener("webglcontextcreationerror",Dt,!1),St.dispose(),Yt.dispose(),Rt.dispose(),P.dispose(),Q.dispose(),dt.dispose(),It.dispose(),U.dispose(),zt.dispose(),$.dispose(),$.removeEventListener("sessionstart",Ve),$.removeEventListener("sessionend",vn),Re.stop()};function ut(I){I.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),S=!0}function Ft(){console.log("THREE.WebGLRenderer: Context Restored."),S=!1;const I=ft.autoReset,it=Ut.enabled,ct=Ut.autoUpdate,rt=Ut.needsUpdate,nt=Ut.type;bt(),ft.autoReset=I,Ut.enabled=it,Ut.autoUpdate=ct,Ut.needsUpdate=rt,Ut.type=nt}function Dt(I){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",I.statusMessage)}function qt(I){const it=I.target;it.removeEventListener("dispose",qt),le(it)}function le(I){de(I),Rt.remove(I)}function de(I){const it=Rt.get(I).programs;it!==void 0&&(it.forEach(function(ct){zt.releaseProgram(ct)}),I.isShaderMaterial&&zt.releaseShaderCache(I))}this.renderBufferDirect=function(I,it,ct,rt,nt,kt){it===null&&(it=Gt);const Xt=nt.isMesh&&nt.matrixWorld.determinant()<0,Zt=wi(I,it,ct,rt,nt);vt.setMaterial(rt,Xt);let $t=ct.index,se=1;if(rt.wireframe===!0){if($t=ot.getWireframeAttribute(ct),$t===void 0)return;se=2}const ne=ct.drawRange,jt=ct.attributes.position;let ue=ne.start*se,ie=(ne.start+ne.count)*se;kt!==null&&(ue=Math.max(ue,kt.start*se),ie=Math.min(ie,(kt.start+kt.count)*se)),$t!==null?(ue=Math.max(ue,0),ie=Math.min(ie,$t.count)):jt!=null&&(ue=Math.max(ue,0),ie=Math.min(ie,jt.count));const H=ie-ue;if(H<0||H===1/0)return;It.setup(nt,rt,Zt,ct,$t);let At,_t=pt;if($t!==null&&(At=mt.get($t),_t=Ht,_t.setIndex(At)),nt.isMesh)rt.wireframe===!0?(vt.setLineWidth(rt.wireframeLinewidth*V()),_t.setMode(O.LINES)):_t.setMode(O.TRIANGLES);else if(nt.isLine){let Mt=rt.linewidth;Mt===void 0&&(Mt=1),vt.setLineWidth(Mt*V()),nt.isLineSegments?_t.setMode(O.LINES):nt.isLineLoop?_t.setMode(O.LINE_LOOP):_t.setMode(O.LINE_STRIP)}else nt.isPoints?_t.setMode(O.POINTS):nt.isSprite&&_t.setMode(O.TRIANGLES);if(nt.isBatchedMesh)if(nt._multiDrawInstances!==null)_t.renderMultiDrawInstances(nt._multiDrawStarts,nt._multiDrawCounts,nt._multiDrawCount,nt._multiDrawInstances);else if(Et.get("WEBGL_multi_draw"))_t.renderMultiDraw(nt._multiDrawStarts,nt._multiDrawCounts,nt._multiDrawCount);else{const Mt=nt._multiDrawStarts,te=nt._multiDrawCounts,Ot=nt._multiDrawCount,oe=$t?mt.get($t).bytesPerElement:1,ke=Rt.get(rt).currentProgram.getUniforms();for(let be=0;be<Ot;be++)ke.setValue(O,"_gl_DrawID",be),_t.render(Mt[be]/oe,te[be])}else if(nt.isInstancedMesh)_t.renderInstances(ue,H,nt.count);else if(ct.isInstancedBufferGeometry){const Mt=ct._maxInstanceCount!==void 0?ct._maxInstanceCount:1/0,te=Math.min(ct.instanceCount,Mt);_t.renderInstances(ue,H,te)}else _t.render(ue,H)};function ee(I,it,ct){I.transparent===!0&&I.side===je&&I.forceSinglePass===!1?(I.side=jn,I.needsUpdate=!0,Tn(I,it,ct),I.side=ba,I.needsUpdate=!0,Tn(I,it,ct),I.side=je):Tn(I,it,ct)}this.compile=function(I,it,ct=null){ct===null&&(ct=I),p=Yt.get(ct),p.init(it),x.push(p),ct.traverseVisible(function(nt){nt.isLight&&nt.layers.test(it.layers)&&(p.pushLight(nt),nt.castShadow&&p.pushShadow(nt))}),I!==ct&&I.traverseVisible(function(nt){nt.isLight&&nt.layers.test(it.layers)&&(p.pushLight(nt),nt.castShadow&&p.pushShadow(nt))}),p.setupLights();const rt=new Set;return I.traverse(function(nt){if(!(nt.isMesh||nt.isPoints||nt.isLine||nt.isSprite))return;const kt=nt.material;if(kt)if(Array.isArray(kt))for(let Xt=0;Xt<kt.length;Xt++){const Zt=kt[Xt];ee(Zt,ct,nt),rt.add(Zt)}else ee(kt,ct,nt),rt.add(kt)}),x.pop(),p=null,rt},this.compileAsync=function(I,it,ct=null){const rt=this.compile(I,it,ct);return new Promise(nt=>{function kt(){if(rt.forEach(function(Xt){Rt.get(Xt).currentProgram.isReady()&&rt.delete(Xt)}),rt.size===0){nt(I);return}setTimeout(kt,10)}Et.get("KHR_parallel_shader_compile")!==null?kt():setTimeout(kt,10)})};let we=null;function De(I){we&&we(I)}function Ve(){Re.stop()}function vn(){Re.start()}const Re=new Cm;Re.setAnimationLoop(De),typeof self<"u"&&Re.setContext(self),this.setAnimationLoop=function(I){we=I,$.setAnimationLoop(I),I===null?Re.stop():Re.start()},$.addEventListener("sessionstart",Ve),$.addEventListener("sessionend",vn),this.render=function(I,it){if(it!==void 0&&it.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(S===!0)return;if(I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),it.parent===null&&it.matrixWorldAutoUpdate===!0&&it.updateMatrixWorld(),$.enabled===!0&&$.isPresenting===!0&&($.cameraAutoUpdate===!0&&$.updateCamera(it),it=$.getCamera()),I.isScene===!0&&I.onBeforeRender(y,I,it,R),p=Yt.get(I,x.length),p.init(it),x.push(p),K.multiplyMatrices(it.projectionMatrix,it.matrixWorldInverse),Z.setFromProjectionMatrix(K),Y=this.localClippingEnabled,B=xt.init(this.clippingPlanes,Y),g=St.get(I,_.length),g.init(),_.push(g),$.enabled===!0&&$.isPresenting===!0){const kt=y.xr.getDepthSensingMesh();kt!==null&&Pe(kt,it,-1/0,y.sortObjects)}Pe(I,it,0,y.sortObjects),g.finish(),y.sortObjects===!0&&g.sort(X,et),J=$.enabled===!1||$.isPresenting===!1||$.hasDepthSensing()===!1,J&&tt.addToRenderList(g,I),this.info.render.frame++,B===!0&&xt.beginShadows();const ct=p.state.shadowsArray;Ut.render(ct,I,it),B===!0&&xt.endShadows(),this.info.autoReset===!0&&this.info.reset();const rt=g.opaque,nt=g.transmissive;if(p.setupLights(),it.isArrayCamera){const kt=it.cameras;if(nt.length>0)for(let Xt=0,Zt=kt.length;Xt<Zt;Xt++){const $t=kt[Xt];Rn(rt,nt,I,$t)}J&&tt.render(I);for(let Xt=0,Zt=kt.length;Xt<Zt;Xt++){const $t=kt[Xt];un(g,I,$t,$t.viewport)}}else nt.length>0&&Rn(rt,nt,I,it),J&&tt.render(I),un(g,I,it);R!==null&&(L.updateMultisampleRenderTarget(R),L.updateRenderTargetMipmap(R)),I.isScene===!0&&I.onAfterRender(y,I,it),It.resetDefaultState(),b=-1,M=null,x.pop(),x.length>0?(p=x[x.length-1],B===!0&&xt.setGlobalState(y.clippingPlanes,p.state.camera)):p=null,_.pop(),_.length>0?g=_[_.length-1]:g=null};function Pe(I,it,ct,rt){if(I.visible===!1)return;if(I.layers.test(it.layers)){if(I.isGroup)ct=I.renderOrder;else if(I.isLOD)I.autoUpdate===!0&&I.update(it);else if(I.isLight)p.pushLight(I),I.castShadow&&p.pushShadow(I);else if(I.isSprite){if(!I.frustumCulled||Z.intersectsSprite(I)){rt&&Tt.setFromMatrixPosition(I.matrixWorld).applyMatrix4(K);const Xt=dt.update(I),Zt=I.material;Zt.visible&&g.push(I,Xt,Zt,ct,Tt.z,null)}}else if((I.isMesh||I.isLine||I.isPoints)&&(!I.frustumCulled||Z.intersectsObject(I))){const Xt=dt.update(I),Zt=I.material;if(rt&&(I.boundingSphere!==void 0?(I.boundingSphere===null&&I.computeBoundingSphere(),Tt.copy(I.boundingSphere.center)):(Xt.boundingSphere===null&&Xt.computeBoundingSphere(),Tt.copy(Xt.boundingSphere.center)),Tt.applyMatrix4(I.matrixWorld).applyMatrix4(K)),Array.isArray(Zt)){const $t=Xt.groups;for(let se=0,ne=$t.length;se<ne;se++){const jt=$t[se],ue=Zt[jt.materialIndex];ue&&ue.visible&&g.push(I,Xt,ue,ct,Tt.z,jt)}}else Zt.visible&&g.push(I,Xt,Zt,ct,Tt.z,null)}}const kt=I.children;for(let Xt=0,Zt=kt.length;Xt<Zt;Xt++)Pe(kt[Xt],it,ct,rt)}function un(I,it,ct,rt){const nt=I.opaque,kt=I.transmissive,Xt=I.transparent;p.setupLightsView(ct),B===!0&&xt.setGlobalState(y.clippingPlanes,ct),rt&&vt.viewport(C.copy(rt)),nt.length>0&&nn(nt,it,ct),kt.length>0&&nn(kt,it,ct),Xt.length>0&&nn(Xt,it,ct),vt.buffers.depth.setTest(!0),vt.buffers.depth.setMask(!0),vt.buffers.color.setMask(!0),vt.setPolygonOffset(!1)}function Rn(I,it,ct,rt){if((ct.isScene===!0?ct.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[rt.id]===void 0&&(p.state.transmissionRenderTarget[rt.id]=new qa(1,1,{generateMipmaps:!0,type:Et.has("EXT_color_buffer_half_float")||Et.has("EXT_color_buffer_float")?$o:na,minFilter:Ya,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Te.workingColorSpace}));const kt=p.state.transmissionRenderTarget[rt.id],Xt=rt.viewport||C;kt.setSize(Xt.z,Xt.w);const Zt=y.getRenderTarget();y.setRenderTarget(kt),y.getClearColor(F),A=y.getClearAlpha(),A<1&&y.setClearColor(16777215,.5),y.clear(),J&&tt.render(ct);const $t=y.toneMapping;y.toneMapping=ya;const se=rt.viewport;if(rt.viewport!==void 0&&(rt.viewport=void 0),p.setupLightsView(rt),B===!0&&xt.setGlobalState(y.clippingPlanes,rt),nn(I,ct,rt),L.updateMultisampleRenderTarget(kt),L.updateRenderTargetMipmap(kt),Et.has("WEBGL_multisampled_render_to_texture")===!1){let ne=!1;for(let jt=0,ue=it.length;jt<ue;jt++){const ie=it[jt],H=ie.object,At=ie.geometry,_t=ie.material,Mt=ie.group;if(_t.side===je&&H.layers.test(rt.layers)){const te=_t.side;_t.side=jn,_t.needsUpdate=!0,En(H,ct,rt,At,_t,Mt),_t.side=te,_t.needsUpdate=!0,ne=!0}}ne===!0&&(L.updateMultisampleRenderTarget(kt),L.updateRenderTargetMipmap(kt))}y.setRenderTarget(Zt),y.setClearColor(F,A),se!==void 0&&(rt.viewport=se),y.toneMapping=$t}function nn(I,it,ct){const rt=it.isScene===!0?it.overrideMaterial:null;for(let nt=0,kt=I.length;nt<kt;nt++){const Xt=I[nt],Zt=Xt.object,$t=Xt.geometry,se=rt===null?Xt.material:rt,ne=Xt.group;Zt.layers.test(ct.layers)&&En(Zt,it,ct,$t,se,ne)}}function En(I,it,ct,rt,nt,kt){I.onBeforeRender(y,it,ct,rt,nt,kt),I.modelViewMatrix.multiplyMatrices(ct.matrixWorldInverse,I.matrixWorld),I.normalMatrix.getNormalMatrix(I.modelViewMatrix),nt.onBeforeRender(y,it,ct,rt,I,kt),nt.transparent===!0&&nt.side===je&&nt.forceSinglePass===!1?(nt.side=jn,nt.needsUpdate=!0,y.renderBufferDirect(ct,it,rt,nt,I,kt),nt.side=ba,nt.needsUpdate=!0,y.renderBufferDirect(ct,it,rt,nt,I,kt),nt.side=je):y.renderBufferDirect(ct,it,rt,nt,I,kt),I.onAfterRender(y,it,ct,rt,nt,kt)}function Tn(I,it,ct){it.isScene!==!0&&(it=Gt);const rt=Rt.get(I),nt=p.state.lights,kt=p.state.shadowsArray,Xt=nt.state.version,Zt=zt.getParameters(I,nt.state,kt,it,ct),$t=zt.getProgramCacheKey(Zt);let se=rt.programs;rt.environment=I.isMeshStandardMaterial?it.environment:null,rt.fog=it.fog,rt.envMap=(I.isMeshStandardMaterial?Q:P).get(I.envMap||rt.environment),rt.envMapRotation=rt.environment!==null&&I.envMap===null?it.environmentRotation:I.envMapRotation,se===void 0&&(I.addEventListener("dispose",qt),se=new Map,rt.programs=se);let ne=se.get($t);if(ne!==void 0){if(rt.currentProgram===ne&&rt.lightsStateVersion===Xt)return Vn(I,Zt),ne}else Zt.uniforms=zt.getUniforms(I),I.onBeforeCompile(Zt,y),ne=zt.acquireProgram(Zt,$t),se.set($t,ne),rt.uniforms=Zt.uniforms;const jt=rt.uniforms;return(!I.isShaderMaterial&&!I.isRawShaderMaterial||I.clipping===!0)&&(jt.clippingPlanes=xt.uniform),Vn(I,Zt),rt.needsLights=fn(I),rt.lightsStateVersion=Xt,rt.needsLights&&(jt.ambientLightColor.value=nt.state.ambient,jt.lightProbe.value=nt.state.probe,jt.directionalLights.value=nt.state.directional,jt.directionalLightShadows.value=nt.state.directionalShadow,jt.spotLights.value=nt.state.spot,jt.spotLightShadows.value=nt.state.spotShadow,jt.rectAreaLights.value=nt.state.rectArea,jt.ltc_1.value=nt.state.rectAreaLTC1,jt.ltc_2.value=nt.state.rectAreaLTC2,jt.pointLights.value=nt.state.point,jt.pointLightShadows.value=nt.state.pointShadow,jt.hemisphereLights.value=nt.state.hemi,jt.directionalShadowMap.value=nt.state.directionalShadowMap,jt.directionalShadowMatrix.value=nt.state.directionalShadowMatrix,jt.spotShadowMap.value=nt.state.spotShadowMap,jt.spotLightMatrix.value=nt.state.spotLightMatrix,jt.spotLightMap.value=nt.state.spotLightMap,jt.pointShadowMap.value=nt.state.pointShadowMap,jt.pointShadowMatrix.value=nt.state.pointShadowMatrix),rt.currentProgram=ne,rt.uniformsList=null,ne}function Xn(I){if(I.uniformsList===null){const it=I.currentProgram.getUniforms();I.uniformsList=Yr.seqWithValue(it.seq,I.uniforms)}return I.uniformsList}function Vn(I,it){const ct=Rt.get(I);ct.outputColorSpace=it.outputColorSpace,ct.batching=it.batching,ct.batchingColor=it.batchingColor,ct.instancing=it.instancing,ct.instancingColor=it.instancingColor,ct.instancingMorph=it.instancingMorph,ct.skinning=it.skinning,ct.morphTargets=it.morphTargets,ct.morphNormals=it.morphNormals,ct.morphColors=it.morphColors,ct.morphTargetsCount=it.morphTargetsCount,ct.numClippingPlanes=it.numClippingPlanes,ct.numIntersection=it.numClipIntersection,ct.vertexAlphas=it.vertexAlphas,ct.vertexTangents=it.vertexTangents,ct.toneMapping=it.toneMapping}function wi(I,it,ct,rt,nt){it.isScene!==!0&&(it=Gt),L.resetTextureUnits();const kt=it.fog,Xt=rt.isMeshStandardMaterial?it.environment:null,Zt=R===null?y.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:js,$t=(rt.isMeshStandardMaterial?Q:P).get(rt.envMap||Xt),se=rt.vertexColors===!0&&!!ct.attributes.color&&ct.attributes.color.itemSize===4,ne=!!ct.attributes.tangent&&(!!rt.normalMap||rt.anisotropy>0),jt=!!ct.morphAttributes.position,ue=!!ct.morphAttributes.normal,ie=!!ct.morphAttributes.color;let H=ya;rt.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(H=y.toneMapping);const At=ct.morphAttributes.position||ct.morphAttributes.normal||ct.morphAttributes.color,_t=At!==void 0?At.length:0,Mt=Rt.get(rt),te=p.state.lights;if(B===!0&&(Y===!0||I!==M)){const He=I===M&&rt.id===b;xt.setState(rt,I,He)}let Ot=!1;rt.version===Mt.__version?(Mt.needsLights&&Mt.lightsStateVersion!==te.state.version||Mt.outputColorSpace!==Zt||nt.isBatchedMesh&&Mt.batching===!1||!nt.isBatchedMesh&&Mt.batching===!0||nt.isBatchedMesh&&Mt.batchingColor===!0&&nt.colorTexture===null||nt.isBatchedMesh&&Mt.batchingColor===!1&&nt.colorTexture!==null||nt.isInstancedMesh&&Mt.instancing===!1||!nt.isInstancedMesh&&Mt.instancing===!0||nt.isSkinnedMesh&&Mt.skinning===!1||!nt.isSkinnedMesh&&Mt.skinning===!0||nt.isInstancedMesh&&Mt.instancingColor===!0&&nt.instanceColor===null||nt.isInstancedMesh&&Mt.instancingColor===!1&&nt.instanceColor!==null||nt.isInstancedMesh&&Mt.instancingMorph===!0&&nt.morphTexture===null||nt.isInstancedMesh&&Mt.instancingMorph===!1&&nt.morphTexture!==null||Mt.envMap!==$t||rt.fog===!0&&Mt.fog!==kt||Mt.numClippingPlanes!==void 0&&(Mt.numClippingPlanes!==xt.numPlanes||Mt.numIntersection!==xt.numIntersection)||Mt.vertexAlphas!==se||Mt.vertexTangents!==ne||Mt.morphTargets!==jt||Mt.morphNormals!==ue||Mt.morphColors!==ie||Mt.toneMapping!==H||Mt.morphTargetsCount!==_t)&&(Ot=!0):(Ot=!0,Mt.__version=rt.version);let oe=Mt.currentProgram;Ot===!0&&(oe=Tn(rt,it,nt));let ke=!1,be=!1,Oe=!1;const xe=oe.getUniforms(),fe=Mt.uniforms;if(vt.useProgram(oe.program)&&(ke=!0,be=!0,Oe=!0),rt.id!==b&&(b=rt.id,be=!0),ke||M!==I){vt.buffers.depth.getReversed()?(q.copy(I.projectionMatrix),Jb(q),Qb(q),xe.setValue(O,"projectionMatrix",q)):xe.setValue(O,"projectionMatrix",I.projectionMatrix),xe.setValue(O,"viewMatrix",I.matrixWorldInverse);const ln=xe.map.cameraPosition;ln!==void 0&&ln.setValue(O,st.setFromMatrixPosition(I.matrixWorld)),lt.logarithmicDepthBuffer&&xe.setValue(O,"logDepthBufFC",2/(Math.log(I.far+1)/Math.LN2)),(rt.isMeshPhongMaterial||rt.isMeshToonMaterial||rt.isMeshLambertMaterial||rt.isMeshBasicMaterial||rt.isMeshStandardMaterial||rt.isShaderMaterial)&&xe.setValue(O,"isOrthographic",I.isOrthographicCamera===!0),M!==I&&(M=I,be=!0,Oe=!0)}if(nt.isSkinnedMesh){xe.setOptional(O,nt,"bindMatrix"),xe.setOptional(O,nt,"bindMatrixInverse");const He=nt.skeleton;He&&(He.boneTexture===null&&He.computeBoneTexture(),xe.setValue(O,"boneTexture",He.boneTexture,L))}nt.isBatchedMesh&&(xe.setOptional(O,nt,"batchingTexture"),xe.setValue(O,"batchingTexture",nt._matricesTexture,L),xe.setOptional(O,nt,"batchingIdTexture"),xe.setValue(O,"batchingIdTexture",nt._indirectTexture,L),xe.setOptional(O,nt,"batchingColorTexture"),nt._colorsTexture!==null&&xe.setValue(O,"batchingColorTexture",nt._colorsTexture,L));const Ae=ct.morphAttributes;if((Ae.position!==void 0||Ae.normal!==void 0||Ae.color!==void 0)&&j.update(nt,ct,oe),(be||Mt.receiveShadow!==nt.receiveShadow)&&(Mt.receiveShadow=nt.receiveShadow,xe.setValue(O,"receiveShadow",nt.receiveShadow)),rt.isMeshGouraudMaterial&&rt.envMap!==null&&(fe.envMap.value=$t,fe.flipEnvMap.value=$t.isCubeTexture&&$t.isRenderTargetTexture===!1?-1:1),rt.isMeshStandardMaterial&&rt.envMap===null&&it.environment!==null&&(fe.envMapIntensity.value=it.environmentIntensity),be&&(xe.setValue(O,"toneMappingExposure",y.toneMappingExposure),Mt.needsLights&&Ei(fe,Oe),kt&&rt.fog===!0&&Ct.refreshFogUniforms(fe,kt),Ct.refreshMaterialUniforms(fe,rt,G,z,p.state.transmissionRenderTarget[I.id]),Yr.upload(O,Xn(Mt),fe,L)),rt.isShaderMaterial&&rt.uniformsNeedUpdate===!0&&(Yr.upload(O,Xn(Mt),fe,L),rt.uniformsNeedUpdate=!1),rt.isSpriteMaterial&&xe.setValue(O,"center",nt.center),xe.setValue(O,"modelViewMatrix",nt.modelViewMatrix),xe.setValue(O,"normalMatrix",nt.normalMatrix),xe.setValue(O,"modelMatrix",nt.matrixWorld),rt.isShaderMaterial||rt.isRawShaderMaterial){const He=rt.uniformsGroups;for(let ln=0,Pn=He.length;ln<Pn;ln++){const pi=He[ln];U.update(pi,oe),U.bind(pi,oe)}}return oe}function Ei(I,it){I.ambientLightColor.needsUpdate=it,I.lightProbe.needsUpdate=it,I.directionalLights.needsUpdate=it,I.directionalLightShadows.needsUpdate=it,I.pointLights.needsUpdate=it,I.pointLightShadows.needsUpdate=it,I.spotLights.needsUpdate=it,I.spotLightShadows.needsUpdate=it,I.rectAreaLights.needsUpdate=it,I.hemisphereLights.needsUpdate=it}function fn(I){return I.isMeshLambertMaterial||I.isMeshToonMaterial||I.isMeshPhongMaterial||I.isMeshStandardMaterial||I.isShadowMaterial||I.isShaderMaterial&&I.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(I,it,ct){Rt.get(I.texture).__webglTexture=it,Rt.get(I.depthTexture).__webglTexture=ct;const rt=Rt.get(I);rt.__hasExternalTextures=!0,rt.__autoAllocateDepthBuffer=ct===void 0,rt.__autoAllocateDepthBuffer||Et.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),rt.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(I,it){const ct=Rt.get(I);ct.__webglFramebuffer=it,ct.__useDefaultFramebuffer=it===void 0},this.setRenderTarget=function(I,it=0,ct=0){R=I,w=it,T=ct;let rt=!0,nt=null,kt=!1,Xt=!1;if(I){const $t=Rt.get(I);if($t.__useDefaultFramebuffer!==void 0)vt.bindFramebuffer(O.FRAMEBUFFER,null),rt=!1;else if($t.__webglFramebuffer===void 0)L.setupRenderTarget(I);else if($t.__hasExternalTextures)L.rebindTextures(I,Rt.get(I.texture).__webglTexture,Rt.get(I.depthTexture).__webglTexture);else if(I.depthBuffer){const jt=I.depthTexture;if($t.__boundDepthTexture!==jt){if(jt!==null&&Rt.has(jt)&&(I.width!==jt.image.width||I.height!==jt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");L.setupDepthRenderbuffer(I)}}const se=I.texture;(se.isData3DTexture||se.isDataArrayTexture||se.isCompressedArrayTexture)&&(Xt=!0);const ne=Rt.get(I).__webglFramebuffer;I.isWebGLCubeRenderTarget?(Array.isArray(ne[it])?nt=ne[it][ct]:nt=ne[it],kt=!0):I.samples>0&&L.useMultisampledRTT(I)===!1?nt=Rt.get(I).__webglMultisampledFramebuffer:Array.isArray(ne)?nt=ne[ct]:nt=ne,C.copy(I.viewport),k.copy(I.scissor),D=I.scissorTest}else C.copy(ht).multiplyScalar(G).floor(),k.copy(gt).multiplyScalar(G).floor(),D=Lt;if(vt.bindFramebuffer(O.FRAMEBUFFER,nt)&&rt&&vt.drawBuffers(I,nt),vt.viewport(C),vt.scissor(k),vt.setScissorTest(D),kt){const $t=Rt.get(I.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+it,$t.__webglTexture,ct)}else if(Xt){const $t=Rt.get(I.texture),se=it||0;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,$t.__webglTexture,ct||0,se)}b=-1},this.readRenderTargetPixels=function(I,it,ct,rt,nt,kt,Xt){if(!(I&&I.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Zt=Rt.get(I).__webglFramebuffer;if(I.isWebGLCubeRenderTarget&&Xt!==void 0&&(Zt=Zt[Xt]),Zt){vt.bindFramebuffer(O.FRAMEBUFFER,Zt);try{const $t=I.texture,se=$t.format,ne=$t.type;if(!lt.textureFormatReadable(se)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!lt.textureTypeReadable(ne)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}it>=0&&it<=I.width-rt&&ct>=0&&ct<=I.height-nt&&O.readPixels(it,ct,rt,nt,Nt.convert(se),Nt.convert(ne),kt)}finally{const $t=R!==null?Rt.get(R).__webglFramebuffer:null;vt.bindFramebuffer(O.FRAMEBUFFER,$t)}}},this.readRenderTargetPixelsAsync=async function(I,it,ct,rt,nt,kt,Xt){if(!(I&&I.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Zt=Rt.get(I).__webglFramebuffer;if(I.isWebGLCubeRenderTarget&&Xt!==void 0&&(Zt=Zt[Xt]),Zt){const $t=I.texture,se=$t.format,ne=$t.type;if(!lt.textureFormatReadable(se))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!lt.textureTypeReadable(ne))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(it>=0&&it<=I.width-rt&&ct>=0&&ct<=I.height-nt){vt.bindFramebuffer(O.FRAMEBUFFER,Zt);const jt=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,jt),O.bufferData(O.PIXEL_PACK_BUFFER,kt.byteLength,O.STREAM_READ),O.readPixels(it,ct,rt,nt,Nt.convert(se),Nt.convert(ne),0);const ue=R!==null?Rt.get(R).__webglFramebuffer:null;vt.bindFramebuffer(O.FRAMEBUFFER,ue);const ie=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await Kb(O,ie,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,jt),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,kt),O.deleteBuffer(jt),O.deleteSync(ie),kt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(I,it=null,ct=0){I.isTexture!==!0&&(bo("WebGLRenderer: copyFramebufferToTexture function signature has changed."),it=arguments[0]||null,I=arguments[1]);const rt=Math.pow(2,-ct),nt=Math.floor(I.image.width*rt),kt=Math.floor(I.image.height*rt),Xt=it!==null?it.x:0,Zt=it!==null?it.y:0;L.setTexture2D(I,0),O.copyTexSubImage2D(O.TEXTURE_2D,ct,0,0,Xt,Zt,nt,kt),vt.unbindTexture()},this.copyTextureToTexture=function(I,it,ct=null,rt=null,nt=0){I.isTexture!==!0&&(bo("WebGLRenderer: copyTextureToTexture function signature has changed."),rt=arguments[0]||null,I=arguments[1],it=arguments[2],nt=arguments[3]||0,ct=null);let kt,Xt,Zt,$t,se,ne,jt,ue,ie;const H=I.isCompressedTexture?I.mipmaps[nt]:I.image;ct!==null?(kt=ct.max.x-ct.min.x,Xt=ct.max.y-ct.min.y,Zt=ct.isBox3?ct.max.z-ct.min.z:1,$t=ct.min.x,se=ct.min.y,ne=ct.isBox3?ct.min.z:0):(kt=H.width,Xt=H.height,Zt=H.depth||1,$t=0,se=0,ne=0),rt!==null?(jt=rt.x,ue=rt.y,ie=rt.z):(jt=0,ue=0,ie=0);const At=Nt.convert(it.format),_t=Nt.convert(it.type);let Mt;it.isData3DTexture?(L.setTexture3D(it,0),Mt=O.TEXTURE_3D):it.isDataArrayTexture||it.isCompressedArrayTexture?(L.setTexture2DArray(it,0),Mt=O.TEXTURE_2D_ARRAY):(L.setTexture2D(it,0),Mt=O.TEXTURE_2D),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,it.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,it.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,it.unpackAlignment);const te=O.getParameter(O.UNPACK_ROW_LENGTH),Ot=O.getParameter(O.UNPACK_IMAGE_HEIGHT),oe=O.getParameter(O.UNPACK_SKIP_PIXELS),ke=O.getParameter(O.UNPACK_SKIP_ROWS),be=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,H.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,H.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,$t),O.pixelStorei(O.UNPACK_SKIP_ROWS,se),O.pixelStorei(O.UNPACK_SKIP_IMAGES,ne);const Oe=I.isDataArrayTexture||I.isData3DTexture,xe=it.isDataArrayTexture||it.isData3DTexture;if(I.isRenderTargetTexture||I.isDepthTexture){const fe=Rt.get(I),Ae=Rt.get(it),He=Rt.get(fe.__renderTarget),ln=Rt.get(Ae.__renderTarget);vt.bindFramebuffer(O.READ_FRAMEBUFFER,He.__webglFramebuffer),vt.bindFramebuffer(O.DRAW_FRAMEBUFFER,ln.__webglFramebuffer);for(let Pn=0;Pn<Zt;Pn++)Oe&&O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Rt.get(I).__webglTexture,nt,ne+Pn),I.isDepthTexture?(xe&&O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Rt.get(it).__webglTexture,nt,ie+Pn),O.blitFramebuffer($t,se,kt,Xt,jt,ue,kt,Xt,O.DEPTH_BUFFER_BIT,O.NEAREST)):xe?O.copyTexSubImage3D(Mt,nt,jt,ue,ie+Pn,$t,se,kt,Xt):O.copyTexSubImage2D(Mt,nt,jt,ue,ie+Pn,$t,se,kt,Xt);vt.bindFramebuffer(O.READ_FRAMEBUFFER,null),vt.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else xe?I.isDataTexture||I.isData3DTexture?O.texSubImage3D(Mt,nt,jt,ue,ie,kt,Xt,Zt,At,_t,H.data):it.isCompressedArrayTexture?O.compressedTexSubImage3D(Mt,nt,jt,ue,ie,kt,Xt,Zt,At,H.data):O.texSubImage3D(Mt,nt,jt,ue,ie,kt,Xt,Zt,At,_t,H):I.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,nt,jt,ue,kt,Xt,At,_t,H.data):I.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,nt,jt,ue,H.width,H.height,At,H.data):O.texSubImage2D(O.TEXTURE_2D,nt,jt,ue,kt,Xt,At,_t,H);O.pixelStorei(O.UNPACK_ROW_LENGTH,te),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Ot),O.pixelStorei(O.UNPACK_SKIP_PIXELS,oe),O.pixelStorei(O.UNPACK_SKIP_ROWS,ke),O.pixelStorei(O.UNPACK_SKIP_IMAGES,be),nt===0&&it.generateMipmaps&&O.generateMipmap(Mt),vt.unbindTexture()},this.copyTextureToTexture3D=function(I,it,ct=null,rt=null,nt=0){return I.isTexture!==!0&&(bo("WebGLRenderer: copyTextureToTexture3D function signature has changed."),ct=arguments[0]||null,rt=arguments[1]||null,I=arguments[2],it=arguments[3],nt=arguments[4]||0),bo('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(I,it,ct,rt,nt)},this.initRenderTarget=function(I){Rt.get(I).__webglFramebuffer===void 0&&L.setupRenderTarget(I)},this.initTexture=function(I){I.isCubeTexture?L.setTextureCube(I,0):I.isData3DTexture?L.setTexture3D(I,0):I.isDataArrayTexture||I.isCompressedArrayTexture?L.setTexture2DArray(I,0):L.setTexture2D(I,0),vt.unbindTexture()},this.resetState=function(){w=0,T=0,R=null,vt.reset(),It.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ta}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Te._getDrawingBufferColorSpace(t),e.unpackColorSpace=Te._getUnpackColorSpace()}}class lA extends Qe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ni,this.environmentIntensity=1,this.environmentRotation=new Ni,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class dA{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=zd,this.updateRanges=[],this.version=0,this.uuid=Ui()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let a=0,s=this.stride;a<s;a++)this.array[t+a]=e.array[i+a];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ui()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ui()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Nn=new W;class cc{constructor(t,e,i,a=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=a}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)Nn.fromBufferAttribute(this,e),Nn.applyMatrix4(t),this.setXYZ(e,Nn.x,Nn.y,Nn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Nn.fromBufferAttribute(this,e),Nn.applyNormalMatrix(t),this.setXYZ(e,Nn.x,Nn.y,Nn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Nn.fromBufferAttribute(this,e),Nn.transformDirection(t),this.setXYZ(e,Nn.x,Nn.y,Nn.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=bi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=ze(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=ze(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ze(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ze(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ze(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=bi(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=bi(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=bi(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=bi(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=ze(e,this.array),i=ze(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=ze(e,this.array),i=ze(i,this.array),a=ze(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ze(e,this.array),i=ze(i,this.array),a=ze(a,this.array),s=ze(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this.data.array[t+3]=s,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return new wn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new cc(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Ud extends Qa{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new Qt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Es;const mo=new W,Ts=new W,As=new W,Rs=new Wt,go=new Wt,Um=new Ce,Er=new W,xo=new W,Tr=new W,Nf=new Wt,bl=new Wt,Of=new Wt;class Bf extends Qe{constructor(t=new Ud){if(super(),this.isSprite=!0,this.type="Sprite",Es===void 0){Es=new en;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new dA(e,5);Es.setIndex([0,1,2,0,2,3]),Es.setAttribute("position",new cc(i,3,0,!1)),Es.setAttribute("uv",new cc(i,2,3,!1))}this.geometry=Es,this.material=t,this.center=new Wt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ts.setFromMatrixScale(this.matrixWorld),Um.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),As.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ts.multiplyScalar(-As.z);const i=this.material.rotation;let a,s;i!==0&&(s=Math.cos(i),a=Math.sin(i));const o=this.center;Ar(Er.set(-.5,-.5,0),As,o,Ts,a,s),Ar(xo.set(.5,-.5,0),As,o,Ts,a,s),Ar(Tr.set(.5,.5,0),As,o,Ts,a,s),Nf.set(0,0),bl.set(1,0),Of.set(1,1);let r=t.ray.intersectTriangle(Er,xo,Tr,!1,mo);if(r===null&&(Ar(xo.set(-.5,.5,0),As,o,Ts,a,s),bl.set(0,1),r=t.ray.intersectTriangle(Er,Tr,xo,!1,mo),r===null))return;const c=t.ray.origin.distanceTo(mo);c<t.near||c>t.far||e.push({distance:c,point:mo.clone(),uv:si.getInterpolation(mo,Er,xo,Tr,Nf,bl,Of,new Wt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Ar(n,t,e,i,a,s){Rs.subVectors(n,e).addScalar(.5).multiply(i),a!==void 0?(go.x=s*Rs.x-a*Rs.y,go.y=a*Rs.x+s*Rs.y):go.copy(Rs),n.copy(t),n.x+=go.x,n.y+=go.y,n.applyMatrix4(Um)}class hA extends Fn{constructor(t=null,e=1,i=1,a,s,o,r,c,l=oi,d=oi,u,h){super(null,o,r,c,l,d,a,s,u,h),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Co extends wn{constructor(t,e,i,a=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=a}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Ps=new Ce,Hf=new Ce,Rr=[],Gf=new Ja,uA=new Ce,vo=new ve,yo=new Ks;class Xf extends ve{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Co(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let a=0;a<i;a++)this.setMatrixAt(a,uA)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Ja),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,Ps),Gf.copy(t.boundingBox).applyMatrix4(Ps),this.boundingBox.union(Gf)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ks),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,Ps),yo.copy(t.boundingSphere).applyMatrix4(Ps),this.boundingSphere.union(yo)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const i=e.morphTargetInfluences,a=this.morphTexture.source.data.data,s=i.length+1,o=t*s+1;for(let r=0;r<i.length;r++)i[r]=a[o+r]}raycast(t,e){const i=this.matrixWorld,a=this.count;if(vo.geometry=this.geometry,vo.material=this.material,vo.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),yo.copy(this.boundingSphere),yo.applyMatrix4(i),t.ray.intersectsSphere(yo)!==!1))for(let s=0;s<a;s++){this.getMatrixAt(s,Ps),Hf.multiplyMatrices(i,Ps),vo.matrixWorld=Hf,vo.raycast(t,Rr);for(let o=0,r=Rr.length;o<r;o++){const c=Rr[o];c.instanceId=s,c.object=this,e.push(c)}Rr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Co(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const i=e.morphTargetInfluences,a=i.length+1;this.morphTexture===null&&(this.morphTexture=new hA(new Float32Array(a*this.count),a,this.count,oh,zi));const s=this.morphTexture.source.data.data;let o=0;for(let l=0;l<i.length;l++)o+=i[l];const r=this.geometry.morphTargetsRelative?1:1-o,c=a*t;s[c]=r,s.set(i,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Nd extends Qa{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Qt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const lc=new W,dc=new W,Vf=new Ce,Mo=new hh,Pr=new Ks,Sl=new W,Wf=new W;class fA extends Qe{constructor(t=new en,e=new Nd){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let a=1,s=e.count;a<s;a++)lc.fromBufferAttribute(e,a-1),dc.fromBufferAttribute(e,a),i[a]=i[a-1],i[a]+=lc.distanceTo(dc);t.setAttribute("lineDistance",new Le(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,a=this.matrixWorld,s=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Pr.copy(i.boundingSphere),Pr.applyMatrix4(a),Pr.radius+=s,t.ray.intersectsSphere(Pr)===!1)return;Vf.copy(a).invert(),Mo.copy(t.ray).applyMatrix4(Vf);const r=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=r*r,l=this.isLineSegments?2:1,d=i.index,h=i.attributes.position;if(d!==null){const f=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let v=f,g=m-1;v<g;v+=l){const p=d.getX(v),_=d.getX(v+1),x=Cr(this,t,Mo,c,p,_);x&&e.push(x)}if(this.isLineLoop){const v=d.getX(m-1),g=d.getX(f),p=Cr(this,t,Mo,c,v,g);p&&e.push(p)}}else{const f=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let v=f,g=m-1;v<g;v+=l){const p=Cr(this,t,Mo,c,v,v+1);p&&e.push(p)}if(this.isLineLoop){const v=Cr(this,t,Mo,c,m-1,f);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}}function Cr(n,t,e,i,a,s){const o=n.geometry.attributes.position;if(lc.fromBufferAttribute(o,a),dc.fromBufferAttribute(o,s),e.distanceSqToSegment(lc,dc,Sl,Wf)>i)return;Sl.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Sl);if(!(c<t.near||c>t.far))return{distance:c,point:Wf.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const Yf=new W,$f=new W;class Zf extends fA{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let a=0,s=e.count;a<s;a+=2)Yf.fromBufferAttribute(e,a),$f.fromBufferAttribute(e,a+1),i[a]=a===0?0:i[a-1],i[a+1]=i[a]+Yf.distanceTo($f);t.setAttribute("lineDistance",new Le(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Od extends Fn{constructor(t,e,i,a,s,o,r,c,l){super(t,e,i,a,s,o,r,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Bi{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,a=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),s+=i.distanceTo(a),e.push(s),a=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let a=0;const s=i.length;let o;e?o=e:o=t*i[s-1];let r=0,c=s-1,l;for(;r<=c;)if(a=Math.floor(r+(c-r)/2),l=i[a]-o,l<0)r=a+1;else if(l>0)c=a-1;else{c=a;break}if(a=c,i[a]===o)return a/(s-1);const d=i[a],h=i[a+1]-d,f=(o-d)/h;return(a+f)/(s-1)}getTangent(t,e){let a=t-1e-4,s=t+1e-4;a<0&&(a=0),s>1&&(s=1);const o=this.getPoint(a),r=this.getPoint(s),c=e||(o.isVector2?new Wt:new W);return c.copy(r).sub(o).normalize(),c}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new W,a=[],s=[],o=[],r=new W,c=new Ce;for(let f=0;f<=t;f++){const m=f/t;a[f]=this.getTangentAt(m,new W)}s[0]=new W,o[0]=new W;let l=Number.MAX_VALUE;const d=Math.abs(a[0].x),u=Math.abs(a[0].y),h=Math.abs(a[0].z);d<=l&&(l=d,i.set(1,0,0)),u<=l&&(l=u,i.set(0,1,0)),h<=l&&i.set(0,0,1),r.crossVectors(a[0],i).normalize(),s[0].crossVectors(a[0],r),o[0].crossVectors(a[0],s[0]);for(let f=1;f<=t;f++){if(s[f]=s[f-1].clone(),o[f]=o[f-1].clone(),r.crossVectors(a[f-1],a[f]),r.length()>Number.EPSILON){r.normalize();const m=Math.acos(An(a[f-1].dot(a[f]),-1,1));s[f].applyMatrix4(c.makeRotationAxis(r,m))}o[f].crossVectors(a[f],s[f])}if(e===!0){let f=Math.acos(An(s[0].dot(s[t]),-1,1));f/=t,a[0].dot(r.crossVectors(s[0],s[t]))>0&&(f=-f);for(let m=1;m<=t;m++)s[m].applyMatrix4(c.makeRotationAxis(a[m],f*m)),o[m].crossVectors(a[m],s[m])}return{tangents:a,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class mh extends Bi{constructor(t=0,e=0,i=1,a=1,s=0,o=Math.PI*2,r=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=a,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=r,this.aRotation=c}getPoint(t,e=new Wt){const i=e,a=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=a;for(;s>a;)s-=a;s<Number.EPSILON&&(o?s=0:s=a),this.aClockwise===!0&&!o&&(s===a?s=-a:s=s-a);const r=this.aStartAngle+t*s;let c=this.aX+this.xRadius*Math.cos(r),l=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),h=c-this.aX,f=l-this.aY;c=h*d-f*u+this.aX,l=h*u+f*d+this.aY}return i.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class pA extends mh{constructor(t,e,i,a,s,o){super(t,e,i,i,a,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function gh(){let n=0,t=0,e=0,i=0;function a(s,o,r,c){n=s,t=r,e=-3*s+3*o-2*r-c,i=2*s-2*o+r+c}return{initCatmullRom:function(s,o,r,c,l){a(o,r,l*(r-s),l*(c-o))},initNonuniformCatmullRom:function(s,o,r,c,l,d,u){let h=(o-s)/l-(r-s)/(l+d)+(r-o)/d,f=(r-o)/d-(c-o)/(d+u)+(c-r)/u;h*=d,f*=d,a(o,r,h,f)},calc:function(s){const o=s*s,r=o*s;return n+t*s+e*o+i*r}}}const Dr=new W,wl=new gh,El=new gh,Tl=new gh;class mA extends Bi{constructor(t=[],e=!1,i="centripetal",a=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=a}getPoint(t,e=new W){const i=e,a=this.points,s=a.length,o=(s-(this.closed?0:1))*t;let r=Math.floor(o),c=o-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/s)+1)*s:c===0&&r===s-1&&(r=s-2,c=1);let l,d;this.closed||r>0?l=a[(r-1)%s]:(Dr.subVectors(a[0],a[1]).add(a[0]),l=Dr);const u=a[r%s],h=a[(r+1)%s];if(this.closed||r+2<s?d=a[(r+2)%s]:(Dr.subVectors(a[s-1],a[s-2]).add(a[s-1]),d=Dr),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let m=Math.pow(l.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(h),f),g=Math.pow(h.distanceToSquared(d),f);v<1e-4&&(v=1),m<1e-4&&(m=v),g<1e-4&&(g=v),wl.initNonuniformCatmullRom(l.x,u.x,h.x,d.x,m,v,g),El.initNonuniformCatmullRom(l.y,u.y,h.y,d.y,m,v,g),Tl.initNonuniformCatmullRom(l.z,u.z,h.z,d.z,m,v,g)}else this.curveType==="catmullrom"&&(wl.initCatmullRom(l.x,u.x,h.x,d.x,this.tension),El.initCatmullRom(l.y,u.y,h.y,d.y,this.tension),Tl.initCatmullRom(l.z,u.z,h.z,d.z,this.tension));return i.set(wl.calc(c),El.calc(c),Tl.calc(c)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new W().fromArray(a))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function jf(n,t,e,i,a){const s=(i-t)*.5,o=(a-e)*.5,r=n*n,c=n*r;return(2*e-2*i+s+o)*c+(-3*e+3*i-2*s-o)*r+s*n+e}function gA(n,t){const e=1-n;return e*e*t}function xA(n,t){return 2*(1-n)*n*t}function vA(n,t){return n*n*t}function Do(n,t,e,i){return gA(n,t)+xA(n,e)+vA(n,i)}function yA(n,t){const e=1-n;return e*e*e*t}function MA(n,t){const e=1-n;return 3*e*e*n*t}function _A(n,t){return 3*(1-n)*n*n*t}function bA(n,t){return n*n*n*t}function Lo(n,t,e,i,a){return yA(n,t)+MA(n,e)+_A(n,i)+bA(n,a)}class Nm extends Bi{constructor(t=new Wt,e=new Wt,i=new Wt,a=new Wt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new Wt){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(Lo(t,a.x,s.x,o.x,r.x),Lo(t,a.y,s.y,o.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class SA extends Bi{constructor(t=new W,e=new W,i=new W,a=new W){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new W){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(Lo(t,a.x,s.x,o.x,r.x),Lo(t,a.y,s.y,o.y,r.y),Lo(t,a.z,s.z,o.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Om extends Bi{constructor(t=new Wt,e=new Wt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Wt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Wt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class wA extends Bi{constructor(t=new W,e=new W){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new W){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new W){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Bm extends Bi{constructor(t=new Wt,e=new Wt,i=new Wt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Wt){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(Do(t,a.x,s.x,o.x),Do(t,a.y,s.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class EA extends Bi{constructor(t=new W,e=new W,i=new W){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new W){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(Do(t,a.x,s.x,o.x),Do(t,a.y,s.y,o.y),Do(t,a.z,s.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Hm extends Bi{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Wt){const i=e,a=this.points,s=(a.length-1)*t,o=Math.floor(s),r=s-o,c=a[o===0?o:o-1],l=a[o],d=a[o>a.length-2?a.length-1:o+1],u=a[o>a.length-3?a.length-1:o+2];return i.set(jf(r,c.x,l.x,d.x,u.x),jf(r,c.y,l.y,d.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new Wt().fromArray(a))}return this}}var qf=Object.freeze({__proto__:null,ArcCurve:pA,CatmullRomCurve3:mA,CubicBezierCurve:Nm,CubicBezierCurve3:SA,EllipseCurve:mh,LineCurve:Om,LineCurve3:wA,QuadraticBezierCurve:Bm,QuadraticBezierCurve3:EA,SplineCurve:Hm});class TA extends Bi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new qf[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),a=this.getCurveLengths();let s=0;for(;s<a.length;){if(a[s]>=i){const o=a[s]-i,r=this.curves[s],c=r.getLength(),l=c===0?0:1-o/c;return r.getPointAt(l,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,a=this.curves.length;i<a;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let a=0,s=this.curves;a<s.length;a++){const o=s[a],r=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(r);for(let l=0;l<c.length;l++){const d=c[l];i&&i.equals(d)||(e.push(d),i=d)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(a.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const a=this.curves[e];t.curves.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(new qf[a.type]().fromJSON(a))}return this}}class Kf extends TA{constructor(t){super(),this.type="Path",this.currentPoint=new Wt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new Om(this.currentPoint.clone(),new Wt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,a){const s=new Bm(this.currentPoint.clone(),new Wt(t,e),new Wt(i,a));return this.curves.push(s),this.currentPoint.set(i,a),this}bezierCurveTo(t,e,i,a,s,o){const r=new Nm(this.currentPoint.clone(),new Wt(t,e),new Wt(i,a),new Wt(s,o));return this.curves.push(r),this.currentPoint.set(s,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new Hm(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,a,s,o){const r=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+r,e+c,i,a,s,o),this}absarc(t,e,i,a,s,o){return this.absellipse(t,e,i,i,a,s,o),this}ellipse(t,e,i,a,s,o,r,c){const l=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(t+l,e+d,i,a,s,o,r,c),this}absellipse(t,e,i,a,s,o,r,c){const l=new mh(t,e,i,a,s,o,r,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const d=l.getPoint(1);return this.currentPoint.copy(d),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class xh extends en{constructor(t=1,e=32,i=0,a=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:a},e=Math.max(3,e);const s=[],o=[],r=[],c=[],l=new W,d=new Wt;o.push(0,0,0),r.push(0,0,1),c.push(.5,.5);for(let u=0,h=3;u<=e;u++,h+=3){const f=i+u/e*a;l.x=t*Math.cos(f),l.y=t*Math.sin(f),o.push(l.x,l.y,l.z),r.push(0,0,1),d.x=(o[h]/t+1)/2,d.y=(o[h+1]/t+1)/2,c.push(d.x,d.y)}for(let u=1;u<=e;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new Le(o,3)),this.setAttribute("normal",new Le(r,3)),this.setAttribute("uv",new Le(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new xh(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Go extends en{constructor(t=1,e=1,i=1,a=32,s=1,o=!1,r=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:a,heightSegments:s,openEnded:o,thetaStart:r,thetaLength:c};const l=this;a=Math.floor(a),s=Math.floor(s);const d=[],u=[],h=[],f=[];let m=0;const v=[],g=i/2;let p=0;_(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(d),this.setAttribute("position",new Le(u,3)),this.setAttribute("normal",new Le(h,3)),this.setAttribute("uv",new Le(f,2));function _(){const y=new W,S=new W;let w=0;const T=(e-t)/i;for(let R=0;R<=s;R++){const b=[],M=R/s,C=M*(e-t)+t;for(let k=0;k<=a;k++){const D=k/a,F=D*c+r,A=Math.sin(F),E=Math.cos(F);S.x=C*A,S.y=-M*i+g,S.z=C*E,u.push(S.x,S.y,S.z),y.set(A,T,E).normalize(),h.push(y.x,y.y,y.z),f.push(D,1-M),b.push(m++)}v.push(b)}for(let R=0;R<a;R++)for(let b=0;b<s;b++){const M=v[b][R],C=v[b+1][R],k=v[b+1][R+1],D=v[b][R+1];(t>0||b!==0)&&(d.push(M,C,D),w+=3),(e>0||b!==s-1)&&(d.push(C,k,D),w+=3)}l.addGroup(p,w,0),p+=w}function x(y){const S=m,w=new Wt,T=new W;let R=0;const b=y===!0?t:e,M=y===!0?1:-1;for(let k=1;k<=a;k++)u.push(0,g*M,0),h.push(0,M,0),f.push(.5,.5),m++;const C=m;for(let k=0;k<=a;k++){const F=k/a*c+r,A=Math.cos(F),E=Math.sin(F);T.x=b*E,T.y=g*M,T.z=b*A,u.push(T.x,T.y,T.z),h.push(0,M,0),w.x=A*.5+.5,w.y=E*.5*M+.5,f.push(w.x,w.y),m++}for(let k=0;k<a;k++){const D=S+k,F=C+k;y===!0?d.push(F,F+1,D):d.push(F+1,F,D),R+=3}l.addGroup(p,R,y===!0?1:2),p+=R}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Go(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class vh extends Go{constructor(t=1,e=1,i=32,a=1,s=!1,o=0,r=Math.PI*2){super(0,t,e,i,a,s,o,r),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:a,openEnded:s,thetaStart:o,thetaLength:r}}static fromJSON(t){return new vh(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class yh extends en{constructor(t=[],e=[],i=1,a=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:a};const s=[],o=[];r(a),l(i),d(),this.setAttribute("position",new Le(s,3)),this.setAttribute("normal",new Le(s.slice(),3)),this.setAttribute("uv",new Le(o,2)),a===0?this.computeVertexNormals():this.normalizeNormals();function r(_){const x=new W,y=new W,S=new W;for(let w=0;w<e.length;w+=3)f(e[w+0],x),f(e[w+1],y),f(e[w+2],S),c(x,y,S,_)}function c(_,x,y,S){const w=S+1,T=[];for(let R=0;R<=w;R++){T[R]=[];const b=_.clone().lerp(y,R/w),M=x.clone().lerp(y,R/w),C=w-R;for(let k=0;k<=C;k++)k===0&&R===w?T[R][k]=b:T[R][k]=b.clone().lerp(M,k/C)}for(let R=0;R<w;R++)for(let b=0;b<2*(w-R)-1;b++){const M=Math.floor(b/2);b%2===0?(h(T[R][M+1]),h(T[R+1][M]),h(T[R][M])):(h(T[R][M+1]),h(T[R+1][M+1]),h(T[R+1][M]))}}function l(_){const x=new W;for(let y=0;y<s.length;y+=3)x.x=s[y+0],x.y=s[y+1],x.z=s[y+2],x.normalize().multiplyScalar(_),s[y+0]=x.x,s[y+1]=x.y,s[y+2]=x.z}function d(){const _=new W;for(let x=0;x<s.length;x+=3){_.x=s[x+0],_.y=s[x+1],_.z=s[x+2];const y=g(_)/2/Math.PI+.5,S=p(_)/Math.PI+.5;o.push(y,1-S)}m(),u()}function u(){for(let _=0;_<o.length;_+=6){const x=o[_+0],y=o[_+2],S=o[_+4],w=Math.max(x,y,S),T=Math.min(x,y,S);w>.9&&T<.1&&(x<.2&&(o[_+0]+=1),y<.2&&(o[_+2]+=1),S<.2&&(o[_+4]+=1))}}function h(_){s.push(_.x,_.y,_.z)}function f(_,x){const y=_*3;x.x=t[y+0],x.y=t[y+1],x.z=t[y+2]}function m(){const _=new W,x=new W,y=new W,S=new W,w=new Wt,T=new Wt,R=new Wt;for(let b=0,M=0;b<s.length;b+=9,M+=6){_.set(s[b+0],s[b+1],s[b+2]),x.set(s[b+3],s[b+4],s[b+5]),y.set(s[b+6],s[b+7],s[b+8]),w.set(o[M+0],o[M+1]),T.set(o[M+2],o[M+3]),R.set(o[M+4],o[M+5]),S.copy(_).add(x).add(y).divideScalar(3);const C=g(S);v(w,M+0,_,C),v(T,M+2,x,C),v(R,M+4,y,C)}}function v(_,x,y,S){S<0&&_.x===1&&(o[x]=_.x-1),y.x===0&&y.z===0&&(o[x]=S/2/Math.PI+.5)}function g(_){return Math.atan2(_.z,-_.x)}function p(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new yh(t.vertices,t.indices,t.radius,t.details)}}const Lr=new W,kr=new W,Al=new W,Ir=new si;class AA extends en{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const a=Math.pow(10,4),s=Math.cos(Us*e),o=t.getIndex(),r=t.getAttribute("position"),c=o?o.count:r.count,l=[0,0,0],d=["a","b","c"],u=new Array(3),h={},f=[];for(let m=0;m<c;m+=3){o?(l[0]=o.getX(m),l[1]=o.getX(m+1),l[2]=o.getX(m+2)):(l[0]=m,l[1]=m+1,l[2]=m+2);const{a:v,b:g,c:p}=Ir;if(v.fromBufferAttribute(r,l[0]),g.fromBufferAttribute(r,l[1]),p.fromBufferAttribute(r,l[2]),Ir.getNormal(Al),u[0]=`${Math.round(v.x*a)},${Math.round(v.y*a)},${Math.round(v.z*a)}`,u[1]=`${Math.round(g.x*a)},${Math.round(g.y*a)},${Math.round(g.z*a)}`,u[2]=`${Math.round(p.x*a)},${Math.round(p.y*a)},${Math.round(p.z*a)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let _=0;_<3;_++){const x=(_+1)%3,y=u[_],S=u[x],w=Ir[d[_]],T=Ir[d[x]],R=`${y}_${S}`,b=`${S}_${y}`;b in h&&h[b]?(Al.dot(h[b].normal)<=s&&(f.push(w.x,w.y,w.z),f.push(T.x,T.y,T.z)),h[b]=null):R in h||(h[R]={index0:l[_],index1:l[x],normal:Al.clone()})}}for(const m in h)if(h[m]){const{index0:v,index1:g}=h[m];Lr.fromBufferAttribute(r,v),kr.fromBufferAttribute(r,g),f.push(Lr.x,Lr.y,Lr.z),f.push(kr.x,kr.y,kr.z)}this.setAttribute("position",new Le(f,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class Gm extends Kf{constructor(t){super(t),this.uuid=Ui(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,a=this.holes.length;i<a;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const a=this.holes[e];t.holes.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(new Kf().fromJSON(a))}return this}}const RA={triangulate:function(n,t,e=2){const i=t&&t.length,a=i?t[0]*e:n.length;let s=Xm(n,0,a,e,!0);const o=[];if(!s||s.next===s.prev)return o;let r,c,l,d,u,h,f;if(i&&(s=kA(n,t,s,e)),n.length>80*e){r=l=n[0],c=d=n[1];for(let m=e;m<a;m+=e)u=n[m],h=n[m+1],u<r&&(r=u),h<c&&(c=h),u>l&&(l=u),h>d&&(d=h);f=Math.max(l-r,d-c),f=f!==0?32767/f:0}return Xo(s,o,e,r,c,f,0),o}};function Xm(n,t,e,i,a){let s,o;if(a===VA(n,t,e,i)>0)for(s=t;s<e;s+=i)o=Jf(s,n[s],n[s+1],o);else for(s=e-i;s>=t;s-=i)o=Jf(s,n[s],n[s+1],o);return o&&bc(o,o.next)&&(Wo(o),o=o.next),o}function Ka(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(bc(e,e.next)||Je(e.prev,e,e.next)===0)){if(Wo(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function Xo(n,t,e,i,a,s,o){if(!n)return;!o&&s&&NA(n,i,a,s);let r=n,c,l;for(;n.prev!==n.next;){if(c=n.prev,l=n.next,s?CA(n,i,a,s):PA(n)){t.push(c.i/e|0),t.push(n.i/e|0),t.push(l.i/e|0),Wo(n),n=l.next,r=l.next;continue}if(n=l,n===r){o?o===1?(n=DA(Ka(n),t,e),Xo(n,t,e,i,a,s,2)):o===2&&LA(n,t,e,i,a,s):Xo(Ka(n),t,e,i,a,s,1);break}}}function PA(n){const t=n.prev,e=n,i=n.next;if(Je(t,e,i)>=0)return!1;const a=t.x,s=e.x,o=i.x,r=t.y,c=e.y,l=i.y,d=a<s?a<o?a:o:s<o?s:o,u=r<c?r<l?r:l:c<l?c:l,h=a>s?a>o?a:o:s>o?s:o,f=r>c?r>l?r:l:c>l?c:l;let m=i.next;for(;m!==t;){if(m.x>=d&&m.x<=h&&m.y>=u&&m.y<=f&&ks(a,r,s,c,o,l,m.x,m.y)&&Je(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function CA(n,t,e,i){const a=n.prev,s=n,o=n.next;if(Je(a,s,o)>=0)return!1;const r=a.x,c=s.x,l=o.x,d=a.y,u=s.y,h=o.y,f=r<c?r<l?r:l:c<l?c:l,m=d<u?d<h?d:h:u<h?u:h,v=r>c?r>l?r:l:c>l?c:l,g=d>u?d>h?d:h:u>h?u:h,p=Bd(f,m,t,e,i),_=Bd(v,g,t,e,i);let x=n.prevZ,y=n.nextZ;for(;x&&x.z>=p&&y&&y.z<=_;){if(x.x>=f&&x.x<=v&&x.y>=m&&x.y<=g&&x!==a&&x!==o&&ks(r,d,c,u,l,h,x.x,x.y)&&Je(x.prev,x,x.next)>=0||(x=x.prevZ,y.x>=f&&y.x<=v&&y.y>=m&&y.y<=g&&y!==a&&y!==o&&ks(r,d,c,u,l,h,y.x,y.y)&&Je(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;x&&x.z>=p;){if(x.x>=f&&x.x<=v&&x.y>=m&&x.y<=g&&x!==a&&x!==o&&ks(r,d,c,u,l,h,x.x,x.y)&&Je(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;y&&y.z<=_;){if(y.x>=f&&y.x<=v&&y.y>=m&&y.y<=g&&y!==a&&y!==o&&ks(r,d,c,u,l,h,y.x,y.y)&&Je(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function DA(n,t,e){let i=n;do{const a=i.prev,s=i.next.next;!bc(a,s)&&Vm(a,i,i.next,s)&&Vo(a,s)&&Vo(s,a)&&(t.push(a.i/e|0),t.push(i.i/e|0),t.push(s.i/e|0),Wo(i),Wo(i.next),i=n=s),i=i.next}while(i!==n);return Ka(i)}function LA(n,t,e,i,a,s){let o=n;do{let r=o.next.next;for(;r!==o.prev;){if(o.i!==r.i&&HA(o,r)){let c=Wm(o,r);o=Ka(o,o.next),c=Ka(c,c.next),Xo(o,t,e,i,a,s,0),Xo(c,t,e,i,a,s,0);return}r=r.next}o=o.next}while(o!==n)}function kA(n,t,e,i){const a=[];let s,o,r,c,l;for(s=0,o=t.length;s<o;s++)r=t[s]*i,c=s<o-1?t[s+1]*i:n.length,l=Xm(n,r,c,i,!1),l===l.next&&(l.steiner=!0),a.push(BA(l));for(a.sort(IA),s=0;s<a.length;s++)e=zA(a[s],e);return e}function IA(n,t){return n.x-t.x}function zA(n,t){const e=FA(n,t);if(!e)return t;const i=Wm(e,n);return Ka(i,i.next),Ka(e,e.next)}function FA(n,t){let e=t,i=-1/0,a;const s=n.x,o=n.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const h=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(h<=s&&h>i&&(i=h,a=e.x<e.next.x?e:e.next,h===s))return a}e=e.next}while(e!==t);if(!a)return null;const r=a,c=a.x,l=a.y;let d=1/0,u;e=a;do s>=e.x&&e.x>=c&&s!==e.x&&ks(o<l?s:i,o,c,l,o<l?i:s,o,e.x,e.y)&&(u=Math.abs(o-e.y)/(s-e.x),Vo(e,n)&&(u<d||u===d&&(e.x>a.x||e.x===a.x&&UA(a,e)))&&(a=e,d=u)),e=e.next;while(e!==r);return a}function UA(n,t){return Je(n.prev,n,t.prev)<0&&Je(t.next,n,n.next)<0}function NA(n,t,e,i){let a=n;do a.z===0&&(a.z=Bd(a.x,a.y,t,e,i)),a.prevZ=a.prev,a.nextZ=a.next,a=a.next;while(a!==n);a.prevZ.nextZ=null,a.prevZ=null,OA(a)}function OA(n){let t,e,i,a,s,o,r,c,l=1;do{for(e=n,n=null,s=null,o=0;e;){for(o++,i=e,r=0,t=0;t<l&&(r++,i=i.nextZ,!!i);t++);for(c=l;r>0||c>0&&i;)r!==0&&(c===0||!i||e.z<=i.z)?(a=e,e=e.nextZ,r--):(a=i,i=i.nextZ,c--),s?s.nextZ=a:n=a,a.prevZ=s,s=a;e=i}s.nextZ=null,l*=2}while(o>1);return n}function Bd(n,t,e,i,a){return n=(n-e)*a|0,t=(t-i)*a|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function BA(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function ks(n,t,e,i,a,s,o,r){return(a-o)*(t-r)>=(n-o)*(s-r)&&(n-o)*(i-r)>=(e-o)*(t-r)&&(e-o)*(s-r)>=(a-o)*(i-r)}function HA(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!GA(n,t)&&(Vo(n,t)&&Vo(t,n)&&XA(n,t)&&(Je(n.prev,n,t.prev)||Je(n,t.prev,t))||bc(n,t)&&Je(n.prev,n,n.next)>0&&Je(t.prev,t,t.next)>0)}function Je(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function bc(n,t){return n.x===t.x&&n.y===t.y}function Vm(n,t,e,i){const a=Fr(Je(n,t,e)),s=Fr(Je(n,t,i)),o=Fr(Je(e,i,n)),r=Fr(Je(e,i,t));return!!(a!==s&&o!==r||a===0&&zr(n,e,t)||s===0&&zr(n,i,t)||o===0&&zr(e,n,i)||r===0&&zr(e,t,i))}function zr(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function Fr(n){return n>0?1:n<0?-1:0}function GA(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&Vm(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function Vo(n,t){return Je(n.prev,n,n.next)<0?Je(n,t,n.next)>=0&&Je(n,n.prev,t)>=0:Je(n,t,n.prev)<0||Je(n,n.next,t)<0}function XA(n,t){let e=n,i=!1;const a=(n.x+t.x)/2,s=(n.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&a<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function Wm(n,t){const e=new Hd(n.i,n.x,n.y),i=new Hd(t.i,t.x,t.y),a=n.next,s=t.prev;return n.next=t,t.prev=n,e.next=a,a.prev=e,i.next=e,e.prev=i,s.next=i,i.prev=s,i}function Jf(n,t,e,i){const a=new Hd(n,t,e);return i?(a.next=i.next,a.prev=i,i.next.prev=a,i.next=a):(a.prev=a,a.next=a),a}function Wo(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Hd(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function VA(n,t,e,i){let a=0;for(let s=t,o=e-i;s<e;s+=i)a+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return a}class ko{static area(t){const e=t.length;let i=0;for(let a=e-1,s=0;s<e;a=s++)i+=t[a].x*t[s].y-t[s].x*t[a].y;return i*.5}static isClockWise(t){return ko.area(t)<0}static triangulateShape(t,e){const i=[],a=[],s=[];Qf(t),tp(i,t);let o=t.length;e.forEach(Qf);for(let c=0;c<e.length;c++)a.push(o),o+=e[c].length,tp(i,e[c]);const r=RA.triangulate(i,a);for(let c=0;c<r.length;c+=3)s.push(r.slice(c,c+3));return s}}function Qf(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function tp(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class Mh extends yh{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],a=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,a,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Mh(t.radius,t.detail)}}class Os extends en{constructor(t=.5,e=1,i=32,a=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:a,thetaStart:s,thetaLength:o},i=Math.max(3,i),a=Math.max(1,a);const r=[],c=[],l=[],d=[];let u=t;const h=(e-t)/a,f=new W,m=new Wt;for(let v=0;v<=a;v++){for(let g=0;g<=i;g++){const p=s+g/i*o;f.x=u*Math.cos(p),f.y=u*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),m.x=(f.x/e+1)/2,m.y=(f.y/e+1)/2,d.push(m.x,m.y)}u+=h}for(let v=0;v<a;v++){const g=v*(i+1);for(let p=0;p<i;p++){const _=p+g,x=_,y=_+i+1,S=_+i+2,w=_+1;r.push(x,y,w),r.push(y,S,w)}}this.setIndex(r),this.setAttribute("position",new Le(c,3)),this.setAttribute("normal",new Le(l,3)),this.setAttribute("uv",new Le(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Os(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class _h extends en{constructor(t=new Gm([new Wt(0,.5),new Wt(-.5,-.5),new Wt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],a=[],s=[],o=[];let r=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let d=0;d<t.length;d++)l(t[d]),this.addGroup(r,c,d),r+=c,c=0;this.setIndex(i),this.setAttribute("position",new Le(a,3)),this.setAttribute("normal",new Le(s,3)),this.setAttribute("uv",new Le(o,2));function l(d){const u=a.length/3,h=d.extractPoints(e);let f=h.shape;const m=h.holes;ko.isClockWise(f)===!1&&(f=f.reverse());for(let g=0,p=m.length;g<p;g++){const _=m[g];ko.isClockWise(_)===!0&&(m[g]=_.reverse())}const v=ko.triangulateShape(f,m);for(let g=0,p=m.length;g<p;g++){const _=m[g];f=f.concat(_)}for(let g=0,p=f.length;g<p;g++){const _=f[g];a.push(_.x,_.y,0),s.push(0,0,1),o.push(_.x,_.y)}for(let g=0,p=v.length;g<p;g++){const _=v[g],x=_[0]+u,y=_[1]+u,S=_[2]+u;i.push(x,y,S),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return WA(e,t)}static fromJSON(t,e){const i=[];for(let a=0,s=t.shapes.length;a<s;a++){const o=e[t.shapes[a]];i.push(o)}return new _h(i,t.curveSegments)}}function WA(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const a=n[e];t.shapes.push(a.uuid)}else t.shapes.push(n.uuid);return t}class Sc extends en{constructor(t=1,e=.4,i=12,a=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:a,arc:s},i=Math.floor(i),a=Math.floor(a);const o=[],r=[],c=[],l=[],d=new W,u=new W,h=new W;for(let f=0;f<=i;f++)for(let m=0;m<=a;m++){const v=m/a*s,g=f/i*Math.PI*2;u.x=(t+e*Math.cos(g))*Math.cos(v),u.y=(t+e*Math.cos(g))*Math.sin(v),u.z=e*Math.sin(g),r.push(u.x,u.y,u.z),d.x=t*Math.cos(v),d.y=t*Math.sin(v),h.subVectors(u,d).normalize(),c.push(h.x,h.y,h.z),l.push(m/a),l.push(f/i)}for(let f=1;f<=i;f++)for(let m=1;m<=a;m++){const v=(a+1)*f+m-1,g=(a+1)*(f-1)+m-1,p=(a+1)*(f-1)+m,_=(a+1)*f+m;o.push(v,g,_),o.push(g,p,_)}this.setIndex(o),this.setAttribute("position",new Le(r,3)),this.setAttribute("normal",new Le(c,3)),this.setAttribute("uv",new Le(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Sc(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Oi extends Qa{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new Qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Qt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ym,this.normalScale=new Wt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ni,this.combine=nh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Ym extends Qe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Qt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class YA extends Ym{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Qe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Qt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Rl=new Ce,ep=new W,np=new W;class $A{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Wt(512,512),this.map=null,this.mapPass=null,this.matrix=new Ce,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new fh,this._frameExtents=new Wt(1,1),this._viewportCount=1,this._viewports=[new sn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;ep.setFromMatrixPosition(t.matrixWorld),e.position.copy(ep),np.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(np),e.updateMatrixWorld(),Rl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Rl),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Rl)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class ZA extends $A{constructor(){super(new Dm(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class jA extends Ym{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Qe.DEFAULT_UP),this.updateMatrix(),this.target=new Qe,this.shadow=new ZA}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const ip=new Ce;class qA{constructor(t,e,i=0,a=1/0){this.ray=new hh(t,e),this.near=i,this.far=a,this.camera=null,this.layers=new uh,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return ip.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(ip),this}intersectObject(t,e=!0,i=[]){return Gd(t,this,i,e),i.sort(ap),i}intersectObjects(t,e=!0,i=[]){for(let a=0,s=t.length;a<s;a++)Gd(t[a],this,i,e);return i.sort(ap),i}}function ap(n,t){return n.distance-t.distance}function Gd(n,t,e,i){let a=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(a=!1),a===!0&&i===!0){const s=n.children;for(let o=0,r=s.length;o<r;o++)Gd(s[o],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:eh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=eh);const KA={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function JA(n,t,e,i){const a=new fi(n.fov,i,.1,200),s=new W,o=new W,r=new W;let c=!1,l=n.fov;const d={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let u=1,h=0,f=0,m=0,v=0,g=0,p=0;function _(){const x=(n.pitchDeg+d.pitchDelta)*Math.PI/180,y=n.yawDeg*Math.PI/180;r.set(Math.sin(y)*Math.cos(x),Math.sin(x),Math.cos(y)*Math.cos(x)).multiplyScalar(n.distance*d.distanceScale*d.zoom)}return _(),{camera:a,update(x,y,S,w,T=KA){const R=y+.6;if(!c)s.set(x,R,S),c=!0;else{const C=1-Math.exp(-Math.max(n.smoothing,.001)*w);s.x+=(x-s.x)*C,s.y+=(R-s.y)*C,s.z+=(S-s.z)*C}const b=1-Math.exp(-Math.max(t.smoothing,.001)*w);d.distanceScale+=(T.distanceScale-d.distanceScale)*b,d.offsetX+=(T.offsetX-d.offsetX)*b,d.offsetZ+=(T.offsetZ-d.offsetZ)*b,d.pitchDelta+=(T.pitchDelta-d.pitchDelta)*b;const M=1-Math.exp(-Math.max(e.smoothing,.001)*w);if(d.zoom+=(u-d.zoom)*M,_(),(a.fov!==l||a.fov!==n.fov)&&(a.fov=n.fov,l=n.fov,a.updateProjectionMatrix()),o.set(s.x+d.offsetX,s.y,s.z+d.offsetZ),a.position.copy(o).add(r),a.lookAt(o),h>.001){f+=w*52;const C=h*.055;a.position.x+=Math.sin(f*1.7)*C,a.position.y+=Math.sin(f*2.3+1.1)*C*.75,a.position.z+=Math.sin(f*1.3+2.4)*C*.5,h*=Math.exp(-9*w)}else h=0;g>.001?(a.position.x+=m*g,a.position.z+=v*g,g*=Math.exp(-13*w)):g=0,a.updateMatrixWorld()},snap(x,y,S){s.set(x,y+.6,S),c=!0,o.set(s.x+d.offsetX,s.y,s.z+d.offsetZ),_(),a.position.copy(o).add(r),a.lookAt(o),a.updateMatrixWorld()},resize(x){a.aspect=x,a.updateProjectionMatrix()},getGroundBasis(){const x=new W().setFromMatrixColumn(a.matrixWorld,0),y=new W().setFromMatrixColumn(a.matrixWorld,2).negate(),S=Math.hypot(x.x,x.z)||1,w=Math.hypot(y.x,y.z)||1;return{rightX:x.x/S,rightZ:x.z/S,forwardX:y.x/w,forwardZ:y.z/w}},addShake(x){!Number.isFinite(x)||x<=0||(h=Math.min(1,h+x))},shakeLevel(){return h},addKick(x,y,S){if(!Number.isFinite(x)||!Number.isFinite(y)||!(S>0))return;const w=Math.hypot(x,y);w<1e-4||(m=x/w*S,v=y/w*S,g=1,p++)},kickLevel(){return g},kickCount(){return p},setZoom(x){u=Number.isFinite(x)&&x>0?x:1},smart(){return{...d}}}}const $a=Math.PI*2,Gn=1e-6;function tn(n,t,e){return n<t?t:n>e?e:n}function $m(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function QA(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function Zm(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const a=QA(n);return i===1?a:e+(a-e)*i}function sp(n){return(1-Math.sin(n))/2}function bh(n,t,e){const i=Math.PI/180,a=tn(Number.isFinite(t)?t:100,0,180),s=tn(Number.isFinite(e)?e:132,0,180);if(s<=a)return n>=Math.cos(a*i)?1:0;const o=Math.cos(a*i),r=Math.cos(s*i);if(n>=o)return 1;const c=tn((o-n)/(o-r),0,1);return 1-c*c*(3-2*c)}function hc(n,t,e,i){const a=t>=0?1:-1,o=2/Math.max(Gn,i)*Math.max(0,e),r=tn(n,-1,1),c=a-r;return Math.abs(c)<=o?a:r+Math.sign(c)*o}function op(n){const t=tn(Number.isFinite(n)?n:1,-1,1),e=Math.abs(t);return Math.sign(t)*e*e*(3-2*e)}function t2(n,t,e,i){if(!(e>0))return t;const a=e*Math.max(0,i),s=t-n;return Math.abs(s)<=a?t:n+Math.sign(s)*a}const rp=30*Math.PI/180,e2=100*Math.PI/180,n2=.06,i2=.22;function jm(n){return tn((Math.abs(n)-rp)/(e2-rp),0,1)}function qm(n,t,e,i=n2,a=i2){const s=tn(n,0,1),o=tn(t,0,1),r=o>s?Math.max(Gn,i):Math.max(Gn,a),c=e/r*1,l=o-s;return Math.abs(l)<=c?o:s+Math.sign(l)*c}function Km(n,t,e,i,a){if(!(e>0))return t;const s=1-tn(a,0,1);return s<=1e-9?n:t2(n,t,s*e,i)}function uc(n,t){if(!n.grounded||n.speed<Gn)return $m();const e=n.speed/Math.max(n.moveSpeed,Gn),i=Math.max(n.legLength,Gn),a=n.stride>Gn?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,s=Math.min(t.maxAmp,a/i),o=i*Math.sin(Math.min(t.maxAmp,1.25)),r=Math.abs(n.localForward),c=Math.abs(n.localRight),l=r+c+Gn,d=bh(n.localForward/Math.max(n.speed,Gn),t.backStrafeStartDeg,t.backStrafeFullDeg),u=c/l*d,h=r/l+c/l*(1-d),f=op(n.dirF??(n.localForward>=0?1:-1)),m=op(n.dirR??(n.localRight>=0?1:-1)),v=a,g=F=>Math.asin(tn(F,-o,o)/i);function p(F,A){const E=Zm(F,t.plantLock),z=sp(F),G=f*h*v*E,X=-g(G),et=A*m>0?1:-1,ht=1+et*t.crossStep*.45,gt=m*et*t.crossStep*v*.4*z,Lt=m*u*v*t.sideWeight*ht*E+gt*u,Z=g(Lt),B=t.kneeLift*z*s*(.55+.25*h+.1*u*(1+A*m));return{pitchX:X,rollZ:Z,kneeX:B}}const _=(n.phase%$a+$a)%$a,x=p(_,-1),y=p((_+Math.PI)%$a,1),S=Math.cos(_),w=sp(_),T=-t.comSway*s*S*(.6*h+.8*u)-m*t.comSway*s*u*.45,R=t.comBob*w*s,b=m*t.hipLean*s*u*S*.6,M=m*t.hipLean*s*u*(.45+.25*S),C=t.armSwing*s*S*(h*f+.3*u),k=C,D=-C;return{legL:x,legR:y,pelvisX:T,pelvisY:R,pelvisRoll:b,sideLean:M,armL:k,armR:D,strafe:u,backward:f<0?h:0}}function Jm(n){const t=(n%$a+$a)%$a,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function Qm(n,t,e){const i=tn(e.progress,0,1);if(i>=1||n.speed<Gn)return $m();const a=i*i*(3-2*i),s=1-a;return uc({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*a,speed:n.speed*s,stride:n.stride*s},t)}function t0(n,t,e,i){const a=tn(n,-1,1),s=Math.abs(a),o=Math.min(1,t*(1+Math.max(0,i)*s*s));return tn(o*a,-1,1)*(e*Math.PI/180)}function e0(n,t=0){const e=tn(n,0,1);return e*e+(1-e*e)*tn(t,0,1)}function n0(n,t,e){if(!(n>0)||!(t>0))return 0;const i=tn(e,0,1);return t+(n-t)*i}function i0(n,t,e,i){if(!(Math.hypot(n,t)>1e-6))return e;const s=Math.atan2(t,n)*180/Math.PI;if(Math.abs(s)<=90)return e;const r=(s-Math.sign(s)*180)*Math.PI/180,c=tn(i,0,1);return e*c+r*(1-c)}function a0(n,t,e,i,a){const s=Math.max(e,Gn),o=Math.max(0,i)*s,r=Math.max(0,a)*s,c=t>Gn?(t-n)/t:0,l=c>.02,d=c<-.015,u=n<=o*.15,h=!d&&n<r&&(l||u);return{enter:n>Gn&&n<=o&&l,resume:!h}}function s0(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return tn(n*tn(t,0,2),-i,i)}function o0(n,t,e){const i=Math.sin(n),a=Math.cos(n),s=Math.cos(n),o=-Math.sin(n);return{forward:t*i+e*a,right:t*s+e*o}}function r0(n,t,e){const i=tn(n,0,1),a=i*i*(3-2*i);return e?t==="inStop"?1-a:1:t==="afterStop"?1-a:0}function a2(n,t,e){const i=()=>({legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisY:0,env:0});if(!e.turnStepEnabled)return i();const a=tn(n,0,1),s=Math.sin(Math.PI*a),o=s*s;if(o<=1e-9)return i();const r=t>=0,c=r?1:.35,l=r?.35:1,d=Math.max(0,e.turnStepPitch)*o,u=Math.max(0,e.turnStepKnee)*o,h=Math.max(0,e.turnStepPitch)*.35*o,f=r?1:-1;return{legL:{pitchX:-d*c,rollZ:f*h*c,kneeX:u*c},legR:{pitchX:-d*l,rollZ:-f*h*l,kneeX:u*l},pelvisY:-Math.max(0,e.turnStepDip)*o,env:o}}function c0(n,t,e,i,a){const s=tn(n,0,1),o=tn(a.stopPeakRatio,.05,.95),r=s<=o?s/o:(s-o)/(1-o),c=r*r*(3-2*r),l=s<=o?c:1-c,d=Math.hypot(e,i),u=d>Gn?e/d:1,h=d>Gn?i/d:0,f=Zm(t,1)>0;return{leadPitch:Math.max(0,a.stopStepPitch)*l,trailPitch:Math.max(0,a.stopTrailPitch)*l,leadKnee:Math.max(0,a.stopStepKnee)*l,bodyShift:Math.max(0,a.stopBodyShift)*l,bodyDip:Math.max(0,a.stopBodyDip)*l,chestPitch:Math.max(0,a.stopChestPitch)*l,leadLeft:f,fwdN:u,rightN:h,env:l}}function zn(n){return n<0?0:n>1?1:n}const $r=Math.PI*2;function s2(n){return((n+Math.PI)%$r+$r)%$r-Math.PI}function o2(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function r2(n,t,e,i,a,s=n.phase){const o=zn(i);if(o<=0)return n;const r=zn(t),c=Math.max(1,Math.round(a.cycles)),l=Math.max(0,a.strideSpeed),d=e%2===0?1:-1,u=zn(a.forwardBias),h=Math.max(0,n.stride??0),f=Math.max(0,a.strideScale??0)*h,m=r*r*(3-2*r),v={speed:l,phase:s+$r*c/2*m,localForward:l*u,localRight:l*(1-u)*d},g=s2(v.phase-n.phase),p=o*o*(3-2*o),_=n.speed>.05?h:0;return{speed:n.speed+(v.speed-n.speed)*o,phase:n.phase+g*p,localForward:n.localForward+(v.localForward-n.localForward)*o,localRight:n.localRight+(v.localRight-n.localRight)*o,stride:_+(f-_)*o*o}}function c2(n,t,e){const i=o2(),a=zn(n),s=Math.sin(Math.PI*a)**2;if(s<=1e-12)return i;const o=t%2===0?1:-1,r=o<0,c=o>0,l=e.stepPitch*s,d=e.stepKnee*s,u=e.stepSide*s;return i.legL.pitchX=r?-l:l*.55,i.legR.pitchX=c?-l:l*.55,i.legL.kneeX=r?d:d*.4,i.legR.kneeX=c?d:d*.4,i.legL.rollZ=-u*o,i.legR.rollZ=u*o,i.pelvisX=e.stepSway*s*o,i.pelvisY=-e.stepDip*s,i.pelvisRoll=u*.25*o,i}function l0(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function cp(n,t,e,i,a){if(e<=0||i<=0)return 0;const s=(n-t)/e;return s<0||s>=1?0:i*l0(s,a)}function l2(n,t,e,i){const a=t?1:0,s=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),o=n+(a-n)*s;return t&&o>.999?1:!t&&o<.001?0:o}function d2(n,t,e){const i=zn(n);return{gaitScale:1-i*(1-zn(t)),attackLegWeight:zn(e)*i}}function h2(n,t,e){const i=zn(e);if(i<=0)return n;if(i>=1)return{...n,...t,armL:n.armL,armR:n.armR,strafe:n.strafe,backward:n.backward};const a=(s,o)=>s+(o-s)*i;return{legL:{pitchX:a(n.legL.pitchX,t.legL.pitchX),rollZ:a(n.legL.rollZ,t.legL.rollZ),kneeX:a(n.legL.kneeX,t.legL.kneeX)},legR:{pitchX:a(n.legR.pitchX,t.legR.pitchX),rollZ:a(n.legR.rollZ,t.legR.rollZ),kneeX:a(n.legR.kneeX,t.legR.kneeX)},pelvisX:a(n.pelvisX,t.pelvisX),pelvisY:a(n.pelvisY,t.pelvisY),pelvisRoll:a(n.pelvisRoll,t.pelvisRoll),sideLean:n.sideLean,armL:n.armL,armR:n.armR,strafe:n.strafe,backward:n.backward}}function u2(n,t){const e=zn(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function f2(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return zn(t.minScale+(1-t.minScale)*e)}function d0(){return h0()}function h0(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function p2(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function m2(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?zn(t.forceHitHeight):n.type==="light"?zn(t.hitHeight.light):n.type==="heavy"?zn(t.hitHeight.heavy):n.type==="knock"?zn(t.hitHeight.knock):0}function g2(n,t,e){const i=zn(e),a=(s,o)=>s+(o-s)*i;return{upperPitch:a(n.upperPitch,t.upperPitch),upperRoll:a(n.upperRoll,t.upperRoll),upperYaw:a(n.upperYaw,t.upperYaw),fold:a(n.fold,t.fold),shift:a(n.shift,t.shift),drop:a(n.drop,t.drop),back:a(n.back,t.back),knee:a(n.knee,t.knee),hip:a(n.hip,t.hip),arm:a(n.arm,t.arm)}}function u0(n,t,e){const i=h0(),a=p2(n,e);if(i.intensity=a,a<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const s=zn(1-n.timer/n.duration),o=l0(s,e.pulseRatio);i.pulse=o,i.active=o>0,i.hitHeight=m2(n,e);const r=Math.sin(t),c=Math.cos(t),l=Math.cos(t),d=-Math.sin(t),u=n.dirX*r+n.dirZ*c,h=n.dirX*l+n.dirZ*d;if(i.localFwd=u,i.localRight=h,!e.enabled){i.legacy=!0;const v=Math.sin(Math.PI*s);return i.upperPitch=a*v*u,i.upperRoll=-a*v*h*.7,i.drop=(a>.5?.09:.04)*v,i.flash=e.flashStrength*v,i.active=v>0,i}const f=a*o,m=g2(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=f*(m.upperPitch*u+m.fold),i.upperRoll=-f*m.upperRoll*h,i.upperYaw=f*m.upperYaw*h,i.upperShift=f*m.shift,i.upperShiftX=i.upperShift*h,i.upperShiftZ=i.upperShift*u,i.comShift=f*e.comShift,i.comX=i.comShift*h,i.comZ=i.comShift*u,i.pelvisBack=f*m.back,i.drop=f*m.drop,i.knee=f*m.knee,i.hip=f*m.hip,i.arm=f*m.arm,i.flash=e.flashStrength*o,i}function f0(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),a=Number.isFinite(n.leanForward)?n.leanForward:0,s=Number.isFinite(n.leanSide)?n.leanSide:0,o=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:a*e,pelvisRoll:s*e,pelvisX:-s*i,pelvisZ:a*i,crouch:Math.max(0,t.moveCrouch)*o}}const Fa=1e-6;function Io(n,t,e){return n<t?t:n>e?e:n}function p0(n,t,e,i=1){const a=t,s=e;if(!Number.isFinite(a)||!Number.isFinite(s)||a<=Fa||s<=Fa||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const r=a+s,c=Math.abs(a-s)+Fa,l=Math.hypot(n.x,n.y,n.z);if(l<=Fa)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const d=Math.atan2(n.x,-n.y),u=Math.hypot(n.x,n.y),h=n.z,f=Math.hypot(h,u),m=Io(f,c,r),v=f>r+Fa||f<c-Fa,g=Math.atan2(-h,Math.max(u,Fa)),p=Io((a*a+m*m-s*s)/(2*a*m),-1,1),_=Io((s*s+m*m-a*a)/(2*s*m),-1,1),x=Math.acos(p),y=Math.acos(_),S=i>=0?1:-1;return{rootPitch:g-S*x,rootRoll:d,jointPitch:S*(x+y),clamped:v,reach:l/r}}function m0(n,t,e,i){const a=Io(e,0,1),s=Math.max(0,i),o=(r,c)=>{const l=Io((c-r)*a,-s,s);return r+l};return{rootPitch:o(n.rootPitch,t.rootPitch),rootRoll:o(n.rootRoll,t.rootRoll),jointPitch:o(n.jointPitch,t.jointPitch)}}function g0(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const Sh={active:!1,weight:0,clamped:0,maxError:0};function x0(n){const{root:t,pelvis:e,lower:i,limbs:a,base:s,cfg:o}=n;if(!o.enabled||o.weight<=0||!n.grounded||a.length===0)return{...Sh};const r={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(s.pelvisPos),e.rotation.x=s.pelvisRotX,e.rotation.z=s.pelvisRotZ,i.position.copy(s.lowerPos),i.rotation.z=s.lowerRotZ,t.updateWorldMatrix(!0,!0);const c=a.map(f=>f.tip.getWorldPosition(new W));e.position.copy(r.pelvisPos),e.rotation.x=r.pelvisRotX,e.rotation.z=r.pelvisRotZ,i.position.copy(r.lowerPos),i.rotation.z=r.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const l=Math.max(0,Math.min(1,o.weight))*(n.attacking?Math.max(0,Math.min(1,o.attackScale)):1),d=Math.max(0,o.maxCorrectionDeg)*Math.PI/180;let u=0;for(let f=0;f<a.length;f++){const m=a[f],v=i.worldToLocal(c[f].clone()),g={x:v.x-m.root.position.x,y:v.y-m.root.position.y,z:v.z-m.root.position.z},p=p0(g,m.upperLen,m.lowerLen,m.bend);p.clamped&&(u+=1);const _=m0({rootPitch:m.root.rotation.x,rootRoll:m.root.rotation.z,jointPitch:m.joint.rotation.x},p,l,d);m.root.rotation.x=_.rootPitch,m.root.rotation.z=_.rootRoll,m.joint.rotation.x=_.jointPitch}t.updateWorldMatrix(!0,!0);let h=0;for(let f=0;f<a.length;f++){const m=a[f].tip.getWorldPosition(new W);h=Math.max(h,m.distanceTo(c[f]))}return{active:!0,weight:l,clamped:u,maxError:h}}function On(n,t,e){return n<t?t:n>e?e:n}function x2(n,t,e,i,a,s,o,r,c,l){const d=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},u=new ge,h=new ge;h.name="pelvis",h.position.y=n.legLength,u.add(h);const f=new ge;f.name="lower";const m=new ge;m.name="upper",h.add(f),h.add(m);const v=[],g=(j,pt,Ht,Nt)=>{const It=new Oi({color:Nt}),U=new ve(new qn(j,pt,Ht),It);return U.castShadow=!0,U.receiveShadow=!0,v.push(It),U},p=n.headSize,_=n.legLength,x=n.armLength,y=n.limbThickness,S=n.bodyHeight,w=n.bodyWidth,T=g(w,S,.28,e);T.position.y=S/2,m.add(T);const R=new ge;R.name="headPivot",R.rotation.order="YXZ",R.position.y=S,m.add(R);const b=g(p,p,p,e);b.position.y=p/2,R.add(b);for(const j of[-1,1]){const pt=g(.06,.07,.02,t.shoe);pt.position.set(j*.09,p/2+.03,p/2+.011),R.add(pt)}const M=(j,pt)=>{const Ht=pt?x:_,Nt=new ge;Nt.name=pt?j<0?"shoulderL":"shoulderR":j<0?"hipL":"hipR",pt||(Nt.rotation.order="ZYX"),Nt.position.set(j*(pt?w/2+y/2:w/2-y/2),pt?S-.04:0,0),(pt?m:f).add(Nt);const It=g(y,Ht/2,y,t.limb);It.position.y=-Ht/4,Nt.add(It);const U=new ge;U.name=pt?"elbow":"knee",U.position.y=-Ht/2,Nt.add(U);const bt=g(y,Ht/2,y,t.limb);if(bt.position.y=-Ht/4,U.add(bt),!pt){const $=g(y*1.15,.07,y*1.7,t.shoe);$.position.set(0,-Ht/2+.035,.045),U.add($);const ut=new Qe;return ut.name="footTip",ut.position.y=-Ht/2,U.add(ut),{root:Nt,joint:U,tip:ut}}return{root:Nt,joint:U}},C=M(-1,!1),k=M(1,!1),D=M(-1,!0),F=M(1,!0),A=[C,k].map(j=>({root:j.root,joint:j.joint,tip:j.tip,upperLen:_/2,lowerLen:_/2,bend:1})),E=new Sn({color:a.attackArcColor,transparent:!0,opacity:0,side:je,depthWrite:!1}),z=new ve(new Sc(.62,.042,6,20,Math.PI*1.1),E);z.position.set(0,.78-_,.56),m.add(z);const G=new Qt(e),X=new Qt(r.flashColor),et=new Qt;let ht=null,gt=0,Lt=0,Z=0,B=0,Y=0,q=0,K=0,st={...Sh},Tt=-1,Gt=0,J=0,V=0,O=0,Pt=0,Et=0,lt=0,vt=1,ft=0,Rt=0,L=0,P=0,Q=-1,mt=0,ot="none",dt=0,zt=!1,Ct=-1,St=!1,Yt=0,xt=0,Ut=1,tt=1;return{group:u,boneAtWorld(j,pt,Ht){const Nt=[{node:m,ax:0,ay:.05,az:0,bx:0,by:S,bz:0},{node:R,ax:0,ay:0,az:0,bx:0,by:p,bz:0},{node:D.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:D.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:F.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:F.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:C.root,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:C.joint,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:k.root,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:k.joint,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0}],It=new W,U=new W,bt=new W(j,pt,Ht),$=new W;let ut=null,Ft=Number.POSITIVE_INFINITY;for(const Dt of Nt){Dt.node.updateWorldMatrix(!0,!1),It.set(Dt.ax,Dt.ay,Dt.az),U.set(Dt.bx,Dt.by,Dt.bz),Dt.node.localToWorld(It),Dt.node.localToWorld(U);const qt=U.x-It.x,le=U.y-It.y,de=U.z-It.z,ee=qt*qt+le*le+de*de;let we=ee>1e-8?((bt.x-It.x)*qt+(bt.y-It.y)*le+(bt.z-It.z)*de)/ee:0;we=Math.max(0,Math.min(1,we));const De=It.x+qt*we,Ve=It.y+le*we,vn=It.z+de*we,Re=(bt.x-De)**2+(bt.y-Ve)**2+(bt.z-vn)**2;Re<Ft&&(Ft=Re,ut=Dt.node,$.set(De,Ve,vn))}return ut?{node:ut,point:$.clone()}:null},update(j,pt,Ht){const Nt=Ht===void 0||Q<0?pt:On(Ht-Q,0,.1);Ht!==void 0&&(Q=Ht),u.position.set(j.position.x,j.position.y,j.position.z),u.rotation.y=j.bodyYaw,R.rotation.y=(j.headYaw-j.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,j.mode!==ht&&(ht=j.mode,gt=1),gt=Math.max(0,gt-pt*2.2);const It=j.hurt,U=u0(It,j.bodyYaw,r),bt=U.flash;et.copy(X).multiplyScalar(bt);for(const fe of v)fe.emissive.copy(G).multiplyScalar(gt*.5),bt>0&&fe.emissive.add(et);h.position.set(0,_,0),h.rotation.set(0,0,0),m.position.set(0,0,0),m.rotation.set(0,0,0),f.position.set(0,0,0),f.rotation.z=0;const $=Math.hypot(j.velocity.x,j.velocity.z),ut=On(o.knockGaitScale??0,0,1),Ft=j.hurt.knockX*ut,Dt=j.hurt.knockZ*ut,qt=ut>0&&Math.hypot(j.hurt.knockX,j.hurt.knockZ)>.001,le=j.velocity.x+Ft,de=j.velocity.z+Dt,ee=Math.hypot(le,de),we=Math.cos(j.bodyYaw),De=-Math.sin(j.bodyYaw),Ve=$>1e-6?On((j.velocity.x*we+j.velocity.z*De)/$,-1,1):0,vn=$>1e-6?On((j.velocity.x*Math.sin(j.bodyYaw)+j.velocity.z*Math.cos(j.bodyYaw))/$,-1,1):1,Re=bh(vn,o.backStrafeStartDeg,o.backStrafeFullDeg);ot==="settled"&&St&&Yt>xt*1.02+1e-4&&(ot="none");let Pe=1;ot==="blend"?(Pe=r0(zt?Ct:dt,o.stopYawBlendMode,zt),zt||(dt=Math.min(1,dt+pt/Math.max(.01,o.stopYawAfterSec)),(dt>=1||o.stopYawBlendMode==="inStop"||St)&&(ot="settled",Pe=0))):ot==="settled"&&(Pe=On($/Math.max(1e-6,o.stopEnterRatio*s),0,1));const un=t0(Ve,o.strafeHipScale,o.strafeHipMaxDeg,o.strafeHipBoost),Rn=Nt>1e-6?Ge(j.bodyYaw-L)/Nt:0;L=j.bodyYaw;const nn=(o.hipYawTrackRateDeg??0)*Math.PI/180,En=(o.hipYawBackRateDeg??0)*Math.PI/180,Tn=Nt>1e-6?Nt:pt;P=nn>0?qm(P,jm(Rn),Tn):0;const Xn=e0(Re,P),Vn=On($/.5,0,1),wi=i0(vn,Ve,un,Xn)*Pe*Vn,Ei=Km(Rt,wi,n0(nn,En,Xn),Tn,P);Rt=Ei,ft+=(Ei-ft)*(1-Math.exp(-12*Math.max(0,Tn))),f.rotation.y=ft;const fn=j.bodyYaw+ft,I=Math.sin(fn),it=Math.cos(fn),ct=Math.cos(fn),rt=-Math.sin(fn),nt=le*I+de*it,kt=le*ct+de*rt,Xt=Math.max(0,o.stopBlendSec||0),Zt=Xt>0&&!qt,$t=a0($,mt,s,o.stopEnterRatio,o.stopExitRatio);if(!Zt||$t.resume)Tt=-1;else if(Tt<0&&$t.enter){Tt=0,Gt=j.gaitPhase,J=Jm(j.gaitPhase),V=$,O=Math.max(j.stride,1e-6),Pt=nt,Et=kt;const fe=1/Math.max(1e-6,$);lt=j.velocity.x*fe,vt=j.velocity.z*fe}const se=mt;mt=$;const ne=Zt&&Tt>=0;ne&&(Tt=Math.min(1,Tt+pt/Xt)),ne&&ot!=="blend"&&(ot="blend",dt=0),zt=ne&&Tt<1,Ct=Tt,St=$t.resume,Yt=$,xt=se;const jt=Math.max(0,o.dirFlipSec??0);jt>0?(Ut=hc(Ut,nt>=0?1:-1,pt,jt),tt=hc(tt,kt>=0?1:-1,pt,jt)):(Ut=nt>=0?1:-1,tt=kt>=0?1:-1);const ue=ne?{phase:Gt,speed:V,moveSpeed:s,localForward:Pt,localRight:Et,dirF:Ut,dirR:tt,legLength:n.legLength,stride:O,grounded:!0}:{phase:j.gaitPhase,speed:ee,moveSpeed:s,localForward:nt,localRight:kt,dirF:Ut,dirR:tt,legLength:n.legLength,stride:j.stride,grounded:!0},ie=ne?Qm(ue,o,{progress:Tt,phase0:Gt,phaseEnd:J}):uc(ue,o);let H=0,At=0,_t=0,Mt=0;if(ne){const fe=o0(j.bodyYaw,lt,vt),Ae=c0(Tt,Gt,fe.forward,fe.right,o);Ae.leadLeft?(ie.legL.pitchX-=Ae.leadPitch,ie.legL.kneeX+=Ae.leadKnee,ie.legR.pitchX+=Ae.trailPitch):(ie.legR.pitchX-=Ae.leadPitch,ie.legR.kneeX+=Ae.leadKnee,ie.legL.pitchX+=Ae.trailPitch),At=Ae.bodyShift*Ae.fwdN,H=Ae.bodyShift*Ae.rightN,_t=Ae.bodyDip,Mt=Ae.chestPitch}C.root.rotation.x=ie.legL.pitchX,k.root.rotation.x=ie.legR.pitchX,C.root.rotation.z=ie.legL.rollZ,k.root.rotation.z=ie.legR.rollZ,C.joint.rotation.x=ie.legL.kneeX,k.joint.rotation.x=ie.legR.kneeX,D.root.rotation.x=ie.armL,F.root.rotation.x=ie.armR,D.joint.rotation.x=-.18,F.joint.rotation.x=-.18,h.position.x=ie.pelvisX,h.position.y=_+ie.pelvisY,h.position.z=0,h.rotation.z=ie.pelvisRoll,m.rotation.z=ie.sideLean*(U.intensity>0?.4:1);const te=g0(h,f),Ot=ne&&d.enabled?{...d,weight:1}:d,oe=Ot.enabled&&Ot.weight>0?On(Ot.weight,0,1):0;if(h.position.x+=H,h.position.z+=At,h.position.y-=_t,f.position.y+=_t,oe<=0&&(f.position.x-=H,f.position.z-=At),c){const fe=Math.max(.004166666666666667,Math.min(pt,.1)),Ae=Math.sin(j.bodyYaw),He=Math.cos(j.bodyYaw),ln=On((j.velocity.x-Lt)/fe,-60,60),Pn=On((j.velocity.z-Z)/fe,-60,60),pi=ln*Ae+Pn*He,Ti=Ge(j.bodyYaw-B)/fe,mi=c.maxForwardDeg*Math.PI/180,ri=c.maxSideDeg*Math.PI/180,yn=1-Math.exp(-Math.max(0,c.smoothing)*fe);Y+=(On(pi*c.accelGain,-mi,mi)-Y)*yn,q+=(On(-Ti*$*c.turnGain,-ri,ri)-q)*yn;const pn=Number.isFinite(c.crouchSmoothing)?c.crouchSmoothing:8;K+=(On($/Math.max(s,1e-6),0,1)-K)*(1-Math.exp(-Math.max(0,pn)*fe));const Wn=f0({leanForward:Y,leanSide:q,speedRatio:K},c);m.rotation.x+=Y+Mt,m.rotation.z+=q,h.rotation.x+=Wn.pelvisPitch,h.rotation.z+=Wn.pelvisRoll,h.position.x+=Wn.pelvisX,h.position.z+=Wn.pelvisZ,h.position.y-=Wn.crouch,f.position.y+=Wn.crouch*(1-oe)}Lt=j.velocity.x,Z=j.velocity.z,B=j.bodyYaw,m.rotation.x+=U.upperPitch,m.rotation.z+=U.upperRoll,m.rotation.y+=U.upperYaw;const ke=On(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),be=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;m.position.x+=On(U.upperShiftX*ke,-be,be),m.position.z+=On(U.upperShiftZ*ke,-be,be),h.position.x+=U.comX,h.position.z+=U.comZ-U.pelvisBack,h.position.y-=U.drop;const Oe=U.legacy?0:Math.max(0,Math.min(1,r.lowerScale));if(f.position.z+=U.pelvisBack*(1-Oe),f.position.y+=U.drop*(1-Oe),C.joint.rotation.x+=U.knee,k.joint.rotation.x+=U.knee,C.root.rotation.x-=U.hip,k.root.rotation.x-=U.hip,D.root.rotation.x+=U.arm,F.root.rotation.x+=U.arm*.8,j.attackPhase!=="idle"&&U.intensity===0){const fe=j.attackProgress,Ae=fe<.34?-1:fe<.68?-1+(fe-.34)/.34*2:Math.max(0,1-(fe-.68)/.32),He=Math.max(0,-Ae),ln=Math.max(0,Ae);F.root.rotation.x=-1.7*He+1.25*ln,F.joint.rotation.x=-(.25+He*.45),m.rotation.y=-.28*Ae,E.opacity=j.attackPhase==="active"?.85:0,j.attackPhase==="active"&&(z.rotation.z=-1.1+fe*3)}else E.opacity=0;const xe=s0(ft,o.chestYawScale,o.chestYawMaxDeg);m.rotation.y+=xe,R.rotation.y=(j.headYaw-j.bodyYaw-xe+Math.PI*3)%(Math.PI*2)-Math.PI,st=x0({root:u,pelvis:h,lower:f,limbs:A,base:te,cfg:Ot,grounded:!0,attacking:j.attackPhase!=="idle"})},ik(){return st},dispose(){u.traverse(j=>{if(j instanceof ve){j.geometry.dispose();const pt=j.material;Array.isArray(pt)?pt.forEach(Ht=>Ht.dispose()):pt.dispose()}})}}}const v2=9.81;function wo(n,t,e){return n<t?t:n>e?e:n}function y2(n,t,e,i,a){const s=a!=null&&a.gravity&&a.gravity>0?a.gravity:v2,o={comX:0,comY:0,comZ:0,xcomX:0,xcomZ:0,centerX:0,centerZ:0,halfX:0,halfZ:0,marginX:1,marginZ:1,score:1,leanDeg:0,side:0,overX:0,overZ:0,grounded:!1};let r=0,c=0,l=0,d=0;for(const b of n){const M=Number.isFinite(b.mass)&&b.mass>0?b.mass:0;!Number.isFinite(b.x)||!Number.isFinite(b.y)||!Number.isFinite(b.z)||(r+=M,c+=b.x*M,l+=b.y*M,d+=b.z*M)}if(r<=1e-6)return o;c/=r,l/=r,d/=r;const u=Math.max(.02,(t.maxX-t.minX)/2),h=Math.max(.02,(t.maxZ-t.minZ)/2),f=(t.minX+t.maxX)/2,m=(t.minZ+t.maxZ)/2;if(!(t.maxX-t.minX>.03&&t.maxZ-t.minZ>.03))return{...o,comX:c,comY:l,comZ:d,centerX:f,centerZ:m,halfX:u,halfZ:h};const g=wo((a==null?void 0:a.reactionTime)??.18,.02,1),p=Math.sqrt(Math.max(.05,l)/s)*g*4,_=c+(Number.isFinite(e)?e:0)*p,x=d+(Number.isFinite(i)?i:0)*p,y=Math.abs(_-f)/u,S=Math.abs(x-m)/h,w=wo(1-Math.max(y,S),0,1),T=Math.max(0,Math.abs(_-f)-u),R=Math.max(0,Math.abs(x-m)-h);return{comX:c,comY:l,comZ:d,xcomX:_,xcomZ:x,centerX:f,centerZ:m,halfX:u,halfZ:h,marginX:wo(1-y,-1,1),marginZ:wo(1-S,-1,1),score:w,leanDeg:Math.atan2(_-f,x-m)*180/Math.PI,side:y>.98?_>f?1:-1:0,overX:T,overZ:R,grounded:!0}}function M2(n,t,e){if(!Number.isFinite(n))return 0;if(!Number.isFinite(t)||!(e>0))return n;const i=n+t*e;return n!==0&&Math.sign(i)!==Math.sign(n)?0:Math.abs(i)>Math.abs(n)?i:n}function _2(n,t,e){const i=Math.max(0,n);if(!(e>0))return i;const a=wo(Number.isFinite(t)?t:0,0,2);return i*(1+e*a)}const Xd={arm:1,leg:1,torso:1,girthArm:1,girthLeg:1,girthTorso:1},b2=1e-6;function ai(n,t,e){return n<t?t:n>e?e:n}function Pl(n,t){const e=Math.max(.2,n);return ai(Math.pow(e,-t),.5,2)}function S2(n,t){if(!t.enabled)return{...Xd};const e=ai(n.swing,-1,1),i=ai(n.charge,0,1),a=ai(n.impact,0,1),s=ai(n.speedRatio,0,1),o=Math.max(0,e),r=1-(1-o)*(1-o),c=1+(Math.max(1,t.swingArm)-1)*r,l=Math.max(0,-e),d=ai(t.chargeArm,.6,1),u=1-(1-d)*l,h=1-(1-d)*i;let f=1;o>0?f=c:l>0?f=u:i>0&&(f=h);const m=1-ai(t.impactSquash,0,.6)*a;f*=m;const v=Math.max(1,t.runLeg),p=(n.grounded?1+(v-1)*s:1)*(1-ai(t.impactSquash,0,.6)*a*.6),_=ai(t.torsoGain,0,1),x=1+(f-1)*_;return f=ai(f,.6,1.6),{arm:f,leg:ai(p,.6,1.4),torso:ai(x,.7,1.4),girthArm:Pl(f,t.volumeExp),girthLeg:Pl(p,t.volumeExp),girthTorso:Pl(x,t.volumeExp)}}function w2(n,t,e,i){const a=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),s=(o,r)=>o+(r-o)*a;return{arm:s(n.arm,t.arm),leg:s(n.leg,t.leg),torso:s(n.torso,t.torso),girthArm:s(n.girthArm,t.girthArm),girthLeg:s(n.girthLeg,t.girthLeg),girthTorso:s(n.girthTorso,t.girthTorso)}}function E2(n,t,e){const i=n*Math.exp(-Math.max(b2,e)*Math.max(0,t));return i<.001?0:ai(i,0,1)}const lp=[{yaw:.85,pitch:-.12,roll:-.14,pz:-.06,px:.045,ap:-1.2,ay:-.42,ar:.16,el:-.48,blade:.3},{yaw:-.95,pitch:.14,roll:.17,pz:.1,px:-.05,ap:-1.46,ay:-.6,ar:-.1,el:-.14,blade:-.05},{yaw:-.75,pitch:-.08,roll:.14,pz:-.04,px:-.04,ap:-1.28,ay:-.58,ar:-.12,el:-.5,blade:.3},{yaw:.92,pitch:.15,roll:-.18,pz:.1,px:.05,ap:-1.48,ay:-.4,ar:.12,el:-.13,blade:-.05},{yaw:.12,pitch:-.32,roll:-.05,pz:-.07,px:0,ap:-1.9,ay:-.3,ar:.16,el:-.55,blade:1.3},{yaw:0,pitch:.55,roll:.02,pz:.13,px:0,ap:.05,ay:-.2,ar:0,el:-.1,blade:-.55}];function Bs(n,t,e){return n<t?t:n>e?e:n}function Be(n,t,e){return n+(t-n)*e}function T2(n){return n?typeof n=="string"?{clip:n}:n:null}function A2(){return{bodyYaw:0,bodyPitch:0,bodyRoll:0,pelvisX:0,pelvisZ:0,armPitch:0,armYaw:0,armRoll:0,elbow:0,bladePitch:0,armLPitch:0,armLYaw:0,armLRoll:0,elbowL:0,rootYaw:0,bladePitchOff:0,bladeTwist:0,bladeTwistOff:0,bladeYaw:0,bladeYawOff:0}}function R2(n,t){const e=n%3*2,i=lp[e],a=lp[e+1];return{...A2(),bodyYaw:Be(i.yaw,a.yaw,t),bodyPitch:Be(i.pitch,a.pitch,t),bodyRoll:Be(i.roll,a.roll,t),pelvisX:Be(i.px,a.px,t),pelvisZ:Be(i.pz,a.pz,t),armPitch:Be(i.ap,a.ap,t),armYaw:Be(i.ay,a.ay,t),armRoll:Be(i.ar,a.ar,t),elbow:Be(i.el,a.el,t),bladePitch:Be(i.blade,a.blade,t)}}function P2(n,t,e,i,a=0){var b,M,C;const s=((b=i.combo)==null?void 0:b[n])??[],o=Math.max(1,s.length),r=(((Math.round(t)||1)-1)%o+o)%o,c=T2(s[r]),l=c?((M=i.clips)==null?void 0:M[c.clip])??null:null,d=Bs(((C=i.weaponScale)==null?void 0:C[n])??1,0,2),u=Number.isFinite(i.bodyScale)?Math.max(0,i.bodyScale):1,h=c&&Number.isFinite(c.scale)?c.scale:d,f=h*u,m=Bs((e+1)/2,0,1),v=l&&l.keys.length>0?yv(l,m):R2(r,m),g=((c==null?void 0:c.lead)??(l==null?void 0:l.lead)??"R")==="L"?"L":"R",p=(l==null?void 0:l.kind)??["right-left","left-right","overhead"][r]??"custom",_=n==="dual-swords",x=l&&Ra(l,"bladeTwistOff")?v.bladeTwistOff:_?v.bladeTwist:0,y=l&&Ra(l,"bladeYawOff")?v.bladeYawOff:-v.bladeYaw,S={yaw:v.bodyYaw*f,rootYaw:v.rootYaw*f,spinYaw:Mv(l,Bs(a,0,1)),pitch:v.bodyPitch*f,roll:v.bodyRoll*f,pelvisZ:v.pelvisZ*f,pelvisX:v.pelvisX*f,armR:null,armL:null,bladePitch:v.bladePitch,bladePitchOff:l&&Ra(l,"bladePitchOff")?v.bladePitchOff:null,bladeTwist:v.bladeTwist,bladeTwistOff:x,bladeYaw:v.bladeYaw,bladeYawOff:y,lead:g,kind:p,strike:m,blend:c&&Number.isFinite(c.blend)?c.blend:null},w={pitch:v.armPitch*h,yaw:v.armYaw*h,roll:v.armRoll*h,elbow:v.elbow*h},T=l?Ra(l,"armLPitch")||Ra(l,"armLYaw")||Ra(l,"armLRoll")||Ra(l,"elbowL"):!1,R=T?{pitch:v.armLPitch*h,yaw:v.armLYaw*h,roll:v.armLRoll*h,elbow:v.elbowL*h}:{pitch:w.pitch+(n==="greatsword"?.08:.1),yaw:w.yaw*.8,roll:n==="greatsword"?.4:-w.roll*.6,elbow:w.elbow};return g==="L"?(S.armL=w,S.armR=n==="greatsword"?null:R):(S.armR=w,(n==="greatsword"||n==="dual-swords"||T)&&(S.armL=R)),S}function C2(n,t,e){const i=Bs(e,0,1),a=(s,o)=>s?o?{pitch:Be(s.pitch,o.pitch,i),yaw:Be(s.yaw,o.yaw,i),roll:Be(s.roll,o.roll,i),elbow:Be(s.elbow,o.elbow,i)}:null:o;return{yaw:Be(n.yaw,t.yaw,i),rootYaw:Be(n.rootYaw,t.rootYaw,i),spinYaw:t.spinYaw,pitch:Be(n.pitch,t.pitch,i),roll:Be(n.roll,t.roll,i),pelvisZ:Be(n.pelvisZ,t.pelvisZ,i),pelvisX:Be(n.pelvisX,t.pelvisX,i),armR:a(n.armR,t.armR),armL:a(n.armL,t.armL),bladePitch:n.bladePitch===null||t.bladePitch===null?i<.5?n.bladePitch:t.bladePitch:Be(n.bladePitch,t.bladePitch,i),bladePitchOff:n.bladePitchOff===null||t.bladePitchOff===null?i<.5?n.bladePitchOff:t.bladePitchOff:Be(n.bladePitchOff,t.bladePitchOff,i),bladeTwist:Be(n.bladeTwist,t.bladeTwist,i),bladeTwistOff:Be(n.bladeTwistOff,t.bladeTwistOff,i),bladeYaw:Be(n.bladeYaw,t.bladeYaw,i),bladeYawOff:Be(n.bladeYawOff,t.bladeYawOff,i),lead:t.lead,kind:t.kind,strike:Be(n.strike,t.strike,i),blend:t.blend??null}}function D2(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function dp(n,t){return!n||!t?n||t?.6:0:Math.abs(n.pitch-t.pitch)*1+Math.abs(n.yaw-t.yaw)*.8+Math.abs(n.roll-t.roll)*.6+Math.abs(n.elbow-t.elbow)*.8}function L2(n,t){const e=(a,s)=>Math.abs(D2(a-s));let i=0;return i+=e(n.yaw,t.yaw)*1,i+=e(n.rootYaw,t.rootYaw)*.7,i+=e(n.pitch,t.pitch)*.9,i+=e(n.roll,t.roll)*.9,i+=Math.abs(n.pelvisX-t.pelvisX)*2,i+=Math.abs(n.pelvisZ-t.pelvisZ)*2,i+=dp(n.armR,t.armR),i+=dp(n.armL,t.armL)*.8,i+=e(n.bladePitch??0,t.bladePitch??0)*1.1,i+=e(n.bladePitchOff??0,t.bladePitchOff??0)*.7,i+=e(n.bladeTwist,t.bladeTwist)*.5,i+=e(n.bladeYaw,t.bladeYaw)*.5,i}function k2(n,t,e,i,a){if(i!=null&&Number.isFinite(i)&&i>=0)return Math.max(.008,i);const s=Math.max(.008,e.segBlend??.1);if(!n)return s;const o=Math.max(.008,e.segBlendMin??.03),r=Math.max(o,Number.isFinite(a)?a:e.segBlendMax??.14),c=Math.max(.1,e.segBlendRef??6),l=Bs(L2(n,t)/c,0,1);return o+(r-o)*l}function hp(n){const t=Bs(n,0,1);return t*t*(3-2*t)}function Xe(n,t,e,i){const a=new ve(new qn(n,t,e),new Oi({color:i}));return a.castShadow=!0,a.receiveShadow=!0,a}function Ke(){return new ge}function Zr(n,t,e){const i=Ke(),a=Xe(t*.7,.12,t*.7,e.wood);a.position.y=.06,i.add(a);const s=Xe(t*2.4,.045,t*.8,e.metal);s.position.y=.13,i.add(s);const o=Xe(t*.38,n,t,e.blade);o.position.y=.13+n/2,i.add(o);const r=Xe(t*.42,n*.96,t*.2,e.bladeEdge);r.position.set(0,.13+n/2,t*.5),i.add(r);const c=Xe(t*.3,.09,t*.45,e.blade);return c.position.y=.13+n+.045,i.add(c),i}function I2(n){const t=Zr(.72,.15,n),e=Xe(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function z2(n){const t=Ke(),e=Xe(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=Xe(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function F2(n){const t=Ke(),e=Xe(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=Xe(.15,.15,.15,n.glow);i.position.y=.92;const a=i.material;return a.emissive=new Qt(n.glow),a.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function U2(n){const t=Ke();for(let i=0;i<5;i++){const a=(i-2)*.15,s=Xe(.055,.16,.05,n.wood);s.position.set(.16-Math.abs(a)*.46,a,0),t.add(s)}const e=Xe(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function N2(n){const t=Ke(),e=Xe(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=Xe(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function me(n,t,e){return n<t?t:n>e?e:n}const ji=1e-6;function v0(n,t,e,i,a,s,o,r,c,l,d,u,h){const f=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},m=u??{enabled:!1,lag:.022,maxAngle:.62,rate:26,twistLag:.018,maxTwist:.45,runDrag:0},v=d??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},g=c.stretch??{enabled:!1,swingArm:1,chargeArm:1,runLeg:1,torsoGain:0,impactSquash:0,impactDecay:12,volumeExp:.5,smoothing:26},p=c.swing??{enabled:!1,bodyScale:1,shoulderLift:.045,shoulderPush:.035,shoulderIn:.03,segBlend:.1,weaponScale:{greatsword:1,"sword-shield":.62,"dual-swords":.55}},_=Ke(),x=Ke();x.name="pelvis",x.position.y=n.legLength,_.add(x);const y=Ke();y.name="lower";const S=Ke();S.name="upper",x.add(y),x.add(S);const w=n.headSize,T=n.legLength,R=n.armLength,b=n.limbThickness,M=n.bodyHeight,C=n.bodyWidth,k=c.spine,D=!!(k!=null&&k.enabled),F=D?me(k.chestPivot??.42,.15,.85)*M:0,A=Ke();A.name="chest",A.position.y=F,S.add(A);const E=D?A:S;let z,G=null,X=M,et=0;D?(X=Math.max(.05,F),et=Math.max(.05,M-F),z=Xe(C,X,.28,t.body),z.name="torsoLower",z.position.y=X/2,S.add(z),G=Xe(C+.008,et,.288,t.body),G.name="torsoUpper",G.position.y=et/2,A.add(G)):(z=Xe(C,M,.28,t.body),z.name="torso",z.position.y=M/2,S.add(z));const ht=Ke();ht.name="headPivot",ht.rotation.order="YXZ",ht.position.y=Math.min(i.headPivotHeight,M)-F,E.add(ht);const gt=Xe(w,w,w,t.head);gt.position.y=w/2,ht.add(gt);const Lt=new Oi({color:"#1b2733"});for(const N of[-1,1]){const at=new ve(new qn(.06,.07,.02),Lt);at.position.set(N*.09,w/2+.03,w/2+.011),ht.add(at)}const Z=N=>{const at=Ke();at.name=N<0?"hipL":"hipR",at.rotation.order="ZYX",at.position.set(N*(C/2-b/2),0,0),y.add(at);const yt=Xe(b,T/2,b,t.limb);yt.position.y=-T/4,at.add(yt);const wt=Ke();wt.name="knee",wt.position.y=-T/2,at.add(wt);const Kt=Xe(b,T/2,b,t.limb);Kt.position.y=-T/4,wt.add(Kt);const Jt=Xe(b*1.15,.07,b*1.7,t.shoe);Jt.position.set(0,-T/2+.035,.045),wt.add(Jt);const re=new Qe;re.name="footTip",re.position.y=-T/2,wt.add(re);const Se=Ke();return{root:at,joint:wt,hand:Se,wrist:Se,tip:re,upperMesh:yt,lowerMesh:Kt,segLen:T/2}},B=N=>{const at=Ke();at.name=N<0?"shoulderL":"shoulderR",at.rotation.order="YXZ",at.position.set(N*(C/2+b/2),M-.04-F,0),E.add(at);const yt=Xe(b,R/2,b,t.limb);yt.position.y=-R/4,at.add(yt);const wt=Ke();wt.name="elbow",wt.position.y=-R/2,at.add(wt);const Kt=Xe(b,R/2,b,t.limb);Kt.position.y=-R/4,wt.add(Kt);const Jt=Ke();Jt.name=N<0?"handL":"handR",Jt.position.y=-R/2,wt.add(Jt);const re=Xe(b*1.1,.09,b*1.1,t.head);re.position.y=.045,Jt.add(re);const Se=Ke();return Se.name=N<0?"wristL":"wristR",Jt.add(Se),{root:at,joint:wt,hand:Jt,wrist:Se,upperMesh:yt,lowerMesh:Kt,segLen:R/2}},Y=Z(-1),q=Z(1),K=B(-1),st=B(1),Tt=[Y,q].map(N=>({root:N.root,joint:N.joint,tip:N.tip,upperLen:T/2,lowerLen:T/2,bend:1})),Gt=Ke(),J=Ke();Gt.name="mountR",J.name="mountL";const V=Ke(),O=Ke();V.name="gripR",O.name="gripL",st.wrist.add(Gt),K.wrist.add(J),Gt.add(V),J.add(O);const Pt=F2(t),Et=U2(t),lt=N2(t),vt={"sword-shield":{right:Zr(.42,.075,t),left:z2(t)},"dual-swords":{right:Zr(.42,.075,t),left:Zr(.42,.075,t)},greatsword:{right:I2(t),left:Xe(.12,.2,.12,t.wood)},staff:{right:Pt.g,left:Ke(),orb:Pt.orb},bow:{right:lt,left:Et.g,arrow:lt,drawString:Et.drawString}};for(const N of Object.keys(vt))V.add(vt[N].right),O.add(vt[N].left),vt[N].right.visible=!1,vt[N].left.visible=!1;function ft(N,at,yt){const wt=new Qe;wt.name="bladeBase",wt.position.y=at,N.add(wt);const Kt=new Qe;Kt.name="bladeTip",Kt.position.y=yt,N.add(Kt)}ft(vt["sword-shield"].right,.44,.55),ft(vt["dual-swords"].right,.44,.55),ft(vt["dual-swords"].left,.44,.55),ft(vt.greatsword.right,.74,.88),ft(vt.staff.right,.78,.92);let Rt=null,L=null,P=1,Q=0,mt=0,ot=null,dt=0,zt=0,Ct=0,St=0,Yt=0,xt=0,Ut=d0(),tt={...Sh},j=0,pt=0,Ht=0,Nt=0,It=0,U=-1,bt=-1,$=0,ut=0,Ft=0,Dt=0,qt=0,le=0,de=0,ee=1,we=0,De=0,Ve=0,vn=0,Re=!1,Pe=0,un=-1,Rn=0,nn=0,En=0,Tn=!1,Xn=0,Vn=0,wi=0,Ei=0,fn="none",I=0,it=1,ct=!1,rt=-1,nt=!1,kt=0,Xt=0,Zt=0,$t={...Xd},se=0,ne=0,jt={active:!1,dist:0,gy:0,pitch:0,joint:0,grip:1},ue=NaN,ie=0,H=0,At=0,_t=NaN,Mt=NaN,te=-1,Ot=null,oe=null,ke=0,be=1,Oe=.1,xe=null,fe={lx:0,ly:0,lz:0,rx:0,ry:0,rz:0},Ae=null,He=null,ln=null,Pn=null,pi=null,Ti=null,mi="R",ri=0,yn=0,pn=0,Wn=0,Qs=1,Kn=0,ce=null,Bt=0,he=0,on=NaN,Mn=NaN,Hi={speed:0,phase:0},Cn=1,ci=1,wa={lp:0,lr:0,rp:0,rr:0},Ea=0,ts=0,es=!0,ns=0,Ta="none",is=0,as=0,ss=0,Zo=.3,Th=0;function b0(N){const at=Math.PI/180,yt=s;let wt=0,Kt=0,Jt=0,re=0;N==="sword-shield"?(wt=yt.swordPitchDeg*at,Jt=yt.shieldPitchDeg*at):N==="dual-swords"?(wt=yt.swordPitchDeg*at,Jt=yt.swordPitchDeg*at):N==="greatsword"?(wt=yt.greatswordPitchDeg*at,Jt=yt.greatswordPitchDeg*at):N==="staff"?wt=yt.staffPitchDeg*at:Jt=yt.bowPitchDeg*at,Gt.rotation.set(wt,0,Kt),J.rotation.set(Jt,0,re),Gt.position.x=N==="greatsword"?-Math.max(0,s.twoHandInsetX??0):0}function Ah(N){if(N!==Rt){Rt=N;for(const at of Object.keys(vt))vt[at].right.visible=at===N,vt[at].left.visible=at===N;b0(N),Et.drawString.position.z=-.06,lt.position.z=0,Pt.orb.scale.setScalar(1),S.rotation.y=0}}Ah("sword-shield");const Rh=[];_.traverse(N=>{N instanceof ve&&N.material instanceof Oi&&Rh.push(N.material)});const S0=new Qt(r.flashColor);function w0(N,at){const yt=u0(N,at,r);Ut=yt,S.rotation.x+=yt.upperPitch,S.rotation.z+=yt.upperRoll,S.rotation.y+=yt.upperYaw;const wt=me(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),Kt=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;S.position.x+=me(yt.upperShiftX*wt,-Kt,Kt),S.position.z+=me(yt.upperShiftZ*wt,-Kt,Kt),x.position.x+=yt.comX,x.position.z+=yt.comZ-yt.pelvisBack,x.position.y-=yt.drop;const Jt=yt.legacy?0:me(r.lowerScale,0,1);y.position.z+=yt.pelvisBack*(1-Jt),y.position.y+=yt.drop*(1-Jt),Y.joint.rotation.x+=yt.knee,q.joint.rotation.x+=yt.knee,Y.root.rotation.x-=yt.hip,q.root.rotation.x-=yt.hip,K.root.rotation.x+=yt.arm,st.root.rotation.x+=yt.arm*.8;for(const re of Rh)re.emissive.copy(S0).multiplyScalar(yt.flash)}function jo(N){return N<.22?-1:N<.42?-1+(N-.22)/.2*2:N<.5?1:Math.max(0,1-(N-.5)/.5)}function E0(N){for(const at of[K,st])at.upperMesh.scale.set(N.girthArm,N.arm,N.girthArm),at.upperMesh.position.y=-at.segLen/2*N.arm,at.joint.position.y=-at.segLen*N.arm,at.lowerMesh.scale.set(N.girthArm,N.arm,N.girthArm),at.lowerMesh.position.y=-at.segLen/2*N.arm,at.hand.position.y=-at.segLen*N.arm;for(const at of[Y,q])at.upperMesh.scale.set(N.girthLeg,N.leg,N.girthLeg),at.upperMesh.position.y=-at.segLen/2*N.leg,at.joint.position.y=-at.segLen*N.leg,at.lowerMesh.scale.set(N.girthLeg,N.leg,N.girthLeg),at.lowerMesh.position.y=-at.segLen/2*N.leg,at.tip.position.y=-at.segLen*N.leg;z.scale.set(N.girthTorso,N.torso,N.girthTorso),z.position.y=X/2*N.torso,G&&(G.scale.set(N.girthTorso,N.torso,N.girthTorso),G.position.y=et/2*N.torso,A.position.y=X*N.torso)}function T0(N,at){const yt=s.twoHandGripY??-.16,wt=Math.max(1,s.twoHandMaxStretch??1.25),Kt=R*wt*.99,Jt=K.root.position.x,re=K.root.position.y,Se=K.root.position.z,We=K.root.rotation.y,ye=Math.cos(We),rn=Math.sin(We),qe=Gi=>{const no=Gt.localToWorld(new W(0,Gi,0)),io=(D?A:S).worldToLocal(no),ao=io.x-Jt,Yn=io.y-re,os=io.z-Se,rs={x:ao*ye-os*rn,y:Yn,z:ao*rn+os*ye};return{t:rs,dist:Math.hypot(rs.x,rs.y,rs.z)}};let Ye=yt,Ee=qe(Ye);if(!Number.isFinite(Ee.dist)||Ee.dist<=ji)return;for(let Gi=0;Gi<18&&Ee.dist>Kt;Gi++)if(Ye*=.78,Ee=qe(Ye),!Number.isFinite(Ee.dist)||Ee.dist<=ji)return;Number.isFinite(ue)||(ue=Ye);const an=Math.max(0,s.twoHandSlideRate??9);ue+=(Ye-ue)*(1-Math.exp(-an*at));const cn=qe(ue),mn=cn.t,Jn=cn.dist,Qn=Jn/Math.max(ji,R),li=me(Qn,1,wt),Ai=Math.max(1,s.twoHandGripStart??1.02),ia=Math.max(Ai+.001,wt),aa=me(s.twoHandMinGrip??1,0,1),ti=me((Qn-Ai)/(ia-Ai),0,1),Ri=1-ti*ti*(3-2*ti)*(1-aa),ei=R/2*li,eo=p0(mn,ei,ei,-1),sa=m0({rootPitch:K.root.rotation.x,rootRoll:K.root.rotation.z,jointPitch:K.joint.rotation.x},eo,me(N*Ri,0,1),Math.PI);K.root.rotation.x=sa.rootPitch,K.root.rotation.z=sa.rootRoll,K.joint.rotation.x=Math.min(sa.jointPitch,-.06);const di=1/Math.sqrt(li);K.upperMesh.scale.set(di,li,di),K.upperMesh.position.y=-ei/2,K.joint.position.y=-ei,K.lowerMesh.scale.set(di,li,di),K.lowerMesh.position.y=-ei/2,K.hand.position.y=-ei,jt={active:!0,dist:Jn,gy:ue,pitch:sa.rootPitch,joint:K.joint.rotation.x,grip:Ri}}function A0(N,at){if(!m.enabled){ie=0,H=0,st.wrist.rotation.set(0,0,0),_t=st.root.rotation.x,Mt=kh();return}const yt=st.root.rotation.x,wt=kh();if(at!==te){te=at,_t=yt,Mt=wt,st.wrist.rotation.set(ie,0,H);return}if(!Number.isFinite(_t)||N<=1e-5){_t=yt,Mt=wt,st.wrist.rotation.set(ie,0,H);return}const Kt=(yt-_t)/N,Jt=Ge(wt-Mt)/N;_t=yt,Mt=wt;const re=Math.max(0,m.maxAngle),Se=Math.max(0,m.maxTwist),We=.15+.85*me(yn,0,1),rn=-me(At,0,1.4)*Math.max(0,m.runDrag),qe=me(-Kt*m.lag*We+rn,-re,re),Ye=me(Jt*m.twistLag*We,-Se,Se),Ee=1-Math.exp(-Math.max(0,m.rate)*N);ie+=(qe-ie)*Ee,H+=(Ye-H)*Ee,st.wrist.rotation.set(ie,0,H)}function R0(N){const at=Math.PI/180;return N==="greatsword"?s.greatswordPitchDeg*at:N==="staff"?s.staffPitchDeg*at:N==="bow"?s.bowPitchDeg*at:s.swordPitchDeg*at}function wc(N){const at=Math.PI/180;return N==="sword-shield"?s.shieldPitchDeg*at:N==="greatsword"?s.greatswordPitchDeg*at:N==="bow"?s.bowPitchDeg*at:s.swordPitchDeg*at}function P0(N){const at=Math.PI/180;return N==="sword-shield"||N==="dual-swords"?(s.swordCantDeg??0)*at:N==="greatsword"?(s.greatswordCantDeg??0)*at:0}function C0(N,at){const yt=N.weapon;if(yt==="staff"||yt==="bow")return;const wt=mi==="R",Kt=wt?st:K,Jt=wt?Gt:J,re=wt?K:st,Se=wt?J:Gt,We=yt==="greatsword"&&wt?xt:0,ye=yt==="greatsword"?s.greatswordYawDeg:s.swordYawDeg,rn=Math.PI/180,qe=-ye*rn,Ye=ye*rn,Ee=(ti,Ri)=>{const ei=Math.max(0,Math.PI/2-Math.abs(Ri));return Math.sign(ti)*Math.min(Math.abs(ti),ei)},an=(Ae??R0(yt)+Q)+We,cn=at+Kt.root.rotation.x+Kt.joint.rotation.x;Jt.rotation.set(Math.PI/2-an-cn,0,Ee(wt?qe:Ye,an));const mn=He??(yt==="sword-shield"?null:wc(yt)+mt),Jn=at+re.root.rotation.x+re.joint.rotation.x;yt==="sword-shield"?Se.rotation.x=mn===null?wc(yt):wc(yt)-mn-Jn:Se.rotation.set(Math.PI/2-(mn??0)-Jn,0,Ee(wt?Ye:qe,mn??0));const Qn=P0(yt),li=pi??0,Ai=Ti??0,ia=ln??0,aa=Pn??0;wt?(V.rotation.z=-Qn+li,V.rotation.y=ia,O.rotation.z=Qn+Ai,O.rotation.y=aa):(O.rotation.z=Qn+li,O.rotation.y=ia,V.rotation.z=-Qn+Ai,V.rotation.y=aa)}function Ph(N){Ae=N.bladePitch,He=N.bladePitchOff,ln=N.bladeTwist,Pn=N.bladeTwistOff,pi=N.bladeYaw,Ti=N.bladeYawOff,mi=N.lead,ri=N.rootYaw+N.spinYaw,_.rotation.y=ri,S.rotation.y+=N.yaw,S.rotation.x+=N.pitch,S.rotation.z+=N.roll,x.position.z+=N.pelvisZ,x.position.x+=N.pelvisX,N.armR&&(st.root.rotation.x=N.armR.pitch,st.root.rotation.y=N.armR.yaw,st.root.rotation.z=N.armR.roll,st.joint.rotation.x=N.armR.elbow),N.armL&&(K.root.rotation.x=N.armL.pitch,K.root.rotation.y=N.armL.yaw,K.root.rotation.z=N.armL.roll,K.joint.rotation.x=N.armL.elbow)}function Ch(N,at){const yt=xe??jo(N.attackProgress),wt=P2(N.weapon,N.comboIndex,yt,p,N.attackProgress);if(N.comboIndex!==ke){oe=Ot,be=0,ke=N.comboIndex;const re=N.timings.windup+N.timings.active+N.timings.recovery,Se=Math.max(p.segBlendMin??.03,re*.22);Oe=k2(oe,wt,p,wt.blend??null,Se)}const Kt=Math.max(.008,Oe);be=Math.min(1,be+at/Kt);const Jt=oe&&be<1?C2(oe,wt,hp(be)):wt;return Ot=Jt,Jt}function D0(N,at){const yt=C/2+b/2,wt=M-.04-F;if(!p.enabled){K.root.position.set(-yt,wt,0),st.root.position.set(yt,wt,0),fe={lx:-yt,ly:wt,lz:0,rx:yt,ry:wt,rz:0};return}const Kt=Math.max(0,p.shoulderLift),Jt=Math.max(0,p.shoulderPush),re=N&&at==="greatsword"?Math.max(0,p.shoulderIn):0,Se=cn=>Kt*me((-cn-.5)/1.45,0,1),We=cn=>Jt*me((-cn-.2)/1.9,0,1),ye=-yt+re,rn=wt+Se(K.root.rotation.x),qe=We(K.root.rotation.x),Ye=yt-re,Ee=wt+Se(st.root.rotation.x),an=We(st.root.rotation.x);K.root.position.set(ye,rn,qe),st.root.position.set(Ye,Ee,an),fe={lx:ye,ly:rn,lz:qe,rx:Ye,ry:Ee,rz:an}}function L0(N,at,yt){if(N.phase==="idle"||N.charging){Rn=0,nn=0,En=0;return}const wt=N.attackProgress,Kt=jo(wt),Jt=Math.max(0,Kt),re=c.stride,Se=Number.isFinite(re.stepReach)?re.stepReach:.17,We=Number.isFinite(re.stepSideReach)?re.stepSideReach:.14,ye=Number.isFinite(re.stepDipReach)?re.stepDipReach:.05,rn=N.weapon==="greatsword"?me(Number.isFinite(re.heavyScale)?re.heavyScale:1,0,1):1,qe=1-Math.exp(-12*Math.max(0,yt));Rn+=(Se*Jt*rn-Rn)*qe,nn+=(at*We*Jt*rn-nn)*qe,En+=(ye*Math.sin(Math.PI*wt)*rn-En)*qe,x.position.z+=Rn,x.position.x+=nn,x.position.y-=En}let Dh=null;function k0(){Dh={upperX:S.rotation.x,upperY:S.rotation.y,upperZ:S.rotation.z,upperPX:S.position.x,upperPZ:S.position.z,pelvisX:x.position.x,pelvisY:x.position.y,pelvisZ:x.position.z,pelvisRX:x.rotation.x,pelvisRZ:x.rotation.z,lrx:K.root.rotation.x,lry:K.root.rotation.y,lrz:K.root.rotation.z,lj:K.joint.rotation.x,rrx:st.root.rotation.x,rry:st.root.rotation.y,rrz:st.root.rotation.z,rj:st.joint.rotation.x,rootY:_.rotation.y}}function I0(N){const at=Dh;if(!at)return;const yt=hp(me(N,0,1));if(yt>=1)return;const wt=(Kt,Jt)=>Kt+(Jt-Kt)*yt;S.rotation.x=wt(at.upperX,S.rotation.x),S.rotation.y=wt(at.upperY,S.rotation.y),S.rotation.z=wt(at.upperZ,S.rotation.z),S.position.x=wt(at.upperPX,S.position.x),S.position.z=wt(at.upperPZ,S.position.z),x.position.x=wt(at.pelvisX,x.position.x),x.position.y=wt(at.pelvisY,x.position.y),x.position.z=wt(at.pelvisZ,x.position.z),x.rotation.x=wt(at.pelvisRX,x.rotation.x),x.rotation.z=wt(at.pelvisRZ,x.rotation.z),K.root.rotation.x=wt(at.lrx,K.root.rotation.x),K.root.rotation.y=wt(at.lry,K.root.rotation.y),K.root.rotation.z=wt(at.lrz,K.root.rotation.z),K.joint.rotation.x=wt(at.lj,K.joint.rotation.x),st.root.rotation.x=wt(at.rrx,st.root.rotation.x),st.root.rotation.y=wt(at.rry,st.root.rotation.y),st.root.rotation.z=wt(at.rrz,st.root.rotation.z),st.joint.rotation.x=wt(at.rj,st.joint.rotation.x),_.rotation.y=at.rootY+Ge(_.rotation.y-at.rootY)*yt,ri=_.rotation.y}let to=null,Ec=0,Lh=0;function z0(){if(!D)return;const N=k,at=Math.max(0,N.waist??1),yt=Math.max(0,N.chest??0),wt=at+yt,Kt=wt>1e-6?at/wt:1,Jt=wt>1e-6?yt/wt:0,re=S.rotation.x,Se=S.rotation.y,We=S.rotation.z;S.rotation.set(re*Kt,Se*Kt,We*Kt),A.rotation.set(re*Jt,Se*Jt,We*Jt);const ye=me(N.neck??0,0,1);ye>0&&(ht.rotation.x-=re*ye),to={x:re,y:Se,z:We}}function qo(){return{yaw:S.rotation.y+(D?A.rotation.y:0),pitch:S.rotation.x+(D?A.rotation.x:0),lean:S.rotation.z+(D?A.rotation.z:0)}}function kh(){return qo().yaw}function F0(N,at){if(!(h!=null&&h.enabled)){ce=null,Bt=0;return}_.updateWorldMatrix(!0,!0);const yt=new W,wt=[],Kt=(di,Gi,no=0)=>{di.getWorldPosition(yt),wt.push({x:yt.x,y:yt.y+no,z:yt.z,mass:Gi})},Jt=n.headSize;Kt(ht,.08,Jt/2),Kt(z,.14),Kt(G??A,.24),Kt(x,.12),Kt(K.hand,.05),Kt(st.hand,.05),Kt(Y.joint,.15),Kt(q.joint,.15);const re=Rt?Ko(vt[Rt].right):null;re&&wt.push({x:(re.base.x+re.tip.x)/2,y:(re.base.y+re.tip.y)/2,z:(re.base.z+re.tip.z)/2,mass:Rt==="greatsword"?.09:.04});const Se=Math.max(.05,n.limbThickness*1.15/2+.015),We=Math.max(.06,n.limbThickness*1.7/2+.02);let ye=1/0,rn=-1/0,qe=1/0,Ye=-1/0,Ee=0;for(const di of[Y,q])di.tip.getWorldPosition(yt),yt.y<=.13&&(Ee+=1),ye=Math.min(ye,yt.x-Se),rn=Math.max(rn,yt.x+Se),qe=Math.min(qe,yt.z-We),Ye=Math.max(Ye,yt.z+We);(!Number.isFinite(ye)||Ee===0)&&(ye=rn=qe=Ye=0);let an=0,cn=0;Number.isFinite(on)&&at>1e-5&&(an=me((N.position.x-on)/at,-20,20),cn=me((N.position.z-Mn)/at,-20,20)),on=N.position.x,Mn=N.position.z;const mn=y2(wt,{minX:ye,maxX:rn,minZ:qe,maxZ:Ye},an,cn,h);if(ce=mn,!h.autoCounter){Bt=0;return}const Jn=Math.cos(N.bodyYaw),Qn=-Math.sin(N.bodyYaw),li=mn.xcomX-mn.centerX,Ai=mn.xcomZ-mn.centerZ,ia=li*Jn+Ai*Qn,aa=an*Jn+cn*Qn,ti=mn.grounded?M2(ia,aa,h.predLead??0):0;Lh=ti;const Ri=Math.abs(ti)-.45*mn.halfX;he=Ri;let ei=0;Ri>.002&&mn.grounded&&(ei=-Math.sign(ti)*Math.min(Math.max(.005,h.maxShift??.045),(Ri+.002)*1.1666666666666667));const eo=Math.abs(ti)/Math.max(1e-4,mn.halfX),sa=Math.max(.1,_2(h.counterRate,eo,h.counterBoost??0));Bt+=(ei-Bt)*(1-Math.exp(-sa*at))}function U0(N,at){if(Et.drawString.position.z=-.06,lt.position.z=0,Pt.orb.scale.setScalar(1),S.rotation.y=0,N.charging&&N.weapon==="bow"){const Jt=N.charge;K.root.rotation.x=-1.25,K.joint.rotation.x=-.15,st.root.rotation.x=.35+Jt*.3,st.joint.rotation.x=-1.15,Et.drawString.position.z=-.06-Jt*.22,lt.position.z=-Jt*.3,S.rotation.y=-.22;return}if(N.phase==="idle"&&pn<=.001){oe=null,Ot=null,ke=0,be=1,Oe=Math.max(.008,p.segBlend),Ae=null,He=null,ln=null,Pn=null,pi=null,Ti=null,ue=NaN,N.weapon==="greatsword"&&(Gt.position.x=-Math.max(0,s.twoHandInsetX??0));return}const yt=jo(N.attackProgress),wt=Math.max(0,-yt),Kt=Math.max(0,yt);if(N.weapon==="bow")K.root.rotation.x=-1.2,K.joint.rotation.x=-.15,st.root.rotation.x=.9-Kt*.8,st.joint.rotation.x=-.3;else if(N.weapon==="greatsword")if(p.enabled)Ph(Ch(N,at));else{const Jt=-1.6*wt+1.25*Kt,re=me(Number.isFinite(c.stride.heavyScale)?c.stride.heavyScale:1,0,1);st.root.rotation.x=Jt,st.joint.rotation.x=-(.25+wt*.4),K.root.rotation.x=Jt+.06,K.joint.rotation.x=-(.32+wt*.4),K.root.rotation.z=.42,st.root.rotation.z=0;const Se=-Math.sin(st.root.rotation.x);st.root.rotation.y=-.72*Math.tanh(Se*4),S.rotation.y=-.2*yt*re}else if(p.enabled)Ph(Ch(N,at));else{const Jt=N.comboIndex;if(Jt===1)st.root.rotation.x=-1.7*wt+1.1*Kt,st.joint.rotation.x=-(.2+wt*.5),K.root.rotation.x=.1,S.rotation.y=-.18*yt;else if(Jt===2)K.root.rotation.x=-1.5*wt+1*Kt,K.joint.rotation.x=-(.2+wt*.5),st.root.rotation.x=.2,S.rotation.y=.45*-yt;else{const re=-1.9*wt+1.2*Kt;K.root.rotation.x=re,st.root.rotation.x=re,K.joint.rotation.x=-(.15+wt*.4),st.joint.rotation.x=-(.15+wt*.4),S.rotation.y=-.3*yt}}if(N.weapon==="greatsword"){const Jt=me((-st.root.rotation.x-1.3)/1.2,0,1);Gt.position.x=-Math.max(0,s.twoHandInsetX??0)*(1-Jt)}L0(N,Pe%2===0?1:-1,at)}function N0(N,at){N&&(st.root.rotation.x=-1.05,st.joint.rotation.x=-.35,K.root.rotation.x=-.45,K.joint.rotation.x=-.2,S.rotation.y=-.12,Pt.orb.scale.setScalar(1.25+.12*Math.sin(at*2)))}function O0(N){if(!N||N.phase==="idle")return;const at=N.progress,yt=at<.3?-.35+at/.3*1.35:at<.7?1:Math.max(0,1-(at-.7)/.3),wt=Math.PI/180;S.rotation.x+=v.leanDeg*wt*yt,K.root.rotation.x-=v.shieldPitchDeg*wt*yt,K.joint.rotation.x-=.22*yt,st.root.rotation.x-=.3*yt,x.position.z+=v.pelvisReach*Math.max(0,yt)}function Ko(N){if(!N)return null;const at=N.getObjectByName("bladeBase"),yt=N.getObjectByName("bladeTip");if(!at||!yt)return null;N.updateWorldMatrix(!0,!1);const wt=at.getWorldPosition(new W),Kt=yt.getWorldPosition(new W),Jt=new W().setFromMatrixColumn(N.matrixWorld,0).normalize();return{base:{x:wt.x,y:wt.y,z:wt.z},tip:{x:Kt.x,y:Kt.y,z:Kt.z},normal:{x:Jt.x,y:Jt.y,z:Jt.z}}}return{group:_,update(N,at,yt,wt,Kt=!1,Jt,re,Se){var Zh;Ah(at.weapon);const We=Jt===void 0||U<0?wt:me(Jt-U,0,.1);Jt!==void 0&&(U=Jt),_.rotation.y=0,ri=0,S.rotation.x=0,S.rotation.z=0,x.position.x=0,x.position.y=T,x.position.z=0,x.rotation.z=0,x.rotation.x=0,S.position.x=0,S.position.y=0,S.position.z=0,A.rotation.set(0,0,0),y.position.x=0,y.position.y=0,y.position.z=0,y.rotation.z=0;const ye=Math.max(1/240,Math.min(wt,.1));ot=((Zh=c.stance)==null?void 0:Zh[at.weapon])??null,L!==at.weapon&&(L=at.weapon,P=ot?0:1);const rn=Math.max(.01,(ot==null?void 0:ot.blend)??.22);P=Math.min(1,P+ye/rn);const qe=ot?P:0;Q=((ot==null?void 0:ot.bladePitchDeg)??0)*Math.PI/180*qe,mt=((ot==null?void 0:ot.bladePitchOffDeg)??0)*Math.PI/180*qe;const Ye=Jt===void 0?Ea+=wt:Jt;ts=Ye;const Ee=c.landing;Ee.enabled?es&&!N.grounded?(Ta="jump",is=Ye,as=Ee.anticipationDuration,ss=Math.max(0,Ee.jumpAnticipation),Zo=.32):!es&&N.grounded&&(Ta="land",is=Ye,as=Ee.duration,ss=f2(ns,Ee),Zo=Ee.compressRatio,Th=ns):(Ta="none",ss=0),Ye<is&&(Ta="none",ss=0),es=N.grounded,ns=N.velocity.y;const an=cp(Ye,is,as,ss,Zo),cn=at.phase!=="idle",mn=(Se==null?void 0:Se.phase)==="active";yn=l2(yn,cn,ye,c.attack.blendRate);const Jn=d2(yn,c.attack.gaitWeight,c.attack.lowerBodyWeight);Wn=Jn.attackLegWeight,Qs=Jn.gaitScale;const Qn=Math.sin(N.bodyYaw),li=Math.cos(N.bodyYaw),Ai=(N.velocity.x-dt)/ye,ia=(N.velocity.z-zt)/ye,aa=me(Ai,-60,60),ti=me(ia,-60,60),Ri=aa*Qn+ti*li,ei=Ge(N.bodyYaw-Ct)/ye,eo=We>1e-6?Ge(N.bodyYaw-Ct)/We:0,sa=Math.hypot(N.velocity.x,N.velocity.z),di=o.maxForwardDeg*Math.PI/180,Gi=o.maxSideDeg*Math.PI/180,no=me(Ri*o.accelGain,-di,di),io=me(-ei*sa*o.turnGain,-Gi,Gi),ao=1-Math.exp(-o.smoothing*ye);St+=(no-St)*ao,Yt+=(io-Yt)*ao,dt=N.velocity.x,zt=N.velocity.z,Ct=N.bodyYaw;const Yn=Math.hypot(N.velocity.x,N.velocity.z),os=me(a.knockGaitScale??0,0,1),rs=yt.knockX*os,B0=yt.knockZ*os,H0=os>0&&Math.hypot(yt.knockX,yt.knockZ)>.001,Tc=N.velocity.x+rs,Ac=N.velocity.z+B0,Ih=Math.hypot(Tc,Ac);Ei=Ih;const G0=Math.cos(N.bodyYaw),X0=-Math.sin(N.bodyYaw),V0=N.velocity.x*G0+N.velocity.z*X0,zh=Yn>ji?me(V0/Yn,-1,1):0,Fh=Yn>ji?me((N.velocity.x*Qn+N.velocity.z*li)/Yn,-1,1):1,W0=bh(Fh,a.backStrafeStartDeg,a.backStrafeFullDeg);fn==="settled"&&nt&&kt>Xt*1.02+1e-4&&(fn="none");let so=1;fn==="blend"?(so=r0(ct?rt:I,a.stopYawBlendMode,ct),ct||(I=Math.min(1,I+ye/Math.max(.01,a.stopYawAfterSec)),(I>=1||a.stopYawBlendMode==="inStop"||nt)&&(fn="settled",so=0))):fn==="settled"&&(so=me(Yn/Math.max(ji,a.stopEnterRatio*e),0,1)),it=so;const Y0=t0(zh,i.legYawScale,i.hipYawMaxDeg,a.strafeHipBoost),Uh=(a.hipYawTrackRateDeg??0)*Math.PI/180,$0=(a.hipYawBackRateDeg??0)*Math.PI/180,Rc=We>1e-6?We:wt;It=Uh>0?qm(It,jm(eo),Rc):0;const Nh=e0(W0,It),Z0=me(Yn/.5,0,1),j0=i0(Fh,zh,Y0,Nh)*so*Z0,Oh=Km(Nt,j0,n0(Uh,$0,Nh),Rc,It);Nt=Oh,pt+=(Oh-pt)*(1-Math.exp(-i.hipYawSmoothing*Rc));const oo=N.bodyYaw+pt;Ht=oo;const q0=Math.sin(oo),K0=Math.cos(oo),J0=Math.cos(oo),Q0=-Math.sin(oo),hi={speed:Ih,phase:N.gaitPhase,localForward:Tc*q0+Ac*K0,localRight:Tc*J0+Ac*Q0,stride:N.stride};if(cn&&at.attackId!==un){const ae=!Tn;un=at.attackId,Pe+=1,Ve=ae&&(!Re||hi.speed>.05)?hi.phase:vn,Re=!0}Tn=cn;const gi=yn>0?r2(hi,at.attackProgress,Pe,yn,c.stride,Ve):hi;Hi=gi,cn&&(vn=gi.phase);const Pc=Math.max(0,a.dirFlipSec??0);Pc>0?(Cn=hc(Cn,gi.localForward>=0?1:-1,ye,Pc),ci=hc(ci,gi.localRight>=0?1:-1,ye,Pc)):(Cn=gi.localForward>=0?1:-1,ci=gi.localRight>=0?1:-1);const Bh=Math.max(0,a.stopBlendSec||0),Hh=Bh>0&&!cn&&!H0&&N.grounded,Cc=a0(Yn,we,e,a.stopEnterRatio,a.stopExitRatio);if(!Hh||Cc.resume)bt=-1;else if(bt<0&&Cc.enter){bt=0,$=N.gaitPhase,ut=Jm(N.gaitPhase),Ft=Yn,Dt=Math.max(N.stride,ji),qt=hi.localForward,le=hi.localRight;const ae=1/Math.max(ji,Yn);de=N.velocity.x*ae,ee=N.velocity.z*ae}const tg=we;we=Yn;const Pi=Hh&&bt>=0;Pi&&(bt=Math.min(1,bt+ye/Bh)),Pi&&fn!=="blend"&&(fn="blend",I=0),ct=Pi&&bt<1,rt=bt,nt=Cc.resume,kt=Yn,Xt=tg;const Gh=Pi?{phase:$,speed:Ft,moveSpeed:e,localForward:qt,localRight:le,dirF:Cn,dirR:ci,legLength:n.legLength,stride:Dt,grounded:!0}:{phase:gi.phase,speed:gi.speed,moveSpeed:e,localForward:gi.localForward,localRight:gi.localRight,dirF:Cn,dirR:ci,legLength:n.legLength,stride:gi.stride??0,grounded:N.grounded};let Dc=Pi?Qm(Gh,a,{progress:bt,phase0:$,phaseEnd:ut}):uc(Gh,a);const Aa=c.attack.moveTakeover;if(Aa&&!Pi){const ae=at.phase==="windup"?Aa.windup:at.phase==="recovery"?Aa.recovery:at.phase==="settle"?Aa.settle:0,pe=Math.max(.05,Aa.full-Aa.speed),Dn=me((hi.speed-Aa.speed)/pe,0,1),Un=me(ae,0,1)*Dn,Jo=Un>Kn?10:6;Kn=me(Kn+(Un-Kn)*(1-Math.exp(-Jo*ye)),0,1)}else Pi?Kn=0:Kn=me(Kn*Math.exp(-8*ye),0,1);if(Kn>.001&&!Pi){const ae=uc({phase:hi.phase,speed:hi.speed,moveSpeed:e,localForward:hi.localForward,localRight:hi.localRight,dirF:Cn,dirR:ci,legLength:n.legLength,stride:hi.stride??0,grounded:N.grounded},a);Dc=h2(Dc,ae,Kn)}const Ie=u2(Dc,Jn.gaitScale);if(Zt=0,mn&&Se){const ae=a2(Se.progress,Se.dir,a),pe=Jn.gaitScale;Ie.legL.pitchX+=ae.legL.pitchX*pe,Ie.legL.rollZ+=ae.legL.rollZ*pe,Ie.legL.kneeX+=ae.legL.kneeX*pe,Ie.legR.pitchX+=ae.legR.pitchX*pe,Ie.legR.rollZ+=ae.legR.rollZ*pe,Ie.legR.kneeX+=ae.legR.kneeX*pe,Ie.pelvisY+=ae.pelvisY*pe,Zt=ae.env}let Lc=0,kc=0,Ic=0,Xh=0;if(Pi){const ae=o0(N.bodyYaw,de,ee),pe=c0(bt,$,ae.forward,ae.right,a);pe.leadLeft?(Ie.legL.pitchX-=pe.leadPitch,Ie.legL.kneeX+=pe.leadKnee,Ie.legR.pitchX+=pe.trailPitch):(Ie.legR.pitchX-=pe.leadPitch,Ie.legR.kneeX+=pe.leadKnee,Ie.legL.pitchX+=pe.trailPitch),kc=pe.bodyShift*pe.fwdN,Lc=pe.bodyShift*pe.rightN,Ic=pe.bodyDip,Xh=pe.chestPitch,Xn=pe.leadPitch,Vn=pe.bodyShift,wi=pe.bodyDip}else Xn=0,Vn=0,wi=0;if(wa={lp:Ie.legL.pitchX,lr:Ie.legL.rollZ,rp:Ie.legR.pitchX,rr:Ie.legR.rollZ},!N.grounded)Y.root.rotation.x=-.55,q.root.rotation.x=-.25,Y.joint.rotation.x=.75,q.joint.rotation.x=.55,K.root.rotation.x=-.9,st.root.rotation.x=-.7,K.joint.rotation.x=-.6,st.joint.rotation.x=-.6,Y.root.rotation.z=0,q.root.rotation.z=0;else{Y.root.rotation.x=Ie.legL.pitchX,q.root.rotation.x=Ie.legR.pitchX,Y.root.rotation.z=Ie.legL.rollZ,q.root.rotation.z=Ie.legR.rollZ,Y.joint.rotation.x=Ie.legL.kneeX,q.joint.rotation.x=Ie.legR.kneeX;const ae=ot?P:0,pe=1+(((ot==null?void 0:ot.armSwing)??1)-1)*ae,Dn=ot==null?void 0:ot.armR,Un=ot==null?void 0:ot.armL,Jo=Ie.armL*pe+((Un==null?void 0:Un.pitch)??0)*ae,jh=Ie.armR*pe+((Dn==null?void 0:Dn.pitch)??0)*ae;K.root.rotation.x=Jo,st.root.rotation.x=jh,K.joint.rotation.x=-(.18+Jo*.2)+((Un==null?void 0:Un.elbow)??0)*ae,st.joint.rotation.x=-(.18+jh*.2)+((Dn==null?void 0:Dn.elbow)??0)*ae,K.root.rotation.z=((Un==null?void 0:Un.roll)??0)*ae,st.root.rotation.z=((Dn==null?void 0:Dn.roll)??0)*ae,K.root.rotation.y=((Un==null?void 0:Un.yaw)??0)*ae,st.root.rotation.y=((Dn==null?void 0:Dn.yaw)??0)*ae,x.position.x=Ie.pelvisX,x.position.y=T+Ie.pelvisY,x.position.z=0,x.rotation.z=Ie.pelvisRoll}const eg=g0(x,y),ro=mn?{...f,weight:0}:Pi&&f.enabled?{...f,weight:1}:f,Vh=ro.enabled&&N.grounded&&ro.weight>0?me(ro.weight,0,1)*(cn?me(ro.attackScale,0,1):1):0;x.position.x+=Lc,x.position.z+=kc,x.position.y-=Ic,y.position.y+=Ic,Vh<=0&&(y.position.x-=Lc,y.position.z-=kc);const zc=Yn/Math.max(e,ji);At=zc;const ng=Number.isFinite(o.crouchSmoothing)?o.crouchSmoothing:8,ig=1-Math.exp(-Math.max(0,ng)*ye);j+=(me(zc,0,1)-j)*ig;const cs=f0({leanForward:St,leanSide:Yt,speedRatio:j},o);x.rotation.x+=cs.pelvisPitch,x.rotation.z+=cs.pelvisRoll,x.position.x+=cs.pelvisX,x.position.z+=cs.pelvisZ,x.position.y-=cs.crouch,y.position.y+=cs.crouch*(1-me(Vh,0,1));const Wh=at.phase!=="idle"||at.charging&&at.weapon==="bow",Fc=Wh?1:0,ag=Math.max(.001,Fc>pn?p.poseIn??.1:p.poseOut??.16);if(pn!==Fc){const ae=ye/ag;pn=me(pn+(Fc>pn?ae:-ae),0,1)}if((pn>0||Wh)&&k0(),U0(at,ye),pn>0&&pn<1&&I0(pn),ot){const ae=(1-pn)*P;S.rotation.y+=(ot.torsoYaw??0)*ae,S.rotation.x+=(ot.torsoPitch??0)*ae}N0(Kt,N.gaitPhase),O0(re);const sg=at.weapon==="greatsword",Yh=Math.hypot(N.velocity.x,N.velocity.z),og=sg&&at.phase==="idle"&&Yh>.5?Math.min(1.15,Yh/Math.max(e,.001)*.9):0;xt+=(og-xt)*(1-Math.exp(-6*ye));const rg=S.rotation.x;at.weapon==="bow"&&(Et.g.rotation.x=-(K.root.rotation.x+K.joint.rotation.x),lt.rotation.x=-(st.root.rotation.x+st.joint.rotation.x));const cg=S.rotation.y;w0(yt,N.bodyYaw);const $h=yt.type==="none"?1:.4;if(S.rotation.x+=St*$h+Xh,S.rotation.z+=(Yt+Ie.sideLean)*$h,an>0&&(Y.root.rotation.x-=Ee.hipPitch*an,q.root.rotation.x-=Ee.hipPitch*an,Y.joint.rotation.x+=Ee.kneeBend*an,q.joint.rotation.x+=Ee.kneeBend*an,x.position.y-=Ee.crouchDepth*an,y.position.y+=Ee.crouchDepth*(1-Ee.lowerScale)*an,S.rotation.x+=Ee.upperPitch*an,K.root.rotation.x-=Ee.armTuck*an,st.root.rotation.x-=Ee.armTuck*an),Wn>0&&N.grounded){const ae=c2(at.attackProgress,Pe,c.stride),pe=Wn;Y.root.rotation.x+=ae.legL.pitchX*pe,q.root.rotation.x+=ae.legR.pitchX*pe,Y.root.rotation.z+=ae.legL.rollZ*pe,q.root.rotation.z+=ae.legR.rollZ*pe,Y.joint.rotation.x+=ae.legL.kneeX*pe,q.joint.rotation.x+=ae.legR.kneeX*pe,x.position.x+=ae.pelvisX*pe,x.position.y+=ae.pelvisY*pe,x.rotation.z+=ae.pelvisRoll*pe}if(D0(cn,at.weapon),h!=null&&h.enabled&&h.autoCounter&&Math.abs(Bt)>1e-4&&(x.position.x+=Bt),g.enabled){const ae=at.phase!=="idle"&&!at.charging,pe=ae?jo(at.attackProgress):0;ae&&ne>.55&&pe<ne-1e-4&&(se=1),ne=pe,se=E2(se,ye,g.impactDecay);const Dn=S2({swing:pe,charge:at.charging?at.charge:0,impact:se,speedRatio:zc,grounded:N.grounded},g);$t=w2($t,Dn,ye,g.smoothing)}else $t={...Xd};E0($t),y.rotation.y=pt,De=s0(pt,a.chestYawScale,a.chestYawMaxDeg),S.rotation.y+=De;const lg=cg;if(ht.rotation.y=Ge(N.headYaw-N.bodyYaw-lg-De),ht.rotation.x=-me(N.headPitch??0,-.7,.7),S.rotation.x+=-me(N.bodyPitch??0,-.4,.4),z0(),A0(wt,at.comboIndex),C0(at,rg),at.weapon==="greatsword"&&!at.charging&&(at.phase!=="idle"||pn>0)){_.updateWorldMatrix(!0,!0);const ae=at.phase==="idle"?Math.max(pn,yn):1;T0(me(ae,0,1),ye)}if(tt=x0({root:_,pelvis:x,lower:y,limbs:Tt,base:eg,cfg:ro,grounded:N.grounded,attacking:cn}),F0(N,ye),D&&to){const ae=qo();Ec=Math.max(Math.abs(ae.pitch-to.x),Math.abs(ae.yaw-to.y),Math.abs(ae.lean-to.z))}else Ec=0},lean(){return{forward:St,side:Yt}},landing(){const N=cp(ts,is,as,ss,Zo),at=as>0?Math.max(0,as-Math.max(0,ts-is)):0;return{pulse:N,remaining:at,kind:N>0?Ta:"none",impactVy:Th}},hurt(){return Ut},ik(){return tt},stretch(){return{...$t,impact:se}},gripDebug(){return{...jt}},weaponDebug(){return{wristPitch:ie,wristTwist:H}},setClipT(N){xe=N===null||!Number.isFinite(N)?null:Math.max(0,Math.min(1,N))},stanceDebug(){const N=ot==null?void 0:ot.armR,at=ot==null?void 0:ot.armL,yt=ot?P:0;return{weapon:Rt??"sword-shield",weight:yt,armL:{pitch:((at==null?void 0:at.pitch)??0)*yt,yaw:((at==null?void 0:at.yaw)??0)*yt,roll:((at==null?void 0:at.roll)??0)*yt,elbow:((at==null?void 0:at.elbow)??0)*yt},armR:{pitch:((N==null?void 0:N.pitch)??0)*yt,yaw:((N==null?void 0:N.yaw)??0)*yt,roll:((N==null?void 0:N.roll)??0)*yt,elbow:((N==null?void 0:N.elbow)??0)*yt},torsoYaw:((ot==null?void 0:ot.torsoYaw)??0)*yt,torsoPitch:((ot==null?void 0:ot.torsoPitch)??0)*yt,bladePitchDeg:Q*180/Math.PI,bladePitchOffDeg:mt*180/Math.PI,armSwing:(ot==null?void 0:ot.armSwing)??1}},swingDebug(){const N=Ot;return{seg:ke,kind:(N==null?void 0:N.kind)??"right-left",lead:(N==null?void 0:N.lead)??"R",yaw:(N==null?void 0:N.yaw)??0,rootYaw:(N==null?void 0:N.rootYaw)??0,spinYaw:(N==null?void 0:N.spinYaw)??0,rootTurn:ri,pitch:(N==null?void 0:N.pitch)??0,roll:(N==null?void 0:N.roll)??0,strike:(N==null?void 0:N.strike)??0,bladeTwist:(N==null?void 0:N.bladeTwist)??0,bladeTwistOff:(N==null?void 0:N.bladeTwistOff)??0,bladeYaw:(N==null?void 0:N.bladeYaw)??0,bladeYawOff:(N==null?void 0:N.bladeYawOff)??0,shoulderL:{x:fe.lx,y:fe.ly,z:fe.lz},shoulderR:{x:fe.rx,y:fe.ry,z:fe.rz}}},attackBlend(){return yn},attackWeights(){return{gaitScale:Qs,attackLegWeight:Wn,driveSpeed:Hi.speed,stridePhase:Hi.phase,strideBase:Ve,stepIndex:Pe}},hipYaw(){return pt},torsoTotal(){return qo()},spineDebug(){if(!D)return null;const N=qo();return{enabled:!0,waistYaw:S.rotation.y,chestYaw:A.rotation.y,totalYaw:N.yaw,totalPitch:N.pitch,totalLean:N.lean,neckPitch:ht.rotation.x,leak:Ec}},balanceDebug(){return ce?{...ce,shift:Bt,latDeficit:he,lateralFf:Lh}:null},gaitDebug(){return{stopT:bt,hipYaw:pt,chestYaw:De,speed:we,gaitSpeed:Ei,stopStep:Xn,stopShift:Vn,stopDip:wi,stopYawFade:it,turnStep:Zt,legTakeover:Kn,legLPitch:wa.lp,legLRoll:wa.lr,legRPitch:wa.rp,legRRoll:wa.rr,phase:Hi.phase,dirF:Cn,dirR:ci,hipYawTarget:Nt,spin:It}},gaitYaw(){return Ht},arrowDirection(){lt.updateWorldMatrix(!0,!1);const N=lt.matrixWorld.elements,at=N[8],yt=N[9],wt=N[10],Kt=Math.hypot(at,yt,wt)||1;return{x:at/Kt,y:yt/Kt,z:wt/Kt}},weaponBlade(){return Rt?Ko(vt[Rt].right):null},bladesWorld(){return Rt?{right:Ko(vt[Rt].right),left:Ko(vt[Rt].left)}:{right:null,left:null}},dispose(){_.traverse(N=>{if(N instanceof ve){N.geometry.dispose();const at=N.material;Array.isArray(at)?at.forEach(yt=>yt.dispose()):at.dispose()}})}}}function O2(n){const t=v0(n.voxel,n.colors,n.moveSpeed,n.orientation,n.gait,n.mount,n.lean,n.hurt,n.animation,n.ik,n.links,n.wrist,n.balance),e=new ge;e.add(t.group);const i={position:{x:0,y:0,z:0},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:1,distance:0,coyoteTime:0,jumpBuffer:0},a=[];for(const s of["headPivot","chest","torsoUpper","torso","pelvis"]){const o=t.group.getObjectByName(s);o&&a.push(o)}return{group:e,update(s,o,r){i.position.x=s.position.x,i.position.y=s.position.y,i.position.z=s.position.z,i.velocity.x=s.velocity.x,i.velocity.y=s.velocity.y,i.velocity.z=s.velocity.z,i.facing=s.facing,i.moveYaw=Math.atan2(i.velocity.x,i.velocity.z),i.bodyYaw=s.bodyYaw,i.headYaw=s.headYaw,i.gaitPhase=s.gaitPhase,i.stride=s.stride,i.distance=s.distance,i.grounded=!0,i.sprinting=!1,e.position.set(s.position.x,s.position.y,s.position.z),e.rotation.y=s.bodyYaw,s.combat&&t.update(i,s.combat,s.hurt,o,!1,r,s.link)},debug(){return t.gaitDebug()},boneAtWorld(s,o,r){if(a.length===0)return null;const c=new W(s,o,r),l=new W;let d=null,u=Number.POSITIVE_INFINITY;for(const h of a){h.updateWorldMatrix(!0,!1),h.getWorldPosition(l);const f=l.distanceToSquared(c);f<u&&(u=f,d=h)}return d?{node:d,point:c}:null},dispose(){t.dispose()}}}const Ua=.012,Na=.016;function B2(n,t,e=[]){const i=t.lab,a=new ge;a.name="test-lab";const s=[],o=[],r=[],c=[];function l(S){return r.push(S),S}function d(S){return c.push(S),S}function u(S,w,T,R=Ua){const b=l(new Sn({color:w,transparent:!0,opacity:T,depthWrite:!1,side:je,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),M=new ve(S,b);return M.rotation.x=-Math.PI/2,M.position.y=R,M.renderOrder=2,M}function h(S,w){return d(new Os(Math.max(S,.001),w,72))}function f(S,w,T,R=Na){const M=document.createElement("canvas"),C=M.getContext("2d");if(!C)return new ve;const k='700 96px "Noto Sans SC", ui-monospace, Menlo, monospace';C.font=k,M.width=Wu.ceilPowerOfTwo(Math.ceil(C.measureText(S).width)+32),M.height=Wu.ceilPowerOfTwo(96*1.4);const D=M.getContext("2d");if(!D)return new ve;D.font=k,D.textAlign="center",D.textBaseline="middle",D.fillStyle=T,D.fillText(S,M.width/2,M.height/2);const F=new Od(M);F.colorSpace=Hn,o.push(F);const A=M.width/M.height,E=d(new Zn(w*A,w)),z=l(new Sn({map:F,transparent:!0,depthWrite:!1,side:je,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3})),G=new ve(E,z);return G.rotation.x=-Math.PI/2,G.position.y=R,G.renderOrder=3,G}function m(S,w,T,R,b,M){const C=T-w,k=d(new Zn(C,R)),D=u(k,b,M,Ua);D.position.set(C/2+w,Ua,0);const F=new ge;return F.add(D),F.rotation.y=S-Math.PI/2,F}function v(S,w,T,R,b){const M=new Gm;M.moveTo(0,w*.5),M.lineTo(-T*.5,w*.5-T*.9),M.lineTo(-T*.18,w*.5-T*.9),M.lineTo(-T*.18,-w*.5),M.lineTo(T*.18,-w*.5),M.lineTo(T*.18,w*.5-T*.9),M.lineTo(T*.5,w*.5-T*.9),M.closePath();const C=d(new _h(M)),k=u(C,R,b,Ua+.002),D=new ge;return D.add(k),D.rotation.y=S+Math.PI,D}function g(S){var C;const w=new ge,T=f(`${S.index} · ${S.name}`,t.lab.labelTextHeight,"#eaf4ff"),b=((C=T.geometry.parameters)==null?void 0:C.width)??3;w.add(T);const M=u(d(new Zn(b*.98,.08)),S.color,.7,Na);return M.position.set(0,Na,t.lab.labelTextHeight*.66),w.add(M),w.position.set(S.labelX,0,S.labelZ),w}function p(S,w){const T=new ge,R=S.maxX-S.minX,b=S.maxZ-S.minZ,M=(S.minX+S.maxX)/2,C=(S.minZ+S.maxZ)/2,k=.09,D=.006,F=[[M,S.minZ+k/2,R,k],[M,S.maxZ-k/2,R,k],[S.minX+k/2,C,k,b],[S.maxX-k/2,C,k,b]];for(const[E,z,G,X]of F){const et=u(d(new Zn(G,X)),w,.38,D);et.position.set(E,D,z),T.add(et)}const A=.42;for(const[E,z]of[[S.minX+A/2,S.minZ+A/2],[S.maxX-A/2,S.minZ+A/2],[S.minX+A/2,S.maxZ-A/2],[S.maxX-A/2,S.maxZ-A/2]]){const G=u(d(new Zn(A,A)),w,.55,D);G.position.set(E,D,z),T.add(G)}return T}const _=new ge,x=new Map;for(const S of n??[])x.set(S.id,S.color);for(const S of e)S.plotId&&_.add(p(S,x.get(S.plotId)??"#7f8fa0"));for(const S of n??[]){const w=new ge;if(w.position.set(S.x,0,S.z),S.shape==="square"){const T=S.radius,R=u(d(new Zn(T*2,T*2)),S.color,i.padOpacity*.09);w.add(R);const b=.07,M=[[0,T,T*2+b,b],[0,-T,T*2+b,b],[-T,0,b,T*2+b],[T,0,b,T*2+b]];for(const[C,k,D,F]of M){const A=u(d(new Zn(D,F)),S.color,i.padOpacity);A.position.x=C,A.position.z=k,w.add(A)}}else w.add(u(d(new xh(S.radius,72)),S.color,i.padOpacity*.075)),w.add(u(h(S.radius-.075,S.radius),S.color,i.padOpacity));if(S.id==="hub"){for(let T=0;T<4;T++){const R=T*Math.PI/4,b=T%2===0;for(const M of[0,Math.PI])w.add(m(R+M,S.radius*.12,S.radius*.94,b?.09:.055,S.color,b?.5:.32))}w.add(u(h(.5,.56),S.color,.4))}else if(S.id==="dash"){const T=S.spawnZ-S.z,R=-S.radius+.5,b=T-R,M=u(d(new Zn(.06,b)),S.color,.36);M.position.set(0,Ua,(T+R)/2),w.add(M);let C=0;for(let D=T;D>=R-.01;D-=1,C++){const F=C%5===0,A=u(d(new Zn(F?2.4:1.3,F?.1:.07)),S.color,F?.72:.42);A.position.set(0,Ua,D),w.add(A);const E=f(String(C),.52,F?"#eaf4ff":"rgba(200,225,245,0.8)");E.position.set(1.6,Na,D),w.add(E)}const k=[[3.2,"翻滚 3.2"],[5,"闪现 5.0"]];for(const[D,F]of k){const A=T-D,E=u(d(new Zn(1.9,.09)),"#ffffff",.5);E.position.set(-1.5,Ua,A),w.add(E);const z=f(F,.42,"rgba(220, 236, 250, 0.86)");z.position.set(-3,Na,A),w.add(z)}}else if(S.id==="gait"){w.add(u(h(1.44,1.5),S.color,.5)),w.add(u(h(1.14,1.2),S.color,.22));const T=1.55,R=[[0,"180° 正后退","#ff9a8a"],[Math.PI/4,"135° 斜后","#ffd166"],[Math.PI/2,"90° 正侧移","#8fe7ff"]];for(const[b,M,C]of R){const D=Math.sin(b),F=Math.cos(b),A=v(b,1.7,.34,C,.75);A.position.set(D*1.7*.5,0,T+F*1.7*.5),w.add(A);const E=f(M,.44,C);E.position.set(D*(1.7+.7),Na,T+F*(1.7+.7)),w.add(E)}}if(_.add(w),i.showLabels){const T=g(S);s.push(T),_.add(T)}}a.add(_);const y=n==null?void 0:n.find(S=>S.id==="hub");if(y&&i.showLabels){const S=[[0,-1,"屏上"],[0,1,"屏下"],[-1,0,"屏左"],[1,0,"屏右"]];for(const[w,T,R]of S){const b=f(R,.4,"rgba(190, 224, 248, 0.8)");b.position.set(y.x+w*(y.radius+.7),Na,y.z+T*(y.radius+.7)),a.add(b),s.push(b)}}return a.visible=i.enabled,{group:a,setVisible(S){a.visible=S},setLabelsVisible(S){for(const w of s)w.visible=S},dispose(){for(const S of c)S.dispose();for(const S of r)S.dispose();for(const S of o)S.dispose();a.clear()}}}const $e={grass:8,groundArea:12,ringHalo:20,ring:22,ringMeter:24,ringWarn:26,groundFx:30,trail:40,slash:44,projectileTrail:46,projectile:48,projectileGlow:50};function Cl(n,t){n.renderOrder=t,n.traverse(e=>{e.renderOrder=t})}function Dl(n,t,e){const i=Array.from({length:t.count},()=>{const a=new Sn({color:t.color,transparent:!0,opacity:0,side:je,depthWrite:!1,...t.blending?{blending:t.blending}:{}}),s=new ve(t.geometry,a);return s.rotation.x=-Math.PI/2,s.renderOrder=t.renderOrder,s.visible=!1,n.add(s),{mesh:s,mat:a,life:0,base:1,delay:0}});return{entries:i,spawn(a,s,o,r,c){const l=i.find(d=>d.life<=0)??i[0];c!=null&&c.color&&l.mat.color.set(c.color),l.mesh.position.set(a,e(a,s,o)+t.yOffset,s),l.base=r,l.mesh.scale.setScalar(r*t.scaleFrom),l.mesh.visible=!0,l.mat.opacity=t.spawnOpacity,l.life=t.duration,l.delay=(c==null?void 0:c.delay)??0},update(a){for(const s of i){if(s.life<=0)continue;if(s.delay>0){s.delay-=a;continue}s.life-=a;const o=Math.max(0,s.life/Math.max(t.duration,1e-6));s.mesh.scale.setScalar(s.base*(t.scaleFrom+t.scaleSpan*(1-Math.pow(o,t.growPow)))),s.mat.opacity=t.peak*Math.pow(o,t.fadePow),s.life<=0&&(s.mesh.visible=!1)}},live(){return i.filter(a=>a.life>0)},dispose(){for(const a of i)a.mat.dispose()}}}function H2(n,t,e,i){const a=t.dash,s={count:6,geometry:new Os(a.ringRadius-.06,a.ringRadius,28),color:"#ffffff",renderOrder:$e.groundFx,duration:a.fxDuration,peak:.9,fadePow:1,scaleFrom:.6,scaleSpan:1.2,growPow:1,yOffset:.04,spawnOpacity:.9},o=Dl(n,s,i),r=t.links,c={count:5,geometry:new Os(r.ringRadius-.07,r.ringRadius,28),color:r.chargeColor,renderOrder:$e.groundFx,duration:r.fxDuration,peak:.85,fadePow:1,scaleFrom:.55,scaleSpan:1.1,growPow:1,yOffset:.05,spawnOpacity:.85},l=Dl(n,c,i),d=t.groundSlam,u={count:4,geometry:new Os(.78,1,56),color:d.color,blending:Ji,renderOrder:$e.groundFx+1,duration:d.duration,peak:.85,fadePow:1.3,scaleFrom:.35,scaleSpan:.65,growPow:1.8,yOffset:.035,spawnOpacity:0},h=Dl(n,u,i);let f=e.dash.id,m="none",v=e.playerLink.id,g=e.playerLink.hitIds.length,p=e.combat.slamAttackId,_=0;return{update(x,y,S){var R;const w=x.character;if(x.dash.id!==f){f=x.dash.id;const b=x.dash;m=b.kind,b.kind==="blink"?(o.spawn(b.fromX,b.fromZ,w.position.y,.9,{color:a.blinkColor}),o.spawn(b.toX,b.toZ,w.position.y,1.35,{color:a.blinkColor})):o.spawn(b.fromX,b.fromZ,w.position.y,1.1,{color:a.rollColor})}if(o.update(y),x.combat.slamAttackId!==p&&(p=x.combat.slamAttackId,_+=1,d.enabled)){const b=(R=x.config.combat.weapons[x.combat.weapon])==null?void 0:R.groundSlam,M=Math.max(.6,(b==null?void 0:b.radius)??2.2);h.spawn(w.position.x,w.position.z,w.position.y,M,{delay:0}),h.spawn(w.position.x,w.position.z,w.position.y,M*d.outerScale,{delay:d.delay}),S(d.shake)}h.update(y);const T=x.playerLink;T.id!==v&&(v=T.id,g=T.hitIds.length,l.spawn(w.position.x,w.position.z,w.position.y,1)),T.hitIds.length>g?(g=T.hitIds.length,l.spawn(w.position.x,w.position.z,w.position.y,1.35)):T.hitIds.length<g&&(g=T.hitIds.length),l.update(y)},slamDebug(){return{spawns:_,lastId:p,live:h.live().map(x=>({life:x.life,scale:x.mesh.scale.x,opacity:x.mat.opacity,visible:x.mesh.visible}))}},groundOrder(){var x;return((x=h.entries[0])==null?void 0:x.mesh.renderOrder)??$e.groundFx+1},activeDash(){return o.live().length},dashKind(){return m},dispose(){o.dispose(),l.dispose(),h.dispose();for(const x of[s.geometry,c.geometry,u.geometry])x.dispose()}}}const wh=64,y0=[0,.24,.76,1],G2=[0,1,1,0],M0=[0,.12,.28,.5,.72,.88,1],X2=[0,.16,.5,1,.5,.16,0];function up(n,t){if(t<=1e-6)return 1;const e=Math.min(1,Math.max(0,n/t));return e*e*(3-2*e)}function Eh(n,t,e,i,a=wh,s="band"){const o=Math.max(.001,n-t*.5),r=Math.max(o+.001,n+t*.5),c=s==="glow"?M0:y0,l=s==="glow"?X2:G2,d=c.length,u=a+1,h=new Float32Array(u*d*3),f=new Float32Array(u*d*4),m=[];for(let g=0;g<u;g++){const p=g/a,_=(p-.5)*e,x=up(p,i)*up(1-p,i),y=Math.sin(_),S=Math.cos(_);for(let w=0;w<d;w++){const T=o+(r-o)*c[w],R=g*d+w;h[R*3]=y*T,h[R*3+1]=0,h[R*3+2]=S*T;const b=x*l[w];f[R*4]=1,f[R*4+1]=1,f[R*4+2]=1,f[R*4+3]=b}}for(let g=0;g<a;g++)for(let p=0;p<d-1;p++){const _=g*d+p,x=_+d;m.push(_,x,_+1,_+1,x,x+1)}const v=new en;return v.setAttribute("position",new wn(h,3)),v.setAttribute("color",new wn(f,4)),v.setIndex(m),v.computeBoundingSphere(),v}function Ll(n){const t=new Sn({color:n.color,transparent:!0,opacity:n.opacity,depthWrite:!1,side:je,vertexColors:!0,toneMapped:!1}),e=new Map;let i=null;const a=(c,l)=>{const d=Math.round(c*32)/32,u=Math.max(.05,Math.round(l*20)/20),h=`${Math.round(d*32)}|${Math.round(u*20)}`,f=e.get(h);if(f)return f;const m=Eh(n.radius,n.thickness*u,d,n.edgeFade,wh,n.profile??"band");if(e.set(h,m),e.size>64){for(const[v,g]of e)if(v!==h&&g!==i){g.dispose(),e.delete(v);break}}return m};i=a(n.arcRad,1);const s=new ve(i,t);s.position.y=n.y,s.renderOrder=n.renderOrder??4;let o=n.arcRad,r=1;return{mesh:s,update(c,l,d,u,h,f=1){const m=Math.max(.05,f);(Math.abs(c-o)>.01||Math.abs(m-r)>.01)&&(i=a(c,m),s.geometry=i,o=c,r=m),t.opacity=l,t.color.copy(u),s.scale.set(d,1,d),s.rotation.y=h,s.visible=l>.002},arcRad(){return o},dispose(){for(const c of e.values())c.dispose();e.clear(),t.dispose()}}}function fp(n,t){return Math.max(.05,n*.5*Math.max(.1,t))}function V2(n,t,e,i,a){const s=a.arcDeg*Math.PI/180,o=a.playerOpacity;if(!n)return{arcRad:s,opacity:o,scale:1,level:0};const r=Math.min(1,Math.max(0,t)),c=Math.min(1,Math.max(0,e)),l=a.selectedArcDeg*Math.PI/180,d=s+(l-s)*(.35+.65*r),u=4+4*r+6*c,h=.5+.5*Math.sin(i*u),f=Math.min(.95,o+(.2+.1*c)*r+.04*h),m=1+.02*r+.012*h*r;return{arcRad:d,opacity:f,scale:m,level:r}}function W2(n,t,e,i,a){const s=Math.min(1,Math.max(0,a));return s<=.001?n.copy(t):s<.5?n.copy(t).lerp(e,s*2):n.copy(e).lerp(i,(s-.5)*2)}function Y2(n=64,t=.06,e=5){const i=n+1,a=e+1,s=new Float32Array(i*a*3),o=new Float32Array(i*a*4),r=[];for(let l=0;l<i;l++){const d=l/n*Math.PI*2,u=Math.sin(d),h=Math.cos(d);for(let f=0;f<a;f++){const m=f/e,v=t+(1-t)*m,g=l*a+f;s[g*3]=u*v,s[g*3+1]=0,s[g*3+2]=h*v;const p=Math.pow(1-m,1.8)*.9+(f===0?.1:0);o[g*4]=1,o[g*4+1]=1,o[g*4+2]=1,o[g*4+3]=Math.min(1,p)}}for(let l=0;l<n;l++)for(let d=0;d<e;d++){const u=l*a+d,h=u+a;r.push(u,h,u+1,u+1,h,h+1)}const c=new en;return c.setAttribute("position",new wn(s,3)),c.setAttribute("color",new wn(o,4)),c.setIndex(r),c.computeBoundingSphere(),c}function pp(n){const t=n.segments??wh,e=n.profile??"band",a=((e==="glow"?M0.length:y0.length)-1)*6,s=Eh(n.radius,n.thickness,n.arcRad,n.edgeFade,t,e),o=new Sn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:je,vertexColors:!0,toneMapped:!1}),r=new ve(s,o);r.position.y=n.y,r.renderOrder=n.renderOrder??7,r.visible=!1,s.setDrawRange(0,0);let c=0;return{mesh:r,set(l,d,u,h,f=1){const m=Math.min(1,Math.max(0,l)),v=Math.round(m*t),g=m>.001?Math.max(1,v)*a:0;g!==s.drawRange.count&&s.setDrawRange(0,g),c=v,o.opacity=d,o.color.copy(u),r.scale.set(f,1,f),r.rotation.y=h,r.visible=d>.002&&m>.001},ratio(){return t>0?c/t:0},filledSegments(){return c},dispose(){s.dispose(),o.dispose()}}}function mp(n){const t=new ge,e=Y2(48),i=new Sn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:je,vertexColors:!0,toneMapped:!1}),a=new ve(e,i);a.renderOrder=n.renderOrder??2,t.add(a);const s=Math.max(.01,n.edgeWidthRatio??.045),o=Eh(1-s*.5,s,Math.PI*2,0,64,"band"),r=new Sn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:je,vertexColors:!0,toneMapped:!1}),c=new ve(o,r);return c.renderOrder=(n.renderOrder??2)+1,t.add(c),t.position.y=n.y,{group:t,set(l,d,u,h,f,m){const v=Math.min(1,Math.max(0,f));t.position.set(l,u,d),a.scale.set(h,1,h),c.scale.set(h,1,h),i.opacity=v*.26,r.opacity=v*(.72+.18*Math.sin(m*7)),t.visible=v>.004},dispose(){e.dispose(),i.dispose(),o.dispose(),r.dispose()}}}function gp(n,t,e,i){if(i<=1e-4||e<=0)return t;const a=1-Math.exp(-e/i);return n+(t-n)*a}function $2(n,t,e){if(n!=="windup")return{active:!1,ratio:0,urgency:0};const i=Math.max(1e-4,e),a=Math.min(1,Math.max(0,t/i));return{active:!0,ratio:a,urgency:.35+.65*a}}function Z2(n){if(n.charging)return{source:"charge",ratio:Math.min(1,Math.max(0,n.charge))};if(n.channeling){if(n.channelProgress!==void 0)return{source:"channel",ratio:Math.min(1,Math.max(0,n.channelProgress))};const i=Math.max(1e-4,n.fireInterval);return{source:"channel",ratio:1-Math.min(1,Math.max(0,n.fireTimer/i))}}const t=n.arcaneCooldown??0,e=n.arcaneCooldownMax??0;return t>0&&e>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,t/e))}:n.dashCooldown>0&&n.dashCooldownMax>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,n.dashCooldown/n.dashCooldownMax))}:{source:"none",ratio:0}}function j2(n,t,e,i,a,s){return n!=="windup"||a<=.05?{active:!1,x:t,z:e,radius:0}:{active:!0,x:t+Math.sin(i)*a,z:e+Math.cos(i)*a,radius:Math.max(.3,s)}}function q2(n,t){const e=Math.max(.02,t),i=Math.min(1,Math.max(0,n/e));return{scale:.06+.94*(1-Math.pow(1-i,3)),alpha:i}}function K2(n,t,e){return n?t:e}function _0(n){return{x:0,y:0,z:1}}function J2(n){return Math.asin(_0().y)}function Q2(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}const tR=.15,eR=-.032,nR=[.255,.175,.095,.025],xp=[[.428,.342],[.482,.092],[.442,-.168],[.318,-.398]],iR=[{L1:.38,L2:.32},{L1:.4,L2:.34},{L1:.42,L2:.36},{L1:.46,L2:.4}],Ur=.09,aR=.42,In={carapaceTop:"#4a4066",mark:"#6b5a9e",leg:"#5d4f82",joint:"#8b7ab8",tarsus:"#463a63",mouth:"#1a1626",eyeMain:"#e0395a",eyeSub:"#b8712e"};function sR(n,t,e,i,a){const s=Math.hypot(n,e),o=-t,r=Math.atan2(n,e),c=(i+a)*.999,l=Math.abs(i-a)+.002,d=Math.hypot(s,o),u=d>c||d<l,h=Math.min(Math.max(d,l),c),f=(i*i+h*h-a*a)/(2*i*h),m=Math.acos(Math.min(1,Math.max(-1,f))),g=Math.atan2(s,o)+m,p=i*Math.sin(g),_=i*Math.cos(g),x=Math.atan2(s-p,o-_);return{yaw:r,femurPitch:-g,tibiaPitch:-(x-g),clamped:u,reach:d/(i+a)}}function oR(n,t={}){const e={height:t.height??.32,lift:t.lift??.13,duty:t.duty??.55,strideRatio:t.strideRatio??.34,bob:t.bob??.006,scale:t.scale??1},i=new Map,a=new Map,s=(A,E=0)=>{const z=`${A}|${E}`;let G=i.get(z);return G||(G=new Oi({color:A}),E>0&&(G.emissive=new Qt(A),G.emissiveIntensity=E),i.set(z,G)),G},o=(A,E,z)=>{const G=`${A.toFixed(3)},${E.toFixed(3)},${z.toFixed(3)}`;let X=a.get(G);return X||(X=new qn(A,E,z),a.set(G,X)),X},r=(A,E,z,G,X=0)=>{const et=new ve(o(A,E,z),s(G,X));return et.castShadow=!0,et.receiveShadow=!0,et},c=new ge;c.name="spider-root",c.scale.setScalar(e.scale);const l=new ge;l.name="spider-body",l.position.y=e.height,c.add(l);const d=new ge;d.name="carapace",d.position.set(0,0,.15),l.add(d);const u=[[.3,.036,.3,-.03,"#382f4e"],[.292,.042,.292,.008,"#403758"],[.268,.038,.268,.046,"#473d61"],[.228,.03,.228,.078,"#4e4369"]];for(const[A,E,z,G,X]of u){const et=r(A,E,z,X);et.position.y=G,d.add(et)}const h=[[.03,.098,.226,.026,In.eyeMain,.95],[.076,.095,.204,.017,In.eyeSub,.3],[.032,.098,.17,.014,In.eyeSub,.22],[.068,.094,.15,.013,In.eyeSub,.2]];for(const[A,E,z,G,X,et]of h)for(const ht of[-1,1]){const gt=r(G,G,G*.5,X,et);gt.position.set(ht*A,E,z),gt.castShadow=!1,d.add(gt)}for(const A of[-1,1]){const E=r(.05,.092,.05,In.mouth);E.position.set(A*.046,-.062,.152),E.rotation.x=.34,d.add(E);const z=r(.02,.046,.02,"#0f0c18");z.position.set(A*.046,-.118,.132),z.rotation.x=.95,d.add(z);const G=r(.036,.095,.036,In.leg);G.position.set(A*.092,-.03,.14),G.rotation.set(.62,0,A*.16),d.add(G);const X=r(.028,.078,.028,In.leg);X.position.set(A*.112,-.104,.192),X.rotation.x=.1,d.add(X)}const f=r(.105,.075,.095,"#231e33");l.add(f);const m=new ge;m.name="abdomen",m.position.set(0,0,-.238),m.rotation.x=.045,l.add(m);const v=[[.29,.03,.35,-.078,"#4a3d62"],[.33,.034,.404,-.046,"#4c3f64"],[.356,.036,.436,-.011,"#4e4166"],[.37,.038,.454,.026,"#50426b"],[.374,.038,.458,.064,"#51436c"],[.358,.036,.436,.101,"#53456e"],[.324,.032,.392,.135,"#554771"],[.27,.026,.324,.164,"#574974"]];for(const[A,E,z,G,X]of v){const et=r(A,E,z,X);et.position.y=G,m.add(et)}const g=r(.07,.038,.042,"#231e33");g.position.set(0,-.07,-.238),m.add(g);const p=r(.02,.006,.15,In.mark);p.position.set(0,.179,.004),m.add(p);const _=r(.016,.005,.082,In.mark);_.position.set(0,.147,.01),m.add(_);const x=[];for(let A=0;A<8;A++){const E=A<4?-1:1,z=A%4,{L1:G,L2:X}=iR[z],et=new ge;et.name=`hip-${A}`,et.rotation.order="YXZ",et.position.set(E*tR,eR,nR[z]),l.add(et);const ht=r(.084,.074,.084,In.joint);ht.position.x=E*.014,et.add(ht);const gt=r(.07,.062,.096,In.carapaceTop);gt.position.set(E*-.052,.012,0),et.add(gt);const Lt=new ge;Lt.rotation.order="YXZ",et.add(Lt);const Z=[[.07,.4,.2],[.062,.34,.63],[.052,.28,.88]];for(const[V,O,Pt]of Z){const Et=r(V,G*O,V,In.leg);Et.position.y=-G*Pt,Lt.add(Et)}const B=new ge;B.rotation.order="YXZ",B.position.y=-G,Lt.add(B);const Y=r(.072,.054,.072,In.joint);B.add(Y);const q=[[.052,.4,.22],[.045,.34,.63],[.036,.28,.88]];for(const[V,O,Pt]of q){const Et=r(V,X*O,V,In.leg);Et.position.y=-X*Pt,B.add(Et)}const K=new ge;K.position.y=-X,B.add(K);const st=r(.046,.042,.046,In.joint);K.add(st);const Tt=r(.03,Ur,.03,In.tarsus);Tt.position.y=-Ur/2,K.add(Tt);const Gt=r(.042,.018,.042,"#15121f");Gt.position.y=-Ur,K.add(Gt);const J=(A<4?0:1)^A%2;x.push({index:A,side:E,k:z,hip:et,femur:Lt,tibia:B,tarsus:K,L1:G,L2:X,home:new W(E*xp[z][0],0,xp[z][1]),phaseOffset:J*.5,foot:new W,from:new W,to:new W,swinging:!1,clamped:!1,reach:0})}const y=new W,S=new W,w=new W;let T=0,R=0,b=0,M=0,C={maxReach:0,clamped:0,phase:0,strideUsed:0,gaitSpeed:0,effSpeed:0,slide:0,dt:0,probe:{bx:0,bz:0,f0x:0,f0z:0,d0:0}},k=!1;const D=(A,E,z,G)=>(E.set(A.home.x*G,0,A.home.z*G),c.localToWorld(E),E.y=z,E);return{group:c,update:(A,E,z,G)=>{const X=Math.min(Math.max(G,0),.05);if(X<=0)return;c.updateWorldMatrix(!0,!1),c.updateMatrixWorld(!0),l.getWorldDirection(w),w.y=0,w.lengthSq()<1e-8&&w.set(0,0,1),w.normalize();const et=Math.atan2(w.x,w.z);let ht=et-R;for(;ht>Math.PI;)ht-=Math.PI*2;for(;ht<-Math.PI;)ht+=Math.PI*2;R=et;const gt=Math.hypot(A.velocity.x,A.velocity.z),Lt=Math.abs(ht)/X*aR,Z=.45,B=Math.max(.6,1/(1+Lt*1.1)),Y=Math.min(A.stride*e.strideRatio,Z)*B,q=gt+Lt,st=Math.min(q,7.5*Y);q>.02&&(T=(T+st/Math.max(Y,.15)*X)%1);const Tt=Math.max(0,q-st)*X,Gt=A.position.y,J=A.grounded?0:1;b+=(J-b)*Math.min(1,X*9);const V=1-.22*b;let O=0,Pt=0;if(!k){k=!0;for(const lt of x)D(lt,lt.foot,Gt,V),lt.from.copy(lt.foot),lt.to.copy(lt.foot),lt.swinging=!1}for(const lt of x){const vt=(T+lt.phaseOffset)%1;if(vt<e.duty)lt.swinging=!1,Tt>0&&lt.foot.addScaledVector(w,Tt),q<.02?(D(lt,y,Gt,V),lt.foot.lerp(y,Math.min(1,X*5))):b>.01&&(D(lt,y,Gt,V),lt.foot.lerp(y,Math.min(1,X*6)));else{const Rt=(vt-e.duty)/(1-e.duty);lt.swinging||(lt.swinging=!0,lt.from.copy(lt.foot),D(lt,lt.to,Gt,V),lt.to.addScaledVector(w,Y*e.duty));const L=Rt*Rt*(3-2*Rt);lt.foot.lerpVectors(lt.from,lt.to,L),lt.foot.y=Gt+Math.sin(Math.PI*Rt)*e.lift}S.copy(lt.foot),S.y+=Ur*.98,l.worldToLocal(S),S.sub(lt.hip.position);const ft=sR(S.x,S.y,S.z,lt.L1,lt.L2);lt.hip.rotation.y=ft.yaw,lt.femur.rotation.x=ft.femurPitch,lt.tibia.rotation.x=ft.tibiaPitch,lt.tarsus.rotation.x=-(ft.femurPitch+ft.tibiaPitch)-.1,lt.clamped=ft.clamped,lt.reach=ft.reach,ft.reach>O&&(O=ft.reach),ft.clamped&&Pt++}M+=X*7.5*Math.min(1,q/1.4),l.position.y=e.height+Math.sin(M)*e.bob*Math.min(q,1.4)-b*.02;const Et=l.getWorldPosition(y);C={maxReach:O,clamped:Pt,phase:T,strideUsed:Y,gaitSpeed:st,effSpeed:q,slide:Tt/Math.max(X,1e-6),dt:X,probe:{bx:+Et.x.toFixed(2),bz:+Et.z.toFixed(2),f0x:+x[0].foot.x.toFixed(2),f0z:+x[0].foot.z.toFixed(2),d0:+x[0].foot.distanceTo(Et).toFixed(2)}}},legs:()=>x.map(A=>({x:A.foot.x,y:A.foot.y,z:A.foot.z,swinging:A.swinging,reach:A.reach})),debug:()=>C,dispose(){a.forEach(A=>A.dispose()),i.forEach(A=>A.dispose()),a.clear(),i.clear(),c.clear()}}}const rR=Math.PI/3;function vp(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function cR(){let n=0,t=!1;return{update(e,i,a,s=rR){if(!Number.isFinite(e))return n;if(!t)return t=!0,n=e,n;if(!(a>0)||!(i>0))return n=e,n;const o=vp(e-n);if(Math.abs(o)>=s)return n=e,n;const r=1-Math.exp(-i/(a/1e3));return n=vp(n+o*r),n},reset(e){t=!0,n=e},get value(){return n},get ready(){return t}}}function lR(n){const t=Math.max(2,Math.floor(n.maxSamples)),e=new en,i=new Float32Array(t*2*3),a=new Float32Array(t*2*3),s=new wn(i,3),o=new wn(a,3);s.setUsage(Ro),o.setUsage(Ro),e.setAttribute("position",s),e.setAttribute("color",o);const r=[];for(let x=0;x<t-1;x++){const y=x*2,S=y+1,w=y+2,T=y+3;r.push(y,S,w,S,T,w)}e.setIndex(r),e.setDrawRange(0,0);const c=new Sn({vertexColors:!0,transparent:!0,opacity:1,blending:Ji,depthWrite:!1,side:je}),l=new ve(e,c);l.frustumCulled=!1,l.renderOrder=6,l.visible=!1;const d=new Qt(n.color);let u=[],h=null,f=0,m=0,v=!1,g=!1,p=0;function _(){const x=u.length;if(x<2||!n.enabled){l.visible=!1,e.setDrawRange(0,0);return}const y=Math.max(.001,n.life);for(let S=0;S<x;S++){const w=u[S],T=Math.max(0,1-w.age/y),R=T*T,b=Math.min(1,w.speed/Math.max(.001,n.minSpeed*2)),M=n.intensity*R*(.55+.45*b)*(1+p),C=.18+.82*T,k=S*6;i[k]=w.tx+(w.bx-w.tx)*C,i[k+1]=w.ty+(w.by-w.ty)*C,i[k+2]=w.tz+(w.bz-w.tz)*C,i[k+3]=w.tx,i[k+4]=w.ty,i[k+5]=w.tz;const D=d.r*M,F=d.g*M,A=d.b*M,E=D*.22,z=F*.22,G=A*.22;a[k]=E,a[k+1]=z,a[k+2]=G;const X=1+n.tipBoost;a[k+3]=Math.min(1,D*X),a[k+4]=Math.min(1,F*X),a[k+5]=Math.min(1,A*X)}s.needsUpdate=!0,o.needsUpdate=!0,e.setDrawRange(0,(x-1)*6),l.visible=!0}return{object:l,update(x,y,S){if(!n.enabled){l.visible=!1;return}const w=Math.max(0,x);p*=Math.exp(-Math.max(1,n.pulseDecay??14)*w),p<.001&&(p=0);for(const T of u)T.age+=w;for(;u.length>0&&u[0].age>n.life;)u.shift();if(y){const T=h?Math.hypot(y.tip.x-h.x,y.tip.y-h.y,y.tip.z-h.z)/Math.max(1e-4,w):0,R=u[u.length-1],b=R?Math.hypot(y.tip.x-R.tx,y.tip.y-R.ty,y.tip.z-R.tz):1/0;if(S&&b>=n.minStep)for(u.push({bx:y.base.x,by:y.base.y,bz:y.base.z,tx:y.tip.x,ty:y.tip.y,tz:y.tip.z,age:0,speed:T});u.length>t;)u.shift();h={x:y.tip.x,y:y.tip.y,z:y.tip.z},f=T,m=b,v=!0}else h=null,v=!1,f=0,m=0;g=S,_()},debug(){return{count:u.length,visible:l.visible,speed:f,moved:m,hasBlade:v,active:g,pulse:p}},pulse(x){!Number.isFinite(x)||x<=0||(p=Math.min(1.5,p+x))},reset(){u=[],h=null,p=0,l.visible=!1,e.setDrawRange(0,0)},dispose(){e.dispose(),c.dispose()}}}const dR=`#include <common>
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
}`,hR=`vec4 mvPosition = vec4( transformed, 1.0 );
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
  float tUp  = theta * ${tv.toFixed(2)};

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
gl_Position = projectionMatrix * mvPosition;`,uR=`#include <common>
varying float vWindShade;`,fR=`#include <color_fragment>
diffuseColor.rgb *= vWindShade;`;function pR(n,t,e,i,a){const s=Math.min(e.blades.length,Math.floor(Math.max(0,i.maxInstances)/2)),o=s*2,r=new Float32Array(o*2),c=new Float32Array(o*3),l=new Float32Array(o*4),d=Math.max(.01,i.segmentHeight);for(let f=0;f<s;f++){const m=e.blades[f],v=Math.min(d,m.height),g=Math.max(0,m.height-v),[p,_]=Jx(a,m.x,m.z,m.yaw*a.jitter),x=Math.min(1.4,Math.max(.6,m.height/(d*1.5)));for(let y=0;y<2;y++){const S=f*2+y;r[S*2]=p,r[S*2+1]=_,c[S*3]=m.x,c[S*3+1]=m.y,c[S*3+2]=m.z,l[S*4]=v,l[S*4+1]=g,l[S*4+2]=x,l[S*4+3]=y}}t.setAttribute("aWindPhase",new Co(r,2)),t.setAttribute("aWindRoot",new Co(c,3)),t.setAttribute("aWindGeom",new Co(l,4));const u=$p(a),h={uWindTime:{value:0},uWindDir:{value:new Wt(u.dirX,u.dirZ)},uWindOmega:{value:new Wt(u.omega1,u.omega2)},uWindAmp:{value:new Wt(u.amp1,u.amp2)},uWindGust:{value:1},uWindShade:{value:u.shadeAmount},uWindOn:{value:a.enabled?1:0}};return n.onBeforeCompile=f=>{Object.assign(f.uniforms,h),f.vertexShader=f.vertexShader.replace("#include <common>",dR).replace("#include <project_vertex>",hR),f.fragmentShader=f.fragmentShader.replace("#include <common>",uR).replace("#include <color_fragment>",fR)},n.customProgramCacheKey=()=>"grass-wind-pivot-v2",h}function mR(n){let t=n>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function gR(n,t,e=No){const i=new ge;i.name="grass-layer";const s=n.blades.length,o=Math.max(0,Math.floor(t.maxInstances)),r=Math.min(s,Math.floor(o/2)),c=r*2,l=t.enabled&&c>0,u=(t.palette.length>0?t.palette:["#4a8f57"]).map(O=>new Qt(O)),h=new Qt(t.stumpColor),f=new Qt(t.debris.color),m=new qn(1,1,1),v=new qn(1,1,1),g=new Oi({color:16777215,transparent:!1}),p=pR(g,v,n,t,e),_=new Oi({color:f,transparent:!1});let x=null,y=null,S=null;const w=[],T=mR(2654435769^r),R=new Float32Array(r),b=new Uint8Array(r),M=new Float32Array(r),C=new Uint8Array(r).fill(1),k=new Ce,D=new Ma,F=new Ma,A=new Ma,E=new W,z=new W,G=new W,X=new W,et=new Qt,ht=new Qt,gt=new Ce().makeScale(0,0,0);let Lt=0,Z=0,B=0,Y=0,q=1,K=1;const st=8;let Tt={enabled:e.enabled,time:0,gust:1,mode:"pivot"};function Gt(O,Pt){if(u.length===1)return Pt.copy(u[0]);const Et=Math.max(0,Math.min(u.length-1,O*(u.length-1))),lt=Math.min(u.length-2,Math.max(0,Math.floor(Et)));return Pt.copy(u[lt]).lerp(u[lt+1],Math.min(1,Math.max(0,Et-lt)))}if(l){x=new Xf(v,g,c),x.instanceMatrix.setUsage(Ro),x.castShadow=!1,x.receiveShadow=!0,x.frustumCulled=!1,x.name="grass-blades",x.setColorAt(0,u[0]),y=x.instanceColor,y&&y.setUsage(Ro);for(let Pt=0;Pt<c;Pt++)x.setMatrixAt(Pt,gt);i.add(x);const O=Math.max(1,Math.floor(t.debris.max));S=new Xf(m,_,O),S.instanceMatrix.setUsage(Ro),S.castShadow=!1,S.receiveShadow=!1,S.frustumCulled=!1,S.name="grass-debris";for(let Pt=0;Pt<O;Pt++)S.setMatrixAt(Pt,gt);i.add(S)}i.visible=l;function J(O,Pt,Et,lt,vt,ft){if(!S)return;const Rt=S.count;if(w.length>=Rt)return;const L=t.debris.life,P=1.1+T()*1.5;w.push({x:O,y:Pt,z:Et,vx:lt*P+(T()-.5)*1.2,vy:1.9+T()*1.8,vz:vt*P+(T()-.5)*1.2,life:L,total:L,size:ft*(.55+T()*.45),spin:(T()-.5)*9})}function V(O){if(!S)return;const Pt=S.count,Et=12;for(let vt=w.length-1;vt>=0;vt--){const ft=w[vt];if(ft.life-=O,ft.life<=0){w.splice(vt,1);continue}ft.vy-=Et*O,ft.x+=ft.vx*O,ft.y+=ft.vy*O,ft.z+=ft.vz*O,ft.y<.02&&(ft.y=.02,ft.vy=-ft.vy*.25,ft.vx*=.6,ft.vz*=.6)}const lt=1e-4;for(let vt=0;vt<Pt;vt++){const ft=w[vt];if(!ft){S.setMatrixAt(vt,gt);continue}const Rt=Math.max(lt,ft.life/ft.total);z.set(ft.x,ft.y,ft.z),E.set(.4+vt*.13,1,.2).normalize(),D.setFromAxisAngle(E,ft.spin*(ft.total-ft.life)),G.set(ft.size*Rt,ft.size*.7*Rt,ft.size*Rt),k.compose(z,D,G),S.setMatrixAt(vt,k)}S.instanceMatrix.needsUpdate=!0}return{object:i,update(O,Pt){var pt,Ht,Nt;if(!l||!x)return;const Et=O.grass,lt=((pt=O.config.grass)==null?void 0:pt.wind)??No,vt=$p(lt),ft=((Ht=Et.wind)==null?void 0:Ht.time)??0,Rt=((Nt=Et.wind)==null?void 0:Nt.gust)??1;p.uWindTime.value=ft,p.uWindGust.value=Rt,p.uWindDir.value.set(vt.dirX,vt.dirZ),p.uWindOmega.value.set(vt.omega1,vt.omega2),p.uWindAmp.value.set(vt.amp1,vt.amp2),p.uWindShade.value=vt.shadeAmount,p.uWindOn.value=lt.enabled?1:0,Tt={enabled:lt.enabled,time:ft,gust:Rt,mode:"pivot"};const L=Math.min(r,Et.blades.length),P=Math.min(.05,Math.max(0,Pt)),Q=O.config.grass,mt=(Q==null?void 0:Q.regrowSec)??0,ot=Math.min(1,Math.max(.05,(Q==null?void 0:Q.stumpRatio)??.34)),dt=t.segmentHeight,zt=Math.PI*2;x.instanceMatrix.clearUpdateRanges(),y&&y.clearUpdateRanges();let Ct=0,St=0,Yt=0,xt=0,Ut=0,tt=0,j=0;for(let It=0;It<L;It++){const U=Et.blades[It],bt=U.cut!==0?1:0,$=U.yaw/zt,ut=ev(U.cut,mt,$),Ft=Math.min(dt,U.height),Dt=Ft*ot,qt=Dt+(U.height-Dt)*ut;if(It<st&&(tt+=qt/Math.max(1e-6,U.height),j+=1),ut>.001&&ut<1-.001&&(xt+=1,Ut+=ut),!(C[It]===1||Math.abs(U.bend-R[It])>1e-4||bt!==b[It]||Math.abs(ut-M[It])>.001)){U.bend>.02&&(St+=1),bt&&(Yt+=1);continue}bt&&!b[It]&&C[It]!==1&&(J(U.x,U.y+Ft*.75,U.z,U.bendX||1,U.bendZ||0,U.width*1.5),J(U.x,U.y+Ft+(U.height-Ft)*.5,U.z,U.bendX||1,U.bendZ||0,U.width*1.2)),E.set(Math.cos(U.yaw),0,-Math.sin(U.yaw)),A.setFromAxisAngle(E,U.lean),E.set(U.bendZ,0,-U.bendX),F.setFromAxisAngle(E,U.bend),D.copy(F).multiply(A),X.set(U.x,U.y,U.z);const de=Math.min(dt,qt),ee=Math.max(0,qt-dt);z.set(0,de*.5,0).applyQuaternion(D).add(X),G.set(U.width,de,U.width),k.compose(z,D,G),x.setMatrixAt(It*2,k),ee<1e-4?x.setMatrixAt(It*2+1,gt):(z.set(0,de+ee*.5,0).applyQuaternion(D).add(X),G.set(U.width*.84,ee,U.width*.84),k.compose(z,D,G),x.setMatrixAt(It*2+1,k)),Gt(U.tone,ht),ut>=1?et.copy(ht):et.copy(h).lerp(ht,ut),x.setColorAt(It*2,et),x.setColorAt(It*2+1,et),x.instanceMatrix.addUpdateRange(It*32,32),y&&y.addUpdateRange(It*6,6),R[It]=U.bend,b[It]=bt,M[It]=ut,C[It]=0,Ct+=1,U.bend>.02&&(St+=1),bt&&(Yt+=1)}Ct>0&&(x.instanceMatrix.needsUpdate=!0,y&&(y.needsUpdate=!0)),V(P),Lt=Ct,Z=St,B=Yt,Y=xt,q=xt>0?Ut/xt:1,K=j>0?tt/j:1},debug(){return{enabled:l,blades:s,patches:n.patches.length,instances:c,drawCalls:l?2:0,dirty:Lt,bent:Z,cut:B,debris:w.length,growing:Y,avgGrowth:q,sampleHeight:K,wind:{...Tt}}},dispose(){m.dispose(),v.dispose(),g.dispose(),_.dispose(),i.clear()}}}const kl=10,xR=.14,Eo=1e-6;function _o(n,t,e){return n<t?t:n>e?e:n}function yp(n,t,e,i){const a=t.length,s=[],o=(d,u,h)=>{s.push(d[0],d[1],d[2],u[0],u[1],u[2],h[0],h[1],h[2])},r=(d,u)=>{const h=u/a*Math.PI*2;return[Math.cos(h)*n,d,Math.sin(h)*n]};for(let d=0;d<a;d++){const u=(d+1)%a,h=r(t[d],d),f=r(t[u],u),m=r(e[d],d),v=r(e[u],u);o(h,f,v),o(h,v,m)}const c=a*6;if(i!=="none"){const d=i==="b"?e:t;let u=0;for(let h=0;h<a;h++)u+=d[h];u/=a;for(let h=0;h<a;h++){const f=(h+1)%a;o([0,u,0],r(d[h],h),r(d[f],f))}}const l=new en;return l.setAttribute("position",new Le(s,3)),l.addGroup(0,c,0),i!=="none"&&l.addGroup(c,a*3,1),l.computeVertexNormals(),l}function vR(n,t,e,i){const a={x:t.x-n.x,y:t.y-n.y,z:t.z-n.z},s={x:i.x-e.x,y:i.y-e.y,z:i.z-e.z},o={x:n.x-e.x,y:n.y-e.y,z:n.z-e.z},r=(v,g)=>v.x*g.x+v.y*g.y+v.z*g.z,c=r(a,a),l=r(s,s),d=r(s,o);let u=0,h=0;if(c<=Eo&&l<=Eo)u=0,h=0;else if(c<=Eo)u=0,h=_o(d/l,0,1);else{const v=r(a,o);if(l<=Eo)h=0,u=_o(-v/c,0,1);else{const g=r(a,s),p=c*l-g*g;u=p!==0?_o((g*d-v*l)/p,0,1):0,h=(g*u+d)/l,h<0?(h=0,u=_o(-v/c,0,1)):h>1&&(h=1,u=_o((g-v)/c,0,1))}}const f={x:n.x+a.x*u,y:n.y+a.y*u,z:n.z+a.z*u},m={x:e.x+s.x*h,y:e.y+s.y*h,z:e.z+s.z*h};return{dist:Math.hypot(f.x-m.x,f.y-m.y,f.z-m.z),cq:m}}function yR(n){const t=new ge;t.name="destructibles";const e=[];let i=null,a=null;for(const f of n){const m=new Oi({color:new Qt(f.color),side:je}),v=new Oi({color:new Qt(f.cutColor),side:je}),g=new ve(new en,[m,v]),p=new ve(new en,[m,v]);g.name=`lower-${f.id}`,p.name=`upper-${f.id}`;const _=new ge;_.add(p);const x=new ge;x.name=`piece-${f.id}`,x.position.set(f.x,f.y,f.z),x.add(g,_),t.add(x),e.push({id:f.id,root:x,lower:g,upperGroup:_,upper:p,bodyMat:m,capMat:v,key:""})}const s=(f,m)=>{const v=m.cutU*m.height,g=dv(m.radius,kl,m.cutU,m.height,m.nx,m.ny,m.nz),p=new Array(kl).fill(0),_=new Array(kl).fill(m.height),x=yp(m.radius,p,g,"b"),y=yp(m.radius,g.map(S=>S-v),_.map(S=>S-v),"a");f.lower.geometry.dispose(),f.upper.geometry.dispose(),f.lower.geometry=x,f.upper.geometry=y},o=new W;function r(f){for(let m=0;m<e.length;m++){const v=e[m];let g;for(let _=0;_<f.length;_++)if(f[_].id===v.id){g=f[_];break}if(!g){v.upperGroup.visible=!1;continue}const p=`${g.broken}|${g.cutU}|${g.theta}|${g.nx}|${g.ny}|${g.nz}`;p!==v.key&&(s(v,g),v.key=p),v.bodyMat.color.set(g.color),v.capMat.color.set(g.cutColor),v.root.position.set(g.x,g.y,g.z),v.upperGroup.visible=g.broken!==0,v.upperGroup.position.set(0,g.cutU*g.height,0),o.set(g.ax,g.ay,g.az),v.upperGroup.quaternion.setFromAxisAngle(o,g.fall)}}function c(f,m){const v=[],g=(p,_)=>{if(!p){_==="right"?i=null:a=null;return}const x={x:(p.base.x+p.tip.x)/2,y:(p.base.y+p.tip.y)/2,z:(p.base.z+p.tip.z)/2},y=_==="right"?i:a;if(_==="right"?i=x:a=x,!y)return;let S=p.tip.x-p.base.x,w=p.tip.y-p.base.y,T=p.tip.z-p.base.z;const R=x.x-y.x,b=x.y-y.y,M=x.z-y.z;Math.hypot(R,b,M)>.002&&(S=R,w=b,T=M);const k=Math.hypot(S,w,T);k>Eo?(S/=k,w/=k,T/=k):(S=0,w=0,T=1);const D={x:0,y:0,z:0},F={x:0,y:0,z:0};for(let A=0;A<f.length;A++){const E=f[A];if(E.broken!==0)continue;D.x=E.x,D.y=E.y,D.z=E.z,F.x=E.x,F.y=E.y+E.height,F.z=E.z;const z=vR(p.base,p.tip,D,F);if(!(z.dist>E.radius+xR)){v.push({id:E.id,x:z.cq.x,y:z.cq.y,z:z.cq.z,dx:S,dy:w,dz:T});break}}};return g(m.right,"right"),g(m.left,"left"),v}function l(){let f=0;const m=[],v=[];let g=0;for(const p of e)p.lower.visible&&(f+=1),p.upperGroup.visible&&(f+=1),v.push({id:p.id,x:p.root.position.x,y:p.root.position.y,z:p.root.position.z});for(const p of d)p.broken!==0&&(g+=1,m.push({id:p.id,cutU:p.cutU,theta:p.theta,nx:p.nx,ny:p.ny,nz:p.nz,fall:p.fall}));return{count:e.length,broken:g,drawCalls:f,positions:v,cuts:m}}let d=n;const u=f=>{d=f,r(f)};function h(){for(const f of e)f.lower.geometry.dispose(),f.upper.geometry.dispose(),f.bodyMat.dispose(),f.capMat.dispose();t.clear()}return u(n),{object:t,update:u,computeHits:c,debug:l,dispose:h}}function MR(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function _R(n,t,e,i,a){var se,ne,jt,ue,ie;const s=Math.max(1,n.clientWidth),o=Math.max(1,n.clientHeight),r=new cA({antialias:!0});r.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),r.shadowMap.enabled=!0,r.shadowMap.type=cm,r.setSize(s,o,!1),n.appendChild(r.domElement);const c=new lA;c.background=new Qt("#12161d"),c.add(new YA(11061486,2764600,1.15));const l=(t.gridMeta.minX+t.gridMeta.maxX)/2,d=(t.gridMeta.minZ+t.gridMeta.maxZ)/2,u=Math.max(t.gridMeta.maxX-t.gridMeta.minX,t.gridMeta.maxZ-t.gridMeta.minZ)/2+4,h=new jA(16773852,1.5);h.position.set(l+9,18,d+11),h.target.position.set(l,0,d),h.castShadow=!0,h.shadow.mapSize.set(2048,2048);const f=h.shadow.camera;f.left=-u,f.right=u,f.top=u,f.bottom=-u,f.near=1,f.far=90,c.add(h),c.add(h.target);const m=[],v=new ge;for(const H of t.boxes){const At=H.maxX-H.minX,_t=H.maxY-H.minY,Mt=H.maxZ-H.minZ;let te=MR(H.kind,e);H.kind==="step"&&(te=new Qt(te).offsetHSL(0,0,H.maxY*.09).getStyle());const Ot=new Oi({color:te,transparent:!1,opacity:1}),oe=new ve(new qn(At,_t,Mt),Ot);oe.position.set((H.minX+H.maxX)/2,(H.minY+H.maxY)/2,(H.minZ+H.maxZ)/2),oe.castShadow=H.kind!=="ground",oe.receiveShadow=!0,oe.add(new Zf(new AA(oe.geometry),new Nd({color:10467020,transparent:!0,opacity:.32}))),v.add(oe),m.push(Ot)}c.add(v);const g=t.gridMeta,p=[],_=[],x=.002,y=1;for(let H=g.minX;H<=g.maxX+1e-6;H+=y)(Math.round(H/y)%5===0?_:p).push(H,x,g.minZ,H,x,g.maxZ);for(let H=g.minZ;H<=g.maxZ+1e-6;H+=y)(Math.round(H/y)%5===0?_:p).push(g.minX,x,H,g.maxX,x,H);const S=new ge,w=[[p,3358797,.5],[_,4873328,.85]];for(const[H,At,_t]of w){const Mt=new en;Mt.setAttribute("position",new Le(H,3)),S.add(new Zf(Mt,new Nd({color:At,transparent:!0,opacity:_t})))}S.visible=e.showGrid,c.add(S);const T=B2(i,e,a);c.add(T.group);const R=gR(t.grass,e.grass,t.config.grass.wind);Cl(R.object,$e.grass),c.add(R.object);const b=yR(t.destructibles);c.add(b.object);let M=[];const C=H=>(H==null?void 0:H.rig)==="spider"?(A=.24,e.camera.pitchDeg=32,oR(e.colors,{height:.35,scale:1.3})):(A=1,e.camera.pitchDeg=k,v0((H==null?void 0:H.voxel)??e.voxel,H!=null&&H.colors?{...e.colors,...H.colors}:e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links,e.weaponWrist,e.balance)),k=e.camera.pitchDeg,D=typeof location<"u"?new URLSearchParams(location.search).get("hero"):null;let F=D&&((se=e.bodyTypes)!=null&&se[D])?D:"standard",A=1,E=C((ne=e.bodyTypes)==null?void 0:ne[F]);const z=lR(e.weaponTrail);Cl(z.object,$e.trail),c.add(z.object);const G=new ge,X=new ge;let et=.9;const ht=H=>(H==null?void 0:H.rig)==="spider"?.26:.9,gt=(H,At)=>{et=At,X.position.y=At,H.group.position.y=-At,X.add(H.group)};gt(E,ht((jt=e.bodyTypes)==null?void 0:jt[F])),G.add(X),c.add(G);const Lt=t.config.moveSpeed,Z=H=>{H&&(t.config.characterHeight=H.height,H.radius!==void 0&&(t.config.characterRadius=H.radius),t.config.moveSpeed=H.moveSpeed??Lt)};Z((ue=e.bodyTypes)==null?void 0:ue[F]);const B=cR();let Y=0;const q=((ie=t.config.dummies.fighters)==null?void 0:ie.moveSpeed)??t.config.dummies.moveSpeed;function K(H,At){const _t=e.dummies.colors,Mt=_t[At%_t.length]??"#cccccc";let te;if(H.weapon){const Ot=e.dummies.fighterColors,oe=Ot&&Ot.length>0?Ot[(At-t.config.dummies.count)%Ot.length]:void 0;te=O2({voxel:e.voxel,colors:oe?{...e.colors,...oe}:e.colors,moveSpeed:q,orientation:e.orientation,gait:e.gait,mount:e.weaponMount,lean:e.lean,hurt:e.hurt,animation:e.animation,ik:e.ik,links:e.links,wrist:e.weaponWrist,balance:e.balance})}else{const Ot=x2(e.voxel,e.colors,Mt,H.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);te={group:Ot.group,update:(oe,ke)=>Ot.update(oe,ke),boneAtWorld:(oe,ke,be)=>Ot.boneAtWorld(oe,ke,be),dispose:()=>Ot.dispose()}}return te.group.traverse(Ot=>{Ot.userData.dummyId=H.id}),c.add(te.group),te}const st=t.dummies.map(K),Tt=st.map(H=>H.group),Gt=new qA,J=e.groundRing,V=e.voxel.bodyWidth,O=fp(V,J.playerRadiusFactor),Pt=fp(V,J.dummyRadiusFactor),Et=V*J.thicknessFactor,lt=J.arcDeg*Math.PI/180;let vt=0;const ft=(H,At,_t)=>Ip(t.boxes,H,At,_t+.55,0),Rt=Ll({radius:O,thickness:Et,arcRad:lt,edgeFade:J.edgeFade,color:J.playerColor,opacity:J.playerOpacity,y:.028,renderOrder:$e.ring});Rt.mesh.name="player-ground-ring",c.add(Rt.mesh);function L(H){const At=Ll({radius:Pt,thickness:Et,arcRad:lt,edgeFade:J.edgeFade,color:J.neutralColor,opacity:J.opacity,y:.022,renderOrder:$e.ring});return At.mesh.name=`dummy-ground-ring-${H.id}`,c.add(At.mesh),At}function P(H){const At=Ll({radius:Pt*J.haloRadiusFactor,thickness:Et*J.haloThicknessFactor,arcRad:lt,edgeFade:J.edgeFade,color:J.neutralColor,opacity:0,profile:"glow",y:.019,renderOrder:$e.ringHalo});return At.mesh.name=`dummy-ground-halo-${H.id}`,c.add(At.mesh),At}function Q(H){const At=pp({radius:Pt*J.warnRadiusFactor,thickness:Et*J.warnThicknessFactor,arcRad:lt,edgeFade:.02,color:J.warnColor,y:.031,renderOrder:$e.ringWarn});return At.mesh.name=`dummy-ground-warn-${H.id}`,c.add(At.mesh),At}const mt=t.dummies.map(L),ot=t.dummies.map(P),dt=t.dummies.map(()=>0),zt=t.dummies.map(()=>0),Ct=pp({radius:O*J.meterRadiusFactor,thickness:Et*J.meterThicknessFactor,arcRad:lt,edgeFade:.06,color:J.meterColorCharge,y:.03,renderOrder:$e.ringMeter});Ct.mesh.name="player-ground-meter",c.add(Ct.mesh);const St=t.dummies.map(Q),Yt=mp({color:J.playerColor,y:.042,renderOrder:$e.groundArea});Yt.group.name="player-landing-preview",c.add(Yt.group);const xt=new Qt,Ut=new Qt(J.playerColor),tt=new Qt(J.neutralColor),j=new Qt(J.lowThreatColor),pt=new Qt(J.highThreatColor),Ht=new Qt(J.meterColorCharge),Nt=new Qt(J.meterColorChannel),It=new Qt(J.meterColorCooldown),U=new Qt(J.warnColor),bt=new ge;c.add(bt);const $=e.projectiles;function ut(){const At=document.createElement("canvas");At.width=64,At.height=64;const _t=At.getContext("2d");if(_t){const te=_t.createRadialGradient(32,32,0,32,32,32);te.addColorStop(0,"rgba(255,255,255,1)"),te.addColorStop(.28,"rgba(255,255,255,0.72)"),te.addColorStop(.62,"rgba(255,255,255,0.22)"),te.addColorStop(1,"rgba(255,255,255,0)"),_t.fillStyle=te,_t.fillRect(0,0,64,64)}const Mt=new Od(At);return Mt.colorSpace=Hn,Mt}function Ft(){const _t=document.createElement("canvas");_t.width=2,_t.height=64;const Mt=_t.getContext("2d");if(Mt){const Ot=Mt.createLinearGradient(0,0,0,64);Ot.addColorStop(0,"rgba(255,255,255,0)"),Ot.addColorStop(.55,"rgba(255,255,255,0.35)"),Ot.addColorStop(1,"rgba(255,255,255,0.95)"),Mt.fillStyle=Ot,Mt.fillRect(0,0,2,64)}const te=new Od(_t);return te.colorSpace=Hn,te}const Dt=ut(),qt=Ft(),le=new Sn({color:12577023,transparent:!0,opacity:0,side:je,depthWrite:!1}),de=new Sn({color:14217983,transparent:!0,opacity:0,side:je,depthWrite:!1,blending:Ji}),ee=new ge;ee.position.set(0,.95,.72),bt.add(ee);const we=new ge;we.rotation.x=J2(e.camera.pitchDeg),ee.add(we);const De=new Sc(.78,$.slashThickness,6,28,Math.PI*1.15),Ve=new ge,vn=new ve(De,le),Re=new ve(De,de);Re.scale.setScalar(1.09),Cl(Ve,$e.slash),Re.renderOrder=$e.slash+1,Ve.add(vn,Re),we.add(Ve);const Pe=new qn($.arrowWidth,$.arrowWidth,$.arrowLength),un=new vh($.arrowHeadSize*.42,$.arrowHeadSize,4);un.rotateX(Math.PI/2);const Rn=new qn($.arrowWidth*2.6,$.arrowWidth*.4,.1),nn=new Go($.arrowWidth*.45,$.arrowWidth*1.3,$.trailLength,6,1,!0);nn.rotateX(-Math.PI/2),nn.translate(0,0,-$.trailLength/2);const En=Array.from({length:10},()=>{const H=new ge,At=new Sn({color:$.arrowColor,transparent:!0}),_t=new Sn({color:$.arrowHeadColor,transparent:!0}),Mt=new Ud({map:Dt,color:$.arrowColor,transparent:!0,opacity:.85,blending:Ji,depthWrite:!1}),te=new Sn({color:$.arrowTrailColor,map:qt,transparent:!0,opacity:0,blending:Ji,depthWrite:!1,side:je}),Ot=new ve(Pe,At),oe=new ve(un,_t);oe.position.z=$.arrowLength/2+$.arrowHeadSize*.42;const ke=new ve(Rn,_t),be=new ve(Rn,_t);ke.position.z=-$.arrowLength/2+.08,be.position.z=ke.position.z,be.rotation.z=Math.PI/2;const Oe=new Bf(Mt);Oe.scale.setScalar($.arrowGlowSize),Oe.renderOrder=$e.projectileGlow;const xe=new ve(nn,te);return xe.renderOrder=$e.projectileTrail,Ot.renderOrder=$e.projectile,oe.renderOrder=$e.projectile,ke.renderOrder=$e.projectile,be.renderOrder=$e.projectile,H.add(Ot,oe,ke,be,Oe,xe),H.visible=!1,c.add(H),{group:H,shaftMat:At,tipMat:_t,glowMat:Mt,trailMat:te,glow:Oe,trail:xe,arrowId:0,bone:null}}),Tn=new Mh(1,0),Xn=new W($.boltShapeX,$.boltShapeY,$.boltShapeZ),Vn=new Sn({color:$.boltColor,transparent:!0,opacity:.98,depthWrite:!1}),wi=new Ud({map:Dt,color:$.boltGlowColor,transparent:!0,opacity:.45,blending:Ji,depthWrite:!1}),Ei=new Sn({color:$.boltGlowColor,map:qt,transparent:!0,opacity:$.trailOpacity,blending:Ji,depthWrite:!1,side:je}),fn=new Go(.5,.03,$.boltTrailScale,6,1,!0);fn.rotateX(-Math.PI/2),fn.translate(0,0,-$.boltTrailScale/2);const I=Array.from({length:24},()=>{const H=new ge,At=new ve(Tn,Vn);At.scale.copy(Xn);const _t=new Bf(wi);_t.scale.setScalar($.boltGlowScale),_t.renderOrder=$e.projectileGlow;const Mt=new ve(fn,Ei);return Mt.renderOrder=$e.projectileTrail,At.renderOrder=$e.projectile,H.add(At,_t,Mt),H.visible=!1,c.add(H),{group:H,core:At}}),it=Array.from({length:6},()=>{const H=mp({color:"#9ad0ff",edgeWidthRatio:.038,y:.045,renderOrder:$e.groundArea});return H.group.visible=!1,c.add(H.group),H}),ct=H2(c,e,t,ft),rt=JA(e.camera,e.smartCamera,e.zoom,s/o),nt=t.character.position;rt.update(nt.x,nt.y,nt.z,1,t.camera);function kt(H){const At=H.dummies.length;for(;st.length<At;){const Mt=st.length,te=H.dummies[Mt],Ot=K(te,Mt);st.push(Ot),Tt.push(Ot.group),mt.push(L(te)),ot.push(P(te)),St.push(Q(te)),dt.push(0),zt.push(0)}let _t=!1;for(;st.length>At;){_t=!0;const Mt=st.pop();c.remove(Mt.group),Mt.dispose(),Tt.pop();const te=mt.pop();c.remove(te.mesh),te.dispose();const Ot=ot.pop();c.remove(Ot.mesh),Ot.dispose();const oe=St.pop();c.remove(oe.mesh),oe.dispose(),dt.pop(),zt.pop()}if(_t)for(let Mt=0;Mt<At;Mt++){const te=H.dummies[Mt].id;st[Mt].group.userData.dummyId!==te&&st[Mt].group.traverse(Ot=>{Ot.userData.dummyId=te})}}function Xt(H,At){if(Tt.length===0)return 0;const _t=r.domElement.getBoundingClientRect(),Mt=new Wt((H-_t.left)/_t.width*2-1,-((At-_t.top)/_t.height)*2+1);Gt.setFromCamera(Mt,rt.camera);const te=Gt.intersectObjects(Tt,!0);for(const Ot of te){const oe=Ot.object.userData.dummyId;if(oe&&oe>0)return oe}return 0}function Zt(H,At,_t){const Mt=r.domElement.getBoundingClientRect(),te=new W(H,At,_t).project(rt.camera);return{x:Mt.left+(te.x*.5+.5)*Mt.width,y:Mt.top+(-te.y*.5+.5)*Mt.height}}let $t=!1;return{balanceDebug(){var H;return((H=E.balanceDebug)==null?void 0:H.call(E))??null},spineDebug(){var H;return((H=E.spineDebug)==null?void 0:H.call(E))??null},spiderDebug(){var H;return((H=E.debug)==null?void 0:H.call(E))??null},gaitDebug(){var H;return((H=E.gaitDebug)==null?void 0:H.call(E))??{stopT:0,hipYaw:0,chestYaw:0,speed:0,gaitSpeed:0,stopStep:0,stopShift:0,stopDip:0,stopYawFade:0,turnStep:0,legLPitch:0,legLRoll:0,legRPitch:0,legRRoll:0,legTakeover:0,phase:0,dirF:0,dirR:0,hipYawTarget:0,spin:0}},trailDebug(){return z.debug()},stretchDebug(){var At;const H=((At=E.stretch)==null?void 0:At.call(E))??{arm:1,leg:1,torso:1,impact:0};return{arm:H.arm,leg:H.leg,torso:H.torso,impact:H.impact}},swingDebug(){var H;return((H=E.swingDebug)==null?void 0:H.call(E))??{seg:0,kind:"none",lead:"R",yaw:0,pitch:0,roll:0,strike:0,rootYaw:0,spinYaw:0,rootTurn:0,bladeTwist:0,bladeTwistOff:0,bladeYaw:0,bladeYawOff:0,shoulderL:{x:0,y:0,z:0},shoulderR:{x:0,y:0,z:0}}},stanceDebug(){var H;return((H=E.stanceDebug)==null?void 0:H.call(E))??{weapon:t.combat.weapon,weight:0,armL:{pitch:0,yaw:0,roll:0,elbow:0},armR:{pitch:0,yaw:0,roll:0,elbow:0},torsoYaw:0,torsoPitch:0,bladePitchDeg:0,bladePitchOffDeg:0,armSwing:0}},bladeWorld(){var H;return((H=E.weaponBlade)==null?void 0:H.call(E))??null},bladesWorld(){var H;return((H=E.bladesWorld)==null?void 0:H.call(E))??{right:null,left:null}},slamDebug(){return ct.slamDebug()},yawDebug(){var H;return{target:Y,shown:B.value,tauMs:((H=e.renderInterp)==null?void 0:H.yawSmoothMs)??0}},grassDebug(){return R.debug()},breakHits(){return M},destructibleDebug(){return b.debug()},fxDebug(){var H,At;return{boxOpaque:m.every(_t=>!_t.transparent),boxCount:m.length,orders:{ring:Rt.mesh.renderOrder,groundFx:ct.groundOrder(),trail:z.object.renderOrder,slash:Ve.renderOrder,projectile:((At=(H=En[0])==null?void 0:H.group.children[0])==null?void 0:At.renderOrder)??-1}}},renderPose(){return{x:G.position.x,y:G.position.y,z:G.position.z,bodyYaw:G.rotation.y}},projectPoint(H,At,_t){return Zt(H,At,_t)},setClipT(H){var At;(At=E.setClipT)==null||At.call(E,H)},weaponDebug(){var H;return((H=E.weaponDebug)==null?void 0:H.call(E))??{wristPitch:0,wristTwist:0}},gripDebug(){var H;return((H=E.gripDebug)==null?void 0:H.call(E))??{active:!1,dist:0,gy:0,pitch:0,joint:0,grip:0}},render(H,At){var Wn,Qs,Kn;kt(H);const _t=H.character,Mt=H.combat,te=e.hitstop.enabled&&H.combat.hitstop>0,Ot=At*Math.max(0,Math.min(4,Mt.warp??1));if(te&&!$t){const ce=Math.max(0,H.combat.hitstop),Bt=Math.max(0,Math.min(1,ce/.1));rt.addShake(.34+Bt*.48);let he=null;for(let on=0;on<H.events.length;on++){const Mn=H.events[on];if(Mn.type==="hit"){he=Mn;break}}he&&rt.addKick(he.x-_t.position.x,he.z-_t.position.z,.03+Bt*.05)}$t=te;for(let ce=0;ce<H.events.length;ce++){const Bt=H.events[ce];if(Bt.type!=="notify")continue;const he=Number.isFinite(Bt.value)?Bt.value:0;if(Bt.name==="blade-air"){const on=Math.max(0,Math.min(1,he));z.pulse((Mt.weapon==="greatsword"?.9:.55)*(.4+.6*on))}}G.position.set(_t.position.x,_t.position.y,_t.position.z),Y=_t.bodyYaw,G.rotation.y=B.update(Y,At,((Wn=e.renderInterp)==null?void 0:Wn.yawSmoothMs)??0);const oe=H.dash.phase==="active"&&H.dash.kind==="roll",ke=oe&&H.dash.duration>0?Math.min(1,1-H.dash.timer/H.dash.duration):0;if(X.rotation.x=oe?ke*Math.PI*2:0,X.position.y=et-(oe?.2*Math.sin(Math.PI*ke):0),Ot>0&&E.update(_t,Mt,H.playerHurt,Ot,H.abilities.channeling,H.time,H.playerLink,H.turnInPlace),z.update(Ot,Ot>0?((Qs=E.weaponBlade)==null?void 0:Qs.call(E))??null:null,Ot>0&&(Mt.phase==="active"||H.playerLink.phase==="active"||oe&&H.dash.duration>0)),Ot>0)for(let ce=0;ce<st.length;ce++)H.dummies[ce]&&st[ce].update(H.dummies[ce],Ot,H.time);const be=rt.camera.position,Oe=Math.atan2(be.x-_t.position.x,be.z-_t.position.z),xe=H.config.gaze.hurtHoldSec,fe=H.time-H.playerHurt.lastAt,Ae=xe>0&&fe>=0&&fe<xe?1-fe/xe:0,He=V2(H.gaze.active,H.gaze.threat,Ae,H.time,J);W2(xt,Ut,j,pt,He.level),vt=K2(_t.grounded,_t.position.y,vt),Rt.mesh.position.set(_t.position.x,vt+.028,_t.position.z),Rt.update(He.arcRad,He.opacity,He.scale,xt,Oe);const ln=H.config.abilities.arcane,Pn=Math.max(1,Math.floor(ln.waves)),pi=Math.max(1e-4,ln.waveInterval),Ti=Z2({charging:Mt.charging,charge:Mt.charge,channeling:H.abilities.channeling,fireTimer:H.abilities.fireTimer,fireInterval:pi,channelProgress:H.abilities.channeling?(H.abilities.waveIndex+(1-Math.min(1,Math.max(0,H.abilities.fireTimer/pi))))/Pn:0,arcaneCooldown:H.abilities.cooldown,arcaneCooldownMax:ln.cooldown,dashCooldown:H.dash.cooldown,dashCooldownMax:H.dash.kind==="blink"?H.config.dash.blinkCooldown:H.config.dash.rollCooldown});Ct.mesh.position.set(_t.position.x,_t.position.y+.03,_t.position.z),Ct.set(Ti.ratio,Ti.source==="none"?0:J.meterOpacity,Ti.source==="charge"?Ht:Ti.source==="channel"?Nt:It,Oe);const mi=H.playerLink,ri=mi.weapon?H.config.links.moves[mi.weapon]:void 0,yn=j2(mi.phase,_t.position.x,_t.position.z,mi.facing,mi.travel,(ri==null?void 0:ri.hit.radius)??.9);Yt.set(yn.x,yn.z,ft(yn.x,yn.z,_t.position.y)+.042,yn.radius,yn.active?J.landingOpacity:0,H.time);for(let ce=0;ce<mt.length;ce++){const Bt=H.dummies[ce],he=mt[ce],on=ot[ce],Mn=St[ce];if(!Bt){he.mesh.visible=!1,on.mesh.visible=!1,Mn.mesh.visible=!1;continue}const Hi=H.targeting.hasTarget&&H.targeting.targetId===Bt.id;if(jx(H,Bt)){const Ta=qx(H,Bt);xt.copy(j).lerp(pt,Ta)}else xt.copy(tt);const Cn=$2(Bt.attackPhase,Bt.attackPhaseTimer,H.config.dummies.attackWindup);Cn.active?(xt.lerp(U,.5*Cn.urgency),Mn.mesh.position.set(Bt.position.x,Bt.position.y+.031,Bt.position.z),Mn.set(Cn.ratio,J.warnOpacity*(.65+.35*Cn.urgency),U,Oe)):Mn.set(0,0,U,Oe);const ci=Hi?1:0,wa=ci>dt[ce]?J.haloFadeInSec:J.haloFadeOutSec;dt[ce]=gp(dt[ce],ci,At,wa);const Ea=dt[ce],ts=1+.02*Ea*Math.sin(H.time*2.2+Bt.id),es=J.arcDeg+(J.selectedArcDeg-J.arcDeg)*Ea;he.mesh.position.set(Bt.position.x,Bt.position.y+.022,Bt.position.z),he.update(es*Math.PI/180,J.opacity+(J.selectedOpacity-J.opacity)*Ea,1+(J.selectedScale-1)*Ea*ts,xt,Oe,1+(J.selectedThicknessScale-1)*Ea),zt[ce]=gp(zt[ce],ci,At,ci>zt[ce]?J.haloFadeInSec:J.haloFadeOutSec);const ns=zt[ce];on.mesh.position.set(Bt.position.x,Bt.position.y+.019,Bt.position.z),on.update(es*Math.PI/180,J.haloOpacity*ns*(.88+.12*Math.sin(H.time*2.2+Bt.id)),J.selectedScale*(.94+.06*ns)*ts,xt,Oe)}bt.position.set(_t.position.x,_t.position.y,_t.position.z),bt.rotation.y=Mt.phase!=="idle"?Mt.attackFacing:_t.bodyYaw,ct.update(H,At,ce=>rt.addShake(ce));const pn=$.slashEnabled&&Mt.phase==="active"&&Mt.comboIndex>=3;le.opacity=pn?.7:0,de.opacity=pn?$.slashGlowOpacity:0,pn&&(Ve.rotation.z=-1.2+Mt.attackProgress*3.2,Ve.scale.setScalar(.9+Mt.comboIndex*.13));for(let ce=0;ce<I.length;ce++){const Bt=H.abilities.projectiles[ce],he=I[ce];he.group.visible=!!Bt,Bt&&(he.group.position.set(Bt.x,Bt.y,Bt.z),he.group.scale.setScalar(Bt.radius),he.group.rotation.set(0,Math.atan2(Bt.dirX,Bt.dirZ),0))}for(let ce=0;ce<it.length;ce++){const Bt=H.abilities.rings[ce],he=it[ce];if(!Bt){he.group.visible=!1;continue}const on=Math.max(0,Math.min(1,Bt.life/Math.max(Bt.duration,1e-6))),Mn=q2(Math.max(0,Bt.duration-Bt.life),J.areaExpandSec);he.set(Bt.x,Bt.z,ft(Bt.x,Bt.z,_t.position.y)+.045,Bt.radius*Mn.scale,J.areaOpacity*(.35+.65*on)*Mn.alpha,H.time)}for(let ce=0;ce<En.length;ce++){const Bt=H.arrows[ce],he=En[ce];if(!Bt){he.group.visible=!1,he.bone&&(c.attach(he.group),he.bone=null),he.arrowId=0;continue}const on=Bt.stuck&&Bt.stuckDummy>=0;if(he.arrowId!==Bt.id){if(he.bone&&(c.attach(he.group),he.bone=null),he.arrowId=Bt.id,he.group.position.set(Bt.x,Bt.y,Bt.z),he.group.rotation.set(Bt.pitch,Bt.yaw,0,"YXZ"),on){const Hi=st[Bt.stuckDummy],Cn=Hi?Hi.boneAtWorld(Bt.x,Bt.y,Bt.z):null;Cn&&(Cn.node.attach(he.group),he.bone=Cn.node)}}else he.bone||(he.group.position.set(Bt.x,Bt.y,Bt.z),he.group.rotation.set(Bt.pitch,Bt.yaw,0,"YXZ"));he.group.visible=!0;const Mn=Bt.stuck?Math.min(1,Bt.rest/.6):1;he.shaftMat.opacity=Mn,he.tipMat.opacity=Mn,he.glowMat.opacity=(Bt.stuck?.28:.85)*Mn,he.trailMat.opacity=Bt.stuck?0:$.trailOpacity*Mn,he.trail.visible=!Bt.stuck}if(R.update(H,At),b.update(H.destructibles),Mt.phase==="active"||H.playerLink.phase==="active"){const ce=b.computeHits(H.destructibles,((Kn=E.bladesWorld)==null?void 0:Kn.call(E))??{right:null,left:null});for(let Bt=0;Bt<ce.length;Bt++){let he=!1;for(let on=0;on<M.length;on++)if(M[on].id===ce[Bt].id){he=!0;break}he||M.push(ce[Bt])}}else M=[];rt.update(_t.position.x,_t.position.y,_t.position.z,At,H.camera),r.render(c,rt.camera)},resize(){const H=Math.max(1,n.clientWidth),At=Math.max(1,n.clientHeight);r.setSize(H,At,!1),rt.resize(H/At)},getGroundBasis(){return rt.getGroundBasis()},setCollidersVisible(H){for(const At of m)At.opacity=H?.3:1,At.wireframe=H,At.transparent=H,At.depthWrite=!H,At.needsUpdate=!0},setGridVisible(H){S.visible=H},setLabVisible(H){T.setVisible(H)},setLabLabelsVisible(H){T.setLabelsVisible(H)},snapCamera(H,At,_t){rt.snap(H,At,_t)},setZoom(H){rt.setZoom(H*A)},setBodyType(H){var _t;const At=(_t=e.bodyTypes)==null?void 0:_t[H];return!At||H===F||(X.remove(E.group),E.dispose(),E=C(At),gt(E,ht(At)),z.reset(),F=H,Z(At)),F},bodyTypes(){return{id:F,ids:Object.keys(e.bodyTypes??{})}},pickDummy:Xt,dummyRenderCount:()=>st.length,projectToScreen:Zt,dummyRigDebug(H){const At=st[H-1];return At!=null&&At.debug?At.debug():null},diagnostics(){var _t,Mt,te,Ot,oe,ke,be,Oe,xe;const H=_0(e.camera.pitchDeg),At=Q2(H,bt.rotation.y);return{lean:((_t=E.lean)==null?void 0:_t.call(E))??{forward:0,side:0},slashNormal:At,arrowForward:((Mt=E.arrowDirection)==null?void 0:Mt.call(E))??{x:0,y:0,z:1},gait:{hipYaw:((te=E.hipYaw)==null?void 0:te.call(E))??0,gaitYaw:((Ot=E.gaitYaw)==null?void 0:Ot.call(E))??0},attackBlend:((oe=E.attackBlend)==null?void 0:oe.call(E))??0,attackWeights:((ke=E.attackWeights)==null?void 0:ke.call(E))??{gaitScale:1,attackLegWeight:0,driveSpeed:0,stridePhase:0,strideBase:0,stepIndex:0},landing:((be=E.landing)==null?void 0:be.call(E))??{pulse:0,remaining:0,kind:"none",impactVy:0},hurt:((Oe=E.hurt)==null?void 0:Oe.call(E))??d0(),ik:((xe=E.ik)==null?void 0:xe.call(E))??{active:!1,weight:0,clamped:0,maxError:0},link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:X.rotation.x,activeRings:ct.activeDash(),lastKind:ct.dashKind()},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...rt.smart(),shake:rt.shakeLevel(),kick:rt.kickLevel(),kickCount:rt.kickCount()}}},dispose(){E.dispose(),T.dispose(),R.dispose(),b.dispose();for(const H of st)H.dispose();Rt.dispose();for(const H of mt)H.dispose();for(const H of ot)H.dispose();Ct.dispose(),z.dispose();for(const H of St)H.dispose();Yt.dispose(),De.dispose(),le.dispose(),de.dispose(),Tn.dispose(),Vn.dispose(),wi.dispose(),Ei.dispose(),fn.dispose();for(const H of it)H.dispose();Pe.dispose(),un.dispose(),Rn.dispose(),nn.dispose();for(const H of En)H.shaftMat.dispose(),H.tipMat.dispose(),H.glowMat.dispose(),H.trailMat.dispose();Dt.dispose(),qt.dispose(),ct.dispose(),v.traverse(H=>{H instanceof ve&&H.geometry.dispose()}),r.dispose(),r.domElement.remove()}}}async function bR(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function SR(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),a=document.createElement("a");a.href=i,a.download=n,a.rel="noopener",document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function wR(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=_=>e.querySelector(`#${_}`),a=i("diag-status"),s=i("diag-text"),o=i("diag-copy"),r=i("diag-json"),c=i("diag-clear"),l=i("diag-toggle"),d=i("diag-close"),u=i("diag-mask");let h=!1,f=!0,m=0;function v(){const _=n.status();a.textContent=_.enabled?`已记录 ${_.durationS.toFixed(1)}s · ${_.frames} 帧 · 事件 ${_.events} · 异常 ${_.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",l.textContent=_.enabled?"暂停记录":"继续记录"}function g(_){h=_,e.hidden=!_,_?v():s.hidden=!0}function p(_){o.textContent=_,window.clearTimeout(m),m=window.setTimeout(()=>{o.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",_=>{_.preventDefault(),_.stopPropagation(),g(!h)}),d.addEventListener("click",()=>g(!1)),u.addEventListener("click",()=>g(!1)),o.addEventListener("click",()=>{const _=n.summary();bR(_).then(x=>{x?(p("已复制 ✓"),s.hidden=!0):(s.value=_,s.hidden=!1,s.focus(),s.select(),p("请长按全选复制"))})}),r.addEventListener("click",()=>{const _=n.dump(),x=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);SR(`harness-${_.meta.version}-${x}.json`,JSON.stringify(_)),p("已导出")}),c.addEventListener("click",()=>{n.clear(),s.hidden=!0,v(),p("已清空")}),l.addEventListener("click",()=>{f=!f,n.setEnabled(f),v()}),{tick(){const _=n.status();t==null||t.classList.toggle("is-alert",_.alert),h&&v()},isOpen:()=>h,close:()=>g(!1)}}const ER={intents:{..._p},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function TR(){var J;const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=mv(om,Br),i=_R(n,e,_n,Br.stations,Br.slabs),a=_v(e),s=Y_(t),o=$_(t),r=document.getElementById("version-badge");r&&(r.textContent="v0.9.71 · 11-09 21:15 · 诊断");const c=V=>String(V).padStart(2,"0"),l=new Date,d=Kv({meta:{version:"v0.9.71",buildTime:"11-09 21:15",startedAt:`${c(l.getMonth()+1)}-${c(l.getDate())} ${c(l.getHours())}:${c(l.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),u=wR(d,r),h=X_({deadZone:()=>_n.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0,phaseSource:()=>i.gaitDebug().phase});document.addEventListener("visibilitychange",()=>{document.hidden&&d.suspend(800)});const f={timeScale:1,paused:!1,showColliders:_n.showColliders,showGrid:_n.showGrid,showLab:_n.lab.enabled,showLabLabels:_n.lab.showLabels};let m=1,v=!1;const g=Bv({maxRadiusPx:()=>_n.joystick.maxRadiusPx,deadZone:_n.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>_n.zoom}),p=Array.from(document.querySelectorAll(".wp[data-weapon]"));let _=e.combat.weapon;function x(V){if(V===_)return;_=V;const O=_a.indexOf(V)+1;for(const Pt of p)Pt.classList.toggle("is-active",Number(Pt.dataset.weapon)===O);T.refreshWeapon()}let y=ER,S=0;const w=()=>{m=1,i.setZoom(1)},T=b_(e,_n,f,{singleStep:()=>a.singleStep(y.intents),reset:()=>{m=1,a.singleStep({..._p,resetPressed:!0})},resetZoom:w,onToggleColliders:V=>i.setCollidersVisible(V),onToggleGrid:V=>i.setGridVisible(V),onToggleLab:V=>i.setLabVisible(V),onToggleLabLabels:V=>i.setLabLabelsVisible(V),setFighterMode:V=>{for(const O of e.dummies)O.weapon&&(O.mode=V,O.attackPhase="idle",O.attackPhaseTimer=0,O.attackProgress=0,O.attackCooldown=0,O.combat&&(O.combat.phase="idle",O.combat.attackProgress=0,O.combat.comboIndex=0))}}),R=E_({stations:Ki.stations,plots:wu,world:e,view:i,onResetZoom:w,onPlotTest:V=>{Vl(e);const O=kx(e,V);return A(`已在「${V.name}」生成 ${O} 人 · 点「清除测试单位」回基线`),O},onClearTestUnits:()=>{const V=Vl(e);return A(V>0?`已清除 ${V} 个测试单位`:"当前没有测试单位"),V}});o.register({motion:h,debug:T.gui}),window.addEventListener("resize",()=>i.resize());const b=i.bodyTypes().ids,M=document.getElementById("body-toggle"),C=V=>{var O,Pt;return((Pt=(O=_n.bodyTypes)==null?void 0:O[V])==null?void 0:Pt.name)??V},k=()=>{if(!M)return;const V=i.bodyTypes().id;M.textContent=`体型 ${C(V)}`,M.setAttribute("aria-label",`切换体型（当前：${C(V)}，快捷键 B）`)},D=document.createElement("div");D.style.cssText=["position:fixed","left:50%","top:14px","transform:translateX(-50%)","padding:6px 14px","border-radius:999px","font:600 13px/1.4 system-ui,sans-serif","color:#0b1620","background:#8fd0ff","box-shadow:0 4px 16px rgba(0,0,0,.35)","opacity:0","transition:opacity .18s","pointer-events:none","z-index:99"].join(";"),document.body.appendChild(D);let F=0;const A=V=>{D.textContent=V,D.style.opacity="1",window.clearTimeout(F),F=window.setTimeout(()=>{D.style.opacity="0"},1600)},E=()=>{if(b.length<2){A("只有一个体型预设");return}const V=i.bodyTypes().id,O=Math.max(0,b.indexOf(V)),Pt=i.setBodyType(b[(O+1)%b.length]);k(),A(`体型：${C(Pt)}（B / 顶部胶囊切换）`)};k(),M==null||M.addEventListener("click",E);const z=document.getElementById("wind-toggle"),G=()=>{var V;return(V=e.config.grass)==null?void 0:V.wind},X=()=>{var O;if(!z)return;const V=!!((O=G())!=null&&O.enabled);z.textContent=`风：${V?"开":"关"}`,z.classList.toggle("is-off",!V),z.setAttribute("aria-label",`${V?"关闭":"开启"}风吹麦浪（当前${V?"开启":"关闭"}，快捷键 G）`)},et=()=>{const V=G();if(!V){A("本场景未启用草块");return}V.enabled=!V.enabled,X(),A(`风吹麦浪：${V.enabled?"开":"关"}（G 切换）`)};X(),z==null||z.addEventListener("click",et),window.addEventListener("keydown",V=>{V.repeat||(V.code==="KeyB"?E():V.code==="KeyG"&&et())}),window.__harness={world:e,view:i,clock:a,input:g,viewConfig:_n,debug:f,getUserZoom:()=>m,getGestures:()=>y.gestures,getLastGesture:()=>y.lastGesture,telemetry:d,telemetrySummary:()=>d.summary(),dirDebug:h.dirDebug,dirAngles:()=>h.dirDebug.last(),motionDebug:h,speedDebug:()=>h.last(),speedSamples:()=>h.samples(),gaitDebug:()=>i.gaitDebug(),spiderDebug:()=>i.spiderDebug(),dummyRigDebug:V=>i.dummyRigDebug(V),swingDebug:()=>i.swingDebug(),stanceDebug:()=>i.stanceDebug(),balanceDebug:()=>i.balanceDebug(),spineDebug:()=>i.spineDebug(),interpDebug:()=>({alpha:q,applied:K,enabled:Z,skip:st}),renderPose:()=>i.renderPose(),yawDebug:()=>i.yawDebug(),slamDebug:()=>i.slamDebug(),fxDebug:()=>i.fxDebug(),grassDebug:()=>i.grassDebug(),breakDebug:()=>({version:"v0.9.71",count:e.destructibles.length,broken:e.destructibles.filter(V=>V.broken!==0).length,cuts:e.destructibles.map(V=>({id:V.id,kind:V.kind,broken:V.broken,cutU:V.cutU,theta:V.theta,nx:V.nx,ny:V.ny,nz:V.nz,fall:V.fall,height:V.height})),rendered:i.destructibleDebug()}),breakTest:(V,O,Pt=1,Et=0,lt=0)=>uv(e,V,O,Pt,Et,lt),resetBreaks:()=>(Kp(e),e.destructibles.length),breakHits:()=>i.breakHits(),windDebug:()=>{var O;const V=i.grassDebug().wind;return{configured:!!((O=G())!=null&&O.enabled),rendered:V.enabled,time:V.time,gust:V.gust}},setWind:V=>{const O=G();return O?(O.enabled=!!V,X(),O.enabled):!1},setRenderInterp:V=>(Z=!!V,Z),renderHold:()=>v,trailDebug:()=>i.trailDebug(),bladeWorld:()=>i.bladeWorld(),projectPoint:(V,O,Pt)=>i.projectPoint(V,O,Pt),setBodyType:V=>{const O=i.setBodyType(V);return k(),O},bodyTypes:()=>i.bodyTypes(),bladesWorld:()=>i.bladesWorld(),clipLab:{clips:()=>{var V;return Object.keys(((V=_n.animation.swing)==null?void 0:V.clips)??{})},preview:V=>{const O=e.combat,Pt={...O};O.weapon=V.weapon,O.phase="active",O.comboIndex=Math.max(1,Math.min(3,Math.floor(V.comboIndex))),O.attackProgress=Math.max(0,Math.min(1,V.progress)),O.attackFacing=e.character.bodyYaw,i.setClipT(typeof V.t=="number"?V.t:null);const Et=Math.max(1,Math.min(30,Math.floor(V.warm??12)));v=!0;for(let lt=0;lt<Et;lt++)i.render(e,1/60);return i.setClipT(null),Object.assign(O,Pt),{...i.swingDebug(),blade:i.bladeWorld(),blades:i.bladesWorld()}},face:V=>{e.character.bodyYaw=V},zoom:V=>{m=_u(V,1,_n.zoom.min,_n.zoom.max),i.setZoom(m)},release:()=>{v=!1}},weaponDebug:()=>i.weaponDebug(),gripDebug:()=>i.gripDebug(),plotDebug:()=>({version:"v0.9.71",count:Ki.plots.length,diagnostics:Ki.diagnostics,testUnits:Ix(e),dummies:e.dummies.length,rendered:i.dummyRenderCount(),bounds:Ki.bounds,worldBounds:e.config.worldBounds,slabs:Ki.slabs.map(V=>({plotId:V.plotId,cell:V.cell,span:V.span,rect:[V.minX,V.maxX,V.minZ,V.maxZ],top:V.top})),plots:Ki.plots.map(V=>({id:V.id,index:V.index,placement:V.placement,slot:V.slot,cell:V.cell,span:V.span,centerX:V.centerX,centerZ:V.centerZ,spawnX:V.station.spawnX,spawnZ:V.station.spawnZ,slab:[V.slab.minX,V.slab.maxX,V.slab.minZ,V.slab.maxZ],hasTest:!!V.testSpawn}))}),spawnAt:V=>R.spawnAt(V),clearSpawned:()=>R.clearSpawned(),lab:{stations:Ki.stations,plots:wu,goto:V=>R.goto(V),current:()=>R.current(),recall:()=>R.recall(),spawnAt:V=>R.spawnAt(V),clearSpawned:()=>R.clearSpawned()}};let ht=performance.now(),gt=60,Lt=0,Z=((J=_n.renderInterp)==null?void 0:J.enabled)??!0,B=Mu(e),Y=null,q=1,K=!1,st="";function Tt(V){const O=Z&&!f.paused&&f.timeScale>0;if(K=!1,st="",!O)return st="off",q=1,e;if(!Y)return st="noprev",q=1,e;if(!Sv(Y,B))return st="key",q=1,e;const Pt=a.alpha;return q=Pt,Pt>=.999?(st="alpha",e):(K=!0,Ev(e,wv(Y,B,Pt)))}function Gt(V){const O=Math.min((V-ht)/1e3,.1);ht=V,O>0&&(gt=gt*.9+1/O*.1);const Pt=g.sample();Pt.intents.resetPressed&&(m=1),m=_u(m,Pt.zoomScale,_n.zoom.min,_n.zoom.max),i.setZoom(m);let Et=Pt.intents.dummyClickId;if(Pt.tap){const ft=i.pickDummy(Pt.tap.x,Pt.tap.y);ft>0&&(Et=ft)}Et>0&&(S=Et),y={...Pt,intents:{...Pt.intents,dummyClickId:S,breakHits:i.breakHits()}};const lt=a.frame(O,y.intents,f.timeScale,f.paused,()=>{const ft=e.events;for(let Rt=0;Rt<ft.length;Rt++)d.event(ft[Rt],e.time);Y=B,B=Mu(e)});lt>0&&(S=0),d.sample(e,y,O*1e3,lt);for(const ft of y.gestures)d.gesture(ft);V-Lt>250&&(Lt=V,u.tick()),x(e.combat.weapon),v||i.render(Tt(),O),R.tick(),h.update(e,y,i.getGroundBasis());const vt=i.diagnostics();s.update(e,gt,lt,y,f,{attackBlend:vt.attackBlend,attackWeights:vt.attackWeights,landing:vt.landing,hurt:vt.hurt,ik:vt.ik,zoom:vt.camera.zoom},o.hudCompact()),requestAnimationFrame(Gt)}requestAnimationFrame(Gt)}TR();

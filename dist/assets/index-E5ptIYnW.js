(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=e(a);fetch(a.href,s)}})();const ra=["sword-shield","dual-swords","greatsword","staff","bow"],Um=["wander","follow","keep-distance","attack","idle"],pf=["spar","wander","follow","keep-distance","attack","idle"],mf={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},vr=1e-6;function no(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>vr?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>vr?Math.atan2(t.moveX,t.moveZ):n.character.facing}function Nm(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>vr){const a=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/a,z:t.aimZ/a}}const e=Math.hypot(t.moveX,t.moveZ);if(e>vr)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const rn=1e-6,Zs=Math.PI/180,nh=-1e9;function gf(){return{type:"none",lastAt:nh,timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function js(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function sd(n,t,e,i,a){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=a,n.knockX=0,n.knockZ=0}function ih(n,t,e){var c,h;const i=e.duration>0?e.duration:kr(n,e.type);if(t.kind==="player"){const u=n.playerHurt;if(sd(u,e.type,i,e.dirX,e.dirZ),u.lastAt=n.time,!n.config.hits.noDamageToPlayer&&e.knockback>rn){const d=e.knockback*n.config.hits.knockbackDecay;u.knockX=e.dirX*d,u.knockZ=e.dirZ*d}js(n,"player-hurt",e.sourceId??0,n.character.position);return}const a=n.dummies[t.index];if(!a)return;if(sd(a.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>rn){const u=e.knockback*n.config.hits.knockbackDecay;a.hurt.knockX=e.dirX*u,a.hurt.knockZ=e.dirZ*u}n.hitCount+=1,js(n,"hit",a.id,a.position);const s=n.config.hits.hitstop;let o=((c=n.config.hits.hitstopByWeapon)==null?void 0:c[n.combat.weapon])??1;const r=n.config.hits.hitstopComboFalloff;if(r&&r.length>0){const u=Math.max(0,Math.min(r.length-1,n.combat.comboIndex-1));o*=Math.max(0,r[u])}o*=Math.max(0,e.holdMul??1);const l=s&&e.type!=="none"?(s[e.type]??0)*Math.max(0,o):0;l>0&&n.combat.hitstop<l&&(n.combat.hitstop=l,n.combat.warpPhase=1,n.combat.warp=(h=n.config.hits.hitstopWarp)!=null&&h.enabled?Math.max(0,Math.min(1,n.config.hits.hitstopWarp.holdRate)):0,js(n,"hitstop",l,a.position))}function po(n,t,e){ih(n,{kind:"dummy",index:t},e)}function Om(n,t){const e=[n.playerHurt];for(const a of n.dummies)e.push(a.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const a of e)a.timer>0&&(a.timer=Math.max(0,a.timer-t),a.timer===0&&(a.type="none",a.knockX=0,a.knockZ=0)),(a.knockX!==0||a.knockZ!==0)&&(a.knockX*=i,a.knockZ*=i,Math.abs(a.knockX)<1e-4&&(a.knockX=0),Math.abs(a.knockZ)<1e-4&&(a.knockZ=0))}function kr(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function od(n,t){if(n.length===0)return 0;if(t<=n[0][0])return n[0][1];for(let e=1;e<n.length;e++){const[i,a]=n[e];if(t<=i){const[s,o]=n[e-1],r=i>s?(t-s)/(i-s):1;return o+(a-o)*r}}return n[n.length-1][1]}function Bm(n){let t=n;for(;t>180;)t-=360;for(;t<-180;)t+=360;return t}function Hm(n){var S,A;const t=n.combat,e=n.config.hits,i=n.character.position;if(t.weapon==="bow")return;const a=n.config.combat.weapons[t.weapon],s=a==null?void 0:a.hitWindow,o=s?Math.min(1,Math.max(0,s.start)):0,r=s?Math.min(1,Math.max(o,s.end)):1,l=t.timings.active,c=l>rn?Math.min(1,Math.max(0,t.phaseTimer/l)):1;if(c<o-rn||c>r+rn)return;const h=e.reach[t.weapon]??0,u=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*Zs),d=Math.sin(t.attackFacing),f=Math.cos(t.attackFacing),m=n.config.dummies.radius,_=n.config.targeting.idealRange,g=a==null?void 0:a.hitSweep,p=((S=g==null?void 0:g.byCombo)==null?void 0:S[String(t.comboIndex)])??((A=g==null?void 0:g.byCombo)==null?void 0:A["1"]),y=(g==null?void 0:g.tolDeg)??10;let x=0,v=0,w=!1;if(p){if(typeof p.stabU=="number"){if(c<p.stabU)return}else if(p.pts&&p.pts.length>=2){const T=od(p.pts,0),b=od(p.pts,c);x=Math.min(T,b)-y,v=Math.max(T,b)+y,w=!0}}for(const T of n.dummies){if(t.hitIds.indexOf(T.id)>=0)continue;const b=T.position.x-i.x,M=T.position.z-i.z,P=Math.hypot(b,M);if(P>h+m)continue;const L=P>rn?b/P:d,F=P>rn?M/P:f;if(P>rn&&(b*d+M*f)/P<u)continue;if(w){const G=Bm(Math.atan2(b,M)/Zs-t.attackFacing/Zs);if(G<x||G>v)continue}let O="light";t.weapon==="greatsword"?O="knock":t.comboIndex>=3&&(O="heavy");const k=e.knockback[t.weapon]??0;let D=P;k>0&&(D=Math.max(P+k,_));const U=Math.max(0,D-P);po(n,n.dummies.indexOf(T),{type:O,duration:kr(n,O),dirX:L,dirZ:F,knockback:U}),t.hitIds.push(T.id)}}function Gm(n){const t=n.combat,e=n.config.combat.weapons[t.weapon],i=e==null?void 0:e.groundSlam;if(!i||t.slamAttackId===t.attackId)return;const a=t.timings.active;if((a>rn?Math.min(1,Math.max(0,t.phaseTimer/a)):1)<i.slamU-rn)return;t.slamAttackId=t.attackId;const o=n.config.hits,r=n.character.position,l=Math.sin(t.attackFacing),c=Math.cos(t.attackFacing),h=n.config.dummies.radius,u=Math.max(0,i.radius),d=i.onlyUnhit!==!1,f=i.type??(t.weapon==="greatsword"?"knock":"heavy"),m=i.knockback??o.knockback[t.weapon]??0,_=n.config.targeting.idealRange,g=i.holdMul??1.6;for(let p=0;p<n.dummies.length;p++){const y=n.dummies[p];if(d&&t.hitIds.indexOf(y.id)>=0)continue;const x=y.position.x-r.x,v=y.position.z-r.z,w=Math.hypot(x,v);if(w>u+h)continue;const S=w>rn?x/w:l,A=w>rn?v/w:c,T=m>0?Math.max(w+m,_):w,b=Math.max(0,T-w);po(n,p,{type:f,duration:kr(n,f),dirX:S,dirZ:A,knockback:b,holdMul:g}),t.hitIds.push(y.id)}js(n,"ground-slam",u,{x:r.x+l*Math.min(u*.25,.5),y:r.y,z:r.z+c*Math.min(u*.25,.5)})}function Vm(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const a=i.weapon===""?void 0:e.moves[i.weapon];if(!a||!a.enabled||!n.modules.hits||!n.modules.dummies)return;const s=a.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(s.pulseInterval,0);const o=n.character.position,r=i.fromX,l=i.fromZ,c=o.x,h=o.z,u=c-r,d=h-l,f=u*u+d*d,m=Math.sin(i.facing),_=Math.cos(i.facing),g=Math.cos(rd(s.arcDeg,0,180)*Zs),p=n.config.dummies.radius;for(let y=0;y<n.dummies.length;y++){const x=n.dummies[y];if(i.hitIds.indexOf(x.id)>=0)continue;const v=f>rn?rd(((x.position.x-r)*u+(x.position.z-l)*d)/f,0,1):0,w=r+u*v,S=l+d*v,A=Math.hypot(x.position.x-w,x.position.z-S);let T=!1;if(s.shape==="circle")T=A<=s.radius+p;else if(s.shape==="capsule")T=A<=Math.max(s.radius,s.width)+p;else{const O=x.position.x-c,k=x.position.z-h,D=Math.hypot(O,k),U=D>rn?(O*m+k*_)/D>=g:!0;T=D<=s.radius+p&&U||A<=s.width+p}if(!T)continue;const b=x.position.x-r,M=x.position.z-l,P=Math.hypot(b,M);if(P>rn&&(b*m+M*_)/P<Math.cos(Math.max(s.arcDeg,90)*Zs))continue;const L=P>rn?b/P:m,F=P>rn?M/P:_;ih(n,{kind:"dummy",index:y},{type:s.type,duration:s.duration,dirX:L,dirZ:F,knockback:s.knockback}),i.hitIds.push(x.id),js(n,"link-hit",x.id,x.position)}}function Xm(n){const t=n.config.hits,e=n.config.dummies.fighters,i=n.character.position;for(const a of n.events){if(a.type!=="dummy-hit")continue;const s=n.dummies[a.value-1];if(!s)continue;const o=s.weapon?t.reach[s.weapon]??t.dummyReach:t.dummyReach,r=i.x-s.position.x,l=i.z-s.position.z,c=Math.hypot(r,l);if(c>o)continue;const h=c>rn?r/c:0,u=c>rn?l/c:1,f=(s.weapon?Math.max(t.knockback[s.weapon]??0,t.dummyKnockback):t.dummyKnockback)*(s.weapon?(e==null?void 0:e.knockbackScale)??1:1);ih(n,{kind:"player"},{type:s.weapon==="greatsword"?"knock":"light",duration:kr(n,s.weapon==="greatsword"?"knock":"light"),dirX:h,dirZ:u,knockback:f,sourceId:s.id})}}function Wm(n,t){n.modules.hits&&(n.combat.phase==="active"&&(Hm(n),Gm(n)),Vm(n,t),Xm(n))}function rd(n,t,e){return n<t?t:n>e?e:n}const xf=Math.PI/180,ah=1e-6;function Ym(){return{phase:"idle",fromYaw:0,targetYaw:0,dir:1,progress:0,armTime:0}}function yr(n){const t=n.turnInPlace;t.phase="idle",t.fromYaw=0,t.targetYaw=0,t.dir=1,t.progress=0,t.armTime=0}function vf(n,t,e){return n.modules.gaze&&n.gaze.active?n.gaze.centroidYaw:t.aimActive&&Math.hypot(t.aimX,t.aimZ)>ah?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:null}function yf(n,t,e){const i=n.character,a=Math.hypot(i.velocity.x,i.velocity.z),s=Math.hypot(t.moveX,t.moveZ),o=n.combat.phase!=="idle"||n.combat.charging||n.abilities.channeling||n.dash.phase!=="idle"||n.playerLink.phase!=="idle"||n.playerHurt.type!=="none"||t.attackPressed||t.attackHeld||t.skill2Pressed||t.sprintPressed||t.jumpPressed;return i.grounded&&a<=Math.max(0,e.idleSpeedRatio)*Math.max(n.config.moveSpeed,ah)&&s<=Math.max(0,e.inputDeadZone)&&!o}function $m(n){const t=n<0?0:n>1?1:n;return t*t*(3-2*t)}function Zm(n,t){const e=n.config.turnInPlace;if(!e.enabled||!n.modules.turnInPlace||!yf(n,t,e))return!1;const i=vf(n,t,e.lookRange);if(i===null)return!1;const a=Be(i-n.character.bodyYaw);return Math.abs(a)>_f(n,e)}function _f(n,t){const i=n.modules.gaze&&n.gaze.active?Math.max(t.triggerDeg,t.gazeTriggerDeg):t.triggerDeg;return Math.max(0,i)*xf}function jm(n,t,e){const i=n.turnInPlace,a=n.config.turnInPlace;if(!a.enabled||!n.modules.turnInPlace||!yf(n,e,a)){yr(n);return}const s=vf(n,e,a.lookRange);if(s===null){yr(n);return}const o=n.character,r=Be(s-o.bodyYaw),l=Math.abs(r),c=_f(n,a),h=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>ah;if(i.phase==="idle"&&(i.armTime=l>=c?i.armTime+t:0,l>c&&i.armTime>=Math.max(0,a.armSec))){i.phase="active",i.fromYaw=o.bodyYaw,i.dir=r>=0?1:-1;const u=Math.min(l,Math.max(0,a.settleDeg)*xf);i.targetYaw=Be(o.bodyYaw+i.dir*(l-u)),i.progress=0}if(i.phase==="active"){const u=Math.max(a.durationSec,n.config.fixedDt);i.progress=Math.min(1,i.progress+t/u);const d=Be(i.targetYaw-i.fromYaw);o.bodyYaw=Be(i.fromYaw+d*$m(i.progress)),h||(o.facing=o.bodyYaw),i.progress>=1&&(i.phase="idle",i.progress=0,i.armTime=0)}}const aa=1e-6;function Be(n){return Math.atan2(Math.sin(n),Math.cos(n))}function wo(n,t,e,i){const a=Be(t-n);return n+a*(1-Math.exp(-Math.max(e,aa)*i))}function Eo(n,t,e,i,a){const o=Be(t-n)*(1-Math.exp(-Math.max(e,aa)*a)),r=Math.max(i,0)*a;return r<=aa?n:n+ls(o,-r,r)}function cd(n,t,e,i,a){const s=(t-n)*(1-Math.exp(-Math.max(e,aa)*a)),o=Math.max(i,0)*a;return o<=aa?n+s:n+ls(s,-o,o)}function ls(n,t,e){return n<t?t:n>e?e:n}function ld(n,t,e,i){const a=Be(t-n),s=Math.abs(a);return s<=i||s<=e?t:Be(n+Math.sign(a)*Math.max(e,0))}function qm(n,t,e){const i=n.character,a=n.config.orientation,s=n.combat,o=n.modules.gaze&&n.gaze.active,r=n.abilities.channeling,l=s.phase!=="idle"||s.charging||r||n.dash.phase!=="idle",c=o&&!l,h=Math.hypot(e.moveX,e.moveZ),u=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>aa,d=s.charging&&s.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(s.phase!=="idle")i.facing=s.attackFacing;else if(r)i.facing=no(n,e);else if(c)i.facing=Eo(i.facing,n.gaze.centroidYaw,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t);else if(u)i.facing=no(n,e);else if(d)i.facing=n.targeting.targetYaw;else if(h>Math.max(a.facingDeadZone,aa)){const M=Math.atan2(e.moveX,e.moveZ),P=a.facingTurnRate*Math.PI/180*t,L=a.facingSnapDeg*Math.PI/180;if(h>=.35)i.facing=ld(i.facing,M,P,L);else if(h>=a.facingMinMagnitude&&Math.abs(Be(M-i.facing))>a.facingDeadbandDeg*Math.PI/180){const O=wo(i.facing,M,a.facingSmoothRate,t);i.facing=ld(i.facing,O,P,0)}}const f=i.velocity;Math.hypot(f.x,f.z)>.15&&(i.moveYaw=Math.atan2(f.x,f.z));const m=c?n.gaze.centroidYaw:i.facing;n.turnInPlace.phase==="active"||Zm(n,e)||(c?i.bodyYaw=Eo(i.bodyYaw,m,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t):i.bodyYaw=wo(i.bodyYaw,m,a.bodyTurnRate,t));const g=n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;let p=i.facing;if(o?p=c?n.gaze.mainYaw:i.facing:u?p=Math.atan2(e.aimX,e.aimZ):g&&(p=n.targeting.targetYaw),!o){const M=n.config.gaze.headLookLimitDeg*Math.PI/180;Math.abs(Be(p-i.bodyYaw))>M&&(p=i.moveYaw)}const y=o||u||g,x=a.maxHeadTurnDeg*Math.PI/180;let v;if(y){const M=c?n.config.gaze.headTurnRate:a.headTurnRate;v=c?Eo(i.headYaw,p,M,n.config.gaze.maxHeadSpeedDeg*Math.PI/180,t):wo(i.headYaw,p,M,t)}else{const M=Be(i.headYaw-i.bodyYaw),P=Be(p-i.bodyYaw),L=Math.abs(P)<Math.abs(M)-1e-9,F=L?n.config.gaze.headReturnRate:a.headTurnRate,O=L?n.config.gaze.headReturnSpeedDeg*Math.PI/180:Number.POSITIVE_INFINITY,k=Number.isFinite(O)?Eo(M,P,F,O,t):wo(M,P,F,t);v=i.bodyYaw+k}const w=Be(v-i.bodyYaw);w>x?v=i.bodyYaw+x:w<-x&&(v=i.bodyYaw-x),i.headYaw=v;const S=n.config.gaze;let A=0;if(c)A=n.gaze.mainPitch;else if(n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget){const M=n.dummies[n.targeting.targetId-1];if(M){const P=i.position.y+n.config.characterHeight*ls(S.eyeHeightRatio,0,1),L=M.position.y+n.config.dummies.height*ls(S.aimHeightRatio,0,1),F=Math.hypot(M.position.x-i.position.x,M.position.z-i.position.z);A=Math.atan2(L-P,Math.max(aa,F))}}const T=Math.max(0,S.maxHeadPitchDeg)*Math.PI/180;A=ls(A,-T,T);const b=y?S.headPitchRate:Math.min(S.headPitchRate,S.headReturnRate);i.headPitch=cd(i.headPitch,A,b,Math.max(0,S.maxHeadPitchDeg)*4*Math.PI/180,t),i.bodyPitch=cd(i.bodyPitch,i.headPitch*ls(S.bodyPitchScale,0,1),S.bodyPitchRate,Math.max(0,S.maxHeadPitchDeg)*Math.PI/180,t)}const Mf=1e-6,Ir=Math.PI/180;function zr(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Km(n,t,e){const i=n.character.position,a=Math.max(0,e.homingConeDeg)*Ir,s=Math.max(0,e.homingRange),o=[];for(let r=0;r<n.dummies.length;r++){const l=n.dummies[r],c=l.position.x-i.x,h=l.position.z-i.z,u=Math.hypot(c,h);u<.001||u>s||Math.abs(Be(Math.atan2(c,h)-t))>a||o.push({i:r,d:u})}return o.sort((r,l)=>r.d-l.d||r.i-l.i),o.map(r=>r.i)}function Jm(n,t){const e=Math.sin((n+1)*12.9898+(t+1)*78.233)*43758.5453;return e-Math.floor(e)}function Qm(n,t){const e=n.abilities,i=n.character.position,a=Math.max(1,Math.floor(t.perWave)),s=t.spreadDeg*Ir,o=Math.max(0,t.spawnSideStep),r=Math.max(0,Math.min(1,t.speedJitter)),l=Km(n,e.channelYaw,t);for(let c=0;c<a;c++){const h=(c-(a-1)*.5)*s,u=e.channelYaw+h,d=(c-(a-1)*.5)*o,f=Math.sin(u),m=Math.cos(u);e.pending.push({delay:c*Math.max(0,t.spawnDelay),x:i.x+f*.5+Math.cos(u)*d,y:i.y+1,z:i.z+m*.5-Math.sin(u)*d,yaw:u,speed:t.speed*(1+(Jm(e.waveIndex,c)*2-1)*r),targetIndex:l.length>0?l[c%l.length]:-1,wave:e.waveIndex})}zr(n,"arcane-wave",e.waveIndex,{x:i.x,y:i.y+1,z:i.z})}function t0(n,t,e){const i=n.abilities;if(i.pending.length===0)return;const a=[];for(const s of i.pending){if(s.delay-=t,s.delay>0){a.push(s);continue}const o={id:++i.nextId,x:s.x,y:s.y,z:s.z,dirX:Math.sin(s.yaw),dirZ:Math.cos(s.yaw),speed:s.speed,life:e.life,radius:e.radius,targetIndex:s.targetIndex,turnRate:Math.max(0,e.turnRateDeg)*Ir,homing:Math.max(0,e.homingTime),spread:Math.max(0,e.spreadTime),retarget:0,wave:s.wave};i.projectiles.push(o),i.volleyId+=1,zr(n,"projectile-fire",i.volleyId,o)}i.pending=a}function hd(n,t){const e=n.abilities;e.channeling&&(e.channeling=!1,e.fireTimer=0,e.cooldown=Math.max(0,t.cooldown),e.channelMoveScale=1,e.needsRelease=!0,zr(n,"channel-end",0,n.character.position))}function e0(n,t,e,i,a,s){const o=n.abilities,r=n.dash.phase==="active",l=n.playerLink,c=s==="skill2"?e.skill2Pressed:e.attackHeld,h=a&&c&&!r&&l.phase==="idle"&&!l.consumedAttack;if(o.cooldown>0&&(o.cooldown=Math.max(0,o.cooldown-t)),o.needsRelease&&!h&&(o.needsRelease=!1),o.channeling){if(!h){hd(n,i);return}}else{if(!(h&&!o.needsRelease&&o.cooldown<=0))return;o.channeling=!0,o.channelId+=1,o.waveIndex=0,o.fireTimer=0,o.channelMoveScale=Math.max(0,Math.min(1,i.moveScale)),zr(n,"channel-start",o.channelId,n.character.position)}o.channelYaw=no(n,e),o.fireTimer-=t;let u=0;for(;o.fireTimer<=0&&u++<8;)if(o.fireTimer+=Math.max(i.waveInterval,Mf),Qm(n,i),o.waveIndex+=1,o.waveIndex>=Math.max(1,Math.floor(i.waves))){hd(n,i);break}}function n0(n,t,e){const i=Math.max(0,e.homingConeDeg)*Ir,a=Math.max(0,e.homingRange),s=Math.atan2(t.dirX,t.dirZ);let o=-1,r=a+Mf;for(let l=0;l<n.dummies.length;l++){const c=n.dummies[l],h=c.position.x-t.x,u=c.position.z-t.z,d=Math.hypot(h,u);d<.001||d>r||Math.abs(Be(Math.atan2(h,u)-s))>i||(o=l,r=d)}return o}function i0(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.projectiles){if(r.spread>0)r.spread=Math.max(0,r.spread-t);else if(r.homing>0&&(r.homing=Math.max(0,r.homing-t)),r.retarget-=t,r.retarget<=0&&(r.retarget=Math.max(.05,e.retargetInterval),r.targetIndex=n0(n,r,e)),r.targetIndex>=0&&r.turnRate>0&&r.homing>0){const c=n.dummies[r.targetIndex];if(!c)r.targetIndex=-1;else{const h=Math.atan2(c.position.x-r.x,c.position.z-r.z),u=Math.atan2(r.dirX,r.dirZ),d=Be(h-u),f=r.turnRate*t,m=Math.max(-f,Math.min(f,d)),_=u+m;r.dirX=Math.sin(_),r.dirZ=Math.cos(_)}}if(r.x+=r.dirX*r.speed*t,r.z+=r.dirZ*r.speed*t,r.life-=t,r.life<=0)continue;let l=!1;if(s)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],u=h.position.x-r.x,d=h.position.z-r.z,f=r.radius+a;if(!(u*u+d*d>f*f)){po(n,c,{type:e.hurtType,duration:e.hurtDuration,dirX:r.dirX,dirZ:r.dirZ,knockback:e.knockback}),l=!0;break}}l||o.push(r)}i.projectiles=o}const a0={kind:"channelVolley",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params;e0(n,t,e,s,a,i.cfg.slot),t0(n,t,s),i0(n,t,s)}},nc=1e-6;function bf(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function s0(n,t){const e=n.character.position,i={id:++n.abilities.nextId,x:e.x,z:e.z,radius:t.radius,life:t.duration,duration:t.duration,pulseTimer:0};n.abilities.rings.push(i),bf(n,"ring-place",i.id,e)}function o0(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.rings){r.life-=t,r.pulseTimer-=t;let l=0;for(;r.pulseTimer<=0&&l++<8;){if(r.pulseTimer+=Math.max(e.pulseInterval,nc),s)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],u=h.position.x-r.x,d=h.position.z-r.z,f=r.radius+a;if(u*u+d*d>f*f)continue;const m=Math.hypot(u,d),_=m>nc?u/m:0,g=m>nc?d/m:1;po(n,c,{type:"heavy",duration:e.stun,dirX:_,dirZ:g,knockback:e.knockback})}bf(n,"ring-pulse",r.id,{x:r.x,y:0,z:r.z})}r.life>0&&o.push(r)}i.rings=o}const r0={kind:"groundRing",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params,o=i.cfg.slot==="attack"?e.attackPressed:e.skill2Pressed;a&&o&&n.dash.phase!=="active"&&n.playerLink.phase==="idle"&&s0(n,s),o0(n,t,s)}},c0={channelVolley:a0,groundRing:r0};function l0(n){const t=Array.isArray(n.skills)?n.skills:[],e=n.abilities;return t.map(i=>{if(i.params)return{cfg:i,params:i.params};const a=i.paramsRef,s=a?e[a]:void 0;if(!s||typeof s!="object")throw new Error(`[skills] ${i.id}: paramsRef "${a??""}" 在 core.abilities 中不存在`);return{cfg:i,params:s}})}function h0(n,t,e){for(const i of n.skills){if(i.cfg.enabled===!1)continue;const a=c0[i.cfg.kind];if(!a)continue;const s=!i.cfg.weapon||n.combat.weapon===i.cfg.weapon;a.update({world:n,dt:t,intents:e,skill:i,onWeapon:s})}}function d0(){return{channeling:!1,channelYaw:0,fireTimer:0,waveIndex:0,cooldown:0,needsRelease:!1,channelId:0,channelMoveScale:1,volleyId:0,pending:[],projectiles:[],rings:[],nextId:0}}function Sf(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.waveIndex=0,t.cooldown=0,t.needsRelease=!1,t.channelMoveScale=1,t.pending.length=0,t.projectiles.length=0,t.rings.length=0}function u0(n,t,e){h0(n,t,e)}function ic(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const dd=1e-6;function ud(n,t,e){return n<t?t:n>e?e:n}function wf(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function Ef(n){const t=n.camera,e=wf();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function f0(n){const t=n.camera,e=n.config.camera,i=n.character.position;let a=0,s=0,o=0,r=0;for(const c of n.dummies){const h=c.position.x-i.x,u=c.position.z-i.z,d=Math.hypot(h,u);if(d>e.radius)continue;const f=ud((e.radius-d)/Math.max(dd,e.radius-e.nearDistance),0,1);let m=f*(e.modeWeight[c.mode]??.5);c.attackPhase==="active"&&(m+=e.attackBoost*f),a+=m,s+=c.position.x*m,o+=c.position.z*m,r+=1}const l=a<=0?0:ud(a/(a+Math.max(dd,e.saturation)),0,1);if(t.threat=l,t.threatCount=r,a<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const c=s/a,h=o/a;t.centroidX=c,t.centroidZ=h;let u=(c-i.x)*e.framingBias*l,d=(h-i.z)*e.framingBias*l;const f=Math.hypot(u,d);f>e.maxOffset&&(u=u/f*e.maxOffset,d=d/f*e.maxOffset),t.offsetX=u,t.offsetZ=d}t.distanceScale=1-e.pushIn*(1-l)+e.maxPullback*l,t.pitchDelta=e.maxPitchDelta*l}function p0(n){const t=[],e=n.ground.size;t.push(Va("ground","ground",0,0,e,e,-n.ground.thickness,0));for(const i of n.steps)t.push(Va(i.id,"step",i.x,i.z,i.width,i.depth,0,i.height));for(const i of n.doorways){const a=i.openingWidth/2,s=i.wallThickness;t.push(Va(`${i.id}-left`,"wall",i.x-a-i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push(Va(`${i.id}-right`,"wall",i.x+a+i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push(Va(`${i.id}-lintel`,"lintel",i.x,i.z,i.openingWidth,s,i.openingHeight,i.wallHeight))}for(const i of n.obstacles)t.push(Va(i.id,"obstacle",i.x,i.z,i.width,i.depth,0,i.height));return t}function Va(n,t,e,i,a,s,o,r){return{id:n,kind:t,minX:e-a/2,maxX:e+a/2,minY:o,maxY:r,minZ:i-s/2,maxZ:i+s/2}}const Ni=1e-6;function _r(n,t,e){return n<t?t:n>e?e:n}function io(n,t,e,i,a,s,o){const r=a*.85;let l=Number.NEGATIVE_INFINITY;for(const c of n)c.maxY>i+s+Ni||c.maxY<i-o-Ni||t+r<c.minX||t-r>c.maxX||e+r<c.minZ||e-r>c.maxZ||c.maxY>l&&(l=c.maxY);return l}function m0(n,t,e,i,a=0,s=.05){let o=Number.NEGATIVE_INFINITY;for(const r of n)r.maxY>i+s||t<r.minX||t>r.maxX||e<r.minZ||e>r.maxZ||r.maxY>o&&(o=r.maxY);return o===Number.NEGATIVE_INFINITY?a:o}function sh(n,t,e,i,a){let s=!1;const o=t.y+i;for(let r=0;r<2;r++)for(const l of n){if(l.maxY<=t.y+a+Ni||l.minY>=o-Ni)continue;const c=_r(t.x,l.minX,l.maxX),h=_r(t.z,l.minZ,l.maxZ),u=t.x-c,d=t.z-h,f=u*u+d*d;if(!(f>=e*e))if(s=!0,f>Ni*Ni){const m=Math.sqrt(f),_=(e-m)/m;t.x+=u*_,t.z+=d*_}else{const m=t.x-l.minX,_=l.maxX-t.x,g=t.z-l.minZ,p=l.maxZ-t.z,y=Math.min(m,_,g,p);y===m?t.x=l.minX-e:y===_?t.x=l.maxX+e:y===g?t.z=l.minZ-e:t.z=l.maxZ+e}}return s}function oh(n,t,e,i,a){const s=t.y+i;for(const o of n){if(o.maxY<=t.y+a+Ni||o.minY>=s-Ni)continue;const r=_r(t.x,o.minX,o.maxX),l=_r(t.z,o.minZ,o.maxZ),c=t.x-r,h=t.z-l;if(c*c+h*h<e*e-Ni)return!0}return!1}const na=1e-6,_s=Math.PI/180;function rh(n){return Math.atan2(Math.sin(n),Math.cos(n))}function qc(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Tf(n){n.arrows.length=0}function g0(n,t,e,i,a,s,o,r,l,c,h){const u=i-n,d=s-e,f=u*u+d*d;let m=0;f>na&&(m=((o-n)*u+(r-e)*d)/f,m=Math.max(0,Math.min(1,m)));const _=n+u*m,g=e+d*m,p=_-o,y=g-r;if(p*p+y*y>h*h)return-1;const x=t+(a-t)*m;return x<l-.1||x>l+c?-1:m}function x0(n,t){const e=n.config.combat.bow.trajectory,i=Math.max(0,e.homingRange);if(i<=na)return-1;const a=n.character.position,s=Math.max(0,e.homingConeDeg)*_s,o=n.config.targeting.targetAssist&&n.modules.targeting?n.targeting:null,r=o&&o.hasTarget?o.targetId:0;let l=-1,c=i+na;for(const h of n.dummies){if(!n.modules.dummies)break;const u=h.position.x-a.x,d=h.position.z-a.z,f=Math.hypot(u,d);if(!(f<.001||f>i)){if(h.id===r)return h.id;Math.abs(rh(Math.atan2(u,d)-t))>s||f<c&&(l=h.id,c=f)}}return l}function v0(n,t,e){if(e<=0)return t;const i=n.dummies.find(r=>r.id===e);if(!i)return t;const a=n.character.position,s=Math.atan2(i.position.x-a.x,i.position.z-a.z),o=Math.max(0,n.config.combat.bow.trajectory.homingConeDeg)*_s;return t+fs(rh(s-t),-o,o)}function y0(n,t,e,i,a,s){const o=n.config.combat.bow.trajectory,r={vy:s*Math.sin(Math.max(0,o.launchPitchDeg)*_s),horizontal:0};if(r.horizontal=s*Math.cos(Math.max(0,o.launchPitchDeg)*_s),a<=0)return r;const l=n.dummies.find(_=>_.id===a);if(!l)return r;const c=Math.hypot(l.position.x-t,l.position.z-i);if(c<.4)return r;const h=c/Math.max(na,s),u=l.position.y+n.config.dummies.height*fs(o.aimHeightRatio,0,1),d=Math.max(0,o.gravity),f=(u-e+.5*d*h*h)/h,m=fs(f,-s*.45,s*.92);return{vy:m,horizontal:Math.sqrt(Math.max(0,s*s-m*m))}}function _0(n,t,e){const i=n.config.combat.bow.trajectory,a=Math.max(0,Math.min(1,t)),s=i.speedMin+(i.speedMax-i.speedMin)*a,o=n.character.position,r=x0(n,e),l=v0(n,e,r),c=Math.sin(l),h=Math.cos(l),u=o.x+Math.sin(e)*.55,d=o.z+Math.cos(e)*.55,f=o.y+.95,m=y0(n,u,f,d,r,s),_={id:++n.arrowSeq,x:u,y:f,z:d,vx:c*m.horizontal,vy:m.vy,vz:h*m.horizontal,life:Math.max(.1,i.maxLife),stuck:!1,stuckDummy:-1,offX:0,offY:0,offZ:0,yaw:e,localYaw:0,pitch:0,rest:0,hit:!1,targetId:r,homing:Math.max(0,i.homingTime),turnRate:Math.max(0,i.turnRateDeg)*_s};return n.arrows.push(_),qc(n,"arrow-shot",a,_),_}function fs(n,t,e){return n<t?t:n>e?e:n}function M0(n,t){const e=n.arrows;if(e.length===0)return;const i=n.config.combat.bow.trajectory,a=n.config.dummies.radius,s=n.config.dummies.height,o=n.modules.hits&&n.modules.dummies,r=Math.max(0,i.gravity),l=[];for(const c of e){if(c.stuck){if(c.rest-=t,c.rest<=0)continue;if(c.stuckDummy>=0){const v=n.dummies[c.stuckDummy];if(v){const w=Math.cos(v.bodyYaw),S=Math.sin(v.bodyYaw);c.x=v.position.x+c.offX*w+c.offZ*S,c.y=v.position.y+c.offY,c.z=v.position.z-c.offX*S+c.offZ*w,c.yaw=v.bodyYaw+c.localYaw}}l.push(c);continue}if(c.life-=t,c.life<=0)continue;const h=c.x,u=c.y,d=c.z;if(c.homing>0&&(c.homing=Math.max(0,c.homing-t),c.targetId>0&&c.turnRate>0)){const v=n.dummies.find(w=>w.id===c.targetId);if(!v)c.targetId=0;else{const w=Math.hypot(c.vx,c.vz);if(w>na){const S=Math.atan2(v.position.x-c.x,v.position.z-c.z),A=Math.atan2(c.vx,c.vz),T=c.turnRate*t,b=A+fs(rh(S-A),-T,T);c.vx=Math.sin(b)*w,c.vz=Math.cos(b)*w;const M=Math.hypot(v.position.x-c.x,v.position.z-c.z);if(M>.3){const P=M/w,F=(v.position.y+s*fs(i.aimHeightRatio,0,1)-c.y+.5*r*P*P)/P,O=Math.max(0,i.verticalTurnRate)*t;c.vy+=fs(F-c.vy,-O,O)}}}}c.yaw=Math.atan2(c.vx,c.vz),c.pitch=-Math.atan2(c.vy,Math.hypot(c.vx,c.vz)),c.vy-=r*t;const f=h+c.vx*t,m=u+c.vy*t,_=d+c.vz*t;let g=-1,p=2;if(o)for(let v=0;v<n.dummies.length;v++){const w=n.dummies[v],S=g0(h,u,d,f,m,_,w.position.x,w.position.z,w.position.y,s,a+i.radius);S>=0&&S<p&&(p=S,g=v)}if(g>=0){const v=n.dummies[g];c.x=h+(f-h)*p,c.y=u+(m-u)*p,c.z=d+(_-d)*p,c.stuck=!0,c.stuckDummy=g;const w=Math.cos(v.bodyYaw),S=Math.sin(v.bodyYaw),A=c.x-v.position.x,T=c.z-v.position.z;c.offX=A*w-T*S,c.offZ=A*S+T*w,c.offY=c.y-v.position.y;const b=Math.atan2(c.vx,c.vz);c.localYaw=b-v.bodyYaw,c.yaw=b,c.pitch=Math.atan2(-c.vy,Math.hypot(c.vx,c.vz)),c.rest=Math.max(.2,i.stickSec),c.hit=!0;const M=Math.hypot(c.vx,c.vz);po(n,g,{type:"light",duration:.22,dirX:M>na?c.vx/M:0,dirZ:M>na?c.vz/M:1,knockback:.14}),qc(n,"arrow-land",v.id,c),l.push(c);continue}const y=io(n.boxes,f,_,m+.4,.04,0,6),x=Number.isFinite(y)?y:0;if(m<=x+.02&&c.vy<0){c.x=f,c.y=x+Math.max(0,i.groundStickLift),c.z=_,c.stuck=!0,c.stuckDummy=-1,c.yaw=Math.atan2(c.vx,c.vz);const v=Math.atan2(-c.vy,Math.max(na,Math.hypot(c.vx,c.vz)));c.pitch=Math.max(v,Math.max(0,i.stickMinPitchDeg)*_s),c.rest=Math.max(.2,i.stickSec),qc(n,"arrow-land",-1,c),l.push(c);continue}c.x=f,c.y=m,c.z=_,l.push(c)}n.arrows=l}const Kc=1e-6,b0=Math.PI/180;function Jc(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function ch(n,t,e){return n<t?t:n>e?e:n}function Fr(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function Qc(n){const t=n.id,e=n.windowId;Object.assign(n,Fr()),n.id=t,n.windowId=e}function S0(n){Qc(n)}function Af(n){Qc(n.playerLink);for(const t of n.dummies)Qc(t.link)}function w0(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function tl(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const a=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;a<=0||(i.linkWindow=Math.max(i.linkWindow,a),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function Mr(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,Fr()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function E0(n,t){const e=n.config.links.search,i=n.character.position,a=ch(e.maxAngleDeg,0,180)*b0;let s=0,o=t,r=Number.POSITIVE_INFINITY;for(const l of n.dummies){const c=l.position.x-i.x,h=l.position.z-i.z,u=Math.hypot(c,h);if(u<Kc||u>e.range)continue;const d=Math.atan2(c,h);Math.abs(Be(d-t))>a||u<r&&(r=u,s=l.id,o=d)}return{id:s,yaw:o,dist:s>0?r:0}}function T0(n,t,e,i){const a=n.config.links,s=n.playerLink,o=n.character.position,r=no(n,t),l=E0(n,r),c=l.id>0?l.yaw:r,h=l.id>0?ch(l.dist-a.search.stopDistance,0,e.distance):a.noTargetFallback?e.distance:0;s.phase="windup",s.linkWindow=0,s.source="none",s.usedWindowId=s.windowId,s.cooldown=a.sharedCooldown,s.kind=e.kind,s.weapon=i,s.id+=1,s.timer=0,s.progress=0,s.facing=c,s.targetId=l.id,s.targetDist=l.dist,s.travel=h,s.travelled=0,s.fromX=o.x,s.fromZ=o.z,s.pulseTimer=0,s.hitIds=[],s.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,a.sharedCooldown),Jc(n,"link-start",s.id)}function A0(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){Mr(n);return}if(e.weapon!==n.combat.weapon){Mr(n);return}e.timer+=t;const a=l=>l==="windup"?i.windup:l==="active"?i.active:i.recovery;let s=0;for(;e.phase!=="idle"&&s++<8;){const l=a(e.phase);if(e.timer<l)break;e.timer-=l,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,Jc(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,Jc(n,"link-end",e.id))}const o=i.windup+i.active+i.recovery;let r=0;if(e.phase==="windup"?r=e.timer:e.phase==="active"?r=i.windup+e.timer:e.phase==="recovery"?r=i.windup+i.active+e.timer:r=o,e.progress=o>0?ch(r/o,0,1):1,e.phase==="active"&&i.active>Kc){const l=Math.max(0,e.travel-e.travelled),c=Math.max(Kc,i.active-e.timer),h=l/c;n.impulse.x=Math.sin(e.facing)*h,n.impulse.z=Math.cos(e.facing)*h}}function R0(n,t,e){const i=n.config.links,a=n.playerLink,s=n.character.position;if(a.consumedAttack=!1,n.combat.hitstop>0)return;if(a.phase==="active"&&(a.travelled+=Math.hypot(s.x-a.fromX,s.z-a.fromZ)),a.fromX=s.x,a.fromZ=s.z,!i.enabled||!n.modules.links){a.phase!=="idle"&&Mr(n);return}const o=n.combat,r=n.character.sprinting;r&&i.triggerWhileSprinting&&a.phase==="idle"&&a.usedWindowId!==a.windowId&&i.windows.sprint>0&&(a.linkWindow=Math.max(a.linkWindow,i.windows.sprint),a.source="sprint"),a.phase==="idle"&&a.prevSprinting&&!r&&tl(n,"sprint"),a.prevSprinting=r,A0(n,t);const l=i.moves[o.weapon];e.attackPressed&&a.phase==="idle"&&a.linkWindow>0&&a.usedWindowId!==a.windowId&&a.cooldown<=0&&o.phase==="idle"&&!o.charging&&n.dash.phase==="idle"&&!!l&&l.enabled&&T0(n,e,l,o.weapon)}const cr={windup:0,active:1,recovery:2},fd=1e-9;function Rf(n){return Number.isFinite(n)?n<0?0:n>1?1:n:0}function P0(n){return n==="windup"||n==="active"||n==="recovery"}function C0(n,t){return cr[n]+Rf(t)}function L0(n,t,e){if(!n||n.length===0)return[];if(!Number.isFinite(e)||e<0)return[];const i=Number.isFinite(t)?t:-1,a=[];for(const s of n){if(!s||!P0(s.at))continue;const o=Rf(s.u??0),r=cr[s.at]+o;r>i+fd&&r<=e+fd&&a.push({name:s.name,value:Number.isFinite(s.value)?s.value:0,at:s.at,u:o})}return a.sort((s,o)=>cr[s.at]+s.u-(cr[o.at]+o.u)),a}const ao=1e-6;function ia(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function D0(n,t,e){const i=n.character.position;n.events.push({type:"notify",tick:n.tick,x:i.x,y:i.y,z:i.z,value:e,name:t})}function Pf(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function Ur(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.hitstop=0,t.notifyCursor=-1,t.hitIds.length=0,t.warp=1,t.warpDebt=0,t.warpPhase=0,t.warpTimer=0,t.slamAttackId=0,t.timings=Pf()}function Cf(n){return{weapon:ra[Math.max(0,n-1)]??ra[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,hitstop:0,notifyCursor:-1,hitIds:[],warp:1,warpDebt:0,warpPhase:0,warpTimer:0,slamAttackId:0,timings:Pf()}}function k0(n,t){return no(n,t)}function I0(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,a=Math.max(0,t*e.maxLungeScale),s=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+s,a)}function Lf(n,t,e,i){const a=n.combat;a.phase="windup",a.phaseTimer=0,a.comboIndex=i,a.queued=!1,a.charging=!1,a.charge=0,a.attackFacing=k0(n,t),a.attackProgress=0,a.timings=e,a.attackId+=1,a.warpDebt=0,a.warpPhase=0,a.warpTimer=0,a.warp=1,a.notifyCursor=-1,a.hitIds.length=0,ia(n,"attack-start",i)}function Df(n){return Math.max(0,n.config.combat.settle)}function el(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];Lf(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Df(n),lunge:I0(n,i.lunge[e-1]??0)},e)}function pd(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,Lf(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Df(n),lunge:i.lunge},0),_0(n,e,n.combat.attackFacing),ia(n,"charge-release",e)}function z0(n,t){const e=n.combat,i=n.config.hits.hitstopWarp;if(!i||!i.enabled)return e.warp=e.hitstop>0?0:1,e.warp;const a=Math.max(0,Math.min(1,i.holdRate));if(e.hitstop>0)return e.warpPhase=1,e.warpTimer=e.hitstop,e.warp=a,e.warpDebt+=t*(1-a),e.warp;if(e.warpPhase===1&&(e.warpPhase=2,e.warpTimer=0),e.warpPhase===2){const s=Math.max(.001,i.release);e.warpTimer+=t;const o=Math.min(1,e.warpTimer/s),r=1-(1-o)*(1-o),l=a+(1-a)*r;if(e.warp=l,e.warpDebt+=t*(1-l),o>=1){e.warpPhase=3,e.warpTimer=0;const c=Math.max(0,e.timings.recovery)*Math.max(0,i.payback-1)*Math.max(0,Math.min(1,i.paybackBudget));e.warpDebt=Math.min(e.warpDebt,c)}return e.warp}if(e.warpPhase===3&&e.warpDebt>1e-6){const s=Math.min(Math.max(0,i.payback-1),e.warpDebt/Math.max(t,1e-5));return e.warp=1+s,e.warpDebt=Math.max(0,e.warpDebt-t*s),e.warpDebt<=1e-6&&(e.warpPhase=0,e.warp=1),e.warp}return e.warpPhase=0,e.warp=1,1}function F0(n,t,e){const i=n.combat;if(i.phase==="idle"){i.warp=1,i.warpPhase=0,i.warpTimer=0,i.warpDebt=0;return}const a=i.timings,s=z0(n,t),o=t*s;i.phaseTimer+=o;let r=0;for(;i.phase!=="idle"&&r++<8;){const h=i.phase==="windup"?a.windup:i.phase==="active"?a.active:i.phase==="recovery"?a.recovery:a.settle;if(i.phaseTimer<h)break;if(i.phaseTimer-=h,i.phase==="windup")i.phase="active",ia(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",i.warpPhase=0,i.warpDebt=0,i.warpTimer=0,i.warp=1,ia(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.weapons[i.weapon].comboWindow??n.config.combat.comboWindow,i.queued){i.queued=!1;const u=n.config.combat.weapons[i.weapon];u.comboCount>0&&el(n,e,i.comboIndex<u.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const h=i.timings.recovery;if(h>ao&&i.phaseTimer>=h*n.config.combat.cancelWindow){i.queued=!1;const u=n.config.combat.weapons[i.weapon];u.comboCount>0&&el(n,e,i.comboIndex<u.comboCount?i.comboIndex+1:1)}}const l=a.windup+a.active+a.recovery;let c=0;i.phase==="windup"?c=i.phaseTimer:i.phase==="active"?c=a.windup+i.phaseTimer:i.phase==="recovery"?c=a.windup+a.active+i.phaseTimer:i.phase==="settle"&&(c=l),i.phase!=="idle"&&(i.attackProgress=l>0?Math.min(1,c/l):1),U0(n)}function U0(n){const t=n.combat;if(t.phase==="idle")return;const e=t.timings,i=t.phase==="windup"?e.windup:t.phase==="active"?e.active:t.phase==="recovery"?e.recovery:0,a=i>ao?Math.min(1,Math.max(0,t.phaseTimer/i)):1,s=t.phase==="settle"?3:C0(t.phase,a);if(s<=t.notifyCursor+ao)return;const o=n.config.combat.weapons[t.weapon].notifies;for(const r of L0(o,t.notifyCursor,s))D0(n,r.name,r.value);t.notifyCursor=s}function N0(n,t,e){const i=n.combat,a=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=ra.length){const l=ra[e.weaponSlot-1];l!==i.weapon&&(i.weapon=l,Ur(n),Mr(n),ia(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,ia(n,"combo-reset",0))),i.hitstop>0&&(n.impulse.x=0,n.impulse.z=0,n.character.velocity.x=0,n.character.velocity.z=0),F0(n,t,e);const s=a.weapons[i.weapon],o=n.dash.phase==="active";if(s.comboCount>0){const l=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!o&&!l&&(e.attackPressed||a.autoCombo&&e.attackHeld))if(i.phase==="idle"){const h=i.comboWindow>0&&i.comboIndex<s.comboCount?i.comboIndex+1:1;el(n,e,h)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&!o&&!n.playerLink.consumedAttack){if(e.attackHeld){if(i.charging||(i.charging=!0,i.charge=0,ia(n,"charge-start",0)),i.charge=Math.min(1,i.charge+t/Math.max(a.bow.maxChargeTime,ao)),a.bow.autoFire&&i.charge>=1){i.charging=!1;const l=i.charge;i.charge=0,pd(n,e,l)}}else if(i.charging){i.charging=!1;const l=i.charge;i.charge=0,l>=a.bow.minChargeToFire?pd(n,e,l):ia(n,"charge-release",0)}}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.hitstop<=0&&i.timings.active>ao)){const l=i.timings.active,c=Math.max(0,i.timings.lunge),h=Math.max(.2,a.lungeCurve),u=g=>c*(1-Math.pow(1-Math.min(1,Math.max(0,g/l)),h+1)),d=t*i.warp,f=Math.min(l,Math.max(0,i.phaseTimer)),m=Math.min(l,Math.max(0,i.phaseTimer-d));let _=Math.max(0,u(f)-u(m))/Math.max(d,1e-4);_=Math.min(_,Math.max(0,a.lungeMaxSpeed)),n.impulse.x=Math.sin(i.attackFacing)*_,n.impulse.z=Math.cos(i.attackFacing)*_}i.hitstop>0&&(i.hitstop=Math.max(0,i.hitstop-t))}const nl=1e-6;function ac(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function O0(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function kf(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function md(n,t,e){return n<t?t:n>e?e:n}function B0(n,t,e){const i=n.config.dash,s=n.character.position,o=n.config.worldBounds,r=Math.max(.05,i.blinkStep),l=Math.max(0,i.blinkDistance);let c=0,h=s.x,u=s.z;for(;c<l-nl;){const d=Math.min(l,c+r),f=s.x+t*d,m=s.z+e*d,_=md(f,o.minX,o.maxX),g=md(m,o.minZ,o.maxZ),p={x:_,y:s.y,z:g};if(oh(n.boxes,p,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(h=_,u=g,c=d,_!==f||g!==m))break}return{x:h,z:u}}function H0(n,t,e){const i=n.dash,a=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,tl(n,"roll")),i.cooldown>0){const l=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),l>0&&i.cooldown===0&&ac(n,"dash-ready",0)}const s=n.combat,o=s.weapon==="bow"&&(s.charging||s.phase!=="idle");if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&(s.phase==="idle"||o)&&n.playerLink.phase==="idle"){o&&(s.charging=!1,s.charge=0,s.phase!=="idle"&&Ur(n));const l=Nm(n,e),c=l.x,h=l.z,u=n.combat.weapon==="staff";if(i.kind=u?"blink":"roll",i.dirX=c,i.dirZ=h,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=u?a.blinkCooldown:a.rollCooldown,u){const d=B0(n,c,h);n.character.position.x=d.x,n.character.position.z=d.z,i.toX=d.x,i.toZ=d.z,i.duration=0,i.timer=0,i.phase="idle",a.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),tl(n,"blink"),ac(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(nl,a.rollDuration),i.timer=i.duration,i.toX=i.fromX+c*a.rollDistance,i.toZ=i.fromZ+h*a.rollDistance,ac(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const l=Math.max(nl,i.timer),c=n.character.position.x,h=n.character.position.z;n.impulse.x=(i.toX-c)/l,n.impulse.z=(i.toZ-h)/l}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const mn=1e-6,il=Math.PI*2,G0=7,V0=18;function X0(n){return Math.atan2(Math.sin(n),Math.cos(n))}function gd(n,t,e,i){return n+X0(t-n)*(1-Math.exp(-Math.max(e,mn)*i))}function lh(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function W0(n){var i;const t=[];for(let a=0;a<n.count;a++){const s=n.spawn[a]??{x:0,z:0},o=n.initialModes[a]??"idle";t.push(xd(a+1,o,s.x,s.z,null))}const e=n.fighters;if(e)for(let a=0;a<e.weapons.length;a++){const s=e.spawn[a]??{x:0,z:0},o=((i=e.initialModes)==null?void 0:i[a])??"spar",r=e.attackInterval*(.25+.22*a);t.push(xd(t.length+1,o,s.x,s.z,e.weapons[a],r))}return t}function xd(n,t,e,i,a,s=0){return{id:n,mode:t,initialMode:t,homeX:e,homeZ:i,position:{x:e,y:0,z:i},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:e,targetZ:i,wanderTimer:0,attackCooldown:s,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,hurt:gf(),link:Fr(),weapon:a,combat:a?{...Cf(ra.indexOf(a)+1),weapon:a}:null}}function Y0(n,t=!1){const e=t?pf:Um,i=e.indexOf(n);return e[(i+1)%e.length]}function If(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],a=t.spawn[e]??{x:i.homeX,z:i.homeZ},s=t.initialModes[e]??i.initialMode;i.mode=s,i.initialMode=s,i.homeX=a.x,i.homeZ=a.z,i.position.x=a.x,i.position.y=0,i.position.z=a.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=a.x,i.targetZ=a.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0;const o=i.hurt;if(o.type="none",o.timer=0,o.duration=0,o.dirX=0,o.dirZ=0,o.knockX=0,o.knockZ=0,S0(i.link),i.combat){const r=i.combat;r.phase="idle",r.comboIndex=0,r.phaseTimer=0,r.attackProgress=0,r.attackFacing=0,r.charging=!1,r.charge=0,r.hitstop=0,r.warp=1,r.warpPhase=0,r.warpDebt=0,r.warpTimer=0,r.hitIds.length=0,r.timings={windup:0,active:0,recovery:0,settle:0,lunge:0}}}n.dummyAttackCount=0}function $0(n,t,e){const i=ic(n)*il,a=Math.sqrt(ic(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*a,t.targetZ=t.homeZ+Math.sin(i)*a,t.wanderTimer=e.wanderInterval*(.6+ic(n)*.8)}function hh(n,t,e){if(t.weapon){const i=n.config.combat.weapons[t.weapon];if(i)return{windup:i.windup,active:i.active,recovery:i.recovery}}return{windup:e.attackWindup,active:e.attackActive,recovery:e.attackRecovery}}function al(n,t,e){var s;if(!t.weapon)return e.attackRange;const i=n.config.hits.reach[t.weapon]??e.attackRange,a=((s=e.fighters)==null?void 0:s.attackRangeScale)??.9;return Math.max(.4,i*a)}function Z0(n,t){return n.weapon&&t.fighters?t.fighters.attackInterval:t.attackInterval}function j0(n,t){return n.weapon&&t.fighters?Math.max(t.leashRadius,t.fighters.leashRadius):t.leashRadius}function q0(n,t,e){const i=hh(e,n,t);return n.attackPhase==="windup"?i.windup:n.attackPhase==="active"?i.active:n.attackPhase==="recovery"?i.recovery:0}function K0(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0,vd(n,t,i);return}t.attackPhaseTimer+=e;let a=0;for(;t.attackPhase!=="idle"&&a++<4;){const l=Math.max(q0(t,i,n),mn);if(t.attackPhaseTimer<l)break;t.attackPhaseTimer-=l,t.attackPhase==="windup"?(t.attackPhase="active",lh(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0)}const s=hh(n,t,i),o=s.windup+s.active+s.recovery;let r=0;t.attackPhase==="windup"?r=t.attackPhaseTimer:t.attackPhase==="active"?r=s.windup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(r=s.windup+s.active+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||o<=0?0:Math.min(1,r/o),vd(n,t,i)}function vd(n,t,e){const i=t.combat;if(!i)return;const a=hh(n,t,e);i.weapon=t.weapon??i.weapon,i.phase=t.attackPhase,i.comboIndex=t.attackPhase==="idle"?0:1,i.phaseTimer=t.attackPhaseTimer,i.attackProgress=t.attackProgress,i.attackFacing=t.facing,i.timings={windup:a.windup,active:a.active,recovery:a.recovery,settle:0,lunge:0},i.hitstop=0,i.warp=1,i.warpPhase=0,i.charging=!1,i.charge=0}function J0(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,a=i.x-t.position.x,s=i.z-t.position.z,o=Math.hypot(a,s),r=o>mn?a/o:0,l=o>mn?s/o:0;let c=0,h=0;if(t.mode==="wander"){const d=t.targetX-t.position.x,f=t.targetZ-t.position.z,m=Math.hypot(d,f);(t.wanderTimer<=0||m<.3)&&$0(n,t,e);const _=t.targetX-t.position.x,g=t.targetZ-t.position.z,p=Math.hypot(_,g);p>mn&&(c=_/p,h=g/p)}else if(t.mode==="follow")o>e.followStopDistance&&(c=r,h=l);else if(t.mode==="keep-distance"){const d=o-e.keepDistance;d>e.keepDeadZone?(c=r,h=l):d<-e.keepDeadZone?(c=-r,h=-l):(c=-l*e.keepStrafe,h=r*e.keepStrafe)}else if(t.mode==="attack")o>al(n,t,e)&&t.attackPhase==="idle"&&(c=r,h=l);else if(t.mode==="spar"){const d=al(n,t,e),f=d*1.7,m=Math.sin(n.time*.55+t.id*1.9)*.55;t.attackPhase==="idle"&&t.attackCooldown<=0&&o>d||o>f+.35?(c=r,h=l):o<f-.45?(c=-r,h=-l):(c=-l*m,h=r*m)}let u=t.facing;if(t.mode==="wander"?Math.hypot(c,h)>mn&&(u=Math.atan2(c,h)):o>mn&&(u=Math.atan2(r,l)),e.leashRadius>mn&&t.mode!=="wander"&&t.mode!=="idle"){const d=j0(t,e),f=t.position.x-t.homeX,m=t.position.z-t.homeZ,_=Math.hypot(f,m);if(_>d){const g=Math.min(1,(_-d)/Math.max(d*.5,.5)),p=-f/_,y=-m/_;c=c*(1-g)+p*g,h=h*(1-g)+y*g;const x=Math.hypot(c,h);x>mn&&(c/=x,h/=x)}}return{x:c,z:h,facing:u}}function Q0(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),(e.mode==="attack"||e.mode==="spar")&&e.attackPhase==="idle"&&e.attackCooldown<=0&&e.hurt.timer<=0){const y=n.character.position;Math.hypot(y.x-e.position.x,y.z-e.position.z)<=al(n,e,i)+mn&&(e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=Z0(e,i),n.dummyAttackCount+=1,lh(n,"dummy-attack",e))}K0(n,e,t,i);const a=J0(n,e,i),s=n.config.worldBounds;(a.x>0&&e.position.x>=s.maxX-mn||a.x<0&&e.position.x<=s.minX+mn)&&(a.x=0),(a.z>0&&e.position.z>=s.maxZ-mn||a.z<0&&e.position.z<=s.minZ+mn)&&(a.z=0);const o=1-Math.exp(-Math.max(i.acceleration,mn)*t),r=e.weapon&&i.fighters?i.fighters.moveSpeed:i.moveSpeed;e.velocity.x+=(a.x*r-e.velocity.x)*o,e.velocity.z+=(a.z*r-e.velocity.z)*o,e.facing=a.facing,e.bodyYaw=gd(e.bodyYaw,e.facing,G0,t),e.headYaw=gd(e.headYaw,e.facing,V0,t);const l=e.position.x,c=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const h=n.config.stepHeight;if(sh(n.boxes,e.position,i.radius,i.height,h))if(oh(n.boxes,e.position,i.radius,i.height,h))e.position.x=l,e.position.z=c,e.velocity.x=0,e.velocity.z=0;else{const y=e.position.x-l,x=e.position.z-c;Math.abs(y)<Math.abs(e.velocity.x*t)*.5&&(e.velocity.x=0),Math.abs(x)<Math.abs(e.velocity.z*t)*.5&&(e.velocity.z=0)}const d=n.config.worldBounds;e.position.x<d.minX?(e.position.x=d.minX,e.velocity.x<0&&(e.velocity.x=0),e.hurt.knockX<0&&(e.hurt.knockX=0)):e.position.x>d.maxX&&(e.position.x=d.maxX,e.velocity.x>0&&(e.velocity.x=0),e.hurt.knockX>0&&(e.hurt.knockX=0)),e.position.z<d.minZ?(e.position.z=d.minZ,e.velocity.z<0&&(e.velocity.z=0),e.hurt.knockZ<0&&(e.hurt.knockZ=0)):e.position.z>d.maxZ&&(e.position.z=d.maxZ,e.velocity.z>0&&(e.velocity.z=0),e.hurt.knockZ>0&&(e.hurt.knockZ=0));const f=io(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,h,Number.POSITIVE_INFINITY);f>Number.NEGATIVE_INFINITY&&f<=e.position.y+h+mn&&(e.position.y=f);const m=Math.hypot(e.position.x-l,e.position.z-c);e.distance+=m;const _=Math.hypot(e.velocity.x,e.velocity.z),g=Math.min(n.config.strideSpeedCap,_/Math.max(n.config.moveSpeed,mn)),p=Math.max(n.config.strideLength*(1+g*n.config.strideSpeedGain),mn);e.stride=p,e.gaitPhase=(e.gaitPhase+m/p*il)%il}function tg(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const a=n.dummies[e.dummyClickId-1];a.mode=Y0(a.mode,!!a.weapon),a.targetX=a.position.x,a.targetZ=a.position.z,a.wanderTimer=0,a.attackCooldown=0,a.attackPhase="idle",a.attackPhaseTimer=0,a.attackProgress=0,a.combat&&(a.combat.phase="idle",a.combat.attackProgress=0,a.combat.comboIndex=0),lh(n,"dummy-mode",a)}for(const a of n.dummies)Q0(n,t,a,i)}const ai=1e-6,yd=Math.PI*2;function _d(n,t){return Math.sqrt(n*n+t*t)}function To(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function eg(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.headPitch=0,t.bodyPitch=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,Ur(n)}function ng(n,t,e){const i=n.character,a=n.config,s=io(n.boxes,t,e,a.characterHeight,a.characterRadius,a.stepHeight,Number.POSITIVE_INFINITY);i.position.x=t,i.position.y=s>Number.NEGATIVE_INFINITY?s:0,i.position.z=e,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.moveYaw=0,i.bodyYaw=0,i.headYaw=0,i.headPitch=0,i.bodyPitch=0,i.grounded=!0,i.sprinting=!1,i.gaitPhase=0,i.stride=a.strideLength,i.distance=0,i.coyoteTime=a.coyoteTime,i.jumpBuffer=0,Ur(n),Af(n),kf(n),Sf(n),Tf(n),yr(n);const o=n.targeting;o.targetId=0,o.targetYaw=0,o.targetDist=0,o.hasTarget=!1;const r=n.playerHurt;r.type="none",r.lastAt=nh,r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,n.events.length=0}function ig(n,t,e){const i=n.config,a=n.character,s=a.position,o=a.velocity;let r=Number.isFinite(e.moveX)?e.moveX:0,l=Number.isFinite(e.moveZ)?e.moveZ:0;const c=_d(r,l);c>1&&(r/=c,l/=c);const h=i.worldBounds;(r>0&&s.x>=h.maxX-ai||r<0&&s.x<=h.minX+ai)&&(r=0),(l>0&&s.z>=h.maxZ-ai||l<0&&s.z<=h.minZ+ai)&&(l=0);const u=n.combat.phase!=="idle",d=n.playerLink.phase!=="idle",f=n.dash.phase==="active",m=u||f||d;a.sprinting=!m&&e.sprintHeld&&c>ai;const _=i.combat.weapons[n.combat.weapon];let g=_?_.moveMultiplier:1;f||d?g=0:u?g*=n.combat.phase==="active"?i.combat.lungeMoveScale:n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?g*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(g*=Math.max(0,Math.min(1,n.abilities.channelMoveScale)));const p=i.moveSpeed*(a.sprinting?i.sprintMultiplier:1)*g;{const F=m?i.skillDecel:c>ai?i.acceleration:i.friction,O=1-Math.exp(-F*t);o.x+=(r*p-o.x)*O,o.z+=(l*p-o.z)*O}e.jumpPressed?a.jumpBuffer=i.jumpBufferTime:a.jumpBuffer=Math.max(0,a.jumpBuffer-t),a.coyoteTime=a.grounded?i.coyoteTime:Math.max(0,a.coyoteTime-t),a.jumpBuffer>0&&a.coyoteTime>0&&(o.y=i.jumpSpeed,a.grounded=!1,a.coyoteTime=0,a.jumpBuffer=0,To(n,"jumped",i.jumpSpeed)),n.events.some(F=>F.type==="blink"&&F.tick===n.tick)&&(o.x=0,o.z=0,n.impulse.x=0,n.impulse.z=0);const x=s.x,v=s.z;if(s.x+=(o.x+n.impulse.x+n.playerHurt.knockX)*t,s.z+=(o.z+n.impulse.z+n.playerHurt.knockZ)*t,sh(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight)){if(oh(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight))s.x=x,s.z=v,o.x=0,o.z=0;else{const F=s.x-x,O=s.z-v;Math.abs(F)<Math.abs(o.x*t)*.5&&(o.x=0),Math.abs(O)<Math.abs(o.z*t)*.5&&(o.z=0)}To(n,"blocked",1)}s.x<h.minX?(s.x=h.minX,o.x<0&&(o.x=0),n.playerHurt.knockX<0&&(n.playerHurt.knockX=0)):s.x>h.maxX&&(s.x=h.maxX,o.x>0&&(o.x=0),n.playerHurt.knockX>0&&(n.playerHurt.knockX=0)),s.z<h.minZ?(s.z=h.minZ,o.z<0&&(o.z=0),n.playerHurt.knockZ<0&&(n.playerHurt.knockZ=0)):s.z>h.maxZ&&(s.z=h.maxZ,o.z>0&&(o.z=0),n.playerHurt.knockZ>0&&(n.playerHurt.knockZ=0));const S=io(n.boxes,s.x,s.z,s.y,i.characterRadius,i.stepHeight,i.fallTolerance);a.grounded&&S>s.y+ai&&S-s.y<=i.stepHeight+ai&&(s.y=S,o.y=0,To(n,"stepUp",S));const A=s.y;o.y-=i.gravity*t,s.y+=o.y*t;const T=io(n.boxes,s.x,s.z,A,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);T>Number.NEGATIVE_INFINITY&&s.y<=T&&o.y<=0?(s.y=T,o.y=0,a.grounded||To(n,"landed",T),a.grounded=!0):a.grounded=!1;const b=_d(s.x-x,s.z-v);a.distance+=b;const M=b/Math.max(t,ai),P=Math.min(i.strideSpeedCap,M/Math.max(i.moveSpeed,ai)),L=Math.max(i.strideLength*(1+P*i.strideSpeedGain),ai);a.stride=L,a.gaitPhase=(a.gaitPhase+b/L*yd)%yd}const sl=1e-6,Md=2.399963229728653;function wa(n,t,e){return n<t?t:n>e?e:n}function bd(n,t,e,i,a,s,o,r,l){const c=t.x-n.x,h=t.z-n.z,u=Math.hypot(c,h),d=e+i;if(u>=d)return;let f,m,_;u<sl?(f=r,m=l,_=d):(f=c/u,m=h/u,_=d-u);const g=_+o;n.x-=f*g*a,n.z-=m*g*a,t.x+=f*g*s,t.z+=m*g*s}function ag(n){const t=n.config.separation,e=n.dummies,i=n.character.position,a=n.config.characterRadius,s=n.config.dummies.radius,o=Math.max(1,Math.floor(t.iterations)),r=Math.max(0,t.slop);for(let h=0;h<o;h++){for(let u=0;u<e.length;u++)for(let d=u+1;d<e.length;d++){const f=(u*3+d)*Md;bd(e[u].position,e[d].position,s,s,.5,.5,r,Math.cos(f),Math.sin(f))}for(let u=0;u<e.length;u++){const d=(u+1)*Md;bd(i,e[u].position,a,s,0,1,r,Math.cos(d),Math.sin(d))}}const l=n.config.stepHeight,c=n.config.worldBounds;for(const h of e)sh(n.boxes,h.position,s,n.config.dummies.height,l),h.position.x=wa(h.position.x,c.minX,c.maxX),h.position.z=wa(h.position.z,c.minZ,c.maxZ)}function sg(n,t,e,i,a,s,o,r){const l=Math.hypot(e,i),c=Math.max(0,r.contactBand),h=wa(r.minScale,0,1);if(l<sl||c<=0||h>=1)return 1;const u=a+o,d=wa(r.approachDot,0,.99);let f=0;for(const m of s){const _=m.position.x-n,g=m.position.z-t,p=Math.hypot(_,g);if(p>=u+c)continue;if(p<sl){f=1;continue}const y=(e*_+i*g)/(l*p);if(y<=d)continue;const x=wa(1-(p-u)/c,0,1),v=wa((y-d)/(1-d),0,1);f=Math.max(f,x*v)}return 1-(1-h)*wa(f,0,1)}function og(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=sg(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const sc=1e-6,rg=Math.PI/180;function cg(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function lg(n,t,e){return n<t?t:n>e?e:n}function hg(n,t,e){const i=n.config.targeting,a=n.targeting,s=n.character.position;let o=n.character.facing;const r=Math.hypot(e.aimX,e.aimZ);e.aimActive&&r>sc?o=Math.atan2(e.aimX,e.aimZ):Math.hypot(e.moveX,e.moveZ)>sc&&(o=Math.atan2(e.moveX,e.moveZ));const l=lg(i.maxAngleDeg,0,180)*rg;let c=Number.POSITIVE_INFINITY,h=0,u=0,d=0;for(const f of n.dummies){const m=f.position.x-s.x,_=f.position.z-s.z,g=Math.hypot(m,_);if(g<sc||g>i.range)continue;const p=Math.atan2(m,_),y=Math.abs(Be(p-o));if(y>l)continue;const x=g-i.frontBias*Math.cos(y);x<c&&(c=x,h=f.id,u=p,d=g)}a.targetId=h,a.targetYaw=u,a.targetDist=d,a.hasTarget=h>0}const yi=1e-6;function hs(n,t,e){return n<t?t:n>e?e:n}function Sd(n){return Math.atan2(Math.sin(n),Math.cos(n))}function dg(n,t,e){const i=n.config.gaze,a=n.gaze;if(!i.enabled||!n.modules.gaze){a.active=!1,a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}const s=n.character.position,o=(F,O)=>{const k=F.position.x-s.x,D=F.position.z-s.z,U=Math.hypot(k,D);if(U<yi||U>O)return 0;const G=hs((O-U)/Math.max(yi,O-i.nearDistance),0,1);let W=G*(i.modeWeight[F.mode]??.5);return F.attackPhase==="active"&&(W+=i.attackBoost*G),W},r=[];let l=0,c=!1,h=!1,u=!1;for(const F of n.dummies){const O=o(F,i.threatRange),k=F.position.x-s.x,D=F.position.z-s.z,U=Math.hypot(k,D);O>0&&(r.push({id:F.id,x:F.position.x,z:F.position.z,dx:k,dz:D,yaw:Math.atan2(k,D),w:O}),l+=O,U<=i.approachDist&&(i.modeWeight[F.mode]??.5)>=i.hostileModeWeight&&(u=!0)),U>yi&&U<=i.recoveryDist&&(c=!0),(F.attackPhase==="windup"||F.attackPhase==="active")&&U<=i.threatRange&&(h=!0)}const d=l<=0?0:hs(l/(l+Math.max(yi,i.saturation)),0,1),f=r.length>0,m=a.active,_=f&&(e.aimActive&&d>=i.enterThreshold||i.reactToAttack&&h&&d>=i.enterThreshold||i.reactToApproach&&u),g=i.hurtHoldSec>yi&&n.time-n.playerHurt.lastAt<i.hurtHoldSec,p=m&&(c||g);if(a.active=_||p,!a.active){a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}if(r.length===0)return;r.sort((F,O)=>O.w-F.w);const y=r.slice(0,Math.max(1,i.maxThreats)),x=r[0],v=Math.atan2(x.dx,x.dz),w=i.behindAngleDeg*Math.PI/180,S=n.character.bodyYaw;let A=0,T=0,b=0;for(const F of y){const O=Math.abs(Sd(F.yaw-v))/Math.PI;let k=F.w/(1+Math.max(i.spreadFalloff,0)*O*O);F!==x&&i.behindFalloff<1&&Math.abs(Sd(F.yaw-S))>w&&(k*=Math.max(i.behindFalloff,0)),A+=F.x*k,T+=F.z*k,b+=k}a.mainId=x.id,a.mainYaw=v;const M=n.dummies.find(F=>F.id===x.id),P=(M?M.position.y:0)+n.config.dummies.height*hs(i.aimHeightRatio,0,1),L=s.y+n.config.characterHeight*hs(i.eyeHeightRatio,0,1);a.mainPitch=Math.atan2(P-L,Math.max(yi,Math.hypot(x.dx,x.dz))),a.centroidYaw=b>yi?Math.atan2(A/b-s.x,T/b-s.z):v,a.threatCount=r.length,a.threat=d}function ug(n,t){const e=n.config.gaze;return(e.modeWeight[t.mode]??.5)>=e.hostileModeWeight}function fg(n,t){const e=n.config.gaze;if(!e.enabled||!n.modules.gaze)return 0;const i=n.character.position,a=Math.hypot(t.position.x-i.x,t.position.z-i.z);if(a<yi||a>e.threatRange)return 0;const s=Math.max(yi,e.threatRange-e.nearDistance),o=hs((e.threatRange-a)/s,0,1);let r=o*(e.modeWeight[t.mode]??.5);t.attackPhase==="active"&&(r+=e.attackBoost*o);const l=Math.max(yi,e.modeWeight.attack??1.5);return hs(r/l,0,1)}function pg(){return{active:!1,mainId:0,mainYaw:0,mainPitch:0,centroidYaw:0,threatCount:0,threat:0}}function mg(n,t){return{tick:0,time:0,rngState:2654435769,config:n,boxes:p0(t),gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:Cf(1),playerLink:Fr(),arrows:[],arrowSeq:0,abilities:d0(),skills:l0(n),impulse:{x:0,z:0},targeting:cg(),turnInPlace:Ym(),playerHurt:gf(),hitCount:0,dash:{...O0(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{...wf(),centroidX:n.spawn.x,centroidZ:n.spawn.z},gaze:pg(),dummies:W0(n.dummies),dummyAttackCount:0,events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,turnInPlace:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,gaze:!0,dummies:!0}}}function gg(n){eg(n),If(n),Af(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.lastAt=nh,e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,Sf(n),Tf(n),kf(n),Ef(n),yr(n);const i=n.gaze;i.active=!1,i.mainId=0,i.mainYaw=0,i.mainPitch=0,i.centroidYaw=0,i.threatCount=0,i.threat=0,n.events.length=0}function wd(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){gg(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?hg(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),R0(n,t,e),n.modules.combat&&N0(n,t,e),n.modules.dash&&H0(n,t,e),n.modules.movement&&ig(n,t,e),n.modules.gaze&&dg(n,t,e),n.modules.orientation&&qm(n,t,e),jm(n,t,e),n.modules.dummies&&tg(n,t,e),Om(n,t),w0(n,t),n.modules.abilities&&u0(n,t,e),n.modules.combat&&M0(n,t),n.modules.dummies&&(Wm(n,t),n.modules.separation&&(ag(n),og(n))),n.modules.camera?f0(n):Ef(n),n}const zf=["bodyYaw","bodyPitch","bodyRoll","pelvisX","pelvisZ","armPitch","armYaw","armRoll","elbow","bladePitch","armLPitch","armLYaw","armLRoll","elbowL","rootYaw","bladePitchOff","bladeTwist","bladeTwistOff","bladeYaw","bladeYawOff"],Ed=1e-9;function xg(n,t,e){return n<t?t:n>e?e:n}function Ff(n){return xg(Number.isFinite(n)?n:0,0,1)}function Uf(n,t){const e=Ff(t);return n==="in"?e*e:n==="out"?1-(1-e)*(1-e):n==="inOut"?e*e*(3-2*e):e}function vg(){const n={};for(const t of zf)n[t]=0;return n}function yg(n,t){const e=vg(),i=(n==null?void 0:n.keys)??[];if(i.length===0)return e;const a=Ff(t);let s=0;for(;s<i.length-1&&a>i[s+1].t+Ed;)s+=1;const o=i[s],r=i[Math.min(s+1,i.length-1)],l=r.t-o.t,c=l>Ed?(a-o.t)/l:0,h=Uf(o.ease??"linear",c);for(const u of zf){const d=o.pose[u]??r.pose[u]??0,f=r.pose[u]??o.pose[u]??0;e[u]=d+(f-d)*h}return e}function _g(n,t){const e=n==null?void 0:n.spin;if(!e||!Number.isFinite(e.turns)||e.turns===0)return 0;const i=e.ease??"linear",a=Number.isFinite(e.span)&&e.span>0?Math.min(1,e.span):1,s=Uf(i,t/a);return e.turns*Math.PI*2*s}function da(n,t){return((n==null?void 0:n.keys)??[]).some(e=>typeof e.pose[t]=="number")}function Mg(n){let t=0;return{frame(e,i,a,s,o){if(s||a<=0)return t=0,0;t+=Math.min(e,.1)*a;const r=n.config.fixedDt,l=n.config.maxStepsPerFrame;let c=0;for(;t>=r&&c<l;){const h=c===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};wd(n,r,h),o&&o(),t-=r,c++}return c>=l&&(t=0),c},singleStep(e){wd(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t},get alpha(){const e=n.config.fixedDt;return e>0?Math.max(0,Math.min(1,t/e)):1}}}function Pi(n,t,e){let i=t-n;for(;i>Math.PI;)i-=Math.PI*2;for(;i<-Math.PI;)i+=Math.PI*2;return n+i*e}function Ce(n,t,e){return n+(t-n)*e}function bg(n){const t=n.combat,e=n.dummies;let i=`${t.weapon}|${t.phase}|${t.comboIndex}|${t.attackId}|${n.character.grounded?1:0}|${n.character.sprinting?1:0}|${n.playerHurt.type}|${t.hitstop>0?1:0}|d:${n.dash.phase}:${n.dash.kind}|t:${n.turnInPlace.phase}|l:${n.playerLink.phase}:${n.playerLink.kind}`;for(let a=0;a<e.length;a++){const s=e[a];i+=`|${s.id}:${s.mode}:${s.attackPhase}:${s.attackId}:${s.hurt.type}`}return i}function Td(n){const t=n.character,e=n.combat,i=n.playerHurt;return{time:n.time,key:bg(n),ch:{x:t.position.x,y:t.position.y,z:t.position.z,facing:t.facing,moveYaw:t.moveYaw,bodyYaw:t.bodyYaw,headYaw:t.headYaw,headPitch:t.headPitch,bodyPitch:t.bodyPitch,gaitPhase:t.gaitPhase,stride:t.stride,vx:t.velocity.x,vy:t.velocity.y,vz:t.velocity.z},cb:{attackProgress:e.attackProgress,phaseTimer:e.phaseTimer,charge:e.charge,hitstop:e.hitstop},dash:{timer:n.dash.timer},turn:{progress:n.turnInPlace.progress},link:{progress:n.playerLink.progress},hurt:{timer:i.timer,duration:i.duration,knockX:i.knockX,knockZ:i.knockZ},dm:n.dummies.map(a=>({x:a.position.x,y:a.position.y,z:a.position.z,facing:a.facing,bodyYaw:a.bodyYaw,headYaw:a.headYaw,gaitPhase:a.gaitPhase,stride:a.stride,attackProgress:a.attackProgress,vx:a.velocity.x,vy:a.velocity.y,vz:a.velocity.z}))}}function Sg(n,t){return n.key===t.key&&n.dm.length===t.dm.length}function wg(n,t,e){const i=Math.max(0,Math.min(1,e)),a={position:{x:Ce(n.ch.x,t.ch.x,i),y:Ce(n.ch.y,t.ch.y,i),z:Ce(n.ch.z,t.ch.z,i)},facing:Pi(n.ch.facing,t.ch.facing,i),moveYaw:Pi(n.ch.moveYaw,t.ch.moveYaw,i),bodyYaw:Pi(n.ch.bodyYaw,t.ch.bodyYaw,i),headYaw:Pi(n.ch.headYaw,t.ch.headYaw,i),headPitch:Ce(n.ch.headPitch,t.ch.headPitch,i),bodyPitch:Ce(n.ch.bodyPitch,t.ch.bodyPitch,i),gaitPhase:Pi(n.ch.gaitPhase,t.ch.gaitPhase,i),stride:Ce(n.ch.stride,t.ch.stride,i),velocity:{x:Ce(n.ch.vx,t.ch.vx,i),y:Ce(n.ch.vy,t.ch.vy,i),z:Ce(n.ch.vz,t.ch.vz,i)}},s={attackProgress:Ce(n.cb.attackProgress,t.cb.attackProgress,i),phaseTimer:Ce(n.cb.phaseTimer,t.cb.phaseTimer,i),charge:Ce(n.cb.charge,t.cb.charge,i),hitstop:i<1?Math.max(0,Ce(n.cb.hitstop,t.cb.hitstop,i)):t.cb.hitstop},o={timer:Ce(n.hurt.timer,t.hurt.timer,i),knockX:Ce(n.hurt.knockX,t.hurt.knockX,i),knockZ:Ce(n.hurt.knockZ,t.hurt.knockZ,i)},r=t.dm.map((l,c)=>{const h=n.dm[c];return h?{position:{x:Ce(h.x,l.x,i),y:Ce(h.y,l.y,i),z:Ce(h.z,l.z,i)},facing:Pi(h.facing,l.facing,i),bodyYaw:Pi(h.bodyYaw,l.bodyYaw,i),headYaw:Pi(h.headYaw,l.headYaw,i),gaitPhase:Pi(h.gaitPhase,l.gaitPhase,i),stride:Ce(h.stride,l.stride,i),attackProgress:Ce(h.attackProgress,l.attackProgress,i),velocity:{x:Ce(h.vx,l.vx,i),y:Ce(h.vy,l.vy,i),z:Ce(h.vz,l.vz,i)}}:null});return{time:Ce(n.time,t.time,i),character:a,combat:s,playerHurt:o,dash:{timer:Ce(n.dash.timer,t.dash.timer,i)},turn:{progress:Ce(n.turn.progress,t.turn.progress,i)},link:{progress:Ce(n.link.progress,t.link.progress,i)},dummies:r}}function Eg(n,t){const e=n.dummies.map((i,a)=>{const s=t.dummies[a];return s?{...i,...s}:i});return{...n,time:t.time,character:{...n.character,...t.character},combat:{...n.combat,...t.combat},playerHurt:{...n.playerHurt,...t.playerHurt},dash:{...n.dash,timer:t.dash.timer},turnInPlace:{...n.turnInPlace,progress:t.turn.progress},playerLink:{...n.playerLink,progress:t.link.progress},dummies:e}}const Nf={slopPx:12,longPressMs:450,doubleTapMs:280};function Tg(n,t,e=Nf.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,a=n.dy/n.distance,s=t.rightX*i+t.forwardX*-a,o=t.rightZ*i+t.forwardZ*-a,r=Math.hypot(s,o);return r<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:s/r,worldZ:o/r}}function ua(n,t,e,i,a,s){const o=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:o,angleDeg:o>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:a,taps:s,worldX:0,worldZ:0}}function Ag(n=Nf){const t=new Map,e=new Map,i=a=>t.get(a);return{begin(a,s,o,r,l){if(t.has(s))return null;for(const c of t.values())if(c.button===a)return null;return t.set(s,{button:a,pointerId:s,startX:o,startY:r,x:o,y:r,startedAt:l,dragging:!1,longFired:!1}),ua(a,"press",0,0,0,1)},move(a,s,o,r){const l=i(a);if(!l)return null;l.x=s,l.y=o;const c=s-l.startX,h=o-l.startY;return!l.dragging&&Math.hypot(c,h)>=n.slopPx?(l.dragging=!0,ua(l.button,"drag",c,h,r-l.startedAt,1)):null},end(a,s,o,r){const l=i(a);if(!l)return null;t.delete(a),l.x=s,l.y=o;const c=s-l.startX,h=o-l.startY,u=r-l.startedAt,d=Math.hypot(c,h);if(l.dragging||l.longFired||d>=n.slopPx)return ua(l.button,"release",c,h,u,1);const f=e.get(l.button);return f!==void 0&&r-f.at<=n.doubleTapMs&&Math.hypot(s-f.x,o-f.y)<=n.slopPx*2?(e.delete(l.button),ua(l.button,"doubleTap",c,h,u,2)):(e.set(l.button,{at:r,x:s,y:o}),ua(l.button,"tap",c,h,u,1))},cancel(a,s){const o=i(a);return o?(t.delete(a),ua(o.button,"cancel",o.x-o.startX,o.y-o.startY,s-o.startedAt,1)):null},poll(a){for(const s of t.values())if(!(s.longFired||s.dragging)&&a-s.startedAt>=n.longPressMs)return s.longFired=!0,ua(s.button,"longPress",s.x-s.startX,s.y-s.startY,a-s.startedAt,1);return null},isHeld(a){for(const s of t.values())if(s.button===a)return!0;return!1},reset(){t.clear(),e.clear()}}}const oc=.001,Rg=18;function ol(n,t,e){return n<t?t:n>e?e:n}function rl(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function Pg(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function Cg(n,t,e,i,a=Rg){const s=Pg(t);if(!s)return{state:rl(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const o=Math.hypot(s[1].x-s[0].x,s[1].y-s[0].y),r=a,l=Math.max(1.0001,Number.isFinite(i)?i:1.25),c=1/l,h=l;if(!Number.isFinite(o)||o<oc)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const m=r<=0;return{state:{active:!0,lastDist:o,armDist:o,armed:m},scale:1,started:!0,ended:!1,armedNow:!1,pinching:m}}if(!n.armed)return n.armDist<oc?{state:{active:!0,lastDist:o,armDist:o,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(o-n.armDist)<r?{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<oc)return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const u=o/n.lastDist,d=Math.max(0,Number.isFinite(e)?e:1),f=Number.isFinite(u)&&u>0?Math.pow(u,d):1;return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:ol(Number.isFinite(f)?f:1,c,h),started:!1,ended:!1,armedNow:!1,pinching:!0}}function Ad(n,t,e,i){const a=Math.min(e,i),s=Math.max(e,i),o=Number.isFinite(t)&&t>0?t:1,r=n*o;return Number.isFinite(r)?ol(r,a,s):ol(n,a,s)}function Lg(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function Dg(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const rc=["jump","sprint","reset","attack","skill2"],kg=8,Ig=16,cc=10,Rd=14,Pd=140,zg=18,Fg=16,Ug=400,Ng=1.0001;function lr(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function Og(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&lr(e)}function Bg(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:a}=n,s=()=>Math.max(8,t());let o=null,r=0,l=0,c=0,h=0,u=0,d=0,f=-1,m=0,_=null,g=-1,p=0,y=0,x=0,v=0,w=!1,S=0,A=1,T=0,b=null,M=0,P=0,L=!1,F=null,O=null,k=0,D=0,U=0,G=0,W=!1,ot=!0,gt=-1;const Mt=Ag({slopPx:Rd,longPressMs:450,doubleTapMs:350});let kt=[],Q=null;const nt=new Set;function ht(B){B&&kt.push(B)}const q=new Map;let J=rl(),Z=!1,bt=1;function zt(){const B=Array.from(q.values()),lt=a(),vt=Cg(J,B,lt.pinchGain,lt.maxStepRatio,zg);if(J=vt.state,Z=vt.pinching,vt.scale!==1&&(bt*=vt.scale),vt.started||vt.armedNow)b=null,L=!0,F=null;else if(vt.ended&&o===null&&B.length===1){const Xt=B[0];o=Xt.id,r=Xt.x,l=Xt.y,c=0,h=0,u=Xt.x,d=Xt.y,w=!1,S=0,A=1,T=0,performance.now(),b=null,L=!0,F=null}}const Dt={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},Ut={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let V=0,ne=0;const Ht={},Lt=new Set,xt=[];function Ft(){for(const B of rc)Ht[B]!==void 0&&(Ht[B]=void 0),j(B);Mt.reset(),nt.clear(),q.clear(),J=rl(),Z=!1,o=null,c=0,h=0,u=0,d=0,w=!1,S=0,A=1,T=0,p=0,y=0,x=0,v=0,_=null,g=-1,b=null,L=!1,F=null,O=null,gt=-1,U=0,G=0,W=!1,ot=!0}const Bt=()=>{document.hidden&&Ft()},z=B=>{if(B.clientX===0&&B.clientY===0){m++;return}if(lr(B.target)||Og(B.clientX,B.clientY)){nt.add(B.pointerId);return}if(nt.delete(B.pointerId),q.set(B.pointerId,{id:B.pointerId,x:B.clientX,y:B.clientY}),o===null&&!Z){_=null,g=-1,o=B.pointerId,r=B.clientX,l=B.clientY,c=0,h=0,u=B.clientX,d=B.clientY,performance.now();const lt=Number.isFinite(B.screenX)&&Number.isFinite(B.screenY)&&(B.screenX!==0||B.screenY!==0);w=lt,S=0,A=1,T=0,p=lt?B.screenX:0,y=lt?B.screenY:0,x=p,v=y,b=B.pointerId,M=B.clientX,P=B.clientY,L=!1}zt()},R=B=>{if(B.pointerId===O&&(B.pointerType==="mouse"&&B.buttons===0||B.clientX===0&&B.clientY===0&&(k!==0||D!==0)||(ot?(U=B.clientX-k,G=B.clientY-D):(k=B.clientX,D=B.clientY,ot=!0,U=0,G=0))),ht(Mt.move(B.pointerId,B.clientX,B.clientY,performance.now())),!nt.has(B.pointerId)&&q.has(B.pointerId)&&(q.set(B.pointerId,{id:B.pointerId,x:B.clientX,y:B.clientY}),zt()),nt.has(B.pointerId)||B.pointerId!==o)return;const lt=performance.now();if(_===B.pointerId&&lt-g<150){m++;return}const vt=B.clientX,Xt=B.clientY;if(vt===0&&Xt===0&&(r!==0||l!==0)){m++;return}const $t=vt-u,N=Xt-d,Rt=Number.isFinite(B.screenX)&&Number.isFinite(B.screenY),it=Rt?B.screenX:0,ut=Rt?B.screenY:0,Pt=Rt&&(it!==0||ut!==0),At=it-x,qt=ut-v;if(w&&Pt){const Ie=Math.hypot(At,qt),ye=Math.hypot($t,N);if(Ie>3){if(S=0,T<30&&ye>6&&At*$t+qt*N>.7*Ie*ye){const We=Ie/ye;We>.2&&We<5&&(A+=(We-A)*.3,T++)}}else ye>12&&(S++,S>=2&&(w=!1))}const ee=Math.hypot($t,N);if(!w){const Ie=f<0?Number.POSITIVE_INFINITY:lt-f,ye=Pt?Math.hypot(At,qt):1/0;ee>28&&(Ie<200||ye<ee*.4)&&(r+=$t,l+=N,m++)}u=vt,d=Xt,x=it,v=ut,B.pointerId===b&&Math.hypot(B.clientX-M,B.clientY-P)>kg&&(L=!0);let re,te;w&&Pt?(re=(it-p)/A,te=(ut-y)/A):(re=vt-r,te=Xt-l);const we=Math.hypot(re,te),De=s();we>De&&(re*=De/we,te*=De/we);const yn=Math.hypot(c,h),Xe=Math.hypot(re,te);if(yn>10&&Xe>10){const Ie=Math.abs(Math.atan2(c*te-h*re,c*re+h*te)),ye=Math.max(yn,Xe)*Ie,We=Math.max(Math.hypot($t,N),Math.hypot(At,qt)/Math.max(.2,A));if(Ie>.6&&We<Math.max(6,ye*.5)){m++;return}}c=re,h=te};function j(B){if(!Dt[B])return;Dt[B]=!1,B==="attack"&&(Ut.attackReleased=!0);const lt=document.getElementById(`btn-${B}`);lt==null||lt.classList.remove("is-down")}function dt(){o!==null&&(_=o,g=performance.now(),o=null,c=0,h=0,u=0,d=0,w=!1,S=0,A=1,T=0,p=0,y=0,x=0,v=0)}const tt=B=>{const lt=q.delete(B.pointerId),vt=nt.delete(B.pointerId);lt&&zt(),B.pointerId===O&&(O=null,W?gt=performance.now():(U=0,G=0,gt=-1)),ht(Mt.end(B.pointerId,B.clientX,B.clientY,performance.now()));for(const Gt of rc)Ht[Gt]===B.pointerId&&(Ht[Gt]=void 0,j(Gt));const Xt=!lt&&!vt&&q.size<=1&&o!==null;(B.pointerId===o||q.size===0||Xt)&&dt(),!vt&&B.pointerId===b&&(!L&&!lr(B.target)&&(F={x:B.clientX,y:B.clientY}),b=null)};for(const B of rc){const lt=document.getElementById(`btn-${B}`);if(!lt)continue;const vt=B==="attack"||B==="skill2",Xt=N=>{if(N.preventDefault(),Ht[B]===void 0){Ht[B]=N.pointerId,Dt[B]=!0,B==="jump"&&(Ut.jump=!0),B==="reset"&&(Ut.reset=!0),B==="sprint"&&(Ut.sprintPressed=!0),B==="attack"&&(Ut.attackPressed=!0),B==="skill2"&&(Ut.skill2=!0),lt.classList.add("is-down"),ht(Mt.begin(B,N.pointerId,N.clientX,N.clientY,performance.now()));try{lt.setPointerCapture(N.pointerId)}catch{}vt&&(O=N.pointerId,k=N.clientX,D=N.clientY,ot=!(N.clientX===0&&N.clientY===0),U=0,G=0,W=!1,gt=-1)}},Gt=N=>{Ht[B]===N.pointerId&&(Ht[B]=void 0,j(B),ht(Mt.end(N.pointerId,N.clientX,N.clientY,performance.now())))},$t=N=>{Ht[B]===N.pointerId&&(Ht[B]=void 0,j(B),ht(Mt.cancel(N.pointerId,performance.now())))};lt.addEventListener("pointerdown",Xt),lt.addEventListener("pointerup",Gt),lt.addEventListener("pointercancel",$t),xt.push(()=>{lt.removeEventListener("pointerdown",Xt),lt.removeEventListener("pointerup",Gt),lt.removeEventListener("pointercancel",$t)})}const ct=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const B of ct){const lt=vt=>{vt.preventDefault(),V=Number(B.dataset.weapon)||0};B.addEventListener("pointerdown",lt),xt.push(()=>B.removeEventListener("pointerdown",lt))}const It=B=>{const lt=B.key.toLowerCase();if((lt===" "||lt.startsWith("arrow"))&&B.preventDefault(),Lt.has(lt))return;Lt.add(lt),lt===" "&&(Ut.jump=!0),lt==="r"&&(Ut.reset=!0),lt==="shift"&&(Ut.sprintPressed=!0),lt==="j"&&(Ut.attackPressed=!0),lt==="k"&&(Ut.skill2=!0),lt>="1"&&lt<="5"&&(V=Number(lt)),lt>="6"&&lt<="9"&&(ne=Number(lt)-5);const vt=Math.max(Ng,a().keyStep||1.12);(lt==="="||lt==="+")&&(bt*=vt),(lt==="-"||lt==="_")&&(bt/=vt)},et=B=>{const lt=B.key.toLowerCase();Lt.has(lt)&&(Lt.delete(lt),lt==="j"&&(Ut.attackReleased=!0))},ft=B=>{if(lr(B.target))return;B.preventDefault();const lt=B.deltaMode===1?B.deltaY*Fg:B.deltaMode===2?B.deltaY*Ug:B.deltaY;bt*=Lg(lt,a().wheelStep)},Nt=B=>{B.preventDefault()},rt=()=>{f=performance.now()};window.addEventListener("resize",rt),window.addEventListener("orientationchange",rt);const wt=typeof window<"u"?window.visualViewport:null;return wt&&(wt.addEventListener("resize",rt),wt.addEventListener("scroll",rt)),window.addEventListener("pointerdown",z),window.addEventListener("pointermove",R),window.addEventListener("pointerup",tt),window.addEventListener("pointercancel",tt),window.addEventListener("blur",Ft),document.addEventListener("visibilitychange",Bt),window.addEventListener("keydown",It),window.addEventListener("keyup",et),window.addEventListener("wheel",ft,{passive:!1}),window.addEventListener("gesturestart",Nt),{peekStick(){return{id:o,held:o!==null,originX:r,originY:l,x:u,y:d,dx:u-r,dy:d-l,radius:s(),badMoves:m,screenOk:w,originSX:p,originSY:y,screenX:x,screenY:v,scale:A}},peekAim(){const B=performance.now(),lt=Math.hypot(U,G),vt=O!==null||gt>=0&&B-gt<Pd;if(!(vt&&W&&lt>=cc))return{active:!1,holding:vt,x:0,z:0,dx:U,dy:G};const Gt=i(),$t=U/lt,N=G/lt,Rt=Gt.rightX*$t+Gt.forwardX*-N,it=Gt.rightZ*$t+Gt.forwardZ*-N,ut=Math.hypot(Rt,it)||1;return{active:!0,holding:vt,x:Rt/ut,z:it/ut,dx:U,dy:G}},sample(){var wn;const B=s();let lt=o!==null?Math.max(-1,Math.min(1,c/B)):0,vt=o!==null?Math.max(-1,Math.min(1,h/B)):0,Xt=0,Gt=0;(Lt.has("a")||Lt.has("arrowleft"))&&(Xt-=1),(Lt.has("d")||Lt.has("arrowright"))&&(Xt+=1),(Lt.has("w")||Lt.has("arrowup"))&&(Gt-=1),(Lt.has("s")||Lt.has("arrowdown"))&&(Gt+=1),lt+=Xt,vt+=Gt;let $t=Math.hypot(lt,vt);$t>1&&(lt/=$t,vt/=$t,$t=1);const N=lt,Rt=vt;$t<e&&(lt=0,vt=0);const it=i();let ut=it.rightX*lt+it.forwardX*-vt,Pt=it.rightZ*lt+it.forwardZ*-vt;const At=Math.hypot(ut,Pt);At>1&&(ut/=At,Pt/=At);const qt=performance.now();ht(Mt.poll(qt));const ee=Math.hypot(U,G);O!==null&&(ee>=Ig?W=!0:ee<cc&&(W=!1));const re=O!==null||gt>=0&&qt-gt<Pd,te=re&&W&&ee>=cc;let we=0,De=0;if(te){const Je=U/ee,En=G/ee,an=it.rightX*Je+it.forwardX*-En,sn=it.rightZ*Je+it.forwardZ*-En,Fn=Math.hypot(an,sn)||1;we=an/Fn,De=sn/Fn}!re&&O===null&&(U=0,G=0,gt=-1,W=!1);const yn=F;F=null;const Xe=bt;bt=1;const Ie={moveX:ut,moveZ:Pt,jumpPressed:Ut.jump,sprintHeld:Dt.sprint||Lt.has("shift"),sprintPressed:Ut.sprintPressed,resetPressed:Ut.reset,attackPressed:Ut.attackPressed,attackHeld:Dt.attack||Lt.has("j"),attackReleased:Ut.attackReleased,skill2Pressed:Ut.skill2,weaponSlot:V,dummyClickId:ne,aimX:we,aimZ:De,aimActive:te};Ut.jump=!1,Ut.reset=!1,Ut.sprintPressed=!1,Ut.attackPressed=!1,Ut.attackReleased=!1,Ut.skill2=!1,V=0,ne=0;const ye=kt.map(Je=>Tg(Je,it,Rd));kt=[],ye.length>0&&(Q=ye[ye.length-1]);const We=o!==null?"pointer":Lt.size>0?"keyboard":"idle";return{intents:Ie,stickX:lt,stickY:vt,stickRawX:N,stickRawY:Rt,stickHeld:o!==null,stickId:o,stickOriginX:r,stickOriginY:l,stickPxX:u,stickPxY:d,stickBad:m,stickScreenOk:w,stickOriginSX:p,stickOriginSY:y,stickScreenX:x,stickScreenY:v,stickScale:A,stickVpTop:((wn=Dg())==null?void 0:wn.top)??0,stickVpAge:f<0?-1:Math.round(performance.now()-f),aimDX:U,aimDY:G,source:We,tap:yn,zoomScale:Xe,gestures:ye,lastGesture:Q}},dispose(){window.removeEventListener("pointerdown",z),window.removeEventListener("pointermove",R),window.removeEventListener("pointerup",tt),window.removeEventListener("pointercancel",tt),window.removeEventListener("blur",Ft),document.removeEventListener("visibilitychange",Bt),window.removeEventListener("keydown",It),window.removeEventListener("keyup",et),window.removeEventListener("wheel",ft),window.removeEventListener("resize",rt),window.removeEventListener("orientationchange",rt),wt&&(wt.removeEventListener("resize",rt),wt.removeEventListener("scroll",rt)),window.removeEventListener("gesturestart",Nt),Mt.reset();for(const B of xt)B()}}}const br=1,Sr=2,wr=4,Of=8,Er=16,qs=32,Bf=64,Hf=128,Hg=[[br,"atk"],[Sr,"dash"],[wr,"link"],[Of,"air"],[Er,"hurt"],[qs,"aim"],[Bf,"spr"],[Hf,"chan"]];function Xa(n){if(n===0)return"-";const t=Hg.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const Gg=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],Vg=0,Xg=15,lc=19,Wg=21,Yg=22,$g=23,Zg=24,xi={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},On=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,si=n=>Math.round(n*180/Math.PI*10)/10,hc=Math.PI*2;function zs(n){let t=n%hc;return t>Math.PI&&(t-=hc),t<-Math.PI&&(t+=hc),t}function jg(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=br),n.dash.phase!=="idle"&&(e|=Sr),n.playerLink.phase!=="idle"&&(e|=wr),n.character.grounded||(e|=Of),n.playerHurt.type!=="none"&&(e|=Er),t.intents.aimActive&&(e|=qs),n.character.sprinting&&(e|=Bf),n.abilities.channeling&&(e|=Hf),e}function qg(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function Kg(n){const t={sampleHz:n.sampleHz??xi.sampleHz,sampleCapacity:n.sampleCapacity??xi.sampleCapacity,eventCapacity:n.eventCapacity??xi.eventCapacity,anomalyCapacity:n.anomalyCapacity??xi.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??xi.dirJumpDeg,aimDropDeg:n.aimDropDeg??xi.aimDropDeg,freezeMs:n.freezeMs??xi.freezeMs,freezeSpeed:n.freezeSpeed??xi.freezeSpeed,stickLostMs:n.stickLostMs??xi.stickLostMs,spikeMs:n.spikeMs??xi.spikeMs},e=n.meta,i=[],a=[],s=[],o={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let r=!0,l=-1,c=-1e9,h=null,u=0,d=0,f="",m=-1,_=-1,g=-1,p=0,y=-1e9,x=-1,v={},w=null,S=0,A=0,T=0,b=0;function M(k,D){const U=1/t.sampleHz,G=k[Vg];G-c<U-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(k),c=G)}function P(k,D,U,G,W,ot){const gt=v[k]??-1e9;if(D-gt<1.2)return;if(v[k]=D,k==="frameSpike"){let kt=0;for(const Q of s)Q.kind==="frameSpike"&&kt++;if(kt>=6)return}s.length>=t.anomalyCapacity&&s.shift();let Mt=i.slice(-7);ot&&(Mt.length===0||Mt[Mt.length-1]!==ot)&&(Mt=[...Mt.slice(-6),ot]),s.push({kind:k,t:On(D),tick:U,ms:Math.round(G),detail:W,ctx:Mt}),k==="dirJump"?o.dirJumps++:k==="aimDrop"?o.aimDrops++:k==="moveFreeze"?o.freezes++:k==="stickLost"?o.stickLosts++:k==="stickJump"?o.stickJumps++:k==="stickBad"?o.stickBads++:k==="stickDrift"&&o.stickDrifts++}function L(k,D,U,G){a.length>=t.eventCapacity&&a.shift(),a.push({t:On(U),tick:G,k,d:D})}function F(k){switch(k.type){case"attack-start":o.attacks++;break;case"hit":o.hits++;break;case"player-hurt":o.hurts++;break;case"link-start":o.links++;break;case"link-hit":o.linkHits++;break;case"roll":o.rolls++;break;case"blink":o.blinks++;break;case"channel-start":o.channels++;break;case"projectile-fire":o.bolts++;break;case"ring-place":o.rings++;break;case"charge-start":o.bowCharges++;break;case"jumped":o.jumps++;break;case"reset":o.resets++;break;case"blocked":y=k.tick;break}}function O(){const k=o,D=k.wallMs/1e3,U=k.gestures,G=Mt=>Object.entries(U).filter(([kt])=>kt.endsWith(`.${Mt}`)).reduce((kt,[,Q])=>kt+Q,0),W=[];if(W.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),W.push(`运行 ${D.toFixed(1)}s / ${k.frames} 帧 · ${k.fps.toFixed(1)}fps · 最大 ${k.dtMax.toFixed(0)}ms · 尖峰 ${k.spikes} · 步 ${k.steps}`),W.push(`摇杆活跃 ${D>0?Math.round(k.stickActiveMs/1e3/D*100):0}% · 手势 按下 ${G("press")}（单击 ${G("tap")} / 双击 ${G("doubleTap")} / 拖拽 ${G("drag")} / 长按 ${G("longPress")} / 打断 ${G("cancel")} / 拖放 ${G("release")}）`),W.push(`攻击 ${k.attacks}(中${k.hits}) · 受击 ${k.hurts} · 派生 ${k.links}(中${k.linkHits}) · 翻滚 ${k.rolls} 闪现 ${k.blinks} · 跳 ${k.jumps} · 复位 ${k.resets}`),W.push(`法杖 引导${k.channels} 飞弹${k.bolts} 电环${k.rings} · 弓蓄力${k.bowCharges} · 当前武器 ${f||"-"}`),W.push(`异常 ${k.dirJumps+k.aimDrops+k.freezes+k.stickLosts+k.stickJumps+k.stickBads+k.stickDrifts}（dir ${k.dirJumps} / aim ${k.aimDrops} / freeze ${k.freezes} / stick ${k.stickLosts} / stickJump ${k.stickJumps} / 坏指针 ${k.stickBads} / 坐标漂移 ${k.stickDrifts}） · 掉帧尖峰 ${k.spikes}`+(k.inTurns>0?` · 输入转向 ${k.inTurns} 次（最大 ${k.inTurnMax.toFixed(0)}°）`:"")),s.length>0)for(const Mt of s.slice(-6)){W.push(`· ${Mt.kind} @t${Mt.t.toFixed(2)} tick${Mt.tick} ${Mt.ms>0?`${Mt.ms}ms `:""}${Mt.detail}`);const kt=Mt.ctx.map(nt=>String(nt[Xg])).join(" "),Q=Mt.ctx.map(nt=>nt[lc]===""||nt[lc]==null?".":String(nt[lc])).join(" ");if(W.push(`  yaw ${kt}`),W.push(`  in  ${Q}`),Mt.kind==="stickJump"||Mt.kind==="stickBad"||Mt.kind==="stickLost"){const nt=Mt.ctx.map(q=>`${q[Wg]},${q[Yg]}`).join(" "),ht=Mt.ctx.map(q=>`${q[$g]},${q[Zg]}`).join(" ");W.push(`  o   ${nt}`),W.push(`  p   ${ht}`)}}if(a.length>0){W.push("最近事件：");for(const Mt of a.slice(-12))W.push(`  ${Mt.t.toFixed(2)} ${Mt.k} ${Mt.d}`.trimEnd())}const ot=o.screenFrames>0?`屏幕 screenX/Y（${o.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",gt=o.screenFrames>0&&o.clientFrames>0?` / client 回退 ${o.clientFrames} 帧`:"";return W.push(`摇杆坐标源 ${ot}${gt}`),W.push(`UA ${e.ua}`),W.join(`
`)}return{sample(k,D,U,G=0){o.frames++,D.stickHeld&&(D.stickScreenOk?o.screenFrames++:o.clientFrames++),o.steps+=G,o.wallMs+=U,U>o.dtMax&&(o.dtMax=U),o.fps=o.wallMs>0?o.frames*1e3/o.wallMs:0,o.simS=k.time;const W=k.time;if(l<0&&(l=W),T=W,b=k.tick,!r)return;const ot=k.character,gt=Math.hypot(D.stickX,D.stickY),Mt=Math.hypot(ot.velocity.x,ot.velocity.z);f=k.combat.weapon;const kt=jg(k,D),Q=ot.facing,ht=Math.hypot(D.intents.moveX,D.intents.moveZ)>.05?Math.atan2(D.intents.moveX,D.intents.moveZ):null;gt>.2&&(o.stickActiveMs+=U);const q=[On(W),k.tick,Math.round(U*10)/10,On(D.stickX),On(D.stickY),On(D.stickRawX),On(D.stickRawY),D.stickHeld?1:0,D.source.slice(0,8),On(D.intents.moveX),On(D.intents.moveZ),On(ot.position.x),On(ot.position.z),On(ot.velocity.x),On(ot.velocity.z),si(Q),si(ot.bodyYaw),kt,On(ot.stride),ht===null?"":si(ht),D.stickId===null?"":D.stickId,Math.round(D.stickOriginX),Math.round(D.stickOriginY),Math.round(D.stickPxX),Math.round(D.stickPxY),D.stickBad,Math.round(D.stickVpTop),Math.round(D.stickOriginSX),Math.round(D.stickOriginSY),Math.round(D.stickScreenX),Math.round(D.stickScreenY),D.stickScreenOk?1:0,Math.round(D.stickScale*100)/100];M(q);const J=W*1e3<x;if(U>t.spikeMs&&!J&&W-l>.6&&(o.spikes++,P("frameSpike",W,k.tick,U,`dt ${U.toFixed(0)}ms fl=${Xa(kt)}`,q)),h!==null&&!J){const Ft=Math.abs(si(zs(Q-h))),Bt=Math.abs(si(zs(ot.moveYaw-u))),z=(d|kt)&(br|Sr|wr|Er)|kt&qs,R=ht===null?null:Math.abs(si(zs(Q-ht))),j=ht===null||h===null?null:Math.abs(si(zs(h-ht))),dt=R!==null&&j!==null&&R<j-.5,tt=(d&qs)!==0&&(kt&qs)===0&&ht===null,ct=R!==null&&(R<=12||dt);Ft>t.aimDropDeg&&tt?P("aimDrop",W,k.tick,0,`${Ft.toFixed(0)}° @aim→none stick(${D.stickX.toFixed(2)},${D.stickY.toFixed(2)}) aim(${D.aimDX.toFixed(0)},${D.aimDY.toFixed(0)}) fl=${Xa(kt)}`,q):Ft>t.dirJumpDeg&&z===0&&!tt&&(ct?(o.inTurns++,Ft>o.inTurnMax&&(o.inTurnMax=Ft)):P("dirJump",W,k.tick,0,`${Ft.toFixed(0)}° res${R===null?" 无输入":`${R.toFixed(0)}°`} yaw ${si(h)}→${si(Q)} in ${ht===null?".":si(ht)}° mvΔ${Bt.toFixed(0)}° aim(${D.aimDX.toFixed(0)},${D.aimDY.toFixed(0)}) fl=${Xa(d)}→${Xa(kt)}`,q))}const Z=(kt&(br|Sr|wr|Er))!==0,bt=k.tick-y<30;gt>.35&&Mt<t.freezeSpeed&&!Z&&!bt?(m<0&&(m=W),W-m>=t.freezeMs/1e3&&W>=_&&(P("moveFreeze",W,k.tick,(W-m)*1e3,`stick(${D.stickX.toFixed(2)},${D.stickY.toFixed(2)}) v${Mt.toFixed(2)} ${D.source} fl=${Xa(kt)}`,q),_=W+1.5,m=-1)):m=-1,D.stickHeld?(gt>p&&(p=gt),p>.35&&gt<.06?(g<0&&(g=W),W-g>=t.stickLostMs/1e3&&(P("stickLost",W,k.tick,(W-g)*1e3,`raw(${D.stickRawX.toFixed(2)},${D.stickRawY.toFixed(2)}) peak ${p.toFixed(2)} fl=${Xa(kt)}`,q),g=-1,p=0)):g=-1):(p=0,g=-1);const zt=D.stickScale>.2&&D.stickScale<5?D.stickScale:1,Dt=D.stickScreenOk,Ut=Dt?D.stickScreenX/zt:D.stickPxX,V=Dt?D.stickScreenY/zt:D.stickPxY,ne=Dt?D.stickOriginSX/zt:D.stickOriginX,Ht=Dt?D.stickOriginSY/zt:D.stickOriginY,Lt=Ut-ne,xt=V-Ht;if(D.stickHeld&&D.stickId!==null){const Ft=w;if(Ft&&Ft.held&&Ft.id===D.stickId){const Bt=Math.hypot(Ft.dx,Ft.dy),z=Math.hypot(Lt,xt),R=Math.max(Bt,z),j=Math.hypot(Ut-Ft.cx,V-Ft.cy),dt=Math.abs(si(zs(Math.atan2(xt,Lt)-Math.atan2(Ft.dy,Ft.dx)))),tt=R*dt*Math.PI/180,ct=Math.hypot(ne-Ft.ox,Ht-Ft.oy);if(R>18&&dt>35&&j<Math.max(5,tt*.35)&&P("stickJump",W,k.tick,0,`Δ${dt.toFixed(0)}° 手指只动${j.toFixed(0)}px(弧长应${tt.toFixed(0)}px) o(${Math.round(Ft.ox)},${Math.round(Ft.oy)})→(${Math.round(ne)},${Math.round(Ht)}) 原点位移${ct.toFixed(0)}px p(${Math.round(Ut)},${Math.round(V)}) raw(${Math.round(Lt)},${Math.round(xt)}) id${D.stickId} ${Dt?"src=屏幕":"src=client"}`,q),Dt&&Ft.screenOk){const It=Math.hypot(D.stickPxX-Ft.x,D.stickPxY-Ft.y),et=Math.hypot((D.stickScreenX-Ft.sx)/zt,(D.stickScreenY-Ft.sy)/zt);S+=It-et,Math.abs(S)>20&&(P("stickDrift",W,k.tick,0,`client 相对屏幕漂移 ${S>0?"+":""}${S.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(D.stickPxX)},${Math.round(D.stickPxY)}) screen(${Math.round(D.stickScreenX)},${Math.round(D.stickScreenY)})`,q),S=0)}}w={id:D.stickId,ox:ne,oy:Ht,cx:Ut,cy:V,x:D.stickPxX,y:D.stickPxY,sx:D.stickScreenX,sy:D.stickScreenY,dx:Lt,dy:xt,held:!0,screenOk:Dt}}else w=null,S=0;if(D.stickBad>A){const Ft=D.stickBad-A;P("stickBad",W,k.tick,0,`拦截 ${Ft} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${D.stickBad}）o(${Math.round(D.stickOriginX)},${Math.round(D.stickOriginY)}) p(${Math.round(D.stickPxX)},${Math.round(D.stickPxY)}) id${D.stickId??"-"}`,q)}A=D.stickBad,h=Q,u=ot.moveYaw,d=kt},event(k,D){const U=qg(k);F(k),r&&(k.type==="dash-ready"||k.type==="combo-reset"||k.type==="stepUp"||L(k.type,U,D,k.tick))},gesture(k){const D=`${k.button}.${k.kind}`;o.gestures[D]=(o.gestures[D]??0)+1,r&&(k.kind==="longPress"||k.kind==="doubleTap"||k.kind==="drag"||k.kind==="cancel")&&L(`g:${k.kind}`,`${k.button} ${k.heldMs.toFixed(0)}ms d${k.distance.toFixed(0)}px ${k.angleDeg.toFixed(0)}°`,T,b)},suspend(k){x=T*1e3+k,m=-1,g=-1},setEnabled(k){r=k,k||(h=null,w=null,m=-1,g=-1)},clear(){i.length=0,a.length=0,s.length=0,v={},c=-1e9,h=null,d=0,m=-1,g=-1,p=0,o.frames=0,o.wallMs=0,o.dtMax=0,o.spikes=0,o.stickActiveMs=0,o.attacks=0,o.hits=0,o.hurts=0,o.links=0,o.linkHits=0,o.rolls=0,o.blinks=0,o.channels=0,o.bolts=0,o.rings=0,o.bowCharges=0,o.jumps=0,o.resets=0,o.dirJumps=0,o.aimDrops=0,o.inTurns=0,o.inTurnMax=0,o.freezes=0,o.stickLosts=0,o.stickJumps=0,o.stickBads=0,o.stickDrifts=0,o.screenFrames=0,o.clientFrames=0,S=0,w=null,A=0;for(const k of Object.keys(o.gestures))delete o.gestures[k]},status(){const k=o.simS,D=s.some(U=>k-U.t<8&&(U.kind==="dirJump"||U.kind==="aimDrop"||U.kind==="moveFreeze"||U.kind==="stickLost"||U.kind==="stickJump"||U.kind==="stickBad"||U.kind==="stickDrift"));return{durationS:o.wallMs/1e3,frames:o.frames,events:a.length,anomalies:s.length,alert:D,enabled:r}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...o,gestures:{...o.gestures}},columns:Gg,samples:i.slice(),events:a.slice(),anomalies:s.slice()}},summary:O}}const Jg={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,skillDecel:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:0},worldBounds:{minX:-15.5,maxX:15.5,minZ:-15.5,maxZ:15.5},orientation:{bodyTurnRate:7,headTurnRate:12,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},turnInPlace:{enabled:!0,triggerDeg:50,settleDeg:8,durationSec:.45,idleSpeedRatio:.05,inputDeadZone:.12,lookRange:0,armSec:.03,gazeTriggerDeg:120},combat:{comboWindow:.65,settle:.16,attackMoveScale:.3,lungeMoveScale:.08,lungeCurve:1.2,lungeMaxSpeed:17,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3,hitWindow:{start:0,end:.85},comboWindow:.62,notifies:[{at:"windup",u:.7,name:"blade-air",value:.5},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.35,name:"foot-step",value:.6}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,148],[.2,125],[.4,68],[.6,-16],[.8,-78]]},2:{pts:[[0,-77],[.2,-68],[.4,-4],[.6,67],[.8,120]]},3:{stabU:.42}}}},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3,hitWindow:{start:0,end:.9},comboWindow:.5,notifies:[{at:"windup",u:.5,name:"blade-air",value:.45},{at:"active",u:0,name:"blade-air",value:1},{at:"active",u:.6,name:"blade-air",value:.7},{at:"recovery",u:.3,name:"foot-step",value:.5}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,151],[.2,137],[.4,62],[.6,-46],[.8,-128]]},2:{pts:[[0,-3],[.2,7],[.4,57],[.6,105],[.8,135]]},3:{pts:[[0,-150],[.2,-100],[.4,-40],[.6,1],[.8,36]]}}}},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3,hitWindow:{start:0,end:.8},comboWindow:.78,notifies:[{at:"windup",u:.85,name:"blade-air",value:.8},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.45,name:"foot-step",value:1}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,152],[.2,114],[.4,15],[.6,-65],[.8,-120]]},2:{pts:[[0,-124],[.2,-81],[.4,22],[.6,92],[.8,141]]},3:{pts:[[0,90],[.2,39],[.4,8],[.6,4],[.8,7]]}}},groundSlam:{slamU:.6,radius:2.4,knockback:.9,type:"knock",onlyUnhit:!0,holdMul:1.7}},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:.85,minChargeToFire:.15,chargeMoveMultiplier:.55,autoFire:!0,release:{windup:.04,active:.12,recovery:.26,lunge:0},trajectory:{speedMin:9,speedMax:16,launchPitchDeg:3.5,gravity:9,maxLife:2.4,radius:.2,stickMinPitchDeg:50,groundStickLift:.32,stickSec:4,homingRange:14,homingConeDeg:30,turnRateDeg:90,homingTime:.9,aimHeightRatio:.7,verticalTurnRate:18}}},abilities:{arcane:{perWave:3,waves:5,waveInterval:.2,spreadDeg:8,spreadTime:.22,spawnDelay:.035,spawnSideStep:.2,speedJitter:.12,homingRange:8,homingConeDeg:40,turnRateDeg:300,homingTime:1.1,retargetInterval:.25,cooldown:1,speed:10,life:1.4,radius:.3,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.6},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},skills:[{id:"arcane",kind:"channelVolley",slot:"attack",weapon:"staff",paramsRef:"arcane",enabled:!0},{id:"ring",kind:"groundRing",slot:"skill2",weapon:"staff",paramsRef:"ring",enabled:!0}],targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!1,dummyKnockback:.18,hitstop:{light:.045,heavy:.07,knock:.1},hitstopByWeapon:{"sword-shield":1,"dual-swords":.85,greatsword:1.3,staff:1.1,bow:.9},hitstopWarp:{enabled:!0,holdRate:.05,release:.055,payback:1.5,paybackBudget:.6},hitstopComboFalloff:[1,.85,.72]},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5,spar:1.2},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},gaze:{enabled:!0,headLookLimitDeg:55,headGazeRange:7,threatRange:8,recoveryDist:3.5,maxThreats:3,bodyTurnRate:3.2,headTurnRate:8,maxHeadSpeedDeg:300,maxBodySpeedDeg:130,headReturnRate:3.5,headReturnSpeedDeg:120,aimHeightRatio:.75,eyeHeightRatio:.78,headPitchRate:7,maxHeadPitchDeg:28,bodyPitchScale:.3,bodyPitchRate:4,enterThreshold:.05,reactToAttack:!0,reactToApproach:!0,approachDist:2.5,hurtHoldSec:2,hostileModeWeight:.6,spreadFalloff:1.5,behindFalloff:.35,behindAngleDeg:100,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5,spar:1.2},attackBoost:.6,nearDistance:1.5,saturation:2.6},dummies:{count:6,spawn:[{x:-11.1,z:-8.35},{x:-9.5,z:-8.35},{x:-7.9,z:-8.35},{x:0,z:-10.2},{x:-9.5,z:0},{x:-9.5,z:7.2}],initialModes:["idle","keep-distance","attack","attack","follow","idle"],leashRadius:2.4,radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4,fighters:{weapons:["sword-shield","dual-swords","greatsword"],spawn:[{x:-3.6,z:3.8},{x:3.9,z:3.6},{x:.2,z:5.9}],initialModes:["spar","spar","spar"],moveSpeed:2.1,attackInterval:3.4,attackRangeScale:.9,knockbackScale:.6,leashRadius:7}}},Qg={ground:{size:32,thickness:.4},steps:[{id:"stair-1",x:6.6,z:-5.6,width:2.4,depth:.9,height:.2},{id:"stair-2",x:6.6,z:-6.5,width:2.4,depth:.9,height:.4},{id:"stair-3",x:6.6,z:-7.4,width:2.4,depth:.9,height:.6},{id:"stair-4",x:6.6,z:-8.3,width:2.4,depth:.9,height:.8},{id:"plateau",x:6.6,z:-9.6,width:2.4,depth:1.6,height:.8},{id:"block-060",x:11.4,z:-6,width:1.4,depth:1.4,height:.6},{id:"block-090",x:11.4,z:-7.9,width:1.4,depth:1.4,height:.9},{id:"block-120",x:11.4,z:-9.8,width:1.4,depth:1.4,height:1.2}],doorways:[{id:"gate-wide",x:6.6,z:-4.3,openingWidth:2.4,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2},{id:"gate-narrow",x:11.4,z:-4.3,openingWidth:.5,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2}],obstacles:[{id:"crate-hub",x:2.5,z:-2.5,width:1.1,depth:1.1,height:.8},{id:"pillar-sw",x:-14.3,z:12.8,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-16,maxX:16,minZ:-16,maxZ:16},stations:[{id:"hub",index:1,name:"中央 8 向",hint:"推杆走 8 个方向 · 松手看停步收相 / 转身踏步",shape:"circle",x:0,z:0,radius:3.6,spawnX:0,spawnZ:0,labelX:0,labelZ:-3.1,color:"#8fe7ff"},{id:"rings",index:2,name:"环状态色阶",hint:"同距三假人：中立蓝 / 戒备黄 / 敌对红 · 点选看 3/4 环",shape:"circle",x:-9.5,z:-8.2,radius:3.4,spawnX:-9.5,spawnZ:-5.2,labelX:-9.5,labelZ:-10.9,color:"#ffc85a"},{id:"windup",index:3,name:"起手预警",hint:"走进 1.6m：脚下红弧填满 = 命中帧",shape:"circle",x:0,z:-10,radius:3.2,spawnX:0,spawnZ:-7,labelX:0,labelZ:-12.6,color:"#ff5a4a"},{id:"terrain",index:4,name:"地形 / 门洞",hint:"宽门 2.4m / 窄门 0.5m · 0.2m 台阶可走，0.6/0.9/1.2m 要跳",shape:"square",x:8.9,z:-7.4,radius:5.2,spawnX:8.9,spawnZ:-2.8,labelX:8.9,labelZ:-11.9,color:"#7fb8d8"},{id:"meter",index:5,name:"进度弧",hint:"弓长按 = 黄弧 · 法杖技2 = 紫弧 · 冲刺后 = 青弧冷却",shape:"circle",x:-9.5,z:8.6,radius:3.2,spawnX:-9.5,spawnZ:11.4,labelX:-9.5,labelZ:9.9,color:"#b48cff"},{id:"dash",index:6,name:"冲刺标尺",hint:"沿刻度跑：翻滚 3.2m / 闪现 5m，看落点差多少",shape:"square",x:9.8,z:8.2,radius:5.2,spawnX:9.8,spawnZ:12.8,labelX:7,labelZ:4.2,color:"#bfe8ff"},{id:"gait",index:7,name:"侧后方步态",hint:"面向假人贴到 1.2m，沿引线按 90 / 135 / 180 走",shape:"circle",x:-9.5,z:0,radius:3.2,spawnX:-9.5,spawnZ:2.6,labelX:-9.5,labelZ:-2.5,color:"#6fc9a0"}]},tx={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:28,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.42},bodyTypes:{standard:{name:"标准",height:1.2,radius:.3},tall:{name:"瘦高",height:1.32,radius:.26,voxel:{headSize:.36,bodyWidth:.34,bodyHeight:.28,limbThickness:.1,legLength:.68,armLength:.5},colors:{body:"#58b39a",head:"#ffe0b2",limb:"#3f8f7c",shoe:"#24443c"}}},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.6,chestYawMaxDeg:40,stopYawBlendMode:"inStop",stopYawAfterSec:.3,turnStepEnabled:!0,turnStepPitch:.5,turnStepKnee:.35,turnStepDip:.02,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1,backStrafeStartDeg:100,backStrafeFullDeg:132},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14,moveTakeover:{speed:.35,full:1.2,windup:.55,recovery:1,settle:1}},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13},stretch:{enabled:!0,swingArm:1.45,chargeArm:.88,runLeg:1,torsoGain:.5,impactSquash:.2,impactDecay:11,volumeExp:.5,smoothing:30},swing:{enabled:!0,bodyScale:1,shoulderLift:.055,shoulderPush:.045,shoulderIn:.032,segBlend:.1,segBlendMin:.03,segBlendRef:6,segBlendMax:.14,weaponScale:{greatsword:1,"sword-shield":.78,"dual-swords":.9},combo:{greatsword:["gs.right-left","gs.left-right","gs.overhead"],"sword-shield":["gs.right-left","gs.left-right","ss.shield-bash"],"dual-swords":["ds.right-left","ds.left-right","ds.spin"]},clips:{"gs.right-left":{kind:"right-left",note:"段 1：从右后方扫到左后方。rootYaw 整体带转 ±0.55 rad（≈31°）叠在腰椎 ±60° 上，大剑刃尖水平扫角约 210°",keys:[{t:0,ease:"in",pose:{bodyYaw:1.05,bodyPitch:-.14,bodyRoll:-.18,pelvisX:.06,pelvisZ:-.07,armPitch:-1.15,armYaw:.4,armRoll:.2,elbow:-.5,rootYaw:.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.08,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:0,armRoll:.04,elbow:-.3,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.15,bodyPitch:.16,bodyRoll:.2,pelvisX:-.07,pelvisZ:.11,armPitch:-1.5,armYaw:-.4,armRoll:-.14,elbow:-.12,rootYaw:-.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:-1.55}}]},"gs.left-right":{kind:"left-right",note:"段 2：承接段 1 左后方收势，整体带转 −0.55→+0.55 rad 反向拧回右后方，剑身仍水平",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-.4,armRoll:-.16,elbow:-.5,rootYaw:-.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:0,armRoll:.02,elbow:-.32,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:.4,armRoll:.16,elbow:-.12,rootYaw:.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:1.55}}]},"gs.overhead":{kind:"overhead",note:"段 3：举过头顶（剑身 75° 朝上）向前下劈到 −31°，躯干后仰 → 前压",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.32,bodyRoll:-.05,pelvisX:0,pelvisZ:-.07,armPitch:-1.9,armYaw:-.3,armRoll:.16,elbow:-.55,bladePitch:1.62,bladeTwist:0}},{t:.55,pose:{bodyYaw:.06,bodyPitch:.1,bodyRoll:0,pelvisX:0,pelvisZ:.03,armPitch:-1.1,armYaw:-.26,armRoll:.08,elbow:-.3,bladePitch:.55,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.55,bodyRoll:.02,pelvisX:0,pelvisZ:.13,armPitch:-.15,armYaw:-.2,armRoll:0,elbow:-.1,bladePitch:-.75,bladeTwist:0}}]},"ds.right-left":{kind:"right-left",note:"双持段 1：右手横扫到左后方，左手同时向左后方收（后摆 + 屈肘），两把剑都保持水平",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:1,bodyPitch:-.12,bodyRoll:-.16,pelvisX:.05,pelvisZ:-.06,armPitch:-1.15,armYaw:.9,armRoll:.18,elbow:-.45,armLPitch:.5,armLYaw:-1,armLRoll:.12,elbowL:-1.15,rootYaw:.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.06,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:-.1,armRoll:.04,elbow:-.3,armLPitch:.6,armLYaw:-1,armLRoll:.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.1,bodyPitch:.14,bodyRoll:.18,pelvisX:-.06,pelvisZ:.1,armPitch:-1.5,armYaw:-1.4,armRoll:-.12,elbow:-.12,armLPitch:.65,armLYaw:-.9,armLRoll:.18,elbowL:-1.3,rootYaw:-.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.55}}]},"ds.left-right":{kind:"left-right",note:"双持段 2：左手横扫回右后方，右手同时向右后方收（段 1 的镜像，主挥换到左手）",lead:"L",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-1.4,armRoll:-.16,elbow:-.5,armLPitch:.5,armLYaw:1,armLRoll:-.12,elbowL:-1.15,rootYaw:-.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:-.1,armRoll:.02,elbow:-.32,armLPitch:.6,armLYaw:.9,armLRoll:-.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:1.4,armRoll:.16,elbow:-.12,armLPitch:.65,armLYaw:.8,armLRoll:-.18,elbowL:-1.3,rootYaw:.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:1.55}}]},"ds.spin":{kind:"spin",note:"双持段 3：双剑水平展开（主副手 roll 外张到 ±1.15），整个人原地转一整圈。spin 按 attackProgress 单调推进到 2π≡0，收招自动回正",lead:"R",spin:{turns:1,ease:"inOut",span:.6},keys:[{t:0,ease:"in",pose:{bodyYaw:.1,bodyPitch:-.14,bodyRoll:0,pelvisX:0,pelvisZ:-.05,armPitch:-1.1,armYaw:1.7,armRoll:.3,elbow:-.5,armLPitch:-1.1,armLYaw:0,armLRoll:-.3,elbowL:-.5,bladePitch:.05,bladePitchOff:.05,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:.5,pose:{bodyYaw:0,bodyPitch:.04,bodyRoll:0,pelvisX:0,pelvisZ:.04,armPitch:-1.55,armYaw:2.1,armRoll:.45,elbow:-.05,armLPitch:-1.55,armLYaw:.3,armLRoll:-.45,elbowL:-.05,bladePitch:0,bladePitchOff:0,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:1,pose:{bodyYaw:-.1,bodyPitch:.12,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:-1.3,armYaw:1.9,armRoll:.4,elbow:-.25,armLPitch:-1.3,armLYaw:-.05,armLRoll:-.4,elbowL:-.25,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.35,bladeTwistOff:1.35}}]},"ss.shield-bash":{kind:"bash",note:"剑盾段 3：收盾蓄力 → 左臂持盾猛前顶（臂前伸 + 肘伸直 + 身体前压 + 骨盆前冲）。bladePitchOff 反解让盾面始终正对前方",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.28,bodyRoll:-.04,pelvisX:.01,pelvisZ:-.08,armPitch:.1,armYaw:-.2,armRoll:.1,elbow:-.7,armLPitch:-.7,armLYaw:.1,armLRoll:.15,elbowL:-.9,bladePitch:.2,bladePitchOff:.1,bladeTwist:0}},{t:.55,pose:{bodyYaw:.04,bodyPitch:.15,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:.2,armYaw:-.15,armRoll:.05,elbow:-.6,armLPitch:-1.1,armLYaw:.05,armLRoll:.1,elbowL:-.45,bladePitch:.1,bladePitchOff:.02,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.5,bodyRoll:.02,pelvisX:0,pelvisZ:.18,armPitch:.25,armYaw:-.1,armRoll:0,elbow:-.5,armLPitch:-1.55,armLYaw:0,armLRoll:.05,elbowL:-.05,bladePitch:.05,bladePitchOff:0,bladeTwist:0}}]}},poseIn:.1,poseOut:.16},stance:{"sword-shield":{armSwing:.85,armR:{pitch:-.12,roll:.1,elbow:-.15},armL:{pitch:-.45,roll:.1,elbow:-.75},torsoYaw:.12,bladePitchDeg:-8,blend:.22},"dual-swords":{armSwing:1,armR:{pitch:-.15,roll:.16,elbow:-.45},armL:{pitch:-.15,roll:-.16,elbow:-.45},torsoYaw:0,bladePitchDeg:-12,bladePitchOffDeg:-8,blend:.22},greatsword:{armSwing:.45,armR:{pitch:-.3,roll:.05,elbow:-.55},armL:{pitch:-.2,roll:-.1,elbow:-.65},torsoPitch:.04,bladePitchDeg:-30,blend:.26},staff:{armSwing:.6,armR:{pitch:-.1,roll:.06,elbow:-.35},armL:{pitch:.02,roll:-.08,elbow:-.15},torsoYaw:.06,blend:.22},bow:{armSwing:.55,armL:{pitch:-.15,roll:-.1,elbow:-.2},armR:{pitch:.02,elbow:-.25},torsoYaw:-.08,blend:.22}},spine:{enabled:!0,waist:.58,chest:.42,neck:.16,chestPivot:.42}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6,twoHandInsetX:.15,twoHandGripY:-.1,twoHandMaxStretch:1.3,twoHandMinGrip:.62,twoHandGripStart:1.02,twoHandSlideRate:9,swordCantDeg:10,greatswordCantDeg:0},weaponWrist:{enabled:!0,lag:.042,maxAngle:.72,rate:24,twistLag:.03,maxTwist:.5,runDrag:.11},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},groundRing:{playerRadiusFactor:2.3,dummyRadiusFactor:2.05,thicknessFactor:.16,arcDeg:180,selectedArcDeg:270,opacity:.22,playerOpacity:.44,selectedOpacity:.62,selectedScale:1.06,selectedThicknessScale:1.6,edgeFade:.2,playerColor:"#8fe7ff",neutralColor:"#7fb8d8",lowThreatColor:"#ffc85a",highThreatColor:"#ff3b30",haloRadiusFactor:1.16,haloThicknessFactor:2.6,haloOpacity:.14,haloFadeInSec:.05,haloFadeOutSec:.36,meterRadiusFactor:1.34,meterThicknessFactor:.52,meterOpacity:.9,meterColorCharge:"#ffd166",meterColorChannel:"#b48cff",meterColorCooldown:"#7fb8d8",warnRadiusFactor:1.14,warnThicknessFactor:1.5,warnOpacity:.9,warnColor:"#ff5a4a",areaOpacity:.5,landingOpacity:.55,areaExpandSec:.22},projectiles:{arrowColor:"#ffe3a6",arrowHeadColor:"#fff6d8",arrowTrailColor:"#ffcf86",arrowLength:.72,arrowWidth:.062,arrowHeadSize:.16,arrowGlowSize:.5,trailLength:1.05,trailOpacity:.42,boltColor:"#a9ecff",boltGlowColor:"#7fe3ff",boltShapeX:.42,boltShapeY:.42,boltShapeZ:.85,boltGlowScale:1.6,boltTrailScale:2.2,slashEnabled:!1,slashThickness:.075,slashGlowOpacity:.34},weaponTrail:{enabled:!0,maxSamples:30,minStep:.015,life:.11,minSpeed:5.5,color:"#8fd0ff",intensity:.42,tipBoost:.35,pulseDecay:14},hitstop:{enabled:!0,duration:.07},lab:{enabled:!0,showLabels:!0,padOpacity:.55,labelTextHeight:.82},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],attackArcColor:"#ff6b5e",fighterColors:[{body:"#c85a4a",limb:"#8d3a30",head:"#f0c9a0"},{body:"#c9a03c",limb:"#8a6b22",head:"#f0d6a0"},{body:"#7d6ec4",limb:"#4f4488",head:"#e6d2b0"}]},balance:{enabled:!0,reactionTime:.18,gravity:9.81,autoCounter:!0,maxShift:.045,counterRate:8,predLead:.12,counterBoost:1.6},renderInterp:{enabled:!0,yawSmoothMs:35},groundSlam:{enabled:!0,color:"#e8d8b0",duration:.42,delay:.09,outerScale:1.25,shake:.95}},ex={core:Jg,scene:Qg,view:tx};function dh(n){return JSON.parse(JSON.stringify(n))}const uh=ex,nx=dh(uh.core),Ao=dh(uh.scene),fn=dh(uh.view);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class bi{constructor(t,e,i,a,s="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(s),this.domElement.classList.add("controller"),this.domElement.classList.add(a),this.$name=document.createElement("div"),this.$name.classList.add("name"),bi.nextNameID=bi.nextNameID||0,this.$name.id=`lil-gui-name-${++bi.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class ix extends bi{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function cl(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const ax={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:cl,toHexString:cl},so={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},sx={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=so.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return so.toHexString(a)}},ox={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=so.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return so.toHexString(a)}},rx=[ax,so,sx,ox];function cx(n){return rx.find(t=>t.match(n))}class lx extends bi{constructor(t,e,i,a){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=cx(this.initialValue),this._rgbScale=a,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const s=cl(this.$text.value);s&&this._setValueFromHexString(s)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class dc extends bi{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",a=>{a.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class hx extends bi{constructor(t,e,i,a,s,o){super(t,e,i,"number"),this._initInput(),this.min(a),this.max(s);const r=o!==void 0;this.step(r?o:this._getImplicitStep(),r),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let y=parseFloat(this.$input.value);isNaN(y)||(this._stepExplicit&&(y=this._snap(y)),this.setValue(this._clamp(y)))},i=y=>{const x=parseFloat(this.$input.value);isNaN(x)||(this._snapClampSetValue(x+y),this.$input.value=this.getValue())},a=y=>{y.key==="Enter"&&this.$input.blur(),y.code==="ArrowUp"&&(y.preventDefault(),i(this._step*this._arrowKeyMultiplier(y))),y.code==="ArrowDown"&&(y.preventDefault(),i(this._step*this._arrowKeyMultiplier(y)*-1))},s=y=>{this._inputFocused&&(y.preventDefault(),i(this._step*this._normalizeMouseWheel(y)))};let o=!1,r,l,c,h,u;const d=5,f=y=>{r=y.clientX,l=c=y.clientY,o=!0,h=this.getValue(),u=0,window.addEventListener("mousemove",m),window.addEventListener("mouseup",_)},m=y=>{if(o){const x=y.clientX-r,v=y.clientY-l;Math.abs(v)>d?(y.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(x)>d&&_()}if(!o){const x=y.clientY-c;u-=x*this._step*this._arrowKeyMultiplier(y),h+u>this._max?u=this._max-h:h+u<this._min&&(u=this._min-h),this._snapClampSetValue(h+u)}c=y.clientY},_=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",m),window.removeEventListener("mouseup",_)},g=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",a),this.$input.addEventListener("wheel",s,{passive:!1}),this.$input.addEventListener("mousedown",f),this.$input.addEventListener("focus",g),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,y,x,v,w)=>(p-y)/(x-y)*(w-v)+v,e=p=>{const y=this.$slider.getBoundingClientRect();let x=t(p,y.left,y.right,this._min,this._max);this._snapClampSetValue(x)},i=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",a),window.addEventListener("mouseup",s)},a=p=>{e(p.clientX)},s=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",a),window.removeEventListener("mouseup",s)};let o=!1,r,l;const c=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),o=!1},h=p=>{p.touches.length>1||(this._hasScrollBar?(r=p.touches[0].clientX,l=p.touches[0].clientY,o=!0):c(p),window.addEventListener("touchmove",u,{passive:!1}),window.addEventListener("touchend",d))},u=p=>{if(o){const y=p.touches[0].clientX-r,x=p.touches[0].clientY-l;Math.abs(y)>Math.abs(x)?c(p):(window.removeEventListener("touchmove",u),window.removeEventListener("touchend",d))}else p.preventDefault(),e(p.touches[0].clientX)},d=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",u),window.removeEventListener("touchend",d)},f=this._callOnFinishChange.bind(this),m=400;let _;const g=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const x=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+x),this.$input.value=this.getValue(),clearTimeout(_),_=setTimeout(f,m)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",g,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class dx extends bi{constructor(t,e,i,a){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(a)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class ux extends bi{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",a=>{a.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const fx=`.lil-gui {
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
}`;function px(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let Cd=!1;class Tr{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:a,title:s="Controls",closeFolders:o=!1,injectStyles:r=!0,touchStyles:l=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",c=>{(c.code==="Enter"||c.code==="Space")&&(c.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(s),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),l&&this.domElement.classList.add("allow-touch-styles"),!Cd&&r&&(px(fx),Cd=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),a&&this.domElement.style.setProperty("--width",a+"px"),this._closeFolders=o}add(t,e,i,a,s){if(Object(i)===i)return new dx(this,t,e,i);const o=t[e];switch(typeof o){case"number":return new hx(this,t,e,i,a,s);case"boolean":return new ix(this,t,e);case"string":return new ux(this,t,e);case"function":return new dc(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,i=1){return new lx(this,t,e,i)}addFolder(t){const e=new Tr({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof dc||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof dc)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=s=>{s.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const a=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=a+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function mx(n,t,e,i){const a=document.getElementById("debug-panel"),s=a?new Tr({title:"实验台 · 调试面板",autoPlace:!1,container:a}):new Tr({title:"实验台 · 调试面板"}),o=n.config,r=[],l=[],c=ft=>{const Nt=s.addFolder(ft);return l.push(Nt),Nt},h=(ft,Nt)=>{const rt=ft.addFolder(Nt);return r.push(rt),rt},u=c("模拟 / 显示");u.add(e,"timeScale",0,3,.05).name("时间缩放"),u.add(e,"paused").name("暂停"),u.add({step:i.singleStep},"step").name("单步 (1 tick)"),u.add({reset:i.reset},"reset").name("复位全部"),u.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),u.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid),u.add(e,"showLab").name("工位地面盘").onChange(i.onToggleLab),u.add(e,"showLabLabels").name("工位标牌").onChange(i.onToggleLabLabels);const d=h(u,"模块开关");d.add(n.modules,"movement").name("movement"),d.add(n.modules,"combat").name("combat"),d.add(n.modules,"links").name("links"),d.add(n.modules,"orientation").name("orientation"),d.add(n.modules,"turnInPlace").name("turnInPlace"),d.add(n.modules,"targeting").name("targeting"),d.add(n.modules,"hits").name("hits"),d.add(n.modules,"separation").name("separation"),d.add(n.modules,"dash").name("dash"),d.add(n.modules,"camera").name("camera"),d.add(n.modules,"dummies").name("dummies"),d.add(n.modules,"abilities").name("abilities");const f=c("移动 / 输入"),m=h(f,"基础移动参数");m.add(o,"moveSpeed",1,10,.1).name("移动速度"),m.add(o,"sprintMultiplier",1,3,.05).name("冲刺倍率"),m.add(o,"acceleration",1,40,.5).name("加速度"),m.add(o,"friction",1,40,.5).name("摩擦"),m.add(o,"skillDecel",2,40,.5).name("进入技能时的减速速率"),m.add(o,"gravity",5,60,.5).name("重力"),m.add(o,"jumpSpeed",2,16,.2).name("起跳速度"),m.add(o,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),m.add(o,"characterRadius",.1,.8,.01).name("角色半径"),m.add(o,"characterHeight",.6,2.2,.05).name("角色身高"),m.add(o,"strideLength",.3,3,.05).name("基础步幅"),m.add(o,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),m.add(o,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const _=h(f,"摇杆 / 输入");_.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),_.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const g=o.dash,p=h(f,"冲刺 / 闪避");p.add(g,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),p.add(g,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),p.add(g,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),p.add(g,"blinkDistance",1,12,.25).name("闪现距离 (m)"),p.add(g,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),p.add(g,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),p.add(g,"blinkClearVelocity").name("闪现清空速度"),p.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),p.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const y=o.separation,x=h(f,"角色间分离 / 挤压阻力");x.add(y,"iterations",1,8,1).name("迭代次数"),x.add(y,"slop",0,.05,.002).name("额外分离量 (m)"),x.add(y.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),x.add(y.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),x.add(y.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const v=c("动作 / 步态"),w=h(v,"程序化步态");w.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),w.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),w.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),w.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),w.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),w.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),w.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),w.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),w.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),w.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),w.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),w.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),w.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),w.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)"),w.add(t.gait,"backStrafeStartDeg",20,170,1).name("侧后方起步角 (°)"),w.add(t.gait,"backStrafeFullDeg",40,180,1).name("完全后退角 (°)"),w.add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)");const S=h(v,"停步 / 收相 / 惯性");S.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),S.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),S.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),S.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),S.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),S.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),S.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),S.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),S.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),S.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),S.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),S.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const A=h(v,"足部 IK"),T=t.ik;A.add(T,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),A.add(T,"weight",0,1,.01).name("钉地权重"),A.add(T,"attackScale",0,1,.01).name("攻击时权重倍率"),A.add(T,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const b=h(v,"惯性倾斜 / 盆骨"),M=t.lean;b.add(M,"accelGain",0,.1,.002).name("前后加速度增益"),b.add(M,"turnGain",0,.2,.005).name("绕圈侧倾增益"),b.add(M,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),b.add(M,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),b.add(M,"smoothing",1,30,1).name("倾斜平滑速率"),b.add(M,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),b.add(M,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),b.add(M,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),b.add(M,"crouchSmoothing",1,30,1).name("下沉平滑速率");const P=o.orientation,L=h(v,"朝向 / 接敌注视 / 原地转身");L.add(P,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),L.add(P,"headTurnRate",.5,40,.5).name("头部转向速率"),L.add(P,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),L.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),L.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),L.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const F=o.gaze;L.add(F,"headReturnRate",.5,12,.1).name("无目标回正速率 (1/s)"),L.add(F,"headReturnSpeedDeg",20,400,10).name("回正角速度上限 (°/s)"),L.add(F,"bodyTurnRate",.2,12,.1).name("接敌身体转向速率"),L.add(F,"headTurnRate",.5,30,.5).name("接敌头部转向速率"),L.add(F,"maxHeadSpeedDeg",30,900,10).name("头部最大角速度 (°/s)"),L.add(F,"maxBodySpeedDeg",20,600,10).name("身体最大角速度 (°/s)"),L.add(F,"aimHeightRatio",.2,1,.05).name("注视点高度（身高比例）"),L.add(F,"headPitchRate",.5,20,.5).name("头部俯仰速率"),L.add(F,"maxHeadPitchDeg",0,60,1).name("头部俯仰限幅 (°)"),L.add(F,"bodyPitchScale",0,1,.05).name("身体俯仰比例"),L.add(F,"bodyPitchRate",.5,20,.5).name("身体俯仰速率");const O=o.turnInPlace;L.add(O,"enabled").name("启用原地转身 (关=纯插值)"),L.add(O,"triggerDeg",20,180,5).name("触发夹角 (°)"),L.add(O,"gazeTriggerDeg",20,180,5).name("接敌时触发夹角 (°)"),L.add(O,"settleDeg",0,60,1).name("转身保留余角 (°)"),L.add(O,"durationSec",.1,1.5,.02).name("转身时长 (s)"),L.add(O,"idleSpeedRatio",0,.3,.01).name("静止速度比上限"),L.add(O,"inputDeadZone",0,.5,.01).name("起步输入死区"),L.add(O,"armSec",0,.5,.01).name("触发防抖 (s)"),L.add(t.gait,"stopYawBlendMode",["inStop","afterStop"]).name("停步偏差消化窗口"),L.add(t.gait,"stopYawAfterSec",.05,1,.02).name("收相后消化时长 (s)"),L.add(t.gait,"turnStepEnabled").name("转身踏步 (关=滑过去)"),L.add(t.gait,"turnStepPitch",0,1.2,.02).name("踏步前迈 (rad)"),L.add(t.gait,"turnStepKnee",0,1,.02).name("踏步抬膝 (rad)"),L.add(t.gait,"turnStepDip",0,.1,.002).name("踏步重心下沉 (m)");const k=c("战斗 / 命中"),D=o.combat,U=h(k,"连击 / 武器时序"),G=U.add(n.combat,"weapon",ra).name("当前武器");U.add(D,"comboWindow",.1,2,.05).name("连击窗口 (s)"),U.add(D,"settle",0,.8,.01).name("段间停顿 (s)"),U.add(D,"attackMoveScale",0,1,.01).name("攻击时移动比例"),U.add(D,"lungeMoveScale",0,.4,.01).name("跨步时移动比例"),U.add(D,"lungeCurve",.2,4,.1).name("跨步曲线指数 (大=更冲)"),U.add(D,"lungeMaxSpeed",4,30,.5).name("跨步速度上限 (m/s)"),U.add(D,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),U.add(D,"cancelWindow",0,1,.01).name("取消窗口 (s)"),U.add(D,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),U.add(D,"autoCombo").name("按住自动连击"),U.add(D.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),U.add(D.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),U.add(D.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),U.add(D.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率"),U.add(D.bow,"maxChargeTime",.2,2,.05).name("满蓄力时间 (s)"),U.add(D.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),U.add(D.bow,"autoFire").name("蓄满自动放箭 (按住连射)"),U.add(D.bow.trajectory,"gravity",0,24,.5).name("箭矢重力 (m/s²)"),U.add(D.bow.trajectory,"speedMax",8,32,.5).name("满蓄初速 (m/s)"),U.add(D.bow.trajectory,"homingRange",0,30,1).name("自动瞄准距离 (m)"),U.add(D.bow.trajectory,"turnRateDeg",0,240,5).name("箭追踪转向 (°/s)"),U.add(D.bow.trajectory,"homingTime",0,2,.05).name("追踪时长 (s)"),U.add(D.bow.trajectory,"aimHeightRatio",0,1,.05).name("瞄准点高度");const W=o.abilities;U.add(W.arcane,"perWave",1,8,1).name("每波飞弹数"),U.add(W.arcane,"waves",1,12,1).name("每次引导波数"),U.add(W.arcane,"waveInterval",.05,.8,.01).name("波间隔 (s)"),U.add(W.arcane,"spreadDeg",0,20,.5).name("波内散布 (度)"),U.add(W.arcane,"spreadTime",0,.6,.01).name("出膛散开时长 (s)"),U.add(W.arcane,"spawnDelay",0,.2,.005).name("波内出膛错落 (s)"),U.add(W.arcane,"speedJitter",0,.5,.02).name("速度浮动比例"),U.add(W.arcane,"turnRateDeg",0,420,10).name("制导转向 (度/秒)"),U.add(W.arcane,"retargetInterval",.05,1,.05).name("重新索敌间隔 (s)"),U.add(W.arcane,"cooldown",0,3,.05).name("引导结束冷却 (s)"),U.add(W.arcane,"speed",3,24,.5).name("飞弹速度"),U.add(W.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),U.add(W.ring,"radius",.5,5,.1).name("电环半径"),U.add(W.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),U.add(W.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const ot=o.hits.hitstopWarp;if(ot){const ft=h(k,"卡肉节奏（接触瓦片）");ft.add(ot,"enabled").name("瓦片开（关=硬冻结）"),ft.add(ot,"holdRate",0,.4,.01).name("保持期速率"),ft.add(ot,"release",.005,.2,.005).name("释放时长 (s)"),ft.add(ot,"payback",1,2.5,.05).name("偿还倍率"),ft.add(o.hits.hitstop,"light",0,.2,.005).name("轻击保持 (s)"),ft.add(o.hits.hitstop,"heavy",0,.25,.005).name("重击保持 (s)"),ft.add(o.hits.hitstop,"knock",0,.3,.005).name("击飞保持 (s)")}const gt=o.hits,Mt=h(k,"命中 / 受击 / 击退");Mt.add(gt,"arcDeg",10,120,5).name("命中扇区半角 (°)"),Mt.add(gt,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),Mt.add(gt,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),Mt.add(gt,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),Mt.add(gt.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),Mt.add(gt.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),Mt.add(gt,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),Mt.add(gt,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const kt={get enabled(){return!gt.noDamageToPlayer},set enabled(ft){gt.noDamageToPlayer=!ft}};Mt.add(kt,"enabled").name("玩家受击击退");const Q=h(k,"受击分层"),nt=t.hurt;Q.add(nt,"enabled").name("启用分层受击 (关=旧版对照)"),Q.add(nt,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),Q.add(nt,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),Q.add(nt,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),Q.add(nt,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),Q.add(nt,"upperShiftScale",0,1,.01).name("上身位移缩放"),Q.add(nt,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),Q.add(nt.hitHeight,"light",0,1,.01).name("轻击命中部位"),Q.add(nt.hitHeight,"heavy",0,1,.01).name("重击命中部位"),Q.add(nt.hitHeight,"knock",0,1,.01).name("击退命中部位"),Q.add(nt,"leanLight",0,1.5,.01).name("轻击力度"),Q.add(nt,"leanHeavy",0,1.5,.01).name("重击力度"),Q.add(nt,"leanKnock",0,1.5,.01).name("击退力度"),Q.add(nt,"flashStrength",0,2,.05).name("受击闪光强度");for(const{name:ft,p:Nt}of[{name:"打腹 (abdomen)",p:nt.abdomen},{name:"打肩 (shoulder)",p:nt.shoulder}]){const rt=h(Q,ft);rt.add(Nt,"upperPitch",0,2,.01).name("上身前后倾斜"),rt.add(Nt,"upperRoll",0,2,.01).name("上身侧倾"),rt.add(Nt,"upperYaw",0,1.5,.01).name("肩部扭转"),rt.add(Nt,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),rt.add(Nt,"shift",0,.8,.01).name("身体反应位移"),rt.add(Nt,"drop",0,.4,.01).name("整体下沉"),rt.add(Nt,"back",0,.4,.01).name("屁股向后"),rt.add(Nt,"knee",0,1.6,.01).name("屈膝"),rt.add(Nt,"hip",0,1,.01).name("髋前倾"),rt.add(Nt,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)")}const ht=h(k,"派生招"),q=o.links;ht.add(q,"enabled").name("总开关 (false=旧连击)"),ht.add(q.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),ht.add(q.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),ht.add(q.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),ht.add(q,"sharedCooldown",0,3,.05).name("共享 CD (s)"),ht.add(q,"triggerWhileSprinting").name("长跑中可直接触发"),ht.add(q.search,"range",1,14,.1).name("索敌距离 (m)"),ht.add(q.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),ht.add(q.search,"stopDistance",0,3,.05).name("停住距离 (m)");const J=q.moves["sword-shield"];J&&(ht.add(J,"enabled").name("剑盾盾击"),ht.add(J,"distance",0,8,.1).name("冲锋极限 (m)"),ht.add(J,"windup",0,.5,.01).name("前摇 (s)"),ht.add(J,"active",0,.8,.01).name("冲锋 / 命中 (s)"),ht.add(J,"recovery",0,.8,.01).name("收势 (s)"),ht.add(J.hit,"radius",0,4,.05).name("命中半径 (m)"),ht.add(J.hit,"width",0,2,.05).name("扫掠半径 (m)"),ht.add(J.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),ht.add(J.hit,"duration",0,1.5,.01).name("僵直 (s)"));const Z=o.targeting,bt=h(k,"目标辅助");bt.add(Z,"targetAssist").name("启用目标辅助"),bt.add(Z,"range",1,14,.5).name("锁定范围 (m)"),bt.add(Z,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),bt.add(Z,"frontBias",0,4,.1).name("朝向加权"),bt.add(Z,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),bt.add(Z,"maxLungeScale",1,3,.1).name("前冲最大放大");const zt=c("表现 / 特效"),Dt=h(zt,"挥击幅度 / 刀光"),Ut=t.animation.swing;Dt.add(Ut,"enabled").name("挥击身体幅度 开"),Dt.add(Ut,"bodyScale",0,1.6,.05).name("躯干 / 骨盆幅度倍率"),Dt.add(Ut,"shoulderLift",0,.12,.005).name("肩部抬升上限 (m)"),Dt.add(Ut,"shoulderPush",0,.1,.005).name("肩部前送上限 (m)"),Dt.add(Ut,"shoulderIn",0,.1,.005).name("双手武器肩内收 (m)"),Dt.add(Ut,"segBlend",0,.35,.01).name("段间过渡兜底 (s)"),Dt.add(Ut,"segBlendMin",.008,.12,.004).name("段间过渡下限 (s)"),Dt.add(Ut,"segBlendRef",2,16,.5).name("段间过渡参考距离 (rad)"),Dt.add(Ut.weaponScale,"greatsword",0,1.6,.05).name("大剑幅度倍率");const V=t.weaponTrail;Dt.add(V,"enabled").name("挥击刀光 开"),Dt.add(V,"life",.04,.4,.01).name("刀光残留 (s)"),Dt.add(V,"intensity",0,1.5,.05).name("刀光亮度"),Dt.add(V,"minStep",.005,.1,.005).name("采样最小位移 (m)"),Dt.add(t.hitstop,"enabled").name("命中卡肉 / 震屏");const ne=h(zt,"夸张化 / 四肢伸缩"),Ht=t.animation.stretch;ne.add(Ht,"enabled").name("四肢伸缩 开"),ne.add(Ht,"swingArm",1,1.8,.01).name("挥出时手臂拉伸"),ne.add(Ht,"chargeArm",.7,1,.01).name("蓄力时手臂压缩"),ne.add(Ht,"impactSquash",0,.5,.01).name("命中挤压量"),ne.add(Ht,"impactDecay",2,30,.5).name("挤压回弹速率 (1/s)"),ne.add(Ht,"torsoGain",0,1,.05).name("躯干跟随比例"),ne.add(Ht,"volumeExp",0,1.5,.05).name("体积补偿指数");const Lt=h(zt,"武器握持 / 腕部"),xt=t.weaponWrist;Lt.add(xt,"enabled").name("腕部滞后 开（关掉=武器焊在手上）"),Lt.add(xt,"lag",0,.08,.002).name("臂速 → 腕滞后"),Lt.add(xt,"maxAngle",0,1.2,.02).name("腕滞后上限 (rad)"),Lt.add(xt,"rate",4,50,1).name("腕部跟随速率 (1/s)"),Lt.add(xt,"twistLag",0,.06,.002).name("躯干扭转 → 剑横甩"),Lt.add(xt,"maxTwist",0,.9,.02).name("横甩上限 (rad)");const Ft=t.weaponMount;Lt.add(Ft,"twoHandInsetX",0,.3,.01).name("双手武器内收 (m)"),Lt.add(Ft,"twoHandGripY",-.5,0,.01).name("副握点在柄上的位置"),Lt.add(Ft,"twoHandMaxStretch",1,1.8,.01).name("副手臂长拉伸上限"),Lt.add(Ft,"twoHandMinGrip",0,1,.02).name("最低握持权重（1=永不松手）"),Lt.add(Ft,"twoHandGripStart",1,1.4,.01).name("开始松手的臂展比"),Lt.add(Ft,"twoHandSlideRate",0,30,1).name("握点滑柄跟随速率 (1/s)"),Lt.add(Ft,"swordPitchDeg",0,90,1).name("剑前倾角"),Lt.add(Ft,"swordYawDeg",0,45,1).name("剑外张角"),Lt.add(Ft,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),Lt.add(Ft,"staffPitchDeg",0,60,1).name("法杖前倾角");const Bt=c("假人 / 混战"),z=o.dummies,R=h(Bt,"普通假人 AI");R.add(z,"moveSpeed",.5,8,.1).name("移动速度"),R.add(z,"wanderRadius",.5,8,.1).name("游走半径"),R.add(z,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),R.add(z,"followStopDistance",.3,5,.1).name("跟随停距"),R.add(z,"keepDistance",1,10,.1).name("保持距离"),R.add(z,"keepDeadZone",.1,2,.05).name("保持死区"),R.add(z,"attackRange",.5,5,.1).name("攻击距离"),R.add(z,"attackInterval",.3,5,.1).name("攻击间隔 (s)"),R.add(z,"leashRadius",0,8,.1).name("牵引半径 (0=不限)");const j=z.fighters;if(j){const ft=h(Bt,"持械陪练（剑盾 / 双刀 / 大剑）");ft.add(j,"moveSpeed",.5,6,.1).name("移动速度"),ft.add(j,"attackInterval",.5,8,.1).name("攻击间隔 (s)"),ft.add(j,"attackRangeScale",.5,1.2,.02).name("起手距离 / 武器 reach"),ft.add(j,"knockbackScale",0,2,.05).name("击退比例"),ft.add(j,"leashRadius",0,14,.5).name("牵引半径 (m)");const Nt=()=>n.dummies.find(wt=>wt.weapon!==null),rt={get mode(){var wt;return((wt=Nt())==null?void 0:wt.mode)??"spar"},set mode(wt){i.setFighterMode(wt)}};ft.add(rt,"mode",pf).name("陪练行为（全部）")}const dt=c("相机"),tt=h(dt,"基础");tt.add(t.camera,"pitchDeg",20,80,1).name("俯角"),tt.add(t.camera,"yawDeg",-180,180,1).name("方位角"),tt.add(t.camera,"distance",6,35,.5).name("距离"),tt.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),tt.add(t.camera,"fov",25,90,1).name("FOV");const ct=o.camera,It=h(dt,"智能构图");It.add(ct,"radius",2,18,.5).name("威胁评估半径 (m)"),It.add(ct,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),It.add(ct,"saturation",.5,8,.1).name("威胁归一化饱和"),It.add(ct,"pushIn",0,.5,.01).name("无威胁推进比例"),It.add(ct,"maxPullback",0,1,.02).name("最大拉远比例"),It.add(ct,"maxOffset",0,6,.1).name("最大构图平移 (m)"),It.add(ct,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),It.add(ct,"framingBias",0,1,.05).name("威胁质心平移系数"),It.add(ct,"attackBoost",0,2,.05).name("挥砍中额外加权"),It.add(ct.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),It.add(ct.modeWeight,"spar",0,3,.05).name("陪练模式威胁倍率"),It.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const et=h(dt,"缩放");return et.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),et.add(t.zoom,"max",1,4,.05).name("最大拉远上限"),et.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),et.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),et.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),et.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),et.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),et.add({reset:i.resetZoom},"reset").name("缩放归 1"),r.forEach(ft=>ft.close()),l.forEach(ft=>ft.close()),s.close(),{gui:s,refreshWeapon:()=>G.updateDisplay()}}function gx(n,t,e){let i=null,a=Number.POSITIVE_INFINITY;for(const s of n){const o=Math.hypot(t-s.x,e-s.z);o<=s.radius&&o<a&&(i=s,a=o)}return i}function xx(n,t){return n.find(e=>e.id===t)??null}function Ld(n,t,e){if(n.length===0)return null;const i=[...n].sort((r,l)=>r.index-l.index),a=i.findIndex(r=>r.id===t),s=e<0?-1:1,o=a<0?s>0?0:i.length-1:(a+s+i.length)%i.length;return i[o]??null}function vx({stations:n,world:t,view:e,container:i,onResetZoom:a}){const s=i??document.getElementById("lab-panel");let o=null,r=null;const l=new Map,c=document.createElement("div");c.id="lab-toast",c.setAttribute("aria-live","polite"),document.body.appendChild(c);let h=0;function u(g){c.textContent=`${g.index} · ${g.name} — ${g.hint}`,c.style.borderColor=g.color,c.classList.add("is-on"),window.clearTimeout(h),h=window.setTimeout(()=>c.classList.remove("is-on"),5e3)}function d(){return gx(n,t.character.position.x,t.character.position.z)}function f(){const g=d(),p=(g==null?void 0:g.id)??null;if(p===o)return;const y=o!==null;o=p;for(const[x,v]of l)v.classList.toggle("is-active",x===p);r&&(r.textContent=g?`${g.index} · ${g.hint}`:"不在任何工位内：点上面的名字传送，或直接走过去",r.style.color=g?"rgba(206, 226, 244, 0.9)":"rgba(150, 172, 192, 0.62)"),g?u(g):y&&c.classList.remove("is-on")}function m(g){const p=typeof g=="number"?n.find(y=>y.index===g)??null:xx(n,g);return p?(ng(t,p.spawnX,p.spawnZ),t.camera.centroidX=p.spawnX,t.camera.centroidZ=p.spawnZ,e.snapCamera(p.spawnX,t.character.position.y,p.spawnZ),f(),!0):!1}function _(){If(t)}if(s){s.textContent="";const g=document.createElement("div");g.className="lab-head",g.textContent="测试工位";const p=document.createElement("span");p.className="lab-tip",p.textContent="[ / ] 切换",g.appendChild(p),s.appendChild(g);for(const v of[...n].sort((w,S)=>w.index-S.index)){const w=document.createElement("button");w.type="button",w.className="lab-row",w.dataset.station=v.id,w.dataset.uiButton="",w.style.setProperty("--lab-color",v.color),w.setAttribute("aria-label",`传送到工位 ${v.index}：${v.name}`);const S=document.createElement("span");S.className="lab-idx",S.textContent=String(v.index);const A=document.createElement("span");A.className="lab-name",A.textContent=v.name,w.append(S,A),w.addEventListener("pointerdown",T=>{T.preventDefault(),T.stopPropagation(),m(v.id)}),s.appendChild(w),l.set(v.id,w)}r=document.createElement("div"),r.className="lab-hint",s.appendChild(r);const y=document.createElement("div");y.className="lab-foot";const x=document.createElement("button");if(x.type="button",x.className="lab-btn",x.dataset.uiButton="",x.textContent="召回假人",x.setAttribute("aria-label","召回全部假人回到各自工位"),x.addEventListener("pointerdown",v=>{v.preventDefault(),v.stopPropagation(),_()}),y.appendChild(x),a){const v=document.createElement("button");v.type="button",v.className="lab-btn",v.dataset.uiButton="",v.textContent="镜头归位",v.setAttribute("aria-label","把镜头缩放恢复到默认"),v.addEventListener("pointerdown",w=>{w.preventDefault(),w.stopPropagation(),a()}),y.appendChild(v)}s.appendChild(y)}return window.addEventListener("keydown",g=>{var p,y;if(!(g.metaKey||g.ctrlKey||g.altKey))if(g.key==="["){const x=Ld(n,((p=d())==null?void 0:p.id)??o,-1);x&&m(x.id)}else if(g.key==="]"){const x=Ld(n,((y=d())==null?void 0:y.id)??o,1);x&&m(x.id)}else g.key==="\\"&&_()}),f(),{goto:m,current:d,tick:f,recall:_,element:s}}const uc=Math.PI*2,vi={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},yx=45,_x=50;function Mx(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function Fs(n,t,e){const i=Mx(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function bx(n,t){return Math.atan2(n,-t)*180/Math.PI}function Dd(n,t){return Math.abs(((n-t)%360+540)%360-180)}function Ro(n){return(n%360+360)%360}const Sx={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function wx(n,t,e,i=8){const a=n.character,s=t.intents,o=Math.hypot(s.moveX,s.moveZ),r=Math.hypot(t.stickRawX,t.stickRawY),l=a.velocity,c=Math.hypot(l.x,l.z),h=o>.001?Fs(s.moveX,s.moveZ,e):null,u=c>.15?Fs(l.x,l.z,e):null,d=Fs(Math.sin(a.facing),Math.cos(a.facing),e),f=s.aimActive&&Math.hypot(s.aimX,s.aimZ)>1e-6?Fs(s.aimX,s.aimZ,e):null,m=n.targeting,_=m.hasTarget?Fs(Math.sin(m.targetYaw),Math.cos(m.targetYaw),e):null,g=h!==null&&u!==null?Dd(h,u):null,p=h!==null?Dd(h,d):null,y=g!==null&&g>yx&&o>=.35&&c>=.4;return{inDeg:h,inLen:Math.min(1,o),rawDeg:r>.02?bx(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,r),stickHeld:t.stickHeld,moveDeg:u,speed:c,faceDeg:d,lockDeg:_,lockId:m.targetId,lockDist:m.targetDist,aimDeg:f,gapMove:g,gapFace:p,warnMove:y}}function kd(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>_x&&(n.inLen>=.35||n.speed>=.4)}const Id="harness.dirDebug";function Ex(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const a=e.querySelector("#dirdbg-canvas"),s=e.querySelector("#dirdbg-toggle"),o={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},r=a.getContext("2d");let l=!0;if(!t)try{l=window.localStorage.getItem(Id)!=="0"}catch{}function c(){e.classList.toggle("is-off",!l),s&&(s.textContent=l?"方向 ⌄":"方向 ▸",s.setAttribute("aria-expanded",String(l)))}c();function h(x){if(l=x,!t)try{window.localStorage.setItem(Id,x?"1":"0")}catch{}c()}s==null||s.addEventListener("pointerdown",x=>{x.preventDefault(),x.stopPropagation(),h(!l)}),t||window.addEventListener("keydown",x=>{x.key.toLowerCase()==="v"&&!x.metaKey&&!x.ctrlKey&&h(!l)});const u=Math.min(3,Math.max(1,window.devicePixelRatio||1)),d=118;a.width=Math.round(d*u),a.height=Math.round(d*u);let f=Sx,m=0,_="",g=8;function p(x){if(!r)return;const v=d,w=d,S=v/2,A=w/2,T=Math.min(v,w)/2-13;r.setTransform(u,0,0,u,0,0),r.clearRect(0,0,v,w),r.beginPath(),r.arc(S,A,T,0,uc),r.fillStyle="rgba(8, 12, 17, 0.5)",r.fill(),r.lineWidth=1,r.strokeStyle=x.warnMove?"rgba(251, 191, 36, 0.85)":vi.ring,r.stroke(),r.strokeStyle=vi.grid,r.beginPath(),r.moveTo(S-T,A),r.lineTo(S+T,A),r.moveTo(S,A-T),r.lineTo(S,A+T),r.stroke();for(let L=0;L<8;L++){const F=L*Math.PI/4,O=S+Math.sin(F)*(T-3),k=A-Math.cos(F)*(T-3),D=S+Math.sin(F)*T,U=A-Math.cos(F)*T;r.beginPath(),r.moveTo(O,k),r.lineTo(D,U),r.stroke()}const b=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;b>0&&(r.save(),r.setLineDash([2,3]),r.strokeStyle=vi.dead,r.beginPath(),r.arc(S,A,T*b,0,uc),r.stroke(),r.restore());const M=(L,F,O,k,D=!1,U=1)=>{const G=L*Math.PI/180,W=Math.sin(G),ot=-Math.cos(G),gt=T*Math.max(.14,Math.min(1,F)),Mt=S+W*T*.14,kt=A+ot*T*.14,Q=S+W*gt,nt=A+ot*gt;if(r.save(),r.globalAlpha=U,r.strokeStyle=O,r.fillStyle=O,r.lineWidth=k,r.lineCap="round",D&&r.setLineDash([3,3]),r.beginPath(),r.moveTo(Mt,kt),r.lineTo(Q,nt),r.stroke(),!D&&gt>T*.3){const ht=-ot,q=W,J=5.2;r.beginPath(),r.moveTo(Q+W*1.5,nt+ot*1.5),r.lineTo(Q-W*J+ht*J*.72,nt-ot*J+q*J*.72),r.lineTo(Q-W*J-ht*J*.72,nt-ot*J-q*J*.72),r.closePath(),r.fill()}r.restore()},P=(L,F)=>{const O=L*Math.PI/180,k=Math.sin(O),D=-Math.cos(O),U=-D,G=k,W=T+1.5,ot=W+6.5;r.save(),r.fillStyle=F,r.strokeStyle=F,r.lineWidth=1,r.beginPath(),r.moveTo(S+k*ot,A+D*ot),r.lineTo(S+k*W+U*4,A+D*W+G*4),r.lineTo(S+k*W-U*4,A+D*W-G*4),r.closePath(),r.fill(),r.restore()};x.lockDeg!==null&&M(x.lockDeg,1,vi.lock,1,!0,.7),x.rawDeg!==null&&x.stickHeld&&M(x.rawDeg,x.rawLen,vi.raw,1,!0,.9),x.aimDeg!==null&&M(x.aimDeg,1,vi.aim,1.6,!0,.95),M(x.faceDeg,1,vi.face,1.1,!0,.55),x.moveDeg!==null&&M(x.moveDeg,x.speed/Math.max(1,g),vi.move,5.5,!1,.8),x.inDeg!==null&&M(x.inDeg,x.inLen,vi.input,2.2),P(x.faceDeg,vi.face),r.beginPath(),r.arc(S,A,2.2,0,uc),r.fillStyle="rgba(220, 235, 248, 0.85)",r.fill()}function y(x,v){const w=T=>T===null?"-":String(Math.round(Ro(T)));o.in.textContent=`入 ${w(x.inDeg)}`,o.mv.textContent=`移 ${w(x.moveDeg)}`,o.fc.textContent=`面 ${w(x.faceDeg)}`;const S=T=>T===null?"-":`${Math.round(T)}°`,A=[`Δ入→移 ${S(x.gapMove)}`,`Δ入→面 ${S(x.gapFace)}`];x.speed>.05&&A.push(`v${x.speed.toFixed(1)}`),x.lockDeg!==null&&A.push(`锁#${x.lockId} ${x.lockDist.toFixed(1)}m`),x.aimDeg!==null&&A.push("拖拽瞄准"),o.gap.textContent=A.join("  "),e.classList.toggle("is-warn",x.warnMove||kd(x,v))}return{update(x,v,w){if(!l)return;g=Math.max(1,x.config.moveSpeed*Math.max(1,x.config.sprintMultiplier));const S=wx(x,v,w,g);f=S;const A=x.combat.phase!=="idle";p(S);const T=performance.now(),b=`${S.inDeg}|${S.moveDeg}|${S.faceDeg}|${S.lockId}|${S.aimDeg}|${S.warnMove}|${S.speed.toFixed(1)}`;(T-m>90||b!==_)&&(m=T,_=b,y(S,A),e.dataset.in=S.inDeg===null?"":Ro(S.inDeg).toFixed(1),e.dataset.mv=S.moveDeg===null?"":Ro(S.moveDeg).toFixed(1),e.dataset.fc=Ro(S.faceDeg).toFixed(1),e.dataset.warn=S.warnMove||kd(S,A)?"1":"0")},setEnabled:h,toggle(){return h(!l),l},enabled:()=>l,last:()=>f}}const Tx=6,Ax=480,zd=240,Fd=92,Rx=18;function Px(n,t,e,i){const a=t-n;return{t:i,speed:t,drive:t,raw:t,dv:a,accel:e>1e-4?a/e:0,busy:!1}}function Cx(n,t,e,i){const s=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:s,speed:Math.min(s,Math.max(1,i))}}function Lx(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function Dx(n={}){const t=Math.max(1,n.windowS??Tx),e=Math.max(60,n.capacity??Ax),i=Math.max(1,n.speedCap??Rx),a=!!(n.container&&n.toggle),s=n.container??document.createElement("div");s.id="motiondbg",n.container||(s.setAttribute("data-ui-region",""),document.body.appendChild(s));const o=['<div id="motiondbg-head"><span>速度(位移) / Δv</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="92"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");s.innerHTML=a?`<div id="motiondbg-body">${o}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${o}</div>`].join("");const r=n.toggle??s.querySelector("#motiondbg-toggle"),l=s.querySelector("#motiondbg-graph"),c=s.querySelector("#motiondbg-read"),h=s.querySelector("#motiondbg-window"),u=s.querySelector("#motiondbg-dir");h.textContent=`${t.toFixed(1)}s`;const d=l.getContext("2d"),f=Math.min(3,Math.max(1,window.devicePixelRatio||1));l.width=Math.round(zd*f),l.height=Math.round(Fd*f);const m=Ex({deadZone:n.deadZone,container:u,embedded:!0});let _=!1;function g(T){_=T,s.classList.toggle("is-off",!T),!a&&r&&(r.textContent=T?"手感 ⌄":"手感 ▸",r.setAttribute("aria-expanded",String(T)),r.setAttribute("aria-label",T?"收起手感调试面板":"展开手感调试面板"))}g(!1),a||(r==null||r.addEventListener("pointerdown",T=>{T.preventDefault(),T.stopPropagation(),g(!_)}),window.addEventListener("keydown",T=>{T.key.toLowerCase()==="v"&&!T.metaKey&&!T.ctrlKey&&g(!_)}));const p=[];let y=0,x=null,v=-1,w={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1};function S(T){const b=T-t;let M=0;for(;M<p.length&&p[M].t<b;)M++;return p.slice(M)}function A(T,b){if(!d)return;const M=zd,P=Fd;d.setTransform(f,0,0,f,0,0),d.clearRect(0,0,M,P),d.fillStyle="rgba(8, 12, 17, 0.55)",d.fillRect(0,0,M,P);const L=4,F=4,O=M-L-F,k=9,D=46,U=62,G=22,W=b-t,ot=q=>L+Math.max(0,Math.min(1,(q-W)/t))*O;for(let q=0;q<T.length;q++){if(!T[q].busy)continue;const J=ot(T[q].t),Z=q+1<T.length?ot(T[q+1].t):J+2;d.fillStyle="rgba(251, 146, 60, 0.13)",d.fillRect(J,k,Math.max(2,Z-J),D)}d.strokeStyle="rgba(150, 190, 220, 0.14)",d.lineWidth=1,d.beginPath();for(const q of[k,k+D/2,k+D])d.moveTo(L,q),d.lineTo(M-F,q);d.moveTo(L,U+G/2),d.lineTo(M-F,U+G/2),d.stroke();const Mt=Math.max(1,...T.map(q=>q.speed),...T.map(q=>q.drive))*1.15,kt=q=>k+D-q/Mt*D;if(T.length>1){d.beginPath(),d.moveTo(ot(T[0].t),kt(T[0].speed));for(let q=1;q<T.length;q++)d.lineTo(ot(T[q].t),kt(T[q].speed));d.strokeStyle="#38bdf8",d.lineWidth=1.8,d.lineJoin="round",d.stroke(),d.lineTo(ot(T[T.length-1].t),k+D),d.lineTo(ot(T[0].t),k+D),d.closePath(),d.fillStyle="rgba(56, 189, 248, 0.14)",d.fill(),d.beginPath(),d.moveTo(ot(T[0].t),kt(T[0].drive));for(let q=1;q<T.length;q++)d.lineTo(ot(T[q].t),kt(T[q].drive));d.setLineDash([3,3]),d.strokeStyle="rgba(190, 205, 220, 0.6)",d.lineWidth=1.2,d.stroke(),d.setLineDash([])}let Q=.02;for(const q of T)Q=Math.max(Q,Math.abs(q.dv));Q*=1.1;const nt=U+G/2,ht=G/2;for(const q of T){const J=Math.min(ht,Math.abs(q.dv)/Q*ht);d.fillStyle=q.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",d.fillRect(ot(q.t)-.7,q.dv>=0?nt-J:nt,1.4,Math.max(.5,J))}d.font="9px ui-monospace, monospace",d.fillStyle="rgba(190, 214, 234, 0.55)",d.textAlign="left",d.fillText(Mt.toFixed(1),L+2,k+8),d.fillText("v",L+2,k+D-2),d.fillText("Δv",L+2,U+9),d.textAlign="right",d.fillText("0",M-F-2,k+D-2),d.textAlign="left"}return{dirDebug:m,update(T,b,M){const P=performance.now()/1e3,L=v<0?1/60:Math.max(1e-4,Math.min(.25,P-v));v=P;const F=T.character,O={x:F.position.x,z:F.position.z},k=Math.hypot(F.velocity.x,F.velocity.z),{speed:D,raw:U}=x?Cx(x,O,L,i):{speed:0,raw:0},G=Px(y,D,L,P);G.drive=k,G.raw=U,G.busy=Lx(T),x=O,y=D,p.push(G),p.length>e&&p.shift();const W=S(P);let ot=0;for(const gt of W)ot=Math.max(ot,gt.speed);if(w={speed:D,drive:k,raw:U,dv:G.dv,accel:G.accel,peak:ot,samples:W.length,windowS:t,busy:G.busy},m.update(T,b,M),_){A(W,P);const gt=G.dv>=0?"+":"";c.textContent=`v ${D.toFixed(2)} · 驱 ${k.toFixed(2)} · 峰 ${ot.toFixed(2)} · Δv ${gt}${G.dv.toFixed(3)} · ${W.length} 帧`}},setEnabled:g,toggle(){return g(!_),_},enabled:()=>_,last:()=>({...w}),samples:()=>S(performance.now()/1e3).map(T=>({...T}))}}const kx=["剑盾","双剑","大剑","法杖","弓"],Ix={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击",spar:"陪练"};function zx(n){return{update(t,e,i,a,s,o,r=!1){const l=t.character,c=l.position,h=l.velocity,u=t.combat,d=t.events.length>0?t.events[t.events.length-1]:null,f=Dt=>Dt.toFixed(2),m=Dt=>(Dt*180/Math.PI).toFixed(0),_=kx[ra.indexOf(u.weapon)]??u.weapon,g=Math.round(u.charge*10),p="|".repeat(g)+".".repeat(10-g),y=t.dash,x=y.phase==="active"&&y.duration>0?(1-y.timer/y.duration)*100:0,v=y.phase==="active"?`${y.kind}@${x.toFixed(0)}%`:`${y.kind} cd${f(y.cooldown)}`,w=a.intents.aimActive?`(${f(a.intents.aimX)},${f(a.intents.aimZ)})`:"-",S=h.x*Math.sin(l.bodyYaw)+h.z*Math.cos(l.bodyYaw),A=h.x*Math.cos(l.bodyYaw)-h.z*Math.sin(l.bodyYaw),T=Math.abs(S)+Math.abs(A)+1e-6,b=Math.round(Math.abs(A)/T*100),M=`strafe ${b}%${S<-.05?" back":""}`,P=t.camera,L=`threat ${(P.threat*100).toFixed(0)}%  dist×${f(P.distanceScale)}  off (${f(P.offsetX)},${f(P.offsetZ)})  pitch +${f(P.pitchDelta)}°  n=${P.threatCount}`,F=o?f(o.attackBlend):"-",O=o==null?void 0:o.attackWeights,k=O?`gw ${f(O.gaitScale)}  lw ${f(O.attackLegWeight)}  spd ${f(O.driveSpeed)}`:"-",D=O?`${f(O.gaitScale)}/${f(O.attackLegWeight)}`:"-",U=o?`${o.landing.kind} ${f(o.landing.pulse)} t${f(o.landing.remaining)} vy${f(o.landing.impactVy)}`:"-",G=o?`${o.landing.kind}/${f(o.landing.pulse)}`:"-",W=(o==null?void 0:o.zoom)!==void 0?`zoom ×${f(o.zoom)}`:"-",ot=o==null?void 0:o.hurt,gt=ot?`hurt ${t.playerHurt.type}  部位h${f(ot.hitHeight)}  脉冲p${f(ot.pulse)}  上身${f(ot.upperShift)}  重心${f(ot.comShift)}  后坐${f(ot.pelvisBack)}  屈膝${f(ot.knee)}`:"-",Mt=ot?`${f(ot.hitHeight)}/${f(ot.pulse)}/${f(ot.knee)}`:"-",kt=o==null?void 0:o.ik,Q=kt?`${kt.active?"on":"off"} w${f(kt.weight)} e${f(kt.maxError)}`:"-",nt=t.playerLink,ht=`link ${nt.kind||"-"}  ${nt.phase}  prog ${f(nt.progress)}  win ${f(nt.linkWindow)}s  cd ${f(nt.cooldown)}s  hits ${nt.hitIds.length}  travel ${f(nt.travelled)}/${f(nt.travel)}m  id ${nt.id}`,q=`${nt.phase}/${nt.kind||"-"}/w${f(nt.linkWindow)}`,J=a.lastGesture,Z=J?`${J.button} ${J.kind} ${J.heldMs.toFixed(0)}ms d${J.distance.toFixed(0)}px ${J.angleDeg.toFixed(0)}° taps${J.taps}`:"-",bt=t.dummies.map(Dt=>`${Dt.id}:${Ix[Dt.mode]}`).join("  ");if(r){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${_} ${u.phase} · lk ${nt.phase}${nt.kind?`/${nt.kind}`:""} w${f(nt.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${f(c.x)},${f(c.y)},${f(c.z)})  vel (${f(h.x)},${f(h.y)},${f(h.z)})`,`face ${m(l.facing)}  body ${m(l.bodyYaw)}  head ${m(l.headYaw)}  move ${m(l.moveYaw)}  st${b}%  stick(${f(a.stickX)},${f(a.stickY)}) ${a.source}  str${f(l.stride)}`,`weapon ${_}  ${u.phase}  combo ${u.comboIndex}/3  atk ${f(u.attackProgress)}  dash ${v}  ab ${F}  gw/lw ${D}  land ${G}  ik ${Q}`,`aim ${w}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${f(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${Mt}`,`dummies ${bt}  atkCount ${t.dummyAttackCount}  cam ${(P.threat*100).toFixed(0)}% ×${f(P.distanceScale)}  ${W}  lk ${q}`,`event ${d?`${d.type} ${f(d.value)}`:"-"}  scale ${f(s.timeScale)}${s.paused?" [P]":""}  g ${Z}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${f(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${f(c.x)}, ${f(c.y)}, ${f(c.z)})`,`vel  (${f(h.x)}, ${f(h.y)}, ${f(h.z)})`,`grounded ${l.grounded?"Y":"N"}   sprint ${l.sprinting?"Y":"N"}   facing ${m(l.facing)}deg   atkBlend ${F}   ${k}   land ${U}`,gt,`ik ${Q}  clamped ${kt?kt.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${m(l.facing)}  body ${m(l.bodyYaw)}  head ${m(l.headYaw)}  move ${m(l.moveYaw)}  (head-body ${m(l.headYaw-l.bodyYaw)})  ${M}`,`move (${f(a.intents.moveX)}, ${f(a.intents.moveZ)})  stick (${f(a.stickX)}, ${f(a.stickY)})  ${a.source}  aim ${w}`,`weapon ${_}  phase ${u.phase}  combo ${u.comboIndex}/3  atk ${f(u.attackProgress)}${u.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${y.kind}  phase ${y.phase}  prog ${x.toFixed(0)}%  cd ${f(y.cooldown)}s  id ${y.id}  from (${f(y.fromX)},${f(y.fromZ)}) → to (${f(y.toX)},${f(y.toZ)})`,ht,`camera ${L}  ${W}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${f(t.targeting.targetDist)}m  face ${m(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${p}] ${(u.charge*100).toFixed(0)}%  charging ${u.charging?"Y":"N"}`,`dummies ${bt}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${f(t.impulse.x)}, ${f(t.impulse.z)})`,`event ${d?`${d.type} ${f(d.value)}`:"-"}   scale ${f(s.timeScale)}${s.paused?" [PAUSED]":""}   gesture ${Z}`].join(`
`)}}}const Po=["lab","hud","motion","debug"],Ud={lab:{short:"工位",full:"测试工位"},hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}},Nd={lab:{toggle:"lab-toggle",panel:"lab-panel"},hud:{toggle:"hud-toggle",panel:"hud"},motion:{toggle:"motiondbg-toggle",panel:"motiondbg"},debug:{toggle:"debug-toggle",panel:"debug-panel"}};function Fx(n){var l;const t=Object.fromEntries(Po.map(c=>[c,document.getElementById(Nd[c].toggle)])),e=Object.fromEntries(Po.map(c=>[c,document.getElementById(Nd[c].panel)]));let i={},a=null;function s(){var c,h,u;for(const d of Po){const f=a===d,m=t[d],_=e[d];m&&(m.setAttribute("aria-expanded",String(f)),m.textContent=`${Ud[d].short} ${f?"▾":"▸"}`,m.setAttribute("aria-label",`${f?"收起":"展开"}${Ud[d].full}`)),_&&_.classList.toggle("is-open",f)}n.classList.toggle("is-compact",a!=="hud"),(c=i.motion)==null||c.setEnabled(a==="motion"),a==="debug"?(h=i.debug)==null||h.open():(u=i.debug)==null||u.close()}function o(c){a=a===c?null:c,s()}function r(){a!==null&&(a=null,s())}for(const c of Po)(l=t[c])==null||l.addEventListener("pointerdown",h=>{h.preventDefault(),h.stopPropagation(),o(c)});return window.addEventListener("keydown",c=>{c.key.toLowerCase()==="v"&&!c.metaKey&&!c.ctrlKey&&o("motion")}),s(),{hudCompact:()=>a!=="hud",register(c){i=c,s()},toggle:o,closeAll:r,isOpen:c=>a===c}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const fh="170",Ux=0,Od=1,Nx=2,Gf=1,Vf=2,Fi=3,ca=0,Bn=1,Oe=2,sa=0,ps=1,Ui=2,Bd=3,Hd=4,Ox=5,Ea=100,Bx=101,Hx=102,Gx=103,Vx=104,Xx=200,Wx=201,Yx=202,$x=203,ll=204,hl=205,Zx=206,jx=207,qx=208,Kx=209,Jx=210,Qx=211,tv=212,ev=213,nv=214,dl=0,ul=1,fl=2,Ms=3,pl=4,ml=5,gl=6,xl=7,ph=0,iv=1,av=2,oa=0,sv=1,ov=2,rv=3,cv=4,lv=5,hv=6,dv=7,Xf=300,bs=301,Ss=302,vl=303,yl=304,Nr=306,_l=1e3,Aa=1001,Ml=1002,di=1003,uv=1004,Co=1005,Mi=1006,fc=1007,Ra=1008,Gi=1009,Wf=1010,Yf=1011,oo=1012,mh=1013,Ca=1014,Oi=1015,mo=1016,gh=1017,xh=1018,ws=1020,$f=35902,Zf=1021,jf=1022,hi=1023,qf=1024,Kf=1025,ms=1026,Es=1027,Jf=1028,vh=1029,Qf=1030,yh=1031,_h=1033,hr=33776,dr=33777,ur=33778,fr=33779,bl=35840,Sl=35841,wl=35842,El=35843,Tl=36196,Al=37492,Rl=37496,Pl=37808,Cl=37809,Ll=37810,Dl=37811,kl=37812,Il=37813,zl=37814,Fl=37815,Ul=37816,Nl=37817,Ol=37818,Bl=37819,Hl=37820,Gl=37821,pr=36492,Vl=36494,Xl=36495,tp=36283,Wl=36284,Yl=36285,$l=36286,fv=3200,pv=3201,ep=0,mv=1,ea="",In="srgb",As="srgb-linear",Or="linear",Le="srgb",Wa=7680,Gd=519,gv=512,xv=513,vv=514,np=515,yv=516,_v=517,Mv=518,bv=519,Zl=35044,Vd=35048,Xd="300 es",Bi=2e3,Ar=2001;class Rs{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const a=this._listeners[t];if(a!==void 0){const s=a.indexOf(e);s!==-1&&a.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const a=i.slice(0);for(let s=0,o=a.length;s<o;s++)a[s].call(this,t);t.target=null}}}const Mn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Wd=1234567;const gs=Math.PI/180,ro=180/Math.PI;function Si(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Mn[n&255]+Mn[n>>8&255]+Mn[n>>16&255]+Mn[n>>24&255]+"-"+Mn[t&255]+Mn[t>>8&255]+"-"+Mn[t>>16&15|64]+Mn[t>>24&255]+"-"+Mn[e&63|128]+Mn[e>>8&255]+"-"+Mn[e>>16&255]+Mn[e>>24&255]+Mn[i&255]+Mn[i>>8&255]+Mn[i>>16&255]+Mn[i>>24&255]).toLowerCase()}function xn(n,t,e){return Math.max(t,Math.min(e,n))}function Mh(n,t){return(n%t+t)%t}function Sv(n,t,e,i,a){return i+(n-t)*(a-i)/(e-t)}function wv(n,t,e){return n!==t?(e-n)/(t-n):0}function Ks(n,t,e){return(1-e)*n+e*t}function Ev(n,t,e,i){return Ks(n,t,1-Math.exp(-e*i))}function Tv(n,t=1){return t-Math.abs(Mh(n,t*2)-t)}function Av(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function Rv(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function Pv(n,t){return n+Math.floor(Math.random()*(t-n+1))}function Cv(n,t){return n+Math.random()*(t-n)}function Lv(n){return n*(.5-Math.random())}function Dv(n){n!==void 0&&(Wd=n);let t=Wd+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function kv(n){return n*gs}function Iv(n){return n*ro}function zv(n){return(n&n-1)===0&&n!==0}function Fv(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Uv(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Nv(n,t,e,i,a){const s=Math.cos,o=Math.sin,r=s(e/2),l=o(e/2),c=s((t+i)/2),h=o((t+i)/2),u=s((t-i)/2),d=o((t-i)/2),f=s((i-t)/2),m=o((i-t)/2);switch(a){case"XYX":n.set(r*h,l*u,l*d,r*c);break;case"YZY":n.set(l*d,r*h,l*u,r*c);break;case"ZXZ":n.set(l*u,l*d,r*h,r*c);break;case"XZX":n.set(r*h,l*m,l*f,r*c);break;case"YXY":n.set(l*f,r*h,l*m,r*c);break;case"ZYZ":n.set(l*m,l*f,r*h,r*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+a)}}function li(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Re(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Yd={DEG2RAD:gs,RAD2DEG:ro,generateUUID:Si,clamp:xn,euclideanModulo:Mh,mapLinear:Sv,inverseLerp:wv,lerp:Ks,damp:Ev,pingpong:Tv,smoothstep:Av,smootherstep:Rv,randInt:Pv,randFloat:Cv,randFloatSpread:Lv,seededRandom:Dv,degToRad:kv,radToDeg:Iv,isPowerOfTwo:zv,ceilPowerOfTwo:Fv,floorPowerOfTwo:Uv,setQuaternionFromProperEuler:Nv,normalize:Re,denormalize:li};class Wt{constructor(t=0,e=0){Wt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6],this.y=a[1]*e+a[4]*i+a[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(xn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),a=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*i-o*a+t.x,this.y=s*a+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class de{constructor(t,e,i,a,s,o,r,l,c){de.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,l,c)}set(t,e,i,a,s,o,r,l,c){const h=this.elements;return h[0]=t,h[1]=a,h[2]=r,h[3]=e,h[4]=s,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[3],l=i[6],c=i[1],h=i[4],u=i[7],d=i[2],f=i[5],m=i[8],_=a[0],g=a[3],p=a[6],y=a[1],x=a[4],v=a[7],w=a[2],S=a[5],A=a[8];return s[0]=o*_+r*y+l*w,s[3]=o*g+r*x+l*S,s[6]=o*p+r*v+l*A,s[1]=c*_+h*y+u*w,s[4]=c*g+h*x+u*S,s[7]=c*p+h*v+u*A,s[2]=d*_+f*y+m*w,s[5]=d*g+f*x+m*S,s[8]=d*p+f*v+m*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*r*c-i*s*h+i*r*l+a*s*c-a*o*l}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],u=h*o-r*c,d=r*l-h*s,f=c*s-o*l,m=e*u+i*d+a*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/m;return t[0]=u*_,t[1]=(a*c-h*i)*_,t[2]=(r*i-a*o)*_,t[3]=d*_,t[4]=(h*e-a*l)*_,t[5]=(a*s-r*e)*_,t[6]=f*_,t[7]=(i*l-c*e)*_,t[8]=(o*e-i*s)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,a,s,o,r){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*r)+o+t,-a*c,a*l,-a*(-c*o+l*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(pc.makeScale(t,e)),this}rotate(t){return this.premultiply(pc.makeRotation(-t)),this}translate(t,e){return this.premultiply(pc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<9;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const pc=new de;function ip(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Rr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Ov(){const n=Rr("canvas");return n.style.display="block",n}const $d={};function Ws(n){n in $d||($d[n]=!0,console.warn(n))}function Bv(n,t,e){return new Promise(function(i,a){function s(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:a();break;case n.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}function Hv(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Gv(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Me={enabled:!0,workingColorSpace:As,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===Le&&(n.r=Hi(n.r),n.g=Hi(n.g),n.b=Hi(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===Le&&(n.r=xs(n.r),n.g=xs(n.g),n.b=xs(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===ea?Or:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function Hi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function xs(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const Zd=[.64,.33,.3,.6,.15,.06],jd=[.2126,.7152,.0722],qd=[.3127,.329],Kd=new de().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Jd=new de().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Me.define({[As]:{primaries:Zd,whitePoint:qd,transfer:Or,toXYZ:Kd,fromXYZ:Jd,luminanceCoefficients:jd,workingColorSpaceConfig:{unpackColorSpace:In},outputColorSpaceConfig:{drawingBufferColorSpace:In}},[In]:{primaries:Zd,whitePoint:qd,transfer:Le,toXYZ:Kd,fromXYZ:Jd,luminanceCoefficients:jd,outputColorSpaceConfig:{drawingBufferColorSpace:In}}});let Ya;class Vv{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Ya===void 0&&(Ya=Rr("canvas")),Ya.width=t.width,Ya.height=t.height;const i=Ya.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=Ya}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Rr("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const a=i.getImageData(0,0,t.width,t.height),s=a.data;for(let o=0;o<s.length;o++)s[o]=Hi(s[o]/255)*255;return i.putImageData(a,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Hi(e[i]/255)*255):e[i]=Hi(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Xv=0;class ap{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Xv++}),this.uuid=Si(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},a=this.data;if(a!==null){let s;if(Array.isArray(a)){s=[];for(let o=0,r=a.length;o<r;o++)a[o].isDataTexture?s.push(mc(a[o].image)):s.push(mc(a[o]))}else s=mc(a);i.url=s}return e||(t.images[this.uuid]=i),i}}function mc(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Vv.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Wv=0;class zn extends Rs{constructor(t=zn.DEFAULT_IMAGE,e=zn.DEFAULT_MAPPING,i=Aa,a=Aa,s=Mi,o=Ra,r=hi,l=Gi,c=zn.DEFAULT_ANISOTROPY,h=ea){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Wv++}),this.uuid=Si(),this.name="",this.source=new ap(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=r,this.internalFormat=null,this.type=l,this.offset=new Wt(0,0),this.repeat=new Wt(1,1),this.center=new Wt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new de,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Xf)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case _l:t.x=t.x-Math.floor(t.x);break;case Aa:t.x=t.x<0?0:1;break;case Ml:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case _l:t.y=t.y-Math.floor(t.y);break;case Aa:t.y=t.y<0?0:1;break;case Ml:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}zn.DEFAULT_IMAGE=null;zn.DEFAULT_MAPPING=Xf;zn.DEFAULT_ANISOTROPY=1;class qe{constructor(t=0,e=0,i=0,a=1){qe.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=a}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,a){return this.x=t,this.y=e,this.z=i,this.w=a,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*a+o[12]*s,this.y=o[1]*e+o[5]*i+o[9]*a+o[13]*s,this.z=o[2]*e+o[6]*i+o[10]*a+o[14]*s,this.w=o[3]*e+o[7]*i+o[11]*a+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,a,s;const l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],m=l[9],_=l[2],g=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(m+g)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(c+1)/2,v=(f+1)/2,w=(p+1)/2,S=(h+d)/4,A=(u+_)/4,T=(m+g)/4;return x>v&&x>w?x<.01?(i=0,a=.707106781,s=.707106781):(i=Math.sqrt(x),a=S/i,s=A/i):v>w?v<.01?(i=.707106781,a=0,s=.707106781):(a=Math.sqrt(v),i=S/a,s=T/a):w<.01?(i=.707106781,a=.707106781,s=0):(s=Math.sqrt(w),i=A/s,a=T/s),this.set(i,a,s,e),this}let y=Math.sqrt((g-m)*(g-m)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(y)<.001&&(y=1),this.x=(g-m)/y,this.y=(u-_)/y,this.z=(d-h)/y,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Yv extends Rs{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new qe(0,0,t,e),this.scissorTest=!1,this.viewport=new qe(0,0,t,e);const a={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Mi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new zn(a,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let r=0;r<o;r++)this.textures[r]=s.clone(),this.textures[r].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let a=0,s=this.textures.length;a<s;a++)this.textures[a].image.width=t,this.textures[a].image.height=e,this.textures[a].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,a=t.textures.length;i<a;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new ap(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class La extends Yv{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class sp extends zn{constructor(t=null,e=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=di,this.minFilter=di,this.wrapR=Aa,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class $v extends zn{constructor(t=null,e=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=di,this.minFilter=di,this.wrapR=Aa,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class go{constructor(t=0,e=0,i=0,a=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=a}static slerpFlat(t,e,i,a,s,o,r){let l=i[a+0],c=i[a+1],h=i[a+2],u=i[a+3];const d=s[o+0],f=s[o+1],m=s[o+2],_=s[o+3];if(r===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(r===1){t[e+0]=d,t[e+1]=f,t[e+2]=m,t[e+3]=_;return}if(u!==_||l!==d||c!==f||h!==m){let g=1-r;const p=l*d+c*f+h*m+u*_,y=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const w=Math.sqrt(x),S=Math.atan2(w,p*y);g=Math.sin(g*S)/w,r=Math.sin(r*S)/w}const v=r*y;if(l=l*g+d*v,c=c*g+f*v,h=h*g+m*v,u=u*g+_*v,g===1-r){const w=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=w,c*=w,h*=w,u*=w}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,a,s,o){const r=i[a],l=i[a+1],c=i[a+2],h=i[a+3],u=s[o],d=s[o+1],f=s[o+2],m=s[o+3];return t[e]=r*m+h*u+l*f-c*d,t[e+1]=l*m+h*d+c*u-r*f,t[e+2]=c*m+h*f+r*d-l*u,t[e+3]=h*m-r*u-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,a){return this._x=t,this._y=e,this._z=i,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,a=t._y,s=t._z,o=t._order,r=Math.cos,l=Math.sin,c=r(i/2),h=r(a/2),u=r(s/2),d=l(i/2),f=l(a/2),m=l(s/2);switch(o){case"XYZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"YXZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"ZXY":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"ZYX":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"YZX":this._x=d*h*u+c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u-d*f*m;break;case"XZY":this._x=d*h*u-c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u+d*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,a=Math.sin(i);return this._x=t.x*a,this._y=t.y*a,this._z=t.z*a,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],a=e[4],s=e[8],o=e[1],r=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=i+r+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(s-c)*f,this._z=(o-a)*f}else if(i>r&&i>u){const f=2*Math.sqrt(1+i-r-u);this._w=(h-l)/f,this._x=.25*f,this._y=(a+o)/f,this._z=(s+c)/f}else if(r>u){const f=2*Math.sqrt(1+r-i-u);this._w=(s-c)/f,this._x=(a+o)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-i-r);this._w=(o-a)/f,this._x=(s+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(xn(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const a=Math.min(1,e/i);return this.slerp(t,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,a=t._y,s=t._z,o=t._w,r=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+o*r+a*c-s*l,this._y=a*h+o*l+s*r-i*c,this._z=s*h+o*c+i*l-a*r,this._w=o*h-i*r-a*l-s*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,a=this._y,s=this._z,o=this._w;let r=o*t._w+i*t._x+a*t._y+s*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=o,this._x=i,this._y=a,this._z=s,this;const l=1-r*r;if(l<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*i+e*this._x,this._y=f*a+e*this._y,this._z=f*s+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,r),u=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*u+this._w*d,this._x=i*u+this._x*d,this._y=a*u+this._y*d,this._z=s*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),a=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(a*Math.sin(t),a*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class H{constructor(t=0,e=0,i=0){H.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Qd.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Qd.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*a,this.y=s[1]*e+s[4]*i+s[7]*a,this.z=s[2]*e+s[5]*i+s[8]*a,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=t.elements,o=1/(s[3]*e+s[7]*i+s[11]*a+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*a+s[12])*o,this.y=(s[1]*e+s[5]*i+s[9]*a+s[13])*o,this.z=(s[2]*e+s[6]*i+s[10]*a+s[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,a=this.z,s=t.x,o=t.y,r=t.z,l=t.w,c=2*(o*a-r*i),h=2*(r*e-s*a),u=2*(s*i-o*e);return this.x=e+l*c+o*u-r*h,this.y=i+l*h+r*c-s*u,this.z=a+l*u+s*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*a,this.y=s[1]*e+s[5]*i+s[9]*a,this.z=s[2]*e+s[6]*i+s[10]*a,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,a=t.y,s=t.z,o=e.x,r=e.y,l=e.z;return this.x=a*l-s*r,this.y=s*o-i*l,this.z=i*r-a*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return gc.copy(this).projectOnVector(t),this.sub(gc)}reflect(t){return this.sub(gc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(xn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,a=this.z-t.z;return e*e+i*i+a*a}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const a=Math.sin(e)*t;return this.x=a*Math.sin(i),this.y=Math.cos(e)*t,this.z=a*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),a=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=a,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const gc=new H,Qd=new go;class xo{constructor(t=new H(1/0,1/0,1/0),e=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(oi.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(oi.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=oi.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,r=s.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,oi):oi.fromBufferAttribute(s,o),oi.applyMatrix4(t.matrixWorld),this.expandByPoint(oi);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Lo.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Lo.copy(i.boundingBox)),Lo.applyMatrix4(t.matrixWorld),this.union(Lo)}const a=t.children;for(let s=0,o=a.length;s<o;s++)this.expandByObject(a[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,oi),oi.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Us),Do.subVectors(this.max,Us),$a.subVectors(t.a,Us),Za.subVectors(t.b,Us),ja.subVectors(t.c,Us),ji.subVectors(Za,$a),qi.subVectors(ja,Za),fa.subVectors($a,ja);let e=[0,-ji.z,ji.y,0,-qi.z,qi.y,0,-fa.z,fa.y,ji.z,0,-ji.x,qi.z,0,-qi.x,fa.z,0,-fa.x,-ji.y,ji.x,0,-qi.y,qi.x,0,-fa.y,fa.x,0];return!xc(e,$a,Za,ja,Do)||(e=[1,0,0,0,1,0,0,0,1],!xc(e,$a,Za,ja,Do))?!1:(ko.crossVectors(ji,qi),e=[ko.x,ko.y,ko.z],xc(e,$a,Za,ja,Do))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,oi).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(oi).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ci[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ci[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ci[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ci[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ci[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ci[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ci[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ci[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ci),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Ci=[new H,new H,new H,new H,new H,new H,new H,new H],oi=new H,Lo=new xo,$a=new H,Za=new H,ja=new H,ji=new H,qi=new H,fa=new H,Us=new H,Do=new H,ko=new H,pa=new H;function xc(n,t,e,i,a){for(let s=0,o=n.length-3;s<=o;s+=3){pa.fromArray(n,s);const r=a.x*Math.abs(pa.x)+a.y*Math.abs(pa.y)+a.z*Math.abs(pa.z),l=t.dot(pa),c=e.dot(pa),h=i.dot(pa);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>r)return!1}return!0}const Zv=new xo,Ns=new H,vc=new H;class Br{constructor(t=new H,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):Zv.setFromPoints(t).getCenter(i);let a=0;for(let s=0,o=t.length;s<o;s++)a=Math.max(a,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(a),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ns.subVectors(t,this.center);const e=Ns.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),a=(i-this.radius)*.5;this.center.addScaledVector(Ns,a/i),this.radius+=a}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(vc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ns.copy(t.center).add(vc)),this.expandByPoint(Ns.copy(t.center).sub(vc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Li=new H,yc=new H,Io=new H,Ki=new H,_c=new H,zo=new H,Mc=new H;class bh{constructor(t=new H,e=new H(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Li)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Li.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Li.copy(this.origin).addScaledVector(this.direction,e),Li.distanceToSquared(t))}distanceSqToSegment(t,e,i,a){yc.copy(t).add(e).multiplyScalar(.5),Io.copy(e).sub(t).normalize(),Ki.copy(this.origin).sub(yc);const s=t.distanceTo(e)*.5,o=-this.direction.dot(Io),r=Ki.dot(this.direction),l=-Ki.dot(Io),c=Ki.lengthSq(),h=Math.abs(1-o*o);let u,d,f,m;if(h>0)if(u=o*l-r,d=o*r-l,m=s*h,u>=0)if(d>=-m)if(d<=m){const _=1/h;u*=_,d*=_,f=u*(u+o*d+2*r)+d*(o*u+d+2*l)+c}else d=s,u=Math.max(0,-(o*d+r)),f=-u*u+d*(d+2*l)+c;else d=-s,u=Math.max(0,-(o*d+r)),f=-u*u+d*(d+2*l)+c;else d<=-m?(u=Math.max(0,-(-o*s+r)),d=u>0?-s:Math.min(Math.max(-s,-l),s),f=-u*u+d*(d+2*l)+c):d<=m?(u=0,d=Math.min(Math.max(-s,-l),s),f=d*(d+2*l)+c):(u=Math.max(0,-(o*s+r)),d=u>0?s:Math.min(Math.max(-s,-l),s),f=-u*u+d*(d+2*l)+c);else d=o>0?-s:s,u=Math.max(0,-(o*d+r)),f=-u*u+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),a&&a.copy(yc).addScaledVector(Io,d),f}intersectSphere(t,e){Li.subVectors(t.center,this.origin);const i=Li.dot(this.direction),a=Li.dot(Li)-i*i,s=t.radius*t.radius;if(a>s)return null;const o=Math.sqrt(s-a),r=i-o,l=i+o;return l<0?null:r<0?this.at(l,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,a,s,o,r,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(i=(t.min.x-d.x)*c,a=(t.max.x-d.x)*c):(i=(t.max.x-d.x)*c,a=(t.min.x-d.x)*c),h>=0?(s=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(s=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),i>o||s>a||((s>i||isNaN(i))&&(i=s),(o<a||isNaN(a))&&(a=o),u>=0?(r=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(r=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),i>l||r>a)||((r>i||i!==i)&&(i=r),(l<a||a!==a)&&(a=l),a<0)?null:this.at(i>=0?i:a,e)}intersectsBox(t){return this.intersectBox(t,Li)!==null}intersectTriangle(t,e,i,a,s){_c.subVectors(e,t),zo.subVectors(i,t),Mc.crossVectors(_c,zo);let o=this.direction.dot(Mc),r;if(o>0){if(a)return null;r=1}else if(o<0)r=-1,o=-o;else return null;Ki.subVectors(this.origin,t);const l=r*this.direction.dot(zo.crossVectors(Ki,zo));if(l<0)return null;const c=r*this.direction.dot(_c.cross(Ki));if(c<0||l+c>o)return null;const h=-r*Ki.dot(Mc);return h<0?null:this.at(h/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ze{constructor(t,e,i,a,s,o,r,l,c,h,u,d,f,m,_,g){ze.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,l,c,h,u,d,f,m,_,g)}set(t,e,i,a,s,o,r,l,c,h,u,d,f,m,_,g){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=a,p[1]=s,p[5]=o,p[9]=r,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=m,p[11]=_,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ze().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,a=1/qa.setFromMatrixColumn(t,0).length(),s=1/qa.setFromMatrixColumn(t,1).length(),o=1/qa.setFromMatrixColumn(t,2).length();return e[0]=i[0]*a,e[1]=i[1]*a,e[2]=i[2]*a,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,a=t.y,s=t.z,o=Math.cos(i),r=Math.sin(i),l=Math.cos(a),c=Math.sin(a),h=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){const d=o*h,f=o*u,m=r*h,_=r*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=f+m*c,e[5]=d-_*c,e[9]=-r*l,e[2]=_-d*c,e[6]=m+f*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*h,f=l*u,m=c*h,_=c*u;e[0]=d+_*r,e[4]=m*r-f,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-r,e[2]=f*r-m,e[6]=_+d*r,e[10]=o*l}else if(t.order==="ZXY"){const d=l*h,f=l*u,m=c*h,_=c*u;e[0]=d-_*r,e[4]=-o*u,e[8]=m+f*r,e[1]=f+m*r,e[5]=o*h,e[9]=_-d*r,e[2]=-o*c,e[6]=r,e[10]=o*l}else if(t.order==="ZYX"){const d=o*h,f=o*u,m=r*h,_=r*u;e[0]=l*h,e[4]=m*c-f,e[8]=d*c+_,e[1]=l*u,e[5]=_*c+d,e[9]=f*c-m,e[2]=-c,e[6]=r*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,f=o*c,m=r*l,_=r*c;e[0]=l*h,e[4]=_-d*u,e[8]=m*u+f,e[1]=u,e[5]=o*h,e[9]=-r*h,e[2]=-c*h,e[6]=f*u+m,e[10]=d-_*u}else if(t.order==="XZY"){const d=o*l,f=o*c,m=r*l,_=r*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+_,e[5]=o*h,e[9]=f*u-m,e[2]=m*u-f,e[6]=r*h,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(jv,t,qv)}lookAt(t,e,i){const a=this.elements;return Yn.subVectors(t,e),Yn.lengthSq()===0&&(Yn.z=1),Yn.normalize(),Ji.crossVectors(i,Yn),Ji.lengthSq()===0&&(Math.abs(i.z)===1?Yn.x+=1e-4:Yn.z+=1e-4,Yn.normalize(),Ji.crossVectors(i,Yn)),Ji.normalize(),Fo.crossVectors(Yn,Ji),a[0]=Ji.x,a[4]=Fo.x,a[8]=Yn.x,a[1]=Ji.y,a[5]=Fo.y,a[9]=Yn.y,a[2]=Ji.z,a[6]=Fo.z,a[10]=Yn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[4],l=i[8],c=i[12],h=i[1],u=i[5],d=i[9],f=i[13],m=i[2],_=i[6],g=i[10],p=i[14],y=i[3],x=i[7],v=i[11],w=i[15],S=a[0],A=a[4],T=a[8],b=a[12],M=a[1],P=a[5],L=a[9],F=a[13],O=a[2],k=a[6],D=a[10],U=a[14],G=a[3],W=a[7],ot=a[11],gt=a[15];return s[0]=o*S+r*M+l*O+c*G,s[4]=o*A+r*P+l*k+c*W,s[8]=o*T+r*L+l*D+c*ot,s[12]=o*b+r*F+l*U+c*gt,s[1]=h*S+u*M+d*O+f*G,s[5]=h*A+u*P+d*k+f*W,s[9]=h*T+u*L+d*D+f*ot,s[13]=h*b+u*F+d*U+f*gt,s[2]=m*S+_*M+g*O+p*G,s[6]=m*A+_*P+g*k+p*W,s[10]=m*T+_*L+g*D+p*ot,s[14]=m*b+_*F+g*U+p*gt,s[3]=y*S+x*M+v*O+w*G,s[7]=y*A+x*P+v*k+w*W,s[11]=y*T+x*L+v*D+w*ot,s[15]=y*b+x*F+v*U+w*gt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],a=t[8],s=t[12],o=t[1],r=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],f=t[14],m=t[3],_=t[7],g=t[11],p=t[15];return m*(+s*l*u-a*c*u-s*r*d+i*c*d+a*r*f-i*l*f)+_*(+e*l*f-e*c*d+s*o*d-a*o*f+a*c*h-s*l*h)+g*(+e*c*u-e*r*f-s*o*u+i*o*f+s*r*h-i*c*h)+p*(-a*r*h-e*l*u+e*r*d+a*o*u-i*o*d+i*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const a=this.elements;return t.isVector3?(a[12]=t.x,a[13]=t.y,a[14]=t.z):(a[12]=t,a[13]=e,a[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],f=t[11],m=t[12],_=t[13],g=t[14],p=t[15],y=u*g*c-_*d*c+_*l*f-r*g*f-u*l*p+r*d*p,x=m*d*c-h*g*c-m*l*f+o*g*f+h*l*p-o*d*p,v=h*_*c-m*u*c+m*r*f-o*_*f-h*r*p+o*u*p,w=m*u*l-h*_*l-m*r*d+o*_*d+h*r*g-o*u*g,S=e*y+i*x+a*v+s*w;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/S;return t[0]=y*A,t[1]=(_*d*s-u*g*s-_*a*f+i*g*f+u*a*p-i*d*p)*A,t[2]=(r*g*s-_*l*s+_*a*c-i*g*c-r*a*p+i*l*p)*A,t[3]=(u*l*s-r*d*s-u*a*c+i*d*c+r*a*f-i*l*f)*A,t[4]=x*A,t[5]=(h*g*s-m*d*s+m*a*f-e*g*f-h*a*p+e*d*p)*A,t[6]=(m*l*s-o*g*s-m*a*c+e*g*c+o*a*p-e*l*p)*A,t[7]=(o*d*s-h*l*s+h*a*c-e*d*c-o*a*f+e*l*f)*A,t[8]=v*A,t[9]=(m*u*s-h*_*s-m*i*f+e*_*f+h*i*p-e*u*p)*A,t[10]=(o*_*s-m*r*s+m*i*c-e*_*c-o*i*p+e*r*p)*A,t[11]=(h*r*s-o*u*s-h*i*c+e*u*c+o*i*f-e*r*f)*A,t[12]=w*A,t[13]=(h*_*a-m*u*a+m*i*d-e*_*d-h*i*g+e*u*g)*A,t[14]=(m*r*a-o*_*a-m*i*l+e*_*l+o*i*g-e*r*g)*A,t[15]=(o*u*a-h*r*a+h*i*l-e*u*l-o*i*d+e*r*d)*A,this}scale(t){const e=this.elements,i=t.x,a=t.y,s=t.z;return e[0]*=i,e[4]*=a,e[8]*=s,e[1]*=i,e[5]*=a,e[9]*=s,e[2]*=i,e[6]*=a,e[10]*=s,e[3]*=i,e[7]*=a,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],a=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,a))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),a=Math.sin(e),s=1-i,o=t.x,r=t.y,l=t.z,c=s*o,h=s*r;return this.set(c*o+i,c*r-a*l,c*l+a*r,0,c*r+a*l,h*r+i,h*l-a*o,0,c*l-a*r,h*l+a*o,s*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,a,s,o){return this.set(1,i,s,0,t,1,o,0,e,a,1,0,0,0,0,1),this}compose(t,e,i){const a=this.elements,s=e._x,o=e._y,r=e._z,l=e._w,c=s+s,h=o+o,u=r+r,d=s*c,f=s*h,m=s*u,_=o*h,g=o*u,p=r*u,y=l*c,x=l*h,v=l*u,w=i.x,S=i.y,A=i.z;return a[0]=(1-(_+p))*w,a[1]=(f+v)*w,a[2]=(m-x)*w,a[3]=0,a[4]=(f-v)*S,a[5]=(1-(d+p))*S,a[6]=(g+y)*S,a[7]=0,a[8]=(m+x)*A,a[9]=(g-y)*A,a[10]=(1-(d+_))*A,a[11]=0,a[12]=t.x,a[13]=t.y,a[14]=t.z,a[15]=1,this}decompose(t,e,i){const a=this.elements;let s=qa.set(a[0],a[1],a[2]).length();const o=qa.set(a[4],a[5],a[6]).length(),r=qa.set(a[8],a[9],a[10]).length();this.determinant()<0&&(s=-s),t.x=a[12],t.y=a[13],t.z=a[14],ri.copy(this);const c=1/s,h=1/o,u=1/r;return ri.elements[0]*=c,ri.elements[1]*=c,ri.elements[2]*=c,ri.elements[4]*=h,ri.elements[5]*=h,ri.elements[6]*=h,ri.elements[8]*=u,ri.elements[9]*=u,ri.elements[10]*=u,e.setFromRotationMatrix(ri),i.x=s,i.y=o,i.z=r,this}makePerspective(t,e,i,a,s,o,r=Bi){const l=this.elements,c=2*s/(e-t),h=2*s/(i-a),u=(e+t)/(e-t),d=(i+a)/(i-a);let f,m;if(r===Bi)f=-(o+s)/(o-s),m=-2*o*s/(o-s);else if(r===Ar)f=-o/(o-s),m=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=m,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,a,s,o,r=Bi){const l=this.elements,c=1/(e-t),h=1/(i-a),u=1/(o-s),d=(e+t)*c,f=(i+a)*h;let m,_;if(r===Bi)m=(o+s)*u,_=-2*u;else if(r===Ar)m=s*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=_,l[14]=-m,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<16;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const qa=new H,ri=new ze,jv=new H(0,0,0),qv=new H(1,1,1),Ji=new H,Fo=new H,Yn=new H,tu=new ze,eu=new go;class wi{constructor(t=0,e=0,i=0,a=wi.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=a}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,a=this._order){return this._x=t,this._y=e,this._z=i,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const a=t.elements,s=a[0],o=a[4],r=a[8],l=a[1],c=a[5],h=a[9],u=a[2],d=a[6],f=a[10];switch(e){case"XYZ":this._y=Math.asin(xn(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-xn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(xn(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-xn(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(xn(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(r,f));break;case"XZY":this._z=Math.asin(-xn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(r,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return tu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(tu,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return eu.setFromEuler(this),this.setFromQuaternion(eu,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}wi.DEFAULT_ORDER="XYZ";class Sh{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Kv=0;const nu=new H,Ka=new go,Di=new ze,Uo=new H,Os=new H,Jv=new H,Qv=new go,iu=new H(1,0,0),au=new H(0,1,0),su=new H(0,0,1),ou={type:"added"},ty={type:"removed"},Ja={type:"childadded",child:null},bc={type:"childremoved",child:null};class Ve extends Rs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Kv++}),this.uuid=Si(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ve.DEFAULT_UP.clone();const t=new H,e=new wi,i=new go,a=new H(1,1,1);function s(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new ze},normalMatrix:{value:new de}}),this.matrix=new ze,this.matrixWorld=new ze,this.matrixAutoUpdate=Ve.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ve.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Sh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ka.setFromAxisAngle(t,e),this.quaternion.multiply(Ka),this}rotateOnWorldAxis(t,e){return Ka.setFromAxisAngle(t,e),this.quaternion.premultiply(Ka),this}rotateX(t){return this.rotateOnAxis(iu,t)}rotateY(t){return this.rotateOnAxis(au,t)}rotateZ(t){return this.rotateOnAxis(su,t)}translateOnAxis(t,e){return nu.copy(t).applyQuaternion(this.quaternion),this.position.add(nu.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(iu,t)}translateY(t){return this.translateOnAxis(au,t)}translateZ(t){return this.translateOnAxis(su,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Di.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Uo.copy(t):Uo.set(t,e,i);const a=this.parent;this.updateWorldMatrix(!0,!1),Os.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Di.lookAt(Os,Uo,this.up):Di.lookAt(Uo,Os,this.up),this.quaternion.setFromRotationMatrix(Di),a&&(Di.extractRotation(a.matrixWorld),Ka.setFromRotationMatrix(Di),this.quaternion.premultiply(Ka.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(ou),Ja.child=t,this.dispatchEvent(Ja),Ja.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(ty),bc.child=t,this.dispatchEvent(bc),bc.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Di.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Di.multiply(t.parent.matrixWorld)),t.applyMatrix4(Di),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(ou),Ja.child=t,this.dispatchEvent(Ja),Ja.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,a=this.children.length;i<a;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Os,t,Jv),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Os,Qv,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function s(r,l){return r[l.uuid]===void 0&&(r[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=s(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const l=r.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];s(t.shapes,u)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let l=0,c=this.material.length;l<c;l++)r.push(s(t.materials,this.material[l]));a.material=r}else a.material=s(t.materials,this.material);if(this.children.length>0){a.children=[];for(let r=0;r<this.children.length;r++)a.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){a.animations=[];for(let r=0;r<this.animations.length;r++){const l=this.animations[r];a.animations.push(s(t.animations,l))}}if(e){const r=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),m=o(t.nodes);r.length>0&&(i.geometries=r),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),m.length>0&&(i.nodes=m)}return i.object=a,i;function o(r){const l=[];for(const c in r){const h=r[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const a=t.children[i];this.add(a.clone())}return this}}Ve.DEFAULT_UP=new H(0,1,0);Ve.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ve.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ci=new H,ki=new H,Sc=new H,Ii=new H,Qa=new H,ts=new H,ru=new H,wc=new H,Ec=new H,Tc=new H,Ac=new qe,Rc=new qe,Pc=new qe;class qn{constructor(t=new H,e=new H,i=new H){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,a){a.subVectors(i,e),ci.subVectors(t,e),a.cross(ci);const s=a.lengthSq();return s>0?a.multiplyScalar(1/Math.sqrt(s)):a.set(0,0,0)}static getBarycoord(t,e,i,a,s){ci.subVectors(a,e),ki.subVectors(i,e),Sc.subVectors(t,e);const o=ci.dot(ci),r=ci.dot(ki),l=ci.dot(Sc),c=ki.dot(ki),h=ki.dot(Sc),u=o*c-r*r;if(u===0)return s.set(0,0,0),null;const d=1/u,f=(c*l-r*h)*d,m=(o*h-r*l)*d;return s.set(1-f-m,m,f)}static containsPoint(t,e,i,a){return this.getBarycoord(t,e,i,a,Ii)===null?!1:Ii.x>=0&&Ii.y>=0&&Ii.x+Ii.y<=1}static getInterpolation(t,e,i,a,s,o,r,l){return this.getBarycoord(t,e,i,a,Ii)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Ii.x),l.addScaledVector(o,Ii.y),l.addScaledVector(r,Ii.z),l)}static getInterpolatedAttribute(t,e,i,a,s,o){return Ac.setScalar(0),Rc.setScalar(0),Pc.setScalar(0),Ac.fromBufferAttribute(t,e),Rc.fromBufferAttribute(t,i),Pc.fromBufferAttribute(t,a),o.setScalar(0),o.addScaledVector(Ac,s.x),o.addScaledVector(Rc,s.y),o.addScaledVector(Pc,s.z),o}static isFrontFacing(t,e,i,a){return ci.subVectors(i,e),ki.subVectors(t,e),ci.cross(ki).dot(a)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,a){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[a]),this}setFromAttributeAndIndices(t,e,i,a){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,a),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return ci.subVectors(this.c,this.b),ki.subVectors(this.a,this.b),ci.cross(ki).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return qn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return qn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,a,s){return qn.getInterpolation(t,this.a,this.b,this.c,e,i,a,s)}containsPoint(t){return qn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return qn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,a=this.b,s=this.c;let o,r;Qa.subVectors(a,i),ts.subVectors(s,i),wc.subVectors(t,i);const l=Qa.dot(wc),c=ts.dot(wc);if(l<=0&&c<=0)return e.copy(i);Ec.subVectors(t,a);const h=Qa.dot(Ec),u=ts.dot(Ec);if(h>=0&&u<=h)return e.copy(a);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(i).addScaledVector(Qa,o);Tc.subVectors(t,s);const f=Qa.dot(Tc),m=ts.dot(Tc);if(m>=0&&f<=m)return e.copy(s);const _=f*c-l*m;if(_<=0&&c>=0&&m<=0)return r=c/(c-m),e.copy(i).addScaledVector(ts,r);const g=h*m-f*u;if(g<=0&&u-h>=0&&f-m>=0)return ru.subVectors(s,a),r=(u-h)/(u-h+(f-m)),e.copy(a).addScaledVector(ru,r);const p=1/(g+_+d);return o=_*p,r=d*p,e.copy(i).addScaledVector(Qa,o).addScaledVector(ts,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const op={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Qi={h:0,s:0,l:0},No={h:0,s:0,l:0};function Cc(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class Qt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const a=t;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=In){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Me.toWorkingColorSpace(this,e),this}setRGB(t,e,i,a=Me.workingColorSpace){return this.r=t,this.g=e,this.b=i,Me.toWorkingColorSpace(this,a),this}setHSL(t,e,i,a=Me.workingColorSpace){if(t=Mh(t,1),e=xn(e,0,1),i=xn(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,o=2*i-s;this.r=Cc(o,s,t+1/3),this.g=Cc(o,s,t),this.b=Cc(o,s,t-1/3)}return Me.toWorkingColorSpace(this,a),this}setStyle(t,e=In){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=a[1],r=a[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=a[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=In){const i=op[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Hi(t.r),this.g=Hi(t.g),this.b=Hi(t.b),this}copyLinearToSRGB(t){return this.r=xs(t.r),this.g=xs(t.g),this.b=xs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=In){return Me.fromWorkingColorSpace(bn.copy(this),t),Math.round(xn(bn.r*255,0,255))*65536+Math.round(xn(bn.g*255,0,255))*256+Math.round(xn(bn.b*255,0,255))}getHexString(t=In){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Me.workingColorSpace){Me.fromWorkingColorSpace(bn.copy(this),e);const i=bn.r,a=bn.g,s=bn.b,o=Math.max(i,a,s),r=Math.min(i,a,s);let l,c;const h=(r+o)/2;if(r===o)l=0,c=0;else{const u=o-r;switch(c=h<=.5?u/(o+r):u/(2-o-r),o){case i:l=(a-s)/u+(a<s?6:0);break;case a:l=(s-i)/u+2;break;case s:l=(i-a)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Me.workingColorSpace){return Me.fromWorkingColorSpace(bn.copy(this),e),t.r=bn.r,t.g=bn.g,t.b=bn.b,t}getStyle(t=In){Me.fromWorkingColorSpace(bn.copy(this),t);const e=bn.r,i=bn.g,a=bn.b;return t!==In?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(a*255)})`}offsetHSL(t,e,i){return this.getHSL(Qi),this.setHSL(Qi.h+t,Qi.s+e,Qi.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Qi),t.getHSL(No);const i=Ks(Qi.h,No.h,e),a=Ks(Qi.s,No.s,e),s=Ks(Qi.l,No.l,e);return this.setHSL(i,a,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,a=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*a,this.g=s[1]*e+s[4]*i+s[7]*a,this.b=s[2]*e+s[5]*i+s[8]*a,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const bn=new Qt;Qt.NAMES=op;let ey=0;class ka extends Rs{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ey++}),this.uuid=Si(),this.name="",this.blending=ps,this.side=ca,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ll,this.blendDst=hl,this.blendEquation=Ea,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Qt(0,0,0),this.blendAlpha=0,this.depthFunc=Ms,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Gd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Wa,this.stencilZFail=Wa,this.stencilZPass=Wa,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const a=this[e];if(a===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(i):a&&a.isVector3&&i&&i.isVector3?a.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ps&&(i.blending=this.blending),this.side!==ca&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==ll&&(i.blendSrc=this.blendSrc),this.blendDst!==hl&&(i.blendDst=this.blendDst),this.blendEquation!==Ea&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ms&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Gd&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Wa&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Wa&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Wa&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function a(s){const o=[];for(const r in s){const l=s[r];delete l.metadata,o.push(l)}return o}if(e){const s=a(t.textures),o=a(t.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const a=e.length;i=new Array(a);for(let s=0;s!==a;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class en extends ka{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new wi,this.combine=ph,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const tn=new H,Oo=new Wt;class vn{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Zl,this.updateRanges=[],this.gpuType=Oi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let a=0,s=this.itemSize;a<s;a++)this.array[t+a]=e.array[i+a];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Oo.fromBufferAttribute(this,e),Oo.applyMatrix3(t),this.setXY(e,Oo.x,Oo.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)tn.fromBufferAttribute(this,e),tn.applyMatrix3(t),this.setXYZ(e,tn.x,tn.y,tn.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)tn.fromBufferAttribute(this,e),tn.applyMatrix4(t),this.setXYZ(e,tn.x,tn.y,tn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)tn.fromBufferAttribute(this,e),tn.applyNormalMatrix(t),this.setXYZ(e,tn.x,tn.y,tn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)tn.fromBufferAttribute(this,e),tn.transformDirection(t),this.setXYZ(e,tn.x,tn.y,tn.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=li(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Re(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=li(e,this.array)),e}setX(t,e){return this.normalized&&(e=Re(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=li(e,this.array)),e}setY(t,e){return this.normalized&&(e=Re(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=li(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Re(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=li(e,this.array)),e}setW(t,e){return this.normalized&&(e=Re(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Re(e,this.array),i=Re(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,a){return t*=this.itemSize,this.normalized&&(e=Re(e,this.array),i=Re(i,this.array),a=Re(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t*=this.itemSize,this.normalized&&(e=Re(e,this.array),i=Re(i,this.array),a=Re(a,this.array),s=Re(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Zl&&(t.usage=this.usage),t}}class rp extends vn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class cp extends vn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class Se extends vn{constructor(t,e,i){super(new Float32Array(t),e,i)}}let ny=0;const Kn=new ze,Lc=new Ve,es=new H,$n=new xo,Bs=new xo,pn=new H;class nn extends Rs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ny++}),this.uuid=Si(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(ip(t)?cp:rp)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new de().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(t),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Kn.makeRotationFromQuaternion(t),this.applyMatrix4(Kn),this}rotateX(t){return Kn.makeRotationX(t),this.applyMatrix4(Kn),this}rotateY(t){return Kn.makeRotationY(t),this.applyMatrix4(Kn),this}rotateZ(t){return Kn.makeRotationZ(t),this.applyMatrix4(Kn),this}translate(t,e,i){return Kn.makeTranslation(t,e,i),this.applyMatrix4(Kn),this}scale(t,e,i){return Kn.makeScale(t,e,i),this.applyMatrix4(Kn),this}lookAt(t){return Lc.lookAt(t),Lc.updateMatrix(),this.applyMatrix4(Lc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(es).negate(),this.translate(es.x,es.y,es.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let a=0,s=t.length;a<s;a++){const o=t[a];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Se(i,3))}else{for(let i=0,a=e.count;i<a;i++){const s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new xo);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,a=e.length;i<a;i++){const s=e[i];$n.setFromBufferAttribute(s),this.morphTargetsRelative?(pn.addVectors(this.boundingBox.min,$n.min),this.boundingBox.expandByPoint(pn),pn.addVectors(this.boundingBox.max,$n.max),this.boundingBox.expandByPoint(pn)):(this.boundingBox.expandByPoint($n.min),this.boundingBox.expandByPoint($n.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Br);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new H,1/0);return}if(t){const i=this.boundingSphere.center;if($n.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const r=e[s];Bs.setFromBufferAttribute(r),this.morphTargetsRelative?(pn.addVectors($n.min,Bs.min),$n.expandByPoint(pn),pn.addVectors($n.max,Bs.max),$n.expandByPoint(pn)):($n.expandByPoint(Bs.min),$n.expandByPoint(Bs.max))}$n.getCenter(i);let a=0;for(let s=0,o=t.count;s<o;s++)pn.fromBufferAttribute(t,s),a=Math.max(a,i.distanceToSquared(pn));if(e)for(let s=0,o=e.length;s<o;s++){const r=e[s],l=this.morphTargetsRelative;for(let c=0,h=r.count;c<h;c++)pn.fromBufferAttribute(r,c),l&&(es.fromBufferAttribute(t,c),pn.add(es)),a=Math.max(a,i.distanceToSquared(pn))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,a=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new vn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),r=[],l=[];for(let T=0;T<i.count;T++)r[T]=new H,l[T]=new H;const c=new H,h=new H,u=new H,d=new Wt,f=new Wt,m=new Wt,_=new H,g=new H;function p(T,b,M){c.fromBufferAttribute(i,T),h.fromBufferAttribute(i,b),u.fromBufferAttribute(i,M),d.fromBufferAttribute(s,T),f.fromBufferAttribute(s,b),m.fromBufferAttribute(s,M),h.sub(c),u.sub(c),f.sub(d),m.sub(d);const P=1/(f.x*m.y-m.x*f.y);isFinite(P)&&(_.copy(h).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(P),g.copy(u).multiplyScalar(f.x).addScaledVector(h,-m.x).multiplyScalar(P),r[T].add(_),r[b].add(_),r[M].add(_),l[T].add(g),l[b].add(g),l[M].add(g))}let y=this.groups;y.length===0&&(y=[{start:0,count:t.count}]);for(let T=0,b=y.length;T<b;++T){const M=y[T],P=M.start,L=M.count;for(let F=P,O=P+L;F<O;F+=3)p(t.getX(F+0),t.getX(F+1),t.getX(F+2))}const x=new H,v=new H,w=new H,S=new H;function A(T){w.fromBufferAttribute(a,T),S.copy(w);const b=r[T];x.copy(b),x.sub(w.multiplyScalar(w.dot(b))).normalize(),v.crossVectors(S,b);const P=v.dot(l[T])<0?-1:1;o.setXYZW(T,x.x,x.y,x.z,P)}for(let T=0,b=y.length;T<b;++T){const M=y[T],P=M.start,L=M.count;for(let F=P,O=P+L;F<O;F+=3)A(t.getX(F+0)),A(t.getX(F+1)),A(t.getX(F+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new vn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const a=new H,s=new H,o=new H,r=new H,l=new H,c=new H,h=new H,u=new H;if(t)for(let d=0,f=t.count;d<f;d+=3){const m=t.getX(d+0),_=t.getX(d+1),g=t.getX(d+2);a.fromBufferAttribute(e,m),s.fromBufferAttribute(e,_),o.fromBufferAttribute(e,g),h.subVectors(o,s),u.subVectors(a,s),h.cross(u),r.fromBufferAttribute(i,m),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,g),r.add(h),l.add(h),c.add(h),i.setXYZ(m,r.x,r.y,r.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)a.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,s),u.subVectors(a,s),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)pn.fromBufferAttribute(t,e),pn.normalize(),t.setXYZ(e,pn.x,pn.y,pn.z)}toNonIndexed(){function t(r,l){const c=r.array,h=r.itemSize,u=r.normalized,d=new c.constructor(l.length*h);let f=0,m=0;for(let _=0,g=l.length;_<g;_++){r.isInterleavedBufferAttribute?f=l[_]*r.data.stride+r.offset:f=l[_]*h;for(let p=0;p<h;p++)d[m++]=c[f++]}return new vn(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new nn,i=this.index.array,a=this.attributes;for(const r in a){const l=a[r],c=t(l,i);e.setAttribute(r,c)}const s=this.morphAttributes;for(const r in s){const l=[],c=s[r];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=t(d,i);l.push(f)}e.morphAttributes[r]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,l=o.length;r<l;r++){const c=o[r];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const a={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(t.data))}h.length>0&&(a[l]=h,s=!0)}s&&(t.data.morphAttributes=a,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const a=t.attributes;for(const c in a){const h=a[c];this.setAttribute(c,h.clone(e))}const s=t.morphAttributes;for(const c in s){const h=[],u=s[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const cu=new ze,ma=new bh,Bo=new Br,lu=new H,Ho=new H,Go=new H,Vo=new H,Dc=new H,Xo=new H,hu=new H,Wo=new H;class me extends Ve{constructor(t=new nn,e=new en){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}getVertexPosition(t,e){const i=this.geometry,a=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(a,t);const r=this.morphTargetInfluences;if(s&&r){Xo.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=r[l],u=s[l];h!==0&&(Dc.fromBufferAttribute(u,t),o?Xo.addScaledVector(Dc,h):Xo.addScaledVector(Dc.sub(e),h))}e.add(Xo)}return e}raycast(t,e){const i=this.geometry,a=this.material,s=this.matrixWorld;a!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Bo.copy(i.boundingSphere),Bo.applyMatrix4(s),ma.copy(t.ray).recast(t.near),!(Bo.containsPoint(ma.origin)===!1&&(ma.intersectSphere(Bo,lu)===null||ma.origin.distanceToSquared(lu)>(t.far-t.near)**2))&&(cu.copy(s).invert(),ma.copy(t.ray).applyMatrix4(cu),!(i.boundingBox!==null&&ma.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,ma)))}_computeIntersections(t,e,i){let a;const s=this.geometry,o=this.material,r=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,f=s.drawRange;if(r!==null)if(Array.isArray(o))for(let m=0,_=d.length;m<_;m++){const g=d[m],p=o[g.materialIndex],y=Math.max(g.start,f.start),x=Math.min(r.count,Math.min(g.start+g.count,f.start+f.count));for(let v=y,w=x;v<w;v+=3){const S=r.getX(v),A=r.getX(v+1),T=r.getX(v+2);a=Yo(this,p,t,i,c,h,u,S,A,T),a&&(a.faceIndex=Math.floor(v/3),a.face.materialIndex=g.materialIndex,e.push(a))}}else{const m=Math.max(0,f.start),_=Math.min(r.count,f.start+f.count);for(let g=m,p=_;g<p;g+=3){const y=r.getX(g),x=r.getX(g+1),v=r.getX(g+2);a=Yo(this,o,t,i,c,h,u,y,x,v),a&&(a.faceIndex=Math.floor(g/3),e.push(a))}}else if(l!==void 0)if(Array.isArray(o))for(let m=0,_=d.length;m<_;m++){const g=d[m],p=o[g.materialIndex],y=Math.max(g.start,f.start),x=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let v=y,w=x;v<w;v+=3){const S=v,A=v+1,T=v+2;a=Yo(this,p,t,i,c,h,u,S,A,T),a&&(a.faceIndex=Math.floor(v/3),a.face.materialIndex=g.materialIndex,e.push(a))}}else{const m=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let g=m,p=_;g<p;g+=3){const y=g,x=g+1,v=g+2;a=Yo(this,o,t,i,c,h,u,y,x,v),a&&(a.faceIndex=Math.floor(g/3),e.push(a))}}}}function iy(n,t,e,i,a,s,o,r){let l;if(t.side===Bn?l=i.intersectTriangle(o,s,a,!0,r):l=i.intersectTriangle(a,s,o,t.side===ca,r),l===null)return null;Wo.copy(r),Wo.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(Wo);return c<e.near||c>e.far?null:{distance:c,point:Wo.clone(),object:n}}function Yo(n,t,e,i,a,s,o,r,l,c){n.getVertexPosition(r,Ho),n.getVertexPosition(l,Go),n.getVertexPosition(c,Vo);const h=iy(n,t,e,i,Ho,Go,Vo,hu);if(h){const u=new H;qn.getBarycoord(hu,Ho,Go,Vo,u),a&&(h.uv=qn.getInterpolatedAttribute(a,r,l,c,u,new Wt)),s&&(h.uv1=qn.getInterpolatedAttribute(s,r,l,c,u,new Wt)),o&&(h.normal=qn.getInterpolatedAttribute(o,r,l,c,u,new H),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:r,b:l,c,normal:new H,materialIndex:0};qn.getNormal(Ho,Go,Vo,d.normal),h.face=d,h.barycoord=u}return h}class ui extends nn{constructor(t=1,e=1,i=1,a=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:a,heightSegments:s,depthSegments:o};const r=this;a=Math.floor(a),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],h=[],u=[];let d=0,f=0;m("z","y","x",-1,-1,i,e,t,o,s,0),m("z","y","x",1,-1,i,e,-t,o,s,1),m("x","z","y",1,1,t,i,e,a,o,2),m("x","z","y",1,-1,t,i,-e,a,o,3),m("x","y","z",1,-1,t,e,i,a,s,4),m("x","y","z",-1,-1,t,e,-i,a,s,5),this.setIndex(l),this.setAttribute("position",new Se(c,3)),this.setAttribute("normal",new Se(h,3)),this.setAttribute("uv",new Se(u,2));function m(_,g,p,y,x,v,w,S,A,T,b){const M=v/A,P=w/T,L=v/2,F=w/2,O=S/2,k=A+1,D=T+1;let U=0,G=0;const W=new H;for(let ot=0;ot<D;ot++){const gt=ot*P-F;for(let Mt=0;Mt<k;Mt++){const kt=Mt*M-L;W[_]=kt*y,W[g]=gt*x,W[p]=O,c.push(W.x,W.y,W.z),W[_]=0,W[g]=0,W[p]=S>0?1:-1,h.push(W.x,W.y,W.z),u.push(Mt/A),u.push(1-ot/T),U+=1}}for(let ot=0;ot<T;ot++)for(let gt=0;gt<A;gt++){const Mt=d+gt+k*ot,kt=d+gt+k*(ot+1),Q=d+(gt+1)+k*(ot+1),nt=d+(gt+1)+k*ot;l.push(Mt,kt,nt),l.push(kt,Q,nt),G+=6}r.addGroup(f,G,b),f+=G,d+=U}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ui(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ts(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const a=n[e][i];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=a.clone():Array.isArray(a)?t[e][i]=a.slice():t[e][i]=a}}return t}function kn(n){const t={};for(let e=0;e<n.length;e++){const i=Ts(n[e]);for(const a in i)t[a]=i[a]}return t}function ay(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function lp(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Me.workingColorSpace}const sy={clone:Ts,merge:kn};var oy=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ry=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class la extends ka{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=oy,this.fragmentShader=ry,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ts(t.uniforms),this.uniformsGroups=ay(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const a in this.uniforms){const o=this.uniforms[a].value;o&&o.isTexture?e.uniforms[a]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[a]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[a]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[a]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[a]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[a]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[a]={type:"m4",value:o.toArray()}:e.uniforms[a]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const a in this.extensions)this.extensions[a]===!0&&(i[a]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class hp extends Ve{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ze,this.projectionMatrix=new ze,this.projectionMatrixInverse=new ze,this.coordinateSystem=Bi}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ta=new H,du=new Wt,uu=new Wt;class Qn extends hp{constructor(t=50,e=1,i=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=a,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=ro*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(gs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ro*2*Math.atan(Math.tan(gs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){ta.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ta.x,ta.y).multiplyScalar(-t/ta.z),ta.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ta.x,ta.y).multiplyScalar(-t/ta.z)}getViewSize(t,e){return this.getViewBounds(t,du,uu),e.subVectors(uu,du)}setViewOffset(t,e,i,a,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(gs*.5*this.fov)/this.zoom,i=2*e,a=this.aspect*i,s=-.5*a;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*a/l,e-=o.offsetY*i/c,a*=o.width/l,i*=o.height/c}const r=this.filmOffset;r!==0&&(s+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+a,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const ns=-90,is=1;class cy extends Ve{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new Qn(ns,is,t,e);a.layers=this.layers,this.add(a);const s=new Qn(ns,is,t,e);s.layers=this.layers,this.add(s);const o=new Qn(ns,is,t,e);o.layers=this.layers,this.add(o);const r=new Qn(ns,is,t,e);r.layers=this.layers,this.add(r);const l=new Qn(ns,is,t,e);l.layers=this.layers,this.add(l);const c=new Qn(ns,is,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,a,s,o,r,l]=e;for(const c of e)this.remove(c);if(t===Bi)i.up.set(0,1,0),i.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Ar)i.up.set(0,-1,0),i.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:a}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,r,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,a),t.render(e,s),t.setRenderTarget(i,1,a),t.render(e,o),t.setRenderTarget(i,2,a),t.render(e,r),t.setRenderTarget(i,3,a),t.render(e,l),t.setRenderTarget(i,4,a),t.render(e,c),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,a),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class dp extends zn{constructor(t,e,i,a,s,o,r,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:bs,super(t,e,i,a,s,o,r,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class ly extends La{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},a=[i,i,i,i,i,i];this.texture=new dp(a,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Mi}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},a=new ui(5,5,5),s=new la({name:"CubemapFromEquirect",uniforms:Ts(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Bn,blending:sa});s.uniforms.tEquirect.value=e;const o=new me(a,s),r=e.minFilter;return e.minFilter===Ra&&(e.minFilter=Mi),new cy(1,10,this).update(t,o),e.minFilter=r,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,a){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,a);t.setRenderTarget(s)}}const kc=new H,hy=new H,dy=new de;class ba{constructor(t=new H(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,a){return this.normal.set(t,e,i),this.constant=a,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const a=kc.subVectors(i,e).cross(hy.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(a,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(kc),a=this.normal.dot(i);if(a===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/a;return s<0||s>1?null:e.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||dy.getNormalMatrix(t),a=this.coplanarPoint(kc).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-a.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ga=new Br,$o=new H;class wh{constructor(t=new ba,e=new ba,i=new ba,a=new ba,s=new ba,o=new ba){this.planes=[t,e,i,a,s,o]}set(t,e,i,a,s,o){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(a),r[4].copy(s),r[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Bi){const i=this.planes,a=t.elements,s=a[0],o=a[1],r=a[2],l=a[3],c=a[4],h=a[5],u=a[6],d=a[7],f=a[8],m=a[9],_=a[10],g=a[11],p=a[12],y=a[13],x=a[14],v=a[15];if(i[0].setComponents(l-s,d-c,g-f,v-p).normalize(),i[1].setComponents(l+s,d+c,g+f,v+p).normalize(),i[2].setComponents(l+o,d+h,g+m,v+y).normalize(),i[3].setComponents(l-o,d-h,g-m,v-y).normalize(),i[4].setComponents(l-r,d-u,g-_,v-x).normalize(),e===Bi)i[5].setComponents(l+r,d+u,g+_,v+x).normalize();else if(e===Ar)i[5].setComponents(r,u,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ga.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ga.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ga)}intersectsSprite(t){return ga.center.set(0,0,0),ga.radius=.7071067811865476,ga.applyMatrix4(t.matrixWorld),this.intersectsSphere(ga)}intersectsSphere(t){const e=this.planes,i=t.center,a=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<a)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const a=e[i];if($o.x=a.normal.x>0?t.max.x:t.min.x,$o.y=a.normal.y>0?t.max.y:t.min.y,$o.z=a.normal.z>0?t.max.z:t.min.z,a.distanceToPoint($o)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function up(){let n=null,t=!1,e=null,i=null;function a(s,o){e(s,o),i=n.requestAnimationFrame(a)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(a),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){n=s}}}function uy(n){const t=new WeakMap;function e(r,l){const c=r.array,h=r.usage,u=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,h),r.onUploadCallback();let f;if(c instanceof Float32Array)f=n.FLOAT;else if(c instanceof Uint16Array)r.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=n.SHORT;else if(c instanceof Uint32Array)f=n.UNSIGNED_INT;else if(c instanceof Int32Array)f=n.INT;else if(c instanceof Int8Array)f=n.BYTE;else if(c instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:r.version,size:u}}function i(r,l,c){const h=l.array,u=l.updateRanges;if(n.bindBuffer(c,r),u.length===0)n.bufferSubData(c,0,h);else{u.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<u.length;f++){const m=u[d],_=u[f];_.start<=m.start+m.count+1?m.count=Math.max(m.count,_.start+_.count-m.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,m=u.length;f<m;f++){const _=u[f];n.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function a(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function s(r){r.isInterleavedBufferAttribute&&(r=r.data);const l=t.get(r);l&&(n.deleteBuffer(l.buffer),t.delete(r))}function o(r,l){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const h=t.get(r);(!h||h.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const c=t.get(r);if(c===void 0)t.set(r,e(r,l));else if(c.version<r.version){if(c.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,r,l),c.version=r.version}}return{get:a,remove:s,update:o}}class Jn extends nn{constructor(t=1,e=1,i=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:a};const s=t/2,o=e/2,r=Math.floor(i),l=Math.floor(a),c=r+1,h=l+1,u=t/r,d=e/l,f=[],m=[],_=[],g=[];for(let p=0;p<h;p++){const y=p*d-o;for(let x=0;x<c;x++){const v=x*u-s;m.push(v,-y,0),_.push(0,0,1),g.push(x/r),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let y=0;y<r;y++){const x=y+c*p,v=y+c*(p+1),w=y+1+c*(p+1),S=y+1+c*p;f.push(x,v,S),f.push(v,w,S)}this.setIndex(f),this.setAttribute("position",new Se(m,3)),this.setAttribute("normal",new Se(_,3)),this.setAttribute("uv",new Se(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Jn(t.width,t.height,t.widthSegments,t.heightSegments)}}var fy=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,py=`#ifdef USE_ALPHAHASH
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
#endif`,my=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,gy=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,xy=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,vy=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,yy=`#ifdef USE_AOMAP
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
#endif`,_y=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,My=`#ifdef USE_BATCHING
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
#endif`,by=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Sy=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,wy=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ey=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Ty=`#ifdef USE_IRIDESCENCE
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
#endif`,Ay=`#ifdef USE_BUMPMAP
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
#endif`,Ry=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Py=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Cy=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ly=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Dy=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,ky=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Iy=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,zy=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Fy=`#define PI 3.141592653589793
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
} // validated`,Uy=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Ny=`vec3 transformedNormal = objectNormal;
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
#endif`,Oy=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,By=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Hy=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Gy=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Vy="gl_FragColor = linearToOutputTexel( gl_FragColor );",Xy=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Wy=`#ifdef USE_ENVMAP
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
#endif`,Yy=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,$y=`#ifdef USE_ENVMAP
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
#endif`,Zy=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,jy=`#ifdef USE_ENVMAP
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
#endif`,qy=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ky=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Jy=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Qy=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,t_=`#ifdef USE_GRADIENTMAP
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
}`,e_=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,n_=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,i_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,a_=`uniform bool receiveShadow;
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
#endif`,s_=`#ifdef USE_ENVMAP
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
#endif`,o_=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,r_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,c_=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,l_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,h_=`PhysicalMaterial material;
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
#endif`,d_=`struct PhysicalMaterial {
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
}`,u_=`
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
#endif`,f_=`#if defined( RE_IndirectDiffuse )
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
#endif`,p_=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,m_=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,g_=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,x_=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,v_=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,y_=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,__=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,M_=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,b_=`#if defined( USE_POINTS_UV )
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
#endif`,S_=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,w_=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,E_=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,T_=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,A_=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,R_=`#ifdef USE_MORPHTARGETS
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
#endif`,P_=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,C_=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,L_=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,D_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,k_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,I_=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,z_=`#ifdef USE_NORMALMAP
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
#endif`,F_=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,U_=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,N_=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,O_=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,B_=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,H_=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,G_=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,V_=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,X_=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,W_=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Y_=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,$_=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Z_=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,j_=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,q_=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,K_=`float getShadowMask() {
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
}`,J_=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Q_=`#ifdef USE_SKINNING
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
#endif`,tM=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,eM=`#ifdef USE_SKINNING
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
#endif`,nM=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,iM=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,aM=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,sM=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,oM=`#ifdef USE_TRANSMISSION
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
#endif`,rM=`#ifdef USE_TRANSMISSION
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
#endif`,cM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,lM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,hM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,dM=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const uM=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,fM=`uniform sampler2D t2D;
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
}`,pM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,mM=`#ifdef ENVMAP_TYPE_CUBE
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
}`,gM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,xM=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vM=`#include <common>
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
}`,yM=`#if DEPTH_PACKING == 3200
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
}`,_M=`#define DISTANCE
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
}`,MM=`#define DISTANCE
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
}`,bM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,SM=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wM=`uniform float scale;
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
}`,EM=`uniform vec3 diffuse;
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
}`,TM=`#include <common>
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
}`,AM=`uniform vec3 diffuse;
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
}`,RM=`#define LAMBERT
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
}`,PM=`#define LAMBERT
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
}`,CM=`#define MATCAP
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
}`,LM=`#define MATCAP
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
}`,DM=`#define NORMAL
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
}`,kM=`#define NORMAL
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
}`,IM=`#define PHONG
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
}`,zM=`#define PHONG
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
}`,FM=`#define STANDARD
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
}`,UM=`#define STANDARD
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
}`,NM=`#define TOON
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
}`,OM=`#define TOON
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
}`,BM=`uniform float size;
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
}`,HM=`uniform vec3 diffuse;
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
}`,GM=`#include <common>
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
}`,VM=`uniform vec3 color;
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
}`,XM=`uniform float rotation;
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
}`,WM=`uniform vec3 diffuse;
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
}`,ue={alphahash_fragment:fy,alphahash_pars_fragment:py,alphamap_fragment:my,alphamap_pars_fragment:gy,alphatest_fragment:xy,alphatest_pars_fragment:vy,aomap_fragment:yy,aomap_pars_fragment:_y,batching_pars_vertex:My,batching_vertex:by,begin_vertex:Sy,beginnormal_vertex:wy,bsdfs:Ey,iridescence_fragment:Ty,bumpmap_pars_fragment:Ay,clipping_planes_fragment:Ry,clipping_planes_pars_fragment:Py,clipping_planes_pars_vertex:Cy,clipping_planes_vertex:Ly,color_fragment:Dy,color_pars_fragment:ky,color_pars_vertex:Iy,color_vertex:zy,common:Fy,cube_uv_reflection_fragment:Uy,defaultnormal_vertex:Ny,displacementmap_pars_vertex:Oy,displacementmap_vertex:By,emissivemap_fragment:Hy,emissivemap_pars_fragment:Gy,colorspace_fragment:Vy,colorspace_pars_fragment:Xy,envmap_fragment:Wy,envmap_common_pars_fragment:Yy,envmap_pars_fragment:$y,envmap_pars_vertex:Zy,envmap_physical_pars_fragment:s_,envmap_vertex:jy,fog_vertex:qy,fog_pars_vertex:Ky,fog_fragment:Jy,fog_pars_fragment:Qy,gradientmap_pars_fragment:t_,lightmap_pars_fragment:e_,lights_lambert_fragment:n_,lights_lambert_pars_fragment:i_,lights_pars_begin:a_,lights_toon_fragment:o_,lights_toon_pars_fragment:r_,lights_phong_fragment:c_,lights_phong_pars_fragment:l_,lights_physical_fragment:h_,lights_physical_pars_fragment:d_,lights_fragment_begin:u_,lights_fragment_maps:f_,lights_fragment_end:p_,logdepthbuf_fragment:m_,logdepthbuf_pars_fragment:g_,logdepthbuf_pars_vertex:x_,logdepthbuf_vertex:v_,map_fragment:y_,map_pars_fragment:__,map_particle_fragment:M_,map_particle_pars_fragment:b_,metalnessmap_fragment:S_,metalnessmap_pars_fragment:w_,morphinstance_vertex:E_,morphcolor_vertex:T_,morphnormal_vertex:A_,morphtarget_pars_vertex:R_,morphtarget_vertex:P_,normal_fragment_begin:C_,normal_fragment_maps:L_,normal_pars_fragment:D_,normal_pars_vertex:k_,normal_vertex:I_,normalmap_pars_fragment:z_,clearcoat_normal_fragment_begin:F_,clearcoat_normal_fragment_maps:U_,clearcoat_pars_fragment:N_,iridescence_pars_fragment:O_,opaque_fragment:B_,packing:H_,premultiplied_alpha_fragment:G_,project_vertex:V_,dithering_fragment:X_,dithering_pars_fragment:W_,roughnessmap_fragment:Y_,roughnessmap_pars_fragment:$_,shadowmap_pars_fragment:Z_,shadowmap_pars_vertex:j_,shadowmap_vertex:q_,shadowmask_pars_fragment:K_,skinbase_vertex:J_,skinning_pars_vertex:Q_,skinning_vertex:tM,skinnormal_vertex:eM,specularmap_fragment:nM,specularmap_pars_fragment:iM,tonemapping_fragment:aM,tonemapping_pars_fragment:sM,transmission_fragment:oM,transmission_pars_fragment:rM,uv_pars_fragment:cM,uv_pars_vertex:lM,uv_vertex:hM,worldpos_vertex:dM,background_vert:uM,background_frag:fM,backgroundCube_vert:pM,backgroundCube_frag:mM,cube_vert:gM,cube_frag:xM,depth_vert:vM,depth_frag:yM,distanceRGBA_vert:_M,distanceRGBA_frag:MM,equirect_vert:bM,equirect_frag:SM,linedashed_vert:wM,linedashed_frag:EM,meshbasic_vert:TM,meshbasic_frag:AM,meshlambert_vert:RM,meshlambert_frag:PM,meshmatcap_vert:CM,meshmatcap_frag:LM,meshnormal_vert:DM,meshnormal_frag:kM,meshphong_vert:IM,meshphong_frag:zM,meshphysical_vert:FM,meshphysical_frag:UM,meshtoon_vert:NM,meshtoon_frag:OM,points_vert:BM,points_frag:HM,shadow_vert:GM,shadow_frag:VM,sprite_vert:XM,sprite_frag:WM},Vt={common:{diffuse:{value:new Qt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new de},alphaMap:{value:null},alphaMapTransform:{value:new de},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new de}},envmap:{envMap:{value:null},envMapRotation:{value:new de},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new de}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new de}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new de},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new de},normalScale:{value:new Wt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new de},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new de}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new de}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new de}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Qt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Qt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new de},alphaTest:{value:0},uvTransform:{value:new de}},sprite:{diffuse:{value:new Qt(16777215)},opacity:{value:1},center:{value:new Wt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new de},alphaMap:{value:null},alphaMapTransform:{value:new de},alphaTest:{value:0}}},_i={basic:{uniforms:kn([Vt.common,Vt.specularmap,Vt.envmap,Vt.aomap,Vt.lightmap,Vt.fog]),vertexShader:ue.meshbasic_vert,fragmentShader:ue.meshbasic_frag},lambert:{uniforms:kn([Vt.common,Vt.specularmap,Vt.envmap,Vt.aomap,Vt.lightmap,Vt.emissivemap,Vt.bumpmap,Vt.normalmap,Vt.displacementmap,Vt.fog,Vt.lights,{emissive:{value:new Qt(0)}}]),vertexShader:ue.meshlambert_vert,fragmentShader:ue.meshlambert_frag},phong:{uniforms:kn([Vt.common,Vt.specularmap,Vt.envmap,Vt.aomap,Vt.lightmap,Vt.emissivemap,Vt.bumpmap,Vt.normalmap,Vt.displacementmap,Vt.fog,Vt.lights,{emissive:{value:new Qt(0)},specular:{value:new Qt(1118481)},shininess:{value:30}}]),vertexShader:ue.meshphong_vert,fragmentShader:ue.meshphong_frag},standard:{uniforms:kn([Vt.common,Vt.envmap,Vt.aomap,Vt.lightmap,Vt.emissivemap,Vt.bumpmap,Vt.normalmap,Vt.displacementmap,Vt.roughnessmap,Vt.metalnessmap,Vt.fog,Vt.lights,{emissive:{value:new Qt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ue.meshphysical_vert,fragmentShader:ue.meshphysical_frag},toon:{uniforms:kn([Vt.common,Vt.aomap,Vt.lightmap,Vt.emissivemap,Vt.bumpmap,Vt.normalmap,Vt.displacementmap,Vt.gradientmap,Vt.fog,Vt.lights,{emissive:{value:new Qt(0)}}]),vertexShader:ue.meshtoon_vert,fragmentShader:ue.meshtoon_frag},matcap:{uniforms:kn([Vt.common,Vt.bumpmap,Vt.normalmap,Vt.displacementmap,Vt.fog,{matcap:{value:null}}]),vertexShader:ue.meshmatcap_vert,fragmentShader:ue.meshmatcap_frag},points:{uniforms:kn([Vt.points,Vt.fog]),vertexShader:ue.points_vert,fragmentShader:ue.points_frag},dashed:{uniforms:kn([Vt.common,Vt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ue.linedashed_vert,fragmentShader:ue.linedashed_frag},depth:{uniforms:kn([Vt.common,Vt.displacementmap]),vertexShader:ue.depth_vert,fragmentShader:ue.depth_frag},normal:{uniforms:kn([Vt.common,Vt.bumpmap,Vt.normalmap,Vt.displacementmap,{opacity:{value:1}}]),vertexShader:ue.meshnormal_vert,fragmentShader:ue.meshnormal_frag},sprite:{uniforms:kn([Vt.sprite,Vt.fog]),vertexShader:ue.sprite_vert,fragmentShader:ue.sprite_frag},background:{uniforms:{uvTransform:{value:new de},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ue.background_vert,fragmentShader:ue.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new de}},vertexShader:ue.backgroundCube_vert,fragmentShader:ue.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ue.cube_vert,fragmentShader:ue.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ue.equirect_vert,fragmentShader:ue.equirect_frag},distanceRGBA:{uniforms:kn([Vt.common,Vt.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ue.distanceRGBA_vert,fragmentShader:ue.distanceRGBA_frag},shadow:{uniforms:kn([Vt.lights,Vt.fog,{color:{value:new Qt(0)},opacity:{value:1}}]),vertexShader:ue.shadow_vert,fragmentShader:ue.shadow_frag}};_i.physical={uniforms:kn([_i.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new de},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new de},clearcoatNormalScale:{value:new Wt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new de},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new de},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new de},sheen:{value:0},sheenColor:{value:new Qt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new de},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new de},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new de},transmissionSamplerSize:{value:new Wt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new de},attenuationDistance:{value:0},attenuationColor:{value:new Qt(0)},specularColor:{value:new Qt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new de},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new de},anisotropyVector:{value:new Wt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new de}}]),vertexShader:ue.meshphysical_vert,fragmentShader:ue.meshphysical_frag};const Zo={r:0,b:0,g:0},xa=new wi,YM=new ze;function $M(n,t,e,i,a,s,o){const r=new Qt(0);let l=s===!0?0:1,c,h,u=null,d=0,f=null;function m(y){let x=y.isScene===!0?y.background:null;return x&&x.isTexture&&(x=(y.backgroundBlurriness>0?e:t).get(x)),x}function _(y){let x=!1;const v=m(y);v===null?p(r,l):v&&v.isColor&&(p(v,1),x=!0);const w=n.xr.getEnvironmentBlendMode();w==="additive"?i.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(y,x){const v=m(x);v&&(v.isCubeTexture||v.mapping===Nr)?(h===void 0&&(h=new me(new ui(1,1,1),new la({name:"BackgroundCubeMaterial",uniforms:Ts(_i.backgroundCube.uniforms),vertexShader:_i.backgroundCube.vertexShader,fragmentShader:_i.backgroundCube.fragmentShader,side:Bn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,S,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(h)),xa.copy(x.backgroundRotation),xa.x*=-1,xa.y*=-1,xa.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(xa.y*=-1,xa.z*=-1),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(YM.makeRotationFromEuler(xa)),h.material.toneMapped=Me.getTransfer(v.colorSpace)!==Le,(u!==v||d!==v.version||f!==n.toneMapping)&&(h.material.needsUpdate=!0,u=v,d=v.version,f=n.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new me(new Jn(2,2),new la({name:"BackgroundMaterial",uniforms:Ts(_i.background.uniforms),vertexShader:_i.background.vertexShader,fragmentShader:_i.background.fragmentShader,side:ca,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=Me.getTransfer(v.colorSpace)!==Le,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||d!==v.version||f!==n.toneMapping)&&(c.material.needsUpdate=!0,u=v,d=v.version,f=n.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function p(y,x){y.getRGB(Zo,lp(n)),i.buffers.color.setClear(Zo.r,Zo.g,Zo.b,x,o)}return{getClearColor:function(){return r},setClearColor:function(y,x=1){r.set(y),l=x,p(r,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,p(r,l)},render:_,addToRenderList:g}}function ZM(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},a=d(null);let s=a,o=!1;function r(M,P,L,F,O){let k=!1;const D=u(F,L,P);s!==D&&(s=D,c(s.object)),k=f(M,F,L,O),k&&m(M,F,L,O),O!==null&&t.update(O,n.ELEMENT_ARRAY_BUFFER),(k||o)&&(o=!1,v(M,P,L,F),O!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(O).buffer))}function l(){return n.createVertexArray()}function c(M){return n.bindVertexArray(M)}function h(M){return n.deleteVertexArray(M)}function u(M,P,L){const F=L.wireframe===!0;let O=i[M.id];O===void 0&&(O={},i[M.id]=O);let k=O[P.id];k===void 0&&(k={},O[P.id]=k);let D=k[F];return D===void 0&&(D=d(l()),k[F]=D),D}function d(M){const P=[],L=[],F=[];for(let O=0;O<e;O++)P[O]=0,L[O]=0,F[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:L,attributeDivisors:F,object:M,attributes:{},index:null}}function f(M,P,L,F){const O=s.attributes,k=P.attributes;let D=0;const U=L.getAttributes();for(const G in U)if(U[G].location>=0){const ot=O[G];let gt=k[G];if(gt===void 0&&(G==="instanceMatrix"&&M.instanceMatrix&&(gt=M.instanceMatrix),G==="instanceColor"&&M.instanceColor&&(gt=M.instanceColor)),ot===void 0||ot.attribute!==gt||gt&&ot.data!==gt.data)return!0;D++}return s.attributesNum!==D||s.index!==F}function m(M,P,L,F){const O={},k=P.attributes;let D=0;const U=L.getAttributes();for(const G in U)if(U[G].location>=0){let ot=k[G];ot===void 0&&(G==="instanceMatrix"&&M.instanceMatrix&&(ot=M.instanceMatrix),G==="instanceColor"&&M.instanceColor&&(ot=M.instanceColor));const gt={};gt.attribute=ot,ot&&ot.data&&(gt.data=ot.data),O[G]=gt,D++}s.attributes=O,s.attributesNum=D,s.index=F}function _(){const M=s.newAttributes;for(let P=0,L=M.length;P<L;P++)M[P]=0}function g(M){p(M,0)}function p(M,P){const L=s.newAttributes,F=s.enabledAttributes,O=s.attributeDivisors;L[M]=1,F[M]===0&&(n.enableVertexAttribArray(M),F[M]=1),O[M]!==P&&(n.vertexAttribDivisor(M,P),O[M]=P)}function y(){const M=s.newAttributes,P=s.enabledAttributes;for(let L=0,F=P.length;L<F;L++)P[L]!==M[L]&&(n.disableVertexAttribArray(L),P[L]=0)}function x(M,P,L,F,O,k,D){D===!0?n.vertexAttribIPointer(M,P,L,O,k):n.vertexAttribPointer(M,P,L,F,O,k)}function v(M,P,L,F){_();const O=F.attributes,k=L.getAttributes(),D=P.defaultAttributeValues;for(const U in k){const G=k[U];if(G.location>=0){let W=O[U];if(W===void 0&&(U==="instanceMatrix"&&M.instanceMatrix&&(W=M.instanceMatrix),U==="instanceColor"&&M.instanceColor&&(W=M.instanceColor)),W!==void 0){const ot=W.normalized,gt=W.itemSize,Mt=t.get(W);if(Mt===void 0)continue;const kt=Mt.buffer,Q=Mt.type,nt=Mt.bytesPerElement,ht=Q===n.INT||Q===n.UNSIGNED_INT||W.gpuType===mh;if(W.isInterleavedBufferAttribute){const q=W.data,J=q.stride,Z=W.offset;if(q.isInstancedInterleavedBuffer){for(let bt=0;bt<G.locationSize;bt++)p(G.location+bt,q.meshPerAttribute);M.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=q.meshPerAttribute*q.count)}else for(let bt=0;bt<G.locationSize;bt++)g(G.location+bt);n.bindBuffer(n.ARRAY_BUFFER,kt);for(let bt=0;bt<G.locationSize;bt++)x(G.location+bt,gt/G.locationSize,Q,ot,J*nt,(Z+gt/G.locationSize*bt)*nt,ht)}else{if(W.isInstancedBufferAttribute){for(let q=0;q<G.locationSize;q++)p(G.location+q,W.meshPerAttribute);M.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=W.meshPerAttribute*W.count)}else for(let q=0;q<G.locationSize;q++)g(G.location+q);n.bindBuffer(n.ARRAY_BUFFER,kt);for(let q=0;q<G.locationSize;q++)x(G.location+q,gt/G.locationSize,Q,ot,gt*nt,gt/G.locationSize*q*nt,ht)}}else if(D!==void 0){const ot=D[U];if(ot!==void 0)switch(ot.length){case 2:n.vertexAttrib2fv(G.location,ot);break;case 3:n.vertexAttrib3fv(G.location,ot);break;case 4:n.vertexAttrib4fv(G.location,ot);break;default:n.vertexAttrib1fv(G.location,ot)}}}}y()}function w(){T();for(const M in i){const P=i[M];for(const L in P){const F=P[L];for(const O in F)h(F[O].object),delete F[O];delete P[L]}delete i[M]}}function S(M){if(i[M.id]===void 0)return;const P=i[M.id];for(const L in P){const F=P[L];for(const O in F)h(F[O].object),delete F[O];delete P[L]}delete i[M.id]}function A(M){for(const P in i){const L=i[P];if(L[M.id]===void 0)continue;const F=L[M.id];for(const O in F)h(F[O].object),delete F[O];delete L[M.id]}}function T(){b(),o=!0,s!==a&&(s=a,c(s.object))}function b(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:r,reset:T,resetDefaultState:b,dispose:w,releaseStatesOfGeometry:S,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:g,disableUnusedAttributes:y}}function jM(n,t,e){let i;function a(c){i=c}function s(c,h){n.drawArrays(i,c,h),e.update(h,i,1)}function o(c,h,u){u!==0&&(n.drawArraysInstanced(i,c,h,u),e.update(h,i,u))}function r(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,u);let f=0;for(let m=0;m<u;m++)f+=h[m];e.update(f,i,1)}function l(c,h,u,d){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<c.length;m++)o(c[m],h[m],d[m]);else{f.multiDrawArraysInstancedWEBGL(i,c,0,h,0,d,0,u);let m=0;for(let _=0;_<u;_++)m+=h[_]*d[_];e.update(m,i,1)}}this.setMode=a,this.render=s,this.renderInstances=o,this.renderMultiDraw=r,this.renderMultiDrawInstances=l}function qM(n,t,e,i){let a;function s(){if(a!==void 0)return a;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");a=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function o(A){return!(A!==hi&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(A){const T=A===mo&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Gi&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Oi&&!T)}function l(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),x=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),w=m>0,S=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:r,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:m,maxTextureSize:_,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:y,maxVaryings:x,maxFragmentUniforms:v,vertexTextures:w,maxSamples:S}}function KM(n){const t=this;let e=null,i=0,a=!1,s=!1;const o=new ba,r=new de,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||i!==0||a;return a=d,i=u.length,f},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const m=u.clippingPlanes,_=u.clipIntersection,g=u.clipShadows,p=n.get(u);if(!a||m===null||m.length===0||s&&!g)s?h(null):c();else{const y=s?0:i,x=y*4;let v=p.clippingState||null;l.value=v,v=h(m,d,x,f);for(let w=0;w!==x;++w)v[w]=e[w];p.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,d,f,m){const _=u!==null?u.length:0;let g=null;if(_!==0){if(g=l.value,m!==!0||g===null){const p=f+_*4,y=d.matrixWorldInverse;r.getNormalMatrix(y),(g===null||g.length<p)&&(g=new Float32Array(p));for(let x=0,v=f;x!==_;++x,v+=4)o.copy(u[x]).applyMatrix4(y,r),o.normal.toArray(g,v),g[v+3]=o.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,g}}function JM(n){let t=new WeakMap;function e(o,r){return r===vl?o.mapping=bs:r===yl&&(o.mapping=Ss),o}function i(o){if(o&&o.isTexture){const r=o.mapping;if(r===vl||r===yl)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new ly(l.height);return c.fromEquirectangularTexture(n,o),t.set(o,c),o.addEventListener("dispose",a),e(c.texture,o.mapping)}else return null}}return o}function a(o){const r=o.target;r.removeEventListener("dispose",a);const l=t.get(r);l!==void 0&&(t.delete(r),l.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}class fp extends hp{constructor(t=-1,e=1,i=1,a=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=a,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,a,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let s=i-t,o=i+t,r=a+e,l=a-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,r-=h*this.view.offsetY,l=r-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,r,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const ds=4,fu=[.125,.215,.35,.446,.526,.582],Ta=20,Ic=new fp,pu=new Qt;let zc=null,Fc=0,Uc=0,Nc=!1;const Sa=(1+Math.sqrt(5))/2,as=1/Sa,mu=[new H(-Sa,as,0),new H(Sa,as,0),new H(-as,0,Sa),new H(as,0,Sa),new H(0,Sa,-as),new H(0,Sa,as),new H(-1,1,-1),new H(1,1,-1),new H(-1,1,1),new H(1,1,1)];class gu{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,a=100){zc=this._renderer.getRenderTarget(),Fc=this._renderer.getActiveCubeFace(),Uc=this._renderer.getActiveMipmapLevel(),Nc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,i,a,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=yu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=vu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(zc,Fc,Uc),this._renderer.xr.enabled=Nc,t.scissorTest=!1,jo(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===bs||t.mapping===Ss?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),zc=this._renderer.getRenderTarget(),Fc=this._renderer.getActiveCubeFace(),Uc=this._renderer.getActiveMipmapLevel(),Nc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Mi,minFilter:Mi,generateMipmaps:!1,type:mo,format:hi,colorSpace:As,depthBuffer:!1},a=xu(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=xu(t,e,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=QM(s)),this._blurMaterial=tb(s,t,e)}return a}_compileMaterial(t){const e=new me(this._lodPlanes[0],t);this._renderer.compile(e,Ic)}_sceneToCubeUV(t,e,i,a){const r=new Qn(90,1,e,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(pu),h.toneMapping=oa,h.autoClear=!1;const f=new en({name:"PMREM.Background",side:Bn,depthWrite:!1,depthTest:!1}),m=new me(new ui,f);let _=!1;const g=t.background;g?g.isColor&&(f.color.copy(g),t.background=null,_=!0):(f.color.copy(pu),_=!0);for(let p=0;p<6;p++){const y=p%3;y===0?(r.up.set(0,l[p],0),r.lookAt(c[p],0,0)):y===1?(r.up.set(0,0,l[p]),r.lookAt(0,c[p],0)):(r.up.set(0,l[p],0),r.lookAt(0,0,c[p]));const x=this._cubeSize;jo(a,y*x,p>2?x:0,x,x),h.setRenderTarget(a),_&&h.render(m,r),h.render(t,r)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=g}_textureToCubeUV(t,e){const i=this._renderer,a=t.mapping===bs||t.mapping===Ss;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=yu()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=vu());const s=a?this._cubemapMaterial:this._equirectMaterial,o=new me(this._lodPlanes[0],s),r=s.uniforms;r.envMap.value=t;const l=this._cubeSize;jo(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(o,Ic)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const a=this._lodPlanes.length;for(let s=1;s<a;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),r=mu[(a-s-1)%mu.length];this._blur(t,s-1,s,o,r)}e.autoClear=i}_blur(t,e,i,a,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,a,"latitudinal",s),this._halfBlur(o,t,i,i,a,"longitudinal",s)}_halfBlur(t,e,i,a,s,o,r){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new me(this._lodPlanes[a],c),d=c.uniforms,f=this._sizeLods[i]-1,m=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*Ta-1),_=s/m,g=isFinite(s)?1+Math.floor(h*_):Ta;g>Ta&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Ta}`);const p=[];let y=0;for(let A=0;A<Ta;++A){const T=A/_,b=Math.exp(-T*T/2);p.push(b),A===0?y+=b:A<g&&(y+=2*b)}for(let A=0;A<p.length;A++)p[A]=p[A]/y;d.envMap.value=t.texture,d.samples.value=g,d.weights.value=p,d.latitudinal.value=o==="latitudinal",r&&(d.poleAxis.value=r);const{_lodMax:x}=this;d.dTheta.value=m,d.mipInt.value=x-i;const v=this._sizeLods[a],w=3*v*(a>x-ds?a-x+ds:0),S=4*(this._cubeSize-v);jo(e,w,S,3*v,2*v),l.setRenderTarget(e),l.render(u,Ic)}}function QM(n){const t=[],e=[],i=[];let a=n;const s=n-ds+1+fu.length;for(let o=0;o<s;o++){const r=Math.pow(2,a);e.push(r);let l=1/r;o>n-ds?l=fu[o-n+ds-1]:o===0&&(l=0),i.push(l);const c=1/(r-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,m=6,_=3,g=2,p=1,y=new Float32Array(_*m*f),x=new Float32Array(g*m*f),v=new Float32Array(p*m*f);for(let S=0;S<f;S++){const A=S%3*2/3-1,T=S>2?0:-1,b=[A,T,0,A+2/3,T,0,A+2/3,T+1,0,A,T,0,A+2/3,T+1,0,A,T+1,0];y.set(b,_*m*S),x.set(d,g*m*S);const M=[S,S,S,S,S,S];v.set(M,p*m*S)}const w=new nn;w.setAttribute("position",new vn(y,_)),w.setAttribute("uv",new vn(x,g)),w.setAttribute("faceIndex",new vn(v,p)),t.push(w),a>ds&&a--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function xu(n,t,e){const i=new La(n,t,e);return i.texture.mapping=Nr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function jo(n,t,e,i,a){n.viewport.set(t,e,i,a),n.scissor.set(t,e,i,a)}function tb(n,t,e){const i=new Float32Array(Ta),a=new H(0,1,0);return new la({name:"SphericalGaussianBlur",defines:{n:Ta,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:Eh(),fragmentShader:`

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
		`,blending:sa,depthTest:!1,depthWrite:!1})}function vu(){return new la({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Eh(),fragmentShader:`

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
		`,blending:sa,depthTest:!1,depthWrite:!1})}function yu(){return new la({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Eh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:sa,depthTest:!1,depthWrite:!1})}function Eh(){return`

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
	`}function eb(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const l=r.mapping,c=l===vl||l===yl,h=l===bs||l===Ss;if(c||h){let u=t.get(r);const d=u!==void 0?u.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==d)return e===null&&(e=new gu(n)),u=c?e.fromEquirectangular(r,u):e.fromCubemap(r,u),u.texture.pmremVersion=r.pmremVersion,t.set(r,u),u.texture;if(u!==void 0)return u.texture;{const f=r.image;return c&&f&&f.height>0||h&&f&&a(f)?(e===null&&(e=new gu(n)),u=c?e.fromEquirectangular(r):e.fromCubemap(r),u.texture.pmremVersion=r.pmremVersion,t.set(r,u),r.addEventListener("dispose",s),u.texture):null}}}return r}function a(r){let l=0;const c=6;for(let h=0;h<c;h++)r[h]!==void 0&&l++;return l===c}function s(r){const l=r.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function nb(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let a;switch(i){case"WEBGL_depth_texture":a=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=n.getExtension(i)}return t[i]=a,a}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const a=e(i);return a===null&&Ws("THREE.WebGLRenderer: "+i+" extension not supported."),a}}}function ib(n,t,e,i){const a={},s=new WeakMap;function o(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const m in d.attributes)t.remove(d.attributes[m]);for(const m in d.morphAttributes){const _=d.morphAttributes[m];for(let g=0,p=_.length;g<p;g++)t.remove(_[g])}d.removeEventListener("dispose",o),delete a[d.id];const f=s.get(d);f&&(t.remove(f),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function r(u,d){return a[d.id]===!0||(d.addEventListener("dispose",o),a[d.id]=!0,e.memory.geometries++),d}function l(u){const d=u.attributes;for(const m in d)t.update(d[m],n.ARRAY_BUFFER);const f=u.morphAttributes;for(const m in f){const _=f[m];for(let g=0,p=_.length;g<p;g++)t.update(_[g],n.ARRAY_BUFFER)}}function c(u){const d=[],f=u.index,m=u.attributes.position;let _=0;if(f!==null){const y=f.array;_=f.version;for(let x=0,v=y.length;x<v;x+=3){const w=y[x+0],S=y[x+1],A=y[x+2];d.push(w,S,S,A,A,w)}}else if(m!==void 0){const y=m.array;_=m.version;for(let x=0,v=y.length/3-1;x<v;x+=3){const w=x+0,S=x+1,A=x+2;d.push(w,S,S,A,A,w)}}else return;const g=new(ip(d)?cp:rp)(d,1);g.version=_;const p=s.get(u);p&&t.remove(p),s.set(u,g)}function h(u){const d=s.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return s.get(u)}return{get:r,update:l,getWireframeAttribute:h}}function ab(n,t,e){let i;function a(d){i=d}let s,o;function r(d){s=d.type,o=d.bytesPerElement}function l(d,f){n.drawElements(i,f,s,d*o),e.update(f,i,1)}function c(d,f,m){m!==0&&(n.drawElementsInstanced(i,f,s,d*o,m),e.update(f,i,m))}function h(d,f,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,s,d,0,m);let g=0;for(let p=0;p<m;p++)g+=f[p];e.update(g,i,1)}function u(d,f,m,_){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<d.length;p++)c(d[p]/o,f[p],_[p]);else{g.multiDrawElementsInstancedWEBGL(i,f,0,s,d,0,_,0,m);let p=0;for(let y=0;y<m;y++)p+=f[y]*_[y];e.update(p,i,1)}}this.setMode=a,this.setIndex=r,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function sb(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,r){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=r*(s/3);break;case n.LINES:e.lines+=r*(s/2);break;case n.LINE_STRIP:e.lines+=r*(s-1);break;case n.LINE_LOOP:e.lines+=r*s;break;case n.POINTS:e.points+=r*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function a(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:a,update:i}}function ob(n,t,e){const i=new WeakMap,a=new qe;function s(o,r,l){const c=o.morphTargetInfluences,h=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,u=h!==void 0?h.length:0;let d=i.get(r);if(d===void 0||d.count!==u){let M=function(){T.dispose(),i.delete(r),r.removeEventListener("dispose",M)};var f=M;d!==void 0&&d.texture.dispose();const m=r.morphAttributes.position!==void 0,_=r.morphAttributes.normal!==void 0,g=r.morphAttributes.color!==void 0,p=r.morphAttributes.position||[],y=r.morphAttributes.normal||[],x=r.morphAttributes.color||[];let v=0;m===!0&&(v=1),_===!0&&(v=2),g===!0&&(v=3);let w=r.attributes.position.count*v,S=1;w>t.maxTextureSize&&(S=Math.ceil(w/t.maxTextureSize),w=t.maxTextureSize);const A=new Float32Array(w*S*4*u),T=new sp(A,w,S,u);T.type=Oi,T.needsUpdate=!0;const b=v*4;for(let P=0;P<u;P++){const L=p[P],F=y[P],O=x[P],k=w*S*4*P;for(let D=0;D<L.count;D++){const U=D*b;m===!0&&(a.fromBufferAttribute(L,D),A[k+U+0]=a.x,A[k+U+1]=a.y,A[k+U+2]=a.z,A[k+U+3]=0),_===!0&&(a.fromBufferAttribute(F,D),A[k+U+4]=a.x,A[k+U+5]=a.y,A[k+U+6]=a.z,A[k+U+7]=0),g===!0&&(a.fromBufferAttribute(O,D),A[k+U+8]=a.x,A[k+U+9]=a.y,A[k+U+10]=a.z,A[k+U+11]=O.itemSize===4?a.w:1)}}d={count:u,texture:T,size:new Wt(w,S)},i.set(r,d),r.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let m=0;for(let g=0;g<c.length;g++)m+=c[g];const _=r.morphTargetsRelative?1:1-m;l.getUniforms().setValue(n,"morphTargetBaseInfluence",_),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:s}}function rb(n,t,e,i){let a=new WeakMap;function s(l){const c=i.render.frame,h=l.geometry,u=t.get(l,h);if(a.get(u)!==c&&(t.update(u),a.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",r)===!1&&l.addEventListener("dispose",r),a.get(l)!==c&&(e.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,n.ARRAY_BUFFER),a.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;a.get(d)!==c&&(d.update(),a.set(d,c))}return u}function o(){a=new WeakMap}function r(l){const c=l.target;c.removeEventListener("dispose",r),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:s,dispose:o}}class pp extends zn{constructor(t,e,i,a,s,o,r,l,c,h=ms){if(h!==ms&&h!==Es)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===ms&&(i=Ca),i===void 0&&h===Es&&(i=ws),super(null,a,s,o,r,l,h,i,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:di,this.minFilter=l!==void 0?l:di,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const mp=new zn,_u=new pp(1,1),gp=new sp,xp=new $v,vp=new dp,Mu=[],bu=[],Su=new Float32Array(16),wu=new Float32Array(9),Eu=new Float32Array(4);function Ps(n,t,e){const i=n[0];if(i<=0||i>0)return n;const a=t*e;let s=Mu[a];if(s===void 0&&(s=new Float32Array(a),Mu[a]=s),t!==0){i.toArray(s,0);for(let o=1,r=0;o!==t;++o)r+=e,n[o].toArray(s,r)}return s}function cn(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function ln(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function Hr(n,t){let e=bu[t];e===void 0&&(e=new Int32Array(t),bu[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function cb(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function lb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(cn(e,t))return;n.uniform2fv(this.addr,t),ln(e,t)}}function hb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(cn(e,t))return;n.uniform3fv(this.addr,t),ln(e,t)}}function db(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(cn(e,t))return;n.uniform4fv(this.addr,t),ln(e,t)}}function ub(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(cn(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),ln(e,t)}else{if(cn(e,i))return;Eu.set(i),n.uniformMatrix2fv(this.addr,!1,Eu),ln(e,i)}}function fb(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(cn(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),ln(e,t)}else{if(cn(e,i))return;wu.set(i),n.uniformMatrix3fv(this.addr,!1,wu),ln(e,i)}}function pb(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(cn(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),ln(e,t)}else{if(cn(e,i))return;Su.set(i),n.uniformMatrix4fv(this.addr,!1,Su),ln(e,i)}}function mb(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function gb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(cn(e,t))return;n.uniform2iv(this.addr,t),ln(e,t)}}function xb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(cn(e,t))return;n.uniform3iv(this.addr,t),ln(e,t)}}function vb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(cn(e,t))return;n.uniform4iv(this.addr,t),ln(e,t)}}function yb(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function _b(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(cn(e,t))return;n.uniform2uiv(this.addr,t),ln(e,t)}}function Mb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(cn(e,t))return;n.uniform3uiv(this.addr,t),ln(e,t)}}function bb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(cn(e,t))return;n.uniform4uiv(this.addr,t),ln(e,t)}}function Sb(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a);let s;this.type===n.SAMPLER_2D_SHADOW?(_u.compareFunction=np,s=_u):s=mp,e.setTexture2D(t||s,a)}function wb(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture3D(t||xp,a)}function Eb(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTextureCube(t||vp,a)}function Tb(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture2DArray(t||gp,a)}function Ab(n){switch(n){case 5126:return cb;case 35664:return lb;case 35665:return hb;case 35666:return db;case 35674:return ub;case 35675:return fb;case 35676:return pb;case 5124:case 35670:return mb;case 35667:case 35671:return gb;case 35668:case 35672:return xb;case 35669:case 35673:return vb;case 5125:return yb;case 36294:return _b;case 36295:return Mb;case 36296:return bb;case 35678:case 36198:case 36298:case 36306:case 35682:return Sb;case 35679:case 36299:case 36307:return wb;case 35680:case 36300:case 36308:case 36293:return Eb;case 36289:case 36303:case 36311:case 36292:return Tb}}function Rb(n,t){n.uniform1fv(this.addr,t)}function Pb(n,t){const e=Ps(t,this.size,2);n.uniform2fv(this.addr,e)}function Cb(n,t){const e=Ps(t,this.size,3);n.uniform3fv(this.addr,e)}function Lb(n,t){const e=Ps(t,this.size,4);n.uniform4fv(this.addr,e)}function Db(n,t){const e=Ps(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function kb(n,t){const e=Ps(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function Ib(n,t){const e=Ps(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function zb(n,t){n.uniform1iv(this.addr,t)}function Fb(n,t){n.uniform2iv(this.addr,t)}function Ub(n,t){n.uniform3iv(this.addr,t)}function Nb(n,t){n.uniform4iv(this.addr,t)}function Ob(n,t){n.uniform1uiv(this.addr,t)}function Bb(n,t){n.uniform2uiv(this.addr,t)}function Hb(n,t){n.uniform3uiv(this.addr,t)}function Gb(n,t){n.uniform4uiv(this.addr,t)}function Vb(n,t,e){const i=this.cache,a=t.length,s=Hr(e,a);cn(i,s)||(n.uniform1iv(this.addr,s),ln(i,s));for(let o=0;o!==a;++o)e.setTexture2D(t[o]||mp,s[o])}function Xb(n,t,e){const i=this.cache,a=t.length,s=Hr(e,a);cn(i,s)||(n.uniform1iv(this.addr,s),ln(i,s));for(let o=0;o!==a;++o)e.setTexture3D(t[o]||xp,s[o])}function Wb(n,t,e){const i=this.cache,a=t.length,s=Hr(e,a);cn(i,s)||(n.uniform1iv(this.addr,s),ln(i,s));for(let o=0;o!==a;++o)e.setTextureCube(t[o]||vp,s[o])}function Yb(n,t,e){const i=this.cache,a=t.length,s=Hr(e,a);cn(i,s)||(n.uniform1iv(this.addr,s),ln(i,s));for(let o=0;o!==a;++o)e.setTexture2DArray(t[o]||gp,s[o])}function $b(n){switch(n){case 5126:return Rb;case 35664:return Pb;case 35665:return Cb;case 35666:return Lb;case 35674:return Db;case 35675:return kb;case 35676:return Ib;case 5124:case 35670:return zb;case 35667:case 35671:return Fb;case 35668:case 35672:return Ub;case 35669:case 35673:return Nb;case 5125:return Ob;case 36294:return Bb;case 36295:return Hb;case 36296:return Gb;case 35678:case 36198:case 36298:case 36306:case 35682:return Vb;case 35679:case 36299:case 36307:return Xb;case 35680:case 36300:case 36308:case 36293:return Wb;case 36289:case 36303:case 36311:case 36292:return Yb}}class Zb{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=Ab(e.type)}}class jb{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=$b(e.type)}}class qb{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const a=this.seq;for(let s=0,o=a.length;s!==o;++s){const r=a[s];r.setValue(t,e[r.id],i)}}}const Oc=/(\w+)(\])?(\[|\.)?/g;function Tu(n,t){n.seq.push(t),n.map[t.id]=t}function Kb(n,t,e){const i=n.name,a=i.length;for(Oc.lastIndex=0;;){const s=Oc.exec(i),o=Oc.lastIndex;let r=s[1];const l=s[2]==="]",c=s[3];if(l&&(r=r|0),c===void 0||c==="["&&o+2===a){Tu(e,c===void 0?new Zb(r,n,t):new jb(r,n,t));break}else{let u=e.map[r];u===void 0&&(u=new qb(r),Tu(e,u)),e=u}}}class mr{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const s=t.getActiveUniform(e,a),o=t.getUniformLocation(e,s.name);Kb(s,o,this)}}setValue(t,e,i,a){const s=this.map[e];s!==void 0&&s.setValue(t,i,a)}setOptional(t,e,i){const a=e[i];a!==void 0&&this.setValue(t,i,a)}static upload(t,e,i,a){for(let s=0,o=e.length;s!==o;++s){const r=e[s],l=i[r.id];l.needsUpdate!==!1&&r.setValue(t,l.value,a)}}static seqWithValue(t,e){const i=[];for(let a=0,s=t.length;a!==s;++a){const o=t[a];o.id in e&&i.push(o)}return i}}function Au(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const Jb=37297;let Qb=0;function t1(n,t){const e=n.split(`
`),i=[],a=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=a;o<s;o++){const r=o+1;i.push(`${r===t?">":" "} ${r}: ${e[o]}`)}return i.join(`
`)}const Ru=new de;function e1(n){Me._getMatrix(Ru,Me.workingColorSpace,n);const t=`mat3( ${Ru.elements.map(e=>e.toFixed(4))} )`;switch(Me.getTransfer(n)){case Or:return[t,"LinearTransferOETF"];case Le:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Pu(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),a=n.getShaderInfoLog(t).trim();if(i&&a==="")return"";const s=/ERROR: 0:(\d+)/.exec(a);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+a+`

`+t1(n.getShaderSource(t),o)}else return a}function n1(n,t){const e=e1(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function i1(n,t){let e;switch(t){case sv:e="Linear";break;case ov:e="Reinhard";break;case rv:e="Cineon";break;case cv:e="ACESFilmic";break;case hv:e="AgX";break;case dv:e="Neutral";break;case lv:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const qo=new H;function a1(){Me.getLuminanceCoefficients(qo);const n=qo.x.toFixed(4),t=qo.y.toFixed(4),e=qo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function s1(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ys).join(`
`)}function o1(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function r1(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let a=0;a<i;a++){const s=n.getActiveAttrib(t,a),o=s.name;let r=1;s.type===n.FLOAT_MAT2&&(r=2),s.type===n.FLOAT_MAT3&&(r=3),s.type===n.FLOAT_MAT4&&(r=4),e[o]={type:s.type,location:n.getAttribLocation(t,o),locationSize:r}}return e}function Ys(n){return n!==""}function Cu(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Lu(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const c1=/^[ \t]*#include +<([\w\d./]+)>/gm;function jl(n){return n.replace(c1,h1)}const l1=new Map;function h1(n,t){let e=ue[t];if(e===void 0){const i=l1.get(t);if(i!==void 0)e=ue[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return jl(e)}const d1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Du(n){return n.replace(d1,u1)}function u1(n,t,e,i){let a="";for(let s=parseInt(t);s<parseInt(e);s++)a+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return a}function ku(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function f1(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Gf?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===Vf?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Fi&&(t="SHADOWMAP_TYPE_VSM"),t}function p1(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case bs:case Ss:t="ENVMAP_TYPE_CUBE";break;case Nr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function m1(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Ss:t="ENVMAP_MODE_REFRACTION";break}return t}function g1(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case ph:t="ENVMAP_BLENDING_MULTIPLY";break;case iv:t="ENVMAP_BLENDING_MIX";break;case av:t="ENVMAP_BLENDING_ADD";break}return t}function x1(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function v1(n,t,e,i){const a=n.getContext(),s=e.defines;let o=e.vertexShader,r=e.fragmentShader;const l=f1(e),c=p1(e),h=m1(e),u=g1(e),d=x1(e),f=s1(e),m=o1(s),_=a.createProgram();let g,p,y=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Ys).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Ys).join(`
`),p.length>0&&(p+=`
`)):(g=[ku(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ys).join(`
`),p=[ku(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==oa?"#define TONE_MAPPING":"",e.toneMapping!==oa?ue.tonemapping_pars_fragment:"",e.toneMapping!==oa?i1("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ue.colorspace_pars_fragment,n1("linearToOutputTexel",e.outputColorSpace),a1(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ys).join(`
`)),o=jl(o),o=Cu(o,e),o=Lu(o,e),r=jl(r),r=Cu(r,e),r=Lu(r,e),o=Du(o),r=Du(r),e.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===Xd?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Xd?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=y+g+o,v=y+p+r,w=Au(a,a.VERTEX_SHADER,x),S=Au(a,a.FRAGMENT_SHADER,v);a.attachShader(_,w),a.attachShader(_,S),e.index0AttributeName!==void 0?a.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&a.bindAttribLocation(_,0,"position"),a.linkProgram(_);function A(P){if(n.debug.checkShaderErrors){const L=a.getProgramInfoLog(_).trim(),F=a.getShaderInfoLog(w).trim(),O=a.getShaderInfoLog(S).trim();let k=!0,D=!0;if(a.getProgramParameter(_,a.LINK_STATUS)===!1)if(k=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(a,_,w,S);else{const U=Pu(a,w,"vertex"),G=Pu(a,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(_,a.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+L+`
`+U+`
`+G)}else L!==""?console.warn("THREE.WebGLProgram: Program Info Log:",L):(F===""||O==="")&&(D=!1);D&&(P.diagnostics={runnable:k,programLog:L,vertexShader:{log:F,prefix:g},fragmentShader:{log:O,prefix:p}})}a.deleteShader(w),a.deleteShader(S),T=new mr(a,_),b=r1(a,_)}let T;this.getUniforms=function(){return T===void 0&&A(this),T};let b;this.getAttributes=function(){return b===void 0&&A(this),b};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=a.getProgramParameter(_,Jb)),M},this.destroy=function(){i.releaseStatesOfProgram(this),a.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Qb++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=w,this.fragmentShader=S,this}let y1=0;class _1{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,a=this._getShaderStage(e),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(a)===!1&&(o.add(a),a.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new M1(t),e.set(t,i)),i}}class M1{constructor(t){this.id=y1++,this.code=t,this.usedTimes=0}}function b1(n,t,e,i,a,s,o){const r=new Sh,l=new _1,c=new Set,h=[],u=a.logarithmicDepthBuffer,d=a.vertexTextures;let f=a.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return c.add(b),b===0?"uv":`uv${b}`}function g(b,M,P,L,F){const O=L.fog,k=F.geometry,D=b.isMeshStandardMaterial?L.environment:null,U=(b.isMeshStandardMaterial?e:t).get(b.envMap||D),G=U&&U.mapping===Nr?U.image.height:null,W=m[b.type];b.precision!==null&&(f=a.getMaxPrecision(b.precision),f!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",f,"instead."));const ot=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,gt=ot!==void 0?ot.length:0;let Mt=0;k.morphAttributes.position!==void 0&&(Mt=1),k.morphAttributes.normal!==void 0&&(Mt=2),k.morphAttributes.color!==void 0&&(Mt=3);let kt,Q,nt,ht;if(W){const te=_i[W];kt=te.vertexShader,Q=te.fragmentShader}else kt=b.vertexShader,Q=b.fragmentShader,l.update(b),nt=l.getVertexShaderID(b),ht=l.getFragmentShaderID(b);const q=n.getRenderTarget(),J=n.state.buffers.depth.getReversed(),Z=F.isInstancedMesh===!0,bt=F.isBatchedMesh===!0,zt=!!b.map,Dt=!!b.matcap,Ut=!!U,V=!!b.aoMap,ne=!!b.lightMap,Ht=!!b.bumpMap,Lt=!!b.normalMap,xt=!!b.displacementMap,Ft=!!b.emissiveMap,Bt=!!b.metalnessMap,z=!!b.roughnessMap,R=b.anisotropy>0,j=b.clearcoat>0,dt=b.dispersion>0,tt=b.iridescence>0,ct=b.sheen>0,It=b.transmission>0,et=R&&!!b.anisotropyMap,ft=j&&!!b.clearcoatMap,Nt=j&&!!b.clearcoatNormalMap,rt=j&&!!b.clearcoatRoughnessMap,wt=tt&&!!b.iridescenceMap,B=tt&&!!b.iridescenceThicknessMap,lt=ct&&!!b.sheenColorMap,vt=ct&&!!b.sheenRoughnessMap,Xt=!!b.specularMap,Gt=!!b.specularColorMap,$t=!!b.specularIntensityMap,N=It&&!!b.transmissionMap,Rt=It&&!!b.thicknessMap,it=!!b.gradientMap,ut=!!b.alphaMap,Pt=b.alphaTest>0,At=!!b.alphaHash,qt=!!b.extensions;let ee=oa;b.toneMapped&&(q===null||q.isXRRenderTarget===!0)&&(ee=n.toneMapping);const re={shaderID:W,shaderType:b.type,shaderName:b.name,vertexShader:kt,fragmentShader:Q,defines:b.defines,customVertexShaderID:nt,customFragmentShaderID:ht,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:f,batching:bt,batchingColor:bt&&F._colorsTexture!==null,instancing:Z,instancingColor:Z&&F.instanceColor!==null,instancingMorph:Z&&F.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:q===null?n.outputColorSpace:q.isXRRenderTarget===!0?q.texture.colorSpace:As,alphaToCoverage:!!b.alphaToCoverage,map:zt,matcap:Dt,envMap:Ut,envMapMode:Ut&&U.mapping,envMapCubeUVHeight:G,aoMap:V,lightMap:ne,bumpMap:Ht,normalMap:Lt,displacementMap:d&&xt,emissiveMap:Ft,normalMapObjectSpace:Lt&&b.normalMapType===mv,normalMapTangentSpace:Lt&&b.normalMapType===ep,metalnessMap:Bt,roughnessMap:z,anisotropy:R,anisotropyMap:et,clearcoat:j,clearcoatMap:ft,clearcoatNormalMap:Nt,clearcoatRoughnessMap:rt,dispersion:dt,iridescence:tt,iridescenceMap:wt,iridescenceThicknessMap:B,sheen:ct,sheenColorMap:lt,sheenRoughnessMap:vt,specularMap:Xt,specularColorMap:Gt,specularIntensityMap:$t,transmission:It,transmissionMap:N,thicknessMap:Rt,gradientMap:it,opaque:b.transparent===!1&&b.blending===ps&&b.alphaToCoverage===!1,alphaMap:ut,alphaTest:Pt,alphaHash:At,combine:b.combine,mapUv:zt&&_(b.map.channel),aoMapUv:V&&_(b.aoMap.channel),lightMapUv:ne&&_(b.lightMap.channel),bumpMapUv:Ht&&_(b.bumpMap.channel),normalMapUv:Lt&&_(b.normalMap.channel),displacementMapUv:xt&&_(b.displacementMap.channel),emissiveMapUv:Ft&&_(b.emissiveMap.channel),metalnessMapUv:Bt&&_(b.metalnessMap.channel),roughnessMapUv:z&&_(b.roughnessMap.channel),anisotropyMapUv:et&&_(b.anisotropyMap.channel),clearcoatMapUv:ft&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:Nt&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:rt&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:wt&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:B&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:lt&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:vt&&_(b.sheenRoughnessMap.channel),specularMapUv:Xt&&_(b.specularMap.channel),specularColorMapUv:Gt&&_(b.specularColorMap.channel),specularIntensityMapUv:$t&&_(b.specularIntensityMap.channel),transmissionMapUv:N&&_(b.transmissionMap.channel),thicknessMapUv:Rt&&_(b.thicknessMap.channel),alphaMapUv:ut&&_(b.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(Lt||R),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!k.attributes.uv&&(zt||ut),fog:!!O,useFog:b.fog===!0,fogExp2:!!O&&O.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:J,skinning:F.isSkinnedMesh===!0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:gt,morphTextureStride:Mt,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:ee,decodeVideoTexture:zt&&b.map.isVideoTexture===!0&&Me.getTransfer(b.map.colorSpace)===Le,decodeVideoTextureEmissive:Ft&&b.emissiveMap.isVideoTexture===!0&&Me.getTransfer(b.emissiveMap.colorSpace)===Le,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Oe,flipSided:b.side===Bn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:qt&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(qt&&b.extensions.multiDraw===!0||bt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return re.vertexUv1s=c.has(1),re.vertexUv2s=c.has(2),re.vertexUv3s=c.has(3),c.clear(),re}function p(b){const M=[];if(b.shaderID?M.push(b.shaderID):(M.push(b.customVertexShaderID),M.push(b.customFragmentShaderID)),b.defines!==void 0)for(const P in b.defines)M.push(P),M.push(b.defines[P]);return b.isRawShaderMaterial===!1&&(y(M,b),x(M,b),M.push(n.outputColorSpace)),M.push(b.customProgramCacheKey),M.join()}function y(b,M){b.push(M.precision),b.push(M.outputColorSpace),b.push(M.envMapMode),b.push(M.envMapCubeUVHeight),b.push(M.mapUv),b.push(M.alphaMapUv),b.push(M.lightMapUv),b.push(M.aoMapUv),b.push(M.bumpMapUv),b.push(M.normalMapUv),b.push(M.displacementMapUv),b.push(M.emissiveMapUv),b.push(M.metalnessMapUv),b.push(M.roughnessMapUv),b.push(M.anisotropyMapUv),b.push(M.clearcoatMapUv),b.push(M.clearcoatNormalMapUv),b.push(M.clearcoatRoughnessMapUv),b.push(M.iridescenceMapUv),b.push(M.iridescenceThicknessMapUv),b.push(M.sheenColorMapUv),b.push(M.sheenRoughnessMapUv),b.push(M.specularMapUv),b.push(M.specularColorMapUv),b.push(M.specularIntensityMapUv),b.push(M.transmissionMapUv),b.push(M.thicknessMapUv),b.push(M.combine),b.push(M.fogExp2),b.push(M.sizeAttenuation),b.push(M.morphTargetsCount),b.push(M.morphAttributeCount),b.push(M.numDirLights),b.push(M.numPointLights),b.push(M.numSpotLights),b.push(M.numSpotLightMaps),b.push(M.numHemiLights),b.push(M.numRectAreaLights),b.push(M.numDirLightShadows),b.push(M.numPointLightShadows),b.push(M.numSpotLightShadows),b.push(M.numSpotLightShadowsWithMaps),b.push(M.numLightProbes),b.push(M.shadowMapType),b.push(M.toneMapping),b.push(M.numClippingPlanes),b.push(M.numClipIntersection),b.push(M.depthPacking)}function x(b,M){r.disableAll(),M.supportsVertexTextures&&r.enable(0),M.instancing&&r.enable(1),M.instancingColor&&r.enable(2),M.instancingMorph&&r.enable(3),M.matcap&&r.enable(4),M.envMap&&r.enable(5),M.normalMapObjectSpace&&r.enable(6),M.normalMapTangentSpace&&r.enable(7),M.clearcoat&&r.enable(8),M.iridescence&&r.enable(9),M.alphaTest&&r.enable(10),M.vertexColors&&r.enable(11),M.vertexAlphas&&r.enable(12),M.vertexUv1s&&r.enable(13),M.vertexUv2s&&r.enable(14),M.vertexUv3s&&r.enable(15),M.vertexTangents&&r.enable(16),M.anisotropy&&r.enable(17),M.alphaHash&&r.enable(18),M.batching&&r.enable(19),M.dispersion&&r.enable(20),M.batchingColor&&r.enable(21),b.push(r.mask),r.disableAll(),M.fog&&r.enable(0),M.useFog&&r.enable(1),M.flatShading&&r.enable(2),M.logarithmicDepthBuffer&&r.enable(3),M.reverseDepthBuffer&&r.enable(4),M.skinning&&r.enable(5),M.morphTargets&&r.enable(6),M.morphNormals&&r.enable(7),M.morphColors&&r.enable(8),M.premultipliedAlpha&&r.enable(9),M.shadowMapEnabled&&r.enable(10),M.doubleSided&&r.enable(11),M.flipSided&&r.enable(12),M.useDepthPacking&&r.enable(13),M.dithering&&r.enable(14),M.transmission&&r.enable(15),M.sheen&&r.enable(16),M.opaque&&r.enable(17),M.pointsUvs&&r.enable(18),M.decodeVideoTexture&&r.enable(19),M.decodeVideoTextureEmissive&&r.enable(20),M.alphaToCoverage&&r.enable(21),b.push(r.mask)}function v(b){const M=m[b.type];let P;if(M){const L=_i[M];P=sy.clone(L.uniforms)}else P=b.uniforms;return P}function w(b,M){let P;for(let L=0,F=h.length;L<F;L++){const O=h[L];if(O.cacheKey===M){P=O,++P.usedTimes;break}}return P===void 0&&(P=new v1(n,M,b,s),h.push(P)),P}function S(b){if(--b.usedTimes===0){const M=h.indexOf(b);h[M]=h[h.length-1],h.pop(),b.destroy()}}function A(b){l.remove(b)}function T(){l.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:v,acquireProgram:w,releaseProgram:S,releaseShaderCache:A,programs:h,dispose:T}}function S1(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let r=n.get(o);return r===void 0&&(r={},n.set(o,r)),r}function i(o){n.delete(o)}function a(o,r,l){n.get(o)[r]=l}function s(){n=new WeakMap}return{has:t,get:e,remove:i,update:a,dispose:s}}function w1(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Iu(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function zu(){const n=[];let t=0;const e=[],i=[],a=[];function s(){t=0,e.length=0,i.length=0,a.length=0}function o(u,d,f,m,_,g){let p=n[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:m,renderOrder:u.renderOrder,z:_,group:g},n[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=m,p.renderOrder=u.renderOrder,p.z=_,p.group=g),t++,p}function r(u,d,f,m,_,g){const p=o(u,d,f,m,_,g);f.transmission>0?i.push(p):f.transparent===!0?a.push(p):e.push(p)}function l(u,d,f,m,_,g){const p=o(u,d,f,m,_,g);f.transmission>0?i.unshift(p):f.transparent===!0?a.unshift(p):e.unshift(p)}function c(u,d){e.length>1&&e.sort(u||w1),i.length>1&&i.sort(d||Iu),a.length>1&&a.sort(d||Iu)}function h(){for(let u=t,d=n.length;u<d;u++){const f=n[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:i,transparent:a,init:s,push:r,unshift:l,finish:h,sort:c}}function E1(){let n=new WeakMap;function t(i,a){const s=n.get(i);let o;return s===void 0?(o=new zu,n.set(i,[o])):a>=s.length?(o=new zu,s.push(o)):o=s[a],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function T1(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new H,color:new Qt};break;case"SpotLight":e={position:new H,direction:new H,color:new Qt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new H,color:new Qt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new H,skyColor:new Qt,groundColor:new Qt};break;case"RectAreaLight":e={color:new Qt,position:new H,halfWidth:new H,halfHeight:new H};break}return n[t.id]=e,e}}}function A1(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let R1=0;function P1(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function C1(n){const t=new T1,e=A1(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new H);const a=new H,s=new ze,o=new ze;function r(c){let h=0,u=0,d=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let f=0,m=0,_=0,g=0,p=0,y=0,x=0,v=0,w=0,S=0,A=0;c.sort(P1);for(let b=0,M=c.length;b<M;b++){const P=c[b],L=P.color,F=P.intensity,O=P.distance,k=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=L.r*F,u+=L.g*F,d+=L.b*F;else if(P.isLightProbe){for(let D=0;D<9;D++)i.probe[D].addScaledVector(P.sh.coefficients[D],F);A++}else if(P.isDirectionalLight){const D=t.get(P);if(D.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const U=P.shadow,G=e.get(P);G.shadowIntensity=U.intensity,G.shadowBias=U.bias,G.shadowNormalBias=U.normalBias,G.shadowRadius=U.radius,G.shadowMapSize=U.mapSize,i.directionalShadow[f]=G,i.directionalShadowMap[f]=k,i.directionalShadowMatrix[f]=P.shadow.matrix,y++}i.directional[f]=D,f++}else if(P.isSpotLight){const D=t.get(P);D.position.setFromMatrixPosition(P.matrixWorld),D.color.copy(L).multiplyScalar(F),D.distance=O,D.coneCos=Math.cos(P.angle),D.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),D.decay=P.decay,i.spot[_]=D;const U=P.shadow;if(P.map&&(i.spotLightMap[w]=P.map,w++,U.updateMatrices(P),P.castShadow&&S++),i.spotLightMatrix[_]=U.matrix,P.castShadow){const G=e.get(P);G.shadowIntensity=U.intensity,G.shadowBias=U.bias,G.shadowNormalBias=U.normalBias,G.shadowRadius=U.radius,G.shadowMapSize=U.mapSize,i.spotShadow[_]=G,i.spotShadowMap[_]=k,v++}_++}else if(P.isRectAreaLight){const D=t.get(P);D.color.copy(L).multiplyScalar(F),D.halfWidth.set(P.width*.5,0,0),D.halfHeight.set(0,P.height*.5,0),i.rectArea[g]=D,g++}else if(P.isPointLight){const D=t.get(P);if(D.color.copy(P.color).multiplyScalar(P.intensity),D.distance=P.distance,D.decay=P.decay,P.castShadow){const U=P.shadow,G=e.get(P);G.shadowIntensity=U.intensity,G.shadowBias=U.bias,G.shadowNormalBias=U.normalBias,G.shadowRadius=U.radius,G.shadowMapSize=U.mapSize,G.shadowCameraNear=U.camera.near,G.shadowCameraFar=U.camera.far,i.pointShadow[m]=G,i.pointShadowMap[m]=k,i.pointShadowMatrix[m]=P.shadow.matrix,x++}i.point[m]=D,m++}else if(P.isHemisphereLight){const D=t.get(P);D.skyColor.copy(P.color).multiplyScalar(F),D.groundColor.copy(P.groundColor).multiplyScalar(F),i.hemi[p]=D,p++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Vt.LTC_FLOAT_1,i.rectAreaLTC2=Vt.LTC_FLOAT_2):(i.rectAreaLTC1=Vt.LTC_HALF_1,i.rectAreaLTC2=Vt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=d;const T=i.hash;(T.directionalLength!==f||T.pointLength!==m||T.spotLength!==_||T.rectAreaLength!==g||T.hemiLength!==p||T.numDirectionalShadows!==y||T.numPointShadows!==x||T.numSpotShadows!==v||T.numSpotMaps!==w||T.numLightProbes!==A)&&(i.directional.length=f,i.spot.length=_,i.rectArea.length=g,i.point.length=m,i.hemi.length=p,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=v+w-S,i.spotLightMap.length=w,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=A,T.directionalLength=f,T.pointLength=m,T.spotLength=_,T.rectAreaLength=g,T.hemiLength=p,T.numDirectionalShadows=y,T.numPointShadows=x,T.numSpotShadows=v,T.numSpotMaps=w,T.numLightProbes=A,i.version=R1++)}function l(c,h){let u=0,d=0,f=0,m=0,_=0;const g=h.matrixWorldInverse;for(let p=0,y=c.length;p<y;p++){const x=c[p];if(x.isDirectionalLight){const v=i.directional[u];v.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(a),v.direction.transformDirection(g),u++}else if(x.isSpotLight){const v=i.spot[f];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(g),v.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(a),v.direction.transformDirection(g),f++}else if(x.isRectAreaLight){const v=i.rectArea[m];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(g),o.identity(),s.copy(x.matrixWorld),s.premultiply(g),o.extractRotation(s),v.halfWidth.set(x.width*.5,0,0),v.halfHeight.set(0,x.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),m++}else if(x.isPointLight){const v=i.point[d];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(g),d++}else if(x.isHemisphereLight){const v=i.hemi[_];v.direction.setFromMatrixPosition(x.matrixWorld),v.direction.transformDirection(g),_++}}}return{setup:r,setupView:l,state:i}}function Fu(n){const t=new C1(n),e=[],i=[];function a(h){c.camera=h,e.length=0,i.length=0}function s(h){e.push(h)}function o(h){i.push(h)}function r(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:a,state:c,setupLights:r,setupLightsView:l,pushLight:s,pushShadow:o}}function L1(n){let t=new WeakMap;function e(a,s=0){const o=t.get(a);let r;return o===void 0?(r=new Fu(n),t.set(a,[r])):s>=o.length?(r=new Fu(n),o.push(r)):r=o[s],r}function i(){t=new WeakMap}return{get:e,dispose:i}}class D1 extends ka{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=fv,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class k1 extends ka{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const I1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,z1=`uniform sampler2D shadow_pass;
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
}`;function F1(n,t,e){let i=new wh;const a=new Wt,s=new Wt,o=new qe,r=new D1({depthPacking:pv}),l=new k1,c={},h=e.maxTextureSize,u={[ca]:Bn,[Bn]:ca,[Oe]:Oe},d=new la({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Wt},radius:{value:4}},vertexShader:I1,fragmentShader:z1}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const m=new nn;m.setAttribute("position",new vn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new me(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Gf;let p=this.type;this.render=function(S,A,T){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||S.length===0)return;const b=n.getRenderTarget(),M=n.getActiveCubeFace(),P=n.getActiveMipmapLevel(),L=n.state;L.setBlending(sa),L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);const F=p!==Fi&&this.type===Fi,O=p===Fi&&this.type!==Fi;for(let k=0,D=S.length;k<D;k++){const U=S[k],G=U.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",U,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;a.copy(G.mapSize);const W=G.getFrameExtents();if(a.multiply(W),s.copy(G.mapSize),(a.x>h||a.y>h)&&(a.x>h&&(s.x=Math.floor(h/W.x),a.x=s.x*W.x,G.mapSize.x=s.x),a.y>h&&(s.y=Math.floor(h/W.y),a.y=s.y*W.y,G.mapSize.y=s.y)),G.map===null||F===!0||O===!0){const gt=this.type!==Fi?{minFilter:di,magFilter:di}:{};G.map!==null&&G.map.dispose(),G.map=new La(a.x,a.y,gt),G.map.texture.name=U.name+".shadowMap",G.camera.updateProjectionMatrix()}n.setRenderTarget(G.map),n.clear();const ot=G.getViewportCount();for(let gt=0;gt<ot;gt++){const Mt=G.getViewport(gt);o.set(s.x*Mt.x,s.y*Mt.y,s.x*Mt.z,s.y*Mt.w),L.viewport(o),G.updateMatrices(U,gt),i=G.getFrustum(),v(A,T,G.camera,U,this.type)}G.isPointLightShadow!==!0&&this.type===Fi&&y(G,T),G.needsUpdate=!1}p=this.type,g.needsUpdate=!1,n.setRenderTarget(b,M,P)};function y(S,A){const T=t.update(_);d.defines.VSM_SAMPLES!==S.blurSamples&&(d.defines.VSM_SAMPLES=S.blurSamples,f.defines.VSM_SAMPLES=S.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new La(a.x,a.y)),d.uniforms.shadow_pass.value=S.map.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,n.setRenderTarget(S.mapPass),n.clear(),n.renderBufferDirect(A,null,T,d,_,null),f.uniforms.shadow_pass.value=S.mapPass.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,n.setRenderTarget(S.map),n.clear(),n.renderBufferDirect(A,null,T,f,_,null)}function x(S,A,T,b){let M=null;const P=T.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(P!==void 0)M=P;else if(M=T.isPointLight===!0?l:r,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const L=M.uuid,F=A.uuid;let O=c[L];O===void 0&&(O={},c[L]=O);let k=O[F];k===void 0&&(k=M.clone(),O[F]=k,A.addEventListener("dispose",w)),M=k}if(M.visible=A.visible,M.wireframe=A.wireframe,b===Fi?M.side=A.shadowSide!==null?A.shadowSide:A.side:M.side=A.shadowSide!==null?A.shadowSide:u[A.side],M.alphaMap=A.alphaMap,M.alphaTest=A.alphaTest,M.map=A.map,M.clipShadows=A.clipShadows,M.clippingPlanes=A.clippingPlanes,M.clipIntersection=A.clipIntersection,M.displacementMap=A.displacementMap,M.displacementScale=A.displacementScale,M.displacementBias=A.displacementBias,M.wireframeLinewidth=A.wireframeLinewidth,M.linewidth=A.linewidth,T.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const L=n.properties.get(M);L.light=T}return M}function v(S,A,T,b,M){if(S.visible===!1)return;if(S.layers.test(A.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&M===Fi)&&(!S.frustumCulled||i.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,S.matrixWorld);const F=t.update(S),O=S.material;if(Array.isArray(O)){const k=F.groups;for(let D=0,U=k.length;D<U;D++){const G=k[D],W=O[G.materialIndex];if(W&&W.visible){const ot=x(S,W,b,M);S.onBeforeShadow(n,S,A,T,F,ot,G),n.renderBufferDirect(T,null,F,ot,S,G),S.onAfterShadow(n,S,A,T,F,ot,G)}}}else if(O.visible){const k=x(S,O,b,M);S.onBeforeShadow(n,S,A,T,F,k,null),n.renderBufferDirect(T,null,F,k,S,null),S.onAfterShadow(n,S,A,T,F,k,null)}}const L=S.children;for(let F=0,O=L.length;F<O;F++)v(L[F],A,T,b,M)}function w(S){S.target.removeEventListener("dispose",w);for(const T in c){const b=c[T],M=S.target.uuid;M in b&&(b[M].dispose(),delete b[M])}}}const U1={[dl]:ul,[fl]:gl,[pl]:xl,[Ms]:ml,[ul]:dl,[gl]:fl,[xl]:pl,[ml]:Ms};function N1(n,t){function e(){let N=!1;const Rt=new qe;let it=null;const ut=new qe(0,0,0,0);return{setMask:function(Pt){it!==Pt&&!N&&(n.colorMask(Pt,Pt,Pt,Pt),it=Pt)},setLocked:function(Pt){N=Pt},setClear:function(Pt,At,qt,ee,re){re===!0&&(Pt*=ee,At*=ee,qt*=ee),Rt.set(Pt,At,qt,ee),ut.equals(Rt)===!1&&(n.clearColor(Pt,At,qt,ee),ut.copy(Rt))},reset:function(){N=!1,it=null,ut.set(-1,0,0,0)}}}function i(){let N=!1,Rt=!1,it=null,ut=null,Pt=null;return{setReversed:function(At){if(Rt!==At){const qt=t.get("EXT_clip_control");Rt?qt.clipControlEXT(qt.LOWER_LEFT_EXT,qt.ZERO_TO_ONE_EXT):qt.clipControlEXT(qt.LOWER_LEFT_EXT,qt.NEGATIVE_ONE_TO_ONE_EXT);const ee=Pt;Pt=null,this.setClear(ee)}Rt=At},getReversed:function(){return Rt},setTest:function(At){At?q(n.DEPTH_TEST):J(n.DEPTH_TEST)},setMask:function(At){it!==At&&!N&&(n.depthMask(At),it=At)},setFunc:function(At){if(Rt&&(At=U1[At]),ut!==At){switch(At){case dl:n.depthFunc(n.NEVER);break;case ul:n.depthFunc(n.ALWAYS);break;case fl:n.depthFunc(n.LESS);break;case Ms:n.depthFunc(n.LEQUAL);break;case pl:n.depthFunc(n.EQUAL);break;case ml:n.depthFunc(n.GEQUAL);break;case gl:n.depthFunc(n.GREATER);break;case xl:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ut=At}},setLocked:function(At){N=At},setClear:function(At){Pt!==At&&(Rt&&(At=1-At),n.clearDepth(At),Pt=At)},reset:function(){N=!1,it=null,ut=null,Pt=null,Rt=!1}}}function a(){let N=!1,Rt=null,it=null,ut=null,Pt=null,At=null,qt=null,ee=null,re=null;return{setTest:function(te){N||(te?q(n.STENCIL_TEST):J(n.STENCIL_TEST))},setMask:function(te){Rt!==te&&!N&&(n.stencilMask(te),Rt=te)},setFunc:function(te,we,De){(it!==te||ut!==we||Pt!==De)&&(n.stencilFunc(te,we,De),it=te,ut=we,Pt=De)},setOp:function(te,we,De){(At!==te||qt!==we||ee!==De)&&(n.stencilOp(te,we,De),At=te,qt=we,ee=De)},setLocked:function(te){N=te},setClear:function(te){re!==te&&(n.clearStencil(te),re=te)},reset:function(){N=!1,Rt=null,it=null,ut=null,Pt=null,At=null,qt=null,ee=null,re=null}}}const s=new e,o=new i,r=new a,l=new WeakMap,c=new WeakMap;let h={},u={},d=new WeakMap,f=[],m=null,_=!1,g=null,p=null,y=null,x=null,v=null,w=null,S=null,A=new Qt(0,0,0),T=0,b=!1,M=null,P=null,L=null,F=null,O=null;const k=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let D=!1,U=0;const G=n.getParameter(n.VERSION);G.indexOf("WebGL")!==-1?(U=parseFloat(/^WebGL (\d)/.exec(G)[1]),D=U>=1):G.indexOf("OpenGL ES")!==-1&&(U=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),D=U>=2);let W=null,ot={};const gt=n.getParameter(n.SCISSOR_BOX),Mt=n.getParameter(n.VIEWPORT),kt=new qe().fromArray(gt),Q=new qe().fromArray(Mt);function nt(N,Rt,it,ut){const Pt=new Uint8Array(4),At=n.createTexture();n.bindTexture(N,At),n.texParameteri(N,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(N,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let qt=0;qt<it;qt++)N===n.TEXTURE_3D||N===n.TEXTURE_2D_ARRAY?n.texImage3D(Rt,0,n.RGBA,1,1,ut,0,n.RGBA,n.UNSIGNED_BYTE,Pt):n.texImage2D(Rt+qt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Pt);return At}const ht={};ht[n.TEXTURE_2D]=nt(n.TEXTURE_2D,n.TEXTURE_2D,1),ht[n.TEXTURE_CUBE_MAP]=nt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),ht[n.TEXTURE_2D_ARRAY]=nt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),ht[n.TEXTURE_3D]=nt(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),r.setClear(0),q(n.DEPTH_TEST),o.setFunc(Ms),Ht(!1),Lt(Od),q(n.CULL_FACE),V(sa);function q(N){h[N]!==!0&&(n.enable(N),h[N]=!0)}function J(N){h[N]!==!1&&(n.disable(N),h[N]=!1)}function Z(N,Rt){return u[N]!==Rt?(n.bindFramebuffer(N,Rt),u[N]=Rt,N===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=Rt),N===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=Rt),!0):!1}function bt(N,Rt){let it=f,ut=!1;if(N){it=d.get(Rt),it===void 0&&(it=[],d.set(Rt,it));const Pt=N.textures;if(it.length!==Pt.length||it[0]!==n.COLOR_ATTACHMENT0){for(let At=0,qt=Pt.length;At<qt;At++)it[At]=n.COLOR_ATTACHMENT0+At;it.length=Pt.length,ut=!0}}else it[0]!==n.BACK&&(it[0]=n.BACK,ut=!0);ut&&n.drawBuffers(it)}function zt(N){return m!==N?(n.useProgram(N),m=N,!0):!1}const Dt={[Ea]:n.FUNC_ADD,[Bx]:n.FUNC_SUBTRACT,[Hx]:n.FUNC_REVERSE_SUBTRACT};Dt[Gx]=n.MIN,Dt[Vx]=n.MAX;const Ut={[Xx]:n.ZERO,[Wx]:n.ONE,[Yx]:n.SRC_COLOR,[ll]:n.SRC_ALPHA,[Jx]:n.SRC_ALPHA_SATURATE,[qx]:n.DST_COLOR,[Zx]:n.DST_ALPHA,[$x]:n.ONE_MINUS_SRC_COLOR,[hl]:n.ONE_MINUS_SRC_ALPHA,[Kx]:n.ONE_MINUS_DST_COLOR,[jx]:n.ONE_MINUS_DST_ALPHA,[Qx]:n.CONSTANT_COLOR,[tv]:n.ONE_MINUS_CONSTANT_COLOR,[ev]:n.CONSTANT_ALPHA,[nv]:n.ONE_MINUS_CONSTANT_ALPHA};function V(N,Rt,it,ut,Pt,At,qt,ee,re,te){if(N===sa){_===!0&&(J(n.BLEND),_=!1);return}if(_===!1&&(q(n.BLEND),_=!0),N!==Ox){if(N!==g||te!==b){if((p!==Ea||v!==Ea)&&(n.blendEquation(n.FUNC_ADD),p=Ea,v=Ea),te)switch(N){case ps:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ui:n.blendFunc(n.ONE,n.ONE);break;case Bd:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Hd:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case ps:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ui:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Bd:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Hd:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}y=null,x=null,w=null,S=null,A.set(0,0,0),T=0,g=N,b=te}return}Pt=Pt||Rt,At=At||it,qt=qt||ut,(Rt!==p||Pt!==v)&&(n.blendEquationSeparate(Dt[Rt],Dt[Pt]),p=Rt,v=Pt),(it!==y||ut!==x||At!==w||qt!==S)&&(n.blendFuncSeparate(Ut[it],Ut[ut],Ut[At],Ut[qt]),y=it,x=ut,w=At,S=qt),(ee.equals(A)===!1||re!==T)&&(n.blendColor(ee.r,ee.g,ee.b,re),A.copy(ee),T=re),g=N,b=!1}function ne(N,Rt){N.side===Oe?J(n.CULL_FACE):q(n.CULL_FACE);let it=N.side===Bn;Rt&&(it=!it),Ht(it),N.blending===ps&&N.transparent===!1?V(sa):V(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),s.setMask(N.colorWrite);const ut=N.stencilWrite;r.setTest(ut),ut&&(r.setMask(N.stencilWriteMask),r.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),r.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),Ft(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?q(n.SAMPLE_ALPHA_TO_COVERAGE):J(n.SAMPLE_ALPHA_TO_COVERAGE)}function Ht(N){M!==N&&(N?n.frontFace(n.CW):n.frontFace(n.CCW),M=N)}function Lt(N){N!==Ux?(q(n.CULL_FACE),N!==P&&(N===Od?n.cullFace(n.BACK):N===Nx?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):J(n.CULL_FACE),P=N}function xt(N){N!==L&&(D&&n.lineWidth(N),L=N)}function Ft(N,Rt,it){N?(q(n.POLYGON_OFFSET_FILL),(F!==Rt||O!==it)&&(n.polygonOffset(Rt,it),F=Rt,O=it)):J(n.POLYGON_OFFSET_FILL)}function Bt(N){N?q(n.SCISSOR_TEST):J(n.SCISSOR_TEST)}function z(N){N===void 0&&(N=n.TEXTURE0+k-1),W!==N&&(n.activeTexture(N),W=N)}function R(N,Rt,it){it===void 0&&(W===null?it=n.TEXTURE0+k-1:it=W);let ut=ot[it];ut===void 0&&(ut={type:void 0,texture:void 0},ot[it]=ut),(ut.type!==N||ut.texture!==Rt)&&(W!==it&&(n.activeTexture(it),W=it),n.bindTexture(N,Rt||ht[N]),ut.type=N,ut.texture=Rt)}function j(){const N=ot[W];N!==void 0&&N.type!==void 0&&(n.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function dt(){try{n.compressedTexImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function tt(){try{n.compressedTexImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ct(){try{n.texSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function It(){try{n.texSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function et(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ft(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Nt(){try{n.texStorage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function rt(){try{n.texStorage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function wt(){try{n.texImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function B(){try{n.texImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function lt(N){kt.equals(N)===!1&&(n.scissor(N.x,N.y,N.z,N.w),kt.copy(N))}function vt(N){Q.equals(N)===!1&&(n.viewport(N.x,N.y,N.z,N.w),Q.copy(N))}function Xt(N,Rt){let it=c.get(Rt);it===void 0&&(it=new WeakMap,c.set(Rt,it));let ut=it.get(N);ut===void 0&&(ut=n.getUniformBlockIndex(Rt,N.name),it.set(N,ut))}function Gt(N,Rt){const ut=c.get(Rt).get(N);l.get(Rt)!==ut&&(n.uniformBlockBinding(Rt,ut,N.__bindingPointIndex),l.set(Rt,ut))}function $t(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},W=null,ot={},u={},d=new WeakMap,f=[],m=null,_=!1,g=null,p=null,y=null,x=null,v=null,w=null,S=null,A=new Qt(0,0,0),T=0,b=!1,M=null,P=null,L=null,F=null,O=null,kt.set(0,0,n.canvas.width,n.canvas.height),Q.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),r.reset()}return{buffers:{color:s,depth:o,stencil:r},enable:q,disable:J,bindFramebuffer:Z,drawBuffers:bt,useProgram:zt,setBlending:V,setMaterial:ne,setFlipSided:Ht,setCullFace:Lt,setLineWidth:xt,setPolygonOffset:Ft,setScissorTest:Bt,activeTexture:z,bindTexture:R,unbindTexture:j,compressedTexImage2D:dt,compressedTexImage3D:tt,texImage2D:wt,texImage3D:B,updateUBOMapping:Xt,uniformBlockBinding:Gt,texStorage2D:Nt,texStorage3D:rt,texSubImage2D:ct,texSubImage3D:It,compressedTexSubImage2D:et,compressedTexSubImage3D:ft,scissor:lt,viewport:vt,reset:$t}}function Uu(n,t,e,i){const a=O1(i);switch(e){case Zf:return n*t;case qf:return n*t;case Kf:return n*t*2;case Jf:return n*t/a.components*a.byteLength;case vh:return n*t/a.components*a.byteLength;case Qf:return n*t*2/a.components*a.byteLength;case yh:return n*t*2/a.components*a.byteLength;case jf:return n*t*3/a.components*a.byteLength;case hi:return n*t*4/a.components*a.byteLength;case _h:return n*t*4/a.components*a.byteLength;case hr:case dr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case ur:case fr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Sl:case El:return Math.max(n,16)*Math.max(t,8)/4;case bl:case wl:return Math.max(n,8)*Math.max(t,8)/2;case Tl:case Al:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Rl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Pl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Cl:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case Ll:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case Dl:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case kl:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case Il:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case zl:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Fl:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case Ul:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Nl:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Ol:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Bl:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case Hl:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Gl:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case pr:case Vl:case Xl:return Math.ceil(n/4)*Math.ceil(t/4)*16;case tp:case Wl:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Yl:case $l:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function O1(n){switch(n){case Gi:case Wf:return{byteLength:1,components:1};case oo:case Yf:case mo:return{byteLength:2,components:1};case gh:case xh:return{byteLength:2,components:4};case Ca:case mh:case Oi:return{byteLength:4,components:1};case $f:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function B1(n,t,e,i,a,s,o){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Wt,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(z,R){return f?new OffscreenCanvas(z,R):Rr("canvas")}function _(z,R,j){let dt=1;const tt=Bt(z);if((tt.width>j||tt.height>j)&&(dt=j/Math.max(tt.width,tt.height)),dt<1)if(typeof HTMLImageElement<"u"&&z instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&z instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&z instanceof ImageBitmap||typeof VideoFrame<"u"&&z instanceof VideoFrame){const ct=Math.floor(dt*tt.width),It=Math.floor(dt*tt.height);u===void 0&&(u=m(ct,It));const et=R?m(ct,It):u;return et.width=ct,et.height=It,et.getContext("2d").drawImage(z,0,0,ct,It),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+tt.width+"x"+tt.height+") to ("+ct+"x"+It+")."),et}else return"data"in z&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+tt.width+"x"+tt.height+")."),z;return z}function g(z){return z.generateMipmaps}function p(z){n.generateMipmap(z)}function y(z){return z.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:z.isWebGL3DRenderTarget?n.TEXTURE_3D:z.isWebGLArrayRenderTarget||z.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(z,R,j,dt,tt=!1){if(z!==null){if(n[z]!==void 0)return n[z];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+z+"'")}let ct=R;if(R===n.RED&&(j===n.FLOAT&&(ct=n.R32F),j===n.HALF_FLOAT&&(ct=n.R16F),j===n.UNSIGNED_BYTE&&(ct=n.R8)),R===n.RED_INTEGER&&(j===n.UNSIGNED_BYTE&&(ct=n.R8UI),j===n.UNSIGNED_SHORT&&(ct=n.R16UI),j===n.UNSIGNED_INT&&(ct=n.R32UI),j===n.BYTE&&(ct=n.R8I),j===n.SHORT&&(ct=n.R16I),j===n.INT&&(ct=n.R32I)),R===n.RG&&(j===n.FLOAT&&(ct=n.RG32F),j===n.HALF_FLOAT&&(ct=n.RG16F),j===n.UNSIGNED_BYTE&&(ct=n.RG8)),R===n.RG_INTEGER&&(j===n.UNSIGNED_BYTE&&(ct=n.RG8UI),j===n.UNSIGNED_SHORT&&(ct=n.RG16UI),j===n.UNSIGNED_INT&&(ct=n.RG32UI),j===n.BYTE&&(ct=n.RG8I),j===n.SHORT&&(ct=n.RG16I),j===n.INT&&(ct=n.RG32I)),R===n.RGB_INTEGER&&(j===n.UNSIGNED_BYTE&&(ct=n.RGB8UI),j===n.UNSIGNED_SHORT&&(ct=n.RGB16UI),j===n.UNSIGNED_INT&&(ct=n.RGB32UI),j===n.BYTE&&(ct=n.RGB8I),j===n.SHORT&&(ct=n.RGB16I),j===n.INT&&(ct=n.RGB32I)),R===n.RGBA_INTEGER&&(j===n.UNSIGNED_BYTE&&(ct=n.RGBA8UI),j===n.UNSIGNED_SHORT&&(ct=n.RGBA16UI),j===n.UNSIGNED_INT&&(ct=n.RGBA32UI),j===n.BYTE&&(ct=n.RGBA8I),j===n.SHORT&&(ct=n.RGBA16I),j===n.INT&&(ct=n.RGBA32I)),R===n.RGB&&j===n.UNSIGNED_INT_5_9_9_9_REV&&(ct=n.RGB9_E5),R===n.RGBA){const It=tt?Or:Me.getTransfer(dt);j===n.FLOAT&&(ct=n.RGBA32F),j===n.HALF_FLOAT&&(ct=n.RGBA16F),j===n.UNSIGNED_BYTE&&(ct=It===Le?n.SRGB8_ALPHA8:n.RGBA8),j===n.UNSIGNED_SHORT_4_4_4_4&&(ct=n.RGBA4),j===n.UNSIGNED_SHORT_5_5_5_1&&(ct=n.RGB5_A1)}return(ct===n.R16F||ct===n.R32F||ct===n.RG16F||ct===n.RG32F||ct===n.RGBA16F||ct===n.RGBA32F)&&t.get("EXT_color_buffer_float"),ct}function v(z,R){let j;return z?R===null||R===Ca||R===ws?j=n.DEPTH24_STENCIL8:R===Oi?j=n.DEPTH32F_STENCIL8:R===oo&&(j=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):R===null||R===Ca||R===ws?j=n.DEPTH_COMPONENT24:R===Oi?j=n.DEPTH_COMPONENT32F:R===oo&&(j=n.DEPTH_COMPONENT16),j}function w(z,R){return g(z)===!0||z.isFramebufferTexture&&z.minFilter!==di&&z.minFilter!==Mi?Math.log2(Math.max(R.width,R.height))+1:z.mipmaps!==void 0&&z.mipmaps.length>0?z.mipmaps.length:z.isCompressedTexture&&Array.isArray(z.image)?R.mipmaps.length:1}function S(z){const R=z.target;R.removeEventListener("dispose",S),T(R),R.isVideoTexture&&h.delete(R)}function A(z){const R=z.target;R.removeEventListener("dispose",A),M(R)}function T(z){const R=i.get(z);if(R.__webglInit===void 0)return;const j=z.source,dt=d.get(j);if(dt){const tt=dt[R.__cacheKey];tt.usedTimes--,tt.usedTimes===0&&b(z),Object.keys(dt).length===0&&d.delete(j)}i.remove(z)}function b(z){const R=i.get(z);n.deleteTexture(R.__webglTexture);const j=z.source,dt=d.get(j);delete dt[R.__cacheKey],o.memory.textures--}function M(z){const R=i.get(z);if(z.depthTexture&&(z.depthTexture.dispose(),i.remove(z.depthTexture)),z.isWebGLCubeRenderTarget)for(let dt=0;dt<6;dt++){if(Array.isArray(R.__webglFramebuffer[dt]))for(let tt=0;tt<R.__webglFramebuffer[dt].length;tt++)n.deleteFramebuffer(R.__webglFramebuffer[dt][tt]);else n.deleteFramebuffer(R.__webglFramebuffer[dt]);R.__webglDepthbuffer&&n.deleteRenderbuffer(R.__webglDepthbuffer[dt])}else{if(Array.isArray(R.__webglFramebuffer))for(let dt=0;dt<R.__webglFramebuffer.length;dt++)n.deleteFramebuffer(R.__webglFramebuffer[dt]);else n.deleteFramebuffer(R.__webglFramebuffer);if(R.__webglDepthbuffer&&n.deleteRenderbuffer(R.__webglDepthbuffer),R.__webglMultisampledFramebuffer&&n.deleteFramebuffer(R.__webglMultisampledFramebuffer),R.__webglColorRenderbuffer)for(let dt=0;dt<R.__webglColorRenderbuffer.length;dt++)R.__webglColorRenderbuffer[dt]&&n.deleteRenderbuffer(R.__webglColorRenderbuffer[dt]);R.__webglDepthRenderbuffer&&n.deleteRenderbuffer(R.__webglDepthRenderbuffer)}const j=z.textures;for(let dt=0,tt=j.length;dt<tt;dt++){const ct=i.get(j[dt]);ct.__webglTexture&&(n.deleteTexture(ct.__webglTexture),o.memory.textures--),i.remove(j[dt])}i.remove(z)}let P=0;function L(){P=0}function F(){const z=P;return z>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+z+" texture units while this GPU supports only "+a.maxTextures),P+=1,z}function O(z){const R=[];return R.push(z.wrapS),R.push(z.wrapT),R.push(z.wrapR||0),R.push(z.magFilter),R.push(z.minFilter),R.push(z.anisotropy),R.push(z.internalFormat),R.push(z.format),R.push(z.type),R.push(z.generateMipmaps),R.push(z.premultiplyAlpha),R.push(z.flipY),R.push(z.unpackAlignment),R.push(z.colorSpace),R.join()}function k(z,R){const j=i.get(z);if(z.isVideoTexture&&xt(z),z.isRenderTargetTexture===!1&&z.version>0&&j.__version!==z.version){const dt=z.image;if(dt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(dt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Q(j,z,R);return}}e.bindTexture(n.TEXTURE_2D,j.__webglTexture,n.TEXTURE0+R)}function D(z,R){const j=i.get(z);if(z.version>0&&j.__version!==z.version){Q(j,z,R);return}e.bindTexture(n.TEXTURE_2D_ARRAY,j.__webglTexture,n.TEXTURE0+R)}function U(z,R){const j=i.get(z);if(z.version>0&&j.__version!==z.version){Q(j,z,R);return}e.bindTexture(n.TEXTURE_3D,j.__webglTexture,n.TEXTURE0+R)}function G(z,R){const j=i.get(z);if(z.version>0&&j.__version!==z.version){nt(j,z,R);return}e.bindTexture(n.TEXTURE_CUBE_MAP,j.__webglTexture,n.TEXTURE0+R)}const W={[_l]:n.REPEAT,[Aa]:n.CLAMP_TO_EDGE,[Ml]:n.MIRRORED_REPEAT},ot={[di]:n.NEAREST,[uv]:n.NEAREST_MIPMAP_NEAREST,[Co]:n.NEAREST_MIPMAP_LINEAR,[Mi]:n.LINEAR,[fc]:n.LINEAR_MIPMAP_NEAREST,[Ra]:n.LINEAR_MIPMAP_LINEAR},gt={[gv]:n.NEVER,[bv]:n.ALWAYS,[xv]:n.LESS,[np]:n.LEQUAL,[vv]:n.EQUAL,[Mv]:n.GEQUAL,[yv]:n.GREATER,[_v]:n.NOTEQUAL};function Mt(z,R){if(R.type===Oi&&t.has("OES_texture_float_linear")===!1&&(R.magFilter===Mi||R.magFilter===fc||R.magFilter===Co||R.magFilter===Ra||R.minFilter===Mi||R.minFilter===fc||R.minFilter===Co||R.minFilter===Ra)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(z,n.TEXTURE_WRAP_S,W[R.wrapS]),n.texParameteri(z,n.TEXTURE_WRAP_T,W[R.wrapT]),(z===n.TEXTURE_3D||z===n.TEXTURE_2D_ARRAY)&&n.texParameteri(z,n.TEXTURE_WRAP_R,W[R.wrapR]),n.texParameteri(z,n.TEXTURE_MAG_FILTER,ot[R.magFilter]),n.texParameteri(z,n.TEXTURE_MIN_FILTER,ot[R.minFilter]),R.compareFunction&&(n.texParameteri(z,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(z,n.TEXTURE_COMPARE_FUNC,gt[R.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(R.magFilter===di||R.minFilter!==Co&&R.minFilter!==Ra||R.type===Oi&&t.has("OES_texture_float_linear")===!1)return;if(R.anisotropy>1||i.get(R).__currentAnisotropy){const j=t.get("EXT_texture_filter_anisotropic");n.texParameterf(z,j.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(R.anisotropy,a.getMaxAnisotropy())),i.get(R).__currentAnisotropy=R.anisotropy}}}function kt(z,R){let j=!1;z.__webglInit===void 0&&(z.__webglInit=!0,R.addEventListener("dispose",S));const dt=R.source;let tt=d.get(dt);tt===void 0&&(tt={},d.set(dt,tt));const ct=O(R);if(ct!==z.__cacheKey){tt[ct]===void 0&&(tt[ct]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,j=!0),tt[ct].usedTimes++;const It=tt[z.__cacheKey];It!==void 0&&(tt[z.__cacheKey].usedTimes--,It.usedTimes===0&&b(R)),z.__cacheKey=ct,z.__webglTexture=tt[ct].texture}return j}function Q(z,R,j){let dt=n.TEXTURE_2D;(R.isDataArrayTexture||R.isCompressedArrayTexture)&&(dt=n.TEXTURE_2D_ARRAY),R.isData3DTexture&&(dt=n.TEXTURE_3D);const tt=kt(z,R),ct=R.source;e.bindTexture(dt,z.__webglTexture,n.TEXTURE0+j);const It=i.get(ct);if(ct.version!==It.__version||tt===!0){e.activeTexture(n.TEXTURE0+j);const et=Me.getPrimaries(Me.workingColorSpace),ft=R.colorSpace===ea?null:Me.getPrimaries(R.colorSpace),Nt=R.colorSpace===ea||et===ft?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,R.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,R.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Nt);let rt=_(R.image,!1,a.maxTextureSize);rt=Ft(R,rt);const wt=s.convert(R.format,R.colorSpace),B=s.convert(R.type);let lt=x(R.internalFormat,wt,B,R.colorSpace,R.isVideoTexture);Mt(dt,R);let vt;const Xt=R.mipmaps,Gt=R.isVideoTexture!==!0,$t=It.__version===void 0||tt===!0,N=ct.dataReady,Rt=w(R,rt);if(R.isDepthTexture)lt=v(R.format===Es,R.type),$t&&(Gt?e.texStorage2D(n.TEXTURE_2D,1,lt,rt.width,rt.height):e.texImage2D(n.TEXTURE_2D,0,lt,rt.width,rt.height,0,wt,B,null));else if(R.isDataTexture)if(Xt.length>0){Gt&&$t&&e.texStorage2D(n.TEXTURE_2D,Rt,lt,Xt[0].width,Xt[0].height);for(let it=0,ut=Xt.length;it<ut;it++)vt=Xt[it],Gt?N&&e.texSubImage2D(n.TEXTURE_2D,it,0,0,vt.width,vt.height,wt,B,vt.data):e.texImage2D(n.TEXTURE_2D,it,lt,vt.width,vt.height,0,wt,B,vt.data);R.generateMipmaps=!1}else Gt?($t&&e.texStorage2D(n.TEXTURE_2D,Rt,lt,rt.width,rt.height),N&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,rt.width,rt.height,wt,B,rt.data)):e.texImage2D(n.TEXTURE_2D,0,lt,rt.width,rt.height,0,wt,B,rt.data);else if(R.isCompressedTexture)if(R.isCompressedArrayTexture){Gt&&$t&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Rt,lt,Xt[0].width,Xt[0].height,rt.depth);for(let it=0,ut=Xt.length;it<ut;it++)if(vt=Xt[it],R.format!==hi)if(wt!==null)if(Gt){if(N)if(R.layerUpdates.size>0){const Pt=Uu(vt.width,vt.height,R.format,R.type);for(const At of R.layerUpdates){const qt=vt.data.subarray(At*Pt/vt.data.BYTES_PER_ELEMENT,(At+1)*Pt/vt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,it,0,0,At,vt.width,vt.height,1,wt,qt)}R.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,it,0,0,0,vt.width,vt.height,rt.depth,wt,vt.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,it,lt,vt.width,vt.height,rt.depth,0,vt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Gt?N&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,it,0,0,0,vt.width,vt.height,rt.depth,wt,B,vt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,it,lt,vt.width,vt.height,rt.depth,0,wt,B,vt.data)}else{Gt&&$t&&e.texStorage2D(n.TEXTURE_2D,Rt,lt,Xt[0].width,Xt[0].height);for(let it=0,ut=Xt.length;it<ut;it++)vt=Xt[it],R.format!==hi?wt!==null?Gt?N&&e.compressedTexSubImage2D(n.TEXTURE_2D,it,0,0,vt.width,vt.height,wt,vt.data):e.compressedTexImage2D(n.TEXTURE_2D,it,lt,vt.width,vt.height,0,vt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Gt?N&&e.texSubImage2D(n.TEXTURE_2D,it,0,0,vt.width,vt.height,wt,B,vt.data):e.texImage2D(n.TEXTURE_2D,it,lt,vt.width,vt.height,0,wt,B,vt.data)}else if(R.isDataArrayTexture)if(Gt){if($t&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Rt,lt,rt.width,rt.height,rt.depth),N)if(R.layerUpdates.size>0){const it=Uu(rt.width,rt.height,R.format,R.type);for(const ut of R.layerUpdates){const Pt=rt.data.subarray(ut*it/rt.data.BYTES_PER_ELEMENT,(ut+1)*it/rt.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ut,rt.width,rt.height,1,wt,B,Pt)}R.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,rt.width,rt.height,rt.depth,wt,B,rt.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,lt,rt.width,rt.height,rt.depth,0,wt,B,rt.data);else if(R.isData3DTexture)Gt?($t&&e.texStorage3D(n.TEXTURE_3D,Rt,lt,rt.width,rt.height,rt.depth),N&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,rt.width,rt.height,rt.depth,wt,B,rt.data)):e.texImage3D(n.TEXTURE_3D,0,lt,rt.width,rt.height,rt.depth,0,wt,B,rt.data);else if(R.isFramebufferTexture){if($t)if(Gt)e.texStorage2D(n.TEXTURE_2D,Rt,lt,rt.width,rt.height);else{let it=rt.width,ut=rt.height;for(let Pt=0;Pt<Rt;Pt++)e.texImage2D(n.TEXTURE_2D,Pt,lt,it,ut,0,wt,B,null),it>>=1,ut>>=1}}else if(Xt.length>0){if(Gt&&$t){const it=Bt(Xt[0]);e.texStorage2D(n.TEXTURE_2D,Rt,lt,it.width,it.height)}for(let it=0,ut=Xt.length;it<ut;it++)vt=Xt[it],Gt?N&&e.texSubImage2D(n.TEXTURE_2D,it,0,0,wt,B,vt):e.texImage2D(n.TEXTURE_2D,it,lt,wt,B,vt);R.generateMipmaps=!1}else if(Gt){if($t){const it=Bt(rt);e.texStorage2D(n.TEXTURE_2D,Rt,lt,it.width,it.height)}N&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,wt,B,rt)}else e.texImage2D(n.TEXTURE_2D,0,lt,wt,B,rt);g(R)&&p(dt),It.__version=ct.version,R.onUpdate&&R.onUpdate(R)}z.__version=R.version}function nt(z,R,j){if(R.image.length!==6)return;const dt=kt(z,R),tt=R.source;e.bindTexture(n.TEXTURE_CUBE_MAP,z.__webglTexture,n.TEXTURE0+j);const ct=i.get(tt);if(tt.version!==ct.__version||dt===!0){e.activeTexture(n.TEXTURE0+j);const It=Me.getPrimaries(Me.workingColorSpace),et=R.colorSpace===ea?null:Me.getPrimaries(R.colorSpace),ft=R.colorSpace===ea||It===et?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,R.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,R.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ft);const Nt=R.isCompressedTexture||R.image[0].isCompressedTexture,rt=R.image[0]&&R.image[0].isDataTexture,wt=[];for(let ut=0;ut<6;ut++)!Nt&&!rt?wt[ut]=_(R.image[ut],!0,a.maxCubemapSize):wt[ut]=rt?R.image[ut].image:R.image[ut],wt[ut]=Ft(R,wt[ut]);const B=wt[0],lt=s.convert(R.format,R.colorSpace),vt=s.convert(R.type),Xt=x(R.internalFormat,lt,vt,R.colorSpace),Gt=R.isVideoTexture!==!0,$t=ct.__version===void 0||dt===!0,N=tt.dataReady;let Rt=w(R,B);Mt(n.TEXTURE_CUBE_MAP,R);let it;if(Nt){Gt&&$t&&e.texStorage2D(n.TEXTURE_CUBE_MAP,Rt,Xt,B.width,B.height);for(let ut=0;ut<6;ut++){it=wt[ut].mipmaps;for(let Pt=0;Pt<it.length;Pt++){const At=it[Pt];R.format!==hi?lt!==null?Gt?N&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Pt,0,0,At.width,At.height,lt,At.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Pt,Xt,At.width,At.height,0,At.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Gt?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Pt,0,0,At.width,At.height,lt,vt,At.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Pt,Xt,At.width,At.height,0,lt,vt,At.data)}}}else{if(it=R.mipmaps,Gt&&$t){it.length>0&&Rt++;const ut=Bt(wt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,Rt,Xt,ut.width,ut.height)}for(let ut=0;ut<6;ut++)if(rt){Gt?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,0,0,wt[ut].width,wt[ut].height,lt,vt,wt[ut].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,Xt,wt[ut].width,wt[ut].height,0,lt,vt,wt[ut].data);for(let Pt=0;Pt<it.length;Pt++){const qt=it[Pt].image[ut].image;Gt?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Pt+1,0,0,qt.width,qt.height,lt,vt,qt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Pt+1,Xt,qt.width,qt.height,0,lt,vt,qt.data)}}else{Gt?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,0,0,lt,vt,wt[ut]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,Xt,lt,vt,wt[ut]);for(let Pt=0;Pt<it.length;Pt++){const At=it[Pt];Gt?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Pt+1,0,0,lt,vt,At.image[ut]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,Pt+1,Xt,lt,vt,At.image[ut])}}}g(R)&&p(n.TEXTURE_CUBE_MAP),ct.__version=tt.version,R.onUpdate&&R.onUpdate(R)}z.__version=R.version}function ht(z,R,j,dt,tt,ct){const It=s.convert(j.format,j.colorSpace),et=s.convert(j.type),ft=x(j.internalFormat,It,et,j.colorSpace),Nt=i.get(R),rt=i.get(j);if(rt.__renderTarget=R,!Nt.__hasExternalTextures){const wt=Math.max(1,R.width>>ct),B=Math.max(1,R.height>>ct);tt===n.TEXTURE_3D||tt===n.TEXTURE_2D_ARRAY?e.texImage3D(tt,ct,ft,wt,B,R.depth,0,It,et,null):e.texImage2D(tt,ct,ft,wt,B,0,It,et,null)}e.bindFramebuffer(n.FRAMEBUFFER,z),Lt(R)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,dt,tt,rt.__webglTexture,0,Ht(R)):(tt===n.TEXTURE_2D||tt>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&tt<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,dt,tt,rt.__webglTexture,ct),e.bindFramebuffer(n.FRAMEBUFFER,null)}function q(z,R,j){if(n.bindRenderbuffer(n.RENDERBUFFER,z),R.depthBuffer){const dt=R.depthTexture,tt=dt&&dt.isDepthTexture?dt.type:null,ct=v(R.stencilBuffer,tt),It=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,et=Ht(R);Lt(R)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,et,ct,R.width,R.height):j?n.renderbufferStorageMultisample(n.RENDERBUFFER,et,ct,R.width,R.height):n.renderbufferStorage(n.RENDERBUFFER,ct,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,It,n.RENDERBUFFER,z)}else{const dt=R.textures;for(let tt=0;tt<dt.length;tt++){const ct=dt[tt],It=s.convert(ct.format,ct.colorSpace),et=s.convert(ct.type),ft=x(ct.internalFormat,It,et,ct.colorSpace),Nt=Ht(R);j&&Lt(R)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Nt,ft,R.width,R.height):Lt(R)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Nt,ft,R.width,R.height):n.renderbufferStorage(n.RENDERBUFFER,ft,R.width,R.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function J(z,R){if(R&&R.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,z),!(R.depthTexture&&R.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const dt=i.get(R.depthTexture);dt.__renderTarget=R,(!dt.__webglTexture||R.depthTexture.image.width!==R.width||R.depthTexture.image.height!==R.height)&&(R.depthTexture.image.width=R.width,R.depthTexture.image.height=R.height,R.depthTexture.needsUpdate=!0),k(R.depthTexture,0);const tt=dt.__webglTexture,ct=Ht(R);if(R.depthTexture.format===ms)Lt(R)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,tt,0,ct):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,tt,0);else if(R.depthTexture.format===Es)Lt(R)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,tt,0,ct):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,tt,0);else throw new Error("Unknown depthTexture format")}function Z(z){const R=i.get(z),j=z.isWebGLCubeRenderTarget===!0;if(R.__boundDepthTexture!==z.depthTexture){const dt=z.depthTexture;if(R.__depthDisposeCallback&&R.__depthDisposeCallback(),dt){const tt=()=>{delete R.__boundDepthTexture,delete R.__depthDisposeCallback,dt.removeEventListener("dispose",tt)};dt.addEventListener("dispose",tt),R.__depthDisposeCallback=tt}R.__boundDepthTexture=dt}if(z.depthTexture&&!R.__autoAllocateDepthBuffer){if(j)throw new Error("target.depthTexture not supported in Cube render targets");J(R.__webglFramebuffer,z)}else if(j){R.__webglDepthbuffer=[];for(let dt=0;dt<6;dt++)if(e.bindFramebuffer(n.FRAMEBUFFER,R.__webglFramebuffer[dt]),R.__webglDepthbuffer[dt]===void 0)R.__webglDepthbuffer[dt]=n.createRenderbuffer(),q(R.__webglDepthbuffer[dt],z,!1);else{const tt=z.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ct=R.__webglDepthbuffer[dt];n.bindRenderbuffer(n.RENDERBUFFER,ct),n.framebufferRenderbuffer(n.FRAMEBUFFER,tt,n.RENDERBUFFER,ct)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,R.__webglFramebuffer),R.__webglDepthbuffer===void 0)R.__webglDepthbuffer=n.createRenderbuffer(),q(R.__webglDepthbuffer,z,!1);else{const dt=z.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,tt=R.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,tt),n.framebufferRenderbuffer(n.FRAMEBUFFER,dt,n.RENDERBUFFER,tt)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function bt(z,R,j){const dt=i.get(z);R!==void 0&&ht(dt.__webglFramebuffer,z,z.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),j!==void 0&&Z(z)}function zt(z){const R=z.texture,j=i.get(z),dt=i.get(R);z.addEventListener("dispose",A);const tt=z.textures,ct=z.isWebGLCubeRenderTarget===!0,It=tt.length>1;if(It||(dt.__webglTexture===void 0&&(dt.__webglTexture=n.createTexture()),dt.__version=R.version,o.memory.textures++),ct){j.__webglFramebuffer=[];for(let et=0;et<6;et++)if(R.mipmaps&&R.mipmaps.length>0){j.__webglFramebuffer[et]=[];for(let ft=0;ft<R.mipmaps.length;ft++)j.__webglFramebuffer[et][ft]=n.createFramebuffer()}else j.__webglFramebuffer[et]=n.createFramebuffer()}else{if(R.mipmaps&&R.mipmaps.length>0){j.__webglFramebuffer=[];for(let et=0;et<R.mipmaps.length;et++)j.__webglFramebuffer[et]=n.createFramebuffer()}else j.__webglFramebuffer=n.createFramebuffer();if(It)for(let et=0,ft=tt.length;et<ft;et++){const Nt=i.get(tt[et]);Nt.__webglTexture===void 0&&(Nt.__webglTexture=n.createTexture(),o.memory.textures++)}if(z.samples>0&&Lt(z)===!1){j.__webglMultisampledFramebuffer=n.createFramebuffer(),j.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,j.__webglMultisampledFramebuffer);for(let et=0;et<tt.length;et++){const ft=tt[et];j.__webglColorRenderbuffer[et]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,j.__webglColorRenderbuffer[et]);const Nt=s.convert(ft.format,ft.colorSpace),rt=s.convert(ft.type),wt=x(ft.internalFormat,Nt,rt,ft.colorSpace,z.isXRRenderTarget===!0),B=Ht(z);n.renderbufferStorageMultisample(n.RENDERBUFFER,B,wt,z.width,z.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+et,n.RENDERBUFFER,j.__webglColorRenderbuffer[et])}n.bindRenderbuffer(n.RENDERBUFFER,null),z.depthBuffer&&(j.__webglDepthRenderbuffer=n.createRenderbuffer(),q(j.__webglDepthRenderbuffer,z,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ct){e.bindTexture(n.TEXTURE_CUBE_MAP,dt.__webglTexture),Mt(n.TEXTURE_CUBE_MAP,R);for(let et=0;et<6;et++)if(R.mipmaps&&R.mipmaps.length>0)for(let ft=0;ft<R.mipmaps.length;ft++)ht(j.__webglFramebuffer[et][ft],z,R,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+et,ft);else ht(j.__webglFramebuffer[et],z,R,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+et,0);g(R)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(It){for(let et=0,ft=tt.length;et<ft;et++){const Nt=tt[et],rt=i.get(Nt);e.bindTexture(n.TEXTURE_2D,rt.__webglTexture),Mt(n.TEXTURE_2D,Nt),ht(j.__webglFramebuffer,z,Nt,n.COLOR_ATTACHMENT0+et,n.TEXTURE_2D,0),g(Nt)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let et=n.TEXTURE_2D;if((z.isWebGL3DRenderTarget||z.isWebGLArrayRenderTarget)&&(et=z.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(et,dt.__webglTexture),Mt(et,R),R.mipmaps&&R.mipmaps.length>0)for(let ft=0;ft<R.mipmaps.length;ft++)ht(j.__webglFramebuffer[ft],z,R,n.COLOR_ATTACHMENT0,et,ft);else ht(j.__webglFramebuffer,z,R,n.COLOR_ATTACHMENT0,et,0);g(R)&&p(et),e.unbindTexture()}z.depthBuffer&&Z(z)}function Dt(z){const R=z.textures;for(let j=0,dt=R.length;j<dt;j++){const tt=R[j];if(g(tt)){const ct=y(z),It=i.get(tt).__webglTexture;e.bindTexture(ct,It),p(ct),e.unbindTexture()}}}const Ut=[],V=[];function ne(z){if(z.samples>0){if(Lt(z)===!1){const R=z.textures,j=z.width,dt=z.height;let tt=n.COLOR_BUFFER_BIT;const ct=z.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,It=i.get(z),et=R.length>1;if(et)for(let ft=0;ft<R.length;ft++)e.bindFramebuffer(n.FRAMEBUFFER,It.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ft,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,It.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ft,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,It.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,It.__webglFramebuffer);for(let ft=0;ft<R.length;ft++){if(z.resolveDepthBuffer&&(z.depthBuffer&&(tt|=n.DEPTH_BUFFER_BIT),z.stencilBuffer&&z.resolveStencilBuffer&&(tt|=n.STENCIL_BUFFER_BIT)),et){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,It.__webglColorRenderbuffer[ft]);const Nt=i.get(R[ft]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Nt,0)}n.blitFramebuffer(0,0,j,dt,0,0,j,dt,tt,n.NEAREST),l===!0&&(Ut.length=0,V.length=0,Ut.push(n.COLOR_ATTACHMENT0+ft),z.depthBuffer&&z.resolveDepthBuffer===!1&&(Ut.push(ct),V.push(ct),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,V)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Ut))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),et)for(let ft=0;ft<R.length;ft++){e.bindFramebuffer(n.FRAMEBUFFER,It.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ft,n.RENDERBUFFER,It.__webglColorRenderbuffer[ft]);const Nt=i.get(R[ft]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,It.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ft,n.TEXTURE_2D,Nt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,It.__webglMultisampledFramebuffer)}else if(z.depthBuffer&&z.resolveDepthBuffer===!1&&l){const R=z.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[R])}}}function Ht(z){return Math.min(a.maxSamples,z.samples)}function Lt(z){const R=i.get(z);return z.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&R.__useRenderToTexture!==!1}function xt(z){const R=o.render.frame;h.get(z)!==R&&(h.set(z,R),z.update())}function Ft(z,R){const j=z.colorSpace,dt=z.format,tt=z.type;return z.isCompressedTexture===!0||z.isVideoTexture===!0||j!==As&&j!==ea&&(Me.getTransfer(j)===Le?(dt!==hi||tt!==Gi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",j)),R}function Bt(z){return typeof HTMLImageElement<"u"&&z instanceof HTMLImageElement?(c.width=z.naturalWidth||z.width,c.height=z.naturalHeight||z.height):typeof VideoFrame<"u"&&z instanceof VideoFrame?(c.width=z.displayWidth,c.height=z.displayHeight):(c.width=z.width,c.height=z.height),c}this.allocateTextureUnit=F,this.resetTextureUnits=L,this.setTexture2D=k,this.setTexture2DArray=D,this.setTexture3D=U,this.setTextureCube=G,this.rebindTextures=bt,this.setupRenderTarget=zt,this.updateRenderTargetMipmap=Dt,this.updateMultisampleRenderTarget=ne,this.setupDepthRenderbuffer=Z,this.setupFrameBufferTexture=ht,this.useMultisampledRTT=Lt}function H1(n,t){function e(i,a=ea){let s;const o=Me.getTransfer(a);if(i===Gi)return n.UNSIGNED_BYTE;if(i===gh)return n.UNSIGNED_SHORT_4_4_4_4;if(i===xh)return n.UNSIGNED_SHORT_5_5_5_1;if(i===$f)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Wf)return n.BYTE;if(i===Yf)return n.SHORT;if(i===oo)return n.UNSIGNED_SHORT;if(i===mh)return n.INT;if(i===Ca)return n.UNSIGNED_INT;if(i===Oi)return n.FLOAT;if(i===mo)return n.HALF_FLOAT;if(i===Zf)return n.ALPHA;if(i===jf)return n.RGB;if(i===hi)return n.RGBA;if(i===qf)return n.LUMINANCE;if(i===Kf)return n.LUMINANCE_ALPHA;if(i===ms)return n.DEPTH_COMPONENT;if(i===Es)return n.DEPTH_STENCIL;if(i===Jf)return n.RED;if(i===vh)return n.RED_INTEGER;if(i===Qf)return n.RG;if(i===yh)return n.RG_INTEGER;if(i===_h)return n.RGBA_INTEGER;if(i===hr||i===dr||i===ur||i===fr)if(o===Le)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===hr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===dr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ur)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===fr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===hr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===dr)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ur)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===fr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===bl||i===Sl||i===wl||i===El)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===bl)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Sl)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===wl)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===El)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Tl||i===Al||i===Rl)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Tl||i===Al)return o===Le?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Rl)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Pl||i===Cl||i===Ll||i===Dl||i===kl||i===Il||i===zl||i===Fl||i===Ul||i===Nl||i===Ol||i===Bl||i===Hl||i===Gl)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Pl)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Cl)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Ll)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Dl)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===kl)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Il)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===zl)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Fl)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ul)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Nl)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Ol)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Bl)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Hl)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Gl)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===pr||i===Vl||i===Xl)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===pr)return o===Le?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Vl)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Xl)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===tp||i===Wl||i===Yl||i===$l)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===pr)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Wl)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Yl)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===$l)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ws?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class G1 extends Qn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Pe extends Ve{constructor(){super(),this.isGroup=!0,this.type="Group"}}const V1={type:"move"};class Bc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Pe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Pe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Pe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let a=null,s=null,o=null;const r=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const _ of t.hand.values()){const g=e.getJointPose(_,i),p=this._getHandJoint(c,_);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,m=.005;c.inputState.pinching&&d>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));r!==null&&(a=e.getPose(t.targetRaySpace,i),a===null&&s!==null&&(a=s),a!==null&&(r.matrix.fromArray(a.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,a.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(a.linearVelocity)):r.hasLinearVelocity=!1,a.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(a.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(V1)))}return r!==null&&(r.visible=a!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new Pe;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const X1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,W1=`
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

}`;class Y1{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const a=new zn,s=t.properties.get(a);s.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=a}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new la({vertexShader:X1,fragmentShader:W1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new me(new Jn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class $1 extends Rs{constructor(t,e){super();const i=this;let a=null,s=1,o=null,r="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,m=null;const _=new Y1,g=e.getContextAttributes();let p=null,y=null;const x=[],v=[],w=new Wt;let S=null;const A=new Qn;A.viewport=new qe;const T=new Qn;T.viewport=new qe;const b=[A,T],M=new G1;let P=null,L=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let nt=x[Q];return nt===void 0&&(nt=new Bc,x[Q]=nt),nt.getTargetRaySpace()},this.getControllerGrip=function(Q){let nt=x[Q];return nt===void 0&&(nt=new Bc,x[Q]=nt),nt.getGripSpace()},this.getHand=function(Q){let nt=x[Q];return nt===void 0&&(nt=new Bc,x[Q]=nt),nt.getHandSpace()};function F(Q){const nt=v.indexOf(Q.inputSource);if(nt===-1)return;const ht=x[nt];ht!==void 0&&(ht.update(Q.inputSource,Q.frame,c||o),ht.dispatchEvent({type:Q.type,data:Q.inputSource}))}function O(){a.removeEventListener("select",F),a.removeEventListener("selectstart",F),a.removeEventListener("selectend",F),a.removeEventListener("squeeze",F),a.removeEventListener("squeezestart",F),a.removeEventListener("squeezeend",F),a.removeEventListener("end",O),a.removeEventListener("inputsourceschange",k);for(let Q=0;Q<x.length;Q++){const nt=v[Q];nt!==null&&(v[Q]=null,x[Q].disconnect(nt))}P=null,L=null,_.reset(),t.setRenderTarget(p),f=null,d=null,u=null,a=null,y=null,kt.stop(),i.isPresenting=!1,t.setPixelRatio(S),t.setSize(w.width,w.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){s=Q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){r=Q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Q){c=Q},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return m},this.getSession=function(){return a},this.setSession=async function(Q){if(a=Q,a!==null){if(p=t.getRenderTarget(),a.addEventListener("select",F),a.addEventListener("selectstart",F),a.addEventListener("selectend",F),a.addEventListener("squeeze",F),a.addEventListener("squeezestart",F),a.addEventListener("squeezeend",F),a.addEventListener("end",O),a.addEventListener("inputsourceschange",k),g.xrCompatible!==!0&&await e.makeXRCompatible(),S=t.getPixelRatio(),t.getSize(w),a.renderState.layers===void 0){const nt={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(a,e,nt),a.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new La(f.framebufferWidth,f.framebufferHeight,{format:hi,type:Gi,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let nt=null,ht=null,q=null;g.depth&&(q=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,nt=g.stencil?Es:ms,ht=g.stencil?ws:Ca);const J={colorFormat:e.RGBA8,depthFormat:q,scaleFactor:s};u=new XRWebGLBinding(a,e),d=u.createProjectionLayer(J),a.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),y=new La(d.textureWidth,d.textureHeight,{format:hi,type:Gi,depthTexture:new pp(d.textureWidth,d.textureHeight,ht,void 0,void 0,void 0,void 0,void 0,void 0,nt),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await a.requestReferenceSpace(r),kt.setContext(a),kt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function k(Q){for(let nt=0;nt<Q.removed.length;nt++){const ht=Q.removed[nt],q=v.indexOf(ht);q>=0&&(v[q]=null,x[q].disconnect(ht))}for(let nt=0;nt<Q.added.length;nt++){const ht=Q.added[nt];let q=v.indexOf(ht);if(q===-1){for(let Z=0;Z<x.length;Z++)if(Z>=v.length){v.push(ht),q=Z;break}else if(v[Z]===null){v[Z]=ht,q=Z;break}if(q===-1)break}const J=x[q];J&&J.connect(ht)}}const D=new H,U=new H;function G(Q,nt,ht){D.setFromMatrixPosition(nt.matrixWorld),U.setFromMatrixPosition(ht.matrixWorld);const q=D.distanceTo(U),J=nt.projectionMatrix.elements,Z=ht.projectionMatrix.elements,bt=J[14]/(J[10]-1),zt=J[14]/(J[10]+1),Dt=(J[9]+1)/J[5],Ut=(J[9]-1)/J[5],V=(J[8]-1)/J[0],ne=(Z[8]+1)/Z[0],Ht=bt*V,Lt=bt*ne,xt=q/(-V+ne),Ft=xt*-V;if(nt.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(Ft),Q.translateZ(xt),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),J[10]===-1)Q.projectionMatrix.copy(nt.projectionMatrix),Q.projectionMatrixInverse.copy(nt.projectionMatrixInverse);else{const Bt=bt+xt,z=zt+xt,R=Ht-Ft,j=Lt+(q-Ft),dt=Dt*zt/z*Bt,tt=Ut*zt/z*Bt;Q.projectionMatrix.makePerspective(R,j,dt,tt,Bt,z),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function W(Q,nt){nt===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(nt.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(a===null)return;let nt=Q.near,ht=Q.far;_.texture!==null&&(_.depthNear>0&&(nt=_.depthNear),_.depthFar>0&&(ht=_.depthFar)),M.near=T.near=A.near=nt,M.far=T.far=A.far=ht,(P!==M.near||L!==M.far)&&(a.updateRenderState({depthNear:M.near,depthFar:M.far}),P=M.near,L=M.far),A.layers.mask=Q.layers.mask|2,T.layers.mask=Q.layers.mask|4,M.layers.mask=A.layers.mask|T.layers.mask;const q=Q.parent,J=M.cameras;W(M,q);for(let Z=0;Z<J.length;Z++)W(J[Z],q);J.length===2?G(M,A,T):M.projectionMatrix.copy(A.projectionMatrix),ot(Q,M,q)};function ot(Q,nt,ht){ht===null?Q.matrix.copy(nt.matrixWorld):(Q.matrix.copy(ht.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(nt.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(nt.projectionMatrix),Q.projectionMatrixInverse.copy(nt.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=ro*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(Q){l=Q,d!==null&&(d.fixedFoveation=Q),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Q)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(M)};let gt=null;function Mt(Q,nt){if(h=nt.getViewerPose(c||o),m=nt,h!==null){const ht=h.views;f!==null&&(t.setRenderTargetFramebuffer(y,f.framebuffer),t.setRenderTarget(y));let q=!1;ht.length!==M.cameras.length&&(M.cameras.length=0,q=!0);for(let Z=0;Z<ht.length;Z++){const bt=ht[Z];let zt=null;if(f!==null)zt=f.getViewport(bt);else{const Ut=u.getViewSubImage(d,bt);zt=Ut.viewport,Z===0&&(t.setRenderTargetTextures(y,Ut.colorTexture,d.ignoreDepthValues?void 0:Ut.depthStencilTexture),t.setRenderTarget(y))}let Dt=b[Z];Dt===void 0&&(Dt=new Qn,Dt.layers.enable(Z),Dt.viewport=new qe,b[Z]=Dt),Dt.matrix.fromArray(bt.transform.matrix),Dt.matrix.decompose(Dt.position,Dt.quaternion,Dt.scale),Dt.projectionMatrix.fromArray(bt.projectionMatrix),Dt.projectionMatrixInverse.copy(Dt.projectionMatrix).invert(),Dt.viewport.set(zt.x,zt.y,zt.width,zt.height),Z===0&&(M.matrix.copy(Dt.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),q===!0&&M.cameras.push(Dt)}const J=a.enabledFeatures;if(J&&J.includes("depth-sensing")){const Z=u.getDepthInformation(ht[0]);Z&&Z.isValid&&Z.texture&&_.init(t,Z,a.renderState)}}for(let ht=0;ht<x.length;ht++){const q=v[ht],J=x[ht];q!==null&&J!==void 0&&J.update(q,nt,c||o)}gt&&gt(Q,nt),nt.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:nt}),m=null}const kt=new up;kt.setAnimationLoop(Mt),this.setAnimationLoop=function(Q){gt=Q},this.dispose=function(){}}}const va=new wi,Z1=new ze;function j1(n,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,lp(n)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function a(g,p,y,x,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(g,p):p.isMeshToonMaterial?(s(g,p),u(g,p)):p.isMeshPhongMaterial?(s(g,p),h(g,p)):p.isMeshStandardMaterial?(s(g,p),d(g,p),p.isMeshPhysicalMaterial&&f(g,p,v)):p.isMeshMatcapMaterial?(s(g,p),m(g,p)):p.isMeshDepthMaterial?s(g,p):p.isMeshDistanceMaterial?(s(g,p),_(g,p)):p.isMeshNormalMaterial?s(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&r(g,p)):p.isPointsMaterial?l(g,p,y,x):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Bn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Bn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const y=t.get(p),x=y.envMap,v=y.envMapRotation;x&&(g.envMap.value=x,va.copy(v),va.x*=-1,va.y*=-1,va.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(va.y*=-1,va.z*=-1),g.envMapRotation.value.setFromMatrix4(Z1.makeRotationFromEuler(va)),g.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function r(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,y,x){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*y,g.scale.value=x*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,y){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Bn&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=y.texture,g.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function _(g,p){const y=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(y.matrixWorld),g.nearDistance.value=y.shadow.camera.near,g.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:a}}function q1(n,t,e,i){let a={},s={},o=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,x){const v=x.program;i.uniformBlockBinding(y,v)}function c(y,x){let v=a[y.id];v===void 0&&(m(y),v=h(y),a[y.id]=v,y.addEventListener("dispose",g));const w=x.program;i.updateUBOMapping(y,w);const S=t.render.frame;s[y.id]!==S&&(d(y),s[y.id]=S)}function h(y){const x=u();y.__bindingPointIndex=x;const v=n.createBuffer(),w=y.__size,S=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,v),n.bufferData(n.UNIFORM_BUFFER,w,S),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,v),v}function u(){for(let y=0;y<r;y++)if(o.indexOf(y)===-1)return o.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){const x=a[y.id],v=y.uniforms,w=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let S=0,A=v.length;S<A;S++){const T=Array.isArray(v[S])?v[S]:[v[S]];for(let b=0,M=T.length;b<M;b++){const P=T[b];if(f(P,S,b,w)===!0){const L=P.__offset,F=Array.isArray(P.value)?P.value:[P.value];let O=0;for(let k=0;k<F.length;k++){const D=F[k],U=_(D);typeof D=="number"||typeof D=="boolean"?(P.__data[0]=D,n.bufferSubData(n.UNIFORM_BUFFER,L+O,P.__data)):D.isMatrix3?(P.__data[0]=D.elements[0],P.__data[1]=D.elements[1],P.__data[2]=D.elements[2],P.__data[3]=0,P.__data[4]=D.elements[3],P.__data[5]=D.elements[4],P.__data[6]=D.elements[5],P.__data[7]=0,P.__data[8]=D.elements[6],P.__data[9]=D.elements[7],P.__data[10]=D.elements[8],P.__data[11]=0):(D.toArray(P.__data,O),O+=U.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,L,P.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(y,x,v,w){const S=y.value,A=x+"_"+v;if(w[A]===void 0)return typeof S=="number"||typeof S=="boolean"?w[A]=S:w[A]=S.clone(),!0;{const T=w[A];if(typeof S=="number"||typeof S=="boolean"){if(T!==S)return w[A]=S,!0}else if(T.equals(S)===!1)return T.copy(S),!0}return!1}function m(y){const x=y.uniforms;let v=0;const w=16;for(let A=0,T=x.length;A<T;A++){const b=Array.isArray(x[A])?x[A]:[x[A]];for(let M=0,P=b.length;M<P;M++){const L=b[M],F=Array.isArray(L.value)?L.value:[L.value];for(let O=0,k=F.length;O<k;O++){const D=F[O],U=_(D),G=v%w,W=G%U.boundary,ot=G+W;v+=W,ot!==0&&w-ot<U.storage&&(v+=w-ot),L.__data=new Float32Array(U.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=v,v+=U.storage}}}const S=v%w;return S>0&&(v+=w-S),y.__size=v,y.__cache={},this}function _(y){const x={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(x.boundary=4,x.storage=4):y.isVector2?(x.boundary=8,x.storage=8):y.isVector3||y.isColor?(x.boundary=16,x.storage=12):y.isVector4?(x.boundary=16,x.storage=16):y.isMatrix3?(x.boundary=48,x.storage=48):y.isMatrix4?(x.boundary=64,x.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),x}function g(y){const x=y.target;x.removeEventListener("dispose",g);const v=o.indexOf(x.__bindingPointIndex);o.splice(v,1),n.deleteBuffer(a[x.id]),delete a[x.id],delete s[x.id]}function p(){for(const y in a)n.deleteBuffer(a[y]);o=[],a={},s={}}return{bind:l,update:c,dispose:p}}class K1{constructor(t={}){const{canvas:e=Ov(),context:i=null,depth:a=!0,stencil:s=!1,alpha:o=!1,antialias:r=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=o;const m=new Uint32Array(4),_=new Int32Array(4);let g=null,p=null;const y=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=In,this.toneMapping=oa,this.toneMappingExposure=1;const v=this;let w=!1,S=0,A=0,T=null,b=-1,M=null;const P=new qe,L=new qe;let F=null;const O=new Qt(0);let k=0,D=e.width,U=e.height,G=1,W=null,ot=null;const gt=new qe(0,0,D,U),Mt=new qe(0,0,D,U);let kt=!1;const Q=new wh;let nt=!1,ht=!1;const q=new ze,J=new ze,Z=new H,bt=new qe,zt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Dt=!1;function Ut(){return T===null?G:1}let V=i;function ne(C,Y){return e.getContext(C,Y)}try{const C={alpha:!0,depth:a,stencil:s,antialias:r,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${fh}`),e.addEventListener("webglcontextlost",ut,!1),e.addEventListener("webglcontextrestored",Pt,!1),e.addEventListener("webglcontextcreationerror",At,!1),V===null){const Y="webgl2";if(V=ne(Y,C),V===null)throw ne(Y)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let Ht,Lt,xt,Ft,Bt,z,R,j,dt,tt,ct,It,et,ft,Nt,rt,wt,B,lt,vt,Xt,Gt,$t,N;function Rt(){Ht=new nb(V),Ht.init(),Gt=new H1(V,Ht),Lt=new qM(V,Ht,t,Gt),xt=new N1(V,Ht),Lt.reverseDepthBuffer&&d&&xt.buffers.depth.setReversed(!0),Ft=new sb(V),Bt=new S1,z=new B1(V,Ht,xt,Bt,Lt,Gt,Ft),R=new JM(v),j=new eb(v),dt=new uy(V),$t=new ZM(V,dt),tt=new ib(V,dt,Ft,$t),ct=new rb(V,tt,dt,Ft),lt=new ob(V,Lt,z),rt=new KM(Bt),It=new b1(v,R,j,Ht,Lt,$t,rt),et=new j1(v,Bt),ft=new E1,Nt=new L1(Ht),B=new $M(v,R,j,xt,ct,f,l),wt=new F1(v,ct,Lt),N=new q1(V,Ft,Lt,xt),vt=new jM(V,Ht,Ft),Xt=new ab(V,Ht,Ft),Ft.programs=It.programs,v.capabilities=Lt,v.extensions=Ht,v.properties=Bt,v.renderLists=ft,v.shadowMap=wt,v.state=xt,v.info=Ft}Rt();const it=new $1(v,V);this.xr=it,this.getContext=function(){return V},this.getContextAttributes=function(){return V.getContextAttributes()},this.forceContextLoss=function(){const C=Ht.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=Ht.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(C){C!==void 0&&(G=C,this.setSize(D,U,!1))},this.getSize=function(C){return C.set(D,U)},this.setSize=function(C,Y,st=!0){if(it.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}D=C,U=Y,e.width=Math.floor(C*G),e.height=Math.floor(Y*G),st===!0&&(e.style.width=C+"px",e.style.height=Y+"px"),this.setViewport(0,0,C,Y)},this.getDrawingBufferSize=function(C){return C.set(D*G,U*G).floor()},this.setDrawingBufferSize=function(C,Y,st){D=C,U=Y,G=st,e.width=Math.floor(C*st),e.height=Math.floor(Y*st),this.setViewport(0,0,C,Y)},this.getCurrentViewport=function(C){return C.copy(P)},this.getViewport=function(C){return C.copy(gt)},this.setViewport=function(C,Y,st,at){C.isVector4?gt.set(C.x,C.y,C.z,C.w):gt.set(C,Y,st,at),xt.viewport(P.copy(gt).multiplyScalar(G).round())},this.getScissor=function(C){return C.copy(Mt)},this.setScissor=function(C,Y,st,at){C.isVector4?Mt.set(C.x,C.y,C.z,C.w):Mt.set(C,Y,st,at),xt.scissor(L.copy(Mt).multiplyScalar(G).round())},this.getScissorTest=function(){return kt},this.setScissorTest=function(C){xt.setScissorTest(kt=C)},this.setOpaqueSort=function(C){W=C},this.setTransparentSort=function(C){ot=C},this.getClearColor=function(C){return C.copy(B.getClearColor())},this.setClearColor=function(){B.setClearColor.apply(B,arguments)},this.getClearAlpha=function(){return B.getClearAlpha()},this.setClearAlpha=function(){B.setClearAlpha.apply(B,arguments)},this.clear=function(C=!0,Y=!0,st=!0){let at=0;if(C){let E=!1;if(T!==null){const X=T.texture.format;E=X===_h||X===yh||X===vh}if(E){const X=T.texture.type,K=X===Gi||X===Ca||X===oo||X===ws||X===gh||X===xh,yt=B.getClearColor(),St=B.getClearAlpha(),mt=yt.r,Et=yt.g,Ot=yt.b;K?(m[0]=mt,m[1]=Et,m[2]=Ot,m[3]=St,V.clearBufferuiv(V.COLOR,0,m)):(_[0]=mt,_[1]=Et,_[2]=Ot,_[3]=St,V.clearBufferiv(V.COLOR,0,_))}else at|=V.COLOR_BUFFER_BIT}Y&&(at|=V.DEPTH_BUFFER_BIT),st&&(at|=V.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V.clear(at)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ut,!1),e.removeEventListener("webglcontextrestored",Pt,!1),e.removeEventListener("webglcontextcreationerror",At,!1),ft.dispose(),Nt.dispose(),Bt.dispose(),R.dispose(),j.dispose(),ct.dispose(),$t.dispose(),N.dispose(),It.dispose(),it.dispose(),it.removeEventListener("sessionstart",yn),it.removeEventListener("sessionend",Xe),Ie.stop()};function ut(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function Pt(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const C=Ft.autoReset,Y=wt.enabled,st=wt.autoUpdate,at=wt.needsUpdate,E=wt.type;Rt(),Ft.autoReset=C,wt.enabled=Y,wt.autoUpdate=st,wt.needsUpdate=at,wt.type=E}function At(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function qt(C){const Y=C.target;Y.removeEventListener("dispose",qt),ee(Y)}function ee(C){re(C),Bt.remove(C)}function re(C){const Y=Bt.get(C).programs;Y!==void 0&&(Y.forEach(function(st){It.releaseProgram(st)}),C.isShaderMaterial&&It.releaseShaderCache(C))}this.renderBufferDirect=function(C,Y,st,at,E,X){Y===null&&(Y=zt);const K=E.isMesh&&E.matrixWorld.determinant()<0,yt=ce(C,Y,st,at,E);xt.setMaterial(at,K);let St=st.index,mt=1;if(at.wireframe===!0){if(St=tt.getWireframeAttribute(st),St===void 0)return;mt=2}const Et=st.drawRange,Ot=st.attributes.position;let Jt=Et.start*mt,se=(Et.start+Et.count)*mt;X!==null&&(Jt=Math.max(Jt,X.start*mt),se=Math.min(se,(X.start+X.count)*mt)),St!==null?(Jt=Math.max(Jt,0),se=Math.min(se,St.count)):Ot!=null&&(Jt=Math.max(Jt,0),se=Math.min(se,Ot.count));const ge=se-Jt;if(ge<0||ge===1/0)return;$t.setup(E,at,yt,st,St);let Ee,fe=vt;if(St!==null&&(Ee=dt.get(St),fe=Xt,fe.setIndex(Ee)),E.isMesh)at.wireframe===!0?(xt.setLineWidth(at.wireframeLinewidth*Ut()),fe.setMode(V.LINES)):fe.setMode(V.TRIANGLES);else if(E.isLine){let Yt=at.linewidth;Yt===void 0&&(Yt=1),xt.setLineWidth(Yt*Ut()),E.isLineSegments?fe.setMode(V.LINES):E.isLineLoop?fe.setMode(V.LINE_LOOP):fe.setMode(V.LINE_STRIP)}else E.isPoints?fe.setMode(V.POINTS):E.isSprite&&fe.setMode(V.TRIANGLES);if(E.isBatchedMesh)if(E._multiDrawInstances!==null)fe.renderMultiDrawInstances(E._multiDrawStarts,E._multiDrawCounts,E._multiDrawCount,E._multiDrawInstances);else if(Ht.get("WEBGL_multi_draw"))fe.renderMultiDraw(E._multiDrawStarts,E._multiDrawCounts,E._multiDrawCount);else{const Yt=E._multiDrawStarts,Qe=E._multiDrawCounts,xe=E._multiDrawCount,Fe=St?dt.get(St).bytesPerElement:1,An=Bt.get(at).currentProgram.getUniforms();for(let Ye=0;Ye<xe;Ye++)An.setValue(V,"_gl_DrawID",Ye),fe.render(Yt[Ye]/Fe,Qe[Ye])}else if(E.isInstancedMesh)fe.renderInstances(Jt,ge,E.count);else if(st.isInstancedBufferGeometry){const Yt=st._maxInstanceCount!==void 0?st._maxInstanceCount:1/0,Qe=Math.min(st.instanceCount,Yt);fe.renderInstances(Jt,ge,Qe)}else fe.render(Jt,ge)};function te(C,Y,st){C.transparent===!0&&C.side===Oe&&C.forceSinglePass===!1?(C.side=Bn,C.needsUpdate=!0,an(C,Y,st),C.side=ca,C.needsUpdate=!0,an(C,Y,st),C.side=Oe):an(C,Y,st)}this.compile=function(C,Y,st=null){st===null&&(st=C),p=Nt.get(st),p.init(Y),x.push(p),st.traverseVisible(function(E){E.isLight&&E.layers.test(Y.layers)&&(p.pushLight(E),E.castShadow&&p.pushShadow(E))}),C!==st&&C.traverseVisible(function(E){E.isLight&&E.layers.test(Y.layers)&&(p.pushLight(E),E.castShadow&&p.pushShadow(E))}),p.setupLights();const at=new Set;return C.traverse(function(E){if(!(E.isMesh||E.isPoints||E.isLine||E.isSprite))return;const X=E.material;if(X)if(Array.isArray(X))for(let K=0;K<X.length;K++){const yt=X[K];te(yt,st,E),at.add(yt)}else te(X,st,E),at.add(X)}),x.pop(),p=null,at},this.compileAsync=function(C,Y,st=null){const at=this.compile(C,Y,st);return new Promise(E=>{function X(){if(at.forEach(function(K){Bt.get(K).currentProgram.isReady()&&at.delete(K)}),at.size===0){E(C);return}setTimeout(X,10)}Ht.get("KHR_parallel_shader_compile")!==null?X():setTimeout(X,10)})};let we=null;function De(C){we&&we(C)}function yn(){Ie.stop()}function Xe(){Ie.start()}const Ie=new up;Ie.setAnimationLoop(De),typeof self<"u"&&Ie.setContext(self),this.setAnimationLoop=function(C){we=C,it.setAnimationLoop(C),C===null?Ie.stop():Ie.start()},it.addEventListener("sessionstart",yn),it.addEventListener("sessionend",Xe),this.render=function(C,Y){if(Y!==void 0&&Y.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),Y.parent===null&&Y.matrixWorldAutoUpdate===!0&&Y.updateMatrixWorld(),it.enabled===!0&&it.isPresenting===!0&&(it.cameraAutoUpdate===!0&&it.updateCamera(Y),Y=it.getCamera()),C.isScene===!0&&C.onBeforeRender(v,C,Y,T),p=Nt.get(C,x.length),p.init(Y),x.push(p),J.multiplyMatrices(Y.projectionMatrix,Y.matrixWorldInverse),Q.setFromProjectionMatrix(J),ht=this.localClippingEnabled,nt=rt.init(this.clippingPlanes,ht),g=ft.get(C,y.length),g.init(),y.push(g),it.enabled===!0&&it.isPresenting===!0){const X=v.xr.getDepthSensingMesh();X!==null&&ye(X,Y,-1/0,v.sortObjects)}ye(C,Y,0,v.sortObjects),g.finish(),v.sortObjects===!0&&g.sort(W,ot),Dt=it.enabled===!1||it.isPresenting===!1||it.hasDepthSensing()===!1,Dt&&B.addToRenderList(g,C),this.info.render.frame++,nt===!0&&rt.beginShadows();const st=p.state.shadowsArray;wt.render(st,C,Y),nt===!0&&rt.endShadows(),this.info.autoReset===!0&&this.info.reset();const at=g.opaque,E=g.transmissive;if(p.setupLights(),Y.isArrayCamera){const X=Y.cameras;if(E.length>0)for(let K=0,yt=X.length;K<yt;K++){const St=X[K];wn(at,E,C,St)}Dt&&B.render(C);for(let K=0,yt=X.length;K<yt;K++){const St=X[K];We(g,C,St,St.viewport)}}else E.length>0&&wn(at,E,C,Y),Dt&&B.render(C),We(g,C,Y);T!==null&&(z.updateMultisampleRenderTarget(T),z.updateRenderTargetMipmap(T)),C.isScene===!0&&C.onAfterRender(v,C,Y),$t.resetDefaultState(),b=-1,M=null,x.pop(),x.length>0?(p=x[x.length-1],nt===!0&&rt.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,y.pop(),y.length>0?g=y[y.length-1]:g=null};function ye(C,Y,st,at){if(C.visible===!1)return;if(C.layers.test(Y.layers)){if(C.isGroup)st=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(Y);else if(C.isLight)p.pushLight(C),C.castShadow&&p.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||Q.intersectsSprite(C)){at&&bt.setFromMatrixPosition(C.matrixWorld).applyMatrix4(J);const K=ct.update(C),yt=C.material;yt.visible&&g.push(C,K,yt,st,bt.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||Q.intersectsObject(C))){const K=ct.update(C),yt=C.material;if(at&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),bt.copy(C.boundingSphere.center)):(K.boundingSphere===null&&K.computeBoundingSphere(),bt.copy(K.boundingSphere.center)),bt.applyMatrix4(C.matrixWorld).applyMatrix4(J)),Array.isArray(yt)){const St=K.groups;for(let mt=0,Et=St.length;mt<Et;mt++){const Ot=St[mt],Jt=yt[Ot.materialIndex];Jt&&Jt.visible&&g.push(C,K,Jt,st,bt.z,Ot)}}else yt.visible&&g.push(C,K,yt,st,bt.z,null)}}const X=C.children;for(let K=0,yt=X.length;K<yt;K++)ye(X[K],Y,st,at)}function We(C,Y,st,at){const E=C.opaque,X=C.transmissive,K=C.transparent;p.setupLightsView(st),nt===!0&&rt.setGlobalState(v.clippingPlanes,st),at&&xt.viewport(P.copy(at)),E.length>0&&Je(E,Y,st),X.length>0&&Je(X,Y,st),K.length>0&&Je(K,Y,st),xt.buffers.depth.setTest(!0),xt.buffers.depth.setMask(!0),xt.buffers.color.setMask(!0),xt.setPolygonOffset(!1)}function wn(C,Y,st,at){if((st.isScene===!0?st.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[at.id]===void 0&&(p.state.transmissionRenderTarget[at.id]=new La(1,1,{generateMipmaps:!0,type:Ht.has("EXT_color_buffer_half_float")||Ht.has("EXT_color_buffer_float")?mo:Gi,minFilter:Ra,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Me.workingColorSpace}));const X=p.state.transmissionRenderTarget[at.id],K=at.viewport||P;X.setSize(K.z,K.w);const yt=v.getRenderTarget();v.setRenderTarget(X),v.getClearColor(O),k=v.getClearAlpha(),k<1&&v.setClearColor(16777215,.5),v.clear(),Dt&&B.render(st);const St=v.toneMapping;v.toneMapping=oa;const mt=at.viewport;if(at.viewport!==void 0&&(at.viewport=void 0),p.setupLightsView(at),nt===!0&&rt.setGlobalState(v.clippingPlanes,at),Je(C,st,at),z.updateMultisampleRenderTarget(X),z.updateRenderTargetMipmap(X),Ht.has("WEBGL_multisampled_render_to_texture")===!1){let Et=!1;for(let Ot=0,Jt=Y.length;Ot<Jt;Ot++){const se=Y[Ot],ge=se.object,Ee=se.geometry,fe=se.material,Yt=se.group;if(fe.side===Oe&&ge.layers.test(at.layers)){const Qe=fe.side;fe.side=Bn,fe.needsUpdate=!0,En(ge,st,at,Ee,fe,Yt),fe.side=Qe,fe.needsUpdate=!0,Et=!0}}Et===!0&&(z.updateMultisampleRenderTarget(X),z.updateRenderTargetMipmap(X))}v.setRenderTarget(yt),v.setClearColor(O,k),mt!==void 0&&(at.viewport=mt),v.toneMapping=St}function Je(C,Y,st){const at=Y.isScene===!0?Y.overrideMaterial:null;for(let E=0,X=C.length;E<X;E++){const K=C[E],yt=K.object,St=K.geometry,mt=at===null?K.material:at,Et=K.group;yt.layers.test(st.layers)&&En(yt,Y,st,St,mt,Et)}}function En(C,Y,st,at,E,X){C.onBeforeRender(v,Y,st,at,E,X),C.modelViewMatrix.multiplyMatrices(st.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),E.onBeforeRender(v,Y,st,at,C,X),E.transparent===!0&&E.side===Oe&&E.forceSinglePass===!1?(E.side=Bn,E.needsUpdate=!0,v.renderBufferDirect(st,Y,at,E,C,X),E.side=ca,E.needsUpdate=!0,v.renderBufferDirect(st,Y,at,E,C,X),E.side=Oe):v.renderBufferDirect(st,Y,at,E,C,X),C.onAfterRender(v,Y,st,at,E,X)}function an(C,Y,st){Y.isScene!==!0&&(Y=zt);const at=Bt.get(C),E=p.state.lights,X=p.state.shadowsArray,K=E.state.version,yt=It.getParameters(C,E.state,X,Y,st),St=It.getProgramCacheKey(yt);let mt=at.programs;at.environment=C.isMeshStandardMaterial?Y.environment:null,at.fog=Y.fog,at.envMap=(C.isMeshStandardMaterial?j:R).get(C.envMap||at.environment),at.envMapRotation=at.environment!==null&&C.envMap===null?Y.environmentRotation:C.envMapRotation,mt===void 0&&(C.addEventListener("dispose",qt),mt=new Map,at.programs=mt);let Et=mt.get(St);if(Et!==void 0){if(at.currentProgram===Et&&at.lightsStateVersion===K)return Fn(C,yt),Et}else yt.uniforms=It.getUniforms(C),C.onBeforeCompile(yt,v),Et=It.acquireProgram(yt,St),mt.set(St,Et),at.uniforms=yt.uniforms;const Ot=at.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(Ot.clippingPlanes=rt.uniform),Fn(C,yt),at.needsLights=Gn(C),at.lightsStateVersion=K,at.needsLights&&(Ot.ambientLightColor.value=E.state.ambient,Ot.lightProbe.value=E.state.probe,Ot.directionalLights.value=E.state.directional,Ot.directionalLightShadows.value=E.state.directionalShadow,Ot.spotLights.value=E.state.spot,Ot.spotLightShadows.value=E.state.spotShadow,Ot.rectAreaLights.value=E.state.rectArea,Ot.ltc_1.value=E.state.rectAreaLTC1,Ot.ltc_2.value=E.state.rectAreaLTC2,Ot.pointLights.value=E.state.point,Ot.pointLightShadows.value=E.state.pointShadow,Ot.hemisphereLights.value=E.state.hemi,Ot.directionalShadowMap.value=E.state.directionalShadowMap,Ot.directionalShadowMatrix.value=E.state.directionalShadowMatrix,Ot.spotShadowMap.value=E.state.spotShadowMap,Ot.spotLightMatrix.value=E.state.spotLightMatrix,Ot.spotLightMap.value=E.state.spotLightMap,Ot.pointShadowMap.value=E.state.pointShadowMap,Ot.pointShadowMatrix.value=E.state.pointShadowMatrix),at.currentProgram=Et,at.uniformsList=null,Et}function sn(C){if(C.uniformsList===null){const Y=C.currentProgram.getUniforms();C.uniformsList=mr.seqWithValue(Y.seq,C.uniforms)}return C.uniformsList}function Fn(C,Y){const st=Bt.get(C);st.outputColorSpace=Y.outputColorSpace,st.batching=Y.batching,st.batchingColor=Y.batchingColor,st.instancing=Y.instancing,st.instancingColor=Y.instancingColor,st.instancingMorph=Y.instancingMorph,st.skinning=Y.skinning,st.morphTargets=Y.morphTargets,st.morphNormals=Y.morphNormals,st.morphColors=Y.morphColors,st.morphTargetsCount=Y.morphTargetsCount,st.numClippingPlanes=Y.numClippingPlanes,st.numIntersection=Y.numClipIntersection,st.vertexAlphas=Y.vertexAlphas,st.vertexTangents=Y.vertexTangents,st.toneMapping=Y.toneMapping}function ce(C,Y,st,at,E){Y.isScene!==!0&&(Y=zt),z.resetTextureUnits();const X=Y.fog,K=at.isMeshStandardMaterial?Y.environment:null,yt=T===null?v.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:As,St=(at.isMeshStandardMaterial?j:R).get(at.envMap||K),mt=at.vertexColors===!0&&!!st.attributes.color&&st.attributes.color.itemSize===4,Et=!!st.attributes.tangent&&(!!at.normalMap||at.anisotropy>0),Ot=!!st.morphAttributes.position,Jt=!!st.morphAttributes.normal,se=!!st.morphAttributes.color;let ge=oa;at.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(ge=v.toneMapping);const Ee=st.morphAttributes.position||st.morphAttributes.normal||st.morphAttributes.color,fe=Ee!==void 0?Ee.length:0,Yt=Bt.get(at),Qe=p.state.lights;if(nt===!0&&(ht===!0||C!==M)){const hn=C===M&&at.id===b;rt.setState(at,C,hn)}let xe=!1;at.version===Yt.__version?(Yt.needsLights&&Yt.lightsStateVersion!==Qe.state.version||Yt.outputColorSpace!==yt||E.isBatchedMesh&&Yt.batching===!1||!E.isBatchedMesh&&Yt.batching===!0||E.isBatchedMesh&&Yt.batchingColor===!0&&E.colorTexture===null||E.isBatchedMesh&&Yt.batchingColor===!1&&E.colorTexture!==null||E.isInstancedMesh&&Yt.instancing===!1||!E.isInstancedMesh&&Yt.instancing===!0||E.isSkinnedMesh&&Yt.skinning===!1||!E.isSkinnedMesh&&Yt.skinning===!0||E.isInstancedMesh&&Yt.instancingColor===!0&&E.instanceColor===null||E.isInstancedMesh&&Yt.instancingColor===!1&&E.instanceColor!==null||E.isInstancedMesh&&Yt.instancingMorph===!0&&E.morphTexture===null||E.isInstancedMesh&&Yt.instancingMorph===!1&&E.morphTexture!==null||Yt.envMap!==St||at.fog===!0&&Yt.fog!==X||Yt.numClippingPlanes!==void 0&&(Yt.numClippingPlanes!==rt.numPlanes||Yt.numIntersection!==rt.numIntersection)||Yt.vertexAlphas!==mt||Yt.vertexTangents!==Et||Yt.morphTargets!==Ot||Yt.morphNormals!==Jt||Yt.morphColors!==se||Yt.toneMapping!==ge||Yt.morphTargetsCount!==fe)&&(xe=!0):(xe=!0,Yt.__version=at.version);let Fe=Yt.currentProgram;xe===!0&&(Fe=an(at,Y,E));let An=!1,Ye=!1,Rn=!1;const he=Fe.getUniforms(),be=Yt.uniforms;if(xt.useProgram(Fe.program)&&(An=!0,Ye=!0,Rn=!0),at.id!==b&&(b=at.id,Ye=!0),An||M!==C){xt.buffers.depth.getReversed()?(q.copy(C.projectionMatrix),Hv(q),Gv(q),he.setValue(V,"projectionMatrix",q)):he.setValue(V,"projectionMatrix",C.projectionMatrix),he.setValue(V,"viewMatrix",C.matrixWorldInverse);const $e=he.map.cameraPosition;$e!==void 0&&$e.setValue(V,Z.setFromMatrixPosition(C.matrixWorld)),Lt.logarithmicDepthBuffer&&he.setValue(V,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(at.isMeshPhongMaterial||at.isMeshToonMaterial||at.isMeshLambertMaterial||at.isMeshBasicMaterial||at.isMeshStandardMaterial||at.isShaderMaterial)&&he.setValue(V,"isOrthographic",C.isOrthographicCamera===!0),M!==C&&(M=C,Ye=!0,Rn=!0)}if(E.isSkinnedMesh){he.setOptional(V,E,"bindMatrix"),he.setOptional(V,E,"bindMatrixInverse");const hn=E.skeleton;hn&&(hn.boneTexture===null&&hn.computeBoneTexture(),he.setValue(V,"boneTexture",hn.boneTexture,z))}E.isBatchedMesh&&(he.setOptional(V,E,"batchingTexture"),he.setValue(V,"batchingTexture",E._matricesTexture,z),he.setOptional(V,E,"batchingIdTexture"),he.setValue(V,"batchingIdTexture",E._indirectTexture,z),he.setOptional(V,E,"batchingColorTexture"),E._colorsTexture!==null&&he.setValue(V,"batchingColorTexture",E._colorsTexture,z));const Un=st.morphAttributes;if((Un.position!==void 0||Un.normal!==void 0||Un.color!==void 0)&&lt.update(E,st,Fe),(Ye||Yt.receiveShadow!==E.receiveShadow)&&(Yt.receiveShadow=E.receiveShadow,he.setValue(V,"receiveShadow",E.receiveShadow)),at.isMeshGouraudMaterial&&at.envMap!==null&&(be.envMap.value=St,be.flipEnvMap.value=St.isCubeTexture&&St.isRenderTargetTexture===!1?-1:1),at.isMeshStandardMaterial&&at.envMap===null&&Y.environment!==null&&(be.envMapIntensity.value=Y.environmentIntensity),Ye&&(he.setValue(V,"toneMappingExposure",v.toneMappingExposure),Yt.needsLights&&Tn(be,Rn),X&&at.fog===!0&&et.refreshFogUniforms(be,X),et.refreshMaterialUniforms(be,at,G,U,p.state.transmissionRenderTarget[C.id]),mr.upload(V,sn(Yt),be,z)),at.isShaderMaterial&&at.uniformsNeedUpdate===!0&&(mr.upload(V,sn(Yt),be,z),at.uniformsNeedUpdate=!1),at.isSpriteMaterial&&he.setValue(V,"center",E.center),he.setValue(V,"modelViewMatrix",E.modelViewMatrix),he.setValue(V,"normalMatrix",E.normalMatrix),he.setValue(V,"modelMatrix",E.matrixWorld),at.isShaderMaterial||at.isRawShaderMaterial){const hn=at.uniformsGroups;for(let $e=0,Tt=hn.length;$e<Tt;$e++){const Ct=hn[$e];N.update(Ct,Fe),N.bind(Ct,Fe)}}return Fe}function Tn(C,Y){C.ambientLightColor.needsUpdate=Y,C.lightProbe.needsUpdate=Y,C.directionalLights.needsUpdate=Y,C.directionalLightShadows.needsUpdate=Y,C.pointLights.needsUpdate=Y,C.pointLightShadows.needsUpdate=Y,C.spotLights.needsUpdate=Y,C.spotLightShadows.needsUpdate=Y,C.rectAreaLights.needsUpdate=Y,C.hemisphereLights.needsUpdate=Y}function Gn(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(C,Y,st){Bt.get(C.texture).__webglTexture=Y,Bt.get(C.depthTexture).__webglTexture=st;const at=Bt.get(C);at.__hasExternalTextures=!0,at.__autoAllocateDepthBuffer=st===void 0,at.__autoAllocateDepthBuffer||Ht.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),at.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(C,Y){const st=Bt.get(C);st.__webglFramebuffer=Y,st.__useDefaultFramebuffer=Y===void 0},this.setRenderTarget=function(C,Y=0,st=0){T=C,S=Y,A=st;let at=!0,E=null,X=!1,K=!1;if(C){const St=Bt.get(C);if(St.__useDefaultFramebuffer!==void 0)xt.bindFramebuffer(V.FRAMEBUFFER,null),at=!1;else if(St.__webglFramebuffer===void 0)z.setupRenderTarget(C);else if(St.__hasExternalTextures)z.rebindTextures(C,Bt.get(C.texture).__webglTexture,Bt.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){const Ot=C.depthTexture;if(St.__boundDepthTexture!==Ot){if(Ot!==null&&Bt.has(Ot)&&(C.width!==Ot.image.width||C.height!==Ot.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");z.setupDepthRenderbuffer(C)}}const mt=C.texture;(mt.isData3DTexture||mt.isDataArrayTexture||mt.isCompressedArrayTexture)&&(K=!0);const Et=Bt.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(Et[Y])?E=Et[Y][st]:E=Et[Y],X=!0):C.samples>0&&z.useMultisampledRTT(C)===!1?E=Bt.get(C).__webglMultisampledFramebuffer:Array.isArray(Et)?E=Et[st]:E=Et,P.copy(C.viewport),L.copy(C.scissor),F=C.scissorTest}else P.copy(gt).multiplyScalar(G).floor(),L.copy(Mt).multiplyScalar(G).floor(),F=kt;if(xt.bindFramebuffer(V.FRAMEBUFFER,E)&&at&&xt.drawBuffers(C,E),xt.viewport(P),xt.scissor(L),xt.setScissorTest(F),X){const St=Bt.get(C.texture);V.framebufferTexture2D(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_CUBE_MAP_POSITIVE_X+Y,St.__webglTexture,st)}else if(K){const St=Bt.get(C.texture),mt=Y||0;V.framebufferTextureLayer(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,St.__webglTexture,st||0,mt)}b=-1},this.readRenderTargetPixels=function(C,Y,st,at,E,X,K){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let yt=Bt.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&K!==void 0&&(yt=yt[K]),yt){xt.bindFramebuffer(V.FRAMEBUFFER,yt);try{const St=C.texture,mt=St.format,Et=St.type;if(!Lt.textureFormatReadable(mt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Lt.textureTypeReadable(Et)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Y>=0&&Y<=C.width-at&&st>=0&&st<=C.height-E&&V.readPixels(Y,st,at,E,Gt.convert(mt),Gt.convert(Et),X)}finally{const St=T!==null?Bt.get(T).__webglFramebuffer:null;xt.bindFramebuffer(V.FRAMEBUFFER,St)}}},this.readRenderTargetPixelsAsync=async function(C,Y,st,at,E,X,K){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let yt=Bt.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&K!==void 0&&(yt=yt[K]),yt){const St=C.texture,mt=St.format,Et=St.type;if(!Lt.textureFormatReadable(mt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Lt.textureTypeReadable(Et))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(Y>=0&&Y<=C.width-at&&st>=0&&st<=C.height-E){xt.bindFramebuffer(V.FRAMEBUFFER,yt);const Ot=V.createBuffer();V.bindBuffer(V.PIXEL_PACK_BUFFER,Ot),V.bufferData(V.PIXEL_PACK_BUFFER,X.byteLength,V.STREAM_READ),V.readPixels(Y,st,at,E,Gt.convert(mt),Gt.convert(Et),0);const Jt=T!==null?Bt.get(T).__webglFramebuffer:null;xt.bindFramebuffer(V.FRAMEBUFFER,Jt);const se=V.fenceSync(V.SYNC_GPU_COMMANDS_COMPLETE,0);return V.flush(),await Bv(V,se,4),V.bindBuffer(V.PIXEL_PACK_BUFFER,Ot),V.getBufferSubData(V.PIXEL_PACK_BUFFER,0,X),V.deleteBuffer(Ot),V.deleteSync(se),X}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(C,Y=null,st=0){C.isTexture!==!0&&(Ws("WebGLRenderer: copyFramebufferToTexture function signature has changed."),Y=arguments[0]||null,C=arguments[1]);const at=Math.pow(2,-st),E=Math.floor(C.image.width*at),X=Math.floor(C.image.height*at),K=Y!==null?Y.x:0,yt=Y!==null?Y.y:0;z.setTexture2D(C,0),V.copyTexSubImage2D(V.TEXTURE_2D,st,0,0,K,yt,E,X),xt.unbindTexture()},this.copyTextureToTexture=function(C,Y,st=null,at=null,E=0){C.isTexture!==!0&&(Ws("WebGLRenderer: copyTextureToTexture function signature has changed."),at=arguments[0]||null,C=arguments[1],Y=arguments[2],E=arguments[3]||0,st=null);let X,K,yt,St,mt,Et,Ot,Jt,se;const ge=C.isCompressedTexture?C.mipmaps[E]:C.image;st!==null?(X=st.max.x-st.min.x,K=st.max.y-st.min.y,yt=st.isBox3?st.max.z-st.min.z:1,St=st.min.x,mt=st.min.y,Et=st.isBox3?st.min.z:0):(X=ge.width,K=ge.height,yt=ge.depth||1,St=0,mt=0,Et=0),at!==null?(Ot=at.x,Jt=at.y,se=at.z):(Ot=0,Jt=0,se=0);const Ee=Gt.convert(Y.format),fe=Gt.convert(Y.type);let Yt;Y.isData3DTexture?(z.setTexture3D(Y,0),Yt=V.TEXTURE_3D):Y.isDataArrayTexture||Y.isCompressedArrayTexture?(z.setTexture2DArray(Y,0),Yt=V.TEXTURE_2D_ARRAY):(z.setTexture2D(Y,0),Yt=V.TEXTURE_2D),V.pixelStorei(V.UNPACK_FLIP_Y_WEBGL,Y.flipY),V.pixelStorei(V.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Y.premultiplyAlpha),V.pixelStorei(V.UNPACK_ALIGNMENT,Y.unpackAlignment);const Qe=V.getParameter(V.UNPACK_ROW_LENGTH),xe=V.getParameter(V.UNPACK_IMAGE_HEIGHT),Fe=V.getParameter(V.UNPACK_SKIP_PIXELS),An=V.getParameter(V.UNPACK_SKIP_ROWS),Ye=V.getParameter(V.UNPACK_SKIP_IMAGES);V.pixelStorei(V.UNPACK_ROW_LENGTH,ge.width),V.pixelStorei(V.UNPACK_IMAGE_HEIGHT,ge.height),V.pixelStorei(V.UNPACK_SKIP_PIXELS,St),V.pixelStorei(V.UNPACK_SKIP_ROWS,mt),V.pixelStorei(V.UNPACK_SKIP_IMAGES,Et);const Rn=C.isDataArrayTexture||C.isData3DTexture,he=Y.isDataArrayTexture||Y.isData3DTexture;if(C.isRenderTargetTexture||C.isDepthTexture){const be=Bt.get(C),Un=Bt.get(Y),hn=Bt.get(be.__renderTarget),$e=Bt.get(Un.__renderTarget);xt.bindFramebuffer(V.READ_FRAMEBUFFER,hn.__webglFramebuffer),xt.bindFramebuffer(V.DRAW_FRAMEBUFFER,$e.__webglFramebuffer);for(let Tt=0;Tt<yt;Tt++)Rn&&V.framebufferTextureLayer(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,Bt.get(C).__webglTexture,E,Et+Tt),C.isDepthTexture?(he&&V.framebufferTextureLayer(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,Bt.get(Y).__webglTexture,E,se+Tt),V.blitFramebuffer(St,mt,X,K,Ot,Jt,X,K,V.DEPTH_BUFFER_BIT,V.NEAREST)):he?V.copyTexSubImage3D(Yt,E,Ot,Jt,se+Tt,St,mt,X,K):V.copyTexSubImage2D(Yt,E,Ot,Jt,se+Tt,St,mt,X,K);xt.bindFramebuffer(V.READ_FRAMEBUFFER,null),xt.bindFramebuffer(V.DRAW_FRAMEBUFFER,null)}else he?C.isDataTexture||C.isData3DTexture?V.texSubImage3D(Yt,E,Ot,Jt,se,X,K,yt,Ee,fe,ge.data):Y.isCompressedArrayTexture?V.compressedTexSubImage3D(Yt,E,Ot,Jt,se,X,K,yt,Ee,ge.data):V.texSubImage3D(Yt,E,Ot,Jt,se,X,K,yt,Ee,fe,ge):C.isDataTexture?V.texSubImage2D(V.TEXTURE_2D,E,Ot,Jt,X,K,Ee,fe,ge.data):C.isCompressedTexture?V.compressedTexSubImage2D(V.TEXTURE_2D,E,Ot,Jt,ge.width,ge.height,Ee,ge.data):V.texSubImage2D(V.TEXTURE_2D,E,Ot,Jt,X,K,Ee,fe,ge);V.pixelStorei(V.UNPACK_ROW_LENGTH,Qe),V.pixelStorei(V.UNPACK_IMAGE_HEIGHT,xe),V.pixelStorei(V.UNPACK_SKIP_PIXELS,Fe),V.pixelStorei(V.UNPACK_SKIP_ROWS,An),V.pixelStorei(V.UNPACK_SKIP_IMAGES,Ye),E===0&&Y.generateMipmaps&&V.generateMipmap(Yt),xt.unbindTexture()},this.copyTextureToTexture3D=function(C,Y,st=null,at=null,E=0){return C.isTexture!==!0&&(Ws("WebGLRenderer: copyTextureToTexture3D function signature has changed."),st=arguments[0]||null,at=arguments[1]||null,C=arguments[2],Y=arguments[3],E=arguments[4]||0),Ws('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(C,Y,st,at,E)},this.initRenderTarget=function(C){Bt.get(C).__webglFramebuffer===void 0&&z.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?z.setTextureCube(C,0):C.isData3DTexture?z.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?z.setTexture2DArray(C,0):z.setTexture2D(C,0),xt.unbindTexture()},this.resetState=function(){S=0,A=0,T=null,xt.reset(),$t.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Bi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Me._getDrawingBufferColorSpace(t),e.unpackColorSpace=Me._getUnpackColorSpace()}}class J1 extends Ve{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new wi,this.environmentIntensity=1,this.environmentRotation=new wi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Q1{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Zl,this.updateRanges=[],this.version=0,this.uuid=Si()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let a=0,s=this.stride;a<s;a++)this.array[t+a]=e.array[i+a];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Si()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Si()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Dn=new H;class Pr{constructor(t,e,i,a=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=a}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)Dn.fromBufferAttribute(this,e),Dn.applyMatrix4(t),this.setXYZ(e,Dn.x,Dn.y,Dn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Dn.fromBufferAttribute(this,e),Dn.applyNormalMatrix(t),this.setXYZ(e,Dn.x,Dn.y,Dn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Dn.fromBufferAttribute(this,e),Dn.transformDirection(t),this.setXYZ(e,Dn.x,Dn.y,Dn.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=li(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Re(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=Re(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Re(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Re(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Re(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=li(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=li(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=li(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=li(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=Re(e,this.array),i=Re(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=Re(e,this.array),i=Re(i,this.array),a=Re(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Re(e,this.array),i=Re(i,this.array),a=Re(a,this.array),s=Re(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this.data.array[t+3]=s,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return new vn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Pr(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class ql extends ka{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new Qt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let ss;const Hs=new H,os=new H,rs=new H,cs=new Wt,Gs=new Wt,yp=new ze,Ko=new H,Vs=new H,Jo=new H,Nu=new Wt,Hc=new Wt,Ou=new Wt;class Bu extends Ve{constructor(t=new ql){if(super(),this.isSprite=!0,this.type="Sprite",ss===void 0){ss=new nn;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new Q1(e,5);ss.setIndex([0,1,2,0,2,3]),ss.setAttribute("position",new Pr(i,3,0,!1)),ss.setAttribute("uv",new Pr(i,2,3,!1))}this.geometry=ss,this.material=t,this.center=new Wt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),os.setFromMatrixScale(this.matrixWorld),yp.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),rs.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&os.multiplyScalar(-rs.z);const i=this.material.rotation;let a,s;i!==0&&(s=Math.cos(i),a=Math.sin(i));const o=this.center;Qo(Ko.set(-.5,-.5,0),rs,o,os,a,s),Qo(Vs.set(.5,-.5,0),rs,o,os,a,s),Qo(Jo.set(.5,.5,0),rs,o,os,a,s),Nu.set(0,0),Hc.set(1,0),Ou.set(1,1);let r=t.ray.intersectTriangle(Ko,Vs,Jo,!1,Hs);if(r===null&&(Qo(Vs.set(-.5,.5,0),rs,o,os,a,s),Hc.set(0,1),r=t.ray.intersectTriangle(Ko,Jo,Vs,!1,Hs),r===null))return;const l=t.ray.origin.distanceTo(Hs);l<t.near||l>t.far||e.push({distance:l,point:Hs.clone(),uv:qn.getInterpolation(Hs,Ko,Vs,Jo,Nu,Hc,Ou,new Wt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Qo(n,t,e,i,a,s){cs.subVectors(n,e).addScalar(.5).multiply(i),a!==void 0?(Gs.x=s*cs.x-a*cs.y,Gs.y=a*cs.x+s*cs.y):Gs.copy(cs),n.copy(t),n.x+=Gs.x,n.y+=Gs.y,n.applyMatrix4(yp)}class Th extends ka{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Qt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Cr=new H,Lr=new H,Hu=new ze,Xs=new bh,tr=new Br,Gc=new H,Gu=new H;class tS extends Ve{constructor(t=new nn,e=new Th){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let a=1,s=e.count;a<s;a++)Cr.fromBufferAttribute(e,a-1),Lr.fromBufferAttribute(e,a),i[a]=i[a-1],i[a]+=Cr.distanceTo(Lr);t.setAttribute("lineDistance",new Se(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,a=this.matrixWorld,s=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),tr.copy(i.boundingSphere),tr.applyMatrix4(a),tr.radius+=s,t.ray.intersectsSphere(tr)===!1)return;Hu.copy(a).invert(),Xs.copy(t.ray).applyMatrix4(Hu);const r=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=r*r,c=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const f=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let _=f,g=m-1;_<g;_+=c){const p=h.getX(_),y=h.getX(_+1),x=er(this,t,Xs,l,p,y);x&&e.push(x)}if(this.isLineLoop){const _=h.getX(m-1),g=h.getX(f),p=er(this,t,Xs,l,_,g);p&&e.push(p)}}else{const f=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let _=f,g=m-1;_<g;_+=c){const p=er(this,t,Xs,l,_,_+1);p&&e.push(p)}if(this.isLineLoop){const _=er(this,t,Xs,l,m-1,f);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}}function er(n,t,e,i,a,s){const o=n.geometry.attributes.position;if(Cr.fromBufferAttribute(o,a),Lr.fromBufferAttribute(o,s),e.distanceSqToSegment(Cr,Lr,Gc,Gu)>i)return;Gc.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(Gc);if(!(l<t.near||l>t.far))return{distance:l,point:Gu.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const Vu=new H,Xu=new H;class _p extends tS{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let a=0,s=e.count;a<s;a+=2)Vu.fromBufferAttribute(e,a),Xu.fromBufferAttribute(e,a+1),i[a]=a===0?0:i[a-1],i[a+1]=i[a]+Vu.distanceTo(Xu);t.setAttribute("lineDistance",new Se(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Kl extends zn{constructor(t,e,i,a,s,o,r,l,c){super(t,e,i,a,s,o,r,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ei{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,a=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),s+=i.distanceTo(a),e.push(s),a=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let a=0;const s=i.length;let o;e?o=e:o=t*i[s-1];let r=0,l=s-1,c;for(;r<=l;)if(a=Math.floor(r+(l-r)/2),c=i[a]-o,c<0)r=a+1;else if(c>0)l=a-1;else{l=a;break}if(a=l,i[a]===o)return a/(s-1);const h=i[a],d=i[a+1]-h,f=(o-h)/d;return(a+f)/(s-1)}getTangent(t,e){let a=t-1e-4,s=t+1e-4;a<0&&(a=0),s>1&&(s=1);const o=this.getPoint(a),r=this.getPoint(s),l=e||(o.isVector2?new Wt:new H);return l.copy(r).sub(o).normalize(),l}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new H,a=[],s=[],o=[],r=new H,l=new ze;for(let f=0;f<=t;f++){const m=f/t;a[f]=this.getTangentAt(m,new H)}s[0]=new H,o[0]=new H;let c=Number.MAX_VALUE;const h=Math.abs(a[0].x),u=Math.abs(a[0].y),d=Math.abs(a[0].z);h<=c&&(c=h,i.set(1,0,0)),u<=c&&(c=u,i.set(0,1,0)),d<=c&&i.set(0,0,1),r.crossVectors(a[0],i).normalize(),s[0].crossVectors(a[0],r),o[0].crossVectors(a[0],s[0]);for(let f=1;f<=t;f++){if(s[f]=s[f-1].clone(),o[f]=o[f-1].clone(),r.crossVectors(a[f-1],a[f]),r.length()>Number.EPSILON){r.normalize();const m=Math.acos(xn(a[f-1].dot(a[f]),-1,1));s[f].applyMatrix4(l.makeRotationAxis(r,m))}o[f].crossVectors(a[f],s[f])}if(e===!0){let f=Math.acos(xn(s[0].dot(s[t]),-1,1));f/=t,a[0].dot(r.crossVectors(s[0],s[t]))>0&&(f=-f);for(let m=1;m<=t;m++)s[m].applyMatrix4(l.makeRotationAxis(a[m],f*m)),o[m].crossVectors(a[m],s[m])}return{tangents:a,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Ah extends Ei{constructor(t=0,e=0,i=1,a=1,s=0,o=Math.PI*2,r=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=a,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=r,this.aRotation=l}getPoint(t,e=new Wt){const i=e,a=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=a;for(;s>a;)s-=a;s<Number.EPSILON&&(o?s=0:s=a),this.aClockwise===!0&&!o&&(s===a?s=-a:s=s-a);const r=this.aStartAngle+t*s;let l=this.aX+this.xRadius*Math.cos(r),c=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return i.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class eS extends Ah{constructor(t,e,i,a,s,o){super(t,e,i,i,a,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Rh(){let n=0,t=0,e=0,i=0;function a(s,o,r,l){n=s,t=r,e=-3*s+3*o-2*r-l,i=2*s-2*o+r+l}return{initCatmullRom:function(s,o,r,l,c){a(o,r,c*(r-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,r,l,c,h,u){let d=(o-s)/c-(r-s)/(c+h)+(r-o)/h,f=(r-o)/h-(l-o)/(h+u)+(l-r)/u;d*=h,f*=h,a(o,r,d,f)},calc:function(s){const o=s*s,r=o*s;return n+t*s+e*o+i*r}}}const nr=new H,Vc=new Rh,Xc=new Rh,Wc=new Rh;class nS extends Ei{constructor(t=[],e=!1,i="centripetal",a=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=a}getPoint(t,e=new H){const i=e,a=this.points,s=a.length,o=(s-(this.closed?0:1))*t;let r=Math.floor(o),l=o-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/s)+1)*s:l===0&&r===s-1&&(r=s-2,l=1);let c,h;this.closed||r>0?c=a[(r-1)%s]:(nr.subVectors(a[0],a[1]).add(a[0]),c=nr);const u=a[r%s],d=a[(r+1)%s];if(this.closed||r+2<s?h=a[(r+2)%s]:(nr.subVectors(a[s-1],a[s-2]).add(a[s-1]),h=nr),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let m=Math.pow(c.distanceToSquared(u),f),_=Math.pow(u.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(h),f);_<1e-4&&(_=1),m<1e-4&&(m=_),g<1e-4&&(g=_),Vc.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,m,_,g),Xc.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,m,_,g),Wc.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,m,_,g)}else this.curveType==="catmullrom"&&(Vc.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),Xc.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),Wc.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return i.set(Vc.calc(l),Xc.calc(l),Wc.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new H().fromArray(a))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Wu(n,t,e,i,a){const s=(i-t)*.5,o=(a-e)*.5,r=n*n,l=n*r;return(2*e-2*i+s+o)*l+(-3*e+3*i-2*s-o)*r+s*n+e}function iS(n,t){const e=1-n;return e*e*t}function aS(n,t){return 2*(1-n)*n*t}function sS(n,t){return n*n*t}function Js(n,t,e,i){return iS(n,t)+aS(n,e)+sS(n,i)}function oS(n,t){const e=1-n;return e*e*e*t}function rS(n,t){const e=1-n;return 3*e*e*n*t}function cS(n,t){return 3*(1-n)*n*n*t}function lS(n,t){return n*n*n*t}function Qs(n,t,e,i,a){return oS(n,t)+rS(n,e)+cS(n,i)+lS(n,a)}class Mp extends Ei{constructor(t=new Wt,e=new Wt,i=new Wt,a=new Wt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new Wt){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(Qs(t,a.x,s.x,o.x,r.x),Qs(t,a.y,s.y,o.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class hS extends Ei{constructor(t=new H,e=new H,i=new H,a=new H){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new H){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(Qs(t,a.x,s.x,o.x,r.x),Qs(t,a.y,s.y,o.y,r.y),Qs(t,a.z,s.z,o.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class bp extends Ei{constructor(t=new Wt,e=new Wt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Wt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Wt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class dS extends Ei{constructor(t=new H,e=new H){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new H){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new H){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Sp extends Ei{constructor(t=new Wt,e=new Wt,i=new Wt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Wt){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(Js(t,a.x,s.x,o.x),Js(t,a.y,s.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class uS extends Ei{constructor(t=new H,e=new H,i=new H){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new H){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(Js(t,a.x,s.x,o.x),Js(t,a.y,s.y,o.y),Js(t,a.z,s.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class wp extends Ei{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Wt){const i=e,a=this.points,s=(a.length-1)*t,o=Math.floor(s),r=s-o,l=a[o===0?o:o-1],c=a[o],h=a[o>a.length-2?a.length-1:o+1],u=a[o>a.length-3?a.length-1:o+2];return i.set(Wu(r,l.x,c.x,h.x,u.x),Wu(r,l.y,c.y,h.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new Wt().fromArray(a))}return this}}var Yu=Object.freeze({__proto__:null,ArcCurve:eS,CatmullRomCurve3:nS,CubicBezierCurve:Mp,CubicBezierCurve3:hS,EllipseCurve:Ah,LineCurve:bp,LineCurve3:dS,QuadraticBezierCurve:Sp,QuadraticBezierCurve3:uS,SplineCurve:wp});class fS extends Ei{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Yu[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),a=this.getCurveLengths();let s=0;for(;s<a.length;){if(a[s]>=i){const o=a[s]-i,r=this.curves[s],l=r.getLength(),c=l===0?0:1-o/l;return r.getPointAt(c,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,a=this.curves.length;i<a;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let a=0,s=this.curves;a<s.length;a++){const o=s[a],r=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(r);for(let c=0;c<l.length;c++){const h=l[c];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(a.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const a=this.curves[e];t.curves.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(new Yu[a.type]().fromJSON(a))}return this}}class $u extends fS{constructor(t){super(),this.type="Path",this.currentPoint=new Wt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new bp(this.currentPoint.clone(),new Wt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,a){const s=new Sp(this.currentPoint.clone(),new Wt(t,e),new Wt(i,a));return this.curves.push(s),this.currentPoint.set(i,a),this}bezierCurveTo(t,e,i,a,s,o){const r=new Mp(this.currentPoint.clone(),new Wt(t,e),new Wt(i,a),new Wt(s,o));return this.curves.push(r),this.currentPoint.set(s,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new wp(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,a,s,o){const r=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+r,e+l,i,a,s,o),this}absarc(t,e,i,a,s,o){return this.absellipse(t,e,i,i,a,s,o),this}ellipse(t,e,i,a,s,o,r,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,i,a,s,o,r,l),this}absellipse(t,e,i,a,s,o,r,l){const c=new Ah(t,e,i,a,s,o,r,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Ph extends nn{constructor(t=1,e=32,i=0,a=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:a},e=Math.max(3,e);const s=[],o=[],r=[],l=[],c=new H,h=new Wt;o.push(0,0,0),r.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=i+u/e*a;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),r.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let u=1;u<=e;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new Se(o,3)),this.setAttribute("normal",new Se(r,3)),this.setAttribute("uv",new Se(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ph(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class co extends nn{constructor(t=1,e=1,i=1,a=32,s=1,o=!1,r=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:a,heightSegments:s,openEnded:o,thetaStart:r,thetaLength:l};const c=this;a=Math.floor(a),s=Math.floor(s);const h=[],u=[],d=[],f=[];let m=0;const _=[],g=i/2;let p=0;y(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new Se(u,3)),this.setAttribute("normal",new Se(d,3)),this.setAttribute("uv",new Se(f,2));function y(){const v=new H,w=new H;let S=0;const A=(e-t)/i;for(let T=0;T<=s;T++){const b=[],M=T/s,P=M*(e-t)+t;for(let L=0;L<=a;L++){const F=L/a,O=F*l+r,k=Math.sin(O),D=Math.cos(O);w.x=P*k,w.y=-M*i+g,w.z=P*D,u.push(w.x,w.y,w.z),v.set(k,A,D).normalize(),d.push(v.x,v.y,v.z),f.push(F,1-M),b.push(m++)}_.push(b)}for(let T=0;T<a;T++)for(let b=0;b<s;b++){const M=_[b][T],P=_[b+1][T],L=_[b+1][T+1],F=_[b][T+1];(t>0||b!==0)&&(h.push(M,P,F),S+=3),(e>0||b!==s-1)&&(h.push(P,L,F),S+=3)}c.addGroup(p,S,0),p+=S}function x(v){const w=m,S=new Wt,A=new H;let T=0;const b=v===!0?t:e,M=v===!0?1:-1;for(let L=1;L<=a;L++)u.push(0,g*M,0),d.push(0,M,0),f.push(.5,.5),m++;const P=m;for(let L=0;L<=a;L++){const O=L/a*l+r,k=Math.cos(O),D=Math.sin(O);A.x=b*D,A.y=g*M,A.z=b*k,u.push(A.x,A.y,A.z),d.push(0,M,0),S.x=k*.5+.5,S.y=D*.5*M+.5,f.push(S.x,S.y),m++}for(let L=0;L<a;L++){const F=w+L,O=P+L;v===!0?h.push(O,O+1,F):h.push(O+1,O,F),T+=3}c.addGroup(p,T,v===!0?1:2),p+=T}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new co(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ch extends co{constructor(t=1,e=1,i=32,a=1,s=!1,o=0,r=Math.PI*2){super(0,t,e,i,a,s,o,r),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:a,openEnded:s,thetaStart:o,thetaLength:r}}static fromJSON(t){return new Ch(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Lh extends nn{constructor(t=[],e=[],i=1,a=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:a};const s=[],o=[];r(a),c(i),h(),this.setAttribute("position",new Se(s,3)),this.setAttribute("normal",new Se(s.slice(),3)),this.setAttribute("uv",new Se(o,2)),a===0?this.computeVertexNormals():this.normalizeNormals();function r(y){const x=new H,v=new H,w=new H;for(let S=0;S<e.length;S+=3)f(e[S+0],x),f(e[S+1],v),f(e[S+2],w),l(x,v,w,y)}function l(y,x,v,w){const S=w+1,A=[];for(let T=0;T<=S;T++){A[T]=[];const b=y.clone().lerp(v,T/S),M=x.clone().lerp(v,T/S),P=S-T;for(let L=0;L<=P;L++)L===0&&T===S?A[T][L]=b:A[T][L]=b.clone().lerp(M,L/P)}for(let T=0;T<S;T++)for(let b=0;b<2*(S-T)-1;b++){const M=Math.floor(b/2);b%2===0?(d(A[T][M+1]),d(A[T+1][M]),d(A[T][M])):(d(A[T][M+1]),d(A[T+1][M+1]),d(A[T+1][M]))}}function c(y){const x=new H;for(let v=0;v<s.length;v+=3)x.x=s[v+0],x.y=s[v+1],x.z=s[v+2],x.normalize().multiplyScalar(y),s[v+0]=x.x,s[v+1]=x.y,s[v+2]=x.z}function h(){const y=new H;for(let x=0;x<s.length;x+=3){y.x=s[x+0],y.y=s[x+1],y.z=s[x+2];const v=g(y)/2/Math.PI+.5,w=p(y)/Math.PI+.5;o.push(v,1-w)}m(),u()}function u(){for(let y=0;y<o.length;y+=6){const x=o[y+0],v=o[y+2],w=o[y+4],S=Math.max(x,v,w),A=Math.min(x,v,w);S>.9&&A<.1&&(x<.2&&(o[y+0]+=1),v<.2&&(o[y+2]+=1),w<.2&&(o[y+4]+=1))}}function d(y){s.push(y.x,y.y,y.z)}function f(y,x){const v=y*3;x.x=t[v+0],x.y=t[v+1],x.z=t[v+2]}function m(){const y=new H,x=new H,v=new H,w=new H,S=new Wt,A=new Wt,T=new Wt;for(let b=0,M=0;b<s.length;b+=9,M+=6){y.set(s[b+0],s[b+1],s[b+2]),x.set(s[b+3],s[b+4],s[b+5]),v.set(s[b+6],s[b+7],s[b+8]),S.set(o[M+0],o[M+1]),A.set(o[M+2],o[M+3]),T.set(o[M+4],o[M+5]),w.copy(y).add(x).add(v).divideScalar(3);const P=g(w);_(S,M+0,y,P),_(A,M+2,x,P),_(T,M+4,v,P)}}function _(y,x,v,w){w<0&&y.x===1&&(o[x]=y.x-1),v.x===0&&v.z===0&&(o[x]=w/2/Math.PI+.5)}function g(y){return Math.atan2(y.z,-y.x)}function p(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Lh(t.vertices,t.indices,t.radius,t.details)}}const ir=new H,ar=new H,Yc=new H,sr=new qn;class pS extends nn{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const a=Math.pow(10,4),s=Math.cos(gs*e),o=t.getIndex(),r=t.getAttribute("position"),l=o?o.count:r.count,c=[0,0,0],h=["a","b","c"],u=new Array(3),d={},f=[];for(let m=0;m<l;m+=3){o?(c[0]=o.getX(m),c[1]=o.getX(m+1),c[2]=o.getX(m+2)):(c[0]=m,c[1]=m+1,c[2]=m+2);const{a:_,b:g,c:p}=sr;if(_.fromBufferAttribute(r,c[0]),g.fromBufferAttribute(r,c[1]),p.fromBufferAttribute(r,c[2]),sr.getNormal(Yc),u[0]=`${Math.round(_.x*a)},${Math.round(_.y*a)},${Math.round(_.z*a)}`,u[1]=`${Math.round(g.x*a)},${Math.round(g.y*a)},${Math.round(g.z*a)}`,u[2]=`${Math.round(p.x*a)},${Math.round(p.y*a)},${Math.round(p.z*a)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let y=0;y<3;y++){const x=(y+1)%3,v=u[y],w=u[x],S=sr[h[y]],A=sr[h[x]],T=`${v}_${w}`,b=`${w}_${v}`;b in d&&d[b]?(Yc.dot(d[b].normal)<=s&&(f.push(S.x,S.y,S.z),f.push(A.x,A.y,A.z)),d[b]=null):T in d||(d[T]={index0:c[y],index1:c[x],normal:Yc.clone()})}}for(const m in d)if(d[m]){const{index0:_,index1:g}=d[m];ir.fromBufferAttribute(r,_),ar.fromBufferAttribute(r,g),f.push(ir.x,ir.y,ir.z),f.push(ar.x,ar.y,ar.z)}this.setAttribute("position",new Se(f,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class Ep extends $u{constructor(t){super(t),this.uuid=Si(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,a=this.holes.length;i<a;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const a=this.holes[e];t.holes.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(new $u().fromJSON(a))}return this}}const mS={triangulate:function(n,t,e=2){const i=t&&t.length,a=i?t[0]*e:n.length;let s=Tp(n,0,a,e,!0);const o=[];if(!s||s.next===s.prev)return o;let r,l,c,h,u,d,f;if(i&&(s=_S(n,t,s,e)),n.length>80*e){r=c=n[0],l=h=n[1];for(let m=e;m<a;m+=e)u=n[m],d=n[m+1],u<r&&(r=u),d<l&&(l=d),u>c&&(c=u),d>h&&(h=d);f=Math.max(c-r,h-l),f=f!==0?32767/f:0}return lo(s,o,e,r,l,f,0),o}};function Tp(n,t,e,i,a){let s,o;if(a===LS(n,t,e,i)>0)for(s=t;s<e;s+=i)o=Zu(s,n[s],n[s+1],o);else for(s=e-i;s>=t;s-=i)o=Zu(s,n[s],n[s+1],o);return o&&Gr(o,o.next)&&(uo(o),o=o.next),o}function Da(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(Gr(e,e.next)||Ge(e.prev,e,e.next)===0)){if(uo(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function lo(n,t,e,i,a,s,o){if(!n)return;!o&&s&&ES(n,i,a,s);let r=n,l,c;for(;n.prev!==n.next;){if(l=n.prev,c=n.next,s?xS(n,i,a,s):gS(n)){t.push(l.i/e|0),t.push(n.i/e|0),t.push(c.i/e|0),uo(n),n=c.next,r=c.next;continue}if(n=c,n===r){o?o===1?(n=vS(Da(n),t,e),lo(n,t,e,i,a,s,2)):o===2&&yS(n,t,e,i,a,s):lo(Da(n),t,e,i,a,s,1);break}}}function gS(n){const t=n.prev,e=n,i=n.next;if(Ge(t,e,i)>=0)return!1;const a=t.x,s=e.x,o=i.x,r=t.y,l=e.y,c=i.y,h=a<s?a<o?a:o:s<o?s:o,u=r<l?r<c?r:c:l<c?l:c,d=a>s?a>o?a:o:s>o?s:o,f=r>l?r>c?r:c:l>c?l:c;let m=i.next;for(;m!==t;){if(m.x>=h&&m.x<=d&&m.y>=u&&m.y<=f&&us(a,r,s,l,o,c,m.x,m.y)&&Ge(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function xS(n,t,e,i){const a=n.prev,s=n,o=n.next;if(Ge(a,s,o)>=0)return!1;const r=a.x,l=s.x,c=o.x,h=a.y,u=s.y,d=o.y,f=r<l?r<c?r:c:l<c?l:c,m=h<u?h<d?h:d:u<d?u:d,_=r>l?r>c?r:c:l>c?l:c,g=h>u?h>d?h:d:u>d?u:d,p=Jl(f,m,t,e,i),y=Jl(_,g,t,e,i);let x=n.prevZ,v=n.nextZ;for(;x&&x.z>=p&&v&&v.z<=y;){if(x.x>=f&&x.x<=_&&x.y>=m&&x.y<=g&&x!==a&&x!==o&&us(r,h,l,u,c,d,x.x,x.y)&&Ge(x.prev,x,x.next)>=0||(x=x.prevZ,v.x>=f&&v.x<=_&&v.y>=m&&v.y<=g&&v!==a&&v!==o&&us(r,h,l,u,c,d,v.x,v.y)&&Ge(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;x&&x.z>=p;){if(x.x>=f&&x.x<=_&&x.y>=m&&x.y<=g&&x!==a&&x!==o&&us(r,h,l,u,c,d,x.x,x.y)&&Ge(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;v&&v.z<=y;){if(v.x>=f&&v.x<=_&&v.y>=m&&v.y<=g&&v!==a&&v!==o&&us(r,h,l,u,c,d,v.x,v.y)&&Ge(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function vS(n,t,e){let i=n;do{const a=i.prev,s=i.next.next;!Gr(a,s)&&Ap(a,i,i.next,s)&&ho(a,s)&&ho(s,a)&&(t.push(a.i/e|0),t.push(i.i/e|0),t.push(s.i/e|0),uo(i),uo(i.next),i=n=s),i=i.next}while(i!==n);return Da(i)}function yS(n,t,e,i,a,s){let o=n;do{let r=o.next.next;for(;r!==o.prev;){if(o.i!==r.i&&RS(o,r)){let l=Rp(o,r);o=Da(o,o.next),l=Da(l,l.next),lo(o,t,e,i,a,s,0),lo(l,t,e,i,a,s,0);return}r=r.next}o=o.next}while(o!==n)}function _S(n,t,e,i){const a=[];let s,o,r,l,c;for(s=0,o=t.length;s<o;s++)r=t[s]*i,l=s<o-1?t[s+1]*i:n.length,c=Tp(n,r,l,i,!1),c===c.next&&(c.steiner=!0),a.push(AS(c));for(a.sort(MS),s=0;s<a.length;s++)e=bS(a[s],e);return e}function MS(n,t){return n.x-t.x}function bS(n,t){const e=SS(n,t);if(!e)return t;const i=Rp(e,n);return Da(i,i.next),Da(e,e.next)}function SS(n,t){let e=t,i=-1/0,a;const s=n.x,o=n.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=s&&d>i&&(i=d,a=e.x<e.next.x?e:e.next,d===s))return a}e=e.next}while(e!==t);if(!a)return null;const r=a,l=a.x,c=a.y;let h=1/0,u;e=a;do s>=e.x&&e.x>=l&&s!==e.x&&us(o<c?s:i,o,l,c,o<c?i:s,o,e.x,e.y)&&(u=Math.abs(o-e.y)/(s-e.x),ho(e,n)&&(u<h||u===h&&(e.x>a.x||e.x===a.x&&wS(a,e)))&&(a=e,h=u)),e=e.next;while(e!==r);return a}function wS(n,t){return Ge(n.prev,n,t.prev)<0&&Ge(t.next,n,n.next)<0}function ES(n,t,e,i){let a=n;do a.z===0&&(a.z=Jl(a.x,a.y,t,e,i)),a.prevZ=a.prev,a.nextZ=a.next,a=a.next;while(a!==n);a.prevZ.nextZ=null,a.prevZ=null,TS(a)}function TS(n){let t,e,i,a,s,o,r,l,c=1;do{for(e=n,n=null,s=null,o=0;e;){for(o++,i=e,r=0,t=0;t<c&&(r++,i=i.nextZ,!!i);t++);for(l=c;r>0||l>0&&i;)r!==0&&(l===0||!i||e.z<=i.z)?(a=e,e=e.nextZ,r--):(a=i,i=i.nextZ,l--),s?s.nextZ=a:n=a,a.prevZ=s,s=a;e=i}s.nextZ=null,c*=2}while(o>1);return n}function Jl(n,t,e,i,a){return n=(n-e)*a|0,t=(t-i)*a|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function AS(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function us(n,t,e,i,a,s,o,r){return(a-o)*(t-r)>=(n-o)*(s-r)&&(n-o)*(i-r)>=(e-o)*(t-r)&&(e-o)*(s-r)>=(a-o)*(i-r)}function RS(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!PS(n,t)&&(ho(n,t)&&ho(t,n)&&CS(n,t)&&(Ge(n.prev,n,t.prev)||Ge(n,t.prev,t))||Gr(n,t)&&Ge(n.prev,n,n.next)>0&&Ge(t.prev,t,t.next)>0)}function Ge(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function Gr(n,t){return n.x===t.x&&n.y===t.y}function Ap(n,t,e,i){const a=rr(Ge(n,t,e)),s=rr(Ge(n,t,i)),o=rr(Ge(e,i,n)),r=rr(Ge(e,i,t));return!!(a!==s&&o!==r||a===0&&or(n,e,t)||s===0&&or(n,i,t)||o===0&&or(e,n,i)||r===0&&or(e,t,i))}function or(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function rr(n){return n>0?1:n<0?-1:0}function PS(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&Ap(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function ho(n,t){return Ge(n.prev,n,n.next)<0?Ge(n,t,n.next)>=0&&Ge(n,n.prev,t)>=0:Ge(n,t,n.prev)<0||Ge(n,n.next,t)<0}function CS(n,t){let e=n,i=!1;const a=(n.x+t.x)/2,s=(n.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&a<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function Rp(n,t){const e=new Ql(n.i,n.x,n.y),i=new Ql(t.i,t.x,t.y),a=n.next,s=t.prev;return n.next=t,t.prev=n,e.next=a,a.prev=e,i.next=e,e.prev=i,s.next=i,i.prev=s,i}function Zu(n,t,e,i){const a=new Ql(n,t,e);return i?(a.next=i.next,a.prev=i,i.next.prev=a,i.next=a):(a.prev=a,a.next=a),a}function uo(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Ql(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function LS(n,t,e,i){let a=0;for(let s=t,o=e-i;s<e;s+=i)a+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return a}class to{static area(t){const e=t.length;let i=0;for(let a=e-1,s=0;s<e;a=s++)i+=t[a].x*t[s].y-t[s].x*t[a].y;return i*.5}static isClockWise(t){return to.area(t)<0}static triangulateShape(t,e){const i=[],a=[],s=[];ju(t),qu(i,t);let o=t.length;e.forEach(ju);for(let l=0;l<e.length;l++)a.push(o),o+=e[l].length,qu(i,e[l]);const r=mS.triangulate(i,a);for(let l=0;l<r.length;l+=3)s.push(r.slice(l,l+3));return s}}function ju(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function qu(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class Dh extends Lh{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],a=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,a,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Dh(t.radius,t.detail)}}class vs extends nn{constructor(t=.5,e=1,i=32,a=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:a,thetaStart:s,thetaLength:o},i=Math.max(3,i),a=Math.max(1,a);const r=[],l=[],c=[],h=[];let u=t;const d=(e-t)/a,f=new H,m=new Wt;for(let _=0;_<=a;_++){for(let g=0;g<=i;g++){const p=s+g/i*o;f.x=u*Math.cos(p),f.y=u*Math.sin(p),l.push(f.x,f.y,f.z),c.push(0,0,1),m.x=(f.x/e+1)/2,m.y=(f.y/e+1)/2,h.push(m.x,m.y)}u+=d}for(let _=0;_<a;_++){const g=_*(i+1);for(let p=0;p<i;p++){const y=p+g,x=y,v=y+i+1,w=y+i+2,S=y+1;r.push(x,v,S),r.push(v,w,S)}}this.setIndex(r),this.setAttribute("position",new Se(l,3)),this.setAttribute("normal",new Se(c,3)),this.setAttribute("uv",new Se(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new vs(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class kh extends nn{constructor(t=new Ep([new Wt(0,.5),new Wt(-.5,-.5),new Wt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],a=[],s=[],o=[];let r=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(r,l,h),r+=l,l=0;this.setIndex(i),this.setAttribute("position",new Se(a,3)),this.setAttribute("normal",new Se(s,3)),this.setAttribute("uv",new Se(o,2));function c(h){const u=a.length/3,d=h.extractPoints(e);let f=d.shape;const m=d.holes;to.isClockWise(f)===!1&&(f=f.reverse());for(let g=0,p=m.length;g<p;g++){const y=m[g];to.isClockWise(y)===!0&&(m[g]=y.reverse())}const _=to.triangulateShape(f,m);for(let g=0,p=m.length;g<p;g++){const y=m[g];f=f.concat(y)}for(let g=0,p=f.length;g<p;g++){const y=f[g];a.push(y.x,y.y,0),s.push(0,0,1),o.push(y.x,y.y)}for(let g=0,p=_.length;g<p;g++){const y=_[g],x=y[0]+u,v=y[1]+u,w=y[2]+u;i.push(x,v,w),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return DS(e,t)}static fromJSON(t,e){const i=[];for(let a=0,s=t.shapes.length;a<s;a++){const o=e[t.shapes[a]];i.push(o)}return new kh(i,t.curveSegments)}}function DS(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const a=n[e];t.shapes.push(a.uuid)}else t.shapes.push(n.uuid);return t}class Vr extends nn{constructor(t=1,e=.4,i=12,a=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:a,arc:s},i=Math.floor(i),a=Math.floor(a);const o=[],r=[],l=[],c=[],h=new H,u=new H,d=new H;for(let f=0;f<=i;f++)for(let m=0;m<=a;m++){const _=m/a*s,g=f/i*Math.PI*2;u.x=(t+e*Math.cos(g))*Math.cos(_),u.y=(t+e*Math.cos(g))*Math.sin(_),u.z=e*Math.sin(g),r.push(u.x,u.y,u.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(m/a),c.push(f/i)}for(let f=1;f<=i;f++)for(let m=1;m<=a;m++){const _=(a+1)*f+m-1,g=(a+1)*(f-1)+m-1,p=(a+1)*(f-1)+m,y=(a+1)*f+m;o.push(_,g,y),o.push(g,p,y)}this.setIndex(o),this.setAttribute("position",new Se(r,3)),this.setAttribute("normal",new Se(l,3)),this.setAttribute("uv",new Se(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Vr(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class fo extends ka{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new Qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Qt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ep,this.normalScale=new Wt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new wi,this.combine=ph,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Pp extends Ve{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Qt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class kS extends Pp{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ve.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Qt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const $c=new ze,Ku=new H,Ju=new H;class IS{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Wt(512,512),this.map=null,this.mapPass=null,this.matrix=new ze,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new wh,this._frameExtents=new Wt(1,1),this._viewportCount=1,this._viewports=[new qe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;Ku.setFromMatrixPosition(t.matrixWorld),e.position.copy(Ku),Ju.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Ju),e.updateMatrixWorld(),$c.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix($c),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply($c)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class zS extends IS{constructor(){super(new fp(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class FS extends Pp{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ve.DEFAULT_UP),this.updateMatrix(),this.target=new Ve,this.shadow=new zS}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const Qu=new ze;class US{constructor(t,e,i=0,a=1/0){this.ray=new bh(t,e),this.near=i,this.far=a,this.camera=null,this.layers=new Sh,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Qu.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Qu),this}intersectObject(t,e=!0,i=[]){return th(t,this,i,e),i.sort(tf),i}intersectObjects(t,e=!0,i=[]){for(let a=0,s=t.length;a<s;a++)th(t[a],this,i,e);return i.sort(tf),i}}function tf(n,t){return n.distance-t.distance}function th(n,t,e,i){let a=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(a=!1),a===!0&&i===!0){const s=n.children;for(let o=0,r=s.length;o<r;o++)th(s[o],t,e,!0)}}class NS extends _p{constructor(t=10,e=10,i=4473924,a=8947848){i=new Qt(i),a=new Qt(a);const s=e/2,o=t/e,r=t/2,l=[],c=[];for(let d=0,f=0,m=-r;d<=e;d++,m+=o){l.push(-r,0,m,r,0,m),l.push(m,0,-r,m,0,r);const _=d===s?i:a;_.toArray(c,f),f+=3,_.toArray(c,f),f+=3,_.toArray(c,f),f+=3,_.toArray(c,f),f+=3}const h=new nn;h.setAttribute("position",new Se(l,3)),h.setAttribute("color",new Se(c,3));const u=new Th({vertexColors:!0,toneMapped:!1});super(h,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:fh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=fh);const OS={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function BS(n,t,e,i){const a=new Qn(n.fov,i,.1,200),s=new H,o=new H,r=new H;let l=!1,c=n.fov;const h={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let u=1,d=0,f=0,m=0,_=0,g=0,p=0;function y(){const x=(n.pitchDeg+h.pitchDelta)*Math.PI/180,v=n.yawDeg*Math.PI/180;r.set(Math.sin(v)*Math.cos(x),Math.sin(x),Math.cos(v)*Math.cos(x)).multiplyScalar(n.distance*h.distanceScale*h.zoom)}return y(),{camera:a,update(x,v,w,S,A=OS){const T=v+.6;if(!l)s.set(x,T,w),l=!0;else{const P=1-Math.exp(-Math.max(n.smoothing,.001)*S);s.x+=(x-s.x)*P,s.y+=(T-s.y)*P,s.z+=(w-s.z)*P}const b=1-Math.exp(-Math.max(t.smoothing,.001)*S);h.distanceScale+=(A.distanceScale-h.distanceScale)*b,h.offsetX+=(A.offsetX-h.offsetX)*b,h.offsetZ+=(A.offsetZ-h.offsetZ)*b,h.pitchDelta+=(A.pitchDelta-h.pitchDelta)*b;const M=1-Math.exp(-Math.max(e.smoothing,.001)*S);if(h.zoom+=(u-h.zoom)*M,y(),(a.fov!==c||a.fov!==n.fov)&&(a.fov=n.fov,c=n.fov,a.updateProjectionMatrix()),o.set(s.x+h.offsetX,s.y,s.z+h.offsetZ),a.position.copy(o).add(r),a.lookAt(o),d>.001){f+=S*52;const P=d*.055;a.position.x+=Math.sin(f*1.7)*P,a.position.y+=Math.sin(f*2.3+1.1)*P*.75,a.position.z+=Math.sin(f*1.3+2.4)*P*.5,d*=Math.exp(-9*S)}else d=0;g>.001?(a.position.x+=m*g,a.position.z+=_*g,g*=Math.exp(-13*S)):g=0,a.updateMatrixWorld()},snap(x,v,w){s.set(x,v+.6,w),l=!0,o.set(s.x+h.offsetX,s.y,s.z+h.offsetZ),y(),a.position.copy(o).add(r),a.lookAt(o),a.updateMatrixWorld()},resize(x){a.aspect=x,a.updateProjectionMatrix()},getGroundBasis(){const x=new H().setFromMatrixColumn(a.matrixWorld,0),v=new H().setFromMatrixColumn(a.matrixWorld,2).negate(),w=Math.hypot(x.x,x.z)||1,S=Math.hypot(v.x,v.z)||1;return{rightX:x.x/w,rightZ:x.z/w,forwardX:v.x/S,forwardZ:v.z/S}},addShake(x){!Number.isFinite(x)||x<=0||(d=Math.min(1,d+x))},shakeLevel(){return d},addKick(x,v,w){if(!Number.isFinite(x)||!Number.isFinite(v)||!(w>0))return;const S=Math.hypot(x,v);S<1e-4||(m=x/S*w,_=v/S*w,g=1,p++)},kickLevel(){return g},kickCount(){return p},setZoom(x){u=Number.isFinite(x)&&x>0?x:1},smart(){return{...h}}}}const Pa=Math.PI*2,ti=1e-6;function Hn(n,t,e){return n<t?t:n>e?e:n}function Cp(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function HS(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function Lp(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const a=HS(n);return i===1?a:e+(a-e)*i}function ef(n){return(1-Math.sin(n))/2}function Ih(n,t,e){const i=Math.PI/180,a=Hn(Number.isFinite(t)?t:100,0,180),s=Hn(Number.isFinite(e)?e:132,0,180);if(s<=a)return n>=Math.cos(a*i)?1:0;const o=Math.cos(a*i),r=Math.cos(s*i);if(n>=o)return 1;const l=Hn((o-n)/(o-r),0,1);return 1-l*l*(3-2*l)}function Dr(n,t){if(!n.grounded||n.speed<ti)return Cp();const e=n.speed/Math.max(n.moveSpeed,ti),i=Math.max(n.legLength,ti),a=n.stride>ti?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,s=Math.min(t.maxAmp,a/i),o=i*Math.sin(Math.min(t.maxAmp,1.25)),r=Math.abs(n.localForward),l=Math.abs(n.localRight),c=r+l+ti,h=Ih(n.localForward/Math.max(n.speed,ti),t.backStrafeStartDeg,t.backStrafeFullDeg),u=l/c*h,d=r/c+l/c*(1-h),f=n.localForward>=0?1:-1,m=n.localRight>=0?1:-1,_=a,g=O=>Math.asin(Hn(O,-o,o)/i);function p(O,k){const D=Lp(O,t.plantLock),U=ef(O),G=f*d*_*D,W=-g(G),ot=k*m>0?1:-1,gt=1+ot*t.crossStep*.45,Mt=m*ot*t.crossStep*_*.4*U,kt=m*u*_*t.sideWeight*gt*D+Mt*u,Q=g(kt),nt=t.kneeLift*U*s*(.55+.25*d+(ot>0?.2*u:0));return{pitchX:W,rollZ:Q,kneeX:nt}}const y=(n.phase%Pa+Pa)%Pa,x=p(y,-1),v=p((y+Math.PI)%Pa,1),w=Math.cos(y),S=ef(y),A=-t.comSway*s*w*(.6*d+.8*u)-m*t.comSway*s*u*.45,T=t.comBob*S*s,b=m*t.hipLean*s*u*w*.6,M=m*t.hipLean*s*u*(.45+.25*w),P=t.armSwing*s*w*(d*f+.3*u),L=P,F=-P;return{legL:x,legR:v,pelvisX:A,pelvisY:T,pelvisRoll:b,sideLean:M,armL:L,armR:F,strafe:u,backward:f<0?d:0}}function Dp(n){const t=(n%Pa+Pa)%Pa,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function kp(n,t,e){const i=Hn(e.progress,0,1);if(i>=1||n.speed<ti)return Cp();const a=i*i*(3-2*i),s=1-a;return Dr({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*a,speed:n.speed*s,stride:n.stride*s},t)}function Ip(n,t,e,i){const a=Hn(n,-1,1),s=Math.abs(a),o=Math.min(1,t*(1+Math.max(0,i)*s*s));return Hn(o*a,-1,1)*(e*Math.PI/180)}function zp(n,t,e,i){if(!(Math.hypot(n,t)>1e-6))return e;const s=Math.atan2(t,n)*180/Math.PI;if(Math.abs(s)<=90)return e;const r=(s-Math.sign(s)*180)*Math.PI/180,l=Hn(i,0,1),c=l*l;return e*c+r*(1-c)}function Fp(n,t,e,i,a){const s=Math.max(e,ti),o=Math.max(0,i)*s,r=Math.max(0,a)*s,l=t>ti?(t-n)/t:0,c=l>.02,h=l<-.015,u=n<=o*.15,d=!h&&n<r&&(c||u);return{enter:n>ti&&n<=o&&c,resume:!d}}function Up(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return Hn(n*Hn(t,0,2),-i,i)}function Np(n,t,e){const i=Math.sin(n),a=Math.cos(n),s=Math.cos(n),o=-Math.sin(n);return{forward:t*i+e*a,right:t*s+e*o}}function Op(n,t,e){const i=Hn(n,0,1),a=i*i*(3-2*i);return e?t==="inStop"?1-a:1:t==="afterStop"?1-a:0}function GS(n,t,e){const i=()=>({legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisY:0,env:0});if(!e.turnStepEnabled)return i();const a=Hn(n,0,1),s=Math.sin(Math.PI*a),o=s*s;if(o<=1e-9)return i();const r=t>=0,l=r?1:.35,c=r?.35:1,h=Math.max(0,e.turnStepPitch)*o,u=Math.max(0,e.turnStepKnee)*o,d=Math.max(0,e.turnStepPitch)*.35*o,f=r?1:-1;return{legL:{pitchX:-h*l,rollZ:f*d*l,kneeX:u*l},legR:{pitchX:-h*c,rollZ:-f*d*c,kneeX:u*c},pelvisY:-Math.max(0,e.turnStepDip)*o,env:o}}function Bp(n,t,e,i,a){const s=Hn(n,0,1),o=Hn(a.stopPeakRatio,.05,.95),r=s<=o?s/o:(s-o)/(1-o),l=r*r*(3-2*r),c=s<=o?l:1-l,h=Math.hypot(e,i),u=h>ti?e/h:1,d=h>ti?i/h:0,f=Lp(t,1)>0;return{leadPitch:Math.max(0,a.stopStepPitch)*c,trailPitch:Math.max(0,a.stopTrailPitch)*c,leadKnee:Math.max(0,a.stopStepKnee)*c,bodyShift:Math.max(0,a.stopBodyShift)*c,bodyDip:Math.max(0,a.stopBodyDip)*c,chestPitch:Math.max(0,a.stopChestPitch)*c,leadLeft:f,fwdN:u,rightN:d,env:c}}function Sn(n){return n<0?0:n>1?1:n}const gr=Math.PI*2;function VS(n){return((n+Math.PI)%gr+gr)%gr-Math.PI}function XS(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function WS(n,t,e,i,a,s=n.phase){const o=Sn(i);if(o<=0)return n;const r=Sn(t),l=Math.max(1,Math.round(a.cycles)),c=Math.max(0,a.strideSpeed),h=e%2===0?1:-1,u=Sn(a.forwardBias),d=Math.max(0,n.stride??0),f=Math.max(0,a.strideScale??0)*d,m=r<=.5?r*2:(r-.5)*2,_=m*m*(3-2*m),g=r<=.5?_:1-_,p={speed:c,phase:s+gr*l/2*g,localForward:c*u,localRight:c*(1-u)*h},y=VS(p.phase-n.phase),x=o*o*(3-2*o),v=n.speed>.05?d:0;return{speed:n.speed+(p.speed-n.speed)*o,phase:n.phase+y*x,localForward:n.localForward+(p.localForward-n.localForward)*o,localRight:n.localRight+(p.localRight-n.localRight)*o,stride:v+(f-v)*o*o}}function YS(n,t,e){const i=XS(),a=Sn(n),s=Math.sin(Math.PI*a)**2;if(s<=1e-12)return i;const o=t%2===0?1:-1,r=o<0,l=o>0,c=e.stepPitch*s,h=e.stepKnee*s,u=e.stepSide*s;return i.legL.pitchX=r?-c:c*.55,i.legR.pitchX=l?-c:c*.55,i.legL.kneeX=r?h:h*.4,i.legR.kneeX=l?h:h*.4,i.legL.rollZ=-u*o,i.legR.rollZ=u*o,i.pelvisX=e.stepSway*s*o,i.pelvisY=-e.stepDip*s,i.pelvisRoll=u*.25*o,i}function Hp(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function nf(n,t,e,i,a){if(e<=0||i<=0)return 0;const s=(n-t)/e;return s<0||s>=1?0:i*Hp(s,a)}function $S(n,t,e,i){const a=t?1:0,s=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),o=n+(a-n)*s;return t&&o>.999?1:!t&&o<.001?0:o}function ZS(n,t,e){const i=Sn(n);return{gaitScale:1-i*(1-Sn(t)),attackLegWeight:Sn(e)*i}}function jS(n,t,e){const i=Sn(e);if(i<=0)return n;if(i>=1)return{...n,...t,armL:n.armL,armR:n.armR,strafe:n.strafe,backward:n.backward};const a=(s,o)=>s+(o-s)*i;return{legL:{pitchX:a(n.legL.pitchX,t.legL.pitchX),rollZ:a(n.legL.rollZ,t.legL.rollZ),kneeX:a(n.legL.kneeX,t.legL.kneeX)},legR:{pitchX:a(n.legR.pitchX,t.legR.pitchX),rollZ:a(n.legR.rollZ,t.legR.rollZ),kneeX:a(n.legR.kneeX,t.legR.kneeX)},pelvisX:a(n.pelvisX,t.pelvisX),pelvisY:a(n.pelvisY,t.pelvisY),pelvisRoll:a(n.pelvisRoll,t.pelvisRoll),sideLean:n.sideLean,armL:n.armL,armR:n.armR,strafe:n.strafe,backward:n.backward}}function qS(n,t){const e=Sn(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function KS(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return Sn(t.minScale+(1-t.minScale)*e)}function JS(){return Gp()}function Gp(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function QS(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function tw(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?Sn(t.forceHitHeight):n.type==="light"?Sn(t.hitHeight.light):n.type==="heavy"?Sn(t.hitHeight.heavy):n.type==="knock"?Sn(t.hitHeight.knock):0}function ew(n,t,e){const i=Sn(e),a=(s,o)=>s+(o-s)*i;return{upperPitch:a(n.upperPitch,t.upperPitch),upperRoll:a(n.upperRoll,t.upperRoll),upperYaw:a(n.upperYaw,t.upperYaw),fold:a(n.fold,t.fold),shift:a(n.shift,t.shift),drop:a(n.drop,t.drop),back:a(n.back,t.back),knee:a(n.knee,t.knee),hip:a(n.hip,t.hip),arm:a(n.arm,t.arm)}}function Vp(n,t,e){const i=Gp(),a=QS(n,e);if(i.intensity=a,a<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const s=Sn(1-n.timer/n.duration),o=Hp(s,e.pulseRatio);i.pulse=o,i.active=o>0,i.hitHeight=tw(n,e);const r=Math.sin(t),l=Math.cos(t),c=Math.cos(t),h=-Math.sin(t),u=n.dirX*r+n.dirZ*l,d=n.dirX*c+n.dirZ*h;if(i.localFwd=u,i.localRight=d,!e.enabled){i.legacy=!0;const _=Math.sin(Math.PI*s);return i.upperPitch=a*_*u,i.upperRoll=-a*_*d*.7,i.drop=(a>.5?.09:.04)*_,i.flash=e.flashStrength*_,i.active=_>0,i}const f=a*o,m=ew(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=f*(m.upperPitch*u+m.fold),i.upperRoll=-f*m.upperRoll*d,i.upperYaw=f*m.upperYaw*d,i.upperShift=f*m.shift,i.upperShiftX=i.upperShift*d,i.upperShiftZ=i.upperShift*u,i.comShift=f*e.comShift,i.comX=i.comShift*d,i.comZ=i.comShift*u,i.pelvisBack=f*m.back,i.drop=f*m.drop,i.knee=f*m.knee,i.hip=f*m.hip,i.arm=f*m.arm,i.flash=e.flashStrength*o,i}function Xp(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),a=Number.isFinite(n.leanForward)?n.leanForward:0,s=Number.isFinite(n.leanSide)?n.leanSide:0,o=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:a*e,pelvisRoll:s*e,pelvisX:-s*i,pelvisZ:a*i,crouch:Math.max(0,t.moveCrouch)*o}}const ya=1e-6;function eo(n,t,e){return n<t?t:n>e?e:n}function Wp(n,t,e,i=1){const a=t,s=e;if(!Number.isFinite(a)||!Number.isFinite(s)||a<=ya||s<=ya||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const r=a+s,l=Math.abs(a-s)+ya,c=Math.hypot(n.x,n.y,n.z);if(c<=ya)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const h=Math.atan2(n.x,-n.y),u=Math.hypot(n.x,n.y),d=n.z,f=Math.hypot(d,u),m=eo(f,l,r),_=f>r+ya||f<l-ya,g=Math.atan2(-d,Math.max(u,ya)),p=eo((a*a+m*m-s*s)/(2*a*m),-1,1),y=eo((s*s+m*m-a*a)/(2*s*m),-1,1),x=Math.acos(p),v=Math.acos(y),w=i>=0?1:-1;return{rootPitch:g-w*x,rootRoll:h,jointPitch:w*(x+v),clamped:_,reach:c/r}}function Yp(n,t,e,i){const a=eo(e,0,1),s=Math.max(0,i),o=(r,l)=>{const c=eo((l-r)*a,-s,s);return r+c};return{rootPitch:o(n.rootPitch,t.rootPitch),rootRoll:o(n.rootRoll,t.rootRoll),jointPitch:o(n.jointPitch,t.jointPitch)}}function $p(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const zh={active:!1,weight:0,clamped:0,maxError:0};function Zp(n){const{root:t,pelvis:e,lower:i,limbs:a,base:s,cfg:o}=n;if(!o.enabled||o.weight<=0||!n.grounded||a.length===0)return{...zh};const r={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(s.pelvisPos),e.rotation.x=s.pelvisRotX,e.rotation.z=s.pelvisRotZ,i.position.copy(s.lowerPos),i.rotation.z=s.lowerRotZ,t.updateWorldMatrix(!0,!0);const l=a.map(f=>f.tip.getWorldPosition(new H));e.position.copy(r.pelvisPos),e.rotation.x=r.pelvisRotX,e.rotation.z=r.pelvisRotZ,i.position.copy(r.lowerPos),i.rotation.z=r.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const c=Math.max(0,Math.min(1,o.weight))*(n.attacking?Math.max(0,Math.min(1,o.attackScale)):1),h=Math.max(0,o.maxCorrectionDeg)*Math.PI/180;let u=0;for(let f=0;f<a.length;f++){const m=a[f],_=i.worldToLocal(l[f].clone()),g={x:_.x-m.root.position.x,y:_.y-m.root.position.y,z:_.z-m.root.position.z},p=Wp(g,m.upperLen,m.lowerLen,m.bend);p.clamped&&(u+=1);const y=Yp({rootPitch:m.root.rotation.x,rootRoll:m.root.rotation.z,jointPitch:m.joint.rotation.x},p,c,h);m.root.rotation.x=y.rootPitch,m.root.rotation.z=y.rootRoll,m.joint.rotation.x=y.jointPitch}t.updateWorldMatrix(!0,!0);let d=0;for(let f=0;f<a.length;f++){const m=a[f].tip.getWorldPosition(new H);d=Math.max(d,m.distanceTo(l[f]))}return{active:!0,weight:c,clamped:u,maxError:d}}function Zn(n,t,e){return n<t?t:n>e?e:n}function nw(n,t,e,i,a,s,o,r,l,c){const h=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},u=new Pe,d=new Pe;d.name="pelvis",d.position.y=n.legLength,u.add(d);const f=new Pe;f.name="lower";const m=new Pe;m.name="upper",d.add(f),d.add(m);const _=[],g=(et,ft,Nt,rt)=>{const wt=new fo({color:rt}),B=new me(new ui(et,ft,Nt),wt);return B.castShadow=!0,B.receiveShadow=!0,_.push(wt),B},p=n.headSize,y=n.legLength,x=n.armLength,v=n.limbThickness,w=n.bodyHeight,S=n.bodyWidth,A=g(S,w,.28,e);A.position.y=w/2,m.add(A);const T=new Pe;T.name="headPivot",T.rotation.order="YXZ",T.position.y=w,m.add(T);const b=g(p,p,p,e);b.position.y=p/2,T.add(b);for(const et of[-1,1]){const ft=g(.06,.07,.02,t.shoe);ft.position.set(et*.09,p/2+.03,p/2+.011),T.add(ft)}const M=(et,ft)=>{const Nt=ft?x:y,rt=new Pe;rt.name=ft?et<0?"shoulderL":"shoulderR":et<0?"hipL":"hipR",ft||(rt.rotation.order="ZYX"),rt.position.set(et*(ft?S/2+v/2:S/2-v/2),ft?w-.04:0,0),(ft?m:f).add(rt);const wt=g(v,Nt/2,v,t.limb);wt.position.y=-Nt/4,rt.add(wt);const B=new Pe;B.name=ft?"elbow":"knee",B.position.y=-Nt/2,rt.add(B);const lt=g(v,Nt/2,v,t.limb);if(lt.position.y=-Nt/4,B.add(lt),!ft){const vt=g(v*1.15,.07,v*1.7,t.shoe);vt.position.set(0,-Nt/2+.035,.045),B.add(vt);const Xt=new Ve;return Xt.name="footTip",Xt.position.y=-Nt/2,B.add(Xt),{root:rt,joint:B,tip:Xt}}return{root:rt,joint:B}},P=M(-1,!1),L=M(1,!1),F=M(-1,!0),O=M(1,!0),k=[P,L].map(et=>({root:et.root,joint:et.joint,tip:et.tip,upperLen:y/2,lowerLen:y/2,bend:1})),D=new en({color:a.attackArcColor,transparent:!0,opacity:0,side:Oe,depthWrite:!1}),U=new me(new Vr(.62,.042,6,20,Math.PI*1.1),D);U.position.set(0,.78-y,.56),m.add(U);const G=new Qt(e),W=new Qt(r.flashColor),ot=new Qt;let gt=null,Mt=0,kt=0,Q=0,nt=0,ht=0,q=0,J=0,Z={...zh},bt=-1,zt=0,Dt=0,Ut=0,V=0,ne=0,Ht=0,Lt=0,xt=1,Ft=0,Bt=0,z="none",R=0,j=!1,dt=-1,tt=!1,ct=0,It=0;return{group:u,boneAtWorld(et,ft,Nt){const rt=[{node:m,ax:0,ay:.05,az:0,bx:0,by:w,bz:0},{node:T,ax:0,ay:0,az:0,bx:0,by:p,bz:0},{node:F.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:F.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:O.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:O.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:P.root,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0},{node:P.joint,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0},{node:L.root,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0},{node:L.joint,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0}],wt=new H,B=new H,lt=new H(et,ft,Nt),vt=new H;let Xt=null,Gt=Number.POSITIVE_INFINITY;for(const $t of rt){$t.node.updateWorldMatrix(!0,!1),wt.set($t.ax,$t.ay,$t.az),B.set($t.bx,$t.by,$t.bz),$t.node.localToWorld(wt),$t.node.localToWorld(B);const N=B.x-wt.x,Rt=B.y-wt.y,it=B.z-wt.z,ut=N*N+Rt*Rt+it*it;let Pt=ut>1e-8?((lt.x-wt.x)*N+(lt.y-wt.y)*Rt+(lt.z-wt.z)*it)/ut:0;Pt=Math.max(0,Math.min(1,Pt));const At=wt.x+N*Pt,qt=wt.y+Rt*Pt,ee=wt.z+it*Pt,re=(lt.x-At)**2+(lt.y-qt)**2+(lt.z-ee)**2;re<Gt&&(Gt=re,Xt=$t.node,vt.set(At,qt,ee))}return Xt?{node:Xt,point:vt.clone()}:null},update(et,ft){u.position.set(et.position.x,et.position.y,et.position.z),u.rotation.y=et.bodyYaw,T.rotation.y=(et.headYaw-et.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,et.mode!==gt&&(gt=et.mode,Mt=1),Mt=Math.max(0,Mt-ft*2.2);const Nt=et.hurt,rt=Vp(Nt,et.bodyYaw,r),wt=rt.flash;ot.copy(W).multiplyScalar(wt);for(const mt of _)mt.emissive.copy(G).multiplyScalar(Mt*.5),wt>0&&mt.emissive.add(ot);d.position.set(0,y,0),d.rotation.set(0,0,0),m.position.set(0,0,0),m.rotation.set(0,0,0),f.position.set(0,0,0),f.rotation.z=0;const B=Math.hypot(et.velocity.x,et.velocity.z),lt=Zn(o.knockGaitScale??0,0,1),vt=et.hurt.knockX*lt,Xt=et.hurt.knockZ*lt,Gt=lt>0&&Math.hypot(et.hurt.knockX,et.hurt.knockZ)>.001,$t=et.velocity.x+vt,N=et.velocity.z+Xt,Rt=Math.hypot($t,N),it=Math.cos(et.bodyYaw),ut=-Math.sin(et.bodyYaw),Pt=B>1e-6?Zn((et.velocity.x*it+et.velocity.z*ut)/B,-1,1):0,At=B>1e-6?Zn((et.velocity.x*Math.sin(et.bodyYaw)+et.velocity.z*Math.cos(et.bodyYaw))/B,-1,1):1,qt=Ih(At,o.backStrafeStartDeg,o.backStrafeFullDeg);z==="settled"&&tt&&ct>It*1.02+1e-4&&(z="none");let ee=1;z==="blend"?(ee=Op(j?dt:R,o.stopYawBlendMode,j),j||(R=Math.min(1,R+ft/Math.max(.01,o.stopYawAfterSec)),(R>=1||o.stopYawBlendMode==="inStop"||tt)&&(z="settled",ee=0))):z==="settled"&&(ee=Zn(B/Math.max(1e-6,o.stopEnterRatio*s),0,1));const re=Ip(Pt,o.strafeHipScale,o.strafeHipMaxDeg,o.strafeHipBoost),te=zp(At,Pt,re,qt)*ee;Ft+=(te-Ft)*(1-Math.exp(-12*Math.max(0,ft))),f.rotation.y=Ft;const we=et.bodyYaw+Ft,De=Math.sin(we),yn=Math.cos(we),Xe=Math.cos(we),Ie=-Math.sin(we),ye=$t*De+N*yn,We=$t*Xe+N*Ie,wn=Math.max(0,o.stopBlendSec||0),Je=wn>0&&!Gt,En=Fp(B,Bt,s,o.stopEnterRatio,o.stopExitRatio);if(!Je||En.resume)bt=-1;else if(bt<0&&En.enter){bt=0,zt=et.gaitPhase,Dt=Dp(et.gaitPhase),Ut=B,V=Math.max(et.stride,1e-6),ne=ye,Ht=We;const mt=1/Math.max(1e-6,B);Lt=et.velocity.x*mt,xt=et.velocity.z*mt}const an=Bt;Bt=B;const sn=Je&&bt>=0;sn&&(bt=Math.min(1,bt+ft/wn)),sn&&z!=="blend"&&(z="blend",R=0),j=sn&&bt<1,dt=bt,tt=En.resume,ct=B,It=an;const Fn=sn?{phase:zt,speed:Ut,moveSpeed:s,localForward:ne,localRight:Ht,legLength:n.legLength,stride:V,grounded:!0}:{phase:et.gaitPhase,speed:Rt,moveSpeed:s,localForward:ye,localRight:We,legLength:n.legLength,stride:et.stride,grounded:!0},ce=sn?kp(Fn,o,{progress:bt,phase0:zt,phaseEnd:Dt}):Dr(Fn,o);let Tn=0,Gn=0,C=0,Y=0;if(sn){const mt=Np(et.bodyYaw,Lt,xt),Et=Bp(bt,zt,mt.forward,mt.right,o);Et.leadLeft?(ce.legL.pitchX-=Et.leadPitch,ce.legL.kneeX+=Et.leadKnee,ce.legR.pitchX+=Et.trailPitch):(ce.legR.pitchX-=Et.leadPitch,ce.legR.kneeX+=Et.leadKnee,ce.legL.pitchX+=Et.trailPitch),Gn=Et.bodyShift*Et.fwdN,Tn=Et.bodyShift*Et.rightN,C=Et.bodyDip,Y=Et.chestPitch}P.root.rotation.x=ce.legL.pitchX,L.root.rotation.x=ce.legR.pitchX,P.root.rotation.z=ce.legL.rollZ,L.root.rotation.z=ce.legR.rollZ,P.joint.rotation.x=ce.legL.kneeX,L.joint.rotation.x=ce.legR.kneeX,F.root.rotation.x=ce.armL,O.root.rotation.x=ce.armR,F.joint.rotation.x=-.18,O.joint.rotation.x=-.18,d.position.x=ce.pelvisX,d.position.y=y+ce.pelvisY,d.position.z=0,d.rotation.z=ce.pelvisRoll,m.rotation.z=ce.sideLean*(rt.intensity>0?.4:1);const st=$p(d,f),at=sn&&h.enabled?{...h,weight:1}:h,E=at.enabled&&at.weight>0?Zn(at.weight,0,1):0;if(d.position.x+=Tn,d.position.z+=Gn,d.position.y-=C,f.position.y+=C,E<=0&&(f.position.x-=Tn,f.position.z-=Gn),l){const mt=Math.max(.004166666666666667,Math.min(ft,.1)),Et=Math.sin(et.bodyYaw),Ot=Math.cos(et.bodyYaw),Jt=Zn((et.velocity.x-kt)/mt,-60,60),se=Zn((et.velocity.z-Q)/mt,-60,60),ge=Jt*Et+se*Ot,Ee=Be(et.bodyYaw-nt)/mt,fe=l.maxForwardDeg*Math.PI/180,Yt=l.maxSideDeg*Math.PI/180,Qe=1-Math.exp(-Math.max(0,l.smoothing)*mt);ht+=(Zn(ge*l.accelGain,-fe,fe)-ht)*Qe,q+=(Zn(-Ee*B*l.turnGain,-Yt,Yt)-q)*Qe;const xe=Number.isFinite(l.crouchSmoothing)?l.crouchSmoothing:8;J+=(Zn(B/Math.max(s,1e-6),0,1)-J)*(1-Math.exp(-Math.max(0,xe)*mt));const Fe=Xp({leanForward:ht,leanSide:q,speedRatio:J},l);m.rotation.x+=ht+Y,m.rotation.z+=q,d.rotation.x+=Fe.pelvisPitch,d.rotation.z+=Fe.pelvisRoll,d.position.x+=Fe.pelvisX,d.position.z+=Fe.pelvisZ,d.position.y-=Fe.crouch,f.position.y+=Fe.crouch*(1-E)}kt=et.velocity.x,Q=et.velocity.z,nt=et.bodyYaw,m.rotation.x+=rt.upperPitch,m.rotation.z+=rt.upperRoll,m.rotation.y+=rt.upperYaw;const X=Zn(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),K=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;m.position.x+=Zn(rt.upperShiftX*X,-K,K),m.position.z+=Zn(rt.upperShiftZ*X,-K,K),d.position.x+=rt.comX,d.position.z+=rt.comZ-rt.pelvisBack,d.position.y-=rt.drop;const yt=rt.legacy?0:Math.max(0,Math.min(1,r.lowerScale));if(f.position.z+=rt.pelvisBack*(1-yt),f.position.y+=rt.drop*(1-yt),P.joint.rotation.x+=rt.knee,L.joint.rotation.x+=rt.knee,P.root.rotation.x-=rt.hip,L.root.rotation.x-=rt.hip,F.root.rotation.x+=rt.arm,O.root.rotation.x+=rt.arm*.8,et.attackPhase!=="idle"&&rt.intensity===0){const mt=et.attackProgress,Et=mt<.34?-1:mt<.68?-1+(mt-.34)/.34*2:Math.max(0,1-(mt-.68)/.32),Ot=Math.max(0,-Et),Jt=Math.max(0,Et);O.root.rotation.x=-1.7*Ot+1.25*Jt,O.joint.rotation.x=-(.25+Ot*.45),m.rotation.y=-.28*Et,D.opacity=et.attackPhase==="active"?.85:0,et.attackPhase==="active"&&(U.rotation.z=-1.1+mt*3)}else D.opacity=0;const St=Up(Ft,o.chestYawScale,o.chestYawMaxDeg);m.rotation.y+=St,T.rotation.y=(et.headYaw-et.bodyYaw-St+Math.PI*3)%(Math.PI*2)-Math.PI,Z=Zp({root:u,pelvis:d,lower:f,limbs:k,base:st,cfg:at,grounded:!0,attacking:et.attackPhase!=="idle"})},ik(){return Z},dispose(){u.traverse(et=>{if(et instanceof me){et.geometry.dispose();const ft=et.material;Array.isArray(ft)?ft.forEach(Nt=>Nt.dispose()):ft.dispose()}})}}}const iw=9.81;function $s(n,t,e){return n<t?t:n>e?e:n}function aw(n,t,e,i,a){const s=a!=null&&a.gravity&&a.gravity>0?a.gravity:iw,o={comX:0,comY:0,comZ:0,xcomX:0,xcomZ:0,centerX:0,centerZ:0,halfX:0,halfZ:0,marginX:1,marginZ:1,score:1,leanDeg:0,side:0,overX:0,overZ:0,grounded:!1};let r=0,l=0,c=0,h=0;for(const b of n){const M=Number.isFinite(b.mass)&&b.mass>0?b.mass:0;!Number.isFinite(b.x)||!Number.isFinite(b.y)||!Number.isFinite(b.z)||(r+=M,l+=b.x*M,c+=b.y*M,h+=b.z*M)}if(r<=1e-6)return o;l/=r,c/=r,h/=r;const u=Math.max(.02,(t.maxX-t.minX)/2),d=Math.max(.02,(t.maxZ-t.minZ)/2),f=(t.minX+t.maxX)/2,m=(t.minZ+t.maxZ)/2;if(!(t.maxX-t.minX>.03&&t.maxZ-t.minZ>.03))return{...o,comX:l,comY:c,comZ:h,centerX:f,centerZ:m,halfX:u,halfZ:d};const g=$s((a==null?void 0:a.reactionTime)??.18,.02,1),p=Math.sqrt(Math.max(.05,c)/s)*g*4,y=l+(Number.isFinite(e)?e:0)*p,x=h+(Number.isFinite(i)?i:0)*p,v=Math.abs(y-f)/u,w=Math.abs(x-m)/d,S=$s(1-Math.max(v,w),0,1),A=Math.max(0,Math.abs(y-f)-u),T=Math.max(0,Math.abs(x-m)-d);return{comX:l,comY:c,comZ:h,xcomX:y,xcomZ:x,centerX:f,centerZ:m,halfX:u,halfZ:d,marginX:$s(1-v,-1,1),marginZ:$s(1-w,-1,1),score:S,leanDeg:Math.atan2(y-f,x-m)*180/Math.PI,side:v>.98?y>f?1:-1:0,overX:A,overZ:T,grounded:!0}}function sw(n,t,e){if(!Number.isFinite(n))return 0;if(!Number.isFinite(t)||!(e>0))return n;const i=n+t*e;return n!==0&&Math.sign(i)!==Math.sign(n)?0:Math.abs(i)>Math.abs(n)?i:n}function ow(n,t,e){const i=Math.max(0,n);if(!(e>0))return i;const a=$s(Number.isFinite(t)?t:0,0,2);return i*(1+e*a)}const eh={arm:1,leg:1,torso:1,girthArm:1,girthLeg:1,girthTorso:1},rw=1e-6;function jn(n,t,e){return n<t?t:n>e?e:n}function Zc(n,t){const e=Math.max(.2,n);return jn(Math.pow(e,-t),.5,2)}function cw(n,t){if(!t.enabled)return{...eh};const e=jn(n.swing,-1,1),i=jn(n.charge,0,1),a=jn(n.impact,0,1),s=jn(n.speedRatio,0,1),o=Math.max(0,e),r=1-(1-o)*(1-o),l=1+(Math.max(1,t.swingArm)-1)*r,c=Math.max(0,-e),h=jn(t.chargeArm,.6,1),u=1-(1-h)*c,d=1-(1-h)*i;let f=1;o>0?f=l:c>0?f=u:i>0&&(f=d);const m=1-jn(t.impactSquash,0,.6)*a;f*=m;const _=Math.max(1,t.runLeg),p=(n.grounded?1+(_-1)*s:1)*(1-jn(t.impactSquash,0,.6)*a*.6),y=jn(t.torsoGain,0,1),x=1+(f-1)*y;return f=jn(f,.6,1.6),{arm:f,leg:jn(p,.6,1.4),torso:jn(x,.7,1.4),girthArm:Zc(f,t.volumeExp),girthLeg:Zc(p,t.volumeExp),girthTorso:Zc(x,t.volumeExp)}}function lw(n,t,e,i){const a=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),s=(o,r)=>o+(r-o)*a;return{arm:s(n.arm,t.arm),leg:s(n.leg,t.leg),torso:s(n.torso,t.torso),girthArm:s(n.girthArm,t.girthArm),girthLeg:s(n.girthLeg,t.girthLeg),girthTorso:s(n.girthTorso,t.girthTorso)}}function hw(n,t,e){const i=n*Math.exp(-Math.max(rw,e)*Math.max(0,t));return i<.001?0:jn(i,0,1)}const af=[{yaw:.85,pitch:-.12,roll:-.14,pz:-.06,px:.045,ap:-1.2,ay:-.42,ar:.16,el:-.48,blade:.3},{yaw:-.95,pitch:.14,roll:.17,pz:.1,px:-.05,ap:-1.46,ay:-.6,ar:-.1,el:-.14,blade:-.05},{yaw:-.75,pitch:-.08,roll:.14,pz:-.04,px:-.04,ap:-1.28,ay:-.58,ar:-.12,el:-.5,blade:.3},{yaw:.92,pitch:.15,roll:-.18,pz:.1,px:.05,ap:-1.48,ay:-.4,ar:.12,el:-.13,blade:-.05},{yaw:.12,pitch:-.32,roll:-.05,pz:-.07,px:0,ap:-1.9,ay:-.3,ar:.16,el:-.55,blade:1.3},{yaw:0,pitch:.55,roll:.02,pz:.13,px:0,ap:.05,ay:-.2,ar:0,el:-.1,blade:-.55}];function ys(n,t,e){return n<t?t:n>e?e:n}function ke(n,t,e){return n+(t-n)*e}function dw(n){return n?typeof n=="string"?{clip:n}:n:null}function uw(){return{bodyYaw:0,bodyPitch:0,bodyRoll:0,pelvisX:0,pelvisZ:0,armPitch:0,armYaw:0,armRoll:0,elbow:0,bladePitch:0,armLPitch:0,armLYaw:0,armLRoll:0,elbowL:0,rootYaw:0,bladePitchOff:0,bladeTwist:0,bladeTwistOff:0,bladeYaw:0,bladeYawOff:0}}function fw(n,t){const e=n%3*2,i=af[e],a=af[e+1];return{...uw(),bodyYaw:ke(i.yaw,a.yaw,t),bodyPitch:ke(i.pitch,a.pitch,t),bodyRoll:ke(i.roll,a.roll,t),pelvisX:ke(i.px,a.px,t),pelvisZ:ke(i.pz,a.pz,t),armPitch:ke(i.ap,a.ap,t),armYaw:ke(i.ay,a.ay,t),armRoll:ke(i.ar,a.ar,t),elbow:ke(i.el,a.el,t),bladePitch:ke(i.blade,a.blade,t)}}function pw(n,t,e,i,a=0){var b,M,P;const s=((b=i.combo)==null?void 0:b[n])??[],o=Math.max(1,s.length),r=(((Math.round(t)||1)-1)%o+o)%o,l=dw(s[r]),c=l?((M=i.clips)==null?void 0:M[l.clip])??null:null,h=ys(((P=i.weaponScale)==null?void 0:P[n])??1,0,2),u=Number.isFinite(i.bodyScale)?Math.max(0,i.bodyScale):1,d=l&&Number.isFinite(l.scale)?l.scale:h,f=d*u,m=ys((e+1)/2,0,1),_=c&&c.keys.length>0?yg(c,m):fw(r,m),g=((l==null?void 0:l.lead)??(c==null?void 0:c.lead)??"R")==="L"?"L":"R",p=(c==null?void 0:c.kind)??["right-left","left-right","overhead"][r]??"custom",y=n==="dual-swords",x=c&&da(c,"bladeTwistOff")?_.bladeTwistOff:y?_.bladeTwist:0,v=c&&da(c,"bladeYawOff")?_.bladeYawOff:-_.bladeYaw,w={yaw:_.bodyYaw*f,rootYaw:_.rootYaw*f,spinYaw:_g(c,ys(a,0,1)),pitch:_.bodyPitch*f,roll:_.bodyRoll*f,pelvisZ:_.pelvisZ*f,pelvisX:_.pelvisX*f,armR:null,armL:null,bladePitch:_.bladePitch,bladePitchOff:c&&da(c,"bladePitchOff")?_.bladePitchOff:null,bladeTwist:_.bladeTwist,bladeTwistOff:x,bladeYaw:_.bladeYaw,bladeYawOff:v,lead:g,kind:p,strike:m,blend:l&&Number.isFinite(l.blend)?l.blend:null},S={pitch:_.armPitch*d,yaw:_.armYaw*d,roll:_.armRoll*d,elbow:_.elbow*d},A=c?da(c,"armLPitch")||da(c,"armLYaw")||da(c,"armLRoll")||da(c,"elbowL"):!1,T=A?{pitch:_.armLPitch*d,yaw:_.armLYaw*d,roll:_.armLRoll*d,elbow:_.elbowL*d}:{pitch:S.pitch+(n==="greatsword"?.08:.1),yaw:S.yaw*.8,roll:n==="greatsword"?.4:-S.roll*.6,elbow:S.elbow};return g==="L"?(w.armL=S,w.armR=n==="greatsword"?null:T):(w.armR=S,(n==="greatsword"||n==="dual-swords"||A)&&(w.armL=T)),w}function mw(n,t,e){const i=ys(e,0,1),a=(s,o)=>s?o?{pitch:ke(s.pitch,o.pitch,i),yaw:ke(s.yaw,o.yaw,i),roll:ke(s.roll,o.roll,i),elbow:ke(s.elbow,o.elbow,i)}:null:o;return{yaw:ke(n.yaw,t.yaw,i),rootYaw:ke(n.rootYaw,t.rootYaw,i),spinYaw:t.spinYaw,pitch:ke(n.pitch,t.pitch,i),roll:ke(n.roll,t.roll,i),pelvisZ:ke(n.pelvisZ,t.pelvisZ,i),pelvisX:ke(n.pelvisX,t.pelvisX,i),armR:a(n.armR,t.armR),armL:a(n.armL,t.armL),bladePitch:n.bladePitch===null||t.bladePitch===null?i<.5?n.bladePitch:t.bladePitch:ke(n.bladePitch,t.bladePitch,i),bladePitchOff:n.bladePitchOff===null||t.bladePitchOff===null?i<.5?n.bladePitchOff:t.bladePitchOff:ke(n.bladePitchOff,t.bladePitchOff,i),bladeTwist:ke(n.bladeTwist,t.bladeTwist,i),bladeTwistOff:ke(n.bladeTwistOff,t.bladeTwistOff,i),bladeYaw:ke(n.bladeYaw,t.bladeYaw,i),bladeYawOff:ke(n.bladeYawOff,t.bladeYawOff,i),lead:t.lead,kind:t.kind,strike:ke(n.strike,t.strike,i),blend:t.blend??null}}function gw(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function sf(n,t){return!n||!t?n||t?.6:0:Math.abs(n.pitch-t.pitch)*1+Math.abs(n.yaw-t.yaw)*.8+Math.abs(n.roll-t.roll)*.6+Math.abs(n.elbow-t.elbow)*.8}function xw(n,t){const e=(a,s)=>Math.abs(gw(a-s));let i=0;return i+=e(n.yaw,t.yaw)*1,i+=e(n.rootYaw,t.rootYaw)*.7,i+=e(n.pitch,t.pitch)*.9,i+=e(n.roll,t.roll)*.9,i+=Math.abs(n.pelvisX-t.pelvisX)*2,i+=Math.abs(n.pelvisZ-t.pelvisZ)*2,i+=sf(n.armR,t.armR),i+=sf(n.armL,t.armL)*.8,i+=e(n.bladePitch??0,t.bladePitch??0)*1.1,i+=e(n.bladePitchOff??0,t.bladePitchOff??0)*.7,i+=e(n.bladeTwist,t.bladeTwist)*.5,i+=e(n.bladeYaw,t.bladeYaw)*.5,i}function vw(n,t,e,i,a){if(i!=null&&Number.isFinite(i)&&i>=0)return Math.max(.008,i);const s=Math.max(.008,e.segBlend??.1);if(!n)return s;const o=Math.max(.008,e.segBlendMin??.03),r=Math.max(o,Number.isFinite(a)?a:e.segBlendMax??.14),l=Math.max(.1,e.segBlendRef??6),c=ys(xw(n,t)/l,0,1);return o+(r-o)*c}function of(n){const t=ys(n,0,1);return t*t*(3-2*t)}function le(n,t,e){return n<t?t:n>e?e:n}const zi=1e-6;function Ue(n,t,e,i){const a=new me(new ui(n,t,e),new fo({color:i}));return a.castShadow=!0,a.receiveShadow=!0,a}function He(){return new Pe}function xr(n,t,e){const i=He(),a=Ue(t*.7,.12,t*.7,e.wood);a.position.y=.06,i.add(a);const s=Ue(t*2.4,.045,t*.8,e.metal);s.position.y=.13,i.add(s);const o=Ue(t*.38,n,t,e.blade);o.position.y=.13+n/2,i.add(o);const r=Ue(t*.42,n*.96,t*.2,e.bladeEdge);r.position.set(0,.13+n/2,t*.5),i.add(r);const l=Ue(t*.3,.09,t*.45,e.blade);return l.position.y=.13+n+.045,i.add(l),i}function yw(n){const t=xr(.72,.15,n),e=Ue(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function _w(n){const t=He(),e=Ue(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=Ue(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function Mw(n){const t=He(),e=Ue(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=Ue(.15,.15,.15,n.glow);i.position.y=.92;const a=i.material;return a.emissive=new Qt(n.glow),a.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function bw(n){const t=He();for(let i=0;i<5;i++){const a=(i-2)*.15,s=Ue(.055,.16,.05,n.wood);s.position.set(.16-Math.abs(a)*.46,a,0),t.add(s)}const e=Ue(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function Sw(n){const t=He(),e=Ue(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=Ue(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function jp(n,t,e,i,a,s,o,r,l,c,h,u,d){const f=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},m=u??{enabled:!1,lag:.022,maxAngle:.62,rate:26,twistLag:.018,maxTwist:.45,runDrag:0},_=h??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},g=l.stretch??{enabled:!1,swingArm:1,chargeArm:1,runLeg:1,torsoGain:0,impactSquash:0,impactDecay:12,volumeExp:.5,smoothing:26},p=l.swing??{enabled:!1,bodyScale:1,shoulderLift:.045,shoulderPush:.035,shoulderIn:.03,segBlend:.1,weaponScale:{greatsword:1,"sword-shield":.62,"dual-swords":.55}},y=He(),x=He();x.name="pelvis",x.position.y=n.legLength,y.add(x);const v=He();v.name="lower";const w=He();w.name="upper",x.add(v),x.add(w);const S=n.headSize,A=n.legLength,T=n.armLength,b=n.limbThickness,M=n.bodyHeight,P=n.bodyWidth,L=l.spine,F=!!(L!=null&&L.enabled),O=F?le(L.chestPivot??.42,.15,.85)*M:0,k=He();k.name="chest",k.position.y=O,w.add(k);const D=F?k:w;let U,G=null,W=M,ot=0;F?(W=Math.max(.05,O),ot=Math.max(.05,M-O),U=Ue(P,W,.28,t.body),U.name="torsoLower",U.position.y=W/2,w.add(U),G=Ue(P+.008,ot,.288,t.body),G.name="torsoUpper",G.position.y=ot/2,k.add(G)):(U=Ue(P,M,.28,t.body),U.name="torso",U.position.y=M/2,w.add(U));const gt=He();gt.name="headPivot",gt.rotation.order="YXZ",gt.position.y=Math.min(i.headPivotHeight,M)-O,D.add(gt);const Mt=Ue(S,S,S,t.head);Mt.position.y=S/2,gt.add(Mt);const kt=new fo({color:"#1b2733"});for(const I of[-1,1]){const $=new me(new ui(.06,.07,.02),kt);$.position.set(I*.09,S/2+.03,S/2+.011),gt.add($)}const Q=I=>{const $=He();$.name=I<0?"hipL":"hipR",$.rotation.order="ZYX",$.position.set(I*(P/2-b/2),0,0),v.add($);const pt=Ue(b,A/2,b,t.limb);pt.position.y=-A/4,$.add(pt);const _t=He();_t.name="knee",_t.position.y=-A/2,$.add(_t);const jt=Ue(b,A/2,b,t.limb);jt.position.y=-A/4,_t.add(jt);const Zt=Ue(b*1.15,.07,b*1.7,t.shoe);Zt.position.set(0,-A/2+.035,.045),_t.add(Zt);const ae=new Ve;ae.name="footTip",ae.position.y=-A/2,_t.add(ae);const ve=He();return{root:$,joint:_t,hand:ve,wrist:ve,tip:ae,upperMesh:pt,lowerMesh:jt,segLen:A/2}},nt=I=>{const $=He();$.name=I<0?"shoulderL":"shoulderR",$.rotation.order="YXZ",$.position.set(I*(P/2+b/2),M-.04-O,0),D.add($);const pt=Ue(b,T/2,b,t.limb);pt.position.y=-T/4,$.add(pt);const _t=He();_t.name="elbow",_t.position.y=-T/2,$.add(_t);const jt=Ue(b,T/2,b,t.limb);jt.position.y=-T/4,_t.add(jt);const Zt=He();Zt.name=I<0?"handL":"handR",Zt.position.y=-T/2,_t.add(Zt);const ae=Ue(b*1.1,.09,b*1.1,t.head);ae.position.y=.045,Zt.add(ae);const ve=He();return ve.name=I<0?"wristL":"wristR",Zt.add(ve),{root:$,joint:_t,hand:Zt,wrist:ve,upperMesh:pt,lowerMesh:jt,segLen:T/2}},ht=Q(-1),q=Q(1),J=nt(-1),Z=nt(1),bt=[ht,q].map(I=>({root:I.root,joint:I.joint,tip:I.tip,upperLen:A/2,lowerLen:A/2,bend:1})),zt=He(),Dt=He();zt.name="mountR",Dt.name="mountL";const Ut=He(),V=He();Ut.name="gripR",V.name="gripL",Z.wrist.add(zt),J.wrist.add(Dt),zt.add(Ut),Dt.add(V);const ne=Mw(t),Ht=bw(t),Lt=Sw(t),xt={"sword-shield":{right:xr(.42,.075,t),left:_w(t)},"dual-swords":{right:xr(.42,.075,t),left:xr(.42,.075,t)},greatsword:{right:yw(t),left:Ue(.12,.2,.12,t.wood)},staff:{right:ne.g,left:He(),orb:ne.orb},bow:{right:Lt,left:Ht.g,arrow:Lt,drawString:Ht.drawString}};for(const I of Object.keys(xt))Ut.add(xt[I].right),V.add(xt[I].left),xt[I].right.visible=!1,xt[I].left.visible=!1;function Ft(I,$,pt){const _t=new Ve;_t.name="bladeBase",_t.position.y=$,I.add(_t);const jt=new Ve;jt.name="bladeTip",jt.position.y=pt,I.add(jt)}Ft(xt["sword-shield"].right,.44,.55),Ft(xt["dual-swords"].right,.44,.55),Ft(xt["dual-swords"].left,.44,.55),Ft(xt.greatsword.right,.74,.88),Ft(xt.staff.right,.78,.92);let Bt=null,z=null,R=1,j=0,dt=0,tt=null,ct=0,It=0,et=0,ft=0,Nt=0,rt=0,wt=JS(),B={...zh},lt=0,vt=0,Xt=0,Gt=-1,$t=0,N=0,Rt=0,it=0,ut=0,Pt=0,At=0,qt=1,ee=0,re=0,te=0,we=!1,De=0,yn=0,Xe=0,Ie=0,ye="none",We=0,wn=1,Je=!1,En=-1,an=!1,sn=0,Fn=0,ce=0,Tn={...eh},Gn=0,C=0,Y={active:!1,dist:0,gy:0,pitch:0,joint:0,grip:1},st=NaN,at=0,E=0,X=0,K=NaN,yt=NaN,St=-1,mt=null,Et=null,Ot=0,Jt=1,se=.1,ge=null,Ee={lx:0,ly:0,lz:0,rx:0,ry:0,rz:0},fe=null,Yt=null,Qe=null,xe=null,Fe=null,An=null,Ye="R",Rn=0,he=0,be=0,Un=0,hn=1,$e=0,Tt=null,Ct=0,ie=0,gn=NaN,dn=NaN,Vi={speed:0,phase:0},Nn={lp:0,lr:0,rp:0,rr:0},Ia=0,Cs=0,Ti=!0,za=0,Xi="none",Ai=0,Wi=0,Fa=0,vo=.3,Nh=0;function Qp(I){const $=Math.PI/180,pt=s;let _t=0,jt=0,Zt=0,ae=0;I==="sword-shield"?(_t=pt.swordPitchDeg*$,Zt=pt.shieldPitchDeg*$):I==="dual-swords"?(_t=pt.swordPitchDeg*$,Zt=pt.swordPitchDeg*$):I==="greatsword"?(_t=pt.greatswordPitchDeg*$,Zt=pt.greatswordPitchDeg*$):I==="staff"?_t=pt.staffPitchDeg*$:Zt=pt.bowPitchDeg*$,zt.rotation.set(_t,0,jt),Dt.rotation.set(Zt,0,ae),zt.position.x=I==="greatsword"?-Math.max(0,s.twoHandInsetX??0):0}function Oh(I){if(I!==Bt){Bt=I;for(const $ of Object.keys(xt))xt[$].right.visible=$===I,xt[$].left.visible=$===I;Qp(I),Ht.drawString.position.z=-.06,Lt.position.z=0,ne.orb.scale.setScalar(1),w.rotation.y=0}}Oh("sword-shield");const Bh=[];y.traverse(I=>{I instanceof me&&I.material instanceof fo&&Bh.push(I.material)});const tm=new Qt(r.flashColor);function em(I,$){const pt=Vp(I,$,r);wt=pt,w.rotation.x+=pt.upperPitch,w.rotation.z+=pt.upperRoll,w.rotation.y+=pt.upperYaw;const _t=le(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),jt=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;w.position.x+=le(pt.upperShiftX*_t,-jt,jt),w.position.z+=le(pt.upperShiftZ*_t,-jt,jt),x.position.x+=pt.comX,x.position.z+=pt.comZ-pt.pelvisBack,x.position.y-=pt.drop;const Zt=pt.legacy?0:le(r.lowerScale,0,1);v.position.z+=pt.pelvisBack*(1-Zt),v.position.y+=pt.drop*(1-Zt),ht.joint.rotation.x+=pt.knee,q.joint.rotation.x+=pt.knee,ht.root.rotation.x-=pt.hip,q.root.rotation.x-=pt.hip,J.root.rotation.x+=pt.arm,Z.root.rotation.x+=pt.arm*.8;for(const ae of Bh)ae.emissive.copy(tm).multiplyScalar(pt.flash)}function yo(I){return I<.22?-1:I<.42?-1+(I-.22)/.2*2:I<.5?1:Math.max(0,1-(I-.5)/.5)}function nm(I){for(const $ of[J,Z])$.upperMesh.scale.set(I.girthArm,I.arm,I.girthArm),$.upperMesh.position.y=-$.segLen/2*I.arm,$.joint.position.y=-$.segLen*I.arm,$.lowerMesh.scale.set(I.girthArm,I.arm,I.girthArm),$.lowerMesh.position.y=-$.segLen/2*I.arm,$.hand.position.y=-$.segLen*I.arm;for(const $ of[ht,q])$.upperMesh.scale.set(I.girthLeg,I.leg,I.girthLeg),$.upperMesh.position.y=-$.segLen/2*I.leg,$.joint.position.y=-$.segLen*I.leg,$.lowerMesh.scale.set(I.girthLeg,I.leg,I.girthLeg),$.lowerMesh.position.y=-$.segLen/2*I.leg,$.tip.position.y=-$.segLen*I.leg;U.scale.set(I.girthTorso,I.torso,I.girthTorso),U.position.y=W/2*I.torso,G&&(G.scale.set(I.girthTorso,I.torso,I.girthTorso),G.position.y=ot/2*I.torso,k.position.y=W*I.torso)}function im(I,$){const pt=s.twoHandGripY??-.16,_t=Math.max(1,s.twoHandMaxStretch??1.25),jt=T*_t*.99,Zt=J.root.position.x,ae=J.root.position.y,ve=J.root.position.z,pe=J.root.rotation.y,Ne=Math.cos(pe),un=Math.sin(pe),Ze=Zi=>{const Na=zt.localToWorld(new H(0,Zi,0)),Cn=(F?k:w).worldToLocal(Na),Oa=Cn.x-Zt,Yr=Cn.y-ae,bo=Cn.z-ve,Ba={x:Oa*Ne-bo*un,y:Yr,z:Oa*un+bo*Ne};return{t:Ba,dist:Math.hypot(Ba.x,Ba.y,Ba.z)}};let _e=pt,Te=Ze(_e);if(!Number.isFinite(Te.dist)||Te.dist<=zi)return;for(let Zi=0;Zi<18&&Te.dist>jt;Zi++)if(_e*=.78,Te=Ze(_e),!Number.isFinite(Te.dist)||Te.dist<=zi)return;Number.isFinite(st)||(st=_e);const on=Math.max(0,s.twoHandSlideRate??9);st+=(_e-st)*(1-Math.exp(-on*$));const Pn=Ze(st),Ke=Pn.t,ei=Pn.dist,Vn=ei/Math.max(zi,T),ni=le(Vn,1,_t),fi=Math.max(1,s.twoHandGripStart??1.02),Yi=Math.max(fi+.001,_t),$i=le(s.twoHandMinGrip??1,0,1),Xn=le((Vn-fi)/(Yi-fi),0,1),pi=1-Xn*Xn*(3-2*Xn)*(1-$i),Wn=T/2*ni,Ua=Wp(Ke,Wn,Wn,-1),Ri=Yp({rootPitch:J.root.rotation.x,rootRoll:J.root.rotation.z,jointPitch:J.joint.rotation.x},Ua,le(I*pi,0,1),Math.PI);J.root.rotation.x=Ri.rootPitch,J.root.rotation.z=Ri.rootRoll,J.joint.rotation.x=Math.min(Ri.jointPitch,-.06);const ii=1/Math.sqrt(ni);J.upperMesh.scale.set(ii,ni,ii),J.upperMesh.position.y=-Wn/2,J.joint.position.y=-Wn,J.lowerMesh.scale.set(ii,ni,ii),J.lowerMesh.position.y=-Wn/2,J.hand.position.y=-Wn,Y={active:!0,dist:ei,gy:st,pitch:Ri.rootPitch,joint:J.joint.rotation.x,grip:pi}}function am(I,$){if(!m.enabled){at=0,E=0,Z.wrist.rotation.set(0,0,0),K=Z.root.rotation.x,yt=Wh();return}const pt=Z.root.rotation.x,_t=Wh();if($!==St){St=$,K=pt,yt=_t,Z.wrist.rotation.set(at,0,E);return}if(!Number.isFinite(K)||I<=1e-5){K=pt,yt=_t,Z.wrist.rotation.set(at,0,E);return}const jt=(pt-K)/I,Zt=Be(_t-yt)/I;K=pt,yt=_t;const ae=Math.max(0,m.maxAngle),ve=Math.max(0,m.maxTwist),pe=.15+.85*le(he,0,1),un=-le(X,0,1.4)*Math.max(0,m.runDrag),Ze=le(-jt*m.lag*pe+un,-ae,ae),_e=le(Zt*m.twistLag*pe,-ve,ve),Te=1-Math.exp(-Math.max(0,m.rate)*I);at+=(Ze-at)*Te,E+=(_e-E)*Te,Z.wrist.rotation.set(at,0,E)}function sm(I){const $=Math.PI/180;return I==="greatsword"?s.greatswordPitchDeg*$:I==="staff"?s.staffPitchDeg*$:I==="bow"?s.bowPitchDeg*$:s.swordPitchDeg*$}function Xr(I){const $=Math.PI/180;return I==="sword-shield"?s.shieldPitchDeg*$:I==="greatsword"?s.greatswordPitchDeg*$:I==="bow"?s.bowPitchDeg*$:s.swordPitchDeg*$}function om(I){const $=Math.PI/180;return I==="sword-shield"||I==="dual-swords"?(s.swordCantDeg??0)*$:I==="greatsword"?(s.greatswordCantDeg??0)*$:0}function rm(I,$){const pt=I.weapon;if(pt==="staff"||pt==="bow")return;const _t=Ye==="R",jt=_t?Z:J,Zt=_t?zt:Dt,ae=_t?J:Z,ve=_t?Dt:zt,pe=pt==="greatsword"&&_t?rt:0,Ne=pt==="greatsword"?s.greatswordYawDeg:s.swordYawDeg,un=Math.PI/180,Ze=-Ne*un,_e=Ne*un,Te=(Xn,pi)=>{const Wn=Math.max(0,Math.PI/2-Math.abs(pi));return Math.sign(Xn)*Math.min(Math.abs(Xn),Wn)},on=(fe??sm(pt)+j)+pe,Pn=$+jt.root.rotation.x+jt.joint.rotation.x;Zt.rotation.set(Math.PI/2-on-Pn,0,Te(_t?Ze:_e,on));const Ke=Yt??(pt==="sword-shield"?null:Xr(pt)+dt),ei=$+ae.root.rotation.x+ae.joint.rotation.x;pt==="sword-shield"?ve.rotation.x=Ke===null?Xr(pt):Xr(pt)-Ke-ei:ve.rotation.set(Math.PI/2-(Ke??0)-ei,0,Te(_t?_e:Ze,Ke??0));const Vn=om(pt),ni=Fe??0,fi=An??0,Yi=Qe??0,$i=xe??0;_t?(Ut.rotation.z=-Vn+ni,Ut.rotation.y=Yi,V.rotation.z=Vn+fi,V.rotation.y=$i):(V.rotation.z=Vn+ni,V.rotation.y=Yi,Ut.rotation.z=-Vn+fi,Ut.rotation.y=$i)}function Hh(I){fe=I.bladePitch,Yt=I.bladePitchOff,Qe=I.bladeTwist,xe=I.bladeTwistOff,Fe=I.bladeYaw,An=I.bladeYawOff,Ye=I.lead,Rn=I.rootYaw+I.spinYaw,y.rotation.y=Rn,w.rotation.y+=I.yaw,w.rotation.x+=I.pitch,w.rotation.z+=I.roll,x.position.z+=I.pelvisZ,x.position.x+=I.pelvisX,I.armR&&(Z.root.rotation.x=I.armR.pitch,Z.root.rotation.y=I.armR.yaw,Z.root.rotation.z=I.armR.roll,Z.joint.rotation.x=I.armR.elbow),I.armL&&(J.root.rotation.x=I.armL.pitch,J.root.rotation.y=I.armL.yaw,J.root.rotation.z=I.armL.roll,J.joint.rotation.x=I.armL.elbow)}function Gh(I,$){const pt=ge??yo(I.attackProgress),_t=pw(I.weapon,I.comboIndex,pt,p,I.attackProgress);if(I.comboIndex!==Ot){Et=mt,Jt=0,Ot=I.comboIndex;const ae=I.timings.windup+I.timings.active+I.timings.recovery,ve=Math.max(p.segBlendMin??.03,ae*.22);se=vw(Et,_t,p,_t.blend??null,ve)}const jt=Math.max(.008,se);Jt=Math.min(1,Jt+$/jt);const Zt=Et&&Jt<1?mw(Et,_t,of(Jt)):_t;return mt=Zt,Zt}function cm(I,$){const pt=P/2+b/2,_t=M-.04-O;if(!p.enabled){J.root.position.set(-pt,_t,0),Z.root.position.set(pt,_t,0),Ee={lx:-pt,ly:_t,lz:0,rx:pt,ry:_t,rz:0};return}const jt=Math.max(0,p.shoulderLift),Zt=Math.max(0,p.shoulderPush),ae=I&&$==="greatsword"?Math.max(0,p.shoulderIn):0,ve=Pn=>jt*le((-Pn-.5)/1.45,0,1),pe=Pn=>Zt*le((-Pn-.2)/1.9,0,1),Ne=-pt+ae,un=_t+ve(J.root.rotation.x),Ze=pe(J.root.rotation.x),_e=pt-ae,Te=_t+ve(Z.root.rotation.x),on=pe(Z.root.rotation.x);J.root.position.set(Ne,un,Ze),Z.root.position.set(_e,Te,on),Ee={lx:Ne,ly:un,lz:Ze,rx:_e,ry:Te,rz:on}}function lm(I){if(I.phase==="idle"||I.charging)return;const $=I.attackProgress,pt=yo($),_t=Math.max(0,pt),jt=I.comboIndex%2===0?1:-1,Zt=l.stride,ae=Number.isFinite(Zt.stepReach)?Zt.stepReach:.17,ve=Number.isFinite(Zt.stepSideReach)?Zt.stepSideReach:.14,pe=Number.isFinite(Zt.stepDipReach)?Zt.stepDipReach:.05,Ne=I.weapon==="greatsword"?le(Number.isFinite(Zt.heavyScale)?Zt.heavyScale:1,0,1):1;x.position.z+=ae*_t*Ne,x.position.x+=jt*ve*_t*Ne,x.position.y-=pe*Math.sin(Math.PI*$)*Ne}let Vh=null;function hm(){Vh={upperX:w.rotation.x,upperY:w.rotation.y,upperZ:w.rotation.z,upperPX:w.position.x,upperPZ:w.position.z,pelvisX:x.position.x,pelvisY:x.position.y,pelvisZ:x.position.z,pelvisRX:x.rotation.x,pelvisRZ:x.rotation.z,lrx:J.root.rotation.x,lry:J.root.rotation.y,lrz:J.root.rotation.z,lj:J.joint.rotation.x,rrx:Z.root.rotation.x,rry:Z.root.rotation.y,rrz:Z.root.rotation.z,rj:Z.joint.rotation.x,rootY:y.rotation.y}}function dm(I){const $=Vh;if(!$)return;const pt=of(le(I,0,1));if(pt>=1)return;const _t=(jt,Zt)=>jt+(Zt-jt)*pt;w.rotation.x=_t($.upperX,w.rotation.x),w.rotation.y=_t($.upperY,w.rotation.y),w.rotation.z=_t($.upperZ,w.rotation.z),w.position.x=_t($.upperPX,w.position.x),w.position.z=_t($.upperPZ,w.position.z),x.position.x=_t($.pelvisX,x.position.x),x.position.y=_t($.pelvisY,x.position.y),x.position.z=_t($.pelvisZ,x.position.z),x.rotation.x=_t($.pelvisRX,x.rotation.x),x.rotation.z=_t($.pelvisRZ,x.rotation.z),J.root.rotation.x=_t($.lrx,J.root.rotation.x),J.root.rotation.y=_t($.lry,J.root.rotation.y),J.root.rotation.z=_t($.lrz,J.root.rotation.z),J.joint.rotation.x=_t($.lj,J.joint.rotation.x),Z.root.rotation.x=_t($.rrx,Z.root.rotation.x),Z.root.rotation.y=_t($.rry,Z.root.rotation.y),Z.root.rotation.z=_t($.rrz,Z.root.rotation.z),Z.joint.rotation.x=_t($.rj,Z.joint.rotation.x),y.rotation.y=$.rootY+Be(y.rotation.y-$.rootY)*pt,Rn=y.rotation.y}let Ls=null,Wr=0,Xh=0;function um(){if(!F)return;const I=L,$=Math.max(0,I.waist??1),pt=Math.max(0,I.chest??0),_t=$+pt,jt=_t>1e-6?$/_t:1,Zt=_t>1e-6?pt/_t:0,ae=w.rotation.x,ve=w.rotation.y,pe=w.rotation.z;w.rotation.set(ae*jt,ve*jt,pe*jt),k.rotation.set(ae*Zt,ve*Zt,pe*Zt);const Ne=le(I.neck??0,0,1);Ne>0&&(gt.rotation.x-=ae*Ne),Ls={x:ae,y:ve,z:pe}}function _o(){return{yaw:w.rotation.y+(F?k.rotation.y:0),pitch:w.rotation.x+(F?k.rotation.x:0),lean:w.rotation.z+(F?k.rotation.z:0)}}function Wh(){return _o().yaw}function fm(I,$){if(!(d!=null&&d.enabled)){Tt=null,Ct=0;return}y.updateWorldMatrix(!0,!0);const pt=new H,_t=[],jt=(ii,Zi,Na=0)=>{ii.getWorldPosition(pt),_t.push({x:pt.x,y:pt.y+Na,z:pt.z,mass:Zi})},Zt=n.headSize;jt(gt,.08,Zt/2),jt(U,.14),jt(G??k,.24),jt(x,.12),jt(J.hand,.05),jt(Z.hand,.05),jt(ht.joint,.15),jt(q.joint,.15);const ae=Bt?Mo(xt[Bt].right):null;ae&&_t.push({x:(ae.base.x+ae.tip.x)/2,y:(ae.base.y+ae.tip.y)/2,z:(ae.base.z+ae.tip.z)/2,mass:Bt==="greatsword"?.09:.04});const ve=Math.max(.05,n.limbThickness*1.15/2+.015),pe=Math.max(.06,n.limbThickness*1.7/2+.02);let Ne=1/0,un=-1/0,Ze=1/0,_e=-1/0,Te=0;for(const ii of[ht,q])ii.tip.getWorldPosition(pt),pt.y<=.13&&(Te+=1),Ne=Math.min(Ne,pt.x-ve),un=Math.max(un,pt.x+ve),Ze=Math.min(Ze,pt.z-pe),_e=Math.max(_e,pt.z+pe);(!Number.isFinite(Ne)||Te===0)&&(Ne=un=Ze=_e=0);let on=0,Pn=0;Number.isFinite(gn)&&$>1e-5&&(on=le((I.position.x-gn)/$,-20,20),Pn=le((I.position.z-dn)/$,-20,20)),gn=I.position.x,dn=I.position.z;const Ke=aw(_t,{minX:Ne,maxX:un,minZ:Ze,maxZ:_e},on,Pn,d);if(Tt=Ke,!d.autoCounter){Ct=0;return}const ei=Math.cos(I.bodyYaw),Vn=-Math.sin(I.bodyYaw),ni=Ke.xcomX-Ke.centerX,fi=Ke.xcomZ-Ke.centerZ,Yi=ni*ei+fi*Vn,$i=on*ei+Pn*Vn,Xn=Ke.grounded?sw(Yi,$i,d.predLead??0):0;Xh=Xn;const pi=Math.abs(Xn)-.45*Ke.halfX;ie=pi;let Wn=0;pi>.002&&Ke.grounded&&(Wn=-Math.sign(Xn)*Math.min(Math.max(.005,d.maxShift??.045),(pi+.002)*1.1666666666666667));const Ua=Math.abs(Xn)/Math.max(1e-4,Ke.halfX),Ri=Math.max(.1,ow(d.counterRate,Ua,d.counterBoost??0));Ct+=(Wn-Ct)*(1-Math.exp(-Ri*$))}function pm(I,$){if(Ht.drawString.position.z=-.06,Lt.position.z=0,ne.orb.scale.setScalar(1),w.rotation.y=0,I.charging&&I.weapon==="bow"){const Zt=I.charge;J.root.rotation.x=-1.25,J.joint.rotation.x=-.15,Z.root.rotation.x=.35+Zt*.3,Z.joint.rotation.x=-1.15,Ht.drawString.position.z=-.06-Zt*.22,Lt.position.z=-Zt*.3,w.rotation.y=-.22;return}if(I.phase==="idle"&&be<=.001){Et=null,mt=null,Ot=0,Jt=1,se=Math.max(.008,p.segBlend),fe=null,Yt=null,Qe=null,xe=null,Fe=null,An=null,st=NaN,I.weapon==="greatsword"&&(zt.position.x=-Math.max(0,s.twoHandInsetX??0));return}const pt=yo(I.attackProgress),_t=Math.max(0,-pt),jt=Math.max(0,pt);if(I.weapon==="bow")J.root.rotation.x=-1.2,J.joint.rotation.x=-.15,Z.root.rotation.x=.9-jt*.8,Z.joint.rotation.x=-.3;else if(I.weapon==="greatsword")if(p.enabled)Hh(Gh(I,$));else{const Zt=-1.6*_t+1.25*jt,ae=le(Number.isFinite(l.stride.heavyScale)?l.stride.heavyScale:1,0,1);Z.root.rotation.x=Zt,Z.joint.rotation.x=-(.25+_t*.4),J.root.rotation.x=Zt+.06,J.joint.rotation.x=-(.32+_t*.4),J.root.rotation.z=.42,Z.root.rotation.z=0;const ve=-Math.sin(Z.root.rotation.x);Z.root.rotation.y=-.72*Math.tanh(ve*4),w.rotation.y=-.2*pt*ae}else if(p.enabled)Hh(Gh(I,$));else{const Zt=I.comboIndex;if(Zt===1)Z.root.rotation.x=-1.7*_t+1.1*jt,Z.joint.rotation.x=-(.2+_t*.5),J.root.rotation.x=.1,w.rotation.y=-.18*pt;else if(Zt===2)J.root.rotation.x=-1.5*_t+1*jt,J.joint.rotation.x=-(.2+_t*.5),Z.root.rotation.x=.2,w.rotation.y=.45*-pt;else{const ae=-1.9*_t+1.2*jt;J.root.rotation.x=ae,Z.root.rotation.x=ae,J.joint.rotation.x=-(.15+_t*.4),Z.joint.rotation.x=-(.15+_t*.4),w.rotation.y=-.3*pt}}if(I.weapon==="greatsword"){const Zt=le((-Z.root.rotation.x-1.3)/1.2,0,1);zt.position.x=-Math.max(0,s.twoHandInsetX??0)*(1-Zt)}lm(I)}function mm(I,$){I&&(Z.root.rotation.x=-1.05,Z.joint.rotation.x=-.35,J.root.rotation.x=-.45,J.joint.rotation.x=-.2,w.rotation.y=-.12,ne.orb.scale.setScalar(1.25+.12*Math.sin($*2)))}function gm(I){if(!I||I.phase==="idle")return;const $=I.progress,pt=$<.3?-.35+$/.3*1.35:$<.7?1:Math.max(0,1-($-.7)/.3),_t=Math.PI/180;w.rotation.x+=_.leanDeg*_t*pt,J.root.rotation.x-=_.shieldPitchDeg*_t*pt,J.joint.rotation.x-=.22*pt,Z.root.rotation.x-=.3*pt,x.position.z+=_.pelvisReach*Math.max(0,pt)}function Mo(I){if(!I)return null;const $=I.getObjectByName("bladeBase"),pt=I.getObjectByName("bladeTip");if(!$||!pt)return null;I.updateWorldMatrix(!0,!1);const _t=$.getWorldPosition(new H),jt=pt.getWorldPosition(new H),Zt=new H().setFromMatrixColumn(I.matrixWorld,0).normalize();return{base:{x:_t.x,y:_t.y,z:_t.z},tip:{x:jt.x,y:jt.y,z:jt.z},normal:{x:Zt.x,y:Zt.y,z:Zt.z}}}return{group:y,update(I,$,pt,_t,jt=!1,Zt,ae,ve){var id;Oh($.weapon),y.rotation.y=0,Rn=0,w.rotation.x=0,w.rotation.z=0,x.position.x=0,x.position.y=A,x.position.z=0,x.rotation.z=0,x.rotation.x=0,w.position.x=0,w.position.y=0,w.position.z=0,k.rotation.set(0,0,0),v.position.x=0,v.position.y=0,v.position.z=0,v.rotation.z=0;const pe=Math.max(1/240,Math.min(_t,.1));tt=((id=l.stance)==null?void 0:id[$.weapon])??null,z!==$.weapon&&(z=$.weapon,R=tt?0:1);const Ne=Math.max(.01,(tt==null?void 0:tt.blend)??.22);R=Math.min(1,R+pe/Ne);const un=tt?R:0;j=((tt==null?void 0:tt.bladePitchDeg)??0)*Math.PI/180*un,dt=((tt==null?void 0:tt.bladePitchOffDeg)??0)*Math.PI/180*un;const Ze=Zt===void 0?Ia+=_t:Zt;Cs=Ze;const _e=l.landing;_e.enabled?Ti&&!I.grounded?(Xi="jump",Ai=Ze,Wi=_e.anticipationDuration,Fa=Math.max(0,_e.jumpAnticipation),vo=.32):!Ti&&I.grounded&&(Xi="land",Ai=Ze,Wi=_e.duration,Fa=KS(za,_e),vo=_e.compressRatio,Nh=za):(Xi="none",Fa=0),Ze<Ai&&(Xi="none",Fa=0),Ti=I.grounded,za=I.velocity.y;const Te=nf(Ze,Ai,Wi,Fa,vo),on=$.phase!=="idle",Pn=(ve==null?void 0:ve.phase)==="active";he=$S(he,on,pe,l.attack.blendRate);const Ke=ZS(he,l.attack.gaitWeight,l.attack.lowerBodyWeight);Un=Ke.attackLegWeight,hn=Ke.gaitScale;const ei=Math.sin(I.bodyYaw),Vn=Math.cos(I.bodyYaw),ni=(I.velocity.x-ct)/pe,fi=(I.velocity.z-It)/pe,Yi=le(ni,-60,60),$i=le(fi,-60,60),Xn=Yi*ei+$i*Vn,pi=Be(I.bodyYaw-et)/pe,Wn=Math.hypot(I.velocity.x,I.velocity.z),Ua=o.maxForwardDeg*Math.PI/180,Ri=o.maxSideDeg*Math.PI/180,ii=le(Xn*o.accelGain,-Ua,Ua),Zi=le(-pi*Wn*o.turnGain,-Ri,Ri),Na=1-Math.exp(-o.smoothing*pe);ft+=(ii-ft)*Na,Nt+=(Zi-Nt)*Na,ct=I.velocity.x,It=I.velocity.z,et=I.bodyYaw;const Cn=Math.hypot(I.velocity.x,I.velocity.z),Oa=le(a.knockGaitScale??0,0,1),Yr=pt.knockX*Oa,bo=pt.knockZ*Oa,Ba=Oa>0&&Math.hypot(pt.knockX,pt.knockZ)>.001,$r=I.velocity.x+Yr,Zr=I.velocity.z+bo,Yh=Math.hypot($r,Zr);Ie=Yh;const xm=Math.cos(I.bodyYaw),vm=-Math.sin(I.bodyYaw),ym=I.velocity.x*xm+I.velocity.z*vm,$h=Cn>zi?le(ym/Cn,-1,1):0,Zh=Cn>zi?le((I.velocity.x*ei+I.velocity.z*Vn)/Cn,-1,1):1,_m=Ih(Zh,a.backStrafeStartDeg,a.backStrafeFullDeg);ye==="settled"&&an&&sn>Fn*1.02+1e-4&&(ye="none");let Ds=1;ye==="blend"?(Ds=Op(Je?En:We,a.stopYawBlendMode,Je),Je||(We=Math.min(1,We+pe/Math.max(.01,a.stopYawAfterSec)),(We>=1||a.stopYawBlendMode==="inStop"||an)&&(ye="settled",Ds=0))):ye==="settled"&&(Ds=le(Cn/Math.max(zi,a.stopEnterRatio*e),0,1)),wn=Ds;const Mm=Ip($h,i.legYawScale,i.hipYawMaxDeg,a.strafeHipBoost),bm=zp(Zh,$h,Mm,_m)*Ds;vt+=(bm-vt)*(1-Math.exp(-i.hipYawSmoothing*pe));const ks=I.bodyYaw+vt;Xt=ks;const Sm=Math.sin(ks),wm=Math.cos(ks),Em=Math.cos(ks),Tm=-Math.sin(ks),mi={speed:Yh,phase:I.gaitPhase,localForward:$r*Sm+Zr*wm,localRight:$r*Em+Zr*Tm,stride:I.stride};on&&!we&&(te=I.gaitPhase),we=on;const Ha=he>0?WS(mi,$.attackProgress,$.comboIndex,he,l.stride,te):mi;Vi=Ha;const jh=Math.max(0,a.stopBlendSec||0),qh=jh>0&&!on&&!Ba&&I.grounded,jr=Fp(Cn,ee,e,a.stopEnterRatio,a.stopExitRatio);if(!qh||jr.resume)Gt=-1;else if(Gt<0&&jr.enter){Gt=0,$t=I.gaitPhase,N=Dp(I.gaitPhase),Rt=Cn,it=Math.max(I.stride,zi),ut=mi.localForward,Pt=mi.localRight;const Kt=1/Math.max(zi,Cn);At=I.velocity.x*Kt,qt=I.velocity.z*Kt}const Am=ee;ee=Cn;const gi=qh&&Gt>=0;gi&&(Gt=Math.min(1,Gt+pe/jh)),gi&&ye!=="blend"&&(ye="blend",We=0),Je=gi&&Gt<1,En=Gt,an=jr.resume,sn=Cn,Fn=Am;const Kh=gi?{phase:$t,speed:Rt,moveSpeed:e,localForward:ut,localRight:Pt,legLength:n.legLength,stride:it,grounded:!0}:{phase:Ha.phase,speed:Ha.speed,moveSpeed:e,localForward:Ha.localForward,localRight:Ha.localRight,legLength:n.legLength,stride:Ha.stride??0,grounded:I.grounded};let qr=gi?kp(Kh,a,{progress:Gt,phase0:$t,phaseEnd:N}):Dr(Kh,a);const ha=l.attack.moveTakeover;if(ha&&!gi){const Kt=$.phase==="windup"?ha.windup:$.phase==="recovery"?ha.recovery:$.phase==="settle"?ha.settle:0,oe=Math.max(.05,ha.full-ha.speed),_n=le((mi.speed-ha.speed)/oe,0,1),Ln=le(Kt,0,1)*_n,So=Ln>$e?10:6;$e=le($e+(Ln-$e)*(1-Math.exp(-So*pe)),0,1)}else gi?$e=0:$e=le($e*Math.exp(-8*pe),0,1);if($e>.001&&!gi){const Kt=Dr({phase:mi.phase,speed:mi.speed,moveSpeed:e,localForward:mi.localForward,localRight:mi.localRight,legLength:n.legLength,stride:mi.stride??0,grounded:I.grounded},a);qr=jS(qr,Kt,$e)}const Ae=qS(qr,Ke.gaitScale);if(ce=0,Pn&&ve){const Kt=GS(ve.progress,ve.dir,a),oe=Ke.gaitScale;Ae.legL.pitchX+=Kt.legL.pitchX*oe,Ae.legL.rollZ+=Kt.legL.rollZ*oe,Ae.legL.kneeX+=Kt.legL.kneeX*oe,Ae.legR.pitchX+=Kt.legR.pitchX*oe,Ae.legR.rollZ+=Kt.legR.rollZ*oe,Ae.legR.kneeX+=Kt.legR.kneeX*oe,Ae.pelvisY+=Kt.pelvisY*oe,ce=Kt.env}let Kr=0,Jr=0,Qr=0,Jh=0;if(gi){const Kt=Np(I.bodyYaw,At,qt),oe=Bp(Gt,$t,Kt.forward,Kt.right,a);oe.leadLeft?(Ae.legL.pitchX-=oe.leadPitch,Ae.legL.kneeX+=oe.leadKnee,Ae.legR.pitchX+=oe.trailPitch):(Ae.legR.pitchX-=oe.leadPitch,Ae.legR.kneeX+=oe.leadKnee,Ae.legL.pitchX+=oe.trailPitch),Jr=oe.bodyShift*oe.fwdN,Kr=oe.bodyShift*oe.rightN,Qr=oe.bodyDip,Jh=oe.chestPitch,De=oe.leadPitch,yn=oe.bodyShift,Xe=oe.bodyDip}else De=0,yn=0,Xe=0;if(Nn={lp:Ae.legL.pitchX,lr:Ae.legL.rollZ,rp:Ae.legR.pitchX,rr:Ae.legR.rollZ},!I.grounded)ht.root.rotation.x=-.55,q.root.rotation.x=-.25,ht.joint.rotation.x=.75,q.joint.rotation.x=.55,J.root.rotation.x=-.9,Z.root.rotation.x=-.7,J.joint.rotation.x=-.6,Z.joint.rotation.x=-.6,ht.root.rotation.z=0,q.root.rotation.z=0;else{ht.root.rotation.x=Ae.legL.pitchX,q.root.rotation.x=Ae.legR.pitchX,ht.root.rotation.z=Ae.legL.rollZ,q.root.rotation.z=Ae.legR.rollZ,ht.joint.rotation.x=Ae.legL.kneeX,q.joint.rotation.x=Ae.legR.kneeX;const Kt=tt?R:0,oe=1+(((tt==null?void 0:tt.armSwing)??1)-1)*Kt,_n=tt==null?void 0:tt.armR,Ln=tt==null?void 0:tt.armL,So=Ae.armL*oe+((Ln==null?void 0:Ln.pitch)??0)*Kt,ad=Ae.armR*oe+((_n==null?void 0:_n.pitch)??0)*Kt;J.root.rotation.x=So,Z.root.rotation.x=ad,J.joint.rotation.x=-(.18+So*.2)+((Ln==null?void 0:Ln.elbow)??0)*Kt,Z.joint.rotation.x=-(.18+ad*.2)+((_n==null?void 0:_n.elbow)??0)*Kt,J.root.rotation.z=((Ln==null?void 0:Ln.roll)??0)*Kt,Z.root.rotation.z=((_n==null?void 0:_n.roll)??0)*Kt,J.root.rotation.y=((Ln==null?void 0:Ln.yaw)??0)*Kt,Z.root.rotation.y=((_n==null?void 0:_n.yaw)??0)*Kt,x.position.x=Ae.pelvisX,x.position.y=A+Ae.pelvisY,x.position.z=0,x.rotation.z=Ae.pelvisRoll}const Rm=$p(x,v),Is=Pn?{...f,weight:0}:gi&&f.enabled?{...f,weight:1}:f,Qh=Is.enabled&&I.grounded&&Is.weight>0?le(Is.weight,0,1)*(on?le(Is.attackScale,0,1):1):0;x.position.x+=Kr,x.position.z+=Jr,x.position.y-=Qr,v.position.y+=Qr,Qh<=0&&(v.position.x-=Kr,v.position.z-=Jr);const tc=Cn/Math.max(e,zi);X=tc;const Pm=Number.isFinite(o.crouchSmoothing)?o.crouchSmoothing:8,Cm=1-Math.exp(-Math.max(0,Pm)*pe);lt+=(le(tc,0,1)-lt)*Cm;const Ga=Xp({leanForward:ft,leanSide:Nt,speedRatio:lt},o);x.rotation.x+=Ga.pelvisPitch,x.rotation.z+=Ga.pelvisRoll,x.position.x+=Ga.pelvisX,x.position.z+=Ga.pelvisZ,x.position.y-=Ga.crouch,v.position.y+=Ga.crouch*(1-le(Qh,0,1));const td=$.phase!=="idle"||$.charging&&$.weapon==="bow",ec=td?1:0,Lm=Math.max(.001,ec>be?p.poseIn??.1:p.poseOut??.16);if(be!==ec){const Kt=pe/Lm;be=le(be+(ec>be?Kt:-Kt),0,1)}if((be>0||td)&&hm(),pm($,pe),be>0&&be<1&&dm(be),tt){const Kt=(1-be)*R;w.rotation.y+=(tt.torsoYaw??0)*Kt,w.rotation.x+=(tt.torsoPitch??0)*Kt}mm(jt,I.gaitPhase),gm(ae);const Dm=$.weapon==="greatsword",ed=Math.hypot(I.velocity.x,I.velocity.z),km=Dm&&$.phase==="idle"&&ed>.5?Math.min(1.15,ed/Math.max(e,.001)*.9):0;rt+=(km-rt)*(1-Math.exp(-6*pe));const Im=w.rotation.x;$.weapon==="bow"&&(Ht.g.rotation.x=-(J.root.rotation.x+J.joint.rotation.x),Lt.rotation.x=-(Z.root.rotation.x+Z.joint.rotation.x));const zm=w.rotation.y;em(pt,I.bodyYaw);const nd=pt.type==="none"?1:.4;if(w.rotation.x+=ft*nd+Jh,w.rotation.z+=(Nt+Ae.sideLean)*nd,Te>0&&(ht.root.rotation.x-=_e.hipPitch*Te,q.root.rotation.x-=_e.hipPitch*Te,ht.joint.rotation.x+=_e.kneeBend*Te,q.joint.rotation.x+=_e.kneeBend*Te,x.position.y-=_e.crouchDepth*Te,v.position.y+=_e.crouchDepth*(1-_e.lowerScale)*Te,w.rotation.x+=_e.upperPitch*Te,J.root.rotation.x-=_e.armTuck*Te,Z.root.rotation.x-=_e.armTuck*Te),Un>0&&I.grounded){const Kt=YS($.attackProgress,$.comboIndex,l.stride),oe=Un;ht.root.rotation.x+=Kt.legL.pitchX*oe,q.root.rotation.x+=Kt.legR.pitchX*oe,ht.root.rotation.z+=Kt.legL.rollZ*oe,q.root.rotation.z+=Kt.legR.rollZ*oe,ht.joint.rotation.x+=Kt.legL.kneeX*oe,q.joint.rotation.x+=Kt.legR.kneeX*oe,x.position.x+=Kt.pelvisX*oe,x.position.y+=Kt.pelvisY*oe,x.rotation.z+=Kt.pelvisRoll*oe}if(cm(on,$.weapon),d!=null&&d.enabled&&d.autoCounter&&Math.abs(Ct)>1e-4&&(x.position.x+=Ct),g.enabled){const Kt=$.phase!=="idle"&&!$.charging,oe=Kt?yo($.attackProgress):0;Kt&&C>.55&&oe<C-1e-4&&(Gn=1),C=oe,Gn=hw(Gn,pe,g.impactDecay);const _n=cw({swing:oe,charge:$.charging?$.charge:0,impact:Gn,speedRatio:tc,grounded:I.grounded},g);Tn=lw(Tn,_n,pe,g.smoothing)}else Tn={...eh};nm(Tn),v.rotation.y=vt,re=Up(vt,a.chestYawScale,a.chestYawMaxDeg),w.rotation.y+=re;const Fm=zm;if(gt.rotation.y=Be(I.headYaw-I.bodyYaw-Fm-re),gt.rotation.x=-le(I.headPitch??0,-.7,.7),w.rotation.x+=-le(I.bodyPitch??0,-.4,.4),um(),am(_t,$.comboIndex),rm($,Im),$.weapon==="greatsword"&&!$.charging&&($.phase!=="idle"||be>0)){y.updateWorldMatrix(!0,!0);const Kt=$.phase==="idle"?Math.max(be,he):1;im(le(Kt,0,1),pe)}if(B=Zp({root:y,pelvis:x,lower:v,limbs:bt,base:Rm,cfg:Is,grounded:I.grounded,attacking:on}),fm(I,pe),F&&Ls){const Kt=_o();Wr=Math.max(Math.abs(Kt.pitch-Ls.x),Math.abs(Kt.yaw-Ls.y),Math.abs(Kt.lean-Ls.z))}else Wr=0},lean(){return{forward:ft,side:Nt}},landing(){const I=nf(Cs,Ai,Wi,Fa,vo),$=Wi>0?Math.max(0,Wi-Math.max(0,Cs-Ai)):0;return{pulse:I,remaining:$,kind:I>0?Xi:"none",impactVy:Nh}},hurt(){return wt},ik(){return B},stretch(){return{...Tn,impact:Gn}},gripDebug(){return{...Y}},weaponDebug(){return{wristPitch:at,wristTwist:E}},setClipT(I){ge=I===null||!Number.isFinite(I)?null:Math.max(0,Math.min(1,I))},stanceDebug(){const I=tt==null?void 0:tt.armR,$=tt==null?void 0:tt.armL,pt=tt?R:0;return{weapon:Bt??"sword-shield",weight:pt,armL:{pitch:(($==null?void 0:$.pitch)??0)*pt,yaw:(($==null?void 0:$.yaw)??0)*pt,roll:(($==null?void 0:$.roll)??0)*pt,elbow:(($==null?void 0:$.elbow)??0)*pt},armR:{pitch:((I==null?void 0:I.pitch)??0)*pt,yaw:((I==null?void 0:I.yaw)??0)*pt,roll:((I==null?void 0:I.roll)??0)*pt,elbow:((I==null?void 0:I.elbow)??0)*pt},torsoYaw:((tt==null?void 0:tt.torsoYaw)??0)*pt,torsoPitch:((tt==null?void 0:tt.torsoPitch)??0)*pt,bladePitchDeg:j*180/Math.PI,bladePitchOffDeg:dt*180/Math.PI,armSwing:(tt==null?void 0:tt.armSwing)??1}},swingDebug(){const I=mt;return{seg:Ot,kind:(I==null?void 0:I.kind)??"right-left",lead:(I==null?void 0:I.lead)??"R",yaw:(I==null?void 0:I.yaw)??0,rootYaw:(I==null?void 0:I.rootYaw)??0,spinYaw:(I==null?void 0:I.spinYaw)??0,rootTurn:Rn,pitch:(I==null?void 0:I.pitch)??0,roll:(I==null?void 0:I.roll)??0,strike:(I==null?void 0:I.strike)??0,bladeTwist:(I==null?void 0:I.bladeTwist)??0,bladeTwistOff:(I==null?void 0:I.bladeTwistOff)??0,bladeYaw:(I==null?void 0:I.bladeYaw)??0,bladeYawOff:(I==null?void 0:I.bladeYawOff)??0,shoulderL:{x:Ee.lx,y:Ee.ly,z:Ee.lz},shoulderR:{x:Ee.rx,y:Ee.ry,z:Ee.rz}}},attackBlend(){return he},attackWeights(){return{gaitScale:hn,attackLegWeight:Un,driveSpeed:Vi.speed,stridePhase:Vi.phase}},hipYaw(){return vt},torsoTotal(){return _o()},spineDebug(){if(!F)return null;const I=_o();return{enabled:!0,waistYaw:w.rotation.y,chestYaw:k.rotation.y,totalYaw:I.yaw,totalPitch:I.pitch,totalLean:I.lean,neckPitch:gt.rotation.x,leak:Wr}},balanceDebug(){return Tt?{...Tt,shift:Ct,latDeficit:ie,lateralFf:Xh}:null},gaitDebug(){return{stopT:Gt,hipYaw:vt,chestYaw:re,speed:ee,gaitSpeed:Ie,stopStep:De,stopShift:yn,stopDip:Xe,stopYawFade:wn,turnStep:ce,legTakeover:$e,legLPitch:Nn.lp,legLRoll:Nn.lr,legRPitch:Nn.rp,legRRoll:Nn.rr}},gaitYaw(){return Xt},arrowDirection(){Lt.updateWorldMatrix(!0,!1);const I=Lt.matrixWorld.elements,$=I[8],pt=I[9],_t=I[10],jt=Math.hypot($,pt,_t)||1;return{x:$/jt,y:pt/jt,z:_t/jt}},weaponBlade(){return Bt?Mo(xt[Bt].right):null},bladesWorld(){return Bt?{right:Mo(xt[Bt].right),left:Mo(xt[Bt].left)}:{right:null,left:null}},dispose(){y.traverse(I=>{if(I instanceof me){I.geometry.dispose();const $=I.material;Array.isArray($)?$.forEach(pt=>pt.dispose()):$.dispose()}})}}}function ww(n){const t=jp(n.voxel,n.colors,n.moveSpeed,n.orientation,n.gait,n.mount,n.lean,n.hurt,n.animation,n.ik,n.links,n.wrist,n.balance),e=new Pe;e.add(t.group);const i={position:{x:0,y:0,z:0},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:1,distance:0,coyoteTime:0,jumpBuffer:0},a=[];for(const s of["headPivot","chest","torsoUpper","torso","pelvis"]){const o=t.group.getObjectByName(s);o&&a.push(o)}return{group:e,update(s,o,r){i.position.x=s.position.x,i.position.y=s.position.y,i.position.z=s.position.z,i.velocity.x=s.velocity.x+s.hurt.knockX,i.velocity.y=s.velocity.y,i.velocity.z=s.velocity.z+s.hurt.knockZ,i.facing=s.facing,i.moveYaw=Math.atan2(i.velocity.x,i.velocity.z),i.bodyYaw=s.bodyYaw,i.headYaw=s.headYaw,i.gaitPhase=s.gaitPhase,i.stride=s.stride,i.distance=s.distance,i.grounded=!0,i.sprinting=!1,e.position.set(s.position.x,s.position.y,s.position.z),e.rotation.y=s.bodyYaw,s.combat&&t.update(i,s.combat,s.hurt,o,!1,r,s.link)},boneAtWorld(s,o,r){if(a.length===0)return null;const l=new H(s,o,r),c=new H;let h=null,u=Number.POSITIVE_INFINITY;for(const d of a){d.updateWorldMatrix(!0,!1),d.getWorldPosition(c);const f=c.distanceToSquared(l);f<u&&(u=f,h=d)}return h?{node:h,point:l}:null},dispose(){t.dispose()}}}const _a=.012,Ma=.016;function Ew(n,t){const e=t.lab,i=new Pe;i.name="test-lab";const a=[],s=[],o=[],r=[];function l(y){return o.push(y),y}function c(y){return r.push(y),y}function h(y,x,v,w=_a){const S=l(new en({color:x,transparent:!0,opacity:v,depthWrite:!1,side:Oe,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),A=new me(y,S);return A.rotation.x=-Math.PI/2,A.position.y=w,A.renderOrder=2,A}function u(y,x){return c(new vs(Math.max(y,.001),x,72))}function d(y,x,v,w=Ma){const A=document.createElement("canvas"),T=A.getContext("2d");if(!T)return new me;const b='700 96px "Noto Sans SC", ui-monospace, Menlo, monospace';T.font=b,A.width=Yd.ceilPowerOfTwo(Math.ceil(T.measureText(y).width)+32),A.height=Yd.ceilPowerOfTwo(96*1.4);const M=A.getContext("2d");if(!M)return new me;M.font=b,M.textAlign="center",M.textBaseline="middle",M.fillStyle=v,M.fillText(y,A.width/2,A.height/2);const P=new Kl(A);P.colorSpace=In,s.push(P);const L=A.width/A.height,F=c(new Jn(x*L,x)),O=l(new en({map:P,transparent:!0,depthWrite:!1,side:Oe,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3})),k=new me(F,O);return k.rotation.x=-Math.PI/2,k.position.y=w,k.renderOrder=3,k}function f(y,x,v,w,S,A){const T=v-x,b=c(new Jn(T,w)),M=h(b,S,A,_a);M.position.set(T/2+x,_a,0);const P=new Pe;return P.add(M),P.rotation.y=y-Math.PI/2,P}function m(y,x,v,w,S){const A=new Ep;A.moveTo(0,x*.5),A.lineTo(-v*.5,x*.5-v*.9),A.lineTo(-v*.18,x*.5-v*.9),A.lineTo(-v*.18,-x*.5),A.lineTo(v*.18,-x*.5),A.lineTo(v*.18,x*.5-v*.9),A.lineTo(v*.5,x*.5-v*.9),A.closePath();const T=c(new kh(A)),b=h(T,w,S,_a+.002),M=new Pe;return M.add(b),M.rotation.y=y+Math.PI,M}function _(y){var T;const x=new Pe,v=d(`${y.index} · ${y.name}`,t.lab.labelTextHeight,"#eaf4ff"),S=((T=v.geometry.parameters)==null?void 0:T.width)??3;x.add(v);const A=h(c(new Jn(S*.98,.08)),y.color,.7,Ma);return A.position.set(0,Ma,t.lab.labelTextHeight*.66),x.add(A),x.position.set(y.labelX,0,y.labelZ),x}const g=new Pe;for(const y of n??[]){const x=new Pe;if(x.position.set(y.x,0,y.z),y.shape==="square"){const v=y.radius,w=h(c(new Jn(v*2,v*2)),y.color,e.padOpacity*.09);x.add(w);const S=.07,A=[[0,v,v*2+S,S],[0,-v,v*2+S,S],[-v,0,S,v*2+S],[v,0,S,v*2+S]];for(const[T,b,M,P]of A){const L=h(c(new Jn(M,P)),y.color,e.padOpacity);L.position.x=T,L.position.z=b,x.add(L)}}else x.add(h(c(new Ph(y.radius,72)),y.color,e.padOpacity*.075)),x.add(h(u(y.radius-.075,y.radius),y.color,e.padOpacity));if(y.id==="hub"){for(let v=0;v<4;v++){const w=v*Math.PI/4,S=v%2===0;for(const A of[0,Math.PI])x.add(f(w+A,y.radius*.12,y.radius*.94,S?.09:.055,y.color,S?.5:.32))}x.add(h(u(.5,.56),y.color,.4))}else if(y.id==="dash"){const v=y.spawnZ-y.z,w=-y.radius+.5,S=v-w,A=h(c(new Jn(.06,S)),y.color,.36);A.position.set(0,_a,(v+w)/2),x.add(A);let T=0;for(let M=v;M>=w-.01;M-=1,T++){const P=T%5===0,L=h(c(new Jn(P?2.4:1.3,P?.1:.07)),y.color,P?.72:.42);L.position.set(0,_a,M),x.add(L);const F=d(String(T),.52,P?"#eaf4ff":"rgba(200,225,245,0.8)");F.position.set(1.6,Ma,M),x.add(F)}const b=[[3.2,"翻滚 3.2"],[5,"闪现 5.0"]];for(const[M,P]of b){const L=v-M,F=h(c(new Jn(1.9,.09)),"#ffffff",.5);F.position.set(-1.5,_a,L),x.add(F);const O=d(P,.42,"rgba(220, 236, 250, 0.86)");O.position.set(-3,Ma,L),x.add(O)}}else if(y.id==="gait"){x.add(h(u(1.44,1.5),y.color,.5)),x.add(h(u(1.14,1.2),y.color,.22));const v=1.55,w=[[0,"180° 正后退","#ff9a8a"],[Math.PI/4,"135° 斜后","#ffd166"],[Math.PI/2,"90° 正侧移","#8fe7ff"]];for(const[S,A,T]of w){const M=Math.sin(S),P=Math.cos(S),L=m(S,1.7,.34,T,.75);L.position.set(M*1.7*.5,0,v+P*1.7*.5),x.add(L);const F=d(A,.44,T);F.position.set(M*(1.7+.7),Ma,v+P*(1.7+.7)),x.add(F)}}if(g.add(x),e.showLabels){const v=_(y);a.push(v),g.add(v)}}i.add(g);const p=n==null?void 0:n.find(y=>y.id==="hub");if(p&&e.showLabels){const y=[[0,-1,"屏上"],[0,1,"屏下"],[-1,0,"屏左"],[1,0,"屏右"]];for(const[x,v,w]of y){const S=d(w,.4,"rgba(190, 224, 248, 0.8)");S.position.set(p.x+x*(p.radius+.7),Ma,p.z+v*(p.radius+.7)),i.add(S),a.push(S)}}return i.visible=e.enabled,{group:i,setVisible(y){i.visible=y},setLabelsVisible(y){for(const x of a)x.visible=y},dispose(){for(const y of r)y.dispose();for(const y of o)y.dispose();for(const y of s)y.dispose();i.clear()}}}const Fh=64,qp=[0,.24,.76,1],Tw=[0,1,1,0],Kp=[0,.12,.28,.5,.72,.88,1],Aw=[0,.16,.5,1,.5,.16,0];function rf(n,t){if(t<=1e-6)return 1;const e=Math.min(1,Math.max(0,n/t));return e*e*(3-2*e)}function Uh(n,t,e,i,a=Fh,s="band"){const o=Math.max(.001,n-t*.5),r=Math.max(o+.001,n+t*.5),l=s==="glow"?Kp:qp,c=s==="glow"?Aw:Tw,h=l.length,u=a+1,d=new Float32Array(u*h*3),f=new Float32Array(u*h*4),m=[];for(let g=0;g<u;g++){const p=g/a,y=(p-.5)*e,x=rf(p,i)*rf(1-p,i),v=Math.sin(y),w=Math.cos(y);for(let S=0;S<h;S++){const A=o+(r-o)*l[S],T=g*h+S;d[T*3]=v*A,d[T*3+1]=0,d[T*3+2]=w*A;const b=x*c[S];f[T*4]=1,f[T*4+1]=1,f[T*4+2]=1,f[T*4+3]=b}}for(let g=0;g<a;g++)for(let p=0;p<h-1;p++){const y=g*h+p,x=y+h;m.push(y,x,y+1,y+1,x,x+1)}const _=new nn;return _.setAttribute("position",new vn(d,3)),_.setAttribute("color",new vn(f,4)),_.setIndex(m),_.computeBoundingSphere(),_}function jc(n){const t=new en({color:n.color,transparent:!0,opacity:n.opacity,depthWrite:!1,side:Oe,vertexColors:!0,toneMapped:!1}),e=new Map;let i=null;const a=(l,c)=>{const h=Math.round(l*32)/32,u=Math.max(.05,Math.round(c*20)/20),d=`${Math.round(h*32)}|${Math.round(u*20)}`,f=e.get(d);if(f)return f;const m=Uh(n.radius,n.thickness*u,h,n.edgeFade,Fh,n.profile??"band");if(e.set(d,m),e.size>64){for(const[_,g]of e)if(_!==d&&g!==i){g.dispose(),e.delete(_);break}}return m};i=a(n.arcRad,1);const s=new me(i,t);s.position.y=n.y,s.renderOrder=n.renderOrder??4;let o=n.arcRad,r=1;return{mesh:s,update(l,c,h,u,d,f=1){const m=Math.max(.05,f);(Math.abs(l-o)>.01||Math.abs(m-r)>.01)&&(i=a(l,m),s.geometry=i,o=l,r=m),t.opacity=c,t.color.copy(u),s.scale.set(h,1,h),s.rotation.y=d,s.visible=c>.002},arcRad(){return o},dispose(){for(const l of e.values())l.dispose();e.clear(),t.dispose()}}}function cf(n,t){return Math.max(.05,n*.5*Math.max(.1,t))}function Rw(n,t,e,i,a){const s=a.arcDeg*Math.PI/180,o=a.playerOpacity;if(!n)return{arcRad:s,opacity:o,scale:1,level:0};const r=Math.min(1,Math.max(0,t)),l=Math.min(1,Math.max(0,e)),c=a.selectedArcDeg*Math.PI/180,h=s+(c-s)*(.35+.65*r),u=4+4*r+6*l,d=.5+.5*Math.sin(i*u),f=Math.min(.95,o+(.2+.1*l)*r+.04*d),m=1+.02*r+.012*d*r;return{arcRad:h,opacity:f,scale:m,level:r}}function Pw(n,t,e,i,a){const s=Math.min(1,Math.max(0,a));return s<=.001?n.copy(t):s<.5?n.copy(t).lerp(e,s*2):n.copy(e).lerp(i,(s-.5)*2)}function Cw(n=64,t=.06,e=5){const i=n+1,a=e+1,s=new Float32Array(i*a*3),o=new Float32Array(i*a*4),r=[];for(let c=0;c<i;c++){const h=c/n*Math.PI*2,u=Math.sin(h),d=Math.cos(h);for(let f=0;f<a;f++){const m=f/e,_=t+(1-t)*m,g=c*a+f;s[g*3]=u*_,s[g*3+1]=0,s[g*3+2]=d*_;const p=Math.pow(1-m,1.8)*.9+(f===0?.1:0);o[g*4]=1,o[g*4+1]=1,o[g*4+2]=1,o[g*4+3]=Math.min(1,p)}}for(let c=0;c<n;c++)for(let h=0;h<e;h++){const u=c*a+h,d=u+a;r.push(u,d,u+1,u+1,d,d+1)}const l=new nn;return l.setAttribute("position",new vn(s,3)),l.setAttribute("color",new vn(o,4)),l.setIndex(r),l.computeBoundingSphere(),l}function lf(n){const t=n.segments??Fh,e=n.profile??"band",a=((e==="glow"?Kp.length:qp.length)-1)*6,s=Uh(n.radius,n.thickness,n.arcRad,n.edgeFade,t,e),o=new en({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Oe,vertexColors:!0,toneMapped:!1}),r=new me(s,o);r.position.y=n.y,r.renderOrder=n.renderOrder??7,r.visible=!1,s.setDrawRange(0,0);let l=0;return{mesh:r,set(c,h,u,d,f=1){const m=Math.min(1,Math.max(0,c)),_=Math.round(m*t),g=m>.001?Math.max(1,_)*a:0;g!==s.drawRange.count&&s.setDrawRange(0,g),l=_,o.opacity=h,o.color.copy(u),r.scale.set(f,1,f),r.rotation.y=d,r.visible=h>.002&&m>.001},ratio(){return t>0?l/t:0},filledSegments(){return l},dispose(){s.dispose(),o.dispose()}}}function hf(n){const t=new Pe,e=Cw(48),i=new en({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Oe,vertexColors:!0,toneMapped:!1}),a=new me(e,i);a.renderOrder=n.renderOrder??2,t.add(a);const s=Math.max(.01,n.edgeWidthRatio??.045),o=Uh(1-s*.5,s,Math.PI*2,0,64,"band"),r=new en({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Oe,vertexColors:!0,toneMapped:!1}),l=new me(o,r);return l.renderOrder=(n.renderOrder??2)+1,t.add(l),t.position.y=n.y,{group:t,set(c,h,u,d,f,m){const _=Math.min(1,Math.max(0,f));t.position.set(c,u,h),a.scale.set(d,1,d),l.scale.set(d,1,d),i.opacity=_*.26,r.opacity=_*(.72+.18*Math.sin(m*7)),t.visible=_>.004},dispose(){e.dispose(),i.dispose(),o.dispose(),r.dispose()}}}function df(n,t,e,i){if(i<=1e-4||e<=0)return t;const a=1-Math.exp(-e/i);return n+(t-n)*a}function Lw(n,t,e){if(n!=="windup")return{active:!1,ratio:0,urgency:0};const i=Math.max(1e-4,e),a=Math.min(1,Math.max(0,t/i));return{active:!0,ratio:a,urgency:.35+.65*a}}function Dw(n){if(n.charging)return{source:"charge",ratio:Math.min(1,Math.max(0,n.charge))};if(n.channeling){if(n.channelProgress!==void 0)return{source:"channel",ratio:Math.min(1,Math.max(0,n.channelProgress))};const i=Math.max(1e-4,n.fireInterval);return{source:"channel",ratio:1-Math.min(1,Math.max(0,n.fireTimer/i))}}const t=n.arcaneCooldown??0,e=n.arcaneCooldownMax??0;return t>0&&e>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,t/e))}:n.dashCooldown>0&&n.dashCooldownMax>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,n.dashCooldown/n.dashCooldownMax))}:{source:"none",ratio:0}}function kw(n,t,e,i,a,s){return n!=="windup"||a<=.05?{active:!1,x:t,z:e,radius:0}:{active:!0,x:t+Math.sin(i)*a,z:e+Math.cos(i)*a,radius:Math.max(.3,s)}}function Iw(n,t){const e=Math.max(.02,t),i=Math.min(1,Math.max(0,n/e));return{scale:.06+.94*(1-Math.pow(1-i,3)),alpha:i}}function zw(n,t,e){return n?t:e}function Jp(n){return{x:0,y:0,z:1}}function Fw(n){return Math.asin(Jp().y)}function Uw(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}const Nw=Math.PI/3;function uf(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function Ow(){let n=0,t=!1;return{update(e,i,a,s=Nw){if(!Number.isFinite(e))return n;if(!t)return t=!0,n=e,n;if(!(a>0)||!(i>0))return n=e,n;const o=uf(e-n);if(Math.abs(o)>=s)return n=e,n;const r=1-Math.exp(-i/(a/1e3));return n=uf(n+o*r),n},reset(e){t=!0,n=e},get value(){return n},get ready(){return t}}}function Bw(n){const t=Math.max(2,Math.floor(n.maxSamples)),e=new nn,i=new Float32Array(t*2*3),a=new Float32Array(t*2*3),s=new vn(i,3),o=new vn(a,3);s.setUsage(Vd),o.setUsage(Vd),e.setAttribute("position",s),e.setAttribute("color",o);const r=[];for(let x=0;x<t-1;x++){const v=x*2,w=v+1,S=v+2,A=v+3;r.push(v,w,S,w,A,S)}e.setIndex(r),e.setDrawRange(0,0);const l=new en({vertexColors:!0,transparent:!0,opacity:1,blending:Ui,depthWrite:!1,side:Oe}),c=new me(e,l);c.frustumCulled=!1,c.renderOrder=6,c.visible=!1;const h=new Qt(n.color);let u=[],d=null,f=0,m=0,_=!1,g=!1,p=0;function y(){const x=u.length;if(x<2||!n.enabled){c.visible=!1,e.setDrawRange(0,0);return}const v=Math.max(.001,n.life);for(let w=0;w<x;w++){const S=u[w],A=Math.max(0,1-S.age/v),T=A*A,b=Math.min(1,S.speed/Math.max(.001,n.minSpeed*2)),M=n.intensity*T*(.55+.45*b)*(1+p),P=.18+.82*A,L=w*6;i[L]=S.tx+(S.bx-S.tx)*P,i[L+1]=S.ty+(S.by-S.ty)*P,i[L+2]=S.tz+(S.bz-S.tz)*P,i[L+3]=S.tx,i[L+4]=S.ty,i[L+5]=S.tz;const F=h.r*M,O=h.g*M,k=h.b*M,D=F*.22,U=O*.22,G=k*.22;a[L]=D,a[L+1]=U,a[L+2]=G;const W=1+n.tipBoost;a[L+3]=Math.min(1,F*W),a[L+4]=Math.min(1,O*W),a[L+5]=Math.min(1,k*W)}s.needsUpdate=!0,o.needsUpdate=!0,e.setDrawRange(0,(x-1)*6),c.visible=!0}return{object:c,update(x,v,w){if(!n.enabled){c.visible=!1;return}const S=Math.max(0,x);p*=Math.exp(-Math.max(1,n.pulseDecay??14)*S),p<.001&&(p=0);for(const A of u)A.age+=S;for(;u.length>0&&u[0].age>n.life;)u.shift();if(v){const A=d?Math.hypot(v.tip.x-d.x,v.tip.y-d.y,v.tip.z-d.z)/Math.max(1e-4,S):0,T=u[u.length-1],b=T?Math.hypot(v.tip.x-T.tx,v.tip.y-T.ty,v.tip.z-T.tz):1/0;if(w&&b>=n.minStep)for(u.push({bx:v.base.x,by:v.base.y,bz:v.base.z,tx:v.tip.x,ty:v.tip.y,tz:v.tip.z,age:0,speed:A});u.length>t;)u.shift();d={x:v.tip.x,y:v.tip.y,z:v.tip.z},f=A,m=b,_=!0}else d=null,_=!1,f=0,m=0;g=w,y()},debug(){return{count:u.length,visible:c.visible,speed:f,moved:m,hasBlade:_,active:g,pulse:p}},pulse(x){!Number.isFinite(x)||x<=0||(p=Math.min(1.5,p+x))},reset(){u=[],d=null,p=0,c.visible=!1,e.setDrawRange(0,0)},dispose(){e.dispose(),l.dispose()}}}const je={groundArea:12,ringHalo:20,ring:22,ringMeter:24,ringWarn:26,groundFx:30,trail:40,slash:44,projectileTrail:46,projectile:48,projectileGlow:50};function ff(n,t){n.renderOrder=t,n.traverse(e=>{e.renderOrder=t})}function Hw(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function Gw(n,t,e,i){var st,at;const a=Math.max(1,n.clientWidth),s=Math.max(1,n.clientHeight),o=new K1({antialias:!0});o.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),o.shadowMap.enabled=!0,o.shadowMap.type=Vf,o.setSize(a,s,!1),n.appendChild(o.domElement);const r=new J1;r.background=new Qt("#12161d"),r.add(new kS(11061486,2764600,1.15));const l=new FS(16773852,1.5);l.position.set(9,18,11),l.castShadow=!0,l.shadow.mapSize.set(1024,1024);const c=l.shadow.camera;c.left=-20,c.right=20,c.top=20,c.bottom=-20,c.near=1,c.far=60,r.add(l);const h=[],u=new Pe;for(const E of t.boxes){const X=E.maxX-E.minX,K=E.maxY-E.minY,yt=E.maxZ-E.minZ;let St=Hw(E.kind,e);E.kind==="step"&&(St=new Qt(St).offsetHSL(0,0,E.maxY*.09).getStyle());const mt=new fo({color:St,transparent:!1,opacity:1}),Et=new me(new ui(X,K,yt),mt);Et.position.set((E.minX+E.maxX)/2,(E.minY+E.maxY)/2,(E.minZ+E.maxZ)/2),Et.castShadow=E.kind!=="ground",Et.receiveShadow=!0,Et.add(new _p(new pS(Et.geometry),new Th({color:10467020,transparent:!0,opacity:.32}))),u.add(Et),h.push(mt)}r.add(u);const d=t.gridMeta.maxX-t.gridMeta.minX,f=new NS(d,d,4873328,3358797);f.position.y=.002,f.visible=e.showGrid,r.add(f);const m=Ew(i,e);r.add(m.group);const _=E=>jp((E==null?void 0:E.voxel)??e.voxel,E!=null&&E.colors?{...e.colors,...E.colors}:e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links,e.weaponWrist,e.balance);let g="standard",p=_((st=e.bodyTypes)==null?void 0:st[g]);const y=Bw(e.weaponTrail);ff(y.object,je.trail),r.add(y.object);const x=new Pe,v=.9,w=new Pe;w.position.y=v,p.group.position.y=-v,w.add(p.group),x.add(w),r.add(x);const S=Ow();let A=0;const T=((at=t.config.dummies.fighters)==null?void 0:at.moveSpeed)??t.config.dummies.moveSpeed,b=t.dummies.map((E,X)=>{const K=e.dummies.colors,yt=K[X%K.length]??"#cccccc";let St;if(E.weapon){const mt=e.dummies.fighterColors,Et=mt&&mt.length>0?mt[(X-t.config.dummies.count)%mt.length]:void 0;St=ww({voxel:e.voxel,colors:Et?{...e.colors,...Et}:e.colors,moveSpeed:T,orientation:e.orientation,gait:e.gait,mount:e.weaponMount,lean:e.lean,hurt:e.hurt,animation:e.animation,ik:e.ik,links:e.links,wrist:e.weaponWrist,balance:e.balance})}else{const mt=nw(e.voxel,e.colors,yt,E.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);St={group:mt.group,update:(Et,Ot)=>mt.update(Et,Ot),boneAtWorld:(Et,Ot,Jt)=>mt.boneAtWorld(Et,Ot,Jt),dispose:()=>mt.dispose()}}return St.group.traverse(mt=>{mt.userData.dummyId=E.id}),r.add(St.group),St}),M=b.map(E=>E.group),P=new US,L=e.groundRing,F=e.voxel.bodyWidth,O=cf(F,L.playerRadiusFactor),k=cf(F,L.dummyRadiusFactor),D=F*L.thicknessFactor,U=L.arcDeg*Math.PI/180;let G=0;const W=(E,X,K)=>m0(t.boxes,E,X,K+.55,0),ot=jc({radius:O,thickness:D,arcRad:U,edgeFade:L.edgeFade,color:L.playerColor,opacity:L.playerOpacity,y:.028,renderOrder:je.ring});ot.mesh.name="player-ground-ring",r.add(ot.mesh);const gt=t.dummies.map(E=>{const X=jc({radius:k,thickness:D,arcRad:U,edgeFade:L.edgeFade,color:L.neutralColor,opacity:L.opacity,y:.022,renderOrder:je.ring});return X.mesh.name=`dummy-ground-ring-${E.id}`,r.add(X.mesh),X}),Mt=t.dummies.map(E=>{const X=jc({radius:k*L.haloRadiusFactor,thickness:D*L.haloThicknessFactor,arcRad:U,edgeFade:L.edgeFade,color:L.neutralColor,opacity:0,profile:"glow",y:.019,renderOrder:je.ringHalo});return X.mesh.name=`dummy-ground-halo-${E.id}`,r.add(X.mesh),X}),kt=t.dummies.map(()=>0),Q=t.dummies.map(()=>0),nt=lf({radius:O*L.meterRadiusFactor,thickness:D*L.meterThicknessFactor,arcRad:U,edgeFade:.06,color:L.meterColorCharge,y:.03,renderOrder:je.ringMeter});nt.mesh.name="player-ground-meter",r.add(nt.mesh);const ht=t.dummies.map(E=>{const X=lf({radius:k*L.warnRadiusFactor,thickness:D*L.warnThicknessFactor,arcRad:U,edgeFade:.02,color:L.warnColor,y:.031,renderOrder:je.ringWarn});return X.mesh.name=`dummy-ground-warn-${E.id}`,r.add(X.mesh),X}),q=hf({color:L.playerColor,y:.042,renderOrder:je.groundArea});q.group.name="player-landing-preview",r.add(q.group);const J=new Qt,Z=new Qt(L.playerColor),bt=new Qt(L.neutralColor),zt=new Qt(L.lowThreatColor),Dt=new Qt(L.highThreatColor),Ut=new Qt(L.meterColorCharge),V=new Qt(L.meterColorChannel),ne=new Qt(L.meterColorCooldown),Ht=new Qt(L.warnColor),Lt=new Pe;r.add(Lt);const xt=e.projectiles;function Ft(){const X=document.createElement("canvas");X.width=64,X.height=64;const K=X.getContext("2d");if(K){const St=K.createRadialGradient(32,32,0,32,32,32);St.addColorStop(0,"rgba(255,255,255,1)"),St.addColorStop(.28,"rgba(255,255,255,0.72)"),St.addColorStop(.62,"rgba(255,255,255,0.22)"),St.addColorStop(1,"rgba(255,255,255,0)"),K.fillStyle=St,K.fillRect(0,0,64,64)}const yt=new Kl(X);return yt.colorSpace=In,yt}function Bt(){const K=document.createElement("canvas");K.width=2,K.height=64;const yt=K.getContext("2d");if(yt){const mt=yt.createLinearGradient(0,0,0,64);mt.addColorStop(0,"rgba(255,255,255,0)"),mt.addColorStop(.55,"rgba(255,255,255,0.35)"),mt.addColorStop(1,"rgba(255,255,255,0.95)"),yt.fillStyle=mt,yt.fillRect(0,0,2,64)}const St=new Kl(K);return St.colorSpace=In,St}const z=Ft(),R=Bt(),j=new en({color:12577023,transparent:!0,opacity:0,side:Oe,depthWrite:!1}),dt=new en({color:14217983,transparent:!0,opacity:0,side:Oe,depthWrite:!1,blending:Ui}),tt=new Pe;tt.position.set(0,.95,.72),Lt.add(tt);const ct=new Pe;ct.rotation.x=Fw(e.camera.pitchDeg),tt.add(ct);const It=new Vr(.78,xt.slashThickness,6,28,Math.PI*1.15),et=new Pe,ft=new me(It,j),Nt=new me(It,dt);Nt.scale.setScalar(1.09),ff(et,je.slash),Nt.renderOrder=je.slash+1,et.add(ft,Nt),ct.add(et);const rt=new ui(xt.arrowWidth,xt.arrowWidth,xt.arrowLength),wt=new Ch(xt.arrowHeadSize*.42,xt.arrowHeadSize,4);wt.rotateX(Math.PI/2);const B=new ui(xt.arrowWidth*2.6,xt.arrowWidth*.4,.1),lt=new co(xt.arrowWidth*.45,xt.arrowWidth*1.3,xt.trailLength,6,1,!0);lt.rotateX(-Math.PI/2),lt.translate(0,0,-xt.trailLength/2);const vt=Array.from({length:10},()=>{const E=new Pe,X=new en({color:xt.arrowColor,transparent:!0}),K=new en({color:xt.arrowHeadColor,transparent:!0}),yt=new ql({map:z,color:xt.arrowColor,transparent:!0,opacity:.85,blending:Ui,depthWrite:!1}),St=new en({color:xt.arrowTrailColor,map:R,transparent:!0,opacity:0,blending:Ui,depthWrite:!1,side:Oe}),mt=new me(rt,X),Et=new me(wt,K);Et.position.z=xt.arrowLength/2+xt.arrowHeadSize*.42;const Ot=new me(B,K),Jt=new me(B,K);Ot.position.z=-xt.arrowLength/2+.08,Jt.position.z=Ot.position.z,Jt.rotation.z=Math.PI/2;const se=new Bu(yt);se.scale.setScalar(xt.arrowGlowSize),se.renderOrder=je.projectileGlow;const ge=new me(lt,St);return ge.renderOrder=je.projectileTrail,mt.renderOrder=je.projectile,Et.renderOrder=je.projectile,Ot.renderOrder=je.projectile,Jt.renderOrder=je.projectile,E.add(mt,Et,Ot,Jt,se,ge),E.visible=!1,r.add(E),{group:E,shaftMat:X,tipMat:K,glowMat:yt,trailMat:St,glow:se,trail:ge,arrowId:0,bone:null}}),Xt=new Dh(1,0),Gt=new H(xt.boltShapeX,xt.boltShapeY,xt.boltShapeZ),$t=new en({color:xt.boltColor,transparent:!0,opacity:.98,depthWrite:!1}),N=new ql({map:z,color:xt.boltGlowColor,transparent:!0,opacity:.45,blending:Ui,depthWrite:!1}),Rt=new en({color:xt.boltGlowColor,map:R,transparent:!0,opacity:xt.trailOpacity,blending:Ui,depthWrite:!1,side:Oe}),it=new co(.5,.03,xt.boltTrailScale,6,1,!0);it.rotateX(-Math.PI/2),it.translate(0,0,-xt.boltTrailScale/2);const ut=Array.from({length:24},()=>{const E=new Pe,X=new me(Xt,$t);X.scale.copy(Gt);const K=new Bu(N);K.scale.setScalar(xt.boltGlowScale),K.renderOrder=je.projectileGlow;const yt=new me(it,Rt);return yt.renderOrder=je.projectileTrail,X.renderOrder=je.projectile,E.add(X,K,yt),E.visible=!1,r.add(E),{group:E,core:X}}),Pt=Array.from({length:6},()=>{const E=hf({color:"#9ad0ff",edgeWidthRatio:.038,y:.045,renderOrder:je.groundArea});return E.group.visible=!1,r.add(E.group),E}),At=e.dash,qt=new vs(At.ringRadius-.06,At.ringRadius,28),ee=Array.from({length:6},()=>{const E=new en({color:16777215,transparent:!0,opacity:0,side:Oe,depthWrite:!1}),X=new me(qt,E);return X.rotation.x=-Math.PI/2,X.renderOrder=je.groundFx,X.visible=!1,r.add(X),{mesh:X,mat:E,life:0,base:1}});function re(E,X,K,yt,St){const mt=ee.find(Et=>Et.life<=0)??ee[0];mt.mat.color.set(yt),mt.mesh.position.set(E,W(E,X,K)+.04,X),mt.base=St,mt.mesh.scale.setScalar(St*.6),mt.mesh.visible=!0,mt.mat.opacity=.9,mt.life=At.fxDuration}const te=e.links,we=new vs(te.ringRadius-.07,te.ringRadius,28),De=Array.from({length:5},()=>{const E=new en({color:te.chargeColor,transparent:!0,opacity:0,side:Oe,depthWrite:!1}),X=new me(we,E);return X.rotation.x=-Math.PI/2,X.renderOrder=je.groundFx,X.visible=!1,r.add(X),{mesh:X,mat:E,life:0,base:1}});function yn(E,X,K,yt){const St=De.find(mt=>mt.life<=0)??De[0];St.mesh.position.set(E,W(E,X,K)+.05,X),St.base=yt,St.mesh.scale.setScalar(yt*.55),St.mesh.visible=!0,St.mat.opacity=.85,St.life=te.fxDuration}const Xe=e.groundSlam,Ie=new vs(.78,1,56),ye=Array.from({length:4},()=>{const E=new en({color:Xe.color,transparent:!0,opacity:0,side:Oe,depthWrite:!1,blending:Ui}),X=new me(Ie,E);return X.rotation.x=-Math.PI/2,X.renderOrder=je.groundFx+1,X.visible=!1,r.add(X),{mesh:X,mat:E,life:0,base:1,delay:0}});function We(E,X,K,yt,St){const mt=ye.find(Et=>Et.life<=0)??ye[0];mt.mat.color.set(Xe.color),mt.mesh.position.set(E,W(E,X,K)+.035,X),mt.base=yt,mt.mesh.scale.setScalar(yt*.35),mt.mesh.visible=!0,mt.mat.opacity=0,mt.life=Xe.duration,mt.delay=St}let wn=t.combat.slamAttackId,Je=0,En=t.playerLink.id,an=t.playerLink.hitIds.length,sn=t.dash.id,Fn="none";const ce=BS(e.camera,e.smartCamera,e.zoom,a/s),Tn=t.character.position;ce.update(Tn.x,Tn.y,Tn.z,1,t.camera);function Gn(E,X){if(M.length===0)return 0;const K=o.domElement.getBoundingClientRect(),yt=new Wt((E-K.left)/K.width*2-1,-((X-K.top)/K.height)*2+1);P.setFromCamera(yt,ce.camera);const St=P.intersectObjects(M,!0);for(const mt of St){const Et=mt.object.userData.dummyId;if(Et&&Et>0)return Et}return 0}function C(E,X,K){const yt=o.domElement.getBoundingClientRect(),St=new H(E,X,K).project(ce.camera);return{x:yt.left+(St.x*.5+.5)*yt.width,y:yt.top+(-St.y*.5+.5)*yt.height}}let Y=!1;return{balanceDebug(){return p.balanceDebug()},spineDebug(){return p.spineDebug()},gaitDebug(){return p.gaitDebug()},trailDebug(){return y.debug()},stretchDebug(){const E=p.stretch();return{arm:E.arm,leg:E.leg,torso:E.torso,impact:E.impact}},swingDebug(){return p.swingDebug()},stanceDebug(){return p.stanceDebug()},bladeWorld(){return p.weaponBlade()},bladesWorld(){return p.bladesWorld()},slamDebug(){return{spawns:Je,lastId:wn,live:ye.filter(E=>E.life>0).map(E=>({life:E.life,scale:E.mesh.scale.x,opacity:E.mat.opacity,visible:E.mesh.visible}))}},yawDebug(){var E;return{target:A,shown:S.value,tauMs:((E=e.renderInterp)==null?void 0:E.yawSmoothMs)??0}},fxDebug(){var E,X,K;return{boxOpaque:h.every(yt=>!yt.transparent),boxCount:h.length,orders:{ring:ot.mesh.renderOrder,groundFx:((E=ye[0])==null?void 0:E.mesh.renderOrder)??-1,trail:y.object.renderOrder,slash:et.renderOrder,projectile:((K=(X=vt[0])==null?void 0:X.group.children[0])==null?void 0:K.renderOrder)??-1}}},renderPose(){return{x:x.position.x,y:x.position.y,z:x.position.z,bodyYaw:x.rotation.y}},projectPoint(E,X,K){return C(E,X,K)},setClipT(E){p.setClipT(E)},weaponDebug(){return p.weaponDebug()},gripDebug(){return p.gripDebug()},render(E,X){var hn,$e;const K=E.character,yt=E.combat,St=e.hitstop.enabled&&E.combat.hitstop>0,mt=X*Math.max(0,Math.min(4,yt.warp??1));if(St&&!Y){const Tt=Math.max(0,E.combat.hitstop),Ct=Math.max(0,Math.min(1,Tt/.1));ce.addShake(.34+Ct*.48);let ie=null;for(let gn=0;gn<E.events.length;gn++){const dn=E.events[gn];if(dn.type==="hit"){ie=dn;break}}ie&&ce.addKick(ie.x-K.position.x,ie.z-K.position.z,.03+Ct*.05)}Y=St;for(let Tt=0;Tt<E.events.length;Tt++){const Ct=E.events[Tt];if(Ct.type!=="notify")continue;const ie=Number.isFinite(Ct.value)?Ct.value:0;if(Ct.name==="blade-air"){const gn=Math.max(0,Math.min(1,ie));y.pulse((yt.weapon==="greatsword"?.9:.55)*(.4+.6*gn))}}x.position.set(K.position.x,K.position.y,K.position.z),A=K.bodyYaw,x.rotation.y=S.update(A,X,((hn=e.renderInterp)==null?void 0:hn.yawSmoothMs)??0);const Et=E.dash.phase==="active"&&E.dash.kind==="roll",Ot=Et&&E.dash.duration>0?Math.min(1,1-E.dash.timer/E.dash.duration):0;if(w.rotation.x=Et?Ot*Math.PI*2:0,w.position.y=v-(Et?.2*Math.sin(Math.PI*Ot):0),mt>0&&p.update(K,yt,E.playerHurt,mt,E.abilities.channeling,E.time,E.playerLink,E.turnInPlace),y.update(mt,mt>0?p.weaponBlade():null,mt>0&&(yt.phase==="active"||E.playerLink.phase==="active"||Et&&E.dash.duration>0)),mt>0)for(let Tt=0;Tt<b.length;Tt++)E.dummies[Tt]&&b[Tt].update(E.dummies[Tt],mt,E.time);const Jt=ce.camera.position,se=Math.atan2(Jt.x-K.position.x,Jt.z-K.position.z),ge=E.config.gaze.hurtHoldSec,Ee=E.time-E.playerHurt.lastAt,fe=ge>0&&Ee>=0&&Ee<ge?1-Ee/ge:0,Yt=Rw(E.gaze.active,E.gaze.threat,fe,E.time,L);Pw(J,Z,zt,Dt,Yt.level),G=zw(K.grounded,K.position.y,G),ot.mesh.position.set(K.position.x,G+.028,K.position.z),ot.update(Yt.arcRad,Yt.opacity,Yt.scale,J,se);const Qe=E.config.abilities.arcane,xe=Math.max(1,Math.floor(Qe.waves)),Fe=Math.max(1e-4,Qe.waveInterval),An=Dw({charging:yt.charging,charge:yt.charge,channeling:E.abilities.channeling,fireTimer:E.abilities.fireTimer,fireInterval:Fe,channelProgress:E.abilities.channeling?(E.abilities.waveIndex+(1-Math.min(1,Math.max(0,E.abilities.fireTimer/Fe))))/xe:0,arcaneCooldown:E.abilities.cooldown,arcaneCooldownMax:Qe.cooldown,dashCooldown:E.dash.cooldown,dashCooldownMax:E.dash.kind==="blink"?E.config.dash.blinkCooldown:E.config.dash.rollCooldown});nt.mesh.position.set(K.position.x,K.position.y+.03,K.position.z),nt.set(An.ratio,An.source==="none"?0:L.meterOpacity,An.source==="charge"?Ut:An.source==="channel"?V:ne,se);const Ye=E.playerLink,Rn=Ye.weapon?E.config.links.moves[Ye.weapon]:void 0,he=kw(Ye.phase,K.position.x,K.position.z,Ye.facing,Ye.travel,(Rn==null?void 0:Rn.hit.radius)??.9);q.set(he.x,he.z,W(he.x,he.z,K.position.y)+.042,he.radius,he.active?L.landingOpacity:0,E.time);for(let Tt=0;Tt<gt.length;Tt++){const Ct=E.dummies[Tt],ie=gt[Tt],gn=Mt[Tt],dn=ht[Tt];if(!Ct){ie.mesh.visible=!1,gn.mesh.visible=!1,dn.mesh.visible=!1;continue}const Vi=E.targeting.hasTarget&&E.targeting.targetId===Ct.id;if(ug(E,Ct)){const Wi=fg(E,Ct);J.copy(zt).lerp(Dt,Wi)}else J.copy(bt);const Nn=Lw(Ct.attackPhase,Ct.attackPhaseTimer,E.config.dummies.attackWindup);Nn.active?(J.lerp(Ht,.5*Nn.urgency),dn.mesh.position.set(Ct.position.x,Ct.position.y+.031,Ct.position.z),dn.set(Nn.ratio,L.warnOpacity*(.65+.35*Nn.urgency),Ht,se)):dn.set(0,0,Ht,se);const Ia=Vi?1:0,Cs=Ia>kt[Tt]?L.haloFadeInSec:L.haloFadeOutSec;kt[Tt]=df(kt[Tt],Ia,X,Cs);const Ti=kt[Tt],za=1+.02*Ti*Math.sin(E.time*2.2+Ct.id),Xi=L.arcDeg+(L.selectedArcDeg-L.arcDeg)*Ti;ie.mesh.position.set(Ct.position.x,Ct.position.y+.022,Ct.position.z),ie.update(Xi*Math.PI/180,L.opacity+(L.selectedOpacity-L.opacity)*Ti,1+(L.selectedScale-1)*Ti*za,J,se,1+(L.selectedThicknessScale-1)*Ti),Q[Tt]=df(Q[Tt],Ia,X,Ia>Q[Tt]?L.haloFadeInSec:L.haloFadeOutSec);const Ai=Q[Tt];gn.mesh.position.set(Ct.position.x,Ct.position.y+.019,Ct.position.z),gn.update(Xi*Math.PI/180,L.haloOpacity*Ai*(.88+.12*Math.sin(E.time*2.2+Ct.id)),L.selectedScale*(.94+.06*Ai)*za,J,se)}if(Lt.position.set(K.position.x,K.position.y,K.position.z),Lt.rotation.y=yt.phase!=="idle"?yt.attackFacing:K.bodyYaw,E.dash.id!==sn){sn=E.dash.id;const Tt=E.dash;Fn=Tt.kind,Tt.kind==="blink"?(re(Tt.fromX,Tt.fromZ,K.position.y,At.blinkColor,.9),re(Tt.toX,Tt.toZ,K.position.y,At.blinkColor,1.35)):re(Tt.fromX,Tt.fromZ,K.position.y,At.rollColor,1.1)}for(const Tt of ee){if(Tt.life<=0)continue;Tt.life-=X;const Ct=Math.max(0,Tt.life/At.fxDuration);Tt.mat.opacity=.9*Ct,Tt.mesh.scale.setScalar(Tt.base*(.6+(1-Ct)*1.2)),Tt.life<=0&&(Tt.mesh.visible=!1)}if(E.combat.slamAttackId!==wn&&(wn=E.combat.slamAttackId,Je+=1,Xe.enabled)){const Tt=($e=E.config.combat.weapons[yt.weapon])==null?void 0:$e.groundSlam,Ct=Math.max(.6,(Tt==null?void 0:Tt.radius)??2.2);We(K.position.x,K.position.z,K.position.y,Ct,0),We(K.position.x,K.position.z,K.position.y,Ct*Xe.outerScale,Xe.delay),ce.addShake(Xe.shake)}for(const Tt of ye){if(Tt.life<=0)continue;if(Tt.delay>0){Tt.delay-=X;continue}Tt.life-=X;const Ct=Math.max(0,Tt.life/Math.max(Xe.duration,1e-6)),ie=1-Math.pow(Ct,1.8);Tt.mesh.scale.setScalar(Tt.base*(.35+.65*ie)),Tt.mat.opacity=.85*Math.pow(Ct,1.3),Tt.life<=0&&(Tt.mesh.visible=!1)}const be=E.playerLink;be.id!==En&&(En=be.id,an=be.hitIds.length,yn(K.position.x,K.position.z,K.position.y,1)),be.hitIds.length>an?(an=be.hitIds.length,yn(K.position.x,K.position.z,K.position.y,1.35)):be.hitIds.length<an&&(an=be.hitIds.length);for(const Tt of De){if(Tt.life<=0)continue;Tt.life-=X;const Ct=Math.max(0,Tt.life/Math.max(te.fxDuration,1e-6));Tt.mat.opacity=.85*Ct,Tt.mesh.scale.setScalar(Tt.base*(.55+(1-Ct)*1.1)),Tt.life<=0&&(Tt.mesh.visible=!1)}const Un=xt.slashEnabled&&yt.phase==="active"&&yt.comboIndex>=3;j.opacity=Un?.7:0,dt.opacity=Un?xt.slashGlowOpacity:0,Un&&(et.rotation.z=-1.2+yt.attackProgress*3.2,et.scale.setScalar(.9+yt.comboIndex*.13));for(let Tt=0;Tt<ut.length;Tt++){const Ct=E.abilities.projectiles[Tt],ie=ut[Tt];ie.group.visible=!!Ct,Ct&&(ie.group.position.set(Ct.x,Ct.y,Ct.z),ie.group.scale.setScalar(Ct.radius),ie.group.rotation.set(0,Math.atan2(Ct.dirX,Ct.dirZ),0))}for(let Tt=0;Tt<Pt.length;Tt++){const Ct=E.abilities.rings[Tt],ie=Pt[Tt];if(!Ct){ie.group.visible=!1;continue}const gn=Math.max(0,Math.min(1,Ct.life/Math.max(Ct.duration,1e-6))),dn=Iw(Math.max(0,Ct.duration-Ct.life),L.areaExpandSec);ie.set(Ct.x,Ct.z,W(Ct.x,Ct.z,K.position.y)+.045,Ct.radius*dn.scale,L.areaOpacity*(.35+.65*gn)*dn.alpha,E.time)}for(let Tt=0;Tt<vt.length;Tt++){const Ct=E.arrows[Tt],ie=vt[Tt];if(!Ct){ie.group.visible=!1,ie.bone&&(r.attach(ie.group),ie.bone=null),ie.arrowId=0;continue}const gn=Ct.stuck&&Ct.stuckDummy>=0;if(ie.arrowId!==Ct.id){if(ie.bone&&(r.attach(ie.group),ie.bone=null),ie.arrowId=Ct.id,ie.group.position.set(Ct.x,Ct.y,Ct.z),ie.group.rotation.set(Ct.pitch,Ct.yaw,0,"YXZ"),gn){const Vi=b[Ct.stuckDummy],Nn=Vi?Vi.boneAtWorld(Ct.x,Ct.y,Ct.z):null;Nn&&(Nn.node.attach(ie.group),ie.bone=Nn.node)}}else ie.bone||(ie.group.position.set(Ct.x,Ct.y,Ct.z),ie.group.rotation.set(Ct.pitch,Ct.yaw,0,"YXZ"));ie.group.visible=!0;const dn=Ct.stuck?Math.min(1,Ct.rest/.6):1;ie.shaftMat.opacity=dn,ie.tipMat.opacity=dn,ie.glowMat.opacity=(Ct.stuck?.28:.85)*dn,ie.trailMat.opacity=Ct.stuck?0:xt.trailOpacity*dn,ie.trail.visible=!Ct.stuck}ce.update(K.position.x,K.position.y,K.position.z,X,E.camera),o.render(r,ce.camera)},resize(){const E=Math.max(1,n.clientWidth),X=Math.max(1,n.clientHeight);o.setSize(E,X,!1),ce.resize(E/X)},getGroundBasis(){return ce.getGroundBasis()},setCollidersVisible(E){for(const X of h)X.opacity=E?.3:1,X.wireframe=E,X.transparent=E,X.depthWrite=!E,X.needsUpdate=!0},setGridVisible(E){f.visible=E},setLabVisible(E){m.setVisible(E)},setLabLabelsVisible(E){m.setLabelsVisible(E)},snapCamera(E,X,K){ce.snap(E,X,K)},setZoom(E){ce.setZoom(E)},setBodyType(E){var K;const X=(K=e.bodyTypes)==null?void 0:K[E];return!X||E===g||(w.remove(p.group),p.dispose(),p=_(X),p.group.position.y=-v,w.add(p.group),y.reset(),g=E,t.config.characterHeight=X.height,X.radius!==void 0&&(t.config.characterRadius=X.radius)),g},bodyTypes(){return{id:g,ids:Object.keys(e.bodyTypes??{})}},pickDummy:Gn,projectToScreen:C,diagnostics(){const E=Jp(e.camera.pitchDeg),X=Uw(E,Lt.rotation.y);return{lean:p.lean(),slashNormal:X,arrowForward:p.arrowDirection(),gait:{hipYaw:p.hipYaw(),gaitYaw:p.gaitYaw()},attackBlend:p.attackBlend(),attackWeights:p.attackWeights(),landing:p.landing(),hurt:p.hurt(),ik:p.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:w.rotation.x,activeRings:ee.filter(K=>K.life>0).length,lastKind:Fn},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...ce.smart(),shake:ce.shakeLevel(),kick:ce.kickLevel(),kickCount:ce.kickCount()}}},dispose(){p.dispose(),m.dispose();for(const E of b)E.dispose();ot.dispose();for(const E of gt)E.dispose();for(const E of Mt)E.dispose();nt.dispose(),y.dispose();for(const E of ht)E.dispose();q.dispose(),It.dispose(),j.dispose(),dt.dispose(),Xt.dispose(),$t.dispose(),N.dispose(),Rt.dispose(),it.dispose();for(const E of Pt)E.dispose();rt.dispose(),wt.dispose(),B.dispose(),lt.dispose();for(const E of vt)E.shaftMat.dispose(),E.tipMat.dispose(),E.glowMat.dispose(),E.trailMat.dispose();z.dispose(),R.dispose();for(const E of ee)E.mat.dispose();for(const E of ye)E.mat.dispose();qt.dispose();for(const E of De)E.mat.dispose();we.dispose(),u.traverse(E=>{E instanceof me&&E.geometry.dispose()}),o.dispose(),o.domElement.remove()}}}async function Vw(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function Xw(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),a=document.createElement("a");a.href=i,a.download=n,a.rel="noopener",document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function Ww(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=y=>e.querySelector(`#${y}`),a=i("diag-status"),s=i("diag-text"),o=i("diag-copy"),r=i("diag-json"),l=i("diag-clear"),c=i("diag-toggle"),h=i("diag-close"),u=i("diag-mask");let d=!1,f=!0,m=0;function _(){const y=n.status();a.textContent=y.enabled?`已记录 ${y.durationS.toFixed(1)}s · ${y.frames} 帧 · 事件 ${y.events} · 异常 ${y.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",c.textContent=y.enabled?"暂停记录":"继续记录"}function g(y){d=y,e.hidden=!y,y?_():s.hidden=!0}function p(y){o.textContent=y,window.clearTimeout(m),m=window.setTimeout(()=>{o.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation(),g(!d)}),h.addEventListener("click",()=>g(!1)),u.addEventListener("click",()=>g(!1)),o.addEventListener("click",()=>{const y=n.summary();Vw(y).then(x=>{x?(p("已复制 ✓"),s.hidden=!0):(s.value=y,s.hidden=!1,s.focus(),s.select(),p("请长按全选复制"))})}),r.addEventListener("click",()=>{const y=n.dump(),x=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);Xw(`harness-${y.meta.version}-${x}.json`,JSON.stringify(y)),p("已导出")}),l.addEventListener("click",()=>{n.clear(),s.hidden=!0,_(),p("已清空")}),c.addEventListener("click",()=>{f=!f,n.setEnabled(f),_()}),{tick(){const y=n.status();t==null||t.classList.toggle("is-alert",y.alert),d&&_()},isOpen:()=>d,close:()=>g(!1)}}const Yw={intents:{...mf},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function $w(){var J;const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=mg(nx,Ao),i=Gw(n,e,fn,Ao.stations),a=Mg(e),s=zx(t),o=Fx(t),r=document.getElementById("version-badge");r&&(r.textContent="v0.9.59 · 11-08 19:09 · 诊断");const l=Z=>String(Z).padStart(2,"0"),c=new Date,h=Kg({meta:{version:"v0.9.59",buildTime:"11-08 19:09",startedAt:`${l(c.getMonth()+1)}-${l(c.getDate())} ${l(c.getHours())}:${l(c.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),u=Ww(h,r),d=Dx({deadZone:()=>fn.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0});document.addEventListener("visibilitychange",()=>{document.hidden&&h.suspend(800)});const f={timeScale:1,paused:!1,showColliders:fn.showColliders,showGrid:fn.showGrid,showLab:fn.lab.enabled,showLabLabels:fn.lab.showLabels};let m=1,_=!1;const g=Bg({maxRadiusPx:()=>fn.joystick.maxRadiusPx,deadZone:fn.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>fn.zoom}),p=Array.from(document.querySelectorAll(".wp[data-weapon]"));let y=e.combat.weapon;function x(Z){if(Z===y)return;y=Z;const bt=ra.indexOf(Z)+1;for(const zt of p)zt.classList.toggle("is-active",Number(zt.dataset.weapon)===bt);A.refreshWeapon()}let v=Yw,w=0;const S=()=>{m=1,i.setZoom(1)},A=mx(e,fn,f,{singleStep:()=>a.singleStep(v.intents),reset:()=>{m=1,a.singleStep({...mf,resetPressed:!0})},resetZoom:S,onToggleColliders:Z=>i.setCollidersVisible(Z),onToggleGrid:Z=>i.setGridVisible(Z),onToggleLab:Z=>i.setLabVisible(Z),onToggleLabLabels:Z=>i.setLabLabelsVisible(Z),setFighterMode:Z=>{for(const bt of e.dummies)bt.weapon&&(bt.mode=Z,bt.attackPhase="idle",bt.attackPhaseTimer=0,bt.attackProgress=0,bt.attackCooldown=0,bt.combat&&(bt.combat.phase="idle",bt.combat.attackProgress=0,bt.combat.comboIndex=0))}}),T=vx({stations:Ao.stations??[],world:e,view:i,onResetZoom:S});o.register({motion:d,debug:A.gui}),window.addEventListener("resize",()=>i.resize());const b=i.bodyTypes().ids,M=document.getElementById("body-toggle"),P=Z=>{var bt,zt;return((zt=(bt=fn.bodyTypes)==null?void 0:bt[Z])==null?void 0:zt.name)??Z},L=()=>{if(!M)return;const Z=i.bodyTypes().id;M.textContent=`体型 ${P(Z)}`,M.setAttribute("aria-label",`切换体型（当前：${P(Z)}，快捷键 B）`)},F=document.createElement("div");F.style.cssText=["position:fixed","left:50%","top:14px","transform:translateX(-50%)","padding:6px 14px","border-radius:999px","font:600 13px/1.4 system-ui,sans-serif","color:#0b1620","background:#8fd0ff","box-shadow:0 4px 16px rgba(0,0,0,.35)","opacity:0","transition:opacity .18s","pointer-events:none","z-index:99"].join(";"),document.body.appendChild(F);let O=0;const k=Z=>{F.textContent=Z,F.style.opacity="1",window.clearTimeout(O),O=window.setTimeout(()=>{F.style.opacity="0"},1600)},D=()=>{if(b.length<2){k("只有一个体型预设");return}const Z=i.bodyTypes().id,bt=Math.max(0,b.indexOf(Z)),zt=i.setBodyType(b[(bt+1)%b.length]);L(),k(`体型：${P(zt)}（B / 顶部胶囊切换）`)};L(),M==null||M.addEventListener("click",D),window.addEventListener("keydown",Z=>{Z.repeat||Z.code!=="KeyB"||D()}),window.__harness={world:e,view:i,clock:a,input:g,viewConfig:fn,debug:f,getUserZoom:()=>m,getGestures:()=>v.gestures,getLastGesture:()=>v.lastGesture,telemetry:h,telemetrySummary:()=>h.summary(),dirDebug:d.dirDebug,dirAngles:()=>d.dirDebug.last(),motionDebug:d,speedDebug:()=>d.last(),speedSamples:()=>d.samples(),gaitDebug:()=>i.gaitDebug(),swingDebug:()=>i.swingDebug(),stanceDebug:()=>i.stanceDebug(),balanceDebug:()=>i.balanceDebug(),spineDebug:()=>i.spineDebug(),interpDebug:()=>({alpha:kt,applied:Q,enabled:ot,skip:nt}),renderPose:()=>i.renderPose(),yawDebug:()=>i.yawDebug(),slamDebug:()=>i.slamDebug(),fxDebug:()=>i.fxDebug(),setRenderInterp:Z=>(ot=!!Z,ot),renderHold:()=>_,trailDebug:()=>i.trailDebug(),bladeWorld:()=>i.bladeWorld(),projectPoint:(Z,bt,zt)=>i.projectPoint(Z,bt,zt),setBodyType:Z=>{const bt=i.setBodyType(Z);return L(),bt},bodyTypes:()=>i.bodyTypes(),bladesWorld:()=>i.bladesWorld(),clipLab:{clips:()=>{var Z;return Object.keys(((Z=fn.animation.swing)==null?void 0:Z.clips)??{})},preview:Z=>{const bt=e.combat,zt={...bt};bt.weapon=Z.weapon,bt.phase="active",bt.comboIndex=Math.max(1,Math.min(3,Math.floor(Z.comboIndex))),bt.attackProgress=Math.max(0,Math.min(1,Z.progress)),bt.attackFacing=e.character.bodyYaw,i.setClipT(typeof Z.t=="number"?Z.t:null);const Dt=Math.max(1,Math.min(30,Math.floor(Z.warm??12)));_=!0;for(let Ut=0;Ut<Dt;Ut++)i.render(e,1/60);return i.setClipT(null),Object.assign(bt,zt),{...i.swingDebug(),blade:i.bladeWorld(),blades:i.bladesWorld()}},face:Z=>{e.character.bodyYaw=Z},zoom:Z=>{m=Ad(Z,1,fn.zoom.min,fn.zoom.max),i.setZoom(m)},release:()=>{_=!1}},weaponDebug:()=>i.weaponDebug(),gripDebug:()=>i.gripDebug(),lab:{stations:Ao.stations??[],goto:Z=>T.goto(Z),current:()=>T.current(),recall:()=>T.recall()}};let U=performance.now(),G=60,W=0,ot=((J=fn.renderInterp)==null?void 0:J.enabled)??!0,gt=Td(e),Mt=null,kt=1,Q=!1,nt="";function ht(Z){const bt=ot&&!f.paused&&f.timeScale>0;if(Q=!1,nt="",!bt)return nt="off",kt=1,e;if(!Mt)return nt="noprev",kt=1,e;if(!Sg(Mt,gt))return nt="key",kt=1,e;const zt=a.alpha;return kt=zt,zt>=.999?(nt="alpha",e):(Q=!0,Eg(e,wg(Mt,gt,zt)))}function q(Z){const bt=Math.min((Z-U)/1e3,.1);U=Z,bt>0&&(G=G*.9+1/bt*.1);const zt=g.sample();zt.intents.resetPressed&&(m=1),m=Ad(m,zt.zoomScale,fn.zoom.min,fn.zoom.max),i.setZoom(m);let Dt=zt.intents.dummyClickId;if(zt.tap){const ne=i.pickDummy(zt.tap.x,zt.tap.y);ne>0&&(Dt=ne)}Dt>0&&(w=Dt),v={...zt,intents:{...zt.intents,dummyClickId:w}};const Ut=a.frame(bt,v.intents,f.timeScale,f.paused,()=>{const ne=e.events;for(let Ht=0;Ht<ne.length;Ht++)h.event(ne[Ht],e.time);Mt=gt,gt=Td(e)});Ut>0&&(w=0),h.sample(e,v,bt*1e3,Ut);for(const ne of v.gestures)h.gesture(ne);Z-W>250&&(W=Z,u.tick()),x(e.combat.weapon),_||i.render(ht(),bt),T.tick(),d.update(e,v,i.getGroundBasis());const V=i.diagnostics();s.update(e,G,Ut,v,f,{attackBlend:V.attackBlend,attackWeights:V.attackWeights,landing:V.landing,hurt:V.hurt,ik:V.ik,zoom:V.camera.zoom},o.hudCompact()),requestAnimationFrame(q)}requestAnimationFrame(q)}$w();

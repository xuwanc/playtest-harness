(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=e(a);fetch(a.href,s)}})();const ea=["sword-shield","dual-swords","greatsword","staff","bow"],qm=["wander","follow","keep-distance","attack","idle"],wf=["spar","wander","follow","keep-distance","attack","idle"],Ef={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},gr=1e-6;function Js(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>gr?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>gr?Math.atan2(t.moveX,t.moveZ):n.character.facing}function Km(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>gr){const a=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/a,z:t.aimZ/a}}const e=Math.hypot(t.moveX,t.moveZ);if(e>gr)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const on=1e-6,Xs=Math.PI/180,ch=-1e9;function Tf(){return{type:"none",lastAt:ch,timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function Ws(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function fd(n,t,e,i,a){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=a,n.knockX=0,n.knockZ=0}function lh(n,t,e){var c,h;const i=e.duration>0?e.duration:Dr(n,e.type);if(t.kind==="player"){const u=n.playerHurt;if(fd(u,e.type,i,e.dirX,e.dirZ),u.lastAt=n.time,!n.config.hits.noDamageToPlayer&&e.knockback>on){const d=e.knockback*n.config.hits.knockbackDecay;u.knockX=e.dirX*d,u.knockZ=e.dirZ*d}Ws(n,"player-hurt",e.sourceId??0,n.character.position);return}const a=n.dummies[t.index];if(!a)return;if(fd(a.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>on){const u=e.knockback*n.config.hits.knockbackDecay;a.hurt.knockX=e.dirX*u,a.hurt.knockZ=e.dirZ*u}n.hitCount+=1,Ws(n,"hit",a.id,a.position);const s=n.config.hits.hitstop;let o=((c=n.config.hits.hitstopByWeapon)==null?void 0:c[n.combat.weapon])??1;const r=n.config.hits.hitstopComboFalloff;if(r&&r.length>0){const u=Math.max(0,Math.min(r.length-1,n.combat.comboIndex-1));o*=Math.max(0,r[u])}o*=Math.max(0,e.holdMul??1);const l=s&&e.type!=="none"?(s[e.type]??0)*Math.max(0,o):0;l>0&&n.combat.hitstop<l&&(n.combat.hitstop=l,n.combat.warpPhase=1,n.combat.warp=(h=n.config.hits.hitstopWarp)!=null&&h.enabled?Math.max(0,Math.min(1,n.config.hits.hitstopWarp.holdRate)):0,Ws(n,"hitstop",l,a.position))}function lo(n,t,e){lh(n,{kind:"dummy",index:t},e)}function Jm(n,t){const e=[n.playerHurt];for(const a of n.dummies)e.push(a.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const a of e)a.timer>0&&(a.timer=Math.max(0,a.timer-t),a.timer===0&&(a.type="none",a.knockX=0,a.knockZ=0)),(a.knockX!==0||a.knockZ!==0)&&(a.knockX*=i,a.knockZ*=i,Math.abs(a.knockX)<1e-4&&(a.knockX=0),Math.abs(a.knockZ)<1e-4&&(a.knockZ=0))}function Dr(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function pd(n,t){if(n.length===0)return 0;if(t<=n[0][0])return n[0][1];for(let e=1;e<n.length;e++){const[i,a]=n[e];if(t<=i){const[s,o]=n[e-1],r=i>s?(t-s)/(i-s):1;return o+(a-o)*r}}return n[n.length-1][1]}function Qm(n){let t=n;for(;t>180;)t-=360;for(;t<-180;)t+=360;return t}function t0(n){var S,T;const t=n.combat,e=n.config.hits,i=n.character.position;if(t.weapon==="bow")return;const a=n.config.combat.weapons[t.weapon],s=a==null?void 0:a.hitWindow,o=s?Math.min(1,Math.max(0,s.start)):0,r=s?Math.min(1,Math.max(o,s.end)):1,l=t.timings.active,c=l>on?Math.min(1,Math.max(0,t.phaseTimer/l)):1;if(c<o-on||c>r+on)return;const h=e.reach[t.weapon]??0,u=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*Xs),d=Math.sin(t.attackFacing),f=Math.cos(t.attackFacing),g=n.config.dummies.radius,_=n.config.targeting.idealRange,m=a==null?void 0:a.hitSweep,p=((S=m==null?void 0:m.byCombo)==null?void 0:S[String(t.comboIndex)])??((T=m==null?void 0:m.byCombo)==null?void 0:T["1"]),y=(m==null?void 0:m.tolDeg)??10;let x=0,v=0,w=!1;if(p){if(typeof p.stabU=="number"){if(c<p.stabU)return}else if(p.pts&&p.pts.length>=2){const E=pd(p.pts,0),b=pd(p.pts,c);x=Math.min(E,b)-y,v=Math.max(E,b)+y,w=!0}}for(const E of n.dummies){if(t.hitIds.indexOf(E.id)>=0)continue;const b=E.position.x-i.x,M=E.position.z-i.z,R=Math.hypot(b,M);if(R>h+g)continue;const C=R>on?b/R:d,z=R>on?M/R:f;if(R>on&&(b*d+M*f)/R<u)continue;if(w){const H=Qm(Math.atan2(b,M)/Xs-t.attackFacing/Xs);if(H<x||H>v)continue}let N="light";t.weapon==="greatsword"?N="knock":t.comboIndex>=3&&(N="heavy");const D=e.knockback[t.weapon]??0;let L=R;D>0&&(L=Math.max(R+D,_));const F=Math.max(0,L-R);lo(n,n.dummies.indexOf(E),{type:N,duration:Dr(n,N),dirX:C,dirZ:z,knockback:F}),t.hitIds.push(E.id)}}function e0(n){const t=n.combat,e=n.config.combat.weapons[t.weapon],i=e==null?void 0:e.groundSlam;if(!i||t.slamAttackId===t.attackId)return;const a=t.timings.active;if((a>on?Math.min(1,Math.max(0,t.phaseTimer/a)):1)<i.slamU-on)return;t.slamAttackId=t.attackId;const o=n.config.hits,r=n.character.position,l=Math.sin(t.attackFacing),c=Math.cos(t.attackFacing),h=n.config.dummies.radius,u=Math.max(0,i.radius),d=i.onlyUnhit!==!1,f=i.type??(t.weapon==="greatsword"?"knock":"heavy"),g=i.knockback??o.knockback[t.weapon]??0,_=n.config.targeting.idealRange,m=i.holdMul??1.6;for(let p=0;p<n.dummies.length;p++){const y=n.dummies[p];if(d&&t.hitIds.indexOf(y.id)>=0)continue;const x=y.position.x-r.x,v=y.position.z-r.z,w=Math.hypot(x,v);if(w>u+h)continue;const S=w>on?x/w:l,T=w>on?v/w:c,E=g>0?Math.max(w+g,_):w,b=Math.max(0,E-w);lo(n,p,{type:f,duration:Dr(n,f),dirX:S,dirZ:T,knockback:b,holdMul:m}),t.hitIds.push(y.id)}Ws(n,"ground-slam",u,{x:r.x+l*Math.min(u*.25,.5),y:r.y,z:r.z+c*Math.min(u*.25,.5)})}function n0(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const a=i.weapon===""?void 0:e.moves[i.weapon];if(!a||!a.enabled||!n.modules.hits||!n.modules.dummies)return;const s=a.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(s.pulseInterval,0);const o=n.character.position,r=i.fromX,l=i.fromZ,c=o.x,h=o.z,u=c-r,d=h-l,f=u*u+d*d,g=Math.sin(i.facing),_=Math.cos(i.facing),m=Math.cos(md(s.arcDeg,0,180)*Xs),p=n.config.dummies.radius;for(let y=0;y<n.dummies.length;y++){const x=n.dummies[y];if(i.hitIds.indexOf(x.id)>=0)continue;const v=f>on?md(((x.position.x-r)*u+(x.position.z-l)*d)/f,0,1):0,w=r+u*v,S=l+d*v,T=Math.hypot(x.position.x-w,x.position.z-S);let E=!1;if(s.shape==="circle")E=T<=s.radius+p;else if(s.shape==="capsule")E=T<=Math.max(s.radius,s.width)+p;else{const N=x.position.x-c,D=x.position.z-h,L=Math.hypot(N,D),F=L>on?(N*g+D*_)/L>=m:!0;E=L<=s.radius+p&&F||T<=s.width+p}if(!E)continue;const b=x.position.x-r,M=x.position.z-l,R=Math.hypot(b,M);if(R>on&&(b*g+M*_)/R<Math.cos(Math.max(s.arcDeg,90)*Xs))continue;const C=R>on?b/R:g,z=R>on?M/R:_;lh(n,{kind:"dummy",index:y},{type:s.type,duration:s.duration,dirX:C,dirZ:z,knockback:s.knockback}),i.hitIds.push(x.id),Ws(n,"link-hit",x.id,x.position)}}function i0(n){const t=n.config.hits,e=n.config.dummies.fighters,i=n.character.position;for(const a of n.events){if(a.type!=="dummy-hit")continue;const s=n.dummies[a.value-1];if(!s)continue;const o=s.weapon?t.reach[s.weapon]??t.dummyReach:t.dummyReach,r=i.x-s.position.x,l=i.z-s.position.z,c=Math.hypot(r,l);if(c>o)continue;const h=c>on?r/c:0,u=c>on?l/c:1,f=(s.weapon?Math.max(t.knockback[s.weapon]??0,t.dummyKnockback):t.dummyKnockback)*(s.weapon?(e==null?void 0:e.knockbackScale)??1:1),_=s.weapon==="greatsword"&&s.attackComboLeft<=0?"knock":"light";lh(n,{kind:"player"},{type:_,duration:Dr(n,_),dirX:h,dirZ:u,knockback:f,sourceId:s.id})}}function a0(n,t){n.modules.hits&&(n.combat.phase==="active"&&(t0(n),e0(n)),n0(n,t),i0(n))}function md(n,t,e){return n<t?t:n>e?e:n}const Af=Math.PI/180,hh=1e-6;function s0(){return{phase:"idle",fromYaw:0,targetYaw:0,dir:1,progress:0,armTime:0}}function xr(n){const t=n.turnInPlace;t.phase="idle",t.fromYaw=0,t.targetYaw=0,t.dir=1,t.progress=0,t.armTime=0}function Rf(n,t,e){return n.modules.gaze&&n.gaze.active?n.gaze.centroidYaw:t.aimActive&&Math.hypot(t.aimX,t.aimZ)>hh?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:null}function Pf(n,t,e){const i=n.character,a=Math.hypot(i.velocity.x,i.velocity.z),s=Math.hypot(t.moveX,t.moveZ),o=n.combat.phase!=="idle"||n.combat.charging||n.abilities.channeling||n.dash.phase!=="idle"||n.playerLink.phase!=="idle"||n.playerHurt.type!=="none"||t.attackPressed||t.attackHeld||t.skill2Pressed||t.sprintPressed||t.jumpPressed;return i.grounded&&a<=Math.max(0,e.idleSpeedRatio)*Math.max(n.config.moveSpeed,hh)&&s<=Math.max(0,e.inputDeadZone)&&!o}function o0(n){const t=n<0?0:n>1?1:n;return t*t*(3-2*t)}function r0(n,t){const e=n.config.turnInPlace;if(!e.enabled||!n.modules.turnInPlace||!Pf(n,t,e))return!1;const i=Rf(n,t,e.lookRange);if(i===null)return!1;const a=Xe(i-n.character.bodyYaw);return Math.abs(a)>Cf(n,e)}function Cf(n,t){const i=n.modules.gaze&&n.gaze.active?Math.max(t.triggerDeg,t.gazeTriggerDeg):t.triggerDeg;return Math.max(0,i)*Af}function c0(n,t,e){const i=n.turnInPlace,a=n.config.turnInPlace;if(!a.enabled||!n.modules.turnInPlace||!Pf(n,e,a)){xr(n);return}const s=Rf(n,e,a.lookRange);if(s===null){xr(n);return}const o=n.character,r=Xe(s-o.bodyYaw),l=Math.abs(r),c=Cf(n,a),h=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>hh;if(i.phase==="idle"&&(i.armTime=l>=c?i.armTime+t:0,l>c&&i.armTime>=Math.max(0,a.armSec))){i.phase="active",i.fromYaw=o.bodyYaw,i.dir=r>=0?1:-1;const u=Math.min(l,Math.max(0,a.settleDeg)*Af);i.targetYaw=Xe(o.bodyYaw+i.dir*(l-u)),i.progress=0}if(i.phase==="active"){const u=Math.max(a.durationSec,n.config.fixedDt);i.progress=Math.min(1,i.progress+t/u);const d=Xe(i.targetYaw-i.fromYaw);o.bodyYaw=Xe(i.fromYaw+d*o0(i.progress)),h||(o.facing=o.bodyYaw),i.progress>=1&&(i.phase="idle",i.progress=0,i.armTime=0)}}const Ji=1e-6;function Xe(n){return Math.atan2(Math.sin(n),Math.cos(n))}function bo(n,t,e,i){const a=Xe(t-n);return n+a*(1-Math.exp(-Math.max(e,Ji)*i))}function So(n,t,e,i,a){const o=Xe(t-n)*(1-Math.exp(-Math.max(e,Ji)*a)),r=Math.max(i,0)*a;return r<=Ji?n:n+as(o,-r,r)}function gd(n,t,e,i,a){const s=(t-n)*(1-Math.exp(-Math.max(e,Ji)*a)),o=Math.max(i,0)*a;return o<=Ji?n+s:n+as(s,-o,o)}function as(n,t,e){return n<t?t:n>e?e:n}function xd(n,t,e,i){const a=Xe(t-n),s=Math.abs(a);return s<=i||s<=e?t:Xe(n+Math.sign(a)*Math.max(e,0))}function l0(n,t,e){const i=n.character,a=n.config.orientation,s=n.combat,o=n.modules.gaze&&n.gaze.active,r=n.abilities.channeling,l=s.phase!=="idle"||s.charging||r||n.dash.phase!=="idle",c=o&&!l,h=Math.hypot(e.moveX,e.moveZ),u=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Ji,d=s.charging&&s.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(s.phase!=="idle")i.facing=s.attackFacing;else if(r)i.facing=Js(n,e);else if(c)i.facing=So(i.facing,n.gaze.centroidYaw,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t);else if(u)i.facing=Js(n,e);else if(d)i.facing=n.targeting.targetYaw;else if(h>Math.max(a.facingDeadZone,Ji)){const M=Math.atan2(e.moveX,e.moveZ),R=a.facingTurnRate*Math.PI/180*t,C=a.facingSnapDeg*Math.PI/180;if(h>=.35)i.facing=xd(i.facing,M,R,C);else if(h>=a.facingMinMagnitude&&Math.abs(Xe(M-i.facing))>a.facingDeadbandDeg*Math.PI/180){const N=bo(i.facing,M,a.facingSmoothRate,t);i.facing=xd(i.facing,N,R,0)}}const f=i.velocity;Math.hypot(f.x,f.z)>.15&&(i.moveYaw=Math.atan2(f.x,f.z));const g=c?n.gaze.centroidYaw:i.facing;n.turnInPlace.phase==="active"||r0(n,e)||(c?i.bodyYaw=So(i.bodyYaw,g,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t):i.bodyYaw=bo(i.bodyYaw,g,a.bodyTurnRate,t));const m=n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;let p=i.facing;if(o?p=c?n.gaze.mainYaw:i.facing:u?p=Math.atan2(e.aimX,e.aimZ):m&&(p=n.targeting.targetYaw),!o){const M=n.config.gaze.headLookLimitDeg*Math.PI/180;Math.abs(Xe(p-i.bodyYaw))>M&&(p=i.moveYaw)}const y=o||u||m,x=a.maxHeadTurnDeg*Math.PI/180;let v;if(y){const M=c?n.config.gaze.headTurnRate:a.headTurnRate;v=c?So(i.headYaw,p,M,n.config.gaze.maxHeadSpeedDeg*Math.PI/180,t):bo(i.headYaw,p,M,t)}else{const M=Xe(i.headYaw-i.bodyYaw),R=Xe(p-i.bodyYaw),C=Math.abs(R)<Math.abs(M)-1e-9,z=C?n.config.gaze.headReturnRate:a.headTurnRate,N=C?n.config.gaze.headReturnSpeedDeg*Math.PI/180:Number.POSITIVE_INFINITY,D=Number.isFinite(N)?So(M,R,z,N,t):bo(M,R,z,t);v=i.bodyYaw+D}const w=Xe(v-i.bodyYaw);w>x?v=i.bodyYaw+x:w<-x&&(v=i.bodyYaw-x),i.headYaw=v;const S=n.config.gaze;let T=0;if(c)T=n.gaze.mainPitch;else if(n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget){const M=n.dummies[n.targeting.targetId-1];if(M){const R=i.position.y+n.config.characterHeight*as(S.eyeHeightRatio,0,1),C=M.position.y+n.config.dummies.height*as(S.aimHeightRatio,0,1),z=Math.hypot(M.position.x-i.position.x,M.position.z-i.position.z);T=Math.atan2(C-R,Math.max(Ji,z))}}const E=Math.max(0,S.maxHeadPitchDeg)*Math.PI/180;T=as(T,-E,E);const b=y?S.headPitchRate:Math.min(S.headPitchRate,S.headReturnRate);i.headPitch=gd(i.headPitch,T,b,Math.max(0,S.maxHeadPitchDeg)*4*Math.PI/180,t),i.bodyPitch=gd(i.bodyPitch,i.headPitch*as(S.bodyPitchScale,0,1),S.bodyPitchRate,Math.max(0,S.maxHeadPitchDeg)*Math.PI/180,t)}const Lf=1e-6,kr=Math.PI/180;function Ir(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function h0(n,t,e){const i=n.character.position,a=Math.max(0,e.homingConeDeg)*kr,s=Math.max(0,e.homingRange),o=[];for(let r=0;r<n.dummies.length;r++){const l=n.dummies[r],c=l.position.x-i.x,h=l.position.z-i.z,u=Math.hypot(c,h);u<.001||u>s||Math.abs(Xe(Math.atan2(c,h)-t))>a||o.push({i:r,d:u})}return o.sort((r,l)=>r.d-l.d||r.i-l.i),o.map(r=>r.i)}function d0(n,t){const e=Math.sin((n+1)*12.9898+(t+1)*78.233)*43758.5453;return e-Math.floor(e)}function u0(n,t){const e=n.abilities,i=n.character.position,a=Math.max(1,Math.floor(t.perWave)),s=t.spreadDeg*kr,o=Math.max(0,t.spawnSideStep),r=Math.max(0,Math.min(1,t.speedJitter)),l=h0(n,e.channelYaw,t);for(let c=0;c<a;c++){const h=(c-(a-1)*.5)*s,u=e.channelYaw+h,d=(c-(a-1)*.5)*o,f=Math.sin(u),g=Math.cos(u);e.pending.push({delay:c*Math.max(0,t.spawnDelay),x:i.x+f*.5+Math.cos(u)*d,y:i.y+1,z:i.z+g*.5-Math.sin(u)*d,yaw:u,speed:t.speed*(1+(d0(e.waveIndex,c)*2-1)*r),targetIndex:l.length>0?l[c%l.length]:-1,wave:e.waveIndex})}Ir(n,"arcane-wave",e.waveIndex,{x:i.x,y:i.y+1,z:i.z})}function f0(n,t,e){const i=n.abilities;if(i.pending.length===0)return;const a=[];for(const s of i.pending){if(s.delay-=t,s.delay>0){a.push(s);continue}const o={id:++i.nextId,x:s.x,y:s.y,z:s.z,dirX:Math.sin(s.yaw),dirZ:Math.cos(s.yaw),speed:s.speed,life:e.life,radius:e.radius,targetIndex:s.targetIndex,turnRate:Math.max(0,e.turnRateDeg)*kr,homing:Math.max(0,e.homingTime),spread:Math.max(0,e.spreadTime),retarget:0,wave:s.wave};i.projectiles.push(o),i.volleyId+=1,Ir(n,"projectile-fire",i.volleyId,o)}i.pending=a}function vd(n,t){const e=n.abilities;e.channeling&&(e.channeling=!1,e.fireTimer=0,e.cooldown=Math.max(0,t.cooldown),e.channelMoveScale=1,e.needsRelease=!0,Ir(n,"channel-end",0,n.character.position))}function p0(n,t,e,i,a,s){const o=n.abilities,r=n.dash.phase==="active",l=n.playerLink,c=s==="skill2"?e.skill2Pressed:e.attackHeld,h=a&&c&&!r&&l.phase==="idle"&&!l.consumedAttack;if(o.cooldown>0&&(o.cooldown=Math.max(0,o.cooldown-t)),o.needsRelease&&!h&&(o.needsRelease=!1),o.channeling){if(!h){vd(n,i);return}}else{if(!(h&&!o.needsRelease&&o.cooldown<=0))return;o.channeling=!0,o.channelId+=1,o.waveIndex=0,o.fireTimer=0,o.channelMoveScale=Math.max(0,Math.min(1,i.moveScale)),Ir(n,"channel-start",o.channelId,n.character.position)}o.channelYaw=Js(n,e),o.fireTimer-=t;let u=0;for(;o.fireTimer<=0&&u++<8;)if(o.fireTimer+=Math.max(i.waveInterval,Lf),u0(n,i),o.waveIndex+=1,o.waveIndex>=Math.max(1,Math.floor(i.waves))){vd(n,i);break}}function m0(n,t,e){const i=Math.max(0,e.homingConeDeg)*kr,a=Math.max(0,e.homingRange),s=Math.atan2(t.dirX,t.dirZ);let o=-1,r=a+Lf;for(let l=0;l<n.dummies.length;l++){const c=n.dummies[l],h=c.position.x-t.x,u=c.position.z-t.z,d=Math.hypot(h,u);d<.001||d>r||Math.abs(Xe(Math.atan2(h,u)-s))>i||(o=l,r=d)}return o}function g0(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.projectiles){if(r.spread>0)r.spread=Math.max(0,r.spread-t);else if(r.homing>0&&(r.homing=Math.max(0,r.homing-t)),r.retarget-=t,r.retarget<=0&&(r.retarget=Math.max(.05,e.retargetInterval),r.targetIndex=m0(n,r,e)),r.targetIndex>=0&&r.turnRate>0&&r.homing>0){const c=n.dummies[r.targetIndex];if(!c)r.targetIndex=-1;else{const h=Math.atan2(c.position.x-r.x,c.position.z-r.z),u=Math.atan2(r.dirX,r.dirZ),d=Xe(h-u),f=r.turnRate*t,g=Math.max(-f,Math.min(f,d)),_=u+g;r.dirX=Math.sin(_),r.dirZ=Math.cos(_)}}if(r.x+=r.dirX*r.speed*t,r.z+=r.dirZ*r.speed*t,r.life-=t,r.life<=0)continue;let l=!1;if(s)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],u=h.position.x-r.x,d=h.position.z-r.z,f=r.radius+a;if(!(u*u+d*d>f*f)){lo(n,c,{type:e.hurtType,duration:e.hurtDuration,dirX:r.dirX,dirZ:r.dirZ,knockback:e.knockback}),l=!0;break}}l||o.push(r)}i.projectiles=o}const x0={kind:"channelVolley",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params;p0(n,t,e,s,a,i.cfg.slot),f0(n,t,s),g0(n,t,s)}},oc=1e-6;function Df(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function v0(n,t){const e=n.character.position,i={id:++n.abilities.nextId,x:e.x,z:e.z,radius:t.radius,life:t.duration,duration:t.duration,pulseTimer:0};n.abilities.rings.push(i),Df(n,"ring-place",i.id,e)}function y0(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.rings){r.life-=t,r.pulseTimer-=t;let l=0;for(;r.pulseTimer<=0&&l++<8;){if(r.pulseTimer+=Math.max(e.pulseInterval,oc),s)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],u=h.position.x-r.x,d=h.position.z-r.z,f=r.radius+a;if(u*u+d*d>f*f)continue;const g=Math.hypot(u,d),_=g>oc?u/g:0,m=g>oc?d/g:1;lo(n,c,{type:"heavy",duration:e.stun,dirX:_,dirZ:m,knockback:e.knockback})}Df(n,"ring-pulse",r.id,{x:r.x,y:0,z:r.z})}r.life>0&&o.push(r)}i.rings=o}const _0={kind:"groundRing",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params,o=i.cfg.slot==="attack"?e.attackPressed:e.skill2Pressed;a&&o&&n.dash.phase!=="active"&&n.playerLink.phase==="idle"&&v0(n,s),y0(n,t,s)}},M0={channelVolley:x0,groundRing:_0};function b0(n){const t=Array.isArray(n.skills)?n.skills:[],e=n.abilities;return t.map(i=>{if(i.params)return{cfg:i,params:i.params};const a=i.paramsRef,s=a?e[a]:void 0;if(!s||typeof s!="object")throw new Error(`[skills] ${i.id}: paramsRef "${a??""}" 在 core.abilities 中不存在`);return{cfg:i,params:s}})}function S0(n,t,e){for(const i of n.skills){if(i.cfg.enabled===!1)continue;const a=M0[i.cfg.kind];if(!a)continue;const s=!i.cfg.weapon||n.combat.weapon===i.cfg.weapon;a.update({world:n,dt:t,intents:e,skill:i,onWeapon:s})}}function w0(){return{channeling:!1,channelYaw:0,fireTimer:0,waveIndex:0,cooldown:0,needsRelease:!1,channelId:0,channelMoveScale:1,volleyId:0,pending:[],projectiles:[],rings:[],nextId:0}}function kf(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.waveIndex=0,t.cooldown=0,t.needsRelease=!1,t.channelMoveScale=1,t.pending.length=0,t.projectiles.length=0,t.rings.length=0}function E0(n,t,e){S0(n,t,e)}function rc(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const yd=1e-6;function _d(n,t,e){return n<t?t:n>e?e:n}function If(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function zf(n){const t=n.camera,e=If();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function T0(n){const t=n.camera,e=n.config.camera,i=n.character.position;let a=0,s=0,o=0,r=0;for(const c of n.dummies){const h=c.position.x-i.x,u=c.position.z-i.z,d=Math.hypot(h,u);if(d>e.radius)continue;const f=_d((e.radius-d)/Math.max(yd,e.radius-e.nearDistance),0,1);let g=f*(e.modeWeight[c.mode]??.5);c.attackPhase==="active"&&(g+=e.attackBoost*f),a+=g,s+=c.position.x*g,o+=c.position.z*g,r+=1}const l=a<=0?0:_d(a/(a+Math.max(yd,e.saturation)),0,1);if(t.threat=l,t.threatCount=r,a<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const c=s/a,h=o/a;t.centroidX=c,t.centroidZ=h;let u=(c-i.x)*e.framingBias*l,d=(h-i.z)*e.framingBias*l;const f=Math.hypot(u,d);f>e.maxOffset&&(u=u/f*e.maxOffset,d=d/f*e.maxOffset),t.offsetX=u,t.offsetZ=d}t.distanceScale=1-e.pushIn*(1-l)+e.maxPullback*l,t.pitchDelta=e.maxPitchDelta*l}function A0(n){const t=[],e=n.ground.size;t.push(Na("ground","ground",0,0,e,e,-n.ground.thickness,0));for(const i of n.steps)t.push(Na(i.id,"step",i.x,i.z,i.width,i.depth,0,i.height));for(const i of n.doorways){const a=i.openingWidth/2,s=i.wallThickness;t.push(Na(`${i.id}-left`,"wall",i.x-a-i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push(Na(`${i.id}-right`,"wall",i.x+a+i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push(Na(`${i.id}-lintel`,"lintel",i.x,i.z,i.openingWidth,s,i.openingHeight,i.wallHeight))}for(const i of n.obstacles)t.push(Na(i.id,"obstacle",i.x,i.z,i.width,i.depth,0,i.height));return t}function Na(n,t,e,i,a,s,o,r){return{id:n,kind:t,minX:e-a/2,maxX:e+a/2,minY:o,maxY:r,minZ:i-s/2,maxZ:i+s/2}}const ki=1e-6;function vr(n,t,e){return n<t?t:n>e?e:n}function Qs(n,t,e,i,a,s,o){const r=a*.85;let l=Number.NEGATIVE_INFINITY;for(const c of n)c.maxY>i+s+ki||c.maxY<i-o-ki||t+r<c.minX||t-r>c.maxX||e+r<c.minZ||e-r>c.maxZ||c.maxY>l&&(l=c.maxY);return l}function R0(n,t,e,i,a=0,s=.05){let o=Number.NEGATIVE_INFINITY;for(const r of n)r.maxY>i+s||t<r.minX||t>r.maxX||e<r.minZ||e>r.maxZ||r.maxY>o&&(o=r.maxY);return o===Number.NEGATIVE_INFINITY?a:o}function dh(n,t,e,i,a){let s=!1;const o=t.y+i;for(let r=0;r<2;r++)for(const l of n){if(l.maxY<=t.y+a+ki||l.minY>=o-ki)continue;const c=vr(t.x,l.minX,l.maxX),h=vr(t.z,l.minZ,l.maxZ),u=t.x-c,d=t.z-h,f=u*u+d*d;if(!(f>=e*e))if(s=!0,f>ki*ki){const g=Math.sqrt(f),_=(e-g)/g;t.x+=u*_,t.z+=d*_}else{const g=t.x-l.minX,_=l.maxX-t.x,m=t.z-l.minZ,p=l.maxZ-t.z,y=Math.min(g,_,m,p);y===g?t.x=l.minX-e:y===_?t.x=l.maxX+e:y===m?t.z=l.minZ-e:t.z=l.maxZ+e}}return s}function uh(n,t,e,i,a){const s=t.y+i;for(const o of n){if(o.maxY<=t.y+a+ki||o.minY>=s-ki)continue;const r=vr(t.x,o.minX,o.maxX),l=vr(t.z,o.minZ,o.maxZ),c=t.x-r,h=t.z-l;if(c*c+h*h<e*e-ki)return!0}return!1}const qi=1e-6,ms=Math.PI/180;function fh(n){return Math.atan2(Math.sin(n),Math.cos(n))}function el(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Ff(n){n.arrows.length=0}function P0(n,t,e,i,a,s,o,r,l,c,h){const u=i-n,d=s-e,f=u*u+d*d;let g=0;f>qi&&(g=((o-n)*u+(r-e)*d)/f,g=Math.max(0,Math.min(1,g)));const _=n+u*g,m=e+d*g,p=_-o,y=m-r;if(p*p+y*y>h*h)return-1;const x=t+(a-t)*g;return x<l-.1||x>l+c?-1:g}function C0(n,t){const e=n.config.combat.bow.trajectory,i=Math.max(0,e.homingRange);if(i<=qi)return-1;const a=n.character.position,s=Math.max(0,e.homingConeDeg)*ms,o=n.config.targeting.targetAssist&&n.modules.targeting?n.targeting:null,r=o&&o.hasTarget?o.targetId:0;let l=-1,c=i+qi;for(const h of n.dummies){if(!n.modules.dummies)break;const u=h.position.x-a.x,d=h.position.z-a.z,f=Math.hypot(u,d);if(!(f<.001||f>i)){if(h.id===r)return h.id;Math.abs(fh(Math.atan2(u,d)-t))>s||f<c&&(l=h.id,c=f)}}return l}function L0(n,t,e){if(e<=0)return t;const i=n.dummies.find(r=>r.id===e);if(!i)return t;const a=n.character.position,s=Math.atan2(i.position.x-a.x,i.position.z-a.z),o=Math.max(0,n.config.combat.bow.trajectory.homingConeDeg)*ms;return t+cs(fh(s-t),-o,o)}function D0(n,t,e,i,a,s){const o=n.config.combat.bow.trajectory,r={vy:s*Math.sin(Math.max(0,o.launchPitchDeg)*ms),horizontal:0};if(r.horizontal=s*Math.cos(Math.max(0,o.launchPitchDeg)*ms),a<=0)return r;const l=n.dummies.find(_=>_.id===a);if(!l)return r;const c=Math.hypot(l.position.x-t,l.position.z-i);if(c<.4)return r;const h=c/Math.max(qi,s),u=l.position.y+n.config.dummies.height*cs(o.aimHeightRatio,0,1),d=Math.max(0,o.gravity),f=(u-e+.5*d*h*h)/h,g=cs(f,-s*.45,s*.92);return{vy:g,horizontal:Math.sqrt(Math.max(0,s*s-g*g))}}function k0(n,t,e){const i=n.config.combat.bow.trajectory,a=Math.max(0,Math.min(1,t)),s=i.speedMin+(i.speedMax-i.speedMin)*a,o=n.character.position,r=C0(n,e),l=L0(n,e,r),c=Math.sin(l),h=Math.cos(l),u=o.x+Math.sin(e)*.55,d=o.z+Math.cos(e)*.55,f=o.y+.95,g=D0(n,u,f,d,r,s),_={id:++n.arrowSeq,x:u,y:f,z:d,vx:c*g.horizontal,vy:g.vy,vz:h*g.horizontal,life:Math.max(.1,i.maxLife),stuck:!1,stuckDummy:-1,offX:0,offY:0,offZ:0,yaw:e,localYaw:0,pitch:0,rest:0,hit:!1,targetId:r,homing:Math.max(0,i.homingTime),turnRate:Math.max(0,i.turnRateDeg)*ms};return n.arrows.push(_),el(n,"arrow-shot",a,_),_}function cs(n,t,e){return n<t?t:n>e?e:n}function I0(n,t){const e=n.arrows;if(e.length===0)return;const i=n.config.combat.bow.trajectory,a=n.config.dummies.radius,s=n.config.dummies.height,o=n.modules.hits&&n.modules.dummies,r=Math.max(0,i.gravity),l=[];for(const c of e){if(c.stuck){if(c.rest-=t,c.rest<=0)continue;if(c.stuckDummy>=0){const v=n.dummies[c.stuckDummy];if(v){const w=Math.cos(v.bodyYaw),S=Math.sin(v.bodyYaw);c.x=v.position.x+c.offX*w+c.offZ*S,c.y=v.position.y+c.offY,c.z=v.position.z-c.offX*S+c.offZ*w,c.yaw=v.bodyYaw+c.localYaw}}l.push(c);continue}if(c.life-=t,c.life<=0)continue;const h=c.x,u=c.y,d=c.z;if(c.homing>0&&(c.homing=Math.max(0,c.homing-t),c.targetId>0&&c.turnRate>0)){const v=n.dummies.find(w=>w.id===c.targetId);if(!v)c.targetId=0;else{const w=Math.hypot(c.vx,c.vz);if(w>qi){const S=Math.atan2(v.position.x-c.x,v.position.z-c.z),T=Math.atan2(c.vx,c.vz),E=c.turnRate*t,b=T+cs(fh(S-T),-E,E);c.vx=Math.sin(b)*w,c.vz=Math.cos(b)*w;const M=Math.hypot(v.position.x-c.x,v.position.z-c.z);if(M>.3){const R=M/w,z=(v.position.y+s*cs(i.aimHeightRatio,0,1)-c.y+.5*r*R*R)/R,N=Math.max(0,i.verticalTurnRate)*t;c.vy+=cs(z-c.vy,-N,N)}}}}c.yaw=Math.atan2(c.vx,c.vz),c.pitch=-Math.atan2(c.vy,Math.hypot(c.vx,c.vz)),c.vy-=r*t;const f=h+c.vx*t,g=u+c.vy*t,_=d+c.vz*t;let m=-1,p=2;if(o)for(let v=0;v<n.dummies.length;v++){const w=n.dummies[v],S=P0(h,u,d,f,g,_,w.position.x,w.position.z,w.position.y,s,a+i.radius);S>=0&&S<p&&(p=S,m=v)}if(m>=0){const v=n.dummies[m];c.x=h+(f-h)*p,c.y=u+(g-u)*p,c.z=d+(_-d)*p,c.stuck=!0,c.stuckDummy=m;const w=Math.cos(v.bodyYaw),S=Math.sin(v.bodyYaw),T=c.x-v.position.x,E=c.z-v.position.z;c.offX=T*w-E*S,c.offZ=T*S+E*w,c.offY=c.y-v.position.y;const b=Math.atan2(c.vx,c.vz);c.localYaw=b-v.bodyYaw,c.yaw=b,c.pitch=Math.atan2(-c.vy,Math.hypot(c.vx,c.vz)),c.rest=Math.max(.2,i.stickSec),c.hit=!0;const M=Math.hypot(c.vx,c.vz);lo(n,m,{type:"light",duration:.22,dirX:M>qi?c.vx/M:0,dirZ:M>qi?c.vz/M:1,knockback:.14}),el(n,"arrow-land",v.id,c),l.push(c);continue}const y=Qs(n.boxes,f,_,g+.4,.04,0,6),x=Number.isFinite(y)?y:0;if(g<=x+.02&&c.vy<0){c.x=f,c.y=x+Math.max(0,i.groundStickLift),c.z=_,c.stuck=!0,c.stuckDummy=-1,c.yaw=Math.atan2(c.vx,c.vz);const v=Math.atan2(-c.vy,Math.max(qi,Math.hypot(c.vx,c.vz)));c.pitch=Math.max(v,Math.max(0,i.stickMinPitchDeg)*ms),c.rest=Math.max(.2,i.stickSec),el(n,"arrow-land",-1,c),l.push(c);continue}c.x=f,c.y=g,c.z=_,l.push(c)}n.arrows=l}const nl=1e-6,z0=Math.PI/180;function il(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function ph(n,t,e){return n<t?t:n>e?e:n}function zr(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function al(n){const t=n.id,e=n.windowId;Object.assign(n,zr()),n.id=t,n.windowId=e}function F0(n){al(n)}function Uf(n){al(n.playerLink);for(const t of n.dummies)al(t.link)}function U0(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function sl(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const a=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;a<=0||(i.linkWindow=Math.max(i.linkWindow,a),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function yr(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,zr()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function N0(n,t){const e=n.config.links.search,i=n.character.position,a=ph(e.maxAngleDeg,0,180)*z0;let s=0,o=t,r=Number.POSITIVE_INFINITY;for(const l of n.dummies){const c=l.position.x-i.x,h=l.position.z-i.z,u=Math.hypot(c,h);if(u<nl||u>e.range)continue;const d=Math.atan2(c,h);Math.abs(Xe(d-t))>a||u<r&&(r=u,s=l.id,o=d)}return{id:s,yaw:o,dist:s>0?r:0}}function O0(n,t,e,i){const a=n.config.links,s=n.playerLink,o=n.character.position,r=Js(n,t),l=N0(n,r),c=l.id>0?l.yaw:r,h=l.id>0?ph(l.dist-a.search.stopDistance,0,e.distance):a.noTargetFallback?e.distance:0;s.phase="windup",s.linkWindow=0,s.source="none",s.usedWindowId=s.windowId,s.cooldown=a.sharedCooldown,s.kind=e.kind,s.weapon=i,s.id+=1,s.timer=0,s.progress=0,s.facing=c,s.targetId=l.id,s.targetDist=l.dist,s.travel=h,s.travelled=0,s.fromX=o.x,s.fromZ=o.z,s.pulseTimer=0,s.hitIds=[],s.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,a.sharedCooldown),il(n,"link-start",s.id)}function B0(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){yr(n);return}if(e.weapon!==n.combat.weapon){yr(n);return}e.timer+=t;const a=l=>l==="windup"?i.windup:l==="active"?i.active:i.recovery;let s=0;for(;e.phase!=="idle"&&s++<8;){const l=a(e.phase);if(e.timer<l)break;e.timer-=l,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,il(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,il(n,"link-end",e.id))}const o=i.windup+i.active+i.recovery;let r=0;if(e.phase==="windup"?r=e.timer:e.phase==="active"?r=i.windup+e.timer:e.phase==="recovery"?r=i.windup+i.active+e.timer:r=o,e.progress=o>0?ph(r/o,0,1):1,e.phase==="active"&&i.active>nl){const l=Math.max(0,e.travel-e.travelled),c=Math.max(nl,i.active-e.timer),h=l/c;n.impulse.x=Math.sin(e.facing)*h,n.impulse.z=Math.cos(e.facing)*h}}function H0(n,t,e){const i=n.config.links,a=n.playerLink,s=n.character.position;if(a.consumedAttack=!1,n.combat.hitstop>0)return;if(a.phase==="active"&&(a.travelled+=Math.hypot(s.x-a.fromX,s.z-a.fromZ)),a.fromX=s.x,a.fromZ=s.z,!i.enabled||!n.modules.links){a.phase!=="idle"&&yr(n);return}const o=n.combat,r=n.character.sprinting;r&&i.triggerWhileSprinting&&a.phase==="idle"&&a.usedWindowId!==a.windowId&&i.windows.sprint>0&&(a.linkWindow=Math.max(a.linkWindow,i.windows.sprint),a.source="sprint"),a.phase==="idle"&&a.prevSprinting&&!r&&sl(n,"sprint"),a.prevSprinting=r,B0(n,t);const l=i.moves[o.weapon];e.attackPressed&&a.phase==="idle"&&a.linkWindow>0&&a.usedWindowId!==a.windowId&&a.cooldown<=0&&o.phase==="idle"&&!o.charging&&n.dash.phase==="idle"&&!!l&&l.enabled&&O0(n,e,l,o.weapon)}const or={windup:0,active:1,recovery:2},Md=1e-9;function Nf(n){return Number.isFinite(n)?n<0?0:n>1?1:n:0}function G0(n){return n==="windup"||n==="active"||n==="recovery"}function V0(n,t){return or[n]+Nf(t)}function X0(n,t,e){if(!n||n.length===0)return[];if(!Number.isFinite(e)||e<0)return[];const i=Number.isFinite(t)?t:-1,a=[];for(const s of n){if(!s||!G0(s.at))continue;const o=Nf(s.u??0),r=or[s.at]+o;r>i+Md&&r<=e+Md&&a.push({name:s.name,value:Number.isFinite(s.value)?s.value:0,at:s.at,u:o})}return a.sort((s,o)=>or[s.at]+s.u-(or[o.at]+o.u)),a}const to=1e-6;function Ki(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function W0(n,t,e){const i=n.character.position;n.events.push({type:"notify",tick:n.tick,x:i.x,y:i.y,z:i.z,value:e,name:t})}function Of(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function Fr(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.hitstop=0,t.notifyCursor=-1,t.hitIds.length=0,t.warp=1,t.warpDebt=0,t.warpPhase=0,t.warpTimer=0,t.slamAttackId=0,t.timings=Of()}function Bf(n){return{weapon:ea[Math.max(0,n-1)]??ea[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,hitstop:0,notifyCursor:-1,hitIds:[],warp:1,warpDebt:0,warpPhase:0,warpTimer:0,slamAttackId:0,timings:Of()}}function Y0(n,t){return Js(n,t)}function $0(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,a=Math.max(0,t*e.maxLungeScale),s=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+s,a)}function Hf(n,t,e,i){const a=n.combat;a.phase="windup",a.phaseTimer=0,a.comboIndex=i,a.queued=!1,a.charging=!1,a.charge=0,a.attackFacing=Y0(n,t),a.attackProgress=0,a.timings=e,a.attackId+=1,a.warpDebt=0,a.warpPhase=0,a.warpTimer=0,a.warp=1,a.notifyCursor=-1,a.hitIds.length=0,Ki(n,"attack-start",i)}function Gf(n){return Math.max(0,n.config.combat.settle)}function ol(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];Hf(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Gf(n),lunge:$0(n,i.lunge[e-1]??0)},e)}function bd(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,Hf(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Gf(n),lunge:i.lunge},0),k0(n,e,n.combat.attackFacing),Ki(n,"charge-release",e)}function Z0(n,t){const e=n.combat,i=n.config.hits.hitstopWarp;if(!i||!i.enabled)return e.warp=e.hitstop>0?0:1,e.warp;const a=Math.max(0,Math.min(1,i.holdRate));if(e.hitstop>0)return e.warpPhase=1,e.warpTimer=e.hitstop,e.warp=a,e.warpDebt+=t*(1-a),e.warp;if(e.warpPhase===1&&(e.warpPhase=2,e.warpTimer=0),e.warpPhase===2){const s=Math.max(.001,i.release);e.warpTimer+=t;const o=Math.min(1,e.warpTimer/s),r=1-(1-o)*(1-o),l=a+(1-a)*r;if(e.warp=l,e.warpDebt+=t*(1-l),o>=1){e.warpPhase=3,e.warpTimer=0;const c=Math.max(0,e.timings.recovery)*Math.max(0,i.payback-1)*Math.max(0,Math.min(1,i.paybackBudget));e.warpDebt=Math.min(e.warpDebt,c)}return e.warp}if(e.warpPhase===3&&e.warpDebt>1e-6){const s=Math.min(Math.max(0,i.payback-1),e.warpDebt/Math.max(t,1e-5));return e.warp=1+s,e.warpDebt=Math.max(0,e.warpDebt-t*s),e.warpDebt<=1e-6&&(e.warpPhase=0,e.warp=1),e.warp}return e.warpPhase=0,e.warp=1,1}function j0(n,t,e){const i=n.combat;if(i.phase==="idle"){i.warp=1,i.warpPhase=0,i.warpTimer=0,i.warpDebt=0;return}const a=i.timings,s=Z0(n,t),o=t*s;i.phaseTimer+=o;let r=0;for(;i.phase!=="idle"&&r++<8;){const h=i.phase==="windup"?a.windup:i.phase==="active"?a.active:i.phase==="recovery"?a.recovery:a.settle;if(i.phaseTimer<h)break;if(i.phaseTimer-=h,i.phase==="windup")i.phase="active",Ki(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",i.warpPhase=0,i.warpDebt=0,i.warpTimer=0,i.warp=1,Ki(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.weapons[i.weapon].comboWindow??n.config.combat.comboWindow,i.queued){i.queued=!1;const u=n.config.combat.weapons[i.weapon];u.comboCount>0&&ol(n,e,i.comboIndex<u.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const h=i.timings.recovery;if(h>to&&i.phaseTimer>=h*n.config.combat.cancelWindow){i.queued=!1;const u=n.config.combat.weapons[i.weapon];u.comboCount>0&&ol(n,e,i.comboIndex<u.comboCount?i.comboIndex+1:1)}}const l=a.windup+a.active+a.recovery;let c=0;i.phase==="windup"?c=i.phaseTimer:i.phase==="active"?c=a.windup+i.phaseTimer:i.phase==="recovery"?c=a.windup+a.active+i.phaseTimer:i.phase==="settle"&&(c=l),i.phase!=="idle"&&(i.attackProgress=l>0?Math.min(1,c/l):1),q0(n)}function q0(n){const t=n.combat;if(t.phase==="idle")return;const e=t.timings,i=t.phase==="windup"?e.windup:t.phase==="active"?e.active:t.phase==="recovery"?e.recovery:0,a=i>to?Math.min(1,Math.max(0,t.phaseTimer/i)):1,s=t.phase==="settle"?3:V0(t.phase,a);if(s<=t.notifyCursor+to)return;const o=n.config.combat.weapons[t.weapon].notifies;for(const r of X0(o,t.notifyCursor,s))W0(n,r.name,r.value);t.notifyCursor=s}function K0(n,t,e){const i=n.combat,a=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=ea.length){const l=ea[e.weaponSlot-1];l!==i.weapon&&(i.weapon=l,Fr(n),yr(n),Ki(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,Ki(n,"combo-reset",0))),i.hitstop>0&&(n.impulse.x=0,n.impulse.z=0,n.character.velocity.x=0,n.character.velocity.z=0),j0(n,t,e);const s=a.weapons[i.weapon],o=n.dash.phase==="active";if(s.comboCount>0){const l=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!o&&!l&&(e.attackPressed||a.autoCombo&&e.attackHeld))if(i.phase==="idle"){const h=i.comboWindow>0&&i.comboIndex<s.comboCount?i.comboIndex+1:1;ol(n,e,h)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&!o&&!n.playerLink.consumedAttack){if(e.attackHeld){if(i.charging||(i.charging=!0,i.charge=0,Ki(n,"charge-start",0)),i.charge=Math.min(1,i.charge+t/Math.max(a.bow.maxChargeTime,to)),a.bow.autoFire&&i.charge>=1){i.charging=!1;const l=i.charge;i.charge=0,bd(n,e,l)}}else if(i.charging){i.charging=!1;const l=i.charge;i.charge=0,l>=a.bow.minChargeToFire?bd(n,e,l):Ki(n,"charge-release",0)}}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.hitstop<=0&&i.timings.active>to)){const l=i.timings.active,c=Math.max(0,i.timings.lunge),h=Math.max(.2,a.lungeCurve),u=m=>c*(1-Math.pow(1-Math.min(1,Math.max(0,m/l)),h+1)),d=t*i.warp,f=Math.min(l,Math.max(0,i.phaseTimer)),g=Math.min(l,Math.max(0,i.phaseTimer-d));let _=Math.max(0,u(f)-u(g))/Math.max(d,1e-4);_=Math.min(_,Math.max(0,a.lungeMaxSpeed)),n.impulse.x=Math.sin(i.attackFacing)*_,n.impulse.z=Math.cos(i.attackFacing)*_}i.hitstop>0&&(i.hitstop=Math.max(0,i.hitstop-t))}const rl=1e-6;function cc(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function J0(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function Vf(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function Sd(n,t,e){return n<t?t:n>e?e:n}function Q0(n,t,e){const i=n.config.dash,s=n.character.position,o=n.config.worldBounds,r=Math.max(.05,i.blinkStep),l=Math.max(0,i.blinkDistance);let c=0,h=s.x,u=s.z;for(;c<l-rl;){const d=Math.min(l,c+r),f=s.x+t*d,g=s.z+e*d,_=Sd(f,o.minX,o.maxX),m=Sd(g,o.minZ,o.maxZ),p={x:_,y:s.y,z:m};if(uh(n.boxes,p,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(h=_,u=m,c=d,_!==f||m!==g))break}return{x:h,z:u}}function tg(n,t,e){const i=n.dash,a=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,sl(n,"roll")),i.cooldown>0){const l=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),l>0&&i.cooldown===0&&cc(n,"dash-ready",0)}const s=n.combat,o=s.weapon==="bow"&&(s.charging||s.phase!=="idle");if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&(s.phase==="idle"||o)&&n.playerLink.phase==="idle"){o&&(s.charging=!1,s.charge=0,s.phase!=="idle"&&Fr(n));const l=Km(n,e),c=l.x,h=l.z,u=n.combat.weapon==="staff";if(i.kind=u?"blink":"roll",i.dirX=c,i.dirZ=h,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=u?a.blinkCooldown:a.rollCooldown,u){const d=Q0(n,c,h);n.character.position.x=d.x,n.character.position.z=d.z,i.toX=d.x,i.toZ=d.z,i.duration=0,i.timer=0,i.phase="idle",a.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),sl(n,"blink"),cc(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(rl,a.rollDuration),i.timer=i.duration,i.toX=i.fromX+c*a.rollDistance,i.toZ=i.fromZ+h*a.rollDistance,cc(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const l=Math.max(rl,i.timer),c=n.character.position.x,h=n.character.position.z;n.impulse.x=(i.toX-c)/l,n.impulse.z=(i.toZ-h)/l}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const nn=1e-6,cl=Math.PI*2,eg=7,ng=18,Xf=1.3,Wf=.4,ig=.9,wd=.9;function Ed(n,t,e,i){const a=Math.max(e,.1),s=((n+t*2.37)%a+a)%a,o=Math.min(Math.max(i,0),1)*a;if(o<=nn||s>=o)return 0;const r=Math.min(Math.max(a*.12,.15),o*.5),l=Math.min(1,Math.min(s/r,(o-s)/r));return l*l*(3-2*l)}function ag(n,t){const e=Math.hypot(n,t);return e<=1?{x:n,z:t}:{x:n/e,z:t/e}}function sg(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Td(n,t,e,i){return n+sg(t-n)*(1-Math.exp(-Math.max(e,nn)*i))}function _r(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function og(n){var i;const t=[];for(let a=0;a<n.count;a++){const s=n.spawn[a]??{x:0,z:0},o=n.initialModes[a]??"idle";t.push(Ad(a+1,o,s.x,s.z,null))}const e=n.fighters;if(e)for(let a=0;a<e.weapons.length;a++){const s=e.spawn[a]??{x:0,z:0},o=((i=e.initialModes)==null?void 0:i[a])??"spar",r=e.attackInterval*(.25+.22*a);t.push(Ad(t.length+1,o,s.x,s.z,e.weapons[a],r))}return t}function Ad(n,t,e,i,a,s=0){return{id:n,mode:t,initialMode:t,homeX:e,homeZ:i,position:{x:e,y:0,z:i},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:e,targetZ:i,wanderTimer:0,attackCooldown:s,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,attackComboIndex:0,attackComboLeft:0,comboGap:0,hurt:Tf(),link:zr(),weapon:a,combat:a?{...Bf(ea.indexOf(a)+1),weapon:a}:null}}function rg(n,t=!1){const e=t?wf:qm,i=e.indexOf(n);return e[(i+1)%e.length]}function Yf(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],a=t.spawn[e]??{x:i.homeX,z:i.homeZ},s=t.initialModes[e]??i.initialMode;i.mode=s,i.initialMode=s,i.homeX=a.x,i.homeZ=a.z,i.position.x=a.x,i.position.y=0,i.position.z=a.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=a.x,i.targetZ=a.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0,i.attackComboIndex=0,i.attackComboLeft=0,i.comboGap=0;const o=i.hurt;if(o.type="none",o.timer=0,o.duration=0,o.dirX=0,o.dirZ=0,o.knockX=0,o.knockZ=0,F0(i.link),i.combat){const r=i.combat;r.phase="idle",r.comboIndex=0,r.phaseTimer=0,r.attackProgress=0,r.attackFacing=0,r.charging=!1,r.charge=0,r.hitstop=0,r.warp=1,r.warpPhase=0,r.warpDebt=0,r.warpTimer=0,r.hitIds.length=0,r.timings={windup:0,active:0,recovery:0,settle:0,lunge:0}}}n.dummyAttackCount=0}function cg(n,t,e){const i=rc(n)*cl,a=Math.sqrt(rc(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*a,t.targetZ=t.homeZ+Math.sin(i)*a,t.wanderTimer=e.wanderInterval*(.6+rc(n)*.8)}function mh(n,t,e){if(t.weapon){const i=n.config.combat.weapons[t.weapon];if(i)return{windup:i.windup,active:i.active,recovery:i.recovery}}return{windup:e.attackWindup,active:e.attackActive,recovery:e.attackRecovery}}function ll(n,t,e){var s;if(!t.weapon)return e.attackRange;const i=n.config.hits.reach[t.weapon]??e.attackRange,a=((s=e.fighters)==null?void 0:s.attackRangeScale)??.9;return Math.max(.4,i*a)}function hl(n,t){return n.weapon&&t.fighters?t.fighters.attackInterval:t.attackInterval}function lg(n,t){return n.weapon&&t.fighters?Math.max(t.leashRadius,t.fighters.leashRadius):t.leashRadius}function hg(n,t,e){const i=mh(e,n,t);return n.attackPhase==="windup"?i.windup:n.attackPhase==="active"?i.active:n.attackPhase==="recovery"?i.recovery:0}function dg(n,t,e){var s;if(!t.weapon)return 1;const i=((s=e.fighters)==null?void 0:s.comboCount)??0;if(i>0)return Math.max(1,Math.round(i));const a=n.config.combat.weapons[t.weapon];return Math.max(1,Math.round((a==null?void 0:a.comboCount)??1))}function ug(n,t){var i;const e=((i=t.fighters)==null?void 0:i.comboGap)??0;return e>0?e:Math.max(0,n.config.combat.settle)}function fg(n){return n.attackPhase!=="idle"||n.attackComboLeft>0}function pg(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0,Rd(n,t,i);return}t.attackPhaseTimer+=e;let a=0;for(;t.attackPhase!=="idle"&&a++<4;){const l=Math.max(hg(t,i,n),nn);if(t.attackPhaseTimer<l)break;t.attackPhaseTimer-=l,t.attackPhase==="windup"?(t.attackPhase="active",_r(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0,t.attackComboLeft>0?t.comboGap=ug(n,i):(t.attackComboIndex=0,t.weapon&&t.attackCooldown<=0&&(t.attackCooldown=hl(t,i)*Wf)))}const s=mh(n,t,i),o=s.windup+s.active+s.recovery;let r=0;t.attackPhase==="windup"?r=t.attackPhaseTimer:t.attackPhase==="active"?r=s.windup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(r=s.windup+s.active+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||o<=0?0:Math.min(1,r/o),Rd(n,t,i)}function Rd(n,t,e){const i=t.combat;if(!i)return;const a=mh(n,t,e),s=t.attackPhase==="idle"&&t.attackComboLeft>0&&t.comboGap>0;i.weapon=t.weapon??i.weapon,i.phase=s?"settle":t.attackPhase,i.comboIndex=t.attackComboIndex,i.phaseTimer=t.attackPhaseTimer,i.attackProgress=s?1:t.attackProgress,i.attackFacing=t.facing,i.timings={windup:a.windup,active:a.active,recovery:a.recovery,settle:0,lunge:0},i.hitstop=0,i.warp=1,i.warpPhase=0,i.charging=!1,i.charge=0}function mg(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,a=i.x-t.position.x,s=i.z-t.position.z,o=Math.hypot(a,s),r=o>nn?a/o:0,l=o>nn?s/o:0;let c=0,h=0;if(t.mode==="wander"){const d=t.targetX-t.position.x,f=t.targetZ-t.position.z,g=Math.hypot(d,f);(t.wanderTimer<=0||g<.3)&&cg(n,t,e);const _=t.targetX-t.position.x,m=t.targetZ-t.position.z,p=Math.hypot(_,m);p>nn&&(c=_/p,h=m/p)}else if(t.mode==="follow")o>e.followStopDistance&&(c=r,h=l);else if(t.mode==="keep-distance"){const d=o-e.keepDistance,f=Math.max(e.keepDeadZone,.2),g=Math.max(-1,Math.min(1,d/f))*wd,_=Ed(n.time,t.id,e.strafePeriod,e.strafeDuty)*e.keepStrafe;c=r*g-l*_,h=l*g+r*_}else if(t.mode==="attack")o>ll(n,t,e)&&t.attackPhase==="idle"&&(c=r,h=l);else if(t.mode==="spar"){const d=ll(n,t,e),f=d*1.7;if(fg(t))o>d*Xf?(c=r,h=l):o<d*.55&&(c=-r*.6,h=-l*.6);else if(t.attackPhase==="idle"&&t.attackCooldown<=0&&o>d)c=r,h=l;else{const _=Math.max(-1,Math.min(1,(o-f)/.5))*wd,m=Ed(n.time,t.id,e.strafePeriod,e.strafeDuty)*ig;c=r*_-l*m,h=l*_+r*m}}({x:c,z:h}=ag(c,h));let u=t.facing;if(t.mode==="wander"?Math.hypot(c,h)>nn&&(u=Math.atan2(c,h)):o>nn&&(u=Math.atan2(r,l)),e.leashRadius>nn&&t.mode!=="wander"&&t.mode!=="idle"){const d=lg(t,e),f=t.position.x-t.homeX,g=t.position.z-t.homeZ,_=Math.hypot(f,g);if(_>d){const m=Math.min(1,(_-d)/Math.max(d*.5,.5)),p=-f/_,y=-g/_;c=c*(1-m)+p*m,h=h*(1-m)+y*m;const x=Math.hypot(c,h);x>nn&&(c/=x,h/=x)}}return{x:c,z:h,facing:u}}function gg(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.comboGap=Math.max(0,e.comboGap-t),e.hurt.timer>0&&(e.attackComboLeft=0,e.comboGap=0),(e.mode==="attack"||e.mode==="spar")&&e.attackPhase==="idle"&&e.hurt.timer<=0){const y=n.character.position,x=Math.hypot(y.x-e.position.x,y.z-e.position.z),v=ll(n,e,i);if(e.attackComboLeft>0)e.comboGap<=0&&(x<=v*Xf+nn?(e.attackComboIndex+=1,e.attackComboLeft-=1,e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,n.dummyAttackCount+=1,_r(n,"dummy-attack",e)):(e.attackComboLeft=0,e.attackComboIndex=0,e.attackCooldown=Math.max(e.attackCooldown,hl(e,i)*Wf)));else if(e.attackCooldown<=0&&x<=v+nn){const w=dg(n,e,i);e.attackComboIndex=1,e.attackComboLeft=Math.max(0,w-1),e.comboGap=0,e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=hl(e,i),n.dummyAttackCount+=1,_r(n,"dummy-attack",e)}}pg(n,e,t,i);const a=mg(n,e,i),s=n.config.worldBounds;(a.x>0&&e.position.x>=s.maxX-nn||a.x<0&&e.position.x<=s.minX+nn)&&(a.x=0),(a.z>0&&e.position.z>=s.maxZ-nn||a.z<0&&e.position.z<=s.minZ+nn)&&(a.z=0);const o=1-Math.exp(-Math.max(i.acceleration,nn)*t),r=e.weapon&&i.fighters?i.fighters.moveSpeed:i.moveSpeed;e.velocity.x+=(a.x*r-e.velocity.x)*o,e.velocity.z+=(a.z*r-e.velocity.z)*o,e.facing=a.facing,e.bodyYaw=Td(e.bodyYaw,e.facing,eg,t),e.headYaw=Td(e.headYaw,e.facing,ng,t);const l=e.position.x,c=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const h=n.config.stepHeight;if(dh(n.boxes,e.position,i.radius,i.height,h))if(uh(n.boxes,e.position,i.radius,i.height,h))e.position.x=l,e.position.z=c,e.velocity.x=0,e.velocity.z=0;else{const y=e.position.x-l,x=e.position.z-c;Math.abs(y)<Math.abs(e.velocity.x*t)*.5&&(e.velocity.x=0),Math.abs(x)<Math.abs(e.velocity.z*t)*.5&&(e.velocity.z=0)}const d=n.config.worldBounds;e.position.x<d.minX?(e.position.x=d.minX,e.velocity.x<0&&(e.velocity.x=0),e.hurt.knockX<0&&(e.hurt.knockX=0)):e.position.x>d.maxX&&(e.position.x=d.maxX,e.velocity.x>0&&(e.velocity.x=0),e.hurt.knockX>0&&(e.hurt.knockX=0)),e.position.z<d.minZ?(e.position.z=d.minZ,e.velocity.z<0&&(e.velocity.z=0),e.hurt.knockZ<0&&(e.hurt.knockZ=0)):e.position.z>d.maxZ&&(e.position.z=d.maxZ,e.velocity.z>0&&(e.velocity.z=0),e.hurt.knockZ>0&&(e.hurt.knockZ=0));const f=Qs(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,h,Number.POSITIVE_INFINITY);f>Number.NEGATIVE_INFINITY&&f<=e.position.y+h+nn&&(e.position.y=f);const g=Math.hypot(e.position.x-l,e.position.z-c);e.distance+=g;const _=Math.hypot(e.velocity.x,e.velocity.z),m=Math.min(n.config.strideSpeedCap,_/Math.max(n.config.moveSpeed,nn)),p=Math.max(n.config.strideLength*(1+m*n.config.strideSpeedGain),nn);e.stride=p,e.gaitPhase=(e.gaitPhase+g/p*cl)%cl}function xg(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const a=n.dummies[e.dummyClickId-1];a.mode=rg(a.mode,!!a.weapon),a.targetX=a.position.x,a.targetZ=a.position.z,a.wanderTimer=0,a.attackCooldown=0,a.attackPhase="idle",a.attackPhaseTimer=0,a.attackProgress=0,a.attackComboIndex=0,a.attackComboLeft=0,a.comboGap=0,a.combat&&(a.combat.phase="idle",a.combat.attackProgress=0,a.combat.comboIndex=0),_r(n,"dummy-mode",a)}for(const a of n.dummies)gg(n,t,a,i)}const ti=1e-6,Pd=Math.PI*2;function Cd(n,t){return Math.sqrt(n*n+t*t)}function wo(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function vg(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.headPitch=0,t.bodyPitch=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,Fr(n)}function yg(n,t,e){const i=n.character,a=n.config,s=Qs(n.boxes,t,e,a.characterHeight,a.characterRadius,a.stepHeight,Number.POSITIVE_INFINITY);i.position.x=t,i.position.y=s>Number.NEGATIVE_INFINITY?s:0,i.position.z=e,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.moveYaw=0,i.bodyYaw=0,i.headYaw=0,i.headPitch=0,i.bodyPitch=0,i.grounded=!0,i.sprinting=!1,i.gaitPhase=0,i.stride=a.strideLength,i.distance=0,i.coyoteTime=a.coyoteTime,i.jumpBuffer=0,Fr(n),Uf(n),Vf(n),kf(n),Ff(n),xr(n);const o=n.targeting;o.targetId=0,o.targetYaw=0,o.targetDist=0,o.hasTarget=!1;const r=n.playerHurt;r.type="none",r.lastAt=ch,r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,n.events.length=0}function _g(n,t,e){const i=n.config,a=n.character,s=a.position,o=a.velocity;let r=Number.isFinite(e.moveX)?e.moveX:0,l=Number.isFinite(e.moveZ)?e.moveZ:0;const c=Cd(r,l);c>1&&(r/=c,l/=c);const h=i.worldBounds;(r>0&&s.x>=h.maxX-ti||r<0&&s.x<=h.minX+ti)&&(r=0),(l>0&&s.z>=h.maxZ-ti||l<0&&s.z<=h.minZ+ti)&&(l=0);const u=n.combat.phase!=="idle",d=n.playerLink.phase!=="idle",f=n.dash.phase==="active",g=u||f||d;a.sprinting=!g&&e.sprintHeld&&c>ti;const _=i.combat.weapons[n.combat.weapon];let m=_?_.moveMultiplier:1;f||d?m=0:u?m*=n.combat.phase==="active"?i.combat.lungeMoveScale:n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?m*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(m*=Math.max(0,Math.min(1,n.abilities.channelMoveScale)));const p=i.moveSpeed*(a.sprinting?i.sprintMultiplier:1)*m;{const z=g?i.skillDecel:c>ti?i.acceleration:i.friction,N=1-Math.exp(-z*t);o.x+=(r*p-o.x)*N,o.z+=(l*p-o.z)*N}e.jumpPressed?a.jumpBuffer=i.jumpBufferTime:a.jumpBuffer=Math.max(0,a.jumpBuffer-t),a.coyoteTime=a.grounded?i.coyoteTime:Math.max(0,a.coyoteTime-t),a.jumpBuffer>0&&a.coyoteTime>0&&(o.y=i.jumpSpeed,a.grounded=!1,a.coyoteTime=0,a.jumpBuffer=0,wo(n,"jumped",i.jumpSpeed)),n.events.some(z=>z.type==="blink"&&z.tick===n.tick)&&(o.x=0,o.z=0,n.impulse.x=0,n.impulse.z=0);const x=s.x,v=s.z;if(s.x+=(o.x+n.impulse.x+n.playerHurt.knockX)*t,s.z+=(o.z+n.impulse.z+n.playerHurt.knockZ)*t,dh(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight)){if(uh(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight))s.x=x,s.z=v,o.x=0,o.z=0;else{const z=s.x-x,N=s.z-v;Math.abs(z)<Math.abs(o.x*t)*.5&&(o.x=0),Math.abs(N)<Math.abs(o.z*t)*.5&&(o.z=0)}wo(n,"blocked",1)}s.x<h.minX?(s.x=h.minX,o.x<0&&(o.x=0),n.playerHurt.knockX<0&&(n.playerHurt.knockX=0)):s.x>h.maxX&&(s.x=h.maxX,o.x>0&&(o.x=0),n.playerHurt.knockX>0&&(n.playerHurt.knockX=0)),s.z<h.minZ?(s.z=h.minZ,o.z<0&&(o.z=0),n.playerHurt.knockZ<0&&(n.playerHurt.knockZ=0)):s.z>h.maxZ&&(s.z=h.maxZ,o.z>0&&(o.z=0),n.playerHurt.knockZ>0&&(n.playerHurt.knockZ=0));const S=Qs(n.boxes,s.x,s.z,s.y,i.characterRadius,i.stepHeight,i.fallTolerance);a.grounded&&S>s.y+ti&&S-s.y<=i.stepHeight+ti&&(s.y=S,o.y=0,wo(n,"stepUp",S));const T=s.y;o.y-=i.gravity*t,s.y+=o.y*t;const E=Qs(n.boxes,s.x,s.z,T,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);E>Number.NEGATIVE_INFINITY&&s.y<=E&&o.y<=0?(s.y=E,o.y=0,a.grounded||wo(n,"landed",E),a.grounded=!0):a.grounded=!1;const b=Cd(s.x-x,s.z-v);a.distance+=b;const M=b/Math.max(t,ti),R=Math.min(i.strideSpeedCap,M/Math.max(i.moveSpeed,ti)),C=Math.max(i.strideLength*(1+R*i.strideSpeedGain),ti);a.stride=C,a.gaitPhase=(a.gaitPhase+b/C*Pd)%Pd}const dl=1e-6,Ld=2.399963229728653;function _a(n,t,e){return n<t?t:n>e?e:n}function Dd(n,t,e,i,a,s,o,r,l){const c=t.x-n.x,h=t.z-n.z,u=Math.hypot(c,h),d=e+i;if(u>=d)return;let f,g,_;u<dl?(f=r,g=l,_=d):(f=c/u,g=h/u,_=d-u);const m=_+o;n.x-=f*m*a,n.z-=g*m*a,t.x+=f*m*s,t.z+=g*m*s}function Mg(n){const t=n.config.separation,e=n.dummies,i=n.character.position,a=n.config.characterRadius,s=n.config.dummies.radius,o=Math.max(1,Math.floor(t.iterations)),r=Math.max(0,t.slop);for(let h=0;h<o;h++){for(let u=0;u<e.length;u++)for(let d=u+1;d<e.length;d++){const f=(u*3+d)*Ld;Dd(e[u].position,e[d].position,s,s,.5,.5,r,Math.cos(f),Math.sin(f))}for(let u=0;u<e.length;u++){const d=(u+1)*Ld;Dd(i,e[u].position,a,s,0,1,r,Math.cos(d),Math.sin(d))}}const l=n.config.stepHeight,c=n.config.worldBounds;for(const h of e)dh(n.boxes,h.position,s,n.config.dummies.height,l),h.position.x=_a(h.position.x,c.minX,c.maxX),h.position.z=_a(h.position.z,c.minZ,c.maxZ)}function bg(n,t,e,i,a,s,o,r){const l=Math.hypot(e,i),c=Math.max(0,r.contactBand),h=_a(r.minScale,0,1);if(l<dl||c<=0||h>=1)return 1;const u=a+o,d=_a(r.approachDot,0,.99);let f=0;for(const g of s){const _=g.position.x-n,m=g.position.z-t,p=Math.hypot(_,m);if(p>=u+c)continue;if(p<dl){f=1;continue}const y=(e*_+i*m)/(l*p);if(y<=d)continue;const x=_a(1-(p-u)/c,0,1),v=_a((y-d)/(1-d),0,1);f=Math.max(f,x*v)}return 1-(1-h)*_a(f,0,1)}function Sg(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=bg(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const lc=1e-6,wg=Math.PI/180;function Eg(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function Tg(n,t,e){return n<t?t:n>e?e:n}function Ag(n,t,e){const i=n.config.targeting,a=n.targeting,s=n.character.position;let o=n.character.facing;const r=Math.hypot(e.aimX,e.aimZ);e.aimActive&&r>lc?o=Math.atan2(e.aimX,e.aimZ):Math.hypot(e.moveX,e.moveZ)>lc&&(o=Math.atan2(e.moveX,e.moveZ));const l=Tg(i.maxAngleDeg,0,180)*wg;let c=Number.POSITIVE_INFINITY,h=0,u=0,d=0;for(const f of n.dummies){const g=f.position.x-s.x,_=f.position.z-s.z,m=Math.hypot(g,_);if(m<lc||m>i.range)continue;const p=Math.atan2(g,_),y=Math.abs(Xe(p-o));if(y>l)continue;const x=m-i.frontBias*Math.cos(y);x<c&&(c=x,h=f.id,u=p,d=m)}a.targetId=h,a.targetYaw=u,a.targetDist=d,a.hasTarget=h>0}const mi=1e-6;function ss(n,t,e){return n<t?t:n>e?e:n}function kd(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Rg(n,t,e){const i=n.config.gaze,a=n.gaze;if(!i.enabled||!n.modules.gaze){a.active=!1,a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}const s=n.character.position,o=(z,N)=>{const D=z.position.x-s.x,L=z.position.z-s.z,F=Math.hypot(D,L);if(F<mi||F>N)return 0;const H=ss((N-F)/Math.max(mi,N-i.nearDistance),0,1);let Y=H*(i.modeWeight[z.mode]??.5);return z.attackPhase==="active"&&(Y+=i.attackBoost*H),Y},r=[];let l=0,c=!1,h=!1,u=!1;for(const z of n.dummies){const N=o(z,i.threatRange),D=z.position.x-s.x,L=z.position.z-s.z,F=Math.hypot(D,L);N>0&&(r.push({id:z.id,x:z.position.x,z:z.position.z,dx:D,dz:L,yaw:Math.atan2(D,L),w:N}),l+=N,F<=i.approachDist&&(i.modeWeight[z.mode]??.5)>=i.hostileModeWeight&&(u=!0)),F>mi&&F<=i.recoveryDist&&(c=!0),(z.attackPhase==="windup"||z.attackPhase==="active")&&F<=i.threatRange&&(h=!0)}const d=l<=0?0:ss(l/(l+Math.max(mi,i.saturation)),0,1),f=r.length>0,g=a.active,_=f&&(e.aimActive&&d>=i.enterThreshold||i.reactToAttack&&h&&d>=i.enterThreshold||i.reactToApproach&&u),m=i.hurtHoldSec>mi&&n.time-n.playerHurt.lastAt<i.hurtHoldSec,p=g&&(c||m);if(a.active=_||p,!a.active){a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}if(r.length===0)return;r.sort((z,N)=>N.w-z.w);const y=r.slice(0,Math.max(1,i.maxThreats)),x=r[0],v=Math.atan2(x.dx,x.dz),w=i.behindAngleDeg*Math.PI/180,S=n.character.bodyYaw;let T=0,E=0,b=0;for(const z of y){const N=Math.abs(kd(z.yaw-v))/Math.PI;let D=z.w/(1+Math.max(i.spreadFalloff,0)*N*N);z!==x&&i.behindFalloff<1&&Math.abs(kd(z.yaw-S))>w&&(D*=Math.max(i.behindFalloff,0)),T+=z.x*D,E+=z.z*D,b+=D}a.mainId=x.id,a.mainYaw=v;const M=n.dummies.find(z=>z.id===x.id),R=(M?M.position.y:0)+n.config.dummies.height*ss(i.aimHeightRatio,0,1),C=s.y+n.config.characterHeight*ss(i.eyeHeightRatio,0,1);a.mainPitch=Math.atan2(R-C,Math.max(mi,Math.hypot(x.dx,x.dz))),a.centroidYaw=b>mi?Math.atan2(T/b-s.x,E/b-s.z):v,a.threatCount=r.length,a.threat=d}function Pg(n,t){const e=n.config.gaze;return(e.modeWeight[t.mode]??.5)>=e.hostileModeWeight}function Cg(n,t){const e=n.config.gaze;if(!e.enabled||!n.modules.gaze)return 0;const i=n.character.position,a=Math.hypot(t.position.x-i.x,t.position.z-i.z);if(a<mi||a>e.threatRange)return 0;const s=Math.max(mi,e.threatRange-e.nearDistance),o=ss((e.threatRange-a)/s,0,1);let r=o*(e.modeWeight[t.mode]??.5);t.attackPhase==="active"&&(r+=e.attackBoost*o);const l=Math.max(mi,e.modeWeight.attack??1.5);return ss(r/l,0,1)}function Lg(){return{active:!1,mainId:0,mainYaw:0,mainPitch:0,centroidYaw:0,threatCount:0,threat:0}}function Dg(n,t){return{tick:0,time:0,rngState:2654435769,config:n,boxes:A0(t),gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:Bf(1),playerLink:zr(),arrows:[],arrowSeq:0,abilities:w0(),skills:b0(n),impulse:{x:0,z:0},targeting:Eg(),turnInPlace:s0(),playerHurt:Tf(),hitCount:0,dash:{...J0(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{...If(),centroidX:n.spawn.x,centroidZ:n.spawn.z},gaze:Lg(),dummies:og(n.dummies),dummyAttackCount:0,events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,turnInPlace:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,gaze:!0,dummies:!0}}}function kg(n){vg(n),Yf(n),Uf(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.lastAt=ch,e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,kf(n),Ff(n),Vf(n),zf(n),xr(n);const i=n.gaze;i.active=!1,i.mainId=0,i.mainYaw=0,i.mainPitch=0,i.centroidYaw=0,i.threatCount=0,i.threat=0,n.events.length=0}function Id(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){kg(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?Ag(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),H0(n,t,e),n.modules.combat&&K0(n,t,e),n.modules.dash&&tg(n,t,e),n.modules.movement&&_g(n,t,e),n.modules.gaze&&Rg(n,t,e),n.modules.orientation&&l0(n,t,e),c0(n,t,e),n.modules.dummies&&xg(n,t,e),Jm(n,t),U0(n,t),n.modules.abilities&&E0(n,t,e),n.modules.combat&&I0(n,t),n.modules.dummies&&(a0(n,t),n.modules.separation&&(Mg(n),Sg(n))),n.modules.camera?T0(n):zf(n),n}const $f=["bodyYaw","bodyPitch","bodyRoll","pelvisX","pelvisZ","armPitch","armYaw","armRoll","elbow","bladePitch","armLPitch","armLYaw","armLRoll","elbowL","rootYaw","bladePitchOff","bladeTwist","bladeTwistOff","bladeYaw","bladeYawOff"],zd=1e-9;function Ig(n,t,e){return n<t?t:n>e?e:n}function Zf(n){return Ig(Number.isFinite(n)?n:0,0,1)}function jf(n,t){const e=Zf(t);return n==="in"?e*e:n==="out"?1-(1-e)*(1-e):n==="inOut"?e*e*(3-2*e):e}function zg(){const n={};for(const t of $f)n[t]=0;return n}function Fg(n,t){const e=zg(),i=(n==null?void 0:n.keys)??[];if(i.length===0)return e;const a=Zf(t);let s=0;for(;s<i.length-1&&a>i[s+1].t+zd;)s+=1;const o=i[s],r=i[Math.min(s+1,i.length-1)],l=r.t-o.t,c=l>zd?(a-o.t)/l:0,h=jf(o.ease??"linear",c);for(const u of $f){const d=o.pose[u]??r.pose[u]??0,f=r.pose[u]??o.pose[u]??0;e[u]=d+(f-d)*h}return e}function Ug(n,t){const e=n==null?void 0:n.spin;if(!e||!Number.isFinite(e.turns)||e.turns===0)return 0;const i=e.ease??"linear",a=Number.isFinite(e.span)&&e.span>0?Math.min(1,e.span):1,s=jf(i,t/a);return e.turns*Math.PI*2*s}function ra(n,t){return((n==null?void 0:n.keys)??[]).some(e=>typeof e.pose[t]=="number")}function Ng(n){let t=0;return{frame(e,i,a,s,o){if(s||a<=0)return t=0,0;t+=Math.min(e,.1)*a;const r=n.config.fixedDt,l=n.config.maxStepsPerFrame;let c=0;for(;t>=r&&c<l;){const h=c===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};Id(n,r,h),o&&o(),t-=r,c++}return c>=l&&(t=0),c},singleStep(e){Id(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t},get alpha(){const e=n.config.fixedDt;return e>0?Math.max(0,Math.min(1,t/e)):1}}}function wi(n,t,e){let i=t-n;for(;i>Math.PI;)i-=Math.PI*2;for(;i<-Math.PI;)i+=Math.PI*2;return n+i*e}function De(n,t,e){return n+(t-n)*e}function Og(n){const t=n.combat,e=n.dummies;let i=`${t.weapon}|${t.phase}|${t.comboIndex}|${t.attackId}|${n.character.grounded?1:0}|${n.character.sprinting?1:0}|${n.playerHurt.type}|${t.hitstop>0?1:0}|d:${n.dash.phase}:${n.dash.kind}|t:${n.turnInPlace.phase}|l:${n.playerLink.phase}:${n.playerLink.kind}`;for(let a=0;a<e.length;a++){const s=e[a];i+=`|${s.id}:${s.mode}:${s.attackPhase}:${s.attackId}:${s.hurt.type}`}return i}function Fd(n){const t=n.character,e=n.combat,i=n.playerHurt;return{time:n.time,key:Og(n),ch:{x:t.position.x,y:t.position.y,z:t.position.z,facing:t.facing,moveYaw:t.moveYaw,bodyYaw:t.bodyYaw,headYaw:t.headYaw,headPitch:t.headPitch,bodyPitch:t.bodyPitch,gaitPhase:t.gaitPhase,stride:t.stride,vx:t.velocity.x,vy:t.velocity.y,vz:t.velocity.z},cb:{attackProgress:e.attackProgress,phaseTimer:e.phaseTimer,charge:e.charge,hitstop:e.hitstop},dash:{timer:n.dash.timer},turn:{progress:n.turnInPlace.progress},link:{progress:n.playerLink.progress},hurt:{timer:i.timer,duration:i.duration,knockX:i.knockX,knockZ:i.knockZ},dm:n.dummies.map(a=>({x:a.position.x,y:a.position.y,z:a.position.z,facing:a.facing,bodyYaw:a.bodyYaw,headYaw:a.headYaw,gaitPhase:a.gaitPhase,stride:a.stride,attackProgress:a.attackProgress,vx:a.velocity.x,vy:a.velocity.y,vz:a.velocity.z}))}}function Bg(n,t){return n.key===t.key&&n.dm.length===t.dm.length}function Hg(n,t,e){const i=Math.max(0,Math.min(1,e)),a={position:{x:De(n.ch.x,t.ch.x,i),y:De(n.ch.y,t.ch.y,i),z:De(n.ch.z,t.ch.z,i)},facing:wi(n.ch.facing,t.ch.facing,i),moveYaw:wi(n.ch.moveYaw,t.ch.moveYaw,i),bodyYaw:wi(n.ch.bodyYaw,t.ch.bodyYaw,i),headYaw:wi(n.ch.headYaw,t.ch.headYaw,i),headPitch:De(n.ch.headPitch,t.ch.headPitch,i),bodyPitch:De(n.ch.bodyPitch,t.ch.bodyPitch,i),gaitPhase:wi(n.ch.gaitPhase,t.ch.gaitPhase,i),stride:De(n.ch.stride,t.ch.stride,i),velocity:{x:De(n.ch.vx,t.ch.vx,i),y:De(n.ch.vy,t.ch.vy,i),z:De(n.ch.vz,t.ch.vz,i)}},s={attackProgress:De(n.cb.attackProgress,t.cb.attackProgress,i),phaseTimer:De(n.cb.phaseTimer,t.cb.phaseTimer,i),charge:De(n.cb.charge,t.cb.charge,i),hitstop:i<1?Math.max(0,De(n.cb.hitstop,t.cb.hitstop,i)):t.cb.hitstop},o={timer:De(n.hurt.timer,t.hurt.timer,i),knockX:De(n.hurt.knockX,t.hurt.knockX,i),knockZ:De(n.hurt.knockZ,t.hurt.knockZ,i)},r=t.dm.map((l,c)=>{const h=n.dm[c];return h?{position:{x:De(h.x,l.x,i),y:De(h.y,l.y,i),z:De(h.z,l.z,i)},facing:wi(h.facing,l.facing,i),bodyYaw:wi(h.bodyYaw,l.bodyYaw,i),headYaw:wi(h.headYaw,l.headYaw,i),gaitPhase:wi(h.gaitPhase,l.gaitPhase,i),stride:De(h.stride,l.stride,i),attackProgress:De(h.attackProgress,l.attackProgress,i),velocity:{x:De(h.vx,l.vx,i),y:De(h.vy,l.vy,i),z:De(h.vz,l.vz,i)}}:null});return{time:De(n.time,t.time,i),character:a,combat:s,playerHurt:o,dash:{timer:De(n.dash.timer,t.dash.timer,i)},turn:{progress:De(n.turn.progress,t.turn.progress,i)},link:{progress:De(n.link.progress,t.link.progress,i)},dummies:r}}function Gg(n,t){const e=n.dummies.map((i,a)=>{const s=t.dummies[a];return s?{...i,...s}:i});return{...n,time:t.time,character:{...n.character,...t.character},combat:{...n.combat,...t.combat},playerHurt:{...n.playerHurt,...t.playerHurt},dash:{...n.dash,timer:t.dash.timer},turnInPlace:{...n.turnInPlace,progress:t.turn.progress},playerLink:{...n.playerLink,progress:t.link.progress},dummies:e}}const qf={slopPx:12,longPressMs:450,doubleTapMs:280};function Vg(n,t,e=qf.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,a=n.dy/n.distance,s=t.rightX*i+t.forwardX*-a,o=t.rightZ*i+t.forwardZ*-a,r=Math.hypot(s,o);return r<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:s/r,worldZ:o/r}}function ca(n,t,e,i,a,s){const o=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:o,angleDeg:o>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:a,taps:s,worldX:0,worldZ:0}}function Xg(n=qf){const t=new Map,e=new Map,i=a=>t.get(a);return{begin(a,s,o,r,l){if(t.has(s))return null;for(const c of t.values())if(c.button===a)return null;return t.set(s,{button:a,pointerId:s,startX:o,startY:r,x:o,y:r,startedAt:l,dragging:!1,longFired:!1}),ca(a,"press",0,0,0,1)},move(a,s,o,r){const l=i(a);if(!l)return null;l.x=s,l.y=o;const c=s-l.startX,h=o-l.startY;return!l.dragging&&Math.hypot(c,h)>=n.slopPx?(l.dragging=!0,ca(l.button,"drag",c,h,r-l.startedAt,1)):null},end(a,s,o,r){const l=i(a);if(!l)return null;t.delete(a),l.x=s,l.y=o;const c=s-l.startX,h=o-l.startY,u=r-l.startedAt,d=Math.hypot(c,h);if(l.dragging||l.longFired||d>=n.slopPx)return ca(l.button,"release",c,h,u,1);const f=e.get(l.button);return f!==void 0&&r-f.at<=n.doubleTapMs&&Math.hypot(s-f.x,o-f.y)<=n.slopPx*2?(e.delete(l.button),ca(l.button,"doubleTap",c,h,u,2)):(e.set(l.button,{at:r,x:s,y:o}),ca(l.button,"tap",c,h,u,1))},cancel(a,s){const o=i(a);return o?(t.delete(a),ca(o.button,"cancel",o.x-o.startX,o.y-o.startY,s-o.startedAt,1)):null},poll(a){for(const s of t.values())if(!(s.longFired||s.dragging)&&a-s.startedAt>=n.longPressMs)return s.longFired=!0,ca(s.button,"longPress",s.x-s.startX,s.y-s.startY,a-s.startedAt,1);return null},isHeld(a){for(const s of t.values())if(s.button===a)return!0;return!1},reset(){t.clear(),e.clear()}}}const hc=.001,Wg=18;function ul(n,t,e){return n<t?t:n>e?e:n}function fl(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function Yg(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function $g(n,t,e,i,a=Wg){const s=Yg(t);if(!s)return{state:fl(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const o=Math.hypot(s[1].x-s[0].x,s[1].y-s[0].y),r=a,l=Math.max(1.0001,Number.isFinite(i)?i:1.25),c=1/l,h=l;if(!Number.isFinite(o)||o<hc)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const g=r<=0;return{state:{active:!0,lastDist:o,armDist:o,armed:g},scale:1,started:!0,ended:!1,armedNow:!1,pinching:g}}if(!n.armed)return n.armDist<hc?{state:{active:!0,lastDist:o,armDist:o,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(o-n.armDist)<r?{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<hc)return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const u=o/n.lastDist,d=Math.max(0,Number.isFinite(e)?e:1),f=Number.isFinite(u)&&u>0?Math.pow(u,d):1;return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:ul(Number.isFinite(f)?f:1,c,h),started:!1,ended:!1,armedNow:!1,pinching:!0}}function Ud(n,t,e,i){const a=Math.min(e,i),s=Math.max(e,i),o=Number.isFinite(t)&&t>0?t:1,r=n*o;return Number.isFinite(r)?ul(r,a,s):ul(n,a,s)}function Zg(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function jg(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const dc=["jump","sprint","reset","attack","skill2"],qg=8,Kg=16,uc=10,Nd=14,Od=140,Jg=18,Qg=16,tx=400,ex=1.0001;function rr(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function nx(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&rr(e)}function ix(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:a}=n,s=()=>Math.max(8,t());let o=null,r=0,l=0,c=0,h=0,u=0,d=0,f=-1,g=0,_=null,m=-1,p=0,y=0,x=0,v=0,w=!1,S=0,T=1,E=0,b=null,M=0,R=0,C=!1,z=null,N=null,D=0,L=0,F=0,H=0,Y=!1,it=!0,mt=-1;const _t=Xg({slopPx:Nd,longPressMs:450,doubleTapMs:350});let Lt=[],J=null;const et=new Set;function ht(O){O&&Lt.push(O)}const q=new Map;let K=fl(),$=!1,Mt=1;function It(){const O=Array.from(q.values()),lt=a(),xt=$g(K,O,lt.pinchGain,lt.maxStepRatio,Jg);if(K=xt.state,$=xt.pinching,xt.scale!==1&&(Mt*=xt.scale),xt.started||xt.armedNow)b=null,C=!0,z=null;else if(xt.ended&&o===null&&O.length===1){const Wt=O[0];o=Wt.id,r=Wt.x,l=Wt.y,c=0,h=0,u=Wt.x,d=Wt.y,w=!1,S=0,T=1,E=0,performance.now(),b=null,C=!0,z=null}}const Ct={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},Ut={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let G=0,re=0;const Ht={},Pt=new Set,gt=[];function zt(){for(const O of dc)Ht[O]!==void 0&&(Ht[O]=void 0),j(O);_t.reset(),et.clear(),q.clear(),K=fl(),$=!1,o=null,c=0,h=0,u=0,d=0,w=!1,S=0,T=1,E=0,p=0,y=0,x=0,v=0,_=null,m=-1,b=null,C=!1,z=null,N=null,mt=-1,F=0,H=0,Y=!1,it=!0}const Ot=()=>{document.hidden&&zt()},I=O=>{if(O.clientX===0&&O.clientY===0){g++;return}if(rr(O.target)||nx(O.clientX,O.clientY)){et.add(O.pointerId);return}if(et.delete(O.pointerId),q.set(O.pointerId,{id:O.pointerId,x:O.clientX,y:O.clientY}),o===null&&!$){_=null,m=-1,o=O.pointerId,r=O.clientX,l=O.clientY,c=0,h=0,u=O.clientX,d=O.clientY,performance.now();const lt=Number.isFinite(O.screenX)&&Number.isFinite(O.screenY)&&(O.screenX!==0||O.screenY!==0);w=lt,S=0,T=1,E=0,p=lt?O.screenX:0,y=lt?O.screenY:0,x=p,v=y,b=O.pointerId,M=O.clientX,R=O.clientY,C=!1}It()},A=O=>{if(O.pointerId===N&&(O.pointerType==="mouse"&&O.buttons===0||O.clientX===0&&O.clientY===0&&(D!==0||L!==0)||(it?(F=O.clientX-D,H=O.clientY-L):(D=O.clientX,L=O.clientY,it=!0,F=0,H=0))),ht(_t.move(O.pointerId,O.clientX,O.clientY,performance.now())),!et.has(O.pointerId)&&q.has(O.pointerId)&&(q.set(O.pointerId,{id:O.pointerId,x:O.clientX,y:O.clientY}),It()),et.has(O.pointerId)||O.pointerId!==o)return;const lt=performance.now();if(_===O.pointerId&&lt-m<150){g++;return}const xt=O.clientX,Wt=O.clientY;if(xt===0&&Wt===0&&(r!==0||l!==0)){g++;return}const qt=xt-u,U=Wt-d,At=Number.isFinite(O.screenX)&&Number.isFinite(O.screenY),nt=At?O.screenX:0,ft=At?O.screenY:0,Rt=At&&(nt!==0||ft!==0),Et=nt-x,Vt=ft-v;if(w&&Rt){const wt=Math.hypot(Et,Vt),Tt=Math.hypot(qt,U);if(wt>3){if(S=0,E<30&&Tt>6&&Et*qt+Vt*U>.7*wt*Tt){const Qt=wt/Tt;Qt>.2&&Qt<5&&(T+=(Qt-T)*.3,E++)}}else Tt>12&&(S++,S>=2&&(w=!1))}const ce=Math.hypot(qt,U);if(!w){const wt=f<0?Number.POSITIVE_INFINITY:lt-f,Tt=Rt?Math.hypot(Et,Vt):1/0;ce>28&&(wt<200||Tt<ce*.4)&&(r+=qt,l+=U,g++)}u=xt,d=Wt,x=nt,v=ft,O.pointerId===b&&Math.hypot(O.clientX-M,O.clientY-R)>qg&&(C=!0);let me,ie;w&&Rt?(me=(nt-p)/T,ie=(ft-y)/T):(me=xt-r,ie=Wt-l);const Ee=Math.hypot(me,ie),Ge=s();Ee>Ge&&(me*=Ge/Ee,ie*=Ge/Ee);const ln=Math.hypot(c,h),V=Math.hypot(me,ie);if(ln>10&&V>10){const wt=Math.abs(Math.atan2(c*ie-h*me,c*me+h*ie)),Tt=Math.max(ln,V)*wt,Qt=Math.max(Math.hypot(qt,U),Math.hypot(Et,Vt)/Math.max(.2,T));if(wt>.6&&Qt<Math.max(6,Tt*.5)){g++;return}}c=me,h=ie};function j(O){if(!Ct[O])return;Ct[O]=!1,O==="attack"&&(Ut.attackReleased=!0);const lt=document.getElementById(`btn-${O}`);lt==null||lt.classList.remove("is-down")}function ut(){o!==null&&(_=o,m=performance.now(),o=null,c=0,h=0,u=0,d=0,w=!1,S=0,T=1,E=0,p=0,y=0,x=0,v=0)}const Q=O=>{const lt=q.delete(O.pointerId),xt=et.delete(O.pointerId);lt&&It(),O.pointerId===N&&(N=null,Y?mt=performance.now():(F=0,H=0,mt=-1)),ht(_t.end(O.pointerId,O.clientX,O.clientY,performance.now()));for(const Gt of dc)Ht[Gt]===O.pointerId&&(Ht[Gt]=void 0,j(Gt));const Wt=!lt&&!xt&&q.size<=1&&o!==null;(O.pointerId===o||q.size===0||Wt)&&ut(),!xt&&O.pointerId===b&&(!C&&!rr(O.target)&&(z={x:O.clientX,y:O.clientY}),b=null)};for(const O of dc){const lt=document.getElementById(`btn-${O}`);if(!lt)continue;const xt=O==="attack"||O==="skill2",Wt=U=>{if(U.preventDefault(),Ht[O]===void 0){Ht[O]=U.pointerId,Ct[O]=!0,O==="jump"&&(Ut.jump=!0),O==="reset"&&(Ut.reset=!0),O==="sprint"&&(Ut.sprintPressed=!0),O==="attack"&&(Ut.attackPressed=!0),O==="skill2"&&(Ut.skill2=!0),lt.classList.add("is-down"),ht(_t.begin(O,U.pointerId,U.clientX,U.clientY,performance.now()));try{lt.setPointerCapture(U.pointerId)}catch{}xt&&(N=U.pointerId,D=U.clientX,L=U.clientY,it=!(U.clientX===0&&U.clientY===0),F=0,H=0,Y=!1,mt=-1)}},Gt=U=>{Ht[O]===U.pointerId&&(Ht[O]=void 0,j(O),ht(_t.end(U.pointerId,U.clientX,U.clientY,performance.now())))},qt=U=>{Ht[O]===U.pointerId&&(Ht[O]=void 0,j(O),ht(_t.cancel(U.pointerId,performance.now())))};lt.addEventListener("pointerdown",Wt),lt.addEventListener("pointerup",Gt),lt.addEventListener("pointercancel",qt),gt.push(()=>{lt.removeEventListener("pointerdown",Wt),lt.removeEventListener("pointerup",Gt),lt.removeEventListener("pointercancel",qt)})}const ct=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const O of ct){const lt=xt=>{xt.preventDefault(),G=Number(O.dataset.weapon)||0};O.addEventListener("pointerdown",lt),gt.push(()=>O.removeEventListener("pointerdown",lt))}const kt=O=>{const lt=O.key.toLowerCase();if((lt===" "||lt.startsWith("arrow"))&&O.preventDefault(),Pt.has(lt))return;Pt.add(lt),lt===" "&&(Ut.jump=!0),lt==="r"&&(Ut.reset=!0),lt==="shift"&&(Ut.sprintPressed=!0),lt==="j"&&(Ut.attackPressed=!0),lt==="k"&&(Ut.skill2=!0),lt>="1"&&lt<="5"&&(G=Number(lt)),lt>="6"&&lt<="9"&&(re=Number(lt)-5);const xt=Math.max(ex,a().keyStep||1.12);(lt==="="||lt==="+")&&(Mt*=xt),(lt==="-"||lt==="_")&&(Mt/=xt)},tt=O=>{const lt=O.key.toLowerCase();Pt.has(lt)&&(Pt.delete(lt),lt==="j"&&(Ut.attackReleased=!0))},dt=O=>{if(rr(O.target))return;O.preventDefault();const lt=O.deltaMode===1?O.deltaY*Qg:O.deltaMode===2?O.deltaY*tx:O.deltaY;Mt*=Zg(lt,a().wheelStep)},Nt=O=>{O.preventDefault()},at=()=>{f=performance.now()};window.addEventListener("resize",at),window.addEventListener("orientationchange",at);const bt=typeof window<"u"?window.visualViewport:null;return bt&&(bt.addEventListener("resize",at),bt.addEventListener("scroll",at)),window.addEventListener("pointerdown",I),window.addEventListener("pointermove",A),window.addEventListener("pointerup",Q),window.addEventListener("pointercancel",Q),window.addEventListener("blur",zt),document.addEventListener("visibilitychange",Ot),window.addEventListener("keydown",kt),window.addEventListener("keyup",tt),window.addEventListener("wheel",dt,{passive:!1}),window.addEventListener("gesturestart",Nt),{peekStick(){return{id:o,held:o!==null,originX:r,originY:l,x:u,y:d,dx:u-r,dy:d-l,radius:s(),badMoves:g,screenOk:w,originSX:p,originSY:y,screenX:x,screenY:v,scale:T}},peekAim(){const O=performance.now(),lt=Math.hypot(F,H),xt=N!==null||mt>=0&&O-mt<Od;if(!(xt&&Y&&lt>=uc))return{active:!1,holding:xt,x:0,z:0,dx:F,dy:H};const Gt=i(),qt=F/lt,U=H/lt,At=Gt.rightX*qt+Gt.forwardX*-U,nt=Gt.rightZ*qt+Gt.forwardZ*-U,ft=Math.hypot(At,nt)||1;return{active:!0,holding:xt,x:At/ft,z:nt/ft,dx:F,dy:H}},sample(){var fe;const O=s();let lt=o!==null?Math.max(-1,Math.min(1,c/O)):0,xt=o!==null?Math.max(-1,Math.min(1,h/O)):0,Wt=0,Gt=0;(Pt.has("a")||Pt.has("arrowleft"))&&(Wt-=1),(Pt.has("d")||Pt.has("arrowright"))&&(Wt+=1),(Pt.has("w")||Pt.has("arrowup"))&&(Gt-=1),(Pt.has("s")||Pt.has("arrowdown"))&&(Gt+=1),lt+=Wt,xt+=Gt;let qt=Math.hypot(lt,xt);qt>1&&(lt/=qt,xt/=qt,qt=1);const U=lt,At=xt;qt<e&&(lt=0,xt=0);const nt=i();let ft=nt.rightX*lt+nt.forwardX*-xt,Rt=nt.rightZ*lt+nt.forwardZ*-xt;const Et=Math.hypot(ft,Rt);Et>1&&(ft/=Et,Rt/=Et);const Vt=performance.now();ht(_t.poll(Vt));const ce=Math.hypot(F,H);N!==null&&(ce>=Kg?Y=!0:ce<uc&&(Y=!1));const me=N!==null||mt>=0&&Vt-mt<Od,ie=me&&Y&&ce>=uc;let Ee=0,Ge=0;if(ie){const ae=F/ce,ge=H/ce,Ne=nt.rightX*ae+nt.forwardX*-ge,ze=nt.rightZ*ae+nt.forwardZ*-ge,Le=Math.hypot(Ne,ze)||1;Ee=Ne/Le,Ge=ze/Le}!me&&N===null&&(F=0,H=0,mt=-1,Y=!1);const ln=z;z=null;const V=Mt;Mt=1;const wt={moveX:ft,moveZ:Rt,jumpPressed:Ut.jump,sprintHeld:Ct.sprint||Pt.has("shift"),sprintPressed:Ut.sprintPressed,resetPressed:Ut.reset,attackPressed:Ut.attackPressed,attackHeld:Ct.attack||Pt.has("j"),attackReleased:Ut.attackReleased,skill2Pressed:Ut.skill2,weaponSlot:G,dummyClickId:re,aimX:Ee,aimZ:Ge,aimActive:ie};Ut.jump=!1,Ut.reset=!1,Ut.sprintPressed=!1,Ut.attackPressed=!1,Ut.attackReleased=!1,Ut.skill2=!1,G=0,re=0;const Tt=Lt.map(ae=>Vg(ae,nt,Nd));Lt=[],Tt.length>0&&(J=Tt[Tt.length-1]);const Qt=o!==null?"pointer":Pt.size>0?"keyboard":"idle";return{intents:wt,stickX:lt,stickY:xt,stickRawX:U,stickRawY:At,stickHeld:o!==null,stickId:o,stickOriginX:r,stickOriginY:l,stickPxX:u,stickPxY:d,stickBad:g,stickScreenOk:w,stickOriginSX:p,stickOriginSY:y,stickScreenX:x,stickScreenY:v,stickScale:T,stickVpTop:((fe=jg())==null?void 0:fe.top)??0,stickVpAge:f<0?-1:Math.round(performance.now()-f),aimDX:F,aimDY:H,source:Qt,tap:ln,zoomScale:V,gestures:Tt,lastGesture:J}},dispose(){window.removeEventListener("pointerdown",I),window.removeEventListener("pointermove",A),window.removeEventListener("pointerup",Q),window.removeEventListener("pointercancel",Q),window.removeEventListener("blur",zt),document.removeEventListener("visibilitychange",Ot),window.removeEventListener("keydown",kt),window.removeEventListener("keyup",tt),window.removeEventListener("wheel",dt),window.removeEventListener("resize",at),window.removeEventListener("orientationchange",at),bt&&(bt.removeEventListener("resize",at),bt.removeEventListener("scroll",at)),window.removeEventListener("gesturestart",Nt),_t.reset();for(const O of gt)O()}}}const Mr=1,br=2,Sr=4,Kf=8,wr=16,Ys=32,Jf=64,Qf=128,ax=[[Mr,"atk"],[br,"dash"],[Sr,"link"],[Kf,"air"],[wr,"hurt"],[Ys,"aim"],[Jf,"spr"],[Qf,"chan"]];function Oa(n){if(n===0)return"-";const t=ax.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const sx=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],ox=0,rx=15,fc=19,cx=21,lx=22,hx=23,dx=24,fi={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},Rn=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,ei=n=>Math.round(n*180/Math.PI*10)/10,pc=Math.PI*2;function Ls(n){let t=n%pc;return t>Math.PI&&(t-=pc),t<-Math.PI&&(t+=pc),t}function ux(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=Mr),n.dash.phase!=="idle"&&(e|=br),n.playerLink.phase!=="idle"&&(e|=Sr),n.character.grounded||(e|=Kf),n.playerHurt.type!=="none"&&(e|=wr),t.intents.aimActive&&(e|=Ys),n.character.sprinting&&(e|=Jf),n.abilities.channeling&&(e|=Qf),e}function fx(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function px(n){const t={sampleHz:n.sampleHz??fi.sampleHz,sampleCapacity:n.sampleCapacity??fi.sampleCapacity,eventCapacity:n.eventCapacity??fi.eventCapacity,anomalyCapacity:n.anomalyCapacity??fi.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??fi.dirJumpDeg,aimDropDeg:n.aimDropDeg??fi.aimDropDeg,freezeMs:n.freezeMs??fi.freezeMs,freezeSpeed:n.freezeSpeed??fi.freezeSpeed,stickLostMs:n.stickLostMs??fi.stickLostMs,spikeMs:n.spikeMs??fi.spikeMs},e=n.meta,i=[],a=[],s=[],o={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let r=!0,l=-1,c=-1e9,h=null,u=0,d=0,f="",g=-1,_=-1,m=-1,p=0,y=-1e9,x=-1,v={},w=null,S=0,T=0,E=0,b=0;function M(D,L){const F=1/t.sampleHz,H=D[ox];H-c<F-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(D),c=H)}function R(D,L,F,H,Y,it){const mt=v[D]??-1e9;if(L-mt<1.2)return;if(v[D]=L,D==="frameSpike"){let Lt=0;for(const J of s)J.kind==="frameSpike"&&Lt++;if(Lt>=6)return}s.length>=t.anomalyCapacity&&s.shift();let _t=i.slice(-7);it&&(_t.length===0||_t[_t.length-1]!==it)&&(_t=[..._t.slice(-6),it]),s.push({kind:D,t:Rn(L),tick:F,ms:Math.round(H),detail:Y,ctx:_t}),D==="dirJump"?o.dirJumps++:D==="aimDrop"?o.aimDrops++:D==="moveFreeze"?o.freezes++:D==="stickLost"?o.stickLosts++:D==="stickJump"?o.stickJumps++:D==="stickBad"?o.stickBads++:D==="stickDrift"&&o.stickDrifts++}function C(D,L,F,H){a.length>=t.eventCapacity&&a.shift(),a.push({t:Rn(F),tick:H,k:D,d:L})}function z(D){switch(D.type){case"attack-start":o.attacks++;break;case"hit":o.hits++;break;case"player-hurt":o.hurts++;break;case"link-start":o.links++;break;case"link-hit":o.linkHits++;break;case"roll":o.rolls++;break;case"blink":o.blinks++;break;case"channel-start":o.channels++;break;case"projectile-fire":o.bolts++;break;case"ring-place":o.rings++;break;case"charge-start":o.bowCharges++;break;case"jumped":o.jumps++;break;case"reset":o.resets++;break;case"blocked":y=D.tick;break}}function N(){const D=o,L=D.wallMs/1e3,F=D.gestures,H=_t=>Object.entries(F).filter(([Lt])=>Lt.endsWith(`.${_t}`)).reduce((Lt,[,J])=>Lt+J,0),Y=[];if(Y.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),Y.push(`运行 ${L.toFixed(1)}s / ${D.frames} 帧 · ${D.fps.toFixed(1)}fps · 最大 ${D.dtMax.toFixed(0)}ms · 尖峰 ${D.spikes} · 步 ${D.steps}`),Y.push(`摇杆活跃 ${L>0?Math.round(D.stickActiveMs/1e3/L*100):0}% · 手势 按下 ${H("press")}（单击 ${H("tap")} / 双击 ${H("doubleTap")} / 拖拽 ${H("drag")} / 长按 ${H("longPress")} / 打断 ${H("cancel")} / 拖放 ${H("release")}）`),Y.push(`攻击 ${D.attacks}(中${D.hits}) · 受击 ${D.hurts} · 派生 ${D.links}(中${D.linkHits}) · 翻滚 ${D.rolls} 闪现 ${D.blinks} · 跳 ${D.jumps} · 复位 ${D.resets}`),Y.push(`法杖 引导${D.channels} 飞弹${D.bolts} 电环${D.rings} · 弓蓄力${D.bowCharges} · 当前武器 ${f||"-"}`),Y.push(`异常 ${D.dirJumps+D.aimDrops+D.freezes+D.stickLosts+D.stickJumps+D.stickBads+D.stickDrifts}（dir ${D.dirJumps} / aim ${D.aimDrops} / freeze ${D.freezes} / stick ${D.stickLosts} / stickJump ${D.stickJumps} / 坏指针 ${D.stickBads} / 坐标漂移 ${D.stickDrifts}） · 掉帧尖峰 ${D.spikes}`+(D.inTurns>0?` · 输入转向 ${D.inTurns} 次（最大 ${D.inTurnMax.toFixed(0)}°）`:"")),s.length>0)for(const _t of s.slice(-6)){Y.push(`· ${_t.kind} @t${_t.t.toFixed(2)} tick${_t.tick} ${_t.ms>0?`${_t.ms}ms `:""}${_t.detail}`);const Lt=_t.ctx.map(et=>String(et[rx])).join(" "),J=_t.ctx.map(et=>et[fc]===""||et[fc]==null?".":String(et[fc])).join(" ");if(Y.push(`  yaw ${Lt}`),Y.push(`  in  ${J}`),_t.kind==="stickJump"||_t.kind==="stickBad"||_t.kind==="stickLost"){const et=_t.ctx.map(q=>`${q[cx]},${q[lx]}`).join(" "),ht=_t.ctx.map(q=>`${q[hx]},${q[dx]}`).join(" ");Y.push(`  o   ${et}`),Y.push(`  p   ${ht}`)}}if(a.length>0){Y.push("最近事件：");for(const _t of a.slice(-12))Y.push(`  ${_t.t.toFixed(2)} ${_t.k} ${_t.d}`.trimEnd())}const it=o.screenFrames>0?`屏幕 screenX/Y（${o.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",mt=o.screenFrames>0&&o.clientFrames>0?` / client 回退 ${o.clientFrames} 帧`:"";return Y.push(`摇杆坐标源 ${it}${mt}`),Y.push(`UA ${e.ua}`),Y.join(`
`)}return{sample(D,L,F,H=0){o.frames++,L.stickHeld&&(L.stickScreenOk?o.screenFrames++:o.clientFrames++),o.steps+=H,o.wallMs+=F,F>o.dtMax&&(o.dtMax=F),o.fps=o.wallMs>0?o.frames*1e3/o.wallMs:0,o.simS=D.time;const Y=D.time;if(l<0&&(l=Y),E=Y,b=D.tick,!r)return;const it=D.character,mt=Math.hypot(L.stickX,L.stickY),_t=Math.hypot(it.velocity.x,it.velocity.z);f=D.combat.weapon;const Lt=ux(D,L),J=it.facing,ht=Math.hypot(L.intents.moveX,L.intents.moveZ)>.05?Math.atan2(L.intents.moveX,L.intents.moveZ):null;mt>.2&&(o.stickActiveMs+=F);const q=[Rn(Y),D.tick,Math.round(F*10)/10,Rn(L.stickX),Rn(L.stickY),Rn(L.stickRawX),Rn(L.stickRawY),L.stickHeld?1:0,L.source.slice(0,8),Rn(L.intents.moveX),Rn(L.intents.moveZ),Rn(it.position.x),Rn(it.position.z),Rn(it.velocity.x),Rn(it.velocity.z),ei(J),ei(it.bodyYaw),Lt,Rn(it.stride),ht===null?"":ei(ht),L.stickId===null?"":L.stickId,Math.round(L.stickOriginX),Math.round(L.stickOriginY),Math.round(L.stickPxX),Math.round(L.stickPxY),L.stickBad,Math.round(L.stickVpTop),Math.round(L.stickOriginSX),Math.round(L.stickOriginSY),Math.round(L.stickScreenX),Math.round(L.stickScreenY),L.stickScreenOk?1:0,Math.round(L.stickScale*100)/100];M(q);const K=Y*1e3<x;if(F>t.spikeMs&&!K&&Y-l>.6&&(o.spikes++,R("frameSpike",Y,D.tick,F,`dt ${F.toFixed(0)}ms fl=${Oa(Lt)}`,q)),h!==null&&!K){const zt=Math.abs(ei(Ls(J-h))),Ot=Math.abs(ei(Ls(it.moveYaw-u))),I=(d|Lt)&(Mr|br|Sr|wr)|Lt&Ys,A=ht===null?null:Math.abs(ei(Ls(J-ht))),j=ht===null||h===null?null:Math.abs(ei(Ls(h-ht))),ut=A!==null&&j!==null&&A<j-.5,Q=(d&Ys)!==0&&(Lt&Ys)===0&&ht===null,ct=A!==null&&(A<=12||ut);zt>t.aimDropDeg&&Q?R("aimDrop",Y,D.tick,0,`${zt.toFixed(0)}° @aim→none stick(${L.stickX.toFixed(2)},${L.stickY.toFixed(2)}) aim(${L.aimDX.toFixed(0)},${L.aimDY.toFixed(0)}) fl=${Oa(Lt)}`,q):zt>t.dirJumpDeg&&I===0&&!Q&&(ct?(o.inTurns++,zt>o.inTurnMax&&(o.inTurnMax=zt)):R("dirJump",Y,D.tick,0,`${zt.toFixed(0)}° res${A===null?" 无输入":`${A.toFixed(0)}°`} yaw ${ei(h)}→${ei(J)} in ${ht===null?".":ei(ht)}° mvΔ${Ot.toFixed(0)}° aim(${L.aimDX.toFixed(0)},${L.aimDY.toFixed(0)}) fl=${Oa(d)}→${Oa(Lt)}`,q))}const $=(Lt&(Mr|br|Sr|wr))!==0,Mt=D.tick-y<30;mt>.35&&_t<t.freezeSpeed&&!$&&!Mt?(g<0&&(g=Y),Y-g>=t.freezeMs/1e3&&Y>=_&&(R("moveFreeze",Y,D.tick,(Y-g)*1e3,`stick(${L.stickX.toFixed(2)},${L.stickY.toFixed(2)}) v${_t.toFixed(2)} ${L.source} fl=${Oa(Lt)}`,q),_=Y+1.5,g=-1)):g=-1,L.stickHeld?(mt>p&&(p=mt),p>.35&&mt<.06?(m<0&&(m=Y),Y-m>=t.stickLostMs/1e3&&(R("stickLost",Y,D.tick,(Y-m)*1e3,`raw(${L.stickRawX.toFixed(2)},${L.stickRawY.toFixed(2)}) peak ${p.toFixed(2)} fl=${Oa(Lt)}`,q),m=-1,p=0)):m=-1):(p=0,m=-1);const It=L.stickScale>.2&&L.stickScale<5?L.stickScale:1,Ct=L.stickScreenOk,Ut=Ct?L.stickScreenX/It:L.stickPxX,G=Ct?L.stickScreenY/It:L.stickPxY,re=Ct?L.stickOriginSX/It:L.stickOriginX,Ht=Ct?L.stickOriginSY/It:L.stickOriginY,Pt=Ut-re,gt=G-Ht;if(L.stickHeld&&L.stickId!==null){const zt=w;if(zt&&zt.held&&zt.id===L.stickId){const Ot=Math.hypot(zt.dx,zt.dy),I=Math.hypot(Pt,gt),A=Math.max(Ot,I),j=Math.hypot(Ut-zt.cx,G-zt.cy),ut=Math.abs(ei(Ls(Math.atan2(gt,Pt)-Math.atan2(zt.dy,zt.dx)))),Q=A*ut*Math.PI/180,ct=Math.hypot(re-zt.ox,Ht-zt.oy);if(A>18&&ut>35&&j<Math.max(5,Q*.35)&&R("stickJump",Y,D.tick,0,`Δ${ut.toFixed(0)}° 手指只动${j.toFixed(0)}px(弧长应${Q.toFixed(0)}px) o(${Math.round(zt.ox)},${Math.round(zt.oy)})→(${Math.round(re)},${Math.round(Ht)}) 原点位移${ct.toFixed(0)}px p(${Math.round(Ut)},${Math.round(G)}) raw(${Math.round(Pt)},${Math.round(gt)}) id${L.stickId} ${Ct?"src=屏幕":"src=client"}`,q),Ct&&zt.screenOk){const kt=Math.hypot(L.stickPxX-zt.x,L.stickPxY-zt.y),tt=Math.hypot((L.stickScreenX-zt.sx)/It,(L.stickScreenY-zt.sy)/It);S+=kt-tt,Math.abs(S)>20&&(R("stickDrift",Y,D.tick,0,`client 相对屏幕漂移 ${S>0?"+":""}${S.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(L.stickPxX)},${Math.round(L.stickPxY)}) screen(${Math.round(L.stickScreenX)},${Math.round(L.stickScreenY)})`,q),S=0)}}w={id:L.stickId,ox:re,oy:Ht,cx:Ut,cy:G,x:L.stickPxX,y:L.stickPxY,sx:L.stickScreenX,sy:L.stickScreenY,dx:Pt,dy:gt,held:!0,screenOk:Ct}}else w=null,S=0;if(L.stickBad>T){const zt=L.stickBad-T;R("stickBad",Y,D.tick,0,`拦截 ${zt} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${L.stickBad}）o(${Math.round(L.stickOriginX)},${Math.round(L.stickOriginY)}) p(${Math.round(L.stickPxX)},${Math.round(L.stickPxY)}) id${L.stickId??"-"}`,q)}T=L.stickBad,h=J,u=it.moveYaw,d=Lt},event(D,L){const F=fx(D);z(D),r&&(D.type==="dash-ready"||D.type==="combo-reset"||D.type==="stepUp"||C(D.type,F,L,D.tick))},gesture(D){const L=`${D.button}.${D.kind}`;o.gestures[L]=(o.gestures[L]??0)+1,r&&(D.kind==="longPress"||D.kind==="doubleTap"||D.kind==="drag"||D.kind==="cancel")&&C(`g:${D.kind}`,`${D.button} ${D.heldMs.toFixed(0)}ms d${D.distance.toFixed(0)}px ${D.angleDeg.toFixed(0)}°`,E,b)},suspend(D){x=E*1e3+D,g=-1,m=-1},setEnabled(D){r=D,D||(h=null,w=null,g=-1,m=-1)},clear(){i.length=0,a.length=0,s.length=0,v={},c=-1e9,h=null,d=0,g=-1,m=-1,p=0,o.frames=0,o.wallMs=0,o.dtMax=0,o.spikes=0,o.stickActiveMs=0,o.attacks=0,o.hits=0,o.hurts=0,o.links=0,o.linkHits=0,o.rolls=0,o.blinks=0,o.channels=0,o.bolts=0,o.rings=0,o.bowCharges=0,o.jumps=0,o.resets=0,o.dirJumps=0,o.aimDrops=0,o.inTurns=0,o.inTurnMax=0,o.freezes=0,o.stickLosts=0,o.stickJumps=0,o.stickBads=0,o.stickDrifts=0,o.screenFrames=0,o.clientFrames=0,S=0,w=null,T=0;for(const D of Object.keys(o.gestures))delete o.gestures[D]},status(){const D=o.simS,L=s.some(F=>D-F.t<8&&(F.kind==="dirJump"||F.kind==="aimDrop"||F.kind==="moveFreeze"||F.kind==="stickLost"||F.kind==="stickJump"||F.kind==="stickBad"||F.kind==="stickDrift"));return{durationS:o.wallMs/1e3,frames:o.frames,events:a.length,anomalies:s.length,alert:L,enabled:r}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...o,gestures:{...o.gestures}},columns:sx,samples:i.slice(),events:a.slice(),anomalies:s.slice()}},summary:N}}const mx={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,skillDecel:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:0},worldBounds:{minX:-15.5,maxX:15.5,minZ:-15.5,maxZ:15.5},orientation:{bodyTurnRate:7,headTurnRate:12,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},turnInPlace:{enabled:!0,triggerDeg:50,settleDeg:8,durationSec:.45,idleSpeedRatio:.05,inputDeadZone:.12,lookRange:0,armSec:.03,gazeTriggerDeg:120},combat:{comboWindow:.65,settle:.16,attackMoveScale:.3,lungeMoveScale:.08,lungeCurve:1.2,lungeMaxSpeed:17,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3,hitWindow:{start:0,end:.85},comboWindow:.62,notifies:[{at:"windup",u:.7,name:"blade-air",value:.5},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.35,name:"foot-step",value:.6}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,148],[.2,125],[.4,68],[.6,-16],[.8,-78]]},2:{pts:[[0,-77],[.2,-68],[.4,-4],[.6,67],[.8,120]]},3:{stabU:.42}}}},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3,hitWindow:{start:0,end:.9},comboWindow:.5,notifies:[{at:"windup",u:.5,name:"blade-air",value:.45},{at:"active",u:0,name:"blade-air",value:1},{at:"active",u:.6,name:"blade-air",value:.7},{at:"recovery",u:.3,name:"foot-step",value:.5}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,151],[.2,137],[.4,62],[.6,-46],[.8,-128]]},2:{pts:[[0,-3],[.2,7],[.4,57],[.6,105],[.8,135]]},3:{pts:[[0,-150],[.2,-100],[.4,-40],[.6,1],[.8,36]]}}}},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3,hitWindow:{start:0,end:.8},comboWindow:.78,notifies:[{at:"windup",u:.85,name:"blade-air",value:.8},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.45,name:"foot-step",value:1}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,152],[.2,114],[.4,15],[.6,-65],[.8,-120]]},2:{pts:[[0,-124],[.2,-81],[.4,22],[.6,92],[.8,141]]},3:{pts:[[0,90],[.2,39],[.4,8],[.6,4],[.8,7]]}}},groundSlam:{slamU:.6,radius:2.4,knockback:.9,type:"knock",onlyUnhit:!0,holdMul:1.7}},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:.85,minChargeToFire:.15,chargeMoveMultiplier:.55,autoFire:!0,release:{windup:.04,active:.12,recovery:.26,lunge:0},trajectory:{speedMin:9,speedMax:16,launchPitchDeg:3.5,gravity:9,maxLife:2.4,radius:.2,stickMinPitchDeg:50,groundStickLift:.32,stickSec:4,homingRange:14,homingConeDeg:30,turnRateDeg:90,homingTime:.9,aimHeightRatio:.7,verticalTurnRate:18}}},abilities:{arcane:{perWave:3,waves:5,waveInterval:.2,spreadDeg:8,spreadTime:.22,spawnDelay:.035,spawnSideStep:.2,speedJitter:.12,homingRange:8,homingConeDeg:40,turnRateDeg:300,homingTime:1.1,retargetInterval:.25,cooldown:1,speed:10,life:1.4,radius:.3,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.6},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},skills:[{id:"arcane",kind:"channelVolley",slot:"attack",weapon:"staff",paramsRef:"arcane",enabled:!0},{id:"ring",kind:"groundRing",slot:"skill2",weapon:"staff",paramsRef:"ring",enabled:!0}],targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!1,dummyKnockback:.18,hitstop:{light:.045,heavy:.07,knock:.1},hitstopByWeapon:{"sword-shield":1,"dual-swords":.85,greatsword:1.3,staff:1.1,bow:.9},hitstopWarp:{enabled:!0,holdRate:.05,release:.055,payback:1.5,paybackBudget:.6},hitstopComboFalloff:[1,.85,.72]},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5,spar:1.2},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},gaze:{enabled:!0,headLookLimitDeg:55,headGazeRange:7,threatRange:8,recoveryDist:3.5,maxThreats:3,bodyTurnRate:3.2,headTurnRate:8,maxHeadSpeedDeg:300,maxBodySpeedDeg:130,headReturnRate:3.5,headReturnSpeedDeg:120,aimHeightRatio:.75,eyeHeightRatio:.78,headPitchRate:7,maxHeadPitchDeg:28,bodyPitchScale:.3,bodyPitchRate:4,enterThreshold:.05,reactToAttack:!0,reactToApproach:!0,approachDist:2.5,hurtHoldSec:2,hostileModeWeight:.6,spreadFalloff:1.5,behindFalloff:.35,behindAngleDeg:100,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5,spar:1.2},attackBoost:.6,nearDistance:1.5,saturation:2.6},dummies:{count:6,spawn:[{x:-11.1,z:-8.35},{x:-9.5,z:-8.35},{x:-7.9,z:-8.35},{x:0,z:-10.2},{x:-9.5,z:0},{x:-9.5,z:7.2}],initialModes:["idle","keep-distance","attack","attack","follow","idle"],leashRadius:2.4,radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,strafePeriod:5.2,strafeDuty:.34,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4,fighters:{weapons:["sword-shield","dual-swords","greatsword"],spawn:[{x:-3.6,z:3.8},{x:3.9,z:3.6},{x:.2,z:5.9}],initialModes:["spar","spar","spar"],moveSpeed:2.1,attackInterval:3.4,attackRangeScale:.9,knockbackScale:.6,leashRadius:7,comboCount:0,comboGap:0}}},gx={ground:{size:32,thickness:.4},steps:[{id:"stair-1",x:6.6,z:-5.6,width:2.4,depth:.9,height:.2},{id:"stair-2",x:6.6,z:-6.5,width:2.4,depth:.9,height:.4},{id:"stair-3",x:6.6,z:-7.4,width:2.4,depth:.9,height:.6},{id:"stair-4",x:6.6,z:-8.3,width:2.4,depth:.9,height:.8},{id:"plateau",x:6.6,z:-9.6,width:2.4,depth:1.6,height:.8},{id:"block-060",x:11.4,z:-6,width:1.4,depth:1.4,height:.6},{id:"block-090",x:11.4,z:-7.9,width:1.4,depth:1.4,height:.9},{id:"block-120",x:11.4,z:-9.8,width:1.4,depth:1.4,height:1.2}],doorways:[{id:"gate-wide",x:6.6,z:-4.3,openingWidth:2.4,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2},{id:"gate-narrow",x:11.4,z:-4.3,openingWidth:.5,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2}],obstacles:[{id:"crate-hub",x:2.5,z:-2.5,width:1.1,depth:1.1,height:.8},{id:"pillar-sw",x:-14.3,z:12.8,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-16,maxX:16,minZ:-16,maxZ:16},stations:[{id:"hub",index:1,name:"中央 8 向",hint:"推杆走 8 个方向 · 松手看停步收相 / 转身踏步",shape:"circle",x:0,z:0,radius:3.6,spawnX:0,spawnZ:0,labelX:0,labelZ:-3.1,color:"#8fe7ff"},{id:"rings",index:2,name:"环状态色阶",hint:"同距三假人：中立蓝 / 戒备黄 / 敌对红 · 点选看 3/4 环",shape:"circle",x:-9.5,z:-8.2,radius:3.4,spawnX:-9.5,spawnZ:-5.2,labelX:-9.5,labelZ:-10.9,color:"#ffc85a"},{id:"windup",index:3,name:"起手预警",hint:"走进 1.6m：脚下红弧填满 = 命中帧",shape:"circle",x:0,z:-10,radius:3.2,spawnX:0,spawnZ:-7,labelX:0,labelZ:-12.6,color:"#ff5a4a"},{id:"terrain",index:4,name:"地形 / 门洞",hint:"宽门 2.4m / 窄门 0.5m · 0.2m 台阶可走，0.6/0.9/1.2m 要跳",shape:"square",x:8.9,z:-7.4,radius:5.2,spawnX:8.9,spawnZ:-2.8,labelX:8.9,labelZ:-11.9,color:"#7fb8d8"},{id:"meter",index:5,name:"进度弧",hint:"弓长按 = 黄弧 · 法杖技2 = 紫弧 · 冲刺后 = 青弧冷却",shape:"circle",x:-9.5,z:8.6,radius:3.2,spawnX:-9.5,spawnZ:11.4,labelX:-9.5,labelZ:9.9,color:"#b48cff"},{id:"dash",index:6,name:"冲刺标尺",hint:"沿刻度跑：翻滚 3.2m / 闪现 5m，看落点差多少",shape:"square",x:9.8,z:8.2,radius:5.2,spawnX:9.8,spawnZ:12.8,labelX:7,labelZ:4.2,color:"#bfe8ff"},{id:"gait",index:7,name:"侧后方步态",hint:"面向假人贴到 1.2m，沿引线按 90 / 135 / 180 走",shape:"circle",x:-9.5,z:0,radius:3.2,spawnX:-9.5,spawnZ:2.6,labelX:-9.5,labelZ:-2.5,color:"#6fc9a0"}]},xx={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:28,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.42},bodyTypes:{standard:{name:"标准",height:1.2,radius:.3},tall:{name:"瘦高",height:1.32,radius:.26,voxel:{headSize:.36,bodyWidth:.34,bodyHeight:.28,limbThickness:.1,legLength:.68,armLength:.5},colors:{body:"#58b39a",head:"#ffe0b2",limb:"#3f8f7c",shoe:"#24443c"}}},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.6,chestYawMaxDeg:40,stopYawBlendMode:"inStop",stopYawAfterSec:.3,turnStepEnabled:!0,turnStepPitch:.5,turnStepKnee:.35,turnStepDip:.02,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1,backStrafeStartDeg:100,backStrafeFullDeg:132},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14,moveTakeover:{speed:.35,full:1.2,windup:.55,recovery:1,settle:1}},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13},stretch:{enabled:!0,swingArm:1.45,chargeArm:.88,runLeg:1,torsoGain:.5,impactSquash:.2,impactDecay:11,volumeExp:.5,smoothing:30},swing:{enabled:!0,bodyScale:1,shoulderLift:.055,shoulderPush:.045,shoulderIn:.032,segBlend:.1,segBlendMin:.03,segBlendRef:6,segBlendMax:.14,weaponScale:{greatsword:1,"sword-shield":.78,"dual-swords":.9},combo:{greatsword:["gs.right-left","gs.left-right","gs.overhead"],"sword-shield":["gs.right-left","gs.left-right","ss.shield-bash"],"dual-swords":["ds.right-left","ds.left-right","ds.spin"]},clips:{"gs.right-left":{kind:"right-left",note:"段 1：从右后方扫到左后方。rootYaw 整体带转 ±0.55 rad（≈31°）叠在腰椎 ±60° 上，大剑刃尖水平扫角约 210°",keys:[{t:0,ease:"in",pose:{bodyYaw:1.05,bodyPitch:-.14,bodyRoll:-.18,pelvisX:.06,pelvisZ:-.07,armPitch:-1.15,armYaw:.4,armRoll:.2,elbow:-.5,rootYaw:.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.08,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:0,armRoll:.04,elbow:-.3,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.15,bodyPitch:.16,bodyRoll:.2,pelvisX:-.07,pelvisZ:.11,armPitch:-1.5,armYaw:-.4,armRoll:-.14,elbow:-.12,rootYaw:-.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:-1.55}}]},"gs.left-right":{kind:"left-right",note:"段 2：承接段 1 左后方收势，整体带转 −0.55→+0.55 rad 反向拧回右后方，剑身仍水平",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-.4,armRoll:-.16,elbow:-.5,rootYaw:-.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:0,armRoll:.02,elbow:-.32,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:.4,armRoll:.16,elbow:-.12,rootYaw:.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:1.55}}]},"gs.overhead":{kind:"overhead",note:"段 3：举过头顶（剑身 75° 朝上）向前下劈到 −31°，躯干后仰 → 前压",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.32,bodyRoll:-.05,pelvisX:0,pelvisZ:-.07,armPitch:-1.9,armYaw:-.3,armRoll:.16,elbow:-.55,bladePitch:1.62,bladeTwist:0}},{t:.55,pose:{bodyYaw:.06,bodyPitch:.1,bodyRoll:0,pelvisX:0,pelvisZ:.03,armPitch:-1.1,armYaw:-.26,armRoll:.08,elbow:-.3,bladePitch:.55,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.55,bodyRoll:.02,pelvisX:0,pelvisZ:.13,armPitch:-.15,armYaw:-.2,armRoll:0,elbow:-.1,bladePitch:-.75,bladeTwist:0}}]},"ds.right-left":{kind:"right-left",note:"双持段 1：右手横扫到左后方，左手同时向左后方收（后摆 + 屈肘），两把剑都保持水平",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:1,bodyPitch:-.12,bodyRoll:-.16,pelvisX:.05,pelvisZ:-.06,armPitch:-1.15,armYaw:.9,armRoll:.18,elbow:-.45,armLPitch:.5,armLYaw:-1,armLRoll:.12,elbowL:-1.15,rootYaw:.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.06,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:-.1,armRoll:.04,elbow:-.3,armLPitch:.6,armLYaw:-1,armLRoll:.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.1,bodyPitch:.14,bodyRoll:.18,pelvisX:-.06,pelvisZ:.1,armPitch:-1.5,armYaw:-1.4,armRoll:-.12,elbow:-.12,armLPitch:.65,armLYaw:-.9,armLRoll:.18,elbowL:-1.3,rootYaw:-.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.55}}]},"ds.left-right":{kind:"left-right",note:"双持段 2：左手横扫回右后方，右手同时向右后方收（段 1 的镜像，主挥换到左手）",lead:"L",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-1.4,armRoll:-.16,elbow:-.5,armLPitch:.5,armLYaw:1,armLRoll:-.12,elbowL:-1.15,rootYaw:-.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:-.1,armRoll:.02,elbow:-.32,armLPitch:.6,armLYaw:.9,armLRoll:-.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:1.4,armRoll:.16,elbow:-.12,armLPitch:.65,armLYaw:.8,armLRoll:-.18,elbowL:-1.3,rootYaw:.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:1.55}}]},"ds.spin":{kind:"spin",note:"双持段 3：双剑水平展开（主副手 roll 外张到 ±1.15），整个人原地转一整圈。spin 按 attackProgress 单调推进到 2π≡0，收招自动回正",lead:"R",spin:{turns:1,ease:"inOut",span:.6},keys:[{t:0,ease:"in",pose:{bodyYaw:.1,bodyPitch:-.14,bodyRoll:0,pelvisX:0,pelvisZ:-.05,armPitch:-1.1,armYaw:1.7,armRoll:.3,elbow:-.5,armLPitch:-1.1,armLYaw:0,armLRoll:-.3,elbowL:-.5,bladePitch:.05,bladePitchOff:.05,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:.5,pose:{bodyYaw:0,bodyPitch:.04,bodyRoll:0,pelvisX:0,pelvisZ:.04,armPitch:-1.55,armYaw:2.1,armRoll:.45,elbow:-.05,armLPitch:-1.55,armLYaw:.3,armLRoll:-.45,elbowL:-.05,bladePitch:0,bladePitchOff:0,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:1,pose:{bodyYaw:-.1,bodyPitch:.12,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:-1.3,armYaw:1.9,armRoll:.4,elbow:-.25,armLPitch:-1.3,armLYaw:-.05,armLRoll:-.4,elbowL:-.25,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.35,bladeTwistOff:1.35}}]},"ss.shield-bash":{kind:"bash",note:"剑盾段 3：收盾蓄力 → 左臂持盾猛前顶（臂前伸 + 肘伸直 + 身体前压 + 骨盆前冲）。bladePitchOff 反解让盾面始终正对前方",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.28,bodyRoll:-.04,pelvisX:.01,pelvisZ:-.08,armPitch:.1,armYaw:-.2,armRoll:.1,elbow:-.7,armLPitch:-.7,armLYaw:.1,armLRoll:.15,elbowL:-.9,bladePitch:.2,bladePitchOff:.1,bladeTwist:0}},{t:.55,pose:{bodyYaw:.04,bodyPitch:.15,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:.2,armYaw:-.15,armRoll:.05,elbow:-.6,armLPitch:-1.1,armLYaw:.05,armLRoll:.1,elbowL:-.45,bladePitch:.1,bladePitchOff:.02,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.5,bodyRoll:.02,pelvisX:0,pelvisZ:.18,armPitch:.25,armYaw:-.1,armRoll:0,elbow:-.5,armLPitch:-1.55,armLYaw:0,armLRoll:.05,elbowL:-.05,bladePitch:.05,bladePitchOff:0,bladeTwist:0}}]}},poseIn:.1,poseOut:.16},stance:{"sword-shield":{armSwing:.85,armR:{pitch:-.12,roll:.1,elbow:-.15},armL:{pitch:-.45,roll:.1,elbow:-.75},torsoYaw:.12,bladePitchDeg:-8,blend:.22},"dual-swords":{armSwing:1,armR:{pitch:-.15,roll:.16,elbow:-.45},armL:{pitch:-.15,roll:-.16,elbow:-.45},torsoYaw:0,bladePitchDeg:-12,bladePitchOffDeg:-8,blend:.22},greatsword:{armSwing:.45,armR:{pitch:-.3,roll:.05,elbow:-.55},armL:{pitch:-.2,roll:-.1,elbow:-.65},torsoPitch:.04,bladePitchDeg:-30,blend:.26},staff:{armSwing:.6,armR:{pitch:-.1,roll:.06,elbow:-.35},armL:{pitch:.02,roll:-.08,elbow:-.15},torsoYaw:.06,blend:.22},bow:{armSwing:.55,armL:{pitch:-.15,roll:-.1,elbow:-.2},armR:{pitch:.02,elbow:-.25},torsoYaw:-.08,blend:.22}},spine:{enabled:!0,waist:.58,chest:.42,neck:.16,chestPivot:.42}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6,twoHandInsetX:.15,twoHandGripY:-.1,twoHandMaxStretch:1.3,twoHandMinGrip:.62,twoHandGripStart:1.02,twoHandSlideRate:9,swordCantDeg:10,greatswordCantDeg:0},weaponWrist:{enabled:!0,lag:.042,maxAngle:.72,rate:24,twistLag:.03,maxTwist:.5,runDrag:.11},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},groundRing:{playerRadiusFactor:2.3,dummyRadiusFactor:2.05,thicknessFactor:.16,arcDeg:180,selectedArcDeg:270,opacity:.22,playerOpacity:.44,selectedOpacity:.62,selectedScale:1.06,selectedThicknessScale:1.6,edgeFade:.2,playerColor:"#8fe7ff",neutralColor:"#7fb8d8",lowThreatColor:"#ffc85a",highThreatColor:"#ff3b30",haloRadiusFactor:1.16,haloThicknessFactor:2.6,haloOpacity:.14,haloFadeInSec:.05,haloFadeOutSec:.36,meterRadiusFactor:1.34,meterThicknessFactor:.52,meterOpacity:.9,meterColorCharge:"#ffd166",meterColorChannel:"#b48cff",meterColorCooldown:"#7fb8d8",warnRadiusFactor:1.14,warnThicknessFactor:1.5,warnOpacity:.9,warnColor:"#ff5a4a",areaOpacity:.5,landingOpacity:.55,areaExpandSec:.22},projectiles:{arrowColor:"#ffe3a6",arrowHeadColor:"#fff6d8",arrowTrailColor:"#ffcf86",arrowLength:.72,arrowWidth:.062,arrowHeadSize:.16,arrowGlowSize:.5,trailLength:1.05,trailOpacity:.42,boltColor:"#a9ecff",boltGlowColor:"#7fe3ff",boltShapeX:.42,boltShapeY:.42,boltShapeZ:.85,boltGlowScale:1.6,boltTrailScale:2.2,slashEnabled:!1,slashThickness:.075,slashGlowOpacity:.34},weaponTrail:{enabled:!0,maxSamples:30,minStep:.015,life:.11,minSpeed:5.5,color:"#8fd0ff",intensity:.42,tipBoost:.35,pulseDecay:14},hitstop:{enabled:!0,duration:.07},lab:{enabled:!0,showLabels:!0,padOpacity:.55,labelTextHeight:.82},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],attackArcColor:"#ff6b5e",fighterColors:[{body:"#c85a4a",limb:"#8d3a30",head:"#f0c9a0"},{body:"#c9a03c",limb:"#8a6b22",head:"#f0d6a0"},{body:"#7d6ec4",limb:"#4f4488",head:"#e6d2b0"}]},balance:{enabled:!0,reactionTime:.18,gravity:9.81,autoCounter:!0,maxShift:.045,counterRate:8,predLead:.12,counterBoost:1.6},renderInterp:{enabled:!0,yawSmoothMs:35},groundSlam:{enabled:!0,color:"#e8d8b0",duration:.42,delay:.09,outerScale:1.25,shake:.95}},vx={core:mx,scene:gx,view:xx};function gh(n){return JSON.parse(JSON.stringify(n))}const xh=vx,yx=gh(xh.core),Eo=gh(xh.scene),hn=gh(xh.view);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class vi{constructor(t,e,i,a,s="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(s),this.domElement.classList.add("controller"),this.domElement.classList.add(a),this.$name=document.createElement("div"),this.$name.classList.add("name"),vi.nextNameID=vi.nextNameID||0,this.$name.id=`lil-gui-name-${++vi.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class _x extends vi{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function pl(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const Mx={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:pl,toHexString:pl},eo={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},bx={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=eo.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return eo.toHexString(a)}},Sx={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=eo.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return eo.toHexString(a)}},wx=[Mx,eo,bx,Sx];function Ex(n){return wx.find(t=>t.match(n))}class Tx extends vi{constructor(t,e,i,a){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=Ex(this.initialValue),this._rgbScale=a,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const s=pl(this.$text.value);s&&this._setValueFromHexString(s)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class mc extends vi{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",a=>{a.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class Ax extends vi{constructor(t,e,i,a,s,o){super(t,e,i,"number"),this._initInput(),this.min(a),this.max(s);const r=o!==void 0;this.step(r?o:this._getImplicitStep(),r),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let y=parseFloat(this.$input.value);isNaN(y)||(this._stepExplicit&&(y=this._snap(y)),this.setValue(this._clamp(y)))},i=y=>{const x=parseFloat(this.$input.value);isNaN(x)||(this._snapClampSetValue(x+y),this.$input.value=this.getValue())},a=y=>{y.key==="Enter"&&this.$input.blur(),y.code==="ArrowUp"&&(y.preventDefault(),i(this._step*this._arrowKeyMultiplier(y))),y.code==="ArrowDown"&&(y.preventDefault(),i(this._step*this._arrowKeyMultiplier(y)*-1))},s=y=>{this._inputFocused&&(y.preventDefault(),i(this._step*this._normalizeMouseWheel(y)))};let o=!1,r,l,c,h,u;const d=5,f=y=>{r=y.clientX,l=c=y.clientY,o=!0,h=this.getValue(),u=0,window.addEventListener("mousemove",g),window.addEventListener("mouseup",_)},g=y=>{if(o){const x=y.clientX-r,v=y.clientY-l;Math.abs(v)>d?(y.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(x)>d&&_()}if(!o){const x=y.clientY-c;u-=x*this._step*this._arrowKeyMultiplier(y),h+u>this._max?u=this._max-h:h+u<this._min&&(u=this._min-h),this._snapClampSetValue(h+u)}c=y.clientY},_=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",_)},m=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",a),this.$input.addEventListener("wheel",s,{passive:!1}),this.$input.addEventListener("mousedown",f),this.$input.addEventListener("focus",m),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,y,x,v,w)=>(p-y)/(x-y)*(w-v)+v,e=p=>{const y=this.$slider.getBoundingClientRect();let x=t(p,y.left,y.right,this._min,this._max);this._snapClampSetValue(x)},i=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",a),window.addEventListener("mouseup",s)},a=p=>{e(p.clientX)},s=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",a),window.removeEventListener("mouseup",s)};let o=!1,r,l;const c=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),o=!1},h=p=>{p.touches.length>1||(this._hasScrollBar?(r=p.touches[0].clientX,l=p.touches[0].clientY,o=!0):c(p),window.addEventListener("touchmove",u,{passive:!1}),window.addEventListener("touchend",d))},u=p=>{if(o){const y=p.touches[0].clientX-r,x=p.touches[0].clientY-l;Math.abs(y)>Math.abs(x)?c(p):(window.removeEventListener("touchmove",u),window.removeEventListener("touchend",d))}else p.preventDefault(),e(p.touches[0].clientX)},d=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",u),window.removeEventListener("touchend",d)},f=this._callOnFinishChange.bind(this),g=400;let _;const m=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const x=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+x),this.$input.value=this.getValue(),clearTimeout(_),_=setTimeout(f,g)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",m,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class Rx extends vi{constructor(t,e,i,a){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(a)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class Px extends vi{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",a=>{a.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const Cx=`.lil-gui {
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
}`;function Lx(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let Bd=!1;class Er{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:a,title:s="Controls",closeFolders:o=!1,injectStyles:r=!0,touchStyles:l=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",c=>{(c.code==="Enter"||c.code==="Space")&&(c.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(s),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),l&&this.domElement.classList.add("allow-touch-styles"),!Bd&&r&&(Lx(Cx),Bd=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),a&&this.domElement.style.setProperty("--width",a+"px"),this._closeFolders=o}add(t,e,i,a,s){if(Object(i)===i)return new Rx(this,t,e,i);const o=t[e];switch(typeof o){case"number":return new Ax(this,t,e,i,a,s);case"boolean":return new _x(this,t,e);case"string":return new Px(this,t,e);case"function":return new mc(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,i=1){return new Tx(this,t,e,i)}addFolder(t){const e=new Er({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof mc||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof mc)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=s=>{s.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const a=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=a+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function Dx(n,t,e,i){const a=document.getElementById("debug-panel"),s=a?new Er({title:"实验台 · 调试面板",autoPlace:!1,container:a}):new Er({title:"实验台 · 调试面板"}),o=n.config,r=[],l=[],c=dt=>{const Nt=s.addFolder(dt);return l.push(Nt),Nt},h=(dt,Nt)=>{const at=dt.addFolder(Nt);return r.push(at),at},u=c("模拟 / 显示");u.add(e,"timeScale",0,3,.05).name("时间缩放"),u.add(e,"paused").name("暂停"),u.add({step:i.singleStep},"step").name("单步 (1 tick)"),u.add({reset:i.reset},"reset").name("复位全部"),u.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),u.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid),u.add(e,"showLab").name("工位地面盘").onChange(i.onToggleLab),u.add(e,"showLabLabels").name("工位标牌").onChange(i.onToggleLabLabels);const d=h(u,"模块开关");d.add(n.modules,"movement").name("movement"),d.add(n.modules,"combat").name("combat"),d.add(n.modules,"links").name("links"),d.add(n.modules,"orientation").name("orientation"),d.add(n.modules,"turnInPlace").name("turnInPlace"),d.add(n.modules,"targeting").name("targeting"),d.add(n.modules,"hits").name("hits"),d.add(n.modules,"separation").name("separation"),d.add(n.modules,"dash").name("dash"),d.add(n.modules,"camera").name("camera"),d.add(n.modules,"dummies").name("dummies"),d.add(n.modules,"abilities").name("abilities");const f=c("移动 / 输入"),g=h(f,"基础移动参数");g.add(o,"moveSpeed",1,10,.1).name("移动速度"),g.add(o,"sprintMultiplier",1,3,.05).name("冲刺倍率"),g.add(o,"acceleration",1,40,.5).name("加速度"),g.add(o,"friction",1,40,.5).name("摩擦"),g.add(o,"skillDecel",2,40,.5).name("进入技能时的减速速率"),g.add(o,"gravity",5,60,.5).name("重力"),g.add(o,"jumpSpeed",2,16,.2).name("起跳速度"),g.add(o,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),g.add(o,"characterRadius",.1,.8,.01).name("角色半径"),g.add(o,"characterHeight",.6,2.2,.05).name("角色身高"),g.add(o,"strideLength",.3,3,.05).name("基础步幅"),g.add(o,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),g.add(o,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const _=h(f,"摇杆 / 输入");_.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),_.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const m=o.dash,p=h(f,"冲刺 / 闪避");p.add(m,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),p.add(m,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),p.add(m,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),p.add(m,"blinkDistance",1,12,.25).name("闪现距离 (m)"),p.add(m,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),p.add(m,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),p.add(m,"blinkClearVelocity").name("闪现清空速度"),p.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),p.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const y=o.separation,x=h(f,"角色间分离 / 挤压阻力");x.add(y,"iterations",1,8,1).name("迭代次数"),x.add(y,"slop",0,.05,.002).name("额外分离量 (m)"),x.add(y.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),x.add(y.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),x.add(y.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const v=c("动作 / 步态"),w=h(v,"程序化步态");w.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),w.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),w.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),w.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),w.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),w.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),w.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),w.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),w.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),w.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),w.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),w.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),w.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),w.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)"),w.add(t.gait,"backStrafeStartDeg",20,170,1).name("侧后方起步角 (°)"),w.add(t.gait,"backStrafeFullDeg",40,180,1).name("完全后退角 (°)"),w.add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)");const S=h(v,"停步 / 收相 / 惯性");S.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),S.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),S.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),S.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),S.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),S.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),S.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),S.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),S.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),S.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),S.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),S.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const T=h(v,"足部 IK"),E=t.ik;T.add(E,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),T.add(E,"weight",0,1,.01).name("钉地权重"),T.add(E,"attackScale",0,1,.01).name("攻击时权重倍率"),T.add(E,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const b=h(v,"惯性倾斜 / 盆骨"),M=t.lean;b.add(M,"accelGain",0,.1,.002).name("前后加速度增益"),b.add(M,"turnGain",0,.2,.005).name("绕圈侧倾增益"),b.add(M,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),b.add(M,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),b.add(M,"smoothing",1,30,1).name("倾斜平滑速率"),b.add(M,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),b.add(M,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),b.add(M,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),b.add(M,"crouchSmoothing",1,30,1).name("下沉平滑速率");const R=o.orientation,C=h(v,"朝向 / 接敌注视 / 原地转身");C.add(R,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),C.add(R,"headTurnRate",.5,40,.5).name("头部转向速率"),C.add(R,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),C.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),C.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),C.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const z=o.gaze;C.add(z,"headReturnRate",.5,12,.1).name("无目标回正速率 (1/s)"),C.add(z,"headReturnSpeedDeg",20,400,10).name("回正角速度上限 (°/s)"),C.add(z,"bodyTurnRate",.2,12,.1).name("接敌身体转向速率"),C.add(z,"headTurnRate",.5,30,.5).name("接敌头部转向速率"),C.add(z,"maxHeadSpeedDeg",30,900,10).name("头部最大角速度 (°/s)"),C.add(z,"maxBodySpeedDeg",20,600,10).name("身体最大角速度 (°/s)"),C.add(z,"aimHeightRatio",.2,1,.05).name("注视点高度（身高比例）"),C.add(z,"headPitchRate",.5,20,.5).name("头部俯仰速率"),C.add(z,"maxHeadPitchDeg",0,60,1).name("头部俯仰限幅 (°)"),C.add(z,"bodyPitchScale",0,1,.05).name("身体俯仰比例"),C.add(z,"bodyPitchRate",.5,20,.5).name("身体俯仰速率");const N=o.turnInPlace;C.add(N,"enabled").name("启用原地转身 (关=纯插值)"),C.add(N,"triggerDeg",20,180,5).name("触发夹角 (°)"),C.add(N,"gazeTriggerDeg",20,180,5).name("接敌时触发夹角 (°)"),C.add(N,"settleDeg",0,60,1).name("转身保留余角 (°)"),C.add(N,"durationSec",.1,1.5,.02).name("转身时长 (s)"),C.add(N,"idleSpeedRatio",0,.3,.01).name("静止速度比上限"),C.add(N,"inputDeadZone",0,.5,.01).name("起步输入死区"),C.add(N,"armSec",0,.5,.01).name("触发防抖 (s)"),C.add(t.gait,"stopYawBlendMode",["inStop","afterStop"]).name("停步偏差消化窗口"),C.add(t.gait,"stopYawAfterSec",.05,1,.02).name("收相后消化时长 (s)"),C.add(t.gait,"turnStepEnabled").name("转身踏步 (关=滑过去)"),C.add(t.gait,"turnStepPitch",0,1.2,.02).name("踏步前迈 (rad)"),C.add(t.gait,"turnStepKnee",0,1,.02).name("踏步抬膝 (rad)"),C.add(t.gait,"turnStepDip",0,.1,.002).name("踏步重心下沉 (m)");const D=c("战斗 / 命中"),L=o.combat,F=h(D,"连击 / 武器时序"),H=F.add(n.combat,"weapon",ea).name("当前武器");F.add(L,"comboWindow",.1,2,.05).name("连击窗口 (s)"),F.add(L,"settle",0,.8,.01).name("段间停顿 (s)"),F.add(L,"attackMoveScale",0,1,.01).name("攻击时移动比例"),F.add(L,"lungeMoveScale",0,.4,.01).name("跨步时移动比例"),F.add(L,"lungeCurve",.2,4,.1).name("跨步曲线指数 (大=更冲)"),F.add(L,"lungeMaxSpeed",4,30,.5).name("跨步速度上限 (m/s)"),F.add(L,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),F.add(L,"cancelWindow",0,1,.01).name("取消窗口 (s)"),F.add(L,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),F.add(L,"autoCombo").name("按住自动连击"),F.add(L.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),F.add(L.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),F.add(L.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),F.add(L.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率"),F.add(L.bow,"maxChargeTime",.2,2,.05).name("满蓄力时间 (s)"),F.add(L.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),F.add(L.bow,"autoFire").name("蓄满自动放箭 (按住连射)"),F.add(L.bow.trajectory,"gravity",0,24,.5).name("箭矢重力 (m/s²)"),F.add(L.bow.trajectory,"speedMax",8,32,.5).name("满蓄初速 (m/s)"),F.add(L.bow.trajectory,"homingRange",0,30,1).name("自动瞄准距离 (m)"),F.add(L.bow.trajectory,"turnRateDeg",0,240,5).name("箭追踪转向 (°/s)"),F.add(L.bow.trajectory,"homingTime",0,2,.05).name("追踪时长 (s)"),F.add(L.bow.trajectory,"aimHeightRatio",0,1,.05).name("瞄准点高度");const Y=o.abilities;F.add(Y.arcane,"perWave",1,8,1).name("每波飞弹数"),F.add(Y.arcane,"waves",1,12,1).name("每次引导波数"),F.add(Y.arcane,"waveInterval",.05,.8,.01).name("波间隔 (s)"),F.add(Y.arcane,"spreadDeg",0,20,.5).name("波内散布 (度)"),F.add(Y.arcane,"spreadTime",0,.6,.01).name("出膛散开时长 (s)"),F.add(Y.arcane,"spawnDelay",0,.2,.005).name("波内出膛错落 (s)"),F.add(Y.arcane,"speedJitter",0,.5,.02).name("速度浮动比例"),F.add(Y.arcane,"turnRateDeg",0,420,10).name("制导转向 (度/秒)"),F.add(Y.arcane,"retargetInterval",.05,1,.05).name("重新索敌间隔 (s)"),F.add(Y.arcane,"cooldown",0,3,.05).name("引导结束冷却 (s)"),F.add(Y.arcane,"speed",3,24,.5).name("飞弹速度"),F.add(Y.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),F.add(Y.ring,"radius",.5,5,.1).name("电环半径"),F.add(Y.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),F.add(Y.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const it=o.hits.hitstopWarp;if(it){const dt=h(D,"卡肉节奏（接触瓦片）");dt.add(it,"enabled").name("瓦片开（关=硬冻结）"),dt.add(it,"holdRate",0,.4,.01).name("保持期速率"),dt.add(it,"release",.005,.2,.005).name("释放时长 (s)"),dt.add(it,"payback",1,2.5,.05).name("偿还倍率"),dt.add(o.hits.hitstop,"light",0,.2,.005).name("轻击保持 (s)"),dt.add(o.hits.hitstop,"heavy",0,.25,.005).name("重击保持 (s)"),dt.add(o.hits.hitstop,"knock",0,.3,.005).name("击飞保持 (s)")}const mt=o.hits,_t=h(D,"命中 / 受击 / 击退");_t.add(mt,"arcDeg",10,120,5).name("命中扇区半角 (°)"),_t.add(mt,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),_t.add(mt,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),_t.add(mt,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),_t.add(mt.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),_t.add(mt.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),_t.add(mt,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),_t.add(mt,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const Lt={get enabled(){return!mt.noDamageToPlayer},set enabled(dt){mt.noDamageToPlayer=!dt}};_t.add(Lt,"enabled").name("玩家受击击退");const J=h(D,"受击分层"),et=t.hurt;J.add(et,"enabled").name("启用分层受击 (关=旧版对照)"),J.add(et,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),J.add(et,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),J.add(et,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),J.add(et,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),J.add(et,"upperShiftScale",0,1,.01).name("上身位移缩放"),J.add(et,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),J.add(et.hitHeight,"light",0,1,.01).name("轻击命中部位"),J.add(et.hitHeight,"heavy",0,1,.01).name("重击命中部位"),J.add(et.hitHeight,"knock",0,1,.01).name("击退命中部位"),J.add(et,"leanLight",0,1.5,.01).name("轻击力度"),J.add(et,"leanHeavy",0,1.5,.01).name("重击力度"),J.add(et,"leanKnock",0,1.5,.01).name("击退力度"),J.add(et,"flashStrength",0,2,.05).name("受击闪光强度");for(const{name:dt,p:Nt}of[{name:"打腹 (abdomen)",p:et.abdomen},{name:"打肩 (shoulder)",p:et.shoulder}]){const at=h(J,dt);at.add(Nt,"upperPitch",0,2,.01).name("上身前后倾斜"),at.add(Nt,"upperRoll",0,2,.01).name("上身侧倾"),at.add(Nt,"upperYaw",0,1.5,.01).name("肩部扭转"),at.add(Nt,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),at.add(Nt,"shift",0,.8,.01).name("身体反应位移"),at.add(Nt,"drop",0,.4,.01).name("整体下沉"),at.add(Nt,"back",0,.4,.01).name("屁股向后"),at.add(Nt,"knee",0,1.6,.01).name("屈膝"),at.add(Nt,"hip",0,1,.01).name("髋前倾"),at.add(Nt,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)")}const ht=h(D,"派生招"),q=o.links;ht.add(q,"enabled").name("总开关 (false=旧连击)"),ht.add(q.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),ht.add(q.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),ht.add(q.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),ht.add(q,"sharedCooldown",0,3,.05).name("共享 CD (s)"),ht.add(q,"triggerWhileSprinting").name("长跑中可直接触发"),ht.add(q.search,"range",1,14,.1).name("索敌距离 (m)"),ht.add(q.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),ht.add(q.search,"stopDistance",0,3,.05).name("停住距离 (m)");const K=q.moves["sword-shield"];K&&(ht.add(K,"enabled").name("剑盾盾击"),ht.add(K,"distance",0,8,.1).name("冲锋极限 (m)"),ht.add(K,"windup",0,.5,.01).name("前摇 (s)"),ht.add(K,"active",0,.8,.01).name("冲锋 / 命中 (s)"),ht.add(K,"recovery",0,.8,.01).name("收势 (s)"),ht.add(K.hit,"radius",0,4,.05).name("命中半径 (m)"),ht.add(K.hit,"width",0,2,.05).name("扫掠半径 (m)"),ht.add(K.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),ht.add(K.hit,"duration",0,1.5,.01).name("僵直 (s)"));const $=o.targeting,Mt=h(D,"目标辅助");Mt.add($,"targetAssist").name("启用目标辅助"),Mt.add($,"range",1,14,.5).name("锁定范围 (m)"),Mt.add($,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),Mt.add($,"frontBias",0,4,.1).name("朝向加权"),Mt.add($,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),Mt.add($,"maxLungeScale",1,3,.1).name("前冲最大放大");const It=c("表现 / 特效"),Ct=h(It,"挥击幅度 / 刀光"),Ut=t.animation.swing;Ct.add(Ut,"enabled").name("挥击身体幅度 开"),Ct.add(Ut,"bodyScale",0,1.6,.05).name("躯干 / 骨盆幅度倍率"),Ct.add(Ut,"shoulderLift",0,.12,.005).name("肩部抬升上限 (m)"),Ct.add(Ut,"shoulderPush",0,.1,.005).name("肩部前送上限 (m)"),Ct.add(Ut,"shoulderIn",0,.1,.005).name("双手武器肩内收 (m)"),Ct.add(Ut,"segBlend",0,.35,.01).name("段间过渡兜底 (s)"),Ct.add(Ut,"segBlendMin",.008,.12,.004).name("段间过渡下限 (s)"),Ct.add(Ut,"segBlendRef",2,16,.5).name("段间过渡参考距离 (rad)"),Ct.add(Ut.weaponScale,"greatsword",0,1.6,.05).name("大剑幅度倍率");const G=t.weaponTrail;Ct.add(G,"enabled").name("挥击刀光 开"),Ct.add(G,"life",.04,.4,.01).name("刀光残留 (s)"),Ct.add(G,"intensity",0,1.5,.05).name("刀光亮度"),Ct.add(G,"minStep",.005,.1,.005).name("采样最小位移 (m)"),Ct.add(t.hitstop,"enabled").name("命中卡肉 / 震屏");const re=h(It,"夸张化 / 四肢伸缩"),Ht=t.animation.stretch;re.add(Ht,"enabled").name("四肢伸缩 开"),re.add(Ht,"swingArm",1,1.8,.01).name("挥出时手臂拉伸"),re.add(Ht,"chargeArm",.7,1,.01).name("蓄力时手臂压缩"),re.add(Ht,"impactSquash",0,.5,.01).name("命中挤压量"),re.add(Ht,"impactDecay",2,30,.5).name("挤压回弹速率 (1/s)"),re.add(Ht,"torsoGain",0,1,.05).name("躯干跟随比例"),re.add(Ht,"volumeExp",0,1.5,.05).name("体积补偿指数");const Pt=h(It,"武器握持 / 腕部"),gt=t.weaponWrist;Pt.add(gt,"enabled").name("腕部滞后 开（关掉=武器焊在手上）"),Pt.add(gt,"lag",0,.08,.002).name("臂速 → 腕滞后"),Pt.add(gt,"maxAngle",0,1.2,.02).name("腕滞后上限 (rad)"),Pt.add(gt,"rate",4,50,1).name("腕部跟随速率 (1/s)"),Pt.add(gt,"twistLag",0,.06,.002).name("躯干扭转 → 剑横甩"),Pt.add(gt,"maxTwist",0,.9,.02).name("横甩上限 (rad)");const zt=t.weaponMount;Pt.add(zt,"twoHandInsetX",0,.3,.01).name("双手武器内收 (m)"),Pt.add(zt,"twoHandGripY",-.5,0,.01).name("副握点在柄上的位置"),Pt.add(zt,"twoHandMaxStretch",1,1.8,.01).name("副手臂长拉伸上限"),Pt.add(zt,"twoHandMinGrip",0,1,.02).name("最低握持权重（1=永不松手）"),Pt.add(zt,"twoHandGripStart",1,1.4,.01).name("开始松手的臂展比"),Pt.add(zt,"twoHandSlideRate",0,30,1).name("握点滑柄跟随速率 (1/s)"),Pt.add(zt,"swordPitchDeg",0,90,1).name("剑前倾角"),Pt.add(zt,"swordYawDeg",0,45,1).name("剑外张角"),Pt.add(zt,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),Pt.add(zt,"staffPitchDeg",0,60,1).name("法杖前倾角");const Ot=c("假人 / 混战"),I=o.dummies,A=h(Ot,"普通假人 AI");A.add(I,"moveSpeed",.5,8,.1).name("移动速度"),A.add(I,"wanderRadius",.5,8,.1).name("游走半径"),A.add(I,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),A.add(I,"followStopDistance",.3,5,.1).name("跟随停距"),A.add(I,"keepDistance",1,10,.1).name("保持距离"),A.add(I,"keepDeadZone",.1,2,.05).name("保持死区"),A.add(I,"attackRange",.5,5,.1).name("攻击距离"),A.add(I,"attackInterval",.3,5,.1).name("攻击间隔 (s)"),A.add(I,"leashRadius",0,8,.1).name("牵引半径 (0=不限)");const j=I.fighters;if(j){const dt=h(Ot,"持械陪练（剑盾 / 双刀 / 大剑）");dt.add(j,"moveSpeed",.5,6,.1).name("移动速度"),dt.add(j,"attackInterval",.5,8,.1).name("攻击间隔 (s)"),dt.add(j,"attackRangeScale",.5,1.2,.02).name("起手距离 / 武器 reach"),dt.add(j,"knockbackScale",0,2,.05).name("击退比例"),dt.add(j,"leashRadius",0,14,.5).name("牵引半径 (m)"),dt.add(j,"comboCount",0,3,1).name("连击段数 (0=随武器)"),dt.add(j,"comboGap",0,.6,.01).name("段间缝隙 (s, 0=用全局)");const Nt=()=>n.dummies.find(bt=>bt.weapon!==null),at={get mode(){var bt;return((bt=Nt())==null?void 0:bt.mode)??"spar"},set mode(bt){i.setFighterMode(bt)}};dt.add(at,"mode",wf).name("陪练行为（全部）")}const ut=c("相机"),Q=h(ut,"基础");Q.add(t.camera,"pitchDeg",20,80,1).name("俯角"),Q.add(t.camera,"yawDeg",-180,180,1).name("方位角"),Q.add(t.camera,"distance",6,35,.5).name("距离"),Q.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),Q.add(t.camera,"fov",25,90,1).name("FOV");const ct=o.camera,kt=h(ut,"智能构图");kt.add(ct,"radius",2,18,.5).name("威胁评估半径 (m)"),kt.add(ct,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),kt.add(ct,"saturation",.5,8,.1).name("威胁归一化饱和"),kt.add(ct,"pushIn",0,.5,.01).name("无威胁推进比例"),kt.add(ct,"maxPullback",0,1,.02).name("最大拉远比例"),kt.add(ct,"maxOffset",0,6,.1).name("最大构图平移 (m)"),kt.add(ct,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),kt.add(ct,"framingBias",0,1,.05).name("威胁质心平移系数"),kt.add(ct,"attackBoost",0,2,.05).name("挥砍中额外加权"),kt.add(ct.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),kt.add(ct.modeWeight,"spar",0,3,.05).name("陪练模式威胁倍率"),kt.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const tt=h(ut,"缩放");return tt.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),tt.add(t.zoom,"max",1,4,.05).name("最大拉远上限"),tt.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),tt.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),tt.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),tt.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),tt.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),tt.add({reset:i.resetZoom},"reset").name("缩放归 1"),r.forEach(dt=>dt.close()),l.forEach(dt=>dt.close()),s.close(),{gui:s,refreshWeapon:()=>H.updateDisplay()}}function kx(n,t,e){let i=null,a=Number.POSITIVE_INFINITY;for(const s of n){const o=Math.hypot(t-s.x,e-s.z);o<=s.radius&&o<a&&(i=s,a=o)}return i}function Ix(n,t){return n.find(e=>e.id===t)??null}function Hd(n,t,e){if(n.length===0)return null;const i=[...n].sort((r,l)=>r.index-l.index),a=i.findIndex(r=>r.id===t),s=e<0?-1:1,o=a<0?s>0?0:i.length-1:(a+s+i.length)%i.length;return i[o]??null}function zx({stations:n,world:t,view:e,container:i,onResetZoom:a}){const s=i??document.getElementById("lab-panel");let o=null,r=null;const l=new Map,c=document.createElement("div");c.id="lab-toast",c.setAttribute("aria-live","polite"),document.body.appendChild(c);let h=0;function u(m){c.textContent=`${m.index} · ${m.name} — ${m.hint}`,c.style.borderColor=m.color,c.classList.add("is-on"),window.clearTimeout(h),h=window.setTimeout(()=>c.classList.remove("is-on"),5e3)}function d(){return kx(n,t.character.position.x,t.character.position.z)}function f(){const m=d(),p=(m==null?void 0:m.id)??null;if(p===o)return;const y=o!==null;o=p;for(const[x,v]of l)v.classList.toggle("is-active",x===p);r&&(r.textContent=m?`${m.index} · ${m.hint}`:"不在任何工位内：点上面的名字传送，或直接走过去",r.style.color=m?"rgba(206, 226, 244, 0.9)":"rgba(150, 172, 192, 0.62)"),m?u(m):y&&c.classList.remove("is-on")}function g(m){const p=typeof m=="number"?n.find(y=>y.index===m)??null:Ix(n,m);return p?(yg(t,p.spawnX,p.spawnZ),t.camera.centroidX=p.spawnX,t.camera.centroidZ=p.spawnZ,e.snapCamera(p.spawnX,t.character.position.y,p.spawnZ),f(),!0):!1}function _(){Yf(t)}if(s){s.textContent="";const m=document.createElement("div");m.className="lab-head",m.textContent="测试工位";const p=document.createElement("span");p.className="lab-tip",p.textContent="[ / ] 切换",m.appendChild(p),s.appendChild(m);for(const v of[...n].sort((w,S)=>w.index-S.index)){const w=document.createElement("button");w.type="button",w.className="lab-row",w.dataset.station=v.id,w.dataset.uiButton="",w.style.setProperty("--lab-color",v.color),w.setAttribute("aria-label",`传送到工位 ${v.index}：${v.name}`);const S=document.createElement("span");S.className="lab-idx",S.textContent=String(v.index);const T=document.createElement("span");T.className="lab-name",T.textContent=v.name,w.append(S,T),w.addEventListener("pointerdown",E=>{E.preventDefault(),E.stopPropagation(),g(v.id)}),s.appendChild(w),l.set(v.id,w)}r=document.createElement("div"),r.className="lab-hint",s.appendChild(r);const y=document.createElement("div");y.className="lab-foot";const x=document.createElement("button");if(x.type="button",x.className="lab-btn",x.dataset.uiButton="",x.textContent="召回假人",x.setAttribute("aria-label","召回全部假人回到各自工位"),x.addEventListener("pointerdown",v=>{v.preventDefault(),v.stopPropagation(),_()}),y.appendChild(x),a){const v=document.createElement("button");v.type="button",v.className="lab-btn",v.dataset.uiButton="",v.textContent="镜头归位",v.setAttribute("aria-label","把镜头缩放恢复到默认"),v.addEventListener("pointerdown",w=>{w.preventDefault(),w.stopPropagation(),a()}),y.appendChild(v)}s.appendChild(y)}return window.addEventListener("keydown",m=>{var p,y;if(!(m.metaKey||m.ctrlKey||m.altKey))if(m.key==="["){const x=Hd(n,((p=d())==null?void 0:p.id)??o,-1);x&&g(x.id)}else if(m.key==="]"){const x=Hd(n,((y=d())==null?void 0:y.id)??o,1);x&&g(x.id)}else m.key==="\\"&&_()}),f(),{goto:g,current:d,tick:f,recall:_,element:s}}const gc=Math.PI*2,pi={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},Fx=45,Ux=50;function Nx(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function Ds(n,t,e){const i=Nx(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function Ox(n,t){return Math.atan2(n,-t)*180/Math.PI}function Gd(n,t){return Math.abs(((n-t)%360+540)%360-180)}function To(n){return(n%360+360)%360}const Bx={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function Hx(n,t,e,i=8){const a=n.character,s=t.intents,o=Math.hypot(s.moveX,s.moveZ),r=Math.hypot(t.stickRawX,t.stickRawY),l=a.velocity,c=Math.hypot(l.x,l.z),h=o>.001?Ds(s.moveX,s.moveZ,e):null,u=c>.15?Ds(l.x,l.z,e):null,d=Ds(Math.sin(a.facing),Math.cos(a.facing),e),f=s.aimActive&&Math.hypot(s.aimX,s.aimZ)>1e-6?Ds(s.aimX,s.aimZ,e):null,g=n.targeting,_=g.hasTarget?Ds(Math.sin(g.targetYaw),Math.cos(g.targetYaw),e):null,m=h!==null&&u!==null?Gd(h,u):null,p=h!==null?Gd(h,d):null,y=m!==null&&m>Fx&&o>=.35&&c>=.4;return{inDeg:h,inLen:Math.min(1,o),rawDeg:r>.02?Ox(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,r),stickHeld:t.stickHeld,moveDeg:u,speed:c,faceDeg:d,lockDeg:_,lockId:g.targetId,lockDist:g.targetDist,aimDeg:f,gapMove:m,gapFace:p,warnMove:y}}function Vd(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>Ux&&(n.inLen>=.35||n.speed>=.4)}const Xd="harness.dirDebug";function Gx(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const a=e.querySelector("#dirdbg-canvas"),s=e.querySelector("#dirdbg-toggle"),o={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},r=a.getContext("2d");let l=!0;if(!t)try{l=window.localStorage.getItem(Xd)!=="0"}catch{}function c(){e.classList.toggle("is-off",!l),s&&(s.textContent=l?"方向 ⌄":"方向 ▸",s.setAttribute("aria-expanded",String(l)))}c();function h(x){if(l=x,!t)try{window.localStorage.setItem(Xd,x?"1":"0")}catch{}c()}s==null||s.addEventListener("pointerdown",x=>{x.preventDefault(),x.stopPropagation(),h(!l)}),t||window.addEventListener("keydown",x=>{x.key.toLowerCase()==="v"&&!x.metaKey&&!x.ctrlKey&&h(!l)});const u=Math.min(3,Math.max(1,window.devicePixelRatio||1)),d=118;a.width=Math.round(d*u),a.height=Math.round(d*u);let f=Bx,g=0,_="",m=8;function p(x){if(!r)return;const v=d,w=d,S=v/2,T=w/2,E=Math.min(v,w)/2-13;r.setTransform(u,0,0,u,0,0),r.clearRect(0,0,v,w),r.beginPath(),r.arc(S,T,E,0,gc),r.fillStyle="rgba(8, 12, 17, 0.5)",r.fill(),r.lineWidth=1,r.strokeStyle=x.warnMove?"rgba(251, 191, 36, 0.85)":pi.ring,r.stroke(),r.strokeStyle=pi.grid,r.beginPath(),r.moveTo(S-E,T),r.lineTo(S+E,T),r.moveTo(S,T-E),r.lineTo(S,T+E),r.stroke();for(let C=0;C<8;C++){const z=C*Math.PI/4,N=S+Math.sin(z)*(E-3),D=T-Math.cos(z)*(E-3),L=S+Math.sin(z)*E,F=T-Math.cos(z)*E;r.beginPath(),r.moveTo(N,D),r.lineTo(L,F),r.stroke()}const b=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;b>0&&(r.save(),r.setLineDash([2,3]),r.strokeStyle=pi.dead,r.beginPath(),r.arc(S,T,E*b,0,gc),r.stroke(),r.restore());const M=(C,z,N,D,L=!1,F=1)=>{const H=C*Math.PI/180,Y=Math.sin(H),it=-Math.cos(H),mt=E*Math.max(.14,Math.min(1,z)),_t=S+Y*E*.14,Lt=T+it*E*.14,J=S+Y*mt,et=T+it*mt;if(r.save(),r.globalAlpha=F,r.strokeStyle=N,r.fillStyle=N,r.lineWidth=D,r.lineCap="round",L&&r.setLineDash([3,3]),r.beginPath(),r.moveTo(_t,Lt),r.lineTo(J,et),r.stroke(),!L&&mt>E*.3){const ht=-it,q=Y,K=5.2;r.beginPath(),r.moveTo(J+Y*1.5,et+it*1.5),r.lineTo(J-Y*K+ht*K*.72,et-it*K+q*K*.72),r.lineTo(J-Y*K-ht*K*.72,et-it*K-q*K*.72),r.closePath(),r.fill()}r.restore()},R=(C,z)=>{const N=C*Math.PI/180,D=Math.sin(N),L=-Math.cos(N),F=-L,H=D,Y=E+1.5,it=Y+6.5;r.save(),r.fillStyle=z,r.strokeStyle=z,r.lineWidth=1,r.beginPath(),r.moveTo(S+D*it,T+L*it),r.lineTo(S+D*Y+F*4,T+L*Y+H*4),r.lineTo(S+D*Y-F*4,T+L*Y-H*4),r.closePath(),r.fill(),r.restore()};x.lockDeg!==null&&M(x.lockDeg,1,pi.lock,1,!0,.7),x.rawDeg!==null&&x.stickHeld&&M(x.rawDeg,x.rawLen,pi.raw,1,!0,.9),x.aimDeg!==null&&M(x.aimDeg,1,pi.aim,1.6,!0,.95),M(x.faceDeg,1,pi.face,1.1,!0,.55),x.moveDeg!==null&&M(x.moveDeg,x.speed/Math.max(1,m),pi.move,5.5,!1,.8),x.inDeg!==null&&M(x.inDeg,x.inLen,pi.input,2.2),R(x.faceDeg,pi.face),r.beginPath(),r.arc(S,T,2.2,0,gc),r.fillStyle="rgba(220, 235, 248, 0.85)",r.fill()}function y(x,v){const w=E=>E===null?"-":String(Math.round(To(E)));o.in.textContent=`入 ${w(x.inDeg)}`,o.mv.textContent=`移 ${w(x.moveDeg)}`,o.fc.textContent=`面 ${w(x.faceDeg)}`;const S=E=>E===null?"-":`${Math.round(E)}°`,T=[`Δ入→移 ${S(x.gapMove)}`,`Δ入→面 ${S(x.gapFace)}`];x.speed>.05&&T.push(`v${x.speed.toFixed(1)}`),x.lockDeg!==null&&T.push(`锁#${x.lockId} ${x.lockDist.toFixed(1)}m`),x.aimDeg!==null&&T.push("拖拽瞄准"),o.gap.textContent=T.join("  "),e.classList.toggle("is-warn",x.warnMove||Vd(x,v))}return{update(x,v,w){if(!l)return;m=Math.max(1,x.config.moveSpeed*Math.max(1,x.config.sprintMultiplier));const S=Hx(x,v,w,m);f=S;const T=x.combat.phase!=="idle";p(S);const E=performance.now(),b=`${S.inDeg}|${S.moveDeg}|${S.faceDeg}|${S.lockId}|${S.aimDeg}|${S.warnMove}|${S.speed.toFixed(1)}`;(E-g>90||b!==_)&&(g=E,_=b,y(S,T),e.dataset.in=S.inDeg===null?"":To(S.inDeg).toFixed(1),e.dataset.mv=S.moveDeg===null?"":To(S.moveDeg).toFixed(1),e.dataset.fc=To(S.faceDeg).toFixed(1),e.dataset.warn=S.warnMove||Vd(S,T)?"1":"0")},setEnabled:h,toggle(){return h(!l),l},enabled:()=>l,last:()=>f}}const Vx=6,Xx=480,Wd=240,Yd=92,Wx=18;function Yx(n,t,e,i){const a=t-n;return{t:i,speed:t,drive:t,raw:t,dv:a,accel:e>1e-4?a/e:0,busy:!1}}function $x(n,t,e,i){const s=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:s,speed:Math.min(s,Math.max(1,i))}}function Zx(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function jx(n={}){const t=Math.max(1,n.windowS??Vx),e=Math.max(60,n.capacity??Xx),i=Math.max(1,n.speedCap??Wx),a=!!(n.container&&n.toggle),s=n.container??document.createElement("div");s.id="motiondbg",n.container||(s.setAttribute("data-ui-region",""),document.body.appendChild(s));const o=['<div id="motiondbg-head"><span>速度(位移) / Δv</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="92"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");s.innerHTML=a?`<div id="motiondbg-body">${o}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${o}</div>`].join("");const r=n.toggle??s.querySelector("#motiondbg-toggle"),l=s.querySelector("#motiondbg-graph"),c=s.querySelector("#motiondbg-read"),h=s.querySelector("#motiondbg-window"),u=s.querySelector("#motiondbg-dir");h.textContent=`${t.toFixed(1)}s`;const d=l.getContext("2d"),f=Math.min(3,Math.max(1,window.devicePixelRatio||1));l.width=Math.round(Wd*f),l.height=Math.round(Yd*f);const g=Gx({deadZone:n.deadZone,container:u,embedded:!0});let _=!1;function m(E){_=E,s.classList.toggle("is-off",!E),!a&&r&&(r.textContent=E?"手感 ⌄":"手感 ▸",r.setAttribute("aria-expanded",String(E)),r.setAttribute("aria-label",E?"收起手感调试面板":"展开手感调试面板"))}m(!1),a||(r==null||r.addEventListener("pointerdown",E=>{E.preventDefault(),E.stopPropagation(),m(!_)}),window.addEventListener("keydown",E=>{E.key.toLowerCase()==="v"&&!E.metaKey&&!E.ctrlKey&&m(!_)}));const p=[];let y=0,x=null,v=-1,w={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1};function S(E){const b=E-t;let M=0;for(;M<p.length&&p[M].t<b;)M++;return p.slice(M)}function T(E,b){if(!d)return;const M=Wd,R=Yd;d.setTransform(f,0,0,f,0,0),d.clearRect(0,0,M,R),d.fillStyle="rgba(8, 12, 17, 0.55)",d.fillRect(0,0,M,R);const C=4,z=4,N=M-C-z,D=9,L=46,F=62,H=22,Y=b-t,it=q=>C+Math.max(0,Math.min(1,(q-Y)/t))*N;for(let q=0;q<E.length;q++){if(!E[q].busy)continue;const K=it(E[q].t),$=q+1<E.length?it(E[q+1].t):K+2;d.fillStyle="rgba(251, 146, 60, 0.13)",d.fillRect(K,D,Math.max(2,$-K),L)}d.strokeStyle="rgba(150, 190, 220, 0.14)",d.lineWidth=1,d.beginPath();for(const q of[D,D+L/2,D+L])d.moveTo(C,q),d.lineTo(M-z,q);d.moveTo(C,F+H/2),d.lineTo(M-z,F+H/2),d.stroke();const _t=Math.max(1,...E.map(q=>q.speed),...E.map(q=>q.drive))*1.15,Lt=q=>D+L-q/_t*L;if(E.length>1){d.beginPath(),d.moveTo(it(E[0].t),Lt(E[0].speed));for(let q=1;q<E.length;q++)d.lineTo(it(E[q].t),Lt(E[q].speed));d.strokeStyle="#38bdf8",d.lineWidth=1.8,d.lineJoin="round",d.stroke(),d.lineTo(it(E[E.length-1].t),D+L),d.lineTo(it(E[0].t),D+L),d.closePath(),d.fillStyle="rgba(56, 189, 248, 0.14)",d.fill(),d.beginPath(),d.moveTo(it(E[0].t),Lt(E[0].drive));for(let q=1;q<E.length;q++)d.lineTo(it(E[q].t),Lt(E[q].drive));d.setLineDash([3,3]),d.strokeStyle="rgba(190, 205, 220, 0.6)",d.lineWidth=1.2,d.stroke(),d.setLineDash([])}let J=.02;for(const q of E)J=Math.max(J,Math.abs(q.dv));J*=1.1;const et=F+H/2,ht=H/2;for(const q of E){const K=Math.min(ht,Math.abs(q.dv)/J*ht);d.fillStyle=q.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",d.fillRect(it(q.t)-.7,q.dv>=0?et-K:et,1.4,Math.max(.5,K))}d.font="9px ui-monospace, monospace",d.fillStyle="rgba(190, 214, 234, 0.55)",d.textAlign="left",d.fillText(_t.toFixed(1),C+2,D+8),d.fillText("v",C+2,D+L-2),d.fillText("Δv",C+2,F+9),d.textAlign="right",d.fillText("0",M-z-2,D+L-2),d.textAlign="left"}return{dirDebug:g,update(E,b,M){const R=performance.now()/1e3,C=v<0?1/60:Math.max(1e-4,Math.min(.25,R-v));v=R;const z=E.character,N={x:z.position.x,z:z.position.z},D=Math.hypot(z.velocity.x,z.velocity.z),{speed:L,raw:F}=x?$x(x,N,C,i):{speed:0,raw:0},H=Yx(y,L,C,R);H.drive=D,H.raw=F,H.busy=Zx(E),x=N,y=L,p.push(H),p.length>e&&p.shift();const Y=S(R);let it=0;for(const mt of Y)it=Math.max(it,mt.speed);if(w={speed:L,drive:D,raw:F,dv:H.dv,accel:H.accel,peak:it,samples:Y.length,windowS:t,busy:H.busy},g.update(E,b,M),_){T(Y,R);const mt=H.dv>=0?"+":"";c.textContent=`v ${L.toFixed(2)} · 驱 ${D.toFixed(2)} · 峰 ${it.toFixed(2)} · Δv ${mt}${H.dv.toFixed(3)} · ${Y.length} 帧`}},setEnabled:m,toggle(){return m(!_),_},enabled:()=>_,last:()=>({...w}),samples:()=>S(performance.now()/1e3).map(E=>({...E}))}}const qx=["剑盾","双剑","大剑","法杖","弓"],Kx={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击",spar:"陪练"};function Jx(n){return{update(t,e,i,a,s,o,r=!1){const l=t.character,c=l.position,h=l.velocity,u=t.combat,d=t.events.length>0?t.events[t.events.length-1]:null,f=Ct=>Ct.toFixed(2),g=Ct=>(Ct*180/Math.PI).toFixed(0),_=qx[ea.indexOf(u.weapon)]??u.weapon,m=Math.round(u.charge*10),p="|".repeat(m)+".".repeat(10-m),y=t.dash,x=y.phase==="active"&&y.duration>0?(1-y.timer/y.duration)*100:0,v=y.phase==="active"?`${y.kind}@${x.toFixed(0)}%`:`${y.kind} cd${f(y.cooldown)}`,w=a.intents.aimActive?`(${f(a.intents.aimX)},${f(a.intents.aimZ)})`:"-",S=h.x*Math.sin(l.bodyYaw)+h.z*Math.cos(l.bodyYaw),T=h.x*Math.cos(l.bodyYaw)-h.z*Math.sin(l.bodyYaw),E=Math.abs(S)+Math.abs(T)+1e-6,b=Math.round(Math.abs(T)/E*100),M=`strafe ${b}%${S<-.05?" back":""}`,R=t.camera,C=`threat ${(R.threat*100).toFixed(0)}%  dist×${f(R.distanceScale)}  off (${f(R.offsetX)},${f(R.offsetZ)})  pitch +${f(R.pitchDelta)}°  n=${R.threatCount}`,z=o?f(o.attackBlend):"-",N=o==null?void 0:o.attackWeights,D=N?`gw ${f(N.gaitScale)}  lw ${f(N.attackLegWeight)}  spd ${f(N.driveSpeed)}`:"-",L=N?`${f(N.gaitScale)}/${f(N.attackLegWeight)}`:"-",F=o?`${o.landing.kind} ${f(o.landing.pulse)} t${f(o.landing.remaining)} vy${f(o.landing.impactVy)}`:"-",H=o?`${o.landing.kind}/${f(o.landing.pulse)}`:"-",Y=(o==null?void 0:o.zoom)!==void 0?`zoom ×${f(o.zoom)}`:"-",it=o==null?void 0:o.hurt,mt=it?`hurt ${t.playerHurt.type}  部位h${f(it.hitHeight)}  脉冲p${f(it.pulse)}  上身${f(it.upperShift)}  重心${f(it.comShift)}  后坐${f(it.pelvisBack)}  屈膝${f(it.knee)}`:"-",_t=it?`${f(it.hitHeight)}/${f(it.pulse)}/${f(it.knee)}`:"-",Lt=o==null?void 0:o.ik,J=Lt?`${Lt.active?"on":"off"} w${f(Lt.weight)} e${f(Lt.maxError)}`:"-",et=t.playerLink,ht=`link ${et.kind||"-"}  ${et.phase}  prog ${f(et.progress)}  win ${f(et.linkWindow)}s  cd ${f(et.cooldown)}s  hits ${et.hitIds.length}  travel ${f(et.travelled)}/${f(et.travel)}m  id ${et.id}`,q=`${et.phase}/${et.kind||"-"}/w${f(et.linkWindow)}`,K=a.lastGesture,$=K?`${K.button} ${K.kind} ${K.heldMs.toFixed(0)}ms d${K.distance.toFixed(0)}px ${K.angleDeg.toFixed(0)}° taps${K.taps}`:"-",Mt=t.dummies.map(Ct=>`${Ct.id}:${Kx[Ct.mode]}`).join("  ");if(r){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${_} ${u.phase} · lk ${et.phase}${et.kind?`/${et.kind}`:""} w${f(et.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${f(c.x)},${f(c.y)},${f(c.z)})  vel (${f(h.x)},${f(h.y)},${f(h.z)})`,`face ${g(l.facing)}  body ${g(l.bodyYaw)}  head ${g(l.headYaw)}  move ${g(l.moveYaw)}  st${b}%  stick(${f(a.stickX)},${f(a.stickY)}) ${a.source}  str${f(l.stride)}`,`weapon ${_}  ${u.phase}  combo ${u.comboIndex}/3  atk ${f(u.attackProgress)}  dash ${v}  ab ${z}  gw/lw ${L}  land ${H}  ik ${J}`,`aim ${w}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${f(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${_t}`,`dummies ${Mt}  atkCount ${t.dummyAttackCount}  cam ${(R.threat*100).toFixed(0)}% ×${f(R.distanceScale)}  ${Y}  lk ${q}`,`event ${d?`${d.type} ${f(d.value)}`:"-"}  scale ${f(s.timeScale)}${s.paused?" [P]":""}  g ${$}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${f(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${f(c.x)}, ${f(c.y)}, ${f(c.z)})`,`vel  (${f(h.x)}, ${f(h.y)}, ${f(h.z)})`,`grounded ${l.grounded?"Y":"N"}   sprint ${l.sprinting?"Y":"N"}   facing ${g(l.facing)}deg   atkBlend ${z}   ${D}   land ${F}`,mt,`ik ${J}  clamped ${Lt?Lt.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${g(l.facing)}  body ${g(l.bodyYaw)}  head ${g(l.headYaw)}  move ${g(l.moveYaw)}  (head-body ${g(l.headYaw-l.bodyYaw)})  ${M}`,`move (${f(a.intents.moveX)}, ${f(a.intents.moveZ)})  stick (${f(a.stickX)}, ${f(a.stickY)})  ${a.source}  aim ${w}`,`weapon ${_}  phase ${u.phase}  combo ${u.comboIndex}/3  atk ${f(u.attackProgress)}${u.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${y.kind}  phase ${y.phase}  prog ${x.toFixed(0)}%  cd ${f(y.cooldown)}s  id ${y.id}  from (${f(y.fromX)},${f(y.fromZ)}) → to (${f(y.toX)},${f(y.toZ)})`,ht,`camera ${C}  ${Y}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${f(t.targeting.targetDist)}m  face ${g(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${p}] ${(u.charge*100).toFixed(0)}%  charging ${u.charging?"Y":"N"}`,`dummies ${Mt}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${f(t.impulse.x)}, ${f(t.impulse.z)})`,`event ${d?`${d.type} ${f(d.value)}`:"-"}   scale ${f(s.timeScale)}${s.paused?" [PAUSED]":""}   gesture ${$}`].join(`
`)}}}const Ao=["lab","hud","motion","debug"],$d={lab:{short:"工位",full:"测试工位"},hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}},Zd={lab:{toggle:"lab-toggle",panel:"lab-panel"},hud:{toggle:"hud-toggle",panel:"hud"},motion:{toggle:"motiondbg-toggle",panel:"motiondbg"},debug:{toggle:"debug-toggle",panel:"debug-panel"}};function Qx(n){var l;const t=Object.fromEntries(Ao.map(c=>[c,document.getElementById(Zd[c].toggle)])),e=Object.fromEntries(Ao.map(c=>[c,document.getElementById(Zd[c].panel)]));let i={},a=null;function s(){var c,h,u;for(const d of Ao){const f=a===d,g=t[d],_=e[d];g&&(g.setAttribute("aria-expanded",String(f)),g.textContent=`${$d[d].short} ${f?"▾":"▸"}`,g.setAttribute("aria-label",`${f?"收起":"展开"}${$d[d].full}`)),_&&_.classList.toggle("is-open",f)}n.classList.toggle("is-compact",a!=="hud"),(c=i.motion)==null||c.setEnabled(a==="motion"),a==="debug"?(h=i.debug)==null||h.open():(u=i.debug)==null||u.close()}function o(c){a=a===c?null:c,s()}function r(){a!==null&&(a=null,s())}for(const c of Ao)(l=t[c])==null||l.addEventListener("pointerdown",h=>{h.preventDefault(),h.stopPropagation(),o(c)});return window.addEventListener("keydown",c=>{c.key.toLowerCase()==="v"&&!c.metaKey&&!c.ctrlKey&&o("motion")}),s(),{hudCompact:()=>a!=="hud",register(c){i=c,s()},toggle:o,closeAll:r,isOpen:c=>a===c}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const vh="170",tv=0,jd=1,ev=2,tp=1,ep=2,Li=3,na=0,Pn=1,Ke=2,Qi=0,ls=1,Di=2,qd=3,Kd=4,nv=5,Ma=100,iv=101,av=102,sv=103,ov=104,rv=200,cv=201,lv=202,hv=203,ml=204,gl=205,dv=206,uv=207,fv=208,pv=209,mv=210,gv=211,xv=212,vv=213,yv=214,xl=0,vl=1,yl=2,gs=3,_l=4,Ml=5,bl=6,Sl=7,yh=0,_v=1,Mv=2,ta=0,bv=1,Sv=2,wv=3,Ev=4,Tv=5,Av=6,Rv=7,np=300,xs=301,vs=302,wl=303,El=304,Ur=306,Tl=1e3,Sa=1001,Al=1002,ri=1003,Pv=1004,Ro=1005,xi=1006,xc=1007,wa=1008,Ui=1009,ip=1010,ap=1011,no=1012,_h=1013,Ta=1014,Ii=1015,ho=1016,Mh=1017,bh=1018,ys=1020,sp=35902,op=1021,rp=1022,oi=1023,cp=1024,lp=1025,hs=1026,_s=1027,hp=1028,Sh=1029,dp=1030,wh=1031,Eh=1033,cr=33776,lr=33777,hr=33778,dr=33779,Rl=35840,Pl=35841,Cl=35842,Ll=35843,Dl=36196,kl=37492,Il=37496,zl=37808,Fl=37809,Ul=37810,Nl=37811,Ol=37812,Bl=37813,Hl=37814,Gl=37815,Vl=37816,Xl=37817,Wl=37818,Yl=37819,$l=37820,Zl=37821,ur=36492,jl=36494,ql=36495,up=36283,Kl=36284,Jl=36285,Ql=36286,Cv=3200,Lv=3201,fp=0,Dv=1,ji="",En="srgb",bs="srgb-linear",Nr="linear",ke="srgb",Ba=7680,Jd=519,kv=512,Iv=513,zv=514,pp=515,Fv=516,Uv=517,Nv=518,Ov=519,th=35044,Qd=35048,tu="300 es",zi=2e3,Tr=2001;class Ss{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const a=this._listeners[t];if(a!==void 0){const s=a.indexOf(e);s!==-1&&a.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const a=i.slice(0);for(let s=0,o=a.length;s<o;s++)a[s].call(this,t);t.target=null}}}const xn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let eu=1234567;const ds=Math.PI/180,io=180/Math.PI;function yi(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(xn[n&255]+xn[n>>8&255]+xn[n>>16&255]+xn[n>>24&255]+"-"+xn[t&255]+xn[t>>8&255]+"-"+xn[t>>16&15|64]+xn[t>>24&255]+"-"+xn[e&63|128]+xn[e>>8&255]+"-"+xn[e>>16&255]+xn[e>>24&255]+xn[i&255]+xn[i>>8&255]+xn[i>>16&255]+xn[i>>24&255]).toLowerCase()}function fn(n,t,e){return Math.max(t,Math.min(e,n))}function Th(n,t){return(n%t+t)%t}function Bv(n,t,e,i,a){return i+(n-t)*(a-i)/(e-t)}function Hv(n,t,e){return n!==t?(e-n)/(t-n):0}function $s(n,t,e){return(1-e)*n+e*t}function Gv(n,t,e,i){return $s(n,t,1-Math.exp(-e*i))}function Vv(n,t=1){return t-Math.abs(Th(n,t*2)-t)}function Xv(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function Wv(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function Yv(n,t){return n+Math.floor(Math.random()*(t-n+1))}function $v(n,t){return n+Math.random()*(t-n)}function Zv(n){return n*(.5-Math.random())}function jv(n){n!==void 0&&(eu=n);let t=eu+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function qv(n){return n*ds}function Kv(n){return n*io}function Jv(n){return(n&n-1)===0&&n!==0}function Qv(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function ty(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function ey(n,t,e,i,a){const s=Math.cos,o=Math.sin,r=s(e/2),l=o(e/2),c=s((t+i)/2),h=o((t+i)/2),u=s((t-i)/2),d=o((t-i)/2),f=s((i-t)/2),g=o((i-t)/2);switch(a){case"XYX":n.set(r*h,l*u,l*d,r*c);break;case"YZY":n.set(l*d,r*h,l*u,r*c);break;case"ZXZ":n.set(l*u,l*d,r*h,r*c);break;case"XZX":n.set(r*h,l*g,l*f,r*c);break;case"YXY":n.set(l*f,r*h,l*g,r*c);break;case"ZYZ":n.set(l*g,l*f,r*h,r*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+a)}}function si(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Pe(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const nu={DEG2RAD:ds,RAD2DEG:io,generateUUID:yi,clamp:fn,euclideanModulo:Th,mapLinear:Bv,inverseLerp:Hv,lerp:$s,damp:Gv,pingpong:Vv,smoothstep:Xv,smootherstep:Wv,randInt:Yv,randFloat:$v,randFloatSpread:Zv,seededRandom:jv,degToRad:qv,radToDeg:Kv,isPowerOfTwo:Jv,ceilPowerOfTwo:Qv,floorPowerOfTwo:ty,setQuaternionFromProperEuler:ey,normalize:Pe,denormalize:si};class $t{constructor(t=0,e=0){$t.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6],this.y=a[1]*e+a[4]*i+a[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(fn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),a=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*i-o*a+t.x,this.y=s*a+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class pe{constructor(t,e,i,a,s,o,r,l,c){pe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,l,c)}set(t,e,i,a,s,o,r,l,c){const h=this.elements;return h[0]=t,h[1]=a,h[2]=r,h[3]=e,h[4]=s,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[3],l=i[6],c=i[1],h=i[4],u=i[7],d=i[2],f=i[5],g=i[8],_=a[0],m=a[3],p=a[6],y=a[1],x=a[4],v=a[7],w=a[2],S=a[5],T=a[8];return s[0]=o*_+r*y+l*w,s[3]=o*m+r*x+l*S,s[6]=o*p+r*v+l*T,s[1]=c*_+h*y+u*w,s[4]=c*m+h*x+u*S,s[7]=c*p+h*v+u*T,s[2]=d*_+f*y+g*w,s[5]=d*m+f*x+g*S,s[8]=d*p+f*v+g*T,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*r*c-i*s*h+i*r*l+a*s*c-a*o*l}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],u=h*o-r*c,d=r*l-h*s,f=c*s-o*l,g=e*u+i*d+a*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=u*_,t[1]=(a*c-h*i)*_,t[2]=(r*i-a*o)*_,t[3]=d*_,t[4]=(h*e-a*l)*_,t[5]=(a*s-r*e)*_,t[6]=f*_,t[7]=(i*l-c*e)*_,t[8]=(o*e-i*s)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,a,s,o,r){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*r)+o+t,-a*c,a*l,-a*(-c*o+l*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(vc.makeScale(t,e)),this}rotate(t){return this.premultiply(vc.makeRotation(-t)),this}translate(t,e){return this.premultiply(vc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<9;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const vc=new pe;function mp(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Ar(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function ny(){const n=Ar("canvas");return n.style.display="block",n}const iu={};function Hs(n){n in iu||(iu[n]=!0,console.warn(n))}function iy(n,t,e){return new Promise(function(i,a){function s(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:a();break;case n.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}function ay(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function sy(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Se={enabled:!0,workingColorSpace:bs,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===ke&&(n.r=Fi(n.r),n.g=Fi(n.g),n.b=Fi(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===ke&&(n.r=us(n.r),n.g=us(n.g),n.b=us(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===ji?Nr:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function Fi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function us(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const au=[.64,.33,.3,.6,.15,.06],su=[.2126,.7152,.0722],ou=[.3127,.329],ru=new pe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),cu=new pe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Se.define({[bs]:{primaries:au,whitePoint:ou,transfer:Nr,toXYZ:ru,fromXYZ:cu,luminanceCoefficients:su,workingColorSpaceConfig:{unpackColorSpace:En},outputColorSpaceConfig:{drawingBufferColorSpace:En}},[En]:{primaries:au,whitePoint:ou,transfer:ke,toXYZ:ru,fromXYZ:cu,luminanceCoefficients:su,outputColorSpaceConfig:{drawingBufferColorSpace:En}}});let Ha;class oy{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Ha===void 0&&(Ha=Ar("canvas")),Ha.width=t.width,Ha.height=t.height;const i=Ha.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=Ha}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Ar("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const a=i.getImageData(0,0,t.width,t.height),s=a.data;for(let o=0;o<s.length;o++)s[o]=Fi(s[o]/255)*255;return i.putImageData(a,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Fi(e[i]/255)*255):e[i]=Fi(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let ry=0;class gp{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:ry++}),this.uuid=yi(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},a=this.data;if(a!==null){let s;if(Array.isArray(a)){s=[];for(let o=0,r=a.length;o<r;o++)a[o].isDataTexture?s.push(yc(a[o].image)):s.push(yc(a[o]))}else s=yc(a);i.url=s}return e||(t.images[this.uuid]=i),i}}function yc(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?oy.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let cy=0;class Tn extends Ss{constructor(t=Tn.DEFAULT_IMAGE,e=Tn.DEFAULT_MAPPING,i=Sa,a=Sa,s=xi,o=wa,r=oi,l=Ui,c=Tn.DEFAULT_ANISOTROPY,h=ji){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:cy++}),this.uuid=yi(),this.name="",this.source=new gp(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=r,this.internalFormat=null,this.type=l,this.offset=new $t(0,0),this.repeat=new $t(1,1),this.center=new $t(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new pe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==np)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Tl:t.x=t.x-Math.floor(t.x);break;case Sa:t.x=t.x<0?0:1;break;case Al:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Tl:t.y=t.y-Math.floor(t.y);break;case Sa:t.y=t.y<0?0:1;break;case Al:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Tn.DEFAULT_IMAGE=null;Tn.DEFAULT_MAPPING=np;Tn.DEFAULT_ANISOTROPY=1;class Je{constructor(t=0,e=0,i=0,a=1){Je.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=a}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,a){return this.x=t,this.y=e,this.z=i,this.w=a,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*a+o[12]*s,this.y=o[1]*e+o[5]*i+o[9]*a+o[13]*s,this.z=o[2]*e+o[6]*i+o[10]*a+o[14]*s,this.w=o[3]*e+o[7]*i+o[11]*a+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,a,s;const l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],g=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(c+1)/2,v=(f+1)/2,w=(p+1)/2,S=(h+d)/4,T=(u+_)/4,E=(g+m)/4;return x>v&&x>w?x<.01?(i=0,a=.707106781,s=.707106781):(i=Math.sqrt(x),a=S/i,s=T/i):v>w?v<.01?(i=.707106781,a=0,s=.707106781):(a=Math.sqrt(v),i=S/a,s=E/a):w<.01?(i=.707106781,a=.707106781,s=0):(s=Math.sqrt(w),i=T/s,a=E/s),this.set(i,a,s,e),this}let y=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(y)<.001&&(y=1),this.x=(m-g)/y,this.y=(u-_)/y,this.z=(d-h)/y,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class ly extends Ss{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Je(0,0,t,e),this.scissorTest=!1,this.viewport=new Je(0,0,t,e);const a={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:xi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new Tn(a,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let r=0;r<o;r++)this.textures[r]=s.clone(),this.textures[r].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let a=0,s=this.textures.length;a<s;a++)this.textures[a].image.width=t,this.textures[a].image.height=e,this.textures[a].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,a=t.textures.length;i<a;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new gp(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Aa extends ly{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class xp extends Tn{constructor(t=null,e=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=ri,this.minFilter=ri,this.wrapR=Sa,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class hy extends Tn{constructor(t=null,e=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=ri,this.minFilter=ri,this.wrapR=Sa,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class uo{constructor(t=0,e=0,i=0,a=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=a}static slerpFlat(t,e,i,a,s,o,r){let l=i[a+0],c=i[a+1],h=i[a+2],u=i[a+3];const d=s[o+0],f=s[o+1],g=s[o+2],_=s[o+3];if(r===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(r===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=_;return}if(u!==_||l!==d||c!==f||h!==g){let m=1-r;const p=l*d+c*f+h*g+u*_,y=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const w=Math.sqrt(x),S=Math.atan2(w,p*y);m=Math.sin(m*S)/w,r=Math.sin(r*S)/w}const v=r*y;if(l=l*m+d*v,c=c*m+f*v,h=h*m+g*v,u=u*m+_*v,m===1-r){const w=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=w,c*=w,h*=w,u*=w}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,a,s,o){const r=i[a],l=i[a+1],c=i[a+2],h=i[a+3],u=s[o],d=s[o+1],f=s[o+2],g=s[o+3];return t[e]=r*g+h*u+l*f-c*d,t[e+1]=l*g+h*d+c*u-r*f,t[e+2]=c*g+h*f+r*d-l*u,t[e+3]=h*g-r*u-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,a){return this._x=t,this._y=e,this._z=i,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,a=t._y,s=t._z,o=t._order,r=Math.cos,l=Math.sin,c=r(i/2),h=r(a/2),u=r(s/2),d=l(i/2),f=l(a/2),g=l(s/2);switch(o){case"XYZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"YZX":this._x=d*h*u+c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u-d*f*g;break;case"XZY":this._x=d*h*u-c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,a=Math.sin(i);return this._x=t.x*a,this._y=t.y*a,this._z=t.z*a,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],a=e[4],s=e[8],o=e[1],r=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=i+r+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(s-c)*f,this._z=(o-a)*f}else if(i>r&&i>u){const f=2*Math.sqrt(1+i-r-u);this._w=(h-l)/f,this._x=.25*f,this._y=(a+o)/f,this._z=(s+c)/f}else if(r>u){const f=2*Math.sqrt(1+r-i-u);this._w=(s-c)/f,this._x=(a+o)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-i-r);this._w=(o-a)/f,this._x=(s+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(fn(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const a=Math.min(1,e/i);return this.slerp(t,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,a=t._y,s=t._z,o=t._w,r=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+o*r+a*c-s*l,this._y=a*h+o*l+s*r-i*c,this._z=s*h+o*c+i*l-a*r,this._w=o*h-i*r-a*l-s*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,a=this._y,s=this._z,o=this._w;let r=o*t._w+i*t._x+a*t._y+s*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=o,this._x=i,this._y=a,this._z=s,this;const l=1-r*r;if(l<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*i+e*this._x,this._y=f*a+e*this._y,this._z=f*s+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,r),u=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*u+this._w*d,this._x=i*u+this._x*d,this._y=a*u+this._y*d,this._z=s*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),a=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(a*Math.sin(t),a*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class B{constructor(t=0,e=0,i=0){B.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(lu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(lu.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*a,this.y=s[1]*e+s[4]*i+s[7]*a,this.z=s[2]*e+s[5]*i+s[8]*a,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=t.elements,o=1/(s[3]*e+s[7]*i+s[11]*a+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*a+s[12])*o,this.y=(s[1]*e+s[5]*i+s[9]*a+s[13])*o,this.z=(s[2]*e+s[6]*i+s[10]*a+s[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,a=this.z,s=t.x,o=t.y,r=t.z,l=t.w,c=2*(o*a-r*i),h=2*(r*e-s*a),u=2*(s*i-o*e);return this.x=e+l*c+o*u-r*h,this.y=i+l*h+r*c-s*u,this.z=a+l*u+s*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*a,this.y=s[1]*e+s[5]*i+s[9]*a,this.z=s[2]*e+s[6]*i+s[10]*a,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,a=t.y,s=t.z,o=e.x,r=e.y,l=e.z;return this.x=a*l-s*r,this.y=s*o-i*l,this.z=i*r-a*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return _c.copy(this).projectOnVector(t),this.sub(_c)}reflect(t){return this.sub(_c.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(fn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,a=this.z-t.z;return e*e+i*i+a*a}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const a=Math.sin(e)*t;return this.x=a*Math.sin(i),this.y=Math.cos(e)*t,this.z=a*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),a=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=a,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const _c=new B,lu=new uo;class fo{constructor(t=new B(1/0,1/0,1/0),e=new B(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(ni.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(ni.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=ni.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,r=s.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,ni):ni.fromBufferAttribute(s,o),ni.applyMatrix4(t.matrixWorld),this.expandByPoint(ni);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Po.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Po.copy(i.boundingBox)),Po.applyMatrix4(t.matrixWorld),this.union(Po)}const a=t.children;for(let s=0,o=a.length;s<o;s++)this.expandByObject(a[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,ni),ni.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ks),Co.subVectors(this.max,ks),Ga.subVectors(t.a,ks),Va.subVectors(t.b,ks),Xa.subVectors(t.c,ks),Vi.subVectors(Va,Ga),Xi.subVectors(Xa,Va),la.subVectors(Ga,Xa);let e=[0,-Vi.z,Vi.y,0,-Xi.z,Xi.y,0,-la.z,la.y,Vi.z,0,-Vi.x,Xi.z,0,-Xi.x,la.z,0,-la.x,-Vi.y,Vi.x,0,-Xi.y,Xi.x,0,-la.y,la.x,0];return!Mc(e,Ga,Va,Xa,Co)||(e=[1,0,0,0,1,0,0,0,1],!Mc(e,Ga,Va,Xa,Co))?!1:(Lo.crossVectors(Vi,Xi),e=[Lo.x,Lo.y,Lo.z],Mc(e,Ga,Va,Xa,Co))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ni).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ni).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ei[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ei[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ei[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ei[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ei[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ei[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ei[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ei[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ei),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Ei=[new B,new B,new B,new B,new B,new B,new B,new B],ni=new B,Po=new fo,Ga=new B,Va=new B,Xa=new B,Vi=new B,Xi=new B,la=new B,ks=new B,Co=new B,Lo=new B,ha=new B;function Mc(n,t,e,i,a){for(let s=0,o=n.length-3;s<=o;s+=3){ha.fromArray(n,s);const r=a.x*Math.abs(ha.x)+a.y*Math.abs(ha.y)+a.z*Math.abs(ha.z),l=t.dot(ha),c=e.dot(ha),h=i.dot(ha);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>r)return!1}return!0}const dy=new fo,Is=new B,bc=new B;class Or{constructor(t=new B,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):dy.setFromPoints(t).getCenter(i);let a=0;for(let s=0,o=t.length;s<o;s++)a=Math.max(a,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(a),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Is.subVectors(t,this.center);const e=Is.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),a=(i-this.radius)*.5;this.center.addScaledVector(Is,a/i),this.radius+=a}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(bc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Is.copy(t.center).add(bc)),this.expandByPoint(Is.copy(t.center).sub(bc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Ti=new B,Sc=new B,Do=new B,Wi=new B,wc=new B,ko=new B,Ec=new B;class Ah{constructor(t=new B,e=new B(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Ti)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Ti.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Ti.copy(this.origin).addScaledVector(this.direction,e),Ti.distanceToSquared(t))}distanceSqToSegment(t,e,i,a){Sc.copy(t).add(e).multiplyScalar(.5),Do.copy(e).sub(t).normalize(),Wi.copy(this.origin).sub(Sc);const s=t.distanceTo(e)*.5,o=-this.direction.dot(Do),r=Wi.dot(this.direction),l=-Wi.dot(Do),c=Wi.lengthSq(),h=Math.abs(1-o*o);let u,d,f,g;if(h>0)if(u=o*l-r,d=o*r-l,g=s*h,u>=0)if(d>=-g)if(d<=g){const _=1/h;u*=_,d*=_,f=u*(u+o*d+2*r)+d*(o*u+d+2*l)+c}else d=s,u=Math.max(0,-(o*d+r)),f=-u*u+d*(d+2*l)+c;else d=-s,u=Math.max(0,-(o*d+r)),f=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-o*s+r)),d=u>0?-s:Math.min(Math.max(-s,-l),s),f=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-s,-l),s),f=d*(d+2*l)+c):(u=Math.max(0,-(o*s+r)),d=u>0?s:Math.min(Math.max(-s,-l),s),f=-u*u+d*(d+2*l)+c);else d=o>0?-s:s,u=Math.max(0,-(o*d+r)),f=-u*u+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),a&&a.copy(Sc).addScaledVector(Do,d),f}intersectSphere(t,e){Ti.subVectors(t.center,this.origin);const i=Ti.dot(this.direction),a=Ti.dot(Ti)-i*i,s=t.radius*t.radius;if(a>s)return null;const o=Math.sqrt(s-a),r=i-o,l=i+o;return l<0?null:r<0?this.at(l,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,a,s,o,r,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(i=(t.min.x-d.x)*c,a=(t.max.x-d.x)*c):(i=(t.max.x-d.x)*c,a=(t.min.x-d.x)*c),h>=0?(s=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(s=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),i>o||s>a||((s>i||isNaN(i))&&(i=s),(o<a||isNaN(a))&&(a=o),u>=0?(r=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(r=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),i>l||r>a)||((r>i||i!==i)&&(i=r),(l<a||a!==a)&&(a=l),a<0)?null:this.at(i>=0?i:a,e)}intersectsBox(t){return this.intersectBox(t,Ti)!==null}intersectTriangle(t,e,i,a,s){wc.subVectors(e,t),ko.subVectors(i,t),Ec.crossVectors(wc,ko);let o=this.direction.dot(Ec),r;if(o>0){if(a)return null;r=1}else if(o<0)r=-1,o=-o;else return null;Wi.subVectors(this.origin,t);const l=r*this.direction.dot(ko.crossVectors(Wi,ko));if(l<0)return null;const c=r*this.direction.dot(wc.cross(Wi));if(c<0||l+c>o)return null;const h=-r*Wi.dot(Ec);return h<0?null:this.at(h/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ue{constructor(t,e,i,a,s,o,r,l,c,h,u,d,f,g,_,m){Ue.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,l,c,h,u,d,f,g,_,m)}set(t,e,i,a,s,o,r,l,c,h,u,d,f,g,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=a,p[1]=s,p[5]=o,p[9]=r,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ue().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,a=1/Wa.setFromMatrixColumn(t,0).length(),s=1/Wa.setFromMatrixColumn(t,1).length(),o=1/Wa.setFromMatrixColumn(t,2).length();return e[0]=i[0]*a,e[1]=i[1]*a,e[2]=i[2]*a,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,a=t.y,s=t.z,o=Math.cos(i),r=Math.sin(i),l=Math.cos(a),c=Math.sin(a),h=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){const d=o*h,f=o*u,g=r*h,_=r*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=f+g*c,e[5]=d-_*c,e[9]=-r*l,e[2]=_-d*c,e[6]=g+f*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*h,f=l*u,g=c*h,_=c*u;e[0]=d+_*r,e[4]=g*r-f,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-r,e[2]=f*r-g,e[6]=_+d*r,e[10]=o*l}else if(t.order==="ZXY"){const d=l*h,f=l*u,g=c*h,_=c*u;e[0]=d-_*r,e[4]=-o*u,e[8]=g+f*r,e[1]=f+g*r,e[5]=o*h,e[9]=_-d*r,e[2]=-o*c,e[6]=r,e[10]=o*l}else if(t.order==="ZYX"){const d=o*h,f=o*u,g=r*h,_=r*u;e[0]=l*h,e[4]=g*c-f,e[8]=d*c+_,e[1]=l*u,e[5]=_*c+d,e[9]=f*c-g,e[2]=-c,e[6]=r*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,f=o*c,g=r*l,_=r*c;e[0]=l*h,e[4]=_-d*u,e[8]=g*u+f,e[1]=u,e[5]=o*h,e[9]=-r*h,e[2]=-c*h,e[6]=f*u+g,e[10]=d-_*u}else if(t.order==="XZY"){const d=o*l,f=o*c,g=r*l,_=r*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+_,e[5]=o*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=r*h,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(uy,t,fy)}lookAt(t,e,i){const a=this.elements;return zn.subVectors(t,e),zn.lengthSq()===0&&(zn.z=1),zn.normalize(),Yi.crossVectors(i,zn),Yi.lengthSq()===0&&(Math.abs(i.z)===1?zn.x+=1e-4:zn.z+=1e-4,zn.normalize(),Yi.crossVectors(i,zn)),Yi.normalize(),Io.crossVectors(zn,Yi),a[0]=Yi.x,a[4]=Io.x,a[8]=zn.x,a[1]=Yi.y,a[5]=Io.y,a[9]=zn.y,a[2]=Yi.z,a[6]=Io.z,a[10]=zn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[4],l=i[8],c=i[12],h=i[1],u=i[5],d=i[9],f=i[13],g=i[2],_=i[6],m=i[10],p=i[14],y=i[3],x=i[7],v=i[11],w=i[15],S=a[0],T=a[4],E=a[8],b=a[12],M=a[1],R=a[5],C=a[9],z=a[13],N=a[2],D=a[6],L=a[10],F=a[14],H=a[3],Y=a[7],it=a[11],mt=a[15];return s[0]=o*S+r*M+l*N+c*H,s[4]=o*T+r*R+l*D+c*Y,s[8]=o*E+r*C+l*L+c*it,s[12]=o*b+r*z+l*F+c*mt,s[1]=h*S+u*M+d*N+f*H,s[5]=h*T+u*R+d*D+f*Y,s[9]=h*E+u*C+d*L+f*it,s[13]=h*b+u*z+d*F+f*mt,s[2]=g*S+_*M+m*N+p*H,s[6]=g*T+_*R+m*D+p*Y,s[10]=g*E+_*C+m*L+p*it,s[14]=g*b+_*z+m*F+p*mt,s[3]=y*S+x*M+v*N+w*H,s[7]=y*T+x*R+v*D+w*Y,s[11]=y*E+x*C+v*L+w*it,s[15]=y*b+x*z+v*F+w*mt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],a=t[8],s=t[12],o=t[1],r=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+s*l*u-a*c*u-s*r*d+i*c*d+a*r*f-i*l*f)+_*(+e*l*f-e*c*d+s*o*d-a*o*f+a*c*h-s*l*h)+m*(+e*c*u-e*r*f-s*o*u+i*o*f+s*r*h-i*c*h)+p*(-a*r*h-e*l*u+e*r*d+a*o*u-i*o*d+i*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const a=this.elements;return t.isVector3?(a[12]=t.x,a[13]=t.y,a[14]=t.z):(a[12]=t,a[13]=e,a[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],_=t[13],m=t[14],p=t[15],y=u*m*c-_*d*c+_*l*f-r*m*f-u*l*p+r*d*p,x=g*d*c-h*m*c-g*l*f+o*m*f+h*l*p-o*d*p,v=h*_*c-g*u*c+g*r*f-o*_*f-h*r*p+o*u*p,w=g*u*l-h*_*l-g*r*d+o*_*d+h*r*m-o*u*m,S=e*y+i*x+a*v+s*w;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/S;return t[0]=y*T,t[1]=(_*d*s-u*m*s-_*a*f+i*m*f+u*a*p-i*d*p)*T,t[2]=(r*m*s-_*l*s+_*a*c-i*m*c-r*a*p+i*l*p)*T,t[3]=(u*l*s-r*d*s-u*a*c+i*d*c+r*a*f-i*l*f)*T,t[4]=x*T,t[5]=(h*m*s-g*d*s+g*a*f-e*m*f-h*a*p+e*d*p)*T,t[6]=(g*l*s-o*m*s-g*a*c+e*m*c+o*a*p-e*l*p)*T,t[7]=(o*d*s-h*l*s+h*a*c-e*d*c-o*a*f+e*l*f)*T,t[8]=v*T,t[9]=(g*u*s-h*_*s-g*i*f+e*_*f+h*i*p-e*u*p)*T,t[10]=(o*_*s-g*r*s+g*i*c-e*_*c-o*i*p+e*r*p)*T,t[11]=(h*r*s-o*u*s-h*i*c+e*u*c+o*i*f-e*r*f)*T,t[12]=w*T,t[13]=(h*_*a-g*u*a+g*i*d-e*_*d-h*i*m+e*u*m)*T,t[14]=(g*r*a-o*_*a-g*i*l+e*_*l+o*i*m-e*r*m)*T,t[15]=(o*u*a-h*r*a+h*i*l-e*u*l-o*i*d+e*r*d)*T,this}scale(t){const e=this.elements,i=t.x,a=t.y,s=t.z;return e[0]*=i,e[4]*=a,e[8]*=s,e[1]*=i,e[5]*=a,e[9]*=s,e[2]*=i,e[6]*=a,e[10]*=s,e[3]*=i,e[7]*=a,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],a=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,a))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),a=Math.sin(e),s=1-i,o=t.x,r=t.y,l=t.z,c=s*o,h=s*r;return this.set(c*o+i,c*r-a*l,c*l+a*r,0,c*r+a*l,h*r+i,h*l-a*o,0,c*l-a*r,h*l+a*o,s*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,a,s,o){return this.set(1,i,s,0,t,1,o,0,e,a,1,0,0,0,0,1),this}compose(t,e,i){const a=this.elements,s=e._x,o=e._y,r=e._z,l=e._w,c=s+s,h=o+o,u=r+r,d=s*c,f=s*h,g=s*u,_=o*h,m=o*u,p=r*u,y=l*c,x=l*h,v=l*u,w=i.x,S=i.y,T=i.z;return a[0]=(1-(_+p))*w,a[1]=(f+v)*w,a[2]=(g-x)*w,a[3]=0,a[4]=(f-v)*S,a[5]=(1-(d+p))*S,a[6]=(m+y)*S,a[7]=0,a[8]=(g+x)*T,a[9]=(m-y)*T,a[10]=(1-(d+_))*T,a[11]=0,a[12]=t.x,a[13]=t.y,a[14]=t.z,a[15]=1,this}decompose(t,e,i){const a=this.elements;let s=Wa.set(a[0],a[1],a[2]).length();const o=Wa.set(a[4],a[5],a[6]).length(),r=Wa.set(a[8],a[9],a[10]).length();this.determinant()<0&&(s=-s),t.x=a[12],t.y=a[13],t.z=a[14],ii.copy(this);const c=1/s,h=1/o,u=1/r;return ii.elements[0]*=c,ii.elements[1]*=c,ii.elements[2]*=c,ii.elements[4]*=h,ii.elements[5]*=h,ii.elements[6]*=h,ii.elements[8]*=u,ii.elements[9]*=u,ii.elements[10]*=u,e.setFromRotationMatrix(ii),i.x=s,i.y=o,i.z=r,this}makePerspective(t,e,i,a,s,o,r=zi){const l=this.elements,c=2*s/(e-t),h=2*s/(i-a),u=(e+t)/(e-t),d=(i+a)/(i-a);let f,g;if(r===zi)f=-(o+s)/(o-s),g=-2*o*s/(o-s);else if(r===Tr)f=-o/(o-s),g=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,a,s,o,r=zi){const l=this.elements,c=1/(e-t),h=1/(i-a),u=1/(o-s),d=(e+t)*c,f=(i+a)*h;let g,_;if(r===zi)g=(o+s)*u,_=-2*u;else if(r===Tr)g=s*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<16;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Wa=new B,ii=new Ue,uy=new B(0,0,0),fy=new B(1,1,1),Yi=new B,Io=new B,zn=new B,hu=new Ue,du=new uo;class _i{constructor(t=0,e=0,i=0,a=_i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=a}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,a=this._order){return this._x=t,this._y=e,this._z=i,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const a=t.elements,s=a[0],o=a[4],r=a[8],l=a[1],c=a[5],h=a[9],u=a[2],d=a[6],f=a[10];switch(e){case"XYZ":this._y=Math.asin(fn(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-fn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(fn(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-fn(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(fn(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(r,f));break;case"XZY":this._z=Math.asin(-fn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(r,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return hu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(hu,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return du.setFromEuler(this),this.setFromQuaternion(du,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}_i.DEFAULT_ORDER="XYZ";class Rh{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let py=0;const uu=new B,Ya=new uo,Ai=new Ue,zo=new B,zs=new B,my=new B,gy=new uo,fu=new B(1,0,0),pu=new B(0,1,0),mu=new B(0,0,1),gu={type:"added"},xy={type:"removed"},$a={type:"childadded",child:null},Tc={type:"childremoved",child:null};class Ze extends Ss{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:py++}),this.uuid=yi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ze.DEFAULT_UP.clone();const t=new B,e=new _i,i=new uo,a=new B(1,1,1);function s(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new Ue},normalMatrix:{value:new pe}}),this.matrix=new Ue,this.matrixWorld=new Ue,this.matrixAutoUpdate=Ze.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ze.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Rh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ya.setFromAxisAngle(t,e),this.quaternion.multiply(Ya),this}rotateOnWorldAxis(t,e){return Ya.setFromAxisAngle(t,e),this.quaternion.premultiply(Ya),this}rotateX(t){return this.rotateOnAxis(fu,t)}rotateY(t){return this.rotateOnAxis(pu,t)}rotateZ(t){return this.rotateOnAxis(mu,t)}translateOnAxis(t,e){return uu.copy(t).applyQuaternion(this.quaternion),this.position.add(uu.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(fu,t)}translateY(t){return this.translateOnAxis(pu,t)}translateZ(t){return this.translateOnAxis(mu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Ai.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?zo.copy(t):zo.set(t,e,i);const a=this.parent;this.updateWorldMatrix(!0,!1),zs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ai.lookAt(zs,zo,this.up):Ai.lookAt(zo,zs,this.up),this.quaternion.setFromRotationMatrix(Ai),a&&(Ai.extractRotation(a.matrixWorld),Ya.setFromRotationMatrix(Ai),this.quaternion.premultiply(Ya.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(gu),$a.child=t,this.dispatchEvent($a),$a.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(xy),Tc.child=t,this.dispatchEvent(Tc),Tc.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Ai.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Ai.multiply(t.parent.matrixWorld)),t.applyMatrix4(Ai),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(gu),$a.child=t,this.dispatchEvent($a),$a.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,a=this.children.length;i<a;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zs,t,my),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zs,gy,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function s(r,l){return r[l.uuid]===void 0&&(r[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=s(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const l=r.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];s(t.shapes,u)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let l=0,c=this.material.length;l<c;l++)r.push(s(t.materials,this.material[l]));a.material=r}else a.material=s(t.materials,this.material);if(this.children.length>0){a.children=[];for(let r=0;r<this.children.length;r++)a.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){a.animations=[];for(let r=0;r<this.animations.length;r++){const l=this.animations[r];a.animations.push(s(t.animations,l))}}if(e){const r=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),g=o(t.nodes);r.length>0&&(i.geometries=r),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=a,i;function o(r){const l=[];for(const c in r){const h=r[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const a=t.children[i];this.add(a.clone())}return this}}Ze.DEFAULT_UP=new B(0,1,0);Ze.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ze.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ai=new B,Ri=new B,Ac=new B,Pi=new B,Za=new B,ja=new B,xu=new B,Rc=new B,Pc=new B,Cc=new B,Lc=new Je,Dc=new Je,kc=new Je;class On{constructor(t=new B,e=new B,i=new B){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,a){a.subVectors(i,e),ai.subVectors(t,e),a.cross(ai);const s=a.lengthSq();return s>0?a.multiplyScalar(1/Math.sqrt(s)):a.set(0,0,0)}static getBarycoord(t,e,i,a,s){ai.subVectors(a,e),Ri.subVectors(i,e),Ac.subVectors(t,e);const o=ai.dot(ai),r=ai.dot(Ri),l=ai.dot(Ac),c=Ri.dot(Ri),h=Ri.dot(Ac),u=o*c-r*r;if(u===0)return s.set(0,0,0),null;const d=1/u,f=(c*l-r*h)*d,g=(o*h-r*l)*d;return s.set(1-f-g,g,f)}static containsPoint(t,e,i,a){return this.getBarycoord(t,e,i,a,Pi)===null?!1:Pi.x>=0&&Pi.y>=0&&Pi.x+Pi.y<=1}static getInterpolation(t,e,i,a,s,o,r,l){return this.getBarycoord(t,e,i,a,Pi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Pi.x),l.addScaledVector(o,Pi.y),l.addScaledVector(r,Pi.z),l)}static getInterpolatedAttribute(t,e,i,a,s,o){return Lc.setScalar(0),Dc.setScalar(0),kc.setScalar(0),Lc.fromBufferAttribute(t,e),Dc.fromBufferAttribute(t,i),kc.fromBufferAttribute(t,a),o.setScalar(0),o.addScaledVector(Lc,s.x),o.addScaledVector(Dc,s.y),o.addScaledVector(kc,s.z),o}static isFrontFacing(t,e,i,a){return ai.subVectors(i,e),Ri.subVectors(t,e),ai.cross(Ri).dot(a)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,a){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[a]),this}setFromAttributeAndIndices(t,e,i,a){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,a),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return ai.subVectors(this.c,this.b),Ri.subVectors(this.a,this.b),ai.cross(Ri).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return On.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return On.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,a,s){return On.getInterpolation(t,this.a,this.b,this.c,e,i,a,s)}containsPoint(t){return On.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return On.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,a=this.b,s=this.c;let o,r;Za.subVectors(a,i),ja.subVectors(s,i),Rc.subVectors(t,i);const l=Za.dot(Rc),c=ja.dot(Rc);if(l<=0&&c<=0)return e.copy(i);Pc.subVectors(t,a);const h=Za.dot(Pc),u=ja.dot(Pc);if(h>=0&&u<=h)return e.copy(a);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(i).addScaledVector(Za,o);Cc.subVectors(t,s);const f=Za.dot(Cc),g=ja.dot(Cc);if(g>=0&&f<=g)return e.copy(s);const _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return r=c/(c-g),e.copy(i).addScaledVector(ja,r);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return xu.subVectors(s,a),r=(u-h)/(u-h+(f-g)),e.copy(a).addScaledVector(xu,r);const p=1/(m+_+d);return o=_*p,r=d*p,e.copy(i).addScaledVector(Za,o).addScaledVector(ja,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const vp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},$i={h:0,s:0,l:0},Fo={h:0,s:0,l:0};function Ic(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class ne{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const a=t;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=En){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Se.toWorkingColorSpace(this,e),this}setRGB(t,e,i,a=Se.workingColorSpace){return this.r=t,this.g=e,this.b=i,Se.toWorkingColorSpace(this,a),this}setHSL(t,e,i,a=Se.workingColorSpace){if(t=Th(t,1),e=fn(e,0,1),i=fn(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,o=2*i-s;this.r=Ic(o,s,t+1/3),this.g=Ic(o,s,t),this.b=Ic(o,s,t-1/3)}return Se.toWorkingColorSpace(this,a),this}setStyle(t,e=En){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=a[1],r=a[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=a[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=En){const i=vp[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Fi(t.r),this.g=Fi(t.g),this.b=Fi(t.b),this}copyLinearToSRGB(t){return this.r=us(t.r),this.g=us(t.g),this.b=us(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=En){return Se.fromWorkingColorSpace(vn.copy(this),t),Math.round(fn(vn.r*255,0,255))*65536+Math.round(fn(vn.g*255,0,255))*256+Math.round(fn(vn.b*255,0,255))}getHexString(t=En){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Se.workingColorSpace){Se.fromWorkingColorSpace(vn.copy(this),e);const i=vn.r,a=vn.g,s=vn.b,o=Math.max(i,a,s),r=Math.min(i,a,s);let l,c;const h=(r+o)/2;if(r===o)l=0,c=0;else{const u=o-r;switch(c=h<=.5?u/(o+r):u/(2-o-r),o){case i:l=(a-s)/u+(a<s?6:0);break;case a:l=(s-i)/u+2;break;case s:l=(i-a)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Se.workingColorSpace){return Se.fromWorkingColorSpace(vn.copy(this),e),t.r=vn.r,t.g=vn.g,t.b=vn.b,t}getStyle(t=En){Se.fromWorkingColorSpace(vn.copy(this),t);const e=vn.r,i=vn.g,a=vn.b;return t!==En?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(a*255)})`}offsetHSL(t,e,i){return this.getHSL($i),this.setHSL($i.h+t,$i.s+e,$i.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL($i),t.getHSL(Fo);const i=$s($i.h,Fo.h,e),a=$s($i.s,Fo.s,e),s=$s($i.l,Fo.l,e);return this.setHSL(i,a,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,a=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*a,this.g=s[1]*e+s[4]*i+s[7]*a,this.b=s[2]*e+s[5]*i+s[8]*a,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const vn=new ne;ne.NAMES=vp;let vy=0;class Pa extends Ss{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:vy++}),this.uuid=yi(),this.name="",this.blending=ls,this.side=na,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ml,this.blendDst=gl,this.blendEquation=Ma,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ne(0,0,0),this.blendAlpha=0,this.depthFunc=gs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Jd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ba,this.stencilZFail=Ba,this.stencilZPass=Ba,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const a=this[e];if(a===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(i):a&&a.isVector3&&i&&i.isVector3?a.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ls&&(i.blending=this.blending),this.side!==na&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==ml&&(i.blendSrc=this.blendSrc),this.blendDst!==gl&&(i.blendDst=this.blendDst),this.blendEquation!==Ma&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==gs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Jd&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ba&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ba&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ba&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function a(s){const o=[];for(const r in s){const l=s[r];delete l.metadata,o.push(l)}return o}if(e){const s=a(t.textures),o=a(t.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const a=e.length;i=new Array(a);for(let s=0;s!==a;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class un extends Pa{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new ne(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _i,this.combine=yh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const en=new B,Uo=new $t;class pn{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=th,this.updateRanges=[],this.gpuType=Ii,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let a=0,s=this.itemSize;a<s;a++)this.array[t+a]=e.array[i+a];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Uo.fromBufferAttribute(this,e),Uo.applyMatrix3(t),this.setXY(e,Uo.x,Uo.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)en.fromBufferAttribute(this,e),en.applyMatrix3(t),this.setXYZ(e,en.x,en.y,en.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)en.fromBufferAttribute(this,e),en.applyMatrix4(t),this.setXYZ(e,en.x,en.y,en.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)en.fromBufferAttribute(this,e),en.applyNormalMatrix(t),this.setXYZ(e,en.x,en.y,en.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)en.fromBufferAttribute(this,e),en.transformDirection(t),this.setXYZ(e,en.x,en.y,en.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=si(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Pe(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=si(e,this.array)),e}setX(t,e){return this.normalized&&(e=Pe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=si(e,this.array)),e}setY(t,e){return this.normalized&&(e=Pe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=si(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Pe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=si(e,this.array)),e}setW(t,e){return this.normalized&&(e=Pe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Pe(e,this.array),i=Pe(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,a){return t*=this.itemSize,this.normalized&&(e=Pe(e,this.array),i=Pe(i,this.array),a=Pe(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t*=this.itemSize,this.normalized&&(e=Pe(e,this.array),i=Pe(i,this.array),a=Pe(a,this.array),s=Pe(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==th&&(t.usage=this.usage),t}}class yp extends pn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class _p extends pn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class we extends pn{constructor(t,e,i){super(new Float32Array(t),e,i)}}let yy=0;const Wn=new Ue,zc=new Ze,qa=new B,Fn=new fo,Fs=new fo,dn=new B;class an extends Ss{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:yy++}),this.uuid=yi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(mp(t)?_p:yp)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new pe().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(t),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Wn.makeRotationFromQuaternion(t),this.applyMatrix4(Wn),this}rotateX(t){return Wn.makeRotationX(t),this.applyMatrix4(Wn),this}rotateY(t){return Wn.makeRotationY(t),this.applyMatrix4(Wn),this}rotateZ(t){return Wn.makeRotationZ(t),this.applyMatrix4(Wn),this}translate(t,e,i){return Wn.makeTranslation(t,e,i),this.applyMatrix4(Wn),this}scale(t,e,i){return Wn.makeScale(t,e,i),this.applyMatrix4(Wn),this}lookAt(t){return zc.lookAt(t),zc.updateMatrix(),this.applyMatrix4(zc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(qa).negate(),this.translate(qa.x,qa.y,qa.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let a=0,s=t.length;a<s;a++){const o=t[a];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new we(i,3))}else{for(let i=0,a=e.count;i<a;i++){const s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new fo);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new B(-1/0,-1/0,-1/0),new B(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,a=e.length;i<a;i++){const s=e[i];Fn.setFromBufferAttribute(s),this.morphTargetsRelative?(dn.addVectors(this.boundingBox.min,Fn.min),this.boundingBox.expandByPoint(dn),dn.addVectors(this.boundingBox.max,Fn.max),this.boundingBox.expandByPoint(dn)):(this.boundingBox.expandByPoint(Fn.min),this.boundingBox.expandByPoint(Fn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Or);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new B,1/0);return}if(t){const i=this.boundingSphere.center;if(Fn.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const r=e[s];Fs.setFromBufferAttribute(r),this.morphTargetsRelative?(dn.addVectors(Fn.min,Fs.min),Fn.expandByPoint(dn),dn.addVectors(Fn.max,Fs.max),Fn.expandByPoint(dn)):(Fn.expandByPoint(Fs.min),Fn.expandByPoint(Fs.max))}Fn.getCenter(i);let a=0;for(let s=0,o=t.count;s<o;s++)dn.fromBufferAttribute(t,s),a=Math.max(a,i.distanceToSquared(dn));if(e)for(let s=0,o=e.length;s<o;s++){const r=e[s],l=this.morphTargetsRelative;for(let c=0,h=r.count;c<h;c++)dn.fromBufferAttribute(r,c),l&&(qa.fromBufferAttribute(t,c),dn.add(qa)),a=Math.max(a,i.distanceToSquared(dn))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,a=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new pn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),r=[],l=[];for(let E=0;E<i.count;E++)r[E]=new B,l[E]=new B;const c=new B,h=new B,u=new B,d=new $t,f=new $t,g=new $t,_=new B,m=new B;function p(E,b,M){c.fromBufferAttribute(i,E),h.fromBufferAttribute(i,b),u.fromBufferAttribute(i,M),d.fromBufferAttribute(s,E),f.fromBufferAttribute(s,b),g.fromBufferAttribute(s,M),h.sub(c),u.sub(c),f.sub(d),g.sub(d);const R=1/(f.x*g.y-g.x*f.y);isFinite(R)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(R),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(R),r[E].add(_),r[b].add(_),r[M].add(_),l[E].add(m),l[b].add(m),l[M].add(m))}let y=this.groups;y.length===0&&(y=[{start:0,count:t.count}]);for(let E=0,b=y.length;E<b;++E){const M=y[E],R=M.start,C=M.count;for(let z=R,N=R+C;z<N;z+=3)p(t.getX(z+0),t.getX(z+1),t.getX(z+2))}const x=new B,v=new B,w=new B,S=new B;function T(E){w.fromBufferAttribute(a,E),S.copy(w);const b=r[E];x.copy(b),x.sub(w.multiplyScalar(w.dot(b))).normalize(),v.crossVectors(S,b);const R=v.dot(l[E])<0?-1:1;o.setXYZW(E,x.x,x.y,x.z,R)}for(let E=0,b=y.length;E<b;++E){const M=y[E],R=M.start,C=M.count;for(let z=R,N=R+C;z<N;z+=3)T(t.getX(z+0)),T(t.getX(z+1)),T(t.getX(z+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new pn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const a=new B,s=new B,o=new B,r=new B,l=new B,c=new B,h=new B,u=new B;if(t)for(let d=0,f=t.count;d<f;d+=3){const g=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);a.fromBufferAttribute(e,g),s.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),h.subVectors(o,s),u.subVectors(a,s),h.cross(u),r.fromBufferAttribute(i,g),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,m),r.add(h),l.add(h),c.add(h),i.setXYZ(g,r.x,r.y,r.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)a.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,s),u.subVectors(a,s),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)dn.fromBufferAttribute(t,e),dn.normalize(),t.setXYZ(e,dn.x,dn.y,dn.z)}toNonIndexed(){function t(r,l){const c=r.array,h=r.itemSize,u=r.normalized,d=new c.constructor(l.length*h);let f=0,g=0;for(let _=0,m=l.length;_<m;_++){r.isInterleavedBufferAttribute?f=l[_]*r.data.stride+r.offset:f=l[_]*h;for(let p=0;p<h;p++)d[g++]=c[f++]}return new pn(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new an,i=this.index.array,a=this.attributes;for(const r in a){const l=a[r],c=t(l,i);e.setAttribute(r,c)}const s=this.morphAttributes;for(const r in s){const l=[],c=s[r];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=t(d,i);l.push(f)}e.morphAttributes[r]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,l=o.length;r<l;r++){const c=o[r];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const a={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(t.data))}h.length>0&&(a[l]=h,s=!0)}s&&(t.data.morphAttributes=a,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const a=t.attributes;for(const c in a){const h=a[c];this.setAttribute(c,h.clone(e))}const s=t.morphAttributes;for(const c in s){const h=[],u=s[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const vu=new Ue,da=new Ah,No=new Or,yu=new B,Oo=new B,Bo=new B,Ho=new B,Fc=new B,Go=new B,_u=new B,Vo=new B;class _e extends Ze{constructor(t=new an,e=new un){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}getVertexPosition(t,e){const i=this.geometry,a=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(a,t);const r=this.morphTargetInfluences;if(s&&r){Go.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=r[l],u=s[l];h!==0&&(Fc.fromBufferAttribute(u,t),o?Go.addScaledVector(Fc,h):Go.addScaledVector(Fc.sub(e),h))}e.add(Go)}return e}raycast(t,e){const i=this.geometry,a=this.material,s=this.matrixWorld;a!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),No.copy(i.boundingSphere),No.applyMatrix4(s),da.copy(t.ray).recast(t.near),!(No.containsPoint(da.origin)===!1&&(da.intersectSphere(No,yu)===null||da.origin.distanceToSquared(yu)>(t.far-t.near)**2))&&(vu.copy(s).invert(),da.copy(t.ray).applyMatrix4(vu),!(i.boundingBox!==null&&da.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,da)))}_computeIntersections(t,e,i){let a;const s=this.geometry,o=this.material,r=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,f=s.drawRange;if(r!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=o[m.materialIndex],y=Math.max(m.start,f.start),x=Math.min(r.count,Math.min(m.start+m.count,f.start+f.count));for(let v=y,w=x;v<w;v+=3){const S=r.getX(v),T=r.getX(v+1),E=r.getX(v+2);a=Xo(this,p,t,i,c,h,u,S,T,E),a&&(a.faceIndex=Math.floor(v/3),a.face.materialIndex=m.materialIndex,e.push(a))}}else{const g=Math.max(0,f.start),_=Math.min(r.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const y=r.getX(m),x=r.getX(m+1),v=r.getX(m+2);a=Xo(this,o,t,i,c,h,u,y,x,v),a&&(a.faceIndex=Math.floor(m/3),e.push(a))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=o[m.materialIndex],y=Math.max(m.start,f.start),x=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let v=y,w=x;v<w;v+=3){const S=v,T=v+1,E=v+2;a=Xo(this,p,t,i,c,h,u,S,T,E),a&&(a.faceIndex=Math.floor(v/3),a.face.materialIndex=m.materialIndex,e.push(a))}}else{const g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const y=m,x=m+1,v=m+2;a=Xo(this,o,t,i,c,h,u,y,x,v),a&&(a.faceIndex=Math.floor(m/3),e.push(a))}}}}function _y(n,t,e,i,a,s,o,r){let l;if(t.side===Pn?l=i.intersectTriangle(o,s,a,!0,r):l=i.intersectTriangle(a,s,o,t.side===na,r),l===null)return null;Vo.copy(r),Vo.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(Vo);return c<e.near||c>e.far?null:{distance:c,point:Vo.clone(),object:n}}function Xo(n,t,e,i,a,s,o,r,l,c){n.getVertexPosition(r,Oo),n.getVertexPosition(l,Bo),n.getVertexPosition(c,Ho);const h=_y(n,t,e,i,Oo,Bo,Ho,_u);if(h){const u=new B;On.getBarycoord(_u,Oo,Bo,Ho,u),a&&(h.uv=On.getInterpolatedAttribute(a,r,l,c,u,new $t)),s&&(h.uv1=On.getInterpolatedAttribute(s,r,l,c,u,new $t)),o&&(h.normal=On.getInterpolatedAttribute(o,r,l,c,u,new B),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:r,b:l,c,normal:new B,materialIndex:0};On.getNormal(Oo,Bo,Ho,d.normal),h.face=d,h.barycoord=u}return h}class ci extends an{constructor(t=1,e=1,i=1,a=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:a,heightSegments:s,depthSegments:o};const r=this;a=Math.floor(a),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,i,e,t,o,s,0),g("z","y","x",1,-1,i,e,-t,o,s,1),g("x","z","y",1,1,t,i,e,a,o,2),g("x","z","y",1,-1,t,i,-e,a,o,3),g("x","y","z",1,-1,t,e,i,a,s,4),g("x","y","z",-1,-1,t,e,-i,a,s,5),this.setIndex(l),this.setAttribute("position",new we(c,3)),this.setAttribute("normal",new we(h,3)),this.setAttribute("uv",new we(u,2));function g(_,m,p,y,x,v,w,S,T,E,b){const M=v/T,R=w/E,C=v/2,z=w/2,N=S/2,D=T+1,L=E+1;let F=0,H=0;const Y=new B;for(let it=0;it<L;it++){const mt=it*R-z;for(let _t=0;_t<D;_t++){const Lt=_t*M-C;Y[_]=Lt*y,Y[m]=mt*x,Y[p]=N,c.push(Y.x,Y.y,Y.z),Y[_]=0,Y[m]=0,Y[p]=S>0?1:-1,h.push(Y.x,Y.y,Y.z),u.push(_t/T),u.push(1-it/E),F+=1}}for(let it=0;it<E;it++)for(let mt=0;mt<T;mt++){const _t=d+mt+D*it,Lt=d+mt+D*(it+1),J=d+(mt+1)+D*(it+1),et=d+(mt+1)+D*it;l.push(_t,Lt,et),l.push(Lt,J,et),H+=6}r.addGroup(f,H,b),f+=H,d+=F}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ci(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ms(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const a=n[e][i];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=a.clone():Array.isArray(a)?t[e][i]=a.slice():t[e][i]=a}}return t}function wn(n){const t={};for(let e=0;e<n.length;e++){const i=Ms(n[e]);for(const a in i)t[a]=i[a]}return t}function My(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Mp(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Se.workingColorSpace}const by={clone:Ms,merge:wn};var Sy=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,wy=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ia extends Pa{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Sy,this.fragmentShader=wy,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ms(t.uniforms),this.uniformsGroups=My(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const a in this.uniforms){const o=this.uniforms[a].value;o&&o.isTexture?e.uniforms[a]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[a]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[a]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[a]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[a]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[a]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[a]={type:"m4",value:o.toArray()}:e.uniforms[a]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const a in this.extensions)this.extensions[a]===!0&&(i[a]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class bp extends Ze{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ue,this.projectionMatrix=new Ue,this.projectionMatrixInverse=new Ue,this.coordinateSystem=zi}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Zi=new B,Mu=new $t,bu=new $t;class $n extends bp{constructor(t=50,e=1,i=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=a,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=io*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ds*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return io*2*Math.atan(Math.tan(ds*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Zi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Zi.x,Zi.y).multiplyScalar(-t/Zi.z),Zi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Zi.x,Zi.y).multiplyScalar(-t/Zi.z)}getViewSize(t,e){return this.getViewBounds(t,Mu,bu),e.subVectors(bu,Mu)}setViewOffset(t,e,i,a,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ds*.5*this.fov)/this.zoom,i=2*e,a=this.aspect*i,s=-.5*a;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*a/l,e-=o.offsetY*i/c,a*=o.width/l,i*=o.height/c}const r=this.filmOffset;r!==0&&(s+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+a,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Ka=-90,Ja=1;class Ey extends Ze{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new $n(Ka,Ja,t,e);a.layers=this.layers,this.add(a);const s=new $n(Ka,Ja,t,e);s.layers=this.layers,this.add(s);const o=new $n(Ka,Ja,t,e);o.layers=this.layers,this.add(o);const r=new $n(Ka,Ja,t,e);r.layers=this.layers,this.add(r);const l=new $n(Ka,Ja,t,e);l.layers=this.layers,this.add(l);const c=new $n(Ka,Ja,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,a,s,o,r,l]=e;for(const c of e)this.remove(c);if(t===zi)i.up.set(0,1,0),i.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Tr)i.up.set(0,-1,0),i.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:a}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,r,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,a),t.render(e,s),t.setRenderTarget(i,1,a),t.render(e,o),t.setRenderTarget(i,2,a),t.render(e,r),t.setRenderTarget(i,3,a),t.render(e,l),t.setRenderTarget(i,4,a),t.render(e,c),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,a),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Sp extends Tn{constructor(t,e,i,a,s,o,r,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:xs,super(t,e,i,a,s,o,r,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Ty extends Aa{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},a=[i,i,i,i,i,i];this.texture=new Sp(a,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:xi}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},a=new ci(5,5,5),s=new ia({name:"CubemapFromEquirect",uniforms:Ms(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Pn,blending:Qi});s.uniforms.tEquirect.value=e;const o=new _e(a,s),r=e.minFilter;return e.minFilter===wa&&(e.minFilter=xi),new Ey(1,10,this).update(t,o),e.minFilter=r,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,a){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,a);t.setRenderTarget(s)}}const Uc=new B,Ay=new B,Ry=new pe;class va{constructor(t=new B(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,a){return this.normal.set(t,e,i),this.constant=a,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const a=Uc.subVectors(i,e).cross(Ay.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(a,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(Uc),a=this.normal.dot(i);if(a===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/a;return s<0||s>1?null:e.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||Ry.getNormalMatrix(t),a=this.coplanarPoint(Uc).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-a.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ua=new Or,Wo=new B;class Ph{constructor(t=new va,e=new va,i=new va,a=new va,s=new va,o=new va){this.planes=[t,e,i,a,s,o]}set(t,e,i,a,s,o){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(a),r[4].copy(s),r[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=zi){const i=this.planes,a=t.elements,s=a[0],o=a[1],r=a[2],l=a[3],c=a[4],h=a[5],u=a[6],d=a[7],f=a[8],g=a[9],_=a[10],m=a[11],p=a[12],y=a[13],x=a[14],v=a[15];if(i[0].setComponents(l-s,d-c,m-f,v-p).normalize(),i[1].setComponents(l+s,d+c,m+f,v+p).normalize(),i[2].setComponents(l+o,d+h,m+g,v+y).normalize(),i[3].setComponents(l-o,d-h,m-g,v-y).normalize(),i[4].setComponents(l-r,d-u,m-_,v-x).normalize(),e===zi)i[5].setComponents(l+r,d+u,m+_,v+x).normalize();else if(e===Tr)i[5].setComponents(r,u,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ua.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ua.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ua)}intersectsSprite(t){return ua.center.set(0,0,0),ua.radius=.7071067811865476,ua.applyMatrix4(t.matrixWorld),this.intersectsSphere(ua)}intersectsSphere(t){const e=this.planes,i=t.center,a=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<a)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const a=e[i];if(Wo.x=a.normal.x>0?t.max.x:t.min.x,Wo.y=a.normal.y>0?t.max.y:t.min.y,Wo.z=a.normal.z>0?t.max.z:t.min.z,a.distanceToPoint(Wo)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function wp(){let n=null,t=!1,e=null,i=null;function a(s,o){e(s,o),i=n.requestAnimationFrame(a)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(a),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){n=s}}}function Py(n){const t=new WeakMap;function e(r,l){const c=r.array,h=r.usage,u=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,h),r.onUploadCallback();let f;if(c instanceof Float32Array)f=n.FLOAT;else if(c instanceof Uint16Array)r.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=n.SHORT;else if(c instanceof Uint32Array)f=n.UNSIGNED_INT;else if(c instanceof Int32Array)f=n.INT;else if(c instanceof Int8Array)f=n.BYTE;else if(c instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:r.version,size:u}}function i(r,l,c){const h=l.array,u=l.updateRanges;if(n.bindBuffer(c,r),u.length===0)n.bufferSubData(c,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){const g=u[d],_=u[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){const _=u[f];n.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function a(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function s(r){r.isInterleavedBufferAttribute&&(r=r.data);const l=t.get(r);l&&(n.deleteBuffer(l.buffer),t.delete(r))}function o(r,l){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const h=t.get(r);(!h||h.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const c=t.get(r);if(c===void 0)t.set(r,e(r,l));else if(c.version<r.version){if(c.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,r,l),c.version=r.version}}return{get:a,remove:s,update:o}}class Yn extends an{constructor(t=1,e=1,i=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:a};const s=t/2,o=e/2,r=Math.floor(i),l=Math.floor(a),c=r+1,h=l+1,u=t/r,d=e/l,f=[],g=[],_=[],m=[];for(let p=0;p<h;p++){const y=p*d-o;for(let x=0;x<c;x++){const v=x*u-s;g.push(v,-y,0),_.push(0,0,1),m.push(x/r),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let y=0;y<r;y++){const x=y+c*p,v=y+c*(p+1),w=y+1+c*(p+1),S=y+1+c*p;f.push(x,v,S),f.push(v,w,S)}this.setIndex(f),this.setAttribute("position",new we(g,3)),this.setAttribute("normal",new we(_,3)),this.setAttribute("uv",new we(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Yn(t.width,t.height,t.widthSegments,t.heightSegments)}}var Cy=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ly=`#ifdef USE_ALPHAHASH
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
#endif`,Dy=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ky=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Iy=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,zy=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Fy=`#ifdef USE_AOMAP
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
#endif`,Uy=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Ny=`#ifdef USE_BATCHING
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
#endif`,Oy=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,By=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Hy=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Gy=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Vy=`#ifdef USE_IRIDESCENCE
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
#endif`,Xy=`#ifdef USE_BUMPMAP
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
#endif`,Wy=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Yy=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,$y=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Zy=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,jy=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,qy=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Ky=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Jy=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Qy=`#define PI 3.141592653589793
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
} // validated`,t_=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,e_=`vec3 transformedNormal = objectNormal;
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
#endif`,n_=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,i_=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,a_=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,s_=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,o_="gl_FragColor = linearToOutputTexel( gl_FragColor );",r_=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,c_=`#ifdef USE_ENVMAP
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
#endif`,l_=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,h_=`#ifdef USE_ENVMAP
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
#endif`,d_=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,u_=`#ifdef USE_ENVMAP
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
#endif`,f_=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,p_=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,m_=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,g_=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,x_=`#ifdef USE_GRADIENTMAP
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
}`,v_=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,y_=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,__=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,M_=`uniform bool receiveShadow;
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
#endif`,b_=`#ifdef USE_ENVMAP
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
#endif`,S_=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,w_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,E_=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,T_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,A_=`PhysicalMaterial material;
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
#endif`,R_=`struct PhysicalMaterial {
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
}`,P_=`
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
#endif`,C_=`#if defined( RE_IndirectDiffuse )
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
#endif`,L_=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,D_=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,k_=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,I_=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,z_=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,F_=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,U_=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,N_=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,O_=`#if defined( USE_POINTS_UV )
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
#endif`,B_=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,H_=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,G_=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,V_=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,X_=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,W_=`#ifdef USE_MORPHTARGETS
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
#endif`,Y_=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,$_=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Z_=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,j_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,q_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,K_=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,J_=`#ifdef USE_NORMALMAP
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
#endif`,Q_=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,tM=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,eM=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,nM=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,iM=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,aM=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,sM=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,oM=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,rM=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,cM=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,lM=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,hM=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,dM=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,uM=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,fM=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,pM=`float getShadowMask() {
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
}`,mM=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,gM=`#ifdef USE_SKINNING
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
#endif`,xM=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,vM=`#ifdef USE_SKINNING
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
#endif`,yM=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,_M=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,MM=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,bM=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,SM=`#ifdef USE_TRANSMISSION
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
#endif`,wM=`#ifdef USE_TRANSMISSION
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
#endif`,EM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,TM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,AM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,RM=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const PM=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,CM=`uniform sampler2D t2D;
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
}`,LM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,DM=`#ifdef ENVMAP_TYPE_CUBE
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
}`,kM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,IM=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zM=`#include <common>
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
}`,FM=`#if DEPTH_PACKING == 3200
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
}`,UM=`#define DISTANCE
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
}`,NM=`#define DISTANCE
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
}`,OM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,BM=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,HM=`uniform float scale;
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
}`,GM=`uniform vec3 diffuse;
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
}`,VM=`#include <common>
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
}`,XM=`uniform vec3 diffuse;
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
}`,WM=`#define LAMBERT
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
}`,YM=`#define LAMBERT
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
}`,$M=`#define MATCAP
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
}`,ZM=`#define MATCAP
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
}`,jM=`#define NORMAL
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
}`,qM=`#define NORMAL
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
}`,KM=`#define PHONG
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
}`,JM=`#define PHONG
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
}`,QM=`#define STANDARD
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
}`,tb=`#define STANDARD
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
}`,eb=`#define TOON
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
}`,nb=`#define TOON
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
}`,ib=`uniform float size;
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
}`,ab=`uniform vec3 diffuse;
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
}`,sb=`#include <common>
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
}`,ob=`uniform vec3 color;
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
}`,rb=`uniform float rotation;
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
}`,cb=`uniform vec3 diffuse;
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
}`,xe={alphahash_fragment:Cy,alphahash_pars_fragment:Ly,alphamap_fragment:Dy,alphamap_pars_fragment:ky,alphatest_fragment:Iy,alphatest_pars_fragment:zy,aomap_fragment:Fy,aomap_pars_fragment:Uy,batching_pars_vertex:Ny,batching_vertex:Oy,begin_vertex:By,beginnormal_vertex:Hy,bsdfs:Gy,iridescence_fragment:Vy,bumpmap_pars_fragment:Xy,clipping_planes_fragment:Wy,clipping_planes_pars_fragment:Yy,clipping_planes_pars_vertex:$y,clipping_planes_vertex:Zy,color_fragment:jy,color_pars_fragment:qy,color_pars_vertex:Ky,color_vertex:Jy,common:Qy,cube_uv_reflection_fragment:t_,defaultnormal_vertex:e_,displacementmap_pars_vertex:n_,displacementmap_vertex:i_,emissivemap_fragment:a_,emissivemap_pars_fragment:s_,colorspace_fragment:o_,colorspace_pars_fragment:r_,envmap_fragment:c_,envmap_common_pars_fragment:l_,envmap_pars_fragment:h_,envmap_pars_vertex:d_,envmap_physical_pars_fragment:b_,envmap_vertex:u_,fog_vertex:f_,fog_pars_vertex:p_,fog_fragment:m_,fog_pars_fragment:g_,gradientmap_pars_fragment:x_,lightmap_pars_fragment:v_,lights_lambert_fragment:y_,lights_lambert_pars_fragment:__,lights_pars_begin:M_,lights_toon_fragment:S_,lights_toon_pars_fragment:w_,lights_phong_fragment:E_,lights_phong_pars_fragment:T_,lights_physical_fragment:A_,lights_physical_pars_fragment:R_,lights_fragment_begin:P_,lights_fragment_maps:C_,lights_fragment_end:L_,logdepthbuf_fragment:D_,logdepthbuf_pars_fragment:k_,logdepthbuf_pars_vertex:I_,logdepthbuf_vertex:z_,map_fragment:F_,map_pars_fragment:U_,map_particle_fragment:N_,map_particle_pars_fragment:O_,metalnessmap_fragment:B_,metalnessmap_pars_fragment:H_,morphinstance_vertex:G_,morphcolor_vertex:V_,morphnormal_vertex:X_,morphtarget_pars_vertex:W_,morphtarget_vertex:Y_,normal_fragment_begin:$_,normal_fragment_maps:Z_,normal_pars_fragment:j_,normal_pars_vertex:q_,normal_vertex:K_,normalmap_pars_fragment:J_,clearcoat_normal_fragment_begin:Q_,clearcoat_normal_fragment_maps:tM,clearcoat_pars_fragment:eM,iridescence_pars_fragment:nM,opaque_fragment:iM,packing:aM,premultiplied_alpha_fragment:sM,project_vertex:oM,dithering_fragment:rM,dithering_pars_fragment:cM,roughnessmap_fragment:lM,roughnessmap_pars_fragment:hM,shadowmap_pars_fragment:dM,shadowmap_pars_vertex:uM,shadowmap_vertex:fM,shadowmask_pars_fragment:pM,skinbase_vertex:mM,skinning_pars_vertex:gM,skinning_vertex:xM,skinnormal_vertex:vM,specularmap_fragment:yM,specularmap_pars_fragment:_M,tonemapping_fragment:MM,tonemapping_pars_fragment:bM,transmission_fragment:SM,transmission_pars_fragment:wM,uv_pars_fragment:EM,uv_pars_vertex:TM,uv_vertex:AM,worldpos_vertex:RM,background_vert:PM,background_frag:CM,backgroundCube_vert:LM,backgroundCube_frag:DM,cube_vert:kM,cube_frag:IM,depth_vert:zM,depth_frag:FM,distanceRGBA_vert:UM,distanceRGBA_frag:NM,equirect_vert:OM,equirect_frag:BM,linedashed_vert:HM,linedashed_frag:GM,meshbasic_vert:VM,meshbasic_frag:XM,meshlambert_vert:WM,meshlambert_frag:YM,meshmatcap_vert:$M,meshmatcap_frag:ZM,meshnormal_vert:jM,meshnormal_frag:qM,meshphong_vert:KM,meshphong_frag:JM,meshphysical_vert:QM,meshphysical_frag:tb,meshtoon_vert:eb,meshtoon_frag:nb,points_vert:ib,points_frag:ab,shadow_vert:sb,shadow_frag:ob,sprite_vert:rb,sprite_frag:cb},Xt={common:{diffuse:{value:new ne(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new pe},alphaMap:{value:null},alphaMapTransform:{value:new pe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new pe}},envmap:{envMap:{value:null},envMapRotation:{value:new pe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new pe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new pe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new pe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new pe},normalScale:{value:new $t(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new pe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new pe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new pe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new pe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ne(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ne(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new pe},alphaTest:{value:0},uvTransform:{value:new pe}},sprite:{diffuse:{value:new ne(16777215)},opacity:{value:1},center:{value:new $t(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new pe},alphaMap:{value:null},alphaMapTransform:{value:new pe},alphaTest:{value:0}}},gi={basic:{uniforms:wn([Xt.common,Xt.specularmap,Xt.envmap,Xt.aomap,Xt.lightmap,Xt.fog]),vertexShader:xe.meshbasic_vert,fragmentShader:xe.meshbasic_frag},lambert:{uniforms:wn([Xt.common,Xt.specularmap,Xt.envmap,Xt.aomap,Xt.lightmap,Xt.emissivemap,Xt.bumpmap,Xt.normalmap,Xt.displacementmap,Xt.fog,Xt.lights,{emissive:{value:new ne(0)}}]),vertexShader:xe.meshlambert_vert,fragmentShader:xe.meshlambert_frag},phong:{uniforms:wn([Xt.common,Xt.specularmap,Xt.envmap,Xt.aomap,Xt.lightmap,Xt.emissivemap,Xt.bumpmap,Xt.normalmap,Xt.displacementmap,Xt.fog,Xt.lights,{emissive:{value:new ne(0)},specular:{value:new ne(1118481)},shininess:{value:30}}]),vertexShader:xe.meshphong_vert,fragmentShader:xe.meshphong_frag},standard:{uniforms:wn([Xt.common,Xt.envmap,Xt.aomap,Xt.lightmap,Xt.emissivemap,Xt.bumpmap,Xt.normalmap,Xt.displacementmap,Xt.roughnessmap,Xt.metalnessmap,Xt.fog,Xt.lights,{emissive:{value:new ne(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:xe.meshphysical_vert,fragmentShader:xe.meshphysical_frag},toon:{uniforms:wn([Xt.common,Xt.aomap,Xt.lightmap,Xt.emissivemap,Xt.bumpmap,Xt.normalmap,Xt.displacementmap,Xt.gradientmap,Xt.fog,Xt.lights,{emissive:{value:new ne(0)}}]),vertexShader:xe.meshtoon_vert,fragmentShader:xe.meshtoon_frag},matcap:{uniforms:wn([Xt.common,Xt.bumpmap,Xt.normalmap,Xt.displacementmap,Xt.fog,{matcap:{value:null}}]),vertexShader:xe.meshmatcap_vert,fragmentShader:xe.meshmatcap_frag},points:{uniforms:wn([Xt.points,Xt.fog]),vertexShader:xe.points_vert,fragmentShader:xe.points_frag},dashed:{uniforms:wn([Xt.common,Xt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:xe.linedashed_vert,fragmentShader:xe.linedashed_frag},depth:{uniforms:wn([Xt.common,Xt.displacementmap]),vertexShader:xe.depth_vert,fragmentShader:xe.depth_frag},normal:{uniforms:wn([Xt.common,Xt.bumpmap,Xt.normalmap,Xt.displacementmap,{opacity:{value:1}}]),vertexShader:xe.meshnormal_vert,fragmentShader:xe.meshnormal_frag},sprite:{uniforms:wn([Xt.sprite,Xt.fog]),vertexShader:xe.sprite_vert,fragmentShader:xe.sprite_frag},background:{uniforms:{uvTransform:{value:new pe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:xe.background_vert,fragmentShader:xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new pe}},vertexShader:xe.backgroundCube_vert,fragmentShader:xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:xe.cube_vert,fragmentShader:xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:xe.equirect_vert,fragmentShader:xe.equirect_frag},distanceRGBA:{uniforms:wn([Xt.common,Xt.displacementmap,{referencePosition:{value:new B},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:xe.distanceRGBA_vert,fragmentShader:xe.distanceRGBA_frag},shadow:{uniforms:wn([Xt.lights,Xt.fog,{color:{value:new ne(0)},opacity:{value:1}}]),vertexShader:xe.shadow_vert,fragmentShader:xe.shadow_frag}};gi.physical={uniforms:wn([gi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new pe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new pe},clearcoatNormalScale:{value:new $t(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new pe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new pe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new pe},sheen:{value:0},sheenColor:{value:new ne(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new pe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new pe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new pe},transmissionSamplerSize:{value:new $t},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new pe},attenuationDistance:{value:0},attenuationColor:{value:new ne(0)},specularColor:{value:new ne(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new pe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new pe},anisotropyVector:{value:new $t},anisotropyMap:{value:null},anisotropyMapTransform:{value:new pe}}]),vertexShader:xe.meshphysical_vert,fragmentShader:xe.meshphysical_frag};const Yo={r:0,b:0,g:0},fa=new _i,lb=new Ue;function hb(n,t,e,i,a,s,o){const r=new ne(0);let l=s===!0?0:1,c,h,u=null,d=0,f=null;function g(y){let x=y.isScene===!0?y.background:null;return x&&x.isTexture&&(x=(y.backgroundBlurriness>0?e:t).get(x)),x}function _(y){let x=!1;const v=g(y);v===null?p(r,l):v&&v.isColor&&(p(v,1),x=!0);const w=n.xr.getEnvironmentBlendMode();w==="additive"?i.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(y,x){const v=g(x);v&&(v.isCubeTexture||v.mapping===Ur)?(h===void 0&&(h=new _e(new ci(1,1,1),new ia({name:"BackgroundCubeMaterial",uniforms:Ms(gi.backgroundCube.uniforms),vertexShader:gi.backgroundCube.vertexShader,fragmentShader:gi.backgroundCube.fragmentShader,side:Pn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,S,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(h)),fa.copy(x.backgroundRotation),fa.x*=-1,fa.y*=-1,fa.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(fa.y*=-1,fa.z*=-1),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(lb.makeRotationFromEuler(fa)),h.material.toneMapped=Se.getTransfer(v.colorSpace)!==ke,(u!==v||d!==v.version||f!==n.toneMapping)&&(h.material.needsUpdate=!0,u=v,d=v.version,f=n.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new _e(new Yn(2,2),new ia({name:"BackgroundMaterial",uniforms:Ms(gi.background.uniforms),vertexShader:gi.background.vertexShader,fragmentShader:gi.background.fragmentShader,side:na,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=Se.getTransfer(v.colorSpace)!==ke,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||d!==v.version||f!==n.toneMapping)&&(c.material.needsUpdate=!0,u=v,d=v.version,f=n.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function p(y,x){y.getRGB(Yo,Mp(n)),i.buffers.color.setClear(Yo.r,Yo.g,Yo.b,x,o)}return{getClearColor:function(){return r},setClearColor:function(y,x=1){r.set(y),l=x,p(r,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,p(r,l)},render:_,addToRenderList:m}}function db(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},a=d(null);let s=a,o=!1;function r(M,R,C,z,N){let D=!1;const L=u(z,C,R);s!==L&&(s=L,c(s.object)),D=f(M,z,C,N),D&&g(M,z,C,N),N!==null&&t.update(N,n.ELEMENT_ARRAY_BUFFER),(D||o)&&(o=!1,v(M,R,C,z),N!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(N).buffer))}function l(){return n.createVertexArray()}function c(M){return n.bindVertexArray(M)}function h(M){return n.deleteVertexArray(M)}function u(M,R,C){const z=C.wireframe===!0;let N=i[M.id];N===void 0&&(N={},i[M.id]=N);let D=N[R.id];D===void 0&&(D={},N[R.id]=D);let L=D[z];return L===void 0&&(L=d(l()),D[z]=L),L}function d(M){const R=[],C=[],z=[];for(let N=0;N<e;N++)R[N]=0,C[N]=0,z[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:C,attributeDivisors:z,object:M,attributes:{},index:null}}function f(M,R,C,z){const N=s.attributes,D=R.attributes;let L=0;const F=C.getAttributes();for(const H in F)if(F[H].location>=0){const it=N[H];let mt=D[H];if(mt===void 0&&(H==="instanceMatrix"&&M.instanceMatrix&&(mt=M.instanceMatrix),H==="instanceColor"&&M.instanceColor&&(mt=M.instanceColor)),it===void 0||it.attribute!==mt||mt&&it.data!==mt.data)return!0;L++}return s.attributesNum!==L||s.index!==z}function g(M,R,C,z){const N={},D=R.attributes;let L=0;const F=C.getAttributes();for(const H in F)if(F[H].location>=0){let it=D[H];it===void 0&&(H==="instanceMatrix"&&M.instanceMatrix&&(it=M.instanceMatrix),H==="instanceColor"&&M.instanceColor&&(it=M.instanceColor));const mt={};mt.attribute=it,it&&it.data&&(mt.data=it.data),N[H]=mt,L++}s.attributes=N,s.attributesNum=L,s.index=z}function _(){const M=s.newAttributes;for(let R=0,C=M.length;R<C;R++)M[R]=0}function m(M){p(M,0)}function p(M,R){const C=s.newAttributes,z=s.enabledAttributes,N=s.attributeDivisors;C[M]=1,z[M]===0&&(n.enableVertexAttribArray(M),z[M]=1),N[M]!==R&&(n.vertexAttribDivisor(M,R),N[M]=R)}function y(){const M=s.newAttributes,R=s.enabledAttributes;for(let C=0,z=R.length;C<z;C++)R[C]!==M[C]&&(n.disableVertexAttribArray(C),R[C]=0)}function x(M,R,C,z,N,D,L){L===!0?n.vertexAttribIPointer(M,R,C,N,D):n.vertexAttribPointer(M,R,C,z,N,D)}function v(M,R,C,z){_();const N=z.attributes,D=C.getAttributes(),L=R.defaultAttributeValues;for(const F in D){const H=D[F];if(H.location>=0){let Y=N[F];if(Y===void 0&&(F==="instanceMatrix"&&M.instanceMatrix&&(Y=M.instanceMatrix),F==="instanceColor"&&M.instanceColor&&(Y=M.instanceColor)),Y!==void 0){const it=Y.normalized,mt=Y.itemSize,_t=t.get(Y);if(_t===void 0)continue;const Lt=_t.buffer,J=_t.type,et=_t.bytesPerElement,ht=J===n.INT||J===n.UNSIGNED_INT||Y.gpuType===_h;if(Y.isInterleavedBufferAttribute){const q=Y.data,K=q.stride,$=Y.offset;if(q.isInstancedInterleavedBuffer){for(let Mt=0;Mt<H.locationSize;Mt++)p(H.location+Mt,q.meshPerAttribute);M.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=q.meshPerAttribute*q.count)}else for(let Mt=0;Mt<H.locationSize;Mt++)m(H.location+Mt);n.bindBuffer(n.ARRAY_BUFFER,Lt);for(let Mt=0;Mt<H.locationSize;Mt++)x(H.location+Mt,mt/H.locationSize,J,it,K*et,($+mt/H.locationSize*Mt)*et,ht)}else{if(Y.isInstancedBufferAttribute){for(let q=0;q<H.locationSize;q++)p(H.location+q,Y.meshPerAttribute);M.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=Y.meshPerAttribute*Y.count)}else for(let q=0;q<H.locationSize;q++)m(H.location+q);n.bindBuffer(n.ARRAY_BUFFER,Lt);for(let q=0;q<H.locationSize;q++)x(H.location+q,mt/H.locationSize,J,it,mt*et,mt/H.locationSize*q*et,ht)}}else if(L!==void 0){const it=L[F];if(it!==void 0)switch(it.length){case 2:n.vertexAttrib2fv(H.location,it);break;case 3:n.vertexAttrib3fv(H.location,it);break;case 4:n.vertexAttrib4fv(H.location,it);break;default:n.vertexAttrib1fv(H.location,it)}}}}y()}function w(){E();for(const M in i){const R=i[M];for(const C in R){const z=R[C];for(const N in z)h(z[N].object),delete z[N];delete R[C]}delete i[M]}}function S(M){if(i[M.id]===void 0)return;const R=i[M.id];for(const C in R){const z=R[C];for(const N in z)h(z[N].object),delete z[N];delete R[C]}delete i[M.id]}function T(M){for(const R in i){const C=i[R];if(C[M.id]===void 0)continue;const z=C[M.id];for(const N in z)h(z[N].object),delete z[N];delete C[M.id]}}function E(){b(),o=!0,s!==a&&(s=a,c(s.object))}function b(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:r,reset:E,resetDefaultState:b,dispose:w,releaseStatesOfGeometry:S,releaseStatesOfProgram:T,initAttributes:_,enableAttribute:m,disableUnusedAttributes:y}}function ub(n,t,e){let i;function a(c){i=c}function s(c,h){n.drawArrays(i,c,h),e.update(h,i,1)}function o(c,h,u){u!==0&&(n.drawArraysInstanced(i,c,h,u),e.update(h,i,u))}function r(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];e.update(f,i,1)}function l(c,h,u,d){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)o(c[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(i,c,0,h,0,d,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_]*d[_];e.update(g,i,1)}}this.setMode=a,this.render=s,this.renderInstances=o,this.renderMultiDraw=r,this.renderMultiDrawInstances=l}function fb(n,t,e,i){let a;function s(){if(a!==void 0)return a;if(t.has("EXT_texture_filter_anisotropic")===!0){const T=t.get("EXT_texture_filter_anisotropic");a=n.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function o(T){return!(T!==oi&&i.convert(T)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(T){const E=T===ho&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(T!==Ui&&i.convert(T)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==Ii&&!E)}function l(T){if(T==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),x=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),w=g>0,S=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:r,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:y,maxVaryings:x,maxFragmentUniforms:v,vertexTextures:w,maxSamples:S}}function pb(n){const t=this;let e=null,i=0,a=!1,s=!1;const o=new va,r=new pe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||i!==0||a;return a=d,i=u.length,f},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,p=n.get(u);if(!a||g===null||g.length===0||s&&!m)s?h(null):c();else{const y=s?0:i,x=y*4;let v=p.clippingState||null;l.value=v,v=h(g,d,x,f);for(let w=0;w!==x;++w)v[w]=e[w];p.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,d,f,g){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const p=f+_*4,y=d.matrixWorldInverse;r.getNormalMatrix(y),(m===null||m.length<p)&&(m=new Float32Array(p));for(let x=0,v=f;x!==_;++x,v+=4)o.copy(u[x]).applyMatrix4(y,r),o.normal.toArray(m,v),m[v+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function mb(n){let t=new WeakMap;function e(o,r){return r===wl?o.mapping=xs:r===El&&(o.mapping=vs),o}function i(o){if(o&&o.isTexture){const r=o.mapping;if(r===wl||r===El)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Ty(l.height);return c.fromEquirectangularTexture(n,o),t.set(o,c),o.addEventListener("dispose",a),e(c.texture,o.mapping)}else return null}}return o}function a(o){const r=o.target;r.removeEventListener("dispose",a);const l=t.get(r);l!==void 0&&(t.delete(r),l.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}class Ep extends bp{constructor(t=-1,e=1,i=1,a=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=a,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,a,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let s=i-t,o=i+t,r=a+e,l=a-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,r-=h*this.view.offsetY,l=r-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,r,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const os=4,Su=[.125,.215,.35,.446,.526,.582],ba=20,Nc=new Ep,wu=new ne;let Oc=null,Bc=0,Hc=0,Gc=!1;const ya=(1+Math.sqrt(5))/2,Qa=1/ya,Eu=[new B(-ya,Qa,0),new B(ya,Qa,0),new B(-Qa,0,ya),new B(Qa,0,ya),new B(0,ya,-Qa),new B(0,ya,Qa),new B(-1,1,-1),new B(1,1,-1),new B(-1,1,1),new B(1,1,1)];class Tu{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,a=100){Oc=this._renderer.getRenderTarget(),Bc=this._renderer.getActiveCubeFace(),Hc=this._renderer.getActiveMipmapLevel(),Gc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,i,a,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Pu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ru(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Oc,Bc,Hc),this._renderer.xr.enabled=Gc,t.scissorTest=!1,$o(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===xs||t.mapping===vs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Oc=this._renderer.getRenderTarget(),Bc=this._renderer.getActiveCubeFace(),Hc=this._renderer.getActiveMipmapLevel(),Gc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:xi,minFilter:xi,generateMipmaps:!1,type:ho,format:oi,colorSpace:bs,depthBuffer:!1},a=Au(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Au(t,e,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=gb(s)),this._blurMaterial=xb(s,t,e)}return a}_compileMaterial(t){const e=new _e(this._lodPlanes[0],t);this._renderer.compile(e,Nc)}_sceneToCubeUV(t,e,i,a){const r=new $n(90,1,e,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(wu),h.toneMapping=ta,h.autoClear=!1;const f=new un({name:"PMREM.Background",side:Pn,depthWrite:!1,depthTest:!1}),g=new _e(new ci,f);let _=!1;const m=t.background;m?m.isColor&&(f.color.copy(m),t.background=null,_=!0):(f.color.copy(wu),_=!0);for(let p=0;p<6;p++){const y=p%3;y===0?(r.up.set(0,l[p],0),r.lookAt(c[p],0,0)):y===1?(r.up.set(0,0,l[p]),r.lookAt(0,c[p],0)):(r.up.set(0,l[p],0),r.lookAt(0,0,c[p]));const x=this._cubeSize;$o(a,y*x,p>2?x:0,x,x),h.setRenderTarget(a),_&&h.render(g,r),h.render(t,r)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const i=this._renderer,a=t.mapping===xs||t.mapping===vs;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=Pu()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ru());const s=a?this._cubemapMaterial:this._equirectMaterial,o=new _e(this._lodPlanes[0],s),r=s.uniforms;r.envMap.value=t;const l=this._cubeSize;$o(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(o,Nc)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const a=this._lodPlanes.length;for(let s=1;s<a;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),r=Eu[(a-s-1)%Eu.length];this._blur(t,s-1,s,o,r)}e.autoClear=i}_blur(t,e,i,a,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,a,"latitudinal",s),this._halfBlur(o,t,i,i,a,"longitudinal",s)}_halfBlur(t,e,i,a,s,o,r){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new _e(this._lodPlanes[a],c),d=c.uniforms,f=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*ba-1),_=s/g,m=isFinite(s)?1+Math.floor(h*_):ba;m>ba&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ba}`);const p=[];let y=0;for(let T=0;T<ba;++T){const E=T/_,b=Math.exp(-E*E/2);p.push(b),T===0?y+=b:T<m&&(y+=2*b)}for(let T=0;T<p.length;T++)p[T]=p[T]/y;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",r&&(d.poleAxis.value=r);const{_lodMax:x}=this;d.dTheta.value=g,d.mipInt.value=x-i;const v=this._sizeLods[a],w=3*v*(a>x-os?a-x+os:0),S=4*(this._cubeSize-v);$o(e,w,S,3*v,2*v),l.setRenderTarget(e),l.render(u,Nc)}}function gb(n){const t=[],e=[],i=[];let a=n;const s=n-os+1+Su.length;for(let o=0;o<s;o++){const r=Math.pow(2,a);e.push(r);let l=1/r;o>n-os?l=Su[o-n+os-1]:o===0&&(l=0),i.push(l);const c=1/(r-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,_=3,m=2,p=1,y=new Float32Array(_*g*f),x=new Float32Array(m*g*f),v=new Float32Array(p*g*f);for(let S=0;S<f;S++){const T=S%3*2/3-1,E=S>2?0:-1,b=[T,E,0,T+2/3,E,0,T+2/3,E+1,0,T,E,0,T+2/3,E+1,0,T,E+1,0];y.set(b,_*g*S),x.set(d,m*g*S);const M=[S,S,S,S,S,S];v.set(M,p*g*S)}const w=new an;w.setAttribute("position",new pn(y,_)),w.setAttribute("uv",new pn(x,m)),w.setAttribute("faceIndex",new pn(v,p)),t.push(w),a>os&&a--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Au(n,t,e){const i=new Aa(n,t,e);return i.texture.mapping=Ur,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function $o(n,t,e,i,a){n.viewport.set(t,e,i,a),n.scissor.set(t,e,i,a)}function xb(n,t,e){const i=new Float32Array(ba),a=new B(0,1,0);return new ia({name:"SphericalGaussianBlur",defines:{n:ba,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:Ch(),fragmentShader:`

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
		`,blending:Qi,depthTest:!1,depthWrite:!1})}function Ru(){return new ia({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ch(),fragmentShader:`

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
		`,blending:Qi,depthTest:!1,depthWrite:!1})}function Pu(){return new ia({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ch(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Qi,depthTest:!1,depthWrite:!1})}function Ch(){return`

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
	`}function vb(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const l=r.mapping,c=l===wl||l===El,h=l===xs||l===vs;if(c||h){let u=t.get(r);const d=u!==void 0?u.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==d)return e===null&&(e=new Tu(n)),u=c?e.fromEquirectangular(r,u):e.fromCubemap(r,u),u.texture.pmremVersion=r.pmremVersion,t.set(r,u),u.texture;if(u!==void 0)return u.texture;{const f=r.image;return c&&f&&f.height>0||h&&f&&a(f)?(e===null&&(e=new Tu(n)),u=c?e.fromEquirectangular(r):e.fromCubemap(r),u.texture.pmremVersion=r.pmremVersion,t.set(r,u),r.addEventListener("dispose",s),u.texture):null}}}return r}function a(r){let l=0;const c=6;for(let h=0;h<c;h++)r[h]!==void 0&&l++;return l===c}function s(r){const l=r.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function yb(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let a;switch(i){case"WEBGL_depth_texture":a=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=n.getExtension(i)}return t[i]=a,a}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const a=e(i);return a===null&&Hs("THREE.WebGLRenderer: "+i+" extension not supported."),a}}}function _b(n,t,e,i){const a={},s=new WeakMap;function o(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);for(const g in d.morphAttributes){const _=d.morphAttributes[g];for(let m=0,p=_.length;m<p;m++)t.remove(_[m])}d.removeEventListener("dispose",o),delete a[d.id];const f=s.get(d);f&&(t.remove(f),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function r(u,d){return a[d.id]===!0||(d.addEventListener("dispose",o),a[d.id]=!0,e.memory.geometries++),d}function l(u){const d=u.attributes;for(const g in d)t.update(d[g],n.ARRAY_BUFFER);const f=u.morphAttributes;for(const g in f){const _=f[g];for(let m=0,p=_.length;m<p;m++)t.update(_[m],n.ARRAY_BUFFER)}}function c(u){const d=[],f=u.index,g=u.attributes.position;let _=0;if(f!==null){const y=f.array;_=f.version;for(let x=0,v=y.length;x<v;x+=3){const w=y[x+0],S=y[x+1],T=y[x+2];d.push(w,S,S,T,T,w)}}else if(g!==void 0){const y=g.array;_=g.version;for(let x=0,v=y.length/3-1;x<v;x+=3){const w=x+0,S=x+1,T=x+2;d.push(w,S,S,T,T,w)}}else return;const m=new(mp(d)?_p:yp)(d,1);m.version=_;const p=s.get(u);p&&t.remove(p),s.set(u,m)}function h(u){const d=s.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return s.get(u)}return{get:r,update:l,getWireframeAttribute:h}}function Mb(n,t,e){let i;function a(d){i=d}let s,o;function r(d){s=d.type,o=d.bytesPerElement}function l(d,f){n.drawElements(i,f,s,d*o),e.update(f,i,1)}function c(d,f,g){g!==0&&(n.drawElementsInstanced(i,f,s,d*o,g),e.update(f,i,g))}function h(d,f,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,s,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];e.update(m,i,1)}function u(d,f,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)c(d[p]/o,f[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(i,f,0,s,d,0,_,0,g);let p=0;for(let y=0;y<g;y++)p+=f[y]*_[y];e.update(p,i,1)}}this.setMode=a,this.setIndex=r,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function bb(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,r){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=r*(s/3);break;case n.LINES:e.lines+=r*(s/2);break;case n.LINE_STRIP:e.lines+=r*(s-1);break;case n.LINE_LOOP:e.lines+=r*s;break;case n.POINTS:e.points+=r*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function a(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:a,update:i}}function Sb(n,t,e){const i=new WeakMap,a=new Je;function s(o,r,l){const c=o.morphTargetInfluences,h=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,u=h!==void 0?h.length:0;let d=i.get(r);if(d===void 0||d.count!==u){let M=function(){E.dispose(),i.delete(r),r.removeEventListener("dispose",M)};var f=M;d!==void 0&&d.texture.dispose();const g=r.morphAttributes.position!==void 0,_=r.morphAttributes.normal!==void 0,m=r.morphAttributes.color!==void 0,p=r.morphAttributes.position||[],y=r.morphAttributes.normal||[],x=r.morphAttributes.color||[];let v=0;g===!0&&(v=1),_===!0&&(v=2),m===!0&&(v=3);let w=r.attributes.position.count*v,S=1;w>t.maxTextureSize&&(S=Math.ceil(w/t.maxTextureSize),w=t.maxTextureSize);const T=new Float32Array(w*S*4*u),E=new xp(T,w,S,u);E.type=Ii,E.needsUpdate=!0;const b=v*4;for(let R=0;R<u;R++){const C=p[R],z=y[R],N=x[R],D=w*S*4*R;for(let L=0;L<C.count;L++){const F=L*b;g===!0&&(a.fromBufferAttribute(C,L),T[D+F+0]=a.x,T[D+F+1]=a.y,T[D+F+2]=a.z,T[D+F+3]=0),_===!0&&(a.fromBufferAttribute(z,L),T[D+F+4]=a.x,T[D+F+5]=a.y,T[D+F+6]=a.z,T[D+F+7]=0),m===!0&&(a.fromBufferAttribute(N,L),T[D+F+8]=a.x,T[D+F+9]=a.y,T[D+F+10]=a.z,T[D+F+11]=N.itemSize===4?a.w:1)}}d={count:u,texture:E,size:new $t(w,S)},i.set(r,d),r.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const _=r.morphTargetsRelative?1:1-g;l.getUniforms().setValue(n,"morphTargetBaseInfluence",_),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:s}}function wb(n,t,e,i){let a=new WeakMap;function s(l){const c=i.render.frame,h=l.geometry,u=t.get(l,h);if(a.get(u)!==c&&(t.update(u),a.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",r)===!1&&l.addEventListener("dispose",r),a.get(l)!==c&&(e.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,n.ARRAY_BUFFER),a.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;a.get(d)!==c&&(d.update(),a.set(d,c))}return u}function o(){a=new WeakMap}function r(l){const c=l.target;c.removeEventListener("dispose",r),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:s,dispose:o}}class Tp extends Tn{constructor(t,e,i,a,s,o,r,l,c,h=hs){if(h!==hs&&h!==_s)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===hs&&(i=Ta),i===void 0&&h===_s&&(i=ys),super(null,a,s,o,r,l,h,i,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:ri,this.minFilter=l!==void 0?l:ri,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Ap=new Tn,Cu=new Tp(1,1),Rp=new xp,Pp=new hy,Cp=new Sp,Lu=[],Du=[],ku=new Float32Array(16),Iu=new Float32Array(9),zu=new Float32Array(4);function ws(n,t,e){const i=n[0];if(i<=0||i>0)return n;const a=t*e;let s=Lu[a];if(s===void 0&&(s=new Float32Array(a),Lu[a]=s),t!==0){i.toArray(s,0);for(let o=1,r=0;o!==t;++o)r+=e,n[o].toArray(s,r)}return s}function rn(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function cn(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function Br(n,t){let e=Du[t];e===void 0&&(e=new Int32Array(t),Du[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function Eb(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function Tb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(rn(e,t))return;n.uniform2fv(this.addr,t),cn(e,t)}}function Ab(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(rn(e,t))return;n.uniform3fv(this.addr,t),cn(e,t)}}function Rb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(rn(e,t))return;n.uniform4fv(this.addr,t),cn(e,t)}}function Pb(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(rn(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),cn(e,t)}else{if(rn(e,i))return;zu.set(i),n.uniformMatrix2fv(this.addr,!1,zu),cn(e,i)}}function Cb(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(rn(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),cn(e,t)}else{if(rn(e,i))return;Iu.set(i),n.uniformMatrix3fv(this.addr,!1,Iu),cn(e,i)}}function Lb(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(rn(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),cn(e,t)}else{if(rn(e,i))return;ku.set(i),n.uniformMatrix4fv(this.addr,!1,ku),cn(e,i)}}function Db(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function kb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(rn(e,t))return;n.uniform2iv(this.addr,t),cn(e,t)}}function Ib(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(rn(e,t))return;n.uniform3iv(this.addr,t),cn(e,t)}}function zb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(rn(e,t))return;n.uniform4iv(this.addr,t),cn(e,t)}}function Fb(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function Ub(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(rn(e,t))return;n.uniform2uiv(this.addr,t),cn(e,t)}}function Nb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(rn(e,t))return;n.uniform3uiv(this.addr,t),cn(e,t)}}function Ob(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(rn(e,t))return;n.uniform4uiv(this.addr,t),cn(e,t)}}function Bb(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a);let s;this.type===n.SAMPLER_2D_SHADOW?(Cu.compareFunction=pp,s=Cu):s=Ap,e.setTexture2D(t||s,a)}function Hb(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture3D(t||Pp,a)}function Gb(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTextureCube(t||Cp,a)}function Vb(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture2DArray(t||Rp,a)}function Xb(n){switch(n){case 5126:return Eb;case 35664:return Tb;case 35665:return Ab;case 35666:return Rb;case 35674:return Pb;case 35675:return Cb;case 35676:return Lb;case 5124:case 35670:return Db;case 35667:case 35671:return kb;case 35668:case 35672:return Ib;case 35669:case 35673:return zb;case 5125:return Fb;case 36294:return Ub;case 36295:return Nb;case 36296:return Ob;case 35678:case 36198:case 36298:case 36306:case 35682:return Bb;case 35679:case 36299:case 36307:return Hb;case 35680:case 36300:case 36308:case 36293:return Gb;case 36289:case 36303:case 36311:case 36292:return Vb}}function Wb(n,t){n.uniform1fv(this.addr,t)}function Yb(n,t){const e=ws(t,this.size,2);n.uniform2fv(this.addr,e)}function $b(n,t){const e=ws(t,this.size,3);n.uniform3fv(this.addr,e)}function Zb(n,t){const e=ws(t,this.size,4);n.uniform4fv(this.addr,e)}function jb(n,t){const e=ws(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function qb(n,t){const e=ws(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function Kb(n,t){const e=ws(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function Jb(n,t){n.uniform1iv(this.addr,t)}function Qb(n,t){n.uniform2iv(this.addr,t)}function t1(n,t){n.uniform3iv(this.addr,t)}function e1(n,t){n.uniform4iv(this.addr,t)}function n1(n,t){n.uniform1uiv(this.addr,t)}function i1(n,t){n.uniform2uiv(this.addr,t)}function a1(n,t){n.uniform3uiv(this.addr,t)}function s1(n,t){n.uniform4uiv(this.addr,t)}function o1(n,t,e){const i=this.cache,a=t.length,s=Br(e,a);rn(i,s)||(n.uniform1iv(this.addr,s),cn(i,s));for(let o=0;o!==a;++o)e.setTexture2D(t[o]||Ap,s[o])}function r1(n,t,e){const i=this.cache,a=t.length,s=Br(e,a);rn(i,s)||(n.uniform1iv(this.addr,s),cn(i,s));for(let o=0;o!==a;++o)e.setTexture3D(t[o]||Pp,s[o])}function c1(n,t,e){const i=this.cache,a=t.length,s=Br(e,a);rn(i,s)||(n.uniform1iv(this.addr,s),cn(i,s));for(let o=0;o!==a;++o)e.setTextureCube(t[o]||Cp,s[o])}function l1(n,t,e){const i=this.cache,a=t.length,s=Br(e,a);rn(i,s)||(n.uniform1iv(this.addr,s),cn(i,s));for(let o=0;o!==a;++o)e.setTexture2DArray(t[o]||Rp,s[o])}function h1(n){switch(n){case 5126:return Wb;case 35664:return Yb;case 35665:return $b;case 35666:return Zb;case 35674:return jb;case 35675:return qb;case 35676:return Kb;case 5124:case 35670:return Jb;case 35667:case 35671:return Qb;case 35668:case 35672:return t1;case 35669:case 35673:return e1;case 5125:return n1;case 36294:return i1;case 36295:return a1;case 36296:return s1;case 35678:case 36198:case 36298:case 36306:case 35682:return o1;case 35679:case 36299:case 36307:return r1;case 35680:case 36300:case 36308:case 36293:return c1;case 36289:case 36303:case 36311:case 36292:return l1}}class d1{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=Xb(e.type)}}class u1{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=h1(e.type)}}class f1{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const a=this.seq;for(let s=0,o=a.length;s!==o;++s){const r=a[s];r.setValue(t,e[r.id],i)}}}const Vc=/(\w+)(\])?(\[|\.)?/g;function Fu(n,t){n.seq.push(t),n.map[t.id]=t}function p1(n,t,e){const i=n.name,a=i.length;for(Vc.lastIndex=0;;){const s=Vc.exec(i),o=Vc.lastIndex;let r=s[1];const l=s[2]==="]",c=s[3];if(l&&(r=r|0),c===void 0||c==="["&&o+2===a){Fu(e,c===void 0?new d1(r,n,t):new u1(r,n,t));break}else{let u=e.map[r];u===void 0&&(u=new f1(r),Fu(e,u)),e=u}}}class fr{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const s=t.getActiveUniform(e,a),o=t.getUniformLocation(e,s.name);p1(s,o,this)}}setValue(t,e,i,a){const s=this.map[e];s!==void 0&&s.setValue(t,i,a)}setOptional(t,e,i){const a=e[i];a!==void 0&&this.setValue(t,i,a)}static upload(t,e,i,a){for(let s=0,o=e.length;s!==o;++s){const r=e[s],l=i[r.id];l.needsUpdate!==!1&&r.setValue(t,l.value,a)}}static seqWithValue(t,e){const i=[];for(let a=0,s=t.length;a!==s;++a){const o=t[a];o.id in e&&i.push(o)}return i}}function Uu(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const m1=37297;let g1=0;function x1(n,t){const e=n.split(`
`),i=[],a=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=a;o<s;o++){const r=o+1;i.push(`${r===t?">":" "} ${r}: ${e[o]}`)}return i.join(`
`)}const Nu=new pe;function v1(n){Se._getMatrix(Nu,Se.workingColorSpace,n);const t=`mat3( ${Nu.elements.map(e=>e.toFixed(4))} )`;switch(Se.getTransfer(n)){case Nr:return[t,"LinearTransferOETF"];case ke:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Ou(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),a=n.getShaderInfoLog(t).trim();if(i&&a==="")return"";const s=/ERROR: 0:(\d+)/.exec(a);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+a+`

`+x1(n.getShaderSource(t),o)}else return a}function y1(n,t){const e=v1(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function _1(n,t){let e;switch(t){case bv:e="Linear";break;case Sv:e="Reinhard";break;case wv:e="Cineon";break;case Ev:e="ACESFilmic";break;case Av:e="AgX";break;case Rv:e="Neutral";break;case Tv:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Zo=new B;function M1(){Se.getLuminanceCoefficients(Zo);const n=Zo.x.toFixed(4),t=Zo.y.toFixed(4),e=Zo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function b1(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Gs).join(`
`)}function S1(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function w1(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let a=0;a<i;a++){const s=n.getActiveAttrib(t,a),o=s.name;let r=1;s.type===n.FLOAT_MAT2&&(r=2),s.type===n.FLOAT_MAT3&&(r=3),s.type===n.FLOAT_MAT4&&(r=4),e[o]={type:s.type,location:n.getAttribLocation(t,o),locationSize:r}}return e}function Gs(n){return n!==""}function Bu(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Hu(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const E1=/^[ \t]*#include +<([\w\d./]+)>/gm;function eh(n){return n.replace(E1,A1)}const T1=new Map;function A1(n,t){let e=xe[t];if(e===void 0){const i=T1.get(t);if(i!==void 0)e=xe[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return eh(e)}const R1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Gu(n){return n.replace(R1,P1)}function P1(n,t,e,i){let a="";for(let s=parseInt(t);s<parseInt(e);s++)a+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return a}function Vu(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function C1(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===tp?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===ep?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Li&&(t="SHADOWMAP_TYPE_VSM"),t}function L1(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case xs:case vs:t="ENVMAP_TYPE_CUBE";break;case Ur:t="ENVMAP_TYPE_CUBE_UV";break}return t}function D1(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case vs:t="ENVMAP_MODE_REFRACTION";break}return t}function k1(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case yh:t="ENVMAP_BLENDING_MULTIPLY";break;case _v:t="ENVMAP_BLENDING_MIX";break;case Mv:t="ENVMAP_BLENDING_ADD";break}return t}function I1(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function z1(n,t,e,i){const a=n.getContext(),s=e.defines;let o=e.vertexShader,r=e.fragmentShader;const l=C1(e),c=L1(e),h=D1(e),u=k1(e),d=I1(e),f=b1(e),g=S1(s),_=a.createProgram();let m,p,y=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Gs).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Gs).join(`
`),p.length>0&&(p+=`
`)):(m=[Vu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Gs).join(`
`),p=[Vu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ta?"#define TONE_MAPPING":"",e.toneMapping!==ta?xe.tonemapping_pars_fragment:"",e.toneMapping!==ta?_1("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",xe.colorspace_pars_fragment,y1("linearToOutputTexel",e.outputColorSpace),M1(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Gs).join(`
`)),o=eh(o),o=Bu(o,e),o=Hu(o,e),r=eh(r),r=Bu(r,e),r=Hu(r,e),o=Gu(o),r=Gu(r),e.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===tu?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===tu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=y+m+o,v=y+p+r,w=Uu(a,a.VERTEX_SHADER,x),S=Uu(a,a.FRAGMENT_SHADER,v);a.attachShader(_,w),a.attachShader(_,S),e.index0AttributeName!==void 0?a.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&a.bindAttribLocation(_,0,"position"),a.linkProgram(_);function T(R){if(n.debug.checkShaderErrors){const C=a.getProgramInfoLog(_).trim(),z=a.getShaderInfoLog(w).trim(),N=a.getShaderInfoLog(S).trim();let D=!0,L=!0;if(a.getProgramParameter(_,a.LINK_STATUS)===!1)if(D=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(a,_,w,S);else{const F=Ou(a,w,"vertex"),H=Ou(a,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(_,a.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+C+`
`+F+`
`+H)}else C!==""?console.warn("THREE.WebGLProgram: Program Info Log:",C):(z===""||N==="")&&(L=!1);L&&(R.diagnostics={runnable:D,programLog:C,vertexShader:{log:z,prefix:m},fragmentShader:{log:N,prefix:p}})}a.deleteShader(w),a.deleteShader(S),E=new fr(a,_),b=w1(a,_)}let E;this.getUniforms=function(){return E===void 0&&T(this),E};let b;this.getAttributes=function(){return b===void 0&&T(this),b};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=a.getProgramParameter(_,m1)),M},this.destroy=function(){i.releaseStatesOfProgram(this),a.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=g1++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=w,this.fragmentShader=S,this}let F1=0;class U1{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,a=this._getShaderStage(e),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(a)===!1&&(o.add(a),a.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new N1(t),e.set(t,i)),i}}class N1{constructor(t){this.id=F1++,this.code=t,this.usedTimes=0}}function O1(n,t,e,i,a,s,o){const r=new Rh,l=new U1,c=new Set,h=[],u=a.logarithmicDepthBuffer,d=a.vertexTextures;let f=a.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return c.add(b),b===0?"uv":`uv${b}`}function m(b,M,R,C,z){const N=C.fog,D=z.geometry,L=b.isMeshStandardMaterial?C.environment:null,F=(b.isMeshStandardMaterial?e:t).get(b.envMap||L),H=F&&F.mapping===Ur?F.image.height:null,Y=g[b.type];b.precision!==null&&(f=a.getMaxPrecision(b.precision),f!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",f,"instead."));const it=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,mt=it!==void 0?it.length:0;let _t=0;D.morphAttributes.position!==void 0&&(_t=1),D.morphAttributes.normal!==void 0&&(_t=2),D.morphAttributes.color!==void 0&&(_t=3);let Lt,J,et,ht;if(Y){const ie=gi[Y];Lt=ie.vertexShader,J=ie.fragmentShader}else Lt=b.vertexShader,J=b.fragmentShader,l.update(b),et=l.getVertexShaderID(b),ht=l.getFragmentShaderID(b);const q=n.getRenderTarget(),K=n.state.buffers.depth.getReversed(),$=z.isInstancedMesh===!0,Mt=z.isBatchedMesh===!0,It=!!b.map,Ct=!!b.matcap,Ut=!!F,G=!!b.aoMap,re=!!b.lightMap,Ht=!!b.bumpMap,Pt=!!b.normalMap,gt=!!b.displacementMap,zt=!!b.emissiveMap,Ot=!!b.metalnessMap,I=!!b.roughnessMap,A=b.anisotropy>0,j=b.clearcoat>0,ut=b.dispersion>0,Q=b.iridescence>0,ct=b.sheen>0,kt=b.transmission>0,tt=A&&!!b.anisotropyMap,dt=j&&!!b.clearcoatMap,Nt=j&&!!b.clearcoatNormalMap,at=j&&!!b.clearcoatRoughnessMap,bt=Q&&!!b.iridescenceMap,O=Q&&!!b.iridescenceThicknessMap,lt=ct&&!!b.sheenColorMap,xt=ct&&!!b.sheenRoughnessMap,Wt=!!b.specularMap,Gt=!!b.specularColorMap,qt=!!b.specularIntensityMap,U=kt&&!!b.transmissionMap,At=kt&&!!b.thicknessMap,nt=!!b.gradientMap,ft=!!b.alphaMap,Rt=b.alphaTest>0,Et=!!b.alphaHash,Vt=!!b.extensions;let ce=ta;b.toneMapped&&(q===null||q.isXRRenderTarget===!0)&&(ce=n.toneMapping);const me={shaderID:Y,shaderType:b.type,shaderName:b.name,vertexShader:Lt,fragmentShader:J,defines:b.defines,customVertexShaderID:et,customFragmentShaderID:ht,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:f,batching:Mt,batchingColor:Mt&&z._colorsTexture!==null,instancing:$,instancingColor:$&&z.instanceColor!==null,instancingMorph:$&&z.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:q===null?n.outputColorSpace:q.isXRRenderTarget===!0?q.texture.colorSpace:bs,alphaToCoverage:!!b.alphaToCoverage,map:It,matcap:Ct,envMap:Ut,envMapMode:Ut&&F.mapping,envMapCubeUVHeight:H,aoMap:G,lightMap:re,bumpMap:Ht,normalMap:Pt,displacementMap:d&&gt,emissiveMap:zt,normalMapObjectSpace:Pt&&b.normalMapType===Dv,normalMapTangentSpace:Pt&&b.normalMapType===fp,metalnessMap:Ot,roughnessMap:I,anisotropy:A,anisotropyMap:tt,clearcoat:j,clearcoatMap:dt,clearcoatNormalMap:Nt,clearcoatRoughnessMap:at,dispersion:ut,iridescence:Q,iridescenceMap:bt,iridescenceThicknessMap:O,sheen:ct,sheenColorMap:lt,sheenRoughnessMap:xt,specularMap:Wt,specularColorMap:Gt,specularIntensityMap:qt,transmission:kt,transmissionMap:U,thicknessMap:At,gradientMap:nt,opaque:b.transparent===!1&&b.blending===ls&&b.alphaToCoverage===!1,alphaMap:ft,alphaTest:Rt,alphaHash:Et,combine:b.combine,mapUv:It&&_(b.map.channel),aoMapUv:G&&_(b.aoMap.channel),lightMapUv:re&&_(b.lightMap.channel),bumpMapUv:Ht&&_(b.bumpMap.channel),normalMapUv:Pt&&_(b.normalMap.channel),displacementMapUv:gt&&_(b.displacementMap.channel),emissiveMapUv:zt&&_(b.emissiveMap.channel),metalnessMapUv:Ot&&_(b.metalnessMap.channel),roughnessMapUv:I&&_(b.roughnessMap.channel),anisotropyMapUv:tt&&_(b.anisotropyMap.channel),clearcoatMapUv:dt&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:Nt&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:at&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:bt&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:O&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:lt&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:xt&&_(b.sheenRoughnessMap.channel),specularMapUv:Wt&&_(b.specularMap.channel),specularColorMapUv:Gt&&_(b.specularColorMap.channel),specularIntensityMapUv:qt&&_(b.specularIntensityMap.channel),transmissionMapUv:U&&_(b.transmissionMap.channel),thicknessMapUv:At&&_(b.thicknessMap.channel),alphaMapUv:ft&&_(b.alphaMap.channel),vertexTangents:!!D.attributes.tangent&&(Pt||A),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!D.attributes.uv&&(It||ft),fog:!!N,useFog:b.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:K,skinning:z.isSkinnedMesh===!0,morphTargets:D.morphAttributes.position!==void 0,morphNormals:D.morphAttributes.normal!==void 0,morphColors:D.morphAttributes.color!==void 0,morphTargetsCount:mt,morphTextureStride:_t,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&R.length>0,shadowMapType:n.shadowMap.type,toneMapping:ce,decodeVideoTexture:It&&b.map.isVideoTexture===!0&&Se.getTransfer(b.map.colorSpace)===ke,decodeVideoTextureEmissive:zt&&b.emissiveMap.isVideoTexture===!0&&Se.getTransfer(b.emissiveMap.colorSpace)===ke,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Ke,flipSided:b.side===Pn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Vt&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Vt&&b.extensions.multiDraw===!0||Mt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return me.vertexUv1s=c.has(1),me.vertexUv2s=c.has(2),me.vertexUv3s=c.has(3),c.clear(),me}function p(b){const M=[];if(b.shaderID?M.push(b.shaderID):(M.push(b.customVertexShaderID),M.push(b.customFragmentShaderID)),b.defines!==void 0)for(const R in b.defines)M.push(R),M.push(b.defines[R]);return b.isRawShaderMaterial===!1&&(y(M,b),x(M,b),M.push(n.outputColorSpace)),M.push(b.customProgramCacheKey),M.join()}function y(b,M){b.push(M.precision),b.push(M.outputColorSpace),b.push(M.envMapMode),b.push(M.envMapCubeUVHeight),b.push(M.mapUv),b.push(M.alphaMapUv),b.push(M.lightMapUv),b.push(M.aoMapUv),b.push(M.bumpMapUv),b.push(M.normalMapUv),b.push(M.displacementMapUv),b.push(M.emissiveMapUv),b.push(M.metalnessMapUv),b.push(M.roughnessMapUv),b.push(M.anisotropyMapUv),b.push(M.clearcoatMapUv),b.push(M.clearcoatNormalMapUv),b.push(M.clearcoatRoughnessMapUv),b.push(M.iridescenceMapUv),b.push(M.iridescenceThicknessMapUv),b.push(M.sheenColorMapUv),b.push(M.sheenRoughnessMapUv),b.push(M.specularMapUv),b.push(M.specularColorMapUv),b.push(M.specularIntensityMapUv),b.push(M.transmissionMapUv),b.push(M.thicknessMapUv),b.push(M.combine),b.push(M.fogExp2),b.push(M.sizeAttenuation),b.push(M.morphTargetsCount),b.push(M.morphAttributeCount),b.push(M.numDirLights),b.push(M.numPointLights),b.push(M.numSpotLights),b.push(M.numSpotLightMaps),b.push(M.numHemiLights),b.push(M.numRectAreaLights),b.push(M.numDirLightShadows),b.push(M.numPointLightShadows),b.push(M.numSpotLightShadows),b.push(M.numSpotLightShadowsWithMaps),b.push(M.numLightProbes),b.push(M.shadowMapType),b.push(M.toneMapping),b.push(M.numClippingPlanes),b.push(M.numClipIntersection),b.push(M.depthPacking)}function x(b,M){r.disableAll(),M.supportsVertexTextures&&r.enable(0),M.instancing&&r.enable(1),M.instancingColor&&r.enable(2),M.instancingMorph&&r.enable(3),M.matcap&&r.enable(4),M.envMap&&r.enable(5),M.normalMapObjectSpace&&r.enable(6),M.normalMapTangentSpace&&r.enable(7),M.clearcoat&&r.enable(8),M.iridescence&&r.enable(9),M.alphaTest&&r.enable(10),M.vertexColors&&r.enable(11),M.vertexAlphas&&r.enable(12),M.vertexUv1s&&r.enable(13),M.vertexUv2s&&r.enable(14),M.vertexUv3s&&r.enable(15),M.vertexTangents&&r.enable(16),M.anisotropy&&r.enable(17),M.alphaHash&&r.enable(18),M.batching&&r.enable(19),M.dispersion&&r.enable(20),M.batchingColor&&r.enable(21),b.push(r.mask),r.disableAll(),M.fog&&r.enable(0),M.useFog&&r.enable(1),M.flatShading&&r.enable(2),M.logarithmicDepthBuffer&&r.enable(3),M.reverseDepthBuffer&&r.enable(4),M.skinning&&r.enable(5),M.morphTargets&&r.enable(6),M.morphNormals&&r.enable(7),M.morphColors&&r.enable(8),M.premultipliedAlpha&&r.enable(9),M.shadowMapEnabled&&r.enable(10),M.doubleSided&&r.enable(11),M.flipSided&&r.enable(12),M.useDepthPacking&&r.enable(13),M.dithering&&r.enable(14),M.transmission&&r.enable(15),M.sheen&&r.enable(16),M.opaque&&r.enable(17),M.pointsUvs&&r.enable(18),M.decodeVideoTexture&&r.enable(19),M.decodeVideoTextureEmissive&&r.enable(20),M.alphaToCoverage&&r.enable(21),b.push(r.mask)}function v(b){const M=g[b.type];let R;if(M){const C=gi[M];R=by.clone(C.uniforms)}else R=b.uniforms;return R}function w(b,M){let R;for(let C=0,z=h.length;C<z;C++){const N=h[C];if(N.cacheKey===M){R=N,++R.usedTimes;break}}return R===void 0&&(R=new z1(n,M,b,s),h.push(R)),R}function S(b){if(--b.usedTimes===0){const M=h.indexOf(b);h[M]=h[h.length-1],h.pop(),b.destroy()}}function T(b){l.remove(b)}function E(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:v,acquireProgram:w,releaseProgram:S,releaseShaderCache:T,programs:h,dispose:E}}function B1(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let r=n.get(o);return r===void 0&&(r={},n.set(o,r)),r}function i(o){n.delete(o)}function a(o,r,l){n.get(o)[r]=l}function s(){n=new WeakMap}return{has:t,get:e,remove:i,update:a,dispose:s}}function H1(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Xu(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Wu(){const n=[];let t=0;const e=[],i=[],a=[];function s(){t=0,e.length=0,i.length=0,a.length=0}function o(u,d,f,g,_,m){let p=n[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},n[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=_,p.group=m),t++,p}function r(u,d,f,g,_,m){const p=o(u,d,f,g,_,m);f.transmission>0?i.push(p):f.transparent===!0?a.push(p):e.push(p)}function l(u,d,f,g,_,m){const p=o(u,d,f,g,_,m);f.transmission>0?i.unshift(p):f.transparent===!0?a.unshift(p):e.unshift(p)}function c(u,d){e.length>1&&e.sort(u||H1),i.length>1&&i.sort(d||Xu),a.length>1&&a.sort(d||Xu)}function h(){for(let u=t,d=n.length;u<d;u++){const f=n[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:i,transparent:a,init:s,push:r,unshift:l,finish:h,sort:c}}function G1(){let n=new WeakMap;function t(i,a){const s=n.get(i);let o;return s===void 0?(o=new Wu,n.set(i,[o])):a>=s.length?(o=new Wu,s.push(o)):o=s[a],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function V1(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new B,color:new ne};break;case"SpotLight":e={position:new B,direction:new B,color:new ne,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new B,color:new ne,distance:0,decay:0};break;case"HemisphereLight":e={direction:new B,skyColor:new ne,groundColor:new ne};break;case"RectAreaLight":e={color:new ne,position:new B,halfWidth:new B,halfHeight:new B};break}return n[t.id]=e,e}}}function X1(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $t};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $t};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $t,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let W1=0;function Y1(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function $1(n){const t=new V1,e=X1(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new B);const a=new B,s=new Ue,o=new Ue;function r(c){let h=0,u=0,d=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,y=0,x=0,v=0,w=0,S=0,T=0;c.sort(Y1);for(let b=0,M=c.length;b<M;b++){const R=c[b],C=R.color,z=R.intensity,N=R.distance,D=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)h+=C.r*z,u+=C.g*z,d+=C.b*z;else if(R.isLightProbe){for(let L=0;L<9;L++)i.probe[L].addScaledVector(R.sh.coefficients[L],z);T++}else if(R.isDirectionalLight){const L=t.get(R);if(L.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const F=R.shadow,H=e.get(R);H.shadowIntensity=F.intensity,H.shadowBias=F.bias,H.shadowNormalBias=F.normalBias,H.shadowRadius=F.radius,H.shadowMapSize=F.mapSize,i.directionalShadow[f]=H,i.directionalShadowMap[f]=D,i.directionalShadowMatrix[f]=R.shadow.matrix,y++}i.directional[f]=L,f++}else if(R.isSpotLight){const L=t.get(R);L.position.setFromMatrixPosition(R.matrixWorld),L.color.copy(C).multiplyScalar(z),L.distance=N,L.coneCos=Math.cos(R.angle),L.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),L.decay=R.decay,i.spot[_]=L;const F=R.shadow;if(R.map&&(i.spotLightMap[w]=R.map,w++,F.updateMatrices(R),R.castShadow&&S++),i.spotLightMatrix[_]=F.matrix,R.castShadow){const H=e.get(R);H.shadowIntensity=F.intensity,H.shadowBias=F.bias,H.shadowNormalBias=F.normalBias,H.shadowRadius=F.radius,H.shadowMapSize=F.mapSize,i.spotShadow[_]=H,i.spotShadowMap[_]=D,v++}_++}else if(R.isRectAreaLight){const L=t.get(R);L.color.copy(C).multiplyScalar(z),L.halfWidth.set(R.width*.5,0,0),L.halfHeight.set(0,R.height*.5,0),i.rectArea[m]=L,m++}else if(R.isPointLight){const L=t.get(R);if(L.color.copy(R.color).multiplyScalar(R.intensity),L.distance=R.distance,L.decay=R.decay,R.castShadow){const F=R.shadow,H=e.get(R);H.shadowIntensity=F.intensity,H.shadowBias=F.bias,H.shadowNormalBias=F.normalBias,H.shadowRadius=F.radius,H.shadowMapSize=F.mapSize,H.shadowCameraNear=F.camera.near,H.shadowCameraFar=F.camera.far,i.pointShadow[g]=H,i.pointShadowMap[g]=D,i.pointShadowMatrix[g]=R.shadow.matrix,x++}i.point[g]=L,g++}else if(R.isHemisphereLight){const L=t.get(R);L.skyColor.copy(R.color).multiplyScalar(z),L.groundColor.copy(R.groundColor).multiplyScalar(z),i.hemi[p]=L,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Xt.LTC_FLOAT_1,i.rectAreaLTC2=Xt.LTC_FLOAT_2):(i.rectAreaLTC1=Xt.LTC_HALF_1,i.rectAreaLTC2=Xt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=d;const E=i.hash;(E.directionalLength!==f||E.pointLength!==g||E.spotLength!==_||E.rectAreaLength!==m||E.hemiLength!==p||E.numDirectionalShadows!==y||E.numPointShadows!==x||E.numSpotShadows!==v||E.numSpotMaps!==w||E.numLightProbes!==T)&&(i.directional.length=f,i.spot.length=_,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=v+w-S,i.spotLightMap.length=w,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=T,E.directionalLength=f,E.pointLength=g,E.spotLength=_,E.rectAreaLength=m,E.hemiLength=p,E.numDirectionalShadows=y,E.numPointShadows=x,E.numSpotShadows=v,E.numSpotMaps=w,E.numLightProbes=T,i.version=W1++)}function l(c,h){let u=0,d=0,f=0,g=0,_=0;const m=h.matrixWorldInverse;for(let p=0,y=c.length;p<y;p++){const x=c[p];if(x.isDirectionalLight){const v=i.directional[u];v.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(a),v.direction.transformDirection(m),u++}else if(x.isSpotLight){const v=i.spot[f];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(a),v.direction.transformDirection(m),f++}else if(x.isRectAreaLight){const v=i.rectArea[g];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(m),o.identity(),s.copy(x.matrixWorld),s.premultiply(m),o.extractRotation(s),v.halfWidth.set(x.width*.5,0,0),v.halfHeight.set(0,x.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),g++}else if(x.isPointLight){const v=i.point[d];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(m),d++}else if(x.isHemisphereLight){const v=i.hemi[_];v.direction.setFromMatrixPosition(x.matrixWorld),v.direction.transformDirection(m),_++}}}return{setup:r,setupView:l,state:i}}function Yu(n){const t=new $1(n),e=[],i=[];function a(h){c.camera=h,e.length=0,i.length=0}function s(h){e.push(h)}function o(h){i.push(h)}function r(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:a,state:c,setupLights:r,setupLightsView:l,pushLight:s,pushShadow:o}}function Z1(n){let t=new WeakMap;function e(a,s=0){const o=t.get(a);let r;return o===void 0?(r=new Yu(n),t.set(a,[r])):s>=o.length?(r=new Yu(n),o.push(r)):r=o[s],r}function i(){t=new WeakMap}return{get:e,dispose:i}}class j1 extends Pa{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Cv,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class q1 extends Pa{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const K1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,J1=`uniform sampler2D shadow_pass;
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
}`;function Q1(n,t,e){let i=new Ph;const a=new $t,s=new $t,o=new Je,r=new j1({depthPacking:Lv}),l=new q1,c={},h=e.maxTextureSize,u={[na]:Pn,[Pn]:na,[Ke]:Ke},d=new ia({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new $t},radius:{value:4}},vertexShader:K1,fragmentShader:J1}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new an;g.setAttribute("position",new pn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new _e(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=tp;let p=this.type;this.render=function(S,T,E){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;const b=n.getRenderTarget(),M=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),C=n.state;C.setBlending(Qi),C.buffers.color.setClear(1,1,1,1),C.buffers.depth.setTest(!0),C.setScissorTest(!1);const z=p!==Li&&this.type===Li,N=p===Li&&this.type!==Li;for(let D=0,L=S.length;D<L;D++){const F=S[D],H=F.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",F,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;a.copy(H.mapSize);const Y=H.getFrameExtents();if(a.multiply(Y),s.copy(H.mapSize),(a.x>h||a.y>h)&&(a.x>h&&(s.x=Math.floor(h/Y.x),a.x=s.x*Y.x,H.mapSize.x=s.x),a.y>h&&(s.y=Math.floor(h/Y.y),a.y=s.y*Y.y,H.mapSize.y=s.y)),H.map===null||z===!0||N===!0){const mt=this.type!==Li?{minFilter:ri,magFilter:ri}:{};H.map!==null&&H.map.dispose(),H.map=new Aa(a.x,a.y,mt),H.map.texture.name=F.name+".shadowMap",H.camera.updateProjectionMatrix()}n.setRenderTarget(H.map),n.clear();const it=H.getViewportCount();for(let mt=0;mt<it;mt++){const _t=H.getViewport(mt);o.set(s.x*_t.x,s.y*_t.y,s.x*_t.z,s.y*_t.w),C.viewport(o),H.updateMatrices(F,mt),i=H.getFrustum(),v(T,E,H.camera,F,this.type)}H.isPointLightShadow!==!0&&this.type===Li&&y(H,E),H.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(b,M,R)};function y(S,T){const E=t.update(_);d.defines.VSM_SAMPLES!==S.blurSamples&&(d.defines.VSM_SAMPLES=S.blurSamples,f.defines.VSM_SAMPLES=S.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new Aa(a.x,a.y)),d.uniforms.shadow_pass.value=S.map.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,n.setRenderTarget(S.mapPass),n.clear(),n.renderBufferDirect(T,null,E,d,_,null),f.uniforms.shadow_pass.value=S.mapPass.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,n.setRenderTarget(S.map),n.clear(),n.renderBufferDirect(T,null,E,f,_,null)}function x(S,T,E,b){let M=null;const R=E.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(R!==void 0)M=R;else if(M=E.isPointLight===!0?l:r,n.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const C=M.uuid,z=T.uuid;let N=c[C];N===void 0&&(N={},c[C]=N);let D=N[z];D===void 0&&(D=M.clone(),N[z]=D,T.addEventListener("dispose",w)),M=D}if(M.visible=T.visible,M.wireframe=T.wireframe,b===Li?M.side=T.shadowSide!==null?T.shadowSide:T.side:M.side=T.shadowSide!==null?T.shadowSide:u[T.side],M.alphaMap=T.alphaMap,M.alphaTest=T.alphaTest,M.map=T.map,M.clipShadows=T.clipShadows,M.clippingPlanes=T.clippingPlanes,M.clipIntersection=T.clipIntersection,M.displacementMap=T.displacementMap,M.displacementScale=T.displacementScale,M.displacementBias=T.displacementBias,M.wireframeLinewidth=T.wireframeLinewidth,M.linewidth=T.linewidth,E.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const C=n.properties.get(M);C.light=E}return M}function v(S,T,E,b,M){if(S.visible===!1)return;if(S.layers.test(T.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&M===Li)&&(!S.frustumCulled||i.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(E.matrixWorldInverse,S.matrixWorld);const z=t.update(S),N=S.material;if(Array.isArray(N)){const D=z.groups;for(let L=0,F=D.length;L<F;L++){const H=D[L],Y=N[H.materialIndex];if(Y&&Y.visible){const it=x(S,Y,b,M);S.onBeforeShadow(n,S,T,E,z,it,H),n.renderBufferDirect(E,null,z,it,S,H),S.onAfterShadow(n,S,T,E,z,it,H)}}}else if(N.visible){const D=x(S,N,b,M);S.onBeforeShadow(n,S,T,E,z,D,null),n.renderBufferDirect(E,null,z,D,S,null),S.onAfterShadow(n,S,T,E,z,D,null)}}const C=S.children;for(let z=0,N=C.length;z<N;z++)v(C[z],T,E,b,M)}function w(S){S.target.removeEventListener("dispose",w);for(const E in c){const b=c[E],M=S.target.uuid;M in b&&(b[M].dispose(),delete b[M])}}}const tS={[xl]:vl,[yl]:bl,[_l]:Sl,[gs]:Ml,[vl]:xl,[bl]:yl,[Sl]:_l,[Ml]:gs};function eS(n,t){function e(){let U=!1;const At=new Je;let nt=null;const ft=new Je(0,0,0,0);return{setMask:function(Rt){nt!==Rt&&!U&&(n.colorMask(Rt,Rt,Rt,Rt),nt=Rt)},setLocked:function(Rt){U=Rt},setClear:function(Rt,Et,Vt,ce,me){me===!0&&(Rt*=ce,Et*=ce,Vt*=ce),At.set(Rt,Et,Vt,ce),ft.equals(At)===!1&&(n.clearColor(Rt,Et,Vt,ce),ft.copy(At))},reset:function(){U=!1,nt=null,ft.set(-1,0,0,0)}}}function i(){let U=!1,At=!1,nt=null,ft=null,Rt=null;return{setReversed:function(Et){if(At!==Et){const Vt=t.get("EXT_clip_control");At?Vt.clipControlEXT(Vt.LOWER_LEFT_EXT,Vt.ZERO_TO_ONE_EXT):Vt.clipControlEXT(Vt.LOWER_LEFT_EXT,Vt.NEGATIVE_ONE_TO_ONE_EXT);const ce=Rt;Rt=null,this.setClear(ce)}At=Et},getReversed:function(){return At},setTest:function(Et){Et?q(n.DEPTH_TEST):K(n.DEPTH_TEST)},setMask:function(Et){nt!==Et&&!U&&(n.depthMask(Et),nt=Et)},setFunc:function(Et){if(At&&(Et=tS[Et]),ft!==Et){switch(Et){case xl:n.depthFunc(n.NEVER);break;case vl:n.depthFunc(n.ALWAYS);break;case yl:n.depthFunc(n.LESS);break;case gs:n.depthFunc(n.LEQUAL);break;case _l:n.depthFunc(n.EQUAL);break;case Ml:n.depthFunc(n.GEQUAL);break;case bl:n.depthFunc(n.GREATER);break;case Sl:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ft=Et}},setLocked:function(Et){U=Et},setClear:function(Et){Rt!==Et&&(At&&(Et=1-Et),n.clearDepth(Et),Rt=Et)},reset:function(){U=!1,nt=null,ft=null,Rt=null,At=!1}}}function a(){let U=!1,At=null,nt=null,ft=null,Rt=null,Et=null,Vt=null,ce=null,me=null;return{setTest:function(ie){U||(ie?q(n.STENCIL_TEST):K(n.STENCIL_TEST))},setMask:function(ie){At!==ie&&!U&&(n.stencilMask(ie),At=ie)},setFunc:function(ie,Ee,Ge){(nt!==ie||ft!==Ee||Rt!==Ge)&&(n.stencilFunc(ie,Ee,Ge),nt=ie,ft=Ee,Rt=Ge)},setOp:function(ie,Ee,Ge){(Et!==ie||Vt!==Ee||ce!==Ge)&&(n.stencilOp(ie,Ee,Ge),Et=ie,Vt=Ee,ce=Ge)},setLocked:function(ie){U=ie},setClear:function(ie){me!==ie&&(n.clearStencil(ie),me=ie)},reset:function(){U=!1,At=null,nt=null,ft=null,Rt=null,Et=null,Vt=null,ce=null,me=null}}}const s=new e,o=new i,r=new a,l=new WeakMap,c=new WeakMap;let h={},u={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,y=null,x=null,v=null,w=null,S=null,T=new ne(0,0,0),E=0,b=!1,M=null,R=null,C=null,z=null,N=null;const D=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let L=!1,F=0;const H=n.getParameter(n.VERSION);H.indexOf("WebGL")!==-1?(F=parseFloat(/^WebGL (\d)/.exec(H)[1]),L=F>=1):H.indexOf("OpenGL ES")!==-1&&(F=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),L=F>=2);let Y=null,it={};const mt=n.getParameter(n.SCISSOR_BOX),_t=n.getParameter(n.VIEWPORT),Lt=new Je().fromArray(mt),J=new Je().fromArray(_t);function et(U,At,nt,ft){const Rt=new Uint8Array(4),Et=n.createTexture();n.bindTexture(U,Et),n.texParameteri(U,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(U,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Vt=0;Vt<nt;Vt++)U===n.TEXTURE_3D||U===n.TEXTURE_2D_ARRAY?n.texImage3D(At,0,n.RGBA,1,1,ft,0,n.RGBA,n.UNSIGNED_BYTE,Rt):n.texImage2D(At+Vt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Rt);return Et}const ht={};ht[n.TEXTURE_2D]=et(n.TEXTURE_2D,n.TEXTURE_2D,1),ht[n.TEXTURE_CUBE_MAP]=et(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),ht[n.TEXTURE_2D_ARRAY]=et(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),ht[n.TEXTURE_3D]=et(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),r.setClear(0),q(n.DEPTH_TEST),o.setFunc(gs),Ht(!1),Pt(jd),q(n.CULL_FACE),G(Qi);function q(U){h[U]!==!0&&(n.enable(U),h[U]=!0)}function K(U){h[U]!==!1&&(n.disable(U),h[U]=!1)}function $(U,At){return u[U]!==At?(n.bindFramebuffer(U,At),u[U]=At,U===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=At),U===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=At),!0):!1}function Mt(U,At){let nt=f,ft=!1;if(U){nt=d.get(At),nt===void 0&&(nt=[],d.set(At,nt));const Rt=U.textures;if(nt.length!==Rt.length||nt[0]!==n.COLOR_ATTACHMENT0){for(let Et=0,Vt=Rt.length;Et<Vt;Et++)nt[Et]=n.COLOR_ATTACHMENT0+Et;nt.length=Rt.length,ft=!0}}else nt[0]!==n.BACK&&(nt[0]=n.BACK,ft=!0);ft&&n.drawBuffers(nt)}function It(U){return g!==U?(n.useProgram(U),g=U,!0):!1}const Ct={[Ma]:n.FUNC_ADD,[iv]:n.FUNC_SUBTRACT,[av]:n.FUNC_REVERSE_SUBTRACT};Ct[sv]=n.MIN,Ct[ov]=n.MAX;const Ut={[rv]:n.ZERO,[cv]:n.ONE,[lv]:n.SRC_COLOR,[ml]:n.SRC_ALPHA,[mv]:n.SRC_ALPHA_SATURATE,[fv]:n.DST_COLOR,[dv]:n.DST_ALPHA,[hv]:n.ONE_MINUS_SRC_COLOR,[gl]:n.ONE_MINUS_SRC_ALPHA,[pv]:n.ONE_MINUS_DST_COLOR,[uv]:n.ONE_MINUS_DST_ALPHA,[gv]:n.CONSTANT_COLOR,[xv]:n.ONE_MINUS_CONSTANT_COLOR,[vv]:n.CONSTANT_ALPHA,[yv]:n.ONE_MINUS_CONSTANT_ALPHA};function G(U,At,nt,ft,Rt,Et,Vt,ce,me,ie){if(U===Qi){_===!0&&(K(n.BLEND),_=!1);return}if(_===!1&&(q(n.BLEND),_=!0),U!==nv){if(U!==m||ie!==b){if((p!==Ma||v!==Ma)&&(n.blendEquation(n.FUNC_ADD),p=Ma,v=Ma),ie)switch(U){case ls:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Di:n.blendFunc(n.ONE,n.ONE);break;case qd:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Kd:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case ls:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Di:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case qd:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Kd:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}y=null,x=null,w=null,S=null,T.set(0,0,0),E=0,m=U,b=ie}return}Rt=Rt||At,Et=Et||nt,Vt=Vt||ft,(At!==p||Rt!==v)&&(n.blendEquationSeparate(Ct[At],Ct[Rt]),p=At,v=Rt),(nt!==y||ft!==x||Et!==w||Vt!==S)&&(n.blendFuncSeparate(Ut[nt],Ut[ft],Ut[Et],Ut[Vt]),y=nt,x=ft,w=Et,S=Vt),(ce.equals(T)===!1||me!==E)&&(n.blendColor(ce.r,ce.g,ce.b,me),T.copy(ce),E=me),m=U,b=!1}function re(U,At){U.side===Ke?K(n.CULL_FACE):q(n.CULL_FACE);let nt=U.side===Pn;At&&(nt=!nt),Ht(nt),U.blending===ls&&U.transparent===!1?G(Qi):G(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),o.setFunc(U.depthFunc),o.setTest(U.depthTest),o.setMask(U.depthWrite),s.setMask(U.colorWrite);const ft=U.stencilWrite;r.setTest(ft),ft&&(r.setMask(U.stencilWriteMask),r.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),r.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),zt(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?q(n.SAMPLE_ALPHA_TO_COVERAGE):K(n.SAMPLE_ALPHA_TO_COVERAGE)}function Ht(U){M!==U&&(U?n.frontFace(n.CW):n.frontFace(n.CCW),M=U)}function Pt(U){U!==tv?(q(n.CULL_FACE),U!==R&&(U===jd?n.cullFace(n.BACK):U===ev?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):K(n.CULL_FACE),R=U}function gt(U){U!==C&&(L&&n.lineWidth(U),C=U)}function zt(U,At,nt){U?(q(n.POLYGON_OFFSET_FILL),(z!==At||N!==nt)&&(n.polygonOffset(At,nt),z=At,N=nt)):K(n.POLYGON_OFFSET_FILL)}function Ot(U){U?q(n.SCISSOR_TEST):K(n.SCISSOR_TEST)}function I(U){U===void 0&&(U=n.TEXTURE0+D-1),Y!==U&&(n.activeTexture(U),Y=U)}function A(U,At,nt){nt===void 0&&(Y===null?nt=n.TEXTURE0+D-1:nt=Y);let ft=it[nt];ft===void 0&&(ft={type:void 0,texture:void 0},it[nt]=ft),(ft.type!==U||ft.texture!==At)&&(Y!==nt&&(n.activeTexture(nt),Y=nt),n.bindTexture(U,At||ht[U]),ft.type=U,ft.texture=At)}function j(){const U=it[Y];U!==void 0&&U.type!==void 0&&(n.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function ut(){try{n.compressedTexImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Q(){try{n.compressedTexImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ct(){try{n.texSubImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function kt(){try{n.texSubImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function tt(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function dt(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Nt(){try{n.texStorage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function at(){try{n.texStorage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function bt(){try{n.texImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function O(){try{n.texImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function lt(U){Lt.equals(U)===!1&&(n.scissor(U.x,U.y,U.z,U.w),Lt.copy(U))}function xt(U){J.equals(U)===!1&&(n.viewport(U.x,U.y,U.z,U.w),J.copy(U))}function Wt(U,At){let nt=c.get(At);nt===void 0&&(nt=new WeakMap,c.set(At,nt));let ft=nt.get(U);ft===void 0&&(ft=n.getUniformBlockIndex(At,U.name),nt.set(U,ft))}function Gt(U,At){const ft=c.get(At).get(U);l.get(At)!==ft&&(n.uniformBlockBinding(At,ft,U.__bindingPointIndex),l.set(At,ft))}function qt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},Y=null,it={},u={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,y=null,x=null,v=null,w=null,S=null,T=new ne(0,0,0),E=0,b=!1,M=null,R=null,C=null,z=null,N=null,Lt.set(0,0,n.canvas.width,n.canvas.height),J.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),r.reset()}return{buffers:{color:s,depth:o,stencil:r},enable:q,disable:K,bindFramebuffer:$,drawBuffers:Mt,useProgram:It,setBlending:G,setMaterial:re,setFlipSided:Ht,setCullFace:Pt,setLineWidth:gt,setPolygonOffset:zt,setScissorTest:Ot,activeTexture:I,bindTexture:A,unbindTexture:j,compressedTexImage2D:ut,compressedTexImage3D:Q,texImage2D:bt,texImage3D:O,updateUBOMapping:Wt,uniformBlockBinding:Gt,texStorage2D:Nt,texStorage3D:at,texSubImage2D:ct,texSubImage3D:kt,compressedTexSubImage2D:tt,compressedTexSubImage3D:dt,scissor:lt,viewport:xt,reset:qt}}function $u(n,t,e,i){const a=nS(i);switch(e){case op:return n*t;case cp:return n*t;case lp:return n*t*2;case hp:return n*t/a.components*a.byteLength;case Sh:return n*t/a.components*a.byteLength;case dp:return n*t*2/a.components*a.byteLength;case wh:return n*t*2/a.components*a.byteLength;case rp:return n*t*3/a.components*a.byteLength;case oi:return n*t*4/a.components*a.byteLength;case Eh:return n*t*4/a.components*a.byteLength;case cr:case lr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case hr:case dr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Pl:case Ll:return Math.max(n,16)*Math.max(t,8)/4;case Rl:case Cl:return Math.max(n,8)*Math.max(t,8)/2;case Dl:case kl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Il:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case zl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Fl:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case Ul:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case Nl:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case Ol:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case Bl:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Hl:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Gl:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case Vl:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Xl:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Wl:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Yl:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case $l:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Zl:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case ur:case jl:case ql:return Math.ceil(n/4)*Math.ceil(t/4)*16;case up:case Kl:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Jl:case Ql:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function nS(n){switch(n){case Ui:case ip:return{byteLength:1,components:1};case no:case ap:case ho:return{byteLength:2,components:1};case Mh:case bh:return{byteLength:2,components:4};case Ta:case _h:case Ii:return{byteLength:4,components:1};case sp:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function iS(n,t,e,i,a,s,o){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new $t,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(I,A){return f?new OffscreenCanvas(I,A):Ar("canvas")}function _(I,A,j){let ut=1;const Q=Ot(I);if((Q.width>j||Q.height>j)&&(ut=j/Math.max(Q.width,Q.height)),ut<1)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap||typeof VideoFrame<"u"&&I instanceof VideoFrame){const ct=Math.floor(ut*Q.width),kt=Math.floor(ut*Q.height);u===void 0&&(u=g(ct,kt));const tt=A?g(ct,kt):u;return tt.width=ct,tt.height=kt,tt.getContext("2d").drawImage(I,0,0,ct,kt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+ct+"x"+kt+")."),tt}else return"data"in I&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),I;return I}function m(I){return I.generateMipmaps}function p(I){n.generateMipmap(I)}function y(I){return I.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:I.isWebGL3DRenderTarget?n.TEXTURE_3D:I.isWebGLArrayRenderTarget||I.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(I,A,j,ut,Q=!1){if(I!==null){if(n[I]!==void 0)return n[I];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let ct=A;if(A===n.RED&&(j===n.FLOAT&&(ct=n.R32F),j===n.HALF_FLOAT&&(ct=n.R16F),j===n.UNSIGNED_BYTE&&(ct=n.R8)),A===n.RED_INTEGER&&(j===n.UNSIGNED_BYTE&&(ct=n.R8UI),j===n.UNSIGNED_SHORT&&(ct=n.R16UI),j===n.UNSIGNED_INT&&(ct=n.R32UI),j===n.BYTE&&(ct=n.R8I),j===n.SHORT&&(ct=n.R16I),j===n.INT&&(ct=n.R32I)),A===n.RG&&(j===n.FLOAT&&(ct=n.RG32F),j===n.HALF_FLOAT&&(ct=n.RG16F),j===n.UNSIGNED_BYTE&&(ct=n.RG8)),A===n.RG_INTEGER&&(j===n.UNSIGNED_BYTE&&(ct=n.RG8UI),j===n.UNSIGNED_SHORT&&(ct=n.RG16UI),j===n.UNSIGNED_INT&&(ct=n.RG32UI),j===n.BYTE&&(ct=n.RG8I),j===n.SHORT&&(ct=n.RG16I),j===n.INT&&(ct=n.RG32I)),A===n.RGB_INTEGER&&(j===n.UNSIGNED_BYTE&&(ct=n.RGB8UI),j===n.UNSIGNED_SHORT&&(ct=n.RGB16UI),j===n.UNSIGNED_INT&&(ct=n.RGB32UI),j===n.BYTE&&(ct=n.RGB8I),j===n.SHORT&&(ct=n.RGB16I),j===n.INT&&(ct=n.RGB32I)),A===n.RGBA_INTEGER&&(j===n.UNSIGNED_BYTE&&(ct=n.RGBA8UI),j===n.UNSIGNED_SHORT&&(ct=n.RGBA16UI),j===n.UNSIGNED_INT&&(ct=n.RGBA32UI),j===n.BYTE&&(ct=n.RGBA8I),j===n.SHORT&&(ct=n.RGBA16I),j===n.INT&&(ct=n.RGBA32I)),A===n.RGB&&j===n.UNSIGNED_INT_5_9_9_9_REV&&(ct=n.RGB9_E5),A===n.RGBA){const kt=Q?Nr:Se.getTransfer(ut);j===n.FLOAT&&(ct=n.RGBA32F),j===n.HALF_FLOAT&&(ct=n.RGBA16F),j===n.UNSIGNED_BYTE&&(ct=kt===ke?n.SRGB8_ALPHA8:n.RGBA8),j===n.UNSIGNED_SHORT_4_4_4_4&&(ct=n.RGBA4),j===n.UNSIGNED_SHORT_5_5_5_1&&(ct=n.RGB5_A1)}return(ct===n.R16F||ct===n.R32F||ct===n.RG16F||ct===n.RG32F||ct===n.RGBA16F||ct===n.RGBA32F)&&t.get("EXT_color_buffer_float"),ct}function v(I,A){let j;return I?A===null||A===Ta||A===ys?j=n.DEPTH24_STENCIL8:A===Ii?j=n.DEPTH32F_STENCIL8:A===no&&(j=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===Ta||A===ys?j=n.DEPTH_COMPONENT24:A===Ii?j=n.DEPTH_COMPONENT32F:A===no&&(j=n.DEPTH_COMPONENT16),j}function w(I,A){return m(I)===!0||I.isFramebufferTexture&&I.minFilter!==ri&&I.minFilter!==xi?Math.log2(Math.max(A.width,A.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?A.mipmaps.length:1}function S(I){const A=I.target;A.removeEventListener("dispose",S),E(A),A.isVideoTexture&&h.delete(A)}function T(I){const A=I.target;A.removeEventListener("dispose",T),M(A)}function E(I){const A=i.get(I);if(A.__webglInit===void 0)return;const j=I.source,ut=d.get(j);if(ut){const Q=ut[A.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&b(I),Object.keys(ut).length===0&&d.delete(j)}i.remove(I)}function b(I){const A=i.get(I);n.deleteTexture(A.__webglTexture);const j=I.source,ut=d.get(j);delete ut[A.__cacheKey],o.memory.textures--}function M(I){const A=i.get(I);if(I.depthTexture&&(I.depthTexture.dispose(),i.remove(I.depthTexture)),I.isWebGLCubeRenderTarget)for(let ut=0;ut<6;ut++){if(Array.isArray(A.__webglFramebuffer[ut]))for(let Q=0;Q<A.__webglFramebuffer[ut].length;Q++)n.deleteFramebuffer(A.__webglFramebuffer[ut][Q]);else n.deleteFramebuffer(A.__webglFramebuffer[ut]);A.__webglDepthbuffer&&n.deleteRenderbuffer(A.__webglDepthbuffer[ut])}else{if(Array.isArray(A.__webglFramebuffer))for(let ut=0;ut<A.__webglFramebuffer.length;ut++)n.deleteFramebuffer(A.__webglFramebuffer[ut]);else n.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&n.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&n.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let ut=0;ut<A.__webglColorRenderbuffer.length;ut++)A.__webglColorRenderbuffer[ut]&&n.deleteRenderbuffer(A.__webglColorRenderbuffer[ut]);A.__webglDepthRenderbuffer&&n.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const j=I.textures;for(let ut=0,Q=j.length;ut<Q;ut++){const ct=i.get(j[ut]);ct.__webglTexture&&(n.deleteTexture(ct.__webglTexture),o.memory.textures--),i.remove(j[ut])}i.remove(I)}let R=0;function C(){R=0}function z(){const I=R;return I>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+I+" texture units while this GPU supports only "+a.maxTextures),R+=1,I}function N(I){const A=[];return A.push(I.wrapS),A.push(I.wrapT),A.push(I.wrapR||0),A.push(I.magFilter),A.push(I.minFilter),A.push(I.anisotropy),A.push(I.internalFormat),A.push(I.format),A.push(I.type),A.push(I.generateMipmaps),A.push(I.premultiplyAlpha),A.push(I.flipY),A.push(I.unpackAlignment),A.push(I.colorSpace),A.join()}function D(I,A){const j=i.get(I);if(I.isVideoTexture&&gt(I),I.isRenderTargetTexture===!1&&I.version>0&&j.__version!==I.version){const ut=I.image;if(ut===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ut.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{J(j,I,A);return}}e.bindTexture(n.TEXTURE_2D,j.__webglTexture,n.TEXTURE0+A)}function L(I,A){const j=i.get(I);if(I.version>0&&j.__version!==I.version){J(j,I,A);return}e.bindTexture(n.TEXTURE_2D_ARRAY,j.__webglTexture,n.TEXTURE0+A)}function F(I,A){const j=i.get(I);if(I.version>0&&j.__version!==I.version){J(j,I,A);return}e.bindTexture(n.TEXTURE_3D,j.__webglTexture,n.TEXTURE0+A)}function H(I,A){const j=i.get(I);if(I.version>0&&j.__version!==I.version){et(j,I,A);return}e.bindTexture(n.TEXTURE_CUBE_MAP,j.__webglTexture,n.TEXTURE0+A)}const Y={[Tl]:n.REPEAT,[Sa]:n.CLAMP_TO_EDGE,[Al]:n.MIRRORED_REPEAT},it={[ri]:n.NEAREST,[Pv]:n.NEAREST_MIPMAP_NEAREST,[Ro]:n.NEAREST_MIPMAP_LINEAR,[xi]:n.LINEAR,[xc]:n.LINEAR_MIPMAP_NEAREST,[wa]:n.LINEAR_MIPMAP_LINEAR},mt={[kv]:n.NEVER,[Ov]:n.ALWAYS,[Iv]:n.LESS,[pp]:n.LEQUAL,[zv]:n.EQUAL,[Nv]:n.GEQUAL,[Fv]:n.GREATER,[Uv]:n.NOTEQUAL};function _t(I,A){if(A.type===Ii&&t.has("OES_texture_float_linear")===!1&&(A.magFilter===xi||A.magFilter===xc||A.magFilter===Ro||A.magFilter===wa||A.minFilter===xi||A.minFilter===xc||A.minFilter===Ro||A.minFilter===wa)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(I,n.TEXTURE_WRAP_S,Y[A.wrapS]),n.texParameteri(I,n.TEXTURE_WRAP_T,Y[A.wrapT]),(I===n.TEXTURE_3D||I===n.TEXTURE_2D_ARRAY)&&n.texParameteri(I,n.TEXTURE_WRAP_R,Y[A.wrapR]),n.texParameteri(I,n.TEXTURE_MAG_FILTER,it[A.magFilter]),n.texParameteri(I,n.TEXTURE_MIN_FILTER,it[A.minFilter]),A.compareFunction&&(n.texParameteri(I,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(I,n.TEXTURE_COMPARE_FUNC,mt[A.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===ri||A.minFilter!==Ro&&A.minFilter!==wa||A.type===Ii&&t.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||i.get(A).__currentAnisotropy){const j=t.get("EXT_texture_filter_anisotropic");n.texParameterf(I,j.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,a.getMaxAnisotropy())),i.get(A).__currentAnisotropy=A.anisotropy}}}function Lt(I,A){let j=!1;I.__webglInit===void 0&&(I.__webglInit=!0,A.addEventListener("dispose",S));const ut=A.source;let Q=d.get(ut);Q===void 0&&(Q={},d.set(ut,Q));const ct=N(A);if(ct!==I.__cacheKey){Q[ct]===void 0&&(Q[ct]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,j=!0),Q[ct].usedTimes++;const kt=Q[I.__cacheKey];kt!==void 0&&(Q[I.__cacheKey].usedTimes--,kt.usedTimes===0&&b(A)),I.__cacheKey=ct,I.__webglTexture=Q[ct].texture}return j}function J(I,A,j){let ut=n.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(ut=n.TEXTURE_2D_ARRAY),A.isData3DTexture&&(ut=n.TEXTURE_3D);const Q=Lt(I,A),ct=A.source;e.bindTexture(ut,I.__webglTexture,n.TEXTURE0+j);const kt=i.get(ct);if(ct.version!==kt.__version||Q===!0){e.activeTexture(n.TEXTURE0+j);const tt=Se.getPrimaries(Se.workingColorSpace),dt=A.colorSpace===ji?null:Se.getPrimaries(A.colorSpace),Nt=A.colorSpace===ji||tt===dt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Nt);let at=_(A.image,!1,a.maxTextureSize);at=zt(A,at);const bt=s.convert(A.format,A.colorSpace),O=s.convert(A.type);let lt=x(A.internalFormat,bt,O,A.colorSpace,A.isVideoTexture);_t(ut,A);let xt;const Wt=A.mipmaps,Gt=A.isVideoTexture!==!0,qt=kt.__version===void 0||Q===!0,U=ct.dataReady,At=w(A,at);if(A.isDepthTexture)lt=v(A.format===_s,A.type),qt&&(Gt?e.texStorage2D(n.TEXTURE_2D,1,lt,at.width,at.height):e.texImage2D(n.TEXTURE_2D,0,lt,at.width,at.height,0,bt,O,null));else if(A.isDataTexture)if(Wt.length>0){Gt&&qt&&e.texStorage2D(n.TEXTURE_2D,At,lt,Wt[0].width,Wt[0].height);for(let nt=0,ft=Wt.length;nt<ft;nt++)xt=Wt[nt],Gt?U&&e.texSubImage2D(n.TEXTURE_2D,nt,0,0,xt.width,xt.height,bt,O,xt.data):e.texImage2D(n.TEXTURE_2D,nt,lt,xt.width,xt.height,0,bt,O,xt.data);A.generateMipmaps=!1}else Gt?(qt&&e.texStorage2D(n.TEXTURE_2D,At,lt,at.width,at.height),U&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,at.width,at.height,bt,O,at.data)):e.texImage2D(n.TEXTURE_2D,0,lt,at.width,at.height,0,bt,O,at.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){Gt&&qt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,At,lt,Wt[0].width,Wt[0].height,at.depth);for(let nt=0,ft=Wt.length;nt<ft;nt++)if(xt=Wt[nt],A.format!==oi)if(bt!==null)if(Gt){if(U)if(A.layerUpdates.size>0){const Rt=$u(xt.width,xt.height,A.format,A.type);for(const Et of A.layerUpdates){const Vt=xt.data.subarray(Et*Rt/xt.data.BYTES_PER_ELEMENT,(Et+1)*Rt/xt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,nt,0,0,Et,xt.width,xt.height,1,bt,Vt)}A.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,nt,0,0,0,xt.width,xt.height,at.depth,bt,xt.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,nt,lt,xt.width,xt.height,at.depth,0,xt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Gt?U&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,nt,0,0,0,xt.width,xt.height,at.depth,bt,O,xt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,nt,lt,xt.width,xt.height,at.depth,0,bt,O,xt.data)}else{Gt&&qt&&e.texStorage2D(n.TEXTURE_2D,At,lt,Wt[0].width,Wt[0].height);for(let nt=0,ft=Wt.length;nt<ft;nt++)xt=Wt[nt],A.format!==oi?bt!==null?Gt?U&&e.compressedTexSubImage2D(n.TEXTURE_2D,nt,0,0,xt.width,xt.height,bt,xt.data):e.compressedTexImage2D(n.TEXTURE_2D,nt,lt,xt.width,xt.height,0,xt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Gt?U&&e.texSubImage2D(n.TEXTURE_2D,nt,0,0,xt.width,xt.height,bt,O,xt.data):e.texImage2D(n.TEXTURE_2D,nt,lt,xt.width,xt.height,0,bt,O,xt.data)}else if(A.isDataArrayTexture)if(Gt){if(qt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,At,lt,at.width,at.height,at.depth),U)if(A.layerUpdates.size>0){const nt=$u(at.width,at.height,A.format,A.type);for(const ft of A.layerUpdates){const Rt=at.data.subarray(ft*nt/at.data.BYTES_PER_ELEMENT,(ft+1)*nt/at.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ft,at.width,at.height,1,bt,O,Rt)}A.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,at.width,at.height,at.depth,bt,O,at.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,lt,at.width,at.height,at.depth,0,bt,O,at.data);else if(A.isData3DTexture)Gt?(qt&&e.texStorage3D(n.TEXTURE_3D,At,lt,at.width,at.height,at.depth),U&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,at.width,at.height,at.depth,bt,O,at.data)):e.texImage3D(n.TEXTURE_3D,0,lt,at.width,at.height,at.depth,0,bt,O,at.data);else if(A.isFramebufferTexture){if(qt)if(Gt)e.texStorage2D(n.TEXTURE_2D,At,lt,at.width,at.height);else{let nt=at.width,ft=at.height;for(let Rt=0;Rt<At;Rt++)e.texImage2D(n.TEXTURE_2D,Rt,lt,nt,ft,0,bt,O,null),nt>>=1,ft>>=1}}else if(Wt.length>0){if(Gt&&qt){const nt=Ot(Wt[0]);e.texStorage2D(n.TEXTURE_2D,At,lt,nt.width,nt.height)}for(let nt=0,ft=Wt.length;nt<ft;nt++)xt=Wt[nt],Gt?U&&e.texSubImage2D(n.TEXTURE_2D,nt,0,0,bt,O,xt):e.texImage2D(n.TEXTURE_2D,nt,lt,bt,O,xt);A.generateMipmaps=!1}else if(Gt){if(qt){const nt=Ot(at);e.texStorage2D(n.TEXTURE_2D,At,lt,nt.width,nt.height)}U&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,bt,O,at)}else e.texImage2D(n.TEXTURE_2D,0,lt,bt,O,at);m(A)&&p(ut),kt.__version=ct.version,A.onUpdate&&A.onUpdate(A)}I.__version=A.version}function et(I,A,j){if(A.image.length!==6)return;const ut=Lt(I,A),Q=A.source;e.bindTexture(n.TEXTURE_CUBE_MAP,I.__webglTexture,n.TEXTURE0+j);const ct=i.get(Q);if(Q.version!==ct.__version||ut===!0){e.activeTexture(n.TEXTURE0+j);const kt=Se.getPrimaries(Se.workingColorSpace),tt=A.colorSpace===ji?null:Se.getPrimaries(A.colorSpace),dt=A.colorSpace===ji||kt===tt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,dt);const Nt=A.isCompressedTexture||A.image[0].isCompressedTexture,at=A.image[0]&&A.image[0].isDataTexture,bt=[];for(let ft=0;ft<6;ft++)!Nt&&!at?bt[ft]=_(A.image[ft],!0,a.maxCubemapSize):bt[ft]=at?A.image[ft].image:A.image[ft],bt[ft]=zt(A,bt[ft]);const O=bt[0],lt=s.convert(A.format,A.colorSpace),xt=s.convert(A.type),Wt=x(A.internalFormat,lt,xt,A.colorSpace),Gt=A.isVideoTexture!==!0,qt=ct.__version===void 0||ut===!0,U=Q.dataReady;let At=w(A,O);_t(n.TEXTURE_CUBE_MAP,A);let nt;if(Nt){Gt&&qt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,At,Wt,O.width,O.height);for(let ft=0;ft<6;ft++){nt=bt[ft].mipmaps;for(let Rt=0;Rt<nt.length;Rt++){const Et=nt[Rt];A.format!==oi?lt!==null?Gt?U&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ft,Rt,0,0,Et.width,Et.height,lt,Et.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ft,Rt,Wt,Et.width,Et.height,0,Et.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Gt?U&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ft,Rt,0,0,Et.width,Et.height,lt,xt,Et.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ft,Rt,Wt,Et.width,Et.height,0,lt,xt,Et.data)}}}else{if(nt=A.mipmaps,Gt&&qt){nt.length>0&&At++;const ft=Ot(bt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,At,Wt,ft.width,ft.height)}for(let ft=0;ft<6;ft++)if(at){Gt?U&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0,0,0,bt[ft].width,bt[ft].height,lt,xt,bt[ft].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0,Wt,bt[ft].width,bt[ft].height,0,lt,xt,bt[ft].data);for(let Rt=0;Rt<nt.length;Rt++){const Vt=nt[Rt].image[ft].image;Gt?U&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ft,Rt+1,0,0,Vt.width,Vt.height,lt,xt,Vt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ft,Rt+1,Wt,Vt.width,Vt.height,0,lt,xt,Vt.data)}}else{Gt?U&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0,0,0,lt,xt,bt[ft]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0,Wt,lt,xt,bt[ft]);for(let Rt=0;Rt<nt.length;Rt++){const Et=nt[Rt];Gt?U&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ft,Rt+1,0,0,lt,xt,Et.image[ft]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ft,Rt+1,Wt,lt,xt,Et.image[ft])}}}m(A)&&p(n.TEXTURE_CUBE_MAP),ct.__version=Q.version,A.onUpdate&&A.onUpdate(A)}I.__version=A.version}function ht(I,A,j,ut,Q,ct){const kt=s.convert(j.format,j.colorSpace),tt=s.convert(j.type),dt=x(j.internalFormat,kt,tt,j.colorSpace),Nt=i.get(A),at=i.get(j);if(at.__renderTarget=A,!Nt.__hasExternalTextures){const bt=Math.max(1,A.width>>ct),O=Math.max(1,A.height>>ct);Q===n.TEXTURE_3D||Q===n.TEXTURE_2D_ARRAY?e.texImage3D(Q,ct,dt,bt,O,A.depth,0,kt,tt,null):e.texImage2D(Q,ct,dt,bt,O,0,kt,tt,null)}e.bindFramebuffer(n.FRAMEBUFFER,I),Pt(A)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ut,Q,at.__webglTexture,0,Ht(A)):(Q===n.TEXTURE_2D||Q>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ut,Q,at.__webglTexture,ct),e.bindFramebuffer(n.FRAMEBUFFER,null)}function q(I,A,j){if(n.bindRenderbuffer(n.RENDERBUFFER,I),A.depthBuffer){const ut=A.depthTexture,Q=ut&&ut.isDepthTexture?ut.type:null,ct=v(A.stencilBuffer,Q),kt=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,tt=Ht(A);Pt(A)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,tt,ct,A.width,A.height):j?n.renderbufferStorageMultisample(n.RENDERBUFFER,tt,ct,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,ct,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,kt,n.RENDERBUFFER,I)}else{const ut=A.textures;for(let Q=0;Q<ut.length;Q++){const ct=ut[Q],kt=s.convert(ct.format,ct.colorSpace),tt=s.convert(ct.type),dt=x(ct.internalFormat,kt,tt,ct.colorSpace),Nt=Ht(A);j&&Pt(A)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Nt,dt,A.width,A.height):Pt(A)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Nt,dt,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,dt,A.width,A.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function K(I,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,I),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ut=i.get(A.depthTexture);ut.__renderTarget=A,(!ut.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),D(A.depthTexture,0);const Q=ut.__webglTexture,ct=Ht(A);if(A.depthTexture.format===hs)Pt(A)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Q,0,ct):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Q,0);else if(A.depthTexture.format===_s)Pt(A)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Q,0,ct):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function $(I){const A=i.get(I),j=I.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==I.depthTexture){const ut=I.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),ut){const Q=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,ut.removeEventListener("dispose",Q)};ut.addEventListener("dispose",Q),A.__depthDisposeCallback=Q}A.__boundDepthTexture=ut}if(I.depthTexture&&!A.__autoAllocateDepthBuffer){if(j)throw new Error("target.depthTexture not supported in Cube render targets");K(A.__webglFramebuffer,I)}else if(j){A.__webglDepthbuffer=[];for(let ut=0;ut<6;ut++)if(e.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer[ut]),A.__webglDepthbuffer[ut]===void 0)A.__webglDepthbuffer[ut]=n.createRenderbuffer(),q(A.__webglDepthbuffer[ut],I,!1);else{const Q=I.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ct=A.__webglDepthbuffer[ut];n.bindRenderbuffer(n.RENDERBUFFER,ct),n.framebufferRenderbuffer(n.FRAMEBUFFER,Q,n.RENDERBUFFER,ct)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=n.createRenderbuffer(),q(A.__webglDepthbuffer,I,!1);else{const ut=I.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Q=A.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,Q),n.framebufferRenderbuffer(n.FRAMEBUFFER,ut,n.RENDERBUFFER,Q)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Mt(I,A,j){const ut=i.get(I);A!==void 0&&ht(ut.__webglFramebuffer,I,I.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),j!==void 0&&$(I)}function It(I){const A=I.texture,j=i.get(I),ut=i.get(A);I.addEventListener("dispose",T);const Q=I.textures,ct=I.isWebGLCubeRenderTarget===!0,kt=Q.length>1;if(kt||(ut.__webglTexture===void 0&&(ut.__webglTexture=n.createTexture()),ut.__version=A.version,o.memory.textures++),ct){j.__webglFramebuffer=[];for(let tt=0;tt<6;tt++)if(A.mipmaps&&A.mipmaps.length>0){j.__webglFramebuffer[tt]=[];for(let dt=0;dt<A.mipmaps.length;dt++)j.__webglFramebuffer[tt][dt]=n.createFramebuffer()}else j.__webglFramebuffer[tt]=n.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){j.__webglFramebuffer=[];for(let tt=0;tt<A.mipmaps.length;tt++)j.__webglFramebuffer[tt]=n.createFramebuffer()}else j.__webglFramebuffer=n.createFramebuffer();if(kt)for(let tt=0,dt=Q.length;tt<dt;tt++){const Nt=i.get(Q[tt]);Nt.__webglTexture===void 0&&(Nt.__webglTexture=n.createTexture(),o.memory.textures++)}if(I.samples>0&&Pt(I)===!1){j.__webglMultisampledFramebuffer=n.createFramebuffer(),j.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,j.__webglMultisampledFramebuffer);for(let tt=0;tt<Q.length;tt++){const dt=Q[tt];j.__webglColorRenderbuffer[tt]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,j.__webglColorRenderbuffer[tt]);const Nt=s.convert(dt.format,dt.colorSpace),at=s.convert(dt.type),bt=x(dt.internalFormat,Nt,at,dt.colorSpace,I.isXRRenderTarget===!0),O=Ht(I);n.renderbufferStorageMultisample(n.RENDERBUFFER,O,bt,I.width,I.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+tt,n.RENDERBUFFER,j.__webglColorRenderbuffer[tt])}n.bindRenderbuffer(n.RENDERBUFFER,null),I.depthBuffer&&(j.__webglDepthRenderbuffer=n.createRenderbuffer(),q(j.__webglDepthRenderbuffer,I,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ct){e.bindTexture(n.TEXTURE_CUBE_MAP,ut.__webglTexture),_t(n.TEXTURE_CUBE_MAP,A);for(let tt=0;tt<6;tt++)if(A.mipmaps&&A.mipmaps.length>0)for(let dt=0;dt<A.mipmaps.length;dt++)ht(j.__webglFramebuffer[tt][dt],I,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+tt,dt);else ht(j.__webglFramebuffer[tt],I,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0);m(A)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(kt){for(let tt=0,dt=Q.length;tt<dt;tt++){const Nt=Q[tt],at=i.get(Nt);e.bindTexture(n.TEXTURE_2D,at.__webglTexture),_t(n.TEXTURE_2D,Nt),ht(j.__webglFramebuffer,I,Nt,n.COLOR_ATTACHMENT0+tt,n.TEXTURE_2D,0),m(Nt)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let tt=n.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(tt=I.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(tt,ut.__webglTexture),_t(tt,A),A.mipmaps&&A.mipmaps.length>0)for(let dt=0;dt<A.mipmaps.length;dt++)ht(j.__webglFramebuffer[dt],I,A,n.COLOR_ATTACHMENT0,tt,dt);else ht(j.__webglFramebuffer,I,A,n.COLOR_ATTACHMENT0,tt,0);m(A)&&p(tt),e.unbindTexture()}I.depthBuffer&&$(I)}function Ct(I){const A=I.textures;for(let j=0,ut=A.length;j<ut;j++){const Q=A[j];if(m(Q)){const ct=y(I),kt=i.get(Q).__webglTexture;e.bindTexture(ct,kt),p(ct),e.unbindTexture()}}}const Ut=[],G=[];function re(I){if(I.samples>0){if(Pt(I)===!1){const A=I.textures,j=I.width,ut=I.height;let Q=n.COLOR_BUFFER_BIT;const ct=I.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,kt=i.get(I),tt=A.length>1;if(tt)for(let dt=0;dt<A.length;dt++)e.bindFramebuffer(n.FRAMEBUFFER,kt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+dt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,kt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+dt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,kt.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,kt.__webglFramebuffer);for(let dt=0;dt<A.length;dt++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(Q|=n.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(Q|=n.STENCIL_BUFFER_BIT)),tt){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,kt.__webglColorRenderbuffer[dt]);const Nt=i.get(A[dt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Nt,0)}n.blitFramebuffer(0,0,j,ut,0,0,j,ut,Q,n.NEAREST),l===!0&&(Ut.length=0,G.length=0,Ut.push(n.COLOR_ATTACHMENT0+dt),I.depthBuffer&&I.resolveDepthBuffer===!1&&(Ut.push(ct),G.push(ct),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,G)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Ut))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),tt)for(let dt=0;dt<A.length;dt++){e.bindFramebuffer(n.FRAMEBUFFER,kt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+dt,n.RENDERBUFFER,kt.__webglColorRenderbuffer[dt]);const Nt=i.get(A[dt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,kt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+dt,n.TEXTURE_2D,Nt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,kt.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.resolveDepthBuffer===!1&&l){const A=I.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[A])}}}function Ht(I){return Math.min(a.maxSamples,I.samples)}function Pt(I){const A=i.get(I);return I.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function gt(I){const A=o.render.frame;h.get(I)!==A&&(h.set(I,A),I.update())}function zt(I,A){const j=I.colorSpace,ut=I.format,Q=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||j!==bs&&j!==ji&&(Se.getTransfer(j)===ke?(ut!==oi||Q!==Ui)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",j)),A}function Ot(I){return typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement?(c.width=I.naturalWidth||I.width,c.height=I.naturalHeight||I.height):typeof VideoFrame<"u"&&I instanceof VideoFrame?(c.width=I.displayWidth,c.height=I.displayHeight):(c.width=I.width,c.height=I.height),c}this.allocateTextureUnit=z,this.resetTextureUnits=C,this.setTexture2D=D,this.setTexture2DArray=L,this.setTexture3D=F,this.setTextureCube=H,this.rebindTextures=Mt,this.setupRenderTarget=It,this.updateRenderTargetMipmap=Ct,this.updateMultisampleRenderTarget=re,this.setupDepthRenderbuffer=$,this.setupFrameBufferTexture=ht,this.useMultisampledRTT=Pt}function aS(n,t){function e(i,a=ji){let s;const o=Se.getTransfer(a);if(i===Ui)return n.UNSIGNED_BYTE;if(i===Mh)return n.UNSIGNED_SHORT_4_4_4_4;if(i===bh)return n.UNSIGNED_SHORT_5_5_5_1;if(i===sp)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===ip)return n.BYTE;if(i===ap)return n.SHORT;if(i===no)return n.UNSIGNED_SHORT;if(i===_h)return n.INT;if(i===Ta)return n.UNSIGNED_INT;if(i===Ii)return n.FLOAT;if(i===ho)return n.HALF_FLOAT;if(i===op)return n.ALPHA;if(i===rp)return n.RGB;if(i===oi)return n.RGBA;if(i===cp)return n.LUMINANCE;if(i===lp)return n.LUMINANCE_ALPHA;if(i===hs)return n.DEPTH_COMPONENT;if(i===_s)return n.DEPTH_STENCIL;if(i===hp)return n.RED;if(i===Sh)return n.RED_INTEGER;if(i===dp)return n.RG;if(i===wh)return n.RG_INTEGER;if(i===Eh)return n.RGBA_INTEGER;if(i===cr||i===lr||i===hr||i===dr)if(o===ke)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===cr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===lr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===hr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===dr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===cr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===lr)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===hr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===dr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Rl||i===Pl||i===Cl||i===Ll)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Rl)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Pl)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Cl)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Ll)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Dl||i===kl||i===Il)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Dl||i===kl)return o===ke?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Il)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===zl||i===Fl||i===Ul||i===Nl||i===Ol||i===Bl||i===Hl||i===Gl||i===Vl||i===Xl||i===Wl||i===Yl||i===$l||i===Zl)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===zl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Fl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Ul)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Nl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ol)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Bl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Hl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Gl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Vl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Xl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Wl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Yl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===$l)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Zl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ur||i===jl||i===ql)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===ur)return o===ke?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===jl)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===ql)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===up||i===Kl||i===Jl||i===Ql)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===ur)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Kl)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Jl)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ql)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ys?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class sS extends $n{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Ce extends Ze{constructor(){super(),this.isGroup=!0,this.type="Group"}}const oS={type:"move"};class Xc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ce,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ce,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new B,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new B),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ce,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new B,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new B),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let a=null,s=null,o=null;const r=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,i),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));r!==null&&(a=e.getPose(t.targetRaySpace,i),a===null&&s!==null&&(a=s),a!==null&&(r.matrix.fromArray(a.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,a.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(a.linearVelocity)):r.hasLinearVelocity=!1,a.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(a.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(oS)))}return r!==null&&(r.visible=a!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new Ce;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const rS=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,cS=`
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

}`;class lS{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const a=new Tn,s=t.properties.get(a);s.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=a}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new ia({vertexShader:rS,fragmentShader:cS,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new _e(new Yn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class hS extends Ss{constructor(t,e){super();const i=this;let a=null,s=1,o=null,r="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,g=null;const _=new lS,m=e.getContextAttributes();let p=null,y=null;const x=[],v=[],w=new $t;let S=null;const T=new $n;T.viewport=new Je;const E=new $n;E.viewport=new Je;const b=[T,E],M=new sS;let R=null,C=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let et=x[J];return et===void 0&&(et=new Xc,x[J]=et),et.getTargetRaySpace()},this.getControllerGrip=function(J){let et=x[J];return et===void 0&&(et=new Xc,x[J]=et),et.getGripSpace()},this.getHand=function(J){let et=x[J];return et===void 0&&(et=new Xc,x[J]=et),et.getHandSpace()};function z(J){const et=v.indexOf(J.inputSource);if(et===-1)return;const ht=x[et];ht!==void 0&&(ht.update(J.inputSource,J.frame,c||o),ht.dispatchEvent({type:J.type,data:J.inputSource}))}function N(){a.removeEventListener("select",z),a.removeEventListener("selectstart",z),a.removeEventListener("selectend",z),a.removeEventListener("squeeze",z),a.removeEventListener("squeezestart",z),a.removeEventListener("squeezeend",z),a.removeEventListener("end",N),a.removeEventListener("inputsourceschange",D);for(let J=0;J<x.length;J++){const et=v[J];et!==null&&(v[J]=null,x[J].disconnect(et))}R=null,C=null,_.reset(),t.setRenderTarget(p),f=null,d=null,u=null,a=null,y=null,Lt.stop(),i.isPresenting=!1,t.setPixelRatio(S),t.setSize(w.width,w.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){s=J,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){r=J,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(J){c=J},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return a},this.setSession=async function(J){if(a=J,a!==null){if(p=t.getRenderTarget(),a.addEventListener("select",z),a.addEventListener("selectstart",z),a.addEventListener("selectend",z),a.addEventListener("squeeze",z),a.addEventListener("squeezestart",z),a.addEventListener("squeezeend",z),a.addEventListener("end",N),a.addEventListener("inputsourceschange",D),m.xrCompatible!==!0&&await e.makeXRCompatible(),S=t.getPixelRatio(),t.getSize(w),a.renderState.layers===void 0){const et={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(a,e,et),a.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Aa(f.framebufferWidth,f.framebufferHeight,{format:oi,type:Ui,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let et=null,ht=null,q=null;m.depth&&(q=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,et=m.stencil?_s:hs,ht=m.stencil?ys:Ta);const K={colorFormat:e.RGBA8,depthFormat:q,scaleFactor:s};u=new XRWebGLBinding(a,e),d=u.createProjectionLayer(K),a.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),y=new Aa(d.textureWidth,d.textureHeight,{format:oi,type:Ui,depthTexture:new Tp(d.textureWidth,d.textureHeight,ht,void 0,void 0,void 0,void 0,void 0,void 0,et),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await a.requestReferenceSpace(r),Lt.setContext(a),Lt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function D(J){for(let et=0;et<J.removed.length;et++){const ht=J.removed[et],q=v.indexOf(ht);q>=0&&(v[q]=null,x[q].disconnect(ht))}for(let et=0;et<J.added.length;et++){const ht=J.added[et];let q=v.indexOf(ht);if(q===-1){for(let $=0;$<x.length;$++)if($>=v.length){v.push(ht),q=$;break}else if(v[$]===null){v[$]=ht,q=$;break}if(q===-1)break}const K=x[q];K&&K.connect(ht)}}const L=new B,F=new B;function H(J,et,ht){L.setFromMatrixPosition(et.matrixWorld),F.setFromMatrixPosition(ht.matrixWorld);const q=L.distanceTo(F),K=et.projectionMatrix.elements,$=ht.projectionMatrix.elements,Mt=K[14]/(K[10]-1),It=K[14]/(K[10]+1),Ct=(K[9]+1)/K[5],Ut=(K[9]-1)/K[5],G=(K[8]-1)/K[0],re=($[8]+1)/$[0],Ht=Mt*G,Pt=Mt*re,gt=q/(-G+re),zt=gt*-G;if(et.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(zt),J.translateZ(gt),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),K[10]===-1)J.projectionMatrix.copy(et.projectionMatrix),J.projectionMatrixInverse.copy(et.projectionMatrixInverse);else{const Ot=Mt+gt,I=It+gt,A=Ht-zt,j=Pt+(q-zt),ut=Ct*It/I*Ot,Q=Ut*It/I*Ot;J.projectionMatrix.makePerspective(A,j,ut,Q,Ot,I),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function Y(J,et){et===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(et.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(a===null)return;let et=J.near,ht=J.far;_.texture!==null&&(_.depthNear>0&&(et=_.depthNear),_.depthFar>0&&(ht=_.depthFar)),M.near=E.near=T.near=et,M.far=E.far=T.far=ht,(R!==M.near||C!==M.far)&&(a.updateRenderState({depthNear:M.near,depthFar:M.far}),R=M.near,C=M.far),T.layers.mask=J.layers.mask|2,E.layers.mask=J.layers.mask|4,M.layers.mask=T.layers.mask|E.layers.mask;const q=J.parent,K=M.cameras;Y(M,q);for(let $=0;$<K.length;$++)Y(K[$],q);K.length===2?H(M,T,E):M.projectionMatrix.copy(T.projectionMatrix),it(J,M,q)};function it(J,et,ht){ht===null?J.matrix.copy(et.matrixWorld):(J.matrix.copy(ht.matrixWorld),J.matrix.invert(),J.matrix.multiply(et.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(et.projectionMatrix),J.projectionMatrixInverse.copy(et.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=io*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(J){l=J,d!==null&&(d.fixedFoveation=J),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=J)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(M)};let mt=null;function _t(J,et){if(h=et.getViewerPose(c||o),g=et,h!==null){const ht=h.views;f!==null&&(t.setRenderTargetFramebuffer(y,f.framebuffer),t.setRenderTarget(y));let q=!1;ht.length!==M.cameras.length&&(M.cameras.length=0,q=!0);for(let $=0;$<ht.length;$++){const Mt=ht[$];let It=null;if(f!==null)It=f.getViewport(Mt);else{const Ut=u.getViewSubImage(d,Mt);It=Ut.viewport,$===0&&(t.setRenderTargetTextures(y,Ut.colorTexture,d.ignoreDepthValues?void 0:Ut.depthStencilTexture),t.setRenderTarget(y))}let Ct=b[$];Ct===void 0&&(Ct=new $n,Ct.layers.enable($),Ct.viewport=new Je,b[$]=Ct),Ct.matrix.fromArray(Mt.transform.matrix),Ct.matrix.decompose(Ct.position,Ct.quaternion,Ct.scale),Ct.projectionMatrix.fromArray(Mt.projectionMatrix),Ct.projectionMatrixInverse.copy(Ct.projectionMatrix).invert(),Ct.viewport.set(It.x,It.y,It.width,It.height),$===0&&(M.matrix.copy(Ct.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),q===!0&&M.cameras.push(Ct)}const K=a.enabledFeatures;if(K&&K.includes("depth-sensing")){const $=u.getDepthInformation(ht[0]);$&&$.isValid&&$.texture&&_.init(t,$,a.renderState)}}for(let ht=0;ht<x.length;ht++){const q=v[ht],K=x[ht];q!==null&&K!==void 0&&K.update(q,et,c||o)}mt&&mt(J,et),et.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:et}),g=null}const Lt=new wp;Lt.setAnimationLoop(_t),this.setAnimationLoop=function(J){mt=J},this.dispose=function(){}}}const pa=new _i,dS=new Ue;function uS(n,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,Mp(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function a(m,p,y,x,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),u(m,p)):p.isMeshPhongMaterial?(s(m,p),h(m,p)):p.isMeshStandardMaterial?(s(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,v)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),_(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&r(m,p)):p.isPointsMaterial?l(m,p,y,x):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Pn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Pn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const y=t.get(p),x=y.envMap,v=y.envMapRotation;x&&(m.envMap.value=x,pa.copy(v),pa.x*=-1,pa.y*=-1,pa.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(pa.y*=-1,pa.z*=-1),m.envMapRotation.value.setFromMatrix4(dS.makeRotationFromEuler(pa)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function r(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,y,x){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*y,m.scale.value=x*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,y){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Pn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const y=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:a}}function fS(n,t,e,i){let a={},s={},o=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,x){const v=x.program;i.uniformBlockBinding(y,v)}function c(y,x){let v=a[y.id];v===void 0&&(g(y),v=h(y),a[y.id]=v,y.addEventListener("dispose",m));const w=x.program;i.updateUBOMapping(y,w);const S=t.render.frame;s[y.id]!==S&&(d(y),s[y.id]=S)}function h(y){const x=u();y.__bindingPointIndex=x;const v=n.createBuffer(),w=y.__size,S=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,v),n.bufferData(n.UNIFORM_BUFFER,w,S),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,v),v}function u(){for(let y=0;y<r;y++)if(o.indexOf(y)===-1)return o.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){const x=a[y.id],v=y.uniforms,w=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let S=0,T=v.length;S<T;S++){const E=Array.isArray(v[S])?v[S]:[v[S]];for(let b=0,M=E.length;b<M;b++){const R=E[b];if(f(R,S,b,w)===!0){const C=R.__offset,z=Array.isArray(R.value)?R.value:[R.value];let N=0;for(let D=0;D<z.length;D++){const L=z[D],F=_(L);typeof L=="number"||typeof L=="boolean"?(R.__data[0]=L,n.bufferSubData(n.UNIFORM_BUFFER,C+N,R.__data)):L.isMatrix3?(R.__data[0]=L.elements[0],R.__data[1]=L.elements[1],R.__data[2]=L.elements[2],R.__data[3]=0,R.__data[4]=L.elements[3],R.__data[5]=L.elements[4],R.__data[6]=L.elements[5],R.__data[7]=0,R.__data[8]=L.elements[6],R.__data[9]=L.elements[7],R.__data[10]=L.elements[8],R.__data[11]=0):(L.toArray(R.__data,N),N+=F.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,C,R.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(y,x,v,w){const S=y.value,T=x+"_"+v;if(w[T]===void 0)return typeof S=="number"||typeof S=="boolean"?w[T]=S:w[T]=S.clone(),!0;{const E=w[T];if(typeof S=="number"||typeof S=="boolean"){if(E!==S)return w[T]=S,!0}else if(E.equals(S)===!1)return E.copy(S),!0}return!1}function g(y){const x=y.uniforms;let v=0;const w=16;for(let T=0,E=x.length;T<E;T++){const b=Array.isArray(x[T])?x[T]:[x[T]];for(let M=0,R=b.length;M<R;M++){const C=b[M],z=Array.isArray(C.value)?C.value:[C.value];for(let N=0,D=z.length;N<D;N++){const L=z[N],F=_(L),H=v%w,Y=H%F.boundary,it=H+Y;v+=Y,it!==0&&w-it<F.storage&&(v+=w-it),C.__data=new Float32Array(F.storage/Float32Array.BYTES_PER_ELEMENT),C.__offset=v,v+=F.storage}}}const S=v%w;return S>0&&(v+=w-S),y.__size=v,y.__cache={},this}function _(y){const x={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(x.boundary=4,x.storage=4):y.isVector2?(x.boundary=8,x.storage=8):y.isVector3||y.isColor?(x.boundary=16,x.storage=12):y.isVector4?(x.boundary=16,x.storage=16):y.isMatrix3?(x.boundary=48,x.storage=48):y.isMatrix4?(x.boundary=64,x.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),x}function m(y){const x=y.target;x.removeEventListener("dispose",m);const v=o.indexOf(x.__bindingPointIndex);o.splice(v,1),n.deleteBuffer(a[x.id]),delete a[x.id],delete s[x.id]}function p(){for(const y in a)n.deleteBuffer(a[y]);o=[],a={},s={}}return{bind:l,update:c,dispose:p}}class pS{constructor(t={}){const{canvas:e=ny(),context:i=null,depth:a=!0,stencil:s=!1,alpha:o=!1,antialias:r=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=o;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const y=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=En,this.toneMapping=ta,this.toneMappingExposure=1;const v=this;let w=!1,S=0,T=0,E=null,b=-1,M=null;const R=new Je,C=new Je;let z=null;const N=new ne(0);let D=0,L=e.width,F=e.height,H=1,Y=null,it=null;const mt=new Je(0,0,L,F),_t=new Je(0,0,L,F);let Lt=!1;const J=new Ph;let et=!1,ht=!1;const q=new Ue,K=new Ue,$=new B,Mt=new Je,It={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ct=!1;function Ut(){return E===null?H:1}let G=i;function re(P,X){return e.getContext(P,X)}try{const P={alpha:!0,depth:a,stencil:s,antialias:r,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${vh}`),e.addEventListener("webglcontextlost",ft,!1),e.addEventListener("webglcontextrestored",Rt,!1),e.addEventListener("webglcontextcreationerror",Et,!1),G===null){const X="webgl2";if(G=re(X,P),G===null)throw re(X)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(P){throw console.error("THREE.WebGLRenderer: "+P.message),P}let Ht,Pt,gt,zt,Ot,I,A,j,ut,Q,ct,kt,tt,dt,Nt,at,bt,O,lt,xt,Wt,Gt,qt,U;function At(){Ht=new yb(G),Ht.init(),Gt=new aS(G,Ht),Pt=new fb(G,Ht,t,Gt),gt=new eS(G,Ht),Pt.reverseDepthBuffer&&d&&gt.buffers.depth.setReversed(!0),zt=new bb(G),Ot=new B1,I=new iS(G,Ht,gt,Ot,Pt,Gt,zt),A=new mb(v),j=new vb(v),ut=new Py(G),qt=new db(G,ut),Q=new _b(G,ut,zt,qt),ct=new wb(G,Q,ut,zt),lt=new Sb(G,Pt,I),at=new pb(Ot),kt=new O1(v,A,j,Ht,Pt,qt,at),tt=new uS(v,Ot),dt=new G1,Nt=new Z1(Ht),O=new hb(v,A,j,gt,ct,f,l),bt=new Q1(v,ct,Pt),U=new fS(G,zt,Pt,gt),xt=new ub(G,Ht,zt),Wt=new Mb(G,Ht,zt),zt.programs=kt.programs,v.capabilities=Pt,v.extensions=Ht,v.properties=Ot,v.renderLists=dt,v.shadowMap=bt,v.state=gt,v.info=zt}At();const nt=new hS(v,G);this.xr=nt,this.getContext=function(){return G},this.getContextAttributes=function(){return G.getContextAttributes()},this.forceContextLoss=function(){const P=Ht.get("WEBGL_lose_context");P&&P.loseContext()},this.forceContextRestore=function(){const P=Ht.get("WEBGL_lose_context");P&&P.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(P){P!==void 0&&(H=P,this.setSize(L,F,!1))},this.getSize=function(P){return P.set(L,F)},this.setSize=function(P,X,ot=!0){if(nt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}L=P,F=X,e.width=Math.floor(P*H),e.height=Math.floor(X*H),ot===!0&&(e.style.width=P+"px",e.style.height=X+"px"),this.setViewport(0,0,P,X)},this.getDrawingBufferSize=function(P){return P.set(L*H,F*H).floor()},this.setDrawingBufferSize=function(P,X,ot){L=P,F=X,H=ot,e.width=Math.floor(P*ot),e.height=Math.floor(X*ot),this.setViewport(0,0,P,X)},this.getCurrentViewport=function(P){return P.copy(R)},this.getViewport=function(P){return P.copy(mt)},this.setViewport=function(P,X,ot,st){P.isVector4?mt.set(P.x,P.y,P.z,P.w):mt.set(P,X,ot,st),gt.viewport(R.copy(mt).multiplyScalar(H).round())},this.getScissor=function(P){return P.copy(_t)},this.setScissor=function(P,X,ot,st){P.isVector4?_t.set(P.x,P.y,P.z,P.w):_t.set(P,X,ot,st),gt.scissor(C.copy(_t).multiplyScalar(H).round())},this.getScissorTest=function(){return Lt},this.setScissorTest=function(P){gt.setScissorTest(Lt=P)},this.setOpaqueSort=function(P){Y=P},this.setTransparentSort=function(P){it=P},this.getClearColor=function(P){return P.copy(O.getClearColor())},this.setClearColor=function(){O.setClearColor.apply(O,arguments)},this.getClearAlpha=function(){return O.getClearAlpha()},this.setClearAlpha=function(){O.setClearAlpha.apply(O,arguments)},this.clear=function(P=!0,X=!0,ot=!0){let st=0;if(P){let W=!1;if(E!==null){const St=E.texture.format;W=St===Eh||St===wh||St===Sh}if(W){const St=E.texture.type,Dt=St===Ui||St===Ta||St===no||St===ys||St===Mh||St===bh,Yt=O.getClearColor(),jt=O.getClearAlpha(),Bt=Yt.r,vt=Yt.g,rt=Yt.b;Dt?(g[0]=Bt,g[1]=vt,g[2]=rt,g[3]=jt,G.clearBufferuiv(G.COLOR,0,g)):(_[0]=Bt,_[1]=vt,_[2]=rt,_[3]=jt,G.clearBufferiv(G.COLOR,0,_))}else st|=G.COLOR_BUFFER_BIT}X&&(st|=G.DEPTH_BUFFER_BIT),ot&&(st|=G.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G.clear(st)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ft,!1),e.removeEventListener("webglcontextrestored",Rt,!1),e.removeEventListener("webglcontextcreationerror",Et,!1),dt.dispose(),Nt.dispose(),Ot.dispose(),A.dispose(),j.dispose(),ct.dispose(),qt.dispose(),U.dispose(),kt.dispose(),nt.dispose(),nt.removeEventListener("sessionstart",ln),nt.removeEventListener("sessionend",V),wt.stop()};function ft(P){P.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function Rt(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const P=zt.autoReset,X=bt.enabled,ot=bt.autoUpdate,st=bt.needsUpdate,W=bt.type;At(),zt.autoReset=P,bt.enabled=X,bt.autoUpdate=ot,bt.needsUpdate=st,bt.type=W}function Et(P){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",P.statusMessage)}function Vt(P){const X=P.target;X.removeEventListener("dispose",Vt),ce(X)}function ce(P){me(P),Ot.remove(P)}function me(P){const X=Ot.get(P).programs;X!==void 0&&(X.forEach(function(ot){kt.releaseProgram(ot)}),P.isShaderMaterial&&kt.releaseShaderCache(P))}this.renderBufferDirect=function(P,X,ot,st,W,St){X===null&&(X=It);const Dt=W.isMesh&&W.matrixWorld.determinant()<0,Yt=be(P,X,ot,st,W);gt.setMaterial(st,Dt);let jt=ot.index,Bt=1;if(st.wireframe===!0){if(jt=Q.getWireframeAttribute(ot),jt===void 0)return;Bt=2}const vt=ot.drawRange,rt=ot.attributes.position;let Ft=vt.start*Bt,se=(vt.start+vt.count)*Bt;St!==null&&(Ft=Math.max(Ft,St.start*Bt),se=Math.min(se,(St.start+St.count)*Bt)),jt!==null?(Ft=Math.max(Ft,0),se=Math.min(se,jt.count)):rt!=null&&(Ft=Math.max(Ft,0),se=Math.min(se,rt.count));const oe=se-Ft;if(oe<0||oe===1/0)return;qt.setup(W,st,Yt,ot,jt);let Ve,le=xt;if(jt!==null&&(Ve=ut.get(jt),le=Wt,le.setIndex(Ve)),W.isMesh)st.wireframe===!0?(gt.setLineWidth(st.wireframeLinewidth*Ut()),le.setMode(G.LINES)):le.setMode(G.TRIANGLES);else if(W.isLine){let Zt=st.linewidth;Zt===void 0&&(Zt=1),gt.setLineWidth(Zt*Ut()),W.isLineSegments?le.setMode(G.LINES):W.isLineLoop?le.setMode(G.LINE_LOOP):le.setMode(G.LINE_STRIP)}else W.isPoints?le.setMode(G.POINTS):W.isSprite&&le.setMode(G.TRIANGLES);if(W.isBatchedMesh)if(W._multiDrawInstances!==null)le.renderMultiDrawInstances(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount,W._multiDrawInstances);else if(Ht.get("WEBGL_multi_draw"))le.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{const Zt=W._multiDrawStarts,sn=W._multiDrawCounts,he=W._multiDrawCount,Oe=jt?ut.get(jt).bytesPerElement:1,Gn=Ot.get(st).currentProgram.getUniforms();for(let Be=0;Be<he;Be++)Gn.setValue(G,"_gl_DrawID",Be),le.render(Zt[Be]/Oe,sn[Be])}else if(W.isInstancedMesh)le.renderInstances(Ft,oe,W.count);else if(ot.isInstancedBufferGeometry){const Zt=ot._maxInstanceCount!==void 0?ot._maxInstanceCount:1/0,sn=Math.min(ot.instanceCount,Zt);le.renderInstances(Ft,oe,sn)}else le.render(Ft,oe)};function ie(P,X,ot){P.transparent===!0&&P.side===Ke&&P.forceSinglePass===!1?(P.side=Pn,P.needsUpdate=!0,Ne(P,X,ot),P.side=na,P.needsUpdate=!0,Ne(P,X,ot),P.side=Ke):Ne(P,X,ot)}this.compile=function(P,X,ot=null){ot===null&&(ot=P),p=Nt.get(ot),p.init(X),x.push(p),ot.traverseVisible(function(W){W.isLight&&W.layers.test(X.layers)&&(p.pushLight(W),W.castShadow&&p.pushShadow(W))}),P!==ot&&P.traverseVisible(function(W){W.isLight&&W.layers.test(X.layers)&&(p.pushLight(W),W.castShadow&&p.pushShadow(W))}),p.setupLights();const st=new Set;return P.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;const St=W.material;if(St)if(Array.isArray(St))for(let Dt=0;Dt<St.length;Dt++){const Yt=St[Dt];ie(Yt,ot,W),st.add(Yt)}else ie(St,ot,W),st.add(St)}),x.pop(),p=null,st},this.compileAsync=function(P,X,ot=null){const st=this.compile(P,X,ot);return new Promise(W=>{function St(){if(st.forEach(function(Dt){Ot.get(Dt).currentProgram.isReady()&&st.delete(Dt)}),st.size===0){W(P);return}setTimeout(St,10)}Ht.get("KHR_parallel_shader_compile")!==null?St():setTimeout(St,10)})};let Ee=null;function Ge(P){Ee&&Ee(P)}function ln(){wt.stop()}function V(){wt.start()}const wt=new wp;wt.setAnimationLoop(Ge),typeof self<"u"&&wt.setContext(self),this.setAnimationLoop=function(P){Ee=P,nt.setAnimationLoop(P),P===null?wt.stop():wt.start()},nt.addEventListener("sessionstart",ln),nt.addEventListener("sessionend",V),this.render=function(P,X){if(X!==void 0&&X.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),X.parent===null&&X.matrixWorldAutoUpdate===!0&&X.updateMatrixWorld(),nt.enabled===!0&&nt.isPresenting===!0&&(nt.cameraAutoUpdate===!0&&nt.updateCamera(X),X=nt.getCamera()),P.isScene===!0&&P.onBeforeRender(v,P,X,E),p=Nt.get(P,x.length),p.init(X),x.push(p),K.multiplyMatrices(X.projectionMatrix,X.matrixWorldInverse),J.setFromProjectionMatrix(K),ht=this.localClippingEnabled,et=at.init(this.clippingPlanes,ht),m=dt.get(P,y.length),m.init(),y.push(m),nt.enabled===!0&&nt.isPresenting===!0){const St=v.xr.getDepthSensingMesh();St!==null&&Tt(St,X,-1/0,v.sortObjects)}Tt(P,X,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(Y,it),Ct=nt.enabled===!1||nt.isPresenting===!1||nt.hasDepthSensing()===!1,Ct&&O.addToRenderList(m,P),this.info.render.frame++,et===!0&&at.beginShadows();const ot=p.state.shadowsArray;bt.render(ot,P,X),et===!0&&at.endShadows(),this.info.autoReset===!0&&this.info.reset();const st=m.opaque,W=m.transmissive;if(p.setupLights(),X.isArrayCamera){const St=X.cameras;if(W.length>0)for(let Dt=0,Yt=St.length;Dt<Yt;Dt++){const jt=St[Dt];fe(st,W,P,jt)}Ct&&O.render(P);for(let Dt=0,Yt=St.length;Dt<Yt;Dt++){const jt=St[Dt];Qt(m,P,jt,jt.viewport)}}else W.length>0&&fe(st,W,P,X),Ct&&O.render(P),Qt(m,P,X);E!==null&&(I.updateMultisampleRenderTarget(E),I.updateRenderTargetMipmap(E)),P.isScene===!0&&P.onAfterRender(v,P,X),qt.resetDefaultState(),b=-1,M=null,x.pop(),x.length>0?(p=x[x.length-1],et===!0&&at.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,y.pop(),y.length>0?m=y[y.length-1]:m=null};function Tt(P,X,ot,st){if(P.visible===!1)return;if(P.layers.test(X.layers)){if(P.isGroup)ot=P.renderOrder;else if(P.isLOD)P.autoUpdate===!0&&P.update(X);else if(P.isLight)p.pushLight(P),P.castShadow&&p.pushShadow(P);else if(P.isSprite){if(!P.frustumCulled||J.intersectsSprite(P)){st&&Mt.setFromMatrixPosition(P.matrixWorld).applyMatrix4(K);const Dt=ct.update(P),Yt=P.material;Yt.visible&&m.push(P,Dt,Yt,ot,Mt.z,null)}}else if((P.isMesh||P.isLine||P.isPoints)&&(!P.frustumCulled||J.intersectsObject(P))){const Dt=ct.update(P),Yt=P.material;if(st&&(P.boundingSphere!==void 0?(P.boundingSphere===null&&P.computeBoundingSphere(),Mt.copy(P.boundingSphere.center)):(Dt.boundingSphere===null&&Dt.computeBoundingSphere(),Mt.copy(Dt.boundingSphere.center)),Mt.applyMatrix4(P.matrixWorld).applyMatrix4(K)),Array.isArray(Yt)){const jt=Dt.groups;for(let Bt=0,vt=jt.length;Bt<vt;Bt++){const rt=jt[Bt],Ft=Yt[rt.materialIndex];Ft&&Ft.visible&&m.push(P,Dt,Ft,ot,Mt.z,rt)}}else Yt.visible&&m.push(P,Dt,Yt,ot,Mt.z,null)}}const St=P.children;for(let Dt=0,Yt=St.length;Dt<Yt;Dt++)Tt(St[Dt],X,ot,st)}function Qt(P,X,ot,st){const W=P.opaque,St=P.transmissive,Dt=P.transparent;p.setupLightsView(ot),et===!0&&at.setGlobalState(v.clippingPlanes,ot),st&&gt.viewport(R.copy(st)),W.length>0&&ae(W,X,ot),St.length>0&&ae(St,X,ot),Dt.length>0&&ae(Dt,X,ot),gt.buffers.depth.setTest(!0),gt.buffers.depth.setMask(!0),gt.buffers.color.setMask(!0),gt.setPolygonOffset(!1)}function fe(P,X,ot,st){if((ot.isScene===!0?ot.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[st.id]===void 0&&(p.state.transmissionRenderTarget[st.id]=new Aa(1,1,{generateMipmaps:!0,type:Ht.has("EXT_color_buffer_half_float")||Ht.has("EXT_color_buffer_float")?ho:Ui,minFilter:wa,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Se.workingColorSpace}));const St=p.state.transmissionRenderTarget[st.id],Dt=st.viewport||R;St.setSize(Dt.z,Dt.w);const Yt=v.getRenderTarget();v.setRenderTarget(St),v.getClearColor(N),D=v.getClearAlpha(),D<1&&v.setClearColor(16777215,.5),v.clear(),Ct&&O.render(ot);const jt=v.toneMapping;v.toneMapping=ta;const Bt=st.viewport;if(st.viewport!==void 0&&(st.viewport=void 0),p.setupLightsView(st),et===!0&&at.setGlobalState(v.clippingPlanes,st),ae(P,ot,st),I.updateMultisampleRenderTarget(St),I.updateRenderTargetMipmap(St),Ht.has("WEBGL_multisampled_render_to_texture")===!1){let vt=!1;for(let rt=0,Ft=X.length;rt<Ft;rt++){const se=X[rt],oe=se.object,Ve=se.geometry,le=se.material,Zt=se.group;if(le.side===Ke&&oe.layers.test(st.layers)){const sn=le.side;le.side=Pn,le.needsUpdate=!0,ge(oe,ot,st,Ve,le,Zt),le.side=sn,le.needsUpdate=!0,vt=!0}}vt===!0&&(I.updateMultisampleRenderTarget(St),I.updateRenderTargetMipmap(St))}v.setRenderTarget(Yt),v.setClearColor(N,D),Bt!==void 0&&(st.viewport=Bt),v.toneMapping=jt}function ae(P,X,ot){const st=X.isScene===!0?X.overrideMaterial:null;for(let W=0,St=P.length;W<St;W++){const Dt=P[W],Yt=Dt.object,jt=Dt.geometry,Bt=st===null?Dt.material:st,vt=Dt.group;Yt.layers.test(ot.layers)&&ge(Yt,X,ot,jt,Bt,vt)}}function ge(P,X,ot,st,W,St){P.onBeforeRender(v,X,ot,st,W,St),P.modelViewMatrix.multiplyMatrices(ot.matrixWorldInverse,P.matrixWorld),P.normalMatrix.getNormalMatrix(P.modelViewMatrix),W.onBeforeRender(v,X,ot,st,P,St),W.transparent===!0&&W.side===Ke&&W.forceSinglePass===!1?(W.side=Pn,W.needsUpdate=!0,v.renderBufferDirect(ot,X,st,W,P,St),W.side=na,W.needsUpdate=!0,v.renderBufferDirect(ot,X,st,W,P,St),W.side=Ke):v.renderBufferDirect(ot,X,st,W,P,St),P.onAfterRender(v,X,ot,st,W,St)}function Ne(P,X,ot){X.isScene!==!0&&(X=It);const st=Ot.get(P),W=p.state.lights,St=p.state.shadowsArray,Dt=W.state.version,Yt=kt.getParameters(P,W.state,St,X,ot),jt=kt.getProgramCacheKey(Yt);let Bt=st.programs;st.environment=P.isMeshStandardMaterial?X.environment:null,st.fog=X.fog,st.envMap=(P.isMeshStandardMaterial?j:A).get(P.envMap||st.environment),st.envMapRotation=st.environment!==null&&P.envMap===null?X.environmentRotation:P.envMapRotation,Bt===void 0&&(P.addEventListener("dispose",Vt),Bt=new Map,st.programs=Bt);let vt=Bt.get(jt);if(vt!==void 0){if(st.currentProgram===vt&&st.lightsStateVersion===Dt)return Le(P,Yt),vt}else Yt.uniforms=kt.getUniforms(P),P.onBeforeCompile(Yt,v),vt=kt.acquireProgram(Yt,jt),Bt.set(jt,vt),st.uniforms=Yt.uniforms;const rt=st.uniforms;return(!P.isShaderMaterial&&!P.isRawShaderMaterial||P.clipping===!0)&&(rt.clippingPlanes=at.uniform),Le(P,Yt),st.needsLights=Hn(P),st.lightsStateVersion=Dt,st.needsLights&&(rt.ambientLightColor.value=W.state.ambient,rt.lightProbe.value=W.state.probe,rt.directionalLights.value=W.state.directional,rt.directionalLightShadows.value=W.state.directionalShadow,rt.spotLights.value=W.state.spot,rt.spotLightShadows.value=W.state.spotShadow,rt.rectAreaLights.value=W.state.rectArea,rt.ltc_1.value=W.state.rectAreaLTC1,rt.ltc_2.value=W.state.rectAreaLTC2,rt.pointLights.value=W.state.point,rt.pointLightShadows.value=W.state.pointShadow,rt.hemisphereLights.value=W.state.hemi,rt.directionalShadowMap.value=W.state.directionalShadowMap,rt.directionalShadowMatrix.value=W.state.directionalShadowMatrix,rt.spotShadowMap.value=W.state.spotShadowMap,rt.spotLightMatrix.value=W.state.spotLightMatrix,rt.spotLightMap.value=W.state.spotLightMap,rt.pointShadowMap.value=W.state.pointShadowMap,rt.pointShadowMatrix.value=W.state.pointShadowMatrix),st.currentProgram=vt,st.uniformsList=null,vt}function ze(P){if(P.uniformsList===null){const X=P.currentProgram.getUniforms();P.uniformsList=fr.seqWithValue(X.seq,P.uniforms)}return P.uniformsList}function Le(P,X){const ot=Ot.get(P);ot.outputColorSpace=X.outputColorSpace,ot.batching=X.batching,ot.batchingColor=X.batchingColor,ot.instancing=X.instancing,ot.instancingColor=X.instancingColor,ot.instancingMorph=X.instancingMorph,ot.skinning=X.skinning,ot.morphTargets=X.morphTargets,ot.morphNormals=X.morphNormals,ot.morphColors=X.morphColors,ot.morphTargetsCount=X.morphTargetsCount,ot.numClippingPlanes=X.numClippingPlanes,ot.numIntersection=X.numClipIntersection,ot.vertexAlphas=X.vertexAlphas,ot.vertexTangents=X.vertexTangents,ot.toneMapping=X.toneMapping}function be(P,X,ot,st,W){X.isScene!==!0&&(X=It),I.resetTextureUnits();const St=X.fog,Dt=st.isMeshStandardMaterial?X.environment:null,Yt=E===null?v.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:bs,jt=(st.isMeshStandardMaterial?j:A).get(st.envMap||Dt),Bt=st.vertexColors===!0&&!!ot.attributes.color&&ot.attributes.color.itemSize===4,vt=!!ot.attributes.tangent&&(!!st.normalMap||st.anisotropy>0),rt=!!ot.morphAttributes.position,Ft=!!ot.morphAttributes.normal,se=!!ot.morphAttributes.color;let oe=ta;st.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(oe=v.toneMapping);const Ve=ot.morphAttributes.position||ot.morphAttributes.normal||ot.morphAttributes.color,le=Ve!==void 0?Ve.length:0,Zt=Ot.get(st),sn=p.state.lights;if(et===!0&&(ht===!0||P!==M)){const mn=P===M&&st.id===b;at.setState(st,P,mn)}let he=!1;st.version===Zt.__version?(Zt.needsLights&&Zt.lightsStateVersion!==sn.state.version||Zt.outputColorSpace!==Yt||W.isBatchedMesh&&Zt.batching===!1||!W.isBatchedMesh&&Zt.batching===!0||W.isBatchedMesh&&Zt.batchingColor===!0&&W.colorTexture===null||W.isBatchedMesh&&Zt.batchingColor===!1&&W.colorTexture!==null||W.isInstancedMesh&&Zt.instancing===!1||!W.isInstancedMesh&&Zt.instancing===!0||W.isSkinnedMesh&&Zt.skinning===!1||!W.isSkinnedMesh&&Zt.skinning===!0||W.isInstancedMesh&&Zt.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&Zt.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&Zt.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&Zt.instancingMorph===!1&&W.morphTexture!==null||Zt.envMap!==jt||st.fog===!0&&Zt.fog!==St||Zt.numClippingPlanes!==void 0&&(Zt.numClippingPlanes!==at.numPlanes||Zt.numIntersection!==at.numIntersection)||Zt.vertexAlphas!==Bt||Zt.vertexTangents!==vt||Zt.morphTargets!==rt||Zt.morphNormals!==Ft||Zt.morphColors!==se||Zt.toneMapping!==oe||Zt.morphTargetsCount!==le)&&(he=!0):(he=!0,Zt.__version=st.version);let Oe=Zt.currentProgram;he===!0&&(Oe=Ne(st,X,W));let Gn=!1,Be=!1,jn=!1;const Te=Oe.getUniforms(),An=Zt.uniforms;if(gt.useProgram(Oe.program)&&(Gn=!0,Be=!0,jn=!0),st.id!==b&&(b=st.id,Be=!0),Gn||M!==P){gt.buffers.depth.getReversed()?(q.copy(P.projectionMatrix),ay(q),sy(q),Te.setValue(G,"projectionMatrix",q)):Te.setValue(G,"projectionMatrix",P.projectionMatrix),Te.setValue(G,"viewMatrix",P.matrixWorldInverse);const Vn=Te.map.cameraPosition;Vn!==void 0&&Vn.setValue(G,$.setFromMatrixPosition(P.matrixWorld)),Pt.logarithmicDepthBuffer&&Te.setValue(G,"logDepthBufFC",2/(Math.log(P.far+1)/Math.LN2)),(st.isMeshPhongMaterial||st.isMeshToonMaterial||st.isMeshLambertMaterial||st.isMeshBasicMaterial||st.isMeshStandardMaterial||st.isShaderMaterial)&&Te.setValue(G,"isOrthographic",P.isOrthographicCamera===!0),M!==P&&(M=P,Be=!0,jn=!0)}if(W.isSkinnedMesh){Te.setOptional(G,W,"bindMatrix"),Te.setOptional(G,W,"bindMatrixInverse");const mn=W.skeleton;mn&&(mn.boneTexture===null&&mn.computeBoneTexture(),Te.setValue(G,"boneTexture",mn.boneTexture,I))}W.isBatchedMesh&&(Te.setOptional(G,W,"batchingTexture"),Te.setValue(G,"batchingTexture",W._matricesTexture,I),Te.setOptional(G,W,"batchingIdTexture"),Te.setValue(G,"batchingIdTexture",W._indirectTexture,I),Te.setOptional(G,W,"batchingColorTexture"),W._colorsTexture!==null&&Te.setValue(G,"batchingColorTexture",W._colorsTexture,I));const bi=ot.morphAttributes;if((bi.position!==void 0||bi.normal!==void 0||bi.color!==void 0)&&lt.update(W,ot,Oe),(Be||Zt.receiveShadow!==W.receiveShadow)&&(Zt.receiveShadow=W.receiveShadow,Te.setValue(G,"receiveShadow",W.receiveShadow)),st.isMeshGouraudMaterial&&st.envMap!==null&&(An.envMap.value=jt,An.flipEnvMap.value=jt.isCubeTexture&&jt.isRenderTargetTexture===!1?-1:1),st.isMeshStandardMaterial&&st.envMap===null&&X.environment!==null&&(An.envMapIntensity.value=X.environmentIntensity),Be&&(Te.setValue(G,"toneMappingExposure",v.toneMappingExposure),Zt.needsLights&&Bn(An,jn),St&&st.fog===!0&&tt.refreshFogUniforms(An,St),tt.refreshMaterialUniforms(An,st,H,F,p.state.transmissionRenderTarget[P.id]),fr.upload(G,ze(Zt),An,I)),st.isShaderMaterial&&st.uniformsNeedUpdate===!0&&(fr.upload(G,ze(Zt),An,I),st.uniformsNeedUpdate=!1),st.isSpriteMaterial&&Te.setValue(G,"center",W.center),Te.setValue(G,"modelViewMatrix",W.modelViewMatrix),Te.setValue(G,"normalMatrix",W.normalMatrix),Te.setValue(G,"modelMatrix",W.matrixWorld),st.isShaderMaterial||st.isRawShaderMaterial){const mn=st.uniformsGroups;for(let Vn=0,qn=mn.length;Vn<qn;Vn++){const Ni=mn[Vn];U.update(Ni,Oe),U.bind(Ni,Oe)}}return Oe}function Bn(P,X){P.ambientLightColor.needsUpdate=X,P.lightProbe.needsUpdate=X,P.directionalLights.needsUpdate=X,P.directionalLightShadows.needsUpdate=X,P.pointLights.needsUpdate=X,P.pointLightShadows.needsUpdate=X,P.spotLights.needsUpdate=X,P.spotLightShadows.needsUpdate=X,P.rectAreaLights.needsUpdate=X,P.hemisphereLights.needsUpdate=X}function Hn(P){return P.isMeshLambertMaterial||P.isMeshToonMaterial||P.isMeshPhongMaterial||P.isMeshStandardMaterial||P.isShadowMaterial||P.isShaderMaterial&&P.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(P,X,ot){Ot.get(P.texture).__webglTexture=X,Ot.get(P.depthTexture).__webglTexture=ot;const st=Ot.get(P);st.__hasExternalTextures=!0,st.__autoAllocateDepthBuffer=ot===void 0,st.__autoAllocateDepthBuffer||Ht.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),st.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(P,X){const ot=Ot.get(P);ot.__webglFramebuffer=X,ot.__useDefaultFramebuffer=X===void 0},this.setRenderTarget=function(P,X=0,ot=0){E=P,S=X,T=ot;let st=!0,W=null,St=!1,Dt=!1;if(P){const jt=Ot.get(P);if(jt.__useDefaultFramebuffer!==void 0)gt.bindFramebuffer(G.FRAMEBUFFER,null),st=!1;else if(jt.__webglFramebuffer===void 0)I.setupRenderTarget(P);else if(jt.__hasExternalTextures)I.rebindTextures(P,Ot.get(P.texture).__webglTexture,Ot.get(P.depthTexture).__webglTexture);else if(P.depthBuffer){const rt=P.depthTexture;if(jt.__boundDepthTexture!==rt){if(rt!==null&&Ot.has(rt)&&(P.width!==rt.image.width||P.height!==rt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");I.setupDepthRenderbuffer(P)}}const Bt=P.texture;(Bt.isData3DTexture||Bt.isDataArrayTexture||Bt.isCompressedArrayTexture)&&(Dt=!0);const vt=Ot.get(P).__webglFramebuffer;P.isWebGLCubeRenderTarget?(Array.isArray(vt[X])?W=vt[X][ot]:W=vt[X],St=!0):P.samples>0&&I.useMultisampledRTT(P)===!1?W=Ot.get(P).__webglMultisampledFramebuffer:Array.isArray(vt)?W=vt[ot]:W=vt,R.copy(P.viewport),C.copy(P.scissor),z=P.scissorTest}else R.copy(mt).multiplyScalar(H).floor(),C.copy(_t).multiplyScalar(H).floor(),z=Lt;if(gt.bindFramebuffer(G.FRAMEBUFFER,W)&&st&&gt.drawBuffers(P,W),gt.viewport(R),gt.scissor(C),gt.setScissorTest(z),St){const jt=Ot.get(P.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_CUBE_MAP_POSITIVE_X+X,jt.__webglTexture,ot)}else if(Dt){const jt=Ot.get(P.texture),Bt=X||0;G.framebufferTextureLayer(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,jt.__webglTexture,ot||0,Bt)}b=-1},this.readRenderTargetPixels=function(P,X,ot,st,W,St,Dt){if(!(P&&P.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Yt=Ot.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&Dt!==void 0&&(Yt=Yt[Dt]),Yt){gt.bindFramebuffer(G.FRAMEBUFFER,Yt);try{const jt=P.texture,Bt=jt.format,vt=jt.type;if(!Pt.textureFormatReadable(Bt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Pt.textureTypeReadable(vt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}X>=0&&X<=P.width-st&&ot>=0&&ot<=P.height-W&&G.readPixels(X,ot,st,W,Gt.convert(Bt),Gt.convert(vt),St)}finally{const jt=E!==null?Ot.get(E).__webglFramebuffer:null;gt.bindFramebuffer(G.FRAMEBUFFER,jt)}}},this.readRenderTargetPixelsAsync=async function(P,X,ot,st,W,St,Dt){if(!(P&&P.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Yt=Ot.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&Dt!==void 0&&(Yt=Yt[Dt]),Yt){const jt=P.texture,Bt=jt.format,vt=jt.type;if(!Pt.textureFormatReadable(Bt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Pt.textureTypeReadable(vt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(X>=0&&X<=P.width-st&&ot>=0&&ot<=P.height-W){gt.bindFramebuffer(G.FRAMEBUFFER,Yt);const rt=G.createBuffer();G.bindBuffer(G.PIXEL_PACK_BUFFER,rt),G.bufferData(G.PIXEL_PACK_BUFFER,St.byteLength,G.STREAM_READ),G.readPixels(X,ot,st,W,Gt.convert(Bt),Gt.convert(vt),0);const Ft=E!==null?Ot.get(E).__webglFramebuffer:null;gt.bindFramebuffer(G.FRAMEBUFFER,Ft);const se=G.fenceSync(G.SYNC_GPU_COMMANDS_COMPLETE,0);return G.flush(),await iy(G,se,4),G.bindBuffer(G.PIXEL_PACK_BUFFER,rt),G.getBufferSubData(G.PIXEL_PACK_BUFFER,0,St),G.deleteBuffer(rt),G.deleteSync(se),St}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(P,X=null,ot=0){P.isTexture!==!0&&(Hs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),X=arguments[0]||null,P=arguments[1]);const st=Math.pow(2,-ot),W=Math.floor(P.image.width*st),St=Math.floor(P.image.height*st),Dt=X!==null?X.x:0,Yt=X!==null?X.y:0;I.setTexture2D(P,0),G.copyTexSubImage2D(G.TEXTURE_2D,ot,0,0,Dt,Yt,W,St),gt.unbindTexture()},this.copyTextureToTexture=function(P,X,ot=null,st=null,W=0){P.isTexture!==!0&&(Hs("WebGLRenderer: copyTextureToTexture function signature has changed."),st=arguments[0]||null,P=arguments[1],X=arguments[2],W=arguments[3]||0,ot=null);let St,Dt,Yt,jt,Bt,vt,rt,Ft,se;const oe=P.isCompressedTexture?P.mipmaps[W]:P.image;ot!==null?(St=ot.max.x-ot.min.x,Dt=ot.max.y-ot.min.y,Yt=ot.isBox3?ot.max.z-ot.min.z:1,jt=ot.min.x,Bt=ot.min.y,vt=ot.isBox3?ot.min.z:0):(St=oe.width,Dt=oe.height,Yt=oe.depth||1,jt=0,Bt=0,vt=0),st!==null?(rt=st.x,Ft=st.y,se=st.z):(rt=0,Ft=0,se=0);const Ve=Gt.convert(X.format),le=Gt.convert(X.type);let Zt;X.isData3DTexture?(I.setTexture3D(X,0),Zt=G.TEXTURE_3D):X.isDataArrayTexture||X.isCompressedArrayTexture?(I.setTexture2DArray(X,0),Zt=G.TEXTURE_2D_ARRAY):(I.setTexture2D(X,0),Zt=G.TEXTURE_2D),G.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,X.flipY),G.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,X.premultiplyAlpha),G.pixelStorei(G.UNPACK_ALIGNMENT,X.unpackAlignment);const sn=G.getParameter(G.UNPACK_ROW_LENGTH),he=G.getParameter(G.UNPACK_IMAGE_HEIGHT),Oe=G.getParameter(G.UNPACK_SKIP_PIXELS),Gn=G.getParameter(G.UNPACK_SKIP_ROWS),Be=G.getParameter(G.UNPACK_SKIP_IMAGES);G.pixelStorei(G.UNPACK_ROW_LENGTH,oe.width),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,oe.height),G.pixelStorei(G.UNPACK_SKIP_PIXELS,jt),G.pixelStorei(G.UNPACK_SKIP_ROWS,Bt),G.pixelStorei(G.UNPACK_SKIP_IMAGES,vt);const jn=P.isDataArrayTexture||P.isData3DTexture,Te=X.isDataArrayTexture||X.isData3DTexture;if(P.isRenderTargetTexture||P.isDepthTexture){const An=Ot.get(P),bi=Ot.get(X),mn=Ot.get(An.__renderTarget),Vn=Ot.get(bi.__renderTarget);gt.bindFramebuffer(G.READ_FRAMEBUFFER,mn.__webglFramebuffer),gt.bindFramebuffer(G.DRAW_FRAMEBUFFER,Vn.__webglFramebuffer);for(let qn=0;qn<Yt;qn++)jn&&G.framebufferTextureLayer(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,Ot.get(P).__webglTexture,W,vt+qn),P.isDepthTexture?(Te&&G.framebufferTextureLayer(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,Ot.get(X).__webglTexture,W,se+qn),G.blitFramebuffer(jt,Bt,St,Dt,rt,Ft,St,Dt,G.DEPTH_BUFFER_BIT,G.NEAREST)):Te?G.copyTexSubImage3D(Zt,W,rt,Ft,se+qn,jt,Bt,St,Dt):G.copyTexSubImage2D(Zt,W,rt,Ft,se+qn,jt,Bt,St,Dt);gt.bindFramebuffer(G.READ_FRAMEBUFFER,null),gt.bindFramebuffer(G.DRAW_FRAMEBUFFER,null)}else Te?P.isDataTexture||P.isData3DTexture?G.texSubImage3D(Zt,W,rt,Ft,se,St,Dt,Yt,Ve,le,oe.data):X.isCompressedArrayTexture?G.compressedTexSubImage3D(Zt,W,rt,Ft,se,St,Dt,Yt,Ve,oe.data):G.texSubImage3D(Zt,W,rt,Ft,se,St,Dt,Yt,Ve,le,oe):P.isDataTexture?G.texSubImage2D(G.TEXTURE_2D,W,rt,Ft,St,Dt,Ve,le,oe.data):P.isCompressedTexture?G.compressedTexSubImage2D(G.TEXTURE_2D,W,rt,Ft,oe.width,oe.height,Ve,oe.data):G.texSubImage2D(G.TEXTURE_2D,W,rt,Ft,St,Dt,Ve,le,oe);G.pixelStorei(G.UNPACK_ROW_LENGTH,sn),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,he),G.pixelStorei(G.UNPACK_SKIP_PIXELS,Oe),G.pixelStorei(G.UNPACK_SKIP_ROWS,Gn),G.pixelStorei(G.UNPACK_SKIP_IMAGES,Be),W===0&&X.generateMipmaps&&G.generateMipmap(Zt),gt.unbindTexture()},this.copyTextureToTexture3D=function(P,X,ot=null,st=null,W=0){return P.isTexture!==!0&&(Hs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),ot=arguments[0]||null,st=arguments[1]||null,P=arguments[2],X=arguments[3],W=arguments[4]||0),Hs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(P,X,ot,st,W)},this.initRenderTarget=function(P){Ot.get(P).__webglFramebuffer===void 0&&I.setupRenderTarget(P)},this.initTexture=function(P){P.isCubeTexture?I.setTextureCube(P,0):P.isData3DTexture?I.setTexture3D(P,0):P.isDataArrayTexture||P.isCompressedArrayTexture?I.setTexture2DArray(P,0):I.setTexture2D(P,0),gt.unbindTexture()},this.resetState=function(){S=0,T=0,E=null,gt.reset(),qt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return zi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Se._getDrawingBufferColorSpace(t),e.unpackColorSpace=Se._getUnpackColorSpace()}}class mS extends Ze{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new _i,this.environmentIntensity=1,this.environmentRotation=new _i,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class gS{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=th,this.updateRanges=[],this.version=0,this.uuid=yi()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let a=0,s=this.stride;a<s;a++)this.array[t+a]=e.array[i+a];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=yi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=yi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Sn=new B;class Rr{constructor(t,e,i,a=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=a}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)Sn.fromBufferAttribute(this,e),Sn.applyMatrix4(t),this.setXYZ(e,Sn.x,Sn.y,Sn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Sn.fromBufferAttribute(this,e),Sn.applyNormalMatrix(t),this.setXYZ(e,Sn.x,Sn.y,Sn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Sn.fromBufferAttribute(this,e),Sn.transformDirection(t),this.setXYZ(e,Sn.x,Sn.y,Sn.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=si(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Pe(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=Pe(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Pe(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Pe(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Pe(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=si(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=si(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=si(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=si(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=Pe(e,this.array),i=Pe(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=Pe(e,this.array),i=Pe(i,this.array),a=Pe(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Pe(e,this.array),i=Pe(i,this.array),a=Pe(a,this.array),s=Pe(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this.data.array[t+3]=s,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return new pn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Rr(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class nh extends Pa{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new ne(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let ts;const Us=new B,es=new B,ns=new B,is=new $t,Ns=new $t,Lp=new Ue,jo=new B,Os=new B,qo=new B,Zu=new $t,Wc=new $t,ju=new $t;class qu extends Ze{constructor(t=new nh){if(super(),this.isSprite=!0,this.type="Sprite",ts===void 0){ts=new an;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new gS(e,5);ts.setIndex([0,1,2,0,2,3]),ts.setAttribute("position",new Rr(i,3,0,!1)),ts.setAttribute("uv",new Rr(i,2,3,!1))}this.geometry=ts,this.material=t,this.center=new $t(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),es.setFromMatrixScale(this.matrixWorld),Lp.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),ns.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&es.multiplyScalar(-ns.z);const i=this.material.rotation;let a,s;i!==0&&(s=Math.cos(i),a=Math.sin(i));const o=this.center;Ko(jo.set(-.5,-.5,0),ns,o,es,a,s),Ko(Os.set(.5,-.5,0),ns,o,es,a,s),Ko(qo.set(.5,.5,0),ns,o,es,a,s),Zu.set(0,0),Wc.set(1,0),ju.set(1,1);let r=t.ray.intersectTriangle(jo,Os,qo,!1,Us);if(r===null&&(Ko(Os.set(-.5,.5,0),ns,o,es,a,s),Wc.set(0,1),r=t.ray.intersectTriangle(jo,qo,Os,!1,Us),r===null))return;const l=t.ray.origin.distanceTo(Us);l<t.near||l>t.far||e.push({distance:l,point:Us.clone(),uv:On.getInterpolation(Us,jo,Os,qo,Zu,Wc,ju,new $t),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Ko(n,t,e,i,a,s){is.subVectors(n,e).addScalar(.5).multiply(i),a!==void 0?(Ns.x=s*is.x-a*is.y,Ns.y=a*is.x+s*is.y):Ns.copy(is),n.copy(t),n.x+=Ns.x,n.y+=Ns.y,n.applyMatrix4(Lp)}class Lh extends Pa{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new ne(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Pr=new B,Cr=new B,Ku=new Ue,Bs=new Ah,Jo=new Or,Yc=new B,Ju=new B;class xS extends Ze{constructor(t=new an,e=new Lh){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let a=1,s=e.count;a<s;a++)Pr.fromBufferAttribute(e,a-1),Cr.fromBufferAttribute(e,a),i[a]=i[a-1],i[a]+=Pr.distanceTo(Cr);t.setAttribute("lineDistance",new we(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,a=this.matrixWorld,s=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Jo.copy(i.boundingSphere),Jo.applyMatrix4(a),Jo.radius+=s,t.ray.intersectsSphere(Jo)===!1)return;Ku.copy(a).invert(),Bs.copy(t.ray).applyMatrix4(Ku);const r=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=r*r,c=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const f=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=c){const p=h.getX(_),y=h.getX(_+1),x=Qo(this,t,Bs,l,p,y);x&&e.push(x)}if(this.isLineLoop){const _=h.getX(g-1),m=h.getX(f),p=Qo(this,t,Bs,l,_,m);p&&e.push(p)}}else{const f=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=c){const p=Qo(this,t,Bs,l,_,_+1);p&&e.push(p)}if(this.isLineLoop){const _=Qo(this,t,Bs,l,g-1,f);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}}function Qo(n,t,e,i,a,s){const o=n.geometry.attributes.position;if(Pr.fromBufferAttribute(o,a),Cr.fromBufferAttribute(o,s),e.distanceSqToSegment(Pr,Cr,Yc,Ju)>i)return;Yc.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(Yc);if(!(l<t.near||l>t.far))return{distance:l,point:Ju.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const Qu=new B,tf=new B;class Dp extends xS{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let a=0,s=e.count;a<s;a+=2)Qu.fromBufferAttribute(e,a),tf.fromBufferAttribute(e,a+1),i[a]=a===0?0:i[a-1],i[a+1]=i[a]+Qu.distanceTo(tf);t.setAttribute("lineDistance",new we(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class ih extends Tn{constructor(t,e,i,a,s,o,r,l,c){super(t,e,i,a,s,o,r,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Mi{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,a=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),s+=i.distanceTo(a),e.push(s),a=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let a=0;const s=i.length;let o;e?o=e:o=t*i[s-1];let r=0,l=s-1,c;for(;r<=l;)if(a=Math.floor(r+(l-r)/2),c=i[a]-o,c<0)r=a+1;else if(c>0)l=a-1;else{l=a;break}if(a=l,i[a]===o)return a/(s-1);const h=i[a],d=i[a+1]-h,f=(o-h)/d;return(a+f)/(s-1)}getTangent(t,e){let a=t-1e-4,s=t+1e-4;a<0&&(a=0),s>1&&(s=1);const o=this.getPoint(a),r=this.getPoint(s),l=e||(o.isVector2?new $t:new B);return l.copy(r).sub(o).normalize(),l}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new B,a=[],s=[],o=[],r=new B,l=new Ue;for(let f=0;f<=t;f++){const g=f/t;a[f]=this.getTangentAt(g,new B)}s[0]=new B,o[0]=new B;let c=Number.MAX_VALUE;const h=Math.abs(a[0].x),u=Math.abs(a[0].y),d=Math.abs(a[0].z);h<=c&&(c=h,i.set(1,0,0)),u<=c&&(c=u,i.set(0,1,0)),d<=c&&i.set(0,0,1),r.crossVectors(a[0],i).normalize(),s[0].crossVectors(a[0],r),o[0].crossVectors(a[0],s[0]);for(let f=1;f<=t;f++){if(s[f]=s[f-1].clone(),o[f]=o[f-1].clone(),r.crossVectors(a[f-1],a[f]),r.length()>Number.EPSILON){r.normalize();const g=Math.acos(fn(a[f-1].dot(a[f]),-1,1));s[f].applyMatrix4(l.makeRotationAxis(r,g))}o[f].crossVectors(a[f],s[f])}if(e===!0){let f=Math.acos(fn(s[0].dot(s[t]),-1,1));f/=t,a[0].dot(r.crossVectors(s[0],s[t]))>0&&(f=-f);for(let g=1;g<=t;g++)s[g].applyMatrix4(l.makeRotationAxis(a[g],f*g)),o[g].crossVectors(a[g],s[g])}return{tangents:a,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Dh extends Mi{constructor(t=0,e=0,i=1,a=1,s=0,o=Math.PI*2,r=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=a,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=r,this.aRotation=l}getPoint(t,e=new $t){const i=e,a=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=a;for(;s>a;)s-=a;s<Number.EPSILON&&(o?s=0:s=a),this.aClockwise===!0&&!o&&(s===a?s=-a:s=s-a);const r=this.aStartAngle+t*s;let l=this.aX+this.xRadius*Math.cos(r),c=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return i.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class vS extends Dh{constructor(t,e,i,a,s,o){super(t,e,i,i,a,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function kh(){let n=0,t=0,e=0,i=0;function a(s,o,r,l){n=s,t=r,e=-3*s+3*o-2*r-l,i=2*s-2*o+r+l}return{initCatmullRom:function(s,o,r,l,c){a(o,r,c*(r-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,r,l,c,h,u){let d=(o-s)/c-(r-s)/(c+h)+(r-o)/h,f=(r-o)/h-(l-o)/(h+u)+(l-r)/u;d*=h,f*=h,a(o,r,d,f)},calc:function(s){const o=s*s,r=o*s;return n+t*s+e*o+i*r}}}const tr=new B,$c=new kh,Zc=new kh,jc=new kh;class yS extends Mi{constructor(t=[],e=!1,i="centripetal",a=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=a}getPoint(t,e=new B){const i=e,a=this.points,s=a.length,o=(s-(this.closed?0:1))*t;let r=Math.floor(o),l=o-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/s)+1)*s:l===0&&r===s-1&&(r=s-2,l=1);let c,h;this.closed||r>0?c=a[(r-1)%s]:(tr.subVectors(a[0],a[1]).add(a[0]),c=tr);const u=a[r%s],d=a[(r+1)%s];if(this.closed||r+2<s?h=a[(r+2)%s]:(tr.subVectors(a[s-1],a[s-2]).add(a[s-1]),h=tr),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),f),_=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),$c.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,g,_,m),Zc.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,g,_,m),jc.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,g,_,m)}else this.curveType==="catmullrom"&&($c.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),Zc.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),jc.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return i.set($c.calc(l),Zc.calc(l),jc.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new B().fromArray(a))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function ef(n,t,e,i,a){const s=(i-t)*.5,o=(a-e)*.5,r=n*n,l=n*r;return(2*e-2*i+s+o)*l+(-3*e+3*i-2*s-o)*r+s*n+e}function _S(n,t){const e=1-n;return e*e*t}function MS(n,t){return 2*(1-n)*n*t}function bS(n,t){return n*n*t}function Zs(n,t,e,i){return _S(n,t)+MS(n,e)+bS(n,i)}function SS(n,t){const e=1-n;return e*e*e*t}function wS(n,t){const e=1-n;return 3*e*e*n*t}function ES(n,t){return 3*(1-n)*n*n*t}function TS(n,t){return n*n*n*t}function js(n,t,e,i,a){return SS(n,t)+wS(n,e)+ES(n,i)+TS(n,a)}class kp extends Mi{constructor(t=new $t,e=new $t,i=new $t,a=new $t){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new $t){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(js(t,a.x,s.x,o.x,r.x),js(t,a.y,s.y,o.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class AS extends Mi{constructor(t=new B,e=new B,i=new B,a=new B){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new B){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(js(t,a.x,s.x,o.x,r.x),js(t,a.y,s.y,o.y,r.y),js(t,a.z,s.z,o.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Ip extends Mi{constructor(t=new $t,e=new $t){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new $t){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new $t){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class RS extends Mi{constructor(t=new B,e=new B){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new B){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new B){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class zp extends Mi{constructor(t=new $t,e=new $t,i=new $t){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new $t){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(Zs(t,a.x,s.x,o.x),Zs(t,a.y,s.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class PS extends Mi{constructor(t=new B,e=new B,i=new B){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new B){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(Zs(t,a.x,s.x,o.x),Zs(t,a.y,s.y,o.y),Zs(t,a.z,s.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Fp extends Mi{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new $t){const i=e,a=this.points,s=(a.length-1)*t,o=Math.floor(s),r=s-o,l=a[o===0?o:o-1],c=a[o],h=a[o>a.length-2?a.length-1:o+1],u=a[o>a.length-3?a.length-1:o+2];return i.set(ef(r,l.x,c.x,h.x,u.x),ef(r,l.y,c.y,h.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new $t().fromArray(a))}return this}}var nf=Object.freeze({__proto__:null,ArcCurve:vS,CatmullRomCurve3:yS,CubicBezierCurve:kp,CubicBezierCurve3:AS,EllipseCurve:Dh,LineCurve:Ip,LineCurve3:RS,QuadraticBezierCurve:zp,QuadraticBezierCurve3:PS,SplineCurve:Fp});class CS extends Mi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new nf[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),a=this.getCurveLengths();let s=0;for(;s<a.length;){if(a[s]>=i){const o=a[s]-i,r=this.curves[s],l=r.getLength(),c=l===0?0:1-o/l;return r.getPointAt(c,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,a=this.curves.length;i<a;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let a=0,s=this.curves;a<s.length;a++){const o=s[a],r=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(r);for(let c=0;c<l.length;c++){const h=l[c];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(a.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const a=this.curves[e];t.curves.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(new nf[a.type]().fromJSON(a))}return this}}class af extends CS{constructor(t){super(),this.type="Path",this.currentPoint=new $t,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new Ip(this.currentPoint.clone(),new $t(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,a){const s=new zp(this.currentPoint.clone(),new $t(t,e),new $t(i,a));return this.curves.push(s),this.currentPoint.set(i,a),this}bezierCurveTo(t,e,i,a,s,o){const r=new kp(this.currentPoint.clone(),new $t(t,e),new $t(i,a),new $t(s,o));return this.curves.push(r),this.currentPoint.set(s,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new Fp(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,a,s,o){const r=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+r,e+l,i,a,s,o),this}absarc(t,e,i,a,s,o){return this.absellipse(t,e,i,i,a,s,o),this}ellipse(t,e,i,a,s,o,r,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,i,a,s,o,r,l),this}absellipse(t,e,i,a,s,o,r,l){const c=new Dh(t,e,i,a,s,o,r,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Ih extends an{constructor(t=1,e=32,i=0,a=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:a},e=Math.max(3,e);const s=[],o=[],r=[],l=[],c=new B,h=new $t;o.push(0,0,0),r.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=i+u/e*a;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),r.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let u=1;u<=e;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new we(o,3)),this.setAttribute("normal",new we(r,3)),this.setAttribute("uv",new we(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ih(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class ao extends an{constructor(t=1,e=1,i=1,a=32,s=1,o=!1,r=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:a,heightSegments:s,openEnded:o,thetaStart:r,thetaLength:l};const c=this;a=Math.floor(a),s=Math.floor(s);const h=[],u=[],d=[],f=[];let g=0;const _=[],m=i/2;let p=0;y(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new we(u,3)),this.setAttribute("normal",new we(d,3)),this.setAttribute("uv",new we(f,2));function y(){const v=new B,w=new B;let S=0;const T=(e-t)/i;for(let E=0;E<=s;E++){const b=[],M=E/s,R=M*(e-t)+t;for(let C=0;C<=a;C++){const z=C/a,N=z*l+r,D=Math.sin(N),L=Math.cos(N);w.x=R*D,w.y=-M*i+m,w.z=R*L,u.push(w.x,w.y,w.z),v.set(D,T,L).normalize(),d.push(v.x,v.y,v.z),f.push(z,1-M),b.push(g++)}_.push(b)}for(let E=0;E<a;E++)for(let b=0;b<s;b++){const M=_[b][E],R=_[b+1][E],C=_[b+1][E+1],z=_[b][E+1];(t>0||b!==0)&&(h.push(M,R,z),S+=3),(e>0||b!==s-1)&&(h.push(R,C,z),S+=3)}c.addGroup(p,S,0),p+=S}function x(v){const w=g,S=new $t,T=new B;let E=0;const b=v===!0?t:e,M=v===!0?1:-1;for(let C=1;C<=a;C++)u.push(0,m*M,0),d.push(0,M,0),f.push(.5,.5),g++;const R=g;for(let C=0;C<=a;C++){const N=C/a*l+r,D=Math.cos(N),L=Math.sin(N);T.x=b*L,T.y=m*M,T.z=b*D,u.push(T.x,T.y,T.z),d.push(0,M,0),S.x=D*.5+.5,S.y=L*.5*M+.5,f.push(S.x,S.y),g++}for(let C=0;C<a;C++){const z=w+C,N=R+C;v===!0?h.push(N,N+1,z):h.push(N+1,N,z),E+=3}c.addGroup(p,E,v===!0?1:2),p+=E}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ao(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class zh extends ao{constructor(t=1,e=1,i=32,a=1,s=!1,o=0,r=Math.PI*2){super(0,t,e,i,a,s,o,r),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:a,openEnded:s,thetaStart:o,thetaLength:r}}static fromJSON(t){return new zh(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Fh extends an{constructor(t=[],e=[],i=1,a=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:a};const s=[],o=[];r(a),c(i),h(),this.setAttribute("position",new we(s,3)),this.setAttribute("normal",new we(s.slice(),3)),this.setAttribute("uv",new we(o,2)),a===0?this.computeVertexNormals():this.normalizeNormals();function r(y){const x=new B,v=new B,w=new B;for(let S=0;S<e.length;S+=3)f(e[S+0],x),f(e[S+1],v),f(e[S+2],w),l(x,v,w,y)}function l(y,x,v,w){const S=w+1,T=[];for(let E=0;E<=S;E++){T[E]=[];const b=y.clone().lerp(v,E/S),M=x.clone().lerp(v,E/S),R=S-E;for(let C=0;C<=R;C++)C===0&&E===S?T[E][C]=b:T[E][C]=b.clone().lerp(M,C/R)}for(let E=0;E<S;E++)for(let b=0;b<2*(S-E)-1;b++){const M=Math.floor(b/2);b%2===0?(d(T[E][M+1]),d(T[E+1][M]),d(T[E][M])):(d(T[E][M+1]),d(T[E+1][M+1]),d(T[E+1][M]))}}function c(y){const x=new B;for(let v=0;v<s.length;v+=3)x.x=s[v+0],x.y=s[v+1],x.z=s[v+2],x.normalize().multiplyScalar(y),s[v+0]=x.x,s[v+1]=x.y,s[v+2]=x.z}function h(){const y=new B;for(let x=0;x<s.length;x+=3){y.x=s[x+0],y.y=s[x+1],y.z=s[x+2];const v=m(y)/2/Math.PI+.5,w=p(y)/Math.PI+.5;o.push(v,1-w)}g(),u()}function u(){for(let y=0;y<o.length;y+=6){const x=o[y+0],v=o[y+2],w=o[y+4],S=Math.max(x,v,w),T=Math.min(x,v,w);S>.9&&T<.1&&(x<.2&&(o[y+0]+=1),v<.2&&(o[y+2]+=1),w<.2&&(o[y+4]+=1))}}function d(y){s.push(y.x,y.y,y.z)}function f(y,x){const v=y*3;x.x=t[v+0],x.y=t[v+1],x.z=t[v+2]}function g(){const y=new B,x=new B,v=new B,w=new B,S=new $t,T=new $t,E=new $t;for(let b=0,M=0;b<s.length;b+=9,M+=6){y.set(s[b+0],s[b+1],s[b+2]),x.set(s[b+3],s[b+4],s[b+5]),v.set(s[b+6],s[b+7],s[b+8]),S.set(o[M+0],o[M+1]),T.set(o[M+2],o[M+3]),E.set(o[M+4],o[M+5]),w.copy(y).add(x).add(v).divideScalar(3);const R=m(w);_(S,M+0,y,R),_(T,M+2,x,R),_(E,M+4,v,R)}}function _(y,x,v,w){w<0&&y.x===1&&(o[x]=y.x-1),v.x===0&&v.z===0&&(o[x]=w/2/Math.PI+.5)}function m(y){return Math.atan2(y.z,-y.x)}function p(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fh(t.vertices,t.indices,t.radius,t.details)}}const er=new B,nr=new B,qc=new B,ir=new On;class LS extends an{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const a=Math.pow(10,4),s=Math.cos(ds*e),o=t.getIndex(),r=t.getAttribute("position"),l=o?o.count:r.count,c=[0,0,0],h=["a","b","c"],u=new Array(3),d={},f=[];for(let g=0;g<l;g+=3){o?(c[0]=o.getX(g),c[1]=o.getX(g+1),c[2]=o.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);const{a:_,b:m,c:p}=ir;if(_.fromBufferAttribute(r,c[0]),m.fromBufferAttribute(r,c[1]),p.fromBufferAttribute(r,c[2]),ir.getNormal(qc),u[0]=`${Math.round(_.x*a)},${Math.round(_.y*a)},${Math.round(_.z*a)}`,u[1]=`${Math.round(m.x*a)},${Math.round(m.y*a)},${Math.round(m.z*a)}`,u[2]=`${Math.round(p.x*a)},${Math.round(p.y*a)},${Math.round(p.z*a)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let y=0;y<3;y++){const x=(y+1)%3,v=u[y],w=u[x],S=ir[h[y]],T=ir[h[x]],E=`${v}_${w}`,b=`${w}_${v}`;b in d&&d[b]?(qc.dot(d[b].normal)<=s&&(f.push(S.x,S.y,S.z),f.push(T.x,T.y,T.z)),d[b]=null):E in d||(d[E]={index0:c[y],index1:c[x],normal:qc.clone()})}}for(const g in d)if(d[g]){const{index0:_,index1:m}=d[g];er.fromBufferAttribute(r,_),nr.fromBufferAttribute(r,m),f.push(er.x,er.y,er.z),f.push(nr.x,nr.y,nr.z)}this.setAttribute("position",new we(f,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class Up extends af{constructor(t){super(t),this.uuid=yi(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,a=this.holes.length;i<a;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const a=this.holes[e];t.holes.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(new af().fromJSON(a))}return this}}const DS={triangulate:function(n,t,e=2){const i=t&&t.length,a=i?t[0]*e:n.length;let s=Np(n,0,a,e,!0);const o=[];if(!s||s.next===s.prev)return o;let r,l,c,h,u,d,f;if(i&&(s=US(n,t,s,e)),n.length>80*e){r=c=n[0],l=h=n[1];for(let g=e;g<a;g+=e)u=n[g],d=n[g+1],u<r&&(r=u),d<l&&(l=d),u>c&&(c=u),d>h&&(h=d);f=Math.max(c-r,h-l),f=f!==0?32767/f:0}return so(s,o,e,r,l,f,0),o}};function Np(n,t,e,i,a){let s,o;if(a===ZS(n,t,e,i)>0)for(s=t;s<e;s+=i)o=sf(s,n[s],n[s+1],o);else for(s=e-i;s>=t;s-=i)o=sf(s,n[s],n[s+1],o);return o&&Hr(o,o.next)&&(ro(o),o=o.next),o}function Ra(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(Hr(e,e.next)||$e(e.prev,e,e.next)===0)){if(ro(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function so(n,t,e,i,a,s,o){if(!n)return;!o&&s&&GS(n,i,a,s);let r=n,l,c;for(;n.prev!==n.next;){if(l=n.prev,c=n.next,s?IS(n,i,a,s):kS(n)){t.push(l.i/e|0),t.push(n.i/e|0),t.push(c.i/e|0),ro(n),n=c.next,r=c.next;continue}if(n=c,n===r){o?o===1?(n=zS(Ra(n),t,e),so(n,t,e,i,a,s,2)):o===2&&FS(n,t,e,i,a,s):so(Ra(n),t,e,i,a,s,1);break}}}function kS(n){const t=n.prev,e=n,i=n.next;if($e(t,e,i)>=0)return!1;const a=t.x,s=e.x,o=i.x,r=t.y,l=e.y,c=i.y,h=a<s?a<o?a:o:s<o?s:o,u=r<l?r<c?r:c:l<c?l:c,d=a>s?a>o?a:o:s>o?s:o,f=r>l?r>c?r:c:l>c?l:c;let g=i.next;for(;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=f&&rs(a,r,s,l,o,c,g.x,g.y)&&$e(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function IS(n,t,e,i){const a=n.prev,s=n,o=n.next;if($e(a,s,o)>=0)return!1;const r=a.x,l=s.x,c=o.x,h=a.y,u=s.y,d=o.y,f=r<l?r<c?r:c:l<c?l:c,g=h<u?h<d?h:d:u<d?u:d,_=r>l?r>c?r:c:l>c?l:c,m=h>u?h>d?h:d:u>d?u:d,p=ah(f,g,t,e,i),y=ah(_,m,t,e,i);let x=n.prevZ,v=n.nextZ;for(;x&&x.z>=p&&v&&v.z<=y;){if(x.x>=f&&x.x<=_&&x.y>=g&&x.y<=m&&x!==a&&x!==o&&rs(r,h,l,u,c,d,x.x,x.y)&&$e(x.prev,x,x.next)>=0||(x=x.prevZ,v.x>=f&&v.x<=_&&v.y>=g&&v.y<=m&&v!==a&&v!==o&&rs(r,h,l,u,c,d,v.x,v.y)&&$e(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;x&&x.z>=p;){if(x.x>=f&&x.x<=_&&x.y>=g&&x.y<=m&&x!==a&&x!==o&&rs(r,h,l,u,c,d,x.x,x.y)&&$e(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;v&&v.z<=y;){if(v.x>=f&&v.x<=_&&v.y>=g&&v.y<=m&&v!==a&&v!==o&&rs(r,h,l,u,c,d,v.x,v.y)&&$e(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function zS(n,t,e){let i=n;do{const a=i.prev,s=i.next.next;!Hr(a,s)&&Op(a,i,i.next,s)&&oo(a,s)&&oo(s,a)&&(t.push(a.i/e|0),t.push(i.i/e|0),t.push(s.i/e|0),ro(i),ro(i.next),i=n=s),i=i.next}while(i!==n);return Ra(i)}function FS(n,t,e,i,a,s){let o=n;do{let r=o.next.next;for(;r!==o.prev;){if(o.i!==r.i&&WS(o,r)){let l=Bp(o,r);o=Ra(o,o.next),l=Ra(l,l.next),so(o,t,e,i,a,s,0),so(l,t,e,i,a,s,0);return}r=r.next}o=o.next}while(o!==n)}function US(n,t,e,i){const a=[];let s,o,r,l,c;for(s=0,o=t.length;s<o;s++)r=t[s]*i,l=s<o-1?t[s+1]*i:n.length,c=Np(n,r,l,i,!1),c===c.next&&(c.steiner=!0),a.push(XS(c));for(a.sort(NS),s=0;s<a.length;s++)e=OS(a[s],e);return e}function NS(n,t){return n.x-t.x}function OS(n,t){const e=BS(n,t);if(!e)return t;const i=Bp(e,n);return Ra(i,i.next),Ra(e,e.next)}function BS(n,t){let e=t,i=-1/0,a;const s=n.x,o=n.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=s&&d>i&&(i=d,a=e.x<e.next.x?e:e.next,d===s))return a}e=e.next}while(e!==t);if(!a)return null;const r=a,l=a.x,c=a.y;let h=1/0,u;e=a;do s>=e.x&&e.x>=l&&s!==e.x&&rs(o<c?s:i,o,l,c,o<c?i:s,o,e.x,e.y)&&(u=Math.abs(o-e.y)/(s-e.x),oo(e,n)&&(u<h||u===h&&(e.x>a.x||e.x===a.x&&HS(a,e)))&&(a=e,h=u)),e=e.next;while(e!==r);return a}function HS(n,t){return $e(n.prev,n,t.prev)<0&&$e(t.next,n,n.next)<0}function GS(n,t,e,i){let a=n;do a.z===0&&(a.z=ah(a.x,a.y,t,e,i)),a.prevZ=a.prev,a.nextZ=a.next,a=a.next;while(a!==n);a.prevZ.nextZ=null,a.prevZ=null,VS(a)}function VS(n){let t,e,i,a,s,o,r,l,c=1;do{for(e=n,n=null,s=null,o=0;e;){for(o++,i=e,r=0,t=0;t<c&&(r++,i=i.nextZ,!!i);t++);for(l=c;r>0||l>0&&i;)r!==0&&(l===0||!i||e.z<=i.z)?(a=e,e=e.nextZ,r--):(a=i,i=i.nextZ,l--),s?s.nextZ=a:n=a,a.prevZ=s,s=a;e=i}s.nextZ=null,c*=2}while(o>1);return n}function ah(n,t,e,i,a){return n=(n-e)*a|0,t=(t-i)*a|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function XS(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function rs(n,t,e,i,a,s,o,r){return(a-o)*(t-r)>=(n-o)*(s-r)&&(n-o)*(i-r)>=(e-o)*(t-r)&&(e-o)*(s-r)>=(a-o)*(i-r)}function WS(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!YS(n,t)&&(oo(n,t)&&oo(t,n)&&$S(n,t)&&($e(n.prev,n,t.prev)||$e(n,t.prev,t))||Hr(n,t)&&$e(n.prev,n,n.next)>0&&$e(t.prev,t,t.next)>0)}function $e(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function Hr(n,t){return n.x===t.x&&n.y===t.y}function Op(n,t,e,i){const a=sr($e(n,t,e)),s=sr($e(n,t,i)),o=sr($e(e,i,n)),r=sr($e(e,i,t));return!!(a!==s&&o!==r||a===0&&ar(n,e,t)||s===0&&ar(n,i,t)||o===0&&ar(e,n,i)||r===0&&ar(e,t,i))}function ar(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function sr(n){return n>0?1:n<0?-1:0}function YS(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&Op(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function oo(n,t){return $e(n.prev,n,n.next)<0?$e(n,t,n.next)>=0&&$e(n,n.prev,t)>=0:$e(n,t,n.prev)<0||$e(n,n.next,t)<0}function $S(n,t){let e=n,i=!1;const a=(n.x+t.x)/2,s=(n.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&a<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function Bp(n,t){const e=new sh(n.i,n.x,n.y),i=new sh(t.i,t.x,t.y),a=n.next,s=t.prev;return n.next=t,t.prev=n,e.next=a,a.prev=e,i.next=e,e.prev=i,s.next=i,i.prev=s,i}function sf(n,t,e,i){const a=new sh(n,t,e);return i?(a.next=i.next,a.prev=i,i.next.prev=a,i.next=a):(a.prev=a,a.next=a),a}function ro(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function sh(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function ZS(n,t,e,i){let a=0;for(let s=t,o=e-i;s<e;s+=i)a+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return a}class qs{static area(t){const e=t.length;let i=0;for(let a=e-1,s=0;s<e;a=s++)i+=t[a].x*t[s].y-t[s].x*t[a].y;return i*.5}static isClockWise(t){return qs.area(t)<0}static triangulateShape(t,e){const i=[],a=[],s=[];of(t),rf(i,t);let o=t.length;e.forEach(of);for(let l=0;l<e.length;l++)a.push(o),o+=e[l].length,rf(i,e[l]);const r=DS.triangulate(i,a);for(let l=0;l<r.length;l+=3)s.push(r.slice(l,l+3));return s}}function of(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function rf(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class Uh extends Fh{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],a=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,a,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Uh(t.radius,t.detail)}}class fs extends an{constructor(t=.5,e=1,i=32,a=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:a,thetaStart:s,thetaLength:o},i=Math.max(3,i),a=Math.max(1,a);const r=[],l=[],c=[],h=[];let u=t;const d=(e-t)/a,f=new B,g=new $t;for(let _=0;_<=a;_++){for(let m=0;m<=i;m++){const p=s+m/i*o;f.x=u*Math.cos(p),f.y=u*Math.sin(p),l.push(f.x,f.y,f.z),c.push(0,0,1),g.x=(f.x/e+1)/2,g.y=(f.y/e+1)/2,h.push(g.x,g.y)}u+=d}for(let _=0;_<a;_++){const m=_*(i+1);for(let p=0;p<i;p++){const y=p+m,x=y,v=y+i+1,w=y+i+2,S=y+1;r.push(x,v,S),r.push(v,w,S)}}this.setIndex(r),this.setAttribute("position",new we(l,3)),this.setAttribute("normal",new we(c,3)),this.setAttribute("uv",new we(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new fs(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Nh extends an{constructor(t=new Up([new $t(0,.5),new $t(-.5,-.5),new $t(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],a=[],s=[],o=[];let r=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(r,l,h),r+=l,l=0;this.setIndex(i),this.setAttribute("position",new we(a,3)),this.setAttribute("normal",new we(s,3)),this.setAttribute("uv",new we(o,2));function c(h){const u=a.length/3,d=h.extractPoints(e);let f=d.shape;const g=d.holes;qs.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,p=g.length;m<p;m++){const y=g[m];qs.isClockWise(y)===!0&&(g[m]=y.reverse())}const _=qs.triangulateShape(f,g);for(let m=0,p=g.length;m<p;m++){const y=g[m];f=f.concat(y)}for(let m=0,p=f.length;m<p;m++){const y=f[m];a.push(y.x,y.y,0),s.push(0,0,1),o.push(y.x,y.y)}for(let m=0,p=_.length;m<p;m++){const y=_[m],x=y[0]+u,v=y[1]+u,w=y[2]+u;i.push(x,v,w),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return jS(e,t)}static fromJSON(t,e){const i=[];for(let a=0,s=t.shapes.length;a<s;a++){const o=e[t.shapes[a]];i.push(o)}return new Nh(i,t.curveSegments)}}function jS(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const a=n[e];t.shapes.push(a.uuid)}else t.shapes.push(n.uuid);return t}class Gr extends an{constructor(t=1,e=.4,i=12,a=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:a,arc:s},i=Math.floor(i),a=Math.floor(a);const o=[],r=[],l=[],c=[],h=new B,u=new B,d=new B;for(let f=0;f<=i;f++)for(let g=0;g<=a;g++){const _=g/a*s,m=f/i*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(_),u.y=(t+e*Math.cos(m))*Math.sin(_),u.z=e*Math.sin(m),r.push(u.x,u.y,u.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(g/a),c.push(f/i)}for(let f=1;f<=i;f++)for(let g=1;g<=a;g++){const _=(a+1)*f+g-1,m=(a+1)*(f-1)+g-1,p=(a+1)*(f-1)+g,y=(a+1)*f+g;o.push(_,m,y),o.push(m,p,y)}this.setIndex(o),this.setAttribute("position",new we(r,3)),this.setAttribute("normal",new we(l,3)),this.setAttribute("uv",new we(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Gr(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class co extends Pa{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new ne(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ne(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=fp,this.normalScale=new $t(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _i,this.combine=yh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Hp extends Ze{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ne(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class qS extends Hp{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ze.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ne(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Kc=new Ue,cf=new B,lf=new B;class KS{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new $t(512,512),this.map=null,this.mapPass=null,this.matrix=new Ue,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ph,this._frameExtents=new $t(1,1),this._viewportCount=1,this._viewports=[new Je(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;cf.setFromMatrixPosition(t.matrixWorld),e.position.copy(cf),lf.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(lf),e.updateMatrixWorld(),Kc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Kc),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Kc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class JS extends KS{constructor(){super(new Ep(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class QS extends Hp{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ze.DEFAULT_UP),this.updateMatrix(),this.target=new Ze,this.shadow=new JS}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const hf=new Ue;class tw{constructor(t,e,i=0,a=1/0){this.ray=new Ah(t,e),this.near=i,this.far=a,this.camera=null,this.layers=new Rh,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return hf.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(hf),this}intersectObject(t,e=!0,i=[]){return oh(t,this,i,e),i.sort(df),i}intersectObjects(t,e=!0,i=[]){for(let a=0,s=t.length;a<s;a++)oh(t[a],this,i,e);return i.sort(df),i}}function df(n,t){return n.distance-t.distance}function oh(n,t,e,i){let a=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(a=!1),a===!0&&i===!0){const s=n.children;for(let o=0,r=s.length;o<r;o++)oh(s[o],t,e,!0)}}class ew extends Dp{constructor(t=10,e=10,i=4473924,a=8947848){i=new ne(i),a=new ne(a);const s=e/2,o=t/e,r=t/2,l=[],c=[];for(let d=0,f=0,g=-r;d<=e;d++,g+=o){l.push(-r,0,g,r,0,g),l.push(g,0,-r,g,0,r);const _=d===s?i:a;_.toArray(c,f),f+=3,_.toArray(c,f),f+=3,_.toArray(c,f),f+=3,_.toArray(c,f),f+=3}const h=new an;h.setAttribute("position",new we(l,3)),h.setAttribute("color",new we(c,3));const u=new Lh({vertexColors:!0,toneMapped:!1});super(h,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:vh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=vh);const nw={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function iw(n,t,e,i){const a=new $n(n.fov,i,.1,200),s=new B,o=new B,r=new B;let l=!1,c=n.fov;const h={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let u=1,d=0,f=0,g=0,_=0,m=0,p=0;function y(){const x=(n.pitchDeg+h.pitchDelta)*Math.PI/180,v=n.yawDeg*Math.PI/180;r.set(Math.sin(v)*Math.cos(x),Math.sin(x),Math.cos(v)*Math.cos(x)).multiplyScalar(n.distance*h.distanceScale*h.zoom)}return y(),{camera:a,update(x,v,w,S,T=nw){const E=v+.6;if(!l)s.set(x,E,w),l=!0;else{const R=1-Math.exp(-Math.max(n.smoothing,.001)*S);s.x+=(x-s.x)*R,s.y+=(E-s.y)*R,s.z+=(w-s.z)*R}const b=1-Math.exp(-Math.max(t.smoothing,.001)*S);h.distanceScale+=(T.distanceScale-h.distanceScale)*b,h.offsetX+=(T.offsetX-h.offsetX)*b,h.offsetZ+=(T.offsetZ-h.offsetZ)*b,h.pitchDelta+=(T.pitchDelta-h.pitchDelta)*b;const M=1-Math.exp(-Math.max(e.smoothing,.001)*S);if(h.zoom+=(u-h.zoom)*M,y(),(a.fov!==c||a.fov!==n.fov)&&(a.fov=n.fov,c=n.fov,a.updateProjectionMatrix()),o.set(s.x+h.offsetX,s.y,s.z+h.offsetZ),a.position.copy(o).add(r),a.lookAt(o),d>.001){f+=S*52;const R=d*.055;a.position.x+=Math.sin(f*1.7)*R,a.position.y+=Math.sin(f*2.3+1.1)*R*.75,a.position.z+=Math.sin(f*1.3+2.4)*R*.5,d*=Math.exp(-9*S)}else d=0;m>.001?(a.position.x+=g*m,a.position.z+=_*m,m*=Math.exp(-13*S)):m=0,a.updateMatrixWorld()},snap(x,v,w){s.set(x,v+.6,w),l=!0,o.set(s.x+h.offsetX,s.y,s.z+h.offsetZ),y(),a.position.copy(o).add(r),a.lookAt(o),a.updateMatrixWorld()},resize(x){a.aspect=x,a.updateProjectionMatrix()},getGroundBasis(){const x=new B().setFromMatrixColumn(a.matrixWorld,0),v=new B().setFromMatrixColumn(a.matrixWorld,2).negate(),w=Math.hypot(x.x,x.z)||1,S=Math.hypot(v.x,v.z)||1;return{rightX:x.x/w,rightZ:x.z/w,forwardX:v.x/S,forwardZ:v.z/S}},addShake(x){!Number.isFinite(x)||x<=0||(d=Math.min(1,d+x))},shakeLevel(){return d},addKick(x,v,w){if(!Number.isFinite(x)||!Number.isFinite(v)||!(w>0))return;const S=Math.hypot(x,v);S<1e-4||(g=x/S*w,_=v/S*w,m=1,p++)},kickLevel(){return m},kickCount(){return p},setZoom(x){u=Number.isFinite(x)&&x>0?x:1},smart(){return{...h}}}}const Ea=Math.PI*2,Zn=1e-6;function Cn(n,t,e){return n<t?t:n>e?e:n}function Gp(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function aw(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function Vp(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const a=aw(n);return i===1?a:e+(a-e)*i}function uf(n){return(1-Math.sin(n))/2}function Oh(n,t,e){const i=Math.PI/180,a=Cn(Number.isFinite(t)?t:100,0,180),s=Cn(Number.isFinite(e)?e:132,0,180);if(s<=a)return n>=Math.cos(a*i)?1:0;const o=Math.cos(a*i),r=Math.cos(s*i);if(n>=o)return 1;const l=Cn((o-n)/(o-r),0,1);return 1-l*l*(3-2*l)}function Lr(n,t){if(!n.grounded||n.speed<Zn)return Gp();const e=n.speed/Math.max(n.moveSpeed,Zn),i=Math.max(n.legLength,Zn),a=n.stride>Zn?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,s=Math.min(t.maxAmp,a/i),o=i*Math.sin(Math.min(t.maxAmp,1.25)),r=Math.abs(n.localForward),l=Math.abs(n.localRight),c=r+l+Zn,h=Oh(n.localForward/Math.max(n.speed,Zn),t.backStrafeStartDeg,t.backStrafeFullDeg),u=l/c*h,d=r/c+l/c*(1-h),f=n.localForward>=0?1:-1,g=n.localRight>=0?1:-1,_=a,m=N=>Math.asin(Cn(N,-o,o)/i);function p(N,D){const L=Vp(N,t.plantLock),F=uf(N),H=f*d*_*L,Y=-m(H),it=D*g>0?1:-1,mt=1+it*t.crossStep*.45,_t=g*it*t.crossStep*_*.4*F,Lt=g*u*_*t.sideWeight*mt*L+_t*u,J=m(Lt),et=t.kneeLift*F*s*(.55+.25*d+(it>0?.2*u:0));return{pitchX:Y,rollZ:J,kneeX:et}}const y=(n.phase%Ea+Ea)%Ea,x=p(y,-1),v=p((y+Math.PI)%Ea,1),w=Math.cos(y),S=uf(y),T=-t.comSway*s*w*(.6*d+.8*u)-g*t.comSway*s*u*.45,E=t.comBob*S*s,b=g*t.hipLean*s*u*w*.6,M=g*t.hipLean*s*u*(.45+.25*w),R=t.armSwing*s*w*(d*f+.3*u),C=R,z=-R;return{legL:x,legR:v,pelvisX:T,pelvisY:E,pelvisRoll:b,sideLean:M,armL:C,armR:z,strafe:u,backward:f<0?d:0}}function Xp(n){const t=(n%Ea+Ea)%Ea,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function Wp(n,t,e){const i=Cn(e.progress,0,1);if(i>=1||n.speed<Zn)return Gp();const a=i*i*(3-2*i),s=1-a;return Lr({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*a,speed:n.speed*s,stride:n.stride*s},t)}function Yp(n,t,e,i){const a=Cn(n,-1,1),s=Math.abs(a),o=Math.min(1,t*(1+Math.max(0,i)*s*s));return Cn(o*a,-1,1)*(e*Math.PI/180)}function $p(n,t,e,i){if(!(Math.hypot(n,t)>1e-6))return e;const s=Math.atan2(t,n)*180/Math.PI;if(Math.abs(s)<=90)return e;const r=(s-Math.sign(s)*180)*Math.PI/180,l=Cn(i,0,1),c=l*l;return e*c+r*(1-c)}function Zp(n,t,e,i,a){const s=Math.max(e,Zn),o=Math.max(0,i)*s,r=Math.max(0,a)*s,l=t>Zn?(t-n)/t:0,c=l>.02,h=l<-.015,u=n<=o*.15,d=!h&&n<r&&(c||u);return{enter:n>Zn&&n<=o&&c,resume:!d}}function jp(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return Cn(n*Cn(t,0,2),-i,i)}function qp(n,t,e){const i=Math.sin(n),a=Math.cos(n),s=Math.cos(n),o=-Math.sin(n);return{forward:t*i+e*a,right:t*s+e*o}}function Kp(n,t,e){const i=Cn(n,0,1),a=i*i*(3-2*i);return e?t==="inStop"?1-a:1:t==="afterStop"?1-a:0}function sw(n,t,e){const i=()=>({legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisY:0,env:0});if(!e.turnStepEnabled)return i();const a=Cn(n,0,1),s=Math.sin(Math.PI*a),o=s*s;if(o<=1e-9)return i();const r=t>=0,l=r?1:.35,c=r?.35:1,h=Math.max(0,e.turnStepPitch)*o,u=Math.max(0,e.turnStepKnee)*o,d=Math.max(0,e.turnStepPitch)*.35*o,f=r?1:-1;return{legL:{pitchX:-h*l,rollZ:f*d*l,kneeX:u*l},legR:{pitchX:-h*c,rollZ:-f*d*c,kneeX:u*c},pelvisY:-Math.max(0,e.turnStepDip)*o,env:o}}function Jp(n,t,e,i,a){const s=Cn(n,0,1),o=Cn(a.stopPeakRatio,.05,.95),r=s<=o?s/o:(s-o)/(1-o),l=r*r*(3-2*r),c=s<=o?l:1-l,h=Math.hypot(e,i),u=h>Zn?e/h:1,d=h>Zn?i/h:0,f=Vp(t,1)>0;return{leadPitch:Math.max(0,a.stopStepPitch)*c,trailPitch:Math.max(0,a.stopTrailPitch)*c,leadKnee:Math.max(0,a.stopStepKnee)*c,bodyShift:Math.max(0,a.stopBodyShift)*c,bodyDip:Math.max(0,a.stopBodyDip)*c,chestPitch:Math.max(0,a.stopChestPitch)*c,leadLeft:f,fwdN:u,rightN:d,env:c}}function yn(n){return n<0?0:n>1?1:n}const pr=Math.PI*2;function ow(n){return((n+Math.PI)%pr+pr)%pr-Math.PI}function rw(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function cw(n,t,e,i,a,s=n.phase){const o=yn(i);if(o<=0)return n;const r=yn(t),l=Math.max(1,Math.round(a.cycles)),c=Math.max(0,a.strideSpeed),h=e%2===0?1:-1,u=yn(a.forwardBias),d=Math.max(0,n.stride??0),f=Math.max(0,a.strideScale??0)*d,g=r*r*(3-2*r),_={speed:c,phase:s+pr*l/2*g,localForward:c*u,localRight:c*(1-u)*h},m=ow(_.phase-n.phase),p=o*o*(3-2*o),y=n.speed>.05?d:0;return{speed:n.speed+(_.speed-n.speed)*o,phase:n.phase+m*p,localForward:n.localForward+(_.localForward-n.localForward)*o,localRight:n.localRight+(_.localRight-n.localRight)*o,stride:y+(f-y)*o*o}}function lw(n,t,e){const i=rw(),a=yn(n),s=Math.sin(Math.PI*a)**2;if(s<=1e-12)return i;const o=t%2===0?1:-1,r=o<0,l=o>0,c=e.stepPitch*s,h=e.stepKnee*s,u=e.stepSide*s;return i.legL.pitchX=r?-c:c*.55,i.legR.pitchX=l?-c:c*.55,i.legL.kneeX=r?h:h*.4,i.legR.kneeX=l?h:h*.4,i.legL.rollZ=-u*o,i.legR.rollZ=u*o,i.pelvisX=e.stepSway*s*o,i.pelvisY=-e.stepDip*s,i.pelvisRoll=u*.25*o,i}function Qp(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function ff(n,t,e,i,a){if(e<=0||i<=0)return 0;const s=(n-t)/e;return s<0||s>=1?0:i*Qp(s,a)}function hw(n,t,e,i){const a=t?1:0,s=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),o=n+(a-n)*s;return t&&o>.999?1:!t&&o<.001?0:o}function dw(n,t,e){const i=yn(n);return{gaitScale:1-i*(1-yn(t)),attackLegWeight:yn(e)*i}}function uw(n,t,e){const i=yn(e);if(i<=0)return n;if(i>=1)return{...n,...t,armL:n.armL,armR:n.armR,strafe:n.strafe,backward:n.backward};const a=(s,o)=>s+(o-s)*i;return{legL:{pitchX:a(n.legL.pitchX,t.legL.pitchX),rollZ:a(n.legL.rollZ,t.legL.rollZ),kneeX:a(n.legL.kneeX,t.legL.kneeX)},legR:{pitchX:a(n.legR.pitchX,t.legR.pitchX),rollZ:a(n.legR.rollZ,t.legR.rollZ),kneeX:a(n.legR.kneeX,t.legR.kneeX)},pelvisX:a(n.pelvisX,t.pelvisX),pelvisY:a(n.pelvisY,t.pelvisY),pelvisRoll:a(n.pelvisRoll,t.pelvisRoll),sideLean:n.sideLean,armL:n.armL,armR:n.armR,strafe:n.strafe,backward:n.backward}}function fw(n,t){const e=yn(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function pw(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return yn(t.minScale+(1-t.minScale)*e)}function mw(){return tm()}function tm(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function gw(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function xw(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?yn(t.forceHitHeight):n.type==="light"?yn(t.hitHeight.light):n.type==="heavy"?yn(t.hitHeight.heavy):n.type==="knock"?yn(t.hitHeight.knock):0}function vw(n,t,e){const i=yn(e),a=(s,o)=>s+(o-s)*i;return{upperPitch:a(n.upperPitch,t.upperPitch),upperRoll:a(n.upperRoll,t.upperRoll),upperYaw:a(n.upperYaw,t.upperYaw),fold:a(n.fold,t.fold),shift:a(n.shift,t.shift),drop:a(n.drop,t.drop),back:a(n.back,t.back),knee:a(n.knee,t.knee),hip:a(n.hip,t.hip),arm:a(n.arm,t.arm)}}function em(n,t,e){const i=tm(),a=gw(n,e);if(i.intensity=a,a<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const s=yn(1-n.timer/n.duration),o=Qp(s,e.pulseRatio);i.pulse=o,i.active=o>0,i.hitHeight=xw(n,e);const r=Math.sin(t),l=Math.cos(t),c=Math.cos(t),h=-Math.sin(t),u=n.dirX*r+n.dirZ*l,d=n.dirX*c+n.dirZ*h;if(i.localFwd=u,i.localRight=d,!e.enabled){i.legacy=!0;const _=Math.sin(Math.PI*s);return i.upperPitch=a*_*u,i.upperRoll=-a*_*d*.7,i.drop=(a>.5?.09:.04)*_,i.flash=e.flashStrength*_,i.active=_>0,i}const f=a*o,g=vw(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=f*(g.upperPitch*u+g.fold),i.upperRoll=-f*g.upperRoll*d,i.upperYaw=f*g.upperYaw*d,i.upperShift=f*g.shift,i.upperShiftX=i.upperShift*d,i.upperShiftZ=i.upperShift*u,i.comShift=f*e.comShift,i.comX=i.comShift*d,i.comZ=i.comShift*u,i.pelvisBack=f*g.back,i.drop=f*g.drop,i.knee=f*g.knee,i.hip=f*g.hip,i.arm=f*g.arm,i.flash=e.flashStrength*o,i}function nm(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),a=Number.isFinite(n.leanForward)?n.leanForward:0,s=Number.isFinite(n.leanSide)?n.leanSide:0,o=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:a*e,pelvisRoll:s*e,pelvisX:-s*i,pelvisZ:a*i,crouch:Math.max(0,t.moveCrouch)*o}}const ma=1e-6;function Ks(n,t,e){return n<t?t:n>e?e:n}function im(n,t,e,i=1){const a=t,s=e;if(!Number.isFinite(a)||!Number.isFinite(s)||a<=ma||s<=ma||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const r=a+s,l=Math.abs(a-s)+ma,c=Math.hypot(n.x,n.y,n.z);if(c<=ma)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const h=Math.atan2(n.x,-n.y),u=Math.hypot(n.x,n.y),d=n.z,f=Math.hypot(d,u),g=Ks(f,l,r),_=f>r+ma||f<l-ma,m=Math.atan2(-d,Math.max(u,ma)),p=Ks((a*a+g*g-s*s)/(2*a*g),-1,1),y=Ks((s*s+g*g-a*a)/(2*s*g),-1,1),x=Math.acos(p),v=Math.acos(y),w=i>=0?1:-1;return{rootPitch:m-w*x,rootRoll:h,jointPitch:w*(x+v),clamped:_,reach:c/r}}function am(n,t,e,i){const a=Ks(e,0,1),s=Math.max(0,i),o=(r,l)=>{const c=Ks((l-r)*a,-s,s);return r+c};return{rootPitch:o(n.rootPitch,t.rootPitch),rootRoll:o(n.rootRoll,t.rootRoll),jointPitch:o(n.jointPitch,t.jointPitch)}}function sm(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const Bh={active:!1,weight:0,clamped:0,maxError:0};function om(n){const{root:t,pelvis:e,lower:i,limbs:a,base:s,cfg:o}=n;if(!o.enabled||o.weight<=0||!n.grounded||a.length===0)return{...Bh};const r={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(s.pelvisPos),e.rotation.x=s.pelvisRotX,e.rotation.z=s.pelvisRotZ,i.position.copy(s.lowerPos),i.rotation.z=s.lowerRotZ,t.updateWorldMatrix(!0,!0);const l=a.map(f=>f.tip.getWorldPosition(new B));e.position.copy(r.pelvisPos),e.rotation.x=r.pelvisRotX,e.rotation.z=r.pelvisRotZ,i.position.copy(r.lowerPos),i.rotation.z=r.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const c=Math.max(0,Math.min(1,o.weight))*(n.attacking?Math.max(0,Math.min(1,o.attackScale)):1),h=Math.max(0,o.maxCorrectionDeg)*Math.PI/180;let u=0;for(let f=0;f<a.length;f++){const g=a[f],_=i.worldToLocal(l[f].clone()),m={x:_.x-g.root.position.x,y:_.y-g.root.position.y,z:_.z-g.root.position.z},p=im(m,g.upperLen,g.lowerLen,g.bend);p.clamped&&(u+=1);const y=am({rootPitch:g.root.rotation.x,rootRoll:g.root.rotation.z,jointPitch:g.joint.rotation.x},p,c,h);g.root.rotation.x=y.rootPitch,g.root.rotation.z=y.rootRoll,g.joint.rotation.x=y.jointPitch}t.updateWorldMatrix(!0,!0);let d=0;for(let f=0;f<a.length;f++){const g=a[f].tip.getWorldPosition(new B);d=Math.max(d,g.distanceTo(l[f]))}return{active:!0,weight:c,clamped:u,maxError:d}}function Un(n,t,e){return n<t?t:n>e?e:n}function yw(n,t,e,i,a,s,o,r,l,c){const h=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},u=new Ce,d=new Ce;d.name="pelvis",d.position.y=n.legLength,u.add(d);const f=new Ce;f.name="lower";const g=new Ce;g.name="upper",d.add(f),d.add(g);const _=[],m=(tt,dt,Nt,at)=>{const bt=new co({color:at}),O=new _e(new ci(tt,dt,Nt),bt);return O.castShadow=!0,O.receiveShadow=!0,_.push(bt),O},p=n.headSize,y=n.legLength,x=n.armLength,v=n.limbThickness,w=n.bodyHeight,S=n.bodyWidth,T=m(S,w,.28,e);T.position.y=w/2,g.add(T);const E=new Ce;E.name="headPivot",E.rotation.order="YXZ",E.position.y=w,g.add(E);const b=m(p,p,p,e);b.position.y=p/2,E.add(b);for(const tt of[-1,1]){const dt=m(.06,.07,.02,t.shoe);dt.position.set(tt*.09,p/2+.03,p/2+.011),E.add(dt)}const M=(tt,dt)=>{const Nt=dt?x:y,at=new Ce;at.name=dt?tt<0?"shoulderL":"shoulderR":tt<0?"hipL":"hipR",dt||(at.rotation.order="ZYX"),at.position.set(tt*(dt?S/2+v/2:S/2-v/2),dt?w-.04:0,0),(dt?g:f).add(at);const bt=m(v,Nt/2,v,t.limb);bt.position.y=-Nt/4,at.add(bt);const O=new Ce;O.name=dt?"elbow":"knee",O.position.y=-Nt/2,at.add(O);const lt=m(v,Nt/2,v,t.limb);if(lt.position.y=-Nt/4,O.add(lt),!dt){const xt=m(v*1.15,.07,v*1.7,t.shoe);xt.position.set(0,-Nt/2+.035,.045),O.add(xt);const Wt=new Ze;return Wt.name="footTip",Wt.position.y=-Nt/2,O.add(Wt),{root:at,joint:O,tip:Wt}}return{root:at,joint:O}},R=M(-1,!1),C=M(1,!1),z=M(-1,!0),N=M(1,!0),D=[R,C].map(tt=>({root:tt.root,joint:tt.joint,tip:tt.tip,upperLen:y/2,lowerLen:y/2,bend:1})),L=new un({color:a.attackArcColor,transparent:!0,opacity:0,side:Ke,depthWrite:!1}),F=new _e(new Gr(.62,.042,6,20,Math.PI*1.1),L);F.position.set(0,.78-y,.56),g.add(F);const H=new ne(e),Y=new ne(r.flashColor),it=new ne;let mt=null,_t=0,Lt=0,J=0,et=0,ht=0,q=0,K=0,$={...Bh},Mt=-1,It=0,Ct=0,Ut=0,G=0,re=0,Ht=0,Pt=0,gt=1,zt=0,Ot=0,I="none",A=0,j=!1,ut=-1,Q=!1,ct=0,kt=0;return{group:u,boneAtWorld(tt,dt,Nt){const at=[{node:g,ax:0,ay:.05,az:0,bx:0,by:w,bz:0},{node:E,ax:0,ay:0,az:0,bx:0,by:p,bz:0},{node:z.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:z.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:N.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:N.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:R.root,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0},{node:R.joint,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0},{node:C.root,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0},{node:C.joint,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0}],bt=new B,O=new B,lt=new B(tt,dt,Nt),xt=new B;let Wt=null,Gt=Number.POSITIVE_INFINITY;for(const qt of at){qt.node.updateWorldMatrix(!0,!1),bt.set(qt.ax,qt.ay,qt.az),O.set(qt.bx,qt.by,qt.bz),qt.node.localToWorld(bt),qt.node.localToWorld(O);const U=O.x-bt.x,At=O.y-bt.y,nt=O.z-bt.z,ft=U*U+At*At+nt*nt;let Rt=ft>1e-8?((lt.x-bt.x)*U+(lt.y-bt.y)*At+(lt.z-bt.z)*nt)/ft:0;Rt=Math.max(0,Math.min(1,Rt));const Et=bt.x+U*Rt,Vt=bt.y+At*Rt,ce=bt.z+nt*Rt,me=(lt.x-Et)**2+(lt.y-Vt)**2+(lt.z-ce)**2;me<Gt&&(Gt=me,Wt=qt.node,xt.set(Et,Vt,ce))}return Wt?{node:Wt,point:xt.clone()}:null},update(tt,dt){u.position.set(tt.position.x,tt.position.y,tt.position.z),u.rotation.y=tt.bodyYaw,E.rotation.y=(tt.headYaw-tt.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,tt.mode!==mt&&(mt=tt.mode,_t=1),_t=Math.max(0,_t-dt*2.2);const Nt=tt.hurt,at=em(Nt,tt.bodyYaw,r),bt=at.flash;it.copy(Y).multiplyScalar(bt);for(const Bt of _)Bt.emissive.copy(H).multiplyScalar(_t*.5),bt>0&&Bt.emissive.add(it);d.position.set(0,y,0),d.rotation.set(0,0,0),g.position.set(0,0,0),g.rotation.set(0,0,0),f.position.set(0,0,0),f.rotation.z=0;const O=Math.hypot(tt.velocity.x,tt.velocity.z),lt=Un(o.knockGaitScale??0,0,1),xt=tt.hurt.knockX*lt,Wt=tt.hurt.knockZ*lt,Gt=lt>0&&Math.hypot(tt.hurt.knockX,tt.hurt.knockZ)>.001,qt=tt.velocity.x+xt,U=tt.velocity.z+Wt,At=Math.hypot(qt,U),nt=Math.cos(tt.bodyYaw),ft=-Math.sin(tt.bodyYaw),Rt=O>1e-6?Un((tt.velocity.x*nt+tt.velocity.z*ft)/O,-1,1):0,Et=O>1e-6?Un((tt.velocity.x*Math.sin(tt.bodyYaw)+tt.velocity.z*Math.cos(tt.bodyYaw))/O,-1,1):1,Vt=Oh(Et,o.backStrafeStartDeg,o.backStrafeFullDeg);I==="settled"&&Q&&ct>kt*1.02+1e-4&&(I="none");let ce=1;I==="blend"?(ce=Kp(j?ut:A,o.stopYawBlendMode,j),j||(A=Math.min(1,A+dt/Math.max(.01,o.stopYawAfterSec)),(A>=1||o.stopYawBlendMode==="inStop"||Q)&&(I="settled",ce=0))):I==="settled"&&(ce=Un(O/Math.max(1e-6,o.stopEnterRatio*s),0,1));const me=Yp(Rt,o.strafeHipScale,o.strafeHipMaxDeg,o.strafeHipBoost),ie=$p(Et,Rt,me,Vt)*ce;zt+=(ie-zt)*(1-Math.exp(-12*Math.max(0,dt))),f.rotation.y=zt;const Ee=tt.bodyYaw+zt,Ge=Math.sin(Ee),ln=Math.cos(Ee),V=Math.cos(Ee),wt=-Math.sin(Ee),Tt=qt*Ge+U*ln,Qt=qt*V+U*wt,fe=Math.max(0,o.stopBlendSec||0),ae=fe>0&&!Gt,ge=Zp(O,Ot,s,o.stopEnterRatio,o.stopExitRatio);if(!ae||ge.resume)Mt=-1;else if(Mt<0&&ge.enter){Mt=0,It=tt.gaitPhase,Ct=Xp(tt.gaitPhase),Ut=O,G=Math.max(tt.stride,1e-6),re=Tt,Ht=Qt;const Bt=1/Math.max(1e-6,O);Pt=tt.velocity.x*Bt,gt=tt.velocity.z*Bt}const Ne=Ot;Ot=O;const ze=ae&&Mt>=0;ze&&(Mt=Math.min(1,Mt+dt/fe)),ze&&I!=="blend"&&(I="blend",A=0),j=ze&&Mt<1,ut=Mt,Q=ge.resume,ct=O,kt=Ne;const Le=ze?{phase:It,speed:Ut,moveSpeed:s,localForward:re,localRight:Ht,legLength:n.legLength,stride:G,grounded:!0}:{phase:tt.gaitPhase,speed:At,moveSpeed:s,localForward:Tt,localRight:Qt,legLength:n.legLength,stride:tt.stride,grounded:!0},be=ze?Wp(Le,o,{progress:Mt,phase0:It,phaseEnd:Ct}):Lr(Le,o);let Bn=0,Hn=0,P=0,X=0;if(ze){const Bt=qp(tt.bodyYaw,Pt,gt),vt=Jp(Mt,It,Bt.forward,Bt.right,o);vt.leadLeft?(be.legL.pitchX-=vt.leadPitch,be.legL.kneeX+=vt.leadKnee,be.legR.pitchX+=vt.trailPitch):(be.legR.pitchX-=vt.leadPitch,be.legR.kneeX+=vt.leadKnee,be.legL.pitchX+=vt.trailPitch),Hn=vt.bodyShift*vt.fwdN,Bn=vt.bodyShift*vt.rightN,P=vt.bodyDip,X=vt.chestPitch}R.root.rotation.x=be.legL.pitchX,C.root.rotation.x=be.legR.pitchX,R.root.rotation.z=be.legL.rollZ,C.root.rotation.z=be.legR.rollZ,R.joint.rotation.x=be.legL.kneeX,C.joint.rotation.x=be.legR.kneeX,z.root.rotation.x=be.armL,N.root.rotation.x=be.armR,z.joint.rotation.x=-.18,N.joint.rotation.x=-.18,d.position.x=be.pelvisX,d.position.y=y+be.pelvisY,d.position.z=0,d.rotation.z=be.pelvisRoll,g.rotation.z=be.sideLean*(at.intensity>0?.4:1);const ot=sm(d,f),st=ze&&h.enabled?{...h,weight:1}:h,W=st.enabled&&st.weight>0?Un(st.weight,0,1):0;if(d.position.x+=Bn,d.position.z+=Hn,d.position.y-=P,f.position.y+=P,W<=0&&(f.position.x-=Bn,f.position.z-=Hn),l){const Bt=Math.max(.004166666666666667,Math.min(dt,.1)),vt=Math.sin(tt.bodyYaw),rt=Math.cos(tt.bodyYaw),Ft=Un((tt.velocity.x-Lt)/Bt,-60,60),se=Un((tt.velocity.z-J)/Bt,-60,60),oe=Ft*vt+se*rt,Ve=Xe(tt.bodyYaw-et)/Bt,le=l.maxForwardDeg*Math.PI/180,Zt=l.maxSideDeg*Math.PI/180,sn=1-Math.exp(-Math.max(0,l.smoothing)*Bt);ht+=(Un(oe*l.accelGain,-le,le)-ht)*sn,q+=(Un(-Ve*O*l.turnGain,-Zt,Zt)-q)*sn;const he=Number.isFinite(l.crouchSmoothing)?l.crouchSmoothing:8;K+=(Un(O/Math.max(s,1e-6),0,1)-K)*(1-Math.exp(-Math.max(0,he)*Bt));const Oe=nm({leanForward:ht,leanSide:q,speedRatio:K},l);g.rotation.x+=ht+X,g.rotation.z+=q,d.rotation.x+=Oe.pelvisPitch,d.rotation.z+=Oe.pelvisRoll,d.position.x+=Oe.pelvisX,d.position.z+=Oe.pelvisZ,d.position.y-=Oe.crouch,f.position.y+=Oe.crouch*(1-W)}Lt=tt.velocity.x,J=tt.velocity.z,et=tt.bodyYaw,g.rotation.x+=at.upperPitch,g.rotation.z+=at.upperRoll,g.rotation.y+=at.upperYaw;const St=Un(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),Dt=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;g.position.x+=Un(at.upperShiftX*St,-Dt,Dt),g.position.z+=Un(at.upperShiftZ*St,-Dt,Dt),d.position.x+=at.comX,d.position.z+=at.comZ-at.pelvisBack,d.position.y-=at.drop;const Yt=at.legacy?0:Math.max(0,Math.min(1,r.lowerScale));if(f.position.z+=at.pelvisBack*(1-Yt),f.position.y+=at.drop*(1-Yt),R.joint.rotation.x+=at.knee,C.joint.rotation.x+=at.knee,R.root.rotation.x-=at.hip,C.root.rotation.x-=at.hip,z.root.rotation.x+=at.arm,N.root.rotation.x+=at.arm*.8,tt.attackPhase!=="idle"&&at.intensity===0){const Bt=tt.attackProgress,vt=Bt<.34?-1:Bt<.68?-1+(Bt-.34)/.34*2:Math.max(0,1-(Bt-.68)/.32),rt=Math.max(0,-vt),Ft=Math.max(0,vt);N.root.rotation.x=-1.7*rt+1.25*Ft,N.joint.rotation.x=-(.25+rt*.45),g.rotation.y=-.28*vt,L.opacity=tt.attackPhase==="active"?.85:0,tt.attackPhase==="active"&&(F.rotation.z=-1.1+Bt*3)}else L.opacity=0;const jt=jp(zt,o.chestYawScale,o.chestYawMaxDeg);g.rotation.y+=jt,E.rotation.y=(tt.headYaw-tt.bodyYaw-jt+Math.PI*3)%(Math.PI*2)-Math.PI,$=om({root:u,pelvis:d,lower:f,limbs:D,base:ot,cfg:st,grounded:!0,attacking:tt.attackPhase!=="idle"})},ik(){return $},dispose(){u.traverse(tt=>{if(tt instanceof _e){tt.geometry.dispose();const dt=tt.material;Array.isArray(dt)?dt.forEach(Nt=>Nt.dispose()):dt.dispose()}})}}}const _w=9.81;function Vs(n,t,e){return n<t?t:n>e?e:n}function Mw(n,t,e,i,a){const s=a!=null&&a.gravity&&a.gravity>0?a.gravity:_w,o={comX:0,comY:0,comZ:0,xcomX:0,xcomZ:0,centerX:0,centerZ:0,halfX:0,halfZ:0,marginX:1,marginZ:1,score:1,leanDeg:0,side:0,overX:0,overZ:0,grounded:!1};let r=0,l=0,c=0,h=0;for(const b of n){const M=Number.isFinite(b.mass)&&b.mass>0?b.mass:0;!Number.isFinite(b.x)||!Number.isFinite(b.y)||!Number.isFinite(b.z)||(r+=M,l+=b.x*M,c+=b.y*M,h+=b.z*M)}if(r<=1e-6)return o;l/=r,c/=r,h/=r;const u=Math.max(.02,(t.maxX-t.minX)/2),d=Math.max(.02,(t.maxZ-t.minZ)/2),f=(t.minX+t.maxX)/2,g=(t.minZ+t.maxZ)/2;if(!(t.maxX-t.minX>.03&&t.maxZ-t.minZ>.03))return{...o,comX:l,comY:c,comZ:h,centerX:f,centerZ:g,halfX:u,halfZ:d};const m=Vs((a==null?void 0:a.reactionTime)??.18,.02,1),p=Math.sqrt(Math.max(.05,c)/s)*m*4,y=l+(Number.isFinite(e)?e:0)*p,x=h+(Number.isFinite(i)?i:0)*p,v=Math.abs(y-f)/u,w=Math.abs(x-g)/d,S=Vs(1-Math.max(v,w),0,1),T=Math.max(0,Math.abs(y-f)-u),E=Math.max(0,Math.abs(x-g)-d);return{comX:l,comY:c,comZ:h,xcomX:y,xcomZ:x,centerX:f,centerZ:g,halfX:u,halfZ:d,marginX:Vs(1-v,-1,1),marginZ:Vs(1-w,-1,1),score:S,leanDeg:Math.atan2(y-f,x-g)*180/Math.PI,side:v>.98?y>f?1:-1:0,overX:T,overZ:E,grounded:!0}}function bw(n,t,e){if(!Number.isFinite(n))return 0;if(!Number.isFinite(t)||!(e>0))return n;const i=n+t*e;return n!==0&&Math.sign(i)!==Math.sign(n)?0:Math.abs(i)>Math.abs(n)?i:n}function Sw(n,t,e){const i=Math.max(0,n);if(!(e>0))return i;const a=Vs(Number.isFinite(t)?t:0,0,2);return i*(1+e*a)}const rh={arm:1,leg:1,torso:1,girthArm:1,girthLeg:1,girthTorso:1},ww=1e-6;function Nn(n,t,e){return n<t?t:n>e?e:n}function Jc(n,t){const e=Math.max(.2,n);return Nn(Math.pow(e,-t),.5,2)}function Ew(n,t){if(!t.enabled)return{...rh};const e=Nn(n.swing,-1,1),i=Nn(n.charge,0,1),a=Nn(n.impact,0,1),s=Nn(n.speedRatio,0,1),o=Math.max(0,e),r=1-(1-o)*(1-o),l=1+(Math.max(1,t.swingArm)-1)*r,c=Math.max(0,-e),h=Nn(t.chargeArm,.6,1),u=1-(1-h)*c,d=1-(1-h)*i;let f=1;o>0?f=l:c>0?f=u:i>0&&(f=d);const g=1-Nn(t.impactSquash,0,.6)*a;f*=g;const _=Math.max(1,t.runLeg),p=(n.grounded?1+(_-1)*s:1)*(1-Nn(t.impactSquash,0,.6)*a*.6),y=Nn(t.torsoGain,0,1),x=1+(f-1)*y;return f=Nn(f,.6,1.6),{arm:f,leg:Nn(p,.6,1.4),torso:Nn(x,.7,1.4),girthArm:Jc(f,t.volumeExp),girthLeg:Jc(p,t.volumeExp),girthTorso:Jc(x,t.volumeExp)}}function Tw(n,t,e,i){const a=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),s=(o,r)=>o+(r-o)*a;return{arm:s(n.arm,t.arm),leg:s(n.leg,t.leg),torso:s(n.torso,t.torso),girthArm:s(n.girthArm,t.girthArm),girthLeg:s(n.girthLeg,t.girthLeg),girthTorso:s(n.girthTorso,t.girthTorso)}}function Aw(n,t,e){const i=n*Math.exp(-Math.max(ww,e)*Math.max(0,t));return i<.001?0:Nn(i,0,1)}const pf=[{yaw:.85,pitch:-.12,roll:-.14,pz:-.06,px:.045,ap:-1.2,ay:-.42,ar:.16,el:-.48,blade:.3},{yaw:-.95,pitch:.14,roll:.17,pz:.1,px:-.05,ap:-1.46,ay:-.6,ar:-.1,el:-.14,blade:-.05},{yaw:-.75,pitch:-.08,roll:.14,pz:-.04,px:-.04,ap:-1.28,ay:-.58,ar:-.12,el:-.5,blade:.3},{yaw:.92,pitch:.15,roll:-.18,pz:.1,px:.05,ap:-1.48,ay:-.4,ar:.12,el:-.13,blade:-.05},{yaw:.12,pitch:-.32,roll:-.05,pz:-.07,px:0,ap:-1.9,ay:-.3,ar:.16,el:-.55,blade:1.3},{yaw:0,pitch:.55,roll:.02,pz:.13,px:0,ap:.05,ay:-.2,ar:0,el:-.1,blade:-.55}];function ps(n,t,e){return n<t?t:n>e?e:n}function Ie(n,t,e){return n+(t-n)*e}function Rw(n){return n?typeof n=="string"?{clip:n}:n:null}function Pw(){return{bodyYaw:0,bodyPitch:0,bodyRoll:0,pelvisX:0,pelvisZ:0,armPitch:0,armYaw:0,armRoll:0,elbow:0,bladePitch:0,armLPitch:0,armLYaw:0,armLRoll:0,elbowL:0,rootYaw:0,bladePitchOff:0,bladeTwist:0,bladeTwistOff:0,bladeYaw:0,bladeYawOff:0}}function Cw(n,t){const e=n%3*2,i=pf[e],a=pf[e+1];return{...Pw(),bodyYaw:Ie(i.yaw,a.yaw,t),bodyPitch:Ie(i.pitch,a.pitch,t),bodyRoll:Ie(i.roll,a.roll,t),pelvisX:Ie(i.px,a.px,t),pelvisZ:Ie(i.pz,a.pz,t),armPitch:Ie(i.ap,a.ap,t),armYaw:Ie(i.ay,a.ay,t),armRoll:Ie(i.ar,a.ar,t),elbow:Ie(i.el,a.el,t),bladePitch:Ie(i.blade,a.blade,t)}}function Lw(n,t,e,i,a=0){var b,M,R;const s=((b=i.combo)==null?void 0:b[n])??[],o=Math.max(1,s.length),r=(((Math.round(t)||1)-1)%o+o)%o,l=Rw(s[r]),c=l?((M=i.clips)==null?void 0:M[l.clip])??null:null,h=ps(((R=i.weaponScale)==null?void 0:R[n])??1,0,2),u=Number.isFinite(i.bodyScale)?Math.max(0,i.bodyScale):1,d=l&&Number.isFinite(l.scale)?l.scale:h,f=d*u,g=ps((e+1)/2,0,1),_=c&&c.keys.length>0?Fg(c,g):Cw(r,g),m=((l==null?void 0:l.lead)??(c==null?void 0:c.lead)??"R")==="L"?"L":"R",p=(c==null?void 0:c.kind)??["right-left","left-right","overhead"][r]??"custom",y=n==="dual-swords",x=c&&ra(c,"bladeTwistOff")?_.bladeTwistOff:y?_.bladeTwist:0,v=c&&ra(c,"bladeYawOff")?_.bladeYawOff:-_.bladeYaw,w={yaw:_.bodyYaw*f,rootYaw:_.rootYaw*f,spinYaw:Ug(c,ps(a,0,1)),pitch:_.bodyPitch*f,roll:_.bodyRoll*f,pelvisZ:_.pelvisZ*f,pelvisX:_.pelvisX*f,armR:null,armL:null,bladePitch:_.bladePitch,bladePitchOff:c&&ra(c,"bladePitchOff")?_.bladePitchOff:null,bladeTwist:_.bladeTwist,bladeTwistOff:x,bladeYaw:_.bladeYaw,bladeYawOff:v,lead:m,kind:p,strike:g,blend:l&&Number.isFinite(l.blend)?l.blend:null},S={pitch:_.armPitch*d,yaw:_.armYaw*d,roll:_.armRoll*d,elbow:_.elbow*d},T=c?ra(c,"armLPitch")||ra(c,"armLYaw")||ra(c,"armLRoll")||ra(c,"elbowL"):!1,E=T?{pitch:_.armLPitch*d,yaw:_.armLYaw*d,roll:_.armLRoll*d,elbow:_.elbowL*d}:{pitch:S.pitch+(n==="greatsword"?.08:.1),yaw:S.yaw*.8,roll:n==="greatsword"?.4:-S.roll*.6,elbow:S.elbow};return m==="L"?(w.armL=S,w.armR=n==="greatsword"?null:E):(w.armR=S,(n==="greatsword"||n==="dual-swords"||T)&&(w.armL=E)),w}function Dw(n,t,e){const i=ps(e,0,1),a=(s,o)=>s?o?{pitch:Ie(s.pitch,o.pitch,i),yaw:Ie(s.yaw,o.yaw,i),roll:Ie(s.roll,o.roll,i),elbow:Ie(s.elbow,o.elbow,i)}:null:o;return{yaw:Ie(n.yaw,t.yaw,i),rootYaw:Ie(n.rootYaw,t.rootYaw,i),spinYaw:t.spinYaw,pitch:Ie(n.pitch,t.pitch,i),roll:Ie(n.roll,t.roll,i),pelvisZ:Ie(n.pelvisZ,t.pelvisZ,i),pelvisX:Ie(n.pelvisX,t.pelvisX,i),armR:a(n.armR,t.armR),armL:a(n.armL,t.armL),bladePitch:n.bladePitch===null||t.bladePitch===null?i<.5?n.bladePitch:t.bladePitch:Ie(n.bladePitch,t.bladePitch,i),bladePitchOff:n.bladePitchOff===null||t.bladePitchOff===null?i<.5?n.bladePitchOff:t.bladePitchOff:Ie(n.bladePitchOff,t.bladePitchOff,i),bladeTwist:Ie(n.bladeTwist,t.bladeTwist,i),bladeTwistOff:Ie(n.bladeTwistOff,t.bladeTwistOff,i),bladeYaw:Ie(n.bladeYaw,t.bladeYaw,i),bladeYawOff:Ie(n.bladeYawOff,t.bladeYawOff,i),lead:t.lead,kind:t.kind,strike:Ie(n.strike,t.strike,i),blend:t.blend??null}}function kw(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function mf(n,t){return!n||!t?n||t?.6:0:Math.abs(n.pitch-t.pitch)*1+Math.abs(n.yaw-t.yaw)*.8+Math.abs(n.roll-t.roll)*.6+Math.abs(n.elbow-t.elbow)*.8}function Iw(n,t){const e=(a,s)=>Math.abs(kw(a-s));let i=0;return i+=e(n.yaw,t.yaw)*1,i+=e(n.rootYaw,t.rootYaw)*.7,i+=e(n.pitch,t.pitch)*.9,i+=e(n.roll,t.roll)*.9,i+=Math.abs(n.pelvisX-t.pelvisX)*2,i+=Math.abs(n.pelvisZ-t.pelvisZ)*2,i+=mf(n.armR,t.armR),i+=mf(n.armL,t.armL)*.8,i+=e(n.bladePitch??0,t.bladePitch??0)*1.1,i+=e(n.bladePitchOff??0,t.bladePitchOff??0)*.7,i+=e(n.bladeTwist,t.bladeTwist)*.5,i+=e(n.bladeYaw,t.bladeYaw)*.5,i}function zw(n,t,e,i,a){if(i!=null&&Number.isFinite(i)&&i>=0)return Math.max(.008,i);const s=Math.max(.008,e.segBlend??.1);if(!n)return s;const o=Math.max(.008,e.segBlendMin??.03),r=Math.max(o,Number.isFinite(a)?a:e.segBlendMax??.14),l=Math.max(.1,e.segBlendRef??6),c=ps(Iw(n,t)/l,0,1);return o+(r-o)*c}function gf(n){const t=ps(n,0,1);return t*t*(3-2*t)}function He(n,t,e,i){const a=new _e(new ci(n,t,e),new co({color:i}));return a.castShadow=!0,a.receiveShadow=!0,a}function Ye(){return new Ce}function mr(n,t,e){const i=Ye(),a=He(t*.7,.12,t*.7,e.wood);a.position.y=.06,i.add(a);const s=He(t*2.4,.045,t*.8,e.metal);s.position.y=.13,i.add(s);const o=He(t*.38,n,t,e.blade);o.position.y=.13+n/2,i.add(o);const r=He(t*.42,n*.96,t*.2,e.bladeEdge);r.position.set(0,.13+n/2,t*.5),i.add(r);const l=He(t*.3,.09,t*.45,e.blade);return l.position.y=.13+n+.045,i.add(l),i}function Fw(n){const t=mr(.72,.15,n),e=He(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function Uw(n){const t=Ye(),e=He(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=He(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function Nw(n){const t=Ye(),e=He(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=He(.15,.15,.15,n.glow);i.position.y=.92;const a=i.material;return a.emissive=new ne(n.glow),a.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function Ow(n){const t=Ye();for(let i=0;i<5;i++){const a=(i-2)*.15,s=He(.055,.16,.05,n.wood);s.position.set(.16-Math.abs(a)*.46,a,0),t.add(s)}const e=He(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function Bw(n){const t=Ye(),e=He(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=He(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function ue(n,t,e){return n<t?t:n>e?e:n}const Ci=1e-6;function rm(n,t,e,i,a,s,o,r,l,c,h,u,d){const f=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},g=u??{enabled:!1,lag:.022,maxAngle:.62,rate:26,twistLag:.018,maxTwist:.45,runDrag:0},_=h??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},m=l.stretch??{enabled:!1,swingArm:1,chargeArm:1,runLeg:1,torsoGain:0,impactSquash:0,impactDecay:12,volumeExp:.5,smoothing:26},p=l.swing??{enabled:!1,bodyScale:1,shoulderLift:.045,shoulderPush:.035,shoulderIn:.03,segBlend:.1,weaponScale:{greatsword:1,"sword-shield":.62,"dual-swords":.55}},y=Ye(),x=Ye();x.name="pelvis",x.position.y=n.legLength,y.add(x);const v=Ye();v.name="lower";const w=Ye();w.name="upper",x.add(v),x.add(w);const S=n.headSize,T=n.legLength,E=n.armLength,b=n.limbThickness,M=n.bodyHeight,R=n.bodyWidth,C=l.spine,z=!!(C!=null&&C.enabled),N=z?ue(C.chestPivot??.42,.15,.85)*M:0,D=Ye();D.name="chest",D.position.y=N,w.add(D);const L=z?D:w;let F,H=null,Y=M,it=0;z?(Y=Math.max(.05,N),it=Math.max(.05,M-N),F=He(R,Y,.28,t.body),F.name="torsoLower",F.position.y=Y/2,w.add(F),H=He(R+.008,it,.288,t.body),H.name="torsoUpper",H.position.y=it/2,D.add(H)):(F=He(R,M,.28,t.body),F.name="torso",F.position.y=M/2,w.add(F));const mt=Ye();mt.name="headPivot",mt.rotation.order="YXZ",mt.position.y=Math.min(i.headPivotHeight,M)-N,L.add(mt);const _t=He(S,S,S,t.head);_t.position.y=S/2,mt.add(_t);const Lt=new co({color:"#1b2733"});for(const k of[-1,1]){const Z=new _e(new ci(.06,.07,.02),Lt);Z.position.set(k*.09,S/2+.03,S/2+.011),mt.add(Z)}const J=k=>{const Z=Ye();Z.name=k<0?"hipL":"hipR",Z.rotation.order="ZYX",Z.position.set(k*(R/2-b/2),0,0),v.add(Z);const pt=He(b,T/2,b,t.limb);pt.position.y=-T/4,Z.add(pt);const yt=Ye();yt.name="knee",yt.position.y=-T/2,Z.add(yt);const Kt=He(b,T/2,b,t.limb);Kt.position.y=-T/4,yt.add(Kt);const Jt=He(b*1.15,.07,b*1.7,t.shoe);Jt.position.set(0,-T/2+.035,.045),yt.add(Jt);const ee=new Ze;ee.name="footTip",ee.position.y=-T/2,yt.add(ee);const ye=Ye();return{root:Z,joint:yt,hand:ye,wrist:ye,tip:ee,upperMesh:pt,lowerMesh:Kt,segLen:T/2}},et=k=>{const Z=Ye();Z.name=k<0?"shoulderL":"shoulderR",Z.rotation.order="YXZ",Z.position.set(k*(R/2+b/2),M-.04-N,0),L.add(Z);const pt=He(b,E/2,b,t.limb);pt.position.y=-E/4,Z.add(pt);const yt=Ye();yt.name="elbow",yt.position.y=-E/2,Z.add(yt);const Kt=He(b,E/2,b,t.limb);Kt.position.y=-E/4,yt.add(Kt);const Jt=Ye();Jt.name=k<0?"handL":"handR",Jt.position.y=-E/2,yt.add(Jt);const ee=He(b*1.1,.09,b*1.1,t.head);ee.position.y=.045,Jt.add(ee);const ye=Ye();return ye.name=k<0?"wristL":"wristR",Jt.add(ye),{root:Z,joint:yt,hand:Jt,wrist:ye,upperMesh:pt,lowerMesh:Kt,segLen:E/2}},ht=J(-1),q=J(1),K=et(-1),$=et(1),Mt=[ht,q].map(k=>({root:k.root,joint:k.joint,tip:k.tip,upperLen:T/2,lowerLen:T/2,bend:1})),It=Ye(),Ct=Ye();It.name="mountR",Ct.name="mountL";const Ut=Ye(),G=Ye();Ut.name="gripR",G.name="gripL",$.wrist.add(It),K.wrist.add(Ct),It.add(Ut),Ct.add(G);const re=Nw(t),Ht=Ow(t),Pt=Bw(t),gt={"sword-shield":{right:mr(.42,.075,t),left:Uw(t)},"dual-swords":{right:mr(.42,.075,t),left:mr(.42,.075,t)},greatsword:{right:Fw(t),left:He(.12,.2,.12,t.wood)},staff:{right:re.g,left:Ye(),orb:re.orb},bow:{right:Pt,left:Ht.g,arrow:Pt,drawString:Ht.drawString}};for(const k of Object.keys(gt))Ut.add(gt[k].right),G.add(gt[k].left),gt[k].right.visible=!1,gt[k].left.visible=!1;function zt(k,Z,pt){const yt=new Ze;yt.name="bladeBase",yt.position.y=Z,k.add(yt);const Kt=new Ze;Kt.name="bladeTip",Kt.position.y=pt,k.add(Kt)}zt(gt["sword-shield"].right,.44,.55),zt(gt["dual-swords"].right,.44,.55),zt(gt["dual-swords"].left,.44,.55),zt(gt.greatsword.right,.74,.88),zt(gt.staff.right,.78,.92);let Ot=null,I=null,A=1,j=0,ut=0,Q=null,ct=0,kt=0,tt=0,dt=0,Nt=0,at=0,bt=mw(),O={...Bh},lt=0,xt=0,Wt=0,Gt=-1,qt=0,U=0,At=0,nt=0,ft=0,Rt=0,Et=0,Vt=1,ce=0,me=0,ie=0,Ee=0,Ge=!1,ln=0,V=-1,wt=0,Tt=0,Qt=0,fe=!1,ae=0,ge=0,Ne=0,ze=0,Le="none",be=0,Bn=1,Hn=!1,P=-1,X=!1,ot=0,st=0,W=0,St={...rh},Dt=0,Yt=0,jt={active:!1,dist:0,gy:0,pitch:0,joint:0,grip:1},Bt=NaN,vt=0,rt=0,Ft=0,se=NaN,oe=NaN,Ve=-1,le=null,Zt=null,sn=0,he=1,Oe=.1,Gn=null,Be={lx:0,ly:0,lz:0,rx:0,ry:0,rz:0},jn=null,Te=null,An=null,bi=null,mn=null,Vn=null,qn="R",Ni=0,Oi=0,Ln=0,po=0,Vh=1,li=0,mo=null,aa=0,Xh=0,Vr=NaN,Wh=NaN,Xr={speed:0,phase:0},Es={lp:0,lr:0,rp:0,rr:0},dm=0,Wr=0,Yr=!0,$r=0,Ts="none",Ca=0,La=0,Da=0,go=.3,Yh=0;function um(k){const Z=Math.PI/180,pt=s;let yt=0,Kt=0,Jt=0,ee=0;k==="sword-shield"?(yt=pt.swordPitchDeg*Z,Jt=pt.shieldPitchDeg*Z):k==="dual-swords"?(yt=pt.swordPitchDeg*Z,Jt=pt.swordPitchDeg*Z):k==="greatsword"?(yt=pt.greatswordPitchDeg*Z,Jt=pt.greatswordPitchDeg*Z):k==="staff"?yt=pt.staffPitchDeg*Z:Jt=pt.bowPitchDeg*Z,It.rotation.set(yt,0,Kt),Ct.rotation.set(Jt,0,ee),It.position.x=k==="greatsword"?-Math.max(0,s.twoHandInsetX??0):0}function $h(k){if(k!==Ot){Ot=k;for(const Z of Object.keys(gt))gt[Z].right.visible=Z===k,gt[Z].left.visible=Z===k;um(k),Ht.drawString.position.z=-.06,Pt.position.z=0,re.orb.scale.setScalar(1),w.rotation.y=0}}$h("sword-shield");const Zh=[];y.traverse(k=>{k instanceof _e&&k.material instanceof co&&Zh.push(k.material)});const fm=new ne(r.flashColor);function pm(k,Z){const pt=em(k,Z,r);bt=pt,w.rotation.x+=pt.upperPitch,w.rotation.z+=pt.upperRoll,w.rotation.y+=pt.upperYaw;const yt=ue(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),Kt=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;w.position.x+=ue(pt.upperShiftX*yt,-Kt,Kt),w.position.z+=ue(pt.upperShiftZ*yt,-Kt,Kt),x.position.x+=pt.comX,x.position.z+=pt.comZ-pt.pelvisBack,x.position.y-=pt.drop;const Jt=pt.legacy?0:ue(r.lowerScale,0,1);v.position.z+=pt.pelvisBack*(1-Jt),v.position.y+=pt.drop*(1-Jt),ht.joint.rotation.x+=pt.knee,q.joint.rotation.x+=pt.knee,ht.root.rotation.x-=pt.hip,q.root.rotation.x-=pt.hip,K.root.rotation.x+=pt.arm,$.root.rotation.x+=pt.arm*.8;for(const ee of Zh)ee.emissive.copy(fm).multiplyScalar(pt.flash)}function xo(k){return k<.22?-1:k<.42?-1+(k-.22)/.2*2:k<.5?1:Math.max(0,1-(k-.5)/.5)}function mm(k){for(const Z of[K,$])Z.upperMesh.scale.set(k.girthArm,k.arm,k.girthArm),Z.upperMesh.position.y=-Z.segLen/2*k.arm,Z.joint.position.y=-Z.segLen*k.arm,Z.lowerMesh.scale.set(k.girthArm,k.arm,k.girthArm),Z.lowerMesh.position.y=-Z.segLen/2*k.arm,Z.hand.position.y=-Z.segLen*k.arm;for(const Z of[ht,q])Z.upperMesh.scale.set(k.girthLeg,k.leg,k.girthLeg),Z.upperMesh.position.y=-Z.segLen/2*k.leg,Z.joint.position.y=-Z.segLen*k.leg,Z.lowerMesh.scale.set(k.girthLeg,k.leg,k.girthLeg),Z.lowerMesh.position.y=-Z.segLen/2*k.leg,Z.tip.position.y=-Z.segLen*k.leg;F.scale.set(k.girthTorso,k.torso,k.girthTorso),F.position.y=Y/2*k.torso,H&&(H.scale.set(k.girthTorso,k.torso,k.girthTorso),H.position.y=it/2*k.torso,D.position.y=Y*k.torso)}function gm(k,Z){const pt=s.twoHandGripY??-.16,yt=Math.max(1,s.twoHandMaxStretch??1.25),Kt=E*yt*.99,Jt=K.root.position.x,ee=K.root.position.y,ye=K.root.position.z,ve=K.root.rotation.y,je=Math.cos(ve),qe=Math.sin(ve),Fe=Gi=>{const Ia=It.localToWorld(new B(0,Gi,0)),Mn=(z?D:w).worldToLocal(Ia),za=Mn.x-Jt,qr=Mn.y-ee,_o=Mn.z-ye,Fa={x:za*je-_o*qe,y:qr,z:za*qe+_o*je};return{t:Fa,dist:Math.hypot(Fa.x,Fa.y,Fa.z)}};let Me=pt,Ae=Fe(Me);if(!Number.isFinite(Ae.dist)||Ae.dist<=Ci)return;for(let Gi=0;Gi<18&&Ae.dist>Kt;Gi++)if(Me*=.78,Ae=Fe(Me),!Number.isFinite(Ae.dist)||Ae.dist<=Ci)return;Number.isFinite(Bt)||(Bt=Me);const tn=Math.max(0,s.twoHandSlideRate??9);Bt+=(Me-Bt)*(1-Math.exp(-tn*Z));const _n=Fe(Bt),Qe=_n.t,Kn=_n.dist,Dn=Kn/Math.max(Ci,E),Jn=ue(Dn,1,yt),hi=Math.max(1,s.twoHandGripStart??1.02),Bi=Math.max(hi+.001,yt),Hi=ue(s.twoHandMinGrip??1,0,1),kn=ue((Dn-hi)/(Bi-hi),0,1),di=1-kn*kn*(3-2*kn)*(1-Hi),In=E/2*Jn,ka=im(Qe,In,In,-1),Si=am({rootPitch:K.root.rotation.x,rootRoll:K.root.rotation.z,jointPitch:K.joint.rotation.x},ka,ue(k*di,0,1),Math.PI);K.root.rotation.x=Si.rootPitch,K.root.rotation.z=Si.rootRoll,K.joint.rotation.x=Math.min(Si.jointPitch,-.06);const Qn=1/Math.sqrt(Jn);K.upperMesh.scale.set(Qn,Jn,Qn),K.upperMesh.position.y=-In/2,K.joint.position.y=-In,K.lowerMesh.scale.set(Qn,Jn,Qn),K.lowerMesh.position.y=-In/2,K.hand.position.y=-In,jt={active:!0,dist:Kn,gy:Bt,pitch:Si.rootPitch,joint:K.joint.rotation.x,grip:di}}function xm(k,Z){if(!g.enabled){vt=0,rt=0,$.wrist.rotation.set(0,0,0),se=$.root.rotation.x,oe=Qh();return}const pt=$.root.rotation.x,yt=Qh();if(Z!==Ve){Ve=Z,se=pt,oe=yt,$.wrist.rotation.set(vt,0,rt);return}if(!Number.isFinite(se)||k<=1e-5){se=pt,oe=yt,$.wrist.rotation.set(vt,0,rt);return}const Kt=(pt-se)/k,Jt=Xe(yt-oe)/k;se=pt,oe=yt;const ee=Math.max(0,g.maxAngle),ye=Math.max(0,g.maxTwist),ve=.15+.85*ue(Oi,0,1),qe=-ue(Ft,0,1.4)*Math.max(0,g.runDrag),Fe=ue(-Kt*g.lag*ve+qe,-ee,ee),Me=ue(Jt*g.twistLag*ve,-ye,ye),Ae=1-Math.exp(-Math.max(0,g.rate)*k);vt+=(Fe-vt)*Ae,rt+=(Me-rt)*Ae,$.wrist.rotation.set(vt,0,rt)}function vm(k){const Z=Math.PI/180;return k==="greatsword"?s.greatswordPitchDeg*Z:k==="staff"?s.staffPitchDeg*Z:k==="bow"?s.bowPitchDeg*Z:s.swordPitchDeg*Z}function Zr(k){const Z=Math.PI/180;return k==="sword-shield"?s.shieldPitchDeg*Z:k==="greatsword"?s.greatswordPitchDeg*Z:k==="bow"?s.bowPitchDeg*Z:s.swordPitchDeg*Z}function ym(k){const Z=Math.PI/180;return k==="sword-shield"||k==="dual-swords"?(s.swordCantDeg??0)*Z:k==="greatsword"?(s.greatswordCantDeg??0)*Z:0}function _m(k,Z){const pt=k.weapon;if(pt==="staff"||pt==="bow")return;const yt=qn==="R",Kt=yt?$:K,Jt=yt?It:Ct,ee=yt?K:$,ye=yt?Ct:It,ve=pt==="greatsword"&&yt?at:0,je=pt==="greatsword"?s.greatswordYawDeg:s.swordYawDeg,qe=Math.PI/180,Fe=-je*qe,Me=je*qe,Ae=(kn,di)=>{const In=Math.max(0,Math.PI/2-Math.abs(di));return Math.sign(kn)*Math.min(Math.abs(kn),In)},tn=(jn??vm(pt)+j)+ve,_n=Z+Kt.root.rotation.x+Kt.joint.rotation.x;Jt.rotation.set(Math.PI/2-tn-_n,0,Ae(yt?Fe:Me,tn));const Qe=Te??(pt==="sword-shield"?null:Zr(pt)+ut),Kn=Z+ee.root.rotation.x+ee.joint.rotation.x;pt==="sword-shield"?ye.rotation.x=Qe===null?Zr(pt):Zr(pt)-Qe-Kn:ye.rotation.set(Math.PI/2-(Qe??0)-Kn,0,Ae(yt?Me:Fe,Qe??0));const Dn=ym(pt),Jn=mn??0,hi=Vn??0,Bi=An??0,Hi=bi??0;yt?(Ut.rotation.z=-Dn+Jn,Ut.rotation.y=Bi,G.rotation.z=Dn+hi,G.rotation.y=Hi):(G.rotation.z=Dn+Jn,G.rotation.y=Bi,Ut.rotation.z=-Dn+hi,Ut.rotation.y=Hi)}function jh(k){jn=k.bladePitch,Te=k.bladePitchOff,An=k.bladeTwist,bi=k.bladeTwistOff,mn=k.bladeYaw,Vn=k.bladeYawOff,qn=k.lead,Ni=k.rootYaw+k.spinYaw,y.rotation.y=Ni,w.rotation.y+=k.yaw,w.rotation.x+=k.pitch,w.rotation.z+=k.roll,x.position.z+=k.pelvisZ,x.position.x+=k.pelvisX,k.armR&&($.root.rotation.x=k.armR.pitch,$.root.rotation.y=k.armR.yaw,$.root.rotation.z=k.armR.roll,$.joint.rotation.x=k.armR.elbow),k.armL&&(K.root.rotation.x=k.armL.pitch,K.root.rotation.y=k.armL.yaw,K.root.rotation.z=k.armL.roll,K.joint.rotation.x=k.armL.elbow)}function qh(k,Z){const pt=Gn??xo(k.attackProgress),yt=Lw(k.weapon,k.comboIndex,pt,p,k.attackProgress);if(k.comboIndex!==sn){Zt=le,he=0,sn=k.comboIndex;const ee=k.timings.windup+k.timings.active+k.timings.recovery,ye=Math.max(p.segBlendMin??.03,ee*.22);Oe=zw(Zt,yt,p,yt.blend??null,ye)}const Kt=Math.max(.008,Oe);he=Math.min(1,he+Z/Kt);const Jt=Zt&&he<1?Dw(Zt,yt,gf(he)):yt;return le=Jt,Jt}function Mm(k,Z){const pt=R/2+b/2,yt=M-.04-N;if(!p.enabled){K.root.position.set(-pt,yt,0),$.root.position.set(pt,yt,0),Be={lx:-pt,ly:yt,lz:0,rx:pt,ry:yt,rz:0};return}const Kt=Math.max(0,p.shoulderLift),Jt=Math.max(0,p.shoulderPush),ee=k&&Z==="greatsword"?Math.max(0,p.shoulderIn):0,ye=_n=>Kt*ue((-_n-.5)/1.45,0,1),ve=_n=>Jt*ue((-_n-.2)/1.9,0,1),je=-pt+ee,qe=yt+ye(K.root.rotation.x),Fe=ve(K.root.rotation.x),Me=pt-ee,Ae=yt+ye($.root.rotation.x),tn=ve($.root.rotation.x);K.root.position.set(je,qe,Fe),$.root.position.set(Me,Ae,tn),Be={lx:je,ly:qe,lz:Fe,rx:Me,ry:Ae,rz:tn}}function bm(k,Z,pt){if(k.phase==="idle"||k.charging){wt=0,Tt=0,Qt=0;return}const yt=k.attackProgress,Kt=xo(yt),Jt=Math.max(0,Kt),ee=l.stride,ye=Number.isFinite(ee.stepReach)?ee.stepReach:.17,ve=Number.isFinite(ee.stepSideReach)?ee.stepSideReach:.14,je=Number.isFinite(ee.stepDipReach)?ee.stepDipReach:.05,qe=k.weapon==="greatsword"?ue(Number.isFinite(ee.heavyScale)?ee.heavyScale:1,0,1):1,Fe=1-Math.exp(-12*Math.max(0,pt));wt+=(ye*Jt*qe-wt)*Fe,Tt+=(Z*ve*Jt*qe-Tt)*Fe,Qt+=(je*Math.sin(Math.PI*yt)*qe-Qt)*Fe,x.position.z+=wt,x.position.x+=Tt,x.position.y-=Qt}let Kh=null;function Sm(){Kh={upperX:w.rotation.x,upperY:w.rotation.y,upperZ:w.rotation.z,upperPX:w.position.x,upperPZ:w.position.z,pelvisX:x.position.x,pelvisY:x.position.y,pelvisZ:x.position.z,pelvisRX:x.rotation.x,pelvisRZ:x.rotation.z,lrx:K.root.rotation.x,lry:K.root.rotation.y,lrz:K.root.rotation.z,lj:K.joint.rotation.x,rrx:$.root.rotation.x,rry:$.root.rotation.y,rrz:$.root.rotation.z,rj:$.joint.rotation.x,rootY:y.rotation.y}}function wm(k){const Z=Kh;if(!Z)return;const pt=gf(ue(k,0,1));if(pt>=1)return;const yt=(Kt,Jt)=>Kt+(Jt-Kt)*pt;w.rotation.x=yt(Z.upperX,w.rotation.x),w.rotation.y=yt(Z.upperY,w.rotation.y),w.rotation.z=yt(Z.upperZ,w.rotation.z),w.position.x=yt(Z.upperPX,w.position.x),w.position.z=yt(Z.upperPZ,w.position.z),x.position.x=yt(Z.pelvisX,x.position.x),x.position.y=yt(Z.pelvisY,x.position.y),x.position.z=yt(Z.pelvisZ,x.position.z),x.rotation.x=yt(Z.pelvisRX,x.rotation.x),x.rotation.z=yt(Z.pelvisRZ,x.rotation.z),K.root.rotation.x=yt(Z.lrx,K.root.rotation.x),K.root.rotation.y=yt(Z.lry,K.root.rotation.y),K.root.rotation.z=yt(Z.lrz,K.root.rotation.z),K.joint.rotation.x=yt(Z.lj,K.joint.rotation.x),$.root.rotation.x=yt(Z.rrx,$.root.rotation.x),$.root.rotation.y=yt(Z.rry,$.root.rotation.y),$.root.rotation.z=yt(Z.rrz,$.root.rotation.z),$.joint.rotation.x=yt(Z.rj,$.joint.rotation.x),y.rotation.y=Z.rootY+Xe(y.rotation.y-Z.rootY)*pt,Ni=y.rotation.y}let As=null,jr=0,Jh=0;function Em(){if(!z)return;const k=C,Z=Math.max(0,k.waist??1),pt=Math.max(0,k.chest??0),yt=Z+pt,Kt=yt>1e-6?Z/yt:1,Jt=yt>1e-6?pt/yt:0,ee=w.rotation.x,ye=w.rotation.y,ve=w.rotation.z;w.rotation.set(ee*Kt,ye*Kt,ve*Kt),D.rotation.set(ee*Jt,ye*Jt,ve*Jt);const je=ue(k.neck??0,0,1);je>0&&(mt.rotation.x-=ee*je),As={x:ee,y:ye,z:ve}}function vo(){return{yaw:w.rotation.y+(z?D.rotation.y:0),pitch:w.rotation.x+(z?D.rotation.x:0),lean:w.rotation.z+(z?D.rotation.z:0)}}function Qh(){return vo().yaw}function Tm(k,Z){if(!(d!=null&&d.enabled)){mo=null,aa=0;return}y.updateWorldMatrix(!0,!0);const pt=new B,yt=[],Kt=(Qn,Gi,Ia=0)=>{Qn.getWorldPosition(pt),yt.push({x:pt.x,y:pt.y+Ia,z:pt.z,mass:Gi})},Jt=n.headSize;Kt(mt,.08,Jt/2),Kt(F,.14),Kt(H??D,.24),Kt(x,.12),Kt(K.hand,.05),Kt($.hand,.05),Kt(ht.joint,.15),Kt(q.joint,.15);const ee=Ot?yo(gt[Ot].right):null;ee&&yt.push({x:(ee.base.x+ee.tip.x)/2,y:(ee.base.y+ee.tip.y)/2,z:(ee.base.z+ee.tip.z)/2,mass:Ot==="greatsword"?.09:.04});const ye=Math.max(.05,n.limbThickness*1.15/2+.015),ve=Math.max(.06,n.limbThickness*1.7/2+.02);let je=1/0,qe=-1/0,Fe=1/0,Me=-1/0,Ae=0;for(const Qn of[ht,q])Qn.tip.getWorldPosition(pt),pt.y<=.13&&(Ae+=1),je=Math.min(je,pt.x-ye),qe=Math.max(qe,pt.x+ye),Fe=Math.min(Fe,pt.z-ve),Me=Math.max(Me,pt.z+ve);(!Number.isFinite(je)||Ae===0)&&(je=qe=Fe=Me=0);let tn=0,_n=0;Number.isFinite(Vr)&&Z>1e-5&&(tn=ue((k.position.x-Vr)/Z,-20,20),_n=ue((k.position.z-Wh)/Z,-20,20)),Vr=k.position.x,Wh=k.position.z;const Qe=Mw(yt,{minX:je,maxX:qe,minZ:Fe,maxZ:Me},tn,_n,d);if(mo=Qe,!d.autoCounter){aa=0;return}const Kn=Math.cos(k.bodyYaw),Dn=-Math.sin(k.bodyYaw),Jn=Qe.xcomX-Qe.centerX,hi=Qe.xcomZ-Qe.centerZ,Bi=Jn*Kn+hi*Dn,Hi=tn*Kn+_n*Dn,kn=Qe.grounded?bw(Bi,Hi,d.predLead??0):0;Jh=kn;const di=Math.abs(kn)-.45*Qe.halfX;Xh=di;let In=0;di>.002&&Qe.grounded&&(In=-Math.sign(kn)*Math.min(Math.max(.005,d.maxShift??.045),(di+.002)*1.1666666666666667));const ka=Math.abs(kn)/Math.max(1e-4,Qe.halfX),Si=Math.max(.1,Sw(d.counterRate,ka,d.counterBoost??0));aa+=(In-aa)*(1-Math.exp(-Si*Z))}function Am(k,Z){if(Ht.drawString.position.z=-.06,Pt.position.z=0,re.orb.scale.setScalar(1),w.rotation.y=0,k.charging&&k.weapon==="bow"){const Jt=k.charge;K.root.rotation.x=-1.25,K.joint.rotation.x=-.15,$.root.rotation.x=.35+Jt*.3,$.joint.rotation.x=-1.15,Ht.drawString.position.z=-.06-Jt*.22,Pt.position.z=-Jt*.3,w.rotation.y=-.22;return}if(k.phase==="idle"&&Ln<=.001){Zt=null,le=null,sn=0,he=1,Oe=Math.max(.008,p.segBlend),jn=null,Te=null,An=null,bi=null,mn=null,Vn=null,Bt=NaN,k.weapon==="greatsword"&&(It.position.x=-Math.max(0,s.twoHandInsetX??0));return}const pt=xo(k.attackProgress),yt=Math.max(0,-pt),Kt=Math.max(0,pt);if(k.weapon==="bow")K.root.rotation.x=-1.2,K.joint.rotation.x=-.15,$.root.rotation.x=.9-Kt*.8,$.joint.rotation.x=-.3;else if(k.weapon==="greatsword")if(p.enabled)jh(qh(k,Z));else{const Jt=-1.6*yt+1.25*Kt,ee=ue(Number.isFinite(l.stride.heavyScale)?l.stride.heavyScale:1,0,1);$.root.rotation.x=Jt,$.joint.rotation.x=-(.25+yt*.4),K.root.rotation.x=Jt+.06,K.joint.rotation.x=-(.32+yt*.4),K.root.rotation.z=.42,$.root.rotation.z=0;const ye=-Math.sin($.root.rotation.x);$.root.rotation.y=-.72*Math.tanh(ye*4),w.rotation.y=-.2*pt*ee}else if(p.enabled)jh(qh(k,Z));else{const Jt=k.comboIndex;if(Jt===1)$.root.rotation.x=-1.7*yt+1.1*Kt,$.joint.rotation.x=-(.2+yt*.5),K.root.rotation.x=.1,w.rotation.y=-.18*pt;else if(Jt===2)K.root.rotation.x=-1.5*yt+1*Kt,K.joint.rotation.x=-(.2+yt*.5),$.root.rotation.x=.2,w.rotation.y=.45*-pt;else{const ee=-1.9*yt+1.2*Kt;K.root.rotation.x=ee,$.root.rotation.x=ee,K.joint.rotation.x=-(.15+yt*.4),$.joint.rotation.x=-(.15+yt*.4),w.rotation.y=-.3*pt}}if(k.weapon==="greatsword"){const Jt=ue((-$.root.rotation.x-1.3)/1.2,0,1);It.position.x=-Math.max(0,s.twoHandInsetX??0)*(1-Jt)}bm(k,ln%2===0?1:-1,Z)}function Rm(k,Z){k&&($.root.rotation.x=-1.05,$.joint.rotation.x=-.35,K.root.rotation.x=-.45,K.joint.rotation.x=-.2,w.rotation.y=-.12,re.orb.scale.setScalar(1.25+.12*Math.sin(Z*2)))}function Pm(k){if(!k||k.phase==="idle")return;const Z=k.progress,pt=Z<.3?-.35+Z/.3*1.35:Z<.7?1:Math.max(0,1-(Z-.7)/.3),yt=Math.PI/180;w.rotation.x+=_.leanDeg*yt*pt,K.root.rotation.x-=_.shieldPitchDeg*yt*pt,K.joint.rotation.x-=.22*pt,$.root.rotation.x-=.3*pt,x.position.z+=_.pelvisReach*Math.max(0,pt)}function yo(k){if(!k)return null;const Z=k.getObjectByName("bladeBase"),pt=k.getObjectByName("bladeTip");if(!Z||!pt)return null;k.updateWorldMatrix(!0,!1);const yt=Z.getWorldPosition(new B),Kt=pt.getWorldPosition(new B),Jt=new B().setFromMatrixColumn(k.matrixWorld,0).normalize();return{base:{x:yt.x,y:yt.y,z:yt.z},tip:{x:Kt.x,y:Kt.y,z:Kt.z},normal:{x:Jt.x,y:Jt.y,z:Jt.z}}}return{group:y,update(k,Z,pt,yt,Kt=!1,Jt,ee,ye){var dd;$h(Z.weapon),y.rotation.y=0,Ni=0,w.rotation.x=0,w.rotation.z=0,x.position.x=0,x.position.y=T,x.position.z=0,x.rotation.z=0,x.rotation.x=0,w.position.x=0,w.position.y=0,w.position.z=0,D.rotation.set(0,0,0),v.position.x=0,v.position.y=0,v.position.z=0,v.rotation.z=0;const ve=Math.max(1/240,Math.min(yt,.1));Q=((dd=l.stance)==null?void 0:dd[Z.weapon])??null,I!==Z.weapon&&(I=Z.weapon,A=Q?0:1);const je=Math.max(.01,(Q==null?void 0:Q.blend)??.22);A=Math.min(1,A+ve/je);const qe=Q?A:0;j=((Q==null?void 0:Q.bladePitchDeg)??0)*Math.PI/180*qe,ut=((Q==null?void 0:Q.bladePitchOffDeg)??0)*Math.PI/180*qe;const Fe=Jt===void 0?dm+=yt:Jt;Wr=Fe;const Me=l.landing;Me.enabled?Yr&&!k.grounded?(Ts="jump",Ca=Fe,La=Me.anticipationDuration,Da=Math.max(0,Me.jumpAnticipation),go=.32):!Yr&&k.grounded&&(Ts="land",Ca=Fe,La=Me.duration,Da=pw($r,Me),go=Me.compressRatio,Yh=$r):(Ts="none",Da=0),Fe<Ca&&(Ts="none",Da=0),Yr=k.grounded,$r=k.velocity.y;const Ae=ff(Fe,Ca,La,Da,go),tn=Z.phase!=="idle",_n=(ye==null?void 0:ye.phase)==="active";Oi=hw(Oi,tn,ve,l.attack.blendRate);const Qe=dw(Oi,l.attack.gaitWeight,l.attack.lowerBodyWeight);po=Qe.attackLegWeight,Vh=Qe.gaitScale;const Kn=Math.sin(k.bodyYaw),Dn=Math.cos(k.bodyYaw),Jn=(k.velocity.x-ct)/ve,hi=(k.velocity.z-kt)/ve,Bi=ue(Jn,-60,60),Hi=ue(hi,-60,60),kn=Bi*Kn+Hi*Dn,di=Xe(k.bodyYaw-tt)/ve,In=Math.hypot(k.velocity.x,k.velocity.z),ka=o.maxForwardDeg*Math.PI/180,Si=o.maxSideDeg*Math.PI/180,Qn=ue(kn*o.accelGain,-ka,ka),Gi=ue(-di*In*o.turnGain,-Si,Si),Ia=1-Math.exp(-o.smoothing*ve);dt+=(Qn-dt)*Ia,Nt+=(Gi-Nt)*Ia,ct=k.velocity.x,kt=k.velocity.z,tt=k.bodyYaw;const Mn=Math.hypot(k.velocity.x,k.velocity.z),za=ue(a.knockGaitScale??0,0,1),qr=pt.knockX*za,_o=pt.knockZ*za,Fa=za>0&&Math.hypot(pt.knockX,pt.knockZ)>.001,Kr=k.velocity.x+qr,Jr=k.velocity.z+_o,td=Math.hypot(Kr,Jr);ze=td;const Cm=Math.cos(k.bodyYaw),Lm=-Math.sin(k.bodyYaw),Dm=k.velocity.x*Cm+k.velocity.z*Lm,ed=Mn>Ci?ue(Dm/Mn,-1,1):0,nd=Mn>Ci?ue((k.velocity.x*Kn+k.velocity.z*Dn)/Mn,-1,1):1,km=Oh(nd,a.backStrafeStartDeg,a.backStrafeFullDeg);Le==="settled"&&X&&ot>st*1.02+1e-4&&(Le="none");let Rs=1;Le==="blend"?(Rs=Kp(Hn?P:be,a.stopYawBlendMode,Hn),Hn||(be=Math.min(1,be+ve/Math.max(.01,a.stopYawAfterSec)),(be>=1||a.stopYawBlendMode==="inStop"||X)&&(Le="settled",Rs=0))):Le==="settled"&&(Rs=ue(Mn/Math.max(Ci,a.stopEnterRatio*e),0,1)),Bn=Rs;const Im=Yp(ed,i.legYawScale,i.hipYawMaxDeg,a.strafeHipBoost),zm=$p(nd,ed,Im,km)*Rs;xt+=(zm-xt)*(1-Math.exp(-i.hipYawSmoothing*ve));const Ps=k.bodyYaw+xt;Wt=Ps;const Fm=Math.sin(Ps),Um=Math.cos(Ps),Nm=Math.cos(Ps),Om=-Math.sin(Ps),Xn={speed:td,phase:k.gaitPhase,localForward:Kr*Fm+Jr*Um,localRight:Kr*Nm+Jr*Om,stride:k.stride};if(tn&&Z.attackId!==V){const te=!fe;V=Z.attackId,ln+=1,ie=te&&(!Ge||Xn.speed>.05)?Xn.phase:Ee,Ge=!0}fe=tn;const sa=Oi>0?cw(Xn,Z.attackProgress,ln,Oi,l.stride,ie):Xn;Xr=sa,tn&&(Ee=sa.phase);const id=Math.max(0,a.stopBlendSec||0),ad=id>0&&!tn&&!Fa&&k.grounded,Qr=Zp(Mn,ce,e,a.stopEnterRatio,a.stopExitRatio);if(!ad||Qr.resume)Gt=-1;else if(Gt<0&&Qr.enter){Gt=0,qt=k.gaitPhase,U=Xp(k.gaitPhase),At=Mn,nt=Math.max(k.stride,Ci),ft=Xn.localForward,Rt=Xn.localRight;const te=1/Math.max(Ci,Mn);Et=k.velocity.x*te,Vt=k.velocity.z*te}const Bm=ce;ce=Mn;const ui=ad&&Gt>=0;ui&&(Gt=Math.min(1,Gt+ve/id)),ui&&Le!=="blend"&&(Le="blend",be=0),Hn=ui&&Gt<1,P=Gt,X=Qr.resume,ot=Mn,st=Bm;const sd=ui?{phase:qt,speed:At,moveSpeed:e,localForward:ft,localRight:Rt,legLength:n.legLength,stride:nt,grounded:!0}:{phase:sa.phase,speed:sa.speed,moveSpeed:e,localForward:sa.localForward,localRight:sa.localRight,legLength:n.legLength,stride:sa.stride??0,grounded:k.grounded};let tc=ui?Wp(sd,a,{progress:Gt,phase0:qt,phaseEnd:U}):Lr(sd,a);const oa=l.attack.moveTakeover;if(oa&&!ui){const te=Z.phase==="windup"?oa.windup:Z.phase==="recovery"?oa.recovery:Z.phase==="settle"?oa.settle:0,de=Math.max(.05,oa.full-oa.speed),gn=ue((Xn.speed-oa.speed)/de,0,1),bn=ue(te,0,1)*gn,Mo=bn>li?10:6;li=ue(li+(bn-li)*(1-Math.exp(-Mo*ve)),0,1)}else ui?li=0:li=ue(li*Math.exp(-8*ve),0,1);if(li>.001&&!ui){const te=Lr({phase:Xn.phase,speed:Xn.speed,moveSpeed:e,localForward:Xn.localForward,localRight:Xn.localRight,legLength:n.legLength,stride:Xn.stride??0,grounded:k.grounded},a);tc=uw(tc,te,li)}const Re=fw(tc,Qe.gaitScale);if(W=0,_n&&ye){const te=sw(ye.progress,ye.dir,a),de=Qe.gaitScale;Re.legL.pitchX+=te.legL.pitchX*de,Re.legL.rollZ+=te.legL.rollZ*de,Re.legL.kneeX+=te.legL.kneeX*de,Re.legR.pitchX+=te.legR.pitchX*de,Re.legR.rollZ+=te.legR.rollZ*de,Re.legR.kneeX+=te.legR.kneeX*de,Re.pelvisY+=te.pelvisY*de,W=te.env}let ec=0,nc=0,ic=0,od=0;if(ui){const te=qp(k.bodyYaw,Et,Vt),de=Jp(Gt,qt,te.forward,te.right,a);de.leadLeft?(Re.legL.pitchX-=de.leadPitch,Re.legL.kneeX+=de.leadKnee,Re.legR.pitchX+=de.trailPitch):(Re.legR.pitchX-=de.leadPitch,Re.legR.kneeX+=de.leadKnee,Re.legL.pitchX+=de.trailPitch),nc=de.bodyShift*de.fwdN,ec=de.bodyShift*de.rightN,ic=de.bodyDip,od=de.chestPitch,ae=de.leadPitch,ge=de.bodyShift,Ne=de.bodyDip}else ae=0,ge=0,Ne=0;if(Es={lp:Re.legL.pitchX,lr:Re.legL.rollZ,rp:Re.legR.pitchX,rr:Re.legR.rollZ},!k.grounded)ht.root.rotation.x=-.55,q.root.rotation.x=-.25,ht.joint.rotation.x=.75,q.joint.rotation.x=.55,K.root.rotation.x=-.9,$.root.rotation.x=-.7,K.joint.rotation.x=-.6,$.joint.rotation.x=-.6,ht.root.rotation.z=0,q.root.rotation.z=0;else{ht.root.rotation.x=Re.legL.pitchX,q.root.rotation.x=Re.legR.pitchX,ht.root.rotation.z=Re.legL.rollZ,q.root.rotation.z=Re.legR.rollZ,ht.joint.rotation.x=Re.legL.kneeX,q.joint.rotation.x=Re.legR.kneeX;const te=Q?A:0,de=1+(((Q==null?void 0:Q.armSwing)??1)-1)*te,gn=Q==null?void 0:Q.armR,bn=Q==null?void 0:Q.armL,Mo=Re.armL*de+((bn==null?void 0:bn.pitch)??0)*te,ud=Re.armR*de+((gn==null?void 0:gn.pitch)??0)*te;K.root.rotation.x=Mo,$.root.rotation.x=ud,K.joint.rotation.x=-(.18+Mo*.2)+((bn==null?void 0:bn.elbow)??0)*te,$.joint.rotation.x=-(.18+ud*.2)+((gn==null?void 0:gn.elbow)??0)*te,K.root.rotation.z=((bn==null?void 0:bn.roll)??0)*te,$.root.rotation.z=((gn==null?void 0:gn.roll)??0)*te,K.root.rotation.y=((bn==null?void 0:bn.yaw)??0)*te,$.root.rotation.y=((gn==null?void 0:gn.yaw)??0)*te,x.position.x=Re.pelvisX,x.position.y=T+Re.pelvisY,x.position.z=0,x.rotation.z=Re.pelvisRoll}const Hm=sm(x,v),Cs=_n?{...f,weight:0}:ui&&f.enabled?{...f,weight:1}:f,rd=Cs.enabled&&k.grounded&&Cs.weight>0?ue(Cs.weight,0,1)*(tn?ue(Cs.attackScale,0,1):1):0;x.position.x+=ec,x.position.z+=nc,x.position.y-=ic,v.position.y+=ic,rd<=0&&(v.position.x-=ec,v.position.z-=nc);const ac=Mn/Math.max(e,Ci);Ft=ac;const Gm=Number.isFinite(o.crouchSmoothing)?o.crouchSmoothing:8,Vm=1-Math.exp(-Math.max(0,Gm)*ve);lt+=(ue(ac,0,1)-lt)*Vm;const Ua=nm({leanForward:dt,leanSide:Nt,speedRatio:lt},o);x.rotation.x+=Ua.pelvisPitch,x.rotation.z+=Ua.pelvisRoll,x.position.x+=Ua.pelvisX,x.position.z+=Ua.pelvisZ,x.position.y-=Ua.crouch,v.position.y+=Ua.crouch*(1-ue(rd,0,1));const cd=Z.phase!=="idle"||Z.charging&&Z.weapon==="bow",sc=cd?1:0,Xm=Math.max(.001,sc>Ln?p.poseIn??.1:p.poseOut??.16);if(Ln!==sc){const te=ve/Xm;Ln=ue(Ln+(sc>Ln?te:-te),0,1)}if((Ln>0||cd)&&Sm(),Am(Z,ve),Ln>0&&Ln<1&&wm(Ln),Q){const te=(1-Ln)*A;w.rotation.y+=(Q.torsoYaw??0)*te,w.rotation.x+=(Q.torsoPitch??0)*te}Rm(Kt,k.gaitPhase),Pm(ee);const Wm=Z.weapon==="greatsword",ld=Math.hypot(k.velocity.x,k.velocity.z),Ym=Wm&&Z.phase==="idle"&&ld>.5?Math.min(1.15,ld/Math.max(e,.001)*.9):0;at+=(Ym-at)*(1-Math.exp(-6*ve));const $m=w.rotation.x;Z.weapon==="bow"&&(Ht.g.rotation.x=-(K.root.rotation.x+K.joint.rotation.x),Pt.rotation.x=-($.root.rotation.x+$.joint.rotation.x));const Zm=w.rotation.y;pm(pt,k.bodyYaw);const hd=pt.type==="none"?1:.4;if(w.rotation.x+=dt*hd+od,w.rotation.z+=(Nt+Re.sideLean)*hd,Ae>0&&(ht.root.rotation.x-=Me.hipPitch*Ae,q.root.rotation.x-=Me.hipPitch*Ae,ht.joint.rotation.x+=Me.kneeBend*Ae,q.joint.rotation.x+=Me.kneeBend*Ae,x.position.y-=Me.crouchDepth*Ae,v.position.y+=Me.crouchDepth*(1-Me.lowerScale)*Ae,w.rotation.x+=Me.upperPitch*Ae,K.root.rotation.x-=Me.armTuck*Ae,$.root.rotation.x-=Me.armTuck*Ae),po>0&&k.grounded){const te=lw(Z.attackProgress,ln,l.stride),de=po;ht.root.rotation.x+=te.legL.pitchX*de,q.root.rotation.x+=te.legR.pitchX*de,ht.root.rotation.z+=te.legL.rollZ*de,q.root.rotation.z+=te.legR.rollZ*de,ht.joint.rotation.x+=te.legL.kneeX*de,q.joint.rotation.x+=te.legR.kneeX*de,x.position.x+=te.pelvisX*de,x.position.y+=te.pelvisY*de,x.rotation.z+=te.pelvisRoll*de}if(Mm(tn,Z.weapon),d!=null&&d.enabled&&d.autoCounter&&Math.abs(aa)>1e-4&&(x.position.x+=aa),m.enabled){const te=Z.phase!=="idle"&&!Z.charging,de=te?xo(Z.attackProgress):0;te&&Yt>.55&&de<Yt-1e-4&&(Dt=1),Yt=de,Dt=Aw(Dt,ve,m.impactDecay);const gn=Ew({swing:de,charge:Z.charging?Z.charge:0,impact:Dt,speedRatio:ac,grounded:k.grounded},m);St=Tw(St,gn,ve,m.smoothing)}else St={...rh};mm(St),v.rotation.y=xt,me=jp(xt,a.chestYawScale,a.chestYawMaxDeg),w.rotation.y+=me;const jm=Zm;if(mt.rotation.y=Xe(k.headYaw-k.bodyYaw-jm-me),mt.rotation.x=-ue(k.headPitch??0,-.7,.7),w.rotation.x+=-ue(k.bodyPitch??0,-.4,.4),Em(),xm(yt,Z.comboIndex),_m(Z,$m),Z.weapon==="greatsword"&&!Z.charging&&(Z.phase!=="idle"||Ln>0)){y.updateWorldMatrix(!0,!0);const te=Z.phase==="idle"?Math.max(Ln,Oi):1;gm(ue(te,0,1),ve)}if(O=om({root:y,pelvis:x,lower:v,limbs:Mt,base:Hm,cfg:Cs,grounded:k.grounded,attacking:tn}),Tm(k,ve),z&&As){const te=vo();jr=Math.max(Math.abs(te.pitch-As.x),Math.abs(te.yaw-As.y),Math.abs(te.lean-As.z))}else jr=0},lean(){return{forward:dt,side:Nt}},landing(){const k=ff(Wr,Ca,La,Da,go),Z=La>0?Math.max(0,La-Math.max(0,Wr-Ca)):0;return{pulse:k,remaining:Z,kind:k>0?Ts:"none",impactVy:Yh}},hurt(){return bt},ik(){return O},stretch(){return{...St,impact:Dt}},gripDebug(){return{...jt}},weaponDebug(){return{wristPitch:vt,wristTwist:rt}},setClipT(k){Gn=k===null||!Number.isFinite(k)?null:Math.max(0,Math.min(1,k))},stanceDebug(){const k=Q==null?void 0:Q.armR,Z=Q==null?void 0:Q.armL,pt=Q?A:0;return{weapon:Ot??"sword-shield",weight:pt,armL:{pitch:((Z==null?void 0:Z.pitch)??0)*pt,yaw:((Z==null?void 0:Z.yaw)??0)*pt,roll:((Z==null?void 0:Z.roll)??0)*pt,elbow:((Z==null?void 0:Z.elbow)??0)*pt},armR:{pitch:((k==null?void 0:k.pitch)??0)*pt,yaw:((k==null?void 0:k.yaw)??0)*pt,roll:((k==null?void 0:k.roll)??0)*pt,elbow:((k==null?void 0:k.elbow)??0)*pt},torsoYaw:((Q==null?void 0:Q.torsoYaw)??0)*pt,torsoPitch:((Q==null?void 0:Q.torsoPitch)??0)*pt,bladePitchDeg:j*180/Math.PI,bladePitchOffDeg:ut*180/Math.PI,armSwing:(Q==null?void 0:Q.armSwing)??1}},swingDebug(){const k=le;return{seg:sn,kind:(k==null?void 0:k.kind)??"right-left",lead:(k==null?void 0:k.lead)??"R",yaw:(k==null?void 0:k.yaw)??0,rootYaw:(k==null?void 0:k.rootYaw)??0,spinYaw:(k==null?void 0:k.spinYaw)??0,rootTurn:Ni,pitch:(k==null?void 0:k.pitch)??0,roll:(k==null?void 0:k.roll)??0,strike:(k==null?void 0:k.strike)??0,bladeTwist:(k==null?void 0:k.bladeTwist)??0,bladeTwistOff:(k==null?void 0:k.bladeTwistOff)??0,bladeYaw:(k==null?void 0:k.bladeYaw)??0,bladeYawOff:(k==null?void 0:k.bladeYawOff)??0,shoulderL:{x:Be.lx,y:Be.ly,z:Be.lz},shoulderR:{x:Be.rx,y:Be.ry,z:Be.rz}}},attackBlend(){return Oi},attackWeights(){return{gaitScale:Vh,attackLegWeight:po,driveSpeed:Xr.speed,stridePhase:Xr.phase,strideBase:ie,stepIndex:ln}},hipYaw(){return xt},torsoTotal(){return vo()},spineDebug(){if(!z)return null;const k=vo();return{enabled:!0,waistYaw:w.rotation.y,chestYaw:D.rotation.y,totalYaw:k.yaw,totalPitch:k.pitch,totalLean:k.lean,neckPitch:mt.rotation.x,leak:jr}},balanceDebug(){return mo?{...mo,shift:aa,latDeficit:Xh,lateralFf:Jh}:null},gaitDebug(){return{stopT:Gt,hipYaw:xt,chestYaw:me,speed:ce,gaitSpeed:ze,stopStep:ae,stopShift:ge,stopDip:Ne,stopYawFade:Bn,turnStep:W,legTakeover:li,legLPitch:Es.lp,legLRoll:Es.lr,legRPitch:Es.rp,legRRoll:Es.rr}},gaitYaw(){return Wt},arrowDirection(){Pt.updateWorldMatrix(!0,!1);const k=Pt.matrixWorld.elements,Z=k[8],pt=k[9],yt=k[10],Kt=Math.hypot(Z,pt,yt)||1;return{x:Z/Kt,y:pt/Kt,z:yt/Kt}},weaponBlade(){return Ot?yo(gt[Ot].right):null},bladesWorld(){return Ot?{right:yo(gt[Ot].right),left:yo(gt[Ot].left)}:{right:null,left:null}},dispose(){y.traverse(k=>{if(k instanceof _e){k.geometry.dispose();const Z=k.material;Array.isArray(Z)?Z.forEach(pt=>pt.dispose()):Z.dispose()}})}}}function Hw(n){const t=rm(n.voxel,n.colors,n.moveSpeed,n.orientation,n.gait,n.mount,n.lean,n.hurt,n.animation,n.ik,n.links,n.wrist,n.balance),e=new Ce;e.add(t.group);const i={position:{x:0,y:0,z:0},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:1,distance:0,coyoteTime:0,jumpBuffer:0},a=[];for(const s of["headPivot","chest","torsoUpper","torso","pelvis"]){const o=t.group.getObjectByName(s);o&&a.push(o)}return{group:e,update(s,o,r){i.position.x=s.position.x,i.position.y=s.position.y,i.position.z=s.position.z,i.velocity.x=s.velocity.x,i.velocity.y=s.velocity.y,i.velocity.z=s.velocity.z,i.facing=s.facing,i.moveYaw=Math.atan2(i.velocity.x,i.velocity.z),i.bodyYaw=s.bodyYaw,i.headYaw=s.headYaw,i.gaitPhase=s.gaitPhase,i.stride=s.stride,i.distance=s.distance,i.grounded=!0,i.sprinting=!1,e.position.set(s.position.x,s.position.y,s.position.z),e.rotation.y=s.bodyYaw,s.combat&&t.update(i,s.combat,s.hurt,o,!1,r,s.link)},debug(){return t.gaitDebug()},boneAtWorld(s,o,r){if(a.length===0)return null;const l=new B(s,o,r),c=new B;let h=null,u=Number.POSITIVE_INFINITY;for(const d of a){d.updateWorldMatrix(!0,!1),d.getWorldPosition(c);const f=c.distanceToSquared(l);f<u&&(u=f,h=d)}return h?{node:h,point:l}:null},dispose(){t.dispose()}}}const ga=.012,xa=.016;function Gw(n,t){const e=t.lab,i=new Ce;i.name="test-lab";const a=[],s=[],o=[],r=[];function l(y){return o.push(y),y}function c(y){return r.push(y),y}function h(y,x,v,w=ga){const S=l(new un({color:x,transparent:!0,opacity:v,depthWrite:!1,side:Ke,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),T=new _e(y,S);return T.rotation.x=-Math.PI/2,T.position.y=w,T.renderOrder=2,T}function u(y,x){return c(new fs(Math.max(y,.001),x,72))}function d(y,x,v,w=xa){const T=document.createElement("canvas"),E=T.getContext("2d");if(!E)return new _e;const b='700 96px "Noto Sans SC", ui-monospace, Menlo, monospace';E.font=b,T.width=nu.ceilPowerOfTwo(Math.ceil(E.measureText(y).width)+32),T.height=nu.ceilPowerOfTwo(96*1.4);const M=T.getContext("2d");if(!M)return new _e;M.font=b,M.textAlign="center",M.textBaseline="middle",M.fillStyle=v,M.fillText(y,T.width/2,T.height/2);const R=new ih(T);R.colorSpace=En,s.push(R);const C=T.width/T.height,z=c(new Yn(x*C,x)),N=l(new un({map:R,transparent:!0,depthWrite:!1,side:Ke,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3})),D=new _e(z,N);return D.rotation.x=-Math.PI/2,D.position.y=w,D.renderOrder=3,D}function f(y,x,v,w,S,T){const E=v-x,b=c(new Yn(E,w)),M=h(b,S,T,ga);M.position.set(E/2+x,ga,0);const R=new Ce;return R.add(M),R.rotation.y=y-Math.PI/2,R}function g(y,x,v,w,S){const T=new Up;T.moveTo(0,x*.5),T.lineTo(-v*.5,x*.5-v*.9),T.lineTo(-v*.18,x*.5-v*.9),T.lineTo(-v*.18,-x*.5),T.lineTo(v*.18,-x*.5),T.lineTo(v*.18,x*.5-v*.9),T.lineTo(v*.5,x*.5-v*.9),T.closePath();const E=c(new Nh(T)),b=h(E,w,S,ga+.002),M=new Ce;return M.add(b),M.rotation.y=y+Math.PI,M}function _(y){var E;const x=new Ce,v=d(`${y.index} · ${y.name}`,t.lab.labelTextHeight,"#eaf4ff"),S=((E=v.geometry.parameters)==null?void 0:E.width)??3;x.add(v);const T=h(c(new Yn(S*.98,.08)),y.color,.7,xa);return T.position.set(0,xa,t.lab.labelTextHeight*.66),x.add(T),x.position.set(y.labelX,0,y.labelZ),x}const m=new Ce;for(const y of n??[]){const x=new Ce;if(x.position.set(y.x,0,y.z),y.shape==="square"){const v=y.radius,w=h(c(new Yn(v*2,v*2)),y.color,e.padOpacity*.09);x.add(w);const S=.07,T=[[0,v,v*2+S,S],[0,-v,v*2+S,S],[-v,0,S,v*2+S],[v,0,S,v*2+S]];for(const[E,b,M,R]of T){const C=h(c(new Yn(M,R)),y.color,e.padOpacity);C.position.x=E,C.position.z=b,x.add(C)}}else x.add(h(c(new Ih(y.radius,72)),y.color,e.padOpacity*.075)),x.add(h(u(y.radius-.075,y.radius),y.color,e.padOpacity));if(y.id==="hub"){for(let v=0;v<4;v++){const w=v*Math.PI/4,S=v%2===0;for(const T of[0,Math.PI])x.add(f(w+T,y.radius*.12,y.radius*.94,S?.09:.055,y.color,S?.5:.32))}x.add(h(u(.5,.56),y.color,.4))}else if(y.id==="dash"){const v=y.spawnZ-y.z,w=-y.radius+.5,S=v-w,T=h(c(new Yn(.06,S)),y.color,.36);T.position.set(0,ga,(v+w)/2),x.add(T);let E=0;for(let M=v;M>=w-.01;M-=1,E++){const R=E%5===0,C=h(c(new Yn(R?2.4:1.3,R?.1:.07)),y.color,R?.72:.42);C.position.set(0,ga,M),x.add(C);const z=d(String(E),.52,R?"#eaf4ff":"rgba(200,225,245,0.8)");z.position.set(1.6,xa,M),x.add(z)}const b=[[3.2,"翻滚 3.2"],[5,"闪现 5.0"]];for(const[M,R]of b){const C=v-M,z=h(c(new Yn(1.9,.09)),"#ffffff",.5);z.position.set(-1.5,ga,C),x.add(z);const N=d(R,.42,"rgba(220, 236, 250, 0.86)");N.position.set(-3,xa,C),x.add(N)}}else if(y.id==="gait"){x.add(h(u(1.44,1.5),y.color,.5)),x.add(h(u(1.14,1.2),y.color,.22));const v=1.55,w=[[0,"180° 正后退","#ff9a8a"],[Math.PI/4,"135° 斜后","#ffd166"],[Math.PI/2,"90° 正侧移","#8fe7ff"]];for(const[S,T,E]of w){const M=Math.sin(S),R=Math.cos(S),C=g(S,1.7,.34,E,.75);C.position.set(M*1.7*.5,0,v+R*1.7*.5),x.add(C);const z=d(T,.44,E);z.position.set(M*(1.7+.7),xa,v+R*(1.7+.7)),x.add(z)}}if(m.add(x),e.showLabels){const v=_(y);a.push(v),m.add(v)}}i.add(m);const p=n==null?void 0:n.find(y=>y.id==="hub");if(p&&e.showLabels){const y=[[0,-1,"屏上"],[0,1,"屏下"],[-1,0,"屏左"],[1,0,"屏右"]];for(const[x,v,w]of y){const S=d(w,.4,"rgba(190, 224, 248, 0.8)");S.position.set(p.x+x*(p.radius+.7),xa,p.z+v*(p.radius+.7)),i.add(S),a.push(S)}}return i.visible=e.enabled,{group:i,setVisible(y){i.visible=y},setLabelsVisible(y){for(const x of a)x.visible=y},dispose(){for(const y of r)y.dispose();for(const y of o)y.dispose();for(const y of s)y.dispose();i.clear()}}}const We={groundArea:12,ringHalo:20,ring:22,ringMeter:24,ringWarn:26,groundFx:30,trail:40,slash:44,projectileTrail:46,projectile:48,projectileGlow:50};function xf(n,t){n.renderOrder=t,n.traverse(e=>{e.renderOrder=t})}function Qc(n,t,e){const i=Array.from({length:t.count},()=>{const a=new un({color:t.color,transparent:!0,opacity:0,side:Ke,depthWrite:!1,...t.blending?{blending:t.blending}:{}}),s=new _e(t.geometry,a);return s.rotation.x=-Math.PI/2,s.renderOrder=t.renderOrder,s.visible=!1,n.add(s),{mesh:s,mat:a,life:0,base:1,delay:0}});return{entries:i,spawn(a,s,o,r,l){const c=i.find(h=>h.life<=0)??i[0];l!=null&&l.color&&c.mat.color.set(l.color),c.mesh.position.set(a,e(a,s,o)+t.yOffset,s),c.base=r,c.mesh.scale.setScalar(r*t.scaleFrom),c.mesh.visible=!0,c.mat.opacity=t.spawnOpacity,c.life=t.duration,c.delay=(l==null?void 0:l.delay)??0},update(a){for(const s of i){if(s.life<=0)continue;if(s.delay>0){s.delay-=a;continue}s.life-=a;const o=Math.max(0,s.life/Math.max(t.duration,1e-6));s.mesh.scale.setScalar(s.base*(t.scaleFrom+t.scaleSpan*(1-Math.pow(o,t.growPow)))),s.mat.opacity=t.peak*Math.pow(o,t.fadePow),s.life<=0&&(s.mesh.visible=!1)}},live(){return i.filter(a=>a.life>0)},dispose(){for(const a of i)a.mat.dispose()}}}function Vw(n,t,e,i){const a=t.dash,s={count:6,geometry:new fs(a.ringRadius-.06,a.ringRadius,28),color:"#ffffff",renderOrder:We.groundFx,duration:a.fxDuration,peak:.9,fadePow:1,scaleFrom:.6,scaleSpan:1.2,growPow:1,yOffset:.04,spawnOpacity:.9},o=Qc(n,s,i),r=t.links,l={count:5,geometry:new fs(r.ringRadius-.07,r.ringRadius,28),color:r.chargeColor,renderOrder:We.groundFx,duration:r.fxDuration,peak:.85,fadePow:1,scaleFrom:.55,scaleSpan:1.1,growPow:1,yOffset:.05,spawnOpacity:.85},c=Qc(n,l,i),h=t.groundSlam,u={count:4,geometry:new fs(.78,1,56),color:h.color,blending:Di,renderOrder:We.groundFx+1,duration:h.duration,peak:.85,fadePow:1.3,scaleFrom:.35,scaleSpan:.65,growPow:1.8,yOffset:.035,spawnOpacity:0},d=Qc(n,u,i);let f=e.dash.id,g="none",_=e.playerLink.id,m=e.playerLink.hitIds.length,p=e.combat.slamAttackId,y=0;return{update(x,v,w){var E;const S=x.character;if(x.dash.id!==f){f=x.dash.id;const b=x.dash;g=b.kind,b.kind==="blink"?(o.spawn(b.fromX,b.fromZ,S.position.y,.9,{color:a.blinkColor}),o.spawn(b.toX,b.toZ,S.position.y,1.35,{color:a.blinkColor})):o.spawn(b.fromX,b.fromZ,S.position.y,1.1,{color:a.rollColor})}if(o.update(v),x.combat.slamAttackId!==p&&(p=x.combat.slamAttackId,y+=1,h.enabled)){const b=(E=x.config.combat.weapons[x.combat.weapon])==null?void 0:E.groundSlam,M=Math.max(.6,(b==null?void 0:b.radius)??2.2);d.spawn(S.position.x,S.position.z,S.position.y,M,{delay:0}),d.spawn(S.position.x,S.position.z,S.position.y,M*h.outerScale,{delay:h.delay}),w(h.shake)}d.update(v);const T=x.playerLink;T.id!==_&&(_=T.id,m=T.hitIds.length,c.spawn(S.position.x,S.position.z,S.position.y,1)),T.hitIds.length>m?(m=T.hitIds.length,c.spawn(S.position.x,S.position.z,S.position.y,1.35)):T.hitIds.length<m&&(m=T.hitIds.length),c.update(v)},slamDebug(){return{spawns:y,lastId:p,live:d.live().map(x=>({life:x.life,scale:x.mesh.scale.x,opacity:x.mat.opacity,visible:x.mesh.visible}))}},groundOrder(){var x;return((x=d.entries[0])==null?void 0:x.mesh.renderOrder)??We.groundFx+1},activeDash(){return o.live().length},dashKind(){return g},dispose(){o.dispose(),c.dispose(),d.dispose();for(const x of[s.geometry,l.geometry,u.geometry])x.dispose()}}}const Hh=64,cm=[0,.24,.76,1],Xw=[0,1,1,0],lm=[0,.12,.28,.5,.72,.88,1],Ww=[0,.16,.5,1,.5,.16,0];function vf(n,t){if(t<=1e-6)return 1;const e=Math.min(1,Math.max(0,n/t));return e*e*(3-2*e)}function Gh(n,t,e,i,a=Hh,s="band"){const o=Math.max(.001,n-t*.5),r=Math.max(o+.001,n+t*.5),l=s==="glow"?lm:cm,c=s==="glow"?Ww:Xw,h=l.length,u=a+1,d=new Float32Array(u*h*3),f=new Float32Array(u*h*4),g=[];for(let m=0;m<u;m++){const p=m/a,y=(p-.5)*e,x=vf(p,i)*vf(1-p,i),v=Math.sin(y),w=Math.cos(y);for(let S=0;S<h;S++){const T=o+(r-o)*l[S],E=m*h+S;d[E*3]=v*T,d[E*3+1]=0,d[E*3+2]=w*T;const b=x*c[S];f[E*4]=1,f[E*4+1]=1,f[E*4+2]=1,f[E*4+3]=b}}for(let m=0;m<a;m++)for(let p=0;p<h-1;p++){const y=m*h+p,x=y+h;g.push(y,x,y+1,y+1,x,x+1)}const _=new an;return _.setAttribute("position",new pn(d,3)),_.setAttribute("color",new pn(f,4)),_.setIndex(g),_.computeBoundingSphere(),_}function tl(n){const t=new un({color:n.color,transparent:!0,opacity:n.opacity,depthWrite:!1,side:Ke,vertexColors:!0,toneMapped:!1}),e=new Map;let i=null;const a=(l,c)=>{const h=Math.round(l*32)/32,u=Math.max(.05,Math.round(c*20)/20),d=`${Math.round(h*32)}|${Math.round(u*20)}`,f=e.get(d);if(f)return f;const g=Gh(n.radius,n.thickness*u,h,n.edgeFade,Hh,n.profile??"band");if(e.set(d,g),e.size>64){for(const[_,m]of e)if(_!==d&&m!==i){m.dispose(),e.delete(_);break}}return g};i=a(n.arcRad,1);const s=new _e(i,t);s.position.y=n.y,s.renderOrder=n.renderOrder??4;let o=n.arcRad,r=1;return{mesh:s,update(l,c,h,u,d,f=1){const g=Math.max(.05,f);(Math.abs(l-o)>.01||Math.abs(g-r)>.01)&&(i=a(l,g),s.geometry=i,o=l,r=g),t.opacity=c,t.color.copy(u),s.scale.set(h,1,h),s.rotation.y=d,s.visible=c>.002},arcRad(){return o},dispose(){for(const l of e.values())l.dispose();e.clear(),t.dispose()}}}function yf(n,t){return Math.max(.05,n*.5*Math.max(.1,t))}function Yw(n,t,e,i,a){const s=a.arcDeg*Math.PI/180,o=a.playerOpacity;if(!n)return{arcRad:s,opacity:o,scale:1,level:0};const r=Math.min(1,Math.max(0,t)),l=Math.min(1,Math.max(0,e)),c=a.selectedArcDeg*Math.PI/180,h=s+(c-s)*(.35+.65*r),u=4+4*r+6*l,d=.5+.5*Math.sin(i*u),f=Math.min(.95,o+(.2+.1*l)*r+.04*d),g=1+.02*r+.012*d*r;return{arcRad:h,opacity:f,scale:g,level:r}}function $w(n,t,e,i,a){const s=Math.min(1,Math.max(0,a));return s<=.001?n.copy(t):s<.5?n.copy(t).lerp(e,s*2):n.copy(e).lerp(i,(s-.5)*2)}function Zw(n=64,t=.06,e=5){const i=n+1,a=e+1,s=new Float32Array(i*a*3),o=new Float32Array(i*a*4),r=[];for(let c=0;c<i;c++){const h=c/n*Math.PI*2,u=Math.sin(h),d=Math.cos(h);for(let f=0;f<a;f++){const g=f/e,_=t+(1-t)*g,m=c*a+f;s[m*3]=u*_,s[m*3+1]=0,s[m*3+2]=d*_;const p=Math.pow(1-g,1.8)*.9+(f===0?.1:0);o[m*4]=1,o[m*4+1]=1,o[m*4+2]=1,o[m*4+3]=Math.min(1,p)}}for(let c=0;c<n;c++)for(let h=0;h<e;h++){const u=c*a+h,d=u+a;r.push(u,d,u+1,u+1,d,d+1)}const l=new an;return l.setAttribute("position",new pn(s,3)),l.setAttribute("color",new pn(o,4)),l.setIndex(r),l.computeBoundingSphere(),l}function _f(n){const t=n.segments??Hh,e=n.profile??"band",a=((e==="glow"?lm.length:cm.length)-1)*6,s=Gh(n.radius,n.thickness,n.arcRad,n.edgeFade,t,e),o=new un({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ke,vertexColors:!0,toneMapped:!1}),r=new _e(s,o);r.position.y=n.y,r.renderOrder=n.renderOrder??7,r.visible=!1,s.setDrawRange(0,0);let l=0;return{mesh:r,set(c,h,u,d,f=1){const g=Math.min(1,Math.max(0,c)),_=Math.round(g*t),m=g>.001?Math.max(1,_)*a:0;m!==s.drawRange.count&&s.setDrawRange(0,m),l=_,o.opacity=h,o.color.copy(u),r.scale.set(f,1,f),r.rotation.y=d,r.visible=h>.002&&g>.001},ratio(){return t>0?l/t:0},filledSegments(){return l},dispose(){s.dispose(),o.dispose()}}}function Mf(n){const t=new Ce,e=Zw(48),i=new un({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ke,vertexColors:!0,toneMapped:!1}),a=new _e(e,i);a.renderOrder=n.renderOrder??2,t.add(a);const s=Math.max(.01,n.edgeWidthRatio??.045),o=Gh(1-s*.5,s,Math.PI*2,0,64,"band"),r=new un({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ke,vertexColors:!0,toneMapped:!1}),l=new _e(o,r);return l.renderOrder=(n.renderOrder??2)+1,t.add(l),t.position.y=n.y,{group:t,set(c,h,u,d,f,g){const _=Math.min(1,Math.max(0,f));t.position.set(c,u,h),a.scale.set(d,1,d),l.scale.set(d,1,d),i.opacity=_*.26,r.opacity=_*(.72+.18*Math.sin(g*7)),t.visible=_>.004},dispose(){e.dispose(),i.dispose(),o.dispose(),r.dispose()}}}function bf(n,t,e,i){if(i<=1e-4||e<=0)return t;const a=1-Math.exp(-e/i);return n+(t-n)*a}function jw(n,t,e){if(n!=="windup")return{active:!1,ratio:0,urgency:0};const i=Math.max(1e-4,e),a=Math.min(1,Math.max(0,t/i));return{active:!0,ratio:a,urgency:.35+.65*a}}function qw(n){if(n.charging)return{source:"charge",ratio:Math.min(1,Math.max(0,n.charge))};if(n.channeling){if(n.channelProgress!==void 0)return{source:"channel",ratio:Math.min(1,Math.max(0,n.channelProgress))};const i=Math.max(1e-4,n.fireInterval);return{source:"channel",ratio:1-Math.min(1,Math.max(0,n.fireTimer/i))}}const t=n.arcaneCooldown??0,e=n.arcaneCooldownMax??0;return t>0&&e>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,t/e))}:n.dashCooldown>0&&n.dashCooldownMax>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,n.dashCooldown/n.dashCooldownMax))}:{source:"none",ratio:0}}function Kw(n,t,e,i,a,s){return n!=="windup"||a<=.05?{active:!1,x:t,z:e,radius:0}:{active:!0,x:t+Math.sin(i)*a,z:e+Math.cos(i)*a,radius:Math.max(.3,s)}}function Jw(n,t){const e=Math.max(.02,t),i=Math.min(1,Math.max(0,n/e));return{scale:.06+.94*(1-Math.pow(1-i,3)),alpha:i}}function Qw(n,t,e){return n?t:e}function hm(n){return{x:0,y:0,z:1}}function tE(n){return Math.asin(hm().y)}function eE(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}const nE=Math.PI/3;function Sf(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function iE(){let n=0,t=!1;return{update(e,i,a,s=nE){if(!Number.isFinite(e))return n;if(!t)return t=!0,n=e,n;if(!(a>0)||!(i>0))return n=e,n;const o=Sf(e-n);if(Math.abs(o)>=s)return n=e,n;const r=1-Math.exp(-i/(a/1e3));return n=Sf(n+o*r),n},reset(e){t=!0,n=e},get value(){return n},get ready(){return t}}}function aE(n){const t=Math.max(2,Math.floor(n.maxSamples)),e=new an,i=new Float32Array(t*2*3),a=new Float32Array(t*2*3),s=new pn(i,3),o=new pn(a,3);s.setUsage(Qd),o.setUsage(Qd),e.setAttribute("position",s),e.setAttribute("color",o);const r=[];for(let x=0;x<t-1;x++){const v=x*2,w=v+1,S=v+2,T=v+3;r.push(v,w,S,w,T,S)}e.setIndex(r),e.setDrawRange(0,0);const l=new un({vertexColors:!0,transparent:!0,opacity:1,blending:Di,depthWrite:!1,side:Ke}),c=new _e(e,l);c.frustumCulled=!1,c.renderOrder=6,c.visible=!1;const h=new ne(n.color);let u=[],d=null,f=0,g=0,_=!1,m=!1,p=0;function y(){const x=u.length;if(x<2||!n.enabled){c.visible=!1,e.setDrawRange(0,0);return}const v=Math.max(.001,n.life);for(let w=0;w<x;w++){const S=u[w],T=Math.max(0,1-S.age/v),E=T*T,b=Math.min(1,S.speed/Math.max(.001,n.minSpeed*2)),M=n.intensity*E*(.55+.45*b)*(1+p),R=.18+.82*T,C=w*6;i[C]=S.tx+(S.bx-S.tx)*R,i[C+1]=S.ty+(S.by-S.ty)*R,i[C+2]=S.tz+(S.bz-S.tz)*R,i[C+3]=S.tx,i[C+4]=S.ty,i[C+5]=S.tz;const z=h.r*M,N=h.g*M,D=h.b*M,L=z*.22,F=N*.22,H=D*.22;a[C]=L,a[C+1]=F,a[C+2]=H;const Y=1+n.tipBoost;a[C+3]=Math.min(1,z*Y),a[C+4]=Math.min(1,N*Y),a[C+5]=Math.min(1,D*Y)}s.needsUpdate=!0,o.needsUpdate=!0,e.setDrawRange(0,(x-1)*6),c.visible=!0}return{object:c,update(x,v,w){if(!n.enabled){c.visible=!1;return}const S=Math.max(0,x);p*=Math.exp(-Math.max(1,n.pulseDecay??14)*S),p<.001&&(p=0);for(const T of u)T.age+=S;for(;u.length>0&&u[0].age>n.life;)u.shift();if(v){const T=d?Math.hypot(v.tip.x-d.x,v.tip.y-d.y,v.tip.z-d.z)/Math.max(1e-4,S):0,E=u[u.length-1],b=E?Math.hypot(v.tip.x-E.tx,v.tip.y-E.ty,v.tip.z-E.tz):1/0;if(w&&b>=n.minStep)for(u.push({bx:v.base.x,by:v.base.y,bz:v.base.z,tx:v.tip.x,ty:v.tip.y,tz:v.tip.z,age:0,speed:T});u.length>t;)u.shift();d={x:v.tip.x,y:v.tip.y,z:v.tip.z},f=T,g=b,_=!0}else d=null,_=!1,f=0,g=0;m=w,y()},debug(){return{count:u.length,visible:c.visible,speed:f,moved:g,hasBlade:_,active:m,pulse:p}},pulse(x){!Number.isFinite(x)||x<=0||(p=Math.min(1.5,p+x))},reset(){u=[],d=null,p=0,c.visible=!1,e.setDrawRange(0,0)},dispose(){e.dispose(),l.dispose()}}}function sE(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function oE(n,t,e,i){var Ge,ln;const a=Math.max(1,n.clientWidth),s=Math.max(1,n.clientHeight),o=new pS({antialias:!0});o.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),o.shadowMap.enabled=!0,o.shadowMap.type=ep,o.setSize(a,s,!1),n.appendChild(o.domElement);const r=new mS;r.background=new ne("#12161d"),r.add(new qS(11061486,2764600,1.15));const l=new QS(16773852,1.5);l.position.set(9,18,11),l.castShadow=!0,l.shadow.mapSize.set(1024,1024);const c=l.shadow.camera;c.left=-20,c.right=20,c.top=20,c.bottom=-20,c.near=1,c.far=60,r.add(l);const h=[],u=new Ce;for(const V of t.boxes){const wt=V.maxX-V.minX,Tt=V.maxY-V.minY,Qt=V.maxZ-V.minZ;let fe=sE(V.kind,e);V.kind==="step"&&(fe=new ne(fe).offsetHSL(0,0,V.maxY*.09).getStyle());const ae=new co({color:fe,transparent:!1,opacity:1}),ge=new _e(new ci(wt,Tt,Qt),ae);ge.position.set((V.minX+V.maxX)/2,(V.minY+V.maxY)/2,(V.minZ+V.maxZ)/2),ge.castShadow=V.kind!=="ground",ge.receiveShadow=!0,ge.add(new Dp(new LS(ge.geometry),new Lh({color:10467020,transparent:!0,opacity:.32}))),u.add(ge),h.push(ae)}r.add(u);const d=t.gridMeta.maxX-t.gridMeta.minX,f=new ew(d,d,4873328,3358797);f.position.y=.002,f.visible=e.showGrid,r.add(f);const g=Gw(i,e);r.add(g.group);const _=V=>rm((V==null?void 0:V.voxel)??e.voxel,V!=null&&V.colors?{...e.colors,...V.colors}:e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links,e.weaponWrist,e.balance);let m="standard",p=_((Ge=e.bodyTypes)==null?void 0:Ge[m]);const y=aE(e.weaponTrail);xf(y.object,We.trail),r.add(y.object);const x=new Ce,v=.9,w=new Ce;w.position.y=v,p.group.position.y=-v,w.add(p.group),x.add(w),r.add(x);const S=iE();let T=0;const E=((ln=t.config.dummies.fighters)==null?void 0:ln.moveSpeed)??t.config.dummies.moveSpeed,b=t.dummies.map((V,wt)=>{const Tt=e.dummies.colors,Qt=Tt[wt%Tt.length]??"#cccccc";let fe;if(V.weapon){const ae=e.dummies.fighterColors,ge=ae&&ae.length>0?ae[(wt-t.config.dummies.count)%ae.length]:void 0;fe=Hw({voxel:e.voxel,colors:ge?{...e.colors,...ge}:e.colors,moveSpeed:E,orientation:e.orientation,gait:e.gait,mount:e.weaponMount,lean:e.lean,hurt:e.hurt,animation:e.animation,ik:e.ik,links:e.links,wrist:e.weaponWrist,balance:e.balance})}else{const ae=yw(e.voxel,e.colors,Qt,V.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);fe={group:ae.group,update:(ge,Ne)=>ae.update(ge,Ne),boneAtWorld:(ge,Ne,ze)=>ae.boneAtWorld(ge,Ne,ze),dispose:()=>ae.dispose()}}return fe.group.traverse(ae=>{ae.userData.dummyId=V.id}),r.add(fe.group),fe}),M=b.map(V=>V.group),R=new tw,C=e.groundRing,z=e.voxel.bodyWidth,N=yf(z,C.playerRadiusFactor),D=yf(z,C.dummyRadiusFactor),L=z*C.thicknessFactor,F=C.arcDeg*Math.PI/180;let H=0;const Y=(V,wt,Tt)=>R0(t.boxes,V,wt,Tt+.55,0),it=tl({radius:N,thickness:L,arcRad:F,edgeFade:C.edgeFade,color:C.playerColor,opacity:C.playerOpacity,y:.028,renderOrder:We.ring});it.mesh.name="player-ground-ring",r.add(it.mesh);const mt=t.dummies.map(V=>{const wt=tl({radius:D,thickness:L,arcRad:F,edgeFade:C.edgeFade,color:C.neutralColor,opacity:C.opacity,y:.022,renderOrder:We.ring});return wt.mesh.name=`dummy-ground-ring-${V.id}`,r.add(wt.mesh),wt}),_t=t.dummies.map(V=>{const wt=tl({radius:D*C.haloRadiusFactor,thickness:L*C.haloThicknessFactor,arcRad:F,edgeFade:C.edgeFade,color:C.neutralColor,opacity:0,profile:"glow",y:.019,renderOrder:We.ringHalo});return wt.mesh.name=`dummy-ground-halo-${V.id}`,r.add(wt.mesh),wt}),Lt=t.dummies.map(()=>0),J=t.dummies.map(()=>0),et=_f({radius:N*C.meterRadiusFactor,thickness:L*C.meterThicknessFactor,arcRad:F,edgeFade:.06,color:C.meterColorCharge,y:.03,renderOrder:We.ringMeter});et.mesh.name="player-ground-meter",r.add(et.mesh);const ht=t.dummies.map(V=>{const wt=_f({radius:D*C.warnRadiusFactor,thickness:L*C.warnThicknessFactor,arcRad:F,edgeFade:.02,color:C.warnColor,y:.031,renderOrder:We.ringWarn});return wt.mesh.name=`dummy-ground-warn-${V.id}`,r.add(wt.mesh),wt}),q=Mf({color:C.playerColor,y:.042,renderOrder:We.groundArea});q.group.name="player-landing-preview",r.add(q.group);const K=new ne,$=new ne(C.playerColor),Mt=new ne(C.neutralColor),It=new ne(C.lowThreatColor),Ct=new ne(C.highThreatColor),Ut=new ne(C.meterColorCharge),G=new ne(C.meterColorChannel),re=new ne(C.meterColorCooldown),Ht=new ne(C.warnColor),Pt=new Ce;r.add(Pt);const gt=e.projectiles;function zt(){const wt=document.createElement("canvas");wt.width=64,wt.height=64;const Tt=wt.getContext("2d");if(Tt){const fe=Tt.createRadialGradient(32,32,0,32,32,32);fe.addColorStop(0,"rgba(255,255,255,1)"),fe.addColorStop(.28,"rgba(255,255,255,0.72)"),fe.addColorStop(.62,"rgba(255,255,255,0.22)"),fe.addColorStop(1,"rgba(255,255,255,0)"),Tt.fillStyle=fe,Tt.fillRect(0,0,64,64)}const Qt=new ih(wt);return Qt.colorSpace=En,Qt}function Ot(){const Tt=document.createElement("canvas");Tt.width=2,Tt.height=64;const Qt=Tt.getContext("2d");if(Qt){const ae=Qt.createLinearGradient(0,0,0,64);ae.addColorStop(0,"rgba(255,255,255,0)"),ae.addColorStop(.55,"rgba(255,255,255,0.35)"),ae.addColorStop(1,"rgba(255,255,255,0.95)"),Qt.fillStyle=ae,Qt.fillRect(0,0,2,64)}const fe=new ih(Tt);return fe.colorSpace=En,fe}const I=zt(),A=Ot(),j=new un({color:12577023,transparent:!0,opacity:0,side:Ke,depthWrite:!1}),ut=new un({color:14217983,transparent:!0,opacity:0,side:Ke,depthWrite:!1,blending:Di}),Q=new Ce;Q.position.set(0,.95,.72),Pt.add(Q);const ct=new Ce;ct.rotation.x=tE(e.camera.pitchDeg),Q.add(ct);const kt=new Gr(.78,gt.slashThickness,6,28,Math.PI*1.15),tt=new Ce,dt=new _e(kt,j),Nt=new _e(kt,ut);Nt.scale.setScalar(1.09),xf(tt,We.slash),Nt.renderOrder=We.slash+1,tt.add(dt,Nt),ct.add(tt);const at=new ci(gt.arrowWidth,gt.arrowWidth,gt.arrowLength),bt=new zh(gt.arrowHeadSize*.42,gt.arrowHeadSize,4);bt.rotateX(Math.PI/2);const O=new ci(gt.arrowWidth*2.6,gt.arrowWidth*.4,.1),lt=new ao(gt.arrowWidth*.45,gt.arrowWidth*1.3,gt.trailLength,6,1,!0);lt.rotateX(-Math.PI/2),lt.translate(0,0,-gt.trailLength/2);const xt=Array.from({length:10},()=>{const V=new Ce,wt=new un({color:gt.arrowColor,transparent:!0}),Tt=new un({color:gt.arrowHeadColor,transparent:!0}),Qt=new nh({map:I,color:gt.arrowColor,transparent:!0,opacity:.85,blending:Di,depthWrite:!1}),fe=new un({color:gt.arrowTrailColor,map:A,transparent:!0,opacity:0,blending:Di,depthWrite:!1,side:Ke}),ae=new _e(at,wt),ge=new _e(bt,Tt);ge.position.z=gt.arrowLength/2+gt.arrowHeadSize*.42;const Ne=new _e(O,Tt),ze=new _e(O,Tt);Ne.position.z=-gt.arrowLength/2+.08,ze.position.z=Ne.position.z,ze.rotation.z=Math.PI/2;const Le=new qu(Qt);Le.scale.setScalar(gt.arrowGlowSize),Le.renderOrder=We.projectileGlow;const be=new _e(lt,fe);return be.renderOrder=We.projectileTrail,ae.renderOrder=We.projectile,ge.renderOrder=We.projectile,Ne.renderOrder=We.projectile,ze.renderOrder=We.projectile,V.add(ae,ge,Ne,ze,Le,be),V.visible=!1,r.add(V),{group:V,shaftMat:wt,tipMat:Tt,glowMat:Qt,trailMat:fe,glow:Le,trail:be,arrowId:0,bone:null}}),Wt=new Uh(1,0),Gt=new B(gt.boltShapeX,gt.boltShapeY,gt.boltShapeZ),qt=new un({color:gt.boltColor,transparent:!0,opacity:.98,depthWrite:!1}),U=new nh({map:I,color:gt.boltGlowColor,transparent:!0,opacity:.45,blending:Di,depthWrite:!1}),At=new un({color:gt.boltGlowColor,map:A,transparent:!0,opacity:gt.trailOpacity,blending:Di,depthWrite:!1,side:Ke}),nt=new ao(.5,.03,gt.boltTrailScale,6,1,!0);nt.rotateX(-Math.PI/2),nt.translate(0,0,-gt.boltTrailScale/2);const ft=Array.from({length:24},()=>{const V=new Ce,wt=new _e(Wt,qt);wt.scale.copy(Gt);const Tt=new qu(U);Tt.scale.setScalar(gt.boltGlowScale),Tt.renderOrder=We.projectileGlow;const Qt=new _e(nt,At);return Qt.renderOrder=We.projectileTrail,wt.renderOrder=We.projectile,V.add(wt,Tt,Qt),V.visible=!1,r.add(V),{group:V,core:wt}}),Rt=Array.from({length:6},()=>{const V=Mf({color:"#9ad0ff",edgeWidthRatio:.038,y:.045,renderOrder:We.groundArea});return V.group.visible=!1,r.add(V.group),V}),Et=Vw(r,e,t,Y),Vt=iw(e.camera,e.smartCamera,e.zoom,a/s),ce=t.character.position;Vt.update(ce.x,ce.y,ce.z,1,t.camera);function me(V,wt){if(M.length===0)return 0;const Tt=o.domElement.getBoundingClientRect(),Qt=new $t((V-Tt.left)/Tt.width*2-1,-((wt-Tt.top)/Tt.height)*2+1);R.setFromCamera(Qt,Vt.camera);const fe=R.intersectObjects(M,!0);for(const ae of fe){const ge=ae.object.userData.dummyId;if(ge&&ge>0)return ge}return 0}function ie(V,wt,Tt){const Qt=o.domElement.getBoundingClientRect(),fe=new B(V,wt,Tt).project(Vt.camera);return{x:Qt.left+(fe.x*.5+.5)*Qt.width,y:Qt.top+(-fe.y*.5+.5)*Qt.height}}let Ee=!1;return{balanceDebug(){return p.balanceDebug()},spineDebug(){return p.spineDebug()},gaitDebug(){return p.gaitDebug()},trailDebug(){return y.debug()},stretchDebug(){const V=p.stretch();return{arm:V.arm,leg:V.leg,torso:V.torso,impact:V.impact}},swingDebug(){return p.swingDebug()},stanceDebug(){return p.stanceDebug()},bladeWorld(){return p.weaponBlade()},bladesWorld(){return p.bladesWorld()},slamDebug(){return Et.slamDebug()},yawDebug(){var V;return{target:T,shown:S.value,tauMs:((V=e.renderInterp)==null?void 0:V.yawSmoothMs)??0}},fxDebug(){var V,wt;return{boxOpaque:h.every(Tt=>!Tt.transparent),boxCount:h.length,orders:{ring:it.mesh.renderOrder,groundFx:Et.groundOrder(),trail:y.object.renderOrder,slash:tt.renderOrder,projectile:((wt=(V=xt[0])==null?void 0:V.group.children[0])==null?void 0:wt.renderOrder)??-1}}},renderPose(){return{x:x.position.x,y:x.position.y,z:x.position.z,bodyYaw:x.rotation.y}},projectPoint(V,wt,Tt){return ie(V,wt,Tt)},setClipT(V){p.setClipT(V)},weaponDebug(){return p.weaponDebug()},gripDebug(){return p.gripDebug()},render(V,wt){var Bt;const Tt=V.character,Qt=V.combat,fe=e.hitstop.enabled&&V.combat.hitstop>0,ae=wt*Math.max(0,Math.min(4,Qt.warp??1));if(fe&&!Ee){const vt=Math.max(0,V.combat.hitstop),rt=Math.max(0,Math.min(1,vt/.1));Vt.addShake(.34+rt*.48);let Ft=null;for(let se=0;se<V.events.length;se++){const oe=V.events[se];if(oe.type==="hit"){Ft=oe;break}}Ft&&Vt.addKick(Ft.x-Tt.position.x,Ft.z-Tt.position.z,.03+rt*.05)}Ee=fe;for(let vt=0;vt<V.events.length;vt++){const rt=V.events[vt];if(rt.type!=="notify")continue;const Ft=Number.isFinite(rt.value)?rt.value:0;if(rt.name==="blade-air"){const se=Math.max(0,Math.min(1,Ft));y.pulse((Qt.weapon==="greatsword"?.9:.55)*(.4+.6*se))}}x.position.set(Tt.position.x,Tt.position.y,Tt.position.z),T=Tt.bodyYaw,x.rotation.y=S.update(T,wt,((Bt=e.renderInterp)==null?void 0:Bt.yawSmoothMs)??0);const ge=V.dash.phase==="active"&&V.dash.kind==="roll",Ne=ge&&V.dash.duration>0?Math.min(1,1-V.dash.timer/V.dash.duration):0;if(w.rotation.x=ge?Ne*Math.PI*2:0,w.position.y=v-(ge?.2*Math.sin(Math.PI*Ne):0),ae>0&&p.update(Tt,Qt,V.playerHurt,ae,V.abilities.channeling,V.time,V.playerLink,V.turnInPlace),y.update(ae,ae>0?p.weaponBlade():null,ae>0&&(Qt.phase==="active"||V.playerLink.phase==="active"||ge&&V.dash.duration>0)),ae>0)for(let vt=0;vt<b.length;vt++)V.dummies[vt]&&b[vt].update(V.dummies[vt],ae,V.time);const ze=Vt.camera.position,Le=Math.atan2(ze.x-Tt.position.x,ze.z-Tt.position.z),be=V.config.gaze.hurtHoldSec,Bn=V.time-V.playerHurt.lastAt,Hn=be>0&&Bn>=0&&Bn<be?1-Bn/be:0,P=Yw(V.gaze.active,V.gaze.threat,Hn,V.time,C);$w(K,$,It,Ct,P.level),H=Qw(Tt.grounded,Tt.position.y,H),it.mesh.position.set(Tt.position.x,H+.028,Tt.position.z),it.update(P.arcRad,P.opacity,P.scale,K,Le);const X=V.config.abilities.arcane,ot=Math.max(1,Math.floor(X.waves)),st=Math.max(1e-4,X.waveInterval),W=qw({charging:Qt.charging,charge:Qt.charge,channeling:V.abilities.channeling,fireTimer:V.abilities.fireTimer,fireInterval:st,channelProgress:V.abilities.channeling?(V.abilities.waveIndex+(1-Math.min(1,Math.max(0,V.abilities.fireTimer/st))))/ot:0,arcaneCooldown:V.abilities.cooldown,arcaneCooldownMax:X.cooldown,dashCooldown:V.dash.cooldown,dashCooldownMax:V.dash.kind==="blink"?V.config.dash.blinkCooldown:V.config.dash.rollCooldown});et.mesh.position.set(Tt.position.x,Tt.position.y+.03,Tt.position.z),et.set(W.ratio,W.source==="none"?0:C.meterOpacity,W.source==="charge"?Ut:W.source==="channel"?G:re,Le);const St=V.playerLink,Dt=St.weapon?V.config.links.moves[St.weapon]:void 0,Yt=Kw(St.phase,Tt.position.x,Tt.position.z,St.facing,St.travel,(Dt==null?void 0:Dt.hit.radius)??.9);q.set(Yt.x,Yt.z,Y(Yt.x,Yt.z,Tt.position.y)+.042,Yt.radius,Yt.active?C.landingOpacity:0,V.time);for(let vt=0;vt<mt.length;vt++){const rt=V.dummies[vt],Ft=mt[vt],se=_t[vt],oe=ht[vt];if(!rt){Ft.mesh.visible=!1,se.mesh.visible=!1,oe.mesh.visible=!1;continue}const Ve=V.targeting.hasTarget&&V.targeting.targetId===rt.id;if(Pg(V,rt)){const jn=Cg(V,rt);K.copy(It).lerp(Ct,jn)}else K.copy(Mt);const le=jw(rt.attackPhase,rt.attackPhaseTimer,V.config.dummies.attackWindup);le.active?(K.lerp(Ht,.5*le.urgency),oe.mesh.position.set(rt.position.x,rt.position.y+.031,rt.position.z),oe.set(le.ratio,C.warnOpacity*(.65+.35*le.urgency),Ht,Le)):oe.set(0,0,Ht,Le);const Zt=Ve?1:0,sn=Zt>Lt[vt]?C.haloFadeInSec:C.haloFadeOutSec;Lt[vt]=bf(Lt[vt],Zt,wt,sn);const he=Lt[vt],Oe=1+.02*he*Math.sin(V.time*2.2+rt.id),Gn=C.arcDeg+(C.selectedArcDeg-C.arcDeg)*he;Ft.mesh.position.set(rt.position.x,rt.position.y+.022,rt.position.z),Ft.update(Gn*Math.PI/180,C.opacity+(C.selectedOpacity-C.opacity)*he,1+(C.selectedScale-1)*he*Oe,K,Le,1+(C.selectedThicknessScale-1)*he),J[vt]=bf(J[vt],Zt,wt,Zt>J[vt]?C.haloFadeInSec:C.haloFadeOutSec);const Be=J[vt];se.mesh.position.set(rt.position.x,rt.position.y+.019,rt.position.z),se.update(Gn*Math.PI/180,C.haloOpacity*Be*(.88+.12*Math.sin(V.time*2.2+rt.id)),C.selectedScale*(.94+.06*Be)*Oe,K,Le)}Pt.position.set(Tt.position.x,Tt.position.y,Tt.position.z),Pt.rotation.y=Qt.phase!=="idle"?Qt.attackFacing:Tt.bodyYaw,Et.update(V,wt,vt=>Vt.addShake(vt));const jt=gt.slashEnabled&&Qt.phase==="active"&&Qt.comboIndex>=3;j.opacity=jt?.7:0,ut.opacity=jt?gt.slashGlowOpacity:0,jt&&(tt.rotation.z=-1.2+Qt.attackProgress*3.2,tt.scale.setScalar(.9+Qt.comboIndex*.13));for(let vt=0;vt<ft.length;vt++){const rt=V.abilities.projectiles[vt],Ft=ft[vt];Ft.group.visible=!!rt,rt&&(Ft.group.position.set(rt.x,rt.y,rt.z),Ft.group.scale.setScalar(rt.radius),Ft.group.rotation.set(0,Math.atan2(rt.dirX,rt.dirZ),0))}for(let vt=0;vt<Rt.length;vt++){const rt=V.abilities.rings[vt],Ft=Rt[vt];if(!rt){Ft.group.visible=!1;continue}const se=Math.max(0,Math.min(1,rt.life/Math.max(rt.duration,1e-6))),oe=Jw(Math.max(0,rt.duration-rt.life),C.areaExpandSec);Ft.set(rt.x,rt.z,Y(rt.x,rt.z,Tt.position.y)+.045,rt.radius*oe.scale,C.areaOpacity*(.35+.65*se)*oe.alpha,V.time)}for(let vt=0;vt<xt.length;vt++){const rt=V.arrows[vt],Ft=xt[vt];if(!rt){Ft.group.visible=!1,Ft.bone&&(r.attach(Ft.group),Ft.bone=null),Ft.arrowId=0;continue}const se=rt.stuck&&rt.stuckDummy>=0;if(Ft.arrowId!==rt.id){if(Ft.bone&&(r.attach(Ft.group),Ft.bone=null),Ft.arrowId=rt.id,Ft.group.position.set(rt.x,rt.y,rt.z),Ft.group.rotation.set(rt.pitch,rt.yaw,0,"YXZ"),se){const Ve=b[rt.stuckDummy],le=Ve?Ve.boneAtWorld(rt.x,rt.y,rt.z):null;le&&(le.node.attach(Ft.group),Ft.bone=le.node)}}else Ft.bone||(Ft.group.position.set(rt.x,rt.y,rt.z),Ft.group.rotation.set(rt.pitch,rt.yaw,0,"YXZ"));Ft.group.visible=!0;const oe=rt.stuck?Math.min(1,rt.rest/.6):1;Ft.shaftMat.opacity=oe,Ft.tipMat.opacity=oe,Ft.glowMat.opacity=(rt.stuck?.28:.85)*oe,Ft.trailMat.opacity=rt.stuck?0:gt.trailOpacity*oe,Ft.trail.visible=!rt.stuck}Vt.update(Tt.position.x,Tt.position.y,Tt.position.z,wt,V.camera),o.render(r,Vt.camera)},resize(){const V=Math.max(1,n.clientWidth),wt=Math.max(1,n.clientHeight);o.setSize(V,wt,!1),Vt.resize(V/wt)},getGroundBasis(){return Vt.getGroundBasis()},setCollidersVisible(V){for(const wt of h)wt.opacity=V?.3:1,wt.wireframe=V,wt.transparent=V,wt.depthWrite=!V,wt.needsUpdate=!0},setGridVisible(V){f.visible=V},setLabVisible(V){g.setVisible(V)},setLabLabelsVisible(V){g.setLabelsVisible(V)},snapCamera(V,wt,Tt){Vt.snap(V,wt,Tt)},setZoom(V){Vt.setZoom(V)},setBodyType(V){var Tt;const wt=(Tt=e.bodyTypes)==null?void 0:Tt[V];return!wt||V===m||(w.remove(p.group),p.dispose(),p=_(wt),p.group.position.y=-v,w.add(p.group),y.reset(),m=V,t.config.characterHeight=wt.height,wt.radius!==void 0&&(t.config.characterRadius=wt.radius)),m},bodyTypes(){return{id:m,ids:Object.keys(e.bodyTypes??{})}},pickDummy:me,projectToScreen:ie,dummyRigDebug(V){const wt=b[V-1];return wt!=null&&wt.debug?wt.debug():null},diagnostics(){const V=hm(e.camera.pitchDeg),wt=eE(V,Pt.rotation.y);return{lean:p.lean(),slashNormal:wt,arrowForward:p.arrowDirection(),gait:{hipYaw:p.hipYaw(),gaitYaw:p.gaitYaw()},attackBlend:p.attackBlend(),attackWeights:p.attackWeights(),landing:p.landing(),hurt:p.hurt(),ik:p.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:w.rotation.x,activeRings:Et.activeDash(),lastKind:Et.dashKind()},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...Vt.smart(),shake:Vt.shakeLevel(),kick:Vt.kickLevel(),kickCount:Vt.kickCount()}}},dispose(){p.dispose(),g.dispose();for(const V of b)V.dispose();it.dispose();for(const V of mt)V.dispose();for(const V of _t)V.dispose();et.dispose(),y.dispose();for(const V of ht)V.dispose();q.dispose(),kt.dispose(),j.dispose(),ut.dispose(),Wt.dispose(),qt.dispose(),U.dispose(),At.dispose(),nt.dispose();for(const V of Rt)V.dispose();at.dispose(),bt.dispose(),O.dispose(),lt.dispose();for(const V of xt)V.shaftMat.dispose(),V.tipMat.dispose(),V.glowMat.dispose(),V.trailMat.dispose();I.dispose(),A.dispose(),Et.dispose(),u.traverse(V=>{V instanceof _e&&V.geometry.dispose()}),o.dispose(),o.domElement.remove()}}}async function rE(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function cE(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),a=document.createElement("a");a.href=i,a.download=n,a.rel="noopener",document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function lE(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=y=>e.querySelector(`#${y}`),a=i("diag-status"),s=i("diag-text"),o=i("diag-copy"),r=i("diag-json"),l=i("diag-clear"),c=i("diag-toggle"),h=i("diag-close"),u=i("diag-mask");let d=!1,f=!0,g=0;function _(){const y=n.status();a.textContent=y.enabled?`已记录 ${y.durationS.toFixed(1)}s · ${y.frames} 帧 · 事件 ${y.events} · 异常 ${y.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",c.textContent=y.enabled?"暂停记录":"继续记录"}function m(y){d=y,e.hidden=!y,y?_():s.hidden=!0}function p(y){o.textContent=y,window.clearTimeout(g),g=window.setTimeout(()=>{o.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation(),m(!d)}),h.addEventListener("click",()=>m(!1)),u.addEventListener("click",()=>m(!1)),o.addEventListener("click",()=>{const y=n.summary();rE(y).then(x=>{x?(p("已复制 ✓"),s.hidden=!0):(s.value=y,s.hidden=!1,s.focus(),s.select(),p("请长按全选复制"))})}),r.addEventListener("click",()=>{const y=n.dump(),x=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);cE(`harness-${y.meta.version}-${x}.json`,JSON.stringify(y)),p("已导出")}),l.addEventListener("click",()=>{n.clear(),s.hidden=!0,_(),p("已清空")}),c.addEventListener("click",()=>{f=!f,n.setEnabled(f),_()}),{tick(){const y=n.status();t==null||t.classList.toggle("is-alert",y.alert),d&&_()},isOpen:()=>d,close:()=>m(!1)}}const hE={intents:{...Ef},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function dE(){var K;const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=Dg(yx,Eo),i=oE(n,e,hn,Eo.stations),a=Ng(e),s=Jx(t),o=Qx(t),r=document.getElementById("version-badge");r&&(r.textContent="v0.9.62 · 11-09 11:58 · 诊断");const l=$=>String($).padStart(2,"0"),c=new Date,h=px({meta:{version:"v0.9.62",buildTime:"11-09 11:58",startedAt:`${l(c.getMonth()+1)}-${l(c.getDate())} ${l(c.getHours())}:${l(c.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),u=lE(h,r),d=jx({deadZone:()=>hn.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0});document.addEventListener("visibilitychange",()=>{document.hidden&&h.suspend(800)});const f={timeScale:1,paused:!1,showColliders:hn.showColliders,showGrid:hn.showGrid,showLab:hn.lab.enabled,showLabLabels:hn.lab.showLabels};let g=1,_=!1;const m=ix({maxRadiusPx:()=>hn.joystick.maxRadiusPx,deadZone:hn.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>hn.zoom}),p=Array.from(document.querySelectorAll(".wp[data-weapon]"));let y=e.combat.weapon;function x($){if($===y)return;y=$;const Mt=ea.indexOf($)+1;for(const It of p)It.classList.toggle("is-active",Number(It.dataset.weapon)===Mt);T.refreshWeapon()}let v=hE,w=0;const S=()=>{g=1,i.setZoom(1)},T=Dx(e,hn,f,{singleStep:()=>a.singleStep(v.intents),reset:()=>{g=1,a.singleStep({...Ef,resetPressed:!0})},resetZoom:S,onToggleColliders:$=>i.setCollidersVisible($),onToggleGrid:$=>i.setGridVisible($),onToggleLab:$=>i.setLabVisible($),onToggleLabLabels:$=>i.setLabLabelsVisible($),setFighterMode:$=>{for(const Mt of e.dummies)Mt.weapon&&(Mt.mode=$,Mt.attackPhase="idle",Mt.attackPhaseTimer=0,Mt.attackProgress=0,Mt.attackCooldown=0,Mt.combat&&(Mt.combat.phase="idle",Mt.combat.attackProgress=0,Mt.combat.comboIndex=0))}}),E=zx({stations:Eo.stations??[],world:e,view:i,onResetZoom:S});o.register({motion:d,debug:T.gui}),window.addEventListener("resize",()=>i.resize());const b=i.bodyTypes().ids,M=document.getElementById("body-toggle"),R=$=>{var Mt,It;return((It=(Mt=hn.bodyTypes)==null?void 0:Mt[$])==null?void 0:It.name)??$},C=()=>{if(!M)return;const $=i.bodyTypes().id;M.textContent=`体型 ${R($)}`,M.setAttribute("aria-label",`切换体型（当前：${R($)}，快捷键 B）`)},z=document.createElement("div");z.style.cssText=["position:fixed","left:50%","top:14px","transform:translateX(-50%)","padding:6px 14px","border-radius:999px","font:600 13px/1.4 system-ui,sans-serif","color:#0b1620","background:#8fd0ff","box-shadow:0 4px 16px rgba(0,0,0,.35)","opacity:0","transition:opacity .18s","pointer-events:none","z-index:99"].join(";"),document.body.appendChild(z);let N=0;const D=$=>{z.textContent=$,z.style.opacity="1",window.clearTimeout(N),N=window.setTimeout(()=>{z.style.opacity="0"},1600)},L=()=>{if(b.length<2){D("只有一个体型预设");return}const $=i.bodyTypes().id,Mt=Math.max(0,b.indexOf($)),It=i.setBodyType(b[(Mt+1)%b.length]);C(),D(`体型：${R(It)}（B / 顶部胶囊切换）`)};C(),M==null||M.addEventListener("click",L),window.addEventListener("keydown",$=>{$.repeat||$.code!=="KeyB"||L()}),window.__harness={world:e,view:i,clock:a,input:m,viewConfig:hn,debug:f,getUserZoom:()=>g,getGestures:()=>v.gestures,getLastGesture:()=>v.lastGesture,telemetry:h,telemetrySummary:()=>h.summary(),dirDebug:d.dirDebug,dirAngles:()=>d.dirDebug.last(),motionDebug:d,speedDebug:()=>d.last(),speedSamples:()=>d.samples(),gaitDebug:()=>i.gaitDebug(),dummyRigDebug:$=>i.dummyRigDebug($),swingDebug:()=>i.swingDebug(),stanceDebug:()=>i.stanceDebug(),balanceDebug:()=>i.balanceDebug(),spineDebug:()=>i.spineDebug(),interpDebug:()=>({alpha:Lt,applied:J,enabled:it,skip:et}),renderPose:()=>i.renderPose(),yawDebug:()=>i.yawDebug(),slamDebug:()=>i.slamDebug(),fxDebug:()=>i.fxDebug(),setRenderInterp:$=>(it=!!$,it),renderHold:()=>_,trailDebug:()=>i.trailDebug(),bladeWorld:()=>i.bladeWorld(),projectPoint:($,Mt,It)=>i.projectPoint($,Mt,It),setBodyType:$=>{const Mt=i.setBodyType($);return C(),Mt},bodyTypes:()=>i.bodyTypes(),bladesWorld:()=>i.bladesWorld(),clipLab:{clips:()=>{var $;return Object.keys((($=hn.animation.swing)==null?void 0:$.clips)??{})},preview:$=>{const Mt=e.combat,It={...Mt};Mt.weapon=$.weapon,Mt.phase="active",Mt.comboIndex=Math.max(1,Math.min(3,Math.floor($.comboIndex))),Mt.attackProgress=Math.max(0,Math.min(1,$.progress)),Mt.attackFacing=e.character.bodyYaw,i.setClipT(typeof $.t=="number"?$.t:null);const Ct=Math.max(1,Math.min(30,Math.floor($.warm??12)));_=!0;for(let Ut=0;Ut<Ct;Ut++)i.render(e,1/60);return i.setClipT(null),Object.assign(Mt,It),{...i.swingDebug(),blade:i.bladeWorld(),blades:i.bladesWorld()}},face:$=>{e.character.bodyYaw=$},zoom:$=>{g=Ud($,1,hn.zoom.min,hn.zoom.max),i.setZoom(g)},release:()=>{_=!1}},weaponDebug:()=>i.weaponDebug(),gripDebug:()=>i.gripDebug(),lab:{stations:Eo.stations??[],goto:$=>E.goto($),current:()=>E.current(),recall:()=>E.recall()}};let F=performance.now(),H=60,Y=0,it=((K=hn.renderInterp)==null?void 0:K.enabled)??!0,mt=Fd(e),_t=null,Lt=1,J=!1,et="";function ht($){const Mt=it&&!f.paused&&f.timeScale>0;if(J=!1,et="",!Mt)return et="off",Lt=1,e;if(!_t)return et="noprev",Lt=1,e;if(!Bg(_t,mt))return et="key",Lt=1,e;const It=a.alpha;return Lt=It,It>=.999?(et="alpha",e):(J=!0,Gg(e,Hg(_t,mt,It)))}function q($){const Mt=Math.min(($-F)/1e3,.1);F=$,Mt>0&&(H=H*.9+1/Mt*.1);const It=m.sample();It.intents.resetPressed&&(g=1),g=Ud(g,It.zoomScale,hn.zoom.min,hn.zoom.max),i.setZoom(g);let Ct=It.intents.dummyClickId;if(It.tap){const re=i.pickDummy(It.tap.x,It.tap.y);re>0&&(Ct=re)}Ct>0&&(w=Ct),v={...It,intents:{...It.intents,dummyClickId:w}};const Ut=a.frame(Mt,v.intents,f.timeScale,f.paused,()=>{const re=e.events;for(let Ht=0;Ht<re.length;Ht++)h.event(re[Ht],e.time);_t=mt,mt=Fd(e)});Ut>0&&(w=0),h.sample(e,v,Mt*1e3,Ut);for(const re of v.gestures)h.gesture(re);$-Y>250&&(Y=$,u.tick()),x(e.combat.weapon),_||i.render(ht(),Mt),E.tick(),d.update(e,v,i.getGroundBasis());const G=i.diagnostics();s.update(e,H,Ut,v,f,{attackBlend:G.attackBlend,attackWeights:G.attackWeights,landing:G.landing,hurt:G.hurt,ik:G.ik,zoom:G.camera.zoom},o.hudCompact()),requestAnimationFrame(q)}requestAnimationFrame(q)}dE();

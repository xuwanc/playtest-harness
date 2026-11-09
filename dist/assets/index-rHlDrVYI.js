(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=e(a);fetch(a.href,s)}})();const na=["sword-shield","dual-swords","greatsword","staff","bow"],o0=["wander","follow","keep-distance","attack","idle"],If=["spar","wander","follow","keep-distance","attack","idle"],Ff={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},yr=1e-6;function to(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>yr?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>yr?Math.atan2(t.moveX,t.moveZ):n.character.facing}function r0(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>yr){const a=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/a,z:t.aimZ/a}}const e=Math.hypot(t.moveX,t.moveZ);if(e>yr)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const on=1e-6,Ys=Math.PI/180,uh=-1e9;function zf(){return{type:"none",lastAt:uh,timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function $s(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function xd(n,t,e,i,a){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=a,n.knockX=0,n.knockZ=0}function fh(n,t,e){var c,h;const i=e.duration>0?e.duration:zr(n,e.type);if(t.kind==="player"){const u=n.playerHurt;if(xd(u,e.type,i,e.dirX,e.dirZ),u.lastAt=n.time,!n.config.hits.noDamageToPlayer&&e.knockback>on){const d=e.knockback*n.config.hits.knockbackDecay;u.knockX=e.dirX*d,u.knockZ=e.dirZ*d}$s(n,"player-hurt",e.sourceId??0,n.character.position);return}const a=n.dummies[t.index];if(!a)return;if(xd(a.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>on){const u=e.knockback*n.config.hits.knockbackDecay;a.hurt.knockX=e.dirX*u,a.hurt.knockZ=e.dirZ*u}n.hitCount+=1,$s(n,"hit",a.id,a.position);const s=n.config.hits.hitstop;let o=((c=n.config.hits.hitstopByWeapon)==null?void 0:c[n.combat.weapon])??1;const r=n.config.hits.hitstopComboFalloff;if(r&&r.length>0){const u=Math.max(0,Math.min(r.length-1,n.combat.comboIndex-1));o*=Math.max(0,r[u])}o*=Math.max(0,e.holdMul??1);const l=s&&e.type!=="none"?(s[e.type]??0)*Math.max(0,o):0;l>0&&n.combat.hitstop<l&&(n.combat.hitstop=l,n.combat.warpPhase=1,n.combat.warp=(h=n.config.hits.hitstopWarp)!=null&&h.enabled?Math.max(0,Math.min(1,n.config.hits.hitstopWarp.holdRate)):0,$s(n,"hitstop",l,a.position))}function uo(n,t,e){fh(n,{kind:"dummy",index:t},e)}function c0(n,t){const e=[n.playerHurt];for(const a of n.dummies)e.push(a.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const a of e)a.timer>0&&(a.timer=Math.max(0,a.timer-t),a.timer===0&&(a.type="none",a.knockX=0,a.knockZ=0)),(a.knockX!==0||a.knockZ!==0)&&(a.knockX*=i,a.knockZ*=i,Math.abs(a.knockX)<1e-4&&(a.knockX=0),Math.abs(a.knockZ)<1e-4&&(a.knockZ=0))}function zr(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function vd(n,t){if(n.length===0)return 0;if(t<=n[0][0])return n[0][1];for(let e=1;e<n.length;e++){const[i,a]=n[e];if(t<=i){const[s,o]=n[e-1],r=i>s?(t-s)/(i-s):1;return o+(a-o)*r}}return n[n.length-1][1]}function l0(n){let t=n;for(;t>180;)t-=360;for(;t<-180;)t+=360;return t}function h0(n){var S,E;const t=n.combat,e=n.config.hits,i=n.character.position;if(t.weapon==="bow")return;const a=n.config.combat.weapons[t.weapon],s=a==null?void 0:a.hitWindow,o=s?Math.min(1,Math.max(0,s.start)):0,r=s?Math.min(1,Math.max(o,s.end)):1,l=t.timings.active,c=l>on?Math.min(1,Math.max(0,t.phaseTimer/l)):1;if(c<o-on||c>r+on)return;const h=e.reach[t.weapon]??0,u=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*Ys),d=Math.sin(t.attackFacing),f=Math.cos(t.attackFacing),g=n.config.dummies.radius,_=n.config.targeting.idealRange,m=a==null?void 0:a.hitSweep,p=((S=m==null?void 0:m.byCombo)==null?void 0:S[String(t.comboIndex)])??((E=m==null?void 0:m.byCombo)==null?void 0:E["1"]),y=(m==null?void 0:m.tolDeg)??10;let x=0,v=0,w=!1;if(p){if(typeof p.stabU=="number"){if(c<p.stabU)return}else if(p.pts&&p.pts.length>=2){const A=vd(p.pts,0),b=vd(p.pts,c);x=Math.min(A,b)-y,v=Math.max(A,b)+y,w=!0}}for(const A of n.dummies){if(t.hitIds.indexOf(A.id)>=0)continue;const b=A.position.x-i.x,M=A.position.z-i.z,P=Math.hypot(b,M);if(P>h+g)continue;const C=P>on?b/P:d,F=P>on?M/P:f;if(P>on&&(b*d+M*f)/P<u)continue;if(w){const G=l0(Math.atan2(b,M)/Ys-t.attackFacing/Ys);if(G<x||G>v)continue}let N="light";t.weapon==="greatsword"?N="knock":t.comboIndex>=3&&(N="heavy");const L=e.knockback[t.weapon]??0;let I=P;L>0&&(I=Math.max(P+L,_));const z=Math.max(0,I-P);uo(n,n.dummies.indexOf(A),{type:N,duration:zr(n,N),dirX:C,dirZ:F,knockback:z}),t.hitIds.push(A.id)}}function d0(n){const t=n.combat,e=n.config.combat.weapons[t.weapon],i=e==null?void 0:e.groundSlam;if(!i||t.slamAttackId===t.attackId)return;const a=t.timings.active;if((a>on?Math.min(1,Math.max(0,t.phaseTimer/a)):1)<i.slamU-on)return;t.slamAttackId=t.attackId;const o=n.config.hits,r=n.character.position,l=Math.sin(t.attackFacing),c=Math.cos(t.attackFacing),h=n.config.dummies.radius,u=Math.max(0,i.radius),d=i.onlyUnhit!==!1,f=i.type??(t.weapon==="greatsword"?"knock":"heavy"),g=i.knockback??o.knockback[t.weapon]??0,_=n.config.targeting.idealRange,m=i.holdMul??1.6;for(let p=0;p<n.dummies.length;p++){const y=n.dummies[p];if(d&&t.hitIds.indexOf(y.id)>=0)continue;const x=y.position.x-r.x,v=y.position.z-r.z,w=Math.hypot(x,v);if(w>u+h)continue;const S=w>on?x/w:l,E=w>on?v/w:c,A=g>0?Math.max(w+g,_):w,b=Math.max(0,A-w);uo(n,p,{type:f,duration:zr(n,f),dirX:S,dirZ:E,knockback:b,holdMul:m}),t.hitIds.push(y.id)}$s(n,"ground-slam",u,{x:r.x+l*Math.min(u*.25,.5),y:r.y,z:r.z+c*Math.min(u*.25,.5)})}function u0(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const a=i.weapon===""?void 0:e.moves[i.weapon];if(!a||!a.enabled||!n.modules.hits||!n.modules.dummies)return;const s=a.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(s.pulseInterval,0);const o=n.character.position,r=i.fromX,l=i.fromZ,c=o.x,h=o.z,u=c-r,d=h-l,f=u*u+d*d,g=Math.sin(i.facing),_=Math.cos(i.facing),m=Math.cos(yd(s.arcDeg,0,180)*Ys),p=n.config.dummies.radius;for(let y=0;y<n.dummies.length;y++){const x=n.dummies[y];if(i.hitIds.indexOf(x.id)>=0)continue;const v=f>on?yd(((x.position.x-r)*u+(x.position.z-l)*d)/f,0,1):0,w=r+u*v,S=l+d*v,E=Math.hypot(x.position.x-w,x.position.z-S);let A=!1;if(s.shape==="circle")A=E<=s.radius+p;else if(s.shape==="capsule")A=E<=Math.max(s.radius,s.width)+p;else{const N=x.position.x-c,L=x.position.z-h,I=Math.hypot(N,L),z=I>on?(N*g+L*_)/I>=m:!0;A=I<=s.radius+p&&z||E<=s.width+p}if(!A)continue;const b=x.position.x-r,M=x.position.z-l,P=Math.hypot(b,M);if(P>on&&(b*g+M*_)/P<Math.cos(Math.max(s.arcDeg,90)*Ys))continue;const C=P>on?b/P:g,F=P>on?M/P:_;fh(n,{kind:"dummy",index:y},{type:s.type,duration:s.duration,dirX:C,dirZ:F,knockback:s.knockback}),i.hitIds.push(x.id),$s(n,"link-hit",x.id,x.position)}}function f0(n){const t=n.config.hits,e=n.config.dummies.fighters,i=n.character.position;for(const a of n.events){if(a.type!=="dummy-hit")continue;const s=n.dummies[a.value-1];if(!s)continue;const o=s.weapon?t.reach[s.weapon]??t.dummyReach:t.dummyReach,r=i.x-s.position.x,l=i.z-s.position.z,c=Math.hypot(r,l);if(c>o)continue;const h=c>on?r/c:0,u=c>on?l/c:1,f=(s.weapon?Math.max(t.knockback[s.weapon]??0,t.dummyKnockback):t.dummyKnockback)*(s.weapon?(e==null?void 0:e.knockbackScale)??1:1),_=s.weapon==="greatsword"&&s.attackComboLeft<=0?"knock":"light";fh(n,{kind:"player"},{type:_,duration:zr(n,_),dirX:h,dirZ:u,knockback:f,sourceId:s.id})}}function p0(n,t){n.modules.hits&&(n.combat.phase==="active"&&(h0(n),d0(n)),u0(n,t),f0(n))}function yd(n,t,e){return n<t?t:n>e?e:n}const Nf=Math.PI/180,ph=1e-6;function m0(){return{phase:"idle",fromYaw:0,targetYaw:0,dir:1,progress:0,armTime:0}}function _r(n){const t=n.turnInPlace;t.phase="idle",t.fromYaw=0,t.targetYaw=0,t.dir=1,t.progress=0,t.armTime=0}function Uf(n,t,e){return n.modules.gaze&&n.gaze.active?n.gaze.centroidYaw:t.aimActive&&Math.hypot(t.aimX,t.aimZ)>ph?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:null}function Of(n,t,e){const i=n.character,a=Math.hypot(i.velocity.x,i.velocity.z),s=Math.hypot(t.moveX,t.moveZ),o=n.combat.phase!=="idle"||n.combat.charging||n.abilities.channeling||n.dash.phase!=="idle"||n.playerLink.phase!=="idle"||n.playerHurt.type!=="none"||t.attackPressed||t.attackHeld||t.skill2Pressed||t.sprintPressed||t.jumpPressed;return i.grounded&&a<=Math.max(0,e.idleSpeedRatio)*Math.max(n.config.moveSpeed,ph)&&s<=Math.max(0,e.inputDeadZone)&&!o}function g0(n){const t=n<0?0:n>1?1:n;return t*t*(3-2*t)}function x0(n,t){const e=n.config.turnInPlace;if(!e.enabled||!n.modules.turnInPlace||!Of(n,t,e))return!1;const i=Uf(n,t,e.lookRange);if(i===null)return!1;const a=He(i-n.character.bodyYaw);return Math.abs(a)>Bf(n,e)}function Bf(n,t){const i=n.modules.gaze&&n.gaze.active?Math.max(t.triggerDeg,t.gazeTriggerDeg):t.triggerDeg;return Math.max(0,i)*Nf}function v0(n,t,e){const i=n.turnInPlace,a=n.config.turnInPlace;if(!a.enabled||!n.modules.turnInPlace||!Of(n,e,a)){_r(n);return}const s=Uf(n,e,a.lookRange);if(s===null){_r(n);return}const o=n.character,r=He(s-o.bodyYaw),l=Math.abs(r),c=Bf(n,a),h=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>ph;if(i.phase==="idle"&&(i.armTime=l>=c?i.armTime+t:0,l>c&&i.armTime>=Math.max(0,a.armSec))){i.phase="active",i.fromYaw=o.bodyYaw,i.dir=r>=0?1:-1;const u=Math.min(l,Math.max(0,a.settleDeg)*Nf);i.targetYaw=He(o.bodyYaw+i.dir*(l-u)),i.progress=0}if(i.phase==="active"){const u=Math.max(a.durationSec,n.config.fixedDt);i.progress=Math.min(1,i.progress+t/u);const d=He(i.targetYaw-i.fromYaw);o.bodyYaw=He(i.fromYaw+d*g0(i.progress)),h||(o.facing=o.bodyYaw),i.progress>=1&&(i.phase="idle",i.progress=0,i.armTime=0)}}const Qi=1e-6;function He(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Eo(n,t,e,i){const a=He(t-n);return n+a*(1-Math.exp(-Math.max(e,Qi)*i))}function To(n,t,e,i,a){const o=He(t-n)*(1-Math.exp(-Math.max(e,Qi)*a)),r=Math.max(i,0)*a;return r<=Qi?n:n+os(o,-r,r)}function _d(n,t,e,i,a){const s=(t-n)*(1-Math.exp(-Math.max(e,Qi)*a)),o=Math.max(i,0)*a;return o<=Qi?n+s:n+os(s,-o,o)}function os(n,t,e){return n<t?t:n>e?e:n}function Md(n,t,e,i){const a=He(t-n),s=Math.abs(a);return s<=i||s<=e?t:He(n+Math.sign(a)*Math.max(e,0))}function y0(n,t,e){const i=n.character,a=n.config.orientation,s=n.combat,o=n.modules.gaze&&n.gaze.active,r=n.abilities.channeling,l=s.phase!=="idle"||s.charging||r||n.dash.phase!=="idle",c=o&&!l,h=Math.hypot(e.moveX,e.moveZ),u=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Qi,d=s.charging&&s.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(s.phase!=="idle")i.facing=s.attackFacing;else if(r)i.facing=to(n,e);else if(c)i.facing=To(i.facing,n.gaze.centroidYaw,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t);else if(u)i.facing=to(n,e);else if(d)i.facing=n.targeting.targetYaw;else if(h>Math.max(a.facingDeadZone,Qi)){const M=Math.atan2(e.moveX,e.moveZ),P=a.facingTurnRate*Math.PI/180*t,C=a.facingSnapDeg*Math.PI/180;if(h>=.35)i.facing=Md(i.facing,M,P,C);else if(h>=a.facingMinMagnitude&&Math.abs(He(M-i.facing))>a.facingDeadbandDeg*Math.PI/180){const N=Eo(i.facing,M,a.facingSmoothRate,t);i.facing=Md(i.facing,N,P,0)}}const f=i.velocity;Math.hypot(f.x,f.z)>.15&&(i.moveYaw=Math.atan2(f.x,f.z));const g=c?n.gaze.centroidYaw:i.facing;n.turnInPlace.phase==="active"||x0(n,e)||(c?i.bodyYaw=To(i.bodyYaw,g,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t):i.bodyYaw=Eo(i.bodyYaw,g,a.bodyTurnRate,t));const m=n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;let p=i.facing;if(o?p=c?n.gaze.mainYaw:i.facing:u?p=Math.atan2(e.aimX,e.aimZ):m&&(p=n.targeting.targetYaw),!o){const M=n.config.gaze.headLookLimitDeg*Math.PI/180;Math.abs(He(p-i.bodyYaw))>M&&(p=i.moveYaw)}const y=o||u||m,x=a.maxHeadTurnDeg*Math.PI/180;let v;if(y){const M=c?n.config.gaze.headTurnRate:a.headTurnRate;v=c?To(i.headYaw,p,M,n.config.gaze.maxHeadSpeedDeg*Math.PI/180,t):Eo(i.headYaw,p,M,t)}else{const M=He(i.headYaw-i.bodyYaw),P=He(p-i.bodyYaw),C=Math.abs(P)<Math.abs(M)-1e-9,F=C?n.config.gaze.headReturnRate:a.headTurnRate,N=C?n.config.gaze.headReturnSpeedDeg*Math.PI/180:Number.POSITIVE_INFINITY,L=Number.isFinite(N)?To(M,P,F,N,t):Eo(M,P,F,t);v=i.bodyYaw+L}const w=He(v-i.bodyYaw);w>x?v=i.bodyYaw+x:w<-x&&(v=i.bodyYaw-x),i.headYaw=v;const S=n.config.gaze;let E=0;if(c)E=n.gaze.mainPitch;else if(n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget){const M=n.dummies[n.targeting.targetId-1];if(M){const P=i.position.y+n.config.characterHeight*os(S.eyeHeightRatio,0,1),C=M.position.y+n.config.dummies.height*os(S.aimHeightRatio,0,1),F=Math.hypot(M.position.x-i.position.x,M.position.z-i.position.z);E=Math.atan2(C-P,Math.max(Qi,F))}}const A=Math.max(0,S.maxHeadPitchDeg)*Math.PI/180;E=os(E,-A,A);const b=y?S.headPitchRate:Math.min(S.headPitchRate,S.headReturnRate);i.headPitch=_d(i.headPitch,E,b,Math.max(0,S.maxHeadPitchDeg)*4*Math.PI/180,t),i.bodyPitch=_d(i.bodyPitch,i.headPitch*os(S.bodyPitchScale,0,1),S.bodyPitchRate,Math.max(0,S.maxHeadPitchDeg)*Math.PI/180,t)}const Hf=1e-6,Nr=Math.PI/180;function Ur(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function _0(n,t,e){const i=n.character.position,a=Math.max(0,e.homingConeDeg)*Nr,s=Math.max(0,e.homingRange),o=[];for(let r=0;r<n.dummies.length;r++){const l=n.dummies[r],c=l.position.x-i.x,h=l.position.z-i.z,u=Math.hypot(c,h);u<.001||u>s||Math.abs(He(Math.atan2(c,h)-t))>a||o.push({i:r,d:u})}return o.sort((r,l)=>r.d-l.d||r.i-l.i),o.map(r=>r.i)}function M0(n,t){const e=Math.sin((n+1)*12.9898+(t+1)*78.233)*43758.5453;return e-Math.floor(e)}function b0(n,t){const e=n.abilities,i=n.character.position,a=Math.max(1,Math.floor(t.perWave)),s=t.spreadDeg*Nr,o=Math.max(0,t.spawnSideStep),r=Math.max(0,Math.min(1,t.speedJitter)),l=_0(n,e.channelYaw,t);for(let c=0;c<a;c++){const h=(c-(a-1)*.5)*s,u=e.channelYaw+h,d=(c-(a-1)*.5)*o,f=Math.sin(u),g=Math.cos(u);e.pending.push({delay:c*Math.max(0,t.spawnDelay),x:i.x+f*.5+Math.cos(u)*d,y:i.y+1,z:i.z+g*.5-Math.sin(u)*d,yaw:u,speed:t.speed*(1+(M0(e.waveIndex,c)*2-1)*r),targetIndex:l.length>0?l[c%l.length]:-1,wave:e.waveIndex})}Ur(n,"arcane-wave",e.waveIndex,{x:i.x,y:i.y+1,z:i.z})}function S0(n,t,e){const i=n.abilities;if(i.pending.length===0)return;const a=[];for(const s of i.pending){if(s.delay-=t,s.delay>0){a.push(s);continue}const o={id:++i.nextId,x:s.x,y:s.y,z:s.z,dirX:Math.sin(s.yaw),dirZ:Math.cos(s.yaw),speed:s.speed,life:e.life,radius:e.radius,targetIndex:s.targetIndex,turnRate:Math.max(0,e.turnRateDeg)*Nr,homing:Math.max(0,e.homingTime),spread:Math.max(0,e.spreadTime),retarget:0,wave:s.wave};i.projectiles.push(o),i.volleyId+=1,Ur(n,"projectile-fire",i.volleyId,o)}i.pending=a}function bd(n,t){const e=n.abilities;e.channeling&&(e.channeling=!1,e.fireTimer=0,e.cooldown=Math.max(0,t.cooldown),e.channelMoveScale=1,e.needsRelease=!0,Ur(n,"channel-end",0,n.character.position))}function w0(n,t,e,i,a,s){const o=n.abilities,r=n.dash.phase==="active",l=n.playerLink,c=s==="skill2"?e.skill2Pressed:e.attackHeld,h=a&&c&&!r&&l.phase==="idle"&&!l.consumedAttack;if(o.cooldown>0&&(o.cooldown=Math.max(0,o.cooldown-t)),o.needsRelease&&!h&&(o.needsRelease=!1),o.channeling){if(!h){bd(n,i);return}}else{if(!(h&&!o.needsRelease&&o.cooldown<=0))return;o.channeling=!0,o.channelId+=1,o.waveIndex=0,o.fireTimer=0,o.channelMoveScale=Math.max(0,Math.min(1,i.moveScale)),Ur(n,"channel-start",o.channelId,n.character.position)}o.channelYaw=to(n,e),o.fireTimer-=t;let u=0;for(;o.fireTimer<=0&&u++<8;)if(o.fireTimer+=Math.max(i.waveInterval,Hf),b0(n,i),o.waveIndex+=1,o.waveIndex>=Math.max(1,Math.floor(i.waves))){bd(n,i);break}}function E0(n,t,e){const i=Math.max(0,e.homingConeDeg)*Nr,a=Math.max(0,e.homingRange),s=Math.atan2(t.dirX,t.dirZ);let o=-1,r=a+Hf;for(let l=0;l<n.dummies.length;l++){const c=n.dummies[l],h=c.position.x-t.x,u=c.position.z-t.z,d=Math.hypot(h,u);d<.001||d>r||Math.abs(He(Math.atan2(h,u)-s))>i||(o=l,r=d)}return o}function T0(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.projectiles){if(r.spread>0)r.spread=Math.max(0,r.spread-t);else if(r.homing>0&&(r.homing=Math.max(0,r.homing-t)),r.retarget-=t,r.retarget<=0&&(r.retarget=Math.max(.05,e.retargetInterval),r.targetIndex=E0(n,r,e)),r.targetIndex>=0&&r.turnRate>0&&r.homing>0){const c=n.dummies[r.targetIndex];if(!c)r.targetIndex=-1;else{const h=Math.atan2(c.position.x-r.x,c.position.z-r.z),u=Math.atan2(r.dirX,r.dirZ),d=He(h-u),f=r.turnRate*t,g=Math.max(-f,Math.min(f,d)),_=u+g;r.dirX=Math.sin(_),r.dirZ=Math.cos(_)}}if(r.x+=r.dirX*r.speed*t,r.z+=r.dirZ*r.speed*t,r.life-=t,r.life<=0)continue;let l=!1;if(s)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],u=h.position.x-r.x,d=h.position.z-r.z,f=r.radius+a;if(!(u*u+d*d>f*f)){uo(n,c,{type:e.hurtType,duration:e.hurtDuration,dirX:r.dirX,dirZ:r.dirZ,knockback:e.knockback}),l=!0;break}}l||o.push(r)}i.projectiles=o}const A0={kind:"channelVolley",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params;w0(n,t,e,s,a,i.cfg.slot),S0(n,t,s),T0(n,t,s)}},hc=1e-6;function Gf(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function R0(n,t){const e=n.character.position,i={id:++n.abilities.nextId,x:e.x,z:e.z,radius:t.radius,life:t.duration,duration:t.duration,pulseTimer:0};n.abilities.rings.push(i),Gf(n,"ring-place",i.id,e)}function P0(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.rings){r.life-=t,r.pulseTimer-=t;let l=0;for(;r.pulseTimer<=0&&l++<8;){if(r.pulseTimer+=Math.max(e.pulseInterval,hc),s)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],u=h.position.x-r.x,d=h.position.z-r.z,f=r.radius+a;if(u*u+d*d>f*f)continue;const g=Math.hypot(u,d),_=g>hc?u/g:0,m=g>hc?d/g:1;uo(n,c,{type:"heavy",duration:e.stun,dirX:_,dirZ:m,knockback:e.knockback})}Gf(n,"ring-pulse",r.id,{x:r.x,y:0,z:r.z})}r.life>0&&o.push(r)}i.rings=o}const C0={kind:"groundRing",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params,o=i.cfg.slot==="attack"?e.attackPressed:e.skill2Pressed;a&&o&&n.dash.phase!=="active"&&n.playerLink.phase==="idle"&&R0(n,s),P0(n,t,s)}},L0={channelVolley:A0,groundRing:C0};function D0(n){const t=Array.isArray(n.skills)?n.skills:[],e=n.abilities;return t.map(i=>{if(i.params)return{cfg:i,params:i.params};const a=i.paramsRef,s=a?e[a]:void 0;if(!s||typeof s!="object")throw new Error(`[skills] ${i.id}: paramsRef "${a??""}" 在 core.abilities 中不存在`);return{cfg:i,params:s}})}function k0(n,t,e){for(const i of n.skills){if(i.cfg.enabled===!1)continue;const a=L0[i.cfg.kind];if(!a)continue;const s=!i.cfg.weapon||n.combat.weapon===i.cfg.weapon;a.update({world:n,dt:t,intents:e,skill:i,onWeapon:s})}}function I0(){return{channeling:!1,channelYaw:0,fireTimer:0,waveIndex:0,cooldown:0,needsRelease:!1,channelId:0,channelMoveScale:1,volleyId:0,pending:[],projectiles:[],rings:[],nextId:0}}function Vf(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.waveIndex=0,t.cooldown=0,t.needsRelease=!1,t.channelMoveScale=1,t.pending.length=0,t.projectiles.length=0,t.rings.length=0}function F0(n,t,e){k0(n,t,e)}function dc(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const Sd=1e-6;function wd(n,t,e){return n<t?t:n>e?e:n}function Xf(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function Wf(n){const t=n.camera,e=Xf();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function z0(n){const t=n.camera,e=n.config.camera,i=n.character.position;let a=0,s=0,o=0,r=0;for(const c of n.dummies){const h=c.position.x-i.x,u=c.position.z-i.z,d=Math.hypot(h,u);if(d>e.radius)continue;const f=wd((e.radius-d)/Math.max(Sd,e.radius-e.nearDistance),0,1);let g=f*(e.modeWeight[c.mode]??.5);c.attackPhase==="active"&&(g+=e.attackBoost*f),a+=g,s+=c.position.x*g,o+=c.position.z*g,r+=1}const l=a<=0?0:wd(a/(a+Math.max(Sd,e.saturation)),0,1);if(t.threat=l,t.threatCount=r,a<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const c=s/a,h=o/a;t.centroidX=c,t.centroidZ=h;let u=(c-i.x)*e.framingBias*l,d=(h-i.z)*e.framingBias*l;const f=Math.hypot(u,d);f>e.maxOffset&&(u=u/f*e.maxOffset,d=d/f*e.maxOffset),t.offsetX=u,t.offsetZ=d}t.distanceScale=1-e.pushIn*(1-l)+e.maxPullback*l,t.pitchDelta=e.maxPitchDelta*l}function N0(n){const t=[],e=n.ground.size;t.push(Ba("ground","ground",0,0,e,e,-n.ground.thickness,0));for(const i of n.steps)t.push(Ba(i.id,"step",i.x,i.z,i.width,i.depth,0,i.height));for(const i of n.doorways){const a=i.openingWidth/2,s=i.wallThickness;t.push(Ba(`${i.id}-left`,"wall",i.x-a-i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push(Ba(`${i.id}-right`,"wall",i.x+a+i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push(Ba(`${i.id}-lintel`,"lintel",i.x,i.z,i.openingWidth,s,i.openingHeight,i.wallHeight))}for(const i of n.obstacles)t.push(Ba(i.id,"obstacle",i.x,i.z,i.width,i.depth,0,i.height));return t}function Ba(n,t,e,i,a,s,o,r){return{id:n,kind:t,minX:e-a/2,maxX:e+a/2,minY:o,maxY:r,minZ:i-s/2,maxZ:i+s/2}}const Ii=1e-6;function Mr(n,t,e){return n<t?t:n>e?e:n}function eo(n,t,e,i,a,s,o){const r=a*.85;let l=Number.NEGATIVE_INFINITY;for(const c of n)c.maxY>i+s+Ii||c.maxY<i-o-Ii||t+r<c.minX||t-r>c.maxX||e+r<c.minZ||e-r>c.maxZ||c.maxY>l&&(l=c.maxY);return l}function U0(n,t,e,i,a=0,s=.05){let o=Number.NEGATIVE_INFINITY;for(const r of n)r.maxY>i+s||t<r.minX||t>r.maxX||e<r.minZ||e>r.maxZ||r.maxY>o&&(o=r.maxY);return o===Number.NEGATIVE_INFINITY?a:o}function mh(n,t,e,i,a){let s=!1;const o=t.y+i;for(let r=0;r<2;r++)for(const l of n){if(l.maxY<=t.y+a+Ii||l.minY>=o-Ii)continue;const c=Mr(t.x,l.minX,l.maxX),h=Mr(t.z,l.minZ,l.maxZ),u=t.x-c,d=t.z-h,f=u*u+d*d;if(!(f>=e*e))if(s=!0,f>Ii*Ii){const g=Math.sqrt(f),_=(e-g)/g;t.x+=u*_,t.z+=d*_}else{const g=t.x-l.minX,_=l.maxX-t.x,m=t.z-l.minZ,p=l.maxZ-t.z,y=Math.min(g,_,m,p);y===g?t.x=l.minX-e:y===_?t.x=l.maxX+e:y===m?t.z=l.minZ-e:t.z=l.maxZ+e}}return s}function gh(n,t,e,i,a){const s=t.y+i;for(const o of n){if(o.maxY<=t.y+a+Ii||o.minY>=s-Ii)continue;const r=Mr(t.x,o.minX,o.maxX),l=Mr(t.z,o.minZ,o.maxZ),c=t.x-r,h=t.z-l;if(c*c+h*h<e*e-Ii)return!0}return!1}const Ki=1e-6,xs=Math.PI/180;function xh(n){return Math.atan2(Math.sin(n),Math.cos(n))}function sl(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Yf(n){n.arrows.length=0}function O0(n,t,e,i,a,s,o,r,l,c,h){const u=i-n,d=s-e,f=u*u+d*d;let g=0;f>Ki&&(g=((o-n)*u+(r-e)*d)/f,g=Math.max(0,Math.min(1,g)));const _=n+u*g,m=e+d*g,p=_-o,y=m-r;if(p*p+y*y>h*h)return-1;const x=t+(a-t)*g;return x<l-.1||x>l+c?-1:g}function B0(n,t){const e=n.config.combat.bow.trajectory,i=Math.max(0,e.homingRange);if(i<=Ki)return-1;const a=n.character.position,s=Math.max(0,e.homingConeDeg)*xs,o=n.config.targeting.targetAssist&&n.modules.targeting?n.targeting:null,r=o&&o.hasTarget?o.targetId:0;let l=-1,c=i+Ki;for(const h of n.dummies){if(!n.modules.dummies)break;const u=h.position.x-a.x,d=h.position.z-a.z,f=Math.hypot(u,d);if(!(f<.001||f>i)){if(h.id===r)return h.id;Math.abs(xh(Math.atan2(u,d)-t))>s||f<c&&(l=h.id,c=f)}}return l}function H0(n,t,e){if(e<=0)return t;const i=n.dummies.find(r=>r.id===e);if(!i)return t;const a=n.character.position,s=Math.atan2(i.position.x-a.x,i.position.z-a.z),o=Math.max(0,n.config.combat.bow.trajectory.homingConeDeg)*xs;return t+hs(xh(s-t),-o,o)}function G0(n,t,e,i,a,s){const o=n.config.combat.bow.trajectory,r={vy:s*Math.sin(Math.max(0,o.launchPitchDeg)*xs),horizontal:0};if(r.horizontal=s*Math.cos(Math.max(0,o.launchPitchDeg)*xs),a<=0)return r;const l=n.dummies.find(_=>_.id===a);if(!l)return r;const c=Math.hypot(l.position.x-t,l.position.z-i);if(c<.4)return r;const h=c/Math.max(Ki,s),u=l.position.y+n.config.dummies.height*hs(o.aimHeightRatio,0,1),d=Math.max(0,o.gravity),f=(u-e+.5*d*h*h)/h,g=hs(f,-s*.45,s*.92);return{vy:g,horizontal:Math.sqrt(Math.max(0,s*s-g*g))}}function V0(n,t,e){const i=n.config.combat.bow.trajectory,a=Math.max(0,Math.min(1,t)),s=i.speedMin+(i.speedMax-i.speedMin)*a,o=n.character.position,r=B0(n,e),l=H0(n,e,r),c=Math.sin(l),h=Math.cos(l),u=o.x+Math.sin(e)*.55,d=o.z+Math.cos(e)*.55,f=o.y+.95,g=G0(n,u,f,d,r,s),_={id:++n.arrowSeq,x:u,y:f,z:d,vx:c*g.horizontal,vy:g.vy,vz:h*g.horizontal,life:Math.max(.1,i.maxLife),stuck:!1,stuckDummy:-1,offX:0,offY:0,offZ:0,yaw:e,localYaw:0,pitch:0,rest:0,hit:!1,targetId:r,homing:Math.max(0,i.homingTime),turnRate:Math.max(0,i.turnRateDeg)*xs};return n.arrows.push(_),sl(n,"arrow-shot",a,_),_}function hs(n,t,e){return n<t?t:n>e?e:n}function X0(n,t){const e=n.arrows;if(e.length===0)return;const i=n.config.combat.bow.trajectory,a=n.config.dummies.radius,s=n.config.dummies.height,o=n.modules.hits&&n.modules.dummies,r=Math.max(0,i.gravity),l=[];for(const c of e){if(c.stuck){if(c.rest-=t,c.rest<=0)continue;if(c.stuckDummy>=0){const v=n.dummies[c.stuckDummy];if(v){const w=Math.cos(v.bodyYaw),S=Math.sin(v.bodyYaw);c.x=v.position.x+c.offX*w+c.offZ*S,c.y=v.position.y+c.offY,c.z=v.position.z-c.offX*S+c.offZ*w,c.yaw=v.bodyYaw+c.localYaw}}l.push(c);continue}if(c.life-=t,c.life<=0)continue;const h=c.x,u=c.y,d=c.z;if(c.homing>0&&(c.homing=Math.max(0,c.homing-t),c.targetId>0&&c.turnRate>0)){const v=n.dummies.find(w=>w.id===c.targetId);if(!v)c.targetId=0;else{const w=Math.hypot(c.vx,c.vz);if(w>Ki){const S=Math.atan2(v.position.x-c.x,v.position.z-c.z),E=Math.atan2(c.vx,c.vz),A=c.turnRate*t,b=E+hs(xh(S-E),-A,A);c.vx=Math.sin(b)*w,c.vz=Math.cos(b)*w;const M=Math.hypot(v.position.x-c.x,v.position.z-c.z);if(M>.3){const P=M/w,F=(v.position.y+s*hs(i.aimHeightRatio,0,1)-c.y+.5*r*P*P)/P,N=Math.max(0,i.verticalTurnRate)*t;c.vy+=hs(F-c.vy,-N,N)}}}}c.yaw=Math.atan2(c.vx,c.vz),c.pitch=-Math.atan2(c.vy,Math.hypot(c.vx,c.vz)),c.vy-=r*t;const f=h+c.vx*t,g=u+c.vy*t,_=d+c.vz*t;let m=-1,p=2;if(o)for(let v=0;v<n.dummies.length;v++){const w=n.dummies[v],S=O0(h,u,d,f,g,_,w.position.x,w.position.z,w.position.y,s,a+i.radius);S>=0&&S<p&&(p=S,m=v)}if(m>=0){const v=n.dummies[m];c.x=h+(f-h)*p,c.y=u+(g-u)*p,c.z=d+(_-d)*p,c.stuck=!0,c.stuckDummy=m;const w=Math.cos(v.bodyYaw),S=Math.sin(v.bodyYaw),E=c.x-v.position.x,A=c.z-v.position.z;c.offX=E*w-A*S,c.offZ=E*S+A*w,c.offY=c.y-v.position.y;const b=Math.atan2(c.vx,c.vz);c.localYaw=b-v.bodyYaw,c.yaw=b,c.pitch=Math.atan2(-c.vy,Math.hypot(c.vx,c.vz)),c.rest=Math.max(.2,i.stickSec),c.hit=!0;const M=Math.hypot(c.vx,c.vz);uo(n,m,{type:"light",duration:.22,dirX:M>Ki?c.vx/M:0,dirZ:M>Ki?c.vz/M:1,knockback:.14}),sl(n,"arrow-land",v.id,c),l.push(c);continue}const y=eo(n.boxes,f,_,g+.4,.04,0,6),x=Number.isFinite(y)?y:0;if(g<=x+.02&&c.vy<0){c.x=f,c.y=x+Math.max(0,i.groundStickLift),c.z=_,c.stuck=!0,c.stuckDummy=-1,c.yaw=Math.atan2(c.vx,c.vz);const v=Math.atan2(-c.vy,Math.max(Ki,Math.hypot(c.vx,c.vz)));c.pitch=Math.max(v,Math.max(0,i.stickMinPitchDeg)*xs),c.rest=Math.max(.2,i.stickSec),sl(n,"arrow-land",-1,c),l.push(c);continue}c.x=f,c.y=g,c.z=_,l.push(c)}n.arrows=l}const ol=1e-6,W0=Math.PI/180;function rl(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function vh(n,t,e){return n<t?t:n>e?e:n}function Or(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function cl(n){const t=n.id,e=n.windowId;Object.assign(n,Or()),n.id=t,n.windowId=e}function Y0(n){cl(n)}function $f(n){cl(n.playerLink);for(const t of n.dummies)cl(t.link)}function $0(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function ll(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const a=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;a<=0||(i.linkWindow=Math.max(i.linkWindow,a),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function br(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,Or()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function Z0(n,t){const e=n.config.links.search,i=n.character.position,a=vh(e.maxAngleDeg,0,180)*W0;let s=0,o=t,r=Number.POSITIVE_INFINITY;for(const l of n.dummies){const c=l.position.x-i.x,h=l.position.z-i.z,u=Math.hypot(c,h);if(u<ol||u>e.range)continue;const d=Math.atan2(c,h);Math.abs(He(d-t))>a||u<r&&(r=u,s=l.id,o=d)}return{id:s,yaw:o,dist:s>0?r:0}}function j0(n,t,e,i){const a=n.config.links,s=n.playerLink,o=n.character.position,r=to(n,t),l=Z0(n,r),c=l.id>0?l.yaw:r,h=l.id>0?vh(l.dist-a.search.stopDistance,0,e.distance):a.noTargetFallback?e.distance:0;s.phase="windup",s.linkWindow=0,s.source="none",s.usedWindowId=s.windowId,s.cooldown=a.sharedCooldown,s.kind=e.kind,s.weapon=i,s.id+=1,s.timer=0,s.progress=0,s.facing=c,s.targetId=l.id,s.targetDist=l.dist,s.travel=h,s.travelled=0,s.fromX=o.x,s.fromZ=o.z,s.pulseTimer=0,s.hitIds=[],s.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,a.sharedCooldown),rl(n,"link-start",s.id)}function q0(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){br(n);return}if(e.weapon!==n.combat.weapon){br(n);return}e.timer+=t;const a=l=>l==="windup"?i.windup:l==="active"?i.active:i.recovery;let s=0;for(;e.phase!=="idle"&&s++<8;){const l=a(e.phase);if(e.timer<l)break;e.timer-=l,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,rl(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,rl(n,"link-end",e.id))}const o=i.windup+i.active+i.recovery;let r=0;if(e.phase==="windup"?r=e.timer:e.phase==="active"?r=i.windup+e.timer:e.phase==="recovery"?r=i.windup+i.active+e.timer:r=o,e.progress=o>0?vh(r/o,0,1):1,e.phase==="active"&&i.active>ol){const l=Math.max(0,e.travel-e.travelled),c=Math.max(ol,i.active-e.timer),h=l/c;n.impulse.x=Math.sin(e.facing)*h,n.impulse.z=Math.cos(e.facing)*h}}function K0(n,t,e){const i=n.config.links,a=n.playerLink,s=n.character.position;if(a.consumedAttack=!1,n.combat.hitstop>0)return;if(a.phase==="active"&&(a.travelled+=Math.hypot(s.x-a.fromX,s.z-a.fromZ)),a.fromX=s.x,a.fromZ=s.z,!i.enabled||!n.modules.links){a.phase!=="idle"&&br(n);return}const o=n.combat,r=n.character.sprinting;r&&i.triggerWhileSprinting&&a.phase==="idle"&&a.usedWindowId!==a.windowId&&i.windows.sprint>0&&(a.linkWindow=Math.max(a.linkWindow,i.windows.sprint),a.source="sprint"),a.phase==="idle"&&a.prevSprinting&&!r&&ll(n,"sprint"),a.prevSprinting=r,q0(n,t);const l=i.moves[o.weapon];e.attackPressed&&a.phase==="idle"&&a.linkWindow>0&&a.usedWindowId!==a.windowId&&a.cooldown<=0&&o.phase==="idle"&&!o.charging&&n.dash.phase==="idle"&&!!l&&l.enabled&&j0(n,e,l,o.weapon)}const lr={windup:0,active:1,recovery:2},Ed=1e-9;function Zf(n){return Number.isFinite(n)?n<0?0:n>1?1:n:0}function J0(n){return n==="windup"||n==="active"||n==="recovery"}function Q0(n,t){return lr[n]+Zf(t)}function tg(n,t,e){if(!n||n.length===0)return[];if(!Number.isFinite(e)||e<0)return[];const i=Number.isFinite(t)?t:-1,a=[];for(const s of n){if(!s||!J0(s.at))continue;const o=Zf(s.u??0),r=lr[s.at]+o;r>i+Ed&&r<=e+Ed&&a.push({name:s.name,value:Number.isFinite(s.value)?s.value:0,at:s.at,u:o})}return a.sort((s,o)=>lr[s.at]+s.u-(lr[o.at]+o.u)),a}const no=1e-6;function Ji(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function eg(n,t,e){const i=n.character.position;n.events.push({type:"notify",tick:n.tick,x:i.x,y:i.y,z:i.z,value:e,name:t})}function jf(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function Br(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.hitstop=0,t.notifyCursor=-1,t.hitIds.length=0,t.warp=1,t.warpDebt=0,t.warpPhase=0,t.warpTimer=0,t.slamAttackId=0,t.timings=jf()}function qf(n){return{weapon:na[Math.max(0,n-1)]??na[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,hitstop:0,notifyCursor:-1,hitIds:[],warp:1,warpDebt:0,warpPhase:0,warpTimer:0,slamAttackId:0,timings:jf()}}function ng(n,t){return to(n,t)}function ig(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,a=Math.max(0,t*e.maxLungeScale),s=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+s,a)}function Kf(n,t,e,i){const a=n.combat;a.phase="windup",a.phaseTimer=0,a.comboIndex=i,a.queued=!1,a.charging=!1,a.charge=0,a.attackFacing=ng(n,t),a.attackProgress=0,a.timings=e,a.attackId+=1,a.warpDebt=0,a.warpPhase=0,a.warpTimer=0,a.warp=1,a.notifyCursor=-1,a.hitIds.length=0,Ji(n,"attack-start",i)}function Jf(n){return Math.max(0,n.config.combat.settle)}function hl(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];Kf(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Jf(n),lunge:ig(n,i.lunge[e-1]??0)},e)}function Td(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,Kf(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Jf(n),lunge:i.lunge},0),V0(n,e,n.combat.attackFacing),Ji(n,"charge-release",e)}function ag(n,t){const e=n.combat,i=n.config.hits.hitstopWarp;if(!i||!i.enabled)return e.warp=e.hitstop>0?0:1,e.warp;const a=Math.max(0,Math.min(1,i.holdRate));if(e.hitstop>0)return e.warpPhase=1,e.warpTimer=e.hitstop,e.warp=a,e.warpDebt+=t*(1-a),e.warp;if(e.warpPhase===1&&(e.warpPhase=2,e.warpTimer=0),e.warpPhase===2){const s=Math.max(.001,i.release);e.warpTimer+=t;const o=Math.min(1,e.warpTimer/s),r=1-(1-o)*(1-o),l=a+(1-a)*r;if(e.warp=l,e.warpDebt+=t*(1-l),o>=1){e.warpPhase=3,e.warpTimer=0;const c=Math.max(0,e.timings.recovery)*Math.max(0,i.payback-1)*Math.max(0,Math.min(1,i.paybackBudget));e.warpDebt=Math.min(e.warpDebt,c)}return e.warp}if(e.warpPhase===3&&e.warpDebt>1e-6){const s=Math.min(Math.max(0,i.payback-1),e.warpDebt/Math.max(t,1e-5));return e.warp=1+s,e.warpDebt=Math.max(0,e.warpDebt-t*s),e.warpDebt<=1e-6&&(e.warpPhase=0,e.warp=1),e.warp}return e.warpPhase=0,e.warp=1,1}function sg(n,t,e){const i=n.combat;if(i.phase==="idle"){i.warp=1,i.warpPhase=0,i.warpTimer=0,i.warpDebt=0;return}const a=i.timings,s=ag(n,t),o=t*s;i.phaseTimer+=o;let r=0;for(;i.phase!=="idle"&&r++<8;){const h=i.phase==="windup"?a.windup:i.phase==="active"?a.active:i.phase==="recovery"?a.recovery:a.settle;if(i.phaseTimer<h)break;if(i.phaseTimer-=h,i.phase==="windup")i.phase="active",Ji(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",i.warpPhase=0,i.warpDebt=0,i.warpTimer=0,i.warp=1,Ji(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.weapons[i.weapon].comboWindow??n.config.combat.comboWindow,i.queued){i.queued=!1;const u=n.config.combat.weapons[i.weapon];u.comboCount>0&&hl(n,e,i.comboIndex<u.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const h=i.timings.recovery;if(h>no&&i.phaseTimer>=h*n.config.combat.cancelWindow){i.queued=!1;const u=n.config.combat.weapons[i.weapon];u.comboCount>0&&hl(n,e,i.comboIndex<u.comboCount?i.comboIndex+1:1)}}const l=a.windup+a.active+a.recovery;let c=0;i.phase==="windup"?c=i.phaseTimer:i.phase==="active"?c=a.windup+i.phaseTimer:i.phase==="recovery"?c=a.windup+a.active+i.phaseTimer:i.phase==="settle"&&(c=l),i.phase!=="idle"&&(i.attackProgress=l>0?Math.min(1,c/l):1),og(n)}function og(n){const t=n.combat;if(t.phase==="idle")return;const e=t.timings,i=t.phase==="windup"?e.windup:t.phase==="active"?e.active:t.phase==="recovery"?e.recovery:0,a=i>no?Math.min(1,Math.max(0,t.phaseTimer/i)):1,s=t.phase==="settle"?3:Q0(t.phase,a);if(s<=t.notifyCursor+no)return;const o=n.config.combat.weapons[t.weapon].notifies;for(const r of tg(o,t.notifyCursor,s))eg(n,r.name,r.value);t.notifyCursor=s}function rg(n,t,e){const i=n.combat,a=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=na.length){const l=na[e.weaponSlot-1];l!==i.weapon&&(i.weapon=l,Br(n),br(n),Ji(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,Ji(n,"combo-reset",0))),i.hitstop>0&&(n.impulse.x=0,n.impulse.z=0,n.character.velocity.x=0,n.character.velocity.z=0),sg(n,t,e);const s=a.weapons[i.weapon],o=n.dash.phase==="active";if(s.comboCount>0){const l=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!o&&!l&&(e.attackPressed||a.autoCombo&&e.attackHeld))if(i.phase==="idle"){const h=i.comboWindow>0&&i.comboIndex<s.comboCount?i.comboIndex+1:1;hl(n,e,h)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&!o&&!n.playerLink.consumedAttack){if(e.attackHeld){if(i.charging||(i.charging=!0,i.charge=0,Ji(n,"charge-start",0)),i.charge=Math.min(1,i.charge+t/Math.max(a.bow.maxChargeTime,no)),a.bow.autoFire&&i.charge>=1){i.charging=!1;const l=i.charge;i.charge=0,Td(n,e,l)}}else if(i.charging){i.charging=!1;const l=i.charge;i.charge=0,l>=a.bow.minChargeToFire?Td(n,e,l):Ji(n,"charge-release",0)}}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.hitstop<=0&&i.timings.active>no)){const l=i.timings.active,c=Math.max(0,i.timings.lunge),h=Math.max(.2,a.lungeCurve),u=m=>c*(1-Math.pow(1-Math.min(1,Math.max(0,m/l)),h+1)),d=t*i.warp,f=Math.min(l,Math.max(0,i.phaseTimer)),g=Math.min(l,Math.max(0,i.phaseTimer-d));let _=Math.max(0,u(f)-u(g))/Math.max(d,1e-4);_=Math.min(_,Math.max(0,a.lungeMaxSpeed)),n.impulse.x=Math.sin(i.attackFacing)*_,n.impulse.z=Math.cos(i.attackFacing)*_}i.hitstop>0&&(i.hitstop=Math.max(0,i.hitstop-t))}const dl=1e-6;function uc(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function cg(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function Qf(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function Ad(n,t,e){return n<t?t:n>e?e:n}function lg(n,t,e){const i=n.config.dash,s=n.character.position,o=n.config.worldBounds,r=Math.max(.05,i.blinkStep),l=Math.max(0,i.blinkDistance);let c=0,h=s.x,u=s.z;for(;c<l-dl;){const d=Math.min(l,c+r),f=s.x+t*d,g=s.z+e*d,_=Ad(f,o.minX,o.maxX),m=Ad(g,o.minZ,o.maxZ),p={x:_,y:s.y,z:m};if(gh(n.boxes,p,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(h=_,u=m,c=d,_!==f||m!==g))break}return{x:h,z:u}}function hg(n,t,e){const i=n.dash,a=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,ll(n,"roll")),i.cooldown>0){const l=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),l>0&&i.cooldown===0&&uc(n,"dash-ready",0)}const s=n.combat,o=s.weapon==="bow"&&(s.charging||s.phase!=="idle");if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&(s.phase==="idle"||o)&&n.playerLink.phase==="idle"){o&&(s.charging=!1,s.charge=0,s.phase!=="idle"&&Br(n));const l=r0(n,e),c=l.x,h=l.z,u=n.combat.weapon==="staff";if(i.kind=u?"blink":"roll",i.dirX=c,i.dirZ=h,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=u?a.blinkCooldown:a.rollCooldown,u){const d=lg(n,c,h);n.character.position.x=d.x,n.character.position.z=d.z,i.toX=d.x,i.toZ=d.z,i.duration=0,i.timer=0,i.phase="idle",a.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),ll(n,"blink"),uc(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(dl,a.rollDuration),i.timer=i.duration,i.toX=i.fromX+c*a.rollDistance,i.toZ=i.fromZ+h*a.rollDistance,uc(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const l=Math.max(dl,i.timer),c=n.character.position.x,h=n.character.position.z;n.impulse.x=(i.toX-c)/l,n.impulse.z=(i.toZ-h)/l}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const an=1e-6,ul=Math.PI*2,dg=7,ug=18,tp=1.3,ep=.4,fg=.9,Rd=.9;function Pd(n,t,e,i){const a=Math.max(e,.1),s=((n+t*2.37)%a+a)%a,o=Math.min(Math.max(i,0),1)*a;if(o<=an||s>=o)return 0;const r=Math.min(Math.max(a*.12,.15),o*.5),l=Math.min(1,Math.min(s/r,(o-s)/r));return l*l*(3-2*l)}function pg(n,t){const e=Math.hypot(n,t);return e<=1?{x:n,z:t}:{x:n/e,z:t/e}}function mg(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Cd(n,t,e,i){return n+mg(t-n)*(1-Math.exp(-Math.max(e,an)*i))}function Sr(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function gg(n){var i;const t=[];for(let a=0;a<n.count;a++){const s=n.spawn[a]??{x:0,z:0},o=n.initialModes[a]??"idle";t.push(Ld(a+1,o,s.x,s.z,null))}const e=n.fighters;if(e)for(let a=0;a<e.weapons.length;a++){const s=e.spawn[a]??{x:0,z:0},o=((i=e.initialModes)==null?void 0:i[a])??"spar",r=e.attackInterval*(.25+.22*a);t.push(Ld(t.length+1,o,s.x,s.z,e.weapons[a],r))}return t}function Ld(n,t,e,i,a,s=0){return{id:n,mode:t,initialMode:t,homeX:e,homeZ:i,position:{x:e,y:0,z:i},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:e,targetZ:i,wanderTimer:0,attackCooldown:s,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,attackComboIndex:0,attackComboLeft:0,comboGap:0,hurt:zf(),link:Or(),weapon:a,combat:a?{...qf(na.indexOf(a)+1),weapon:a}:null}}function xg(n,t=!1){const e=t?If:o0,i=e.indexOf(n);return e[(i+1)%e.length]}function np(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],a=t.spawn[e]??{x:i.homeX,z:i.homeZ},s=t.initialModes[e]??i.initialMode;i.mode=s,i.initialMode=s,i.homeX=a.x,i.homeZ=a.z,i.position.x=a.x,i.position.y=0,i.position.z=a.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=a.x,i.targetZ=a.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0,i.attackComboIndex=0,i.attackComboLeft=0,i.comboGap=0;const o=i.hurt;if(o.type="none",o.timer=0,o.duration=0,o.dirX=0,o.dirZ=0,o.knockX=0,o.knockZ=0,Y0(i.link),i.combat){const r=i.combat;r.phase="idle",r.comboIndex=0,r.phaseTimer=0,r.attackProgress=0,r.attackFacing=0,r.charging=!1,r.charge=0,r.hitstop=0,r.warp=1,r.warpPhase=0,r.warpDebt=0,r.warpTimer=0,r.hitIds.length=0,r.timings={windup:0,active:0,recovery:0,settle:0,lunge:0}}}n.dummyAttackCount=0}function vg(n,t,e){const i=dc(n)*ul,a=Math.sqrt(dc(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*a,t.targetZ=t.homeZ+Math.sin(i)*a,t.wanderTimer=e.wanderInterval*(.6+dc(n)*.8)}function yh(n,t,e){if(t.weapon){const i=n.config.combat.weapons[t.weapon];if(i)return{windup:i.windup,active:i.active,recovery:i.recovery}}return{windup:e.attackWindup,active:e.attackActive,recovery:e.attackRecovery}}function fl(n,t,e){var s;if(!t.weapon)return e.attackRange;const i=n.config.hits.reach[t.weapon]??e.attackRange,a=((s=e.fighters)==null?void 0:s.attackRangeScale)??.9;return Math.max(.4,i*a)}function pl(n,t){return n.weapon&&t.fighters?t.fighters.attackInterval:t.attackInterval}function yg(n,t){return n.weapon&&t.fighters?Math.max(t.leashRadius,t.fighters.leashRadius):t.leashRadius}function _g(n,t,e){const i=yh(e,n,t);return n.attackPhase==="windup"?i.windup:n.attackPhase==="active"?i.active:n.attackPhase==="recovery"?i.recovery:0}function Mg(n,t,e){var s;if(!t.weapon)return 1;const i=((s=e.fighters)==null?void 0:s.comboCount)??0;if(i>0)return Math.max(1,Math.round(i));const a=n.config.combat.weapons[t.weapon];return Math.max(1,Math.round((a==null?void 0:a.comboCount)??1))}function bg(n,t){var i;const e=((i=t.fighters)==null?void 0:i.comboGap)??0;return e>0?e:Math.max(0,n.config.combat.settle)}function Sg(n){return n.attackPhase!=="idle"||n.attackComboLeft>0}function wg(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0,Dd(n,t,i);return}t.attackPhaseTimer+=e;let a=0;for(;t.attackPhase!=="idle"&&a++<4;){const l=Math.max(_g(t,i,n),an);if(t.attackPhaseTimer<l)break;t.attackPhaseTimer-=l,t.attackPhase==="windup"?(t.attackPhase="active",Sr(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0,t.attackComboLeft>0?t.comboGap=bg(n,i):(t.attackComboIndex=0,t.weapon&&t.attackCooldown<=0&&(t.attackCooldown=pl(t,i)*ep)))}const s=yh(n,t,i),o=s.windup+s.active+s.recovery;let r=0;t.attackPhase==="windup"?r=t.attackPhaseTimer:t.attackPhase==="active"?r=s.windup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(r=s.windup+s.active+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||o<=0?0:Math.min(1,r/o),Dd(n,t,i)}function Dd(n,t,e){const i=t.combat;if(!i)return;const a=yh(n,t,e),s=t.attackPhase==="idle"&&t.attackComboLeft>0&&t.comboGap>0;i.weapon=t.weapon??i.weapon,i.phase=s?"settle":t.attackPhase,i.comboIndex=t.attackComboIndex,i.phaseTimer=t.attackPhaseTimer,i.attackProgress=s?1:t.attackProgress,i.attackFacing=t.facing,i.timings={windup:a.windup,active:a.active,recovery:a.recovery,settle:0,lunge:0},i.hitstop=0,i.warp=1,i.warpPhase=0,i.charging=!1,i.charge=0}function Eg(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,a=i.x-t.position.x,s=i.z-t.position.z,o=Math.hypot(a,s),r=o>an?a/o:0,l=o>an?s/o:0;let c=0,h=0;if(t.mode==="wander"){const d=t.targetX-t.position.x,f=t.targetZ-t.position.z,g=Math.hypot(d,f);(t.wanderTimer<=0||g<.3)&&vg(n,t,e);const _=t.targetX-t.position.x,m=t.targetZ-t.position.z,p=Math.hypot(_,m);p>an&&(c=_/p,h=m/p)}else if(t.mode==="follow")o>e.followStopDistance&&(c=r,h=l);else if(t.mode==="keep-distance"){const d=o-e.keepDistance,f=Math.max(e.keepDeadZone,.2),g=Math.max(-1,Math.min(1,d/f))*Rd,_=Pd(n.time,t.id,e.strafePeriod,e.strafeDuty)*e.keepStrafe;c=r*g-l*_,h=l*g+r*_}else if(t.mode==="attack")o>fl(n,t,e)&&t.attackPhase==="idle"&&(c=r,h=l);else if(t.mode==="spar"){const d=fl(n,t,e),f=d*1.7;if(Sg(t))o>d*tp?(c=r,h=l):o<d*.55&&(c=-r*.6,h=-l*.6);else if(t.attackPhase==="idle"&&t.attackCooldown<=0&&o>d)c=r,h=l;else{const _=Math.max(-1,Math.min(1,(o-f)/.5))*Rd,m=Pd(n.time,t.id,e.strafePeriod,e.strafeDuty)*fg;c=r*_-l*m,h=l*_+r*m}}({x:c,z:h}=pg(c,h));let u=t.facing;if(t.mode==="wander"?Math.hypot(c,h)>an&&(u=Math.atan2(c,h)):o>an&&(u=Math.atan2(r,l)),e.leashRadius>an&&t.mode!=="wander"&&t.mode!=="idle"){const d=yg(t,e),f=t.position.x-t.homeX,g=t.position.z-t.homeZ,_=Math.hypot(f,g);if(_>d){const m=Math.min(1,(_-d)/Math.max(d*.5,.5)),p=-f/_,y=-g/_;c=c*(1-m)+p*m,h=h*(1-m)+y*m;const x=Math.hypot(c,h);x>an&&(c/=x,h/=x)}}return{x:c,z:h,facing:u}}function Tg(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.comboGap=Math.max(0,e.comboGap-t),e.hurt.timer>0&&(e.attackComboLeft=0,e.comboGap=0),(e.mode==="attack"||e.mode==="spar")&&e.attackPhase==="idle"&&e.hurt.timer<=0){const y=n.character.position,x=Math.hypot(y.x-e.position.x,y.z-e.position.z),v=fl(n,e,i);if(e.attackComboLeft>0)e.comboGap<=0&&(x<=v*tp+an?(e.attackComboIndex+=1,e.attackComboLeft-=1,e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,n.dummyAttackCount+=1,Sr(n,"dummy-attack",e)):(e.attackComboLeft=0,e.attackComboIndex=0,e.attackCooldown=Math.max(e.attackCooldown,pl(e,i)*ep)));else if(e.attackCooldown<=0&&x<=v+an){const w=Mg(n,e,i);e.attackComboIndex=1,e.attackComboLeft=Math.max(0,w-1),e.comboGap=0,e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=pl(e,i),n.dummyAttackCount+=1,Sr(n,"dummy-attack",e)}}wg(n,e,t,i);const a=Eg(n,e,i),s=n.config.worldBounds;(a.x>0&&e.position.x>=s.maxX-an||a.x<0&&e.position.x<=s.minX+an)&&(a.x=0),(a.z>0&&e.position.z>=s.maxZ-an||a.z<0&&e.position.z<=s.minZ+an)&&(a.z=0);const o=1-Math.exp(-Math.max(i.acceleration,an)*t),r=e.weapon&&i.fighters?i.fighters.moveSpeed:i.moveSpeed;e.velocity.x+=(a.x*r-e.velocity.x)*o,e.velocity.z+=(a.z*r-e.velocity.z)*o,e.facing=a.facing,e.bodyYaw=Cd(e.bodyYaw,e.facing,dg,t),e.headYaw=Cd(e.headYaw,e.facing,ug,t);const l=e.position.x,c=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const h=n.config.stepHeight;if(mh(n.boxes,e.position,i.radius,i.height,h))if(gh(n.boxes,e.position,i.radius,i.height,h))e.position.x=l,e.position.z=c,e.velocity.x=0,e.velocity.z=0;else{const y=e.position.x-l,x=e.position.z-c;Math.abs(y)<Math.abs(e.velocity.x*t)*.5&&(e.velocity.x=0),Math.abs(x)<Math.abs(e.velocity.z*t)*.5&&(e.velocity.z=0)}const d=n.config.worldBounds;e.position.x<d.minX?(e.position.x=d.minX,e.velocity.x<0&&(e.velocity.x=0),e.hurt.knockX<0&&(e.hurt.knockX=0)):e.position.x>d.maxX&&(e.position.x=d.maxX,e.velocity.x>0&&(e.velocity.x=0),e.hurt.knockX>0&&(e.hurt.knockX=0)),e.position.z<d.minZ?(e.position.z=d.minZ,e.velocity.z<0&&(e.velocity.z=0),e.hurt.knockZ<0&&(e.hurt.knockZ=0)):e.position.z>d.maxZ&&(e.position.z=d.maxZ,e.velocity.z>0&&(e.velocity.z=0),e.hurt.knockZ>0&&(e.hurt.knockZ=0));const f=eo(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,h,Number.POSITIVE_INFINITY);f>Number.NEGATIVE_INFINITY&&f<=e.position.y+h+an&&(e.position.y=f);const g=Math.hypot(e.position.x-l,e.position.z-c);e.distance+=g;const _=Math.hypot(e.velocity.x,e.velocity.z),m=Math.min(n.config.strideSpeedCap,_/Math.max(n.config.moveSpeed,an)),p=Math.max(n.config.strideLength*(1+m*n.config.strideSpeedGain),an);e.stride=p,e.gaitPhase=(e.gaitPhase+g/p*ul)%ul}function Ag(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const a=n.dummies[e.dummyClickId-1];a.mode=xg(a.mode,!!a.weapon),a.targetX=a.position.x,a.targetZ=a.position.z,a.wanderTimer=0,a.attackCooldown=0,a.attackPhase="idle",a.attackPhaseTimer=0,a.attackProgress=0,a.attackComboIndex=0,a.attackComboLeft=0,a.comboGap=0,a.combat&&(a.combat.phase="idle",a.combat.attackProgress=0,a.combat.comboIndex=0),Sr(n,"dummy-mode",a)}for(const a of n.dummies)Tg(n,t,a,i)}const ei=1e-6,kd=Math.PI*2;function Id(n,t){return Math.sqrt(n*n+t*t)}function Ao(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Rg(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.headPitch=0,t.bodyPitch=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,Br(n)}function Pg(n,t,e){const i=n.character,a=n.config,s=eo(n.boxes,t,e,a.characterHeight,a.characterRadius,a.stepHeight,Number.POSITIVE_INFINITY);i.position.x=t,i.position.y=s>Number.NEGATIVE_INFINITY?s:0,i.position.z=e,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.moveYaw=0,i.bodyYaw=0,i.headYaw=0,i.headPitch=0,i.bodyPitch=0,i.grounded=!0,i.sprinting=!1,i.gaitPhase=0,i.stride=a.strideLength,i.distance=0,i.coyoteTime=a.coyoteTime,i.jumpBuffer=0,Br(n),$f(n),Qf(n),Vf(n),Yf(n),_r(n);const o=n.targeting;o.targetId=0,o.targetYaw=0,o.targetDist=0,o.hasTarget=!1;const r=n.playerHurt;r.type="none",r.lastAt=uh,r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,n.events.length=0}function Cg(n,t,e){const i=n.config,a=n.character,s=a.position,o=a.velocity;let r=Number.isFinite(e.moveX)?e.moveX:0,l=Number.isFinite(e.moveZ)?e.moveZ:0;const c=Id(r,l);c>1&&(r/=c,l/=c);const h=i.worldBounds;(r>0&&s.x>=h.maxX-ei||r<0&&s.x<=h.minX+ei)&&(r=0),(l>0&&s.z>=h.maxZ-ei||l<0&&s.z<=h.minZ+ei)&&(l=0);const u=n.combat.phase!=="idle",d=n.playerLink.phase!=="idle",f=n.dash.phase==="active",g=u||f||d;a.sprinting=!g&&e.sprintHeld&&c>ei;const _=i.combat.weapons[n.combat.weapon];let m=_?_.moveMultiplier:1;f||d?m=0:u?m*=n.combat.phase==="active"?i.combat.lungeMoveScale:n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?m*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(m*=Math.max(0,Math.min(1,n.abilities.channelMoveScale)));const p=i.moveSpeed*(a.sprinting?i.sprintMultiplier:1)*m;{const F=g?i.skillDecel:c>ei?i.acceleration:i.friction,N=1-Math.exp(-F*t);o.x+=(r*p-o.x)*N,o.z+=(l*p-o.z)*N}e.jumpPressed?a.jumpBuffer=i.jumpBufferTime:a.jumpBuffer=Math.max(0,a.jumpBuffer-t),a.coyoteTime=a.grounded?i.coyoteTime:Math.max(0,a.coyoteTime-t),a.jumpBuffer>0&&a.coyoteTime>0&&(o.y=i.jumpSpeed,a.grounded=!1,a.coyoteTime=0,a.jumpBuffer=0,Ao(n,"jumped",i.jumpSpeed)),n.events.some(F=>F.type==="blink"&&F.tick===n.tick)&&(o.x=0,o.z=0,n.impulse.x=0,n.impulse.z=0);const x=s.x,v=s.z;if(s.x+=(o.x+n.impulse.x+n.playerHurt.knockX)*t,s.z+=(o.z+n.impulse.z+n.playerHurt.knockZ)*t,mh(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight)){if(gh(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight))s.x=x,s.z=v,o.x=0,o.z=0;else{const F=s.x-x,N=s.z-v;Math.abs(F)<Math.abs(o.x*t)*.5&&(o.x=0),Math.abs(N)<Math.abs(o.z*t)*.5&&(o.z=0)}Ao(n,"blocked",1)}s.x<h.minX?(s.x=h.minX,o.x<0&&(o.x=0),n.playerHurt.knockX<0&&(n.playerHurt.knockX=0)):s.x>h.maxX&&(s.x=h.maxX,o.x>0&&(o.x=0),n.playerHurt.knockX>0&&(n.playerHurt.knockX=0)),s.z<h.minZ?(s.z=h.minZ,o.z<0&&(o.z=0),n.playerHurt.knockZ<0&&(n.playerHurt.knockZ=0)):s.z>h.maxZ&&(s.z=h.maxZ,o.z>0&&(o.z=0),n.playerHurt.knockZ>0&&(n.playerHurt.knockZ=0));const S=eo(n.boxes,s.x,s.z,s.y,i.characterRadius,i.stepHeight,i.fallTolerance);a.grounded&&S>s.y+ei&&S-s.y<=i.stepHeight+ei&&(s.y=S,o.y=0,Ao(n,"stepUp",S));const E=s.y;o.y-=i.gravity*t,s.y+=o.y*t;const A=eo(n.boxes,s.x,s.z,E,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);A>Number.NEGATIVE_INFINITY&&s.y<=A&&o.y<=0?(s.y=A,o.y=0,a.grounded||Ao(n,"landed",A),a.grounded=!0):a.grounded=!1;const b=Id(s.x-x,s.z-v);a.distance+=b;const M=b/Math.max(t,ei),P=Math.min(i.strideSpeedCap,M/Math.max(i.moveSpeed,ei)),C=Math.max(i.strideLength*(1+P*i.strideSpeedGain),ei);a.stride=C,a.gaitPhase=(a.gaitPhase+b/C*kd)%kd}const ml=1e-6,Fd=2.399963229728653;function ba(n,t,e){return n<t?t:n>e?e:n}function zd(n,t,e,i,a,s,o,r,l){const c=t.x-n.x,h=t.z-n.z,u=Math.hypot(c,h),d=e+i;if(u>=d)return;let f,g,_;u<ml?(f=r,g=l,_=d):(f=c/u,g=h/u,_=d-u);const m=_+o;n.x-=f*m*a,n.z-=g*m*a,t.x+=f*m*s,t.z+=g*m*s}function Lg(n){const t=n.config.separation,e=n.dummies,i=n.character.position,a=n.config.characterRadius,s=n.config.dummies.radius,o=Math.max(1,Math.floor(t.iterations)),r=Math.max(0,t.slop);for(let h=0;h<o;h++){for(let u=0;u<e.length;u++)for(let d=u+1;d<e.length;d++){const f=(u*3+d)*Fd;zd(e[u].position,e[d].position,s,s,.5,.5,r,Math.cos(f),Math.sin(f))}for(let u=0;u<e.length;u++){const d=(u+1)*Fd;zd(i,e[u].position,a,s,0,1,r,Math.cos(d),Math.sin(d))}}const l=n.config.stepHeight,c=n.config.worldBounds;for(const h of e)mh(n.boxes,h.position,s,n.config.dummies.height,l),h.position.x=ba(h.position.x,c.minX,c.maxX),h.position.z=ba(h.position.z,c.minZ,c.maxZ)}function Dg(n,t,e,i,a,s,o,r){const l=Math.hypot(e,i),c=Math.max(0,r.contactBand),h=ba(r.minScale,0,1);if(l<ml||c<=0||h>=1)return 1;const u=a+o,d=ba(r.approachDot,0,.99);let f=0;for(const g of s){const _=g.position.x-n,m=g.position.z-t,p=Math.hypot(_,m);if(p>=u+c)continue;if(p<ml){f=1;continue}const y=(e*_+i*m)/(l*p);if(y<=d)continue;const x=ba(1-(p-u)/c,0,1),v=ba((y-d)/(1-d),0,1);f=Math.max(f,x*v)}return 1-(1-h)*ba(f,0,1)}function kg(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=Dg(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const fc=1e-6,Ig=Math.PI/180;function Fg(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function zg(n,t,e){return n<t?t:n>e?e:n}function Ng(n,t,e){const i=n.config.targeting,a=n.targeting,s=n.character.position;let o=n.character.facing;const r=Math.hypot(e.aimX,e.aimZ);e.aimActive&&r>fc?o=Math.atan2(e.aimX,e.aimZ):Math.hypot(e.moveX,e.moveZ)>fc&&(o=Math.atan2(e.moveX,e.moveZ));const l=zg(i.maxAngleDeg,0,180)*Ig;let c=Number.POSITIVE_INFINITY,h=0,u=0,d=0;for(const f of n.dummies){const g=f.position.x-s.x,_=f.position.z-s.z,m=Math.hypot(g,_);if(m<fc||m>i.range)continue;const p=Math.atan2(g,_),y=Math.abs(He(p-o));if(y>l)continue;const x=m-i.frontBias*Math.cos(y);x<c&&(c=x,h=f.id,u=p,d=m)}a.targetId=h,a.targetYaw=u,a.targetDist=d,a.hasTarget=h>0}const gi=1e-6;function rs(n,t,e){return n<t?t:n>e?e:n}function Nd(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Ug(n,t,e){const i=n.config.gaze,a=n.gaze;if(!i.enabled||!n.modules.gaze){a.active=!1,a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}const s=n.character.position,o=(F,N)=>{const L=F.position.x-s.x,I=F.position.z-s.z,z=Math.hypot(L,I);if(z<gi||z>N)return 0;const G=rs((N-z)/Math.max(gi,N-i.nearDistance),0,1);let $=G*(i.modeWeight[F.mode]??.5);return F.attackPhase==="active"&&($+=i.attackBoost*G),$},r=[];let l=0,c=!1,h=!1,u=!1;for(const F of n.dummies){const N=o(F,i.threatRange),L=F.position.x-s.x,I=F.position.z-s.z,z=Math.hypot(L,I);N>0&&(r.push({id:F.id,x:F.position.x,z:F.position.z,dx:L,dz:I,yaw:Math.atan2(L,I),w:N}),l+=N,z<=i.approachDist&&(i.modeWeight[F.mode]??.5)>=i.hostileModeWeight&&(u=!0)),z>gi&&z<=i.recoveryDist&&(c=!0),(F.attackPhase==="windup"||F.attackPhase==="active")&&z<=i.threatRange&&(h=!0)}const d=l<=0?0:rs(l/(l+Math.max(gi,i.saturation)),0,1),f=r.length>0,g=a.active,_=f&&(e.aimActive&&d>=i.enterThreshold||i.reactToAttack&&h&&d>=i.enterThreshold||i.reactToApproach&&u),m=i.hurtHoldSec>gi&&n.time-n.playerHurt.lastAt<i.hurtHoldSec,p=g&&(c||m);if(a.active=_||p,!a.active){a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}if(r.length===0)return;r.sort((F,N)=>N.w-F.w);const y=r.slice(0,Math.max(1,i.maxThreats)),x=r[0],v=Math.atan2(x.dx,x.dz),w=i.behindAngleDeg*Math.PI/180,S=n.character.bodyYaw;let E=0,A=0,b=0;for(const F of y){const N=Math.abs(Nd(F.yaw-v))/Math.PI;let L=F.w/(1+Math.max(i.spreadFalloff,0)*N*N);F!==x&&i.behindFalloff<1&&Math.abs(Nd(F.yaw-S))>w&&(L*=Math.max(i.behindFalloff,0)),E+=F.x*L,A+=F.z*L,b+=L}a.mainId=x.id,a.mainYaw=v;const M=n.dummies.find(F=>F.id===x.id),P=(M?M.position.y:0)+n.config.dummies.height*rs(i.aimHeightRatio,0,1),C=s.y+n.config.characterHeight*rs(i.eyeHeightRatio,0,1);a.mainPitch=Math.atan2(P-C,Math.max(gi,Math.hypot(x.dx,x.dz))),a.centroidYaw=b>gi?Math.atan2(E/b-s.x,A/b-s.z):v,a.threatCount=r.length,a.threat=d}function Og(n,t){const e=n.config.gaze;return(e.modeWeight[t.mode]??.5)>=e.hostileModeWeight}function Bg(n,t){const e=n.config.gaze;if(!e.enabled||!n.modules.gaze)return 0;const i=n.character.position,a=Math.hypot(t.position.x-i.x,t.position.z-i.z);if(a<gi||a>e.threatRange)return 0;const s=Math.max(gi,e.threatRange-e.nearDistance),o=rs((e.threatRange-a)/s,0,1);let r=o*(e.modeWeight[t.mode]??.5);t.attackPhase==="active"&&(r+=e.attackBoost*o);const l=Math.max(gi,e.modeWeight.attack??1.5);return rs(r/l,0,1)}function Hg(){return{active:!1,mainId:0,mainYaw:0,mainPitch:0,centroidYaw:0,threatCount:0,threat:0}}function Gg(n,t){return{tick:0,time:0,rngState:2654435769,config:n,boxes:N0(t),gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:qf(1),playerLink:Or(),arrows:[],arrowSeq:0,abilities:I0(),skills:D0(n),impulse:{x:0,z:0},targeting:Fg(),turnInPlace:m0(),playerHurt:zf(),hitCount:0,dash:{...cg(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{...Xf(),centroidX:n.spawn.x,centroidZ:n.spawn.z},gaze:Hg(),dummies:gg(n.dummies),dummyAttackCount:0,events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,turnInPlace:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,gaze:!0,dummies:!0}}}function Vg(n){Rg(n),np(n),$f(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.lastAt=uh,e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,Vf(n),Yf(n),Qf(n),Wf(n),_r(n);const i=n.gaze;i.active=!1,i.mainId=0,i.mainYaw=0,i.mainPitch=0,i.centroidYaw=0,i.threatCount=0,i.threat=0,n.events.length=0}function Ud(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){Vg(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?Ng(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),K0(n,t,e),n.modules.combat&&rg(n,t,e),n.modules.dash&&hg(n,t,e),n.modules.movement&&Cg(n,t,e),n.modules.gaze&&Ug(n,t,e),n.modules.orientation&&y0(n,t,e),v0(n,t,e),n.modules.dummies&&Ag(n,t,e),c0(n,t),$0(n,t),n.modules.abilities&&F0(n,t,e),n.modules.combat&&X0(n,t),n.modules.dummies&&(p0(n,t),n.modules.separation&&(Lg(n),kg(n))),n.modules.camera?z0(n):Wf(n),n}const ip=["bodyYaw","bodyPitch","bodyRoll","pelvisX","pelvisZ","armPitch","armYaw","armRoll","elbow","bladePitch","armLPitch","armLYaw","armLRoll","elbowL","rootYaw","bladePitchOff","bladeTwist","bladeTwistOff","bladeYaw","bladeYawOff"],Od=1e-9;function Xg(n,t,e){return n<t?t:n>e?e:n}function ap(n){return Xg(Number.isFinite(n)?n:0,0,1)}function sp(n,t){const e=ap(t);return n==="in"?e*e:n==="out"?1-(1-e)*(1-e):n==="inOut"?e*e*(3-2*e):e}function Wg(){const n={};for(const t of ip)n[t]=0;return n}function Yg(n,t){const e=Wg(),i=(n==null?void 0:n.keys)??[];if(i.length===0)return e;const a=ap(t);let s=0;for(;s<i.length-1&&a>i[s+1].t+Od;)s+=1;const o=i[s],r=i[Math.min(s+1,i.length-1)],l=r.t-o.t,c=l>Od?(a-o.t)/l:0,h=sp(o.ease??"linear",c);for(const u of ip){const d=o.pose[u]??r.pose[u]??0,f=r.pose[u]??o.pose[u]??0;e[u]=d+(f-d)*h}return e}function $g(n,t){const e=n==null?void 0:n.spin;if(!e||!Number.isFinite(e.turns)||e.turns===0)return 0;const i=e.ease??"linear",a=Number.isFinite(e.span)&&e.span>0?Math.min(1,e.span):1,s=sp(i,t/a);return e.turns*Math.PI*2*s}function la(n,t){return((n==null?void 0:n.keys)??[]).some(e=>typeof e.pose[t]=="number")}function Zg(n){let t=0;return{frame(e,i,a,s,o){if(s||a<=0)return t=0,0;t+=Math.min(e,.1)*a;const r=n.config.fixedDt,l=n.config.maxStepsPerFrame;let c=0;for(;t>=r&&c<l;){const h=c===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};Ud(n,r,h),o&&o(),t-=r,c++}return c>=l&&(t=0),c},singleStep(e){Ud(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t},get alpha(){const e=n.config.fixedDt;return e>0?Math.max(0,Math.min(1,t/e)):1}}}function Ei(n,t,e){let i=t-n;for(;i>Math.PI;)i-=Math.PI*2;for(;i<-Math.PI;)i+=Math.PI*2;return n+i*e}function Ce(n,t,e){return n+(t-n)*e}function jg(n){const t=n.combat,e=n.dummies;let i=`${t.weapon}|${t.phase}|${t.comboIndex}|${t.attackId}|${n.character.grounded?1:0}|${n.character.sprinting?1:0}|${n.playerHurt.type}|${t.hitstop>0?1:0}|d:${n.dash.phase}:${n.dash.kind}|t:${n.turnInPlace.phase}|l:${n.playerLink.phase}:${n.playerLink.kind}`;for(let a=0;a<e.length;a++){const s=e[a];i+=`|${s.id}:${s.mode}:${s.attackPhase}:${s.attackId}:${s.hurt.type}`}return i}function Bd(n){const t=n.character,e=n.combat,i=n.playerHurt;return{time:n.time,key:jg(n),ch:{x:t.position.x,y:t.position.y,z:t.position.z,facing:t.facing,moveYaw:t.moveYaw,bodyYaw:t.bodyYaw,headYaw:t.headYaw,headPitch:t.headPitch,bodyPitch:t.bodyPitch,gaitPhase:t.gaitPhase,stride:t.stride,vx:t.velocity.x,vy:t.velocity.y,vz:t.velocity.z},cb:{attackProgress:e.attackProgress,phaseTimer:e.phaseTimer,charge:e.charge,hitstop:e.hitstop},dash:{timer:n.dash.timer},turn:{progress:n.turnInPlace.progress},link:{progress:n.playerLink.progress},hurt:{timer:i.timer,duration:i.duration,knockX:i.knockX,knockZ:i.knockZ},dm:n.dummies.map(a=>({x:a.position.x,y:a.position.y,z:a.position.z,facing:a.facing,bodyYaw:a.bodyYaw,headYaw:a.headYaw,gaitPhase:a.gaitPhase,stride:a.stride,attackProgress:a.attackProgress,vx:a.velocity.x,vy:a.velocity.y,vz:a.velocity.z}))}}function qg(n,t){return n.key===t.key&&n.dm.length===t.dm.length}function Kg(n,t,e){const i=Math.max(0,Math.min(1,e)),a={position:{x:Ce(n.ch.x,t.ch.x,i),y:Ce(n.ch.y,t.ch.y,i),z:Ce(n.ch.z,t.ch.z,i)},facing:Ei(n.ch.facing,t.ch.facing,i),moveYaw:Ei(n.ch.moveYaw,t.ch.moveYaw,i),bodyYaw:Ei(n.ch.bodyYaw,t.ch.bodyYaw,i),headYaw:Ei(n.ch.headYaw,t.ch.headYaw,i),headPitch:Ce(n.ch.headPitch,t.ch.headPitch,i),bodyPitch:Ce(n.ch.bodyPitch,t.ch.bodyPitch,i),gaitPhase:Ei(n.ch.gaitPhase,t.ch.gaitPhase,i),stride:Ce(n.ch.stride,t.ch.stride,i),velocity:{x:Ce(n.ch.vx,t.ch.vx,i),y:Ce(n.ch.vy,t.ch.vy,i),z:Ce(n.ch.vz,t.ch.vz,i)}},s={attackProgress:Ce(n.cb.attackProgress,t.cb.attackProgress,i),phaseTimer:Ce(n.cb.phaseTimer,t.cb.phaseTimer,i),charge:Ce(n.cb.charge,t.cb.charge,i),hitstop:i<1?Math.max(0,Ce(n.cb.hitstop,t.cb.hitstop,i)):t.cb.hitstop},o={timer:Ce(n.hurt.timer,t.hurt.timer,i),knockX:Ce(n.hurt.knockX,t.hurt.knockX,i),knockZ:Ce(n.hurt.knockZ,t.hurt.knockZ,i)},r=t.dm.map((l,c)=>{const h=n.dm[c];return h?{position:{x:Ce(h.x,l.x,i),y:Ce(h.y,l.y,i),z:Ce(h.z,l.z,i)},facing:Ei(h.facing,l.facing,i),bodyYaw:Ei(h.bodyYaw,l.bodyYaw,i),headYaw:Ei(h.headYaw,l.headYaw,i),gaitPhase:Ei(h.gaitPhase,l.gaitPhase,i),stride:Ce(h.stride,l.stride,i),attackProgress:Ce(h.attackProgress,l.attackProgress,i),velocity:{x:Ce(h.vx,l.vx,i),y:Ce(h.vy,l.vy,i),z:Ce(h.vz,l.vz,i)}}:null});return{time:Ce(n.time,t.time,i),character:a,combat:s,playerHurt:o,dash:{timer:Ce(n.dash.timer,t.dash.timer,i)},turn:{progress:Ce(n.turn.progress,t.turn.progress,i)},link:{progress:Ce(n.link.progress,t.link.progress,i)},dummies:r}}function Jg(n,t){const e=n.dummies.map((i,a)=>{const s=t.dummies[a];return s?{...i,...s}:i});return{...n,time:t.time,character:{...n.character,...t.character},combat:{...n.combat,...t.combat},playerHurt:{...n.playerHurt,...t.playerHurt},dash:{...n.dash,timer:t.dash.timer},turnInPlace:{...n.turnInPlace,progress:t.turn.progress},playerLink:{...n.playerLink,progress:t.link.progress},dummies:e}}const op={slopPx:12,longPressMs:450,doubleTapMs:280};function Qg(n,t,e=op.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,a=n.dy/n.distance,s=t.rightX*i+t.forwardX*-a,o=t.rightZ*i+t.forwardZ*-a,r=Math.hypot(s,o);return r<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:s/r,worldZ:o/r}}function ha(n,t,e,i,a,s){const o=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:o,angleDeg:o>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:a,taps:s,worldX:0,worldZ:0}}function tx(n=op){const t=new Map,e=new Map,i=a=>t.get(a);return{begin(a,s,o,r,l){if(t.has(s))return null;for(const c of t.values())if(c.button===a)return null;return t.set(s,{button:a,pointerId:s,startX:o,startY:r,x:o,y:r,startedAt:l,dragging:!1,longFired:!1}),ha(a,"press",0,0,0,1)},move(a,s,o,r){const l=i(a);if(!l)return null;l.x=s,l.y=o;const c=s-l.startX,h=o-l.startY;return!l.dragging&&Math.hypot(c,h)>=n.slopPx?(l.dragging=!0,ha(l.button,"drag",c,h,r-l.startedAt,1)):null},end(a,s,o,r){const l=i(a);if(!l)return null;t.delete(a),l.x=s,l.y=o;const c=s-l.startX,h=o-l.startY,u=r-l.startedAt,d=Math.hypot(c,h);if(l.dragging||l.longFired||d>=n.slopPx)return ha(l.button,"release",c,h,u,1);const f=e.get(l.button);return f!==void 0&&r-f.at<=n.doubleTapMs&&Math.hypot(s-f.x,o-f.y)<=n.slopPx*2?(e.delete(l.button),ha(l.button,"doubleTap",c,h,u,2)):(e.set(l.button,{at:r,x:s,y:o}),ha(l.button,"tap",c,h,u,1))},cancel(a,s){const o=i(a);return o?(t.delete(a),ha(o.button,"cancel",o.x-o.startX,o.y-o.startY,s-o.startedAt,1)):null},poll(a){for(const s of t.values())if(!(s.longFired||s.dragging)&&a-s.startedAt>=n.longPressMs)return s.longFired=!0,ha(s.button,"longPress",s.x-s.startX,s.y-s.startY,a-s.startedAt,1);return null},isHeld(a){for(const s of t.values())if(s.button===a)return!0;return!1},reset(){t.clear(),e.clear()}}}const pc=.001,ex=18;function gl(n,t,e){return n<t?t:n>e?e:n}function xl(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function nx(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function ix(n,t,e,i,a=ex){const s=nx(t);if(!s)return{state:xl(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const o=Math.hypot(s[1].x-s[0].x,s[1].y-s[0].y),r=a,l=Math.max(1.0001,Number.isFinite(i)?i:1.25),c=1/l,h=l;if(!Number.isFinite(o)||o<pc)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const g=r<=0;return{state:{active:!0,lastDist:o,armDist:o,armed:g},scale:1,started:!0,ended:!1,armedNow:!1,pinching:g}}if(!n.armed)return n.armDist<pc?{state:{active:!0,lastDist:o,armDist:o,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(o-n.armDist)<r?{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<pc)return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const u=o/n.lastDist,d=Math.max(0,Number.isFinite(e)?e:1),f=Number.isFinite(u)&&u>0?Math.pow(u,d):1;return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:gl(Number.isFinite(f)?f:1,c,h),started:!1,ended:!1,armedNow:!1,pinching:!0}}function Hd(n,t,e,i){const a=Math.min(e,i),s=Math.max(e,i),o=Number.isFinite(t)&&t>0?t:1,r=n*o;return Number.isFinite(r)?gl(r,a,s):gl(n,a,s)}function ax(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function sx(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const mc=["jump","sprint","reset","attack","skill2"],ox=8,rx=16,gc=10,Gd=14,Vd=140,cx=18,lx=16,hx=400,dx=1.0001;function hr(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function ux(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&hr(e)}function fx(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:a}=n,s=()=>Math.max(8,t());let o=null,r=0,l=0,c=0,h=0,u=0,d=0,f=-1,g=0,_=null,m=-1,p=0,y=0,x=0,v=0,w=!1,S=0,E=1,A=0,b=null,M=0,P=0,C=!1,F=null,N=null,L=0,I=0,z=0,G=0,$=!1,et=!0,ft=-1;const vt=tx({slopPx:Gd,longPressMs:450,doubleTapMs:350});let It=[],Y=null;const Q=new Set;function pt(O){O&&It.push(O)}const at=new Map;let K=xl(),Z=!1,_t=1;function Ft(){const O=Array.from(at.values()),ot=a(),rt=ix(K,O,ot.pinchGain,ot.maxStepRatio,cx);if(K=rt.state,Z=rt.pinching,rt.scale!==1&&(_t*=rt.scale),rt.started||rt.armedNow)b=null,C=!0,F=null;else if(rt.ended&&o===null&&O.length===1){const Vt=O[0];o=Vt.id,r=Vt.x,l=Vt.y,c=0,h=0,u=Vt.x,d=Vt.y,w=!1,S=0,E=1,A=0,performance.now(),b=null,C=!0,F=null}}const ht={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},Pt={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let B=0,ne=0;const Ot={},Ct=new Set,xt=[];function Nt(){for(const O of mc)Ot[O]!==void 0&&(Ot[O]=void 0),j(O);vt.reset(),Q.clear(),at.clear(),K=xl(),Z=!1,o=null,c=0,h=0,u=0,d=0,w=!1,S=0,E=1,A=0,p=0,y=0,x=0,v=0,_=null,m=-1,b=null,C=!1,F=null,N=null,ft=-1,z=0,G=0,$=!1,et=!0}const Bt=()=>{document.hidden&&Nt()},k=O=>{if(O.clientX===0&&O.clientY===0){g++;return}if(hr(O.target)||ux(O.clientX,O.clientY)){Q.add(O.pointerId);return}if(Q.delete(O.pointerId),at.set(O.pointerId,{id:O.pointerId,x:O.clientX,y:O.clientY}),o===null&&!Z){_=null,m=-1,o=O.pointerId,r=O.clientX,l=O.clientY,c=0,h=0,u=O.clientX,d=O.clientY,performance.now();const ot=Number.isFinite(O.screenX)&&Number.isFinite(O.screenY)&&(O.screenX!==0||O.screenY!==0);w=ot,S=0,E=1,A=0,p=ot?O.screenX:0,y=ot?O.screenY:0,x=p,v=y,b=O.pointerId,M=O.clientX,P=O.clientY,C=!1}Ft()},T=O=>{if(O.pointerId===N&&(O.pointerType==="mouse"&&O.buttons===0||O.clientX===0&&O.clientY===0&&(L!==0||I!==0)||(et?(z=O.clientX-L,G=O.clientY-I):(L=O.clientX,I=O.clientY,et=!0,z=0,G=0))),pt(vt.move(O.pointerId,O.clientX,O.clientY,performance.now())),!Q.has(O.pointerId)&&at.has(O.pointerId)&&(at.set(O.pointerId,{id:O.pointerId,x:O.clientX,y:O.clientY}),Ft()),Q.has(O.pointerId)||O.pointerId!==o)return;const ot=performance.now();if(_===O.pointerId&&ot-m<150){g++;return}const rt=O.clientX,Vt=O.clientY;if(rt===0&&Vt===0&&(r!==0||l!==0)){g++;return}const qt=rt-u,U=Vt-d,bt=Number.isFinite(O.screenX)&&Number.isFinite(O.screenY),tt=bt?O.screenX:0,mt=bt?O.screenY:0,kt=bt&&(tt!==0||mt!==0),Lt=tt-x,Gt=mt-v;if(w&&kt){const Tt=Math.hypot(Lt,Gt),Dt=Math.hypot(qt,U);if(Tt>3){if(S=0,A<30&&Dt>6&&Lt*qt+Gt*U>.7*Tt*Dt){const ie=Tt/Dt;ie>.2&&ie<5&&(E+=(ie-E)*.3,A++)}}else Dt>12&&(S++,S>=2&&(w=!1))}const ce=Math.hypot(qt,U);if(!w){const Tt=f<0?Number.POSITIVE_INFINITY:ot-f,Dt=kt?Math.hypot(Lt,Gt):1/0;ce>28&&(Tt<200||Dt<ce*.4)&&(r+=qt,l+=U,g++)}u=rt,d=Vt,x=tt,v=mt,O.pointerId===b&&Math.hypot(O.clientX-M,O.clientY-P)>ox&&(C=!0);let ge,te;w&&kt?(ge=(tt-p)/E,te=(mt-y)/E):(ge=rt-r,te=Vt-l);const we=Math.hypot(ge,te),Be=s();we>Be&&(ge*=Be/we,te*=Be/we);const Je=Math.hypot(c,h),V=Math.hypot(ge,te);if(Je>10&&V>10){const Tt=Math.abs(Math.atan2(c*te-h*ge,c*ge+h*te)),Dt=Math.max(Je,V)*Tt,ie=Math.max(Math.hypot(qt,U),Math.hypot(Lt,Gt)/Math.max(.2,E));if(Tt>.6&&ie<Math.max(6,Dt*.5)){g++;return}}c=ge,h=te};function j(O){if(!ht[O])return;ht[O]=!1,O==="attack"&&(Pt.attackReleased=!0);const ot=document.getElementById(`btn-${O}`);ot==null||ot.classList.remove("is-down")}function ut(){o!==null&&(_=o,m=performance.now(),o=null,c=0,h=0,u=0,d=0,w=!1,S=0,E=1,A=0,p=0,y=0,x=0,v=0)}const J=O=>{const ot=at.delete(O.pointerId),rt=Q.delete(O.pointerId);ot&&Ft(),O.pointerId===N&&(N=null,$?ft=performance.now():(z=0,G=0,ft=-1)),pt(vt.end(O.pointerId,O.clientX,O.clientY,performance.now()));for(const Ht of mc)Ot[Ht]===O.pointerId&&(Ot[Ht]=void 0,j(Ht));const Vt=!ot&&!rt&&at.size<=1&&o!==null;(O.pointerId===o||at.size===0||Vt)&&ut(),!rt&&O.pointerId===b&&(!C&&!hr(O.target)&&(F={x:O.clientX,y:O.clientY}),b=null)};for(const O of mc){const ot=document.getElementById(`btn-${O}`);if(!ot)continue;const rt=O==="attack"||O==="skill2",Vt=U=>{if(U.preventDefault(),Ot[O]===void 0){Ot[O]=U.pointerId,ht[O]=!0,O==="jump"&&(Pt.jump=!0),O==="reset"&&(Pt.reset=!0),O==="sprint"&&(Pt.sprintPressed=!0),O==="attack"&&(Pt.attackPressed=!0),O==="skill2"&&(Pt.skill2=!0),ot.classList.add("is-down"),pt(vt.begin(O,U.pointerId,U.clientX,U.clientY,performance.now()));try{ot.setPointerCapture(U.pointerId)}catch{}rt&&(N=U.pointerId,L=U.clientX,I=U.clientY,et=!(U.clientX===0&&U.clientY===0),z=0,G=0,$=!1,ft=-1)}},Ht=U=>{Ot[O]===U.pointerId&&(Ot[O]=void 0,j(O),pt(vt.end(U.pointerId,U.clientX,U.clientY,performance.now())))},qt=U=>{Ot[O]===U.pointerId&&(Ot[O]=void 0,j(O),pt(vt.cancel(U.pointerId,performance.now())))};ot.addEventListener("pointerdown",Vt),ot.addEventListener("pointerup",Ht),ot.addEventListener("pointercancel",qt),xt.push(()=>{ot.removeEventListener("pointerdown",Vt),ot.removeEventListener("pointerup",Ht),ot.removeEventListener("pointercancel",qt)})}const ct=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const O of ct){const ot=rt=>{rt.preventDefault(),B=Number(O.dataset.weapon)||0};O.addEventListener("pointerdown",ot),xt.push(()=>O.removeEventListener("pointerdown",ot))}const zt=O=>{const ot=O.key.toLowerCase();if((ot===" "||ot.startsWith("arrow"))&&O.preventDefault(),Ct.has(ot))return;Ct.add(ot),ot===" "&&(Pt.jump=!0),ot==="r"&&(Pt.reset=!0),ot==="shift"&&(Pt.sprintPressed=!0),ot==="j"&&(Pt.attackPressed=!0),ot==="k"&&(Pt.skill2=!0),ot>="1"&&ot<="5"&&(B=Number(ot)),ot>="6"&&ot<="9"&&(ne=Number(ot)-5);const rt=Math.max(dx,a().keyStep||1.12);(ot==="="||ot==="+")&&(_t*=rt),(ot==="-"||ot==="_")&&(_t/=rt)},St=O=>{const ot=O.key.toLowerCase();Ct.has(ot)&&(Ct.delete(ot),ot==="j"&&(Pt.attackReleased=!0))},Mt=O=>{if(hr(O.target))return;O.preventDefault();const ot=O.deltaMode===1?O.deltaY*lx:O.deltaMode===2?O.deltaY*hx:O.deltaY;_t*=ax(ot,a().wheelStep)},dt=O=>{O.preventDefault()},st=()=>{f=performance.now()};window.addEventListener("resize",st),window.addEventListener("orientationchange",st);const wt=typeof window<"u"?window.visualViewport:null;return wt&&(wt.addEventListener("resize",st),wt.addEventListener("scroll",st)),window.addEventListener("pointerdown",k),window.addEventListener("pointermove",T),window.addEventListener("pointerup",J),window.addEventListener("pointercancel",J),window.addEventListener("blur",Nt),document.addEventListener("visibilitychange",Bt),window.addEventListener("keydown",zt),window.addEventListener("keyup",St),window.addEventListener("wheel",Mt,{passive:!1}),window.addEventListener("gesturestart",dt),{peekStick(){return{id:o,held:o!==null,originX:r,originY:l,x:u,y:d,dx:u-r,dy:d-l,radius:s(),badMoves:g,screenOk:w,originSX:p,originSY:y,screenX:x,screenY:v,scale:E}},peekAim(){const O=performance.now(),ot=Math.hypot(z,G),rt=N!==null||ft>=0&&O-ft<Vd;if(!(rt&&$&&ot>=gc))return{active:!1,holding:rt,x:0,z:0,dx:z,dy:G};const Ht=i(),qt=z/ot,U=G/ot,bt=Ht.rightX*qt+Ht.forwardX*-U,tt=Ht.rightZ*qt+Ht.forwardZ*-U,mt=Math.hypot(bt,tt)||1;return{active:!0,holding:rt,x:bt/mt,z:tt/mt,dx:z,dy:G}},sample(){var ue;const O=s();let ot=o!==null?Math.max(-1,Math.min(1,c/O)):0,rt=o!==null?Math.max(-1,Math.min(1,h/O)):0,Vt=0,Ht=0;(Ct.has("a")||Ct.has("arrowleft"))&&(Vt-=1),(Ct.has("d")||Ct.has("arrowright"))&&(Vt+=1),(Ct.has("w")||Ct.has("arrowup"))&&(Ht-=1),(Ct.has("s")||Ct.has("arrowdown"))&&(Ht+=1),ot+=Vt,rt+=Ht;let qt=Math.hypot(ot,rt);qt>1&&(ot/=qt,rt/=qt,qt=1);const U=ot,bt=rt;qt<e&&(ot=0,rt=0);const tt=i();let mt=tt.rightX*ot+tt.forwardX*-rt,kt=tt.rightZ*ot+tt.forwardZ*-rt;const Lt=Math.hypot(mt,kt);Lt>1&&(mt/=Lt,kt/=Lt);const Gt=performance.now();pt(vt.poll(Gt));const ce=Math.hypot(z,G);N!==null&&(ce>=rx?$=!0:ce<gc&&($=!1));const ge=N!==null||ft>=0&&Gt-ft<Vd,te=ge&&$&&ce>=gc;let we=0,Be=0;if(te){const re=z/ce,ve=G/ce,Fe=tt.rightX*re+tt.forwardX*-ve,$e=tt.rightZ*re+tt.forwardZ*-ve,De=Math.hypot(Fe,$e)||1;we=Fe/De,Be=$e/De}!ge&&N===null&&(z=0,G=0,ft=-1,$=!1);const Je=F;F=null;const V=_t;_t=1;const Tt={moveX:mt,moveZ:kt,jumpPressed:Pt.jump,sprintHeld:ht.sprint||Ct.has("shift"),sprintPressed:Pt.sprintPressed,resetPressed:Pt.reset,attackPressed:Pt.attackPressed,attackHeld:ht.attack||Ct.has("j"),attackReleased:Pt.attackReleased,skill2Pressed:Pt.skill2,weaponSlot:B,dummyClickId:ne,aimX:we,aimZ:Be,aimActive:te};Pt.jump=!1,Pt.reset=!1,Pt.sprintPressed=!1,Pt.attackPressed=!1,Pt.attackReleased=!1,Pt.skill2=!1,B=0,ne=0;const Dt=It.map(re=>Qg(re,tt,Gd));It=[],Dt.length>0&&(Y=Dt[Dt.length-1]);const ie=o!==null?"pointer":Ct.size>0?"keyboard":"idle";return{intents:Tt,stickX:ot,stickY:rt,stickRawX:U,stickRawY:bt,stickHeld:o!==null,stickId:o,stickOriginX:r,stickOriginY:l,stickPxX:u,stickPxY:d,stickBad:g,stickScreenOk:w,stickOriginSX:p,stickOriginSY:y,stickScreenX:x,stickScreenY:v,stickScale:E,stickVpTop:((ue=sx())==null?void 0:ue.top)??0,stickVpAge:f<0?-1:Math.round(performance.now()-f),aimDX:z,aimDY:G,source:ie,tap:Je,zoomScale:V,gestures:Dt,lastGesture:Y}},dispose(){window.removeEventListener("pointerdown",k),window.removeEventListener("pointermove",T),window.removeEventListener("pointerup",J),window.removeEventListener("pointercancel",J),window.removeEventListener("blur",Nt),document.removeEventListener("visibilitychange",Bt),window.removeEventListener("keydown",zt),window.removeEventListener("keyup",St),window.removeEventListener("wheel",Mt),window.removeEventListener("resize",st),window.removeEventListener("orientationchange",st),wt&&(wt.removeEventListener("resize",st),wt.removeEventListener("scroll",st)),window.removeEventListener("gesturestart",dt),vt.reset();for(const O of xt)O()}}}const wr=1,Er=2,Tr=4,rp=8,Ar=16,Zs=32,cp=64,lp=128,px=[[wr,"atk"],[Er,"dash"],[Tr,"link"],[rp,"air"],[Ar,"hurt"],[Zs,"aim"],[cp,"spr"],[lp,"chan"]];function Ha(n){if(n===0)return"-";const t=px.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const mx=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],gx=0,xx=15,xc=19,vx=21,yx=22,_x=23,Mx=24,pi={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},Ln=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,ni=n=>Math.round(n*180/Math.PI*10)/10,vc=Math.PI*2;function ks(n){let t=n%vc;return t>Math.PI&&(t-=vc),t<-Math.PI&&(t+=vc),t}function bx(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=wr),n.dash.phase!=="idle"&&(e|=Er),n.playerLink.phase!=="idle"&&(e|=Tr),n.character.grounded||(e|=rp),n.playerHurt.type!=="none"&&(e|=Ar),t.intents.aimActive&&(e|=Zs),n.character.sprinting&&(e|=cp),n.abilities.channeling&&(e|=lp),e}function Sx(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function wx(n){const t={sampleHz:n.sampleHz??pi.sampleHz,sampleCapacity:n.sampleCapacity??pi.sampleCapacity,eventCapacity:n.eventCapacity??pi.eventCapacity,anomalyCapacity:n.anomalyCapacity??pi.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??pi.dirJumpDeg,aimDropDeg:n.aimDropDeg??pi.aimDropDeg,freezeMs:n.freezeMs??pi.freezeMs,freezeSpeed:n.freezeSpeed??pi.freezeSpeed,stickLostMs:n.stickLostMs??pi.stickLostMs,spikeMs:n.spikeMs??pi.spikeMs},e=n.meta,i=[],a=[],s=[],o={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let r=!0,l=-1,c=-1e9,h=null,u=0,d=0,f="",g=-1,_=-1,m=-1,p=0,y=-1e9,x=-1,v={},w=null,S=0,E=0,A=0,b=0;function M(L,I){const z=1/t.sampleHz,G=L[gx];G-c<z-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(L),c=G)}function P(L,I,z,G,$,et){const ft=v[L]??-1e9;if(I-ft<1.2)return;if(v[L]=I,L==="frameSpike"){let It=0;for(const Y of s)Y.kind==="frameSpike"&&It++;if(It>=6)return}s.length>=t.anomalyCapacity&&s.shift();let vt=i.slice(-7);et&&(vt.length===0||vt[vt.length-1]!==et)&&(vt=[...vt.slice(-6),et]),s.push({kind:L,t:Ln(I),tick:z,ms:Math.round(G),detail:$,ctx:vt}),L==="dirJump"?o.dirJumps++:L==="aimDrop"?o.aimDrops++:L==="moveFreeze"?o.freezes++:L==="stickLost"?o.stickLosts++:L==="stickJump"?o.stickJumps++:L==="stickBad"?o.stickBads++:L==="stickDrift"&&o.stickDrifts++}function C(L,I,z,G){a.length>=t.eventCapacity&&a.shift(),a.push({t:Ln(z),tick:G,k:L,d:I})}function F(L){switch(L.type){case"attack-start":o.attacks++;break;case"hit":o.hits++;break;case"player-hurt":o.hurts++;break;case"link-start":o.links++;break;case"link-hit":o.linkHits++;break;case"roll":o.rolls++;break;case"blink":o.blinks++;break;case"channel-start":o.channels++;break;case"projectile-fire":o.bolts++;break;case"ring-place":o.rings++;break;case"charge-start":o.bowCharges++;break;case"jumped":o.jumps++;break;case"reset":o.resets++;break;case"blocked":y=L.tick;break}}function N(){const L=o,I=L.wallMs/1e3,z=L.gestures,G=vt=>Object.entries(z).filter(([It])=>It.endsWith(`.${vt}`)).reduce((It,[,Y])=>It+Y,0),$=[];if($.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),$.push(`运行 ${I.toFixed(1)}s / ${L.frames} 帧 · ${L.fps.toFixed(1)}fps · 最大 ${L.dtMax.toFixed(0)}ms · 尖峰 ${L.spikes} · 步 ${L.steps}`),$.push(`摇杆活跃 ${I>0?Math.round(L.stickActiveMs/1e3/I*100):0}% · 手势 按下 ${G("press")}（单击 ${G("tap")} / 双击 ${G("doubleTap")} / 拖拽 ${G("drag")} / 长按 ${G("longPress")} / 打断 ${G("cancel")} / 拖放 ${G("release")}）`),$.push(`攻击 ${L.attacks}(中${L.hits}) · 受击 ${L.hurts} · 派生 ${L.links}(中${L.linkHits}) · 翻滚 ${L.rolls} 闪现 ${L.blinks} · 跳 ${L.jumps} · 复位 ${L.resets}`),$.push(`法杖 引导${L.channels} 飞弹${L.bolts} 电环${L.rings} · 弓蓄力${L.bowCharges} · 当前武器 ${f||"-"}`),$.push(`异常 ${L.dirJumps+L.aimDrops+L.freezes+L.stickLosts+L.stickJumps+L.stickBads+L.stickDrifts}（dir ${L.dirJumps} / aim ${L.aimDrops} / freeze ${L.freezes} / stick ${L.stickLosts} / stickJump ${L.stickJumps} / 坏指针 ${L.stickBads} / 坐标漂移 ${L.stickDrifts}） · 掉帧尖峰 ${L.spikes}`+(L.inTurns>0?` · 输入转向 ${L.inTurns} 次（最大 ${L.inTurnMax.toFixed(0)}°）`:"")),s.length>0)for(const vt of s.slice(-6)){$.push(`· ${vt.kind} @t${vt.t.toFixed(2)} tick${vt.tick} ${vt.ms>0?`${vt.ms}ms `:""}${vt.detail}`);const It=vt.ctx.map(Q=>String(Q[xx])).join(" "),Y=vt.ctx.map(Q=>Q[xc]===""||Q[xc]==null?".":String(Q[xc])).join(" ");if($.push(`  yaw ${It}`),$.push(`  in  ${Y}`),vt.kind==="stickJump"||vt.kind==="stickBad"||vt.kind==="stickLost"){const Q=vt.ctx.map(at=>`${at[vx]},${at[yx]}`).join(" "),pt=vt.ctx.map(at=>`${at[_x]},${at[Mx]}`).join(" ");$.push(`  o   ${Q}`),$.push(`  p   ${pt}`)}}if(a.length>0){$.push("最近事件：");for(const vt of a.slice(-12))$.push(`  ${vt.t.toFixed(2)} ${vt.k} ${vt.d}`.trimEnd())}const et=o.screenFrames>0?`屏幕 screenX/Y（${o.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",ft=o.screenFrames>0&&o.clientFrames>0?` / client 回退 ${o.clientFrames} 帧`:"";return $.push(`摇杆坐标源 ${et}${ft}`),$.push(`UA ${e.ua}`),$.join(`
`)}return{sample(L,I,z,G=0){o.frames++,I.stickHeld&&(I.stickScreenOk?o.screenFrames++:o.clientFrames++),o.steps+=G,o.wallMs+=z,z>o.dtMax&&(o.dtMax=z),o.fps=o.wallMs>0?o.frames*1e3/o.wallMs:0,o.simS=L.time;const $=L.time;if(l<0&&(l=$),A=$,b=L.tick,!r)return;const et=L.character,ft=Math.hypot(I.stickX,I.stickY),vt=Math.hypot(et.velocity.x,et.velocity.z);f=L.combat.weapon;const It=bx(L,I),Y=et.facing,pt=Math.hypot(I.intents.moveX,I.intents.moveZ)>.05?Math.atan2(I.intents.moveX,I.intents.moveZ):null;ft>.2&&(o.stickActiveMs+=z);const at=[Ln($),L.tick,Math.round(z*10)/10,Ln(I.stickX),Ln(I.stickY),Ln(I.stickRawX),Ln(I.stickRawY),I.stickHeld?1:0,I.source.slice(0,8),Ln(I.intents.moveX),Ln(I.intents.moveZ),Ln(et.position.x),Ln(et.position.z),Ln(et.velocity.x),Ln(et.velocity.z),ni(Y),ni(et.bodyYaw),It,Ln(et.stride),pt===null?"":ni(pt),I.stickId===null?"":I.stickId,Math.round(I.stickOriginX),Math.round(I.stickOriginY),Math.round(I.stickPxX),Math.round(I.stickPxY),I.stickBad,Math.round(I.stickVpTop),Math.round(I.stickOriginSX),Math.round(I.stickOriginSY),Math.round(I.stickScreenX),Math.round(I.stickScreenY),I.stickScreenOk?1:0,Math.round(I.stickScale*100)/100];M(at);const K=$*1e3<x;if(z>t.spikeMs&&!K&&$-l>.6&&(o.spikes++,P("frameSpike",$,L.tick,z,`dt ${z.toFixed(0)}ms fl=${Ha(It)}`,at)),h!==null&&!K){const Nt=Math.abs(ni(ks(Y-h))),Bt=Math.abs(ni(ks(et.moveYaw-u))),k=(d|It)&(wr|Er|Tr|Ar)|It&Zs,T=pt===null?null:Math.abs(ni(ks(Y-pt))),j=pt===null||h===null?null:Math.abs(ni(ks(h-pt))),ut=T!==null&&j!==null&&T<j-.5,J=(d&Zs)!==0&&(It&Zs)===0&&pt===null,ct=T!==null&&(T<=12||ut);Nt>t.aimDropDeg&&J?P("aimDrop",$,L.tick,0,`${Nt.toFixed(0)}° @aim→none stick(${I.stickX.toFixed(2)},${I.stickY.toFixed(2)}) aim(${I.aimDX.toFixed(0)},${I.aimDY.toFixed(0)}) fl=${Ha(It)}`,at):Nt>t.dirJumpDeg&&k===0&&!J&&(ct?(o.inTurns++,Nt>o.inTurnMax&&(o.inTurnMax=Nt)):P("dirJump",$,L.tick,0,`${Nt.toFixed(0)}° res${T===null?" 无输入":`${T.toFixed(0)}°`} yaw ${ni(h)}→${ni(Y)} in ${pt===null?".":ni(pt)}° mvΔ${Bt.toFixed(0)}° aim(${I.aimDX.toFixed(0)},${I.aimDY.toFixed(0)}) fl=${Ha(d)}→${Ha(It)}`,at))}const Z=(It&(wr|Er|Tr|Ar))!==0,_t=L.tick-y<30;ft>.35&&vt<t.freezeSpeed&&!Z&&!_t?(g<0&&(g=$),$-g>=t.freezeMs/1e3&&$>=_&&(P("moveFreeze",$,L.tick,($-g)*1e3,`stick(${I.stickX.toFixed(2)},${I.stickY.toFixed(2)}) v${vt.toFixed(2)} ${I.source} fl=${Ha(It)}`,at),_=$+1.5,g=-1)):g=-1,I.stickHeld?(ft>p&&(p=ft),p>.35&&ft<.06?(m<0&&(m=$),$-m>=t.stickLostMs/1e3&&(P("stickLost",$,L.tick,($-m)*1e3,`raw(${I.stickRawX.toFixed(2)},${I.stickRawY.toFixed(2)}) peak ${p.toFixed(2)} fl=${Ha(It)}`,at),m=-1,p=0)):m=-1):(p=0,m=-1);const Ft=I.stickScale>.2&&I.stickScale<5?I.stickScale:1,ht=I.stickScreenOk,Pt=ht?I.stickScreenX/Ft:I.stickPxX,B=ht?I.stickScreenY/Ft:I.stickPxY,ne=ht?I.stickOriginSX/Ft:I.stickOriginX,Ot=ht?I.stickOriginSY/Ft:I.stickOriginY,Ct=Pt-ne,xt=B-Ot;if(I.stickHeld&&I.stickId!==null){const Nt=w;if(Nt&&Nt.held&&Nt.id===I.stickId){const Bt=Math.hypot(Nt.dx,Nt.dy),k=Math.hypot(Ct,xt),T=Math.max(Bt,k),j=Math.hypot(Pt-Nt.cx,B-Nt.cy),ut=Math.abs(ni(ks(Math.atan2(xt,Ct)-Math.atan2(Nt.dy,Nt.dx)))),J=T*ut*Math.PI/180,ct=Math.hypot(ne-Nt.ox,Ot-Nt.oy);if(T>18&&ut>35&&j<Math.max(5,J*.35)&&P("stickJump",$,L.tick,0,`Δ${ut.toFixed(0)}° 手指只动${j.toFixed(0)}px(弧长应${J.toFixed(0)}px) o(${Math.round(Nt.ox)},${Math.round(Nt.oy)})→(${Math.round(ne)},${Math.round(Ot)}) 原点位移${ct.toFixed(0)}px p(${Math.round(Pt)},${Math.round(B)}) raw(${Math.round(Ct)},${Math.round(xt)}) id${I.stickId} ${ht?"src=屏幕":"src=client"}`,at),ht&&Nt.screenOk){const zt=Math.hypot(I.stickPxX-Nt.x,I.stickPxY-Nt.y),St=Math.hypot((I.stickScreenX-Nt.sx)/Ft,(I.stickScreenY-Nt.sy)/Ft);S+=zt-St,Math.abs(S)>20&&(P("stickDrift",$,L.tick,0,`client 相对屏幕漂移 ${S>0?"+":""}${S.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(I.stickPxX)},${Math.round(I.stickPxY)}) screen(${Math.round(I.stickScreenX)},${Math.round(I.stickScreenY)})`,at),S=0)}}w={id:I.stickId,ox:ne,oy:Ot,cx:Pt,cy:B,x:I.stickPxX,y:I.stickPxY,sx:I.stickScreenX,sy:I.stickScreenY,dx:Ct,dy:xt,held:!0,screenOk:ht}}else w=null,S=0;if(I.stickBad>E){const Nt=I.stickBad-E;P("stickBad",$,L.tick,0,`拦截 ${Nt} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${I.stickBad}）o(${Math.round(I.stickOriginX)},${Math.round(I.stickOriginY)}) p(${Math.round(I.stickPxX)},${Math.round(I.stickPxY)}) id${I.stickId??"-"}`,at)}E=I.stickBad,h=Y,u=et.moveYaw,d=It},event(L,I){const z=Sx(L);F(L),r&&(L.type==="dash-ready"||L.type==="combo-reset"||L.type==="stepUp"||C(L.type,z,I,L.tick))},gesture(L){const I=`${L.button}.${L.kind}`;o.gestures[I]=(o.gestures[I]??0)+1,r&&(L.kind==="longPress"||L.kind==="doubleTap"||L.kind==="drag"||L.kind==="cancel")&&C(`g:${L.kind}`,`${L.button} ${L.heldMs.toFixed(0)}ms d${L.distance.toFixed(0)}px ${L.angleDeg.toFixed(0)}°`,A,b)},suspend(L){x=A*1e3+L,g=-1,m=-1},setEnabled(L){r=L,L||(h=null,w=null,g=-1,m=-1)},clear(){i.length=0,a.length=0,s.length=0,v={},c=-1e9,h=null,d=0,g=-1,m=-1,p=0,o.frames=0,o.wallMs=0,o.dtMax=0,o.spikes=0,o.stickActiveMs=0,o.attacks=0,o.hits=0,o.hurts=0,o.links=0,o.linkHits=0,o.rolls=0,o.blinks=0,o.channels=0,o.bolts=0,o.rings=0,o.bowCharges=0,o.jumps=0,o.resets=0,o.dirJumps=0,o.aimDrops=0,o.inTurns=0,o.inTurnMax=0,o.freezes=0,o.stickLosts=0,o.stickJumps=0,o.stickBads=0,o.stickDrifts=0,o.screenFrames=0,o.clientFrames=0,S=0,w=null,E=0;for(const L of Object.keys(o.gestures))delete o.gestures[L]},status(){const L=o.simS,I=s.some(z=>L-z.t<8&&(z.kind==="dirJump"||z.kind==="aimDrop"||z.kind==="moveFreeze"||z.kind==="stickLost"||z.kind==="stickJump"||z.kind==="stickBad"||z.kind==="stickDrift"));return{durationS:o.wallMs/1e3,frames:o.frames,events:a.length,anomalies:s.length,alert:I,enabled:r}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...o,gestures:{...o.gestures}},columns:mx,samples:i.slice(),events:a.slice(),anomalies:s.slice()}},summary:N}}const Ex={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,skillDecel:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:0},worldBounds:{minX:-15.5,maxX:15.5,minZ:-15.5,maxZ:15.5},orientation:{bodyTurnRate:7,headTurnRate:12,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},turnInPlace:{enabled:!0,triggerDeg:50,settleDeg:8,durationSec:.45,idleSpeedRatio:.05,inputDeadZone:.12,lookRange:0,armSec:.03,gazeTriggerDeg:120},combat:{comboWindow:.65,settle:.16,attackMoveScale:.3,lungeMoveScale:.08,lungeCurve:1.2,lungeMaxSpeed:17,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3,hitWindow:{start:0,end:.85},comboWindow:.62,notifies:[{at:"windup",u:.7,name:"blade-air",value:.5},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.35,name:"foot-step",value:.6}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,148],[.2,125],[.4,68],[.6,-16],[.8,-78]]},2:{pts:[[0,-77],[.2,-68],[.4,-4],[.6,67],[.8,120]]},3:{stabU:.42}}}},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3,hitWindow:{start:0,end:.9},comboWindow:.5,notifies:[{at:"windup",u:.5,name:"blade-air",value:.45},{at:"active",u:0,name:"blade-air",value:1},{at:"active",u:.6,name:"blade-air",value:.7},{at:"recovery",u:.3,name:"foot-step",value:.5}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,151],[.2,137],[.4,62],[.6,-46],[.8,-128]]},2:{pts:[[0,-3],[.2,7],[.4,57],[.6,105],[.8,135]]},3:{pts:[[0,-150],[.2,-100],[.4,-40],[.6,1],[.8,36]]}}}},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3,hitWindow:{start:0,end:.8},comboWindow:.78,notifies:[{at:"windup",u:.85,name:"blade-air",value:.8},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.45,name:"foot-step",value:1}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,152],[.2,114],[.4,15],[.6,-65],[.8,-120]]},2:{pts:[[0,-124],[.2,-81],[.4,22],[.6,92],[.8,141]]},3:{pts:[[0,90],[.2,39],[.4,8],[.6,4],[.8,7]]}}},groundSlam:{slamU:.6,radius:2.4,knockback:.9,type:"knock",onlyUnhit:!0,holdMul:1.7}},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:.85,minChargeToFire:.15,chargeMoveMultiplier:.55,autoFire:!0,release:{windup:.04,active:.12,recovery:.26,lunge:0},trajectory:{speedMin:9,speedMax:16,launchPitchDeg:3.5,gravity:9,maxLife:2.4,radius:.2,stickMinPitchDeg:50,groundStickLift:.32,stickSec:4,homingRange:14,homingConeDeg:30,turnRateDeg:90,homingTime:.9,aimHeightRatio:.7,verticalTurnRate:18}}},abilities:{arcane:{perWave:3,waves:5,waveInterval:.2,spreadDeg:8,spreadTime:.22,spawnDelay:.035,spawnSideStep:.2,speedJitter:.12,homingRange:8,homingConeDeg:40,turnRateDeg:300,homingTime:1.1,retargetInterval:.25,cooldown:1,speed:10,life:1.4,radius:.3,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.6},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},skills:[{id:"arcane",kind:"channelVolley",slot:"attack",weapon:"staff",paramsRef:"arcane",enabled:!0},{id:"ring",kind:"groundRing",slot:"skill2",weapon:"staff",paramsRef:"ring",enabled:!0}],targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!1,dummyKnockback:.18,hitstop:{light:.045,heavy:.07,knock:.1},hitstopByWeapon:{"sword-shield":1,"dual-swords":.85,greatsword:1.3,staff:1.1,bow:.9},hitstopWarp:{enabled:!0,holdRate:.05,release:.055,payback:1.5,paybackBudget:.6},hitstopComboFalloff:[1,.85,.72]},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5,spar:1.2},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},gaze:{enabled:!0,headLookLimitDeg:55,headGazeRange:7,threatRange:8,recoveryDist:3.5,maxThreats:3,bodyTurnRate:3.2,headTurnRate:8,maxHeadSpeedDeg:300,maxBodySpeedDeg:130,headReturnRate:3.5,headReturnSpeedDeg:120,aimHeightRatio:.75,eyeHeightRatio:.78,headPitchRate:7,maxHeadPitchDeg:28,bodyPitchScale:.3,bodyPitchRate:4,enterThreshold:.05,reactToAttack:!0,reactToApproach:!0,approachDist:2.5,hurtHoldSec:2,hostileModeWeight:.6,spreadFalloff:1.5,behindFalloff:.35,behindAngleDeg:100,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5,spar:1.2},attackBoost:.6,nearDistance:1.5,saturation:2.6},dummies:{count:6,spawn:[{x:-11.1,z:-8.35},{x:-9.5,z:-8.35},{x:-7.9,z:-8.35},{x:0,z:-10.2},{x:-9.5,z:0},{x:-9.5,z:7.2}],initialModes:["idle","keep-distance","attack","attack","follow","idle"],leashRadius:2.4,radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,strafePeriod:5.2,strafeDuty:.34,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4,fighters:{weapons:["sword-shield","dual-swords","greatsword"],spawn:[{x:-3.6,z:3.8},{x:3.9,z:3.6},{x:.2,z:5.9}],initialModes:["spar","spar","spar"],moveSpeed:2.1,attackInterval:3.4,attackRangeScale:.9,knockbackScale:.6,leashRadius:7,comboCount:0,comboGap:0}}},Tx={ground:{size:32,thickness:.4},steps:[{id:"stair-1",x:6.6,z:-5.6,width:2.4,depth:.9,height:.2},{id:"stair-2",x:6.6,z:-6.5,width:2.4,depth:.9,height:.4},{id:"stair-3",x:6.6,z:-7.4,width:2.4,depth:.9,height:.6},{id:"stair-4",x:6.6,z:-8.3,width:2.4,depth:.9,height:.8},{id:"plateau",x:6.6,z:-9.6,width:2.4,depth:1.6,height:.8},{id:"block-060",x:11.4,z:-6,width:1.4,depth:1.4,height:.6},{id:"block-090",x:11.4,z:-7.9,width:1.4,depth:1.4,height:.9},{id:"block-120",x:11.4,z:-9.8,width:1.4,depth:1.4,height:1.2}],doorways:[{id:"gate-wide",x:6.6,z:-4.3,openingWidth:2.4,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2},{id:"gate-narrow",x:11.4,z:-4.3,openingWidth:.5,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2}],obstacles:[{id:"crate-hub",x:2.5,z:-2.5,width:1.1,depth:1.1,height:.8},{id:"pillar-sw",x:-14.3,z:12.8,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-16,maxX:16,minZ:-16,maxZ:16},stations:[{id:"hub",index:1,name:"中央 8 向",hint:"推杆走 8 个方向 · 松手看停步收相 / 转身踏步",shape:"circle",x:0,z:0,radius:3.6,spawnX:0,spawnZ:0,labelX:0,labelZ:-3.1,color:"#8fe7ff"},{id:"rings",index:2,name:"环状态色阶",hint:"同距三假人：中立蓝 / 戒备黄 / 敌对红 · 点选看 3/4 环",shape:"circle",x:-9.5,z:-8.2,radius:3.4,spawnX:-9.5,spawnZ:-5.2,labelX:-9.5,labelZ:-10.9,color:"#ffc85a"},{id:"windup",index:3,name:"起手预警",hint:"走进 1.6m：脚下红弧填满 = 命中帧",shape:"circle",x:0,z:-10,radius:3.2,spawnX:0,spawnZ:-7,labelX:0,labelZ:-12.6,color:"#ff5a4a"},{id:"terrain",index:4,name:"地形 / 门洞",hint:"宽门 2.4m / 窄门 0.5m · 0.2m 台阶可走，0.6/0.9/1.2m 要跳",shape:"square",x:8.9,z:-7.4,radius:5.2,spawnX:8.9,spawnZ:-2.8,labelX:8.9,labelZ:-11.9,color:"#7fb8d8"},{id:"meter",index:5,name:"进度弧",hint:"弓长按 = 黄弧 · 法杖技2 = 紫弧 · 冲刺后 = 青弧冷却",shape:"circle",x:-9.5,z:8.6,radius:3.2,spawnX:-9.5,spawnZ:11.4,labelX:-9.5,labelZ:9.9,color:"#b48cff"},{id:"dash",index:6,name:"冲刺标尺",hint:"沿刻度跑：翻滚 3.2m / 闪现 5m，看落点差多少",shape:"square",x:9.8,z:8.2,radius:5.2,spawnX:9.8,spawnZ:12.8,labelX:7,labelZ:4.2,color:"#bfe8ff"},{id:"gait",index:7,name:"侧后方步态",hint:"面向假人贴到 1.2m，沿引线按 90 / 135 / 180 走",shape:"circle",x:-9.5,z:0,radius:3.2,spawnX:-9.5,spawnZ:2.6,labelX:-9.5,labelZ:-2.5,color:"#6fc9a0"}]},Ax={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:28,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.42},bodyTypes:{standard:{name:"标准",height:1.2,radius:.3},tall:{name:"瘦高",height:1.32,radius:.26,voxel:{headSize:.36,bodyWidth:.34,bodyHeight:.28,limbThickness:.1,legLength:.68,armLength:.5},colors:{body:"#58b39a",head:"#ffe0b2",limb:"#3f8f7c",shoe:"#24443c"}}},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.6,chestYawMaxDeg:40,stopYawBlendMode:"inStop",stopYawAfterSec:.3,turnStepEnabled:!0,turnStepPitch:.5,turnStepKnee:.35,turnStepDip:.02,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1,backStrafeStartDeg:100,backStrafeFullDeg:132,dirFlipSec:.16},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14,moveTakeover:{speed:.35,full:1.2,windup:.55,recovery:1,settle:1}},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13},stretch:{enabled:!0,swingArm:1.45,chargeArm:.88,runLeg:1,torsoGain:.5,impactSquash:.2,impactDecay:11,volumeExp:.5,smoothing:30},swing:{enabled:!0,bodyScale:1,shoulderLift:.055,shoulderPush:.045,shoulderIn:.032,segBlend:.1,segBlendMin:.03,segBlendRef:6,segBlendMax:.14,weaponScale:{greatsword:1,"sword-shield":.78,"dual-swords":.9},combo:{greatsword:["gs.right-left","gs.left-right","gs.overhead"],"sword-shield":["gs.right-left","gs.left-right","ss.shield-bash"],"dual-swords":["ds.right-left","ds.left-right","ds.spin"]},clips:{"gs.right-left":{kind:"right-left",note:"段 1：从右后方扫到左后方。rootYaw 整体带转 ±0.55 rad（≈31°）叠在腰椎 ±60° 上，大剑刃尖水平扫角约 210°",keys:[{t:0,ease:"in",pose:{bodyYaw:1.05,bodyPitch:-.14,bodyRoll:-.18,pelvisX:.06,pelvisZ:-.07,armPitch:-1.15,armYaw:.4,armRoll:.2,elbow:-.5,rootYaw:.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.08,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:0,armRoll:.04,elbow:-.3,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.15,bodyPitch:.16,bodyRoll:.2,pelvisX:-.07,pelvisZ:.11,armPitch:-1.5,armYaw:-.4,armRoll:-.14,elbow:-.12,rootYaw:-.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:-1.55}}]},"gs.left-right":{kind:"left-right",note:"段 2：承接段 1 左后方收势，整体带转 −0.55→+0.55 rad 反向拧回右后方，剑身仍水平",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-.4,armRoll:-.16,elbow:-.5,rootYaw:-.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:0,armRoll:.02,elbow:-.32,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:.4,armRoll:.16,elbow:-.12,rootYaw:.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:1.55}}]},"gs.overhead":{kind:"overhead",note:"段 3：举过头顶（剑身 75° 朝上）向前下劈到 −31°，躯干后仰 → 前压",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.32,bodyRoll:-.05,pelvisX:0,pelvisZ:-.07,armPitch:-1.9,armYaw:-.3,armRoll:.16,elbow:-.55,bladePitch:1.62,bladeTwist:0}},{t:.55,pose:{bodyYaw:.06,bodyPitch:.1,bodyRoll:0,pelvisX:0,pelvisZ:.03,armPitch:-1.1,armYaw:-.26,armRoll:.08,elbow:-.3,bladePitch:.55,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.55,bodyRoll:.02,pelvisX:0,pelvisZ:.13,armPitch:-.15,armYaw:-.2,armRoll:0,elbow:-.1,bladePitch:-.75,bladeTwist:0}}]},"ds.right-left":{kind:"right-left",note:"双持段 1：右手横扫到左后方，左手同时向左后方收（后摆 + 屈肘），两把剑都保持水平",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:1,bodyPitch:-.12,bodyRoll:-.16,pelvisX:.05,pelvisZ:-.06,armPitch:-1.15,armYaw:.9,armRoll:.18,elbow:-.45,armLPitch:.5,armLYaw:-1,armLRoll:.12,elbowL:-1.15,rootYaw:.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.06,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:-.1,armRoll:.04,elbow:-.3,armLPitch:.6,armLYaw:-1,armLRoll:.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.1,bodyPitch:.14,bodyRoll:.18,pelvisX:-.06,pelvisZ:.1,armPitch:-1.5,armYaw:-1.4,armRoll:-.12,elbow:-.12,armLPitch:.65,armLYaw:-.9,armLRoll:.18,elbowL:-1.3,rootYaw:-.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.55}}]},"ds.left-right":{kind:"left-right",note:"双持段 2：左手横扫回右后方，右手同时向右后方收（段 1 的镜像，主挥换到左手）",lead:"L",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-1.4,armRoll:-.16,elbow:-.5,armLPitch:.5,armLYaw:1,armLRoll:-.12,elbowL:-1.15,rootYaw:-.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:-.1,armRoll:.02,elbow:-.32,armLPitch:.6,armLYaw:.9,armLRoll:-.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:1.4,armRoll:.16,elbow:-.12,armLPitch:.65,armLYaw:.8,armLRoll:-.18,elbowL:-1.3,rootYaw:.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:1.55}}]},"ds.spin":{kind:"spin",note:"双持段 3：双剑水平展开（主副手 roll 外张到 ±1.15），整个人原地转一整圈。spin 按 attackProgress 单调推进到 2π≡0，收招自动回正",lead:"R",spin:{turns:1,ease:"inOut",span:.6},keys:[{t:0,ease:"in",pose:{bodyYaw:.1,bodyPitch:-.14,bodyRoll:0,pelvisX:0,pelvisZ:-.05,armPitch:-1.1,armYaw:1.7,armRoll:.3,elbow:-.5,armLPitch:-1.1,armLYaw:0,armLRoll:-.3,elbowL:-.5,bladePitch:.05,bladePitchOff:.05,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:.5,pose:{bodyYaw:0,bodyPitch:.04,bodyRoll:0,pelvisX:0,pelvisZ:.04,armPitch:-1.55,armYaw:2.1,armRoll:.45,elbow:-.05,armLPitch:-1.55,armLYaw:.3,armLRoll:-.45,elbowL:-.05,bladePitch:0,bladePitchOff:0,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:1,pose:{bodyYaw:-.1,bodyPitch:.12,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:-1.3,armYaw:1.9,armRoll:.4,elbow:-.25,armLPitch:-1.3,armLYaw:-.05,armLRoll:-.4,elbowL:-.25,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.35,bladeTwistOff:1.35}}]},"ss.shield-bash":{kind:"bash",note:"剑盾段 3：收盾蓄力 → 左臂持盾猛前顶（臂前伸 + 肘伸直 + 身体前压 + 骨盆前冲）。bladePitchOff 反解让盾面始终正对前方",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.28,bodyRoll:-.04,pelvisX:.01,pelvisZ:-.08,armPitch:.1,armYaw:-.2,armRoll:.1,elbow:-.7,armLPitch:-.7,armLYaw:.1,armLRoll:.15,elbowL:-.9,bladePitch:.2,bladePitchOff:.1,bladeTwist:0}},{t:.55,pose:{bodyYaw:.04,bodyPitch:.15,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:.2,armYaw:-.15,armRoll:.05,elbow:-.6,armLPitch:-1.1,armLYaw:.05,armLRoll:.1,elbowL:-.45,bladePitch:.1,bladePitchOff:.02,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.5,bodyRoll:.02,pelvisX:0,pelvisZ:.18,armPitch:.25,armYaw:-.1,armRoll:0,elbow:-.5,armLPitch:-1.55,armLYaw:0,armLRoll:.05,elbowL:-.05,bladePitch:.05,bladePitchOff:0,bladeTwist:0}}]}},poseIn:.1,poseOut:.16},stance:{"sword-shield":{armSwing:.85,armR:{pitch:-.12,roll:.1,elbow:-.15},armL:{pitch:-.45,roll:.1,elbow:-.75},torsoYaw:.12,bladePitchDeg:-8,blend:.22},"dual-swords":{armSwing:1,armR:{pitch:-.15,roll:.16,elbow:-.45},armL:{pitch:-.15,roll:-.16,elbow:-.45},torsoYaw:0,bladePitchDeg:-12,bladePitchOffDeg:-8,blend:.22},greatsword:{armSwing:.45,armR:{pitch:-.3,roll:.05,elbow:-.55},armL:{pitch:-.2,roll:-.1,elbow:-.65},torsoPitch:.04,bladePitchDeg:-30,blend:.26},staff:{armSwing:.6,armR:{pitch:-.1,roll:.06,elbow:-.35},armL:{pitch:.02,roll:-.08,elbow:-.15},torsoYaw:.06,blend:.22},bow:{armSwing:.55,armL:{pitch:-.15,roll:-.1,elbow:-.2},armR:{pitch:.02,elbow:-.25},torsoYaw:-.08,blend:.22}},spine:{enabled:!0,waist:.58,chest:.42,neck:.16,chestPivot:.42}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6,twoHandInsetX:.15,twoHandGripY:-.1,twoHandMaxStretch:1.3,twoHandMinGrip:.62,twoHandGripStart:1.02,twoHandSlideRate:9,swordCantDeg:10,greatswordCantDeg:0},weaponWrist:{enabled:!0,lag:.042,maxAngle:.72,rate:24,twistLag:.03,maxTwist:.5,runDrag:.11},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},groundRing:{playerRadiusFactor:2.3,dummyRadiusFactor:2.05,thicknessFactor:.16,arcDeg:180,selectedArcDeg:270,opacity:.22,playerOpacity:.44,selectedOpacity:.62,selectedScale:1.06,selectedThicknessScale:1.6,edgeFade:.2,playerColor:"#8fe7ff",neutralColor:"#7fb8d8",lowThreatColor:"#ffc85a",highThreatColor:"#ff3b30",haloRadiusFactor:1.16,haloThicknessFactor:2.6,haloOpacity:.14,haloFadeInSec:.05,haloFadeOutSec:.36,meterRadiusFactor:1.34,meterThicknessFactor:.52,meterOpacity:.9,meterColorCharge:"#ffd166",meterColorChannel:"#b48cff",meterColorCooldown:"#7fb8d8",warnRadiusFactor:1.14,warnThicknessFactor:1.5,warnOpacity:.9,warnColor:"#ff5a4a",areaOpacity:.5,landingOpacity:.55,areaExpandSec:.22},projectiles:{arrowColor:"#ffe3a6",arrowHeadColor:"#fff6d8",arrowTrailColor:"#ffcf86",arrowLength:.72,arrowWidth:.062,arrowHeadSize:.16,arrowGlowSize:.5,trailLength:1.05,trailOpacity:.42,boltColor:"#a9ecff",boltGlowColor:"#7fe3ff",boltShapeX:.42,boltShapeY:.42,boltShapeZ:.85,boltGlowScale:1.6,boltTrailScale:2.2,slashEnabled:!1,slashThickness:.075,slashGlowOpacity:.34},weaponTrail:{enabled:!0,maxSamples:30,minStep:.015,life:.11,minSpeed:5.5,color:"#8fd0ff",intensity:.42,tipBoost:.35,pulseDecay:14},hitstop:{enabled:!0,duration:.07},lab:{enabled:!0,showLabels:!0,padOpacity:.55,labelTextHeight:.82},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],attackArcColor:"#ff6b5e",fighterColors:[{body:"#c85a4a",limb:"#8d3a30",head:"#f0c9a0"},{body:"#c9a03c",limb:"#8a6b22",head:"#f0d6a0"},{body:"#7d6ec4",limb:"#4f4488",head:"#e6d2b0"}]},balance:{enabled:!0,reactionTime:.18,gravity:9.81,autoCounter:!0,maxShift:.045,counterRate:8,predLead:.12,counterBoost:1.6},renderInterp:{enabled:!0,yawSmoothMs:35},groundSlam:{enabled:!0,color:"#e8d8b0",duration:.42,delay:.09,outerScale:1.25,shake:.95}},Rx={core:Ex,scene:Tx,view:Ax};function _h(n){return JSON.parse(JSON.stringify(n))}const Mh=Rx,Px=_h(Mh.core),Ro=_h(Mh.scene),dn=_h(Mh.view);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class yi{constructor(t,e,i,a,s="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(s),this.domElement.classList.add("controller"),this.domElement.classList.add(a),this.$name=document.createElement("div"),this.$name.classList.add("name"),yi.nextNameID=yi.nextNameID||0,this.$name.id=`lil-gui-name-${++yi.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class Cx extends yi{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function vl(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const Lx={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:vl,toHexString:vl},io={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},Dx={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=io.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return io.toHexString(a)}},kx={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=io.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return io.toHexString(a)}},Ix=[Lx,io,Dx,kx];function Fx(n){return Ix.find(t=>t.match(n))}class zx extends yi{constructor(t,e,i,a){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=Fx(this.initialValue),this._rgbScale=a,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const s=vl(this.$text.value);s&&this._setValueFromHexString(s)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class yc extends yi{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",a=>{a.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class Nx extends yi{constructor(t,e,i,a,s,o){super(t,e,i,"number"),this._initInput(),this.min(a),this.max(s);const r=o!==void 0;this.step(r?o:this._getImplicitStep(),r),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let y=parseFloat(this.$input.value);isNaN(y)||(this._stepExplicit&&(y=this._snap(y)),this.setValue(this._clamp(y)))},i=y=>{const x=parseFloat(this.$input.value);isNaN(x)||(this._snapClampSetValue(x+y),this.$input.value=this.getValue())},a=y=>{y.key==="Enter"&&this.$input.blur(),y.code==="ArrowUp"&&(y.preventDefault(),i(this._step*this._arrowKeyMultiplier(y))),y.code==="ArrowDown"&&(y.preventDefault(),i(this._step*this._arrowKeyMultiplier(y)*-1))},s=y=>{this._inputFocused&&(y.preventDefault(),i(this._step*this._normalizeMouseWheel(y)))};let o=!1,r,l,c,h,u;const d=5,f=y=>{r=y.clientX,l=c=y.clientY,o=!0,h=this.getValue(),u=0,window.addEventListener("mousemove",g),window.addEventListener("mouseup",_)},g=y=>{if(o){const x=y.clientX-r,v=y.clientY-l;Math.abs(v)>d?(y.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(x)>d&&_()}if(!o){const x=y.clientY-c;u-=x*this._step*this._arrowKeyMultiplier(y),h+u>this._max?u=this._max-h:h+u<this._min&&(u=this._min-h),this._snapClampSetValue(h+u)}c=y.clientY},_=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",_)},m=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",a),this.$input.addEventListener("wheel",s,{passive:!1}),this.$input.addEventListener("mousedown",f),this.$input.addEventListener("focus",m),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,y,x,v,w)=>(p-y)/(x-y)*(w-v)+v,e=p=>{const y=this.$slider.getBoundingClientRect();let x=t(p,y.left,y.right,this._min,this._max);this._snapClampSetValue(x)},i=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",a),window.addEventListener("mouseup",s)},a=p=>{e(p.clientX)},s=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",a),window.removeEventListener("mouseup",s)};let o=!1,r,l;const c=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),o=!1},h=p=>{p.touches.length>1||(this._hasScrollBar?(r=p.touches[0].clientX,l=p.touches[0].clientY,o=!0):c(p),window.addEventListener("touchmove",u,{passive:!1}),window.addEventListener("touchend",d))},u=p=>{if(o){const y=p.touches[0].clientX-r,x=p.touches[0].clientY-l;Math.abs(y)>Math.abs(x)?c(p):(window.removeEventListener("touchmove",u),window.removeEventListener("touchend",d))}else p.preventDefault(),e(p.touches[0].clientX)},d=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",u),window.removeEventListener("touchend",d)},f=this._callOnFinishChange.bind(this),g=400;let _;const m=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const x=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+x),this.$input.value=this.getValue(),clearTimeout(_),_=setTimeout(f,g)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",m,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class Ux extends yi{constructor(t,e,i,a){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(a)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class Ox extends yi{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",a=>{a.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const Bx=`.lil-gui {
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
}`;function Hx(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let Xd=!1;class Rr{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:a,title:s="Controls",closeFolders:o=!1,injectStyles:r=!0,touchStyles:l=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",c=>{(c.code==="Enter"||c.code==="Space")&&(c.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(s),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),l&&this.domElement.classList.add("allow-touch-styles"),!Xd&&r&&(Hx(Bx),Xd=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),a&&this.domElement.style.setProperty("--width",a+"px"),this._closeFolders=o}add(t,e,i,a,s){if(Object(i)===i)return new Ux(this,t,e,i);const o=t[e];switch(typeof o){case"number":return new Nx(this,t,e,i,a,s);case"boolean":return new Cx(this,t,e);case"string":return new Ox(this,t,e);case"function":return new yc(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,i=1){return new zx(this,t,e,i)}addFolder(t){const e=new Rr({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof yc||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof yc)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=s=>{s.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const a=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=a+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function Gx(n,t,e,i){const a=document.getElementById("debug-panel"),s=a?new Rr({title:"实验台 · 调试面板",autoPlace:!1,container:a}):new Rr({title:"实验台 · 调试面板"}),o=n.config,r=[],l=[],c=Mt=>{const dt=s.addFolder(Mt);return l.push(dt),dt},h=(Mt,dt)=>{const st=Mt.addFolder(dt);return r.push(st),st},u=c("模拟 / 显示");u.add(e,"timeScale",0,3,.05).name("时间缩放"),u.add(e,"paused").name("暂停"),u.add({step:i.singleStep},"step").name("单步 (1 tick)"),u.add({reset:i.reset},"reset").name("复位全部"),u.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),u.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid),u.add(e,"showLab").name("工位地面盘").onChange(i.onToggleLab),u.add(e,"showLabLabels").name("工位标牌").onChange(i.onToggleLabLabels);const d=h(u,"模块开关");d.add(n.modules,"movement").name("movement"),d.add(n.modules,"combat").name("combat"),d.add(n.modules,"links").name("links"),d.add(n.modules,"orientation").name("orientation"),d.add(n.modules,"turnInPlace").name("turnInPlace"),d.add(n.modules,"targeting").name("targeting"),d.add(n.modules,"hits").name("hits"),d.add(n.modules,"separation").name("separation"),d.add(n.modules,"dash").name("dash"),d.add(n.modules,"camera").name("camera"),d.add(n.modules,"dummies").name("dummies"),d.add(n.modules,"abilities").name("abilities");const f=c("移动 / 输入"),g=h(f,"基础移动参数");g.add(o,"moveSpeed",1,10,.1).name("移动速度"),g.add(o,"sprintMultiplier",1,3,.05).name("冲刺倍率"),g.add(o,"acceleration",1,40,.5).name("加速度"),g.add(o,"friction",1,40,.5).name("摩擦"),g.add(o,"skillDecel",2,40,.5).name("进入技能时的减速速率"),g.add(o,"gravity",5,60,.5).name("重力"),g.add(o,"jumpSpeed",2,16,.2).name("起跳速度"),g.add(o,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),g.add(o,"characterRadius",.1,.8,.01).name("角色半径"),g.add(o,"characterHeight",.6,2.2,.05).name("角色身高"),g.add(o,"strideLength",.3,3,.05).name("基础步幅"),g.add(o,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),g.add(o,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const _=h(f,"摇杆 / 输入");_.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),_.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const m=o.dash,p=h(f,"冲刺 / 闪避");p.add(m,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),p.add(m,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),p.add(m,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),p.add(m,"blinkDistance",1,12,.25).name("闪现距离 (m)"),p.add(m,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),p.add(m,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),p.add(m,"blinkClearVelocity").name("闪现清空速度"),p.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),p.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const y=o.separation,x=h(f,"角色间分离 / 挤压阻力");x.add(y,"iterations",1,8,1).name("迭代次数"),x.add(y,"slop",0,.05,.002).name("额外分离量 (m)"),x.add(y.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),x.add(y.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),x.add(y.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const v=c("动作 / 步态"),w=h(v,"程序化步态");w.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),w.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),w.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),w.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),w.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),w.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),w.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),w.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),w.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),w.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),w.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),w.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),w.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),w.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)"),w.add(t.gait,"backStrafeStartDeg",20,170,1).name("侧后方起步角 (°)"),w.add(t.gait,"backStrafeFullDeg",40,180,1).name("完全后退角 (°)"),w.add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)"),w.add(t.gait,"dirFlipSec",0,.4,.01).name("换向融合时长 (s)");const S=h(v,"停步 / 收相 / 惯性");S.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),S.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),S.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),S.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),S.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),S.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),S.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),S.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),S.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),S.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),S.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),S.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const E=h(v,"足部 IK"),A=t.ik;E.add(A,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),E.add(A,"weight",0,1,.01).name("钉地权重"),E.add(A,"attackScale",0,1,.01).name("攻击时权重倍率"),E.add(A,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const b=h(v,"惯性倾斜 / 盆骨"),M=t.lean;b.add(M,"accelGain",0,.1,.002).name("前后加速度增益"),b.add(M,"turnGain",0,.2,.005).name("绕圈侧倾增益"),b.add(M,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),b.add(M,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),b.add(M,"smoothing",1,30,1).name("倾斜平滑速率"),b.add(M,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),b.add(M,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),b.add(M,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),b.add(M,"crouchSmoothing",1,30,1).name("下沉平滑速率");const P=o.orientation,C=h(v,"朝向 / 接敌注视 / 原地转身");C.add(P,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),C.add(P,"headTurnRate",.5,40,.5).name("头部转向速率"),C.add(P,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),C.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),C.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),C.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const F=o.gaze;C.add(F,"headReturnRate",.5,12,.1).name("无目标回正速率 (1/s)"),C.add(F,"headReturnSpeedDeg",20,400,10).name("回正角速度上限 (°/s)"),C.add(F,"bodyTurnRate",.2,12,.1).name("接敌身体转向速率"),C.add(F,"headTurnRate",.5,30,.5).name("接敌头部转向速率"),C.add(F,"maxHeadSpeedDeg",30,900,10).name("头部最大角速度 (°/s)"),C.add(F,"maxBodySpeedDeg",20,600,10).name("身体最大角速度 (°/s)"),C.add(F,"aimHeightRatio",.2,1,.05).name("注视点高度（身高比例）"),C.add(F,"headPitchRate",.5,20,.5).name("头部俯仰速率"),C.add(F,"maxHeadPitchDeg",0,60,1).name("头部俯仰限幅 (°)"),C.add(F,"bodyPitchScale",0,1,.05).name("身体俯仰比例"),C.add(F,"bodyPitchRate",.5,20,.5).name("身体俯仰速率");const N=o.turnInPlace;C.add(N,"enabled").name("启用原地转身 (关=纯插值)"),C.add(N,"triggerDeg",20,180,5).name("触发夹角 (°)"),C.add(N,"gazeTriggerDeg",20,180,5).name("接敌时触发夹角 (°)"),C.add(N,"settleDeg",0,60,1).name("转身保留余角 (°)"),C.add(N,"durationSec",.1,1.5,.02).name("转身时长 (s)"),C.add(N,"idleSpeedRatio",0,.3,.01).name("静止速度比上限"),C.add(N,"inputDeadZone",0,.5,.01).name("起步输入死区"),C.add(N,"armSec",0,.5,.01).name("触发防抖 (s)"),C.add(t.gait,"stopYawBlendMode",["inStop","afterStop"]).name("停步偏差消化窗口"),C.add(t.gait,"stopYawAfterSec",.05,1,.02).name("收相后消化时长 (s)"),C.add(t.gait,"turnStepEnabled").name("转身踏步 (关=滑过去)"),C.add(t.gait,"turnStepPitch",0,1.2,.02).name("踏步前迈 (rad)"),C.add(t.gait,"turnStepKnee",0,1,.02).name("踏步抬膝 (rad)"),C.add(t.gait,"turnStepDip",0,.1,.002).name("踏步重心下沉 (m)");const L=c("战斗 / 命中"),I=o.combat,z=h(L,"连击 / 武器时序"),G=z.add(n.combat,"weapon",na).name("当前武器");z.add(I,"comboWindow",.1,2,.05).name("连击窗口 (s)"),z.add(I,"settle",0,.8,.01).name("段间停顿 (s)"),z.add(I,"attackMoveScale",0,1,.01).name("攻击时移动比例"),z.add(I,"lungeMoveScale",0,.4,.01).name("跨步时移动比例"),z.add(I,"lungeCurve",.2,4,.1).name("跨步曲线指数 (大=更冲)"),z.add(I,"lungeMaxSpeed",4,30,.5).name("跨步速度上限 (m/s)"),z.add(I,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),z.add(I,"cancelWindow",0,1,.01).name("取消窗口 (s)"),z.add(I,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),z.add(I,"autoCombo").name("按住自动连击"),z.add(I.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),z.add(I.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),z.add(I.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),z.add(I.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率"),z.add(I.bow,"maxChargeTime",.2,2,.05).name("满蓄力时间 (s)"),z.add(I.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),z.add(I.bow,"autoFire").name("蓄满自动放箭 (按住连射)"),z.add(I.bow.trajectory,"gravity",0,24,.5).name("箭矢重力 (m/s²)"),z.add(I.bow.trajectory,"speedMax",8,32,.5).name("满蓄初速 (m/s)"),z.add(I.bow.trajectory,"homingRange",0,30,1).name("自动瞄准距离 (m)"),z.add(I.bow.trajectory,"turnRateDeg",0,240,5).name("箭追踪转向 (°/s)"),z.add(I.bow.trajectory,"homingTime",0,2,.05).name("追踪时长 (s)"),z.add(I.bow.trajectory,"aimHeightRatio",0,1,.05).name("瞄准点高度");const $=o.abilities;z.add($.arcane,"perWave",1,8,1).name("每波飞弹数"),z.add($.arcane,"waves",1,12,1).name("每次引导波数"),z.add($.arcane,"waveInterval",.05,.8,.01).name("波间隔 (s)"),z.add($.arcane,"spreadDeg",0,20,.5).name("波内散布 (度)"),z.add($.arcane,"spreadTime",0,.6,.01).name("出膛散开时长 (s)"),z.add($.arcane,"spawnDelay",0,.2,.005).name("波内出膛错落 (s)"),z.add($.arcane,"speedJitter",0,.5,.02).name("速度浮动比例"),z.add($.arcane,"turnRateDeg",0,420,10).name("制导转向 (度/秒)"),z.add($.arcane,"retargetInterval",.05,1,.05).name("重新索敌间隔 (s)"),z.add($.arcane,"cooldown",0,3,.05).name("引导结束冷却 (s)"),z.add($.arcane,"speed",3,24,.5).name("飞弹速度"),z.add($.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),z.add($.ring,"radius",.5,5,.1).name("电环半径"),z.add($.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),z.add($.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const et=o.hits.hitstopWarp;if(et){const Mt=h(L,"卡肉节奏（接触瓦片）");Mt.add(et,"enabled").name("瓦片开（关=硬冻结）"),Mt.add(et,"holdRate",0,.4,.01).name("保持期速率"),Mt.add(et,"release",.005,.2,.005).name("释放时长 (s)"),Mt.add(et,"payback",1,2.5,.05).name("偿还倍率"),Mt.add(o.hits.hitstop,"light",0,.2,.005).name("轻击保持 (s)"),Mt.add(o.hits.hitstop,"heavy",0,.25,.005).name("重击保持 (s)"),Mt.add(o.hits.hitstop,"knock",0,.3,.005).name("击飞保持 (s)")}const ft=o.hits,vt=h(L,"命中 / 受击 / 击退");vt.add(ft,"arcDeg",10,120,5).name("命中扇区半角 (°)"),vt.add(ft,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),vt.add(ft,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),vt.add(ft,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),vt.add(ft.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),vt.add(ft.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),vt.add(ft,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),vt.add(ft,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const It={get enabled(){return!ft.noDamageToPlayer},set enabled(Mt){ft.noDamageToPlayer=!Mt}};vt.add(It,"enabled").name("玩家受击击退");const Y=h(L,"受击分层"),Q=t.hurt;Y.add(Q,"enabled").name("启用分层受击 (关=旧版对照)"),Y.add(Q,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),Y.add(Q,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),Y.add(Q,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),Y.add(Q,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),Y.add(Q,"upperShiftScale",0,1,.01).name("上身位移缩放"),Y.add(Q,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),Y.add(Q.hitHeight,"light",0,1,.01).name("轻击命中部位"),Y.add(Q.hitHeight,"heavy",0,1,.01).name("重击命中部位"),Y.add(Q.hitHeight,"knock",0,1,.01).name("击退命中部位"),Y.add(Q,"leanLight",0,1.5,.01).name("轻击力度"),Y.add(Q,"leanHeavy",0,1.5,.01).name("重击力度"),Y.add(Q,"leanKnock",0,1.5,.01).name("击退力度"),Y.add(Q,"flashStrength",0,2,.05).name("受击闪光强度");for(const{name:Mt,p:dt}of[{name:"打腹 (abdomen)",p:Q.abdomen},{name:"打肩 (shoulder)",p:Q.shoulder}]){const st=h(Y,Mt);st.add(dt,"upperPitch",0,2,.01).name("上身前后倾斜"),st.add(dt,"upperRoll",0,2,.01).name("上身侧倾"),st.add(dt,"upperYaw",0,1.5,.01).name("肩部扭转"),st.add(dt,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),st.add(dt,"shift",0,.8,.01).name("身体反应位移"),st.add(dt,"drop",0,.4,.01).name("整体下沉"),st.add(dt,"back",0,.4,.01).name("屁股向后"),st.add(dt,"knee",0,1.6,.01).name("屈膝"),st.add(dt,"hip",0,1,.01).name("髋前倾"),st.add(dt,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)")}const pt=h(L,"派生招"),at=o.links;pt.add(at,"enabled").name("总开关 (false=旧连击)"),pt.add(at.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),pt.add(at.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),pt.add(at.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),pt.add(at,"sharedCooldown",0,3,.05).name("共享 CD (s)"),pt.add(at,"triggerWhileSprinting").name("长跑中可直接触发"),pt.add(at.search,"range",1,14,.1).name("索敌距离 (m)"),pt.add(at.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),pt.add(at.search,"stopDistance",0,3,.05).name("停住距离 (m)");const K=at.moves["sword-shield"];K&&(pt.add(K,"enabled").name("剑盾盾击"),pt.add(K,"distance",0,8,.1).name("冲锋极限 (m)"),pt.add(K,"windup",0,.5,.01).name("前摇 (s)"),pt.add(K,"active",0,.8,.01).name("冲锋 / 命中 (s)"),pt.add(K,"recovery",0,.8,.01).name("收势 (s)"),pt.add(K.hit,"radius",0,4,.05).name("命中半径 (m)"),pt.add(K.hit,"width",0,2,.05).name("扫掠半径 (m)"),pt.add(K.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),pt.add(K.hit,"duration",0,1.5,.01).name("僵直 (s)"));const Z=o.targeting,_t=h(L,"目标辅助");_t.add(Z,"targetAssist").name("启用目标辅助"),_t.add(Z,"range",1,14,.5).name("锁定范围 (m)"),_t.add(Z,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),_t.add(Z,"frontBias",0,4,.1).name("朝向加权"),_t.add(Z,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),_t.add(Z,"maxLungeScale",1,3,.1).name("前冲最大放大");const Ft=c("表现 / 特效"),ht=h(Ft,"挥击幅度 / 刀光"),Pt=t.animation.swing;ht.add(Pt,"enabled").name("挥击身体幅度 开"),ht.add(Pt,"bodyScale",0,1.6,.05).name("躯干 / 骨盆幅度倍率"),ht.add(Pt,"shoulderLift",0,.12,.005).name("肩部抬升上限 (m)"),ht.add(Pt,"shoulderPush",0,.1,.005).name("肩部前送上限 (m)"),ht.add(Pt,"shoulderIn",0,.1,.005).name("双手武器肩内收 (m)"),ht.add(Pt,"segBlend",0,.35,.01).name("段间过渡兜底 (s)"),ht.add(Pt,"segBlendMin",.008,.12,.004).name("段间过渡下限 (s)"),ht.add(Pt,"segBlendRef",2,16,.5).name("段间过渡参考距离 (rad)"),ht.add(Pt.weaponScale,"greatsword",0,1.6,.05).name("大剑幅度倍率");const B=t.weaponTrail;ht.add(B,"enabled").name("挥击刀光 开"),ht.add(B,"life",.04,.4,.01).name("刀光残留 (s)"),ht.add(B,"intensity",0,1.5,.05).name("刀光亮度"),ht.add(B,"minStep",.005,.1,.005).name("采样最小位移 (m)"),ht.add(t.hitstop,"enabled").name("命中卡肉 / 震屏");const ne=h(Ft,"夸张化 / 四肢伸缩"),Ot=t.animation.stretch;ne.add(Ot,"enabled").name("四肢伸缩 开"),ne.add(Ot,"swingArm",1,1.8,.01).name("挥出时手臂拉伸"),ne.add(Ot,"chargeArm",.7,1,.01).name("蓄力时手臂压缩"),ne.add(Ot,"impactSquash",0,.5,.01).name("命中挤压量"),ne.add(Ot,"impactDecay",2,30,.5).name("挤压回弹速率 (1/s)"),ne.add(Ot,"torsoGain",0,1,.05).name("躯干跟随比例"),ne.add(Ot,"volumeExp",0,1.5,.05).name("体积补偿指数");const Ct=h(Ft,"武器握持 / 腕部"),xt=t.weaponWrist;Ct.add(xt,"enabled").name("腕部滞后 开（关掉=武器焊在手上）"),Ct.add(xt,"lag",0,.08,.002).name("臂速 → 腕滞后"),Ct.add(xt,"maxAngle",0,1.2,.02).name("腕滞后上限 (rad)"),Ct.add(xt,"rate",4,50,1).name("腕部跟随速率 (1/s)"),Ct.add(xt,"twistLag",0,.06,.002).name("躯干扭转 → 剑横甩"),Ct.add(xt,"maxTwist",0,.9,.02).name("横甩上限 (rad)");const Nt=t.weaponMount;Ct.add(Nt,"twoHandInsetX",0,.3,.01).name("双手武器内收 (m)"),Ct.add(Nt,"twoHandGripY",-.5,0,.01).name("副握点在柄上的位置"),Ct.add(Nt,"twoHandMaxStretch",1,1.8,.01).name("副手臂长拉伸上限"),Ct.add(Nt,"twoHandMinGrip",0,1,.02).name("最低握持权重（1=永不松手）"),Ct.add(Nt,"twoHandGripStart",1,1.4,.01).name("开始松手的臂展比"),Ct.add(Nt,"twoHandSlideRate",0,30,1).name("握点滑柄跟随速率 (1/s)"),Ct.add(Nt,"swordPitchDeg",0,90,1).name("剑前倾角"),Ct.add(Nt,"swordYawDeg",0,45,1).name("剑外张角"),Ct.add(Nt,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),Ct.add(Nt,"staffPitchDeg",0,60,1).name("法杖前倾角");const Bt=c("假人 / 混战"),k=o.dummies,T=h(Bt,"普通假人 AI");T.add(k,"moveSpeed",.5,8,.1).name("移动速度"),T.add(k,"wanderRadius",.5,8,.1).name("游走半径"),T.add(k,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),T.add(k,"followStopDistance",.3,5,.1).name("跟随停距"),T.add(k,"keepDistance",1,10,.1).name("保持距离"),T.add(k,"keepDeadZone",.1,2,.05).name("保持死区"),T.add(k,"attackRange",.5,5,.1).name("攻击距离"),T.add(k,"attackInterval",.3,5,.1).name("攻击间隔 (s)"),T.add(k,"leashRadius",0,8,.1).name("牵引半径 (0=不限)");const j=k.fighters;if(j){const Mt=h(Bt,"持械陪练（剑盾 / 双刀 / 大剑）");Mt.add(j,"moveSpeed",.5,6,.1).name("移动速度"),Mt.add(j,"attackInterval",.5,8,.1).name("攻击间隔 (s)"),Mt.add(j,"attackRangeScale",.5,1.2,.02).name("起手距离 / 武器 reach"),Mt.add(j,"knockbackScale",0,2,.05).name("击退比例"),Mt.add(j,"leashRadius",0,14,.5).name("牵引半径 (m)"),Mt.add(j,"comboCount",0,3,1).name("连击段数 (0=随武器)"),Mt.add(j,"comboGap",0,.6,.01).name("段间缝隙 (s, 0=用全局)");const dt=()=>n.dummies.find(wt=>wt.weapon!==null),st={get mode(){var wt;return((wt=dt())==null?void 0:wt.mode)??"spar"},set mode(wt){i.setFighterMode(wt)}};Mt.add(st,"mode",If).name("陪练行为（全部）")}const ut=c("相机"),J=h(ut,"基础");J.add(t.camera,"pitchDeg",20,80,1).name("俯角"),J.add(t.camera,"yawDeg",-180,180,1).name("方位角"),J.add(t.camera,"distance",6,35,.5).name("距离"),J.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),J.add(t.camera,"fov",25,90,1).name("FOV");const ct=o.camera,zt=h(ut,"智能构图");zt.add(ct,"radius",2,18,.5).name("威胁评估半径 (m)"),zt.add(ct,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),zt.add(ct,"saturation",.5,8,.1).name("威胁归一化饱和"),zt.add(ct,"pushIn",0,.5,.01).name("无威胁推进比例"),zt.add(ct,"maxPullback",0,1,.02).name("最大拉远比例"),zt.add(ct,"maxOffset",0,6,.1).name("最大构图平移 (m)"),zt.add(ct,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),zt.add(ct,"framingBias",0,1,.05).name("威胁质心平移系数"),zt.add(ct,"attackBoost",0,2,.05).name("挥砍中额外加权"),zt.add(ct.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),zt.add(ct.modeWeight,"spar",0,3,.05).name("陪练模式威胁倍率"),zt.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const St=h(ut,"缩放");return St.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),St.add(t.zoom,"max",1,4,.05).name("最大拉远上限"),St.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),St.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),St.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),St.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),St.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),St.add({reset:i.resetZoom},"reset").name("缩放归 1"),r.forEach(Mt=>Mt.close()),l.forEach(Mt=>Mt.close()),s.close(),{gui:s,refreshWeapon:()=>G.updateDisplay()}}function Vx(n,t,e){let i=null,a=Number.POSITIVE_INFINITY;for(const s of n){const o=Math.hypot(t-s.x,e-s.z);o<=s.radius&&o<a&&(i=s,a=o)}return i}function Xx(n,t){return n.find(e=>e.id===t)??null}function Wd(n,t,e){if(n.length===0)return null;const i=[...n].sort((r,l)=>r.index-l.index),a=i.findIndex(r=>r.id===t),s=e<0?-1:1,o=a<0?s>0?0:i.length-1:(a+s+i.length)%i.length;return i[o]??null}function Wx({stations:n,world:t,view:e,container:i,onResetZoom:a}){const s=i??document.getElementById("lab-panel");let o=null,r=null;const l=new Map,c=document.createElement("div");c.id="lab-toast",c.setAttribute("aria-live","polite"),document.body.appendChild(c);let h=0;function u(m){c.textContent=`${m.index} · ${m.name} — ${m.hint}`,c.style.borderColor=m.color,c.classList.add("is-on"),window.clearTimeout(h),h=window.setTimeout(()=>c.classList.remove("is-on"),5e3)}function d(){return Vx(n,t.character.position.x,t.character.position.z)}function f(){const m=d(),p=(m==null?void 0:m.id)??null;if(p===o)return;const y=o!==null;o=p;for(const[x,v]of l)v.classList.toggle("is-active",x===p);r&&(r.textContent=m?`${m.index} · ${m.hint}`:"不在任何工位内：点上面的名字传送，或直接走过去",r.style.color=m?"rgba(206, 226, 244, 0.9)":"rgba(150, 172, 192, 0.62)"),m?u(m):y&&c.classList.remove("is-on")}function g(m){const p=typeof m=="number"?n.find(y=>y.index===m)??null:Xx(n,m);return p?(Pg(t,p.spawnX,p.spawnZ),t.camera.centroidX=p.spawnX,t.camera.centroidZ=p.spawnZ,e.snapCamera(p.spawnX,t.character.position.y,p.spawnZ),f(),!0):!1}function _(){np(t)}if(s){s.textContent="";const m=document.createElement("div");m.className="lab-head",m.textContent="测试工位";const p=document.createElement("span");p.className="lab-tip",p.textContent="[ / ] 切换",m.appendChild(p),s.appendChild(m);for(const v of[...n].sort((w,S)=>w.index-S.index)){const w=document.createElement("button");w.type="button",w.className="lab-row",w.dataset.station=v.id,w.dataset.uiButton="",w.style.setProperty("--lab-color",v.color),w.setAttribute("aria-label",`传送到工位 ${v.index}：${v.name}`);const S=document.createElement("span");S.className="lab-idx",S.textContent=String(v.index);const E=document.createElement("span");E.className="lab-name",E.textContent=v.name,w.append(S,E),w.addEventListener("pointerdown",A=>{A.preventDefault(),A.stopPropagation(),g(v.id)}),s.appendChild(w),l.set(v.id,w)}r=document.createElement("div"),r.className="lab-hint",s.appendChild(r);const y=document.createElement("div");y.className="lab-foot";const x=document.createElement("button");if(x.type="button",x.className="lab-btn",x.dataset.uiButton="",x.textContent="召回假人",x.setAttribute("aria-label","召回全部假人回到各自工位"),x.addEventListener("pointerdown",v=>{v.preventDefault(),v.stopPropagation(),_()}),y.appendChild(x),a){const v=document.createElement("button");v.type="button",v.className="lab-btn",v.dataset.uiButton="",v.textContent="镜头归位",v.setAttribute("aria-label","把镜头缩放恢复到默认"),v.addEventListener("pointerdown",w=>{w.preventDefault(),w.stopPropagation(),a()}),y.appendChild(v)}s.appendChild(y)}return window.addEventListener("keydown",m=>{var p,y;if(!(m.metaKey||m.ctrlKey||m.altKey))if(m.key==="["){const x=Wd(n,((p=d())==null?void 0:p.id)??o,-1);x&&g(x.id)}else if(m.key==="]"){const x=Wd(n,((y=d())==null?void 0:y.id)??o,1);x&&g(x.id)}else m.key==="\\"&&_()}),f(),{goto:g,current:d,tick:f,recall:_,element:s}}const _c=Math.PI*2,mi={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},Yx=45,$x=50;function Zx(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function Is(n,t,e){const i=Zx(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function jx(n,t){return Math.atan2(n,-t)*180/Math.PI}function Yd(n,t){return Math.abs(((n-t)%360+540)%360-180)}function Po(n){return(n%360+360)%360}const qx={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function Kx(n,t,e,i=8){const a=n.character,s=t.intents,o=Math.hypot(s.moveX,s.moveZ),r=Math.hypot(t.stickRawX,t.stickRawY),l=a.velocity,c=Math.hypot(l.x,l.z),h=o>.001?Is(s.moveX,s.moveZ,e):null,u=c>.15?Is(l.x,l.z,e):null,d=Is(Math.sin(a.facing),Math.cos(a.facing),e),f=s.aimActive&&Math.hypot(s.aimX,s.aimZ)>1e-6?Is(s.aimX,s.aimZ,e):null,g=n.targeting,_=g.hasTarget?Is(Math.sin(g.targetYaw),Math.cos(g.targetYaw),e):null,m=h!==null&&u!==null?Yd(h,u):null,p=h!==null?Yd(h,d):null,y=m!==null&&m>Yx&&o>=.35&&c>=.4;return{inDeg:h,inLen:Math.min(1,o),rawDeg:r>.02?jx(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,r),stickHeld:t.stickHeld,moveDeg:u,speed:c,faceDeg:d,lockDeg:_,lockId:g.targetId,lockDist:g.targetDist,aimDeg:f,gapMove:m,gapFace:p,warnMove:y}}function $d(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>$x&&(n.inLen>=.35||n.speed>=.4)}const Zd="harness.dirDebug";function Jx(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const a=e.querySelector("#dirdbg-canvas"),s=e.querySelector("#dirdbg-toggle"),o={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},r=a.getContext("2d");let l=!0;if(!t)try{l=window.localStorage.getItem(Zd)!=="0"}catch{}function c(){e.classList.toggle("is-off",!l),s&&(s.textContent=l?"方向 ⌄":"方向 ▸",s.setAttribute("aria-expanded",String(l)))}c();function h(x){if(l=x,!t)try{window.localStorage.setItem(Zd,x?"1":"0")}catch{}c()}s==null||s.addEventListener("pointerdown",x=>{x.preventDefault(),x.stopPropagation(),h(!l)}),t||window.addEventListener("keydown",x=>{x.key.toLowerCase()==="v"&&!x.metaKey&&!x.ctrlKey&&h(!l)});const u=Math.min(3,Math.max(1,window.devicePixelRatio||1)),d=118;a.width=Math.round(d*u),a.height=Math.round(d*u);let f=qx,g=0,_="",m=8;function p(x){if(!r)return;const v=d,w=d,S=v/2,E=w/2,A=Math.min(v,w)/2-13;r.setTransform(u,0,0,u,0,0),r.clearRect(0,0,v,w),r.beginPath(),r.arc(S,E,A,0,_c),r.fillStyle="rgba(8, 12, 17, 0.5)",r.fill(),r.lineWidth=1,r.strokeStyle=x.warnMove?"rgba(251, 191, 36, 0.85)":mi.ring,r.stroke(),r.strokeStyle=mi.grid,r.beginPath(),r.moveTo(S-A,E),r.lineTo(S+A,E),r.moveTo(S,E-A),r.lineTo(S,E+A),r.stroke();for(let C=0;C<8;C++){const F=C*Math.PI/4,N=S+Math.sin(F)*(A-3),L=E-Math.cos(F)*(A-3),I=S+Math.sin(F)*A,z=E-Math.cos(F)*A;r.beginPath(),r.moveTo(N,L),r.lineTo(I,z),r.stroke()}const b=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;b>0&&(r.save(),r.setLineDash([2,3]),r.strokeStyle=mi.dead,r.beginPath(),r.arc(S,E,A*b,0,_c),r.stroke(),r.restore());const M=(C,F,N,L,I=!1,z=1)=>{const G=C*Math.PI/180,$=Math.sin(G),et=-Math.cos(G),ft=A*Math.max(.14,Math.min(1,F)),vt=S+$*A*.14,It=E+et*A*.14,Y=S+$*ft,Q=E+et*ft;if(r.save(),r.globalAlpha=z,r.strokeStyle=N,r.fillStyle=N,r.lineWidth=L,r.lineCap="round",I&&r.setLineDash([3,3]),r.beginPath(),r.moveTo(vt,It),r.lineTo(Y,Q),r.stroke(),!I&&ft>A*.3){const pt=-et,at=$,K=5.2;r.beginPath(),r.moveTo(Y+$*1.5,Q+et*1.5),r.lineTo(Y-$*K+pt*K*.72,Q-et*K+at*K*.72),r.lineTo(Y-$*K-pt*K*.72,Q-et*K-at*K*.72),r.closePath(),r.fill()}r.restore()},P=(C,F)=>{const N=C*Math.PI/180,L=Math.sin(N),I=-Math.cos(N),z=-I,G=L,$=A+1.5,et=$+6.5;r.save(),r.fillStyle=F,r.strokeStyle=F,r.lineWidth=1,r.beginPath(),r.moveTo(S+L*et,E+I*et),r.lineTo(S+L*$+z*4,E+I*$+G*4),r.lineTo(S+L*$-z*4,E+I*$-G*4),r.closePath(),r.fill(),r.restore()};x.lockDeg!==null&&M(x.lockDeg,1,mi.lock,1,!0,.7),x.rawDeg!==null&&x.stickHeld&&M(x.rawDeg,x.rawLen,mi.raw,1,!0,.9),x.aimDeg!==null&&M(x.aimDeg,1,mi.aim,1.6,!0,.95),M(x.faceDeg,1,mi.face,1.1,!0,.55),x.moveDeg!==null&&M(x.moveDeg,x.speed/Math.max(1,m),mi.move,5.5,!1,.8),x.inDeg!==null&&M(x.inDeg,x.inLen,mi.input,2.2),P(x.faceDeg,mi.face),r.beginPath(),r.arc(S,E,2.2,0,_c),r.fillStyle="rgba(220, 235, 248, 0.85)",r.fill()}function y(x,v){const w=A=>A===null?"-":String(Math.round(Po(A)));o.in.textContent=`入 ${w(x.inDeg)}`,o.mv.textContent=`移 ${w(x.moveDeg)}`,o.fc.textContent=`面 ${w(x.faceDeg)}`;const S=A=>A===null?"-":`${Math.round(A)}°`,E=[`Δ入→移 ${S(x.gapMove)}`,`Δ入→面 ${S(x.gapFace)}`];x.speed>.05&&E.push(`v${x.speed.toFixed(1)}`),x.lockDeg!==null&&E.push(`锁#${x.lockId} ${x.lockDist.toFixed(1)}m`),x.aimDeg!==null&&E.push("拖拽瞄准"),o.gap.textContent=E.join("  "),e.classList.toggle("is-warn",x.warnMove||$d(x,v))}return{update(x,v,w){if(!l)return;m=Math.max(1,x.config.moveSpeed*Math.max(1,x.config.sprintMultiplier));const S=Kx(x,v,w,m);f=S;const E=x.combat.phase!=="idle";p(S);const A=performance.now(),b=`${S.inDeg}|${S.moveDeg}|${S.faceDeg}|${S.lockId}|${S.aimDeg}|${S.warnMove}|${S.speed.toFixed(1)}`;(A-g>90||b!==_)&&(g=A,_=b,y(S,E),e.dataset.in=S.inDeg===null?"":Po(S.inDeg).toFixed(1),e.dataset.mv=S.moveDeg===null?"":Po(S.moveDeg).toFixed(1),e.dataset.fc=Po(S.faceDeg).toFixed(1),e.dataset.warn=S.warnMove||$d(S,E)?"1":"0")},setEnabled:h,toggle(){return h(!l),l},enabled:()=>l,last:()=>f}}const Qx=6,tv=480,jd=240,qd=128,ev=18,nv=.05,Kd=.16,iv=.02;function Jd(n,t,e){if(!e)return"air";if(t<nv)return"both";const i=Math.sin(n);return i>Kd?"L":i<-Kd?"R":"both"}function Qd(n){const t=Math.PI*2;return(n%t+t)%t}function tu(n,t){const e=Math.PI*2;let i=t-n;return i-=Math.round(i/e)*e,n+i}const eu={L:"#fbbf24",R:"#a78bfa",both:"rgba(148, 163, 184, 0.85)",air:"#38bdf8"},av={L:"rgba(251, 191, 36, 0.13)",R:"rgba(167, 139, 250, 0.13)",both:"rgba(148, 163, 184, 0.09)",air:"rgba(56, 189, 248, 0.07)"},sv={L:"左踩",R:"右踩",both:"双踩",air:"腾空"};function ov(n,t,e,i){const a=t-n;return{t:i,speed:t,drive:t,raw:t,dv:a,accel:e>1e-4?a/e:0,busy:!1,phase:0,stance:"both",grounded:!0,moving:!1}}function rv(n,t,e,i){const s=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:s,speed:Math.min(s,Math.max(1,i))}}function cv(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function lv(n={}){const t=Math.max(1,n.windowS??Qx),e=Math.max(60,n.capacity??tv),i=Math.max(1,n.speedCap??ev),a=!!(n.container&&n.toggle),s=n.container??document.createElement("div");s.id="motiondbg",n.container||(s.setAttribute("data-ui-region",""),document.body.appendChild(s));const o=['<div id="motiondbg-head"><span>速度(位移) / Δv / 相位</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="128"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");s.innerHTML=a?`<div id="motiondbg-body">${o}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${o}</div>`].join("");const r=n.toggle??s.querySelector("#motiondbg-toggle"),l=s.querySelector("#motiondbg-graph"),c=s.querySelector("#motiondbg-read"),h=s.querySelector("#motiondbg-window"),u=s.querySelector("#motiondbg-dir");h.textContent=`${t.toFixed(1)}s`;const d=l.getContext("2d"),f=Math.min(3,Math.max(1,window.devicePixelRatio||1));l.width=Math.round(jd*f),l.height=Math.round(qd*f);const g=Jx({deadZone:n.deadZone,container:u,embedded:!0});let _=!1;function m(M){_=M,s.classList.toggle("is-off",!M),!a&&r&&(r.textContent=M?"手感 ⌄":"手感 ▸",r.setAttribute("aria-expanded",String(M)),r.setAttribute("aria-label",M?"收起手感调试面板":"展开手感调试面板"))}m(!1),a||(r==null||r.addEventListener("pointerdown",M=>{M.preventDefault(),M.stopPropagation(),m(!_)}),window.addEventListener("keydown",M=>{M.key.toLowerCase()==="v"&&!M.metaKey&&!M.ctrlKey&&m(!_)}));const p=[];let y=0,x=null,v=0,w=!1,S=-1,E={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1,phase:0,stance:"both"};function A(M){const P=M-t;let C=0;for(;C<p.length&&p[C].t<P;)C++;return p.slice(C)}function b(M,P){if(!d)return;const C=jd,F=qd;d.setTransform(f,0,0,f,0,0),d.clearRect(0,0,C,F),d.fillStyle="rgba(8, 12, 17, 0.55)",d.fillRect(0,0,C,F);const N=4,L=4,I=C-N-L,z=9,G=44,$=58,et=20,ft=84,vt=38,It=P-t,Y=ht=>N+Math.max(0,Math.min(1,(ht-It)/t))*I;for(let ht=0;ht<M.length;ht++){if(!M[ht].busy)continue;const Pt=Y(M[ht].t),B=ht+1<M.length?Y(M[ht+1].t):Pt+2;d.fillStyle="rgba(251, 146, 60, 0.13)",d.fillRect(Pt,z,Math.max(2,B-Pt),G)}d.strokeStyle="rgba(150, 190, 220, 0.14)",d.lineWidth=1,d.beginPath();for(const ht of[z,z+G/2,z+G])d.moveTo(N,ht),d.lineTo(C-L,ht);d.moveTo(N,$+et/2),d.lineTo(C-L,$+et/2);for(const ht of[ft,ft+vt/2,ft+vt])d.moveTo(N,ht),d.lineTo(C-L,ht);d.stroke();const pt=Math.max(1,...M.map(ht=>ht.speed),...M.map(ht=>ht.drive))*1.15,at=ht=>z+G-ht/pt*G;if(M.length>1){d.beginPath(),d.moveTo(Y(M[0].t),at(M[0].speed));for(let ht=1;ht<M.length;ht++)d.lineTo(Y(M[ht].t),at(M[ht].speed));d.strokeStyle="#38bdf8",d.lineWidth=1.8,d.lineJoin="round",d.stroke(),d.lineTo(Y(M[M.length-1].t),z+G),d.lineTo(Y(M[0].t),z+G),d.closePath(),d.fillStyle="rgba(56, 189, 248, 0.14)",d.fill(),d.beginPath(),d.moveTo(Y(M[0].t),at(M[0].drive));for(let ht=1;ht<M.length;ht++)d.lineTo(Y(M[ht].t),at(M[ht].drive));d.setLineDash([3,3]),d.strokeStyle="rgba(190, 205, 220, 0.6)",d.lineWidth=1.2,d.stroke(),d.setLineDash([])}let K=.02;for(const ht of M)K=Math.max(K,Math.abs(ht.dv));K*=1.1;const Z=$+et/2,_t=et/2;for(const ht of M){const Pt=Math.min(_t,Math.abs(ht.dv)/K*_t);d.fillStyle=ht.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",d.fillRect(Y(ht.t)-.7,ht.dv>=0?Z-Pt:Z,1.4,Math.max(.5,Pt))}const Ft=ht=>ft+vt/2-ht*(vt/2-1);for(let ht=0;ht<M.length;ht++){const Pt=M[ht].stance;if(Pt==="air")continue;const B=Y(M[ht].t),ne=ht+1<M.length?Y(M[ht+1].t):B+2;d.fillStyle=av[Pt],d.fillRect(B,ft,Math.max(1,ne-B),vt)}if(M.length>1){let ht=Y(M[0].t),Pt=Ft(Math.sin(M[0].phase));for(let ne=1;ne<M.length;ne++){const Ot=M[ne-1],Ct=M[ne],xt=Y(Ot.t),Nt=Y(Ct.t),Bt=tu(Ot.phase,Ct.phase),k=Math.max(1,Math.min(16,Math.round((Nt-xt)/2)));for(let T=1;T<=k;T++){const j=T/k,ut=Ot.phase+(Bt-Ot.phase)*j,J=xt+(Nt-xt)*j,ct=Ft(Math.sin(ut)),zt=T===k?Ct.stance:Jd(ut,Ot.moving?1:0,Ot.grounded);d.beginPath(),d.moveTo(ht,Pt),d.lineTo(J,ct),d.strokeStyle=eu[zt],d.lineWidth=1.7,d.lineJoin="round",d.stroke(),ht=J,Pt=ct}}const B=M[M.length-1];d.beginPath(),d.arc(Y(B.t)-1.5,Ft(Math.sin(B.phase)),2.1,0,Math.PI*2),d.fillStyle=eu[B.stance],d.fill()}d.font="9px ui-monospace, monospace",d.fillStyle="rgba(190, 214, 234, 0.55)",d.textAlign="left",d.fillText(pt.toFixed(1),N+2,z+8),d.fillText("v",N+2,z+G-2),d.fillText("Δv",N+2,$+9),d.fillStyle="rgba(251, 191, 36, 0.75)",d.fillText("L",N+2,ft+8),d.fillStyle="rgba(167, 139, 250, 0.75)",d.fillText("R",N+2,ft+vt-2),d.textAlign="right",d.fillStyle="rgba(190, 214, 234, 0.55)",d.fillText("0",C-L-2,z+G-2),d.textAlign="left"}return{dirDebug:g,update(M,P,C){var Y;const F=performance.now()/1e3,N=S<0?1/60:Math.max(1e-4,Math.min(.25,F-S));S=F;const L=M.character,I={x:L.position.x,z:L.position.z},z=Math.hypot(L.velocity.x,L.velocity.z),{speed:G,raw:$}=x?rv(x,I,N,i):{speed:0,raw:0},et=ov(y,G,N,F);et.drive=z,et.raw=$,et.busy=cv(M);const ft=((Y=n.phaseSource)==null?void 0:Y.call(n))??L.gaitPhase;et.phase=ft,et.grounded=L.grounded,et.moving=w&&Math.abs(tu(v,ft)-v)>iv,v=ft,w=!0,et.stance=Jd(ft,et.moving?1:0,L.grounded),x=I,y=G,p.push(et),p.length>e&&p.shift();const vt=A(F);let It=0;for(const Q of vt)It=Math.max(It,Q.speed);if(E={speed:G,drive:z,raw:$,dv:et.dv,accel:et.accel,peak:It,samples:vt.length,windowS:t,busy:et.busy,phase:Qd(ft),stance:et.stance},g.update(M,P,C),_){b(vt,F);const Q=et.dv>=0?"+":"";c.textContent=`v ${G.toFixed(2)} · 驱 ${z.toFixed(2)} · 峰 ${It.toFixed(2)} · Δv ${Q}${et.dv.toFixed(3)} · ${vt.length} 帧
φ ${Qd(ft).toFixed(2)} · ${sv[et.stance]}`}},setEnabled:m,toggle(){return m(!_),_},enabled:()=>_,last:()=>({...E}),samples:()=>A(performance.now()/1e3).map(M=>({...M}))}}const hv=["剑盾","双剑","大剑","法杖","弓"],dv={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击",spar:"陪练"};function uv(n){return{update(t,e,i,a,s,o,r=!1){const l=t.character,c=l.position,h=l.velocity,u=t.combat,d=t.events.length>0?t.events[t.events.length-1]:null,f=ht=>ht.toFixed(2),g=ht=>(ht*180/Math.PI).toFixed(0),_=hv[na.indexOf(u.weapon)]??u.weapon,m=Math.round(u.charge*10),p="|".repeat(m)+".".repeat(10-m),y=t.dash,x=y.phase==="active"&&y.duration>0?(1-y.timer/y.duration)*100:0,v=y.phase==="active"?`${y.kind}@${x.toFixed(0)}%`:`${y.kind} cd${f(y.cooldown)}`,w=a.intents.aimActive?`(${f(a.intents.aimX)},${f(a.intents.aimZ)})`:"-",S=h.x*Math.sin(l.bodyYaw)+h.z*Math.cos(l.bodyYaw),E=h.x*Math.cos(l.bodyYaw)-h.z*Math.sin(l.bodyYaw),A=Math.abs(S)+Math.abs(E)+1e-6,b=Math.round(Math.abs(E)/A*100),M=`strafe ${b}%${S<-.05?" back":""}`,P=t.camera,C=`threat ${(P.threat*100).toFixed(0)}%  dist×${f(P.distanceScale)}  off (${f(P.offsetX)},${f(P.offsetZ)})  pitch +${f(P.pitchDelta)}°  n=${P.threatCount}`,F=o?f(o.attackBlend):"-",N=o==null?void 0:o.attackWeights,L=N?`gw ${f(N.gaitScale)}  lw ${f(N.attackLegWeight)}  spd ${f(N.driveSpeed)}`:"-",I=N?`${f(N.gaitScale)}/${f(N.attackLegWeight)}`:"-",z=o?`${o.landing.kind} ${f(o.landing.pulse)} t${f(o.landing.remaining)} vy${f(o.landing.impactVy)}`:"-",G=o?`${o.landing.kind}/${f(o.landing.pulse)}`:"-",$=(o==null?void 0:o.zoom)!==void 0?`zoom ×${f(o.zoom)}`:"-",et=o==null?void 0:o.hurt,ft=et?`hurt ${t.playerHurt.type}  部位h${f(et.hitHeight)}  脉冲p${f(et.pulse)}  上身${f(et.upperShift)}  重心${f(et.comShift)}  后坐${f(et.pelvisBack)}  屈膝${f(et.knee)}`:"-",vt=et?`${f(et.hitHeight)}/${f(et.pulse)}/${f(et.knee)}`:"-",It=o==null?void 0:o.ik,Y=It?`${It.active?"on":"off"} w${f(It.weight)} e${f(It.maxError)}`:"-",Q=t.playerLink,pt=`link ${Q.kind||"-"}  ${Q.phase}  prog ${f(Q.progress)}  win ${f(Q.linkWindow)}s  cd ${f(Q.cooldown)}s  hits ${Q.hitIds.length}  travel ${f(Q.travelled)}/${f(Q.travel)}m  id ${Q.id}`,at=`${Q.phase}/${Q.kind||"-"}/w${f(Q.linkWindow)}`,K=a.lastGesture,Z=K?`${K.button} ${K.kind} ${K.heldMs.toFixed(0)}ms d${K.distance.toFixed(0)}px ${K.angleDeg.toFixed(0)}° taps${K.taps}`:"-",_t=t.dummies.map(ht=>`${ht.id}:${dv[ht.mode]}`).join("  ");if(r){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${_} ${u.phase} · lk ${Q.phase}${Q.kind?`/${Q.kind}`:""} w${f(Q.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${f(c.x)},${f(c.y)},${f(c.z)})  vel (${f(h.x)},${f(h.y)},${f(h.z)})`,`face ${g(l.facing)}  body ${g(l.bodyYaw)}  head ${g(l.headYaw)}  move ${g(l.moveYaw)}  st${b}%  stick(${f(a.stickX)},${f(a.stickY)}) ${a.source}  str${f(l.stride)}`,`weapon ${_}  ${u.phase}  combo ${u.comboIndex}/3  atk ${f(u.attackProgress)}  dash ${v}  ab ${F}  gw/lw ${I}  land ${G}  ik ${Y}`,`aim ${w}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${f(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${vt}`,`dummies ${_t}  atkCount ${t.dummyAttackCount}  cam ${(P.threat*100).toFixed(0)}% ×${f(P.distanceScale)}  ${$}  lk ${at}`,`event ${d?`${d.type} ${f(d.value)}`:"-"}  scale ${f(s.timeScale)}${s.paused?" [P]":""}  g ${Z}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${f(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${f(c.x)}, ${f(c.y)}, ${f(c.z)})`,`vel  (${f(h.x)}, ${f(h.y)}, ${f(h.z)})`,`grounded ${l.grounded?"Y":"N"}   sprint ${l.sprinting?"Y":"N"}   facing ${g(l.facing)}deg   atkBlend ${F}   ${L}   land ${z}`,ft,`ik ${Y}  clamped ${It?It.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${g(l.facing)}  body ${g(l.bodyYaw)}  head ${g(l.headYaw)}  move ${g(l.moveYaw)}  (head-body ${g(l.headYaw-l.bodyYaw)})  ${M}`,`move (${f(a.intents.moveX)}, ${f(a.intents.moveZ)})  stick (${f(a.stickX)}, ${f(a.stickY)})  ${a.source}  aim ${w}`,`weapon ${_}  phase ${u.phase}  combo ${u.comboIndex}/3  atk ${f(u.attackProgress)}${u.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${y.kind}  phase ${y.phase}  prog ${x.toFixed(0)}%  cd ${f(y.cooldown)}s  id ${y.id}  from (${f(y.fromX)},${f(y.fromZ)}) → to (${f(y.toX)},${f(y.toZ)})`,pt,`camera ${C}  ${$}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${f(t.targeting.targetDist)}m  face ${g(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${p}] ${(u.charge*100).toFixed(0)}%  charging ${u.charging?"Y":"N"}`,`dummies ${_t}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${f(t.impulse.x)}, ${f(t.impulse.z)})`,`event ${d?`${d.type} ${f(d.value)}`:"-"}   scale ${f(s.timeScale)}${s.paused?" [PAUSED]":""}   gesture ${Z}`].join(`
`)}}}const Co=["lab","hud","motion","debug"],nu={lab:{short:"工位",full:"测试工位"},hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}},iu={lab:{toggle:"lab-toggle",panel:"lab-panel"},hud:{toggle:"hud-toggle",panel:"hud"},motion:{toggle:"motiondbg-toggle",panel:"motiondbg"},debug:{toggle:"debug-toggle",panel:"debug-panel"}};function fv(n){var l;const t=Object.fromEntries(Co.map(c=>[c,document.getElementById(iu[c].toggle)])),e=Object.fromEntries(Co.map(c=>[c,document.getElementById(iu[c].panel)]));let i={},a=null;function s(){var c,h,u;for(const d of Co){const f=a===d,g=t[d],_=e[d];g&&(g.setAttribute("aria-expanded",String(f)),g.textContent=`${nu[d].short} ${f?"▾":"▸"}`,g.setAttribute("aria-label",`${f?"收起":"展开"}${nu[d].full}`)),_&&_.classList.toggle("is-open",f)}n.classList.toggle("is-compact",a!=="hud"),(c=i.motion)==null||c.setEnabled(a==="motion"),a==="debug"?(h=i.debug)==null||h.open():(u=i.debug)==null||u.close()}function o(c){a=a===c?null:c,s()}function r(){a!==null&&(a=null,s())}for(const c of Co)(l=t[c])==null||l.addEventListener("pointerdown",h=>{h.preventDefault(),h.stopPropagation(),o(c)});return window.addEventListener("keydown",c=>{c.key.toLowerCase()==="v"&&!c.metaKey&&!c.ctrlKey&&o("motion")}),s(),{hudCompact:()=>a!=="hud",register(c){i=c,s()},toggle:o,closeAll:r,isOpen:c=>a===c}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const bh="170",pv=0,au=1,mv=2,hp=1,dp=2,Di=3,ia=0,Dn=1,qe=2,ta=0,ds=1,ki=2,su=3,ou=4,gv=5,Sa=100,xv=101,vv=102,yv=103,_v=104,Mv=200,bv=201,Sv=202,wv=203,yl=204,_l=205,Ev=206,Tv=207,Av=208,Rv=209,Pv=210,Cv=211,Lv=212,Dv=213,kv=214,Ml=0,bl=1,Sl=2,vs=3,wl=4,El=5,Tl=6,Al=7,Sh=0,Iv=1,Fv=2,ea=0,zv=1,Nv=2,Uv=3,Ov=4,Bv=5,Hv=6,Gv=7,up=300,ys=301,_s=302,Rl=303,Pl=304,Hr=306,Cl=1e3,Ea=1001,Ll=1002,ci=1003,Vv=1004,Lo=1005,vi=1006,Mc=1007,Ta=1008,Ui=1009,fp=1010,pp=1011,ao=1012,wh=1013,Ra=1014,Fi=1015,fo=1016,Eh=1017,Th=1018,Ms=1020,mp=35902,gp=1021,xp=1022,ri=1023,vp=1024,yp=1025,us=1026,bs=1027,_p=1028,Ah=1029,Mp=1030,Rh=1031,Ph=1033,dr=33776,ur=33777,fr=33778,pr=33779,Dl=35840,kl=35841,Il=35842,Fl=35843,zl=36196,Nl=37492,Ul=37496,Ol=37808,Bl=37809,Hl=37810,Gl=37811,Vl=37812,Xl=37813,Wl=37814,Yl=37815,$l=37816,Zl=37817,jl=37818,ql=37819,Kl=37820,Jl=37821,mr=36492,Ql=36494,th=36495,bp=36283,eh=36284,nh=36285,ih=36286,Xv=3200,Wv=3201,Sp=0,Yv=1,qi="",Rn="srgb",ws="srgb-linear",Gr="linear",Le="srgb",Ga=7680,ru=519,$v=512,Zv=513,jv=514,wp=515,qv=516,Kv=517,Jv=518,Qv=519,ah=35044,cu=35048,lu="300 es",zi=2e3,Pr=2001;class Es{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const a=this._listeners[t];if(a!==void 0){const s=a.indexOf(e);s!==-1&&a.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const a=i.slice(0);for(let s=0,o=a.length;s<o;s++)a[s].call(this,t);t.target=null}}}const vn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let hu=1234567;const fs=Math.PI/180,so=180/Math.PI;function _i(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(vn[n&255]+vn[n>>8&255]+vn[n>>16&255]+vn[n>>24&255]+"-"+vn[t&255]+vn[t>>8&255]+"-"+vn[t>>16&15|64]+vn[t>>24&255]+"-"+vn[e&63|128]+vn[e>>8&255]+"-"+vn[e>>16&255]+vn[e>>24&255]+vn[i&255]+vn[i>>8&255]+vn[i>>16&255]+vn[i>>24&255]).toLowerCase()}function pn(n,t,e){return Math.max(t,Math.min(e,n))}function Ch(n,t){return(n%t+t)%t}function ty(n,t,e,i,a){return i+(n-t)*(a-i)/(e-t)}function ey(n,t,e){return n!==t?(e-n)/(t-n):0}function js(n,t,e){return(1-e)*n+e*t}function ny(n,t,e,i){return js(n,t,1-Math.exp(-e*i))}function iy(n,t=1){return t-Math.abs(Ch(n,t*2)-t)}function ay(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function sy(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function oy(n,t){return n+Math.floor(Math.random()*(t-n+1))}function ry(n,t){return n+Math.random()*(t-n)}function cy(n){return n*(.5-Math.random())}function ly(n){n!==void 0&&(hu=n);let t=hu+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function hy(n){return n*fs}function dy(n){return n*so}function uy(n){return(n&n-1)===0&&n!==0}function fy(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function py(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function my(n,t,e,i,a){const s=Math.cos,o=Math.sin,r=s(e/2),l=o(e/2),c=s((t+i)/2),h=o((t+i)/2),u=s((t-i)/2),d=o((t-i)/2),f=s((i-t)/2),g=o((i-t)/2);switch(a){case"XYX":n.set(r*h,l*u,l*d,r*c);break;case"YZY":n.set(l*d,r*h,l*u,r*c);break;case"ZXZ":n.set(l*u,l*d,r*h,r*c);break;case"XZX":n.set(r*h,l*g,l*f,r*c);break;case"YXY":n.set(l*f,r*h,l*g,r*c);break;case"ZYZ":n.set(l*g,l*f,r*h,r*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+a)}}function oi(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Re(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const du={DEG2RAD:fs,RAD2DEG:so,generateUUID:_i,clamp:pn,euclideanModulo:Ch,mapLinear:ty,inverseLerp:ey,lerp:js,damp:ny,pingpong:iy,smoothstep:ay,smootherstep:sy,randInt:oy,randFloat:ry,randFloatSpread:cy,seededRandom:ly,degToRad:hy,radToDeg:dy,isPowerOfTwo:uy,ceilPowerOfTwo:fy,floorPowerOfTwo:py,setQuaternionFromProperEuler:my,normalize:Re,denormalize:oi};class Yt{constructor(t=0,e=0){Yt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6],this.y=a[1]*e+a[4]*i+a[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(pn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),a=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*i-o*a+t.x,this.y=s*a+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class me{constructor(t,e,i,a,s,o,r,l,c){me.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,l,c)}set(t,e,i,a,s,o,r,l,c){const h=this.elements;return h[0]=t,h[1]=a,h[2]=r,h[3]=e,h[4]=s,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[3],l=i[6],c=i[1],h=i[4],u=i[7],d=i[2],f=i[5],g=i[8],_=a[0],m=a[3],p=a[6],y=a[1],x=a[4],v=a[7],w=a[2],S=a[5],E=a[8];return s[0]=o*_+r*y+l*w,s[3]=o*m+r*x+l*S,s[6]=o*p+r*v+l*E,s[1]=c*_+h*y+u*w,s[4]=c*m+h*x+u*S,s[7]=c*p+h*v+u*E,s[2]=d*_+f*y+g*w,s[5]=d*m+f*x+g*S,s[8]=d*p+f*v+g*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*r*c-i*s*h+i*r*l+a*s*c-a*o*l}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],u=h*o-r*c,d=r*l-h*s,f=c*s-o*l,g=e*u+i*d+a*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=u*_,t[1]=(a*c-h*i)*_,t[2]=(r*i-a*o)*_,t[3]=d*_,t[4]=(h*e-a*l)*_,t[5]=(a*s-r*e)*_,t[6]=f*_,t[7]=(i*l-c*e)*_,t[8]=(o*e-i*s)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,a,s,o,r){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*r)+o+t,-a*c,a*l,-a*(-c*o+l*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(bc.makeScale(t,e)),this}rotate(t){return this.premultiply(bc.makeRotation(-t)),this}translate(t,e){return this.premultiply(bc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<9;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const bc=new me;function Ep(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Cr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function gy(){const n=Cr("canvas");return n.style.display="block",n}const uu={};function Vs(n){n in uu||(uu[n]=!0,console.warn(n))}function xy(n,t,e){return new Promise(function(i,a){function s(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:a();break;case n.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}function vy(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function yy(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const be={enabled:!0,workingColorSpace:ws,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===Le&&(n.r=Ni(n.r),n.g=Ni(n.g),n.b=Ni(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===Le&&(n.r=ps(n.r),n.g=ps(n.g),n.b=ps(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===qi?Gr:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function Ni(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function ps(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const fu=[.64,.33,.3,.6,.15,.06],pu=[.2126,.7152,.0722],mu=[.3127,.329],gu=new me().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),xu=new me().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);be.define({[ws]:{primaries:fu,whitePoint:mu,transfer:Gr,toXYZ:gu,fromXYZ:xu,luminanceCoefficients:pu,workingColorSpaceConfig:{unpackColorSpace:Rn},outputColorSpaceConfig:{drawingBufferColorSpace:Rn}},[Rn]:{primaries:fu,whitePoint:mu,transfer:Le,toXYZ:gu,fromXYZ:xu,luminanceCoefficients:pu,outputColorSpaceConfig:{drawingBufferColorSpace:Rn}}});let Va;class _y{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Va===void 0&&(Va=Cr("canvas")),Va.width=t.width,Va.height=t.height;const i=Va.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=Va}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Cr("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const a=i.getImageData(0,0,t.width,t.height),s=a.data;for(let o=0;o<s.length;o++)s[o]=Ni(s[o]/255)*255;return i.putImageData(a,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Ni(e[i]/255)*255):e[i]=Ni(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let My=0;class Tp{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:My++}),this.uuid=_i(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},a=this.data;if(a!==null){let s;if(Array.isArray(a)){s=[];for(let o=0,r=a.length;o<r;o++)a[o].isDataTexture?s.push(Sc(a[o].image)):s.push(Sc(a[o]))}else s=Sc(a);i.url=s}return e||(t.images[this.uuid]=i),i}}function Sc(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?_y.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let by=0;class Pn extends Es{constructor(t=Pn.DEFAULT_IMAGE,e=Pn.DEFAULT_MAPPING,i=Ea,a=Ea,s=vi,o=Ta,r=ri,l=Ui,c=Pn.DEFAULT_ANISOTROPY,h=qi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:by++}),this.uuid=_i(),this.name="",this.source=new Tp(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=r,this.internalFormat=null,this.type=l,this.offset=new Yt(0,0),this.repeat=new Yt(1,1),this.center=new Yt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new me,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==up)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Cl:t.x=t.x-Math.floor(t.x);break;case Ea:t.x=t.x<0?0:1;break;case Ll:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Cl:t.y=t.y-Math.floor(t.y);break;case Ea:t.y=t.y<0?0:1;break;case Ll:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Pn.DEFAULT_IMAGE=null;Pn.DEFAULT_MAPPING=up;Pn.DEFAULT_ANISOTROPY=1;class Ke{constructor(t=0,e=0,i=0,a=1){Ke.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=a}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,a){return this.x=t,this.y=e,this.z=i,this.w=a,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*a+o[12]*s,this.y=o[1]*e+o[5]*i+o[9]*a+o[13]*s,this.z=o[2]*e+o[6]*i+o[10]*a+o[14]*s,this.w=o[3]*e+o[7]*i+o[11]*a+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,a,s;const l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],g=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(c+1)/2,v=(f+1)/2,w=(p+1)/2,S=(h+d)/4,E=(u+_)/4,A=(g+m)/4;return x>v&&x>w?x<.01?(i=0,a=.707106781,s=.707106781):(i=Math.sqrt(x),a=S/i,s=E/i):v>w?v<.01?(i=.707106781,a=0,s=.707106781):(a=Math.sqrt(v),i=S/a,s=A/a):w<.01?(i=.707106781,a=.707106781,s=0):(s=Math.sqrt(w),i=E/s,a=A/s),this.set(i,a,s,e),this}let y=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(y)<.001&&(y=1),this.x=(m-g)/y,this.y=(u-_)/y,this.z=(d-h)/y,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Sy extends Es{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Ke(0,0,t,e),this.scissorTest=!1,this.viewport=new Ke(0,0,t,e);const a={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:vi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new Pn(a,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let r=0;r<o;r++)this.textures[r]=s.clone(),this.textures[r].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let a=0,s=this.textures.length;a<s;a++)this.textures[a].image.width=t,this.textures[a].image.height=e,this.textures[a].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,a=t.textures.length;i<a;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Tp(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Pa extends Sy{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class Ap extends Pn{constructor(t=null,e=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=ci,this.minFilter=ci,this.wrapR=Ea,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class wy extends Pn{constructor(t=null,e=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=ci,this.minFilter=ci,this.wrapR=Ea,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class po{constructor(t=0,e=0,i=0,a=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=a}static slerpFlat(t,e,i,a,s,o,r){let l=i[a+0],c=i[a+1],h=i[a+2],u=i[a+3];const d=s[o+0],f=s[o+1],g=s[o+2],_=s[o+3];if(r===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(r===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=_;return}if(u!==_||l!==d||c!==f||h!==g){let m=1-r;const p=l*d+c*f+h*g+u*_,y=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const w=Math.sqrt(x),S=Math.atan2(w,p*y);m=Math.sin(m*S)/w,r=Math.sin(r*S)/w}const v=r*y;if(l=l*m+d*v,c=c*m+f*v,h=h*m+g*v,u=u*m+_*v,m===1-r){const w=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=w,c*=w,h*=w,u*=w}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,a,s,o){const r=i[a],l=i[a+1],c=i[a+2],h=i[a+3],u=s[o],d=s[o+1],f=s[o+2],g=s[o+3];return t[e]=r*g+h*u+l*f-c*d,t[e+1]=l*g+h*d+c*u-r*f,t[e+2]=c*g+h*f+r*d-l*u,t[e+3]=h*g-r*u-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,a){return this._x=t,this._y=e,this._z=i,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,a=t._y,s=t._z,o=t._order,r=Math.cos,l=Math.sin,c=r(i/2),h=r(a/2),u=r(s/2),d=l(i/2),f=l(a/2),g=l(s/2);switch(o){case"XYZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"YZX":this._x=d*h*u+c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u-d*f*g;break;case"XZY":this._x=d*h*u-c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,a=Math.sin(i);return this._x=t.x*a,this._y=t.y*a,this._z=t.z*a,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],a=e[4],s=e[8],o=e[1],r=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=i+r+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(s-c)*f,this._z=(o-a)*f}else if(i>r&&i>u){const f=2*Math.sqrt(1+i-r-u);this._w=(h-l)/f,this._x=.25*f,this._y=(a+o)/f,this._z=(s+c)/f}else if(r>u){const f=2*Math.sqrt(1+r-i-u);this._w=(s-c)/f,this._x=(a+o)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-i-r);this._w=(o-a)/f,this._x=(s+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(pn(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const a=Math.min(1,e/i);return this.slerp(t,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,a=t._y,s=t._z,o=t._w,r=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+o*r+a*c-s*l,this._y=a*h+o*l+s*r-i*c,this._z=s*h+o*c+i*l-a*r,this._w=o*h-i*r-a*l-s*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,a=this._y,s=this._z,o=this._w;let r=o*t._w+i*t._x+a*t._y+s*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=o,this._x=i,this._y=a,this._z=s,this;const l=1-r*r;if(l<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*i+e*this._x,this._y=f*a+e*this._y,this._z=f*s+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,r),u=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*u+this._w*d,this._x=i*u+this._x*d,this._y=a*u+this._y*d,this._z=s*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),a=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(a*Math.sin(t),a*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class H{constructor(t=0,e=0,i=0){H.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(vu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(vu.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*a,this.y=s[1]*e+s[4]*i+s[7]*a,this.z=s[2]*e+s[5]*i+s[8]*a,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=t.elements,o=1/(s[3]*e+s[7]*i+s[11]*a+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*a+s[12])*o,this.y=(s[1]*e+s[5]*i+s[9]*a+s[13])*o,this.z=(s[2]*e+s[6]*i+s[10]*a+s[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,a=this.z,s=t.x,o=t.y,r=t.z,l=t.w,c=2*(o*a-r*i),h=2*(r*e-s*a),u=2*(s*i-o*e);return this.x=e+l*c+o*u-r*h,this.y=i+l*h+r*c-s*u,this.z=a+l*u+s*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*a,this.y=s[1]*e+s[5]*i+s[9]*a,this.z=s[2]*e+s[6]*i+s[10]*a,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,a=t.y,s=t.z,o=e.x,r=e.y,l=e.z;return this.x=a*l-s*r,this.y=s*o-i*l,this.z=i*r-a*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return wc.copy(this).projectOnVector(t),this.sub(wc)}reflect(t){return this.sub(wc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(pn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,a=this.z-t.z;return e*e+i*i+a*a}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const a=Math.sin(e)*t;return this.x=a*Math.sin(i),this.y=Math.cos(e)*t,this.z=a*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),a=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=a,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const wc=new H,vu=new po;class mo{constructor(t=new H(1/0,1/0,1/0),e=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(ii.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(ii.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=ii.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,r=s.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,ii):ii.fromBufferAttribute(s,o),ii.applyMatrix4(t.matrixWorld),this.expandByPoint(ii);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Do.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Do.copy(i.boundingBox)),Do.applyMatrix4(t.matrixWorld),this.union(Do)}const a=t.children;for(let s=0,o=a.length;s<o;s++)this.expandByObject(a[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,ii),ii.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Fs),ko.subVectors(this.max,Fs),Xa.subVectors(t.a,Fs),Wa.subVectors(t.b,Fs),Ya.subVectors(t.c,Fs),Xi.subVectors(Wa,Xa),Wi.subVectors(Ya,Wa),da.subVectors(Xa,Ya);let e=[0,-Xi.z,Xi.y,0,-Wi.z,Wi.y,0,-da.z,da.y,Xi.z,0,-Xi.x,Wi.z,0,-Wi.x,da.z,0,-da.x,-Xi.y,Xi.x,0,-Wi.y,Wi.x,0,-da.y,da.x,0];return!Ec(e,Xa,Wa,Ya,ko)||(e=[1,0,0,0,1,0,0,0,1],!Ec(e,Xa,Wa,Ya,ko))?!1:(Io.crossVectors(Xi,Wi),e=[Io.x,Io.y,Io.z],Ec(e,Xa,Wa,Ya,ko))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ii).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ii).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ti[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ti[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ti[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ti[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ti[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ti[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ti[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ti[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ti),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Ti=[new H,new H,new H,new H,new H,new H,new H,new H],ii=new H,Do=new mo,Xa=new H,Wa=new H,Ya=new H,Xi=new H,Wi=new H,da=new H,Fs=new H,ko=new H,Io=new H,ua=new H;function Ec(n,t,e,i,a){for(let s=0,o=n.length-3;s<=o;s+=3){ua.fromArray(n,s);const r=a.x*Math.abs(ua.x)+a.y*Math.abs(ua.y)+a.z*Math.abs(ua.z),l=t.dot(ua),c=e.dot(ua),h=i.dot(ua);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>r)return!1}return!0}const Ey=new mo,zs=new H,Tc=new H;class Vr{constructor(t=new H,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):Ey.setFromPoints(t).getCenter(i);let a=0;for(let s=0,o=t.length;s<o;s++)a=Math.max(a,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(a),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;zs.subVectors(t,this.center);const e=zs.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),a=(i-this.radius)*.5;this.center.addScaledVector(zs,a/i),this.radius+=a}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Tc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(zs.copy(t.center).add(Tc)),this.expandByPoint(zs.copy(t.center).sub(Tc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Ai=new H,Ac=new H,Fo=new H,Yi=new H,Rc=new H,zo=new H,Pc=new H;class Lh{constructor(t=new H,e=new H(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Ai)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Ai.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Ai.copy(this.origin).addScaledVector(this.direction,e),Ai.distanceToSquared(t))}distanceSqToSegment(t,e,i,a){Ac.copy(t).add(e).multiplyScalar(.5),Fo.copy(e).sub(t).normalize(),Yi.copy(this.origin).sub(Ac);const s=t.distanceTo(e)*.5,o=-this.direction.dot(Fo),r=Yi.dot(this.direction),l=-Yi.dot(Fo),c=Yi.lengthSq(),h=Math.abs(1-o*o);let u,d,f,g;if(h>0)if(u=o*l-r,d=o*r-l,g=s*h,u>=0)if(d>=-g)if(d<=g){const _=1/h;u*=_,d*=_,f=u*(u+o*d+2*r)+d*(o*u+d+2*l)+c}else d=s,u=Math.max(0,-(o*d+r)),f=-u*u+d*(d+2*l)+c;else d=-s,u=Math.max(0,-(o*d+r)),f=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-o*s+r)),d=u>0?-s:Math.min(Math.max(-s,-l),s),f=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-s,-l),s),f=d*(d+2*l)+c):(u=Math.max(0,-(o*s+r)),d=u>0?s:Math.min(Math.max(-s,-l),s),f=-u*u+d*(d+2*l)+c);else d=o>0?-s:s,u=Math.max(0,-(o*d+r)),f=-u*u+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),a&&a.copy(Ac).addScaledVector(Fo,d),f}intersectSphere(t,e){Ai.subVectors(t.center,this.origin);const i=Ai.dot(this.direction),a=Ai.dot(Ai)-i*i,s=t.radius*t.radius;if(a>s)return null;const o=Math.sqrt(s-a),r=i-o,l=i+o;return l<0?null:r<0?this.at(l,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,a,s,o,r,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(i=(t.min.x-d.x)*c,a=(t.max.x-d.x)*c):(i=(t.max.x-d.x)*c,a=(t.min.x-d.x)*c),h>=0?(s=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(s=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),i>o||s>a||((s>i||isNaN(i))&&(i=s),(o<a||isNaN(a))&&(a=o),u>=0?(r=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(r=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),i>l||r>a)||((r>i||i!==i)&&(i=r),(l<a||a!==a)&&(a=l),a<0)?null:this.at(i>=0?i:a,e)}intersectsBox(t){return this.intersectBox(t,Ai)!==null}intersectTriangle(t,e,i,a,s){Rc.subVectors(e,t),zo.subVectors(i,t),Pc.crossVectors(Rc,zo);let o=this.direction.dot(Pc),r;if(o>0){if(a)return null;r=1}else if(o<0)r=-1,o=-o;else return null;Yi.subVectors(this.origin,t);const l=r*this.direction.dot(zo.crossVectors(Yi,zo));if(l<0)return null;const c=r*this.direction.dot(Rc.cross(Yi));if(c<0||l+c>o)return null;const h=-r*Yi.dot(Pc);return h<0?null:this.at(h/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ue{constructor(t,e,i,a,s,o,r,l,c,h,u,d,f,g,_,m){Ue.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,l,c,h,u,d,f,g,_,m)}set(t,e,i,a,s,o,r,l,c,h,u,d,f,g,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=a,p[1]=s,p[5]=o,p[9]=r,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ue().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,a=1/$a.setFromMatrixColumn(t,0).length(),s=1/$a.setFromMatrixColumn(t,1).length(),o=1/$a.setFromMatrixColumn(t,2).length();return e[0]=i[0]*a,e[1]=i[1]*a,e[2]=i[2]*a,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,a=t.y,s=t.z,o=Math.cos(i),r=Math.sin(i),l=Math.cos(a),c=Math.sin(a),h=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){const d=o*h,f=o*u,g=r*h,_=r*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=f+g*c,e[5]=d-_*c,e[9]=-r*l,e[2]=_-d*c,e[6]=g+f*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*h,f=l*u,g=c*h,_=c*u;e[0]=d+_*r,e[4]=g*r-f,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-r,e[2]=f*r-g,e[6]=_+d*r,e[10]=o*l}else if(t.order==="ZXY"){const d=l*h,f=l*u,g=c*h,_=c*u;e[0]=d-_*r,e[4]=-o*u,e[8]=g+f*r,e[1]=f+g*r,e[5]=o*h,e[9]=_-d*r,e[2]=-o*c,e[6]=r,e[10]=o*l}else if(t.order==="ZYX"){const d=o*h,f=o*u,g=r*h,_=r*u;e[0]=l*h,e[4]=g*c-f,e[8]=d*c+_,e[1]=l*u,e[5]=_*c+d,e[9]=f*c-g,e[2]=-c,e[6]=r*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,f=o*c,g=r*l,_=r*c;e[0]=l*h,e[4]=_-d*u,e[8]=g*u+f,e[1]=u,e[5]=o*h,e[9]=-r*h,e[2]=-c*h,e[6]=f*u+g,e[10]=d-_*u}else if(t.order==="XZY"){const d=o*l,f=o*c,g=r*l,_=r*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+_,e[5]=o*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=r*h,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Ty,t,Ay)}lookAt(t,e,i){const a=this.elements;return Nn.subVectors(t,e),Nn.lengthSq()===0&&(Nn.z=1),Nn.normalize(),$i.crossVectors(i,Nn),$i.lengthSq()===0&&(Math.abs(i.z)===1?Nn.x+=1e-4:Nn.z+=1e-4,Nn.normalize(),$i.crossVectors(i,Nn)),$i.normalize(),No.crossVectors(Nn,$i),a[0]=$i.x,a[4]=No.x,a[8]=Nn.x,a[1]=$i.y,a[5]=No.y,a[9]=Nn.y,a[2]=$i.z,a[6]=No.z,a[10]=Nn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[4],l=i[8],c=i[12],h=i[1],u=i[5],d=i[9],f=i[13],g=i[2],_=i[6],m=i[10],p=i[14],y=i[3],x=i[7],v=i[11],w=i[15],S=a[0],E=a[4],A=a[8],b=a[12],M=a[1],P=a[5],C=a[9],F=a[13],N=a[2],L=a[6],I=a[10],z=a[14],G=a[3],$=a[7],et=a[11],ft=a[15];return s[0]=o*S+r*M+l*N+c*G,s[4]=o*E+r*P+l*L+c*$,s[8]=o*A+r*C+l*I+c*et,s[12]=o*b+r*F+l*z+c*ft,s[1]=h*S+u*M+d*N+f*G,s[5]=h*E+u*P+d*L+f*$,s[9]=h*A+u*C+d*I+f*et,s[13]=h*b+u*F+d*z+f*ft,s[2]=g*S+_*M+m*N+p*G,s[6]=g*E+_*P+m*L+p*$,s[10]=g*A+_*C+m*I+p*et,s[14]=g*b+_*F+m*z+p*ft,s[3]=y*S+x*M+v*N+w*G,s[7]=y*E+x*P+v*L+w*$,s[11]=y*A+x*C+v*I+w*et,s[15]=y*b+x*F+v*z+w*ft,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],a=t[8],s=t[12],o=t[1],r=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+s*l*u-a*c*u-s*r*d+i*c*d+a*r*f-i*l*f)+_*(+e*l*f-e*c*d+s*o*d-a*o*f+a*c*h-s*l*h)+m*(+e*c*u-e*r*f-s*o*u+i*o*f+s*r*h-i*c*h)+p*(-a*r*h-e*l*u+e*r*d+a*o*u-i*o*d+i*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const a=this.elements;return t.isVector3?(a[12]=t.x,a[13]=t.y,a[14]=t.z):(a[12]=t,a[13]=e,a[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],_=t[13],m=t[14],p=t[15],y=u*m*c-_*d*c+_*l*f-r*m*f-u*l*p+r*d*p,x=g*d*c-h*m*c-g*l*f+o*m*f+h*l*p-o*d*p,v=h*_*c-g*u*c+g*r*f-o*_*f-h*r*p+o*u*p,w=g*u*l-h*_*l-g*r*d+o*_*d+h*r*m-o*u*m,S=e*y+i*x+a*v+s*w;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/S;return t[0]=y*E,t[1]=(_*d*s-u*m*s-_*a*f+i*m*f+u*a*p-i*d*p)*E,t[2]=(r*m*s-_*l*s+_*a*c-i*m*c-r*a*p+i*l*p)*E,t[3]=(u*l*s-r*d*s-u*a*c+i*d*c+r*a*f-i*l*f)*E,t[4]=x*E,t[5]=(h*m*s-g*d*s+g*a*f-e*m*f-h*a*p+e*d*p)*E,t[6]=(g*l*s-o*m*s-g*a*c+e*m*c+o*a*p-e*l*p)*E,t[7]=(o*d*s-h*l*s+h*a*c-e*d*c-o*a*f+e*l*f)*E,t[8]=v*E,t[9]=(g*u*s-h*_*s-g*i*f+e*_*f+h*i*p-e*u*p)*E,t[10]=(o*_*s-g*r*s+g*i*c-e*_*c-o*i*p+e*r*p)*E,t[11]=(h*r*s-o*u*s-h*i*c+e*u*c+o*i*f-e*r*f)*E,t[12]=w*E,t[13]=(h*_*a-g*u*a+g*i*d-e*_*d-h*i*m+e*u*m)*E,t[14]=(g*r*a-o*_*a-g*i*l+e*_*l+o*i*m-e*r*m)*E,t[15]=(o*u*a-h*r*a+h*i*l-e*u*l-o*i*d+e*r*d)*E,this}scale(t){const e=this.elements,i=t.x,a=t.y,s=t.z;return e[0]*=i,e[4]*=a,e[8]*=s,e[1]*=i,e[5]*=a,e[9]*=s,e[2]*=i,e[6]*=a,e[10]*=s,e[3]*=i,e[7]*=a,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],a=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,a))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),a=Math.sin(e),s=1-i,o=t.x,r=t.y,l=t.z,c=s*o,h=s*r;return this.set(c*o+i,c*r-a*l,c*l+a*r,0,c*r+a*l,h*r+i,h*l-a*o,0,c*l-a*r,h*l+a*o,s*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,a,s,o){return this.set(1,i,s,0,t,1,o,0,e,a,1,0,0,0,0,1),this}compose(t,e,i){const a=this.elements,s=e._x,o=e._y,r=e._z,l=e._w,c=s+s,h=o+o,u=r+r,d=s*c,f=s*h,g=s*u,_=o*h,m=o*u,p=r*u,y=l*c,x=l*h,v=l*u,w=i.x,S=i.y,E=i.z;return a[0]=(1-(_+p))*w,a[1]=(f+v)*w,a[2]=(g-x)*w,a[3]=0,a[4]=(f-v)*S,a[5]=(1-(d+p))*S,a[6]=(m+y)*S,a[7]=0,a[8]=(g+x)*E,a[9]=(m-y)*E,a[10]=(1-(d+_))*E,a[11]=0,a[12]=t.x,a[13]=t.y,a[14]=t.z,a[15]=1,this}decompose(t,e,i){const a=this.elements;let s=$a.set(a[0],a[1],a[2]).length();const o=$a.set(a[4],a[5],a[6]).length(),r=$a.set(a[8],a[9],a[10]).length();this.determinant()<0&&(s=-s),t.x=a[12],t.y=a[13],t.z=a[14],ai.copy(this);const c=1/s,h=1/o,u=1/r;return ai.elements[0]*=c,ai.elements[1]*=c,ai.elements[2]*=c,ai.elements[4]*=h,ai.elements[5]*=h,ai.elements[6]*=h,ai.elements[8]*=u,ai.elements[9]*=u,ai.elements[10]*=u,e.setFromRotationMatrix(ai),i.x=s,i.y=o,i.z=r,this}makePerspective(t,e,i,a,s,o,r=zi){const l=this.elements,c=2*s/(e-t),h=2*s/(i-a),u=(e+t)/(e-t),d=(i+a)/(i-a);let f,g;if(r===zi)f=-(o+s)/(o-s),g=-2*o*s/(o-s);else if(r===Pr)f=-o/(o-s),g=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,a,s,o,r=zi){const l=this.elements,c=1/(e-t),h=1/(i-a),u=1/(o-s),d=(e+t)*c,f=(i+a)*h;let g,_;if(r===zi)g=(o+s)*u,_=-2*u;else if(r===Pr)g=s*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<16;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const $a=new H,ai=new Ue,Ty=new H(0,0,0),Ay=new H(1,1,1),$i=new H,No=new H,Nn=new H,yu=new Ue,_u=new po;class Mi{constructor(t=0,e=0,i=0,a=Mi.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=a}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,a=this._order){return this._x=t,this._y=e,this._z=i,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const a=t.elements,s=a[0],o=a[4],r=a[8],l=a[1],c=a[5],h=a[9],u=a[2],d=a[6],f=a[10];switch(e){case"XYZ":this._y=Math.asin(pn(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-pn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(pn(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-pn(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(pn(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(r,f));break;case"XZY":this._z=Math.asin(-pn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(r,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return yu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(yu,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return _u.setFromEuler(this),this.setFromQuaternion(_u,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Mi.DEFAULT_ORDER="XYZ";class Dh{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Ry=0;const Mu=new H,Za=new po,Ri=new Ue,Uo=new H,Ns=new H,Py=new H,Cy=new po,bu=new H(1,0,0),Su=new H(0,1,0),wu=new H(0,0,1),Eu={type:"added"},Ly={type:"removed"},ja={type:"childadded",child:null},Cc={type:"childremoved",child:null};class Ye extends Es{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ry++}),this.uuid=_i(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ye.DEFAULT_UP.clone();const t=new H,e=new Mi,i=new po,a=new H(1,1,1);function s(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new Ue},normalMatrix:{value:new me}}),this.matrix=new Ue,this.matrixWorld=new Ue,this.matrixAutoUpdate=Ye.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ye.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Dh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Za.setFromAxisAngle(t,e),this.quaternion.multiply(Za),this}rotateOnWorldAxis(t,e){return Za.setFromAxisAngle(t,e),this.quaternion.premultiply(Za),this}rotateX(t){return this.rotateOnAxis(bu,t)}rotateY(t){return this.rotateOnAxis(Su,t)}rotateZ(t){return this.rotateOnAxis(wu,t)}translateOnAxis(t,e){return Mu.copy(t).applyQuaternion(this.quaternion),this.position.add(Mu.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(bu,t)}translateY(t){return this.translateOnAxis(Su,t)}translateZ(t){return this.translateOnAxis(wu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Ri.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Uo.copy(t):Uo.set(t,e,i);const a=this.parent;this.updateWorldMatrix(!0,!1),Ns.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ri.lookAt(Ns,Uo,this.up):Ri.lookAt(Uo,Ns,this.up),this.quaternion.setFromRotationMatrix(Ri),a&&(Ri.extractRotation(a.matrixWorld),Za.setFromRotationMatrix(Ri),this.quaternion.premultiply(Za.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Eu),ja.child=t,this.dispatchEvent(ja),ja.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Ly),Cc.child=t,this.dispatchEvent(Cc),Cc.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Ri.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Ri.multiply(t.parent.matrixWorld)),t.applyMatrix4(Ri),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Eu),ja.child=t,this.dispatchEvent(ja),ja.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,a=this.children.length;i<a;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ns,t,Py),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ns,Cy,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function s(r,l){return r[l.uuid]===void 0&&(r[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=s(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const l=r.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];s(t.shapes,u)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let l=0,c=this.material.length;l<c;l++)r.push(s(t.materials,this.material[l]));a.material=r}else a.material=s(t.materials,this.material);if(this.children.length>0){a.children=[];for(let r=0;r<this.children.length;r++)a.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){a.animations=[];for(let r=0;r<this.animations.length;r++){const l=this.animations[r];a.animations.push(s(t.animations,l))}}if(e){const r=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),g=o(t.nodes);r.length>0&&(i.geometries=r),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=a,i;function o(r){const l=[];for(const c in r){const h=r[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const a=t.children[i];this.add(a.clone())}return this}}Ye.DEFAULT_UP=new H(0,1,0);Ye.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ye.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const si=new H,Pi=new H,Lc=new H,Ci=new H,qa=new H,Ka=new H,Tu=new H,Dc=new H,kc=new H,Ic=new H,Fc=new Ke,zc=new Ke,Nc=new Ke;class Gn{constructor(t=new H,e=new H,i=new H){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,a){a.subVectors(i,e),si.subVectors(t,e),a.cross(si);const s=a.lengthSq();return s>0?a.multiplyScalar(1/Math.sqrt(s)):a.set(0,0,0)}static getBarycoord(t,e,i,a,s){si.subVectors(a,e),Pi.subVectors(i,e),Lc.subVectors(t,e);const o=si.dot(si),r=si.dot(Pi),l=si.dot(Lc),c=Pi.dot(Pi),h=Pi.dot(Lc),u=o*c-r*r;if(u===0)return s.set(0,0,0),null;const d=1/u,f=(c*l-r*h)*d,g=(o*h-r*l)*d;return s.set(1-f-g,g,f)}static containsPoint(t,e,i,a){return this.getBarycoord(t,e,i,a,Ci)===null?!1:Ci.x>=0&&Ci.y>=0&&Ci.x+Ci.y<=1}static getInterpolation(t,e,i,a,s,o,r,l){return this.getBarycoord(t,e,i,a,Ci)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Ci.x),l.addScaledVector(o,Ci.y),l.addScaledVector(r,Ci.z),l)}static getInterpolatedAttribute(t,e,i,a,s,o){return Fc.setScalar(0),zc.setScalar(0),Nc.setScalar(0),Fc.fromBufferAttribute(t,e),zc.fromBufferAttribute(t,i),Nc.fromBufferAttribute(t,a),o.setScalar(0),o.addScaledVector(Fc,s.x),o.addScaledVector(zc,s.y),o.addScaledVector(Nc,s.z),o}static isFrontFacing(t,e,i,a){return si.subVectors(i,e),Pi.subVectors(t,e),si.cross(Pi).dot(a)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,a){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[a]),this}setFromAttributeAndIndices(t,e,i,a){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,a),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return si.subVectors(this.c,this.b),Pi.subVectors(this.a,this.b),si.cross(Pi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Gn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Gn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,a,s){return Gn.getInterpolation(t,this.a,this.b,this.c,e,i,a,s)}containsPoint(t){return Gn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Gn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,a=this.b,s=this.c;let o,r;qa.subVectors(a,i),Ka.subVectors(s,i),Dc.subVectors(t,i);const l=qa.dot(Dc),c=Ka.dot(Dc);if(l<=0&&c<=0)return e.copy(i);kc.subVectors(t,a);const h=qa.dot(kc),u=Ka.dot(kc);if(h>=0&&u<=h)return e.copy(a);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(i).addScaledVector(qa,o);Ic.subVectors(t,s);const f=qa.dot(Ic),g=Ka.dot(Ic);if(g>=0&&f<=g)return e.copy(s);const _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return r=c/(c-g),e.copy(i).addScaledVector(Ka,r);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return Tu.subVectors(s,a),r=(u-h)/(u-h+(f-g)),e.copy(a).addScaledVector(Tu,r);const p=1/(m+_+d);return o=_*p,r=d*p,e.copy(i).addScaledVector(qa,o).addScaledVector(Ka,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Rp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Zi={h:0,s:0,l:0},Oo={h:0,s:0,l:0};function Uc(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class se{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const a=t;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Rn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,be.toWorkingColorSpace(this,e),this}setRGB(t,e,i,a=be.workingColorSpace){return this.r=t,this.g=e,this.b=i,be.toWorkingColorSpace(this,a),this}setHSL(t,e,i,a=be.workingColorSpace){if(t=Ch(t,1),e=pn(e,0,1),i=pn(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,o=2*i-s;this.r=Uc(o,s,t+1/3),this.g=Uc(o,s,t),this.b=Uc(o,s,t-1/3)}return be.toWorkingColorSpace(this,a),this}setStyle(t,e=Rn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=a[1],r=a[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=a[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Rn){const i=Rp[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ni(t.r),this.g=Ni(t.g),this.b=Ni(t.b),this}copyLinearToSRGB(t){return this.r=ps(t.r),this.g=ps(t.g),this.b=ps(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Rn){return be.fromWorkingColorSpace(yn.copy(this),t),Math.round(pn(yn.r*255,0,255))*65536+Math.round(pn(yn.g*255,0,255))*256+Math.round(pn(yn.b*255,0,255))}getHexString(t=Rn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=be.workingColorSpace){be.fromWorkingColorSpace(yn.copy(this),e);const i=yn.r,a=yn.g,s=yn.b,o=Math.max(i,a,s),r=Math.min(i,a,s);let l,c;const h=(r+o)/2;if(r===o)l=0,c=0;else{const u=o-r;switch(c=h<=.5?u/(o+r):u/(2-o-r),o){case i:l=(a-s)/u+(a<s?6:0);break;case a:l=(s-i)/u+2;break;case s:l=(i-a)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=be.workingColorSpace){return be.fromWorkingColorSpace(yn.copy(this),e),t.r=yn.r,t.g=yn.g,t.b=yn.b,t}getStyle(t=Rn){be.fromWorkingColorSpace(yn.copy(this),t);const e=yn.r,i=yn.g,a=yn.b;return t!==Rn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(a*255)})`}offsetHSL(t,e,i){return this.getHSL(Zi),this.setHSL(Zi.h+t,Zi.s+e,Zi.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Zi),t.getHSL(Oo);const i=js(Zi.h,Oo.h,e),a=js(Zi.s,Oo.s,e),s=js(Zi.l,Oo.l,e);return this.setHSL(i,a,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,a=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*a,this.g=s[1]*e+s[4]*i+s[7]*a,this.b=s[2]*e+s[5]*i+s[8]*a,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const yn=new se;se.NAMES=Rp;let Dy=0;class La extends Es{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Dy++}),this.uuid=_i(),this.name="",this.blending=ds,this.side=ia,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=yl,this.blendDst=_l,this.blendEquation=Sa,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new se(0,0,0),this.blendAlpha=0,this.depthFunc=vs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ru,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ga,this.stencilZFail=Ga,this.stencilZPass=Ga,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const a=this[e];if(a===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(i):a&&a.isVector3&&i&&i.isVector3?a.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ds&&(i.blending=this.blending),this.side!==ia&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==yl&&(i.blendSrc=this.blendSrc),this.blendDst!==_l&&(i.blendDst=this.blendDst),this.blendEquation!==Sa&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==vs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ru&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ga&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ga&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ga&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function a(s){const o=[];for(const r in s){const l=s[r];delete l.metadata,o.push(l)}return o}if(e){const s=a(t.textures),o=a(t.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const a=e.length;i=new Array(a);for(let s=0;s!==a;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class fn extends La{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new se(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Mi,this.combine=Sh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const nn=new H,Bo=new Yt;class mn{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=ah,this.updateRanges=[],this.gpuType=Fi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let a=0,s=this.itemSize;a<s;a++)this.array[t+a]=e.array[i+a];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Bo.fromBufferAttribute(this,e),Bo.applyMatrix3(t),this.setXY(e,Bo.x,Bo.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)nn.fromBufferAttribute(this,e),nn.applyMatrix3(t),this.setXYZ(e,nn.x,nn.y,nn.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)nn.fromBufferAttribute(this,e),nn.applyMatrix4(t),this.setXYZ(e,nn.x,nn.y,nn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)nn.fromBufferAttribute(this,e),nn.applyNormalMatrix(t),this.setXYZ(e,nn.x,nn.y,nn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)nn.fromBufferAttribute(this,e),nn.transformDirection(t),this.setXYZ(e,nn.x,nn.y,nn.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=oi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Re(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=oi(e,this.array)),e}setX(t,e){return this.normalized&&(e=Re(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=oi(e,this.array)),e}setY(t,e){return this.normalized&&(e=Re(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=oi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Re(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=oi(e,this.array)),e}setW(t,e){return this.normalized&&(e=Re(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Re(e,this.array),i=Re(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,a){return t*=this.itemSize,this.normalized&&(e=Re(e,this.array),i=Re(i,this.array),a=Re(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t*=this.itemSize,this.normalized&&(e=Re(e,this.array),i=Re(i,this.array),a=Re(a,this.array),s=Re(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==ah&&(t.usage=this.usage),t}}class Pp extends mn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Cp extends mn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class Se extends mn{constructor(t,e,i){super(new Float32Array(t),e,i)}}let ky=0;const Yn=new Ue,Oc=new Ye,Ja=new H,Un=new mo,Us=new mo,un=new H;class sn extends Es{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ky++}),this.uuid=_i(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Ep(t)?Cp:Pp)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new me().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(t),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Yn.makeRotationFromQuaternion(t),this.applyMatrix4(Yn),this}rotateX(t){return Yn.makeRotationX(t),this.applyMatrix4(Yn),this}rotateY(t){return Yn.makeRotationY(t),this.applyMatrix4(Yn),this}rotateZ(t){return Yn.makeRotationZ(t),this.applyMatrix4(Yn),this}translate(t,e,i){return Yn.makeTranslation(t,e,i),this.applyMatrix4(Yn),this}scale(t,e,i){return Yn.makeScale(t,e,i),this.applyMatrix4(Yn),this}lookAt(t){return Oc.lookAt(t),Oc.updateMatrix(),this.applyMatrix4(Oc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ja).negate(),this.translate(Ja.x,Ja.y,Ja.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let a=0,s=t.length;a<s;a++){const o=t[a];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Se(i,3))}else{for(let i=0,a=e.count;i<a;i++){const s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new mo);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,a=e.length;i<a;i++){const s=e[i];Un.setFromBufferAttribute(s),this.morphTargetsRelative?(un.addVectors(this.boundingBox.min,Un.min),this.boundingBox.expandByPoint(un),un.addVectors(this.boundingBox.max,Un.max),this.boundingBox.expandByPoint(un)):(this.boundingBox.expandByPoint(Un.min),this.boundingBox.expandByPoint(Un.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Vr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new H,1/0);return}if(t){const i=this.boundingSphere.center;if(Un.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const r=e[s];Us.setFromBufferAttribute(r),this.morphTargetsRelative?(un.addVectors(Un.min,Us.min),Un.expandByPoint(un),un.addVectors(Un.max,Us.max),Un.expandByPoint(un)):(Un.expandByPoint(Us.min),Un.expandByPoint(Us.max))}Un.getCenter(i);let a=0;for(let s=0,o=t.count;s<o;s++)un.fromBufferAttribute(t,s),a=Math.max(a,i.distanceToSquared(un));if(e)for(let s=0,o=e.length;s<o;s++){const r=e[s],l=this.morphTargetsRelative;for(let c=0,h=r.count;c<h;c++)un.fromBufferAttribute(r,c),l&&(Ja.fromBufferAttribute(t,c),un.add(Ja)),a=Math.max(a,i.distanceToSquared(un))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,a=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new mn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),r=[],l=[];for(let A=0;A<i.count;A++)r[A]=new H,l[A]=new H;const c=new H,h=new H,u=new H,d=new Yt,f=new Yt,g=new Yt,_=new H,m=new H;function p(A,b,M){c.fromBufferAttribute(i,A),h.fromBufferAttribute(i,b),u.fromBufferAttribute(i,M),d.fromBufferAttribute(s,A),f.fromBufferAttribute(s,b),g.fromBufferAttribute(s,M),h.sub(c),u.sub(c),f.sub(d),g.sub(d);const P=1/(f.x*g.y-g.x*f.y);isFinite(P)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(P),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(P),r[A].add(_),r[b].add(_),r[M].add(_),l[A].add(m),l[b].add(m),l[M].add(m))}let y=this.groups;y.length===0&&(y=[{start:0,count:t.count}]);for(let A=0,b=y.length;A<b;++A){const M=y[A],P=M.start,C=M.count;for(let F=P,N=P+C;F<N;F+=3)p(t.getX(F+0),t.getX(F+1),t.getX(F+2))}const x=new H,v=new H,w=new H,S=new H;function E(A){w.fromBufferAttribute(a,A),S.copy(w);const b=r[A];x.copy(b),x.sub(w.multiplyScalar(w.dot(b))).normalize(),v.crossVectors(S,b);const P=v.dot(l[A])<0?-1:1;o.setXYZW(A,x.x,x.y,x.z,P)}for(let A=0,b=y.length;A<b;++A){const M=y[A],P=M.start,C=M.count;for(let F=P,N=P+C;F<N;F+=3)E(t.getX(F+0)),E(t.getX(F+1)),E(t.getX(F+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new mn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const a=new H,s=new H,o=new H,r=new H,l=new H,c=new H,h=new H,u=new H;if(t)for(let d=0,f=t.count;d<f;d+=3){const g=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);a.fromBufferAttribute(e,g),s.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),h.subVectors(o,s),u.subVectors(a,s),h.cross(u),r.fromBufferAttribute(i,g),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,m),r.add(h),l.add(h),c.add(h),i.setXYZ(g,r.x,r.y,r.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)a.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,s),u.subVectors(a,s),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)un.fromBufferAttribute(t,e),un.normalize(),t.setXYZ(e,un.x,un.y,un.z)}toNonIndexed(){function t(r,l){const c=r.array,h=r.itemSize,u=r.normalized,d=new c.constructor(l.length*h);let f=0,g=0;for(let _=0,m=l.length;_<m;_++){r.isInterleavedBufferAttribute?f=l[_]*r.data.stride+r.offset:f=l[_]*h;for(let p=0;p<h;p++)d[g++]=c[f++]}return new mn(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new sn,i=this.index.array,a=this.attributes;for(const r in a){const l=a[r],c=t(l,i);e.setAttribute(r,c)}const s=this.morphAttributes;for(const r in s){const l=[],c=s[r];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=t(d,i);l.push(f)}e.morphAttributes[r]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,l=o.length;r<l;r++){const c=o[r];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const a={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(t.data))}h.length>0&&(a[l]=h,s=!0)}s&&(t.data.morphAttributes=a,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const a=t.attributes;for(const c in a){const h=a[c];this.setAttribute(c,h.clone(e))}const s=t.morphAttributes;for(const c in s){const h=[],u=s[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Au=new Ue,fa=new Lh,Ho=new Vr,Ru=new H,Go=new H,Vo=new H,Xo=new H,Bc=new H,Wo=new H,Pu=new H,Yo=new H;class _e extends Ye{constructor(t=new sn,e=new fn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}getVertexPosition(t,e){const i=this.geometry,a=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(a,t);const r=this.morphTargetInfluences;if(s&&r){Wo.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=r[l],u=s[l];h!==0&&(Bc.fromBufferAttribute(u,t),o?Wo.addScaledVector(Bc,h):Wo.addScaledVector(Bc.sub(e),h))}e.add(Wo)}return e}raycast(t,e){const i=this.geometry,a=this.material,s=this.matrixWorld;a!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ho.copy(i.boundingSphere),Ho.applyMatrix4(s),fa.copy(t.ray).recast(t.near),!(Ho.containsPoint(fa.origin)===!1&&(fa.intersectSphere(Ho,Ru)===null||fa.origin.distanceToSquared(Ru)>(t.far-t.near)**2))&&(Au.copy(s).invert(),fa.copy(t.ray).applyMatrix4(Au),!(i.boundingBox!==null&&fa.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,fa)))}_computeIntersections(t,e,i){let a;const s=this.geometry,o=this.material,r=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,f=s.drawRange;if(r!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=o[m.materialIndex],y=Math.max(m.start,f.start),x=Math.min(r.count,Math.min(m.start+m.count,f.start+f.count));for(let v=y,w=x;v<w;v+=3){const S=r.getX(v),E=r.getX(v+1),A=r.getX(v+2);a=$o(this,p,t,i,c,h,u,S,E,A),a&&(a.faceIndex=Math.floor(v/3),a.face.materialIndex=m.materialIndex,e.push(a))}}else{const g=Math.max(0,f.start),_=Math.min(r.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const y=r.getX(m),x=r.getX(m+1),v=r.getX(m+2);a=$o(this,o,t,i,c,h,u,y,x,v),a&&(a.faceIndex=Math.floor(m/3),e.push(a))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=o[m.materialIndex],y=Math.max(m.start,f.start),x=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let v=y,w=x;v<w;v+=3){const S=v,E=v+1,A=v+2;a=$o(this,p,t,i,c,h,u,S,E,A),a&&(a.faceIndex=Math.floor(v/3),a.face.materialIndex=m.materialIndex,e.push(a))}}else{const g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const y=m,x=m+1,v=m+2;a=$o(this,o,t,i,c,h,u,y,x,v),a&&(a.faceIndex=Math.floor(m/3),e.push(a))}}}}function Iy(n,t,e,i,a,s,o,r){let l;if(t.side===Dn?l=i.intersectTriangle(o,s,a,!0,r):l=i.intersectTriangle(a,s,o,t.side===ia,r),l===null)return null;Yo.copy(r),Yo.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(Yo);return c<e.near||c>e.far?null:{distance:c,point:Yo.clone(),object:n}}function $o(n,t,e,i,a,s,o,r,l,c){n.getVertexPosition(r,Go),n.getVertexPosition(l,Vo),n.getVertexPosition(c,Xo);const h=Iy(n,t,e,i,Go,Vo,Xo,Pu);if(h){const u=new H;Gn.getBarycoord(Pu,Go,Vo,Xo,u),a&&(h.uv=Gn.getInterpolatedAttribute(a,r,l,c,u,new Yt)),s&&(h.uv1=Gn.getInterpolatedAttribute(s,r,l,c,u,new Yt)),o&&(h.normal=Gn.getInterpolatedAttribute(o,r,l,c,u,new H),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:r,b:l,c,normal:new H,materialIndex:0};Gn.getNormal(Go,Vo,Xo,d.normal),h.face=d,h.barycoord=u}return h}class li extends sn{constructor(t=1,e=1,i=1,a=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:a,heightSegments:s,depthSegments:o};const r=this;a=Math.floor(a),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,i,e,t,o,s,0),g("z","y","x",1,-1,i,e,-t,o,s,1),g("x","z","y",1,1,t,i,e,a,o,2),g("x","z","y",1,-1,t,i,-e,a,o,3),g("x","y","z",1,-1,t,e,i,a,s,4),g("x","y","z",-1,-1,t,e,-i,a,s,5),this.setIndex(l),this.setAttribute("position",new Se(c,3)),this.setAttribute("normal",new Se(h,3)),this.setAttribute("uv",new Se(u,2));function g(_,m,p,y,x,v,w,S,E,A,b){const M=v/E,P=w/A,C=v/2,F=w/2,N=S/2,L=E+1,I=A+1;let z=0,G=0;const $=new H;for(let et=0;et<I;et++){const ft=et*P-F;for(let vt=0;vt<L;vt++){const It=vt*M-C;$[_]=It*y,$[m]=ft*x,$[p]=N,c.push($.x,$.y,$.z),$[_]=0,$[m]=0,$[p]=S>0?1:-1,h.push($.x,$.y,$.z),u.push(vt/E),u.push(1-et/A),z+=1}}for(let et=0;et<A;et++)for(let ft=0;ft<E;ft++){const vt=d+ft+L*et,It=d+ft+L*(et+1),Y=d+(ft+1)+L*(et+1),Q=d+(ft+1)+L*et;l.push(vt,It,Q),l.push(It,Y,Q),G+=6}r.addGroup(f,G,b),f+=G,d+=z}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new li(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ss(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const a=n[e][i];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=a.clone():Array.isArray(a)?t[e][i]=a.slice():t[e][i]=a}}return t}function An(n){const t={};for(let e=0;e<n.length;e++){const i=Ss(n[e]);for(const a in i)t[a]=i[a]}return t}function Fy(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Lp(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:be.workingColorSpace}const zy={clone:Ss,merge:An};var Ny=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Uy=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class aa extends La{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ny,this.fragmentShader=Uy,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ss(t.uniforms),this.uniformsGroups=Fy(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const a in this.uniforms){const o=this.uniforms[a].value;o&&o.isTexture?e.uniforms[a]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[a]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[a]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[a]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[a]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[a]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[a]={type:"m4",value:o.toArray()}:e.uniforms[a]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const a in this.extensions)this.extensions[a]===!0&&(i[a]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class Dp extends Ye{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ue,this.projectionMatrix=new Ue,this.projectionMatrixInverse=new Ue,this.coordinateSystem=zi}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ji=new H,Cu=new Yt,Lu=new Yt;class Zn extends Dp{constructor(t=50,e=1,i=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=a,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=so*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(fs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return so*2*Math.atan(Math.tan(fs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){ji.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ji.x,ji.y).multiplyScalar(-t/ji.z),ji.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ji.x,ji.y).multiplyScalar(-t/ji.z)}getViewSize(t,e){return this.getViewBounds(t,Cu,Lu),e.subVectors(Lu,Cu)}setViewOffset(t,e,i,a,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(fs*.5*this.fov)/this.zoom,i=2*e,a=this.aspect*i,s=-.5*a;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*a/l,e-=o.offsetY*i/c,a*=o.width/l,i*=o.height/c}const r=this.filmOffset;r!==0&&(s+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+a,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Qa=-90,ts=1;class Oy extends Ye{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new Zn(Qa,ts,t,e);a.layers=this.layers,this.add(a);const s=new Zn(Qa,ts,t,e);s.layers=this.layers,this.add(s);const o=new Zn(Qa,ts,t,e);o.layers=this.layers,this.add(o);const r=new Zn(Qa,ts,t,e);r.layers=this.layers,this.add(r);const l=new Zn(Qa,ts,t,e);l.layers=this.layers,this.add(l);const c=new Zn(Qa,ts,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,a,s,o,r,l]=e;for(const c of e)this.remove(c);if(t===zi)i.up.set(0,1,0),i.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Pr)i.up.set(0,-1,0),i.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:a}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,r,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,a),t.render(e,s),t.setRenderTarget(i,1,a),t.render(e,o),t.setRenderTarget(i,2,a),t.render(e,r),t.setRenderTarget(i,3,a),t.render(e,l),t.setRenderTarget(i,4,a),t.render(e,c),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,a),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class kp extends Pn{constructor(t,e,i,a,s,o,r,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:ys,super(t,e,i,a,s,o,r,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class By extends Pa{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},a=[i,i,i,i,i,i];this.texture=new kp(a,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:vi}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},a=new li(5,5,5),s=new aa({name:"CubemapFromEquirect",uniforms:Ss(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Dn,blending:ta});s.uniforms.tEquirect.value=e;const o=new _e(a,s),r=e.minFilter;return e.minFilter===Ta&&(e.minFilter=vi),new Oy(1,10,this).update(t,o),e.minFilter=r,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,a){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,a);t.setRenderTarget(s)}}const Hc=new H,Hy=new H,Gy=new me;class _a{constructor(t=new H(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,a){return this.normal.set(t,e,i),this.constant=a,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const a=Hc.subVectors(i,e).cross(Hy.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(a,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(Hc),a=this.normal.dot(i);if(a===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/a;return s<0||s>1?null:e.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||Gy.getNormalMatrix(t),a=this.coplanarPoint(Hc).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-a.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const pa=new Vr,Zo=new H;class kh{constructor(t=new _a,e=new _a,i=new _a,a=new _a,s=new _a,o=new _a){this.planes=[t,e,i,a,s,o]}set(t,e,i,a,s,o){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(a),r[4].copy(s),r[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=zi){const i=this.planes,a=t.elements,s=a[0],o=a[1],r=a[2],l=a[3],c=a[4],h=a[5],u=a[6],d=a[7],f=a[8],g=a[9],_=a[10],m=a[11],p=a[12],y=a[13],x=a[14],v=a[15];if(i[0].setComponents(l-s,d-c,m-f,v-p).normalize(),i[1].setComponents(l+s,d+c,m+f,v+p).normalize(),i[2].setComponents(l+o,d+h,m+g,v+y).normalize(),i[3].setComponents(l-o,d-h,m-g,v-y).normalize(),i[4].setComponents(l-r,d-u,m-_,v-x).normalize(),e===zi)i[5].setComponents(l+r,d+u,m+_,v+x).normalize();else if(e===Pr)i[5].setComponents(r,u,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),pa.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),pa.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(pa)}intersectsSprite(t){return pa.center.set(0,0,0),pa.radius=.7071067811865476,pa.applyMatrix4(t.matrixWorld),this.intersectsSphere(pa)}intersectsSphere(t){const e=this.planes,i=t.center,a=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<a)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const a=e[i];if(Zo.x=a.normal.x>0?t.max.x:t.min.x,Zo.y=a.normal.y>0?t.max.y:t.min.y,Zo.z=a.normal.z>0?t.max.z:t.min.z,a.distanceToPoint(Zo)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Ip(){let n=null,t=!1,e=null,i=null;function a(s,o){e(s,o),i=n.requestAnimationFrame(a)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(a),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){n=s}}}function Vy(n){const t=new WeakMap;function e(r,l){const c=r.array,h=r.usage,u=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,h),r.onUploadCallback();let f;if(c instanceof Float32Array)f=n.FLOAT;else if(c instanceof Uint16Array)r.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=n.SHORT;else if(c instanceof Uint32Array)f=n.UNSIGNED_INT;else if(c instanceof Int32Array)f=n.INT;else if(c instanceof Int8Array)f=n.BYTE;else if(c instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:r.version,size:u}}function i(r,l,c){const h=l.array,u=l.updateRanges;if(n.bindBuffer(c,r),u.length===0)n.bufferSubData(c,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){const g=u[d],_=u[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){const _=u[f];n.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function a(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function s(r){r.isInterleavedBufferAttribute&&(r=r.data);const l=t.get(r);l&&(n.deleteBuffer(l.buffer),t.delete(r))}function o(r,l){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const h=t.get(r);(!h||h.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const c=t.get(r);if(c===void 0)t.set(r,e(r,l));else if(c.version<r.version){if(c.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,r,l),c.version=r.version}}return{get:a,remove:s,update:o}}class $n extends sn{constructor(t=1,e=1,i=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:a};const s=t/2,o=e/2,r=Math.floor(i),l=Math.floor(a),c=r+1,h=l+1,u=t/r,d=e/l,f=[],g=[],_=[],m=[];for(let p=0;p<h;p++){const y=p*d-o;for(let x=0;x<c;x++){const v=x*u-s;g.push(v,-y,0),_.push(0,0,1),m.push(x/r),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let y=0;y<r;y++){const x=y+c*p,v=y+c*(p+1),w=y+1+c*(p+1),S=y+1+c*p;f.push(x,v,S),f.push(v,w,S)}this.setIndex(f),this.setAttribute("position",new Se(g,3)),this.setAttribute("normal",new Se(_,3)),this.setAttribute("uv",new Se(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new $n(t.width,t.height,t.widthSegments,t.heightSegments)}}var Xy=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Wy=`#ifdef USE_ALPHAHASH
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
#endif`,Yy=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,$y=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Zy=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,jy=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,qy=`#ifdef USE_AOMAP
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
#endif`,Ky=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Jy=`#ifdef USE_BATCHING
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
#endif`,Qy=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,t_=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,e_=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,n_=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,i_=`#ifdef USE_IRIDESCENCE
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
#endif`,a_=`#ifdef USE_BUMPMAP
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
#endif`,s_=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,o_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,r_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,c_=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,l_=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,h_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,d_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,u_=`#if defined( USE_COLOR_ALPHA )
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
#endif`,f_=`#define PI 3.141592653589793
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
} // validated`,p_=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,m_=`vec3 transformedNormal = objectNormal;
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
#endif`,g_=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,x_=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,v_=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,y_=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,__="gl_FragColor = linearToOutputTexel( gl_FragColor );",M_=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,b_=`#ifdef USE_ENVMAP
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
#endif`,S_=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,w_=`#ifdef USE_ENVMAP
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
#endif`,E_=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,T_=`#ifdef USE_ENVMAP
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
#endif`,A_=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,R_=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,P_=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,C_=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,L_=`#ifdef USE_GRADIENTMAP
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
}`,D_=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,k_=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,I_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,F_=`uniform bool receiveShadow;
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
#endif`,z_=`#ifdef USE_ENVMAP
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
#endif`,N_=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,U_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,O_=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,B_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,H_=`PhysicalMaterial material;
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
#endif`,G_=`struct PhysicalMaterial {
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
}`,V_=`
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
#endif`,X_=`#if defined( RE_IndirectDiffuse )
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
#endif`,W_=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Y_=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,$_=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Z_=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,j_=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,q_=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,K_=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,J_=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Q_=`#if defined( USE_POINTS_UV )
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
#endif`,tM=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,eM=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,nM=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,iM=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,aM=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,sM=`#ifdef USE_MORPHTARGETS
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
#endif`,oM=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,rM=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,cM=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,lM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,hM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,dM=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,uM=`#ifdef USE_NORMALMAP
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
#endif`,fM=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,pM=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,mM=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,gM=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,xM=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,vM=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,yM=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,_M=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,MM=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,bM=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,SM=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,wM=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,EM=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,TM=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,AM=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,RM=`float getShadowMask() {
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
}`,PM=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,CM=`#ifdef USE_SKINNING
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
#endif`,LM=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,DM=`#ifdef USE_SKINNING
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
#endif`,kM=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,IM=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,FM=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,zM=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,NM=`#ifdef USE_TRANSMISSION
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
#endif`,UM=`#ifdef USE_TRANSMISSION
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
#endif`,OM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,BM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,HM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,GM=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const VM=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,XM=`uniform sampler2D t2D;
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
}`,WM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,YM=`#ifdef ENVMAP_TYPE_CUBE
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
}`,$M=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ZM=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jM=`#include <common>
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
}`,qM=`#if DEPTH_PACKING == 3200
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
}`,KM=`#define DISTANCE
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
}`,JM=`#define DISTANCE
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
}`,QM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,tb=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,eb=`uniform float scale;
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
}`,nb=`uniform vec3 diffuse;
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
}`,ib=`#include <common>
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
}`,ab=`uniform vec3 diffuse;
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
}`,sb=`#define LAMBERT
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
}`,ob=`#define LAMBERT
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
}`,rb=`#define MATCAP
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
}`,cb=`#define MATCAP
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
}`,lb=`#define NORMAL
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
}`,hb=`#define NORMAL
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
}`,db=`#define PHONG
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
}`,ub=`#define PHONG
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
}`,fb=`#define STANDARD
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
}`,pb=`#define STANDARD
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
}`,mb=`#define TOON
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
}`,gb=`#define TOON
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
}`,xb=`uniform float size;
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
}`,vb=`uniform vec3 diffuse;
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
}`,yb=`#include <common>
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
}`,_b=`uniform vec3 color;
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
}`,Mb=`uniform float rotation;
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
}`,bb=`uniform vec3 diffuse;
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
}`,xe={alphahash_fragment:Xy,alphahash_pars_fragment:Wy,alphamap_fragment:Yy,alphamap_pars_fragment:$y,alphatest_fragment:Zy,alphatest_pars_fragment:jy,aomap_fragment:qy,aomap_pars_fragment:Ky,batching_pars_vertex:Jy,batching_vertex:Qy,begin_vertex:t_,beginnormal_vertex:e_,bsdfs:n_,iridescence_fragment:i_,bumpmap_pars_fragment:a_,clipping_planes_fragment:s_,clipping_planes_pars_fragment:o_,clipping_planes_pars_vertex:r_,clipping_planes_vertex:c_,color_fragment:l_,color_pars_fragment:h_,color_pars_vertex:d_,color_vertex:u_,common:f_,cube_uv_reflection_fragment:p_,defaultnormal_vertex:m_,displacementmap_pars_vertex:g_,displacementmap_vertex:x_,emissivemap_fragment:v_,emissivemap_pars_fragment:y_,colorspace_fragment:__,colorspace_pars_fragment:M_,envmap_fragment:b_,envmap_common_pars_fragment:S_,envmap_pars_fragment:w_,envmap_pars_vertex:E_,envmap_physical_pars_fragment:z_,envmap_vertex:T_,fog_vertex:A_,fog_pars_vertex:R_,fog_fragment:P_,fog_pars_fragment:C_,gradientmap_pars_fragment:L_,lightmap_pars_fragment:D_,lights_lambert_fragment:k_,lights_lambert_pars_fragment:I_,lights_pars_begin:F_,lights_toon_fragment:N_,lights_toon_pars_fragment:U_,lights_phong_fragment:O_,lights_phong_pars_fragment:B_,lights_physical_fragment:H_,lights_physical_pars_fragment:G_,lights_fragment_begin:V_,lights_fragment_maps:X_,lights_fragment_end:W_,logdepthbuf_fragment:Y_,logdepthbuf_pars_fragment:$_,logdepthbuf_pars_vertex:Z_,logdepthbuf_vertex:j_,map_fragment:q_,map_pars_fragment:K_,map_particle_fragment:J_,map_particle_pars_fragment:Q_,metalnessmap_fragment:tM,metalnessmap_pars_fragment:eM,morphinstance_vertex:nM,morphcolor_vertex:iM,morphnormal_vertex:aM,morphtarget_pars_vertex:sM,morphtarget_vertex:oM,normal_fragment_begin:rM,normal_fragment_maps:cM,normal_pars_fragment:lM,normal_pars_vertex:hM,normal_vertex:dM,normalmap_pars_fragment:uM,clearcoat_normal_fragment_begin:fM,clearcoat_normal_fragment_maps:pM,clearcoat_pars_fragment:mM,iridescence_pars_fragment:gM,opaque_fragment:xM,packing:vM,premultiplied_alpha_fragment:yM,project_vertex:_M,dithering_fragment:MM,dithering_pars_fragment:bM,roughnessmap_fragment:SM,roughnessmap_pars_fragment:wM,shadowmap_pars_fragment:EM,shadowmap_pars_vertex:TM,shadowmap_vertex:AM,shadowmask_pars_fragment:RM,skinbase_vertex:PM,skinning_pars_vertex:CM,skinning_vertex:LM,skinnormal_vertex:DM,specularmap_fragment:kM,specularmap_pars_fragment:IM,tonemapping_fragment:FM,tonemapping_pars_fragment:zM,transmission_fragment:NM,transmission_pars_fragment:UM,uv_pars_fragment:OM,uv_pars_vertex:BM,uv_vertex:HM,worldpos_vertex:GM,background_vert:VM,background_frag:XM,backgroundCube_vert:WM,backgroundCube_frag:YM,cube_vert:$M,cube_frag:ZM,depth_vert:jM,depth_frag:qM,distanceRGBA_vert:KM,distanceRGBA_frag:JM,equirect_vert:QM,equirect_frag:tb,linedashed_vert:eb,linedashed_frag:nb,meshbasic_vert:ib,meshbasic_frag:ab,meshlambert_vert:sb,meshlambert_frag:ob,meshmatcap_vert:rb,meshmatcap_frag:cb,meshnormal_vert:lb,meshnormal_frag:hb,meshphong_vert:db,meshphong_frag:ub,meshphysical_vert:fb,meshphysical_frag:pb,meshtoon_vert:mb,meshtoon_frag:gb,points_vert:xb,points_frag:vb,shadow_vert:yb,shadow_frag:_b,sprite_vert:Mb,sprite_frag:bb},Xt={common:{diffuse:{value:new se(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new me},alphaMap:{value:null},alphaMapTransform:{value:new me},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new me}},envmap:{envMap:{value:null},envMapRotation:{value:new me},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new me}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new me}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new me},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new me},normalScale:{value:new Yt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new me},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new me}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new me}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new me}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new se(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new se(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new me},alphaTest:{value:0},uvTransform:{value:new me}},sprite:{diffuse:{value:new se(16777215)},opacity:{value:1},center:{value:new Yt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new me},alphaMap:{value:null},alphaMapTransform:{value:new me},alphaTest:{value:0}}},xi={basic:{uniforms:An([Xt.common,Xt.specularmap,Xt.envmap,Xt.aomap,Xt.lightmap,Xt.fog]),vertexShader:xe.meshbasic_vert,fragmentShader:xe.meshbasic_frag},lambert:{uniforms:An([Xt.common,Xt.specularmap,Xt.envmap,Xt.aomap,Xt.lightmap,Xt.emissivemap,Xt.bumpmap,Xt.normalmap,Xt.displacementmap,Xt.fog,Xt.lights,{emissive:{value:new se(0)}}]),vertexShader:xe.meshlambert_vert,fragmentShader:xe.meshlambert_frag},phong:{uniforms:An([Xt.common,Xt.specularmap,Xt.envmap,Xt.aomap,Xt.lightmap,Xt.emissivemap,Xt.bumpmap,Xt.normalmap,Xt.displacementmap,Xt.fog,Xt.lights,{emissive:{value:new se(0)},specular:{value:new se(1118481)},shininess:{value:30}}]),vertexShader:xe.meshphong_vert,fragmentShader:xe.meshphong_frag},standard:{uniforms:An([Xt.common,Xt.envmap,Xt.aomap,Xt.lightmap,Xt.emissivemap,Xt.bumpmap,Xt.normalmap,Xt.displacementmap,Xt.roughnessmap,Xt.metalnessmap,Xt.fog,Xt.lights,{emissive:{value:new se(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:xe.meshphysical_vert,fragmentShader:xe.meshphysical_frag},toon:{uniforms:An([Xt.common,Xt.aomap,Xt.lightmap,Xt.emissivemap,Xt.bumpmap,Xt.normalmap,Xt.displacementmap,Xt.gradientmap,Xt.fog,Xt.lights,{emissive:{value:new se(0)}}]),vertexShader:xe.meshtoon_vert,fragmentShader:xe.meshtoon_frag},matcap:{uniforms:An([Xt.common,Xt.bumpmap,Xt.normalmap,Xt.displacementmap,Xt.fog,{matcap:{value:null}}]),vertexShader:xe.meshmatcap_vert,fragmentShader:xe.meshmatcap_frag},points:{uniforms:An([Xt.points,Xt.fog]),vertexShader:xe.points_vert,fragmentShader:xe.points_frag},dashed:{uniforms:An([Xt.common,Xt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:xe.linedashed_vert,fragmentShader:xe.linedashed_frag},depth:{uniforms:An([Xt.common,Xt.displacementmap]),vertexShader:xe.depth_vert,fragmentShader:xe.depth_frag},normal:{uniforms:An([Xt.common,Xt.bumpmap,Xt.normalmap,Xt.displacementmap,{opacity:{value:1}}]),vertexShader:xe.meshnormal_vert,fragmentShader:xe.meshnormal_frag},sprite:{uniforms:An([Xt.sprite,Xt.fog]),vertexShader:xe.sprite_vert,fragmentShader:xe.sprite_frag},background:{uniforms:{uvTransform:{value:new me},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:xe.background_vert,fragmentShader:xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new me}},vertexShader:xe.backgroundCube_vert,fragmentShader:xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:xe.cube_vert,fragmentShader:xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:xe.equirect_vert,fragmentShader:xe.equirect_frag},distanceRGBA:{uniforms:An([Xt.common,Xt.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:xe.distanceRGBA_vert,fragmentShader:xe.distanceRGBA_frag},shadow:{uniforms:An([Xt.lights,Xt.fog,{color:{value:new se(0)},opacity:{value:1}}]),vertexShader:xe.shadow_vert,fragmentShader:xe.shadow_frag}};xi.physical={uniforms:An([xi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new me},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new me},clearcoatNormalScale:{value:new Yt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new me},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new me},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new me},sheen:{value:0},sheenColor:{value:new se(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new me},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new me},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new me},transmissionSamplerSize:{value:new Yt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new me},attenuationDistance:{value:0},attenuationColor:{value:new se(0)},specularColor:{value:new se(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new me},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new me},anisotropyVector:{value:new Yt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new me}}]),vertexShader:xe.meshphysical_vert,fragmentShader:xe.meshphysical_frag};const jo={r:0,b:0,g:0},ma=new Mi,Sb=new Ue;function wb(n,t,e,i,a,s,o){const r=new se(0);let l=s===!0?0:1,c,h,u=null,d=0,f=null;function g(y){let x=y.isScene===!0?y.background:null;return x&&x.isTexture&&(x=(y.backgroundBlurriness>0?e:t).get(x)),x}function _(y){let x=!1;const v=g(y);v===null?p(r,l):v&&v.isColor&&(p(v,1),x=!0);const w=n.xr.getEnvironmentBlendMode();w==="additive"?i.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(y,x){const v=g(x);v&&(v.isCubeTexture||v.mapping===Hr)?(h===void 0&&(h=new _e(new li(1,1,1),new aa({name:"BackgroundCubeMaterial",uniforms:Ss(xi.backgroundCube.uniforms),vertexShader:xi.backgroundCube.vertexShader,fragmentShader:xi.backgroundCube.fragmentShader,side:Dn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,S,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(h)),ma.copy(x.backgroundRotation),ma.x*=-1,ma.y*=-1,ma.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(ma.y*=-1,ma.z*=-1),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Sb.makeRotationFromEuler(ma)),h.material.toneMapped=be.getTransfer(v.colorSpace)!==Le,(u!==v||d!==v.version||f!==n.toneMapping)&&(h.material.needsUpdate=!0,u=v,d=v.version,f=n.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new _e(new $n(2,2),new aa({name:"BackgroundMaterial",uniforms:Ss(xi.background.uniforms),vertexShader:xi.background.vertexShader,fragmentShader:xi.background.fragmentShader,side:ia,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=be.getTransfer(v.colorSpace)!==Le,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||d!==v.version||f!==n.toneMapping)&&(c.material.needsUpdate=!0,u=v,d=v.version,f=n.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function p(y,x){y.getRGB(jo,Lp(n)),i.buffers.color.setClear(jo.r,jo.g,jo.b,x,o)}return{getClearColor:function(){return r},setClearColor:function(y,x=1){r.set(y),l=x,p(r,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,p(r,l)},render:_,addToRenderList:m}}function Eb(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},a=d(null);let s=a,o=!1;function r(M,P,C,F,N){let L=!1;const I=u(F,C,P);s!==I&&(s=I,c(s.object)),L=f(M,F,C,N),L&&g(M,F,C,N),N!==null&&t.update(N,n.ELEMENT_ARRAY_BUFFER),(L||o)&&(o=!1,v(M,P,C,F),N!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(N).buffer))}function l(){return n.createVertexArray()}function c(M){return n.bindVertexArray(M)}function h(M){return n.deleteVertexArray(M)}function u(M,P,C){const F=C.wireframe===!0;let N=i[M.id];N===void 0&&(N={},i[M.id]=N);let L=N[P.id];L===void 0&&(L={},N[P.id]=L);let I=L[F];return I===void 0&&(I=d(l()),L[F]=I),I}function d(M){const P=[],C=[],F=[];for(let N=0;N<e;N++)P[N]=0,C[N]=0,F[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:C,attributeDivisors:F,object:M,attributes:{},index:null}}function f(M,P,C,F){const N=s.attributes,L=P.attributes;let I=0;const z=C.getAttributes();for(const G in z)if(z[G].location>=0){const et=N[G];let ft=L[G];if(ft===void 0&&(G==="instanceMatrix"&&M.instanceMatrix&&(ft=M.instanceMatrix),G==="instanceColor"&&M.instanceColor&&(ft=M.instanceColor)),et===void 0||et.attribute!==ft||ft&&et.data!==ft.data)return!0;I++}return s.attributesNum!==I||s.index!==F}function g(M,P,C,F){const N={},L=P.attributes;let I=0;const z=C.getAttributes();for(const G in z)if(z[G].location>=0){let et=L[G];et===void 0&&(G==="instanceMatrix"&&M.instanceMatrix&&(et=M.instanceMatrix),G==="instanceColor"&&M.instanceColor&&(et=M.instanceColor));const ft={};ft.attribute=et,et&&et.data&&(ft.data=et.data),N[G]=ft,I++}s.attributes=N,s.attributesNum=I,s.index=F}function _(){const M=s.newAttributes;for(let P=0,C=M.length;P<C;P++)M[P]=0}function m(M){p(M,0)}function p(M,P){const C=s.newAttributes,F=s.enabledAttributes,N=s.attributeDivisors;C[M]=1,F[M]===0&&(n.enableVertexAttribArray(M),F[M]=1),N[M]!==P&&(n.vertexAttribDivisor(M,P),N[M]=P)}function y(){const M=s.newAttributes,P=s.enabledAttributes;for(let C=0,F=P.length;C<F;C++)P[C]!==M[C]&&(n.disableVertexAttribArray(C),P[C]=0)}function x(M,P,C,F,N,L,I){I===!0?n.vertexAttribIPointer(M,P,C,N,L):n.vertexAttribPointer(M,P,C,F,N,L)}function v(M,P,C,F){_();const N=F.attributes,L=C.getAttributes(),I=P.defaultAttributeValues;for(const z in L){const G=L[z];if(G.location>=0){let $=N[z];if($===void 0&&(z==="instanceMatrix"&&M.instanceMatrix&&($=M.instanceMatrix),z==="instanceColor"&&M.instanceColor&&($=M.instanceColor)),$!==void 0){const et=$.normalized,ft=$.itemSize,vt=t.get($);if(vt===void 0)continue;const It=vt.buffer,Y=vt.type,Q=vt.bytesPerElement,pt=Y===n.INT||Y===n.UNSIGNED_INT||$.gpuType===wh;if($.isInterleavedBufferAttribute){const at=$.data,K=at.stride,Z=$.offset;if(at.isInstancedInterleavedBuffer){for(let _t=0;_t<G.locationSize;_t++)p(G.location+_t,at.meshPerAttribute);M.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let _t=0;_t<G.locationSize;_t++)m(G.location+_t);n.bindBuffer(n.ARRAY_BUFFER,It);for(let _t=0;_t<G.locationSize;_t++)x(G.location+_t,ft/G.locationSize,Y,et,K*Q,(Z+ft/G.locationSize*_t)*Q,pt)}else{if($.isInstancedBufferAttribute){for(let at=0;at<G.locationSize;at++)p(G.location+at,$.meshPerAttribute);M.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let at=0;at<G.locationSize;at++)m(G.location+at);n.bindBuffer(n.ARRAY_BUFFER,It);for(let at=0;at<G.locationSize;at++)x(G.location+at,ft/G.locationSize,Y,et,ft*Q,ft/G.locationSize*at*Q,pt)}}else if(I!==void 0){const et=I[z];if(et!==void 0)switch(et.length){case 2:n.vertexAttrib2fv(G.location,et);break;case 3:n.vertexAttrib3fv(G.location,et);break;case 4:n.vertexAttrib4fv(G.location,et);break;default:n.vertexAttrib1fv(G.location,et)}}}}y()}function w(){A();for(const M in i){const P=i[M];for(const C in P){const F=P[C];for(const N in F)h(F[N].object),delete F[N];delete P[C]}delete i[M]}}function S(M){if(i[M.id]===void 0)return;const P=i[M.id];for(const C in P){const F=P[C];for(const N in F)h(F[N].object),delete F[N];delete P[C]}delete i[M.id]}function E(M){for(const P in i){const C=i[P];if(C[M.id]===void 0)continue;const F=C[M.id];for(const N in F)h(F[N].object),delete F[N];delete C[M.id]}}function A(){b(),o=!0,s!==a&&(s=a,c(s.object))}function b(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:r,reset:A,resetDefaultState:b,dispose:w,releaseStatesOfGeometry:S,releaseStatesOfProgram:E,initAttributes:_,enableAttribute:m,disableUnusedAttributes:y}}function Tb(n,t,e){let i;function a(c){i=c}function s(c,h){n.drawArrays(i,c,h),e.update(h,i,1)}function o(c,h,u){u!==0&&(n.drawArraysInstanced(i,c,h,u),e.update(h,i,u))}function r(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];e.update(f,i,1)}function l(c,h,u,d){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)o(c[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(i,c,0,h,0,d,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_]*d[_];e.update(g,i,1)}}this.setMode=a,this.render=s,this.renderInstances=o,this.renderMultiDraw=r,this.renderMultiDrawInstances=l}function Ab(n,t,e,i){let a;function s(){if(a!==void 0)return a;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");a=n.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function o(E){return!(E!==ri&&i.convert(E)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(E){const A=E===fo&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(E!==Ui&&i.convert(E)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==Fi&&!A)}function l(E){if(E==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),x=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),w=g>0,S=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:r,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:y,maxVaryings:x,maxFragmentUniforms:v,vertexTextures:w,maxSamples:S}}function Rb(n){const t=this;let e=null,i=0,a=!1,s=!1;const o=new _a,r=new me,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||i!==0||a;return a=d,i=u.length,f},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,p=n.get(u);if(!a||g===null||g.length===0||s&&!m)s?h(null):c();else{const y=s?0:i,x=y*4;let v=p.clippingState||null;l.value=v,v=h(g,d,x,f);for(let w=0;w!==x;++w)v[w]=e[w];p.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,d,f,g){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const p=f+_*4,y=d.matrixWorldInverse;r.getNormalMatrix(y),(m===null||m.length<p)&&(m=new Float32Array(p));for(let x=0,v=f;x!==_;++x,v+=4)o.copy(u[x]).applyMatrix4(y,r),o.normal.toArray(m,v),m[v+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function Pb(n){let t=new WeakMap;function e(o,r){return r===Rl?o.mapping=ys:r===Pl&&(o.mapping=_s),o}function i(o){if(o&&o.isTexture){const r=o.mapping;if(r===Rl||r===Pl)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new By(l.height);return c.fromEquirectangularTexture(n,o),t.set(o,c),o.addEventListener("dispose",a),e(c.texture,o.mapping)}else return null}}return o}function a(o){const r=o.target;r.removeEventListener("dispose",a);const l=t.get(r);l!==void 0&&(t.delete(r),l.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}class Fp extends Dp{constructor(t=-1,e=1,i=1,a=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=a,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,a,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let s=i-t,o=i+t,r=a+e,l=a-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,r-=h*this.view.offsetY,l=r-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,r,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const cs=4,Du=[.125,.215,.35,.446,.526,.582],wa=20,Gc=new Fp,ku=new se;let Vc=null,Xc=0,Wc=0,Yc=!1;const Ma=(1+Math.sqrt(5))/2,es=1/Ma,Iu=[new H(-Ma,es,0),new H(Ma,es,0),new H(-es,0,Ma),new H(es,0,Ma),new H(0,Ma,-es),new H(0,Ma,es),new H(-1,1,-1),new H(1,1,-1),new H(-1,1,1),new H(1,1,1)];class Fu{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,a=100){Vc=this._renderer.getRenderTarget(),Xc=this._renderer.getActiveCubeFace(),Wc=this._renderer.getActiveMipmapLevel(),Yc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,i,a,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Uu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Nu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Vc,Xc,Wc),this._renderer.xr.enabled=Yc,t.scissorTest=!1,qo(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ys||t.mapping===_s?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Vc=this._renderer.getRenderTarget(),Xc=this._renderer.getActiveCubeFace(),Wc=this._renderer.getActiveMipmapLevel(),Yc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:vi,minFilter:vi,generateMipmaps:!1,type:fo,format:ri,colorSpace:ws,depthBuffer:!1},a=zu(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=zu(t,e,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Cb(s)),this._blurMaterial=Lb(s,t,e)}return a}_compileMaterial(t){const e=new _e(this._lodPlanes[0],t);this._renderer.compile(e,Gc)}_sceneToCubeUV(t,e,i,a){const r=new Zn(90,1,e,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(ku),h.toneMapping=ea,h.autoClear=!1;const f=new fn({name:"PMREM.Background",side:Dn,depthWrite:!1,depthTest:!1}),g=new _e(new li,f);let _=!1;const m=t.background;m?m.isColor&&(f.color.copy(m),t.background=null,_=!0):(f.color.copy(ku),_=!0);for(let p=0;p<6;p++){const y=p%3;y===0?(r.up.set(0,l[p],0),r.lookAt(c[p],0,0)):y===1?(r.up.set(0,0,l[p]),r.lookAt(0,c[p],0)):(r.up.set(0,l[p],0),r.lookAt(0,0,c[p]));const x=this._cubeSize;qo(a,y*x,p>2?x:0,x,x),h.setRenderTarget(a),_&&h.render(g,r),h.render(t,r)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const i=this._renderer,a=t.mapping===ys||t.mapping===_s;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=Uu()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Nu());const s=a?this._cubemapMaterial:this._equirectMaterial,o=new _e(this._lodPlanes[0],s),r=s.uniforms;r.envMap.value=t;const l=this._cubeSize;qo(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(o,Gc)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const a=this._lodPlanes.length;for(let s=1;s<a;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),r=Iu[(a-s-1)%Iu.length];this._blur(t,s-1,s,o,r)}e.autoClear=i}_blur(t,e,i,a,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,a,"latitudinal",s),this._halfBlur(o,t,i,i,a,"longitudinal",s)}_halfBlur(t,e,i,a,s,o,r){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new _e(this._lodPlanes[a],c),d=c.uniforms,f=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*wa-1),_=s/g,m=isFinite(s)?1+Math.floor(h*_):wa;m>wa&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${wa}`);const p=[];let y=0;for(let E=0;E<wa;++E){const A=E/_,b=Math.exp(-A*A/2);p.push(b),E===0?y+=b:E<m&&(y+=2*b)}for(let E=0;E<p.length;E++)p[E]=p[E]/y;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",r&&(d.poleAxis.value=r);const{_lodMax:x}=this;d.dTheta.value=g,d.mipInt.value=x-i;const v=this._sizeLods[a],w=3*v*(a>x-cs?a-x+cs:0),S=4*(this._cubeSize-v);qo(e,w,S,3*v,2*v),l.setRenderTarget(e),l.render(u,Gc)}}function Cb(n){const t=[],e=[],i=[];let a=n;const s=n-cs+1+Du.length;for(let o=0;o<s;o++){const r=Math.pow(2,a);e.push(r);let l=1/r;o>n-cs?l=Du[o-n+cs-1]:o===0&&(l=0),i.push(l);const c=1/(r-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,_=3,m=2,p=1,y=new Float32Array(_*g*f),x=new Float32Array(m*g*f),v=new Float32Array(p*g*f);for(let S=0;S<f;S++){const E=S%3*2/3-1,A=S>2?0:-1,b=[E,A,0,E+2/3,A,0,E+2/3,A+1,0,E,A,0,E+2/3,A+1,0,E,A+1,0];y.set(b,_*g*S),x.set(d,m*g*S);const M=[S,S,S,S,S,S];v.set(M,p*g*S)}const w=new sn;w.setAttribute("position",new mn(y,_)),w.setAttribute("uv",new mn(x,m)),w.setAttribute("faceIndex",new mn(v,p)),t.push(w),a>cs&&a--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function zu(n,t,e){const i=new Pa(n,t,e);return i.texture.mapping=Hr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function qo(n,t,e,i,a){n.viewport.set(t,e,i,a),n.scissor.set(t,e,i,a)}function Lb(n,t,e){const i=new Float32Array(wa),a=new H(0,1,0);return new aa({name:"SphericalGaussianBlur",defines:{n:wa,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:Ih(),fragmentShader:`

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
		`,blending:ta,depthTest:!1,depthWrite:!1})}function Nu(){return new aa({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ih(),fragmentShader:`

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
		`,blending:ta,depthTest:!1,depthWrite:!1})}function Uu(){return new aa({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ih(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ta,depthTest:!1,depthWrite:!1})}function Ih(){return`

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
	`}function Db(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const l=r.mapping,c=l===Rl||l===Pl,h=l===ys||l===_s;if(c||h){let u=t.get(r);const d=u!==void 0?u.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==d)return e===null&&(e=new Fu(n)),u=c?e.fromEquirectangular(r,u):e.fromCubemap(r,u),u.texture.pmremVersion=r.pmremVersion,t.set(r,u),u.texture;if(u!==void 0)return u.texture;{const f=r.image;return c&&f&&f.height>0||h&&f&&a(f)?(e===null&&(e=new Fu(n)),u=c?e.fromEquirectangular(r):e.fromCubemap(r),u.texture.pmremVersion=r.pmremVersion,t.set(r,u),r.addEventListener("dispose",s),u.texture):null}}}return r}function a(r){let l=0;const c=6;for(let h=0;h<c;h++)r[h]!==void 0&&l++;return l===c}function s(r){const l=r.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function kb(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let a;switch(i){case"WEBGL_depth_texture":a=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=n.getExtension(i)}return t[i]=a,a}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const a=e(i);return a===null&&Vs("THREE.WebGLRenderer: "+i+" extension not supported."),a}}}function Ib(n,t,e,i){const a={},s=new WeakMap;function o(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);for(const g in d.morphAttributes){const _=d.morphAttributes[g];for(let m=0,p=_.length;m<p;m++)t.remove(_[m])}d.removeEventListener("dispose",o),delete a[d.id];const f=s.get(d);f&&(t.remove(f),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function r(u,d){return a[d.id]===!0||(d.addEventListener("dispose",o),a[d.id]=!0,e.memory.geometries++),d}function l(u){const d=u.attributes;for(const g in d)t.update(d[g],n.ARRAY_BUFFER);const f=u.morphAttributes;for(const g in f){const _=f[g];for(let m=0,p=_.length;m<p;m++)t.update(_[m],n.ARRAY_BUFFER)}}function c(u){const d=[],f=u.index,g=u.attributes.position;let _=0;if(f!==null){const y=f.array;_=f.version;for(let x=0,v=y.length;x<v;x+=3){const w=y[x+0],S=y[x+1],E=y[x+2];d.push(w,S,S,E,E,w)}}else if(g!==void 0){const y=g.array;_=g.version;for(let x=0,v=y.length/3-1;x<v;x+=3){const w=x+0,S=x+1,E=x+2;d.push(w,S,S,E,E,w)}}else return;const m=new(Ep(d)?Cp:Pp)(d,1);m.version=_;const p=s.get(u);p&&t.remove(p),s.set(u,m)}function h(u){const d=s.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return s.get(u)}return{get:r,update:l,getWireframeAttribute:h}}function Fb(n,t,e){let i;function a(d){i=d}let s,o;function r(d){s=d.type,o=d.bytesPerElement}function l(d,f){n.drawElements(i,f,s,d*o),e.update(f,i,1)}function c(d,f,g){g!==0&&(n.drawElementsInstanced(i,f,s,d*o,g),e.update(f,i,g))}function h(d,f,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,s,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];e.update(m,i,1)}function u(d,f,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)c(d[p]/o,f[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(i,f,0,s,d,0,_,0,g);let p=0;for(let y=0;y<g;y++)p+=f[y]*_[y];e.update(p,i,1)}}this.setMode=a,this.setIndex=r,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function zb(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,r){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=r*(s/3);break;case n.LINES:e.lines+=r*(s/2);break;case n.LINE_STRIP:e.lines+=r*(s-1);break;case n.LINE_LOOP:e.lines+=r*s;break;case n.POINTS:e.points+=r*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function a(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:a,update:i}}function Nb(n,t,e){const i=new WeakMap,a=new Ke;function s(o,r,l){const c=o.morphTargetInfluences,h=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,u=h!==void 0?h.length:0;let d=i.get(r);if(d===void 0||d.count!==u){let M=function(){A.dispose(),i.delete(r),r.removeEventListener("dispose",M)};var f=M;d!==void 0&&d.texture.dispose();const g=r.morphAttributes.position!==void 0,_=r.morphAttributes.normal!==void 0,m=r.morphAttributes.color!==void 0,p=r.morphAttributes.position||[],y=r.morphAttributes.normal||[],x=r.morphAttributes.color||[];let v=0;g===!0&&(v=1),_===!0&&(v=2),m===!0&&(v=3);let w=r.attributes.position.count*v,S=1;w>t.maxTextureSize&&(S=Math.ceil(w/t.maxTextureSize),w=t.maxTextureSize);const E=new Float32Array(w*S*4*u),A=new Ap(E,w,S,u);A.type=Fi,A.needsUpdate=!0;const b=v*4;for(let P=0;P<u;P++){const C=p[P],F=y[P],N=x[P],L=w*S*4*P;for(let I=0;I<C.count;I++){const z=I*b;g===!0&&(a.fromBufferAttribute(C,I),E[L+z+0]=a.x,E[L+z+1]=a.y,E[L+z+2]=a.z,E[L+z+3]=0),_===!0&&(a.fromBufferAttribute(F,I),E[L+z+4]=a.x,E[L+z+5]=a.y,E[L+z+6]=a.z,E[L+z+7]=0),m===!0&&(a.fromBufferAttribute(N,I),E[L+z+8]=a.x,E[L+z+9]=a.y,E[L+z+10]=a.z,E[L+z+11]=N.itemSize===4?a.w:1)}}d={count:u,texture:A,size:new Yt(w,S)},i.set(r,d),r.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const _=r.morphTargetsRelative?1:1-g;l.getUniforms().setValue(n,"morphTargetBaseInfluence",_),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:s}}function Ub(n,t,e,i){let a=new WeakMap;function s(l){const c=i.render.frame,h=l.geometry,u=t.get(l,h);if(a.get(u)!==c&&(t.update(u),a.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",r)===!1&&l.addEventListener("dispose",r),a.get(l)!==c&&(e.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,n.ARRAY_BUFFER),a.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;a.get(d)!==c&&(d.update(),a.set(d,c))}return u}function o(){a=new WeakMap}function r(l){const c=l.target;c.removeEventListener("dispose",r),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:s,dispose:o}}class zp extends Pn{constructor(t,e,i,a,s,o,r,l,c,h=us){if(h!==us&&h!==bs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===us&&(i=Ra),i===void 0&&h===bs&&(i=Ms),super(null,a,s,o,r,l,h,i,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:ci,this.minFilter=l!==void 0?l:ci,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Np=new Pn,Ou=new zp(1,1),Up=new Ap,Op=new wy,Bp=new kp,Bu=[],Hu=[],Gu=new Float32Array(16),Vu=new Float32Array(9),Xu=new Float32Array(4);function Ts(n,t,e){const i=n[0];if(i<=0||i>0)return n;const a=t*e;let s=Bu[a];if(s===void 0&&(s=new Float32Array(a),Bu[a]=s),t!==0){i.toArray(s,0);for(let o=1,r=0;o!==t;++o)r+=e,n[o].toArray(s,r)}return s}function rn(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function cn(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function Xr(n,t){let e=Hu[t];e===void 0&&(e=new Int32Array(t),Hu[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function Ob(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function Bb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(rn(e,t))return;n.uniform2fv(this.addr,t),cn(e,t)}}function Hb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(rn(e,t))return;n.uniform3fv(this.addr,t),cn(e,t)}}function Gb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(rn(e,t))return;n.uniform4fv(this.addr,t),cn(e,t)}}function Vb(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(rn(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),cn(e,t)}else{if(rn(e,i))return;Xu.set(i),n.uniformMatrix2fv(this.addr,!1,Xu),cn(e,i)}}function Xb(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(rn(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),cn(e,t)}else{if(rn(e,i))return;Vu.set(i),n.uniformMatrix3fv(this.addr,!1,Vu),cn(e,i)}}function Wb(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(rn(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),cn(e,t)}else{if(rn(e,i))return;Gu.set(i),n.uniformMatrix4fv(this.addr,!1,Gu),cn(e,i)}}function Yb(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function $b(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(rn(e,t))return;n.uniform2iv(this.addr,t),cn(e,t)}}function Zb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(rn(e,t))return;n.uniform3iv(this.addr,t),cn(e,t)}}function jb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(rn(e,t))return;n.uniform4iv(this.addr,t),cn(e,t)}}function qb(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function Kb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(rn(e,t))return;n.uniform2uiv(this.addr,t),cn(e,t)}}function Jb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(rn(e,t))return;n.uniform3uiv(this.addr,t),cn(e,t)}}function Qb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(rn(e,t))return;n.uniform4uiv(this.addr,t),cn(e,t)}}function t1(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a);let s;this.type===n.SAMPLER_2D_SHADOW?(Ou.compareFunction=wp,s=Ou):s=Np,e.setTexture2D(t||s,a)}function e1(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture3D(t||Op,a)}function n1(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTextureCube(t||Bp,a)}function i1(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture2DArray(t||Up,a)}function a1(n){switch(n){case 5126:return Ob;case 35664:return Bb;case 35665:return Hb;case 35666:return Gb;case 35674:return Vb;case 35675:return Xb;case 35676:return Wb;case 5124:case 35670:return Yb;case 35667:case 35671:return $b;case 35668:case 35672:return Zb;case 35669:case 35673:return jb;case 5125:return qb;case 36294:return Kb;case 36295:return Jb;case 36296:return Qb;case 35678:case 36198:case 36298:case 36306:case 35682:return t1;case 35679:case 36299:case 36307:return e1;case 35680:case 36300:case 36308:case 36293:return n1;case 36289:case 36303:case 36311:case 36292:return i1}}function s1(n,t){n.uniform1fv(this.addr,t)}function o1(n,t){const e=Ts(t,this.size,2);n.uniform2fv(this.addr,e)}function r1(n,t){const e=Ts(t,this.size,3);n.uniform3fv(this.addr,e)}function c1(n,t){const e=Ts(t,this.size,4);n.uniform4fv(this.addr,e)}function l1(n,t){const e=Ts(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function h1(n,t){const e=Ts(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function d1(n,t){const e=Ts(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function u1(n,t){n.uniform1iv(this.addr,t)}function f1(n,t){n.uniform2iv(this.addr,t)}function p1(n,t){n.uniform3iv(this.addr,t)}function m1(n,t){n.uniform4iv(this.addr,t)}function g1(n,t){n.uniform1uiv(this.addr,t)}function x1(n,t){n.uniform2uiv(this.addr,t)}function v1(n,t){n.uniform3uiv(this.addr,t)}function y1(n,t){n.uniform4uiv(this.addr,t)}function _1(n,t,e){const i=this.cache,a=t.length,s=Xr(e,a);rn(i,s)||(n.uniform1iv(this.addr,s),cn(i,s));for(let o=0;o!==a;++o)e.setTexture2D(t[o]||Np,s[o])}function M1(n,t,e){const i=this.cache,a=t.length,s=Xr(e,a);rn(i,s)||(n.uniform1iv(this.addr,s),cn(i,s));for(let o=0;o!==a;++o)e.setTexture3D(t[o]||Op,s[o])}function b1(n,t,e){const i=this.cache,a=t.length,s=Xr(e,a);rn(i,s)||(n.uniform1iv(this.addr,s),cn(i,s));for(let o=0;o!==a;++o)e.setTextureCube(t[o]||Bp,s[o])}function S1(n,t,e){const i=this.cache,a=t.length,s=Xr(e,a);rn(i,s)||(n.uniform1iv(this.addr,s),cn(i,s));for(let o=0;o!==a;++o)e.setTexture2DArray(t[o]||Up,s[o])}function w1(n){switch(n){case 5126:return s1;case 35664:return o1;case 35665:return r1;case 35666:return c1;case 35674:return l1;case 35675:return h1;case 35676:return d1;case 5124:case 35670:return u1;case 35667:case 35671:return f1;case 35668:case 35672:return p1;case 35669:case 35673:return m1;case 5125:return g1;case 36294:return x1;case 36295:return v1;case 36296:return y1;case 35678:case 36198:case 36298:case 36306:case 35682:return _1;case 35679:case 36299:case 36307:return M1;case 35680:case 36300:case 36308:case 36293:return b1;case 36289:case 36303:case 36311:case 36292:return S1}}class E1{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=a1(e.type)}}class T1{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=w1(e.type)}}class A1{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const a=this.seq;for(let s=0,o=a.length;s!==o;++s){const r=a[s];r.setValue(t,e[r.id],i)}}}const $c=/(\w+)(\])?(\[|\.)?/g;function Wu(n,t){n.seq.push(t),n.map[t.id]=t}function R1(n,t,e){const i=n.name,a=i.length;for($c.lastIndex=0;;){const s=$c.exec(i),o=$c.lastIndex;let r=s[1];const l=s[2]==="]",c=s[3];if(l&&(r=r|0),c===void 0||c==="["&&o+2===a){Wu(e,c===void 0?new E1(r,n,t):new T1(r,n,t));break}else{let u=e.map[r];u===void 0&&(u=new A1(r),Wu(e,u)),e=u}}}class gr{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const s=t.getActiveUniform(e,a),o=t.getUniformLocation(e,s.name);R1(s,o,this)}}setValue(t,e,i,a){const s=this.map[e];s!==void 0&&s.setValue(t,i,a)}setOptional(t,e,i){const a=e[i];a!==void 0&&this.setValue(t,i,a)}static upload(t,e,i,a){for(let s=0,o=e.length;s!==o;++s){const r=e[s],l=i[r.id];l.needsUpdate!==!1&&r.setValue(t,l.value,a)}}static seqWithValue(t,e){const i=[];for(let a=0,s=t.length;a!==s;++a){const o=t[a];o.id in e&&i.push(o)}return i}}function Yu(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const P1=37297;let C1=0;function L1(n,t){const e=n.split(`
`),i=[],a=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=a;o<s;o++){const r=o+1;i.push(`${r===t?">":" "} ${r}: ${e[o]}`)}return i.join(`
`)}const $u=new me;function D1(n){be._getMatrix($u,be.workingColorSpace,n);const t=`mat3( ${$u.elements.map(e=>e.toFixed(4))} )`;switch(be.getTransfer(n)){case Gr:return[t,"LinearTransferOETF"];case Le:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Zu(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),a=n.getShaderInfoLog(t).trim();if(i&&a==="")return"";const s=/ERROR: 0:(\d+)/.exec(a);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+a+`

`+L1(n.getShaderSource(t),o)}else return a}function k1(n,t){const e=D1(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function I1(n,t){let e;switch(t){case zv:e="Linear";break;case Nv:e="Reinhard";break;case Uv:e="Cineon";break;case Ov:e="ACESFilmic";break;case Hv:e="AgX";break;case Gv:e="Neutral";break;case Bv:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ko=new H;function F1(){be.getLuminanceCoefficients(Ko);const n=Ko.x.toFixed(4),t=Ko.y.toFixed(4),e=Ko.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function z1(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Xs).join(`
`)}function N1(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function U1(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let a=0;a<i;a++){const s=n.getActiveAttrib(t,a),o=s.name;let r=1;s.type===n.FLOAT_MAT2&&(r=2),s.type===n.FLOAT_MAT3&&(r=3),s.type===n.FLOAT_MAT4&&(r=4),e[o]={type:s.type,location:n.getAttribLocation(t,o),locationSize:r}}return e}function Xs(n){return n!==""}function ju(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function qu(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const O1=/^[ \t]*#include +<([\w\d./]+)>/gm;function sh(n){return n.replace(O1,H1)}const B1=new Map;function H1(n,t){let e=xe[t];if(e===void 0){const i=B1.get(t);if(i!==void 0)e=xe[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return sh(e)}const G1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ku(n){return n.replace(G1,V1)}function V1(n,t,e,i){let a="";for(let s=parseInt(t);s<parseInt(e);s++)a+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return a}function Ju(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function X1(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===hp?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===dp?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Di&&(t="SHADOWMAP_TYPE_VSM"),t}function W1(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case ys:case _s:t="ENVMAP_TYPE_CUBE";break;case Hr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Y1(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case _s:t="ENVMAP_MODE_REFRACTION";break}return t}function $1(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Sh:t="ENVMAP_BLENDING_MULTIPLY";break;case Iv:t="ENVMAP_BLENDING_MIX";break;case Fv:t="ENVMAP_BLENDING_ADD";break}return t}function Z1(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function j1(n,t,e,i){const a=n.getContext(),s=e.defines;let o=e.vertexShader,r=e.fragmentShader;const l=X1(e),c=W1(e),h=Y1(e),u=$1(e),d=Z1(e),f=z1(e),g=N1(s),_=a.createProgram();let m,p,y=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Xs).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Xs).join(`
`),p.length>0&&(p+=`
`)):(m=[Ju(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Xs).join(`
`),p=[Ju(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ea?"#define TONE_MAPPING":"",e.toneMapping!==ea?xe.tonemapping_pars_fragment:"",e.toneMapping!==ea?I1("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",xe.colorspace_pars_fragment,k1("linearToOutputTexel",e.outputColorSpace),F1(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Xs).join(`
`)),o=sh(o),o=ju(o,e),o=qu(o,e),r=sh(r),r=ju(r,e),r=qu(r,e),o=Ku(o),r=Ku(r),e.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===lu?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===lu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=y+m+o,v=y+p+r,w=Yu(a,a.VERTEX_SHADER,x),S=Yu(a,a.FRAGMENT_SHADER,v);a.attachShader(_,w),a.attachShader(_,S),e.index0AttributeName!==void 0?a.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&a.bindAttribLocation(_,0,"position"),a.linkProgram(_);function E(P){if(n.debug.checkShaderErrors){const C=a.getProgramInfoLog(_).trim(),F=a.getShaderInfoLog(w).trim(),N=a.getShaderInfoLog(S).trim();let L=!0,I=!0;if(a.getProgramParameter(_,a.LINK_STATUS)===!1)if(L=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(a,_,w,S);else{const z=Zu(a,w,"vertex"),G=Zu(a,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(_,a.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+C+`
`+z+`
`+G)}else C!==""?console.warn("THREE.WebGLProgram: Program Info Log:",C):(F===""||N==="")&&(I=!1);I&&(P.diagnostics={runnable:L,programLog:C,vertexShader:{log:F,prefix:m},fragmentShader:{log:N,prefix:p}})}a.deleteShader(w),a.deleteShader(S),A=new gr(a,_),b=U1(a,_)}let A;this.getUniforms=function(){return A===void 0&&E(this),A};let b;this.getAttributes=function(){return b===void 0&&E(this),b};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=a.getProgramParameter(_,P1)),M},this.destroy=function(){i.releaseStatesOfProgram(this),a.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=C1++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=w,this.fragmentShader=S,this}let q1=0;class K1{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,a=this._getShaderStage(e),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(a)===!1&&(o.add(a),a.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new J1(t),e.set(t,i)),i}}class J1{constructor(t){this.id=q1++,this.code=t,this.usedTimes=0}}function Q1(n,t,e,i,a,s,o){const r=new Dh,l=new K1,c=new Set,h=[],u=a.logarithmicDepthBuffer,d=a.vertexTextures;let f=a.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return c.add(b),b===0?"uv":`uv${b}`}function m(b,M,P,C,F){const N=C.fog,L=F.geometry,I=b.isMeshStandardMaterial?C.environment:null,z=(b.isMeshStandardMaterial?e:t).get(b.envMap||I),G=z&&z.mapping===Hr?z.image.height:null,$=g[b.type];b.precision!==null&&(f=a.getMaxPrecision(b.precision),f!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",f,"instead."));const et=L.morphAttributes.position||L.morphAttributes.normal||L.morphAttributes.color,ft=et!==void 0?et.length:0;let vt=0;L.morphAttributes.position!==void 0&&(vt=1),L.morphAttributes.normal!==void 0&&(vt=2),L.morphAttributes.color!==void 0&&(vt=3);let It,Y,Q,pt;if($){const te=xi[$];It=te.vertexShader,Y=te.fragmentShader}else It=b.vertexShader,Y=b.fragmentShader,l.update(b),Q=l.getVertexShaderID(b),pt=l.getFragmentShaderID(b);const at=n.getRenderTarget(),K=n.state.buffers.depth.getReversed(),Z=F.isInstancedMesh===!0,_t=F.isBatchedMesh===!0,Ft=!!b.map,ht=!!b.matcap,Pt=!!z,B=!!b.aoMap,ne=!!b.lightMap,Ot=!!b.bumpMap,Ct=!!b.normalMap,xt=!!b.displacementMap,Nt=!!b.emissiveMap,Bt=!!b.metalnessMap,k=!!b.roughnessMap,T=b.anisotropy>0,j=b.clearcoat>0,ut=b.dispersion>0,J=b.iridescence>0,ct=b.sheen>0,zt=b.transmission>0,St=T&&!!b.anisotropyMap,Mt=j&&!!b.clearcoatMap,dt=j&&!!b.clearcoatNormalMap,st=j&&!!b.clearcoatRoughnessMap,wt=J&&!!b.iridescenceMap,O=J&&!!b.iridescenceThicknessMap,ot=ct&&!!b.sheenColorMap,rt=ct&&!!b.sheenRoughnessMap,Vt=!!b.specularMap,Ht=!!b.specularColorMap,qt=!!b.specularIntensityMap,U=zt&&!!b.transmissionMap,bt=zt&&!!b.thicknessMap,tt=!!b.gradientMap,mt=!!b.alphaMap,kt=b.alphaTest>0,Lt=!!b.alphaHash,Gt=!!b.extensions;let ce=ea;b.toneMapped&&(at===null||at.isXRRenderTarget===!0)&&(ce=n.toneMapping);const ge={shaderID:$,shaderType:b.type,shaderName:b.name,vertexShader:It,fragmentShader:Y,defines:b.defines,customVertexShaderID:Q,customFragmentShaderID:pt,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:f,batching:_t,batchingColor:_t&&F._colorsTexture!==null,instancing:Z,instancingColor:Z&&F.instanceColor!==null,instancingMorph:Z&&F.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:at===null?n.outputColorSpace:at.isXRRenderTarget===!0?at.texture.colorSpace:ws,alphaToCoverage:!!b.alphaToCoverage,map:Ft,matcap:ht,envMap:Pt,envMapMode:Pt&&z.mapping,envMapCubeUVHeight:G,aoMap:B,lightMap:ne,bumpMap:Ot,normalMap:Ct,displacementMap:d&&xt,emissiveMap:Nt,normalMapObjectSpace:Ct&&b.normalMapType===Yv,normalMapTangentSpace:Ct&&b.normalMapType===Sp,metalnessMap:Bt,roughnessMap:k,anisotropy:T,anisotropyMap:St,clearcoat:j,clearcoatMap:Mt,clearcoatNormalMap:dt,clearcoatRoughnessMap:st,dispersion:ut,iridescence:J,iridescenceMap:wt,iridescenceThicknessMap:O,sheen:ct,sheenColorMap:ot,sheenRoughnessMap:rt,specularMap:Vt,specularColorMap:Ht,specularIntensityMap:qt,transmission:zt,transmissionMap:U,thicknessMap:bt,gradientMap:tt,opaque:b.transparent===!1&&b.blending===ds&&b.alphaToCoverage===!1,alphaMap:mt,alphaTest:kt,alphaHash:Lt,combine:b.combine,mapUv:Ft&&_(b.map.channel),aoMapUv:B&&_(b.aoMap.channel),lightMapUv:ne&&_(b.lightMap.channel),bumpMapUv:Ot&&_(b.bumpMap.channel),normalMapUv:Ct&&_(b.normalMap.channel),displacementMapUv:xt&&_(b.displacementMap.channel),emissiveMapUv:Nt&&_(b.emissiveMap.channel),metalnessMapUv:Bt&&_(b.metalnessMap.channel),roughnessMapUv:k&&_(b.roughnessMap.channel),anisotropyMapUv:St&&_(b.anisotropyMap.channel),clearcoatMapUv:Mt&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:dt&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:st&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:wt&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:O&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:ot&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:rt&&_(b.sheenRoughnessMap.channel),specularMapUv:Vt&&_(b.specularMap.channel),specularColorMapUv:Ht&&_(b.specularColorMap.channel),specularIntensityMapUv:qt&&_(b.specularIntensityMap.channel),transmissionMapUv:U&&_(b.transmissionMap.channel),thicknessMapUv:bt&&_(b.thicknessMap.channel),alphaMapUv:mt&&_(b.alphaMap.channel),vertexTangents:!!L.attributes.tangent&&(Ct||T),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!L.attributes.color&&L.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!L.attributes.uv&&(Ft||mt),fog:!!N,useFog:b.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:K,skinning:F.isSkinnedMesh===!0,morphTargets:L.morphAttributes.position!==void 0,morphNormals:L.morphAttributes.normal!==void 0,morphColors:L.morphAttributes.color!==void 0,morphTargetsCount:ft,morphTextureStride:vt,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:ce,decodeVideoTexture:Ft&&b.map.isVideoTexture===!0&&be.getTransfer(b.map.colorSpace)===Le,decodeVideoTextureEmissive:Nt&&b.emissiveMap.isVideoTexture===!0&&be.getTransfer(b.emissiveMap.colorSpace)===Le,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===qe,flipSided:b.side===Dn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Gt&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Gt&&b.extensions.multiDraw===!0||_t)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return ge.vertexUv1s=c.has(1),ge.vertexUv2s=c.has(2),ge.vertexUv3s=c.has(3),c.clear(),ge}function p(b){const M=[];if(b.shaderID?M.push(b.shaderID):(M.push(b.customVertexShaderID),M.push(b.customFragmentShaderID)),b.defines!==void 0)for(const P in b.defines)M.push(P),M.push(b.defines[P]);return b.isRawShaderMaterial===!1&&(y(M,b),x(M,b),M.push(n.outputColorSpace)),M.push(b.customProgramCacheKey),M.join()}function y(b,M){b.push(M.precision),b.push(M.outputColorSpace),b.push(M.envMapMode),b.push(M.envMapCubeUVHeight),b.push(M.mapUv),b.push(M.alphaMapUv),b.push(M.lightMapUv),b.push(M.aoMapUv),b.push(M.bumpMapUv),b.push(M.normalMapUv),b.push(M.displacementMapUv),b.push(M.emissiveMapUv),b.push(M.metalnessMapUv),b.push(M.roughnessMapUv),b.push(M.anisotropyMapUv),b.push(M.clearcoatMapUv),b.push(M.clearcoatNormalMapUv),b.push(M.clearcoatRoughnessMapUv),b.push(M.iridescenceMapUv),b.push(M.iridescenceThicknessMapUv),b.push(M.sheenColorMapUv),b.push(M.sheenRoughnessMapUv),b.push(M.specularMapUv),b.push(M.specularColorMapUv),b.push(M.specularIntensityMapUv),b.push(M.transmissionMapUv),b.push(M.thicknessMapUv),b.push(M.combine),b.push(M.fogExp2),b.push(M.sizeAttenuation),b.push(M.morphTargetsCount),b.push(M.morphAttributeCount),b.push(M.numDirLights),b.push(M.numPointLights),b.push(M.numSpotLights),b.push(M.numSpotLightMaps),b.push(M.numHemiLights),b.push(M.numRectAreaLights),b.push(M.numDirLightShadows),b.push(M.numPointLightShadows),b.push(M.numSpotLightShadows),b.push(M.numSpotLightShadowsWithMaps),b.push(M.numLightProbes),b.push(M.shadowMapType),b.push(M.toneMapping),b.push(M.numClippingPlanes),b.push(M.numClipIntersection),b.push(M.depthPacking)}function x(b,M){r.disableAll(),M.supportsVertexTextures&&r.enable(0),M.instancing&&r.enable(1),M.instancingColor&&r.enable(2),M.instancingMorph&&r.enable(3),M.matcap&&r.enable(4),M.envMap&&r.enable(5),M.normalMapObjectSpace&&r.enable(6),M.normalMapTangentSpace&&r.enable(7),M.clearcoat&&r.enable(8),M.iridescence&&r.enable(9),M.alphaTest&&r.enable(10),M.vertexColors&&r.enable(11),M.vertexAlphas&&r.enable(12),M.vertexUv1s&&r.enable(13),M.vertexUv2s&&r.enable(14),M.vertexUv3s&&r.enable(15),M.vertexTangents&&r.enable(16),M.anisotropy&&r.enable(17),M.alphaHash&&r.enable(18),M.batching&&r.enable(19),M.dispersion&&r.enable(20),M.batchingColor&&r.enable(21),b.push(r.mask),r.disableAll(),M.fog&&r.enable(0),M.useFog&&r.enable(1),M.flatShading&&r.enable(2),M.logarithmicDepthBuffer&&r.enable(3),M.reverseDepthBuffer&&r.enable(4),M.skinning&&r.enable(5),M.morphTargets&&r.enable(6),M.morphNormals&&r.enable(7),M.morphColors&&r.enable(8),M.premultipliedAlpha&&r.enable(9),M.shadowMapEnabled&&r.enable(10),M.doubleSided&&r.enable(11),M.flipSided&&r.enable(12),M.useDepthPacking&&r.enable(13),M.dithering&&r.enable(14),M.transmission&&r.enable(15),M.sheen&&r.enable(16),M.opaque&&r.enable(17),M.pointsUvs&&r.enable(18),M.decodeVideoTexture&&r.enable(19),M.decodeVideoTextureEmissive&&r.enable(20),M.alphaToCoverage&&r.enable(21),b.push(r.mask)}function v(b){const M=g[b.type];let P;if(M){const C=xi[M];P=zy.clone(C.uniforms)}else P=b.uniforms;return P}function w(b,M){let P;for(let C=0,F=h.length;C<F;C++){const N=h[C];if(N.cacheKey===M){P=N,++P.usedTimes;break}}return P===void 0&&(P=new j1(n,M,b,s),h.push(P)),P}function S(b){if(--b.usedTimes===0){const M=h.indexOf(b);h[M]=h[h.length-1],h.pop(),b.destroy()}}function E(b){l.remove(b)}function A(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:v,acquireProgram:w,releaseProgram:S,releaseShaderCache:E,programs:h,dispose:A}}function tS(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let r=n.get(o);return r===void 0&&(r={},n.set(o,r)),r}function i(o){n.delete(o)}function a(o,r,l){n.get(o)[r]=l}function s(){n=new WeakMap}return{has:t,get:e,remove:i,update:a,dispose:s}}function eS(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Qu(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function tf(){const n=[];let t=0;const e=[],i=[],a=[];function s(){t=0,e.length=0,i.length=0,a.length=0}function o(u,d,f,g,_,m){let p=n[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},n[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=_,p.group=m),t++,p}function r(u,d,f,g,_,m){const p=o(u,d,f,g,_,m);f.transmission>0?i.push(p):f.transparent===!0?a.push(p):e.push(p)}function l(u,d,f,g,_,m){const p=o(u,d,f,g,_,m);f.transmission>0?i.unshift(p):f.transparent===!0?a.unshift(p):e.unshift(p)}function c(u,d){e.length>1&&e.sort(u||eS),i.length>1&&i.sort(d||Qu),a.length>1&&a.sort(d||Qu)}function h(){for(let u=t,d=n.length;u<d;u++){const f=n[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:i,transparent:a,init:s,push:r,unshift:l,finish:h,sort:c}}function nS(){let n=new WeakMap;function t(i,a){const s=n.get(i);let o;return s===void 0?(o=new tf,n.set(i,[o])):a>=s.length?(o=new tf,s.push(o)):o=s[a],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function iS(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new H,color:new se};break;case"SpotLight":e={position:new H,direction:new H,color:new se,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new H,color:new se,distance:0,decay:0};break;case"HemisphereLight":e={direction:new H,skyColor:new se,groundColor:new se};break;case"RectAreaLight":e={color:new se,position:new H,halfWidth:new H,halfHeight:new H};break}return n[t.id]=e,e}}}function aS(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Yt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Yt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Yt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let sS=0;function oS(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function rS(n){const t=new iS,e=aS(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new H);const a=new H,s=new Ue,o=new Ue;function r(c){let h=0,u=0,d=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,y=0,x=0,v=0,w=0,S=0,E=0;c.sort(oS);for(let b=0,M=c.length;b<M;b++){const P=c[b],C=P.color,F=P.intensity,N=P.distance,L=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=C.r*F,u+=C.g*F,d+=C.b*F;else if(P.isLightProbe){for(let I=0;I<9;I++)i.probe[I].addScaledVector(P.sh.coefficients[I],F);E++}else if(P.isDirectionalLight){const I=t.get(P);if(I.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const z=P.shadow,G=e.get(P);G.shadowIntensity=z.intensity,G.shadowBias=z.bias,G.shadowNormalBias=z.normalBias,G.shadowRadius=z.radius,G.shadowMapSize=z.mapSize,i.directionalShadow[f]=G,i.directionalShadowMap[f]=L,i.directionalShadowMatrix[f]=P.shadow.matrix,y++}i.directional[f]=I,f++}else if(P.isSpotLight){const I=t.get(P);I.position.setFromMatrixPosition(P.matrixWorld),I.color.copy(C).multiplyScalar(F),I.distance=N,I.coneCos=Math.cos(P.angle),I.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),I.decay=P.decay,i.spot[_]=I;const z=P.shadow;if(P.map&&(i.spotLightMap[w]=P.map,w++,z.updateMatrices(P),P.castShadow&&S++),i.spotLightMatrix[_]=z.matrix,P.castShadow){const G=e.get(P);G.shadowIntensity=z.intensity,G.shadowBias=z.bias,G.shadowNormalBias=z.normalBias,G.shadowRadius=z.radius,G.shadowMapSize=z.mapSize,i.spotShadow[_]=G,i.spotShadowMap[_]=L,v++}_++}else if(P.isRectAreaLight){const I=t.get(P);I.color.copy(C).multiplyScalar(F),I.halfWidth.set(P.width*.5,0,0),I.halfHeight.set(0,P.height*.5,0),i.rectArea[m]=I,m++}else if(P.isPointLight){const I=t.get(P);if(I.color.copy(P.color).multiplyScalar(P.intensity),I.distance=P.distance,I.decay=P.decay,P.castShadow){const z=P.shadow,G=e.get(P);G.shadowIntensity=z.intensity,G.shadowBias=z.bias,G.shadowNormalBias=z.normalBias,G.shadowRadius=z.radius,G.shadowMapSize=z.mapSize,G.shadowCameraNear=z.camera.near,G.shadowCameraFar=z.camera.far,i.pointShadow[g]=G,i.pointShadowMap[g]=L,i.pointShadowMatrix[g]=P.shadow.matrix,x++}i.point[g]=I,g++}else if(P.isHemisphereLight){const I=t.get(P);I.skyColor.copy(P.color).multiplyScalar(F),I.groundColor.copy(P.groundColor).multiplyScalar(F),i.hemi[p]=I,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Xt.LTC_FLOAT_1,i.rectAreaLTC2=Xt.LTC_FLOAT_2):(i.rectAreaLTC1=Xt.LTC_HALF_1,i.rectAreaLTC2=Xt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=d;const A=i.hash;(A.directionalLength!==f||A.pointLength!==g||A.spotLength!==_||A.rectAreaLength!==m||A.hemiLength!==p||A.numDirectionalShadows!==y||A.numPointShadows!==x||A.numSpotShadows!==v||A.numSpotMaps!==w||A.numLightProbes!==E)&&(i.directional.length=f,i.spot.length=_,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=v+w-S,i.spotLightMap.length=w,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=E,A.directionalLength=f,A.pointLength=g,A.spotLength=_,A.rectAreaLength=m,A.hemiLength=p,A.numDirectionalShadows=y,A.numPointShadows=x,A.numSpotShadows=v,A.numSpotMaps=w,A.numLightProbes=E,i.version=sS++)}function l(c,h){let u=0,d=0,f=0,g=0,_=0;const m=h.matrixWorldInverse;for(let p=0,y=c.length;p<y;p++){const x=c[p];if(x.isDirectionalLight){const v=i.directional[u];v.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(a),v.direction.transformDirection(m),u++}else if(x.isSpotLight){const v=i.spot[f];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(a),v.direction.transformDirection(m),f++}else if(x.isRectAreaLight){const v=i.rectArea[g];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(m),o.identity(),s.copy(x.matrixWorld),s.premultiply(m),o.extractRotation(s),v.halfWidth.set(x.width*.5,0,0),v.halfHeight.set(0,x.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),g++}else if(x.isPointLight){const v=i.point[d];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(m),d++}else if(x.isHemisphereLight){const v=i.hemi[_];v.direction.setFromMatrixPosition(x.matrixWorld),v.direction.transformDirection(m),_++}}}return{setup:r,setupView:l,state:i}}function ef(n){const t=new rS(n),e=[],i=[];function a(h){c.camera=h,e.length=0,i.length=0}function s(h){e.push(h)}function o(h){i.push(h)}function r(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:a,state:c,setupLights:r,setupLightsView:l,pushLight:s,pushShadow:o}}function cS(n){let t=new WeakMap;function e(a,s=0){const o=t.get(a);let r;return o===void 0?(r=new ef(n),t.set(a,[r])):s>=o.length?(r=new ef(n),o.push(r)):r=o[s],r}function i(){t=new WeakMap}return{get:e,dispose:i}}class lS extends La{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Xv,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class hS extends La{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const dS=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,uS=`uniform sampler2D shadow_pass;
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
}`;function fS(n,t,e){let i=new kh;const a=new Yt,s=new Yt,o=new Ke,r=new lS({depthPacking:Wv}),l=new hS,c={},h=e.maxTextureSize,u={[ia]:Dn,[Dn]:ia,[qe]:qe},d=new aa({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Yt},radius:{value:4}},vertexShader:dS,fragmentShader:uS}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new sn;g.setAttribute("position",new mn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new _e(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=hp;let p=this.type;this.render=function(S,E,A){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;const b=n.getRenderTarget(),M=n.getActiveCubeFace(),P=n.getActiveMipmapLevel(),C=n.state;C.setBlending(ta),C.buffers.color.setClear(1,1,1,1),C.buffers.depth.setTest(!0),C.setScissorTest(!1);const F=p!==Di&&this.type===Di,N=p===Di&&this.type!==Di;for(let L=0,I=S.length;L<I;L++){const z=S[L],G=z.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",z,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;a.copy(G.mapSize);const $=G.getFrameExtents();if(a.multiply($),s.copy(G.mapSize),(a.x>h||a.y>h)&&(a.x>h&&(s.x=Math.floor(h/$.x),a.x=s.x*$.x,G.mapSize.x=s.x),a.y>h&&(s.y=Math.floor(h/$.y),a.y=s.y*$.y,G.mapSize.y=s.y)),G.map===null||F===!0||N===!0){const ft=this.type!==Di?{minFilter:ci,magFilter:ci}:{};G.map!==null&&G.map.dispose(),G.map=new Pa(a.x,a.y,ft),G.map.texture.name=z.name+".shadowMap",G.camera.updateProjectionMatrix()}n.setRenderTarget(G.map),n.clear();const et=G.getViewportCount();for(let ft=0;ft<et;ft++){const vt=G.getViewport(ft);o.set(s.x*vt.x,s.y*vt.y,s.x*vt.z,s.y*vt.w),C.viewport(o),G.updateMatrices(z,ft),i=G.getFrustum(),v(E,A,G.camera,z,this.type)}G.isPointLightShadow!==!0&&this.type===Di&&y(G,A),G.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(b,M,P)};function y(S,E){const A=t.update(_);d.defines.VSM_SAMPLES!==S.blurSamples&&(d.defines.VSM_SAMPLES=S.blurSamples,f.defines.VSM_SAMPLES=S.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new Pa(a.x,a.y)),d.uniforms.shadow_pass.value=S.map.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,n.setRenderTarget(S.mapPass),n.clear(),n.renderBufferDirect(E,null,A,d,_,null),f.uniforms.shadow_pass.value=S.mapPass.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,n.setRenderTarget(S.map),n.clear(),n.renderBufferDirect(E,null,A,f,_,null)}function x(S,E,A,b){let M=null;const P=A.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(P!==void 0)M=P;else if(M=A.isPointLight===!0?l:r,n.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const C=M.uuid,F=E.uuid;let N=c[C];N===void 0&&(N={},c[C]=N);let L=N[F];L===void 0&&(L=M.clone(),N[F]=L,E.addEventListener("dispose",w)),M=L}if(M.visible=E.visible,M.wireframe=E.wireframe,b===Di?M.side=E.shadowSide!==null?E.shadowSide:E.side:M.side=E.shadowSide!==null?E.shadowSide:u[E.side],M.alphaMap=E.alphaMap,M.alphaTest=E.alphaTest,M.map=E.map,M.clipShadows=E.clipShadows,M.clippingPlanes=E.clippingPlanes,M.clipIntersection=E.clipIntersection,M.displacementMap=E.displacementMap,M.displacementScale=E.displacementScale,M.displacementBias=E.displacementBias,M.wireframeLinewidth=E.wireframeLinewidth,M.linewidth=E.linewidth,A.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const C=n.properties.get(M);C.light=A}return M}function v(S,E,A,b,M){if(S.visible===!1)return;if(S.layers.test(E.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&M===Di)&&(!S.frustumCulled||i.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,S.matrixWorld);const F=t.update(S),N=S.material;if(Array.isArray(N)){const L=F.groups;for(let I=0,z=L.length;I<z;I++){const G=L[I],$=N[G.materialIndex];if($&&$.visible){const et=x(S,$,b,M);S.onBeforeShadow(n,S,E,A,F,et,G),n.renderBufferDirect(A,null,F,et,S,G),S.onAfterShadow(n,S,E,A,F,et,G)}}}else if(N.visible){const L=x(S,N,b,M);S.onBeforeShadow(n,S,E,A,F,L,null),n.renderBufferDirect(A,null,F,L,S,null),S.onAfterShadow(n,S,E,A,F,L,null)}}const C=S.children;for(let F=0,N=C.length;F<N;F++)v(C[F],E,A,b,M)}function w(S){S.target.removeEventListener("dispose",w);for(const A in c){const b=c[A],M=S.target.uuid;M in b&&(b[M].dispose(),delete b[M])}}}const pS={[Ml]:bl,[Sl]:Tl,[wl]:Al,[vs]:El,[bl]:Ml,[Tl]:Sl,[Al]:wl,[El]:vs};function mS(n,t){function e(){let U=!1;const bt=new Ke;let tt=null;const mt=new Ke(0,0,0,0);return{setMask:function(kt){tt!==kt&&!U&&(n.colorMask(kt,kt,kt,kt),tt=kt)},setLocked:function(kt){U=kt},setClear:function(kt,Lt,Gt,ce,ge){ge===!0&&(kt*=ce,Lt*=ce,Gt*=ce),bt.set(kt,Lt,Gt,ce),mt.equals(bt)===!1&&(n.clearColor(kt,Lt,Gt,ce),mt.copy(bt))},reset:function(){U=!1,tt=null,mt.set(-1,0,0,0)}}}function i(){let U=!1,bt=!1,tt=null,mt=null,kt=null;return{setReversed:function(Lt){if(bt!==Lt){const Gt=t.get("EXT_clip_control");bt?Gt.clipControlEXT(Gt.LOWER_LEFT_EXT,Gt.ZERO_TO_ONE_EXT):Gt.clipControlEXT(Gt.LOWER_LEFT_EXT,Gt.NEGATIVE_ONE_TO_ONE_EXT);const ce=kt;kt=null,this.setClear(ce)}bt=Lt},getReversed:function(){return bt},setTest:function(Lt){Lt?at(n.DEPTH_TEST):K(n.DEPTH_TEST)},setMask:function(Lt){tt!==Lt&&!U&&(n.depthMask(Lt),tt=Lt)},setFunc:function(Lt){if(bt&&(Lt=pS[Lt]),mt!==Lt){switch(Lt){case Ml:n.depthFunc(n.NEVER);break;case bl:n.depthFunc(n.ALWAYS);break;case Sl:n.depthFunc(n.LESS);break;case vs:n.depthFunc(n.LEQUAL);break;case wl:n.depthFunc(n.EQUAL);break;case El:n.depthFunc(n.GEQUAL);break;case Tl:n.depthFunc(n.GREATER);break;case Al:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}mt=Lt}},setLocked:function(Lt){U=Lt},setClear:function(Lt){kt!==Lt&&(bt&&(Lt=1-Lt),n.clearDepth(Lt),kt=Lt)},reset:function(){U=!1,tt=null,mt=null,kt=null,bt=!1}}}function a(){let U=!1,bt=null,tt=null,mt=null,kt=null,Lt=null,Gt=null,ce=null,ge=null;return{setTest:function(te){U||(te?at(n.STENCIL_TEST):K(n.STENCIL_TEST))},setMask:function(te){bt!==te&&!U&&(n.stencilMask(te),bt=te)},setFunc:function(te,we,Be){(tt!==te||mt!==we||kt!==Be)&&(n.stencilFunc(te,we,Be),tt=te,mt=we,kt=Be)},setOp:function(te,we,Be){(Lt!==te||Gt!==we||ce!==Be)&&(n.stencilOp(te,we,Be),Lt=te,Gt=we,ce=Be)},setLocked:function(te){U=te},setClear:function(te){ge!==te&&(n.clearStencil(te),ge=te)},reset:function(){U=!1,bt=null,tt=null,mt=null,kt=null,Lt=null,Gt=null,ce=null,ge=null}}}const s=new e,o=new i,r=new a,l=new WeakMap,c=new WeakMap;let h={},u={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,y=null,x=null,v=null,w=null,S=null,E=new se(0,0,0),A=0,b=!1,M=null,P=null,C=null,F=null,N=null;const L=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let I=!1,z=0;const G=n.getParameter(n.VERSION);G.indexOf("WebGL")!==-1?(z=parseFloat(/^WebGL (\d)/.exec(G)[1]),I=z>=1):G.indexOf("OpenGL ES")!==-1&&(z=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),I=z>=2);let $=null,et={};const ft=n.getParameter(n.SCISSOR_BOX),vt=n.getParameter(n.VIEWPORT),It=new Ke().fromArray(ft),Y=new Ke().fromArray(vt);function Q(U,bt,tt,mt){const kt=new Uint8Array(4),Lt=n.createTexture();n.bindTexture(U,Lt),n.texParameteri(U,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(U,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Gt=0;Gt<tt;Gt++)U===n.TEXTURE_3D||U===n.TEXTURE_2D_ARRAY?n.texImage3D(bt,0,n.RGBA,1,1,mt,0,n.RGBA,n.UNSIGNED_BYTE,kt):n.texImage2D(bt+Gt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,kt);return Lt}const pt={};pt[n.TEXTURE_2D]=Q(n.TEXTURE_2D,n.TEXTURE_2D,1),pt[n.TEXTURE_CUBE_MAP]=Q(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),pt[n.TEXTURE_2D_ARRAY]=Q(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),pt[n.TEXTURE_3D]=Q(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),r.setClear(0),at(n.DEPTH_TEST),o.setFunc(vs),Ot(!1),Ct(au),at(n.CULL_FACE),B(ta);function at(U){h[U]!==!0&&(n.enable(U),h[U]=!0)}function K(U){h[U]!==!1&&(n.disable(U),h[U]=!1)}function Z(U,bt){return u[U]!==bt?(n.bindFramebuffer(U,bt),u[U]=bt,U===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=bt),U===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=bt),!0):!1}function _t(U,bt){let tt=f,mt=!1;if(U){tt=d.get(bt),tt===void 0&&(tt=[],d.set(bt,tt));const kt=U.textures;if(tt.length!==kt.length||tt[0]!==n.COLOR_ATTACHMENT0){for(let Lt=0,Gt=kt.length;Lt<Gt;Lt++)tt[Lt]=n.COLOR_ATTACHMENT0+Lt;tt.length=kt.length,mt=!0}}else tt[0]!==n.BACK&&(tt[0]=n.BACK,mt=!0);mt&&n.drawBuffers(tt)}function Ft(U){return g!==U?(n.useProgram(U),g=U,!0):!1}const ht={[Sa]:n.FUNC_ADD,[xv]:n.FUNC_SUBTRACT,[vv]:n.FUNC_REVERSE_SUBTRACT};ht[yv]=n.MIN,ht[_v]=n.MAX;const Pt={[Mv]:n.ZERO,[bv]:n.ONE,[Sv]:n.SRC_COLOR,[yl]:n.SRC_ALPHA,[Pv]:n.SRC_ALPHA_SATURATE,[Av]:n.DST_COLOR,[Ev]:n.DST_ALPHA,[wv]:n.ONE_MINUS_SRC_COLOR,[_l]:n.ONE_MINUS_SRC_ALPHA,[Rv]:n.ONE_MINUS_DST_COLOR,[Tv]:n.ONE_MINUS_DST_ALPHA,[Cv]:n.CONSTANT_COLOR,[Lv]:n.ONE_MINUS_CONSTANT_COLOR,[Dv]:n.CONSTANT_ALPHA,[kv]:n.ONE_MINUS_CONSTANT_ALPHA};function B(U,bt,tt,mt,kt,Lt,Gt,ce,ge,te){if(U===ta){_===!0&&(K(n.BLEND),_=!1);return}if(_===!1&&(at(n.BLEND),_=!0),U!==gv){if(U!==m||te!==b){if((p!==Sa||v!==Sa)&&(n.blendEquation(n.FUNC_ADD),p=Sa,v=Sa),te)switch(U){case ds:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ki:n.blendFunc(n.ONE,n.ONE);break;case su:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case ou:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case ds:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ki:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case su:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case ou:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}y=null,x=null,w=null,S=null,E.set(0,0,0),A=0,m=U,b=te}return}kt=kt||bt,Lt=Lt||tt,Gt=Gt||mt,(bt!==p||kt!==v)&&(n.blendEquationSeparate(ht[bt],ht[kt]),p=bt,v=kt),(tt!==y||mt!==x||Lt!==w||Gt!==S)&&(n.blendFuncSeparate(Pt[tt],Pt[mt],Pt[Lt],Pt[Gt]),y=tt,x=mt,w=Lt,S=Gt),(ce.equals(E)===!1||ge!==A)&&(n.blendColor(ce.r,ce.g,ce.b,ge),E.copy(ce),A=ge),m=U,b=!1}function ne(U,bt){U.side===qe?K(n.CULL_FACE):at(n.CULL_FACE);let tt=U.side===Dn;bt&&(tt=!tt),Ot(tt),U.blending===ds&&U.transparent===!1?B(ta):B(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),o.setFunc(U.depthFunc),o.setTest(U.depthTest),o.setMask(U.depthWrite),s.setMask(U.colorWrite);const mt=U.stencilWrite;r.setTest(mt),mt&&(r.setMask(U.stencilWriteMask),r.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),r.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),Nt(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?at(n.SAMPLE_ALPHA_TO_COVERAGE):K(n.SAMPLE_ALPHA_TO_COVERAGE)}function Ot(U){M!==U&&(U?n.frontFace(n.CW):n.frontFace(n.CCW),M=U)}function Ct(U){U!==pv?(at(n.CULL_FACE),U!==P&&(U===au?n.cullFace(n.BACK):U===mv?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):K(n.CULL_FACE),P=U}function xt(U){U!==C&&(I&&n.lineWidth(U),C=U)}function Nt(U,bt,tt){U?(at(n.POLYGON_OFFSET_FILL),(F!==bt||N!==tt)&&(n.polygonOffset(bt,tt),F=bt,N=tt)):K(n.POLYGON_OFFSET_FILL)}function Bt(U){U?at(n.SCISSOR_TEST):K(n.SCISSOR_TEST)}function k(U){U===void 0&&(U=n.TEXTURE0+L-1),$!==U&&(n.activeTexture(U),$=U)}function T(U,bt,tt){tt===void 0&&($===null?tt=n.TEXTURE0+L-1:tt=$);let mt=et[tt];mt===void 0&&(mt={type:void 0,texture:void 0},et[tt]=mt),(mt.type!==U||mt.texture!==bt)&&($!==tt&&(n.activeTexture(tt),$=tt),n.bindTexture(U,bt||pt[U]),mt.type=U,mt.texture=bt)}function j(){const U=et[$];U!==void 0&&U.type!==void 0&&(n.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function ut(){try{n.compressedTexImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function J(){try{n.compressedTexImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ct(){try{n.texSubImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function zt(){try{n.texSubImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function St(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Mt(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function dt(){try{n.texStorage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function st(){try{n.texStorage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function wt(){try{n.texImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function O(){try{n.texImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ot(U){It.equals(U)===!1&&(n.scissor(U.x,U.y,U.z,U.w),It.copy(U))}function rt(U){Y.equals(U)===!1&&(n.viewport(U.x,U.y,U.z,U.w),Y.copy(U))}function Vt(U,bt){let tt=c.get(bt);tt===void 0&&(tt=new WeakMap,c.set(bt,tt));let mt=tt.get(U);mt===void 0&&(mt=n.getUniformBlockIndex(bt,U.name),tt.set(U,mt))}function Ht(U,bt){const mt=c.get(bt).get(U);l.get(bt)!==mt&&(n.uniformBlockBinding(bt,mt,U.__bindingPointIndex),l.set(bt,mt))}function qt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},$=null,et={},u={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,y=null,x=null,v=null,w=null,S=null,E=new se(0,0,0),A=0,b=!1,M=null,P=null,C=null,F=null,N=null,It.set(0,0,n.canvas.width,n.canvas.height),Y.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),r.reset()}return{buffers:{color:s,depth:o,stencil:r},enable:at,disable:K,bindFramebuffer:Z,drawBuffers:_t,useProgram:Ft,setBlending:B,setMaterial:ne,setFlipSided:Ot,setCullFace:Ct,setLineWidth:xt,setPolygonOffset:Nt,setScissorTest:Bt,activeTexture:k,bindTexture:T,unbindTexture:j,compressedTexImage2D:ut,compressedTexImage3D:J,texImage2D:wt,texImage3D:O,updateUBOMapping:Vt,uniformBlockBinding:Ht,texStorage2D:dt,texStorage3D:st,texSubImage2D:ct,texSubImage3D:zt,compressedTexSubImage2D:St,compressedTexSubImage3D:Mt,scissor:ot,viewport:rt,reset:qt}}function nf(n,t,e,i){const a=gS(i);switch(e){case gp:return n*t;case vp:return n*t;case yp:return n*t*2;case _p:return n*t/a.components*a.byteLength;case Ah:return n*t/a.components*a.byteLength;case Mp:return n*t*2/a.components*a.byteLength;case Rh:return n*t*2/a.components*a.byteLength;case xp:return n*t*3/a.components*a.byteLength;case ri:return n*t*4/a.components*a.byteLength;case Ph:return n*t*4/a.components*a.byteLength;case dr:case ur:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case fr:case pr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case kl:case Fl:return Math.max(n,16)*Math.max(t,8)/4;case Dl:case Il:return Math.max(n,8)*Math.max(t,8)/2;case zl:case Nl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Ul:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Ol:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Bl:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case Hl:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case Gl:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case Vl:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case Xl:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Wl:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Yl:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case $l:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Zl:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case jl:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case ql:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case Kl:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Jl:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case mr:case Ql:case th:return Math.ceil(n/4)*Math.ceil(t/4)*16;case bp:case eh:return Math.ceil(n/4)*Math.ceil(t/4)*8;case nh:case ih:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function gS(n){switch(n){case Ui:case fp:return{byteLength:1,components:1};case ao:case pp:case fo:return{byteLength:2,components:1};case Eh:case Th:return{byteLength:2,components:4};case Ra:case wh:case Fi:return{byteLength:4,components:1};case mp:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function xS(n,t,e,i,a,s,o){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Yt,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(k,T){return f?new OffscreenCanvas(k,T):Cr("canvas")}function _(k,T,j){let ut=1;const J=Bt(k);if((J.width>j||J.height>j)&&(ut=j/Math.max(J.width,J.height)),ut<1)if(typeof HTMLImageElement<"u"&&k instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&k instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&k instanceof ImageBitmap||typeof VideoFrame<"u"&&k instanceof VideoFrame){const ct=Math.floor(ut*J.width),zt=Math.floor(ut*J.height);u===void 0&&(u=g(ct,zt));const St=T?g(ct,zt):u;return St.width=ct,St.height=zt,St.getContext("2d").drawImage(k,0,0,ct,zt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+ct+"x"+zt+")."),St}else return"data"in k&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),k;return k}function m(k){return k.generateMipmaps}function p(k){n.generateMipmap(k)}function y(k){return k.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:k.isWebGL3DRenderTarget?n.TEXTURE_3D:k.isWebGLArrayRenderTarget||k.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(k,T,j,ut,J=!1){if(k!==null){if(n[k]!==void 0)return n[k];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+k+"'")}let ct=T;if(T===n.RED&&(j===n.FLOAT&&(ct=n.R32F),j===n.HALF_FLOAT&&(ct=n.R16F),j===n.UNSIGNED_BYTE&&(ct=n.R8)),T===n.RED_INTEGER&&(j===n.UNSIGNED_BYTE&&(ct=n.R8UI),j===n.UNSIGNED_SHORT&&(ct=n.R16UI),j===n.UNSIGNED_INT&&(ct=n.R32UI),j===n.BYTE&&(ct=n.R8I),j===n.SHORT&&(ct=n.R16I),j===n.INT&&(ct=n.R32I)),T===n.RG&&(j===n.FLOAT&&(ct=n.RG32F),j===n.HALF_FLOAT&&(ct=n.RG16F),j===n.UNSIGNED_BYTE&&(ct=n.RG8)),T===n.RG_INTEGER&&(j===n.UNSIGNED_BYTE&&(ct=n.RG8UI),j===n.UNSIGNED_SHORT&&(ct=n.RG16UI),j===n.UNSIGNED_INT&&(ct=n.RG32UI),j===n.BYTE&&(ct=n.RG8I),j===n.SHORT&&(ct=n.RG16I),j===n.INT&&(ct=n.RG32I)),T===n.RGB_INTEGER&&(j===n.UNSIGNED_BYTE&&(ct=n.RGB8UI),j===n.UNSIGNED_SHORT&&(ct=n.RGB16UI),j===n.UNSIGNED_INT&&(ct=n.RGB32UI),j===n.BYTE&&(ct=n.RGB8I),j===n.SHORT&&(ct=n.RGB16I),j===n.INT&&(ct=n.RGB32I)),T===n.RGBA_INTEGER&&(j===n.UNSIGNED_BYTE&&(ct=n.RGBA8UI),j===n.UNSIGNED_SHORT&&(ct=n.RGBA16UI),j===n.UNSIGNED_INT&&(ct=n.RGBA32UI),j===n.BYTE&&(ct=n.RGBA8I),j===n.SHORT&&(ct=n.RGBA16I),j===n.INT&&(ct=n.RGBA32I)),T===n.RGB&&j===n.UNSIGNED_INT_5_9_9_9_REV&&(ct=n.RGB9_E5),T===n.RGBA){const zt=J?Gr:be.getTransfer(ut);j===n.FLOAT&&(ct=n.RGBA32F),j===n.HALF_FLOAT&&(ct=n.RGBA16F),j===n.UNSIGNED_BYTE&&(ct=zt===Le?n.SRGB8_ALPHA8:n.RGBA8),j===n.UNSIGNED_SHORT_4_4_4_4&&(ct=n.RGBA4),j===n.UNSIGNED_SHORT_5_5_5_1&&(ct=n.RGB5_A1)}return(ct===n.R16F||ct===n.R32F||ct===n.RG16F||ct===n.RG32F||ct===n.RGBA16F||ct===n.RGBA32F)&&t.get("EXT_color_buffer_float"),ct}function v(k,T){let j;return k?T===null||T===Ra||T===Ms?j=n.DEPTH24_STENCIL8:T===Fi?j=n.DEPTH32F_STENCIL8:T===ao&&(j=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===Ra||T===Ms?j=n.DEPTH_COMPONENT24:T===Fi?j=n.DEPTH_COMPONENT32F:T===ao&&(j=n.DEPTH_COMPONENT16),j}function w(k,T){return m(k)===!0||k.isFramebufferTexture&&k.minFilter!==ci&&k.minFilter!==vi?Math.log2(Math.max(T.width,T.height))+1:k.mipmaps!==void 0&&k.mipmaps.length>0?k.mipmaps.length:k.isCompressedTexture&&Array.isArray(k.image)?T.mipmaps.length:1}function S(k){const T=k.target;T.removeEventListener("dispose",S),A(T),T.isVideoTexture&&h.delete(T)}function E(k){const T=k.target;T.removeEventListener("dispose",E),M(T)}function A(k){const T=i.get(k);if(T.__webglInit===void 0)return;const j=k.source,ut=d.get(j);if(ut){const J=ut[T.__cacheKey];J.usedTimes--,J.usedTimes===0&&b(k),Object.keys(ut).length===0&&d.delete(j)}i.remove(k)}function b(k){const T=i.get(k);n.deleteTexture(T.__webglTexture);const j=k.source,ut=d.get(j);delete ut[T.__cacheKey],o.memory.textures--}function M(k){const T=i.get(k);if(k.depthTexture&&(k.depthTexture.dispose(),i.remove(k.depthTexture)),k.isWebGLCubeRenderTarget)for(let ut=0;ut<6;ut++){if(Array.isArray(T.__webglFramebuffer[ut]))for(let J=0;J<T.__webglFramebuffer[ut].length;J++)n.deleteFramebuffer(T.__webglFramebuffer[ut][J]);else n.deleteFramebuffer(T.__webglFramebuffer[ut]);T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer[ut])}else{if(Array.isArray(T.__webglFramebuffer))for(let ut=0;ut<T.__webglFramebuffer.length;ut++)n.deleteFramebuffer(T.__webglFramebuffer[ut]);else n.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&n.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let ut=0;ut<T.__webglColorRenderbuffer.length;ut++)T.__webglColorRenderbuffer[ut]&&n.deleteRenderbuffer(T.__webglColorRenderbuffer[ut]);T.__webglDepthRenderbuffer&&n.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const j=k.textures;for(let ut=0,J=j.length;ut<J;ut++){const ct=i.get(j[ut]);ct.__webglTexture&&(n.deleteTexture(ct.__webglTexture),o.memory.textures--),i.remove(j[ut])}i.remove(k)}let P=0;function C(){P=0}function F(){const k=P;return k>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+k+" texture units while this GPU supports only "+a.maxTextures),P+=1,k}function N(k){const T=[];return T.push(k.wrapS),T.push(k.wrapT),T.push(k.wrapR||0),T.push(k.magFilter),T.push(k.minFilter),T.push(k.anisotropy),T.push(k.internalFormat),T.push(k.format),T.push(k.type),T.push(k.generateMipmaps),T.push(k.premultiplyAlpha),T.push(k.flipY),T.push(k.unpackAlignment),T.push(k.colorSpace),T.join()}function L(k,T){const j=i.get(k);if(k.isVideoTexture&&xt(k),k.isRenderTargetTexture===!1&&k.version>0&&j.__version!==k.version){const ut=k.image;if(ut===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ut.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(j,k,T);return}}e.bindTexture(n.TEXTURE_2D,j.__webglTexture,n.TEXTURE0+T)}function I(k,T){const j=i.get(k);if(k.version>0&&j.__version!==k.version){Y(j,k,T);return}e.bindTexture(n.TEXTURE_2D_ARRAY,j.__webglTexture,n.TEXTURE0+T)}function z(k,T){const j=i.get(k);if(k.version>0&&j.__version!==k.version){Y(j,k,T);return}e.bindTexture(n.TEXTURE_3D,j.__webglTexture,n.TEXTURE0+T)}function G(k,T){const j=i.get(k);if(k.version>0&&j.__version!==k.version){Q(j,k,T);return}e.bindTexture(n.TEXTURE_CUBE_MAP,j.__webglTexture,n.TEXTURE0+T)}const $={[Cl]:n.REPEAT,[Ea]:n.CLAMP_TO_EDGE,[Ll]:n.MIRRORED_REPEAT},et={[ci]:n.NEAREST,[Vv]:n.NEAREST_MIPMAP_NEAREST,[Lo]:n.NEAREST_MIPMAP_LINEAR,[vi]:n.LINEAR,[Mc]:n.LINEAR_MIPMAP_NEAREST,[Ta]:n.LINEAR_MIPMAP_LINEAR},ft={[$v]:n.NEVER,[Qv]:n.ALWAYS,[Zv]:n.LESS,[wp]:n.LEQUAL,[jv]:n.EQUAL,[Jv]:n.GEQUAL,[qv]:n.GREATER,[Kv]:n.NOTEQUAL};function vt(k,T){if(T.type===Fi&&t.has("OES_texture_float_linear")===!1&&(T.magFilter===vi||T.magFilter===Mc||T.magFilter===Lo||T.magFilter===Ta||T.minFilter===vi||T.minFilter===Mc||T.minFilter===Lo||T.minFilter===Ta)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(k,n.TEXTURE_WRAP_S,$[T.wrapS]),n.texParameteri(k,n.TEXTURE_WRAP_T,$[T.wrapT]),(k===n.TEXTURE_3D||k===n.TEXTURE_2D_ARRAY)&&n.texParameteri(k,n.TEXTURE_WRAP_R,$[T.wrapR]),n.texParameteri(k,n.TEXTURE_MAG_FILTER,et[T.magFilter]),n.texParameteri(k,n.TEXTURE_MIN_FILTER,et[T.minFilter]),T.compareFunction&&(n.texParameteri(k,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(k,n.TEXTURE_COMPARE_FUNC,ft[T.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===ci||T.minFilter!==Lo&&T.minFilter!==Ta||T.type===Fi&&t.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||i.get(T).__currentAnisotropy){const j=t.get("EXT_texture_filter_anisotropic");n.texParameterf(k,j.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,a.getMaxAnisotropy())),i.get(T).__currentAnisotropy=T.anisotropy}}}function It(k,T){let j=!1;k.__webglInit===void 0&&(k.__webglInit=!0,T.addEventListener("dispose",S));const ut=T.source;let J=d.get(ut);J===void 0&&(J={},d.set(ut,J));const ct=N(T);if(ct!==k.__cacheKey){J[ct]===void 0&&(J[ct]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,j=!0),J[ct].usedTimes++;const zt=J[k.__cacheKey];zt!==void 0&&(J[k.__cacheKey].usedTimes--,zt.usedTimes===0&&b(T)),k.__cacheKey=ct,k.__webglTexture=J[ct].texture}return j}function Y(k,T,j){let ut=n.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(ut=n.TEXTURE_2D_ARRAY),T.isData3DTexture&&(ut=n.TEXTURE_3D);const J=It(k,T),ct=T.source;e.bindTexture(ut,k.__webglTexture,n.TEXTURE0+j);const zt=i.get(ct);if(ct.version!==zt.__version||J===!0){e.activeTexture(n.TEXTURE0+j);const St=be.getPrimaries(be.workingColorSpace),Mt=T.colorSpace===qi?null:be.getPrimaries(T.colorSpace),dt=T.colorSpace===qi||St===Mt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,dt);let st=_(T.image,!1,a.maxTextureSize);st=Nt(T,st);const wt=s.convert(T.format,T.colorSpace),O=s.convert(T.type);let ot=x(T.internalFormat,wt,O,T.colorSpace,T.isVideoTexture);vt(ut,T);let rt;const Vt=T.mipmaps,Ht=T.isVideoTexture!==!0,qt=zt.__version===void 0||J===!0,U=ct.dataReady,bt=w(T,st);if(T.isDepthTexture)ot=v(T.format===bs,T.type),qt&&(Ht?e.texStorage2D(n.TEXTURE_2D,1,ot,st.width,st.height):e.texImage2D(n.TEXTURE_2D,0,ot,st.width,st.height,0,wt,O,null));else if(T.isDataTexture)if(Vt.length>0){Ht&&qt&&e.texStorage2D(n.TEXTURE_2D,bt,ot,Vt[0].width,Vt[0].height);for(let tt=0,mt=Vt.length;tt<mt;tt++)rt=Vt[tt],Ht?U&&e.texSubImage2D(n.TEXTURE_2D,tt,0,0,rt.width,rt.height,wt,O,rt.data):e.texImage2D(n.TEXTURE_2D,tt,ot,rt.width,rt.height,0,wt,O,rt.data);T.generateMipmaps=!1}else Ht?(qt&&e.texStorage2D(n.TEXTURE_2D,bt,ot,st.width,st.height),U&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,st.width,st.height,wt,O,st.data)):e.texImage2D(n.TEXTURE_2D,0,ot,st.width,st.height,0,wt,O,st.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){Ht&&qt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,bt,ot,Vt[0].width,Vt[0].height,st.depth);for(let tt=0,mt=Vt.length;tt<mt;tt++)if(rt=Vt[tt],T.format!==ri)if(wt!==null)if(Ht){if(U)if(T.layerUpdates.size>0){const kt=nf(rt.width,rt.height,T.format,T.type);for(const Lt of T.layerUpdates){const Gt=rt.data.subarray(Lt*kt/rt.data.BYTES_PER_ELEMENT,(Lt+1)*kt/rt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,tt,0,0,Lt,rt.width,rt.height,1,wt,Gt)}T.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,tt,0,0,0,rt.width,rt.height,st.depth,wt,rt.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,tt,ot,rt.width,rt.height,st.depth,0,rt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ht?U&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,tt,0,0,0,rt.width,rt.height,st.depth,wt,O,rt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,tt,ot,rt.width,rt.height,st.depth,0,wt,O,rt.data)}else{Ht&&qt&&e.texStorage2D(n.TEXTURE_2D,bt,ot,Vt[0].width,Vt[0].height);for(let tt=0,mt=Vt.length;tt<mt;tt++)rt=Vt[tt],T.format!==ri?wt!==null?Ht?U&&e.compressedTexSubImage2D(n.TEXTURE_2D,tt,0,0,rt.width,rt.height,wt,rt.data):e.compressedTexImage2D(n.TEXTURE_2D,tt,ot,rt.width,rt.height,0,rt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ht?U&&e.texSubImage2D(n.TEXTURE_2D,tt,0,0,rt.width,rt.height,wt,O,rt.data):e.texImage2D(n.TEXTURE_2D,tt,ot,rt.width,rt.height,0,wt,O,rt.data)}else if(T.isDataArrayTexture)if(Ht){if(qt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,bt,ot,st.width,st.height,st.depth),U)if(T.layerUpdates.size>0){const tt=nf(st.width,st.height,T.format,T.type);for(const mt of T.layerUpdates){const kt=st.data.subarray(mt*tt/st.data.BYTES_PER_ELEMENT,(mt+1)*tt/st.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,mt,st.width,st.height,1,wt,O,kt)}T.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,st.width,st.height,st.depth,wt,O,st.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,ot,st.width,st.height,st.depth,0,wt,O,st.data);else if(T.isData3DTexture)Ht?(qt&&e.texStorage3D(n.TEXTURE_3D,bt,ot,st.width,st.height,st.depth),U&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,st.width,st.height,st.depth,wt,O,st.data)):e.texImage3D(n.TEXTURE_3D,0,ot,st.width,st.height,st.depth,0,wt,O,st.data);else if(T.isFramebufferTexture){if(qt)if(Ht)e.texStorage2D(n.TEXTURE_2D,bt,ot,st.width,st.height);else{let tt=st.width,mt=st.height;for(let kt=0;kt<bt;kt++)e.texImage2D(n.TEXTURE_2D,kt,ot,tt,mt,0,wt,O,null),tt>>=1,mt>>=1}}else if(Vt.length>0){if(Ht&&qt){const tt=Bt(Vt[0]);e.texStorage2D(n.TEXTURE_2D,bt,ot,tt.width,tt.height)}for(let tt=0,mt=Vt.length;tt<mt;tt++)rt=Vt[tt],Ht?U&&e.texSubImage2D(n.TEXTURE_2D,tt,0,0,wt,O,rt):e.texImage2D(n.TEXTURE_2D,tt,ot,wt,O,rt);T.generateMipmaps=!1}else if(Ht){if(qt){const tt=Bt(st);e.texStorage2D(n.TEXTURE_2D,bt,ot,tt.width,tt.height)}U&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,wt,O,st)}else e.texImage2D(n.TEXTURE_2D,0,ot,wt,O,st);m(T)&&p(ut),zt.__version=ct.version,T.onUpdate&&T.onUpdate(T)}k.__version=T.version}function Q(k,T,j){if(T.image.length!==6)return;const ut=It(k,T),J=T.source;e.bindTexture(n.TEXTURE_CUBE_MAP,k.__webglTexture,n.TEXTURE0+j);const ct=i.get(J);if(J.version!==ct.__version||ut===!0){e.activeTexture(n.TEXTURE0+j);const zt=be.getPrimaries(be.workingColorSpace),St=T.colorSpace===qi?null:be.getPrimaries(T.colorSpace),Mt=T.colorSpace===qi||zt===St?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Mt);const dt=T.isCompressedTexture||T.image[0].isCompressedTexture,st=T.image[0]&&T.image[0].isDataTexture,wt=[];for(let mt=0;mt<6;mt++)!dt&&!st?wt[mt]=_(T.image[mt],!0,a.maxCubemapSize):wt[mt]=st?T.image[mt].image:T.image[mt],wt[mt]=Nt(T,wt[mt]);const O=wt[0],ot=s.convert(T.format,T.colorSpace),rt=s.convert(T.type),Vt=x(T.internalFormat,ot,rt,T.colorSpace),Ht=T.isVideoTexture!==!0,qt=ct.__version===void 0||ut===!0,U=J.dataReady;let bt=w(T,O);vt(n.TEXTURE_CUBE_MAP,T);let tt;if(dt){Ht&&qt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,bt,Vt,O.width,O.height);for(let mt=0;mt<6;mt++){tt=wt[mt].mipmaps;for(let kt=0;kt<tt.length;kt++){const Lt=tt[kt];T.format!==ri?ot!==null?Ht?U&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,kt,0,0,Lt.width,Lt.height,ot,Lt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,kt,Vt,Lt.width,Lt.height,0,Lt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ht?U&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,kt,0,0,Lt.width,Lt.height,ot,rt,Lt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,kt,Vt,Lt.width,Lt.height,0,ot,rt,Lt.data)}}}else{if(tt=T.mipmaps,Ht&&qt){tt.length>0&&bt++;const mt=Bt(wt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,bt,Vt,mt.width,mt.height)}for(let mt=0;mt<6;mt++)if(st){Ht?U&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,0,0,wt[mt].width,wt[mt].height,ot,rt,wt[mt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,Vt,wt[mt].width,wt[mt].height,0,ot,rt,wt[mt].data);for(let kt=0;kt<tt.length;kt++){const Gt=tt[kt].image[mt].image;Ht?U&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,kt+1,0,0,Gt.width,Gt.height,ot,rt,Gt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,kt+1,Vt,Gt.width,Gt.height,0,ot,rt,Gt.data)}}else{Ht?U&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,0,0,ot,rt,wt[mt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,Vt,ot,rt,wt[mt]);for(let kt=0;kt<tt.length;kt++){const Lt=tt[kt];Ht?U&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,kt+1,0,0,ot,rt,Lt.image[mt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,kt+1,Vt,ot,rt,Lt.image[mt])}}}m(T)&&p(n.TEXTURE_CUBE_MAP),ct.__version=J.version,T.onUpdate&&T.onUpdate(T)}k.__version=T.version}function pt(k,T,j,ut,J,ct){const zt=s.convert(j.format,j.colorSpace),St=s.convert(j.type),Mt=x(j.internalFormat,zt,St,j.colorSpace),dt=i.get(T),st=i.get(j);if(st.__renderTarget=T,!dt.__hasExternalTextures){const wt=Math.max(1,T.width>>ct),O=Math.max(1,T.height>>ct);J===n.TEXTURE_3D||J===n.TEXTURE_2D_ARRAY?e.texImage3D(J,ct,Mt,wt,O,T.depth,0,zt,St,null):e.texImage2D(J,ct,Mt,wt,O,0,zt,St,null)}e.bindFramebuffer(n.FRAMEBUFFER,k),Ct(T)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ut,J,st.__webglTexture,0,Ot(T)):(J===n.TEXTURE_2D||J>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ut,J,st.__webglTexture,ct),e.bindFramebuffer(n.FRAMEBUFFER,null)}function at(k,T,j){if(n.bindRenderbuffer(n.RENDERBUFFER,k),T.depthBuffer){const ut=T.depthTexture,J=ut&&ut.isDepthTexture?ut.type:null,ct=v(T.stencilBuffer,J),zt=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,St=Ot(T);Ct(T)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,St,ct,T.width,T.height):j?n.renderbufferStorageMultisample(n.RENDERBUFFER,St,ct,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,ct,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,zt,n.RENDERBUFFER,k)}else{const ut=T.textures;for(let J=0;J<ut.length;J++){const ct=ut[J],zt=s.convert(ct.format,ct.colorSpace),St=s.convert(ct.type),Mt=x(ct.internalFormat,zt,St,ct.colorSpace),dt=Ot(T);j&&Ct(T)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,dt,Mt,T.width,T.height):Ct(T)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,dt,Mt,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,Mt,T.width,T.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function K(k,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,k),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ut=i.get(T.depthTexture);ut.__renderTarget=T,(!ut.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),L(T.depthTexture,0);const J=ut.__webglTexture,ct=Ot(T);if(T.depthTexture.format===us)Ct(T)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,J,0,ct):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,J,0);else if(T.depthTexture.format===bs)Ct(T)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,J,0,ct):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function Z(k){const T=i.get(k),j=k.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==k.depthTexture){const ut=k.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),ut){const J=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,ut.removeEventListener("dispose",J)};ut.addEventListener("dispose",J),T.__depthDisposeCallback=J}T.__boundDepthTexture=ut}if(k.depthTexture&&!T.__autoAllocateDepthBuffer){if(j)throw new Error("target.depthTexture not supported in Cube render targets");K(T.__webglFramebuffer,k)}else if(j){T.__webglDepthbuffer=[];for(let ut=0;ut<6;ut++)if(e.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[ut]),T.__webglDepthbuffer[ut]===void 0)T.__webglDepthbuffer[ut]=n.createRenderbuffer(),at(T.__webglDepthbuffer[ut],k,!1);else{const J=k.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ct=T.__webglDepthbuffer[ut];n.bindRenderbuffer(n.RENDERBUFFER,ct),n.framebufferRenderbuffer(n.FRAMEBUFFER,J,n.RENDERBUFFER,ct)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=n.createRenderbuffer(),at(T.__webglDepthbuffer,k,!1);else{const ut=k.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,J=T.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,J),n.framebufferRenderbuffer(n.FRAMEBUFFER,ut,n.RENDERBUFFER,J)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function _t(k,T,j){const ut=i.get(k);T!==void 0&&pt(ut.__webglFramebuffer,k,k.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),j!==void 0&&Z(k)}function Ft(k){const T=k.texture,j=i.get(k),ut=i.get(T);k.addEventListener("dispose",E);const J=k.textures,ct=k.isWebGLCubeRenderTarget===!0,zt=J.length>1;if(zt||(ut.__webglTexture===void 0&&(ut.__webglTexture=n.createTexture()),ut.__version=T.version,o.memory.textures++),ct){j.__webglFramebuffer=[];for(let St=0;St<6;St++)if(T.mipmaps&&T.mipmaps.length>0){j.__webglFramebuffer[St]=[];for(let Mt=0;Mt<T.mipmaps.length;Mt++)j.__webglFramebuffer[St][Mt]=n.createFramebuffer()}else j.__webglFramebuffer[St]=n.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){j.__webglFramebuffer=[];for(let St=0;St<T.mipmaps.length;St++)j.__webglFramebuffer[St]=n.createFramebuffer()}else j.__webglFramebuffer=n.createFramebuffer();if(zt)for(let St=0,Mt=J.length;St<Mt;St++){const dt=i.get(J[St]);dt.__webglTexture===void 0&&(dt.__webglTexture=n.createTexture(),o.memory.textures++)}if(k.samples>0&&Ct(k)===!1){j.__webglMultisampledFramebuffer=n.createFramebuffer(),j.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,j.__webglMultisampledFramebuffer);for(let St=0;St<J.length;St++){const Mt=J[St];j.__webglColorRenderbuffer[St]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,j.__webglColorRenderbuffer[St]);const dt=s.convert(Mt.format,Mt.colorSpace),st=s.convert(Mt.type),wt=x(Mt.internalFormat,dt,st,Mt.colorSpace,k.isXRRenderTarget===!0),O=Ot(k);n.renderbufferStorageMultisample(n.RENDERBUFFER,O,wt,k.width,k.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+St,n.RENDERBUFFER,j.__webglColorRenderbuffer[St])}n.bindRenderbuffer(n.RENDERBUFFER,null),k.depthBuffer&&(j.__webglDepthRenderbuffer=n.createRenderbuffer(),at(j.__webglDepthRenderbuffer,k,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ct){e.bindTexture(n.TEXTURE_CUBE_MAP,ut.__webglTexture),vt(n.TEXTURE_CUBE_MAP,T);for(let St=0;St<6;St++)if(T.mipmaps&&T.mipmaps.length>0)for(let Mt=0;Mt<T.mipmaps.length;Mt++)pt(j.__webglFramebuffer[St][Mt],k,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+St,Mt);else pt(j.__webglFramebuffer[St],k,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+St,0);m(T)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(zt){for(let St=0,Mt=J.length;St<Mt;St++){const dt=J[St],st=i.get(dt);e.bindTexture(n.TEXTURE_2D,st.__webglTexture),vt(n.TEXTURE_2D,dt),pt(j.__webglFramebuffer,k,dt,n.COLOR_ATTACHMENT0+St,n.TEXTURE_2D,0),m(dt)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let St=n.TEXTURE_2D;if((k.isWebGL3DRenderTarget||k.isWebGLArrayRenderTarget)&&(St=k.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(St,ut.__webglTexture),vt(St,T),T.mipmaps&&T.mipmaps.length>0)for(let Mt=0;Mt<T.mipmaps.length;Mt++)pt(j.__webglFramebuffer[Mt],k,T,n.COLOR_ATTACHMENT0,St,Mt);else pt(j.__webglFramebuffer,k,T,n.COLOR_ATTACHMENT0,St,0);m(T)&&p(St),e.unbindTexture()}k.depthBuffer&&Z(k)}function ht(k){const T=k.textures;for(let j=0,ut=T.length;j<ut;j++){const J=T[j];if(m(J)){const ct=y(k),zt=i.get(J).__webglTexture;e.bindTexture(ct,zt),p(ct),e.unbindTexture()}}}const Pt=[],B=[];function ne(k){if(k.samples>0){if(Ct(k)===!1){const T=k.textures,j=k.width,ut=k.height;let J=n.COLOR_BUFFER_BIT;const ct=k.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,zt=i.get(k),St=T.length>1;if(St)for(let Mt=0;Mt<T.length;Mt++)e.bindFramebuffer(n.FRAMEBUFFER,zt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Mt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,zt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Mt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,zt.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,zt.__webglFramebuffer);for(let Mt=0;Mt<T.length;Mt++){if(k.resolveDepthBuffer&&(k.depthBuffer&&(J|=n.DEPTH_BUFFER_BIT),k.stencilBuffer&&k.resolveStencilBuffer&&(J|=n.STENCIL_BUFFER_BIT)),St){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,zt.__webglColorRenderbuffer[Mt]);const dt=i.get(T[Mt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,dt,0)}n.blitFramebuffer(0,0,j,ut,0,0,j,ut,J,n.NEAREST),l===!0&&(Pt.length=0,B.length=0,Pt.push(n.COLOR_ATTACHMENT0+Mt),k.depthBuffer&&k.resolveDepthBuffer===!1&&(Pt.push(ct),B.push(ct),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,B)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Pt))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),St)for(let Mt=0;Mt<T.length;Mt++){e.bindFramebuffer(n.FRAMEBUFFER,zt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Mt,n.RENDERBUFFER,zt.__webglColorRenderbuffer[Mt]);const dt=i.get(T[Mt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,zt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Mt,n.TEXTURE_2D,dt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,zt.__webglMultisampledFramebuffer)}else if(k.depthBuffer&&k.resolveDepthBuffer===!1&&l){const T=k.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[T])}}}function Ot(k){return Math.min(a.maxSamples,k.samples)}function Ct(k){const T=i.get(k);return k.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function xt(k){const T=o.render.frame;h.get(k)!==T&&(h.set(k,T),k.update())}function Nt(k,T){const j=k.colorSpace,ut=k.format,J=k.type;return k.isCompressedTexture===!0||k.isVideoTexture===!0||j!==ws&&j!==qi&&(be.getTransfer(j)===Le?(ut!==ri||J!==Ui)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",j)),T}function Bt(k){return typeof HTMLImageElement<"u"&&k instanceof HTMLImageElement?(c.width=k.naturalWidth||k.width,c.height=k.naturalHeight||k.height):typeof VideoFrame<"u"&&k instanceof VideoFrame?(c.width=k.displayWidth,c.height=k.displayHeight):(c.width=k.width,c.height=k.height),c}this.allocateTextureUnit=F,this.resetTextureUnits=C,this.setTexture2D=L,this.setTexture2DArray=I,this.setTexture3D=z,this.setTextureCube=G,this.rebindTextures=_t,this.setupRenderTarget=Ft,this.updateRenderTargetMipmap=ht,this.updateMultisampleRenderTarget=ne,this.setupDepthRenderbuffer=Z,this.setupFrameBufferTexture=pt,this.useMultisampledRTT=Ct}function vS(n,t){function e(i,a=qi){let s;const o=be.getTransfer(a);if(i===Ui)return n.UNSIGNED_BYTE;if(i===Eh)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Th)return n.UNSIGNED_SHORT_5_5_5_1;if(i===mp)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===fp)return n.BYTE;if(i===pp)return n.SHORT;if(i===ao)return n.UNSIGNED_SHORT;if(i===wh)return n.INT;if(i===Ra)return n.UNSIGNED_INT;if(i===Fi)return n.FLOAT;if(i===fo)return n.HALF_FLOAT;if(i===gp)return n.ALPHA;if(i===xp)return n.RGB;if(i===ri)return n.RGBA;if(i===vp)return n.LUMINANCE;if(i===yp)return n.LUMINANCE_ALPHA;if(i===us)return n.DEPTH_COMPONENT;if(i===bs)return n.DEPTH_STENCIL;if(i===_p)return n.RED;if(i===Ah)return n.RED_INTEGER;if(i===Mp)return n.RG;if(i===Rh)return n.RG_INTEGER;if(i===Ph)return n.RGBA_INTEGER;if(i===dr||i===ur||i===fr||i===pr)if(o===Le)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===dr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ur)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===fr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===pr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===dr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ur)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===fr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===pr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Dl||i===kl||i===Il||i===Fl)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Dl)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===kl)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Il)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Fl)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===zl||i===Nl||i===Ul)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===zl||i===Nl)return o===Le?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Ul)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Ol||i===Bl||i===Hl||i===Gl||i===Vl||i===Xl||i===Wl||i===Yl||i===$l||i===Zl||i===jl||i===ql||i===Kl||i===Jl)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Ol)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Bl)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Hl)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Gl)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Vl)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Xl)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Wl)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Yl)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===$l)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Zl)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===jl)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===ql)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Kl)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Jl)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===mr||i===Ql||i===th)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===mr)return o===Le?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ql)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===th)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===bp||i===eh||i===nh||i===ih)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===mr)return s.COMPRESSED_RED_RGTC1_EXT;if(i===eh)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===nh)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===ih)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ms?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class yS extends Zn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Pe extends Ye{constructor(){super(),this.isGroup=!0,this.type="Group"}}const _S={type:"move"};class Zc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Pe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Pe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Pe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let a=null,s=null,o=null;const r=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,i),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));r!==null&&(a=e.getPose(t.targetRaySpace,i),a===null&&s!==null&&(a=s),a!==null&&(r.matrix.fromArray(a.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,a.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(a.linearVelocity)):r.hasLinearVelocity=!1,a.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(a.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(_S)))}return r!==null&&(r.visible=a!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new Pe;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const MS=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,bS=`
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

}`;class SS{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const a=new Pn,s=t.properties.get(a);s.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=a}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new aa({vertexShader:MS,fragmentShader:bS,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new _e(new $n(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class wS extends Es{constructor(t,e){super();const i=this;let a=null,s=1,o=null,r="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,g=null;const _=new SS,m=e.getContextAttributes();let p=null,y=null;const x=[],v=[],w=new Yt;let S=null;const E=new Zn;E.viewport=new Ke;const A=new Zn;A.viewport=new Ke;const b=[E,A],M=new yS;let P=null,C=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let Q=x[Y];return Q===void 0&&(Q=new Zc,x[Y]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(Y){let Q=x[Y];return Q===void 0&&(Q=new Zc,x[Y]=Q),Q.getGripSpace()},this.getHand=function(Y){let Q=x[Y];return Q===void 0&&(Q=new Zc,x[Y]=Q),Q.getHandSpace()};function F(Y){const Q=v.indexOf(Y.inputSource);if(Q===-1)return;const pt=x[Q];pt!==void 0&&(pt.update(Y.inputSource,Y.frame,c||o),pt.dispatchEvent({type:Y.type,data:Y.inputSource}))}function N(){a.removeEventListener("select",F),a.removeEventListener("selectstart",F),a.removeEventListener("selectend",F),a.removeEventListener("squeeze",F),a.removeEventListener("squeezestart",F),a.removeEventListener("squeezeend",F),a.removeEventListener("end",N),a.removeEventListener("inputsourceschange",L);for(let Y=0;Y<x.length;Y++){const Q=v[Y];Q!==null&&(v[Y]=null,x[Y].disconnect(Q))}P=null,C=null,_.reset(),t.setRenderTarget(p),f=null,d=null,u=null,a=null,y=null,It.stop(),i.isPresenting=!1,t.setPixelRatio(S),t.setSize(w.width,w.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){s=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){r=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return a},this.setSession=async function(Y){if(a=Y,a!==null){if(p=t.getRenderTarget(),a.addEventListener("select",F),a.addEventListener("selectstart",F),a.addEventListener("selectend",F),a.addEventListener("squeeze",F),a.addEventListener("squeezestart",F),a.addEventListener("squeezeend",F),a.addEventListener("end",N),a.addEventListener("inputsourceschange",L),m.xrCompatible!==!0&&await e.makeXRCompatible(),S=t.getPixelRatio(),t.getSize(w),a.renderState.layers===void 0){const Q={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(a,e,Q),a.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Pa(f.framebufferWidth,f.framebufferHeight,{format:ri,type:Ui,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let Q=null,pt=null,at=null;m.depth&&(at=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Q=m.stencil?bs:us,pt=m.stencil?Ms:Ra);const K={colorFormat:e.RGBA8,depthFormat:at,scaleFactor:s};u=new XRWebGLBinding(a,e),d=u.createProjectionLayer(K),a.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),y=new Pa(d.textureWidth,d.textureHeight,{format:ri,type:Ui,depthTexture:new zp(d.textureWidth,d.textureHeight,pt,void 0,void 0,void 0,void 0,void 0,void 0,Q),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await a.requestReferenceSpace(r),It.setContext(a),It.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function L(Y){for(let Q=0;Q<Y.removed.length;Q++){const pt=Y.removed[Q],at=v.indexOf(pt);at>=0&&(v[at]=null,x[at].disconnect(pt))}for(let Q=0;Q<Y.added.length;Q++){const pt=Y.added[Q];let at=v.indexOf(pt);if(at===-1){for(let Z=0;Z<x.length;Z++)if(Z>=v.length){v.push(pt),at=Z;break}else if(v[Z]===null){v[Z]=pt,at=Z;break}if(at===-1)break}const K=x[at];K&&K.connect(pt)}}const I=new H,z=new H;function G(Y,Q,pt){I.setFromMatrixPosition(Q.matrixWorld),z.setFromMatrixPosition(pt.matrixWorld);const at=I.distanceTo(z),K=Q.projectionMatrix.elements,Z=pt.projectionMatrix.elements,_t=K[14]/(K[10]-1),Ft=K[14]/(K[10]+1),ht=(K[9]+1)/K[5],Pt=(K[9]-1)/K[5],B=(K[8]-1)/K[0],ne=(Z[8]+1)/Z[0],Ot=_t*B,Ct=_t*ne,xt=at/(-B+ne),Nt=xt*-B;if(Q.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Nt),Y.translateZ(xt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),K[10]===-1)Y.projectionMatrix.copy(Q.projectionMatrix),Y.projectionMatrixInverse.copy(Q.projectionMatrixInverse);else{const Bt=_t+xt,k=Ft+xt,T=Ot-Nt,j=Ct+(at-Nt),ut=ht*Ft/k*Bt,J=Pt*Ft/k*Bt;Y.projectionMatrix.makePerspective(T,j,ut,J,Bt,k),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function $(Y,Q){Q===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(Q.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(a===null)return;let Q=Y.near,pt=Y.far;_.texture!==null&&(_.depthNear>0&&(Q=_.depthNear),_.depthFar>0&&(pt=_.depthFar)),M.near=A.near=E.near=Q,M.far=A.far=E.far=pt,(P!==M.near||C!==M.far)&&(a.updateRenderState({depthNear:M.near,depthFar:M.far}),P=M.near,C=M.far),E.layers.mask=Y.layers.mask|2,A.layers.mask=Y.layers.mask|4,M.layers.mask=E.layers.mask|A.layers.mask;const at=Y.parent,K=M.cameras;$(M,at);for(let Z=0;Z<K.length;Z++)$(K[Z],at);K.length===2?G(M,E,A):M.projectionMatrix.copy(E.projectionMatrix),et(Y,M,at)};function et(Y,Q,pt){pt===null?Y.matrix.copy(Q.matrixWorld):(Y.matrix.copy(pt.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(Q.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(Q.projectionMatrix),Y.projectionMatrixInverse.copy(Q.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=so*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(Y){l=Y,d!==null&&(d.fixedFoveation=Y),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Y)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(M)};let ft=null;function vt(Y,Q){if(h=Q.getViewerPose(c||o),g=Q,h!==null){const pt=h.views;f!==null&&(t.setRenderTargetFramebuffer(y,f.framebuffer),t.setRenderTarget(y));let at=!1;pt.length!==M.cameras.length&&(M.cameras.length=0,at=!0);for(let Z=0;Z<pt.length;Z++){const _t=pt[Z];let Ft=null;if(f!==null)Ft=f.getViewport(_t);else{const Pt=u.getViewSubImage(d,_t);Ft=Pt.viewport,Z===0&&(t.setRenderTargetTextures(y,Pt.colorTexture,d.ignoreDepthValues?void 0:Pt.depthStencilTexture),t.setRenderTarget(y))}let ht=b[Z];ht===void 0&&(ht=new Zn,ht.layers.enable(Z),ht.viewport=new Ke,b[Z]=ht),ht.matrix.fromArray(_t.transform.matrix),ht.matrix.decompose(ht.position,ht.quaternion,ht.scale),ht.projectionMatrix.fromArray(_t.projectionMatrix),ht.projectionMatrixInverse.copy(ht.projectionMatrix).invert(),ht.viewport.set(Ft.x,Ft.y,Ft.width,Ft.height),Z===0&&(M.matrix.copy(ht.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),at===!0&&M.cameras.push(ht)}const K=a.enabledFeatures;if(K&&K.includes("depth-sensing")){const Z=u.getDepthInformation(pt[0]);Z&&Z.isValid&&Z.texture&&_.init(t,Z,a.renderState)}}for(let pt=0;pt<x.length;pt++){const at=v[pt],K=x[pt];at!==null&&K!==void 0&&K.update(at,Q,c||o)}ft&&ft(Y,Q),Q.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Q}),g=null}const It=new Ip;It.setAnimationLoop(vt),this.setAnimationLoop=function(Y){ft=Y},this.dispose=function(){}}}const ga=new Mi,ES=new Ue;function TS(n,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,Lp(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function a(m,p,y,x,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),u(m,p)):p.isMeshPhongMaterial?(s(m,p),h(m,p)):p.isMeshStandardMaterial?(s(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,v)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),_(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&r(m,p)):p.isPointsMaterial?l(m,p,y,x):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Dn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Dn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const y=t.get(p),x=y.envMap,v=y.envMapRotation;x&&(m.envMap.value=x,ga.copy(v),ga.x*=-1,ga.y*=-1,ga.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(ga.y*=-1,ga.z*=-1),m.envMapRotation.value.setFromMatrix4(ES.makeRotationFromEuler(ga)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function r(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,y,x){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*y,m.scale.value=x*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,y){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Dn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const y=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:a}}function AS(n,t,e,i){let a={},s={},o=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,x){const v=x.program;i.uniformBlockBinding(y,v)}function c(y,x){let v=a[y.id];v===void 0&&(g(y),v=h(y),a[y.id]=v,y.addEventListener("dispose",m));const w=x.program;i.updateUBOMapping(y,w);const S=t.render.frame;s[y.id]!==S&&(d(y),s[y.id]=S)}function h(y){const x=u();y.__bindingPointIndex=x;const v=n.createBuffer(),w=y.__size,S=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,v),n.bufferData(n.UNIFORM_BUFFER,w,S),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,v),v}function u(){for(let y=0;y<r;y++)if(o.indexOf(y)===-1)return o.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){const x=a[y.id],v=y.uniforms,w=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let S=0,E=v.length;S<E;S++){const A=Array.isArray(v[S])?v[S]:[v[S]];for(let b=0,M=A.length;b<M;b++){const P=A[b];if(f(P,S,b,w)===!0){const C=P.__offset,F=Array.isArray(P.value)?P.value:[P.value];let N=0;for(let L=0;L<F.length;L++){const I=F[L],z=_(I);typeof I=="number"||typeof I=="boolean"?(P.__data[0]=I,n.bufferSubData(n.UNIFORM_BUFFER,C+N,P.__data)):I.isMatrix3?(P.__data[0]=I.elements[0],P.__data[1]=I.elements[1],P.__data[2]=I.elements[2],P.__data[3]=0,P.__data[4]=I.elements[3],P.__data[5]=I.elements[4],P.__data[6]=I.elements[5],P.__data[7]=0,P.__data[8]=I.elements[6],P.__data[9]=I.elements[7],P.__data[10]=I.elements[8],P.__data[11]=0):(I.toArray(P.__data,N),N+=z.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,C,P.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(y,x,v,w){const S=y.value,E=x+"_"+v;if(w[E]===void 0)return typeof S=="number"||typeof S=="boolean"?w[E]=S:w[E]=S.clone(),!0;{const A=w[E];if(typeof S=="number"||typeof S=="boolean"){if(A!==S)return w[E]=S,!0}else if(A.equals(S)===!1)return A.copy(S),!0}return!1}function g(y){const x=y.uniforms;let v=0;const w=16;for(let E=0,A=x.length;E<A;E++){const b=Array.isArray(x[E])?x[E]:[x[E]];for(let M=0,P=b.length;M<P;M++){const C=b[M],F=Array.isArray(C.value)?C.value:[C.value];for(let N=0,L=F.length;N<L;N++){const I=F[N],z=_(I),G=v%w,$=G%z.boundary,et=G+$;v+=$,et!==0&&w-et<z.storage&&(v+=w-et),C.__data=new Float32Array(z.storage/Float32Array.BYTES_PER_ELEMENT),C.__offset=v,v+=z.storage}}}const S=v%w;return S>0&&(v+=w-S),y.__size=v,y.__cache={},this}function _(y){const x={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(x.boundary=4,x.storage=4):y.isVector2?(x.boundary=8,x.storage=8):y.isVector3||y.isColor?(x.boundary=16,x.storage=12):y.isVector4?(x.boundary=16,x.storage=16):y.isMatrix3?(x.boundary=48,x.storage=48):y.isMatrix4?(x.boundary=64,x.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),x}function m(y){const x=y.target;x.removeEventListener("dispose",m);const v=o.indexOf(x.__bindingPointIndex);o.splice(v,1),n.deleteBuffer(a[x.id]),delete a[x.id],delete s[x.id]}function p(){for(const y in a)n.deleteBuffer(a[y]);o=[],a={},s={}}return{bind:l,update:c,dispose:p}}class RS{constructor(t={}){const{canvas:e=gy(),context:i=null,depth:a=!0,stencil:s=!1,alpha:o=!1,antialias:r=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=o;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const y=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Rn,this.toneMapping=ea,this.toneMappingExposure=1;const v=this;let w=!1,S=0,E=0,A=null,b=-1,M=null;const P=new Ke,C=new Ke;let F=null;const N=new se(0);let L=0,I=e.width,z=e.height,G=1,$=null,et=null;const ft=new Ke(0,0,I,z),vt=new Ke(0,0,I,z);let It=!1;const Y=new kh;let Q=!1,pt=!1;const at=new Ue,K=new Ue,Z=new H,_t=new Ke,Ft={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ht=!1;function Pt(){return A===null?G:1}let B=i;function ne(R,X){return e.getContext(R,X)}try{const R={alpha:!0,depth:a,stencil:s,antialias:r,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${bh}`),e.addEventListener("webglcontextlost",mt,!1),e.addEventListener("webglcontextrestored",kt,!1),e.addEventListener("webglcontextcreationerror",Lt,!1),B===null){const X="webgl2";if(B=ne(X,R),B===null)throw ne(X)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}let Ot,Ct,xt,Nt,Bt,k,T,j,ut,J,ct,zt,St,Mt,dt,st,wt,O,ot,rt,Vt,Ht,qt,U;function bt(){Ot=new kb(B),Ot.init(),Ht=new vS(B,Ot),Ct=new Ab(B,Ot,t,Ht),xt=new mS(B,Ot),Ct.reverseDepthBuffer&&d&&xt.buffers.depth.setReversed(!0),Nt=new zb(B),Bt=new tS,k=new xS(B,Ot,xt,Bt,Ct,Ht,Nt),T=new Pb(v),j=new Db(v),ut=new Vy(B),qt=new Eb(B,ut),J=new Ib(B,ut,Nt,qt),ct=new Ub(B,J,ut,Nt),ot=new Nb(B,Ct,k),st=new Rb(Bt),zt=new Q1(v,T,j,Ot,Ct,qt,st),St=new TS(v,Bt),Mt=new nS,dt=new cS(Ot),O=new wb(v,T,j,xt,ct,f,l),wt=new fS(v,ct,Ct),U=new AS(B,Nt,Ct,xt),rt=new Tb(B,Ot,Nt),Vt=new Fb(B,Ot,Nt),Nt.programs=zt.programs,v.capabilities=Ct,v.extensions=Ot,v.properties=Bt,v.renderLists=Mt,v.shadowMap=wt,v.state=xt,v.info=Nt}bt();const tt=new wS(v,B);this.xr=tt,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){const R=Ot.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=Ot.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(R){R!==void 0&&(G=R,this.setSize(I,z,!1))},this.getSize=function(R){return R.set(I,z)},this.setSize=function(R,X,nt=!0){if(tt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}I=R,z=X,e.width=Math.floor(R*G),e.height=Math.floor(X*G),nt===!0&&(e.style.width=R+"px",e.style.height=X+"px"),this.setViewport(0,0,R,X)},this.getDrawingBufferSize=function(R){return R.set(I*G,z*G).floor()},this.setDrawingBufferSize=function(R,X,nt){I=R,z=X,G=nt,e.width=Math.floor(R*nt),e.height=Math.floor(X*nt),this.setViewport(0,0,R,X)},this.getCurrentViewport=function(R){return R.copy(P)},this.getViewport=function(R){return R.copy(ft)},this.setViewport=function(R,X,nt,it){R.isVector4?ft.set(R.x,R.y,R.z,R.w):ft.set(R,X,nt,it),xt.viewport(P.copy(ft).multiplyScalar(G).round())},this.getScissor=function(R){return R.copy(vt)},this.setScissor=function(R,X,nt,it){R.isVector4?vt.set(R.x,R.y,R.z,R.w):vt.set(R,X,nt,it),xt.scissor(C.copy(vt).multiplyScalar(G).round())},this.getScissorTest=function(){return It},this.setScissorTest=function(R){xt.setScissorTest(It=R)},this.setOpaqueSort=function(R){$=R},this.setTransparentSort=function(R){et=R},this.getClearColor=function(R){return R.copy(O.getClearColor())},this.setClearColor=function(){O.setClearColor.apply(O,arguments)},this.getClearAlpha=function(){return O.getClearAlpha()},this.setClearAlpha=function(){O.setClearAlpha.apply(O,arguments)},this.clear=function(R=!0,X=!0,nt=!0){let it=0;if(R){let W=!1;if(A!==null){const At=A.texture.format;W=At===Ph||At===Rh||At===Ah}if(W){const At=A.texture.type,Ut=At===Ui||At===Ra||At===ao||At===Ms||At===Eh||At===Th,Wt=O.getClearColor(),Zt=O.getClearAlpha(),Jt=Wt.r,Rt=Wt.g,lt=Wt.b;Ut?(g[0]=Jt,g[1]=Rt,g[2]=lt,g[3]=Zt,B.clearBufferuiv(B.COLOR,0,g)):(_[0]=Jt,_[1]=Rt,_[2]=lt,_[3]=Zt,B.clearBufferiv(B.COLOR,0,_))}else it|=B.COLOR_BUFFER_BIT}X&&(it|=B.DEPTH_BUFFER_BIT),nt&&(it|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B.clear(it)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",mt,!1),e.removeEventListener("webglcontextrestored",kt,!1),e.removeEventListener("webglcontextcreationerror",Lt,!1),Mt.dispose(),dt.dispose(),Bt.dispose(),T.dispose(),j.dispose(),ct.dispose(),qt.dispose(),U.dispose(),zt.dispose(),tt.dispose(),tt.removeEventListener("sessionstart",Je),tt.removeEventListener("sessionend",V),Tt.stop()};function mt(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function kt(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const R=Nt.autoReset,X=wt.enabled,nt=wt.autoUpdate,it=wt.needsUpdate,W=wt.type;bt(),Nt.autoReset=R,wt.enabled=X,wt.autoUpdate=nt,wt.needsUpdate=it,wt.type=W}function Lt(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function Gt(R){const X=R.target;X.removeEventListener("dispose",Gt),ce(X)}function ce(R){ge(R),Bt.remove(R)}function ge(R){const X=Bt.get(R).programs;X!==void 0&&(X.forEach(function(nt){zt.releaseProgram(nt)}),R.isShaderMaterial&&zt.releaseShaderCache(R))}this.renderBufferDirect=function(R,X,nt,it,W,At){X===null&&(X=Ft);const Ut=W.isMesh&&W.matrixWorld.determinant()<0,Wt=Ge(R,X,nt,it,W);xt.setMaterial(it,Ut);let Zt=nt.index,Jt=1;if(it.wireframe===!0){if(Zt=J.getWireframeAttribute(nt),Zt===void 0)return;Jt=2}const Rt=nt.drawRange,lt=nt.attributes.position;let Et=Rt.start*Jt,jt=(Rt.start+Rt.count)*Jt;At!==null&&(Et=Math.max(Et,At.start*Jt),jt=Math.min(jt,(At.start+At.count)*Jt)),Zt!==null?(Et=Math.max(Et,0),jt=Math.min(jt,Zt.count)):lt!=null&&(Et=Math.max(Et,0),jt=Math.min(jt,lt.count));const oe=jt-Et;if(oe<0||oe===1/0)return;qt.setup(W,it,Wt,nt,Zt);let ze,le=rt;if(Zt!==null&&(ze=ut.get(Zt),le=Vt,le.setIndex(ze)),W.isMesh)it.wireframe===!0?(xt.setLineWidth(it.wireframeLinewidth*Pt()),le.setMode(B.LINES)):le.setMode(B.TRIANGLES);else if(W.isLine){let $t=it.linewidth;$t===void 0&&($t=1),xt.setLineWidth($t*Pt()),W.isLineSegments?le.setMode(B.LINES):W.isLineLoop?le.setMode(B.LINE_LOOP):le.setMode(B.LINE_STRIP)}else W.isPoints?le.setMode(B.POINTS):W.isSprite&&le.setMode(B.TRIANGLES);if(W.isBatchedMesh)if(W._multiDrawInstances!==null)le.renderMultiDrawInstances(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount,W._multiDrawInstances);else if(Ot.get("WEBGL_multi_draw"))le.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{const $t=W._multiDrawStarts,ln=W._multiDrawCounts,he=W._multiDrawCount,Qe=Zt?ut.get(Zt).bytesPerElement:1,bn=Bt.get(it).currentProgram.getUniforms();for(let ke=0;ke<he;ke++)bn.setValue(B,"_gl_DrawID",ke),le.render($t[ke]/Qe,ln[ke])}else if(W.isInstancedMesh)le.renderInstances(Et,oe,W.count);else if(nt.isInstancedBufferGeometry){const $t=nt._maxInstanceCount!==void 0?nt._maxInstanceCount:1/0,ln=Math.min(nt.instanceCount,$t);le.renderInstances(Et,oe,ln)}else le.render(Et,oe)};function te(R,X,nt){R.transparent===!0&&R.side===qe&&R.forceSinglePass===!1?(R.side=Dn,R.needsUpdate=!0,Fe(R,X,nt),R.side=ia,R.needsUpdate=!0,Fe(R,X,nt),R.side=qe):Fe(R,X,nt)}this.compile=function(R,X,nt=null){nt===null&&(nt=R),p=dt.get(nt),p.init(X),x.push(p),nt.traverseVisible(function(W){W.isLight&&W.layers.test(X.layers)&&(p.pushLight(W),W.castShadow&&p.pushShadow(W))}),R!==nt&&R.traverseVisible(function(W){W.isLight&&W.layers.test(X.layers)&&(p.pushLight(W),W.castShadow&&p.pushShadow(W))}),p.setupLights();const it=new Set;return R.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;const At=W.material;if(At)if(Array.isArray(At))for(let Ut=0;Ut<At.length;Ut++){const Wt=At[Ut];te(Wt,nt,W),it.add(Wt)}else te(At,nt,W),it.add(At)}),x.pop(),p=null,it},this.compileAsync=function(R,X,nt=null){const it=this.compile(R,X,nt);return new Promise(W=>{function At(){if(it.forEach(function(Ut){Bt.get(Ut).currentProgram.isReady()&&it.delete(Ut)}),it.size===0){W(R);return}setTimeout(At,10)}Ot.get("KHR_parallel_shader_compile")!==null?At():setTimeout(At,10)})};let we=null;function Be(R){we&&we(R)}function Je(){Tt.stop()}function V(){Tt.start()}const Tt=new Ip;Tt.setAnimationLoop(Be),typeof self<"u"&&Tt.setContext(self),this.setAnimationLoop=function(R){we=R,tt.setAnimationLoop(R),R===null?Tt.stop():Tt.start()},tt.addEventListener("sessionstart",Je),tt.addEventListener("sessionend",V),this.render=function(R,X){if(X!==void 0&&X.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),X.parent===null&&X.matrixWorldAutoUpdate===!0&&X.updateMatrixWorld(),tt.enabled===!0&&tt.isPresenting===!0&&(tt.cameraAutoUpdate===!0&&tt.updateCamera(X),X=tt.getCamera()),R.isScene===!0&&R.onBeforeRender(v,R,X,A),p=dt.get(R,x.length),p.init(X),x.push(p),K.multiplyMatrices(X.projectionMatrix,X.matrixWorldInverse),Y.setFromProjectionMatrix(K),pt=this.localClippingEnabled,Q=st.init(this.clippingPlanes,pt),m=Mt.get(R,y.length),m.init(),y.push(m),tt.enabled===!0&&tt.isPresenting===!0){const At=v.xr.getDepthSensingMesh();At!==null&&Dt(At,X,-1/0,v.sortObjects)}Dt(R,X,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort($,et),ht=tt.enabled===!1||tt.isPresenting===!1||tt.hasDepthSensing()===!1,ht&&O.addToRenderList(m,R),this.info.render.frame++,Q===!0&&st.beginShadows();const nt=p.state.shadowsArray;wt.render(nt,R,X),Q===!0&&st.endShadows(),this.info.autoReset===!0&&this.info.reset();const it=m.opaque,W=m.transmissive;if(p.setupLights(),X.isArrayCamera){const At=X.cameras;if(W.length>0)for(let Ut=0,Wt=At.length;Ut<Wt;Ut++){const Zt=At[Ut];ue(it,W,R,Zt)}ht&&O.render(R);for(let Ut=0,Wt=At.length;Ut<Wt;Ut++){const Zt=At[Ut];ie(m,R,Zt,Zt.viewport)}}else W.length>0&&ue(it,W,R,X),ht&&O.render(R),ie(m,R,X);A!==null&&(k.updateMultisampleRenderTarget(A),k.updateRenderTargetMipmap(A)),R.isScene===!0&&R.onAfterRender(v,R,X),qt.resetDefaultState(),b=-1,M=null,x.pop(),x.length>0?(p=x[x.length-1],Q===!0&&st.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,y.pop(),y.length>0?m=y[y.length-1]:m=null};function Dt(R,X,nt,it){if(R.visible===!1)return;if(R.layers.test(X.layers)){if(R.isGroup)nt=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(X);else if(R.isLight)p.pushLight(R),R.castShadow&&p.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||Y.intersectsSprite(R)){it&&_t.setFromMatrixPosition(R.matrixWorld).applyMatrix4(K);const Ut=ct.update(R),Wt=R.material;Wt.visible&&m.push(R,Ut,Wt,nt,_t.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||Y.intersectsObject(R))){const Ut=ct.update(R),Wt=R.material;if(it&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),_t.copy(R.boundingSphere.center)):(Ut.boundingSphere===null&&Ut.computeBoundingSphere(),_t.copy(Ut.boundingSphere.center)),_t.applyMatrix4(R.matrixWorld).applyMatrix4(K)),Array.isArray(Wt)){const Zt=Ut.groups;for(let Jt=0,Rt=Zt.length;Jt<Rt;Jt++){const lt=Zt[Jt],Et=Wt[lt.materialIndex];Et&&Et.visible&&m.push(R,Ut,Et,nt,_t.z,lt)}}else Wt.visible&&m.push(R,Ut,Wt,nt,_t.z,null)}}const At=R.children;for(let Ut=0,Wt=At.length;Ut<Wt;Ut++)Dt(At[Ut],X,nt,it)}function ie(R,X,nt,it){const W=R.opaque,At=R.transmissive,Ut=R.transparent;p.setupLightsView(nt),Q===!0&&st.setGlobalState(v.clippingPlanes,nt),it&&xt.viewport(P.copy(it)),W.length>0&&re(W,X,nt),At.length>0&&re(At,X,nt),Ut.length>0&&re(Ut,X,nt),xt.buffers.depth.setTest(!0),xt.buffers.depth.setMask(!0),xt.buffers.color.setMask(!0),xt.setPolygonOffset(!1)}function ue(R,X,nt,it){if((nt.isScene===!0?nt.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[it.id]===void 0&&(p.state.transmissionRenderTarget[it.id]=new Pa(1,1,{generateMipmaps:!0,type:Ot.has("EXT_color_buffer_half_float")||Ot.has("EXT_color_buffer_float")?fo:Ui,minFilter:Ta,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:be.workingColorSpace}));const At=p.state.transmissionRenderTarget[it.id],Ut=it.viewport||P;At.setSize(Ut.z,Ut.w);const Wt=v.getRenderTarget();v.setRenderTarget(At),v.getClearColor(N),L=v.getClearAlpha(),L<1&&v.setClearColor(16777215,.5),v.clear(),ht&&O.render(nt);const Zt=v.toneMapping;v.toneMapping=ea;const Jt=it.viewport;if(it.viewport!==void 0&&(it.viewport=void 0),p.setupLightsView(it),Q===!0&&st.setGlobalState(v.clippingPlanes,it),re(R,nt,it),k.updateMultisampleRenderTarget(At),k.updateRenderTargetMipmap(At),Ot.has("WEBGL_multisampled_render_to_texture")===!1){let Rt=!1;for(let lt=0,Et=X.length;lt<Et;lt++){const jt=X[lt],oe=jt.object,ze=jt.geometry,le=jt.material,$t=jt.group;if(le.side===qe&&oe.layers.test(it.layers)){const ln=le.side;le.side=Dn,le.needsUpdate=!0,ve(oe,nt,it,ze,le,$t),le.side=ln,le.needsUpdate=!0,Rt=!0}}Rt===!0&&(k.updateMultisampleRenderTarget(At),k.updateRenderTargetMipmap(At))}v.setRenderTarget(Wt),v.setClearColor(N,L),Jt!==void 0&&(it.viewport=Jt),v.toneMapping=Zt}function re(R,X,nt){const it=X.isScene===!0?X.overrideMaterial:null;for(let W=0,At=R.length;W<At;W++){const Ut=R[W],Wt=Ut.object,Zt=Ut.geometry,Jt=it===null?Ut.material:it,Rt=Ut.group;Wt.layers.test(nt.layers)&&ve(Wt,X,nt,Zt,Jt,Rt)}}function ve(R,X,nt,it,W,At){R.onBeforeRender(v,X,nt,it,W,At),R.modelViewMatrix.multiplyMatrices(nt.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),W.onBeforeRender(v,X,nt,it,R,At),W.transparent===!0&&W.side===qe&&W.forceSinglePass===!1?(W.side=Dn,W.needsUpdate=!0,v.renderBufferDirect(nt,X,it,W,R,At),W.side=ia,W.needsUpdate=!0,v.renderBufferDirect(nt,X,it,W,R,At),W.side=qe):v.renderBufferDirect(nt,X,it,W,R,At),R.onAfterRender(v,X,nt,it,W,At)}function Fe(R,X,nt){X.isScene!==!0&&(X=Ft);const it=Bt.get(R),W=p.state.lights,At=p.state.shadowsArray,Ut=W.state.version,Wt=zt.getParameters(R,W.state,At,X,nt),Zt=zt.getProgramCacheKey(Wt);let Jt=it.programs;it.environment=R.isMeshStandardMaterial?X.environment:null,it.fog=X.fog,it.envMap=(R.isMeshStandardMaterial?j:T).get(R.envMap||it.environment),it.envMapRotation=it.environment!==null&&R.envMap===null?X.environmentRotation:R.envMapRotation,Jt===void 0&&(R.addEventListener("dispose",Gt),Jt=new Map,it.programs=Jt);let Rt=Jt.get(Zt);if(Rt!==void 0){if(it.currentProgram===Rt&&it.lightsStateVersion===Ut)return De(R,Wt),Rt}else Wt.uniforms=zt.getUniforms(R),R.onBeforeCompile(Wt,v),Rt=zt.acquireProgram(Wt,Zt),Jt.set(Zt,Rt),it.uniforms=Wt.uniforms;const lt=it.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(lt.clippingPlanes=st.uniform),De(R,Wt),it.needsLights=jn(R),it.lightsStateVersion=Ut,it.needsLights&&(lt.ambientLightColor.value=W.state.ambient,lt.lightProbe.value=W.state.probe,lt.directionalLights.value=W.state.directional,lt.directionalLightShadows.value=W.state.directionalShadow,lt.spotLights.value=W.state.spot,lt.spotLightShadows.value=W.state.spotShadow,lt.rectAreaLights.value=W.state.rectArea,lt.ltc_1.value=W.state.rectAreaLTC1,lt.ltc_2.value=W.state.rectAreaLTC2,lt.pointLights.value=W.state.point,lt.pointLightShadows.value=W.state.pointShadow,lt.hemisphereLights.value=W.state.hemi,lt.directionalShadowMap.value=W.state.directionalShadowMap,lt.directionalShadowMatrix.value=W.state.directionalShadowMatrix,lt.spotShadowMap.value=W.state.spotShadowMap,lt.spotLightMatrix.value=W.state.spotLightMatrix,lt.spotLightMap.value=W.state.spotLightMap,lt.pointShadowMap.value=W.state.pointShadowMap,lt.pointShadowMatrix.value=W.state.pointShadowMatrix),it.currentProgram=Rt,it.uniformsList=null,Rt}function $e(R){if(R.uniformsList===null){const X=R.currentProgram.getUniforms();R.uniformsList=gr.seqWithValue(X.seq,R.uniforms)}return R.uniformsList}function De(R,X){const nt=Bt.get(R);nt.outputColorSpace=X.outputColorSpace,nt.batching=X.batching,nt.batchingColor=X.batchingColor,nt.instancing=X.instancing,nt.instancingColor=X.instancingColor,nt.instancingMorph=X.instancingMorph,nt.skinning=X.skinning,nt.morphTargets=X.morphTargets,nt.morphNormals=X.morphNormals,nt.morphColors=X.morphColors,nt.morphTargetsCount=X.morphTargetsCount,nt.numClippingPlanes=X.numClippingPlanes,nt.numIntersection=X.numClipIntersection,nt.vertexAlphas=X.vertexAlphas,nt.vertexTangents=X.vertexTangents,nt.toneMapping=X.toneMapping}function Ge(R,X,nt,it,W){X.isScene!==!0&&(X=Ft),k.resetTextureUnits();const At=X.fog,Ut=it.isMeshStandardMaterial?X.environment:null,Wt=A===null?v.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:ws,Zt=(it.isMeshStandardMaterial?j:T).get(it.envMap||Ut),Jt=it.vertexColors===!0&&!!nt.attributes.color&&nt.attributes.color.itemSize===4,Rt=!!nt.attributes.tangent&&(!!it.normalMap||it.anisotropy>0),lt=!!nt.morphAttributes.position,Et=!!nt.morphAttributes.normal,jt=!!nt.morphAttributes.color;let oe=ea;it.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(oe=v.toneMapping);const ze=nt.morphAttributes.position||nt.morphAttributes.normal||nt.morphAttributes.color,le=ze!==void 0?ze.length:0,$t=Bt.get(it),ln=p.state.lights;if(Q===!0&&(pt===!0||R!==M)){const gn=R===M&&it.id===b;st.setState(it,R,gn)}let he=!1;it.version===$t.__version?($t.needsLights&&$t.lightsStateVersion!==ln.state.version||$t.outputColorSpace!==Wt||W.isBatchedMesh&&$t.batching===!1||!W.isBatchedMesh&&$t.batching===!0||W.isBatchedMesh&&$t.batchingColor===!0&&W.colorTexture===null||W.isBatchedMesh&&$t.batchingColor===!1&&W.colorTexture!==null||W.isInstancedMesh&&$t.instancing===!1||!W.isInstancedMesh&&$t.instancing===!0||W.isSkinnedMesh&&$t.skinning===!1||!W.isSkinnedMesh&&$t.skinning===!0||W.isInstancedMesh&&$t.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&$t.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&$t.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&$t.instancingMorph===!1&&W.morphTexture!==null||$t.envMap!==Zt||it.fog===!0&&$t.fog!==At||$t.numClippingPlanes!==void 0&&($t.numClippingPlanes!==st.numPlanes||$t.numIntersection!==st.numIntersection)||$t.vertexAlphas!==Jt||$t.vertexTangents!==Rt||$t.morphTargets!==lt||$t.morphNormals!==Et||$t.morphColors!==jt||$t.toneMapping!==oe||$t.morphTargetsCount!==le)&&(he=!0):(he=!0,$t.__version=it.version);let Qe=$t.currentProgram;he===!0&&(Qe=Fe(it,X,W));let bn=!1,ke=!1,hn=!1;const Ee=Qe.getUniforms(),Cn=$t.uniforms;if(xt.useProgram(Qe.program)&&(bn=!0,ke=!0,hn=!0),it.id!==b&&(b=it.id,ke=!0),bn||M!==R){xt.buffers.depth.getReversed()?(at.copy(R.projectionMatrix),vy(at),yy(at),Ee.setValue(B,"projectionMatrix",at)):Ee.setValue(B,"projectionMatrix",R.projectionMatrix),Ee.setValue(B,"viewMatrix",R.matrixWorldInverse);const Xn=Ee.map.cameraPosition;Xn!==void 0&&Xn.setValue(B,Z.setFromMatrixPosition(R.matrixWorld)),Ct.logarithmicDepthBuffer&&Ee.setValue(B,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(it.isMeshPhongMaterial||it.isMeshToonMaterial||it.isMeshLambertMaterial||it.isMeshBasicMaterial||it.isMeshStandardMaterial||it.isShaderMaterial)&&Ee.setValue(B,"isOrthographic",R.isOrthographicCamera===!0),M!==R&&(M=R,ke=!0,hn=!0)}if(W.isSkinnedMesh){Ee.setOptional(B,W,"bindMatrix"),Ee.setOptional(B,W,"bindMatrixInverse");const gn=W.skeleton;gn&&(gn.boneTexture===null&&gn.computeBoneTexture(),Ee.setValue(B,"boneTexture",gn.boneTexture,k))}W.isBatchedMesh&&(Ee.setOptional(B,W,"batchingTexture"),Ee.setValue(B,"batchingTexture",W._matricesTexture,k),Ee.setOptional(B,W,"batchingIdTexture"),Ee.setValue(B,"batchingIdTexture",W._indirectTexture,k),Ee.setOptional(B,W,"batchingColorTexture"),W._colorsTexture!==null&&Ee.setValue(B,"batchingColorTexture",W._colorsTexture,k));const Si=nt.morphAttributes;if((Si.position!==void 0||Si.normal!==void 0||Si.color!==void 0)&&ot.update(W,nt,Qe),(ke||$t.receiveShadow!==W.receiveShadow)&&($t.receiveShadow=W.receiveShadow,Ee.setValue(B,"receiveShadow",W.receiveShadow)),it.isMeshGouraudMaterial&&it.envMap!==null&&(Cn.envMap.value=Zt,Cn.flipEnvMap.value=Zt.isCubeTexture&&Zt.isRenderTargetTexture===!1?-1:1),it.isMeshStandardMaterial&&it.envMap===null&&X.environment!==null&&(Cn.envMapIntensity.value=X.environmentIntensity),ke&&(Ee.setValue(B,"toneMappingExposure",v.toneMappingExposure),$t.needsLights&&Vn(Cn,hn),At&&it.fog===!0&&St.refreshFogUniforms(Cn,At),St.refreshMaterialUniforms(Cn,it,G,z,p.state.transmissionRenderTarget[R.id]),gr.upload(B,$e($t),Cn,k)),it.isShaderMaterial&&it.uniformsNeedUpdate===!0&&(gr.upload(B,$e($t),Cn,k),it.uniformsNeedUpdate=!1),it.isSpriteMaterial&&Ee.setValue(B,"center",W.center),Ee.setValue(B,"modelViewMatrix",W.modelViewMatrix),Ee.setValue(B,"normalMatrix",W.normalMatrix),Ee.setValue(B,"modelMatrix",W.matrixWorld),it.isShaderMaterial||it.isRawShaderMaterial){const gn=it.uniformsGroups;for(let Xn=0,qn=gn.length;Xn<qn;Xn++){const Oi=gn[Xn];U.update(Oi,Qe),U.bind(Oi,Qe)}}return Qe}function Vn(R,X){R.ambientLightColor.needsUpdate=X,R.lightProbe.needsUpdate=X,R.directionalLights.needsUpdate=X,R.directionalLightShadows.needsUpdate=X,R.pointLights.needsUpdate=X,R.pointLightShadows.needsUpdate=X,R.spotLights.needsUpdate=X,R.spotLightShadows.needsUpdate=X,R.rectAreaLights.needsUpdate=X,R.hemisphereLights.needsUpdate=X}function jn(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(R,X,nt){Bt.get(R.texture).__webglTexture=X,Bt.get(R.depthTexture).__webglTexture=nt;const it=Bt.get(R);it.__hasExternalTextures=!0,it.__autoAllocateDepthBuffer=nt===void 0,it.__autoAllocateDepthBuffer||Ot.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),it.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(R,X){const nt=Bt.get(R);nt.__webglFramebuffer=X,nt.__useDefaultFramebuffer=X===void 0},this.setRenderTarget=function(R,X=0,nt=0){A=R,S=X,E=nt;let it=!0,W=null,At=!1,Ut=!1;if(R){const Zt=Bt.get(R);if(Zt.__useDefaultFramebuffer!==void 0)xt.bindFramebuffer(B.FRAMEBUFFER,null),it=!1;else if(Zt.__webglFramebuffer===void 0)k.setupRenderTarget(R);else if(Zt.__hasExternalTextures)k.rebindTextures(R,Bt.get(R.texture).__webglTexture,Bt.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){const lt=R.depthTexture;if(Zt.__boundDepthTexture!==lt){if(lt!==null&&Bt.has(lt)&&(R.width!==lt.image.width||R.height!==lt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");k.setupDepthRenderbuffer(R)}}const Jt=R.texture;(Jt.isData3DTexture||Jt.isDataArrayTexture||Jt.isCompressedArrayTexture)&&(Ut=!0);const Rt=Bt.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(Rt[X])?W=Rt[X][nt]:W=Rt[X],At=!0):R.samples>0&&k.useMultisampledRTT(R)===!1?W=Bt.get(R).__webglMultisampledFramebuffer:Array.isArray(Rt)?W=Rt[nt]:W=Rt,P.copy(R.viewport),C.copy(R.scissor),F=R.scissorTest}else P.copy(ft).multiplyScalar(G).floor(),C.copy(vt).multiplyScalar(G).floor(),F=It;if(xt.bindFramebuffer(B.FRAMEBUFFER,W)&&it&&xt.drawBuffers(R,W),xt.viewport(P),xt.scissor(C),xt.setScissorTest(F),At){const Zt=Bt.get(R.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+X,Zt.__webglTexture,nt)}else if(Ut){const Zt=Bt.get(R.texture),Jt=X||0;B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,Zt.__webglTexture,nt||0,Jt)}b=-1},this.readRenderTargetPixels=function(R,X,nt,it,W,At,Ut){if(!(R&&R.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Wt=Bt.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Ut!==void 0&&(Wt=Wt[Ut]),Wt){xt.bindFramebuffer(B.FRAMEBUFFER,Wt);try{const Zt=R.texture,Jt=Zt.format,Rt=Zt.type;if(!Ct.textureFormatReadable(Jt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ct.textureTypeReadable(Rt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}X>=0&&X<=R.width-it&&nt>=0&&nt<=R.height-W&&B.readPixels(X,nt,it,W,Ht.convert(Jt),Ht.convert(Rt),At)}finally{const Zt=A!==null?Bt.get(A).__webglFramebuffer:null;xt.bindFramebuffer(B.FRAMEBUFFER,Zt)}}},this.readRenderTargetPixelsAsync=async function(R,X,nt,it,W,At,Ut){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Wt=Bt.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Ut!==void 0&&(Wt=Wt[Ut]),Wt){const Zt=R.texture,Jt=Zt.format,Rt=Zt.type;if(!Ct.textureFormatReadable(Jt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ct.textureTypeReadable(Rt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(X>=0&&X<=R.width-it&&nt>=0&&nt<=R.height-W){xt.bindFramebuffer(B.FRAMEBUFFER,Wt);const lt=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,lt),B.bufferData(B.PIXEL_PACK_BUFFER,At.byteLength,B.STREAM_READ),B.readPixels(X,nt,it,W,Ht.convert(Jt),Ht.convert(Rt),0);const Et=A!==null?Bt.get(A).__webglFramebuffer:null;xt.bindFramebuffer(B.FRAMEBUFFER,Et);const jt=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await xy(B,jt,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,lt),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,At),B.deleteBuffer(lt),B.deleteSync(jt),At}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(R,X=null,nt=0){R.isTexture!==!0&&(Vs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),X=arguments[0]||null,R=arguments[1]);const it=Math.pow(2,-nt),W=Math.floor(R.image.width*it),At=Math.floor(R.image.height*it),Ut=X!==null?X.x:0,Wt=X!==null?X.y:0;k.setTexture2D(R,0),B.copyTexSubImage2D(B.TEXTURE_2D,nt,0,0,Ut,Wt,W,At),xt.unbindTexture()},this.copyTextureToTexture=function(R,X,nt=null,it=null,W=0){R.isTexture!==!0&&(Vs("WebGLRenderer: copyTextureToTexture function signature has changed."),it=arguments[0]||null,R=arguments[1],X=arguments[2],W=arguments[3]||0,nt=null);let At,Ut,Wt,Zt,Jt,Rt,lt,Et,jt;const oe=R.isCompressedTexture?R.mipmaps[W]:R.image;nt!==null?(At=nt.max.x-nt.min.x,Ut=nt.max.y-nt.min.y,Wt=nt.isBox3?nt.max.z-nt.min.z:1,Zt=nt.min.x,Jt=nt.min.y,Rt=nt.isBox3?nt.min.z:0):(At=oe.width,Ut=oe.height,Wt=oe.depth||1,Zt=0,Jt=0,Rt=0),it!==null?(lt=it.x,Et=it.y,jt=it.z):(lt=0,Et=0,jt=0);const ze=Ht.convert(X.format),le=Ht.convert(X.type);let $t;X.isData3DTexture?(k.setTexture3D(X,0),$t=B.TEXTURE_3D):X.isDataArrayTexture||X.isCompressedArrayTexture?(k.setTexture2DArray(X,0),$t=B.TEXTURE_2D_ARRAY):(k.setTexture2D(X,0),$t=B.TEXTURE_2D),B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,X.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,X.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,X.unpackAlignment);const ln=B.getParameter(B.UNPACK_ROW_LENGTH),he=B.getParameter(B.UNPACK_IMAGE_HEIGHT),Qe=B.getParameter(B.UNPACK_SKIP_PIXELS),bn=B.getParameter(B.UNPACK_SKIP_ROWS),ke=B.getParameter(B.UNPACK_SKIP_IMAGES);B.pixelStorei(B.UNPACK_ROW_LENGTH,oe.width),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,oe.height),B.pixelStorei(B.UNPACK_SKIP_PIXELS,Zt),B.pixelStorei(B.UNPACK_SKIP_ROWS,Jt),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Rt);const hn=R.isDataArrayTexture||R.isData3DTexture,Ee=X.isDataArrayTexture||X.isData3DTexture;if(R.isRenderTargetTexture||R.isDepthTexture){const Cn=Bt.get(R),Si=Bt.get(X),gn=Bt.get(Cn.__renderTarget),Xn=Bt.get(Si.__renderTarget);xt.bindFramebuffer(B.READ_FRAMEBUFFER,gn.__webglFramebuffer),xt.bindFramebuffer(B.DRAW_FRAMEBUFFER,Xn.__webglFramebuffer);for(let qn=0;qn<Wt;qn++)hn&&B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Bt.get(R).__webglTexture,W,Rt+qn),R.isDepthTexture?(Ee&&B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Bt.get(X).__webglTexture,W,jt+qn),B.blitFramebuffer(Zt,Jt,At,Ut,lt,Et,At,Ut,B.DEPTH_BUFFER_BIT,B.NEAREST)):Ee?B.copyTexSubImage3D($t,W,lt,Et,jt+qn,Zt,Jt,At,Ut):B.copyTexSubImage2D($t,W,lt,Et,jt+qn,Zt,Jt,At,Ut);xt.bindFramebuffer(B.READ_FRAMEBUFFER,null),xt.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else Ee?R.isDataTexture||R.isData3DTexture?B.texSubImage3D($t,W,lt,Et,jt,At,Ut,Wt,ze,le,oe.data):X.isCompressedArrayTexture?B.compressedTexSubImage3D($t,W,lt,Et,jt,At,Ut,Wt,ze,oe.data):B.texSubImage3D($t,W,lt,Et,jt,At,Ut,Wt,ze,le,oe):R.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,W,lt,Et,At,Ut,ze,le,oe.data):R.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,W,lt,Et,oe.width,oe.height,ze,oe.data):B.texSubImage2D(B.TEXTURE_2D,W,lt,Et,At,Ut,ze,le,oe);B.pixelStorei(B.UNPACK_ROW_LENGTH,ln),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,he),B.pixelStorei(B.UNPACK_SKIP_PIXELS,Qe),B.pixelStorei(B.UNPACK_SKIP_ROWS,bn),B.pixelStorei(B.UNPACK_SKIP_IMAGES,ke),W===0&&X.generateMipmaps&&B.generateMipmap($t),xt.unbindTexture()},this.copyTextureToTexture3D=function(R,X,nt=null,it=null,W=0){return R.isTexture!==!0&&(Vs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),nt=arguments[0]||null,it=arguments[1]||null,R=arguments[2],X=arguments[3],W=arguments[4]||0),Vs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(R,X,nt,it,W)},this.initRenderTarget=function(R){Bt.get(R).__webglFramebuffer===void 0&&k.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?k.setTextureCube(R,0):R.isData3DTexture?k.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?k.setTexture2DArray(R,0):k.setTexture2D(R,0),xt.unbindTexture()},this.resetState=function(){S=0,E=0,A=null,xt.reset(),qt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return zi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=be._getDrawingBufferColorSpace(t),e.unpackColorSpace=be._getUnpackColorSpace()}}class PS extends Ye{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Mi,this.environmentIntensity=1,this.environmentRotation=new Mi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class CS{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=ah,this.updateRanges=[],this.version=0,this.uuid=_i()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let a=0,s=this.stride;a<s;a++)this.array[t+a]=e.array[i+a];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=_i()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=_i()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Tn=new H;class Lr{constructor(t,e,i,a=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=a}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)Tn.fromBufferAttribute(this,e),Tn.applyMatrix4(t),this.setXYZ(e,Tn.x,Tn.y,Tn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Tn.fromBufferAttribute(this,e),Tn.applyNormalMatrix(t),this.setXYZ(e,Tn.x,Tn.y,Tn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Tn.fromBufferAttribute(this,e),Tn.transformDirection(t),this.setXYZ(e,Tn.x,Tn.y,Tn.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=oi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Re(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=Re(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Re(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Re(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Re(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=oi(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=oi(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=oi(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=oi(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=Re(e,this.array),i=Re(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=Re(e,this.array),i=Re(i,this.array),a=Re(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Re(e,this.array),i=Re(i,this.array),a=Re(a,this.array),s=Re(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this.data.array[t+3]=s,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return new mn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Lr(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class oh extends La{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new se(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let ns;const Os=new H,is=new H,as=new H,ss=new Yt,Bs=new Yt,Hp=new Ue,Jo=new H,Hs=new H,Qo=new H,af=new Yt,jc=new Yt,sf=new Yt;class of extends Ye{constructor(t=new oh){if(super(),this.isSprite=!0,this.type="Sprite",ns===void 0){ns=new sn;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new CS(e,5);ns.setIndex([0,1,2,0,2,3]),ns.setAttribute("position",new Lr(i,3,0,!1)),ns.setAttribute("uv",new Lr(i,2,3,!1))}this.geometry=ns,this.material=t,this.center=new Yt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),is.setFromMatrixScale(this.matrixWorld),Hp.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),as.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&is.multiplyScalar(-as.z);const i=this.material.rotation;let a,s;i!==0&&(s=Math.cos(i),a=Math.sin(i));const o=this.center;tr(Jo.set(-.5,-.5,0),as,o,is,a,s),tr(Hs.set(.5,-.5,0),as,o,is,a,s),tr(Qo.set(.5,.5,0),as,o,is,a,s),af.set(0,0),jc.set(1,0),sf.set(1,1);let r=t.ray.intersectTriangle(Jo,Hs,Qo,!1,Os);if(r===null&&(tr(Hs.set(-.5,.5,0),as,o,is,a,s),jc.set(0,1),r=t.ray.intersectTriangle(Jo,Qo,Hs,!1,Os),r===null))return;const l=t.ray.origin.distanceTo(Os);l<t.near||l>t.far||e.push({distance:l,point:Os.clone(),uv:Gn.getInterpolation(Os,Jo,Hs,Qo,af,jc,sf,new Yt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function tr(n,t,e,i,a,s){ss.subVectors(n,e).addScalar(.5).multiply(i),a!==void 0?(Bs.x=s*ss.x-a*ss.y,Bs.y=a*ss.x+s*ss.y):Bs.copy(ss),n.copy(t),n.x+=Bs.x,n.y+=Bs.y,n.applyMatrix4(Hp)}class Fh extends La{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new se(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Dr=new H,kr=new H,rf=new Ue,Gs=new Lh,er=new Vr,qc=new H,cf=new H;class LS extends Ye{constructor(t=new sn,e=new Fh){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let a=1,s=e.count;a<s;a++)Dr.fromBufferAttribute(e,a-1),kr.fromBufferAttribute(e,a),i[a]=i[a-1],i[a]+=Dr.distanceTo(kr);t.setAttribute("lineDistance",new Se(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,a=this.matrixWorld,s=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),er.copy(i.boundingSphere),er.applyMatrix4(a),er.radius+=s,t.ray.intersectsSphere(er)===!1)return;rf.copy(a).invert(),Gs.copy(t.ray).applyMatrix4(rf);const r=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=r*r,c=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const f=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=c){const p=h.getX(_),y=h.getX(_+1),x=nr(this,t,Gs,l,p,y);x&&e.push(x)}if(this.isLineLoop){const _=h.getX(g-1),m=h.getX(f),p=nr(this,t,Gs,l,_,m);p&&e.push(p)}}else{const f=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=c){const p=nr(this,t,Gs,l,_,_+1);p&&e.push(p)}if(this.isLineLoop){const _=nr(this,t,Gs,l,g-1,f);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}}function nr(n,t,e,i,a,s){const o=n.geometry.attributes.position;if(Dr.fromBufferAttribute(o,a),kr.fromBufferAttribute(o,s),e.distanceSqToSegment(Dr,kr,qc,cf)>i)return;qc.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(qc);if(!(l<t.near||l>t.far))return{distance:l,point:cf.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const lf=new H,hf=new H;class Gp extends LS{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let a=0,s=e.count;a<s;a+=2)lf.fromBufferAttribute(e,a),hf.fromBufferAttribute(e,a+1),i[a]=a===0?0:i[a-1],i[a+1]=i[a]+lf.distanceTo(hf);t.setAttribute("lineDistance",new Se(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class rh extends Pn{constructor(t,e,i,a,s,o,r,l,c){super(t,e,i,a,s,o,r,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class bi{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,a=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),s+=i.distanceTo(a),e.push(s),a=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let a=0;const s=i.length;let o;e?o=e:o=t*i[s-1];let r=0,l=s-1,c;for(;r<=l;)if(a=Math.floor(r+(l-r)/2),c=i[a]-o,c<0)r=a+1;else if(c>0)l=a-1;else{l=a;break}if(a=l,i[a]===o)return a/(s-1);const h=i[a],d=i[a+1]-h,f=(o-h)/d;return(a+f)/(s-1)}getTangent(t,e){let a=t-1e-4,s=t+1e-4;a<0&&(a=0),s>1&&(s=1);const o=this.getPoint(a),r=this.getPoint(s),l=e||(o.isVector2?new Yt:new H);return l.copy(r).sub(o).normalize(),l}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new H,a=[],s=[],o=[],r=new H,l=new Ue;for(let f=0;f<=t;f++){const g=f/t;a[f]=this.getTangentAt(g,new H)}s[0]=new H,o[0]=new H;let c=Number.MAX_VALUE;const h=Math.abs(a[0].x),u=Math.abs(a[0].y),d=Math.abs(a[0].z);h<=c&&(c=h,i.set(1,0,0)),u<=c&&(c=u,i.set(0,1,0)),d<=c&&i.set(0,0,1),r.crossVectors(a[0],i).normalize(),s[0].crossVectors(a[0],r),o[0].crossVectors(a[0],s[0]);for(let f=1;f<=t;f++){if(s[f]=s[f-1].clone(),o[f]=o[f-1].clone(),r.crossVectors(a[f-1],a[f]),r.length()>Number.EPSILON){r.normalize();const g=Math.acos(pn(a[f-1].dot(a[f]),-1,1));s[f].applyMatrix4(l.makeRotationAxis(r,g))}o[f].crossVectors(a[f],s[f])}if(e===!0){let f=Math.acos(pn(s[0].dot(s[t]),-1,1));f/=t,a[0].dot(r.crossVectors(s[0],s[t]))>0&&(f=-f);for(let g=1;g<=t;g++)s[g].applyMatrix4(l.makeRotationAxis(a[g],f*g)),o[g].crossVectors(a[g],s[g])}return{tangents:a,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class zh extends bi{constructor(t=0,e=0,i=1,a=1,s=0,o=Math.PI*2,r=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=a,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=r,this.aRotation=l}getPoint(t,e=new Yt){const i=e,a=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=a;for(;s>a;)s-=a;s<Number.EPSILON&&(o?s=0:s=a),this.aClockwise===!0&&!o&&(s===a?s=-a:s=s-a);const r=this.aStartAngle+t*s;let l=this.aX+this.xRadius*Math.cos(r),c=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return i.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class DS extends zh{constructor(t,e,i,a,s,o){super(t,e,i,i,a,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Nh(){let n=0,t=0,e=0,i=0;function a(s,o,r,l){n=s,t=r,e=-3*s+3*o-2*r-l,i=2*s-2*o+r+l}return{initCatmullRom:function(s,o,r,l,c){a(o,r,c*(r-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,r,l,c,h,u){let d=(o-s)/c-(r-s)/(c+h)+(r-o)/h,f=(r-o)/h-(l-o)/(h+u)+(l-r)/u;d*=h,f*=h,a(o,r,d,f)},calc:function(s){const o=s*s,r=o*s;return n+t*s+e*o+i*r}}}const ir=new H,Kc=new Nh,Jc=new Nh,Qc=new Nh;class kS extends bi{constructor(t=[],e=!1,i="centripetal",a=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=a}getPoint(t,e=new H){const i=e,a=this.points,s=a.length,o=(s-(this.closed?0:1))*t;let r=Math.floor(o),l=o-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/s)+1)*s:l===0&&r===s-1&&(r=s-2,l=1);let c,h;this.closed||r>0?c=a[(r-1)%s]:(ir.subVectors(a[0],a[1]).add(a[0]),c=ir);const u=a[r%s],d=a[(r+1)%s];if(this.closed||r+2<s?h=a[(r+2)%s]:(ir.subVectors(a[s-1],a[s-2]).add(a[s-1]),h=ir),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),f),_=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),Kc.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,g,_,m),Jc.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,g,_,m),Qc.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,g,_,m)}else this.curveType==="catmullrom"&&(Kc.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),Jc.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),Qc.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return i.set(Kc.calc(l),Jc.calc(l),Qc.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new H().fromArray(a))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function df(n,t,e,i,a){const s=(i-t)*.5,o=(a-e)*.5,r=n*n,l=n*r;return(2*e-2*i+s+o)*l+(-3*e+3*i-2*s-o)*r+s*n+e}function IS(n,t){const e=1-n;return e*e*t}function FS(n,t){return 2*(1-n)*n*t}function zS(n,t){return n*n*t}function qs(n,t,e,i){return IS(n,t)+FS(n,e)+zS(n,i)}function NS(n,t){const e=1-n;return e*e*e*t}function US(n,t){const e=1-n;return 3*e*e*n*t}function OS(n,t){return 3*(1-n)*n*n*t}function BS(n,t){return n*n*n*t}function Ks(n,t,e,i,a){return NS(n,t)+US(n,e)+OS(n,i)+BS(n,a)}class Vp extends bi{constructor(t=new Yt,e=new Yt,i=new Yt,a=new Yt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new Yt){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(Ks(t,a.x,s.x,o.x,r.x),Ks(t,a.y,s.y,o.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class HS extends bi{constructor(t=new H,e=new H,i=new H,a=new H){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new H){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(Ks(t,a.x,s.x,o.x,r.x),Ks(t,a.y,s.y,o.y,r.y),Ks(t,a.z,s.z,o.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Xp extends bi{constructor(t=new Yt,e=new Yt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Yt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Yt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class GS extends bi{constructor(t=new H,e=new H){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new H){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new H){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Wp extends bi{constructor(t=new Yt,e=new Yt,i=new Yt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Yt){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(qs(t,a.x,s.x,o.x),qs(t,a.y,s.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class VS extends bi{constructor(t=new H,e=new H,i=new H){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new H){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(qs(t,a.x,s.x,o.x),qs(t,a.y,s.y,o.y),qs(t,a.z,s.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Yp extends bi{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Yt){const i=e,a=this.points,s=(a.length-1)*t,o=Math.floor(s),r=s-o,l=a[o===0?o:o-1],c=a[o],h=a[o>a.length-2?a.length-1:o+1],u=a[o>a.length-3?a.length-1:o+2];return i.set(df(r,l.x,c.x,h.x,u.x),df(r,l.y,c.y,h.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new Yt().fromArray(a))}return this}}var uf=Object.freeze({__proto__:null,ArcCurve:DS,CatmullRomCurve3:kS,CubicBezierCurve:Vp,CubicBezierCurve3:HS,EllipseCurve:zh,LineCurve:Xp,LineCurve3:GS,QuadraticBezierCurve:Wp,QuadraticBezierCurve3:VS,SplineCurve:Yp});class XS extends bi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new uf[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),a=this.getCurveLengths();let s=0;for(;s<a.length;){if(a[s]>=i){const o=a[s]-i,r=this.curves[s],l=r.getLength(),c=l===0?0:1-o/l;return r.getPointAt(c,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,a=this.curves.length;i<a;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let a=0,s=this.curves;a<s.length;a++){const o=s[a],r=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(r);for(let c=0;c<l.length;c++){const h=l[c];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(a.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const a=this.curves[e];t.curves.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(new uf[a.type]().fromJSON(a))}return this}}class ff extends XS{constructor(t){super(),this.type="Path",this.currentPoint=new Yt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new Xp(this.currentPoint.clone(),new Yt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,a){const s=new Wp(this.currentPoint.clone(),new Yt(t,e),new Yt(i,a));return this.curves.push(s),this.currentPoint.set(i,a),this}bezierCurveTo(t,e,i,a,s,o){const r=new Vp(this.currentPoint.clone(),new Yt(t,e),new Yt(i,a),new Yt(s,o));return this.curves.push(r),this.currentPoint.set(s,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new Yp(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,a,s,o){const r=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+r,e+l,i,a,s,o),this}absarc(t,e,i,a,s,o){return this.absellipse(t,e,i,i,a,s,o),this}ellipse(t,e,i,a,s,o,r,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,i,a,s,o,r,l),this}absellipse(t,e,i,a,s,o,r,l){const c=new zh(t,e,i,a,s,o,r,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Uh extends sn{constructor(t=1,e=32,i=0,a=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:a},e=Math.max(3,e);const s=[],o=[],r=[],l=[],c=new H,h=new Yt;o.push(0,0,0),r.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=i+u/e*a;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),r.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let u=1;u<=e;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new Se(o,3)),this.setAttribute("normal",new Se(r,3)),this.setAttribute("uv",new Se(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Uh(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class oo extends sn{constructor(t=1,e=1,i=1,a=32,s=1,o=!1,r=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:a,heightSegments:s,openEnded:o,thetaStart:r,thetaLength:l};const c=this;a=Math.floor(a),s=Math.floor(s);const h=[],u=[],d=[],f=[];let g=0;const _=[],m=i/2;let p=0;y(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new Se(u,3)),this.setAttribute("normal",new Se(d,3)),this.setAttribute("uv",new Se(f,2));function y(){const v=new H,w=new H;let S=0;const E=(e-t)/i;for(let A=0;A<=s;A++){const b=[],M=A/s,P=M*(e-t)+t;for(let C=0;C<=a;C++){const F=C/a,N=F*l+r,L=Math.sin(N),I=Math.cos(N);w.x=P*L,w.y=-M*i+m,w.z=P*I,u.push(w.x,w.y,w.z),v.set(L,E,I).normalize(),d.push(v.x,v.y,v.z),f.push(F,1-M),b.push(g++)}_.push(b)}for(let A=0;A<a;A++)for(let b=0;b<s;b++){const M=_[b][A],P=_[b+1][A],C=_[b+1][A+1],F=_[b][A+1];(t>0||b!==0)&&(h.push(M,P,F),S+=3),(e>0||b!==s-1)&&(h.push(P,C,F),S+=3)}c.addGroup(p,S,0),p+=S}function x(v){const w=g,S=new Yt,E=new H;let A=0;const b=v===!0?t:e,M=v===!0?1:-1;for(let C=1;C<=a;C++)u.push(0,m*M,0),d.push(0,M,0),f.push(.5,.5),g++;const P=g;for(let C=0;C<=a;C++){const N=C/a*l+r,L=Math.cos(N),I=Math.sin(N);E.x=b*I,E.y=m*M,E.z=b*L,u.push(E.x,E.y,E.z),d.push(0,M,0),S.x=L*.5+.5,S.y=I*.5*M+.5,f.push(S.x,S.y),g++}for(let C=0;C<a;C++){const F=w+C,N=P+C;v===!0?h.push(N,N+1,F):h.push(N+1,N,F),A+=3}c.addGroup(p,A,v===!0?1:2),p+=A}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new oo(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Oh extends oo{constructor(t=1,e=1,i=32,a=1,s=!1,o=0,r=Math.PI*2){super(0,t,e,i,a,s,o,r),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:a,openEnded:s,thetaStart:o,thetaLength:r}}static fromJSON(t){return new Oh(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Bh extends sn{constructor(t=[],e=[],i=1,a=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:a};const s=[],o=[];r(a),c(i),h(),this.setAttribute("position",new Se(s,3)),this.setAttribute("normal",new Se(s.slice(),3)),this.setAttribute("uv",new Se(o,2)),a===0?this.computeVertexNormals():this.normalizeNormals();function r(y){const x=new H,v=new H,w=new H;for(let S=0;S<e.length;S+=3)f(e[S+0],x),f(e[S+1],v),f(e[S+2],w),l(x,v,w,y)}function l(y,x,v,w){const S=w+1,E=[];for(let A=0;A<=S;A++){E[A]=[];const b=y.clone().lerp(v,A/S),M=x.clone().lerp(v,A/S),P=S-A;for(let C=0;C<=P;C++)C===0&&A===S?E[A][C]=b:E[A][C]=b.clone().lerp(M,C/P)}for(let A=0;A<S;A++)for(let b=0;b<2*(S-A)-1;b++){const M=Math.floor(b/2);b%2===0?(d(E[A][M+1]),d(E[A+1][M]),d(E[A][M])):(d(E[A][M+1]),d(E[A+1][M+1]),d(E[A+1][M]))}}function c(y){const x=new H;for(let v=0;v<s.length;v+=3)x.x=s[v+0],x.y=s[v+1],x.z=s[v+2],x.normalize().multiplyScalar(y),s[v+0]=x.x,s[v+1]=x.y,s[v+2]=x.z}function h(){const y=new H;for(let x=0;x<s.length;x+=3){y.x=s[x+0],y.y=s[x+1],y.z=s[x+2];const v=m(y)/2/Math.PI+.5,w=p(y)/Math.PI+.5;o.push(v,1-w)}g(),u()}function u(){for(let y=0;y<o.length;y+=6){const x=o[y+0],v=o[y+2],w=o[y+4],S=Math.max(x,v,w),E=Math.min(x,v,w);S>.9&&E<.1&&(x<.2&&(o[y+0]+=1),v<.2&&(o[y+2]+=1),w<.2&&(o[y+4]+=1))}}function d(y){s.push(y.x,y.y,y.z)}function f(y,x){const v=y*3;x.x=t[v+0],x.y=t[v+1],x.z=t[v+2]}function g(){const y=new H,x=new H,v=new H,w=new H,S=new Yt,E=new Yt,A=new Yt;for(let b=0,M=0;b<s.length;b+=9,M+=6){y.set(s[b+0],s[b+1],s[b+2]),x.set(s[b+3],s[b+4],s[b+5]),v.set(s[b+6],s[b+7],s[b+8]),S.set(o[M+0],o[M+1]),E.set(o[M+2],o[M+3]),A.set(o[M+4],o[M+5]),w.copy(y).add(x).add(v).divideScalar(3);const P=m(w);_(S,M+0,y,P),_(E,M+2,x,P),_(A,M+4,v,P)}}function _(y,x,v,w){w<0&&y.x===1&&(o[x]=y.x-1),v.x===0&&v.z===0&&(o[x]=w/2/Math.PI+.5)}function m(y){return Math.atan2(y.z,-y.x)}function p(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Bh(t.vertices,t.indices,t.radius,t.details)}}const ar=new H,sr=new H,tl=new H,or=new Gn;class WS extends sn{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const a=Math.pow(10,4),s=Math.cos(fs*e),o=t.getIndex(),r=t.getAttribute("position"),l=o?o.count:r.count,c=[0,0,0],h=["a","b","c"],u=new Array(3),d={},f=[];for(let g=0;g<l;g+=3){o?(c[0]=o.getX(g),c[1]=o.getX(g+1),c[2]=o.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);const{a:_,b:m,c:p}=or;if(_.fromBufferAttribute(r,c[0]),m.fromBufferAttribute(r,c[1]),p.fromBufferAttribute(r,c[2]),or.getNormal(tl),u[0]=`${Math.round(_.x*a)},${Math.round(_.y*a)},${Math.round(_.z*a)}`,u[1]=`${Math.round(m.x*a)},${Math.round(m.y*a)},${Math.round(m.z*a)}`,u[2]=`${Math.round(p.x*a)},${Math.round(p.y*a)},${Math.round(p.z*a)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let y=0;y<3;y++){const x=(y+1)%3,v=u[y],w=u[x],S=or[h[y]],E=or[h[x]],A=`${v}_${w}`,b=`${w}_${v}`;b in d&&d[b]?(tl.dot(d[b].normal)<=s&&(f.push(S.x,S.y,S.z),f.push(E.x,E.y,E.z)),d[b]=null):A in d||(d[A]={index0:c[y],index1:c[x],normal:tl.clone()})}}for(const g in d)if(d[g]){const{index0:_,index1:m}=d[g];ar.fromBufferAttribute(r,_),sr.fromBufferAttribute(r,m),f.push(ar.x,ar.y,ar.z),f.push(sr.x,sr.y,sr.z)}this.setAttribute("position",new Se(f,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class $p extends ff{constructor(t){super(t),this.uuid=_i(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,a=this.holes.length;i<a;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const a=this.holes[e];t.holes.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(new ff().fromJSON(a))}return this}}const YS={triangulate:function(n,t,e=2){const i=t&&t.length,a=i?t[0]*e:n.length;let s=Zp(n,0,a,e,!0);const o=[];if(!s||s.next===s.prev)return o;let r,l,c,h,u,d,f;if(i&&(s=KS(n,t,s,e)),n.length>80*e){r=c=n[0],l=h=n[1];for(let g=e;g<a;g+=e)u=n[g],d=n[g+1],u<r&&(r=u),d<l&&(l=d),u>c&&(c=u),d>h&&(h=d);f=Math.max(c-r,h-l),f=f!==0?32767/f:0}return ro(s,o,e,r,l,f,0),o}};function Zp(n,t,e,i,a){let s,o;if(a===cw(n,t,e,i)>0)for(s=t;s<e;s+=i)o=pf(s,n[s],n[s+1],o);else for(s=e-i;s>=t;s-=i)o=pf(s,n[s],n[s+1],o);return o&&Wr(o,o.next)&&(lo(o),o=o.next),o}function Ca(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(Wr(e,e.next)||We(e.prev,e,e.next)===0)){if(lo(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function ro(n,t,e,i,a,s,o){if(!n)return;!o&&s&&nw(n,i,a,s);let r=n,l,c;for(;n.prev!==n.next;){if(l=n.prev,c=n.next,s?ZS(n,i,a,s):$S(n)){t.push(l.i/e|0),t.push(n.i/e|0),t.push(c.i/e|0),lo(n),n=c.next,r=c.next;continue}if(n=c,n===r){o?o===1?(n=jS(Ca(n),t,e),ro(n,t,e,i,a,s,2)):o===2&&qS(n,t,e,i,a,s):ro(Ca(n),t,e,i,a,s,1);break}}}function $S(n){const t=n.prev,e=n,i=n.next;if(We(t,e,i)>=0)return!1;const a=t.x,s=e.x,o=i.x,r=t.y,l=e.y,c=i.y,h=a<s?a<o?a:o:s<o?s:o,u=r<l?r<c?r:c:l<c?l:c,d=a>s?a>o?a:o:s>o?s:o,f=r>l?r>c?r:c:l>c?l:c;let g=i.next;for(;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=f&&ls(a,r,s,l,o,c,g.x,g.y)&&We(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function ZS(n,t,e,i){const a=n.prev,s=n,o=n.next;if(We(a,s,o)>=0)return!1;const r=a.x,l=s.x,c=o.x,h=a.y,u=s.y,d=o.y,f=r<l?r<c?r:c:l<c?l:c,g=h<u?h<d?h:d:u<d?u:d,_=r>l?r>c?r:c:l>c?l:c,m=h>u?h>d?h:d:u>d?u:d,p=ch(f,g,t,e,i),y=ch(_,m,t,e,i);let x=n.prevZ,v=n.nextZ;for(;x&&x.z>=p&&v&&v.z<=y;){if(x.x>=f&&x.x<=_&&x.y>=g&&x.y<=m&&x!==a&&x!==o&&ls(r,h,l,u,c,d,x.x,x.y)&&We(x.prev,x,x.next)>=0||(x=x.prevZ,v.x>=f&&v.x<=_&&v.y>=g&&v.y<=m&&v!==a&&v!==o&&ls(r,h,l,u,c,d,v.x,v.y)&&We(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;x&&x.z>=p;){if(x.x>=f&&x.x<=_&&x.y>=g&&x.y<=m&&x!==a&&x!==o&&ls(r,h,l,u,c,d,x.x,x.y)&&We(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;v&&v.z<=y;){if(v.x>=f&&v.x<=_&&v.y>=g&&v.y<=m&&v!==a&&v!==o&&ls(r,h,l,u,c,d,v.x,v.y)&&We(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function jS(n,t,e){let i=n;do{const a=i.prev,s=i.next.next;!Wr(a,s)&&jp(a,i,i.next,s)&&co(a,s)&&co(s,a)&&(t.push(a.i/e|0),t.push(i.i/e|0),t.push(s.i/e|0),lo(i),lo(i.next),i=n=s),i=i.next}while(i!==n);return Ca(i)}function qS(n,t,e,i,a,s){let o=n;do{let r=o.next.next;for(;r!==o.prev;){if(o.i!==r.i&&sw(o,r)){let l=qp(o,r);o=Ca(o,o.next),l=Ca(l,l.next),ro(o,t,e,i,a,s,0),ro(l,t,e,i,a,s,0);return}r=r.next}o=o.next}while(o!==n)}function KS(n,t,e,i){const a=[];let s,o,r,l,c;for(s=0,o=t.length;s<o;s++)r=t[s]*i,l=s<o-1?t[s+1]*i:n.length,c=Zp(n,r,l,i,!1),c===c.next&&(c.steiner=!0),a.push(aw(c));for(a.sort(JS),s=0;s<a.length;s++)e=QS(a[s],e);return e}function JS(n,t){return n.x-t.x}function QS(n,t){const e=tw(n,t);if(!e)return t;const i=qp(e,n);return Ca(i,i.next),Ca(e,e.next)}function tw(n,t){let e=t,i=-1/0,a;const s=n.x,o=n.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=s&&d>i&&(i=d,a=e.x<e.next.x?e:e.next,d===s))return a}e=e.next}while(e!==t);if(!a)return null;const r=a,l=a.x,c=a.y;let h=1/0,u;e=a;do s>=e.x&&e.x>=l&&s!==e.x&&ls(o<c?s:i,o,l,c,o<c?i:s,o,e.x,e.y)&&(u=Math.abs(o-e.y)/(s-e.x),co(e,n)&&(u<h||u===h&&(e.x>a.x||e.x===a.x&&ew(a,e)))&&(a=e,h=u)),e=e.next;while(e!==r);return a}function ew(n,t){return We(n.prev,n,t.prev)<0&&We(t.next,n,n.next)<0}function nw(n,t,e,i){let a=n;do a.z===0&&(a.z=ch(a.x,a.y,t,e,i)),a.prevZ=a.prev,a.nextZ=a.next,a=a.next;while(a!==n);a.prevZ.nextZ=null,a.prevZ=null,iw(a)}function iw(n){let t,e,i,a,s,o,r,l,c=1;do{for(e=n,n=null,s=null,o=0;e;){for(o++,i=e,r=0,t=0;t<c&&(r++,i=i.nextZ,!!i);t++);for(l=c;r>0||l>0&&i;)r!==0&&(l===0||!i||e.z<=i.z)?(a=e,e=e.nextZ,r--):(a=i,i=i.nextZ,l--),s?s.nextZ=a:n=a,a.prevZ=s,s=a;e=i}s.nextZ=null,c*=2}while(o>1);return n}function ch(n,t,e,i,a){return n=(n-e)*a|0,t=(t-i)*a|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function aw(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function ls(n,t,e,i,a,s,o,r){return(a-o)*(t-r)>=(n-o)*(s-r)&&(n-o)*(i-r)>=(e-o)*(t-r)&&(e-o)*(s-r)>=(a-o)*(i-r)}function sw(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!ow(n,t)&&(co(n,t)&&co(t,n)&&rw(n,t)&&(We(n.prev,n,t.prev)||We(n,t.prev,t))||Wr(n,t)&&We(n.prev,n,n.next)>0&&We(t.prev,t,t.next)>0)}function We(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function Wr(n,t){return n.x===t.x&&n.y===t.y}function jp(n,t,e,i){const a=cr(We(n,t,e)),s=cr(We(n,t,i)),o=cr(We(e,i,n)),r=cr(We(e,i,t));return!!(a!==s&&o!==r||a===0&&rr(n,e,t)||s===0&&rr(n,i,t)||o===0&&rr(e,n,i)||r===0&&rr(e,t,i))}function rr(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function cr(n){return n>0?1:n<0?-1:0}function ow(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&jp(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function co(n,t){return We(n.prev,n,n.next)<0?We(n,t,n.next)>=0&&We(n,n.prev,t)>=0:We(n,t,n.prev)<0||We(n,n.next,t)<0}function rw(n,t){let e=n,i=!1;const a=(n.x+t.x)/2,s=(n.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&a<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function qp(n,t){const e=new lh(n.i,n.x,n.y),i=new lh(t.i,t.x,t.y),a=n.next,s=t.prev;return n.next=t,t.prev=n,e.next=a,a.prev=e,i.next=e,e.prev=i,s.next=i,i.prev=s,i}function pf(n,t,e,i){const a=new lh(n,t,e);return i?(a.next=i.next,a.prev=i,i.next.prev=a,i.next=a):(a.prev=a,a.next=a),a}function lo(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function lh(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function cw(n,t,e,i){let a=0;for(let s=t,o=e-i;s<e;s+=i)a+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return a}class Js{static area(t){const e=t.length;let i=0;for(let a=e-1,s=0;s<e;a=s++)i+=t[a].x*t[s].y-t[s].x*t[a].y;return i*.5}static isClockWise(t){return Js.area(t)<0}static triangulateShape(t,e){const i=[],a=[],s=[];mf(t),gf(i,t);let o=t.length;e.forEach(mf);for(let l=0;l<e.length;l++)a.push(o),o+=e[l].length,gf(i,e[l]);const r=YS.triangulate(i,a);for(let l=0;l<r.length;l+=3)s.push(r.slice(l,l+3));return s}}function mf(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function gf(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class Hh extends Bh{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],a=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,a,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Hh(t.radius,t.detail)}}class ms extends sn{constructor(t=.5,e=1,i=32,a=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:a,thetaStart:s,thetaLength:o},i=Math.max(3,i),a=Math.max(1,a);const r=[],l=[],c=[],h=[];let u=t;const d=(e-t)/a,f=new H,g=new Yt;for(let _=0;_<=a;_++){for(let m=0;m<=i;m++){const p=s+m/i*o;f.x=u*Math.cos(p),f.y=u*Math.sin(p),l.push(f.x,f.y,f.z),c.push(0,0,1),g.x=(f.x/e+1)/2,g.y=(f.y/e+1)/2,h.push(g.x,g.y)}u+=d}for(let _=0;_<a;_++){const m=_*(i+1);for(let p=0;p<i;p++){const y=p+m,x=y,v=y+i+1,w=y+i+2,S=y+1;r.push(x,v,S),r.push(v,w,S)}}this.setIndex(r),this.setAttribute("position",new Se(l,3)),this.setAttribute("normal",new Se(c,3)),this.setAttribute("uv",new Se(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ms(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Gh extends sn{constructor(t=new $p([new Yt(0,.5),new Yt(-.5,-.5),new Yt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],a=[],s=[],o=[];let r=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(r,l,h),r+=l,l=0;this.setIndex(i),this.setAttribute("position",new Se(a,3)),this.setAttribute("normal",new Se(s,3)),this.setAttribute("uv",new Se(o,2));function c(h){const u=a.length/3,d=h.extractPoints(e);let f=d.shape;const g=d.holes;Js.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,p=g.length;m<p;m++){const y=g[m];Js.isClockWise(y)===!0&&(g[m]=y.reverse())}const _=Js.triangulateShape(f,g);for(let m=0,p=g.length;m<p;m++){const y=g[m];f=f.concat(y)}for(let m=0,p=f.length;m<p;m++){const y=f[m];a.push(y.x,y.y,0),s.push(0,0,1),o.push(y.x,y.y)}for(let m=0,p=_.length;m<p;m++){const y=_[m],x=y[0]+u,v=y[1]+u,w=y[2]+u;i.push(x,v,w),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return lw(e,t)}static fromJSON(t,e){const i=[];for(let a=0,s=t.shapes.length;a<s;a++){const o=e[t.shapes[a]];i.push(o)}return new Gh(i,t.curveSegments)}}function lw(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const a=n[e];t.shapes.push(a.uuid)}else t.shapes.push(n.uuid);return t}class Yr extends sn{constructor(t=1,e=.4,i=12,a=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:a,arc:s},i=Math.floor(i),a=Math.floor(a);const o=[],r=[],l=[],c=[],h=new H,u=new H,d=new H;for(let f=0;f<=i;f++)for(let g=0;g<=a;g++){const _=g/a*s,m=f/i*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(_),u.y=(t+e*Math.cos(m))*Math.sin(_),u.z=e*Math.sin(m),r.push(u.x,u.y,u.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(g/a),c.push(f/i)}for(let f=1;f<=i;f++)for(let g=1;g<=a;g++){const _=(a+1)*f+g-1,m=(a+1)*(f-1)+g-1,p=(a+1)*(f-1)+g,y=(a+1)*f+g;o.push(_,m,y),o.push(m,p,y)}this.setIndex(o),this.setAttribute("position",new Se(r,3)),this.setAttribute("normal",new Se(l,3)),this.setAttribute("uv",new Se(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Yr(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class ho extends La{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new se(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new se(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Sp,this.normalScale=new Yt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Mi,this.combine=Sh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Kp extends Ye{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new se(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class hw extends Kp{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ye.DEFAULT_UP),this.updateMatrix(),this.groundColor=new se(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const el=new Ue,xf=new H,vf=new H;class dw{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Yt(512,512),this.map=null,this.mapPass=null,this.matrix=new Ue,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new kh,this._frameExtents=new Yt(1,1),this._viewportCount=1,this._viewports=[new Ke(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;xf.setFromMatrixPosition(t.matrixWorld),e.position.copy(xf),vf.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(vf),e.updateMatrixWorld(),el.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(el),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(el)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class uw extends dw{constructor(){super(new Fp(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class fw extends Kp{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ye.DEFAULT_UP),this.updateMatrix(),this.target=new Ye,this.shadow=new uw}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const yf=new Ue;class pw{constructor(t,e,i=0,a=1/0){this.ray=new Lh(t,e),this.near=i,this.far=a,this.camera=null,this.layers=new Dh,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return yf.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(yf),this}intersectObject(t,e=!0,i=[]){return hh(t,this,i,e),i.sort(_f),i}intersectObjects(t,e=!0,i=[]){for(let a=0,s=t.length;a<s;a++)hh(t[a],this,i,e);return i.sort(_f),i}}function _f(n,t){return n.distance-t.distance}function hh(n,t,e,i){let a=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(a=!1),a===!0&&i===!0){const s=n.children;for(let o=0,r=s.length;o<r;o++)hh(s[o],t,e,!0)}}class mw extends Gp{constructor(t=10,e=10,i=4473924,a=8947848){i=new se(i),a=new se(a);const s=e/2,o=t/e,r=t/2,l=[],c=[];for(let d=0,f=0,g=-r;d<=e;d++,g+=o){l.push(-r,0,g,r,0,g),l.push(g,0,-r,g,0,r);const _=d===s?i:a;_.toArray(c,f),f+=3,_.toArray(c,f),f+=3,_.toArray(c,f),f+=3,_.toArray(c,f),f+=3}const h=new sn;h.setAttribute("position",new Se(l,3)),h.setAttribute("color",new Se(c,3));const u=new Fh({vertexColors:!0,toneMapped:!1});super(h,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:bh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=bh);const gw={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function xw(n,t,e,i){const a=new Zn(n.fov,i,.1,200),s=new H,o=new H,r=new H;let l=!1,c=n.fov;const h={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let u=1,d=0,f=0,g=0,_=0,m=0,p=0;function y(){const x=(n.pitchDeg+h.pitchDelta)*Math.PI/180,v=n.yawDeg*Math.PI/180;r.set(Math.sin(v)*Math.cos(x),Math.sin(x),Math.cos(v)*Math.cos(x)).multiplyScalar(n.distance*h.distanceScale*h.zoom)}return y(),{camera:a,update(x,v,w,S,E=gw){const A=v+.6;if(!l)s.set(x,A,w),l=!0;else{const P=1-Math.exp(-Math.max(n.smoothing,.001)*S);s.x+=(x-s.x)*P,s.y+=(A-s.y)*P,s.z+=(w-s.z)*P}const b=1-Math.exp(-Math.max(t.smoothing,.001)*S);h.distanceScale+=(E.distanceScale-h.distanceScale)*b,h.offsetX+=(E.offsetX-h.offsetX)*b,h.offsetZ+=(E.offsetZ-h.offsetZ)*b,h.pitchDelta+=(E.pitchDelta-h.pitchDelta)*b;const M=1-Math.exp(-Math.max(e.smoothing,.001)*S);if(h.zoom+=(u-h.zoom)*M,y(),(a.fov!==c||a.fov!==n.fov)&&(a.fov=n.fov,c=n.fov,a.updateProjectionMatrix()),o.set(s.x+h.offsetX,s.y,s.z+h.offsetZ),a.position.copy(o).add(r),a.lookAt(o),d>.001){f+=S*52;const P=d*.055;a.position.x+=Math.sin(f*1.7)*P,a.position.y+=Math.sin(f*2.3+1.1)*P*.75,a.position.z+=Math.sin(f*1.3+2.4)*P*.5,d*=Math.exp(-9*S)}else d=0;m>.001?(a.position.x+=g*m,a.position.z+=_*m,m*=Math.exp(-13*S)):m=0,a.updateMatrixWorld()},snap(x,v,w){s.set(x,v+.6,w),l=!0,o.set(s.x+h.offsetX,s.y,s.z+h.offsetZ),y(),a.position.copy(o).add(r),a.lookAt(o),a.updateMatrixWorld()},resize(x){a.aspect=x,a.updateProjectionMatrix()},getGroundBasis(){const x=new H().setFromMatrixColumn(a.matrixWorld,0),v=new H().setFromMatrixColumn(a.matrixWorld,2).negate(),w=Math.hypot(x.x,x.z)||1,S=Math.hypot(v.x,v.z)||1;return{rightX:x.x/w,rightZ:x.z/w,forwardX:v.x/S,forwardZ:v.z/S}},addShake(x){!Number.isFinite(x)||x<=0||(d=Math.min(1,d+x))},shakeLevel(){return d},addKick(x,v,w){if(!Number.isFinite(x)||!Number.isFinite(v)||!(w>0))return;const S=Math.hypot(x,v);S<1e-4||(g=x/S*w,_=v/S*w,m=1,p++)},kickLevel(){return m},kickCount(){return p},setZoom(x){u=Number.isFinite(x)&&x>0?x:1},smart(){return{...h}}}}const Aa=Math.PI*2,Hn=1e-6;function Mn(n,t,e){return n<t?t:n>e?e:n}function Jp(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function vw(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function Qp(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const a=vw(n);return i===1?a:e+(a-e)*i}function Mf(n){return(1-Math.sin(n))/2}function Vh(n,t,e){const i=Math.PI/180,a=Mn(Number.isFinite(t)?t:100,0,180),s=Mn(Number.isFinite(e)?e:132,0,180);if(s<=a)return n>=Math.cos(a*i)?1:0;const o=Math.cos(a*i),r=Math.cos(s*i);if(n>=o)return 1;const l=Mn((o-n)/(o-r),0,1);return 1-l*l*(3-2*l)}function Ir(n,t,e,i){const a=t>=0?1:-1,o=2/Math.max(Hn,i)*Math.max(0,e),r=Mn(n,-1,1),l=a-r;return Math.abs(l)<=o?a:r+Math.sign(l)*o}function bf(n){const t=Mn(Number.isFinite(n)?n:1,-1,1),e=Math.abs(t);return Math.sign(t)*e*e*(3-2*e)}function Fr(n,t){if(!n.grounded||n.speed<Hn)return Jp();const e=n.speed/Math.max(n.moveSpeed,Hn),i=Math.max(n.legLength,Hn),a=n.stride>Hn?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,s=Math.min(t.maxAmp,a/i),o=i*Math.sin(Math.min(t.maxAmp,1.25)),r=Math.abs(n.localForward),l=Math.abs(n.localRight),c=r+l+Hn,h=Vh(n.localForward/Math.max(n.speed,Hn),t.backStrafeStartDeg,t.backStrafeFullDeg),u=l/c*h,d=r/c+l/c*(1-h),f=bf(n.dirF??(n.localForward>=0?1:-1)),g=bf(n.dirR??(n.localRight>=0?1:-1)),_=a,m=N=>Math.asin(Mn(N,-o,o)/i);function p(N,L){const I=Qp(N,t.plantLock),z=Mf(N),G=f*d*_*I,$=-m(G),et=L*g>0?1:-1,ft=1+et*t.crossStep*.45,vt=g*et*t.crossStep*_*.4*z,It=g*u*_*t.sideWeight*ft*I+vt*u,Y=m(It),Q=t.kneeLift*z*s*(.55+.25*d+.1*u*(1+L*g));return{pitchX:$,rollZ:Y,kneeX:Q}}const y=(n.phase%Aa+Aa)%Aa,x=p(y,-1),v=p((y+Math.PI)%Aa,1),w=Math.cos(y),S=Mf(y),E=-t.comSway*s*w*(.6*d+.8*u)-g*t.comSway*s*u*.45,A=t.comBob*S*s,b=g*t.hipLean*s*u*w*.6,M=g*t.hipLean*s*u*(.45+.25*w),P=t.armSwing*s*w*(d*f+.3*u),C=P,F=-P;return{legL:x,legR:v,pelvisX:E,pelvisY:A,pelvisRoll:b,sideLean:M,armL:C,armR:F,strafe:u,backward:f<0?d:0}}function tm(n){const t=(n%Aa+Aa)%Aa,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function em(n,t,e){const i=Mn(e.progress,0,1);if(i>=1||n.speed<Hn)return Jp();const a=i*i*(3-2*i),s=1-a;return Fr({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*a,speed:n.speed*s,stride:n.stride*s},t)}function nm(n,t,e,i){const a=Mn(n,-1,1),s=Math.abs(a),o=Math.min(1,t*(1+Math.max(0,i)*s*s));return Mn(o*a,-1,1)*(e*Math.PI/180)}function im(n,t,e,i){if(!(Math.hypot(n,t)>1e-6))return e;const s=Math.atan2(t,n)*180/Math.PI;if(Math.abs(s)<=90)return e;const r=(s-Math.sign(s)*180)*Math.PI/180,l=Mn(i,0,1),c=l*l;return e*c+r*(1-c)}function am(n,t,e,i,a){const s=Math.max(e,Hn),o=Math.max(0,i)*s,r=Math.max(0,a)*s,l=t>Hn?(t-n)/t:0,c=l>.02,h=l<-.015,u=n<=o*.15,d=!h&&n<r&&(c||u);return{enter:n>Hn&&n<=o&&c,resume:!d}}function sm(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return Mn(n*Mn(t,0,2),-i,i)}function om(n,t,e){const i=Math.sin(n),a=Math.cos(n),s=Math.cos(n),o=-Math.sin(n);return{forward:t*i+e*a,right:t*s+e*o}}function rm(n,t,e){const i=Mn(n,0,1),a=i*i*(3-2*i);return e?t==="inStop"?1-a:1:t==="afterStop"?1-a:0}function yw(n,t,e){const i=()=>({legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisY:0,env:0});if(!e.turnStepEnabled)return i();const a=Mn(n,0,1),s=Math.sin(Math.PI*a),o=s*s;if(o<=1e-9)return i();const r=t>=0,l=r?1:.35,c=r?.35:1,h=Math.max(0,e.turnStepPitch)*o,u=Math.max(0,e.turnStepKnee)*o,d=Math.max(0,e.turnStepPitch)*.35*o,f=r?1:-1;return{legL:{pitchX:-h*l,rollZ:f*d*l,kneeX:u*l},legR:{pitchX:-h*c,rollZ:-f*d*c,kneeX:u*c},pelvisY:-Math.max(0,e.turnStepDip)*o,env:o}}function cm(n,t,e,i,a){const s=Mn(n,0,1),o=Mn(a.stopPeakRatio,.05,.95),r=s<=o?s/o:(s-o)/(1-o),l=r*r*(3-2*r),c=s<=o?l:1-l,h=Math.hypot(e,i),u=h>Hn?e/h:1,d=h>Hn?i/h:0,f=Qp(t,1)>0;return{leadPitch:Math.max(0,a.stopStepPitch)*c,trailPitch:Math.max(0,a.stopTrailPitch)*c,leadKnee:Math.max(0,a.stopStepKnee)*c,bodyShift:Math.max(0,a.stopBodyShift)*c,bodyDip:Math.max(0,a.stopBodyDip)*c,chestPitch:Math.max(0,a.stopChestPitch)*c,leadLeft:f,fwdN:u,rightN:d,env:c}}function _n(n){return n<0?0:n>1?1:n}const xr=Math.PI*2;function _w(n){return((n+Math.PI)%xr+xr)%xr-Math.PI}function Mw(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function bw(n,t,e,i,a,s=n.phase){const o=_n(i);if(o<=0)return n;const r=_n(t),l=Math.max(1,Math.round(a.cycles)),c=Math.max(0,a.strideSpeed),h=e%2===0?1:-1,u=_n(a.forwardBias),d=Math.max(0,n.stride??0),f=Math.max(0,a.strideScale??0)*d,g=r*r*(3-2*r),_={speed:c,phase:s+xr*l/2*g,localForward:c*u,localRight:c*(1-u)*h},m=_w(_.phase-n.phase),p=o*o*(3-2*o),y=n.speed>.05?d:0;return{speed:n.speed+(_.speed-n.speed)*o,phase:n.phase+m*p,localForward:n.localForward+(_.localForward-n.localForward)*o,localRight:n.localRight+(_.localRight-n.localRight)*o,stride:y+(f-y)*o*o}}function Sw(n,t,e){const i=Mw(),a=_n(n),s=Math.sin(Math.PI*a)**2;if(s<=1e-12)return i;const o=t%2===0?1:-1,r=o<0,l=o>0,c=e.stepPitch*s,h=e.stepKnee*s,u=e.stepSide*s;return i.legL.pitchX=r?-c:c*.55,i.legR.pitchX=l?-c:c*.55,i.legL.kneeX=r?h:h*.4,i.legR.kneeX=l?h:h*.4,i.legL.rollZ=-u*o,i.legR.rollZ=u*o,i.pelvisX=e.stepSway*s*o,i.pelvisY=-e.stepDip*s,i.pelvisRoll=u*.25*o,i}function lm(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function Sf(n,t,e,i,a){if(e<=0||i<=0)return 0;const s=(n-t)/e;return s<0||s>=1?0:i*lm(s,a)}function ww(n,t,e,i){const a=t?1:0,s=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),o=n+(a-n)*s;return t&&o>.999?1:!t&&o<.001?0:o}function Ew(n,t,e){const i=_n(n);return{gaitScale:1-i*(1-_n(t)),attackLegWeight:_n(e)*i}}function Tw(n,t,e){const i=_n(e);if(i<=0)return n;if(i>=1)return{...n,...t,armL:n.armL,armR:n.armR,strafe:n.strafe,backward:n.backward};const a=(s,o)=>s+(o-s)*i;return{legL:{pitchX:a(n.legL.pitchX,t.legL.pitchX),rollZ:a(n.legL.rollZ,t.legL.rollZ),kneeX:a(n.legL.kneeX,t.legL.kneeX)},legR:{pitchX:a(n.legR.pitchX,t.legR.pitchX),rollZ:a(n.legR.rollZ,t.legR.rollZ),kneeX:a(n.legR.kneeX,t.legR.kneeX)},pelvisX:a(n.pelvisX,t.pelvisX),pelvisY:a(n.pelvisY,t.pelvisY),pelvisRoll:a(n.pelvisRoll,t.pelvisRoll),sideLean:n.sideLean,armL:n.armL,armR:n.armR,strafe:n.strafe,backward:n.backward}}function Aw(n,t){const e=_n(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function Rw(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return _n(t.minScale+(1-t.minScale)*e)}function Pw(){return hm()}function hm(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function Cw(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function Lw(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?_n(t.forceHitHeight):n.type==="light"?_n(t.hitHeight.light):n.type==="heavy"?_n(t.hitHeight.heavy):n.type==="knock"?_n(t.hitHeight.knock):0}function Dw(n,t,e){const i=_n(e),a=(s,o)=>s+(o-s)*i;return{upperPitch:a(n.upperPitch,t.upperPitch),upperRoll:a(n.upperRoll,t.upperRoll),upperYaw:a(n.upperYaw,t.upperYaw),fold:a(n.fold,t.fold),shift:a(n.shift,t.shift),drop:a(n.drop,t.drop),back:a(n.back,t.back),knee:a(n.knee,t.knee),hip:a(n.hip,t.hip),arm:a(n.arm,t.arm)}}function dm(n,t,e){const i=hm(),a=Cw(n,e);if(i.intensity=a,a<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const s=_n(1-n.timer/n.duration),o=lm(s,e.pulseRatio);i.pulse=o,i.active=o>0,i.hitHeight=Lw(n,e);const r=Math.sin(t),l=Math.cos(t),c=Math.cos(t),h=-Math.sin(t),u=n.dirX*r+n.dirZ*l,d=n.dirX*c+n.dirZ*h;if(i.localFwd=u,i.localRight=d,!e.enabled){i.legacy=!0;const _=Math.sin(Math.PI*s);return i.upperPitch=a*_*u,i.upperRoll=-a*_*d*.7,i.drop=(a>.5?.09:.04)*_,i.flash=e.flashStrength*_,i.active=_>0,i}const f=a*o,g=Dw(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=f*(g.upperPitch*u+g.fold),i.upperRoll=-f*g.upperRoll*d,i.upperYaw=f*g.upperYaw*d,i.upperShift=f*g.shift,i.upperShiftX=i.upperShift*d,i.upperShiftZ=i.upperShift*u,i.comShift=f*e.comShift,i.comX=i.comShift*d,i.comZ=i.comShift*u,i.pelvisBack=f*g.back,i.drop=f*g.drop,i.knee=f*g.knee,i.hip=f*g.hip,i.arm=f*g.arm,i.flash=e.flashStrength*o,i}function um(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),a=Number.isFinite(n.leanForward)?n.leanForward:0,s=Number.isFinite(n.leanSide)?n.leanSide:0,o=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:a*e,pelvisRoll:s*e,pelvisX:-s*i,pelvisZ:a*i,crouch:Math.max(0,t.moveCrouch)*o}}const xa=1e-6;function Qs(n,t,e){return n<t?t:n>e?e:n}function fm(n,t,e,i=1){const a=t,s=e;if(!Number.isFinite(a)||!Number.isFinite(s)||a<=xa||s<=xa||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const r=a+s,l=Math.abs(a-s)+xa,c=Math.hypot(n.x,n.y,n.z);if(c<=xa)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const h=Math.atan2(n.x,-n.y),u=Math.hypot(n.x,n.y),d=n.z,f=Math.hypot(d,u),g=Qs(f,l,r),_=f>r+xa||f<l-xa,m=Math.atan2(-d,Math.max(u,xa)),p=Qs((a*a+g*g-s*s)/(2*a*g),-1,1),y=Qs((s*s+g*g-a*a)/(2*s*g),-1,1),x=Math.acos(p),v=Math.acos(y),w=i>=0?1:-1;return{rootPitch:m-w*x,rootRoll:h,jointPitch:w*(x+v),clamped:_,reach:c/r}}function pm(n,t,e,i){const a=Qs(e,0,1),s=Math.max(0,i),o=(r,l)=>{const c=Qs((l-r)*a,-s,s);return r+c};return{rootPitch:o(n.rootPitch,t.rootPitch),rootRoll:o(n.rootRoll,t.rootRoll),jointPitch:o(n.jointPitch,t.jointPitch)}}function mm(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const Xh={active:!1,weight:0,clamped:0,maxError:0};function gm(n){const{root:t,pelvis:e,lower:i,limbs:a,base:s,cfg:o}=n;if(!o.enabled||o.weight<=0||!n.grounded||a.length===0)return{...Xh};const r={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(s.pelvisPos),e.rotation.x=s.pelvisRotX,e.rotation.z=s.pelvisRotZ,i.position.copy(s.lowerPos),i.rotation.z=s.lowerRotZ,t.updateWorldMatrix(!0,!0);const l=a.map(f=>f.tip.getWorldPosition(new H));e.position.copy(r.pelvisPos),e.rotation.x=r.pelvisRotX,e.rotation.z=r.pelvisRotZ,i.position.copy(r.lowerPos),i.rotation.z=r.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const c=Math.max(0,Math.min(1,o.weight))*(n.attacking?Math.max(0,Math.min(1,o.attackScale)):1),h=Math.max(0,o.maxCorrectionDeg)*Math.PI/180;let u=0;for(let f=0;f<a.length;f++){const g=a[f],_=i.worldToLocal(l[f].clone()),m={x:_.x-g.root.position.x,y:_.y-g.root.position.y,z:_.z-g.root.position.z},p=fm(m,g.upperLen,g.lowerLen,g.bend);p.clamped&&(u+=1);const y=pm({rootPitch:g.root.rotation.x,rootRoll:g.root.rotation.z,jointPitch:g.joint.rotation.x},p,c,h);g.root.rotation.x=y.rootPitch,g.root.rotation.z=y.rootRoll,g.joint.rotation.x=y.jointPitch}t.updateWorldMatrix(!0,!0);let d=0;for(let f=0;f<a.length;f++){const g=a[f].tip.getWorldPosition(new H);d=Math.max(d,g.distanceTo(l[f]))}return{active:!0,weight:c,clamped:u,maxError:d}}function On(n,t,e){return n<t?t:n>e?e:n}function kw(n,t,e,i,a,s,o,r,l,c){const h=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},u=new Pe,d=new Pe;d.name="pelvis",d.position.y=n.legLength,u.add(d);const f=new Pe;f.name="lower";const g=new Pe;g.name="upper",d.add(f),d.add(g);const _=[],m=(dt,st,wt,O)=>{const ot=new ho({color:O}),rt=new _e(new li(dt,st,wt),ot);return rt.castShadow=!0,rt.receiveShadow=!0,_.push(ot),rt},p=n.headSize,y=n.legLength,x=n.armLength,v=n.limbThickness,w=n.bodyHeight,S=n.bodyWidth,E=m(S,w,.28,e);E.position.y=w/2,g.add(E);const A=new Pe;A.name="headPivot",A.rotation.order="YXZ",A.position.y=w,g.add(A);const b=m(p,p,p,e);b.position.y=p/2,A.add(b);for(const dt of[-1,1]){const st=m(.06,.07,.02,t.shoe);st.position.set(dt*.09,p/2+.03,p/2+.011),A.add(st)}const M=(dt,st)=>{const wt=st?x:y,O=new Pe;O.name=st?dt<0?"shoulderL":"shoulderR":dt<0?"hipL":"hipR",st||(O.rotation.order="ZYX"),O.position.set(dt*(st?S/2+v/2:S/2-v/2),st?w-.04:0,0),(st?g:f).add(O);const ot=m(v,wt/2,v,t.limb);ot.position.y=-wt/4,O.add(ot);const rt=new Pe;rt.name=st?"elbow":"knee",rt.position.y=-wt/2,O.add(rt);const Vt=m(v,wt/2,v,t.limb);if(Vt.position.y=-wt/4,rt.add(Vt),!st){const Ht=m(v*1.15,.07,v*1.7,t.shoe);Ht.position.set(0,-wt/2+.035,.045),rt.add(Ht);const qt=new Ye;return qt.name="footTip",qt.position.y=-wt/2,rt.add(qt),{root:O,joint:rt,tip:qt}}return{root:O,joint:rt}},P=M(-1,!1),C=M(1,!1),F=M(-1,!0),N=M(1,!0),L=[P,C].map(dt=>({root:dt.root,joint:dt.joint,tip:dt.tip,upperLen:y/2,lowerLen:y/2,bend:1})),I=new fn({color:a.attackArcColor,transparent:!0,opacity:0,side:qe,depthWrite:!1}),z=new _e(new Yr(.62,.042,6,20,Math.PI*1.1),I);z.position.set(0,.78-y,.56),g.add(z);const G=new se(e),$=new se(r.flashColor),et=new se;let ft=null,vt=0,It=0,Y=0,Q=0,pt=0,at=0,K=0,Z={...Xh},_t=-1,Ft=0,ht=0,Pt=0,B=0,ne=0,Ot=0,Ct=0,xt=1,Nt=0,Bt=0,k="none",T=0,j=!1,ut=-1,J=!1,ct=0,zt=0,St=1,Mt=1;return{group:u,boneAtWorld(dt,st,wt){const O=[{node:g,ax:0,ay:.05,az:0,bx:0,by:w,bz:0},{node:A,ax:0,ay:0,az:0,bx:0,by:p,bz:0},{node:F.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:F.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:N.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:N.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:P.root,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0},{node:P.joint,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0},{node:C.root,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0},{node:C.joint,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0}],ot=new H,rt=new H,Vt=new H(dt,st,wt),Ht=new H;let qt=null,U=Number.POSITIVE_INFINITY;for(const bt of O){bt.node.updateWorldMatrix(!0,!1),ot.set(bt.ax,bt.ay,bt.az),rt.set(bt.bx,bt.by,bt.bz),bt.node.localToWorld(ot),bt.node.localToWorld(rt);const tt=rt.x-ot.x,mt=rt.y-ot.y,kt=rt.z-ot.z,Lt=tt*tt+mt*mt+kt*kt;let Gt=Lt>1e-8?((Vt.x-ot.x)*tt+(Vt.y-ot.y)*mt+(Vt.z-ot.z)*kt)/Lt:0;Gt=Math.max(0,Math.min(1,Gt));const ce=ot.x+tt*Gt,ge=ot.y+mt*Gt,te=ot.z+kt*Gt,we=(Vt.x-ce)**2+(Vt.y-ge)**2+(Vt.z-te)**2;we<U&&(U=we,qt=bt.node,Ht.set(ce,ge,te))}return qt?{node:qt,point:Ht.clone()}:null},update(dt,st){u.position.set(dt.position.x,dt.position.y,dt.position.z),u.rotation.y=dt.bodyYaw,A.rotation.y=(dt.headYaw-dt.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,dt.mode!==ft&&(ft=dt.mode,vt=1),vt=Math.max(0,vt-st*2.2);const wt=dt.hurt,O=dm(wt,dt.bodyYaw,r),ot=O.flash;et.copy($).multiplyScalar(ot);for(const Et of _)Et.emissive.copy(G).multiplyScalar(vt*.5),ot>0&&Et.emissive.add(et);d.position.set(0,y,0),d.rotation.set(0,0,0),g.position.set(0,0,0),g.rotation.set(0,0,0),f.position.set(0,0,0),f.rotation.z=0;const rt=Math.hypot(dt.velocity.x,dt.velocity.z),Vt=On(o.knockGaitScale??0,0,1),Ht=dt.hurt.knockX*Vt,qt=dt.hurt.knockZ*Vt,U=Vt>0&&Math.hypot(dt.hurt.knockX,dt.hurt.knockZ)>.001,bt=dt.velocity.x+Ht,tt=dt.velocity.z+qt,mt=Math.hypot(bt,tt),kt=Math.cos(dt.bodyYaw),Lt=-Math.sin(dt.bodyYaw),Gt=rt>1e-6?On((dt.velocity.x*kt+dt.velocity.z*Lt)/rt,-1,1):0,ce=rt>1e-6?On((dt.velocity.x*Math.sin(dt.bodyYaw)+dt.velocity.z*Math.cos(dt.bodyYaw))/rt,-1,1):1,ge=Vh(ce,o.backStrafeStartDeg,o.backStrafeFullDeg);k==="settled"&&J&&ct>zt*1.02+1e-4&&(k="none");let te=1;k==="blend"?(te=rm(j?ut:T,o.stopYawBlendMode,j),j||(T=Math.min(1,T+st/Math.max(.01,o.stopYawAfterSec)),(T>=1||o.stopYawBlendMode==="inStop"||J)&&(k="settled",te=0))):k==="settled"&&(te=On(rt/Math.max(1e-6,o.stopEnterRatio*s),0,1));const we=nm(Gt,o.strafeHipScale,o.strafeHipMaxDeg,o.strafeHipBoost),Be=im(ce,Gt,we,ge)*te;Nt+=(Be-Nt)*(1-Math.exp(-12*Math.max(0,st))),f.rotation.y=Nt;const Je=dt.bodyYaw+Nt,V=Math.sin(Je),Tt=Math.cos(Je),Dt=Math.cos(Je),ie=-Math.sin(Je),ue=bt*V+tt*Tt,re=bt*Dt+tt*ie,ve=Math.max(0,o.stopBlendSec||0),Fe=ve>0&&!U,$e=am(rt,Bt,s,o.stopEnterRatio,o.stopExitRatio);if(!Fe||$e.resume)_t=-1;else if(_t<0&&$e.enter){_t=0,Ft=dt.gaitPhase,ht=tm(dt.gaitPhase),Pt=rt,B=Math.max(dt.stride,1e-6),ne=ue,Ot=re;const Et=1/Math.max(1e-6,rt);Ct=dt.velocity.x*Et,xt=dt.velocity.z*Et}const De=Bt;Bt=rt;const Ge=Fe&&_t>=0;Ge&&(_t=Math.min(1,_t+st/ve)),Ge&&k!=="blend"&&(k="blend",T=0),j=Ge&&_t<1,ut=_t,J=$e.resume,ct=rt,zt=De;const Vn=Math.max(0,o.dirFlipSec??0);Vn>0?(St=Ir(St,ue>=0?1:-1,st,Vn),Mt=Ir(Mt,re>=0?1:-1,st,Vn)):(St=ue>=0?1:-1,Mt=re>=0?1:-1);const jn=Ge?{phase:Ft,speed:Pt,moveSpeed:s,localForward:ne,localRight:Ot,dirF:St,dirR:Mt,legLength:n.legLength,stride:B,grounded:!0}:{phase:dt.gaitPhase,speed:mt,moveSpeed:s,localForward:ue,localRight:re,dirF:St,dirR:Mt,legLength:n.legLength,stride:dt.stride,grounded:!0},R=Ge?em(jn,o,{progress:_t,phase0:Ft,phaseEnd:ht}):Fr(jn,o);let X=0,nt=0,it=0,W=0;if(Ge){const Et=om(dt.bodyYaw,Ct,xt),jt=cm(_t,Ft,Et.forward,Et.right,o);jt.leadLeft?(R.legL.pitchX-=jt.leadPitch,R.legL.kneeX+=jt.leadKnee,R.legR.pitchX+=jt.trailPitch):(R.legR.pitchX-=jt.leadPitch,R.legR.kneeX+=jt.leadKnee,R.legL.pitchX+=jt.trailPitch),nt=jt.bodyShift*jt.fwdN,X=jt.bodyShift*jt.rightN,it=jt.bodyDip,W=jt.chestPitch}P.root.rotation.x=R.legL.pitchX,C.root.rotation.x=R.legR.pitchX,P.root.rotation.z=R.legL.rollZ,C.root.rotation.z=R.legR.rollZ,P.joint.rotation.x=R.legL.kneeX,C.joint.rotation.x=R.legR.kneeX,F.root.rotation.x=R.armL,N.root.rotation.x=R.armR,F.joint.rotation.x=-.18,N.joint.rotation.x=-.18,d.position.x=R.pelvisX,d.position.y=y+R.pelvisY,d.position.z=0,d.rotation.z=R.pelvisRoll,g.rotation.z=R.sideLean*(O.intensity>0?.4:1);const At=mm(d,f),Ut=Ge&&h.enabled?{...h,weight:1}:h,Wt=Ut.enabled&&Ut.weight>0?On(Ut.weight,0,1):0;if(d.position.x+=X,d.position.z+=nt,d.position.y-=it,f.position.y+=it,Wt<=0&&(f.position.x-=X,f.position.z-=nt),l){const Et=Math.max(.004166666666666667,Math.min(st,.1)),jt=Math.sin(dt.bodyYaw),oe=Math.cos(dt.bodyYaw),ze=On((dt.velocity.x-It)/Et,-60,60),le=On((dt.velocity.z-Y)/Et,-60,60),$t=ze*jt+le*oe,ln=He(dt.bodyYaw-Q)/Et,he=l.maxForwardDeg*Math.PI/180,Qe=l.maxSideDeg*Math.PI/180,bn=1-Math.exp(-Math.max(0,l.smoothing)*Et);pt+=(On($t*l.accelGain,-he,he)-pt)*bn,at+=(On(-ln*rt*l.turnGain,-Qe,Qe)-at)*bn;const ke=Number.isFinite(l.crouchSmoothing)?l.crouchSmoothing:8;K+=(On(rt/Math.max(s,1e-6),0,1)-K)*(1-Math.exp(-Math.max(0,ke)*Et));const hn=um({leanForward:pt,leanSide:at,speedRatio:K},l);g.rotation.x+=pt+W,g.rotation.z+=at,d.rotation.x+=hn.pelvisPitch,d.rotation.z+=hn.pelvisRoll,d.position.x+=hn.pelvisX,d.position.z+=hn.pelvisZ,d.position.y-=hn.crouch,f.position.y+=hn.crouch*(1-Wt)}It=dt.velocity.x,Y=dt.velocity.z,Q=dt.bodyYaw,g.rotation.x+=O.upperPitch,g.rotation.z+=O.upperRoll,g.rotation.y+=O.upperYaw;const Zt=On(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),Jt=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;g.position.x+=On(O.upperShiftX*Zt,-Jt,Jt),g.position.z+=On(O.upperShiftZ*Zt,-Jt,Jt),d.position.x+=O.comX,d.position.z+=O.comZ-O.pelvisBack,d.position.y-=O.drop;const Rt=O.legacy?0:Math.max(0,Math.min(1,r.lowerScale));if(f.position.z+=O.pelvisBack*(1-Rt),f.position.y+=O.drop*(1-Rt),P.joint.rotation.x+=O.knee,C.joint.rotation.x+=O.knee,P.root.rotation.x-=O.hip,C.root.rotation.x-=O.hip,F.root.rotation.x+=O.arm,N.root.rotation.x+=O.arm*.8,dt.attackPhase!=="idle"&&O.intensity===0){const Et=dt.attackProgress,jt=Et<.34?-1:Et<.68?-1+(Et-.34)/.34*2:Math.max(0,1-(Et-.68)/.32),oe=Math.max(0,-jt),ze=Math.max(0,jt);N.root.rotation.x=-1.7*oe+1.25*ze,N.joint.rotation.x=-(.25+oe*.45),g.rotation.y=-.28*jt,I.opacity=dt.attackPhase==="active"?.85:0,dt.attackPhase==="active"&&(z.rotation.z=-1.1+Et*3)}else I.opacity=0;const lt=sm(Nt,o.chestYawScale,o.chestYawMaxDeg);g.rotation.y+=lt,A.rotation.y=(dt.headYaw-dt.bodyYaw-lt+Math.PI*3)%(Math.PI*2)-Math.PI,Z=gm({root:u,pelvis:d,lower:f,limbs:L,base:At,cfg:Ut,grounded:!0,attacking:dt.attackPhase!=="idle"})},ik(){return Z},dispose(){u.traverse(dt=>{if(dt instanceof _e){dt.geometry.dispose();const st=dt.material;Array.isArray(st)?st.forEach(wt=>wt.dispose()):st.dispose()}})}}}const Iw=9.81;function Ws(n,t,e){return n<t?t:n>e?e:n}function Fw(n,t,e,i,a){const s=a!=null&&a.gravity&&a.gravity>0?a.gravity:Iw,o={comX:0,comY:0,comZ:0,xcomX:0,xcomZ:0,centerX:0,centerZ:0,halfX:0,halfZ:0,marginX:1,marginZ:1,score:1,leanDeg:0,side:0,overX:0,overZ:0,grounded:!1};let r=0,l=0,c=0,h=0;for(const b of n){const M=Number.isFinite(b.mass)&&b.mass>0?b.mass:0;!Number.isFinite(b.x)||!Number.isFinite(b.y)||!Number.isFinite(b.z)||(r+=M,l+=b.x*M,c+=b.y*M,h+=b.z*M)}if(r<=1e-6)return o;l/=r,c/=r,h/=r;const u=Math.max(.02,(t.maxX-t.minX)/2),d=Math.max(.02,(t.maxZ-t.minZ)/2),f=(t.minX+t.maxX)/2,g=(t.minZ+t.maxZ)/2;if(!(t.maxX-t.minX>.03&&t.maxZ-t.minZ>.03))return{...o,comX:l,comY:c,comZ:h,centerX:f,centerZ:g,halfX:u,halfZ:d};const m=Ws((a==null?void 0:a.reactionTime)??.18,.02,1),p=Math.sqrt(Math.max(.05,c)/s)*m*4,y=l+(Number.isFinite(e)?e:0)*p,x=h+(Number.isFinite(i)?i:0)*p,v=Math.abs(y-f)/u,w=Math.abs(x-g)/d,S=Ws(1-Math.max(v,w),0,1),E=Math.max(0,Math.abs(y-f)-u),A=Math.max(0,Math.abs(x-g)-d);return{comX:l,comY:c,comZ:h,xcomX:y,xcomZ:x,centerX:f,centerZ:g,halfX:u,halfZ:d,marginX:Ws(1-v,-1,1),marginZ:Ws(1-w,-1,1),score:S,leanDeg:Math.atan2(y-f,x-g)*180/Math.PI,side:v>.98?y>f?1:-1:0,overX:E,overZ:A,grounded:!0}}function zw(n,t,e){if(!Number.isFinite(n))return 0;if(!Number.isFinite(t)||!(e>0))return n;const i=n+t*e;return n!==0&&Math.sign(i)!==Math.sign(n)?0:Math.abs(i)>Math.abs(n)?i:n}function Nw(n,t,e){const i=Math.max(0,n);if(!(e>0))return i;const a=Ws(Number.isFinite(t)?t:0,0,2);return i*(1+e*a)}const dh={arm:1,leg:1,torso:1,girthArm:1,girthLeg:1,girthTorso:1},Uw=1e-6;function Bn(n,t,e){return n<t?t:n>e?e:n}function nl(n,t){const e=Math.max(.2,n);return Bn(Math.pow(e,-t),.5,2)}function Ow(n,t){if(!t.enabled)return{...dh};const e=Bn(n.swing,-1,1),i=Bn(n.charge,0,1),a=Bn(n.impact,0,1),s=Bn(n.speedRatio,0,1),o=Math.max(0,e),r=1-(1-o)*(1-o),l=1+(Math.max(1,t.swingArm)-1)*r,c=Math.max(0,-e),h=Bn(t.chargeArm,.6,1),u=1-(1-h)*c,d=1-(1-h)*i;let f=1;o>0?f=l:c>0?f=u:i>0&&(f=d);const g=1-Bn(t.impactSquash,0,.6)*a;f*=g;const _=Math.max(1,t.runLeg),p=(n.grounded?1+(_-1)*s:1)*(1-Bn(t.impactSquash,0,.6)*a*.6),y=Bn(t.torsoGain,0,1),x=1+(f-1)*y;return f=Bn(f,.6,1.6),{arm:f,leg:Bn(p,.6,1.4),torso:Bn(x,.7,1.4),girthArm:nl(f,t.volumeExp),girthLeg:nl(p,t.volumeExp),girthTorso:nl(x,t.volumeExp)}}function Bw(n,t,e,i){const a=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),s=(o,r)=>o+(r-o)*a;return{arm:s(n.arm,t.arm),leg:s(n.leg,t.leg),torso:s(n.torso,t.torso),girthArm:s(n.girthArm,t.girthArm),girthLeg:s(n.girthLeg,t.girthLeg),girthTorso:s(n.girthTorso,t.girthTorso)}}function Hw(n,t,e){const i=n*Math.exp(-Math.max(Uw,e)*Math.max(0,t));return i<.001?0:Bn(i,0,1)}const wf=[{yaw:.85,pitch:-.12,roll:-.14,pz:-.06,px:.045,ap:-1.2,ay:-.42,ar:.16,el:-.48,blade:.3},{yaw:-.95,pitch:.14,roll:.17,pz:.1,px:-.05,ap:-1.46,ay:-.6,ar:-.1,el:-.14,blade:-.05},{yaw:-.75,pitch:-.08,roll:.14,pz:-.04,px:-.04,ap:-1.28,ay:-.58,ar:-.12,el:-.5,blade:.3},{yaw:.92,pitch:.15,roll:-.18,pz:.1,px:.05,ap:-1.48,ay:-.4,ar:.12,el:-.13,blade:-.05},{yaw:.12,pitch:-.32,roll:-.05,pz:-.07,px:0,ap:-1.9,ay:-.3,ar:.16,el:-.55,blade:1.3},{yaw:0,pitch:.55,roll:.02,pz:.13,px:0,ap:.05,ay:-.2,ar:0,el:-.1,blade:-.55}];function gs(n,t,e){return n<t?t:n>e?e:n}function Ie(n,t,e){return n+(t-n)*e}function Gw(n){return n?typeof n=="string"?{clip:n}:n:null}function Vw(){return{bodyYaw:0,bodyPitch:0,bodyRoll:0,pelvisX:0,pelvisZ:0,armPitch:0,armYaw:0,armRoll:0,elbow:0,bladePitch:0,armLPitch:0,armLYaw:0,armLRoll:0,elbowL:0,rootYaw:0,bladePitchOff:0,bladeTwist:0,bladeTwistOff:0,bladeYaw:0,bladeYawOff:0}}function Xw(n,t){const e=n%3*2,i=wf[e],a=wf[e+1];return{...Vw(),bodyYaw:Ie(i.yaw,a.yaw,t),bodyPitch:Ie(i.pitch,a.pitch,t),bodyRoll:Ie(i.roll,a.roll,t),pelvisX:Ie(i.px,a.px,t),pelvisZ:Ie(i.pz,a.pz,t),armPitch:Ie(i.ap,a.ap,t),armYaw:Ie(i.ay,a.ay,t),armRoll:Ie(i.ar,a.ar,t),elbow:Ie(i.el,a.el,t),bladePitch:Ie(i.blade,a.blade,t)}}function Ww(n,t,e,i,a=0){var b,M,P;const s=((b=i.combo)==null?void 0:b[n])??[],o=Math.max(1,s.length),r=(((Math.round(t)||1)-1)%o+o)%o,l=Gw(s[r]),c=l?((M=i.clips)==null?void 0:M[l.clip])??null:null,h=gs(((P=i.weaponScale)==null?void 0:P[n])??1,0,2),u=Number.isFinite(i.bodyScale)?Math.max(0,i.bodyScale):1,d=l&&Number.isFinite(l.scale)?l.scale:h,f=d*u,g=gs((e+1)/2,0,1),_=c&&c.keys.length>0?Yg(c,g):Xw(r,g),m=((l==null?void 0:l.lead)??(c==null?void 0:c.lead)??"R")==="L"?"L":"R",p=(c==null?void 0:c.kind)??["right-left","left-right","overhead"][r]??"custom",y=n==="dual-swords",x=c&&la(c,"bladeTwistOff")?_.bladeTwistOff:y?_.bladeTwist:0,v=c&&la(c,"bladeYawOff")?_.bladeYawOff:-_.bladeYaw,w={yaw:_.bodyYaw*f,rootYaw:_.rootYaw*f,spinYaw:$g(c,gs(a,0,1)),pitch:_.bodyPitch*f,roll:_.bodyRoll*f,pelvisZ:_.pelvisZ*f,pelvisX:_.pelvisX*f,armR:null,armL:null,bladePitch:_.bladePitch,bladePitchOff:c&&la(c,"bladePitchOff")?_.bladePitchOff:null,bladeTwist:_.bladeTwist,bladeTwistOff:x,bladeYaw:_.bladeYaw,bladeYawOff:v,lead:m,kind:p,strike:g,blend:l&&Number.isFinite(l.blend)?l.blend:null},S={pitch:_.armPitch*d,yaw:_.armYaw*d,roll:_.armRoll*d,elbow:_.elbow*d},E=c?la(c,"armLPitch")||la(c,"armLYaw")||la(c,"armLRoll")||la(c,"elbowL"):!1,A=E?{pitch:_.armLPitch*d,yaw:_.armLYaw*d,roll:_.armLRoll*d,elbow:_.elbowL*d}:{pitch:S.pitch+(n==="greatsword"?.08:.1),yaw:S.yaw*.8,roll:n==="greatsword"?.4:-S.roll*.6,elbow:S.elbow};return m==="L"?(w.armL=S,w.armR=n==="greatsword"?null:A):(w.armR=S,(n==="greatsword"||n==="dual-swords"||E)&&(w.armL=A)),w}function Yw(n,t,e){const i=gs(e,0,1),a=(s,o)=>s?o?{pitch:Ie(s.pitch,o.pitch,i),yaw:Ie(s.yaw,o.yaw,i),roll:Ie(s.roll,o.roll,i),elbow:Ie(s.elbow,o.elbow,i)}:null:o;return{yaw:Ie(n.yaw,t.yaw,i),rootYaw:Ie(n.rootYaw,t.rootYaw,i),spinYaw:t.spinYaw,pitch:Ie(n.pitch,t.pitch,i),roll:Ie(n.roll,t.roll,i),pelvisZ:Ie(n.pelvisZ,t.pelvisZ,i),pelvisX:Ie(n.pelvisX,t.pelvisX,i),armR:a(n.armR,t.armR),armL:a(n.armL,t.armL),bladePitch:n.bladePitch===null||t.bladePitch===null?i<.5?n.bladePitch:t.bladePitch:Ie(n.bladePitch,t.bladePitch,i),bladePitchOff:n.bladePitchOff===null||t.bladePitchOff===null?i<.5?n.bladePitchOff:t.bladePitchOff:Ie(n.bladePitchOff,t.bladePitchOff,i),bladeTwist:Ie(n.bladeTwist,t.bladeTwist,i),bladeTwistOff:Ie(n.bladeTwistOff,t.bladeTwistOff,i),bladeYaw:Ie(n.bladeYaw,t.bladeYaw,i),bladeYawOff:Ie(n.bladeYawOff,t.bladeYawOff,i),lead:t.lead,kind:t.kind,strike:Ie(n.strike,t.strike,i),blend:t.blend??null}}function $w(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function Ef(n,t){return!n||!t?n||t?.6:0:Math.abs(n.pitch-t.pitch)*1+Math.abs(n.yaw-t.yaw)*.8+Math.abs(n.roll-t.roll)*.6+Math.abs(n.elbow-t.elbow)*.8}function Zw(n,t){const e=(a,s)=>Math.abs($w(a-s));let i=0;return i+=e(n.yaw,t.yaw)*1,i+=e(n.rootYaw,t.rootYaw)*.7,i+=e(n.pitch,t.pitch)*.9,i+=e(n.roll,t.roll)*.9,i+=Math.abs(n.pelvisX-t.pelvisX)*2,i+=Math.abs(n.pelvisZ-t.pelvisZ)*2,i+=Ef(n.armR,t.armR),i+=Ef(n.armL,t.armL)*.8,i+=e(n.bladePitch??0,t.bladePitch??0)*1.1,i+=e(n.bladePitchOff??0,t.bladePitchOff??0)*.7,i+=e(n.bladeTwist,t.bladeTwist)*.5,i+=e(n.bladeYaw,t.bladeYaw)*.5,i}function jw(n,t,e,i,a){if(i!=null&&Number.isFinite(i)&&i>=0)return Math.max(.008,i);const s=Math.max(.008,e.segBlend??.1);if(!n)return s;const o=Math.max(.008,e.segBlendMin??.03),r=Math.max(o,Number.isFinite(a)?a:e.segBlendMax??.14),l=Math.max(.1,e.segBlendRef??6),c=gs(Zw(n,t)/l,0,1);return o+(r-o)*c}function Tf(n){const t=gs(n,0,1);return t*t*(3-2*t)}function Oe(n,t,e,i){const a=new _e(new li(n,t,e),new ho({color:i}));return a.castShadow=!0,a.receiveShadow=!0,a}function Xe(){return new Pe}function vr(n,t,e){const i=Xe(),a=Oe(t*.7,.12,t*.7,e.wood);a.position.y=.06,i.add(a);const s=Oe(t*2.4,.045,t*.8,e.metal);s.position.y=.13,i.add(s);const o=Oe(t*.38,n,t,e.blade);o.position.y=.13+n/2,i.add(o);const r=Oe(t*.42,n*.96,t*.2,e.bladeEdge);r.position.set(0,.13+n/2,t*.5),i.add(r);const l=Oe(t*.3,.09,t*.45,e.blade);return l.position.y=.13+n+.045,i.add(l),i}function qw(n){const t=vr(.72,.15,n),e=Oe(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function Kw(n){const t=Xe(),e=Oe(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=Oe(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function Jw(n){const t=Xe(),e=Oe(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=Oe(.15,.15,.15,n.glow);i.position.y=.92;const a=i.material;return a.emissive=new se(n.glow),a.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function Qw(n){const t=Xe();for(let i=0;i<5;i++){const a=(i-2)*.15,s=Oe(.055,.16,.05,n.wood);s.position.set(.16-Math.abs(a)*.46,a,0),t.add(s)}const e=Oe(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function tE(n){const t=Xe(),e=Oe(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=Oe(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function fe(n,t,e){return n<t?t:n>e?e:n}const Li=1e-6;function xm(n,t,e,i,a,s,o,r,l,c,h,u,d){const f=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},g=u??{enabled:!1,lag:.022,maxAngle:.62,rate:26,twistLag:.018,maxTwist:.45,runDrag:0},_=h??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},m=l.stretch??{enabled:!1,swingArm:1,chargeArm:1,runLeg:1,torsoGain:0,impactSquash:0,impactDecay:12,volumeExp:.5,smoothing:26},p=l.swing??{enabled:!1,bodyScale:1,shoulderLift:.045,shoulderPush:.035,shoulderIn:.03,segBlend:.1,weaponScale:{greatsword:1,"sword-shield":.62,"dual-swords":.55}},y=Xe(),x=Xe();x.name="pelvis",x.position.y=n.legLength,y.add(x);const v=Xe();v.name="lower";const w=Xe();w.name="upper",x.add(v),x.add(w);const S=n.headSize,E=n.legLength,A=n.armLength,b=n.limbThickness,M=n.bodyHeight,P=n.bodyWidth,C=l.spine,F=!!(C!=null&&C.enabled),N=F?fe(C.chestPivot??.42,.15,.85)*M:0,L=Xe();L.name="chest",L.position.y=N,w.add(L);const I=F?L:w;let z,G=null,$=M,et=0;F?($=Math.max(.05,N),et=Math.max(.05,M-N),z=Oe(P,$,.28,t.body),z.name="torsoLower",z.position.y=$/2,w.add(z),G=Oe(P+.008,et,.288,t.body),G.name="torsoUpper",G.position.y=et/2,L.add(G)):(z=Oe(P,M,.28,t.body),z.name="torso",z.position.y=M/2,w.add(z));const ft=Xe();ft.name="headPivot",ft.rotation.order="YXZ",ft.position.y=Math.min(i.headPivotHeight,M)-N,I.add(ft);const vt=Oe(S,S,S,t.head);vt.position.y=S/2,ft.add(vt);const It=new ho({color:"#1b2733"});for(const D of[-1,1]){const q=new _e(new li(.06,.07,.02),It);q.position.set(D*.09,S/2+.03,S/2+.011),ft.add(q)}const Y=D=>{const q=Xe();q.name=D<0?"hipL":"hipR",q.rotation.order="ZYX",q.position.set(D*(P/2-b/2),0,0),v.add(q);const gt=Oe(b,E/2,b,t.limb);gt.position.y=-E/4,q.add(gt);const yt=Xe();yt.name="knee",yt.position.y=-E/2,q.add(yt);const Kt=Oe(b,E/2,b,t.limb);Kt.position.y=-E/4,yt.add(Kt);const Qt=Oe(b*1.15,.07,b*1.7,t.shoe);Qt.position.set(0,-E/2+.035,.045),yt.add(Qt);const ae=new Ye;ae.name="footTip",ae.position.y=-E/2,yt.add(ae);const ye=Xe();return{root:q,joint:yt,hand:ye,wrist:ye,tip:ae,upperMesh:gt,lowerMesh:Kt,segLen:E/2}},Q=D=>{const q=Xe();q.name=D<0?"shoulderL":"shoulderR",q.rotation.order="YXZ",q.position.set(D*(P/2+b/2),M-.04-N,0),I.add(q);const gt=Oe(b,A/2,b,t.limb);gt.position.y=-A/4,q.add(gt);const yt=Xe();yt.name="elbow",yt.position.y=-A/2,q.add(yt);const Kt=Oe(b,A/2,b,t.limb);Kt.position.y=-A/4,yt.add(Kt);const Qt=Xe();Qt.name=D<0?"handL":"handR",Qt.position.y=-A/2,yt.add(Qt);const ae=Oe(b*1.1,.09,b*1.1,t.head);ae.position.y=.045,Qt.add(ae);const ye=Xe();return ye.name=D<0?"wristL":"wristR",Qt.add(ye),{root:q,joint:yt,hand:Qt,wrist:ye,upperMesh:gt,lowerMesh:Kt,segLen:A/2}},pt=Y(-1),at=Y(1),K=Q(-1),Z=Q(1),_t=[pt,at].map(D=>({root:D.root,joint:D.joint,tip:D.tip,upperLen:E/2,lowerLen:E/2,bend:1})),Ft=Xe(),ht=Xe();Ft.name="mountR",ht.name="mountL";const Pt=Xe(),B=Xe();Pt.name="gripR",B.name="gripL",Z.wrist.add(Ft),K.wrist.add(ht),Ft.add(Pt),ht.add(B);const ne=Jw(t),Ot=Qw(t),Ct=tE(t),xt={"sword-shield":{right:vr(.42,.075,t),left:Kw(t)},"dual-swords":{right:vr(.42,.075,t),left:vr(.42,.075,t)},greatsword:{right:qw(t),left:Oe(.12,.2,.12,t.wood)},staff:{right:ne.g,left:Xe(),orb:ne.orb},bow:{right:Ct,left:Ot.g,arrow:Ct,drawString:Ot.drawString}};for(const D of Object.keys(xt))Pt.add(xt[D].right),B.add(xt[D].left),xt[D].right.visible=!1,xt[D].left.visible=!1;function Nt(D,q,gt){const yt=new Ye;yt.name="bladeBase",yt.position.y=q,D.add(yt);const Kt=new Ye;Kt.name="bladeTip",Kt.position.y=gt,D.add(Kt)}Nt(xt["sword-shield"].right,.44,.55),Nt(xt["dual-swords"].right,.44,.55),Nt(xt["dual-swords"].left,.44,.55),Nt(xt.greatsword.right,.74,.88),Nt(xt.staff.right,.78,.92);let Bt=null,k=null,T=1,j=0,ut=0,J=null,ct=0,zt=0,St=0,Mt=0,dt=0,st=0,wt=Pw(),O={...Xh},ot=0,rt=0,Vt=0,Ht=-1,qt=0,U=0,bt=0,tt=0,mt=0,kt=0,Lt=0,Gt=1,ce=0,ge=0,te=0,we=0,Be=!1,Je=0,V=-1,Tt=0,Dt=0,ie=0,ue=!1,re=0,ve=0,Fe=0,$e=0,De="none",Ge=0,Vn=1,jn=!1,R=-1,X=!1,nt=0,it=0,W=0,At={...dh},Ut=0,Wt=0,Zt={active:!1,dist:0,gy:0,pitch:0,joint:0,grip:1},Jt=NaN,Rt=0,lt=0,Et=0,jt=NaN,oe=NaN,ze=-1,le=null,$t=null,ln=0,he=1,Qe=.1,bn=null,ke={lx:0,ly:0,lz:0,rx:0,ry:0,rz:0},hn=null,Ee=null,Cn=null,Si=null,gn=null,Xn=null,qn="R",Oi=0,Bi=0,kn=0,go=0,$h=1,hi=0,xo=null,sa=0,Zh=0,$r=NaN,jh=NaN,vo={speed:0,phase:0},oa=1,ra=1,As={lp:0,lr:0,rp:0,rr:0},Mm=0,Zr=0,jr=!0,qr=0,Rs="none",Da=0,ka=0,Ia=0,yo=.3,qh=0;function bm(D){const q=Math.PI/180,gt=s;let yt=0,Kt=0,Qt=0,ae=0;D==="sword-shield"?(yt=gt.swordPitchDeg*q,Qt=gt.shieldPitchDeg*q):D==="dual-swords"?(yt=gt.swordPitchDeg*q,Qt=gt.swordPitchDeg*q):D==="greatsword"?(yt=gt.greatswordPitchDeg*q,Qt=gt.greatswordPitchDeg*q):D==="staff"?yt=gt.staffPitchDeg*q:Qt=gt.bowPitchDeg*q,Ft.rotation.set(yt,0,Kt),ht.rotation.set(Qt,0,ae),Ft.position.x=D==="greatsword"?-Math.max(0,s.twoHandInsetX??0):0}function Kh(D){if(D!==Bt){Bt=D;for(const q of Object.keys(xt))xt[q].right.visible=q===D,xt[q].left.visible=q===D;bm(D),Ot.drawString.position.z=-.06,Ct.position.z=0,ne.orb.scale.setScalar(1),w.rotation.y=0}}Kh("sword-shield");const Jh=[];y.traverse(D=>{D instanceof _e&&D.material instanceof ho&&Jh.push(D.material)});const Sm=new se(r.flashColor);function wm(D,q){const gt=dm(D,q,r);wt=gt,w.rotation.x+=gt.upperPitch,w.rotation.z+=gt.upperRoll,w.rotation.y+=gt.upperYaw;const yt=fe(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),Kt=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;w.position.x+=fe(gt.upperShiftX*yt,-Kt,Kt),w.position.z+=fe(gt.upperShiftZ*yt,-Kt,Kt),x.position.x+=gt.comX,x.position.z+=gt.comZ-gt.pelvisBack,x.position.y-=gt.drop;const Qt=gt.legacy?0:fe(r.lowerScale,0,1);v.position.z+=gt.pelvisBack*(1-Qt),v.position.y+=gt.drop*(1-Qt),pt.joint.rotation.x+=gt.knee,at.joint.rotation.x+=gt.knee,pt.root.rotation.x-=gt.hip,at.root.rotation.x-=gt.hip,K.root.rotation.x+=gt.arm,Z.root.rotation.x+=gt.arm*.8;for(const ae of Jh)ae.emissive.copy(Sm).multiplyScalar(gt.flash)}function _o(D){return D<.22?-1:D<.42?-1+(D-.22)/.2*2:D<.5?1:Math.max(0,1-(D-.5)/.5)}function Em(D){for(const q of[K,Z])q.upperMesh.scale.set(D.girthArm,D.arm,D.girthArm),q.upperMesh.position.y=-q.segLen/2*D.arm,q.joint.position.y=-q.segLen*D.arm,q.lowerMesh.scale.set(D.girthArm,D.arm,D.girthArm),q.lowerMesh.position.y=-q.segLen/2*D.arm,q.hand.position.y=-q.segLen*D.arm;for(const q of[pt,at])q.upperMesh.scale.set(D.girthLeg,D.leg,D.girthLeg),q.upperMesh.position.y=-q.segLen/2*D.leg,q.joint.position.y=-q.segLen*D.leg,q.lowerMesh.scale.set(D.girthLeg,D.leg,D.girthLeg),q.lowerMesh.position.y=-q.segLen/2*D.leg,q.tip.position.y=-q.segLen*D.leg;z.scale.set(D.girthTorso,D.torso,D.girthTorso),z.position.y=$/2*D.torso,G&&(G.scale.set(D.girthTorso,D.torso,D.girthTorso),G.position.y=et/2*D.torso,L.position.y=$*D.torso)}function Tm(D,q){const gt=s.twoHandGripY??-.16,yt=Math.max(1,s.twoHandMaxStretch??1.25),Kt=A*yt*.99,Qt=K.root.position.x,ae=K.root.position.y,ye=K.root.position.z,pe=K.root.rotation.y,Ze=Math.cos(pe),je=Math.sin(pe),Ne=Vi=>{const za=Ft.localToWorld(new H(0,Vi,0)),wn=(F?L:w).worldToLocal(za),Na=wn.x-Qt,Qr=wn.y-ae,So=wn.z-ye,Ua={x:Na*Ze-So*je,y:Qr,z:Na*je+So*Ze};return{t:Ua,dist:Math.hypot(Ua.x,Ua.y,Ua.z)}};let Me=gt,Te=Ne(Me);if(!Number.isFinite(Te.dist)||Te.dist<=Li)return;for(let Vi=0;Vi<18&&Te.dist>Kt;Vi++)if(Me*=.78,Te=Ne(Me),!Number.isFinite(Te.dist)||Te.dist<=Li)return;Number.isFinite(Jt)||(Jt=Me);const en=Math.max(0,s.twoHandSlideRate??9);Jt+=(Me-Jt)*(1-Math.exp(-en*q));const Sn=Ne(Jt),tn=Sn.t,Kn=Sn.dist,In=Kn/Math.max(Li,A),Jn=fe(In,1,yt),di=Math.max(1,s.twoHandGripStart??1.02),Hi=Math.max(di+.001,yt),Gi=fe(s.twoHandMinGrip??1,0,1),Fn=fe((In-di)/(Hi-di),0,1),ui=1-Fn*Fn*(3-2*Fn)*(1-Gi),zn=A/2*Jn,Fa=fm(tn,zn,zn,-1),wi=pm({rootPitch:K.root.rotation.x,rootRoll:K.root.rotation.z,jointPitch:K.joint.rotation.x},Fa,fe(D*ui,0,1),Math.PI);K.root.rotation.x=wi.rootPitch,K.root.rotation.z=wi.rootRoll,K.joint.rotation.x=Math.min(wi.jointPitch,-.06);const Qn=1/Math.sqrt(Jn);K.upperMesh.scale.set(Qn,Jn,Qn),K.upperMesh.position.y=-zn/2,K.joint.position.y=-zn,K.lowerMesh.scale.set(Qn,Jn,Qn),K.lowerMesh.position.y=-zn/2,K.hand.position.y=-zn,Zt={active:!0,dist:Kn,gy:Jt,pitch:wi.rootPitch,joint:K.joint.rotation.x,grip:ui}}function Am(D,q){if(!g.enabled){Rt=0,lt=0,Z.wrist.rotation.set(0,0,0),jt=Z.root.rotation.x,oe=id();return}const gt=Z.root.rotation.x,yt=id();if(q!==ze){ze=q,jt=gt,oe=yt,Z.wrist.rotation.set(Rt,0,lt);return}if(!Number.isFinite(jt)||D<=1e-5){jt=gt,oe=yt,Z.wrist.rotation.set(Rt,0,lt);return}const Kt=(gt-jt)/D,Qt=He(yt-oe)/D;jt=gt,oe=yt;const ae=Math.max(0,g.maxAngle),ye=Math.max(0,g.maxTwist),pe=.15+.85*fe(Bi,0,1),je=-fe(Et,0,1.4)*Math.max(0,g.runDrag),Ne=fe(-Kt*g.lag*pe+je,-ae,ae),Me=fe(Qt*g.twistLag*pe,-ye,ye),Te=1-Math.exp(-Math.max(0,g.rate)*D);Rt+=(Ne-Rt)*Te,lt+=(Me-lt)*Te,Z.wrist.rotation.set(Rt,0,lt)}function Rm(D){const q=Math.PI/180;return D==="greatsword"?s.greatswordPitchDeg*q:D==="staff"?s.staffPitchDeg*q:D==="bow"?s.bowPitchDeg*q:s.swordPitchDeg*q}function Kr(D){const q=Math.PI/180;return D==="sword-shield"?s.shieldPitchDeg*q:D==="greatsword"?s.greatswordPitchDeg*q:D==="bow"?s.bowPitchDeg*q:s.swordPitchDeg*q}function Pm(D){const q=Math.PI/180;return D==="sword-shield"||D==="dual-swords"?(s.swordCantDeg??0)*q:D==="greatsword"?(s.greatswordCantDeg??0)*q:0}function Cm(D,q){const gt=D.weapon;if(gt==="staff"||gt==="bow")return;const yt=qn==="R",Kt=yt?Z:K,Qt=yt?Ft:ht,ae=yt?K:Z,ye=yt?ht:Ft,pe=gt==="greatsword"&&yt?st:0,Ze=gt==="greatsword"?s.greatswordYawDeg:s.swordYawDeg,je=Math.PI/180,Ne=-Ze*je,Me=Ze*je,Te=(Fn,ui)=>{const zn=Math.max(0,Math.PI/2-Math.abs(ui));return Math.sign(Fn)*Math.min(Math.abs(Fn),zn)},en=(hn??Rm(gt)+j)+pe,Sn=q+Kt.root.rotation.x+Kt.joint.rotation.x;Qt.rotation.set(Math.PI/2-en-Sn,0,Te(yt?Ne:Me,en));const tn=Ee??(gt==="sword-shield"?null:Kr(gt)+ut),Kn=q+ae.root.rotation.x+ae.joint.rotation.x;gt==="sword-shield"?ye.rotation.x=tn===null?Kr(gt):Kr(gt)-tn-Kn:ye.rotation.set(Math.PI/2-(tn??0)-Kn,0,Te(yt?Me:Ne,tn??0));const In=Pm(gt),Jn=gn??0,di=Xn??0,Hi=Cn??0,Gi=Si??0;yt?(Pt.rotation.z=-In+Jn,Pt.rotation.y=Hi,B.rotation.z=In+di,B.rotation.y=Gi):(B.rotation.z=In+Jn,B.rotation.y=Hi,Pt.rotation.z=-In+di,Pt.rotation.y=Gi)}function Qh(D){hn=D.bladePitch,Ee=D.bladePitchOff,Cn=D.bladeTwist,Si=D.bladeTwistOff,gn=D.bladeYaw,Xn=D.bladeYawOff,qn=D.lead,Oi=D.rootYaw+D.spinYaw,y.rotation.y=Oi,w.rotation.y+=D.yaw,w.rotation.x+=D.pitch,w.rotation.z+=D.roll,x.position.z+=D.pelvisZ,x.position.x+=D.pelvisX,D.armR&&(Z.root.rotation.x=D.armR.pitch,Z.root.rotation.y=D.armR.yaw,Z.root.rotation.z=D.armR.roll,Z.joint.rotation.x=D.armR.elbow),D.armL&&(K.root.rotation.x=D.armL.pitch,K.root.rotation.y=D.armL.yaw,K.root.rotation.z=D.armL.roll,K.joint.rotation.x=D.armL.elbow)}function td(D,q){const gt=bn??_o(D.attackProgress),yt=Ww(D.weapon,D.comboIndex,gt,p,D.attackProgress);if(D.comboIndex!==ln){$t=le,he=0,ln=D.comboIndex;const ae=D.timings.windup+D.timings.active+D.timings.recovery,ye=Math.max(p.segBlendMin??.03,ae*.22);Qe=jw($t,yt,p,yt.blend??null,ye)}const Kt=Math.max(.008,Qe);he=Math.min(1,he+q/Kt);const Qt=$t&&he<1?Yw($t,yt,Tf(he)):yt;return le=Qt,Qt}function Lm(D,q){const gt=P/2+b/2,yt=M-.04-N;if(!p.enabled){K.root.position.set(-gt,yt,0),Z.root.position.set(gt,yt,0),ke={lx:-gt,ly:yt,lz:0,rx:gt,ry:yt,rz:0};return}const Kt=Math.max(0,p.shoulderLift),Qt=Math.max(0,p.shoulderPush),ae=D&&q==="greatsword"?Math.max(0,p.shoulderIn):0,ye=Sn=>Kt*fe((-Sn-.5)/1.45,0,1),pe=Sn=>Qt*fe((-Sn-.2)/1.9,0,1),Ze=-gt+ae,je=yt+ye(K.root.rotation.x),Ne=pe(K.root.rotation.x),Me=gt-ae,Te=yt+ye(Z.root.rotation.x),en=pe(Z.root.rotation.x);K.root.position.set(Ze,je,Ne),Z.root.position.set(Me,Te,en),ke={lx:Ze,ly:je,lz:Ne,rx:Me,ry:Te,rz:en}}function Dm(D,q,gt){if(D.phase==="idle"||D.charging){Tt=0,Dt=0,ie=0;return}const yt=D.attackProgress,Kt=_o(yt),Qt=Math.max(0,Kt),ae=l.stride,ye=Number.isFinite(ae.stepReach)?ae.stepReach:.17,pe=Number.isFinite(ae.stepSideReach)?ae.stepSideReach:.14,Ze=Number.isFinite(ae.stepDipReach)?ae.stepDipReach:.05,je=D.weapon==="greatsword"?fe(Number.isFinite(ae.heavyScale)?ae.heavyScale:1,0,1):1,Ne=1-Math.exp(-12*Math.max(0,gt));Tt+=(ye*Qt*je-Tt)*Ne,Dt+=(q*pe*Qt*je-Dt)*Ne,ie+=(Ze*Math.sin(Math.PI*yt)*je-ie)*Ne,x.position.z+=Tt,x.position.x+=Dt,x.position.y-=ie}let ed=null;function km(){ed={upperX:w.rotation.x,upperY:w.rotation.y,upperZ:w.rotation.z,upperPX:w.position.x,upperPZ:w.position.z,pelvisX:x.position.x,pelvisY:x.position.y,pelvisZ:x.position.z,pelvisRX:x.rotation.x,pelvisRZ:x.rotation.z,lrx:K.root.rotation.x,lry:K.root.rotation.y,lrz:K.root.rotation.z,lj:K.joint.rotation.x,rrx:Z.root.rotation.x,rry:Z.root.rotation.y,rrz:Z.root.rotation.z,rj:Z.joint.rotation.x,rootY:y.rotation.y}}function Im(D){const q=ed;if(!q)return;const gt=Tf(fe(D,0,1));if(gt>=1)return;const yt=(Kt,Qt)=>Kt+(Qt-Kt)*gt;w.rotation.x=yt(q.upperX,w.rotation.x),w.rotation.y=yt(q.upperY,w.rotation.y),w.rotation.z=yt(q.upperZ,w.rotation.z),w.position.x=yt(q.upperPX,w.position.x),w.position.z=yt(q.upperPZ,w.position.z),x.position.x=yt(q.pelvisX,x.position.x),x.position.y=yt(q.pelvisY,x.position.y),x.position.z=yt(q.pelvisZ,x.position.z),x.rotation.x=yt(q.pelvisRX,x.rotation.x),x.rotation.z=yt(q.pelvisRZ,x.rotation.z),K.root.rotation.x=yt(q.lrx,K.root.rotation.x),K.root.rotation.y=yt(q.lry,K.root.rotation.y),K.root.rotation.z=yt(q.lrz,K.root.rotation.z),K.joint.rotation.x=yt(q.lj,K.joint.rotation.x),Z.root.rotation.x=yt(q.rrx,Z.root.rotation.x),Z.root.rotation.y=yt(q.rry,Z.root.rotation.y),Z.root.rotation.z=yt(q.rrz,Z.root.rotation.z),Z.joint.rotation.x=yt(q.rj,Z.joint.rotation.x),y.rotation.y=q.rootY+He(y.rotation.y-q.rootY)*gt,Oi=y.rotation.y}let Ps=null,Jr=0,nd=0;function Fm(){if(!F)return;const D=C,q=Math.max(0,D.waist??1),gt=Math.max(0,D.chest??0),yt=q+gt,Kt=yt>1e-6?q/yt:1,Qt=yt>1e-6?gt/yt:0,ae=w.rotation.x,ye=w.rotation.y,pe=w.rotation.z;w.rotation.set(ae*Kt,ye*Kt,pe*Kt),L.rotation.set(ae*Qt,ye*Qt,pe*Qt);const Ze=fe(D.neck??0,0,1);Ze>0&&(ft.rotation.x-=ae*Ze),Ps={x:ae,y:ye,z:pe}}function Mo(){return{yaw:w.rotation.y+(F?L.rotation.y:0),pitch:w.rotation.x+(F?L.rotation.x:0),lean:w.rotation.z+(F?L.rotation.z:0)}}function id(){return Mo().yaw}function zm(D,q){if(!(d!=null&&d.enabled)){xo=null,sa=0;return}y.updateWorldMatrix(!0,!0);const gt=new H,yt=[],Kt=(Qn,Vi,za=0)=>{Qn.getWorldPosition(gt),yt.push({x:gt.x,y:gt.y+za,z:gt.z,mass:Vi})},Qt=n.headSize;Kt(ft,.08,Qt/2),Kt(z,.14),Kt(G??L,.24),Kt(x,.12),Kt(K.hand,.05),Kt(Z.hand,.05),Kt(pt.joint,.15),Kt(at.joint,.15);const ae=Bt?bo(xt[Bt].right):null;ae&&yt.push({x:(ae.base.x+ae.tip.x)/2,y:(ae.base.y+ae.tip.y)/2,z:(ae.base.z+ae.tip.z)/2,mass:Bt==="greatsword"?.09:.04});const ye=Math.max(.05,n.limbThickness*1.15/2+.015),pe=Math.max(.06,n.limbThickness*1.7/2+.02);let Ze=1/0,je=-1/0,Ne=1/0,Me=-1/0,Te=0;for(const Qn of[pt,at])Qn.tip.getWorldPosition(gt),gt.y<=.13&&(Te+=1),Ze=Math.min(Ze,gt.x-ye),je=Math.max(je,gt.x+ye),Ne=Math.min(Ne,gt.z-pe),Me=Math.max(Me,gt.z+pe);(!Number.isFinite(Ze)||Te===0)&&(Ze=je=Ne=Me=0);let en=0,Sn=0;Number.isFinite($r)&&q>1e-5&&(en=fe((D.position.x-$r)/q,-20,20),Sn=fe((D.position.z-jh)/q,-20,20)),$r=D.position.x,jh=D.position.z;const tn=Fw(yt,{minX:Ze,maxX:je,minZ:Ne,maxZ:Me},en,Sn,d);if(xo=tn,!d.autoCounter){sa=0;return}const Kn=Math.cos(D.bodyYaw),In=-Math.sin(D.bodyYaw),Jn=tn.xcomX-tn.centerX,di=tn.xcomZ-tn.centerZ,Hi=Jn*Kn+di*In,Gi=en*Kn+Sn*In,Fn=tn.grounded?zw(Hi,Gi,d.predLead??0):0;nd=Fn;const ui=Math.abs(Fn)-.45*tn.halfX;Zh=ui;let zn=0;ui>.002&&tn.grounded&&(zn=-Math.sign(Fn)*Math.min(Math.max(.005,d.maxShift??.045),(ui+.002)*1.1666666666666667));const Fa=Math.abs(Fn)/Math.max(1e-4,tn.halfX),wi=Math.max(.1,Nw(d.counterRate,Fa,d.counterBoost??0));sa+=(zn-sa)*(1-Math.exp(-wi*q))}function Nm(D,q){if(Ot.drawString.position.z=-.06,Ct.position.z=0,ne.orb.scale.setScalar(1),w.rotation.y=0,D.charging&&D.weapon==="bow"){const Qt=D.charge;K.root.rotation.x=-1.25,K.joint.rotation.x=-.15,Z.root.rotation.x=.35+Qt*.3,Z.joint.rotation.x=-1.15,Ot.drawString.position.z=-.06-Qt*.22,Ct.position.z=-Qt*.3,w.rotation.y=-.22;return}if(D.phase==="idle"&&kn<=.001){$t=null,le=null,ln=0,he=1,Qe=Math.max(.008,p.segBlend),hn=null,Ee=null,Cn=null,Si=null,gn=null,Xn=null,Jt=NaN,D.weapon==="greatsword"&&(Ft.position.x=-Math.max(0,s.twoHandInsetX??0));return}const gt=_o(D.attackProgress),yt=Math.max(0,-gt),Kt=Math.max(0,gt);if(D.weapon==="bow")K.root.rotation.x=-1.2,K.joint.rotation.x=-.15,Z.root.rotation.x=.9-Kt*.8,Z.joint.rotation.x=-.3;else if(D.weapon==="greatsword")if(p.enabled)Qh(td(D,q));else{const Qt=-1.6*yt+1.25*Kt,ae=fe(Number.isFinite(l.stride.heavyScale)?l.stride.heavyScale:1,0,1);Z.root.rotation.x=Qt,Z.joint.rotation.x=-(.25+yt*.4),K.root.rotation.x=Qt+.06,K.joint.rotation.x=-(.32+yt*.4),K.root.rotation.z=.42,Z.root.rotation.z=0;const ye=-Math.sin(Z.root.rotation.x);Z.root.rotation.y=-.72*Math.tanh(ye*4),w.rotation.y=-.2*gt*ae}else if(p.enabled)Qh(td(D,q));else{const Qt=D.comboIndex;if(Qt===1)Z.root.rotation.x=-1.7*yt+1.1*Kt,Z.joint.rotation.x=-(.2+yt*.5),K.root.rotation.x=.1,w.rotation.y=-.18*gt;else if(Qt===2)K.root.rotation.x=-1.5*yt+1*Kt,K.joint.rotation.x=-(.2+yt*.5),Z.root.rotation.x=.2,w.rotation.y=.45*-gt;else{const ae=-1.9*yt+1.2*Kt;K.root.rotation.x=ae,Z.root.rotation.x=ae,K.joint.rotation.x=-(.15+yt*.4),Z.joint.rotation.x=-(.15+yt*.4),w.rotation.y=-.3*gt}}if(D.weapon==="greatsword"){const Qt=fe((-Z.root.rotation.x-1.3)/1.2,0,1);Ft.position.x=-Math.max(0,s.twoHandInsetX??0)*(1-Qt)}Dm(D,Je%2===0?1:-1,q)}function Um(D,q){D&&(Z.root.rotation.x=-1.05,Z.joint.rotation.x=-.35,K.root.rotation.x=-.45,K.joint.rotation.x=-.2,w.rotation.y=-.12,ne.orb.scale.setScalar(1.25+.12*Math.sin(q*2)))}function Om(D){if(!D||D.phase==="idle")return;const q=D.progress,gt=q<.3?-.35+q/.3*1.35:q<.7?1:Math.max(0,1-(q-.7)/.3),yt=Math.PI/180;w.rotation.x+=_.leanDeg*yt*gt,K.root.rotation.x-=_.shieldPitchDeg*yt*gt,K.joint.rotation.x-=.22*gt,Z.root.rotation.x-=.3*gt,x.position.z+=_.pelvisReach*Math.max(0,gt)}function bo(D){if(!D)return null;const q=D.getObjectByName("bladeBase"),gt=D.getObjectByName("bladeTip");if(!q||!gt)return null;D.updateWorldMatrix(!0,!1);const yt=q.getWorldPosition(new H),Kt=gt.getWorldPosition(new H),Qt=new H().setFromMatrixColumn(D.matrixWorld,0).normalize();return{base:{x:yt.x,y:yt.y,z:yt.z},tip:{x:Kt.x,y:Kt.y,z:Kt.z},normal:{x:Qt.x,y:Qt.y,z:Qt.z}}}return{group:y,update(D,q,gt,yt,Kt=!1,Qt,ae,ye){var md;Kh(q.weapon),y.rotation.y=0,Oi=0,w.rotation.x=0,w.rotation.z=0,x.position.x=0,x.position.y=E,x.position.z=0,x.rotation.z=0,x.rotation.x=0,w.position.x=0,w.position.y=0,w.position.z=0,L.rotation.set(0,0,0),v.position.x=0,v.position.y=0,v.position.z=0,v.rotation.z=0;const pe=Math.max(1/240,Math.min(yt,.1));J=((md=l.stance)==null?void 0:md[q.weapon])??null,k!==q.weapon&&(k=q.weapon,T=J?0:1);const Ze=Math.max(.01,(J==null?void 0:J.blend)??.22);T=Math.min(1,T+pe/Ze);const je=J?T:0;j=((J==null?void 0:J.bladePitchDeg)??0)*Math.PI/180*je,ut=((J==null?void 0:J.bladePitchOffDeg)??0)*Math.PI/180*je;const Ne=Qt===void 0?Mm+=yt:Qt;Zr=Ne;const Me=l.landing;Me.enabled?jr&&!D.grounded?(Rs="jump",Da=Ne,ka=Me.anticipationDuration,Ia=Math.max(0,Me.jumpAnticipation),yo=.32):!jr&&D.grounded&&(Rs="land",Da=Ne,ka=Me.duration,Ia=Rw(qr,Me),yo=Me.compressRatio,qh=qr):(Rs="none",Ia=0),Ne<Da&&(Rs="none",Ia=0),jr=D.grounded,qr=D.velocity.y;const Te=Sf(Ne,Da,ka,Ia,yo),en=q.phase!=="idle",Sn=(ye==null?void 0:ye.phase)==="active";Bi=ww(Bi,en,pe,l.attack.blendRate);const tn=Ew(Bi,l.attack.gaitWeight,l.attack.lowerBodyWeight);go=tn.attackLegWeight,$h=tn.gaitScale;const Kn=Math.sin(D.bodyYaw),In=Math.cos(D.bodyYaw),Jn=(D.velocity.x-ct)/pe,di=(D.velocity.z-zt)/pe,Hi=fe(Jn,-60,60),Gi=fe(di,-60,60),Fn=Hi*Kn+Gi*In,ui=He(D.bodyYaw-St)/pe,zn=Math.hypot(D.velocity.x,D.velocity.z),Fa=o.maxForwardDeg*Math.PI/180,wi=o.maxSideDeg*Math.PI/180,Qn=fe(Fn*o.accelGain,-Fa,Fa),Vi=fe(-ui*zn*o.turnGain,-wi,wi),za=1-Math.exp(-o.smoothing*pe);Mt+=(Qn-Mt)*za,dt+=(Vi-dt)*za,ct=D.velocity.x,zt=D.velocity.z,St=D.bodyYaw;const wn=Math.hypot(D.velocity.x,D.velocity.z),Na=fe(a.knockGaitScale??0,0,1),Qr=gt.knockX*Na,So=gt.knockZ*Na,Ua=Na>0&&Math.hypot(gt.knockX,gt.knockZ)>.001,tc=D.velocity.x+Qr,ec=D.velocity.z+So,ad=Math.hypot(tc,ec);$e=ad;const Bm=Math.cos(D.bodyYaw),Hm=-Math.sin(D.bodyYaw),Gm=D.velocity.x*Bm+D.velocity.z*Hm,sd=wn>Li?fe(Gm/wn,-1,1):0,od=wn>Li?fe((D.velocity.x*Kn+D.velocity.z*In)/wn,-1,1):1,Vm=Vh(od,a.backStrafeStartDeg,a.backStrafeFullDeg);De==="settled"&&X&&nt>it*1.02+1e-4&&(De="none");let Cs=1;De==="blend"?(Cs=rm(jn?R:Ge,a.stopYawBlendMode,jn),jn||(Ge=Math.min(1,Ge+pe/Math.max(.01,a.stopYawAfterSec)),(Ge>=1||a.stopYawBlendMode==="inStop"||X)&&(De="settled",Cs=0))):De==="settled"&&(Cs=fe(wn/Math.max(Li,a.stopEnterRatio*e),0,1)),Vn=Cs;const Xm=nm(sd,i.legYawScale,i.hipYawMaxDeg,a.strafeHipBoost),Wm=im(od,sd,Xm,Vm)*Cs;rt+=(Wm-rt)*(1-Math.exp(-i.hipYawSmoothing*pe));const Ls=D.bodyYaw+rt;Vt=Ls;const Ym=Math.sin(Ls),$m=Math.cos(Ls),Zm=Math.cos(Ls),jm=-Math.sin(Ls),Wn={speed:ad,phase:D.gaitPhase,localForward:tc*Ym+ec*$m,localRight:tc*Zm+ec*jm,stride:D.stride};if(en&&q.attackId!==V){const ee=!ue;V=q.attackId,Je+=1,te=ee&&(!Be||Wn.speed>.05)?Wn.phase:we,Be=!0}ue=en;const ti=Bi>0?bw(Wn,q.attackProgress,Je,Bi,l.stride,te):Wn;vo=ti,en&&(we=ti.phase);const nc=Math.max(0,a.dirFlipSec??0);nc>0?(oa=Ir(oa,ti.localForward>=0?1:-1,pe,nc),ra=Ir(ra,ti.localRight>=0?1:-1,pe,nc)):(oa=ti.localForward>=0?1:-1,ra=ti.localRight>=0?1:-1);const rd=Math.max(0,a.stopBlendSec||0),cd=rd>0&&!en&&!Ua&&D.grounded,ic=am(wn,ce,e,a.stopEnterRatio,a.stopExitRatio);if(!cd||ic.resume)Ht=-1;else if(Ht<0&&ic.enter){Ht=0,qt=D.gaitPhase,U=tm(D.gaitPhase),bt=wn,tt=Math.max(D.stride,Li),mt=Wn.localForward,kt=Wn.localRight;const ee=1/Math.max(Li,wn);Lt=D.velocity.x*ee,Gt=D.velocity.z*ee}const qm=ce;ce=wn;const fi=cd&&Ht>=0;fi&&(Ht=Math.min(1,Ht+pe/rd)),fi&&De!=="blend"&&(De="blend",Ge=0),jn=fi&&Ht<1,R=Ht,X=ic.resume,nt=wn,it=qm;const ld=fi?{phase:qt,speed:bt,moveSpeed:e,localForward:mt,localRight:kt,dirF:oa,dirR:ra,legLength:n.legLength,stride:tt,grounded:!0}:{phase:ti.phase,speed:ti.speed,moveSpeed:e,localForward:ti.localForward,localRight:ti.localRight,dirF:oa,dirR:ra,legLength:n.legLength,stride:ti.stride??0,grounded:D.grounded};let ac=fi?em(ld,a,{progress:Ht,phase0:qt,phaseEnd:U}):Fr(ld,a);const ca=l.attack.moveTakeover;if(ca&&!fi){const ee=q.phase==="windup"?ca.windup:q.phase==="recovery"?ca.recovery:q.phase==="settle"?ca.settle:0,de=Math.max(.05,ca.full-ca.speed),xn=fe((Wn.speed-ca.speed)/de,0,1),En=fe(ee,0,1)*xn,wo=En>hi?10:6;hi=fe(hi+(En-hi)*(1-Math.exp(-wo*pe)),0,1)}else fi?hi=0:hi=fe(hi*Math.exp(-8*pe),0,1);if(hi>.001&&!fi){const ee=Fr({phase:Wn.phase,speed:Wn.speed,moveSpeed:e,localForward:Wn.localForward,localRight:Wn.localRight,dirF:oa,dirR:ra,legLength:n.legLength,stride:Wn.stride??0,grounded:D.grounded},a);ac=Tw(ac,ee,hi)}const Ae=Aw(ac,tn.gaitScale);if(W=0,Sn&&ye){const ee=yw(ye.progress,ye.dir,a),de=tn.gaitScale;Ae.legL.pitchX+=ee.legL.pitchX*de,Ae.legL.rollZ+=ee.legL.rollZ*de,Ae.legL.kneeX+=ee.legL.kneeX*de,Ae.legR.pitchX+=ee.legR.pitchX*de,Ae.legR.rollZ+=ee.legR.rollZ*de,Ae.legR.kneeX+=ee.legR.kneeX*de,Ae.pelvisY+=ee.pelvisY*de,W=ee.env}let sc=0,oc=0,rc=0,hd=0;if(fi){const ee=om(D.bodyYaw,Lt,Gt),de=cm(Ht,qt,ee.forward,ee.right,a);de.leadLeft?(Ae.legL.pitchX-=de.leadPitch,Ae.legL.kneeX+=de.leadKnee,Ae.legR.pitchX+=de.trailPitch):(Ae.legR.pitchX-=de.leadPitch,Ae.legR.kneeX+=de.leadKnee,Ae.legL.pitchX+=de.trailPitch),oc=de.bodyShift*de.fwdN,sc=de.bodyShift*de.rightN,rc=de.bodyDip,hd=de.chestPitch,re=de.leadPitch,ve=de.bodyShift,Fe=de.bodyDip}else re=0,ve=0,Fe=0;if(As={lp:Ae.legL.pitchX,lr:Ae.legL.rollZ,rp:Ae.legR.pitchX,rr:Ae.legR.rollZ},!D.grounded)pt.root.rotation.x=-.55,at.root.rotation.x=-.25,pt.joint.rotation.x=.75,at.joint.rotation.x=.55,K.root.rotation.x=-.9,Z.root.rotation.x=-.7,K.joint.rotation.x=-.6,Z.joint.rotation.x=-.6,pt.root.rotation.z=0,at.root.rotation.z=0;else{pt.root.rotation.x=Ae.legL.pitchX,at.root.rotation.x=Ae.legR.pitchX,pt.root.rotation.z=Ae.legL.rollZ,at.root.rotation.z=Ae.legR.rollZ,pt.joint.rotation.x=Ae.legL.kneeX,at.joint.rotation.x=Ae.legR.kneeX;const ee=J?T:0,de=1+(((J==null?void 0:J.armSwing)??1)-1)*ee,xn=J==null?void 0:J.armR,En=J==null?void 0:J.armL,wo=Ae.armL*de+((En==null?void 0:En.pitch)??0)*ee,gd=Ae.armR*de+((xn==null?void 0:xn.pitch)??0)*ee;K.root.rotation.x=wo,Z.root.rotation.x=gd,K.joint.rotation.x=-(.18+wo*.2)+((En==null?void 0:En.elbow)??0)*ee,Z.joint.rotation.x=-(.18+gd*.2)+((xn==null?void 0:xn.elbow)??0)*ee,K.root.rotation.z=((En==null?void 0:En.roll)??0)*ee,Z.root.rotation.z=((xn==null?void 0:xn.roll)??0)*ee,K.root.rotation.y=((En==null?void 0:En.yaw)??0)*ee,Z.root.rotation.y=((xn==null?void 0:xn.yaw)??0)*ee,x.position.x=Ae.pelvisX,x.position.y=E+Ae.pelvisY,x.position.z=0,x.rotation.z=Ae.pelvisRoll}const Km=mm(x,v),Ds=Sn?{...f,weight:0}:fi&&f.enabled?{...f,weight:1}:f,dd=Ds.enabled&&D.grounded&&Ds.weight>0?fe(Ds.weight,0,1)*(en?fe(Ds.attackScale,0,1):1):0;x.position.x+=sc,x.position.z+=oc,x.position.y-=rc,v.position.y+=rc,dd<=0&&(v.position.x-=sc,v.position.z-=oc);const cc=wn/Math.max(e,Li);Et=cc;const Jm=Number.isFinite(o.crouchSmoothing)?o.crouchSmoothing:8,Qm=1-Math.exp(-Math.max(0,Jm)*pe);ot+=(fe(cc,0,1)-ot)*Qm;const Oa=um({leanForward:Mt,leanSide:dt,speedRatio:ot},o);x.rotation.x+=Oa.pelvisPitch,x.rotation.z+=Oa.pelvisRoll,x.position.x+=Oa.pelvisX,x.position.z+=Oa.pelvisZ,x.position.y-=Oa.crouch,v.position.y+=Oa.crouch*(1-fe(dd,0,1));const ud=q.phase!=="idle"||q.charging&&q.weapon==="bow",lc=ud?1:0,t0=Math.max(.001,lc>kn?p.poseIn??.1:p.poseOut??.16);if(kn!==lc){const ee=pe/t0;kn=fe(kn+(lc>kn?ee:-ee),0,1)}if((kn>0||ud)&&km(),Nm(q,pe),kn>0&&kn<1&&Im(kn),J){const ee=(1-kn)*T;w.rotation.y+=(J.torsoYaw??0)*ee,w.rotation.x+=(J.torsoPitch??0)*ee}Um(Kt,D.gaitPhase),Om(ae);const e0=q.weapon==="greatsword",fd=Math.hypot(D.velocity.x,D.velocity.z),n0=e0&&q.phase==="idle"&&fd>.5?Math.min(1.15,fd/Math.max(e,.001)*.9):0;st+=(n0-st)*(1-Math.exp(-6*pe));const i0=w.rotation.x;q.weapon==="bow"&&(Ot.g.rotation.x=-(K.root.rotation.x+K.joint.rotation.x),Ct.rotation.x=-(Z.root.rotation.x+Z.joint.rotation.x));const a0=w.rotation.y;wm(gt,D.bodyYaw);const pd=gt.type==="none"?1:.4;if(w.rotation.x+=Mt*pd+hd,w.rotation.z+=(dt+Ae.sideLean)*pd,Te>0&&(pt.root.rotation.x-=Me.hipPitch*Te,at.root.rotation.x-=Me.hipPitch*Te,pt.joint.rotation.x+=Me.kneeBend*Te,at.joint.rotation.x+=Me.kneeBend*Te,x.position.y-=Me.crouchDepth*Te,v.position.y+=Me.crouchDepth*(1-Me.lowerScale)*Te,w.rotation.x+=Me.upperPitch*Te,K.root.rotation.x-=Me.armTuck*Te,Z.root.rotation.x-=Me.armTuck*Te),go>0&&D.grounded){const ee=Sw(q.attackProgress,Je,l.stride),de=go;pt.root.rotation.x+=ee.legL.pitchX*de,at.root.rotation.x+=ee.legR.pitchX*de,pt.root.rotation.z+=ee.legL.rollZ*de,at.root.rotation.z+=ee.legR.rollZ*de,pt.joint.rotation.x+=ee.legL.kneeX*de,at.joint.rotation.x+=ee.legR.kneeX*de,x.position.x+=ee.pelvisX*de,x.position.y+=ee.pelvisY*de,x.rotation.z+=ee.pelvisRoll*de}if(Lm(en,q.weapon),d!=null&&d.enabled&&d.autoCounter&&Math.abs(sa)>1e-4&&(x.position.x+=sa),m.enabled){const ee=q.phase!=="idle"&&!q.charging,de=ee?_o(q.attackProgress):0;ee&&Wt>.55&&de<Wt-1e-4&&(Ut=1),Wt=de,Ut=Hw(Ut,pe,m.impactDecay);const xn=Ow({swing:de,charge:q.charging?q.charge:0,impact:Ut,speedRatio:cc,grounded:D.grounded},m);At=Bw(At,xn,pe,m.smoothing)}else At={...dh};Em(At),v.rotation.y=rt,ge=sm(rt,a.chestYawScale,a.chestYawMaxDeg),w.rotation.y+=ge;const s0=a0;if(ft.rotation.y=He(D.headYaw-D.bodyYaw-s0-ge),ft.rotation.x=-fe(D.headPitch??0,-.7,.7),w.rotation.x+=-fe(D.bodyPitch??0,-.4,.4),Fm(),Am(yt,q.comboIndex),Cm(q,i0),q.weapon==="greatsword"&&!q.charging&&(q.phase!=="idle"||kn>0)){y.updateWorldMatrix(!0,!0);const ee=q.phase==="idle"?Math.max(kn,Bi):1;Tm(fe(ee,0,1),pe)}if(O=gm({root:y,pelvis:x,lower:v,limbs:_t,base:Km,cfg:Ds,grounded:D.grounded,attacking:en}),zm(D,pe),F&&Ps){const ee=Mo();Jr=Math.max(Math.abs(ee.pitch-Ps.x),Math.abs(ee.yaw-Ps.y),Math.abs(ee.lean-Ps.z))}else Jr=0},lean(){return{forward:Mt,side:dt}},landing(){const D=Sf(Zr,Da,ka,Ia,yo),q=ka>0?Math.max(0,ka-Math.max(0,Zr-Da)):0;return{pulse:D,remaining:q,kind:D>0?Rs:"none",impactVy:qh}},hurt(){return wt},ik(){return O},stretch(){return{...At,impact:Ut}},gripDebug(){return{...Zt}},weaponDebug(){return{wristPitch:Rt,wristTwist:lt}},setClipT(D){bn=D===null||!Number.isFinite(D)?null:Math.max(0,Math.min(1,D))},stanceDebug(){const D=J==null?void 0:J.armR,q=J==null?void 0:J.armL,gt=J?T:0;return{weapon:Bt??"sword-shield",weight:gt,armL:{pitch:((q==null?void 0:q.pitch)??0)*gt,yaw:((q==null?void 0:q.yaw)??0)*gt,roll:((q==null?void 0:q.roll)??0)*gt,elbow:((q==null?void 0:q.elbow)??0)*gt},armR:{pitch:((D==null?void 0:D.pitch)??0)*gt,yaw:((D==null?void 0:D.yaw)??0)*gt,roll:((D==null?void 0:D.roll)??0)*gt,elbow:((D==null?void 0:D.elbow)??0)*gt},torsoYaw:((J==null?void 0:J.torsoYaw)??0)*gt,torsoPitch:((J==null?void 0:J.torsoPitch)??0)*gt,bladePitchDeg:j*180/Math.PI,bladePitchOffDeg:ut*180/Math.PI,armSwing:(J==null?void 0:J.armSwing)??1}},swingDebug(){const D=le;return{seg:ln,kind:(D==null?void 0:D.kind)??"right-left",lead:(D==null?void 0:D.lead)??"R",yaw:(D==null?void 0:D.yaw)??0,rootYaw:(D==null?void 0:D.rootYaw)??0,spinYaw:(D==null?void 0:D.spinYaw)??0,rootTurn:Oi,pitch:(D==null?void 0:D.pitch)??0,roll:(D==null?void 0:D.roll)??0,strike:(D==null?void 0:D.strike)??0,bladeTwist:(D==null?void 0:D.bladeTwist)??0,bladeTwistOff:(D==null?void 0:D.bladeTwistOff)??0,bladeYaw:(D==null?void 0:D.bladeYaw)??0,bladeYawOff:(D==null?void 0:D.bladeYawOff)??0,shoulderL:{x:ke.lx,y:ke.ly,z:ke.lz},shoulderR:{x:ke.rx,y:ke.ry,z:ke.rz}}},attackBlend(){return Bi},attackWeights(){return{gaitScale:$h,attackLegWeight:go,driveSpeed:vo.speed,stridePhase:vo.phase,strideBase:te,stepIndex:Je}},hipYaw(){return rt},torsoTotal(){return Mo()},spineDebug(){if(!F)return null;const D=Mo();return{enabled:!0,waistYaw:w.rotation.y,chestYaw:L.rotation.y,totalYaw:D.yaw,totalPitch:D.pitch,totalLean:D.lean,neckPitch:ft.rotation.x,leak:Jr}},balanceDebug(){return xo?{...xo,shift:sa,latDeficit:Zh,lateralFf:nd}:null},gaitDebug(){return{stopT:Ht,hipYaw:rt,chestYaw:ge,speed:ce,gaitSpeed:$e,stopStep:re,stopShift:ve,stopDip:Fe,stopYawFade:Vn,turnStep:W,legTakeover:hi,legLPitch:As.lp,legLRoll:As.lr,legRPitch:As.rp,legRRoll:As.rr,phase:vo.phase,dirF:oa,dirR:ra}},gaitYaw(){return Vt},arrowDirection(){Ct.updateWorldMatrix(!0,!1);const D=Ct.matrixWorld.elements,q=D[8],gt=D[9],yt=D[10],Kt=Math.hypot(q,gt,yt)||1;return{x:q/Kt,y:gt/Kt,z:yt/Kt}},weaponBlade(){return Bt?bo(xt[Bt].right):null},bladesWorld(){return Bt?{right:bo(xt[Bt].right),left:bo(xt[Bt].left)}:{right:null,left:null}},dispose(){y.traverse(D=>{if(D instanceof _e){D.geometry.dispose();const q=D.material;Array.isArray(q)?q.forEach(gt=>gt.dispose()):q.dispose()}})}}}function eE(n){const t=xm(n.voxel,n.colors,n.moveSpeed,n.orientation,n.gait,n.mount,n.lean,n.hurt,n.animation,n.ik,n.links,n.wrist,n.balance),e=new Pe;e.add(t.group);const i={position:{x:0,y:0,z:0},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:1,distance:0,coyoteTime:0,jumpBuffer:0},a=[];for(const s of["headPivot","chest","torsoUpper","torso","pelvis"]){const o=t.group.getObjectByName(s);o&&a.push(o)}return{group:e,update(s,o,r){i.position.x=s.position.x,i.position.y=s.position.y,i.position.z=s.position.z,i.velocity.x=s.velocity.x,i.velocity.y=s.velocity.y,i.velocity.z=s.velocity.z,i.facing=s.facing,i.moveYaw=Math.atan2(i.velocity.x,i.velocity.z),i.bodyYaw=s.bodyYaw,i.headYaw=s.headYaw,i.gaitPhase=s.gaitPhase,i.stride=s.stride,i.distance=s.distance,i.grounded=!0,i.sprinting=!1,e.position.set(s.position.x,s.position.y,s.position.z),e.rotation.y=s.bodyYaw,s.combat&&t.update(i,s.combat,s.hurt,o,!1,r,s.link)},debug(){return t.gaitDebug()},boneAtWorld(s,o,r){if(a.length===0)return null;const l=new H(s,o,r),c=new H;let h=null,u=Number.POSITIVE_INFINITY;for(const d of a){d.updateWorldMatrix(!0,!1),d.getWorldPosition(c);const f=c.distanceToSquared(l);f<u&&(u=f,h=d)}return h?{node:h,point:l}:null},dispose(){t.dispose()}}}const va=.012,ya=.016;function nE(n,t){const e=t.lab,i=new Pe;i.name="test-lab";const a=[],s=[],o=[],r=[];function l(y){return o.push(y),y}function c(y){return r.push(y),y}function h(y,x,v,w=va){const S=l(new fn({color:x,transparent:!0,opacity:v,depthWrite:!1,side:qe,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),E=new _e(y,S);return E.rotation.x=-Math.PI/2,E.position.y=w,E.renderOrder=2,E}function u(y,x){return c(new ms(Math.max(y,.001),x,72))}function d(y,x,v,w=ya){const E=document.createElement("canvas"),A=E.getContext("2d");if(!A)return new _e;const b='700 96px "Noto Sans SC", ui-monospace, Menlo, monospace';A.font=b,E.width=du.ceilPowerOfTwo(Math.ceil(A.measureText(y).width)+32),E.height=du.ceilPowerOfTwo(96*1.4);const M=E.getContext("2d");if(!M)return new _e;M.font=b,M.textAlign="center",M.textBaseline="middle",M.fillStyle=v,M.fillText(y,E.width/2,E.height/2);const P=new rh(E);P.colorSpace=Rn,s.push(P);const C=E.width/E.height,F=c(new $n(x*C,x)),N=l(new fn({map:P,transparent:!0,depthWrite:!1,side:qe,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3})),L=new _e(F,N);return L.rotation.x=-Math.PI/2,L.position.y=w,L.renderOrder=3,L}function f(y,x,v,w,S,E){const A=v-x,b=c(new $n(A,w)),M=h(b,S,E,va);M.position.set(A/2+x,va,0);const P=new Pe;return P.add(M),P.rotation.y=y-Math.PI/2,P}function g(y,x,v,w,S){const E=new $p;E.moveTo(0,x*.5),E.lineTo(-v*.5,x*.5-v*.9),E.lineTo(-v*.18,x*.5-v*.9),E.lineTo(-v*.18,-x*.5),E.lineTo(v*.18,-x*.5),E.lineTo(v*.18,x*.5-v*.9),E.lineTo(v*.5,x*.5-v*.9),E.closePath();const A=c(new Gh(E)),b=h(A,w,S,va+.002),M=new Pe;return M.add(b),M.rotation.y=y+Math.PI,M}function _(y){var A;const x=new Pe,v=d(`${y.index} · ${y.name}`,t.lab.labelTextHeight,"#eaf4ff"),S=((A=v.geometry.parameters)==null?void 0:A.width)??3;x.add(v);const E=h(c(new $n(S*.98,.08)),y.color,.7,ya);return E.position.set(0,ya,t.lab.labelTextHeight*.66),x.add(E),x.position.set(y.labelX,0,y.labelZ),x}const m=new Pe;for(const y of n??[]){const x=new Pe;if(x.position.set(y.x,0,y.z),y.shape==="square"){const v=y.radius,w=h(c(new $n(v*2,v*2)),y.color,e.padOpacity*.09);x.add(w);const S=.07,E=[[0,v,v*2+S,S],[0,-v,v*2+S,S],[-v,0,S,v*2+S],[v,0,S,v*2+S]];for(const[A,b,M,P]of E){const C=h(c(new $n(M,P)),y.color,e.padOpacity);C.position.x=A,C.position.z=b,x.add(C)}}else x.add(h(c(new Uh(y.radius,72)),y.color,e.padOpacity*.075)),x.add(h(u(y.radius-.075,y.radius),y.color,e.padOpacity));if(y.id==="hub"){for(let v=0;v<4;v++){const w=v*Math.PI/4,S=v%2===0;for(const E of[0,Math.PI])x.add(f(w+E,y.radius*.12,y.radius*.94,S?.09:.055,y.color,S?.5:.32))}x.add(h(u(.5,.56),y.color,.4))}else if(y.id==="dash"){const v=y.spawnZ-y.z,w=-y.radius+.5,S=v-w,E=h(c(new $n(.06,S)),y.color,.36);E.position.set(0,va,(v+w)/2),x.add(E);let A=0;for(let M=v;M>=w-.01;M-=1,A++){const P=A%5===0,C=h(c(new $n(P?2.4:1.3,P?.1:.07)),y.color,P?.72:.42);C.position.set(0,va,M),x.add(C);const F=d(String(A),.52,P?"#eaf4ff":"rgba(200,225,245,0.8)");F.position.set(1.6,ya,M),x.add(F)}const b=[[3.2,"翻滚 3.2"],[5,"闪现 5.0"]];for(const[M,P]of b){const C=v-M,F=h(c(new $n(1.9,.09)),"#ffffff",.5);F.position.set(-1.5,va,C),x.add(F);const N=d(P,.42,"rgba(220, 236, 250, 0.86)");N.position.set(-3,ya,C),x.add(N)}}else if(y.id==="gait"){x.add(h(u(1.44,1.5),y.color,.5)),x.add(h(u(1.14,1.2),y.color,.22));const v=1.55,w=[[0,"180° 正后退","#ff9a8a"],[Math.PI/4,"135° 斜后","#ffd166"],[Math.PI/2,"90° 正侧移","#8fe7ff"]];for(const[S,E,A]of w){const M=Math.sin(S),P=Math.cos(S),C=g(S,1.7,.34,A,.75);C.position.set(M*1.7*.5,0,v+P*1.7*.5),x.add(C);const F=d(E,.44,A);F.position.set(M*(1.7+.7),ya,v+P*(1.7+.7)),x.add(F)}}if(m.add(x),e.showLabels){const v=_(y);a.push(v),m.add(v)}}i.add(m);const p=n==null?void 0:n.find(y=>y.id==="hub");if(p&&e.showLabels){const y=[[0,-1,"屏上"],[0,1,"屏下"],[-1,0,"屏左"],[1,0,"屏右"]];for(const[x,v,w]of y){const S=d(w,.4,"rgba(190, 224, 248, 0.8)");S.position.set(p.x+x*(p.radius+.7),ya,p.z+v*(p.radius+.7)),i.add(S),a.push(S)}}return i.visible=e.enabled,{group:i,setVisible(y){i.visible=y},setLabelsVisible(y){for(const x of a)x.visible=y},dispose(){for(const y of r)y.dispose();for(const y of o)y.dispose();for(const y of s)y.dispose();i.clear()}}}const Ve={groundArea:12,ringHalo:20,ring:22,ringMeter:24,ringWarn:26,groundFx:30,trail:40,slash:44,projectileTrail:46,projectile:48,projectileGlow:50};function Af(n,t){n.renderOrder=t,n.traverse(e=>{e.renderOrder=t})}function il(n,t,e){const i=Array.from({length:t.count},()=>{const a=new fn({color:t.color,transparent:!0,opacity:0,side:qe,depthWrite:!1,...t.blending?{blending:t.blending}:{}}),s=new _e(t.geometry,a);return s.rotation.x=-Math.PI/2,s.renderOrder=t.renderOrder,s.visible=!1,n.add(s),{mesh:s,mat:a,life:0,base:1,delay:0}});return{entries:i,spawn(a,s,o,r,l){const c=i.find(h=>h.life<=0)??i[0];l!=null&&l.color&&c.mat.color.set(l.color),c.mesh.position.set(a,e(a,s,o)+t.yOffset,s),c.base=r,c.mesh.scale.setScalar(r*t.scaleFrom),c.mesh.visible=!0,c.mat.opacity=t.spawnOpacity,c.life=t.duration,c.delay=(l==null?void 0:l.delay)??0},update(a){for(const s of i){if(s.life<=0)continue;if(s.delay>0){s.delay-=a;continue}s.life-=a;const o=Math.max(0,s.life/Math.max(t.duration,1e-6));s.mesh.scale.setScalar(s.base*(t.scaleFrom+t.scaleSpan*(1-Math.pow(o,t.growPow)))),s.mat.opacity=t.peak*Math.pow(o,t.fadePow),s.life<=0&&(s.mesh.visible=!1)}},live(){return i.filter(a=>a.life>0)},dispose(){for(const a of i)a.mat.dispose()}}}function iE(n,t,e,i){const a=t.dash,s={count:6,geometry:new ms(a.ringRadius-.06,a.ringRadius,28),color:"#ffffff",renderOrder:Ve.groundFx,duration:a.fxDuration,peak:.9,fadePow:1,scaleFrom:.6,scaleSpan:1.2,growPow:1,yOffset:.04,spawnOpacity:.9},o=il(n,s,i),r=t.links,l={count:5,geometry:new ms(r.ringRadius-.07,r.ringRadius,28),color:r.chargeColor,renderOrder:Ve.groundFx,duration:r.fxDuration,peak:.85,fadePow:1,scaleFrom:.55,scaleSpan:1.1,growPow:1,yOffset:.05,spawnOpacity:.85},c=il(n,l,i),h=t.groundSlam,u={count:4,geometry:new ms(.78,1,56),color:h.color,blending:ki,renderOrder:Ve.groundFx+1,duration:h.duration,peak:.85,fadePow:1.3,scaleFrom:.35,scaleSpan:.65,growPow:1.8,yOffset:.035,spawnOpacity:0},d=il(n,u,i);let f=e.dash.id,g="none",_=e.playerLink.id,m=e.playerLink.hitIds.length,p=e.combat.slamAttackId,y=0;return{update(x,v,w){var A;const S=x.character;if(x.dash.id!==f){f=x.dash.id;const b=x.dash;g=b.kind,b.kind==="blink"?(o.spawn(b.fromX,b.fromZ,S.position.y,.9,{color:a.blinkColor}),o.spawn(b.toX,b.toZ,S.position.y,1.35,{color:a.blinkColor})):o.spawn(b.fromX,b.fromZ,S.position.y,1.1,{color:a.rollColor})}if(o.update(v),x.combat.slamAttackId!==p&&(p=x.combat.slamAttackId,y+=1,h.enabled)){const b=(A=x.config.combat.weapons[x.combat.weapon])==null?void 0:A.groundSlam,M=Math.max(.6,(b==null?void 0:b.radius)??2.2);d.spawn(S.position.x,S.position.z,S.position.y,M,{delay:0}),d.spawn(S.position.x,S.position.z,S.position.y,M*h.outerScale,{delay:h.delay}),w(h.shake)}d.update(v);const E=x.playerLink;E.id!==_&&(_=E.id,m=E.hitIds.length,c.spawn(S.position.x,S.position.z,S.position.y,1)),E.hitIds.length>m?(m=E.hitIds.length,c.spawn(S.position.x,S.position.z,S.position.y,1.35)):E.hitIds.length<m&&(m=E.hitIds.length),c.update(v)},slamDebug(){return{spawns:y,lastId:p,live:d.live().map(x=>({life:x.life,scale:x.mesh.scale.x,opacity:x.mat.opacity,visible:x.mesh.visible}))}},groundOrder(){var x;return((x=d.entries[0])==null?void 0:x.mesh.renderOrder)??Ve.groundFx+1},activeDash(){return o.live().length},dashKind(){return g},dispose(){o.dispose(),c.dispose(),d.dispose();for(const x of[s.geometry,l.geometry,u.geometry])x.dispose()}}}const Wh=64,vm=[0,.24,.76,1],aE=[0,1,1,0],ym=[0,.12,.28,.5,.72,.88,1],sE=[0,.16,.5,1,.5,.16,0];function Rf(n,t){if(t<=1e-6)return 1;const e=Math.min(1,Math.max(0,n/t));return e*e*(3-2*e)}function Yh(n,t,e,i,a=Wh,s="band"){const o=Math.max(.001,n-t*.5),r=Math.max(o+.001,n+t*.5),l=s==="glow"?ym:vm,c=s==="glow"?sE:aE,h=l.length,u=a+1,d=new Float32Array(u*h*3),f=new Float32Array(u*h*4),g=[];for(let m=0;m<u;m++){const p=m/a,y=(p-.5)*e,x=Rf(p,i)*Rf(1-p,i),v=Math.sin(y),w=Math.cos(y);for(let S=0;S<h;S++){const E=o+(r-o)*l[S],A=m*h+S;d[A*3]=v*E,d[A*3+1]=0,d[A*3+2]=w*E;const b=x*c[S];f[A*4]=1,f[A*4+1]=1,f[A*4+2]=1,f[A*4+3]=b}}for(let m=0;m<a;m++)for(let p=0;p<h-1;p++){const y=m*h+p,x=y+h;g.push(y,x,y+1,y+1,x,x+1)}const _=new sn;return _.setAttribute("position",new mn(d,3)),_.setAttribute("color",new mn(f,4)),_.setIndex(g),_.computeBoundingSphere(),_}function al(n){const t=new fn({color:n.color,transparent:!0,opacity:n.opacity,depthWrite:!1,side:qe,vertexColors:!0,toneMapped:!1}),e=new Map;let i=null;const a=(l,c)=>{const h=Math.round(l*32)/32,u=Math.max(.05,Math.round(c*20)/20),d=`${Math.round(h*32)}|${Math.round(u*20)}`,f=e.get(d);if(f)return f;const g=Yh(n.radius,n.thickness*u,h,n.edgeFade,Wh,n.profile??"band");if(e.set(d,g),e.size>64){for(const[_,m]of e)if(_!==d&&m!==i){m.dispose(),e.delete(_);break}}return g};i=a(n.arcRad,1);const s=new _e(i,t);s.position.y=n.y,s.renderOrder=n.renderOrder??4;let o=n.arcRad,r=1;return{mesh:s,update(l,c,h,u,d,f=1){const g=Math.max(.05,f);(Math.abs(l-o)>.01||Math.abs(g-r)>.01)&&(i=a(l,g),s.geometry=i,o=l,r=g),t.opacity=c,t.color.copy(u),s.scale.set(h,1,h),s.rotation.y=d,s.visible=c>.002},arcRad(){return o},dispose(){for(const l of e.values())l.dispose();e.clear(),t.dispose()}}}function Pf(n,t){return Math.max(.05,n*.5*Math.max(.1,t))}function oE(n,t,e,i,a){const s=a.arcDeg*Math.PI/180,o=a.playerOpacity;if(!n)return{arcRad:s,opacity:o,scale:1,level:0};const r=Math.min(1,Math.max(0,t)),l=Math.min(1,Math.max(0,e)),c=a.selectedArcDeg*Math.PI/180,h=s+(c-s)*(.35+.65*r),u=4+4*r+6*l,d=.5+.5*Math.sin(i*u),f=Math.min(.95,o+(.2+.1*l)*r+.04*d),g=1+.02*r+.012*d*r;return{arcRad:h,opacity:f,scale:g,level:r}}function rE(n,t,e,i,a){const s=Math.min(1,Math.max(0,a));return s<=.001?n.copy(t):s<.5?n.copy(t).lerp(e,s*2):n.copy(e).lerp(i,(s-.5)*2)}function cE(n=64,t=.06,e=5){const i=n+1,a=e+1,s=new Float32Array(i*a*3),o=new Float32Array(i*a*4),r=[];for(let c=0;c<i;c++){const h=c/n*Math.PI*2,u=Math.sin(h),d=Math.cos(h);for(let f=0;f<a;f++){const g=f/e,_=t+(1-t)*g,m=c*a+f;s[m*3]=u*_,s[m*3+1]=0,s[m*3+2]=d*_;const p=Math.pow(1-g,1.8)*.9+(f===0?.1:0);o[m*4]=1,o[m*4+1]=1,o[m*4+2]=1,o[m*4+3]=Math.min(1,p)}}for(let c=0;c<n;c++)for(let h=0;h<e;h++){const u=c*a+h,d=u+a;r.push(u,d,u+1,u+1,d,d+1)}const l=new sn;return l.setAttribute("position",new mn(s,3)),l.setAttribute("color",new mn(o,4)),l.setIndex(r),l.computeBoundingSphere(),l}function Cf(n){const t=n.segments??Wh,e=n.profile??"band",a=((e==="glow"?ym.length:vm.length)-1)*6,s=Yh(n.radius,n.thickness,n.arcRad,n.edgeFade,t,e),o=new fn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:qe,vertexColors:!0,toneMapped:!1}),r=new _e(s,o);r.position.y=n.y,r.renderOrder=n.renderOrder??7,r.visible=!1,s.setDrawRange(0,0);let l=0;return{mesh:r,set(c,h,u,d,f=1){const g=Math.min(1,Math.max(0,c)),_=Math.round(g*t),m=g>.001?Math.max(1,_)*a:0;m!==s.drawRange.count&&s.setDrawRange(0,m),l=_,o.opacity=h,o.color.copy(u),r.scale.set(f,1,f),r.rotation.y=d,r.visible=h>.002&&g>.001},ratio(){return t>0?l/t:0},filledSegments(){return l},dispose(){s.dispose(),o.dispose()}}}function Lf(n){const t=new Pe,e=cE(48),i=new fn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:qe,vertexColors:!0,toneMapped:!1}),a=new _e(e,i);a.renderOrder=n.renderOrder??2,t.add(a);const s=Math.max(.01,n.edgeWidthRatio??.045),o=Yh(1-s*.5,s,Math.PI*2,0,64,"band"),r=new fn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:qe,vertexColors:!0,toneMapped:!1}),l=new _e(o,r);return l.renderOrder=(n.renderOrder??2)+1,t.add(l),t.position.y=n.y,{group:t,set(c,h,u,d,f,g){const _=Math.min(1,Math.max(0,f));t.position.set(c,u,h),a.scale.set(d,1,d),l.scale.set(d,1,d),i.opacity=_*.26,r.opacity=_*(.72+.18*Math.sin(g*7)),t.visible=_>.004},dispose(){e.dispose(),i.dispose(),o.dispose(),r.dispose()}}}function Df(n,t,e,i){if(i<=1e-4||e<=0)return t;const a=1-Math.exp(-e/i);return n+(t-n)*a}function lE(n,t,e){if(n!=="windup")return{active:!1,ratio:0,urgency:0};const i=Math.max(1e-4,e),a=Math.min(1,Math.max(0,t/i));return{active:!0,ratio:a,urgency:.35+.65*a}}function hE(n){if(n.charging)return{source:"charge",ratio:Math.min(1,Math.max(0,n.charge))};if(n.channeling){if(n.channelProgress!==void 0)return{source:"channel",ratio:Math.min(1,Math.max(0,n.channelProgress))};const i=Math.max(1e-4,n.fireInterval);return{source:"channel",ratio:1-Math.min(1,Math.max(0,n.fireTimer/i))}}const t=n.arcaneCooldown??0,e=n.arcaneCooldownMax??0;return t>0&&e>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,t/e))}:n.dashCooldown>0&&n.dashCooldownMax>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,n.dashCooldown/n.dashCooldownMax))}:{source:"none",ratio:0}}function dE(n,t,e,i,a,s){return n!=="windup"||a<=.05?{active:!1,x:t,z:e,radius:0}:{active:!0,x:t+Math.sin(i)*a,z:e+Math.cos(i)*a,radius:Math.max(.3,s)}}function uE(n,t){const e=Math.max(.02,t),i=Math.min(1,Math.max(0,n/e));return{scale:.06+.94*(1-Math.pow(1-i,3)),alpha:i}}function fE(n,t,e){return n?t:e}function _m(n){return{x:0,y:0,z:1}}function pE(n){return Math.asin(_m().y)}function mE(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}const gE=Math.PI/3;function kf(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function xE(){let n=0,t=!1;return{update(e,i,a,s=gE){if(!Number.isFinite(e))return n;if(!t)return t=!0,n=e,n;if(!(a>0)||!(i>0))return n=e,n;const o=kf(e-n);if(Math.abs(o)>=s)return n=e,n;const r=1-Math.exp(-i/(a/1e3));return n=kf(n+o*r),n},reset(e){t=!0,n=e},get value(){return n},get ready(){return t}}}function vE(n){const t=Math.max(2,Math.floor(n.maxSamples)),e=new sn,i=new Float32Array(t*2*3),a=new Float32Array(t*2*3),s=new mn(i,3),o=new mn(a,3);s.setUsage(cu),o.setUsage(cu),e.setAttribute("position",s),e.setAttribute("color",o);const r=[];for(let x=0;x<t-1;x++){const v=x*2,w=v+1,S=v+2,E=v+3;r.push(v,w,S,w,E,S)}e.setIndex(r),e.setDrawRange(0,0);const l=new fn({vertexColors:!0,transparent:!0,opacity:1,blending:ki,depthWrite:!1,side:qe}),c=new _e(e,l);c.frustumCulled=!1,c.renderOrder=6,c.visible=!1;const h=new se(n.color);let u=[],d=null,f=0,g=0,_=!1,m=!1,p=0;function y(){const x=u.length;if(x<2||!n.enabled){c.visible=!1,e.setDrawRange(0,0);return}const v=Math.max(.001,n.life);for(let w=0;w<x;w++){const S=u[w],E=Math.max(0,1-S.age/v),A=E*E,b=Math.min(1,S.speed/Math.max(.001,n.minSpeed*2)),M=n.intensity*A*(.55+.45*b)*(1+p),P=.18+.82*E,C=w*6;i[C]=S.tx+(S.bx-S.tx)*P,i[C+1]=S.ty+(S.by-S.ty)*P,i[C+2]=S.tz+(S.bz-S.tz)*P,i[C+3]=S.tx,i[C+4]=S.ty,i[C+5]=S.tz;const F=h.r*M,N=h.g*M,L=h.b*M,I=F*.22,z=N*.22,G=L*.22;a[C]=I,a[C+1]=z,a[C+2]=G;const $=1+n.tipBoost;a[C+3]=Math.min(1,F*$),a[C+4]=Math.min(1,N*$),a[C+5]=Math.min(1,L*$)}s.needsUpdate=!0,o.needsUpdate=!0,e.setDrawRange(0,(x-1)*6),c.visible=!0}return{object:c,update(x,v,w){if(!n.enabled){c.visible=!1;return}const S=Math.max(0,x);p*=Math.exp(-Math.max(1,n.pulseDecay??14)*S),p<.001&&(p=0);for(const E of u)E.age+=S;for(;u.length>0&&u[0].age>n.life;)u.shift();if(v){const E=d?Math.hypot(v.tip.x-d.x,v.tip.y-d.y,v.tip.z-d.z)/Math.max(1e-4,S):0,A=u[u.length-1],b=A?Math.hypot(v.tip.x-A.tx,v.tip.y-A.ty,v.tip.z-A.tz):1/0;if(w&&b>=n.minStep)for(u.push({bx:v.base.x,by:v.base.y,bz:v.base.z,tx:v.tip.x,ty:v.tip.y,tz:v.tip.z,age:0,speed:E});u.length>t;)u.shift();d={x:v.tip.x,y:v.tip.y,z:v.tip.z},f=E,g=b,_=!0}else d=null,_=!1,f=0,g=0;m=w,y()},debug(){return{count:u.length,visible:c.visible,speed:f,moved:g,hasBlade:_,active:m,pulse:p}},pulse(x){!Number.isFinite(x)||x<=0||(p=Math.min(1.5,p+x))},reset(){u=[],d=null,p=0,c.visible=!1,e.setDrawRange(0,0)},dispose(){e.dispose(),l.dispose()}}}function yE(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function _E(n,t,e,i){var Be,Je;const a=Math.max(1,n.clientWidth),s=Math.max(1,n.clientHeight),o=new RS({antialias:!0});o.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),o.shadowMap.enabled=!0,o.shadowMap.type=dp,o.setSize(a,s,!1),n.appendChild(o.domElement);const r=new PS;r.background=new se("#12161d"),r.add(new hw(11061486,2764600,1.15));const l=new fw(16773852,1.5);l.position.set(9,18,11),l.castShadow=!0,l.shadow.mapSize.set(1024,1024);const c=l.shadow.camera;c.left=-20,c.right=20,c.top=20,c.bottom=-20,c.near=1,c.far=60,r.add(l);const h=[],u=new Pe;for(const V of t.boxes){const Tt=V.maxX-V.minX,Dt=V.maxY-V.minY,ie=V.maxZ-V.minZ;let ue=yE(V.kind,e);V.kind==="step"&&(ue=new se(ue).offsetHSL(0,0,V.maxY*.09).getStyle());const re=new ho({color:ue,transparent:!1,opacity:1}),ve=new _e(new li(Tt,Dt,ie),re);ve.position.set((V.minX+V.maxX)/2,(V.minY+V.maxY)/2,(V.minZ+V.maxZ)/2),ve.castShadow=V.kind!=="ground",ve.receiveShadow=!0,ve.add(new Gp(new WS(ve.geometry),new Fh({color:10467020,transparent:!0,opacity:.32}))),u.add(ve),h.push(re)}r.add(u);const d=t.gridMeta.maxX-t.gridMeta.minX,f=new mw(d,d,4873328,3358797);f.position.y=.002,f.visible=e.showGrid,r.add(f);const g=nE(i,e);r.add(g.group);const _=V=>xm((V==null?void 0:V.voxel)??e.voxel,V!=null&&V.colors?{...e.colors,...V.colors}:e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links,e.weaponWrist,e.balance);let m="standard",p=_((Be=e.bodyTypes)==null?void 0:Be[m]);const y=vE(e.weaponTrail);Af(y.object,Ve.trail),r.add(y.object);const x=new Pe,v=.9,w=new Pe;w.position.y=v,p.group.position.y=-v,w.add(p.group),x.add(w),r.add(x);const S=xE();let E=0;const A=((Je=t.config.dummies.fighters)==null?void 0:Je.moveSpeed)??t.config.dummies.moveSpeed,b=t.dummies.map((V,Tt)=>{const Dt=e.dummies.colors,ie=Dt[Tt%Dt.length]??"#cccccc";let ue;if(V.weapon){const re=e.dummies.fighterColors,ve=re&&re.length>0?re[(Tt-t.config.dummies.count)%re.length]:void 0;ue=eE({voxel:e.voxel,colors:ve?{...e.colors,...ve}:e.colors,moveSpeed:A,orientation:e.orientation,gait:e.gait,mount:e.weaponMount,lean:e.lean,hurt:e.hurt,animation:e.animation,ik:e.ik,links:e.links,wrist:e.weaponWrist,balance:e.balance})}else{const re=kw(e.voxel,e.colors,ie,V.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);ue={group:re.group,update:(ve,Fe)=>re.update(ve,Fe),boneAtWorld:(ve,Fe,$e)=>re.boneAtWorld(ve,Fe,$e),dispose:()=>re.dispose()}}return ue.group.traverse(re=>{re.userData.dummyId=V.id}),r.add(ue.group),ue}),M=b.map(V=>V.group),P=new pw,C=e.groundRing,F=e.voxel.bodyWidth,N=Pf(F,C.playerRadiusFactor),L=Pf(F,C.dummyRadiusFactor),I=F*C.thicknessFactor,z=C.arcDeg*Math.PI/180;let G=0;const $=(V,Tt,Dt)=>U0(t.boxes,V,Tt,Dt+.55,0),et=al({radius:N,thickness:I,arcRad:z,edgeFade:C.edgeFade,color:C.playerColor,opacity:C.playerOpacity,y:.028,renderOrder:Ve.ring});et.mesh.name="player-ground-ring",r.add(et.mesh);const ft=t.dummies.map(V=>{const Tt=al({radius:L,thickness:I,arcRad:z,edgeFade:C.edgeFade,color:C.neutralColor,opacity:C.opacity,y:.022,renderOrder:Ve.ring});return Tt.mesh.name=`dummy-ground-ring-${V.id}`,r.add(Tt.mesh),Tt}),vt=t.dummies.map(V=>{const Tt=al({radius:L*C.haloRadiusFactor,thickness:I*C.haloThicknessFactor,arcRad:z,edgeFade:C.edgeFade,color:C.neutralColor,opacity:0,profile:"glow",y:.019,renderOrder:Ve.ringHalo});return Tt.mesh.name=`dummy-ground-halo-${V.id}`,r.add(Tt.mesh),Tt}),It=t.dummies.map(()=>0),Y=t.dummies.map(()=>0),Q=Cf({radius:N*C.meterRadiusFactor,thickness:I*C.meterThicknessFactor,arcRad:z,edgeFade:.06,color:C.meterColorCharge,y:.03,renderOrder:Ve.ringMeter});Q.mesh.name="player-ground-meter",r.add(Q.mesh);const pt=t.dummies.map(V=>{const Tt=Cf({radius:L*C.warnRadiusFactor,thickness:I*C.warnThicknessFactor,arcRad:z,edgeFade:.02,color:C.warnColor,y:.031,renderOrder:Ve.ringWarn});return Tt.mesh.name=`dummy-ground-warn-${V.id}`,r.add(Tt.mesh),Tt}),at=Lf({color:C.playerColor,y:.042,renderOrder:Ve.groundArea});at.group.name="player-landing-preview",r.add(at.group);const K=new se,Z=new se(C.playerColor),_t=new se(C.neutralColor),Ft=new se(C.lowThreatColor),ht=new se(C.highThreatColor),Pt=new se(C.meterColorCharge),B=new se(C.meterColorChannel),ne=new se(C.meterColorCooldown),Ot=new se(C.warnColor),Ct=new Pe;r.add(Ct);const xt=e.projectiles;function Nt(){const Tt=document.createElement("canvas");Tt.width=64,Tt.height=64;const Dt=Tt.getContext("2d");if(Dt){const ue=Dt.createRadialGradient(32,32,0,32,32,32);ue.addColorStop(0,"rgba(255,255,255,1)"),ue.addColorStop(.28,"rgba(255,255,255,0.72)"),ue.addColorStop(.62,"rgba(255,255,255,0.22)"),ue.addColorStop(1,"rgba(255,255,255,0)"),Dt.fillStyle=ue,Dt.fillRect(0,0,64,64)}const ie=new rh(Tt);return ie.colorSpace=Rn,ie}function Bt(){const Dt=document.createElement("canvas");Dt.width=2,Dt.height=64;const ie=Dt.getContext("2d");if(ie){const re=ie.createLinearGradient(0,0,0,64);re.addColorStop(0,"rgba(255,255,255,0)"),re.addColorStop(.55,"rgba(255,255,255,0.35)"),re.addColorStop(1,"rgba(255,255,255,0.95)"),ie.fillStyle=re,ie.fillRect(0,0,2,64)}const ue=new rh(Dt);return ue.colorSpace=Rn,ue}const k=Nt(),T=Bt(),j=new fn({color:12577023,transparent:!0,opacity:0,side:qe,depthWrite:!1}),ut=new fn({color:14217983,transparent:!0,opacity:0,side:qe,depthWrite:!1,blending:ki}),J=new Pe;J.position.set(0,.95,.72),Ct.add(J);const ct=new Pe;ct.rotation.x=pE(e.camera.pitchDeg),J.add(ct);const zt=new Yr(.78,xt.slashThickness,6,28,Math.PI*1.15),St=new Pe,Mt=new _e(zt,j),dt=new _e(zt,ut);dt.scale.setScalar(1.09),Af(St,Ve.slash),dt.renderOrder=Ve.slash+1,St.add(Mt,dt),ct.add(St);const st=new li(xt.arrowWidth,xt.arrowWidth,xt.arrowLength),wt=new Oh(xt.arrowHeadSize*.42,xt.arrowHeadSize,4);wt.rotateX(Math.PI/2);const O=new li(xt.arrowWidth*2.6,xt.arrowWidth*.4,.1),ot=new oo(xt.arrowWidth*.45,xt.arrowWidth*1.3,xt.trailLength,6,1,!0);ot.rotateX(-Math.PI/2),ot.translate(0,0,-xt.trailLength/2);const rt=Array.from({length:10},()=>{const V=new Pe,Tt=new fn({color:xt.arrowColor,transparent:!0}),Dt=new fn({color:xt.arrowHeadColor,transparent:!0}),ie=new oh({map:k,color:xt.arrowColor,transparent:!0,opacity:.85,blending:ki,depthWrite:!1}),ue=new fn({color:xt.arrowTrailColor,map:T,transparent:!0,opacity:0,blending:ki,depthWrite:!1,side:qe}),re=new _e(st,Tt),ve=new _e(wt,Dt);ve.position.z=xt.arrowLength/2+xt.arrowHeadSize*.42;const Fe=new _e(O,Dt),$e=new _e(O,Dt);Fe.position.z=-xt.arrowLength/2+.08,$e.position.z=Fe.position.z,$e.rotation.z=Math.PI/2;const De=new of(ie);De.scale.setScalar(xt.arrowGlowSize),De.renderOrder=Ve.projectileGlow;const Ge=new _e(ot,ue);return Ge.renderOrder=Ve.projectileTrail,re.renderOrder=Ve.projectile,ve.renderOrder=Ve.projectile,Fe.renderOrder=Ve.projectile,$e.renderOrder=Ve.projectile,V.add(re,ve,Fe,$e,De,Ge),V.visible=!1,r.add(V),{group:V,shaftMat:Tt,tipMat:Dt,glowMat:ie,trailMat:ue,glow:De,trail:Ge,arrowId:0,bone:null}}),Vt=new Hh(1,0),Ht=new H(xt.boltShapeX,xt.boltShapeY,xt.boltShapeZ),qt=new fn({color:xt.boltColor,transparent:!0,opacity:.98,depthWrite:!1}),U=new oh({map:k,color:xt.boltGlowColor,transparent:!0,opacity:.45,blending:ki,depthWrite:!1}),bt=new fn({color:xt.boltGlowColor,map:T,transparent:!0,opacity:xt.trailOpacity,blending:ki,depthWrite:!1,side:qe}),tt=new oo(.5,.03,xt.boltTrailScale,6,1,!0);tt.rotateX(-Math.PI/2),tt.translate(0,0,-xt.boltTrailScale/2);const mt=Array.from({length:24},()=>{const V=new Pe,Tt=new _e(Vt,qt);Tt.scale.copy(Ht);const Dt=new of(U);Dt.scale.setScalar(xt.boltGlowScale),Dt.renderOrder=Ve.projectileGlow;const ie=new _e(tt,bt);return ie.renderOrder=Ve.projectileTrail,Tt.renderOrder=Ve.projectile,V.add(Tt,Dt,ie),V.visible=!1,r.add(V),{group:V,core:Tt}}),kt=Array.from({length:6},()=>{const V=Lf({color:"#9ad0ff",edgeWidthRatio:.038,y:.045,renderOrder:Ve.groundArea});return V.group.visible=!1,r.add(V.group),V}),Lt=iE(r,e,t,$),Gt=xw(e.camera,e.smartCamera,e.zoom,a/s),ce=t.character.position;Gt.update(ce.x,ce.y,ce.z,1,t.camera);function ge(V,Tt){if(M.length===0)return 0;const Dt=o.domElement.getBoundingClientRect(),ie=new Yt((V-Dt.left)/Dt.width*2-1,-((Tt-Dt.top)/Dt.height)*2+1);P.setFromCamera(ie,Gt.camera);const ue=P.intersectObjects(M,!0);for(const re of ue){const ve=re.object.userData.dummyId;if(ve&&ve>0)return ve}return 0}function te(V,Tt,Dt){const ie=o.domElement.getBoundingClientRect(),ue=new H(V,Tt,Dt).project(Gt.camera);return{x:ie.left+(ue.x*.5+.5)*ie.width,y:ie.top+(-ue.y*.5+.5)*ie.height}}let we=!1;return{balanceDebug(){return p.balanceDebug()},spineDebug(){return p.spineDebug()},gaitDebug(){return p.gaitDebug()},trailDebug(){return y.debug()},stretchDebug(){const V=p.stretch();return{arm:V.arm,leg:V.leg,torso:V.torso,impact:V.impact}},swingDebug(){return p.swingDebug()},stanceDebug(){return p.stanceDebug()},bladeWorld(){return p.weaponBlade()},bladesWorld(){return p.bladesWorld()},slamDebug(){return Lt.slamDebug()},yawDebug(){var V;return{target:E,shown:S.value,tauMs:((V=e.renderInterp)==null?void 0:V.yawSmoothMs)??0}},fxDebug(){var V,Tt;return{boxOpaque:h.every(Dt=>!Dt.transparent),boxCount:h.length,orders:{ring:et.mesh.renderOrder,groundFx:Lt.groundOrder(),trail:y.object.renderOrder,slash:St.renderOrder,projectile:((Tt=(V=rt[0])==null?void 0:V.group.children[0])==null?void 0:Tt.renderOrder)??-1}}},renderPose(){return{x:x.position.x,y:x.position.y,z:x.position.z,bodyYaw:x.rotation.y}},projectPoint(V,Tt,Dt){return te(V,Tt,Dt)},setClipT(V){p.setClipT(V)},weaponDebug(){return p.weaponDebug()},gripDebug(){return p.gripDebug()},render(V,Tt){var Jt;const Dt=V.character,ie=V.combat,ue=e.hitstop.enabled&&V.combat.hitstop>0,re=Tt*Math.max(0,Math.min(4,ie.warp??1));if(ue&&!we){const Rt=Math.max(0,V.combat.hitstop),lt=Math.max(0,Math.min(1,Rt/.1));Gt.addShake(.34+lt*.48);let Et=null;for(let jt=0;jt<V.events.length;jt++){const oe=V.events[jt];if(oe.type==="hit"){Et=oe;break}}Et&&Gt.addKick(Et.x-Dt.position.x,Et.z-Dt.position.z,.03+lt*.05)}we=ue;for(let Rt=0;Rt<V.events.length;Rt++){const lt=V.events[Rt];if(lt.type!=="notify")continue;const Et=Number.isFinite(lt.value)?lt.value:0;if(lt.name==="blade-air"){const jt=Math.max(0,Math.min(1,Et));y.pulse((ie.weapon==="greatsword"?.9:.55)*(.4+.6*jt))}}x.position.set(Dt.position.x,Dt.position.y,Dt.position.z),E=Dt.bodyYaw,x.rotation.y=S.update(E,Tt,((Jt=e.renderInterp)==null?void 0:Jt.yawSmoothMs)??0);const ve=V.dash.phase==="active"&&V.dash.kind==="roll",Fe=ve&&V.dash.duration>0?Math.min(1,1-V.dash.timer/V.dash.duration):0;if(w.rotation.x=ve?Fe*Math.PI*2:0,w.position.y=v-(ve?.2*Math.sin(Math.PI*Fe):0),re>0&&p.update(Dt,ie,V.playerHurt,re,V.abilities.channeling,V.time,V.playerLink,V.turnInPlace),y.update(re,re>0?p.weaponBlade():null,re>0&&(ie.phase==="active"||V.playerLink.phase==="active"||ve&&V.dash.duration>0)),re>0)for(let Rt=0;Rt<b.length;Rt++)V.dummies[Rt]&&b[Rt].update(V.dummies[Rt],re,V.time);const $e=Gt.camera.position,De=Math.atan2($e.x-Dt.position.x,$e.z-Dt.position.z),Ge=V.config.gaze.hurtHoldSec,Vn=V.time-V.playerHurt.lastAt,jn=Ge>0&&Vn>=0&&Vn<Ge?1-Vn/Ge:0,R=oE(V.gaze.active,V.gaze.threat,jn,V.time,C);rE(K,Z,Ft,ht,R.level),G=fE(Dt.grounded,Dt.position.y,G),et.mesh.position.set(Dt.position.x,G+.028,Dt.position.z),et.update(R.arcRad,R.opacity,R.scale,K,De);const X=V.config.abilities.arcane,nt=Math.max(1,Math.floor(X.waves)),it=Math.max(1e-4,X.waveInterval),W=hE({charging:ie.charging,charge:ie.charge,channeling:V.abilities.channeling,fireTimer:V.abilities.fireTimer,fireInterval:it,channelProgress:V.abilities.channeling?(V.abilities.waveIndex+(1-Math.min(1,Math.max(0,V.abilities.fireTimer/it))))/nt:0,arcaneCooldown:V.abilities.cooldown,arcaneCooldownMax:X.cooldown,dashCooldown:V.dash.cooldown,dashCooldownMax:V.dash.kind==="blink"?V.config.dash.blinkCooldown:V.config.dash.rollCooldown});Q.mesh.position.set(Dt.position.x,Dt.position.y+.03,Dt.position.z),Q.set(W.ratio,W.source==="none"?0:C.meterOpacity,W.source==="charge"?Pt:W.source==="channel"?B:ne,De);const At=V.playerLink,Ut=At.weapon?V.config.links.moves[At.weapon]:void 0,Wt=dE(At.phase,Dt.position.x,Dt.position.z,At.facing,At.travel,(Ut==null?void 0:Ut.hit.radius)??.9);at.set(Wt.x,Wt.z,$(Wt.x,Wt.z,Dt.position.y)+.042,Wt.radius,Wt.active?C.landingOpacity:0,V.time);for(let Rt=0;Rt<ft.length;Rt++){const lt=V.dummies[Rt],Et=ft[Rt],jt=vt[Rt],oe=pt[Rt];if(!lt){Et.mesh.visible=!1,jt.mesh.visible=!1,oe.mesh.visible=!1;continue}const ze=V.targeting.hasTarget&&V.targeting.targetId===lt.id;if(Og(V,lt)){const hn=Bg(V,lt);K.copy(Ft).lerp(ht,hn)}else K.copy(_t);const le=lE(lt.attackPhase,lt.attackPhaseTimer,V.config.dummies.attackWindup);le.active?(K.lerp(Ot,.5*le.urgency),oe.mesh.position.set(lt.position.x,lt.position.y+.031,lt.position.z),oe.set(le.ratio,C.warnOpacity*(.65+.35*le.urgency),Ot,De)):oe.set(0,0,Ot,De);const $t=ze?1:0,ln=$t>It[Rt]?C.haloFadeInSec:C.haloFadeOutSec;It[Rt]=Df(It[Rt],$t,Tt,ln);const he=It[Rt],Qe=1+.02*he*Math.sin(V.time*2.2+lt.id),bn=C.arcDeg+(C.selectedArcDeg-C.arcDeg)*he;Et.mesh.position.set(lt.position.x,lt.position.y+.022,lt.position.z),Et.update(bn*Math.PI/180,C.opacity+(C.selectedOpacity-C.opacity)*he,1+(C.selectedScale-1)*he*Qe,K,De,1+(C.selectedThicknessScale-1)*he),Y[Rt]=Df(Y[Rt],$t,Tt,$t>Y[Rt]?C.haloFadeInSec:C.haloFadeOutSec);const ke=Y[Rt];jt.mesh.position.set(lt.position.x,lt.position.y+.019,lt.position.z),jt.update(bn*Math.PI/180,C.haloOpacity*ke*(.88+.12*Math.sin(V.time*2.2+lt.id)),C.selectedScale*(.94+.06*ke)*Qe,K,De)}Ct.position.set(Dt.position.x,Dt.position.y,Dt.position.z),Ct.rotation.y=ie.phase!=="idle"?ie.attackFacing:Dt.bodyYaw,Lt.update(V,Tt,Rt=>Gt.addShake(Rt));const Zt=xt.slashEnabled&&ie.phase==="active"&&ie.comboIndex>=3;j.opacity=Zt?.7:0,ut.opacity=Zt?xt.slashGlowOpacity:0,Zt&&(St.rotation.z=-1.2+ie.attackProgress*3.2,St.scale.setScalar(.9+ie.comboIndex*.13));for(let Rt=0;Rt<mt.length;Rt++){const lt=V.abilities.projectiles[Rt],Et=mt[Rt];Et.group.visible=!!lt,lt&&(Et.group.position.set(lt.x,lt.y,lt.z),Et.group.scale.setScalar(lt.radius),Et.group.rotation.set(0,Math.atan2(lt.dirX,lt.dirZ),0))}for(let Rt=0;Rt<kt.length;Rt++){const lt=V.abilities.rings[Rt],Et=kt[Rt];if(!lt){Et.group.visible=!1;continue}const jt=Math.max(0,Math.min(1,lt.life/Math.max(lt.duration,1e-6))),oe=uE(Math.max(0,lt.duration-lt.life),C.areaExpandSec);Et.set(lt.x,lt.z,$(lt.x,lt.z,Dt.position.y)+.045,lt.radius*oe.scale,C.areaOpacity*(.35+.65*jt)*oe.alpha,V.time)}for(let Rt=0;Rt<rt.length;Rt++){const lt=V.arrows[Rt],Et=rt[Rt];if(!lt){Et.group.visible=!1,Et.bone&&(r.attach(Et.group),Et.bone=null),Et.arrowId=0;continue}const jt=lt.stuck&&lt.stuckDummy>=0;if(Et.arrowId!==lt.id){if(Et.bone&&(r.attach(Et.group),Et.bone=null),Et.arrowId=lt.id,Et.group.position.set(lt.x,lt.y,lt.z),Et.group.rotation.set(lt.pitch,lt.yaw,0,"YXZ"),jt){const ze=b[lt.stuckDummy],le=ze?ze.boneAtWorld(lt.x,lt.y,lt.z):null;le&&(le.node.attach(Et.group),Et.bone=le.node)}}else Et.bone||(Et.group.position.set(lt.x,lt.y,lt.z),Et.group.rotation.set(lt.pitch,lt.yaw,0,"YXZ"));Et.group.visible=!0;const oe=lt.stuck?Math.min(1,lt.rest/.6):1;Et.shaftMat.opacity=oe,Et.tipMat.opacity=oe,Et.glowMat.opacity=(lt.stuck?.28:.85)*oe,Et.trailMat.opacity=lt.stuck?0:xt.trailOpacity*oe,Et.trail.visible=!lt.stuck}Gt.update(Dt.position.x,Dt.position.y,Dt.position.z,Tt,V.camera),o.render(r,Gt.camera)},resize(){const V=Math.max(1,n.clientWidth),Tt=Math.max(1,n.clientHeight);o.setSize(V,Tt,!1),Gt.resize(V/Tt)},getGroundBasis(){return Gt.getGroundBasis()},setCollidersVisible(V){for(const Tt of h)Tt.opacity=V?.3:1,Tt.wireframe=V,Tt.transparent=V,Tt.depthWrite=!V,Tt.needsUpdate=!0},setGridVisible(V){f.visible=V},setLabVisible(V){g.setVisible(V)},setLabLabelsVisible(V){g.setLabelsVisible(V)},snapCamera(V,Tt,Dt){Gt.snap(V,Tt,Dt)},setZoom(V){Gt.setZoom(V)},setBodyType(V){var Dt;const Tt=(Dt=e.bodyTypes)==null?void 0:Dt[V];return!Tt||V===m||(w.remove(p.group),p.dispose(),p=_(Tt),p.group.position.y=-v,w.add(p.group),y.reset(),m=V,t.config.characterHeight=Tt.height,Tt.radius!==void 0&&(t.config.characterRadius=Tt.radius)),m},bodyTypes(){return{id:m,ids:Object.keys(e.bodyTypes??{})}},pickDummy:ge,projectToScreen:te,dummyRigDebug(V){const Tt=b[V-1];return Tt!=null&&Tt.debug?Tt.debug():null},diagnostics(){const V=_m(e.camera.pitchDeg),Tt=mE(V,Ct.rotation.y);return{lean:p.lean(),slashNormal:Tt,arrowForward:p.arrowDirection(),gait:{hipYaw:p.hipYaw(),gaitYaw:p.gaitYaw()},attackBlend:p.attackBlend(),attackWeights:p.attackWeights(),landing:p.landing(),hurt:p.hurt(),ik:p.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:w.rotation.x,activeRings:Lt.activeDash(),lastKind:Lt.dashKind()},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...Gt.smart(),shake:Gt.shakeLevel(),kick:Gt.kickLevel(),kickCount:Gt.kickCount()}}},dispose(){p.dispose(),g.dispose();for(const V of b)V.dispose();et.dispose();for(const V of ft)V.dispose();for(const V of vt)V.dispose();Q.dispose(),y.dispose();for(const V of pt)V.dispose();at.dispose(),zt.dispose(),j.dispose(),ut.dispose(),Vt.dispose(),qt.dispose(),U.dispose(),bt.dispose(),tt.dispose();for(const V of kt)V.dispose();st.dispose(),wt.dispose(),O.dispose(),ot.dispose();for(const V of rt)V.shaftMat.dispose(),V.tipMat.dispose(),V.glowMat.dispose(),V.trailMat.dispose();k.dispose(),T.dispose(),Lt.dispose(),u.traverse(V=>{V instanceof _e&&V.geometry.dispose()}),o.dispose(),o.domElement.remove()}}}async function ME(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function bE(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),a=document.createElement("a");a.href=i,a.download=n,a.rel="noopener",document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function SE(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=y=>e.querySelector(`#${y}`),a=i("diag-status"),s=i("diag-text"),o=i("diag-copy"),r=i("diag-json"),l=i("diag-clear"),c=i("diag-toggle"),h=i("diag-close"),u=i("diag-mask");let d=!1,f=!0,g=0;function _(){const y=n.status();a.textContent=y.enabled?`已记录 ${y.durationS.toFixed(1)}s · ${y.frames} 帧 · 事件 ${y.events} · 异常 ${y.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",c.textContent=y.enabled?"暂停记录":"继续记录"}function m(y){d=y,e.hidden=!y,y?_():s.hidden=!0}function p(y){o.textContent=y,window.clearTimeout(g),g=window.setTimeout(()=>{o.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation(),m(!d)}),h.addEventListener("click",()=>m(!1)),u.addEventListener("click",()=>m(!1)),o.addEventListener("click",()=>{const y=n.summary();ME(y).then(x=>{x?(p("已复制 ✓"),s.hidden=!0):(s.value=y,s.hidden=!1,s.focus(),s.select(),p("请长按全选复制"))})}),r.addEventListener("click",()=>{const y=n.dump(),x=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);bE(`harness-${y.meta.version}-${x}.json`,JSON.stringify(y)),p("已导出")}),l.addEventListener("click",()=>{n.clear(),s.hidden=!0,_(),p("已清空")}),c.addEventListener("click",()=>{f=!f,n.setEnabled(f),_()}),{tick(){const y=n.status();t==null||t.classList.toggle("is-alert",y.alert),d&&_()},isOpen:()=>d,close:()=>m(!1)}}const wE={intents:{...Ff},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function EE(){var K;const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=Gg(Px,Ro),i=_E(n,e,dn,Ro.stations),a=Zg(e),s=uv(t),o=fv(t),r=document.getElementById("version-badge");r&&(r.textContent="v0.9.64 · 11-09 13:14 · 诊断");const l=Z=>String(Z).padStart(2,"0"),c=new Date,h=wx({meta:{version:"v0.9.64",buildTime:"11-09 13:14",startedAt:`${l(c.getMonth()+1)}-${l(c.getDate())} ${l(c.getHours())}:${l(c.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),u=SE(h,r),d=lv({deadZone:()=>dn.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0,phaseSource:()=>i.gaitDebug().phase});document.addEventListener("visibilitychange",()=>{document.hidden&&h.suspend(800)});const f={timeScale:1,paused:!1,showColliders:dn.showColliders,showGrid:dn.showGrid,showLab:dn.lab.enabled,showLabLabels:dn.lab.showLabels};let g=1,_=!1;const m=fx({maxRadiusPx:()=>dn.joystick.maxRadiusPx,deadZone:dn.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>dn.zoom}),p=Array.from(document.querySelectorAll(".wp[data-weapon]"));let y=e.combat.weapon;function x(Z){if(Z===y)return;y=Z;const _t=na.indexOf(Z)+1;for(const Ft of p)Ft.classList.toggle("is-active",Number(Ft.dataset.weapon)===_t);E.refreshWeapon()}let v=wE,w=0;const S=()=>{g=1,i.setZoom(1)},E=Gx(e,dn,f,{singleStep:()=>a.singleStep(v.intents),reset:()=>{g=1,a.singleStep({...Ff,resetPressed:!0})},resetZoom:S,onToggleColliders:Z=>i.setCollidersVisible(Z),onToggleGrid:Z=>i.setGridVisible(Z),onToggleLab:Z=>i.setLabVisible(Z),onToggleLabLabels:Z=>i.setLabLabelsVisible(Z),setFighterMode:Z=>{for(const _t of e.dummies)_t.weapon&&(_t.mode=Z,_t.attackPhase="idle",_t.attackPhaseTimer=0,_t.attackProgress=0,_t.attackCooldown=0,_t.combat&&(_t.combat.phase="idle",_t.combat.attackProgress=0,_t.combat.comboIndex=0))}}),A=Wx({stations:Ro.stations??[],world:e,view:i,onResetZoom:S});o.register({motion:d,debug:E.gui}),window.addEventListener("resize",()=>i.resize());const b=i.bodyTypes().ids,M=document.getElementById("body-toggle"),P=Z=>{var _t,Ft;return((Ft=(_t=dn.bodyTypes)==null?void 0:_t[Z])==null?void 0:Ft.name)??Z},C=()=>{if(!M)return;const Z=i.bodyTypes().id;M.textContent=`体型 ${P(Z)}`,M.setAttribute("aria-label",`切换体型（当前：${P(Z)}，快捷键 B）`)},F=document.createElement("div");F.style.cssText=["position:fixed","left:50%","top:14px","transform:translateX(-50%)","padding:6px 14px","border-radius:999px","font:600 13px/1.4 system-ui,sans-serif","color:#0b1620","background:#8fd0ff","box-shadow:0 4px 16px rgba(0,0,0,.35)","opacity:0","transition:opacity .18s","pointer-events:none","z-index:99"].join(";"),document.body.appendChild(F);let N=0;const L=Z=>{F.textContent=Z,F.style.opacity="1",window.clearTimeout(N),N=window.setTimeout(()=>{F.style.opacity="0"},1600)},I=()=>{if(b.length<2){L("只有一个体型预设");return}const Z=i.bodyTypes().id,_t=Math.max(0,b.indexOf(Z)),Ft=i.setBodyType(b[(_t+1)%b.length]);C(),L(`体型：${P(Ft)}（B / 顶部胶囊切换）`)};C(),M==null||M.addEventListener("click",I),window.addEventListener("keydown",Z=>{Z.repeat||Z.code!=="KeyB"||I()}),window.__harness={world:e,view:i,clock:a,input:m,viewConfig:dn,debug:f,getUserZoom:()=>g,getGestures:()=>v.gestures,getLastGesture:()=>v.lastGesture,telemetry:h,telemetrySummary:()=>h.summary(),dirDebug:d.dirDebug,dirAngles:()=>d.dirDebug.last(),motionDebug:d,speedDebug:()=>d.last(),speedSamples:()=>d.samples(),gaitDebug:()=>i.gaitDebug(),dummyRigDebug:Z=>i.dummyRigDebug(Z),swingDebug:()=>i.swingDebug(),stanceDebug:()=>i.stanceDebug(),balanceDebug:()=>i.balanceDebug(),spineDebug:()=>i.spineDebug(),interpDebug:()=>({alpha:It,applied:Y,enabled:et,skip:Q}),renderPose:()=>i.renderPose(),yawDebug:()=>i.yawDebug(),slamDebug:()=>i.slamDebug(),fxDebug:()=>i.fxDebug(),setRenderInterp:Z=>(et=!!Z,et),renderHold:()=>_,trailDebug:()=>i.trailDebug(),bladeWorld:()=>i.bladeWorld(),projectPoint:(Z,_t,Ft)=>i.projectPoint(Z,_t,Ft),setBodyType:Z=>{const _t=i.setBodyType(Z);return C(),_t},bodyTypes:()=>i.bodyTypes(),bladesWorld:()=>i.bladesWorld(),clipLab:{clips:()=>{var Z;return Object.keys(((Z=dn.animation.swing)==null?void 0:Z.clips)??{})},preview:Z=>{const _t=e.combat,Ft={..._t};_t.weapon=Z.weapon,_t.phase="active",_t.comboIndex=Math.max(1,Math.min(3,Math.floor(Z.comboIndex))),_t.attackProgress=Math.max(0,Math.min(1,Z.progress)),_t.attackFacing=e.character.bodyYaw,i.setClipT(typeof Z.t=="number"?Z.t:null);const ht=Math.max(1,Math.min(30,Math.floor(Z.warm??12)));_=!0;for(let Pt=0;Pt<ht;Pt++)i.render(e,1/60);return i.setClipT(null),Object.assign(_t,Ft),{...i.swingDebug(),blade:i.bladeWorld(),blades:i.bladesWorld()}},face:Z=>{e.character.bodyYaw=Z},zoom:Z=>{g=Hd(Z,1,dn.zoom.min,dn.zoom.max),i.setZoom(g)},release:()=>{_=!1}},weaponDebug:()=>i.weaponDebug(),gripDebug:()=>i.gripDebug(),lab:{stations:Ro.stations??[],goto:Z=>A.goto(Z),current:()=>A.current(),recall:()=>A.recall()}};let z=performance.now(),G=60,$=0,et=((K=dn.renderInterp)==null?void 0:K.enabled)??!0,ft=Bd(e),vt=null,It=1,Y=!1,Q="";function pt(Z){const _t=et&&!f.paused&&f.timeScale>0;if(Y=!1,Q="",!_t)return Q="off",It=1,e;if(!vt)return Q="noprev",It=1,e;if(!qg(vt,ft))return Q="key",It=1,e;const Ft=a.alpha;return It=Ft,Ft>=.999?(Q="alpha",e):(Y=!0,Jg(e,Kg(vt,ft,Ft)))}function at(Z){const _t=Math.min((Z-z)/1e3,.1);z=Z,_t>0&&(G=G*.9+1/_t*.1);const Ft=m.sample();Ft.intents.resetPressed&&(g=1),g=Hd(g,Ft.zoomScale,dn.zoom.min,dn.zoom.max),i.setZoom(g);let ht=Ft.intents.dummyClickId;if(Ft.tap){const ne=i.pickDummy(Ft.tap.x,Ft.tap.y);ne>0&&(ht=ne)}ht>0&&(w=ht),v={...Ft,intents:{...Ft.intents,dummyClickId:w}};const Pt=a.frame(_t,v.intents,f.timeScale,f.paused,()=>{const ne=e.events;for(let Ot=0;Ot<ne.length;Ot++)h.event(ne[Ot],e.time);vt=ft,ft=Bd(e)});Pt>0&&(w=0),h.sample(e,v,_t*1e3,Pt);for(const ne of v.gestures)h.gesture(ne);Z-$>250&&($=Z,u.tick()),x(e.combat.weapon),_||i.render(pt(),_t),A.tick(),d.update(e,v,i.getGroundBasis());const B=i.diagnostics();s.update(e,G,Pt,v,f,{attackBlend:B.attackBlend,attackWeights:B.attackWeights,landing:B.landing,hurt:B.hurt,ik:B.ik,zoom:B.camera.zoom},o.hudCompact()),requestAnimationFrame(at)}requestAnimationFrame(at)}EE();

(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(s){if(s.ep)return;s.ep=!0;const a=e(s);fetch(s.href,a)}})();const Li=["sword-shield","dual-swords","greatsword","staff","bow"],Uo=["wander","follow","keep-distance","attack","idle"],Ad={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},no=1e-6;function Zs(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>no?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>no?Math.atan2(t.moveX,t.moveZ):n.character.facing}function Af(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>no){const s=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/s,z:t.aimZ/s}}const e=Math.hypot(t.moveX,t.moveZ);if(e>no)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const xn=1e-6,Cr=Math.PI/180,Fc=-1e9;function Rd(){return{type:"none",lastAt:Fc,timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function Pr(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Pl(n,t,e,i,s){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=s,n.knockX=0,n.knockZ=0}function Nc(n,t,e){const i=e.duration>0?e.duration:zc(n,e.type);if(t.kind==="player"){const a=n.playerHurt;if(Pl(a,e.type,i,e.dirX,e.dirZ),a.lastAt=n.time,!n.config.hits.noDamageToPlayer&&e.knockback>xn){const o=e.knockback*n.config.hits.knockbackDecay;a.knockX=e.dirX*o,a.knockZ=e.dirZ*o}Pr(n,"player-hurt",e.sourceId??0,n.character.position);return}const s=n.dummies[t.index];if(s){if(Pl(s.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>xn){const a=e.knockback*n.config.hits.knockbackDecay;s.hurt.knockX=e.dirX*a,s.hurt.knockZ=e.dirZ*a}n.hitCount+=1,Pr(n,"hit",s.id,s.position)}}function xo(n,t,e){Nc(n,{kind:"dummy",index:t},e)}function Rf(n,t){const e=[n.playerHurt];for(const s of n.dummies)e.push(s.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const s of e)s.timer>0&&(s.timer=Math.max(0,s.timer-t),s.timer===0&&(s.type="none",s.knockX=0,s.knockZ=0)),(s.knockX!==0||s.knockZ!==0)&&(s.knockX*=i,s.knockZ*=i,Math.abs(s.knockX)<1e-4&&(s.knockX=0),Math.abs(s.knockZ)<1e-4&&(s.knockZ=0))}function zc(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function Cf(n){const t=n.combat,e=n.config.hits,i=n.character.position;if(t.weapon==="bow")return;const s=e.reach[t.weapon]??0,a=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*Cr),o=Math.sin(t.attackFacing),r=Math.cos(t.attackFacing),l=n.config.dummies.radius,c=n.config.targeting.idealRange;for(const h of n.dummies){const f=h.position.x-i.x,d=h.position.z-i.z,u=Math.hypot(f,d);if(u>s+l)continue;const p=u>xn?f/u:o,_=u>xn?d/u:r;if(u>xn&&(f*o+d*r)/u<a)continue;let g="light";t.weapon==="greatsword"?g="knock":t.comboIndex>=3&&(g="heavy");const m=e.knockback[t.weapon]??0;let x=u;m>0&&(x=Math.max(u+m,c));const y=Math.max(0,x-u);xo(n,n.dummies.indexOf(h),{type:g,duration:zc(n,g),dirX:p,dirZ:_,knockback:y})}}function Pf(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const s=i.weapon===""?void 0:e.moves[i.weapon];if(!s||!s.enabled||!n.modules.hits||!n.modules.dummies)return;const a=s.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(a.pulseInterval,0);const o=n.character.position,r=i.fromX,l=i.fromZ,c=o.x,h=o.z,f=c-r,d=h-l,u=f*f+d*d,p=Math.sin(i.facing),_=Math.cos(i.facing),g=Math.cos(Dl(a.arcDeg,0,180)*Cr),m=n.config.dummies.radius;for(let x=0;x<n.dummies.length;x++){const y=n.dummies[x];if(i.hitIds.indexOf(y.id)>=0)continue;const v=u>xn?Dl(((y.position.x-r)*f+(y.position.z-l)*d)/u,0,1):0,P=r+f*v,S=l+d*v,w=Math.hypot(y.position.x-P,y.position.z-S);let T=!1;if(a.shape==="circle")T=w<=a.radius+m;else if(a.shape==="capsule")T=w<=Math.max(a.radius,a.width)+m;else{const z=y.position.x-c,C=y.position.z-h,D=Math.hypot(z,C),X=D>xn?(z*p+C*_)/D>=g:!0;T=D<=a.radius+m&&X||w<=a.width+m}if(!T)continue;const b=y.position.x-r,M=y.position.z-l,R=Math.hypot(b,M);if(R>xn&&(b*p+M*_)/R<Math.cos(Math.max(a.arcDeg,90)*Cr))continue;const F=R>xn?b/R:p,I=R>xn?M/R:_;Nc(n,{kind:"dummy",index:x},{type:a.type,duration:a.duration,dirX:F,dirZ:I,knockback:a.knockback}),i.hitIds.push(y.id),Pr(n,"link-hit",y.id,y.position)}}function Df(n){const t=n.config.hits,e=n.character.position;for(const i of n.events){if(i.type!=="dummy-hit")continue;const s=n.dummies[i.value-1];if(!s)continue;const a=e.x-s.position.x,o=e.z-s.position.z,r=Math.hypot(a,o);if(r>t.dummyReach)continue;const l=r>xn?a/r:0,c=r>xn?o/r:1;Nc(n,{kind:"player"},{type:"light",duration:zc(n,"light"),dirX:l,dirZ:c,knockback:t.dummyKnockback,sourceId:s.id})}}function Lf(n,t){if(!n.modules.hits)return;n.events.some(i=>i.type==="attack-active")&&Cf(n),Pf(n,t),Df(n)}function Dl(n,t,e){return n<t?t:n>e?e:n}const Cd=Math.PI/180,Oc=1e-6;function If(){return{phase:"idle",fromYaw:0,targetYaw:0,dir:1,progress:0,armTime:0}}function io(n){const t=n.turnInPlace;t.phase="idle",t.fromYaw=0,t.targetYaw=0,t.dir=1,t.progress=0,t.armTime=0}function Pd(n,t,e){return n.modules.gaze&&n.gaze.active?n.gaze.centroidYaw:t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Oc?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:null}function Dd(n,t,e){const i=n.character,s=Math.hypot(i.velocity.x,i.velocity.z),a=Math.hypot(t.moveX,t.moveZ),o=n.combat.phase!=="idle"||n.combat.charging||n.abilities.channeling||n.dash.phase!=="idle"||n.playerLink.phase!=="idle"||n.playerHurt.type!=="none"||t.attackPressed||t.attackHeld||t.skill2Pressed||t.sprintPressed||t.jumpPressed;return i.grounded&&s<=Math.max(0,e.idleSpeedRatio)*Math.max(n.config.moveSpeed,Oc)&&a<=Math.max(0,e.inputDeadZone)&&!o}function kf(n){const t=n<0?0:n>1?1:n;return t*t*(3-2*t)}function Uf(n,t){const e=n.config.turnInPlace;if(!e.enabled||!n.modules.turnInPlace||!Dd(n,t,e))return!1;const i=Pd(n,t,e.lookRange);if(i===null)return!1;const s=Re(i-n.character.bodyYaw);return Math.abs(s)>Ld(n,e)}function Ld(n,t){const i=n.modules.gaze&&n.gaze.active?Math.max(t.triggerDeg,t.gazeTriggerDeg):t.triggerDeg;return Math.max(0,i)*Cd}function Ff(n,t,e){const i=n.turnInPlace,s=n.config.turnInPlace;if(!s.enabled||!n.modules.turnInPlace||!Dd(n,e,s)){io(n);return}const a=Pd(n,e,s.lookRange);if(a===null){io(n);return}const o=n.character,r=Re(a-o.bodyYaw),l=Math.abs(r),c=Ld(n,s),h=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Oc;if(i.phase==="idle"&&(i.armTime=l>=c?i.armTime+t:0,l>c&&i.armTime>=Math.max(0,s.armSec))){i.phase="active",i.fromYaw=o.bodyYaw,i.dir=r>=0?1:-1;const f=Math.min(l,Math.max(0,s.settleDeg)*Cd);i.targetYaw=Re(o.bodyYaw+i.dir*(l-f)),i.progress=0}if(i.phase==="active"){const f=Math.max(s.durationSec,n.config.fixedDt);i.progress=Math.min(1,i.progress+t/f);const d=Re(i.targetYaw-i.fromYaw);o.bodyYaw=Re(i.fromYaw+d*kf(i.progress)),h||(o.facing=o.bodyYaw),i.progress>=1&&(i.phase="idle",i.progress=0,i.armTime=0)}}const oi=1e-6;function Re(n){return Math.atan2(Math.sin(n),Math.cos(n))}function la(n,t,e,i){const s=Re(t-n);return n+s*(1-Math.exp(-Math.max(e,oi)*i))}function ha(n,t,e,i,s){const o=Re(t-n)*(1-Math.exp(-Math.max(e,oi)*s)),r=Math.max(i,0)*s;return r<=oi?n:n+rs(o,-r,r)}function Ll(n,t,e,i,s){const a=(t-n)*(1-Math.exp(-Math.max(e,oi)*s)),o=Math.max(i,0)*s;return o<=oi?n+a:n+rs(a,-o,o)}function rs(n,t,e){return n<t?t:n>e?e:n}function Il(n,t,e,i){const s=Re(t-n),a=Math.abs(s);return a<=i||a<=e?t:Re(n+Math.sign(s)*Math.max(e,0))}function Nf(n,t,e){const i=n.character,s=n.config.orientation,a=n.combat,o=n.modules.gaze&&n.gaze.active,r=n.abilities.channeling,l=a.phase!=="idle"||a.charging||r||n.dash.phase!=="idle",c=o&&!l,h=Math.hypot(e.moveX,e.moveZ),f=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>oi,d=a.charging&&a.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(a.phase!=="idle")i.facing=a.attackFacing;else if(r)i.facing=Zs(n,e);else if(c)i.facing=ha(i.facing,n.gaze.centroidYaw,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t);else if(f)i.facing=Zs(n,e);else if(d)i.facing=n.targeting.targetYaw;else if(h>Math.max(s.facingDeadZone,oi)){const M=Math.atan2(e.moveX,e.moveZ),R=s.facingTurnRate*Math.PI/180*t,F=s.facingSnapDeg*Math.PI/180;if(h>=.35)i.facing=Il(i.facing,M,R,F);else if(h>=s.facingMinMagnitude&&Math.abs(Re(M-i.facing))>s.facingDeadbandDeg*Math.PI/180){const z=la(i.facing,M,s.facingSmoothRate,t);i.facing=Il(i.facing,z,R,0)}}const u=i.velocity;Math.hypot(u.x,u.z)>.15&&(i.moveYaw=Math.atan2(u.x,u.z));const p=c?n.gaze.centroidYaw:i.facing;n.turnInPlace.phase==="active"||Uf(n,e)||(c?i.bodyYaw=ha(i.bodyYaw,p,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t):i.bodyYaw=la(i.bodyYaw,p,s.bodyTurnRate,t));const g=n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;let m=i.facing;if(o?m=c?n.gaze.mainYaw:i.facing:f?m=Math.atan2(e.aimX,e.aimZ):g&&(m=n.targeting.targetYaw),!o){const M=n.config.gaze.headLookLimitDeg*Math.PI/180;Math.abs(Re(m-i.bodyYaw))>M&&(m=i.moveYaw)}const x=o||f||g,y=s.maxHeadTurnDeg*Math.PI/180;let v;if(x){const M=c?n.config.gaze.headTurnRate:s.headTurnRate;v=c?ha(i.headYaw,m,M,n.config.gaze.maxHeadSpeedDeg*Math.PI/180,t):la(i.headYaw,m,M,t)}else{const M=Re(i.headYaw-i.bodyYaw),R=Re(m-i.bodyYaw),F=Math.abs(R)<Math.abs(M)-1e-9,I=F?n.config.gaze.headReturnRate:s.headTurnRate,z=F?n.config.gaze.headReturnSpeedDeg*Math.PI/180:Number.POSITIVE_INFINITY,C=Number.isFinite(z)?ha(M,R,I,z,t):la(M,R,I,t);v=i.bodyYaw+C}const P=Re(v-i.bodyYaw);P>y?v=i.bodyYaw+y:P<-y&&(v=i.bodyYaw-y),i.headYaw=v;const S=n.config.gaze;let w=0;if(c)w=n.gaze.mainPitch;else if(n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget){const M=n.dummies[n.targeting.targetId-1];if(M){const R=i.position.y+n.config.characterHeight*rs(S.eyeHeightRatio,0,1),F=M.position.y+n.config.dummies.height*rs(S.aimHeightRatio,0,1),I=Math.hypot(M.position.x-i.position.x,M.position.z-i.position.z);w=Math.atan2(F-R,Math.max(oi,I))}}const T=Math.max(0,S.maxHeadPitchDeg)*Math.PI/180;w=rs(w,-T,T);const b=x?S.headPitchRate:Math.min(S.headPitchRate,S.headReturnRate);i.headPitch=Ll(i.headPitch,w,b,Math.max(0,S.maxHeadPitchDeg)*4*Math.PI/180,t),i.bodyPitch=Ll(i.bodyPitch,i.headPitch*rs(S.bodyPitchScale,0,1),S.bodyPitchRate,Math.max(0,S.maxHeadPitchDeg)*Math.PI/180,t)}const Id=1e-6,vo=Math.PI/180;function _o(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function zf(n,t,e){const i=n.character.position,s=Math.max(0,e.homingConeDeg)*vo,a=Math.max(0,e.homingRange),o=[];for(let r=0;r<n.dummies.length;r++){const l=n.dummies[r],c=l.position.x-i.x,h=l.position.z-i.z,f=Math.hypot(c,h);f<.001||f>a||Math.abs(Re(Math.atan2(c,h)-t))>s||o.push({i:r,d:f})}return o.sort((r,l)=>r.d-l.d||r.i-l.i),o.map(r=>r.i)}function Of(n,t){const e=Math.sin((n+1)*12.9898+(t+1)*78.233)*43758.5453;return e-Math.floor(e)}function Bf(n,t){const e=n.abilities,i=n.character.position,s=Math.max(1,Math.floor(t.perWave)),a=t.spreadDeg*vo,o=Math.max(0,t.spawnSideStep),r=Math.max(0,Math.min(1,t.speedJitter)),l=zf(n,e.channelYaw,t);for(let c=0;c<s;c++){const h=(c-(s-1)*.5)*a,f=e.channelYaw+h,d=(c-(s-1)*.5)*o,u=Math.sin(f),p=Math.cos(f);e.pending.push({delay:c*Math.max(0,t.spawnDelay),x:i.x+u*.5+Math.cos(f)*d,y:i.y+1,z:i.z+p*.5-Math.sin(f)*d,yaw:f,speed:t.speed*(1+(Of(e.waveIndex,c)*2-1)*r),targetIndex:l.length>0?l[c%l.length]:-1,wave:e.waveIndex})}_o(n,"arcane-wave",e.waveIndex,{x:i.x,y:i.y+1,z:i.z})}function Hf(n,t,e){const i=n.abilities;if(i.pending.length===0)return;const s=[];for(const a of i.pending){if(a.delay-=t,a.delay>0){s.push(a);continue}const o={id:++i.nextId,x:a.x,y:a.y,z:a.z,dirX:Math.sin(a.yaw),dirZ:Math.cos(a.yaw),speed:a.speed,life:e.life,radius:e.radius,targetIndex:a.targetIndex,turnRate:Math.max(0,e.turnRateDeg)*vo,homing:Math.max(0,e.homingTime),spread:Math.max(0,e.spreadTime),retarget:0,wave:a.wave};i.projectiles.push(o),i.volleyId+=1,_o(n,"projectile-fire",i.volleyId,o)}i.pending=s}function kl(n,t){const e=n.abilities;e.channeling&&(e.channeling=!1,e.fireTimer=0,e.cooldown=Math.max(0,t.cooldown),e.channelMoveScale=1,e.needsRelease=!0,_o(n,"channel-end",0,n.character.position))}function Gf(n,t,e,i,s,a){const o=n.abilities,r=n.dash.phase==="active",l=n.playerLink,c=a==="skill2"?e.skill2Pressed:e.attackHeld,h=s&&c&&!r&&l.phase==="idle"&&!l.consumedAttack;if(o.cooldown>0&&(o.cooldown=Math.max(0,o.cooldown-t)),o.needsRelease&&!h&&(o.needsRelease=!1),o.channeling){if(!h){kl(n,i);return}}else{if(!(h&&!o.needsRelease&&o.cooldown<=0))return;o.channeling=!0,o.channelId+=1,o.waveIndex=0,o.fireTimer=0,o.channelMoveScale=Math.max(0,Math.min(1,i.moveScale)),_o(n,"channel-start",o.channelId,n.character.position)}o.channelYaw=Zs(n,e),o.fireTimer-=t;let f=0;for(;o.fireTimer<=0&&f++<8;)if(o.fireTimer+=Math.max(i.waveInterval,Id),Bf(n,i),o.waveIndex+=1,o.waveIndex>=Math.max(1,Math.floor(i.waves))){kl(n,i);break}}function Vf(n,t,e){const i=Math.max(0,e.homingConeDeg)*vo,s=Math.max(0,e.homingRange),a=Math.atan2(t.dirX,t.dirZ);let o=-1,r=s+Id;for(let l=0;l<n.dummies.length;l++){const c=n.dummies[l],h=c.position.x-t.x,f=c.position.z-t.z,d=Math.hypot(h,f);d<.001||d>r||Math.abs(Re(Math.atan2(h,f)-a))>i||(o=l,r=d)}return o}function Xf(n,t,e){const i=n.abilities,s=n.config.dummies.radius,a=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.projectiles){if(r.spread>0)r.spread=Math.max(0,r.spread-t);else if(r.homing>0&&(r.homing=Math.max(0,r.homing-t)),r.retarget-=t,r.retarget<=0&&(r.retarget=Math.max(.05,e.retargetInterval),r.targetIndex=Vf(n,r,e)),r.targetIndex>=0&&r.turnRate>0&&r.homing>0){const c=n.dummies[r.targetIndex];if(!c)r.targetIndex=-1;else{const h=Math.atan2(c.position.x-r.x,c.position.z-r.z),f=Math.atan2(r.dirX,r.dirZ),d=Re(h-f),u=r.turnRate*t,p=Math.max(-u,Math.min(u,d)),_=f+p;r.dirX=Math.sin(_),r.dirZ=Math.cos(_)}}if(r.x+=r.dirX*r.speed*t,r.z+=r.dirZ*r.speed*t,r.life-=t,r.life<=0)continue;let l=!1;if(a)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],f=h.position.x-r.x,d=h.position.z-r.z,u=r.radius+s;if(!(f*f+d*d>u*u)){xo(n,c,{type:e.hurtType,duration:e.hurtDuration,dirX:r.dirX,dirZ:r.dirZ,knockback:e.knockback}),l=!0;break}}l||o.push(r)}i.projectiles=o}const Wf={kind:"channelVolley",update({world:n,dt:t,intents:e,skill:i,onWeapon:s}){const a=i.params;Gf(n,t,e,a,s,i.cfg.slot),Hf(n,t,a),Xf(n,t,a)}},Fo=1e-6;function kd(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function $f(n,t){const e=n.character.position,i={id:++n.abilities.nextId,x:e.x,z:e.z,radius:t.radius,life:t.duration,duration:t.duration,pulseTimer:0};n.abilities.rings.push(i),kd(n,"ring-place",i.id,e)}function Yf(n,t,e){const i=n.abilities,s=n.config.dummies.radius,a=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.rings){r.life-=t,r.pulseTimer-=t;let l=0;for(;r.pulseTimer<=0&&l++<8;){if(r.pulseTimer+=Math.max(e.pulseInterval,Fo),a)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],f=h.position.x-r.x,d=h.position.z-r.z,u=r.radius+s;if(f*f+d*d>u*u)continue;const p=Math.hypot(f,d),_=p>Fo?f/p:0,g=p>Fo?d/p:1;xo(n,c,{type:"heavy",duration:e.stun,dirX:_,dirZ:g,knockback:e.knockback})}kd(n,"ring-pulse",r.id,{x:r.x,y:0,z:r.z})}r.life>0&&o.push(r)}i.rings=o}const Zf={kind:"groundRing",update({world:n,dt:t,intents:e,skill:i,onWeapon:s}){const a=i.params,o=i.cfg.slot==="attack"?e.attackPressed:e.skill2Pressed;s&&o&&n.dash.phase!=="active"&&n.playerLink.phase==="idle"&&$f(n,a),Yf(n,t,a)}},qf={channelVolley:Wf,groundRing:Zf};function jf(n){const t=Array.isArray(n.skills)?n.skills:[],e=n.abilities;return t.map(i=>{if(i.params)return{cfg:i,params:i.params};const s=i.paramsRef,a=s?e[s]:void 0;if(!a||typeof a!="object")throw new Error(`[skills] ${i.id}: paramsRef "${s??""}" 在 core.abilities 中不存在`);return{cfg:i,params:a}})}function Kf(n,t,e){for(const i of n.skills){if(i.cfg.enabled===!1)continue;const s=qf[i.cfg.kind];if(!s)continue;const a=!i.cfg.weapon||n.combat.weapon===i.cfg.weapon;s.update({world:n,dt:t,intents:e,skill:i,onWeapon:a})}}function Jf(){return{channeling:!1,channelYaw:0,fireTimer:0,waveIndex:0,cooldown:0,needsRelease:!1,channelId:0,channelMoveScale:1,volleyId:0,pending:[],projectiles:[],rings:[],nextId:0}}function Ud(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.waveIndex=0,t.cooldown=0,t.needsRelease=!1,t.channelMoveScale=1,t.pending.length=0,t.projectiles.length=0,t.rings.length=0}function Qf(n,t,e){Kf(n,t,e)}function No(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const Ul=1e-6;function Fl(n,t,e){return n<t?t:n>e?e:n}function Fd(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function Nd(n){const t=n.camera,e=Fd();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function tp(n){const t=n.camera,e=n.config.camera,i=n.character.position;let s=0,a=0,o=0,r=0;for(const c of n.dummies){const h=c.position.x-i.x,f=c.position.z-i.z,d=Math.hypot(h,f);if(d>e.radius)continue;const u=Fl((e.radius-d)/Math.max(Ul,e.radius-e.nearDistance),0,1);let p=u*(e.modeWeight[c.mode]??.5);c.attackPhase==="active"&&(p+=e.attackBoost*u),s+=p,a+=c.position.x*p,o+=c.position.z*p,r+=1}const l=s<=0?0:Fl(s/(s+Math.max(Ul,e.saturation)),0,1);if(t.threat=l,t.threatCount=r,s<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const c=a/s,h=o/s;t.centroidX=c,t.centroidZ=h;let f=(c-i.x)*e.framingBias*l,d=(h-i.z)*e.framingBias*l;const u=Math.hypot(f,d);u>e.maxOffset&&(f=f/u*e.maxOffset,d=d/u*e.maxOffset),t.offsetX=f,t.offsetZ=d}t.distanceScale=1-e.pushIn*(1-l)+e.maxPullback*l,t.pitchDelta=e.maxPitchDelta*l}function ep(n){const t=[],e=n.ground.size;t.push(Oi("ground","ground",0,0,e,e,-n.ground.thickness,0));for(const i of n.steps)t.push(Oi(i.id,"step",i.x,i.z,i.width,i.depth,0,i.height));for(const i of n.doorways){const s=i.openingWidth/2,a=i.wallThickness;t.push(Oi(`${i.id}-left`,"wall",i.x-s-i.wallSpan/2,i.z,i.wallSpan,a,0,i.wallHeight)),t.push(Oi(`${i.id}-right`,"wall",i.x+s+i.wallSpan/2,i.z,i.wallSpan,a,0,i.wallHeight)),t.push(Oi(`${i.id}-lintel`,"lintel",i.x,i.z,i.openingWidth,a,i.openingHeight,i.wallHeight))}for(const i of n.obstacles)t.push(Oi(i.id,"obstacle",i.x,i.z,i.width,i.depth,0,i.height));return t}function Oi(n,t,e,i,s,a,o,r){return{id:n,kind:t,minX:e-s/2,maxX:e+s/2,minY:o,maxY:r,minZ:i-a/2,maxZ:i+a/2}}const Wn=1e-6;function so(n,t,e){return n<t?t:n>e?e:n}function qs(n,t,e,i,s,a,o){const r=s*.85;let l=Number.NEGATIVE_INFINITY;for(const c of n)c.maxY>i+a+Wn||c.maxY<i-o-Wn||t+r<c.minX||t-r>c.maxX||e+r<c.minZ||e-r>c.maxZ||c.maxY>l&&(l=c.maxY);return l}function Bc(n,t,e,i,s){let a=!1;const o=t.y+i;for(let r=0;r<2;r++)for(const l of n){if(l.maxY<=t.y+s+Wn||l.minY>=o-Wn)continue;const c=so(t.x,l.minX,l.maxX),h=so(t.z,l.minZ,l.maxZ),f=t.x-c,d=t.z-h,u=f*f+d*d;if(!(u>=e*e))if(a=!0,u>Wn*Wn){const p=Math.sqrt(u),_=(e-p)/p;t.x+=f*_,t.z+=d*_}else{const p=t.x-l.minX,_=l.maxX-t.x,g=t.z-l.minZ,m=l.maxZ-t.z,x=Math.min(p,_,g,m);x===p?t.x=l.minX-e:x===_?t.x=l.maxX+e:x===g?t.z=l.minZ-e:t.z=l.maxZ+e}}return a}function Hc(n,t,e,i,s){const a=t.y+i;for(const o of n){if(o.maxY<=t.y+s+Wn||o.minY>=a-Wn)continue;const r=so(t.x,o.minX,o.maxX),l=so(t.z,o.minZ,o.maxZ),c=t.x-r,h=t.z-l;if(c*c+h*h<e*e-Wn)return!0}return!1}const si=1e-6,gs=Math.PI/180;function Gc(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Dr(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function zd(n){n.arrows.length=0}function np(n,t,e,i,s,a,o,r,l,c,h){const f=i-n,d=a-e,u=f*f+d*d;let p=0;u>si&&(p=((o-n)*f+(r-e)*d)/u,p=Math.max(0,Math.min(1,p)));const _=n+f*p,g=e+d*p,m=_-o,x=g-r;if(m*m+x*x>h*h)return-1;const y=t+(s-t)*p;return y<l-.1||y>l+c?-1:p}function ip(n,t){const e=n.config.combat.bow.trajectory,i=Math.max(0,e.homingRange);if(i<=si)return-1;const s=n.character.position,a=Math.max(0,e.homingConeDeg)*gs,o=n.config.targeting.targetAssist&&n.modules.targeting?n.targeting:null,r=o&&o.hasTarget?o.targetId:0;let l=-1,c=i+si;for(const h of n.dummies){if(!n.modules.dummies)break;const f=h.position.x-s.x,d=h.position.z-s.z,u=Math.hypot(f,d);if(!(u<.001||u>i)){if(h.id===r)return h.id;Math.abs(Gc(Math.atan2(f,d)-t))>a||u<c&&(l=h.id,c=u)}}return l}function sp(n,t,e){if(e<=0)return t;const i=n.dummies.find(r=>r.id===e);if(!i)return t;const s=n.character.position,a=Math.atan2(i.position.x-s.x,i.position.z-s.z),o=Math.max(0,n.config.combat.bow.trajectory.homingConeDeg)*gs;return t+ds(Gc(a-t),-o,o)}function ap(n,t,e,i,s,a){const o=n.config.combat.bow.trajectory,r={vy:a*Math.sin(Math.max(0,o.launchPitchDeg)*gs),horizontal:0};if(r.horizontal=a*Math.cos(Math.max(0,o.launchPitchDeg)*gs),s<=0)return r;const l=n.dummies.find(_=>_.id===s);if(!l)return r;const c=Math.hypot(l.position.x-t,l.position.z-i);if(c<.4)return r;const h=c/Math.max(si,a),f=l.position.y+n.config.dummies.height*ds(o.aimHeightRatio,0,1),d=Math.max(0,o.gravity),u=(f-e+.5*d*h*h)/h,p=ds(u,-a*.45,a*.92);return{vy:p,horizontal:Math.sqrt(Math.max(0,a*a-p*p))}}function op(n,t,e){const i=n.config.combat.bow.trajectory,s=Math.max(0,Math.min(1,t)),a=i.speedMin+(i.speedMax-i.speedMin)*s,o=n.character.position,r=ip(n,e),l=sp(n,e,r),c=Math.sin(l),h=Math.cos(l),f=o.x+Math.sin(e)*.55,d=o.z+Math.cos(e)*.55,u=o.y+.95,p=ap(n,f,u,d,r,a),_={id:++n.arrowSeq,x:f,y:u,z:d,vx:c*p.horizontal,vy:p.vy,vz:h*p.horizontal,life:Math.max(.1,i.maxLife),stuck:!1,stuckDummy:-1,offX:0,offY:0,offZ:0,yaw:e,localYaw:0,pitch:0,rest:0,hit:!1,targetId:r,homing:Math.max(0,i.homingTime),turnRate:Math.max(0,i.turnRateDeg)*gs};return n.arrows.push(_),Dr(n,"arrow-shot",s,_),_}function ds(n,t,e){return n<t?t:n>e?e:n}function rp(n,t){const e=n.arrows;if(e.length===0)return;const i=n.config.combat.bow.trajectory,s=n.config.dummies.radius,a=n.config.dummies.height,o=n.modules.hits&&n.modules.dummies,r=Math.max(0,i.gravity),l=[];for(const c of e){if(c.stuck){if(c.rest-=t,c.rest<=0)continue;if(c.stuckDummy>=0){const v=n.dummies[c.stuckDummy];if(v){const P=Math.cos(v.bodyYaw),S=Math.sin(v.bodyYaw);c.x=v.position.x+c.offX*P+c.offZ*S,c.y=v.position.y+c.offY,c.z=v.position.z-c.offX*S+c.offZ*P,c.yaw=v.bodyYaw+c.localYaw}}l.push(c);continue}if(c.life-=t,c.life<=0)continue;const h=c.x,f=c.y,d=c.z;if(c.homing>0&&(c.homing=Math.max(0,c.homing-t),c.targetId>0&&c.turnRate>0)){const v=n.dummies.find(P=>P.id===c.targetId);if(!v)c.targetId=0;else{const P=Math.hypot(c.vx,c.vz);if(P>si){const S=Math.atan2(v.position.x-c.x,v.position.z-c.z),w=Math.atan2(c.vx,c.vz),T=c.turnRate*t,b=w+ds(Gc(S-w),-T,T);c.vx=Math.sin(b)*P,c.vz=Math.cos(b)*P;const M=Math.hypot(v.position.x-c.x,v.position.z-c.z);if(M>.3){const R=M/P,I=(v.position.y+a*ds(i.aimHeightRatio,0,1)-c.y+.5*r*R*R)/R,z=Math.max(0,i.verticalTurnRate)*t;c.vy+=ds(I-c.vy,-z,z)}}}}c.yaw=Math.atan2(c.vx,c.vz),c.pitch=-Math.atan2(c.vy,Math.hypot(c.vx,c.vz)),c.vy-=r*t;const u=h+c.vx*t,p=f+c.vy*t,_=d+c.vz*t;let g=-1,m=2;if(o)for(let v=0;v<n.dummies.length;v++){const P=n.dummies[v],S=np(h,f,d,u,p,_,P.position.x,P.position.z,P.position.y,a,s+i.radius);S>=0&&S<m&&(m=S,g=v)}if(g>=0){const v=n.dummies[g];c.x=h+(u-h)*m,c.y=f+(p-f)*m,c.z=d+(_-d)*m,c.stuck=!0,c.stuckDummy=g;const P=Math.cos(v.bodyYaw),S=Math.sin(v.bodyYaw),w=c.x-v.position.x,T=c.z-v.position.z;c.offX=w*P-T*S,c.offZ=w*S+T*P,c.offY=c.y-v.position.y;const b=Math.atan2(c.vx,c.vz);c.localYaw=b-v.bodyYaw,c.yaw=b,c.pitch=Math.atan2(-c.vy,Math.hypot(c.vx,c.vz)),c.rest=Math.max(.2,i.stickSec),c.hit=!0;const M=Math.hypot(c.vx,c.vz);xo(n,g,{type:"light",duration:.22,dirX:M>si?c.vx/M:0,dirZ:M>si?c.vz/M:1,knockback:.14}),Dr(n,"arrow-land",v.id,c),l.push(c);continue}const x=qs(n.boxes,u,_,p+.4,.04,0,6),y=Number.isFinite(x)?x:0;if(p<=y+.02&&c.vy<0){c.x=u,c.y=y+Math.max(0,i.groundStickLift),c.z=_,c.stuck=!0,c.stuckDummy=-1,c.yaw=Math.atan2(c.vx,c.vz);const v=Math.atan2(-c.vy,Math.max(si,Math.hypot(c.vx,c.vz)));c.pitch=Math.max(v,Math.max(0,i.stickMinPitchDeg)*gs),c.rest=Math.max(.2,i.stickSec),Dr(n,"arrow-land",-1,c),l.push(c);continue}c.x=u,c.y=p,c.z=_,l.push(c)}n.arrows=l}const Lr=1e-6,cp=Math.PI/180;function Ir(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Vc(n,t,e){return n<t?t:n>e?e:n}function yo(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function kr(n){const t=n.id,e=n.windowId;Object.assign(n,yo()),n.id=t,n.windowId=e}function lp(n){kr(n)}function Od(n){kr(n.playerLink);for(const t of n.dummies)kr(t.link)}function hp(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function Ur(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const s=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;s<=0||(i.linkWindow=Math.max(i.linkWindow,s),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function ao(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,yo()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function dp(n,t){const e=n.config.links.search,i=n.character.position,s=Vc(e.maxAngleDeg,0,180)*cp;let a=0,o=t,r=Number.POSITIVE_INFINITY;for(const l of n.dummies){const c=l.position.x-i.x,h=l.position.z-i.z,f=Math.hypot(c,h);if(f<Lr||f>e.range)continue;const d=Math.atan2(c,h);Math.abs(Re(d-t))>s||f<r&&(r=f,a=l.id,o=d)}return{id:a,yaw:o,dist:a>0?r:0}}function up(n,t,e,i){const s=n.config.links,a=n.playerLink,o=n.character.position,r=Zs(n,t),l=dp(n,r),c=l.id>0?l.yaw:r,h=l.id>0?Vc(l.dist-s.search.stopDistance,0,e.distance):s.noTargetFallback?e.distance:0;a.phase="windup",a.linkWindow=0,a.source="none",a.usedWindowId=a.windowId,a.cooldown=s.sharedCooldown,a.kind=e.kind,a.weapon=i,a.id+=1,a.timer=0,a.progress=0,a.facing=c,a.targetId=l.id,a.targetDist=l.dist,a.travel=h,a.travelled=0,a.fromX=o.x,a.fromZ=o.z,a.pulseTimer=0,a.hitIds=[],a.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,s.sharedCooldown),Ir(n,"link-start",a.id)}function fp(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){ao(n);return}if(e.weapon!==n.combat.weapon){ao(n);return}e.timer+=t;const s=l=>l==="windup"?i.windup:l==="active"?i.active:i.recovery;let a=0;for(;e.phase!=="idle"&&a++<8;){const l=s(e.phase);if(e.timer<l)break;e.timer-=l,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,Ir(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,Ir(n,"link-end",e.id))}const o=i.windup+i.active+i.recovery;let r=0;if(e.phase==="windup"?r=e.timer:e.phase==="active"?r=i.windup+e.timer:e.phase==="recovery"?r=i.windup+i.active+e.timer:r=o,e.progress=o>0?Vc(r/o,0,1):1,e.phase==="active"&&i.active>Lr){const l=Math.max(0,e.travel-e.travelled),c=Math.max(Lr,i.active-e.timer),h=l/c;n.impulse.x=Math.sin(e.facing)*h,n.impulse.z=Math.cos(e.facing)*h}}function pp(n,t,e){const i=n.config.links,s=n.playerLink,a=n.character.position;if(s.consumedAttack=!1,s.phase==="active"&&(s.travelled+=Math.hypot(a.x-s.fromX,a.z-s.fromZ)),s.fromX=a.x,s.fromZ=a.z,!i.enabled||!n.modules.links){s.phase!=="idle"&&ao(n);return}const o=n.combat,r=n.character.sprinting;r&&i.triggerWhileSprinting&&s.phase==="idle"&&s.usedWindowId!==s.windowId&&i.windows.sprint>0&&(s.linkWindow=Math.max(s.linkWindow,i.windows.sprint),s.source="sprint"),s.phase==="idle"&&s.prevSprinting&&!r&&Ur(n,"sprint"),s.prevSprinting=r,fp(n,t);const l=i.moves[o.weapon];e.attackPressed&&s.phase==="idle"&&s.linkWindow>0&&s.usedWindowId!==s.windowId&&s.cooldown<=0&&o.phase==="idle"&&!o.charging&&n.dash.phase==="idle"&&!!l&&l.enabled&&up(n,e,l,o.weapon)}const Fr=1e-6;function ai(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Bd(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function Mo(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.timings=Bd()}function mp(n){return{weapon:Li[Math.max(0,n-1)]??Li[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,timings:Bd()}}function gp(n,t){return Zs(n,t)}function xp(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,s=Math.max(0,t*e.maxLungeScale),a=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+a,s)}function Hd(n,t,e,i){const s=n.combat;s.phase="windup",s.phaseTimer=0,s.comboIndex=i,s.queued=!1,s.charging=!1,s.charge=0,s.attackFacing=gp(n,t),s.attackProgress=0,s.timings=e,s.attackId+=1,ai(n,"attack-start",i)}function Gd(n){return Math.max(0,n.config.combat.settle)}function Nr(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];Hd(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Gd(n),lunge:xp(n,i.lunge[e-1]??0)},e)}function Nl(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,Hd(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Gd(n),lunge:i.lunge},0),op(n,e,n.combat.attackFacing),ai(n,"charge-release",e)}function vp(n,t,e){const i=n.combat;if(i.phase==="idle")return;const s=i.timings;i.phaseTimer+=t;let a=0;for(;i.phase!=="idle"&&a++<8;){const l=i.phase==="windup"?s.windup:i.phase==="active"?s.active:i.phase==="recovery"?s.recovery:s.settle;if(i.phaseTimer<l)break;if(i.phaseTimer-=l,i.phase==="windup")i.phase="active",ai(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",ai(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.comboWindow,i.queued){i.queued=!1;const c=n.config.combat.weapons[i.weapon];c.comboCount>0&&Nr(n,e,i.comboIndex<c.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const l=i.timings.recovery;if(l>Fr&&i.phaseTimer>=l*n.config.combat.cancelWindow){i.queued=!1;const c=n.config.combat.weapons[i.weapon];c.comboCount>0&&Nr(n,e,i.comboIndex<c.comboCount?i.comboIndex+1:1)}}const o=s.windup+s.active+s.recovery;let r=0;i.phase==="windup"?r=i.phaseTimer:i.phase==="active"?r=s.windup+i.phaseTimer:i.phase==="recovery"?r=s.windup+s.active+i.phaseTimer:i.phase==="settle"&&(r=o),i.phase!=="idle"&&(i.attackProgress=o>0?Math.min(1,r/o):1)}function _p(n,t,e){const i=n.combat,s=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=Li.length){const l=Li[e.weaponSlot-1];l!==i.weapon&&(i.weapon=l,Mo(n),ao(n),ai(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,ai(n,"combo-reset",0))),vp(n,t,e);const a=s.weapons[i.weapon],o=n.dash.phase==="active";if(a.comboCount>0){const l=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!o&&!l&&(e.attackPressed||s.autoCombo&&e.attackHeld))if(i.phase==="idle"){const h=i.comboWindow>0&&i.comboIndex<a.comboCount?i.comboIndex+1:1;Nr(n,e,h)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&!o&&!n.playerLink.consumedAttack){if(e.attackHeld){if(i.charging||(i.charging=!0,i.charge=0,ai(n,"charge-start",0)),i.charge=Math.min(1,i.charge+t/Math.max(s.bow.maxChargeTime,Fr)),s.bow.autoFire&&i.charge>=1){i.charging=!1;const l=i.charge;i.charge=0,Nl(n,e,l)}}else if(i.charging){i.charging=!1;const l=i.charge;i.charge=0,l>=s.bow.minChargeToFire?Nl(n,e,l):ai(n,"charge-release",0)}}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.timings.active>Fr)){const l=i.timings.lunge/i.timings.active;n.impulse.x=Math.sin(i.attackFacing)*l,n.impulse.z=Math.cos(i.attackFacing)*l}}const zr=1e-6;function zo(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function yp(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function Vd(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function zl(n,t,e){return n<t?t:n>e?e:n}function Mp(n,t,e){const i=n.config.dash,a=n.character.position,o=n.config.worldBounds,r=Math.max(.05,i.blinkStep),l=Math.max(0,i.blinkDistance);let c=0,h=a.x,f=a.z;for(;c<l-zr;){const d=Math.min(l,c+r),u=a.x+t*d,p=a.z+e*d,_=zl(u,o.minX,o.maxX),g=zl(p,o.minZ,o.maxZ),m={x:_,y:a.y,z:g};if(Hc(n.boxes,m,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(h=_,f=g,c=d,_!==u||g!==p))break}return{x:h,z:f}}function Sp(n,t,e){const i=n.dash,s=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,Ur(n,"roll")),i.cooldown>0){const l=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),l>0&&i.cooldown===0&&zo(n,"dash-ready",0)}const a=n.combat,o=a.weapon==="bow"&&(a.charging||a.phase!=="idle");if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&(a.phase==="idle"||o)&&n.playerLink.phase==="idle"){o&&(a.charging=!1,a.charge=0,a.phase!=="idle"&&Mo(n));const l=Af(n,e),c=l.x,h=l.z,f=n.combat.weapon==="staff";if(i.kind=f?"blink":"roll",i.dirX=c,i.dirZ=h,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=f?s.blinkCooldown:s.rollCooldown,f){const d=Mp(n,c,h);n.character.position.x=d.x,n.character.position.z=d.z,i.toX=d.x,i.toZ=d.z,i.duration=0,i.timer=0,i.phase="idle",s.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),Ur(n,"blink"),zo(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(zr,s.rollDuration),i.timer=i.duration,i.toX=i.fromX+c*s.rollDistance,i.toZ=i.fromZ+h*s.rollDistance,zo(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const l=Math.max(zr,i.timer),c=n.character.position.x,h=n.character.position.z;n.impulse.x=(i.toX-c)/l,n.impulse.z=(i.toZ-h)/l}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const en=1e-6,Or=Math.PI*2,bp=7,Ep=18;function Ol(n,t,e){return n<t?t:n>e?e:n}function wp(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Bl(n,t,e,i){return n+wp(t-n)*(1-Math.exp(-Math.max(e,en)*i))}function Xc(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function Tp(n){const t=[];for(let e=0;e<n.count;e++){const i=n.spawn[e]??{x:0,z:0},s=n.initialModes[e]??"idle";t.push({id:e+1,mode:s,initialMode:s,homeX:i.x,homeZ:i.z,position:{x:i.x,y:0,z:i.z},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:i.x,targetZ:i.z,wanderTimer:0,attackCooldown:0,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,hurt:Rd(),link:yo()})}return t}function Ap(n){const t=Uo.indexOf(n);return Uo[(t+1)%Uo.length]}function Xd(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],s=t.spawn[e]??{x:i.homeX,z:i.homeZ},a=t.initialModes[e]??i.initialMode;i.mode=a,i.initialMode=a,i.homeX=s.x,i.homeZ=s.z,i.position.x=s.x,i.position.y=0,i.position.z=s.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=s.x,i.targetZ=s.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0;const o=i.hurt;o.type="none",o.timer=0,o.duration=0,o.dirX=0,o.dirZ=0,o.knockX=0,o.knockZ=0,lp(i.link)}n.dummyAttackCount=0}function Rp(n,t,e){const i=No(n)*Or,s=Math.sqrt(No(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*s,t.targetZ=t.homeZ+Math.sin(i)*s,t.wanderTimer=e.wanderInterval*(.6+No(n)*.8)}function Cp(n,t){return n.attackPhase==="windup"?t.attackWindup:n.attackPhase==="active"?t.attackActive:n.attackPhase==="recovery"?t.attackRecovery:0}function Pp(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0;return}t.attackPhaseTimer+=e;let s=0;for(;t.attackPhase!=="idle"&&s++<4;){const r=Math.max(Cp(t,i),en);if(t.attackPhaseTimer<r)break;t.attackPhaseTimer-=r,t.attackPhase==="windup"?(t.attackPhase="active",Xc(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0)}const a=i.attackWindup+i.attackActive+i.attackRecovery;let o=0;t.attackPhase==="windup"?o=t.attackPhaseTimer:t.attackPhase==="active"?o=i.attackWindup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(o=i.attackWindup+i.attackActive+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||a<=0?0:Math.min(1,o/a)}function Dp(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,s=i.x-t.position.x,a=i.z-t.position.z,o=Math.hypot(s,a),r=o>en?s/o:0,l=o>en?a/o:0;let c=0,h=0;if(t.mode==="wander"){const d=t.targetX-t.position.x,u=t.targetZ-t.position.z,p=Math.hypot(d,u);(t.wanderTimer<=0||p<.3)&&Rp(n,t,e);const _=t.targetX-t.position.x,g=t.targetZ-t.position.z,m=Math.hypot(_,g);m>en&&(c=_/m,h=g/m)}else if(t.mode==="follow")o>e.followStopDistance&&(c=r,h=l);else if(t.mode==="keep-distance"){const d=o-e.keepDistance;d>e.keepDeadZone?(c=r,h=l):d<-e.keepDeadZone?(c=-r,h=-l):(c=-l*e.keepStrafe,h=r*e.keepStrafe)}else t.mode==="attack"&&o>e.attackRange&&t.attackPhase==="idle"&&(c=r,h=l);let f=t.facing;if(t.mode==="wander"?Math.hypot(c,h)>en&&(f=Math.atan2(c,h)):o>en&&(f=Math.atan2(r,l)),e.leashRadius>en&&t.mode!=="wander"&&t.mode!=="idle"){const d=t.position.x-t.homeX,u=t.position.z-t.homeZ,p=Math.hypot(d,u);if(p>e.leashRadius){const _=Math.min(1,(p-e.leashRadius)/Math.max(e.leashRadius*.5,.5)),g=-d/p,m=-u/p;c=c*(1-_)+g*_,h=h*(1-_)+m*_;const x=Math.hypot(c,h);x>en&&(c/=x,h/=x)}}return{x:c,z:h,facing:f}}function Lp(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.mode==="attack"&&e.attackPhase==="idle"&&e.attackCooldown<=0&&e.hurt.timer<=0){const g=n.character.position;Math.hypot(g.x-e.position.x,g.z-e.position.z)<=i.attackRange+en&&(e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=i.attackInterval,n.dummyAttackCount+=1,Xc(n,"dummy-attack",e))}Pp(n,e,t,i);const s=Dp(n,e,i),a=1-Math.exp(-Math.max(i.acceleration,en)*t);e.velocity.x+=(s.x*i.moveSpeed-e.velocity.x)*a,e.velocity.z+=(s.z*i.moveSpeed-e.velocity.z)*a,e.facing=s.facing,e.bodyYaw=Bl(e.bodyYaw,e.facing,bp,t),e.headYaw=Bl(e.headYaw,e.facing,Ep,t);const o=e.position.x,r=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const l=n.config.stepHeight;Bc(n.boxes,e.position,i.radius,i.height,l)&&Hc(n.boxes,e.position,i.radius,i.height,l)&&(e.position.x=o,e.position.z=r,e.velocity.x=0,e.velocity.z=0);const h=n.config.worldBounds;e.position.x=Ol(e.position.x,h.minX,h.maxX),e.position.z=Ol(e.position.z,h.minZ,h.maxZ);const f=qs(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,l,Number.POSITIVE_INFINITY);f>Number.NEGATIVE_INFINITY&&f<=e.position.y+l+en&&(e.position.y=f);const d=Math.hypot(e.position.x-o,e.position.z-r);e.distance+=d;const u=Math.hypot(e.velocity.x,e.velocity.z),p=Math.min(n.config.strideSpeedCap,u/Math.max(n.config.moveSpeed,en)),_=Math.max(n.config.strideLength*(1+p*n.config.strideSpeedGain),en);e.stride=_,e.gaitPhase=(e.gaitPhase+d/_*Or)%Or}function Ip(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const s=n.dummies[e.dummyClickId-1];s.mode=Ap(s.mode),s.targetX=s.position.x,s.targetZ=s.position.z,s.wanderTimer=0,s.attackCooldown=0,s.attackPhase="idle",s.attackPhaseTimer=0,s.attackProgress=0,Xc(n,"dummy-mode",s)}for(const s of n.dummies)Lp(n,t,s,i)}const Bi=1e-6,Hl=Math.PI*2;function Oo(n,t){return Math.sqrt(n*n+t*t)}function da(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function kp(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.headPitch=0,t.bodyPitch=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,Mo(n)}function Up(n,t,e){const i=n.character,s=n.config,a=qs(n.boxes,t,e,s.characterHeight,s.characterRadius,s.stepHeight,Number.POSITIVE_INFINITY);i.position.x=t,i.position.y=a>Number.NEGATIVE_INFINITY?a:0,i.position.z=e,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.moveYaw=0,i.bodyYaw=0,i.headYaw=0,i.headPitch=0,i.bodyPitch=0,i.grounded=!0,i.sprinting=!1,i.gaitPhase=0,i.stride=s.strideLength,i.distance=0,i.coyoteTime=s.coyoteTime,i.jumpBuffer=0,Mo(n),Od(n),Vd(n),Ud(n),zd(n),io(n);const o=n.targeting;o.targetId=0,o.targetYaw=0,o.targetDist=0,o.hasTarget=!1;const r=n.playerHurt;r.type="none",r.lastAt=Fc,r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,n.events.length=0}function Fp(n,t,e){const i=n.config,s=n.character,a=s.position,o=s.velocity;let r=e.moveX,l=e.moveZ;const c=Oo(r,l);c>1&&(r/=c,l/=c);const h=n.combat.phase!=="idle",f=n.playerLink.phase!=="idle",d=h||n.dash.phase==="active"||f;s.sprinting=!d&&e.sprintHeld&&c>Bi;const u=i.combat.weapons[n.combat.weapon];let p=u?u.moveMultiplier:1;d?p*=n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?p*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(p*=Math.max(0,Math.min(1,n.abilities.channelMoveScale)));const _=i.moveSpeed*(s.sprinting?i.sprintMultiplier:1)*p;if(d)o.x=r*_,o.z=l*_;else{const F=c>Bi?i.acceleration:i.friction,I=1-Math.exp(-F*t);o.x+=(r*_-o.x)*I,o.z+=(l*_-o.z)*I}e.jumpPressed?s.jumpBuffer=i.jumpBufferTime:s.jumpBuffer=Math.max(0,s.jumpBuffer-t),s.coyoteTime=s.grounded?i.coyoteTime:Math.max(0,s.coyoteTime-t),s.jumpBuffer>0&&s.coyoteTime>0&&(o.y=i.jumpSpeed,s.grounded=!1,s.coyoteTime=0,s.jumpBuffer=0,da(n,"jumped",i.jumpSpeed)),n.events.some(F=>F.type==="blink"&&F.tick===n.tick)&&(o.x=0,o.z=0,n.impulse.x=0,n.impulse.z=0);const m=a.x,x=a.z;if(a.x+=(o.x+n.impulse.x+n.playerHurt.knockX)*t,a.z+=(o.z+n.impulse.z+n.playerHurt.knockZ)*t,Bc(n.boxes,a,i.characterRadius,i.characterHeight,i.stepHeight)){if(Hc(n.boxes,a,i.characterRadius,i.characterHeight,i.stepHeight))a.x=m,a.z=x,o.x=0,o.z=0;else{const F=a.x-m,I=a.z-x;Math.abs(F)<Math.abs(o.x*t)*.5&&(o.x=0),Math.abs(I)<Math.abs(o.z*t)*.5&&(o.z=0)}da(n,"blocked",1)}const v=i.worldBounds;a.x=Gl(a.x,v.minX,v.maxX),a.z=Gl(a.z,v.minZ,v.maxZ);const P=qs(n.boxes,a.x,a.z,a.y,i.characterRadius,i.stepHeight,i.fallTolerance);s.grounded&&P>a.y+Bi&&P-a.y<=i.stepHeight+Bi&&(a.y=P,o.y=0,da(n,"stepUp",P));const S=a.y;o.y-=i.gravity*t,a.y+=o.y*t;const w=qs(n.boxes,a.x,a.z,S,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);w>Number.NEGATIVE_INFINITY&&a.y<=w&&o.y<=0?(a.y=w,o.y=0,s.grounded||da(n,"landed",w),s.grounded=!0):s.grounded=!1;const T=Oo(a.x-m,a.z-x);s.distance+=T;const b=Oo(o.x,o.z),M=Math.min(i.strideSpeedCap,b/Math.max(i.moveSpeed,Bi)),R=Math.max(i.strideLength*(1+M*i.strideSpeedGain),Bi);s.stride=R,s.gaitPhase=(s.gaitPhase+T/R*Hl)%Hl}function Gl(n,t,e){return n<t?t:n>e?e:n}const Br=1e-6,Vl=2.399963229728653;function wi(n,t,e){return n<t?t:n>e?e:n}function Xl(n,t,e,i,s,a,o,r,l){const c=t.x-n.x,h=t.z-n.z,f=Math.hypot(c,h),d=e+i;if(f>=d)return;let u,p,_;f<Br?(u=r,p=l,_=d):(u=c/f,p=h/f,_=d-f);const g=_+o;n.x-=u*g*s,n.z-=p*g*s,t.x+=u*g*a,t.z+=p*g*a}function Np(n){const t=n.config.separation,e=n.dummies,i=n.character.position,s=n.config.characterRadius,a=n.config.dummies.radius,o=Math.max(1,Math.floor(t.iterations)),r=Math.max(0,t.slop);for(let h=0;h<o;h++){for(let f=0;f<e.length;f++)for(let d=f+1;d<e.length;d++){const u=(f*3+d)*Vl;Xl(e[f].position,e[d].position,a,a,.5,.5,r,Math.cos(u),Math.sin(u))}for(let f=0;f<e.length;f++){const d=(f+1)*Vl;Xl(i,e[f].position,s,a,0,1,r,Math.cos(d),Math.sin(d))}}const l=n.config.stepHeight,c=n.config.worldBounds;for(const h of e)Bc(n.boxes,h.position,a,n.config.dummies.height,l),h.position.x=wi(h.position.x,c.minX,c.maxX),h.position.z=wi(h.position.z,c.minZ,c.maxZ)}function zp(n,t,e,i,s,a,o,r){const l=Math.hypot(e,i),c=Math.max(0,r.contactBand),h=wi(r.minScale,0,1);if(l<Br||c<=0||h>=1)return 1;const f=s+o,d=wi(r.approachDot,0,.99);let u=0;for(const p of a){const _=p.position.x-n,g=p.position.z-t,m=Math.hypot(_,g);if(m>=f+c)continue;if(m<Br){u=1;continue}const x=(e*_+i*g)/(l*m);if(x<=d)continue;const y=wi(1-(m-f)/c,0,1),v=wi((x-d)/(1-d),0,1);u=Math.max(u,y*v)}return 1-(1-h)*wi(u,0,1)}function Op(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=zp(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const Wl=1e-6,Bp=Math.PI/180;function Hp(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function Gp(n,t,e){return n<t?t:n>e?e:n}function Vp(n,t,e){const i=n.config.targeting,s=n.targeting,a=n.character.position;let o=n.character.facing;Math.hypot(e.moveX,e.moveZ)>Wl&&(o=Math.atan2(e.moveX,e.moveZ));const l=Gp(i.maxAngleDeg,0,180)*Bp;let c=Number.POSITIVE_INFINITY,h=0,f=0,d=0;for(const u of n.dummies){const p=u.position.x-a.x,_=u.position.z-a.z,g=Math.hypot(p,_);if(g<Wl||g>i.range)continue;const m=Math.atan2(p,_),x=Math.abs(Re(m-o));if(x>l)continue;const y=g-i.frontBias*Math.cos(x);y<c&&(c=y,h=u.id,f=m,d=g)}s.targetId=h,s.targetYaw=f,s.targetDist=d,s.hasTarget=h>0}const Ln=1e-6;function cs(n,t,e){return n<t?t:n>e?e:n}function $l(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Xp(n,t,e){const i=n.config.gaze,s=n.gaze;if(!i.enabled||!n.modules.gaze){s.active=!1,s.mainId=0,s.mainYaw=0,s.mainPitch=0,s.centroidYaw=0,s.threatCount=0,s.threat=0;return}const a=n.character.position,o=(I,z)=>{const C=I.position.x-a.x,D=I.position.z-a.z,X=Math.hypot(C,D);if(X<Ln||X>z)return 0;const H=cs((z-X)/Math.max(Ln,z-i.nearDistance),0,1);let Z=H*(i.modeWeight[I.mode]??.5);return I.attackPhase==="active"&&(Z+=i.attackBoost*H),Z},r=[];let l=0,c=!1,h=!1,f=!1;for(const I of n.dummies){const z=o(I,i.threatRange),C=I.position.x-a.x,D=I.position.z-a.z,X=Math.hypot(C,D);z>0&&(r.push({id:I.id,x:I.position.x,z:I.position.z,dx:C,dz:D,yaw:Math.atan2(C,D),w:z}),l+=z,X<=i.approachDist&&(i.modeWeight[I.mode]??.5)>=i.hostileModeWeight&&(f=!0)),X>Ln&&X<=i.recoveryDist&&(c=!0),(I.attackPhase==="windup"||I.attackPhase==="active")&&X<=i.threatRange&&(h=!0)}const d=l<=0?0:cs(l/(l+Math.max(Ln,i.saturation)),0,1),u=r.length>0,p=s.active,_=u&&(e.aimActive&&d>=i.enterThreshold||i.reactToAttack&&h&&d>=i.enterThreshold||i.reactToApproach&&f),g=i.hurtHoldSec>Ln&&n.time-n.playerHurt.lastAt<i.hurtHoldSec,m=p&&(c||g);if(s.active=_||m,!s.active){s.mainId=0,s.mainYaw=0,s.mainPitch=0,s.centroidYaw=0,s.threatCount=0,s.threat=0;return}if(r.length===0)return;r.sort((I,z)=>z.w-I.w);const x=r.slice(0,Math.max(1,i.maxThreats)),y=r[0],v=Math.atan2(y.dx,y.dz),P=i.behindAngleDeg*Math.PI/180,S=n.character.bodyYaw;let w=0,T=0,b=0;for(const I of x){const z=Math.abs($l(I.yaw-v))/Math.PI;let C=I.w/(1+Math.max(i.spreadFalloff,0)*z*z);I!==y&&i.behindFalloff<1&&Math.abs($l(I.yaw-S))>P&&(C*=Math.max(i.behindFalloff,0)),w+=I.x*C,T+=I.z*C,b+=C}s.mainId=y.id,s.mainYaw=v;const M=n.dummies.find(I=>I.id===y.id),R=(M?M.position.y:0)+n.config.dummies.height*cs(i.aimHeightRatio,0,1),F=a.y+n.config.characterHeight*cs(i.eyeHeightRatio,0,1);s.mainPitch=Math.atan2(R-F,Math.max(Ln,Math.hypot(y.dx,y.dz))),s.centroidYaw=b>Ln?Math.atan2(w/b-a.x,T/b-a.z):v,s.threatCount=r.length,s.threat=d}function Wp(n,t){const e=n.config.gaze;return(e.modeWeight[t.mode]??.5)>=e.hostileModeWeight}function $p(n,t){const e=n.config.gaze;if(!e.enabled||!n.modules.gaze)return 0;const i=n.character.position,s=Math.hypot(t.position.x-i.x,t.position.z-i.z);if(s<Ln||s>e.threatRange)return 0;const a=Math.max(Ln,e.threatRange-e.nearDistance),o=cs((e.threatRange-s)/a,0,1);let r=o*(e.modeWeight[t.mode]??.5);t.attackPhase==="active"&&(r+=e.attackBoost*o);const l=Math.max(Ln,e.modeWeight.attack??1.5);return cs(r/l,0,1)}function Yp(){return{active:!1,mainId:0,mainYaw:0,mainPitch:0,centroidYaw:0,threatCount:0,threat:0}}function Zp(n,t){return{tick:0,time:0,rngState:2654435769,config:n,boxes:ep(t),gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:mp(1),playerLink:yo(),arrows:[],arrowSeq:0,abilities:Jf(),skills:jf(n),impulse:{x:0,z:0},targeting:Hp(),turnInPlace:If(),playerHurt:Rd(),hitCount:0,dash:{...yp(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{...Fd(),centroidX:n.spawn.x,centroidZ:n.spawn.z},gaze:Yp(),dummies:Tp(n.dummies),dummyAttackCount:0,events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,turnInPlace:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,gaze:!0,dummies:!0}}}function qp(n){kp(n),Xd(n),Od(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.lastAt=Fc,e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,Ud(n),zd(n),Vd(n),Nd(n),io(n);const i=n.gaze;i.active=!1,i.mainId=0,i.mainYaw=0,i.mainPitch=0,i.centroidYaw=0,i.threatCount=0,i.threat=0,n.events.length=0}function Yl(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){qp(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?Vp(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),pp(n,t,e),n.modules.combat&&_p(n,t,e),n.modules.dash&&Sp(n,t,e),n.modules.movement&&Fp(n,t,e),n.modules.gaze&&Xp(n,t,e),n.modules.orientation&&Nf(n,t,e),Ff(n,t,e),n.modules.dummies&&Ip(n,t,e),Rf(n,t),hp(n,t),n.modules.abilities&&Qf(n,t,e),n.modules.combat&&rp(n,t),n.modules.dummies&&(Lf(n,t),n.modules.separation&&(Np(n),Op(n))),n.modules.camera?tp(n):Nd(n),n}function jp(n){let t=0;return{frame(e,i,s,a,o){if(a||s<=0)return t=0,0;t+=Math.min(e,.1)*s;const r=n.config.fixedDt,l=n.config.maxStepsPerFrame;let c=0;for(;t>=r&&c<l;){const h=c===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};Yl(n,r,h),o&&o(),t-=r,c++}return c>=l&&(t=0),c},singleStep(e){Yl(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t}}}const Wd={slopPx:12,longPressMs:450,doubleTapMs:280};function Kp(n,t,e=Wd.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,s=n.dy/n.distance,a=t.rightX*i+t.forwardX*-s,o=t.rightZ*i+t.forwardZ*-s,r=Math.hypot(a,o);return r<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:a/r,worldZ:o/r}}function fi(n,t,e,i,s,a){const o=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:o,angleDeg:o>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:s,taps:a,worldX:0,worldZ:0}}function Jp(n=Wd){const t=new Map,e=new Map,i=s=>t.get(s);return{begin(s,a,o,r,l){if(t.has(a))return null;for(const c of t.values())if(c.button===s)return null;return t.set(a,{button:s,pointerId:a,startX:o,startY:r,x:o,y:r,startedAt:l,dragging:!1,longFired:!1}),fi(s,"press",0,0,0,1)},move(s,a,o,r){const l=i(s);if(!l)return null;l.x=a,l.y=o;const c=a-l.startX,h=o-l.startY;return!l.dragging&&Math.hypot(c,h)>=n.slopPx?(l.dragging=!0,fi(l.button,"drag",c,h,r-l.startedAt,1)):null},end(s,a,o,r){const l=i(s);if(!l)return null;t.delete(s),l.x=a,l.y=o;const c=a-l.startX,h=o-l.startY,f=r-l.startedAt,d=Math.hypot(c,h);if(l.dragging||l.longFired||d>=n.slopPx)return fi(l.button,"release",c,h,f,1);const u=e.get(l.button);return u!==void 0&&r-u.at<=n.doubleTapMs&&Math.hypot(a-u.x,o-u.y)<=n.slopPx*2?(e.delete(l.button),fi(l.button,"doubleTap",c,h,f,2)):(e.set(l.button,{at:r,x:a,y:o}),fi(l.button,"tap",c,h,f,1))},cancel(s,a){const o=i(s);return o?(t.delete(s),fi(o.button,"cancel",o.x-o.startX,o.y-o.startY,a-o.startedAt,1)):null},poll(s){for(const a of t.values())if(!(a.longFired||a.dragging)&&s-a.startedAt>=n.longPressMs)return a.longFired=!0,fi(a.button,"longPress",a.x-a.startX,a.y-a.startY,s-a.startedAt,1);return null},isHeld(s){for(const a of t.values())if(a.button===s)return!0;return!1},reset(){t.clear(),e.clear()}}}const Bo=.001,Qp=18;function Hr(n,t,e){return n<t?t:n>e?e:n}function Gr(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function tm(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function em(n,t,e,i,s=Qp){const a=tm(t);if(!a)return{state:Gr(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const o=Math.hypot(a[1].x-a[0].x,a[1].y-a[0].y),r=s,l=Math.max(1.0001,Number.isFinite(i)?i:1.25),c=1/l,h=l;if(!Number.isFinite(o)||o<Bo)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const p=r<=0;return{state:{active:!0,lastDist:o,armDist:o,armed:p},scale:1,started:!0,ended:!1,armedNow:!1,pinching:p}}if(!n.armed)return n.armDist<Bo?{state:{active:!0,lastDist:o,armDist:o,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(o-n.armDist)<r?{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<Bo)return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const f=o/n.lastDist,d=Math.max(0,Number.isFinite(e)?e:1),u=Number.isFinite(f)&&f>0?Math.pow(f,d):1;return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:Hr(Number.isFinite(u)?u:1,c,h),started:!1,ended:!1,armedNow:!1,pinching:!0}}function nm(n,t,e,i){const s=Math.min(e,i),a=Math.max(e,i),o=Number.isFinite(t)&&t>0?t:1,r=n*o;return Number.isFinite(r)?Hr(r,s,a):Hr(n,s,a)}function im(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function sm(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const Ho=["jump","sprint","reset","attack","skill2"],am=8,om=16,Go=10,Zl=14,ql=140,rm=18,cm=16,lm=400,hm=1.0001;function Ya(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function dm(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&Ya(e)}function um(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:s}=n,a=()=>Math.max(8,t());let o=null,r=0,l=0,c=0,h=0,f=0,d=0,u=-1,p=0,_=null,g=-1,m=0,x=0,y=0,v=0,P=!1,S=0,w=1,T=0,b=null,M=0,R=0,F=!1,I=null,z=null,C=0,D=0,X=0,H=0,Z=!1,Q=!0,mt=-1;const dt=Jp({slopPx:Zl,longPressMs:450,doubleTapMs:350});let ut=[],K=null;const tt=new Set;function ht(B){B&&ut.push(B)}const j=new Map;let Mt=Gr(),kt=!1,Ct=1;function Tt(){const B=Array.from(j.values()),it=s(),pt=em(Mt,B,it.pinchGain,it.maxStepRatio,rm);if(Mt=pt.state,kt=pt.pinching,pt.scale!==1&&(Ct*=pt.scale),pt.started||pt.armedNow)b=null,F=!0,I=null;else if(pt.ended&&o===null&&B.length===1){const Ut=B[0];o=Ut.id,r=Ut.x,l=Ut.y,c=0,h=0,f=Ut.x,d=Ut.y,P=!1,S=0,w=1,T=0,performance.now(),b=null,F=!0,I=null}}const Ht={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},Lt={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let G=0,jt=0;const Rt={},Dt=new Set,zt=[];function It(){for(const B of Ho)Rt[B]!==void 0&&(Rt[B]=void 0),$(B);dt.reset(),tt.clear(),j.clear(),Mt=Gr(),kt=!1,o=null,c=0,h=0,f=0,d=0,P=!1,S=0,w=1,T=0,m=0,x=0,y=0,v=0,_=null,g=-1,b=null,F=!1,I=null,z=null,mt=-1,X=0,H=0,Z=!1,Q=!0}const Pt=()=>{document.hidden&&It()},L=B=>{if(B.clientX===0&&B.clientY===0){p++;return}if(Ya(B.target)||dm(B.clientX,B.clientY)){tt.add(B.pointerId);return}if(tt.delete(B.pointerId),j.set(B.pointerId,{id:B.pointerId,x:B.clientX,y:B.clientY}),o===null&&!kt){_=null,g=-1,o=B.pointerId,r=B.clientX,l=B.clientY,c=0,h=0,f=B.clientX,d=B.clientY,performance.now();const it=Number.isFinite(B.screenX)&&Number.isFinite(B.screenY)&&(B.screenX!==0||B.screenY!==0);P=it,S=0,w=1,T=0,m=it?B.screenX:0,x=it?B.screenY:0,y=m,v=x,b=B.pointerId,M=B.clientX,R=B.clientY,F=!1}Tt()},E=B=>{if(B.pointerId===z&&(B.pointerType==="mouse"&&B.buttons===0||B.clientX===0&&B.clientY===0&&(C!==0||D!==0)||(Q?(X=B.clientX-C,H=B.clientY-D):(C=B.clientX,D=B.clientY,Q=!0,X=0,H=0))),ht(dt.move(B.pointerId,B.clientX,B.clientY,performance.now())),!tt.has(B.pointerId)&&j.has(B.pointerId)&&(j.set(B.pointerId,{id:B.pointerId,x:B.clientX,y:B.clientY}),Tt()),tt.has(B.pointerId)||B.pointerId!==o)return;const it=performance.now();if(_===B.pointerId&&it-g<150){p++;return}const pt=B.clientX,Ut=B.clientY;if(pt===0&&Ut===0&&(r!==0||l!==0)){p++;return}const Gt=pt-f,N=Ut-d,St=Number.isFinite(B.screenX)&&Number.isFinite(B.screenY),q=St?B.screenX:0,ct=St?B.screenY:0,yt=St&&(q!==0||ct!==0),Et=q-y,Xt=ct-v;if(P&&yt){const Y=Math.hypot(Et,Xt),bt=Math.hypot(Gt,N);if(Y>3){if(S=0,T<30&&bt>6&&Et*Gt+Xt*N>.7*Y*bt){const wt=Y/bt;wt>.2&&wt<5&&(w+=(wt-w)*.3,T++)}}else bt>12&&(S++,S>=2&&(P=!1))}const Kt=Math.hypot(Gt,N);if(!P){const Y=u<0?Number.POSITIVE_INFINITY:it-u,bt=yt?Math.hypot(Et,Xt):1/0;Kt>28&&(Y<200||bt<Kt*.4)&&(r+=Gt,l+=N,p++)}f=pt,d=Ut,y=q,v=ct,B.pointerId===b&&Math.hypot(B.clientX-M,B.clientY-R)>am&&(F=!0);let oe,Qt;P&&yt?(oe=(q-m)/w,Qt=(ct-x)/w):(oe=pt-r,Qt=Ut-l);const ie=Math.hypot(oe,Qt),ye=a();ie>ye&&(oe*=ye/ie,Qt*=ye/ie);const Ge=Math.hypot(c,h),ze=Math.hypot(oe,Qt);if(Ge>10&&ze>10){const Y=Math.abs(Math.atan2(c*Qt-h*oe,c*oe+h*Qt)),bt=Math.max(Ge,ze)*Y,wt=Math.max(Math.hypot(Gt,N),Math.hypot(Et,Xt)/Math.max(.2,w));if(Y>.6&&wt<Math.max(6,bt*.5)){p++;return}}c=oe,h=Qt};function $(B){if(!Ht[B])return;Ht[B]=!1,B==="attack"&&(Lt.attackReleased=!0);const it=document.getElementById(`btn-${B}`);it==null||it.classList.remove("is-down")}function nt(){o!==null&&(_=o,g=performance.now(),o=null,c=0,h=0,f=0,d=0,P=!1,S=0,w=1,T=0,m=0,x=0,y=0,v=0)}const at=B=>{const it=j.delete(B.pointerId),pt=tt.delete(B.pointerId);it&&Tt(),B.pointerId===z&&(z=null,Z?mt=performance.now():(X=0,H=0,mt=-1)),ht(dt.end(B.pointerId,B.clientX,B.clientY,performance.now()));for(const Nt of Ho)Rt[Nt]===B.pointerId&&(Rt[Nt]=void 0,$(Nt));const Ut=!it&&!pt&&j.size<=1&&o!==null;(B.pointerId===o||j.size===0||Ut)&&nt(),!pt&&B.pointerId===b&&(!F&&!Ya(B.target)&&(I={x:B.clientX,y:B.clientY}),b=null)};for(const B of Ho){const it=document.getElementById(`btn-${B}`);if(!it)continue;const pt=B==="attack"||B==="skill2",Ut=N=>{if(N.preventDefault(),Rt[B]===void 0){Rt[B]=N.pointerId,Ht[B]=!0,B==="jump"&&(Lt.jump=!0),B==="reset"&&(Lt.reset=!0),B==="sprint"&&(Lt.sprintPressed=!0),B==="attack"&&(Lt.attackPressed=!0),B==="skill2"&&(Lt.skill2=!0),it.classList.add("is-down"),ht(dt.begin(B,N.pointerId,N.clientX,N.clientY,performance.now()));try{it.setPointerCapture(N.pointerId)}catch{}pt&&(z=N.pointerId,C=N.clientX,D=N.clientY,Q=!(N.clientX===0&&N.clientY===0),X=0,H=0,Z=!1,mt=-1)}},Nt=N=>{Rt[B]===N.pointerId&&(Rt[B]=void 0,$(B),ht(dt.end(N.pointerId,N.clientX,N.clientY,performance.now())))},Gt=N=>{Rt[B]===N.pointerId&&(Rt[B]=void 0,$(B),ht(dt.cancel(N.pointerId,performance.now())))};it.addEventListener("pointerdown",Ut),it.addEventListener("pointerup",Nt),it.addEventListener("pointercancel",Gt),zt.push(()=>{it.removeEventListener("pointerdown",Ut),it.removeEventListener("pointerup",Nt),it.removeEventListener("pointercancel",Gt)})}const lt=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const B of lt){const it=pt=>{pt.preventDefault(),G=Number(B.dataset.weapon)||0};B.addEventListener("pointerdown",it),zt.push(()=>B.removeEventListener("pointerdown",it))}const Ot=B=>{const it=B.key.toLowerCase();if((it===" "||it.startsWith("arrow"))&&B.preventDefault(),Dt.has(it))return;Dt.add(it),it===" "&&(Lt.jump=!0),it==="r"&&(Lt.reset=!0),it==="shift"&&(Lt.sprintPressed=!0),it==="j"&&(Lt.attackPressed=!0),it==="k"&&(Lt.skill2=!0),it>="1"&&it<="5"&&(G=Number(it)),it>="6"&&it<="9"&&(jt=Number(it)-5);const pt=Math.max(hm,s().keyStep||1.12);(it==="="||it==="+")&&(Ct*=pt),(it==="-"||it==="_")&&(Ct/=pt)},J=B=>{const it=B.key.toLowerCase();Dt.has(it)&&(Dt.delete(it),it==="j"&&(Lt.attackReleased=!0))},vt=B=>{if(Ya(B.target))return;B.preventDefault();const it=B.deltaMode===1?B.deltaY*cm:B.deltaMode===2?B.deltaY*lm:B.deltaY;Ct*=im(it,s().wheelStep)},$t=B=>{B.preventDefault()},ot=()=>{u=performance.now()};window.addEventListener("resize",ot),window.addEventListener("orientationchange",ot);const _t=typeof window<"u"?window.visualViewport:null;return _t&&(_t.addEventListener("resize",ot),_t.addEventListener("scroll",ot)),window.addEventListener("pointerdown",L),window.addEventListener("pointermove",E),window.addEventListener("pointerup",at),window.addEventListener("pointercancel",at),window.addEventListener("blur",It),document.addEventListener("visibilitychange",Pt),window.addEventListener("keydown",Ot),window.addEventListener("keyup",J),window.addEventListener("wheel",vt,{passive:!1}),window.addEventListener("gesturestart",$t),{peekStick(){return{id:o,held:o!==null,originX:r,originY:l,x:f,y:d,dx:f-r,dy:d-l,radius:a(),badMoves:p,screenOk:P,originSX:m,originSY:x,screenX:y,screenY:v,scale:w}},peekAim(){const B=performance.now(),it=Math.hypot(X,H),pt=z!==null||mt>=0&&B-mt<ql;if(!(pt&&Z&&it>=Go))return{active:!1,holding:pt,x:0,z:0,dx:X,dy:H};const Nt=i(),Gt=X/it,N=H/it,St=Nt.rightX*Gt+Nt.forwardX*-N,q=Nt.rightZ*Gt+Nt.forwardZ*-N,ct=Math.hypot(St,q)||1;return{active:!0,holding:pt,x:St/ct,z:q/ct,dx:X,dy:H}},sample(){var Jt;const B=a();let it=o!==null?Math.max(-1,Math.min(1,c/B)):0,pt=o!==null?Math.max(-1,Math.min(1,h/B)):0,Ut=0,Nt=0;(Dt.has("a")||Dt.has("arrowleft"))&&(Ut-=1),(Dt.has("d")||Dt.has("arrowright"))&&(Ut+=1),(Dt.has("w")||Dt.has("arrowup"))&&(Nt-=1),(Dt.has("s")||Dt.has("arrowdown"))&&(Nt+=1),it+=Ut,pt+=Nt;let Gt=Math.hypot(it,pt);Gt>1&&(it/=Gt,pt/=Gt,Gt=1);const N=it,St=pt;Gt<e&&(it=0,pt=0);const q=i();let ct=q.rightX*it+q.forwardX*-pt,yt=q.rightZ*it+q.forwardZ*-pt;const Et=Math.hypot(ct,yt);Et>1&&(ct/=Et,yt/=Et);const Xt=performance.now();ht(dt.poll(Xt));const Kt=Math.hypot(X,H);z!==null&&(Kt>=om?Z=!0:Kt<Go&&(Z=!1));const oe=z!==null||mt>=0&&Xt-mt<ql,Qt=oe&&Z&&Kt>=Go;let ie=0,ye=0;if(Qt){const Yt=X/Kt,se=H/Kt,ue=q.rightX*Yt+q.forwardX*-se,Me=q.rightZ*Yt+q.forwardZ*-se,Oe=Math.hypot(ue,Me)||1;ie=ue/Oe,ye=Me/Oe}!oe&&z===null&&(X=0,H=0,mt=-1,Z=!1);const Ge=I;I=null;const ze=Ct;Ct=1;const Y={moveX:ct,moveZ:yt,jumpPressed:Lt.jump,sprintHeld:Ht.sprint||Dt.has("shift"),sprintPressed:Lt.sprintPressed,resetPressed:Lt.reset,attackPressed:Lt.attackPressed,attackHeld:Ht.attack||Dt.has("j"),attackReleased:Lt.attackReleased,skill2Pressed:Lt.skill2,weaponSlot:G,dummyClickId:jt,aimX:ie,aimZ:ye,aimActive:Qt};Lt.jump=!1,Lt.reset=!1,Lt.sprintPressed=!1,Lt.attackPressed=!1,Lt.attackReleased=!1,Lt.skill2=!1,G=0,jt=0;const bt=ut.map(Yt=>Kp(Yt,q,Zl));ut=[],bt.length>0&&(K=bt[bt.length-1]);const wt=o!==null?"pointer":Dt.size>0?"keyboard":"idle";return{intents:Y,stickX:it,stickY:pt,stickRawX:N,stickRawY:St,stickHeld:o!==null,stickId:o,stickOriginX:r,stickOriginY:l,stickPxX:f,stickPxY:d,stickBad:p,stickScreenOk:P,stickOriginSX:m,stickOriginSY:x,stickScreenX:y,stickScreenY:v,stickScale:w,stickVpTop:((Jt=sm())==null?void 0:Jt.top)??0,stickVpAge:u<0?-1:Math.round(performance.now()-u),aimDX:X,aimDY:H,source:wt,tap:Ge,zoomScale:ze,gestures:bt,lastGesture:K}},dispose(){window.removeEventListener("pointerdown",L),window.removeEventListener("pointermove",E),window.removeEventListener("pointerup",at),window.removeEventListener("pointercancel",at),window.removeEventListener("blur",It),document.removeEventListener("visibilitychange",Pt),window.removeEventListener("keydown",Ot),window.removeEventListener("keyup",J),window.removeEventListener("wheel",vt),window.removeEventListener("resize",ot),window.removeEventListener("orientationchange",ot),_t&&(_t.removeEventListener("resize",ot),_t.removeEventListener("scroll",ot)),window.removeEventListener("gesturestart",$t),dt.reset();for(const B of zt)B()}}}const oo=1,ro=2,co=4,$d=8,lo=16,Gs=32,Yd=64,Zd=128,fm=[[oo,"atk"],[ro,"dash"],[co,"link"],[$d,"air"],[lo,"hurt"],[Gs,"aim"],[Yd,"spr"],[Zd,"chan"]];function Hi(n){if(n===0)return"-";const t=fm.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const pm=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],mm=0,gm=15,Vo=19,xm=21,vm=22,_m=23,ym=24,Pn={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},tn=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,yn=n=>Math.round(n*180/Math.PI*10)/10,Xo=Math.PI*2;function Ps(n){let t=n%Xo;return t>Math.PI&&(t-=Xo),t<-Math.PI&&(t+=Xo),t}function Mm(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=oo),n.dash.phase!=="idle"&&(e|=ro),n.playerLink.phase!=="idle"&&(e|=co),n.character.grounded||(e|=$d),n.playerHurt.type!=="none"&&(e|=lo),t.intents.aimActive&&(e|=Gs),n.character.sprinting&&(e|=Yd),n.abilities.channeling&&(e|=Zd),e}function Sm(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function bm(n){const t={sampleHz:n.sampleHz??Pn.sampleHz,sampleCapacity:n.sampleCapacity??Pn.sampleCapacity,eventCapacity:n.eventCapacity??Pn.eventCapacity,anomalyCapacity:n.anomalyCapacity??Pn.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??Pn.dirJumpDeg,aimDropDeg:n.aimDropDeg??Pn.aimDropDeg,freezeMs:n.freezeMs??Pn.freezeMs,freezeSpeed:n.freezeSpeed??Pn.freezeSpeed,stickLostMs:n.stickLostMs??Pn.stickLostMs,spikeMs:n.spikeMs??Pn.spikeMs},e=n.meta,i=[],s=[],a=[],o={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let r=!0,l=-1,c=-1e9,h=null,f=0,d=0,u="",p=-1,_=-1,g=-1,m=0,x=-1e9,y=-1,v={},P=null,S=0,w=0,T=0,b=0;function M(C,D){const X=1/t.sampleHz,H=C[mm];H-c<X-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(C),c=H)}function R(C,D,X,H,Z,Q){const mt=v[C]??-1e9;if(D-mt<1.2)return;if(v[C]=D,C==="frameSpike"){let ut=0;for(const K of a)K.kind==="frameSpike"&&ut++;if(ut>=6)return}a.length>=t.anomalyCapacity&&a.shift();let dt=i.slice(-7);Q&&(dt.length===0||dt[dt.length-1]!==Q)&&(dt=[...dt.slice(-6),Q]),a.push({kind:C,t:tn(D),tick:X,ms:Math.round(H),detail:Z,ctx:dt}),C==="dirJump"?o.dirJumps++:C==="aimDrop"?o.aimDrops++:C==="moveFreeze"?o.freezes++:C==="stickLost"?o.stickLosts++:C==="stickJump"?o.stickJumps++:C==="stickBad"?o.stickBads++:C==="stickDrift"&&o.stickDrifts++}function F(C,D,X,H){s.length>=t.eventCapacity&&s.shift(),s.push({t:tn(X),tick:H,k:C,d:D})}function I(C){switch(C.type){case"attack-start":o.attacks++;break;case"hit":o.hits++;break;case"player-hurt":o.hurts++;break;case"link-start":o.links++;break;case"link-hit":o.linkHits++;break;case"roll":o.rolls++;break;case"blink":o.blinks++;break;case"channel-start":o.channels++;break;case"projectile-fire":o.bolts++;break;case"ring-place":o.rings++;break;case"charge-start":o.bowCharges++;break;case"jumped":o.jumps++;break;case"reset":o.resets++;break;case"blocked":x=C.tick;break}}function z(){const C=o,D=C.wallMs/1e3,X=C.gestures,H=dt=>Object.entries(X).filter(([ut])=>ut.endsWith(`.${dt}`)).reduce((ut,[,K])=>ut+K,0),Z=[];if(Z.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),Z.push(`运行 ${D.toFixed(1)}s / ${C.frames} 帧 · ${C.fps.toFixed(1)}fps · 最大 ${C.dtMax.toFixed(0)}ms · 尖峰 ${C.spikes} · 步 ${C.steps}`),Z.push(`摇杆活跃 ${D>0?Math.round(C.stickActiveMs/1e3/D*100):0}% · 手势 按下 ${H("press")}（单击 ${H("tap")} / 双击 ${H("doubleTap")} / 拖拽 ${H("drag")} / 长按 ${H("longPress")} / 打断 ${H("cancel")} / 拖放 ${H("release")}）`),Z.push(`攻击 ${C.attacks}(中${C.hits}) · 受击 ${C.hurts} · 派生 ${C.links}(中${C.linkHits}) · 翻滚 ${C.rolls} 闪现 ${C.blinks} · 跳 ${C.jumps} · 复位 ${C.resets}`),Z.push(`法杖 引导${C.channels} 飞弹${C.bolts} 电环${C.rings} · 弓蓄力${C.bowCharges} · 当前武器 ${u||"-"}`),Z.push(`异常 ${C.dirJumps+C.aimDrops+C.freezes+C.stickLosts+C.stickJumps+C.stickBads+C.stickDrifts}（dir ${C.dirJumps} / aim ${C.aimDrops} / freeze ${C.freezes} / stick ${C.stickLosts} / stickJump ${C.stickJumps} / 坏指针 ${C.stickBads} / 坐标漂移 ${C.stickDrifts}） · 掉帧尖峰 ${C.spikes}`+(C.inTurns>0?` · 输入转向 ${C.inTurns} 次（最大 ${C.inTurnMax.toFixed(0)}°）`:"")),a.length>0)for(const dt of a.slice(-6)){Z.push(`· ${dt.kind} @t${dt.t.toFixed(2)} tick${dt.tick} ${dt.ms>0?`${dt.ms}ms `:""}${dt.detail}`);const ut=dt.ctx.map(tt=>String(tt[gm])).join(" "),K=dt.ctx.map(tt=>tt[Vo]===""||tt[Vo]==null?".":String(tt[Vo])).join(" ");if(Z.push(`  yaw ${ut}`),Z.push(`  in  ${K}`),dt.kind==="stickJump"||dt.kind==="stickBad"||dt.kind==="stickLost"){const tt=dt.ctx.map(j=>`${j[xm]},${j[vm]}`).join(" "),ht=dt.ctx.map(j=>`${j[_m]},${j[ym]}`).join(" ");Z.push(`  o   ${tt}`),Z.push(`  p   ${ht}`)}}if(s.length>0){Z.push("最近事件：");for(const dt of s.slice(-12))Z.push(`  ${dt.t.toFixed(2)} ${dt.k} ${dt.d}`.trimEnd())}const Q=o.screenFrames>0?`屏幕 screenX/Y（${o.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",mt=o.screenFrames>0&&o.clientFrames>0?` / client 回退 ${o.clientFrames} 帧`:"";return Z.push(`摇杆坐标源 ${Q}${mt}`),Z.push(`UA ${e.ua}`),Z.join(`
`)}return{sample(C,D,X,H=0){o.frames++,D.stickHeld&&(D.stickScreenOk?o.screenFrames++:o.clientFrames++),o.steps+=H,o.wallMs+=X,X>o.dtMax&&(o.dtMax=X),o.fps=o.wallMs>0?o.frames*1e3/o.wallMs:0,o.simS=C.time;const Z=C.time;if(l<0&&(l=Z),T=Z,b=C.tick,!r)return;const Q=C.character,mt=Math.hypot(D.stickX,D.stickY),dt=Math.hypot(Q.velocity.x,Q.velocity.z);u=C.combat.weapon;const ut=Mm(C,D),K=Q.facing,ht=Math.hypot(D.intents.moveX,D.intents.moveZ)>.05?Math.atan2(D.intents.moveX,D.intents.moveZ):null;mt>.2&&(o.stickActiveMs+=X);const j=[tn(Z),C.tick,Math.round(X*10)/10,tn(D.stickX),tn(D.stickY),tn(D.stickRawX),tn(D.stickRawY),D.stickHeld?1:0,D.source.slice(0,8),tn(D.intents.moveX),tn(D.intents.moveZ),tn(Q.position.x),tn(Q.position.z),tn(Q.velocity.x),tn(Q.velocity.z),yn(K),yn(Q.bodyYaw),ut,tn(Q.stride),ht===null?"":yn(ht),D.stickId===null?"":D.stickId,Math.round(D.stickOriginX),Math.round(D.stickOriginY),Math.round(D.stickPxX),Math.round(D.stickPxY),D.stickBad,Math.round(D.stickVpTop),Math.round(D.stickOriginSX),Math.round(D.stickOriginSY),Math.round(D.stickScreenX),Math.round(D.stickScreenY),D.stickScreenOk?1:0,Math.round(D.stickScale*100)/100];M(j);const Mt=Z*1e3<y;if(X>t.spikeMs&&!Mt&&Z-l>.6&&(o.spikes++,R("frameSpike",Z,C.tick,X,`dt ${X.toFixed(0)}ms fl=${Hi(ut)}`,j)),h!==null&&!Mt){const It=Math.abs(yn(Ps(K-h))),Pt=Math.abs(yn(Ps(Q.moveYaw-f))),L=(d|ut)&(oo|ro|co|lo)|ut&Gs,E=ht===null?null:Math.abs(yn(Ps(K-ht))),$=ht===null||h===null?null:Math.abs(yn(Ps(h-ht))),nt=E!==null&&$!==null&&E<$-.5,at=(d&Gs)!==0&&(ut&Gs)===0&&ht===null,lt=E!==null&&(E<=12||nt);It>t.aimDropDeg&&at?R("aimDrop",Z,C.tick,0,`${It.toFixed(0)}° @aim→none stick(${D.stickX.toFixed(2)},${D.stickY.toFixed(2)}) aim(${D.aimDX.toFixed(0)},${D.aimDY.toFixed(0)}) fl=${Hi(ut)}`,j):It>t.dirJumpDeg&&L===0&&!at&&(lt?(o.inTurns++,It>o.inTurnMax&&(o.inTurnMax=It)):R("dirJump",Z,C.tick,0,`${It.toFixed(0)}° res${E===null?" 无输入":`${E.toFixed(0)}°`} yaw ${yn(h)}→${yn(K)} in ${ht===null?".":yn(ht)}° mvΔ${Pt.toFixed(0)}° aim(${D.aimDX.toFixed(0)},${D.aimDY.toFixed(0)}) fl=${Hi(d)}→${Hi(ut)}`,j))}const kt=(ut&(oo|ro|co|lo))!==0,Ct=C.tick-x<30;mt>.35&&dt<t.freezeSpeed&&!kt&&!Ct?(p<0&&(p=Z),Z-p>=t.freezeMs/1e3&&Z>=_&&(R("moveFreeze",Z,C.tick,(Z-p)*1e3,`stick(${D.stickX.toFixed(2)},${D.stickY.toFixed(2)}) v${dt.toFixed(2)} ${D.source} fl=${Hi(ut)}`,j),_=Z+1.5,p=-1)):p=-1,D.stickHeld?(mt>m&&(m=mt),m>.35&&mt<.06?(g<0&&(g=Z),Z-g>=t.stickLostMs/1e3&&(R("stickLost",Z,C.tick,(Z-g)*1e3,`raw(${D.stickRawX.toFixed(2)},${D.stickRawY.toFixed(2)}) peak ${m.toFixed(2)} fl=${Hi(ut)}`,j),g=-1,m=0)):g=-1):(m=0,g=-1);const Tt=D.stickScale>.2&&D.stickScale<5?D.stickScale:1,Ht=D.stickScreenOk,Lt=Ht?D.stickScreenX/Tt:D.stickPxX,G=Ht?D.stickScreenY/Tt:D.stickPxY,jt=Ht?D.stickOriginSX/Tt:D.stickOriginX,Rt=Ht?D.stickOriginSY/Tt:D.stickOriginY,Dt=Lt-jt,zt=G-Rt;if(D.stickHeld&&D.stickId!==null){const It=P;if(It&&It.held&&It.id===D.stickId){const Pt=Math.hypot(It.dx,It.dy),L=Math.hypot(Dt,zt),E=Math.max(Pt,L),$=Math.hypot(Lt-It.cx,G-It.cy),nt=Math.abs(yn(Ps(Math.atan2(zt,Dt)-Math.atan2(It.dy,It.dx)))),at=E*nt*Math.PI/180,lt=Math.hypot(jt-It.ox,Rt-It.oy);if(E>18&&nt>35&&$<Math.max(5,at*.35)&&R("stickJump",Z,C.tick,0,`Δ${nt.toFixed(0)}° 手指只动${$.toFixed(0)}px(弧长应${at.toFixed(0)}px) o(${Math.round(It.ox)},${Math.round(It.oy)})→(${Math.round(jt)},${Math.round(Rt)}) 原点位移${lt.toFixed(0)}px p(${Math.round(Lt)},${Math.round(G)}) raw(${Math.round(Dt)},${Math.round(zt)}) id${D.stickId} ${Ht?"src=屏幕":"src=client"}`,j),Ht&&It.screenOk){const Ot=Math.hypot(D.stickPxX-It.x,D.stickPxY-It.y),J=Math.hypot((D.stickScreenX-It.sx)/Tt,(D.stickScreenY-It.sy)/Tt);S+=Ot-J,Math.abs(S)>20&&(R("stickDrift",Z,C.tick,0,`client 相对屏幕漂移 ${S>0?"+":""}${S.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(D.stickPxX)},${Math.round(D.stickPxY)}) screen(${Math.round(D.stickScreenX)},${Math.round(D.stickScreenY)})`,j),S=0)}}P={id:D.stickId,ox:jt,oy:Rt,cx:Lt,cy:G,x:D.stickPxX,y:D.stickPxY,sx:D.stickScreenX,sy:D.stickScreenY,dx:Dt,dy:zt,held:!0,screenOk:Ht}}else P=null,S=0;if(D.stickBad>w){const It=D.stickBad-w;R("stickBad",Z,C.tick,0,`拦截 ${It} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${D.stickBad}）o(${Math.round(D.stickOriginX)},${Math.round(D.stickOriginY)}) p(${Math.round(D.stickPxX)},${Math.round(D.stickPxY)}) id${D.stickId??"-"}`,j)}w=D.stickBad,h=K,f=Q.moveYaw,d=ut},event(C,D){const X=Sm(C);I(C),r&&(C.type==="dash-ready"||C.type==="combo-reset"||C.type==="stepUp"||F(C.type,X,D,C.tick))},gesture(C){const D=`${C.button}.${C.kind}`;o.gestures[D]=(o.gestures[D]??0)+1,r&&(C.kind==="longPress"||C.kind==="doubleTap"||C.kind==="drag"||C.kind==="cancel")&&F(`g:${C.kind}`,`${C.button} ${C.heldMs.toFixed(0)}ms d${C.distance.toFixed(0)}px ${C.angleDeg.toFixed(0)}°`,T,b)},suspend(C){y=T*1e3+C,p=-1,g=-1},setEnabled(C){r=C,C||(h=null,P=null,p=-1,g=-1)},clear(){i.length=0,s.length=0,a.length=0,v={},c=-1e9,h=null,d=0,p=-1,g=-1,m=0,o.frames=0,o.wallMs=0,o.dtMax=0,o.spikes=0,o.stickActiveMs=0,o.attacks=0,o.hits=0,o.hurts=0,o.links=0,o.linkHits=0,o.rolls=0,o.blinks=0,o.channels=0,o.bolts=0,o.rings=0,o.bowCharges=0,o.jumps=0,o.resets=0,o.dirJumps=0,o.aimDrops=0,o.inTurns=0,o.inTurnMax=0,o.freezes=0,o.stickLosts=0,o.stickJumps=0,o.stickBads=0,o.stickDrifts=0,o.screenFrames=0,o.clientFrames=0,S=0,P=null,w=0;for(const C of Object.keys(o.gestures))delete o.gestures[C]},status(){const C=o.simS,D=a.some(X=>C-X.t<8&&(X.kind==="dirJump"||X.kind==="aimDrop"||X.kind==="moveFreeze"||X.kind==="stickLost"||X.kind==="stickJump"||X.kind==="stickBad"||X.kind==="stickDrift"));return{durationS:o.wallMs/1e3,frames:o.frames,events:s.length,anomalies:a.length,alert:D,enabled:r}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...o,gestures:{...o.gestures}},columns:pm,samples:i.slice(),events:s.slice(),anomalies:a.slice()}},summary:z}}const Em={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:0},worldBounds:{minX:-15.5,maxX:15.5,minZ:-15.5,maxZ:15.5},orientation:{bodyTurnRate:7,headTurnRate:12,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},turnInPlace:{enabled:!0,triggerDeg:50,settleDeg:8,durationSec:.45,idleSpeedRatio:.05,inputDeadZone:.12,lookRange:0,armSec:.03,gazeTriggerDeg:120},combat:{comboWindow:.65,settle:.16,attackMoveScale:0,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:.85,minChargeToFire:.15,chargeMoveMultiplier:.55,autoFire:!0,release:{windup:.04,active:.12,recovery:.26,lunge:.12},trajectory:{speedMin:9,speedMax:16,launchPitchDeg:3.5,gravity:9,maxLife:2.4,radius:.2,stickMinPitchDeg:50,groundStickLift:.32,stickSec:4,homingRange:14,homingConeDeg:30,turnRateDeg:90,homingTime:.9,aimHeightRatio:.7,verticalTurnRate:18}}},abilities:{arcane:{perWave:3,waves:5,waveInterval:.2,spreadDeg:8,spreadTime:.22,spawnDelay:.035,spawnSideStep:.2,speedJitter:.12,homingRange:8,homingConeDeg:40,turnRateDeg:300,homingTime:1.1,retargetInterval:.25,cooldown:1,speed:10,life:1.4,radius:.3,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.6},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},skills:[{id:"arcane",kind:"channelVolley",slot:"attack",weapon:"staff",paramsRef:"arcane",enabled:!0},{id:"ring",kind:"groundRing",slot:"skill2",weapon:"staff",paramsRef:"ring",enabled:!0}],targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!0,dummyKnockback:.18},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},gaze:{enabled:!0,headLookLimitDeg:55,headGazeRange:7,threatRange:8,recoveryDist:3.5,maxThreats:3,bodyTurnRate:3.2,headTurnRate:8,maxHeadSpeedDeg:300,maxBodySpeedDeg:130,headReturnRate:3.5,headReturnSpeedDeg:120,aimHeightRatio:.75,eyeHeightRatio:.78,headPitchRate:7,maxHeadPitchDeg:28,bodyPitchScale:.3,bodyPitchRate:4,enterThreshold:.05,reactToAttack:!0,reactToApproach:!0,approachDist:2.5,hurtHoldSec:2,hostileModeWeight:.6,spreadFalloff:1.5,behindFalloff:.35,behindAngleDeg:100,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,nearDistance:1.5,saturation:2.6},dummies:{count:6,spawn:[{x:-11.1,z:-8.35},{x:-9.5,z:-8.35},{x:-7.9,z:-8.35},{x:0,z:-10.2},{x:-9.5,z:0},{x:-9.5,z:7.2}],initialModes:["idle","keep-distance","attack","attack","follow","idle"],leashRadius:2.4,radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4}},wm={ground:{size:32,thickness:.4},steps:[{id:"stair-1",x:6.6,z:-5.6,width:2.4,depth:.9,height:.2},{id:"stair-2",x:6.6,z:-6.5,width:2.4,depth:.9,height:.4},{id:"stair-3",x:6.6,z:-7.4,width:2.4,depth:.9,height:.6},{id:"stair-4",x:6.6,z:-8.3,width:2.4,depth:.9,height:.8},{id:"plateau",x:6.6,z:-9.6,width:2.4,depth:1.6,height:.8},{id:"block-060",x:11.4,z:-6,width:1.4,depth:1.4,height:.6},{id:"block-090",x:11.4,z:-7.9,width:1.4,depth:1.4,height:.9},{id:"block-120",x:11.4,z:-9.8,width:1.4,depth:1.4,height:1.2}],doorways:[{id:"gate-wide",x:6.6,z:-4.3,openingWidth:2.4,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2},{id:"gate-narrow",x:11.4,z:-4.3,openingWidth:.5,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2}],obstacles:[{id:"crate-hub",x:2.5,z:-2.5,width:1.1,depth:1.1,height:.8},{id:"pillar-sw",x:-14.3,z:12.8,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-16,maxX:16,minZ:-16,maxZ:16},stations:[{id:"hub",index:1,name:"中央 8 向",hint:"推杆走 8 个方向 · 松手看停步收相 / 转身踏步",shape:"circle",x:0,z:0,radius:3.6,spawnX:0,spawnZ:0,labelX:0,labelZ:-3.1,color:"#8fe7ff"},{id:"rings",index:2,name:"环状态色阶",hint:"同距三假人：中立蓝 / 戒备黄 / 敌对红 · 点选看 3/4 环",shape:"circle",x:-9.5,z:-8.2,radius:3.4,spawnX:-9.5,spawnZ:-5.2,labelX:-9.5,labelZ:-10.9,color:"#ffc85a"},{id:"windup",index:3,name:"起手预警",hint:"走进 1.6m：脚下红弧填满 = 命中帧",shape:"circle",x:0,z:-10,radius:3.2,spawnX:0,spawnZ:-7,labelX:0,labelZ:-12.6,color:"#ff5a4a"},{id:"terrain",index:4,name:"地形 / 门洞",hint:"宽门 2.4m / 窄门 0.5m · 0.2m 台阶可走，0.6/0.9/1.2m 要跳",shape:"square",x:8.9,z:-7.4,radius:5.2,spawnX:8.9,spawnZ:-2.8,labelX:8.9,labelZ:-11.9,color:"#7fb8d8"},{id:"meter",index:5,name:"进度弧",hint:"弓长按 = 黄弧 · 法杖技2 = 紫弧 · 冲刺后 = 青弧冷却",shape:"circle",x:-9.5,z:8.6,radius:3.2,spawnX:-9.5,spawnZ:11.4,labelX:-9.5,labelZ:9.9,color:"#b48cff"},{id:"dash",index:6,name:"冲刺标尺",hint:"沿刻度跑：翻滚 3.2m / 闪现 5m，看落点差多少",shape:"square",x:9.8,z:8.2,radius:5.2,spawnX:9.8,spawnZ:12.8,labelX:7,labelZ:4.2,color:"#bfe8ff"},{id:"gait",index:7,name:"侧后方步态",hint:"面向假人贴到 1.2m，沿引线按 90 / 135 / 180 走",shape:"circle",x:-9.5,z:0,radius:3.2,spawnX:-9.5,spawnZ:2.6,labelX:-9.5,labelZ:-2.5,color:"#6fc9a0"}]},Tm={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:28,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.36},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.6,chestYawMaxDeg:40,stopYawBlendMode:"inStop",stopYawAfterSec:.3,turnStepEnabled:!0,turnStepPitch:.5,turnStepKnee:.35,turnStepDip:.02,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1,backStrafeStartDeg:100,backStrafeFullDeg:132},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},groundRing:{playerRadiusFactor:2.3,dummyRadiusFactor:2.05,thicknessFactor:.16,arcDeg:180,selectedArcDeg:270,opacity:.22,playerOpacity:.44,selectedOpacity:.62,selectedScale:1.06,selectedThicknessScale:1.6,edgeFade:.2,playerColor:"#8fe7ff",neutralColor:"#7fb8d8",lowThreatColor:"#ffc85a",highThreatColor:"#ff3b30",haloRadiusFactor:1.16,haloThicknessFactor:2.6,haloOpacity:.14,haloFadeInSec:.05,haloFadeOutSec:.36,meterRadiusFactor:1.34,meterThicknessFactor:.52,meterOpacity:.9,meterColorCharge:"#ffd166",meterColorChannel:"#b48cff",meterColorCooldown:"#7fb8d8",warnRadiusFactor:1.14,warnThicknessFactor:1.5,warnOpacity:.9,warnColor:"#ff5a4a",areaOpacity:.5,landingOpacity:.55,areaExpandSec:.22},projectiles:{arrowColor:"#ffe3a6",arrowHeadColor:"#fff6d8",arrowTrailColor:"#ffcf86",arrowLength:.72,arrowWidth:.062,arrowHeadSize:.16,arrowGlowSize:.5,trailLength:1.05,trailOpacity:.42,boltColor:"#a9ecff",boltGlowColor:"#7fe3ff",boltShapeX:.42,boltShapeY:.42,boltShapeZ:.85,boltGlowScale:1.6,boltTrailScale:2.2,slashThickness:.075,slashGlowOpacity:.34},lab:{enabled:!0,showLabels:!0,padOpacity:.55,labelTextHeight:.82},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],attackArcColor:"#ff6b5e"}},Am={core:Em,scene:wm,view:Tm};function Wc(n){return JSON.parse(JSON.stringify(n))}const $c=Am,Rm=Wc($c.core),ua=Wc($c.scene),on=Wc($c.view);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class Un{constructor(t,e,i,s,a="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(a),this.domElement.classList.add("controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("name"),Un.nextNameID=Un.nextNameID||0,this.$name.id=`lil-gui-name-${++Un.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class Cm extends Un{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function Vr(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const Pm={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:Vr,toHexString:Vr},js={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},Dm={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=js.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const s=n*i<<16^t*i<<8^e*i<<0;return js.toHexString(s)}},Lm={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=js.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const s=n*i<<16^t*i<<8^e*i<<0;return js.toHexString(s)}},Im=[Pm,js,Dm,Lm];function km(n){return Im.find(t=>t.match(n))}class Um extends Un{constructor(t,e,i,s){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=km(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const a=Vr(this.$text.value);a&&this._setValueFromHexString(a)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class Wo extends Un{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class Fm extends Un{constructor(t,e,i,s,a,o){super(t,e,i,"number"),this._initInput(),this.min(s),this.max(a);const r=o!==void 0;this.step(r?o:this._getImplicitStep(),r),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let x=parseFloat(this.$input.value);isNaN(x)||(this._stepExplicit&&(x=this._snap(x)),this.setValue(this._clamp(x)))},i=x=>{const y=parseFloat(this.$input.value);isNaN(y)||(this._snapClampSetValue(y+x),this.$input.value=this.getValue())},s=x=>{x.key==="Enter"&&this.$input.blur(),x.code==="ArrowUp"&&(x.preventDefault(),i(this._step*this._arrowKeyMultiplier(x))),x.code==="ArrowDown"&&(x.preventDefault(),i(this._step*this._arrowKeyMultiplier(x)*-1))},a=x=>{this._inputFocused&&(x.preventDefault(),i(this._step*this._normalizeMouseWheel(x)))};let o=!1,r,l,c,h,f;const d=5,u=x=>{r=x.clientX,l=c=x.clientY,o=!0,h=this.getValue(),f=0,window.addEventListener("mousemove",p),window.addEventListener("mouseup",_)},p=x=>{if(o){const y=x.clientX-r,v=x.clientY-l;Math.abs(v)>d?(x.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(y)>d&&_()}if(!o){const y=x.clientY-c;f-=y*this._step*this._arrowKeyMultiplier(x),h+f>this._max?f=this._max-h:h+f<this._min&&(f=this._min-h),this._snapClampSetValue(h+f)}c=x.clientY},_=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",p),window.removeEventListener("mouseup",_)},g=()=>{this._inputFocused=!0},m=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",a,{passive:!1}),this.$input.addEventListener("mousedown",u),this.$input.addEventListener("focus",g),this.$input.addEventListener("blur",m)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(m,x,y,v,P)=>(m-x)/(y-x)*(P-v)+v,e=m=>{const x=this.$slider.getBoundingClientRect();let y=t(m,x.left,x.right,this._min,this._max);this._snapClampSetValue(y)},i=m=>{this._setDraggingStyle(!0),e(m.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",a)},s=m=>{e(m.clientX)},a=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",a)};let o=!1,r,l;const c=m=>{m.preventDefault(),this._setDraggingStyle(!0),e(m.touches[0].clientX),o=!1},h=m=>{m.touches.length>1||(this._hasScrollBar?(r=m.touches[0].clientX,l=m.touches[0].clientY,o=!0):c(m),window.addEventListener("touchmove",f,{passive:!1}),window.addEventListener("touchend",d))},f=m=>{if(o){const x=m.touches[0].clientX-r,y=m.touches[0].clientY-l;Math.abs(x)>Math.abs(y)?c(m):(window.removeEventListener("touchmove",f),window.removeEventListener("touchend",d))}else m.preventDefault(),e(m.touches[0].clientX)},d=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",f),window.removeEventListener("touchend",d)},u=this._callOnFinishChange.bind(this),p=400;let _;const g=m=>{if(Math.abs(m.deltaX)<Math.abs(m.deltaY)&&this._hasScrollBar)return;m.preventDefault();const y=this._normalizeMouseWheel(m)*this._step;this._snapClampSetValue(this.getValue()+y),this.$input.value=this.getValue(),clearTimeout(_),_=setTimeout(u,p)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",g,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class Nm extends Un{constructor(t,e,i,s){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class zm extends Un{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const Om=`.lil-gui {
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
}`;function Bm(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let jl=!1;class ho{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:s,title:a="Controls",closeFolders:o=!1,injectStyles:r=!0,touchStyles:l=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",c=>{(c.code==="Enter"||c.code==="Space")&&(c.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(a),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),l&&this.domElement.classList.add("allow-touch-styles"),!jl&&r&&(Bm(Om),jl=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=o}add(t,e,i,s,a){if(Object(i)===i)return new Nm(this,t,e,i);const o=t[e];switch(typeof o){case"number":return new Fm(this,t,e,i,s,a);case"boolean":return new Cm(this,t,e);case"string":return new zm(this,t,e);case"function":return new Wo(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,i=1){return new Um(this,t,e,i)}addFolder(t){const e=new ho({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof Wo||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof Wo)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=a=>{a.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function Hm(n,t,e,i){const s=document.getElementById("debug-panel"),a=s?new ho({title:"实验台 · 调试面板",autoPlace:!1,container:s}):new ho({title:"实验台 · 调试面板"}),o=n.config,r=[],l=[],c=$=>{const nt=a.addFolder($);return l.push(nt),nt},h=($,nt)=>{const at=$.addFolder(nt);return r.push(at),at},f=c("模拟 / 显示");f.add(e,"timeScale",0,3,.05).name("时间缩放"),f.add(e,"paused").name("暂停"),f.add({step:i.singleStep},"step").name("单步 (1 tick)"),f.add({reset:i.reset},"reset").name("复位全部"),f.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),f.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid),f.add(e,"showLab").name("工位地面盘").onChange(i.onToggleLab),f.add(e,"showLabLabels").name("工位标牌").onChange(i.onToggleLabLabels);const d=h(f,"模块开关");d.add(n.modules,"movement").name("movement"),d.add(n.modules,"combat").name("combat"),d.add(n.modules,"links").name("links"),d.add(n.modules,"orientation").name("orientation"),d.add(n.modules,"turnInPlace").name("turnInPlace"),d.add(n.modules,"targeting").name("targeting"),d.add(n.modules,"hits").name("hits"),d.add(n.modules,"separation").name("separation"),d.add(n.modules,"dash").name("dash"),d.add(n.modules,"camera").name("camera"),d.add(n.modules,"dummies").name("dummies"),d.add(n.modules,"abilities").name("abilities");const u=c("移动 / 输入"),p=h(u,"基础移动参数");p.add(o,"moveSpeed",1,10,.1).name("移动速度"),p.add(o,"sprintMultiplier",1,3,.05).name("冲刺倍率"),p.add(o,"acceleration",1,40,.5).name("加速度"),p.add(o,"friction",1,40,.5).name("摩擦"),p.add(o,"gravity",5,60,.5).name("重力"),p.add(o,"jumpSpeed",2,16,.2).name("起跳速度"),p.add(o,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),p.add(o,"characterRadius",.1,.8,.01).name("角色半径"),p.add(o,"characterHeight",.6,2.2,.05).name("角色身高"),p.add(o,"strideLength",.3,3,.05).name("基础步幅"),p.add(o,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),p.add(o,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const _=h(u,"摇杆 / 输入");_.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),_.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const g=o.dash,m=h(u,"冲刺 / 闪避");m.add(g,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),m.add(g,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),m.add(g,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),m.add(g,"blinkDistance",1,12,.25).name("闪现距离 (m)"),m.add(g,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),m.add(g,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),m.add(g,"blinkClearVelocity").name("闪现清空速度"),m.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),m.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const x=o.separation,y=h(u,"角色间分离 / 挤压阻力");y.add(x,"iterations",1,8,1).name("迭代次数"),y.add(x,"slop",0,.05,.002).name("额外分离量 (m)"),y.add(x.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),y.add(x.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),y.add(x.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const v=o.dummies,P=h(u,"假人 AI");P.add(v,"moveSpeed",.5,8,.1).name("移动速度"),P.add(v,"wanderRadius",.5,8,.1).name("游走半径"),P.add(v,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),P.add(v,"followStopDistance",.3,5,.1).name("跟随停距"),P.add(v,"keepDistance",1,10,.1).name("保持距离"),P.add(v,"keepDeadZone",.1,2,.05).name("保持死区"),P.add(v,"attackRange",.5,5,.1).name("攻击距离"),P.add(v,"attackInterval",.3,5,.1).name("攻击间隔 (s)"),P.add(v,"leashRadius",0,8,.1).name("牵引半径 (0=不限)");const S=c("步态 / 停步"),w=h(S,"程序化步态");w.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),w.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),w.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),w.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),w.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),w.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),w.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),w.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),w.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),w.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),w.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),w.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),w.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),w.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)"),w.add(t.gait,"backStrafeStartDeg",20,170,1).name("侧后方起步角 (°)"),w.add(t.gait,"backStrafeFullDeg",40,180,1).name("完全后退角 (°)");const T=h(S,"停步收相 / 胸朝向");T.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),T.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),T.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),T.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),T.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const b=h(S,"停步惯性");b.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),b.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),b.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),b.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),b.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),b.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),b.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),h(S,"击退步态").add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)");const R=h(S,"足部 IK"),F=t.ik;R.add(F,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),R.add(F,"weight",0,1,.01).name("钉地权重"),R.add(F,"attackScale",0,1,.01).name("攻击时权重倍率"),R.add(F,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const I=h(S,"惯性倾斜 / 盆骨"),z=t.lean;I.add(z,"accelGain",0,.1,.002).name("前后加速度增益"),I.add(z,"turnGain",0,.2,.005).name("绕圈侧倾增益"),I.add(z,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),I.add(z,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),I.add(z,"smoothing",1,30,1).name("倾斜平滑速率"),I.add(z,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),I.add(z,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),I.add(z,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),I.add(z,"crouchSmoothing",1,30,1).name("下沉平滑速率");const C=o.orientation,D=h(S,"朝向 / 下盘带转");D.add(C,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),D.add(C,"headTurnRate",.5,40,.5).name("头部转向速率"),D.add(C,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),D.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),D.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),D.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const X=o.gaze,H=h(S,"接敌注视 / 俯仰 (v9s.18)");H.add(X,"headReturnRate",.5,12,.1).name("无目标回正速率 (1/s)"),H.add(X,"headReturnSpeedDeg",20,400,10).name("回正角速度上限 (°/s)"),H.add(X,"bodyTurnRate",.2,12,.1).name("接敌身体转向速率"),H.add(X,"headTurnRate",.5,30,.5).name("接敌头部转向速率"),H.add(X,"maxHeadSpeedDeg",30,900,10).name("头部最大角速度 (°/s)"),H.add(X,"maxBodySpeedDeg",20,600,10).name("身体最大角速度 (°/s)"),H.add(X,"aimHeightRatio",.2,1,.05).name("注视点高度（身高比例）"),H.add(X,"headPitchRate",.5,20,.5).name("头部俯仰速率"),H.add(X,"maxHeadPitchDeg",0,60,1).name("头部俯仰限幅 (°)"),H.add(X,"bodyPitchScale",0,1,.05).name("身体俯仰比例"),H.add(X,"bodyPitchRate",.5,20,.5).name("身体俯仰速率");const Z=h(S,"原地转身 / 停步偏差 (v9s)"),Q=o.turnInPlace;Z.add(Q,"enabled").name("启用原地转身 (关=纯插值)"),Z.add(Q,"triggerDeg",20,180,5).name("触发夹角 (°)"),Z.add(Q,"gazeTriggerDeg",20,180,5).name("接敌时触发夹角 (°)"),Z.add(Q,"settleDeg",0,60,1).name("转身保留余角 (°)"),Z.add(Q,"durationSec",.1,1.5,.02).name("转身时长 (s)"),Z.add(Q,"idleSpeedRatio",0,.3,.01).name("静止速度比上限"),Z.add(Q,"inputDeadZone",0,.5,.01).name("起步输入死区"),Z.add(Q,"armSec",0,.5,.01).name("触发防抖 (s)"),Z.add(t.gait,"stopYawBlendMode",["inStop","afterStop"]).name("偏差消化窗口"),Z.add(t.gait,"stopYawAfterSec",.05,1,.02).name("收相后消化时长 (s)"),Z.add(t.gait,"turnStepEnabled").name("转身踏步 (关=滑过去)"),Z.add(t.gait,"turnStepPitch",0,1.2,.02).name("踏步前迈 (rad)"),Z.add(t.gait,"turnStepKnee",0,1,.02).name("踏步抬膝 (rad)"),Z.add(t.gait,"turnStepDip",0,.1,.002).name("踏步重心下沉 (m)");const mt=c("战斗 / 受击"),dt=o.combat,ut=h(mt,"连击 / 武器"),K=ut.add(n.combat,"weapon",Li).name("当前武器");ut.add(dt,"comboWindow",.1,2,.05).name("连击窗口 (s)"),ut.add(dt,"settle",0,.8,.01).name("段间停顿 (s)"),ut.add(dt,"attackMoveScale",0,1,.01).name("攻击时移动比例"),ut.add(dt,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),ut.add(dt,"cancelWindow",0,1,.01).name("取消窗口 (s)"),ut.add(dt,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),ut.add(dt,"autoCombo").name("按住自动连击"),ut.add(dt.bow,"maxChargeTime",.2,2,.05).name("满蓄力时间 (s)"),ut.add(dt.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),ut.add(dt.bow,"autoFire").name("蓄满自动放箭 (按住连射)"),ut.add(dt.bow.trajectory,"gravity",0,24,.5).name("箭矢重力 (m/s²)"),ut.add(dt.bow.trajectory,"speedMax",8,32,.5).name("满蓄初速 (m/s)"),ut.add(dt.bow.trajectory,"homingRange",0,30,1).name("自动瞄准距离 (m)"),ut.add(dt.bow.trajectory,"turnRateDeg",0,240,5).name("箭追踪转向 (°/s)"),ut.add(dt.bow.trajectory,"homingTime",0,2,.05).name("追踪时长 (s)"),ut.add(dt.bow.trajectory,"aimHeightRatio",0,1,.05).name("瞄准点高度"),ut.add(dt.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),ut.add(dt.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),ut.add(dt.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),ut.add(dt.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率");const tt=o.abilities;ut.add(tt.arcane,"perWave",1,8,1).name("每波飞弹数"),ut.add(tt.arcane,"waves",1,12,1).name("每次引导波数"),ut.add(tt.arcane,"waveInterval",.05,.8,.01).name("波间隔 (s)"),ut.add(tt.arcane,"spreadDeg",0,20,.5).name("波内散布 (度)"),ut.add(tt.arcane,"spreadTime",0,.6,.01).name("出膛散开时长 (s)"),ut.add(tt.arcane,"spawnDelay",0,.2,.005).name("波内出膛错落 (s)"),ut.add(tt.arcane,"speedJitter",0,.5,.02).name("速度浮动比例"),ut.add(tt.arcane,"turnRateDeg",0,420,10).name("制导转向 (度/秒)"),ut.add(tt.arcane,"retargetInterval",.05,1,.05).name("重新索敌间隔 (s)"),ut.add(tt.arcane,"cooldown",0,3,.05).name("引导结束冷却 (s)"),ut.add(tt.arcane,"speed",3,24,.5).name("飞弹速度"),ut.add(tt.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),ut.add(tt.ring,"radius",.5,5,.1).name("电环半径"),ut.add(tt.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),ut.add(tt.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const ht=h(mt,"攻击动作 / 跨步 / 落地");ht.add(t.animation.attack,"gaitWeight",0,1,.01).name("攻击时步态权重 gw"),ht.add(t.animation.attack,"lowerBodyWeight",0,1,.01).name("挥击跨步权重 lw"),ht.add(t.animation.attack,"blendRate",1,40,1).name("进出攻击平滑速率");const j=t.animation.stride;ht.add(j,"strideSpeed",0,8,.1).name("攻击等效步速 (m/s)"),ht.add(j,"strideScale",0,2.5,.05).name("攻击步幅系数 (0=旧)"),ht.add(j,"forwardBias",0,1,.01).name("前冲 / 侧跨占比"),ht.add(j,"cycles",1,3,1).name("每段跨步周期数"),ht.add(j,"stepPitch",0,1.5,.02).name("跨步腿前后摆 (rad)"),ht.add(j,"stepKnee",0,1.5,.02).name("跨步抬膝 (rad)"),ht.add(j,"stepSide",0,1,.02).name("跨步侧摆 (rad)"),ht.add(j,"stepDip",0,.3,.005).name("跨步重心下沉 (m)"),ht.add(j,"stepSway",0,.2,.005).name("跨步骨盆侧移 (m)"),ht.add(j,"stepReach",0,.3,.005).name("跨步骨盆前移 (m)"),ht.add(j,"stepSideReach",0,.25,.005).name("跨步骨盆侧移 (m)"),ht.add(j,"stepDipReach",0,.15,.005).name("跨步骨盆下沉 (m)"),ht.add(j,"heavyScale",0,1,.01).name("大剑重击收敛系数"),ht.add(t.animation.landing,"enabled").name("启用跳跃/落地缓冲"),ht.add(t.animation.landing,"duration",.05,1,.01).name("落地缓冲时长 (s)"),ht.add(t.animation.landing,"compressRatio",.05,.9,.01).name("下压段占比"),ht.add(t.animation.landing,"crouchDepth",0,.4,.005).name("重心下沉 (m)"),ht.add(t.animation.landing,"kneeBend",0,1.5,.02).name("屈膝 (rad)"),ht.add(t.animation.landing,"hipPitch",0,1,.02).name("髋前倾补偿 (rad)"),ht.add(t.animation.landing,"upperPitch",0,.6,.01).name("上半身前倾 (rad)"),ht.add(t.animation.landing,"armTuck",0,.8,.02).name("手臂收拢 (rad)"),ht.add(t.animation.landing,"impactSpeed",1,20,.5).name("冲击速度饱和 (m/s)"),ht.add(t.animation.landing,"minScale",0,1,.01).name("最小缓冲强度"),ht.add(t.animation.landing,"jumpAnticipation",0,1,.01).name("起跳预备下蹲"),ht.add(t.animation.landing,"anticipationDuration",.03,.5,.01).name("起跳预备时长 (s)");const Mt=h(mt,"武器握持");Mt.add(t.weaponMount,"swordPitchDeg",0,90,1).name("剑前倾角"),Mt.add(t.weaponMount,"swordYawDeg",0,45,1).name("剑外张角"),Mt.add(t.weaponMount,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),Mt.add(t.weaponMount,"staffPitchDeg",0,60,1).name("法杖前倾角");const kt=o.hits,Ct=h(mt,"命中 / 受击 / 击退");Ct.add(kt,"arcDeg",10,120,5).name("命中扇区半角 (°)"),Ct.add(kt,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),Ct.add(kt,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),Ct.add(kt,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),Ct.add(kt.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),Ct.add(kt.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),Ct.add(kt,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),Ct.add(kt,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const Tt=o.targeting,Ht=h(mt,"目标辅助");Ht.add(Tt,"targetAssist").name("启用目标辅助"),Ht.add(Tt,"range",1,14,.5).name("锁定范围 (m)"),Ht.add(Tt,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),Ht.add(Tt,"frontBias",0,4,.1).name("朝向加权"),Ht.add(Tt,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),Ht.add(Tt,"maxLungeScale",1,3,.1).name("前冲最大放大");const Lt=h(mt,"受击分层"),G=t.hurt;Lt.add(G,"enabled").name("启用分层受击 (关=旧版对照)"),Lt.add(G,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),Lt.add(G,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),Lt.add(G,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),Lt.add(G,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),Lt.add(G,"upperShiftScale",0,1,.01).name("上身位移缩放"),Lt.add(G,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),Lt.add(G.hitHeight,"light",0,1,.01).name("轻击命中部位"),Lt.add(G.hitHeight,"heavy",0,1,.01).name("重击命中部位"),Lt.add(G.hitHeight,"knock",0,1,.01).name("击退命中部位"),Lt.add(G,"leanLight",0,1.5,.01).name("轻击力度"),Lt.add(G,"leanHeavy",0,1.5,.01).name("重击力度"),Lt.add(G,"leanKnock",0,1.5,.01).name("击退力度"),Lt.add(G,"flashStrength",0,2,.05).name("受击闪光强度"),[{name:"打腹 (abdomen)",p:G.abdomen},{name:"打肩 (shoulder)",p:G.shoulder}].map(({name:$,p:nt})=>{const at=h(Lt,$);return at.add(nt,"upperPitch",0,2,.01).name("上身前后倾斜"),at.add(nt,"upperRoll",0,2,.01).name("上身侧倾"),at.add(nt,"upperYaw",0,1.5,.01).name("肩部扭转"),at.add(nt,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),at.add(nt,"shift",0,.8,.01).name("身体反应位移"),at.add(nt,"drop",0,.4,.01).name("整体下沉"),at.add(nt,"back",0,.4,.01).name("屁股向后"),at.add(nt,"knee",0,1.6,.01).name("屈膝"),at.add(nt,"hip",0,1,.01).name("髋前倾"),at.add(nt,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)"),at});const jt=h(mt,"派生招"),Rt=o.links;jt.add(Rt,"enabled").name("总开关 (false=旧连击)"),jt.add(Rt.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),jt.add(Rt.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),jt.add(Rt.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),jt.add(Rt,"sharedCooldown",0,3,.05).name("共享 CD (s)"),jt.add(Rt,"triggerWhileSprinting").name("长跑中可直接触发"),jt.add(Rt.search,"range",1,14,.1).name("索敌距离 (m)"),jt.add(Rt.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),jt.add(Rt.search,"stopDistance",0,3,.05).name("停住距离 (m)");const Dt=Rt.moves["sword-shield"];Dt&&(jt.add(Dt,"enabled").name("剑盾盾击"),jt.add(Dt,"distance",0,8,.1).name("冲锋极限 (m)"),jt.add(Dt,"windup",0,.5,.01).name("前摇 (s)"),jt.add(Dt,"active",0,.8,.01).name("冲锋 / 命中 (s)"),jt.add(Dt,"recovery",0,.8,.01).name("收势 (s)"),jt.add(Dt.hit,"radius",0,4,.05).name("命中半径 (m)"),jt.add(Dt.hit,"width",0,2,.05).name("扫掠半径 (m)"),jt.add(Dt.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),jt.add(Dt.hit,"duration",0,1.5,.01).name("僵直 (s)")),jt.add(o.hits,"noDamageToPlayer").name("测试限制: 玩家不被击退");const zt=c("相机"),It=h(zt,"基础");It.add(t.camera,"pitchDeg",20,80,1).name("俯角"),It.add(t.camera,"yawDeg",-180,180,1).name("方位角"),It.add(t.camera,"distance",6,35,.5).name("距离"),It.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),It.add(t.camera,"fov",25,90,1).name("FOV");const Pt=o.camera,L=h(zt,"智能构图");L.add(Pt,"radius",2,18,.5).name("威胁评估半径 (m)"),L.add(Pt,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),L.add(Pt,"saturation",.5,8,.1).name("威胁归一化饱和"),L.add(Pt,"pushIn",0,.5,.01).name("无威胁推进比例"),L.add(Pt,"maxPullback",0,1,.02).name("最大拉远比例"),L.add(Pt,"maxOffset",0,6,.1).name("最大构图平移 (m)"),L.add(Pt,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),L.add(Pt,"framingBias",0,1,.05).name("威胁质心平移系数"),L.add(Pt,"attackBoost",0,2,.05).name("挥砍中额外加权"),L.add(Pt.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),L.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const E=h(zt,"缩放");return E.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),E.add(t.zoom,"max",1,4,.05).name("最大倍率 (拉远上限)"),E.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),E.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),E.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),E.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),E.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),E.add({reset:i.resetZoom},"reset").name("缩放归 1"),r.forEach($=>$.close()),l.forEach($=>$.close()),a.close(),{gui:a,refreshWeapon:()=>K.updateDisplay()}}function Gm(n,t,e){let i=null,s=Number.POSITIVE_INFINITY;for(const a of n){const o=Math.hypot(t-a.x,e-a.z);o<=a.radius&&o<s&&(i=a,s=o)}return i}function Vm(n,t){return n.find(e=>e.id===t)??null}function Kl(n,t,e){if(n.length===0)return null;const i=[...n].sort((r,l)=>r.index-l.index),s=i.findIndex(r=>r.id===t),a=e<0?-1:1,o=s<0?a>0?0:i.length-1:(s+a+i.length)%i.length;return i[o]??null}function Xm({stations:n,world:t,view:e,container:i,onResetZoom:s}){const a=i??document.getElementById("lab-panel");let o=null,r=null;const l=new Map,c=document.createElement("div");c.id="lab-toast",c.setAttribute("aria-live","polite"),document.body.appendChild(c);let h=0;function f(g){c.textContent=`${g.index} · ${g.name} — ${g.hint}`,c.style.borderColor=g.color,c.classList.add("is-on"),window.clearTimeout(h),h=window.setTimeout(()=>c.classList.remove("is-on"),5e3)}function d(){return Gm(n,t.character.position.x,t.character.position.z)}function u(){const g=d(),m=(g==null?void 0:g.id)??null;if(m===o)return;const x=o!==null;o=m;for(const[y,v]of l)v.classList.toggle("is-active",y===m);r&&(r.textContent=g?`${g.index} · ${g.hint}`:"不在任何工位内：点上面的名字传送，或直接走过去",r.style.color=g?"rgba(206, 226, 244, 0.9)":"rgba(150, 172, 192, 0.62)"),g?f(g):x&&c.classList.remove("is-on")}function p(g){const m=typeof g=="number"?n.find(x=>x.index===g)??null:Vm(n,g);return m?(Up(t,m.spawnX,m.spawnZ),t.camera.centroidX=m.spawnX,t.camera.centroidZ=m.spawnZ,e.snapCamera(m.spawnX,t.character.position.y,m.spawnZ),u(),!0):!1}function _(){Xd(t)}if(a){a.textContent="";const g=document.createElement("div");g.className="lab-head",g.textContent="测试工位";const m=document.createElement("span");m.className="lab-tip",m.textContent="[ / ] 切换",g.appendChild(m),a.appendChild(g);for(const v of[...n].sort((P,S)=>P.index-S.index)){const P=document.createElement("button");P.type="button",P.className="lab-row",P.dataset.station=v.id,P.dataset.uiButton="",P.style.setProperty("--lab-color",v.color),P.setAttribute("aria-label",`传送到工位 ${v.index}：${v.name}`);const S=document.createElement("span");S.className="lab-idx",S.textContent=String(v.index);const w=document.createElement("span");w.className="lab-name",w.textContent=v.name,P.append(S,w),P.addEventListener("pointerdown",T=>{T.preventDefault(),T.stopPropagation(),p(v.id)}),a.appendChild(P),l.set(v.id,P)}r=document.createElement("div"),r.className="lab-hint",a.appendChild(r);const x=document.createElement("div");x.className="lab-foot";const y=document.createElement("button");if(y.type="button",y.className="lab-btn",y.dataset.uiButton="",y.textContent="召回假人",y.setAttribute("aria-label","召回全部假人回到各自工位"),y.addEventListener("pointerdown",v=>{v.preventDefault(),v.stopPropagation(),_()}),x.appendChild(y),s){const v=document.createElement("button");v.type="button",v.className="lab-btn",v.dataset.uiButton="",v.textContent="镜头归位",v.setAttribute("aria-label","把镜头缩放恢复到默认"),v.addEventListener("pointerdown",P=>{P.preventDefault(),P.stopPropagation(),s()}),x.appendChild(v)}a.appendChild(x)}return window.addEventListener("keydown",g=>{var m,x;if(!(g.metaKey||g.ctrlKey||g.altKey))if(g.key==="["){const y=Kl(n,((m=d())==null?void 0:m.id)??o,-1);y&&p(y.id)}else if(g.key==="]"){const y=Kl(n,((x=d())==null?void 0:x.id)??o,1);y&&p(y.id)}else g.key==="\\"&&_()}),u(),{goto:p,current:d,tick:u,recall:_,element:a}}const $o=Math.PI*2,Dn={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},Wm=45,$m=50;function Ym(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function Ds(n,t,e){const i=Ym(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function Zm(n,t){return Math.atan2(n,-t)*180/Math.PI}function Jl(n,t){return Math.abs(((n-t)%360+540)%360-180)}function fa(n){return(n%360+360)%360}const qm={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function jm(n,t,e,i=8){const s=n.character,a=t.intents,o=Math.hypot(a.moveX,a.moveZ),r=Math.hypot(t.stickRawX,t.stickRawY),l=s.velocity,c=Math.hypot(l.x,l.z),h=o>.001?Ds(a.moveX,a.moveZ,e):null,f=c>.15?Ds(l.x,l.z,e):null,d=Ds(Math.sin(s.facing),Math.cos(s.facing),e),u=a.aimActive&&Math.hypot(a.aimX,a.aimZ)>1e-6?Ds(a.aimX,a.aimZ,e):null,p=n.targeting,_=p.hasTarget?Ds(Math.sin(p.targetYaw),Math.cos(p.targetYaw),e):null,g=h!==null&&f!==null?Jl(h,f):null,m=h!==null?Jl(h,d):null,x=g!==null&&g>Wm&&o>=.35&&c>=.4;return{inDeg:h,inLen:Math.min(1,o),rawDeg:r>.02?Zm(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,r),stickHeld:t.stickHeld,moveDeg:f,speed:c,faceDeg:d,lockDeg:_,lockId:p.targetId,lockDist:p.targetDist,aimDeg:u,gapMove:g,gapFace:m,warnMove:x}}function Ql(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>$m&&(n.inLen>=.35||n.speed>=.4)}const th="harness.dirDebug";function Km(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const s=e.querySelector("#dirdbg-canvas"),a=e.querySelector("#dirdbg-toggle"),o={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},r=s.getContext("2d");let l=!0;if(!t)try{l=window.localStorage.getItem(th)!=="0"}catch{}function c(){e.classList.toggle("is-off",!l),a&&(a.textContent=l?"方向 ⌄":"方向 ▸",a.setAttribute("aria-expanded",String(l)))}c();function h(y){if(l=y,!t)try{window.localStorage.setItem(th,y?"1":"0")}catch{}c()}a==null||a.addEventListener("pointerdown",y=>{y.preventDefault(),y.stopPropagation(),h(!l)}),t||window.addEventListener("keydown",y=>{y.key.toLowerCase()==="v"&&!y.metaKey&&!y.ctrlKey&&h(!l)});const f=Math.min(3,Math.max(1,window.devicePixelRatio||1)),d=118;s.width=Math.round(d*f),s.height=Math.round(d*f);let u=qm,p=0,_="",g=8;function m(y){if(!r)return;const v=d,P=d,S=v/2,w=P/2,T=Math.min(v,P)/2-13;r.setTransform(f,0,0,f,0,0),r.clearRect(0,0,v,P),r.beginPath(),r.arc(S,w,T,0,$o),r.fillStyle="rgba(8, 12, 17, 0.5)",r.fill(),r.lineWidth=1,r.strokeStyle=y.warnMove?"rgba(251, 191, 36, 0.85)":Dn.ring,r.stroke(),r.strokeStyle=Dn.grid,r.beginPath(),r.moveTo(S-T,w),r.lineTo(S+T,w),r.moveTo(S,w-T),r.lineTo(S,w+T),r.stroke();for(let F=0;F<8;F++){const I=F*Math.PI/4,z=S+Math.sin(I)*(T-3),C=w-Math.cos(I)*(T-3),D=S+Math.sin(I)*T,X=w-Math.cos(I)*T;r.beginPath(),r.moveTo(z,C),r.lineTo(D,X),r.stroke()}const b=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;b>0&&(r.save(),r.setLineDash([2,3]),r.strokeStyle=Dn.dead,r.beginPath(),r.arc(S,w,T*b,0,$o),r.stroke(),r.restore());const M=(F,I,z,C,D=!1,X=1)=>{const H=F*Math.PI/180,Z=Math.sin(H),Q=-Math.cos(H),mt=T*Math.max(.14,Math.min(1,I)),dt=S+Z*T*.14,ut=w+Q*T*.14,K=S+Z*mt,tt=w+Q*mt;if(r.save(),r.globalAlpha=X,r.strokeStyle=z,r.fillStyle=z,r.lineWidth=C,r.lineCap="round",D&&r.setLineDash([3,3]),r.beginPath(),r.moveTo(dt,ut),r.lineTo(K,tt),r.stroke(),!D&&mt>T*.3){const ht=-Q,j=Z,Mt=5.2;r.beginPath(),r.moveTo(K+Z*1.5,tt+Q*1.5),r.lineTo(K-Z*Mt+ht*Mt*.72,tt-Q*Mt+j*Mt*.72),r.lineTo(K-Z*Mt-ht*Mt*.72,tt-Q*Mt-j*Mt*.72),r.closePath(),r.fill()}r.restore()},R=(F,I)=>{const z=F*Math.PI/180,C=Math.sin(z),D=-Math.cos(z),X=-D,H=C,Z=T+1.5,Q=Z+6.5;r.save(),r.fillStyle=I,r.strokeStyle=I,r.lineWidth=1,r.beginPath(),r.moveTo(S+C*Q,w+D*Q),r.lineTo(S+C*Z+X*4,w+D*Z+H*4),r.lineTo(S+C*Z-X*4,w+D*Z-H*4),r.closePath(),r.fill(),r.restore()};y.lockDeg!==null&&M(y.lockDeg,1,Dn.lock,1,!0,.7),y.rawDeg!==null&&y.stickHeld&&M(y.rawDeg,y.rawLen,Dn.raw,1,!0,.9),y.aimDeg!==null&&M(y.aimDeg,1,Dn.aim,1.6,!0,.95),M(y.faceDeg,1,Dn.face,1.1,!0,.55),y.moveDeg!==null&&M(y.moveDeg,y.speed/Math.max(1,g),Dn.move,5.5,!1,.8),y.inDeg!==null&&M(y.inDeg,y.inLen,Dn.input,2.2),R(y.faceDeg,Dn.face),r.beginPath(),r.arc(S,w,2.2,0,$o),r.fillStyle="rgba(220, 235, 248, 0.85)",r.fill()}function x(y,v){const P=T=>T===null?"-":String(Math.round(fa(T)));o.in.textContent=`入 ${P(y.inDeg)}`,o.mv.textContent=`移 ${P(y.moveDeg)}`,o.fc.textContent=`面 ${P(y.faceDeg)}`;const S=T=>T===null?"-":`${Math.round(T)}°`,w=[`Δ入→移 ${S(y.gapMove)}`,`Δ入→面 ${S(y.gapFace)}`];y.speed>.05&&w.push(`v${y.speed.toFixed(1)}`),y.lockDeg!==null&&w.push(`锁#${y.lockId} ${y.lockDist.toFixed(1)}m`),y.aimDeg!==null&&w.push("拖拽瞄准"),o.gap.textContent=w.join("  "),e.classList.toggle("is-warn",y.warnMove||Ql(y,v))}return{update(y,v,P){if(!l)return;g=Math.max(1,y.config.moveSpeed*Math.max(1,y.config.sprintMultiplier));const S=jm(y,v,P,g);u=S;const w=y.combat.phase!=="idle";m(S);const T=performance.now(),b=`${S.inDeg}|${S.moveDeg}|${S.faceDeg}|${S.lockId}|${S.aimDeg}|${S.warnMove}|${S.speed.toFixed(1)}`;(T-p>90||b!==_)&&(p=T,_=b,x(S,w),e.dataset.in=S.inDeg===null?"":fa(S.inDeg).toFixed(1),e.dataset.mv=S.moveDeg===null?"":fa(S.moveDeg).toFixed(1),e.dataset.fc=fa(S.faceDeg).toFixed(1),e.dataset.warn=S.warnMove||Ql(S,w)?"1":"0")},setEnabled:h,toggle(){return h(!l),l},enabled:()=>l,last:()=>u}}const Jm=6,Qm=480,eh=240,nh=92,t0=18;function e0(n,t,e,i){const s=t-n;return{t:i,speed:t,drive:t,raw:t,dv:s,accel:e>1e-4?s/e:0,busy:!1}}function n0(n,t,e,i){const a=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:a,speed:Math.min(a,Math.max(1,i))}}function i0(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function s0(n={}){const t=Math.max(1,n.windowS??Jm),e=Math.max(60,n.capacity??Qm),i=Math.max(1,n.speedCap??t0),s=!!(n.container&&n.toggle),a=n.container??document.createElement("div");a.id="motiondbg",n.container||(a.setAttribute("data-ui-region",""),document.body.appendChild(a));const o=['<div id="motiondbg-head"><span>速度(位移) / Δv</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="92"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");a.innerHTML=s?`<div id="motiondbg-body">${o}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${o}</div>`].join("");const r=n.toggle??a.querySelector("#motiondbg-toggle"),l=a.querySelector("#motiondbg-graph"),c=a.querySelector("#motiondbg-read"),h=a.querySelector("#motiondbg-window"),f=a.querySelector("#motiondbg-dir");h.textContent=`${t.toFixed(1)}s`;const d=l.getContext("2d"),u=Math.min(3,Math.max(1,window.devicePixelRatio||1));l.width=Math.round(eh*u),l.height=Math.round(nh*u);const p=Km({deadZone:n.deadZone,container:f,embedded:!0});let _=!1;function g(T){_=T,a.classList.toggle("is-off",!T),!s&&r&&(r.textContent=T?"手感 ⌄":"手感 ▸",r.setAttribute("aria-expanded",String(T)),r.setAttribute("aria-label",T?"收起手感调试面板":"展开手感调试面板"))}g(!1),s||(r==null||r.addEventListener("pointerdown",T=>{T.preventDefault(),T.stopPropagation(),g(!_)}),window.addEventListener("keydown",T=>{T.key.toLowerCase()==="v"&&!T.metaKey&&!T.ctrlKey&&g(!_)}));const m=[];let x=0,y=null,v=-1,P={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1};function S(T){const b=T-t;let M=0;for(;M<m.length&&m[M].t<b;)M++;return m.slice(M)}function w(T,b){if(!d)return;const M=eh,R=nh;d.setTransform(u,0,0,u,0,0),d.clearRect(0,0,M,R),d.fillStyle="rgba(8, 12, 17, 0.55)",d.fillRect(0,0,M,R);const F=4,I=4,z=M-F-I,C=9,D=46,X=62,H=22,Z=b-t,Q=j=>F+Math.max(0,Math.min(1,(j-Z)/t))*z;for(let j=0;j<T.length;j++){if(!T[j].busy)continue;const Mt=Q(T[j].t),kt=j+1<T.length?Q(T[j+1].t):Mt+2;d.fillStyle="rgba(251, 146, 60, 0.13)",d.fillRect(Mt,C,Math.max(2,kt-Mt),D)}d.strokeStyle="rgba(150, 190, 220, 0.14)",d.lineWidth=1,d.beginPath();for(const j of[C,C+D/2,C+D])d.moveTo(F,j),d.lineTo(M-I,j);d.moveTo(F,X+H/2),d.lineTo(M-I,X+H/2),d.stroke();const dt=Math.max(1,...T.map(j=>j.speed),...T.map(j=>j.drive))*1.15,ut=j=>C+D-j/dt*D;if(T.length>1){d.beginPath(),d.moveTo(Q(T[0].t),ut(T[0].speed));for(let j=1;j<T.length;j++)d.lineTo(Q(T[j].t),ut(T[j].speed));d.strokeStyle="#38bdf8",d.lineWidth=1.8,d.lineJoin="round",d.stroke(),d.lineTo(Q(T[T.length-1].t),C+D),d.lineTo(Q(T[0].t),C+D),d.closePath(),d.fillStyle="rgba(56, 189, 248, 0.14)",d.fill(),d.beginPath(),d.moveTo(Q(T[0].t),ut(T[0].drive));for(let j=1;j<T.length;j++)d.lineTo(Q(T[j].t),ut(T[j].drive));d.setLineDash([3,3]),d.strokeStyle="rgba(190, 205, 220, 0.6)",d.lineWidth=1.2,d.stroke(),d.setLineDash([])}let K=.02;for(const j of T)K=Math.max(K,Math.abs(j.dv));K*=1.1;const tt=X+H/2,ht=H/2;for(const j of T){const Mt=Math.min(ht,Math.abs(j.dv)/K*ht);d.fillStyle=j.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",d.fillRect(Q(j.t)-.7,j.dv>=0?tt-Mt:tt,1.4,Math.max(.5,Mt))}d.font="9px ui-monospace, monospace",d.fillStyle="rgba(190, 214, 234, 0.55)",d.textAlign="left",d.fillText(dt.toFixed(1),F+2,C+8),d.fillText("v",F+2,C+D-2),d.fillText("Δv",F+2,X+9),d.textAlign="right",d.fillText("0",M-I-2,C+D-2),d.textAlign="left"}return{dirDebug:p,update(T,b,M){const R=performance.now()/1e3,F=v<0?1/60:Math.max(1e-4,Math.min(.25,R-v));v=R;const I=T.character,z={x:I.position.x,z:I.position.z},C=Math.hypot(I.velocity.x,I.velocity.z),{speed:D,raw:X}=y?n0(y,z,F,i):{speed:0,raw:0},H=e0(x,D,F,R);H.drive=C,H.raw=X,H.busy=i0(T),y=z,x=D,m.push(H),m.length>e&&m.shift();const Z=S(R);let Q=0;for(const mt of Z)Q=Math.max(Q,mt.speed);if(P={speed:D,drive:C,raw:X,dv:H.dv,accel:H.accel,peak:Q,samples:Z.length,windowS:t,busy:H.busy},p.update(T,b,M),_){w(Z,R);const mt=H.dv>=0?"+":"";c.textContent=`v ${D.toFixed(2)} · 驱 ${C.toFixed(2)} · 峰 ${Q.toFixed(2)} · Δv ${mt}${H.dv.toFixed(3)} · ${Z.length} 帧`}},setEnabled:g,toggle(){return g(!_),_},enabled:()=>_,last:()=>({...P}),samples:()=>S(performance.now()/1e3).map(T=>({...T}))}}const a0=["剑盾","双剑","大剑","法杖","弓"],o0={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击"};function r0(n){return{update(t,e,i,s,a,o,r=!1){const l=t.character,c=l.position,h=l.velocity,f=t.combat,d=t.events.length>0?t.events[t.events.length-1]:null,u=Ht=>Ht.toFixed(2),p=Ht=>(Ht*180/Math.PI).toFixed(0),_=a0[Li.indexOf(f.weapon)]??f.weapon,g=Math.round(f.charge*10),m="|".repeat(g)+".".repeat(10-g),x=t.dash,y=x.phase==="active"&&x.duration>0?(1-x.timer/x.duration)*100:0,v=x.phase==="active"?`${x.kind}@${y.toFixed(0)}%`:`${x.kind} cd${u(x.cooldown)}`,P=s.intents.aimActive?`(${u(s.intents.aimX)},${u(s.intents.aimZ)})`:"-",S=h.x*Math.sin(l.bodyYaw)+h.z*Math.cos(l.bodyYaw),w=h.x*Math.cos(l.bodyYaw)-h.z*Math.sin(l.bodyYaw),T=Math.abs(S)+Math.abs(w)+1e-6,b=Math.round(Math.abs(w)/T*100),M=`strafe ${b}%${S<-.05?" back":""}`,R=t.camera,F=`threat ${(R.threat*100).toFixed(0)}%  dist×${u(R.distanceScale)}  off (${u(R.offsetX)},${u(R.offsetZ)})  pitch +${u(R.pitchDelta)}°  n=${R.threatCount}`,I=o?u(o.attackBlend):"-",z=o==null?void 0:o.attackWeights,C=z?`gw ${u(z.gaitScale)}  lw ${u(z.attackLegWeight)}  spd ${u(z.driveSpeed)}`:"-",D=z?`${u(z.gaitScale)}/${u(z.attackLegWeight)}`:"-",X=o?`${o.landing.kind} ${u(o.landing.pulse)} t${u(o.landing.remaining)} vy${u(o.landing.impactVy)}`:"-",H=o?`${o.landing.kind}/${u(o.landing.pulse)}`:"-",Z=(o==null?void 0:o.zoom)!==void 0?`zoom ×${u(o.zoom)}`:"-",Q=o==null?void 0:o.hurt,mt=Q?`hurt ${t.playerHurt.type}  部位h${u(Q.hitHeight)}  脉冲p${u(Q.pulse)}  上身${u(Q.upperShift)}  重心${u(Q.comShift)}  后坐${u(Q.pelvisBack)}  屈膝${u(Q.knee)}`:"-",dt=Q?`${u(Q.hitHeight)}/${u(Q.pulse)}/${u(Q.knee)}`:"-",ut=o==null?void 0:o.ik,K=ut?`${ut.active?"on":"off"} w${u(ut.weight)} e${u(ut.maxError)}`:"-",tt=t.playerLink,ht=`link ${tt.kind||"-"}  ${tt.phase}  prog ${u(tt.progress)}  win ${u(tt.linkWindow)}s  cd ${u(tt.cooldown)}s  hits ${tt.hitIds.length}  travel ${u(tt.travelled)}/${u(tt.travel)}m  id ${tt.id}`,j=`${tt.phase}/${tt.kind||"-"}/w${u(tt.linkWindow)}`,Mt=s.lastGesture,kt=Mt?`${Mt.button} ${Mt.kind} ${Mt.heldMs.toFixed(0)}ms d${Mt.distance.toFixed(0)}px ${Mt.angleDeg.toFixed(0)}° taps${Mt.taps}`:"-",Ct=t.dummies.map(Ht=>`${Ht.id}:${o0[Ht.mode]}`).join("  ");if(r){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${_} ${f.phase} · lk ${tt.phase}${tt.kind?`/${tt.kind}`:""} w${u(tt.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${u(c.x)},${u(c.y)},${u(c.z)})  vel (${u(h.x)},${u(h.y)},${u(h.z)})`,`face ${p(l.facing)}  body ${p(l.bodyYaw)}  head ${p(l.headYaw)}  move ${p(l.moveYaw)}  st${b}%  stick(${u(s.stickX)},${u(s.stickY)}) ${s.source}  str${u(l.stride)}`,`weapon ${_}  ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}  dash ${v}  ab ${I}  gw/lw ${D}  land ${H}  ik ${K}`,`aim ${P}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${dt}`,`dummies ${Ct}  atkCount ${t.dummyAttackCount}  cam ${(R.threat*100).toFixed(0)}% ×${u(R.distanceScale)}  ${Z}  lk ${j}`,`event ${d?`${d.type} ${u(d.value)}`:"-"}  scale ${u(a.timeScale)}${a.paused?" [P]":""}  g ${kt}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${u(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${u(c.x)}, ${u(c.y)}, ${u(c.z)})`,`vel  (${u(h.x)}, ${u(h.y)}, ${u(h.z)})`,`grounded ${l.grounded?"Y":"N"}   sprint ${l.sprinting?"Y":"N"}   facing ${p(l.facing)}deg   atkBlend ${I}   ${C}   land ${X}`,mt,`ik ${K}  clamped ${ut?ut.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${p(l.facing)}  body ${p(l.bodyYaw)}  head ${p(l.headYaw)}  move ${p(l.moveYaw)}  (head-body ${p(l.headYaw-l.bodyYaw)})  ${M}`,`move (${u(s.intents.moveX)}, ${u(s.intents.moveZ)})  stick (${u(s.stickX)}, ${u(s.stickY)})  ${s.source}  aim ${P}`,`weapon ${_}  phase ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}${f.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${x.kind}  phase ${x.phase}  prog ${y.toFixed(0)}%  cd ${u(x.cooldown)}s  id ${x.id}  from (${u(x.fromX)},${u(x.fromZ)}) → to (${u(x.toX)},${u(x.toZ)})`,ht,`camera ${F}  ${Z}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m  face ${p(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${m}] ${(f.charge*100).toFixed(0)}%  charging ${f.charging?"Y":"N"}`,`dummies ${Ct}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${u(t.impulse.x)}, ${u(t.impulse.z)})`,`event ${d?`${d.type} ${u(d.value)}`:"-"}   scale ${u(a.timeScale)}${a.paused?" [PAUSED]":""}   gesture ${kt}`].join(`
`)}}}const pa=["lab","hud","motion","debug"],ih={lab:{short:"工位",full:"测试工位"},hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}},sh={lab:{toggle:"lab-toggle",panel:"lab-panel"},hud:{toggle:"hud-toggle",panel:"hud"},motion:{toggle:"motiondbg-toggle",panel:"motiondbg"},debug:{toggle:"debug-toggle",panel:"debug-panel"}};function c0(n){var l;const t=Object.fromEntries(pa.map(c=>[c,document.getElementById(sh[c].toggle)])),e=Object.fromEntries(pa.map(c=>[c,document.getElementById(sh[c].panel)]));let i={},s=null;function a(){var c,h,f;for(const d of pa){const u=s===d,p=t[d],_=e[d];p&&(p.setAttribute("aria-expanded",String(u)),p.textContent=`${ih[d].short} ${u?"▾":"▸"}`,p.setAttribute("aria-label",`${u?"收起":"展开"}${ih[d].full}`)),_&&_.classList.toggle("is-open",u)}n.classList.toggle("is-compact",s!=="hud"),(c=i.motion)==null||c.setEnabled(s==="motion"),s==="debug"?(h=i.debug)==null||h.open():(f=i.debug)==null||f.close()}function o(c){s=s===c?null:c,a()}function r(){s!==null&&(s=null,a())}for(const c of pa)(l=t[c])==null||l.addEventListener("pointerdown",h=>{h.preventDefault(),h.stopPropagation(),o(c)});return window.addEventListener("keydown",c=>{c.key.toLowerCase()==="v"&&!c.metaKey&&!c.ctrlKey&&o("motion")}),a(),{hudCompact:()=>s!=="hud",register(c){i=c,a()},toggle:o,closeAll:r,isOpen:c=>s===c}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Yc="170",l0=0,ah=1,h0=2,qd=1,jd=2,Xn=3,li=0,nn=1,Ae=2,ri=0,us=1,Ti=2,oh=3,rh=4,d0=5,Ai=100,u0=101,f0=102,p0=103,m0=104,g0=200,x0=201,v0=202,_0=203,Xr=204,Wr=205,y0=206,M0=207,S0=208,b0=209,E0=210,w0=211,T0=212,A0=213,R0=214,$r=0,Yr=1,Zr=2,xs=3,qr=4,jr=5,Kr=6,Jr=7,Zc=0,C0=1,P0=2,ci=0,D0=1,L0=2,I0=3,k0=4,U0=5,F0=6,N0=7,Kd=300,vs=301,_s=302,Qr=303,tc=304,So=306,ec=1e3,Ci=1001,nc=1002,Tn=1003,z0=1004,ma=1005,kn=1006,Yo=1007,Pi=1008,qn=1009,Jd=1010,Qd=1011,Ks=1012,qc=1013,Ii=1014,$n=1015,aa=1016,jc=1017,Kc=1018,ys=1020,tu=35902,eu=1021,nu=1022,wn=1023,iu=1024,su=1025,fs=1026,Ms=1027,au=1028,Jc=1029,ou=1030,Qc=1031,tl=1033,Za=33776,qa=33777,ja=33778,Ka=33779,ic=35840,sc=35841,ac=35842,oc=35843,rc=36196,cc=37492,lc=37496,hc=37808,dc=37809,uc=37810,fc=37811,pc=37812,mc=37813,gc=37814,xc=37815,vc=37816,_c=37817,yc=37818,Mc=37819,Sc=37820,bc=37821,Ja=36492,Ec=36494,wc=36495,ru=36283,Tc=36284,Ac=36285,Rc=36286,O0=3200,B0=3201,cu=0,H0=1,ii="",je="srgb",bs="srgb-linear",bo="linear",xe="srgb",Gi=7680,ch=519,G0=512,V0=513,X0=514,lu=515,W0=516,$0=517,Y0=518,Z0=519,Cc=35044,lh="300 es",Yn=2e3,uo=2001;class Es{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const a=s.indexOf(e);a!==-1&&s.splice(a,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let a=0,o=s.length;a<o;a++)s[a].call(this,t);t.target=null}}}const We=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let hh=1234567;const ps=Math.PI/180,Js=180/Math.PI;function Fn(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(We[n&255]+We[n>>8&255]+We[n>>16&255]+We[n>>24&255]+"-"+We[t&255]+We[t>>8&255]+"-"+We[t>>16&15|64]+We[t>>24&255]+"-"+We[e&63|128]+We[e>>8&255]+"-"+We[e>>16&255]+We[e>>24&255]+We[i&255]+We[i>>8&255]+We[i>>16&255]+We[i>>24&255]).toLowerCase()}function Xe(n,t,e){return Math.max(t,Math.min(e,n))}function el(n,t){return(n%t+t)%t}function q0(n,t,e,i,s){return i+(n-t)*(s-i)/(e-t)}function j0(n,t,e){return n!==t?(e-n)/(t-n):0}function Vs(n,t,e){return(1-e)*n+e*t}function K0(n,t,e,i){return Vs(n,t,1-Math.exp(-e*i))}function J0(n,t=1){return t-Math.abs(el(n,t*2)-t)}function Q0(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function tg(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function eg(n,t){return n+Math.floor(Math.random()*(t-n+1))}function ng(n,t){return n+Math.random()*(t-n)}function ig(n){return n*(.5-Math.random())}function sg(n){n!==void 0&&(hh=n);let t=hh+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function ag(n){return n*ps}function og(n){return n*Js}function rg(n){return(n&n-1)===0&&n!==0}function cg(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function lg(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function hg(n,t,e,i,s){const a=Math.cos,o=Math.sin,r=a(e/2),l=o(e/2),c=a((t+i)/2),h=o((t+i)/2),f=a((t-i)/2),d=o((t-i)/2),u=a((i-t)/2),p=o((i-t)/2);switch(s){case"XYX":n.set(r*h,l*f,l*d,r*c);break;case"YZY":n.set(l*d,r*h,l*f,r*c);break;case"ZXZ":n.set(l*f,l*d,r*h,r*c);break;case"XZX":n.set(r*h,l*p,l*u,r*c);break;case"YXY":n.set(l*u,r*h,l*p,r*c);break;case"ZYZ":n.set(l*p,l*u,r*h,r*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function En(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function me(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const dh={DEG2RAD:ps,RAD2DEG:Js,generateUUID:Fn,clamp:Xe,euclideanModulo:el,mapLinear:q0,inverseLerp:j0,lerp:Vs,damp:K0,pingpong:J0,smoothstep:Q0,smootherstep:tg,randInt:eg,randFloat:ng,randFloatSpread:ig,seededRandom:sg,degToRad:ag,radToDeg:og,isPowerOfTwo:rg,ceilPowerOfTwo:cg,floorPowerOfTwo:lg,setQuaternionFromProperEuler:hg,normalize:me,denormalize:En};class Bt{constructor(t=0,e=0){Bt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Xe(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),a=this.x-t.x,o=this.y-t.y;return this.x=a*i-o*s+t.x,this.y=a*s+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ee{constructor(t,e,i,s,a,o,r,l,c){ee.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,a,o,r,l,c)}set(t,e,i,s,a,o,r,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=r,h[3]=e,h[4]=a,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,a=this.elements,o=i[0],r=i[3],l=i[6],c=i[1],h=i[4],f=i[7],d=i[2],u=i[5],p=i[8],_=s[0],g=s[3],m=s[6],x=s[1],y=s[4],v=s[7],P=s[2],S=s[5],w=s[8];return a[0]=o*_+r*x+l*P,a[3]=o*g+r*y+l*S,a[6]=o*m+r*v+l*w,a[1]=c*_+h*x+f*P,a[4]=c*g+h*y+f*S,a[7]=c*m+h*v+f*w,a[2]=d*_+u*x+p*P,a[5]=d*g+u*y+p*S,a[8]=d*m+u*v+p*w,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],a=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*r*c-i*a*h+i*r*l+s*a*c-s*o*l}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],a=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],f=h*o-r*c,d=r*l-h*a,u=c*a-o*l,p=e*f+i*d+s*u;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/p;return t[0]=f*_,t[1]=(s*c-h*i)*_,t[2]=(r*i-s*o)*_,t[3]=d*_,t[4]=(h*e-s*l)*_,t[5]=(s*a-r*e)*_,t[6]=u*_,t[7]=(i*l-c*e)*_,t[8]=(o*e-i*a)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,a,o,r){const l=Math.cos(a),c=Math.sin(a);return this.set(i*l,i*c,-i*(l*o+c*r)+o+t,-s*c,s*l,-s*(-c*o+l*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(Zo.makeScale(t,e)),this}rotate(t){return this.premultiply(Zo.makeRotation(-t)),this}translate(t,e){return this.premultiply(Zo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Zo=new ee;function hu(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function fo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function dg(){const n=fo("canvas");return n.style.display="block",n}const uh={};function Bs(n){n in uh||(uh[n]=!0,console.warn(n))}function ug(n,t,e){return new Promise(function(i,s){function a(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(a,e);break;default:i()}}setTimeout(a,e)})}function fg(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function pg(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const he={enabled:!0,workingColorSpace:bs,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===xe&&(n.r=Zn(n.r),n.g=Zn(n.g),n.b=Zn(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===xe&&(n.r=ms(n.r),n.g=ms(n.g),n.b=ms(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===ii?bo:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function Zn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function ms(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const fh=[.64,.33,.3,.6,.15,.06],ph=[.2126,.7152,.0722],mh=[.3127,.329],gh=new ee().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),xh=new ee().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);he.define({[bs]:{primaries:fh,whitePoint:mh,transfer:bo,toXYZ:gh,fromXYZ:xh,luminanceCoefficients:ph,workingColorSpaceConfig:{unpackColorSpace:je},outputColorSpaceConfig:{drawingBufferColorSpace:je}},[je]:{primaries:fh,whitePoint:mh,transfer:xe,toXYZ:gh,fromXYZ:xh,luminanceCoefficients:ph,outputColorSpaceConfig:{drawingBufferColorSpace:je}}});let Vi;class mg{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Vi===void 0&&(Vi=fo("canvas")),Vi.width=t.width,Vi.height=t.height;const i=Vi.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=Vi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=fo("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(0,0,t.width,t.height),a=s.data;for(let o=0;o<a.length;o++)a[o]=Zn(a[o]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Zn(e[i]/255)*255):e[i]=Zn(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let gg=0;class du{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:gg++}),this.uuid=Fn(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let o=0,r=s.length;o<r;o++)s[o].isDataTexture?a.push(qo(s[o].image)):a.push(qo(s[o]))}else a=qo(s);i.url=a}return e||(t.images[this.uuid]=i),i}}function qo(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?mg.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let xg=0;class Je extends Es{constructor(t=Je.DEFAULT_IMAGE,e=Je.DEFAULT_MAPPING,i=Ci,s=Ci,a=kn,o=Pi,r=wn,l=qn,c=Je.DEFAULT_ANISOTROPY,h=ii){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:xg++}),this.uuid=Fn(),this.name="",this.source=new du(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=a,this.minFilter=o,this.anisotropy=c,this.format=r,this.internalFormat=null,this.type=l,this.offset=new Bt(0,0),this.repeat=new Bt(1,1),this.center=new Bt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ee,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Kd)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ec:t.x=t.x-Math.floor(t.x);break;case Ci:t.x=t.x<0?0:1;break;case nc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ec:t.y=t.y-Math.floor(t.y);break;case Ci:t.y=t.y<0?0:1;break;case nc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Je.DEFAULT_IMAGE=null;Je.DEFAULT_MAPPING=Kd;Je.DEFAULT_ANISOTROPY=1;class Ce{constructor(t=0,e=0,i=0,s=1){Ce.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,a=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*s+o[12]*a,this.y=o[1]*e+o[5]*i+o[9]*s+o[13]*a,this.z=o[2]*e+o[6]*i+o[10]*s+o[14]*a,this.w=o[3]*e+o[7]*i+o[11]*s+o[15]*a,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,a;const l=t.elements,c=l[0],h=l[4],f=l[8],d=l[1],u=l[5],p=l[9],_=l[2],g=l[6],m=l[10];if(Math.abs(h-d)<.01&&Math.abs(f-_)<.01&&Math.abs(p-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(f+_)<.1&&Math.abs(p+g)<.1&&Math.abs(c+u+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const y=(c+1)/2,v=(u+1)/2,P=(m+1)/2,S=(h+d)/4,w=(f+_)/4,T=(p+g)/4;return y>v&&y>P?y<.01?(i=0,s=.707106781,a=.707106781):(i=Math.sqrt(y),s=S/i,a=w/i):v>P?v<.01?(i=.707106781,s=0,a=.707106781):(s=Math.sqrt(v),i=S/s,a=T/s):P<.01?(i=.707106781,s=.707106781,a=0):(a=Math.sqrt(P),i=w/a,s=T/a),this.set(i,s,a,e),this}let x=Math.sqrt((g-p)*(g-p)+(f-_)*(f-_)+(d-h)*(d-h));return Math.abs(x)<.001&&(x=1),this.x=(g-p)/x,this.y=(f-_)/x,this.z=(d-h)/x,this.w=Math.acos((c+u+m-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class vg extends Es{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Ce(0,0,t,e),this.scissorTest=!1,this.viewport=new Ce(0,0,t,e);const s={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:kn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const a=new Je(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);a.flipY=!1,a.generateMipmaps=i.generateMipmaps,a.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let r=0;r<o;r++)this.textures[r]=a.clone(),this.textures[r].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,s=t.textures.length;i<s;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new du(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ki extends vg{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class uu extends Je{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Tn,this.minFilter=Tn,this.wrapR=Ci,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class _g extends Je{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Tn,this.minFilter=Tn,this.wrapR=Ci,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class oa{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,a,o,r){let l=i[s+0],c=i[s+1],h=i[s+2],f=i[s+3];const d=a[o+0],u=a[o+1],p=a[o+2],_=a[o+3];if(r===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f;return}if(r===1){t[e+0]=d,t[e+1]=u,t[e+2]=p,t[e+3]=_;return}if(f!==_||l!==d||c!==u||h!==p){let g=1-r;const m=l*d+c*u+h*p+f*_,x=m>=0?1:-1,y=1-m*m;if(y>Number.EPSILON){const P=Math.sqrt(y),S=Math.atan2(P,m*x);g=Math.sin(g*S)/P,r=Math.sin(r*S)/P}const v=r*x;if(l=l*g+d*v,c=c*g+u*v,h=h*g+p*v,f=f*g+_*v,g===1-r){const P=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=P,c*=P,h*=P,f*=P}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,i,s,a,o){const r=i[s],l=i[s+1],c=i[s+2],h=i[s+3],f=a[o],d=a[o+1],u=a[o+2],p=a[o+3];return t[e]=r*p+h*f+l*u-c*d,t[e+1]=l*p+h*d+c*f-r*u,t[e+2]=c*p+h*u+r*d-l*f,t[e+3]=h*p-r*f-l*d-c*u,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,a=t._z,o=t._order,r=Math.cos,l=Math.sin,c=r(i/2),h=r(s/2),f=r(a/2),d=l(i/2),u=l(s/2),p=l(a/2);switch(o){case"XYZ":this._x=d*h*f+c*u*p,this._y=c*u*f-d*h*p,this._z=c*h*p+d*u*f,this._w=c*h*f-d*u*p;break;case"YXZ":this._x=d*h*f+c*u*p,this._y=c*u*f-d*h*p,this._z=c*h*p-d*u*f,this._w=c*h*f+d*u*p;break;case"ZXY":this._x=d*h*f-c*u*p,this._y=c*u*f+d*h*p,this._z=c*h*p+d*u*f,this._w=c*h*f-d*u*p;break;case"ZYX":this._x=d*h*f-c*u*p,this._y=c*u*f+d*h*p,this._z=c*h*p-d*u*f,this._w=c*h*f+d*u*p;break;case"YZX":this._x=d*h*f+c*u*p,this._y=c*u*f+d*h*p,this._z=c*h*p-d*u*f,this._w=c*h*f-d*u*p;break;case"XZY":this._x=d*h*f-c*u*p,this._y=c*u*f-d*h*p,this._z=c*h*p+d*u*f,this._w=c*h*f+d*u*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],a=e[8],o=e[1],r=e[5],l=e[9],c=e[2],h=e[6],f=e[10],d=i+r+f;if(d>0){const u=.5/Math.sqrt(d+1);this._w=.25/u,this._x=(h-l)*u,this._y=(a-c)*u,this._z=(o-s)*u}else if(i>r&&i>f){const u=2*Math.sqrt(1+i-r-f);this._w=(h-l)/u,this._x=.25*u,this._y=(s+o)/u,this._z=(a+c)/u}else if(r>f){const u=2*Math.sqrt(1+r-i-f);this._w=(a-c)/u,this._x=(s+o)/u,this._y=.25*u,this._z=(l+h)/u}else{const u=2*Math.sqrt(1+f-i-r);this._w=(o-s)/u,this._x=(a+c)/u,this._y=(l+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Xe(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,a=t._z,o=t._w,r=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+o*r+s*c-a*l,this._y=s*h+o*l+a*r-i*c,this._z=a*h+o*c+i*l-s*r,this._w=o*h-i*r-s*l-a*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,s=this._y,a=this._z,o=this._w;let r=o*t._w+i*t._x+s*t._y+a*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=o,this._x=i,this._y=s,this._z=a,this;const l=1-r*r;if(l<=Number.EPSILON){const u=1-e;return this._w=u*o+e*this._w,this._x=u*i+e*this._x,this._y=u*s+e*this._y,this._z=u*a+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,r),f=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*f+this._w*d,this._x=i*f+this._x*d,this._y=s*f+this._y*d,this._z=a*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),a*Math.sin(e),a*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class V{constructor(t=0,e=0,i=0){V.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(vh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(vh.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6]*s,this.y=a[1]*e+a[4]*i+a[7]*s,this.z=a[2]*e+a[5]*i+a[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,a=t.elements,o=1/(a[3]*e+a[7]*i+a[11]*s+a[15]);return this.x=(a[0]*e+a[4]*i+a[8]*s+a[12])*o,this.y=(a[1]*e+a[5]*i+a[9]*s+a[13])*o,this.z=(a[2]*e+a[6]*i+a[10]*s+a[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,a=t.x,o=t.y,r=t.z,l=t.w,c=2*(o*s-r*i),h=2*(r*e-a*s),f=2*(a*i-o*e);return this.x=e+l*c+o*f-r*h,this.y=i+l*h+r*c-a*f,this.z=s+l*f+a*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*s,this.y=a[1]*e+a[5]*i+a[9]*s,this.z=a[2]*e+a[6]*i+a[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,a=t.z,o=e.x,r=e.y,l=e.z;return this.x=s*l-a*r,this.y=a*o-i*l,this.z=i*r-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return jo.copy(this).projectOnVector(t),this.sub(jo)}reflect(t){return this.sub(jo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Xe(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const jo=new V,vh=new oa;class ra{constructor(t=new V(1/0,1/0,1/0),e=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Mn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Mn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=Mn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const a=i.getAttribute("position");if(e===!0&&a!==void 0&&t.isInstancedMesh!==!0)for(let o=0,r=a.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,Mn):Mn.fromBufferAttribute(a,o),Mn.applyMatrix4(t.matrixWorld),this.expandByPoint(Mn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ga.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ga.copy(i.boundingBox)),ga.applyMatrix4(t.matrixWorld),this.union(ga)}const s=t.children;for(let a=0,o=s.length;a<o;a++)this.expandByObject(s[a],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Mn),Mn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ls),xa.subVectors(this.max,Ls),Xi.subVectors(t.a,Ls),Wi.subVectors(t.b,Ls),$i.subVectors(t.c,Ls),Kn.subVectors(Wi,Xi),Jn.subVectors($i,Wi),pi.subVectors(Xi,$i);let e=[0,-Kn.z,Kn.y,0,-Jn.z,Jn.y,0,-pi.z,pi.y,Kn.z,0,-Kn.x,Jn.z,0,-Jn.x,pi.z,0,-pi.x,-Kn.y,Kn.x,0,-Jn.y,Jn.x,0,-pi.y,pi.x,0];return!Ko(e,Xi,Wi,$i,xa)||(e=[1,0,0,0,1,0,0,0,1],!Ko(e,Xi,Wi,$i,xa))?!1:(va.crossVectors(Kn,Jn),e=[va.x,va.y,va.z],Ko(e,Xi,Wi,$i,xa))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Mn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Mn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(On[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),On[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),On[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),On[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),On[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),On[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),On[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),On[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(On),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const On=[new V,new V,new V,new V,new V,new V,new V,new V],Mn=new V,ga=new ra,Xi=new V,Wi=new V,$i=new V,Kn=new V,Jn=new V,pi=new V,Ls=new V,xa=new V,va=new V,mi=new V;function Ko(n,t,e,i,s){for(let a=0,o=n.length-3;a<=o;a+=3){mi.fromArray(n,a);const r=s.x*Math.abs(mi.x)+s.y*Math.abs(mi.y)+s.z*Math.abs(mi.z),l=t.dot(mi),c=e.dot(mi),h=i.dot(mi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>r)return!1}return!0}const yg=new ra,Is=new V,Jo=new V;class Eo{constructor(t=new V,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):yg.setFromPoints(t).getCenter(i);let s=0;for(let a=0,o=t.length;a<o;a++)s=Math.max(s,i.distanceToSquared(t[a]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Is.subVectors(t,this.center);const e=Is.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(Is,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Jo.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Is.copy(t.center).add(Jo)),this.expandByPoint(Is.copy(t.center).sub(Jo))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Bn=new V,Qo=new V,_a=new V,Qn=new V,tr=new V,ya=new V,er=new V;class nl{constructor(t=new V,e=new V(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Bn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Bn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Bn.copy(this.origin).addScaledVector(this.direction,e),Bn.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){Qo.copy(t).add(e).multiplyScalar(.5),_a.copy(e).sub(t).normalize(),Qn.copy(this.origin).sub(Qo);const a=t.distanceTo(e)*.5,o=-this.direction.dot(_a),r=Qn.dot(this.direction),l=-Qn.dot(_a),c=Qn.lengthSq(),h=Math.abs(1-o*o);let f,d,u,p;if(h>0)if(f=o*l-r,d=o*r-l,p=a*h,f>=0)if(d>=-p)if(d<=p){const _=1/h;f*=_,d*=_,u=f*(f+o*d+2*r)+d*(o*f+d+2*l)+c}else d=a,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;else d=-a,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;else d<=-p?(f=Math.max(0,-(-o*a+r)),d=f>0?-a:Math.min(Math.max(-a,-l),a),u=-f*f+d*(d+2*l)+c):d<=p?(f=0,d=Math.min(Math.max(-a,-l),a),u=d*(d+2*l)+c):(f=Math.max(0,-(o*a+r)),d=f>0?a:Math.min(Math.max(-a,-l),a),u=-f*f+d*(d+2*l)+c);else d=o>0?-a:a,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Qo).addScaledVector(_a,d),u}intersectSphere(t,e){Bn.subVectors(t.center,this.origin);const i=Bn.dot(this.direction),s=Bn.dot(Bn)-i*i,a=t.radius*t.radius;if(s>a)return null;const o=Math.sqrt(a-s),r=i-o,l=i+o;return l<0?null:r<0?this.at(l,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,a,o,r,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(i=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(i=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),h>=0?(a=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(a=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),i>o||a>s||((a>i||isNaN(i))&&(i=a),(o<s||isNaN(s))&&(s=o),f>=0?(r=(t.min.z-d.z)*f,l=(t.max.z-d.z)*f):(r=(t.max.z-d.z)*f,l=(t.min.z-d.z)*f),i>l||r>s)||((r>i||i!==i)&&(i=r),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,Bn)!==null}intersectTriangle(t,e,i,s,a){tr.subVectors(e,t),ya.subVectors(i,t),er.crossVectors(tr,ya);let o=this.direction.dot(er),r;if(o>0){if(s)return null;r=1}else if(o<0)r=-1,o=-o;else return null;Qn.subVectors(this.origin,t);const l=r*this.direction.dot(ya.crossVectors(Qn,ya));if(l<0)return null;const c=r*this.direction.dot(tr.cross(Qn));if(c<0||l+c>o)return null;const h=-r*Qn.dot(er);return h<0?null:this.at(h/o,a)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Se{constructor(t,e,i,s,a,o,r,l,c,h,f,d,u,p,_,g){Se.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,a,o,r,l,c,h,f,d,u,p,_,g)}set(t,e,i,s,a,o,r,l,c,h,f,d,u,p,_,g){const m=this.elements;return m[0]=t,m[4]=e,m[8]=i,m[12]=s,m[1]=a,m[5]=o,m[9]=r,m[13]=l,m[2]=c,m[6]=h,m[10]=f,m[14]=d,m[3]=u,m[7]=p,m[11]=_,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Se().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,s=1/Yi.setFromMatrixColumn(t,0).length(),a=1/Yi.setFromMatrixColumn(t,1).length(),o=1/Yi.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*a,e[5]=i[5]*a,e[6]=i[6]*a,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,a=t.z,o=Math.cos(i),r=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(a),f=Math.sin(a);if(t.order==="XYZ"){const d=o*h,u=o*f,p=r*h,_=r*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=u+p*c,e[5]=d-_*c,e[9]=-r*l,e[2]=_-d*c,e[6]=p+u*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*h,u=l*f,p=c*h,_=c*f;e[0]=d+_*r,e[4]=p*r-u,e[8]=o*c,e[1]=o*f,e[5]=o*h,e[9]=-r,e[2]=u*r-p,e[6]=_+d*r,e[10]=o*l}else if(t.order==="ZXY"){const d=l*h,u=l*f,p=c*h,_=c*f;e[0]=d-_*r,e[4]=-o*f,e[8]=p+u*r,e[1]=u+p*r,e[5]=o*h,e[9]=_-d*r,e[2]=-o*c,e[6]=r,e[10]=o*l}else if(t.order==="ZYX"){const d=o*h,u=o*f,p=r*h,_=r*f;e[0]=l*h,e[4]=p*c-u,e[8]=d*c+_,e[1]=l*f,e[5]=_*c+d,e[9]=u*c-p,e[2]=-c,e[6]=r*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,u=o*c,p=r*l,_=r*c;e[0]=l*h,e[4]=_-d*f,e[8]=p*f+u,e[1]=f,e[5]=o*h,e[9]=-r*h,e[2]=-c*h,e[6]=u*f+p,e[10]=d-_*f}else if(t.order==="XZY"){const d=o*l,u=o*c,p=r*l,_=r*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=d*f+_,e[5]=o*h,e[9]=u*f-p,e[2]=p*f-u,e[6]=r*h,e[10]=_*f+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Mg,t,Sg)}lookAt(t,e,i){const s=this.elements;return rn.subVectors(t,e),rn.lengthSq()===0&&(rn.z=1),rn.normalize(),ti.crossVectors(i,rn),ti.lengthSq()===0&&(Math.abs(i.z)===1?rn.x+=1e-4:rn.z+=1e-4,rn.normalize(),ti.crossVectors(i,rn)),ti.normalize(),Ma.crossVectors(rn,ti),s[0]=ti.x,s[4]=Ma.x,s[8]=rn.x,s[1]=ti.y,s[5]=Ma.y,s[9]=rn.y,s[2]=ti.z,s[6]=Ma.z,s[10]=rn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,a=this.elements,o=i[0],r=i[4],l=i[8],c=i[12],h=i[1],f=i[5],d=i[9],u=i[13],p=i[2],_=i[6],g=i[10],m=i[14],x=i[3],y=i[7],v=i[11],P=i[15],S=s[0],w=s[4],T=s[8],b=s[12],M=s[1],R=s[5],F=s[9],I=s[13],z=s[2],C=s[6],D=s[10],X=s[14],H=s[3],Z=s[7],Q=s[11],mt=s[15];return a[0]=o*S+r*M+l*z+c*H,a[4]=o*w+r*R+l*C+c*Z,a[8]=o*T+r*F+l*D+c*Q,a[12]=o*b+r*I+l*X+c*mt,a[1]=h*S+f*M+d*z+u*H,a[5]=h*w+f*R+d*C+u*Z,a[9]=h*T+f*F+d*D+u*Q,a[13]=h*b+f*I+d*X+u*mt,a[2]=p*S+_*M+g*z+m*H,a[6]=p*w+_*R+g*C+m*Z,a[10]=p*T+_*F+g*D+m*Q,a[14]=p*b+_*I+g*X+m*mt,a[3]=x*S+y*M+v*z+P*H,a[7]=x*w+y*R+v*C+P*Z,a[11]=x*T+y*F+v*D+P*Q,a[15]=x*b+y*I+v*X+P*mt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],a=t[12],o=t[1],r=t[5],l=t[9],c=t[13],h=t[2],f=t[6],d=t[10],u=t[14],p=t[3],_=t[7],g=t[11],m=t[15];return p*(+a*l*f-s*c*f-a*r*d+i*c*d+s*r*u-i*l*u)+_*(+e*l*u-e*c*d+a*o*d-s*o*u+s*c*h-a*l*h)+g*(+e*c*f-e*r*u-a*o*f+i*o*u+a*r*h-i*c*h)+m*(-s*r*h-e*l*f+e*r*d+s*o*f-i*o*d+i*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],a=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],f=t[9],d=t[10],u=t[11],p=t[12],_=t[13],g=t[14],m=t[15],x=f*g*c-_*d*c+_*l*u-r*g*u-f*l*m+r*d*m,y=p*d*c-h*g*c-p*l*u+o*g*u+h*l*m-o*d*m,v=h*_*c-p*f*c+p*r*u-o*_*u-h*r*m+o*f*m,P=p*f*l-h*_*l-p*r*d+o*_*d+h*r*g-o*f*g,S=e*x+i*y+s*v+a*P;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/S;return t[0]=x*w,t[1]=(_*d*a-f*g*a-_*s*u+i*g*u+f*s*m-i*d*m)*w,t[2]=(r*g*a-_*l*a+_*s*c-i*g*c-r*s*m+i*l*m)*w,t[3]=(f*l*a-r*d*a-f*s*c+i*d*c+r*s*u-i*l*u)*w,t[4]=y*w,t[5]=(h*g*a-p*d*a+p*s*u-e*g*u-h*s*m+e*d*m)*w,t[6]=(p*l*a-o*g*a-p*s*c+e*g*c+o*s*m-e*l*m)*w,t[7]=(o*d*a-h*l*a+h*s*c-e*d*c-o*s*u+e*l*u)*w,t[8]=v*w,t[9]=(p*f*a-h*_*a-p*i*u+e*_*u+h*i*m-e*f*m)*w,t[10]=(o*_*a-p*r*a+p*i*c-e*_*c-o*i*m+e*r*m)*w,t[11]=(h*r*a-o*f*a-h*i*c+e*f*c+o*i*u-e*r*u)*w,t[12]=P*w,t[13]=(h*_*s-p*f*s+p*i*d-e*_*d-h*i*g+e*f*g)*w,t[14]=(p*r*s-o*_*s-p*i*l+e*_*l+o*i*g-e*r*g)*w,t[15]=(o*f*s-h*r*s+h*i*l-e*f*l-o*i*d+e*r*d)*w,this}scale(t){const e=this.elements,i=t.x,s=t.y,a=t.z;return e[0]*=i,e[4]*=s,e[8]*=a,e[1]*=i,e[5]*=s,e[9]*=a,e[2]*=i,e[6]*=s,e[10]*=a,e[3]*=i,e[7]*=s,e[11]*=a,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),a=1-i,o=t.x,r=t.y,l=t.z,c=a*o,h=a*r;return this.set(c*o+i,c*r-s*l,c*l+s*r,0,c*r+s*l,h*r+i,h*l-s*o,0,c*l-s*r,h*l+s*o,a*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,a,o){return this.set(1,i,a,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){const s=this.elements,a=e._x,o=e._y,r=e._z,l=e._w,c=a+a,h=o+o,f=r+r,d=a*c,u=a*h,p=a*f,_=o*h,g=o*f,m=r*f,x=l*c,y=l*h,v=l*f,P=i.x,S=i.y,w=i.z;return s[0]=(1-(_+m))*P,s[1]=(u+v)*P,s[2]=(p-y)*P,s[3]=0,s[4]=(u-v)*S,s[5]=(1-(d+m))*S,s[6]=(g+x)*S,s[7]=0,s[8]=(p+y)*w,s[9]=(g-x)*w,s[10]=(1-(d+_))*w,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.elements;let a=Yi.set(s[0],s[1],s[2]).length();const o=Yi.set(s[4],s[5],s[6]).length(),r=Yi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),t.x=s[12],t.y=s[13],t.z=s[14],Sn.copy(this);const c=1/a,h=1/o,f=1/r;return Sn.elements[0]*=c,Sn.elements[1]*=c,Sn.elements[2]*=c,Sn.elements[4]*=h,Sn.elements[5]*=h,Sn.elements[6]*=h,Sn.elements[8]*=f,Sn.elements[9]*=f,Sn.elements[10]*=f,e.setFromRotationMatrix(Sn),i.x=a,i.y=o,i.z=r,this}makePerspective(t,e,i,s,a,o,r=Yn){const l=this.elements,c=2*a/(e-t),h=2*a/(i-s),f=(e+t)/(e-t),d=(i+s)/(i-s);let u,p;if(r===Yn)u=-(o+a)/(o-a),p=-2*o*a/(o-a);else if(r===uo)u=-o/(o-a),p=-o*a/(o-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=u,l[14]=p,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,s,a,o,r=Yn){const l=this.elements,c=1/(e-t),h=1/(i-s),f=1/(o-a),d=(e+t)*c,u=(i+s)*h;let p,_;if(r===Yn)p=(o+a)*f,_=-2*f;else if(r===uo)p=a*f,_=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-u,l[2]=0,l[6]=0,l[10]=_,l[14]=-p,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Yi=new V,Sn=new Se,Mg=new V(0,0,0),Sg=new V(1,1,1),ti=new V,Ma=new V,rn=new V,_h=new Se,yh=new oa;class Nn{constructor(t=0,e=0,i=0,s=Nn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,a=s[0],o=s[4],r=s[8],l=s[1],c=s[5],h=s[9],f=s[2],d=s[6],u=s[10];switch(e){case"XYZ":this._y=Math.asin(Xe(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-o,a)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Xe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,a),this._z=0);break;case"ZXY":this._x=Math.asin(Xe(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-Xe(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,u),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Xe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,a)):(this._x=0,this._y=Math.atan2(r,u));break;case"XZY":this._z=Math.asin(-Xe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(r,a)):(this._x=Math.atan2(-h,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return _h.makeRotationFromQuaternion(t),this.setFromRotationMatrix(_h,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return yh.setFromEuler(this),this.setFromQuaternion(yh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Nn.DEFAULT_ORDER="XYZ";class il{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let bg=0;const Mh=new V,Zi=new oa,Hn=new Se,Sa=new V,ks=new V,Eg=new V,wg=new oa,Sh=new V(1,0,0),bh=new V(0,1,0),Eh=new V(0,0,1),wh={type:"added"},Tg={type:"removed"},qi={type:"childadded",child:null},nr={type:"childremoved",child:null};class De extends Es{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:bg++}),this.uuid=Fn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=De.DEFAULT_UP.clone();const t=new V,e=new Nn,i=new oa,s=new V(1,1,1);function a(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(a),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Se},normalMatrix:{value:new ee}}),this.matrix=new Se,this.matrixWorld=new Se,this.matrixAutoUpdate=De.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=De.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new il,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Zi.setFromAxisAngle(t,e),this.quaternion.multiply(Zi),this}rotateOnWorldAxis(t,e){return Zi.setFromAxisAngle(t,e),this.quaternion.premultiply(Zi),this}rotateX(t){return this.rotateOnAxis(Sh,t)}rotateY(t){return this.rotateOnAxis(bh,t)}rotateZ(t){return this.rotateOnAxis(Eh,t)}translateOnAxis(t,e){return Mh.copy(t).applyQuaternion(this.quaternion),this.position.add(Mh.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Sh,t)}translateY(t){return this.translateOnAxis(bh,t)}translateZ(t){return this.translateOnAxis(Eh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Hn.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Sa.copy(t):Sa.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,!1),ks.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Hn.lookAt(ks,Sa,this.up):Hn.lookAt(Sa,ks,this.up),this.quaternion.setFromRotationMatrix(Hn),s&&(Hn.extractRotation(s.matrixWorld),Zi.setFromRotationMatrix(Hn),this.quaternion.premultiply(Zi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(wh),qi.child=t,this.dispatchEvent(qi),qi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Tg),nr.child=t,this.dispatchEvent(nr),nr.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Hn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Hn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Hn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(wh),qi.child=t,this.dispatchEvent(qi),qi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ks,t,Eg),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ks,wg,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function a(r,l){return r[l.uuid]===void 0&&(r[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const l=r.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];a(t.shapes,f)}else a(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let l=0,c=this.material.length;l<c;l++)r.push(a(t.materials,this.material[l]));s.material=r}else s.material=a(t.materials,this.material);if(this.children.length>0){s.children=[];for(let r=0;r<this.children.length;r++)s.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let r=0;r<this.animations.length;r++){const l=this.animations[r];s.animations.push(a(t.animations,l))}}if(e){const r=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),f=o(t.shapes),d=o(t.skeletons),u=o(t.animations),p=o(t.nodes);r.length>0&&(i.geometries=r),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),d.length>0&&(i.skeletons=d),u.length>0&&(i.animations=u),p.length>0&&(i.nodes=p)}return i.object=s,i;function o(r){const l=[];for(const c in r){const h=r[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}De.DEFAULT_UP=new V(0,1,0);De.DEFAULT_MATRIX_AUTO_UPDATE=!0;De.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const bn=new V,Gn=new V,ir=new V,Vn=new V,ji=new V,Ki=new V,Th=new V,sr=new V,ar=new V,or=new V,rr=new Ce,cr=new Ce,lr=new Ce;class hn{constructor(t=new V,e=new V,i=new V){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),bn.subVectors(t,e),s.cross(bn);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(t,e,i,s,a){bn.subVectors(s,e),Gn.subVectors(i,e),ir.subVectors(t,e);const o=bn.dot(bn),r=bn.dot(Gn),l=bn.dot(ir),c=Gn.dot(Gn),h=Gn.dot(ir),f=o*c-r*r;if(f===0)return a.set(0,0,0),null;const d=1/f,u=(c*l-r*h)*d,p=(o*h-r*l)*d;return a.set(1-u-p,p,u)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,Vn)===null?!1:Vn.x>=0&&Vn.y>=0&&Vn.x+Vn.y<=1}static getInterpolation(t,e,i,s,a,o,r,l){return this.getBarycoord(t,e,i,s,Vn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,Vn.x),l.addScaledVector(o,Vn.y),l.addScaledVector(r,Vn.z),l)}static getInterpolatedAttribute(t,e,i,s,a,o){return rr.setScalar(0),cr.setScalar(0),lr.setScalar(0),rr.fromBufferAttribute(t,e),cr.fromBufferAttribute(t,i),lr.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(rr,a.x),o.addScaledVector(cr,a.y),o.addScaledVector(lr,a.z),o}static isFrontFacing(t,e,i,s){return bn.subVectors(i,e),Gn.subVectors(t,e),bn.cross(Gn).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return bn.subVectors(this.c,this.b),Gn.subVectors(this.a,this.b),bn.cross(Gn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return hn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return hn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,a){return hn.getInterpolation(t,this.a,this.b,this.c,e,i,s,a)}containsPoint(t){return hn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return hn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.b,a=this.c;let o,r;ji.subVectors(s,i),Ki.subVectors(a,i),sr.subVectors(t,i);const l=ji.dot(sr),c=Ki.dot(sr);if(l<=0&&c<=0)return e.copy(i);ar.subVectors(t,s);const h=ji.dot(ar),f=Ki.dot(ar);if(h>=0&&f<=h)return e.copy(s);const d=l*f-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(i).addScaledVector(ji,o);or.subVectors(t,a);const u=ji.dot(or),p=Ki.dot(or);if(p>=0&&u<=p)return e.copy(a);const _=u*c-l*p;if(_<=0&&c>=0&&p<=0)return r=c/(c-p),e.copy(i).addScaledVector(Ki,r);const g=h*p-u*f;if(g<=0&&f-h>=0&&u-p>=0)return Th.subVectors(a,s),r=(f-h)/(f-h+(u-p)),e.copy(s).addScaledVector(Th,r);const m=1/(g+_+d);return o=_*m,r=d*m,e.copy(i).addScaledVector(ji,o).addScaledVector(Ki,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const fu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ei={h:0,s:0,l:0},ba={h:0,s:0,l:0};function hr(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class qt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=je){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,he.toWorkingColorSpace(this,e),this}setRGB(t,e,i,s=he.workingColorSpace){return this.r=t,this.g=e,this.b=i,he.toWorkingColorSpace(this,s),this}setHSL(t,e,i,s=he.workingColorSpace){if(t=el(t,1),e=Xe(e,0,1),i=Xe(i,0,1),e===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+e):i+e-i*e,o=2*i-a;this.r=hr(o,a,t+1/3),this.g=hr(o,a,t),this.b=hr(o,a,t-1/3)}return he.toWorkingColorSpace(this,s),this}setStyle(t,e=je){function i(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let a;const o=s[1],r=s[2];switch(o){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,e);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,e);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const a=s[1],o=a.length;if(o===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(a,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=je){const i=fu[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Zn(t.r),this.g=Zn(t.g),this.b=Zn(t.b),this}copyLinearToSRGB(t){return this.r=ms(t.r),this.g=ms(t.g),this.b=ms(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=je){return he.fromWorkingColorSpace($e.copy(this),t),Math.round(Xe($e.r*255,0,255))*65536+Math.round(Xe($e.g*255,0,255))*256+Math.round(Xe($e.b*255,0,255))}getHexString(t=je){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=he.workingColorSpace){he.fromWorkingColorSpace($e.copy(this),e);const i=$e.r,s=$e.g,a=$e.b,o=Math.max(i,s,a),r=Math.min(i,s,a);let l,c;const h=(r+o)/2;if(r===o)l=0,c=0;else{const f=o-r;switch(c=h<=.5?f/(o+r):f/(2-o-r),o){case i:l=(s-a)/f+(s<a?6:0);break;case s:l=(a-i)/f+2;break;case a:l=(i-s)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=he.workingColorSpace){return he.fromWorkingColorSpace($e.copy(this),e),t.r=$e.r,t.g=$e.g,t.b=$e.b,t}getStyle(t=je){he.fromWorkingColorSpace($e.copy(this),t);const e=$e.r,i=$e.g,s=$e.b;return t!==je?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(ei),this.setHSL(ei.h+t,ei.s+e,ei.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(ei),t.getHSL(ba);const i=Vs(ei.h,ba.h,e),s=Vs(ei.s,ba.s,e),a=Vs(ei.l,ba.l,e);return this.setHSL(i,s,a),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,a=t.elements;return this.r=a[0]*e+a[3]*i+a[6]*s,this.g=a[1]*e+a[4]*i+a[7]*s,this.b=a[2]*e+a[5]*i+a[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const $e=new qt;qt.NAMES=fu;let Ag=0;class Fi extends Es{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ag++}),this.uuid=Fn(),this.name="",this.blending=us,this.side=li,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Xr,this.blendDst=Wr,this.blendEquation=Ai,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qt(0,0,0),this.blendAlpha=0,this.depthFunc=xs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ch,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Gi,this.stencilZFail=Gi,this.stencilZPass=Gi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==us&&(i.blending=this.blending),this.side!==li&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Xr&&(i.blendSrc=this.blendSrc),this.blendDst!==Wr&&(i.blendDst=this.blendDst),this.blendEquation!==Ai&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==xs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ch&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Gi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Gi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Gi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(a){const o=[];for(const r in a){const l=a[r];delete l.metadata,o.push(l)}return o}if(e){const a=s(t.textures),o=s(t.images);a.length>0&&(i.textures=a),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let a=0;a!==s;++a)i[a]=e[a].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class He extends Fi{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Nn,this.combine=Zc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Le=new V,Ea=new Bt;class Qe{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Cc,this.updateRanges=[],this.gpuType=$n,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Ea.fromBufferAttribute(this,e),Ea.applyMatrix3(t),this.setXY(e,Ea.x,Ea.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Le.fromBufferAttribute(this,e),Le.applyMatrix3(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Le.fromBufferAttribute(this,e),Le.applyMatrix4(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Le.fromBufferAttribute(this,e),Le.applyNormalMatrix(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Le.fromBufferAttribute(this,e),Le.transformDirection(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=En(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=me(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=En(e,this.array)),e}setX(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=En(e,this.array)),e}setY(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=En(e,this.array)),e}setZ(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=En(e,this.array)),e}setW(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=me(e,this.array),i=me(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=me(e,this.array),i=me(i,this.array),s=me(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,a){return t*=this.itemSize,this.normalized&&(e=me(e,this.array),i=me(i,this.array),s=me(s,this.array),a=me(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=a,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Cc&&(t.usage=this.usage),t}}class pu extends Qe{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class mu extends Qe{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class pe extends Qe{constructor(t,e,i){super(new Float32Array(t),e,i)}}let Rg=0;const fn=new Se,dr=new De,Ji=new V,cn=new ra,Us=new ra,Be=new V;class Ne extends Es{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Rg++}),this.uuid=Fn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(hu(t)?mu:pu)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new ee().getNormalMatrix(t);i.applyNormalMatrix(a),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return fn.makeRotationFromQuaternion(t),this.applyMatrix4(fn),this}rotateX(t){return fn.makeRotationX(t),this.applyMatrix4(fn),this}rotateY(t){return fn.makeRotationY(t),this.applyMatrix4(fn),this}rotateZ(t){return fn.makeRotationZ(t),this.applyMatrix4(fn),this}translate(t,e,i){return fn.makeTranslation(t,e,i),this.applyMatrix4(fn),this}scale(t,e,i){return fn.makeScale(t,e,i),this.applyMatrix4(fn),this}lookAt(t){return dr.lookAt(t),dr.updateMatrix(),this.applyMatrix4(dr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ji).negate(),this.translate(Ji.x,Ji.y,Ji.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let s=0,a=t.length;s<a;s++){const o=t[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new pe(i,3))}else{for(let i=0,s=e.count;i<s;i++){const a=t[i];e.setXYZ(i,a.x,a.y,a.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ra);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const a=e[i];cn.setFromBufferAttribute(a),this.morphTargetsRelative?(Be.addVectors(this.boundingBox.min,cn.min),this.boundingBox.expandByPoint(Be),Be.addVectors(this.boundingBox.max,cn.max),this.boundingBox.expandByPoint(Be)):(this.boundingBox.expandByPoint(cn.min),this.boundingBox.expandByPoint(cn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Eo);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new V,1/0);return}if(t){const i=this.boundingSphere.center;if(cn.setFromBufferAttribute(t),e)for(let a=0,o=e.length;a<o;a++){const r=e[a];Us.setFromBufferAttribute(r),this.morphTargetsRelative?(Be.addVectors(cn.min,Us.min),cn.expandByPoint(Be),Be.addVectors(cn.max,Us.max),cn.expandByPoint(Be)):(cn.expandByPoint(Us.min),cn.expandByPoint(Us.max))}cn.getCenter(i);let s=0;for(let a=0,o=t.count;a<o;a++)Be.fromBufferAttribute(t,a),s=Math.max(s,i.distanceToSquared(Be));if(e)for(let a=0,o=e.length;a<o;a++){const r=e[a],l=this.morphTargetsRelative;for(let c=0,h=r.count;c<h;c++)Be.fromBufferAttribute(r,c),l&&(Ji.fromBufferAttribute(t,c),Be.add(Ji)),s=Math.max(s,i.distanceToSquared(Be))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,s=e.normal,a=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Qe(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),r=[],l=[];for(let T=0;T<i.count;T++)r[T]=new V,l[T]=new V;const c=new V,h=new V,f=new V,d=new Bt,u=new Bt,p=new Bt,_=new V,g=new V;function m(T,b,M){c.fromBufferAttribute(i,T),h.fromBufferAttribute(i,b),f.fromBufferAttribute(i,M),d.fromBufferAttribute(a,T),u.fromBufferAttribute(a,b),p.fromBufferAttribute(a,M),h.sub(c),f.sub(c),u.sub(d),p.sub(d);const R=1/(u.x*p.y-p.x*u.y);isFinite(R)&&(_.copy(h).multiplyScalar(p.y).addScaledVector(f,-u.y).multiplyScalar(R),g.copy(f).multiplyScalar(u.x).addScaledVector(h,-p.x).multiplyScalar(R),r[T].add(_),r[b].add(_),r[M].add(_),l[T].add(g),l[b].add(g),l[M].add(g))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let T=0,b=x.length;T<b;++T){const M=x[T],R=M.start,F=M.count;for(let I=R,z=R+F;I<z;I+=3)m(t.getX(I+0),t.getX(I+1),t.getX(I+2))}const y=new V,v=new V,P=new V,S=new V;function w(T){P.fromBufferAttribute(s,T),S.copy(P);const b=r[T];y.copy(b),y.sub(P.multiplyScalar(P.dot(b))).normalize(),v.crossVectors(S,b);const R=v.dot(l[T])<0?-1:1;o.setXYZW(T,y.x,y.y,y.z,R)}for(let T=0,b=x.length;T<b;++T){const M=x[T],R=M.start,F=M.count;for(let I=R,z=R+F;I<z;I+=3)w(t.getX(I+0)),w(t.getX(I+1)),w(t.getX(I+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Qe(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,u=i.count;d<u;d++)i.setXYZ(d,0,0,0);const s=new V,a=new V,o=new V,r=new V,l=new V,c=new V,h=new V,f=new V;if(t)for(let d=0,u=t.count;d<u;d+=3){const p=t.getX(d+0),_=t.getX(d+1),g=t.getX(d+2);s.fromBufferAttribute(e,p),a.fromBufferAttribute(e,_),o.fromBufferAttribute(e,g),h.subVectors(o,a),f.subVectors(s,a),h.cross(f),r.fromBufferAttribute(i,p),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,g),r.add(h),l.add(h),c.add(h),i.setXYZ(p,r.x,r.y,r.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,u=e.count;d<u;d+=3)s.fromBufferAttribute(e,d+0),a.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,a),f.subVectors(s,a),h.cross(f),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Be.fromBufferAttribute(t,e),Be.normalize(),t.setXYZ(e,Be.x,Be.y,Be.z)}toNonIndexed(){function t(r,l){const c=r.array,h=r.itemSize,f=r.normalized,d=new c.constructor(l.length*h);let u=0,p=0;for(let _=0,g=l.length;_<g;_++){r.isInterleavedBufferAttribute?u=l[_]*r.data.stride+r.offset:u=l[_]*h;for(let m=0;m<h;m++)d[p++]=c[u++]}return new Qe(d,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ne,i=this.index.array,s=this.attributes;for(const r in s){const l=s[r],c=t(l,i);e.setAttribute(r,c)}const a=this.morphAttributes;for(const r in a){const l=[],c=a[r];for(let h=0,f=c.length;h<f;h++){const d=c[h],u=t(d,i);l.push(u)}e.morphAttributes[r]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,l=o.length;r<l;r++){const c=o[r];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let a=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,d=c.length;f<d;f++){const u=c[f];h.push(u.toJSON(t.data))}h.length>0&&(s[l]=h,a=!0)}a&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const a=t.morphAttributes;for(const c in a){const h=[],f=a[c];for(let d=0,u=f.length;d<u;d++)h.push(f[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ah=new Se,gi=new nl,wa=new Eo,Rh=new V,Ta=new V,Aa=new V,Ra=new V,ur=new V,Ca=new V,Ch=new V,Pa=new V;class ce extends De{constructor(t=new Ne,e=new He){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,o=s.length;a<o;a++){const r=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=a}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,a=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const r=this.morphTargetInfluences;if(a&&r){Ca.set(0,0,0);for(let l=0,c=a.length;l<c;l++){const h=r[l],f=a[l];h!==0&&(ur.fromBufferAttribute(f,t),o?Ca.addScaledVector(ur,h):Ca.addScaledVector(ur.sub(e),h))}e.add(Ca)}return e}raycast(t,e){const i=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),wa.copy(i.boundingSphere),wa.applyMatrix4(a),gi.copy(t.ray).recast(t.near),!(wa.containsPoint(gi.origin)===!1&&(gi.intersectSphere(wa,Rh)===null||gi.origin.distanceToSquared(Rh)>(t.far-t.near)**2))&&(Ah.copy(a).invert(),gi.copy(t.ray).applyMatrix4(Ah),!(i.boundingBox!==null&&gi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,gi)))}_computeIntersections(t,e,i){let s;const a=this.geometry,o=this.material,r=a.index,l=a.attributes.position,c=a.attributes.uv,h=a.attributes.uv1,f=a.attributes.normal,d=a.groups,u=a.drawRange;if(r!==null)if(Array.isArray(o))for(let p=0,_=d.length;p<_;p++){const g=d[p],m=o[g.materialIndex],x=Math.max(g.start,u.start),y=Math.min(r.count,Math.min(g.start+g.count,u.start+u.count));for(let v=x,P=y;v<P;v+=3){const S=r.getX(v),w=r.getX(v+1),T=r.getX(v+2);s=Da(this,m,t,i,c,h,f,S,w,T),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const p=Math.max(0,u.start),_=Math.min(r.count,u.start+u.count);for(let g=p,m=_;g<m;g+=3){const x=r.getX(g),y=r.getX(g+1),v=r.getX(g+2);s=Da(this,o,t,i,c,h,f,x,y,v),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let p=0,_=d.length;p<_;p++){const g=d[p],m=o[g.materialIndex],x=Math.max(g.start,u.start),y=Math.min(l.count,Math.min(g.start+g.count,u.start+u.count));for(let v=x,P=y;v<P;v+=3){const S=v,w=v+1,T=v+2;s=Da(this,m,t,i,c,h,f,S,w,T),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const p=Math.max(0,u.start),_=Math.min(l.count,u.start+u.count);for(let g=p,m=_;g<m;g+=3){const x=g,y=g+1,v=g+2;s=Da(this,o,t,i,c,h,f,x,y,v),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}}function Cg(n,t,e,i,s,a,o,r){let l;if(t.side===nn?l=i.intersectTriangle(o,a,s,!0,r):l=i.intersectTriangle(s,a,o,t.side===li,r),l===null)return null;Pa.copy(r),Pa.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(Pa);return c<e.near||c>e.far?null:{distance:c,point:Pa.clone(),object:n}}function Da(n,t,e,i,s,a,o,r,l,c){n.getVertexPosition(r,Ta),n.getVertexPosition(l,Aa),n.getVertexPosition(c,Ra);const h=Cg(n,t,e,i,Ta,Aa,Ra,Ch);if(h){const f=new V;hn.getBarycoord(Ch,Ta,Aa,Ra,f),s&&(h.uv=hn.getInterpolatedAttribute(s,r,l,c,f,new Bt)),a&&(h.uv1=hn.getInterpolatedAttribute(a,r,l,c,f,new Bt)),o&&(h.normal=hn.getInterpolatedAttribute(o,r,l,c,f,new V),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:r,b:l,c,normal:new V,materialIndex:0};hn.getNormal(Ta,Aa,Ra,d.normal),h.face=d,h.barycoord=f}return h}class An extends Ne{constructor(t=1,e=1,i=1,s=1,a=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:a,depthSegments:o};const r=this;s=Math.floor(s),a=Math.floor(a),o=Math.floor(o);const l=[],c=[],h=[],f=[];let d=0,u=0;p("z","y","x",-1,-1,i,e,t,o,a,0),p("z","y","x",1,-1,i,e,-t,o,a,1),p("x","z","y",1,1,t,i,e,s,o,2),p("x","z","y",1,-1,t,i,-e,s,o,3),p("x","y","z",1,-1,t,e,i,s,a,4),p("x","y","z",-1,-1,t,e,-i,s,a,5),this.setIndex(l),this.setAttribute("position",new pe(c,3)),this.setAttribute("normal",new pe(h,3)),this.setAttribute("uv",new pe(f,2));function p(_,g,m,x,y,v,P,S,w,T,b){const M=v/w,R=P/T,F=v/2,I=P/2,z=S/2,C=w+1,D=T+1;let X=0,H=0;const Z=new V;for(let Q=0;Q<D;Q++){const mt=Q*R-I;for(let dt=0;dt<C;dt++){const ut=dt*M-F;Z[_]=ut*x,Z[g]=mt*y,Z[m]=z,c.push(Z.x,Z.y,Z.z),Z[_]=0,Z[g]=0,Z[m]=S>0?1:-1,h.push(Z.x,Z.y,Z.z),f.push(dt/w),f.push(1-Q/T),X+=1}}for(let Q=0;Q<T;Q++)for(let mt=0;mt<w;mt++){const dt=d+mt+C*Q,ut=d+mt+C*(Q+1),K=d+(mt+1)+C*(Q+1),tt=d+(mt+1)+C*Q;l.push(dt,ut,tt),l.push(ut,K,tt),H+=6}r.addGroup(u,H,b),u+=H,d+=X}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new An(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ss(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function qe(n){const t={};for(let e=0;e<n.length;e++){const i=Ss(n[e]);for(const s in i)t[s]=i[s]}return t}function Pg(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function gu(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:he.workingColorSpace}const Dg={clone:Ss,merge:qe};var Lg=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ig=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class hi extends Fi{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Lg,this.fragmentShader=Ig,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ss(t.uniforms),this.uniformsGroups=Pg(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class xu extends De{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Se,this.projectionMatrix=new Se,this.projectionMatrixInverse=new Se,this.coordinateSystem=Yn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ni=new V,Ph=new Bt,Dh=new Bt;class mn extends xu{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Js*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ps*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Js*2*Math.atan(Math.tan(ps*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){ni.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ni.x,ni.y).multiplyScalar(-t/ni.z),ni.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ni.x,ni.y).multiplyScalar(-t/ni.z)}getViewSize(t,e){return this.getViewBounds(t,Ph,Dh),e.subVectors(Dh,Ph)}setViewOffset(t,e,i,s,a,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ps*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,a=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;a+=o.offsetX*s/l,e-=o.offsetY*i/c,s*=o.width/l,i*=o.height/c}const r=this.filmOffset;r!==0&&(a+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Qi=-90,ts=1;class kg extends De{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new mn(Qi,ts,t,e);s.layers=this.layers,this.add(s);const a=new mn(Qi,ts,t,e);a.layers=this.layers,this.add(a);const o=new mn(Qi,ts,t,e);o.layers=this.layers,this.add(o);const r=new mn(Qi,ts,t,e);r.layers=this.layers,this.add(r);const l=new mn(Qi,ts,t,e);l.layers=this.layers,this.add(l);const c=new mn(Qi,ts,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,s,a,o,r,l]=e;for(const c of e)this.remove(c);if(t===Yn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===uo)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[a,o,r,l,c,h]=this.children,f=t.getRenderTarget(),d=t.getActiveCubeFace(),u=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,a),t.setRenderTarget(i,1,s),t.render(e,o),t.setRenderTarget(i,2,s),t.render(e,r),t.setRenderTarget(i,3,s),t.render(e,l),t.setRenderTarget(i,4,s),t.render(e,c),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,s),t.render(e,h),t.setRenderTarget(f,d,u),t.xr.enabled=p,i.texture.needsPMREMUpdate=!0}}class vu extends Je{constructor(t,e,i,s,a,o,r,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:vs,super(t,e,i,s,a,o,r,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Ug extends ki{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new vu(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:kn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new An(5,5,5),a=new hi({name:"CubemapFromEquirect",uniforms:Ss(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:nn,blending:ri});a.uniforms.tEquirect.value=e;const o=new ce(s,a),r=e.minFilter;return e.minFilter===Pi&&(e.minFilter=kn),new kg(1,10,this).update(t,o),e.minFilter=r,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,s){const a=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,s);t.setRenderTarget(a)}}const fr=new V,Fg=new V,Ng=new ee;class bi{constructor(t=new V(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const s=fr.subVectors(i,e).cross(Fg.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(fr),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:e.copy(t.start).addScaledVector(i,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||Ng.getNormalMatrix(t),s=this.coplanarPoint(fr).applyMatrix4(t),a=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(a),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const xi=new Eo,La=new V;class sl{constructor(t=new bi,e=new bi,i=new bi,s=new bi,a=new bi,o=new bi){this.planes=[t,e,i,s,a,o]}set(t,e,i,s,a,o){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(s),r[4].copy(a),r[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Yn){const i=this.planes,s=t.elements,a=s[0],o=s[1],r=s[2],l=s[3],c=s[4],h=s[5],f=s[6],d=s[7],u=s[8],p=s[9],_=s[10],g=s[11],m=s[12],x=s[13],y=s[14],v=s[15];if(i[0].setComponents(l-a,d-c,g-u,v-m).normalize(),i[1].setComponents(l+a,d+c,g+u,v+m).normalize(),i[2].setComponents(l+o,d+h,g+p,v+x).normalize(),i[3].setComponents(l-o,d-h,g-p,v-x).normalize(),i[4].setComponents(l-r,d-f,g-_,v-y).normalize(),e===Yn)i[5].setComponents(l+r,d+f,g+_,v+y).normalize();else if(e===uo)i[5].setComponents(r,f,_,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),xi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),xi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(xi)}intersectsSprite(t){return xi.center.set(0,0,0),xi.radius=.7071067811865476,xi.applyMatrix4(t.matrixWorld),this.intersectsSphere(xi)}intersectsSphere(t){const e=this.planes,i=t.center,s=-t.radius;for(let a=0;a<6;a++)if(e[a].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const s=e[i];if(La.x=s.normal.x>0?t.max.x:t.min.x,La.y=s.normal.y>0?t.max.y:t.min.y,La.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(La)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function _u(){let n=null,t=!1,e=null,i=null;function s(a,o){e(a,o),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(a){e=a},setContext:function(a){n=a}}}function zg(n){const t=new WeakMap;function e(r,l){const c=r.array,h=r.usage,f=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,h),r.onUploadCallback();let u;if(c instanceof Float32Array)u=n.FLOAT;else if(c instanceof Uint16Array)r.isFloat16BufferAttribute?u=n.HALF_FLOAT:u=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)u=n.SHORT;else if(c instanceof Uint32Array)u=n.UNSIGNED_INT;else if(c instanceof Int32Array)u=n.INT;else if(c instanceof Int8Array)u=n.BYTE;else if(c instanceof Uint8Array)u=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)u=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:u,bytesPerElement:c.BYTES_PER_ELEMENT,version:r.version,size:f}}function i(r,l,c){const h=l.array,f=l.updateRanges;if(n.bindBuffer(c,r),f.length===0)n.bufferSubData(c,0,h);else{f.sort((u,p)=>u.start-p.start);let d=0;for(let u=1;u<f.length;u++){const p=f[d],_=f[u];_.start<=p.start+p.count+1?p.count=Math.max(p.count,_.start+_.count-p.start):(++d,f[d]=_)}f.length=d+1;for(let u=0,p=f.length;u<p;u++){const _=f[u];n.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function a(r){r.isInterleavedBufferAttribute&&(r=r.data);const l=t.get(r);l&&(n.deleteBuffer(l.buffer),t.delete(r))}function o(r,l){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const h=t.get(r);(!h||h.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const c=t.get(r);if(c===void 0)t.set(r,e(r,l));else if(c.version<r.version){if(c.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,r,l),c.version=r.version}}return{get:s,remove:a,update:o}}class pn extends Ne{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};const a=t/2,o=e/2,r=Math.floor(i),l=Math.floor(s),c=r+1,h=l+1,f=t/r,d=e/l,u=[],p=[],_=[],g=[];for(let m=0;m<h;m++){const x=m*d-o;for(let y=0;y<c;y++){const v=y*f-a;p.push(v,-x,0),_.push(0,0,1),g.push(y/r),g.push(1-m/l)}}for(let m=0;m<l;m++)for(let x=0;x<r;x++){const y=x+c*m,v=x+c*(m+1),P=x+1+c*(m+1),S=x+1+c*m;u.push(y,v,S),u.push(v,P,S)}this.setIndex(u),this.setAttribute("position",new pe(p,3)),this.setAttribute("normal",new pe(_,3)),this.setAttribute("uv",new pe(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new pn(t.width,t.height,t.widthSegments,t.heightSegments)}}var Og=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Bg=`#ifdef USE_ALPHAHASH
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
#endif`,Hg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Gg=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Vg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Xg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Wg=`#ifdef USE_AOMAP
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
#endif`,$g=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Yg=`#ifdef USE_BATCHING
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
#endif`,Zg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,qg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,jg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Kg=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Jg=`#ifdef USE_IRIDESCENCE
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
#endif`,Qg=`#ifdef USE_BUMPMAP
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
#endif`,tx=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,ex=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,nx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ix=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,sx=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,ax=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,ox=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,rx=`#if defined( USE_COLOR_ALPHA )
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
#endif`,cx=`#define PI 3.141592653589793
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
} // validated`,lx=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,hx=`vec3 transformedNormal = objectNormal;
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
#endif`,dx=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ux=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,fx=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,px=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,mx="gl_FragColor = linearToOutputTexel( gl_FragColor );",gx=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,xx=`#ifdef USE_ENVMAP
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
#endif`,vx=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,_x=`#ifdef USE_ENVMAP
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
#endif`,yx=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Mx=`#ifdef USE_ENVMAP
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
#endif`,Sx=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,bx=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ex=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,wx=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Tx=`#ifdef USE_GRADIENTMAP
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
}`,Ax=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Rx=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Cx=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Px=`uniform bool receiveShadow;
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
#endif`,Dx=`#ifdef USE_ENVMAP
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
#endif`,Lx=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ix=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,kx=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ux=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Fx=`PhysicalMaterial material;
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
#endif`,Nx=`struct PhysicalMaterial {
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
}`,zx=`
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
#endif`,Ox=`#if defined( RE_IndirectDiffuse )
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
#endif`,Bx=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Hx=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Gx=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Vx=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Xx=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Wx=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,$x=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Yx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Zx=`#if defined( USE_POINTS_UV )
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
#endif`,qx=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,jx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Kx=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Jx=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Qx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,tv=`#ifdef USE_MORPHTARGETS
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
#endif`,ev=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,nv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,iv=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,sv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,av=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ov=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,rv=`#ifdef USE_NORMALMAP
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
#endif`,cv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,lv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,hv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,dv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,uv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,fv=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,pv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,mv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,gv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,xv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,vv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,_v=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,yv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Mv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Sv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,bv=`float getShadowMask() {
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
}`,Ev=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,wv=`#ifdef USE_SKINNING
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
#endif`,Tv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Av=`#ifdef USE_SKINNING
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
#endif`,Rv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Cv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Pv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Dv=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Lv=`#ifdef USE_TRANSMISSION
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
#endif`,Iv=`#ifdef USE_TRANSMISSION
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
#endif`,kv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Uv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Fv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Nv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const zv=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ov=`uniform sampler2D t2D;
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
}`,Bv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Hv=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Gv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Vv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Xv=`#include <common>
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
}`,Wv=`#if DEPTH_PACKING == 3200
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
}`,$v=`#define DISTANCE
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
}`,Yv=`#define DISTANCE
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
}`,Zv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,qv=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jv=`uniform float scale;
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
}`,Kv=`uniform vec3 diffuse;
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
}`,Jv=`#include <common>
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
}`,Qv=`uniform vec3 diffuse;
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
}`,t_=`#define LAMBERT
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
}`,e_=`#define LAMBERT
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
}`,n_=`#define MATCAP
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
}`,i_=`#define MATCAP
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
}`,s_=`#define NORMAL
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
}`,a_=`#define NORMAL
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
}`,o_=`#define PHONG
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
}`,r_=`#define PHONG
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
}`,c_=`#define STANDARD
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
}`,l_=`#define STANDARD
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
}`,h_=`#define TOON
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
}`,d_=`#define TOON
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
}`,u_=`uniform float size;
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
}`,f_=`uniform vec3 diffuse;
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
}`,p_=`#include <common>
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
}`,m_=`uniform vec3 color;
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
}`,g_=`uniform float rotation;
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
}`,x_=`uniform vec3 diffuse;
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
}`,ne={alphahash_fragment:Og,alphahash_pars_fragment:Bg,alphamap_fragment:Hg,alphamap_pars_fragment:Gg,alphatest_fragment:Vg,alphatest_pars_fragment:Xg,aomap_fragment:Wg,aomap_pars_fragment:$g,batching_pars_vertex:Yg,batching_vertex:Zg,begin_vertex:qg,beginnormal_vertex:jg,bsdfs:Kg,iridescence_fragment:Jg,bumpmap_pars_fragment:Qg,clipping_planes_fragment:tx,clipping_planes_pars_fragment:ex,clipping_planes_pars_vertex:nx,clipping_planes_vertex:ix,color_fragment:sx,color_pars_fragment:ax,color_pars_vertex:ox,color_vertex:rx,common:cx,cube_uv_reflection_fragment:lx,defaultnormal_vertex:hx,displacementmap_pars_vertex:dx,displacementmap_vertex:ux,emissivemap_fragment:fx,emissivemap_pars_fragment:px,colorspace_fragment:mx,colorspace_pars_fragment:gx,envmap_fragment:xx,envmap_common_pars_fragment:vx,envmap_pars_fragment:_x,envmap_pars_vertex:yx,envmap_physical_pars_fragment:Dx,envmap_vertex:Mx,fog_vertex:Sx,fog_pars_vertex:bx,fog_fragment:Ex,fog_pars_fragment:wx,gradientmap_pars_fragment:Tx,lightmap_pars_fragment:Ax,lights_lambert_fragment:Rx,lights_lambert_pars_fragment:Cx,lights_pars_begin:Px,lights_toon_fragment:Lx,lights_toon_pars_fragment:Ix,lights_phong_fragment:kx,lights_phong_pars_fragment:Ux,lights_physical_fragment:Fx,lights_physical_pars_fragment:Nx,lights_fragment_begin:zx,lights_fragment_maps:Ox,lights_fragment_end:Bx,logdepthbuf_fragment:Hx,logdepthbuf_pars_fragment:Gx,logdepthbuf_pars_vertex:Vx,logdepthbuf_vertex:Xx,map_fragment:Wx,map_pars_fragment:$x,map_particle_fragment:Yx,map_particle_pars_fragment:Zx,metalnessmap_fragment:qx,metalnessmap_pars_fragment:jx,morphinstance_vertex:Kx,morphcolor_vertex:Jx,morphnormal_vertex:Qx,morphtarget_pars_vertex:tv,morphtarget_vertex:ev,normal_fragment_begin:nv,normal_fragment_maps:iv,normal_pars_fragment:sv,normal_pars_vertex:av,normal_vertex:ov,normalmap_pars_fragment:rv,clearcoat_normal_fragment_begin:cv,clearcoat_normal_fragment_maps:lv,clearcoat_pars_fragment:hv,iridescence_pars_fragment:dv,opaque_fragment:uv,packing:fv,premultiplied_alpha_fragment:pv,project_vertex:mv,dithering_fragment:gv,dithering_pars_fragment:xv,roughnessmap_fragment:vv,roughnessmap_pars_fragment:_v,shadowmap_pars_fragment:yv,shadowmap_pars_vertex:Mv,shadowmap_vertex:Sv,shadowmask_pars_fragment:bv,skinbase_vertex:Ev,skinning_pars_vertex:wv,skinning_vertex:Tv,skinnormal_vertex:Av,specularmap_fragment:Rv,specularmap_pars_fragment:Cv,tonemapping_fragment:Pv,tonemapping_pars_fragment:Dv,transmission_fragment:Lv,transmission_pars_fragment:Iv,uv_pars_fragment:kv,uv_pars_vertex:Uv,uv_vertex:Fv,worldpos_vertex:Nv,background_vert:zv,background_frag:Ov,backgroundCube_vert:Bv,backgroundCube_frag:Hv,cube_vert:Gv,cube_frag:Vv,depth_vert:Xv,depth_frag:Wv,distanceRGBA_vert:$v,distanceRGBA_frag:Yv,equirect_vert:Zv,equirect_frag:qv,linedashed_vert:jv,linedashed_frag:Kv,meshbasic_vert:Jv,meshbasic_frag:Qv,meshlambert_vert:t_,meshlambert_frag:e_,meshmatcap_vert:n_,meshmatcap_frag:i_,meshnormal_vert:s_,meshnormal_frag:a_,meshphong_vert:o_,meshphong_frag:r_,meshphysical_vert:c_,meshphysical_frag:l_,meshtoon_vert:h_,meshtoon_frag:d_,points_vert:u_,points_frag:f_,shadow_vert:p_,shadow_frag:m_,sprite_vert:g_,sprite_frag:x_},Ft={common:{diffuse:{value:new qt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ee},alphaMap:{value:null},alphaMapTransform:{value:new ee},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ee}},envmap:{envMap:{value:null},envMapRotation:{value:new ee},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ee}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ee}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ee},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ee},normalScale:{value:new Bt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ee},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ee}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ee}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ee}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new qt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ee},alphaTest:{value:0},uvTransform:{value:new ee}},sprite:{diffuse:{value:new qt(16777215)},opacity:{value:1},center:{value:new Bt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ee},alphaMap:{value:null},alphaMapTransform:{value:new ee},alphaTest:{value:0}}},In={basic:{uniforms:qe([Ft.common,Ft.specularmap,Ft.envmap,Ft.aomap,Ft.lightmap,Ft.fog]),vertexShader:ne.meshbasic_vert,fragmentShader:ne.meshbasic_frag},lambert:{uniforms:qe([Ft.common,Ft.specularmap,Ft.envmap,Ft.aomap,Ft.lightmap,Ft.emissivemap,Ft.bumpmap,Ft.normalmap,Ft.displacementmap,Ft.fog,Ft.lights,{emissive:{value:new qt(0)}}]),vertexShader:ne.meshlambert_vert,fragmentShader:ne.meshlambert_frag},phong:{uniforms:qe([Ft.common,Ft.specularmap,Ft.envmap,Ft.aomap,Ft.lightmap,Ft.emissivemap,Ft.bumpmap,Ft.normalmap,Ft.displacementmap,Ft.fog,Ft.lights,{emissive:{value:new qt(0)},specular:{value:new qt(1118481)},shininess:{value:30}}]),vertexShader:ne.meshphong_vert,fragmentShader:ne.meshphong_frag},standard:{uniforms:qe([Ft.common,Ft.envmap,Ft.aomap,Ft.lightmap,Ft.emissivemap,Ft.bumpmap,Ft.normalmap,Ft.displacementmap,Ft.roughnessmap,Ft.metalnessmap,Ft.fog,Ft.lights,{emissive:{value:new qt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ne.meshphysical_vert,fragmentShader:ne.meshphysical_frag},toon:{uniforms:qe([Ft.common,Ft.aomap,Ft.lightmap,Ft.emissivemap,Ft.bumpmap,Ft.normalmap,Ft.displacementmap,Ft.gradientmap,Ft.fog,Ft.lights,{emissive:{value:new qt(0)}}]),vertexShader:ne.meshtoon_vert,fragmentShader:ne.meshtoon_frag},matcap:{uniforms:qe([Ft.common,Ft.bumpmap,Ft.normalmap,Ft.displacementmap,Ft.fog,{matcap:{value:null}}]),vertexShader:ne.meshmatcap_vert,fragmentShader:ne.meshmatcap_frag},points:{uniforms:qe([Ft.points,Ft.fog]),vertexShader:ne.points_vert,fragmentShader:ne.points_frag},dashed:{uniforms:qe([Ft.common,Ft.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ne.linedashed_vert,fragmentShader:ne.linedashed_frag},depth:{uniforms:qe([Ft.common,Ft.displacementmap]),vertexShader:ne.depth_vert,fragmentShader:ne.depth_frag},normal:{uniforms:qe([Ft.common,Ft.bumpmap,Ft.normalmap,Ft.displacementmap,{opacity:{value:1}}]),vertexShader:ne.meshnormal_vert,fragmentShader:ne.meshnormal_frag},sprite:{uniforms:qe([Ft.sprite,Ft.fog]),vertexShader:ne.sprite_vert,fragmentShader:ne.sprite_frag},background:{uniforms:{uvTransform:{value:new ee},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ne.background_vert,fragmentShader:ne.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ee}},vertexShader:ne.backgroundCube_vert,fragmentShader:ne.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ne.cube_vert,fragmentShader:ne.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ne.equirect_vert,fragmentShader:ne.equirect_frag},distanceRGBA:{uniforms:qe([Ft.common,Ft.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ne.distanceRGBA_vert,fragmentShader:ne.distanceRGBA_frag},shadow:{uniforms:qe([Ft.lights,Ft.fog,{color:{value:new qt(0)},opacity:{value:1}}]),vertexShader:ne.shadow_vert,fragmentShader:ne.shadow_frag}};In.physical={uniforms:qe([In.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ee},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ee},clearcoatNormalScale:{value:new Bt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ee},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ee},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ee},sheen:{value:0},sheenColor:{value:new qt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ee},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ee},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ee},transmissionSamplerSize:{value:new Bt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ee},attenuationDistance:{value:0},attenuationColor:{value:new qt(0)},specularColor:{value:new qt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ee},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ee},anisotropyVector:{value:new Bt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ee}}]),vertexShader:ne.meshphysical_vert,fragmentShader:ne.meshphysical_frag};const Ia={r:0,b:0,g:0},vi=new Nn,v_=new Se;function __(n,t,e,i,s,a,o){const r=new qt(0);let l=a===!0?0:1,c,h,f=null,d=0,u=null;function p(x){let y=x.isScene===!0?x.background:null;return y&&y.isTexture&&(y=(x.backgroundBlurriness>0?e:t).get(y)),y}function _(x){let y=!1;const v=p(x);v===null?m(r,l):v&&v.isColor&&(m(v,1),y=!0);const P=n.xr.getEnvironmentBlendMode();P==="additive"?i.buffers.color.setClear(0,0,0,1,o):P==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||y)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(x,y){const v=p(y);v&&(v.isCubeTexture||v.mapping===So)?(h===void 0&&(h=new ce(new An(1,1,1),new hi({name:"BackgroundCubeMaterial",uniforms:Ss(In.backgroundCube.uniforms),vertexShader:In.backgroundCube.vertexShader,fragmentShader:In.backgroundCube.fragmentShader,side:nn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(P,S,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),vi.copy(y.backgroundRotation),vi.x*=-1,vi.y*=-1,vi.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(vi.y*=-1,vi.z*=-1),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(v_.makeRotationFromEuler(vi)),h.material.toneMapped=he.getTransfer(v.colorSpace)!==xe,(f!==v||d!==v.version||u!==n.toneMapping)&&(h.material.needsUpdate=!0,f=v,d=v.version,u=n.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new ce(new pn(2,2),new hi({name:"BackgroundMaterial",uniforms:Ss(In.background.uniforms),vertexShader:In.background.vertexShader,fragmentShader:In.background.fragmentShader,side:li,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=he.getTransfer(v.colorSpace)!==xe,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(f!==v||d!==v.version||u!==n.toneMapping)&&(c.material.needsUpdate=!0,f=v,d=v.version,u=n.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null))}function m(x,y){x.getRGB(Ia,gu(n)),i.buffers.color.setClear(Ia.r,Ia.g,Ia.b,y,o)}return{getClearColor:function(){return r},setClearColor:function(x,y=1){r.set(x),l=y,m(r,l)},getClearAlpha:function(){return l},setClearAlpha:function(x){l=x,m(r,l)},render:_,addToRenderList:g}}function y_(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null);let a=s,o=!1;function r(M,R,F,I,z){let C=!1;const D=f(I,F,R);a!==D&&(a=D,c(a.object)),C=u(M,I,F,z),C&&p(M,I,F,z),z!==null&&t.update(z,n.ELEMENT_ARRAY_BUFFER),(C||o)&&(o=!1,v(M,R,F,I),z!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(z).buffer))}function l(){return n.createVertexArray()}function c(M){return n.bindVertexArray(M)}function h(M){return n.deleteVertexArray(M)}function f(M,R,F){const I=F.wireframe===!0;let z=i[M.id];z===void 0&&(z={},i[M.id]=z);let C=z[R.id];C===void 0&&(C={},z[R.id]=C);let D=C[I];return D===void 0&&(D=d(l()),C[I]=D),D}function d(M){const R=[],F=[],I=[];for(let z=0;z<e;z++)R[z]=0,F[z]=0,I[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:F,attributeDivisors:I,object:M,attributes:{},index:null}}function u(M,R,F,I){const z=a.attributes,C=R.attributes;let D=0;const X=F.getAttributes();for(const H in X)if(X[H].location>=0){const Q=z[H];let mt=C[H];if(mt===void 0&&(H==="instanceMatrix"&&M.instanceMatrix&&(mt=M.instanceMatrix),H==="instanceColor"&&M.instanceColor&&(mt=M.instanceColor)),Q===void 0||Q.attribute!==mt||mt&&Q.data!==mt.data)return!0;D++}return a.attributesNum!==D||a.index!==I}function p(M,R,F,I){const z={},C=R.attributes;let D=0;const X=F.getAttributes();for(const H in X)if(X[H].location>=0){let Q=C[H];Q===void 0&&(H==="instanceMatrix"&&M.instanceMatrix&&(Q=M.instanceMatrix),H==="instanceColor"&&M.instanceColor&&(Q=M.instanceColor));const mt={};mt.attribute=Q,Q&&Q.data&&(mt.data=Q.data),z[H]=mt,D++}a.attributes=z,a.attributesNum=D,a.index=I}function _(){const M=a.newAttributes;for(let R=0,F=M.length;R<F;R++)M[R]=0}function g(M){m(M,0)}function m(M,R){const F=a.newAttributes,I=a.enabledAttributes,z=a.attributeDivisors;F[M]=1,I[M]===0&&(n.enableVertexAttribArray(M),I[M]=1),z[M]!==R&&(n.vertexAttribDivisor(M,R),z[M]=R)}function x(){const M=a.newAttributes,R=a.enabledAttributes;for(let F=0,I=R.length;F<I;F++)R[F]!==M[F]&&(n.disableVertexAttribArray(F),R[F]=0)}function y(M,R,F,I,z,C,D){D===!0?n.vertexAttribIPointer(M,R,F,z,C):n.vertexAttribPointer(M,R,F,I,z,C)}function v(M,R,F,I){_();const z=I.attributes,C=F.getAttributes(),D=R.defaultAttributeValues;for(const X in C){const H=C[X];if(H.location>=0){let Z=z[X];if(Z===void 0&&(X==="instanceMatrix"&&M.instanceMatrix&&(Z=M.instanceMatrix),X==="instanceColor"&&M.instanceColor&&(Z=M.instanceColor)),Z!==void 0){const Q=Z.normalized,mt=Z.itemSize,dt=t.get(Z);if(dt===void 0)continue;const ut=dt.buffer,K=dt.type,tt=dt.bytesPerElement,ht=K===n.INT||K===n.UNSIGNED_INT||Z.gpuType===qc;if(Z.isInterleavedBufferAttribute){const j=Z.data,Mt=j.stride,kt=Z.offset;if(j.isInstancedInterleavedBuffer){for(let Ct=0;Ct<H.locationSize;Ct++)m(H.location+Ct,j.meshPerAttribute);M.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let Ct=0;Ct<H.locationSize;Ct++)g(H.location+Ct);n.bindBuffer(n.ARRAY_BUFFER,ut);for(let Ct=0;Ct<H.locationSize;Ct++)y(H.location+Ct,mt/H.locationSize,K,Q,Mt*tt,(kt+mt/H.locationSize*Ct)*tt,ht)}else{if(Z.isInstancedBufferAttribute){for(let j=0;j<H.locationSize;j++)m(H.location+j,Z.meshPerAttribute);M.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let j=0;j<H.locationSize;j++)g(H.location+j);n.bindBuffer(n.ARRAY_BUFFER,ut);for(let j=0;j<H.locationSize;j++)y(H.location+j,mt/H.locationSize,K,Q,mt*tt,mt/H.locationSize*j*tt,ht)}}else if(D!==void 0){const Q=D[X];if(Q!==void 0)switch(Q.length){case 2:n.vertexAttrib2fv(H.location,Q);break;case 3:n.vertexAttrib3fv(H.location,Q);break;case 4:n.vertexAttrib4fv(H.location,Q);break;default:n.vertexAttrib1fv(H.location,Q)}}}}x()}function P(){T();for(const M in i){const R=i[M];for(const F in R){const I=R[F];for(const z in I)h(I[z].object),delete I[z];delete R[F]}delete i[M]}}function S(M){if(i[M.id]===void 0)return;const R=i[M.id];for(const F in R){const I=R[F];for(const z in I)h(I[z].object),delete I[z];delete R[F]}delete i[M.id]}function w(M){for(const R in i){const F=i[R];if(F[M.id]===void 0)continue;const I=F[M.id];for(const z in I)h(I[z].object),delete I[z];delete F[M.id]}}function T(){b(),o=!0,a!==s&&(a=s,c(a.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:r,reset:T,resetDefaultState:b,dispose:P,releaseStatesOfGeometry:S,releaseStatesOfProgram:w,initAttributes:_,enableAttribute:g,disableUnusedAttributes:x}}function M_(n,t,e){let i;function s(c){i=c}function a(c,h){n.drawArrays(i,c,h),e.update(h,i,1)}function o(c,h,f){f!==0&&(n.drawArraysInstanced(i,c,h,f),e.update(h,i,f))}function r(c,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,f);let u=0;for(let p=0;p<f;p++)u+=h[p];e.update(u,i,1)}function l(c,h,f,d){if(f===0)return;const u=t.get("WEBGL_multi_draw");if(u===null)for(let p=0;p<c.length;p++)o(c[p],h[p],d[p]);else{u.multiDrawArraysInstancedWEBGL(i,c,0,h,0,d,0,f);let p=0;for(let _=0;_<f;_++)p+=h[_]*d[_];e.update(p,i,1)}}this.setMode=s,this.render=a,this.renderInstances=o,this.renderMultiDraw=r,this.renderMultiDrawInstances=l}function S_(n,t,e,i){let s;function a(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const w=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(w){return!(w!==wn&&i.convert(w)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(w){const T=w===aa&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(w!==qn&&i.convert(w)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==$n&&!T)}function l(w){if(w==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),m=n.getParameter(n.MAX_VERTEX_ATTRIBS),x=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),y=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),P=p>0,S=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:r,precision:c,logarithmicDepthBuffer:f,reverseDepthBuffer:d,maxTextures:u,maxVertexTextures:p,maxTextureSize:_,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:x,maxVaryings:y,maxFragmentUniforms:v,vertexTextures:P,maxSamples:S}}function b_(n){const t=this;let e=null,i=0,s=!1,a=!1;const o=new bi,r=new ee,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const u=f.length!==0||d||i!==0||s;return s=d,i=f.length,u},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(f,d){e=h(f,d,0)},this.setState=function(f,d,u){const p=f.clippingPlanes,_=f.clipIntersection,g=f.clipShadows,m=n.get(f);if(!s||p===null||p.length===0||a&&!g)a?h(null):c();else{const x=a?0:i,y=x*4;let v=m.clippingState||null;l.value=v,v=h(p,d,y,u);for(let P=0;P!==y;++P)v[P]=e[P];m.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(f,d,u,p){const _=f!==null?f.length:0;let g=null;if(_!==0){if(g=l.value,p!==!0||g===null){const m=u+_*4,x=d.matrixWorldInverse;r.getNormalMatrix(x),(g===null||g.length<m)&&(g=new Float32Array(m));for(let y=0,v=u;y!==_;++y,v+=4)o.copy(f[y]).applyMatrix4(x,r),o.normal.toArray(g,v),g[v+3]=o.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,g}}function E_(n){let t=new WeakMap;function e(o,r){return r===Qr?o.mapping=vs:r===tc&&(o.mapping=_s),o}function i(o){if(o&&o.isTexture){const r=o.mapping;if(r===Qr||r===tc)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Ug(l.height);return c.fromEquirectangularTexture(n,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){const r=o.target;r.removeEventListener("dispose",s);const l=t.get(r);l!==void 0&&(t.delete(r),l.dispose())}function a(){t=new WeakMap}return{get:i,dispose:a}}class yu extends xu{constructor(t=-1,e=1,i=1,s=-1,a=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=a,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,a,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=i-t,o=i+t,r=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=c*this.view.offsetX,o=a+c*this.view.width,r-=h*this.view.offsetY,l=r-h*this.view.height}this.projectionMatrix.makeOrthographic(a,o,r,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const ls=4,Lh=[.125,.215,.35,.446,.526,.582],Ri=20,pr=new yu,Ih=new qt;let mr=null,gr=0,xr=0,vr=!1;const Ei=(1+Math.sqrt(5))/2,es=1/Ei,kh=[new V(-Ei,es,0),new V(Ei,es,0),new V(-es,0,Ei),new V(es,0,Ei),new V(0,Ei,-es),new V(0,Ei,es),new V(-1,1,-1),new V(1,1,-1),new V(-1,1,1),new V(1,1,1)];class Uh{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100){mr=this._renderer.getRenderTarget(),gr=this._renderer.getActiveCubeFace(),xr=this._renderer.getActiveMipmapLevel(),vr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(t,i,s,a),e>0&&this._blur(a,0,0,e),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=zh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Nh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(mr,gr,xr),this._renderer.xr.enabled=vr,t.scissorTest=!1,ka(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===vs||t.mapping===_s?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),mr=this._renderer.getRenderTarget(),gr=this._renderer.getActiveCubeFace(),xr=this._renderer.getActiveMipmapLevel(),vr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:kn,minFilter:kn,generateMipmaps:!1,type:aa,format:wn,colorSpace:bs,depthBuffer:!1},s=Fh(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Fh(t,e,i);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=w_(a)),this._blurMaterial=T_(a,t,e)}return s}_compileMaterial(t){const e=new ce(this._lodPlanes[0],t);this._renderer.compile(e,pr)}_sceneToCubeUV(t,e,i,s){const r=new mn(90,1,e,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,d=h.toneMapping;h.getClearColor(Ih),h.toneMapping=ci,h.autoClear=!1;const u=new He({name:"PMREM.Background",side:nn,depthWrite:!1,depthTest:!1}),p=new ce(new An,u);let _=!1;const g=t.background;g?g.isColor&&(u.color.copy(g),t.background=null,_=!0):(u.color.copy(Ih),_=!0);for(let m=0;m<6;m++){const x=m%3;x===0?(r.up.set(0,l[m],0),r.lookAt(c[m],0,0)):x===1?(r.up.set(0,0,l[m]),r.lookAt(0,c[m],0)):(r.up.set(0,l[m],0),r.lookAt(0,0,c[m]));const y=this._cubeSize;ka(s,x*y,m>2?y:0,y,y),h.setRenderTarget(s),_&&h.render(p,r),h.render(t,r)}p.geometry.dispose(),p.material.dispose(),h.toneMapping=d,h.autoClear=f,t.background=g}_textureToCubeUV(t,e){const i=this._renderer,s=t.mapping===vs||t.mapping===_s;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=zh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Nh());const a=s?this._cubemapMaterial:this._equirectMaterial,o=new ce(this._lodPlanes[0],a),r=a.uniforms;r.envMap.value=t;const l=this._cubeSize;ka(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(o,pr)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let a=1;a<s;a++){const o=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),r=kh[(s-a-1)%kh.length];this._blur(t,a-1,a,o,r)}e.autoClear=i}_blur(t,e,i,s,a){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,s,"latitudinal",a),this._halfBlur(o,t,i,i,s,"longitudinal",a)}_halfBlur(t,e,i,s,a,o,r){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new ce(this._lodPlanes[s],c),d=c.uniforms,u=this._sizeLods[i]-1,p=isFinite(a)?Math.PI/(2*u):2*Math.PI/(2*Ri-1),_=a/p,g=isFinite(a)?1+Math.floor(h*_):Ri;g>Ri&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Ri}`);const m=[];let x=0;for(let w=0;w<Ri;++w){const T=w/_,b=Math.exp(-T*T/2);m.push(b),w===0?x+=b:w<g&&(x+=2*b)}for(let w=0;w<m.length;w++)m[w]=m[w]/x;d.envMap.value=t.texture,d.samples.value=g,d.weights.value=m,d.latitudinal.value=o==="latitudinal",r&&(d.poleAxis.value=r);const{_lodMax:y}=this;d.dTheta.value=p,d.mipInt.value=y-i;const v=this._sizeLods[s],P=3*v*(s>y-ls?s-y+ls:0),S=4*(this._cubeSize-v);ka(e,P,S,3*v,2*v),l.setRenderTarget(e),l.render(f,pr)}}function w_(n){const t=[],e=[],i=[];let s=n;const a=n-ls+1+Lh.length;for(let o=0;o<a;o++){const r=Math.pow(2,s);e.push(r);let l=1/r;o>n-ls?l=Lh[o-n+ls-1]:o===0&&(l=0),i.push(l);const c=1/(r-2),h=-c,f=1+c,d=[h,h,f,h,f,f,h,h,f,f,h,f],u=6,p=6,_=3,g=2,m=1,x=new Float32Array(_*p*u),y=new Float32Array(g*p*u),v=new Float32Array(m*p*u);for(let S=0;S<u;S++){const w=S%3*2/3-1,T=S>2?0:-1,b=[w,T,0,w+2/3,T,0,w+2/3,T+1,0,w,T,0,w+2/3,T+1,0,w,T+1,0];x.set(b,_*p*S),y.set(d,g*p*S);const M=[S,S,S,S,S,S];v.set(M,m*p*S)}const P=new Ne;P.setAttribute("position",new Qe(x,_)),P.setAttribute("uv",new Qe(y,g)),P.setAttribute("faceIndex",new Qe(v,m)),t.push(P),s>ls&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Fh(n,t,e){const i=new ki(n,t,e);return i.texture.mapping=So,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function ka(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function T_(n,t,e){const i=new Float32Array(Ri),s=new V(0,1,0);return new hi({name:"SphericalGaussianBlur",defines:{n:Ri,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:al(),fragmentShader:`

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
		`,blending:ri,depthTest:!1,depthWrite:!1})}function Nh(){return new hi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:al(),fragmentShader:`

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
		`,blending:ri,depthTest:!1,depthWrite:!1})}function zh(){return new hi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:al(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ri,depthTest:!1,depthWrite:!1})}function al(){return`

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
	`}function A_(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const l=r.mapping,c=l===Qr||l===tc,h=l===vs||l===_s;if(c||h){let f=t.get(r);const d=f!==void 0?f.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==d)return e===null&&(e=new Uh(n)),f=c?e.fromEquirectangular(r,f):e.fromCubemap(r,f),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),f.texture;if(f!==void 0)return f.texture;{const u=r.image;return c&&u&&u.height>0||h&&u&&s(u)?(e===null&&(e=new Uh(n)),f=c?e.fromEquirectangular(r):e.fromCubemap(r),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),r.addEventListener("dispose",a),f.texture):null}}}return r}function s(r){let l=0;const c=6;for(let h=0;h<c;h++)r[h]!==void 0&&l++;return l===c}function a(r){const l=r.target;l.removeEventListener("dispose",a);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function R_(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const s=e(i);return s===null&&Bs("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function C_(n,t,e,i){const s={},a=new WeakMap;function o(f){const d=f.target;d.index!==null&&t.remove(d.index);for(const p in d.attributes)t.remove(d.attributes[p]);for(const p in d.morphAttributes){const _=d.morphAttributes[p];for(let g=0,m=_.length;g<m;g++)t.remove(_[g])}d.removeEventListener("dispose",o),delete s[d.id];const u=a.get(d);u&&(t.remove(u),a.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function r(f,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function l(f){const d=f.attributes;for(const p in d)t.update(d[p],n.ARRAY_BUFFER);const u=f.morphAttributes;for(const p in u){const _=u[p];for(let g=0,m=_.length;g<m;g++)t.update(_[g],n.ARRAY_BUFFER)}}function c(f){const d=[],u=f.index,p=f.attributes.position;let _=0;if(u!==null){const x=u.array;_=u.version;for(let y=0,v=x.length;y<v;y+=3){const P=x[y+0],S=x[y+1],w=x[y+2];d.push(P,S,S,w,w,P)}}else if(p!==void 0){const x=p.array;_=p.version;for(let y=0,v=x.length/3-1;y<v;y+=3){const P=y+0,S=y+1,w=y+2;d.push(P,S,S,w,w,P)}}else return;const g=new(hu(d)?mu:pu)(d,1);g.version=_;const m=a.get(f);m&&t.remove(m),a.set(f,g)}function h(f){const d=a.get(f);if(d){const u=f.index;u!==null&&d.version<u.version&&c(f)}else c(f);return a.get(f)}return{get:r,update:l,getWireframeAttribute:h}}function P_(n,t,e){let i;function s(d){i=d}let a,o;function r(d){a=d.type,o=d.bytesPerElement}function l(d,u){n.drawElements(i,u,a,d*o),e.update(u,i,1)}function c(d,u,p){p!==0&&(n.drawElementsInstanced(i,u,a,d*o,p),e.update(u,i,p))}function h(d,u,p){if(p===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,a,d,0,p);let g=0;for(let m=0;m<p;m++)g+=u[m];e.update(g,i,1)}function f(d,u,p,_){if(p===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let m=0;m<d.length;m++)c(d[m]/o,u[m],_[m]);else{g.multiDrawElementsInstancedWEBGL(i,u,0,a,d,0,_,0,p);let m=0;for(let x=0;x<p;x++)m+=u[x]*_[x];e.update(m,i,1)}}this.setMode=s,this.setIndex=r,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function D_(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,o,r){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=r*(a/3);break;case n.LINES:e.lines+=r*(a/2);break;case n.LINE_STRIP:e.lines+=r*(a-1);break;case n.LINE_LOOP:e.lines+=r*a;break;case n.POINTS:e.points+=r*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function L_(n,t,e){const i=new WeakMap,s=new Ce;function a(o,r,l){const c=o.morphTargetInfluences,h=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,f=h!==void 0?h.length:0;let d=i.get(r);if(d===void 0||d.count!==f){let M=function(){T.dispose(),i.delete(r),r.removeEventListener("dispose",M)};var u=M;d!==void 0&&d.texture.dispose();const p=r.morphAttributes.position!==void 0,_=r.morphAttributes.normal!==void 0,g=r.morphAttributes.color!==void 0,m=r.morphAttributes.position||[],x=r.morphAttributes.normal||[],y=r.morphAttributes.color||[];let v=0;p===!0&&(v=1),_===!0&&(v=2),g===!0&&(v=3);let P=r.attributes.position.count*v,S=1;P>t.maxTextureSize&&(S=Math.ceil(P/t.maxTextureSize),P=t.maxTextureSize);const w=new Float32Array(P*S*4*f),T=new uu(w,P,S,f);T.type=$n,T.needsUpdate=!0;const b=v*4;for(let R=0;R<f;R++){const F=m[R],I=x[R],z=y[R],C=P*S*4*R;for(let D=0;D<F.count;D++){const X=D*b;p===!0&&(s.fromBufferAttribute(F,D),w[C+X+0]=s.x,w[C+X+1]=s.y,w[C+X+2]=s.z,w[C+X+3]=0),_===!0&&(s.fromBufferAttribute(I,D),w[C+X+4]=s.x,w[C+X+5]=s.y,w[C+X+6]=s.z,w[C+X+7]=0),g===!0&&(s.fromBufferAttribute(z,D),w[C+X+8]=s.x,w[C+X+9]=s.y,w[C+X+10]=s.z,w[C+X+11]=z.itemSize===4?s.w:1)}}d={count:f,texture:T,size:new Bt(P,S)},i.set(r,d),r.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let p=0;for(let g=0;g<c.length;g++)p+=c[g];const _=r.morphTargetsRelative?1:1-p;l.getUniforms().setValue(n,"morphTargetBaseInfluence",_),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:a}}function I_(n,t,e,i){let s=new WeakMap;function a(l){const c=i.render.frame,h=l.geometry,f=t.get(l,h);if(s.get(f)!==c&&(t.update(f),s.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",r)===!1&&l.addEventListener("dispose",r),s.get(l)!==c&&(e.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return f}function o(){s=new WeakMap}function r(l){const c=l.target;c.removeEventListener("dispose",r),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:a,dispose:o}}class Mu extends Je{constructor(t,e,i,s,a,o,r,l,c,h=fs){if(h!==fs&&h!==Ms)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===fs&&(i=Ii),i===void 0&&h===Ms&&(i=ys),super(null,s,a,o,r,l,h,i,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:Tn,this.minFilter=l!==void 0?l:Tn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Su=new Je,Oh=new Mu(1,1),bu=new uu,Eu=new _g,wu=new vu,Bh=[],Hh=[],Gh=new Float32Array(16),Vh=new Float32Array(9),Xh=new Float32Array(4);function ws(n,t,e){const i=n[0];if(i<=0||i>0)return n;const s=t*e;let a=Bh[s];if(a===void 0&&(a=new Float32Array(s),Bh[s]=a),t!==0){i.toArray(a,0);for(let o=1,r=0;o!==t;++o)r+=e,n[o].toArray(a,r)}return a}function Ue(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Fe(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function wo(n,t){let e=Hh[t];e===void 0&&(e=new Int32Array(t),Hh[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function k_(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function U_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ue(e,t))return;n.uniform2fv(this.addr,t),Fe(e,t)}}function F_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ue(e,t))return;n.uniform3fv(this.addr,t),Fe(e,t)}}function N_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ue(e,t))return;n.uniform4fv(this.addr,t),Fe(e,t)}}function z_(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ue(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Fe(e,t)}else{if(Ue(e,i))return;Xh.set(i),n.uniformMatrix2fv(this.addr,!1,Xh),Fe(e,i)}}function O_(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ue(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Fe(e,t)}else{if(Ue(e,i))return;Vh.set(i),n.uniformMatrix3fv(this.addr,!1,Vh),Fe(e,i)}}function B_(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ue(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Fe(e,t)}else{if(Ue(e,i))return;Gh.set(i),n.uniformMatrix4fv(this.addr,!1,Gh),Fe(e,i)}}function H_(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function G_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ue(e,t))return;n.uniform2iv(this.addr,t),Fe(e,t)}}function V_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ue(e,t))return;n.uniform3iv(this.addr,t),Fe(e,t)}}function X_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ue(e,t))return;n.uniform4iv(this.addr,t),Fe(e,t)}}function W_(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function $_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ue(e,t))return;n.uniform2uiv(this.addr,t),Fe(e,t)}}function Y_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ue(e,t))return;n.uniform3uiv(this.addr,t),Fe(e,t)}}function Z_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ue(e,t))return;n.uniform4uiv(this.addr,t),Fe(e,t)}}function q_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let a;this.type===n.SAMPLER_2D_SHADOW?(Oh.compareFunction=lu,a=Oh):a=Su,e.setTexture2D(t||a,s)}function j_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||Eu,s)}function K_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||wu,s)}function J_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||bu,s)}function Q_(n){switch(n){case 5126:return k_;case 35664:return U_;case 35665:return F_;case 35666:return N_;case 35674:return z_;case 35675:return O_;case 35676:return B_;case 5124:case 35670:return H_;case 35667:case 35671:return G_;case 35668:case 35672:return V_;case 35669:case 35673:return X_;case 5125:return W_;case 36294:return $_;case 36295:return Y_;case 36296:return Z_;case 35678:case 36198:case 36298:case 36306:case 35682:return q_;case 35679:case 36299:case 36307:return j_;case 35680:case 36300:case 36308:case 36293:return K_;case 36289:case 36303:case 36311:case 36292:return J_}}function ty(n,t){n.uniform1fv(this.addr,t)}function ey(n,t){const e=ws(t,this.size,2);n.uniform2fv(this.addr,e)}function ny(n,t){const e=ws(t,this.size,3);n.uniform3fv(this.addr,e)}function iy(n,t){const e=ws(t,this.size,4);n.uniform4fv(this.addr,e)}function sy(n,t){const e=ws(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function ay(n,t){const e=ws(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function oy(n,t){const e=ws(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function ry(n,t){n.uniform1iv(this.addr,t)}function cy(n,t){n.uniform2iv(this.addr,t)}function ly(n,t){n.uniform3iv(this.addr,t)}function hy(n,t){n.uniform4iv(this.addr,t)}function dy(n,t){n.uniform1uiv(this.addr,t)}function uy(n,t){n.uniform2uiv(this.addr,t)}function fy(n,t){n.uniform3uiv(this.addr,t)}function py(n,t){n.uniform4uiv(this.addr,t)}function my(n,t,e){const i=this.cache,s=t.length,a=wo(e,s);Ue(i,a)||(n.uniform1iv(this.addr,a),Fe(i,a));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Su,a[o])}function gy(n,t,e){const i=this.cache,s=t.length,a=wo(e,s);Ue(i,a)||(n.uniform1iv(this.addr,a),Fe(i,a));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Eu,a[o])}function xy(n,t,e){const i=this.cache,s=t.length,a=wo(e,s);Ue(i,a)||(n.uniform1iv(this.addr,a),Fe(i,a));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||wu,a[o])}function vy(n,t,e){const i=this.cache,s=t.length,a=wo(e,s);Ue(i,a)||(n.uniform1iv(this.addr,a),Fe(i,a));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||bu,a[o])}function _y(n){switch(n){case 5126:return ty;case 35664:return ey;case 35665:return ny;case 35666:return iy;case 35674:return sy;case 35675:return ay;case 35676:return oy;case 5124:case 35670:return ry;case 35667:case 35671:return cy;case 35668:case 35672:return ly;case 35669:case 35673:return hy;case 5125:return dy;case 36294:return uy;case 36295:return fy;case 36296:return py;case 35678:case 36198:case 36298:case 36306:case 35682:return my;case 35679:case 36299:case 36307:return gy;case 35680:case 36300:case 36308:case 36293:return xy;case 36289:case 36303:case 36311:case 36292:return vy}}class yy{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=Q_(e.type)}}class My{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=_y(e.type)}}class Sy{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const s=this.seq;for(let a=0,o=s.length;a!==o;++a){const r=s[a];r.setValue(t,e[r.id],i)}}}const _r=/(\w+)(\])?(\[|\.)?/g;function Wh(n,t){n.seq.push(t),n.map[t.id]=t}function by(n,t,e){const i=n.name,s=i.length;for(_r.lastIndex=0;;){const a=_r.exec(i),o=_r.lastIndex;let r=a[1];const l=a[2]==="]",c=a[3];if(l&&(r=r|0),c===void 0||c==="["&&o+2===s){Wh(e,c===void 0?new yy(r,n,t):new My(r,n,t));break}else{let f=e.map[r];f===void 0&&(f=new Sy(r),Wh(e,f)),e=f}}}class Qa{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const a=t.getActiveUniform(e,s),o=t.getUniformLocation(e,a.name);by(a,o,this)}}setValue(t,e,i,s){const a=this.map[e];a!==void 0&&a.setValue(t,i,s)}setOptional(t,e,i){const s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let a=0,o=e.length;a!==o;++a){const r=e[a],l=i[r.id];l.needsUpdate!==!1&&r.setValue(t,l.value,s)}}static seqWithValue(t,e){const i=[];for(let s=0,a=t.length;s!==a;++s){const o=t[s];o.id in e&&i.push(o)}return i}}function $h(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const Ey=37297;let wy=0;function Ty(n,t){const e=n.split(`
`),i=[],s=Math.max(t-6,0),a=Math.min(t+6,e.length);for(let o=s;o<a;o++){const r=o+1;i.push(`${r===t?">":" "} ${r}: ${e[o]}`)}return i.join(`
`)}const Yh=new ee;function Ay(n){he._getMatrix(Yh,he.workingColorSpace,n);const t=`mat3( ${Yh.elements.map(e=>e.toFixed(4))} )`;switch(he.getTransfer(n)){case bo:return[t,"LinearTransferOETF"];case xe:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Zh(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),s=n.getShaderInfoLog(t).trim();if(i&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+Ty(n.getShaderSource(t),o)}else return s}function Ry(n,t){const e=Ay(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Cy(n,t){let e;switch(t){case D0:e="Linear";break;case L0:e="Reinhard";break;case I0:e="Cineon";break;case k0:e="ACESFilmic";break;case F0:e="AgX";break;case N0:e="Neutral";break;case U0:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ua=new V;function Py(){he.getLuminanceCoefficients(Ua);const n=Ua.x.toFixed(4),t=Ua.y.toFixed(4),e=Ua.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Dy(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Hs).join(`
`)}function Ly(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function Iy(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const a=n.getActiveAttrib(t,s),o=a.name;let r=1;a.type===n.FLOAT_MAT2&&(r=2),a.type===n.FLOAT_MAT3&&(r=3),a.type===n.FLOAT_MAT4&&(r=4),e[o]={type:a.type,location:n.getAttribLocation(t,o),locationSize:r}}return e}function Hs(n){return n!==""}function qh(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function jh(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const ky=/^[ \t]*#include +<([\w\d./]+)>/gm;function Pc(n){return n.replace(ky,Fy)}const Uy=new Map;function Fy(n,t){let e=ne[t];if(e===void 0){const i=Uy.get(t);if(i!==void 0)e=ne[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Pc(e)}const Ny=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Kh(n){return n.replace(Ny,zy)}function zy(n,t,e,i){let s="";for(let a=parseInt(t);a<parseInt(e);a++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function Jh(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function Oy(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===qd?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===jd?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Xn&&(t="SHADOWMAP_TYPE_VSM"),t}function By(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case vs:case _s:t="ENVMAP_TYPE_CUBE";break;case So:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Hy(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case _s:t="ENVMAP_MODE_REFRACTION";break}return t}function Gy(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Zc:t="ENVMAP_BLENDING_MULTIPLY";break;case C0:t="ENVMAP_BLENDING_MIX";break;case P0:t="ENVMAP_BLENDING_ADD";break}return t}function Vy(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function Xy(n,t,e,i){const s=n.getContext(),a=e.defines;let o=e.vertexShader,r=e.fragmentShader;const l=Oy(e),c=By(e),h=Hy(e),f=Gy(e),d=Vy(e),u=Dy(e),p=Ly(a),_=s.createProgram();let g,m,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Hs).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Hs).join(`
`),m.length>0&&(m+=`
`)):(g=[Jh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Hs).join(`
`),m=[Jh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ci?"#define TONE_MAPPING":"",e.toneMapping!==ci?ne.tonemapping_pars_fragment:"",e.toneMapping!==ci?Cy("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ne.colorspace_pars_fragment,Ry("linearToOutputTexel",e.outputColorSpace),Py(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Hs).join(`
`)),o=Pc(o),o=qh(o,e),o=jh(o,e),r=Pc(r),r=qh(r,e),r=jh(r,e),o=Kh(o),r=Kh(r),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,g=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",e.glslVersion===lh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===lh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const y=x+g+o,v=x+m+r,P=$h(s,s.VERTEX_SHADER,y),S=$h(s,s.FRAGMENT_SHADER,v);s.attachShader(_,P),s.attachShader(_,S),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function w(R){if(n.debug.checkShaderErrors){const F=s.getProgramInfoLog(_).trim(),I=s.getShaderInfoLog(P).trim(),z=s.getShaderInfoLog(S).trim();let C=!0,D=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(C=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,_,P,S);else{const X=Zh(s,P,"vertex"),H=Zh(s,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+F+`
`+X+`
`+H)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(I===""||z==="")&&(D=!1);D&&(R.diagnostics={runnable:C,programLog:F,vertexShader:{log:I,prefix:g},fragmentShader:{log:z,prefix:m}})}s.deleteShader(P),s.deleteShader(S),T=new Qa(s,_),b=Iy(s,_)}let T;this.getUniforms=function(){return T===void 0&&w(this),T};let b;this.getAttributes=function(){return b===void 0&&w(this),b};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(_,Ey)),M},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=wy++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=P,this.fragmentShader=S,this}let Wy=0;class $y{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),a=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(a)===!1&&(o.add(a),a.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new Yy(t),e.set(t,i)),i}}class Yy{constructor(t){this.id=Wy++,this.code=t,this.usedTimes=0}}function Zy(n,t,e,i,s,a,o){const r=new il,l=new $y,c=new Set,h=[],f=s.logarithmicDepthBuffer,d=s.vertexTextures;let u=s.precision;const p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return c.add(b),b===0?"uv":`uv${b}`}function g(b,M,R,F,I){const z=F.fog,C=I.geometry,D=b.isMeshStandardMaterial?F.environment:null,X=(b.isMeshStandardMaterial?e:t).get(b.envMap||D),H=X&&X.mapping===So?X.image.height:null,Z=p[b.type];b.precision!==null&&(u=s.getMaxPrecision(b.precision),u!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",u,"instead."));const Q=C.morphAttributes.position||C.morphAttributes.normal||C.morphAttributes.color,mt=Q!==void 0?Q.length:0;let dt=0;C.morphAttributes.position!==void 0&&(dt=1),C.morphAttributes.normal!==void 0&&(dt=2),C.morphAttributes.color!==void 0&&(dt=3);let ut,K,tt,ht;if(Z){const Qt=In[Z];ut=Qt.vertexShader,K=Qt.fragmentShader}else ut=b.vertexShader,K=b.fragmentShader,l.update(b),tt=l.getVertexShaderID(b),ht=l.getFragmentShaderID(b);const j=n.getRenderTarget(),Mt=n.state.buffers.depth.getReversed(),kt=I.isInstancedMesh===!0,Ct=I.isBatchedMesh===!0,Tt=!!b.map,Ht=!!b.matcap,Lt=!!X,G=!!b.aoMap,jt=!!b.lightMap,Rt=!!b.bumpMap,Dt=!!b.normalMap,zt=!!b.displacementMap,It=!!b.emissiveMap,Pt=!!b.metalnessMap,L=!!b.roughnessMap,E=b.anisotropy>0,$=b.clearcoat>0,nt=b.dispersion>0,at=b.iridescence>0,lt=b.sheen>0,Ot=b.transmission>0,J=E&&!!b.anisotropyMap,vt=$&&!!b.clearcoatMap,$t=$&&!!b.clearcoatNormalMap,ot=$&&!!b.clearcoatRoughnessMap,_t=at&&!!b.iridescenceMap,B=at&&!!b.iridescenceThicknessMap,it=lt&&!!b.sheenColorMap,pt=lt&&!!b.sheenRoughnessMap,Ut=!!b.specularMap,Nt=!!b.specularColorMap,Gt=!!b.specularIntensityMap,N=Ot&&!!b.transmissionMap,St=Ot&&!!b.thicknessMap,q=!!b.gradientMap,ct=!!b.alphaMap,yt=b.alphaTest>0,Et=!!b.alphaHash,Xt=!!b.extensions;let Kt=ci;b.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(Kt=n.toneMapping);const oe={shaderID:Z,shaderType:b.type,shaderName:b.name,vertexShader:ut,fragmentShader:K,defines:b.defines,customVertexShaderID:tt,customFragmentShaderID:ht,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:u,batching:Ct,batchingColor:Ct&&I._colorsTexture!==null,instancing:kt,instancingColor:kt&&I.instanceColor!==null,instancingMorph:kt&&I.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:j===null?n.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:bs,alphaToCoverage:!!b.alphaToCoverage,map:Tt,matcap:Ht,envMap:Lt,envMapMode:Lt&&X.mapping,envMapCubeUVHeight:H,aoMap:G,lightMap:jt,bumpMap:Rt,normalMap:Dt,displacementMap:d&&zt,emissiveMap:It,normalMapObjectSpace:Dt&&b.normalMapType===H0,normalMapTangentSpace:Dt&&b.normalMapType===cu,metalnessMap:Pt,roughnessMap:L,anisotropy:E,anisotropyMap:J,clearcoat:$,clearcoatMap:vt,clearcoatNormalMap:$t,clearcoatRoughnessMap:ot,dispersion:nt,iridescence:at,iridescenceMap:_t,iridescenceThicknessMap:B,sheen:lt,sheenColorMap:it,sheenRoughnessMap:pt,specularMap:Ut,specularColorMap:Nt,specularIntensityMap:Gt,transmission:Ot,transmissionMap:N,thicknessMap:St,gradientMap:q,opaque:b.transparent===!1&&b.blending===us&&b.alphaToCoverage===!1,alphaMap:ct,alphaTest:yt,alphaHash:Et,combine:b.combine,mapUv:Tt&&_(b.map.channel),aoMapUv:G&&_(b.aoMap.channel),lightMapUv:jt&&_(b.lightMap.channel),bumpMapUv:Rt&&_(b.bumpMap.channel),normalMapUv:Dt&&_(b.normalMap.channel),displacementMapUv:zt&&_(b.displacementMap.channel),emissiveMapUv:It&&_(b.emissiveMap.channel),metalnessMapUv:Pt&&_(b.metalnessMap.channel),roughnessMapUv:L&&_(b.roughnessMap.channel),anisotropyMapUv:J&&_(b.anisotropyMap.channel),clearcoatMapUv:vt&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:$t&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ot&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:_t&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:B&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:it&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:pt&&_(b.sheenRoughnessMap.channel),specularMapUv:Ut&&_(b.specularMap.channel),specularColorMapUv:Nt&&_(b.specularColorMap.channel),specularIntensityMapUv:Gt&&_(b.specularIntensityMap.channel),transmissionMapUv:N&&_(b.transmissionMap.channel),thicknessMapUv:St&&_(b.thicknessMap.channel),alphaMapUv:ct&&_(b.alphaMap.channel),vertexTangents:!!C.attributes.tangent&&(Dt||E),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!C.attributes.color&&C.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!C.attributes.uv&&(Tt||ct),fog:!!z,useFog:b.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:Mt,skinning:I.isSkinnedMesh===!0,morphTargets:C.morphAttributes.position!==void 0,morphNormals:C.morphAttributes.normal!==void 0,morphColors:C.morphAttributes.color!==void 0,morphTargetsCount:mt,morphTextureStride:dt,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&R.length>0,shadowMapType:n.shadowMap.type,toneMapping:Kt,decodeVideoTexture:Tt&&b.map.isVideoTexture===!0&&he.getTransfer(b.map.colorSpace)===xe,decodeVideoTextureEmissive:It&&b.emissiveMap.isVideoTexture===!0&&he.getTransfer(b.emissiveMap.colorSpace)===xe,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Ae,flipSided:b.side===nn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Xt&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Xt&&b.extensions.multiDraw===!0||Ct)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return oe.vertexUv1s=c.has(1),oe.vertexUv2s=c.has(2),oe.vertexUv3s=c.has(3),c.clear(),oe}function m(b){const M=[];if(b.shaderID?M.push(b.shaderID):(M.push(b.customVertexShaderID),M.push(b.customFragmentShaderID)),b.defines!==void 0)for(const R in b.defines)M.push(R),M.push(b.defines[R]);return b.isRawShaderMaterial===!1&&(x(M,b),y(M,b),M.push(n.outputColorSpace)),M.push(b.customProgramCacheKey),M.join()}function x(b,M){b.push(M.precision),b.push(M.outputColorSpace),b.push(M.envMapMode),b.push(M.envMapCubeUVHeight),b.push(M.mapUv),b.push(M.alphaMapUv),b.push(M.lightMapUv),b.push(M.aoMapUv),b.push(M.bumpMapUv),b.push(M.normalMapUv),b.push(M.displacementMapUv),b.push(M.emissiveMapUv),b.push(M.metalnessMapUv),b.push(M.roughnessMapUv),b.push(M.anisotropyMapUv),b.push(M.clearcoatMapUv),b.push(M.clearcoatNormalMapUv),b.push(M.clearcoatRoughnessMapUv),b.push(M.iridescenceMapUv),b.push(M.iridescenceThicknessMapUv),b.push(M.sheenColorMapUv),b.push(M.sheenRoughnessMapUv),b.push(M.specularMapUv),b.push(M.specularColorMapUv),b.push(M.specularIntensityMapUv),b.push(M.transmissionMapUv),b.push(M.thicknessMapUv),b.push(M.combine),b.push(M.fogExp2),b.push(M.sizeAttenuation),b.push(M.morphTargetsCount),b.push(M.morphAttributeCount),b.push(M.numDirLights),b.push(M.numPointLights),b.push(M.numSpotLights),b.push(M.numSpotLightMaps),b.push(M.numHemiLights),b.push(M.numRectAreaLights),b.push(M.numDirLightShadows),b.push(M.numPointLightShadows),b.push(M.numSpotLightShadows),b.push(M.numSpotLightShadowsWithMaps),b.push(M.numLightProbes),b.push(M.shadowMapType),b.push(M.toneMapping),b.push(M.numClippingPlanes),b.push(M.numClipIntersection),b.push(M.depthPacking)}function y(b,M){r.disableAll(),M.supportsVertexTextures&&r.enable(0),M.instancing&&r.enable(1),M.instancingColor&&r.enable(2),M.instancingMorph&&r.enable(3),M.matcap&&r.enable(4),M.envMap&&r.enable(5),M.normalMapObjectSpace&&r.enable(6),M.normalMapTangentSpace&&r.enable(7),M.clearcoat&&r.enable(8),M.iridescence&&r.enable(9),M.alphaTest&&r.enable(10),M.vertexColors&&r.enable(11),M.vertexAlphas&&r.enable(12),M.vertexUv1s&&r.enable(13),M.vertexUv2s&&r.enable(14),M.vertexUv3s&&r.enable(15),M.vertexTangents&&r.enable(16),M.anisotropy&&r.enable(17),M.alphaHash&&r.enable(18),M.batching&&r.enable(19),M.dispersion&&r.enable(20),M.batchingColor&&r.enable(21),b.push(r.mask),r.disableAll(),M.fog&&r.enable(0),M.useFog&&r.enable(1),M.flatShading&&r.enable(2),M.logarithmicDepthBuffer&&r.enable(3),M.reverseDepthBuffer&&r.enable(4),M.skinning&&r.enable(5),M.morphTargets&&r.enable(6),M.morphNormals&&r.enable(7),M.morphColors&&r.enable(8),M.premultipliedAlpha&&r.enable(9),M.shadowMapEnabled&&r.enable(10),M.doubleSided&&r.enable(11),M.flipSided&&r.enable(12),M.useDepthPacking&&r.enable(13),M.dithering&&r.enable(14),M.transmission&&r.enable(15),M.sheen&&r.enable(16),M.opaque&&r.enable(17),M.pointsUvs&&r.enable(18),M.decodeVideoTexture&&r.enable(19),M.decodeVideoTextureEmissive&&r.enable(20),M.alphaToCoverage&&r.enable(21),b.push(r.mask)}function v(b){const M=p[b.type];let R;if(M){const F=In[M];R=Dg.clone(F.uniforms)}else R=b.uniforms;return R}function P(b,M){let R;for(let F=0,I=h.length;F<I;F++){const z=h[F];if(z.cacheKey===M){R=z,++R.usedTimes;break}}return R===void 0&&(R=new Xy(n,M,b,a),h.push(R)),R}function S(b){if(--b.usedTimes===0){const M=h.indexOf(b);h[M]=h[h.length-1],h.pop(),b.destroy()}}function w(b){l.remove(b)}function T(){l.dispose()}return{getParameters:g,getProgramCacheKey:m,getUniforms:v,acquireProgram:P,releaseProgram:S,releaseShaderCache:w,programs:h,dispose:T}}function qy(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let r=n.get(o);return r===void 0&&(r={},n.set(o,r)),r}function i(o){n.delete(o)}function s(o,r,l){n.get(o)[r]=l}function a(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:a}}function jy(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Qh(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function td(){const n=[];let t=0;const e=[],i=[],s=[];function a(){t=0,e.length=0,i.length=0,s.length=0}function o(f,d,u,p,_,g){let m=n[t];return m===void 0?(m={id:f.id,object:f,geometry:d,material:u,groupOrder:p,renderOrder:f.renderOrder,z:_,group:g},n[t]=m):(m.id=f.id,m.object=f,m.geometry=d,m.material=u,m.groupOrder=p,m.renderOrder=f.renderOrder,m.z=_,m.group=g),t++,m}function r(f,d,u,p,_,g){const m=o(f,d,u,p,_,g);u.transmission>0?i.push(m):u.transparent===!0?s.push(m):e.push(m)}function l(f,d,u,p,_,g){const m=o(f,d,u,p,_,g);u.transmission>0?i.unshift(m):u.transparent===!0?s.unshift(m):e.unshift(m)}function c(f,d){e.length>1&&e.sort(f||jy),i.length>1&&i.sort(d||Qh),s.length>1&&s.sort(d||Qh)}function h(){for(let f=t,d=n.length;f<d;f++){const u=n[f];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:e,transmissive:i,transparent:s,init:a,push:r,unshift:l,finish:h,sort:c}}function Ky(){let n=new WeakMap;function t(i,s){const a=n.get(i);let o;return a===void 0?(o=new td,n.set(i,[o])):s>=a.length?(o=new td,a.push(o)):o=a[s],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function Jy(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new V,color:new qt};break;case"SpotLight":e={position:new V,direction:new V,color:new qt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new V,color:new qt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new V,skyColor:new qt,groundColor:new qt};break;case"RectAreaLight":e={color:new qt,position:new V,halfWidth:new V,halfHeight:new V};break}return n[t.id]=e,e}}}function Qy(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Bt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Bt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Bt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let tM=0;function eM(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function nM(n){const t=new Jy,e=Qy(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new V);const s=new V,a=new Se,o=new Se;function r(c){let h=0,f=0,d=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let u=0,p=0,_=0,g=0,m=0,x=0,y=0,v=0,P=0,S=0,w=0;c.sort(eM);for(let b=0,M=c.length;b<M;b++){const R=c[b],F=R.color,I=R.intensity,z=R.distance,C=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)h+=F.r*I,f+=F.g*I,d+=F.b*I;else if(R.isLightProbe){for(let D=0;D<9;D++)i.probe[D].addScaledVector(R.sh.coefficients[D],I);w++}else if(R.isDirectionalLight){const D=t.get(R);if(D.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const X=R.shadow,H=e.get(R);H.shadowIntensity=X.intensity,H.shadowBias=X.bias,H.shadowNormalBias=X.normalBias,H.shadowRadius=X.radius,H.shadowMapSize=X.mapSize,i.directionalShadow[u]=H,i.directionalShadowMap[u]=C,i.directionalShadowMatrix[u]=R.shadow.matrix,x++}i.directional[u]=D,u++}else if(R.isSpotLight){const D=t.get(R);D.position.setFromMatrixPosition(R.matrixWorld),D.color.copy(F).multiplyScalar(I),D.distance=z,D.coneCos=Math.cos(R.angle),D.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),D.decay=R.decay,i.spot[_]=D;const X=R.shadow;if(R.map&&(i.spotLightMap[P]=R.map,P++,X.updateMatrices(R),R.castShadow&&S++),i.spotLightMatrix[_]=X.matrix,R.castShadow){const H=e.get(R);H.shadowIntensity=X.intensity,H.shadowBias=X.bias,H.shadowNormalBias=X.normalBias,H.shadowRadius=X.radius,H.shadowMapSize=X.mapSize,i.spotShadow[_]=H,i.spotShadowMap[_]=C,v++}_++}else if(R.isRectAreaLight){const D=t.get(R);D.color.copy(F).multiplyScalar(I),D.halfWidth.set(R.width*.5,0,0),D.halfHeight.set(0,R.height*.5,0),i.rectArea[g]=D,g++}else if(R.isPointLight){const D=t.get(R);if(D.color.copy(R.color).multiplyScalar(R.intensity),D.distance=R.distance,D.decay=R.decay,R.castShadow){const X=R.shadow,H=e.get(R);H.shadowIntensity=X.intensity,H.shadowBias=X.bias,H.shadowNormalBias=X.normalBias,H.shadowRadius=X.radius,H.shadowMapSize=X.mapSize,H.shadowCameraNear=X.camera.near,H.shadowCameraFar=X.camera.far,i.pointShadow[p]=H,i.pointShadowMap[p]=C,i.pointShadowMatrix[p]=R.shadow.matrix,y++}i.point[p]=D,p++}else if(R.isHemisphereLight){const D=t.get(R);D.skyColor.copy(R.color).multiplyScalar(I),D.groundColor.copy(R.groundColor).multiplyScalar(I),i.hemi[m]=D,m++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Ft.LTC_FLOAT_1,i.rectAreaLTC2=Ft.LTC_FLOAT_2):(i.rectAreaLTC1=Ft.LTC_HALF_1,i.rectAreaLTC2=Ft.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=f,i.ambient[2]=d;const T=i.hash;(T.directionalLength!==u||T.pointLength!==p||T.spotLength!==_||T.rectAreaLength!==g||T.hemiLength!==m||T.numDirectionalShadows!==x||T.numPointShadows!==y||T.numSpotShadows!==v||T.numSpotMaps!==P||T.numLightProbes!==w)&&(i.directional.length=u,i.spot.length=_,i.rectArea.length=g,i.point.length=p,i.hemi.length=m,i.directionalShadow.length=x,i.directionalShadowMap.length=x,i.pointShadow.length=y,i.pointShadowMap.length=y,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=x,i.pointShadowMatrix.length=y,i.spotLightMatrix.length=v+P-S,i.spotLightMap.length=P,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=w,T.directionalLength=u,T.pointLength=p,T.spotLength=_,T.rectAreaLength=g,T.hemiLength=m,T.numDirectionalShadows=x,T.numPointShadows=y,T.numSpotShadows=v,T.numSpotMaps=P,T.numLightProbes=w,i.version=tM++)}function l(c,h){let f=0,d=0,u=0,p=0,_=0;const g=h.matrixWorldInverse;for(let m=0,x=c.length;m<x;m++){const y=c[m];if(y.isDirectionalLight){const v=i.directional[f];v.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(g),f++}else if(y.isSpotLight){const v=i.spot[u];v.position.setFromMatrixPosition(y.matrixWorld),v.position.applyMatrix4(g),v.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(g),u++}else if(y.isRectAreaLight){const v=i.rectArea[p];v.position.setFromMatrixPosition(y.matrixWorld),v.position.applyMatrix4(g),o.identity(),a.copy(y.matrixWorld),a.premultiply(g),o.extractRotation(a),v.halfWidth.set(y.width*.5,0,0),v.halfHeight.set(0,y.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),p++}else if(y.isPointLight){const v=i.point[d];v.position.setFromMatrixPosition(y.matrixWorld),v.position.applyMatrix4(g),d++}else if(y.isHemisphereLight){const v=i.hemi[_];v.direction.setFromMatrixPosition(y.matrixWorld),v.direction.transformDirection(g),_++}}}return{setup:r,setupView:l,state:i}}function ed(n){const t=new nM(n),e=[],i=[];function s(h){c.camera=h,e.length=0,i.length=0}function a(h){e.push(h)}function o(h){i.push(h)}function r(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:r,setupLightsView:l,pushLight:a,pushShadow:o}}function iM(n){let t=new WeakMap;function e(s,a=0){const o=t.get(s);let r;return o===void 0?(r=new ed(n),t.set(s,[r])):a>=o.length?(r=new ed(n),o.push(r)):r=o[a],r}function i(){t=new WeakMap}return{get:e,dispose:i}}class sM extends Fi{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=O0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class aM extends Fi{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const oM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,rM=`uniform sampler2D shadow_pass;
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
}`;function cM(n,t,e){let i=new sl;const s=new Bt,a=new Bt,o=new Ce,r=new sM({depthPacking:B0}),l=new aM,c={},h=e.maxTextureSize,f={[li]:nn,[nn]:li,[Ae]:Ae},d=new hi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Bt},radius:{value:4}},vertexShader:oM,fragmentShader:rM}),u=d.clone();u.defines.HORIZONTAL_PASS=1;const p=new Ne;p.setAttribute("position",new Qe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new ce(p,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=qd;let m=this.type;this.render=function(S,w,T){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||S.length===0)return;const b=n.getRenderTarget(),M=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),F=n.state;F.setBlending(ri),F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const I=m!==Xn&&this.type===Xn,z=m===Xn&&this.type!==Xn;for(let C=0,D=S.length;C<D;C++){const X=S[C],H=X.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",X,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);const Z=H.getFrameExtents();if(s.multiply(Z),a.copy(H.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(a.x=Math.floor(h/Z.x),s.x=a.x*Z.x,H.mapSize.x=a.x),s.y>h&&(a.y=Math.floor(h/Z.y),s.y=a.y*Z.y,H.mapSize.y=a.y)),H.map===null||I===!0||z===!0){const mt=this.type!==Xn?{minFilter:Tn,magFilter:Tn}:{};H.map!==null&&H.map.dispose(),H.map=new ki(s.x,s.y,mt),H.map.texture.name=X.name+".shadowMap",H.camera.updateProjectionMatrix()}n.setRenderTarget(H.map),n.clear();const Q=H.getViewportCount();for(let mt=0;mt<Q;mt++){const dt=H.getViewport(mt);o.set(a.x*dt.x,a.y*dt.y,a.x*dt.z,a.y*dt.w),F.viewport(o),H.updateMatrices(X,mt),i=H.getFrustum(),v(w,T,H.camera,X,this.type)}H.isPointLightShadow!==!0&&this.type===Xn&&x(H,T),H.needsUpdate=!1}m=this.type,g.needsUpdate=!1,n.setRenderTarget(b,M,R)};function x(S,w){const T=t.update(_);d.defines.VSM_SAMPLES!==S.blurSamples&&(d.defines.VSM_SAMPLES=S.blurSamples,u.defines.VSM_SAMPLES=S.blurSamples,d.needsUpdate=!0,u.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new ki(s.x,s.y)),d.uniforms.shadow_pass.value=S.map.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,n.setRenderTarget(S.mapPass),n.clear(),n.renderBufferDirect(w,null,T,d,_,null),u.uniforms.shadow_pass.value=S.mapPass.texture,u.uniforms.resolution.value=S.mapSize,u.uniforms.radius.value=S.radius,n.setRenderTarget(S.map),n.clear(),n.renderBufferDirect(w,null,T,u,_,null)}function y(S,w,T,b){let M=null;const R=T.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(R!==void 0)M=R;else if(M=T.isPointLight===!0?l:r,n.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0){const F=M.uuid,I=w.uuid;let z=c[F];z===void 0&&(z={},c[F]=z);let C=z[I];C===void 0&&(C=M.clone(),z[I]=C,w.addEventListener("dispose",P)),M=C}if(M.visible=w.visible,M.wireframe=w.wireframe,b===Xn?M.side=w.shadowSide!==null?w.shadowSide:w.side:M.side=w.shadowSide!==null?w.shadowSide:f[w.side],M.alphaMap=w.alphaMap,M.alphaTest=w.alphaTest,M.map=w.map,M.clipShadows=w.clipShadows,M.clippingPlanes=w.clippingPlanes,M.clipIntersection=w.clipIntersection,M.displacementMap=w.displacementMap,M.displacementScale=w.displacementScale,M.displacementBias=w.displacementBias,M.wireframeLinewidth=w.wireframeLinewidth,M.linewidth=w.linewidth,T.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const F=n.properties.get(M);F.light=T}return M}function v(S,w,T,b,M){if(S.visible===!1)return;if(S.layers.test(w.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&M===Xn)&&(!S.frustumCulled||i.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,S.matrixWorld);const I=t.update(S),z=S.material;if(Array.isArray(z)){const C=I.groups;for(let D=0,X=C.length;D<X;D++){const H=C[D],Z=z[H.materialIndex];if(Z&&Z.visible){const Q=y(S,Z,b,M);S.onBeforeShadow(n,S,w,T,I,Q,H),n.renderBufferDirect(T,null,I,Q,S,H),S.onAfterShadow(n,S,w,T,I,Q,H)}}}else if(z.visible){const C=y(S,z,b,M);S.onBeforeShadow(n,S,w,T,I,C,null),n.renderBufferDirect(T,null,I,C,S,null),S.onAfterShadow(n,S,w,T,I,C,null)}}const F=S.children;for(let I=0,z=F.length;I<z;I++)v(F[I],w,T,b,M)}function P(S){S.target.removeEventListener("dispose",P);for(const T in c){const b=c[T],M=S.target.uuid;M in b&&(b[M].dispose(),delete b[M])}}}const lM={[$r]:Yr,[Zr]:Kr,[qr]:Jr,[xs]:jr,[Yr]:$r,[Kr]:Zr,[Jr]:qr,[jr]:xs};function hM(n,t){function e(){let N=!1;const St=new Ce;let q=null;const ct=new Ce(0,0,0,0);return{setMask:function(yt){q!==yt&&!N&&(n.colorMask(yt,yt,yt,yt),q=yt)},setLocked:function(yt){N=yt},setClear:function(yt,Et,Xt,Kt,oe){oe===!0&&(yt*=Kt,Et*=Kt,Xt*=Kt),St.set(yt,Et,Xt,Kt),ct.equals(St)===!1&&(n.clearColor(yt,Et,Xt,Kt),ct.copy(St))},reset:function(){N=!1,q=null,ct.set(-1,0,0,0)}}}function i(){let N=!1,St=!1,q=null,ct=null,yt=null;return{setReversed:function(Et){if(St!==Et){const Xt=t.get("EXT_clip_control");St?Xt.clipControlEXT(Xt.LOWER_LEFT_EXT,Xt.ZERO_TO_ONE_EXT):Xt.clipControlEXT(Xt.LOWER_LEFT_EXT,Xt.NEGATIVE_ONE_TO_ONE_EXT);const Kt=yt;yt=null,this.setClear(Kt)}St=Et},getReversed:function(){return St},setTest:function(Et){Et?j(n.DEPTH_TEST):Mt(n.DEPTH_TEST)},setMask:function(Et){q!==Et&&!N&&(n.depthMask(Et),q=Et)},setFunc:function(Et){if(St&&(Et=lM[Et]),ct!==Et){switch(Et){case $r:n.depthFunc(n.NEVER);break;case Yr:n.depthFunc(n.ALWAYS);break;case Zr:n.depthFunc(n.LESS);break;case xs:n.depthFunc(n.LEQUAL);break;case qr:n.depthFunc(n.EQUAL);break;case jr:n.depthFunc(n.GEQUAL);break;case Kr:n.depthFunc(n.GREATER);break;case Jr:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ct=Et}},setLocked:function(Et){N=Et},setClear:function(Et){yt!==Et&&(St&&(Et=1-Et),n.clearDepth(Et),yt=Et)},reset:function(){N=!1,q=null,ct=null,yt=null,St=!1}}}function s(){let N=!1,St=null,q=null,ct=null,yt=null,Et=null,Xt=null,Kt=null,oe=null;return{setTest:function(Qt){N||(Qt?j(n.STENCIL_TEST):Mt(n.STENCIL_TEST))},setMask:function(Qt){St!==Qt&&!N&&(n.stencilMask(Qt),St=Qt)},setFunc:function(Qt,ie,ye){(q!==Qt||ct!==ie||yt!==ye)&&(n.stencilFunc(Qt,ie,ye),q=Qt,ct=ie,yt=ye)},setOp:function(Qt,ie,ye){(Et!==Qt||Xt!==ie||Kt!==ye)&&(n.stencilOp(Qt,ie,ye),Et=Qt,Xt=ie,Kt=ye)},setLocked:function(Qt){N=Qt},setClear:function(Qt){oe!==Qt&&(n.clearStencil(Qt),oe=Qt)},reset:function(){N=!1,St=null,q=null,ct=null,yt=null,Et=null,Xt=null,Kt=null,oe=null}}}const a=new e,o=new i,r=new s,l=new WeakMap,c=new WeakMap;let h={},f={},d=new WeakMap,u=[],p=null,_=!1,g=null,m=null,x=null,y=null,v=null,P=null,S=null,w=new qt(0,0,0),T=0,b=!1,M=null,R=null,F=null,I=null,z=null;const C=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let D=!1,X=0;const H=n.getParameter(n.VERSION);H.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(H)[1]),D=X>=1):H.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),D=X>=2);let Z=null,Q={};const mt=n.getParameter(n.SCISSOR_BOX),dt=n.getParameter(n.VIEWPORT),ut=new Ce().fromArray(mt),K=new Ce().fromArray(dt);function tt(N,St,q,ct){const yt=new Uint8Array(4),Et=n.createTexture();n.bindTexture(N,Et),n.texParameteri(N,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(N,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Xt=0;Xt<q;Xt++)N===n.TEXTURE_3D||N===n.TEXTURE_2D_ARRAY?n.texImage3D(St,0,n.RGBA,1,1,ct,0,n.RGBA,n.UNSIGNED_BYTE,yt):n.texImage2D(St+Xt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,yt);return Et}const ht={};ht[n.TEXTURE_2D]=tt(n.TEXTURE_2D,n.TEXTURE_2D,1),ht[n.TEXTURE_CUBE_MAP]=tt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),ht[n.TEXTURE_2D_ARRAY]=tt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),ht[n.TEXTURE_3D]=tt(n.TEXTURE_3D,n.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),r.setClear(0),j(n.DEPTH_TEST),o.setFunc(xs),Rt(!1),Dt(ah),j(n.CULL_FACE),G(ri);function j(N){h[N]!==!0&&(n.enable(N),h[N]=!0)}function Mt(N){h[N]!==!1&&(n.disable(N),h[N]=!1)}function kt(N,St){return f[N]!==St?(n.bindFramebuffer(N,St),f[N]=St,N===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=St),N===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=St),!0):!1}function Ct(N,St){let q=u,ct=!1;if(N){q=d.get(St),q===void 0&&(q=[],d.set(St,q));const yt=N.textures;if(q.length!==yt.length||q[0]!==n.COLOR_ATTACHMENT0){for(let Et=0,Xt=yt.length;Et<Xt;Et++)q[Et]=n.COLOR_ATTACHMENT0+Et;q.length=yt.length,ct=!0}}else q[0]!==n.BACK&&(q[0]=n.BACK,ct=!0);ct&&n.drawBuffers(q)}function Tt(N){return p!==N?(n.useProgram(N),p=N,!0):!1}const Ht={[Ai]:n.FUNC_ADD,[u0]:n.FUNC_SUBTRACT,[f0]:n.FUNC_REVERSE_SUBTRACT};Ht[p0]=n.MIN,Ht[m0]=n.MAX;const Lt={[g0]:n.ZERO,[x0]:n.ONE,[v0]:n.SRC_COLOR,[Xr]:n.SRC_ALPHA,[E0]:n.SRC_ALPHA_SATURATE,[S0]:n.DST_COLOR,[y0]:n.DST_ALPHA,[_0]:n.ONE_MINUS_SRC_COLOR,[Wr]:n.ONE_MINUS_SRC_ALPHA,[b0]:n.ONE_MINUS_DST_COLOR,[M0]:n.ONE_MINUS_DST_ALPHA,[w0]:n.CONSTANT_COLOR,[T0]:n.ONE_MINUS_CONSTANT_COLOR,[A0]:n.CONSTANT_ALPHA,[R0]:n.ONE_MINUS_CONSTANT_ALPHA};function G(N,St,q,ct,yt,Et,Xt,Kt,oe,Qt){if(N===ri){_===!0&&(Mt(n.BLEND),_=!1);return}if(_===!1&&(j(n.BLEND),_=!0),N!==d0){if(N!==g||Qt!==b){if((m!==Ai||v!==Ai)&&(n.blendEquation(n.FUNC_ADD),m=Ai,v=Ai),Qt)switch(N){case us:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ti:n.blendFunc(n.ONE,n.ONE);break;case oh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case rh:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case us:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ti:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case oh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case rh:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}x=null,y=null,P=null,S=null,w.set(0,0,0),T=0,g=N,b=Qt}return}yt=yt||St,Et=Et||q,Xt=Xt||ct,(St!==m||yt!==v)&&(n.blendEquationSeparate(Ht[St],Ht[yt]),m=St,v=yt),(q!==x||ct!==y||Et!==P||Xt!==S)&&(n.blendFuncSeparate(Lt[q],Lt[ct],Lt[Et],Lt[Xt]),x=q,y=ct,P=Et,S=Xt),(Kt.equals(w)===!1||oe!==T)&&(n.blendColor(Kt.r,Kt.g,Kt.b,oe),w.copy(Kt),T=oe),g=N,b=!1}function jt(N,St){N.side===Ae?Mt(n.CULL_FACE):j(n.CULL_FACE);let q=N.side===nn;St&&(q=!q),Rt(q),N.blending===us&&N.transparent===!1?G(ri):G(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),a.setMask(N.colorWrite);const ct=N.stencilWrite;r.setTest(ct),ct&&(r.setMask(N.stencilWriteMask),r.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),r.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),It(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?j(n.SAMPLE_ALPHA_TO_COVERAGE):Mt(n.SAMPLE_ALPHA_TO_COVERAGE)}function Rt(N){M!==N&&(N?n.frontFace(n.CW):n.frontFace(n.CCW),M=N)}function Dt(N){N!==l0?(j(n.CULL_FACE),N!==R&&(N===ah?n.cullFace(n.BACK):N===h0?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Mt(n.CULL_FACE),R=N}function zt(N){N!==F&&(D&&n.lineWidth(N),F=N)}function It(N,St,q){N?(j(n.POLYGON_OFFSET_FILL),(I!==St||z!==q)&&(n.polygonOffset(St,q),I=St,z=q)):Mt(n.POLYGON_OFFSET_FILL)}function Pt(N){N?j(n.SCISSOR_TEST):Mt(n.SCISSOR_TEST)}function L(N){N===void 0&&(N=n.TEXTURE0+C-1),Z!==N&&(n.activeTexture(N),Z=N)}function E(N,St,q){q===void 0&&(Z===null?q=n.TEXTURE0+C-1:q=Z);let ct=Q[q];ct===void 0&&(ct={type:void 0,texture:void 0},Q[q]=ct),(ct.type!==N||ct.texture!==St)&&(Z!==q&&(n.activeTexture(q),Z=q),n.bindTexture(N,St||ht[N]),ct.type=N,ct.texture=St)}function $(){const N=Q[Z];N!==void 0&&N.type!==void 0&&(n.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function nt(){try{n.compressedTexImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function at(){try{n.compressedTexImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function lt(){try{n.texSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ot(){try{n.texSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function J(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function vt(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function $t(){try{n.texStorage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ot(){try{n.texStorage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function _t(){try{n.texImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function B(){try{n.texImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function it(N){ut.equals(N)===!1&&(n.scissor(N.x,N.y,N.z,N.w),ut.copy(N))}function pt(N){K.equals(N)===!1&&(n.viewport(N.x,N.y,N.z,N.w),K.copy(N))}function Ut(N,St){let q=c.get(St);q===void 0&&(q=new WeakMap,c.set(St,q));let ct=q.get(N);ct===void 0&&(ct=n.getUniformBlockIndex(St,N.name),q.set(N,ct))}function Nt(N,St){const ct=c.get(St).get(N);l.get(St)!==ct&&(n.uniformBlockBinding(St,ct,N.__bindingPointIndex),l.set(St,ct))}function Gt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},Z=null,Q={},f={},d=new WeakMap,u=[],p=null,_=!1,g=null,m=null,x=null,y=null,v=null,P=null,S=null,w=new qt(0,0,0),T=0,b=!1,M=null,R=null,F=null,I=null,z=null,ut.set(0,0,n.canvas.width,n.canvas.height),K.set(0,0,n.canvas.width,n.canvas.height),a.reset(),o.reset(),r.reset()}return{buffers:{color:a,depth:o,stencil:r},enable:j,disable:Mt,bindFramebuffer:kt,drawBuffers:Ct,useProgram:Tt,setBlending:G,setMaterial:jt,setFlipSided:Rt,setCullFace:Dt,setLineWidth:zt,setPolygonOffset:It,setScissorTest:Pt,activeTexture:L,bindTexture:E,unbindTexture:$,compressedTexImage2D:nt,compressedTexImage3D:at,texImage2D:_t,texImage3D:B,updateUBOMapping:Ut,uniformBlockBinding:Nt,texStorage2D:$t,texStorage3D:ot,texSubImage2D:lt,texSubImage3D:Ot,compressedTexSubImage2D:J,compressedTexSubImage3D:vt,scissor:it,viewport:pt,reset:Gt}}function nd(n,t,e,i){const s=dM(i);switch(e){case eu:return n*t;case iu:return n*t;case su:return n*t*2;case au:return n*t/s.components*s.byteLength;case Jc:return n*t/s.components*s.byteLength;case ou:return n*t*2/s.components*s.byteLength;case Qc:return n*t*2/s.components*s.byteLength;case nu:return n*t*3/s.components*s.byteLength;case wn:return n*t*4/s.components*s.byteLength;case tl:return n*t*4/s.components*s.byteLength;case Za:case qa:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case ja:case Ka:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case sc:case oc:return Math.max(n,16)*Math.max(t,8)/4;case ic:case ac:return Math.max(n,8)*Math.max(t,8)/2;case rc:case cc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case lc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case hc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case dc:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case uc:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case fc:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case pc:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case mc:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case gc:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case xc:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case vc:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case _c:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case yc:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Mc:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case Sc:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case bc:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case Ja:case Ec:case wc:return Math.ceil(n/4)*Math.ceil(t/4)*16;case ru:case Tc:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Ac:case Rc:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function dM(n){switch(n){case qn:case Jd:return{byteLength:1,components:1};case Ks:case Qd:case aa:return{byteLength:2,components:1};case jc:case Kc:return{byteLength:2,components:4};case Ii:case qc:case $n:return{byteLength:4,components:1};case tu:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function uM(n,t,e,i,s,a,o){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Bt,h=new WeakMap;let f;const d=new WeakMap;let u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(L,E){return u?new OffscreenCanvas(L,E):fo("canvas")}function _(L,E,$){let nt=1;const at=Pt(L);if((at.width>$||at.height>$)&&(nt=$/Math.max(at.width,at.height)),nt<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){const lt=Math.floor(nt*at.width),Ot=Math.floor(nt*at.height);f===void 0&&(f=p(lt,Ot));const J=E?p(lt,Ot):f;return J.width=lt,J.height=Ot,J.getContext("2d").drawImage(L,0,0,lt,Ot),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+at.width+"x"+at.height+") to ("+lt+"x"+Ot+")."),J}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+at.width+"x"+at.height+")."),L;return L}function g(L){return L.generateMipmaps}function m(L){n.generateMipmap(L)}function x(L){return L.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?n.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function y(L,E,$,nt,at=!1){if(L!==null){if(n[L]!==void 0)return n[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let lt=E;if(E===n.RED&&($===n.FLOAT&&(lt=n.R32F),$===n.HALF_FLOAT&&(lt=n.R16F),$===n.UNSIGNED_BYTE&&(lt=n.R8)),E===n.RED_INTEGER&&($===n.UNSIGNED_BYTE&&(lt=n.R8UI),$===n.UNSIGNED_SHORT&&(lt=n.R16UI),$===n.UNSIGNED_INT&&(lt=n.R32UI),$===n.BYTE&&(lt=n.R8I),$===n.SHORT&&(lt=n.R16I),$===n.INT&&(lt=n.R32I)),E===n.RG&&($===n.FLOAT&&(lt=n.RG32F),$===n.HALF_FLOAT&&(lt=n.RG16F),$===n.UNSIGNED_BYTE&&(lt=n.RG8)),E===n.RG_INTEGER&&($===n.UNSIGNED_BYTE&&(lt=n.RG8UI),$===n.UNSIGNED_SHORT&&(lt=n.RG16UI),$===n.UNSIGNED_INT&&(lt=n.RG32UI),$===n.BYTE&&(lt=n.RG8I),$===n.SHORT&&(lt=n.RG16I),$===n.INT&&(lt=n.RG32I)),E===n.RGB_INTEGER&&($===n.UNSIGNED_BYTE&&(lt=n.RGB8UI),$===n.UNSIGNED_SHORT&&(lt=n.RGB16UI),$===n.UNSIGNED_INT&&(lt=n.RGB32UI),$===n.BYTE&&(lt=n.RGB8I),$===n.SHORT&&(lt=n.RGB16I),$===n.INT&&(lt=n.RGB32I)),E===n.RGBA_INTEGER&&($===n.UNSIGNED_BYTE&&(lt=n.RGBA8UI),$===n.UNSIGNED_SHORT&&(lt=n.RGBA16UI),$===n.UNSIGNED_INT&&(lt=n.RGBA32UI),$===n.BYTE&&(lt=n.RGBA8I),$===n.SHORT&&(lt=n.RGBA16I),$===n.INT&&(lt=n.RGBA32I)),E===n.RGB&&$===n.UNSIGNED_INT_5_9_9_9_REV&&(lt=n.RGB9_E5),E===n.RGBA){const Ot=at?bo:he.getTransfer(nt);$===n.FLOAT&&(lt=n.RGBA32F),$===n.HALF_FLOAT&&(lt=n.RGBA16F),$===n.UNSIGNED_BYTE&&(lt=Ot===xe?n.SRGB8_ALPHA8:n.RGBA8),$===n.UNSIGNED_SHORT_4_4_4_4&&(lt=n.RGBA4),$===n.UNSIGNED_SHORT_5_5_5_1&&(lt=n.RGB5_A1)}return(lt===n.R16F||lt===n.R32F||lt===n.RG16F||lt===n.RG32F||lt===n.RGBA16F||lt===n.RGBA32F)&&t.get("EXT_color_buffer_float"),lt}function v(L,E){let $;return L?E===null||E===Ii||E===ys?$=n.DEPTH24_STENCIL8:E===$n?$=n.DEPTH32F_STENCIL8:E===Ks&&($=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===Ii||E===ys?$=n.DEPTH_COMPONENT24:E===$n?$=n.DEPTH_COMPONENT32F:E===Ks&&($=n.DEPTH_COMPONENT16),$}function P(L,E){return g(L)===!0||L.isFramebufferTexture&&L.minFilter!==Tn&&L.minFilter!==kn?Math.log2(Math.max(E.width,E.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?E.mipmaps.length:1}function S(L){const E=L.target;E.removeEventListener("dispose",S),T(E),E.isVideoTexture&&h.delete(E)}function w(L){const E=L.target;E.removeEventListener("dispose",w),M(E)}function T(L){const E=i.get(L);if(E.__webglInit===void 0)return;const $=L.source,nt=d.get($);if(nt){const at=nt[E.__cacheKey];at.usedTimes--,at.usedTimes===0&&b(L),Object.keys(nt).length===0&&d.delete($)}i.remove(L)}function b(L){const E=i.get(L);n.deleteTexture(E.__webglTexture);const $=L.source,nt=d.get($);delete nt[E.__cacheKey],o.memory.textures--}function M(L){const E=i.get(L);if(L.depthTexture&&(L.depthTexture.dispose(),i.remove(L.depthTexture)),L.isWebGLCubeRenderTarget)for(let nt=0;nt<6;nt++){if(Array.isArray(E.__webglFramebuffer[nt]))for(let at=0;at<E.__webglFramebuffer[nt].length;at++)n.deleteFramebuffer(E.__webglFramebuffer[nt][at]);else n.deleteFramebuffer(E.__webglFramebuffer[nt]);E.__webglDepthbuffer&&n.deleteRenderbuffer(E.__webglDepthbuffer[nt])}else{if(Array.isArray(E.__webglFramebuffer))for(let nt=0;nt<E.__webglFramebuffer.length;nt++)n.deleteFramebuffer(E.__webglFramebuffer[nt]);else n.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&n.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&n.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let nt=0;nt<E.__webglColorRenderbuffer.length;nt++)E.__webglColorRenderbuffer[nt]&&n.deleteRenderbuffer(E.__webglColorRenderbuffer[nt]);E.__webglDepthRenderbuffer&&n.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const $=L.textures;for(let nt=0,at=$.length;nt<at;nt++){const lt=i.get($[nt]);lt.__webglTexture&&(n.deleteTexture(lt.__webglTexture),o.memory.textures--),i.remove($[nt])}i.remove(L)}let R=0;function F(){R=0}function I(){const L=R;return L>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+s.maxTextures),R+=1,L}function z(L){const E=[];return E.push(L.wrapS),E.push(L.wrapT),E.push(L.wrapR||0),E.push(L.magFilter),E.push(L.minFilter),E.push(L.anisotropy),E.push(L.internalFormat),E.push(L.format),E.push(L.type),E.push(L.generateMipmaps),E.push(L.premultiplyAlpha),E.push(L.flipY),E.push(L.unpackAlignment),E.push(L.colorSpace),E.join()}function C(L,E){const $=i.get(L);if(L.isVideoTexture&&zt(L),L.isRenderTargetTexture===!1&&L.version>0&&$.__version!==L.version){const nt=L.image;if(nt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(nt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{K($,L,E);return}}e.bindTexture(n.TEXTURE_2D,$.__webglTexture,n.TEXTURE0+E)}function D(L,E){const $=i.get(L);if(L.version>0&&$.__version!==L.version){K($,L,E);return}e.bindTexture(n.TEXTURE_2D_ARRAY,$.__webglTexture,n.TEXTURE0+E)}function X(L,E){const $=i.get(L);if(L.version>0&&$.__version!==L.version){K($,L,E);return}e.bindTexture(n.TEXTURE_3D,$.__webglTexture,n.TEXTURE0+E)}function H(L,E){const $=i.get(L);if(L.version>0&&$.__version!==L.version){tt($,L,E);return}e.bindTexture(n.TEXTURE_CUBE_MAP,$.__webglTexture,n.TEXTURE0+E)}const Z={[ec]:n.REPEAT,[Ci]:n.CLAMP_TO_EDGE,[nc]:n.MIRRORED_REPEAT},Q={[Tn]:n.NEAREST,[z0]:n.NEAREST_MIPMAP_NEAREST,[ma]:n.NEAREST_MIPMAP_LINEAR,[kn]:n.LINEAR,[Yo]:n.LINEAR_MIPMAP_NEAREST,[Pi]:n.LINEAR_MIPMAP_LINEAR},mt={[G0]:n.NEVER,[Z0]:n.ALWAYS,[V0]:n.LESS,[lu]:n.LEQUAL,[X0]:n.EQUAL,[Y0]:n.GEQUAL,[W0]:n.GREATER,[$0]:n.NOTEQUAL};function dt(L,E){if(E.type===$n&&t.has("OES_texture_float_linear")===!1&&(E.magFilter===kn||E.magFilter===Yo||E.magFilter===ma||E.magFilter===Pi||E.minFilter===kn||E.minFilter===Yo||E.minFilter===ma||E.minFilter===Pi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(L,n.TEXTURE_WRAP_S,Z[E.wrapS]),n.texParameteri(L,n.TEXTURE_WRAP_T,Z[E.wrapT]),(L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY)&&n.texParameteri(L,n.TEXTURE_WRAP_R,Z[E.wrapR]),n.texParameteri(L,n.TEXTURE_MAG_FILTER,Q[E.magFilter]),n.texParameteri(L,n.TEXTURE_MIN_FILTER,Q[E.minFilter]),E.compareFunction&&(n.texParameteri(L,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(L,n.TEXTURE_COMPARE_FUNC,mt[E.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===Tn||E.minFilter!==ma&&E.minFilter!==Pi||E.type===$n&&t.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||i.get(E).__currentAnisotropy){const $=t.get("EXT_texture_filter_anisotropic");n.texParameterf(L,$.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,s.getMaxAnisotropy())),i.get(E).__currentAnisotropy=E.anisotropy}}}function ut(L,E){let $=!1;L.__webglInit===void 0&&(L.__webglInit=!0,E.addEventListener("dispose",S));const nt=E.source;let at=d.get(nt);at===void 0&&(at={},d.set(nt,at));const lt=z(E);if(lt!==L.__cacheKey){at[lt]===void 0&&(at[lt]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,$=!0),at[lt].usedTimes++;const Ot=at[L.__cacheKey];Ot!==void 0&&(at[L.__cacheKey].usedTimes--,Ot.usedTimes===0&&b(E)),L.__cacheKey=lt,L.__webglTexture=at[lt].texture}return $}function K(L,E,$){let nt=n.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(nt=n.TEXTURE_2D_ARRAY),E.isData3DTexture&&(nt=n.TEXTURE_3D);const at=ut(L,E),lt=E.source;e.bindTexture(nt,L.__webglTexture,n.TEXTURE0+$);const Ot=i.get(lt);if(lt.version!==Ot.__version||at===!0){e.activeTexture(n.TEXTURE0+$);const J=he.getPrimaries(he.workingColorSpace),vt=E.colorSpace===ii?null:he.getPrimaries(E.colorSpace),$t=E.colorSpace===ii||J===vt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,E.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,E.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,$t);let ot=_(E.image,!1,s.maxTextureSize);ot=It(E,ot);const _t=a.convert(E.format,E.colorSpace),B=a.convert(E.type);let it=y(E.internalFormat,_t,B,E.colorSpace,E.isVideoTexture);dt(nt,E);let pt;const Ut=E.mipmaps,Nt=E.isVideoTexture!==!0,Gt=Ot.__version===void 0||at===!0,N=lt.dataReady,St=P(E,ot);if(E.isDepthTexture)it=v(E.format===Ms,E.type),Gt&&(Nt?e.texStorage2D(n.TEXTURE_2D,1,it,ot.width,ot.height):e.texImage2D(n.TEXTURE_2D,0,it,ot.width,ot.height,0,_t,B,null));else if(E.isDataTexture)if(Ut.length>0){Nt&&Gt&&e.texStorage2D(n.TEXTURE_2D,St,it,Ut[0].width,Ut[0].height);for(let q=0,ct=Ut.length;q<ct;q++)pt=Ut[q],Nt?N&&e.texSubImage2D(n.TEXTURE_2D,q,0,0,pt.width,pt.height,_t,B,pt.data):e.texImage2D(n.TEXTURE_2D,q,it,pt.width,pt.height,0,_t,B,pt.data);E.generateMipmaps=!1}else Nt?(Gt&&e.texStorage2D(n.TEXTURE_2D,St,it,ot.width,ot.height),N&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,ot.width,ot.height,_t,B,ot.data)):e.texImage2D(n.TEXTURE_2D,0,it,ot.width,ot.height,0,_t,B,ot.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){Nt&&Gt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,St,it,Ut[0].width,Ut[0].height,ot.depth);for(let q=0,ct=Ut.length;q<ct;q++)if(pt=Ut[q],E.format!==wn)if(_t!==null)if(Nt){if(N)if(E.layerUpdates.size>0){const yt=nd(pt.width,pt.height,E.format,E.type);for(const Et of E.layerUpdates){const Xt=pt.data.subarray(Et*yt/pt.data.BYTES_PER_ELEMENT,(Et+1)*yt/pt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,q,0,0,Et,pt.width,pt.height,1,_t,Xt)}E.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,q,0,0,0,pt.width,pt.height,ot.depth,_t,pt.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,q,it,pt.width,pt.height,ot.depth,0,pt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Nt?N&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,q,0,0,0,pt.width,pt.height,ot.depth,_t,B,pt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,q,it,pt.width,pt.height,ot.depth,0,_t,B,pt.data)}else{Nt&&Gt&&e.texStorage2D(n.TEXTURE_2D,St,it,Ut[0].width,Ut[0].height);for(let q=0,ct=Ut.length;q<ct;q++)pt=Ut[q],E.format!==wn?_t!==null?Nt?N&&e.compressedTexSubImage2D(n.TEXTURE_2D,q,0,0,pt.width,pt.height,_t,pt.data):e.compressedTexImage2D(n.TEXTURE_2D,q,it,pt.width,pt.height,0,pt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Nt?N&&e.texSubImage2D(n.TEXTURE_2D,q,0,0,pt.width,pt.height,_t,B,pt.data):e.texImage2D(n.TEXTURE_2D,q,it,pt.width,pt.height,0,_t,B,pt.data)}else if(E.isDataArrayTexture)if(Nt){if(Gt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,St,it,ot.width,ot.height,ot.depth),N)if(E.layerUpdates.size>0){const q=nd(ot.width,ot.height,E.format,E.type);for(const ct of E.layerUpdates){const yt=ot.data.subarray(ct*q/ot.data.BYTES_PER_ELEMENT,(ct+1)*q/ot.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ct,ot.width,ot.height,1,_t,B,yt)}E.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ot.width,ot.height,ot.depth,_t,B,ot.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,it,ot.width,ot.height,ot.depth,0,_t,B,ot.data);else if(E.isData3DTexture)Nt?(Gt&&e.texStorage3D(n.TEXTURE_3D,St,it,ot.width,ot.height,ot.depth),N&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ot.width,ot.height,ot.depth,_t,B,ot.data)):e.texImage3D(n.TEXTURE_3D,0,it,ot.width,ot.height,ot.depth,0,_t,B,ot.data);else if(E.isFramebufferTexture){if(Gt)if(Nt)e.texStorage2D(n.TEXTURE_2D,St,it,ot.width,ot.height);else{let q=ot.width,ct=ot.height;for(let yt=0;yt<St;yt++)e.texImage2D(n.TEXTURE_2D,yt,it,q,ct,0,_t,B,null),q>>=1,ct>>=1}}else if(Ut.length>0){if(Nt&&Gt){const q=Pt(Ut[0]);e.texStorage2D(n.TEXTURE_2D,St,it,q.width,q.height)}for(let q=0,ct=Ut.length;q<ct;q++)pt=Ut[q],Nt?N&&e.texSubImage2D(n.TEXTURE_2D,q,0,0,_t,B,pt):e.texImage2D(n.TEXTURE_2D,q,it,_t,B,pt);E.generateMipmaps=!1}else if(Nt){if(Gt){const q=Pt(ot);e.texStorage2D(n.TEXTURE_2D,St,it,q.width,q.height)}N&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,_t,B,ot)}else e.texImage2D(n.TEXTURE_2D,0,it,_t,B,ot);g(E)&&m(nt),Ot.__version=lt.version,E.onUpdate&&E.onUpdate(E)}L.__version=E.version}function tt(L,E,$){if(E.image.length!==6)return;const nt=ut(L,E),at=E.source;e.bindTexture(n.TEXTURE_CUBE_MAP,L.__webglTexture,n.TEXTURE0+$);const lt=i.get(at);if(at.version!==lt.__version||nt===!0){e.activeTexture(n.TEXTURE0+$);const Ot=he.getPrimaries(he.workingColorSpace),J=E.colorSpace===ii?null:he.getPrimaries(E.colorSpace),vt=E.colorSpace===ii||Ot===J?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,E.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,E.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,vt);const $t=E.isCompressedTexture||E.image[0].isCompressedTexture,ot=E.image[0]&&E.image[0].isDataTexture,_t=[];for(let ct=0;ct<6;ct++)!$t&&!ot?_t[ct]=_(E.image[ct],!0,s.maxCubemapSize):_t[ct]=ot?E.image[ct].image:E.image[ct],_t[ct]=It(E,_t[ct]);const B=_t[0],it=a.convert(E.format,E.colorSpace),pt=a.convert(E.type),Ut=y(E.internalFormat,it,pt,E.colorSpace),Nt=E.isVideoTexture!==!0,Gt=lt.__version===void 0||nt===!0,N=at.dataReady;let St=P(E,B);dt(n.TEXTURE_CUBE_MAP,E);let q;if($t){Nt&&Gt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,St,Ut,B.width,B.height);for(let ct=0;ct<6;ct++){q=_t[ct].mipmaps;for(let yt=0;yt<q.length;yt++){const Et=q[yt];E.format!==wn?it!==null?Nt?N&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,yt,0,0,Et.width,Et.height,it,Et.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,yt,Ut,Et.width,Et.height,0,Et.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Nt?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,yt,0,0,Et.width,Et.height,it,pt,Et.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,yt,Ut,Et.width,Et.height,0,it,pt,Et.data)}}}else{if(q=E.mipmaps,Nt&&Gt){q.length>0&&St++;const ct=Pt(_t[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,St,Ut,ct.width,ct.height)}for(let ct=0;ct<6;ct++)if(ot){Nt?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,0,0,_t[ct].width,_t[ct].height,it,pt,_t[ct].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,Ut,_t[ct].width,_t[ct].height,0,it,pt,_t[ct].data);for(let yt=0;yt<q.length;yt++){const Xt=q[yt].image[ct].image;Nt?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,yt+1,0,0,Xt.width,Xt.height,it,pt,Xt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,yt+1,Ut,Xt.width,Xt.height,0,it,pt,Xt.data)}}else{Nt?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,0,0,it,pt,_t[ct]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,Ut,it,pt,_t[ct]);for(let yt=0;yt<q.length;yt++){const Et=q[yt];Nt?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,yt+1,0,0,it,pt,Et.image[ct]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,yt+1,Ut,it,pt,Et.image[ct])}}}g(E)&&m(n.TEXTURE_CUBE_MAP),lt.__version=at.version,E.onUpdate&&E.onUpdate(E)}L.__version=E.version}function ht(L,E,$,nt,at,lt){const Ot=a.convert($.format,$.colorSpace),J=a.convert($.type),vt=y($.internalFormat,Ot,J,$.colorSpace),$t=i.get(E),ot=i.get($);if(ot.__renderTarget=E,!$t.__hasExternalTextures){const _t=Math.max(1,E.width>>lt),B=Math.max(1,E.height>>lt);at===n.TEXTURE_3D||at===n.TEXTURE_2D_ARRAY?e.texImage3D(at,lt,vt,_t,B,E.depth,0,Ot,J,null):e.texImage2D(at,lt,vt,_t,B,0,Ot,J,null)}e.bindFramebuffer(n.FRAMEBUFFER,L),Dt(E)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,nt,at,ot.__webglTexture,0,Rt(E)):(at===n.TEXTURE_2D||at>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&at<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,nt,at,ot.__webglTexture,lt),e.bindFramebuffer(n.FRAMEBUFFER,null)}function j(L,E,$){if(n.bindRenderbuffer(n.RENDERBUFFER,L),E.depthBuffer){const nt=E.depthTexture,at=nt&&nt.isDepthTexture?nt.type:null,lt=v(E.stencilBuffer,at),Ot=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,J=Rt(E);Dt(E)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,J,lt,E.width,E.height):$?n.renderbufferStorageMultisample(n.RENDERBUFFER,J,lt,E.width,E.height):n.renderbufferStorage(n.RENDERBUFFER,lt,E.width,E.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Ot,n.RENDERBUFFER,L)}else{const nt=E.textures;for(let at=0;at<nt.length;at++){const lt=nt[at],Ot=a.convert(lt.format,lt.colorSpace),J=a.convert(lt.type),vt=y(lt.internalFormat,Ot,J,lt.colorSpace),$t=Rt(E);$&&Dt(E)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,$t,vt,E.width,E.height):Dt(E)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,$t,vt,E.width,E.height):n.renderbufferStorage(n.RENDERBUFFER,vt,E.width,E.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Mt(L,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,L),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const nt=i.get(E.depthTexture);nt.__renderTarget=E,(!nt.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),C(E.depthTexture,0);const at=nt.__webglTexture,lt=Rt(E);if(E.depthTexture.format===fs)Dt(E)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,at,0,lt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,at,0);else if(E.depthTexture.format===Ms)Dt(E)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,at,0,lt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,at,0);else throw new Error("Unknown depthTexture format")}function kt(L){const E=i.get(L),$=L.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==L.depthTexture){const nt=L.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),nt){const at=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,nt.removeEventListener("dispose",at)};nt.addEventListener("dispose",at),E.__depthDisposeCallback=at}E.__boundDepthTexture=nt}if(L.depthTexture&&!E.__autoAllocateDepthBuffer){if($)throw new Error("target.depthTexture not supported in Cube render targets");Mt(E.__webglFramebuffer,L)}else if($){E.__webglDepthbuffer=[];for(let nt=0;nt<6;nt++)if(e.bindFramebuffer(n.FRAMEBUFFER,E.__webglFramebuffer[nt]),E.__webglDepthbuffer[nt]===void 0)E.__webglDepthbuffer[nt]=n.createRenderbuffer(),j(E.__webglDepthbuffer[nt],L,!1);else{const at=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,lt=E.__webglDepthbuffer[nt];n.bindRenderbuffer(n.RENDERBUFFER,lt),n.framebufferRenderbuffer(n.FRAMEBUFFER,at,n.RENDERBUFFER,lt)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=n.createRenderbuffer(),j(E.__webglDepthbuffer,L,!1);else{const nt=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,at=E.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,at),n.framebufferRenderbuffer(n.FRAMEBUFFER,nt,n.RENDERBUFFER,at)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Ct(L,E,$){const nt=i.get(L);E!==void 0&&ht(nt.__webglFramebuffer,L,L.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),$!==void 0&&kt(L)}function Tt(L){const E=L.texture,$=i.get(L),nt=i.get(E);L.addEventListener("dispose",w);const at=L.textures,lt=L.isWebGLCubeRenderTarget===!0,Ot=at.length>1;if(Ot||(nt.__webglTexture===void 0&&(nt.__webglTexture=n.createTexture()),nt.__version=E.version,o.memory.textures++),lt){$.__webglFramebuffer=[];for(let J=0;J<6;J++)if(E.mipmaps&&E.mipmaps.length>0){$.__webglFramebuffer[J]=[];for(let vt=0;vt<E.mipmaps.length;vt++)$.__webglFramebuffer[J][vt]=n.createFramebuffer()}else $.__webglFramebuffer[J]=n.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){$.__webglFramebuffer=[];for(let J=0;J<E.mipmaps.length;J++)$.__webglFramebuffer[J]=n.createFramebuffer()}else $.__webglFramebuffer=n.createFramebuffer();if(Ot)for(let J=0,vt=at.length;J<vt;J++){const $t=i.get(at[J]);$t.__webglTexture===void 0&&($t.__webglTexture=n.createTexture(),o.memory.textures++)}if(L.samples>0&&Dt(L)===!1){$.__webglMultisampledFramebuffer=n.createFramebuffer(),$.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,$.__webglMultisampledFramebuffer);for(let J=0;J<at.length;J++){const vt=at[J];$.__webglColorRenderbuffer[J]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,$.__webglColorRenderbuffer[J]);const $t=a.convert(vt.format,vt.colorSpace),ot=a.convert(vt.type),_t=y(vt.internalFormat,$t,ot,vt.colorSpace,L.isXRRenderTarget===!0),B=Rt(L);n.renderbufferStorageMultisample(n.RENDERBUFFER,B,_t,L.width,L.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+J,n.RENDERBUFFER,$.__webglColorRenderbuffer[J])}n.bindRenderbuffer(n.RENDERBUFFER,null),L.depthBuffer&&($.__webglDepthRenderbuffer=n.createRenderbuffer(),j($.__webglDepthRenderbuffer,L,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(lt){e.bindTexture(n.TEXTURE_CUBE_MAP,nt.__webglTexture),dt(n.TEXTURE_CUBE_MAP,E);for(let J=0;J<6;J++)if(E.mipmaps&&E.mipmaps.length>0)for(let vt=0;vt<E.mipmaps.length;vt++)ht($.__webglFramebuffer[J][vt],L,E,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt);else ht($.__webglFramebuffer[J],L,E,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0);g(E)&&m(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Ot){for(let J=0,vt=at.length;J<vt;J++){const $t=at[J],ot=i.get($t);e.bindTexture(n.TEXTURE_2D,ot.__webglTexture),dt(n.TEXTURE_2D,$t),ht($.__webglFramebuffer,L,$t,n.COLOR_ATTACHMENT0+J,n.TEXTURE_2D,0),g($t)&&m(n.TEXTURE_2D)}e.unbindTexture()}else{let J=n.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(J=L.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(J,nt.__webglTexture),dt(J,E),E.mipmaps&&E.mipmaps.length>0)for(let vt=0;vt<E.mipmaps.length;vt++)ht($.__webglFramebuffer[vt],L,E,n.COLOR_ATTACHMENT0,J,vt);else ht($.__webglFramebuffer,L,E,n.COLOR_ATTACHMENT0,J,0);g(E)&&m(J),e.unbindTexture()}L.depthBuffer&&kt(L)}function Ht(L){const E=L.textures;for(let $=0,nt=E.length;$<nt;$++){const at=E[$];if(g(at)){const lt=x(L),Ot=i.get(at).__webglTexture;e.bindTexture(lt,Ot),m(lt),e.unbindTexture()}}}const Lt=[],G=[];function jt(L){if(L.samples>0){if(Dt(L)===!1){const E=L.textures,$=L.width,nt=L.height;let at=n.COLOR_BUFFER_BIT;const lt=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ot=i.get(L),J=E.length>1;if(J)for(let vt=0;vt<E.length;vt++)e.bindFramebuffer(n.FRAMEBUFFER,Ot.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+vt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,Ot.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+vt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,Ot.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ot.__webglFramebuffer);for(let vt=0;vt<E.length;vt++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(at|=n.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(at|=n.STENCIL_BUFFER_BIT)),J){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Ot.__webglColorRenderbuffer[vt]);const $t=i.get(E[vt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,$t,0)}n.blitFramebuffer(0,0,$,nt,0,0,$,nt,at,n.NEAREST),l===!0&&(Lt.length=0,G.length=0,Lt.push(n.COLOR_ATTACHMENT0+vt),L.depthBuffer&&L.resolveDepthBuffer===!1&&(Lt.push(lt),G.push(lt),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,G)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Lt))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),J)for(let vt=0;vt<E.length;vt++){e.bindFramebuffer(n.FRAMEBUFFER,Ot.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+vt,n.RENDERBUFFER,Ot.__webglColorRenderbuffer[vt]);const $t=i.get(E[vt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,Ot.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+vt,n.TEXTURE_2D,$t,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ot.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.resolveDepthBuffer===!1&&l){const E=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[E])}}}function Rt(L){return Math.min(s.maxSamples,L.samples)}function Dt(L){const E=i.get(L);return L.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function zt(L){const E=o.render.frame;h.get(L)!==E&&(h.set(L,E),L.update())}function It(L,E){const $=L.colorSpace,nt=L.format,at=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||$!==bs&&$!==ii&&(he.getTransfer($)===xe?(nt!==wn||at!==qn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",$)),E}function Pt(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(c.width=L.naturalWidth||L.width,c.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(c.width=L.displayWidth,c.height=L.displayHeight):(c.width=L.width,c.height=L.height),c}this.allocateTextureUnit=I,this.resetTextureUnits=F,this.setTexture2D=C,this.setTexture2DArray=D,this.setTexture3D=X,this.setTextureCube=H,this.rebindTextures=Ct,this.setupRenderTarget=Tt,this.updateRenderTargetMipmap=Ht,this.updateMultisampleRenderTarget=jt,this.setupDepthRenderbuffer=kt,this.setupFrameBufferTexture=ht,this.useMultisampledRTT=Dt}function fM(n,t){function e(i,s=ii){let a;const o=he.getTransfer(s);if(i===qn)return n.UNSIGNED_BYTE;if(i===jc)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Kc)return n.UNSIGNED_SHORT_5_5_5_1;if(i===tu)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Jd)return n.BYTE;if(i===Qd)return n.SHORT;if(i===Ks)return n.UNSIGNED_SHORT;if(i===qc)return n.INT;if(i===Ii)return n.UNSIGNED_INT;if(i===$n)return n.FLOAT;if(i===aa)return n.HALF_FLOAT;if(i===eu)return n.ALPHA;if(i===nu)return n.RGB;if(i===wn)return n.RGBA;if(i===iu)return n.LUMINANCE;if(i===su)return n.LUMINANCE_ALPHA;if(i===fs)return n.DEPTH_COMPONENT;if(i===Ms)return n.DEPTH_STENCIL;if(i===au)return n.RED;if(i===Jc)return n.RED_INTEGER;if(i===ou)return n.RG;if(i===Qc)return n.RG_INTEGER;if(i===tl)return n.RGBA_INTEGER;if(i===Za||i===qa||i===ja||i===Ka)if(o===xe)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===Za)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===qa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ja)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ka)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===Za)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===qa)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ja)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ka)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===ic||i===sc||i===ac||i===oc)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===ic)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===sc)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===ac)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===oc)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===rc||i===cc||i===lc)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(i===rc||i===cc)return o===xe?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===lc)return o===xe?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===hc||i===dc||i===uc||i===fc||i===pc||i===mc||i===gc||i===xc||i===vc||i===_c||i===yc||i===Mc||i===Sc||i===bc)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(i===hc)return o===xe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===dc)return o===xe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===uc)return o===xe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===fc)return o===xe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===pc)return o===xe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===mc)return o===xe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===gc)return o===xe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===xc)return o===xe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===vc)return o===xe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===_c)return o===xe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===yc)return o===xe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Mc)return o===xe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Sc)return o===xe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===bc)return o===xe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Ja||i===Ec||i===wc)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(i===Ja)return o===xe?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ec)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===wc)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===ru||i===Tc||i===Ac||i===Rc)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(i===Ja)return a.COMPRESSED_RED_RGTC1_EXT;if(i===Tc)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Ac)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Rc)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ys?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class pM extends mn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class ve extends De{constructor(){super(),this.isGroup=!0,this.type="Group"}}const mM={type:"move"};class yr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ve,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ve,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ve,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,a=null,o=null;const r=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const _ of t.hand.values()){const g=e.getJointPose(_,i),m=this._getHandJoint(c,_);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=h.position.distanceTo(f.position),u=.02,p=.005;c.inputState.pinching&&d>u+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=u-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(a=e.getPose(t.gripSpace,i),a!==null&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1));r!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&a!==null&&(s=a),s!==null&&(r.matrix.fromArray(s.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,s.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(s.linearVelocity)):r.hasLinearVelocity=!1,s.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(s.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(mM)))}return r!==null&&(r.visible=s!==null),l!==null&&(l.visible=a!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new ve;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const gM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,xM=`
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

}`;class vM{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const s=new Je,a=t.properties.get(s);a.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new hi({vertexShader:gM,fragmentShader:xM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ce(new pn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class _M extends Es{constructor(t,e){super();const i=this;let s=null,a=1,o=null,r="local-floor",l=1,c=null,h=null,f=null,d=null,u=null,p=null;const _=new vM,g=e.getContextAttributes();let m=null,x=null;const y=[],v=[],P=new Bt;let S=null;const w=new mn;w.viewport=new Ce;const T=new mn;T.viewport=new Ce;const b=[w,T],M=new pM;let R=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let tt=y[K];return tt===void 0&&(tt=new yr,y[K]=tt),tt.getTargetRaySpace()},this.getControllerGrip=function(K){let tt=y[K];return tt===void 0&&(tt=new yr,y[K]=tt),tt.getGripSpace()},this.getHand=function(K){let tt=y[K];return tt===void 0&&(tt=new yr,y[K]=tt),tt.getHandSpace()};function I(K){const tt=v.indexOf(K.inputSource);if(tt===-1)return;const ht=y[tt];ht!==void 0&&(ht.update(K.inputSource,K.frame,c||o),ht.dispatchEvent({type:K.type,data:K.inputSource}))}function z(){s.removeEventListener("select",I),s.removeEventListener("selectstart",I),s.removeEventListener("selectend",I),s.removeEventListener("squeeze",I),s.removeEventListener("squeezestart",I),s.removeEventListener("squeezeend",I),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",C);for(let K=0;K<y.length;K++){const tt=v[K];tt!==null&&(v[K]=null,y[K].disconnect(tt))}R=null,F=null,_.reset(),t.setRenderTarget(m),u=null,d=null,f=null,s=null,x=null,ut.stop(),i.isPresenting=!1,t.setPixelRatio(S),t.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){a=K,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){r=K,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return d!==null?d:u},this.getBinding=function(){return f},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(K){if(s=K,s!==null){if(m=t.getRenderTarget(),s.addEventListener("select",I),s.addEventListener("selectstart",I),s.addEventListener("selectend",I),s.addEventListener("squeeze",I),s.addEventListener("squeezestart",I),s.addEventListener("squeezeend",I),s.addEventListener("end",z),s.addEventListener("inputsourceschange",C),g.xrCompatible!==!0&&await e.makeXRCompatible(),S=t.getPixelRatio(),t.getSize(P),s.renderState.layers===void 0){const tt={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:a};u=new XRWebGLLayer(s,e,tt),s.updateRenderState({baseLayer:u}),t.setPixelRatio(1),t.setSize(u.framebufferWidth,u.framebufferHeight,!1),x=new ki(u.framebufferWidth,u.framebufferHeight,{format:wn,type:qn,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let tt=null,ht=null,j=null;g.depth&&(j=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,tt=g.stencil?Ms:fs,ht=g.stencil?ys:Ii);const Mt={colorFormat:e.RGBA8,depthFormat:j,scaleFactor:a};f=new XRWebGLBinding(s,e),d=f.createProjectionLayer(Mt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),x=new ki(d.textureWidth,d.textureHeight,{format:wn,type:qn,depthTexture:new Mu(d.textureWidth,d.textureHeight,ht,void 0,void 0,void 0,void 0,void 0,void 0,tt),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(r),ut.setContext(s),ut.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function C(K){for(let tt=0;tt<K.removed.length;tt++){const ht=K.removed[tt],j=v.indexOf(ht);j>=0&&(v[j]=null,y[j].disconnect(ht))}for(let tt=0;tt<K.added.length;tt++){const ht=K.added[tt];let j=v.indexOf(ht);if(j===-1){for(let kt=0;kt<y.length;kt++)if(kt>=v.length){v.push(ht),j=kt;break}else if(v[kt]===null){v[kt]=ht,j=kt;break}if(j===-1)break}const Mt=y[j];Mt&&Mt.connect(ht)}}const D=new V,X=new V;function H(K,tt,ht){D.setFromMatrixPosition(tt.matrixWorld),X.setFromMatrixPosition(ht.matrixWorld);const j=D.distanceTo(X),Mt=tt.projectionMatrix.elements,kt=ht.projectionMatrix.elements,Ct=Mt[14]/(Mt[10]-1),Tt=Mt[14]/(Mt[10]+1),Ht=(Mt[9]+1)/Mt[5],Lt=(Mt[9]-1)/Mt[5],G=(Mt[8]-1)/Mt[0],jt=(kt[8]+1)/kt[0],Rt=Ct*G,Dt=Ct*jt,zt=j/(-G+jt),It=zt*-G;if(tt.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(It),K.translateZ(zt),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),Mt[10]===-1)K.projectionMatrix.copy(tt.projectionMatrix),K.projectionMatrixInverse.copy(tt.projectionMatrixInverse);else{const Pt=Ct+zt,L=Tt+zt,E=Rt-It,$=Dt+(j-It),nt=Ht*Tt/L*Pt,at=Lt*Tt/L*Pt;K.projectionMatrix.makePerspective(E,$,nt,at,Pt,L),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function Z(K,tt){tt===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(tt.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(s===null)return;let tt=K.near,ht=K.far;_.texture!==null&&(_.depthNear>0&&(tt=_.depthNear),_.depthFar>0&&(ht=_.depthFar)),M.near=T.near=w.near=tt,M.far=T.far=w.far=ht,(R!==M.near||F!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),R=M.near,F=M.far),w.layers.mask=K.layers.mask|2,T.layers.mask=K.layers.mask|4,M.layers.mask=w.layers.mask|T.layers.mask;const j=K.parent,Mt=M.cameras;Z(M,j);for(let kt=0;kt<Mt.length;kt++)Z(Mt[kt],j);Mt.length===2?H(M,w,T):M.projectionMatrix.copy(w.projectionMatrix),Q(K,M,j)};function Q(K,tt,ht){ht===null?K.matrix.copy(tt.matrixWorld):(K.matrix.copy(ht.matrixWorld),K.matrix.invert(),K.matrix.multiply(tt.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(tt.projectionMatrix),K.projectionMatrixInverse.copy(tt.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=Js*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&u===null))return l},this.setFoveation=function(K){l=K,d!==null&&(d.fixedFoveation=K),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=K)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(M)};let mt=null;function dt(K,tt){if(h=tt.getViewerPose(c||o),p=tt,h!==null){const ht=h.views;u!==null&&(t.setRenderTargetFramebuffer(x,u.framebuffer),t.setRenderTarget(x));let j=!1;ht.length!==M.cameras.length&&(M.cameras.length=0,j=!0);for(let kt=0;kt<ht.length;kt++){const Ct=ht[kt];let Tt=null;if(u!==null)Tt=u.getViewport(Ct);else{const Lt=f.getViewSubImage(d,Ct);Tt=Lt.viewport,kt===0&&(t.setRenderTargetTextures(x,Lt.colorTexture,d.ignoreDepthValues?void 0:Lt.depthStencilTexture),t.setRenderTarget(x))}let Ht=b[kt];Ht===void 0&&(Ht=new mn,Ht.layers.enable(kt),Ht.viewport=new Ce,b[kt]=Ht),Ht.matrix.fromArray(Ct.transform.matrix),Ht.matrix.decompose(Ht.position,Ht.quaternion,Ht.scale),Ht.projectionMatrix.fromArray(Ct.projectionMatrix),Ht.projectionMatrixInverse.copy(Ht.projectionMatrix).invert(),Ht.viewport.set(Tt.x,Tt.y,Tt.width,Tt.height),kt===0&&(M.matrix.copy(Ht.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),j===!0&&M.cameras.push(Ht)}const Mt=s.enabledFeatures;if(Mt&&Mt.includes("depth-sensing")){const kt=f.getDepthInformation(ht[0]);kt&&kt.isValid&&kt.texture&&_.init(t,kt,s.renderState)}}for(let ht=0;ht<y.length;ht++){const j=v[ht],Mt=y[ht];j!==null&&Mt!==void 0&&Mt.update(j,tt,c||o)}mt&&mt(K,tt),tt.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:tt}),p=null}const ut=new _u;ut.setAnimationLoop(dt),this.setAnimationLoop=function(K){mt=K},this.dispose=function(){}}}const _i=new Nn,yM=new Se;function MM(n,t){function e(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function i(g,m){m.color.getRGB(g.fogColor.value,gu(n)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function s(g,m,x,y,v){m.isMeshBasicMaterial||m.isMeshLambertMaterial?a(g,m):m.isMeshToonMaterial?(a(g,m),f(g,m)):m.isMeshPhongMaterial?(a(g,m),h(g,m)):m.isMeshStandardMaterial?(a(g,m),d(g,m),m.isMeshPhysicalMaterial&&u(g,m,v)):m.isMeshMatcapMaterial?(a(g,m),p(g,m)):m.isMeshDepthMaterial?a(g,m):m.isMeshDistanceMaterial?(a(g,m),_(g,m)):m.isMeshNormalMaterial?a(g,m):m.isLineBasicMaterial?(o(g,m),m.isLineDashedMaterial&&r(g,m)):m.isPointsMaterial?l(g,m,x,y):m.isSpriteMaterial?c(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function a(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,e(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===nn&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,e(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===nn&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,e(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,e(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);const x=t.get(m),y=x.envMap,v=x.envMapRotation;y&&(g.envMap.value=y,_i.copy(v),_i.x*=-1,_i.y*=-1,_i.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(_i.y*=-1,_i.z*=-1),g.envMapRotation.value.setFromMatrix4(yM.makeRotationFromEuler(_i)),g.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,g.aoMapTransform))}function o(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform))}function r(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function l(g,m,x,y){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*x,g.scale.value=y*.5,m.map&&(g.map.value=m.map,e(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function c(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function h(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function f(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function d(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function u(g,m,x){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===nn&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=x.texture,g.transmissionSamplerSize.value.set(x.width,x.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,m){m.matcap&&(g.matcap.value=m.matcap)}function _(g,m){const x=t.get(m).light;g.referencePosition.value.setFromMatrixPosition(x.matrixWorld),g.nearDistance.value=x.shadow.camera.near,g.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function SM(n,t,e,i){let s={},a={},o=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,y){const v=y.program;i.uniformBlockBinding(x,v)}function c(x,y){let v=s[x.id];v===void 0&&(p(x),v=h(x),s[x.id]=v,x.addEventListener("dispose",g));const P=y.program;i.updateUBOMapping(x,P);const S=t.render.frame;a[x.id]!==S&&(d(x),a[x.id]=S)}function h(x){const y=f();x.__bindingPointIndex=y;const v=n.createBuffer(),P=x.__size,S=x.usage;return n.bindBuffer(n.UNIFORM_BUFFER,v),n.bufferData(n.UNIFORM_BUFFER,P,S),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,y,v),v}function f(){for(let x=0;x<r;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(x){const y=s[x.id],v=x.uniforms,P=x.__cache;n.bindBuffer(n.UNIFORM_BUFFER,y);for(let S=0,w=v.length;S<w;S++){const T=Array.isArray(v[S])?v[S]:[v[S]];for(let b=0,M=T.length;b<M;b++){const R=T[b];if(u(R,S,b,P)===!0){const F=R.__offset,I=Array.isArray(R.value)?R.value:[R.value];let z=0;for(let C=0;C<I.length;C++){const D=I[C],X=_(D);typeof D=="number"||typeof D=="boolean"?(R.__data[0]=D,n.bufferSubData(n.UNIFORM_BUFFER,F+z,R.__data)):D.isMatrix3?(R.__data[0]=D.elements[0],R.__data[1]=D.elements[1],R.__data[2]=D.elements[2],R.__data[3]=0,R.__data[4]=D.elements[3],R.__data[5]=D.elements[4],R.__data[6]=D.elements[5],R.__data[7]=0,R.__data[8]=D.elements[6],R.__data[9]=D.elements[7],R.__data[10]=D.elements[8],R.__data[11]=0):(D.toArray(R.__data,z),z+=X.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,F,R.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function u(x,y,v,P){const S=x.value,w=y+"_"+v;if(P[w]===void 0)return typeof S=="number"||typeof S=="boolean"?P[w]=S:P[w]=S.clone(),!0;{const T=P[w];if(typeof S=="number"||typeof S=="boolean"){if(T!==S)return P[w]=S,!0}else if(T.equals(S)===!1)return T.copy(S),!0}return!1}function p(x){const y=x.uniforms;let v=0;const P=16;for(let w=0,T=y.length;w<T;w++){const b=Array.isArray(y[w])?y[w]:[y[w]];for(let M=0,R=b.length;M<R;M++){const F=b[M],I=Array.isArray(F.value)?F.value:[F.value];for(let z=0,C=I.length;z<C;z++){const D=I[z],X=_(D),H=v%P,Z=H%X.boundary,Q=H+Z;v+=Z,Q!==0&&P-Q<X.storage&&(v+=P-Q),F.__data=new Float32Array(X.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=v,v+=X.storage}}}const S=v%P;return S>0&&(v+=P-S),x.__size=v,x.__cache={},this}function _(x){const y={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(y.boundary=4,y.storage=4):x.isVector2?(y.boundary=8,y.storage=8):x.isVector3||x.isColor?(y.boundary=16,y.storage=12):x.isVector4?(y.boundary=16,y.storage=16):x.isMatrix3?(y.boundary=48,y.storage=48):x.isMatrix4?(y.boundary=64,y.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),y}function g(x){const y=x.target;y.removeEventListener("dispose",g);const v=o.indexOf(y.__bindingPointIndex);o.splice(v,1),n.deleteBuffer(s[y.id]),delete s[y.id],delete a[y.id]}function m(){for(const x in s)n.deleteBuffer(s[x]);o=[],s={},a={}}return{bind:l,update:c,dispose:m}}class bM{constructor(t={}){const{canvas:e=dg(),context:i=null,depth:s=!0,stencil:a=!1,alpha:o=!1,antialias:r=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let u;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=i.getContextAttributes().alpha}else u=o;const p=new Uint32Array(4),_=new Int32Array(4);let g=null,m=null;const x=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=je,this.toneMapping=ci,this.toneMappingExposure=1;const v=this;let P=!1,S=0,w=0,T=null,b=-1,M=null;const R=new Ce,F=new Ce;let I=null;const z=new qt(0);let C=0,D=e.width,X=e.height,H=1,Z=null,Q=null;const mt=new Ce(0,0,D,X),dt=new Ce(0,0,D,X);let ut=!1;const K=new sl;let tt=!1,ht=!1;const j=new Se,Mt=new Se,kt=new V,Ct=new Ce,Tt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ht=!1;function Lt(){return T===null?H:1}let G=i;function jt(A,W){return e.getContext(A,W)}try{const A={alpha:!0,depth:s,stencil:a,antialias:r,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Yc}`),e.addEventListener("webglcontextlost",ct,!1),e.addEventListener("webglcontextrestored",yt,!1),e.addEventListener("webglcontextcreationerror",Et,!1),G===null){const W="webgl2";if(G=jt(W,A),G===null)throw jt(W)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let Rt,Dt,zt,It,Pt,L,E,$,nt,at,lt,Ot,J,vt,$t,ot,_t,B,it,pt,Ut,Nt,Gt,N;function St(){Rt=new R_(G),Rt.init(),Nt=new fM(G,Rt),Dt=new S_(G,Rt,t,Nt),zt=new hM(G,Rt),Dt.reverseDepthBuffer&&d&&zt.buffers.depth.setReversed(!0),It=new D_(G),Pt=new qy,L=new uM(G,Rt,zt,Pt,Dt,Nt,It),E=new E_(v),$=new A_(v),nt=new zg(G),Gt=new y_(G,nt),at=new C_(G,nt,It,Gt),lt=new I_(G,at,nt,It),it=new L_(G,Dt,L),ot=new b_(Pt),Ot=new Zy(v,E,$,Rt,Dt,Gt,ot),J=new MM(v,Pt),vt=new Ky,$t=new iM(Rt),B=new __(v,E,$,zt,lt,u,l),_t=new cM(v,lt,Dt),N=new SM(G,It,Dt,zt),pt=new M_(G,Rt,It),Ut=new P_(G,Rt,It),It.programs=Ot.programs,v.capabilities=Dt,v.extensions=Rt,v.properties=Pt,v.renderLists=vt,v.shadowMap=_t,v.state=zt,v.info=It}St();const q=new _M(v,G);this.xr=q,this.getContext=function(){return G},this.getContextAttributes=function(){return G.getContextAttributes()},this.forceContextLoss=function(){const A=Rt.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=Rt.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(A){A!==void 0&&(H=A,this.setSize(D,X,!1))},this.getSize=function(A){return A.set(D,X)},this.setSize=function(A,W,k=!0){if(q.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}D=A,X=W,e.width=Math.floor(A*H),e.height=Math.floor(W*H),k===!0&&(e.style.width=A+"px",e.style.height=W+"px"),this.setViewport(0,0,A,W)},this.getDrawingBufferSize=function(A){return A.set(D*H,X*H).floor()},this.setDrawingBufferSize=function(A,W,k){D=A,X=W,H=k,e.width=Math.floor(A*k),e.height=Math.floor(W*k),this.setViewport(0,0,A,W)},this.getCurrentViewport=function(A){return A.copy(R)},this.getViewport=function(A){return A.copy(mt)},this.setViewport=function(A,W,k,O){A.isVector4?mt.set(A.x,A.y,A.z,A.w):mt.set(A,W,k,O),zt.viewport(R.copy(mt).multiplyScalar(H).round())},this.getScissor=function(A){return A.copy(dt)},this.setScissor=function(A,W,k,O){A.isVector4?dt.set(A.x,A.y,A.z,A.w):dt.set(A,W,k,O),zt.scissor(F.copy(dt).multiplyScalar(H).round())},this.getScissorTest=function(){return ut},this.setScissorTest=function(A){zt.setScissorTest(ut=A)},this.setOpaqueSort=function(A){Z=A},this.setTransparentSort=function(A){Q=A},this.getClearColor=function(A){return A.copy(B.getClearColor())},this.setClearColor=function(){B.setClearColor.apply(B,arguments)},this.getClearAlpha=function(){return B.getClearAlpha()},this.setClearAlpha=function(){B.setClearAlpha.apply(B,arguments)},this.clear=function(A=!0,W=!0,k=!0){let O=0;if(A){let U=!1;if(T!==null){const rt=T.texture.format;U=rt===tl||rt===Qc||rt===Jc}if(U){const rt=T.texture.type,ft=rt===qn||rt===Ii||rt===Ks||rt===ys||rt===jc||rt===Kc,xt=B.getClearColor(),At=B.getClearAlpha(),st=xt.r,et=xt.g,gt=xt.b;ft?(p[0]=st,p[1]=et,p[2]=gt,p[3]=At,G.clearBufferuiv(G.COLOR,0,p)):(_[0]=st,_[1]=et,_[2]=gt,_[3]=At,G.clearBufferiv(G.COLOR,0,_))}else O|=G.COLOR_BUFFER_BIT}W&&(O|=G.DEPTH_BUFFER_BIT),k&&(O|=G.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G.clear(O)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ct,!1),e.removeEventListener("webglcontextrestored",yt,!1),e.removeEventListener("webglcontextcreationerror",Et,!1),vt.dispose(),$t.dispose(),Pt.dispose(),E.dispose(),$.dispose(),lt.dispose(),Gt.dispose(),N.dispose(),Ot.dispose(),q.dispose(),q.removeEventListener("sessionstart",Ge),q.removeEventListener("sessionend",ze),Y.stop()};function ct(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),P=!0}function yt(){console.log("THREE.WebGLRenderer: Context Restored."),P=!1;const A=It.autoReset,W=_t.enabled,k=_t.autoUpdate,O=_t.needsUpdate,U=_t.type;St(),It.autoReset=A,_t.enabled=W,_t.autoUpdate=k,_t.needsUpdate=O,_t.type=U}function Et(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function Xt(A){const W=A.target;W.removeEventListener("dispose",Xt),Kt(W)}function Kt(A){oe(A),Pt.remove(A)}function oe(A){const W=Pt.get(A).programs;W!==void 0&&(W.forEach(function(k){Ot.releaseProgram(k)}),A.isShaderMaterial&&Ot.releaseShaderCache(A))}this.renderBufferDirect=function(A,W,k,O,U,rt){W===null&&(W=Tt);const ft=U.isMesh&&U.matrixWorld.determinant()<0,xt=de(A,W,k,O,U);zt.setMaterial(O,ft);let At=k.index,st=1;if(O.wireframe===!0){if(At=at.getWireframeAttribute(k),At===void 0)return;st=2}const et=k.drawRange,gt=k.attributes.position;let Wt=et.start*st,Zt=(et.start+et.count)*st;rt!==null&&(Wt=Math.max(Wt,rt.start*st),Zt=Math.min(Zt,(rt.start+rt.count)*st)),At!==null?(Wt=Math.max(Wt,0),Zt=Math.min(Zt,At.count)):gt!=null&&(Wt=Math.max(Wt,0),Zt=Math.min(Zt,gt.count));const ae=Zt-Wt;if(ae<0||ae===1/0)return;Gt.setup(U,O,xt,k,At);let ge,te=pt;if(At!==null&&(ge=nt.get(At),te=Ut,te.setIndex(ge)),U.isMesh)O.wireframe===!0?(zt.setLineWidth(O.wireframeLinewidth*Lt()),te.setMode(G.LINES)):te.setMode(G.TRIANGLES);else if(U.isLine){let Vt=O.linewidth;Vt===void 0&&(Vt=1),zt.setLineWidth(Vt*Lt()),U.isLineSegments?te.setMode(G.LINES):U.isLineLoop?te.setMode(G.LINE_LOOP):te.setMode(G.LINE_STRIP)}else U.isPoints?te.setMode(G.POINTS):U.isSprite&&te.setMode(G.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)te.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(Rt.get("WEBGL_multi_draw"))te.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{const Vt=U._multiDrawStarts,Pe=U._multiDrawCounts,re=U._multiDrawCount,Ee=At?nt.get(At).bytesPerElement:1,vn=Pt.get(O).currentProgram.getUniforms();for(let Ve=0;Ve<re;Ve++)vn.setValue(G,"_gl_DrawID",Ve),te.render(Vt[Ve]/Ee,Pe[Ve])}else if(U.isInstancedMesh)te.renderInstances(Wt,ae,U.count);else if(k.isInstancedBufferGeometry){const Vt=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,Pe=Math.min(k.instanceCount,Vt);te.renderInstances(Wt,ae,Pe)}else te.render(Wt,ae)};function Qt(A,W,k){A.transparent===!0&&A.side===Ae&&A.forceSinglePass===!1?(A.side=nn,A.needsUpdate=!0,ue(A,W,k),A.side=li,A.needsUpdate=!0,ue(A,W,k),A.side=Ae):ue(A,W,k)}this.compile=function(A,W,k=null){k===null&&(k=A),m=$t.get(k),m.init(W),y.push(m),k.traverseVisible(function(U){U.isLight&&U.layers.test(W.layers)&&(m.pushLight(U),U.castShadow&&m.pushShadow(U))}),A!==k&&A.traverseVisible(function(U){U.isLight&&U.layers.test(W.layers)&&(m.pushLight(U),U.castShadow&&m.pushShadow(U))}),m.setupLights();const O=new Set;return A.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;const rt=U.material;if(rt)if(Array.isArray(rt))for(let ft=0;ft<rt.length;ft++){const xt=rt[ft];Qt(xt,k,U),O.add(xt)}else Qt(rt,k,U),O.add(rt)}),y.pop(),m=null,O},this.compileAsync=function(A,W,k=null){const O=this.compile(A,W,k);return new Promise(U=>{function rt(){if(O.forEach(function(ft){Pt.get(ft).currentProgram.isReady()&&O.delete(ft)}),O.size===0){U(A);return}setTimeout(rt,10)}Rt.get("KHR_parallel_shader_compile")!==null?rt():setTimeout(rt,10)})};let ie=null;function ye(A){ie&&ie(A)}function Ge(){Y.stop()}function ze(){Y.start()}const Y=new _u;Y.setAnimationLoop(ye),typeof self<"u"&&Y.setContext(self),this.setAnimationLoop=function(A){ie=A,q.setAnimationLoop(A),A===null?Y.stop():Y.start()},q.addEventListener("sessionstart",Ge),q.addEventListener("sessionend",ze),this.render=function(A,W){if(W!==void 0&&W.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),W.parent===null&&W.matrixWorldAutoUpdate===!0&&W.updateMatrixWorld(),q.enabled===!0&&q.isPresenting===!0&&(q.cameraAutoUpdate===!0&&q.updateCamera(W),W=q.getCamera()),A.isScene===!0&&A.onBeforeRender(v,A,W,T),m=$t.get(A,y.length),m.init(W),y.push(m),Mt.multiplyMatrices(W.projectionMatrix,W.matrixWorldInverse),K.setFromProjectionMatrix(Mt),ht=this.localClippingEnabled,tt=ot.init(this.clippingPlanes,ht),g=vt.get(A,x.length),g.init(),x.push(g),q.enabled===!0&&q.isPresenting===!0){const rt=v.xr.getDepthSensingMesh();rt!==null&&bt(rt,W,-1/0,v.sortObjects)}bt(A,W,0,v.sortObjects),g.finish(),v.sortObjects===!0&&g.sort(Z,Q),Ht=q.enabled===!1||q.isPresenting===!1||q.hasDepthSensing()===!1,Ht&&B.addToRenderList(g,A),this.info.render.frame++,tt===!0&&ot.beginShadows();const k=m.state.shadowsArray;_t.render(k,A,W),tt===!0&&ot.endShadows(),this.info.autoReset===!0&&this.info.reset();const O=g.opaque,U=g.transmissive;if(m.setupLights(),W.isArrayCamera){const rt=W.cameras;if(U.length>0)for(let ft=0,xt=rt.length;ft<xt;ft++){const At=rt[ft];Jt(O,U,A,At)}Ht&&B.render(A);for(let ft=0,xt=rt.length;ft<xt;ft++){const At=rt[ft];wt(g,A,At,At.viewport)}}else U.length>0&&Jt(O,U,A,W),Ht&&B.render(A),wt(g,A,W);T!==null&&(L.updateMultisampleRenderTarget(T),L.updateRenderTargetMipmap(T)),A.isScene===!0&&A.onAfterRender(v,A,W),Gt.resetDefaultState(),b=-1,M=null,y.pop(),y.length>0?(m=y[y.length-1],tt===!0&&ot.setGlobalState(v.clippingPlanes,m.state.camera)):m=null,x.pop(),x.length>0?g=x[x.length-1]:g=null};function bt(A,W,k,O){if(A.visible===!1)return;if(A.layers.test(W.layers)){if(A.isGroup)k=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(W);else if(A.isLight)m.pushLight(A),A.castShadow&&m.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||K.intersectsSprite(A)){O&&Ct.setFromMatrixPosition(A.matrixWorld).applyMatrix4(Mt);const ft=lt.update(A),xt=A.material;xt.visible&&g.push(A,ft,xt,k,Ct.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||K.intersectsObject(A))){const ft=lt.update(A),xt=A.material;if(O&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),Ct.copy(A.boundingSphere.center)):(ft.boundingSphere===null&&ft.computeBoundingSphere(),Ct.copy(ft.boundingSphere.center)),Ct.applyMatrix4(A.matrixWorld).applyMatrix4(Mt)),Array.isArray(xt)){const At=ft.groups;for(let st=0,et=At.length;st<et;st++){const gt=At[st],Wt=xt[gt.materialIndex];Wt&&Wt.visible&&g.push(A,ft,Wt,k,Ct.z,gt)}}else xt.visible&&g.push(A,ft,xt,k,Ct.z,null)}}const rt=A.children;for(let ft=0,xt=rt.length;ft<xt;ft++)bt(rt[ft],W,k,O)}function wt(A,W,k,O){const U=A.opaque,rt=A.transmissive,ft=A.transparent;m.setupLightsView(k),tt===!0&&ot.setGlobalState(v.clippingPlanes,k),O&&zt.viewport(R.copy(O)),U.length>0&&Yt(U,W,k),rt.length>0&&Yt(rt,W,k),ft.length>0&&Yt(ft,W,k),zt.buffers.depth.setTest(!0),zt.buffers.depth.setMask(!0),zt.buffers.color.setMask(!0),zt.setPolygonOffset(!1)}function Jt(A,W,k,O){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[O.id]===void 0&&(m.state.transmissionRenderTarget[O.id]=new ki(1,1,{generateMipmaps:!0,type:Rt.has("EXT_color_buffer_half_float")||Rt.has("EXT_color_buffer_float")?aa:qn,minFilter:Pi,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:he.workingColorSpace}));const rt=m.state.transmissionRenderTarget[O.id],ft=O.viewport||R;rt.setSize(ft.z,ft.w);const xt=v.getRenderTarget();v.setRenderTarget(rt),v.getClearColor(z),C=v.getClearAlpha(),C<1&&v.setClearColor(16777215,.5),v.clear(),Ht&&B.render(k);const At=v.toneMapping;v.toneMapping=ci;const st=O.viewport;if(O.viewport!==void 0&&(O.viewport=void 0),m.setupLightsView(O),tt===!0&&ot.setGlobalState(v.clippingPlanes,O),Yt(A,k,O),L.updateMultisampleRenderTarget(rt),L.updateRenderTargetMipmap(rt),Rt.has("WEBGL_multisampled_render_to_texture")===!1){let et=!1;for(let gt=0,Wt=W.length;gt<Wt;gt++){const Zt=W[gt],ae=Zt.object,ge=Zt.geometry,te=Zt.material,Vt=Zt.group;if(te.side===Ae&&ae.layers.test(O.layers)){const Pe=te.side;te.side=nn,te.needsUpdate=!0,se(ae,k,O,ge,te,Vt),te.side=Pe,te.needsUpdate=!0,et=!0}}et===!0&&(L.updateMultisampleRenderTarget(rt),L.updateRenderTargetMipmap(rt))}v.setRenderTarget(xt),v.setClearColor(z,C),st!==void 0&&(O.viewport=st),v.toneMapping=At}function Yt(A,W,k){const O=W.isScene===!0?W.overrideMaterial:null;for(let U=0,rt=A.length;U<rt;U++){const ft=A[U],xt=ft.object,At=ft.geometry,st=O===null?ft.material:O,et=ft.group;xt.layers.test(k.layers)&&se(xt,W,k,At,st,et)}}function se(A,W,k,O,U,rt){A.onBeforeRender(v,W,k,O,U,rt),A.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),U.onBeforeRender(v,W,k,O,A,rt),U.transparent===!0&&U.side===Ae&&U.forceSinglePass===!1?(U.side=nn,U.needsUpdate=!0,v.renderBufferDirect(k,W,O,U,A,rt),U.side=li,U.needsUpdate=!0,v.renderBufferDirect(k,W,O,U,A,rt),U.side=Ae):v.renderBufferDirect(k,W,O,U,A,rt),A.onAfterRender(v,W,k,O,U,rt)}function ue(A,W,k){W.isScene!==!0&&(W=Tt);const O=Pt.get(A),U=m.state.lights,rt=m.state.shadowsArray,ft=U.state.version,xt=Ot.getParameters(A,U.state,rt,W,k),At=Ot.getProgramCacheKey(xt);let st=O.programs;O.environment=A.isMeshStandardMaterial?W.environment:null,O.fog=W.fog,O.envMap=(A.isMeshStandardMaterial?$:E).get(A.envMap||O.environment),O.envMapRotation=O.environment!==null&&A.envMap===null?W.environmentRotation:A.envMapRotation,st===void 0&&(A.addEventListener("dispose",Xt),st=new Map,O.programs=st);let et=st.get(At);if(et!==void 0){if(O.currentProgram===et&&O.lightsStateVersion===ft)return Oe(A,xt),et}else xt.uniforms=Ot.getUniforms(A),A.onBeforeCompile(xt,v),et=Ot.acquireProgram(xt,At),st.set(At,et),O.uniforms=xt.uniforms;const gt=O.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(gt.clippingPlanes=ot.uniform),Oe(A,xt),O.needsLights=dn(A),O.lightsStateVersion=ft,O.needsLights&&(gt.ambientLightColor.value=U.state.ambient,gt.lightProbe.value=U.state.probe,gt.directionalLights.value=U.state.directional,gt.directionalLightShadows.value=U.state.directionalShadow,gt.spotLights.value=U.state.spot,gt.spotLightShadows.value=U.state.spotShadow,gt.rectAreaLights.value=U.state.rectArea,gt.ltc_1.value=U.state.rectAreaLTC1,gt.ltc_2.value=U.state.rectAreaLTC2,gt.pointLights.value=U.state.point,gt.pointLightShadows.value=U.state.pointShadow,gt.hemisphereLights.value=U.state.hemi,gt.directionalShadowMap.value=U.state.directionalShadowMap,gt.directionalShadowMatrix.value=U.state.directionalShadowMatrix,gt.spotShadowMap.value=U.state.spotShadowMap,gt.spotLightMatrix.value=U.state.spotLightMatrix,gt.spotLightMap.value=U.state.spotLightMap,gt.pointShadowMap.value=U.state.pointShadowMap,gt.pointShadowMatrix.value=U.state.pointShadowMatrix),O.currentProgram=et,O.uniformsList=null,et}function Me(A){if(A.uniformsList===null){const W=A.currentProgram.getUniforms();A.uniformsList=Qa.seqWithValue(W.seq,A.uniforms)}return A.uniformsList}function Oe(A,W){const k=Pt.get(A);k.outputColorSpace=W.outputColorSpace,k.batching=W.batching,k.batchingColor=W.batchingColor,k.instancing=W.instancing,k.instancingColor=W.instancingColor,k.instancingMorph=W.instancingMorph,k.skinning=W.skinning,k.morphTargets=W.morphTargets,k.morphNormals=W.morphNormals,k.morphColors=W.morphColors,k.morphTargetsCount=W.morphTargetsCount,k.numClippingPlanes=W.numClippingPlanes,k.numIntersection=W.numClipIntersection,k.vertexAlphas=W.vertexAlphas,k.vertexTangents=W.vertexTangents,k.toneMapping=W.toneMapping}function de(A,W,k,O,U){W.isScene!==!0&&(W=Tt),L.resetTextureUnits();const rt=W.fog,ft=O.isMeshStandardMaterial?W.environment:null,xt=T===null?v.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:bs,At=(O.isMeshStandardMaterial?$:E).get(O.envMap||ft),st=O.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,et=!!k.attributes.tangent&&(!!O.normalMap||O.anisotropy>0),gt=!!k.morphAttributes.position,Wt=!!k.morphAttributes.normal,Zt=!!k.morphAttributes.color;let ae=ci;O.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(ae=v.toneMapping);const ge=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,te=ge!==void 0?ge.length:0,Vt=Pt.get(O),Pe=m.state.lights;if(tt===!0&&(ht===!0||A!==M)){const Ye=A===M&&O.id===b;ot.setState(O,A,Ye)}let re=!1;O.version===Vt.__version?(Vt.needsLights&&Vt.lightsStateVersion!==Pe.state.version||Vt.outputColorSpace!==xt||U.isBatchedMesh&&Vt.batching===!1||!U.isBatchedMesh&&Vt.batching===!0||U.isBatchedMesh&&Vt.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&Vt.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&Vt.instancing===!1||!U.isInstancedMesh&&Vt.instancing===!0||U.isSkinnedMesh&&Vt.skinning===!1||!U.isSkinnedMesh&&Vt.skinning===!0||U.isInstancedMesh&&Vt.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&Vt.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&Vt.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&Vt.instancingMorph===!1&&U.morphTexture!==null||Vt.envMap!==At||O.fog===!0&&Vt.fog!==rt||Vt.numClippingPlanes!==void 0&&(Vt.numClippingPlanes!==ot.numPlanes||Vt.numIntersection!==ot.numIntersection)||Vt.vertexAlphas!==st||Vt.vertexTangents!==et||Vt.morphTargets!==gt||Vt.morphNormals!==Wt||Vt.morphColors!==Zt||Vt.toneMapping!==ae||Vt.morphTargetsCount!==te)&&(re=!0):(re=!0,Vt.__version=O.version);let Ee=Vt.currentProgram;re===!0&&(Ee=ue(O,W,U));let vn=!1,Ve=!1,di=!1;const _e=Ee.getUniforms(),un=Vt.uniforms;if(zt.useProgram(Ee.program)&&(vn=!0,Ve=!0,di=!0),O.id!==b&&(b=O.id,Ve=!0),vn||M!==A){zt.buffers.depth.getReversed()?(j.copy(A.projectionMatrix),fg(j),pg(j),_e.setValue(G,"projectionMatrix",j)):_e.setValue(G,"projectionMatrix",A.projectionMatrix),_e.setValue(G,"viewMatrix",A.matrixWorldInverse);const Rn=_e.map.cameraPosition;Rn!==void 0&&Rn.setValue(G,kt.setFromMatrixPosition(A.matrixWorld)),Dt.logarithmicDepthBuffer&&_e.setValue(G,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(O.isMeshPhongMaterial||O.isMeshToonMaterial||O.isMeshLambertMaterial||O.isMeshBasicMaterial||O.isMeshStandardMaterial||O.isShaderMaterial)&&_e.setValue(G,"isOrthographic",A.isOrthographicCamera===!0),M!==A&&(M=A,Ve=!0,di=!0)}if(U.isSkinnedMesh){_e.setOptional(G,U,"bindMatrix"),_e.setOptional(G,U,"bindMatrixInverse");const Ye=U.skeleton;Ye&&(Ye.boneTexture===null&&Ye.computeBoneTexture(),_e.setValue(G,"boneTexture",Ye.boneTexture,L))}U.isBatchedMesh&&(_e.setOptional(G,U,"batchingTexture"),_e.setValue(G,"batchingTexture",U._matricesTexture,L),_e.setOptional(G,U,"batchingIdTexture"),_e.setValue(G,"batchingIdTexture",U._indirectTexture,L),_e.setOptional(G,U,"batchingColorTexture"),U._colorsTexture!==null&&_e.setValue(G,"batchingColorTexture",U._colorsTexture,L));const jn=k.morphAttributes;if((jn.position!==void 0||jn.normal!==void 0||jn.color!==void 0)&&it.update(U,k,Ee),(Ve||Vt.receiveShadow!==U.receiveShadow)&&(Vt.receiveShadow=U.receiveShadow,_e.setValue(G,"receiveShadow",U.receiveShadow)),O.isMeshGouraudMaterial&&O.envMap!==null&&(un.envMap.value=At,un.flipEnvMap.value=At.isCubeTexture&&At.isRenderTargetTexture===!1?-1:1),O.isMeshStandardMaterial&&O.envMap===null&&W.environment!==null&&(un.envMapIntensity.value=W.environmentIntensity),Ve&&(_e.setValue(G,"toneMappingExposure",v.toneMappingExposure),Vt.needsLights&&an(un,di),rt&&O.fog===!0&&J.refreshFogUniforms(un,rt),J.refreshMaterialUniforms(un,O,H,X,m.state.transmissionRenderTarget[A.id]),Qa.upload(G,Me(Vt),un,L)),O.isShaderMaterial&&O.uniformsNeedUpdate===!0&&(Qa.upload(G,Me(Vt),un,L),O.uniformsNeedUpdate=!1),O.isSpriteMaterial&&_e.setValue(G,"center",U.center),_e.setValue(G,"modelViewMatrix",U.modelViewMatrix),_e.setValue(G,"normalMatrix",U.normalMatrix),_e.setValue(G,"modelMatrix",U.matrixWorld),O.isShaderMaterial||O.isRawShaderMaterial){const Ye=O.uniformsGroups;for(let Rn=0,Cn=Ye.length;Rn<Cn;Rn++){const Ts=Ye[Rn];N.update(Ts,Ee),N.bind(Ts,Ee)}}return Ee}function an(A,W){A.ambientLightColor.needsUpdate=W,A.lightProbe.needsUpdate=W,A.directionalLights.needsUpdate=W,A.directionalLightShadows.needsUpdate=W,A.pointLights.needsUpdate=W,A.pointLightShadows.needsUpdate=W,A.spotLights.needsUpdate=W,A.spotLightShadows.needsUpdate=W,A.rectAreaLights.needsUpdate=W,A.hemisphereLights.needsUpdate=W}function dn(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(A,W,k){Pt.get(A.texture).__webglTexture=W,Pt.get(A.depthTexture).__webglTexture=k;const O=Pt.get(A);O.__hasExternalTextures=!0,O.__autoAllocateDepthBuffer=k===void 0,O.__autoAllocateDepthBuffer||Rt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),O.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(A,W){const k=Pt.get(A);k.__webglFramebuffer=W,k.__useDefaultFramebuffer=W===void 0},this.setRenderTarget=function(A,W=0,k=0){T=A,S=W,w=k;let O=!0,U=null,rt=!1,ft=!1;if(A){const At=Pt.get(A);if(At.__useDefaultFramebuffer!==void 0)zt.bindFramebuffer(G.FRAMEBUFFER,null),O=!1;else if(At.__webglFramebuffer===void 0)L.setupRenderTarget(A);else if(At.__hasExternalTextures)L.rebindTextures(A,Pt.get(A.texture).__webglTexture,Pt.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const gt=A.depthTexture;if(At.__boundDepthTexture!==gt){if(gt!==null&&Pt.has(gt)&&(A.width!==gt.image.width||A.height!==gt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");L.setupDepthRenderbuffer(A)}}const st=A.texture;(st.isData3DTexture||st.isDataArrayTexture||st.isCompressedArrayTexture)&&(ft=!0);const et=Pt.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(et[W])?U=et[W][k]:U=et[W],rt=!0):A.samples>0&&L.useMultisampledRTT(A)===!1?U=Pt.get(A).__webglMultisampledFramebuffer:Array.isArray(et)?U=et[k]:U=et,R.copy(A.viewport),F.copy(A.scissor),I=A.scissorTest}else R.copy(mt).multiplyScalar(H).floor(),F.copy(dt).multiplyScalar(H).floor(),I=ut;if(zt.bindFramebuffer(G.FRAMEBUFFER,U)&&O&&zt.drawBuffers(A,U),zt.viewport(R),zt.scissor(F),zt.setScissorTest(I),rt){const At=Pt.get(A.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_CUBE_MAP_POSITIVE_X+W,At.__webglTexture,k)}else if(ft){const At=Pt.get(A.texture),st=W||0;G.framebufferTextureLayer(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,At.__webglTexture,k||0,st)}b=-1},this.readRenderTargetPixels=function(A,W,k,O,U,rt,ft){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let xt=Pt.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&ft!==void 0&&(xt=xt[ft]),xt){zt.bindFramebuffer(G.FRAMEBUFFER,xt);try{const At=A.texture,st=At.format,et=At.type;if(!Dt.textureFormatReadable(st)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Dt.textureTypeReadable(et)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}W>=0&&W<=A.width-O&&k>=0&&k<=A.height-U&&G.readPixels(W,k,O,U,Nt.convert(st),Nt.convert(et),rt)}finally{const At=T!==null?Pt.get(T).__webglFramebuffer:null;zt.bindFramebuffer(G.FRAMEBUFFER,At)}}},this.readRenderTargetPixelsAsync=async function(A,W,k,O,U,rt,ft){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let xt=Pt.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&ft!==void 0&&(xt=xt[ft]),xt){const At=A.texture,st=At.format,et=At.type;if(!Dt.textureFormatReadable(st))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Dt.textureTypeReadable(et))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(W>=0&&W<=A.width-O&&k>=0&&k<=A.height-U){zt.bindFramebuffer(G.FRAMEBUFFER,xt);const gt=G.createBuffer();G.bindBuffer(G.PIXEL_PACK_BUFFER,gt),G.bufferData(G.PIXEL_PACK_BUFFER,rt.byteLength,G.STREAM_READ),G.readPixels(W,k,O,U,Nt.convert(st),Nt.convert(et),0);const Wt=T!==null?Pt.get(T).__webglFramebuffer:null;zt.bindFramebuffer(G.FRAMEBUFFER,Wt);const Zt=G.fenceSync(G.SYNC_GPU_COMMANDS_COMPLETE,0);return G.flush(),await ug(G,Zt,4),G.bindBuffer(G.PIXEL_PACK_BUFFER,gt),G.getBufferSubData(G.PIXEL_PACK_BUFFER,0,rt),G.deleteBuffer(gt),G.deleteSync(Zt),rt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(A,W=null,k=0){A.isTexture!==!0&&(Bs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),W=arguments[0]||null,A=arguments[1]);const O=Math.pow(2,-k),U=Math.floor(A.image.width*O),rt=Math.floor(A.image.height*O),ft=W!==null?W.x:0,xt=W!==null?W.y:0;L.setTexture2D(A,0),G.copyTexSubImage2D(G.TEXTURE_2D,k,0,0,ft,xt,U,rt),zt.unbindTexture()},this.copyTextureToTexture=function(A,W,k=null,O=null,U=0){A.isTexture!==!0&&(Bs("WebGLRenderer: copyTextureToTexture function signature has changed."),O=arguments[0]||null,A=arguments[1],W=arguments[2],U=arguments[3]||0,k=null);let rt,ft,xt,At,st,et,gt,Wt,Zt;const ae=A.isCompressedTexture?A.mipmaps[U]:A.image;k!==null?(rt=k.max.x-k.min.x,ft=k.max.y-k.min.y,xt=k.isBox3?k.max.z-k.min.z:1,At=k.min.x,st=k.min.y,et=k.isBox3?k.min.z:0):(rt=ae.width,ft=ae.height,xt=ae.depth||1,At=0,st=0,et=0),O!==null?(gt=O.x,Wt=O.y,Zt=O.z):(gt=0,Wt=0,Zt=0);const ge=Nt.convert(W.format),te=Nt.convert(W.type);let Vt;W.isData3DTexture?(L.setTexture3D(W,0),Vt=G.TEXTURE_3D):W.isDataArrayTexture||W.isCompressedArrayTexture?(L.setTexture2DArray(W,0),Vt=G.TEXTURE_2D_ARRAY):(L.setTexture2D(W,0),Vt=G.TEXTURE_2D),G.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,W.flipY),G.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,W.premultiplyAlpha),G.pixelStorei(G.UNPACK_ALIGNMENT,W.unpackAlignment);const Pe=G.getParameter(G.UNPACK_ROW_LENGTH),re=G.getParameter(G.UNPACK_IMAGE_HEIGHT),Ee=G.getParameter(G.UNPACK_SKIP_PIXELS),vn=G.getParameter(G.UNPACK_SKIP_ROWS),Ve=G.getParameter(G.UNPACK_SKIP_IMAGES);G.pixelStorei(G.UNPACK_ROW_LENGTH,ae.width),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,ae.height),G.pixelStorei(G.UNPACK_SKIP_PIXELS,At),G.pixelStorei(G.UNPACK_SKIP_ROWS,st),G.pixelStorei(G.UNPACK_SKIP_IMAGES,et);const di=A.isDataArrayTexture||A.isData3DTexture,_e=W.isDataArrayTexture||W.isData3DTexture;if(A.isRenderTargetTexture||A.isDepthTexture){const un=Pt.get(A),jn=Pt.get(W),Ye=Pt.get(un.__renderTarget),Rn=Pt.get(jn.__renderTarget);zt.bindFramebuffer(G.READ_FRAMEBUFFER,Ye.__webglFramebuffer),zt.bindFramebuffer(G.DRAW_FRAMEBUFFER,Rn.__webglFramebuffer);for(let Cn=0;Cn<xt;Cn++)di&&G.framebufferTextureLayer(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,Pt.get(A).__webglTexture,U,et+Cn),A.isDepthTexture?(_e&&G.framebufferTextureLayer(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,Pt.get(W).__webglTexture,U,Zt+Cn),G.blitFramebuffer(At,st,rt,ft,gt,Wt,rt,ft,G.DEPTH_BUFFER_BIT,G.NEAREST)):_e?G.copyTexSubImage3D(Vt,U,gt,Wt,Zt+Cn,At,st,rt,ft):G.copyTexSubImage2D(Vt,U,gt,Wt,Zt+Cn,At,st,rt,ft);zt.bindFramebuffer(G.READ_FRAMEBUFFER,null),zt.bindFramebuffer(G.DRAW_FRAMEBUFFER,null)}else _e?A.isDataTexture||A.isData3DTexture?G.texSubImage3D(Vt,U,gt,Wt,Zt,rt,ft,xt,ge,te,ae.data):W.isCompressedArrayTexture?G.compressedTexSubImage3D(Vt,U,gt,Wt,Zt,rt,ft,xt,ge,ae.data):G.texSubImage3D(Vt,U,gt,Wt,Zt,rt,ft,xt,ge,te,ae):A.isDataTexture?G.texSubImage2D(G.TEXTURE_2D,U,gt,Wt,rt,ft,ge,te,ae.data):A.isCompressedTexture?G.compressedTexSubImage2D(G.TEXTURE_2D,U,gt,Wt,ae.width,ae.height,ge,ae.data):G.texSubImage2D(G.TEXTURE_2D,U,gt,Wt,rt,ft,ge,te,ae);G.pixelStorei(G.UNPACK_ROW_LENGTH,Pe),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,re),G.pixelStorei(G.UNPACK_SKIP_PIXELS,Ee),G.pixelStorei(G.UNPACK_SKIP_ROWS,vn),G.pixelStorei(G.UNPACK_SKIP_IMAGES,Ve),U===0&&W.generateMipmaps&&G.generateMipmap(Vt),zt.unbindTexture()},this.copyTextureToTexture3D=function(A,W,k=null,O=null,U=0){return A.isTexture!==!0&&(Bs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),k=arguments[0]||null,O=arguments[1]||null,A=arguments[2],W=arguments[3],U=arguments[4]||0),Bs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(A,W,k,O,U)},this.initRenderTarget=function(A){Pt.get(A).__webglFramebuffer===void 0&&L.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?L.setTextureCube(A,0):A.isData3DTexture?L.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?L.setTexture2DArray(A,0):L.setTexture2D(A,0),zt.unbindTexture()},this.resetState=function(){S=0,w=0,T=null,zt.reset(),Gt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Yn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=he._getDrawingBufferColorSpace(t),e.unpackColorSpace=he._getUnpackColorSpace()}}class EM extends De{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Nn,this.environmentIntensity=1,this.environmentRotation=new Nn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class wM{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Cc,this.updateRanges=[],this.version=0,this.uuid=Fn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let s=0,a=this.stride;s<a;s++)this.array[t+s]=e.array[i+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Fn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Fn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ze=new V;class po{constructor(t,e,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)Ze.fromBufferAttribute(this,e),Ze.applyMatrix4(t),this.setXYZ(e,Ze.x,Ze.y,Ze.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Ze.fromBufferAttribute(this,e),Ze.applyNormalMatrix(t),this.setXYZ(e,Ze.x,Ze.y,Ze.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Ze.fromBufferAttribute(this,e),Ze.transformDirection(t),this.setXYZ(e,Ze.x,Ze.y,Ze.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=En(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=me(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=me(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=me(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=me(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=me(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=En(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=En(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=En(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=En(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=me(e,this.array),i=me(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=me(e,this.array),i=me(i,this.array),s=me(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this}setXYZW(t,e,i,s,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=me(e,this.array),i=me(i,this.array),s=me(s,this.array),a=me(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this.data.array[t+3]=a,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return new Qe(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new po(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Dc extends Fi{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new qt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let ns;const Fs=new V,is=new V,ss=new V,as=new Bt,Ns=new Bt,Tu=new Se,Fa=new V,zs=new V,Na=new V,id=new Bt,Mr=new Bt,sd=new Bt;class ad extends De{constructor(t=new Dc){if(super(),this.isSprite=!0,this.type="Sprite",ns===void 0){ns=new Ne;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new wM(e,5);ns.setIndex([0,1,2,0,2,3]),ns.setAttribute("position",new po(i,3,0,!1)),ns.setAttribute("uv",new po(i,2,3,!1))}this.geometry=ns,this.material=t,this.center=new Bt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),is.setFromMatrixScale(this.matrixWorld),Tu.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),ss.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&is.multiplyScalar(-ss.z);const i=this.material.rotation;let s,a;i!==0&&(a=Math.cos(i),s=Math.sin(i));const o=this.center;za(Fa.set(-.5,-.5,0),ss,o,is,s,a),za(zs.set(.5,-.5,0),ss,o,is,s,a),za(Na.set(.5,.5,0),ss,o,is,s,a),id.set(0,0),Mr.set(1,0),sd.set(1,1);let r=t.ray.intersectTriangle(Fa,zs,Na,!1,Fs);if(r===null&&(za(zs.set(-.5,.5,0),ss,o,is,s,a),Mr.set(0,1),r=t.ray.intersectTriangle(Fa,Na,zs,!1,Fs),r===null))return;const l=t.ray.origin.distanceTo(Fs);l<t.near||l>t.far||e.push({distance:l,point:Fs.clone(),uv:hn.getInterpolation(Fs,Fa,zs,Na,id,Mr,sd,new Bt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function za(n,t,e,i,s,a){as.subVectors(n,e).addScalar(.5).multiply(i),s!==void 0?(Ns.x=a*as.x-s*as.y,Ns.y=s*as.x+a*as.y):Ns.copy(as),n.copy(t),n.x+=Ns.x,n.y+=Ns.y,n.applyMatrix4(Tu)}class ol extends Fi{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new qt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const mo=new V,go=new V,od=new Se,Os=new nl,Oa=new Eo,Sr=new V,rd=new V;class TM extends De{constructor(t=new Ne,e=new ol){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let s=1,a=e.count;s<a;s++)mo.fromBufferAttribute(e,s-1),go.fromBufferAttribute(e,s),i[s]=i[s-1],i[s]+=mo.distanceTo(go);t.setAttribute("lineDistance",new pe(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,s=this.matrixWorld,a=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Oa.copy(i.boundingSphere),Oa.applyMatrix4(s),Oa.radius+=a,t.ray.intersectsSphere(Oa)===!1)return;od.copy(s).invert(),Os.copy(t.ray).applyMatrix4(od);const r=a/((this.scale.x+this.scale.y+this.scale.z)/3),l=r*r,c=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const u=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let _=u,g=p-1;_<g;_+=c){const m=h.getX(_),x=h.getX(_+1),y=Ba(this,t,Os,l,m,x);y&&e.push(y)}if(this.isLineLoop){const _=h.getX(p-1),g=h.getX(u),m=Ba(this,t,Os,l,_,g);m&&e.push(m)}}else{const u=Math.max(0,o.start),p=Math.min(d.count,o.start+o.count);for(let _=u,g=p-1;_<g;_+=c){const m=Ba(this,t,Os,l,_,_+1);m&&e.push(m)}if(this.isLineLoop){const _=Ba(this,t,Os,l,p-1,u);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,o=s.length;a<o;a++){const r=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=a}}}}}function Ba(n,t,e,i,s,a){const o=n.geometry.attributes.position;if(mo.fromBufferAttribute(o,s),go.fromBufferAttribute(o,a),e.distanceSqToSegment(mo,go,Sr,rd)>i)return;Sr.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(Sr);if(!(l<t.near||l>t.far))return{distance:l,point:rd.clone().applyMatrix4(n.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:n}}const cd=new V,ld=new V;class Au extends TM{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let s=0,a=e.count;s<a;s+=2)cd.fromBufferAttribute(e,s),ld.fromBufferAttribute(e,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+cd.distanceTo(ld);t.setAttribute("lineDistance",new pe(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Lc extends Je{constructor(t,e,i,s,a,o,r,l,c){super(t,e,i,s,a,o,r,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class zn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,s=this.getPoint(0),a=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),a+=i.distanceTo(s),e.push(a),s=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let s=0;const a=i.length;let o;e?o=e:o=t*i[a-1];let r=0,l=a-1,c;for(;r<=l;)if(s=Math.floor(r+(l-r)/2),c=i[s]-o,c<0)r=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,i[s]===o)return s/(a-1);const h=i[s],d=i[s+1]-h,u=(o-h)/d;return(s+u)/(a-1)}getTangent(t,e){let s=t-1e-4,a=t+1e-4;s<0&&(s=0),a>1&&(a=1);const o=this.getPoint(s),r=this.getPoint(a),l=e||(o.isVector2?new Bt:new V);return l.copy(r).sub(o).normalize(),l}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new V,s=[],a=[],o=[],r=new V,l=new Se;for(let u=0;u<=t;u++){const p=u/t;s[u]=this.getTangentAt(p,new V)}a[0]=new V,o[0]=new V;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),f=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,i.set(1,0,0)),f<=c&&(c=f,i.set(0,1,0)),d<=c&&i.set(0,0,1),r.crossVectors(s[0],i).normalize(),a[0].crossVectors(s[0],r),o[0].crossVectors(s[0],a[0]);for(let u=1;u<=t;u++){if(a[u]=a[u-1].clone(),o[u]=o[u-1].clone(),r.crossVectors(s[u-1],s[u]),r.length()>Number.EPSILON){r.normalize();const p=Math.acos(Xe(s[u-1].dot(s[u]),-1,1));a[u].applyMatrix4(l.makeRotationAxis(r,p))}o[u].crossVectors(s[u],a[u])}if(e===!0){let u=Math.acos(Xe(a[0].dot(a[t]),-1,1));u/=t,s[0].dot(r.crossVectors(a[0],a[t]))>0&&(u=-u);for(let p=1;p<=t;p++)a[p].applyMatrix4(l.makeRotationAxis(s[p],u*p)),o[p].crossVectors(s[p],a[p])}return{tangents:s,normals:a,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class rl extends zn{constructor(t=0,e=0,i=1,s=1,a=0,o=Math.PI*2,r=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=s,this.aStartAngle=a,this.aEndAngle=o,this.aClockwise=r,this.aRotation=l}getPoint(t,e=new Bt){const i=e,s=Math.PI*2;let a=this.aEndAngle-this.aStartAngle;const o=Math.abs(a)<Number.EPSILON;for(;a<0;)a+=s;for(;a>s;)a-=s;a<Number.EPSILON&&(o?a=0:a=s),this.aClockwise===!0&&!o&&(a===s?a=-s:a=a-s);const r=this.aStartAngle+t*a;let l=this.aX+this.xRadius*Math.cos(r),c=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),d=l-this.aX,u=c-this.aY;l=d*h-u*f+this.aX,c=d*f+u*h+this.aY}return i.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class AM extends rl{constructor(t,e,i,s,a,o){super(t,e,i,i,s,a,o),this.isArcCurve=!0,this.type="ArcCurve"}}function cl(){let n=0,t=0,e=0,i=0;function s(a,o,r,l){n=a,t=r,e=-3*a+3*o-2*r-l,i=2*a-2*o+r+l}return{initCatmullRom:function(a,o,r,l,c){s(o,r,c*(r-a),c*(l-o))},initNonuniformCatmullRom:function(a,o,r,l,c,h,f){let d=(o-a)/c-(r-a)/(c+h)+(r-o)/h,u=(r-o)/h-(l-o)/(h+f)+(l-r)/f;d*=h,u*=h,s(o,r,d,u)},calc:function(a){const o=a*a,r=o*a;return n+t*a+e*o+i*r}}}const Ha=new V,br=new cl,Er=new cl,wr=new cl;class RM extends zn{constructor(t=[],e=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=s}getPoint(t,e=new V){const i=e,s=this.points,a=s.length,o=(a-(this.closed?0:1))*t;let r=Math.floor(o),l=o-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/a)+1)*a:l===0&&r===a-1&&(r=a-2,l=1);let c,h;this.closed||r>0?c=s[(r-1)%a]:(Ha.subVectors(s[0],s[1]).add(s[0]),c=Ha);const f=s[r%a],d=s[(r+1)%a];if(this.closed||r+2<a?h=s[(r+2)%a]:(Ha.subVectors(s[a-1],s[a-2]).add(s[a-1]),h=Ha),this.curveType==="centripetal"||this.curveType==="chordal"){const u=this.curveType==="chordal"?.5:.25;let p=Math.pow(c.distanceToSquared(f),u),_=Math.pow(f.distanceToSquared(d),u),g=Math.pow(d.distanceToSquared(h),u);_<1e-4&&(_=1),p<1e-4&&(p=_),g<1e-4&&(g=_),br.initNonuniformCatmullRom(c.x,f.x,d.x,h.x,p,_,g),Er.initNonuniformCatmullRom(c.y,f.y,d.y,h.y,p,_,g),wr.initNonuniformCatmullRom(c.z,f.z,d.z,h.z,p,_,g)}else this.curveType==="catmullrom"&&(br.initCatmullRom(c.x,f.x,d.x,h.x,this.tension),Er.initCatmullRom(c.y,f.y,d.y,h.y,this.tension),wr.initCatmullRom(c.z,f.z,d.z,h.z,this.tension));return i.set(br.calc(l),Er.calc(l),wr.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new V().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function hd(n,t,e,i,s){const a=(i-t)*.5,o=(s-e)*.5,r=n*n,l=n*r;return(2*e-2*i+a+o)*l+(-3*e+3*i-2*a-o)*r+a*n+e}function CM(n,t){const e=1-n;return e*e*t}function PM(n,t){return 2*(1-n)*n*t}function DM(n,t){return n*n*t}function Xs(n,t,e,i){return CM(n,t)+PM(n,e)+DM(n,i)}function LM(n,t){const e=1-n;return e*e*e*t}function IM(n,t){const e=1-n;return 3*e*e*n*t}function kM(n,t){return 3*(1-n)*n*n*t}function UM(n,t){return n*n*n*t}function Ws(n,t,e,i,s){return LM(n,t)+IM(n,e)+kM(n,i)+UM(n,s)}class Ru extends zn{constructor(t=new Bt,e=new Bt,i=new Bt,s=new Bt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new Bt){const i=e,s=this.v0,a=this.v1,o=this.v2,r=this.v3;return i.set(Ws(t,s.x,a.x,o.x,r.x),Ws(t,s.y,a.y,o.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class FM extends zn{constructor(t=new V,e=new V,i=new V,s=new V){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new V){const i=e,s=this.v0,a=this.v1,o=this.v2,r=this.v3;return i.set(Ws(t,s.x,a.x,o.x,r.x),Ws(t,s.y,a.y,o.y,r.y),Ws(t,s.z,a.z,o.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Cu extends zn{constructor(t=new Bt,e=new Bt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Bt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Bt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class NM extends zn{constructor(t=new V,e=new V){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new V){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new V){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Pu extends zn{constructor(t=new Bt,e=new Bt,i=new Bt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Bt){const i=e,s=this.v0,a=this.v1,o=this.v2;return i.set(Xs(t,s.x,a.x,o.x),Xs(t,s.y,a.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class zM extends zn{constructor(t=new V,e=new V,i=new V){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new V){const i=e,s=this.v0,a=this.v1,o=this.v2;return i.set(Xs(t,s.x,a.x,o.x),Xs(t,s.y,a.y,o.y),Xs(t,s.z,a.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Du extends zn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Bt){const i=e,s=this.points,a=(s.length-1)*t,o=Math.floor(a),r=a-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],f=s[o>s.length-3?s.length-1:o+2];return i.set(hd(r,l.x,c.x,h.x,f.x),hd(r,l.y,c.y,h.y,f.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new Bt().fromArray(s))}return this}}var dd=Object.freeze({__proto__:null,ArcCurve:AM,CatmullRomCurve3:RM,CubicBezierCurve:Ru,CubicBezierCurve3:FM,EllipseCurve:rl,LineCurve:Cu,LineCurve3:NM,QuadraticBezierCurve:Pu,QuadraticBezierCurve3:zM,SplineCurve:Du});class OM extends zn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new dd[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),s=this.getCurveLengths();let a=0;for(;a<s.length;){if(s[a]>=i){const o=s[a]-i,r=this.curves[a],l=r.getLength(),c=l===0?0:1-o/l;return r.getPointAt(c,e)}a++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,s=this.curves.length;i<s;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let s=0,a=this.curves;s<a.length;s++){const o=a[s],r=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(r);for(let c=0;c<l.length;c++){const h=l[c];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(new dd[s.type]().fromJSON(s))}return this}}class ud extends OM{constructor(t){super(),this.type="Path",this.currentPoint=new Bt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new Cu(this.currentPoint.clone(),new Bt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,s){const a=new Pu(this.currentPoint.clone(),new Bt(t,e),new Bt(i,s));return this.curves.push(a),this.currentPoint.set(i,s),this}bezierCurveTo(t,e,i,s,a,o){const r=new Ru(this.currentPoint.clone(),new Bt(t,e),new Bt(i,s),new Bt(a,o));return this.curves.push(r),this.currentPoint.set(a,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new Du(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,s,a,o){const r=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+r,e+l,i,s,a,o),this}absarc(t,e,i,s,a,o){return this.absellipse(t,e,i,i,s,a,o),this}ellipse(t,e,i,s,a,o,r,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,i,s,a,o,r,l),this}absellipse(t,e,i,s,a,o,r,l){const c=new rl(t,e,i,s,a,o,r,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class ll extends Ne{constructor(t=1,e=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:s},e=Math.max(3,e);const a=[],o=[],r=[],l=[],c=new V,h=new Bt;o.push(0,0,0),r.push(0,0,1),l.push(.5,.5);for(let f=0,d=3;f<=e;f++,d+=3){const u=i+f/e*s;c.x=t*Math.cos(u),c.y=t*Math.sin(u),o.push(c.x,c.y,c.z),r.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let f=1;f<=e;f++)a.push(f,f+1,0);this.setIndex(a),this.setAttribute("position",new pe(o,3)),this.setAttribute("normal",new pe(r,3)),this.setAttribute("uv",new pe(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ll(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Qs extends Ne{constructor(t=1,e=1,i=1,s=32,a=1,o=!1,r=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:a,openEnded:o,thetaStart:r,thetaLength:l};const c=this;s=Math.floor(s),a=Math.floor(a);const h=[],f=[],d=[],u=[];let p=0;const _=[],g=i/2;let m=0;x(),o===!1&&(t>0&&y(!0),e>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new pe(f,3)),this.setAttribute("normal",new pe(d,3)),this.setAttribute("uv",new pe(u,2));function x(){const v=new V,P=new V;let S=0;const w=(e-t)/i;for(let T=0;T<=a;T++){const b=[],M=T/a,R=M*(e-t)+t;for(let F=0;F<=s;F++){const I=F/s,z=I*l+r,C=Math.sin(z),D=Math.cos(z);P.x=R*C,P.y=-M*i+g,P.z=R*D,f.push(P.x,P.y,P.z),v.set(C,w,D).normalize(),d.push(v.x,v.y,v.z),u.push(I,1-M),b.push(p++)}_.push(b)}for(let T=0;T<s;T++)for(let b=0;b<a;b++){const M=_[b][T],R=_[b+1][T],F=_[b+1][T+1],I=_[b][T+1];(t>0||b!==0)&&(h.push(M,R,I),S+=3),(e>0||b!==a-1)&&(h.push(R,F,I),S+=3)}c.addGroup(m,S,0),m+=S}function y(v){const P=p,S=new Bt,w=new V;let T=0;const b=v===!0?t:e,M=v===!0?1:-1;for(let F=1;F<=s;F++)f.push(0,g*M,0),d.push(0,M,0),u.push(.5,.5),p++;const R=p;for(let F=0;F<=s;F++){const z=F/s*l+r,C=Math.cos(z),D=Math.sin(z);w.x=b*D,w.y=g*M,w.z=b*C,f.push(w.x,w.y,w.z),d.push(0,M,0),S.x=C*.5+.5,S.y=D*.5*M+.5,u.push(S.x,S.y),p++}for(let F=0;F<s;F++){const I=P+F,z=R+F;v===!0?h.push(z,z+1,I):h.push(z+1,z,I),T+=3}c.addGroup(m,T,v===!0?1:2),m+=T}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Qs(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class hl extends Qs{constructor(t=1,e=1,i=32,s=1,a=!1,o=0,r=Math.PI*2){super(0,t,e,i,s,a,o,r),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:r}}static fromJSON(t){return new hl(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class dl extends Ne{constructor(t=[],e=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:s};const a=[],o=[];r(s),c(i),h(),this.setAttribute("position",new pe(a,3)),this.setAttribute("normal",new pe(a.slice(),3)),this.setAttribute("uv",new pe(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function r(x){const y=new V,v=new V,P=new V;for(let S=0;S<e.length;S+=3)u(e[S+0],y),u(e[S+1],v),u(e[S+2],P),l(y,v,P,x)}function l(x,y,v,P){const S=P+1,w=[];for(let T=0;T<=S;T++){w[T]=[];const b=x.clone().lerp(v,T/S),M=y.clone().lerp(v,T/S),R=S-T;for(let F=0;F<=R;F++)F===0&&T===S?w[T][F]=b:w[T][F]=b.clone().lerp(M,F/R)}for(let T=0;T<S;T++)for(let b=0;b<2*(S-T)-1;b++){const M=Math.floor(b/2);b%2===0?(d(w[T][M+1]),d(w[T+1][M]),d(w[T][M])):(d(w[T][M+1]),d(w[T+1][M+1]),d(w[T+1][M]))}}function c(x){const y=new V;for(let v=0;v<a.length;v+=3)y.x=a[v+0],y.y=a[v+1],y.z=a[v+2],y.normalize().multiplyScalar(x),a[v+0]=y.x,a[v+1]=y.y,a[v+2]=y.z}function h(){const x=new V;for(let y=0;y<a.length;y+=3){x.x=a[y+0],x.y=a[y+1],x.z=a[y+2];const v=g(x)/2/Math.PI+.5,P=m(x)/Math.PI+.5;o.push(v,1-P)}p(),f()}function f(){for(let x=0;x<o.length;x+=6){const y=o[x+0],v=o[x+2],P=o[x+4],S=Math.max(y,v,P),w=Math.min(y,v,P);S>.9&&w<.1&&(y<.2&&(o[x+0]+=1),v<.2&&(o[x+2]+=1),P<.2&&(o[x+4]+=1))}}function d(x){a.push(x.x,x.y,x.z)}function u(x,y){const v=x*3;y.x=t[v+0],y.y=t[v+1],y.z=t[v+2]}function p(){const x=new V,y=new V,v=new V,P=new V,S=new Bt,w=new Bt,T=new Bt;for(let b=0,M=0;b<a.length;b+=9,M+=6){x.set(a[b+0],a[b+1],a[b+2]),y.set(a[b+3],a[b+4],a[b+5]),v.set(a[b+6],a[b+7],a[b+8]),S.set(o[M+0],o[M+1]),w.set(o[M+2],o[M+3]),T.set(o[M+4],o[M+5]),P.copy(x).add(y).add(v).divideScalar(3);const R=g(P);_(S,M+0,x,R),_(w,M+2,y,R),_(T,M+4,v,R)}}function _(x,y,v,P){P<0&&x.x===1&&(o[y]=x.x-1),v.x===0&&v.z===0&&(o[y]=P/2/Math.PI+.5)}function g(x){return Math.atan2(x.z,-x.x)}function m(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new dl(t.vertices,t.indices,t.radius,t.details)}}const Ga=new V,Va=new V,Tr=new V,Xa=new hn;class BM extends Ne{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const s=Math.pow(10,4),a=Math.cos(ps*e),o=t.getIndex(),r=t.getAttribute("position"),l=o?o.count:r.count,c=[0,0,0],h=["a","b","c"],f=new Array(3),d={},u=[];for(let p=0;p<l;p+=3){o?(c[0]=o.getX(p),c[1]=o.getX(p+1),c[2]=o.getX(p+2)):(c[0]=p,c[1]=p+1,c[2]=p+2);const{a:_,b:g,c:m}=Xa;if(_.fromBufferAttribute(r,c[0]),g.fromBufferAttribute(r,c[1]),m.fromBufferAttribute(r,c[2]),Xa.getNormal(Tr),f[0]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,f[1]=`${Math.round(g.x*s)},${Math.round(g.y*s)},${Math.round(g.z*s)}`,f[2]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let x=0;x<3;x++){const y=(x+1)%3,v=f[x],P=f[y],S=Xa[h[x]],w=Xa[h[y]],T=`${v}_${P}`,b=`${P}_${v}`;b in d&&d[b]?(Tr.dot(d[b].normal)<=a&&(u.push(S.x,S.y,S.z),u.push(w.x,w.y,w.z)),d[b]=null):T in d||(d[T]={index0:c[x],index1:c[y],normal:Tr.clone()})}}for(const p in d)if(d[p]){const{index0:_,index1:g}=d[p];Ga.fromBufferAttribute(r,_),Va.fromBufferAttribute(r,g),u.push(Ga.x,Ga.y,Ga.z),u.push(Va.x,Va.y,Va.z)}this.setAttribute("position",new pe(u,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class Lu extends ud{constructor(t){super(t),this.uuid=Fn(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,s=this.holes.length;i<s;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(new ud().fromJSON(s))}return this}}const HM={triangulate:function(n,t,e=2){const i=t&&t.length,s=i?t[0]*e:n.length;let a=Iu(n,0,s,e,!0);const o=[];if(!a||a.next===a.prev)return o;let r,l,c,h,f,d,u;if(i&&(a=$M(n,t,a,e)),n.length>80*e){r=c=n[0],l=h=n[1];for(let p=e;p<s;p+=e)f=n[p],d=n[p+1],f<r&&(r=f),d<l&&(l=d),f>c&&(c=f),d>h&&(h=d);u=Math.max(c-r,h-l),u=u!==0?32767/u:0}return ta(a,o,e,r,l,u,0),o}};function Iu(n,t,e,i,s){let a,o;if(s===iS(n,t,e,i)>0)for(a=t;a<e;a+=i)o=fd(a,n[a],n[a+1],o);else for(a=e-i;a>=t;a-=i)o=fd(a,n[a],n[a+1],o);return o&&To(o,o.next)&&(na(o),o=o.next),o}function Ui(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(To(e,e.next)||Te(e.prev,e,e.next)===0)){if(na(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function ta(n,t,e,i,s,a,o){if(!n)return;!o&&a&&KM(n,i,s,a);let r=n,l,c;for(;n.prev!==n.next;){if(l=n.prev,c=n.next,a?VM(n,i,s,a):GM(n)){t.push(l.i/e|0),t.push(n.i/e|0),t.push(c.i/e|0),na(n),n=c.next,r=c.next;continue}if(n=c,n===r){o?o===1?(n=XM(Ui(n),t,e),ta(n,t,e,i,s,a,2)):o===2&&WM(n,t,e,i,s,a):ta(Ui(n),t,e,i,s,a,1);break}}}function GM(n){const t=n.prev,e=n,i=n.next;if(Te(t,e,i)>=0)return!1;const s=t.x,a=e.x,o=i.x,r=t.y,l=e.y,c=i.y,h=s<a?s<o?s:o:a<o?a:o,f=r<l?r<c?r:c:l<c?l:c,d=s>a?s>o?s:o:a>o?a:o,u=r>l?r>c?r:c:l>c?l:c;let p=i.next;for(;p!==t;){if(p.x>=h&&p.x<=d&&p.y>=f&&p.y<=u&&hs(s,r,a,l,o,c,p.x,p.y)&&Te(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function VM(n,t,e,i){const s=n.prev,a=n,o=n.next;if(Te(s,a,o)>=0)return!1;const r=s.x,l=a.x,c=o.x,h=s.y,f=a.y,d=o.y,u=r<l?r<c?r:c:l<c?l:c,p=h<f?h<d?h:d:f<d?f:d,_=r>l?r>c?r:c:l>c?l:c,g=h>f?h>d?h:d:f>d?f:d,m=Ic(u,p,t,e,i),x=Ic(_,g,t,e,i);let y=n.prevZ,v=n.nextZ;for(;y&&y.z>=m&&v&&v.z<=x;){if(y.x>=u&&y.x<=_&&y.y>=p&&y.y<=g&&y!==s&&y!==o&&hs(r,h,l,f,c,d,y.x,y.y)&&Te(y.prev,y,y.next)>=0||(y=y.prevZ,v.x>=u&&v.x<=_&&v.y>=p&&v.y<=g&&v!==s&&v!==o&&hs(r,h,l,f,c,d,v.x,v.y)&&Te(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;y&&y.z>=m;){if(y.x>=u&&y.x<=_&&y.y>=p&&y.y<=g&&y!==s&&y!==o&&hs(r,h,l,f,c,d,y.x,y.y)&&Te(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;v&&v.z<=x;){if(v.x>=u&&v.x<=_&&v.y>=p&&v.y<=g&&v!==s&&v!==o&&hs(r,h,l,f,c,d,v.x,v.y)&&Te(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function XM(n,t,e){let i=n;do{const s=i.prev,a=i.next.next;!To(s,a)&&ku(s,i,i.next,a)&&ea(s,a)&&ea(a,s)&&(t.push(s.i/e|0),t.push(i.i/e|0),t.push(a.i/e|0),na(i),na(i.next),i=n=a),i=i.next}while(i!==n);return Ui(i)}function WM(n,t,e,i,s,a){let o=n;do{let r=o.next.next;for(;r!==o.prev;){if(o.i!==r.i&&tS(o,r)){let l=Uu(o,r);o=Ui(o,o.next),l=Ui(l,l.next),ta(o,t,e,i,s,a,0),ta(l,t,e,i,s,a,0);return}r=r.next}o=o.next}while(o!==n)}function $M(n,t,e,i){const s=[];let a,o,r,l,c;for(a=0,o=t.length;a<o;a++)r=t[a]*i,l=a<o-1?t[a+1]*i:n.length,c=Iu(n,r,l,i,!1),c===c.next&&(c.steiner=!0),s.push(QM(c));for(s.sort(YM),a=0;a<s.length;a++)e=ZM(s[a],e);return e}function YM(n,t){return n.x-t.x}function ZM(n,t){const e=qM(n,t);if(!e)return t;const i=Uu(e,n);return Ui(i,i.next),Ui(e,e.next)}function qM(n,t){let e=t,i=-1/0,s;const a=n.x,o=n.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=a&&d>i&&(i=d,s=e.x<e.next.x?e:e.next,d===a))return s}e=e.next}while(e!==t);if(!s)return null;const r=s,l=s.x,c=s.y;let h=1/0,f;e=s;do a>=e.x&&e.x>=l&&a!==e.x&&hs(o<c?a:i,o,l,c,o<c?i:a,o,e.x,e.y)&&(f=Math.abs(o-e.y)/(a-e.x),ea(e,n)&&(f<h||f===h&&(e.x>s.x||e.x===s.x&&jM(s,e)))&&(s=e,h=f)),e=e.next;while(e!==r);return s}function jM(n,t){return Te(n.prev,n,t.prev)<0&&Te(t.next,n,n.next)<0}function KM(n,t,e,i){let s=n;do s.z===0&&(s.z=Ic(s.x,s.y,t,e,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,JM(s)}function JM(n){let t,e,i,s,a,o,r,l,c=1;do{for(e=n,n=null,a=null,o=0;e;){for(o++,i=e,r=0,t=0;t<c&&(r++,i=i.nextZ,!!i);t++);for(l=c;r>0||l>0&&i;)r!==0&&(l===0||!i||e.z<=i.z)?(s=e,e=e.nextZ,r--):(s=i,i=i.nextZ,l--),a?a.nextZ=s:n=s,s.prevZ=a,a=s;e=i}a.nextZ=null,c*=2}while(o>1);return n}function Ic(n,t,e,i,s){return n=(n-e)*s|0,t=(t-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function QM(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function hs(n,t,e,i,s,a,o,r){return(s-o)*(t-r)>=(n-o)*(a-r)&&(n-o)*(i-r)>=(e-o)*(t-r)&&(e-o)*(a-r)>=(s-o)*(i-r)}function tS(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!eS(n,t)&&(ea(n,t)&&ea(t,n)&&nS(n,t)&&(Te(n.prev,n,t.prev)||Te(n,t.prev,t))||To(n,t)&&Te(n.prev,n,n.next)>0&&Te(t.prev,t,t.next)>0)}function Te(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function To(n,t){return n.x===t.x&&n.y===t.y}function ku(n,t,e,i){const s=$a(Te(n,t,e)),a=$a(Te(n,t,i)),o=$a(Te(e,i,n)),r=$a(Te(e,i,t));return!!(s!==a&&o!==r||s===0&&Wa(n,e,t)||a===0&&Wa(n,i,t)||o===0&&Wa(e,n,i)||r===0&&Wa(e,t,i))}function Wa(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function $a(n){return n>0?1:n<0?-1:0}function eS(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&ku(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function ea(n,t){return Te(n.prev,n,n.next)<0?Te(n,t,n.next)>=0&&Te(n,n.prev,t)>=0:Te(n,t,n.prev)<0||Te(n,n.next,t)<0}function nS(n,t){let e=n,i=!1;const s=(n.x+t.x)/2,a=(n.y+t.y)/2;do e.y>a!=e.next.y>a&&e.next.y!==e.y&&s<(e.next.x-e.x)*(a-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function Uu(n,t){const e=new kc(n.i,n.x,n.y),i=new kc(t.i,t.x,t.y),s=n.next,a=t.prev;return n.next=t,t.prev=n,e.next=s,s.prev=e,i.next=e,e.prev=i,a.next=i,i.prev=a,i}function fd(n,t,e,i){const s=new kc(n,t,e);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function na(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function kc(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function iS(n,t,e,i){let s=0;for(let a=t,o=e-i;a<e;a+=i)s+=(n[o]-n[a])*(n[a+1]+n[o+1]),o=a;return s}class $s{static area(t){const e=t.length;let i=0;for(let s=e-1,a=0;a<e;s=a++)i+=t[s].x*t[a].y-t[a].x*t[s].y;return i*.5}static isClockWise(t){return $s.area(t)<0}static triangulateShape(t,e){const i=[],s=[],a=[];pd(t),md(i,t);let o=t.length;e.forEach(pd);for(let l=0;l<e.length;l++)s.push(o),o+=e[l].length,md(i,e[l]);const r=HM.triangulate(i,s);for(let l=0;l<r.length;l+=3)a.push(r.slice(l,l+3));return a}}function pd(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function md(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class ul extends dl{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ul(t.radius,t.detail)}}class ia extends Ne{constructor(t=.5,e=1,i=32,s=1,a=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:s,thetaStart:a,thetaLength:o},i=Math.max(3,i),s=Math.max(1,s);const r=[],l=[],c=[],h=[];let f=t;const d=(e-t)/s,u=new V,p=new Bt;for(let _=0;_<=s;_++){for(let g=0;g<=i;g++){const m=a+g/i*o;u.x=f*Math.cos(m),u.y=f*Math.sin(m),l.push(u.x,u.y,u.z),c.push(0,0,1),p.x=(u.x/e+1)/2,p.y=(u.y/e+1)/2,h.push(p.x,p.y)}f+=d}for(let _=0;_<s;_++){const g=_*(i+1);for(let m=0;m<i;m++){const x=m+g,y=x,v=x+i+1,P=x+i+2,S=x+1;r.push(y,v,S),r.push(v,P,S)}}this.setIndex(r),this.setAttribute("position",new pe(l,3)),this.setAttribute("normal",new pe(c,3)),this.setAttribute("uv",new pe(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ia(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class fl extends Ne{constructor(t=new Lu([new Bt(0,.5),new Bt(-.5,-.5),new Bt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],s=[],a=[],o=[];let r=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(r,l,h),r+=l,l=0;this.setIndex(i),this.setAttribute("position",new pe(s,3)),this.setAttribute("normal",new pe(a,3)),this.setAttribute("uv",new pe(o,2));function c(h){const f=s.length/3,d=h.extractPoints(e);let u=d.shape;const p=d.holes;$s.isClockWise(u)===!1&&(u=u.reverse());for(let g=0,m=p.length;g<m;g++){const x=p[g];$s.isClockWise(x)===!0&&(p[g]=x.reverse())}const _=$s.triangulateShape(u,p);for(let g=0,m=p.length;g<m;g++){const x=p[g];u=u.concat(x)}for(let g=0,m=u.length;g<m;g++){const x=u[g];s.push(x.x,x.y,0),a.push(0,0,1),o.push(x.x,x.y)}for(let g=0,m=_.length;g<m;g++){const x=_[g],y=x[0]+f,v=x[1]+f,P=x[2]+f;i.push(y,v,P),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return sS(e,t)}static fromJSON(t,e){const i=[];for(let s=0,a=t.shapes.length;s<a;s++){const o=e[t.shapes[s]];i.push(o)}return new fl(i,t.curveSegments)}}function sS(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const s=n[e];t.shapes.push(s.uuid)}else t.shapes.push(n.uuid);return t}class Ao extends Ne{constructor(t=1,e=.4,i=12,s=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:a},i=Math.floor(i),s=Math.floor(s);const o=[],r=[],l=[],c=[],h=new V,f=new V,d=new V;for(let u=0;u<=i;u++)for(let p=0;p<=s;p++){const _=p/s*a,g=u/i*Math.PI*2;f.x=(t+e*Math.cos(g))*Math.cos(_),f.y=(t+e*Math.cos(g))*Math.sin(_),f.z=e*Math.sin(g),r.push(f.x,f.y,f.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),d.subVectors(f,h).normalize(),l.push(d.x,d.y,d.z),c.push(p/s),c.push(u/i)}for(let u=1;u<=i;u++)for(let p=1;p<=s;p++){const _=(s+1)*u+p-1,g=(s+1)*(u-1)+p-1,m=(s+1)*(u-1)+p,x=(s+1)*u+p;o.push(_,g,x),o.push(g,m,x)}this.setIndex(o),this.setAttribute("position",new pe(r,3)),this.setAttribute("normal",new pe(l,3)),this.setAttribute("uv",new pe(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ao(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class sa extends Fi{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=cu,this.normalScale=new Bt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Nn,this.combine=Zc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Fu extends De{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new qt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class aS extends Fu{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(De.DEFAULT_UP),this.updateMatrix(),this.groundColor=new qt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Ar=new Se,gd=new V,xd=new V;class oS{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Bt(512,512),this.map=null,this.mapPass=null,this.matrix=new Se,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new sl,this._frameExtents=new Bt(1,1),this._viewportCount=1,this._viewports=[new Ce(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;gd.setFromMatrixPosition(t.matrixWorld),e.position.copy(gd),xd.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(xd),e.updateMatrixWorld(),Ar.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ar),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Ar)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class rS extends oS{constructor(){super(new yu(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class cS extends Fu{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(De.DEFAULT_UP),this.updateMatrix(),this.target=new De,this.shadow=new rS}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const vd=new Se;class lS{constructor(t,e,i=0,s=1/0){this.ray=new nl(t,e),this.near=i,this.far=s,this.camera=null,this.layers=new il,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return vd.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(vd),this}intersectObject(t,e=!0,i=[]){return Uc(t,this,i,e),i.sort(_d),i}intersectObjects(t,e=!0,i=[]){for(let s=0,a=t.length;s<a;s++)Uc(t[s],this,i,e);return i.sort(_d),i}}function _d(n,t){return n.distance-t.distance}function Uc(n,t,e,i){let s=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(s=!1),s===!0&&i===!0){const a=n.children;for(let o=0,r=a.length;o<r;o++)Uc(a[o],t,e,!0)}}class hS extends Au{constructor(t=10,e=10,i=4473924,s=8947848){i=new qt(i),s=new qt(s);const a=e/2,o=t/e,r=t/2,l=[],c=[];for(let d=0,u=0,p=-r;d<=e;d++,p+=o){l.push(-r,0,p,r,0,p),l.push(p,0,-r,p,0,r);const _=d===a?i:s;_.toArray(c,u),u+=3,_.toArray(c,u),u+=3,_.toArray(c,u),u+=3,_.toArray(c,u),u+=3}const h=new Ne;h.setAttribute("position",new pe(l,3)),h.setAttribute("color",new pe(c,3));const f=new ol({vertexColors:!0,toneMapped:!1});super(h,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Yc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Yc);const dS={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function uS(n,t,e,i){const s=new mn(n.fov,i,.1,200),a=new V,o=new V,r=new V;let l=!1,c=n.fov;const h={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let f=1;function d(){const u=(n.pitchDeg+h.pitchDelta)*Math.PI/180,p=n.yawDeg*Math.PI/180;r.set(Math.sin(p)*Math.cos(u),Math.sin(u),Math.cos(p)*Math.cos(u)).multiplyScalar(n.distance*h.distanceScale*h.zoom)}return d(),{camera:s,update(u,p,_,g,m=dS){const x=p+.6;if(!l)a.set(u,x,_),l=!0;else{const P=1-Math.exp(-Math.max(n.smoothing,.001)*g);a.x+=(u-a.x)*P,a.y+=(x-a.y)*P,a.z+=(_-a.z)*P}const y=1-Math.exp(-Math.max(t.smoothing,.001)*g);h.distanceScale+=(m.distanceScale-h.distanceScale)*y,h.offsetX+=(m.offsetX-h.offsetX)*y,h.offsetZ+=(m.offsetZ-h.offsetZ)*y,h.pitchDelta+=(m.pitchDelta-h.pitchDelta)*y;const v=1-Math.exp(-Math.max(e.smoothing,.001)*g);h.zoom+=(f-h.zoom)*v,d(),(s.fov!==c||s.fov!==n.fov)&&(s.fov=n.fov,c=n.fov,s.updateProjectionMatrix()),o.set(a.x+h.offsetX,a.y,a.z+h.offsetZ),s.position.copy(o).add(r),s.lookAt(o),s.updateMatrixWorld()},snap(u,p,_){a.set(u,p+.6,_),l=!0,o.set(a.x+h.offsetX,a.y,a.z+h.offsetZ),d(),s.position.copy(o).add(r),s.lookAt(o),s.updateMatrixWorld()},resize(u){s.aspect=u,s.updateProjectionMatrix()},getGroundBasis(){const u=new V().setFromMatrixColumn(s.matrixWorld,0),p=new V().setFromMatrixColumn(s.matrixWorld,2).negate(),_=Math.hypot(u.x,u.z)||1,g=Math.hypot(p.x,p.z)||1;return{rightX:u.x/_,rightZ:u.z/_,forwardX:p.x/g,forwardZ:p.z/g}},setZoom(u){f=Number.isFinite(u)&&u>0?u:1},smart(){return{...h}}}}const Di=Math.PI*2,gn=1e-6;function sn(n,t,e){return n<t?t:n>e?e:n}function Nu(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function fS(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function zu(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const s=fS(n);return i===1?s:e+(s-e)*i}function yd(n){return(1-Math.sin(n))/2}function pl(n,t,e){const i=Math.PI/180,s=sn(Number.isFinite(t)?t:100,0,180),a=sn(Number.isFinite(e)?e:132,0,180);if(a<=s)return n>=Math.cos(s*i)?1:0;const o=Math.cos(s*i),r=Math.cos(a*i);if(n>=o)return 1;const l=sn((o-n)/(o-r),0,1);return 1-l*l*(3-2*l)}function ml(n,t){if(!n.grounded||n.speed<gn)return Nu();const e=n.speed/Math.max(n.moveSpeed,gn),i=Math.max(n.legLength,gn),s=n.stride>gn?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,a=Math.min(t.maxAmp,s/i),o=i*Math.sin(Math.min(t.maxAmp,1.25)),r=Math.abs(n.localForward),l=Math.abs(n.localRight),c=r+l+gn,h=pl(n.localForward/Math.max(n.speed,gn),t.backStrafeStartDeg,t.backStrafeFullDeg),f=l/c*h,d=r/c+l/c*(1-h),u=n.localForward>=0?1:-1,p=n.localRight>=0?1:-1,_=s,g=z=>Math.asin(sn(z,-o,o)/i);function m(z,C){const D=zu(z,t.plantLock),X=yd(z),H=u*d*_*D,Z=-g(H),Q=C*p>0?1:-1,mt=1+Q*t.crossStep*.45,dt=p*Q*t.crossStep*_*.4*X,ut=p*f*_*t.sideWeight*mt*D+dt*f,K=g(ut),tt=t.kneeLift*X*a*(.55+.25*d+(Q>0?.2*f:0));return{pitchX:Z,rollZ:K,kneeX:tt}}const x=(n.phase%Di+Di)%Di,y=m(x,-1),v=m((x+Math.PI)%Di,1),P=Math.cos(x),S=yd(x),w=-t.comSway*a*P*(.6*d+.8*f)-p*t.comSway*a*f*.45,T=t.comBob*S*a,b=p*t.hipLean*a*f*P*.6,M=p*t.hipLean*a*f*(.45+.25*P),R=t.armSwing*a*P*(d*u+.3*f),F=R,I=-R;return{legL:y,legR:v,pelvisX:w,pelvisY:T,pelvisRoll:b,sideLean:M,armL:F,armR:I,strafe:f,backward:u<0?d:0}}function Ou(n){const t=(n%Di+Di)%Di,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function Bu(n,t,e){const i=sn(e.progress,0,1);if(i>=1||n.speed<gn)return Nu();const s=i*i*(3-2*i),a=1-s;return ml({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*s,speed:n.speed*a,stride:n.stride*a},t)}function Hu(n,t,e,i){const s=sn(n,-1,1),a=Math.abs(s),o=Math.min(1,t*(1+Math.max(0,i)*a*a));return sn(o*s,-1,1)*(e*Math.PI/180)}function Gu(n,t,e,i){if(!(Math.hypot(n,t)>1e-6))return e;const a=Math.atan2(t,n)*180/Math.PI;if(Math.abs(a)<=90)return e;const r=(a-Math.sign(a)*180)*Math.PI/180,l=sn(i,0,1),c=l*l;return e*c+r*(1-c)}function Vu(n,t,e,i,s){const a=Math.max(e,gn),o=Math.max(0,i)*a,r=Math.max(0,s)*a,l=t>gn?(t-n)/t:0,c=l>.02,h=l<-.015,f=n<=o*.15,d=!h&&n<r&&(c||f);return{enter:n>gn&&n<=o&&c,resume:!d}}function Xu(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return sn(n*sn(t,0,2),-i,i)}function Wu(n,t,e){const i=Math.sin(n),s=Math.cos(n),a=Math.cos(n),o=-Math.sin(n);return{forward:t*i+e*s,right:t*a+e*o}}function $u(n,t,e){const i=sn(n,0,1),s=i*i*(3-2*i);return e?t==="inStop"?1-s:1:t==="afterStop"?1-s:0}function pS(n,t,e){const i=()=>({legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisY:0,env:0});if(!e.turnStepEnabled)return i();const s=sn(n,0,1),a=Math.sin(Math.PI*s),o=a*a;if(o<=1e-9)return i();const r=t>=0,l=r?1:.35,c=r?.35:1,h=Math.max(0,e.turnStepPitch)*o,f=Math.max(0,e.turnStepKnee)*o,d=Math.max(0,e.turnStepPitch)*.35*o,u=r?1:-1;return{legL:{pitchX:-h*l,rollZ:u*d*l,kneeX:f*l},legR:{pitchX:-h*c,rollZ:-u*d*c,kneeX:f*c},pelvisY:-Math.max(0,e.turnStepDip)*o,env:o}}function Yu(n,t,e,i,s){const a=sn(n,0,1),o=sn(s.stopPeakRatio,.05,.95),r=a<=o?a/o:(a-o)/(1-o),l=r*r*(3-2*r),c=a<=o?l:1-l,h=Math.hypot(e,i),f=h>gn?e/h:1,d=h>gn?i/h:0,u=zu(t,1)>0;return{leadPitch:Math.max(0,s.stopStepPitch)*c,trailPitch:Math.max(0,s.stopTrailPitch)*c,leadKnee:Math.max(0,s.stopStepKnee)*c,bodyShift:Math.max(0,s.stopBodyShift)*c,bodyDip:Math.max(0,s.stopBodyDip)*c,chestPitch:Math.max(0,s.stopChestPitch)*c,leadLeft:u,fwdN:f,rightN:d,env:c}}function Ke(n){return n<0?0:n>1?1:n}const to=Math.PI*2;function mS(n){return((n+Math.PI)%to+to)%to-Math.PI}function gS(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function xS(n,t,e,i,s,a=n.phase){const o=Ke(i);if(o<=0)return n;const r=Ke(t),l=Math.max(1,Math.round(s.cycles)),c=Math.max(0,s.strideSpeed),h=e%2===0?1:-1,f=Ke(s.forwardBias),d=Math.max(0,n.stride??0),u=Math.max(0,s.strideScale??0)*d,p=r<=.5?r*2:(r-.5)*2,_=p*p*(3-2*p),g=r<=.5?_:1-_,m={speed:c,phase:a+to*l/2*g,localForward:c*f,localRight:c*(1-f)*h},x=mS(m.phase-n.phase),y=o*o*(3-2*o),v=n.speed>.05?d:0;return{speed:n.speed+(m.speed-n.speed)*o,phase:n.phase+x*y,localForward:n.localForward+(m.localForward-n.localForward)*o,localRight:n.localRight+(m.localRight-n.localRight)*o,stride:v+(u-v)*o*o}}function vS(n,t,e){const i=gS(),s=Ke(n),a=Math.sin(Math.PI*s)**2;if(a<=1e-12)return i;const o=t%2===0?1:-1,r=o<0,l=o>0,c=e.stepPitch*a,h=e.stepKnee*a,f=e.stepSide*a;return i.legL.pitchX=r?-c:c*.55,i.legR.pitchX=l?-c:c*.55,i.legL.kneeX=r?h:h*.4,i.legR.kneeX=l?h:h*.4,i.legL.rollZ=-f*o,i.legR.rollZ=f*o,i.pelvisX=e.stepSway*a*o,i.pelvisY=-e.stepDip*a,i.pelvisRoll=f*.25*o,i}function Zu(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function Md(n,t,e,i,s){if(e<=0||i<=0)return 0;const a=(n-t)/e;return a<0||a>=1?0:i*Zu(a,s)}function _S(n,t,e,i){const s=t?1:0,a=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),o=n+(s-n)*a;return t&&o>.999?1:!t&&o<.001?0:o}function yS(n,t,e){const i=Ke(n);return{gaitScale:1-i*(1-Ke(t)),attackLegWeight:Ke(e)*i}}function MS(n,t){const e=Ke(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function SS(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return Ke(t.minScale+(1-t.minScale)*e)}function bS(){return qu()}function qu(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function ES(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function wS(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?Ke(t.forceHitHeight):n.type==="light"?Ke(t.hitHeight.light):n.type==="heavy"?Ke(t.hitHeight.heavy):n.type==="knock"?Ke(t.hitHeight.knock):0}function TS(n,t,e){const i=Ke(e),s=(a,o)=>a+(o-a)*i;return{upperPitch:s(n.upperPitch,t.upperPitch),upperRoll:s(n.upperRoll,t.upperRoll),upperYaw:s(n.upperYaw,t.upperYaw),fold:s(n.fold,t.fold),shift:s(n.shift,t.shift),drop:s(n.drop,t.drop),back:s(n.back,t.back),knee:s(n.knee,t.knee),hip:s(n.hip,t.hip),arm:s(n.arm,t.arm)}}function ju(n,t,e){const i=qu(),s=ES(n,e);if(i.intensity=s,s<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const a=Ke(1-n.timer/n.duration),o=Zu(a,e.pulseRatio);i.pulse=o,i.active=o>0,i.hitHeight=wS(n,e);const r=Math.sin(t),l=Math.cos(t),c=Math.cos(t),h=-Math.sin(t),f=n.dirX*r+n.dirZ*l,d=n.dirX*c+n.dirZ*h;if(i.localFwd=f,i.localRight=d,!e.enabled){i.legacy=!0;const _=Math.sin(Math.PI*a);return i.upperPitch=s*_*f,i.upperRoll=-s*_*d*.7,i.drop=(s>.5?.09:.04)*_,i.flash=e.flashStrength*_,i.active=_>0,i}const u=s*o,p=TS(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=u*(p.upperPitch*f+p.fold),i.upperRoll=-u*p.upperRoll*d,i.upperYaw=u*p.upperYaw*d,i.upperShift=u*p.shift,i.upperShiftX=i.upperShift*d,i.upperShiftZ=i.upperShift*f,i.comShift=u*e.comShift,i.comX=i.comShift*d,i.comZ=i.comShift*f,i.pelvisBack=u*p.back,i.drop=u*p.drop,i.knee=u*p.knee,i.hip=u*p.hip,i.arm=u*p.arm,i.flash=e.flashStrength*o,i}function Ku(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),s=Number.isFinite(n.leanForward)?n.leanForward:0,a=Number.isFinite(n.leanSide)?n.leanSide:0,o=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:s*e,pelvisRoll:a*e,pelvisX:-a*i,pelvisZ:s*i,crouch:Math.max(0,t.moveCrouch)*o}}const yi=1e-6;function Ys(n,t,e){return n<t?t:n>e?e:n}function AS(n,t,e,i=1){const s=t,a=e;if(!Number.isFinite(s)||!Number.isFinite(a)||s<=yi||a<=yi||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const r=s+a,l=Math.abs(s-a)+yi,c=Math.hypot(n.x,n.y,n.z);if(c<=yi)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const h=Math.atan2(n.x,-n.y),f=Math.hypot(n.x,n.y),d=n.z,u=Math.hypot(d,f),p=Ys(u,l,r),_=u>r+yi||u<l-yi,g=Math.atan2(-d,Math.max(f,yi)),m=Ys((s*s+p*p-a*a)/(2*s*p),-1,1),x=Ys((a*a+p*p-s*s)/(2*a*p),-1,1),y=Math.acos(m),v=Math.acos(x),P=i>=0?1:-1;return{rootPitch:g-P*y,rootRoll:h,jointPitch:P*(y+v),clamped:_,reach:c/r}}function RS(n,t,e,i){const s=Ys(e,0,1),a=Math.max(0,i),o=(r,l)=>{const c=Ys((l-r)*s,-a,a);return r+c};return{rootPitch:o(n.rootPitch,t.rootPitch),rootRoll:o(n.rootRoll,t.rootRoll),jointPitch:o(n.jointPitch,t.jointPitch)}}function Ju(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const gl={active:!1,weight:0,clamped:0,maxError:0};function Qu(n){const{root:t,pelvis:e,lower:i,limbs:s,base:a,cfg:o}=n;if(!o.enabled||o.weight<=0||!n.grounded||s.length===0)return{...gl};const r={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(a.pelvisPos),e.rotation.x=a.pelvisRotX,e.rotation.z=a.pelvisRotZ,i.position.copy(a.lowerPos),i.rotation.z=a.lowerRotZ,t.updateWorldMatrix(!0,!0);const l=s.map(u=>u.tip.getWorldPosition(new V));e.position.copy(r.pelvisPos),e.rotation.x=r.pelvisRotX,e.rotation.z=r.pelvisRotZ,i.position.copy(r.lowerPos),i.rotation.z=r.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const c=Math.max(0,Math.min(1,o.weight))*(n.attacking?Math.max(0,Math.min(1,o.attackScale)):1),h=Math.max(0,o.maxCorrectionDeg)*Math.PI/180;let f=0;for(let u=0;u<s.length;u++){const p=s[u],_=i.worldToLocal(l[u].clone()),g={x:_.x-p.root.position.x,y:_.y-p.root.position.y,z:_.z-p.root.position.z},m=AS(g,p.upperLen,p.lowerLen,p.bend);m.clamped&&(f+=1);const x=RS({rootPitch:p.root.rotation.x,rootRoll:p.root.rotation.z,jointPitch:p.joint.rotation.x},m,c,h);p.root.rotation.x=x.rootPitch,p.root.rotation.z=x.rootRoll,p.joint.rotation.x=x.jointPitch}t.updateWorldMatrix(!0,!0);let d=0;for(let u=0;u<s.length;u++){const p=s[u].tip.getWorldPosition(new V);d=Math.max(d,p.distanceTo(l[u]))}return{active:!0,weight:c,clamped:f,maxError:d}}function ln(n,t,e){return n<t?t:n>e?e:n}function CS(n,t,e,i,s,a,o,r,l,c){const h=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},f=new ve,d=new ve;d.name="pelvis",d.position.y=n.legLength,f.add(d);const u=new ve;u.name="lower";const p=new ve;p.name="upper",d.add(u),d.add(p);const _=[],g=(J,vt,$t,ot)=>{const _t=new sa({color:ot}),B=new ce(new An(J,vt,$t),_t);return B.castShadow=!0,B.receiveShadow=!0,_.push(_t),B},m=n.headSize,x=n.legLength,y=n.armLength,v=n.limbThickness,P=n.bodyHeight,S=n.bodyWidth,w=g(S,P,.28,e);w.position.y=P/2,p.add(w);const T=new ve;T.name="headPivot",T.rotation.order="YXZ",T.position.y=P,p.add(T);const b=g(m,m,m,e);b.position.y=m/2,T.add(b);for(const J of[-1,1]){const vt=g(.06,.07,.02,t.shoe);vt.position.set(J*.09,m/2+.03,m/2+.011),T.add(vt)}const M=(J,vt)=>{const $t=vt?y:x,ot=new ve;ot.name=vt?J<0?"shoulderL":"shoulderR":J<0?"hipL":"hipR",vt||(ot.rotation.order="ZYX"),ot.position.set(J*(vt?S/2+v/2:S/2-v/2),vt?P-.04:0,0),(vt?p:u).add(ot);const _t=g(v,$t/2,v,t.limb);_t.position.y=-$t/4,ot.add(_t);const B=new ve;B.name=vt?"elbow":"knee",B.position.y=-$t/2,ot.add(B);const it=g(v,$t/2,v,t.limb);if(it.position.y=-$t/4,B.add(it),!vt){const pt=g(v*1.15,.07,v*1.7,t.shoe);pt.position.set(0,-$t/2+.035,.045),B.add(pt);const Ut=new De;return Ut.name="footTip",Ut.position.y=-$t/2,B.add(Ut),{root:ot,joint:B,tip:Ut}}return{root:ot,joint:B}},R=M(-1,!1),F=M(1,!1),I=M(-1,!0),z=M(1,!0),C=[R,F].map(J=>({root:J.root,joint:J.joint,tip:J.tip,upperLen:x/2,lowerLen:x/2,bend:1})),D=new He({color:s.attackArcColor,transparent:!0,opacity:0,side:Ae,depthWrite:!1}),X=new ce(new Ao(.62,.042,6,20,Math.PI*1.1),D);X.position.set(0,.78-x,.56),p.add(X);const H=new qt(e),Z=new qt(r.flashColor),Q=new qt;let mt=null,dt=0,ut=0,K=0,tt=0,ht=0,j=0,Mt=0,kt={...gl},Ct=-1,Tt=0,Ht=0,Lt=0,G=0,jt=0,Rt=0,Dt=0,zt=1,It=0,Pt=0,L="none",E=0,$=!1,nt=-1,at=!1,lt=0,Ot=0;return{group:f,boneAtWorld(J,vt,$t){const ot=[{node:p,ax:0,ay:.05,az:0,bx:0,by:P,bz:0},{node:T,ax:0,ay:0,az:0,bx:0,by:m,bz:0},{node:I.root,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0},{node:I.joint,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0},{node:z.root,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0},{node:z.joint,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0},{node:R.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:R.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:F.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:F.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0}],_t=new V,B=new V,it=new V(J,vt,$t),pt=new V;let Ut=null,Nt=Number.POSITIVE_INFINITY;for(const Gt of ot){Gt.node.updateWorldMatrix(!0,!1),_t.set(Gt.ax,Gt.ay,Gt.az),B.set(Gt.bx,Gt.by,Gt.bz),Gt.node.localToWorld(_t),Gt.node.localToWorld(B);const N=B.x-_t.x,St=B.y-_t.y,q=B.z-_t.z,ct=N*N+St*St+q*q;let yt=ct>1e-8?((it.x-_t.x)*N+(it.y-_t.y)*St+(it.z-_t.z)*q)/ct:0;yt=Math.max(0,Math.min(1,yt));const Et=_t.x+N*yt,Xt=_t.y+St*yt,Kt=_t.z+q*yt,oe=(it.x-Et)**2+(it.y-Xt)**2+(it.z-Kt)**2;oe<Nt&&(Nt=oe,Ut=Gt.node,pt.set(Et,Xt,Kt))}return Ut?{node:Ut,point:pt.clone()}:null},update(J,vt){f.position.set(J.position.x,J.position.y,J.position.z),f.rotation.y=J.bodyYaw,T.rotation.y=(J.headYaw-J.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,J.mode!==mt&&(mt=J.mode,dt=1),dt=Math.max(0,dt-vt*2.2);const $t=J.hurt,ot=ju($t,J.bodyYaw,r),_t=ot.flash;Q.copy(Z).multiplyScalar(_t);for(const st of _)st.emissive.copy(H).multiplyScalar(dt*.5),_t>0&&st.emissive.add(Q);d.position.set(0,x,0),d.rotation.set(0,0,0),p.position.set(0,0,0),p.rotation.set(0,0,0),u.position.set(0,0,0),u.rotation.z=0;const B=Math.hypot(J.velocity.x,J.velocity.z),it=ln(o.knockGaitScale??0,0,1),pt=J.hurt.knockX*it,Ut=J.hurt.knockZ*it,Nt=it>0&&Math.hypot(J.hurt.knockX,J.hurt.knockZ)>.001,Gt=J.velocity.x+pt,N=J.velocity.z+Ut,St=Math.hypot(Gt,N),q=Math.cos(J.bodyYaw),ct=-Math.sin(J.bodyYaw),yt=B>1e-6?ln((J.velocity.x*q+J.velocity.z*ct)/B,-1,1):0,Et=B>1e-6?ln((J.velocity.x*Math.sin(J.bodyYaw)+J.velocity.z*Math.cos(J.bodyYaw))/B,-1,1):1,Xt=pl(Et,o.backStrafeStartDeg,o.backStrafeFullDeg);L==="settled"&&at&&lt>Ot*1.02+1e-4&&(L="none");let Kt=1;L==="blend"?(Kt=$u($?nt:E,o.stopYawBlendMode,$),$||(E=Math.min(1,E+vt/Math.max(.01,o.stopYawAfterSec)),(E>=1||o.stopYawBlendMode==="inStop"||at)&&(L="settled",Kt=0))):L==="settled"&&(Kt=ln(B/Math.max(1e-6,o.stopEnterRatio*a),0,1));const oe=Hu(yt,o.strafeHipScale,o.strafeHipMaxDeg,o.strafeHipBoost),Qt=Gu(Et,yt,oe,Xt)*Kt;It+=(Qt-It)*(1-Math.exp(-12*Math.max(0,vt))),u.rotation.y=It;const ie=J.bodyYaw+It,ye=Math.sin(ie),Ge=Math.cos(ie),ze=Math.cos(ie),Y=-Math.sin(ie),bt=Gt*ye+N*Ge,wt=Gt*ze+N*Y,Jt=Math.max(0,o.stopBlendSec||0),Yt=Jt>0&&!Nt,se=Vu(B,Pt,a,o.stopEnterRatio,o.stopExitRatio);if(!Yt||se.resume)Ct=-1;else if(Ct<0&&se.enter){Ct=0,Tt=J.gaitPhase,Ht=Ou(J.gaitPhase),Lt=B,G=Math.max(J.stride,1e-6),jt=bt,Rt=wt;const st=1/Math.max(1e-6,B);Dt=J.velocity.x*st,zt=J.velocity.z*st}const ue=Pt;Pt=B;const Me=Yt&&Ct>=0;Me&&(Ct=Math.min(1,Ct+vt/Jt)),Me&&L!=="blend"&&(L="blend",E=0),$=Me&&Ct<1,nt=Ct,at=se.resume,lt=B,Ot=ue;const Oe=Me?{phase:Tt,speed:Lt,moveSpeed:a,localForward:jt,localRight:Rt,legLength:n.legLength,stride:G,grounded:!0}:{phase:J.gaitPhase,speed:St,moveSpeed:a,localForward:bt,localRight:wt,legLength:n.legLength,stride:J.stride,grounded:!0},de=Me?Bu(Oe,o,{progress:Ct,phase0:Tt,phaseEnd:Ht}):ml(Oe,o);let an=0,dn=0,A=0,W=0;if(Me){const st=Wu(J.bodyYaw,Dt,zt),et=Yu(Ct,Tt,st.forward,st.right,o);et.leadLeft?(de.legL.pitchX-=et.leadPitch,de.legL.kneeX+=et.leadKnee,de.legR.pitchX+=et.trailPitch):(de.legR.pitchX-=et.leadPitch,de.legR.kneeX+=et.leadKnee,de.legL.pitchX+=et.trailPitch),dn=et.bodyShift*et.fwdN,an=et.bodyShift*et.rightN,A=et.bodyDip,W=et.chestPitch}R.root.rotation.x=de.legL.pitchX,F.root.rotation.x=de.legR.pitchX,R.root.rotation.z=de.legL.rollZ,F.root.rotation.z=de.legR.rollZ,R.joint.rotation.x=de.legL.kneeX,F.joint.rotation.x=de.legR.kneeX,I.root.rotation.x=de.armL,z.root.rotation.x=de.armR,I.joint.rotation.x=-.18,z.joint.rotation.x=-.18,d.position.x=de.pelvisX,d.position.y=x+de.pelvisY,d.position.z=0,d.rotation.z=de.pelvisRoll,p.rotation.z=de.sideLean*(ot.intensity>0?.4:1);const k=Ju(d,u),O=Me&&h.enabled?{...h,weight:1}:h,U=O.enabled&&O.weight>0?ln(O.weight,0,1):0;if(d.position.x+=an,d.position.z+=dn,d.position.y-=A,u.position.y+=A,U<=0&&(u.position.x-=an,u.position.z-=dn),l){const st=Math.max(.004166666666666667,Math.min(vt,.1)),et=Math.sin(J.bodyYaw),gt=Math.cos(J.bodyYaw),Wt=ln((J.velocity.x-ut)/st,-60,60),Zt=ln((J.velocity.z-K)/st,-60,60),ae=Wt*et+Zt*gt,ge=Re(J.bodyYaw-tt)/st,te=l.maxForwardDeg*Math.PI/180,Vt=l.maxSideDeg*Math.PI/180,Pe=1-Math.exp(-Math.max(0,l.smoothing)*st);ht+=(ln(ae*l.accelGain,-te,te)-ht)*Pe,j+=(ln(-ge*B*l.turnGain,-Vt,Vt)-j)*Pe;const re=Number.isFinite(l.crouchSmoothing)?l.crouchSmoothing:8;Mt+=(ln(B/Math.max(a,1e-6),0,1)-Mt)*(1-Math.exp(-Math.max(0,re)*st));const Ee=Ku({leanForward:ht,leanSide:j,speedRatio:Mt},l);p.rotation.x+=ht+W,p.rotation.z+=j,d.rotation.x+=Ee.pelvisPitch,d.rotation.z+=Ee.pelvisRoll,d.position.x+=Ee.pelvisX,d.position.z+=Ee.pelvisZ,d.position.y-=Ee.crouch,u.position.y+=Ee.crouch*(1-U)}ut=J.velocity.x,K=J.velocity.z,tt=J.bodyYaw,p.rotation.x+=ot.upperPitch,p.rotation.z+=ot.upperRoll,p.rotation.y+=ot.upperYaw;const rt=ln(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),ft=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;p.position.x+=ln(ot.upperShiftX*rt,-ft,ft),p.position.z+=ln(ot.upperShiftZ*rt,-ft,ft),d.position.x+=ot.comX,d.position.z+=ot.comZ-ot.pelvisBack,d.position.y-=ot.drop;const xt=ot.legacy?0:Math.max(0,Math.min(1,r.lowerScale));if(u.position.z+=ot.pelvisBack*(1-xt),u.position.y+=ot.drop*(1-xt),R.joint.rotation.x+=ot.knee,F.joint.rotation.x+=ot.knee,R.root.rotation.x-=ot.hip,F.root.rotation.x-=ot.hip,I.root.rotation.x+=ot.arm,z.root.rotation.x+=ot.arm*.8,J.attackPhase!=="idle"&&ot.intensity===0){const st=J.attackProgress,et=st<.34?-1:st<.68?-1+(st-.34)/.34*2:Math.max(0,1-(st-.68)/.32),gt=Math.max(0,-et),Wt=Math.max(0,et);z.root.rotation.x=-1.7*gt+1.25*Wt,z.joint.rotation.x=-(.25+gt*.45),p.rotation.y=-.28*et,D.opacity=J.attackPhase==="active"?.85:0,J.attackPhase==="active"&&(X.rotation.z=-1.1+st*3)}else D.opacity=0;const At=Xu(It,o.chestYawScale,o.chestYawMaxDeg);p.rotation.y+=At,T.rotation.y=(J.headYaw-J.bodyYaw-At+Math.PI*3)%(Math.PI*2)-Math.PI,kt=Qu({root:f,pelvis:d,lower:u,limbs:C,base:k,cfg:O,grounded:!0,attacking:J.attackPhase!=="idle"})},ik(){return kt},dispose(){f.traverse(J=>{if(J instanceof ce){J.geometry.dispose();const vt=J.material;Array.isArray(vt)?vt.forEach($t=>$t.dispose()):vt.dispose()}})}}}const Mi=.012,Si=.016;function PS(n,t){const e=t.lab,i=new ve;i.name="test-lab";const s=[],a=[],o=[],r=[];function l(x){return o.push(x),x}function c(x){return r.push(x),x}function h(x,y,v,P=Mi){const S=l(new He({color:y,transparent:!0,opacity:v,depthWrite:!1,side:Ae,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),w=new ce(x,S);return w.rotation.x=-Math.PI/2,w.position.y=P,w.renderOrder=2,w}function f(x,y){return c(new ia(Math.max(x,.001),y,72))}function d(x,y,v,P=Si){const w=document.createElement("canvas"),T=w.getContext("2d");if(!T)return new ce;const b='700 96px "Noto Sans SC", ui-monospace, Menlo, monospace';T.font=b,w.width=dh.ceilPowerOfTwo(Math.ceil(T.measureText(x).width)+32),w.height=dh.ceilPowerOfTwo(96*1.4);const M=w.getContext("2d");if(!M)return new ce;M.font=b,M.textAlign="center",M.textBaseline="middle",M.fillStyle=v,M.fillText(x,w.width/2,w.height/2);const R=new Lc(w);R.colorSpace=je,a.push(R);const F=w.width/w.height,I=c(new pn(y*F,y)),z=l(new He({map:R,transparent:!0,depthWrite:!1,side:Ae,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3})),C=new ce(I,z);return C.rotation.x=-Math.PI/2,C.position.y=P,C.renderOrder=3,C}function u(x,y,v,P,S,w){const T=v-y,b=c(new pn(T,P)),M=h(b,S,w,Mi);M.position.set(T/2+y,Mi,0);const R=new ve;return R.add(M),R.rotation.y=x-Math.PI/2,R}function p(x,y,v,P,S){const w=new Lu;w.moveTo(0,y*.5),w.lineTo(-v*.5,y*.5-v*.9),w.lineTo(-v*.18,y*.5-v*.9),w.lineTo(-v*.18,-y*.5),w.lineTo(v*.18,-y*.5),w.lineTo(v*.18,y*.5-v*.9),w.lineTo(v*.5,y*.5-v*.9),w.closePath();const T=c(new fl(w)),b=h(T,P,S,Mi+.002),M=new ve;return M.add(b),M.rotation.y=x+Math.PI,M}function _(x){var T;const y=new ve,v=d(`${x.index} · ${x.name}`,t.lab.labelTextHeight,"#eaf4ff"),S=((T=v.geometry.parameters)==null?void 0:T.width)??3;y.add(v);const w=h(c(new pn(S*.98,.08)),x.color,.7,Si);return w.position.set(0,Si,t.lab.labelTextHeight*.66),y.add(w),y.position.set(x.labelX,0,x.labelZ),y}const g=new ve;for(const x of n??[]){const y=new ve;if(y.position.set(x.x,0,x.z),x.shape==="square"){const v=x.radius,P=h(c(new pn(v*2,v*2)),x.color,e.padOpacity*.09);y.add(P);const S=.07,w=[[0,v,v*2+S,S],[0,-v,v*2+S,S],[-v,0,S,v*2+S],[v,0,S,v*2+S]];for(const[T,b,M,R]of w){const F=h(c(new pn(M,R)),x.color,e.padOpacity);F.position.x=T,F.position.z=b,y.add(F)}}else y.add(h(c(new ll(x.radius,72)),x.color,e.padOpacity*.075)),y.add(h(f(x.radius-.075,x.radius),x.color,e.padOpacity));if(x.id==="hub"){for(let v=0;v<4;v++){const P=v*Math.PI/4,S=v%2===0;for(const w of[0,Math.PI])y.add(u(P+w,x.radius*.12,x.radius*.94,S?.09:.055,x.color,S?.5:.32))}y.add(h(f(.5,.56),x.color,.4))}else if(x.id==="dash"){const v=x.spawnZ-x.z,P=-x.radius+.5,S=v-P,w=h(c(new pn(.06,S)),x.color,.36);w.position.set(0,Mi,(v+P)/2),y.add(w);let T=0;for(let M=v;M>=P-.01;M-=1,T++){const R=T%5===0,F=h(c(new pn(R?2.4:1.3,R?.1:.07)),x.color,R?.72:.42);F.position.set(0,Mi,M),y.add(F);const I=d(String(T),.52,R?"#eaf4ff":"rgba(200,225,245,0.8)");I.position.set(1.6,Si,M),y.add(I)}const b=[[3.2,"翻滚 3.2"],[5,"闪现 5.0"]];for(const[M,R]of b){const F=v-M,I=h(c(new pn(1.9,.09)),"#ffffff",.5);I.position.set(-1.5,Mi,F),y.add(I);const z=d(R,.42,"rgba(220, 236, 250, 0.86)");z.position.set(-3,Si,F),y.add(z)}}else if(x.id==="gait"){y.add(h(f(1.44,1.5),x.color,.5)),y.add(h(f(1.14,1.2),x.color,.22));const v=1.55,P=[[0,"180° 正后退","#ff9a8a"],[Math.PI/4,"135° 斜后","#ffd166"],[Math.PI/2,"90° 正侧移","#8fe7ff"]];for(const[S,w,T]of P){const M=Math.sin(S),R=Math.cos(S),F=p(S,1.7,.34,T,.75);F.position.set(M*1.7*.5,0,v+R*1.7*.5),y.add(F);const I=d(w,.44,T);I.position.set(M*(1.7+.7),Si,v+R*(1.7+.7)),y.add(I)}}if(g.add(y),e.showLabels){const v=_(x);s.push(v),g.add(v)}}i.add(g);const m=n==null?void 0:n.find(x=>x.id==="hub");if(m&&e.showLabels){const x=[[0,-1,"屏上"],[0,1,"屏下"],[-1,0,"屏左"],[1,0,"屏右"]];for(const[y,v,P]of x){const S=d(P,.4,"rgba(190, 224, 248, 0.8)");S.position.set(m.x+y*(m.radius+.7),Si,m.z+v*(m.radius+.7)),i.add(S),s.push(S)}}return i.visible=e.enabled,{group:i,setVisible(x){i.visible=x},setLabelsVisible(x){for(const y of s)y.visible=x},dispose(){for(const x of r)x.dispose();for(const x of o)x.dispose();for(const x of a)x.dispose();i.clear()}}}const xl=64,tf=[0,.24,.76,1],DS=[0,1,1,0],ef=[0,.12,.28,.5,.72,.88,1],LS=[0,.16,.5,1,.5,.16,0];function Sd(n,t){if(t<=1e-6)return 1;const e=Math.min(1,Math.max(0,n/t));return e*e*(3-2*e)}function vl(n,t,e,i,s=xl,a="band"){const o=Math.max(.001,n-t*.5),r=Math.max(o+.001,n+t*.5),l=a==="glow"?ef:tf,c=a==="glow"?LS:DS,h=l.length,f=s+1,d=new Float32Array(f*h*3),u=new Float32Array(f*h*4),p=[];for(let g=0;g<f;g++){const m=g/s,x=(m-.5)*e,y=Sd(m,i)*Sd(1-m,i),v=Math.sin(x),P=Math.cos(x);for(let S=0;S<h;S++){const w=o+(r-o)*l[S],T=g*h+S;d[T*3]=v*w,d[T*3+1]=0,d[T*3+2]=P*w;const b=y*c[S];u[T*4]=1,u[T*4+1]=1,u[T*4+2]=1,u[T*4+3]=b}}for(let g=0;g<s;g++)for(let m=0;m<h-1;m++){const x=g*h+m,y=x+h;p.push(x,y,x+1,x+1,y,y+1)}const _=new Ne;return _.setAttribute("position",new Qe(d,3)),_.setAttribute("color",new Qe(u,4)),_.setIndex(p),_.computeBoundingSphere(),_}function Rr(n){const t=new He({color:n.color,transparent:!0,opacity:n.opacity,depthWrite:!1,side:Ae,vertexColors:!0,toneMapped:!1}),e=new Map;let i=null;const s=(l,c)=>{const h=Math.round(l*32)/32,f=Math.max(.05,Math.round(c*20)/20),d=`${Math.round(h*32)}|${Math.round(f*20)}`,u=e.get(d);if(u)return u;const p=vl(n.radius,n.thickness*f,h,n.edgeFade,xl,n.profile??"band");if(e.set(d,p),e.size>64){for(const[_,g]of e)if(_!==d&&g!==i){g.dispose(),e.delete(_);break}}return p};i=s(n.arcRad,1);const a=new ce(i,t);a.position.y=n.y,a.renderOrder=n.renderOrder??4;let o=n.arcRad,r=1;return{mesh:a,update(l,c,h,f,d,u=1){const p=Math.max(.05,u);(Math.abs(l-o)>.01||Math.abs(p-r)>.01)&&(i=s(l,p),a.geometry=i,o=l,r=p),t.opacity=c,t.color.copy(f),a.scale.set(h,1,h),a.rotation.y=d,a.visible=c>.002},arcRad(){return o},dispose(){for(const l of e.values())l.dispose();e.clear(),t.dispose()}}}function bd(n,t){return Math.max(.05,n*.5*Math.max(.1,t))}function IS(n,t,e,i,s){const a=s.arcDeg*Math.PI/180,o=s.playerOpacity;if(!n)return{arcRad:a,opacity:o,scale:1,level:0};const r=Math.min(1,Math.max(0,t)),l=Math.min(1,Math.max(0,e)),c=s.selectedArcDeg*Math.PI/180,h=a+(c-a)*(.35+.65*r),f=4+4*r+6*l,d=.5+.5*Math.sin(i*f),u=Math.min(.95,o+(.2+.1*l)*r+.04*d),p=1+.02*r+.012*d*r;return{arcRad:h,opacity:u,scale:p,level:r}}function kS(n,t,e,i,s){const a=Math.min(1,Math.max(0,s));return a<=.001?n.copy(t):a<.5?n.copy(t).lerp(e,a*2):n.copy(e).lerp(i,(a-.5)*2)}function US(n=64,t=.06,e=5){const i=n+1,s=e+1,a=new Float32Array(i*s*3),o=new Float32Array(i*s*4),r=[];for(let c=0;c<i;c++){const h=c/n*Math.PI*2,f=Math.sin(h),d=Math.cos(h);for(let u=0;u<s;u++){const p=u/e,_=t+(1-t)*p,g=c*s+u;a[g*3]=f*_,a[g*3+1]=0,a[g*3+2]=d*_;const m=Math.pow(1-p,1.8)*.9+(u===0?.1:0);o[g*4]=1,o[g*4+1]=1,o[g*4+2]=1,o[g*4+3]=Math.min(1,m)}}for(let c=0;c<n;c++)for(let h=0;h<e;h++){const f=c*s+h,d=f+s;r.push(f,d,f+1,f+1,d,d+1)}const l=new Ne;return l.setAttribute("position",new Qe(a,3)),l.setAttribute("color",new Qe(o,4)),l.setIndex(r),l.computeBoundingSphere(),l}function Ed(n){const t=n.segments??xl,e=n.profile??"band",s=((e==="glow"?ef.length:tf.length)-1)*6,a=vl(n.radius,n.thickness,n.arcRad,n.edgeFade,t,e),o=new He({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ae,vertexColors:!0,toneMapped:!1}),r=new ce(a,o);r.position.y=n.y,r.renderOrder=n.renderOrder??7,r.visible=!1,a.setDrawRange(0,0);let l=0;return{mesh:r,set(c,h,f,d,u=1){const p=Math.min(1,Math.max(0,c)),_=Math.round(p*t),g=p>.001?Math.max(1,_)*s:0;g!==a.drawRange.count&&a.setDrawRange(0,g),l=_,o.opacity=h,o.color.copy(f),r.scale.set(u,1,u),r.rotation.y=d,r.visible=h>.002&&p>.001},ratio(){return t>0?l/t:0},filledSegments(){return l},dispose(){a.dispose(),o.dispose()}}}function wd(n){const t=new ve,e=US(48),i=new He({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ae,vertexColors:!0,toneMapped:!1}),s=new ce(e,i);s.renderOrder=n.renderOrder??2,t.add(s);const a=Math.max(.01,n.edgeWidthRatio??.045),o=vl(1-a*.5,a,Math.PI*2,0,64,"band"),r=new He({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ae,vertexColors:!0,toneMapped:!1}),l=new ce(o,r);return l.renderOrder=(n.renderOrder??2)+1,t.add(l),t.position.y=n.y,{group:t,set(c,h,f,d,u,p){const _=Math.min(1,Math.max(0,u));t.position.set(c,f,h),s.scale.set(d,1,d),l.scale.set(d,1,d),i.opacity=_*.26,r.opacity=_*(.72+.18*Math.sin(p*7)),t.visible=_>.004},dispose(){e.dispose(),i.dispose(),o.dispose(),r.dispose()}}}function Td(n,t,e,i){if(i<=1e-4||e<=0)return t;const s=1-Math.exp(-e/i);return n+(t-n)*s}function FS(n,t,e){if(n!=="windup")return{active:!1,ratio:0,urgency:0};const i=Math.max(1e-4,e),s=Math.min(1,Math.max(0,t/i));return{active:!0,ratio:s,urgency:.35+.65*s}}function NS(n){if(n.charging)return{source:"charge",ratio:Math.min(1,Math.max(0,n.charge))};if(n.channeling){if(n.channelProgress!==void 0)return{source:"channel",ratio:Math.min(1,Math.max(0,n.channelProgress))};const i=Math.max(1e-4,n.fireInterval);return{source:"channel",ratio:1-Math.min(1,Math.max(0,n.fireTimer/i))}}const t=n.arcaneCooldown??0,e=n.arcaneCooldownMax??0;return t>0&&e>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,t/e))}:n.dashCooldown>0&&n.dashCooldownMax>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,n.dashCooldown/n.dashCooldownMax))}:{source:"none",ratio:0}}function zS(n,t,e,i,s,a){return n!=="windup"||s<=.05?{active:!1,x:t,z:e,radius:0}:{active:!0,x:t+Math.sin(i)*s,z:e+Math.cos(i)*s,radius:Math.max(.3,a)}}function OS(n,t){const e=Math.max(.02,t),i=Math.min(1,Math.max(0,n/e));return{scale:.06+.94*(1-Math.pow(1-i,3)),alpha:i}}function BS(n,t,e){return n?t:e}function nf(n){return{x:0,y:0,z:1}}function HS(n){return Math.asin(nf().y)}function GS(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}function Ie(n,t,e){return n<t?t:n>e?e:n}const os=1e-6;function we(n,t,e,i){const s=new ce(new An(n,t,e),new sa({color:i}));return s.castShadow=!0,s.receiveShadow=!0,s}function ke(){return new ve}function eo(n,t,e){const i=ke(),s=we(t*.7,.12,t*.7,e.wood);s.position.y=.06,i.add(s);const a=we(t*2.4,.045,t*.8,e.metal);a.position.y=.13,i.add(a);const o=we(t*.38,n,t,e.blade);o.position.y=.13+n/2,i.add(o);const r=we(t*.42,n*.96,t*.2,e.bladeEdge);r.position.set(0,.13+n/2,t*.5),i.add(r);const l=we(t*.3,.09,t*.45,e.blade);return l.position.y=.13+n+.045,i.add(l),i}function VS(n){const t=eo(.72,.15,n),e=we(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function XS(n){const t=ke(),e=we(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=we(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function WS(n){const t=ke(),e=we(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=we(.15,.15,.15,n.glow);i.position.y=.92;const s=i.material;return s.emissive=new qt(n.glow),s.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function $S(n){const t=ke();for(let i=0;i<5;i++){const s=(i-2)*.15,a=we(.055,.16,.05,n.wood);a.position.set(.16-Math.abs(s)*.46,s,0),t.add(a)}const e=we(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function YS(n){const t=ke(),e=we(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=we(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function ZS(n,t,e,i,s,a,o,r,l,c,h){const f=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},d=h??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},u=ke(),p=ke();p.name="pelvis",p.position.y=n.legLength,u.add(p);const _=ke();_.name="lower";const g=ke();g.name="upper",p.add(_),p.add(g);const m=n.headSize,x=n.legLength,y=n.armLength,v=n.limbThickness,P=n.bodyHeight,S=n.bodyWidth,w=we(S,P,.28,t.body);w.position.y=P/2,g.add(w);const T=ke();T.name="headPivot",T.rotation.order="YXZ",T.position.y=i.headPivotHeight,g.add(T);const b=we(m,m,m,t.head);b.position.y=m/2,T.add(b);const M=new sa({color:"#1b2733"});for(const k of[-1,1]){const O=new ce(new An(.06,.07,.02),M);O.position.set(k*.09,m/2+.03,m/2+.011),T.add(O)}const R=k=>{const O=ke();O.name=k<0?"hipL":"hipR",O.rotation.order="ZYX",O.position.set(k*(S/2-v/2),0,0),_.add(O);const U=we(v,x/2,v,t.limb);U.position.y=-x/4,O.add(U);const rt=ke();rt.name="knee",rt.position.y=-x/2,O.add(rt);const ft=we(v,x/2,v,t.limb);ft.position.y=-x/4,rt.add(ft);const xt=we(v*1.15,.07,v*1.7,t.shoe);xt.position.set(0,-x/2+.035,.045),rt.add(xt);const At=new De;return At.name="footTip",At.position.y=-x/2,rt.add(At),{root:O,joint:rt,hand:ke(),tip:At}},F=k=>{const O=ke();O.name=k<0?"shoulderL":"shoulderR",O.position.set(k*(S/2+v/2),P-.04,0),g.add(O);const U=we(v,y/2,v,t.limb);U.position.y=-y/4,O.add(U);const rt=ke();rt.name="elbow",rt.position.y=-y/2,O.add(rt);const ft=we(v,y/2,v,t.limb);ft.position.y=-y/4,rt.add(ft);const xt=ke();xt.position.y=-y/2,rt.add(xt);const At=we(v*1.1,.09,v*1.1,t.head);return At.position.y=.045,xt.add(At),{root:O,joint:rt,hand:xt}},I=R(-1),z=R(1),C=F(-1),D=F(1),X=[I,z].map(k=>({root:k.root,joint:k.joint,tip:k.tip,upperLen:x/2,lowerLen:x/2,bend:1})),H=ke(),Z=ke();D.hand.add(H),C.hand.add(Z);const Q=WS(t),mt=$S(t),dt=YS(t),ut={"sword-shield":{right:eo(.42,.075,t),left:XS(t)},"dual-swords":{right:eo(.42,.075,t),left:eo(.42,.075,t)},greatsword:{right:VS(t),left:we(.12,.2,.12,t.wood)},staff:{right:Q.g,left:ke(),orb:Q.orb},bow:{right:dt,left:mt.g,arrow:dt,drawString:mt.drawString}};for(const k of Object.keys(ut))H.add(ut[k].right),Z.add(ut[k].left),ut[k].right.visible=!1,ut[k].left.visible=!1;let K=null,tt=0,ht=0,j=0,Mt=0,kt=0,Ct=0,Tt=bS(),Ht={...gl},Lt=0,G=0,jt=0,Rt=-1,Dt=0,zt=0,It=0,Pt=0,L=0,E=0,$=0,nt=1,at=0,lt=0,Ot=0,J=!1,vt=0,$t=0,ot=0,_t=0,B="none",it=0,pt=1,Ut=!1,Nt=-1,Gt=!1,N=0,St=0,q=0,ct=0,yt=0,Et=1,Xt={speed:0,phase:0},Kt={lp:0,lr:0,rp:0,rr:0},oe=0,Qt=0,ie=!0,ye=0,Ge="none",ze=0,Y=0,bt=0,wt=.3,Jt=0;function Yt(k){const O=Math.PI/180,U=a;let rt=0,ft=0,xt=0,At=0;k==="sword-shield"?(rt=U.swordPitchDeg*O,ft=-U.swordYawDeg*O,xt=U.shieldPitchDeg*O):k==="dual-swords"?(rt=U.swordPitchDeg*O,ft=-U.swordYawDeg*O,xt=U.swordPitchDeg*O,At=U.swordYawDeg*O):k==="greatsword"?(rt=U.greatswordPitchDeg*O,ft=-U.greatswordYawDeg*O,xt=U.greatswordPitchDeg*O,At=U.greatswordYawDeg*O):k==="staff"?rt=U.staffPitchDeg*O:xt=U.bowPitchDeg*O,H.rotation.set(rt,0,ft),Z.rotation.set(xt,0,At)}function se(k){if(k!==K){K=k;for(const O of Object.keys(ut))ut[O].right.visible=O===k,ut[O].left.visible=O===k;Yt(k),mt.drawString.position.z=-.06,dt.position.z=0,Q.orb.scale.setScalar(1),g.rotation.y=0}}se("sword-shield");const ue=[];u.traverse(k=>{k instanceof ce&&k.material instanceof sa&&ue.push(k.material)});const Me=new qt(r.flashColor);function Oe(k,O){const U=ju(k,O,r);Tt=U,g.rotation.x+=U.upperPitch,g.rotation.z+=U.upperRoll,g.rotation.y+=U.upperYaw;const rt=Ie(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),ft=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;g.position.x+=Ie(U.upperShiftX*rt,-ft,ft),g.position.z+=Ie(U.upperShiftZ*rt,-ft,ft),p.position.x+=U.comX,p.position.z+=U.comZ-U.pelvisBack,p.position.y-=U.drop;const xt=U.legacy?0:Ie(r.lowerScale,0,1);_.position.z+=U.pelvisBack*(1-xt),_.position.y+=U.drop*(1-xt),I.joint.rotation.x+=U.knee,z.joint.rotation.x+=U.knee,I.root.rotation.x-=U.hip,z.root.rotation.x-=U.hip,C.root.rotation.x+=U.arm,D.root.rotation.x+=U.arm*.8;for(const At of ue)At.emissive.copy(Me).multiplyScalar(U.flash)}function de(k){return k<.3?-1:k<.62?-1+(k-.3)/.32*2:Math.max(0,1-(k-.62)/.38)}function an(k){if(k.phase==="idle"||k.charging)return;const O=k.attackProgress,U=de(O),rt=Math.max(0,U),ft=k.comboIndex%2===0?1:-1,xt=l.stride,At=Number.isFinite(xt.stepReach)?xt.stepReach:.17,st=Number.isFinite(xt.stepSideReach)?xt.stepSideReach:.14,et=Number.isFinite(xt.stepDipReach)?xt.stepDipReach:.05,gt=k.weapon==="greatsword"?Ie(Number.isFinite(xt.heavyScale)?xt.heavyScale:1,0,1):1;p.position.z+=At*rt*gt,p.position.x+=ft*st*rt*gt,p.position.y-=et*Math.sin(Math.PI*O)*gt}function dn(k){if(mt.drawString.position.z=-.06,dt.position.z=0,Q.orb.scale.setScalar(1),g.rotation.y=0,k.charging&&k.weapon==="bow"){const ft=k.charge;C.root.rotation.x=-1.25,C.joint.rotation.x=-.15,D.root.rotation.x=.35+ft*.3,D.joint.rotation.x=-1.15,mt.drawString.position.z=-.06-ft*.22,dt.position.z=-ft*.3,g.rotation.y=-.22;return}if(k.phase==="idle")return;const O=de(k.attackProgress),U=Math.max(0,-O),rt=Math.max(0,O);if(k.weapon==="bow")C.root.rotation.x=-1.2,C.joint.rotation.x=-.15,D.root.rotation.x=.9-rt*.8,D.joint.rotation.x=-.3;else if(k.weapon==="greatsword"){const ft=-1.6*U+1.25*rt,xt=Ie(Number.isFinite(l.stride.heavyScale)?l.stride.heavyScale:1,0,1);D.root.rotation.x=ft,D.joint.rotation.x=-(.25+U*.4),C.root.rotation.x=ft+.06,C.joint.rotation.x=-(.32+U*.4),C.root.rotation.z=.38,g.rotation.y=-.2*O*xt}else{const ft=k.comboIndex;if(ft===1)D.root.rotation.x=-1.7*U+1.1*rt,D.joint.rotation.x=-(.2+U*.5),C.root.rotation.x=.1,g.rotation.y=-.18*O;else if(ft===2)C.root.rotation.x=-1.5*U+1*rt,C.joint.rotation.x=-(.2+U*.5),D.root.rotation.x=.2,g.rotation.y=.45*-O;else{const xt=-1.9*U+1.2*rt;C.root.rotation.x=xt,D.root.rotation.x=xt,C.joint.rotation.x=-(.15+U*.4),D.joint.rotation.x=-(.15+U*.4),g.rotation.y=-.3*O}}an(k)}function A(k,O){k&&(D.root.rotation.x=-1.05,D.joint.rotation.x=-.35,C.root.rotation.x=-.45,C.joint.rotation.x=-.2,g.rotation.y=-.12,Q.orb.scale.setScalar(1.25+.12*Math.sin(O*2)))}function W(k){if(!k||k.phase==="idle")return;const O=k.progress,U=O<.3?-.35+O/.3*1.35:O<.7?1:Math.max(0,1-(O-.7)/.3),rt=Math.PI/180;g.rotation.x+=d.leanDeg*rt*U,C.root.rotation.x-=d.shieldPitchDeg*rt*U,C.joint.rotation.x-=.22*U,D.root.rotation.x-=.3*U,p.position.z+=d.pelvisReach*Math.max(0,U)}return{group:u,update(k,O,U,rt,ft=!1,xt,At,st){se(O.weapon),g.rotation.x=0,g.rotation.z=0,p.position.x=0,p.position.y=x,p.position.z=0,p.rotation.z=0,p.rotation.x=0,g.position.x=0,g.position.y=0,g.position.z=0,_.position.x=0,_.position.y=0,_.position.z=0,_.rotation.z=0;const et=Math.max(1/240,Math.min(rt,.1)),gt=xt===void 0?oe+=rt:xt;Qt=gt;const Wt=l.landing;Wt.enabled?ie&&!k.grounded?(Ge="jump",ze=gt,Y=Wt.anticipationDuration,bt=Math.max(0,Wt.jumpAnticipation),wt=.32):!ie&&k.grounded&&(Ge="land",ze=gt,Y=Wt.duration,bt=SS(ye,Wt),wt=Wt.compressRatio,Jt=ye):(Ge="none",bt=0),gt<ze&&(Ge="none",bt=0),ie=k.grounded,ye=k.velocity.y;const Zt=Md(gt,ze,Y,bt,wt),ae=O.phase!=="idle",ge=(st==null?void 0:st.phase)==="active";ct=_S(ct,ae,et,l.attack.blendRate);const te=yS(ct,l.attack.gaitWeight,l.attack.lowerBodyWeight);yt=te.attackLegWeight,Et=te.gaitScale;const Vt=Math.sin(k.bodyYaw),Pe=Math.cos(k.bodyYaw),re=(k.velocity.x-tt)/et,Ee=(k.velocity.z-ht)/et,vn=Ie(re,-60,60),Ve=Ie(Ee,-60,60),di=vn*Vt+Ve*Pe,_e=Re(k.bodyYaw-j)/et,un=Math.hypot(k.velocity.x,k.velocity.z),jn=o.maxForwardDeg*Math.PI/180,Ye=o.maxSideDeg*Math.PI/180,Rn=Ie(di*o.accelGain,-jn,jn),Cn=Ie(-_e*un*o.turnGain,-Ye,Ye),Ts=1-Math.exp(-o.smoothing*et);Mt+=(Rn-Mt)*Ts,kt+=(Cn-kt)*Ts,tt=k.velocity.x,ht=k.velocity.z,j=k.bodyYaw;const _n=Math.hypot(k.velocity.x,k.velocity.z),Ro=Ie(s.knockGaitScale??0,0,1),sf=U.knockX*Ro,af=U.knockZ*Ro,of=Ro>0&&Math.hypot(U.knockX,U.knockZ)>.001,Co=k.velocity.x+sf,Po=k.velocity.z+af,_l=Math.hypot(Co,Po);_t=_l;const rf=Math.cos(k.bodyYaw),cf=-Math.sin(k.bodyYaw),lf=k.velocity.x*rf+k.velocity.z*cf,yl=_n>os?Ie(lf/_n,-1,1):0,Ml=_n>os?Ie((k.velocity.x*Vt+k.velocity.z*Pe)/_n,-1,1):1,hf=pl(Ml,s.backStrafeStartDeg,s.backStrafeFullDeg);B==="settled"&&Gt&&N>St*1.02+1e-4&&(B="none");let As=1;B==="blend"?(As=$u(Ut?Nt:it,s.stopYawBlendMode,Ut),Ut||(it=Math.min(1,it+et/Math.max(.01,s.stopYawAfterSec)),(it>=1||s.stopYawBlendMode==="inStop"||Gt)&&(B="settled",As=0))):B==="settled"&&(As=Ie(_n/Math.max(os,s.stopEnterRatio*e),0,1)),pt=As;const df=Hu(yl,i.legYawScale,i.hipYawMaxDeg,s.strafeHipBoost),uf=Gu(Ml,yl,df,hf)*As;G+=(uf-G)*(1-Math.exp(-i.hipYawSmoothing*et));const Rs=k.bodyYaw+G;jt=Rs;const ff=Math.sin(Rs),pf=Math.cos(Rs),mf=Math.cos(Rs),gf=-Math.sin(Rs),ca={speed:_l,phase:k.gaitPhase,localForward:Co*ff+Po*pf,localRight:Co*mf+Po*gf,stride:k.stride};ae&&!J&&(Ot=k.gaitPhase),J=ae;const Ni=ct>0?xS(ca,O.attackProgress,O.comboIndex,ct,l.stride,Ot):ca;Xt=Ni;const Sl=Math.max(0,s.stopBlendSec||0),bl=Sl>0&&!ae&&!of&&k.grounded,Do=Vu(_n,at,e,s.stopEnterRatio,s.stopExitRatio);if(!bl||Do.resume)Rt=-1;else if(Rt<0&&Do.enter){Rt=0,Dt=k.gaitPhase,zt=Ou(k.gaitPhase),It=_n,Pt=Math.max(k.stride,os),L=ca.localForward,E=ca.localRight;const be=1/Math.max(os,_n);$=k.velocity.x*be,nt=k.velocity.z*be}const xf=at;at=_n;const ui=bl&&Rt>=0;ui&&(Rt=Math.min(1,Rt+et/Sl)),ui&&B!=="blend"&&(B="blend",it=0),Ut=ui&&Rt<1,Nt=Rt,Gt=Do.resume,N=_n,St=xf;const El=ui?{phase:Dt,speed:It,moveSpeed:e,localForward:L,localRight:E,legLength:n.legLength,stride:Pt,grounded:!0}:{phase:Ni.phase,speed:Ni.speed,moveSpeed:e,localForward:Ni.localForward,localRight:Ni.localRight,legLength:n.legLength,stride:Ni.stride??0,grounded:k.grounded},vf=ui?Bu(El,s,{progress:Rt,phase0:Dt,phaseEnd:zt}):ml(El,s),fe=MS(vf,te.gaitScale);if(q=0,ge&&st){const be=pS(st.progress,st.dir,s),le=te.gaitScale;fe.legL.pitchX+=be.legL.pitchX*le,fe.legL.rollZ+=be.legL.rollZ*le,fe.legL.kneeX+=be.legL.kneeX*le,fe.legR.pitchX+=be.legR.pitchX*le,fe.legR.rollZ+=be.legR.rollZ*le,fe.legR.kneeX+=be.legR.kneeX*le,fe.pelvisY+=be.pelvisY*le,q=be.env}let Lo=0,Io=0,ko=0,wl=0;if(ui){const be=Wu(k.bodyYaw,$,nt),le=Yu(Rt,Dt,be.forward,be.right,s);le.leadLeft?(fe.legL.pitchX-=le.leadPitch,fe.legL.kneeX+=le.leadKnee,fe.legR.pitchX+=le.trailPitch):(fe.legR.pitchX-=le.leadPitch,fe.legR.kneeX+=le.leadKnee,fe.legL.pitchX+=le.trailPitch),Io=le.bodyShift*le.fwdN,Lo=le.bodyShift*le.rightN,ko=le.bodyDip,wl=le.chestPitch,vt=le.leadPitch,$t=le.bodyShift,ot=le.bodyDip}else vt=0,$t=0,ot=0;Kt={lp:fe.legL.pitchX,lr:fe.legL.rollZ,rp:fe.legR.pitchX,rr:fe.legR.rollZ},k.grounded?(I.root.rotation.x=fe.legL.pitchX,z.root.rotation.x=fe.legR.pitchX,I.root.rotation.z=fe.legL.rollZ,z.root.rotation.z=fe.legR.rollZ,I.joint.rotation.x=fe.legL.kneeX,z.joint.rotation.x=fe.legR.kneeX,C.root.rotation.x=fe.armL,D.root.rotation.x=fe.armR,C.joint.rotation.x=-(.18+fe.armL*.2),D.joint.rotation.x=-(.18+fe.armR*.2),C.root.rotation.z=0,D.root.rotation.z=0,p.position.x=fe.pelvisX,p.position.y=x+fe.pelvisY,p.position.z=0,p.rotation.z=fe.pelvisRoll):(I.root.rotation.x=-.55,z.root.rotation.x=-.25,I.joint.rotation.x=.75,z.joint.rotation.x=.55,C.root.rotation.x=-.9,D.root.rotation.x=-.7,C.joint.rotation.x=-.6,D.joint.rotation.x=-.6,I.root.rotation.z=0,z.root.rotation.z=0);const _f=Ju(p,_),Cs=ge?{...f,weight:0}:ui&&f.enabled?{...f,weight:1}:f,Tl=Cs.enabled&&k.grounded&&Cs.weight>0?Ie(Cs.weight,0,1)*(ae?Ie(Cs.attackScale,0,1):1):0;p.position.x+=Lo,p.position.z+=Io,p.position.y-=ko,_.position.y+=ko,Tl<=0&&(_.position.x-=Lo,_.position.z-=Io);const yf=_n/Math.max(e,os),Mf=Number.isFinite(o.crouchSmoothing)?o.crouchSmoothing:8,Sf=1-Math.exp(-Math.max(0,Mf)*et);Lt+=(Ie(yf,0,1)-Lt)*Sf;const zi=Ku({leanForward:Mt,leanSide:kt,speedRatio:Lt},o);p.rotation.x+=zi.pelvisPitch,p.rotation.z+=zi.pelvisRoll,p.position.x+=zi.pelvisX,p.position.z+=zi.pelvisZ,p.position.y-=zi.crouch,_.position.y+=zi.crouch*(1-Ie(Tl,0,1)),dn(O),A(ft,k.gaitPhase),W(At);const bf=a.greatswordPitchDeg*Math.PI/180,Al=O.weapon==="greatsword",Rl=Math.hypot(k.velocity.x,k.velocity.z),Ef=Al&&O.phase==="idle"&&Rl>.5?Math.min(1.15,Rl/Math.max(e,.001)*.9):0;Ct+=(Ef-Ct)*(1-Math.exp(-6*et)),Al&&(H.rotation.x=bf+Ct),O.weapon==="bow"&&(mt.g.rotation.x=-(C.root.rotation.x+C.joint.rotation.x),dt.rotation.x=-(D.root.rotation.x+D.joint.rotation.x));const wf=g.rotation.y;Oe(U,k.bodyYaw);const Cl=U.type==="none"?1:.4;if(g.rotation.x+=Mt*Cl+wl,g.rotation.z+=(kt+fe.sideLean)*Cl,Zt>0&&(I.root.rotation.x-=Wt.hipPitch*Zt,z.root.rotation.x-=Wt.hipPitch*Zt,I.joint.rotation.x+=Wt.kneeBend*Zt,z.joint.rotation.x+=Wt.kneeBend*Zt,p.position.y-=Wt.crouchDepth*Zt,_.position.y+=Wt.crouchDepth*(1-Wt.lowerScale)*Zt,g.rotation.x+=Wt.upperPitch*Zt,C.root.rotation.x-=Wt.armTuck*Zt,D.root.rotation.x-=Wt.armTuck*Zt),yt>0&&k.grounded){const be=vS(O.attackProgress,O.comboIndex,l.stride),le=yt;I.root.rotation.x+=be.legL.pitchX*le,z.root.rotation.x+=be.legR.pitchX*le,I.root.rotation.z+=be.legL.rollZ*le,z.root.rotation.z+=be.legR.rollZ*le,I.joint.rotation.x+=be.legL.kneeX*le,z.joint.rotation.x+=be.legR.kneeX*le,p.position.x+=be.pelvisX*le,p.position.y+=be.pelvisY*le,p.rotation.z+=be.pelvisRoll*le}_.rotation.y=G,lt=Xu(G,s.chestYawScale,s.chestYawMaxDeg),g.rotation.y+=lt;const Tf=wf;T.rotation.y=Re(k.headYaw-k.bodyYaw-Tf-lt),T.rotation.x=-Ie(k.headPitch??0,-.7,.7),g.rotation.x+=-Ie(k.bodyPitch??0,-.4,.4),Ht=Qu({root:u,pelvis:p,lower:_,limbs:X,base:_f,cfg:Cs,grounded:k.grounded,attacking:ae})},lean(){return{forward:Mt,side:kt}},landing(){const k=Md(Qt,ze,Y,bt,wt),O=Y>0?Math.max(0,Y-Math.max(0,Qt-ze)):0;return{pulse:k,remaining:O,kind:k>0?Ge:"none",impactVy:Jt}},hurt(){return Tt},ik(){return Ht},attackBlend(){return ct},attackWeights(){return{gaitScale:Et,attackLegWeight:yt,driveSpeed:Xt.speed,stridePhase:Xt.phase}},hipYaw(){return G},gaitDebug(){return{stopT:Rt,hipYaw:G,chestYaw:lt,speed:at,gaitSpeed:_t,stopStep:vt,stopShift:$t,stopDip:ot,stopYawFade:pt,turnStep:q,legLPitch:Kt.lp,legLRoll:Kt.lr,legRPitch:Kt.rp,legRRoll:Kt.rr}},gaitYaw(){return jt},arrowDirection(){dt.updateWorldMatrix(!0,!1);const k=dt.matrixWorld.elements,O=k[8],U=k[9],rt=k[10],ft=Math.hypot(O,U,rt)||1;return{x:O/ft,y:U/ft,z:rt/ft}},dispose(){u.traverse(k=>{if(k instanceof ce){k.geometry.dispose();const O=k.material;Array.isArray(O)?O.forEach(U=>U.dispose()):O.dispose()}})}}}function qS(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function jS(n,t,e,i){const s=Math.max(1,n.clientWidth),a=Math.max(1,n.clientHeight),o=new bM({antialias:!0});o.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),o.shadowMap.enabled=!0,o.shadowMap.type=jd,o.setSize(s,a,!1),n.appendChild(o.domElement);const r=new EM;r.background=new qt("#12161d"),r.add(new aS(11061486,2764600,1.15));const l=new cS(16773852,1.5);l.position.set(9,18,11),l.castShadow=!0,l.shadow.mapSize.set(1024,1024);const c=l.shadow.camera;c.left=-20,c.right=20,c.top=20,c.bottom=-20,c.near=1,c.far=60,r.add(l);const h=[],f=new ve;for(const Y of t.boxes){const bt=Y.maxX-Y.minX,wt=Y.maxY-Y.minY,Jt=Y.maxZ-Y.minZ;let Yt=qS(Y.kind,e);Y.kind==="step"&&(Yt=new qt(Yt).offsetHSL(0,0,Y.maxY*.09).getStyle());const se=new sa({color:Yt,transparent:!0,opacity:1}),ue=new ce(new An(bt,wt,Jt),se);ue.position.set((Y.minX+Y.maxX)/2,(Y.minY+Y.maxY)/2,(Y.minZ+Y.maxZ)/2),ue.castShadow=Y.kind!=="ground",ue.receiveShadow=!0,ue.add(new Au(new BM(ue.geometry),new ol({color:10467020,transparent:!0,opacity:.32}))),f.add(ue),h.push(se)}r.add(f);const d=t.gridMeta.maxX-t.gridMeta.minX,u=new hS(d,d,4873328,3358797);u.position.y=.002,u.visible=e.showGrid,r.add(u);const p=PS(i,e);r.add(p.group);const _=ZS(e.voxel,e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links),g=new ve,m=.9,x=new ve;x.position.y=m,_.group.position.y=-m,x.add(_.group),g.add(x),r.add(g);const y=t.dummies.map((Y,bt)=>{const wt=e.dummies.colors,Jt=wt[bt%wt.length]??"#cccccc",Yt=CS(e.voxel,e.colors,Jt,Y.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);return Yt.group.traverse(se=>{se.userData.dummyId=Y.id}),r.add(Yt.group),Yt}),v=y.map(Y=>Y.group),P=new lS,S=e.groundRing,w=e.voxel.bodyWidth,T=bd(w,S.playerRadiusFactor),b=bd(w,S.dummyRadiusFactor),M=w*S.thicknessFactor,R=S.arcDeg*Math.PI/180;let F=0;const I=Rr({radius:T,thickness:M,arcRad:R,edgeFade:S.edgeFade,color:S.playerColor,opacity:S.playerOpacity,y:.028,renderOrder:6});I.mesh.name="player-ground-ring",r.add(I.mesh);const z=t.dummies.map(Y=>{const bt=Rr({radius:b,thickness:M,arcRad:R,edgeFade:S.edgeFade,color:S.neutralColor,opacity:S.opacity,y:.022,renderOrder:5});return bt.mesh.name=`dummy-ground-ring-${Y.id}`,r.add(bt.mesh),bt}),C=t.dummies.map(Y=>{const bt=Rr({radius:b*S.haloRadiusFactor,thickness:M*S.haloThicknessFactor,arcRad:R,edgeFade:S.edgeFade,color:S.neutralColor,opacity:0,profile:"glow",y:.019,renderOrder:4});return bt.mesh.name=`dummy-ground-halo-${Y.id}`,r.add(bt.mesh),bt}),D=t.dummies.map(()=>0),X=t.dummies.map(()=>0),H=Ed({radius:T*S.meterRadiusFactor,thickness:M*S.meterThicknessFactor,arcRad:R,edgeFade:.06,color:S.meterColorCharge,y:.03,renderOrder:8});H.mesh.name="player-ground-meter",r.add(H.mesh);const Z=t.dummies.map(Y=>{const bt=Ed({radius:b*S.warnRadiusFactor,thickness:M*S.warnThicknessFactor,arcRad:R,edgeFade:.02,color:S.warnColor,y:.031,renderOrder:9});return bt.mesh.name=`dummy-ground-warn-${Y.id}`,r.add(bt.mesh),bt}),Q=wd({color:S.playerColor,y:.042,renderOrder:3});Q.group.name="player-landing-preview",r.add(Q.group);const mt=new qt,dt=new qt(S.playerColor),ut=new qt(S.neutralColor),K=new qt(S.lowThreatColor),tt=new qt(S.highThreatColor),ht=new qt(S.meterColorCharge),j=new qt(S.meterColorChannel),Mt=new qt(S.meterColorCooldown),kt=new qt(S.warnColor),Ct=new ve;r.add(Ct);const Tt=e.projectiles;function Ht(){const bt=document.createElement("canvas");bt.width=64,bt.height=64;const wt=bt.getContext("2d");if(wt){const Yt=wt.createRadialGradient(32,32,0,32,32,32);Yt.addColorStop(0,"rgba(255,255,255,1)"),Yt.addColorStop(.28,"rgba(255,255,255,0.72)"),Yt.addColorStop(.62,"rgba(255,255,255,0.22)"),Yt.addColorStop(1,"rgba(255,255,255,0)"),wt.fillStyle=Yt,wt.fillRect(0,0,64,64)}const Jt=new Lc(bt);return Jt.colorSpace=je,Jt}function Lt(){const wt=document.createElement("canvas");wt.width=2,wt.height=64;const Jt=wt.getContext("2d");if(Jt){const se=Jt.createLinearGradient(0,0,0,64);se.addColorStop(0,"rgba(255,255,255,0)"),se.addColorStop(.55,"rgba(255,255,255,0.35)"),se.addColorStop(1,"rgba(255,255,255,0.95)"),Jt.fillStyle=se,Jt.fillRect(0,0,2,64)}const Yt=new Lc(wt);return Yt.colorSpace=je,Yt}const G=Ht(),jt=Lt(),Rt=new He({color:12577023,transparent:!0,opacity:0,side:Ae,depthWrite:!1}),Dt=new He({color:14217983,transparent:!0,opacity:0,side:Ae,depthWrite:!1,blending:Ti}),zt=new ve;zt.position.set(0,.95,.72),Ct.add(zt);const It=new ve;It.rotation.x=HS(e.camera.pitchDeg),zt.add(It);const Pt=new Ao(.78,Tt.slashThickness,6,28,Math.PI*1.15),L=new ve,E=new ce(Pt,Rt),$=new ce(Pt,Dt);$.scale.setScalar(1.09),$.renderOrder=4,L.add(E,$),It.add(L);const nt=new An(Tt.arrowWidth,Tt.arrowWidth,Tt.arrowLength),at=new hl(Tt.arrowHeadSize*.42,Tt.arrowHeadSize,4);at.rotateX(Math.PI/2);const lt=new An(Tt.arrowWidth*2.6,Tt.arrowWidth*.4,.1),Ot=new Qs(Tt.arrowWidth*.45,Tt.arrowWidth*1.3,Tt.trailLength,6,1,!0);Ot.rotateX(-Math.PI/2),Ot.translate(0,0,-Tt.trailLength/2);const J=Array.from({length:10},()=>{const Y=new ve,bt=new He({color:Tt.arrowColor,transparent:!0}),wt=new He({color:Tt.arrowHeadColor,transparent:!0}),Jt=new Dc({map:G,color:Tt.arrowColor,transparent:!0,opacity:.85,blending:Ti,depthWrite:!1}),Yt=new He({color:Tt.arrowTrailColor,map:jt,transparent:!0,opacity:0,blending:Ti,depthWrite:!1,side:Ae}),se=new ce(nt,bt),ue=new ce(at,wt);ue.position.z=Tt.arrowLength/2+Tt.arrowHeadSize*.42;const Me=new ce(lt,wt),Oe=new ce(lt,wt);Me.position.z=-Tt.arrowLength/2+.08,Oe.position.z=Me.position.z,Oe.rotation.z=Math.PI/2;const de=new ad(Jt);de.scale.setScalar(Tt.arrowGlowSize),de.renderOrder=6;const an=new ce(Ot,Yt);return an.renderOrder=5,Y.add(se,ue,Me,Oe,de,an),Y.visible=!1,r.add(Y),{group:Y,shaftMat:bt,tipMat:wt,glowMat:Jt,trailMat:Yt,glow:de,trail:an,arrowId:0,bone:null}}),vt=new ul(1,0),$t=new V(Tt.boltShapeX,Tt.boltShapeY,Tt.boltShapeZ),ot=new He({color:Tt.boltColor,transparent:!0,opacity:.98,depthWrite:!1}),_t=new Dc({map:G,color:Tt.boltGlowColor,transparent:!0,opacity:.45,blending:Ti,depthWrite:!1}),B=new He({color:Tt.boltGlowColor,map:jt,transparent:!0,opacity:Tt.trailOpacity,blending:Ti,depthWrite:!1,side:Ae}),it=new Qs(.5,.03,Tt.boltTrailScale,6,1,!0);it.rotateX(-Math.PI/2),it.translate(0,0,-Tt.boltTrailScale/2);const pt=Array.from({length:24},()=>{const Y=new ve,bt=new ce(vt,ot);bt.scale.copy($t);const wt=new ad(_t);wt.scale.setScalar(Tt.boltGlowScale),wt.renderOrder=6;const Jt=new ce(it,B);return Jt.renderOrder=5,Y.add(bt,wt,Jt),Y.visible=!1,r.add(Y),{group:Y,core:bt}}),Ut=Array.from({length:6},()=>{const Y=wd({color:"#9ad0ff",edgeWidthRatio:.038,y:.045,renderOrder:2});return Y.group.visible=!1,r.add(Y.group),Y}),Nt=e.dash,Gt=new ia(Nt.ringRadius-.06,Nt.ringRadius,28),N=Array.from({length:6},()=>{const Y=new He({color:16777215,transparent:!0,opacity:0,side:Ae,depthWrite:!1}),bt=new ce(Gt,Y);return bt.rotation.x=-Math.PI/2,bt.visible=!1,r.add(bt),{mesh:bt,mat:Y,life:0,base:1}});function St(Y,bt,wt,Jt,Yt){const se=N.find(ue=>ue.life<=0)??N[0];se.mat.color.set(Jt),se.mesh.position.set(Y,wt+.04,bt),se.base=Yt,se.mesh.scale.setScalar(Yt*.6),se.mesh.visible=!0,se.mat.opacity=.9,se.life=Nt.fxDuration}const q=e.links,ct=new ia(q.ringRadius-.07,q.ringRadius,28),yt=Array.from({length:5},()=>{const Y=new He({color:q.chargeColor,transparent:!0,opacity:0,side:Ae,depthWrite:!1}),bt=new ce(ct,Y);return bt.rotation.x=-Math.PI/2,bt.visible=!1,r.add(bt),{mesh:bt,mat:Y,life:0,base:1}});function Et(Y,bt,wt,Jt){const Yt=yt.find(se=>se.life<=0)??yt[0];Yt.mesh.position.set(Y,wt+.05,bt),Yt.base=Jt,Yt.mesh.scale.setScalar(Jt*.55),Yt.mesh.visible=!0,Yt.mat.opacity=.85,Yt.life=q.fxDuration}let Xt=t.playerLink.id,Kt=t.playerLink.hitIds.length,oe=t.dash.id,Qt="none";const ie=uS(e.camera,e.smartCamera,e.zoom,s/a),ye=t.character.position;ie.update(ye.x,ye.y,ye.z,1,t.camera);function Ge(Y,bt){if(v.length===0)return 0;const wt=o.domElement.getBoundingClientRect(),Jt=new Bt((Y-wt.left)/wt.width*2-1,-((bt-wt.top)/wt.height)*2+1);P.setFromCamera(Jt,ie.camera);const Yt=P.intersectObjects(v,!0);for(const se of Yt){const ue=se.object.userData.dummyId;if(ue&&ue>0)return ue}return 0}function ze(Y,bt,wt){const Jt=o.domElement.getBoundingClientRect(),Yt=new V(Y,bt,wt).project(ie.camera);return{x:Jt.left+(Yt.x*.5+.5)*Jt.width,y:Jt.top+(-Yt.y*.5+.5)*Jt.height}}return{gaitDebug(){return _.gaitDebug()},render(Y,bt){const wt=Y.character,Jt=Y.combat;g.position.set(wt.position.x,wt.position.y,wt.position.z),g.rotation.y=wt.bodyYaw;const Yt=Y.dash.phase==="active"&&Y.dash.kind==="roll",se=Yt&&Y.dash.duration>0?Math.min(1,1-Y.dash.timer/Y.dash.duration):0;x.rotation.x=Yt?se*Math.PI*2:0,x.position.y=m-(Yt?.2*Math.sin(Math.PI*se):0),_.update(wt,Jt,Y.playerHurt,bt,Y.abilities.channeling,Y.time,Y.playerLink,Y.turnInPlace);for(let st=0;st<y.length;st++)Y.dummies[st]&&y[st].update(Y.dummies[st],bt);const ue=ie.camera.position,Me=Math.atan2(ue.x-wt.position.x,ue.z-wt.position.z),Oe=Y.config.gaze.hurtHoldSec,de=Y.time-Y.playerHurt.lastAt,an=Oe>0&&de>=0&&de<Oe?1-de/Oe:0,dn=IS(Y.gaze.active,Y.gaze.threat,an,Y.time,S);kS(mt,dt,K,tt,dn.level),F=BS(wt.grounded,wt.position.y,F),I.mesh.position.set(wt.position.x,F+.028,wt.position.z),I.update(dn.arcRad,dn.opacity,dn.scale,mt,Me);const A=Y.config.abilities.arcane,W=Math.max(1,Math.floor(A.waves)),k=Math.max(1e-4,A.waveInterval),O=NS({charging:Jt.charging,charge:Jt.charge,channeling:Y.abilities.channeling,fireTimer:Y.abilities.fireTimer,fireInterval:k,channelProgress:Y.abilities.channeling?(Y.abilities.waveIndex+(1-Math.min(1,Math.max(0,Y.abilities.fireTimer/k))))/W:0,arcaneCooldown:Y.abilities.cooldown,arcaneCooldownMax:A.cooldown,dashCooldown:Y.dash.cooldown,dashCooldownMax:Y.dash.kind==="blink"?Y.config.dash.blinkCooldown:Y.config.dash.rollCooldown});H.mesh.position.set(wt.position.x,wt.position.y+.03,wt.position.z),H.set(O.ratio,O.source==="none"?0:S.meterOpacity,O.source==="charge"?ht:O.source==="channel"?j:Mt,Me);const U=Y.playerLink,rt=U.weapon?Y.config.links.moves[U.weapon]:void 0,ft=zS(U.phase,wt.position.x,wt.position.z,U.facing,U.travel,(rt==null?void 0:rt.hit.radius)??.9);Q.set(ft.x,ft.z,.042,ft.radius,ft.active?S.landingOpacity:0,Y.time);for(let st=0;st<z.length;st++){const et=Y.dummies[st],gt=z[st],Wt=C[st],Zt=Z[st];if(!et){gt.mesh.visible=!1,Wt.mesh.visible=!1,Zt.mesh.visible=!1;continue}const ae=Y.targeting.hasTarget&&Y.targeting.targetId===et.id;if(Wp(Y,et)){const Ve=$p(Y,et);mt.copy(K).lerp(tt,Ve)}else mt.copy(ut);const ge=FS(et.attackPhase,et.attackPhaseTimer,Y.config.dummies.attackWindup);ge.active?(mt.lerp(kt,.5*ge.urgency),Zt.mesh.position.set(et.position.x,et.position.y+.031,et.position.z),Zt.set(ge.ratio,S.warnOpacity*(.65+.35*ge.urgency),kt,Me)):Zt.set(0,0,kt,Me);const te=ae?1:0,Vt=te>D[st]?S.haloFadeInSec:S.haloFadeOutSec;D[st]=Td(D[st],te,bt,Vt);const Pe=D[st],re=1+.02*Pe*Math.sin(Y.time*2.2+et.id),Ee=S.arcDeg+(S.selectedArcDeg-S.arcDeg)*Pe;gt.mesh.position.set(et.position.x,et.position.y+.022,et.position.z),gt.update(Ee*Math.PI/180,S.opacity+(S.selectedOpacity-S.opacity)*Pe,1+(S.selectedScale-1)*Pe*re,mt,Me,1+(S.selectedThicknessScale-1)*Pe),X[st]=Td(X[st],te,bt,te>X[st]?S.haloFadeInSec:S.haloFadeOutSec);const vn=X[st];Wt.mesh.position.set(et.position.x,et.position.y+.019,et.position.z),Wt.update(Ee*Math.PI/180,S.haloOpacity*vn*(.88+.12*Math.sin(Y.time*2.2+et.id)),S.selectedScale*(.94+.06*vn)*re,mt,Me)}if(Ct.position.set(wt.position.x,wt.position.y,wt.position.z),Ct.rotation.y=Jt.phase!=="idle"?Jt.attackFacing:wt.bodyYaw,Y.dash.id!==oe){oe=Y.dash.id;const st=Y.dash;Qt=st.kind,st.kind==="blink"?(St(st.fromX,st.fromZ,wt.position.y,Nt.blinkColor,.9),St(st.toX,st.toZ,wt.position.y,Nt.blinkColor,1.35)):St(st.fromX,st.fromZ,wt.position.y,Nt.rollColor,1.1)}for(const st of N){if(st.life<=0)continue;st.life-=bt;const et=Math.max(0,st.life/Nt.fxDuration);st.mat.opacity=.9*et,st.mesh.scale.setScalar(st.base*(.6+(1-et)*1.2)),st.life<=0&&(st.mesh.visible=!1)}const xt=Y.playerLink;xt.id!==Xt&&(Xt=xt.id,Kt=xt.hitIds.length,Et(wt.position.x,wt.position.z,wt.position.y,1)),xt.hitIds.length>Kt?(Kt=xt.hitIds.length,Et(wt.position.x,wt.position.z,wt.position.y,1.35)):xt.hitIds.length<Kt&&(Kt=xt.hitIds.length);for(const st of yt){if(st.life<=0)continue;st.life-=bt;const et=Math.max(0,st.life/Math.max(q.fxDuration,1e-6));st.mat.opacity=.85*et,st.mesh.scale.setScalar(st.base*(.55+(1-et)*1.1)),st.life<=0&&(st.mesh.visible=!1)}const At=Jt.phase==="active"&&Jt.comboIndex>0;Rt.opacity=At?.9:0,Dt.opacity=At?Tt.slashGlowOpacity:0,At&&(L.rotation.z=-1.2+Jt.attackProgress*3.2,L.scale.setScalar(.9+Jt.comboIndex*.13));for(let st=0;st<pt.length;st++){const et=Y.abilities.projectiles[st],gt=pt[st];gt.group.visible=!!et,et&&(gt.group.position.set(et.x,et.y,et.z),gt.group.scale.setScalar(et.radius),gt.group.rotation.set(0,Math.atan2(et.dirX,et.dirZ),0))}for(let st=0;st<Ut.length;st++){const et=Y.abilities.rings[st],gt=Ut[st];if(!et){gt.group.visible=!1;continue}const Wt=Math.max(0,Math.min(1,et.life/Math.max(et.duration,1e-6))),Zt=OS(Math.max(0,et.duration-et.life),S.areaExpandSec);gt.set(et.x,et.z,.045,et.radius*Zt.scale,S.areaOpacity*(.35+.65*Wt)*Zt.alpha,Y.time)}for(let st=0;st<J.length;st++){const et=Y.arrows[st],gt=J[st];if(!et){gt.group.visible=!1,gt.bone&&(r.attach(gt.group),gt.bone=null),gt.arrowId=0;continue}const Wt=et.stuck&&et.stuckDummy>=0;if(gt.arrowId!==et.id){if(gt.bone&&(r.attach(gt.group),gt.bone=null),gt.arrowId=et.id,gt.group.position.set(et.x,et.y,et.z),gt.group.rotation.set(et.pitch,et.yaw,0,"YXZ"),Wt){const ae=y[et.stuckDummy],ge=ae?ae.boneAtWorld(et.x,et.y,et.z):null;ge&&(ge.node.attach(gt.group),gt.bone=ge.node)}}else gt.bone||(gt.group.position.set(et.x,et.y,et.z),gt.group.rotation.set(et.pitch,et.yaw,0,"YXZ"));gt.group.visible=!0;const Zt=et.stuck?Math.min(1,et.rest/.6):1;gt.shaftMat.opacity=Zt,gt.tipMat.opacity=Zt,gt.glowMat.opacity=(et.stuck?.28:.85)*Zt,gt.trailMat.opacity=et.stuck?0:Tt.trailOpacity*Zt,gt.trail.visible=!et.stuck}ie.update(wt.position.x,wt.position.y,wt.position.z,bt,Y.camera),o.render(r,ie.camera)},resize(){const Y=Math.max(1,n.clientWidth),bt=Math.max(1,n.clientHeight);o.setSize(Y,bt,!1),ie.resize(Y/bt)},getGroundBasis(){return ie.getGroundBasis()},setCollidersVisible(Y){for(const bt of h)bt.opacity=Y?.3:1,bt.wireframe=Y,bt.needsUpdate=!0},setGridVisible(Y){u.visible=Y},setLabVisible(Y){p.setVisible(Y)},setLabLabelsVisible(Y){p.setLabelsVisible(Y)},snapCamera(Y,bt,wt){ie.snap(Y,bt,wt)},setZoom(Y){ie.setZoom(Y)},pickDummy:Ge,projectToScreen:ze,diagnostics(){const Y=nf(e.camera.pitchDeg),bt=GS(Y,Ct.rotation.y);return{lean:_.lean(),slashNormal:bt,arrowForward:_.arrowDirection(),gait:{hipYaw:_.hipYaw(),gaitYaw:_.gaitYaw()},attackBlend:_.attackBlend(),attackWeights:_.attackWeights(),landing:_.landing(),hurt:_.hurt(),ik:_.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:x.rotation.x,activeRings:N.filter(wt=>wt.life>0).length,lastKind:Qt},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...ie.smart()}}},dispose(){_.dispose(),p.dispose();for(const Y of y)Y.dispose();I.dispose();for(const Y of z)Y.dispose();for(const Y of C)Y.dispose();H.dispose();for(const Y of Z)Y.dispose();Q.dispose(),Pt.dispose(),Rt.dispose(),Dt.dispose(),vt.dispose(),ot.dispose(),_t.dispose(),B.dispose(),it.dispose();for(const Y of Ut)Y.dispose();nt.dispose(),at.dispose(),lt.dispose(),Ot.dispose();for(const Y of J)Y.shaftMat.dispose(),Y.tipMat.dispose(),Y.glowMat.dispose(),Y.trailMat.dispose();G.dispose(),jt.dispose();for(const Y of N)Y.mat.dispose();Gt.dispose();for(const Y of yt)Y.mat.dispose();ct.dispose(),f.traverse(Y=>{Y instanceof ce&&Y.geometry.dispose()}),o.dispose(),o.domElement.remove()}}}async function KS(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function JS(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),s=document.createElement("a");s.href=i,s.download=n,s.rel="noopener",document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function QS(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=x=>e.querySelector(`#${x}`),s=i("diag-status"),a=i("diag-text"),o=i("diag-copy"),r=i("diag-json"),l=i("diag-clear"),c=i("diag-toggle"),h=i("diag-close"),f=i("diag-mask");let d=!1,u=!0,p=0;function _(){const x=n.status();s.textContent=x.enabled?`已记录 ${x.durationS.toFixed(1)}s · ${x.frames} 帧 · 事件 ${x.events} · 异常 ${x.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",c.textContent=x.enabled?"暂停记录":"继续记录"}function g(x){d=x,e.hidden=!x,x?_():a.hidden=!0}function m(x){o.textContent=x,window.clearTimeout(p),p=window.setTimeout(()=>{o.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",x=>{x.preventDefault(),x.stopPropagation(),g(!d)}),h.addEventListener("click",()=>g(!1)),f.addEventListener("click",()=>g(!1)),o.addEventListener("click",()=>{const x=n.summary();KS(x).then(y=>{y?(m("已复制 ✓"),a.hidden=!0):(a.value=x,a.hidden=!1,a.focus(),a.select(),m("请长按全选复制"))})}),r.addEventListener("click",()=>{const x=n.dump(),y=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);JS(`harness-${x.meta.version}-${y}.json`,JSON.stringify(x)),m("已导出")}),l.addEventListener("click",()=>{n.clear(),a.hidden=!0,_(),m("已清空")}),c.addEventListener("click",()=>{u=!u,n.setEnabled(u),_()}),{tick(){const x=n.status();t==null||t.classList.toggle("is-alert",x.alert),d&&_()},isOpen:()=>d,close:()=>g(!1)}}const tb={intents:{...Ad},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function eb(){const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=Zp(Rm,ua),i=jS(n,e,on,ua.stations),s=jp(e),a=r0(t),o=c0(t),r=document.getElementById("version-badge");r&&(r.textContent="v0.9.40 · 11-07 20:31 · 诊断");const l=F=>String(F).padStart(2,"0"),c=new Date,h=bm({meta:{version:"v0.9.40",buildTime:"11-07 20:31",startedAt:`${l(c.getMonth()+1)}-${l(c.getDate())} ${l(c.getHours())}:${l(c.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),f=QS(h,r),d=s0({deadZone:()=>on.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0});document.addEventListener("visibilitychange",()=>{document.hidden&&h.suspend(800)});const u={timeScale:1,paused:!1,showColliders:on.showColliders,showGrid:on.showGrid,showLab:on.lab.enabled,showLabLabels:on.lab.showLabels};let p=1;const _=um({maxRadiusPx:()=>on.joystick.maxRadiusPx,deadZone:on.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>on.zoom}),g=Array.from(document.querySelectorAll(".wp[data-weapon]"));let m=e.combat.weapon;function x(F){if(F===m)return;m=F;const I=Li.indexOf(F)+1;for(const z of g)z.classList.toggle("is-active",Number(z.dataset.weapon)===I);S.refreshWeapon()}let y=tb,v=0;const P=()=>{p=1,i.setZoom(1)},S=Hm(e,on,u,{singleStep:()=>s.singleStep(y.intents),reset:()=>{p=1,s.singleStep({...Ad,resetPressed:!0})},resetZoom:P,onToggleColliders:F=>i.setCollidersVisible(F),onToggleGrid:F=>i.setGridVisible(F),onToggleLab:F=>i.setLabVisible(F),onToggleLabLabels:F=>i.setLabLabelsVisible(F)}),w=Xm({stations:ua.stations??[],world:e,view:i,onResetZoom:P});o.register({motion:d,debug:S.gui}),window.addEventListener("resize",()=>i.resize()),window.__harness={world:e,view:i,clock:s,input:_,viewConfig:on,debug:u,getUserZoom:()=>p,getGestures:()=>y.gestures,getLastGesture:()=>y.lastGesture,telemetry:h,telemetrySummary:()=>h.summary(),dirDebug:d.dirDebug,dirAngles:()=>d.dirDebug.last(),motionDebug:d,speedDebug:()=>d.last(),speedSamples:()=>d.samples(),gaitDebug:()=>i.gaitDebug(),lab:{stations:ua.stations??[],goto:F=>w.goto(F),current:()=>w.current(),recall:()=>w.recall()}};let T=performance.now(),b=60,M=0;function R(F){const I=Math.min((F-T)/1e3,.1);T=F,I>0&&(b=b*.9+1/I*.1);const z=_.sample();z.intents.resetPressed&&(p=1),p=nm(p,z.zoomScale,on.zoom.min,on.zoom.max),i.setZoom(p);let C=z.intents.dummyClickId;if(z.tap){const H=i.pickDummy(z.tap.x,z.tap.y);H>0&&(C=H)}C>0&&(v=C),y={...z,intents:{...z.intents,dummyClickId:v}};const D=s.frame(I,y.intents,u.timeScale,u.paused,()=>{const H=e.events;for(let Z=0;Z<H.length;Z++)h.event(H[Z],e.time)});D>0&&(v=0),h.sample(e,y,I*1e3,D);for(const H of y.gestures)h.gesture(H);F-M>250&&(M=F,f.tick()),x(e.combat.weapon),i.render(e,I),w.tick(),d.update(e,y,i.getGroundBasis());const X=i.diagnostics();a.update(e,b,D,y,u,{attackBlend:X.attackBlend,attackWeights:X.attackWeights,landing:X.landing,hurt:X.hurt,ik:X.ik,zoom:X.camera.zoom},o.hudCompact()),requestAnimationFrame(R)}requestAnimationFrame(R)}eb();

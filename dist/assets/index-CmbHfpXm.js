(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(s){if(s.ep)return;s.ep=!0;const a=e(s);fetch(s.href,a)}})();const ns=["sword-shield","dual-swords","greatsword","staff","bow"],mr=["wander","follow","keep-distance","attack","idle"],lu={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},Lo=1e-6;function _a(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Lo?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>Lo?Math.atan2(t.moveX,t.moveZ):n.character.facing}function gp(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Lo){const s=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/s,z:t.aimZ/s}}const e=Math.hypot(t.moveX,t.moveZ);if(e>Lo)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const kn=1e-6,hc=Math.PI/180,vl=-1e9;function hu(){return{type:"none",lastAt:vl,timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function dc(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function dh(n,t,e,i,s){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=s,n.knockX=0,n.knockZ=0}function _l(n,t,e){const i=e.duration>0?e.duration:yl(n,e.type);if(t.kind==="player"){const a=n.playerHurt;if(dh(a,e.type,i,e.dirX,e.dirZ),a.lastAt=n.time,!n.config.hits.noDamageToPlayer&&e.knockback>kn){const o=e.knockback*n.config.hits.knockbackDecay;a.knockX=e.dirX*o,a.knockZ=e.dirZ*o}dc(n,"player-hurt",e.sourceId??0,n.character.position);return}const s=n.dummies[t.index];if(s){if(dh(s.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>kn){const a=e.knockback*n.config.hits.knockbackDecay;s.hurt.knockX=e.dirX*a,s.hurt.knockZ=e.dirZ*a}n.hitCount+=1,dc(n,"hit",s.id,s.position)}}function $o(n,t,e){_l(n,{kind:"dummy",index:t},e)}function xp(n,t){const e=[n.playerHurt];for(const s of n.dummies)e.push(s.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const s of e)s.timer>0&&(s.timer=Math.max(0,s.timer-t),s.timer===0&&(s.type="none",s.knockX=0,s.knockZ=0)),(s.knockX!==0||s.knockZ!==0)&&(s.knockX*=i,s.knockZ*=i,Math.abs(s.knockX)<1e-4&&(s.knockX=0),Math.abs(s.knockZ)<1e-4&&(s.knockZ=0))}function yl(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function vp(n){const t=n.combat,e=n.config.hits,i=n.character.position;if(t.weapon==="bow")return;const s=e.reach[t.weapon]??0,a=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*hc),o=Math.sin(t.attackFacing),r=Math.cos(t.attackFacing),l=n.config.dummies.radius,c=n.config.targeting.idealRange;for(const h of n.dummies){const f=h.position.x-i.x,d=h.position.z-i.z,u=Math.hypot(f,d);if(u>s+l)continue;const m=u>kn?f/u:o,y=u>kn?d/u:r;if(u>kn&&(f*o+d*r)/u<a)continue;let g="light";t.weapon==="greatsword"?g="knock":t.comboIndex>=3&&(g="heavy");const p=e.knockback[t.weapon]??0;let x=u;p>0&&(x=Math.max(u+p,c));const _=Math.max(0,x-u);$o(n,n.dummies.indexOf(h),{type:g,duration:yl(n,g),dirX:m,dirZ:y,knockback:_})}}function _p(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const s=i.weapon===""?void 0:e.moves[i.weapon];if(!s||!s.enabled||!n.modules.hits||!n.modules.dummies)return;const a=s.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(a.pulseInterval,0);const o=n.character.position,r=i.fromX,l=i.fromZ,c=o.x,h=o.z,f=c-r,d=h-l,u=f*f+d*d,m=Math.sin(i.facing),y=Math.cos(i.facing),g=Math.cos(uh(a.arcDeg,0,180)*hc),p=n.config.dummies.radius;for(let x=0;x<n.dummies.length;x++){const _=n.dummies[x];if(i.hitIds.indexOf(_.id)>=0)continue;const v=u>kn?uh(((_.position.x-r)*f+(_.position.z-l)*d)/u,0,1):0,R=r+f*v,w=l+d*v,S=Math.hypot(_.position.x-R,_.position.z-w);let T=!1;if(a.shape==="circle")T=S<=a.radius+p;else if(a.shape==="capsule")T=S<=Math.max(a.radius,a.width)+p;else{const N=_.position.x-c,L=_.position.z-h,D=Math.hypot(N,L),B=D>kn?(N*m+L*y)/D>=g:!0;T=D<=a.radius+p&&B||S<=a.width+p}if(!T)continue;const b=_.position.x-r,M=_.position.z-l,C=Math.hypot(b,M);if(C>kn&&(b*m+M*y)/C<Math.cos(Math.max(a.arcDeg,90)*hc))continue;const I=C>kn?b/C:m,k=C>kn?M/C:y;_l(n,{kind:"dummy",index:x},{type:a.type,duration:a.duration,dirX:I,dirZ:k,knockback:a.knockback}),i.hitIds.push(_.id),dc(n,"link-hit",_.id,_.position)}}function yp(n){const t=n.config.hits,e=n.character.position;for(const i of n.events){if(i.type!=="dummy-hit")continue;const s=n.dummies[i.value-1];if(!s)continue;const a=e.x-s.position.x,o=e.z-s.position.z,r=Math.hypot(a,o);if(r>t.dummyReach)continue;const l=r>kn?a/r:0,c=r>kn?o/r:1;_l(n,{kind:"player"},{type:"light",duration:yl(n,"light"),dirX:l,dirZ:c,knockback:t.dummyKnockback,sourceId:s.id})}}function Mp(n,t){if(!n.modules.hits)return;n.events.some(i=>i.type==="attack-active")&&vp(n),_p(n,t),yp(n)}function uh(n,t,e){return n<t?t:n>e?e:n}const du=Math.PI/180,Ml=1e-6;function Sp(){return{phase:"idle",fromYaw:0,targetYaw:0,dir:1,progress:0,armTime:0}}function Do(n){const t=n.turnInPlace;t.phase="idle",t.fromYaw=0,t.targetYaw=0,t.dir=1,t.progress=0,t.armTime=0}function uu(n,t,e){return n.modules.gaze&&n.gaze.active?n.gaze.centroidYaw:t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Ml?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:null}function fu(n,t,e){const i=n.character,s=Math.hypot(i.velocity.x,i.velocity.z),a=Math.hypot(t.moveX,t.moveZ),o=n.combat.phase!=="idle"||n.combat.charging||n.abilities.channeling||n.dash.phase!=="idle"||n.playerLink.phase!=="idle"||n.playerHurt.type!=="none"||t.attackPressed||t.attackHeld||t.skill2Pressed||t.sprintPressed||t.jumpPressed;return i.grounded&&s<=Math.max(0,e.idleSpeedRatio)*Math.max(n.config.moveSpeed,Ml)&&a<=Math.max(0,e.inputDeadZone)&&!o}function bp(n){const t=n<0?0:n>1?1:n;return t*t*(3-2*t)}function wp(n,t){const e=n.config.turnInPlace;if(!e.enabled||!n.modules.turnInPlace||!fu(n,t,e))return!1;const i=uu(n,t,e.lookRange);if(i===null)return!1;const s=Oe(i-n.character.bodyYaw);return Math.abs(s)>pu(n,e)}function pu(n,t){const i=n.modules.gaze&&n.gaze.active?Math.max(t.triggerDeg,t.gazeTriggerDeg):t.triggerDeg;return Math.max(0,i)*du}function Ep(n,t,e){const i=n.turnInPlace,s=n.config.turnInPlace;if(!s.enabled||!n.modules.turnInPlace||!fu(n,e,s)){Do(n);return}const a=uu(n,e,s.lookRange);if(a===null){Do(n);return}const o=n.character,r=Oe(a-o.bodyYaw),l=Math.abs(r),c=pu(n,s),h=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Ml;if(i.phase==="idle"&&(i.armTime=l>=c?i.armTime+t:0,l>c&&i.armTime>=Math.max(0,s.armSec))){i.phase="active",i.fromYaw=o.bodyYaw,i.dir=r>=0?1:-1;const f=Math.min(l,Math.max(0,s.settleDeg)*du);i.targetYaw=Oe(o.bodyYaw+i.dir*(l-f)),i.progress=0}if(i.phase==="active"){const f=Math.max(s.durationSec,n.config.fixedDt);i.progress=Math.min(1,i.progress+t/f);const d=Oe(i.targetYaw-i.fromYaw);o.bodyYaw=Oe(i.fromYaw+d*bp(i.progress)),h||(o.facing=o.bodyYaw),i.progress>=1&&(i.phase="idle",i.progress=0,i.armTime=0)}}const Ci=1e-6;function Oe(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Ua(n,t,e,i){const s=Oe(t-n);return n+s*(1-Math.exp(-Math.max(e,Ci)*i))}function za(n,t,e,i,s){const o=Oe(t-n)*(1-Math.exp(-Math.max(e,Ci)*s)),r=Math.max(i,0)*s;return r<=Ci?n:n+Ls(o,-r,r)}function fh(n,t,e,i,s){const a=(t-n)*(1-Math.exp(-Math.max(e,Ci)*s)),o=Math.max(i,0)*s;return o<=Ci?n+a:n+Ls(a,-o,o)}function Ls(n,t,e){return n<t?t:n>e?e:n}function ph(n,t,e,i){const s=Oe(t-n),a=Math.abs(s);return a<=i||a<=e?t:Oe(n+Math.sign(s)*Math.max(e,0))}function Tp(n,t,e){const i=n.character,s=n.config.orientation,a=n.combat,o=n.modules.gaze&&n.gaze.active,r=n.abilities.channeling,l=a.phase!=="idle"||a.charging||r||n.dash.phase!=="idle",c=o&&!l,h=Math.hypot(e.moveX,e.moveZ),f=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Ci,d=a.charging&&a.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(a.phase!=="idle")i.facing=a.attackFacing;else if(r)i.facing=_a(n,e);else if(c)i.facing=za(i.facing,n.gaze.centroidYaw,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t);else if(f)i.facing=_a(n,e);else if(d)i.facing=n.targeting.targetYaw;else if(h>Math.max(s.facingDeadZone,Ci)){const M=Math.atan2(e.moveX,e.moveZ),C=s.facingTurnRate*Math.PI/180*t,I=s.facingSnapDeg*Math.PI/180;if(h>=.35)i.facing=ph(i.facing,M,C,I);else if(h>=s.facingMinMagnitude&&Math.abs(Oe(M-i.facing))>s.facingDeadbandDeg*Math.PI/180){const N=Ua(i.facing,M,s.facingSmoothRate,t);i.facing=ph(i.facing,N,C,0)}}const u=i.velocity;Math.hypot(u.x,u.z)>.15&&(i.moveYaw=Math.atan2(u.x,u.z));const m=c?n.gaze.centroidYaw:i.facing;n.turnInPlace.phase==="active"||wp(n,e)||(c?i.bodyYaw=za(i.bodyYaw,m,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t):i.bodyYaw=Ua(i.bodyYaw,m,s.bodyTurnRate,t));const g=n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;let p=i.facing;if(o?p=c?n.gaze.mainYaw:i.facing:f?p=Math.atan2(e.aimX,e.aimZ):g&&(p=n.targeting.targetYaw),!o){const M=n.config.gaze.headLookLimitDeg*Math.PI/180;Math.abs(Oe(p-i.bodyYaw))>M&&(p=i.moveYaw)}const x=o||f||g,_=s.maxHeadTurnDeg*Math.PI/180;let v;if(x){const M=c?n.config.gaze.headTurnRate:s.headTurnRate;v=c?za(i.headYaw,p,M,n.config.gaze.maxHeadSpeedDeg*Math.PI/180,t):Ua(i.headYaw,p,M,t)}else{const M=Oe(i.headYaw-i.bodyYaw),C=Oe(p-i.bodyYaw),I=Math.abs(C)<Math.abs(M)-1e-9,k=I?n.config.gaze.headReturnRate:s.headTurnRate,N=I?n.config.gaze.headReturnSpeedDeg*Math.PI/180:Number.POSITIVE_INFINITY,L=Number.isFinite(N)?za(M,C,k,N,t):Ua(M,C,k,t);v=i.bodyYaw+L}const R=Oe(v-i.bodyYaw);R>_?v=i.bodyYaw+_:R<-_&&(v=i.bodyYaw-_),i.headYaw=v;const w=n.config.gaze;let S=0;if(c)S=n.gaze.mainPitch;else if(n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget){const M=n.dummies[n.targeting.targetId-1];if(M){const C=i.position.y+n.config.characterHeight*Ls(w.eyeHeightRatio,0,1),I=M.position.y+n.config.dummies.height*Ls(w.aimHeightRatio,0,1),k=Math.hypot(M.position.x-i.position.x,M.position.z-i.position.z);S=Math.atan2(I-C,Math.max(Ci,k))}}const T=Math.max(0,w.maxHeadPitchDeg)*Math.PI/180;S=Ls(S,-T,T);const b=x?w.headPitchRate:Math.min(w.headPitchRate,w.headReturnRate);i.headPitch=fh(i.headPitch,S,b,Math.max(0,w.maxHeadPitchDeg)*4*Math.PI/180,t),i.bodyPitch=fh(i.bodyPitch,i.headPitch*Ls(w.bodyPitchScale,0,1),w.bodyPitchRate,Math.max(0,w.maxHeadPitchDeg)*Math.PI/180,t)}const mu=1e-6,Yo=Math.PI/180;function Zo(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Ap(n,t,e){const i=n.character.position,s=Math.max(0,e.homingConeDeg)*Yo,a=Math.max(0,e.homingRange),o=[];for(let r=0;r<n.dummies.length;r++){const l=n.dummies[r],c=l.position.x-i.x,h=l.position.z-i.z,f=Math.hypot(c,h);f<.001||f>a||Math.abs(Oe(Math.atan2(c,h)-t))>s||o.push({i:r,d:f})}return o.sort((r,l)=>r.d-l.d||r.i-l.i),o.map(r=>r.i)}function Rp(n,t){const e=Math.sin((n+1)*12.9898+(t+1)*78.233)*43758.5453;return e-Math.floor(e)}function Cp(n,t){const e=n.abilities,i=n.character.position,s=Math.max(1,Math.floor(t.perWave)),a=t.spreadDeg*Yo,o=Math.max(0,t.spawnSideStep),r=Math.max(0,Math.min(1,t.speedJitter)),l=Ap(n,e.channelYaw,t);for(let c=0;c<s;c++){const h=(c-(s-1)*.5)*a,f=e.channelYaw+h,d=(c-(s-1)*.5)*o,u=Math.sin(f),m=Math.cos(f);e.pending.push({delay:c*Math.max(0,t.spawnDelay),x:i.x+u*.5+Math.cos(f)*d,y:i.y+1,z:i.z+m*.5-Math.sin(f)*d,yaw:f,speed:t.speed*(1+(Rp(e.waveIndex,c)*2-1)*r),targetIndex:l.length>0?l[c%l.length]:-1,wave:e.waveIndex})}Zo(n,"arcane-wave",e.waveIndex,{x:i.x,y:i.y+1,z:i.z})}function Pp(n,t,e){const i=n.abilities;if(i.pending.length===0)return;const s=[];for(const a of i.pending){if(a.delay-=t,a.delay>0){s.push(a);continue}const o={id:++i.nextId,x:a.x,y:a.y,z:a.z,dirX:Math.sin(a.yaw),dirZ:Math.cos(a.yaw),speed:a.speed,life:e.life,radius:e.radius,targetIndex:a.targetIndex,turnRate:Math.max(0,e.turnRateDeg)*Yo,homing:Math.max(0,e.homingTime),spread:Math.max(0,e.spreadTime),retarget:0,wave:a.wave};i.projectiles.push(o),i.volleyId+=1,Zo(n,"projectile-fire",i.volleyId,o)}i.pending=s}function mh(n,t){const e=n.abilities;e.channeling&&(e.channeling=!1,e.fireTimer=0,e.cooldown=Math.max(0,t.cooldown),e.channelMoveScale=1,e.needsRelease=!0,Zo(n,"channel-end",0,n.character.position))}function Lp(n,t,e,i,s,a){const o=n.abilities,r=n.dash.phase==="active",l=n.playerLink,c=a==="skill2"?e.skill2Pressed:e.attackHeld,h=s&&c&&!r&&l.phase==="idle"&&!l.consumedAttack;if(o.cooldown>0&&(o.cooldown=Math.max(0,o.cooldown-t)),o.needsRelease&&!h&&(o.needsRelease=!1),o.channeling){if(!h){mh(n,i);return}}else{if(!(h&&!o.needsRelease&&o.cooldown<=0))return;o.channeling=!0,o.channelId+=1,o.waveIndex=0,o.fireTimer=0,o.channelMoveScale=Math.max(0,Math.min(1,i.moveScale)),Zo(n,"channel-start",o.channelId,n.character.position)}o.channelYaw=_a(n,e),o.fireTimer-=t;let f=0;for(;o.fireTimer<=0&&f++<8;)if(o.fireTimer+=Math.max(i.waveInterval,mu),Cp(n,i),o.waveIndex+=1,o.waveIndex>=Math.max(1,Math.floor(i.waves))){mh(n,i);break}}function Dp(n,t,e){const i=Math.max(0,e.homingConeDeg)*Yo,s=Math.max(0,e.homingRange),a=Math.atan2(t.dirX,t.dirZ);let o=-1,r=s+mu;for(let l=0;l<n.dummies.length;l++){const c=n.dummies[l],h=c.position.x-t.x,f=c.position.z-t.z,d=Math.hypot(h,f);d<.001||d>r||Math.abs(Oe(Math.atan2(h,f)-a))>i||(o=l,r=d)}return o}function kp(n,t,e){const i=n.abilities,s=n.config.dummies.radius,a=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.projectiles){if(r.spread>0)r.spread=Math.max(0,r.spread-t);else if(r.homing>0&&(r.homing=Math.max(0,r.homing-t)),r.retarget-=t,r.retarget<=0&&(r.retarget=Math.max(.05,e.retargetInterval),r.targetIndex=Dp(n,r,e)),r.targetIndex>=0&&r.turnRate>0&&r.homing>0){const c=n.dummies[r.targetIndex];if(!c)r.targetIndex=-1;else{const h=Math.atan2(c.position.x-r.x,c.position.z-r.z),f=Math.atan2(r.dirX,r.dirZ),d=Oe(h-f),u=r.turnRate*t,m=Math.max(-u,Math.min(u,d)),y=f+m;r.dirX=Math.sin(y),r.dirZ=Math.cos(y)}}if(r.x+=r.dirX*r.speed*t,r.z+=r.dirZ*r.speed*t,r.life-=t,r.life<=0)continue;let l=!1;if(a)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],f=h.position.x-r.x,d=h.position.z-r.z,u=r.radius+s;if(!(f*f+d*d>u*u)){$o(n,c,{type:e.hurtType,duration:e.hurtDuration,dirX:r.dirX,dirZ:r.dirZ,knockback:e.knockback}),l=!0;break}}l||o.push(r)}i.projectiles=o}const Ip={kind:"channelVolley",update({world:n,dt:t,intents:e,skill:i,onWeapon:s}){const a=i.params;Lp(n,t,e,a,s,i.cfg.slot),Pp(n,t,a),kp(n,t,a)}},gr=1e-6;function gu(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Fp(n,t){const e=n.character.position,i={id:++n.abilities.nextId,x:e.x,z:e.z,radius:t.radius,life:t.duration,duration:t.duration,pulseTimer:0};n.abilities.rings.push(i),gu(n,"ring-place",i.id,e)}function Up(n,t,e){const i=n.abilities,s=n.config.dummies.radius,a=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.rings){r.life-=t,r.pulseTimer-=t;let l=0;for(;r.pulseTimer<=0&&l++<8;){if(r.pulseTimer+=Math.max(e.pulseInterval,gr),a)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],f=h.position.x-r.x,d=h.position.z-r.z,u=r.radius+s;if(f*f+d*d>u*u)continue;const m=Math.hypot(f,d),y=m>gr?f/m:0,g=m>gr?d/m:1;$o(n,c,{type:"heavy",duration:e.stun,dirX:y,dirZ:g,knockback:e.knockback})}gu(n,"ring-pulse",r.id,{x:r.x,y:0,z:r.z})}r.life>0&&o.push(r)}i.rings=o}const zp={kind:"groundRing",update({world:n,dt:t,intents:e,skill:i,onWeapon:s}){const a=i.params,o=i.cfg.slot==="attack"?e.attackPressed:e.skill2Pressed;s&&o&&n.dash.phase!=="active"&&n.playerLink.phase==="idle"&&Fp(n,a),Up(n,t,a)}},Np={channelVolley:Ip,groundRing:zp};function Op(n){const t=Array.isArray(n.skills)?n.skills:[],e=n.abilities;return t.map(i=>{if(i.params)return{cfg:i,params:i.params};const s=i.paramsRef,a=s?e[s]:void 0;if(!a||typeof a!="object")throw new Error(`[skills] ${i.id}: paramsRef "${s??""}" 在 core.abilities 中不存在`);return{cfg:i,params:a}})}function Bp(n,t,e){for(const i of n.skills){if(i.cfg.enabled===!1)continue;const s=Np[i.cfg.kind];if(!s)continue;const a=!i.cfg.weapon||n.combat.weapon===i.cfg.weapon;s.update({world:n,dt:t,intents:e,skill:i,onWeapon:a})}}function Hp(){return{channeling:!1,channelYaw:0,fireTimer:0,waveIndex:0,cooldown:0,needsRelease:!1,channelId:0,channelMoveScale:1,volleyId:0,pending:[],projectiles:[],rings:[],nextId:0}}function xu(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.waveIndex=0,t.cooldown=0,t.needsRelease=!1,t.channelMoveScale=1,t.pending.length=0,t.projectiles.length=0,t.rings.length=0}function Gp(n,t,e){Bp(n,t,e)}function xr(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const gh=1e-6;function xh(n,t,e){return n<t?t:n>e?e:n}function vu(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function _u(n){const t=n.camera,e=vu();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function Vp(n){const t=n.camera,e=n.config.camera,i=n.character.position;let s=0,a=0,o=0,r=0;for(const c of n.dummies){const h=c.position.x-i.x,f=c.position.z-i.z,d=Math.hypot(h,f);if(d>e.radius)continue;const u=xh((e.radius-d)/Math.max(gh,e.radius-e.nearDistance),0,1);let m=u*(e.modeWeight[c.mode]??.5);c.attackPhase==="active"&&(m+=e.attackBoost*u),s+=m,a+=c.position.x*m,o+=c.position.z*m,r+=1}const l=s<=0?0:xh(s/(s+Math.max(gh,e.saturation)),0,1);if(t.threat=l,t.threatCount=r,s<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const c=a/s,h=o/s;t.centroidX=c,t.centroidZ=h;let f=(c-i.x)*e.framingBias*l,d=(h-i.z)*e.framingBias*l;const u=Math.hypot(f,d);u>e.maxOffset&&(f=f/u*e.maxOffset,d=d/u*e.maxOffset),t.offsetX=f,t.offsetZ=d}t.distanceScale=1-e.pushIn*(1-l)+e.maxPullback*l,t.pitchDelta=e.maxPitchDelta*l}function Xp(n){const t=[],e=n.ground.size;t.push(ds("ground","ground",0,0,e,e,-n.ground.thickness,0));for(const i of n.steps)t.push(ds(i.id,"step",i.x,i.z,i.width,i.depth,0,i.height));for(const i of n.doorways){const s=i.openingWidth/2,a=i.wallThickness;t.push(ds(`${i.id}-left`,"wall",i.x-s-i.wallSpan/2,i.z,i.wallSpan,a,0,i.wallHeight)),t.push(ds(`${i.id}-right`,"wall",i.x+s+i.wallSpan/2,i.z,i.wallSpan,a,0,i.wallHeight)),t.push(ds(`${i.id}-lintel`,"lintel",i.x,i.z,i.openingWidth,a,i.openingHeight,i.wallHeight))}for(const i of n.obstacles)t.push(ds(i.id,"obstacle",i.x,i.z,i.width,i.depth,0,i.height));return t}function ds(n,t,e,i,s,a,o,r){return{id:n,kind:t,minX:e-s/2,maxX:e+s/2,minY:o,maxY:r,minZ:i-a/2,maxZ:i+a/2}}const fi=1e-6;function ko(n,t,e){return n<t?t:n>e?e:n}function ya(n,t,e,i,s,a,o){const r=s*.85;let l=Number.NEGATIVE_INFINITY;for(const c of n)c.maxY>i+a+fi||c.maxY<i-o-fi||t+r<c.minX||t-r>c.maxX||e+r<c.minZ||e-r>c.maxZ||c.maxY>l&&(l=c.maxY);return l}function Sl(n,t,e,i,s){let a=!1;const o=t.y+i;for(let r=0;r<2;r++)for(const l of n){if(l.maxY<=t.y+s+fi||l.minY>=o-fi)continue;const c=ko(t.x,l.minX,l.maxX),h=ko(t.z,l.minZ,l.maxZ),f=t.x-c,d=t.z-h,u=f*f+d*d;if(!(u>=e*e))if(a=!0,u>fi*fi){const m=Math.sqrt(u),y=(e-m)/m;t.x+=f*y,t.z+=d*y}else{const m=t.x-l.minX,y=l.maxX-t.x,g=t.z-l.minZ,p=l.maxZ-t.z,x=Math.min(m,y,g,p);x===m?t.x=l.minX-e:x===y?t.x=l.maxX+e:x===g?t.z=l.minZ-e:t.z=l.maxZ+e}}return a}function bl(n,t,e,i,s){const a=t.y+i;for(const o of n){if(o.maxY<=t.y+s+fi||o.minY>=a-fi)continue;const r=ko(t.x,o.minX,o.maxX),l=ko(t.z,o.minZ,o.maxZ),c=t.x-r,h=t.z-l;if(c*c+h*h<e*e-fi)return!0}return!1}const Ai=1e-6,Bs=Math.PI/180;function wl(n){return Math.atan2(Math.sin(n),Math.cos(n))}function uc(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function yu(n){n.arrows.length=0}function Wp(n,t,e,i,s,a,o,r,l,c,h){const f=i-n,d=a-e,u=f*f+d*d;let m=0;u>Ai&&(m=((o-n)*f+(r-e)*d)/u,m=Math.max(0,Math.min(1,m)));const y=n+f*m,g=e+d*m,p=y-o,x=g-r;if(p*p+x*x>h*h)return-1;const _=t+(s-t)*m;return _<l-.1||_>l+c?-1:m}function $p(n,t){const e=n.config.combat.bow.trajectory,i=Math.max(0,e.homingRange);if(i<=Ai)return-1;const s=n.character.position,a=Math.max(0,e.homingConeDeg)*Bs,o=n.config.targeting.targetAssist&&n.modules.targeting?n.targeting:null,r=o&&o.hasTarget?o.targetId:0;let l=-1,c=i+Ai;for(const h of n.dummies){if(!n.modules.dummies)break;const f=h.position.x-s.x,d=h.position.z-s.z,u=Math.hypot(f,d);if(!(u<.001||u>i)){if(h.id===r)return h.id;Math.abs(wl(Math.atan2(f,d)-t))>a||u<c&&(l=h.id,c=u)}}return l}function Yp(n,t,e){if(e<=0)return t;const i=n.dummies.find(r=>r.id===e);if(!i)return t;const s=n.character.position,a=Math.atan2(i.position.x-s.x,i.position.z-s.z),o=Math.max(0,n.config.combat.bow.trajectory.homingConeDeg)*Bs;return t+Fs(wl(a-t),-o,o)}function Zp(n,t,e,i,s,a){const o=n.config.combat.bow.trajectory,r={vy:a*Math.sin(Math.max(0,o.launchPitchDeg)*Bs),horizontal:0};if(r.horizontal=a*Math.cos(Math.max(0,o.launchPitchDeg)*Bs),s<=0)return r;const l=n.dummies.find(y=>y.id===s);if(!l)return r;const c=Math.hypot(l.position.x-t,l.position.z-i);if(c<.4)return r;const h=c/Math.max(Ai,a),f=l.position.y+n.config.dummies.height*Fs(o.aimHeightRatio,0,1),d=Math.max(0,o.gravity),u=(f-e+.5*d*h*h)/h,m=Fs(u,-a*.45,a*.92);return{vy:m,horizontal:Math.sqrt(Math.max(0,a*a-m*m))}}function qp(n,t,e){const i=n.config.combat.bow.trajectory,s=Math.max(0,Math.min(1,t)),a=i.speedMin+(i.speedMax-i.speedMin)*s,o=n.character.position,r=$p(n,e),l=Yp(n,e,r),c=Math.sin(l),h=Math.cos(l),f=o.x+Math.sin(e)*.55,d=o.z+Math.cos(e)*.55,u=o.y+.95,m=Zp(n,f,u,d,r,a),y={id:++n.arrowSeq,x:f,y:u,z:d,vx:c*m.horizontal,vy:m.vy,vz:h*m.horizontal,life:Math.max(.1,i.maxLife),stuck:!1,stuckDummy:-1,offX:0,offY:0,offZ:0,yaw:e,localYaw:0,pitch:0,rest:0,hit:!1,targetId:r,homing:Math.max(0,i.homingTime),turnRate:Math.max(0,i.turnRateDeg)*Bs};return n.arrows.push(y),uc(n,"arrow-shot",s,y),y}function Fs(n,t,e){return n<t?t:n>e?e:n}function jp(n,t){const e=n.arrows;if(e.length===0)return;const i=n.config.combat.bow.trajectory,s=n.config.dummies.radius,a=n.config.dummies.height,o=n.modules.hits&&n.modules.dummies,r=Math.max(0,i.gravity),l=[];for(const c of e){if(c.stuck){if(c.rest-=t,c.rest<=0)continue;if(c.stuckDummy>=0){const v=n.dummies[c.stuckDummy];if(v){const R=Math.cos(v.bodyYaw),w=Math.sin(v.bodyYaw);c.x=v.position.x+c.offX*R+c.offZ*w,c.y=v.position.y+c.offY,c.z=v.position.z-c.offX*w+c.offZ*R,c.yaw=v.bodyYaw+c.localYaw}}l.push(c);continue}if(c.life-=t,c.life<=0)continue;const h=c.x,f=c.y,d=c.z;if(c.homing>0&&(c.homing=Math.max(0,c.homing-t),c.targetId>0&&c.turnRate>0)){const v=n.dummies.find(R=>R.id===c.targetId);if(!v)c.targetId=0;else{const R=Math.hypot(c.vx,c.vz);if(R>Ai){const w=Math.atan2(v.position.x-c.x,v.position.z-c.z),S=Math.atan2(c.vx,c.vz),T=c.turnRate*t,b=S+Fs(wl(w-S),-T,T);c.vx=Math.sin(b)*R,c.vz=Math.cos(b)*R;const M=Math.hypot(v.position.x-c.x,v.position.z-c.z);if(M>.3){const C=M/R,k=(v.position.y+a*Fs(i.aimHeightRatio,0,1)-c.y+.5*r*C*C)/C,N=Math.max(0,i.verticalTurnRate)*t;c.vy+=Fs(k-c.vy,-N,N)}}}}c.yaw=Math.atan2(c.vx,c.vz),c.pitch=-Math.atan2(c.vy,Math.hypot(c.vx,c.vz)),c.vy-=r*t;const u=h+c.vx*t,m=f+c.vy*t,y=d+c.vz*t;let g=-1,p=2;if(o)for(let v=0;v<n.dummies.length;v++){const R=n.dummies[v],w=Wp(h,f,d,u,m,y,R.position.x,R.position.z,R.position.y,a,s+i.radius);w>=0&&w<p&&(p=w,g=v)}if(g>=0){const v=n.dummies[g];c.x=h+(u-h)*p,c.y=f+(m-f)*p,c.z=d+(y-d)*p,c.stuck=!0,c.stuckDummy=g;const R=Math.cos(v.bodyYaw),w=Math.sin(v.bodyYaw),S=c.x-v.position.x,T=c.z-v.position.z;c.offX=S*R-T*w,c.offZ=S*w+T*R,c.offY=c.y-v.position.y;const b=Math.atan2(c.vx,c.vz);c.localYaw=b-v.bodyYaw,c.yaw=b,c.pitch=Math.atan2(-c.vy,Math.hypot(c.vx,c.vz)),c.rest=Math.max(.2,i.stickSec),c.hit=!0;const M=Math.hypot(c.vx,c.vz);$o(n,g,{type:"light",duration:.22,dirX:M>Ai?c.vx/M:0,dirZ:M>Ai?c.vz/M:1,knockback:.14}),uc(n,"arrow-land",v.id,c),l.push(c);continue}const x=ya(n.boxes,u,y,m+.4,.04,0,6),_=Number.isFinite(x)?x:0;if(m<=_+.02&&c.vy<0){c.x=u,c.y=_+Math.max(0,i.groundStickLift),c.z=y,c.stuck=!0,c.stuckDummy=-1,c.yaw=Math.atan2(c.vx,c.vz);const v=Math.atan2(-c.vy,Math.max(Ai,Math.hypot(c.vx,c.vz)));c.pitch=Math.max(v,Math.max(0,i.stickMinPitchDeg)*Bs),c.rest=Math.max(.2,i.stickSec),uc(n,"arrow-land",-1,c),l.push(c);continue}c.x=u,c.y=m,c.z=y,l.push(c)}n.arrows=l}const fc=1e-6,Kp=Math.PI/180;function pc(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function El(n,t,e){return n<t?t:n>e?e:n}function qo(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function mc(n){const t=n.id,e=n.windowId;Object.assign(n,qo()),n.id=t,n.windowId=e}function Jp(n){mc(n)}function Mu(n){mc(n.playerLink);for(const t of n.dummies)mc(t.link)}function Qp(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function gc(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const s=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;s<=0||(i.linkWindow=Math.max(i.linkWindow,s),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function Io(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,qo()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function tm(n,t){const e=n.config.links.search,i=n.character.position,s=El(e.maxAngleDeg,0,180)*Kp;let a=0,o=t,r=Number.POSITIVE_INFINITY;for(const l of n.dummies){const c=l.position.x-i.x,h=l.position.z-i.z,f=Math.hypot(c,h);if(f<fc||f>e.range)continue;const d=Math.atan2(c,h);Math.abs(Oe(d-t))>s||f<r&&(r=f,a=l.id,o=d)}return{id:a,yaw:o,dist:a>0?r:0}}function em(n,t,e,i){const s=n.config.links,a=n.playerLink,o=n.character.position,r=_a(n,t),l=tm(n,r),c=l.id>0?l.yaw:r,h=l.id>0?El(l.dist-s.search.stopDistance,0,e.distance):s.noTargetFallback?e.distance:0;a.phase="windup",a.linkWindow=0,a.source="none",a.usedWindowId=a.windowId,a.cooldown=s.sharedCooldown,a.kind=e.kind,a.weapon=i,a.id+=1,a.timer=0,a.progress=0,a.facing=c,a.targetId=l.id,a.targetDist=l.dist,a.travel=h,a.travelled=0,a.fromX=o.x,a.fromZ=o.z,a.pulseTimer=0,a.hitIds=[],a.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,s.sharedCooldown),pc(n,"link-start",a.id)}function nm(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){Io(n);return}if(e.weapon!==n.combat.weapon){Io(n);return}e.timer+=t;const s=l=>l==="windup"?i.windup:l==="active"?i.active:i.recovery;let a=0;for(;e.phase!=="idle"&&a++<8;){const l=s(e.phase);if(e.timer<l)break;e.timer-=l,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,pc(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,pc(n,"link-end",e.id))}const o=i.windup+i.active+i.recovery;let r=0;if(e.phase==="windup"?r=e.timer:e.phase==="active"?r=i.windup+e.timer:e.phase==="recovery"?r=i.windup+i.active+e.timer:r=o,e.progress=o>0?El(r/o,0,1):1,e.phase==="active"&&i.active>fc){const l=Math.max(0,e.travel-e.travelled),c=Math.max(fc,i.active-e.timer),h=l/c;n.impulse.x=Math.sin(e.facing)*h,n.impulse.z=Math.cos(e.facing)*h}}function im(n,t,e){const i=n.config.links,s=n.playerLink,a=n.character.position;if(s.consumedAttack=!1,s.phase==="active"&&(s.travelled+=Math.hypot(a.x-s.fromX,a.z-s.fromZ)),s.fromX=a.x,s.fromZ=a.z,!i.enabled||!n.modules.links){s.phase!=="idle"&&Io(n);return}const o=n.combat,r=n.character.sprinting;r&&i.triggerWhileSprinting&&s.phase==="idle"&&s.usedWindowId!==s.windowId&&i.windows.sprint>0&&(s.linkWindow=Math.max(s.linkWindow,i.windows.sprint),s.source="sprint"),s.phase==="idle"&&s.prevSprinting&&!r&&gc(n,"sprint"),s.prevSprinting=r,nm(n,t);const l=i.moves[o.weapon];e.attackPressed&&s.phase==="idle"&&s.linkWindow>0&&s.usedWindowId!==s.windowId&&s.cooldown<=0&&o.phase==="idle"&&!o.charging&&n.dash.phase==="idle"&&!!l&&l.enabled&&em(n,e,l,o.weapon)}const xc=1e-6;function Ri(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Su(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function jo(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.timings=Su()}function sm(n){return{weapon:ns[Math.max(0,n-1)]??ns[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,timings:Su()}}function am(n,t){return _a(n,t)}function om(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,s=Math.max(0,t*e.maxLungeScale),a=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+a,s)}function bu(n,t,e,i){const s=n.combat;s.phase="windup",s.phaseTimer=0,s.comboIndex=i,s.queued=!1,s.charging=!1,s.charge=0,s.attackFacing=am(n,t),s.attackProgress=0,s.timings=e,s.attackId+=1,Ri(n,"attack-start",i)}function wu(n){return Math.max(0,n.config.combat.settle)}function vc(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];bu(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:wu(n),lunge:om(n,i.lunge[e-1]??0)},e)}function vh(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,bu(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:wu(n),lunge:i.lunge},0),qp(n,e,n.combat.attackFacing),Ri(n,"charge-release",e)}function rm(n,t,e){const i=n.combat;if(i.phase==="idle")return;const s=i.timings;i.phaseTimer+=t;let a=0;for(;i.phase!=="idle"&&a++<8;){const l=i.phase==="windup"?s.windup:i.phase==="active"?s.active:i.phase==="recovery"?s.recovery:s.settle;if(i.phaseTimer<l)break;if(i.phaseTimer-=l,i.phase==="windup")i.phase="active",Ri(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",Ri(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.comboWindow,i.queued){i.queued=!1;const c=n.config.combat.weapons[i.weapon];c.comboCount>0&&vc(n,e,i.comboIndex<c.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const l=i.timings.recovery;if(l>xc&&i.phaseTimer>=l*n.config.combat.cancelWindow){i.queued=!1;const c=n.config.combat.weapons[i.weapon];c.comboCount>0&&vc(n,e,i.comboIndex<c.comboCount?i.comboIndex+1:1)}}const o=s.windup+s.active+s.recovery;let r=0;i.phase==="windup"?r=i.phaseTimer:i.phase==="active"?r=s.windup+i.phaseTimer:i.phase==="recovery"?r=s.windup+s.active+i.phaseTimer:i.phase==="settle"&&(r=o),i.phase!=="idle"&&(i.attackProgress=o>0?Math.min(1,r/o):1)}function cm(n,t,e){const i=n.combat,s=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=ns.length){const l=ns[e.weaponSlot-1];l!==i.weapon&&(i.weapon=l,jo(n),Io(n),Ri(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,Ri(n,"combo-reset",0))),rm(n,t,e);const a=s.weapons[i.weapon],o=n.dash.phase==="active";if(a.comboCount>0){const l=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!o&&!l&&(e.attackPressed||s.autoCombo&&e.attackHeld))if(i.phase==="idle"){const h=i.comboWindow>0&&i.comboIndex<a.comboCount?i.comboIndex+1:1;vc(n,e,h)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&!o&&!n.playerLink.consumedAttack){if(e.attackHeld){if(i.charging||(i.charging=!0,i.charge=0,Ri(n,"charge-start",0)),i.charge=Math.min(1,i.charge+t/Math.max(s.bow.maxChargeTime,xc)),s.bow.autoFire&&i.charge>=1){i.charging=!1;const l=i.charge;i.charge=0,vh(n,e,l)}}else if(i.charging){i.charging=!1;const l=i.charge;i.charge=0,l>=s.bow.minChargeToFire?vh(n,e,l):Ri(n,"charge-release",0)}}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.timings.active>xc)){const l=i.timings.active,c=Math.max(0,i.timings.lunge),h=Math.max(.2,s.lungeCurve),f=y=>c*(1-Math.pow(1-Math.min(1,Math.max(0,y/l)),h+1)),d=Math.min(l,Math.max(0,i.phaseTimer)),u=Math.min(l,Math.max(0,i.phaseTimer-t));let m=Math.max(0,f(d)-f(u))/Math.max(t,1e-4);m=Math.min(m,Math.max(0,s.lungeMaxSpeed)),n.impulse.x=Math.sin(i.attackFacing)*m,n.impulse.z=Math.cos(i.attackFacing)*m}}const _c=1e-6;function vr(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function lm(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function Eu(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function _h(n,t,e){return n<t?t:n>e?e:n}function hm(n,t,e){const i=n.config.dash,a=n.character.position,o=n.config.worldBounds,r=Math.max(.05,i.blinkStep),l=Math.max(0,i.blinkDistance);let c=0,h=a.x,f=a.z;for(;c<l-_c;){const d=Math.min(l,c+r),u=a.x+t*d,m=a.z+e*d,y=_h(u,o.minX,o.maxX),g=_h(m,o.minZ,o.maxZ),p={x:y,y:a.y,z:g};if(bl(n.boxes,p,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(h=y,f=g,c=d,y!==u||g!==m))break}return{x:h,z:f}}function dm(n,t,e){const i=n.dash,s=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,gc(n,"roll")),i.cooldown>0){const l=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),l>0&&i.cooldown===0&&vr(n,"dash-ready",0)}const a=n.combat,o=a.weapon==="bow"&&(a.charging||a.phase!=="idle");if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&(a.phase==="idle"||o)&&n.playerLink.phase==="idle"){o&&(a.charging=!1,a.charge=0,a.phase!=="idle"&&jo(n));const l=gp(n,e),c=l.x,h=l.z,f=n.combat.weapon==="staff";if(i.kind=f?"blink":"roll",i.dirX=c,i.dirZ=h,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=f?s.blinkCooldown:s.rollCooldown,f){const d=hm(n,c,h);n.character.position.x=d.x,n.character.position.z=d.z,i.toX=d.x,i.toZ=d.z,i.duration=0,i.timer=0,i.phase="idle",s.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),gc(n,"blink"),vr(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(_c,s.rollDuration),i.timer=i.duration,i.toX=i.fromX+c*s.rollDistance,i.toZ=i.fromZ+h*s.rollDistance,vr(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const l=Math.max(_c,i.timer),c=n.character.position.x,h=n.character.position.z;n.impulse.x=(i.toX-c)/l,n.impulse.z=(i.toZ-h)/l}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const sn=1e-6,yc=Math.PI*2,um=7,fm=18;function pm(n){return Math.atan2(Math.sin(n),Math.cos(n))}function yh(n,t,e,i){return n+pm(t-n)*(1-Math.exp(-Math.max(e,sn)*i))}function Tl(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function mm(n){const t=[];for(let e=0;e<n.count;e++){const i=n.spawn[e]??{x:0,z:0},s=n.initialModes[e]??"idle";t.push({id:e+1,mode:s,initialMode:s,homeX:i.x,homeZ:i.z,position:{x:i.x,y:0,z:i.z},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:i.x,targetZ:i.z,wanderTimer:0,attackCooldown:0,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,hurt:hu(),link:qo()})}return t}function gm(n){const t=mr.indexOf(n);return mr[(t+1)%mr.length]}function Tu(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],s=t.spawn[e]??{x:i.homeX,z:i.homeZ},a=t.initialModes[e]??i.initialMode;i.mode=a,i.initialMode=a,i.homeX=s.x,i.homeZ=s.z,i.position.x=s.x,i.position.y=0,i.position.z=s.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=s.x,i.targetZ=s.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0;const o=i.hurt;o.type="none",o.timer=0,o.duration=0,o.dirX=0,o.dirZ=0,o.knockX=0,o.knockZ=0,Jp(i.link)}n.dummyAttackCount=0}function xm(n,t,e){const i=xr(n)*yc,s=Math.sqrt(xr(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*s,t.targetZ=t.homeZ+Math.sin(i)*s,t.wanderTimer=e.wanderInterval*(.6+xr(n)*.8)}function vm(n,t){return n.attackPhase==="windup"?t.attackWindup:n.attackPhase==="active"?t.attackActive:n.attackPhase==="recovery"?t.attackRecovery:0}function _m(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0;return}t.attackPhaseTimer+=e;let s=0;for(;t.attackPhase!=="idle"&&s++<4;){const r=Math.max(vm(t,i),sn);if(t.attackPhaseTimer<r)break;t.attackPhaseTimer-=r,t.attackPhase==="windup"?(t.attackPhase="active",Tl(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0)}const a=i.attackWindup+i.attackActive+i.attackRecovery;let o=0;t.attackPhase==="windup"?o=t.attackPhaseTimer:t.attackPhase==="active"?o=i.attackWindup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(o=i.attackWindup+i.attackActive+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||a<=0?0:Math.min(1,o/a)}function ym(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,s=i.x-t.position.x,a=i.z-t.position.z,o=Math.hypot(s,a),r=o>sn?s/o:0,l=o>sn?a/o:0;let c=0,h=0;if(t.mode==="wander"){const d=t.targetX-t.position.x,u=t.targetZ-t.position.z,m=Math.hypot(d,u);(t.wanderTimer<=0||m<.3)&&xm(n,t,e);const y=t.targetX-t.position.x,g=t.targetZ-t.position.z,p=Math.hypot(y,g);p>sn&&(c=y/p,h=g/p)}else if(t.mode==="follow")o>e.followStopDistance&&(c=r,h=l);else if(t.mode==="keep-distance"){const d=o-e.keepDistance;d>e.keepDeadZone?(c=r,h=l):d<-e.keepDeadZone?(c=-r,h=-l):(c=-l*e.keepStrafe,h=r*e.keepStrafe)}else t.mode==="attack"&&o>e.attackRange&&t.attackPhase==="idle"&&(c=r,h=l);let f=t.facing;if(t.mode==="wander"?Math.hypot(c,h)>sn&&(f=Math.atan2(c,h)):o>sn&&(f=Math.atan2(r,l)),e.leashRadius>sn&&t.mode!=="wander"&&t.mode!=="idle"){const d=t.position.x-t.homeX,u=t.position.z-t.homeZ,m=Math.hypot(d,u);if(m>e.leashRadius){const y=Math.min(1,(m-e.leashRadius)/Math.max(e.leashRadius*.5,.5)),g=-d/m,p=-u/m;c=c*(1-y)+g*y,h=h*(1-y)+p*y;const x=Math.hypot(c,h);x>sn&&(c/=x,h/=x)}}return{x:c,z:h,facing:f}}function Mm(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.mode==="attack"&&e.attackPhase==="idle"&&e.attackCooldown<=0&&e.hurt.timer<=0){const p=n.character.position;Math.hypot(p.x-e.position.x,p.z-e.position.z)<=i.attackRange+sn&&(e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=i.attackInterval,n.dummyAttackCount+=1,Tl(n,"dummy-attack",e))}_m(n,e,t,i);const s=ym(n,e,i),a=n.config.worldBounds;(s.x>0&&e.position.x>=a.maxX-sn||s.x<0&&e.position.x<=a.minX+sn)&&(s.x=0),(s.z>0&&e.position.z>=a.maxZ-sn||s.z<0&&e.position.z<=a.minZ+sn)&&(s.z=0);const o=1-Math.exp(-Math.max(i.acceleration,sn)*t);e.velocity.x+=(s.x*i.moveSpeed-e.velocity.x)*o,e.velocity.z+=(s.z*i.moveSpeed-e.velocity.z)*o,e.facing=s.facing,e.bodyYaw=yh(e.bodyYaw,e.facing,um,t),e.headYaw=yh(e.headYaw,e.facing,fm,t);const r=e.position.x,l=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const c=n.config.stepHeight;if(Sl(n.boxes,e.position,i.radius,i.height,c))if(bl(n.boxes,e.position,i.radius,i.height,c))e.position.x=r,e.position.z=l,e.velocity.x=0,e.velocity.z=0;else{const p=e.position.x-r,x=e.position.z-l;Math.abs(p)<Math.abs(e.velocity.x*t)*.5&&(e.velocity.x=0),Math.abs(x)<Math.abs(e.velocity.z*t)*.5&&(e.velocity.z=0)}const f=n.config.worldBounds;e.position.x<f.minX?(e.position.x=f.minX,e.velocity.x<0&&(e.velocity.x=0),e.hurt.knockX<0&&(e.hurt.knockX=0)):e.position.x>f.maxX&&(e.position.x=f.maxX,e.velocity.x>0&&(e.velocity.x=0),e.hurt.knockX>0&&(e.hurt.knockX=0)),e.position.z<f.minZ?(e.position.z=f.minZ,e.velocity.z<0&&(e.velocity.z=0),e.hurt.knockZ<0&&(e.hurt.knockZ=0)):e.position.z>f.maxZ&&(e.position.z=f.maxZ,e.velocity.z>0&&(e.velocity.z=0),e.hurt.knockZ>0&&(e.hurt.knockZ=0));const d=ya(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,c,Number.POSITIVE_INFINITY);d>Number.NEGATIVE_INFINITY&&d<=e.position.y+c+sn&&(e.position.y=d);const u=Math.hypot(e.position.x-r,e.position.z-l);e.distance+=u;const m=Math.hypot(e.velocity.x,e.velocity.z),y=Math.min(n.config.strideSpeedCap,m/Math.max(n.config.moveSpeed,sn)),g=Math.max(n.config.strideLength*(1+y*n.config.strideSpeedGain),sn);e.stride=g,e.gaitPhase=(e.gaitPhase+u/g*yc)%yc}function Sm(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const s=n.dummies[e.dummyClickId-1];s.mode=gm(s.mode),s.targetX=s.position.x,s.targetZ=s.position.z,s.wanderTimer=0,s.attackCooldown=0,s.attackPhase="idle",s.attackPhaseTimer=0,s.attackProgress=0,Tl(n,"dummy-mode",s)}for(const s of n.dummies)Mm(n,t,s,i)}const In=1e-6,Mh=Math.PI*2;function Sh(n,t){return Math.sqrt(n*n+t*t)}function Na(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function bm(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.headPitch=0,t.bodyPitch=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,jo(n)}function wm(n,t,e){const i=n.character,s=n.config,a=ya(n.boxes,t,e,s.characterHeight,s.characterRadius,s.stepHeight,Number.POSITIVE_INFINITY);i.position.x=t,i.position.y=a>Number.NEGATIVE_INFINITY?a:0,i.position.z=e,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.moveYaw=0,i.bodyYaw=0,i.headYaw=0,i.headPitch=0,i.bodyPitch=0,i.grounded=!0,i.sprinting=!1,i.gaitPhase=0,i.stride=s.strideLength,i.distance=0,i.coyoteTime=s.coyoteTime,i.jumpBuffer=0,jo(n),Mu(n),Eu(n),xu(n),yu(n),Do(n);const o=n.targeting;o.targetId=0,o.targetYaw=0,o.targetDist=0,o.hasTarget=!1;const r=n.playerHurt;r.type="none",r.lastAt=vl,r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,n.events.length=0}function Em(n,t,e){const i=n.config,s=n.character,a=s.position,o=s.velocity;let r=Number.isFinite(e.moveX)?e.moveX:0,l=Number.isFinite(e.moveZ)?e.moveZ:0;const c=Sh(r,l);c>1&&(r/=c,l/=c);const h=i.worldBounds;(r>0&&a.x>=h.maxX-In||r<0&&a.x<=h.minX+In)&&(r=0),(l>0&&a.z>=h.maxZ-In||l<0&&a.z<=h.minZ+In)&&(l=0);const f=n.combat.phase!=="idle",d=n.playerLink.phase!=="idle",u=n.dash.phase==="active",m=f||u||d;s.sprinting=!m&&e.sprintHeld&&c>In;const y=i.combat.weapons[n.combat.weapon];let g=y?y.moveMultiplier:1;u||d?g=0:f?g*=n.combat.phase==="active"?i.combat.lungeMoveScale:n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?g*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(g*=Math.max(0,Math.min(1,n.abilities.channelMoveScale)));const p=i.moveSpeed*(s.sprinting?i.sprintMultiplier:1)*g;{const k=m?i.skillDecel:c>In?i.acceleration:i.friction,N=1-Math.exp(-k*t);o.x+=(r*p-o.x)*N,o.z+=(l*p-o.z)*N}e.jumpPressed?s.jumpBuffer=i.jumpBufferTime:s.jumpBuffer=Math.max(0,s.jumpBuffer-t),s.coyoteTime=s.grounded?i.coyoteTime:Math.max(0,s.coyoteTime-t),s.jumpBuffer>0&&s.coyoteTime>0&&(o.y=i.jumpSpeed,s.grounded=!1,s.coyoteTime=0,s.jumpBuffer=0,Na(n,"jumped",i.jumpSpeed)),n.events.some(k=>k.type==="blink"&&k.tick===n.tick)&&(o.x=0,o.z=0,n.impulse.x=0,n.impulse.z=0);const _=a.x,v=a.z;if(a.x+=(o.x+n.impulse.x+n.playerHurt.knockX)*t,a.z+=(o.z+n.impulse.z+n.playerHurt.knockZ)*t,Sl(n.boxes,a,i.characterRadius,i.characterHeight,i.stepHeight)){if(bl(n.boxes,a,i.characterRadius,i.characterHeight,i.stepHeight))a.x=_,a.z=v,o.x=0,o.z=0;else{const k=a.x-_,N=a.z-v;Math.abs(k)<Math.abs(o.x*t)*.5&&(o.x=0),Math.abs(N)<Math.abs(o.z*t)*.5&&(o.z=0)}Na(n,"blocked",1)}a.x<h.minX?(a.x=h.minX,o.x<0&&(o.x=0),n.playerHurt.knockX<0&&(n.playerHurt.knockX=0)):a.x>h.maxX&&(a.x=h.maxX,o.x>0&&(o.x=0),n.playerHurt.knockX>0&&(n.playerHurt.knockX=0)),a.z<h.minZ?(a.z=h.minZ,o.z<0&&(o.z=0),n.playerHurt.knockZ<0&&(n.playerHurt.knockZ=0)):a.z>h.maxZ&&(a.z=h.maxZ,o.z>0&&(o.z=0),n.playerHurt.knockZ>0&&(n.playerHurt.knockZ=0));const w=ya(n.boxes,a.x,a.z,a.y,i.characterRadius,i.stepHeight,i.fallTolerance);s.grounded&&w>a.y+In&&w-a.y<=i.stepHeight+In&&(a.y=w,o.y=0,Na(n,"stepUp",w));const S=a.y;o.y-=i.gravity*t,a.y+=o.y*t;const T=ya(n.boxes,a.x,a.z,S,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);T>Number.NEGATIVE_INFINITY&&a.y<=T&&o.y<=0?(a.y=T,o.y=0,s.grounded||Na(n,"landed",T),s.grounded=!0):s.grounded=!1;const b=Sh(a.x-_,a.z-v);s.distance+=b;const M=b/Math.max(t,In),C=Math.min(i.strideSpeedCap,M/Math.max(i.moveSpeed,In)),I=Math.max(i.strideLength*(1+C*i.strideSpeedGain),In);s.stride=I,s.gaitPhase=(s.gaitPhase+b/I*Mh)%Mh}const Mc=1e-6,bh=2.399963229728653;function ji(n,t,e){return n<t?t:n>e?e:n}function wh(n,t,e,i,s,a,o,r,l){const c=t.x-n.x,h=t.z-n.z,f=Math.hypot(c,h),d=e+i;if(f>=d)return;let u,m,y;f<Mc?(u=r,m=l,y=d):(u=c/f,m=h/f,y=d-f);const g=y+o;n.x-=u*g*s,n.z-=m*g*s,t.x+=u*g*a,t.z+=m*g*a}function Tm(n){const t=n.config.separation,e=n.dummies,i=n.character.position,s=n.config.characterRadius,a=n.config.dummies.radius,o=Math.max(1,Math.floor(t.iterations)),r=Math.max(0,t.slop);for(let h=0;h<o;h++){for(let f=0;f<e.length;f++)for(let d=f+1;d<e.length;d++){const u=(f*3+d)*bh;wh(e[f].position,e[d].position,a,a,.5,.5,r,Math.cos(u),Math.sin(u))}for(let f=0;f<e.length;f++){const d=(f+1)*bh;wh(i,e[f].position,s,a,0,1,r,Math.cos(d),Math.sin(d))}}const l=n.config.stepHeight,c=n.config.worldBounds;for(const h of e)Sl(n.boxes,h.position,a,n.config.dummies.height,l),h.position.x=ji(h.position.x,c.minX,c.maxX),h.position.z=ji(h.position.z,c.minZ,c.maxZ)}function Am(n,t,e,i,s,a,o,r){const l=Math.hypot(e,i),c=Math.max(0,r.contactBand),h=ji(r.minScale,0,1);if(l<Mc||c<=0||h>=1)return 1;const f=s+o,d=ji(r.approachDot,0,.99);let u=0;for(const m of a){const y=m.position.x-n,g=m.position.z-t,p=Math.hypot(y,g);if(p>=f+c)continue;if(p<Mc){u=1;continue}const x=(e*y+i*g)/(l*p);if(x<=d)continue;const _=ji(1-(p-f)/c,0,1),v=ji((x-d)/(1-d),0,1);u=Math.max(u,_*v)}return 1-(1-h)*ji(u,0,1)}function Rm(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=Am(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const _r=1e-6,Cm=Math.PI/180;function Pm(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function Lm(n,t,e){return n<t?t:n>e?e:n}function Dm(n,t,e){const i=n.config.targeting,s=n.targeting,a=n.character.position;let o=n.character.facing;const r=Math.hypot(e.aimX,e.aimZ);e.aimActive&&r>_r?o=Math.atan2(e.aimX,e.aimZ):Math.hypot(e.moveX,e.moveZ)>_r&&(o=Math.atan2(e.moveX,e.moveZ));const l=Lm(i.maxAngleDeg,0,180)*Cm;let c=Number.POSITIVE_INFINITY,h=0,f=0,d=0;for(const u of n.dummies){const m=u.position.x-a.x,y=u.position.z-a.z,g=Math.hypot(m,y);if(g<_r||g>i.range)continue;const p=Math.atan2(m,y),x=Math.abs(Oe(p-o));if(x>l)continue;const _=g-i.frontBias*Math.cos(x);_<c&&(c=_,h=u.id,f=p,d=g)}s.targetId=h,s.targetYaw=f,s.targetDist=d,s.hasTarget=h>0}const Jn=1e-6;function Ds(n,t,e){return n<t?t:n>e?e:n}function Eh(n){return Math.atan2(Math.sin(n),Math.cos(n))}function km(n,t,e){const i=n.config.gaze,s=n.gaze;if(!i.enabled||!n.modules.gaze){s.active=!1,s.mainId=0,s.mainYaw=0,s.mainPitch=0,s.centroidYaw=0,s.threatCount=0,s.threat=0;return}const a=n.character.position,o=(k,N)=>{const L=k.position.x-a.x,D=k.position.z-a.z,B=Math.hypot(L,D);if(B<Jn||B>N)return 0;const U=Ds((N-B)/Math.max(Jn,N-i.nearDistance),0,1);let z=U*(i.modeWeight[k.mode]??.5);return k.attackPhase==="active"&&(z+=i.attackBoost*U),z},r=[];let l=0,c=!1,h=!1,f=!1;for(const k of n.dummies){const N=o(k,i.threatRange),L=k.position.x-a.x,D=k.position.z-a.z,B=Math.hypot(L,D);N>0&&(r.push({id:k.id,x:k.position.x,z:k.position.z,dx:L,dz:D,yaw:Math.atan2(L,D),w:N}),l+=N,B<=i.approachDist&&(i.modeWeight[k.mode]??.5)>=i.hostileModeWeight&&(f=!0)),B>Jn&&B<=i.recoveryDist&&(c=!0),(k.attackPhase==="windup"||k.attackPhase==="active")&&B<=i.threatRange&&(h=!0)}const d=l<=0?0:Ds(l/(l+Math.max(Jn,i.saturation)),0,1),u=r.length>0,m=s.active,y=u&&(e.aimActive&&d>=i.enterThreshold||i.reactToAttack&&h&&d>=i.enterThreshold||i.reactToApproach&&f),g=i.hurtHoldSec>Jn&&n.time-n.playerHurt.lastAt<i.hurtHoldSec,p=m&&(c||g);if(s.active=y||p,!s.active){s.mainId=0,s.mainYaw=0,s.mainPitch=0,s.centroidYaw=0,s.threatCount=0,s.threat=0;return}if(r.length===0)return;r.sort((k,N)=>N.w-k.w);const x=r.slice(0,Math.max(1,i.maxThreats)),_=r[0],v=Math.atan2(_.dx,_.dz),R=i.behindAngleDeg*Math.PI/180,w=n.character.bodyYaw;let S=0,T=0,b=0;for(const k of x){const N=Math.abs(Eh(k.yaw-v))/Math.PI;let L=k.w/(1+Math.max(i.spreadFalloff,0)*N*N);k!==_&&i.behindFalloff<1&&Math.abs(Eh(k.yaw-w))>R&&(L*=Math.max(i.behindFalloff,0)),S+=k.x*L,T+=k.z*L,b+=L}s.mainId=_.id,s.mainYaw=v;const M=n.dummies.find(k=>k.id===_.id),C=(M?M.position.y:0)+n.config.dummies.height*Ds(i.aimHeightRatio,0,1),I=a.y+n.config.characterHeight*Ds(i.eyeHeightRatio,0,1);s.mainPitch=Math.atan2(C-I,Math.max(Jn,Math.hypot(_.dx,_.dz))),s.centroidYaw=b>Jn?Math.atan2(S/b-a.x,T/b-a.z):v,s.threatCount=r.length,s.threat=d}function Im(n,t){const e=n.config.gaze;return(e.modeWeight[t.mode]??.5)>=e.hostileModeWeight}function Fm(n,t){const e=n.config.gaze;if(!e.enabled||!n.modules.gaze)return 0;const i=n.character.position,s=Math.hypot(t.position.x-i.x,t.position.z-i.z);if(s<Jn||s>e.threatRange)return 0;const a=Math.max(Jn,e.threatRange-e.nearDistance),o=Ds((e.threatRange-s)/a,0,1);let r=o*(e.modeWeight[t.mode]??.5);t.attackPhase==="active"&&(r+=e.attackBoost*o);const l=Math.max(Jn,e.modeWeight.attack??1.5);return Ds(r/l,0,1)}function Um(){return{active:!1,mainId:0,mainYaw:0,mainPitch:0,centroidYaw:0,threatCount:0,threat:0}}function zm(n,t){return{tick:0,time:0,rngState:2654435769,config:n,boxes:Xp(t),gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:sm(1),playerLink:qo(),arrows:[],arrowSeq:0,abilities:Hp(),skills:Op(n),impulse:{x:0,z:0},targeting:Pm(),turnInPlace:Sp(),playerHurt:hu(),hitCount:0,dash:{...lm(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{...vu(),centroidX:n.spawn.x,centroidZ:n.spawn.z},gaze:Um(),dummies:mm(n.dummies),dummyAttackCount:0,events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,turnInPlace:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,gaze:!0,dummies:!0}}}function Nm(n){bm(n),Tu(n),Mu(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.lastAt=vl,e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,xu(n),yu(n),Eu(n),_u(n),Do(n);const i=n.gaze;i.active=!1,i.mainId=0,i.mainYaw=0,i.mainPitch=0,i.centroidYaw=0,i.threatCount=0,i.threat=0,n.events.length=0}function Th(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){Nm(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?Dm(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),im(n,t,e),n.modules.combat&&cm(n,t,e),n.modules.dash&&dm(n,t,e),n.modules.movement&&Em(n,t,e),n.modules.gaze&&km(n,t,e),n.modules.orientation&&Tp(n,t,e),Ep(n,t,e),n.modules.dummies&&Sm(n,t,e),xp(n,t),Qp(n,t),n.modules.abilities&&Gp(n,t,e),n.modules.combat&&jp(n,t),n.modules.dummies&&(Mp(n,t),n.modules.separation&&(Tm(n),Rm(n))),n.modules.camera?Vp(n):_u(n),n}const Au=["bodyYaw","bodyPitch","bodyRoll","pelvisX","pelvisZ","armPitch","armYaw","armRoll","elbow","bladePitch","armLPitch","armLYaw","armLRoll","elbowL"],Ah=1e-9;function Om(n,t,e){return n<t?t:n>e?e:n}function Ru(n){return Om(Number.isFinite(n)?n:0,0,1)}function Bm(n,t){const e=Ru(t);return n==="in"?e*e:n==="out"?1-(1-e)*(1-e):n==="inOut"?e*e*(3-2*e):e}function Hm(){const n={};for(const t of Au)n[t]=0;return n}function Gm(n,t){const e=Hm(),i=(n==null?void 0:n.keys)??[];if(i.length===0)return e;const s=Ru(t);let a=0;for(;a<i.length-1&&s>i[a+1].t+Ah;)a+=1;const o=i[a],r=i[Math.min(a+1,i.length-1)],l=r.t-o.t,c=l>Ah?(s-o.t)/l:0,h=Bm(o.ease??"linear",c);for(const f of Au){const d=o.pose[f]??r.pose[f]??0,u=r.pose[f]??o.pose[f]??0;e[f]=d+(u-d)*h}return e}function Oa(n,t){return((n==null?void 0:n.keys)??[]).some(e=>typeof e.pose[t]=="number")}function Vm(n){let t=0;return{frame(e,i,s,a,o){if(a||s<=0)return t=0,0;t+=Math.min(e,.1)*s;const r=n.config.fixedDt,l=n.config.maxStepsPerFrame;let c=0;for(;t>=r&&c<l;){const h=c===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};Th(n,r,h),o&&o(),t-=r,c++}return c>=l&&(t=0),c},singleStep(e){Th(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t}}}const Cu={slopPx:12,longPressMs:450,doubleTapMs:280};function Xm(n,t,e=Cu.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,s=n.dy/n.distance,a=t.rightX*i+t.forwardX*-s,o=t.rightZ*i+t.forwardZ*-s,r=Math.hypot(a,o);return r<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:a/r,worldZ:o/r}}function Ni(n,t,e,i,s,a){const o=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:o,angleDeg:o>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:s,taps:a,worldX:0,worldZ:0}}function Wm(n=Cu){const t=new Map,e=new Map,i=s=>t.get(s);return{begin(s,a,o,r,l){if(t.has(a))return null;for(const c of t.values())if(c.button===s)return null;return t.set(a,{button:s,pointerId:a,startX:o,startY:r,x:o,y:r,startedAt:l,dragging:!1,longFired:!1}),Ni(s,"press",0,0,0,1)},move(s,a,o,r){const l=i(s);if(!l)return null;l.x=a,l.y=o;const c=a-l.startX,h=o-l.startY;return!l.dragging&&Math.hypot(c,h)>=n.slopPx?(l.dragging=!0,Ni(l.button,"drag",c,h,r-l.startedAt,1)):null},end(s,a,o,r){const l=i(s);if(!l)return null;t.delete(s),l.x=a,l.y=o;const c=a-l.startX,h=o-l.startY,f=r-l.startedAt,d=Math.hypot(c,h);if(l.dragging||l.longFired||d>=n.slopPx)return Ni(l.button,"release",c,h,f,1);const u=e.get(l.button);return u!==void 0&&r-u.at<=n.doubleTapMs&&Math.hypot(a-u.x,o-u.y)<=n.slopPx*2?(e.delete(l.button),Ni(l.button,"doubleTap",c,h,f,2)):(e.set(l.button,{at:r,x:a,y:o}),Ni(l.button,"tap",c,h,f,1))},cancel(s,a){const o=i(s);return o?(t.delete(s),Ni(o.button,"cancel",o.x-o.startX,o.y-o.startY,a-o.startedAt,1)):null},poll(s){for(const a of t.values())if(!(a.longFired||a.dragging)&&s-a.startedAt>=n.longPressMs)return a.longFired=!0,Ni(a.button,"longPress",a.x-a.startX,a.y-a.startY,s-a.startedAt,1);return null},isHeld(s){for(const a of t.values())if(a.button===s)return!0;return!1},reset(){t.clear(),e.clear()}}}const yr=.001,$m=18;function Sc(n,t,e){return n<t?t:n>e?e:n}function bc(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function Ym(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function Zm(n,t,e,i,s=$m){const a=Ym(t);if(!a)return{state:bc(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const o=Math.hypot(a[1].x-a[0].x,a[1].y-a[0].y),r=s,l=Math.max(1.0001,Number.isFinite(i)?i:1.25),c=1/l,h=l;if(!Number.isFinite(o)||o<yr)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const m=r<=0;return{state:{active:!0,lastDist:o,armDist:o,armed:m},scale:1,started:!0,ended:!1,armedNow:!1,pinching:m}}if(!n.armed)return n.armDist<yr?{state:{active:!0,lastDist:o,armDist:o,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(o-n.armDist)<r?{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<yr)return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const f=o/n.lastDist,d=Math.max(0,Number.isFinite(e)?e:1),u=Number.isFinite(f)&&f>0?Math.pow(f,d):1;return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:Sc(Number.isFinite(u)?u:1,c,h),started:!1,ended:!1,armedNow:!1,pinching:!0}}function qm(n,t,e,i){const s=Math.min(e,i),a=Math.max(e,i),o=Number.isFinite(t)&&t>0?t:1,r=n*o;return Number.isFinite(r)?Sc(r,s,a):Sc(n,s,a)}function jm(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function Km(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const Mr=["jump","sprint","reset","attack","skill2"],Jm=8,Qm=16,Sr=10,Rh=14,Ch=140,t0=18,e0=16,n0=400,i0=1.0001;function So(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function s0(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&So(e)}function a0(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:s}=n,a=()=>Math.max(8,t());let o=null,r=0,l=0,c=0,h=0,f=0,d=0,u=-1,m=0,y=null,g=-1,p=0,x=0,_=0,v=0,R=!1,w=0,S=1,T=0,b=null,M=0,C=0,I=!1,k=null,N=null,L=0,D=0,B=0,U=0,z=!1,W=!0,mt=-1;const at=Wm({slopPx:Rh,longPressMs:450,doubleTapMs:350});let dt=[],tt=null;const Z=new Set;function pt(O){O&&dt.push(O)}const j=new Map;let Mt=bc(),$t=!1,Bt=1;function jt(){const O=Array.from(j.values()),st=s(),ut=Zm(Mt,O,st.pinchGain,st.maxStepRatio,t0);if(Mt=ut.state,$t=ut.pinching,ut.scale!==1&&(Bt*=ut.scale),ut.started||ut.armedNow)b=null,I=!0,k=null;else if(ut.ended&&o===null&&O.length===1){const Gt=O[0];o=Gt.id,r=Gt.x,l=Gt.y,c=0,h=0,f=Gt.x,d=Gt.y,R=!1,w=0,S=1,T=0,performance.now(),b=null,I=!0,k=null}}const ht={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},Dt={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let V=0,ue=0;const Zt={},Vt=new Set,kt=[];function Et(){for(const O of Mr)Zt[O]!==void 0&&(Zt[O]=void 0),Y(O);at.reset(),Z.clear(),j.clear(),Mt=bc(),$t=!1,o=null,c=0,h=0,f=0,d=0,R=!1,w=0,S=1,T=0,p=0,x=0,_=0,v=0,y=null,g=-1,b=null,I=!1,k=null,N=null,mt=-1,B=0,U=0,z=!1,W=!0}const At=()=>{document.hidden&&Et()},P=O=>{if(O.clientX===0&&O.clientY===0){m++;return}if(So(O.target)||s0(O.clientX,O.clientY)){Z.add(O.pointerId);return}if(Z.delete(O.pointerId),j.set(O.pointerId,{id:O.pointerId,x:O.clientX,y:O.clientY}),o===null&&!$t){y=null,g=-1,o=O.pointerId,r=O.clientX,l=O.clientY,c=0,h=0,f=O.clientX,d=O.clientY,performance.now();const st=Number.isFinite(O.screenX)&&Number.isFinite(O.screenY)&&(O.screenX!==0||O.screenY!==0);R=st,w=0,S=1,T=0,p=st?O.screenX:0,x=st?O.screenY:0,_=p,v=x,b=O.pointerId,M=O.clientX,C=O.clientY,I=!1}jt()},E=O=>{if(O.pointerId===N&&(O.pointerType==="mouse"&&O.buttons===0||O.clientX===0&&O.clientY===0&&(L!==0||D!==0)||(W?(B=O.clientX-L,U=O.clientY-D):(L=O.clientX,D=O.clientY,W=!0,B=0,U=0))),pt(at.move(O.pointerId,O.clientX,O.clientY,performance.now())),!Z.has(O.pointerId)&&j.has(O.pointerId)&&(j.set(O.pointerId,{id:O.pointerId,x:O.clientX,y:O.clientY}),jt()),Z.has(O.pointerId)||O.pointerId!==o)return;const st=performance.now();if(y===O.pointerId&&st-g<150){m++;return}const ut=O.clientX,Gt=O.clientY;if(ut===0&&Gt===0&&(r!==0||l!==0)){m++;return}const zt=ut-f,F=Gt-d,xt=Number.isFinite(O.screenX)&&Number.isFinite(O.screenY),J=xt?O.screenX:0,ot=xt?O.screenY:0,St=xt&&(J!==0||ot!==0),bt=J-_,Kt=ot-v;if(R&&St){const Me=Math.hypot(bt,Kt),ke=Math.hypot(zt,F);if(Me>3){if(w=0,T<30&&ke>6&&bt*zt+Kt*F>.7*Me*ke){const Ue=Me/ke;Ue>.2&&Ue<5&&(S+=(Ue-S)*.3,T++)}}else ke>12&&(w++,w>=2&&(R=!1))}const re=Math.hypot(zt,F);if(!R){const Me=u<0?Number.POSITIVE_INFINITY:st-u,ke=St?Math.hypot(bt,Kt):1/0;re>28&&(Me<200||ke<re*.4)&&(r+=zt,l+=F,m++)}f=ut,d=Gt,_=J,v=ot,O.pointerId===b&&Math.hypot(O.clientX-M,O.clientY-C)>Jm&&(I=!0);let ce,ne;R&&St?(ce=(J-p)/S,ne=(ot-x)/S):(ce=ut-r,ne=Gt-l);const be=Math.hypot(ce,ne),xe=a();be>xe&&(ce*=xe/be,ne*=xe/be);const Ve=Math.hypot(c,h),je=Math.hypot(ce,ne);if(Ve>10&&je>10){const Me=Math.abs(Math.atan2(c*ne-h*ce,c*ce+h*ne)),ke=Math.max(Ve,je)*Me,Ue=Math.max(Math.hypot(zt,F),Math.hypot(bt,Kt)/Math.max(.2,S));if(Me>.6&&Ue<Math.max(6,ke*.5)){m++;return}}c=ce,h=ne};function Y(O){if(!ht[O])return;ht[O]=!1,O==="attack"&&(Dt.attackReleased=!0);const st=document.getElementById(`btn-${O}`);st==null||st.classList.remove("is-down")}function rt(){o!==null&&(y=o,g=performance.now(),o=null,c=0,h=0,f=0,d=0,R=!1,w=0,S=1,T=0,p=0,x=0,_=0,v=0)}const lt=O=>{const st=j.delete(O.pointerId),ut=Z.delete(O.pointerId);st&&jt(),O.pointerId===N&&(N=null,z?mt=performance.now():(B=0,U=0,mt=-1)),pt(at.end(O.pointerId,O.clientX,O.clientY,performance.now()));for(const qt of Mr)Zt[qt]===O.pointerId&&(Zt[qt]=void 0,Y(qt));const Gt=!st&&!ut&&j.size<=1&&o!==null;(O.pointerId===o||j.size===0||Gt)&&rt(),!ut&&O.pointerId===b&&(!I&&!So(O.target)&&(k={x:O.clientX,y:O.clientY}),b=null)};for(const O of Mr){const st=document.getElementById(`btn-${O}`);if(!st)continue;const ut=O==="attack"||O==="skill2",Gt=F=>{if(F.preventDefault(),Zt[O]===void 0){Zt[O]=F.pointerId,ht[O]=!0,O==="jump"&&(Dt.jump=!0),O==="reset"&&(Dt.reset=!0),O==="sprint"&&(Dt.sprintPressed=!0),O==="attack"&&(Dt.attackPressed=!0),O==="skill2"&&(Dt.skill2=!0),st.classList.add("is-down"),pt(at.begin(O,F.pointerId,F.clientX,F.clientY,performance.now()));try{st.setPointerCapture(F.pointerId)}catch{}ut&&(N=F.pointerId,L=F.clientX,D=F.clientY,W=!(F.clientX===0&&F.clientY===0),B=0,U=0,z=!1,mt=-1)}},qt=F=>{Zt[O]===F.pointerId&&(Zt[O]=void 0,Y(O),pt(at.end(F.pointerId,F.clientX,F.clientY,performance.now())))},zt=F=>{Zt[O]===F.pointerId&&(Zt[O]=void 0,Y(O),pt(at.cancel(F.pointerId,performance.now())))};st.addEventListener("pointerdown",Gt),st.addEventListener("pointerup",qt),st.addEventListener("pointercancel",zt),kt.push(()=>{st.removeEventListener("pointerdown",Gt),st.removeEventListener("pointerup",qt),st.removeEventListener("pointercancel",zt)})}const it=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const O of it){const st=ut=>{ut.preventDefault(),V=Number(O.dataset.weapon)||0};O.addEventListener("pointerdown",st),kt.push(()=>O.removeEventListener("pointerdown",st))}const Rt=O=>{const st=O.key.toLowerCase();if((st===" "||st.startsWith("arrow"))&&O.preventDefault(),Vt.has(st))return;Vt.add(st),st===" "&&(Dt.jump=!0),st==="r"&&(Dt.reset=!0),st==="shift"&&(Dt.sprintPressed=!0),st==="j"&&(Dt.attackPressed=!0),st==="k"&&(Dt.skill2=!0),st>="1"&&st<="5"&&(V=Number(st)),st>="6"&&st<="9"&&(ue=Number(st)-5);const ut=Math.max(i0,s().keyStep||1.12);(st==="="||st==="+")&&(Bt*=ut),(st==="-"||st==="_")&&(Bt/=ut)},K=O=>{const st=O.key.toLowerCase();Vt.has(st)&&(Vt.delete(st),st==="j"&&(Dt.attackReleased=!0))},ft=O=>{if(So(O.target))return;O.preventDefault();const st=O.deltaMode===1?O.deltaY*e0:O.deltaMode===2?O.deltaY*n0:O.deltaY;Bt*=jm(st,s().wheelStep)},It=O=>{O.preventDefault()},et=()=>{u=performance.now()};window.addEventListener("resize",et),window.addEventListener("orientationchange",et);const gt=typeof window<"u"?window.visualViewport:null;return gt&&(gt.addEventListener("resize",et),gt.addEventListener("scroll",et)),window.addEventListener("pointerdown",P),window.addEventListener("pointermove",E),window.addEventListener("pointerup",lt),window.addEventListener("pointercancel",lt),window.addEventListener("blur",Et),document.addEventListener("visibilitychange",At),window.addEventListener("keydown",Rt),window.addEventListener("keyup",K),window.addEventListener("wheel",ft,{passive:!1}),window.addEventListener("gesturestart",It),{peekStick(){return{id:o,held:o!==null,originX:r,originY:l,x:f,y:d,dx:f-r,dy:d-l,radius:a(),badMoves:m,screenOk:R,originSX:p,originSY:x,screenX:_,screenY:v,scale:S}},peekAim(){const O=performance.now(),st=Math.hypot(B,U),ut=N!==null||mt>=0&&O-mt<Ch;if(!(ut&&z&&st>=Sr))return{active:!1,holding:ut,x:0,z:0,dx:B,dy:U};const qt=i(),zt=B/st,F=U/st,xt=qt.rightX*zt+qt.forwardX*-F,J=qt.rightZ*zt+qt.forwardZ*-F,ot=Math.hypot(xt,J)||1;return{active:!0,holding:ut,x:xt/ot,z:J/ot,dx:B,dy:U}},sample(){var q;const O=a();let st=o!==null?Math.max(-1,Math.min(1,c/O)):0,ut=o!==null?Math.max(-1,Math.min(1,h/O)):0,Gt=0,qt=0;(Vt.has("a")||Vt.has("arrowleft"))&&(Gt-=1),(Vt.has("d")||Vt.has("arrowright"))&&(Gt+=1),(Vt.has("w")||Vt.has("arrowup"))&&(qt-=1),(Vt.has("s")||Vt.has("arrowdown"))&&(qt+=1),st+=Gt,ut+=qt;let zt=Math.hypot(st,ut);zt>1&&(st/=zt,ut/=zt,zt=1);const F=st,xt=ut;zt<e&&(st=0,ut=0);const J=i();let ot=J.rightX*st+J.forwardX*-ut,St=J.rightZ*st+J.forwardZ*-ut;const bt=Math.hypot(ot,St);bt>1&&(ot/=bt,St/=bt);const Kt=performance.now();pt(at.poll(Kt));const re=Math.hypot(B,U);N!==null&&(re>=Qm?z=!0:re<Sr&&(z=!1));const ce=N!==null||mt>=0&&Kt-mt<Ch,ne=ce&&z&&re>=Sr;let be=0,xe=0;if(ne){const Ct=B/re,Tt=U/re,Qt=J.rightX*Ct+J.forwardX*-Tt,Jt=J.rightZ*Ct+J.forwardZ*-Tt,le=Math.hypot(Qt,Jt)||1;be=Qt/le,xe=Jt/le}!ce&&N===null&&(B=0,U=0,mt=-1,z=!1);const Ve=k;k=null;const je=Bt;Bt=1;const Me={moveX:ot,moveZ:St,jumpPressed:Dt.jump,sprintHeld:ht.sprint||Vt.has("shift"),sprintPressed:Dt.sprintPressed,resetPressed:Dt.reset,attackPressed:Dt.attackPressed,attackHeld:ht.attack||Vt.has("j"),attackReleased:Dt.attackReleased,skill2Pressed:Dt.skill2,weaponSlot:V,dummyClickId:ue,aimX:be,aimZ:xe,aimActive:ne};Dt.jump=!1,Dt.reset=!1,Dt.sprintPressed=!1,Dt.attackPressed=!1,Dt.attackReleased=!1,Dt.skill2=!1,V=0,ue=0;const ke=dt.map(Ct=>Xm(Ct,J,Rh));dt=[],ke.length>0&&(tt=ke[ke.length-1]);const Ue=o!==null?"pointer":Vt.size>0?"keyboard":"idle";return{intents:Me,stickX:st,stickY:ut,stickRawX:F,stickRawY:xt,stickHeld:o!==null,stickId:o,stickOriginX:r,stickOriginY:l,stickPxX:f,stickPxY:d,stickBad:m,stickScreenOk:R,stickOriginSX:p,stickOriginSY:x,stickScreenX:_,stickScreenY:v,stickScale:S,stickVpTop:((q=Km())==null?void 0:q.top)??0,stickVpAge:u<0?-1:Math.round(performance.now()-u),aimDX:B,aimDY:U,source:Ue,tap:Ve,zoomScale:je,gestures:ke,lastGesture:tt}},dispose(){window.removeEventListener("pointerdown",P),window.removeEventListener("pointermove",E),window.removeEventListener("pointerup",lt),window.removeEventListener("pointercancel",lt),window.removeEventListener("blur",Et),document.removeEventListener("visibilitychange",At),window.removeEventListener("keydown",Rt),window.removeEventListener("keyup",K),window.removeEventListener("wheel",ft),window.removeEventListener("resize",et),window.removeEventListener("orientationchange",et),gt&&(gt.removeEventListener("resize",et),gt.removeEventListener("scroll",et)),window.removeEventListener("gesturestart",It),at.reset();for(const O of kt)O()}}}const Fo=1,Uo=2,zo=4,Pu=8,No=16,fa=32,Lu=64,Du=128,o0=[[Fo,"atk"],[Uo,"dash"],[zo,"link"],[Pu,"air"],[No,"hurt"],[fa,"aim"],[Lu,"spr"],[Du,"chan"]];function us(n){if(n===0)return"-";const t=o0.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const r0=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],c0=0,l0=15,br=19,h0=21,d0=22,u0=23,f0=24,jn={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},yn=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,Fn=n=>Math.round(n*180/Math.PI*10)/10,wr=Math.PI*2;function ea(n){let t=n%wr;return t>Math.PI&&(t-=wr),t<-Math.PI&&(t+=wr),t}function p0(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=Fo),n.dash.phase!=="idle"&&(e|=Uo),n.playerLink.phase!=="idle"&&(e|=zo),n.character.grounded||(e|=Pu),n.playerHurt.type!=="none"&&(e|=No),t.intents.aimActive&&(e|=fa),n.character.sprinting&&(e|=Lu),n.abilities.channeling&&(e|=Du),e}function m0(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function g0(n){const t={sampleHz:n.sampleHz??jn.sampleHz,sampleCapacity:n.sampleCapacity??jn.sampleCapacity,eventCapacity:n.eventCapacity??jn.eventCapacity,anomalyCapacity:n.anomalyCapacity??jn.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??jn.dirJumpDeg,aimDropDeg:n.aimDropDeg??jn.aimDropDeg,freezeMs:n.freezeMs??jn.freezeMs,freezeSpeed:n.freezeSpeed??jn.freezeSpeed,stickLostMs:n.stickLostMs??jn.stickLostMs,spikeMs:n.spikeMs??jn.spikeMs},e=n.meta,i=[],s=[],a=[],o={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let r=!0,l=-1,c=-1e9,h=null,f=0,d=0,u="",m=-1,y=-1,g=-1,p=0,x=-1e9,_=-1,v={},R=null,w=0,S=0,T=0,b=0;function M(L,D){const B=1/t.sampleHz,U=L[c0];U-c<B-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(L),c=U)}function C(L,D,B,U,z,W){const mt=v[L]??-1e9;if(D-mt<1.2)return;if(v[L]=D,L==="frameSpike"){let dt=0;for(const tt of a)tt.kind==="frameSpike"&&dt++;if(dt>=6)return}a.length>=t.anomalyCapacity&&a.shift();let at=i.slice(-7);W&&(at.length===0||at[at.length-1]!==W)&&(at=[...at.slice(-6),W]),a.push({kind:L,t:yn(D),tick:B,ms:Math.round(U),detail:z,ctx:at}),L==="dirJump"?o.dirJumps++:L==="aimDrop"?o.aimDrops++:L==="moveFreeze"?o.freezes++:L==="stickLost"?o.stickLosts++:L==="stickJump"?o.stickJumps++:L==="stickBad"?o.stickBads++:L==="stickDrift"&&o.stickDrifts++}function I(L,D,B,U){s.length>=t.eventCapacity&&s.shift(),s.push({t:yn(B),tick:U,k:L,d:D})}function k(L){switch(L.type){case"attack-start":o.attacks++;break;case"hit":o.hits++;break;case"player-hurt":o.hurts++;break;case"link-start":o.links++;break;case"link-hit":o.linkHits++;break;case"roll":o.rolls++;break;case"blink":o.blinks++;break;case"channel-start":o.channels++;break;case"projectile-fire":o.bolts++;break;case"ring-place":o.rings++;break;case"charge-start":o.bowCharges++;break;case"jumped":o.jumps++;break;case"reset":o.resets++;break;case"blocked":x=L.tick;break}}function N(){const L=o,D=L.wallMs/1e3,B=L.gestures,U=at=>Object.entries(B).filter(([dt])=>dt.endsWith(`.${at}`)).reduce((dt,[,tt])=>dt+tt,0),z=[];if(z.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),z.push(`运行 ${D.toFixed(1)}s / ${L.frames} 帧 · ${L.fps.toFixed(1)}fps · 最大 ${L.dtMax.toFixed(0)}ms · 尖峰 ${L.spikes} · 步 ${L.steps}`),z.push(`摇杆活跃 ${D>0?Math.round(L.stickActiveMs/1e3/D*100):0}% · 手势 按下 ${U("press")}（单击 ${U("tap")} / 双击 ${U("doubleTap")} / 拖拽 ${U("drag")} / 长按 ${U("longPress")} / 打断 ${U("cancel")} / 拖放 ${U("release")}）`),z.push(`攻击 ${L.attacks}(中${L.hits}) · 受击 ${L.hurts} · 派生 ${L.links}(中${L.linkHits}) · 翻滚 ${L.rolls} 闪现 ${L.blinks} · 跳 ${L.jumps} · 复位 ${L.resets}`),z.push(`法杖 引导${L.channels} 飞弹${L.bolts} 电环${L.rings} · 弓蓄力${L.bowCharges} · 当前武器 ${u||"-"}`),z.push(`异常 ${L.dirJumps+L.aimDrops+L.freezes+L.stickLosts+L.stickJumps+L.stickBads+L.stickDrifts}（dir ${L.dirJumps} / aim ${L.aimDrops} / freeze ${L.freezes} / stick ${L.stickLosts} / stickJump ${L.stickJumps} / 坏指针 ${L.stickBads} / 坐标漂移 ${L.stickDrifts}） · 掉帧尖峰 ${L.spikes}`+(L.inTurns>0?` · 输入转向 ${L.inTurns} 次（最大 ${L.inTurnMax.toFixed(0)}°）`:"")),a.length>0)for(const at of a.slice(-6)){z.push(`· ${at.kind} @t${at.t.toFixed(2)} tick${at.tick} ${at.ms>0?`${at.ms}ms `:""}${at.detail}`);const dt=at.ctx.map(Z=>String(Z[l0])).join(" "),tt=at.ctx.map(Z=>Z[br]===""||Z[br]==null?".":String(Z[br])).join(" ");if(z.push(`  yaw ${dt}`),z.push(`  in  ${tt}`),at.kind==="stickJump"||at.kind==="stickBad"||at.kind==="stickLost"){const Z=at.ctx.map(j=>`${j[h0]},${j[d0]}`).join(" "),pt=at.ctx.map(j=>`${j[u0]},${j[f0]}`).join(" ");z.push(`  o   ${Z}`),z.push(`  p   ${pt}`)}}if(s.length>0){z.push("最近事件：");for(const at of s.slice(-12))z.push(`  ${at.t.toFixed(2)} ${at.k} ${at.d}`.trimEnd())}const W=o.screenFrames>0?`屏幕 screenX/Y（${o.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",mt=o.screenFrames>0&&o.clientFrames>0?` / client 回退 ${o.clientFrames} 帧`:"";return z.push(`摇杆坐标源 ${W}${mt}`),z.push(`UA ${e.ua}`),z.join(`
`)}return{sample(L,D,B,U=0){o.frames++,D.stickHeld&&(D.stickScreenOk?o.screenFrames++:o.clientFrames++),o.steps+=U,o.wallMs+=B,B>o.dtMax&&(o.dtMax=B),o.fps=o.wallMs>0?o.frames*1e3/o.wallMs:0,o.simS=L.time;const z=L.time;if(l<0&&(l=z),T=z,b=L.tick,!r)return;const W=L.character,mt=Math.hypot(D.stickX,D.stickY),at=Math.hypot(W.velocity.x,W.velocity.z);u=L.combat.weapon;const dt=p0(L,D),tt=W.facing,pt=Math.hypot(D.intents.moveX,D.intents.moveZ)>.05?Math.atan2(D.intents.moveX,D.intents.moveZ):null;mt>.2&&(o.stickActiveMs+=B);const j=[yn(z),L.tick,Math.round(B*10)/10,yn(D.stickX),yn(D.stickY),yn(D.stickRawX),yn(D.stickRawY),D.stickHeld?1:0,D.source.slice(0,8),yn(D.intents.moveX),yn(D.intents.moveZ),yn(W.position.x),yn(W.position.z),yn(W.velocity.x),yn(W.velocity.z),Fn(tt),Fn(W.bodyYaw),dt,yn(W.stride),pt===null?"":Fn(pt),D.stickId===null?"":D.stickId,Math.round(D.stickOriginX),Math.round(D.stickOriginY),Math.round(D.stickPxX),Math.round(D.stickPxY),D.stickBad,Math.round(D.stickVpTop),Math.round(D.stickOriginSX),Math.round(D.stickOriginSY),Math.round(D.stickScreenX),Math.round(D.stickScreenY),D.stickScreenOk?1:0,Math.round(D.stickScale*100)/100];M(j);const Mt=z*1e3<_;if(B>t.spikeMs&&!Mt&&z-l>.6&&(o.spikes++,C("frameSpike",z,L.tick,B,`dt ${B.toFixed(0)}ms fl=${us(dt)}`,j)),h!==null&&!Mt){const Et=Math.abs(Fn(ea(tt-h))),At=Math.abs(Fn(ea(W.moveYaw-f))),P=(d|dt)&(Fo|Uo|zo|No)|dt&fa,E=pt===null?null:Math.abs(Fn(ea(tt-pt))),Y=pt===null||h===null?null:Math.abs(Fn(ea(h-pt))),rt=E!==null&&Y!==null&&E<Y-.5,lt=(d&fa)!==0&&(dt&fa)===0&&pt===null,it=E!==null&&(E<=12||rt);Et>t.aimDropDeg&&lt?C("aimDrop",z,L.tick,0,`${Et.toFixed(0)}° @aim→none stick(${D.stickX.toFixed(2)},${D.stickY.toFixed(2)}) aim(${D.aimDX.toFixed(0)},${D.aimDY.toFixed(0)}) fl=${us(dt)}`,j):Et>t.dirJumpDeg&&P===0&&!lt&&(it?(o.inTurns++,Et>o.inTurnMax&&(o.inTurnMax=Et)):C("dirJump",z,L.tick,0,`${Et.toFixed(0)}° res${E===null?" 无输入":`${E.toFixed(0)}°`} yaw ${Fn(h)}→${Fn(tt)} in ${pt===null?".":Fn(pt)}° mvΔ${At.toFixed(0)}° aim(${D.aimDX.toFixed(0)},${D.aimDY.toFixed(0)}) fl=${us(d)}→${us(dt)}`,j))}const $t=(dt&(Fo|Uo|zo|No))!==0,Bt=L.tick-x<30;mt>.35&&at<t.freezeSpeed&&!$t&&!Bt?(m<0&&(m=z),z-m>=t.freezeMs/1e3&&z>=y&&(C("moveFreeze",z,L.tick,(z-m)*1e3,`stick(${D.stickX.toFixed(2)},${D.stickY.toFixed(2)}) v${at.toFixed(2)} ${D.source} fl=${us(dt)}`,j),y=z+1.5,m=-1)):m=-1,D.stickHeld?(mt>p&&(p=mt),p>.35&&mt<.06?(g<0&&(g=z),z-g>=t.stickLostMs/1e3&&(C("stickLost",z,L.tick,(z-g)*1e3,`raw(${D.stickRawX.toFixed(2)},${D.stickRawY.toFixed(2)}) peak ${p.toFixed(2)} fl=${us(dt)}`,j),g=-1,p=0)):g=-1):(p=0,g=-1);const jt=D.stickScale>.2&&D.stickScale<5?D.stickScale:1,ht=D.stickScreenOk,Dt=ht?D.stickScreenX/jt:D.stickPxX,V=ht?D.stickScreenY/jt:D.stickPxY,ue=ht?D.stickOriginSX/jt:D.stickOriginX,Zt=ht?D.stickOriginSY/jt:D.stickOriginY,Vt=Dt-ue,kt=V-Zt;if(D.stickHeld&&D.stickId!==null){const Et=R;if(Et&&Et.held&&Et.id===D.stickId){const At=Math.hypot(Et.dx,Et.dy),P=Math.hypot(Vt,kt),E=Math.max(At,P),Y=Math.hypot(Dt-Et.cx,V-Et.cy),rt=Math.abs(Fn(ea(Math.atan2(kt,Vt)-Math.atan2(Et.dy,Et.dx)))),lt=E*rt*Math.PI/180,it=Math.hypot(ue-Et.ox,Zt-Et.oy);if(E>18&&rt>35&&Y<Math.max(5,lt*.35)&&C("stickJump",z,L.tick,0,`Δ${rt.toFixed(0)}° 手指只动${Y.toFixed(0)}px(弧长应${lt.toFixed(0)}px) o(${Math.round(Et.ox)},${Math.round(Et.oy)})→(${Math.round(ue)},${Math.round(Zt)}) 原点位移${it.toFixed(0)}px p(${Math.round(Dt)},${Math.round(V)}) raw(${Math.round(Vt)},${Math.round(kt)}) id${D.stickId} ${ht?"src=屏幕":"src=client"}`,j),ht&&Et.screenOk){const Rt=Math.hypot(D.stickPxX-Et.x,D.stickPxY-Et.y),K=Math.hypot((D.stickScreenX-Et.sx)/jt,(D.stickScreenY-Et.sy)/jt);w+=Rt-K,Math.abs(w)>20&&(C("stickDrift",z,L.tick,0,`client 相对屏幕漂移 ${w>0?"+":""}${w.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(D.stickPxX)},${Math.round(D.stickPxY)}) screen(${Math.round(D.stickScreenX)},${Math.round(D.stickScreenY)})`,j),w=0)}}R={id:D.stickId,ox:ue,oy:Zt,cx:Dt,cy:V,x:D.stickPxX,y:D.stickPxY,sx:D.stickScreenX,sy:D.stickScreenY,dx:Vt,dy:kt,held:!0,screenOk:ht}}else R=null,w=0;if(D.stickBad>S){const Et=D.stickBad-S;C("stickBad",z,L.tick,0,`拦截 ${Et} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${D.stickBad}）o(${Math.round(D.stickOriginX)},${Math.round(D.stickOriginY)}) p(${Math.round(D.stickPxX)},${Math.round(D.stickPxY)}) id${D.stickId??"-"}`,j)}S=D.stickBad,h=tt,f=W.moveYaw,d=dt},event(L,D){const B=m0(L);k(L),r&&(L.type==="dash-ready"||L.type==="combo-reset"||L.type==="stepUp"||I(L.type,B,D,L.tick))},gesture(L){const D=`${L.button}.${L.kind}`;o.gestures[D]=(o.gestures[D]??0)+1,r&&(L.kind==="longPress"||L.kind==="doubleTap"||L.kind==="drag"||L.kind==="cancel")&&I(`g:${L.kind}`,`${L.button} ${L.heldMs.toFixed(0)}ms d${L.distance.toFixed(0)}px ${L.angleDeg.toFixed(0)}°`,T,b)},suspend(L){_=T*1e3+L,m=-1,g=-1},setEnabled(L){r=L,L||(h=null,R=null,m=-1,g=-1)},clear(){i.length=0,s.length=0,a.length=0,v={},c=-1e9,h=null,d=0,m=-1,g=-1,p=0,o.frames=0,o.wallMs=0,o.dtMax=0,o.spikes=0,o.stickActiveMs=0,o.attacks=0,o.hits=0,o.hurts=0,o.links=0,o.linkHits=0,o.rolls=0,o.blinks=0,o.channels=0,o.bolts=0,o.rings=0,o.bowCharges=0,o.jumps=0,o.resets=0,o.dirJumps=0,o.aimDrops=0,o.inTurns=0,o.inTurnMax=0,o.freezes=0,o.stickLosts=0,o.stickJumps=0,o.stickBads=0,o.stickDrifts=0,o.screenFrames=0,o.clientFrames=0,w=0,R=null,S=0;for(const L of Object.keys(o.gestures))delete o.gestures[L]},status(){const L=o.simS,D=a.some(B=>L-B.t<8&&(B.kind==="dirJump"||B.kind==="aimDrop"||B.kind==="moveFreeze"||B.kind==="stickLost"||B.kind==="stickJump"||B.kind==="stickBad"||B.kind==="stickDrift"));return{durationS:o.wallMs/1e3,frames:o.frames,events:s.length,anomalies:a.length,alert:D,enabled:r}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...o,gestures:{...o.gestures}},columns:r0,samples:i.slice(),events:s.slice(),anomalies:a.slice()}},summary:N}}const x0={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,skillDecel:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:0},worldBounds:{minX:-15.5,maxX:15.5,minZ:-15.5,maxZ:15.5},orientation:{bodyTurnRate:7,headTurnRate:12,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},turnInPlace:{enabled:!0,triggerDeg:50,settleDeg:8,durationSec:.45,idleSpeedRatio:.05,inputDeadZone:.12,lookRange:0,armSec:.03,gazeTriggerDeg:120},combat:{comboWindow:.65,settle:.16,attackMoveScale:.3,lungeMoveScale:.08,lungeCurve:1.2,lungeMaxSpeed:17,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:.85,minChargeToFire:.15,chargeMoveMultiplier:.55,autoFire:!0,release:{windup:.04,active:.12,recovery:.26,lunge:0},trajectory:{speedMin:9,speedMax:16,launchPitchDeg:3.5,gravity:9,maxLife:2.4,radius:.2,stickMinPitchDeg:50,groundStickLift:.32,stickSec:4,homingRange:14,homingConeDeg:30,turnRateDeg:90,homingTime:.9,aimHeightRatio:.7,verticalTurnRate:18}}},abilities:{arcane:{perWave:3,waves:5,waveInterval:.2,spreadDeg:8,spreadTime:.22,spawnDelay:.035,spawnSideStep:.2,speedJitter:.12,homingRange:8,homingConeDeg:40,turnRateDeg:300,homingTime:1.1,retargetInterval:.25,cooldown:1,speed:10,life:1.4,radius:.3,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.6},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},skills:[{id:"arcane",kind:"channelVolley",slot:"attack",weapon:"staff",paramsRef:"arcane",enabled:!0},{id:"ring",kind:"groundRing",slot:"skill2",weapon:"staff",paramsRef:"ring",enabled:!0}],targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!0,dummyKnockback:.18},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},gaze:{enabled:!0,headLookLimitDeg:55,headGazeRange:7,threatRange:8,recoveryDist:3.5,maxThreats:3,bodyTurnRate:3.2,headTurnRate:8,maxHeadSpeedDeg:300,maxBodySpeedDeg:130,headReturnRate:3.5,headReturnSpeedDeg:120,aimHeightRatio:.75,eyeHeightRatio:.78,headPitchRate:7,maxHeadPitchDeg:28,bodyPitchScale:.3,bodyPitchRate:4,enterThreshold:.05,reactToAttack:!0,reactToApproach:!0,approachDist:2.5,hurtHoldSec:2,hostileModeWeight:.6,spreadFalloff:1.5,behindFalloff:.35,behindAngleDeg:100,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,nearDistance:1.5,saturation:2.6},dummies:{count:6,spawn:[{x:-11.1,z:-8.35},{x:-9.5,z:-8.35},{x:-7.9,z:-8.35},{x:0,z:-10.2},{x:-9.5,z:0},{x:-9.5,z:7.2}],initialModes:["idle","keep-distance","attack","attack","follow","idle"],leashRadius:2.4,radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4}},v0={ground:{size:32,thickness:.4},steps:[{id:"stair-1",x:6.6,z:-5.6,width:2.4,depth:.9,height:.2},{id:"stair-2",x:6.6,z:-6.5,width:2.4,depth:.9,height:.4},{id:"stair-3",x:6.6,z:-7.4,width:2.4,depth:.9,height:.6},{id:"stair-4",x:6.6,z:-8.3,width:2.4,depth:.9,height:.8},{id:"plateau",x:6.6,z:-9.6,width:2.4,depth:1.6,height:.8},{id:"block-060",x:11.4,z:-6,width:1.4,depth:1.4,height:.6},{id:"block-090",x:11.4,z:-7.9,width:1.4,depth:1.4,height:.9},{id:"block-120",x:11.4,z:-9.8,width:1.4,depth:1.4,height:1.2}],doorways:[{id:"gate-wide",x:6.6,z:-4.3,openingWidth:2.4,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2},{id:"gate-narrow",x:11.4,z:-4.3,openingWidth:.5,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2}],obstacles:[{id:"crate-hub",x:2.5,z:-2.5,width:1.1,depth:1.1,height:.8},{id:"pillar-sw",x:-14.3,z:12.8,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-16,maxX:16,minZ:-16,maxZ:16},stations:[{id:"hub",index:1,name:"中央 8 向",hint:"推杆走 8 个方向 · 松手看停步收相 / 转身踏步",shape:"circle",x:0,z:0,radius:3.6,spawnX:0,spawnZ:0,labelX:0,labelZ:-3.1,color:"#8fe7ff"},{id:"rings",index:2,name:"环状态色阶",hint:"同距三假人：中立蓝 / 戒备黄 / 敌对红 · 点选看 3/4 环",shape:"circle",x:-9.5,z:-8.2,radius:3.4,spawnX:-9.5,spawnZ:-5.2,labelX:-9.5,labelZ:-10.9,color:"#ffc85a"},{id:"windup",index:3,name:"起手预警",hint:"走进 1.6m：脚下红弧填满 = 命中帧",shape:"circle",x:0,z:-10,radius:3.2,spawnX:0,spawnZ:-7,labelX:0,labelZ:-12.6,color:"#ff5a4a"},{id:"terrain",index:4,name:"地形 / 门洞",hint:"宽门 2.4m / 窄门 0.5m · 0.2m 台阶可走，0.6/0.9/1.2m 要跳",shape:"square",x:8.9,z:-7.4,radius:5.2,spawnX:8.9,spawnZ:-2.8,labelX:8.9,labelZ:-11.9,color:"#7fb8d8"},{id:"meter",index:5,name:"进度弧",hint:"弓长按 = 黄弧 · 法杖技2 = 紫弧 · 冲刺后 = 青弧冷却",shape:"circle",x:-9.5,z:8.6,radius:3.2,spawnX:-9.5,spawnZ:11.4,labelX:-9.5,labelZ:9.9,color:"#b48cff"},{id:"dash",index:6,name:"冲刺标尺",hint:"沿刻度跑：翻滚 3.2m / 闪现 5m，看落点差多少",shape:"square",x:9.8,z:8.2,radius:5.2,spawnX:9.8,spawnZ:12.8,labelX:7,labelZ:4.2,color:"#bfe8ff"},{id:"gait",index:7,name:"侧后方步态",hint:"面向假人贴到 1.2m，沿引线按 90 / 135 / 180 走",shape:"circle",x:-9.5,z:0,radius:3.2,spawnX:-9.5,spawnZ:2.6,labelX:-9.5,labelZ:-2.5,color:"#6fc9a0"}]},_0={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:28,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.42},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.6,chestYawMaxDeg:40,stopYawBlendMode:"inStop",stopYawAfterSec:.3,turnStepEnabled:!0,turnStepPitch:.5,turnStepKnee:.35,turnStepDip:.02,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1,backStrafeStartDeg:100,backStrafeFullDeg:132},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13},stretch:{enabled:!0,swingArm:1.45,chargeArm:.88,runLeg:1,torsoGain:.5,impactSquash:.2,impactDecay:11,volumeExp:.5,smoothing:30},swing:{enabled:!0,bodyScale:1,shoulderLift:.055,shoulderPush:.045,shoulderIn:.032,segBlend:.1,weaponScale:{greatsword:1,"sword-shield":.62,"dual-swords":.55},combo:{greatsword:["gs.right-left","gs.left-right","gs.overhead"],"sword-shield":["gs.right-left","gs.left-right","gs.overhead"],"dual-swords":["gs.right-left",{clip:"gs.left-right",lead:"L"},"gs.overhead"]},clips:{"gs.right-left":{kind:"right-left",note:"段 1：躯干 +49° 拧到 −54°，剑身保持水平，从右后扫到左前",keys:[{t:0,ease:"in",pose:{bodyYaw:.85,bodyPitch:-.12,bodyRoll:-.14,pelvisX:.045,pelvisZ:-.06,armPitch:-1.2,armYaw:-.42,armRoll:.16,elbow:-.48,bladePitch:.3}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.06,pelvisX:.01,pelvisZ:-.01,armPitch:-1.34,armYaw:-.52,armRoll:.04,elbow:-.34,bladePitch:.12}},{t:1,pose:{bodyYaw:-.95,bodyPitch:.14,bodyRoll:.17,pelvisX:-.05,pelvisZ:.1,armPitch:-1.46,armYaw:-.6,armRoll:-.1,elbow:-.14,bladePitch:-.05}}]},"gs.left-right":{kind:"left-right",note:"段 2：承接段 1 左侧收势，反向拧 +53°，剑身仍水平",keys:[{t:0,ease:"in",pose:{bodyYaw:-.75,bodyPitch:-.08,bodyRoll:.14,pelvisX:-.04,pelvisZ:-.04,armPitch:-1.28,armYaw:-.58,armRoll:-.12,elbow:-.5,bladePitch:.3}},{t:.55,pose:{bodyYaw:-.05,bodyPitch:.02,bodyRoll:-.02,pelvisX:-.01,pelvisZ:.01,armPitch:-1.36,armYaw:-.5,armRoll:.02,elbow:-.34,bladePitch:.12}},{t:1,pose:{bodyYaw:.92,bodyPitch:.15,bodyRoll:-.18,pelvisX:.05,pelvisZ:.1,armPitch:-1.48,armYaw:-.4,armRoll:.12,elbow:-.13,bladePitch:-.05}}]},"gs.overhead":{kind:"overhead",note:"段 3：举过头顶（剑身 75° 朝上）向前下劈到 −31°，躯干后仰 → 前压",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.32,bodyRoll:-.05,pelvisX:0,pelvisZ:-.07,armPitch:-1.9,armYaw:-.3,armRoll:.16,elbow:-.55,bladePitch:1.3}},{t:.55,pose:{bodyYaw:.06,bodyPitch:.1,bodyRoll:0,pelvisX:0,pelvisZ:.03,armPitch:-1.1,armYaw:-.26,armRoll:.08,elbow:-.3,bladePitch:.55}},{t:1,pose:{bodyYaw:0,bodyPitch:.55,bodyRoll:.02,pelvisX:0,pelvisZ:.13,armPitch:-.15,armYaw:-.2,armRoll:0,elbow:-.1,bladePitch:-.35}}]}}}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6,twoHandInsetX:.15,twoHandGripY:-.1,twoHandMaxStretch:1.3,twoHandMinGrip:.62,twoHandGripStart:1.02,twoHandSlideRate:9},weaponWrist:{enabled:!0,lag:.042,maxAngle:.72,rate:24,twistLag:.03,maxTwist:.5,runDrag:.11},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},groundRing:{playerRadiusFactor:2.3,dummyRadiusFactor:2.05,thicknessFactor:.16,arcDeg:180,selectedArcDeg:270,opacity:.22,playerOpacity:.44,selectedOpacity:.62,selectedScale:1.06,selectedThicknessScale:1.6,edgeFade:.2,playerColor:"#8fe7ff",neutralColor:"#7fb8d8",lowThreatColor:"#ffc85a",highThreatColor:"#ff3b30",haloRadiusFactor:1.16,haloThicknessFactor:2.6,haloOpacity:.14,haloFadeInSec:.05,haloFadeOutSec:.36,meterRadiusFactor:1.34,meterThicknessFactor:.52,meterOpacity:.9,meterColorCharge:"#ffd166",meterColorChannel:"#b48cff",meterColorCooldown:"#7fb8d8",warnRadiusFactor:1.14,warnThicknessFactor:1.5,warnOpacity:.9,warnColor:"#ff5a4a",areaOpacity:.5,landingOpacity:.55,areaExpandSec:.22},projectiles:{arrowColor:"#ffe3a6",arrowHeadColor:"#fff6d8",arrowTrailColor:"#ffcf86",arrowLength:.72,arrowWidth:.062,arrowHeadSize:.16,arrowGlowSize:.5,trailLength:1.05,trailOpacity:.42,boltColor:"#a9ecff",boltGlowColor:"#7fe3ff",boltShapeX:.42,boltShapeY:.42,boltShapeZ:.85,boltGlowScale:1.6,boltTrailScale:2.2,slashEnabled:!1,slashThickness:.075,slashGlowOpacity:.34},weaponTrail:{enabled:!0,maxSamples:8,minStep:.04,life:.09,minSpeed:5.5,color:"#8fd0ff",intensity:.42,tipBoost:.35},hitstop:{enabled:!0,duration:.07},lab:{enabled:!0,showLabels:!0,padOpacity:.55,labelTextHeight:.82},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],attackArcColor:"#ff6b5e"}},y0={core:x0,scene:v0,view:_0};function Al(n){return JSON.parse(JSON.stringify(n))}const Rl=y0,M0=Al(Rl.core),Ba=Al(Rl.scene),bn=Al(Rl.view);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class ei{constructor(t,e,i,s,a="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(a),this.domElement.classList.add("controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("name"),ei.nextNameID=ei.nextNameID||0,this.$name.id=`lil-gui-name-${++ei.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class S0 extends ei{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function wc(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const b0={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:wc,toHexString:wc},Ma={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},w0={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=Ma.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const s=n*i<<16^t*i<<8^e*i<<0;return Ma.toHexString(s)}},E0={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=Ma.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const s=n*i<<16^t*i<<8^e*i<<0;return Ma.toHexString(s)}},T0=[b0,Ma,w0,E0];function A0(n){return T0.find(t=>t.match(n))}class R0 extends ei{constructor(t,e,i,s){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=A0(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const a=wc(this.$text.value);a&&this._setValueFromHexString(a)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class Er extends ei{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class C0 extends ei{constructor(t,e,i,s,a,o){super(t,e,i,"number"),this._initInput(),this.min(s),this.max(a);const r=o!==void 0;this.step(r?o:this._getImplicitStep(),r),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let x=parseFloat(this.$input.value);isNaN(x)||(this._stepExplicit&&(x=this._snap(x)),this.setValue(this._clamp(x)))},i=x=>{const _=parseFloat(this.$input.value);isNaN(_)||(this._snapClampSetValue(_+x),this.$input.value=this.getValue())},s=x=>{x.key==="Enter"&&this.$input.blur(),x.code==="ArrowUp"&&(x.preventDefault(),i(this._step*this._arrowKeyMultiplier(x))),x.code==="ArrowDown"&&(x.preventDefault(),i(this._step*this._arrowKeyMultiplier(x)*-1))},a=x=>{this._inputFocused&&(x.preventDefault(),i(this._step*this._normalizeMouseWheel(x)))};let o=!1,r,l,c,h,f;const d=5,u=x=>{r=x.clientX,l=c=x.clientY,o=!0,h=this.getValue(),f=0,window.addEventListener("mousemove",m),window.addEventListener("mouseup",y)},m=x=>{if(o){const _=x.clientX-r,v=x.clientY-l;Math.abs(v)>d?(x.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(_)>d&&y()}if(!o){const _=x.clientY-c;f-=_*this._step*this._arrowKeyMultiplier(x),h+f>this._max?f=this._max-h:h+f<this._min&&(f=this._min-h),this._snapClampSetValue(h+f)}c=x.clientY},y=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",m),window.removeEventListener("mouseup",y)},g=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",a,{passive:!1}),this.$input.addEventListener("mousedown",u),this.$input.addEventListener("focus",g),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,x,_,v,R)=>(p-x)/(_-x)*(R-v)+v,e=p=>{const x=this.$slider.getBoundingClientRect();let _=t(p,x.left,x.right,this._min,this._max);this._snapClampSetValue(_)},i=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",a)},s=p=>{e(p.clientX)},a=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",a)};let o=!1,r,l;const c=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),o=!1},h=p=>{p.touches.length>1||(this._hasScrollBar?(r=p.touches[0].clientX,l=p.touches[0].clientY,o=!0):c(p),window.addEventListener("touchmove",f,{passive:!1}),window.addEventListener("touchend",d))},f=p=>{if(o){const x=p.touches[0].clientX-r,_=p.touches[0].clientY-l;Math.abs(x)>Math.abs(_)?c(p):(window.removeEventListener("touchmove",f),window.removeEventListener("touchend",d))}else p.preventDefault(),e(p.touches[0].clientX)},d=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",f),window.removeEventListener("touchend",d)},u=this._callOnFinishChange.bind(this),m=400;let y;const g=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const _=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+_),this.$input.value=this.getValue(),clearTimeout(y),y=setTimeout(u,m)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",g,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class P0 extends ei{constructor(t,e,i,s){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class L0 extends ei{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const D0=`.lil-gui {
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
}`;function k0(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let Ph=!1;class Oo{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:s,title:a="Controls",closeFolders:o=!1,injectStyles:r=!0,touchStyles:l=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",c=>{(c.code==="Enter"||c.code==="Space")&&(c.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(a),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),l&&this.domElement.classList.add("allow-touch-styles"),!Ph&&r&&(k0(D0),Ph=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=o}add(t,e,i,s,a){if(Object(i)===i)return new P0(this,t,e,i);const o=t[e];switch(typeof o){case"number":return new C0(this,t,e,i,s,a);case"boolean":return new S0(this,t,e);case"string":return new L0(this,t,e);case"function":return new Er(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,i=1){return new R0(this,t,e,i)}addFolder(t){const e=new Oo({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof Er||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof Er)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=a=>{a.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function I0(n,t,e,i){const s=document.getElementById("debug-panel"),a=s?new Oo({title:"实验台 · 调试面板",autoPlace:!1,container:s}):new Oo({title:"实验台 · 调试面板"}),o=n.config,r=[],l=[],c=ft=>{const It=a.addFolder(ft);return l.push(It),It},h=(ft,It)=>{const et=ft.addFolder(It);return r.push(et),et},f=c("模拟 / 显示");f.add(e,"timeScale",0,3,.05).name("时间缩放"),f.add(e,"paused").name("暂停"),f.add({step:i.singleStep},"step").name("单步 (1 tick)"),f.add({reset:i.reset},"reset").name("复位全部"),f.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),f.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid),f.add(e,"showLab").name("工位地面盘").onChange(i.onToggleLab),f.add(e,"showLabLabels").name("工位标牌").onChange(i.onToggleLabLabels);const d=h(f,"模块开关");d.add(n.modules,"movement").name("movement"),d.add(n.modules,"combat").name("combat"),d.add(n.modules,"links").name("links"),d.add(n.modules,"orientation").name("orientation"),d.add(n.modules,"turnInPlace").name("turnInPlace"),d.add(n.modules,"targeting").name("targeting"),d.add(n.modules,"hits").name("hits"),d.add(n.modules,"separation").name("separation"),d.add(n.modules,"dash").name("dash"),d.add(n.modules,"camera").name("camera"),d.add(n.modules,"dummies").name("dummies"),d.add(n.modules,"abilities").name("abilities");const u=c("移动 / 输入"),m=h(u,"基础移动参数");m.add(o,"moveSpeed",1,10,.1).name("移动速度"),m.add(o,"sprintMultiplier",1,3,.05).name("冲刺倍率"),m.add(o,"acceleration",1,40,.5).name("加速度"),m.add(o,"friction",1,40,.5).name("摩擦"),m.add(o,"skillDecel",2,40,.5).name("进入技能时的减速速率"),m.add(o,"gravity",5,60,.5).name("重力"),m.add(o,"jumpSpeed",2,16,.2).name("起跳速度"),m.add(o,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),m.add(o,"characterRadius",.1,.8,.01).name("角色半径"),m.add(o,"characterHeight",.6,2.2,.05).name("角色身高"),m.add(o,"strideLength",.3,3,.05).name("基础步幅"),m.add(o,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),m.add(o,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const y=h(u,"摇杆 / 输入");y.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),y.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const g=o.dash,p=h(u,"冲刺 / 闪避");p.add(g,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),p.add(g,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),p.add(g,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),p.add(g,"blinkDistance",1,12,.25).name("闪现距离 (m)"),p.add(g,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),p.add(g,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),p.add(g,"blinkClearVelocity").name("闪现清空速度"),p.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),p.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const x=o.separation,_=h(u,"角色间分离 / 挤压阻力");_.add(x,"iterations",1,8,1).name("迭代次数"),_.add(x,"slop",0,.05,.002).name("额外分离量 (m)"),_.add(x.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),_.add(x.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),_.add(x.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const v=o.dummies,R=h(u,"假人 AI");R.add(v,"moveSpeed",.5,8,.1).name("移动速度"),R.add(v,"wanderRadius",.5,8,.1).name("游走半径"),R.add(v,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),R.add(v,"followStopDistance",.3,5,.1).name("跟随停距"),R.add(v,"keepDistance",1,10,.1).name("保持距离"),R.add(v,"keepDeadZone",.1,2,.05).name("保持死区"),R.add(v,"attackRange",.5,5,.1).name("攻击距离"),R.add(v,"attackInterval",.3,5,.1).name("攻击间隔 (s)"),R.add(v,"leashRadius",0,8,.1).name("牵引半径 (0=不限)");const w=c("步态 / 停步"),S=h(w,"程序化步态");S.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),S.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),S.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),S.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),S.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),S.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),S.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),S.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),S.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),S.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),S.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),S.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),S.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),S.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)"),S.add(t.gait,"backStrafeStartDeg",20,170,1).name("侧后方起步角 (°)"),S.add(t.gait,"backStrafeFullDeg",40,180,1).name("完全后退角 (°)");const T=h(w,"停步收相 / 胸朝向");T.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),T.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),T.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),T.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),T.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const b=h(w,"停步惯性");b.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),b.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),b.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),b.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),b.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),b.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),b.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),h(w,"击退步态").add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)");const C=h(w,"足部 IK"),I=t.ik;C.add(I,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),C.add(I,"weight",0,1,.01).name("钉地权重"),C.add(I,"attackScale",0,1,.01).name("攻击时权重倍率"),C.add(I,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const k=h(w,"惯性倾斜 / 盆骨"),N=t.lean;k.add(N,"accelGain",0,.1,.002).name("前后加速度增益"),k.add(N,"turnGain",0,.2,.005).name("绕圈侧倾增益"),k.add(N,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),k.add(N,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),k.add(N,"smoothing",1,30,1).name("倾斜平滑速率"),k.add(N,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),k.add(N,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),k.add(N,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),k.add(N,"crouchSmoothing",1,30,1).name("下沉平滑速率");const L=o.orientation,D=h(w,"朝向 / 下盘带转");D.add(L,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),D.add(L,"headTurnRate",.5,40,.5).name("头部转向速率"),D.add(L,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),D.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),D.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),D.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const B=o.gaze,U=h(w,"接敌注视 / 俯仰 (v9s.18)");U.add(B,"headReturnRate",.5,12,.1).name("无目标回正速率 (1/s)"),U.add(B,"headReturnSpeedDeg",20,400,10).name("回正角速度上限 (°/s)"),U.add(B,"bodyTurnRate",.2,12,.1).name("接敌身体转向速率"),U.add(B,"headTurnRate",.5,30,.5).name("接敌头部转向速率"),U.add(B,"maxHeadSpeedDeg",30,900,10).name("头部最大角速度 (°/s)"),U.add(B,"maxBodySpeedDeg",20,600,10).name("身体最大角速度 (°/s)"),U.add(B,"aimHeightRatio",.2,1,.05).name("注视点高度（身高比例）"),U.add(B,"headPitchRate",.5,20,.5).name("头部俯仰速率"),U.add(B,"maxHeadPitchDeg",0,60,1).name("头部俯仰限幅 (°)"),U.add(B,"bodyPitchScale",0,1,.05).name("身体俯仰比例"),U.add(B,"bodyPitchRate",.5,20,.5).name("身体俯仰速率");const z=h(w,"原地转身 / 停步偏差 (v9s)"),W=o.turnInPlace;z.add(W,"enabled").name("启用原地转身 (关=纯插值)"),z.add(W,"triggerDeg",20,180,5).name("触发夹角 (°)"),z.add(W,"gazeTriggerDeg",20,180,5).name("接敌时触发夹角 (°)"),z.add(W,"settleDeg",0,60,1).name("转身保留余角 (°)"),z.add(W,"durationSec",.1,1.5,.02).name("转身时长 (s)"),z.add(W,"idleSpeedRatio",0,.3,.01).name("静止速度比上限"),z.add(W,"inputDeadZone",0,.5,.01).name("起步输入死区"),z.add(W,"armSec",0,.5,.01).name("触发防抖 (s)"),z.add(t.gait,"stopYawBlendMode",["inStop","afterStop"]).name("偏差消化窗口"),z.add(t.gait,"stopYawAfterSec",.05,1,.02).name("收相后消化时长 (s)"),z.add(t.gait,"turnStepEnabled").name("转身踏步 (关=滑过去)"),z.add(t.gait,"turnStepPitch",0,1.2,.02).name("踏步前迈 (rad)"),z.add(t.gait,"turnStepKnee",0,1,.02).name("踏步抬膝 (rad)"),z.add(t.gait,"turnStepDip",0,.1,.002).name("踏步重心下沉 (m)");const mt=c("战斗 / 受击"),at=o.combat,dt=h(mt,"连击 / 武器"),tt=dt.add(n.combat,"weapon",ns).name("当前武器");dt.add(at,"comboWindow",.1,2,.05).name("连击窗口 (s)"),dt.add(at,"settle",0,.8,.01).name("段间停顿 (s)"),dt.add(at,"attackMoveScale",0,1,.01).name("攻击时移动比例"),dt.add(at,"lungeMoveScale",0,.4,.01).name("跨步时移动比例"),dt.add(at,"lungeCurve",.2,4,.1).name("跨步曲线指数 (大=更冲)"),dt.add(at,"lungeMaxSpeed",4,30,.5).name("跨步速度上限 (m/s)"),dt.add(at,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),dt.add(at,"cancelWindow",0,1,.01).name("取消窗口 (s)"),dt.add(at,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),dt.add(at,"autoCombo").name("按住自动连击"),dt.add(at.bow,"maxChargeTime",.2,2,.05).name("满蓄力时间 (s)"),dt.add(at.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),dt.add(at.bow,"autoFire").name("蓄满自动放箭 (按住连射)");const Z=h(mt,"夸张化 (v9s.22)"),pt=t.animation.stretch;Z.add(pt,"enabled").name("四肢伸缩 开"),Z.add(pt,"swingArm",1,1.8,.01).name("挥出时手臂拉伸"),Z.add(pt,"chargeArm",.7,1,.01).name("蓄力时手臂压缩"),Z.add(pt,"impactSquash",0,.5,.01).name("命中挤压量"),Z.add(pt,"impactDecay",2,30,.5).name("挤压回弹速率 (1/s)"),Z.add(pt,"torsoGain",0,1,.05).name("躯干跟随比例"),Z.add(pt,"volumeExp",0,1.5,.05).name("体积补偿指数");const j=t.animation.swing;Z.add(j,"enabled").name("挥击身体幅度 开"),Z.add(j,"bodyScale",0,1.6,.05).name("躯干 / 骨盆幅度倍率"),Z.add(j,"shoulderLift",0,.12,.005).name("肩部抬升上限 (m)"),Z.add(j,"shoulderPush",0,.1,.005).name("肩部前送上限 (m)"),Z.add(j,"shoulderIn",0,.1,.005).name("双手武器肩内收 (m)"),Z.add(j,"segBlend",0,.35,.01).name("段间姿态过渡 (s)"),Z.add(j.weaponScale,"greatsword",0,1.6,.05).name("大剑幅度倍率");const Mt=t.weaponTrail;Z.add(Mt,"enabled").name("挥击刀光 开"),Z.add(Mt,"life",.04,.4,.01).name("刀光残留 (s)"),Z.add(Mt,"intensity",0,1.5,.05).name("刀光亮度"),Z.add(Mt,"minStep",.005,.1,.005).name("采样最小位移 (m)"),Z.add(t.projectiles,"slashEnabled").name("旧斩击弧 开（已被刀光替代）"),Z.add(t.hitstop,"enabled").name("命中定格 开"),Z.add(t.hitstop,"duration",0,.2,.005).name("定格时长 (s)");const $t=t.weaponWrist;Z.add($t,"enabled").name("腕部滞后 开（关掉=武器焊在手上）"),Z.add($t,"lag",0,.08,.002).name("臂速 → 腕滞后"),Z.add($t,"maxAngle",0,1.2,.02).name("腕滞后上限 (rad)"),Z.add($t,"rate",4,50,1).name("腕部跟随速率 (1/s)"),Z.add($t,"twistLag",0,.06,.002).name("躯干扭转 → 剑横甩"),Z.add($t,"maxTwist",0,.9,.02).name("横甩上限 (rad)");const Bt=t.weaponMount;Z.add(Bt,"twoHandInsetX",0,.3,.01).name("双手武器内收 (m)"),Z.add(Bt,"twoHandGripY",-.5,0,.01).name("副握点在柄上的位置"),Z.add(Bt,"twoHandMaxStretch",1,1.8,.01).name("副手臂长拉伸上限"),Z.add(Bt,"twoHandMinGrip",0,1,.02).name("最低握持权重（1=永不松手）"),Z.add(Bt,"twoHandGripStart",1,1.4,.01).name("开始松手的臂展比"),Z.add(Bt,"twoHandSlideRate",0,30,1).name("握点滑柄跟随速率 (1/s)"),dt.add(at.bow.trajectory,"gravity",0,24,.5).name("箭矢重力 (m/s²)"),dt.add(at.bow.trajectory,"speedMax",8,32,.5).name("满蓄初速 (m/s)"),dt.add(at.bow.trajectory,"homingRange",0,30,1).name("自动瞄准距离 (m)"),dt.add(at.bow.trajectory,"turnRateDeg",0,240,5).name("箭追踪转向 (°/s)"),dt.add(at.bow.trajectory,"homingTime",0,2,.05).name("追踪时长 (s)"),dt.add(at.bow.trajectory,"aimHeightRatio",0,1,.05).name("瞄准点高度"),dt.add(at.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),dt.add(at.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),dt.add(at.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),dt.add(at.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率");const jt=o.abilities;dt.add(jt.arcane,"perWave",1,8,1).name("每波飞弹数"),dt.add(jt.arcane,"waves",1,12,1).name("每次引导波数"),dt.add(jt.arcane,"waveInterval",.05,.8,.01).name("波间隔 (s)"),dt.add(jt.arcane,"spreadDeg",0,20,.5).name("波内散布 (度)"),dt.add(jt.arcane,"spreadTime",0,.6,.01).name("出膛散开时长 (s)"),dt.add(jt.arcane,"spawnDelay",0,.2,.005).name("波内出膛错落 (s)"),dt.add(jt.arcane,"speedJitter",0,.5,.02).name("速度浮动比例"),dt.add(jt.arcane,"turnRateDeg",0,420,10).name("制导转向 (度/秒)"),dt.add(jt.arcane,"retargetInterval",.05,1,.05).name("重新索敌间隔 (s)"),dt.add(jt.arcane,"cooldown",0,3,.05).name("引导结束冷却 (s)"),dt.add(jt.arcane,"speed",3,24,.5).name("飞弹速度"),dt.add(jt.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),dt.add(jt.ring,"radius",.5,5,.1).name("电环半径"),dt.add(jt.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),dt.add(jt.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const ht=h(mt,"攻击动作 / 跨步 / 落地");ht.add(t.animation.attack,"gaitWeight",0,1,.01).name("攻击时步态权重 gw"),ht.add(t.animation.attack,"lowerBodyWeight",0,1,.01).name("挥击跨步权重 lw"),ht.add(t.animation.attack,"blendRate",1,40,1).name("进出攻击平滑速率");const Dt=t.animation.stride;ht.add(Dt,"strideSpeed",0,8,.1).name("攻击等效步速 (m/s)"),ht.add(Dt,"strideScale",0,2.5,.05).name("攻击步幅系数 (0=旧)"),ht.add(Dt,"forwardBias",0,1,.01).name("前冲 / 侧跨占比"),ht.add(Dt,"cycles",1,3,1).name("每段跨步周期数"),ht.add(Dt,"stepPitch",0,1.5,.02).name("跨步腿前后摆 (rad)"),ht.add(Dt,"stepKnee",0,1.5,.02).name("跨步抬膝 (rad)"),ht.add(Dt,"stepSide",0,1,.02).name("跨步侧摆 (rad)"),ht.add(Dt,"stepDip",0,.3,.005).name("跨步重心下沉 (m)"),ht.add(Dt,"stepSway",0,.2,.005).name("跨步骨盆侧移 (m)"),ht.add(Dt,"stepReach",0,.3,.005).name("跨步骨盆前移 (m)"),ht.add(Dt,"stepSideReach",0,.25,.005).name("跨步骨盆侧移 (m)"),ht.add(Dt,"stepDipReach",0,.15,.005).name("跨步骨盆下沉 (m)"),ht.add(Dt,"heavyScale",0,1,.01).name("大剑重击收敛系数"),ht.add(t.animation.landing,"enabled").name("启用跳跃/落地缓冲"),ht.add(t.animation.landing,"duration",.05,1,.01).name("落地缓冲时长 (s)"),ht.add(t.animation.landing,"compressRatio",.05,.9,.01).name("下压段占比"),ht.add(t.animation.landing,"crouchDepth",0,.4,.005).name("重心下沉 (m)"),ht.add(t.animation.landing,"kneeBend",0,1.5,.02).name("屈膝 (rad)"),ht.add(t.animation.landing,"hipPitch",0,1,.02).name("髋前倾补偿 (rad)"),ht.add(t.animation.landing,"upperPitch",0,.6,.01).name("上半身前倾 (rad)"),ht.add(t.animation.landing,"armTuck",0,.8,.02).name("手臂收拢 (rad)"),ht.add(t.animation.landing,"impactSpeed",1,20,.5).name("冲击速度饱和 (m/s)"),ht.add(t.animation.landing,"minScale",0,1,.01).name("最小缓冲强度"),ht.add(t.animation.landing,"jumpAnticipation",0,1,.01).name("起跳预备下蹲"),ht.add(t.animation.landing,"anticipationDuration",.03,.5,.01).name("起跳预备时长 (s)");const V=h(mt,"武器握持");V.add(t.weaponMount,"swordPitchDeg",0,90,1).name("剑前倾角"),V.add(t.weaponMount,"swordYawDeg",0,45,1).name("剑外张角"),V.add(t.weaponMount,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),V.add(t.weaponMount,"staffPitchDeg",0,60,1).name("法杖前倾角");const ue=o.hits,Zt=h(mt,"命中 / 受击 / 击退");Zt.add(ue,"arcDeg",10,120,5).name("命中扇区半角 (°)"),Zt.add(ue,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),Zt.add(ue,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),Zt.add(ue,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),Zt.add(ue.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),Zt.add(ue.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),Zt.add(ue,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),Zt.add(ue,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const Vt=o.targeting,kt=h(mt,"目标辅助");kt.add(Vt,"targetAssist").name("启用目标辅助"),kt.add(Vt,"range",1,14,.5).name("锁定范围 (m)"),kt.add(Vt,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),kt.add(Vt,"frontBias",0,4,.1).name("朝向加权"),kt.add(Vt,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),kt.add(Vt,"maxLungeScale",1,3,.1).name("前冲最大放大");const Et=h(mt,"受击分层"),At=t.hurt;Et.add(At,"enabled").name("启用分层受击 (关=旧版对照)"),Et.add(At,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),Et.add(At,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),Et.add(At,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),Et.add(At,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),Et.add(At,"upperShiftScale",0,1,.01).name("上身位移缩放"),Et.add(At,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),Et.add(At.hitHeight,"light",0,1,.01).name("轻击命中部位"),Et.add(At.hitHeight,"heavy",0,1,.01).name("重击命中部位"),Et.add(At.hitHeight,"knock",0,1,.01).name("击退命中部位"),Et.add(At,"leanLight",0,1.5,.01).name("轻击力度"),Et.add(At,"leanHeavy",0,1.5,.01).name("重击力度"),Et.add(At,"leanKnock",0,1.5,.01).name("击退力度"),Et.add(At,"flashStrength",0,2,.05).name("受击闪光强度"),[{name:"打腹 (abdomen)",p:At.abdomen},{name:"打肩 (shoulder)",p:At.shoulder}].map(({name:ft,p:It})=>{const et=h(Et,ft);return et.add(It,"upperPitch",0,2,.01).name("上身前后倾斜"),et.add(It,"upperRoll",0,2,.01).name("上身侧倾"),et.add(It,"upperYaw",0,1.5,.01).name("肩部扭转"),et.add(It,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),et.add(It,"shift",0,.8,.01).name("身体反应位移"),et.add(It,"drop",0,.4,.01).name("整体下沉"),et.add(It,"back",0,.4,.01).name("屁股向后"),et.add(It,"knee",0,1.6,.01).name("屈膝"),et.add(It,"hip",0,1,.01).name("髋前倾"),et.add(It,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)"),et});const P=h(mt,"派生招"),E=o.links;P.add(E,"enabled").name("总开关 (false=旧连击)"),P.add(E.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),P.add(E.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),P.add(E.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),P.add(E,"sharedCooldown",0,3,.05).name("共享 CD (s)"),P.add(E,"triggerWhileSprinting").name("长跑中可直接触发"),P.add(E.search,"range",1,14,.1).name("索敌距离 (m)"),P.add(E.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),P.add(E.search,"stopDistance",0,3,.05).name("停住距离 (m)");const Y=E.moves["sword-shield"];Y&&(P.add(Y,"enabled").name("剑盾盾击"),P.add(Y,"distance",0,8,.1).name("冲锋极限 (m)"),P.add(Y,"windup",0,.5,.01).name("前摇 (s)"),P.add(Y,"active",0,.8,.01).name("冲锋 / 命中 (s)"),P.add(Y,"recovery",0,.8,.01).name("收势 (s)"),P.add(Y.hit,"radius",0,4,.05).name("命中半径 (m)"),P.add(Y.hit,"width",0,2,.05).name("扫掠半径 (m)"),P.add(Y.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),P.add(Y.hit,"duration",0,1.5,.01).name("僵直 (s)")),P.add(o.hits,"noDamageToPlayer").name("测试限制: 玩家不被击退");const rt=c("相机"),lt=h(rt,"基础");lt.add(t.camera,"pitchDeg",20,80,1).name("俯角"),lt.add(t.camera,"yawDeg",-180,180,1).name("方位角"),lt.add(t.camera,"distance",6,35,.5).name("距离"),lt.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),lt.add(t.camera,"fov",25,90,1).name("FOV");const it=o.camera,Rt=h(rt,"智能构图");Rt.add(it,"radius",2,18,.5).name("威胁评估半径 (m)"),Rt.add(it,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),Rt.add(it,"saturation",.5,8,.1).name("威胁归一化饱和"),Rt.add(it,"pushIn",0,.5,.01).name("无威胁推进比例"),Rt.add(it,"maxPullback",0,1,.02).name("最大拉远比例"),Rt.add(it,"maxOffset",0,6,.1).name("最大构图平移 (m)"),Rt.add(it,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),Rt.add(it,"framingBias",0,1,.05).name("威胁质心平移系数"),Rt.add(it,"attackBoost",0,2,.05).name("挥砍中额外加权"),Rt.add(it.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),Rt.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const K=h(rt,"缩放");return K.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),K.add(t.zoom,"max",1,4,.05).name("最大倍率 (拉远上限)"),K.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),K.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),K.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),K.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),K.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),K.add({reset:i.resetZoom},"reset").name("缩放归 1"),r.forEach(ft=>ft.close()),l.forEach(ft=>ft.close()),a.close(),{gui:a,refreshWeapon:()=>tt.updateDisplay()}}function F0(n,t,e){let i=null,s=Number.POSITIVE_INFINITY;for(const a of n){const o=Math.hypot(t-a.x,e-a.z);o<=a.radius&&o<s&&(i=a,s=o)}return i}function U0(n,t){return n.find(e=>e.id===t)??null}function Lh(n,t,e){if(n.length===0)return null;const i=[...n].sort((r,l)=>r.index-l.index),s=i.findIndex(r=>r.id===t),a=e<0?-1:1,o=s<0?a>0?0:i.length-1:(s+a+i.length)%i.length;return i[o]??null}function z0({stations:n,world:t,view:e,container:i,onResetZoom:s}){const a=i??document.getElementById("lab-panel");let o=null,r=null;const l=new Map,c=document.createElement("div");c.id="lab-toast",c.setAttribute("aria-live","polite"),document.body.appendChild(c);let h=0;function f(g){c.textContent=`${g.index} · ${g.name} — ${g.hint}`,c.style.borderColor=g.color,c.classList.add("is-on"),window.clearTimeout(h),h=window.setTimeout(()=>c.classList.remove("is-on"),5e3)}function d(){return F0(n,t.character.position.x,t.character.position.z)}function u(){const g=d(),p=(g==null?void 0:g.id)??null;if(p===o)return;const x=o!==null;o=p;for(const[_,v]of l)v.classList.toggle("is-active",_===p);r&&(r.textContent=g?`${g.index} · ${g.hint}`:"不在任何工位内：点上面的名字传送，或直接走过去",r.style.color=g?"rgba(206, 226, 244, 0.9)":"rgba(150, 172, 192, 0.62)"),g?f(g):x&&c.classList.remove("is-on")}function m(g){const p=typeof g=="number"?n.find(x=>x.index===g)??null:U0(n,g);return p?(wm(t,p.spawnX,p.spawnZ),t.camera.centroidX=p.spawnX,t.camera.centroidZ=p.spawnZ,e.snapCamera(p.spawnX,t.character.position.y,p.spawnZ),u(),!0):!1}function y(){Tu(t)}if(a){a.textContent="";const g=document.createElement("div");g.className="lab-head",g.textContent="测试工位";const p=document.createElement("span");p.className="lab-tip",p.textContent="[ / ] 切换",g.appendChild(p),a.appendChild(g);for(const v of[...n].sort((R,w)=>R.index-w.index)){const R=document.createElement("button");R.type="button",R.className="lab-row",R.dataset.station=v.id,R.dataset.uiButton="",R.style.setProperty("--lab-color",v.color),R.setAttribute("aria-label",`传送到工位 ${v.index}：${v.name}`);const w=document.createElement("span");w.className="lab-idx",w.textContent=String(v.index);const S=document.createElement("span");S.className="lab-name",S.textContent=v.name,R.append(w,S),R.addEventListener("pointerdown",T=>{T.preventDefault(),T.stopPropagation(),m(v.id)}),a.appendChild(R),l.set(v.id,R)}r=document.createElement("div"),r.className="lab-hint",a.appendChild(r);const x=document.createElement("div");x.className="lab-foot";const _=document.createElement("button");if(_.type="button",_.className="lab-btn",_.dataset.uiButton="",_.textContent="召回假人",_.setAttribute("aria-label","召回全部假人回到各自工位"),_.addEventListener("pointerdown",v=>{v.preventDefault(),v.stopPropagation(),y()}),x.appendChild(_),s){const v=document.createElement("button");v.type="button",v.className="lab-btn",v.dataset.uiButton="",v.textContent="镜头归位",v.setAttribute("aria-label","把镜头缩放恢复到默认"),v.addEventListener("pointerdown",R=>{R.preventDefault(),R.stopPropagation(),s()}),x.appendChild(v)}a.appendChild(x)}return window.addEventListener("keydown",g=>{var p,x;if(!(g.metaKey||g.ctrlKey||g.altKey))if(g.key==="["){const _=Lh(n,((p=d())==null?void 0:p.id)??o,-1);_&&m(_.id)}else if(g.key==="]"){const _=Lh(n,((x=d())==null?void 0:x.id)??o,1);_&&m(_.id)}else g.key==="\\"&&y()}),u(),{goto:m,current:d,tick:u,recall:y,element:a}}const Tr=Math.PI*2,Kn={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},N0=45,O0=50;function B0(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function na(n,t,e){const i=B0(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function H0(n,t){return Math.atan2(n,-t)*180/Math.PI}function Dh(n,t){return Math.abs(((n-t)%360+540)%360-180)}function Ha(n){return(n%360+360)%360}const G0={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function V0(n,t,e,i=8){const s=n.character,a=t.intents,o=Math.hypot(a.moveX,a.moveZ),r=Math.hypot(t.stickRawX,t.stickRawY),l=s.velocity,c=Math.hypot(l.x,l.z),h=o>.001?na(a.moveX,a.moveZ,e):null,f=c>.15?na(l.x,l.z,e):null,d=na(Math.sin(s.facing),Math.cos(s.facing),e),u=a.aimActive&&Math.hypot(a.aimX,a.aimZ)>1e-6?na(a.aimX,a.aimZ,e):null,m=n.targeting,y=m.hasTarget?na(Math.sin(m.targetYaw),Math.cos(m.targetYaw),e):null,g=h!==null&&f!==null?Dh(h,f):null,p=h!==null?Dh(h,d):null,x=g!==null&&g>N0&&o>=.35&&c>=.4;return{inDeg:h,inLen:Math.min(1,o),rawDeg:r>.02?H0(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,r),stickHeld:t.stickHeld,moveDeg:f,speed:c,faceDeg:d,lockDeg:y,lockId:m.targetId,lockDist:m.targetDist,aimDeg:u,gapMove:g,gapFace:p,warnMove:x}}function kh(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>O0&&(n.inLen>=.35||n.speed>=.4)}const Ih="harness.dirDebug";function X0(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const s=e.querySelector("#dirdbg-canvas"),a=e.querySelector("#dirdbg-toggle"),o={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},r=s.getContext("2d");let l=!0;if(!t)try{l=window.localStorage.getItem(Ih)!=="0"}catch{}function c(){e.classList.toggle("is-off",!l),a&&(a.textContent=l?"方向 ⌄":"方向 ▸",a.setAttribute("aria-expanded",String(l)))}c();function h(_){if(l=_,!t)try{window.localStorage.setItem(Ih,_?"1":"0")}catch{}c()}a==null||a.addEventListener("pointerdown",_=>{_.preventDefault(),_.stopPropagation(),h(!l)}),t||window.addEventListener("keydown",_=>{_.key.toLowerCase()==="v"&&!_.metaKey&&!_.ctrlKey&&h(!l)});const f=Math.min(3,Math.max(1,window.devicePixelRatio||1)),d=118;s.width=Math.round(d*f),s.height=Math.round(d*f);let u=G0,m=0,y="",g=8;function p(_){if(!r)return;const v=d,R=d,w=v/2,S=R/2,T=Math.min(v,R)/2-13;r.setTransform(f,0,0,f,0,0),r.clearRect(0,0,v,R),r.beginPath(),r.arc(w,S,T,0,Tr),r.fillStyle="rgba(8, 12, 17, 0.5)",r.fill(),r.lineWidth=1,r.strokeStyle=_.warnMove?"rgba(251, 191, 36, 0.85)":Kn.ring,r.stroke(),r.strokeStyle=Kn.grid,r.beginPath(),r.moveTo(w-T,S),r.lineTo(w+T,S),r.moveTo(w,S-T),r.lineTo(w,S+T),r.stroke();for(let I=0;I<8;I++){const k=I*Math.PI/4,N=w+Math.sin(k)*(T-3),L=S-Math.cos(k)*(T-3),D=w+Math.sin(k)*T,B=S-Math.cos(k)*T;r.beginPath(),r.moveTo(N,L),r.lineTo(D,B),r.stroke()}const b=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;b>0&&(r.save(),r.setLineDash([2,3]),r.strokeStyle=Kn.dead,r.beginPath(),r.arc(w,S,T*b,0,Tr),r.stroke(),r.restore());const M=(I,k,N,L,D=!1,B=1)=>{const U=I*Math.PI/180,z=Math.sin(U),W=-Math.cos(U),mt=T*Math.max(.14,Math.min(1,k)),at=w+z*T*.14,dt=S+W*T*.14,tt=w+z*mt,Z=S+W*mt;if(r.save(),r.globalAlpha=B,r.strokeStyle=N,r.fillStyle=N,r.lineWidth=L,r.lineCap="round",D&&r.setLineDash([3,3]),r.beginPath(),r.moveTo(at,dt),r.lineTo(tt,Z),r.stroke(),!D&&mt>T*.3){const pt=-W,j=z,Mt=5.2;r.beginPath(),r.moveTo(tt+z*1.5,Z+W*1.5),r.lineTo(tt-z*Mt+pt*Mt*.72,Z-W*Mt+j*Mt*.72),r.lineTo(tt-z*Mt-pt*Mt*.72,Z-W*Mt-j*Mt*.72),r.closePath(),r.fill()}r.restore()},C=(I,k)=>{const N=I*Math.PI/180,L=Math.sin(N),D=-Math.cos(N),B=-D,U=L,z=T+1.5,W=z+6.5;r.save(),r.fillStyle=k,r.strokeStyle=k,r.lineWidth=1,r.beginPath(),r.moveTo(w+L*W,S+D*W),r.lineTo(w+L*z+B*4,S+D*z+U*4),r.lineTo(w+L*z-B*4,S+D*z-U*4),r.closePath(),r.fill(),r.restore()};_.lockDeg!==null&&M(_.lockDeg,1,Kn.lock,1,!0,.7),_.rawDeg!==null&&_.stickHeld&&M(_.rawDeg,_.rawLen,Kn.raw,1,!0,.9),_.aimDeg!==null&&M(_.aimDeg,1,Kn.aim,1.6,!0,.95),M(_.faceDeg,1,Kn.face,1.1,!0,.55),_.moveDeg!==null&&M(_.moveDeg,_.speed/Math.max(1,g),Kn.move,5.5,!1,.8),_.inDeg!==null&&M(_.inDeg,_.inLen,Kn.input,2.2),C(_.faceDeg,Kn.face),r.beginPath(),r.arc(w,S,2.2,0,Tr),r.fillStyle="rgba(220, 235, 248, 0.85)",r.fill()}function x(_,v){const R=T=>T===null?"-":String(Math.round(Ha(T)));o.in.textContent=`入 ${R(_.inDeg)}`,o.mv.textContent=`移 ${R(_.moveDeg)}`,o.fc.textContent=`面 ${R(_.faceDeg)}`;const w=T=>T===null?"-":`${Math.round(T)}°`,S=[`Δ入→移 ${w(_.gapMove)}`,`Δ入→面 ${w(_.gapFace)}`];_.speed>.05&&S.push(`v${_.speed.toFixed(1)}`),_.lockDeg!==null&&S.push(`锁#${_.lockId} ${_.lockDist.toFixed(1)}m`),_.aimDeg!==null&&S.push("拖拽瞄准"),o.gap.textContent=S.join("  "),e.classList.toggle("is-warn",_.warnMove||kh(_,v))}return{update(_,v,R){if(!l)return;g=Math.max(1,_.config.moveSpeed*Math.max(1,_.config.sprintMultiplier));const w=V0(_,v,R,g);u=w;const S=_.combat.phase!=="idle";p(w);const T=performance.now(),b=`${w.inDeg}|${w.moveDeg}|${w.faceDeg}|${w.lockId}|${w.aimDeg}|${w.warnMove}|${w.speed.toFixed(1)}`;(T-m>90||b!==y)&&(m=T,y=b,x(w,S),e.dataset.in=w.inDeg===null?"":Ha(w.inDeg).toFixed(1),e.dataset.mv=w.moveDeg===null?"":Ha(w.moveDeg).toFixed(1),e.dataset.fc=Ha(w.faceDeg).toFixed(1),e.dataset.warn=w.warnMove||kh(w,S)?"1":"0")},setEnabled:h,toggle(){return h(!l),l},enabled:()=>l,last:()=>u}}const W0=6,$0=480,Fh=240,Uh=92,Y0=18;function Z0(n,t,e,i){const s=t-n;return{t:i,speed:t,drive:t,raw:t,dv:s,accel:e>1e-4?s/e:0,busy:!1}}function q0(n,t,e,i){const a=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:a,speed:Math.min(a,Math.max(1,i))}}function j0(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function K0(n={}){const t=Math.max(1,n.windowS??W0),e=Math.max(60,n.capacity??$0),i=Math.max(1,n.speedCap??Y0),s=!!(n.container&&n.toggle),a=n.container??document.createElement("div");a.id="motiondbg",n.container||(a.setAttribute("data-ui-region",""),document.body.appendChild(a));const o=['<div id="motiondbg-head"><span>速度(位移) / Δv</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="92"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");a.innerHTML=s?`<div id="motiondbg-body">${o}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${o}</div>`].join("");const r=n.toggle??a.querySelector("#motiondbg-toggle"),l=a.querySelector("#motiondbg-graph"),c=a.querySelector("#motiondbg-read"),h=a.querySelector("#motiondbg-window"),f=a.querySelector("#motiondbg-dir");h.textContent=`${t.toFixed(1)}s`;const d=l.getContext("2d"),u=Math.min(3,Math.max(1,window.devicePixelRatio||1));l.width=Math.round(Fh*u),l.height=Math.round(Uh*u);const m=X0({deadZone:n.deadZone,container:f,embedded:!0});let y=!1;function g(T){y=T,a.classList.toggle("is-off",!T),!s&&r&&(r.textContent=T?"手感 ⌄":"手感 ▸",r.setAttribute("aria-expanded",String(T)),r.setAttribute("aria-label",T?"收起手感调试面板":"展开手感调试面板"))}g(!1),s||(r==null||r.addEventListener("pointerdown",T=>{T.preventDefault(),T.stopPropagation(),g(!y)}),window.addEventListener("keydown",T=>{T.key.toLowerCase()==="v"&&!T.metaKey&&!T.ctrlKey&&g(!y)}));const p=[];let x=0,_=null,v=-1,R={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1};function w(T){const b=T-t;let M=0;for(;M<p.length&&p[M].t<b;)M++;return p.slice(M)}function S(T,b){if(!d)return;const M=Fh,C=Uh;d.setTransform(u,0,0,u,0,0),d.clearRect(0,0,M,C),d.fillStyle="rgba(8, 12, 17, 0.55)",d.fillRect(0,0,M,C);const I=4,k=4,N=M-I-k,L=9,D=46,B=62,U=22,z=b-t,W=j=>I+Math.max(0,Math.min(1,(j-z)/t))*N;for(let j=0;j<T.length;j++){if(!T[j].busy)continue;const Mt=W(T[j].t),$t=j+1<T.length?W(T[j+1].t):Mt+2;d.fillStyle="rgba(251, 146, 60, 0.13)",d.fillRect(Mt,L,Math.max(2,$t-Mt),D)}d.strokeStyle="rgba(150, 190, 220, 0.14)",d.lineWidth=1,d.beginPath();for(const j of[L,L+D/2,L+D])d.moveTo(I,j),d.lineTo(M-k,j);d.moveTo(I,B+U/2),d.lineTo(M-k,B+U/2),d.stroke();const at=Math.max(1,...T.map(j=>j.speed),...T.map(j=>j.drive))*1.15,dt=j=>L+D-j/at*D;if(T.length>1){d.beginPath(),d.moveTo(W(T[0].t),dt(T[0].speed));for(let j=1;j<T.length;j++)d.lineTo(W(T[j].t),dt(T[j].speed));d.strokeStyle="#38bdf8",d.lineWidth=1.8,d.lineJoin="round",d.stroke(),d.lineTo(W(T[T.length-1].t),L+D),d.lineTo(W(T[0].t),L+D),d.closePath(),d.fillStyle="rgba(56, 189, 248, 0.14)",d.fill(),d.beginPath(),d.moveTo(W(T[0].t),dt(T[0].drive));for(let j=1;j<T.length;j++)d.lineTo(W(T[j].t),dt(T[j].drive));d.setLineDash([3,3]),d.strokeStyle="rgba(190, 205, 220, 0.6)",d.lineWidth=1.2,d.stroke(),d.setLineDash([])}let tt=.02;for(const j of T)tt=Math.max(tt,Math.abs(j.dv));tt*=1.1;const Z=B+U/2,pt=U/2;for(const j of T){const Mt=Math.min(pt,Math.abs(j.dv)/tt*pt);d.fillStyle=j.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",d.fillRect(W(j.t)-.7,j.dv>=0?Z-Mt:Z,1.4,Math.max(.5,Mt))}d.font="9px ui-monospace, monospace",d.fillStyle="rgba(190, 214, 234, 0.55)",d.textAlign="left",d.fillText(at.toFixed(1),I+2,L+8),d.fillText("v",I+2,L+D-2),d.fillText("Δv",I+2,B+9),d.textAlign="right",d.fillText("0",M-k-2,L+D-2),d.textAlign="left"}return{dirDebug:m,update(T,b,M){const C=performance.now()/1e3,I=v<0?1/60:Math.max(1e-4,Math.min(.25,C-v));v=C;const k=T.character,N={x:k.position.x,z:k.position.z},L=Math.hypot(k.velocity.x,k.velocity.z),{speed:D,raw:B}=_?q0(_,N,I,i):{speed:0,raw:0},U=Z0(x,D,I,C);U.drive=L,U.raw=B,U.busy=j0(T),_=N,x=D,p.push(U),p.length>e&&p.shift();const z=w(C);let W=0;for(const mt of z)W=Math.max(W,mt.speed);if(R={speed:D,drive:L,raw:B,dv:U.dv,accel:U.accel,peak:W,samples:z.length,windowS:t,busy:U.busy},m.update(T,b,M),y){S(z,C);const mt=U.dv>=0?"+":"";c.textContent=`v ${D.toFixed(2)} · 驱 ${L.toFixed(2)} · 峰 ${W.toFixed(2)} · Δv ${mt}${U.dv.toFixed(3)} · ${z.length} 帧`}},setEnabled:g,toggle(){return g(!y),y},enabled:()=>y,last:()=>({...R}),samples:()=>w(performance.now()/1e3).map(T=>({...T}))}}const J0=["剑盾","双剑","大剑","法杖","弓"],Q0={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击"};function tg(n){return{update(t,e,i,s,a,o,r=!1){const l=t.character,c=l.position,h=l.velocity,f=t.combat,d=t.events.length>0?t.events[t.events.length-1]:null,u=ht=>ht.toFixed(2),m=ht=>(ht*180/Math.PI).toFixed(0),y=J0[ns.indexOf(f.weapon)]??f.weapon,g=Math.round(f.charge*10),p="|".repeat(g)+".".repeat(10-g),x=t.dash,_=x.phase==="active"&&x.duration>0?(1-x.timer/x.duration)*100:0,v=x.phase==="active"?`${x.kind}@${_.toFixed(0)}%`:`${x.kind} cd${u(x.cooldown)}`,R=s.intents.aimActive?`(${u(s.intents.aimX)},${u(s.intents.aimZ)})`:"-",w=h.x*Math.sin(l.bodyYaw)+h.z*Math.cos(l.bodyYaw),S=h.x*Math.cos(l.bodyYaw)-h.z*Math.sin(l.bodyYaw),T=Math.abs(w)+Math.abs(S)+1e-6,b=Math.round(Math.abs(S)/T*100),M=`strafe ${b}%${w<-.05?" back":""}`,C=t.camera,I=`threat ${(C.threat*100).toFixed(0)}%  dist×${u(C.distanceScale)}  off (${u(C.offsetX)},${u(C.offsetZ)})  pitch +${u(C.pitchDelta)}°  n=${C.threatCount}`,k=o?u(o.attackBlend):"-",N=o==null?void 0:o.attackWeights,L=N?`gw ${u(N.gaitScale)}  lw ${u(N.attackLegWeight)}  spd ${u(N.driveSpeed)}`:"-",D=N?`${u(N.gaitScale)}/${u(N.attackLegWeight)}`:"-",B=o?`${o.landing.kind} ${u(o.landing.pulse)} t${u(o.landing.remaining)} vy${u(o.landing.impactVy)}`:"-",U=o?`${o.landing.kind}/${u(o.landing.pulse)}`:"-",z=(o==null?void 0:o.zoom)!==void 0?`zoom ×${u(o.zoom)}`:"-",W=o==null?void 0:o.hurt,mt=W?`hurt ${t.playerHurt.type}  部位h${u(W.hitHeight)}  脉冲p${u(W.pulse)}  上身${u(W.upperShift)}  重心${u(W.comShift)}  后坐${u(W.pelvisBack)}  屈膝${u(W.knee)}`:"-",at=W?`${u(W.hitHeight)}/${u(W.pulse)}/${u(W.knee)}`:"-",dt=o==null?void 0:o.ik,tt=dt?`${dt.active?"on":"off"} w${u(dt.weight)} e${u(dt.maxError)}`:"-",Z=t.playerLink,pt=`link ${Z.kind||"-"}  ${Z.phase}  prog ${u(Z.progress)}  win ${u(Z.linkWindow)}s  cd ${u(Z.cooldown)}s  hits ${Z.hitIds.length}  travel ${u(Z.travelled)}/${u(Z.travel)}m  id ${Z.id}`,j=`${Z.phase}/${Z.kind||"-"}/w${u(Z.linkWindow)}`,Mt=s.lastGesture,$t=Mt?`${Mt.button} ${Mt.kind} ${Mt.heldMs.toFixed(0)}ms d${Mt.distance.toFixed(0)}px ${Mt.angleDeg.toFixed(0)}° taps${Mt.taps}`:"-",Bt=t.dummies.map(ht=>`${ht.id}:${Q0[ht.mode]}`).join("  ");if(r){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${y} ${f.phase} · lk ${Z.phase}${Z.kind?`/${Z.kind}`:""} w${u(Z.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${u(c.x)},${u(c.y)},${u(c.z)})  vel (${u(h.x)},${u(h.y)},${u(h.z)})`,`face ${m(l.facing)}  body ${m(l.bodyYaw)}  head ${m(l.headYaw)}  move ${m(l.moveYaw)}  st${b}%  stick(${u(s.stickX)},${u(s.stickY)}) ${s.source}  str${u(l.stride)}`,`weapon ${y}  ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}  dash ${v}  ab ${k}  gw/lw ${D}  land ${U}  ik ${tt}`,`aim ${R}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${at}`,`dummies ${Bt}  atkCount ${t.dummyAttackCount}  cam ${(C.threat*100).toFixed(0)}% ×${u(C.distanceScale)}  ${z}  lk ${j}`,`event ${d?`${d.type} ${u(d.value)}`:"-"}  scale ${u(a.timeScale)}${a.paused?" [P]":""}  g ${$t}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${u(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${u(c.x)}, ${u(c.y)}, ${u(c.z)})`,`vel  (${u(h.x)}, ${u(h.y)}, ${u(h.z)})`,`grounded ${l.grounded?"Y":"N"}   sprint ${l.sprinting?"Y":"N"}   facing ${m(l.facing)}deg   atkBlend ${k}   ${L}   land ${B}`,mt,`ik ${tt}  clamped ${dt?dt.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${m(l.facing)}  body ${m(l.bodyYaw)}  head ${m(l.headYaw)}  move ${m(l.moveYaw)}  (head-body ${m(l.headYaw-l.bodyYaw)})  ${M}`,`move (${u(s.intents.moveX)}, ${u(s.intents.moveZ)})  stick (${u(s.stickX)}, ${u(s.stickY)})  ${s.source}  aim ${R}`,`weapon ${y}  phase ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}${f.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${x.kind}  phase ${x.phase}  prog ${_.toFixed(0)}%  cd ${u(x.cooldown)}s  id ${x.id}  from (${u(x.fromX)},${u(x.fromZ)}) → to (${u(x.toX)},${u(x.toZ)})`,pt,`camera ${I}  ${z}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m  face ${m(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${p}] ${(f.charge*100).toFixed(0)}%  charging ${f.charging?"Y":"N"}`,`dummies ${Bt}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${u(t.impulse.x)}, ${u(t.impulse.z)})`,`event ${d?`${d.type} ${u(d.value)}`:"-"}   scale ${u(a.timeScale)}${a.paused?" [PAUSED]":""}   gesture ${$t}`].join(`
`)}}}const Ga=["lab","hud","motion","debug"],zh={lab:{short:"工位",full:"测试工位"},hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}},Nh={lab:{toggle:"lab-toggle",panel:"lab-panel"},hud:{toggle:"hud-toggle",panel:"hud"},motion:{toggle:"motiondbg-toggle",panel:"motiondbg"},debug:{toggle:"debug-toggle",panel:"debug-panel"}};function eg(n){var l;const t=Object.fromEntries(Ga.map(c=>[c,document.getElementById(Nh[c].toggle)])),e=Object.fromEntries(Ga.map(c=>[c,document.getElementById(Nh[c].panel)]));let i={},s=null;function a(){var c,h,f;for(const d of Ga){const u=s===d,m=t[d],y=e[d];m&&(m.setAttribute("aria-expanded",String(u)),m.textContent=`${zh[d].short} ${u?"▾":"▸"}`,m.setAttribute("aria-label",`${u?"收起":"展开"}${zh[d].full}`)),y&&y.classList.toggle("is-open",u)}n.classList.toggle("is-compact",s!=="hud"),(c=i.motion)==null||c.setEnabled(s==="motion"),s==="debug"?(h=i.debug)==null||h.open():(f=i.debug)==null||f.close()}function o(c){s=s===c?null:c,a()}function r(){s!==null&&(s=null,a())}for(const c of Ga)(l=t[c])==null||l.addEventListener("pointerdown",h=>{h.preventDefault(),h.stopPropagation(),o(c)});return window.addEventListener("keydown",c=>{c.key.toLowerCase()==="v"&&!c.metaKey&&!c.ctrlKey&&o("motion")}),a(),{hudCompact:()=>s!=="hud",register(c){i=c,a()},toggle:o,closeAll:r,isOpen:c=>s===c}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Cl="170",ng=0,Oh=1,ig=2,ku=1,Iu=2,ui=3,Di=0,Mn=1,Ne=2,Pi=0,Us=1,Ei=2,Bh=3,Hh=4,sg=5,Ki=100,ag=101,og=102,rg=103,cg=104,lg=200,hg=201,dg=202,ug=203,Ec=204,Tc=205,fg=206,pg=207,mg=208,gg=209,xg=210,vg=211,_g=212,yg=213,Mg=214,Ac=0,Rc=1,Cc=2,Hs=3,Pc=4,Lc=5,Dc=6,kc=7,Pl=0,Sg=1,bg=2,Li=0,wg=1,Eg=2,Tg=3,Ag=4,Rg=5,Cg=6,Pg=7,Fu=300,Gs=301,Vs=302,Ic=303,Fc=304,Ko=306,Uc=1e3,Qi=1001,zc=1002,Hn=1003,Lg=1004,Va=1005,ti=1006,Ar=1007,ts=1008,xi=1009,Uu=1010,zu=1011,Sa=1012,Ll=1013,is=1014,pi=1015,Pa=1016,Dl=1017,kl=1018,Xs=1020,Nu=35902,Ou=1021,Bu=1022,Bn=1023,Hu=1024,Gu=1025,zs=1026,Ws=1027,Vu=1028,Il=1029,Xu=1030,Fl=1031,Ul=1033,bo=33776,wo=33777,Eo=33778,To=33779,Nc=35840,Oc=35841,Bc=35842,Hc=35843,Gc=36196,Vc=37492,Xc=37496,Wc=37808,$c=37809,Yc=37810,Zc=37811,qc=37812,jc=37813,Kc=37814,Jc=37815,Qc=37816,tl=37817,el=37818,nl=37819,il=37820,sl=37821,Ao=36492,al=36494,ol=36495,Wu=36283,rl=36284,cl=36285,ll=36286,Dg=3200,kg=3201,$u=0,Ig=1,Ti="",xn="srgb",Ys="srgb-linear",Jo="linear",Pe="srgb",fs=7680,Gh=519,Fg=512,Ug=513,zg=514,Yu=515,Ng=516,Og=517,Bg=518,Hg=519,hl=35044,Vh=35048,Xh="300 es",mi=2e3,Bo=2001;class Zs{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const a=s.indexOf(e);a!==-1&&s.splice(a,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let a=0,o=s.length;a<o;a++)s[a].call(this,t);t.target=null}}}const hn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Wh=1234567;const Ns=Math.PI/180,ba=180/Math.PI;function ni(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(hn[n&255]+hn[n>>8&255]+hn[n>>16&255]+hn[n>>24&255]+"-"+hn[t&255]+hn[t>>8&255]+"-"+hn[t>>16&15|64]+hn[t>>24&255]+"-"+hn[e&63|128]+hn[e>>8&255]+"-"+hn[e>>16&255]+hn[e>>24&255]+hn[i&255]+hn[i>>8&255]+hn[i>>16&255]+hn[i>>24&255]).toLowerCase()}function on(n,t,e){return Math.max(t,Math.min(e,n))}function zl(n,t){return(n%t+t)%t}function Gg(n,t,e,i,s){return i+(n-t)*(s-i)/(e-t)}function Vg(n,t,e){return n!==t?(e-n)/(t-n):0}function pa(n,t,e){return(1-e)*n+e*t}function Xg(n,t,e,i){return pa(n,t,1-Math.exp(-e*i))}function Wg(n,t=1){return t-Math.abs(zl(n,t*2)-t)}function $g(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function Yg(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function Zg(n,t){return n+Math.floor(Math.random()*(t-n+1))}function qg(n,t){return n+Math.random()*(t-n)}function jg(n){return n*(.5-Math.random())}function Kg(n){n!==void 0&&(Wh=n);let t=Wh+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Jg(n){return n*Ns}function Qg(n){return n*ba}function tx(n){return(n&n-1)===0&&n!==0}function ex(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function nx(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function ix(n,t,e,i,s){const a=Math.cos,o=Math.sin,r=a(e/2),l=o(e/2),c=a((t+i)/2),h=o((t+i)/2),f=a((t-i)/2),d=o((t-i)/2),u=a((i-t)/2),m=o((i-t)/2);switch(s){case"XYX":n.set(r*h,l*f,l*d,r*c);break;case"YZY":n.set(l*d,r*h,l*f,r*c);break;case"ZXZ":n.set(l*f,l*d,r*h,r*c);break;case"XZX":n.set(r*h,l*m,l*u,r*c);break;case"YXY":n.set(l*u,r*h,l*m,r*c);break;case"ZYZ":n.set(l*m,l*u,r*h,r*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function On(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Te(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const $h={DEG2RAD:Ns,RAD2DEG:ba,generateUUID:ni,clamp:on,euclideanModulo:zl,mapLinear:Gg,inverseLerp:Vg,lerp:pa,damp:Xg,pingpong:Wg,smoothstep:$g,smootherstep:Yg,randInt:Zg,randFloat:qg,randFloatSpread:jg,seededRandom:Kg,degToRad:Jg,radToDeg:Qg,isPowerOfTwo:tx,ceilPowerOfTwo:ex,floorPowerOfTwo:nx,setQuaternionFromProperEuler:ix,normalize:Te,denormalize:On};class Wt{constructor(t=0,e=0){Wt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(on(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),a=this.x-t.x,o=this.y-t.y;return this.x=a*i-o*s+t.x,this.y=a*s+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class fe{constructor(t,e,i,s,a,o,r,l,c){fe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,a,o,r,l,c)}set(t,e,i,s,a,o,r,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=r,h[3]=e,h[4]=a,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,a=this.elements,o=i[0],r=i[3],l=i[6],c=i[1],h=i[4],f=i[7],d=i[2],u=i[5],m=i[8],y=s[0],g=s[3],p=s[6],x=s[1],_=s[4],v=s[7],R=s[2],w=s[5],S=s[8];return a[0]=o*y+r*x+l*R,a[3]=o*g+r*_+l*w,a[6]=o*p+r*v+l*S,a[1]=c*y+h*x+f*R,a[4]=c*g+h*_+f*w,a[7]=c*p+h*v+f*S,a[2]=d*y+u*x+m*R,a[5]=d*g+u*_+m*w,a[8]=d*p+u*v+m*S,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],a=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*r*c-i*a*h+i*r*l+s*a*c-s*o*l}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],a=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],f=h*o-r*c,d=r*l-h*a,u=c*a-o*l,m=e*f+i*d+s*u;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/m;return t[0]=f*y,t[1]=(s*c-h*i)*y,t[2]=(r*i-s*o)*y,t[3]=d*y,t[4]=(h*e-s*l)*y,t[5]=(s*a-r*e)*y,t[6]=u*y,t[7]=(i*l-c*e)*y,t[8]=(o*e-i*a)*y,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,a,o,r){const l=Math.cos(a),c=Math.sin(a);return this.set(i*l,i*c,-i*(l*o+c*r)+o+t,-s*c,s*l,-s*(-c*o+l*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(Rr.makeScale(t,e)),this}rotate(t){return this.premultiply(Rr.makeRotation(-t)),this}translate(t,e){return this.premultiply(Rr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Rr=new fe;function Zu(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Ho(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function sx(){const n=Ho("canvas");return n.style.display="block",n}const Yh={};function da(n){n in Yh||(Yh[n]=!0,console.warn(n))}function ax(n,t,e){return new Promise(function(i,s){function a(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(a,e);break;default:i()}}setTimeout(a,e)})}function ox(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function rx(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const _e={enabled:!0,workingColorSpace:Ys,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===Pe&&(n.r=gi(n.r),n.g=gi(n.g),n.b=gi(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===Pe&&(n.r=Os(n.r),n.g=Os(n.g),n.b=Os(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Ti?Jo:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function gi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Os(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const Zh=[.64,.33,.3,.6,.15,.06],qh=[.2126,.7152,.0722],jh=[.3127,.329],Kh=new fe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Jh=new fe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);_e.define({[Ys]:{primaries:Zh,whitePoint:jh,transfer:Jo,toXYZ:Kh,fromXYZ:Jh,luminanceCoefficients:qh,workingColorSpaceConfig:{unpackColorSpace:xn},outputColorSpaceConfig:{drawingBufferColorSpace:xn}},[xn]:{primaries:Zh,whitePoint:jh,transfer:Pe,toXYZ:Kh,fromXYZ:Jh,luminanceCoefficients:qh,outputColorSpaceConfig:{drawingBufferColorSpace:xn}}});let ps;class cx{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{ps===void 0&&(ps=Ho("canvas")),ps.width=t.width,ps.height=t.height;const i=ps.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=ps}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Ho("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(0,0,t.width,t.height),a=s.data;for(let o=0;o<a.length;o++)a[o]=gi(a[o]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(gi(e[i]/255)*255):e[i]=gi(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let lx=0;class qu{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:lx++}),this.uuid=ni(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let o=0,r=s.length;o<r;o++)s[o].isDataTexture?a.push(Cr(s[o].image)):a.push(Cr(s[o]))}else a=Cr(s);i.url=a}return e||(t.images[this.uuid]=i),i}}function Cr(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?cx.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let hx=0;class _n extends Zs{constructor(t=_n.DEFAULT_IMAGE,e=_n.DEFAULT_MAPPING,i=Qi,s=Qi,a=ti,o=ts,r=Bn,l=xi,c=_n.DEFAULT_ANISOTROPY,h=Ti){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:hx++}),this.uuid=ni(),this.name="",this.source=new qu(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=a,this.minFilter=o,this.anisotropy=c,this.format=r,this.internalFormat=null,this.type=l,this.offset=new Wt(0,0),this.repeat=new Wt(1,1),this.center=new Wt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new fe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Fu)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Uc:t.x=t.x-Math.floor(t.x);break;case Qi:t.x=t.x<0?0:1;break;case zc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Uc:t.y=t.y-Math.floor(t.y);break;case Qi:t.y=t.y<0?0:1;break;case zc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}_n.DEFAULT_IMAGE=null;_n.DEFAULT_MAPPING=Fu;_n.DEFAULT_ANISOTROPY=1;class Ge{constructor(t=0,e=0,i=0,s=1){Ge.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,a=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*s+o[12]*a,this.y=o[1]*e+o[5]*i+o[9]*s+o[13]*a,this.z=o[2]*e+o[6]*i+o[10]*s+o[14]*a,this.w=o[3]*e+o[7]*i+o[11]*s+o[15]*a,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,a;const l=t.elements,c=l[0],h=l[4],f=l[8],d=l[1],u=l[5],m=l[9],y=l[2],g=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(f-y)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(f+y)<.1&&Math.abs(m+g)<.1&&Math.abs(c+u+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const _=(c+1)/2,v=(u+1)/2,R=(p+1)/2,w=(h+d)/4,S=(f+y)/4,T=(m+g)/4;return _>v&&_>R?_<.01?(i=0,s=.707106781,a=.707106781):(i=Math.sqrt(_),s=w/i,a=S/i):v>R?v<.01?(i=.707106781,s=0,a=.707106781):(s=Math.sqrt(v),i=w/s,a=T/s):R<.01?(i=.707106781,s=.707106781,a=0):(a=Math.sqrt(R),i=S/a,s=T/a),this.set(i,s,a,e),this}let x=Math.sqrt((g-m)*(g-m)+(f-y)*(f-y)+(d-h)*(d-h));return Math.abs(x)<.001&&(x=1),this.x=(g-m)/x,this.y=(f-y)/x,this.z=(d-h)/x,this.w=Math.acos((c+u+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class dx extends Zs{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Ge(0,0,t,e),this.scissorTest=!1,this.viewport=new Ge(0,0,t,e);const s={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ti,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const a=new _n(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);a.flipY=!1,a.generateMipmaps=i.generateMipmaps,a.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let r=0;r<o;r++)this.textures[r]=a.clone(),this.textures[r].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,s=t.textures.length;i<s;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new qu(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ss extends dx{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class ju extends _n{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Hn,this.minFilter=Hn,this.wrapR=Qi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class ux extends _n{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Hn,this.minFilter=Hn,this.wrapR=Qi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class La{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,a,o,r){let l=i[s+0],c=i[s+1],h=i[s+2],f=i[s+3];const d=a[o+0],u=a[o+1],m=a[o+2],y=a[o+3];if(r===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f;return}if(r===1){t[e+0]=d,t[e+1]=u,t[e+2]=m,t[e+3]=y;return}if(f!==y||l!==d||c!==u||h!==m){let g=1-r;const p=l*d+c*u+h*m+f*y,x=p>=0?1:-1,_=1-p*p;if(_>Number.EPSILON){const R=Math.sqrt(_),w=Math.atan2(R,p*x);g=Math.sin(g*w)/R,r=Math.sin(r*w)/R}const v=r*x;if(l=l*g+d*v,c=c*g+u*v,h=h*g+m*v,f=f*g+y*v,g===1-r){const R=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=R,c*=R,h*=R,f*=R}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,i,s,a,o){const r=i[s],l=i[s+1],c=i[s+2],h=i[s+3],f=a[o],d=a[o+1],u=a[o+2],m=a[o+3];return t[e]=r*m+h*f+l*u-c*d,t[e+1]=l*m+h*d+c*f-r*u,t[e+2]=c*m+h*u+r*d-l*f,t[e+3]=h*m-r*f-l*d-c*u,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,a=t._z,o=t._order,r=Math.cos,l=Math.sin,c=r(i/2),h=r(s/2),f=r(a/2),d=l(i/2),u=l(s/2),m=l(a/2);switch(o){case"XYZ":this._x=d*h*f+c*u*m,this._y=c*u*f-d*h*m,this._z=c*h*m+d*u*f,this._w=c*h*f-d*u*m;break;case"YXZ":this._x=d*h*f+c*u*m,this._y=c*u*f-d*h*m,this._z=c*h*m-d*u*f,this._w=c*h*f+d*u*m;break;case"ZXY":this._x=d*h*f-c*u*m,this._y=c*u*f+d*h*m,this._z=c*h*m+d*u*f,this._w=c*h*f-d*u*m;break;case"ZYX":this._x=d*h*f-c*u*m,this._y=c*u*f+d*h*m,this._z=c*h*m-d*u*f,this._w=c*h*f+d*u*m;break;case"YZX":this._x=d*h*f+c*u*m,this._y=c*u*f+d*h*m,this._z=c*h*m-d*u*f,this._w=c*h*f-d*u*m;break;case"XZY":this._x=d*h*f-c*u*m,this._y=c*u*f-d*h*m,this._z=c*h*m+d*u*f,this._w=c*h*f+d*u*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],a=e[8],o=e[1],r=e[5],l=e[9],c=e[2],h=e[6],f=e[10],d=i+r+f;if(d>0){const u=.5/Math.sqrt(d+1);this._w=.25/u,this._x=(h-l)*u,this._y=(a-c)*u,this._z=(o-s)*u}else if(i>r&&i>f){const u=2*Math.sqrt(1+i-r-f);this._w=(h-l)/u,this._x=.25*u,this._y=(s+o)/u,this._z=(a+c)/u}else if(r>f){const u=2*Math.sqrt(1+r-i-f);this._w=(a-c)/u,this._x=(s+o)/u,this._y=.25*u,this._z=(l+h)/u}else{const u=2*Math.sqrt(1+f-i-r);this._w=(o-s)/u,this._x=(a+c)/u,this._y=(l+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(on(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,a=t._z,o=t._w,r=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+o*r+s*c-a*l,this._y=s*h+o*l+a*r-i*c,this._z=a*h+o*c+i*l-s*r,this._w=o*h-i*r-s*l-a*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,s=this._y,a=this._z,o=this._w;let r=o*t._w+i*t._x+s*t._y+a*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=o,this._x=i,this._y=s,this._z=a,this;const l=1-r*r;if(l<=Number.EPSILON){const u=1-e;return this._w=u*o+e*this._w,this._x=u*i+e*this._x,this._y=u*s+e*this._y,this._z=u*a+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,r),f=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*f+this._w*d,this._x=i*f+this._x*d,this._y=s*f+this._y*d,this._z=a*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),a*Math.sin(e),a*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class G{constructor(t=0,e=0,i=0){G.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Qh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Qh.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6]*s,this.y=a[1]*e+a[4]*i+a[7]*s,this.z=a[2]*e+a[5]*i+a[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,a=t.elements,o=1/(a[3]*e+a[7]*i+a[11]*s+a[15]);return this.x=(a[0]*e+a[4]*i+a[8]*s+a[12])*o,this.y=(a[1]*e+a[5]*i+a[9]*s+a[13])*o,this.z=(a[2]*e+a[6]*i+a[10]*s+a[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,a=t.x,o=t.y,r=t.z,l=t.w,c=2*(o*s-r*i),h=2*(r*e-a*s),f=2*(a*i-o*e);return this.x=e+l*c+o*f-r*h,this.y=i+l*h+r*c-a*f,this.z=s+l*f+a*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*s,this.y=a[1]*e+a[5]*i+a[9]*s,this.z=a[2]*e+a[6]*i+a[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,a=t.z,o=e.x,r=e.y,l=e.z;return this.x=s*l-a*r,this.y=a*o-i*l,this.z=i*r-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Pr.copy(this).projectOnVector(t),this.sub(Pr)}reflect(t){return this.sub(Pr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(on(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Pr=new G,Qh=new La;class Da{constructor(t=new G(1/0,1/0,1/0),e=new G(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Un.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Un.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=Un.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const a=i.getAttribute("position");if(e===!0&&a!==void 0&&t.isInstancedMesh!==!0)for(let o=0,r=a.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,Un):Un.fromBufferAttribute(a,o),Un.applyMatrix4(t.matrixWorld),this.expandByPoint(Un);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Xa.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Xa.copy(i.boundingBox)),Xa.applyMatrix4(t.matrixWorld),this.union(Xa)}const s=t.children;for(let a=0,o=s.length;a<o;a++)this.expandByObject(s[a],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Un),Un.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ia),Wa.subVectors(this.max,ia),ms.subVectors(t.a,ia),gs.subVectors(t.b,ia),xs.subVectors(t.c,ia),_i.subVectors(gs,ms),yi.subVectors(xs,gs),Oi.subVectors(ms,xs);let e=[0,-_i.z,_i.y,0,-yi.z,yi.y,0,-Oi.z,Oi.y,_i.z,0,-_i.x,yi.z,0,-yi.x,Oi.z,0,-Oi.x,-_i.y,_i.x,0,-yi.y,yi.x,0,-Oi.y,Oi.x,0];return!Lr(e,ms,gs,xs,Wa)||(e=[1,0,0,0,1,0,0,0,1],!Lr(e,ms,gs,xs,Wa))?!1:($a.crossVectors(_i,yi),e=[$a.x,$a.y,$a.z],Lr(e,ms,gs,xs,Wa))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Un).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Un).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(oi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),oi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),oi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),oi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),oi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),oi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),oi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),oi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(oi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const oi=[new G,new G,new G,new G,new G,new G,new G,new G],Un=new G,Xa=new Da,ms=new G,gs=new G,xs=new G,_i=new G,yi=new G,Oi=new G,ia=new G,Wa=new G,$a=new G,Bi=new G;function Lr(n,t,e,i,s){for(let a=0,o=n.length-3;a<=o;a+=3){Bi.fromArray(n,a);const r=s.x*Math.abs(Bi.x)+s.y*Math.abs(Bi.y)+s.z*Math.abs(Bi.z),l=t.dot(Bi),c=e.dot(Bi),h=i.dot(Bi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>r)return!1}return!0}const fx=new Da,sa=new G,Dr=new G;class Qo{constructor(t=new G,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):fx.setFromPoints(t).getCenter(i);let s=0;for(let a=0,o=t.length;a<o;a++)s=Math.max(s,i.distanceToSquared(t[a]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;sa.subVectors(t,this.center);const e=sa.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(sa,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Dr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(sa.copy(t.center).add(Dr)),this.expandByPoint(sa.copy(t.center).sub(Dr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const ri=new G,kr=new G,Ya=new G,Mi=new G,Ir=new G,Za=new G,Fr=new G;class Nl{constructor(t=new G,e=new G(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,ri)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=ri.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(ri.copy(this.origin).addScaledVector(this.direction,e),ri.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){kr.copy(t).add(e).multiplyScalar(.5),Ya.copy(e).sub(t).normalize(),Mi.copy(this.origin).sub(kr);const a=t.distanceTo(e)*.5,o=-this.direction.dot(Ya),r=Mi.dot(this.direction),l=-Mi.dot(Ya),c=Mi.lengthSq(),h=Math.abs(1-o*o);let f,d,u,m;if(h>0)if(f=o*l-r,d=o*r-l,m=a*h,f>=0)if(d>=-m)if(d<=m){const y=1/h;f*=y,d*=y,u=f*(f+o*d+2*r)+d*(o*f+d+2*l)+c}else d=a,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;else d=-a,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;else d<=-m?(f=Math.max(0,-(-o*a+r)),d=f>0?-a:Math.min(Math.max(-a,-l),a),u=-f*f+d*(d+2*l)+c):d<=m?(f=0,d=Math.min(Math.max(-a,-l),a),u=d*(d+2*l)+c):(f=Math.max(0,-(o*a+r)),d=f>0?a:Math.min(Math.max(-a,-l),a),u=-f*f+d*(d+2*l)+c);else d=o>0?-a:a,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(kr).addScaledVector(Ya,d),u}intersectSphere(t,e){ri.subVectors(t.center,this.origin);const i=ri.dot(this.direction),s=ri.dot(ri)-i*i,a=t.radius*t.radius;if(s>a)return null;const o=Math.sqrt(a-s),r=i-o,l=i+o;return l<0?null:r<0?this.at(l,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,a,o,r,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(i=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(i=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),h>=0?(a=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(a=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),i>o||a>s||((a>i||isNaN(i))&&(i=a),(o<s||isNaN(s))&&(s=o),f>=0?(r=(t.min.z-d.z)*f,l=(t.max.z-d.z)*f):(r=(t.max.z-d.z)*f,l=(t.min.z-d.z)*f),i>l||r>s)||((r>i||i!==i)&&(i=r),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,ri)!==null}intersectTriangle(t,e,i,s,a){Ir.subVectors(e,t),Za.subVectors(i,t),Fr.crossVectors(Ir,Za);let o=this.direction.dot(Fr),r;if(o>0){if(s)return null;r=1}else if(o<0)r=-1,o=-o;else return null;Mi.subVectors(this.origin,t);const l=r*this.direction.dot(Za.crossVectors(Mi,Za));if(l<0)return null;const c=r*this.direction.dot(Ir.cross(Mi));if(c<0||l+c>o)return null;const h=-r*Mi.dot(Fr);return h<0?null:this.at(h/o,a)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Fe{constructor(t,e,i,s,a,o,r,l,c,h,f,d,u,m,y,g){Fe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,a,o,r,l,c,h,f,d,u,m,y,g)}set(t,e,i,s,a,o,r,l,c,h,f,d,u,m,y,g){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=s,p[1]=a,p[5]=o,p[9]=r,p[13]=l,p[2]=c,p[6]=h,p[10]=f,p[14]=d,p[3]=u,p[7]=m,p[11]=y,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Fe().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,s=1/vs.setFromMatrixColumn(t,0).length(),a=1/vs.setFromMatrixColumn(t,1).length(),o=1/vs.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*a,e[5]=i[5]*a,e[6]=i[6]*a,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,a=t.z,o=Math.cos(i),r=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(a),f=Math.sin(a);if(t.order==="XYZ"){const d=o*h,u=o*f,m=r*h,y=r*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=u+m*c,e[5]=d-y*c,e[9]=-r*l,e[2]=y-d*c,e[6]=m+u*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*h,u=l*f,m=c*h,y=c*f;e[0]=d+y*r,e[4]=m*r-u,e[8]=o*c,e[1]=o*f,e[5]=o*h,e[9]=-r,e[2]=u*r-m,e[6]=y+d*r,e[10]=o*l}else if(t.order==="ZXY"){const d=l*h,u=l*f,m=c*h,y=c*f;e[0]=d-y*r,e[4]=-o*f,e[8]=m+u*r,e[1]=u+m*r,e[5]=o*h,e[9]=y-d*r,e[2]=-o*c,e[6]=r,e[10]=o*l}else if(t.order==="ZYX"){const d=o*h,u=o*f,m=r*h,y=r*f;e[0]=l*h,e[4]=m*c-u,e[8]=d*c+y,e[1]=l*f,e[5]=y*c+d,e[9]=u*c-m,e[2]=-c,e[6]=r*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,u=o*c,m=r*l,y=r*c;e[0]=l*h,e[4]=y-d*f,e[8]=m*f+u,e[1]=f,e[5]=o*h,e[9]=-r*h,e[2]=-c*h,e[6]=u*f+m,e[10]=d-y*f}else if(t.order==="XZY"){const d=o*l,u=o*c,m=r*l,y=r*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=d*f+y,e[5]=o*h,e[9]=u*f-m,e[2]=m*f-u,e[6]=r*h,e[10]=y*f+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(px,t,mx)}lookAt(t,e,i){const s=this.elements;return wn.subVectors(t,e),wn.lengthSq()===0&&(wn.z=1),wn.normalize(),Si.crossVectors(i,wn),Si.lengthSq()===0&&(Math.abs(i.z)===1?wn.x+=1e-4:wn.z+=1e-4,wn.normalize(),Si.crossVectors(i,wn)),Si.normalize(),qa.crossVectors(wn,Si),s[0]=Si.x,s[4]=qa.x,s[8]=wn.x,s[1]=Si.y,s[5]=qa.y,s[9]=wn.y,s[2]=Si.z,s[6]=qa.z,s[10]=wn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,a=this.elements,o=i[0],r=i[4],l=i[8],c=i[12],h=i[1],f=i[5],d=i[9],u=i[13],m=i[2],y=i[6],g=i[10],p=i[14],x=i[3],_=i[7],v=i[11],R=i[15],w=s[0],S=s[4],T=s[8],b=s[12],M=s[1],C=s[5],I=s[9],k=s[13],N=s[2],L=s[6],D=s[10],B=s[14],U=s[3],z=s[7],W=s[11],mt=s[15];return a[0]=o*w+r*M+l*N+c*U,a[4]=o*S+r*C+l*L+c*z,a[8]=o*T+r*I+l*D+c*W,a[12]=o*b+r*k+l*B+c*mt,a[1]=h*w+f*M+d*N+u*U,a[5]=h*S+f*C+d*L+u*z,a[9]=h*T+f*I+d*D+u*W,a[13]=h*b+f*k+d*B+u*mt,a[2]=m*w+y*M+g*N+p*U,a[6]=m*S+y*C+g*L+p*z,a[10]=m*T+y*I+g*D+p*W,a[14]=m*b+y*k+g*B+p*mt,a[3]=x*w+_*M+v*N+R*U,a[7]=x*S+_*C+v*L+R*z,a[11]=x*T+_*I+v*D+R*W,a[15]=x*b+_*k+v*B+R*mt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],a=t[12],o=t[1],r=t[5],l=t[9],c=t[13],h=t[2],f=t[6],d=t[10],u=t[14],m=t[3],y=t[7],g=t[11],p=t[15];return m*(+a*l*f-s*c*f-a*r*d+i*c*d+s*r*u-i*l*u)+y*(+e*l*u-e*c*d+a*o*d-s*o*u+s*c*h-a*l*h)+g*(+e*c*f-e*r*u-a*o*f+i*o*u+a*r*h-i*c*h)+p*(-s*r*h-e*l*f+e*r*d+s*o*f-i*o*d+i*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],a=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],f=t[9],d=t[10],u=t[11],m=t[12],y=t[13],g=t[14],p=t[15],x=f*g*c-y*d*c+y*l*u-r*g*u-f*l*p+r*d*p,_=m*d*c-h*g*c-m*l*u+o*g*u+h*l*p-o*d*p,v=h*y*c-m*f*c+m*r*u-o*y*u-h*r*p+o*f*p,R=m*f*l-h*y*l-m*r*d+o*y*d+h*r*g-o*f*g,w=e*x+i*_+s*v+a*R;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const S=1/w;return t[0]=x*S,t[1]=(y*d*a-f*g*a-y*s*u+i*g*u+f*s*p-i*d*p)*S,t[2]=(r*g*a-y*l*a+y*s*c-i*g*c-r*s*p+i*l*p)*S,t[3]=(f*l*a-r*d*a-f*s*c+i*d*c+r*s*u-i*l*u)*S,t[4]=_*S,t[5]=(h*g*a-m*d*a+m*s*u-e*g*u-h*s*p+e*d*p)*S,t[6]=(m*l*a-o*g*a-m*s*c+e*g*c+o*s*p-e*l*p)*S,t[7]=(o*d*a-h*l*a+h*s*c-e*d*c-o*s*u+e*l*u)*S,t[8]=v*S,t[9]=(m*f*a-h*y*a-m*i*u+e*y*u+h*i*p-e*f*p)*S,t[10]=(o*y*a-m*r*a+m*i*c-e*y*c-o*i*p+e*r*p)*S,t[11]=(h*r*a-o*f*a-h*i*c+e*f*c+o*i*u-e*r*u)*S,t[12]=R*S,t[13]=(h*y*s-m*f*s+m*i*d-e*y*d-h*i*g+e*f*g)*S,t[14]=(m*r*s-o*y*s-m*i*l+e*y*l+o*i*g-e*r*g)*S,t[15]=(o*f*s-h*r*s+h*i*l-e*f*l-o*i*d+e*r*d)*S,this}scale(t){const e=this.elements,i=t.x,s=t.y,a=t.z;return e[0]*=i,e[4]*=s,e[8]*=a,e[1]*=i,e[5]*=s,e[9]*=a,e[2]*=i,e[6]*=s,e[10]*=a,e[3]*=i,e[7]*=s,e[11]*=a,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),a=1-i,o=t.x,r=t.y,l=t.z,c=a*o,h=a*r;return this.set(c*o+i,c*r-s*l,c*l+s*r,0,c*r+s*l,h*r+i,h*l-s*o,0,c*l-s*r,h*l+s*o,a*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,a,o){return this.set(1,i,a,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){const s=this.elements,a=e._x,o=e._y,r=e._z,l=e._w,c=a+a,h=o+o,f=r+r,d=a*c,u=a*h,m=a*f,y=o*h,g=o*f,p=r*f,x=l*c,_=l*h,v=l*f,R=i.x,w=i.y,S=i.z;return s[0]=(1-(y+p))*R,s[1]=(u+v)*R,s[2]=(m-_)*R,s[3]=0,s[4]=(u-v)*w,s[5]=(1-(d+p))*w,s[6]=(g+x)*w,s[7]=0,s[8]=(m+_)*S,s[9]=(g-x)*S,s[10]=(1-(d+y))*S,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.elements;let a=vs.set(s[0],s[1],s[2]).length();const o=vs.set(s[4],s[5],s[6]).length(),r=vs.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),t.x=s[12],t.y=s[13],t.z=s[14],zn.copy(this);const c=1/a,h=1/o,f=1/r;return zn.elements[0]*=c,zn.elements[1]*=c,zn.elements[2]*=c,zn.elements[4]*=h,zn.elements[5]*=h,zn.elements[6]*=h,zn.elements[8]*=f,zn.elements[9]*=f,zn.elements[10]*=f,e.setFromRotationMatrix(zn),i.x=a,i.y=o,i.z=r,this}makePerspective(t,e,i,s,a,o,r=mi){const l=this.elements,c=2*a/(e-t),h=2*a/(i-s),f=(e+t)/(e-t),d=(i+s)/(i-s);let u,m;if(r===mi)u=-(o+a)/(o-a),m=-2*o*a/(o-a);else if(r===Bo)u=-o/(o-a),m=-o*a/(o-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=u,l[14]=m,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,s,a,o,r=mi){const l=this.elements,c=1/(e-t),h=1/(i-s),f=1/(o-a),d=(e+t)*c,u=(i+s)*h;let m,y;if(r===mi)m=(o+a)*f,y=-2*f;else if(r===Bo)m=a*f,y=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-u,l[2]=0,l[6]=0,l[10]=y,l[14]=-m,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const vs=new G,zn=new Fe,px=new G(0,0,0),mx=new G(1,1,1),Si=new G,qa=new G,wn=new G,td=new Fe,ed=new La;class ii{constructor(t=0,e=0,i=0,s=ii.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,a=s[0],o=s[4],r=s[8],l=s[1],c=s[5],h=s[9],f=s[2],d=s[6],u=s[10];switch(e){case"XYZ":this._y=Math.asin(on(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-o,a)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-on(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,a),this._z=0);break;case"ZXY":this._x=Math.asin(on(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-on(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,u),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(on(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,a)):(this._x=0,this._y=Math.atan2(r,u));break;case"XZY":this._z=Math.asin(-on(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(r,a)):(this._x=Math.atan2(-h,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return td.makeRotationFromQuaternion(t),this.setFromRotationMatrix(td,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return ed.setFromEuler(this),this.setFromQuaternion(ed,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ii.DEFAULT_ORDER="XYZ";class Ol{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let gx=0;const nd=new G,_s=new La,ci=new Fe,ja=new G,aa=new G,xx=new G,vx=new La,id=new G(1,0,0),sd=new G(0,1,0),ad=new G(0,0,1),od={type:"added"},_x={type:"removed"},ys={type:"childadded",child:null},Ur={type:"childremoved",child:null};class He extends Zs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:gx++}),this.uuid=ni(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=He.DEFAULT_UP.clone();const t=new G,e=new ii,i=new La,s=new G(1,1,1);function a(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(a),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Fe},normalMatrix:{value:new fe}}),this.matrix=new Fe,this.matrixWorld=new Fe,this.matrixAutoUpdate=He.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=He.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ol,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return _s.setFromAxisAngle(t,e),this.quaternion.multiply(_s),this}rotateOnWorldAxis(t,e){return _s.setFromAxisAngle(t,e),this.quaternion.premultiply(_s),this}rotateX(t){return this.rotateOnAxis(id,t)}rotateY(t){return this.rotateOnAxis(sd,t)}rotateZ(t){return this.rotateOnAxis(ad,t)}translateOnAxis(t,e){return nd.copy(t).applyQuaternion(this.quaternion),this.position.add(nd.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(id,t)}translateY(t){return this.translateOnAxis(sd,t)}translateZ(t){return this.translateOnAxis(ad,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ci.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?ja.copy(t):ja.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,!1),aa.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ci.lookAt(aa,ja,this.up):ci.lookAt(ja,aa,this.up),this.quaternion.setFromRotationMatrix(ci),s&&(ci.extractRotation(s.matrixWorld),_s.setFromRotationMatrix(ci),this.quaternion.premultiply(_s.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(od),ys.child=t,this.dispatchEvent(ys),ys.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(_x),Ur.child=t,this.dispatchEvent(Ur),Ur.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ci.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ci.multiply(t.parent.matrixWorld)),t.applyMatrix4(ci),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(od),ys.child=t,this.dispatchEvent(ys),ys.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(aa,t,xx),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(aa,vx,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function a(r,l){return r[l.uuid]===void 0&&(r[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const l=r.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];a(t.shapes,f)}else a(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let l=0,c=this.material.length;l<c;l++)r.push(a(t.materials,this.material[l]));s.material=r}else s.material=a(t.materials,this.material);if(this.children.length>0){s.children=[];for(let r=0;r<this.children.length;r++)s.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let r=0;r<this.animations.length;r++){const l=this.animations[r];s.animations.push(a(t.animations,l))}}if(e){const r=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),f=o(t.shapes),d=o(t.skeletons),u=o(t.animations),m=o(t.nodes);r.length>0&&(i.geometries=r),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),d.length>0&&(i.skeletons=d),u.length>0&&(i.animations=u),m.length>0&&(i.nodes=m)}return i.object=s,i;function o(r){const l=[];for(const c in r){const h=r[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}He.DEFAULT_UP=new G(0,1,0);He.DEFAULT_MATRIX_AUTO_UPDATE=!0;He.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Nn=new G,li=new G,zr=new G,hi=new G,Ms=new G,Ss=new G,rd=new G,Nr=new G,Or=new G,Br=new G,Hr=new Ge,Gr=new Ge,Vr=new Ge;class Rn{constructor(t=new G,e=new G,i=new G){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),Nn.subVectors(t,e),s.cross(Nn);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(t,e,i,s,a){Nn.subVectors(s,e),li.subVectors(i,e),zr.subVectors(t,e);const o=Nn.dot(Nn),r=Nn.dot(li),l=Nn.dot(zr),c=li.dot(li),h=li.dot(zr),f=o*c-r*r;if(f===0)return a.set(0,0,0),null;const d=1/f,u=(c*l-r*h)*d,m=(o*h-r*l)*d;return a.set(1-u-m,m,u)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,hi)===null?!1:hi.x>=0&&hi.y>=0&&hi.x+hi.y<=1}static getInterpolation(t,e,i,s,a,o,r,l){return this.getBarycoord(t,e,i,s,hi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,hi.x),l.addScaledVector(o,hi.y),l.addScaledVector(r,hi.z),l)}static getInterpolatedAttribute(t,e,i,s,a,o){return Hr.setScalar(0),Gr.setScalar(0),Vr.setScalar(0),Hr.fromBufferAttribute(t,e),Gr.fromBufferAttribute(t,i),Vr.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(Hr,a.x),o.addScaledVector(Gr,a.y),o.addScaledVector(Vr,a.z),o}static isFrontFacing(t,e,i,s){return Nn.subVectors(i,e),li.subVectors(t,e),Nn.cross(li).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Nn.subVectors(this.c,this.b),li.subVectors(this.a,this.b),Nn.cross(li).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Rn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Rn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,a){return Rn.getInterpolation(t,this.a,this.b,this.c,e,i,s,a)}containsPoint(t){return Rn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Rn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.b,a=this.c;let o,r;Ms.subVectors(s,i),Ss.subVectors(a,i),Nr.subVectors(t,i);const l=Ms.dot(Nr),c=Ss.dot(Nr);if(l<=0&&c<=0)return e.copy(i);Or.subVectors(t,s);const h=Ms.dot(Or),f=Ss.dot(Or);if(h>=0&&f<=h)return e.copy(s);const d=l*f-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(i).addScaledVector(Ms,o);Br.subVectors(t,a);const u=Ms.dot(Br),m=Ss.dot(Br);if(m>=0&&u<=m)return e.copy(a);const y=u*c-l*m;if(y<=0&&c>=0&&m<=0)return r=c/(c-m),e.copy(i).addScaledVector(Ss,r);const g=h*m-u*f;if(g<=0&&f-h>=0&&u-m>=0)return rd.subVectors(a,s),r=(f-h)/(f-h+(u-m)),e.copy(s).addScaledVector(rd,r);const p=1/(g+y+d);return o=y*p,r=d*p,e.copy(i).addScaledVector(Ms,o).addScaledVector(Ss,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Ku={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},bi={h:0,s:0,l:0},Ka={h:0,s:0,l:0};function Xr(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class ee{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=xn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,_e.toWorkingColorSpace(this,e),this}setRGB(t,e,i,s=_e.workingColorSpace){return this.r=t,this.g=e,this.b=i,_e.toWorkingColorSpace(this,s),this}setHSL(t,e,i,s=_e.workingColorSpace){if(t=zl(t,1),e=on(e,0,1),i=on(i,0,1),e===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+e):i+e-i*e,o=2*i-a;this.r=Xr(o,a,t+1/3),this.g=Xr(o,a,t),this.b=Xr(o,a,t-1/3)}return _e.toWorkingColorSpace(this,s),this}setStyle(t,e=xn){function i(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let a;const o=s[1],r=s[2];switch(o){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,e);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,e);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const a=s[1],o=a.length;if(o===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(a,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=xn){const i=Ku[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=gi(t.r),this.g=gi(t.g),this.b=gi(t.b),this}copyLinearToSRGB(t){return this.r=Os(t.r),this.g=Os(t.g),this.b=Os(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=xn){return _e.fromWorkingColorSpace(dn.copy(this),t),Math.round(on(dn.r*255,0,255))*65536+Math.round(on(dn.g*255,0,255))*256+Math.round(on(dn.b*255,0,255))}getHexString(t=xn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=_e.workingColorSpace){_e.fromWorkingColorSpace(dn.copy(this),e);const i=dn.r,s=dn.g,a=dn.b,o=Math.max(i,s,a),r=Math.min(i,s,a);let l,c;const h=(r+o)/2;if(r===o)l=0,c=0;else{const f=o-r;switch(c=h<=.5?f/(o+r):f/(2-o-r),o){case i:l=(s-a)/f+(s<a?6:0);break;case s:l=(a-i)/f+2;break;case a:l=(i-s)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=_e.workingColorSpace){return _e.fromWorkingColorSpace(dn.copy(this),e),t.r=dn.r,t.g=dn.g,t.b=dn.b,t}getStyle(t=xn){_e.fromWorkingColorSpace(dn.copy(this),t);const e=dn.r,i=dn.g,s=dn.b;return t!==xn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(bi),this.setHSL(bi.h+t,bi.s+e,bi.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(bi),t.getHSL(Ka);const i=pa(bi.h,Ka.h,e),s=pa(bi.s,Ka.s,e),a=pa(bi.l,Ka.l,e);return this.setHSL(i,s,a),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,a=t.elements;return this.r=a[0]*e+a[3]*i+a[6]*s,this.g=a[1]*e+a[4]*i+a[7]*s,this.b=a[2]*e+a[5]*i+a[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const dn=new ee;ee.NAMES=Ku;let yx=0;class os extends Zs{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:yx++}),this.uuid=ni(),this.name="",this.blending=Us,this.side=Di,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ec,this.blendDst=Tc,this.blendEquation=Ki,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ee(0,0,0),this.blendAlpha=0,this.depthFunc=Hs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Gh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=fs,this.stencilZFail=fs,this.stencilZPass=fs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Us&&(i.blending=this.blending),this.side!==Di&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Ec&&(i.blendSrc=this.blendSrc),this.blendDst!==Tc&&(i.blendDst=this.blendDst),this.blendEquation!==Ki&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Hs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Gh&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==fs&&(i.stencilFail=this.stencilFail),this.stencilZFail!==fs&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==fs&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(a){const o=[];for(const r in a){const l=a[r];delete l.metadata,o.push(l)}return o}if(e){const a=s(t.textures),o=s(t.images);a.length>0&&(i.textures=a),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let a=0;a!==s;++a)i[a]=e[a].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Qe extends os{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new ee(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ii,this.combine=Pl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ye=new G,Ja=new Wt;class rn{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=hl,this.updateRanges=[],this.gpuType=pi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Ja.fromBufferAttribute(this,e),Ja.applyMatrix3(t),this.setXY(e,Ja.x,Ja.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Ye.fromBufferAttribute(this,e),Ye.applyMatrix3(t),this.setXYZ(e,Ye.x,Ye.y,Ye.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Ye.fromBufferAttribute(this,e),Ye.applyMatrix4(t),this.setXYZ(e,Ye.x,Ye.y,Ye.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Ye.fromBufferAttribute(this,e),Ye.applyNormalMatrix(t),this.setXYZ(e,Ye.x,Ye.y,Ye.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Ye.fromBufferAttribute(this,e),Ye.transformDirection(t),this.setXYZ(e,Ye.x,Ye.y,Ye.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=On(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Te(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=On(e,this.array)),e}setX(t,e){return this.normalized&&(e=Te(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=On(e,this.array)),e}setY(t,e){return this.normalized&&(e=Te(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=On(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Te(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=On(e,this.array)),e}setW(t,e){return this.normalized&&(e=Te(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Te(e,this.array),i=Te(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=Te(e,this.array),i=Te(i,this.array),s=Te(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,a){return t*=this.itemSize,this.normalized&&(e=Te(e,this.array),i=Te(i,this.array),s=Te(s,this.array),a=Te(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=a,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==hl&&(t.usage=this.usage),t}}class Ju extends rn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Qu extends rn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class Ee extends rn{constructor(t,e,i){super(new Float32Array(t),e,i)}}let Mx=0;const Cn=new Fe,Wr=new He,bs=new G,En=new Da,oa=new Da,nn=new G;class qe extends Zs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Mx++}),this.uuid=ni(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Zu(t)?Qu:Ju)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new fe().getNormalMatrix(t);i.applyNormalMatrix(a),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Cn.makeRotationFromQuaternion(t),this.applyMatrix4(Cn),this}rotateX(t){return Cn.makeRotationX(t),this.applyMatrix4(Cn),this}rotateY(t){return Cn.makeRotationY(t),this.applyMatrix4(Cn),this}rotateZ(t){return Cn.makeRotationZ(t),this.applyMatrix4(Cn),this}translate(t,e,i){return Cn.makeTranslation(t,e,i),this.applyMatrix4(Cn),this}scale(t,e,i){return Cn.makeScale(t,e,i),this.applyMatrix4(Cn),this}lookAt(t){return Wr.lookAt(t),Wr.updateMatrix(),this.applyMatrix4(Wr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(bs).negate(),this.translate(bs.x,bs.y,bs.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let s=0,a=t.length;s<a;s++){const o=t[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Ee(i,3))}else{for(let i=0,s=e.count;i<s;i++){const a=t[i];e.setXYZ(i,a.x,a.y,a.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Da);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new G(-1/0,-1/0,-1/0),new G(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const a=e[i];En.setFromBufferAttribute(a),this.morphTargetsRelative?(nn.addVectors(this.boundingBox.min,En.min),this.boundingBox.expandByPoint(nn),nn.addVectors(this.boundingBox.max,En.max),this.boundingBox.expandByPoint(nn)):(this.boundingBox.expandByPoint(En.min),this.boundingBox.expandByPoint(En.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Qo);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new G,1/0);return}if(t){const i=this.boundingSphere.center;if(En.setFromBufferAttribute(t),e)for(let a=0,o=e.length;a<o;a++){const r=e[a];oa.setFromBufferAttribute(r),this.morphTargetsRelative?(nn.addVectors(En.min,oa.min),En.expandByPoint(nn),nn.addVectors(En.max,oa.max),En.expandByPoint(nn)):(En.expandByPoint(oa.min),En.expandByPoint(oa.max))}En.getCenter(i);let s=0;for(let a=0,o=t.count;a<o;a++)nn.fromBufferAttribute(t,a),s=Math.max(s,i.distanceToSquared(nn));if(e)for(let a=0,o=e.length;a<o;a++){const r=e[a],l=this.morphTargetsRelative;for(let c=0,h=r.count;c<h;c++)nn.fromBufferAttribute(r,c),l&&(bs.fromBufferAttribute(t,c),nn.add(bs)),s=Math.max(s,i.distanceToSquared(nn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,s=e.normal,a=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new rn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),r=[],l=[];for(let T=0;T<i.count;T++)r[T]=new G,l[T]=new G;const c=new G,h=new G,f=new G,d=new Wt,u=new Wt,m=new Wt,y=new G,g=new G;function p(T,b,M){c.fromBufferAttribute(i,T),h.fromBufferAttribute(i,b),f.fromBufferAttribute(i,M),d.fromBufferAttribute(a,T),u.fromBufferAttribute(a,b),m.fromBufferAttribute(a,M),h.sub(c),f.sub(c),u.sub(d),m.sub(d);const C=1/(u.x*m.y-m.x*u.y);isFinite(C)&&(y.copy(h).multiplyScalar(m.y).addScaledVector(f,-u.y).multiplyScalar(C),g.copy(f).multiplyScalar(u.x).addScaledVector(h,-m.x).multiplyScalar(C),r[T].add(y),r[b].add(y),r[M].add(y),l[T].add(g),l[b].add(g),l[M].add(g))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let T=0,b=x.length;T<b;++T){const M=x[T],C=M.start,I=M.count;for(let k=C,N=C+I;k<N;k+=3)p(t.getX(k+0),t.getX(k+1),t.getX(k+2))}const _=new G,v=new G,R=new G,w=new G;function S(T){R.fromBufferAttribute(s,T),w.copy(R);const b=r[T];_.copy(b),_.sub(R.multiplyScalar(R.dot(b))).normalize(),v.crossVectors(w,b);const C=v.dot(l[T])<0?-1:1;o.setXYZW(T,_.x,_.y,_.z,C)}for(let T=0,b=x.length;T<b;++T){const M=x[T],C=M.start,I=M.count;for(let k=C,N=C+I;k<N;k+=3)S(t.getX(k+0)),S(t.getX(k+1)),S(t.getX(k+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new rn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,u=i.count;d<u;d++)i.setXYZ(d,0,0,0);const s=new G,a=new G,o=new G,r=new G,l=new G,c=new G,h=new G,f=new G;if(t)for(let d=0,u=t.count;d<u;d+=3){const m=t.getX(d+0),y=t.getX(d+1),g=t.getX(d+2);s.fromBufferAttribute(e,m),a.fromBufferAttribute(e,y),o.fromBufferAttribute(e,g),h.subVectors(o,a),f.subVectors(s,a),h.cross(f),r.fromBufferAttribute(i,m),l.fromBufferAttribute(i,y),c.fromBufferAttribute(i,g),r.add(h),l.add(h),c.add(h),i.setXYZ(m,r.x,r.y,r.z),i.setXYZ(y,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,u=e.count;d<u;d+=3)s.fromBufferAttribute(e,d+0),a.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,a),f.subVectors(s,a),h.cross(f),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)nn.fromBufferAttribute(t,e),nn.normalize(),t.setXYZ(e,nn.x,nn.y,nn.z)}toNonIndexed(){function t(r,l){const c=r.array,h=r.itemSize,f=r.normalized,d=new c.constructor(l.length*h);let u=0,m=0;for(let y=0,g=l.length;y<g;y++){r.isInterleavedBufferAttribute?u=l[y]*r.data.stride+r.offset:u=l[y]*h;for(let p=0;p<h;p++)d[m++]=c[u++]}return new rn(d,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new qe,i=this.index.array,s=this.attributes;for(const r in s){const l=s[r],c=t(l,i);e.setAttribute(r,c)}const a=this.morphAttributes;for(const r in a){const l=[],c=a[r];for(let h=0,f=c.length;h<f;h++){const d=c[h],u=t(d,i);l.push(u)}e.morphAttributes[r]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,l=o.length;r<l;r++){const c=o[r];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let a=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,d=c.length;f<d;f++){const u=c[f];h.push(u.toJSON(t.data))}h.length>0&&(s[l]=h,a=!0)}a&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const a=t.morphAttributes;for(const c in a){const h=[],f=a[c];for(let d=0,u=f.length;d<u;d++)h.push(f[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const cd=new Fe,Hi=new Nl,Qa=new Qo,ld=new G,to=new G,eo=new G,no=new G,$r=new G,io=new G,hd=new G,so=new G;class ge extends He{constructor(t=new qe,e=new Qe){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,o=s.length;a<o;a++){const r=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=a}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,a=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const r=this.morphTargetInfluences;if(a&&r){io.set(0,0,0);for(let l=0,c=a.length;l<c;l++){const h=r[l],f=a[l];h!==0&&($r.fromBufferAttribute(f,t),o?io.addScaledVector($r,h):io.addScaledVector($r.sub(e),h))}e.add(io)}return e}raycast(t,e){const i=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Qa.copy(i.boundingSphere),Qa.applyMatrix4(a),Hi.copy(t.ray).recast(t.near),!(Qa.containsPoint(Hi.origin)===!1&&(Hi.intersectSphere(Qa,ld)===null||Hi.origin.distanceToSquared(ld)>(t.far-t.near)**2))&&(cd.copy(a).invert(),Hi.copy(t.ray).applyMatrix4(cd),!(i.boundingBox!==null&&Hi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,Hi)))}_computeIntersections(t,e,i){let s;const a=this.geometry,o=this.material,r=a.index,l=a.attributes.position,c=a.attributes.uv,h=a.attributes.uv1,f=a.attributes.normal,d=a.groups,u=a.drawRange;if(r!==null)if(Array.isArray(o))for(let m=0,y=d.length;m<y;m++){const g=d[m],p=o[g.materialIndex],x=Math.max(g.start,u.start),_=Math.min(r.count,Math.min(g.start+g.count,u.start+u.count));for(let v=x,R=_;v<R;v+=3){const w=r.getX(v),S=r.getX(v+1),T=r.getX(v+2);s=ao(this,p,t,i,c,h,f,w,S,T),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,u.start),y=Math.min(r.count,u.start+u.count);for(let g=m,p=y;g<p;g+=3){const x=r.getX(g),_=r.getX(g+1),v=r.getX(g+2);s=ao(this,o,t,i,c,h,f,x,_,v),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let m=0,y=d.length;m<y;m++){const g=d[m],p=o[g.materialIndex],x=Math.max(g.start,u.start),_=Math.min(l.count,Math.min(g.start+g.count,u.start+u.count));for(let v=x,R=_;v<R;v+=3){const w=v,S=v+1,T=v+2;s=ao(this,p,t,i,c,h,f,w,S,T),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,u.start),y=Math.min(l.count,u.start+u.count);for(let g=m,p=y;g<p;g+=3){const x=g,_=g+1,v=g+2;s=ao(this,o,t,i,c,h,f,x,_,v),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}}function Sx(n,t,e,i,s,a,o,r){let l;if(t.side===Mn?l=i.intersectTriangle(o,a,s,!0,r):l=i.intersectTriangle(s,a,o,t.side===Di,r),l===null)return null;so.copy(r),so.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(so);return c<e.near||c>e.far?null:{distance:c,point:so.clone(),object:n}}function ao(n,t,e,i,s,a,o,r,l,c){n.getVertexPosition(r,to),n.getVertexPosition(l,eo),n.getVertexPosition(c,no);const h=Sx(n,t,e,i,to,eo,no,hd);if(h){const f=new G;Rn.getBarycoord(hd,to,eo,no,f),s&&(h.uv=Rn.getInterpolatedAttribute(s,r,l,c,f,new Wt)),a&&(h.uv1=Rn.getInterpolatedAttribute(a,r,l,c,f,new Wt)),o&&(h.normal=Rn.getInterpolatedAttribute(o,r,l,c,f,new G),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:r,b:l,c,normal:new G,materialIndex:0};Rn.getNormal(to,eo,no,d.normal),h.face=d,h.barycoord=f}return h}class Gn extends qe{constructor(t=1,e=1,i=1,s=1,a=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:a,depthSegments:o};const r=this;s=Math.floor(s),a=Math.floor(a),o=Math.floor(o);const l=[],c=[],h=[],f=[];let d=0,u=0;m("z","y","x",-1,-1,i,e,t,o,a,0),m("z","y","x",1,-1,i,e,-t,o,a,1),m("x","z","y",1,1,t,i,e,s,o,2),m("x","z","y",1,-1,t,i,-e,s,o,3),m("x","y","z",1,-1,t,e,i,s,a,4),m("x","y","z",-1,-1,t,e,-i,s,a,5),this.setIndex(l),this.setAttribute("position",new Ee(c,3)),this.setAttribute("normal",new Ee(h,3)),this.setAttribute("uv",new Ee(f,2));function m(y,g,p,x,_,v,R,w,S,T,b){const M=v/S,C=R/T,I=v/2,k=R/2,N=w/2,L=S+1,D=T+1;let B=0,U=0;const z=new G;for(let W=0;W<D;W++){const mt=W*C-k;for(let at=0;at<L;at++){const dt=at*M-I;z[y]=dt*x,z[g]=mt*_,z[p]=N,c.push(z.x,z.y,z.z),z[y]=0,z[g]=0,z[p]=w>0?1:-1,h.push(z.x,z.y,z.z),f.push(at/S),f.push(1-W/T),B+=1}}for(let W=0;W<T;W++)for(let mt=0;mt<S;mt++){const at=d+mt+L*W,dt=d+mt+L*(W+1),tt=d+(mt+1)+L*(W+1),Z=d+(mt+1)+L*W;l.push(at,dt,Z),l.push(dt,tt,Z),U+=6}r.addGroup(u,U,b),u+=U,d+=B}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Gn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function $s(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function gn(n){const t={};for(let e=0;e<n.length;e++){const i=$s(n[e]);for(const s in i)t[s]=i[s]}return t}function bx(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function tf(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:_e.workingColorSpace}const wx={clone:$s,merge:gn};var Ex=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Tx=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ki extends os{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ex,this.fragmentShader=Tx,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=$s(t.uniforms),this.uniformsGroups=bx(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class ef extends He{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Fe,this.projectionMatrix=new Fe,this.projectionMatrixInverse=new Fe,this.coordinateSystem=mi}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const wi=new G,dd=new Wt,ud=new Wt;class Ln extends ef{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=ba*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ns*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ba*2*Math.atan(Math.tan(Ns*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){wi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(wi.x,wi.y).multiplyScalar(-t/wi.z),wi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(wi.x,wi.y).multiplyScalar(-t/wi.z)}getViewSize(t,e){return this.getViewBounds(t,dd,ud),e.subVectors(ud,dd)}setViewOffset(t,e,i,s,a,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ns*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,a=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;a+=o.offsetX*s/l,e-=o.offsetY*i/c,s*=o.width/l,i*=o.height/c}const r=this.filmOffset;r!==0&&(a+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const ws=-90,Es=1;class Ax extends He{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Ln(ws,Es,t,e);s.layers=this.layers,this.add(s);const a=new Ln(ws,Es,t,e);a.layers=this.layers,this.add(a);const o=new Ln(ws,Es,t,e);o.layers=this.layers,this.add(o);const r=new Ln(ws,Es,t,e);r.layers=this.layers,this.add(r);const l=new Ln(ws,Es,t,e);l.layers=this.layers,this.add(l);const c=new Ln(ws,Es,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,s,a,o,r,l]=e;for(const c of e)this.remove(c);if(t===mi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Bo)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[a,o,r,l,c,h]=this.children,f=t.getRenderTarget(),d=t.getActiveCubeFace(),u=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const y=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,a),t.setRenderTarget(i,1,s),t.render(e,o),t.setRenderTarget(i,2,s),t.render(e,r),t.setRenderTarget(i,3,s),t.render(e,l),t.setRenderTarget(i,4,s),t.render(e,c),i.texture.generateMipmaps=y,t.setRenderTarget(i,5,s),t.render(e,h),t.setRenderTarget(f,d,u),t.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class nf extends _n{constructor(t,e,i,s,a,o,r,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Gs,super(t,e,i,s,a,o,r,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Rx extends ss{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new nf(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:ti}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Gn(5,5,5),a=new ki({name:"CubemapFromEquirect",uniforms:$s(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Mn,blending:Pi});a.uniforms.tEquirect.value=e;const o=new ge(s,a),r=e.minFilter;return e.minFilter===ts&&(e.minFilter=ti),new Ax(1,10,this).update(t,o),e.minFilter=r,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,s){const a=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,s);t.setRenderTarget(a)}}const Yr=new G,Cx=new G,Px=new fe;class Zi{constructor(t=new G(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const s=Yr.subVectors(i,e).cross(Cx.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(Yr),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:e.copy(t.start).addScaledVector(i,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||Px.getNormalMatrix(t),s=this.coplanarPoint(Yr).applyMatrix4(t),a=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(a),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Gi=new Qo,oo=new G;class Bl{constructor(t=new Zi,e=new Zi,i=new Zi,s=new Zi,a=new Zi,o=new Zi){this.planes=[t,e,i,s,a,o]}set(t,e,i,s,a,o){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(s),r[4].copy(a),r[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=mi){const i=this.planes,s=t.elements,a=s[0],o=s[1],r=s[2],l=s[3],c=s[4],h=s[5],f=s[6],d=s[7],u=s[8],m=s[9],y=s[10],g=s[11],p=s[12],x=s[13],_=s[14],v=s[15];if(i[0].setComponents(l-a,d-c,g-u,v-p).normalize(),i[1].setComponents(l+a,d+c,g+u,v+p).normalize(),i[2].setComponents(l+o,d+h,g+m,v+x).normalize(),i[3].setComponents(l-o,d-h,g-m,v-x).normalize(),i[4].setComponents(l-r,d-f,g-y,v-_).normalize(),e===mi)i[5].setComponents(l+r,d+f,g+y,v+_).normalize();else if(e===Bo)i[5].setComponents(r,f,y,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Gi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Gi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Gi)}intersectsSprite(t){return Gi.center.set(0,0,0),Gi.radius=.7071067811865476,Gi.applyMatrix4(t.matrixWorld),this.intersectsSphere(Gi)}intersectsSphere(t){const e=this.planes,i=t.center,s=-t.radius;for(let a=0;a<6;a++)if(e[a].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const s=e[i];if(oo.x=s.normal.x>0?t.max.x:t.min.x,oo.y=s.normal.y>0?t.max.y:t.min.y,oo.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(oo)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function sf(){let n=null,t=!1,e=null,i=null;function s(a,o){e(a,o),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(a){e=a},setContext:function(a){n=a}}}function Lx(n){const t=new WeakMap;function e(r,l){const c=r.array,h=r.usage,f=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,h),r.onUploadCallback();let u;if(c instanceof Float32Array)u=n.FLOAT;else if(c instanceof Uint16Array)r.isFloat16BufferAttribute?u=n.HALF_FLOAT:u=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)u=n.SHORT;else if(c instanceof Uint32Array)u=n.UNSIGNED_INT;else if(c instanceof Int32Array)u=n.INT;else if(c instanceof Int8Array)u=n.BYTE;else if(c instanceof Uint8Array)u=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)u=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:u,bytesPerElement:c.BYTES_PER_ELEMENT,version:r.version,size:f}}function i(r,l,c){const h=l.array,f=l.updateRanges;if(n.bindBuffer(c,r),f.length===0)n.bufferSubData(c,0,h);else{f.sort((u,m)=>u.start-m.start);let d=0;for(let u=1;u<f.length;u++){const m=f[d],y=f[u];y.start<=m.start+m.count+1?m.count=Math.max(m.count,y.start+y.count-m.start):(++d,f[d]=y)}f.length=d+1;for(let u=0,m=f.length;u<m;u++){const y=f[u];n.bufferSubData(c,y.start*h.BYTES_PER_ELEMENT,h,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function a(r){r.isInterleavedBufferAttribute&&(r=r.data);const l=t.get(r);l&&(n.deleteBuffer(l.buffer),t.delete(r))}function o(r,l){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const h=t.get(r);(!h||h.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const c=t.get(r);if(c===void 0)t.set(r,e(r,l));else if(c.version<r.version){if(c.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,r,l),c.version=r.version}}return{get:s,remove:a,update:o}}class Pn extends qe{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};const a=t/2,o=e/2,r=Math.floor(i),l=Math.floor(s),c=r+1,h=l+1,f=t/r,d=e/l,u=[],m=[],y=[],g=[];for(let p=0;p<h;p++){const x=p*d-o;for(let _=0;_<c;_++){const v=_*f-a;m.push(v,-x,0),y.push(0,0,1),g.push(_/r),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let x=0;x<r;x++){const _=x+c*p,v=x+c*(p+1),R=x+1+c*(p+1),w=x+1+c*p;u.push(_,v,w),u.push(v,R,w)}this.setIndex(u),this.setAttribute("position",new Ee(m,3)),this.setAttribute("normal",new Ee(y,3)),this.setAttribute("uv",new Ee(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Pn(t.width,t.height,t.widthSegments,t.heightSegments)}}var Dx=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,kx=`#ifdef USE_ALPHAHASH
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
#endif`,Ix=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Fx=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ux=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,zx=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Nx=`#ifdef USE_AOMAP
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
#endif`,Ox=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Bx=`#ifdef USE_BATCHING
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
#endif`,Hx=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Gx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Vx=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Xx=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Wx=`#ifdef USE_IRIDESCENCE
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
#endif`,$x=`#ifdef USE_BUMPMAP
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
#endif`,Yx=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Zx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,qx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,jx=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Kx=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Jx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Qx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,tv=`#if defined( USE_COLOR_ALPHA )
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
#endif`,ev=`#define PI 3.141592653589793
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
} // validated`,nv=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,iv=`vec3 transformedNormal = objectNormal;
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
#endif`,sv=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,av=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ov=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,rv=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,cv="gl_FragColor = linearToOutputTexel( gl_FragColor );",lv=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,hv=`#ifdef USE_ENVMAP
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
#endif`,dv=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,uv=`#ifdef USE_ENVMAP
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
#endif`,fv=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,pv=`#ifdef USE_ENVMAP
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
#endif`,mv=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,gv=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,xv=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,vv=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,_v=`#ifdef USE_GRADIENTMAP
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
}`,yv=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Mv=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Sv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,bv=`uniform bool receiveShadow;
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
#endif`,wv=`#ifdef USE_ENVMAP
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
#endif`,Ev=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Tv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Av=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Rv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Cv=`PhysicalMaterial material;
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
#endif`,Pv=`struct PhysicalMaterial {
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
}`,Lv=`
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
#endif`,Dv=`#if defined( RE_IndirectDiffuse )
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
#endif`,kv=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Iv=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Fv=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Uv=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,zv=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Nv=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Ov=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Bv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Hv=`#if defined( USE_POINTS_UV )
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
#endif`,Gv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Vv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Xv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Wv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,$v=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Yv=`#ifdef USE_MORPHTARGETS
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
#endif`,Zv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,qv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,jv=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Kv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Jv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Qv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,t_=`#ifdef USE_NORMALMAP
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
#endif`,e_=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,n_=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,i_=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,s_=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,a_=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,o_=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,r_=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,c_=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,l_=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,h_=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,d_=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,u_=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,f_=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,p_=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,m_=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,g_=`float getShadowMask() {
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
}`,x_=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,v_=`#ifdef USE_SKINNING
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
#endif`,__=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,y_=`#ifdef USE_SKINNING
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
#endif`,M_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,S_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,b_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,w_=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,E_=`#ifdef USE_TRANSMISSION
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
#endif`,T_=`#ifdef USE_TRANSMISSION
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
#endif`,A_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,R_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,C_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,P_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const L_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,D_=`uniform sampler2D t2D;
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
}`,k_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,I_=`#ifdef ENVMAP_TYPE_CUBE
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
}`,F_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,U_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,z_=`#include <common>
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
}`,N_=`#if DEPTH_PACKING == 3200
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
}`,O_=`#define DISTANCE
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
}`,B_=`#define DISTANCE
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
}`,H_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,G_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,V_=`uniform float scale;
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
}`,X_=`uniform vec3 diffuse;
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
}`,W_=`#include <common>
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
}`,$_=`uniform vec3 diffuse;
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
}`,Y_=`#define LAMBERT
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
}`,Z_=`#define LAMBERT
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
}`,q_=`#define MATCAP
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
}`,j_=`#define MATCAP
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
}`,K_=`#define NORMAL
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
}`,J_=`#define NORMAL
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
}`,Q_=`#define PHONG
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
}`,ty=`#define PHONG
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
}`,ey=`#define STANDARD
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
}`,ny=`#define STANDARD
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
}`,iy=`#define TOON
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
}`,sy=`#define TOON
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
}`,ay=`uniform float size;
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
}`,oy=`uniform vec3 diffuse;
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
}`,ry=`#include <common>
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
}`,cy=`uniform vec3 color;
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
}`,ly=`uniform float rotation;
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
}`,hy=`uniform vec3 diffuse;
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
}`,pe={alphahash_fragment:Dx,alphahash_pars_fragment:kx,alphamap_fragment:Ix,alphamap_pars_fragment:Fx,alphatest_fragment:Ux,alphatest_pars_fragment:zx,aomap_fragment:Nx,aomap_pars_fragment:Ox,batching_pars_vertex:Bx,batching_vertex:Hx,begin_vertex:Gx,beginnormal_vertex:Vx,bsdfs:Xx,iridescence_fragment:Wx,bumpmap_pars_fragment:$x,clipping_planes_fragment:Yx,clipping_planes_pars_fragment:Zx,clipping_planes_pars_vertex:qx,clipping_planes_vertex:jx,color_fragment:Kx,color_pars_fragment:Jx,color_pars_vertex:Qx,color_vertex:tv,common:ev,cube_uv_reflection_fragment:nv,defaultnormal_vertex:iv,displacementmap_pars_vertex:sv,displacementmap_vertex:av,emissivemap_fragment:ov,emissivemap_pars_fragment:rv,colorspace_fragment:cv,colorspace_pars_fragment:lv,envmap_fragment:hv,envmap_common_pars_fragment:dv,envmap_pars_fragment:uv,envmap_pars_vertex:fv,envmap_physical_pars_fragment:wv,envmap_vertex:pv,fog_vertex:mv,fog_pars_vertex:gv,fog_fragment:xv,fog_pars_fragment:vv,gradientmap_pars_fragment:_v,lightmap_pars_fragment:yv,lights_lambert_fragment:Mv,lights_lambert_pars_fragment:Sv,lights_pars_begin:bv,lights_toon_fragment:Ev,lights_toon_pars_fragment:Tv,lights_phong_fragment:Av,lights_phong_pars_fragment:Rv,lights_physical_fragment:Cv,lights_physical_pars_fragment:Pv,lights_fragment_begin:Lv,lights_fragment_maps:Dv,lights_fragment_end:kv,logdepthbuf_fragment:Iv,logdepthbuf_pars_fragment:Fv,logdepthbuf_pars_vertex:Uv,logdepthbuf_vertex:zv,map_fragment:Nv,map_pars_fragment:Ov,map_particle_fragment:Bv,map_particle_pars_fragment:Hv,metalnessmap_fragment:Gv,metalnessmap_pars_fragment:Vv,morphinstance_vertex:Xv,morphcolor_vertex:Wv,morphnormal_vertex:$v,morphtarget_pars_vertex:Yv,morphtarget_vertex:Zv,normal_fragment_begin:qv,normal_fragment_maps:jv,normal_pars_fragment:Kv,normal_pars_vertex:Jv,normal_vertex:Qv,normalmap_pars_fragment:t_,clearcoat_normal_fragment_begin:e_,clearcoat_normal_fragment_maps:n_,clearcoat_pars_fragment:i_,iridescence_pars_fragment:s_,opaque_fragment:a_,packing:o_,premultiplied_alpha_fragment:r_,project_vertex:c_,dithering_fragment:l_,dithering_pars_fragment:h_,roughnessmap_fragment:d_,roughnessmap_pars_fragment:u_,shadowmap_pars_fragment:f_,shadowmap_pars_vertex:p_,shadowmap_vertex:m_,shadowmask_pars_fragment:g_,skinbase_vertex:x_,skinning_pars_vertex:v_,skinning_vertex:__,skinnormal_vertex:y_,specularmap_fragment:M_,specularmap_pars_fragment:S_,tonemapping_fragment:b_,tonemapping_pars_fragment:w_,transmission_fragment:E_,transmission_pars_fragment:T_,uv_pars_fragment:A_,uv_pars_vertex:R_,uv_vertex:C_,worldpos_vertex:P_,background_vert:L_,background_frag:D_,backgroundCube_vert:k_,backgroundCube_frag:I_,cube_vert:F_,cube_frag:U_,depth_vert:z_,depth_frag:N_,distanceRGBA_vert:O_,distanceRGBA_frag:B_,equirect_vert:H_,equirect_frag:G_,linedashed_vert:V_,linedashed_frag:X_,meshbasic_vert:W_,meshbasic_frag:$_,meshlambert_vert:Y_,meshlambert_frag:Z_,meshmatcap_vert:q_,meshmatcap_frag:j_,meshnormal_vert:K_,meshnormal_frag:J_,meshphong_vert:Q_,meshphong_frag:ty,meshphysical_vert:ey,meshphysical_frag:ny,meshtoon_vert:iy,meshtoon_frag:sy,points_vert:ay,points_frag:oy,shadow_vert:ry,shadow_frag:cy,sprite_vert:ly,sprite_frag:hy},Ot={common:{diffuse:{value:new ee(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new fe},alphaMap:{value:null},alphaMapTransform:{value:new fe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new fe}},envmap:{envMap:{value:null},envMapRotation:{value:new fe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new fe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new fe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new fe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new fe},normalScale:{value:new Wt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new fe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new fe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new fe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new fe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ee(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ee(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new fe},alphaTest:{value:0},uvTransform:{value:new fe}},sprite:{diffuse:{value:new ee(16777215)},opacity:{value:1},center:{value:new Wt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new fe},alphaMap:{value:null},alphaMapTransform:{value:new fe},alphaTest:{value:0}}},Qn={basic:{uniforms:gn([Ot.common,Ot.specularmap,Ot.envmap,Ot.aomap,Ot.lightmap,Ot.fog]),vertexShader:pe.meshbasic_vert,fragmentShader:pe.meshbasic_frag},lambert:{uniforms:gn([Ot.common,Ot.specularmap,Ot.envmap,Ot.aomap,Ot.lightmap,Ot.emissivemap,Ot.bumpmap,Ot.normalmap,Ot.displacementmap,Ot.fog,Ot.lights,{emissive:{value:new ee(0)}}]),vertexShader:pe.meshlambert_vert,fragmentShader:pe.meshlambert_frag},phong:{uniforms:gn([Ot.common,Ot.specularmap,Ot.envmap,Ot.aomap,Ot.lightmap,Ot.emissivemap,Ot.bumpmap,Ot.normalmap,Ot.displacementmap,Ot.fog,Ot.lights,{emissive:{value:new ee(0)},specular:{value:new ee(1118481)},shininess:{value:30}}]),vertexShader:pe.meshphong_vert,fragmentShader:pe.meshphong_frag},standard:{uniforms:gn([Ot.common,Ot.envmap,Ot.aomap,Ot.lightmap,Ot.emissivemap,Ot.bumpmap,Ot.normalmap,Ot.displacementmap,Ot.roughnessmap,Ot.metalnessmap,Ot.fog,Ot.lights,{emissive:{value:new ee(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:pe.meshphysical_vert,fragmentShader:pe.meshphysical_frag},toon:{uniforms:gn([Ot.common,Ot.aomap,Ot.lightmap,Ot.emissivemap,Ot.bumpmap,Ot.normalmap,Ot.displacementmap,Ot.gradientmap,Ot.fog,Ot.lights,{emissive:{value:new ee(0)}}]),vertexShader:pe.meshtoon_vert,fragmentShader:pe.meshtoon_frag},matcap:{uniforms:gn([Ot.common,Ot.bumpmap,Ot.normalmap,Ot.displacementmap,Ot.fog,{matcap:{value:null}}]),vertexShader:pe.meshmatcap_vert,fragmentShader:pe.meshmatcap_frag},points:{uniforms:gn([Ot.points,Ot.fog]),vertexShader:pe.points_vert,fragmentShader:pe.points_frag},dashed:{uniforms:gn([Ot.common,Ot.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:pe.linedashed_vert,fragmentShader:pe.linedashed_frag},depth:{uniforms:gn([Ot.common,Ot.displacementmap]),vertexShader:pe.depth_vert,fragmentShader:pe.depth_frag},normal:{uniforms:gn([Ot.common,Ot.bumpmap,Ot.normalmap,Ot.displacementmap,{opacity:{value:1}}]),vertexShader:pe.meshnormal_vert,fragmentShader:pe.meshnormal_frag},sprite:{uniforms:gn([Ot.sprite,Ot.fog]),vertexShader:pe.sprite_vert,fragmentShader:pe.sprite_frag},background:{uniforms:{uvTransform:{value:new fe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:pe.background_vert,fragmentShader:pe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new fe}},vertexShader:pe.backgroundCube_vert,fragmentShader:pe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:pe.cube_vert,fragmentShader:pe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:pe.equirect_vert,fragmentShader:pe.equirect_frag},distanceRGBA:{uniforms:gn([Ot.common,Ot.displacementmap,{referencePosition:{value:new G},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:pe.distanceRGBA_vert,fragmentShader:pe.distanceRGBA_frag},shadow:{uniforms:gn([Ot.lights,Ot.fog,{color:{value:new ee(0)},opacity:{value:1}}]),vertexShader:pe.shadow_vert,fragmentShader:pe.shadow_frag}};Qn.physical={uniforms:gn([Qn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new fe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new fe},clearcoatNormalScale:{value:new Wt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new fe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new fe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new fe},sheen:{value:0},sheenColor:{value:new ee(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new fe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new fe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new fe},transmissionSamplerSize:{value:new Wt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new fe},attenuationDistance:{value:0},attenuationColor:{value:new ee(0)},specularColor:{value:new ee(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new fe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new fe},anisotropyVector:{value:new Wt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new fe}}]),vertexShader:pe.meshphysical_vert,fragmentShader:pe.meshphysical_frag};const ro={r:0,b:0,g:0},Vi=new ii,dy=new Fe;function uy(n,t,e,i,s,a,o){const r=new ee(0);let l=a===!0?0:1,c,h,f=null,d=0,u=null;function m(x){let _=x.isScene===!0?x.background:null;return _&&_.isTexture&&(_=(x.backgroundBlurriness>0?e:t).get(_)),_}function y(x){let _=!1;const v=m(x);v===null?p(r,l):v&&v.isColor&&(p(v,1),_=!0);const R=n.xr.getEnvironmentBlendMode();R==="additive"?i.buffers.color.setClear(0,0,0,1,o):R==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||_)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(x,_){const v=m(_);v&&(v.isCubeTexture||v.mapping===Ko)?(h===void 0&&(h=new ge(new Gn(1,1,1),new ki({name:"BackgroundCubeMaterial",uniforms:$s(Qn.backgroundCube.uniforms),vertexShader:Qn.backgroundCube.vertexShader,fragmentShader:Qn.backgroundCube.fragmentShader,side:Mn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,w,S){this.matrixWorld.copyPosition(S.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Vi.copy(_.backgroundRotation),Vi.x*=-1,Vi.y*=-1,Vi.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Vi.y*=-1,Vi.z*=-1),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(dy.makeRotationFromEuler(Vi)),h.material.toneMapped=_e.getTransfer(v.colorSpace)!==Pe,(f!==v||d!==v.version||u!==n.toneMapping)&&(h.material.needsUpdate=!0,f=v,d=v.version,u=n.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new ge(new Pn(2,2),new ki({name:"BackgroundMaterial",uniforms:$s(Qn.background.uniforms),vertexShader:Qn.background.vertexShader,fragmentShader:Qn.background.fragmentShader,side:Di,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.toneMapped=_e.getTransfer(v.colorSpace)!==Pe,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(f!==v||d!==v.version||u!==n.toneMapping)&&(c.material.needsUpdate=!0,f=v,d=v.version,u=n.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null))}function p(x,_){x.getRGB(ro,tf(n)),i.buffers.color.setClear(ro.r,ro.g,ro.b,_,o)}return{getClearColor:function(){return r},setClearColor:function(x,_=1){r.set(x),l=_,p(r,l)},getClearAlpha:function(){return l},setClearAlpha:function(x){l=x,p(r,l)},render:y,addToRenderList:g}}function fy(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null);let a=s,o=!1;function r(M,C,I,k,N){let L=!1;const D=f(k,I,C);a!==D&&(a=D,c(a.object)),L=u(M,k,I,N),L&&m(M,k,I,N),N!==null&&t.update(N,n.ELEMENT_ARRAY_BUFFER),(L||o)&&(o=!1,v(M,C,I,k),N!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(N).buffer))}function l(){return n.createVertexArray()}function c(M){return n.bindVertexArray(M)}function h(M){return n.deleteVertexArray(M)}function f(M,C,I){const k=I.wireframe===!0;let N=i[M.id];N===void 0&&(N={},i[M.id]=N);let L=N[C.id];L===void 0&&(L={},N[C.id]=L);let D=L[k];return D===void 0&&(D=d(l()),L[k]=D),D}function d(M){const C=[],I=[],k=[];for(let N=0;N<e;N++)C[N]=0,I[N]=0,k[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:I,attributeDivisors:k,object:M,attributes:{},index:null}}function u(M,C,I,k){const N=a.attributes,L=C.attributes;let D=0;const B=I.getAttributes();for(const U in B)if(B[U].location>=0){const W=N[U];let mt=L[U];if(mt===void 0&&(U==="instanceMatrix"&&M.instanceMatrix&&(mt=M.instanceMatrix),U==="instanceColor"&&M.instanceColor&&(mt=M.instanceColor)),W===void 0||W.attribute!==mt||mt&&W.data!==mt.data)return!0;D++}return a.attributesNum!==D||a.index!==k}function m(M,C,I,k){const N={},L=C.attributes;let D=0;const B=I.getAttributes();for(const U in B)if(B[U].location>=0){let W=L[U];W===void 0&&(U==="instanceMatrix"&&M.instanceMatrix&&(W=M.instanceMatrix),U==="instanceColor"&&M.instanceColor&&(W=M.instanceColor));const mt={};mt.attribute=W,W&&W.data&&(mt.data=W.data),N[U]=mt,D++}a.attributes=N,a.attributesNum=D,a.index=k}function y(){const M=a.newAttributes;for(let C=0,I=M.length;C<I;C++)M[C]=0}function g(M){p(M,0)}function p(M,C){const I=a.newAttributes,k=a.enabledAttributes,N=a.attributeDivisors;I[M]=1,k[M]===0&&(n.enableVertexAttribArray(M),k[M]=1),N[M]!==C&&(n.vertexAttribDivisor(M,C),N[M]=C)}function x(){const M=a.newAttributes,C=a.enabledAttributes;for(let I=0,k=C.length;I<k;I++)C[I]!==M[I]&&(n.disableVertexAttribArray(I),C[I]=0)}function _(M,C,I,k,N,L,D){D===!0?n.vertexAttribIPointer(M,C,I,N,L):n.vertexAttribPointer(M,C,I,k,N,L)}function v(M,C,I,k){y();const N=k.attributes,L=I.getAttributes(),D=C.defaultAttributeValues;for(const B in L){const U=L[B];if(U.location>=0){let z=N[B];if(z===void 0&&(B==="instanceMatrix"&&M.instanceMatrix&&(z=M.instanceMatrix),B==="instanceColor"&&M.instanceColor&&(z=M.instanceColor)),z!==void 0){const W=z.normalized,mt=z.itemSize,at=t.get(z);if(at===void 0)continue;const dt=at.buffer,tt=at.type,Z=at.bytesPerElement,pt=tt===n.INT||tt===n.UNSIGNED_INT||z.gpuType===Ll;if(z.isInterleavedBufferAttribute){const j=z.data,Mt=j.stride,$t=z.offset;if(j.isInstancedInterleavedBuffer){for(let Bt=0;Bt<U.locationSize;Bt++)p(U.location+Bt,j.meshPerAttribute);M.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let Bt=0;Bt<U.locationSize;Bt++)g(U.location+Bt);n.bindBuffer(n.ARRAY_BUFFER,dt);for(let Bt=0;Bt<U.locationSize;Bt++)_(U.location+Bt,mt/U.locationSize,tt,W,Mt*Z,($t+mt/U.locationSize*Bt)*Z,pt)}else{if(z.isInstancedBufferAttribute){for(let j=0;j<U.locationSize;j++)p(U.location+j,z.meshPerAttribute);M.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=z.meshPerAttribute*z.count)}else for(let j=0;j<U.locationSize;j++)g(U.location+j);n.bindBuffer(n.ARRAY_BUFFER,dt);for(let j=0;j<U.locationSize;j++)_(U.location+j,mt/U.locationSize,tt,W,mt*Z,mt/U.locationSize*j*Z,pt)}}else if(D!==void 0){const W=D[B];if(W!==void 0)switch(W.length){case 2:n.vertexAttrib2fv(U.location,W);break;case 3:n.vertexAttrib3fv(U.location,W);break;case 4:n.vertexAttrib4fv(U.location,W);break;default:n.vertexAttrib1fv(U.location,W)}}}}x()}function R(){T();for(const M in i){const C=i[M];for(const I in C){const k=C[I];for(const N in k)h(k[N].object),delete k[N];delete C[I]}delete i[M]}}function w(M){if(i[M.id]===void 0)return;const C=i[M.id];for(const I in C){const k=C[I];for(const N in k)h(k[N].object),delete k[N];delete C[I]}delete i[M.id]}function S(M){for(const C in i){const I=i[C];if(I[M.id]===void 0)continue;const k=I[M.id];for(const N in k)h(k[N].object),delete k[N];delete I[M.id]}}function T(){b(),o=!0,a!==s&&(a=s,c(a.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:r,reset:T,resetDefaultState:b,dispose:R,releaseStatesOfGeometry:w,releaseStatesOfProgram:S,initAttributes:y,enableAttribute:g,disableUnusedAttributes:x}}function py(n,t,e){let i;function s(c){i=c}function a(c,h){n.drawArrays(i,c,h),e.update(h,i,1)}function o(c,h,f){f!==0&&(n.drawArraysInstanced(i,c,h,f),e.update(h,i,f))}function r(c,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,f);let u=0;for(let m=0;m<f;m++)u+=h[m];e.update(u,i,1)}function l(c,h,f,d){if(f===0)return;const u=t.get("WEBGL_multi_draw");if(u===null)for(let m=0;m<c.length;m++)o(c[m],h[m],d[m]);else{u.multiDrawArraysInstancedWEBGL(i,c,0,h,0,d,0,f);let m=0;for(let y=0;y<f;y++)m+=h[y]*d[y];e.update(m,i,1)}}this.setMode=s,this.render=a,this.renderInstances=o,this.renderMultiDraw=r,this.renderMultiDrawInstances=l}function my(n,t,e,i){let s;function a(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const S=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(S.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(S){return!(S!==Bn&&i.convert(S)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(S){const T=S===Pa&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(S!==xi&&i.convert(S)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&S!==pi&&!T)}function l(S){if(S==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";S="mediump"}return S==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),x=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),_=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),R=m>0,w=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:r,precision:c,logarithmicDepthBuffer:f,reverseDepthBuffer:d,maxTextures:u,maxVertexTextures:m,maxTextureSize:y,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:x,maxVaryings:_,maxFragmentUniforms:v,vertexTextures:R,maxSamples:w}}function gy(n){const t=this;let e=null,i=0,s=!1,a=!1;const o=new Zi,r=new fe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const u=f.length!==0||d||i!==0||s;return s=d,i=f.length,u},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(f,d){e=h(f,d,0)},this.setState=function(f,d,u){const m=f.clippingPlanes,y=f.clipIntersection,g=f.clipShadows,p=n.get(f);if(!s||m===null||m.length===0||a&&!g)a?h(null):c();else{const x=a?0:i,_=x*4;let v=p.clippingState||null;l.value=v,v=h(m,d,_,u);for(let R=0;R!==_;++R)v[R]=e[R];p.clippingState=v,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(f,d,u,m){const y=f!==null?f.length:0;let g=null;if(y!==0){if(g=l.value,m!==!0||g===null){const p=u+y*4,x=d.matrixWorldInverse;r.getNormalMatrix(x),(g===null||g.length<p)&&(g=new Float32Array(p));for(let _=0,v=u;_!==y;++_,v+=4)o.copy(f[_]).applyMatrix4(x,r),o.normal.toArray(g,v),g[v+3]=o.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=y,t.numIntersection=0,g}}function xy(n){let t=new WeakMap;function e(o,r){return r===Ic?o.mapping=Gs:r===Fc&&(o.mapping=Vs),o}function i(o){if(o&&o.isTexture){const r=o.mapping;if(r===Ic||r===Fc)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Rx(l.height);return c.fromEquirectangularTexture(n,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){const r=o.target;r.removeEventListener("dispose",s);const l=t.get(r);l!==void 0&&(t.delete(r),l.dispose())}function a(){t=new WeakMap}return{get:i,dispose:a}}class af extends ef{constructor(t=-1,e=1,i=1,s=-1,a=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=a,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,a,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=i-t,o=i+t,r=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=c*this.view.offsetX,o=a+c*this.view.width,r-=h*this.view.offsetY,l=r-h*this.view.height}this.projectionMatrix.makeOrthographic(a,o,r,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const ks=4,fd=[.125,.215,.35,.446,.526,.582],Ji=20,Zr=new af,pd=new ee;let qr=null,jr=0,Kr=0,Jr=!1;const qi=(1+Math.sqrt(5))/2,Ts=1/qi,md=[new G(-qi,Ts,0),new G(qi,Ts,0),new G(-Ts,0,qi),new G(Ts,0,qi),new G(0,qi,-Ts),new G(0,qi,Ts),new G(-1,1,-1),new G(1,1,-1),new G(-1,1,1),new G(1,1,1)];class gd{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100){qr=this._renderer.getRenderTarget(),jr=this._renderer.getActiveCubeFace(),Kr=this._renderer.getActiveMipmapLevel(),Jr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(t,i,s,a),e>0&&this._blur(a,0,0,e),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=_d(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=vd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(qr,jr,Kr),this._renderer.xr.enabled=Jr,t.scissorTest=!1,co(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Gs||t.mapping===Vs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),qr=this._renderer.getRenderTarget(),jr=this._renderer.getActiveCubeFace(),Kr=this._renderer.getActiveMipmapLevel(),Jr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:ti,minFilter:ti,generateMipmaps:!1,type:Pa,format:Bn,colorSpace:Ys,depthBuffer:!1},s=xd(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=xd(t,e,i);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=vy(a)),this._blurMaterial=_y(a,t,e)}return s}_compileMaterial(t){const e=new ge(this._lodPlanes[0],t);this._renderer.compile(e,Zr)}_sceneToCubeUV(t,e,i,s){const r=new Ln(90,1,e,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,d=h.toneMapping;h.getClearColor(pd),h.toneMapping=Li,h.autoClear=!1;const u=new Qe({name:"PMREM.Background",side:Mn,depthWrite:!1,depthTest:!1}),m=new ge(new Gn,u);let y=!1;const g=t.background;g?g.isColor&&(u.color.copy(g),t.background=null,y=!0):(u.color.copy(pd),y=!0);for(let p=0;p<6;p++){const x=p%3;x===0?(r.up.set(0,l[p],0),r.lookAt(c[p],0,0)):x===1?(r.up.set(0,0,l[p]),r.lookAt(0,c[p],0)):(r.up.set(0,l[p],0),r.lookAt(0,0,c[p]));const _=this._cubeSize;co(s,x*_,p>2?_:0,_,_),h.setRenderTarget(s),y&&h.render(m,r),h.render(t,r)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=d,h.autoClear=f,t.background=g}_textureToCubeUV(t,e){const i=this._renderer,s=t.mapping===Gs||t.mapping===Vs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=_d()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=vd());const a=s?this._cubemapMaterial:this._equirectMaterial,o=new ge(this._lodPlanes[0],a),r=a.uniforms;r.envMap.value=t;const l=this._cubeSize;co(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(o,Zr)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let a=1;a<s;a++){const o=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),r=md[(s-a-1)%md.length];this._blur(t,a-1,a,o,r)}e.autoClear=i}_blur(t,e,i,s,a){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,s,"latitudinal",a),this._halfBlur(o,t,i,i,s,"longitudinal",a)}_halfBlur(t,e,i,s,a,o,r){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new ge(this._lodPlanes[s],c),d=c.uniforms,u=this._sizeLods[i]-1,m=isFinite(a)?Math.PI/(2*u):2*Math.PI/(2*Ji-1),y=a/m,g=isFinite(a)?1+Math.floor(h*y):Ji;g>Ji&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Ji}`);const p=[];let x=0;for(let S=0;S<Ji;++S){const T=S/y,b=Math.exp(-T*T/2);p.push(b),S===0?x+=b:S<g&&(x+=2*b)}for(let S=0;S<p.length;S++)p[S]=p[S]/x;d.envMap.value=t.texture,d.samples.value=g,d.weights.value=p,d.latitudinal.value=o==="latitudinal",r&&(d.poleAxis.value=r);const{_lodMax:_}=this;d.dTheta.value=m,d.mipInt.value=_-i;const v=this._sizeLods[s],R=3*v*(s>_-ks?s-_+ks:0),w=4*(this._cubeSize-v);co(e,R,w,3*v,2*v),l.setRenderTarget(e),l.render(f,Zr)}}function vy(n){const t=[],e=[],i=[];let s=n;const a=n-ks+1+fd.length;for(let o=0;o<a;o++){const r=Math.pow(2,s);e.push(r);let l=1/r;o>n-ks?l=fd[o-n+ks-1]:o===0&&(l=0),i.push(l);const c=1/(r-2),h=-c,f=1+c,d=[h,h,f,h,f,f,h,h,f,f,h,f],u=6,m=6,y=3,g=2,p=1,x=new Float32Array(y*m*u),_=new Float32Array(g*m*u),v=new Float32Array(p*m*u);for(let w=0;w<u;w++){const S=w%3*2/3-1,T=w>2?0:-1,b=[S,T,0,S+2/3,T,0,S+2/3,T+1,0,S,T,0,S+2/3,T+1,0,S,T+1,0];x.set(b,y*m*w),_.set(d,g*m*w);const M=[w,w,w,w,w,w];v.set(M,p*m*w)}const R=new qe;R.setAttribute("position",new rn(x,y)),R.setAttribute("uv",new rn(_,g)),R.setAttribute("faceIndex",new rn(v,p)),t.push(R),s>ks&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function xd(n,t,e){const i=new ss(n,t,e);return i.texture.mapping=Ko,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function co(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function _y(n,t,e){const i=new Float32Array(Ji),s=new G(0,1,0);return new ki({name:"SphericalGaussianBlur",defines:{n:Ji,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Hl(),fragmentShader:`

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
		`,blending:Pi,depthTest:!1,depthWrite:!1})}function vd(){return new ki({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Hl(),fragmentShader:`

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
		`,blending:Pi,depthTest:!1,depthWrite:!1})}function _d(){return new ki({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Hl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Pi,depthTest:!1,depthWrite:!1})}function Hl(){return`

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
	`}function yy(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const l=r.mapping,c=l===Ic||l===Fc,h=l===Gs||l===Vs;if(c||h){let f=t.get(r);const d=f!==void 0?f.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==d)return e===null&&(e=new gd(n)),f=c?e.fromEquirectangular(r,f):e.fromCubemap(r,f),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),f.texture;if(f!==void 0)return f.texture;{const u=r.image;return c&&u&&u.height>0||h&&u&&s(u)?(e===null&&(e=new gd(n)),f=c?e.fromEquirectangular(r):e.fromCubemap(r),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),r.addEventListener("dispose",a),f.texture):null}}}return r}function s(r){let l=0;const c=6;for(let h=0;h<c;h++)r[h]!==void 0&&l++;return l===c}function a(r){const l=r.target;l.removeEventListener("dispose",a);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function My(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const s=e(i);return s===null&&da("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function Sy(n,t,e,i){const s={},a=new WeakMap;function o(f){const d=f.target;d.index!==null&&t.remove(d.index);for(const m in d.attributes)t.remove(d.attributes[m]);for(const m in d.morphAttributes){const y=d.morphAttributes[m];for(let g=0,p=y.length;g<p;g++)t.remove(y[g])}d.removeEventListener("dispose",o),delete s[d.id];const u=a.get(d);u&&(t.remove(u),a.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function r(f,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function l(f){const d=f.attributes;for(const m in d)t.update(d[m],n.ARRAY_BUFFER);const u=f.morphAttributes;for(const m in u){const y=u[m];for(let g=0,p=y.length;g<p;g++)t.update(y[g],n.ARRAY_BUFFER)}}function c(f){const d=[],u=f.index,m=f.attributes.position;let y=0;if(u!==null){const x=u.array;y=u.version;for(let _=0,v=x.length;_<v;_+=3){const R=x[_+0],w=x[_+1],S=x[_+2];d.push(R,w,w,S,S,R)}}else if(m!==void 0){const x=m.array;y=m.version;for(let _=0,v=x.length/3-1;_<v;_+=3){const R=_+0,w=_+1,S=_+2;d.push(R,w,w,S,S,R)}}else return;const g=new(Zu(d)?Qu:Ju)(d,1);g.version=y;const p=a.get(f);p&&t.remove(p),a.set(f,g)}function h(f){const d=a.get(f);if(d){const u=f.index;u!==null&&d.version<u.version&&c(f)}else c(f);return a.get(f)}return{get:r,update:l,getWireframeAttribute:h}}function by(n,t,e){let i;function s(d){i=d}let a,o;function r(d){a=d.type,o=d.bytesPerElement}function l(d,u){n.drawElements(i,u,a,d*o),e.update(u,i,1)}function c(d,u,m){m!==0&&(n.drawElementsInstanced(i,u,a,d*o,m),e.update(u,i,m))}function h(d,u,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,a,d,0,m);let g=0;for(let p=0;p<m;p++)g+=u[p];e.update(g,i,1)}function f(d,u,m,y){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<d.length;p++)c(d[p]/o,u[p],y[p]);else{g.multiDrawElementsInstancedWEBGL(i,u,0,a,d,0,y,0,m);let p=0;for(let x=0;x<m;x++)p+=u[x]*y[x];e.update(p,i,1)}}this.setMode=s,this.setIndex=r,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function wy(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,o,r){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=r*(a/3);break;case n.LINES:e.lines+=r*(a/2);break;case n.LINE_STRIP:e.lines+=r*(a-1);break;case n.LINE_LOOP:e.lines+=r*a;break;case n.POINTS:e.points+=r*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function Ey(n,t,e){const i=new WeakMap,s=new Ge;function a(o,r,l){const c=o.morphTargetInfluences,h=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,f=h!==void 0?h.length:0;let d=i.get(r);if(d===void 0||d.count!==f){let M=function(){T.dispose(),i.delete(r),r.removeEventListener("dispose",M)};var u=M;d!==void 0&&d.texture.dispose();const m=r.morphAttributes.position!==void 0,y=r.morphAttributes.normal!==void 0,g=r.morphAttributes.color!==void 0,p=r.morphAttributes.position||[],x=r.morphAttributes.normal||[],_=r.morphAttributes.color||[];let v=0;m===!0&&(v=1),y===!0&&(v=2),g===!0&&(v=3);let R=r.attributes.position.count*v,w=1;R>t.maxTextureSize&&(w=Math.ceil(R/t.maxTextureSize),R=t.maxTextureSize);const S=new Float32Array(R*w*4*f),T=new ju(S,R,w,f);T.type=pi,T.needsUpdate=!0;const b=v*4;for(let C=0;C<f;C++){const I=p[C],k=x[C],N=_[C],L=R*w*4*C;for(let D=0;D<I.count;D++){const B=D*b;m===!0&&(s.fromBufferAttribute(I,D),S[L+B+0]=s.x,S[L+B+1]=s.y,S[L+B+2]=s.z,S[L+B+3]=0),y===!0&&(s.fromBufferAttribute(k,D),S[L+B+4]=s.x,S[L+B+5]=s.y,S[L+B+6]=s.z,S[L+B+7]=0),g===!0&&(s.fromBufferAttribute(N,D),S[L+B+8]=s.x,S[L+B+9]=s.y,S[L+B+10]=s.z,S[L+B+11]=N.itemSize===4?s.w:1)}}d={count:f,texture:T,size:new Wt(R,w)},i.set(r,d),r.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let m=0;for(let g=0;g<c.length;g++)m+=c[g];const y=r.morphTargetsRelative?1:1-m;l.getUniforms().setValue(n,"morphTargetBaseInfluence",y),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:a}}function Ty(n,t,e,i){let s=new WeakMap;function a(l){const c=i.render.frame,h=l.geometry,f=t.get(l,h);if(s.get(f)!==c&&(t.update(f),s.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",r)===!1&&l.addEventListener("dispose",r),s.get(l)!==c&&(e.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return f}function o(){s=new WeakMap}function r(l){const c=l.target;c.removeEventListener("dispose",r),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:a,dispose:o}}class of extends _n{constructor(t,e,i,s,a,o,r,l,c,h=zs){if(h!==zs&&h!==Ws)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===zs&&(i=is),i===void 0&&h===Ws&&(i=Xs),super(null,s,a,o,r,l,h,i,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:Hn,this.minFilter=l!==void 0?l:Hn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const rf=new _n,yd=new of(1,1),cf=new ju,lf=new ux,hf=new nf,Md=[],Sd=[],bd=new Float32Array(16),wd=new Float32Array(9),Ed=new Float32Array(4);function qs(n,t,e){const i=n[0];if(i<=0||i>0)return n;const s=t*e;let a=Md[s];if(a===void 0&&(a=new Float32Array(s),Md[s]=a),t!==0){i.toArray(a,0);for(let o=1,r=0;o!==t;++o)r+=e,n[o].toArray(a,r)}return a}function tn(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function en(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function tr(n,t){let e=Sd[t];e===void 0&&(e=new Int32Array(t),Sd[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function Ay(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function Ry(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(tn(e,t))return;n.uniform2fv(this.addr,t),en(e,t)}}function Cy(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(tn(e,t))return;n.uniform3fv(this.addr,t),en(e,t)}}function Py(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(tn(e,t))return;n.uniform4fv(this.addr,t),en(e,t)}}function Ly(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(tn(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),en(e,t)}else{if(tn(e,i))return;Ed.set(i),n.uniformMatrix2fv(this.addr,!1,Ed),en(e,i)}}function Dy(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(tn(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),en(e,t)}else{if(tn(e,i))return;wd.set(i),n.uniformMatrix3fv(this.addr,!1,wd),en(e,i)}}function ky(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(tn(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),en(e,t)}else{if(tn(e,i))return;bd.set(i),n.uniformMatrix4fv(this.addr,!1,bd),en(e,i)}}function Iy(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function Fy(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(tn(e,t))return;n.uniform2iv(this.addr,t),en(e,t)}}function Uy(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(tn(e,t))return;n.uniform3iv(this.addr,t),en(e,t)}}function zy(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(tn(e,t))return;n.uniform4iv(this.addr,t),en(e,t)}}function Ny(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function Oy(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(tn(e,t))return;n.uniform2uiv(this.addr,t),en(e,t)}}function By(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(tn(e,t))return;n.uniform3uiv(this.addr,t),en(e,t)}}function Hy(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(tn(e,t))return;n.uniform4uiv(this.addr,t),en(e,t)}}function Gy(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let a;this.type===n.SAMPLER_2D_SHADOW?(yd.compareFunction=Yu,a=yd):a=rf,e.setTexture2D(t||a,s)}function Vy(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||lf,s)}function Xy(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||hf,s)}function Wy(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||cf,s)}function $y(n){switch(n){case 5126:return Ay;case 35664:return Ry;case 35665:return Cy;case 35666:return Py;case 35674:return Ly;case 35675:return Dy;case 35676:return ky;case 5124:case 35670:return Iy;case 35667:case 35671:return Fy;case 35668:case 35672:return Uy;case 35669:case 35673:return zy;case 5125:return Ny;case 36294:return Oy;case 36295:return By;case 36296:return Hy;case 35678:case 36198:case 36298:case 36306:case 35682:return Gy;case 35679:case 36299:case 36307:return Vy;case 35680:case 36300:case 36308:case 36293:return Xy;case 36289:case 36303:case 36311:case 36292:return Wy}}function Yy(n,t){n.uniform1fv(this.addr,t)}function Zy(n,t){const e=qs(t,this.size,2);n.uniform2fv(this.addr,e)}function qy(n,t){const e=qs(t,this.size,3);n.uniform3fv(this.addr,e)}function jy(n,t){const e=qs(t,this.size,4);n.uniform4fv(this.addr,e)}function Ky(n,t){const e=qs(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function Jy(n,t){const e=qs(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function Qy(n,t){const e=qs(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function tM(n,t){n.uniform1iv(this.addr,t)}function eM(n,t){n.uniform2iv(this.addr,t)}function nM(n,t){n.uniform3iv(this.addr,t)}function iM(n,t){n.uniform4iv(this.addr,t)}function sM(n,t){n.uniform1uiv(this.addr,t)}function aM(n,t){n.uniform2uiv(this.addr,t)}function oM(n,t){n.uniform3uiv(this.addr,t)}function rM(n,t){n.uniform4uiv(this.addr,t)}function cM(n,t,e){const i=this.cache,s=t.length,a=tr(e,s);tn(i,a)||(n.uniform1iv(this.addr,a),en(i,a));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||rf,a[o])}function lM(n,t,e){const i=this.cache,s=t.length,a=tr(e,s);tn(i,a)||(n.uniform1iv(this.addr,a),en(i,a));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||lf,a[o])}function hM(n,t,e){const i=this.cache,s=t.length,a=tr(e,s);tn(i,a)||(n.uniform1iv(this.addr,a),en(i,a));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||hf,a[o])}function dM(n,t,e){const i=this.cache,s=t.length,a=tr(e,s);tn(i,a)||(n.uniform1iv(this.addr,a),en(i,a));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||cf,a[o])}function uM(n){switch(n){case 5126:return Yy;case 35664:return Zy;case 35665:return qy;case 35666:return jy;case 35674:return Ky;case 35675:return Jy;case 35676:return Qy;case 5124:case 35670:return tM;case 35667:case 35671:return eM;case 35668:case 35672:return nM;case 35669:case 35673:return iM;case 5125:return sM;case 36294:return aM;case 36295:return oM;case 36296:return rM;case 35678:case 36198:case 36298:case 36306:case 35682:return cM;case 35679:case 36299:case 36307:return lM;case 35680:case 36300:case 36308:case 36293:return hM;case 36289:case 36303:case 36311:case 36292:return dM}}class fM{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=$y(e.type)}}class pM{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=uM(e.type)}}class mM{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const s=this.seq;for(let a=0,o=s.length;a!==o;++a){const r=s[a];r.setValue(t,e[r.id],i)}}}const Qr=/(\w+)(\])?(\[|\.)?/g;function Td(n,t){n.seq.push(t),n.map[t.id]=t}function gM(n,t,e){const i=n.name,s=i.length;for(Qr.lastIndex=0;;){const a=Qr.exec(i),o=Qr.lastIndex;let r=a[1];const l=a[2]==="]",c=a[3];if(l&&(r=r|0),c===void 0||c==="["&&o+2===s){Td(e,c===void 0?new fM(r,n,t):new pM(r,n,t));break}else{let f=e.map[r];f===void 0&&(f=new mM(r),Td(e,f)),e=f}}}class Ro{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const a=t.getActiveUniform(e,s),o=t.getUniformLocation(e,a.name);gM(a,o,this)}}setValue(t,e,i,s){const a=this.map[e];a!==void 0&&a.setValue(t,i,s)}setOptional(t,e,i){const s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let a=0,o=e.length;a!==o;++a){const r=e[a],l=i[r.id];l.needsUpdate!==!1&&r.setValue(t,l.value,s)}}static seqWithValue(t,e){const i=[];for(let s=0,a=t.length;s!==a;++s){const o=t[s];o.id in e&&i.push(o)}return i}}function Ad(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const xM=37297;let vM=0;function _M(n,t){const e=n.split(`
`),i=[],s=Math.max(t-6,0),a=Math.min(t+6,e.length);for(let o=s;o<a;o++){const r=o+1;i.push(`${r===t?">":" "} ${r}: ${e[o]}`)}return i.join(`
`)}const Rd=new fe;function yM(n){_e._getMatrix(Rd,_e.workingColorSpace,n);const t=`mat3( ${Rd.elements.map(e=>e.toFixed(4))} )`;switch(_e.getTransfer(n)){case Jo:return[t,"LinearTransferOETF"];case Pe:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Cd(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),s=n.getShaderInfoLog(t).trim();if(i&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+_M(n.getShaderSource(t),o)}else return s}function MM(n,t){const e=yM(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function SM(n,t){let e;switch(t){case wg:e="Linear";break;case Eg:e="Reinhard";break;case Tg:e="Cineon";break;case Ag:e="ACESFilmic";break;case Cg:e="AgX";break;case Pg:e="Neutral";break;case Rg:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const lo=new G;function bM(){_e.getLuminanceCoefficients(lo);const n=lo.x.toFixed(4),t=lo.y.toFixed(4),e=lo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function wM(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ua).join(`
`)}function EM(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function TM(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const a=n.getActiveAttrib(t,s),o=a.name;let r=1;a.type===n.FLOAT_MAT2&&(r=2),a.type===n.FLOAT_MAT3&&(r=3),a.type===n.FLOAT_MAT4&&(r=4),e[o]={type:a.type,location:n.getAttribLocation(t,o),locationSize:r}}return e}function ua(n){return n!==""}function Pd(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Ld(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const AM=/^[ \t]*#include +<([\w\d./]+)>/gm;function dl(n){return n.replace(AM,CM)}const RM=new Map;function CM(n,t){let e=pe[t];if(e===void 0){const i=RM.get(t);if(i!==void 0)e=pe[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return dl(e)}const PM=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Dd(n){return n.replace(PM,LM)}function LM(n,t,e,i){let s="";for(let a=parseInt(t);a<parseInt(e);a++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function kd(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function DM(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===ku?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===Iu?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===ui&&(t="SHADOWMAP_TYPE_VSM"),t}function kM(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Gs:case Vs:t="ENVMAP_TYPE_CUBE";break;case Ko:t="ENVMAP_TYPE_CUBE_UV";break}return t}function IM(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Vs:t="ENVMAP_MODE_REFRACTION";break}return t}function FM(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Pl:t="ENVMAP_BLENDING_MULTIPLY";break;case Sg:t="ENVMAP_BLENDING_MIX";break;case bg:t="ENVMAP_BLENDING_ADD";break}return t}function UM(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function zM(n,t,e,i){const s=n.getContext(),a=e.defines;let o=e.vertexShader,r=e.fragmentShader;const l=DM(e),c=kM(e),h=IM(e),f=FM(e),d=UM(e),u=wM(e),m=EM(a),y=s.createProgram();let g,p,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(ua).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(ua).join(`
`),p.length>0&&(p+=`
`)):(g=[kd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ua).join(`
`),p=[kd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Li?"#define TONE_MAPPING":"",e.toneMapping!==Li?pe.tonemapping_pars_fragment:"",e.toneMapping!==Li?SM("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",pe.colorspace_pars_fragment,MM("linearToOutputTexel",e.outputColorSpace),bM(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(ua).join(`
`)),o=dl(o),o=Pd(o,e),o=Ld(o,e),r=dl(r),r=Pd(r,e),r=Ld(r,e),o=Dd(o),r=Dd(r),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,g=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===Xh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Xh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const _=x+g+o,v=x+p+r,R=Ad(s,s.VERTEX_SHADER,_),w=Ad(s,s.FRAGMENT_SHADER,v);s.attachShader(y,R),s.attachShader(y,w),e.index0AttributeName!==void 0?s.bindAttribLocation(y,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function S(C){if(n.debug.checkShaderErrors){const I=s.getProgramInfoLog(y).trim(),k=s.getShaderInfoLog(R).trim(),N=s.getShaderInfoLog(w).trim();let L=!0,D=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if(L=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,y,R,w);else{const B=Cd(s,R,"vertex"),U=Cd(s,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+I+`
`+B+`
`+U)}else I!==""?console.warn("THREE.WebGLProgram: Program Info Log:",I):(k===""||N==="")&&(D=!1);D&&(C.diagnostics={runnable:L,programLog:I,vertexShader:{log:k,prefix:g},fragmentShader:{log:N,prefix:p}})}s.deleteShader(R),s.deleteShader(w),T=new Ro(s,y),b=TM(s,y)}let T;this.getUniforms=function(){return T===void 0&&S(this),T};let b;this.getAttributes=function(){return b===void 0&&S(this),b};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(y,xM)),M},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=vM++,this.cacheKey=t,this.usedTimes=1,this.program=y,this.vertexShader=R,this.fragmentShader=w,this}let NM=0;class OM{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),a=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(a)===!1&&(o.add(a),a.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new BM(t),e.set(t,i)),i}}class BM{constructor(t){this.id=NM++,this.code=t,this.usedTimes=0}}function HM(n,t,e,i,s,a,o){const r=new Ol,l=new OM,c=new Set,h=[],f=s.logarithmicDepthBuffer,d=s.vertexTextures;let u=s.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(b){return c.add(b),b===0?"uv":`uv${b}`}function g(b,M,C,I,k){const N=I.fog,L=k.geometry,D=b.isMeshStandardMaterial?I.environment:null,B=(b.isMeshStandardMaterial?e:t).get(b.envMap||D),U=B&&B.mapping===Ko?B.image.height:null,z=m[b.type];b.precision!==null&&(u=s.getMaxPrecision(b.precision),u!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",u,"instead."));const W=L.morphAttributes.position||L.morphAttributes.normal||L.morphAttributes.color,mt=W!==void 0?W.length:0;let at=0;L.morphAttributes.position!==void 0&&(at=1),L.morphAttributes.normal!==void 0&&(at=2),L.morphAttributes.color!==void 0&&(at=3);let dt,tt,Z,pt;if(z){const ne=Qn[z];dt=ne.vertexShader,tt=ne.fragmentShader}else dt=b.vertexShader,tt=b.fragmentShader,l.update(b),Z=l.getVertexShaderID(b),pt=l.getFragmentShaderID(b);const j=n.getRenderTarget(),Mt=n.state.buffers.depth.getReversed(),$t=k.isInstancedMesh===!0,Bt=k.isBatchedMesh===!0,jt=!!b.map,ht=!!b.matcap,Dt=!!B,V=!!b.aoMap,ue=!!b.lightMap,Zt=!!b.bumpMap,Vt=!!b.normalMap,kt=!!b.displacementMap,Et=!!b.emissiveMap,At=!!b.metalnessMap,P=!!b.roughnessMap,E=b.anisotropy>0,Y=b.clearcoat>0,rt=b.dispersion>0,lt=b.iridescence>0,it=b.sheen>0,Rt=b.transmission>0,K=E&&!!b.anisotropyMap,ft=Y&&!!b.clearcoatMap,It=Y&&!!b.clearcoatNormalMap,et=Y&&!!b.clearcoatRoughnessMap,gt=lt&&!!b.iridescenceMap,O=lt&&!!b.iridescenceThicknessMap,st=it&&!!b.sheenColorMap,ut=it&&!!b.sheenRoughnessMap,Gt=!!b.specularMap,qt=!!b.specularColorMap,zt=!!b.specularIntensityMap,F=Rt&&!!b.transmissionMap,xt=Rt&&!!b.thicknessMap,J=!!b.gradientMap,ot=!!b.alphaMap,St=b.alphaTest>0,bt=!!b.alphaHash,Kt=!!b.extensions;let re=Li;b.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(re=n.toneMapping);const ce={shaderID:z,shaderType:b.type,shaderName:b.name,vertexShader:dt,fragmentShader:tt,defines:b.defines,customVertexShaderID:Z,customFragmentShaderID:pt,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:u,batching:Bt,batchingColor:Bt&&k._colorsTexture!==null,instancing:$t,instancingColor:$t&&k.instanceColor!==null,instancingMorph:$t&&k.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:j===null?n.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:Ys,alphaToCoverage:!!b.alphaToCoverage,map:jt,matcap:ht,envMap:Dt,envMapMode:Dt&&B.mapping,envMapCubeUVHeight:U,aoMap:V,lightMap:ue,bumpMap:Zt,normalMap:Vt,displacementMap:d&&kt,emissiveMap:Et,normalMapObjectSpace:Vt&&b.normalMapType===Ig,normalMapTangentSpace:Vt&&b.normalMapType===$u,metalnessMap:At,roughnessMap:P,anisotropy:E,anisotropyMap:K,clearcoat:Y,clearcoatMap:ft,clearcoatNormalMap:It,clearcoatRoughnessMap:et,dispersion:rt,iridescence:lt,iridescenceMap:gt,iridescenceThicknessMap:O,sheen:it,sheenColorMap:st,sheenRoughnessMap:ut,specularMap:Gt,specularColorMap:qt,specularIntensityMap:zt,transmission:Rt,transmissionMap:F,thicknessMap:xt,gradientMap:J,opaque:b.transparent===!1&&b.blending===Us&&b.alphaToCoverage===!1,alphaMap:ot,alphaTest:St,alphaHash:bt,combine:b.combine,mapUv:jt&&y(b.map.channel),aoMapUv:V&&y(b.aoMap.channel),lightMapUv:ue&&y(b.lightMap.channel),bumpMapUv:Zt&&y(b.bumpMap.channel),normalMapUv:Vt&&y(b.normalMap.channel),displacementMapUv:kt&&y(b.displacementMap.channel),emissiveMapUv:Et&&y(b.emissiveMap.channel),metalnessMapUv:At&&y(b.metalnessMap.channel),roughnessMapUv:P&&y(b.roughnessMap.channel),anisotropyMapUv:K&&y(b.anisotropyMap.channel),clearcoatMapUv:ft&&y(b.clearcoatMap.channel),clearcoatNormalMapUv:It&&y(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:et&&y(b.clearcoatRoughnessMap.channel),iridescenceMapUv:gt&&y(b.iridescenceMap.channel),iridescenceThicknessMapUv:O&&y(b.iridescenceThicknessMap.channel),sheenColorMapUv:st&&y(b.sheenColorMap.channel),sheenRoughnessMapUv:ut&&y(b.sheenRoughnessMap.channel),specularMapUv:Gt&&y(b.specularMap.channel),specularColorMapUv:qt&&y(b.specularColorMap.channel),specularIntensityMapUv:zt&&y(b.specularIntensityMap.channel),transmissionMapUv:F&&y(b.transmissionMap.channel),thicknessMapUv:xt&&y(b.thicknessMap.channel),alphaMapUv:ot&&y(b.alphaMap.channel),vertexTangents:!!L.attributes.tangent&&(Vt||E),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!L.attributes.color&&L.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!L.attributes.uv&&(jt||ot),fog:!!N,useFog:b.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:Mt,skinning:k.isSkinnedMesh===!0,morphTargets:L.morphAttributes.position!==void 0,morphNormals:L.morphAttributes.normal!==void 0,morphColors:L.morphAttributes.color!==void 0,morphTargetsCount:mt,morphTextureStride:at,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&C.length>0,shadowMapType:n.shadowMap.type,toneMapping:re,decodeVideoTexture:jt&&b.map.isVideoTexture===!0&&_e.getTransfer(b.map.colorSpace)===Pe,decodeVideoTextureEmissive:Et&&b.emissiveMap.isVideoTexture===!0&&_e.getTransfer(b.emissiveMap.colorSpace)===Pe,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Ne,flipSided:b.side===Mn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Kt&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Kt&&b.extensions.multiDraw===!0||Bt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return ce.vertexUv1s=c.has(1),ce.vertexUv2s=c.has(2),ce.vertexUv3s=c.has(3),c.clear(),ce}function p(b){const M=[];if(b.shaderID?M.push(b.shaderID):(M.push(b.customVertexShaderID),M.push(b.customFragmentShaderID)),b.defines!==void 0)for(const C in b.defines)M.push(C),M.push(b.defines[C]);return b.isRawShaderMaterial===!1&&(x(M,b),_(M,b),M.push(n.outputColorSpace)),M.push(b.customProgramCacheKey),M.join()}function x(b,M){b.push(M.precision),b.push(M.outputColorSpace),b.push(M.envMapMode),b.push(M.envMapCubeUVHeight),b.push(M.mapUv),b.push(M.alphaMapUv),b.push(M.lightMapUv),b.push(M.aoMapUv),b.push(M.bumpMapUv),b.push(M.normalMapUv),b.push(M.displacementMapUv),b.push(M.emissiveMapUv),b.push(M.metalnessMapUv),b.push(M.roughnessMapUv),b.push(M.anisotropyMapUv),b.push(M.clearcoatMapUv),b.push(M.clearcoatNormalMapUv),b.push(M.clearcoatRoughnessMapUv),b.push(M.iridescenceMapUv),b.push(M.iridescenceThicknessMapUv),b.push(M.sheenColorMapUv),b.push(M.sheenRoughnessMapUv),b.push(M.specularMapUv),b.push(M.specularColorMapUv),b.push(M.specularIntensityMapUv),b.push(M.transmissionMapUv),b.push(M.thicknessMapUv),b.push(M.combine),b.push(M.fogExp2),b.push(M.sizeAttenuation),b.push(M.morphTargetsCount),b.push(M.morphAttributeCount),b.push(M.numDirLights),b.push(M.numPointLights),b.push(M.numSpotLights),b.push(M.numSpotLightMaps),b.push(M.numHemiLights),b.push(M.numRectAreaLights),b.push(M.numDirLightShadows),b.push(M.numPointLightShadows),b.push(M.numSpotLightShadows),b.push(M.numSpotLightShadowsWithMaps),b.push(M.numLightProbes),b.push(M.shadowMapType),b.push(M.toneMapping),b.push(M.numClippingPlanes),b.push(M.numClipIntersection),b.push(M.depthPacking)}function _(b,M){r.disableAll(),M.supportsVertexTextures&&r.enable(0),M.instancing&&r.enable(1),M.instancingColor&&r.enable(2),M.instancingMorph&&r.enable(3),M.matcap&&r.enable(4),M.envMap&&r.enable(5),M.normalMapObjectSpace&&r.enable(6),M.normalMapTangentSpace&&r.enable(7),M.clearcoat&&r.enable(8),M.iridescence&&r.enable(9),M.alphaTest&&r.enable(10),M.vertexColors&&r.enable(11),M.vertexAlphas&&r.enable(12),M.vertexUv1s&&r.enable(13),M.vertexUv2s&&r.enable(14),M.vertexUv3s&&r.enable(15),M.vertexTangents&&r.enable(16),M.anisotropy&&r.enable(17),M.alphaHash&&r.enable(18),M.batching&&r.enable(19),M.dispersion&&r.enable(20),M.batchingColor&&r.enable(21),b.push(r.mask),r.disableAll(),M.fog&&r.enable(0),M.useFog&&r.enable(1),M.flatShading&&r.enable(2),M.logarithmicDepthBuffer&&r.enable(3),M.reverseDepthBuffer&&r.enable(4),M.skinning&&r.enable(5),M.morphTargets&&r.enable(6),M.morphNormals&&r.enable(7),M.morphColors&&r.enable(8),M.premultipliedAlpha&&r.enable(9),M.shadowMapEnabled&&r.enable(10),M.doubleSided&&r.enable(11),M.flipSided&&r.enable(12),M.useDepthPacking&&r.enable(13),M.dithering&&r.enable(14),M.transmission&&r.enable(15),M.sheen&&r.enable(16),M.opaque&&r.enable(17),M.pointsUvs&&r.enable(18),M.decodeVideoTexture&&r.enable(19),M.decodeVideoTextureEmissive&&r.enable(20),M.alphaToCoverage&&r.enable(21),b.push(r.mask)}function v(b){const M=m[b.type];let C;if(M){const I=Qn[M];C=wx.clone(I.uniforms)}else C=b.uniforms;return C}function R(b,M){let C;for(let I=0,k=h.length;I<k;I++){const N=h[I];if(N.cacheKey===M){C=N,++C.usedTimes;break}}return C===void 0&&(C=new zM(n,M,b,a),h.push(C)),C}function w(b){if(--b.usedTimes===0){const M=h.indexOf(b);h[M]=h[h.length-1],h.pop(),b.destroy()}}function S(b){l.remove(b)}function T(){l.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:v,acquireProgram:R,releaseProgram:w,releaseShaderCache:S,programs:h,dispose:T}}function GM(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let r=n.get(o);return r===void 0&&(r={},n.set(o,r)),r}function i(o){n.delete(o)}function s(o,r,l){n.get(o)[r]=l}function a(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:a}}function VM(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Id(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Fd(){const n=[];let t=0;const e=[],i=[],s=[];function a(){t=0,e.length=0,i.length=0,s.length=0}function o(f,d,u,m,y,g){let p=n[t];return p===void 0?(p={id:f.id,object:f,geometry:d,material:u,groupOrder:m,renderOrder:f.renderOrder,z:y,group:g},n[t]=p):(p.id=f.id,p.object=f,p.geometry=d,p.material=u,p.groupOrder=m,p.renderOrder=f.renderOrder,p.z=y,p.group=g),t++,p}function r(f,d,u,m,y,g){const p=o(f,d,u,m,y,g);u.transmission>0?i.push(p):u.transparent===!0?s.push(p):e.push(p)}function l(f,d,u,m,y,g){const p=o(f,d,u,m,y,g);u.transmission>0?i.unshift(p):u.transparent===!0?s.unshift(p):e.unshift(p)}function c(f,d){e.length>1&&e.sort(f||VM),i.length>1&&i.sort(d||Id),s.length>1&&s.sort(d||Id)}function h(){for(let f=t,d=n.length;f<d;f++){const u=n[f];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:e,transmissive:i,transparent:s,init:a,push:r,unshift:l,finish:h,sort:c}}function XM(){let n=new WeakMap;function t(i,s){const a=n.get(i);let o;return a===void 0?(o=new Fd,n.set(i,[o])):s>=a.length?(o=new Fd,a.push(o)):o=a[s],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function WM(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new G,color:new ee};break;case"SpotLight":e={position:new G,direction:new G,color:new ee,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new G,color:new ee,distance:0,decay:0};break;case"HemisphereLight":e={direction:new G,skyColor:new ee,groundColor:new ee};break;case"RectAreaLight":e={color:new ee,position:new G,halfWidth:new G,halfHeight:new G};break}return n[t.id]=e,e}}}function $M(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let YM=0;function ZM(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function qM(n){const t=new WM,e=$M(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new G);const s=new G,a=new Fe,o=new Fe;function r(c){let h=0,f=0,d=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let u=0,m=0,y=0,g=0,p=0,x=0,_=0,v=0,R=0,w=0,S=0;c.sort(ZM);for(let b=0,M=c.length;b<M;b++){const C=c[b],I=C.color,k=C.intensity,N=C.distance,L=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)h+=I.r*k,f+=I.g*k,d+=I.b*k;else if(C.isLightProbe){for(let D=0;D<9;D++)i.probe[D].addScaledVector(C.sh.coefficients[D],k);S++}else if(C.isDirectionalLight){const D=t.get(C);if(D.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const B=C.shadow,U=e.get(C);U.shadowIntensity=B.intensity,U.shadowBias=B.bias,U.shadowNormalBias=B.normalBias,U.shadowRadius=B.radius,U.shadowMapSize=B.mapSize,i.directionalShadow[u]=U,i.directionalShadowMap[u]=L,i.directionalShadowMatrix[u]=C.shadow.matrix,x++}i.directional[u]=D,u++}else if(C.isSpotLight){const D=t.get(C);D.position.setFromMatrixPosition(C.matrixWorld),D.color.copy(I).multiplyScalar(k),D.distance=N,D.coneCos=Math.cos(C.angle),D.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),D.decay=C.decay,i.spot[y]=D;const B=C.shadow;if(C.map&&(i.spotLightMap[R]=C.map,R++,B.updateMatrices(C),C.castShadow&&w++),i.spotLightMatrix[y]=B.matrix,C.castShadow){const U=e.get(C);U.shadowIntensity=B.intensity,U.shadowBias=B.bias,U.shadowNormalBias=B.normalBias,U.shadowRadius=B.radius,U.shadowMapSize=B.mapSize,i.spotShadow[y]=U,i.spotShadowMap[y]=L,v++}y++}else if(C.isRectAreaLight){const D=t.get(C);D.color.copy(I).multiplyScalar(k),D.halfWidth.set(C.width*.5,0,0),D.halfHeight.set(0,C.height*.5,0),i.rectArea[g]=D,g++}else if(C.isPointLight){const D=t.get(C);if(D.color.copy(C.color).multiplyScalar(C.intensity),D.distance=C.distance,D.decay=C.decay,C.castShadow){const B=C.shadow,U=e.get(C);U.shadowIntensity=B.intensity,U.shadowBias=B.bias,U.shadowNormalBias=B.normalBias,U.shadowRadius=B.radius,U.shadowMapSize=B.mapSize,U.shadowCameraNear=B.camera.near,U.shadowCameraFar=B.camera.far,i.pointShadow[m]=U,i.pointShadowMap[m]=L,i.pointShadowMatrix[m]=C.shadow.matrix,_++}i.point[m]=D,m++}else if(C.isHemisphereLight){const D=t.get(C);D.skyColor.copy(C.color).multiplyScalar(k),D.groundColor.copy(C.groundColor).multiplyScalar(k),i.hemi[p]=D,p++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Ot.LTC_FLOAT_1,i.rectAreaLTC2=Ot.LTC_FLOAT_2):(i.rectAreaLTC1=Ot.LTC_HALF_1,i.rectAreaLTC2=Ot.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=f,i.ambient[2]=d;const T=i.hash;(T.directionalLength!==u||T.pointLength!==m||T.spotLength!==y||T.rectAreaLength!==g||T.hemiLength!==p||T.numDirectionalShadows!==x||T.numPointShadows!==_||T.numSpotShadows!==v||T.numSpotMaps!==R||T.numLightProbes!==S)&&(i.directional.length=u,i.spot.length=y,i.rectArea.length=g,i.point.length=m,i.hemi.length=p,i.directionalShadow.length=x,i.directionalShadowMap.length=x,i.pointShadow.length=_,i.pointShadowMap.length=_,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=x,i.pointShadowMatrix.length=_,i.spotLightMatrix.length=v+R-w,i.spotLightMap.length=R,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=S,T.directionalLength=u,T.pointLength=m,T.spotLength=y,T.rectAreaLength=g,T.hemiLength=p,T.numDirectionalShadows=x,T.numPointShadows=_,T.numSpotShadows=v,T.numSpotMaps=R,T.numLightProbes=S,i.version=YM++)}function l(c,h){let f=0,d=0,u=0,m=0,y=0;const g=h.matrixWorldInverse;for(let p=0,x=c.length;p<x;p++){const _=c[p];if(_.isDirectionalLight){const v=i.directional[f];v.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(g),f++}else if(_.isSpotLight){const v=i.spot[u];v.position.setFromMatrixPosition(_.matrixWorld),v.position.applyMatrix4(g),v.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(g),u++}else if(_.isRectAreaLight){const v=i.rectArea[m];v.position.setFromMatrixPosition(_.matrixWorld),v.position.applyMatrix4(g),o.identity(),a.copy(_.matrixWorld),a.premultiply(g),o.extractRotation(a),v.halfWidth.set(_.width*.5,0,0),v.halfHeight.set(0,_.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),m++}else if(_.isPointLight){const v=i.point[d];v.position.setFromMatrixPosition(_.matrixWorld),v.position.applyMatrix4(g),d++}else if(_.isHemisphereLight){const v=i.hemi[y];v.direction.setFromMatrixPosition(_.matrixWorld),v.direction.transformDirection(g),y++}}}return{setup:r,setupView:l,state:i}}function Ud(n){const t=new qM(n),e=[],i=[];function s(h){c.camera=h,e.length=0,i.length=0}function a(h){e.push(h)}function o(h){i.push(h)}function r(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:r,setupLightsView:l,pushLight:a,pushShadow:o}}function jM(n){let t=new WeakMap;function e(s,a=0){const o=t.get(s);let r;return o===void 0?(r=new Ud(n),t.set(s,[r])):a>=o.length?(r=new Ud(n),o.push(r)):r=o[a],r}function i(){t=new WeakMap}return{get:e,dispose:i}}class KM extends os{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Dg,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class JM extends os{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const QM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,tS=`uniform sampler2D shadow_pass;
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
}`;function eS(n,t,e){let i=new Bl;const s=new Wt,a=new Wt,o=new Ge,r=new KM({depthPacking:kg}),l=new JM,c={},h=e.maxTextureSize,f={[Di]:Mn,[Mn]:Di,[Ne]:Ne},d=new ki({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Wt},radius:{value:4}},vertexShader:QM,fragmentShader:tS}),u=d.clone();u.defines.HORIZONTAL_PASS=1;const m=new qe;m.setAttribute("position",new rn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new ge(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ku;let p=this.type;this.render=function(w,S,T){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||w.length===0)return;const b=n.getRenderTarget(),M=n.getActiveCubeFace(),C=n.getActiveMipmapLevel(),I=n.state;I.setBlending(Pi),I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const k=p!==ui&&this.type===ui,N=p===ui&&this.type!==ui;for(let L=0,D=w.length;L<D;L++){const B=w[L],U=B.shadow;if(U===void 0){console.warn("THREE.WebGLShadowMap:",B,"has no shadow.");continue}if(U.autoUpdate===!1&&U.needsUpdate===!1)continue;s.copy(U.mapSize);const z=U.getFrameExtents();if(s.multiply(z),a.copy(U.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(a.x=Math.floor(h/z.x),s.x=a.x*z.x,U.mapSize.x=a.x),s.y>h&&(a.y=Math.floor(h/z.y),s.y=a.y*z.y,U.mapSize.y=a.y)),U.map===null||k===!0||N===!0){const mt=this.type!==ui?{minFilter:Hn,magFilter:Hn}:{};U.map!==null&&U.map.dispose(),U.map=new ss(s.x,s.y,mt),U.map.texture.name=B.name+".shadowMap",U.camera.updateProjectionMatrix()}n.setRenderTarget(U.map),n.clear();const W=U.getViewportCount();for(let mt=0;mt<W;mt++){const at=U.getViewport(mt);o.set(a.x*at.x,a.y*at.y,a.x*at.z,a.y*at.w),I.viewport(o),U.updateMatrices(B,mt),i=U.getFrustum(),v(S,T,U.camera,B,this.type)}U.isPointLightShadow!==!0&&this.type===ui&&x(U,T),U.needsUpdate=!1}p=this.type,g.needsUpdate=!1,n.setRenderTarget(b,M,C)};function x(w,S){const T=t.update(y);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,u.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,u.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new ss(s.x,s.y)),d.uniforms.shadow_pass.value=w.map.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,n.setRenderTarget(w.mapPass),n.clear(),n.renderBufferDirect(S,null,T,d,y,null),u.uniforms.shadow_pass.value=w.mapPass.texture,u.uniforms.resolution.value=w.mapSize,u.uniforms.radius.value=w.radius,n.setRenderTarget(w.map),n.clear(),n.renderBufferDirect(S,null,T,u,y,null)}function _(w,S,T,b){let M=null;const C=T.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(C!==void 0)M=C;else if(M=T.isPointLight===!0?l:r,n.localClippingEnabled&&S.clipShadows===!0&&Array.isArray(S.clippingPlanes)&&S.clippingPlanes.length!==0||S.displacementMap&&S.displacementScale!==0||S.alphaMap&&S.alphaTest>0||S.map&&S.alphaTest>0){const I=M.uuid,k=S.uuid;let N=c[I];N===void 0&&(N={},c[I]=N);let L=N[k];L===void 0&&(L=M.clone(),N[k]=L,S.addEventListener("dispose",R)),M=L}if(M.visible=S.visible,M.wireframe=S.wireframe,b===ui?M.side=S.shadowSide!==null?S.shadowSide:S.side:M.side=S.shadowSide!==null?S.shadowSide:f[S.side],M.alphaMap=S.alphaMap,M.alphaTest=S.alphaTest,M.map=S.map,M.clipShadows=S.clipShadows,M.clippingPlanes=S.clippingPlanes,M.clipIntersection=S.clipIntersection,M.displacementMap=S.displacementMap,M.displacementScale=S.displacementScale,M.displacementBias=S.displacementBias,M.wireframeLinewidth=S.wireframeLinewidth,M.linewidth=S.linewidth,T.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const I=n.properties.get(M);I.light=T}return M}function v(w,S,T,b,M){if(w.visible===!1)return;if(w.layers.test(S.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&M===ui)&&(!w.frustumCulled||i.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,w.matrixWorld);const k=t.update(w),N=w.material;if(Array.isArray(N)){const L=k.groups;for(let D=0,B=L.length;D<B;D++){const U=L[D],z=N[U.materialIndex];if(z&&z.visible){const W=_(w,z,b,M);w.onBeforeShadow(n,w,S,T,k,W,U),n.renderBufferDirect(T,null,k,W,w,U),w.onAfterShadow(n,w,S,T,k,W,U)}}}else if(N.visible){const L=_(w,N,b,M);w.onBeforeShadow(n,w,S,T,k,L,null),n.renderBufferDirect(T,null,k,L,w,null),w.onAfterShadow(n,w,S,T,k,L,null)}}const I=w.children;for(let k=0,N=I.length;k<N;k++)v(I[k],S,T,b,M)}function R(w){w.target.removeEventListener("dispose",R);for(const T in c){const b=c[T],M=w.target.uuid;M in b&&(b[M].dispose(),delete b[M])}}}const nS={[Ac]:Rc,[Cc]:Dc,[Pc]:kc,[Hs]:Lc,[Rc]:Ac,[Dc]:Cc,[kc]:Pc,[Lc]:Hs};function iS(n,t){function e(){let F=!1;const xt=new Ge;let J=null;const ot=new Ge(0,0,0,0);return{setMask:function(St){J!==St&&!F&&(n.colorMask(St,St,St,St),J=St)},setLocked:function(St){F=St},setClear:function(St,bt,Kt,re,ce){ce===!0&&(St*=re,bt*=re,Kt*=re),xt.set(St,bt,Kt,re),ot.equals(xt)===!1&&(n.clearColor(St,bt,Kt,re),ot.copy(xt))},reset:function(){F=!1,J=null,ot.set(-1,0,0,0)}}}function i(){let F=!1,xt=!1,J=null,ot=null,St=null;return{setReversed:function(bt){if(xt!==bt){const Kt=t.get("EXT_clip_control");xt?Kt.clipControlEXT(Kt.LOWER_LEFT_EXT,Kt.ZERO_TO_ONE_EXT):Kt.clipControlEXT(Kt.LOWER_LEFT_EXT,Kt.NEGATIVE_ONE_TO_ONE_EXT);const re=St;St=null,this.setClear(re)}xt=bt},getReversed:function(){return xt},setTest:function(bt){bt?j(n.DEPTH_TEST):Mt(n.DEPTH_TEST)},setMask:function(bt){J!==bt&&!F&&(n.depthMask(bt),J=bt)},setFunc:function(bt){if(xt&&(bt=nS[bt]),ot!==bt){switch(bt){case Ac:n.depthFunc(n.NEVER);break;case Rc:n.depthFunc(n.ALWAYS);break;case Cc:n.depthFunc(n.LESS);break;case Hs:n.depthFunc(n.LEQUAL);break;case Pc:n.depthFunc(n.EQUAL);break;case Lc:n.depthFunc(n.GEQUAL);break;case Dc:n.depthFunc(n.GREATER);break;case kc:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ot=bt}},setLocked:function(bt){F=bt},setClear:function(bt){St!==bt&&(xt&&(bt=1-bt),n.clearDepth(bt),St=bt)},reset:function(){F=!1,J=null,ot=null,St=null,xt=!1}}}function s(){let F=!1,xt=null,J=null,ot=null,St=null,bt=null,Kt=null,re=null,ce=null;return{setTest:function(ne){F||(ne?j(n.STENCIL_TEST):Mt(n.STENCIL_TEST))},setMask:function(ne){xt!==ne&&!F&&(n.stencilMask(ne),xt=ne)},setFunc:function(ne,be,xe){(J!==ne||ot!==be||St!==xe)&&(n.stencilFunc(ne,be,xe),J=ne,ot=be,St=xe)},setOp:function(ne,be,xe){(bt!==ne||Kt!==be||re!==xe)&&(n.stencilOp(ne,be,xe),bt=ne,Kt=be,re=xe)},setLocked:function(ne){F=ne},setClear:function(ne){ce!==ne&&(n.clearStencil(ne),ce=ne)},reset:function(){F=!1,xt=null,J=null,ot=null,St=null,bt=null,Kt=null,re=null,ce=null}}}const a=new e,o=new i,r=new s,l=new WeakMap,c=new WeakMap;let h={},f={},d=new WeakMap,u=[],m=null,y=!1,g=null,p=null,x=null,_=null,v=null,R=null,w=null,S=new ee(0,0,0),T=0,b=!1,M=null,C=null,I=null,k=null,N=null;const L=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let D=!1,B=0;const U=n.getParameter(n.VERSION);U.indexOf("WebGL")!==-1?(B=parseFloat(/^WebGL (\d)/.exec(U)[1]),D=B>=1):U.indexOf("OpenGL ES")!==-1&&(B=parseFloat(/^OpenGL ES (\d)/.exec(U)[1]),D=B>=2);let z=null,W={};const mt=n.getParameter(n.SCISSOR_BOX),at=n.getParameter(n.VIEWPORT),dt=new Ge().fromArray(mt),tt=new Ge().fromArray(at);function Z(F,xt,J,ot){const St=new Uint8Array(4),bt=n.createTexture();n.bindTexture(F,bt),n.texParameteri(F,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(F,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Kt=0;Kt<J;Kt++)F===n.TEXTURE_3D||F===n.TEXTURE_2D_ARRAY?n.texImage3D(xt,0,n.RGBA,1,1,ot,0,n.RGBA,n.UNSIGNED_BYTE,St):n.texImage2D(xt+Kt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,St);return bt}const pt={};pt[n.TEXTURE_2D]=Z(n.TEXTURE_2D,n.TEXTURE_2D,1),pt[n.TEXTURE_CUBE_MAP]=Z(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),pt[n.TEXTURE_2D_ARRAY]=Z(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),pt[n.TEXTURE_3D]=Z(n.TEXTURE_3D,n.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),r.setClear(0),j(n.DEPTH_TEST),o.setFunc(Hs),Zt(!1),Vt(Oh),j(n.CULL_FACE),V(Pi);function j(F){h[F]!==!0&&(n.enable(F),h[F]=!0)}function Mt(F){h[F]!==!1&&(n.disable(F),h[F]=!1)}function $t(F,xt){return f[F]!==xt?(n.bindFramebuffer(F,xt),f[F]=xt,F===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=xt),F===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=xt),!0):!1}function Bt(F,xt){let J=u,ot=!1;if(F){J=d.get(xt),J===void 0&&(J=[],d.set(xt,J));const St=F.textures;if(J.length!==St.length||J[0]!==n.COLOR_ATTACHMENT0){for(let bt=0,Kt=St.length;bt<Kt;bt++)J[bt]=n.COLOR_ATTACHMENT0+bt;J.length=St.length,ot=!0}}else J[0]!==n.BACK&&(J[0]=n.BACK,ot=!0);ot&&n.drawBuffers(J)}function jt(F){return m!==F?(n.useProgram(F),m=F,!0):!1}const ht={[Ki]:n.FUNC_ADD,[ag]:n.FUNC_SUBTRACT,[og]:n.FUNC_REVERSE_SUBTRACT};ht[rg]=n.MIN,ht[cg]=n.MAX;const Dt={[lg]:n.ZERO,[hg]:n.ONE,[dg]:n.SRC_COLOR,[Ec]:n.SRC_ALPHA,[xg]:n.SRC_ALPHA_SATURATE,[mg]:n.DST_COLOR,[fg]:n.DST_ALPHA,[ug]:n.ONE_MINUS_SRC_COLOR,[Tc]:n.ONE_MINUS_SRC_ALPHA,[gg]:n.ONE_MINUS_DST_COLOR,[pg]:n.ONE_MINUS_DST_ALPHA,[vg]:n.CONSTANT_COLOR,[_g]:n.ONE_MINUS_CONSTANT_COLOR,[yg]:n.CONSTANT_ALPHA,[Mg]:n.ONE_MINUS_CONSTANT_ALPHA};function V(F,xt,J,ot,St,bt,Kt,re,ce,ne){if(F===Pi){y===!0&&(Mt(n.BLEND),y=!1);return}if(y===!1&&(j(n.BLEND),y=!0),F!==sg){if(F!==g||ne!==b){if((p!==Ki||v!==Ki)&&(n.blendEquation(n.FUNC_ADD),p=Ki,v=Ki),ne)switch(F){case Us:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ei:n.blendFunc(n.ONE,n.ONE);break;case Bh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Hh:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case Us:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ei:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Bh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Hh:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}x=null,_=null,R=null,w=null,S.set(0,0,0),T=0,g=F,b=ne}return}St=St||xt,bt=bt||J,Kt=Kt||ot,(xt!==p||St!==v)&&(n.blendEquationSeparate(ht[xt],ht[St]),p=xt,v=St),(J!==x||ot!==_||bt!==R||Kt!==w)&&(n.blendFuncSeparate(Dt[J],Dt[ot],Dt[bt],Dt[Kt]),x=J,_=ot,R=bt,w=Kt),(re.equals(S)===!1||ce!==T)&&(n.blendColor(re.r,re.g,re.b,ce),S.copy(re),T=ce),g=F,b=!1}function ue(F,xt){F.side===Ne?Mt(n.CULL_FACE):j(n.CULL_FACE);let J=F.side===Mn;xt&&(J=!J),Zt(J),F.blending===Us&&F.transparent===!1?V(Pi):V(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),o.setFunc(F.depthFunc),o.setTest(F.depthTest),o.setMask(F.depthWrite),a.setMask(F.colorWrite);const ot=F.stencilWrite;r.setTest(ot),ot&&(r.setMask(F.stencilWriteMask),r.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),r.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Et(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?j(n.SAMPLE_ALPHA_TO_COVERAGE):Mt(n.SAMPLE_ALPHA_TO_COVERAGE)}function Zt(F){M!==F&&(F?n.frontFace(n.CW):n.frontFace(n.CCW),M=F)}function Vt(F){F!==ng?(j(n.CULL_FACE),F!==C&&(F===Oh?n.cullFace(n.BACK):F===ig?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Mt(n.CULL_FACE),C=F}function kt(F){F!==I&&(D&&n.lineWidth(F),I=F)}function Et(F,xt,J){F?(j(n.POLYGON_OFFSET_FILL),(k!==xt||N!==J)&&(n.polygonOffset(xt,J),k=xt,N=J)):Mt(n.POLYGON_OFFSET_FILL)}function At(F){F?j(n.SCISSOR_TEST):Mt(n.SCISSOR_TEST)}function P(F){F===void 0&&(F=n.TEXTURE0+L-1),z!==F&&(n.activeTexture(F),z=F)}function E(F,xt,J){J===void 0&&(z===null?J=n.TEXTURE0+L-1:J=z);let ot=W[J];ot===void 0&&(ot={type:void 0,texture:void 0},W[J]=ot),(ot.type!==F||ot.texture!==xt)&&(z!==J&&(n.activeTexture(J),z=J),n.bindTexture(F,xt||pt[F]),ot.type=F,ot.texture=xt)}function Y(){const F=W[z];F!==void 0&&F.type!==void 0&&(n.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function rt(){try{n.compressedTexImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function lt(){try{n.compressedTexImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function it(){try{n.texSubImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Rt(){try{n.texSubImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function K(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ft(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function It(){try{n.texStorage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function et(){try{n.texStorage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function gt(){try{n.texImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function O(){try{n.texImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function st(F){dt.equals(F)===!1&&(n.scissor(F.x,F.y,F.z,F.w),dt.copy(F))}function ut(F){tt.equals(F)===!1&&(n.viewport(F.x,F.y,F.z,F.w),tt.copy(F))}function Gt(F,xt){let J=c.get(xt);J===void 0&&(J=new WeakMap,c.set(xt,J));let ot=J.get(F);ot===void 0&&(ot=n.getUniformBlockIndex(xt,F.name),J.set(F,ot))}function qt(F,xt){const ot=c.get(xt).get(F);l.get(xt)!==ot&&(n.uniformBlockBinding(xt,ot,F.__bindingPointIndex),l.set(xt,ot))}function zt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},z=null,W={},f={},d=new WeakMap,u=[],m=null,y=!1,g=null,p=null,x=null,_=null,v=null,R=null,w=null,S=new ee(0,0,0),T=0,b=!1,M=null,C=null,I=null,k=null,N=null,dt.set(0,0,n.canvas.width,n.canvas.height),tt.set(0,0,n.canvas.width,n.canvas.height),a.reset(),o.reset(),r.reset()}return{buffers:{color:a,depth:o,stencil:r},enable:j,disable:Mt,bindFramebuffer:$t,drawBuffers:Bt,useProgram:jt,setBlending:V,setMaterial:ue,setFlipSided:Zt,setCullFace:Vt,setLineWidth:kt,setPolygonOffset:Et,setScissorTest:At,activeTexture:P,bindTexture:E,unbindTexture:Y,compressedTexImage2D:rt,compressedTexImage3D:lt,texImage2D:gt,texImage3D:O,updateUBOMapping:Gt,uniformBlockBinding:qt,texStorage2D:It,texStorage3D:et,texSubImage2D:it,texSubImage3D:Rt,compressedTexSubImage2D:K,compressedTexSubImage3D:ft,scissor:st,viewport:ut,reset:zt}}function zd(n,t,e,i){const s=sS(i);switch(e){case Ou:return n*t;case Hu:return n*t;case Gu:return n*t*2;case Vu:return n*t/s.components*s.byteLength;case Il:return n*t/s.components*s.byteLength;case Xu:return n*t*2/s.components*s.byteLength;case Fl:return n*t*2/s.components*s.byteLength;case Bu:return n*t*3/s.components*s.byteLength;case Bn:return n*t*4/s.components*s.byteLength;case Ul:return n*t*4/s.components*s.byteLength;case bo:case wo:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Eo:case To:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Oc:case Hc:return Math.max(n,16)*Math.max(t,8)/4;case Nc:case Bc:return Math.max(n,8)*Math.max(t,8)/2;case Gc:case Vc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Xc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Wc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case $c:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case Yc:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case Zc:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case qc:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case jc:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Kc:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Jc:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case Qc:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case tl:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case el:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case nl:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case il:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case sl:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case Ao:case al:case ol:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Wu:case rl:return Math.ceil(n/4)*Math.ceil(t/4)*8;case cl:case ll:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function sS(n){switch(n){case xi:case Uu:return{byteLength:1,components:1};case Sa:case zu:case Pa:return{byteLength:2,components:1};case Dl:case kl:return{byteLength:2,components:4};case is:case Ll:case pi:return{byteLength:4,components:1};case Nu:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function aS(n,t,e,i,s,a,o){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Wt,h=new WeakMap;let f;const d=new WeakMap;let u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(P,E){return u?new OffscreenCanvas(P,E):Ho("canvas")}function y(P,E,Y){let rt=1;const lt=At(P);if((lt.width>Y||lt.height>Y)&&(rt=Y/Math.max(lt.width,lt.height)),rt<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const it=Math.floor(rt*lt.width),Rt=Math.floor(rt*lt.height);f===void 0&&(f=m(it,Rt));const K=E?m(it,Rt):f;return K.width=it,K.height=Rt,K.getContext("2d").drawImage(P,0,0,it,Rt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+lt.width+"x"+lt.height+") to ("+it+"x"+Rt+")."),K}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+lt.width+"x"+lt.height+")."),P;return P}function g(P){return P.generateMipmaps}function p(P){n.generateMipmap(P)}function x(P){return P.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?n.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function _(P,E,Y,rt,lt=!1){if(P!==null){if(n[P]!==void 0)return n[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let it=E;if(E===n.RED&&(Y===n.FLOAT&&(it=n.R32F),Y===n.HALF_FLOAT&&(it=n.R16F),Y===n.UNSIGNED_BYTE&&(it=n.R8)),E===n.RED_INTEGER&&(Y===n.UNSIGNED_BYTE&&(it=n.R8UI),Y===n.UNSIGNED_SHORT&&(it=n.R16UI),Y===n.UNSIGNED_INT&&(it=n.R32UI),Y===n.BYTE&&(it=n.R8I),Y===n.SHORT&&(it=n.R16I),Y===n.INT&&(it=n.R32I)),E===n.RG&&(Y===n.FLOAT&&(it=n.RG32F),Y===n.HALF_FLOAT&&(it=n.RG16F),Y===n.UNSIGNED_BYTE&&(it=n.RG8)),E===n.RG_INTEGER&&(Y===n.UNSIGNED_BYTE&&(it=n.RG8UI),Y===n.UNSIGNED_SHORT&&(it=n.RG16UI),Y===n.UNSIGNED_INT&&(it=n.RG32UI),Y===n.BYTE&&(it=n.RG8I),Y===n.SHORT&&(it=n.RG16I),Y===n.INT&&(it=n.RG32I)),E===n.RGB_INTEGER&&(Y===n.UNSIGNED_BYTE&&(it=n.RGB8UI),Y===n.UNSIGNED_SHORT&&(it=n.RGB16UI),Y===n.UNSIGNED_INT&&(it=n.RGB32UI),Y===n.BYTE&&(it=n.RGB8I),Y===n.SHORT&&(it=n.RGB16I),Y===n.INT&&(it=n.RGB32I)),E===n.RGBA_INTEGER&&(Y===n.UNSIGNED_BYTE&&(it=n.RGBA8UI),Y===n.UNSIGNED_SHORT&&(it=n.RGBA16UI),Y===n.UNSIGNED_INT&&(it=n.RGBA32UI),Y===n.BYTE&&(it=n.RGBA8I),Y===n.SHORT&&(it=n.RGBA16I),Y===n.INT&&(it=n.RGBA32I)),E===n.RGB&&Y===n.UNSIGNED_INT_5_9_9_9_REV&&(it=n.RGB9_E5),E===n.RGBA){const Rt=lt?Jo:_e.getTransfer(rt);Y===n.FLOAT&&(it=n.RGBA32F),Y===n.HALF_FLOAT&&(it=n.RGBA16F),Y===n.UNSIGNED_BYTE&&(it=Rt===Pe?n.SRGB8_ALPHA8:n.RGBA8),Y===n.UNSIGNED_SHORT_4_4_4_4&&(it=n.RGBA4),Y===n.UNSIGNED_SHORT_5_5_5_1&&(it=n.RGB5_A1)}return(it===n.R16F||it===n.R32F||it===n.RG16F||it===n.RG32F||it===n.RGBA16F||it===n.RGBA32F)&&t.get("EXT_color_buffer_float"),it}function v(P,E){let Y;return P?E===null||E===is||E===Xs?Y=n.DEPTH24_STENCIL8:E===pi?Y=n.DEPTH32F_STENCIL8:E===Sa&&(Y=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===is||E===Xs?Y=n.DEPTH_COMPONENT24:E===pi?Y=n.DEPTH_COMPONENT32F:E===Sa&&(Y=n.DEPTH_COMPONENT16),Y}function R(P,E){return g(P)===!0||P.isFramebufferTexture&&P.minFilter!==Hn&&P.minFilter!==ti?Math.log2(Math.max(E.width,E.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?E.mipmaps.length:1}function w(P){const E=P.target;E.removeEventListener("dispose",w),T(E),E.isVideoTexture&&h.delete(E)}function S(P){const E=P.target;E.removeEventListener("dispose",S),M(E)}function T(P){const E=i.get(P);if(E.__webglInit===void 0)return;const Y=P.source,rt=d.get(Y);if(rt){const lt=rt[E.__cacheKey];lt.usedTimes--,lt.usedTimes===0&&b(P),Object.keys(rt).length===0&&d.delete(Y)}i.remove(P)}function b(P){const E=i.get(P);n.deleteTexture(E.__webglTexture);const Y=P.source,rt=d.get(Y);delete rt[E.__cacheKey],o.memory.textures--}function M(P){const E=i.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),i.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let rt=0;rt<6;rt++){if(Array.isArray(E.__webglFramebuffer[rt]))for(let lt=0;lt<E.__webglFramebuffer[rt].length;lt++)n.deleteFramebuffer(E.__webglFramebuffer[rt][lt]);else n.deleteFramebuffer(E.__webglFramebuffer[rt]);E.__webglDepthbuffer&&n.deleteRenderbuffer(E.__webglDepthbuffer[rt])}else{if(Array.isArray(E.__webglFramebuffer))for(let rt=0;rt<E.__webglFramebuffer.length;rt++)n.deleteFramebuffer(E.__webglFramebuffer[rt]);else n.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&n.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&n.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let rt=0;rt<E.__webglColorRenderbuffer.length;rt++)E.__webglColorRenderbuffer[rt]&&n.deleteRenderbuffer(E.__webglColorRenderbuffer[rt]);E.__webglDepthRenderbuffer&&n.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const Y=P.textures;for(let rt=0,lt=Y.length;rt<lt;rt++){const it=i.get(Y[rt]);it.__webglTexture&&(n.deleteTexture(it.__webglTexture),o.memory.textures--),i.remove(Y[rt])}i.remove(P)}let C=0;function I(){C=0}function k(){const P=C;return P>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+s.maxTextures),C+=1,P}function N(P){const E=[];return E.push(P.wrapS),E.push(P.wrapT),E.push(P.wrapR||0),E.push(P.magFilter),E.push(P.minFilter),E.push(P.anisotropy),E.push(P.internalFormat),E.push(P.format),E.push(P.type),E.push(P.generateMipmaps),E.push(P.premultiplyAlpha),E.push(P.flipY),E.push(P.unpackAlignment),E.push(P.colorSpace),E.join()}function L(P,E){const Y=i.get(P);if(P.isVideoTexture&&kt(P),P.isRenderTargetTexture===!1&&P.version>0&&Y.__version!==P.version){const rt=P.image;if(rt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(rt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{tt(Y,P,E);return}}e.bindTexture(n.TEXTURE_2D,Y.__webglTexture,n.TEXTURE0+E)}function D(P,E){const Y=i.get(P);if(P.version>0&&Y.__version!==P.version){tt(Y,P,E);return}e.bindTexture(n.TEXTURE_2D_ARRAY,Y.__webglTexture,n.TEXTURE0+E)}function B(P,E){const Y=i.get(P);if(P.version>0&&Y.__version!==P.version){tt(Y,P,E);return}e.bindTexture(n.TEXTURE_3D,Y.__webglTexture,n.TEXTURE0+E)}function U(P,E){const Y=i.get(P);if(P.version>0&&Y.__version!==P.version){Z(Y,P,E);return}e.bindTexture(n.TEXTURE_CUBE_MAP,Y.__webglTexture,n.TEXTURE0+E)}const z={[Uc]:n.REPEAT,[Qi]:n.CLAMP_TO_EDGE,[zc]:n.MIRRORED_REPEAT},W={[Hn]:n.NEAREST,[Lg]:n.NEAREST_MIPMAP_NEAREST,[Va]:n.NEAREST_MIPMAP_LINEAR,[ti]:n.LINEAR,[Ar]:n.LINEAR_MIPMAP_NEAREST,[ts]:n.LINEAR_MIPMAP_LINEAR},mt={[Fg]:n.NEVER,[Hg]:n.ALWAYS,[Ug]:n.LESS,[Yu]:n.LEQUAL,[zg]:n.EQUAL,[Bg]:n.GEQUAL,[Ng]:n.GREATER,[Og]:n.NOTEQUAL};function at(P,E){if(E.type===pi&&t.has("OES_texture_float_linear")===!1&&(E.magFilter===ti||E.magFilter===Ar||E.magFilter===Va||E.magFilter===ts||E.minFilter===ti||E.minFilter===Ar||E.minFilter===Va||E.minFilter===ts)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(P,n.TEXTURE_WRAP_S,z[E.wrapS]),n.texParameteri(P,n.TEXTURE_WRAP_T,z[E.wrapT]),(P===n.TEXTURE_3D||P===n.TEXTURE_2D_ARRAY)&&n.texParameteri(P,n.TEXTURE_WRAP_R,z[E.wrapR]),n.texParameteri(P,n.TEXTURE_MAG_FILTER,W[E.magFilter]),n.texParameteri(P,n.TEXTURE_MIN_FILTER,W[E.minFilter]),E.compareFunction&&(n.texParameteri(P,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(P,n.TEXTURE_COMPARE_FUNC,mt[E.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===Hn||E.minFilter!==Va&&E.minFilter!==ts||E.type===pi&&t.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||i.get(E).__currentAnisotropy){const Y=t.get("EXT_texture_filter_anisotropic");n.texParameterf(P,Y.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,s.getMaxAnisotropy())),i.get(E).__currentAnisotropy=E.anisotropy}}}function dt(P,E){let Y=!1;P.__webglInit===void 0&&(P.__webglInit=!0,E.addEventListener("dispose",w));const rt=E.source;let lt=d.get(rt);lt===void 0&&(lt={},d.set(rt,lt));const it=N(E);if(it!==P.__cacheKey){lt[it]===void 0&&(lt[it]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,Y=!0),lt[it].usedTimes++;const Rt=lt[P.__cacheKey];Rt!==void 0&&(lt[P.__cacheKey].usedTimes--,Rt.usedTimes===0&&b(E)),P.__cacheKey=it,P.__webglTexture=lt[it].texture}return Y}function tt(P,E,Y){let rt=n.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(rt=n.TEXTURE_2D_ARRAY),E.isData3DTexture&&(rt=n.TEXTURE_3D);const lt=dt(P,E),it=E.source;e.bindTexture(rt,P.__webglTexture,n.TEXTURE0+Y);const Rt=i.get(it);if(it.version!==Rt.__version||lt===!0){e.activeTexture(n.TEXTURE0+Y);const K=_e.getPrimaries(_e.workingColorSpace),ft=E.colorSpace===Ti?null:_e.getPrimaries(E.colorSpace),It=E.colorSpace===Ti||K===ft?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,E.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,E.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,It);let et=y(E.image,!1,s.maxTextureSize);et=Et(E,et);const gt=a.convert(E.format,E.colorSpace),O=a.convert(E.type);let st=_(E.internalFormat,gt,O,E.colorSpace,E.isVideoTexture);at(rt,E);let ut;const Gt=E.mipmaps,qt=E.isVideoTexture!==!0,zt=Rt.__version===void 0||lt===!0,F=it.dataReady,xt=R(E,et);if(E.isDepthTexture)st=v(E.format===Ws,E.type),zt&&(qt?e.texStorage2D(n.TEXTURE_2D,1,st,et.width,et.height):e.texImage2D(n.TEXTURE_2D,0,st,et.width,et.height,0,gt,O,null));else if(E.isDataTexture)if(Gt.length>0){qt&&zt&&e.texStorage2D(n.TEXTURE_2D,xt,st,Gt[0].width,Gt[0].height);for(let J=0,ot=Gt.length;J<ot;J++)ut=Gt[J],qt?F&&e.texSubImage2D(n.TEXTURE_2D,J,0,0,ut.width,ut.height,gt,O,ut.data):e.texImage2D(n.TEXTURE_2D,J,st,ut.width,ut.height,0,gt,O,ut.data);E.generateMipmaps=!1}else qt?(zt&&e.texStorage2D(n.TEXTURE_2D,xt,st,et.width,et.height),F&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,et.width,et.height,gt,O,et.data)):e.texImage2D(n.TEXTURE_2D,0,st,et.width,et.height,0,gt,O,et.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){qt&&zt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,xt,st,Gt[0].width,Gt[0].height,et.depth);for(let J=0,ot=Gt.length;J<ot;J++)if(ut=Gt[J],E.format!==Bn)if(gt!==null)if(qt){if(F)if(E.layerUpdates.size>0){const St=zd(ut.width,ut.height,E.format,E.type);for(const bt of E.layerUpdates){const Kt=ut.data.subarray(bt*St/ut.data.BYTES_PER_ELEMENT,(bt+1)*St/ut.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,J,0,0,bt,ut.width,ut.height,1,gt,Kt)}E.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,J,0,0,0,ut.width,ut.height,et.depth,gt,ut.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,J,st,ut.width,ut.height,et.depth,0,ut.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else qt?F&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,J,0,0,0,ut.width,ut.height,et.depth,gt,O,ut.data):e.texImage3D(n.TEXTURE_2D_ARRAY,J,st,ut.width,ut.height,et.depth,0,gt,O,ut.data)}else{qt&&zt&&e.texStorage2D(n.TEXTURE_2D,xt,st,Gt[0].width,Gt[0].height);for(let J=0,ot=Gt.length;J<ot;J++)ut=Gt[J],E.format!==Bn?gt!==null?qt?F&&e.compressedTexSubImage2D(n.TEXTURE_2D,J,0,0,ut.width,ut.height,gt,ut.data):e.compressedTexImage2D(n.TEXTURE_2D,J,st,ut.width,ut.height,0,ut.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):qt?F&&e.texSubImage2D(n.TEXTURE_2D,J,0,0,ut.width,ut.height,gt,O,ut.data):e.texImage2D(n.TEXTURE_2D,J,st,ut.width,ut.height,0,gt,O,ut.data)}else if(E.isDataArrayTexture)if(qt){if(zt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,xt,st,et.width,et.height,et.depth),F)if(E.layerUpdates.size>0){const J=zd(et.width,et.height,E.format,E.type);for(const ot of E.layerUpdates){const St=et.data.subarray(ot*J/et.data.BYTES_PER_ELEMENT,(ot+1)*J/et.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ot,et.width,et.height,1,gt,O,St)}E.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,et.width,et.height,et.depth,gt,O,et.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,st,et.width,et.height,et.depth,0,gt,O,et.data);else if(E.isData3DTexture)qt?(zt&&e.texStorage3D(n.TEXTURE_3D,xt,st,et.width,et.height,et.depth),F&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,et.width,et.height,et.depth,gt,O,et.data)):e.texImage3D(n.TEXTURE_3D,0,st,et.width,et.height,et.depth,0,gt,O,et.data);else if(E.isFramebufferTexture){if(zt)if(qt)e.texStorage2D(n.TEXTURE_2D,xt,st,et.width,et.height);else{let J=et.width,ot=et.height;for(let St=0;St<xt;St++)e.texImage2D(n.TEXTURE_2D,St,st,J,ot,0,gt,O,null),J>>=1,ot>>=1}}else if(Gt.length>0){if(qt&&zt){const J=At(Gt[0]);e.texStorage2D(n.TEXTURE_2D,xt,st,J.width,J.height)}for(let J=0,ot=Gt.length;J<ot;J++)ut=Gt[J],qt?F&&e.texSubImage2D(n.TEXTURE_2D,J,0,0,gt,O,ut):e.texImage2D(n.TEXTURE_2D,J,st,gt,O,ut);E.generateMipmaps=!1}else if(qt){if(zt){const J=At(et);e.texStorage2D(n.TEXTURE_2D,xt,st,J.width,J.height)}F&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,gt,O,et)}else e.texImage2D(n.TEXTURE_2D,0,st,gt,O,et);g(E)&&p(rt),Rt.__version=it.version,E.onUpdate&&E.onUpdate(E)}P.__version=E.version}function Z(P,E,Y){if(E.image.length!==6)return;const rt=dt(P,E),lt=E.source;e.bindTexture(n.TEXTURE_CUBE_MAP,P.__webglTexture,n.TEXTURE0+Y);const it=i.get(lt);if(lt.version!==it.__version||rt===!0){e.activeTexture(n.TEXTURE0+Y);const Rt=_e.getPrimaries(_e.workingColorSpace),K=E.colorSpace===Ti?null:_e.getPrimaries(E.colorSpace),ft=E.colorSpace===Ti||Rt===K?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,E.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,E.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ft);const It=E.isCompressedTexture||E.image[0].isCompressedTexture,et=E.image[0]&&E.image[0].isDataTexture,gt=[];for(let ot=0;ot<6;ot++)!It&&!et?gt[ot]=y(E.image[ot],!0,s.maxCubemapSize):gt[ot]=et?E.image[ot].image:E.image[ot],gt[ot]=Et(E,gt[ot]);const O=gt[0],st=a.convert(E.format,E.colorSpace),ut=a.convert(E.type),Gt=_(E.internalFormat,st,ut,E.colorSpace),qt=E.isVideoTexture!==!0,zt=it.__version===void 0||rt===!0,F=lt.dataReady;let xt=R(E,O);at(n.TEXTURE_CUBE_MAP,E);let J;if(It){qt&&zt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,xt,Gt,O.width,O.height);for(let ot=0;ot<6;ot++){J=gt[ot].mipmaps;for(let St=0;St<J.length;St++){const bt=J[St];E.format!==Bn?st!==null?qt?F&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,St,0,0,bt.width,bt.height,st,bt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,St,Gt,bt.width,bt.height,0,bt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):qt?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,St,0,0,bt.width,bt.height,st,ut,bt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,St,Gt,bt.width,bt.height,0,st,ut,bt.data)}}}else{if(J=E.mipmaps,qt&&zt){J.length>0&&xt++;const ot=At(gt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,xt,Gt,ot.width,ot.height)}for(let ot=0;ot<6;ot++)if(et){qt?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,0,0,gt[ot].width,gt[ot].height,st,ut,gt[ot].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,Gt,gt[ot].width,gt[ot].height,0,st,ut,gt[ot].data);for(let St=0;St<J.length;St++){const Kt=J[St].image[ot].image;qt?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,St+1,0,0,Kt.width,Kt.height,st,ut,Kt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,St+1,Gt,Kt.width,Kt.height,0,st,ut,Kt.data)}}else{qt?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,0,0,st,ut,gt[ot]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,Gt,st,ut,gt[ot]);for(let St=0;St<J.length;St++){const bt=J[St];qt?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,St+1,0,0,st,ut,bt.image[ot]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,St+1,Gt,st,ut,bt.image[ot])}}}g(E)&&p(n.TEXTURE_CUBE_MAP),it.__version=lt.version,E.onUpdate&&E.onUpdate(E)}P.__version=E.version}function pt(P,E,Y,rt,lt,it){const Rt=a.convert(Y.format,Y.colorSpace),K=a.convert(Y.type),ft=_(Y.internalFormat,Rt,K,Y.colorSpace),It=i.get(E),et=i.get(Y);if(et.__renderTarget=E,!It.__hasExternalTextures){const gt=Math.max(1,E.width>>it),O=Math.max(1,E.height>>it);lt===n.TEXTURE_3D||lt===n.TEXTURE_2D_ARRAY?e.texImage3D(lt,it,ft,gt,O,E.depth,0,Rt,K,null):e.texImage2D(lt,it,ft,gt,O,0,Rt,K,null)}e.bindFramebuffer(n.FRAMEBUFFER,P),Vt(E)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,rt,lt,et.__webglTexture,0,Zt(E)):(lt===n.TEXTURE_2D||lt>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&lt<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,rt,lt,et.__webglTexture,it),e.bindFramebuffer(n.FRAMEBUFFER,null)}function j(P,E,Y){if(n.bindRenderbuffer(n.RENDERBUFFER,P),E.depthBuffer){const rt=E.depthTexture,lt=rt&&rt.isDepthTexture?rt.type:null,it=v(E.stencilBuffer,lt),Rt=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,K=Zt(E);Vt(E)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,K,it,E.width,E.height):Y?n.renderbufferStorageMultisample(n.RENDERBUFFER,K,it,E.width,E.height):n.renderbufferStorage(n.RENDERBUFFER,it,E.width,E.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Rt,n.RENDERBUFFER,P)}else{const rt=E.textures;for(let lt=0;lt<rt.length;lt++){const it=rt[lt],Rt=a.convert(it.format,it.colorSpace),K=a.convert(it.type),ft=_(it.internalFormat,Rt,K,it.colorSpace),It=Zt(E);Y&&Vt(E)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,It,ft,E.width,E.height):Vt(E)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,It,ft,E.width,E.height):n.renderbufferStorage(n.RENDERBUFFER,ft,E.width,E.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Mt(P,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,P),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const rt=i.get(E.depthTexture);rt.__renderTarget=E,(!rt.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),L(E.depthTexture,0);const lt=rt.__webglTexture,it=Zt(E);if(E.depthTexture.format===zs)Vt(E)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,lt,0,it):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,lt,0);else if(E.depthTexture.format===Ws)Vt(E)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,lt,0,it):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,lt,0);else throw new Error("Unknown depthTexture format")}function $t(P){const E=i.get(P),Y=P.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==P.depthTexture){const rt=P.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),rt){const lt=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,rt.removeEventListener("dispose",lt)};rt.addEventListener("dispose",lt),E.__depthDisposeCallback=lt}E.__boundDepthTexture=rt}if(P.depthTexture&&!E.__autoAllocateDepthBuffer){if(Y)throw new Error("target.depthTexture not supported in Cube render targets");Mt(E.__webglFramebuffer,P)}else if(Y){E.__webglDepthbuffer=[];for(let rt=0;rt<6;rt++)if(e.bindFramebuffer(n.FRAMEBUFFER,E.__webglFramebuffer[rt]),E.__webglDepthbuffer[rt]===void 0)E.__webglDepthbuffer[rt]=n.createRenderbuffer(),j(E.__webglDepthbuffer[rt],P,!1);else{const lt=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,it=E.__webglDepthbuffer[rt];n.bindRenderbuffer(n.RENDERBUFFER,it),n.framebufferRenderbuffer(n.FRAMEBUFFER,lt,n.RENDERBUFFER,it)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=n.createRenderbuffer(),j(E.__webglDepthbuffer,P,!1);else{const rt=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,lt=E.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,lt),n.framebufferRenderbuffer(n.FRAMEBUFFER,rt,n.RENDERBUFFER,lt)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Bt(P,E,Y){const rt=i.get(P);E!==void 0&&pt(rt.__webglFramebuffer,P,P.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),Y!==void 0&&$t(P)}function jt(P){const E=P.texture,Y=i.get(P),rt=i.get(E);P.addEventListener("dispose",S);const lt=P.textures,it=P.isWebGLCubeRenderTarget===!0,Rt=lt.length>1;if(Rt||(rt.__webglTexture===void 0&&(rt.__webglTexture=n.createTexture()),rt.__version=E.version,o.memory.textures++),it){Y.__webglFramebuffer=[];for(let K=0;K<6;K++)if(E.mipmaps&&E.mipmaps.length>0){Y.__webglFramebuffer[K]=[];for(let ft=0;ft<E.mipmaps.length;ft++)Y.__webglFramebuffer[K][ft]=n.createFramebuffer()}else Y.__webglFramebuffer[K]=n.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){Y.__webglFramebuffer=[];for(let K=0;K<E.mipmaps.length;K++)Y.__webglFramebuffer[K]=n.createFramebuffer()}else Y.__webglFramebuffer=n.createFramebuffer();if(Rt)for(let K=0,ft=lt.length;K<ft;K++){const It=i.get(lt[K]);It.__webglTexture===void 0&&(It.__webglTexture=n.createTexture(),o.memory.textures++)}if(P.samples>0&&Vt(P)===!1){Y.__webglMultisampledFramebuffer=n.createFramebuffer(),Y.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,Y.__webglMultisampledFramebuffer);for(let K=0;K<lt.length;K++){const ft=lt[K];Y.__webglColorRenderbuffer[K]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,Y.__webglColorRenderbuffer[K]);const It=a.convert(ft.format,ft.colorSpace),et=a.convert(ft.type),gt=_(ft.internalFormat,It,et,ft.colorSpace,P.isXRRenderTarget===!0),O=Zt(P);n.renderbufferStorageMultisample(n.RENDERBUFFER,O,gt,P.width,P.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+K,n.RENDERBUFFER,Y.__webglColorRenderbuffer[K])}n.bindRenderbuffer(n.RENDERBUFFER,null),P.depthBuffer&&(Y.__webglDepthRenderbuffer=n.createRenderbuffer(),j(Y.__webglDepthRenderbuffer,P,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(it){e.bindTexture(n.TEXTURE_CUBE_MAP,rt.__webglTexture),at(n.TEXTURE_CUBE_MAP,E);for(let K=0;K<6;K++)if(E.mipmaps&&E.mipmaps.length>0)for(let ft=0;ft<E.mipmaps.length;ft++)pt(Y.__webglFramebuffer[K][ft],P,E,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+K,ft);else pt(Y.__webglFramebuffer[K],P,E,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+K,0);g(E)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Rt){for(let K=0,ft=lt.length;K<ft;K++){const It=lt[K],et=i.get(It);e.bindTexture(n.TEXTURE_2D,et.__webglTexture),at(n.TEXTURE_2D,It),pt(Y.__webglFramebuffer,P,It,n.COLOR_ATTACHMENT0+K,n.TEXTURE_2D,0),g(It)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let K=n.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(K=P.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(K,rt.__webglTexture),at(K,E),E.mipmaps&&E.mipmaps.length>0)for(let ft=0;ft<E.mipmaps.length;ft++)pt(Y.__webglFramebuffer[ft],P,E,n.COLOR_ATTACHMENT0,K,ft);else pt(Y.__webglFramebuffer,P,E,n.COLOR_ATTACHMENT0,K,0);g(E)&&p(K),e.unbindTexture()}P.depthBuffer&&$t(P)}function ht(P){const E=P.textures;for(let Y=0,rt=E.length;Y<rt;Y++){const lt=E[Y];if(g(lt)){const it=x(P),Rt=i.get(lt).__webglTexture;e.bindTexture(it,Rt),p(it),e.unbindTexture()}}}const Dt=[],V=[];function ue(P){if(P.samples>0){if(Vt(P)===!1){const E=P.textures,Y=P.width,rt=P.height;let lt=n.COLOR_BUFFER_BIT;const it=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Rt=i.get(P),K=E.length>1;if(K)for(let ft=0;ft<E.length;ft++)e.bindFramebuffer(n.FRAMEBUFFER,Rt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ft,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,Rt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ft,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,Rt.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Rt.__webglFramebuffer);for(let ft=0;ft<E.length;ft++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(lt|=n.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(lt|=n.STENCIL_BUFFER_BIT)),K){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Rt.__webglColorRenderbuffer[ft]);const It=i.get(E[ft]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,It,0)}n.blitFramebuffer(0,0,Y,rt,0,0,Y,rt,lt,n.NEAREST),l===!0&&(Dt.length=0,V.length=0,Dt.push(n.COLOR_ATTACHMENT0+ft),P.depthBuffer&&P.resolveDepthBuffer===!1&&(Dt.push(it),V.push(it),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,V)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Dt))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),K)for(let ft=0;ft<E.length;ft++){e.bindFramebuffer(n.FRAMEBUFFER,Rt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ft,n.RENDERBUFFER,Rt.__webglColorRenderbuffer[ft]);const It=i.get(E[ft]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,Rt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ft,n.TEXTURE_2D,It,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Rt.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&l){const E=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[E])}}}function Zt(P){return Math.min(s.maxSamples,P.samples)}function Vt(P){const E=i.get(P);return P.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function kt(P){const E=o.render.frame;h.get(P)!==E&&(h.set(P,E),P.update())}function Et(P,E){const Y=P.colorSpace,rt=P.format,lt=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||Y!==Ys&&Y!==Ti&&(_e.getTransfer(Y)===Pe?(rt!==Bn||lt!==xi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Y)),E}function At(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=k,this.resetTextureUnits=I,this.setTexture2D=L,this.setTexture2DArray=D,this.setTexture3D=B,this.setTextureCube=U,this.rebindTextures=Bt,this.setupRenderTarget=jt,this.updateRenderTargetMipmap=ht,this.updateMultisampleRenderTarget=ue,this.setupDepthRenderbuffer=$t,this.setupFrameBufferTexture=pt,this.useMultisampledRTT=Vt}function oS(n,t){function e(i,s=Ti){let a;const o=_e.getTransfer(s);if(i===xi)return n.UNSIGNED_BYTE;if(i===Dl)return n.UNSIGNED_SHORT_4_4_4_4;if(i===kl)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Nu)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Uu)return n.BYTE;if(i===zu)return n.SHORT;if(i===Sa)return n.UNSIGNED_SHORT;if(i===Ll)return n.INT;if(i===is)return n.UNSIGNED_INT;if(i===pi)return n.FLOAT;if(i===Pa)return n.HALF_FLOAT;if(i===Ou)return n.ALPHA;if(i===Bu)return n.RGB;if(i===Bn)return n.RGBA;if(i===Hu)return n.LUMINANCE;if(i===Gu)return n.LUMINANCE_ALPHA;if(i===zs)return n.DEPTH_COMPONENT;if(i===Ws)return n.DEPTH_STENCIL;if(i===Vu)return n.RED;if(i===Il)return n.RED_INTEGER;if(i===Xu)return n.RG;if(i===Fl)return n.RG_INTEGER;if(i===Ul)return n.RGBA_INTEGER;if(i===bo||i===wo||i===Eo||i===To)if(o===Pe)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===bo)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===wo)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Eo)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===To)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===bo)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===wo)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Eo)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===To)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Nc||i===Oc||i===Bc||i===Hc)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===Nc)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Oc)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Bc)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Hc)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Gc||i===Vc||i===Xc)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(i===Gc||i===Vc)return o===Pe?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===Xc)return o===Pe?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Wc||i===$c||i===Yc||i===Zc||i===qc||i===jc||i===Kc||i===Jc||i===Qc||i===tl||i===el||i===nl||i===il||i===sl)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(i===Wc)return o===Pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===$c)return o===Pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Yc)return o===Pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Zc)return o===Pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===qc)return o===Pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===jc)return o===Pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Kc)return o===Pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Jc)return o===Pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Qc)return o===Pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===tl)return o===Pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===el)return o===Pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===nl)return o===Pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===il)return o===Pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===sl)return o===Pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Ao||i===al||i===ol)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(i===Ao)return o===Pe?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===al)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===ol)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Wu||i===rl||i===cl||i===ll)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(i===Ao)return a.COMPRESSED_RED_RGTC1_EXT;if(i===rl)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===cl)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===ll)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Xs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class rS extends Ln{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Le extends He{constructor(){super(),this.isGroup=!0,this.type="Group"}}const cS={type:"move"};class tc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Le,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Le,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new G,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new G),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Le,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new G,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new G),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,a=null,o=null;const r=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const y of t.hand.values()){const g=e.getJointPose(y,i),p=this._getHandJoint(c,y);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=h.position.distanceTo(f.position),u=.02,m=.005;c.inputState.pinching&&d>u+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=u-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(a=e.getPose(t.gripSpace,i),a!==null&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1));r!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&a!==null&&(s=a),s!==null&&(r.matrix.fromArray(s.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,s.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(s.linearVelocity)):r.hasLinearVelocity=!1,s.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(s.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(cS)))}return r!==null&&(r.visible=s!==null),l!==null&&(l.visible=a!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new Le;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const lS=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,hS=`
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

}`;class dS{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const s=new _n,a=t.properties.get(s);a.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new ki({vertexShader:lS,fragmentShader:hS,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ge(new Pn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class uS extends Zs{constructor(t,e){super();const i=this;let s=null,a=1,o=null,r="local-floor",l=1,c=null,h=null,f=null,d=null,u=null,m=null;const y=new dS,g=e.getContextAttributes();let p=null,x=null;const _=[],v=[],R=new Wt;let w=null;const S=new Ln;S.viewport=new Ge;const T=new Ln;T.viewport=new Ge;const b=[S,T],M=new rS;let C=null,I=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(tt){let Z=_[tt];return Z===void 0&&(Z=new tc,_[tt]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(tt){let Z=_[tt];return Z===void 0&&(Z=new tc,_[tt]=Z),Z.getGripSpace()},this.getHand=function(tt){let Z=_[tt];return Z===void 0&&(Z=new tc,_[tt]=Z),Z.getHandSpace()};function k(tt){const Z=v.indexOf(tt.inputSource);if(Z===-1)return;const pt=_[Z];pt!==void 0&&(pt.update(tt.inputSource,tt.frame,c||o),pt.dispatchEvent({type:tt.type,data:tt.inputSource}))}function N(){s.removeEventListener("select",k),s.removeEventListener("selectstart",k),s.removeEventListener("selectend",k),s.removeEventListener("squeeze",k),s.removeEventListener("squeezestart",k),s.removeEventListener("squeezeend",k),s.removeEventListener("end",N),s.removeEventListener("inputsourceschange",L);for(let tt=0;tt<_.length;tt++){const Z=v[tt];Z!==null&&(v[tt]=null,_[tt].disconnect(Z))}C=null,I=null,y.reset(),t.setRenderTarget(p),u=null,d=null,f=null,s=null,x=null,dt.stop(),i.isPresenting=!1,t.setPixelRatio(w),t.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(tt){a=tt,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(tt){r=tt,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(tt){c=tt},this.getBaseLayer=function(){return d!==null?d:u},this.getBinding=function(){return f},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(tt){if(s=tt,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",k),s.addEventListener("selectstart",k),s.addEventListener("selectend",k),s.addEventListener("squeeze",k),s.addEventListener("squeezestart",k),s.addEventListener("squeezeend",k),s.addEventListener("end",N),s.addEventListener("inputsourceschange",L),g.xrCompatible!==!0&&await e.makeXRCompatible(),w=t.getPixelRatio(),t.getSize(R),s.renderState.layers===void 0){const Z={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:a};u=new XRWebGLLayer(s,e,Z),s.updateRenderState({baseLayer:u}),t.setPixelRatio(1),t.setSize(u.framebufferWidth,u.framebufferHeight,!1),x=new ss(u.framebufferWidth,u.framebufferHeight,{format:Bn,type:xi,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let Z=null,pt=null,j=null;g.depth&&(j=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Z=g.stencil?Ws:zs,pt=g.stencil?Xs:is);const Mt={colorFormat:e.RGBA8,depthFormat:j,scaleFactor:a};f=new XRWebGLBinding(s,e),d=f.createProjectionLayer(Mt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),x=new ss(d.textureWidth,d.textureHeight,{format:Bn,type:xi,depthTexture:new of(d.textureWidth,d.textureHeight,pt,void 0,void 0,void 0,void 0,void 0,void 0,Z),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(r),dt.setContext(s),dt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function L(tt){for(let Z=0;Z<tt.removed.length;Z++){const pt=tt.removed[Z],j=v.indexOf(pt);j>=0&&(v[j]=null,_[j].disconnect(pt))}for(let Z=0;Z<tt.added.length;Z++){const pt=tt.added[Z];let j=v.indexOf(pt);if(j===-1){for(let $t=0;$t<_.length;$t++)if($t>=v.length){v.push(pt),j=$t;break}else if(v[$t]===null){v[$t]=pt,j=$t;break}if(j===-1)break}const Mt=_[j];Mt&&Mt.connect(pt)}}const D=new G,B=new G;function U(tt,Z,pt){D.setFromMatrixPosition(Z.matrixWorld),B.setFromMatrixPosition(pt.matrixWorld);const j=D.distanceTo(B),Mt=Z.projectionMatrix.elements,$t=pt.projectionMatrix.elements,Bt=Mt[14]/(Mt[10]-1),jt=Mt[14]/(Mt[10]+1),ht=(Mt[9]+1)/Mt[5],Dt=(Mt[9]-1)/Mt[5],V=(Mt[8]-1)/Mt[0],ue=($t[8]+1)/$t[0],Zt=Bt*V,Vt=Bt*ue,kt=j/(-V+ue),Et=kt*-V;if(Z.matrixWorld.decompose(tt.position,tt.quaternion,tt.scale),tt.translateX(Et),tt.translateZ(kt),tt.matrixWorld.compose(tt.position,tt.quaternion,tt.scale),tt.matrixWorldInverse.copy(tt.matrixWorld).invert(),Mt[10]===-1)tt.projectionMatrix.copy(Z.projectionMatrix),tt.projectionMatrixInverse.copy(Z.projectionMatrixInverse);else{const At=Bt+kt,P=jt+kt,E=Zt-Et,Y=Vt+(j-Et),rt=ht*jt/P*At,lt=Dt*jt/P*At;tt.projectionMatrix.makePerspective(E,Y,rt,lt,At,P),tt.projectionMatrixInverse.copy(tt.projectionMatrix).invert()}}function z(tt,Z){Z===null?tt.matrixWorld.copy(tt.matrix):tt.matrixWorld.multiplyMatrices(Z.matrixWorld,tt.matrix),tt.matrixWorldInverse.copy(tt.matrixWorld).invert()}this.updateCamera=function(tt){if(s===null)return;let Z=tt.near,pt=tt.far;y.texture!==null&&(y.depthNear>0&&(Z=y.depthNear),y.depthFar>0&&(pt=y.depthFar)),M.near=T.near=S.near=Z,M.far=T.far=S.far=pt,(C!==M.near||I!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),C=M.near,I=M.far),S.layers.mask=tt.layers.mask|2,T.layers.mask=tt.layers.mask|4,M.layers.mask=S.layers.mask|T.layers.mask;const j=tt.parent,Mt=M.cameras;z(M,j);for(let $t=0;$t<Mt.length;$t++)z(Mt[$t],j);Mt.length===2?U(M,S,T):M.projectionMatrix.copy(S.projectionMatrix),W(tt,M,j)};function W(tt,Z,pt){pt===null?tt.matrix.copy(Z.matrixWorld):(tt.matrix.copy(pt.matrixWorld),tt.matrix.invert(),tt.matrix.multiply(Z.matrixWorld)),tt.matrix.decompose(tt.position,tt.quaternion,tt.scale),tt.updateMatrixWorld(!0),tt.projectionMatrix.copy(Z.projectionMatrix),tt.projectionMatrixInverse.copy(Z.projectionMatrixInverse),tt.isPerspectiveCamera&&(tt.fov=ba*2*Math.atan(1/tt.projectionMatrix.elements[5]),tt.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&u===null))return l},this.setFoveation=function(tt){l=tt,d!==null&&(d.fixedFoveation=tt),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=tt)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(M)};let mt=null;function at(tt,Z){if(h=Z.getViewerPose(c||o),m=Z,h!==null){const pt=h.views;u!==null&&(t.setRenderTargetFramebuffer(x,u.framebuffer),t.setRenderTarget(x));let j=!1;pt.length!==M.cameras.length&&(M.cameras.length=0,j=!0);for(let $t=0;$t<pt.length;$t++){const Bt=pt[$t];let jt=null;if(u!==null)jt=u.getViewport(Bt);else{const Dt=f.getViewSubImage(d,Bt);jt=Dt.viewport,$t===0&&(t.setRenderTargetTextures(x,Dt.colorTexture,d.ignoreDepthValues?void 0:Dt.depthStencilTexture),t.setRenderTarget(x))}let ht=b[$t];ht===void 0&&(ht=new Ln,ht.layers.enable($t),ht.viewport=new Ge,b[$t]=ht),ht.matrix.fromArray(Bt.transform.matrix),ht.matrix.decompose(ht.position,ht.quaternion,ht.scale),ht.projectionMatrix.fromArray(Bt.projectionMatrix),ht.projectionMatrixInverse.copy(ht.projectionMatrix).invert(),ht.viewport.set(jt.x,jt.y,jt.width,jt.height),$t===0&&(M.matrix.copy(ht.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),j===!0&&M.cameras.push(ht)}const Mt=s.enabledFeatures;if(Mt&&Mt.includes("depth-sensing")){const $t=f.getDepthInformation(pt[0]);$t&&$t.isValid&&$t.texture&&y.init(t,$t,s.renderState)}}for(let pt=0;pt<_.length;pt++){const j=v[pt],Mt=_[pt];j!==null&&Mt!==void 0&&Mt.update(j,Z,c||o)}mt&&mt(tt,Z),Z.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Z}),m=null}const dt=new sf;dt.setAnimationLoop(at),this.setAnimationLoop=function(tt){mt=tt},this.dispose=function(){}}}const Xi=new ii,fS=new Fe;function pS(n,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,tf(n)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,x,_,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?a(g,p):p.isMeshToonMaterial?(a(g,p),f(g,p)):p.isMeshPhongMaterial?(a(g,p),h(g,p)):p.isMeshStandardMaterial?(a(g,p),d(g,p),p.isMeshPhysicalMaterial&&u(g,p,v)):p.isMeshMatcapMaterial?(a(g,p),m(g,p)):p.isMeshDepthMaterial?a(g,p):p.isMeshDistanceMaterial?(a(g,p),y(g,p)):p.isMeshNormalMaterial?a(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&r(g,p)):p.isPointsMaterial?l(g,p,x,_):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function a(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Mn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Mn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const x=t.get(p),_=x.envMap,v=x.envMapRotation;_&&(g.envMap.value=_,Xi.copy(v),Xi.x*=-1,Xi.y*=-1,Xi.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(Xi.y*=-1,Xi.z*=-1),g.envMapRotation.value.setFromMatrix4(fS.makeRotationFromEuler(Xi)),g.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function r(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,x,_){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*x,g.scale.value=_*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function f(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function u(g,p,x){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Mn&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=x.texture,g.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function y(g,p){const x=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(x.matrixWorld),g.nearDistance.value=x.shadow.camera.near,g.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function mS(n,t,e,i){let s={},a={},o=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,_){const v=_.program;i.uniformBlockBinding(x,v)}function c(x,_){let v=s[x.id];v===void 0&&(m(x),v=h(x),s[x.id]=v,x.addEventListener("dispose",g));const R=_.program;i.updateUBOMapping(x,R);const w=t.render.frame;a[x.id]!==w&&(d(x),a[x.id]=w)}function h(x){const _=f();x.__bindingPointIndex=_;const v=n.createBuffer(),R=x.__size,w=x.usage;return n.bindBuffer(n.UNIFORM_BUFFER,v),n.bufferData(n.UNIFORM_BUFFER,R,w),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,_,v),v}function f(){for(let x=0;x<r;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(x){const _=s[x.id],v=x.uniforms,R=x.__cache;n.bindBuffer(n.UNIFORM_BUFFER,_);for(let w=0,S=v.length;w<S;w++){const T=Array.isArray(v[w])?v[w]:[v[w]];for(let b=0,M=T.length;b<M;b++){const C=T[b];if(u(C,w,b,R)===!0){const I=C.__offset,k=Array.isArray(C.value)?C.value:[C.value];let N=0;for(let L=0;L<k.length;L++){const D=k[L],B=y(D);typeof D=="number"||typeof D=="boolean"?(C.__data[0]=D,n.bufferSubData(n.UNIFORM_BUFFER,I+N,C.__data)):D.isMatrix3?(C.__data[0]=D.elements[0],C.__data[1]=D.elements[1],C.__data[2]=D.elements[2],C.__data[3]=0,C.__data[4]=D.elements[3],C.__data[5]=D.elements[4],C.__data[6]=D.elements[5],C.__data[7]=0,C.__data[8]=D.elements[6],C.__data[9]=D.elements[7],C.__data[10]=D.elements[8],C.__data[11]=0):(D.toArray(C.__data,N),N+=B.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,I,C.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function u(x,_,v,R){const w=x.value,S=_+"_"+v;if(R[S]===void 0)return typeof w=="number"||typeof w=="boolean"?R[S]=w:R[S]=w.clone(),!0;{const T=R[S];if(typeof w=="number"||typeof w=="boolean"){if(T!==w)return R[S]=w,!0}else if(T.equals(w)===!1)return T.copy(w),!0}return!1}function m(x){const _=x.uniforms;let v=0;const R=16;for(let S=0,T=_.length;S<T;S++){const b=Array.isArray(_[S])?_[S]:[_[S]];for(let M=0,C=b.length;M<C;M++){const I=b[M],k=Array.isArray(I.value)?I.value:[I.value];for(let N=0,L=k.length;N<L;N++){const D=k[N],B=y(D),U=v%R,z=U%B.boundary,W=U+z;v+=z,W!==0&&R-W<B.storage&&(v+=R-W),I.__data=new Float32Array(B.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=v,v+=B.storage}}}const w=v%R;return w>0&&(v+=R-w),x.__size=v,x.__cache={},this}function y(x){const _={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(_.boundary=4,_.storage=4):x.isVector2?(_.boundary=8,_.storage=8):x.isVector3||x.isColor?(_.boundary=16,_.storage=12):x.isVector4?(_.boundary=16,_.storage=16):x.isMatrix3?(_.boundary=48,_.storage=48):x.isMatrix4?(_.boundary=64,_.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),_}function g(x){const _=x.target;_.removeEventListener("dispose",g);const v=o.indexOf(_.__bindingPointIndex);o.splice(v,1),n.deleteBuffer(s[_.id]),delete s[_.id],delete a[_.id]}function p(){for(const x in s)n.deleteBuffer(s[x]);o=[],s={},a={}}return{bind:l,update:c,dispose:p}}class gS{constructor(t={}){const{canvas:e=sx(),context:i=null,depth:s=!0,stencil:a=!1,alpha:o=!1,antialias:r=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let u;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=i.getContextAttributes().alpha}else u=o;const m=new Uint32Array(4),y=new Int32Array(4);let g=null,p=null;const x=[],_=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=xn,this.toneMapping=Li,this.toneMappingExposure=1;const v=this;let R=!1,w=0,S=0,T=null,b=-1,M=null;const C=new Ge,I=new Ge;let k=null;const N=new ee(0);let L=0,D=e.width,B=e.height,U=1,z=null,W=null;const mt=new Ge(0,0,D,B),at=new Ge(0,0,D,B);let dt=!1;const tt=new Bl;let Z=!1,pt=!1;const j=new Fe,Mt=new Fe,$t=new G,Bt=new Ge,jt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ht=!1;function Dt(){return T===null?U:1}let V=i;function ue(A,X){return e.getContext(A,X)}try{const A={alpha:!0,depth:s,stencil:a,antialias:r,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Cl}`),e.addEventListener("webglcontextlost",ot,!1),e.addEventListener("webglcontextrestored",St,!1),e.addEventListener("webglcontextcreationerror",bt,!1),V===null){const X="webgl2";if(V=ue(X,A),V===null)throw ue(X)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let Zt,Vt,kt,Et,At,P,E,Y,rt,lt,it,Rt,K,ft,It,et,gt,O,st,ut,Gt,qt,zt,F;function xt(){Zt=new My(V),Zt.init(),qt=new oS(V,Zt),Vt=new my(V,Zt,t,qt),kt=new iS(V,Zt),Vt.reverseDepthBuffer&&d&&kt.buffers.depth.setReversed(!0),Et=new wy(V),At=new GM,P=new aS(V,Zt,kt,At,Vt,qt,Et),E=new xy(v),Y=new yy(v),rt=new Lx(V),zt=new fy(V,rt),lt=new Sy(V,rt,Et,zt),it=new Ty(V,lt,rt,Et),st=new Ey(V,Vt,P),et=new gy(At),Rt=new HM(v,E,Y,Zt,Vt,zt,et),K=new pS(v,At),ft=new XM,It=new jM(Zt),O=new uy(v,E,Y,kt,it,u,l),gt=new eS(v,it,Vt),F=new mS(V,Et,Vt,kt),ut=new py(V,Zt,Et),Gt=new by(V,Zt,Et),Et.programs=Rt.programs,v.capabilities=Vt,v.extensions=Zt,v.properties=At,v.renderLists=ft,v.shadowMap=gt,v.state=kt,v.info=Et}xt();const J=new uS(v,V);this.xr=J,this.getContext=function(){return V},this.getContextAttributes=function(){return V.getContextAttributes()},this.forceContextLoss=function(){const A=Zt.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=Zt.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return U},this.setPixelRatio=function(A){A!==void 0&&(U=A,this.setSize(D,B,!1))},this.getSize=function(A){return A.set(D,B)},this.setSize=function(A,X,nt=!0){if(J.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}D=A,B=X,e.width=Math.floor(A*U),e.height=Math.floor(X*U),nt===!0&&(e.style.width=A+"px",e.style.height=X+"px"),this.setViewport(0,0,A,X)},this.getDrawingBufferSize=function(A){return A.set(D*U,B*U).floor()},this.setDrawingBufferSize=function(A,X,nt){D=A,B=X,U=nt,e.width=Math.floor(A*nt),e.height=Math.floor(X*nt),this.setViewport(0,0,A,X)},this.getCurrentViewport=function(A){return A.copy(C)},this.getViewport=function(A){return A.copy(mt)},this.setViewport=function(A,X,nt,Q){A.isVector4?mt.set(A.x,A.y,A.z,A.w):mt.set(A,X,nt,Q),kt.viewport(C.copy(mt).multiplyScalar(U).round())},this.getScissor=function(A){return A.copy(at)},this.setScissor=function(A,X,nt,Q){A.isVector4?at.set(A.x,A.y,A.z,A.w):at.set(A,X,nt,Q),kt.scissor(I.copy(at).multiplyScalar(U).round())},this.getScissorTest=function(){return dt},this.setScissorTest=function(A){kt.setScissorTest(dt=A)},this.setOpaqueSort=function(A){z=A},this.setTransparentSort=function(A){W=A},this.getClearColor=function(A){return A.copy(O.getClearColor())},this.setClearColor=function(){O.setClearColor.apply(O,arguments)},this.getClearAlpha=function(){return O.getClearAlpha()},this.setClearAlpha=function(){O.setClearAlpha.apply(O,arguments)},this.clear=function(A=!0,X=!0,nt=!0){let Q=0;if(A){let $=!1;if(T!==null){const wt=T.texture.format;$=wt===Ul||wt===Fl||wt===Il}if($){const wt=T.texture.type,Pt=wt===xi||wt===is||wt===Sa||wt===Xs||wt===Dl||wt===kl,Yt=O.getClearColor(),Xt=O.getClearAlpha(),Ft=Yt.r,Ht=Yt.g,Lt=Yt.b;Pt?(m[0]=Ft,m[1]=Ht,m[2]=Lt,m[3]=Xt,V.clearBufferuiv(V.COLOR,0,m)):(y[0]=Ft,y[1]=Ht,y[2]=Lt,y[3]=Xt,V.clearBufferiv(V.COLOR,0,y))}else Q|=V.COLOR_BUFFER_BIT}X&&(Q|=V.DEPTH_BUFFER_BIT),nt&&(Q|=V.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ot,!1),e.removeEventListener("webglcontextrestored",St,!1),e.removeEventListener("webglcontextcreationerror",bt,!1),ft.dispose(),It.dispose(),At.dispose(),E.dispose(),Y.dispose(),it.dispose(),zt.dispose(),F.dispose(),Rt.dispose(),J.dispose(),J.removeEventListener("sessionstart",Ve),J.removeEventListener("sessionend",je),Me.stop()};function ot(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),R=!0}function St(){console.log("THREE.WebGLRenderer: Context Restored."),R=!1;const A=Et.autoReset,X=gt.enabled,nt=gt.autoUpdate,Q=gt.needsUpdate,$=gt.type;xt(),Et.autoReset=A,gt.enabled=X,gt.autoUpdate=nt,gt.needsUpdate=Q,gt.type=$}function bt(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function Kt(A){const X=A.target;X.removeEventListener("dispose",Kt),re(X)}function re(A){ce(A),At.remove(A)}function ce(A){const X=At.get(A).programs;X!==void 0&&(X.forEach(function(nt){Rt.releaseProgram(nt)}),A.isShaderMaterial&&Rt.releaseShaderCache(A))}this.renderBufferDirect=function(A,X,nt,Q,$,wt){X===null&&(X=jt);const Pt=$.isMesh&&$.matrixWorld.determinant()<0,Yt=ae(A,X,nt,Q,$);kt.setMaterial(Q,Pt);let Xt=nt.index,Ft=1;if(Q.wireframe===!0){if(Xt=lt.getWireframeAttribute(nt),Xt===void 0)return;Ft=2}const Ht=nt.drawRange,Lt=nt.attributes.position;let oe=Ht.start*Ft,yt=(Ht.start+Ht.count)*Ft;wt!==null&&(oe=Math.max(oe,wt.start*Ft),yt=Math.min(yt,(wt.start+wt.count)*Ft)),Xt!==null?(oe=Math.max(oe,0),yt=Math.min(yt,Xt.count)):Lt!=null&&(oe=Math.max(oe,0),yt=Math.min(yt,Lt.count));const vt=yt-oe;if(vt<0||vt===1/0)return;zt.setup($,Q,Yt,nt,Xt);let te,he=ut;if(Xt!==null&&(te=rt.get(Xt),he=Gt,he.setIndex(te)),$.isMesh)Q.wireframe===!0?(kt.setLineWidth(Q.wireframeLinewidth*Dt()),he.setMode(V.LINES)):he.setMode(V.TRIANGLES);else if($.isLine){let Nt=Q.linewidth;Nt===void 0&&(Nt=1),kt.setLineWidth(Nt*Dt()),$.isLineSegments?he.setMode(V.LINES):$.isLineLoop?he.setMode(V.LINE_LOOP):he.setMode(V.LINE_STRIP)}else $.isPoints?he.setMode(V.POINTS):$.isSprite&&he.setMode(V.TRIANGLES);if($.isBatchedMesh)if($._multiDrawInstances!==null)he.renderMultiDrawInstances($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount,$._multiDrawInstances);else if(Zt.get("WEBGL_multi_draw"))he.renderMultiDraw($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount);else{const Nt=$._multiDrawStarts,Ke=$._multiDrawCounts,de=$._multiDrawCount,Ae=Xt?rt.get(Xt).bytesPerElement:1,Vn=At.get(Q).currentProgram.getUniforms();for(let We=0;We<de;We++)Vn.setValue(V,"_gl_DrawID",We),he.render(Nt[We]/Ae,Ke[We])}else if($.isInstancedMesh)he.renderInstances(oe,vt,$.count);else if(nt.isInstancedBufferGeometry){const Nt=nt._maxInstanceCount!==void 0?nt._maxInstanceCount:1/0,Ke=Math.min(nt.instanceCount,Nt);he.renderInstances(oe,vt,Ke)}else he.render(oe,vt)};function ne(A,X,nt){A.transparent===!0&&A.side===Ne&&A.forceSinglePass===!1?(A.side=Mn,A.needsUpdate=!0,Qt(A,X,nt),A.side=Di,A.needsUpdate=!0,Qt(A,X,nt),A.side=Ne):Qt(A,X,nt)}this.compile=function(A,X,nt=null){nt===null&&(nt=A),p=It.get(nt),p.init(X),_.push(p),nt.traverseVisible(function($){$.isLight&&$.layers.test(X.layers)&&(p.pushLight($),$.castShadow&&p.pushShadow($))}),A!==nt&&A.traverseVisible(function($){$.isLight&&$.layers.test(X.layers)&&(p.pushLight($),$.castShadow&&p.pushShadow($))}),p.setupLights();const Q=new Set;return A.traverse(function($){if(!($.isMesh||$.isPoints||$.isLine||$.isSprite))return;const wt=$.material;if(wt)if(Array.isArray(wt))for(let Pt=0;Pt<wt.length;Pt++){const Yt=wt[Pt];ne(Yt,nt,$),Q.add(Yt)}else ne(wt,nt,$),Q.add(wt)}),_.pop(),p=null,Q},this.compileAsync=function(A,X,nt=null){const Q=this.compile(A,X,nt);return new Promise($=>{function wt(){if(Q.forEach(function(Pt){At.get(Pt).currentProgram.isReady()&&Q.delete(Pt)}),Q.size===0){$(A);return}setTimeout(wt,10)}Zt.get("KHR_parallel_shader_compile")!==null?wt():setTimeout(wt,10)})};let be=null;function xe(A){be&&be(A)}function Ve(){Me.stop()}function je(){Me.start()}const Me=new sf;Me.setAnimationLoop(xe),typeof self<"u"&&Me.setContext(self),this.setAnimationLoop=function(A){be=A,J.setAnimationLoop(A),A===null?Me.stop():Me.start()},J.addEventListener("sessionstart",Ve),J.addEventListener("sessionend",je),this.render=function(A,X){if(X!==void 0&&X.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),X.parent===null&&X.matrixWorldAutoUpdate===!0&&X.updateMatrixWorld(),J.enabled===!0&&J.isPresenting===!0&&(J.cameraAutoUpdate===!0&&J.updateCamera(X),X=J.getCamera()),A.isScene===!0&&A.onBeforeRender(v,A,X,T),p=It.get(A,_.length),p.init(X),_.push(p),Mt.multiplyMatrices(X.projectionMatrix,X.matrixWorldInverse),tt.setFromProjectionMatrix(Mt),pt=this.localClippingEnabled,Z=et.init(this.clippingPlanes,pt),g=ft.get(A,x.length),g.init(),x.push(g),J.enabled===!0&&J.isPresenting===!0){const wt=v.xr.getDepthSensingMesh();wt!==null&&ke(wt,X,-1/0,v.sortObjects)}ke(A,X,0,v.sortObjects),g.finish(),v.sortObjects===!0&&g.sort(z,W),ht=J.enabled===!1||J.isPresenting===!1||J.hasDepthSensing()===!1,ht&&O.addToRenderList(g,A),this.info.render.frame++,Z===!0&&et.beginShadows();const nt=p.state.shadowsArray;gt.render(nt,A,X),Z===!0&&et.endShadows(),this.info.autoReset===!0&&this.info.reset();const Q=g.opaque,$=g.transmissive;if(p.setupLights(),X.isArrayCamera){const wt=X.cameras;if($.length>0)for(let Pt=0,Yt=wt.length;Pt<Yt;Pt++){const Xt=wt[Pt];q(Q,$,A,Xt)}ht&&O.render(A);for(let Pt=0,Yt=wt.length;Pt<Yt;Pt++){const Xt=wt[Pt];Ue(g,A,Xt,Xt.viewport)}}else $.length>0&&q(Q,$,A,X),ht&&O.render(A),Ue(g,A,X);T!==null&&(P.updateMultisampleRenderTarget(T),P.updateRenderTargetMipmap(T)),A.isScene===!0&&A.onAfterRender(v,A,X),zt.resetDefaultState(),b=-1,M=null,_.pop(),_.length>0?(p=_[_.length-1],Z===!0&&et.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,x.pop(),x.length>0?g=x[x.length-1]:g=null};function ke(A,X,nt,Q){if(A.visible===!1)return;if(A.layers.test(X.layers)){if(A.isGroup)nt=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(X);else if(A.isLight)p.pushLight(A),A.castShadow&&p.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||tt.intersectsSprite(A)){Q&&Bt.setFromMatrixPosition(A.matrixWorld).applyMatrix4(Mt);const Pt=it.update(A),Yt=A.material;Yt.visible&&g.push(A,Pt,Yt,nt,Bt.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||tt.intersectsObject(A))){const Pt=it.update(A),Yt=A.material;if(Q&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),Bt.copy(A.boundingSphere.center)):(Pt.boundingSphere===null&&Pt.computeBoundingSphere(),Bt.copy(Pt.boundingSphere.center)),Bt.applyMatrix4(A.matrixWorld).applyMatrix4(Mt)),Array.isArray(Yt)){const Xt=Pt.groups;for(let Ft=0,Ht=Xt.length;Ft<Ht;Ft++){const Lt=Xt[Ft],oe=Yt[Lt.materialIndex];oe&&oe.visible&&g.push(A,Pt,oe,nt,Bt.z,Lt)}}else Yt.visible&&g.push(A,Pt,Yt,nt,Bt.z,null)}}const wt=A.children;for(let Pt=0,Yt=wt.length;Pt<Yt;Pt++)ke(wt[Pt],X,nt,Q)}function Ue(A,X,nt,Q){const $=A.opaque,wt=A.transmissive,Pt=A.transparent;p.setupLightsView(nt),Z===!0&&et.setGlobalState(v.clippingPlanes,nt),Q&&kt.viewport(C.copy(Q)),$.length>0&&Ct($,X,nt),wt.length>0&&Ct(wt,X,nt),Pt.length>0&&Ct(Pt,X,nt),kt.buffers.depth.setTest(!0),kt.buffers.depth.setMask(!0),kt.buffers.color.setMask(!0),kt.setPolygonOffset(!1)}function q(A,X,nt,Q){if((nt.isScene===!0?nt.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[Q.id]===void 0&&(p.state.transmissionRenderTarget[Q.id]=new ss(1,1,{generateMipmaps:!0,type:Zt.has("EXT_color_buffer_half_float")||Zt.has("EXT_color_buffer_float")?Pa:xi,minFilter:ts,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:_e.workingColorSpace}));const wt=p.state.transmissionRenderTarget[Q.id],Pt=Q.viewport||C;wt.setSize(Pt.z,Pt.w);const Yt=v.getRenderTarget();v.setRenderTarget(wt),v.getClearColor(N),L=v.getClearAlpha(),L<1&&v.setClearColor(16777215,.5),v.clear(),ht&&O.render(nt);const Xt=v.toneMapping;v.toneMapping=Li;const Ft=Q.viewport;if(Q.viewport!==void 0&&(Q.viewport=void 0),p.setupLightsView(Q),Z===!0&&et.setGlobalState(v.clippingPlanes,Q),Ct(A,nt,Q),P.updateMultisampleRenderTarget(wt),P.updateRenderTargetMipmap(wt),Zt.has("WEBGL_multisampled_render_to_texture")===!1){let Ht=!1;for(let Lt=0,oe=X.length;Lt<oe;Lt++){const yt=X[Lt],vt=yt.object,te=yt.geometry,he=yt.material,Nt=yt.group;if(he.side===Ne&&vt.layers.test(Q.layers)){const Ke=he.side;he.side=Mn,he.needsUpdate=!0,Tt(vt,nt,Q,te,he,Nt),he.side=Ke,he.needsUpdate=!0,Ht=!0}}Ht===!0&&(P.updateMultisampleRenderTarget(wt),P.updateRenderTargetMipmap(wt))}v.setRenderTarget(Yt),v.setClearColor(N,L),Ft!==void 0&&(Q.viewport=Ft),v.toneMapping=Xt}function Ct(A,X,nt){const Q=X.isScene===!0?X.overrideMaterial:null;for(let $=0,wt=A.length;$<wt;$++){const Pt=A[$],Yt=Pt.object,Xt=Pt.geometry,Ft=Q===null?Pt.material:Q,Ht=Pt.group;Yt.layers.test(nt.layers)&&Tt(Yt,X,nt,Xt,Ft,Ht)}}function Tt(A,X,nt,Q,$,wt){A.onBeforeRender(v,X,nt,Q,$,wt),A.modelViewMatrix.multiplyMatrices(nt.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),$.onBeforeRender(v,X,nt,Q,A,wt),$.transparent===!0&&$.side===Ne&&$.forceSinglePass===!1?($.side=Mn,$.needsUpdate=!0,v.renderBufferDirect(nt,X,Q,$,A,wt),$.side=Di,$.needsUpdate=!0,v.renderBufferDirect(nt,X,Q,$,A,wt),$.side=Ne):v.renderBufferDirect(nt,X,Q,$,A,wt),A.onAfterRender(v,X,nt,Q,$,wt)}function Qt(A,X,nt){X.isScene!==!0&&(X=jt);const Q=At.get(A),$=p.state.lights,wt=p.state.shadowsArray,Pt=$.state.version,Yt=Rt.getParameters(A,$.state,wt,X,nt),Xt=Rt.getProgramCacheKey(Yt);let Ft=Q.programs;Q.environment=A.isMeshStandardMaterial?X.environment:null,Q.fog=X.fog,Q.envMap=(A.isMeshStandardMaterial?Y:E).get(A.envMap||Q.environment),Q.envMapRotation=Q.environment!==null&&A.envMap===null?X.environmentRotation:A.envMapRotation,Ft===void 0&&(A.addEventListener("dispose",Kt),Ft=new Map,Q.programs=Ft);let Ht=Ft.get(Xt);if(Ht!==void 0){if(Q.currentProgram===Ht&&Q.lightsStateVersion===Pt)return le(A,Yt),Ht}else Yt.uniforms=Rt.getUniforms(A),A.onBeforeCompile(Yt,v),Ht=Rt.acquireProgram(Yt,Xt),Ft.set(Xt,Ht),Q.uniforms=Yt.uniforms;const Lt=Q.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Lt.clippingPlanes=et.uniform),le(A,Yt),Q.needsLights=Xe(A),Q.lightsStateVersion=Pt,Q.needsLights&&(Lt.ambientLightColor.value=$.state.ambient,Lt.lightProbe.value=$.state.probe,Lt.directionalLights.value=$.state.directional,Lt.directionalLightShadows.value=$.state.directionalShadow,Lt.spotLights.value=$.state.spot,Lt.spotLightShadows.value=$.state.spotShadow,Lt.rectAreaLights.value=$.state.rectArea,Lt.ltc_1.value=$.state.rectAreaLTC1,Lt.ltc_2.value=$.state.rectAreaLTC2,Lt.pointLights.value=$.state.point,Lt.pointLightShadows.value=$.state.pointShadow,Lt.hemisphereLights.value=$.state.hemi,Lt.directionalShadowMap.value=$.state.directionalShadowMap,Lt.directionalShadowMatrix.value=$.state.directionalShadowMatrix,Lt.spotShadowMap.value=$.state.spotShadowMap,Lt.spotLightMatrix.value=$.state.spotLightMatrix,Lt.spotLightMap.value=$.state.spotLightMap,Lt.pointShadowMap.value=$.state.pointShadowMap,Lt.pointShadowMatrix.value=$.state.pointShadowMatrix),Q.currentProgram=Ht,Q.uniformsList=null,Ht}function Jt(A){if(A.uniformsList===null){const X=A.currentProgram.getUniforms();A.uniformsList=Ro.seqWithValue(X.seq,A.uniforms)}return A.uniformsList}function le(A,X){const nt=At.get(A);nt.outputColorSpace=X.outputColorSpace,nt.batching=X.batching,nt.batchingColor=X.batchingColor,nt.instancing=X.instancing,nt.instancingColor=X.instancingColor,nt.instancingMorph=X.instancingMorph,nt.skinning=X.skinning,nt.morphTargets=X.morphTargets,nt.morphNormals=X.morphNormals,nt.morphColors=X.morphColors,nt.morphTargetsCount=X.morphTargetsCount,nt.numClippingPlanes=X.numClippingPlanes,nt.numIntersection=X.numClipIntersection,nt.vertexAlphas=X.vertexAlphas,nt.vertexTangents=X.vertexTangents,nt.toneMapping=X.toneMapping}function ae(A,X,nt,Q,$){X.isScene!==!0&&(X=jt),P.resetTextureUnits();const wt=X.fog,Pt=Q.isMeshStandardMaterial?X.environment:null,Yt=T===null?v.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:Ys,Xt=(Q.isMeshStandardMaterial?Y:E).get(Q.envMap||Pt),Ft=Q.vertexColors===!0&&!!nt.attributes.color&&nt.attributes.color.itemSize===4,Ht=!!nt.attributes.tangent&&(!!Q.normalMap||Q.anisotropy>0),Lt=!!nt.morphAttributes.position,oe=!!nt.morphAttributes.normal,yt=!!nt.morphAttributes.color;let vt=Li;Q.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(vt=v.toneMapping);const te=nt.morphAttributes.position||nt.morphAttributes.normal||nt.morphAttributes.color,he=te!==void 0?te.length:0,Nt=At.get(Q),Ke=p.state.lights;if(Z===!0&&(pt===!0||A!==M)){const fn=A===M&&Q.id===b;et.setState(Q,A,fn)}let de=!1;Q.version===Nt.__version?(Nt.needsLights&&Nt.lightsStateVersion!==Ke.state.version||Nt.outputColorSpace!==Yt||$.isBatchedMesh&&Nt.batching===!1||!$.isBatchedMesh&&Nt.batching===!0||$.isBatchedMesh&&Nt.batchingColor===!0&&$.colorTexture===null||$.isBatchedMesh&&Nt.batchingColor===!1&&$.colorTexture!==null||$.isInstancedMesh&&Nt.instancing===!1||!$.isInstancedMesh&&Nt.instancing===!0||$.isSkinnedMesh&&Nt.skinning===!1||!$.isSkinnedMesh&&Nt.skinning===!0||$.isInstancedMesh&&Nt.instancingColor===!0&&$.instanceColor===null||$.isInstancedMesh&&Nt.instancingColor===!1&&$.instanceColor!==null||$.isInstancedMesh&&Nt.instancingMorph===!0&&$.morphTexture===null||$.isInstancedMesh&&Nt.instancingMorph===!1&&$.morphTexture!==null||Nt.envMap!==Xt||Q.fog===!0&&Nt.fog!==wt||Nt.numClippingPlanes!==void 0&&(Nt.numClippingPlanes!==et.numPlanes||Nt.numIntersection!==et.numIntersection)||Nt.vertexAlphas!==Ft||Nt.vertexTangents!==Ht||Nt.morphTargets!==Lt||Nt.morphNormals!==oe||Nt.morphColors!==yt||Nt.toneMapping!==vt||Nt.morphTargetsCount!==he)&&(de=!0):(de=!0,Nt.__version=Q.version);let Ae=Nt.currentProgram;de===!0&&(Ae=Qt(Q,X,$));let Vn=!1,We=!1,Xn=!1;const we=Ae.getUniforms(),un=Nt.uniforms;if(kt.useProgram(Ae.program)&&(Vn=!0,We=!0,Xn=!0),Q.id!==b&&(b=Q.id,We=!0),Vn||M!==A){kt.buffers.depth.getReversed()?(j.copy(A.projectionMatrix),ox(j),rx(j),we.setValue(V,"projectionMatrix",j)):we.setValue(V,"projectionMatrix",A.projectionMatrix),we.setValue(V,"viewMatrix",A.matrixWorldInverse);const $n=we.map.cameraPosition;$n!==void 0&&$n.setValue(V,$t.setFromMatrixPosition(A.matrixWorld)),Vt.logarithmicDepthBuffer&&we.setValue(V,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(Q.isMeshPhongMaterial||Q.isMeshToonMaterial||Q.isMeshLambertMaterial||Q.isMeshBasicMaterial||Q.isMeshStandardMaterial||Q.isShaderMaterial)&&we.setValue(V,"isOrthographic",A.isOrthographicCamera===!0),M!==A&&(M=A,We=!0,Xn=!0)}if($.isSkinnedMesh){we.setOptional(V,$,"bindMatrix"),we.setOptional(V,$,"bindMatrixInverse");const fn=$.skeleton;fn&&(fn.boneTexture===null&&fn.computeBoneTexture(),we.setValue(V,"boneTexture",fn.boneTexture,P))}$.isBatchedMesh&&(we.setOptional(V,$,"batchingTexture"),we.setValue(V,"batchingTexture",$._matricesTexture,P),we.setOptional(V,$,"batchingIdTexture"),we.setValue(V,"batchingIdTexture",$._indirectTexture,P),we.setOptional(V,$,"batchingColorTexture"),$._colorsTexture!==null&&we.setValue(V,"batchingColorTexture",$._colorsTexture,P));const Wn=nt.morphAttributes;if((Wn.position!==void 0||Wn.normal!==void 0||Wn.color!==void 0)&&st.update($,nt,Ae),(We||Nt.receiveShadow!==$.receiveShadow)&&(Nt.receiveShadow=$.receiveShadow,we.setValue(V,"receiveShadow",$.receiveShadow)),Q.isMeshGouraudMaterial&&Q.envMap!==null&&(un.envMap.value=Xt,un.flipEnvMap.value=Xt.isCubeTexture&&Xt.isRenderTargetTexture===!1?-1:1),Q.isMeshStandardMaterial&&Q.envMap===null&&X.environment!==null&&(un.envMapIntensity.value=X.environmentIntensity),We&&(we.setValue(V,"toneMappingExposure",v.toneMappingExposure),Nt.needsLights&&cn(un,Xn),wt&&Q.fog===!0&&K.refreshFogUniforms(un,wt),K.refreshMaterialUniforms(un,Q,U,B,p.state.transmissionRenderTarget[A.id]),Ro.upload(V,Jt(Nt),un,P)),Q.isShaderMaterial&&Q.uniformsNeedUpdate===!0&&(Ro.upload(V,Jt(Nt),un,P),Q.uniformsNeedUpdate=!1),Q.isSpriteMaterial&&we.setValue(V,"center",$.center),we.setValue(V,"modelViewMatrix",$.modelViewMatrix),we.setValue(V,"normalMatrix",$.normalMatrix),we.setValue(V,"modelMatrix",$.matrixWorld),Q.isShaderMaterial||Q.isRawShaderMaterial){const fn=Q.uniformsGroups;for(let $n=0,Yn=fn.length;$n<Yn;$n++){const ka=fn[$n];F.update(ka,Ae),F.bind(ka,Ae)}}return Ae}function cn(A,X){A.ambientLightColor.needsUpdate=X,A.lightProbe.needsUpdate=X,A.directionalLights.needsUpdate=X,A.directionalLightShadows.needsUpdate=X,A.pointLights.needsUpdate=X,A.pointLightShadows.needsUpdate=X,A.spotLights.needsUpdate=X,A.spotLightShadows.needsUpdate=X,A.rectAreaLights.needsUpdate=X,A.hemisphereLights.needsUpdate=X}function Xe(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(A,X,nt){At.get(A.texture).__webglTexture=X,At.get(A.depthTexture).__webglTexture=nt;const Q=At.get(A);Q.__hasExternalTextures=!0,Q.__autoAllocateDepthBuffer=nt===void 0,Q.__autoAllocateDepthBuffer||Zt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Q.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(A,X){const nt=At.get(A);nt.__webglFramebuffer=X,nt.__useDefaultFramebuffer=X===void 0},this.setRenderTarget=function(A,X=0,nt=0){T=A,w=X,S=nt;let Q=!0,$=null,wt=!1,Pt=!1;if(A){const Xt=At.get(A);if(Xt.__useDefaultFramebuffer!==void 0)kt.bindFramebuffer(V.FRAMEBUFFER,null),Q=!1;else if(Xt.__webglFramebuffer===void 0)P.setupRenderTarget(A);else if(Xt.__hasExternalTextures)P.rebindTextures(A,At.get(A.texture).__webglTexture,At.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const Lt=A.depthTexture;if(Xt.__boundDepthTexture!==Lt){if(Lt!==null&&At.has(Lt)&&(A.width!==Lt.image.width||A.height!==Lt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");P.setupDepthRenderbuffer(A)}}const Ft=A.texture;(Ft.isData3DTexture||Ft.isDataArrayTexture||Ft.isCompressedArrayTexture)&&(Pt=!0);const Ht=At.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Ht[X])?$=Ht[X][nt]:$=Ht[X],wt=!0):A.samples>0&&P.useMultisampledRTT(A)===!1?$=At.get(A).__webglMultisampledFramebuffer:Array.isArray(Ht)?$=Ht[nt]:$=Ht,C.copy(A.viewport),I.copy(A.scissor),k=A.scissorTest}else C.copy(mt).multiplyScalar(U).floor(),I.copy(at).multiplyScalar(U).floor(),k=dt;if(kt.bindFramebuffer(V.FRAMEBUFFER,$)&&Q&&kt.drawBuffers(A,$),kt.viewport(C),kt.scissor(I),kt.setScissorTest(k),wt){const Xt=At.get(A.texture);V.framebufferTexture2D(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_CUBE_MAP_POSITIVE_X+X,Xt.__webglTexture,nt)}else if(Pt){const Xt=At.get(A.texture),Ft=X||0;V.framebufferTextureLayer(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,Xt.__webglTexture,nt||0,Ft)}b=-1},this.readRenderTargetPixels=function(A,X,nt,Q,$,wt,Pt){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Yt=At.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Pt!==void 0&&(Yt=Yt[Pt]),Yt){kt.bindFramebuffer(V.FRAMEBUFFER,Yt);try{const Xt=A.texture,Ft=Xt.format,Ht=Xt.type;if(!Vt.textureFormatReadable(Ft)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Vt.textureTypeReadable(Ht)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}X>=0&&X<=A.width-Q&&nt>=0&&nt<=A.height-$&&V.readPixels(X,nt,Q,$,qt.convert(Ft),qt.convert(Ht),wt)}finally{const Xt=T!==null?At.get(T).__webglFramebuffer:null;kt.bindFramebuffer(V.FRAMEBUFFER,Xt)}}},this.readRenderTargetPixelsAsync=async function(A,X,nt,Q,$,wt,Pt){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Yt=At.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Pt!==void 0&&(Yt=Yt[Pt]),Yt){const Xt=A.texture,Ft=Xt.format,Ht=Xt.type;if(!Vt.textureFormatReadable(Ft))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Vt.textureTypeReadable(Ht))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(X>=0&&X<=A.width-Q&&nt>=0&&nt<=A.height-$){kt.bindFramebuffer(V.FRAMEBUFFER,Yt);const Lt=V.createBuffer();V.bindBuffer(V.PIXEL_PACK_BUFFER,Lt),V.bufferData(V.PIXEL_PACK_BUFFER,wt.byteLength,V.STREAM_READ),V.readPixels(X,nt,Q,$,qt.convert(Ft),qt.convert(Ht),0);const oe=T!==null?At.get(T).__webglFramebuffer:null;kt.bindFramebuffer(V.FRAMEBUFFER,oe);const yt=V.fenceSync(V.SYNC_GPU_COMMANDS_COMPLETE,0);return V.flush(),await ax(V,yt,4),V.bindBuffer(V.PIXEL_PACK_BUFFER,Lt),V.getBufferSubData(V.PIXEL_PACK_BUFFER,0,wt),V.deleteBuffer(Lt),V.deleteSync(yt),wt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(A,X=null,nt=0){A.isTexture!==!0&&(da("WebGLRenderer: copyFramebufferToTexture function signature has changed."),X=arguments[0]||null,A=arguments[1]);const Q=Math.pow(2,-nt),$=Math.floor(A.image.width*Q),wt=Math.floor(A.image.height*Q),Pt=X!==null?X.x:0,Yt=X!==null?X.y:0;P.setTexture2D(A,0),V.copyTexSubImage2D(V.TEXTURE_2D,nt,0,0,Pt,Yt,$,wt),kt.unbindTexture()},this.copyTextureToTexture=function(A,X,nt=null,Q=null,$=0){A.isTexture!==!0&&(da("WebGLRenderer: copyTextureToTexture function signature has changed."),Q=arguments[0]||null,A=arguments[1],X=arguments[2],$=arguments[3]||0,nt=null);let wt,Pt,Yt,Xt,Ft,Ht,Lt,oe,yt;const vt=A.isCompressedTexture?A.mipmaps[$]:A.image;nt!==null?(wt=nt.max.x-nt.min.x,Pt=nt.max.y-nt.min.y,Yt=nt.isBox3?nt.max.z-nt.min.z:1,Xt=nt.min.x,Ft=nt.min.y,Ht=nt.isBox3?nt.min.z:0):(wt=vt.width,Pt=vt.height,Yt=vt.depth||1,Xt=0,Ft=0,Ht=0),Q!==null?(Lt=Q.x,oe=Q.y,yt=Q.z):(Lt=0,oe=0,yt=0);const te=qt.convert(X.format),he=qt.convert(X.type);let Nt;X.isData3DTexture?(P.setTexture3D(X,0),Nt=V.TEXTURE_3D):X.isDataArrayTexture||X.isCompressedArrayTexture?(P.setTexture2DArray(X,0),Nt=V.TEXTURE_2D_ARRAY):(P.setTexture2D(X,0),Nt=V.TEXTURE_2D),V.pixelStorei(V.UNPACK_FLIP_Y_WEBGL,X.flipY),V.pixelStorei(V.UNPACK_PREMULTIPLY_ALPHA_WEBGL,X.premultiplyAlpha),V.pixelStorei(V.UNPACK_ALIGNMENT,X.unpackAlignment);const Ke=V.getParameter(V.UNPACK_ROW_LENGTH),de=V.getParameter(V.UNPACK_IMAGE_HEIGHT),Ae=V.getParameter(V.UNPACK_SKIP_PIXELS),Vn=V.getParameter(V.UNPACK_SKIP_ROWS),We=V.getParameter(V.UNPACK_SKIP_IMAGES);V.pixelStorei(V.UNPACK_ROW_LENGTH,vt.width),V.pixelStorei(V.UNPACK_IMAGE_HEIGHT,vt.height),V.pixelStorei(V.UNPACK_SKIP_PIXELS,Xt),V.pixelStorei(V.UNPACK_SKIP_ROWS,Ft),V.pixelStorei(V.UNPACK_SKIP_IMAGES,Ht);const Xn=A.isDataArrayTexture||A.isData3DTexture,we=X.isDataArrayTexture||X.isData3DTexture;if(A.isRenderTargetTexture||A.isDepthTexture){const un=At.get(A),Wn=At.get(X),fn=At.get(un.__renderTarget),$n=At.get(Wn.__renderTarget);kt.bindFramebuffer(V.READ_FRAMEBUFFER,fn.__webglFramebuffer),kt.bindFramebuffer(V.DRAW_FRAMEBUFFER,$n.__webglFramebuffer);for(let Yn=0;Yn<Yt;Yn++)Xn&&V.framebufferTextureLayer(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,At.get(A).__webglTexture,$,Ht+Yn),A.isDepthTexture?(we&&V.framebufferTextureLayer(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,At.get(X).__webglTexture,$,yt+Yn),V.blitFramebuffer(Xt,Ft,wt,Pt,Lt,oe,wt,Pt,V.DEPTH_BUFFER_BIT,V.NEAREST)):we?V.copyTexSubImage3D(Nt,$,Lt,oe,yt+Yn,Xt,Ft,wt,Pt):V.copyTexSubImage2D(Nt,$,Lt,oe,yt+Yn,Xt,Ft,wt,Pt);kt.bindFramebuffer(V.READ_FRAMEBUFFER,null),kt.bindFramebuffer(V.DRAW_FRAMEBUFFER,null)}else we?A.isDataTexture||A.isData3DTexture?V.texSubImage3D(Nt,$,Lt,oe,yt,wt,Pt,Yt,te,he,vt.data):X.isCompressedArrayTexture?V.compressedTexSubImage3D(Nt,$,Lt,oe,yt,wt,Pt,Yt,te,vt.data):V.texSubImage3D(Nt,$,Lt,oe,yt,wt,Pt,Yt,te,he,vt):A.isDataTexture?V.texSubImage2D(V.TEXTURE_2D,$,Lt,oe,wt,Pt,te,he,vt.data):A.isCompressedTexture?V.compressedTexSubImage2D(V.TEXTURE_2D,$,Lt,oe,vt.width,vt.height,te,vt.data):V.texSubImage2D(V.TEXTURE_2D,$,Lt,oe,wt,Pt,te,he,vt);V.pixelStorei(V.UNPACK_ROW_LENGTH,Ke),V.pixelStorei(V.UNPACK_IMAGE_HEIGHT,de),V.pixelStorei(V.UNPACK_SKIP_PIXELS,Ae),V.pixelStorei(V.UNPACK_SKIP_ROWS,Vn),V.pixelStorei(V.UNPACK_SKIP_IMAGES,We),$===0&&X.generateMipmaps&&V.generateMipmap(Nt),kt.unbindTexture()},this.copyTextureToTexture3D=function(A,X,nt=null,Q=null,$=0){return A.isTexture!==!0&&(da("WebGLRenderer: copyTextureToTexture3D function signature has changed."),nt=arguments[0]||null,Q=arguments[1]||null,A=arguments[2],X=arguments[3],$=arguments[4]||0),da('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(A,X,nt,Q,$)},this.initRenderTarget=function(A){At.get(A).__webglFramebuffer===void 0&&P.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?P.setTextureCube(A,0):A.isData3DTexture?P.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?P.setTexture2DArray(A,0):P.setTexture2D(A,0),kt.unbindTexture()},this.resetState=function(){w=0,S=0,T=null,kt.reset(),zt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return mi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=_e._getDrawingBufferColorSpace(t),e.unpackColorSpace=_e._getUnpackColorSpace()}}class xS extends He{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ii,this.environmentIntensity=1,this.environmentRotation=new ii,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class vS{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=hl,this.updateRanges=[],this.version=0,this.uuid=ni()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let s=0,a=this.stride;s<a;s++)this.array[t+s]=e.array[i+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ni()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ni()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const mn=new G;class Go{constructor(t,e,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)mn.fromBufferAttribute(this,e),mn.applyMatrix4(t),this.setXYZ(e,mn.x,mn.y,mn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)mn.fromBufferAttribute(this,e),mn.applyNormalMatrix(t),this.setXYZ(e,mn.x,mn.y,mn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)mn.fromBufferAttribute(this,e),mn.transformDirection(t),this.setXYZ(e,mn.x,mn.y,mn.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=On(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Te(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=Te(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Te(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Te(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Te(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=On(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=On(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=On(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=On(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=Te(e,this.array),i=Te(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Te(e,this.array),i=Te(i,this.array),s=Te(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this}setXYZW(t,e,i,s,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=Te(e,this.array),i=Te(i,this.array),s=Te(s,this.array),a=Te(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this.data.array[t+3]=a,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return new rn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Go(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class ul extends os{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new ee(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let As;const ra=new G,Rs=new G,Cs=new G,Ps=new Wt,ca=new Wt,df=new Fe,ho=new G,la=new G,uo=new G,Nd=new Wt,ec=new Wt,Od=new Wt;class Bd extends He{constructor(t=new ul){if(super(),this.isSprite=!0,this.type="Sprite",As===void 0){As=new qe;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new vS(e,5);As.setIndex([0,1,2,0,2,3]),As.setAttribute("position",new Go(i,3,0,!1)),As.setAttribute("uv",new Go(i,2,3,!1))}this.geometry=As,this.material=t,this.center=new Wt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Rs.setFromMatrixScale(this.matrixWorld),df.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Cs.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Rs.multiplyScalar(-Cs.z);const i=this.material.rotation;let s,a;i!==0&&(a=Math.cos(i),s=Math.sin(i));const o=this.center;fo(ho.set(-.5,-.5,0),Cs,o,Rs,s,a),fo(la.set(.5,-.5,0),Cs,o,Rs,s,a),fo(uo.set(.5,.5,0),Cs,o,Rs,s,a),Nd.set(0,0),ec.set(1,0),Od.set(1,1);let r=t.ray.intersectTriangle(ho,la,uo,!1,ra);if(r===null&&(fo(la.set(-.5,.5,0),Cs,o,Rs,s,a),ec.set(0,1),r=t.ray.intersectTriangle(ho,uo,la,!1,ra),r===null))return;const l=t.ray.origin.distanceTo(ra);l<t.near||l>t.far||e.push({distance:l,point:ra.clone(),uv:Rn.getInterpolation(ra,ho,la,uo,Nd,ec,Od,new Wt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function fo(n,t,e,i,s,a){Ps.subVectors(n,e).addScalar(.5).multiply(i),s!==void 0?(ca.x=a*Ps.x-s*Ps.y,ca.y=s*Ps.x+a*Ps.y):ca.copy(Ps),n.copy(t),n.x+=ca.x,n.y+=ca.y,n.applyMatrix4(df)}class Gl extends os{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new ee(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Vo=new G,Xo=new G,Hd=new Fe,ha=new Nl,po=new Qo,nc=new G,Gd=new G;class _S extends He{constructor(t=new qe,e=new Gl){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let s=1,a=e.count;s<a;s++)Vo.fromBufferAttribute(e,s-1),Xo.fromBufferAttribute(e,s),i[s]=i[s-1],i[s]+=Vo.distanceTo(Xo);t.setAttribute("lineDistance",new Ee(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,s=this.matrixWorld,a=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),po.copy(i.boundingSphere),po.applyMatrix4(s),po.radius+=a,t.ray.intersectsSphere(po)===!1)return;Hd.copy(s).invert(),ha.copy(t.ray).applyMatrix4(Hd);const r=a/((this.scale.x+this.scale.y+this.scale.z)/3),l=r*r,c=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const u=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let y=u,g=m-1;y<g;y+=c){const p=h.getX(y),x=h.getX(y+1),_=mo(this,t,ha,l,p,x);_&&e.push(_)}if(this.isLineLoop){const y=h.getX(m-1),g=h.getX(u),p=mo(this,t,ha,l,y,g);p&&e.push(p)}}else{const u=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let y=u,g=m-1;y<g;y+=c){const p=mo(this,t,ha,l,y,y+1);p&&e.push(p)}if(this.isLineLoop){const y=mo(this,t,ha,l,m-1,u);y&&e.push(y)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,o=s.length;a<o;a++){const r=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=a}}}}}function mo(n,t,e,i,s,a){const o=n.geometry.attributes.position;if(Vo.fromBufferAttribute(o,s),Xo.fromBufferAttribute(o,a),e.distanceSqToSegment(Vo,Xo,nc,Gd)>i)return;nc.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(nc);if(!(l<t.near||l>t.far))return{distance:l,point:Gd.clone().applyMatrix4(n.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:n}}const Vd=new G,Xd=new G;class uf extends _S{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let s=0,a=e.count;s<a;s+=2)Vd.fromBufferAttribute(e,s),Xd.fromBufferAttribute(e,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+Vd.distanceTo(Xd);t.setAttribute("lineDistance",new Ee(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class fl extends _n{constructor(t,e,i,s,a,o,r,l,c){super(t,e,i,s,a,o,r,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class si{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,s=this.getPoint(0),a=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),a+=i.distanceTo(s),e.push(a),s=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let s=0;const a=i.length;let o;e?o=e:o=t*i[a-1];let r=0,l=a-1,c;for(;r<=l;)if(s=Math.floor(r+(l-r)/2),c=i[s]-o,c<0)r=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,i[s]===o)return s/(a-1);const h=i[s],d=i[s+1]-h,u=(o-h)/d;return(s+u)/(a-1)}getTangent(t,e){let s=t-1e-4,a=t+1e-4;s<0&&(s=0),a>1&&(a=1);const o=this.getPoint(s),r=this.getPoint(a),l=e||(o.isVector2?new Wt:new G);return l.copy(r).sub(o).normalize(),l}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new G,s=[],a=[],o=[],r=new G,l=new Fe;for(let u=0;u<=t;u++){const m=u/t;s[u]=this.getTangentAt(m,new G)}a[0]=new G,o[0]=new G;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),f=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,i.set(1,0,0)),f<=c&&(c=f,i.set(0,1,0)),d<=c&&i.set(0,0,1),r.crossVectors(s[0],i).normalize(),a[0].crossVectors(s[0],r),o[0].crossVectors(s[0],a[0]);for(let u=1;u<=t;u++){if(a[u]=a[u-1].clone(),o[u]=o[u-1].clone(),r.crossVectors(s[u-1],s[u]),r.length()>Number.EPSILON){r.normalize();const m=Math.acos(on(s[u-1].dot(s[u]),-1,1));a[u].applyMatrix4(l.makeRotationAxis(r,m))}o[u].crossVectors(s[u],a[u])}if(e===!0){let u=Math.acos(on(a[0].dot(a[t]),-1,1));u/=t,s[0].dot(r.crossVectors(a[0],a[t]))>0&&(u=-u);for(let m=1;m<=t;m++)a[m].applyMatrix4(l.makeRotationAxis(s[m],u*m)),o[m].crossVectors(s[m],a[m])}return{tangents:s,normals:a,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Vl extends si{constructor(t=0,e=0,i=1,s=1,a=0,o=Math.PI*2,r=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=s,this.aStartAngle=a,this.aEndAngle=o,this.aClockwise=r,this.aRotation=l}getPoint(t,e=new Wt){const i=e,s=Math.PI*2;let a=this.aEndAngle-this.aStartAngle;const o=Math.abs(a)<Number.EPSILON;for(;a<0;)a+=s;for(;a>s;)a-=s;a<Number.EPSILON&&(o?a=0:a=s),this.aClockwise===!0&&!o&&(a===s?a=-s:a=a-s);const r=this.aStartAngle+t*a;let l=this.aX+this.xRadius*Math.cos(r),c=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),d=l-this.aX,u=c-this.aY;l=d*h-u*f+this.aX,c=d*f+u*h+this.aY}return i.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class yS extends Vl{constructor(t,e,i,s,a,o){super(t,e,i,i,s,a,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Xl(){let n=0,t=0,e=0,i=0;function s(a,o,r,l){n=a,t=r,e=-3*a+3*o-2*r-l,i=2*a-2*o+r+l}return{initCatmullRom:function(a,o,r,l,c){s(o,r,c*(r-a),c*(l-o))},initNonuniformCatmullRom:function(a,o,r,l,c,h,f){let d=(o-a)/c-(r-a)/(c+h)+(r-o)/h,u=(r-o)/h-(l-o)/(h+f)+(l-r)/f;d*=h,u*=h,s(o,r,d,u)},calc:function(a){const o=a*a,r=o*a;return n+t*a+e*o+i*r}}}const go=new G,ic=new Xl,sc=new Xl,ac=new Xl;class MS extends si{constructor(t=[],e=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=s}getPoint(t,e=new G){const i=e,s=this.points,a=s.length,o=(a-(this.closed?0:1))*t;let r=Math.floor(o),l=o-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/a)+1)*a:l===0&&r===a-1&&(r=a-2,l=1);let c,h;this.closed||r>0?c=s[(r-1)%a]:(go.subVectors(s[0],s[1]).add(s[0]),c=go);const f=s[r%a],d=s[(r+1)%a];if(this.closed||r+2<a?h=s[(r+2)%a]:(go.subVectors(s[a-1],s[a-2]).add(s[a-1]),h=go),this.curveType==="centripetal"||this.curveType==="chordal"){const u=this.curveType==="chordal"?.5:.25;let m=Math.pow(c.distanceToSquared(f),u),y=Math.pow(f.distanceToSquared(d),u),g=Math.pow(d.distanceToSquared(h),u);y<1e-4&&(y=1),m<1e-4&&(m=y),g<1e-4&&(g=y),ic.initNonuniformCatmullRom(c.x,f.x,d.x,h.x,m,y,g),sc.initNonuniformCatmullRom(c.y,f.y,d.y,h.y,m,y,g),ac.initNonuniformCatmullRom(c.z,f.z,d.z,h.z,m,y,g)}else this.curveType==="catmullrom"&&(ic.initCatmullRom(c.x,f.x,d.x,h.x,this.tension),sc.initCatmullRom(c.y,f.y,d.y,h.y,this.tension),ac.initCatmullRom(c.z,f.z,d.z,h.z,this.tension));return i.set(ic.calc(l),sc.calc(l),ac.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new G().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Wd(n,t,e,i,s){const a=(i-t)*.5,o=(s-e)*.5,r=n*n,l=n*r;return(2*e-2*i+a+o)*l+(-3*e+3*i-2*a-o)*r+a*n+e}function SS(n,t){const e=1-n;return e*e*t}function bS(n,t){return 2*(1-n)*n*t}function wS(n,t){return n*n*t}function ma(n,t,e,i){return SS(n,t)+bS(n,e)+wS(n,i)}function ES(n,t){const e=1-n;return e*e*e*t}function TS(n,t){const e=1-n;return 3*e*e*n*t}function AS(n,t){return 3*(1-n)*n*n*t}function RS(n,t){return n*n*n*t}function ga(n,t,e,i,s){return ES(n,t)+TS(n,e)+AS(n,i)+RS(n,s)}class ff extends si{constructor(t=new Wt,e=new Wt,i=new Wt,s=new Wt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new Wt){const i=e,s=this.v0,a=this.v1,o=this.v2,r=this.v3;return i.set(ga(t,s.x,a.x,o.x,r.x),ga(t,s.y,a.y,o.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class CS extends si{constructor(t=new G,e=new G,i=new G,s=new G){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new G){const i=e,s=this.v0,a=this.v1,o=this.v2,r=this.v3;return i.set(ga(t,s.x,a.x,o.x,r.x),ga(t,s.y,a.y,o.y,r.y),ga(t,s.z,a.z,o.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class pf extends si{constructor(t=new Wt,e=new Wt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Wt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Wt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class PS extends si{constructor(t=new G,e=new G){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new G){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new G){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class mf extends si{constructor(t=new Wt,e=new Wt,i=new Wt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Wt){const i=e,s=this.v0,a=this.v1,o=this.v2;return i.set(ma(t,s.x,a.x,o.x),ma(t,s.y,a.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class LS extends si{constructor(t=new G,e=new G,i=new G){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new G){const i=e,s=this.v0,a=this.v1,o=this.v2;return i.set(ma(t,s.x,a.x,o.x),ma(t,s.y,a.y,o.y),ma(t,s.z,a.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class gf extends si{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Wt){const i=e,s=this.points,a=(s.length-1)*t,o=Math.floor(a),r=a-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],f=s[o>s.length-3?s.length-1:o+2];return i.set(Wd(r,l.x,c.x,h.x,f.x),Wd(r,l.y,c.y,h.y,f.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new Wt().fromArray(s))}return this}}var $d=Object.freeze({__proto__:null,ArcCurve:yS,CatmullRomCurve3:MS,CubicBezierCurve:ff,CubicBezierCurve3:CS,EllipseCurve:Vl,LineCurve:pf,LineCurve3:PS,QuadraticBezierCurve:mf,QuadraticBezierCurve3:LS,SplineCurve:gf});class DS extends si{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new $d[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),s=this.getCurveLengths();let a=0;for(;a<s.length;){if(s[a]>=i){const o=s[a]-i,r=this.curves[a],l=r.getLength(),c=l===0?0:1-o/l;return r.getPointAt(c,e)}a++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,s=this.curves.length;i<s;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let s=0,a=this.curves;s<a.length;s++){const o=a[s],r=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(r);for(let c=0;c<l.length;c++){const h=l[c];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(new $d[s.type]().fromJSON(s))}return this}}class Yd extends DS{constructor(t){super(),this.type="Path",this.currentPoint=new Wt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new pf(this.currentPoint.clone(),new Wt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,s){const a=new mf(this.currentPoint.clone(),new Wt(t,e),new Wt(i,s));return this.curves.push(a),this.currentPoint.set(i,s),this}bezierCurveTo(t,e,i,s,a,o){const r=new ff(this.currentPoint.clone(),new Wt(t,e),new Wt(i,s),new Wt(a,o));return this.curves.push(r),this.currentPoint.set(a,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new gf(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,s,a,o){const r=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+r,e+l,i,s,a,o),this}absarc(t,e,i,s,a,o){return this.absellipse(t,e,i,i,s,a,o),this}ellipse(t,e,i,s,a,o,r,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,i,s,a,o,r,l),this}absellipse(t,e,i,s,a,o,r,l){const c=new Vl(t,e,i,s,a,o,r,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Wl extends qe{constructor(t=1,e=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:s},e=Math.max(3,e);const a=[],o=[],r=[],l=[],c=new G,h=new Wt;o.push(0,0,0),r.push(0,0,1),l.push(.5,.5);for(let f=0,d=3;f<=e;f++,d+=3){const u=i+f/e*s;c.x=t*Math.cos(u),c.y=t*Math.sin(u),o.push(c.x,c.y,c.z),r.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let f=1;f<=e;f++)a.push(f,f+1,0);this.setIndex(a),this.setAttribute("position",new Ee(o,3)),this.setAttribute("normal",new Ee(r,3)),this.setAttribute("uv",new Ee(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Wl(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class wa extends qe{constructor(t=1,e=1,i=1,s=32,a=1,o=!1,r=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:a,openEnded:o,thetaStart:r,thetaLength:l};const c=this;s=Math.floor(s),a=Math.floor(a);const h=[],f=[],d=[],u=[];let m=0;const y=[],g=i/2;let p=0;x(),o===!1&&(t>0&&_(!0),e>0&&_(!1)),this.setIndex(h),this.setAttribute("position",new Ee(f,3)),this.setAttribute("normal",new Ee(d,3)),this.setAttribute("uv",new Ee(u,2));function x(){const v=new G,R=new G;let w=0;const S=(e-t)/i;for(let T=0;T<=a;T++){const b=[],M=T/a,C=M*(e-t)+t;for(let I=0;I<=s;I++){const k=I/s,N=k*l+r,L=Math.sin(N),D=Math.cos(N);R.x=C*L,R.y=-M*i+g,R.z=C*D,f.push(R.x,R.y,R.z),v.set(L,S,D).normalize(),d.push(v.x,v.y,v.z),u.push(k,1-M),b.push(m++)}y.push(b)}for(let T=0;T<s;T++)for(let b=0;b<a;b++){const M=y[b][T],C=y[b+1][T],I=y[b+1][T+1],k=y[b][T+1];(t>0||b!==0)&&(h.push(M,C,k),w+=3),(e>0||b!==a-1)&&(h.push(C,I,k),w+=3)}c.addGroup(p,w,0),p+=w}function _(v){const R=m,w=new Wt,S=new G;let T=0;const b=v===!0?t:e,M=v===!0?1:-1;for(let I=1;I<=s;I++)f.push(0,g*M,0),d.push(0,M,0),u.push(.5,.5),m++;const C=m;for(let I=0;I<=s;I++){const N=I/s*l+r,L=Math.cos(N),D=Math.sin(N);S.x=b*D,S.y=g*M,S.z=b*L,f.push(S.x,S.y,S.z),d.push(0,M,0),w.x=L*.5+.5,w.y=D*.5*M+.5,u.push(w.x,w.y),m++}for(let I=0;I<s;I++){const k=R+I,N=C+I;v===!0?h.push(N,N+1,k):h.push(N+1,N,k),T+=3}c.addGroup(p,T,v===!0?1:2),p+=T}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new wa(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class $l extends wa{constructor(t=1,e=1,i=32,s=1,a=!1,o=0,r=Math.PI*2){super(0,t,e,i,s,a,o,r),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:r}}static fromJSON(t){return new $l(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Yl extends qe{constructor(t=[],e=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:s};const a=[],o=[];r(s),c(i),h(),this.setAttribute("position",new Ee(a,3)),this.setAttribute("normal",new Ee(a.slice(),3)),this.setAttribute("uv",new Ee(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function r(x){const _=new G,v=new G,R=new G;for(let w=0;w<e.length;w+=3)u(e[w+0],_),u(e[w+1],v),u(e[w+2],R),l(_,v,R,x)}function l(x,_,v,R){const w=R+1,S=[];for(let T=0;T<=w;T++){S[T]=[];const b=x.clone().lerp(v,T/w),M=_.clone().lerp(v,T/w),C=w-T;for(let I=0;I<=C;I++)I===0&&T===w?S[T][I]=b:S[T][I]=b.clone().lerp(M,I/C)}for(let T=0;T<w;T++)for(let b=0;b<2*(w-T)-1;b++){const M=Math.floor(b/2);b%2===0?(d(S[T][M+1]),d(S[T+1][M]),d(S[T][M])):(d(S[T][M+1]),d(S[T+1][M+1]),d(S[T+1][M]))}}function c(x){const _=new G;for(let v=0;v<a.length;v+=3)_.x=a[v+0],_.y=a[v+1],_.z=a[v+2],_.normalize().multiplyScalar(x),a[v+0]=_.x,a[v+1]=_.y,a[v+2]=_.z}function h(){const x=new G;for(let _=0;_<a.length;_+=3){x.x=a[_+0],x.y=a[_+1],x.z=a[_+2];const v=g(x)/2/Math.PI+.5,R=p(x)/Math.PI+.5;o.push(v,1-R)}m(),f()}function f(){for(let x=0;x<o.length;x+=6){const _=o[x+0],v=o[x+2],R=o[x+4],w=Math.max(_,v,R),S=Math.min(_,v,R);w>.9&&S<.1&&(_<.2&&(o[x+0]+=1),v<.2&&(o[x+2]+=1),R<.2&&(o[x+4]+=1))}}function d(x){a.push(x.x,x.y,x.z)}function u(x,_){const v=x*3;_.x=t[v+0],_.y=t[v+1],_.z=t[v+2]}function m(){const x=new G,_=new G,v=new G,R=new G,w=new Wt,S=new Wt,T=new Wt;for(let b=0,M=0;b<a.length;b+=9,M+=6){x.set(a[b+0],a[b+1],a[b+2]),_.set(a[b+3],a[b+4],a[b+5]),v.set(a[b+6],a[b+7],a[b+8]),w.set(o[M+0],o[M+1]),S.set(o[M+2],o[M+3]),T.set(o[M+4],o[M+5]),R.copy(x).add(_).add(v).divideScalar(3);const C=g(R);y(w,M+0,x,C),y(S,M+2,_,C),y(T,M+4,v,C)}}function y(x,_,v,R){R<0&&x.x===1&&(o[_]=x.x-1),v.x===0&&v.z===0&&(o[_]=R/2/Math.PI+.5)}function g(x){return Math.atan2(x.z,-x.x)}function p(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Yl(t.vertices,t.indices,t.radius,t.details)}}const xo=new G,vo=new G,oc=new G,_o=new Rn;class kS extends qe{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const s=Math.pow(10,4),a=Math.cos(Ns*e),o=t.getIndex(),r=t.getAttribute("position"),l=o?o.count:r.count,c=[0,0,0],h=["a","b","c"],f=new Array(3),d={},u=[];for(let m=0;m<l;m+=3){o?(c[0]=o.getX(m),c[1]=o.getX(m+1),c[2]=o.getX(m+2)):(c[0]=m,c[1]=m+1,c[2]=m+2);const{a:y,b:g,c:p}=_o;if(y.fromBufferAttribute(r,c[0]),g.fromBufferAttribute(r,c[1]),p.fromBufferAttribute(r,c[2]),_o.getNormal(oc),f[0]=`${Math.round(y.x*s)},${Math.round(y.y*s)},${Math.round(y.z*s)}`,f[1]=`${Math.round(g.x*s)},${Math.round(g.y*s)},${Math.round(g.z*s)}`,f[2]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let x=0;x<3;x++){const _=(x+1)%3,v=f[x],R=f[_],w=_o[h[x]],S=_o[h[_]],T=`${v}_${R}`,b=`${R}_${v}`;b in d&&d[b]?(oc.dot(d[b].normal)<=a&&(u.push(w.x,w.y,w.z),u.push(S.x,S.y,S.z)),d[b]=null):T in d||(d[T]={index0:c[x],index1:c[_],normal:oc.clone()})}}for(const m in d)if(d[m]){const{index0:y,index1:g}=d[m];xo.fromBufferAttribute(r,y),vo.fromBufferAttribute(r,g),u.push(xo.x,xo.y,xo.z),u.push(vo.x,vo.y,vo.z)}this.setAttribute("position",new Ee(u,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class xf extends Yd{constructor(t){super(t),this.uuid=ni(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,s=this.holes.length;i<s;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(new Yd().fromJSON(s))}return this}}const IS={triangulate:function(n,t,e=2){const i=t&&t.length,s=i?t[0]*e:n.length;let a=vf(n,0,s,e,!0);const o=[];if(!a||a.next===a.prev)return o;let r,l,c,h,f,d,u;if(i&&(a=OS(n,t,a,e)),n.length>80*e){r=c=n[0],l=h=n[1];for(let m=e;m<s;m+=e)f=n[m],d=n[m+1],f<r&&(r=f),d<l&&(l=d),f>c&&(c=f),d>h&&(h=d);u=Math.max(c-r,h-l),u=u!==0?32767/u:0}return Ea(a,o,e,r,l,u,0),o}};function vf(n,t,e,i,s){let a,o;if(s===jS(n,t,e,i)>0)for(a=t;a<e;a+=i)o=Zd(a,n[a],n[a+1],o);else for(a=e-i;a>=t;a-=i)o=Zd(a,n[a],n[a+1],o);return o&&er(o,o.next)&&(Aa(o),o=o.next),o}function as(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(er(e,e.next)||Be(e.prev,e,e.next)===0)){if(Aa(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function Ea(n,t,e,i,s,a,o){if(!n)return;!o&&a&&XS(n,i,s,a);let r=n,l,c;for(;n.prev!==n.next;){if(l=n.prev,c=n.next,a?US(n,i,s,a):FS(n)){t.push(l.i/e|0),t.push(n.i/e|0),t.push(c.i/e|0),Aa(n),n=c.next,r=c.next;continue}if(n=c,n===r){o?o===1?(n=zS(as(n),t,e),Ea(n,t,e,i,s,a,2)):o===2&&NS(n,t,e,i,s,a):Ea(as(n),t,e,i,s,a,1);break}}}function FS(n){const t=n.prev,e=n,i=n.next;if(Be(t,e,i)>=0)return!1;const s=t.x,a=e.x,o=i.x,r=t.y,l=e.y,c=i.y,h=s<a?s<o?s:o:a<o?a:o,f=r<l?r<c?r:c:l<c?l:c,d=s>a?s>o?s:o:a>o?a:o,u=r>l?r>c?r:c:l>c?l:c;let m=i.next;for(;m!==t;){if(m.x>=h&&m.x<=d&&m.y>=f&&m.y<=u&&Is(s,r,a,l,o,c,m.x,m.y)&&Be(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function US(n,t,e,i){const s=n.prev,a=n,o=n.next;if(Be(s,a,o)>=0)return!1;const r=s.x,l=a.x,c=o.x,h=s.y,f=a.y,d=o.y,u=r<l?r<c?r:c:l<c?l:c,m=h<f?h<d?h:d:f<d?f:d,y=r>l?r>c?r:c:l>c?l:c,g=h>f?h>d?h:d:f>d?f:d,p=pl(u,m,t,e,i),x=pl(y,g,t,e,i);let _=n.prevZ,v=n.nextZ;for(;_&&_.z>=p&&v&&v.z<=x;){if(_.x>=u&&_.x<=y&&_.y>=m&&_.y<=g&&_!==s&&_!==o&&Is(r,h,l,f,c,d,_.x,_.y)&&Be(_.prev,_,_.next)>=0||(_=_.prevZ,v.x>=u&&v.x<=y&&v.y>=m&&v.y<=g&&v!==s&&v!==o&&Is(r,h,l,f,c,d,v.x,v.y)&&Be(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;_&&_.z>=p;){if(_.x>=u&&_.x<=y&&_.y>=m&&_.y<=g&&_!==s&&_!==o&&Is(r,h,l,f,c,d,_.x,_.y)&&Be(_.prev,_,_.next)>=0)return!1;_=_.prevZ}for(;v&&v.z<=x;){if(v.x>=u&&v.x<=y&&v.y>=m&&v.y<=g&&v!==s&&v!==o&&Is(r,h,l,f,c,d,v.x,v.y)&&Be(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function zS(n,t,e){let i=n;do{const s=i.prev,a=i.next.next;!er(s,a)&&_f(s,i,i.next,a)&&Ta(s,a)&&Ta(a,s)&&(t.push(s.i/e|0),t.push(i.i/e|0),t.push(a.i/e|0),Aa(i),Aa(i.next),i=n=a),i=i.next}while(i!==n);return as(i)}function NS(n,t,e,i,s,a){let o=n;do{let r=o.next.next;for(;r!==o.prev;){if(o.i!==r.i&&YS(o,r)){let l=yf(o,r);o=as(o,o.next),l=as(l,l.next),Ea(o,t,e,i,s,a,0),Ea(l,t,e,i,s,a,0);return}r=r.next}o=o.next}while(o!==n)}function OS(n,t,e,i){const s=[];let a,o,r,l,c;for(a=0,o=t.length;a<o;a++)r=t[a]*i,l=a<o-1?t[a+1]*i:n.length,c=vf(n,r,l,i,!1),c===c.next&&(c.steiner=!0),s.push($S(c));for(s.sort(BS),a=0;a<s.length;a++)e=HS(s[a],e);return e}function BS(n,t){return n.x-t.x}function HS(n,t){const e=GS(n,t);if(!e)return t;const i=yf(e,n);return as(i,i.next),as(e,e.next)}function GS(n,t){let e=t,i=-1/0,s;const a=n.x,o=n.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=a&&d>i&&(i=d,s=e.x<e.next.x?e:e.next,d===a))return s}e=e.next}while(e!==t);if(!s)return null;const r=s,l=s.x,c=s.y;let h=1/0,f;e=s;do a>=e.x&&e.x>=l&&a!==e.x&&Is(o<c?a:i,o,l,c,o<c?i:a,o,e.x,e.y)&&(f=Math.abs(o-e.y)/(a-e.x),Ta(e,n)&&(f<h||f===h&&(e.x>s.x||e.x===s.x&&VS(s,e)))&&(s=e,h=f)),e=e.next;while(e!==r);return s}function VS(n,t){return Be(n.prev,n,t.prev)<0&&Be(t.next,n,n.next)<0}function XS(n,t,e,i){let s=n;do s.z===0&&(s.z=pl(s.x,s.y,t,e,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,WS(s)}function WS(n){let t,e,i,s,a,o,r,l,c=1;do{for(e=n,n=null,a=null,o=0;e;){for(o++,i=e,r=0,t=0;t<c&&(r++,i=i.nextZ,!!i);t++);for(l=c;r>0||l>0&&i;)r!==0&&(l===0||!i||e.z<=i.z)?(s=e,e=e.nextZ,r--):(s=i,i=i.nextZ,l--),a?a.nextZ=s:n=s,s.prevZ=a,a=s;e=i}a.nextZ=null,c*=2}while(o>1);return n}function pl(n,t,e,i,s){return n=(n-e)*s|0,t=(t-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function $S(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function Is(n,t,e,i,s,a,o,r){return(s-o)*(t-r)>=(n-o)*(a-r)&&(n-o)*(i-r)>=(e-o)*(t-r)&&(e-o)*(a-r)>=(s-o)*(i-r)}function YS(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!ZS(n,t)&&(Ta(n,t)&&Ta(t,n)&&qS(n,t)&&(Be(n.prev,n,t.prev)||Be(n,t.prev,t))||er(n,t)&&Be(n.prev,n,n.next)>0&&Be(t.prev,t,t.next)>0)}function Be(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function er(n,t){return n.x===t.x&&n.y===t.y}function _f(n,t,e,i){const s=Mo(Be(n,t,e)),a=Mo(Be(n,t,i)),o=Mo(Be(e,i,n)),r=Mo(Be(e,i,t));return!!(s!==a&&o!==r||s===0&&yo(n,e,t)||a===0&&yo(n,i,t)||o===0&&yo(e,n,i)||r===0&&yo(e,t,i))}function yo(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function Mo(n){return n>0?1:n<0?-1:0}function ZS(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&_f(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function Ta(n,t){return Be(n.prev,n,n.next)<0?Be(n,t,n.next)>=0&&Be(n,n.prev,t)>=0:Be(n,t,n.prev)<0||Be(n,n.next,t)<0}function qS(n,t){let e=n,i=!1;const s=(n.x+t.x)/2,a=(n.y+t.y)/2;do e.y>a!=e.next.y>a&&e.next.y!==e.y&&s<(e.next.x-e.x)*(a-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function yf(n,t){const e=new ml(n.i,n.x,n.y),i=new ml(t.i,t.x,t.y),s=n.next,a=t.prev;return n.next=t,t.prev=n,e.next=s,s.prev=e,i.next=e,e.prev=i,a.next=i,i.prev=a,i}function Zd(n,t,e,i){const s=new ml(n,t,e);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function Aa(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function ml(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function jS(n,t,e,i){let s=0;for(let a=t,o=e-i;a<e;a+=i)s+=(n[o]-n[a])*(n[a+1]+n[o+1]),o=a;return s}class xa{static area(t){const e=t.length;let i=0;for(let s=e-1,a=0;a<e;s=a++)i+=t[s].x*t[a].y-t[a].x*t[s].y;return i*.5}static isClockWise(t){return xa.area(t)<0}static triangulateShape(t,e){const i=[],s=[],a=[];qd(t),jd(i,t);let o=t.length;e.forEach(qd);for(let l=0;l<e.length;l++)s.push(o),o+=e[l].length,jd(i,e[l]);const r=IS.triangulate(i,s);for(let l=0;l<r.length;l+=3)a.push(r.slice(l,l+3));return a}}function qd(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function jd(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class Zl extends Yl{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Zl(t.radius,t.detail)}}class Ra extends qe{constructor(t=.5,e=1,i=32,s=1,a=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:s,thetaStart:a,thetaLength:o},i=Math.max(3,i),s=Math.max(1,s);const r=[],l=[],c=[],h=[];let f=t;const d=(e-t)/s,u=new G,m=new Wt;for(let y=0;y<=s;y++){for(let g=0;g<=i;g++){const p=a+g/i*o;u.x=f*Math.cos(p),u.y=f*Math.sin(p),l.push(u.x,u.y,u.z),c.push(0,0,1),m.x=(u.x/e+1)/2,m.y=(u.y/e+1)/2,h.push(m.x,m.y)}f+=d}for(let y=0;y<s;y++){const g=y*(i+1);for(let p=0;p<i;p++){const x=p+g,_=x,v=x+i+1,R=x+i+2,w=x+1;r.push(_,v,w),r.push(v,R,w)}}this.setIndex(r),this.setAttribute("position",new Ee(l,3)),this.setAttribute("normal",new Ee(c,3)),this.setAttribute("uv",new Ee(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ra(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class ql extends qe{constructor(t=new xf([new Wt(0,.5),new Wt(-.5,-.5),new Wt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],s=[],a=[],o=[];let r=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(r,l,h),r+=l,l=0;this.setIndex(i),this.setAttribute("position",new Ee(s,3)),this.setAttribute("normal",new Ee(a,3)),this.setAttribute("uv",new Ee(o,2));function c(h){const f=s.length/3,d=h.extractPoints(e);let u=d.shape;const m=d.holes;xa.isClockWise(u)===!1&&(u=u.reverse());for(let g=0,p=m.length;g<p;g++){const x=m[g];xa.isClockWise(x)===!0&&(m[g]=x.reverse())}const y=xa.triangulateShape(u,m);for(let g=0,p=m.length;g<p;g++){const x=m[g];u=u.concat(x)}for(let g=0,p=u.length;g<p;g++){const x=u[g];s.push(x.x,x.y,0),a.push(0,0,1),o.push(x.x,x.y)}for(let g=0,p=y.length;g<p;g++){const x=y[g],_=x[0]+f,v=x[1]+f,R=x[2]+f;i.push(_,v,R),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return KS(e,t)}static fromJSON(t,e){const i=[];for(let s=0,a=t.shapes.length;s<a;s++){const o=e[t.shapes[s]];i.push(o)}return new ql(i,t.curveSegments)}}function KS(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const s=n[e];t.shapes.push(s.uuid)}else t.shapes.push(n.uuid);return t}class nr extends qe{constructor(t=1,e=.4,i=12,s=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:a},i=Math.floor(i),s=Math.floor(s);const o=[],r=[],l=[],c=[],h=new G,f=new G,d=new G;for(let u=0;u<=i;u++)for(let m=0;m<=s;m++){const y=m/s*a,g=u/i*Math.PI*2;f.x=(t+e*Math.cos(g))*Math.cos(y),f.y=(t+e*Math.cos(g))*Math.sin(y),f.z=e*Math.sin(g),r.push(f.x,f.y,f.z),h.x=t*Math.cos(y),h.y=t*Math.sin(y),d.subVectors(f,h).normalize(),l.push(d.x,d.y,d.z),c.push(m/s),c.push(u/i)}for(let u=1;u<=i;u++)for(let m=1;m<=s;m++){const y=(s+1)*u+m-1,g=(s+1)*(u-1)+m-1,p=(s+1)*(u-1)+m,x=(s+1)*u+m;o.push(y,g,x),o.push(g,p,x)}this.setIndex(o),this.setAttribute("position",new Ee(r,3)),this.setAttribute("normal",new Ee(l,3)),this.setAttribute("uv",new Ee(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new nr(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Ca extends os{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new ee(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ee(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=$u,this.normalScale=new Wt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ii,this.combine=Pl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Mf extends He{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ee(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class JS extends Mf{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(He.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ee(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const rc=new Fe,Kd=new G,Jd=new G;class QS{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Wt(512,512),this.map=null,this.mapPass=null,this.matrix=new Fe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Bl,this._frameExtents=new Wt(1,1),this._viewportCount=1,this._viewports=[new Ge(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;Kd.setFromMatrixPosition(t.matrixWorld),e.position.copy(Kd),Jd.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Jd),e.updateMatrixWorld(),rc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(rc),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(rc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class tb extends QS{constructor(){super(new af(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class eb extends Mf{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(He.DEFAULT_UP),this.updateMatrix(),this.target=new He,this.shadow=new tb}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const Qd=new Fe;class nb{constructor(t,e,i=0,s=1/0){this.ray=new Nl(t,e),this.near=i,this.far=s,this.camera=null,this.layers=new Ol,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Qd.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Qd),this}intersectObject(t,e=!0,i=[]){return gl(t,this,i,e),i.sort(tu),i}intersectObjects(t,e=!0,i=[]){for(let s=0,a=t.length;s<a;s++)gl(t[s],this,i,e);return i.sort(tu),i}}function tu(n,t){return n.distance-t.distance}function gl(n,t,e,i){let s=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(s=!1),s===!0&&i===!0){const a=n.children;for(let o=0,r=a.length;o<r;o++)gl(a[o],t,e,!0)}}class ib extends uf{constructor(t=10,e=10,i=4473924,s=8947848){i=new ee(i),s=new ee(s);const a=e/2,o=t/e,r=t/2,l=[],c=[];for(let d=0,u=0,m=-r;d<=e;d++,m+=o){l.push(-r,0,m,r,0,m),l.push(m,0,-r,m,0,r);const y=d===a?i:s;y.toArray(c,u),u+=3,y.toArray(c,u),u+=3,y.toArray(c,u),u+=3,y.toArray(c,u),u+=3}const h=new qe;h.setAttribute("position",new Ee(l,3)),h.setAttribute("color",new Ee(c,3));const f=new Gl({vertexColors:!0,toneMapped:!1});super(h,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Cl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Cl);const sb={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function ab(n,t,e,i){const s=new Ln(n.fov,i,.1,200),a=new G,o=new G,r=new G;let l=!1,c=n.fov;const h={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let f=1;function d(){const u=(n.pitchDeg+h.pitchDelta)*Math.PI/180,m=n.yawDeg*Math.PI/180;r.set(Math.sin(m)*Math.cos(u),Math.sin(u),Math.cos(m)*Math.cos(u)).multiplyScalar(n.distance*h.distanceScale*h.zoom)}return d(),{camera:s,update(u,m,y,g,p=sb){const x=m+.6;if(!l)a.set(u,x,y),l=!0;else{const R=1-Math.exp(-Math.max(n.smoothing,.001)*g);a.x+=(u-a.x)*R,a.y+=(x-a.y)*R,a.z+=(y-a.z)*R}const _=1-Math.exp(-Math.max(t.smoothing,.001)*g);h.distanceScale+=(p.distanceScale-h.distanceScale)*_,h.offsetX+=(p.offsetX-h.offsetX)*_,h.offsetZ+=(p.offsetZ-h.offsetZ)*_,h.pitchDelta+=(p.pitchDelta-h.pitchDelta)*_;const v=1-Math.exp(-Math.max(e.smoothing,.001)*g);h.zoom+=(f-h.zoom)*v,d(),(s.fov!==c||s.fov!==n.fov)&&(s.fov=n.fov,c=n.fov,s.updateProjectionMatrix()),o.set(a.x+h.offsetX,a.y,a.z+h.offsetZ),s.position.copy(o).add(r),s.lookAt(o),s.updateMatrixWorld()},snap(u,m,y){a.set(u,m+.6,y),l=!0,o.set(a.x+h.offsetX,a.y,a.z+h.offsetZ),d(),s.position.copy(o).add(r),s.lookAt(o),s.updateMatrixWorld()},resize(u){s.aspect=u,s.updateProjectionMatrix()},getGroundBasis(){const u=new G().setFromMatrixColumn(s.matrixWorld,0),m=new G().setFromMatrixColumn(s.matrixWorld,2).negate(),y=Math.hypot(u.x,u.z)||1,g=Math.hypot(m.x,m.z)||1;return{rightX:u.x/y,rightZ:u.z/y,forwardX:m.x/g,forwardZ:m.z/g}},setZoom(u){f=Number.isFinite(u)&&u>0?u:1},smart(){return{...h}}}}const es=Math.PI*2,Dn=1e-6;function Sn(n,t,e){return n<t?t:n>e?e:n}function Sf(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function ob(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function bf(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const s=ob(n);return i===1?s:e+(s-e)*i}function eu(n){return(1-Math.sin(n))/2}function jl(n,t,e){const i=Math.PI/180,s=Sn(Number.isFinite(t)?t:100,0,180),a=Sn(Number.isFinite(e)?e:132,0,180);if(a<=s)return n>=Math.cos(s*i)?1:0;const o=Math.cos(s*i),r=Math.cos(a*i);if(n>=o)return 1;const l=Sn((o-n)/(o-r),0,1);return 1-l*l*(3-2*l)}function Kl(n,t){if(!n.grounded||n.speed<Dn)return Sf();const e=n.speed/Math.max(n.moveSpeed,Dn),i=Math.max(n.legLength,Dn),s=n.stride>Dn?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,a=Math.min(t.maxAmp,s/i),o=i*Math.sin(Math.min(t.maxAmp,1.25)),r=Math.abs(n.localForward),l=Math.abs(n.localRight),c=r+l+Dn,h=jl(n.localForward/Math.max(n.speed,Dn),t.backStrafeStartDeg,t.backStrafeFullDeg),f=l/c*h,d=r/c+l/c*(1-h),u=n.localForward>=0?1:-1,m=n.localRight>=0?1:-1,y=s,g=N=>Math.asin(Sn(N,-o,o)/i);function p(N,L){const D=bf(N,t.plantLock),B=eu(N),U=u*d*y*D,z=-g(U),W=L*m>0?1:-1,mt=1+W*t.crossStep*.45,at=m*W*t.crossStep*y*.4*B,dt=m*f*y*t.sideWeight*mt*D+at*f,tt=g(dt),Z=t.kneeLift*B*a*(.55+.25*d+(W>0?.2*f:0));return{pitchX:z,rollZ:tt,kneeX:Z}}const x=(n.phase%es+es)%es,_=p(x,-1),v=p((x+Math.PI)%es,1),R=Math.cos(x),w=eu(x),S=-t.comSway*a*R*(.6*d+.8*f)-m*t.comSway*a*f*.45,T=t.comBob*w*a,b=m*t.hipLean*a*f*R*.6,M=m*t.hipLean*a*f*(.45+.25*R),C=t.armSwing*a*R*(d*u+.3*f),I=C,k=-C;return{legL:_,legR:v,pelvisX:S,pelvisY:T,pelvisRoll:b,sideLean:M,armL:I,armR:k,strafe:f,backward:u<0?d:0}}function wf(n){const t=(n%es+es)%es,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function Ef(n,t,e){const i=Sn(e.progress,0,1);if(i>=1||n.speed<Dn)return Sf();const s=i*i*(3-2*i),a=1-s;return Kl({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*s,speed:n.speed*a,stride:n.stride*a},t)}function Tf(n,t,e,i){const s=Sn(n,-1,1),a=Math.abs(s),o=Math.min(1,t*(1+Math.max(0,i)*a*a));return Sn(o*s,-1,1)*(e*Math.PI/180)}function Af(n,t,e,i){if(!(Math.hypot(n,t)>1e-6))return e;const a=Math.atan2(t,n)*180/Math.PI;if(Math.abs(a)<=90)return e;const r=(a-Math.sign(a)*180)*Math.PI/180,l=Sn(i,0,1),c=l*l;return e*c+r*(1-c)}function Rf(n,t,e,i,s){const a=Math.max(e,Dn),o=Math.max(0,i)*a,r=Math.max(0,s)*a,l=t>Dn?(t-n)/t:0,c=l>.02,h=l<-.015,f=n<=o*.15,d=!h&&n<r&&(c||f);return{enter:n>Dn&&n<=o&&c,resume:!d}}function Cf(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return Sn(n*Sn(t,0,2),-i,i)}function Pf(n,t,e){const i=Math.sin(n),s=Math.cos(n),a=Math.cos(n),o=-Math.sin(n);return{forward:t*i+e*s,right:t*a+e*o}}function Lf(n,t,e){const i=Sn(n,0,1),s=i*i*(3-2*i);return e?t==="inStop"?1-s:1:t==="afterStop"?1-s:0}function rb(n,t,e){const i=()=>({legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisY:0,env:0});if(!e.turnStepEnabled)return i();const s=Sn(n,0,1),a=Math.sin(Math.PI*s),o=a*a;if(o<=1e-9)return i();const r=t>=0,l=r?1:.35,c=r?.35:1,h=Math.max(0,e.turnStepPitch)*o,f=Math.max(0,e.turnStepKnee)*o,d=Math.max(0,e.turnStepPitch)*.35*o,u=r?1:-1;return{legL:{pitchX:-h*l,rollZ:u*d*l,kneeX:f*l},legR:{pitchX:-h*c,rollZ:-u*d*c,kneeX:f*c},pelvisY:-Math.max(0,e.turnStepDip)*o,env:o}}function Df(n,t,e,i,s){const a=Sn(n,0,1),o=Sn(s.stopPeakRatio,.05,.95),r=a<=o?a/o:(a-o)/(1-o),l=r*r*(3-2*r),c=a<=o?l:1-l,h=Math.hypot(e,i),f=h>Dn?e/h:1,d=h>Dn?i/h:0,u=bf(t,1)>0;return{leadPitch:Math.max(0,s.stopStepPitch)*c,trailPitch:Math.max(0,s.stopTrailPitch)*c,leadKnee:Math.max(0,s.stopStepKnee)*c,bodyShift:Math.max(0,s.stopBodyShift)*c,bodyDip:Math.max(0,s.stopBodyDip)*c,chestPitch:Math.max(0,s.stopChestPitch)*c,leadLeft:u,fwdN:f,rightN:d,env:c}}function vn(n){return n<0?0:n>1?1:n}const Co=Math.PI*2;function cb(n){return((n+Math.PI)%Co+Co)%Co-Math.PI}function lb(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function hb(n,t,e,i,s,a=n.phase){const o=vn(i);if(o<=0)return n;const r=vn(t),l=Math.max(1,Math.round(s.cycles)),c=Math.max(0,s.strideSpeed),h=e%2===0?1:-1,f=vn(s.forwardBias),d=Math.max(0,n.stride??0),u=Math.max(0,s.strideScale??0)*d,m=r<=.5?r*2:(r-.5)*2,y=m*m*(3-2*m),g=r<=.5?y:1-y,p={speed:c,phase:a+Co*l/2*g,localForward:c*f,localRight:c*(1-f)*h},x=cb(p.phase-n.phase),_=o*o*(3-2*o),v=n.speed>.05?d:0;return{speed:n.speed+(p.speed-n.speed)*o,phase:n.phase+x*_,localForward:n.localForward+(p.localForward-n.localForward)*o,localRight:n.localRight+(p.localRight-n.localRight)*o,stride:v+(u-v)*o*o}}function db(n,t,e){const i=lb(),s=vn(n),a=Math.sin(Math.PI*s)**2;if(a<=1e-12)return i;const o=t%2===0?1:-1,r=o<0,l=o>0,c=e.stepPitch*a,h=e.stepKnee*a,f=e.stepSide*a;return i.legL.pitchX=r?-c:c*.55,i.legR.pitchX=l?-c:c*.55,i.legL.kneeX=r?h:h*.4,i.legR.kneeX=l?h:h*.4,i.legL.rollZ=-f*o,i.legR.rollZ=f*o,i.pelvisX=e.stepSway*a*o,i.pelvisY=-e.stepDip*a,i.pelvisRoll=f*.25*o,i}function kf(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function nu(n,t,e,i,s){if(e<=0||i<=0)return 0;const a=(n-t)/e;return a<0||a>=1?0:i*kf(a,s)}function ub(n,t,e,i){const s=t?1:0,a=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),o=n+(s-n)*a;return t&&o>.999?1:!t&&o<.001?0:o}function fb(n,t,e){const i=vn(n);return{gaitScale:1-i*(1-vn(t)),attackLegWeight:vn(e)*i}}function pb(n,t){const e=vn(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function mb(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return vn(t.minScale+(1-t.minScale)*e)}function gb(){return If()}function If(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function xb(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function vb(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?vn(t.forceHitHeight):n.type==="light"?vn(t.hitHeight.light):n.type==="heavy"?vn(t.hitHeight.heavy):n.type==="knock"?vn(t.hitHeight.knock):0}function _b(n,t,e){const i=vn(e),s=(a,o)=>a+(o-a)*i;return{upperPitch:s(n.upperPitch,t.upperPitch),upperRoll:s(n.upperRoll,t.upperRoll),upperYaw:s(n.upperYaw,t.upperYaw),fold:s(n.fold,t.fold),shift:s(n.shift,t.shift),drop:s(n.drop,t.drop),back:s(n.back,t.back),knee:s(n.knee,t.knee),hip:s(n.hip,t.hip),arm:s(n.arm,t.arm)}}function Ff(n,t,e){const i=If(),s=xb(n,e);if(i.intensity=s,s<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const a=vn(1-n.timer/n.duration),o=kf(a,e.pulseRatio);i.pulse=o,i.active=o>0,i.hitHeight=vb(n,e);const r=Math.sin(t),l=Math.cos(t),c=Math.cos(t),h=-Math.sin(t),f=n.dirX*r+n.dirZ*l,d=n.dirX*c+n.dirZ*h;if(i.localFwd=f,i.localRight=d,!e.enabled){i.legacy=!0;const y=Math.sin(Math.PI*a);return i.upperPitch=s*y*f,i.upperRoll=-s*y*d*.7,i.drop=(s>.5?.09:.04)*y,i.flash=e.flashStrength*y,i.active=y>0,i}const u=s*o,m=_b(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=u*(m.upperPitch*f+m.fold),i.upperRoll=-u*m.upperRoll*d,i.upperYaw=u*m.upperYaw*d,i.upperShift=u*m.shift,i.upperShiftX=i.upperShift*d,i.upperShiftZ=i.upperShift*f,i.comShift=u*e.comShift,i.comX=i.comShift*d,i.comZ=i.comShift*f,i.pelvisBack=u*m.back,i.drop=u*m.drop,i.knee=u*m.knee,i.hip=u*m.hip,i.arm=u*m.arm,i.flash=e.flashStrength*o,i}function Uf(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),s=Number.isFinite(n.leanForward)?n.leanForward:0,a=Number.isFinite(n.leanSide)?n.leanSide:0,o=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:s*e,pelvisRoll:a*e,pelvisX:-a*i,pelvisZ:s*i,crouch:Math.max(0,t.moveCrouch)*o}}const Wi=1e-6;function va(n,t,e){return n<t?t:n>e?e:n}function zf(n,t,e,i=1){const s=t,a=e;if(!Number.isFinite(s)||!Number.isFinite(a)||s<=Wi||a<=Wi||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const r=s+a,l=Math.abs(s-a)+Wi,c=Math.hypot(n.x,n.y,n.z);if(c<=Wi)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const h=Math.atan2(n.x,-n.y),f=Math.hypot(n.x,n.y),d=n.z,u=Math.hypot(d,f),m=va(u,l,r),y=u>r+Wi||u<l-Wi,g=Math.atan2(-d,Math.max(f,Wi)),p=va((s*s+m*m-a*a)/(2*s*m),-1,1),x=va((a*a+m*m-s*s)/(2*a*m),-1,1),_=Math.acos(p),v=Math.acos(x),R=i>=0?1:-1;return{rootPitch:g-R*_,rootRoll:h,jointPitch:R*(_+v),clamped:y,reach:c/r}}function Nf(n,t,e,i){const s=va(e,0,1),a=Math.max(0,i),o=(r,l)=>{const c=va((l-r)*s,-a,a);return r+c};return{rootPitch:o(n.rootPitch,t.rootPitch),rootRoll:o(n.rootRoll,t.rootRoll),jointPitch:o(n.jointPitch,t.jointPitch)}}function Of(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const Jl={active:!1,weight:0,clamped:0,maxError:0};function Bf(n){const{root:t,pelvis:e,lower:i,limbs:s,base:a,cfg:o}=n;if(!o.enabled||o.weight<=0||!n.grounded||s.length===0)return{...Jl};const r={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(a.pelvisPos),e.rotation.x=a.pelvisRotX,e.rotation.z=a.pelvisRotZ,i.position.copy(a.lowerPos),i.rotation.z=a.lowerRotZ,t.updateWorldMatrix(!0,!0);const l=s.map(u=>u.tip.getWorldPosition(new G));e.position.copy(r.pelvisPos),e.rotation.x=r.pelvisRotX,e.rotation.z=r.pelvisRotZ,i.position.copy(r.lowerPos),i.rotation.z=r.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const c=Math.max(0,Math.min(1,o.weight))*(n.attacking?Math.max(0,Math.min(1,o.attackScale)):1),h=Math.max(0,o.maxCorrectionDeg)*Math.PI/180;let f=0;for(let u=0;u<s.length;u++){const m=s[u],y=i.worldToLocal(l[u].clone()),g={x:y.x-m.root.position.x,y:y.y-m.root.position.y,z:y.z-m.root.position.z},p=zf(g,m.upperLen,m.lowerLen,m.bend);p.clamped&&(f+=1);const x=Nf({rootPitch:m.root.rotation.x,rootRoll:m.root.rotation.z,jointPitch:m.joint.rotation.x},p,c,h);m.root.rotation.x=x.rootPitch,m.root.rotation.z=x.rootRoll,m.joint.rotation.x=x.jointPitch}t.updateWorldMatrix(!0,!0);let d=0;for(let u=0;u<s.length;u++){const m=s[u].tip.getWorldPosition(new G);d=Math.max(d,m.distanceTo(l[u]))}return{active:!0,weight:c,clamped:f,maxError:d}}function Tn(n,t,e){return n<t?t:n>e?e:n}function yb(n,t,e,i,s,a,o,r,l,c){const h=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},f=new Le,d=new Le;d.name="pelvis",d.position.y=n.legLength,f.add(d);const u=new Le;u.name="lower";const m=new Le;m.name="upper",d.add(u),d.add(m);const y=[],g=(K,ft,It,et)=>{const gt=new Ca({color:et}),O=new ge(new Gn(K,ft,It),gt);return O.castShadow=!0,O.receiveShadow=!0,y.push(gt),O},p=n.headSize,x=n.legLength,_=n.armLength,v=n.limbThickness,R=n.bodyHeight,w=n.bodyWidth,S=g(w,R,.28,e);S.position.y=R/2,m.add(S);const T=new Le;T.name="headPivot",T.rotation.order="YXZ",T.position.y=R,m.add(T);const b=g(p,p,p,e);b.position.y=p/2,T.add(b);for(const K of[-1,1]){const ft=g(.06,.07,.02,t.shoe);ft.position.set(K*.09,p/2+.03,p/2+.011),T.add(ft)}const M=(K,ft)=>{const It=ft?_:x,et=new Le;et.name=ft?K<0?"shoulderL":"shoulderR":K<0?"hipL":"hipR",ft||(et.rotation.order="ZYX"),et.position.set(K*(ft?w/2+v/2:w/2-v/2),ft?R-.04:0,0),(ft?m:u).add(et);const gt=g(v,It/2,v,t.limb);gt.position.y=-It/4,et.add(gt);const O=new Le;O.name=ft?"elbow":"knee",O.position.y=-It/2,et.add(O);const st=g(v,It/2,v,t.limb);if(st.position.y=-It/4,O.add(st),!ft){const ut=g(v*1.15,.07,v*1.7,t.shoe);ut.position.set(0,-It/2+.035,.045),O.add(ut);const Gt=new He;return Gt.name="footTip",Gt.position.y=-It/2,O.add(Gt),{root:et,joint:O,tip:Gt}}return{root:et,joint:O}},C=M(-1,!1),I=M(1,!1),k=M(-1,!0),N=M(1,!0),L=[C,I].map(K=>({root:K.root,joint:K.joint,tip:K.tip,upperLen:x/2,lowerLen:x/2,bend:1})),D=new Qe({color:s.attackArcColor,transparent:!0,opacity:0,side:Ne,depthWrite:!1}),B=new ge(new nr(.62,.042,6,20,Math.PI*1.1),D);B.position.set(0,.78-x,.56),m.add(B);const U=new ee(e),z=new ee(r.flashColor),W=new ee;let mt=null,at=0,dt=0,tt=0,Z=0,pt=0,j=0,Mt=0,$t={...Jl},Bt=-1,jt=0,ht=0,Dt=0,V=0,ue=0,Zt=0,Vt=0,kt=1,Et=0,At=0,P="none",E=0,Y=!1,rt=-1,lt=!1,it=0,Rt=0;return{group:f,boneAtWorld(K,ft,It){const et=[{node:m,ax:0,ay:.05,az:0,bx:0,by:R,bz:0},{node:T,ax:0,ay:0,az:0,bx:0,by:p,bz:0},{node:k.root,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:k.joint,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:N.root,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:N.joint,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:C.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:C.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:I.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:I.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0}],gt=new G,O=new G,st=new G(K,ft,It),ut=new G;let Gt=null,qt=Number.POSITIVE_INFINITY;for(const zt of et){zt.node.updateWorldMatrix(!0,!1),gt.set(zt.ax,zt.ay,zt.az),O.set(zt.bx,zt.by,zt.bz),zt.node.localToWorld(gt),zt.node.localToWorld(O);const F=O.x-gt.x,xt=O.y-gt.y,J=O.z-gt.z,ot=F*F+xt*xt+J*J;let St=ot>1e-8?((st.x-gt.x)*F+(st.y-gt.y)*xt+(st.z-gt.z)*J)/ot:0;St=Math.max(0,Math.min(1,St));const bt=gt.x+F*St,Kt=gt.y+xt*St,re=gt.z+J*St,ce=(st.x-bt)**2+(st.y-Kt)**2+(st.z-re)**2;ce<qt&&(qt=ce,Gt=zt.node,ut.set(bt,Kt,re))}return Gt?{node:Gt,point:ut.clone()}:null},update(K,ft){f.position.set(K.position.x,K.position.y,K.position.z),f.rotation.y=K.bodyYaw,T.rotation.y=(K.headYaw-K.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,K.mode!==mt&&(mt=K.mode,at=1),at=Math.max(0,at-ft*2.2);const It=K.hurt,et=Ff(It,K.bodyYaw,r),gt=et.flash;W.copy(z).multiplyScalar(gt);for(const Ft of y)Ft.emissive.copy(U).multiplyScalar(at*.5),gt>0&&Ft.emissive.add(W);d.position.set(0,x,0),d.rotation.set(0,0,0),m.position.set(0,0,0),m.rotation.set(0,0,0),u.position.set(0,0,0),u.rotation.z=0;const O=Math.hypot(K.velocity.x,K.velocity.z),st=Tn(o.knockGaitScale??0,0,1),ut=K.hurt.knockX*st,Gt=K.hurt.knockZ*st,qt=st>0&&Math.hypot(K.hurt.knockX,K.hurt.knockZ)>.001,zt=K.velocity.x+ut,F=K.velocity.z+Gt,xt=Math.hypot(zt,F),J=Math.cos(K.bodyYaw),ot=-Math.sin(K.bodyYaw),St=O>1e-6?Tn((K.velocity.x*J+K.velocity.z*ot)/O,-1,1):0,bt=O>1e-6?Tn((K.velocity.x*Math.sin(K.bodyYaw)+K.velocity.z*Math.cos(K.bodyYaw))/O,-1,1):1,Kt=jl(bt,o.backStrafeStartDeg,o.backStrafeFullDeg);P==="settled"&&lt&&it>Rt*1.02+1e-4&&(P="none");let re=1;P==="blend"?(re=Lf(Y?rt:E,o.stopYawBlendMode,Y),Y||(E=Math.min(1,E+ft/Math.max(.01,o.stopYawAfterSec)),(E>=1||o.stopYawBlendMode==="inStop"||lt)&&(P="settled",re=0))):P==="settled"&&(re=Tn(O/Math.max(1e-6,o.stopEnterRatio*a),0,1));const ce=Tf(St,o.strafeHipScale,o.strafeHipMaxDeg,o.strafeHipBoost),ne=Af(bt,St,ce,Kt)*re;Et+=(ne-Et)*(1-Math.exp(-12*Math.max(0,ft))),u.rotation.y=Et;const be=K.bodyYaw+Et,xe=Math.sin(be),Ve=Math.cos(be),je=Math.cos(be),Me=-Math.sin(be),ke=zt*xe+F*Ve,Ue=zt*je+F*Me,q=Math.max(0,o.stopBlendSec||0),Ct=q>0&&!qt,Tt=Rf(O,At,a,o.stopEnterRatio,o.stopExitRatio);if(!Ct||Tt.resume)Bt=-1;else if(Bt<0&&Tt.enter){Bt=0,jt=K.gaitPhase,ht=wf(K.gaitPhase),Dt=O,V=Math.max(K.stride,1e-6),ue=ke,Zt=Ue;const Ft=1/Math.max(1e-6,O);Vt=K.velocity.x*Ft,kt=K.velocity.z*Ft}const Qt=At;At=O;const Jt=Ct&&Bt>=0;Jt&&(Bt=Math.min(1,Bt+ft/q)),Jt&&P!=="blend"&&(P="blend",E=0),Y=Jt&&Bt<1,rt=Bt,lt=Tt.resume,it=O,Rt=Qt;const le=Jt?{phase:jt,speed:Dt,moveSpeed:a,localForward:ue,localRight:Zt,legLength:n.legLength,stride:V,grounded:!0}:{phase:K.gaitPhase,speed:xt,moveSpeed:a,localForward:ke,localRight:Ue,legLength:n.legLength,stride:K.stride,grounded:!0},ae=Jt?Ef(le,o,{progress:Bt,phase0:jt,phaseEnd:ht}):Kl(le,o);let cn=0,Xe=0,A=0,X=0;if(Jt){const Ft=Pf(K.bodyYaw,Vt,kt),Ht=Df(Bt,jt,Ft.forward,Ft.right,o);Ht.leadLeft?(ae.legL.pitchX-=Ht.leadPitch,ae.legL.kneeX+=Ht.leadKnee,ae.legR.pitchX+=Ht.trailPitch):(ae.legR.pitchX-=Ht.leadPitch,ae.legR.kneeX+=Ht.leadKnee,ae.legL.pitchX+=Ht.trailPitch),Xe=Ht.bodyShift*Ht.fwdN,cn=Ht.bodyShift*Ht.rightN,A=Ht.bodyDip,X=Ht.chestPitch}C.root.rotation.x=ae.legL.pitchX,I.root.rotation.x=ae.legR.pitchX,C.root.rotation.z=ae.legL.rollZ,I.root.rotation.z=ae.legR.rollZ,C.joint.rotation.x=ae.legL.kneeX,I.joint.rotation.x=ae.legR.kneeX,k.root.rotation.x=ae.armL,N.root.rotation.x=ae.armR,k.joint.rotation.x=-.18,N.joint.rotation.x=-.18,d.position.x=ae.pelvisX,d.position.y=x+ae.pelvisY,d.position.z=0,d.rotation.z=ae.pelvisRoll,m.rotation.z=ae.sideLean*(et.intensity>0?.4:1);const nt=Of(d,u),Q=Jt&&h.enabled?{...h,weight:1}:h,$=Q.enabled&&Q.weight>0?Tn(Q.weight,0,1):0;if(d.position.x+=cn,d.position.z+=Xe,d.position.y-=A,u.position.y+=A,$<=0&&(u.position.x-=cn,u.position.z-=Xe),l){const Ft=Math.max(.004166666666666667,Math.min(ft,.1)),Ht=Math.sin(K.bodyYaw),Lt=Math.cos(K.bodyYaw),oe=Tn((K.velocity.x-dt)/Ft,-60,60),yt=Tn((K.velocity.z-tt)/Ft,-60,60),vt=oe*Ht+yt*Lt,te=Oe(K.bodyYaw-Z)/Ft,he=l.maxForwardDeg*Math.PI/180,Nt=l.maxSideDeg*Math.PI/180,Ke=1-Math.exp(-Math.max(0,l.smoothing)*Ft);pt+=(Tn(vt*l.accelGain,-he,he)-pt)*Ke,j+=(Tn(-te*O*l.turnGain,-Nt,Nt)-j)*Ke;const de=Number.isFinite(l.crouchSmoothing)?l.crouchSmoothing:8;Mt+=(Tn(O/Math.max(a,1e-6),0,1)-Mt)*(1-Math.exp(-Math.max(0,de)*Ft));const Ae=Uf({leanForward:pt,leanSide:j,speedRatio:Mt},l);m.rotation.x+=pt+X,m.rotation.z+=j,d.rotation.x+=Ae.pelvisPitch,d.rotation.z+=Ae.pelvisRoll,d.position.x+=Ae.pelvisX,d.position.z+=Ae.pelvisZ,d.position.y-=Ae.crouch,u.position.y+=Ae.crouch*(1-$)}dt=K.velocity.x,tt=K.velocity.z,Z=K.bodyYaw,m.rotation.x+=et.upperPitch,m.rotation.z+=et.upperRoll,m.rotation.y+=et.upperYaw;const wt=Tn(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),Pt=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;m.position.x+=Tn(et.upperShiftX*wt,-Pt,Pt),m.position.z+=Tn(et.upperShiftZ*wt,-Pt,Pt),d.position.x+=et.comX,d.position.z+=et.comZ-et.pelvisBack,d.position.y-=et.drop;const Yt=et.legacy?0:Math.max(0,Math.min(1,r.lowerScale));if(u.position.z+=et.pelvisBack*(1-Yt),u.position.y+=et.drop*(1-Yt),C.joint.rotation.x+=et.knee,I.joint.rotation.x+=et.knee,C.root.rotation.x-=et.hip,I.root.rotation.x-=et.hip,k.root.rotation.x+=et.arm,N.root.rotation.x+=et.arm*.8,K.attackPhase!=="idle"&&et.intensity===0){const Ft=K.attackProgress,Ht=Ft<.34?-1:Ft<.68?-1+(Ft-.34)/.34*2:Math.max(0,1-(Ft-.68)/.32),Lt=Math.max(0,-Ht),oe=Math.max(0,Ht);N.root.rotation.x=-1.7*Lt+1.25*oe,N.joint.rotation.x=-(.25+Lt*.45),m.rotation.y=-.28*Ht,D.opacity=K.attackPhase==="active"?.85:0,K.attackPhase==="active"&&(B.rotation.z=-1.1+Ft*3)}else D.opacity=0;const Xt=Cf(Et,o.chestYawScale,o.chestYawMaxDeg);m.rotation.y+=Xt,T.rotation.y=(K.headYaw-K.bodyYaw-Xt+Math.PI*3)%(Math.PI*2)-Math.PI,$t=Bf({root:f,pelvis:d,lower:u,limbs:L,base:nt,cfg:Q,grounded:!0,attacking:K.attackPhase!=="idle"})},ik(){return $t},dispose(){f.traverse(K=>{if(K instanceof ge){K.geometry.dispose();const ft=K.material;Array.isArray(ft)?ft.forEach(It=>It.dispose()):ft.dispose()}})}}}const $i=.012,Yi=.016;function Mb(n,t){const e=t.lab,i=new Le;i.name="test-lab";const s=[],a=[],o=[],r=[];function l(x){return o.push(x),x}function c(x){return r.push(x),x}function h(x,_,v,R=$i){const w=l(new Qe({color:_,transparent:!0,opacity:v,depthWrite:!1,side:Ne,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),S=new ge(x,w);return S.rotation.x=-Math.PI/2,S.position.y=R,S.renderOrder=2,S}function f(x,_){return c(new Ra(Math.max(x,.001),_,72))}function d(x,_,v,R=Yi){const S=document.createElement("canvas"),T=S.getContext("2d");if(!T)return new ge;const b='700 96px "Noto Sans SC", ui-monospace, Menlo, monospace';T.font=b,S.width=$h.ceilPowerOfTwo(Math.ceil(T.measureText(x).width)+32),S.height=$h.ceilPowerOfTwo(96*1.4);const M=S.getContext("2d");if(!M)return new ge;M.font=b,M.textAlign="center",M.textBaseline="middle",M.fillStyle=v,M.fillText(x,S.width/2,S.height/2);const C=new fl(S);C.colorSpace=xn,a.push(C);const I=S.width/S.height,k=c(new Pn(_*I,_)),N=l(new Qe({map:C,transparent:!0,depthWrite:!1,side:Ne,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3})),L=new ge(k,N);return L.rotation.x=-Math.PI/2,L.position.y=R,L.renderOrder=3,L}function u(x,_,v,R,w,S){const T=v-_,b=c(new Pn(T,R)),M=h(b,w,S,$i);M.position.set(T/2+_,$i,0);const C=new Le;return C.add(M),C.rotation.y=x-Math.PI/2,C}function m(x,_,v,R,w){const S=new xf;S.moveTo(0,_*.5),S.lineTo(-v*.5,_*.5-v*.9),S.lineTo(-v*.18,_*.5-v*.9),S.lineTo(-v*.18,-_*.5),S.lineTo(v*.18,-_*.5),S.lineTo(v*.18,_*.5-v*.9),S.lineTo(v*.5,_*.5-v*.9),S.closePath();const T=c(new ql(S)),b=h(T,R,w,$i+.002),M=new Le;return M.add(b),M.rotation.y=x+Math.PI,M}function y(x){var T;const _=new Le,v=d(`${x.index} · ${x.name}`,t.lab.labelTextHeight,"#eaf4ff"),w=((T=v.geometry.parameters)==null?void 0:T.width)??3;_.add(v);const S=h(c(new Pn(w*.98,.08)),x.color,.7,Yi);return S.position.set(0,Yi,t.lab.labelTextHeight*.66),_.add(S),_.position.set(x.labelX,0,x.labelZ),_}const g=new Le;for(const x of n??[]){const _=new Le;if(_.position.set(x.x,0,x.z),x.shape==="square"){const v=x.radius,R=h(c(new Pn(v*2,v*2)),x.color,e.padOpacity*.09);_.add(R);const w=.07,S=[[0,v,v*2+w,w],[0,-v,v*2+w,w],[-v,0,w,v*2+w],[v,0,w,v*2+w]];for(const[T,b,M,C]of S){const I=h(c(new Pn(M,C)),x.color,e.padOpacity);I.position.x=T,I.position.z=b,_.add(I)}}else _.add(h(c(new Wl(x.radius,72)),x.color,e.padOpacity*.075)),_.add(h(f(x.radius-.075,x.radius),x.color,e.padOpacity));if(x.id==="hub"){for(let v=0;v<4;v++){const R=v*Math.PI/4,w=v%2===0;for(const S of[0,Math.PI])_.add(u(R+S,x.radius*.12,x.radius*.94,w?.09:.055,x.color,w?.5:.32))}_.add(h(f(.5,.56),x.color,.4))}else if(x.id==="dash"){const v=x.spawnZ-x.z,R=-x.radius+.5,w=v-R,S=h(c(new Pn(.06,w)),x.color,.36);S.position.set(0,$i,(v+R)/2),_.add(S);let T=0;for(let M=v;M>=R-.01;M-=1,T++){const C=T%5===0,I=h(c(new Pn(C?2.4:1.3,C?.1:.07)),x.color,C?.72:.42);I.position.set(0,$i,M),_.add(I);const k=d(String(T),.52,C?"#eaf4ff":"rgba(200,225,245,0.8)");k.position.set(1.6,Yi,M),_.add(k)}const b=[[3.2,"翻滚 3.2"],[5,"闪现 5.0"]];for(const[M,C]of b){const I=v-M,k=h(c(new Pn(1.9,.09)),"#ffffff",.5);k.position.set(-1.5,$i,I),_.add(k);const N=d(C,.42,"rgba(220, 236, 250, 0.86)");N.position.set(-3,Yi,I),_.add(N)}}else if(x.id==="gait"){_.add(h(f(1.44,1.5),x.color,.5)),_.add(h(f(1.14,1.2),x.color,.22));const v=1.55,R=[[0,"180° 正后退","#ff9a8a"],[Math.PI/4,"135° 斜后","#ffd166"],[Math.PI/2,"90° 正侧移","#8fe7ff"]];for(const[w,S,T]of R){const M=Math.sin(w),C=Math.cos(w),I=m(w,1.7,.34,T,.75);I.position.set(M*1.7*.5,0,v+C*1.7*.5),_.add(I);const k=d(S,.44,T);k.position.set(M*(1.7+.7),Yi,v+C*(1.7+.7)),_.add(k)}}if(g.add(_),e.showLabels){const v=y(x);s.push(v),g.add(v)}}i.add(g);const p=n==null?void 0:n.find(x=>x.id==="hub");if(p&&e.showLabels){const x=[[0,-1,"屏上"],[0,1,"屏下"],[-1,0,"屏左"],[1,0,"屏右"]];for(const[_,v,R]of x){const w=d(R,.4,"rgba(190, 224, 248, 0.8)");w.position.set(p.x+_*(p.radius+.7),Yi,p.z+v*(p.radius+.7)),i.add(w),s.push(w)}}return i.visible=e.enabled,{group:i,setVisible(x){i.visible=x},setLabelsVisible(x){for(const _ of s)_.visible=x},dispose(){for(const x of r)x.dispose();for(const x of o)x.dispose();for(const x of a)x.dispose();i.clear()}}}const Ql=64,Hf=[0,.24,.76,1],Sb=[0,1,1,0],Gf=[0,.12,.28,.5,.72,.88,1],bb=[0,.16,.5,1,.5,.16,0];function iu(n,t){if(t<=1e-6)return 1;const e=Math.min(1,Math.max(0,n/t));return e*e*(3-2*e)}function th(n,t,e,i,s=Ql,a="band"){const o=Math.max(.001,n-t*.5),r=Math.max(o+.001,n+t*.5),l=a==="glow"?Gf:Hf,c=a==="glow"?bb:Sb,h=l.length,f=s+1,d=new Float32Array(f*h*3),u=new Float32Array(f*h*4),m=[];for(let g=0;g<f;g++){const p=g/s,x=(p-.5)*e,_=iu(p,i)*iu(1-p,i),v=Math.sin(x),R=Math.cos(x);for(let w=0;w<h;w++){const S=o+(r-o)*l[w],T=g*h+w;d[T*3]=v*S,d[T*3+1]=0,d[T*3+2]=R*S;const b=_*c[w];u[T*4]=1,u[T*4+1]=1,u[T*4+2]=1,u[T*4+3]=b}}for(let g=0;g<s;g++)for(let p=0;p<h-1;p++){const x=g*h+p,_=x+h;m.push(x,_,x+1,x+1,_,_+1)}const y=new qe;return y.setAttribute("position",new rn(d,3)),y.setAttribute("color",new rn(u,4)),y.setIndex(m),y.computeBoundingSphere(),y}function cc(n){const t=new Qe({color:n.color,transparent:!0,opacity:n.opacity,depthWrite:!1,side:Ne,vertexColors:!0,toneMapped:!1}),e=new Map;let i=null;const s=(l,c)=>{const h=Math.round(l*32)/32,f=Math.max(.05,Math.round(c*20)/20),d=`${Math.round(h*32)}|${Math.round(f*20)}`,u=e.get(d);if(u)return u;const m=th(n.radius,n.thickness*f,h,n.edgeFade,Ql,n.profile??"band");if(e.set(d,m),e.size>64){for(const[y,g]of e)if(y!==d&&g!==i){g.dispose(),e.delete(y);break}}return m};i=s(n.arcRad,1);const a=new ge(i,t);a.position.y=n.y,a.renderOrder=n.renderOrder??4;let o=n.arcRad,r=1;return{mesh:a,update(l,c,h,f,d,u=1){const m=Math.max(.05,u);(Math.abs(l-o)>.01||Math.abs(m-r)>.01)&&(i=s(l,m),a.geometry=i,o=l,r=m),t.opacity=c,t.color.copy(f),a.scale.set(h,1,h),a.rotation.y=d,a.visible=c>.002},arcRad(){return o},dispose(){for(const l of e.values())l.dispose();e.clear(),t.dispose()}}}function su(n,t){return Math.max(.05,n*.5*Math.max(.1,t))}function wb(n,t,e,i,s){const a=s.arcDeg*Math.PI/180,o=s.playerOpacity;if(!n)return{arcRad:a,opacity:o,scale:1,level:0};const r=Math.min(1,Math.max(0,t)),l=Math.min(1,Math.max(0,e)),c=s.selectedArcDeg*Math.PI/180,h=a+(c-a)*(.35+.65*r),f=4+4*r+6*l,d=.5+.5*Math.sin(i*f),u=Math.min(.95,o+(.2+.1*l)*r+.04*d),m=1+.02*r+.012*d*r;return{arcRad:h,opacity:u,scale:m,level:r}}function Eb(n,t,e,i,s){const a=Math.min(1,Math.max(0,s));return a<=.001?n.copy(t):a<.5?n.copy(t).lerp(e,a*2):n.copy(e).lerp(i,(a-.5)*2)}function Tb(n=64,t=.06,e=5){const i=n+1,s=e+1,a=new Float32Array(i*s*3),o=new Float32Array(i*s*4),r=[];for(let c=0;c<i;c++){const h=c/n*Math.PI*2,f=Math.sin(h),d=Math.cos(h);for(let u=0;u<s;u++){const m=u/e,y=t+(1-t)*m,g=c*s+u;a[g*3]=f*y,a[g*3+1]=0,a[g*3+2]=d*y;const p=Math.pow(1-m,1.8)*.9+(u===0?.1:0);o[g*4]=1,o[g*4+1]=1,o[g*4+2]=1,o[g*4+3]=Math.min(1,p)}}for(let c=0;c<n;c++)for(let h=0;h<e;h++){const f=c*s+h,d=f+s;r.push(f,d,f+1,f+1,d,d+1)}const l=new qe;return l.setAttribute("position",new rn(a,3)),l.setAttribute("color",new rn(o,4)),l.setIndex(r),l.computeBoundingSphere(),l}function au(n){const t=n.segments??Ql,e=n.profile??"band",s=((e==="glow"?Gf.length:Hf.length)-1)*6,a=th(n.radius,n.thickness,n.arcRad,n.edgeFade,t,e),o=new Qe({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ne,vertexColors:!0,toneMapped:!1}),r=new ge(a,o);r.position.y=n.y,r.renderOrder=n.renderOrder??7,r.visible=!1,a.setDrawRange(0,0);let l=0;return{mesh:r,set(c,h,f,d,u=1){const m=Math.min(1,Math.max(0,c)),y=Math.round(m*t),g=m>.001?Math.max(1,y)*s:0;g!==a.drawRange.count&&a.setDrawRange(0,g),l=y,o.opacity=h,o.color.copy(f),r.scale.set(u,1,u),r.rotation.y=d,r.visible=h>.002&&m>.001},ratio(){return t>0?l/t:0},filledSegments(){return l},dispose(){a.dispose(),o.dispose()}}}function ou(n){const t=new Le,e=Tb(48),i=new Qe({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ne,vertexColors:!0,toneMapped:!1}),s=new ge(e,i);s.renderOrder=n.renderOrder??2,t.add(s);const a=Math.max(.01,n.edgeWidthRatio??.045),o=th(1-a*.5,a,Math.PI*2,0,64,"band"),r=new Qe({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ne,vertexColors:!0,toneMapped:!1}),l=new ge(o,r);return l.renderOrder=(n.renderOrder??2)+1,t.add(l),t.position.y=n.y,{group:t,set(c,h,f,d,u,m){const y=Math.min(1,Math.max(0,u));t.position.set(c,f,h),s.scale.set(d,1,d),l.scale.set(d,1,d),i.opacity=y*.26,r.opacity=y*(.72+.18*Math.sin(m*7)),t.visible=y>.004},dispose(){e.dispose(),i.dispose(),o.dispose(),r.dispose()}}}function ru(n,t,e,i){if(i<=1e-4||e<=0)return t;const s=1-Math.exp(-e/i);return n+(t-n)*s}function Ab(n,t,e){if(n!=="windup")return{active:!1,ratio:0,urgency:0};const i=Math.max(1e-4,e),s=Math.min(1,Math.max(0,t/i));return{active:!0,ratio:s,urgency:.35+.65*s}}function Rb(n){if(n.charging)return{source:"charge",ratio:Math.min(1,Math.max(0,n.charge))};if(n.channeling){if(n.channelProgress!==void 0)return{source:"channel",ratio:Math.min(1,Math.max(0,n.channelProgress))};const i=Math.max(1e-4,n.fireInterval);return{source:"channel",ratio:1-Math.min(1,Math.max(0,n.fireTimer/i))}}const t=n.arcaneCooldown??0,e=n.arcaneCooldownMax??0;return t>0&&e>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,t/e))}:n.dashCooldown>0&&n.dashCooldownMax>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,n.dashCooldown/n.dashCooldownMax))}:{source:"none",ratio:0}}function Cb(n,t,e,i,s,a){return n!=="windup"||s<=.05?{active:!1,x:t,z:e,radius:0}:{active:!0,x:t+Math.sin(i)*s,z:e+Math.cos(i)*s,radius:Math.max(.3,a)}}function Pb(n,t){const e=Math.max(.02,t),i=Math.min(1,Math.max(0,n/e));return{scale:.06+.94*(1-Math.pow(1-i,3)),alpha:i}}function Lb(n,t,e){return n?t:e}function Vf(n){return{x:0,y:0,z:1}}function Db(n){return Math.asin(Vf().y)}function kb(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}const xl={arm:1,leg:1,torso:1,girthArm:1,girthLeg:1,girthTorso:1},Ib=1e-6;function An(n,t,e){return n<t?t:n>e?e:n}function lc(n,t){const e=Math.max(.2,n);return An(Math.pow(e,-t),.5,2)}function Fb(n,t){if(!t.enabled)return{...xl};const e=An(n.swing,-1,1),i=An(n.charge,0,1),s=An(n.impact,0,1),a=An(n.speedRatio,0,1),o=Math.max(0,e),r=1-(1-o)*(1-o),l=1+(Math.max(1,t.swingArm)-1)*r,c=Math.max(0,-e),h=An(t.chargeArm,.6,1),f=1-(1-h)*c,d=1-(1-h)*i;let u=1;o>0?u=l:c>0?u=f:i>0&&(u=d);const m=1-An(t.impactSquash,0,.6)*s;u*=m;const y=Math.max(1,t.runLeg),p=(n.grounded?1+(y-1)*a:1)*(1-An(t.impactSquash,0,.6)*s*.6),x=An(t.torsoGain,0,1),_=1+(u-1)*x;return u=An(u,.6,1.6),{arm:u,leg:An(p,.6,1.4),torso:An(_,.7,1.4),girthArm:lc(u,t.volumeExp),girthLeg:lc(p,t.volumeExp),girthTorso:lc(_,t.volumeExp)}}function Ub(n,t,e,i){const s=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),a=(o,r)=>o+(r-o)*s;return{arm:a(n.arm,t.arm),leg:a(n.leg,t.leg),torso:a(n.torso,t.torso),girthArm:a(n.girthArm,t.girthArm),girthLeg:a(n.girthLeg,t.girthLeg),girthTorso:a(n.girthTorso,t.girthTorso)}}function zb(n,t,e){const i=n*Math.exp(-Math.max(Ib,e)*Math.max(0,t));return i<.001?0:An(i,0,1)}const cu=[{yaw:.85,pitch:-.12,roll:-.14,pz:-.06,px:.045,ap:-1.2,ay:-.42,ar:.16,el:-.48,blade:.3},{yaw:-.95,pitch:.14,roll:.17,pz:.1,px:-.05,ap:-1.46,ay:-.6,ar:-.1,el:-.14,blade:-.05},{yaw:-.75,pitch:-.08,roll:.14,pz:-.04,px:-.04,ap:-1.28,ay:-.58,ar:-.12,el:-.5,blade:.3},{yaw:.92,pitch:.15,roll:-.18,pz:.1,px:.05,ap:-1.48,ay:-.4,ar:.12,el:-.13,blade:-.05},{yaw:.12,pitch:-.32,roll:-.05,pz:-.07,px:0,ap:-1.9,ay:-.3,ar:.16,el:-.55,blade:1.3},{yaw:0,pitch:.55,roll:.02,pz:.13,px:0,ap:.05,ay:-.2,ar:0,el:-.1,blade:-.55}];function Wo(n,t,e){return n<t?t:n>e?e:n}function $e(n,t,e){return n+(t-n)*e}function Nb(n){return n?typeof n=="string"?{clip:n}:n:null}function Ob(){return{bodyYaw:0,bodyPitch:0,bodyRoll:0,pelvisX:0,pelvisZ:0,armPitch:0,armYaw:0,armRoll:0,elbow:0,bladePitch:0,armLPitch:0,armLYaw:0,armLRoll:0,elbowL:0}}function Bb(n,t){const e=n%3*2,i=cu[e],s=cu[e+1];return{...Ob(),bodyYaw:$e(i.yaw,s.yaw,t),bodyPitch:$e(i.pitch,s.pitch,t),bodyRoll:$e(i.roll,s.roll,t),pelvisX:$e(i.px,s.px,t),pelvisZ:$e(i.pz,s.pz,t),armPitch:$e(i.ap,s.ap,t),armYaw:$e(i.ay,s.ay,t),armRoll:$e(i.ar,s.ar,t),elbow:$e(i.el,s.el,t),bladePitch:$e(i.blade,s.blade,t)}}function Hb(n,t,e,i){var R,w,S;const s=((R=i.combo)==null?void 0:R[n])??[],a=Math.max(1,s.length),o=(((Math.round(t)||1)-1)%a+a)%a,r=Nb(s[o]),l=r?((w=i.clips)==null?void 0:w[r.clip])??null:null,c=Wo(((S=i.weaponScale)==null?void 0:S[n])??1,0,2),h=Number.isFinite(i.bodyScale)?Math.max(0,i.bodyScale):1,f=r&&Number.isFinite(r.scale)?r.scale:c,d=f*h,u=Wo((e+1)/2,0,1),m=l&&l.keys.length>0?Gm(l,u):Bb(o,u),y=((r==null?void 0:r.lead)??(l==null?void 0:l.lead)??"R")==="L"?"L":"R",g=(l==null?void 0:l.kind)??["right-left","left-right","overhead"][o]??"custom",p={yaw:m.bodyYaw*d,pitch:m.bodyPitch*d,roll:m.bodyRoll*d,pelvisZ:m.pelvisZ*d,pelvisX:m.pelvisX*d,armR:null,armL:null,bladePitch:m.bladePitch,lead:y,kind:g,strike:u},x={pitch:m.armPitch*f,yaw:m.armYaw*f,roll:m.armRoll*f,elbow:m.elbow*f},v=(l?Oa(l,"armLPitch")||Oa(l,"armLYaw")||Oa(l,"armLRoll")||Oa(l,"elbowL"):!1)?{pitch:m.armLPitch*f,yaw:m.armLYaw*f,roll:m.armLRoll*f,elbow:m.elbowL*f}:{pitch:x.pitch+(n==="greatsword"?.08:0),yaw:x.yaw*.8,roll:n==="greatsword"?.4:-x.roll*.6,elbow:x.elbow};return y==="L"?(p.armL=x,p.armR=n==="greatsword"?null:{...v,pitch:x.pitch+.1}):(p.armR=x,(n==="greatsword"||n==="dual-swords")&&(p.armL=v)),p}function Gb(n,t,e){const i=Wo(e,0,1),s=(a,o)=>a?o?{pitch:$e(a.pitch,o.pitch,i),yaw:$e(a.yaw,o.yaw,i),roll:$e(a.roll,o.roll,i),elbow:$e(a.elbow,o.elbow,i)}:null:o;return{yaw:$e(n.yaw,t.yaw,i),pitch:$e(n.pitch,t.pitch,i),roll:$e(n.roll,t.roll,i),pelvisZ:$e(n.pelvisZ,t.pelvisZ,i),pelvisX:$e(n.pelvisX,t.pelvisX,i),armR:s(n.armR,t.armR),armL:s(n.armL,t.armL),bladePitch:n.bladePitch===null||t.bladePitch===null?i<.5?n.bladePitch:t.bladePitch:$e(n.bladePitch,t.bladePitch,i),lead:t.lead,kind:t.kind,strike:$e(n.strike,t.strike,i)}}function Vb(n){const t=Wo(n,0,1);return t*t*(3-2*t)}function ye(n,t,e){return n<t?t:n>e?e:n}const di=1e-6;function ze(n,t,e,i){const s=new ge(new Gn(n,t,e),new Ca({color:i}));return s.castShadow=!0,s.receiveShadow=!0,s}function Ze(){return new Le}function Po(n,t,e){const i=Ze(),s=ze(t*.7,.12,t*.7,e.wood);s.position.y=.06,i.add(s);const a=ze(t*2.4,.045,t*.8,e.metal);a.position.y=.13,i.add(a);const o=ze(t*.38,n,t,e.blade);o.position.y=.13+n/2,i.add(o);const r=ze(t*.42,n*.96,t*.2,e.bladeEdge);r.position.set(0,.13+n/2,t*.5),i.add(r);const l=ze(t*.3,.09,t*.45,e.blade);return l.position.y=.13+n+.045,i.add(l),i}function Xb(n){const t=Po(.72,.15,n),e=ze(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function Wb(n){const t=Ze(),e=ze(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=ze(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function $b(n){const t=Ze(),e=ze(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=ze(.15,.15,.15,n.glow);i.position.y=.92;const s=i.material;return s.emissive=new ee(n.glow),s.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function Yb(n){const t=Ze();for(let i=0;i<5;i++){const s=(i-2)*.15,a=ze(.055,.16,.05,n.wood);a.position.set(.16-Math.abs(s)*.46,s,0),t.add(a)}const e=ze(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function Zb(n){const t=Ze(),e=ze(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=ze(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function qb(n,t,e,i,s,a,o,r,l,c,h,f){const d=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},u=f??{enabled:!1,lag:.022,maxAngle:.62,rate:26,twistLag:.018,maxTwist:.45,runDrag:0},m=h??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},y=l.stretch??{enabled:!1,swingArm:1,chargeArm:1,runLeg:1,torsoGain:0,impactSquash:0,impactDecay:12,volumeExp:.5,smoothing:26},g=l.swing??{enabled:!1,bodyScale:1,shoulderLift:.045,shoulderPush:.035,shoulderIn:.03,segBlend:.1,weaponScale:{greatsword:1,"sword-shield":.62,"dual-swords":.55}},p=Ze(),x=Ze();x.name="pelvis",x.position.y=n.legLength,p.add(x);const _=Ze();_.name="lower";const v=Ze();v.name="upper",x.add(_),x.add(v);const R=n.headSize,w=n.legLength,S=n.armLength,T=n.limbThickness,b=n.bodyHeight,M=n.bodyWidth,C=ze(M,b,.28,t.body);C.position.y=b/2,v.add(C);const I=Ze();I.name="headPivot",I.rotation.order="YXZ",I.position.y=i.headPivotHeight,v.add(I);const k=ze(R,R,R,t.head);k.position.y=R/2,I.add(k);const N=new Ca({color:"#1b2733"});for(const H of[-1,1]){const ct=new ge(new Gn(.06,.07,.02),N);ct.position.set(H*.09,R/2+.03,R/2+.011),I.add(ct)}const L=H=>{const ct=Ze();ct.name=H<0?"hipL":"hipR",ct.rotation.order="ZYX",ct.position.set(H*(M/2-T/2),0,0),_.add(ct);const _t=ze(T,w/2,T,t.limb);_t.position.y=-w/4,ct.add(_t);const Ut=Ze();Ut.name="knee",Ut.position.y=-w/2,ct.add(Ut);const ie=ze(T,w/2,T,t.limb);ie.position.y=-w/4,Ut.add(ie);const se=ze(T*1.15,.07,T*1.7,t.shoe);se.position.set(0,-w/2+.035,.045),Ut.add(se);const ve=new He;ve.name="footTip",ve.position.y=-w/2,Ut.add(ve);const De=Ze();return{root:ct,joint:Ut,hand:De,wrist:De,tip:ve,upperMesh:_t,lowerMesh:ie,segLen:w/2}},D=H=>{const ct=Ze();ct.name=H<0?"shoulderL":"shoulderR",ct.rotation.order="ZYX",ct.position.set(H*(M/2+T/2),b-.04,0),v.add(ct);const _t=ze(T,S/2,T,t.limb);_t.position.y=-S/4,ct.add(_t);const Ut=Ze();Ut.name="elbow",Ut.position.y=-S/2,ct.add(Ut);const ie=ze(T,S/2,T,t.limb);ie.position.y=-S/4,Ut.add(ie);const se=Ze();se.name=H<0?"handL":"handR",se.position.y=-S/2,Ut.add(se);const ve=ze(T*1.1,.09,T*1.1,t.head);ve.position.y=.045,se.add(ve);const De=Ze();return De.name=H<0?"wristL":"wristR",se.add(De),{root:ct,joint:Ut,hand:se,wrist:De,upperMesh:_t,lowerMesh:ie,segLen:S/2}},B=L(-1),U=L(1),z=D(-1),W=D(1),mt=[B,U].map(H=>({root:H.root,joint:H.joint,tip:H.tip,upperLen:w/2,lowerLen:w/2,bend:1})),at=Ze(),dt=Ze();at.name="mountR",dt.name="mountL",W.wrist.add(at),z.wrist.add(dt);const tt=$b(t),Z=Yb(t),pt=Zb(t),j={"sword-shield":{right:Po(.42,.075,t),left:Wb(t)},"dual-swords":{right:Po(.42,.075,t),left:Po(.42,.075,t)},greatsword:{right:Xb(t),left:ze(.12,.2,.12,t.wood)},staff:{right:tt.g,left:Ze(),orb:tt.orb},bow:{right:pt,left:Z.g,arrow:pt,drawString:Z.drawString}};for(const H of Object.keys(j))at.add(j[H].right),dt.add(j[H].left),j[H].right.visible=!1,j[H].left.visible=!1;function Mt(H,ct,_t){const Ut=new He;Ut.name="bladeBase",Ut.position.y=ct,H.add(Ut);const ie=new He;ie.name="bladeTip",ie.position.y=_t,H.add(ie)}Mt(j["sword-shield"].right,.44,.55),Mt(j["dual-swords"].right,.44,.55),Mt(j["dual-swords"].left,.44,.55),Mt(j.greatsword.right,.74,.88),Mt(j.staff.right,.78,.92);let $t=null,Bt=0,jt=0,ht=0,Dt=0,V=0,ue=0,Zt=gb(),Vt={...Jl},kt=0,Et=0,At=0,P=-1,E=0,Y=0,rt=0,lt=0,it=0,Rt=0,K=0,ft=1,It=0,et=0,gt=0,O=!1,st=0,ut=0,Gt=0,qt=0,zt="none",F=0,xt=1,J=!1,ot=-1,St=!1,bt=0,Kt=0,re=0,ce={...xl},ne=0,be=0,xe={active:!1,dist:0,gy:0,pitch:0,joint:0,grip:1},Ve=NaN,je=0,Me=0,ke=0,Ue=NaN,q=NaN,Ct=-1,Tt=null,Qt=null,Jt=0,le=1,ae={lx:0,ly:0,lz:0,rx:0,ry:0,rz:0},cn=null,Xe="R",A=0,X=0,nt=1,Q={speed:0,phase:0},$={lp:0,lr:0,rp:0,rr:0},wt=0,Pt=0,Yt=!0,Xt=0,Ft="none",Ht=0,Lt=0,oe=0,yt=.3,vt=0;function te(H){const ct=Math.PI/180,_t=a;let Ut=0,ie=0,se=0,ve=0;H==="sword-shield"?(Ut=_t.swordPitchDeg*ct,ie=-_t.swordYawDeg*ct,se=_t.shieldPitchDeg*ct):H==="dual-swords"?(Ut=_t.swordPitchDeg*ct,ie=-_t.swordYawDeg*ct,se=_t.swordPitchDeg*ct,ve=_t.swordYawDeg*ct):H==="greatsword"?(Ut=_t.greatswordPitchDeg*ct,ie=-_t.greatswordYawDeg*ct,se=_t.greatswordPitchDeg*ct,ve=_t.greatswordYawDeg*ct):H==="staff"?Ut=_t.staffPitchDeg*ct:se=_t.bowPitchDeg*ct,at.rotation.set(Ut,0,ie),dt.rotation.set(se,0,ve),at.position.x=H==="greatsword"?-Math.max(0,a.twoHandInsetX??0):0}function he(H){if(H!==$t){$t=H;for(const ct of Object.keys(j))j[ct].right.visible=ct===H,j[ct].left.visible=ct===H;te(H),Z.drawString.position.z=-.06,pt.position.z=0,tt.orb.scale.setScalar(1),v.rotation.y=0}}he("sword-shield");const Nt=[];p.traverse(H=>{H instanceof ge&&H.material instanceof Ca&&Nt.push(H.material)});const Ke=new ee(r.flashColor);function de(H,ct){const _t=Ff(H,ct,r);Zt=_t,v.rotation.x+=_t.upperPitch,v.rotation.z+=_t.upperRoll,v.rotation.y+=_t.upperYaw;const Ut=ye(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),ie=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;v.position.x+=ye(_t.upperShiftX*Ut,-ie,ie),v.position.z+=ye(_t.upperShiftZ*Ut,-ie,ie),x.position.x+=_t.comX,x.position.z+=_t.comZ-_t.pelvisBack,x.position.y-=_t.drop;const se=_t.legacy?0:ye(r.lowerScale,0,1);_.position.z+=_t.pelvisBack*(1-se),_.position.y+=_t.drop*(1-se),B.joint.rotation.x+=_t.knee,U.joint.rotation.x+=_t.knee,B.root.rotation.x-=_t.hip,U.root.rotation.x-=_t.hip,z.root.rotation.x+=_t.arm,W.root.rotation.x+=_t.arm*.8;for(const ve of Nt)ve.emissive.copy(Ke).multiplyScalar(_t.flash)}function Ae(H){return H<.22?-1:H<.5?-1+(H-.22)/.28*2:Math.max(0,1-(H-.5)/.5)}function Vn(H){for(const ct of[z,W])ct.upperMesh.scale.set(H.girthArm,H.arm,H.girthArm),ct.upperMesh.position.y=-ct.segLen/2*H.arm,ct.joint.position.y=-ct.segLen*H.arm,ct.lowerMesh.scale.set(H.girthArm,H.arm,H.girthArm),ct.lowerMesh.position.y=-ct.segLen/2*H.arm,ct.hand.position.y=-ct.segLen*H.arm;for(const ct of[B,U])ct.upperMesh.scale.set(H.girthLeg,H.leg,H.girthLeg),ct.upperMesh.position.y=-ct.segLen/2*H.leg,ct.joint.position.y=-ct.segLen*H.leg,ct.lowerMesh.scale.set(H.girthLeg,H.leg,H.girthLeg),ct.lowerMesh.position.y=-ct.segLen/2*H.leg,ct.tip.position.y=-ct.segLen*H.leg;C.scale.set(H.girthTorso,H.torso,H.girthTorso),C.position.y=b/2*H.torso}function We(H,ct){const _t=a.twoHandGripY??-.16,Ut=Math.max(1,a.twoHandMaxStretch??1.25),ie=S*Ut*.99,se=z.root.position.x,ve=z.root.position.y,De=z.root.position.z,Ie=rs=>{const or=at.localToWorld(new G(0,rs,0)),cs=v.worldToLocal(or),ln={x:cs.x-se,y:cs.y-ve,z:cs.z-De};return{t:ln,dist:Math.hypot(ln.x,ln.y,ln.z)}};let Je=_t,Re=Ie(Je);if(!Number.isFinite(Re.dist)||Re.dist<=di)return;for(let rs=0;rs<18&&Re.dist>ie;rs++)if(Je*=.78,Re=Ie(Je),!Number.isFinite(Re.dist)||Re.dist<=di)return;Number.isFinite(Ve)||(Ve=Je);const an=Math.max(0,a.twoHandSlideRate??9);Ve+=(Je-Ve)*(1-Math.exp(-an*ct));const pn=Ie(Ve),Zn=pn.t,qn=pn.dist,ai=qn/Math.max(di,S),Ii=ye(ai,1,Ut),js=Math.max(1,a.twoHandGripStart??1.02),ir=Math.max(js+.001,Ut),sr=ye(a.twoHandMinGrip??1,0,1),Ks=ye((ai-js)/(ir-js),0,1),Ia=1-Ks*Ks*(3-2*Ks)*(1-sr),vi=S/2*Ii,ar=zf(Zn,vi,vi,-1),Fi=Nf({rootPitch:z.root.rotation.x,rootRoll:z.root.rotation.z,jointPitch:z.joint.rotation.x},ar,ye(H*Ia,0,1),Math.PI);z.root.rotation.x=Fi.rootPitch,z.root.rotation.z=Fi.rootRoll,z.joint.rotation.x=Math.min(Fi.jointPitch,-.06);const Ui=1/Math.sqrt(Ii);z.upperMesh.scale.set(Ui,Ii,Ui),z.upperMesh.position.y=-vi/2,z.joint.position.y=-vi,z.lowerMesh.scale.set(Ui,Ii,Ui),z.lowerMesh.position.y=-vi/2,z.hand.position.y=-vi,xe={active:!0,dist:qn,gy:Ve,pitch:Fi.rootPitch,joint:z.joint.rotation.x,grip:Ia}}function Xn(H,ct){if(!u.enabled){je=0,Me=0,W.wrist.rotation.set(0,0,0),Ue=W.root.rotation.x,q=v.rotation.y;return}const _t=W.root.rotation.x,Ut=v.rotation.y;if(ct!==Ct){Ct=ct,Ue=_t,q=Ut,W.wrist.rotation.set(je,0,Me);return}if(!Number.isFinite(Ue)||H<=1e-5){Ue=_t,q=Ut,W.wrist.rotation.set(je,0,Me);return}const ie=(_t-Ue)/H,se=Oe(Ut-q)/H;Ue=_t,q=Ut;const ve=Math.max(0,u.maxAngle),De=Math.max(0,u.maxTwist),Ie=.15+.85*ye(A,0,1),Re=-ye(ke,0,1.4)*Math.max(0,u.runDrag),an=ye(-ie*u.lag*Ie+Re,-ve,ve),pn=ye(se*u.twistLag*Ie,-De,De),Zn=1-Math.exp(-Math.max(0,u.rate)*H);je+=(an-je)*Zn,Me+=(pn-Me)*Zn,W.wrist.rotation.set(je,0,Me)}function we(H){const ct=Math.PI/180;return H==="greatsword"?a.greatswordPitchDeg*ct:H==="staff"?a.staffPitchDeg*ct:H==="bow"?a.bowPitchDeg*ct:a.swordPitchDeg*ct}function un(H,ct){const _t=H.weapon;if(_t==="staff"||_t==="bow")return;const Ut=Xe==="R"?W:z,ie=Xe==="R"?at:dt,se=_t==="greatsword"&&Xe==="R"?ue:0,ve=cn;if(ve===null){ie.rotation.x=we(_t)+se;return}const De=ct+Ut.root.rotation.x+Ut.joint.rotation.x;ie.rotation.x=Math.PI/2-ve-De}function Wn(H){cn=H.bladePitch,Xe=H.lead,v.rotation.y+=H.yaw,v.rotation.x+=H.pitch,v.rotation.z+=H.roll,x.position.z+=H.pelvisZ,x.position.x+=H.pelvisX,H.armR&&(W.root.rotation.x=H.armR.pitch,W.root.rotation.y=H.armR.yaw,W.root.rotation.z=H.armR.roll,W.joint.rotation.x=H.armR.elbow),H.armL&&(z.root.rotation.x=H.armL.pitch,z.root.rotation.y=H.armL.yaw,z.root.rotation.z=H.armL.roll,z.joint.rotation.x=H.armL.elbow)}function fn(H,ct){const _t=Hb(H.weapon,H.comboIndex,Ae(H.attackProgress),g);H.comboIndex!==Jt&&(Qt=Tt,le=0,Jt=H.comboIndex);const Ut=Math.max(.008,g.segBlend);le=Math.min(1,le+ct/Ut);const ie=Qt&&le<1?Gb(Qt,_t,Vb(le)):_t;return Tt=ie,ie}function $n(H,ct){const _t=M/2+T/2,Ut=b-.04;if(!g.enabled){z.root.position.set(-_t,Ut,0),W.root.position.set(_t,Ut,0),ae={lx:-_t,ly:Ut,lz:0,rx:_t,ry:Ut,rz:0};return}const ie=Math.max(0,g.shoulderLift),se=Math.max(0,g.shoulderPush),ve=H&&ct==="greatsword"?Math.max(0,g.shoulderIn):0,De=ai=>ie*ye((-ai-.5)/1.45,0,1),Ie=ai=>se*ye((-ai-.2)/1.9,0,1),Je=-_t+ve,Re=Ut+De(z.root.rotation.x),an=Ie(z.root.rotation.x),pn=_t-ve,Zn=Ut+De(W.root.rotation.x),qn=Ie(W.root.rotation.x);z.root.position.set(Je,Re,an),W.root.position.set(pn,Zn,qn),ae={lx:Je,ly:Re,lz:an,rx:pn,ry:Zn,rz:qn}}function Yn(H){if(H.phase==="idle"||H.charging)return;const ct=H.attackProgress,_t=Ae(ct),Ut=Math.max(0,_t),ie=H.comboIndex%2===0?1:-1,se=l.stride,ve=Number.isFinite(se.stepReach)?se.stepReach:.17,De=Number.isFinite(se.stepSideReach)?se.stepSideReach:.14,Ie=Number.isFinite(se.stepDipReach)?se.stepDipReach:.05,Je=H.weapon==="greatsword"?ye(Number.isFinite(se.heavyScale)?se.heavyScale:1,0,1):1;x.position.z+=ve*Ut*Je,x.position.x+=ie*De*Ut*Je,x.position.y-=Ie*Math.sin(Math.PI*ct)*Je}function ka(H,ct){if(Z.drawString.position.z=-.06,pt.position.z=0,tt.orb.scale.setScalar(1),v.rotation.y=0,H.charging&&H.weapon==="bow"){const se=H.charge;z.root.rotation.x=-1.25,z.joint.rotation.x=-.15,W.root.rotation.x=.35+se*.3,W.joint.rotation.x=-1.15,Z.drawString.position.z=-.06-se*.22,pt.position.z=-se*.3,v.rotation.y=-.22;return}if(H.phase==="idle"){Qt=null,Tt=null,Jt=0,le=1,cn=null,Ve=NaN,H.weapon==="greatsword"&&(at.position.x=-Math.max(0,a.twoHandInsetX??0));return}const _t=Ae(H.attackProgress),Ut=Math.max(0,-_t),ie=Math.max(0,_t);if(H.weapon==="bow")z.root.rotation.x=-1.2,z.joint.rotation.x=-.15,W.root.rotation.x=.9-ie*.8,W.joint.rotation.x=-.3;else if(H.weapon==="greatsword")if(g.enabled)Wn(fn(H,ct));else{const se=-1.6*Ut+1.25*ie,ve=ye(Number.isFinite(l.stride.heavyScale)?l.stride.heavyScale:1,0,1);W.root.rotation.x=se,W.joint.rotation.x=-(.25+Ut*.4),z.root.rotation.x=se+.06,z.joint.rotation.x=-(.32+Ut*.4),z.root.rotation.z=.42,W.root.rotation.z=0;const De=-Math.sin(W.root.rotation.x);W.root.rotation.y=-.72*Math.tanh(De*4),v.rotation.y=-.2*_t*ve}else if(g.enabled)Wn(fn(H,ct));else{const se=H.comboIndex;if(se===1)W.root.rotation.x=-1.7*Ut+1.1*ie,W.joint.rotation.x=-(.2+Ut*.5),z.root.rotation.x=.1,v.rotation.y=-.18*_t;else if(se===2)z.root.rotation.x=-1.5*Ut+1*ie,z.joint.rotation.x=-(.2+Ut*.5),W.root.rotation.x=.2,v.rotation.y=.45*-_t;else{const ve=-1.9*Ut+1.2*ie;z.root.rotation.x=ve,W.root.rotation.x=ve,z.joint.rotation.x=-(.15+Ut*.4),W.joint.rotation.x=-(.15+Ut*.4),v.rotation.y=-.3*_t}}if(H.weapon==="greatsword"){const se=ye((-W.root.rotation.x-1.3)/1.2,0,1);at.position.x=-Math.max(0,a.twoHandInsetX??0)*(1-se)}Yn(H)}function Xf(H,ct){H&&(W.root.rotation.x=-1.05,W.joint.rotation.x=-.35,z.root.rotation.x=-.45,z.joint.rotation.x=-.2,v.rotation.y=-.12,tt.orb.scale.setScalar(1.25+.12*Math.sin(ct*2)))}function Wf(H){if(!H||H.phase==="idle")return;const ct=H.progress,_t=ct<.3?-.35+ct/.3*1.35:ct<.7?1:Math.max(0,1-(ct-.7)/.3),Ut=Math.PI/180;v.rotation.x+=m.leanDeg*Ut*_t,z.root.rotation.x-=m.shieldPitchDeg*Ut*_t,z.joint.rotation.x-=.22*_t,W.root.rotation.x-=.3*_t,x.position.z+=m.pelvisReach*Math.max(0,_t)}return{group:p,update(H,ct,_t,Ut,ie=!1,se,ve,De){he(ct.weapon),v.rotation.x=0,v.rotation.z=0,x.position.x=0,x.position.y=w,x.position.z=0,x.rotation.z=0,x.rotation.x=0,v.position.x=0,v.position.y=0,v.position.z=0,_.position.x=0,_.position.y=0,_.position.z=0,_.rotation.z=0;const Ie=Math.max(1/240,Math.min(Ut,.1)),Je=se===void 0?wt+=Ut:se;Pt=Je;const Re=l.landing;Re.enabled?Yt&&!H.grounded?(Ft="jump",Ht=Je,Lt=Re.anticipationDuration,oe=Math.max(0,Re.jumpAnticipation),yt=.32):!Yt&&H.grounded&&(Ft="land",Ht=Je,Lt=Re.duration,oe=mb(Xt,Re),yt=Re.compressRatio,vt=Xt):(Ft="none",oe=0),Je<Ht&&(Ft="none",oe=0),Yt=H.grounded,Xt=H.velocity.y;const an=nu(Je,Ht,Lt,oe,yt),pn=ct.phase!=="idle",Zn=(De==null?void 0:De.phase)==="active";A=ub(A,pn,Ie,l.attack.blendRate);const qn=fb(A,l.attack.gaitWeight,l.attack.lowerBodyWeight);X=qn.attackLegWeight,nt=qn.gaitScale;const ai=Math.sin(H.bodyYaw),Ii=Math.cos(H.bodyYaw),js=(H.velocity.x-Bt)/Ie,ir=(H.velocity.z-jt)/Ie,sr=ye(js,-60,60),Ks=ye(ir,-60,60),Ia=sr*ai+Ks*Ii,vi=Oe(H.bodyYaw-ht)/Ie,ar=Math.hypot(H.velocity.x,H.velocity.z),Fi=o.maxForwardDeg*Math.PI/180,Ui=o.maxSideDeg*Math.PI/180,rs=ye(Ia*o.accelGain,-Fi,Fi),or=ye(-vi*ar*o.turnGain,-Ui,Ui),cs=1-Math.exp(-o.smoothing*Ie);Dt+=(rs-Dt)*cs,V+=(or-V)*cs,Bt=H.velocity.x,jt=H.velocity.z,ht=H.bodyYaw;const ln=Math.hypot(H.velocity.x,H.velocity.z),rr=ye(s.knockGaitScale??0,0,1),$f=_t.knockX*rr,Yf=_t.knockZ*rr,Zf=rr>0&&Math.hypot(_t.knockX,_t.knockZ)>.001,cr=H.velocity.x+$f,lr=H.velocity.z+Yf,eh=Math.hypot(cr,lr);qt=eh;const qf=Math.cos(H.bodyYaw),jf=-Math.sin(H.bodyYaw),Kf=H.velocity.x*qf+H.velocity.z*jf,nh=ln>di?ye(Kf/ln,-1,1):0,ih=ln>di?ye((H.velocity.x*ai+H.velocity.z*Ii)/ln,-1,1):1,Jf=jl(ih,s.backStrafeStartDeg,s.backStrafeFullDeg);zt==="settled"&&St&&bt>Kt*1.02+1e-4&&(zt="none");let Js=1;zt==="blend"?(Js=Lf(J?ot:F,s.stopYawBlendMode,J),J||(F=Math.min(1,F+Ie/Math.max(.01,s.stopYawAfterSec)),(F>=1||s.stopYawBlendMode==="inStop"||St)&&(zt="settled",Js=0))):zt==="settled"&&(Js=ye(ln/Math.max(di,s.stopEnterRatio*e),0,1)),xt=Js;const Qf=Tf(nh,i.legYawScale,i.hipYawMaxDeg,s.strafeHipBoost),tp=Af(ih,nh,Qf,Jf)*Js;Et+=(tp-Et)*(1-Math.exp(-i.hipYawSmoothing*Ie));const Qs=H.bodyYaw+Et;At=Qs;const ep=Math.sin(Qs),np=Math.cos(Qs),ip=Math.cos(Qs),sp=-Math.sin(Qs),Fa={speed:eh,phase:H.gaitPhase,localForward:cr*ep+lr*np,localRight:cr*ip+lr*sp,stride:H.stride};pn&&!O&&(gt=H.gaitPhase),O=pn;const ls=A>0?hb(Fa,ct.attackProgress,ct.comboIndex,A,l.stride,gt):Fa;Q=ls;const sh=Math.max(0,s.stopBlendSec||0),ah=sh>0&&!pn&&!Zf&&H.grounded,hr=Rf(ln,It,e,s.stopEnterRatio,s.stopExitRatio);if(!ah||hr.resume)P=-1;else if(P<0&&hr.enter){P=0,E=H.gaitPhase,Y=wf(H.gaitPhase),rt=ln,lt=Math.max(H.stride,di),it=Fa.localForward,Rt=Fa.localRight;const Ce=1/Math.max(di,ln);K=H.velocity.x*Ce,ft=H.velocity.z*Ce}const ap=It;It=ln;const zi=ah&&P>=0;zi&&(P=Math.min(1,P+Ie/sh)),zi&&zt!=="blend"&&(zt="blend",F=0),J=zi&&P<1,ot=P,St=hr.resume,bt=ln,Kt=ap;const oh=zi?{phase:E,speed:rt,moveSpeed:e,localForward:it,localRight:Rt,legLength:n.legLength,stride:lt,grounded:!0}:{phase:ls.phase,speed:ls.speed,moveSpeed:e,localForward:ls.localForward,localRight:ls.localRight,legLength:n.legLength,stride:ls.stride??0,grounded:H.grounded},op=zi?Ef(oh,s,{progress:P,phase0:E,phaseEnd:Y}):Kl(oh,s),Se=pb(op,qn.gaitScale);if(re=0,Zn&&De){const Ce=rb(De.progress,De.dir,s),me=qn.gaitScale;Se.legL.pitchX+=Ce.legL.pitchX*me,Se.legL.rollZ+=Ce.legL.rollZ*me,Se.legL.kneeX+=Ce.legL.kneeX*me,Se.legR.pitchX+=Ce.legR.pitchX*me,Se.legR.rollZ+=Ce.legR.rollZ*me,Se.legR.kneeX+=Ce.legR.kneeX*me,Se.pelvisY+=Ce.pelvisY*me,re=Ce.env}let dr=0,ur=0,fr=0,rh=0;if(zi){const Ce=Pf(H.bodyYaw,K,ft),me=Df(P,E,Ce.forward,Ce.right,s);me.leadLeft?(Se.legL.pitchX-=me.leadPitch,Se.legL.kneeX+=me.leadKnee,Se.legR.pitchX+=me.trailPitch):(Se.legR.pitchX-=me.leadPitch,Se.legR.kneeX+=me.leadKnee,Se.legL.pitchX+=me.trailPitch),ur=me.bodyShift*me.fwdN,dr=me.bodyShift*me.rightN,fr=me.bodyDip,rh=me.chestPitch,st=me.leadPitch,ut=me.bodyShift,Gt=me.bodyDip}else st=0,ut=0,Gt=0;$={lp:Se.legL.pitchX,lr:Se.legL.rollZ,rp:Se.legR.pitchX,rr:Se.legR.rollZ},H.grounded?(B.root.rotation.x=Se.legL.pitchX,U.root.rotation.x=Se.legR.pitchX,B.root.rotation.z=Se.legL.rollZ,U.root.rotation.z=Se.legR.rollZ,B.joint.rotation.x=Se.legL.kneeX,U.joint.rotation.x=Se.legR.kneeX,z.root.rotation.x=Se.armL,W.root.rotation.x=Se.armR,z.joint.rotation.x=-(.18+Se.armL*.2),W.joint.rotation.x=-(.18+Se.armR*.2),z.root.rotation.z=0,W.root.rotation.z=0,z.root.rotation.y=0,W.root.rotation.y=0,x.position.x=Se.pelvisX,x.position.y=w+Se.pelvisY,x.position.z=0,x.rotation.z=Se.pelvisRoll):(B.root.rotation.x=-.55,U.root.rotation.x=-.25,B.joint.rotation.x=.75,U.joint.rotation.x=.55,z.root.rotation.x=-.9,W.root.rotation.x=-.7,z.joint.rotation.x=-.6,W.joint.rotation.x=-.6,B.root.rotation.z=0,U.root.rotation.z=0);const rp=Of(x,_),ta=Zn?{...d,weight:0}:zi&&d.enabled?{...d,weight:1}:d,ch=ta.enabled&&H.grounded&&ta.weight>0?ye(ta.weight,0,1)*(pn?ye(ta.attackScale,0,1):1):0;x.position.x+=dr,x.position.z+=ur,x.position.y-=fr,_.position.y+=fr,ch<=0&&(_.position.x-=dr,_.position.z-=ur);const pr=ln/Math.max(e,di);ke=pr;const cp=Number.isFinite(o.crouchSmoothing)?o.crouchSmoothing:8,lp=1-Math.exp(-Math.max(0,cp)*Ie);kt+=(ye(pr,0,1)-kt)*lp;const hs=Uf({leanForward:Dt,leanSide:V,speedRatio:kt},o);x.rotation.x+=hs.pelvisPitch,x.rotation.z+=hs.pelvisRoll,x.position.x+=hs.pelvisX,x.position.z+=hs.pelvisZ,x.position.y-=hs.crouch,_.position.y+=hs.crouch*(1-ye(ch,0,1)),ka(ct,Ie),Xf(ie,H.gaitPhase),Wf(ve);const hp=ct.weapon==="greatsword",lh=Math.hypot(H.velocity.x,H.velocity.z),dp=hp&&ct.phase==="idle"&&lh>.5?Math.min(1.15,lh/Math.max(e,.001)*.9):0;ue+=(dp-ue)*(1-Math.exp(-6*Ie));const up=v.rotation.x;ct.weapon==="bow"&&(Z.g.rotation.x=-(z.root.rotation.x+z.joint.rotation.x),pt.rotation.x=-(W.root.rotation.x+W.joint.rotation.x));const fp=v.rotation.y;de(_t,H.bodyYaw);const hh=_t.type==="none"?1:.4;if(v.rotation.x+=Dt*hh+rh,v.rotation.z+=(V+Se.sideLean)*hh,an>0&&(B.root.rotation.x-=Re.hipPitch*an,U.root.rotation.x-=Re.hipPitch*an,B.joint.rotation.x+=Re.kneeBend*an,U.joint.rotation.x+=Re.kneeBend*an,x.position.y-=Re.crouchDepth*an,_.position.y+=Re.crouchDepth*(1-Re.lowerScale)*an,v.rotation.x+=Re.upperPitch*an,z.root.rotation.x-=Re.armTuck*an,W.root.rotation.x-=Re.armTuck*an),X>0&&H.grounded){const Ce=db(ct.attackProgress,ct.comboIndex,l.stride),me=X;B.root.rotation.x+=Ce.legL.pitchX*me,U.root.rotation.x+=Ce.legR.pitchX*me,B.root.rotation.z+=Ce.legL.rollZ*me,U.root.rotation.z+=Ce.legR.rollZ*me,B.joint.rotation.x+=Ce.legL.kneeX*me,U.joint.rotation.x+=Ce.legR.kneeX*me,x.position.x+=Ce.pelvisX*me,x.position.y+=Ce.pelvisY*me,x.rotation.z+=Ce.pelvisRoll*me}if($n(pn,ct.weapon),y.enabled){const Ce=ct.phase!=="idle"&&!ct.charging,me=Ce?Ae(ct.attackProgress):0;Ce&&be>.55&&me<be-1e-4&&(ne=1),be=me,ne=zb(ne,Ie,y.impactDecay);const mp=Fb({swing:me,charge:ct.charging?ct.charge:0,impact:ne,speedRatio:pr,grounded:H.grounded},y);ce=Ub(ce,mp,Ie,y.smoothing)}else ce={...xl};Vn(ce),_.rotation.y=Et,et=Cf(Et,s.chestYawScale,s.chestYawMaxDeg),v.rotation.y+=et;const pp=fp;I.rotation.y=Oe(H.headYaw-H.bodyYaw-pp-et),I.rotation.x=-ye(H.headPitch??0,-.7,.7),v.rotation.x+=-ye(H.bodyPitch??0,-.4,.4),Xn(Ut,ct.comboIndex),un(ct,up),ct.weapon==="greatsword"&&ct.phase!=="idle"&&!ct.charging&&(p.updateWorldMatrix(!0,!0),We(ye(Math.max(.65,A),0,1),Ie)),Vt=Bf({root:p,pelvis:x,lower:_,limbs:mt,base:rp,cfg:ta,grounded:H.grounded,attacking:pn})},lean(){return{forward:Dt,side:V}},landing(){const H=nu(Pt,Ht,Lt,oe,yt),ct=Lt>0?Math.max(0,Lt-Math.max(0,Pt-Ht)):0;return{pulse:H,remaining:ct,kind:H>0?Ft:"none",impactVy:vt}},hurt(){return Zt},ik(){return Vt},stretch(){return{...ce,impact:ne}},gripDebug(){return{...xe}},weaponDebug(){return{wristPitch:je,wristTwist:Me}},swingDebug(){const H=Tt;return{seg:Jt,kind:(H==null?void 0:H.kind)??"right-left",yaw:(H==null?void 0:H.yaw)??0,pitch:(H==null?void 0:H.pitch)??0,roll:(H==null?void 0:H.roll)??0,strike:(H==null?void 0:H.strike)??0,shoulderL:{x:ae.lx,y:ae.ly,z:ae.lz},shoulderR:{x:ae.rx,y:ae.ry,z:ae.rz}}},attackBlend(){return A},attackWeights(){return{gaitScale:nt,attackLegWeight:X,driveSpeed:Q.speed,stridePhase:Q.phase}},hipYaw(){return Et},gaitDebug(){return{stopT:P,hipYaw:Et,chestYaw:et,speed:It,gaitSpeed:qt,stopStep:st,stopShift:ut,stopDip:Gt,stopYawFade:xt,turnStep:re,legLPitch:$.lp,legLRoll:$.lr,legRPitch:$.rp,legRRoll:$.rr}},gaitYaw(){return At},arrowDirection(){pt.updateWorldMatrix(!0,!1);const H=pt.matrixWorld.elements,ct=H[8],_t=H[9],Ut=H[10],ie=Math.hypot(ct,_t,Ut)||1;return{x:ct/ie,y:_t/ie,z:Ut/ie}},weaponBlade(){if(!$t)return null;const H=j[$t].right,ct=H.getObjectByName("bladeBase"),_t=H.getObjectByName("bladeTip");if(!ct||!_t)return null;ct.updateWorldMatrix(!0,!1),_t.updateWorldMatrix(!0,!1);const Ut=ct.getWorldPosition(new G),ie=_t.getWorldPosition(new G);return{base:{x:Ut.x,y:Ut.y,z:Ut.z},tip:{x:ie.x,y:ie.y,z:ie.z}}},dispose(){p.traverse(H=>{if(H instanceof ge){H.geometry.dispose();const ct=H.material;Array.isArray(ct)?ct.forEach(_t=>_t.dispose()):ct.dispose()}})}}}function jb(n){const t=Math.max(2,Math.floor(n.maxSamples)),e=new qe,i=new Float32Array(t*2*3),s=new Float32Array(t*2*3),a=new rn(i,3),o=new rn(s,3);a.setUsage(Vh),o.setUsage(Vh),e.setAttribute("position",a),e.setAttribute("color",o);const r=[];for(let x=0;x<t-1;x++){const _=x*2,v=_+1,R=_+2,w=_+3;r.push(_,v,R,v,w,R)}e.setIndex(r),e.setDrawRange(0,0);const l=new Qe({vertexColors:!0,transparent:!0,opacity:1,blending:Ei,depthWrite:!1,side:Ne}),c=new ge(e,l);c.frustumCulled=!1,c.renderOrder=6,c.visible=!1;const h=new ee(n.color);let f=[],d=null,u=0,m=0,y=!1,g=!1;function p(){const x=f.length;if(x<2||!n.enabled){c.visible=!1,e.setDrawRange(0,0);return}const _=Math.max(.001,n.life);for(let v=0;v<x;v++){const R=f[v],w=Math.max(0,1-R.age/_),S=w*w,T=Math.min(1,R.speed/Math.max(.001,n.minSpeed*2)),b=n.intensity*S*(.55+.45*T),M=.18+.82*w,C=v*6;i[C]=R.tx+(R.bx-R.tx)*M,i[C+1]=R.ty+(R.by-R.ty)*M,i[C+2]=R.tz+(R.bz-R.tz)*M,i[C+3]=R.tx,i[C+4]=R.ty,i[C+5]=R.tz;const I=h.r*b,k=h.g*b,N=h.b*b,L=I*.22,D=k*.22,B=N*.22;s[C]=L,s[C+1]=D,s[C+2]=B;const U=1+n.tipBoost;s[C+3]=Math.min(1,I*U),s[C+4]=Math.min(1,k*U),s[C+5]=Math.min(1,N*U)}a.needsUpdate=!0,o.needsUpdate=!0,e.setDrawRange(0,(x-1)*6),c.visible=!0}return{object:c,update(x,_,v){if(!n.enabled){c.visible=!1;return}const R=Math.max(0,x);for(const w of f)w.age+=R;for(;f.length>0&&f[0].age>n.life;)f.shift();if(_){const w=d?Math.hypot(_.tip.x-d.x,_.tip.y-d.y,_.tip.z-d.z)/Math.max(1e-4,R):0,S=f[f.length-1],T=S?Math.hypot(_.tip.x-S.tx,_.tip.y-S.ty,_.tip.z-S.tz):1/0;if(v&&T>=n.minStep)for(f.push({bx:_.base.x,by:_.base.y,bz:_.base.z,tx:_.tip.x,ty:_.tip.y,tz:_.tip.z,age:0,speed:w});f.length>t;)f.shift();d={x:_.tip.x,y:_.tip.y,z:_.tip.z},u=w,m=T,y=!0}else d=null,y=!1,u=0,m=0;g=v,p()},debug(){return{count:f.length,visible:c.visible,speed:u,moved:m,hasBlade:y,active:g}},reset(){f=[],d=null,c.visible=!1,e.setDrawRange(0,0)},dispose(){e.dispose(),l.dispose()}}}function Kb(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function Jb(n,t,e,i){const s=Math.max(1,n.clientWidth),a=Math.max(1,n.clientHeight),o=new gS({antialias:!0});o.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),o.shadowMap.enabled=!0,o.shadowMap.type=Iu,o.setSize(s,a,!1),n.appendChild(o.domElement);const r=new xS;r.background=new ee("#12161d"),r.add(new JS(11061486,2764600,1.15));const l=new eb(16773852,1.5);l.position.set(9,18,11),l.castShadow=!0,l.shadow.mapSize.set(1024,1024);const c=l.shadow.camera;c.left=-20,c.right=20,c.top=20,c.bottom=-20,c.near=1,c.far=60,r.add(l);const h=[],f=new Le;for(const q of t.boxes){const Ct=q.maxX-q.minX,Tt=q.maxY-q.minY,Qt=q.maxZ-q.minZ;let Jt=Kb(q.kind,e);q.kind==="step"&&(Jt=new ee(Jt).offsetHSL(0,0,q.maxY*.09).getStyle());const le=new Ca({color:Jt,transparent:!0,opacity:1}),ae=new ge(new Gn(Ct,Tt,Qt),le);ae.position.set((q.minX+q.maxX)/2,(q.minY+q.maxY)/2,(q.minZ+q.maxZ)/2),ae.castShadow=q.kind!=="ground",ae.receiveShadow=!0,ae.add(new uf(new kS(ae.geometry),new Gl({color:10467020,transparent:!0,opacity:.32}))),f.add(ae),h.push(le)}r.add(f);const d=t.gridMeta.maxX-t.gridMeta.minX,u=new ib(d,d,4873328,3358797);u.position.y=.002,u.visible=e.showGrid,r.add(u);const m=Mb(i,e);r.add(m.group);const y=qb(e.voxel,e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links,e.weaponWrist),g=jb(e.weaponTrail);r.add(g.object);const p=new Le,x=.9,_=new Le;_.position.y=x,y.group.position.y=-x,_.add(y.group),p.add(_),r.add(p);const v=t.dummies.map((q,Ct)=>{const Tt=e.dummies.colors,Qt=Tt[Ct%Tt.length]??"#cccccc",Jt=yb(e.voxel,e.colors,Qt,q.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);return Jt.group.traverse(le=>{le.userData.dummyId=q.id}),r.add(Jt.group),Jt}),R=v.map(q=>q.group),w=new nb,S=e.groundRing,T=e.voxel.bodyWidth,b=su(T,S.playerRadiusFactor),M=su(T,S.dummyRadiusFactor),C=T*S.thicknessFactor,I=S.arcDeg*Math.PI/180;let k=0;const N=cc({radius:b,thickness:C,arcRad:I,edgeFade:S.edgeFade,color:S.playerColor,opacity:S.playerOpacity,y:.028,renderOrder:6});N.mesh.name="player-ground-ring",r.add(N.mesh);const L=t.dummies.map(q=>{const Ct=cc({radius:M,thickness:C,arcRad:I,edgeFade:S.edgeFade,color:S.neutralColor,opacity:S.opacity,y:.022,renderOrder:5});return Ct.mesh.name=`dummy-ground-ring-${q.id}`,r.add(Ct.mesh),Ct}),D=t.dummies.map(q=>{const Ct=cc({radius:M*S.haloRadiusFactor,thickness:C*S.haloThicknessFactor,arcRad:I,edgeFade:S.edgeFade,color:S.neutralColor,opacity:0,profile:"glow",y:.019,renderOrder:4});return Ct.mesh.name=`dummy-ground-halo-${q.id}`,r.add(Ct.mesh),Ct}),B=t.dummies.map(()=>0),U=t.dummies.map(()=>0),z=au({radius:b*S.meterRadiusFactor,thickness:C*S.meterThicknessFactor,arcRad:I,edgeFade:.06,color:S.meterColorCharge,y:.03,renderOrder:8});z.mesh.name="player-ground-meter",r.add(z.mesh);const W=t.dummies.map(q=>{const Ct=au({radius:M*S.warnRadiusFactor,thickness:C*S.warnThicknessFactor,arcRad:I,edgeFade:.02,color:S.warnColor,y:.031,renderOrder:9});return Ct.mesh.name=`dummy-ground-warn-${q.id}`,r.add(Ct.mesh),Ct}),mt=ou({color:S.playerColor,y:.042,renderOrder:3});mt.group.name="player-landing-preview",r.add(mt.group);const at=new ee,dt=new ee(S.playerColor),tt=new ee(S.neutralColor),Z=new ee(S.lowThreatColor),pt=new ee(S.highThreatColor),j=new ee(S.meterColorCharge),Mt=new ee(S.meterColorChannel),$t=new ee(S.meterColorCooldown),Bt=new ee(S.warnColor),jt=new Le;r.add(jt);const ht=e.projectiles;function Dt(){const Ct=document.createElement("canvas");Ct.width=64,Ct.height=64;const Tt=Ct.getContext("2d");if(Tt){const Jt=Tt.createRadialGradient(32,32,0,32,32,32);Jt.addColorStop(0,"rgba(255,255,255,1)"),Jt.addColorStop(.28,"rgba(255,255,255,0.72)"),Jt.addColorStop(.62,"rgba(255,255,255,0.22)"),Jt.addColorStop(1,"rgba(255,255,255,0)"),Tt.fillStyle=Jt,Tt.fillRect(0,0,64,64)}const Qt=new fl(Ct);return Qt.colorSpace=xn,Qt}function V(){const Tt=document.createElement("canvas");Tt.width=2,Tt.height=64;const Qt=Tt.getContext("2d");if(Qt){const le=Qt.createLinearGradient(0,0,0,64);le.addColorStop(0,"rgba(255,255,255,0)"),le.addColorStop(.55,"rgba(255,255,255,0.35)"),le.addColorStop(1,"rgba(255,255,255,0.95)"),Qt.fillStyle=le,Qt.fillRect(0,0,2,64)}const Jt=new fl(Tt);return Jt.colorSpace=xn,Jt}const ue=Dt(),Zt=V(),Vt=new Qe({color:12577023,transparent:!0,opacity:0,side:Ne,depthWrite:!1}),kt=new Qe({color:14217983,transparent:!0,opacity:0,side:Ne,depthWrite:!1,blending:Ei}),Et=new Le;Et.position.set(0,.95,.72),jt.add(Et);const At=new Le;At.rotation.x=Db(e.camera.pitchDeg),Et.add(At);const P=new nr(.78,ht.slashThickness,6,28,Math.PI*1.15),E=new Le,Y=new ge(P,Vt),rt=new ge(P,kt);rt.scale.setScalar(1.09),rt.renderOrder=4,E.add(Y,rt),At.add(E);const lt=new Gn(ht.arrowWidth,ht.arrowWidth,ht.arrowLength),it=new $l(ht.arrowHeadSize*.42,ht.arrowHeadSize,4);it.rotateX(Math.PI/2);const Rt=new Gn(ht.arrowWidth*2.6,ht.arrowWidth*.4,.1),K=new wa(ht.arrowWidth*.45,ht.arrowWidth*1.3,ht.trailLength,6,1,!0);K.rotateX(-Math.PI/2),K.translate(0,0,-ht.trailLength/2);const ft=Array.from({length:10},()=>{const q=new Le,Ct=new Qe({color:ht.arrowColor,transparent:!0}),Tt=new Qe({color:ht.arrowHeadColor,transparent:!0}),Qt=new ul({map:ue,color:ht.arrowColor,transparent:!0,opacity:.85,blending:Ei,depthWrite:!1}),Jt=new Qe({color:ht.arrowTrailColor,map:Zt,transparent:!0,opacity:0,blending:Ei,depthWrite:!1,side:Ne}),le=new ge(lt,Ct),ae=new ge(it,Tt);ae.position.z=ht.arrowLength/2+ht.arrowHeadSize*.42;const cn=new ge(Rt,Tt),Xe=new ge(Rt,Tt);cn.position.z=-ht.arrowLength/2+.08,Xe.position.z=cn.position.z,Xe.rotation.z=Math.PI/2;const A=new Bd(Qt);A.scale.setScalar(ht.arrowGlowSize),A.renderOrder=6;const X=new ge(K,Jt);return X.renderOrder=5,q.add(le,ae,cn,Xe,A,X),q.visible=!1,r.add(q),{group:q,shaftMat:Ct,tipMat:Tt,glowMat:Qt,trailMat:Jt,glow:A,trail:X,arrowId:0,bone:null}}),It=new Zl(1,0),et=new G(ht.boltShapeX,ht.boltShapeY,ht.boltShapeZ),gt=new Qe({color:ht.boltColor,transparent:!0,opacity:.98,depthWrite:!1}),O=new ul({map:ue,color:ht.boltGlowColor,transparent:!0,opacity:.45,blending:Ei,depthWrite:!1}),st=new Qe({color:ht.boltGlowColor,map:Zt,transparent:!0,opacity:ht.trailOpacity,blending:Ei,depthWrite:!1,side:Ne}),ut=new wa(.5,.03,ht.boltTrailScale,6,1,!0);ut.rotateX(-Math.PI/2),ut.translate(0,0,-ht.boltTrailScale/2);const Gt=Array.from({length:24},()=>{const q=new Le,Ct=new ge(It,gt);Ct.scale.copy(et);const Tt=new Bd(O);Tt.scale.setScalar(ht.boltGlowScale),Tt.renderOrder=6;const Qt=new ge(ut,st);return Qt.renderOrder=5,q.add(Ct,Tt,Qt),q.visible=!1,r.add(q),{group:q,core:Ct}}),qt=Array.from({length:6},()=>{const q=ou({color:"#9ad0ff",edgeWidthRatio:.038,y:.045,renderOrder:2});return q.group.visible=!1,r.add(q.group),q}),zt=e.dash,F=new Ra(zt.ringRadius-.06,zt.ringRadius,28),xt=Array.from({length:6},()=>{const q=new Qe({color:16777215,transparent:!0,opacity:0,side:Ne,depthWrite:!1}),Ct=new ge(F,q);return Ct.rotation.x=-Math.PI/2,Ct.visible=!1,r.add(Ct),{mesh:Ct,mat:q,life:0,base:1}});function J(q,Ct,Tt,Qt,Jt){const le=xt.find(ae=>ae.life<=0)??xt[0];le.mat.color.set(Qt),le.mesh.position.set(q,Tt+.04,Ct),le.base=Jt,le.mesh.scale.setScalar(Jt*.6),le.mesh.visible=!0,le.mat.opacity=.9,le.life=zt.fxDuration}const ot=e.links,St=new Ra(ot.ringRadius-.07,ot.ringRadius,28),bt=Array.from({length:5},()=>{const q=new Qe({color:ot.chargeColor,transparent:!0,opacity:0,side:Ne,depthWrite:!1}),Ct=new ge(St,q);return Ct.rotation.x=-Math.PI/2,Ct.visible=!1,r.add(Ct),{mesh:Ct,mat:q,life:0,base:1}});function Kt(q,Ct,Tt,Qt){const Jt=bt.find(le=>le.life<=0)??bt[0];Jt.mesh.position.set(q,Tt+.05,Ct),Jt.base=Qt,Jt.mesh.scale.setScalar(Qt*.55),Jt.mesh.visible=!0,Jt.mat.opacity=.85,Jt.life=ot.fxDuration}let re=t.playerLink.id,ce=t.playerLink.hitIds.length,ne=t.dash.id,be="none";const xe=ab(e.camera,e.smartCamera,e.zoom,s/a),Ve=t.character.position;xe.update(Ve.x,Ve.y,Ve.z,1,t.camera);function je(q,Ct){if(R.length===0)return 0;const Tt=o.domElement.getBoundingClientRect(),Qt=new Wt((q-Tt.left)/Tt.width*2-1,-((Ct-Tt.top)/Tt.height)*2+1);w.setFromCamera(Qt,xe.camera);const Jt=w.intersectObjects(R,!0);for(const le of Jt){const ae=le.object.userData.dummyId;if(ae&&ae>0)return ae}return 0}function Me(q,Ct,Tt){const Qt=o.domElement.getBoundingClientRect(),Jt=new G(q,Ct,Tt).project(xe.camera);return{x:Qt.left+(Jt.x*.5+.5)*Qt.width,y:Qt.top+(-Jt.y*.5+.5)*Qt.height}}let ke=0,Ue=0;return{gaitDebug(){return y.gaitDebug()},trailDebug(){return g.debug()},stretchDebug(){const q=y.stretch();return{arm:q.arm,leg:q.leg,torso:q.torso,impact:q.impact}},swingDebug(){return y.swingDebug()},weaponDebug(){return y.weaponDebug()},gripDebug(){return y.gripDebug()},render(q,Ct){const Tt=q.character,Qt=q.combat;e.hitstop.enabled&&q.hitCount>ke&&Ue<=0&&(Ue=Math.max(0,e.hitstop.duration)),ke=q.hitCount;const Jt=Ue>0;Jt&&(Ue-=Ct),p.position.set(Tt.position.x,Tt.position.y,Tt.position.z),p.rotation.y=Tt.bodyYaw;const le=q.dash.phase==="active"&&q.dash.kind==="roll",ae=le&&q.dash.duration>0?Math.min(1,1-q.dash.timer/q.dash.duration):0;if(_.rotation.x=le?ae*Math.PI*2:0,_.position.y=x-(le?.2*Math.sin(Math.PI*ae):0),Jt||y.update(Tt,Qt,q.playerHurt,Ct,q.abilities.channeling,q.time,q.playerLink,q.turnInPlace),g.update(Jt?0:Ct,Jt?null:y.weaponBlade(),!Jt&&(Qt.phase==="active"||q.playerLink.phase==="active"||le&&q.dash.duration>0)),!Jt)for(let yt=0;yt<v.length;yt++)q.dummies[yt]&&v[yt].update(q.dummies[yt],Ct);const cn=xe.camera.position,Xe=Math.atan2(cn.x-Tt.position.x,cn.z-Tt.position.z),A=q.config.gaze.hurtHoldSec,X=q.time-q.playerHurt.lastAt,nt=A>0&&X>=0&&X<A?1-X/A:0,Q=wb(q.gaze.active,q.gaze.threat,nt,q.time,S);Eb(at,dt,Z,pt,Q.level),k=Lb(Tt.grounded,Tt.position.y,k),N.mesh.position.set(Tt.position.x,k+.028,Tt.position.z),N.update(Q.arcRad,Q.opacity,Q.scale,at,Xe);const $=q.config.abilities.arcane,wt=Math.max(1,Math.floor($.waves)),Pt=Math.max(1e-4,$.waveInterval),Yt=Rb({charging:Qt.charging,charge:Qt.charge,channeling:q.abilities.channeling,fireTimer:q.abilities.fireTimer,fireInterval:Pt,channelProgress:q.abilities.channeling?(q.abilities.waveIndex+(1-Math.min(1,Math.max(0,q.abilities.fireTimer/Pt))))/wt:0,arcaneCooldown:q.abilities.cooldown,arcaneCooldownMax:$.cooldown,dashCooldown:q.dash.cooldown,dashCooldownMax:q.dash.kind==="blink"?q.config.dash.blinkCooldown:q.config.dash.rollCooldown});z.mesh.position.set(Tt.position.x,Tt.position.y+.03,Tt.position.z),z.set(Yt.ratio,Yt.source==="none"?0:S.meterOpacity,Yt.source==="charge"?j:Yt.source==="channel"?Mt:$t,Xe);const Xt=q.playerLink,Ft=Xt.weapon?q.config.links.moves[Xt.weapon]:void 0,Ht=Cb(Xt.phase,Tt.position.x,Tt.position.z,Xt.facing,Xt.travel,(Ft==null?void 0:Ft.hit.radius)??.9);mt.set(Ht.x,Ht.z,.042,Ht.radius,Ht.active?S.landingOpacity:0,q.time);for(let yt=0;yt<L.length;yt++){const vt=q.dummies[yt],te=L[yt],he=D[yt],Nt=W[yt];if(!vt){te.mesh.visible=!1,he.mesh.visible=!1,Nt.mesh.visible=!1;continue}const Ke=q.targeting.hasTarget&&q.targeting.targetId===vt.id;if(Im(q,vt)){const Wn=Fm(q,vt);at.copy(Z).lerp(pt,Wn)}else at.copy(tt);const de=Ab(vt.attackPhase,vt.attackPhaseTimer,q.config.dummies.attackWindup);de.active?(at.lerp(Bt,.5*de.urgency),Nt.mesh.position.set(vt.position.x,vt.position.y+.031,vt.position.z),Nt.set(de.ratio,S.warnOpacity*(.65+.35*de.urgency),Bt,Xe)):Nt.set(0,0,Bt,Xe);const Ae=Ke?1:0,Vn=Ae>B[yt]?S.haloFadeInSec:S.haloFadeOutSec;B[yt]=ru(B[yt],Ae,Ct,Vn);const We=B[yt],Xn=1+.02*We*Math.sin(q.time*2.2+vt.id),we=S.arcDeg+(S.selectedArcDeg-S.arcDeg)*We;te.mesh.position.set(vt.position.x,vt.position.y+.022,vt.position.z),te.update(we*Math.PI/180,S.opacity+(S.selectedOpacity-S.opacity)*We,1+(S.selectedScale-1)*We*Xn,at,Xe,1+(S.selectedThicknessScale-1)*We),U[yt]=ru(U[yt],Ae,Ct,Ae>U[yt]?S.haloFadeInSec:S.haloFadeOutSec);const un=U[yt];he.mesh.position.set(vt.position.x,vt.position.y+.019,vt.position.z),he.update(we*Math.PI/180,S.haloOpacity*un*(.88+.12*Math.sin(q.time*2.2+vt.id)),S.selectedScale*(.94+.06*un)*Xn,at,Xe)}if(jt.position.set(Tt.position.x,Tt.position.y,Tt.position.z),jt.rotation.y=Qt.phase!=="idle"?Qt.attackFacing:Tt.bodyYaw,q.dash.id!==ne){ne=q.dash.id;const yt=q.dash;be=yt.kind,yt.kind==="blink"?(J(yt.fromX,yt.fromZ,Tt.position.y,zt.blinkColor,.9),J(yt.toX,yt.toZ,Tt.position.y,zt.blinkColor,1.35)):J(yt.fromX,yt.fromZ,Tt.position.y,zt.rollColor,1.1)}for(const yt of xt){if(yt.life<=0)continue;yt.life-=Ct;const vt=Math.max(0,yt.life/zt.fxDuration);yt.mat.opacity=.9*vt,yt.mesh.scale.setScalar(yt.base*(.6+(1-vt)*1.2)),yt.life<=0&&(yt.mesh.visible=!1)}const Lt=q.playerLink;Lt.id!==re&&(re=Lt.id,ce=Lt.hitIds.length,Kt(Tt.position.x,Tt.position.z,Tt.position.y,1)),Lt.hitIds.length>ce?(ce=Lt.hitIds.length,Kt(Tt.position.x,Tt.position.z,Tt.position.y,1.35)):Lt.hitIds.length<ce&&(ce=Lt.hitIds.length);for(const yt of bt){if(yt.life<=0)continue;yt.life-=Ct;const vt=Math.max(0,yt.life/Math.max(ot.fxDuration,1e-6));yt.mat.opacity=.85*vt,yt.mesh.scale.setScalar(yt.base*(.55+(1-vt)*1.1)),yt.life<=0&&(yt.mesh.visible=!1)}const oe=ht.slashEnabled&&Qt.phase==="active"&&Qt.comboIndex>=3;Vt.opacity=oe?.7:0,kt.opacity=oe?ht.slashGlowOpacity:0,oe&&(E.rotation.z=-1.2+Qt.attackProgress*3.2,E.scale.setScalar(.9+Qt.comboIndex*.13));for(let yt=0;yt<Gt.length;yt++){const vt=q.abilities.projectiles[yt],te=Gt[yt];te.group.visible=!!vt,vt&&(te.group.position.set(vt.x,vt.y,vt.z),te.group.scale.setScalar(vt.radius),te.group.rotation.set(0,Math.atan2(vt.dirX,vt.dirZ),0))}for(let yt=0;yt<qt.length;yt++){const vt=q.abilities.rings[yt],te=qt[yt];if(!vt){te.group.visible=!1;continue}const he=Math.max(0,Math.min(1,vt.life/Math.max(vt.duration,1e-6))),Nt=Pb(Math.max(0,vt.duration-vt.life),S.areaExpandSec);te.set(vt.x,vt.z,.045,vt.radius*Nt.scale,S.areaOpacity*(.35+.65*he)*Nt.alpha,q.time)}for(let yt=0;yt<ft.length;yt++){const vt=q.arrows[yt],te=ft[yt];if(!vt){te.group.visible=!1,te.bone&&(r.attach(te.group),te.bone=null),te.arrowId=0;continue}const he=vt.stuck&&vt.stuckDummy>=0;if(te.arrowId!==vt.id){if(te.bone&&(r.attach(te.group),te.bone=null),te.arrowId=vt.id,te.group.position.set(vt.x,vt.y,vt.z),te.group.rotation.set(vt.pitch,vt.yaw,0,"YXZ"),he){const Ke=v[vt.stuckDummy],de=Ke?Ke.boneAtWorld(vt.x,vt.y,vt.z):null;de&&(de.node.attach(te.group),te.bone=de.node)}}else te.bone||(te.group.position.set(vt.x,vt.y,vt.z),te.group.rotation.set(vt.pitch,vt.yaw,0,"YXZ"));te.group.visible=!0;const Nt=vt.stuck?Math.min(1,vt.rest/.6):1;te.shaftMat.opacity=Nt,te.tipMat.opacity=Nt,te.glowMat.opacity=(vt.stuck?.28:.85)*Nt,te.trailMat.opacity=vt.stuck?0:ht.trailOpacity*Nt,te.trail.visible=!vt.stuck}xe.update(Tt.position.x,Tt.position.y,Tt.position.z,Ct,q.camera),o.render(r,xe.camera)},resize(){const q=Math.max(1,n.clientWidth),Ct=Math.max(1,n.clientHeight);o.setSize(q,Ct,!1),xe.resize(q/Ct)},getGroundBasis(){return xe.getGroundBasis()},setCollidersVisible(q){for(const Ct of h)Ct.opacity=q?.3:1,Ct.wireframe=q,Ct.needsUpdate=!0},setGridVisible(q){u.visible=q},setLabVisible(q){m.setVisible(q)},setLabLabelsVisible(q){m.setLabelsVisible(q)},snapCamera(q,Ct,Tt){xe.snap(q,Ct,Tt)},setZoom(q){xe.setZoom(q)},pickDummy:je,projectToScreen:Me,diagnostics(){const q=Vf(e.camera.pitchDeg),Ct=kb(q,jt.rotation.y);return{lean:y.lean(),slashNormal:Ct,arrowForward:y.arrowDirection(),gait:{hipYaw:y.hipYaw(),gaitYaw:y.gaitYaw()},attackBlend:y.attackBlend(),attackWeights:y.attackWeights(),landing:y.landing(),hurt:y.hurt(),ik:y.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:_.rotation.x,activeRings:xt.filter(Tt=>Tt.life>0).length,lastKind:be},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...xe.smart()}}},dispose(){y.dispose(),m.dispose();for(const q of v)q.dispose();N.dispose();for(const q of L)q.dispose();for(const q of D)q.dispose();z.dispose(),g.dispose();for(const q of W)q.dispose();mt.dispose(),P.dispose(),Vt.dispose(),kt.dispose(),It.dispose(),gt.dispose(),O.dispose(),st.dispose(),ut.dispose();for(const q of qt)q.dispose();lt.dispose(),it.dispose(),Rt.dispose(),K.dispose();for(const q of ft)q.shaftMat.dispose(),q.tipMat.dispose(),q.glowMat.dispose(),q.trailMat.dispose();ue.dispose(),Zt.dispose();for(const q of xt)q.mat.dispose();F.dispose();for(const q of bt)q.mat.dispose();St.dispose(),f.traverse(q=>{q instanceof ge&&q.geometry.dispose()}),o.dispose(),o.domElement.remove()}}}async function Qb(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function t1(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),s=document.createElement("a");s.href=i,s.download=n,s.rel="noopener",document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function e1(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=x=>e.querySelector(`#${x}`),s=i("diag-status"),a=i("diag-text"),o=i("diag-copy"),r=i("diag-json"),l=i("diag-clear"),c=i("diag-toggle"),h=i("diag-close"),f=i("diag-mask");let d=!1,u=!0,m=0;function y(){const x=n.status();s.textContent=x.enabled?`已记录 ${x.durationS.toFixed(1)}s · ${x.frames} 帧 · 事件 ${x.events} · 异常 ${x.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",c.textContent=x.enabled?"暂停记录":"继续记录"}function g(x){d=x,e.hidden=!x,x?y():a.hidden=!0}function p(x){o.textContent=x,window.clearTimeout(m),m=window.setTimeout(()=>{o.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",x=>{x.preventDefault(),x.stopPropagation(),g(!d)}),h.addEventListener("click",()=>g(!1)),f.addEventListener("click",()=>g(!1)),o.addEventListener("click",()=>{const x=n.summary();Qb(x).then(_=>{_?(p("已复制 ✓"),a.hidden=!0):(a.value=x,a.hidden=!1,a.focus(),a.select(),p("请长按全选复制"))})}),r.addEventListener("click",()=>{const x=n.dump(),_=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);t1(`harness-${x.meta.version}-${_}.json`,JSON.stringify(x)),p("已导出")}),l.addEventListener("click",()=>{n.clear(),a.hidden=!0,y(),p("已清空")}),c.addEventListener("click",()=>{u=!u,n.setEnabled(u),y()}),{tick(){const x=n.status();t==null||t.classList.toggle("is-alert",x.alert),d&&y()},isOpen:()=>d,close:()=>g(!1)}}const n1={intents:{...lu},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function i1(){const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=zm(M0,Ba),i=Jb(n,e,bn,Ba.stations),s=Vm(e),a=tg(t),o=eg(t),r=document.getElementById("version-badge");r&&(r.textContent="v0.9.46 · 11-08 00:46 · 诊断");const l=I=>String(I).padStart(2,"0"),c=new Date,h=g0({meta:{version:"v0.9.46",buildTime:"11-08 00:46",startedAt:`${l(c.getMonth()+1)}-${l(c.getDate())} ${l(c.getHours())}:${l(c.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),f=e1(h,r),d=K0({deadZone:()=>bn.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0});document.addEventListener("visibilitychange",()=>{document.hidden&&h.suspend(800)});const u={timeScale:1,paused:!1,showColliders:bn.showColliders,showGrid:bn.showGrid,showLab:bn.lab.enabled,showLabLabels:bn.lab.showLabels};let m=1;const y=a0({maxRadiusPx:()=>bn.joystick.maxRadiusPx,deadZone:bn.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>bn.zoom}),g=Array.from(document.querySelectorAll(".wp[data-weapon]"));let p=e.combat.weapon;function x(I){if(I===p)return;p=I;const k=ns.indexOf(I)+1;for(const N of g)N.classList.toggle("is-active",Number(N.dataset.weapon)===k);w.refreshWeapon()}let _=n1,v=0;const R=()=>{m=1,i.setZoom(1)},w=I0(e,bn,u,{singleStep:()=>s.singleStep(_.intents),reset:()=>{m=1,s.singleStep({...lu,resetPressed:!0})},resetZoom:R,onToggleColliders:I=>i.setCollidersVisible(I),onToggleGrid:I=>i.setGridVisible(I),onToggleLab:I=>i.setLabVisible(I),onToggleLabLabels:I=>i.setLabLabelsVisible(I)}),S=z0({stations:Ba.stations??[],world:e,view:i,onResetZoom:R});o.register({motion:d,debug:w.gui}),window.addEventListener("resize",()=>i.resize()),window.__harness={world:e,view:i,clock:s,input:y,viewConfig:bn,debug:u,getUserZoom:()=>m,getGestures:()=>_.gestures,getLastGesture:()=>_.lastGesture,telemetry:h,telemetrySummary:()=>h.summary(),dirDebug:d.dirDebug,dirAngles:()=>d.dirDebug.last(),motionDebug:d,speedDebug:()=>d.last(),speedSamples:()=>d.samples(),gaitDebug:()=>i.gaitDebug(),swingDebug:()=>i.swingDebug(),weaponDebug:()=>i.weaponDebug(),gripDebug:()=>i.gripDebug(),lab:{stations:Ba.stations??[],goto:I=>S.goto(I),current:()=>S.current(),recall:()=>S.recall()}};let T=performance.now(),b=60,M=0;function C(I){const k=Math.min((I-T)/1e3,.1);T=I,k>0&&(b=b*.9+1/k*.1);const N=y.sample();N.intents.resetPressed&&(m=1),m=qm(m,N.zoomScale,bn.zoom.min,bn.zoom.max),i.setZoom(m);let L=N.intents.dummyClickId;if(N.tap){const U=i.pickDummy(N.tap.x,N.tap.y);U>0&&(L=U)}L>0&&(v=L),_={...N,intents:{...N.intents,dummyClickId:v}};const D=s.frame(k,_.intents,u.timeScale,u.paused,()=>{const U=e.events;for(let z=0;z<U.length;z++)h.event(U[z],e.time)});D>0&&(v=0),h.sample(e,_,k*1e3,D);for(const U of _.gestures)h.gesture(U);I-M>250&&(M=I,f.tick()),x(e.combat.weapon),i.render(e,k),S.tick(),d.update(e,_,i.getGroundBasis());const B=i.diagnostics();a.update(e,b,D,_,u,{attackBlend:B.attackBlend,attackWeights:B.attackWeights,landing:B.landing,hurt:B.hurt,ik:B.ik,zoom:B.camera.zoom},o.hudCompact()),requestAnimationFrame(C)}requestAnimationFrame(C)}i1();
